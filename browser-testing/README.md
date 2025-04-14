# Cross-Browser Testing Guide

This directory contains tools and documentation for cross-browser testing of the Tecnologia e Sustentabilidade project.

## Verificação da Configuração

Antes de começar os testes, verifique se a configuração está correta executando:

```
node browser-testing/verify-setup.js
```

Este script verificará se todos os arquivos e diretórios necessários existem e se a configuração está correta.

## Testing Setup

### Automated Feature Detection

The project includes a browser compatibility testing script that automatically detects browser features and capabilities. This script helps identify potential compatibility issues across different browsers.

To use the automated feature detection:

1. Add `?browser-test=true` to any page URL (e.g., `index.html?browser-test=true`)
2. A testing panel will appear in the bottom right corner
3. Click "Run All Tests" to check browser feature support
4. Click "Export Results" to download a JSON file with the test results

### Manual Testing

For comprehensive testing, manual verification is required to ensure the site works correctly across different browsers.

To use the manual testing tool:

1. Add `?manual-test=true` to any page URL (e.g., `index.html?manual-test=true`)
2. A testing panel will appear on the right side of the screen
3. Fill in the browser information (should be auto-detected)
4. Go through each test item and mark as Pass or Fail
5. Add notes for any issues found
6. Click "Export Test Results" to download a Markdown report

## Browsers to Test

The project should be tested on the following browsers:

| Browser | Versions | Platforms |
|---------|----------|-----------|
| Chrome | Latest, Latest-1 | Windows, macOS, Android |
| Firefox | Latest, Latest-1 | Windows, macOS, Android |
| Safari | Latest, Latest-1 | macOS, iOS |
| Edge | Latest | Windows |
| Internet Explorer | 11 | Windows |
| Samsung Internet | Latest | Android |

## Testing Process

1. **Visual Testing**: Ensure the site looks correct and consistent across browsers
   - Check layout, typography, colors, and spacing
   - Verify responsive design at different screen sizes
   - Test dark mode and high contrast mode

2. **Functional Testing**: Verify all features work correctly
   - Navigation and links
   - Sidebar functionality
   - Theme toggle
   - Lazy loading of images
   - Animations and transitions

3. **Performance Testing**: Check loading times and responsiveness
   - Initial page load time
   - Smooth scrolling and animations
   - Resource loading efficiency

4. **Progressive Enhancement**: Verify graceful degradation
   - Basic content accessibility without JavaScript
   - Fallback functionality for older browsers
   - Service worker and offline capabilities

## Common Issues and Fixes

### Internet Explorer 11

- Flexbox issues: Use the fallback styles in browser-fixes.css
- CSS Variables: Provide fallback values
- ES6 features: Ensure the bundle.js fallback loads correctly

### Safari

- Sticky positioning: Test fixed positioning as fallback
- Form styling: Check for -webkit-appearance issues

### Mobile Browsers

- 100vh issues: Use -webkit-fill-available for full-height elements
- Touch events: Test touch interactions thoroughly
- Fixed positioning: Check for address bar resizing issues

## Reporting Issues

When you find an issue:

1. Document the issue with screenshots
2. Note the browser, version, and platform
3. Provide steps to reproduce
4. Export a test report using the manual testing tool
5. Add the issue to the project's issue tracking system

## Fixing Issues

1. Add browser-specific fixes to css/browser-fixes.css
2. Use feature detection in JavaScript, not browser detection
3. Test fixes across all supported browsers
4. Document any workarounds in code comments
