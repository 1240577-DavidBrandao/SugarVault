console.log("popup.js is running");

document.addEventListener("DOMContentLoaded", loadProfiles);
document.getElementById("load-button").addEventListener("click", () => {
    console.log("Load button clicked");
    var profile = document.getElementById("profile-select").value;
    chrome.runtime.sendMessage({ action: "loadProfile", profileName: profile });
});
document.getElementById("cookies-button").addEventListener("click", () => {
    console.log("Cookies button clicked");
    chrome.runtime.sendMessage({ action: "getCookies" });
});
document.getElementById("new-button").addEventListener("click", () => {
    console.log("New button clicked");
    chrome.runtime.sendMessage({ action: "newProfile" }, (response) => {
        if (response.message === "Profile created successfully.") {
            loadProfiles();
        }
    });
});

document.getElementById("profile-select").addEventListener("change", () => {
    console.log("Profile selected");
    var profile = document.getElementById("profile-select").value;
    if (profile || profile.value === "") {
        document.getElementById("load-button").disabled = false;
        document.getElementById("delete-button").disabled = false;
    } else {
        document.getElementById("load-button").disabled = true;
        document.getElementById("delete-button").disabled = true;
    }
    chrome.runtime.sendMessage({ action: "getCookies"});
});
document.getElementById("delete-button").addEventListener("click", () => {
    console.log("Delete button clicked");
    var profile = document.getElementById("profile-select").value;
    chrome.runtime.sendMessage({ action: "deleteProfile", profileName: profile }, (response) => {
        if (response.message === "Profile deleted successfully.") {
            loadProfiles();
        }
    });
});

function loadProfiles() {
    chrome.storage.local.get("profiles", (data) => {
        var profiles = data.profiles;
        var select = document.getElementById("profile-select");
        select.innerHTML = '<option value="" class="option" disabled selected>Select a profile</option>';
        if (profiles) {
            console.log("loading profiles");
            for (var i = 0; i < profiles.length; i++) {
                var option = document.createElement("option");
                option.text = profiles[i];
                option.value = profiles[i];
                select.add(option);
            }
        } else {
            console.log("No profiles found.");
        }
    });
}
