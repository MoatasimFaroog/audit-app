"""
Transaction Module - Core blockchain transaction implementation
Handles all transaction operations with immutability and cryptographic security
"""

import hashlib
import json
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field, asdict
from enum import Enum


class TransactionType(Enum):
    """Transaction types for different business operations"""
    ACCOUNTING_ENTRY = "accounting_entry"
    APPROVAL = "approval"
    HR_OPERATION = "hr_operation"
    SALES_OPERATION = "sales_operation"
    PROCUREMENT_OPERATION = "procurement_operation"
    ROLE_ASSIGNMENT = "role_assignment"
    CONTRACT_DEPLOYMENT = "contract_deployment"
    AUDIT_LOG = "audit_log"


class TransactionStatus(Enum):
    """Transaction lifecycle status"""
    PENDING = "pending"
    AWAITING_APPROVAL = "awaiting_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    INCLUDED_IN_BLOCK = "included_in_block"
    FINALIZED = "finalized"


@dataclass
class Signature:
    """Digital signature for transaction verification"""
    wallet_address: str
    signature: str
    timestamp: float
    role: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Transaction:
    """
    Immutable transaction record
    Every business operation becomes a blockchain transaction
    """
    transaction_id: str
    transaction_type: TransactionType
    from_address: str  # Wallet address of initiator
    to_address: Optional[str]  # Target wallet/contract address
    data: Dict[str, Any]  # Transaction payload
    timestamp: float
    nonce: int  # Prevent replay attacks
    signatures: List[Signature] = field(default_factory=list)
    required_signatures: int = 1
    status: TransactionStatus = TransactionStatus.PENDING
    contract_address: Optional[str] = None
    previous_transaction_hash: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        """Ensure transaction type is enum"""
        if isinstance(self.transaction_type, str):
            self.transaction_type = TransactionType(self.transaction_type)
        if isinstance(self.status, str):
            self.status = TransactionStatus(self.status)
    
    def calculate_hash(self) -> str:
        """
        Calculate SHA-256 hash of transaction
        Hash includes all transaction data except signatures
        """
        transaction_dict = {
            'transaction_id': self.transaction_id,
            'transaction_type': self.transaction_type.value,
            'from_address': self.from_address,
            'to_address': self.to_address,
            'data': self.data,
            'timestamp': self.timestamp,
            'nonce': self.nonce,
            'contract_address': self.contract_address,
            'previous_transaction_hash': self.previous_transaction_hash,
            'metadata': self.metadata
        }
        
        transaction_string = json.dumps(transaction_dict, sort_keys=True)
        return hashlib.sha256(transaction_string.encode()).hexdigest()
    
    def add_signature(self, wallet_address: str, signature: str, role: Optional[str] = None) -> bool:
        """
        Add a signature to the transaction
        Returns True if signature added successfully
        """
        # Check if wallet already signed
        if any(sig.wallet_address == wallet_address for sig in self.signatures):
            return False
        
        sig = Signature(
            wallet_address=wallet_address,
            signature=signature,
            timestamp=time.time(),
            role=role
        )
        
        self.signatures.append(sig)
        
        # Update status based on signature count
        if len(self.signatures) >= self.required_signatures:
            if self.status == TransactionStatus.AWAITING_APPROVAL:
                self.status = TransactionStatus.APPROVED
        
        return True
    
    def is_approved(self) -> bool:
        """Check if transaction has enough signatures"""
        return len(self.signatures) >= self.required_signatures
    
    def verify_signature(self, wallet_address: str, signature: str, message: str) -> bool:
        """
        Verify a signature against the transaction hash
        In production, this would use proper cryptographic verification
        """
        # Placeholder for actual signature verification
        # In production: use eth_account or web3.py for ECDSA verification
        transaction_hash = self.calculate_hash()
        expected_message = f"{transaction_hash}:{wallet_address}"
        return message == expected_message
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert transaction to dictionary"""
        return {
            'transaction_id': self.transaction_id,
            'transaction_type': self.transaction_type.value,
            'from_address': self.from_address,
            'to_address': self.to_address,
            'data': self.data,
            'timestamp': self.timestamp,
            'nonce': self.nonce,
            'signatures': [sig.to_dict() for sig in self.signatures],
            'required_signatures': self.required_signatures,
            'status': self.status.value,
            'contract_address': self.contract_address,
            'previous_transaction_hash': self.previous_transaction_hash,
            'metadata': self.metadata,
            'hash': self.calculate_hash()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Transaction':
        """Create transaction from dictionary"""
        signatures = [
            Signature(**sig) if isinstance(sig, dict) else sig
            for sig in data.get('signatures', [])
        ]
        
        return cls(
            transaction_id=data['transaction_id'],
            transaction_type=TransactionType(data['transaction_type']),
            from_address=data['from_address'],
            to_address=data.get('to_address'),
            data=data['data'],
            timestamp=data['timestamp'],
            nonce=data['nonce'],
            signatures=signatures,
            required_signatures=data.get('required_signatures', 1),
            status=TransactionStatus(data.get('status', 'pending')),
            contract_address=data.get('contract_address'),
            previous_transaction_hash=data.get('previous_transaction_hash'),
            metadata=data.get('metadata', {})
        )
    
    def validate(self) -> tuple[bool, Optional[str]]:
        """
        Validate transaction integrity
        Returns (is_valid, error_message)
        """
        # Check required fields
        if not self.transaction_id:
            return False, "Missing transaction_id"
        
        if not self.from_address:
            return False, "Missing from_address"
        
        if not self.data:
            return False, "Missing transaction data"
        
        # Check timestamp is not in future
        if self.timestamp > time.time() + 60:  # Allow 60s clock skew
            return False, "Transaction timestamp is in the future"
        
        # Check nonce is positive
        if self.nonce < 0:
            return False, "Invalid nonce"
        
        # Check signatures if required
        if self.required_signatures > 0 and len(self.signatures) < self.required_signatures:
            if self.status not in [TransactionStatus.PENDING, TransactionStatus.AWAITING_APPROVAL]:
                return False, f"Insufficient signatures: {len(self.signatures)}/{self.required_signatures}"
        
        return True, None


class TransactionPool:
    """
    Pool of pending transactions waiting to be included in a block
    """
    def __init__(self):
        self.pending_transactions: Dict[str, Transaction] = {}
        self.transaction_history: Dict[str, Transaction] = {}
    
    def add_transaction(self, transaction: Transaction) -> tuple[bool, Optional[str]]:
        """
        Add transaction to pool
        Returns (success, error_message)
        """
        # Validate transaction
        is_valid, error = transaction.validate()
        if not is_valid:
            return False, error
        
        # Check for duplicate
        if transaction.transaction_id in self.pending_transactions:
            return False, "Transaction already in pool"
        
        # Check for replay attack (same nonce from same address)
        for tx in self.pending_transactions.values():
            if tx.from_address == transaction.from_address and tx.nonce == transaction.nonce:
                return False, "Replay attack detected: duplicate nonce"
        
        self.pending_transactions[transaction.transaction_id] = transaction
        return True, None
    
    def get_transaction(self, transaction_id: str) -> Optional[Transaction]:
        """Get transaction by ID"""
        return self.pending_transactions.get(transaction_id)
    
    def remove_transaction(self, transaction_id: str) -> Optional[Transaction]:
        """Remove transaction from pool (when included in block)"""
        transaction = self.pending_transactions.pop(transaction_id, None)
        if transaction:
            self.transaction_history[transaction_id] = transaction
        return transaction
    
    def get_pending_transactions(self, limit: Optional[int] = None) -> List[Transaction]:
        """Get pending transactions for block creation"""
        transactions = list(self.pending_transactions.values())
        
        # Sort by timestamp (FIFO)
        transactions.sort(key=lambda tx: tx.timestamp)
        
        if limit:
            return transactions[:limit]
        return transactions
    
    def get_transactions_by_address(self, address: str) -> List[Transaction]:
        """Get all transactions from a specific address"""
        return [
            tx for tx in self.pending_transactions.values()
            if tx.from_address == address or tx.to_address == address
        ]
    
    def get_awaiting_approval(self, wallet_address: Optional[str] = None) -> List[Transaction]:
        """Get transactions awaiting approval, optionally filtered by approver"""
        transactions = [
            tx for tx in self.pending_transactions.values()
            if tx.status == TransactionStatus.AWAITING_APPROVAL
        ]
        
        if wallet_address:
            # Filter transactions where this wallet hasn't signed yet
            transactions = [
                tx for tx in transactions
                if not any(sig.wallet_address == wallet_address for sig in tx.signatures)
            ]
        
        return transactions
    
    def clear_old_transactions(self, max_age_seconds: int = 86400) -> int:
        """
        Remove transactions older than max_age_seconds
        Returns number of removed transactions
        """
        current_time = time.time()
        old_transactions = [
            tx_id for tx_id, tx in self.pending_transactions.items()
            if current_time - tx.timestamp > max_age_seconds
        ]
        
        for tx_id in old_transactions:
            self.remove_transaction(tx_id)
        
        return len(old_transactions)
    
    def get_pool_stats(self) -> Dict[str, Any]:
        """Get statistics about transaction pool"""
        transactions = list(self.pending_transactions.values())
        
        status_counts = {}
        for status in TransactionStatus:
            status_counts[status.value] = sum(1 for tx in transactions if tx.status == status)
        
        type_counts = {}
        for tx_type in TransactionType:
            type_counts[tx_type.value] = sum(1 for tx in transactions if tx.transaction_type == tx_type)
        
        return {
            'total_pending': len(transactions),
            'total_history': len(self.transaction_history),
            'by_status': status_counts,
            'by_type': type_counts,
            'oldest_timestamp': min((tx.timestamp for tx in transactions), default=0),
            'newest_timestamp': max((tx.timestamp for tx in transactions), default=0)
        }
