# TSX to DNA File Conversion Guide

This guide explains how to use the `convert-tsx-to-dna.js` script to convert all `.tsx` files in this project to `.dna` extensions while maintaining full functionality.

## Overview

The conversion script is a comprehensive Node.js tool that:

1. **Scans and Converts**: Recursively finds all `.tsx` files and renames them to `.dna`
2. **Updates References**: Automatically updates all import/export statements across the codebase
3. **Updates Configurations**: Modifies configuration files (tsconfig.json, .gitignore, etc.)
4. **Creates Backups**: Automatically backs up your project before conversion
5. **Tracks Changes**: Generates a mapping file of all conversions for reference

## Features

### ✓ Smart File Conversion
- Recursively scans all directories for `.tsx` files
- Renames files to `.dna` extension
- Creates a mapping of all file changes for reference tracking
- Automatically excludes `node_modules`, `.git`, `.next`, `build`, `dist`, and `out` directories

### ✓ Comprehensive Reference Updates
- Updates ES6 import statements: `import { Component } from './file.tsx'`
- Updates dynamic imports: `import('./file.tsx')`
- Updates CommonJS requires: `require('./file.tsx')`
- Updates Next.js dynamic patterns
- Updates webpack/vite glob patterns
- Updates path references in comments and strings

### ✓ Configuration Support
Updates common configuration files:
- `tsconfig.json` / `jsconfig.json` - Adds `.dna` to include patterns
- `.gitignore` - Adds DNA-specific patterns
- `next.config.js/mjs/ts` - Updates file references
- `webpack.config.js/ts` - Updates file references

### ✓ Safety Features
- **Dry Run Mode**: Test the conversion without making any changes
- **Automatic Backup**: Creates a timestamped backup before conversion
- **Error Tracking**: Logs all errors for review
- **Excluded Directories**: Automatically skips build artifacts and dependencies

## Usage

### Prerequisites

- Node.js installed on your system
- The script is located at the root of your project

### Command Line Options

```bash
node convert-tsx-to-dna.js [options]
```

**Available Options:**
- `--dry-run` - Run without making any changes (test mode)
- `--no-backup` - Skip creating a backup before conversion
- `--verbose` - Show detailed logging
- `--help`, `-h` - Show help message

### Step-by-Step Instructions

#### Step 1: Test with Dry Run (Recommended)

First, run the script in dry-run mode to see what changes will be made:

```bash
node convert-tsx-to-dna.js --dry-run
```

This will:
- Show all files that would be renamed
- Show all files that would be updated
- Display a summary without making any actual changes

#### Step 2: Review the Output

Check the dry-run output carefully:
- Verify the number of files to be converted (should be 83 in this project)
- Look for any errors or warnings
- Ensure all expected files are included

#### Step 3: Run the Actual Conversion

Once you're satisfied with the dry-run results, perform the actual conversion:

```bash
node convert-tsx-to-dna.js
```

This will:
1. Create a backup in `.backup-[timestamp]` directory
2. Rename all `.tsx` files to `.dna`
3. Update all import/export references
4. Update configuration files
5. Generate a `tsx-to-dna-mapping.json` file

#### Step 4: Verify the Conversion

After conversion:
1. Check the `tsx-to-dna-mapping.json` file to see all conversions
2. Run the validation script to ensure everything was converted correctly:
   ```bash
   node validate-conversion.js
   ```
3. Verify that your build still works (if applicable)
4. Test your application to ensure everything functions correctly

### Validation Script

The repository includes a validation script that checks:
- No .tsx files remain in the project (except in node_modules)
- All .dna files exist as expected
- No broken imports referencing .tsx files
- Configuration files are updated correctly

```bash
# Run validation after conversion
node validate-conversion.js
```

The script will exit with code 0 on success, or code 1 if issues are detected.

### Examples

```bash
# Test the conversion without making changes
node convert-tsx-to-dna.js --dry-run

# Perform the conversion with detailed logging
node convert-tsx-to-dna.js --verbose

# Perform the conversion without creating a backup (not recommended)
node convert-tsx-to-dna.js --no-backup

# Validate the conversion after running
node validate-conversion.js

# Get help
node convert-tsx-to-dna.js --help
```

## What Gets Updated

### File Renames
All `.tsx` files are renamed to `.dna`:
```
components/button.tsx → components/button.dna
app/page.tsx → app/page.dna
hooks/useData.tsx → hooks/useData.dna
```

### Import Statements
```javascript
// Before
import { Button } from './components/button.tsx'
import('./components/modal.tsx')

// After
import { Button } from './components/button.dna'
import('./components/modal.dna')
```

### Configuration Files

**tsconfig.json:**
```json
{
  "include": ["**/*.tsx", "**/*.ts"]  // Before
  "include": ["**/*.dna", "**/*.ts"]  // After
}
```

**.gitignore:**
```
# DNA file build artifacts
*.dna.map
.dna-cache/
```

## Backup and Recovery

### Backup Location
A backup is automatically created at `.backup-[timestamp]/` containing:
- All original source files
- Configuration files
- Project structure

### Restoring from Backup
If you need to restore your project:

```bash
# Copy backup files back (adjust timestamp)
cp -r .backup-1234567890/* .

# Or manually restore specific files
cp .backup-1234567890/components/button.tsx components/
```

## File Mapping

After conversion, a `tsx-to-dna-mapping.json` file is created that maps all conversions:

```json
{
  "/path/to/components/button.tsx": "/path/to/components/button.dna",
  "/path/to/app/page.tsx": "/path/to/app/page.dna"
}
```

This file is useful for:
- Tracking what was converted
- Debugging issues
- Understanding the conversion scope

## Troubleshooting

### Script Reports Errors

Check the error output at the end of the conversion. Common issues:
- File permission errors: Ensure you have write access to the project
- Locked files: Close any editors or processes using the files
- Syntax errors in config files: Fix before running

### Build Fails After Conversion

1. Check that your build tools support the `.dna` extension
2. Verify configuration files were updated correctly
3. Look for any hardcoded `.tsx` references that weren't caught
4. Restore from backup if needed

### Missing References

If some imports weren't updated:
1. Check if they use non-standard import patterns
2. Search for `.tsx` in your codebase: `grep -r "\.tsx" .`
3. Manually update any missed references

## Best Practices

1. **Always run with --dry-run first** to preview changes
2. **Commit your changes** to git before running the script
3. **Keep the backup** until you've verified everything works
4. **Run in verbose mode** if you encounter issues
5. **Test your application** thoroughly after conversion

## Support

If you encounter issues:
1. Run with `--verbose` flag for detailed logging
2. Check the error summary at the end of the script output
3. Review the `tsx-to-dna-mapping.json` file
4. Restore from backup if necessary

## Script Location

The conversion script is located at:
```
/convert-tsx-to-dna.js
```

## Project Statistics

- Total `.tsx` files in project: 83
- Directories processed: app/, components/, hooks/, lib/
- Configuration files updated: tsconfig.json, .gitignore, next.config.mjs
