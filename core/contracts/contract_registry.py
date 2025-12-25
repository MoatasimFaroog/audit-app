"""
Contract registry for managing smart contract deployment and versioning.
"""

from typing import Dict, List, Optional, Type
from .base_contract import BaseContract, ContractValidationError


class ContractRegistry:
    """
    Registry for managing smart contracts.
    Handles deployment, versioning, and contract lookup.
    """

    def __init__(self):
        """Initialize contract registry."""
        self._contracts: Dict[str, Dict[str, BaseContract]] = {}  # name -> {version -> contract}
        self._active_contracts: Dict[str, BaseContract] = {}  # name -> contract

    def register_contract(self, contract: BaseContract) -> bool:
        """
        Register a new contract or version.

        Args:
            contract: Contract to register

        Returns:
            True if registered successfully
        """
        contract_name = contract.get_name()

        # Initialize contract name entry if not exists
        if contract_name not in self._contracts:
            self._contracts[contract_name] = {}

        # Check if version already exists
        if contract.version in self._contracts[contract_name]:
            return False

        # Register contract
        self._contracts[contract_name][contract.version] = contract

        # Deploy contract
        contract.deploy()

        # Set as active if no active version exists
        if contract_name not in self._active_contracts:
            self._active_contracts[contract_name] = contract

        return True

    def get_contract(self, name: str, version: Optional[str] = None) -> Optional[BaseContract]:
        """
        Get a contract by name and optionally version.

        Args:
            name: Contract name
            version: Contract version (None for active version)

        Returns:
            Contract instance or None if not found
        """
        if name not in self._contracts:
            return None

        if version:
            return self._contracts[name].get(version)

        # Return active version
        return self._active_contracts.get(name)

    def get_active_contract(self, name: str) -> Optional[BaseContract]:
        """
        Get the active version of a contract.

        Args:
            name: Contract name

        Returns:
            Active contract or None
        """
        return self._active_contracts.get(name)

    def set_active_version(self, name: str, version: str) -> bool:
        """
        Set a specific version as active.

        Args:
            name: Contract name
            version: Version to activate

        Returns:
            True if set successfully
        """
        if name not in self._contracts:
            return False

        if version not in self._contracts[name]:
            return False

        contract = self._contracts[name][version]

        if not contract.is_active():
            return False

        self._active_contracts[name] = contract
        return True

    def deprecate_contract(self, name: str, version: str) -> bool:
        """
        Deprecate a contract version.

        Args:
            name: Contract name
            version: Version to deprecate

        Returns:
            True if deprecated successfully
        """
        if name not in self._contracts:
            return False

        if version not in self._contracts[name]:
            return False

        contract = self._contracts[name][version]
        return contract.deprecate()

    def get_all_versions(self, name: str) -> List[str]:
        """
        Get all versions of a contract.

        Args:
            name: Contract name

        Returns:
            List of version strings
        """
        if name not in self._contracts:
            return []

        return list(self._contracts[name].keys())

    def get_all_contracts(self) -> List[str]:
        """
        Get all registered contract names.

        Returns:
            List of contract names
        """
        return list(self._contracts.keys())

    def validate_transaction(self, contract_name: str, data: Dict) -> tuple[bool, Optional[str]]:
        """
        Validate transaction data against a contract.

        Args:
            contract_name: Name of contract to validate against
            data: Transaction data

        Returns:
            Tuple of (is_valid, error_message)
        """
        contract = self.get_active_contract(contract_name)

        if not contract:
            return False, f"Contract '{contract_name}' not found"

        if not contract.is_active():
            return False, f"Contract '{contract_name}' is not active"

        return contract.validate(data)

    def execute_contract(self, contract_name: str, data: Dict) -> Dict:
        """
        Execute a contract.

        Args:
            contract_name: Name of contract to execute
            data: Transaction data

        Returns:
            Execution result

        Raises:
            ContractValidationError: If validation fails
        """
        contract = self.get_active_contract(contract_name)

        if not contract:
            raise ContractValidationError(f"Contract '{contract_name}' not found")

        if not contract.is_active():
            raise ContractValidationError(f"Contract '{contract_name}' is not active")

        # Validate before execution
        is_valid, error = contract.validate(data)
        if not is_valid:
            raise ContractValidationError(error)

        # Execute contract
        return contract.execute(data)

    def get_contract_metadata(self, name: str, version: Optional[str] = None) -> Optional[Dict]:
        """
        Get metadata for a contract.

        Args:
            name: Contract name
            version: Contract version (None for active)

        Returns:
            Metadata dictionary or None
        """
        contract = self.get_contract(name, version)

        if not contract:
            return None

        return contract.get_metadata()

    def get_registry_stats(self) -> Dict:
        """
        Get registry statistics.

        Returns:
            Statistics dictionary
        """
        total_contracts = 0
        active_contracts = len(self._active_contracts)
        deprecated_count = 0

        for versions in self._contracts.values():
            total_contracts += len(versions)
            for contract in versions.values():
                if contract.deprecated:
                    deprecated_count += 1

        return {
            "total_contracts": total_contracts,
            "unique_contracts": len(self._contracts),
            "active_contracts": active_contracts,
            "deprecated_contracts": deprecated_count
        }

    def __repr__(self) -> str:
        """String representation."""
        stats = self.get_registry_stats()
        return f"ContractRegistry(contracts={stats['unique_contracts']}, active={stats['active_contracts']})"


# Global contract registry instance
_global_registry = ContractRegistry()


def get_global_registry() -> ContractRegistry:
    """
    Get the global contract registry.

    Returns:
        Global registry instance
    """
    return _global_registry
