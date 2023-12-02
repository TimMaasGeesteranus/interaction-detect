const toggle = document.getElementById("toggle");

chrome.runtime.sendMessage({ type: "getExtensionEnabled" }, (response) => {
    toggle.checked = response;
})

toggle.addEventListener('input', (event) => {
    if (toggle.checked) {
        chrome.runtime.sendMessage({ type: "enableExtension" });
    }
    else {
        chrome.runtime.sendMessage({ type: "disableExtension" });
    }

})