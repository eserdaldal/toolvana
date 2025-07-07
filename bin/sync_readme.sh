
#!/bin/bash
# sync_readme.sh - Unified README management and synchronization
# Author: Toolvana Project  
# Version: 2.0
# Description: Generate, sync, and commit README files with language support
# Last Updated: 2025-01-05

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# === 📋 SCRIPT PARAMETERS ===
GENERATE=false
SYNC=false
COMMIT=false
ALL=false
DRY_RUN=false
SILENT=false
FORCE=false
HELP=false

# === 📁 FILE PATHS ===
README_EN_PATH="docs/readme_en.md"
README_TR_PATH="docs/readme_tr.md"

# === 📝 DEFAULT CONTENT ===
DEFAULT_EN_CONTENT="# Toolvana

**Solve Faster. Work Smarter.**

Toolvana is a modern and user-friendly platform that brings together online tools for daily needs under one roof."

DEFAULT_TR_CONTENT="# Toolvana

**Daha Hızlı Çöz. Daha Akıllı Çalış.**

Toolvana, günlük ihtiyaçlara yönelik çevrimiçi araçları tek bir çatı altında sunan modern ve kullanıcı dostu bir platformdur."

# Parse command line arguments
while [ $# -gt 0 ]; do
    case $1 in
        --generate)
            GENERATE=true
            shift
            ;;
        --sync)
            SYNC=true
            shift
            ;;
        --commit)
            COMMIT=true
            shift
            ;;
        --all)
            ALL=true
            shift
            ;;
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
📚 Toolvana README Management Tool

USAGE:
    ./bin/sync_readme.sh [OPTIONS]

OPTIONS:
    --generate    Generate README files from templates
    --sync        Sync README content between languages
    --commit      Commit README changes to git
    --all         Execute all operations (generate + sync + commit)
    --dry-run     Show what would be done without making changes
    --silent      Suppress non-essential output
    --force       Force operations even if no changes detected
    --help, -h    Show this help message

EXAMPLES:
    ./bin/sync_readme.sh --all               # Full README workflow
    ./bin/sync_readme.sh --generate --sync   # Generate and sync only
    ./bin/sync_readme.sh --commit --force    # Force commit README changes
    ./bin/sync_readme.sh --dry-run --all     # Preview all operations

DESCRIPTION:
    Manages README files in multiple languages (Turkish/English).
    Generates, synchronizes, and commits README changes automatically.

EOF
    exit 0
fi

# Set default behavior if no flags specified
if [ "$GENERATE" = false ] && [ "$SYNC" = false ] && [ "$COMMIT" = false ] && [ "$ALL" = false ]; then
    ALL=true
fi

# Utility functions
execute_command() {
    local cmd="$1"
    local description="$2"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "🔍 [DRY-RUN] Would execute: $description"
        return 0
    else
        log_info "🔄 $description..."
        eval "$cmd"
    fi
}

# === 📂 README FILE MANAGEMENT ===
ensure_readme_files_exist() {
    log_info "📂 Ensuring README source files exist..."
    
    # Ensure docs directory exists
    mkdir -p docs
    
    # Check and create English README if missing or empty
    if [ ! -f "$README_EN_PATH" ] || [ ! -s "$README_EN_PATH" ]; then
        log_info "📝 Creating default English README at $README_EN_PATH"
        echo "$DEFAULT_EN_CONTENT" > "$README_EN_PATH"
        log_success "✅ Default English README created"
    fi
    
    # Check and create Turkish README if missing or empty
    if [ ! -f "$README_TR_PATH" ] || [ ! -s "$README_TR_PATH" ]; then
        log_info "📝 Creating default Turkish README at $README_TR_PATH"
        echo "$DEFAULT_TR_CONTENT" > "$README_TR_PATH"
        log_success "✅ Default Turkish README created"
    fi
}

# === 📚 README GENERATION ===
generate_readme() {
    log_info "📝 Generating README files..."
    
    # Load English README content with fallback
    local en_content
    if [ -f "$README_EN_PATH" ] && [ -s "$README_EN_PATH" ]; then
        en_content=$(cat "$README_EN_PATH")
    else
        log_warning "⚠️ English README empty or missing, using default content"
        en_content="$DEFAULT_EN_CONTENT"
    fi
    
    # Generate main README.md from English version
    execute_command "echo \"$en_content\" > README.md" "Generating main README.md"
    
    # Add sync info
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    local sync_info="

---

**📋 Sync Info:** This README.md was automatically synced from \`$README_EN_PATH\` (English (default)) on $timestamp"
    
    if [ "$DRY_RUN" = false ]; then
        echo "$sync_info" >> README.md
    fi
    
    log_success "✅ README generation completed"
}

# === 🔄 README SYNC ===
sync_readme() {
    log_info "🔄 Syncing README files..."
    
    ensure_readme_files_exist
    generate_readme
    log_success "✅ README sync completed"
}

# === 📤 COMMIT CHANGES ===
commit_readme() {
    log_info "📤 Committing README changes..."
    
    if ! ensure_git_repo; then
        log_error "❌ Not a git repository"
        return 1
    fi
    
    # Check if README files have changes
    local readme_changed=false
    
    if git diff --name-only 2>/dev/null | grep -E "(README\.md|readme_.*\.md)" >/dev/null; then
        readme_changed=true
    elif git diff --cached --name-only 2>/dev/null | grep -E "(README\.md|readme_.*\.md)" >/dev/null; then
        readme_changed=true
    fi
    
    if [ "$readme_changed" = false ] && [ "$FORCE" = false ]; then
        log_success "✅ No README changes to commit"
        return 0
    fi
    
    # Stage README files
    execute_command "git add README.md docs/readme_*.md" "Staging README files"
    
    # Commit if there are staged changes
    if [ "$DRY_RUN" = false ]; then
        if git diff --cached --quiet 2>/dev/null; then
            log_success "✅ No staged README changes"
            return 0
        fi
    fi
    
    local version commit_msg
    version=$(get_next_version)
    commit_msg="📚 README update v$version - $(date '+%Y-%m-%d %H:%M')"
    
    execute_command "git commit -m \"$commit_msg\"" "Committing README changes"
    
    if [ "$DRY_RUN" = false ]; then
        log_action "success" "README committed v$version"
    fi
    
    log_success "✅ README commit completed"
}

# === 🚀 MAIN EXECUTION ===
main() {
    log_info "📚 Toolvana README Management Tool"
    log_info "=================================="
    
    if [ "$DRY_RUN" = true ]; then
        log_info "🔍 DRY-RUN MODE: No changes will be made"
    fi
    
    # Setup
    ensure_logs_dir
    initialize_update_log
    ensure_readme_files_exist
    
    # Execute requested operations
    if [ "$ALL" = true ]; then
        GENERATE=true
        SYNC=true
        COMMIT=true
    fi
    
    if [ "$GENERATE" = true ]; then
        generate_readme
    fi
    
    if [ "$SYNC" = true ]; then
        sync_readme
    fi
    
    if [ "$COMMIT" = true ]; then
        commit_readme
    fi
    
    log_success "🎉 README management completed!"
}

main "$@"
