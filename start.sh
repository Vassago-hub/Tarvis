#!/bin/bash

echo ""
echo "========================================"
echo "  Page Agent Quick Start"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Node.js version
NODE_VERSION="v22.22.1"
NODE_BASE_URL="https://nodejs.org/dist/${NODE_VERSION}"

# Detect system architecture
detect_arch() {
    local arch=$(uname -m)
    case $arch in
        x86_64|amd64)
            echo "x64"
            ;;
        arm64|aarch64)
            echo "arm64"
            ;;
        *)
            echo "$arch"
            ;;
    esac
}

# Detect OS
detect_os() {
    local os=$(uname -s)
    case $os in
        Darwin)
            echo "darwin"
            ;;
        Linux)
            echo "linux"
            ;;
        *)
            echo "$os"
            ;;
    esac
}

# Download portable Node.js
download_portable_node() {
    local os=$(detect_os)
    local arch=$(detect_arch)
    local filename="node-${NODE_VERSION}-${os}-${arch}.tar.gz"
    local url="${NODE_BASE_URL}/${filename}"
    
    echo -e "${YELLOW}[INFO] Downloading Node.js ${NODE_VERSION} for ${os}-${arch}...${NC}"
    echo -e "${BLUE}[INFO] URL: ${url}${NC}"
    echo ""
    
    # Create .node directory
    mkdir -p .node
    
    # Download using curl or wget
    local tmp_file="/tmp/${filename}"
    
    if command -v curl &> /dev/null; then
        echo -e "${YELLOW}[INFO] Using curl to download...${NC}"
        curl -L --progress-bar -o "$tmp_file" "$url"
    elif command -v wget &> /dev/null; then
        echo -e "${YELLOW}[INFO] Using wget to download...${NC}"
        wget -q --show-progress -O "$tmp_file" "$url"
    else
        echo -e "${RED}[ERROR] Neither curl nor wget is available!${NC}"
        echo "Please install curl or wget first."
        exit 1
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Failed to download Node.js!${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}[INFO] Extracting Node.js to .node/ directory...${NC}"
    
    # Extract to .node directory (strip the top-level directory)
    tar -xzf "$tmp_file" -C .node --strip-components=1
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Failed to extract Node.js!${NC}"
        rm -f "$tmp_file"
        exit 1
    fi
    
    # Cleanup
    rm -f "$tmp_file"
    
    echo -e "${GREEN}[OK] Portable Node.js installed successfully!${NC}"
    echo ""
}

# Setup Node.js (system, portable, or download)
setup_node() {
    local node_cmd=""
    local npm_cmd=""
    
    # 1. Check system Node.js first
    if command -v node &> /dev/null; then
        node_cmd="node"
        npm_cmd="npm"
        echo -e "${GREEN}[INFO] Using system Node.js${NC}"
    # 2. Check portable Node.js
    elif [ -f "./.node/bin/node" ]; then
        node_cmd="./.node/bin/node"
        npm_cmd="./.node/bin/npm"
        echo -e "${GREEN}[INFO] Using portable Node.js from .node/${NC}"
    # 3. Download portable Node.js
    else
        echo -e "${YELLOW}[INFO] Node.js not found, downloading portable version...${NC}"
        echo ""
        download_portable_node
        node_cmd="./.node/bin/node"
        npm_cmd="./.node/bin/npm"
        echo -e "${GREEN}[INFO] Using portable Node.js from .node/${NC}"
    fi
    
    # Export for later use
    export NODE_CMD="$node_cmd"
    export NPM_CMD="$npm_cmd"
    
    # Verify Node.js works
    local version=$($node_cmd -v 2>/dev/null)
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Node.js is not working properly!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}[INFO] Node.js version: ${version}${NC}"
    
    # Verify npm works
    local npm_version=$($npm_cmd -v 2>/dev/null)
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] npm is not working properly!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}[INFO] npm version: ${npm_version}${NC}"
    echo ""
}

# Setup Node.js
setup_node

# Install dependencies
echo -e "${YELLOW}[STEP 1] Installing dependencies...${NC}"
echo ""
$NPM_CMD install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install dependencies!${NC}"
    exit 1
fi
echo ""
echo -e "${GREEN}[OK] Dependencies installed successfully!${NC}"
echo ""

# Build libraries (optional but recommended for first run)
echo -e "${YELLOW}[STEP 2] Building library packages...${NC}"
echo ""
$NPM_CMD run build:libs
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[WARN] Library build failed, but continuing...${NC}"
else
    echo -e "${GREEN}[OK] Libraries built successfully!${NC}"
fi
echo ""

# Start development server
echo -e "${YELLOW}[STEP 3] Starting Website development server...${NC}"
echo ""
echo "========================================"
echo "  Server will start at:"
echo "  http://localhost:5173"
echo "  Home page:"
echo "  http://localhost:5173/page-agent/"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Wait for server to be ready (max 60 seconds)
wait_for_server() {
    local port=5173
    local max_wait=60
    local waited=0
    
    echo -e "${YELLOW}[INFO] Waiting for server to start...${NC}"
    
    while [ $waited -lt $max_wait ]; do
        # Check if port is open using /dev/tcp or curl
        if command -v curl &> /dev/null; then
            curl -s -o /dev/null -w "%{http_code}" "http://localhost:${port}" 2>/dev/null | grep -q -E "[23][0-9][0-9]" && return 0
        else
            (echo > /dev/tcp/localhost/${port}) 2>/dev/null && return 0
        fi
        
        sleep 1
        waited=$((waited + 1))
        printf "."
    done
    
    echo ""
    echo -e "${YELLOW}[WARN] Server may not have started yet, opening browser anyway...${NC}"
    return 1
}

# Open browser function
open_browser() {
    local url="http://localhost:5173/page-agent/"
    echo ""
    echo -e "${GREEN}[INFO] Opening browser...${NC}"
    
    if command -v open &> /dev/null; then
        # macOS
        open "$url"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$url" > /dev/null 2>&1 &
    elif command -v x-www-browser &> /dev/null; then
        # Linux fallback
        x-www-browser "$url" > /dev/null 2>&1 &
    else
        echo -e "${YELLOW}[WARN] Could not detect browser, please open manually: ${url}${NC}"
        return 1
    fi
    
    echo -e "${GREEN}[OK] Browser opened!${NC}"
}

# Start server in background, then open browser
$NPM_CMD start &
SERVER_PID=$!

# Wait for server
wait_for_server

# Open browser
open_browser

echo ""
echo -e "${GREEN}[OK] Done! Server is running at http://localhost:5173${NC}"
echo -e "${GREEN}[OK] Home page: http://localhost:5173/page-agent/${NC}"
echo -e "${YELLOW}[INFO] Server PID: ${SERVER_PID}${NC}"
echo -e "${YELLOW}[INFO] Press Ctrl+C to stop the server${NC}"
echo ""

# Keep script running and forward signals
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
wait $SERVER_PID