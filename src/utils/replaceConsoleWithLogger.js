#!/usr/bin/env node

/**
 * Script to help replace console.log statements with logger utility
 * Run with: node src/utils/replaceConsoleWithLogger.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Directory to scan
const srcDir = path.resolve(__dirname, '..');

// File types to scan
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// Skip directories
const skipDirs = ['node_modules', 'build', 'dist', '.git'];

// Import statement to add
const importStatement = "import logger from '../utils/logger';";
const relativeImportPattern = /from\s+['"]\.\.\/utils\/logger['"];/;

// Replace statements
const replacePatterns = [
  { pattern: /console\.log\(/g, replacement: 'logger.log(' },
  { pattern: /console\.error\(/g, replacement: 'logger.error(' },
  { pattern: /console\.warn\(/g, replacement: 'logger.warn(' },
  { pattern: /console\.info\(/g, replacement: 'logger.info(' },
  { pattern: /console\.debug\(/g, replacement: 'logger.debug(' }
];

// File counter
let processedFiles = 0;
let modifiedFiles = 0;

/**
 * Check if the file has any console statements
 */
function hasConsoleStatements(content) {
  return replacePatterns.some(({ pattern }) => pattern.test(content));
}

/**
 * Get the correct relative import path
 */
function getRelativeImportPath(filePath) {
  const relativePath = path.relative(path.dirname(filePath), path.join(srcDir, 'utils'));
  const normalizedPath = relativePath.split(path.sep).join('/');
  return normalizedPath ? `${normalizedPath}/logger` : './utils/logger';
}

/**
 * Add import statement if needed
 */
function addImportIfNeeded(content, filePath) {
  // Check if already has the logger import
  if (content.includes('from') && content.includes('logger') && relativeImportPattern.test(content)) {
    return content;
  }

  // Find a good place to insert the import
  const importPath = getRelativeImportPath(filePath);
  const newImport = `import logger from '${importPath}';`;

  // Find the last import statement
  const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
  
  if (importLines.length > 0) {
    // Add after the last import
    const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
    const lastImportEndIndex = lastImportIndex + importLines[importLines.length - 1].length;
    
    return content.slice(0, lastImportEndIndex) + '\n' + newImport + content.slice(lastImportEndIndex);
  } else {
    // Add at the beginning of the file
    return newImport + '\n' + content;
  }
}

/**
 * Replace console statements with logger
 */
function replaceConsoleStatements(content) {
  let modifiedContent = content;
  
  for (const { pattern, replacement } of replacePatterns) {
    modifiedContent = modifiedContent.replace(pattern, replacement);
  }
  
  return modifiedContent;
}

/**
 * Process a single file
 */
async function processFile(filePath) {
  processedFiles++;
  
  try {
    // Read file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Check if the file has any console statements
    if (!hasConsoleStatements(content)) {
      return;
    }
    
    // Replace console statements
    let modifiedContent = replaceConsoleStatements(content);
    
    // Add import if needed
    modifiedContent = addImportIfNeeded(modifiedContent, filePath);
    
    // Write back if changed
    if (modifiedContent !== content) {
      await fs.promises.writeFile(filePath, modifiedContent, 'utf8');
      modifiedFiles++;
      console.log(`Modified: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Recursively scan directory
 */
async function scanDirectory(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (skipDirs.includes(entry.name)) {
        continue;
      }
      
      await scanDirectory(fullPath);
    } else if (entry.isFile() && fileExtensions.includes(path.extname(entry.name))) {
      await processFile(fullPath);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('This script will replace console.log statements with logger utility.');
  console.log('Make sure you have created the logger utility in src/utils/logger.ts');
  
  rl.question('Are you sure you want to continue? (y/n) ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Scanning directory:', srcDir);
      
      try {
        await scanDirectory(srcDir);
        console.log(`\nProcess completed!`);
        console.log(`Processed ${processedFiles} files`);
        console.log(`Modified ${modifiedFiles} files`);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Operation cancelled.');
    }
    
    rl.close();
  });
}

// Run the script
main(); 