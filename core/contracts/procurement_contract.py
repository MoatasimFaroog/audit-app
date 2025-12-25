"""
Procurement smart contracts for purchase orders and vendor management.
"""

from typing import Dict, Any, Optional, List
from .base_contract import BaseContract, ContractResult


class PurchaseOrderContract(BaseContract):
    """
    Smart contract for purchase order management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "purchase_order_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for purchase order processing"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate purchase order data.

        Args:
            data: Purchase order data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["po_date", "vendor_id", "items", "delivery_date"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate dates
        is_valid, error = self.validate_date_format(data["po_date"])
        if not is_valid:
            return is_valid, error

        is_valid, error = self.validate_date_format(data["delivery_date"])
        if not is_valid:
            return is_valid, error

        # Validate items
        items = data.get("items", [])
        if not isinstance(items, list) or not items:
            return False, "At least one item is required"

        for idx, item in enumerate(items):
            is_valid, error = self._validate_item(item, idx)
            if not is_valid:
                return is_valid, error

        return True, None

    def _validate_item(self, item: Dict[str, Any], index: int) -> tuple[bool, Optional[str]]:
        """Validate purchase order item."""
        required = ["description", "quantity", "unit_price"]
        is_valid, error = self.validate_required_fields(item, required)
        if not is_valid:
            return False, f"Item {index + 1}: {error}"

        # Validate quantity
        if not isinstance(item["quantity"], (int, float)) or item["quantity"] <= 0:
            return False, f"Item {index + 1}: Quantity must be greater than zero"

        # Validate unit price
        is_valid, error = self.validate_amount(item["unit_price"])
        if not is_valid:
            return False, f"Item {index + 1}: {error}"

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute purchase order contract.

        Args:
            data: Validated PO data

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
        tax_rate = data.get("tax_rate", 0.15)
        tax_amount = subtotal * tax_rate

        # Total
        total = subtotal + tax_amount

        result = ContractResult(
            success=True,
            data={
                "po_date": data["po_date"],
                "vendor_id": data["vendor_id"],
                "items": data["items"],
                "delivery_date": data["delivery_date"],
                "delivery_address": data.get("delivery_address", ""),
                "subtotal": subtotal,
                "tax_rate": tax_rate,
                "tax_amount": tax_amount,
                "total": total,
                "payment_terms": data.get("payment_terms", "Net 30"),
                "status": "pending",
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals based on PO amount.

        Args:
            data: Purchase order data

        Returns:
            Number of required approvals
        """
        total = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if total > 100000:
            return 2  # Procurement Manager + CFO
        elif total > 50000:
            return 1  # Procurement Manager
        elif total > 10000:
            return 1  # Procurement Manager
        else:
            return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve purchase orders.

        Args:
            data: Purchase order data

        Returns:
            List of role names
        """
        total = sum(item["quantity"] * item["unit_price"] for item in data.get("items", []))

        if total > 100000:
            return ["Procurement Manager", "CFO", "CEO"]
        elif total > 10000:
            return ["Procurement Manager", "CEO"]
        else:
            return []


class VendorContract(BaseContract):
    """
    Smart contract for vendor management.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "vendor_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for vendor management operations"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate vendor data.

        Args:
            data: Vendor data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["operation", "vendor_id"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        operation = data["operation"]
        valid_operations = ["create", "update", "activate", "deactivate"]

        if operation not in valid_operations:
            return False, f"Invalid operation. Must be one of: {', '.join(valid_operations)}"

        if operation == "create":
            required = ["vendor_name", "email", "phone", "address"]
            is_valid, error = self.validate_required_fields(data, required)
            if not is_valid:
                return is_valid, error

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute vendor contract.

        Args:
            data: Validated vendor data

        Returns:
            Execution result
        """
        result = ContractResult(
            success=True,
            data={
                "operation": data["operation"],
                "vendor_id": data["vendor_id"],
                "details": {k: v for k, v in data.items() if k not in ["operation", "vendor_id"]},
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Determine required approvals.

        Args:
            data: Vendor data

        Returns:
            Number of required approvals
        """
        operation = data.get("operation")

        if operation in ["create", "activate", "deactivate"]:
            return 1  # Procurement Manager approval

        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve vendor operations.

        Args:
            data: Vendor data

        Returns:
            List of role names
        """
        return ["Procurement Manager", "CEO"]


class GoodsReceivingContract(BaseContract):
    """
    Smart contract for goods receiving and verification.
    """

    def get_name(self) -> str:
        """Get contract name."""
        return "goods_receiving_contract"

    def get_description(self) -> str:
        """Get contract description."""
        return "Smart contract for goods receiving and verification"

    def validate(self, data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        """
        Validate goods receiving data.

        Args:
            data: Receiving data

        Returns:
            Tuple of (is_valid, error_message)
        """
        required_fields = ["po_reference", "receiving_date", "items"]
        is_valid, error = self.validate_required_fields(data, required_fields)
        if not is_valid:
            return is_valid, error

        # Validate date
        is_valid, error = self.validate_date_format(data["receiving_date"])
        if not is_valid:
            return is_valid, error

        # Validate items
        items = data.get("items", [])
        if not isinstance(items, list) or not items:
            return False, "At least one item is required"

        for idx, item in enumerate(items):
            is_valid, error = self._validate_received_item(item, idx)
            if not is_valid:
                return is_valid, error

        return True, None

    def _validate_received_item(self, item: Dict[str, Any], index: int) -> tuple[bool, Optional[str]]:
        """Validate received item."""
        required = ["item_id", "quantity_ordered", "quantity_received"]
        is_valid, error = self.validate_required_fields(item, required)
        if not is_valid:
            return False, f"Item {index + 1}: {error}"

        qty_ordered = item.get("quantity_ordered", 0)
        qty_received = item.get("quantity_received", 0)

        if qty_received < 0:
            return False, f"Item {index + 1}: Received quantity cannot be negative"

        if qty_received > qty_ordered:
            # Allow over-receiving but flag it
            item["over_received"] = True

        return True, None

    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute goods receiving contract.

        Args:
            data: Validated receiving data

        Returns:
            Execution result
        """
        # Check if all items fully received
        fully_received = all(
            item["quantity_received"] >= item["quantity_ordered"]
            for item in data["items"]
        )

        # Check for discrepancies
        discrepancies = [
            item for item in data["items"]
            if item["quantity_received"] != item["quantity_ordered"]
        ]

        result = ContractResult(
            success=True,
            data={
                "po_reference": data["po_reference"],
                "receiving_date": data["receiving_date"],
                "items": data["items"],
                "fully_received": fully_received,
                "has_discrepancies": len(discrepancies) > 0,
                "discrepancy_count": len(discrepancies),
                "notes": data.get("notes", ""),
                "metadata": data.get("metadata", {})
            }
        )

        return result.to_dict()

    def get_required_approvals(self, data: Dict[str, Any]) -> int:
        """
        Goods receiving requires approval if discrepancies exist.

        Args:
            data: Receiving data

        Returns:
            Number of required approvals
        """
        # Check for discrepancies
        discrepancies = [
            item for item in data.get("items", [])
            if item.get("quantity_received", 0) != item.get("quantity_ordered", 0)
        ]

        if discrepancies:
            return 1  # Procurement Manager approval for discrepancies

        return 0

    def get_required_roles(self, data: Dict[str, Any]) -> List[str]:
        """
        Get roles that can approve goods receiving.

        Args:
            data: Receiving data

        Returns:
            List of role names
        """
        return ["Procurement Manager", "CEO"]
