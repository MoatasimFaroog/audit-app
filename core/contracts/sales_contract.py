"""
Sales smart contracts for sales operations and invoicing.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class SalesInvoiceContract(BaseContract):
    """
    Smart contract for sales invoice creation and management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "sales_invoice_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for sales invoice processing"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate sales invoice data.

        Args:
            data: Invoice data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["invoice_date", "customer_id", "items"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate date
        is_valid, error = self.validate_date_format(data["invoice_date"])
        if not is_valid:
            return is_valid, error

        # Validate items
        items = data.get("items", [])
        if not isinstance(items, list) or not items:
            return False, "At least one item is required"

        # Validate each item
        for idx, item in enumerate(items):
            is_valid, error = self._validate_item(item, idx)
            if not is_valid:
                return is_valid, error

        return True, None

    def _validate_item(self, item: Dict[str, Any], index: int) -> tuple[bool, Optional[str]]:
        """Validate invoice item."""
        required = ["description", "quantity", "unit_price"]
        is_valid, error = self.validate_required_fields(item, required)
        if not is_valid:
            return False, f"Item {index + 1}: {error}"

        # Validate quantity
        quantity = item.get("quantity")
        if not isinstance(quantity, (int, float)) or quantity <= 0:
            return False, f"Item {index + 1}: Quantity must be greater than zero"

        # Validate unit price
        is_valid, error = self.validate_amount(item["unit_price"])
        if not is_valid:
            return False, f"Item {index + 1}: Unit price - {error}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute sales invoice contract.

        Args:
            data: Validated invoice data

        Returns:
            Execution result
        """
        # Calculate totals
        subtotal = 0
        for item in data["items"]:
            item_total = item["quantity"] * item["unit_price"]
            item["total"] = item_total
            subtotal += item_total

        # Calculate tax
        tax_rate = data.get("tax_rate", 0.15)  # Default 15%
        tax_amount = subtotal * tax_rate

        # Calculate total
        total = subtotal + tax_amount
        discount = data.get("discount", 0)
        final_total = total - discount

        result = ContractResult(
            success=True,
            data={
                "invoice_date": data["invoice_date"],
                "customer_id": data["customer_id"],
                "items": data["items"],
                "subtotal": subtotal,
                "tax_rate": tax_rate,
                "tax_amount": tax_amount,
                "discount": discount,
                "total": final_total,
                "payment_terms": data.get("payment_terms", "Net 30"),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals based on invoice amount.

        Args:
            data: Invoice data

        Returns:
            Number of required approvals
        """
        # Calculate total
        subtotal = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if subtotal > 50000:
            return 1  # Sales Manager approval
        else:
            return 0  # No approval needed

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve invoices.

        Args:
            data: Invoice data

        Returns:
            List of role names
        """
        subtotal = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if subtotal > 50000:
            return ["Sales Manager", "CEO"]
        else:
            return []


class SalesOrderContract(BaseContract):
    """
    Smart contract for sales order management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "sales_order_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for sales order processing"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate sales order data.

        Args:
            data: Order data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["order_date", "customer_id", "items", "delivery_date"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate dates
        is_valid, error = self.validate_date_format(data["order_date"])
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["delivery_date"])
        if not is_valid:
            return is_valid, error

        # Validate delivery date is after order date
        from datetime import datetime
        order_date = datetime.fromisoformat(data["order_date"])
        delivery_date = datetime.fromisoformat(data["delivery_date"])

        if delivery_date < order_date:
            return False, "Delivery date cannot be before order date"

        # Validate items
        items = data.get("items", [])
        if not isinstance(items, list) or not items:
            return False, "At least one item is required"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute sales order contract.

        Args:
            data: Validated order data

        Returns:
            Execution result
        """
        # Calculate order total
        total = sum(item["quantity"] * item["unit_price"] for item in data["items"])

        result = ContractResult(
            success=True,
            data={
                "order_date": data["order_date"],
                "customer_id": data["customer_id"],
                "items": data["items"],
                "delivery_date": data["delivery_date"],
                "delivery_address": data.get("delivery_address", ""),
                "order_total": total,
                "status": "pending",
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals for sales orders.

        Args:
            data: Order data

        Returns:
            Number of required approvals
        """
        total = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if total > 100000:
            return 1  # Sales Manager approval
        else:
            return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve sales orders.

        Args:
            data: Order data

        Returns:
            List of role names
        """
        total = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if total > 100000:
            return ["Sales Manager", "CEO"]
        else:
            return []


class CustomerContract(BaseContract):
    """
    Smart contract for customer management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "customer_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for customer management operations"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate customer data.

        Args:
            data: Customer data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["operation", "customer_id"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        operation = data["operation"]
        valid_operations = ["create", "update", "credit_limit"]

        if operation not in valid_operations:
            return False, f"Invalid operation. Must be one of: {', '.join(valid_operations)}"

        if operation == "create":
            required = ["customer_name", "email", "phone"]
            is_valid, error = self.validate_required_fields(data, required)
            if not is_valid:
                return is_valid, error

        elif operation == "credit_limit":
            required = ["new_credit_limit", "reason"]
            is_valid, error = self.validate_required_fields(data, required)
            if not is_valid:
                return is_valid, error

            is_valid, error = self.validate_amount(data["new_credit_limit"])
            if not is_valid:
                return is_valid, error

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute customer contract.

        Args:
            data: Validated customer data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "operation": data["operation"],
                "customer_id": data["customer_id"],
                "details": {k: v for k, v in data.items() if k not in ["operation", "customer_id"]},
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals.

        Args:
            data: Customer data

        Returns:
            Number of required approvals
        """
        operation = data.get("operation")

        if operation == "credit_limit":
            credit_limit = data.get("new_credit_limit", 0)
            if credit_limit > 50000:
                return 1  # Sales Manager approval

        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve.

        Args:
            data: Customer data

        Returns:
            List of role names
        """
        operation = data.get("operation")

        if operation == "credit_limit":
            return ["Sales Manager", "CFO", "CEO"]

        return []
