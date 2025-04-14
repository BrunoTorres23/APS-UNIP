/**
 * Manual Browser Testing Helper
 * This script helps with manual browser testing by providing a UI for testers
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only run if in test mode
  const isTestMode = window.location.search.includes('manual-test');
  if (!isTestMode) return;

  // Create test UI
  createTestUI();

  /**
   * Creates the test UI panel
   */
  function createTestUI() {
    // Load test configuration
    // Determine correct path based on current location
    const basePath = window.location.pathname.includes('/paginas/') ? '../' : './';

    Promise.all([
      fetch(`${basePath}browser-testing/browsers.json`).then(res => res.json()),
      fetch(`${basePath}browser-testing/features.json`).then(res => res.json())
    ])
    .then(([browsersConfig, featuresConfig]) => {
      // Create panel
      const panel = document.createElement('div');
      panel.className = 'manual-test-panel';

      // Create panel content
      panel.innerHTML = `
        <div class="test-panel-header">
          <h3>Manual Browser Testing</h3>
          <button class="test-panel-toggle" aria-label="Toggle test panel">_</button>
        </div>
        <div class="test-panel-content">
          <form id="test-form">
            <div class="form-section">
              <h4>Browser Information</h4>
              <div class="form-group">
                <label for="browser-select">Browser:</label>
                <select id="browser-select" required>
                  <option value="">Select Browser</option>
                  ${browsersConfig.browsers.map(browser =>
                    `<option value="${browser.name}">${browser.name}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="browser-version">Version:</label>
                <input type="text" id="browser-version" placeholder="e.g. 100.0.4896.75" required>
              </div>
              <div class="form-group">
                <label for="platform-select">Platform:</label>
                <select id="platform-select" required>
                  <option value="">Select Platform</option>
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                </select>
              </div>
              <div class="form-group">
                <label for="tester-name">Tester Name:</label>
                <input type="text" id="tester-name" placeholder="Your Name" required>
              </div>
            </div>

            ${featuresConfig.features.map(featureGroup => `
              <div class="form-section">
                <h4>${featureGroup.name}</h4>
                ${featureGroup.tests.map(test => `
                  <div class="test-item">
                    <div class="test-name">${test}</div>
                    <div class="test-result">
                      <label>
                        <input type="radio" name="test-${slugify(test)}" value="pass" required>
                        Pass
                      </label>
                      <label>
                        <input type="radio" name="test-${slugify(test)}" value="fail">
                        Fail
                      </label>
                    </div>
                    <div class="test-notes">
                      <input type="text" placeholder="Notes (optional)" name="notes-${slugify(test)}">
                    </div>
                  </div>
                `).join('')}
              </div>
            `).join('')}

            <div class="form-section">
              <h4>Issues Found</h4>
              <textarea id="issues-found" rows="4" placeholder="Describe any issues found during testing..."></textarea>
            </div>

            <div class="form-section">
              <h4>Recommendations</h4>
              <textarea id="recommendations" rows="4" placeholder="Any recommendations for improvements..."></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="primary-button">Export Test Results</button>
              <button type="button" id="exit-test-mode" class="secondary-button">Exit Test Mode</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(panel);

      // Add event listeners
      panel.querySelector('.test-panel-toggle').addEventListener('click', () => {
        panel.classList.toggle('minimized');
      });

      panel.querySelector('#exit-test-mode').addEventListener('click', () => {
        panel.remove();
        window.location.href = window.location.pathname; // Remove query params
      });

      // Handle form submission
      document.getElementById('test-form').addEventListener('submit', function(e) {
        e.preventDefault();
        exportTestResults(this, featuresConfig);
      });

      // Add browser detection
      const browserInfo = detectBrowser();
      document.getElementById('browser-select').value = browserInfo.name;
      document.getElementById('browser-version').value = browserInfo.version;
      document.getElementById('platform-select').value = browserInfo.platform;

      // Add styles
      addStyles();
    })
    .catch(error => {
      console.error('Failed to load test configuration:', error);
      alert('Failed to load test configuration. Please make sure the browser-testing directory exists.');
    });
  }

  /**
   * Exports test results as markdown file
   * @param {HTMLFormElement} form The form element
   * @param {Object} featuresConfig Features configuration
   */
  function exportTestResults(form, featuresConfig) {
    const formData = new FormData(form);
    const browser = document.getElementById('browser-select').value;
    const version = document.getElementById('browser-version').value;
    const platform = document.getElementById('platform-select').value;
    const tester = document.getElementById('tester-name').value;
    const issues = document.getElementById('issues-found').value;
    const recommendations = document.getElementById('recommendations').value;

    // Create markdown content
    let markdown = `# Cross-Browser Test Report\n\n`;
    markdown += `## Browser Information\n`;
    markdown += `- **Browser**: ${browser}\n`;
    markdown += `- **Version**: ${version}\n`;
    markdown += `- **Platform**: ${platform}\n`;
    markdown += `- **Date Tested**: ${new Date().toISOString().split('T')[0]}\n`;
    markdown += `- **Tester**: ${tester}\n\n`;

    markdown += `## Test Results\n\n`;

    // Add test results for each feature group
    featuresConfig.features.forEach(featureGroup => {
      markdown += `### ${featureGroup.name}\n`;
      markdown += `| Test | Result | Notes |\n`;
      markdown += `|------|--------|-------|\n`;

      featureGroup.tests.forEach(test => {
        const testId = slugify(test);
        const result = formData.get(`test-${testId}`);
        const notes = formData.get(`notes-${testId}`) || '';

        markdown += `| ${test} | ${result === 'pass' ? '✅' : '❌'} | ${notes} |\n`;
      });

      markdown += `\n`;
    });

    // Add issues and recommendations
    if (issues.trim()) {
      markdown += `## Issues Found\n`;
      markdown += issues.split('\n').map(line => `- ${line}`).join('\n');
      markdown += `\n\n`;
    }

    if (recommendations.trim()) {
      markdown += `## Recommendations\n`;
      markdown += recommendations.split('\n').map(line => `- ${line}`).join('\n');
      markdown += `\n`;
    }

    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-test-${browser}-${version}-${platform}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Detects browser information
   * @returns {Object} Browser information
   */
  function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browser = {
      name: '',
      version: '',
      platform: ''
    };

    try {
      // Detect browser name and version
      if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1 && userAgent.indexOf('OPR') === -1) {
        browser.name = 'Chrome';
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('Firefox') > -1) {
        browser.name = 'Firefox';
        const match = userAgent.match(/Firefox\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browser.name = 'Safari';
        const match = userAgent.match(/Version\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('Edg') > -1) {
        browser.name = 'Edge';
        const match = userAgent.match(/Edg\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('Trident') > -1) {
        browser.name = 'Internet Explorer';
        const match = userAgent.match(/rv:([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('OPR') > -1) {
        browser.name = 'Opera';
        const match = userAgent.match(/OPR\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      } else if (userAgent.indexOf('SamsungBrowser') > -1) {
        browser.name = 'Samsung Internet';
        const match = userAgent.match(/SamsungBrowser\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
    } catch (e) {
      console.error('Error detecting browser information:', e);
      // Continue with default values
    }

    // Detect platform
    if (/Windows/.test(userAgent)) {
      browser.platform = 'Windows';
    } else if (/Macintosh/.test(userAgent)) {
      browser.platform = 'macOS';
    } else if (/Android/.test(userAgent)) {
      browser.platform = 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      browser.platform = 'iOS';
    } else if (/Linux/.test(userAgent)) {
      browser.platform = 'Linux';
    }

    return browser;
  }

  /**
   * Converts a string to a slug
   * @param {String} text Text to convert
   * @returns {String} Slugified text
   */
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  /**
   * Adds styles for the test UI
   */
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .manual-test-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        overflow: hidden;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .manual-test-panel.minimized .test-panel-content {
        display: none;
      }

      .test-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #f5f5f5;
        border-bottom: 1px solid #eee;
      }

      .test-panel-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .test-panel-toggle {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #666;
      }

      .test-panel-content {
        padding: 15px;
        overflow-y: auto;
        max-height: calc(80vh - 40px);
      }

      .form-section {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }

      .form-section h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .form-group {
        margin-bottom: 10px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 12px;
        font-weight: 500;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .test-item {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        padding: 8px;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .test-name {
        flex: 1;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .test-result {
        display: flex;
        gap: 10px;
        margin-bottom: 5px;
      }

      .test-result label {
        display: flex;
        align-items: center;
        font-size: 12px;
      }

      .test-result input {
        margin-right: 5px;
      }

      .test-notes {
        width: 100%;
      }

      .test-notes input {
        width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
      }

      textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        resize: vertical;
      }

      .form-actions {
        display: flex;
        gap: 10px;
      }

      .primary-button,
      .secondary-button {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }

      .primary-button {
        background: #1B4B82;
        color: white;
      }

      .secondary-button {
        background: #f5f5f5;
        border: 1px solid #ddd;
      }

      .primary-button:hover {
        background: #153A6A;
      }

      .secondary-button:hover {
        background: #e5e5e5;
      }

      @media (max-width: 600px) {
        .manual-test-panel {
          width: calc(100% - 40px);
          top: 10px;
          right: 10px;
          left: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }
});
