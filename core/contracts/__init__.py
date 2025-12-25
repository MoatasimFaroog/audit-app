"""
Smart Contracts module for Web3 Accounting & Audit System.

This module provides smart contracts that define business logic and validation rules
for various operations in the system. All contracts are immutable once deployed
and support versioning.
"""

from .base_contract import BaseContract, ContractResult, ContractValidationError
from .contract_registry import ContractRegistry, get_global_registry
from .accounting_contract import AccountingEntryContract, AccountingAdjustmentContract
from .approval_contract import ApprovalWorkflowContract, DelegationContract
from .hr_contract import EmployeeContract, PayrollContract, LeaveContract
from .sales_contract import SalesInvoiceContract, SalesOrderContract, CustomerContract
from .procurement_contract import (
    PurchaseOrderContract,
    VendorContract,
    GoodsReceivingContract
)
from .audit_contract import (
    AuditTrailContract,
    ComplianceCheckContract,
    AnomalyDetectionContract,
    AuditReportContract
)

__all__ = [
    # Base
    'BaseContract',
    'ContractResult',
    'ContractValidationError',
    'ContractRegistry',
    'get_global_registry',

    # Accounting
    'AccountingEntryContract',
    'AccountingAdjustmentContract',

    # Approval
    'ApprovalWorkflowContract',
    'DelegationContract',

    # HR
    'EmployeeContract',
    'PayrollContract',
    'LeaveContract',

    # Sales
    'SalesInvoiceContract',
    'SalesOrderContract',
    'CustomerContract',

    # Procurement
    'PurchaseOrderContract',
    'VendorContract',
    'GoodsReceivingContract',

    # Audit
    'AuditTrailContract',
    'ComplianceCheckContract',
    'AnomalyDetectionContract',
    'AuditReportContract',
]

__version__ = '1.0.0'


def register_all_contracts(registry: ContractRegistry = None) -> ContractRegistry:
    """
    Register all system contracts with the registry.

    Args:
        registry: Optional existing registry (creates new if None)

    Returns:
        Registry with all contracts registered
    """
    if registry is None:
        registry = get_global_registry()

    # Accounting contracts
    registry.register_contract(AccountingEntryContract())
    registry.register_contract(AccountingAdjustmentContract())

    # Approval contracts
    registry.register_contract(ApprovalWorkflowContract())
    registry.register_contract(DelegationContract())

    # HR contracts
    registry.register_contract(EmployeeContract())
    registry.register_contract(PayrollContract())
    registry.register_contract(LeaveContract())

    # Sales contracts
    registry.register_contract(SalesInvoiceContract())
    registry.register_contract(SalesOrderContract())
    registry.register_contract(CustomerContract())

    # Procurement contracts
    registry.register_contract(PurchaseOrderContract())
    registry.register_contract(VendorContract())
    registry.register_contract(GoodsReceivingContract())

    # Audit contracts (non-disableable)
    registry.register_contract(AuditTrailContract())
    registry.register_contract(ComplianceCheckContract())
    registry.register_contract(AnomalyDetectionContract())
    registry.register_contract(AuditReportContract())

    return registry
