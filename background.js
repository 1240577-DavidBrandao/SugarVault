
chrome.runtime.onInstalled.addListener(() => {
    saveBaseProfile();
    chrome.storage.local.get("profiles", (data) => {
        if (!data.profiles) {
            chrome.storage.local.set({
                profiles: ["default", "base"],
                activeProfile: "base",
            });
        }
    });
});
chrome.storage.local.get(["profiles", "cookies"], (data) => {
    let profiles = data.profiles || [];
    let cookies = data.cookies || {};
    if (cookies["default"] && cookies["default"].length === 0) {
        profiles = profiles.filter(profile => profile !== "default");
    }
});
chrome.storage.local.get("profiles", (data) => {
    if (!data.profiles) {
        chrome.storage.local.set({ profiles: [] });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "newProfile":
            chrome.storage.local.get(["profiles"], (data) => {
                const profiles = data.profiles || [];
                const newProfileName = `profile${profiles.length - 1}`;
                profiles.push(newProfileName);
                chrome.storage.local.get(["activeProfile"], (activeData) => {
                    const activeProfile = activeData.activeProfile || "default";
                    saveCookiestoProfile(activeProfile, () => {
                        saveBaseProfile(() => {
                            clearAllCookies(() => {
                                chrome.storage.local.set({ profiles, activeProfile: newProfileName }, () => {
                                    sendResponse({ message: "Profile created successfully." });
                                });
                            });
                        });
                    });
                });
            });
            break;


        case "loadProfile":
            chrome.storage.local.get(["activeProfile"], (data) => {
                const activeProfile = data.activeProfile || "default";
                saveCookiestoProfile(activeProfile, () => {
                    saveBaseProfile(() => {
                        clearAllCookies(() => {
                            loadCookiesFromProfile(request.profileName, (message) => {
                                chrome.storage.local.set({ activeProfile: request.profileName }, () => {
                                    sendResponse({ message });
                                });
                            });
                        });
                    });
                });
            });
            break;
        case "deleteProfile":
            if (["default", "base"].includes(request.profileName)) {
                sendResponse({ message: "Impossible to delete profile." });
            } else {
                chrome.storage.local.get("profiles", (data) => {
                    var profiles = data.profiles || [];
                    var index = profiles.indexOf(request.profileName);
                    if (index > -1) {
                        profiles.splice(index, 1);
                        chrome.storage.local.set({ profiles: profiles }, () => {
                            sendResponse({ message: "Profile deleted successfully." });
                        });
                    }
                });
            }
            break;

        case "getCookies":
            getCookies();
            break;
        case "Change Profile Name":
            if (["default", "base"].includes(request.profileSelected)) {
                sendResponse({ message: "Impossible to rename profile." });
            } else {
                changeName(request.profileSelected, request.profileName, sendResponse);
            }
            break;
        default:
            sendResponse({ message: "Error. Try again" });
            break;
    }
    return true;
});

function getCookies() {
    chrome.cookies.getAll({}, (cookies) => {
        if (cookies) {
            chrome.runtime.sendMessage({ action: "sendCookies", data: cookies });
        }
        else {
            console.error("Error obtaining cookies. Check permissions.");
        }
    });
}


function clearAllCookies(callback) {
    chrome.cookies.getAll({}, (cookies) => {
        let pending = cookies.length;
        if (!pending) return callback();
        cookies.forEach((cookie) => {
            chrome.cookies.remove({
                url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`,
                name: cookie.name,
            }, () => {
                if (--pending === 0) callback();
            });
        });
    });
}


function saveCookiestoProfile(profileName, callback) {
    if (!profileName || profileName === null) {
        profileName = "default";
    }
    chrome.cookies.getAll({}, (cookies) => {
        if (cookies && cookies.length > 0) {
            chrome.storage.local.get("cookies", (data) => {
                let allCookies = data.cookies || {};
                allCookies[profileName] = cookies;
                chrome.storage.local.set({ cookies: allCookies }, () => {
                    if (callback) callback();
                });
            });
        } else {
            console.error("Error: No cookies found.");
            if (profileName !== "default") {
                chrome.storage.local.get("cookies", (data) => {
                    let allCookies = data.cookies || {};
                    allCookies["default"] = cookies;
                    chrome.storage.local.set({ cookies: allCookies }, () => {
                        console.warn("Cookies saved on the default profile.");
                        if (callback) callback("Erro: Salvo no perfil padrão.");
                    });
                });
            }
        }
    });
}

function loadCookiesFromProfile(profileName, callback) {
    chrome.storage.local.get("cookies", (data) => {
        const allCookies = data.cookies || {};
        const profileCookies = allCookies[profileName] || [];

        if (profileCookies.length === 0) {
            console.warn(`No cookies found for this profile: ${profileName}`);
            if (callback) callback(`No cookies found for this profile: ${profileName}`);
            return;
        }

        clearAllCookies(() => {
            setProfileCookies(profileCookies, callback);
        });
    });
}



function setProfileCookies(profileCookies, callback) {
    let pending = profileCookies.length;

    if (pending === 0) {
        if (callback) callback("No cookies found.");
        return;
    }

    profileCookies.forEach((cookie) => {
        try {
            let url = `http${cookie.secure ? "s" : ""}://${cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`;
            chrome.cookies.set({
                url: url,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                expirationDate: cookie.expirationDate,
            }, (result) => {
                if (chrome.runtime.lastError) {
                    console.error("Error defining cookie:", chrome.runtime.lastError, cookie);
                }
                if (--pending === 0) {
                    if (callback) callback("All cookies set.");
                }
            });
        } catch (error) {
            console.error("Error processing cookie", cookie, error);
            if (--pending === 0) {
                if (callback) callback("Error processing cookies.");
            }
        }
    });
}


function saveBaseProfile(callback) {
    chrome.cookies.getAll({}, (cookies) => {
        chrome.storage.local.get("cookies", (data) => {
            var allCookies = data.cookies || {};
            const baseCookies = allCookies["base"] || [];
            const uniqueCookies = [...baseCookies];
            cookies.forEach((cookie) => {
                if (!uniqueCookies.some((c) => c.name === cookie.name && c.domain === cookie.domain)) {
                    uniqueCookies.push(cookie);
                }
            });

            allCookies["base"] = uniqueCookies;
            chrome.storage.local.set({ cookies: allCookies }, () => {
                if (callback) callback();
            });
        });
    });
}

function changeName(profileSelected, profileName, sendResponse) {
    chrome.storage.local.get(["profiles", "cookies"], (data) => {
        const profiles = data.profiles || [];
        const cookies = data.cookies || {};

        const profileIndex = profiles.indexOf(profileSelected);
        if (profileIndex === -1 || profileIndex === 0 || profileIndex === 1) {
            sendResponse({ message: "Unable to update profile" });
            return;
        }
        if (!profileName || profileName.trim() === "" || profiles.includes(profileName)) {
            sendResponse({ message: "Invalid name. Try again" });
            return;
        }
        profiles[profileIndex] = profileName;
        const profileCookies = cookies[profileSelected] || [];
        cookies[profileName] = profileCookies;
        delete cookies[profileSelected];
        chrome.storage.local.set({ profiles, cookies, activeProfile: profileName }, () => {
            sendResponse({ message: "Profile changed successfully." });
        });
    });
}