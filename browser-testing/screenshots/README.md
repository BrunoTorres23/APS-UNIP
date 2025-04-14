# Browser Testing Screenshots

This directory contains screenshots of browser compatibility issues found during testing.

## Directory Structure

- `chrome/` - Screenshots from Google Chrome
- `firefox/` - Screenshots from Mozilla Firefox
- `safari/` - Screenshots from Safari
- `edge/` - Screenshots from Microsoft Edge
- `ie/` - Screenshots from Internet Explorer
- `mobile/` - Screenshots from mobile browsers

## Naming Convention

Screenshot files should follow this naming convention:

```
browser-version-platform-issue-description.png
```

For example:
- `chrome-115-windows-sidebar-overflow.png`
- `firefox-115-macos-image-alignment.png`
- `ie11-windows-flexbox-broken.png`

## Screenshot Guidelines

When taking screenshots:

1. Capture the entire page or the specific area with the issue
2. Use a descriptive filename that clearly indicates the problem
3. Include browser information in the filename
4. Reference the screenshot in the corresponding test result file
