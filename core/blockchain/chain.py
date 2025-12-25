"""
Blockchain chain management.
Manages the entire blockchain and provides validation.
"""

import json
import time
from typing import List, Optional, Dict, Any
from pathlib import Path
from .block import Block, BlockBuilder
from .transaction import Transaction
from .hash_utils import HashUtils


class Blockchain:
    """
    Main blockchain class managing the entire chain.
    """

    def __init__(self, storage_path: Optional[str] = None):
        """
        Initialize blockchain.

        Args:
            storage_path: Path to store blockchain data
        """
        self.chain: List[Block] = []
        self.pending_transactions: List[Transaction] = []
        self.storage_path = Path(storage_path) if storage_path else Path("blockchain_data")
        self.storage_path.mkdir(parents=True, exist_ok=True)

        # Create genesis block if chain is empty
        if not self.chain:
            self._create_genesis_block()

    def _create_genesis_block(self) -> Block:
        """
        Create the genesis (first) block in the blockchain.

        Returns:
            Genesis block
        """
        genesis_block = BlockBuilder(index=0) \
            .set_previous_hash("0") \
            .set_created_by("SYSTEM") \
            .set_metadata({
                "description": "Genesis Block - Web3 Accounting & Audit System",
                "created_at": time.time(),
                "version": "1.0.0"
            }) \
            .build()

        self.chain.append(genesis_block)
        self._save_block(genesis_block)
        return genesis_block

    def get_latest_block(self) -> Block:
        """
        Get the most recent block in the chain.

        Returns:
            Latest block
        """
        return self.chain[-1]

    def add_transaction(self, transaction: Transaction) -> bool:
        """
        Add a transaction to the pending transactions pool.

        Args:
            transaction: Transaction to add

        Returns:
            True if added successfully
        """
        # Verify transaction integrity
        if not transaction.verify_integrity():
            return False

        # Link to previous transaction if exists
        if self.pending_transactions:
            last_tx = self.pending_transactions[-1]
            transaction.previous_transaction_hash = last_tx.transaction_hash
            transaction.recalculate_hash()

        self.pending_transactions.append(transaction)
        return True

    def create_block(self, created_by: str, max_transactions: Optional[int] = None) -> Optional[Block]:
        """
        Create a new block from pending transactions.

        Args:
            created_by: Wallet address of block creator
            max_transactions: Maximum transactions per block (None = all)

        Returns:
            New block or None if no pending transactions
        """
        if not self.pending_transactions:
            return None

        # Get transactions for this block
        transactions = self.pending_transactions[:max_transactions] if max_transactions else self.pending_transactions

        # Filter only approved/executable transactions
        valid_transactions = [
            tx for tx in transactions
            if tx.status in ["approved", "executed"] or not tx.approval_required
        ]

        if not valid_transactions:
            return None

        # Create new block
        latest_block = self.get_latest_block()
        new_block = BlockBuilder(index=latest_block.index + 1) \
            .set_previous_hash(latest_block.block_hash) \
            .set_created_by(created_by) \
            .add_transactions(valid_transactions) \
            .build()

        # Add block to chain
        if self.add_block(new_block):
            # Remove processed transactions from pending pool
            for tx in valid_transactions:
                if tx in self.pending_transactions:
                    self.pending_transactions.remove(tx)
            return new_block

        return None

    def add_block(self, block: Block) -> bool:
        """
        Add a new block to the blockchain.

        Args:
            block: Block to add

        Returns:
            True if added successfully
        """
        # Verify block integrity
        if not block.verify_integrity():
            return False

        # Verify previous hash matches
        latest_block = self.get_latest_block()
        if block.previous_hash != latest_block.block_hash:
            return False

        # Verify block index
        if block.index != latest_block.index + 1:
            return False

        # Add block to chain
        self.chain.append(block)
        self._save_block(block)
        return True

    def verify_chain(self) -> bool:
        """
        Verify the entire blockchain integrity.

        Returns:
            True if chain is valid
        """
        if not self.chain:
            return False

        # Verify genesis block
        genesis = self.chain[0]
        if genesis.index != 0 or genesis.previous_hash != "0":
            return False

        # Verify each block
        for i in range(len(self.chain)):
            block = self.chain[i]

            # Verify block integrity
            if not block.verify_integrity():
                return False

            # Verify chain linkage (skip genesis)
            if i > 0:
                previous_block = self.chain[i - 1]
                if block.previous_hash != previous_block.block_hash:
                    return False
                if block.index != previous_block.index + 1:
                    return False

        return True

    def get_block_by_index(self, index: int) -> Optional[Block]:
        """
        Get block by its index.

        Args:
            index: Block index

        Returns:
            Block or None if not found
        """
        if 0 <= index < len(self.chain):
            return self.chain[index]
        return None

    def get_block_by_hash(self, block_hash: str) -> Optional[Block]:
        """
        Get block by its hash.

        Args:
            block_hash: Block hash

        Returns:
            Block or None if not found
        """
        for block in self.chain:
            if block.block_hash == block_hash:
                return block
        return None

    def get_transaction_by_hash(self, transaction_hash: str) -> Optional[Transaction]:
        """
        Find transaction by its hash across all blocks.

        Args:
            transaction_hash: Transaction hash

        Returns:
            Transaction or None if not found
        """
        for block in self.chain:
            for tx in block.transactions:
                if tx.transaction_hash == transaction_hash:
                    return tx
        return None

    def get_transactions_by_wallet(self, wallet_address: str) -> List[Transaction]:
        """
        Get all transactions initiated by a wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            List of transactions
        """
        transactions = []
        for block in self.chain:
            for tx in block.transactions:
                if tx.from_wallet == wallet_address:
                    transactions.append(tx)
        return transactions

    def get_transactions_by_module(self, module: str) -> List[Transaction]:
        """
        Get all transactions from a specific module.

        Args:
            module: Module name

        Returns:
            List of transactions
        """
        transactions = []
        for block in self.chain:
            transactions.extend(block.get_transactions_by_module(module))
        return transactions

    def get_transactions_by_type(self, transaction_type: str) -> List[Transaction]:
        """
        Get all transactions of a specific type.

        Args:
            transaction_type: Transaction type

        Returns:
            List of transactions
        """
        transactions = []
        for block in self.chain:
            transactions.extend(block.get_transactions_by_type(transaction_type))
        return transactions

    def get_chain_stats(self) -> Dict[str, Any]:
        """
        Get blockchain statistics.

        Returns:
            Statistics dictionary
        """
        total_transactions = sum(block.get_transaction_count() for block in self.chain)

        return {
            "total_blocks": len(self.chain),
            "total_transactions": total_transactions,
            "pending_transactions": len(self.pending_transactions),
            "latest_block_index": self.get_latest_block().index,
            "latest_block_hash": self.get_latest_block().block_hash,
            "chain_valid": self.verify_chain(),
            "genesis_block_timestamp": self.chain[0].timestamp if self.chain else None
        }

    def _save_block(self, block: Block) -> None:
        """
        Save block to storage.

        Args:
            block: Block to save
        """
        block_file = self.storage_path / f"block_{block.index}.json"
        with open(block_file, 'w', encoding='utf-8') as f:
            json.dump(block.to_dict(), f, indent=2, ensure_ascii=False)

    def load_chain(self) -> bool:
        """
        Load blockchain from storage.

        Returns:
            True if loaded successfully
        """
        try:
            # Clear current chain
            self.chain = []

            # Find all block files
            block_files = sorted(self.storage_path.glob("block_*.json"),
                                 key=lambda x: int(x.stem.split('_')[1]))

            if not block_files:
                # No blocks found, create genesis
                self._create_genesis_block()
                return True

            # Load each block
            for block_file in block_files:
                with open(block_file, 'r', encoding='utf-8') as f:
                    block_data = json.load(f)
                    block = Block.from_dict(block_data)
                    self.chain.append(block)

            # Verify loaded chain
            return self.verify_chain()

        except Exception as e:
            print(f"Error loading blockchain: {e}")
            return False

    def export_chain(self, output_file: str) -> bool:
        """
        Export entire blockchain to a single file.

        Args:
            output_file: Output file path

        Returns:
            True if exported successfully
        """
        try:
            chain_data = {
                "version": "1.0.0",
                "exported_at": time.time(),
                "stats": self.get_chain_stats(),
                "blocks": [block.to_dict() for block in self.chain]
            }

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(chain_data, f, indent=2, ensure_ascii=False)

            return True

        except Exception as e:
            print(f"Error exporting blockchain: {e}")
            return False

    def __repr__(self) -> str:
        """String representation of blockchain."""
        return f"Blockchain(blocks={len(self.chain)}, pending_tx={len(self.pending_transactions)})"
