# Web3 Accounting & Audit System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Blockchain](https://img.shields.io/badge/blockchain-enabled-green.svg)](https://github.com)

> **A revolutionary decentralized accounting and audit system built entirely on blockchain principles with Web3 authentication.**

## 🌟 Overview

The Web3 Accounting & Audit System is the **first fully decentralized accounting system** that eliminates traditional database dependencies and implements true blockchain-based financial record keeping. Every transaction is immutable, every approval is cryptographically signed, and the complete audit trail is permanently recorded.

### Key Features

- ✅ **100% Blockchain-Based** - No traditional CRUD operations
- 🔐 **Wallet-Only Authentication** - MetaMask/WalletConnect (no passwords)
- 📝 **Smart Contract Logic** - Business rules enforced by immutable contracts
- 🔗 **Immutable Records** - No edit/delete, only append operations
- ✍️ **Multi-Signature Approvals** - Role-based approval workflows
- 🕵️ **Complete Audit Trail** - Every action permanently recorded
- 🌍 **Multi-Standard Support** - IFRS, GAAP, Saudi SOCPA, ISA
- 🔍 **Anomaly Detection** - Automatic detection of suspicious activities
- 🚫 **Non-Disableable Audit** - Audit module cannot be turned off
- 🌐 **i18n Ready** - Arabic (RTL) and English (LTR) support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│          React/Next.js + Wallet Integration                 │
└────────────────────┬────────────────────────────────────────┘
                     │ JSON-RPC / REST API
                     │ (Signed Messages Only)
┌────────────────────▼────────────────────────────────────────┐
│                   CORE LAYER (Python)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         BLOCKCHAIN ENGINE                            │  │
│  │  • Block Structure & Chain Management                │  │
│  │  • SHA-256 Hashing & Merkle Trees                   │  │
│  │  • Transaction Validation & Verification            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       SMART CONTRACTS SYSTEM                         │  │
│  │  • Accounting Entry Contract                         │  │
│  │  • Approval Workflow Contract                        │  │
│  │  • HR, Sales, Procurement Contracts                  │  │
│  │  • Audit & Compliance Contracts                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     WALLET AUTHENTICATION & RBAC                     │  │
│  │  • Signature Verification (ECDSA)                    │  │
│  │  • Role-Based Access Control                         │  │
│  │  • Identity Management                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js 18+ (for frontend)
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/web3-accounting-system.git
cd web3-accounting-system

# Install Python dependencies
pip install -r requirements.txt

# Run the example
python example_usage.py
```

### Basic Usage

```python
from core.main import Web3AccountingSystem

# Initialize the system
system = Web3AccountingSystem()

# Register a user
role_manager = system.get_role_manager()
role_manager.assign_role(
    wallet_address="0x1234567890123456789012345678901234567890",
    role_name="Accountant"
)

# Create an accounting entry
from core.blockchain import TransactionBuilder

entry_data = {
    "entry_date": "2025-12-25",
    "description": "Office supplies purchase",
    "debits": [{"account_code": "5100", "amount": 500.00}],
    "credits": [{"account_code": "1000", "amount": 500.00}]
}

transaction = TransactionBuilder() \
    .set_type("journal_entry") \
    .set_module("accounting") \
    .set_contract("accounting_entry_contract") \
    .set_data(entry_data) \
    .set_wallet(wallet_address) \
    .build()

# Add to blockchain
system.blockchain.add_transaction(transaction)

# Create block
block = system.blockchain.create_block(created_by=wallet_address)
```

## 📋 System Components

### 1. Blockchain Engine (`core/blockchain/`)

- **Block**: Immutable block structure with Merkle tree
- **Chain**: Blockchain management and validation
- **Transaction**: Transaction structure with signature support
- **Validator**: Comprehensive validation engine
- **Genesis**: Genesis block creation with system initialization

### 2. Smart Contracts (`core/contracts/`)

#### Accounting Contracts
- `AccountingEntryContract`: Journal entries with double-entry validation
- `AccountingAdjustmentContract`: Adjustments and corrections

#### Approval Contracts
- `ApprovalWorkflowContract`: Multi-signature approval flows
- `DelegationContract`: Authority delegation

#### HR Contracts
- `EmployeeContract`: Employee management operations
- `PayrollContract`: Payroll processing
- `LeaveContract`: Leave management

#### Sales Contracts
- `SalesInvoiceContract`: Invoice creation and management
- `SalesOrderContract`: Sales order processing
- `CustomerContract`: Customer management

#### Procurement Contracts
- `PurchaseOrderContract`: Purchase order management
- `VendorContract`: Vendor operations
- `GoodsReceivingContract`: Goods receiving and verification

#### Audit Contracts (Non-Disableable)
- `AuditTrailContract`: Complete audit trail recording
- `ComplianceCheckContract`: Standards compliance verification
- `AnomalyDetectionContract`: Suspicious activity detection
- `AuditReportContract`: Audit report generation

### 3. Wallet & Identity (`core/wallet/`)

- **SignatureVerifier**: ECDSA signature verification
- **WalletAuthenticator**: Wallet-based authentication
- **IdentityManager**: Wallet-to-identity mapping
- **RoleManager**: Role-based access control (RBAC)

### 4. Roles & Permissions

#### Executive Level
- **CEO**: Full system access, final approval authority
- **CFO**: Financial oversight, high-level approvals

#### Accounting Team
- **Chief Accountant**: Operations management, approvals
- **Accountant**: Transaction processing
- **Data Entry**: Basic transaction entry

#### HR Team
- **HR Manager**: HR operations management
- **HR Officer**: HR transaction processing

#### Sales Team
- **Sales Manager**: Sales operations management
- **Sales Representative**: Sales transaction processing

#### Procurement Team
- **Procurement Manager**: Procurement management
- **Procurement Officer**: Purchase order processing

## 🔐 Security Features

1. **Cryptographic Hashing**: SHA-256 for all data integrity
2. **Digital Signatures**: ECDSA signature verification
3. **Immutability**: No edit/delete operations
4. **Replay Protection**: Nonce-based replay attack prevention
5. **Permission Validation**: Smart contract-enforced permissions
6. **Audit Logging**: Complete non-disableable audit trail
7. **Anomaly Detection**: Automatic detection of violations

## 🔄 Transaction Flow

```
1. CREATE Transaction
   └─ User initiates via wallet signature

2. VALIDATE
   ├─ Check signature authenticity
   ├─ Validate against smart contract rules
   └─ Verify permissions

3. APPROVAL FLOW (if required)
   ├─ Route to approvers based on rules
   ├─ Collect multi-signatures
   └─ Validate all signatures

4. ADD TO BLOCKCHAIN
   ├─ Transaction added to pending pool
   ├─ Block creation with Merkle tree
   └─ Link to previous block

5. IMMUTABLE RECORD
   └─ Transaction permanently recorded
```

## 📊 Compliance & Standards

The system supports multiple accounting and audit standards:

### Accounting Standards
- **IFRS**: International Financial Reporting Standards
- **GAAP**: Generally Accepted Accounting Principles (US)
- **SOCPA**: Saudi Organization for CPAs standards

### Audit Standards
- **ISA**: International Standards on Auditing
- **Saudi Audit Standards**: Kingdom-specific requirements
- **US Audit Standards**: US-specific requirements

Standards are configurable per organization and enforced via the rules engine.

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific test
pytest core/tests/test_blockchain.py

# Run with coverage
pytest --cov=core --cov-report=html
```

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Blockchain Design](docs/BLOCKCHAIN.md)
- [Smart Contracts Guide](docs/CONTRACTS.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [User Guide](docs/USER_GUIDE.md)

## 🗂️ Project Structure

```
web3-accounting-audit-system/
├── core/                           # Python backend
│   ├── blockchain/                 # Blockchain engine
│   ├── contracts/                  # Smart contracts
│   ├── wallet/                     # Authentication & RBAC
│   └── main.py                     # System entry point
├── standards/                      # Accounting & audit standards
├── docs/                          # Documentation
├── example_usage.py               # Usage examples
├── requirements.txt               # Python dependencies
├── ARCHITECTURE.md                # System architecture
├── FOLDER_STRUCTURE.md            # Detailed folder structure
└── README.md                      # This file
```

## 🎯 Use Cases

1. **Small to Medium Enterprises**: Complete accounting system
2. **Large Corporations**: Department-specific modules
3. **Accounting Firms**: Multi-client audit trails
4. **Government Entities**: Transparent financial management
5. **Non-Profits**: Donation tracking and transparency

## 🚀 Roadmap

- [ ] REST API implementation (FastAPI)
- [ ] Frontend UI (React/Next.js)
- [ ] Real MetaMask integration
- [ ] Additional modules (Inventory, Projects, etc.)
- [ ] Mobile app (React Native)
- [ ] Advanced reporting engine
- [ ] Machine learning for anomaly detection
- [ ] Multi-chain support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethereum Foundation for Web3 standards
- IFRS Foundation for accounting standards
- Open-source community for tools and libraries

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/web3-accounting-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/web3-accounting-system/discussions)

## ⚠️ Important Notes

1. **No Traditional Authentication**: System uses ONLY wallet-based authentication
2. **Immutable Records**: No edit or delete operations - design transactions carefully
3. **Audit Module**: Cannot be disabled - all actions are permanently recorded
4. **Smart Contracts**: Immutable once deployed - test thoroughly before production
5. **Approval Flows**: Configure approval thresholds based on your organization's needs

---

**Built with ❤️ for the future of decentralized accounting**

*Making financial systems transparent, immutable, and trustworthy.*
