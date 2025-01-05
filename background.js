console.log("background.js is running");

chrome.runtime.onInstalled.addListener(() => {
    saveBaseProfile(() => {
        console.log("Perfil base inicializado com todos os cookies.");
    });
});
chrome.storage.local.get("profiles", (data) => {
    if (!data.profiles) {
        chrome.storage.local.set({ profiles: [] }, () => {
            console.log("Initial profiles set.");
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "newProfile":
            chrome.storage.local.get(["profiles"], (data) => {
                const profiles = data.profiles || [];
                const newProfileName = `profile${profiles.length - 1}`;
                profiles.push(newProfileName);
                saveCookiestoProfile("default", () => {
                    clearAllCookies(() => {
                        chrome.storage.local.set({ profiles, activeProfile: newProfileName }, () => {
                            console.log(`Novo perfil criado e ativo: ${newProfileName}`);
                            sendResponse({ message: "Profile created successfully." });
                        });
                    });
                });
            });
            break;


        case "loadProfile":
            chrome.storage.local.get(["profiles", "activeProfile"], (data) => {
                const activeProfile = data.activeProfile || "default";
                saveCookiestoProfile(activeProfile, () => {
                    loadCookiesFromProfile(request.profileName, (message) => {
                        chrome.storage.local.set({ activeProfile: request.profileName }, () => {
                            console.log(`Perfil ativo agora é: ${request.profileName}`);
                            sendResponse({ message });
                        });
                    });
                });
            });
            break;
        case "deleteProfile":
            if (["default", "base"].includes(request.profileName)) {
                sendResponse({ message: "Não é possível excluir este perfil." });
            } else {
                chrome.storage.local.get("profiles", (data) => {
                    var profiles = data.profiles || [];
                    var index = profiles.indexOf(request.profileName);
                    if (index > -1) {
                        profiles.splice(index, 1);
                        chrome.storage.local.set({ profiles: profiles }, () => {
                            console.log("Perfil excluído:", request.profileName);
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
            changeName(request.profileSelected, request.profileName, sendResponse);
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
            console.log("Cookies obtained successfully:", cookies); 
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
        if (!pending) return callback(); // Nenhum cookie para limpar
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
    if (profileName === "" || profileName === null) {
        profileName = "default";
    }
    chrome.cookies.getAll({}, (cookies) => {
        if (cookies && cookies.length > 0) {
            console.log("Cookies obtidos para salvar:", cookies);
            chrome.storage.local.get("cookies", (data) => {
                var allCookies = data.cookies || {};
                allCookies[profileName] = cookies;
                chrome.storage.local.set({ cookies: allCookies }, () => {
                    console.log(`Cookies salvos no perfil: ${profileName}`);
                    if (callback) callback();
                });
            });
        } else {
            console.error("Nenhum cookie encontrado para salvar.");
            if (callback) callback("Erro: Nenhum cookie encontrado para salvar.");
        }
    });
}

function loadCookiesFromProfile(profileName, callback) {
    chrome.storage.local.get("cookies", (data) => {
        const allCookies = data.cookies || {};
        const profileCookies = allCookies[profileName] || [];

        if (profileCookies.length === 0) {
            console.warn(`Nenhum cookie encontrado para o perfil: ${profileName}`);
            if (callback) callback(`Nenhum cookie encontrado para o perfil: ${profileName}`);
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
        console.log("Nenhum cookie para carregar.");
        if (callback) callback("Nenhum cookie para carregar.");
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
                    console.error("Erro ao definir cookie:", chrome.runtime.lastError, cookie);
                }
                if (--pending === 0) {
                    console.log("Todos os cookies foram carregados com sucesso.");
                    if (callback) callback("Cookies carregados com sucesso.");
                }
            });
        } catch (error) {
            console.error("Erro ao processar cookie:", cookie, error);
            if (--pending === 0) {
                if (callback) callback("Erro ao processar alguns cookies.");
            }
        }
    });
}


function saveBaseProfile(callback) {
    chrome.cookies.getAll({}, (cookies) => {
        chrome.storage.local.get("cookies", (data) => {
            var allCookies = data.cookies || {};
            allCookies["base"] = cookies;
            chrome.storage.local.set({ cookies: allCookies }, () => {
                console.log("Backup dos cookies salvos no perfil `base`.");
                if (callback) callback();
            });
        });
    });
}


function changeName(profileSelected, profileName, sendResponse) {
    chrome.storage.local.get(["profiles", "cookies"], (data) => {
        //profile and cookies data
        const profiles = data.profiles || [];
        const cookies = data.cookies || {};

        //profile selected
        const profileIndex = profiles.indexOf(profileSelected);
        if (profileIndex === -1 || profileIndex===0 || profileIndex===1) {
            sendResponse({ message: "Unable to update profile" });
            return;
        }

        //checking if profile name exists
        if (!profileName || profileName.trim() === "" || profiles.includes(profileName)) {
            sendResponse({ message: "Invalid name. Try again" });
            return;
        }
        profiles[profileIndex] = profileName;

        //cookies
        const profileCookies = cookies[profileSelected] || [];
        cookies[profileName] = profileCookies;
        delete cookies[profileSelected];
        chrome.storage.local.set({ profiles, cookies, activeProfile: profileName }, () => {
            console.log(`Perfil renomeado para: ${profileName}`);
            sendResponse({ message: "Profile changed successfully." });
        });
    });
}