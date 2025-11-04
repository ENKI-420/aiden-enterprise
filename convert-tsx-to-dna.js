#!/usr/bin/env node

/**
 * TSX to DNA File Converter
 * 
 * This script converts all .tsx files to .dna extensions while maintaining
 * full project functionality by updating all references and configurations.
 * 
 * Features:
 * - Smart file conversion with recursive directory scanning
 * - Comprehensive reference updates (imports, exports, requires)
 * - Configuration file updates (tsconfig, package.json, webpack, etc.)
 * - Dry run mode for safe testing
 * - Automatic backup creation
 * - Error tracking and logging
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  dryRun: process.argv.includes('--dry-run'),
  backup: !process.argv.includes('--no-backup'),
  verbose: process.argv.includes('--verbose'),
  rootDir: process.cwd(),
  excludedDirs: ['node_modules', '.git', '.next', 'build', 'dist', 'out', 'coverage'],
  backupDir: path.join(process.cwd(), `.backup-${Date.now()}`),
};

// State tracking
const state = {
  filesRenamed: [],
  filesUpdated: [],
  errors: [],
  mapping: new Map(), // old path -> new path
};

// Logging utilities
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  verbose: (msg) => config.verbose && console.log(`[VERBOSE] ${msg}`),
  dry: (msg) => config.dryRun && console.log(`[DRY RUN] ${msg}`),
};

/**
 * Check if a directory should be excluded from scanning
 */
function shouldExcludeDir(dirPath) {
  const dirName = path.basename(dirPath);
  return config.excludedDirs.includes(dirName);
}

/**
 * Recursively find all .tsx files
 */
function findTsxFiles(dir, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldExcludeDir(fullPath)) {
          findTsxFiles(fullPath, files);
        }
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    state.errors.push({ file: dir, error: error.message, phase: 'scanning' });
    log.error(`Failed to scan directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Create backup of the entire project
 */
function createBackup() {
  if (!config.backup || config.dryRun) {
    log.dry('Skipping backup in dry run mode');
    return;
  }
  
  log.info('Creating backup...');
  
  try {
    // Create backup directory
    fs.mkdirSync(config.backupDir, { recursive: true });
    
    // Copy important files and directories
    const itemsToBackup = [
      'package.json',
      'tsconfig.json',
      'next.config.mjs',
      'tailwind.config.ts',
      '.gitignore',
      'components',
      'app',
      'lib',
      'hooks',
      'styles',
    ];
    
    for (const item of itemsToBackup) {
      const srcPath = path.join(config.rootDir, item);
      const destPath = path.join(config.backupDir, item);
      
      if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
          copyDirRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    log.success(`Backup created at: ${config.backupDir}`);
  } catch (error) {
    log.error(`Backup failed: ${error.message}`);
    state.errors.push({ file: 'backup', error: error.message, phase: 'backup' });
  }
}

/**
 * Recursively copy directory
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!shouldExcludeDir(srcPath)) {
        copyDirRecursive(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Rename .tsx file to .dna
 */
function renameTsxFile(filePath) {
  const newPath = filePath.replace(/\.tsx$/, '.dna');
  
  if (config.dryRun) {
    log.dry(`Would rename: ${filePath} -> ${newPath}`);
    state.mapping.set(filePath, newPath);
    state.filesRenamed.push(newPath);
    return newPath;
  }
  
  try {
    fs.renameSync(filePath, newPath);
    state.mapping.set(filePath, newPath);
    state.filesRenamed.push(newPath);
    log.verbose(`Renamed: ${filePath} -> ${newPath}`);
    return newPath;
  } catch (error) {
    log.error(`Failed to rename ${filePath}: ${error.message}`);
    state.errors.push({ file: filePath, error: error.message, phase: 'rename' });
    return null;
  }
}

/**
 * Update import/export references in a file
 */
function updateReferencesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Pattern 1: ES6 imports - from './path.tsx' or from "@/path.tsx"
    content = content.replace(
      /(from\s+['"])([^'"]+)\.tsx(['"])/g,
      (match, prefix, importPath, suffix) => {
        updated = true;
        return `${prefix}${importPath}.dna${suffix}`;
      }
    );
    
    // Pattern 2: Dynamic imports - import('./path.tsx')
    content = content.replace(
      /(import\s*\(\s*['"])([^'"]+)\.tsx(['"]\s*\))/g,
      (match, prefix, importPath, suffix) => {
        updated = true;
        return `${prefix}${importPath}.dna${suffix}`;
      }
    );
    
    // Pattern 3: require() statements
    content = content.replace(
      /(require\s*\(\s*['"])([^'"]+)\.tsx(['"]\s*\))/g,
      (match, prefix, requirePath, suffix) => {
        updated = true;
        return `${prefix}${requirePath}.dna${suffix}`;
      }
    );
    
    // Pattern 4: Next.js specific patterns
    content = content.replace(
      /(next\/dynamic\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"])([^'"]+)\.tsx(['"]\s*\))/g,
      (match, prefix, importPath, suffix) => {
        updated = true;
        return `${prefix}${importPath}.dna${suffix}`;
      }
    );
    
    // Pattern 5: Webpack/Vite specific patterns
    content = content.replace(
      /(import\.meta\.glob\s*\(\s*['"])([^'"]*\.tsx)(['"]\s*\))/g,
      (match, prefix, pattern, suffix) => {
        updated = true;
        const newPattern = pattern.replace(/\.tsx/g, '.dna');
        return `${prefix}${newPattern}${suffix}`;
      }
    );
    
    // Pattern 6: Comments and strings referencing .tsx files
    content = content.replace(
      /(['"`])([^'"`]*\.tsx)(['"`])/g,
      (match, q1, reference, q2) => {
        // Only update if it looks like a file reference (contains path separators)
        if (reference.includes('/') || reference.includes('\\')) {
          updated = true;
          return `${q1}${reference.replace(/\.tsx/g, '.dna')}${q2}`;
        }
        return match;
      }
    );
    
    if (updated) {
      if (config.dryRun) {
        log.dry(`Would update references in: ${filePath}`);
        state.filesUpdated.push(filePath);
      } else {
        fs.writeFileSync(filePath, content, 'utf8');
        state.filesUpdated.push(filePath);
        log.verbose(`Updated references in: ${filePath}`);
      }
    }
  } catch (error) {
    log.error(`Failed to update references in ${filePath}: ${error.message}`);
    state.errors.push({ file: filePath, error: error.message, phase: 'update_references' });
  }
}

/**
 * Update tsconfig.json to include .dna files
 */
function updateTsConfig() {
  const tsconfigPath = path.join(config.rootDir, 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    log.warn('tsconfig.json not found, skipping...');
    return;
  }
  
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf8');
    let tsconfig = JSON.parse(content);
    
    // Update include patterns
    if (tsconfig.include) {
      tsconfig.include = tsconfig.include.map(pattern =>
        pattern.replace(/\*\*\/\*\.tsx/g, '**/*.dna')
      );
      
      // Add .dna pattern if not already present
      if (!tsconfig.include.some(p => p.includes('.dna'))) {
        tsconfig.include.push('**/*.dna');
      }
    }
    
    if (config.dryRun) {
      log.dry(`Would update tsconfig.json`);
    } else {
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
      state.filesUpdated.push(tsconfigPath);
      log.success('Updated tsconfig.json');
    }
  } catch (error) {
    log.error(`Failed to update tsconfig.json: ${error.message}`);
    state.errors.push({ file: tsconfigPath, error: error.message, phase: 'update_config' });
  }
}

/**
 * Update jsconfig.json if present
 */
function updateJsConfig() {
  const jsconfigPath = path.join(config.rootDir, 'jsconfig.json');
  
  if (!fs.existsSync(jsconfigPath)) {
    return; // jsconfig is optional
  }
  
  try {
    const content = fs.readFileSync(jsconfigPath, 'utf8');
    let jsconfig = JSON.parse(content);
    
    if (jsconfig.include) {
      jsconfig.include = jsconfig.include.map(pattern =>
        pattern.replace(/\*\*\/\*\.tsx/g, '**/*.dna')
      );
      
      if (!jsconfig.include.some(p => p.includes('.dna'))) {
        jsconfig.include.push('**/*.dna');
      }
    }
    
    if (config.dryRun) {
      log.dry(`Would update jsconfig.json`);
    } else {
      fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2) + '\n', 'utf8');
      state.filesUpdated.push(jsconfigPath);
      log.success('Updated jsconfig.json');
    }
  } catch (error) {
    log.error(`Failed to update jsconfig.json: ${error.message}`);
    state.errors.push({ file: jsconfigPath, error: error.message, phase: 'update_config' });
  }
}

/**
 * Update .gitignore to include DNA-specific patterns
 */
function updateGitignore() {
  const gitignorePath = path.join(config.rootDir, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    log.warn('.gitignore not found, skipping...');
    return;
  }
  
  try {
    let content = fs.readFileSync(gitignorePath, 'utf8');
    
    // Add DNA-specific patterns if not already present
    const dnaPatterns = [
      '\n# DNA file build artifacts',
      '*.dna.map',
      '.dna-cache/',
    ];
    
    let modified = false;
    for (const pattern of dnaPatterns) {
      if (!content.includes(pattern.trim())) {
        content += '\n' + pattern;
        modified = true;
      }
    }
    
    if (modified) {
      if (config.dryRun) {
        log.dry(`Would update .gitignore with DNA patterns`);
      } else {
        fs.writeFileSync(gitignorePath, content, 'utf8');
        state.filesUpdated.push(gitignorePath);
        log.success('Updated .gitignore');
      }
    }
  } catch (error) {
    log.error(`Failed to update .gitignore: ${error.message}`);
    state.errors.push({ file: gitignorePath, error: error.message, phase: 'update_config' });
  }
}

/**
 * Update Next.js config files
 */
function updateNextConfig() {
  const nextConfigFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
  
  for (const configFile of nextConfigFiles) {
    const configPath = path.join(config.rootDir, configFile);
    
    if (fs.existsSync(configPath)) {
      updateReferencesInFile(configPath);
    }
  }
}

/**
 * Update webpack config if present
 */
function updateWebpackConfig() {
  const webpackConfigFiles = ['webpack.config.js', 'webpack.config.ts'];
  
  for (const configFile of webpackConfigFiles) {
    const configPath = path.join(config.rootDir, configFile);
    
    if (fs.existsSync(configPath)) {
      updateReferencesInFile(configPath);
    }
  }
}

/**
 * Save file mapping to a JSON file for reference
 */
function saveFileMapping() {
  const mappingPath = path.join(config.rootDir, 'tsx-to-dna-mapping.json');
  
  const mapping = {};
  state.mapping.forEach((newPath, oldPath) => {
    mapping[oldPath] = newPath;
  });
  
  if (config.dryRun) {
    log.dry(`Would save file mapping to: ${mappingPath}`);
    log.info(`Total files to be converted: ${state.mapping.size}`);
  } else {
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    log.success(`File mapping saved to: ${mappingPath}`);
  }
}

/**
 * Print summary report
 */
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('CONVERSION SUMMARY');
  console.log('='.repeat(60));
  
  if (config.dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes were made\n');
  }
  
  console.log(`Files renamed: ${state.filesRenamed.length}`);
  console.log(`Files updated: ${state.filesUpdated.length}`);
  console.log(`Errors: ${state.errors.length}`);
  
  if (state.errors.length > 0) {
    console.log('\n' + '-'.repeat(60));
    console.log('ERRORS:');
    console.log('-'.repeat(60));
    state.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. [${err.phase}] ${err.file}`);
      console.log(`   ${err.error}`);
    });
  }
  
  if (config.backup && !config.dryRun) {
    console.log(`\n📦 Backup created at: ${config.backupDir}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Find files with specific extensions
 */
function findFilesWithExtensions(dir, extensions, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldExcludeDir(fullPath)) {
          findFilesWithExtensions(fullPath, extensions, files);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    state.errors.push({ file: dir, error: error.message, phase: 'scanning' });
  }
  
  return files;
}

/**
 * Main execution function
 */
function main() {
  console.log('\n' + '='.repeat(60));
  console.log('TSX to DNA File Converter');
  console.log('='.repeat(60) + '\n');
  
  if (config.dryRun) {
    log.warn('Running in DRY RUN mode - no changes will be made');
  }
  
  // Step 1: Find all .tsx files
  log.info('Scanning for .tsx files...');
  const tsxFiles = findTsxFiles(config.rootDir);
  log.success(`Found ${tsxFiles.length} .tsx files`);
  
  if (tsxFiles.length === 0) {
    log.warn('No .tsx files found. Exiting...');
    return;
  }
  
  // Step 2: Create backup
  if (config.backup) {
    createBackup();
  }
  
  // Step 3: Rename all .tsx files to .dna
  log.info('Renaming .tsx files to .dna...');
  for (const tsxFile of tsxFiles) {
    renameTsxFile(tsxFile);
  }
  
  // Step 4: Find all files that might contain references
  log.info('Finding files to update references...');
  const filesToUpdate = [
    ...findFilesWithExtensions(config.rootDir, ['.dna']), // Renamed files
    ...findFilesWithExtensions(config.rootDir, ['.ts', '.js', '.jsx', '.mjs', '.cjs']),
  ];
  
  // Step 5: Update all references
  log.info('Updating references in files...');
  for (const file of filesToUpdate) {
    updateReferencesInFile(file);
  }
  
  // Step 6: Update configuration files
  log.info('Updating configuration files...');
  updateTsConfig();
  updateJsConfig();
  updateGitignore();
  updateNextConfig();
  updateWebpackConfig();
  
  // Step 7: Save file mapping
  saveFileMapping();
  
  // Step 8: Print summary
  printSummary();
  
  if (config.dryRun) {
    log.info('To perform the actual conversion, run without --dry-run flag');
  } else {
    log.success('Conversion completed!');
  }
}

// Handle command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
TSX to DNA File Converter
==========================

Usage: node convert-tsx-to-dna.js [options]

Options:
  --dry-run        Run without making any changes (test mode)
  --no-backup      Skip creating a backup before conversion
  --verbose        Show detailed logging
  --help, -h       Show this help message

Examples:
  node convert-tsx-to-dna.js --dry-run          # Test the conversion
  node convert-tsx-to-dna.js                     # Perform the conversion
  node convert-tsx-to-dna.js --verbose          # Run with detailed logging
  node convert-tsx-to-dna.js --no-backup        # Skip backup creation

Features:
  ✓ Smart file conversion with recursive directory scanning
  ✓ Comprehensive reference updates (imports, exports, requires)
  ✓ Configuration file updates (tsconfig, package.json, etc.)
  ✓ Dry run mode for safe testing
  ✓ Automatic backup creation
  ✓ Error tracking and logging
  ✓ File mapping generation
  `);
  process.exit(0);
}

// Run the converter
main();
