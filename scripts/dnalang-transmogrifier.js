const fs = require('fs');
const path = require('path');

// --- Configuration ---
const TARGET_EXTENSION = '.dna';
const SOURCE_EXTENSION = '.tsx';
const EXCLUDED_DIRS = ['node_modules', '.git', 'build', 'dist', 'out', '.next'];
let conversionMap = {}; // Tracks original -> new file paths
const errorLog = []; // Global list to store all errors

/**
 * Utility function to log an error with context.
 */
function logError(type, file, details) {
    const errorEntry = { type, file, details: details.toString() };
    errorLog.push(errorEntry);
    console.error(`\n🚨 [${type} ERROR] in ${path.basename(file)}: ${details.message}`);
}

/**
 * Creates a timestamped backup of the project directory.
 * @param {string} source - The root directory to backup.
 */
function backupProject(source) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(path.dirname(source), `backup_dnalang_${timestamp}`);
    
    console.log(`\n📦 Creating project backup at: ${backupDir}`);

    function copyDirSync(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            // Skip excluded directories during backup
            if (entry.isDirectory() && EXCLUDED_DIRS.includes(entry.name)) {
                continue;
            }

            if (entry.isDirectory()) {
                copyDirSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    
    try {
        copyDirSync(source, backupDir);
        console.log('   Backup complete.');
    } catch (error) {
        console.error(`\n🚨 FATAL ERROR: Could not create backup. Aborting conversion.`);
        throw error;
    }
}

/**
 * Main function to start the transmogrification process.
 * @param {string} rootDir - The root directory of the project.
 * @param {boolean} dryRun - If true, only logs changes without executing.
 * @param {boolean} backup - If true, creates a project backup before changes.
 */
function transmogrify(rootDir, dryRun = true, backup = true) {
    console.log(`\n🧬 Starting DNA-Lang Transmogrification (Dry Run: ${dryRun})\n`);

    if (backup && !dryRun) {
        backupProject(rootDir);
    }

    // Scan and rename .tsx files to .dna
    recursivelyScanAndRename(rootDir, dryRun);

    // Update all references and configuration files
    if (Object.keys(conversionMap).length > 0) {
        updateReferencesInAllFiles(rootDir, dryRun);
        updateConfigurationFiles(rootDir, dryRun);
    } else {
        console.log('No .tsx files found. Exiting.');
    }

    console.log(`\n✅ Transmogrification Complete.`);
    if (Object.keys(conversionMap).length > 0) {
        console.log('   Converted Files:');
        console.table(conversionMap);
    }

    // --- Error Logging at the End ---
    if (errorLog.length > 0) {
        const logFileName = `dnalang_error_log_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const logPath = path.join(rootDir, logFileName);
        
        fs.writeFileSync(logPath, JSON.stringify(errorLog, null, 2), 'utf8');
        console.log(`\n⚠️ ${errorLog.length} errors encountered. Full log saved to: ${logPath}`);
        console.log('   Review the log file before proceeding!');
    } else {
        console.log('   No errors detected during conversion.');
    }
}

/**
 * Recursively scans and renames .tsx files to .dna.
 */
function recursivelyScanAndRename(currentDir, dryRun) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip excluded directories
            if (!EXCLUDED_DIRS.includes(file)) {
                recursivelyScanAndRename(fullPath, dryRun);
            }
        } else if (file.endsWith(SOURCE_EXTENSION)) {
            try {
                const newPath = fullPath.replace(SOURCE_EXTENSION, TARGET_EXTENSION);
                conversionMap[fullPath] = newPath;

                if (!dryRun) {
                    // Execute rename
                    fs.renameSync(fullPath, newPath);
                    console.log(`[RENAME] ${file} -> ${path.basename(newPath)}`);
                } else {
                    console.log(`[DRY-RUN: RENAME] ${fullPath} -> ${newPath}`);
                }
            } catch (e) {
                logError('RENAME', fullPath, e);
            }
        }
    }
}

/**
 * Updates all import/require statements and references.
 */
function updateReferencesInAllFiles(rootDir, dryRun) {
    console.log('\n🔄 Updating file references...');
    
    const allFiles = getAllProjectFiles(rootDir);
    
    for (const filePath of allFiles) {
        try {
            if (filePath.endsWith(TARGET_EXTENSION) || filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.mjs')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let updated = false;

                // Pattern to match import/require statements with .tsx extension
                // Matches: import X from './path.tsx' or import X from './path'
                const importRegex = /(['"])([^'"]*?)(\.tsx)?(['"])/g;
                
                const newContent = content.replace(importRegex, (match, quote1, importPath, extension, quote2) => {
                    // Check if this path (with .tsx) exists in our conversion map
                    const possiblePaths = [
                        path.join(path.dirname(filePath), importPath + '.tsx'),
                        path.join(rootDir, importPath + '.tsx'),
                    ];

                    for (const possiblePath of possiblePaths) {
                        const normalizedPath = path.normalize(possiblePath);
                        if (conversionMap[normalizedPath]) {
                            updated = true;
                            // Replace .tsx with .dna
                            if (extension === '.tsx') {
                                return `${quote1}${importPath}${TARGET_EXTENSION}${quote2}`;
                            } else {
                                // Implicit import - check if target file exists
                                return `${quote1}${importPath}${TARGET_EXTENSION}${quote2}`;
                            }
                        }
                    }
                    
                    return match;
                });

                if (updated && !dryRun) {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                    console.log(`[REF] Updated references in ${path.basename(filePath)}`);
                } else if (updated) {
                    console.log(`[DRY-RUN: REF] Updated references in ${path.basename(filePath)}`);
                }
            }
        } catch (e) {
            logError('REFERENCE_UPDATE', filePath, e);
        }
    }
}


/**
 * Updates key configuration files (tsconfig.json, .gitignore).
 */
function updateConfigurationFiles(rootDir, dryRun) {
    console.log('\n⚙️ Updating configuration files...');
    
    if (!dryRun) {
        // Update tsconfig.json
        const tsconfigPath = path.join(rootDir, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
            try {
                const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
                if (tsconfig.include) {
                    tsconfig.include = tsconfig.include.map(p => 
                        p.replace(`**/*.tsx`, `**/*.dna`)
                    );
                }
                fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
                console.log(`[CONFIG] Updated ${path.basename(tsconfigPath)}.`);
            } catch (e) {
                logError('CONFIG_UPDATE', tsconfigPath, e);
            }
        }
        
        // --- .gitignore example ---
        const gitignorePath = path.join(rootDir, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            try {
                const content = fs.readFileSync(gitignorePath, 'utf8');
                if (!content.includes('# DNA-Lang Artifacts')) {
                    fs.appendFileSync(gitignorePath, `\n\n# DNA-Lang Artifacts\n*.dnaswap\ndnalang_error_log_*.json\nbackup_dnalang_*\n`, 'utf8');
                    console.log(`[CONFIG] Updated ${path.basename(gitignorePath)}.`);
                }
            } catch (e) {
                logError('CONFIG_UPDATE', gitignorePath, e);
            }
        }
    } else {
        console.log('[DRY-RUN: CONFIG] Configuration files ready for update.');
    }
}

// Helper function to list all files for reference updating
function getAllProjectFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                getAllProjectFiles(fullPath, fileList);
            }
        } else {
            fileList.push(fullPath);
        }
    });
    return fileList;
}

// --- Usage Execution ---
const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const backup = !process.argv.includes('--no-backup');

try {
    transmogrify(root, dryRun, backup);
} catch (error) {
    console.error(error);
    process.exit(1);
}
