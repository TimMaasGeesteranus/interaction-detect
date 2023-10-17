browser.runtime.onMessage.addListener(receiveMessage);

let totalCount = 0;
let trackerCount = 0;
let fsCount = 0;

function receiveMessage(message, sender, sendResponse) {
    switch (message["type"]) {
        case "input":
            browser.browserAction.setBadgeText({ text: message["content"] });
            break;
        case "getCounters":
            sendResponse({"total": totalCount, "tracker": trackerCount, "fs": fsCount});
            break;
    }
}

window.incrementTotalCount = function (){
    totalCount++;
}

window.incrementTrackerCount = function (){
    trackerCount++;
}

window.incrementFsCount = function (){
    fsCount++;
}
