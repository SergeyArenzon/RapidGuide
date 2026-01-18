#!/bin/bash
# Docker and Kind cleanup script
# Use this script to free up disk space when developing with Docker and Kind

set -e

echo "🧹 Starting Docker cleanup..."

# Clean up Docker system (images, containers, build cache)
echo "📦 Cleaning Docker images, containers, and build cache..."
docker system prune -a -f --volumes || true

# Clean Docker build cache
echo "🗑️  Cleaning Docker build cache..."
docker builder prune -a -f || true

# Clean up old images from Kind cluster
if docker ps | grep -q kind-control-plane; then
    echo "🎯 Cleaning old images from Kind cluster..."
    docker exec kind-control-plane ctr -n k8s.io images ls 2>/dev/null | \
        grep "sergeyarenzon/huddlehub" | \
        awk '{print $1}' | \
        xargs -r -I {} docker exec kind-control-plane ctr -n k8s.io images rm {} 2>/dev/null || true
    echo "✅ Kind cleanup complete"
else
    echo "⚠️  Kind cluster not running, skipping Kind cleanup"
fi

# Show disk usage
echo ""
echo "📊 Current Docker disk usage:"
docker system df

echo ""
echo "✅ Cleanup complete!"

