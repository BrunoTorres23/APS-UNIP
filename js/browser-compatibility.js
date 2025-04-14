/**
 * Browser Compatibility Testing Script
 * This script helps detect browser features and logs compatibility issues
 */

(function() {
  // Only run in development mode or when testing flag is present
  const isTestMode = window.location.search.includes('browser-test') ||
                     localStorage.getItem('browser-test-mode') === 'true';

  if (!isTestMode) return;

  // Create test UI
  createTestUI();

  // Run browser feature detection
  const testResults = runFeatureTests();

  // Display results
  displayResults(testResults);

  /**
   * Creates the test UI panel
   */
  function createTestUI() {
    const panel = document.createElement('div');
    panel.className = 'browser-test-panel';
    panel.innerHTML = `
      <div class="test-panel-header">
        <h3>Browser Compatibility Test</h3>
        <button class="test-panel-close" aria-label="Close test panel">×</button>
      </div>
      <div class="test-panel-content">
        <div class="browser-info">
          <p><strong>Browser:</strong> ${getBrowserInfo().name} ${getBrowserInfo().version}</p>
          <p><strong>Platform:</strong> ${getPlatformInfo()}</p>
        </div>
        <div class="test-results">
          <h4>Feature Tests</h4>
          <div id="feature-test-results"></div>
        </div>
        <div class="test-actions">
          <button id="run-all-tests" class="test-button">Run All Tests</button>
          <button id="export-results" class="test-button">Export Results</button>
          <button id="exit-test-mode" class="test-button">Exit Test Mode</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Add event listeners
    panel.querySelector('.test-panel-close').addEventListener('click', () => {
      panel.classList.toggle('minimized');
    });

    panel.querySelector('#run-all-tests').addEventListener('click', () => {
      const results = runFeatureTests();
      displayResults(results);
    });

    panel.querySelector('#export-results').addEventListener('click', () => {
      exportResults(testResults);
    });

    panel.querySelector('#exit-test-mode').addEventListener('click', () => {
      localStorage.removeItem('browser-test-mode');
      panel.remove();
      location.href = location.pathname; // Reload without query params
    });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .browser-test-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        overflow: hidden;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .browser-test-panel.minimized {
        height: 40px;
        overflow: hidden;
      }

      .test-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f5f5;
        border-bottom: 1px solid #eee;
      }

      .test-panel-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .test-panel-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
      }

      .test-panel-content {
        padding: 12px;
        overflow-y: auto;
        max-height: 440px;
      }

      .browser-info {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }

      .test-results {
        margin-bottom: 15px;
      }

      .feature-test {
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 4px;
      }

      .feature-test.pass {
        background-color: #e6f4ea;
      }

      .feature-test.fail {
        background-color: #fce8e6;
      }

      .test-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .test-button {
        padding: 8px 12px;
        background: #1B4B82;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .test-button:hover {
        background: #153A6A;
      }

      @media (max-width: 600px) {
        .browser-test-panel {
          width: calc(100% - 40px);
          bottom: 10px;
          right: 10px;
          left: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Runs all feature tests
   * @returns {Object} Test results
   */
  function runFeatureTests() {
    const results = {
      browser: getBrowserInfo(),
      platform: getPlatformInfo(),
      timestamp: new Date().toISOString(),
      features: {
        // Core Web APIs
        es6Support: testES6Support(),
        es6Modules: testES6Modules(),
        serviceWorker: 'serviceWorker' in navigator,
        webStorage: testWebStorage(),

        // DOM APIs
        intersectionObserver: 'IntersectionObserver' in window,
        mutationObserver: 'MutationObserver' in window,
        resizeObserver: 'ResizeObserver' in window,

        // CSS Features
        cssGrid: testCSSGrid(),
        cssFlexbox: testCSSFlexbox(),
        cssVariables: testCSSVariables(),

        // Media Features
        webpSupport: testWebPSupport(),
        lazyLoading: 'loading' in HTMLImageElement.prototype,

        // Input Features
        touchEvents: 'ontouchstart' in window,
        pointerEvents: 'PointerEvent' in window,

        // Performance APIs
        requestAnimationFrame: 'requestAnimationFrame' in window,
        requestIdleCallback: 'requestIdleCallback' in window,

        // Misc
        webComponents: 'customElements' in window,
        webGL: testWebGL()
      }
    };

    // Log results to console for debugging
    console.log('Browser Compatibility Test Results:', results);

    return results;
  }

  /**
   * Displays test results in the UI
   * @param {Object} results Test results
   */
  function displayResults(results) {
    const container = document.getElementById('feature-test-results');
    container.innerHTML = '';

    for (const [feature, supported] of Object.entries(results.features)) {
      const el = document.createElement('div');
      el.className = `feature-test ${supported ? 'pass' : 'fail'}`;
      el.innerHTML = `
        <div class="feature-name">
          <strong>${formatFeatureName(feature)}:</strong>
          ${supported ? '✅ Supported' : '❌ Not Supported'}
        </div>
      `;
      container.appendChild(el);
    }
  }

  /**
   * Exports test results as JSON file
   * @param {Object} results Test results
   */
  function exportResults(results) {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `browser-test-${results.browser.name}-${results.browser.version}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Gets browser information
   * @returns {Object} Browser name and version
   */
  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = {
      name: 'Unknown',
      version: 'Unknown'
    };

    try {
      // Chrome
      if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1 && userAgent.indexOf('OPR') === -1) {
        browser.name = 'Chrome';
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // Firefox
      else if (userAgent.indexOf('Firefox') > -1) {
        browser.name = 'Firefox';
        const match = userAgent.match(/Firefox\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // Safari
      else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browser.name = 'Safari';
        const match = userAgent.match(/Version\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // Edge
      else if (userAgent.indexOf('Edg') > -1) {
        browser.name = 'Edge';
        const match = userAgent.match(/Edg\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // IE
      else if (userAgent.indexOf('Trident') > -1) {
        browser.name = 'Internet Explorer';
        const match = userAgent.match(/rv:([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // Opera
      else if (userAgent.indexOf('OPR') > -1) {
        browser.name = 'Opera';
        const match = userAgent.match(/OPR\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
      // Samsung Internet
      else if (userAgent.indexOf('SamsungBrowser') > -1) {
        browser.name = 'Samsung Internet';
        const match = userAgent.match(/SamsungBrowser\/([0-9.]+)/);
        if (match && match[1]) browser.version = match[1];
      }
    } catch (e) {
      console.error('Error detecting browser information:', e);
      // Continue with default values
    }

    return browser;
  }

  /**
   * Gets platform information
   * @returns {String} Platform name
   */
  function getPlatformInfo() {
    const userAgent = navigator.userAgent;

    if (/Windows/.test(userAgent)) {
      return 'Windows';
    } else if (/Macintosh/.test(userAgent)) {
      return 'macOS';
    } else if (/Android/.test(userAgent)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      return 'iOS';
    } else if (/Linux/.test(userAgent)) {
      return 'Linux';
    } else {
      return 'Unknown';
    }
  }

  /**
   * Formats feature name for display
   * @param {String} name Feature name in camelCase
   * @returns {String} Formatted name
   */
  function formatFeatureName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Tests ES6 support
   * @returns {Boolean} Whether ES6 is supported
   */
  function testES6Support() {
    try {
      // Test arrow functions, let/const, template literals, and destructuring
      eval('const test = () => {}; let x = 1; const y = `template`; const {z} = {z: 1};');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Tests ES6 modules support
   * @returns {Boolean} Whether ES6 modules are supported
   */
  function testES6Modules() {
    return 'noModule' in document.createElement('script');
  }

  /**
   * Tests web storage support
   * @returns {Boolean} Whether web storage is supported
   */
  function testWebStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Tests CSS Grid support
   * @returns {Boolean} Whether CSS Grid is supported
   */
  function testCSSGrid() {
    try {
      return window.CSS && CSS.supports('display', 'grid');
    } catch (e) {
      console.error('Error testing CSS Grid support:', e);
      return false;
    }
  }

  /**
   * Tests CSS Flexbox support
   * @returns {Boolean} Whether CSS Flexbox is supported
   */
  function testCSSFlexbox() {
    try {
      return window.CSS && CSS.supports('display', 'flex');
    } catch (e) {
      console.error('Error testing CSS Flexbox support:', e);
      return false;
    }
  }

  /**
   * Tests CSS Variables support
   * @returns {Boolean} Whether CSS Variables are supported
   */
  function testCSSVariables() {
    try {
      return window.CSS && CSS.supports('--test', '0');
    } catch (e) {
      console.error('Error testing CSS Variables support:', e);
      return false;
    }
  }

  /**
   * Tests WebP support
   * @returns {Boolean} Whether WebP is supported
   */
  function testWebPSupport() {
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        // Check if toDataURL returns a WebP data URL
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    } catch (e) {
      console.error('Error testing WebP support:', e);
      return false;
    }
  }

  /**
   * Tests WebGL support
   * @returns {Boolean} Whether WebGL is supported
   */
  function testWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') ||
                 canvas.getContext('experimental-webgl')));
    } catch (e) {
      console.error('Error testing WebGL support:', e);
      return false;
    }
  }
})();
