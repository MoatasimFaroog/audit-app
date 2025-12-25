"""
Role-based access control (RBAC) system.
Maps wallets to roles and manages permissions.
"""

from typing import Dict, List, Set, Optional
import json
from pathlib import Path
from enum import Enum


class Permission(str, Enum):
    """System permissions."""
    READ = "read"
    WRITE = "write"
    APPROVE = "approve"
    AUDIT = "audit"
    ADMIN = "admin"


class Role:
    """Represents a system role with permissions."""

    def __init__(self, name: str, level: int, permissions: Dict[str, List[str]]):
        """
        Initialize role.

        Args:
            name: Role name
            level: Authority level (lower = higher authority)
            permissions: Module -> [permissions] mapping
        """
        self.name = name
        self.level = level
        self.permissions = permissions

    def has_permission(self, module: str, permission: str) -> bool:
        """
        Check if role has a specific permission for a module.

        Args:
            module: Module name
            permission: Permission to check

        Returns:
            True if role has the permission
        """
        module_perms = self.permissions.get(module, [])
        return permission in module_perms

    def get_module_permissions(self, module: str) -> List[str]:
        """
        Get all permissions for a module.

        Args:
            module: Module name

        Returns:
            List of permissions
        """
        return self.permissions.get(module, [])


class RoleManager:
    """
    Manages role assignments and permissions.
    """

    def __init__(self, storage_path: str = "role_data"):
        """
        Initialize role manager.

        Args:
            storage_path: Path to store role data
        """
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)

        # Role definitions
        self._roles: Dict[str, Role] = {}
        self._initialize_default_roles()

        # Wallet to role mappings
        self._wallet_roles: Dict[str, str] = {}  # wallet -> role_name
        self._load_wallet_roles()

    def _initialize_default_roles(self):
        """Initialize default system roles."""
        default_roles = {
            "CEO": Role("CEO", 1, {
                "accounting": ["read", "write", "approve", "audit"],
                "hr": ["read", "approve", "audit"],
                "sales": ["read", "approve", "audit"],
                "procurement": ["read", "approve", "audit"],
                "audit": ["read", "audit"],
                "system": ["admin"]
            }),
            "CFO": Role("CFO", 2, {
                "accounting": ["read", "write", "approve", "audit"],
                "hr": ["read", "audit"],
                "sales": ["read", "approve", "audit"],
                "procurement": ["read", "approve", "audit"],
                "audit": ["read", "audit"]
            }),
            "Chief Accountant": Role("Chief Accountant", 3, {
                "accounting": ["read", "write", "approve"],
                "audit": ["read", "audit"]
            }),
            "Accountant": Role("Accountant", 4, {
                "accounting": ["read", "write"]
            }),
            "Data Entry": Role("Data Entry", 5, {
                "accounting": ["write"]
            }),
            "HR Manager": Role("HR Manager", 3, {
                "hr": ["read", "write", "approve"]
            }),
            "HR Officer": Role("HR Officer", 4, {
                "hr": ["read", "write"]
            }),
            "Sales Manager": Role("Sales Manager", 3, {
                "sales": ["read", "write", "approve"]
            }),
            "Sales Representative": Role("Sales Representative", 4, {
                "sales": ["read", "write"]
            }),
            "Procurement Manager": Role("Procurement Manager", 3, {
                "procurement": ["read", "write", "approve"]
            }),
            "Procurement Officer": Role("Procurement Officer", 4, {
                "procurement": ["read", "write"]
            })
        }

        self._roles = default_roles

    def assign_role(self, wallet_address: str, role_name: str) -> bool:
        """
        Assign a role to a wallet.

        Args:
            wallet_address: Wallet address
            role_name: Role name

        Returns:
            True if assigned successfully
        """
        wallet_address = wallet_address.lower()

        if role_name not in self._roles:
            return False

        self._wallet_roles[wallet_address] = role_name
        self._save_wallet_roles()

        return True

    def get_role(self, wallet_address: str) -> Optional[Role]:
        """
        Get role for a wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            Role or None
        """
        wallet_address = wallet_address.lower()
        role_name = self._wallet_roles.get(wallet_address)

        if not role_name:
            return None

        return self._roles.get(role_name)

    def get_role_name(self, wallet_address: str) -> Optional[str]:
        """
        Get role name for a wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            Role name or None
        """
        wallet_address = wallet_address.lower()
        return self._wallet_roles.get(wallet_address)

    def has_permission(self, wallet_address: str, module: str, permission: str) -> bool:
        """
        Check if a wallet has a specific permission.

        Args:
            wallet_address: Wallet address
            module: Module name
            permission: Permission to check

        Returns:
            True if wallet has the permission
        """
        role = self.get_role(wallet_address)

        if not role:
            return False

        return role.has_permission(module, permission)

    def can_approve(self, wallet_address: str, module: str) -> bool:
        """
        Check if wallet can approve in a module.

        Args:
            wallet_address: Wallet address
            module: Module name

        Returns:
            True if can approve
        """
        return self.has_permission(wallet_address, module, "approve")

    def can_audit(self, wallet_address: str, module: str) -> bool:
        """
        Check if wallet can audit in a module.

        Args:
            wallet_address: Wallet address
            module: Module name

        Returns:
            True if can audit
        """
        return self.has_permission(wallet_address, module, "audit")

    def get_wallets_with_role(self, role_name: str) -> List[str]:
        """
        Get all wallets with a specific role.

        Args:
            role_name: Role name

        Returns:
            List of wallet addresses
        """
        return [
            wallet for wallet, role in self._wallet_roles.items()
            if role == role_name
        ]

    def get_approvers_for_module(self, module: str) -> List[str]:
        """
        Get all wallets that can approve in a module.

        Args:
            module: Module name

        Returns:
            List of wallet addresses
        """
        approvers = []

        for wallet, role_name in self._wallet_roles.items():
            role = self._roles.get(role_name)
            if role and role.has_permission(module, "approve"):
                approvers.append(wallet)

        return approvers

    def validate_approval_authority(self, approver_wallet: str,
                                     initiator_wallet: str,
                                     module: str) -> bool:
        """
        Validate that approver has authority over initiator.

        Args:
            approver_wallet: Approver's wallet
            initiator_wallet: Initiator's wallet
            module: Module name

        Returns:
            True if approver has authority
        """
        # Get roles
        approver_role = self.get_role(approver_wallet)
        initiator_role = self.get_role(initiator_wallet)

        if not approver_role or not initiator_role:
            return False

        # Check if approver has approval permission
        if not approver_role.has_permission(module, "approve"):
            return False

        # Check authority level (lower level = higher authority)
        return approver_role.level <= initiator_role.level

    def _save_wallet_roles(self):
        """Save wallet-role mappings to storage."""
        file_path = self.storage_path / "wallet_roles.json"
        with open(file_path, 'w') as f:
            json.dump(self._wallet_roles, f, indent=2)

    def _load_wallet_roles(self):
        """Load wallet-role mappings from storage."""
        file_path = self.storage_path / "wallet_roles.json"

        if not file_path.exists():
            return

        with open(file_path, 'r') as f:
            self._wallet_roles = json.load(f)

    def get_all_roles(self) -> List[str]:
        """
        Get all available role names.

        Returns:
            List of role names
        """
        return list(self._roles.keys())


# Global role manager instance
_global_role_manager = RoleManager()


def get_role_manager() -> RoleManager:
    """
    Get the global role manager instance.

    Returns:
        Global role manager
    """
    return _global_role_manager
