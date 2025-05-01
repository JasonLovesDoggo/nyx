#!/bin/bash

# jpg2webp.sh - Convert all JPEG images in current directory to WebP format
# with quality set to 50

# Check if cwebp is installed
if ! command -v cwebp &>/dev/null; then
    echo "Error: cwebp is not installed. Please install it first."
    echo "On Debian/Ubuntu: sudo apt install webp"
    echo "On Fedora/RHEL/openSUSE: sudo dnf install libwebp-tools"
    exit 1
fi

# Find all JPEG files (case insensitive)
jpeg_files=$(find . -maxdepth 2 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -name "*.png" \) | sort)

# Check if any JPEG files were found
if [ -z "$jpeg_files" ]; then
    echo "No JPEG files found in the current directory."
    exit 0
fi

# Count total files for progress tracking
total_files=$(echo "$jpeg_files" | wc -l)
current_file=0

echo "Converting $total_files JPEG files to WebP format with quality 50..."
echo "-------------------------------------------------------------------"

# Process each JPEG file
echo "$jpeg_files" | while read -r jpeg_file; do
    # Skip if not a file (extra safety check)
    if [ ! -f "$jpeg_file" ]; then
        continue
    fi
    
    # Extract filename without extension
    filename=$(basename -- "$jpeg_file")
    filename_no_ext="${filename%.*}"
    webp_file="${filename_no_ext}.webp"
    
    # Increment counter for progress display
    ((current_file++))
    
    echo -n "[$current_file/$total_files] Converting '$jpeg_file' to '$webp_file'... "
    
    # Get original file size
    orig_size=$(du -h "$jpeg_file" | cut -f1)
    
    # Convert the file
    if cwebp -q 50 "$jpeg_file" -o "$webp_file" &>/dev/null; then
        # Get new file size
        new_size=$(du -h "$webp_file" | cut -f1)
        
        # Calculate compression percentage if possible
        orig_bytes=$(stat -c%s "$jpeg_file")
        new_bytes=$(stat -c%s "$webp_file")
        if [ "$orig_bytes" -gt 0 ]; then
            percent_reduction=$(( (orig_bytes - new_bytes) * 100 / orig_bytes ))
            echo "SUCCESS! Size: $orig_size → $new_size ($percent_reduction% smaller)"
        else
            echo "SUCCESS! Size: $orig_size → $new_size"
        fi
    else
        echo "FAILED!"
    fi
done

echo "-------------------------------------------------------------------"
echo "Conversion complete! All WebP images saved with quality level 50."

