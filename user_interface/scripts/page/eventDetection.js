const MAX_NUM_CALLS_TO_INTERCEPT = 200;

interceptListeners();

function interceptListeners() {
    const origFunc = EventTarget.prototype["addEventListener"];
    let accessCounts = {};

    Object.defineProperty(EventTarget.prototype, "addEventListener", {
        value: function (type, fn, ...rest) {
            origFunc.call(this, type, function (...args) {

                // See if was intercepted already

                accessCounts[type] = (accessCounts[type] || 0) + 1;
                const callCnt = accessCounts[type];  // just a shorthand
                if (callCnt > MAX_NUM_CALLS_TO_INTERCEPT) {
                    Object.defineProperty(EventTarget.prototype, "addEventListener", {
                        value: function () {
                            return fn.apply(this, args);
                        }
                    });
                    return fn.apply(this, args);;
                }

                // get caller script
                const originatingScript = getOriginatingScriptUrl();

                // Send message that listener was intercepted
                sendMessageToContentScript("listenerIntercepted", {type: type, url: originatingScript});

                // And execute original code
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
            const match = line.match(/http.*.js:\d+:\d+/)
            if (match) {
                return match[0];
            }
        }
    }
}


