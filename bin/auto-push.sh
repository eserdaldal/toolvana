
#!/bin/bash

# Change to project root directory
cd "$(dirname "$0")/.."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ ERROR: Not a git repository"
    exit 1
fi

# Check for changes
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No changes to commit"
    exit 0
fi

# Generate timestamp
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Add all changes
git add .

# Commit with timestamp
git commit -m "auto: updated on $timestamp"

# Push to remote
git push

echo "✅ Auto-push completed at $timestamp"
