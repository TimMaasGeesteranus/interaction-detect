// Important variables!
const measurementTime = 60000 // a minute
const maxCountsPerMeasurementTime = 5;

let requests = [];

browser.webRequest.onBeforeRequest.addListener(manageRequestList, { urls: ["<all_urls>"] });

function manageRequestList(request) {
    const url = getBaseUrl(request.url);
    if (isFile(url) || isWebsocket(url) || request.method != "POST") { // filter out all 
        return;
    }
    const currentTime = new Date().getTime();

    requests.push({ url: url, timestamp: currentTime }) // add new request
    requests = requests.filter(item => item.timestamp >= currentTime - measurementTime) // remove old requests

    checkIfReplayScript();
}

// finds: Glassbox, RUM Datadog, Clarity
function checkIfReplayScript() {
    const urlCounts = requests.reduce((counts, item) => {
        counts[item.url] = (counts[item.url] || 0) + 1;
        return counts;
    }, {});

    for (const url in urlCounts) {
        if (urlCounts[url] > maxCountsPerMeasurementTime) {
            console.log(`${url} might be a session replay script!`); // The important stuff!
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

function isWebsocket(url){
    return /^wss?:\/\/.*/i.test(url);
}
