const measurementTime = 60000 // a minute
const maxCountsPerMeasurementTime = 5;

let requestList = [];
let SRSSet = new Set();

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
        addToRequestList("fetch", url, typeof options !== 'undefined' ? options.method : null, initiatorScript);
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
            addToRequestList("XHR", this._url, this._method, this._initiatorScript);

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

function addToRequestList(type, url, method, initiatorScript) {
    const currentTime = new Date().getTime();

    if (!(method == "POST" || method == "GET" || method == "post" || method == "get")) { // Only consider get and post requests
        return;
    }

    request = {
        "type": type,
        "method": method,
        "url": url,
        "timestamp": currentTime,
        "initiatorScript": initiatorScript
    };

    updateRequestList(request, currentTime);
}

function updateRequestList(request, currentTime) {
    requestList.push(request); // Add new request to list
    requestList = requestList.filter(item => item.timestamp >= currentTime - measurementTime) // Remove old requests from list
    checkListForReplayScripts();
}

function checkListForReplayScripts() {
    // Counts occurrences of each initiatorScript in request list
    const scriptCounts = requestList.reduce((counts, item) => {
        counts[item.initiatorScript] = (counts[item.initiatorScript] || 0) + 1;
        return counts;
    }, {});

    // Check if script exceeds the maximum allowed counts
    for (const script in scriptCounts) {
        if (scriptCounts[script] > maxCountsPerMeasurementTime) {
            SRSSet.add(script); // Add to set (duplicates will be ignored)
            updateScripts();
        }
    }
}

function updateScripts() {
    // TODO send scripts to popup
}