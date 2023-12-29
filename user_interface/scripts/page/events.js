const typesToInclude = ["select", "change", "touchstart", "touchend", "touchmove", "touchcancel", "click", "pointerdown", "mousemove", "mouseover", "mouseout", "mousedown", "mouseup", "scroll", "wheel", "keydown", "keyup", "keypress", "input"];
let scriptsWithListeners = [];
let interceptionTimer;

interceptEventListener();

function interceptEventListener() {
    // original listener that we intercepted
    const origFunc = EventTarget.prototype["addEventListener"];

    // Override the addEventListener method
    Object.defineProperty(EventTarget.prototype, "addEventListener", {
        value: function (type, fn, ...rest) {

            const initiatorScript = getInitiatorScript(); // Get script that evenListener is located in

            origFunc.call(this, type, function (...args) { // Add our logic to original function
                if (typesToInclude.includes(type)) {
                    if (initiatorScript != undefined) {
                        addToScriptsWithListeners(initiatorScript, type);
                    }
                }

                if (fn != undefined) {
                    return fn.apply(this, args); // Execute original function
                }
            }, ...rest);
        }
    });
}

function addToScriptsWithListeners(script, type) {
    // Check if script already is in array
    let scriptIndex = scriptsWithListeners.findIndex(obj => obj.script === script);

    if (scriptIndex !== -1) {
        scriptsWithListeners[scriptIndex]["total"]++ // Increment total counter
        scriptsWithListeners[scriptIndex][type]++ // Increment type counter
    }
    else {
        let newScript = {
            "script": script,
            "pageurl": window.location.host,
            "total": 0,
            "click": 0,
            "pointerdown": 0,
            "mousemove": 0,
            "mouseover": 0,
            "mouseout": 0,
            "mousedown": 0,
            "mouseup": 0,
            "scroll": 0,
            "wheel": 0,
            "keydown": 0,
            "keyup": 0,
            "keypress": 0,
            "input": 0,
            "touchstart": 0,
            "touchend": 0,
            "touchmove": 0,
            "touchcancel": 0,
            "change": 0,
            "select": 0
        }
        newScript[type]++; // Increment total counter
        newScript["total"]++; // Increment type counter
        scriptsWithListeners.push(newScript); // Add to array
    }
    registerInterception();
}

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
                return match[0]
            }
        }
    }
}

function registerInterception() {
    // Clear the previous logging interval
    clearTimeout(interceptionTimer);

    // Send the intercepted calls after 1sec of inactivity
    interceptionTimer = setTimeout(() => {
        sendToContentScript("addInterceptedListeners", scriptsWithListeners);
        scriptsWithListeners = []; // Empty array
    }, 300);
}

function sendToContentScript(type, data) {
    window.postMessage({ type, data: data });
};