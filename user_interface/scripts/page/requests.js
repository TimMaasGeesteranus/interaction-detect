const MEASUREMENT_TIME = 60000 // a minute
const MAX_COUNTS_PER_MEASUREMENT_TIME = 5;
const MIN_URL_SIZE = 50;
const MIN_BODY_SIZE = 10000;

let requestList = [];
let SRSSet_time = new Set();
let SRSSet_size = new Set();

window.addEventListener('load', () => { // Wait for all resources to be loaded
    interceptRequests();
})

function interceptRequests() {
    let XHR = XMLHttpRequest.prototype;
    let open = XHR.open;
    let send = XHR.send;
    let originalFetch = window.fetch;

    window.fetch = function (url, options) {
        let initiatorScript = getInitiatorScript();

        let method = null;
        let body = null;
        if (typeof options != 'undefined') {
            method = options.method;
            body = options.body;
        }
        addToRequestList("fetch", url, method, body, initiatorScript);
        return originalFetch.apply(this, arguments);
    }

    XHR.open = function (method, url) { // This function initializes the request
        this._method = method;
        this._url = url;
        this._initiatorScript = getInitiatorScript();

        return open.apply(this, arguments);
    };

    XHR.send = function (postData) { // This function sends the HTTP request
        this.addEventListener('load', function () {
            addToRequestList("XHR", this._url, this._method, postData, this._initiatorScript);

        });
        return send.apply(this, arguments);
    };

    function getInitiatorScript() {
        const stackTrace = new Error().stack;
        if (stackTrace) {
            const lines = stackTrace.split('\n');

            // Go through stacktrace to find script
            for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i];

                // Check if the line contains a script URL
                const match = line.match(/(http.*.js)/)
                if (match) {
                    return match[0];
                }
            }
        }
    }
};

function addToRequestList(type, url, method, body, initiatorScript) {
    const currentTime = new Date().getTime();

    if (!(method == "POST" || method == "GET" || method == "post" || method == "get")) { // Only consider get and post requests
        return;
    }

    request = {
        "type": type,
        "method": method,
        "body": body,
        "url": url,
        "timestamp": currentTime,
        "initiatorScript": initiatorScript
    };

    updateSRS_time(request, currentTime);
    updateSRS_size(request);
}

function updateSRS_time(request, currentTime) {
    requestList.push(request); // Add new request to list
    requestList = requestList.filter(item => item.timestamp >= currentTime - MEASUREMENT_TIME) // Remove old requests from list
    checkIfScriptExceedsTime();
}

function checkIfScriptExceedsTime() {
    // Counts occurrences of each initiatorScript in request list
    const scriptCounts = requestList.reduce((counts, item) => {
        counts[item.initiatorScript] = (counts[item.initiatorScript] || 0) + 1;
        return counts;
    }, {});

    // Check if script exceeds the maximum allowed counts
    for (const script in scriptCounts) {
        if (scriptCounts[script] > MAX_COUNTS_PER_MEASUREMENT_TIME) {
            SRSSet_time.add(script); // Add to set (duplicates will be ignored)
            sendMessageToContentScript("updateSRS_time", SRSSet_time);
        }
    }
}

function updateSRS_size(request) {
    if (request.body) {
        if (request.body.length > MIN_BODY_SIZE) {
            SRSSet_size.add(request);
            sendMessageToContentScript("updateSRS_size", SRSSet_time);
        }

        try {
            let url = new URL(request.url);
            if ((url.search + url.hash).length > MIN_URL_SIZE) {
                SRSSet_size.add(request);
                sendMessageToContentScript("updateSRS_size", SRSSet_time);
            }
        } catch { }
    }
}

function sendMessageToContentScript(type, data) {
    window.postMessage({ type, data: data });
};