const scriptUrls = [
    'user_interface/scripts/page/events.js',
    'user_interface/scripts/page/requests.js'
]

chrome.runtime.sendMessage({ type: "getTurnedOffDomains" }, (domains) => { // Get current page url
    if (!domains.includes(window.location.origin)) { // Check if page is not disabled
        scriptUrls.forEach(injectScript); // Inject scripts into page
    }
});

function injectScript(item) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(item);
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

// Help messages to go from page to background script
window.addEventListener('message', (message) => {
    if (["addInterceptedListeners", "updateSRS_size", "updateSRS_time"].includes(message.data.type)) {
        sendMessageToBackgroundScript(message.data)
    }
    if (message.data.type == "slowPageAlert") {
        askForTurnOff(message.data);
    }
})

function askForTurnOff(data) { // Show confirm popup
    if (confirm("Interact-Detector Extension is slowing down this page. Do you want to disable this extension on the current page? This includes a page reload.")) {
        sendMessageToBackgroundScript(data);
        window.location.reload();
    }
}

function sendMessageToBackgroundScript(data) {
    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage(data);
    }
}