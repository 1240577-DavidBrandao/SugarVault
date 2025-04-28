<p align="center">
  <img src="media/logo-vault_wide.png" alt="Sugar Vault logo" width="500"/>
</p>

<p align="center"><strong>A professional cookie management extension for developers and security professionals.</strong></p>
<p align="center">Efficiently manage, store, and switch between cookie profiles with enterprise-grade security and control.</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Security Notes](#security-notes)
- [Technologies Used](#technologies-used)
- [Future Improvements](#future-improvements)
- [Disclaimer](#disclaimer)
- [Known Issues](#known-issues)
- [License](#license)

---

## Overview

Sugar Vault is a browser extension designed for developers, QA engineers, security professionals, and advanced users. It provides a robust solution for managing and switching between different browser sessions through cookie profile management.

Key capabilities:
- Full support for `HttpOnly` and session cookies
- Compatibility with strict cookie domains including Google services
- Local data handling with zero external transmission

---

## Features

- **Profile Management**: Instant switching between user states
- **Cookie Persistence**: Save and load complete cookie sessions
- **Security Compliance**: Support for `HttpOnly`, `secure`, and session cookies
- **Domain Coverage**: Comprehensive handling of cookies across multiple domains and subdomains
- **Testing Integration**: Ideal for development, security testing, and QA workflows
- **Minimalist Interface**: Efficient, distraction-free user experience

---

## Project Structure

```bash
SUGARVAULT/
├── .git/             # Git repository
├── .vscode/          # VS Code settings
├── media/            # Media assets
├── background.js     # Background logic for cookie management
├── manifest.json     # Extension manifest (permissions, scripts)
├── popup.html        # HTML layout for the popup interface
├── popup.js          # JS controlling popup behavior
├── styles.css        # Popup styles
└── README.md         # Project documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/1240577-DavidBrandao/ModularCookies.git
   ```

2. Load the extension:
   - Navigate to chrome://extensions/
   - Enable Developer Mode
   - Select "Load unpacked" and choose the project directory

3. Implementation:
   - Access the extension via the browser toolbar
   - Create and manage cookie profiles as needed

## Security Notes

- All cookie operations are performed locally using Chrome's local storage
- No external data transmission
- Minimal permission requirements as specified in manifest.json

## Technologies Used

- JavaScript (ES6+)
- HTML5 & CSS3
- Chrome WebExtension APIs

## Future Improvements

- Profile encryption
- JSON-based profile import/export
- Automated profile switching rules

## Disclaimer

This extension is provided "as is" for development, testing, and research purposes. Users are responsible for ensuring proper usage and data security. The developer assumes no liability for any damages, security breaches, or data loss resulting from the use of this tool.

## Known Issues

### Cookie Persistence Issue

**Description:**
In specific scenarios involving HTTPOnly cookies, particularly with Google services, profile saving may not capture all cookies, resulting in incomplete session restoration.

**Occurrence:**
Rare - documented in two instances during initial testing. Not reproduced in current versions.

**Potential Cause:**
Session cookie handling during large-scale cookie operations.

**Workaround:**
1. Re-save the current profile
2. Reload the selected profile
3. Refresh the page before profile switching

**Status:**
Under investigation. Please report any occurrences via the [GitHub Issues page](https://github.com/1240577-DavidBrandao/SugarVault/issues).

## License

This project is licensed under the [MIT License](/LICENSE).
