const MAX_NUM_CALLS_TO_INTERCEPT = 200;

console.log(interceptListeners());

function interceptListeners() {
    const elementType = EventTarget;
    const funcName = "addEventListener";
    const origFunc = elementType.prototype[funcName];

    let accessCounts = {};

    Object.defineProperty(elementType.prototype, funcName, {
        value: function (type, fn, ...rest) {
            origFunc.call(this, type, function (...args) {

                // See if was intercepted already

                accessCounts[type] = (accessCounts[type] || 0) + 1;
                const callCnt = accessCounts[type];  // just a shorthand
                if (callCnt > MAX_NUM_CALLS_TO_INTERCEPT) {
                    Object.defineProperty(elementType.prototype, funcName, {
                        value: function () {
                            return fn.apply(this, args);
                        }
                    });
                    return fn.apply(this, args);;
                }

                // Send message that listener was intercepted
                sendMessageToContentScript(type);               

                // And execute original code
                return fn.apply(this, args);
            }, ...rest);
        }
    });
}

function sendMessageToContentScript(message){
    document.dispatchEvent(
        new CustomEvent("listenerIntercepted", {detail: message})
    )
}


