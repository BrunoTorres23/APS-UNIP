/**
 * Verify Browser Testing Setup
 * This script checks if the browser testing setup is working correctly
 *
 * Usage:
 * 1. Open a terminal in the project root directory
 * 2. Run: node browser-testing/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const requiredFiles = [
  path.join('browser-testing', 'browsers.json'),
  path.join('browser-testing', 'features.json'),
  path.join('browser-testing', 'test-template.md'),
  path.join('browser-testing', 'manual-test.js'),
  path.join('js', 'browser-compatibility.js'),
  path.join('css', 'browser-fixes.css')
];

const requiredDirectories = [
  path.join('browser-testing', 'results'),
  path.join('browser-testing', 'screenshots'),
  path.join('browser-testing', 'results', 'chrome'),
  path.join('browser-testing', 'results', 'firefox'),
  path.join('browser-testing', 'results', 'safari'),
  path.join('browser-testing', 'results', 'edge'),
  path.join('browser-testing', 'results', 'ie'),
  path.join('browser-testing', 'results', 'mobile'),
  path.join('browser-testing', 'screenshots', 'chrome'),
  path.join('browser-testing', 'screenshots', 'firefox'),
  path.join('browser-testing', 'screenshots', 'safari'),
  path.join('browser-testing', 'screenshots', 'edge'),
  path.join('browser-testing', 'screenshots', 'ie'),
  path.join('browser-testing', 'screenshots', 'mobile')
];

// Check if index.html has the required scripts
function checkIndexHtml() {
  console.log('\nChecking index.html...');

  const indexPath = path.join(__dirname, '..', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: index.html not found');
    return false;
  }

  const content = fs.readFileSync(indexPath, 'utf8');

  const hasBrowserFixesCSS = content.includes('browser-fixes.css');
  const hasBrowserCompatibilityJS = content.includes('browser-compatibility.js');
  const hasManualTestJS = content.includes('manual-test.js');

  console.log(`- browser-fixes.css: ${hasBrowserFixesCSS ? '✅ Found' : '❌ Not found'}`);
  console.log(`- browser-compatibility.js: ${hasBrowserCompatibilityJS ? '✅ Found' : '❌ Not found'}`);
  console.log(`- manual-test.js: ${hasManualTestJS ? '✅ Found' : '❌ Not found'}`);

  return hasBrowserFixesCSS && hasBrowserCompatibilityJS && hasManualTestJS;
}

// Check if required files exist
function checkRequiredFiles() {
  console.log('\nChecking required files...');

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);

    console.log(`- ${file}: ${exists ? '✅ Found' : '❌ Not found'}`);

    if (!exists) {
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

// Check if required directories exist
function checkRequiredDirectories() {
  console.log('\nChecking required directories...');

  let allDirectoriesExist = true;

  for (const dir of requiredDirectories) {
    const dirPath = path.join(__dirname, '..', dir);
    const exists = fs.existsSync(dirPath);

    console.log(`- ${dir}: ${exists ? '✅ Found' : '❌ Not found'}`);

    if (!exists) {
      allDirectoriesExist = false;
    }
  }

  return allDirectoriesExist;
}

// Check if browsers.json is valid
function checkBrowsersJson() {
  console.log('\nChecking browsers.json...');

  const browsersPath = path.join(__dirname, 'browsers.json');
  if (!fs.existsSync(browsersPath)) {
    console.error('Error: browsers.json not found');
    return false;
  }

  try {
    const browsers = JSON.parse(fs.readFileSync(browsersPath, 'utf8'));

    if (!browsers.browsers || !Array.isArray(browsers.browsers) || browsers.browsers.length === 0) {
      console.error('Error: browsers.json does not contain a valid browsers array');
      return false;
    }

    console.log(`- Found ${browsers.browsers.length} browsers in configuration`);
    return true;
  } catch (e) {
    console.error('Error parsing browsers.json:', e.message);
    return false;
  }
}

// Check if features.json is valid
function checkFeaturesJson() {
  console.log('\nChecking features.json...');

  const featuresPath = path.join(__dirname, 'features.json');
  if (!fs.existsSync(featuresPath)) {
    console.error('Error: features.json not found');
    return false;
  }

  try {
    const features = JSON.parse(fs.readFileSync(featuresPath, 'utf8'));

    if (!features.features || !Array.isArray(features.features) || features.features.length === 0) {
      console.error('Error: features.json does not contain a valid features array');
      return false;
    }

    let totalTests = 0;
    features.features.forEach(feature => {
      if (feature.tests && Array.isArray(feature.tests)) {
        totalTests += feature.tests.length;
      }
    });

    console.log(`- Found ${features.features.length} feature groups with ${totalTests} total tests`);
    return true;
  } catch (e) {
    console.error('Error parsing features.json:', e.message);
    return false;
  }
}

// Run all checks
function runVerification() {
  console.log('Verifying Browser Testing Setup...');

  const filesExist = checkRequiredFiles();
  const directoriesExist = checkRequiredDirectories();
  const indexHtmlValid = checkIndexHtml();
  const browsersJsonValid = checkBrowsersJson();
  const featuresJsonValid = checkFeaturesJson();

  console.log('\nVerification Summary:');
  console.log(`- Required Files: ${filesExist ? '✅ All found' : '❌ Some missing'}`);
  console.log(`- Required Directories: ${directoriesExist ? '✅ All found' : '❌ Some missing'}`);
  console.log(`- index.html: ${indexHtmlValid ? '✅ Valid' : '❌ Missing required scripts'}`);
  console.log(`- browsers.json: ${browsersJsonValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`- features.json: ${featuresJsonValid ? '✅ Valid' : '❌ Invalid'}`);

  const allValid = filesExist && directoriesExist && indexHtmlValid && browsersJsonValid && featuresJsonValid;

  console.log('\nOverall Status:');
  if (allValid) {
    console.log('✅ Browser testing setup is correctly configured!');
    console.log('\nYou can now test your website by:');
    console.log('1. Opening index.html?browser-test=true for automated feature detection');
    console.log('2. Opening index.html?manual-test=true for manual testing');
  } else {
    console.log('❌ Browser testing setup has issues that need to be fixed.');
    console.log('\nPlease fix the issues above and run this verification script again.');
  }
}

// Run the verification
runVerification();
