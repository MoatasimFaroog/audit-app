"""
Merkle Tree implementation for efficient transaction verification.
"""

from typing import List, Optional
from .hash_utils import HashUtils


class MerkleNode:
    """Represents a node in the Merkle tree."""

    def __init__(self, hash_value: str, left: Optional['MerkleNode'] = None,
                 right: Optional['MerkleNode'] = None):
        """
        Initialize a Merkle node.

        Args:
            hash_value: Hash value of the node
            left: Left child node
            right: Right child node
        """
        self.hash = hash_value
        self.left = left
        self.right = right


class MerkleTree:
    """
    Merkle Tree for efficient verification of transaction integrity.
    """

    def __init__(self, transactions: List[str]):
        """
        Build a Merkle tree from a list of transactions.

        Args:
            transactions: List of transaction hashes
        """
        self.transactions = transactions
        self.root = self._build_tree(transactions)

    def _build_tree(self, hashes: List[str]) -> Optional[MerkleNode]:
        """
        Recursively build the Merkle tree.

        Args:
            hashes: List of hashes to build tree from

        Returns:
            Root node of the tree
        """
        if not hashes:
            return None

        if len(hashes) == 1:
            return MerkleNode(hashes[0])

        # Create leaf nodes
        nodes = [MerkleNode(h) for h in hashes]

        # Build tree bottom-up
        while len(nodes) > 1:
            next_level = []

            # Process pairs of nodes
            for i in range(0, len(nodes), 2):
                left = nodes[i]

                # Handle odd number of nodes - duplicate last node
                if i + 1 < len(nodes):
                    right = nodes[i + 1]
                else:
                    right = nodes[i]

                # Combine hashes
                combined_hash = HashUtils.combine_hashes(left.hash, right.hash)
                parent = MerkleNode(combined_hash, left, right)
                next_level.append(parent)

            nodes = next_level

        return nodes[0] if nodes else None

    def get_root_hash(self) -> Optional[str]:
        """
        Get the root hash of the Merkle tree.

        Returns:
            Root hash or None if tree is empty
        """
        return self.root.hash if self.root else None

    def get_proof(self, transaction_hash: str) -> List[tuple]:
        """
        Generate Merkle proof for a transaction.

        Args:
            transaction_hash: Hash of the transaction to prove

        Returns:
            List of (hash, side) tuples forming the proof path
            side is 'left' or 'right' indicating position
        """
        try:
            index = self.transactions.index(transaction_hash)
        except ValueError:
            return []

        proof = []
        hashes = self.transactions.copy()

        while len(hashes) > 1:
            next_level = []
            level_proof = []

            for i in range(0, len(hashes), 2):
                left = hashes[i]
                right = hashes[i + 1] if i + 1 < len(hashes) else hashes[i]

                if i == index or i + 1 == index:
                    # This pair contains our transaction
                    if i == index:
                        level_proof.append((right, 'right'))
                        next_index = i // 2
                    else:
                        level_proof.append((left, 'left'))
                        next_index = i // 2

                combined = HashUtils.combine_hashes(left, right)
                next_level.append(combined)

            if level_proof:
                proof.extend(level_proof)
                index = next_index

            hashes = next_level

        return proof

    @staticmethod
    def verify_proof(transaction_hash: str, proof: List[tuple], root_hash: str) -> bool:
        """
        Verify a Merkle proof.

        Args:
            transaction_hash: Hash of the transaction
            proof: Merkle proof path
            root_hash: Expected root hash

        Returns:
            True if proof is valid, False otherwise
        """
        current_hash = transaction_hash

        for proof_hash, side in proof:
            if side == 'left':
                current_hash = HashUtils.combine_hashes(proof_hash, current_hash)
            else:
                current_hash = HashUtils.combine_hashes(current_hash, proof_hash)

        return current_hash == root_hash

    def __repr__(self) -> str:
        """String representation of the Merkle tree."""
        return f"MerkleTree(transactions={len(self.transactions)}, root={self.get_root_hash()})"
