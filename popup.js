console.log("popup.js is running");

document.addEventListener("DOMContentLoaded",(startpoint) );


document.getElementById("load-button").addEventListener("click", () => {
    console.log("Load button clicked");
    var profile = document.getElementById("profile-select").value;
    chrome.runtime.sendMessage({ action: "loadProfile", profileName: profile });
});
document.getElementById("cookies-button").addEventListener("click", () => {
    console.log("Cookies button clicked");
    chrome.runtime.sendMessage({ action: "getCookies" });
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

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
    var profile = document.getElementById("profile-select").value;
    document.getElementById("load-button").disabled = false;
    document.getElementById("delete-button").disabled = ["default", "base"].includes(profile);
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
        case "error":
            console.error(request.message);
            break;
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
            select.add(option);
        });

        document.getElementById("load-button").disabled = select.value === "";
        document.getElementById("delete-button").disabled = ["default", "base"].includes(select.value);
    });
}



function loadingTable(cookies) {
    console.log("got Cookies", cookies);
    var modaltitle= document.getElementById("modal-title");
    modaltitle.innerHTML = `${cookies.length} - Cookies Available`;
    if (cookies && cookies.length > 0) {
        var table = document.getElementById("cookies-table");
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

function startpoint(){
    loadProfiles();
    document.getElementById("close").addEventListener("click", () => {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    });
}