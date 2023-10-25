browser.runtime.onMessage.addListener(receiveMessage);

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

let urlList = []

function receiveMessage(message, sender, sendResponse) {
    const content = message["content"];

    switch (message["type"]) {
        case "setBadgeText":
            browser.browserAction.setBadgeText({ text: content });
            break;
        case "listenerIntercepted":
            userInteractions[content]++;
            break;
        case "getUserInteractions":
            sendResponse(userInteractions);
            break;
        case "getScripts":
            sendResponse(urlList);
            break;
    }
}

export function addToUrlList(url) {
    if (!urlList.includes(url)) {
        urlList.push(url);
    }
}
