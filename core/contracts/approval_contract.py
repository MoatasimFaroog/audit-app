"""
Approval workflow smart contract.
Manages multi-signature approval processes.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class ApprovalWorkflowContract(BaseContract):
    """
    Smart contract for managing approval workflows.
    Enforces multi-signature requirements and approval chains.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "approval_workflow_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for multi-signature approval workflows"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate approval data.

        Args:
            data: Approval data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["transaction_hash", "approver_wallet", "approver_role", "action"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate action
        valid_actions = ["approve", "reject"]
        if data["action"] not in valid_actions:
            return False, f"Invalid action. Must be one of: {', '.join(valid_actions)}"

        # Validate transaction hash format
        if not isinstance(data["transaction_hash"], str) or len(data["transaction_hash"]) < 32:
            return False, "Invalid transaction hash"

        # Validate wallet address
        if not isinstance(data["approver_wallet"], str) or not data["approver_wallet"].startswith("0x"):
            return False, "Invalid wallet address"

        # Validate role
        if not isinstance(data["approver_role"], str) or not data["approver_role"]:
            return False, "Invalid role"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute approval contract.

        Args:
            data: Validated approval data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "transaction_hash": data["transaction_hash"],
                "approver_wallet": data["approver_wallet"],
                "approver_role": data["approver_role"],
                "action": data["action"],
                "comment": data.get("comment", ""),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Approvals don't require additional approvals.

        Args:
            data: Approval data

        Returns:
            Number of required approvals (0)
        """
        return 0

    def validate_approval_chain(self, approvals: List[Dict[str, Any]],
                                 required_roles: List[str],
                                 min_approvals: int) -> tuple[bool, Optional[str]]:
        """
        Validate that approval chain meets requirements.

        Args:
            approvals: List of approval records
            required_roles: Required approver roles
            min_approvals: Minimum number of approvals needed

        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(approvals) < min_approvals:
            return False, f"Insufficient approvals: {len(approvals)}/{min_approvals}"

        # Check for duplicate approvers
        wallet_addresses = [a.get("approver_wallet") for a in approvals]
        if len(wallet_addresses) != len(set(wallet_addresses)):
            return False, "Duplicate approver detected"

        # Verify required roles are present
        approver_roles = [a.get("approver_role") for a in approvals]

        if required_roles:
            # Check if any required role has approved
            has_required_role = any(role in approver_roles for role in required_roles)
            if not has_required_role:
                return False, f"Approval from one of these roles required: {', '.join(required_roles)}"

        # Check that all approvals are "approve" actions
        rejected = [a for a in approvals if a.get("action") == "reject"]
        if rejected:
            return False, "Transaction has been rejected"

        return True, None


class DelegationContract(BaseContract):
    """
    Smart contract for delegation of approval authority.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "delegation_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for delegating approval authority"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate delegation data.

        Args:
            data: Delegation data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["from_wallet", "to_wallet", "role", "start_date", "end_date", "scope"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate dates
        is_valid, error = self.validate_date_format(data["start_date"])
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["end_date"])
        if not is_valid:
            return is_valid, error

        # Validate date range
        from datetime import datetime
        start = datetime.fromisoformat(data["start_date"])
        end = datetime.fromisoformat(data["end_date"])

        if start >= end:
            return False, "End date must be after start date"

        # Validate scope
        valid_scopes = ["all", "module", "transaction_type", "amount_limit"]
        if data["scope"] not in valid_scopes:
            return False, f"Invalid scope. Must be one of: {', '.join(valid_scopes)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute delegation contract.

        Args:
            data: Validated delegation data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "from_wallet": data["from_wallet"],
                "to_wallet": data["to_wallet"],
                "role": data["role"],
                "start_date": data["start_date"],
                "end_date": data["end_date"],
                "scope": data["scope"],
                "scope_details": data.get("scope_details", {}),
                "reason": data.get("reason", ""),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Delegations require approval from higher authority.

        Args:
            data: Delegation data

        Returns:
            Number of required approvals
        """
        return 1

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve delegation.

        Args:
            data: Delegation data

        Returns:
            List of role names
        """
        # Delegation must be approved by supervisor or higher
        role = data.get("role", "")

        role_hierarchy = {
            "Data Entry": ["Chief Accountant", "CFO", "CEO"],
            "Accountant": ["Chief Accountant", "CFO", "CEO"],
            "Chief Accountant": ["CFO", "CEO"],
            "HR Officer": ["HR Manager", "CEO"],
            "HR Manager": ["CEO"],
            "Sales Representative": ["Sales Manager", "CEO"],
            "Sales Manager": ["CEO"],
            "Procurement Officer": ["Procurement Manager", "CEO"],
            "Procurement Manager": ["CEO"],
            "CFO": ["CEO"],
        }

        return role_hierarchy.get(role, ["CEO"])
