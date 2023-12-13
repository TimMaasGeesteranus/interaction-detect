const scriptUrls = [
    'user_interface/scripts/page/events.js',
    'user_interface/scripts/page/requests.js'
]

scriptUrls.forEach(injectScript);

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
        if (chrome.runtime?.id) {
            chrome.runtime.sendMessage(message.data);
        }
    }
})