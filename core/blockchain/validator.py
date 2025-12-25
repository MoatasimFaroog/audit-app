"""
Validation engine for blockchain operations.
Ensures integrity and prevents tampering.
"""

from typing import List, Optional, Dict, Any
from .block import Block
from .transaction import Transaction
from .chain import Blockchain


class ValidationError(Exception):
    """Custom exception for validation errors."""
    pass


class BlockchainValidator:
    """
    Validates blockchain operations and ensures integrity.
    """

    @staticmethod
    def validate_transaction(transaction: Transaction) -> tuple[bool, Optional[str]]:
        """
        Validate a transaction before adding to pending pool.

        Args:
            transaction: Transaction to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check required fields
        if not transaction.transaction_id:
            return False, "Transaction ID is required"

        if not transaction.transaction_type:
            return False, "Transaction type is required"

        if not transaction.module:
            return False, "Module is required"

        if not transaction.from_wallet:
            return False, "Wallet address is required"

        if not transaction.signature:
            return False, "Signature is required"

        # Verify hash integrity
        if not transaction.verify_integrity():
            return False, "Transaction hash integrity check failed"

        # Check timestamp validity (prevent future timestamps)
        import time
        if transaction.timestamp > time.time() + 60:  # Allow 60s clock skew
            return False, "Transaction timestamp is in the future"

        # Validate approval requirements
        if transaction.approval_required:
            if transaction.approval_count_required <= 0:
                return False, "Invalid approval count requirement"

            if len(transaction.approvals) > transaction.approval_count_required:
                return False, "Too many approvals"

        return True, None

    @staticmethod
    def validate_block(block: Block, previous_block: Optional[Block] = None) -> tuple[bool, Optional[str]]:
        """
        Validate a block before adding to chain.

        Args:
            block: Block to validate
            previous_block: Previous block in chain

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Verify block integrity
        if not block.verify_integrity():
            return False, "Block hash integrity check failed"

        # Verify previous hash linkage
        if previous_block:
            if block.previous_hash != previous_block.block_hash:
                return False, "Previous hash mismatch"

            if block.index != previous_block.index + 1:
                return False, "Block index mismatch"

        # Genesis block special validation
        if block.index == 0:
            if block.previous_hash != "0":
                return False, "Invalid genesis block previous hash"

        # Validate all transactions in block
        for tx in block.transactions:
            is_valid, error = BlockchainValidator.validate_transaction(tx)
            if not is_valid:
                return False, f"Invalid transaction in block: {error}"

        # Verify merkle root
        if block.merkle_root != block._calculate_merkle_root():
            return False, "Merkle root mismatch"

        return True, None

    @staticmethod
    def validate_chain(blockchain: Blockchain) -> tuple[bool, List[str]]:
        """
        Validate entire blockchain.

        Args:
            blockchain: Blockchain to validate

        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        errors = []

        if not blockchain.chain:
            errors.append("Empty blockchain")
            return False, errors

        # Validate genesis block
        genesis = blockchain.chain[0]
        if genesis.index != 0:
            errors.append("Genesis block index is not 0")

        if genesis.previous_hash != "0":
            errors.append("Genesis block previous hash is not '0'")

        # Validate each block
        for i in range(len(blockchain.chain)):
            block = blockchain.chain[i]
            previous_block = blockchain.chain[i - 1] if i > 0 else None

            is_valid, error = BlockchainValidator.validate_block(block, previous_block)
            if not is_valid:
                errors.append(f"Block {i}: {error}")

        return len(errors) == 0, errors

    @staticmethod
    def validate_approval_chain(transaction: Transaction) -> tuple[bool, Optional[str]]:
        """
        Validate approval chain for a transaction.

        Args:
            transaction: Transaction to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not transaction.approval_required:
            return True, None

        # Check if all required approvals are present
        if len(transaction.approvals) < transaction.approval_count_required:
            return False, f"Insufficient approvals: {len(transaction.approvals)}/{transaction.approval_count_required}"

        # Check for duplicate approvers
        wallet_addresses = [approval['wallet'] for approval in transaction.approvals]
        if len(wallet_addresses) != len(set(wallet_addresses)):
            return False, "Duplicate approver detected"

        # Verify each approval has required fields
        for approval in transaction.approvals:
            if not approval.get('wallet'):
                return False, "Approval missing wallet address"
            if not approval.get('signature'):
                return False, "Approval missing signature"
            if not approval.get('role'):
                return False, "Approval missing role"

        return True, None

    @staticmethod
    def detect_chain_tampering(blockchain: Blockchain) -> Dict[str, Any]:
        """
        Detect any tampering in the blockchain.

        Args:
            blockchain: Blockchain to check

        Returns:
            Dictionary with tampering detection results
        """
        results = {
            "tampered": False,
            "issues": [],
            "checked_blocks": 0,
            "checked_transactions": 0
        }

        for i, block in enumerate(blockchain.chain):
            results["checked_blocks"] += 1

            # Check block hash
            expected_hash = block._calculate_hash()
            if block.block_hash != expected_hash:
                results["tampered"] = True
                results["issues"].append({
                    "type": "block_hash_mismatch",
                    "block_index": i,
                    "expected": expected_hash,
                    "actual": block.block_hash
                })

            # Check previous hash linkage
            if i > 0:
                previous_block = blockchain.chain[i - 1]
                if block.previous_hash != previous_block.block_hash:
                    results["tampered"] = True
                    results["issues"].append({
                        "type": "chain_break",
                        "block_index": i,
                        "expected_previous": previous_block.block_hash,
                        "actual_previous": block.previous_hash
                    })

            # Check transactions
            for tx in block.transactions:
                results["checked_transactions"] += 1

                expected_tx_hash = tx._calculate_hash()
                if tx.transaction_hash != expected_tx_hash:
                    results["tampered"] = True
                    results["issues"].append({
                        "type": "transaction_hash_mismatch",
                        "block_index": i,
                        "transaction_id": tx.transaction_id,
                        "expected": expected_tx_hash,
                        "actual": tx.transaction_hash
                    })

        return results

    @staticmethod
    def validate_transaction_replay(transaction: Transaction, blockchain: Blockchain) -> tuple[bool, Optional[str]]:
        """
        Check if a transaction is a replay attack.

        Args:
            transaction: Transaction to check
            blockchain: Blockchain to check against

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if transaction hash already exists
        existing_tx = blockchain.get_transaction_by_hash(transaction.transaction_hash)
        if existing_tx:
            return False, "Transaction already exists (possible replay attack)"

        # Check if transaction ID already exists
        for block in blockchain.chain:
            for tx in block.transactions:
                if tx.transaction_id == transaction.transaction_id:
                    return False, "Transaction ID already used (possible replay attack)"

        return True, None


class SecurityValidator:
    """
    Additional security validations.
    """

    @staticmethod
    def validate_signature_format(signature: str) -> bool:
        """
        Validate signature format.

        Args:
            signature: Signature to validate

        Returns:
            True if format is valid
        """
        # Basic validation - should be implemented with actual crypto validation
        if not signature or len(signature) < 64:
            return False
        return True

    @staticmethod
    def validate_wallet_address(wallet_address: str) -> bool:
        """
        Validate wallet address format.

        Args:
            wallet_address: Wallet address to validate

        Returns:
            True if format is valid
        """
        # Basic validation - should match Ethereum address format
        if not wallet_address:
            return False

        # Ethereum addresses are 42 characters (0x + 40 hex chars)
        if not wallet_address.startswith('0x'):
            return False

        if len(wallet_address) != 42:
            return False

        # Check if remaining chars are hexadecimal
        try:
            int(wallet_address[2:], 16)
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_timestamp_window(timestamp: float, window_seconds: int = 300) -> bool:
        """
        Validate timestamp is within acceptable window.

        Args:
            timestamp: Timestamp to validate
            window_seconds: Acceptable time window in seconds

        Returns:
            True if timestamp is valid
        """
        import time
        current_time = time.time()

        # Check if timestamp is too far in the past
        if timestamp < current_time - window_seconds:
            return False

        # Check if timestamp is in the future
        if timestamp > current_time + 60:  # Allow 60s clock skew
            return False

        return True
