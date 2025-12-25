"""
Example usage of the Web3 Accounting & Audit System.
Demonstrates core functionality including transactions, approvals, and blockchain operations.
"""

from core.main import Web3AccountingSystem
from core.blockchain import TransactionBuilder
from core.contracts import get_global_registry
from core.wallet import get_role_manager
import time


def example_1_system_initialization():
    """Example 1: Initialize the system."""
    print("\n" + "="*60)
    print("EXAMPLE 1: System Initialization")
    print("="*60)

    system = Web3AccountingSystem()
    return system


def example_2_register_users(system: Web3AccountingSystem):
    """Example 2: Register users and assign roles."""
    print("\n" + "="*60)
    print("EXAMPLE 2: Register Users and Assign Roles")
    print("="*60)

    role_manager = system.get_role_manager()

    # Register sample users
    users = [
        ("0x1234567890123456789012345678901234567890", "CEO"),
        ("0x2345678901234567890123456789012345678901", "CFO"),
        ("0x3456789012345678901234567890123456789012", "Chief Accountant"),
        ("0x4567890123456789012345678901234567890123", "Accountant"),
    ]

    for wallet, role in users:
        success = role_manager.assign_role(wallet, role)
        print(f"✓ Assigned {role} to {wallet[:10]}... : {success}")


def example_3_create_accounting_entry(system: Web3AccountingSystem):
    """Example 3: Create an accounting journal entry."""
    print("\n" + "="*60)
    print("EXAMPLE 3: Create Accounting Journal Entry")
    print("="*60)

    # Create transaction data
    entry_data = {
        "entry_date": "2025-12-25",
        "description": "Purchase of office equipment",
        "reference": "INV-2025-001",
        "debits": [
            {
                "account_code": "1500",  # Equipment
                "account_name": "Office Equipment",
                "amount": 5000.00
            }
        ],
        "credits": [
            {
                "account_code": "1000",  # Cash
                "account_name": "Cash",
                "amount": 5000.00
            }
        ]
    }

    # Validate against contract
    contract_registry = system.get_contract_registry()
    is_valid, error = contract_registry.validate_transaction("accounting_entry_contract", entry_data)

    if is_valid:
        print("✓ Transaction data is valid")

        # Execute contract
        result = contract_registry.execute_contract("accounting_entry_contract", entry_data)
        print(f"✓ Contract executed successfully")
        print(f"  Total Amount: ${result['data']['total_amount']}")
        print(f"  Balanced: {result['data']['balanced']}")

        # Create blockchain transaction
        accountant_wallet = "0x4567890123456789012345678901234567890123"
        transaction = TransactionBuilder() \
            .set_type("journal_entry") \
            .set_module("accounting") \
            .set_contract("accounting_entry_contract") \
            .set_data(entry_data) \
            .set_wallet(accountant_wallet) \
            .set_signature("EXAMPLE_SIGNATURE_" + str(time.time())) \
            .set_approval_requirements(False, 0) \
            .build()

        # Add to blockchain
        system.blockchain.add_transaction(transaction)
        print(f"✓ Transaction added to pending pool")
        print(f"  Transaction Hash: {transaction.transaction_hash[:16]}...")

        return transaction
    else:
        print(f"✗ Validation failed: {error}")
        return None


def example_4_create_block(system: Web3AccountingSystem):
    """Example 4: Create a block from pending transactions."""
    print("\n" + "="*60)
    print("EXAMPLE 4: Create Block")
    print("="*60)

    ceo_wallet = "0x1234567890123456789012345678901234567890"

    # Create block
    block = system.blockchain.create_block(created_by=ceo_wallet)

    if block:
        print(f"✓ Block created successfully")
        print(f"  Block Index: {block.index}")
        print(f"  Transactions: {block.get_transaction_count()}")
        print(f"  Block Hash: {block.block_hash[:16]}...")
        print(f"  Previous Hash: {block.previous_hash[:16]}...")
        print(f"  Merkle Root: {block.merkle_root[:16] if block.merkle_root else 'N/A'}...")
        return block
    else:
        print("✗ No pending transactions to create block")
        return None


def example_5_verify_blockchain(system: Web3AccountingSystem):
    """Example 5: Verify blockchain integrity."""
    print("\n" + "="*60)
    print("EXAMPLE 5: Verify Blockchain Integrity")
    print("="*60)

    is_valid = system.blockchain.verify_chain()
    print(f"Chain Valid: {'✓ YES' if is_valid else '✗ NO'}")

    stats = system.blockchain.get_chain_stats()
    print(f"\nBlockchain Statistics:")
    print(f"  • Total Blocks: {stats['total_blocks']}")
    print(f"  • Total Transactions: {stats['total_transactions']}")
    print(f"  • Pending Transactions: {stats['pending_transactions']}")
    print(f"  • Latest Block: #{stats['latest_block_index']}")


def example_6_high_value_transaction(system: Web3AccountingSystem):
    """Example 6: Create high-value transaction requiring approvals."""
    print("\n" + "="*60)
    print("EXAMPLE 6: High-Value Transaction with Approvals")
    print("="*60)

    # Create high-value transaction
    entry_data = {
        "entry_date": "2025-12-25",
        "description": "Large asset purchase",
        "reference": "PO-2025-100",
        "debits": [
            {
                "account_code": "1800",
                "account_name": "Machinery",
                "amount": 150000.00
            }
        ],
        "credits": [
            {
                "account_code": "2100",
                "account_name": "Accounts Payable",
                "amount": 150000.00
            }
        ]
    }

    # Validate
    contract_registry = system.get_contract_registry()
    is_valid, error = contract_registry.validate_transaction("accounting_entry_contract", entry_data)

    if is_valid:
        print("✓ Transaction data is valid")

        # Execute contract to get approval requirements
        result = contract_registry.execute_contract("accounting_entry_contract", entry_data)
        contract = contract_registry.get_active_contract("accounting_entry_contract")
        required_approvals = contract.get_required_approvals(entry_data)
        required_roles = contract.get_required_roles(entry_data)

        print(f"✓ Contract executed")
        print(f"  Amount: ${result['data']['total_amount']:,.2f}")
        print(f"  Required Approvals: {required_approvals}")
        print(f"  Required Roles: {', '.join(required_roles)}")

        # Create transaction
        accountant_wallet = "0x4567890123456789012345678901234567890123"
        transaction = TransactionBuilder() \
            .set_type("journal_entry") \
            .set_module("accounting") \
            .set_contract("accounting_entry_contract") \
            .set_data(entry_data) \
            .set_wallet(accountant_wallet) \
            .set_signature("EXAMPLE_SIGNATURE_HIGH_VALUE") \
            .set_approval_requirements(True, required_approvals) \
            .build()

        print(f"✓ Transaction created (pending approval)")
        print(f"  Transaction Hash: {transaction.transaction_hash[:16]}...")
        print(f"  Status: {transaction.status}")

        # Simulate approvals
        print(f"\n  Simulating approval process...")

        # CFO approval
        cfo_wallet = "0x2345678901234567890123456789012345678901"
        transaction.add_approval(cfo_wallet, "CFO_SIGNATURE_1", "CFO")
        print(f"    ✓ CFO approved")

        # Chief Accountant approval
        chief_wallet = "0x3456789012345678901234567890123456789012"
        transaction.add_approval(chief_wallet, "CHIEF_ACC_SIGNATURE_1", "Chief Accountant")
        print(f"    ✓ Chief Accountant approved")

        # CEO approval
        ceo_wallet = "0x1234567890123456789012345678901234567890"
        transaction.add_approval(ceo_wallet, "CEO_SIGNATURE_1", "CEO")
        print(f"    ✓ CEO approved")

        print(f"\n✓ Transaction fully approved")
        print(f"  Approvals: {len(transaction.approvals)}/{transaction.approval_count_required}")
        print(f"  Status: {transaction.status}")

        # Add to blockchain
        system.blockchain.add_transaction(transaction)
        print(f"✓ Transaction added to blockchain pending pool")

        return transaction
    else:
        print(f"✗ Validation failed: {error}")
        return None


def example_7_query_transactions(system: Web3AccountingSystem):
    """Example 7: Query transactions from blockchain."""
    print("\n" + "="*60)
    print("EXAMPLE 7: Query Transactions")
    print("="*60)

    # Get all accounting transactions
    accounting_txs = system.blockchain.get_transactions_by_module("accounting")
    print(f"Accounting Transactions: {len(accounting_txs)}")

    for tx in accounting_txs:
        print(f"\n  Transaction: {tx.transaction_hash[:16]}...")
        print(f"    Type: {tx.transaction_type}")
        print(f"    From: {tx.from_wallet[:10]}...")
        print(f"    Status: {tx.status}")
        print(f"    Approvals: {len(tx.approvals)}")


def main():
    """Run all examples."""
    print("\n" + "="*80)
    print("WEB3 ACCOUNTING & AUDIT SYSTEM - USAGE EXAMPLES")
    print("="*80)

    # Example 1: Initialize
    system = example_1_system_initialization()

    # Example 2: Register users
    example_2_register_users(system)

    # Example 3: Create simple transaction
    tx1 = example_3_create_accounting_entry(system)

    # Example 4: Create block
    example_4_create_block(system)

    # Example 5: Verify blockchain
    example_5_verify_blockchain(system)

    # Example 6: High-value transaction with approvals
    tx2 = example_6_high_value_transaction(system)

    # Create another block for approved transaction
    if tx2:
        print("\n" + "="*60)
        print("Creating block for approved transaction...")
        print("="*60)
        block = system.blockchain.create_block("0x1234567890123456789012345678901234567890")
        if block:
            print(f"✓ Block {block.index} created with {block.get_transaction_count()} transactions")

    # Example 7: Query transactions
    example_7_query_transactions(system)

    # Final verification
    example_5_verify_blockchain(system)

    print("\n" + "="*80)
    print("ALL EXAMPLES COMPLETED SUCCESSFULLY!")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
