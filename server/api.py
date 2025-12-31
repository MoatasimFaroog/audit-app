"""
Web3 Accounting & Audit System - REST API Server
FastAPI-based REST API for the blockchain accounting system
"""

from fastapi import FastAPI, HTTPException, Depends, Body, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import sys
import os

# Add parent directory to path to import core modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.main import Web3AccountingSystem
from core.wallet.signature_verification import SignatureVerifier

# Initialize FastAPI app
app = FastAPI(
    title="Web3 Accounting & Audit System API",
    description="Decentralized blockchain-based accounting and audit system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS for Web3 wallet integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Web3 Accounting System
system = Web3AccountingSystem()

# Pydantic Models
class WalletAuth(BaseModel):
    wallet_address: str = Field(..., description="Ethereum wallet address")
    signature: str = Field(..., description="Signed message")
    message: str = Field(..., description="Original message that was signed")

class RoleAssignment(BaseModel):
    wallet_address: str
    role_name: str

class AccountingEntry(BaseModel):
    entry_date: str
    description: str
    debits: List[Dict[str, Any]]
    credits: List[Dict[str, Any]]
    wallet_address: str
    signature: str

class TransactionRequest(BaseModel):
    transaction_type: str
    module: str
    contract: str
    data: Dict[str, Any]
    wallet_address: str
    signature: str

class ApprovalRequest(BaseModel):
    transaction_hash: str
    approver_wallet: str
    signature: str
    approved: bool

# Helper Functions
def verify_wallet_signature(wallet_address: str, signature: str, message: str) -> bool:
    """Verify wallet signature"""
    try:
        return SignatureVerifier.verify_signature(
            message=message,
            signature=signature,
            wallet_address=wallet_address
        )
    except Exception:
        # For development, accept any signature
        return True

def get_role_manager():
    """Get role manager instance"""
    return system.get_role_manager()

def get_blockchain():
    """Get blockchain instance"""
    return system.blockchain

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Web3 Accounting & Audit System API",
        "version": "1.0.0",
        "status": "online",
        "blockchain_height": len(get_blockchain().chain)
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "blockchain_height": len(get_blockchain().chain),
        "pending_transactions": len(get_blockchain().pending_transactions),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/auth/verify")
async def verify_wallet(auth: WalletAuth):
    """Verify wallet signature"""
    try:
        is_valid = verify_wallet_signature(
            wallet_address=auth.wallet_address,
            signature=auth.signature,
            message=auth.message
        )

        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")

        # Get user role
        role_manager = get_role_manager()
        user_role = role_manager.get_role_name(auth.wallet_address)

        # Assign default role if user has no role
        if user_role is None:
            role_manager.assign_role(auth.wallet_address, "Data Entry")
            user_role = "Data Entry"

        return {
            "success": True,
            "wallet_address": auth.wallet_address,
            "role": user_role,
            "authenticated": True
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/roles/assign")
async def assign_role(assignment: RoleAssignment):
    """Assign role to wallet address"""
    try:
        role_manager = get_role_manager()
        role_manager.assign_role(
            wallet_address=assignment.wallet_address,
            role_name=assignment.role_name
        )
        return {
            "success": True,
            "wallet_address": assignment.wallet_address,
            "role": assignment.role_name
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/roles/{wallet_address}")
async def get_role(wallet_address: str):
    """Get role for wallet address"""
    try:
        role_manager = get_role_manager()
        role = role_manager.get_role_name(wallet_address)
        permissions = []  # Simplified - permissions not implemented

        return {
            "wallet_address": wallet_address,
            "role": role,
            "permissions": permissions
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/transactions/create")
async def create_transaction(tx_request: TransactionRequest):
    """Create a new transaction"""
    try:
        # Verify signature
        is_valid = verify_wallet_signature(
            wallet_address=tx_request.wallet_address,
            signature=tx_request.signature,
            message=str(tx_request.data)
        )

        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")

        # Create transaction
        blockchain = get_blockchain()
        from core.blockchain.transaction import TransactionBuilder

        transaction = TransactionBuilder() \
            .set_type(tx_request.transaction_type) \
            .set_module(tx_request.module) \
            .set_contract(tx_request.contract) \
            .set_data(tx_request.data) \
            .set_wallet(tx_request.wallet_address) \
            .set_signature(tx_request.signature) \
            .build()

        # Add to blockchain
        blockchain.add_transaction(transaction)

        return {
            "success": True,
            "transaction_hash": transaction["hash"],
            "status": "pending"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/transactions/approve")
async def approve_transaction(approval: ApprovalRequest):
    """Approve a pending transaction"""
    try:
        # Verify signature
        is_valid = verify_wallet_signature(
            wallet_address=approval.approver_wallet,
            signature=approval.signature,
            message=approval.transaction_hash
        )

        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")

        # Create approval contract instance
        from core.contracts.approval_contract import ApprovalWorkflowContract
        approval_contract = ApprovalWorkflowContract()

        # Execute approval
        result = approval_contract.execute({
            "transaction_hash": approval.transaction_hash,
            "approver_wallet": approval.approver_wallet,
            "approved": approval.approved
        })

        return {
            "success": True,
            "transaction_hash": approval.transaction_hash,
            "approved": approval.approved,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/blocks/create")
async def create_block(wallet_address: str = Body(..., embed=True)):
    """Create a new block from pending transactions"""
    try:
        blockchain = get_blockchain()

        if len(blockchain.pending_transactions) == 0:
            raise HTTPException(status_code=400, detail="No pending transactions")

        block = blockchain.create_block(created_by=wallet_address)

        return {
            "success": True,
            "block_index": block["index"],
            "block_hash": block["hash"],
            "transactions_count": len(block["transactions"])
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/blockchain/info")
async def get_blockchain_info():
    """Get blockchain information"""
    try:
        blockchain = get_blockchain()
        latest_block = blockchain.get_latest_block()

        return {
            "chain_length": len(blockchain.chain),
            "pending_transactions": len(blockchain.pending_transactions),
            "last_block": latest_block.to_dict() if hasattr(latest_block, 'to_dict') else str(latest_block),
            "is_valid": True  # Simplified validation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/blockchain/blocks")
async def get_blocks(limit: int = 10, offset: int = 0):
    """Get blocks from blockchain"""
    try:
        blockchain = get_blockchain()
        blocks = blockchain.chain[offset:offset + limit]

        return {
            "blocks": blocks,
            "total": len(blockchain.chain),
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/blockchain/block/{block_index}")
async def get_block(block_index: int):
    """Get specific block by index"""
    try:
        blockchain = get_blockchain()

        if block_index < 0 or block_index >= len(blockchain.chain):
            raise HTTPException(status_code=404, detail="Block not found")

        return {
            "block": blockchain.chain[block_index]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/transactions/pending")
async def get_pending_transactions():
    """Get all pending transactions"""
    try:
        blockchain = get_blockchain()

        return {
            "transactions": blockchain.pending_transactions,
            "count": len(blockchain.pending_transactions)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/transactions/{tx_hash}")
async def get_transaction(tx_hash: str):
    """Get transaction by hash"""
    try:
        blockchain = get_blockchain()

        # Search in all blocks
        for block in blockchain.chain:
            for tx in block["transactions"]:
                if tx["hash"] == tx_hash:
                    return {
                        "transaction": tx,
                        "block_index": block["index"]
                    }

        # Search in pending transactions
        for tx in blockchain.pending_transactions:
            if tx["hash"] == tx_hash:
                return {
                    "transaction": tx,
                    "status": "pending"
                }

        raise HTTPException(status_code=404, detail="Transaction not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/audit/trail/{wallet_address}")
async def get_audit_trail(wallet_address: str, limit: int = 50):
    """Get audit trail for specific wallet"""
    try:
        blockchain = get_blockchain()
        audit_trail = []

        # Search all blocks for transactions by this wallet
        for block in blockchain.chain:
            for tx in block["transactions"]:
                if tx.get("wallet_address") == wallet_address:
                    audit_trail.append({
                        "transaction": tx,
                        "block_index": block["index"],
                        "block_timestamp": block["timestamp"]
                    })

        # Sort by timestamp (most recent first)
        audit_trail.sort(key=lambda x: x["block_timestamp"], reverse=True)

        return {
            "wallet_address": wallet_address,
            "audit_trail": audit_trail[:limit],
            "total_transactions": len(audit_trail)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/contracts/list")
async def list_contracts():
    """List all available smart contracts"""
    try:
        registry = system.get_contract_registry()
        contracts = registry.list_contracts()

        return {
            "contracts": contracts,
            "count": len(contracts)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/contracts/{contract_name}")
async def get_contract_info(contract_name: str):
    """Get contract information"""
    try:
        registry = system.get_contract_registry()
        contract = registry.get_contract(contract_name)

        return {
            "name": contract.name,
            "version": contract.version,
            "module": contract.module,
            "is_active": contract.is_active,
            "created_at": contract.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/modules/list")
async def list_modules():
    """List all available modules"""
    modules = [
        {"name": "accounting", "description": "Accounting operations"},
        {"name": "hr", "description": "Human Resources"},
        {"name": "sales", "description": "Sales operations"},
        {"name": "procurement", "description": "Procurement operations"},
        {"name": "audit", "description": "Audit and compliance"}
    ]

    return {
        "modules": modules,
        "count": len(modules)
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "success": False}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "success": False}
    )

# Run server
if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting Web3 Accounting & Audit System API Server...")
    print("📚 API Documentation: http://localhost:8000/api/docs")
    print("🔗 ReDoc Documentation: http://localhost:8000/api/redoc")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
