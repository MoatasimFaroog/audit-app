"""
Cryptographic hashing utilities for the blockchain.
Uses SHA-256 for all hashing operations.
"""

import hashlib
import json
from typing import Any, Dict


class HashUtils:
    """Utility class for cryptographic hashing operations."""

    @staticmethod
    def hash_sha256(data: str) -> str:
        """
        Generate SHA-256 hash of the input data.

        Args:
            data: String data to hash

        Returns:
            Hexadecimal hash string
        """
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    @staticmethod
    def hash_dict(data: Dict[str, Any]) -> str:
        """
        Generate SHA-256 hash of a dictionary.
        Ensures deterministic ordering for consistent hashing.

        Args:
            data: Dictionary to hash

        Returns:
            Hexadecimal hash string
        """
        # Sort keys for deterministic hashing
        json_string = json.dumps(data, sort_keys=True, ensure_ascii=False)
        return HashUtils.hash_sha256(json_string)

    @staticmethod
    def hash_list(data_list: list) -> str:
        """
        Generate SHA-256 hash of a list of items.

        Args:
            data_list: List of items to hash

        Returns:
            Hexadecimal hash string
        """
        json_string = json.dumps(data_list, sort_keys=True, ensure_ascii=False)
        return HashUtils.hash_sha256(json_string)

    @staticmethod
    def combine_hashes(*hashes: str) -> str:
        """
        Combine multiple hashes into a single hash.
        Used for creating Merkle tree nodes.

        Args:
            *hashes: Variable number of hash strings

        Returns:
            Combined hash
        """
        combined = ''.join(hashes)
        return HashUtils.hash_sha256(combined)

    @staticmethod
    def verify_hash(data: str, expected_hash: str) -> bool:
        """
        Verify that data matches the expected hash.

        Args:
            data: Original data
            expected_hash: Expected hash value

        Returns:
            True if hash matches, False otherwise
        """
        actual_hash = HashUtils.hash_sha256(data)
        return actual_hash == expected_hash

    @staticmethod
    def verify_dict_hash(data: Dict[str, Any], expected_hash: str) -> bool:
        """
        Verify that dictionary data matches the expected hash.

        Args:
            data: Original dictionary
            expected_hash: Expected hash value

        Returns:
            True if hash matches, False otherwise
        """
        actual_hash = HashUtils.hash_dict(data)
        return actual_hash == expected_hash
