console.log("background.js is running");
getCookies();
chrome.storage.local.get("profiles", (data) => {
    if (!data.profiles) {
        chrome.storage.local.set({ profiles: [] }, () => {
            console.log("Initial profiles set.");
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received from:", sender);
    console.log("Action:", request.action);
    console.log("Profile:", request.profileName);
    switch(request.action) {
        case "loadProfile":
            chrome.storage.local.get("profiles", (data) => {
                var profile = request.profileName;
                var profiles = data.profiles;
                if (profiles) {
                    var index = profiles.indexOf(profile);
                    if (index > -1) {
                        console.log("Profile loaded successfully.");
                        sendResponse({ message: "Profile loaded successfully." });
                    } else {
                        sendResponse({ message: "Profile not found." });
                    }
                }
            });
            break;
         case "deleteProfile":
            chrome.storage.local.get("profiles", (data) => {
                var profiles = data.profiles;
                if (profiles) {
                    var index = profiles.indexOf(request.profileName);
                    if (index > -1) {
                        profiles.splice(index, 1);
                        chrome.storage.local.set({ profiles: profiles }, () => {
                            console.log("Profile deleted successfully.");
                        });
                    }
                }
                sendResponse({ message: "Profile deleted successfully." });
            });
            break;
        case "newProfile":
            chrome.storage.local.get("profiles", (data) => {
                var profiles = data.profiles;
                if (profiles) {
                    profiles.push("profile" + (profiles.length + 1));
                    chrome.storage.local.set({ profiles: profiles }, () => {
                        console.log("Profile created successfully.");
                        sendResponse({ message: "Profile created successfully." });
                    });
                }
            });
            break;
        case "getCookies":
            getCookies();
        break;
        default:
            sendResponse({ message: "Unrecognized action." });
            break;
    }
    return true;
});

function getCookies(){
    chrome.cookies.getAll({}, (cookies) => {
        if (cookies) {
            console.log("Cookies obtained successfully:", cookies);
        } else {
            console.error("Error obtaining cookies. Check permissions.");
        }
    });
}