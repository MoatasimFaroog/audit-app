"""
Block structure for the blockchain.
Each block contains multiple transactions and is linked to the previous block.
"""

import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field, asdict
from .transaction import Transaction
from .merkle_tree import MerkleTree
from .hash_utils import HashUtils


@dataclass
class Block:
    """
    Represents a single block in the blockchain.
    Blocks are immutable once added to the chain.
    """

    # Block identification
    index: int
    timestamp: float = field(default_factory=time.time)
    nonce: int = 0

    # Transactions
    transactions: List[Transaction] = field(default_factory=list)

    # Hashing
    previous_hash: str = ""
    merkle_root: Optional[str] = None
    block_hash: Optional[str] = None

    # Block metadata
    created_by: str = ""  # Wallet address of block creator
    version: str = "1.0.0"
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        """Calculate block hash and merkle root after initialization."""
        if not self.merkle_root and self.transactions:
            self.merkle_root = self._calculate_merkle_root()
        if not self.block_hash:
            self.block_hash = self._calculate_hash()

    def _calculate_merkle_root(self) -> Optional[str]:
        """
        Calculate Merkle root of all transactions in the block.

        Returns:
            Merkle root hash or None if no transactions
        """
        if not self.transactions:
            return None

        transaction_hashes = [tx.transaction_hash for tx in self.transactions if tx.transaction_hash]

        if not transaction_hashes:
            return None

        merkle_tree = MerkleTree(transaction_hashes)
        return merkle_tree.get_root_hash()

    def _calculate_hash(self) -> str:
        """
        Calculate SHA-256 hash of the block.

        Returns:
            Block hash
        """
        hash_data = {
            'index': self.index,
            'timestamp': self.timestamp,
            'nonce': self.nonce,
            'previous_hash': self.previous_hash,
            'merkle_root': self.merkle_root,
            'created_by': self.created_by,
            'version': self.version,
            'transaction_count': len(self.transactions)
        }

        return HashUtils.hash_dict(hash_data)

    def recalculate_hash(self) -> str:
        """
        Recalculate block hash.
        Used during block mining process.

        Returns:
            New block hash
        """
        self.merkle_root = self._calculate_merkle_root()
        self.block_hash = self._calculate_hash()
        return self.block_hash

    def add_transaction(self, transaction: Transaction) -> bool:
        """
        Add a transaction to the block.

        Args:
            transaction: Transaction to add

        Returns:
            True if added successfully
        """
        # Verify transaction integrity
        if not transaction.verify_integrity():
            return False

        self.transactions.append(transaction)
        self.recalculate_hash()
        return True

    def verify_integrity(self) -> bool:
        """
        Verify block integrity.
        Checks hash validity and transaction integrity.

        Returns:
            True if block is valid
        """
        # Verify block hash
        expected_hash = self._calculate_hash()
        if self.block_hash != expected_hash:
            return False

        # Verify merkle root
        expected_merkle = self._calculate_merkle_root()
        if self.merkle_root != expected_merkle:
            return False

        # Verify all transactions
        for tx in self.transactions:
            if not tx.verify_integrity():
                return False

        return True

    def verify_transaction_inclusion(self, transaction_hash: str) -> bool:
        """
        Verify that a transaction is included in this block.

        Args:
            transaction_hash: Hash of the transaction to verify

        Returns:
            True if transaction is in the block
        """
        if not self.transactions:
            return False

        transaction_hashes = [tx.transaction_hash for tx in self.transactions if tx.transaction_hash]
        merkle_tree = MerkleTree(transaction_hashes)

        proof = merkle_tree.get_proof(transaction_hash)
        return MerkleTree.verify_proof(transaction_hash, proof, self.merkle_root)

    def get_transaction_count(self) -> int:
        """
        Get number of transactions in the block.

        Returns:
            Transaction count
        """
        return len(self.transactions)

    def get_transactions_by_type(self, transaction_type: str) -> List[Transaction]:
        """
        Get all transactions of a specific type.

        Args:
            transaction_type: Type of transactions to retrieve

        Returns:
            List of matching transactions
        """
        return [tx for tx in self.transactions if tx.transaction_type == transaction_type]

    def get_transactions_by_module(self, module: str) -> List[Transaction]:
        """
        Get all transactions from a specific module.

        Args:
            module: Module name

        Returns:
            List of matching transactions
        """
        return [tx for tx in self.transactions if tx.module == module]

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert block to dictionary.

        Returns:
            Dictionary representation
        """
        data = asdict(self)
        # Convert transaction objects to dicts
        data['transactions'] = [tx.to_dict() for tx in self.transactions]
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Block':
        """
        Create block from dictionary.

        Args:
            data: Block data

        Returns:
            Block instance
        """
        # Convert transaction dicts to objects
        transactions_data = data.pop('transactions', [])
        transactions = [Transaction.from_dict(tx) for tx in transactions_data]

        block = cls(**data)
        block.transactions = transactions
        return block

    def __repr__(self) -> str:
        """String representation of block."""
        return (f"Block(index={self.index}, "
                f"transactions={len(self.transactions)}, "
                f"previous_hash={self.previous_hash[:8]}..., "
                f"hash={self.block_hash[:8] if self.block_hash else 'None'}...)")


class BlockBuilder:
    """Builder pattern for creating blocks."""

    def __init__(self, index: int):
        """
        Initialize block builder.

        Args:
            index: Block index in the chain
        """
        self._block = Block(index=index)

    def set_previous_hash(self, previous_hash: str) -> 'BlockBuilder':
        """Set previous block hash."""
        self._block.previous_hash = previous_hash
        return self

    def set_created_by(self, wallet_address: str) -> 'BlockBuilder':
        """Set block creator."""
        self._block.created_by = wallet_address
        return self

    def add_transaction(self, transaction: Transaction) -> 'BlockBuilder':
        """Add a transaction to the block."""
        self._block.add_transaction(transaction)
        return self

    def add_transactions(self, transactions: List[Transaction]) -> 'BlockBuilder':
        """Add multiple transactions to the block."""
        for tx in transactions:
            self._block.add_transaction(tx)
        return self

    def set_metadata(self, metadata: Dict[str, Any]) -> 'BlockBuilder':
        """Set block metadata."""
        self._block.metadata = metadata
        return self

    def build(self) -> Block:
        """
        Build and return the block.

        Returns:
            Constructed block
        """
        self._block.recalculate_hash()
        return self._block
