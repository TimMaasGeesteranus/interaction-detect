const MAX_NUM_CALLS_TO_INTERCEPT = 2;

interceptListeners();

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
                if (callCnt >= MAX_NUM_CALLS_TO_INTERCEPT) {
                    console.log(`max reached for type ${type}`);
                    Object.defineProperty(elementType.prototype, funcName, {
                        value: function () {
                            return fn.apply(this, args);
                        }
                    });
                    return fn.apply(this, args);;
                }

                // Put own logic here
                console.log(`addEventListener of type ${type} was fired`);
                // And execute original code
                return fn.apply(this, args);
            }, ...rest);
        }
    });
}


