#!/usr/bin/env node

/**
 * MD3 Migration Check Tool
 * 
 * This script scans the codebase for components that need to be migrated to MD3 token system.
 * It identifies:
 * 1. Hardcoded colors
 * 2. Direct useTheme calls without useThemedStyles
 * 3. Static styles without theme parameter
 * 4. Hardcoded spacing values
 * 5. Custom shadow styles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to search for
const patterns = {
  hardcodedColors: /(#[0-9A-Fa-f]{3,8}|'white'|'black'|'red'|'blue'|'green'|'yellow'|'gray'|'grey'|'rgb\(|'rgba\()/g,
  directUseTheme: /import\s+{\s*[^}]*useTheme\s*[^}]*}\s*from\s+['"]react-native-paper['"]/g,
  staticStyles: /const\s+styles\s*=\s*StyleSheet\.create\(/g,
  hardcodedSpacing: /padding|margin|fontSize|borderRadius|gap|spacing|inset.*?:\s*(\d+)/g,
  customShadows: /shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation/g,
  isDarkMode: /isDarkMode/g
};

// Files to exclude
const excludePaths = [
  'node_modules',
  '.git',
  'build',
  'dist',
  'android',
  'ios',
  'scripts',
  '__tests__',
  'MD3_IMPLEMENTATION'
];

// File extensions to check
const includeExtensions = ['.tsx', '.ts', '.js', '.jsx'];

// Get all matching files
const getFiles = (dir) => {
  const files = [];
  
  const readDir = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      // Skip excluded paths
      if (excludePaths.some(exclude => relativePath.startsWith(exclude))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        readDir(fullPath);
      } else if (includeExtensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  };
  
  readDir(dir);
  return files;
};

// Check a file against the patterns
const checkFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = {};
  
  for (const [name, pattern] of Object.entries(patterns)) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      issues[name] = matches.length;
    }
  }
  
  return Object.keys(issues).length > 0 ? { filePath, issues } : null;
};

// Main execution
const runMigrationCheck = () => {
  const rootDir = path.resolve(process.cwd(), 'src');
  console.log(`Scanning directory: ${rootDir}`);
  
  const files = getFiles(rootDir);
  console.log(`Found ${files.length} files to check`);
  
  const results = [];
  let totalIssues = 0;
  
  for (const file of files) {
    const issues = checkFile(file);
    if (issues) {
      results.push(issues);
      totalIssues += Object.values(issues.issues).reduce((a, b) => a + b, 0);
    }
  }
  
  console.log('\n=== MD3 Migration Check Results ===');
  console.log(`Found ${totalIssues} issues in ${results.length} files`);
  
  if (results.length > 0) {
    console.log('\nFiles requiring migration:');
    
    // Group results by issue type
    const issueTypes = {
      hardcodedColors: { count: 0, files: [] },
      directUseTheme: { count: 0, files: [] },
      staticStyles: { count: 0, files: [] },
      hardcodedSpacing: { count: 0, files: [] },
      customShadows: { count: 0, files: [] },
      isDarkMode: { count: 0, files: [] }
    };
    
    for (const result of results) {
      const relativePath = path.relative(process.cwd(), result.filePath);
      
      console.log(`\n${relativePath}`);
      for (const [issue, count] of Object.entries(result.issues)) {
        console.log(`  - ${issue}: ${count} occurrences`);
        issueTypes[issue].count += count;
        issueTypes[issue].files.push(relativePath);
      }
    }
    
    console.log('\n=== Summary by Issue Type ===');
    for (const [issue, data] of Object.entries(issueTypes)) {
      if (data.count > 0) {
        console.log(`\n${issue}: ${data.count} occurrences in ${data.files.length} files`);
      }
    }
    
    console.log('\nPlease refer to src/styles/MD3_IMPLEMENTATION_GUIDE.md for migration instructions.');
  } else {
    console.log('Congratulations! No MD3 migration issues found.');
  }
};

runMigrationCheck(); 