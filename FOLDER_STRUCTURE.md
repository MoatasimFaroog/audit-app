# Web3 Accounting & Audit System - Folder Structure

```
web3-accounting-audit-system/
│
├── core/                                    # Python Backend Core
│   ├── __init__.py
│   ├── main.py                             # FastAPI application entry point
│   ├── config.py                           # Configuration management
│   │
│   ├── blockchain/                         # Blockchain Engine
│   │   ├── __init__.py
│   │   ├── block.py                        # Block structure
│   │   ├── chain.py                        # Blockchain management
│   │   ├── transaction.py                  # Transaction structure
│   │   ├── merkle_tree.py                  # Merkle tree implementation
│   │   ├── hash_utils.py                   # Hashing utilities (SHA-256)
│   │   ├── validator.py                    # Block & chain validation
│   │   └── genesis.py                      # Genesis block creation
│   │
│   ├── contracts/                          # Smart Contracts System
│   │   ├── __init__.py
│   │   ├── base_contract.py                # Base contract class
│   │   ├── contract_registry.py            # Contract versioning & deployment
│   │   ├── accounting_contract.py          # Accounting entry contract
│   │   ├── approval_contract.py            # Approval workflow contract
│   │   ├── hr_contract.py                  # HR operations contract
│   │   ├── sales_contract.py               # Sales operations contract
│   │   ├── procurement_contract.py         # Procurement contract
│   │   └── audit_contract.py               # Audit rules contract
│   │
│   ├── wallet/                             # Wallet & Identity
│   │   ├── __init__.py
│   │   ├── authentication.py               # Wallet authentication
│   │   ├── signature_verification.py       # Signature validation
│   │   ├── identity_manager.py             # Wallet-to-identity mapping
│   │   └── role_manager.py                 # Role-based access control
│   │
│   ├── modules/                            # Business Modules
│   │   ├── __init__.py
│   │   ├── base_module.py                  # Base module class
│   │   │
│   │   ├── accounting/                     # Accounting Module
│   │   │   ├── __init__.py
│   │   │   ├── journal_entry.py            # Journal entries
│   │   │   ├── ledger.py                   # General ledger
│   │   │   ├── accounts.py                 # Chart of accounts
│   │   │   └── reconciliation.py           # Reconciliation logic
│   │   │
│   │   ├── hr/                             # HR Module
│   │   │   ├── __init__.py
│   │   │   ├── employee.py                 # Employee management
│   │   │   ├── payroll.py                  # Payroll processing
│   │   │   ├── leave.py                    # Leave management
│   │   │   └── benefits.py                 # Benefits administration
│   │   │
│   │   ├── sales/                          # Sales Module
│   │   │   ├── __init__.py
│   │   │   ├── invoice.py                  # Sales invoicing
│   │   │   ├── customer.py                 # Customer management
│   │   │   ├── order.py                    # Sales orders
│   │   │   └── revenue.py                  # Revenue recognition
│   │   │
│   │   ├── procurement/                    # Procurement Module
│   │   │   ├── __init__.py
│   │   │   ├── purchase_order.py           # Purchase orders
│   │   │   ├── vendor.py                   # Vendor management
│   │   │   ├── receiving.py                # Goods receiving
│   │   │   └── payment.py                  # Vendor payments
│   │   │
│   │   └── audit/                          # Audit Module (Non-disableable)
│   │       ├── __init__.py
│   │       ├── audit_trail.py              # Complete audit trail
│   │       ├── anomaly_detection.py        # Detect violations
│   │       ├── compliance_checker.py       # Standards compliance
│   │       └── audit_reports.py            # Audit reporting
│   │
│   ├── reporting/                          # Reporting Engine
│   │   ├── __init__.py
│   │   ├── base_report.py                  # Base report class
│   │   ├── general_ledger.py               # GL report
│   │   ├── trial_balance.py                # Trial balance
│   │   ├── financial_statements.py         # Financial statements
│   │   ├── audit_trail_report.py           # Audit trail report
│   │   └── custom_reports.py               # Custom report builder
│   │
│   ├── settings/                           # Settings & Rules Engine
│   │   ├── __init__.py
│   │   ├── country_settings.py             # Country configuration
│   │   ├── accounting_standards.py         # IFRS, GAAP, etc.
│   │   ├── audit_standards.py              # Saudi, US audit standards
│   │   ├── rules_engine.py                 # Business rules engine
│   │   └── multisig_rules.py               # Multi-signature rules
│   │
│   ├── api/                                # API Layer
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── blockchain.py               # Blockchain endpoints
│   │   │   ├── transactions.py             # Transaction endpoints
│   │   │   ├── modules.py                  # Module endpoints
│   │   │   ├── reports.py                  # Reporting endpoints
│   │   │   ├── settings.py                 # Settings endpoints
│   │   │   └── wallet.py                   # Wallet authentication
│   │   │
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── auth_middleware.py          # Wallet auth middleware
│   │   │   ├── signature_middleware.py     # Signature verification
│   │   │   └── rate_limiter.py             # Rate limiting
│   │   │
│   │   └── schemas/                        # Pydantic models
│   │       ├── __init__.py
│   │       ├── transaction_schemas.py
│   │       ├── block_schemas.py
│   │       ├── module_schemas.py
│   │       └── report_schemas.py
│   │
│   ├── storage/                            # Data Persistence
│   │   ├── __init__.py
│   │   ├── blockchain_storage.py           # Blockchain file storage
│   │   ├── cache.py                        # Optional caching layer
│   │   └── backup.py                       # Backup utilities
│   │
│   ├── security/                           # Security Layer
│   │   ├── __init__.py
│   │   ├── encryption.py                   # Encryption utilities
│   │   ├── replay_protection.py            # Prevent replay attacks
│   │   ├── permission_validator.py         # Permission checks
│   │   └── audit_logger.py                 # Security audit logging
│   │
│   ├── utils/                              # Utilities
│   │   ├── __init__.py
│   │   ├── datetime_utils.py               # Date/time helpers
│   │   ├── json_utils.py                   # JSON handling
│   │   └── validation_utils.py             # General validators
│   │
│   └── tests/                              # Core tests
│       ├── __init__.py
│       ├── test_blockchain.py
│       ├── test_contracts.py
│       ├── test_modules.py
│       └── test_api.py
│
├── frontend/                               # Frontend Application
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   │
│   ├── public/
│   │   ├── locales/                        # i18n translations
│   │   │   ├── en/
│   │   │   │   └── common.json
│   │   │   └── ar/
│   │   │       └── common.json
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── app/                            # Next.js app router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── accounting/
│   │   │   ├── hr/
│   │   │   ├── sales/
│   │   │   ├── procurement/
│   │   │   ├── audit/
│   │   │   └── settings/
│   │   │
│   │   ├── components/                     # React components
│   │   │   ├── layout/
│   │   │   ├── wallet/                     # Wallet connection
│   │   │   ├── modules/                    # Module components
│   │   │   ├── reports/                    # Report components
│   │   │   └── common/                     # Shared components
│   │   │
│   │   ├── hooks/                          # React hooks
│   │   │   ├── useWallet.ts                # Wallet hook
│   │   │   ├── useTransaction.ts           # Transaction hook
│   │   │   ├── useModule.ts                # Module hook
│   │   │   └── useReport.ts                # Reporting hook
│   │   │
│   │   ├── services/                       # API services
│   │   │   ├── api.ts                      # Base API client
│   │   │   ├── blockchain.ts               # Blockchain API
│   │   │   ├── wallet.ts                   # Wallet API
│   │   │   └── modules.ts                  # Module APIs
│   │   │
│   │   ├── store/                          # State management
│   │   │   ├── wallet.ts                   # Wallet state
│   │   │   ├── user.ts                     # User state
│   │   │   └── modules.ts                  # Module state
│   │   │
│   │   ├── utils/                          # Frontend utilities
│   │   │   ├── web3.ts                     # Web3 utilities
│   │   │   ├── signature.ts                # Signature helpers
│   │   │   └── formatting.ts               # Data formatting
│   │   │
│   │   └── types/                          # TypeScript types
│   │       ├── wallet.ts
│   │       ├── transaction.ts
│   │       └── module.ts
│   │
│   └── tests/                              # Frontend tests
│       └── components/
│
├── standards/                              # Accounting & Audit Standards
│   ├── accounting/
│   │   ├── ifrs.json                       # IFRS rules
│   │   ├── gaap.json                       # US GAAP rules
│   │   └── saudi_socpa.json                # Saudi standards
│   │
│   └── audit/
│       ├── saudi_audit.json                # Saudi audit standards
│       ├── us_audit.json                   # US audit standards
│       └── isa.json                        # International standards
│
├── docker/                                 # Docker configuration
│   ├── Dockerfile.core                     # Core backend
│   ├── Dockerfile.frontend                 # Frontend
│   └── docker-compose.yml                  # Full stack
│
├── scripts/                                # Utility scripts
│   ├── setup.sh                            # Initial setup
│   ├── start_dev.sh                        # Start development
│   ├── run_tests.sh                        # Run all tests
│   └── deploy.sh                           # Deployment script
│
├── docs/                                   # Documentation
│   ├── API.md                              # API documentation
│   ├── BLOCKCHAIN.md                       # Blockchain design
│   ├── CONTRACTS.md                        # Smart contracts guide
│   ├── MODULES.md                          # Module development
│   ├── DEPLOYMENT.md                       # Deployment guide
│   └── USER_GUIDE.md                       # User manual
│
├── .env.example                            # Environment template
├── .gitignore
├── requirements.txt                        # Python dependencies
├── README.md                               # Main documentation
├── ARCHITECTURE.md                         # System architecture
└── LICENSE
```

## Key Directories Explained

### `/core`
Complete Python backend implementing blockchain, smart contracts, modules, and API layer.

### `/frontend`
Independent React/Next.js frontend with wallet integration, no business logic.

### `/standards`
JSON files defining accounting and audit standards by country.

### `/docker`
Containerization for easy deployment.

### `/scripts`
Automation scripts for development and deployment.

### `/docs`
Comprehensive documentation for developers and users.

## Development Workflow

1. **Core Development**: Work in `/core` for all business logic
2. **Frontend Development**: Work in `/frontend` for UI
3. **Standards**: Add new countries/standards in `/standards`
4. **Testing**: Tests alongside respective code
5. **Documentation**: Update `/docs` as features are added

## Separation of Concerns

- **Core**: All business logic, blockchain, security
- **Frontend**: Only UI, wallet connection, API calls
- **Standards**: Configuration data, no code
- **Contracts**: Immutable business rules
