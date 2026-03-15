#!/bin/bash
# Deploy script for cloud-vibe

set -e

echo "[cloud-vibe] Starting deployment..."

# Install dependencies
echo "[1/5] Installing dependencies..."
npm ci

# Build
echo "[2/5] Building..."
npm run build

echo "[3/5] Build complete."
echo "Now start/restart the PM2 process:"
echo "  pm2 restart cloud-vibe || pm2 start npm --name cloud-vibe -- start"
