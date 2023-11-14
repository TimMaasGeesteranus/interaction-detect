export let extensionEnabled = true;
let scriptsWithListeners = [];
let urlList = []
let userInteractions = {
    mousemove: 0,
    click: 0,
    keypress: 0,
    scroll: 0,
    drag: 0,
    copy: 0,
    cut: 0,
    paste: 0
};

// Receive messages from extension popup and background scripts
browser.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(message, sender, sendResponse) {
    const content = message["content"];

    switch (message["type"]) {
        case "setBadgeText":
            browser.browserAction.setBadgeText({ text: content });
            break;
        case "listenerIntercepted":
            userInteractions[content["type"]]++;
            if (!scriptsWithListeners.includes(content["url"])) {
                scriptsWithListeners.push(content["url"]);
            }
            break;
        case "getUserInteractions":
            sendResponse(userInteractions);
            break;
        case "getScriptsWithListeners":
            sendResponse(scriptsWithListeners);
            break;
        case "getScripts":
            sendResponse(urlList);
            break;
        case "enableExtension":
            extensionEnabled = true;
            break;
        case "disableExtension":
            extensionEnabled = false;
            resetStats();
            break;
        case "getExtensionEnabled":
            sendResponse(extensionEnabled);
            break;
    }
}

export function addToUrlList(url) {
    if (!urlList.includes(url)) {
        urlList.push(url);
    }
}

function resetStats() {
    Object.keys(userInteractions).forEach(key => {
        userInteractions[key] = 0;
    });

    urlList = [];

    // TODO reset UI screen
}