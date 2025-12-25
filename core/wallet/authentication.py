"""
Wallet-based authentication system.
No traditional username/password - only wallet authentication.
"""

from typing import Optional, Dict, Any
import time
from .signature_verification import SignatureVerifier, get_nonce_manager


class WalletAuthenticationError(Exception):
    """Exception raised for wallet authentication errors."""
    pass


class WalletAuthenticator:
    """
    Authenticates users via their crypto wallets.
    """

    def __init__(self):
        """Initialize wallet authenticator."""
        self.nonce_manager = get_nonce_manager()
        self.active_sessions: Dict[str, Dict[str, Any]] = {}  # wallet -> session data

    def generate_login_challenge(self, wallet_address: str) -> Dict[str, str]:
        """
        Generate a login challenge for a wallet.

        Args:
            wallet_address: Wallet address requesting login

        Returns:
            Challenge data including nonce and message to sign
        """
        # Normalize wallet address
        wallet_address = wallet_address.lower()

        # Generate nonce
        nonce = self.nonce_manager.generate_nonce()

        # Create challenge message
        message = (
            f"Web3 Accounting & Audit System\n"
            f"Login Request\n"
            f"Wallet: {wallet_address}\n"
            f"Nonce: {nonce}\n"
            f"Timestamp: {time.time()}"
        )

        return {
            "wallet_address": wallet_address,
            "nonce": nonce,
            "message": message,
            "expires_at": time.time() + 300  # 5 minutes
        }

    def verify_login(self, wallet_address: str, nonce: str,
                     signature: str, message: str) -> Dict[str, Any]:
        """
        Verify login attempt and create session.

        Args:
            wallet_address: Wallet address
            nonce: Nonce from challenge
            signature: Signed message
            message: Original message

        Returns:
            Session data

        Raises:
            WalletAuthenticationError: If verification fails
        """
        # Normalize wallet address
        wallet_address = wallet_address.lower()

        # Check nonce validity
        if not self.nonce_manager.is_nonce_valid(wallet_address, nonce):
            raise WalletAuthenticationError("Invalid or expired nonce (possible replay attack)")

        # Verify signature
        is_valid = SignatureVerifier.verify_signature(message, signature, wallet_address)

        if not is_valid:
            raise WalletAuthenticationError("Invalid signature")

        # Mark nonce as used
        self.nonce_manager.use_nonce(wallet_address, nonce)

        # Create session
        session = self._create_session(wallet_address)

        return session

    def _create_session(self, wallet_address: str) -> Dict[str, Any]:
        """
        Create a new session for authenticated wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            Session data
        """
        import uuid

        session_id = str(uuid.uuid4())
        session_data = {
            "session_id": session_id,
            "wallet_address": wallet_address,
            "created_at": time.time(),
            "expires_at": time.time() + 86400,  # 24 hours
            "last_activity": time.time()
        }

        self.active_sessions[wallet_address] = session_data

        return session_data

    def validate_session(self, session_id: str, wallet_address: str) -> bool:
        """
        Validate an active session.

        Args:
            session_id: Session ID
            wallet_address: Wallet address

        Returns:
            True if session is valid
        """
        wallet_address = wallet_address.lower()

        if wallet_address not in self.active_sessions:
            return False

        session = self.active_sessions[wallet_address]

        # Check session ID
        if session["session_id"] != session_id:
            return False

        # Check expiration
        if time.time() > session["expires_at"]:
            self.logout(wallet_address)
            return False

        # Update last activity
        session["last_activity"] = time.time()

        return True

    def logout(self, wallet_address: str) -> bool:
        """
        Logout a wallet (end session).

        Args:
            wallet_address: Wallet address

        Returns:
            True if logout successful
        """
        wallet_address = wallet_address.lower()

        if wallet_address in self.active_sessions:
            del self.active_sessions[wallet_address]
            return True

        return False

    def get_session(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        """
        Get session data for a wallet.

        Args:
            wallet_address: Wallet address

        Returns:
            Session data or None
        """
        wallet_address = wallet_address.lower()
        return self.active_sessions.get(wallet_address)

    def cleanup_expired_sessions(self):
        """
        Remove expired sessions.
        """
        current_time = time.time()
        expired_wallets = []

        for wallet_address, session in self.active_sessions.items():
            if current_time > session["expires_at"]:
                expired_wallets.append(wallet_address)

        for wallet_address in expired_wallets:
            del self.active_sessions[wallet_address]


class TransactionAuthenticator:
    """
    Authenticates transactions via wallet signatures.
    """

    @staticmethod
    def authenticate_transaction(transaction_data: Dict[str, Any],
                                  signature: str,
                                  wallet_address: str) -> bool:
        """
        Authenticate a transaction.

        Args:
            transaction_data: Transaction data
            signature: Transaction signature
            wallet_address: Expected signer's wallet

        Returns:
            True if authenticated

        Raises:
            WalletAuthenticationError: If authentication fails
        """
        is_valid = SignatureVerifier.verify_transaction_signature(
            transaction_data,
            signature,
            wallet_address
        )

        if not is_valid:
            raise WalletAuthenticationError("Invalid transaction signature")

        return True

    @staticmethod
    def authenticate_approval(transaction_hash: str,
                              action: str,
                              signature: str,
                              wallet_address: str) -> bool:
        """
        Authenticate an approval action.

        Args:
            transaction_hash: Hash of transaction being approved
            action: Approval action
            signature: Approval signature
            wallet_address: Approver's wallet

        Returns:
            True if authenticated

        Raises:
            WalletAuthenticationError: If authentication fails
        """
        is_valid = SignatureVerifier.verify_approval_signature(
            transaction_hash,
            action,
            signature,
            wallet_address
        )

        if not is_valid:
            raise WalletAuthenticationError("Invalid approval signature")

        return True


# Global wallet authenticator instance
_global_authenticator = WalletAuthenticator()


def get_wallet_authenticator() -> WalletAuthenticator:
    """
    Get the global wallet authenticator instance.

    Returns:
        Global authenticator
    """
    return _global_authenticator
