#!/bin/bash

# Exit on errors
set -e

# Check if version parameter is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION=$1

# Step 1: Commit all changes
echo "Committing all changes..."
git add -A
git commit -m "chore: commit all changes before version bump" || echo "No changes to commit."

# Step 2: Update version in package.json using npm version
echo "Updating package.json to version $VERSION..."
npm version --no-git-tag-version $VERSION

# Step 3: Run npm version script (if applicable)
if npm run | grep -q 'version'; then
  echo "Running npm version script..."
  npm run version
else
  echo "No npm version script found, skipping."
fi

# Step 4: Commit updated files
echo "Committing updated files..."
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Step 5: Tag the new version
echo "Creating git tag for version $VERSION..."
git tag "$VERSION"

# Step 6: Push changes and tags
# echo "Pushing changes to the repository..."
git push
git push --tags

echo "Version $VERSION updated and pushed successfully!"