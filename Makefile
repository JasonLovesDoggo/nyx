# Makefile for Nyx project
SHELL := /bin/zsh
# Define PHONY targets
.PHONY: help generate-project-images clean-project-images dev build test

# Default target - show help
help:
	@echo "Available targets:"
	@echo "  make generate-project-images  - Generate GitHub project banner images"
	@echo "  make clean-project-images     - Remove all generated project images"
	@echo "  make dev                      - Start development server"
	@echo "  make build                    - Build the project"
	@echo "  make test                     - Run tests"

# Generate project images from GitHub repositories
generate-project-images:
	@echo "Generating project images..."
	zsh scripts/generate-project-images.sh
	@echo "Project images generated successfully!"

# Clean generated project images
clean-project-images:
	@echo "Cleaning project images..."
	@rm -f static/projects/*.jpg static/projects/*.webp
	@echo "Project images cleaned!"

# Development server
dev:
	bun run dev

# Build project
build:
	bun run build

# Run tests
test:
	bun run test
