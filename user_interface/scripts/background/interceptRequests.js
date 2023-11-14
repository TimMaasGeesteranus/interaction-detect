import { addToUrlList } from "./messageListener.js";
import { extensionEnabled } from "./messageListener.js";

// Important variables!
const measurementTime = 60000 // a minute
const maxCountsPerMeasurementTime = 5;

let requestList = [];

// Listen to requests after the page has been loaded
browser.webNavigation.onCompleted.addListener(() => {
    browser.webRequest.onBeforeRequest.addListener(manageRequestList, { urls: ["<all_urls>"] });
});

function manageRequestList(request) {
    if (!extensionEnabled) {
        return;
    }

    const url = getBaseUrl(request.url);

    // Determine if the request should be processed
    if (isFile(url) || isWebsocket(url) || !(request.method == "POST" || request.method == "GET")) {
        return;
    }
    const currentTime = new Date().getTime();

    requestList.push({ url: url, timestamp: currentTime }) // add new request to list
    requestList = requestList.filter(item => item.timestamp >= currentTime - measurementTime) // remove old requests from list

    checkListForReplayScripts();
}

// finds: Glassbox, RUM Datadog, Clarity
function checkListForReplayScripts() {
    // Counts occurrences of each URL in request list
    const urlCounts = requestList.reduce((counts, item) => {
        counts[item.url] = (counts[item.url] || 0) + 1;
        return counts;
    }, {});

    // Check if URL exceeds the maximum allowed counts
    for (const url in urlCounts) {
        if (urlCounts[url] > maxCountsPerMeasurementTime) {
            addToUrlList(url); // add url to session replay url list
        }
    }
}

function getBaseUrl(url) {
    const urlObject = new URL(url);
    return urlObject.protocol + '//' + urlObject.hostname + urlObject.pathname;
}

function isFile(url) {
    return /\.[0-9a-z]+$/i.test(url);
}

function isWebsocket(url) {
    return /^wss?:\/\/.*/i.test(url);
}