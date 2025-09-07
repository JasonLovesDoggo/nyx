#!/bin/zsh

# generate-project-images.sh - Batch generate GitHub project images
# This script uses a predefined mapping to generate images with correct filenames

set -e
# Script directory
SCRIPT_DIR="$(dirname "$0")"

# Output directory for project images
OUTPUT_DIR="../static/projects"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Source the project repository mappings
source "$SCRIPT_DIR/project-repos.sh"

echo "=========================================="
echo "Generating project images"
echo "Output directory: $OUTPUT_DIR"
echo "Total projects: ${#PROJECT_REPOS}"
echo "=========================================="

# Counter for progress
count=0
total=${#PROJECT_REPOS}

# Process each project
# shellcheck disable=SC2296
for project_name in ${(@k)PROJECT_REPOS}; do
  repo_url="${PROJECT_REPOS[$project_name]}"
    count=$((count + 1))
    
    echo ""
    echo "[$count/$total] Processing: $project_name"
    echo "  Repository: $repo_url"
    echo "------------------------------------------"
    
    # Call fetch-repo-image.sh with project name and repo URL
    if "$SCRIPT_DIR/fetch-repo-image.sh" "$repo_url" "$project_name" "$OUTPUT_DIR"; then
        echo "✓ Successfully processed $project_name"
    else
        echo "✗ Failed to process $project_name"
        # Continue with next repo even if one fails
        continue
    fi
    
    # Add a small delay to be nice to the API
    sleep 1
done

echo ""
echo "=========================================="
echo "Project image generation complete!"
echo "Images saved to: $OUTPUT_DIR"
echo "=========================================="

# List generated files (only WebP files should remain)
echo ""
echo "Generated files:"
ls -lh "$OUTPUT_DIR"/*.webp 2>/dev/null || echo "No files generated"