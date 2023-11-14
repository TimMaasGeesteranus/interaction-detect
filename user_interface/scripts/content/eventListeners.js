let mousemoveDetected = false;

// Example usage of setBadgeText
document.addEventListener('keypress', (event) => {
    browser.runtime.sendMessage({
        type: "setBadgeText",
        content: event.key
    });
});

// Listen for custom "listenerIntercepted" events
document.addEventListener("listenerIntercepted", (event) => {
    switch (event.detail.type) {
        case "click":
            setCursorWarning();
            break;
        case "mousemove":
            mousemoveDetected = true;
            setCursorRed();
            break;
        case "input":
            markInputField(event.explicitOriginalTarget.id);
            break;
    }

    browser.runtime.sendMessage({
        type: "listenerIntercepted",
        content: event.detail
    })
});

function setCursorRed() {
    let scriptPath = chrome.runtime.getURL("img/red.cur");
    document.body.style.cursor = `url('${scriptPath}'), auto`;
}

function setCursorWarning() {
    let scriptPath = chrome.runtime.getURL("img/warning.cur");
    document.body.style.cursor = `url('${scriptPath}'), auto`;

    // reset cursor
    setTimeout(() => {
        mousemoveDetected ? setCursorRed() : document.body.style.cursor = "default";
    }, 1000)
}

function markInputField(id) {
    const inputField = document.getElementById(id)
    inputField.style.backgroundColor = "#fb2737";
}