
#!/bin/bash
# versionlog.sh - Professional changelog and version tracking system
# Author: Toolvana Project
# Version: 2.1
# Description: Generates detailed changelogs with modular section generation
# Last Updated: 2025-01-05

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/common.sh"

# === 📋 GLOBAL VARIABLES ===
PROJECT_NAME="toolvana"

# === 📊 CHANGELOG SECTION GENERATORS ===

# Generate changelog header
generate_changelog_header() {
    local version="$1"
    local timestamp time
    timestamp=$(date '+%Y-%m-%d')
    time=$(date '+%H:%M')
    
    cat << EOF
# 📋 Toolvana Professional Changelog

## 📅 Version $version — $timestamp | 🕓 $time

**Project:** Toolvana  
**Generated:** $(date '+%Y-%m-%d %H:%M:%S')  
**Status:** 🟢 Active Development

---

EOF
}

# Generate file structure changes section
generate_file_structure_section() {
    cat << EOF
## 🔧 File Structure Changes

EOF

    if [ -n "$ALL_NEW_FILES" ]; then
        echo "### ➕ **New Files Added**"
        for file in $ALL_NEW_FILES; do
            echo "- ➕ \`$file\`"
        done
        echo ""
    fi
    
    if [ -n "$ALL_MODIFIED_FILES" ]; then
        echo "### 🛠️ **Modified Files**"
        for file in $ALL_MODIFIED_FILES; do
            echo "- 🛠️ \`$file\`"
        done
        echo ""
    fi
    
    if [ -n "$ALL_DELETED_FILES" ]; then
        echo "### ❌ **Deleted Files**"
        for file in $ALL_DELETED_FILES; do
            echo "- ❌ ~~\`$file\`~~"
        done
        echo ""
    fi
    
    if [ -z "$ALL_NEW_FILES" ] && [ -z "$ALL_MODIFIED_FILES" ] && [ -z "$ALL_DELETED_FILES" ]; then
        echo "✅ No file structure changes detected"
        echo ""
    fi
}

# Generate frontend changes section
generate_frontend_section() {
    cat << EOF
## 🎨 Frontend Changes

EOF
    
    if [ "$HTML_CHANGES" = true ] || [ "$CSS_CHANGES" = true ] || [ "$JS_CHANGES" = true ]; then
        echo "### 🎨 **UI/UX Updates**"
        [ "$HTML_CHANGES" = true ] && echo "- 📝 HTML structure modifications"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS styling updates"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript functionality enhancements"
        echo ""
    else
        echo "✅ No frontend changes detected"
        echo ""
    fi
}

# Generate media and assets section
generate_assets_section() {
    cat << EOF
## 🖼️ Media & Assets

EOF
    
    if [ "$IMAGE_CHANGES" = true ]; then
        echo "### 🖼️ **Asset Updates**"
        echo "- 🖼️ Image assets modified or added"
        echo "- 📦 Asset optimization may be required"
        echo ""
    else
        echo "✅ No asset changes detected"
        echo ""
    fi
}

# Generate bug fixes and improvements section
generate_improvements_section() {
    cat << EOF
## 🐛 Bug Fixes & Improvements

EOF
    
    if [ "$JS_CHANGES" = true ] || [ "$CSS_CHANGES" = true ]; then
        echo "### 🔧 **Code Quality**"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript logic improvements"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS performance optimizations"
        echo ""
    else
        echo "✅ No bug fixes detected"
        echo ""
    fi
}

# Generate documentation section
generate_documentation_section() {
    cat << EOF
## 📚 Documentation

EOF
    
    if [ "$README_CHANGES" = true ]; then
        echo "### 🔄 **README Updates**"
        [ -f "readme_en.md" ] && git diff --name-only 2>/dev/null | grep -q "readme_en.md" && echo "- 🇺🇸 \`readme_en.md\` updated"
        [ -f "readme_tr.md" ] && git diff --name-only 2>/dev/null | grep -q "readme_tr.md" && echo "- 🇹🇷 \`readme_tr.md\` updated"
        [ -f "README.md" ] && git diff --name-only 2>/dev/null | grep -q "README.md" && echo "- 📄 \`README.md\` updated"
        echo ""
    else
        echo "✅ No documentation changes detected"
        echo ""
    fi
}

# Generate accessibility section
generate_accessibility_section() {
    cat << EOF
## ♿ Accessibility Enhancements

EOF
    
    if [ "$HTML_CHANGES" = true ]; then
        echo "### ✅ **Accessibility Review Required**"
        echo "- 🔍 HTML changes may affect accessibility"
        echo "- 📢 Screen reader compatibility should be verified"
        echo ""
    else
        echo "✅ No accessibility-related changes detected"
        echo ""
    fi
}

# Generate deployment notes section
generate_deployment_section() {
    cat << EOF
## 🚀 Deployment Notes

EOF
    
    if [ "$IMAGE_CHANGES" = true ] || [ "$CSS_CHANGES" = true ] || [ "$JS_CHANGES" = true ]; then
        echo "### ✅ **Deployment Considerations**"
        [ "$IMAGE_CHANGES" = true ] && echo "- 🖼️ Image assets updated - cache refresh may be required"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS changes - consider cache busting"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript updates - verify functionality"
        echo "- 🌐 Ready for Replit deployment"
        echo ""
    else
        echo "✅ No deployment considerations"
        echo ""
    fi
}

# Generate git sync log section
generate_git_sync_section() {
    cat << EOF
## 🔄 GitHub Sync Log

EOF
    
    # Check git status safely
    if command -v git >/dev/null 2>&1 && [ -d ".git" ]; then
        echo "### ✅ **Git Status**"
        if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
            echo "- ✅ Repository is clean and synced"
        else
            echo "- ⚠️ Repository has uncommitted changes"
            echo "- 🔄 Sync required with GitHub"
        fi
        
        if git remote get-url origin >/dev/null 2>&1; then
            echo "- 🔗 Remote repository: $(git remote get-url origin 2>/dev/null)"
        else
            echo "- ⚠️ No remote repository configured"
        fi
        echo ""
    else
        echo "- ⚠️ Git not initialized or not available"
        echo ""
    fi
}

# Generate version summary table
generate_version_summary() {
    local version="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M')
    
    cat << EOF
---

## 📊 Version Summary

| **Metric** | **Count** |
|------------|-----------|
| 📁 New Files | $(count_items "$ALL_NEW_FILES") |
| 🛠️ Modified Files | $(count_items "$ALL_MODIFIED_FILES") |
| ❌ Deleted Files | $(count_items "$ALL_DELETED_FILES") |
| 📅 Version | $version |
| 🕓 Generated | $timestamp |

## 🎯 Next Steps Checklist

- [ ] 👀 Review all changes listed above
- [ ] 🧪 Test functionality in development environment
- [ ] 📱 Verify UI/UX changes across devices
- [ ] ♿ Check accessibility compliance
- [ ] 📝 Commit changes to Git repository
- [ ] 🚀 Deploy to Replit (if ready)
- [ ] 📋 Update project documentation
- [ ] 🔄 Sync with GitHub using \`./bin/sync.sh\`

---

## 📈 Version History

EOF

    # Add version history safely
    echo "- **v$version** - $(date '+%Y-%m-%d %H:%M') (Current)"
    if [ -f "logs/.version_tracker" ]; then
        local prev_version
        prev_version=$(cat "logs/.version_tracker" 2>/dev/null || echo "Unknown")
        echo "- **v$prev_version** - Previous version"
    fi
    
    cat << EOF

---

**🔧 Generated by:** Toolvana Professional Version Control System  
**📍 Location:** \`logs/${PROJECT_NAME}_checklist_v$version.md\`  
**🔄 Auto-sync:** Ready for GitHub integration

EOF
}

# === 📋 MAIN CHANGELOG GENERATION ===
generate_changelog() {
    local version="$1"
    
    # Generate all sections using helper functions
    generate_header_section "$version"
    generate_file_structure_section_alt
    generate_frontend_section_alt
    generate_assets_section_alt
    generate_bugfix_section
    generate_documentation_section_alt
    generate_accessibility_section_alt
    generate_deployment_section_alt
    generate_git_status_section
    generate_version_summary_section "$version"
    generate_next_steps_section
    generate_version_history_section "$version"
    generate_footer_section "$version"
}

# === 📋 EXTRACTED HELPER FUNCTIONS ===

# Generate header section
generate_header_section() {
    local version="$1"
    local timestamp time
    timestamp=$(date '+%Y-%m-%d')
    time=$(date '+%H:%M')
    
    cat << EOF
# 📋 Toolvana Professional Changelog

## 📅 Version $version — $timestamp | 🕓 $time

**Project:** Toolvana  
**Generated:** $(date '+%Y-%m-%d %H:%M:%S')  
**Status:** 🟢 Active Development

---

EOF
}

# Generate file structure section
generate_file_structure_section_alt() {
    cat << EOF
## 🔧 File Structure Changes

EOF

    if [ -n "$ALL_NEW_FILES" ]; then
        echo "### ➕ **New Files Added**"
        for file in $ALL_NEW_FILES; do
            echo "- ➕ \`$file\`"
        done
        echo ""
    fi
    
    if [ -n "$ALL_MODIFIED_FILES" ]; then
        echo "### 🛠️ **Modified Files**"
        for file in $ALL_MODIFIED_FILES; do
            echo "- 🛠️ \`$file\`"
        done
        echo ""
    fi
    
    if [ -n "$ALL_DELETED_FILES" ]; then
        echo "### ❌ **Deleted Files**"
        for file in $ALL_DELETED_FILES; do
            echo "- ❌ ~~\`$file\`~~"
        done
        echo ""
    fi
    
    if [ -z "$ALL_NEW_FILES" ] && [ -z "$ALL_MODIFIED_FILES" ] && [ -z "$ALL_DELETED_FILES" ]; then
        echo "✅ No file structure changes detected"
        echo ""
    fi
}

# Generate frontend section
generate_frontend_section_alt() {
    cat << EOF
## 🎨 Frontend Changes

EOF
    
    if [ "$HTML_CHANGES" = true ] || [ "$CSS_CHANGES" = true ] || [ "$JS_CHANGES" = true ]; then
        echo "### 🎨 **UI/UX Updates**"
        [ "$HTML_CHANGES" = true ] && echo "- 📝 HTML structure modifications"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS styling updates"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript functionality enhancements"
        echo ""
    else
        echo "✅ No frontend changes detected"
        echo ""
    fi
}

# Generate assets section
generate_assets_section_alt() {
    cat << EOF
## 🖼️ Media & Assets

EOF
    
    if [ "$IMAGE_CHANGES" = true ]; then
        echo "### 🖼️ **Asset Updates**"
        echo "- 🖼️ Image assets modified or added"
        echo "- 📦 Asset optimization may be required"
        echo ""
    else
        echo "✅ No asset changes detected"
        echo ""
    fi
}

# Generate bugfix section
generate_bugfix_section() {
    cat << EOF
## 🐛 Bug Fixes & Improvements

EOF
    
    if [ "$JS_CHANGES" = true ] || [ "$CSS_CHANGES" = true ]; then
        echo "### 🔧 **Code Quality**"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript logic improvements"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS performance optimizations"
        echo ""
    else
        echo "✅ No bug fixes detected"
        echo ""
    fi
}

# Generate documentation section
generate_documentation_section_alt() {
    cat << EOF
## 📚 Documentation

EOF
    
    if [ "$README_CHANGES" = true ]; then
        echo "### 🔄 **README Updates**"
        [ -f "readme_en.md" ] && git diff --name-only 2>/dev/null | grep -q "readme_en.md" && echo "- 🇺🇸 \`readme_en.md\` updated"
        [ -f "readme_tr.md" ] && git diff --name-only 2>/dev/null | grep -q "readme_tr.md" && echo "- 🇹🇷 \`readme_tr.md\` updated"
        [ -f "README.md" ] && git diff --name-only 2>/dev/null | grep -q "README.md" && echo "- 📄 \`README.md\` updated"
        echo ""
    else
        echo "✅ No documentation changes detected"
        echo ""
    fi
}

# Generate accessibility section
generate_accessibility_section_alt() {
    cat << EOF
## ♿ Accessibility Enhancements

EOF
    
    if [ "$HTML_CHANGES" = true ]; then
        echo "### ✅ **Accessibility Review Required**"
        echo "- 🔍 HTML changes may affect accessibility"
        echo "- 📢 Screen reader compatibility should be verified"
        echo ""
    else
        echo "✅ No accessibility-related changes detected"
        echo ""
    fi
}

# Generate deployment section
generate_deployment_section_alt() {
    cat << EOF
## 🚀 Deployment Notes

EOF
    
    if [ "$IMAGE_CHANGES" = true ] || [ "$CSS_CHANGES" = true ] || [ "$JS_CHANGES" = true ]; then
        echo "### ✅ **Deployment Considerations**"
        [ "$IMAGE_CHANGES" = true ] && echo "- 🖼️ Image assets updated - cache refresh may be required"
        [ "$CSS_CHANGES" = true ] && echo "- 🎨 CSS changes - consider cache busting"
        [ "$JS_CHANGES" = true ] && echo "- ⚡ JavaScript updates - verify functionality"
        echo "- 🌐 Ready for Replit deployment"
        echo ""
    else
        echo "✅ No deployment considerations"
        echo ""
    fi
}

# Generate git status section
generate_git_status_section() {
    cat << EOF
## 🔄 GitHub Sync Log

EOF
    
    # Check git status safely
    if command -v git >/dev/null 2>&1 && [ -d ".git" ]; then
        echo "### ✅ **Git Status**"
        if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
            echo "- ✅ Repository is clean and synced"
        else
            echo "- ⚠️ Repository has uncommitted changes"
            echo "- 🔄 Sync required with GitHub"
        fi
        
        if git remote get-url origin >/dev/null 2>&1; then
            echo "- 🔗 Remote repository: $(git remote get-url origin 2>/dev/null)"
        else
            echo "- ⚠️ No remote repository configured"
        fi
        echo ""
    else
        echo "- ⚠️ Git not initialized or not available"
        echo ""
    fi
}

# Generate version summary section
generate_version_summary_section() {
    local version="$1"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M')
    
    cat << EOF
---

## 📊 Version Summary

| **Metric** | **Count** |
|------------|-----------|
| 📁 New Files | $(count_items "$ALL_NEW_FILES") |
| 🛠️ Modified Files | $(count_items "$ALL_MODIFIED_FILES") |
| ❌ Deleted Files | $(count_items "$ALL_DELETED_FILES") |
| 📅 Version | $version |
| 🕓 Generated | $timestamp |

EOF
}

# Generate next steps section
generate_next_steps_section() {
    cat << EOF
## 🎯 Next Steps Checklist

- [ ] 👀 Review all changes listed above
- [ ] 🧪 Test functionality in development environment
- [ ] 📱 Verify UI/UX changes across devices
- [ ] ♿ Check accessibility compliance
- [ ] 📝 Commit changes to Git repository
- [ ] 🚀 Deploy to Replit (if ready)
- [ ] 📋 Update project documentation
- [ ] 🔄 Sync with GitHub using \`./bin/sync.sh\`

---

EOF
}

# Generate version history section
generate_version_history_section() {
    local version="$1"
    
    cat << EOF
## 📈 Version History

EOF

    # Add version history safely
    echo "- **v$version** - $(date '+%Y-%m-%d %H:%M') (Current)"
    if [ -f "logs/.version_tracker" ]; then
        local prev_version
        prev_version=$(cat "logs/.version_tracker" 2>/dev/null || echo "Unknown")
        echo "- **v$prev_version** - Previous version"
    fi
    
    echo ""
}

# Generate footer section
generate_footer_section() {
    local version="$1"
    
    cat << EOF
---

**🔧 Generated by:** Toolvana Professional Version Control System  
**📍 Location:** \`logs/${PROJECT_NAME}_checklist_v$version.md\`  
**🔄 Auto-sync:** Ready for GitHub integration

EOF
}

# === 🔍 CHANGE DETECTION ===
detect_changes() {
    echo "🔍 Detecting changes in Toolvana project..."
    analyze_git_changes
}

# === 🚀 MAIN EXECUTION ===
main() {
    echo "🔍 Detecting changes in Toolvana project..."
    
    # Setup
    ensure_logs_dir
    initialize_update_log
    
    # Detect changes
    detect_changes
    
    # Get version
    local version
    version=$(get_next_version)
    
    # Generate changelog
    local changelog_file="logs/${PROJECT_NAME}_checklist_v${version}.md"
    echo "📋 Generating changelog: $changelog_file"
    
    generate_changelog "$version" > "$changelog_file"
    
    # Save version
    save_version "$version"
    
    # Log action
    log_action "success" "Version log v$version generated"
    
    echo "✅ Version log completed!"
    echo "📄 File: $changelog_file"
    echo "📅 Version: $version"
}

main "$@"
