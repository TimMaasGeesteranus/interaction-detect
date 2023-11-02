document.addEventListener('keypress', (event) => {
    browser.runtime.sendMessage({
        type: "setBadgeText",
        content: event.key
    });
});

document.addEventListener("listenerIntercepted", (event) => {
    switch (event.detail) {
        case "click":
            flickerBackground();
            break;
        case "mousemove":
            changeMouseCursor();
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

function flickerBackground() {
    const originalBackgroundColor = document.body.style.backgroundColor;

    document.body.style.backgroundColor = '#354172';

    setTimeout(() => {
        document.body.style.backgroundColor = originalBackgroundColor; // Change it back to the original color (e.g., white)
    }, 100);
}

function changeMouseCursor() {
    let scriptPath = chrome.runtime.getURL("img/exclamationMark.cur");
    document.body.style.cursor = `url('${scriptPath}'), auto`;
}

function markInputField(id){
    const inputField = document.getElementById(id)
    inputField.style.backgroundColor = "#fb2737";
}

