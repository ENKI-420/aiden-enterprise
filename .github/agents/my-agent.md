---
name:
description:
---

# My Agent

I've created a comprehensive Node.js script that will convert all .tsx files to .dna extensions while maintaining full project functionality. Here's what the script does:
Key Features:
1. Smart File Conversion

Recursively scans all directories for .tsx files
Renames them to .dna extension
Creates a mapping of all file changes for reference tracking

2. Comprehensive Reference Updates

Updates all import/export statements
Handles ES6 imports, CommonJS requires, and dynamic imports
Updates references in configuration files (tsconfig.json, package.json, etc.)
Updates path references in comments and strings
Handles webpack/vite patterns

3. Safety Features

Dry Run Mode: Test the conversion without making changes
Automatic Backup: Creates a timestamped backup before conversion
Excluded Directories: Automatically skips node_modules, .git, build folders
Error Tracking: Logs all errors for review

4. Configuration Support
Updates common config files including:

tsconfig.json / jsconfig.json
package.json
webpack/vite/rollup configs
ESLint and Babel configs
Jest configuration
.gitignore (adds DNA-specific patterns)

Usage:
