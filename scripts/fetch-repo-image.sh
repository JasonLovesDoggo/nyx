#!/bin/bash

# fetch-repo-image.sh - Fetch GitHub repository image with explicit filename
# Usage: ./fetch-repo-image.sh <github-repo-url> <output-filename> [output-directory]

set -e

# Check parameters
if [ $# -lt 2 ] || [ $# -gt 3 ]; then
    echo "Usage: $0 <github-repo-url> <output-filename> [output-directory]"
    echo "Example: $0 https://github.com/TecharoHQ/anubis anubis ./static/projects"
    exit 1
fi

# Clean the URL by removing trailing slashes
REPO_URL="${1%/}"
OUTPUT_NAME="$2"

# Set output directory (default to current directory)
OUTPUT_DIR="${3:-.}"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Fetching image for: $OUTPUT_NAME"
echo "Repository: $REPO_URL"

# Make API request with all required headers
API_RESPONSE=$(curl -s 'https://lpf64gdwdb.execute-api.us-east-1.amazonaws.com/?repo='"$REPO_URL"'' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-CA,en-US;q=0.7,en;q=0.3' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'Content-Type: application/json; charset=utf-8' \
  -H 'Origin: https://www.bannerbear.com' \
  -H 'Connection: keep-alive' \
  -H 'Referer: https://www.bannerbear.com/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Priority: u=0' \
  -H 'Pragma: no-cache' \
  -H 'Cache-Control: no-cache' \
  -H 'TE: trailers')

# Check if API response is valid JSON
if ! echo "$API_RESPONSE" | jq . >/dev/null 2>&1; then
    echo "Error: Invalid JSON response from API"
    echo "Response: $API_RESPONSE"
    exit 1
fi

# Check if we have at least 3 items (index 2 exists)
ARRAY_LENGTH=$(echo "$API_RESPONSE" | jq 'length')
if [ "$ARRAY_LENGTH" -lt 3 ]; then
    echo "Error: API returned only $ARRAY_LENGTH items, but we need at least 3 (index 2)"
    exit 1
fi

# Extract the 3rd image URL (index 2)
IMAGE_URL=$(echo "$API_RESPONSE" | jq -r '.[2]')

if [ "$IMAGE_URL" = "null" ] || [ -z "$IMAGE_URL" ]; then
    echo "Error: Could not extract image URL from API response"
    exit 1
fi

# Download the image to output directory
echo "Downloading image as ${OUTPUT_DIR}/${OUTPUT_NAME}.jpg..."
if curl -s -o "${OUTPUT_DIR}/${OUTPUT_NAME}.jpg" "$IMAGE_URL"; then
    echo "Successfully downloaded ${OUTPUT_DIR}/${OUTPUT_NAME}.jpg"
else
    echo "Error: Failed to download image"
    exit 1
fi

# Check if cwebp is available for conversion
if command -v cwebp &>/dev/null; then
    echo "Converting to WebP format..."
    if cwebp -q 50 "${OUTPUT_DIR}/${OUTPUT_NAME}.jpg" -o "${OUTPUT_DIR}/${OUTPUT_NAME}.webp" &>/dev/null; then
        echo "Successfully converted to WebP"
        # Remove the JPG file after successful conversion
        rm -f "${OUTPUT_DIR}/${OUTPUT_NAME}.jpg"
        echo "Done! WebP file created: ${OUTPUT_DIR}/${OUTPUT_NAME}.webp"
    else
        echo "Warning: WebP conversion failed, keeping JPG file"
    fi
else
    echo "Warning: cwebp not installed. Install with: brew install webp"
    echo "Keeping JPG file: ${OUTPUT_DIR}/${OUTPUT_NAME}.jpg"
fi