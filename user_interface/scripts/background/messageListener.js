import { listReplayTools } from "./replayToolDetector.js";

export let extensionEnabled = true;
let scriptsContainingListeners = [];
let trackedUrls = [];
let interactionCounts = {
    mousemove: 0,
    click: 0,
    keypress: 0,
    scroll: 0,
    drag: 0,
    copy: 0,
    cut: 0,
    paste: 0
};
let eventsArray = [];

// Receive messages from extension popup and background scripts
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    const content = message["content"];

    switch (message["type"]) {
        case "setBadgeText":
            browser.browserAction.setBadgeText({ text: content });
            break;
        case "listenerIntercepted": //from eventDetection.js
            eventsArray = content;
            processInterceptedListeners(content)
            break;
        case "getUserInteractions":
            sendResponse(interactionCounts);
            break;
        case "getScriptsWithListeners":
            sendResponse(scriptsContainingListeners);
            break;
        case "getScripts":
            sendResponse(trackedUrls);
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
        case "getReplayScripts":
            sendResponse(listReplayTools(trackedUrls, eventsArray));
            break;
    }
}

export function addToTrackedUrls(url) { // gets called form interceptRequests
    if (!trackedUrls.includes(url)) {
        trackedUrls.push(url);
    }
}

function resetStats() {
    Object.keys(interactionCounts).forEach(key => {
        interactionCounts[key] = 0;
    });

    trackedUrls = [];

    // TODO reset UI screen
}

// Add each intercepted listener call to correct counters and lists
function processInterceptedListeners(eventsArray) {
    for (let event of eventsArray) {
        interactionCounts[event["type"]]++;
        if (!scriptsContainingListeners.includes(event["url"])) {
            scriptsContainingListeners.push(event["url"]);
        }
    }

}