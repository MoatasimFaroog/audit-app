#!/bin/bash

# Web3 Accounting & Audit System - Startup Script
# This script starts both the backend API server and frontend UI

echo "=========================================="
echo "Web3 Accounting & Audit System"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.11 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found${NC}"

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo -e "${BLUE}Python version: $PYTHON_VERSION${NC}"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip3 is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ pip3 found${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Frontend will not be available.${NC}"
    echo -e "${YELLOW}   Install Node.js 18+ to run the frontend UI.${NC}"
    NODE_AVAILABLE=false
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
    NODE_AVAILABLE=true
fi

echo ""
echo "=========================================="
echo "Starting Backend API Server..."
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install Python dependencies
echo -e "${BLUE}Installing/Updating Python dependencies...${NC}"
pip install -r requirements.txt --quiet

# Start the backend server in the background
echo -e "${GREEN}Starting FastAPI server on http://localhost:8000${NC}"
echo -e "${BLUE}API Documentation: http://localhost:8000/api/docs${NC}"
echo ""

cd server
python3 api.py &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✓ Backend API server started (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}❌ Backend server failed to start${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "Starting Frontend UI..."
echo "=========================================="

if [ "$NODE_AVAILABLE" = true ]; then
    cd frontend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing Node.js dependencies (this may take a few minutes)...${NC}"
        npm install
    fi

    # Start the frontend server
    echo -e "${GREEN}Starting Next.js frontend on http://localhost:3000${NC}"
    echo ""
    npm run dev &
    FRONTEND_PID=$!

    cd ..

    echo -e "${GREEN}✓ Frontend UI server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping frontend (Node.js not available)${NC}"
fi

echo ""
echo "=========================================="
echo "System Started Successfully!"
echo "=========================================="
echo ""
echo -e "${GREEN}✓ Backend API:${NC}      http://localhost:8000"
echo -e "${GREEN}✓ API Docs:${NC}         http://localhost:8000/api/docs"

if [ "$NODE_AVAILABLE" = true ]; then
    echo -e "${GREEN}✓ Frontend UI:${NC}      http://localhost:3000"
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"

    # Kill backend
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend server stopped${NC}"
    fi

    # Kill frontend
    if [ "$NODE_AVAILABLE" = true ] && ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend server stopped${NC}"
    fi

    # Deactivate virtual environment
    deactivate

    echo ""
    echo -e "${BLUE}All services stopped. Goodbye!${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
