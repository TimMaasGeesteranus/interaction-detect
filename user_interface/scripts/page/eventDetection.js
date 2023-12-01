const MAX_INTERCEPTION_COUNT = 200;
let interceptedEvents = [];
let interceptionTimer;

interceptEventListener();

function interceptEventListener() {
    // original listener that we intercepted
    const origFunc = EventTarget.prototype["addEventListener"];
    let eventCounts = {};

    // Override the addEventListener method
    Object.defineProperty(EventTarget.prototype, "addEventListener", {
        value: function (type, fn, ...rest) {
            origFunc.call(this, type, function (...args) {
                // Get caller script
                const originatingScript = getOriginatingScriptUrl();

                // Count the amount of interceptions
                eventCounts[originatingScript] = eventCounts[originatingScript] || {};
                eventCounts[originatingScript][type] = (eventCounts[originatingScript][type] || 0) + 1;
                const callCnt = eventCounts[originatingScript][type];

                if (callCnt > MAX_INTERCEPTION_COUNT) {
                    // Restore original function when maximum number of interceptions has been reached
                    Object.defineProperty(EventTarget.prototype, "addEventListener", {
                        value: function () {
                            return fn.apply(this, args);
                        }
                    });
                    return fn.apply(this, args);
                }

                registerInterception({ type: type, url: originatingScript });

                // Execute original code
                return fn.apply(this, args);
            }, ...rest);
        }
    });
}

function sendMessageToContentScript(type, message) {
    document.dispatchEvent(
        new CustomEvent(type, { detail: message })
    )
}

function getOriginatingScriptUrl() {
    const stackTrace = new Error().stack;
    if (stackTrace) {
        const lines = stackTrace.split('\n');
        // Go through stacktrace to find script
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Check if the line contains a script URL
            const match = line.match(/(http.*.js):\d+:\d+/)
            //const match = line.match(/C.*.js:\d+:\d+/) // For testing locally
            if (match) {
                url = getBaseUrl(match[0]);
                return url
            }
        }
    }
}

function registerInterception(call) {
    interceptedEvents.push(call);

    // Clear the previous logging interval
    clearTimeout(interceptionTimer);

    // Send the intercepted calls after 1sec of inactivity
    interceptionTimer = setTimeout(() => {
        sendMessageToContentScript("listenerIntercepted", interceptedEvents);
        interceptedEvents = [];
    }, 1000);
}

function getBaseUrl(url) {
    const urlObject = new URL(url);
    return urlObject.protocol + '//' + urlObject.hostname;
}