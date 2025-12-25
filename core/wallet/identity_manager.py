"""
Identity management system mapping wallets to system identities.
"""

from typing import Optional, Dict, Any, List
import json
from pathlib import Path


class Identity:
    """Represents a system identity linked to a wallet."""

    def __init__(self, wallet_address: str, data: Dict[str, Any] = None):
        """
        Initialize identity.

        Args:
            wallet_address: Wallet address
            data: Identity data
        """
        self.wallet_address = wallet_address.lower()
        self.data = data or {}

    def get_name(self) -> str:
        """Get identity name."""
        return self.data.get("name", "")

    def get_email(self) -> str:
        """Get identity email."""
        return self.data.get("email", "")

    def get_metadata(self) -> Dict[str, Any]:
        """Get all metadata."""
        return self.data.copy()


class IdentityManager:
    """
    Manages wallet-to-identity mappings.
    """

    def __init__(self, storage_path: str = "identity_data"):
        """
        Initialize identity manager.

        Args:
            storage_path: Path to store identity data
        """
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self._identities: Dict[str, Identity] = {}
        self._load_identities()

    def register_identity(self, wallet_address: str, name: str,
                          email: str = "", metadata: Dict[str, Any] = None) -> Identity:
        """
        Register a new identity.

        Args:
            wallet_address: Wallet address
            name: Identity name
            email: Email address
            metadata: Additional metadata

        Returns:
            Created identity
        """
        wallet_address = wallet_address.lower()

        data = {
            "name": name,
            "email": email,
            **(metadata or {})
        }

        identity = Identity(wallet_address, data)
        self._identities[wallet_address] = identity
        self._save_identity(identity)

        return identity

    def get_identity(self, wallet_address: str) -> Optional[Identity]:
        """
        Get identity for a wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            Identity or None
        """
        wallet_address = wallet_address.lower()
        return self._identities.get(wallet_address)

    def update_identity(self, wallet_address: str, updates: Dict[str, Any]) -> bool:
        """
        Update identity data.

        Args:
            wallet_address: Wallet address
            updates: Data to update

        Returns:
            True if updated successfully
        """
        wallet_address = wallet_address.lower()

        if wallet_address not in self._identities:
            return False

        identity = self._identities[wallet_address]
        identity.data.update(updates)
        self._save_identity(identity)

        return True

    def _save_identity(self, identity: Identity):
        """Save identity to storage."""
        file_path = self.storage_path / f"{identity.wallet_address}.json"
        with open(file_path, 'w') as f:
            json.dump(identity.data, f, indent=2)

    def _load_identities(self):
        """Load all identities from storage."""
        if not self.storage_path.exists():
            return

        for file_path in self.storage_path.glob("*.json"):
            wallet_address = file_path.stem
            with open(file_path, 'r') as f:
                data = json.load(f)
                self._identities[wallet_address] = Identity(wallet_address, data)
