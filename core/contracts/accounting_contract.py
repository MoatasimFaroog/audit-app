"""
Accounting smart contract for journal entries and accounting operations.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class AccountingEntryContract(BaseContract):
    """
    Smart contract for accounting journal entries.
    Enforces double-entry bookkeeping rules.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "accounting_entry_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for processing accounting journal entries with double-entry validation"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate accounting entry data.

        Args:
            data: Entry data containing debits and credits

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Required fields
        required_fields = ["entry_date", "description", "debits", "credits"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate date format
        is_valid, error = self.validate_date_format(data["entry_date"])
        if not is_valid:
            return is_valid, error

        # Validate debits and credits
        debits = data.get("debits", [])
        credits = data.get("credits", [])

        if not isinstance(debits, list) or not isinstance(credits, list):
            return False, "Debits and credits must be lists"

        if not debits or not credits:
            return False, "At least one debit and one credit entry required"

        # Validate each debit entry
        for idx, debit in enumerate(debits):
            is_valid, error = self._validate_entry_line(debit, "debit", idx)
            if not is_valid:
                return is_valid, error

        # Validate each credit entry
        for idx, credit in enumerate(credits):
            is_valid, error = self._validate_entry_line(credit, "credit", idx)
            if not is_valid:
                return is_valid, error

        # Double-entry validation: debits = credits
        total_debits = sum(d.get("amount", 0) for d in debits)
        total_credits = sum(c.get("amount", 0) for c in credits)

        if abs(total_debits - total_credits) > 0.01:  # Allow small floating point differences
            return False, f"Debits ({total_debits}) must equal credits ({total_credits})"

        return True, None

    def _validate_entry_line(self, line: Dict[str, Any], line_type: str, index: int) -> tuple[bool, Optional[str]]:
        """
        Validate a single debit or credit line.

        Args:
            line: Entry line data
            line_type: 'debit' or 'credit'
            index: Line index for error reporting

        Returns:
            Tuple of (is_valid, error_message)
        """
        required = ["account_code", "amount"]
        is_valid, error = self.validate_required_fields(line, required)
        if not is_valid:
            return False, f"{line_type.capitalize()} line {index + 1}: {error}"

        # Validate amount
        is_valid, error = self.validate_amount(line["amount"])
        if not is_valid:
            return False, f"{line_type.capitalize()} line {index + 1}: {error}"

        if line["amount"] == 0:
            return False, f"{line_type.capitalize()} line {index + 1}: Amount cannot be zero"

        # Validate account code format
        account_code = line["account_code"]
        if not isinstance(account_code, str) or not account_code:
            return False, f"{line_type.capitalize()} line {index + 1}: Invalid account code"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute accounting entry contract.

        Args:
            data: Validated entry data

        Returns:
            Execution result
        """
        # Calculate totals
        total_debits = sum(d.get("amount", 0) for d in data["debits"])
        total_credits = sum(c.get("amount", 0) for c in data["credits"])

        result = ContractResult(
            success=True,
            data={
                "entry_type": "journal_entry",
                "entry_date": data["entry_date"],
                "description": data["description"],
                "debits": data["debits"],
                "credits": data["credits"],
                "total_amount": total_debits,
                "balanced": abs(total_debits - total_credits) < 0.01,
                "reference": data.get("reference", ""),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals based on entry amount.

        Args:
            data: Entry data

        Returns:
            Number of required approvals
        """
        total_amount = sum(d.get("amount", 0) for d in data.get("debits", []))

        # Approval thresholds
        if total_amount > 100000:
            return 3  # CFO, Chief Accountant, CEO
        elif total_amount > 50000:
            return 2  # CFO, Chief Accountant
        elif total_amount > 10000:
            return 1  # Chief Accountant
        else:
            return 0  # No approval needed

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve based on amount.

        Args:
            data: Entry data

        Returns:
            List of role names
        """
        total_amount = sum(d.get("amount", 0) for d in data.get("debits", []))

        if total_amount > 100000:
            return ["CEO", "CFO", "Chief Accountant"]
        elif total_amount > 50000:
            return ["CFO", "Chief Accountant"]
        elif total_amount > 10000:
            return ["Chief Accountant"]
        else:
            return []


class AccountingAdjustmentContract(BaseContract):
    """
    Smart contract for accounting adjustments.
    Used for corrections and period-end adjustments.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "accounting_adjustment_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for accounting adjustments and corrections"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate adjustment data.

        Args:
            data: Adjustment data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["adjustment_date", "reason", "adjustment_type", "debits", "credits"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate adjustment type
        valid_types = ["accrual", "deferral", "correction", "reclassification", "depreciation"]
        if data["adjustment_type"] not in valid_types:
            return False, f"Invalid adjustment type. Must be one of: {', '.join(valid_types)}"

        # Validate reason is not empty
        if not data.get("reason", "").strip():
            return False, "Adjustment reason is required"

        # Validate double-entry
        total_debits = sum(d.get("amount", 0) for d in data.get("debits", []))
        total_credits = sum(c.get("amount", 0) for c in data.get("credits", []))

        if abs(total_debits - total_credits) > 0.01:
            return False, f"Debits ({total_debits}) must equal credits ({total_credits})"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute adjustment contract.

        Args:
            data: Validated adjustment data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "entry_type": "adjustment",
                "adjustment_type": data["adjustment_type"],
                "adjustment_date": data["adjustment_date"],
                "reason": data["reason"],
                "debits": data["debits"],
                "credits": data["credits"],
                "original_entry_reference": data.get("original_entry_reference"),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Adjustments always require approval.

        Args:
            data: Adjustment data

        Returns:
            Number of required approvals
        """
        # All adjustments require at least Chief Accountant approval
        return 1

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve adjustments.

        Args:
            data: Adjustment data

        Returns:
            List of role names
        """
        return ["Chief Accountant", "CFO", "CEO"]
