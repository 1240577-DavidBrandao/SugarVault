<p align="center">
  <img src="media/logo-vault_wide.png" alt="Sugar Vault logo" width="500"/>
</p>

<h1 align="center">🍪 Sugar Vault</h1>
<p align="center"><strong>Probably the best cookie-related extension out there.</strong></p>
<p align="center">Define, save, and switch between cookie profiles with unmatched speed, security, and control.</p>

---

### 📚 Table of Contents

- [✨ Overview](#-overview)
- [⚙️ Features](#️-features)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔒 Security Notes](#-security-notes)
- [🛠️ Technologies Used](#️-technologies-used)
- [🧭 Future Improvements](#-future-improvements)
- [📢 Disclaimer](#-disclaimer)
- [🐞 Known Issues](#-known-issues)
- [📄 License](#-license)

---

## ✨ Overview

**Sugar Vault** is a browser extension built for developers, QA engineers, ethical hackers, and power users. It streamlines the process of switching between different sessions by allowing users to define and toggle cookie profiles at will.

> 🌟 Designed with privacy in mind, Sugar Vault handles all data locally — no servers, no leaks.

✅ Full support for `HttpOnly` and session cookies  
✅ Compatible with strict cookie domains like **Google**

---

## ⚙️ Features

- 🔄 **Instant profile switching** – Switch between user states in one click  
- 💾 **Save/load cookie sets** – Create and manage reusable cookie sessions  
- 🔐 **Supports sensitive cookies** – `HttpOnly`, `secure`, and session cookies  
- 🌍 **Cross-domain coverage** – Handles cookies across multiple sites and subdomains  
- 🧪 **Testing ready** – Perfect for login simulations, pentesting, QA flows, and more  
- ⚡ **Clean UI** – Lightweight popup, zero distractions  

---

## 📁 Project Structure

```bash
SUGARVAULT/
├── .git/             # Git repository
├── .vscode/          # VS Code settings
├── media/            # Media assets (e.g. logos)
├── background.js     # Background logic for cookie management
├── manifest.json     # Extension manifest (permissions, scripts)
├── popup.html        # HTML layout for the popup interface
├── popup.js          # JS controlling popup behavior
├── styles.css        # Popup styles
└── README.md         # Project documentation
```
## 🚀 Getting Started

    1. Clone the repository
        git clone https://github.com/1240577-DavidBrandao/ModularCookies.git
    2. Load the extension into your browser
        Open chrome://extensions/.
        Enable Developer Mode.
        Click “Load unpacked” and select the project folder.
    3. Use the extension
        Click the extension icon to save, load, or switch between cookie profiles as needed.

## 🔒 Security Notes

    All cookie operations are handled locally using chrome local storage.
    No data is transmitted externally.
    Only essential permissions are declared in manifest.json.

## 🛠️ Technologies Used

    JavaScript (ES6+)   
    HTML5 & CSS3
    Chrome WebExtension APIs
        
## 🧭 Future Improvements

    Encrypted profiles    
    Import/export profiles as JSON
    Profile auto-switching rules

## 📢 Disclaimer
This extension is provided "as is" and is intended for local development, testing, and research purposes only. Any misuse, data leakage, or unauthorized access resulting from its use is the sole responsibility of the user. The developer assumes no responsibility for any damages, security breaches, or data loss...
    
    ⚠️ Use this tool responsibly. The developer is not responsible for any data leaks, session hijacking, or misuse of stored cookies.

## 🐞 Known Issues - Please report any issues via [GitHub Issues page](https://github.com/1240577-DavidBrandao/SugarVault/issues).

### 🔸 Rare Cookie Saving Bug
>
>
> **Description:**
> During testing with HTTPOnly cookies, there were instances where saving a cookie profile did not store all cookies correctly, causing incomplete session restoration.
>
> **Occurrence:**
> Very Rare - only observed twice during early testing. Not yet reproduced in recent versions.
>
> **Possible Cause:**
> Condition when saving session cookies (Google related) with large number of entries.
>
> **Workaround:**
> - Re-saving the current profile.
> - Loading the selected profile.
> - Refresh the page before switching profiles. 
>
> **Status:**
> Being monitored - please [open issue](https://github.com/1240577-DavidBrandao/SugarVault/issues)

## 📄 License
This project is licensed under the [Mit License](/LICENSE).
