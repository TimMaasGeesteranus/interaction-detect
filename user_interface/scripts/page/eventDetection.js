const MAX_NUM_CALLS_TO_INTERCEPT = 200;

// original listener that we intercepted
const origFunc = EventTarget.prototype["addEventListener"];
let accessCounts = {};

// Override the addEventListener method
Object.defineProperty(EventTarget.prototype, "addEventListener", {
    value: function (type, fn, ...rest) {
        origFunc.call(this, type, function (...args) {

            // Get caller script
            const originatingScript = getOriginatingScriptUrl();

            // Count the amount of interceptions
            accessCounts[originatingScript] = accessCounts[originatingScript] || {};
            accessCounts[originatingScript][type] = (accessCounts[originatingScript][type] || 0) + 1;
            const callCnt = accessCounts[originatingScript][type];
            
            if (callCnt > MAX_NUM_CALLS_TO_INTERCEPT) {
                // Restore original function when maximum number of interceptions has been reached
                Object.defineProperty(EventTarget.prototype, "addEventListener", {
                    value: function () {
                        return fn.apply(this, args);
                    }
                });
                return fn.apply(this, args);
            }

            // Send message that listener was intercepted
            sendMessageToContentScript("listenerIntercepted", { type: type, url: originatingScript });

            // Execute original code
            return fn.apply(this, args);
        }, ...rest);
    }
});

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
            const match = line.match(/http.*.js:\d+:\d+/)
            //const match = line.match(/C.*.js:\d+:\d+/) // For testing locally
            if (match) {
                return match[0];
            }
        }
    }
}