"""
Base smart contract class for all contracts in the system.
Smart contracts define business logic and validation rules.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid


class ContractValidationError(Exception):
    """Exception raised when contract validation fails."""
    pass


class BaseContract(ABC):
    """
    Abstract base class for all smart contracts.
    Contracts are immutable once deployed and versioned.
    """

    def __init__(self, version: str = "1.0.0"):
        """
        Initialize base contract.

        Args:
            version: Contract version
        """
        self.contract_id = str(uuid.uuid4())
        self.version = version
        self.deployed_at = datetime.now().isoformat()
        self.deployed = False
        self.deprecated = False

    @abstractmethod
    def get_name(self) -> str:
        """
        Get contract name.

        Returns:
            Contract name
        """
        pass

    @abstractmethod
    def get_description(self) -> str:
        """
        Get contract description.

        Returns:
            Contract description
        """
        pass

    @abstractmethod
    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate transaction data against contract rules.

        Args:
            data: Transaction data to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        pass

    @abstractmethod
    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute contract logic.

        Args:
            data: Transaction data

        Returns:
            Execution result
        """
        pass

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine number of required approvals based on transaction data.

        Args:
            data: Transaction data

        Returns:
            Number of required approvals
        """
        # Default: no approvals required
        # Override in child contracts for specific logic
        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Determine which roles can approve this transaction.

        Args:
            data: Transaction data

        Returns:
            List of role names
        """
        # Default: any role can approve
        # Override in child contracts
        return []

    def deploy(self) -> bool:
        """
        Deploy the contract (make it active).

        Returns:
            True if deployed successfully
        """
        if self.deployed:
            return False

        self.deployed = True
        return True

    def deprecate(self) -> bool:
        """
        Deprecate this contract version.

        Returns:
            True if deprecated successfully
        """
        if self.deprecated:
            return False

        self.deprecated = True
        return True

    def is_active(self) -> bool:
        """
        Check if contract is active.

        Returns:
            True if contract is deployed and not deprecated
        """
        return self.deployed and not self.deprecated

    def get_metadata(self) -> Dict[str, Any]:
        """
        Get contract metadata.

        Returns:
            Contract metadata dictionary
        """
        return {
            "contract_id": self.contract_id,
            "name": self.get_name(),
            "description": self.get_description(),
            "version": self.version,
            "deployed_at": self.deployed_at,
            "deployed": self.deployed,
            "deprecated": self.deprecated,
            "active": self.is_active()
        }

    def validate_required_fields(self, data: Dict[str, Any], required_fields: List[str]) -> tuple[bool, Optional[str]]:
        """
        Validate that required fields are present in data.

        Args:
            data: Data to validate
            required_fields: List of required field names

        Returns:
            Tuple of (is_valid, error_message)
        """
        missing_fields = []

        for field in required_fields:
            if field not in data or data[field] is None:
                missing_fields.append(field)

        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"

        return True, None

    def validate_field_types(self, data: Dict[str, Any], field_types: Dict[str, type]) -> tuple[bool, Optional[str]]:
        """
        Validate field types.

        Args:
            data: Data to validate
            field_types: Dictionary mapping field names to expected types

        Returns:
            Tuple of (is_valid, error_message)
        """
        for field, expected_type in field_types.items():
            if field in data and data[field] is not None:
                if not isinstance(data[field], expected_type):
                    return False, f"Field '{field}' must be of type {expected_type.__name__}"

        return True, None

    def validate_amount(self, amount: Any) -> tuple[bool, Optional[str]]:
        """
        Validate monetary amount.

        Args:
            amount: Amount to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not isinstance(amount, (int, float)):
            return False, "Amount must be a number"

        if amount < 0:
            return False, "Amount cannot be negative"

        return True, None

    def validate_date_format(self, date_string: str) -> tuple[bool, Optional[str]]:
        """
        Validate date format (ISO 8601).

        Args:
            date_string: Date string to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            datetime.fromisoformat(date_string)
            return True, None
        except (ValueError, TypeError):
            return False, "Invalid date format. Use ISO 8601 format."

    def __repr__(self) -> str:
        """String representation of contract."""
        return f"{self.get_name()}(v{self.version}, active={self.is_active()})"


class ContractResult:
    """
    Standardized result from contract execution.
    """

    def __init__(self, success: bool, data: Dict[str, Any] = None, error: str = None):
        """
        Initialize contract result.

        Args:
            success: Whether execution was successful
            data: Result data
            error: Error message if failed
        """
        self.success = success
        self.data = data or {}
        self.error = error
        self.timestamp = datetime.now().isoformat()

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert to dictionary.

        Returns:
            Dictionary representation
        """
        return {
            "success": self.success,
            "data": self.data,
            "error": self.error,
            "timestamp": self.timestamp
        }

    def __repr__(self) -> str:
        """String representation."""
        status = "SUCCESS" if self.success else "FAILED"
        return f"ContractResult({status})"
