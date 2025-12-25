"""
Signature verification utilities for wallet authentication.
Verifies digital signatures from Ethereum wallets.
"""

from typing import Optional, Dict, Any
import hashlib
import json
from eth_account.messages import encode_defunct
from eth_account import Account


class SignatureVerifier:
    """
    Verifies digital signatures from Ethereum wallets.
    """

    @staticmethod
    def verify_signature(message: str, signature: str, wallet_address: str) -> bool:
        """
        Verify that a message was signed by the specified wallet.

        Args:
            message: Original message that was signed
            signature: Signature to verify
            wallet_address: Expected wallet address of signer

        Returns:
            True if signature is valid
        """
        try:
            # Encode message for verification
            message_hash = encode_defunct(text=message)

            # Recover the address from the signature
            recovered_address = Account.recover_message(message_hash, signature=signature)

            # Compare addresses (case-insensitive)
            return recovered_address.lower() == wallet_address.lower()

        except Exception as e:
            print(f"Signature verification error: {e}")
            return False

    @staticmethod
    def verify_transaction_signature(transaction_data: Dict[str, Any],
                                      signature: str,
                                      wallet_address: str) -> bool:
        """
        Verify signature for transaction data.

        Args:
            transaction_data: Transaction data dictionary
            signature: Signature to verify
            wallet_address: Expected signer's wallet address

        Returns:
            True if signature is valid
        """
        try:
            # Create deterministic message from transaction data
            message = SignatureVerifier.create_signing_message(transaction_data)

            # Verify signature
            return SignatureVerifier.verify_signature(message, signature, wallet_address)

        except Exception as e:
            print(f"Transaction signature verification error: {e}")
            return False

    @staticmethod
    def create_signing_message(data: Dict[str, Any]) -> str:
        """
        Create a deterministic message from data for signing.

        Args:
            data: Data dictionary

        Returns:
            Deterministic message string
        """
        # Sort keys for deterministic output
        json_string = json.dumps(data, sort_keys=True, ensure_ascii=False)

        # Create message hash
        message_hash = hashlib.sha256(json_string.encode('utf-8')).hexdigest()

        # Format message for signing
        message = f"Web3 Accounting System\nTransaction Hash: {message_hash}"

        return message

    @staticmethod
    def verify_approval_signature(transaction_hash: str,
                                   action: str,
                                   signature: str,
                                   wallet_address: str) -> bool:
        """
        Verify approval signature for a transaction.

        Args:
            transaction_hash: Hash of transaction being approved
            action: Approval action ('approve' or 'reject')
            signature: Signature to verify
            wallet_address: Approver's wallet address

        Returns:
            True if signature is valid
        """
        # Create approval message
        message = f"Approval Action\nTransaction: {transaction_hash}\nAction: {action}"

        return SignatureVerifier.verify_signature(message, signature, wallet_address)

    @staticmethod
    def extract_wallet_address(signature: str, message: str) -> Optional[str]:
        """
        Extract wallet address from a signature.

        Args:
            signature: Signature
            message: Original message

        Returns:
            Wallet address or None if extraction fails
        """
        try:
            message_hash = encode_defunct(text=message)
            recovered_address = Account.recover_message(message_hash, signature=signature)
            return recovered_address

        except Exception as e:
            print(f"Address extraction error: {e}")
            return None


class NonceManager:
    """
    Manages nonces to prevent replay attacks.
    """

    def __init__(self):
        """Initialize nonce manager."""
        self._nonces: Dict[str, set] = {}  # wallet_address -> set of used nonces

    def generate_nonce(self) -> str:
        """
        Generate a new nonce.

        Returns:
            Nonce string
        """
        import uuid
        import time

        return f"{time.time()}-{uuid.uuid4()}"

    def use_nonce(self, wallet_address: str, nonce: str) -> bool:
        """
        Mark a nonce as used for a wallet.

        Args:
            wallet_address: Wallet address
            nonce: Nonce to mark as used

        Returns:
            True if nonce was unused (and now marked as used)
            False if nonce was already used
        """
        wallet_address = wallet_address.lower()

        if wallet_address not in self._nonces:
            self._nonces[wallet_address] = set()

        if nonce in self._nonces[wallet_address]:
            return False  # Nonce already used (replay attack)

        self._nonces[wallet_address].add(nonce)
        return True

    def is_nonce_valid(self, wallet_address: str, nonce: str) -> bool:
        """
        Check if a nonce is valid (not yet used).

        Args:
            wallet_address: Wallet address
            nonce: Nonce to check

        Returns:
            True if nonce is valid
        """
        wallet_address = wallet_address.lower()

        if wallet_address not in self._nonces:
            return True

        return nonce not in self._nonces[wallet_address]

    def clear_old_nonces(self, max_age_seconds: int = 3600):
        """
        Clear nonces older than specified age.
        Helps prevent memory growth.

        Args:
            max_age_seconds: Maximum age for nonces in seconds
        """
        import time

        current_time = time.time()

        for wallet_address in self._nonces:
            # Extract timestamp from nonce format "timestamp-uuid"
            valid_nonces = set()

            for nonce in self._nonces[wallet_address]:
                try:
                    nonce_timestamp = float(nonce.split('-')[0])
                    if current_time - nonce_timestamp < max_age_seconds:
                        valid_nonces.add(nonce)
                except (ValueError, IndexError):
                    # Keep nonces with invalid format (for safety)
                    valid_nonces.add(nonce)

            self._nonces[wallet_address] = valid_nonces


# Global nonce manager instance
_global_nonce_manager = NonceManager()


def get_nonce_manager() -> NonceManager:
    """
    Get the global nonce manager instance.

    Returns:
        Global nonce manager
    """
    return _global_nonce_manager
