"""
HR smart contracts for employee and payroll operations.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class EmployeeContract(BaseContract):
    """
    Smart contract for employee management operations.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "employee_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for employee management operations"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate employee data.

        Args:
            data: Employee data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["operation", "employee_id"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        operation = data["operation"]
        valid_operations = ["hire", "terminate", "update", "transfer"]

        if operation not in valid_operations:
            return False, f"Invalid operation. Must be one of: {', '.join(valid_operations)}"

        # Validate based on operation
        if operation == "hire":
            return self._validate_hire(data)
        elif operation == "terminate":
            return self._validate_terminate(data)
        elif operation == "update":
            return self._validate_update(data)
        elif operation == "transfer":
            return self._validate_transfer(data)

        return True, None

    def _validate_hire(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """Validate hire operation."""
        required = ["employee_name", "position", "department", "start_date", "salary"]
        is_valid, error = self.validate_required_fields(data, required)
        if not is_valid:
            return is_valid, error

        # Validate date
        is_valid, error = self.validate_date_format(data["start_date"])
        if not is_valid:
            return is_valid, error

        # Validate salary
        is_valid, error = self.validate_amount(data["salary"])
        if not is_valid:
            return is_valid, error

        return True, None

    def _validate_terminate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """Validate termination operation."""
        required = ["termination_date", "reason"]
        is_valid, error = self.validate_required_fields(data, required)
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["termination_date"])
        if not is_valid:
            return is_valid, error

        return True, None

    def _validate_update(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """Validate update operation."""
        if "salary" in data:
            is_valid, error = self.validate_amount(data["salary"])
            if not is_valid:
                return is_valid, error

        return True, None

    def _validate_transfer(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """Validate transfer operation."""
        required = ["new_department", "transfer_date"]
        is_valid, error = self.validate_required_fields(data, required)
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["transfer_date"])
        if not is_valid:
            return is_valid, error

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute employee contract.

        Args:
            data: Validated employee data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "operation": data["operation"],
                "employee_id": data["employee_id"],
                "details": {k: v for k, v in data.items() if k not in ["operation", "employee_id"]},
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals for HR operations.

        Args:
            data: Employee data

        Returns:
            Number of required approvals
        """
        operation = data.get("operation")

        if operation in ["hire", "terminate"]:
            return 1  # HR Manager approval
        elif operation == "transfer":
            return 1  # HR Manager approval
        elif operation == "update":
            if "salary" in data:
                return 1  # Salary changes require approval
            return 0

        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve HR operations.

        Args:
            data: Employee data

        Returns:
            List of role names
        """
        operation = data.get("operation")

        if operation in ["hire", "terminate", "transfer"]:
            return ["HR Manager", "CEO"]
        elif operation == "update" and "salary" in data:
            return ["HR Manager", "CEO"]

        return []


class PayrollContract(BaseContract):
    """
    Smart contract for payroll processing.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "payroll_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for payroll processing and salary disbursement"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate payroll data.

        Args:
            data: Payroll data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["payroll_period", "employees"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate employees list
        employees = data.get("employees", [])
        if not isinstance(employees, list) or not employees:
            return False, "Employees list is required"

        # Validate each employee entry
        for idx, emp in enumerate(employees):
            is_valid, error = self._validate_employee_payroll(emp, idx)
            if not is_valid:
                return is_valid, error

        return True, None

    def _validate_employee_payroll(self, emp: Dict[str, Any], index: int) -> tuple[bool, Optional[str]]:
        """Validate individual employee payroll entry."""
        required = ["employee_id", "gross_salary"]
        is_valid, error = self.validate_required_fields(emp, required)
        if not is_valid:
            return False, f"Employee {index + 1}: {error}"

        # Validate amounts
        is_valid, error = self.validate_amount(emp["gross_salary"])
        if not is_valid:
            return False, f"Employee {index + 1}: Gross salary - {error}"

        # Validate deductions if present
        if "deductions" in emp:
            total_deductions = sum(emp["deductions"].values())
            if total_deductions > emp["gross_salary"]:
                return False, f"Employee {index + 1}: Deductions exceed gross salary"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute payroll contract.

        Args:
            data: Validated payroll data

        Returns:
            Execution result
        """
        # Calculate totals
        total_gross = 0
        total_deductions = 0
        total_net = 0

        for emp in data["employees"]:
            gross = emp["gross_salary"]
            deductions = sum(emp.get("deductions", {}).values())
            net = gross - deductions

            total_gross += gross
            total_deductions += deductions
            total_net += net

        result = ContractResult(
            success=True,
            data={
                "payroll_period": data["payroll_period"],
                "employee_count": len(data["employees"]),
                "employees": data["employees"],
                "totals": {
                    "gross_salary": total_gross,
                    "total_deductions": total_deductions,
                    "net_salary": total_net
                },
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Payroll always requires approvals.

        Args:
            data: Payroll data

        Returns:
            Number of required approvals
        """
        # Calculate total payroll
        total = sum(emp["gross_salary"] for emp in data.get("employees", []))

        if total > 100000:
            return 2  # HR Manager + CFO
        else:
            return 1  # HR Manager

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve payroll.

        Args:
            data: Payroll data

        Returns:
            List of role names
        """
        total = sum(emp["gross_salary"] for emp in data.get("employees", []))

        if total > 100000:
            return ["HR Manager", "CFO", "CEO"]
        else:
            return ["HR Manager", "CFO"]


class LeaveContract(BaseContract):
    """
    Smart contract for leave management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "leave_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for employee leave requests and approvals"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate leave data.

        Args:
            data: Leave data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["employee_id", "leave_type", "start_date", "end_date"]
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

        if start > end:
            return False, "End date must be after start date"

        # Validate leave type
        valid_types = ["annual", "sick", "emergency", "unpaid", "maternity", "paternity"]
        if data["leave_type"] not in valid_types:
            return False, f"Invalid leave type. Must be one of: {', '.join(valid_types)}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute leave contract.

        Args:
            data: Validated leave data

        Returns:
            Execution result
        """
        from datetime import datetime
        start = datetime.fromisoformat(data["start_date"])
        end = datetime.fromisoformat(data["end_date"])
        days = (end - start).days + 1

        result = ContractResult(
            success=True,
            data={
                "employee_id": data["employee_id"],
                "leave_type": data["leave_type"],
                "start_date": data["start_date"],
                "end_date": data["end_date"],
                "days": days,
                "reason": data.get("reason", ""),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Leave requests require approval.

        Args:
            data: Leave data

        Returns:
            Number of required approvals
        """
        return 1  # HR Manager or direct supervisor

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve leave.

        Args:
            data: Leave data

        Returns:
            List of role names
        """
        return ["HR Manager", "CEO"]
