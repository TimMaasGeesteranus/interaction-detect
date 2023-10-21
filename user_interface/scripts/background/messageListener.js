browser.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(message, sender, sendResponse) {
    console.log("message received");

    const content = message["content"];

    switch (message["type"]) {
        case "setBadgeText":
            browser.browserAction.setBadgeText({ text: content });
            break;
        case "listenerIntercepted":
            browser.browserAction.setBadgeText({ text: content });
            break;
    }
}
