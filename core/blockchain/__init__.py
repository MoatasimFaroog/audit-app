"""
Blockchain module for Web3 Accounting & Audit System.

This module provides the core blockchain functionality including:
- Block and transaction structures
- Chain management and validation
- Merkle tree for efficient verification
- Cryptographic hashing utilities
- Genesis block creation
"""

from .hash_utils import HashUtils
from .merkle_tree import MerkleTree, MerkleNode
from .transaction import Transaction, TransactionBuilder
from .block import Block, BlockBuilder
from .chain import Blockchain
from .validator import BlockchainValidator, ValidationError, SecurityValidator
from .genesis import GenesisBlockCreator

__all__ = [
    'HashUtils',
    'MerkleTree',
    'MerkleNode',
    'Transaction',
    'TransactionBuilder',
    'Block',
    'BlockBuilder',
    'Blockchain',
    'BlockchainValidator',
    'ValidationError',
    'SecurityValidator',
    'GenesisBlockCreator',
]

__version__ = '1.0.0'
