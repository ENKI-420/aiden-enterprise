#!/usr/bin/env node

/**
 * Validation Script for TSX to DNA Conversion
 * 
 * This script validates that the conversion was successful by checking:
 * 1. No .tsx files remain in the project
 * 2. All .dna files exist as expected
 * 3. No broken imports referencing .tsx files
 * 4. Configuration files are updated correctly
 */

const fs = require('fs');
const path = require('path');

const config = {
  rootDir: process.cwd(),
  excludedDirs: ['node_modules', '.git', '.next', 'build', 'dist', 'out', 'coverage'],
};

const results = {
  tsxFilesFound: [],
  dnaFilesFound: [],
  brokenReferences: [],
  configIssues: [],
};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

function shouldExcludeDir(dirPath) {
  const dirName = path.basename(dirPath);
  return config.excludedDirs.includes(dirName);
}

function findFilesWithExtension(dir, extension, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldExcludeDir(fullPath)) {
          findFilesWithExtension(fullPath, extension, files);
        }
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Silently skip inaccessible directories
  }
  
  return files;
}

function checkForTsxReferencesInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    lines.forEach((line, idx) => {
      // Check for .tsx in imports, requires, or strings
      if (line.match(/(['"`]).*\.tsx\1/) || 
          line.match(/from\s+['"].*\.tsx['"]/)) {
        issues.push({
          file: filePath,
          line: idx + 1,
          content: line.trim(),
        });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function validateTsConfig() {
  const tsconfigPath = path.join(config.rootDir, 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    results.configIssues.push({
      file: 'tsconfig.json',
      issue: 'File not found',
    });
    return;
  }
  
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf8');
    const tsconfig = JSON.parse(content);
    
    // Check if .dna is included
    if (tsconfig.include) {
      const hasDna = tsconfig.include.some(pattern => pattern.includes('.dna'));
      const hasTsx = tsconfig.include.some(pattern => pattern.includes('.tsx'));
      
      if (!hasDna && hasTsx) {
        results.configIssues.push({
          file: 'tsconfig.json',
          issue: 'Still includes .tsx patterns but missing .dna patterns',
        });
      }
    }
  } catch (error) {
    results.configIssues.push({
      file: 'tsconfig.json',
      issue: `Failed to parse: ${error.message}`,
    });
  }
}

function validateGitignore() {
  const gitignorePath = path.join(config.rootDir, '.gitignore');
  
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    
    // Check for DNA-specific patterns
    const hasDnaPatterns = content.includes('*.dna.map') || content.includes('.dna-cache');
    
    if (!hasDnaPatterns) {
      results.configIssues.push({
        file: '.gitignore',
        issue: 'Missing DNA-specific patterns (optional)',
      });
    }
  }
}

function main() {
  console.log('\n' + '='.repeat(60));
  log('TSX to DNA Conversion Validation', colors.blue);
  console.log('='.repeat(60) + '\n');
  
  // Step 1: Check for remaining .tsx files
  log('1. Checking for remaining .tsx files...', colors.yellow);
  results.tsxFilesFound = findFilesWithExtension(config.rootDir, '.tsx');
  
  if (results.tsxFilesFound.length === 0) {
    log('   ✓ No .tsx files found', colors.green);
  } else {
    log(`   ✗ Found ${results.tsxFilesFound.length} .tsx files`, colors.red);
    results.tsxFilesFound.slice(0, 5).forEach(file => {
      log(`     - ${file}`, colors.red);
    });
    if (results.tsxFilesFound.length > 5) {
      log(`     ... and ${results.tsxFilesFound.length - 5} more`, colors.red);
    }
  }
  
  // Step 2: Count .dna files
  log('\n2. Checking for .dna files...', colors.yellow);
  results.dnaFilesFound = findFilesWithExtension(config.rootDir, '.dna');
  
  if (results.dnaFilesFound.length > 0) {
    log(`   ✓ Found ${results.dnaFilesFound.length} .dna files`, colors.green);
  } else {
    log('   ✗ No .dna files found', colors.red);
  }
  
  // Step 3: Check for broken references
  log('\n3. Checking for .tsx references in code...', colors.yellow);
  const filesToCheck = [
    ...results.dnaFilesFound,
    ...findFilesWithExtension(config.rootDir, '.ts'),
    ...findFilesWithExtension(config.rootDir, '.js'),
    ...findFilesWithExtension(config.rootDir, '.jsx'),
  ];
  
  filesToCheck.forEach(file => {
    const issues = checkForTsxReferencesInFile(file);
    results.brokenReferences.push(...issues);
  });
  
  if (results.brokenReferences.length === 0) {
    log('   ✓ No .tsx references found in code', colors.green);
  } else {
    log(`   ✗ Found ${results.brokenReferences.length} potential .tsx references`, colors.red);
    results.brokenReferences.slice(0, 5).forEach(ref => {
      log(`     - ${ref.file}:${ref.line}`, colors.red);
      log(`       ${ref.content}`, colors.red);
    });
    if (results.brokenReferences.length > 5) {
      log(`     ... and ${results.brokenReferences.length - 5} more`, colors.red);
    }
  }
  
  // Step 4: Validate configuration files
  log('\n4. Validating configuration files...', colors.yellow);
  validateTsConfig();
  validateGitignore();
  
  if (results.configIssues.length === 0) {
    log('   ✓ Configuration files look good', colors.green);
  } else {
    log(`   ⚠ Found ${results.configIssues.length} configuration issues`, colors.yellow);
    results.configIssues.forEach(issue => {
      log(`     - ${issue.file}: ${issue.issue}`, colors.yellow);
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  log('VALIDATION SUMMARY', colors.blue);
  console.log('='.repeat(60) + '\n');
  
  const allPassed = 
    results.tsxFilesFound.length === 0 &&
    results.dnaFilesFound.length > 0 &&
    results.brokenReferences.length === 0;
  
  if (allPassed) {
    log('✓ VALIDATION PASSED - Conversion appears successful!', colors.green);
    log(`  - ${results.dnaFilesFound.length} .dna files found`, colors.green);
    log('  - No .tsx files remaining', colors.green);
    log('  - No broken references detected', colors.green);
  } else {
    log('✗ VALIDATION FAILED - Issues detected:', colors.red);
    if (results.tsxFilesFound.length > 0) {
      log(`  - ${results.tsxFilesFound.length} .tsx files still present`, colors.red);
    }
    if (results.dnaFilesFound.length === 0) {
      log('  - No .dna files found', colors.red);
    }
    if (results.brokenReferences.length > 0) {
      log(`  - ${results.brokenReferences.length} broken references found`, colors.red);
    }
  }
  
  if (results.configIssues.length > 0) {
    log(`\n⚠ ${results.configIssues.length} configuration warnings`, colors.yellow);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  process.exit(allPassed ? 0 : 1);
}

// Handle command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
TSX to DNA Conversion Validator
================================

Usage: node validate-conversion.js

This script validates that the TSX to DNA conversion was successful by:
  1. Checking for remaining .tsx files
  2. Verifying .dna files exist
  3. Detecting broken references to .tsx files
  4. Validating configuration file updates

Exit codes:
  0 - Validation passed
  1 - Validation failed (issues detected)
  `);
  process.exit(0);
}

main();
