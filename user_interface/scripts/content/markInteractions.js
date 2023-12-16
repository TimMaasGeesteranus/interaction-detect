chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "SRSFound") {
            markInteractions(request.data);
        }
    }
);

function markInteractions(scripts) {
    // do something with scripts
}
