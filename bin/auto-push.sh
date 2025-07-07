
#!/bin/bash
# auto-push.sh - Automatic Git push script
# Author: Toolvana Project
# Description: Automatically detect changes and push to Git repository
# Usage: ./bin/auto-push.sh

set -e

# Change to project root directory
cd "$(dirname "$0")/.."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ ERROR: Not a git repository"
    exit 1
fi

# Check for changes using git status --porcelain
changes=$(git status --porcelain 2>/dev/null)

# If no changes detected, exit silently
if [ -z "$changes" ]; then
    exit 0
fi

# Generate timestamp for commit message
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Add all changes
git add .

# Commit with automatic message
git commit -m "auto: automatic update [$timestamp]"

# Push to remote repository
git push

echo "✅ Auto-push completed at $timestamp"
