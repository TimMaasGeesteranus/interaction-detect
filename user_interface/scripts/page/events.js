const MAX_INTERCEPTION_COUNT = 200;
const typesToInclude = ["click", "pointerdown", "mousemove", "mouseover", "mouseout", "mousedown", "mouseup", "scroll", "wheel", "keydown", "keyup", "keypress", "input"];
let scriptsWithListeners = [];
let interceptionTimer;

interceptEventListener();

function interceptEventListener() {
    // original listener that we intercepted
    const origFunc = EventTarget.prototype["addEventListener"];

    // Override the addEventListener method
    Object.defineProperty(EventTarget.prototype, "addEventListener", {
        value: function (type, fn, ...rest) {

            if (typesToInclude.includes(type)) {
                const initiatorScript = getInitiatorScript(); // Get script that evenListener is located in
                if (initiatorScript != undefined) {
                    addToScriptsWithListeners(initiatorScript, type);
                }
            }

            origFunc.call(this, type, function (...args) {
                if (fn != undefined) {
                    return fn.apply(this, args);
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
        sendMessageToContentScript("addInterceptedListeners", scriptsWithListeners);
        scriptsWithListeners = []; // Empty array
    }, 1000);
}

function sendMessageToContentScript(type, data) {
    window.postMessage({ type, data: data });
};