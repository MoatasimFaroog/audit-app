"""
Wallet and Identity module for Web3 Accounting & Audit System.

This module provides wallet-based authentication, identity management,
and role-based access control (RBAC).
"""

from .signature_verification import (
    SignatureVerifier,
    NonceManager,
    get_nonce_manager
)
from .authentication import (
    WalletAuthenticator,
    TransactionAuthenticator,
    WalletAuthenticationError,
    get_wallet_authenticator
)
from .identity_manager import (
    Identity,
    IdentityManager
)
from .role_manager import (
    Role,
    RoleManager,
    Permission,
    get_role_manager
)

__all__ = [
    # Signature Verification
    'SignatureVerifier',
    'NonceManager',
    'get_nonce_manager',

    # Authentication
    'WalletAuthenticator',
    'TransactionAuthenticator',
    'WalletAuthenticationError',
    'get_wallet_authenticator',

    # Identity
    'Identity',
    'IdentityManager',

    # Roles
    'Role',
    'RoleManager',
    'Permission',
    'get_role_manager',
]

__version__ = '1.0.0'
