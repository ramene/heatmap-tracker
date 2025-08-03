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
echo "1. Committing all changes..."
git add -A
git commit -m "chore: commit all changes before version bump" || echo "No changes to commit."

# Step 2: Update version in package.json using npm version
echo "2. Updating package.json to version $VERSION..."
npm version --no-git-tag-version $VERSION

# Step 3: Run npm version script (if applicable)
if npm run | grep -q 'version'; then
  echo "3. Running npm version script..."
  npm run version
else
  echo "No npm version script found, skipping."
fi

# Step 4: Commit updated files
echo "4. Committing updated files..."
git add package.json package-lock.json
git commit -m "chore(release): v$VERSION"

# Step 5: Tag the new version
echo "5. Creating git tag for version $VERSION..."
git tag "$VERSION"

# Step 6: Push changes and tags
# echo "Pushing changes to the repository..."
git push
git push --tags

echo "Version $VERSION updated and pushed successfully!"