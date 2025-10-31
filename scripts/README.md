# DNA-Lang Transmogrifier

A Node.js migration script to convert traditional React/TypeScript projects (`.tsx` files) into the DNA-Lang Quantum Web Application paradigm (`.dna` files).

## Features

### 1. Smart File Conversion
- Recursively scans your project for `.tsx` files
- Renames them to `.dna` extension
- Tracks all conversions in a conversion map

### 2. Comprehensive Reference Updates
- Updates all import/require statements across the codebase
- Handles both explicit (`.tsx`) and implicit imports
- Processes `.js`, `.ts`, `.jsx`, `.mjs`, and `.dna` files

### 3. Safety Features
- **Dry Run Mode**: Preview all changes before executing
- **Automatic Backup**: Creates timestamped backup before making changes
- **Excluded Directories**: Skips `node_modules`, `.git`, `build`, `dist`, `out`, `.next`
- **Error Tracking**: Logs all errors to a JSON file for review

### 4. Configuration Support
- Updates `tsconfig.json` to include `.dna` files
- Updates `.gitignore` to exclude DNA-Lang artifacts
- Extensible for other configuration files

## Usage

### Test Run (Recommended First)
Preview all changes without making any modifications:

```bash
node scripts/dnalang-transmogrifier.js --dry-run
```

### Live Conversion
Execute the conversion with automatic backup:

```bash
node scripts/dnalang-transmogrifier.js
```

### Live Conversion Without Backup
**⚠️ Not recommended** - Execute conversion without creating a backup:

```bash
node scripts/dnalang-transmogrifier.js --no-backup
```

## Output

### Dry Run Mode
- Displays all files that will be renamed
- Shows which files will have references updated
- Indicates which configuration files will be modified
- Shows conversion table at the end

### Live Mode
- Creates timestamped backup (unless `--no-backup` is specified)
- Renames all `.tsx` files to `.dna`
- Updates all references across the codebase
- Modifies configuration files
- Displays conversion summary table
- Generates error log if any issues occurred

## Error Handling

If errors occur during conversion, a detailed error log will be saved:
- **Filename**: `dnalang_error_log_<timestamp>.json`
- **Location**: Project root directory
- **Contents**: Array of error objects with type, file, and details

## Backup Location

Backups are created in the parent directory of your project:
- **Format**: `backup_dnalang_<timestamp>/`
- **Example**: `backup_dnalang_2025-10-31T05-30-45-123Z/`

## Files Modified

### Renamed
- All `.tsx` files → `.dna` files

### Updated References
- `.js`, `.ts`, `.jsx`, `.mjs`, `.dna` files with import/require statements

### Updated Configuration
- `tsconfig.json` - Updates `include` array
- `.gitignore` - Adds DNA-Lang artifact exclusions

## Excluded from Processing

The following directories are automatically skipped:
- `node_modules/`
- `.git/`
- `build/`
- `dist/`
- `out/`
- `.next/`

## Example Workflow

1. **Initial Test**:
   ```bash
   node scripts/dnalang-transmogrifier.js --dry-run
   ```

2. **Review Output**: Check the conversion table and ensure all expected files are listed

3. **Execute Conversion**:
   ```bash
   node scripts/dnalang-transmogrifier.js
   ```

4. **Verify Results**: Check that all files were converted correctly

5. **Review Error Log**: If errors occurred, review `dnalang_error_log_*.json`

## Notes

- Always run in `--dry-run` mode first to preview changes
- The script creates a complete backup by default for safety
- Backup excludes the same directories as the conversion process
- Error logs and backups are automatically excluded via `.gitignore`

## Integration with DNA-Lang Platform

This script is designed to onboard traditional React/TypeScript projects into the DNA-Lang Quantum Web Application ecosystem. After conversion:

1. All `.tsx` components become `.dna` organisms
2. Import statements reference `.dna` files
3. Configuration files support the new extension
4. The project is ready for DNA-Lang's mutation-driven, self-improving agent runtime

## Support

For issues or questions about the DNA-Lang Transmogrifier, please refer to the main project documentation or contact the development team.
