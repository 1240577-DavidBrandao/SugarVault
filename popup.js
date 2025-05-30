
document.addEventListener("DOMContentLoaded", startpoint);

document.getElementById("load-button").addEventListener("click", () => {
    var profile = document.getElementById("profile-select").value;
    chrome.runtime.sendMessage({ action: "loadProfile", profileName: profile });
});
document.getElementById("cookies-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getCookies" });
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
});
document.getElementById("change-profile-button").addEventListener("click", () => {
    var modal2 = document.getElementById("myModal2");
    modal2.style.display = "block";
    var current = document.getElementById("current");
    current.innerHTML = '';
    var selectedprofile = document.getElementById("profile-select").value;
    current.append("Current: ", selectedprofile);

});
document.getElementById("new-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "newProfile" }, (response) => {
        if (response.message === "Profile created successfully.") {
            loadProfiles();
        }
    });
});
document.getElementById("profile-select").addEventListener("change", () => {
    var profile = document.getElementById("profile-select").value;
    document.getElementById("load-button").disabled = false;
    document.getElementById("delete-button").disabled = ["default", "base"].includes(profile);
    document.getElementById("change-profile-button").disabled = ["default", "base"].includes(profile);
});

document.getElementById("delete-button").addEventListener("click", () => {
    var profile = document.getElementById("profile-select").value;
    chrome.runtime.sendMessage({ action: "deleteProfile", profileName: profile }, (response) => {
        if (response.message === "Profile deleted successfully.") {
            loadProfiles();
        }
    });
});

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "sendCookies":
            loadingTable(request.data);
            break;
        case "Profile deleted successfully.":
            loadProfiles();
            break;
        case "Profile created successfully.":
            loadProfiles();
            break;
        case "Profile changed successfully.":
            loadProfiles();
            break;
        case "error":
            console.error(request.message);
            break;
        default:
            loadProfiles();
            break
    }
});

function loadProfiles() {
    chrome.storage.local.get(["profiles", "activeProfile"], (data) => {
        const profiles = data.profiles || [];
        const activeProfile = data.activeProfile || "default";
        const select = document.getElementById("profile-select");

        select.innerHTML = '<option value="" disabled selected>Selecionar perfil</option>';
        profiles.forEach((profile) => {

            const option = document.createElement("option");
            option.text = profile;
            option.value = profile;
            if (profile === activeProfile) option.selected = true;
            if (profile != "default") {
                select.add(option);
            }
        });

        document.getElementById("load-button").disabled = select.value === "";
        document.getElementById("delete-button").disabled = ["default", "base"].includes(select.value);
    });
}



function loadingTable(cookies) {
    var table = document.getElementById("cookies-table");
    var modaltitle = document.getElementById("modal-title");
    modaltitle.innerHTML = `${cookies.length} - Cookies Available`;
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Domain</th>
                <th>Path</th>
                <th>Expiration Date</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    if (cookies.length == 0) {
        return;
    }
    if (cookies && cookies.length > 0) {

        table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Domain</th>
                        <th>Path</th>
                        <th>Expiration Date</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
        var tbody = table.querySelector("tbody");
        for (var i = 0; i < cookies.length; i++) {
            var row = `
            <tr> 
            <td title='${cookies[i].name}'>${cookies[i].name}</td> 
            <td title='${cookies[i].value}'>${cookies[i].value}</td> 
            <td title='${cookies[i].domain}'>${cookies[i].domain}</td> 
            <td title='${cookies[i].path}'>${cookies[i].path}</td> 
            <td title='${cookies[i].expirationDate ? new Date(cookies[i].expirationDate * 1000).toLocaleString() : 'Session'}'>${cookies[i].expirationDate ? new Date(cookies[i].expirationDate * 1000).toLocaleString() : 'Session'}</td>
             </tr>
        `;
            tbody.innerHTML += row;
        }
    } else {
        console.error("No cookies found or error obtaining cookies. Check permissions.");
    }

}

function startpoint() {
    loadProfiles();
    addEventListeners();
}

function addEventListeners() {
    modal1();
    modal2();
    modalmessage1();
    modalmessage2();
}
function modal1() {
    document.getElementById("close").addEventListener("click", () => {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    });
}
function modal2() {
    document.getElementById("close2").addEventListener("click", () => {
        var modal = document.getElementById("myModal2");
        modal.style.display = "none";
    });
    document.getElementById("cancel-button").addEventListener("click", () => {
        var modal = document.getElementById("myModal2");
        modal.style.display = "none";
    });
    document.getElementById("save-button").addEventListener("click", () => {
        var profile = document.getElementById("profile-select").value;
        var newProfileName = document.getElementById("profile-name").value;
        chrome.runtime.sendMessage(
            { action: "Change Profile Name", profileSelected: profile, profileName: newProfileName },
            (response) => {
                if (response.message === "Profile changed successfully.") {
                    loadProfiles();
                } else {
                    console.error(response.message);
                }
            }
        );
        var modal2 = document.getElementById("myModal2");
        modal2.style.display = "none";
        loadProfiles();
    });
    document.getElementById("myModal2").addEventListener("change", loadProfiles);
}

function modalmessage1() {
    document.getElementById("close3").addEventListener("click", () => {
        var modal = document.getElementById("modalMessage1");
        modal.style.display = "none";
    });
    document.getElementById("no-button").addEventListener("click", () => {
        var modal = document.getElementById("modalMessage1");
        modal.style.display = "none";
    });
    document.getElementById("yes-button").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "clearEverything" });
        var modal = document.getElementById("modalMessage1");
        modal.style.display = "none";
        location.reload();
    });
}

function modalmessage2() {
    document.getElementById("close4").addEventListener("click", () => {
        var modal = document.getElementById("modalMessage2");
        modal.style.display = "none";
    });
    document.getElementById("no-button2").addEventListener("click", () => {
        var modal = document.getElementById("modalMessage2");
        modal.style.display = "none";
    });
    document.getElementById("yes-button2").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "clearCookies", profileName: document.getElementById("profile-select").value });
        var modal = document.getElementById("modalMessage2");
        modal.style.display = "none";
    });
}
//buttons added in 20/01

document.getElementById("clear-button").addEventListener("click", () => {
    var modalMessage = document.getElementById("modalMessage1");
    modalMessage.style.display = "block";
});

document.getElementById("reset-button").addEventListener("click", () => {
    var modalMessage = document.getElementById("modalMessage2");
    modalMessage.style.display = "block";
});