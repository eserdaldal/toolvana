
#!/bin/bash
# sync.sh - Automated Git synchronization for Toolvana project
# Author: Toolvana Project
# Version: 2.0
# Description: Automatically sync all project changes to GitHub with intelligent change detection
# Last Updated: 2025-01-05

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/common.sh"

# === 📋 SCRIPT PARAMETERS ===
DRY_RUN=false
SILENT=false
FORCE=false
HELP=false

# Parse command line arguments
while [ $# -gt 0 ]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --silent)
            SILENT=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --help|-h)
            HELP=true
            shift
            ;;
        *)
            echo "❌ Unknown parameter: $1"
            echo "💡 Use --help for usage information"
            exit 1
            ;;
    esac
done

# Show help
if [ "$HELP" = true ]; then
    cat << 'EOF'
🚀 Toolvana Sync Tool - Automated Git Synchronization

USAGE:
    ./bin/sync.sh [OPTIONS]

OPTIONS:
    --dry-run     Show what would be done without making changes
    --silent      Suppress non-essential output
    --force       Force sync even if no changes detected
    --help, -h    Show this help message

EXAMPLES:
    ./bin/sync.sh                    # Normal sync operation
    ./bin/sync.sh --dry-run          # Preview changes
    ./bin/sync.sh --silent --force   # Force sync quietly

DESCRIPTION:
    Automatically detects and syncs all project changes to GitHub.
    Handles git operations safely with proper error handling.

EOF
    exit 0
fi

# Utility function for command execution with dry-run support
execute_command() {
    local cmd="$1"
    local description="$2"
    
    if [ "$DRY_RUN" = true ]; then
        log_output "🔍 [DRY-RUN] Would execute: $description"
        return 0
    else
        log_output "🔄 $description..."
        eval "$cmd"
    fi
}

# === 🚀 MAIN SYNC LOGIC ===
main() {
    log_output "🚀 Toolvana Git Sync Tool"
    log_output "========================="
    
    if [ "$DRY_RUN" = true ]; then
        log_output "🔍 DRY-RUN MODE: No changes will be made"
    fi
    
    # Setup
    ensure_git_repo || exit 1
    ensure_logs_dir
    initialize_update_log
    cleanup_git_locks
    setup_ssh_agent
    
    # Check for changes and unpushed commits
    local has_changes=false
    local has_unpushed=false
    
    if has_local_changes; then
        has_changes=true
        log_output "📋 Local changes detected"
    fi
    
    if has_unpushed_commits; then
        has_unpushed=true
        log_output "📤 Unpushed commits detected"
    fi
    
    # If no changes and no unpushed commits, and not forced
    if [ "$has_changes" = false ] && [ "$has_unpushed" = false ] && [ "$FORCE" = false ]; then
        log_output "✅ Repository is clean - no changes to sync"
        exit 0
    fi
    
    # If forced but no actual changes
    if [ "$has_changes" = false ] && [ "$has_unpushed" = false ] && [ "$FORCE" = true ]; then
        log_output "💪 Force mode: Creating sync commit even without changes"
        has_changes=true
    fi
    
    # Process local changes
    if [ "$has_changes" = true ]; then
        log_output "📋 Processing local changes..."
        
        # Git operations
        execute_command "git add -A" "Adding all changes to staging"
        
        # Generate commit message
        local version commit_msg
        version=$(get_next_version)
        commit_msg="🚀 Auto-sync v$version - $(date '+%Y-%m-%d %H:%M')"
        
        execute_command "git commit -m \"$commit_msg\"" "Committing changes"
        
        # Force add log files
        if [ "$DRY_RUN" = false ]; then
            force_add_log_files
        fi
        
        log_output "📅 Version: $version"
    fi
    
    # Push to remote (both new commits and unpushed commits)
    if [ "$has_changes" = true ] || [ "$has_unpushed" = true ]; then
        if [ "$DRY_RUN" = false ]; then
            if push_to_remote 3; then
                log_action "success" "Git sync completed successfully"
                log_output "✅ Sync completed successfully!"
            else
                log_action "error" "Git sync failed"
                log_output "❌ Sync failed!"
                exit 1
            fi
        else
            log_output "🔍 [DRY-RUN] Would push changes to remote repository"
        fi
    fi
    
    log_output "🔗 Repository: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
}

main "$@"
