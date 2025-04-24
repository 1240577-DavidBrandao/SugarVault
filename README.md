🧩 Sugar Vault
Easily manage and switch between multiple cookie profiles with speed, security and flexibility.

✨ Overview
Sugar Vault is a browser extension designed for developers, testers and advanced users who need to switch between multiple sessions and user profiles at the same time. It's especially useful in QA environments, automation workflows, and security testing.
Full support for HttpOnly cookies and compatibility with domains that enforce strict cookie policies such as Google.

⚙️ Features
 🔄 Quickly switch between saved cookie profiles

 💾 Save and load personalized cookie sets

 🔐 Supports HttpOnly and session cookies

 🌐 Works across multiple domains and subdomains

 🧪 Ideal for testing multiple logins, isolated environments, and debugging

 💡 Simple and responsive user interface

📁 Project Structure
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

🚀 Getting Started
    1. Clone the repository
        git clone https://github.com/1240577-DavidBrandao/ModularCookies.git
    2. Load the extension into your browser
        Open chrome://extensions/ (or equivalent in Firefox).
        Enable Developer Mode.
        Click “Load unpacked” and select the project folder.
    3. Use the extension
        Click the extension icon to save, load, or switch between cookie profiles as needed.

🔒 Security Notes
    All cookie operations are handled locally using chrome local storage.
    No data is transmitted externally.
    Only essential permissions are declared in manifest.json.

🛠️ Technologies Used
    JavaScript (ES6+)   
    HTML5 & CSS3
    Chrome/Firefox WebExtension APIs
        
🧭 Future Improvements
    Encrypted profiles
    
    Import/export profiles as JSON
    
    Profile auto-switching rules

📄 License
    This project is licensed under the [MIT License](LICENSE).
