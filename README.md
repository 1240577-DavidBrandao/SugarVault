<p align="center">
  <img src="media/logo-vault_wide.png" alt="Sugar Vault logo" width="500"/>
</p>

<h1 align="center">Sugar Vault</h1>
<p align="center"><strong>Probably the best cookies-related extension out there.</strong></p>
<p align="center">Switch between multiple cookie profiles with speed, security, and flexibility.</p>

---

### 🧭 Table of Contents

- [✨ Overview](#-overview)
- [⚙️ Features](#️-features)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔒 Security Notes](#-security-notes)
- [🛠️ Technologies Used](#️-technologies-used)
- [🧭 Future Improvements](#-future-improvements)
- [📢 Disclaimer](#-disclaimer)
- [🐞 Known Issues ](#-known-issues)
- [📄 License](#-license)

---

## ✨ Overview

**Sugar Vault** is a browser extension designed for developers, testers, and advanced users who need to manage multiple sessions and user profiles. It's especially useful in QA environments, automation workflows, and security testing.

- Full support for `HttpOnly` and session cookies  
- Works on domains with strict cookie policies like Google

---

## ⚙️ Features

- 🔄 Switch between saved cookie profiles instantly  
- 💾 Save and load personalized cookie sets  
- 🔐 Supports `HttpOnly` and session cookies  
- 🌐 Works across multiple domains and subdomains  
- 🧪 Ideal for multi-login testing, isolated environments, and debugging  
- 💡 Lightweight and responsive user interface  

---

## 📁 Project Structure

    SUGARVAULT/
    ├── .git/                    # Git repository
    ├── .vscode/                 # VS Code settings
    ├── media/                   # (Optional) Media files or icons
    ├── background.js            # Background script for cookie handling
    ├── manifest.json            # Extension manifest
    ├── popup.html               # UI layout for the popup
    ├── popup.js                 # Popup script logic
    ├── styles.css               # Styles for the popup
    └── README.md                # Project documentation

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
    This extension is provided "as is" and is intended for local development, testing, and research purposes only. Any misuse, data leakage, or unauthorized access resulting from its use is the sole responsibility of the user. The developer of this extension is not liable for any damages, security breaches, or data loss caused directly or indirectly through the use of this tool.

        ⚠️ Use this tool responsibly. The developer is not responsible for any data leaks, session hijacking, or misuse of stored cookies.

## 🐞 Known Issues    
### 🔸 Rare Cookie Saving Bug
>
>
> **Description:**
> During testing with HTTPOnly cookies, there were instances where saving a cookie profile did not store all cookies correctly, causing incomplete session restoration.
>
> **Ocurrence:**
> Very Rare - only observed twice during ealy testing. Not reproducible in recent versions.
>
> **Possible Cause:**
> Condition when saving session cookies (Google related) with large number of entrie.
>
> **Workaround:**
> Re-saving the current profile.
> Loading the selected profile.
> Refresh the page before switching profiles. 
>
> **Status:**
> Being monitored - please [open issue](https://github.com/1240577-DavidBrandao/SugarVault/issues)

## 📄 License
    This project is licensed under the [MIT License](LICENSE).
