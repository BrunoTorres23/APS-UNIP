/**
 * Update Subpages Script
 * This script helps update all subpages with the browser compatibility testing scripts
 * 
 * Usage:
 * 1. Open a terminal in the project root directory
 * 2. Run: node browser-testing/update-subpages.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const paginasDir = path.join(__dirname, '..', 'paginas');
const templatePath = path.join(__dirname, 'subpage-update-template.txt');

// Read the template
const template = fs.readFileSync(templatePath, 'utf8');
const [cssAddition, jsAddition] = template.split('\n\n');

// Process all HTML files in the paginas directory
function updateSubpages() {
  console.log('Updating subpages with browser compatibility testing scripts...');
  
  // Check if paginas directory exists
  if (!fs.existsSync(paginasDir)) {
    console.error(`Error: Directory '${paginasDir}' does not exist.`);
    return;
  }
  
  // Get all HTML files
  const files = fs.readdirSync(paginasDir)
    .filter(file => file.endsWith('.html'));
  
  if (files.length === 0) {
    console.log('No HTML files found in the paginas directory.');
    return;
  }
  
  console.log(`Found ${files.length} HTML files to update.`);
  
  // Process each file
  files.forEach(file => {
    const filePath = path.join(paginasDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add CSS link
    if (!content.includes('browser-fixes.css')) {
      content = content.replace(
        /<link rel="stylesheet" href="..\/css\/style.css" media="all">/,
        `<link rel="stylesheet" href="../css/style.css" media="all">\n    <!-- Browser-specific fixes -->\n    <link rel="stylesheet" href="../css/browser-fixes.css" media="all">`
      );
    }
    
    // Add JS scripts
    if (!content.includes('browser-compatibility.js')) {
      content = content.replace(
        /<\/body>/,
        `    <!-- Browser Compatibility Testing -->\n    <script src="../js/browser-compatibility.js" defer></script>\n    <script src="../browser-testing/manual-test.js" defer></script>\n</body>`
      );
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  });
  
  console.log('All subpages updated successfully!');
}

// Run the update function
updateSubpages();
