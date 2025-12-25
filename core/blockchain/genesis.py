"""
Genesis block creation and initialization.
"""

import time
from typing import Dict, Any
from .block import Block, BlockBuilder
from .transaction import Transaction, TransactionBuilder


class GenesisBlockCreator:
    """
    Creates and initializes the genesis block for the blockchain.
    """

    @staticmethod
    def create_genesis_block(system_metadata: Dict[str, Any] = None) -> Block:
        """
        Create the genesis (first) block of the blockchain.

        Args:
            system_metadata: Optional metadata for the genesis block

        Returns:
            Genesis block
        """
        if system_metadata is None:
            system_metadata = {}

        # Default genesis metadata
        default_metadata = {
            "system_name": "Web3 Accounting & Audit System",
            "version": "1.0.0",
            "created_at": time.time(),
            "description": "Genesis Block - Immutable Accounting System on Blockchain",
            "features": [
                "Decentralized Authentication",
                "Multi-Signature Approvals",
                "Audit Trail",
                "Smart Contracts",
                "Immutable Records"
            ],
            "supported_modules": [
                "accounting",
                "hr",
                "sales",
                "procurement",
                "audit"
            ]
        }

        # Merge with provided metadata
        metadata = {**default_metadata, **system_metadata}

        # Create system initialization transaction
        init_transaction = TransactionBuilder() \
            .set_type("system_initialization") \
            .set_module("system") \
            .set_contract("genesis_contract") \
            .set_data({
                "action": "initialize_blockchain",
                "timestamp": time.time(),
                "system_version": "1.0.0"
            }) \
            .set_wallet("0x0000000000000000000000000000000000000000") \
            .set_signature("GENESIS_SIGNATURE") \
            .build()

        # Create genesis block
        genesis_block = BlockBuilder(index=0) \
            .set_previous_hash("0") \
            .set_created_by("SYSTEM") \
            .add_transaction(init_transaction) \
            .set_metadata(metadata) \
            .build()

        return genesis_block

    @staticmethod
    def create_system_configuration_transaction(config: Dict[str, Any]) -> Transaction:
        """
        Create a system configuration transaction for genesis block.

        Args:
            config: System configuration

        Returns:
            Configuration transaction
        """
        return TransactionBuilder() \
            .set_type("system_configuration") \
            .set_module("system") \
            .set_contract("config_contract") \
            .set_data(config) \
            .set_wallet("0x0000000000000000000000000000000000000000") \
            .set_signature("SYSTEM_CONFIG_SIGNATURE") \
            .build()

    @staticmethod
    def create_initial_roles_transaction() -> Transaction:
        """
        Create initial roles configuration transaction.

        Returns:
            Roles transaction
        """
        roles_config = {
            "roles": [
                {"name": "CEO", "level": 1, "description": "Chief Executive Officer"},
                {"name": "CFO", "level": 2, "description": "Chief Financial Officer"},
                {"name": "Chief Accountant", "level": 3, "description": "Chief Accountant"},
                {"name": "Accountant", "level": 4, "description": "Accountant"},
                {"name": "Data Entry", "level": 5, "description": "Data Entry Clerk"},
                {"name": "HR Manager", "level": 3, "description": "Human Resources Manager"},
                {"name": "HR Officer", "level": 4, "description": "Human Resources Officer"},
                {"name": "Sales Manager", "level": 3, "description": "Sales Manager"},
                {"name": "Sales Representative", "level": 4, "description": "Sales Representative"},
                {"name": "Procurement Manager", "level": 3, "description": "Procurement Manager"},
                {"name": "Procurement Officer", "level": 4, "description": "Procurement Officer"},
            ],
            "permissions": {
                "accounting": {
                    "CEO": ["read", "write", "approve", "audit"],
                    "CFO": ["read", "write", "approve", "audit"],
                    "Chief Accountant": ["read", "write", "approve"],
                    "Accountant": ["read", "write"],
                    "Data Entry": ["write"]
                },
                "hr": {
                    "CEO": ["read", "approve", "audit"],
                    "HR Manager": ["read", "write", "approve"],
                    "HR Officer": ["read", "write"]
                },
                "sales": {
                    "CEO": ["read", "approve", "audit"],
                    "CFO": ["read", "approve"],
                    "Sales Manager": ["read", "write", "approve"],
                    "Sales Representative": ["read", "write"]
                },
                "procurement": {
                    "CEO": ["read", "approve", "audit"],
                    "CFO": ["read", "approve"],
                    "Procurement Manager": ["read", "write", "approve"],
                    "Procurement Officer": ["read", "write"]
                },
                "audit": {
                    "CEO": ["read", "audit"],
                    "CFO": ["read", "audit"],
                    "Chief Accountant": ["read", "audit"]
                }
            }
        }

        return TransactionBuilder() \
            .set_type("roles_initialization") \
            .set_module("system") \
            .set_contract("roles_contract") \
            .set_data(roles_config) \
            .set_wallet("0x0000000000000000000000000000000000000000") \
            .set_signature("ROLES_INIT_SIGNATURE") \
            .build()

    @staticmethod
    def create_enriched_genesis_block() -> Block:
        """
        Create an enriched genesis block with system configuration.

        Returns:
            Enriched genesis block
        """
        # System metadata
        metadata = {
            "initialized_at": time.time(),
            "blockchain_type": "private_permissioned",
            "consensus": "multi_signature",
            "encryption": "SHA-256"
        }

        # Create genesis block
        genesis = GenesisBlockCreator.create_genesis_block(metadata)

        # Add system configuration
        config_tx = GenesisBlockCreator.create_system_configuration_transaction({
            "max_block_size": 1000,
            "approval_timeout_hours": 24,
            "signature_algorithm": "ECDSA",
            "hash_algorithm": "SHA-256"
        })
        genesis.add_transaction(config_tx)

        # Add roles configuration
        roles_tx = GenesisBlockCreator.create_initial_roles_transaction()
        genesis.add_transaction(roles_tx)

        # Recalculate hashes
        genesis.recalculate_hash()

        return genesis
