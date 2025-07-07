
#!/bin/bash
# common.sh - Shared utility functions for Toolvana project scripts
# Author: Toolvana Project
# Version: 2.1
# Description: Organized utility functions with logical grouping
# Last Updated: 2025-01-05

# === 🔧 FILE & DIRECTORY UTILITIES ===

# Ensure logs directory exists
ensure_logs_dir() {
    mkdir -p logs
}

# Validate file exists and is readable
validate_file() {
    local file="$1"
    local description="${2:-file}"
    
    if [ ! -f "$file" ]; then
        echo "❌ ERROR: $description '$file' not found!"
        return 1
    fi
    
    if [ ! -r "$file" ]; then
        echo "❌ ERROR: $description '$file' is not readable!"
        return 1
    fi
    
    if [ ! -s "$file" ]; then
        echo "❌ ERROR: $description '$file' is empty!"
        return 1
    fi
    
    return 0
}

# === 📝 LOGGING UTILITIES ===

# Print log message conditionally based on SILENT flag
log_output() {
    if [ "$SILENT" != true ]; then
        echo "$@"
    fi
}

# Professional logging functions with consistent formatting
log_info() {
    echo "ℹ️  INFO: $*"
}

log_success() {
    echo "✅ SUCCESS: $*"
}

log_warning() {
    echo "⚠️  WARNING: $*"
}

log_error() {
    echo "❌ ERROR: $*"
}

# Initialize update log file
initialize_update_log() {
    local update_log="${1:-logs/update.log}"
    
    if [ ! -f "$update_log" ]; then
        cat > "$update_log" << 'EOF'
# 🚀 TOOLVANA PROJECT - UPDATE LOG
# Professional logging system for tracking all project updates
# Format: [STATUS] [DATE TIME] [VERSION] [MESSAGE]

================================================================================
📋 PROJECT: Toolvana - Modern Online Tools Platform
🌐 WEBSITE: https://toolvana.app
📦 GITHUB: https://github.com/eserdaldal/toolvana
================================================================================

EOF
    fi
}

# Log actions consistently
log_action() {
    local status="$1"
    local message="$2"
    local update_log="${3:-logs/update.log}"
    local version_file="${4:-logs/.version_tracker}"
    
    log_action_prepare_data "$status" "$version_file"
    log_action_write_log "$status" "$message" "$update_log" "$version_file"
    log_action_display_result "$message" "$version_file"
}

# Prepare timestamp, version, and emoji data for logging
log_action_prepare_data() {
    local status="$1"
    local version_file="$2"
    
    export LOG_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    export LOG_VERSION=$(get_next_version "$version_file")
    export LOG_EMOJI=$(get_status_emoji "$status")
}

# Write log entry to file
log_action_write_log() {
    local status="$1"
    local message="$2"
    local update_log="$3"
    local version_file="$4"
    
    save_version "$LOG_VERSION" "$version_file"
    echo "$LOG_EMOJI [$LOG_TIMESTAMP] V$LOG_VERSION $message" >> "$update_log"
}

# Display logging result to user
log_action_display_result() {
    local message="$1"
    local version_file="$2"
    
    echo "📋 Logged: V$LOG_VERSION - $message"
}

# Get emoji for status type
get_status_emoji() {
    local status="$1"
    case "$status" in
        success) echo "✅" ;;
        error) echo "❌" ;;
        new) echo "➕" ;;
        clean) echo "🧹" ;;
        warning) echo "⚠️" ;;
        *) echo "📄" ;;
    esac
}

# === 🔢 VERSION MANAGEMENT ===

# Get next version number
get_next_version() {
    local version_file="${1:-logs/.version_tracker}"
    
    if [ ! -f "$version_file" ]; then
        echo "1.01"
        return
    fi
    
    local current_version major minor
    current_version=$(cat "$version_file" 2>/dev/null || echo "1.00")
    
    # Extract major and minor versions safely
    major=$(echo "$current_version" | cut -d'.' -f1)
    minor=$(echo "$current_version" | cut -d'.' -f2)
    
    # Ensure we have valid numbers with default fallbacks
    major=${major:-1}
    minor=${minor:-0}
    
    # Convert to decimal using base 10 to avoid octal parsing issues
    major=$((10#$major))
    minor=$((10#$minor))
    
    # Increment logic: 1.01 → 1.02 → ... → 1.99 → 2.00
    if [ "$minor" -ge 99 ]; then
        major=$((major + 1))
        minor=1
    else
        minor=$((minor + 1))
    fi
    
    printf "%d.%02d" "$major" "$minor"
}

# Save version to file
save_version() {
    local version="$1"
    local version_file="${2:-logs/.version_tracker}"
    echo "$version" > "$version_file"
}

# === 🐙 GIT UTILITIES ===

# Check if we're in a git repository
ensure_git_repo() {
    if [ ! -d ".git" ]; then
        echo "❌ ERROR: Not a git repository"
        return 1
    fi
    return 0
}

# Git lock cleanup - Enhanced safety
cleanup_git_locks() {
    local git_dir=".git"
    
    if [ ! -d "$git_dir" ]; then
        return 0
    fi
    
    # Common lock files that can cause issues
    local lock_files="
        $git_dir/index.lock
        $git_dir/refs/remotes/origin/main.lock
        $git_dir/refs/remotes/origin/master.lock
        $git_dir/HEAD.lock
        $git_dir/config.lock
    "
    
    for lock_file in $lock_files; do
        if [ -f "$lock_file" ]; then
            echo "⚠️  Removing stale lock: $(basename "$lock_file")"
            rm -f "$lock_file" 2>/dev/null || echo "⚠️  Could not remove $lock_file"
        fi
    done
}

# Git status checks
has_local_changes() {
    [ -n "$(git status --porcelain 2>/dev/null)" ]
}

has_unpushed_commits() {
    local unpushed
    unpushed=$(git rev-list --count HEAD ^origin/main 2>/dev/null || git rev-list --count HEAD ^origin/master 2>/dev/null || echo "0")
    [ "$unpushed" -gt 0 ]
}

# Check remote repository
check_remote() {
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo "❌ ERROR: No remote origin configured"
        return 1
    fi
    return 0
}

# Force add log files
force_add_log_files() {
    echo "📂 Adding essential log files..."
    git add -f logs/update.log logs/.version_tracker 2>/dev/null || echo "⚠️  Log files could not be added. Continuing..."
}

# Push changes to remote repository with retry logic
push_to_remote() {
    local max_retries="${1:-3}"
    
    echo "🔄 Pushing changes to remote repository..."
    
    push_to_remote_validate_setup || return 1
    
    local current_branch
    current_branch=$(push_to_remote_get_branch) || return 1
    
    echo "📤 Pushing to branch: $current_branch"
    
    push_with_retry "$current_branch" "$max_retries"
}

# Validate remote repository setup
push_to_remote_validate_setup() {
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo "❌ No remote origin configured"
        return 1
    fi
    return 0
}

# Get and validate current branch name
push_to_remote_get_branch() {
    local current_branch
    current_branch=$(get_current_branch)
    
    if [ -z "$current_branch" ]; then
        echo "❌ Could not determine current branch"
        return 1
    fi
    
    echo "$current_branch"
    return 0
}

# Get current git branch name safely
get_current_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ""
}

# Push with retry logic and fallback attempts
push_with_retry() {
    local current_branch="$1"
    local max_retries="$2"
    local retry_count=0
    
    while [ "$retry_count" -lt "$max_retries" ]; do
        retry_count=$((retry_count + 1))
        
        if [ "$retry_count" -gt 1 ]; then
            echo "🔄 Retry attempt $retry_count/$max_retries..."
            sleep 2
        fi
        
        # Try to push to current branch first
        if git push origin "$current_branch" 2>/dev/null; then
            echo "✅ Successfully pushed to remote repository ($current_branch)!"
            return 0
        fi
        
        # Try fallback pushes
        if try_fallback_push "$current_branch"; then
            return 0
        fi
        
        if [ "$retry_count" -lt "$max_retries" ]; then
            echo "⚠️ Push failed, retrying in 2 seconds..."
        fi
    done
    
    echo "❌ Failed to push to remote repository after $max_retries attempts"
    echo "🔒 Check your credentials, network connection, and branch permissions"
    return 1
}

# Try fallback pushes to common branch names
try_fallback_push() {
    local current_branch="$1"
    
    for branch in main master; do
        if [ "$branch" != "$current_branch" ]; then
            echo "🔄 Trying fallback push to $branch..."
            if git push origin "$current_branch:$branch" 2>/dev/null; then
                echo "✅ Successfully pushed to remote repository ($branch)!"
                return 0
            fi
        fi
    done
    
    return 1
}

# === 🔐 SSH & AUTHENTICATION ===

# SSH agent setup - Enhanced for Replit
setup_ssh_agent() {
    local ssh_key
    ssh_key=$(detect_ssh_key)
    
    setup_ssh_agent_handle_key "$ssh_key"
}

# Handle SSH key setup or fallback to HTTPS
setup_ssh_agent_handle_key() {
    local ssh_key="$1"
    
    if [ -n "$ssh_key" ]; then
        setup_ssh_agent_configure_key "$ssh_key"
    else
        setup_ssh_agent_fallback_https
    fi
}

# Configure SSH key with agent
setup_ssh_agent_configure_key() {
    local ssh_key="$1"
    
    echo "🔐 SSH key found: $(basename "$ssh_key")"
    ensure_ssh_agent_running
    add_ssh_key "$ssh_key"
}

# Fallback to HTTPS authentication
setup_ssh_agent_fallback_https() {
    echo "ℹ️  No SSH keys found - using HTTPS authentication"
}

# Detect available SSH key in common locations
detect_ssh_key() {
    local ssh_keys="$HOME/.ssh/id_rsa $HOME/.ssh/id_ed25519 $HOME/.ssh/id_ecdsa"
    
    for ssh_key in $ssh_keys; do
        if [ -f "$ssh_key" ]; then
            echo "$ssh_key"
            return 0
        fi
    done
    
    echo ""
    return 1
}

# Ensure SSH agent is running
ensure_ssh_agent_running() {
    if ! pgrep -x ssh-agent >/dev/null 2>&1; then
        eval "$(ssh-agent -s)" >/dev/null 2>&1
    fi
}

# Add SSH key with timeout protection
add_ssh_key() {
    local ssh_key="$1"
    
    if timeout 10 ssh-add "$ssh_key" >/dev/null 2>&1; then
        echo "✅ SSH key added successfully"
    else
        echo "⚠️  Warning: Could not add SSH key (timeout or error)"
    fi
}

# === 📊 CHANGELOG GENERATION UTILITIES ===

# Helper function to count items in space-separated string
count_items() {
    local items="$1"
    if [ -z "$items" ]; then
        echo "0"
    else
        echo "$items" | wc -w
    fi
}

# Analyze git changes and set global variables
analyze_git_changes() {
    analyze_git_changes_init_vars
    analyze_git_changes_process_status
    analyze_git_changes_export_results
}

# Initialize variables for git change analysis
analyze_git_changes_init_vars() {
    export GIT_NEW_FILES=""
    export GIT_MODIFIED_FILES=""
    export GIT_DELETED_FILES=""
    export GIT_HTML_CHANGES=false
    export GIT_CSS_CHANGES=false
    export GIT_JS_CHANGES=false
    export GIT_IMAGE_CHANGES=false
    export GIT_README_CHANGES=false
}

# Process git status output line by line
analyze_git_changes_process_status() {
    while IFS= read -r line; do
        if [ -z "$line" ]; then continue; fi
        
        local status file
        parse_git_status_line "$line" status file
        
        analyze_git_changes_categorize_file "$status" "$file"
        analyze_file_type "$file" GIT_HTML_CHANGES GIT_CSS_CHANGES GIT_JS_CHANGES GIT_IMAGE_CHANGES GIT_README_CHANGES
        
    done < <(git status --porcelain 2>/dev/null || echo "")
}

# Categorize files by git status
analyze_git_changes_categorize_file() {
    local status="$1"
    local file="$2"
    
    case "$status" in
        "A "|"A") GIT_NEW_FILES="$GIT_NEW_FILES $file" ;;
        "M "|"M") GIT_MODIFIED_FILES="$GIT_MODIFIED_FILES $file" ;;
        "D "|"D") GIT_DELETED_FILES="$GIT_DELETED_FILES $file" ;;
        "??") GIT_NEW_FILES="$GIT_NEW_FILES $file" ;;
    esac
}

# Export analysis results for global use
analyze_git_changes_export_results() {
    export ALL_NEW_FILES="$GIT_NEW_FILES"
    export ALL_MODIFIED_FILES="$GIT_MODIFIED_FILES"
    export ALL_DELETED_FILES="$GIT_DELETED_FILES"
    export HTML_CHANGES=$GIT_HTML_CHANGES
    export CSS_CHANGES=$GIT_CSS_CHANGES
    export JS_CHANGES=$GIT_JS_CHANGES
    export IMAGE_CHANGES=$GIT_IMAGE_CHANGES
    export README_CHANGES=$GIT_README_CHANGES
}

# Parse git status line into status and file components
parse_git_status_line() {
    local line="$1"
    local status_var="$2"
    local file_var="$3"
    
    eval "$status_var"='$(echo "$line" | cut -c1-2)'
    eval "$file_var"='$(echo "$line" | cut -c4-)'
}

# Analyze file type and update change flags
analyze_file_type() {
    local file="$1"
    local html_var="$2"
    local css_var="$3"
    local js_var="$4"
    local image_var="$5"
    local readme_var="$6"
    
    case "$file" in
        *.html) eval "$html_var=true" ;;
        *.css) eval "$css_var=true" ;;
        *.js) eval "$js_var=true" ;;
        *.png|*.jpg|*.jpeg|*.gif|*.svg|*.ico) eval "$image_var=true" ;;
        readme_*.md|README.md) eval "$readme_var=true" ;;
    esac
}
