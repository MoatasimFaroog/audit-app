"""
Main application entry point.
Initializes the Web3 Accounting & Audit System.
"""

from .blockchain import Blockchain, GenesisBlockCreator
from .contracts import register_all_contracts, get_global_registry
from .wallet import get_role_manager, get_wallet_authenticator


class Web3AccountingSystem:
    """
    Main system class that initializes and manages all components.
    """

    def __init__(self, storage_path: str = "blockchain_data"):
        """
        Initialize the Web3 Accounting System.

        Args:
            storage_path: Path for blockchain storage
        """
        print("🚀 Initializing Web3 Accounting & Audit System...")

        # Initialize blockchain
        print("📦 Creating blockchain...")
        self.blockchain = Blockchain(storage_path)

        # Register all smart contracts
        print("📜 Registering smart contracts...")
        self.contract_registry = register_all_contracts()

        # Initialize role manager
        print("👥 Initializing role manager...")
        self.role_manager = get_role_manager()

        # Initialize wallet authenticator
        print("🔐 Initializing wallet authentication...")
        self.wallet_authenticator = get_wallet_authenticator()

        print("✅ System initialized successfully!")
        print(f"📊 Blockchain stats: {self.blockchain.get_chain_stats()}")
        print(f"📋 Contracts registered: {self.contract_registry.get_registry_stats()}")

    def get_blockchain(self) -> Blockchain:
        """Get blockchain instance."""
        return self.blockchain

    def get_contract_registry(self):
        """Get contract registry."""
        return self.contract_registry

    def get_role_manager(self):
        """Get role manager."""
        return self.role_manager

    def get_wallet_authenticator(self):
        """Get wallet authenticator."""
        return self.wallet_authenticator


def main():
    """Main entry point."""
    system = Web3AccountingSystem()

    # Print system information
    print("\n" + "="*60)
    print("Web3 Accounting & Audit System")
    print("Decentralized • Immutable • Transparent")
    print("="*60)

    print("\n📌 System Components:")
    print(f"  ✓ Blockchain: {len(system.blockchain.chain)} blocks")
    print(f"  ✓ Contracts: {len(system.contract_registry.get_all_contracts())} registered")
    print(f"  ✓ Roles: {len(system.role_manager.get_all_roles())} defined")

    print("\n🔗 Blockchain Status:")
    stats = system.blockchain.get_chain_stats()
    print(f"  • Total Blocks: {stats['total_blocks']}")
    print(f"  • Total Transactions: {stats['total_transactions']}")
    print(f"  • Pending Transactions: {stats['pending_transactions']}")
    print(f"  • Chain Valid: {stats['chain_valid']}")

    print("\n📜 Available Contracts:")
    for contract_name in system.contract_registry.get_all_contracts():
        contract = system.contract_registry.get_active_contract(contract_name)
        print(f"  • {contract_name} (v{contract.version})")

    print("\n👥 Available Roles:")
    for role_name in system.role_manager.get_all_roles():
        print(f"  • {role_name}")

    print("\n" + "="*60)
    print("System ready for transactions!")
    print("="*60 + "\n")

    return system


if __name__ == "__main__":
    system = main()
