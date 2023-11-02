const toggle = document.getElementById("toggle");

browser.runtime.sendMessage({ type: "getExtensionEnabled" }, (response) => {
    toggle.checked = response;
})

toggle.addEventListener('input', (event) => {
    if (toggle.checked) {
        browser.runtime.sendMessage({ type: "enableExtension" });
    }
    else {
        browser.runtime.sendMessage({ type: "disableExtension" });
    }

})