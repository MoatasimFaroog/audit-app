"""
Merkle Tree Implementation
Provides efficient verification of transaction integrity in blocks
"""

import hashlib
from typing import List, Optional, Tuple
from dataclasses import dataclass


@dataclass
class MerkleNode:
    """Node in Merkle tree"""
    hash: str
    left: Optional['MerkleNode'] = None
    right: Optional['MerkleNode'] = None
    
    def is_leaf(self) -> bool:
        """Check if node is a leaf"""
        return self.left is None and self.right is None


class MerkleTree:
    """
    Merkle Tree for efficient transaction verification
    Allows proving a transaction is in a block without revealing all transactions
    """
    
    def __init__(self, transaction_hashes: List[str]):
        """
        Build Merkle tree from transaction hashes
        """
        if not transaction_hashes:
            self.root = None
            self.leaves = []
            return
        
        # Create leaf nodes
        self.leaves = [MerkleNode(hash=tx_hash) for tx_hash in transaction_hashes]
        
        # Build tree
        self.root = self._build_tree(self.leaves)
    
    def _build_tree(self, nodes: List[MerkleNode]) -> MerkleNode:
        """
        Recursively build Merkle tree
        """
        if len(nodes) == 1:
            return nodes[0]
        
        # If odd number of nodes, duplicate last one
        if len(nodes) % 2 == 1:
            nodes.append(nodes[-1])
        
        # Create parent nodes
        parent_nodes = []
        for i in range(0, len(nodes), 2):
            left = nodes[i]
            right = nodes[i + 1]
            
            # Combine hashes
            combined = left.hash + right.hash
            parent_hash = hashlib.sha256(combined.encode()).hexdigest()
            
            parent = MerkleNode(hash=parent_hash, left=left, right=right)
            parent_nodes.append(parent)
        
        return self._build_tree(parent_nodes)
    
    def get_root_hash(self) -> Optional[str]:
        """Get Merkle root hash"""
        return self.root.hash if self.root else None
    
    def get_proof(self, transaction_hash: str) -> Optional[List[Tuple[str, str]]]:
        """
        Get Merkle proof for a transaction
        Returns list of (hash, position) tuples where position is 'left' or 'right'
        Returns None if transaction not found
        """
        # Find leaf index
        leaf_index = None
        for i, leaf in enumerate(self.leaves):
            if leaf.hash == transaction_hash:
                leaf_index = i
                break
        
        if leaf_index is None:
            return None
        
        proof = []
        current_nodes = self.leaves[:]
        current_index = leaf_index
        
        # Build proof by traversing up the tree
        while len(current_nodes) > 1:
            # Handle odd number of nodes
            if len(current_nodes) % 2 == 1:
                current_nodes.append(current_nodes[-1])
            
            # Get sibling
            if current_index % 2 == 0:
                # Current is left, sibling is right
                sibling_index = current_index + 1
                position = 'right'
            else:
                # Current is right, sibling is left
                sibling_index = current_index - 1
                position = 'left'
            
            sibling_hash = current_nodes[sibling_index].hash
            proof.append((sibling_hash, position))
            
            # Move to parent level
            parent_nodes = []
            for i in range(0, len(current_nodes), 2):
                left = current_nodes[i]
                right = current_nodes[i + 1]
                combined = left.hash + right.hash
                parent_hash = hashlib.sha256(combined.encode()).hexdigest()
                parent_nodes.append(MerkleNode(hash=parent_hash))
            
            current_nodes = parent_nodes
            current_index = current_index // 2
        
        return proof
    
    @staticmethod
    def verify_proof(transaction_hash: str, proof: List[Tuple[str, str]], root_hash: str) -> bool:
        """
        Verify a Merkle proof
        Returns True if transaction is in the tree with given root
        """
        current_hash = transaction_hash
        
        for sibling_hash, position in proof:
            if position == 'left':
                combined = sibling_hash + current_hash
            else:
                combined = current_hash + sibling_hash
            
            current_hash = hashlib.sha256(combined.encode()).hexdigest()
        
        return current_hash == root_hash
    
    def get_tree_height(self) -> int:
        """Get height of the tree"""
        if not self.root:
            return 0
        
        def _get_height(node: Optional[MerkleNode]) -> int:
            if node is None or node.is_leaf():
                return 1
            return 1 + max(_get_height(node.left), _get_height(node.right))
        
        return _get_height(self.root)
    
    def get_all_hashes(self) -> List[str]:
        """Get all hashes in the tree (for debugging)"""
        if not self.root:
            return []
        
        hashes = []
        
        def _traverse(node: Optional[MerkleNode]):
            if node:
                hashes.append(node.hash)
                _traverse(node.left)
                _traverse(node.right)
        
        _traverse(self.root)
        return hashes
    
    def visualize(self) -> str:
        """
        Create a text visualization of the tree
        """
        if not self.root:
            return "Empty tree"
        
        lines = []
        
        def _visualize_node(node: Optional[MerkleNode], prefix: str = "", is_tail: bool = True):
            if node is None:
                return
            
            lines.append(prefix + ("└── " if is_tail else "├── ") + node.hash[:16] + "...")
            
            if not node.is_leaf():
                extension = "    " if is_tail else "│   "
                if node.left:
                    _visualize_node(node.left, prefix + extension, False)
                if node.right:
                    _visualize_node(node.right, prefix + extension, True)
        
        _visualize_node(self.root)
        return "\n".join(lines)


def calculate_merkle_root(transaction_hashes: List[str]) -> Optional[str]:
    """
    Utility function to calculate Merkle root from transaction hashes
    """
    if not transaction_hashes:
        return None
    
    tree = MerkleTree(transaction_hashes)
    return tree.get_root_hash()
