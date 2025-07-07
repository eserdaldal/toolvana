
#!/bin/bash
# viewlog.sh - Professional changelog viewer and version log manager
# Author: Toolvana Project
# Version: 2.1
# Description: View, generate, and manage Toolvana project changelogs and version logs
# Last Updated: 2025-01-05

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/common.sh"

# === 📋 SCRIPT PARAMETERS ===
GENERATE=false
LIST=false
LATEST=false
SILENT=false
HELP=false
VERSION_ARG=""

# Parse command line arguments
while [ $# -gt 0 ]; do
    case $1 in
        --generate)
            GENERATE=true
            shift
            ;;
        --list)
            LIST=true
            shift
            ;;
        --latest)
            LATEST=true
            shift
            ;;
        --version)
            VERSION_ARG="$2"
            shift 2
            ;;
        --silent)
            SILENT=true
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
📋 Toolvana Version Log Manager

USAGE:
    ./bin/viewlog.sh [OPTIONS]

OPTIONS:
    --generate        Generate new version log/changelog
    --latest          View the latest changelog (default)
    --list            List all available changelogs
    --version VER     View specific version changelog
    --silent          Suppress non-essential output
    --help, -h        Show this help message

EXAMPLES:
    ./bin/viewlog.sh                    # View latest changelog
    ./bin/viewlog.sh --generate         # Generate new changelog
    ./bin/viewlog.sh --list             # List all changelogs
    ./bin/viewlog.sh --version 1.05     # View specific version

DESCRIPTION:
    View and manage professional changelogs and version logs for the
    Toolvana project. Supports generation, viewing, and listing of all
    version logs with detailed change tracking.

EOF
    exit 0
fi

# Set default behavior
if [ "$GENERATE" = false ] && [ "$LIST" = false ] && [ -z "$VERSION_ARG" ]; then
    LATEST=true
fi

# Configuration
PROJECT_NAME="toolvana"

# Utility functions
log_output() {
    if [ "$SILENT" = false ]; then
        echo "$@"
    fi
}

# === 📋 CHANGELOG GENERATION ===
generate_new_changelog() {
    log_output "📋 Generating new changelog via versionlog.sh..."
    
    # Explicitly call versionlog.sh script
    local versionlog_script="$SCRIPT_DIR/versionlog.sh"
    
    if [ ! -f "$versionlog_script" ]; then
        log_output "❌ versionlog.sh not found at: $versionlog_script"
        return 1
    fi
    
    if [ ! -x "$versionlog_script" ]; then
        log_output "❌ versionlog.sh is not executable"
        return 1
    fi
    
    # Execute versionlog.sh with proper error handling
    if "$versionlog_script"; then
        log_output "✅ Changelog generation completed successfully"
        return 0
    else
        log_output "❌ Failed to generate changelog"
        return 1
    fi
}

# === 📄 VIEW LATEST CHANGELOG ===
view_latest() {
    log_output "📋 Toolvana Changelog Viewer"
    log_output "============================"
    
    local latest_file
    latest_file=$(get_latest_changelog_file)
    
    if [ -z "$latest_file" ]; then
        show_no_changelog_message
        return 1
    fi
    
    if ! validate_file "$latest_file" "changelog"; then
        return 1
    fi
    
    print_changelog_metadata "$latest_file"
    
    if ! display_changelog_content "$latest_file"; then
        return 1
    fi
    
    log_output ""
    log_output "🔍 Use --list to see all available changelogs"
}

# === 📋 LIST ALL CHANGELOGS ===
list_changelogs() {
    log_output "📋 Available Toolvana Changelogs"
    log_output "================================"
    
    local changelog_files
    changelog_files=$(get_all_changelog_files)
    
    if [ -z "$changelog_files" ]; then
        show_no_changelog_message_for_list
        return 1
    fi
    
    display_changelog_list "$changelog_files"
    
    local total_count
    total_count=$(echo "$changelog_files" | wc -l)
    log_output ""
    log_output "📈 Total changelog files: $total_count"
    log_output ""
    log_output "💡 Use --version X.XX to view a specific version"
    log_output "💡 Use --latest to view the most recent changelog"
}

# === 🔍 VIEW SPECIFIC VERSION ===
view_version() {
    local version="$1"
    local version_file
    version_file=$(get_version_changelog_file "$version")
    
    log_output "📋 Viewing Changelog v$version"
    log_output "=============================="
    
    if ! validate_file "$version_file" "changelog v$version"; then
        log_output "💡 Available versions:"
        list_changelogs
        return 1
    fi
    
    print_changelog_metadata "$version_file"
    
    if ! display_changelog_content "$version_file"; then
        return 1
    fi
}

# === 🚀 MAIN EXECUTION ===
main() {
    # Setup
    ensure_logs_dir
    
    # Execute requested operation
    if [ "$GENERATE" = true ]; then
        generate_new_changelog
    elif [ "$LIST" = true ]; then
        list_changelogs
    elif [ -n "$VERSION_ARG" ]; then
        view_version "$VERSION_ARG"
    elif [ "$LATEST" = true ]; then
        view_latest
    fi
}

# === 📋 EXTRACTED HELPER FUNCTIONS ===

# Get latest changelog file
get_latest_changelog_file() {
    ls -t logs/${PROJECT_NAME}_checklist_v*.md 2>/dev/null | head -1 || echo ""
}

# Show message when no changelog files found
show_no_changelog_message() {
    log_output "❌ No changelog files found in logs directory."
    log_output "💡 Run ./bin/viewlog.sh --generate to create a changelog first."
}

# Show message when no changelog files found for listing
show_no_changelog_message_for_list() {
    log_output "❌ No changelog files found in logs directory."
    log_output "💡 Run ./bin/viewlog.sh --generate to create changelogs."
}

# Print changelog file metadata
print_changelog_metadata() {
    local file="$1"
    log_output "📄 Latest changelog: $(basename "$file")"
    log_output "📊 File size: $(wc -c < "$file") bytes"
    log_output "📅 Last modified: $(date -r "$file" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "Unknown")"
    log_output ""
}

# Display changelog content
display_changelog_content() {
    local file="$1"
    if ! cat "$file"; then
        log_output "❌ Failed to display changelog content."
        return 1
    fi
    return 0
}

# Get all changelog files
get_all_changelog_files() {
    ls -t logs/${PROJECT_NAME}_checklist_v*.md 2>/dev/null || echo ""
}

# Display changelog list with formatting
display_changelog_list() {
    local changelog_files="$1"
    local count=0
    echo "$changelog_files" | while IFS= read -r file; do
        if [ -n "$file" ]; then
            count=$((count + 1))
            local version size date
            version=$(basename "$file" | sed 's/.*_v\([0-9.]*\)\.md/\1/')
            size=$(wc -c < "$file" 2>/dev/null || echo "0")
            date=$(date -r "$file" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "Unknown")
            
            printf "📄 v%-8s │ %8s bytes │ %s │ %s\n" "$version" "$size" "$date" "$(basename "$file")"
        fi
    done
}

# Get version-specific changelog file path
get_version_changelog_file() {
    local version="$1"
    echo "logs/${PROJECT_NAME}_checklist_v${version}.md"
}

main "$@"
