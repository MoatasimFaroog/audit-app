"""
Transaction structure for the blockchain.
Every accounting operation is represented as a transaction.
"""

import time
import uuid
from typing import Dict, Any, Optional
from dataclasses import dataclass, field, asdict
from .hash_utils import HashUtils


@dataclass
class Transaction:
    """
    Represents a single transaction in the blockchain.
    All transactions are immutable once created.
    """

    # Transaction identification
    transaction_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: float = field(default_factory=time.time)
    nonce: int = 0

    # Transaction details
    transaction_type: str = ""  # e.g., "journal_entry", "approval", "hr_transaction"
    module: str = ""  # e.g., "accounting", "hr", "sales"
    contract_name: str = ""  # Smart contract handling this transaction

    # Data payload
    data: Dict[str, Any] = field(default_factory=dict)

    # Wallet & signature
    from_wallet: str = ""  # Wallet address of initiator
    signature: str = ""  # Digital signature

    # Approval chain
    approvals: list = field(default_factory=list)  # List of approval signatures
    approval_required: bool = False
    approval_count_required: int = 0

    # Status
    status: str = "pending"  # pending, approved, rejected, executed

    # Blockchain reference
    previous_transaction_hash: Optional[str] = None
    transaction_hash: Optional[str] = None

    # Metadata
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        """Calculate transaction hash after initialization."""
        if not self.transaction_hash:
            self.transaction_hash = self._calculate_hash()

    def _calculate_hash(self) -> str:
        """
        Calculate SHA-256 hash of the transaction.

        Returns:
            Transaction hash
        """
        # Create deterministic hash from transaction data
        hash_data = {
            'transaction_id': self.transaction_id,
            'timestamp': self.timestamp,
            'nonce': self.nonce,
            'transaction_type': self.transaction_type,
            'module': self.module,
            'contract_name': self.contract_name,
            'data': self.data,
            'from_wallet': self.from_wallet,
            'approvals': self.approvals,
            'approval_required': self.approval_required,
            'approval_count_required': self.approval_count_required,
            'previous_transaction_hash': self.previous_transaction_hash,
        }

        return HashUtils.hash_dict(hash_data)

    def recalculate_hash(self) -> str:
        """
        Recalculate transaction hash.
        Used when transaction is modified (e.g., approvals added).

        Returns:
            New transaction hash
        """
        self.transaction_hash = self._calculate_hash()
        return self.transaction_hash

    def add_approval(self, wallet_address: str, signature: str, role: str) -> bool:
        """
        Add an approval signature to the transaction.

        Args:
            wallet_address: Approver's wallet address
            signature: Digital signature
            role: Approver's role

        Returns:
            True if approval added successfully
        """
        approval = {
            'wallet': wallet_address,
            'signature': signature,
            'role': role,
            'timestamp': time.time()
        }

        self.approvals.append(approval)
        self.recalculate_hash()

        # Update status if all approvals collected
        if len(self.approvals) >= self.approval_count_required:
            self.status = "approved"

        return True

    def is_fully_approved(self) -> bool:
        """
        Check if transaction has all required approvals.

        Returns:
            True if fully approved
        """
        if not self.approval_required:
            return True

        return len(self.approvals) >= self.approval_count_required

    def verify_integrity(self) -> bool:
        """
        Verify transaction hash integrity.

        Returns:
            True if hash is valid
        """
        expected_hash = self._calculate_hash()
        return self.transaction_hash == expected_hash

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert transaction to dictionary.

        Returns:
            Dictionary representation
        """
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Transaction':
        """
        Create transaction from dictionary.

        Args:
            data: Transaction data

        Returns:
            Transaction instance
        """
        return cls(**data)

    def __repr__(self) -> str:
        """String representation of transaction."""
        return (f"Transaction(id={self.transaction_id[:8]}..., "
                f"type={self.transaction_type}, "
                f"module={self.module}, "
                f"status={self.status}, "
                f"hash={self.transaction_hash[:8] if self.transaction_hash else 'None'}...)")


class TransactionBuilder:
    """Builder pattern for creating transactions."""

    def __init__(self):
        """Initialize transaction builder."""
        self._transaction = Transaction()

    def set_type(self, transaction_type: str) -> 'TransactionBuilder':
        """Set transaction type."""
        self._transaction.transaction_type = transaction_type
        return self

    def set_module(self, module: str) -> 'TransactionBuilder':
        """Set module."""
        self._transaction.module = module
        return self

    def set_contract(self, contract_name: str) -> 'TransactionBuilder':
        """Set smart contract."""
        self._transaction.contract_name = contract_name
        return self

    def set_data(self, data: Dict[str, Any]) -> 'TransactionBuilder':
        """Set transaction data."""
        self._transaction.data = data
        return self

    def set_wallet(self, wallet_address: str) -> 'TransactionBuilder':
        """Set initiator wallet."""
        self._transaction.from_wallet = wallet_address
        return self

    def set_signature(self, signature: str) -> 'TransactionBuilder':
        """Set digital signature."""
        self._transaction.signature = signature
        return self

    def set_approval_requirements(self, required: bool, count: int = 0) -> 'TransactionBuilder':
        """Set approval requirements."""
        self._transaction.approval_required = required
        self._transaction.approval_count_required = count
        return self

    def set_previous_hash(self, previous_hash: str) -> 'TransactionBuilder':
        """Set previous transaction hash."""
        self._transaction.previous_transaction_hash = previous_hash
        return self

    def set_metadata(self, metadata: Dict[str, Any]) -> 'TransactionBuilder':
        """Set metadata."""
        self._transaction.metadata = metadata
        return self

    def build(self) -> Transaction:
        """
        Build and return the transaction.

        Returns:
            Constructed transaction
        """
        self._transaction.recalculate_hash()
        return self._transaction
