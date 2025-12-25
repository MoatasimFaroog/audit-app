"""
Audit smart contract for compliance and audit trail management.
This contract cannot be disabled and monitors all system activities.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class AuditTrailContract(BaseContract):
    """
    Smart contract for audit trail recording.
    This contract is non-disableable and records all system activities.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "audit_trail_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Non-disableable audit trail recording contract"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate audit trail data.

        Args:
            data: Audit data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["event_type", "actor_wallet", "action", "target"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate event type
        valid_events = [
            "transaction_created",
            "transaction_approved",
            "transaction_rejected",
            "block_created",
            "permission_changed",
            "role_assigned",
            "login",
            "logout",
            "contract_deployed",
            "settings_changed",
            "report_generated",
            "anomaly_detected"
        ]

        if data["event_type"] not in valid_events:
            return False, f"Invalid event type. Must be one of: {', '.join(valid_events)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute audit trail contract.

        Args:
            data: Validated audit data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "event_type": data["event_type"],
                "actor_wallet": data["actor_wallet"],
                "actor_role": data.get("actor_role", ""),
                "action": data["action"],
                "target": data["target"],
                "target_type": data.get("target_type", ""),
                "result": data.get("result", "success"),
                "details": data.get("details", {}),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Audit trail entries don't require approval.

        Args:
            data: Audit data

        Returns:
            Number of required approvals (0)
        """
        return 0


class ComplianceCheckContract(BaseContract):
    """
    Smart contract for compliance checking against standards.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "compliance_check_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Compliance checking contract for accounting and audit standards"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate compliance check data.

        Args:
            data: Compliance data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["check_type", "standard", "transaction_reference"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate check type
        valid_types = [
            "ifrs_compliance",
            "gaap_compliance",
            "saudi_socpa_compliance",
            "isa_compliance",
            "tax_compliance",
            "segregation_of_duties",
            "approval_chain",
            "double_entry"
        ]

        if data["check_type"] not in valid_types:
            return False, f"Invalid check type. Must be one of: {', '.join(valid_types)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute compliance check contract.

        Args:
            data: Validated compliance data

        Returns:
            Execution result with compliance status
        """
        # This would integrate with the rules engine
        # For now, return structure
        result = ContractResult(
            success=True,
            data={
                "check_type": data["check_type"],
                "standard": data["standard"],
                "transaction_reference": data["transaction_reference"],
                "compliance_status": data.get("compliance_status", "pending"),
                "violations": data.get("violations", []),
                "recommendations": data.get("recommendations", []),
                "checked_by": data.get("checked_by", "system"),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Compliance checks don't require approval.

        Args:
            data: Compliance data

        Returns:
            Number of required approvals (0)
        """
        return 0


class AnomalyDetectionContract(BaseContract):
    """
    Smart contract for detecting anomalies and suspicious activities.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "anomaly_detection_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Anomaly detection contract for identifying suspicious activities"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate anomaly detection data.

        Args:
            data: Anomaly data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["anomaly_type", "severity", "transaction_reference"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate anomaly type
        valid_types = [
            "permission_violation",
            "signature_mismatch",
            "hash_chain_break",
            "unusual_amount",
            "suspicious_timing",
            "duplicate_transaction",
            "unauthorized_access",
            "role_escalation",
            "approval_bypass_attempt"
        ]

        if data["anomaly_type"] not in valid_types:
            return False, f"Invalid anomaly type. Must be one of: {', '.join(valid_types)}"

        # Validate severity
        valid_severities = ["low", "medium", "high", "critical"]
        if data["severity"] not in valid_severities:
            return False, f"Invalid severity. Must be one of: {', '.join(valid_severities)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute anomaly detection contract.

        Args:
            data: Validated anomaly data

        Returns:
            Execution result with anomaly details
        """
        result = ContractResult(
            success=True,
            data={
                "anomaly_type": data["anomaly_type"],
                "severity": data["severity"],
                "transaction_reference": data["transaction_reference"],
                "description": data.get("description", ""),
                "detected_by": data.get("detected_by", "system"),
                "affected_wallet": data.get("affected_wallet", ""),
                "recommended_action": data.get("recommended_action", "investigate"),
                "auto_blocked": data.get("auto_blocked", False),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Critical anomalies may require acknowledgment.

        Args:
            data: Anomaly data

        Returns:
            Number of required approvals
        """
        if data.get("severity") == "critical":
            return 1  # Require auditor acknowledgment

        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can acknowledge anomalies.

        Args:
            data: Anomaly data

        Returns:
            List of role names
        """
        if data.get("severity") in ["high", "critical"]:
            return ["Chief Accountant", "CFO", "CEO"]

        return []


class AuditReportContract(BaseContract):
    """
    Smart contract for audit report generation and certification.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "audit_report_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Audit report generation and certification contract"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate audit report data.

        Args:
            data: Report data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["report_type", "period_start", "period_end", "auditor_wallet"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate dates
        is_valid, error = self.validate_date_format(data["period_start"])
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["period_end"])
        if not is_valid:
            return is_valid, error

        # Validate report type
        valid_types = [
            "financial_audit",
            "compliance_audit",
            "internal_control_audit",
            "operational_audit",
            "it_audit"
        ]

        if data["report_type"] not in valid_types:
            return False, f"Invalid report type. Must be one of: {', '.join(valid_types)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute audit report contract.

        Args:
            data: Validated report data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "report_type": data["report_type"],
                "period_start": data["period_start"],
                "period_end": data["period_end"],
                "auditor_wallet": data["auditor_wallet"],
                "auditor_role": data.get("auditor_role", ""),
                "findings": data.get("findings", []),
                "recommendations": data.get("recommendations", []),
                "opinion": data.get("opinion", ""),
                "status": data.get("status", "draft"),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Audit reports require approval before publication.

        Args:
            data: Report data

        Returns:
            Number of required approvals
        """
        return 1  # CFO or CEO approval

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve audit reports.

        Args:
            data: Report data

        Returns:
            List of role names
        """
        return ["CFO", "CEO"]
