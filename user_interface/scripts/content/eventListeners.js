document.addEventListener('keypress', (event) => {
    browser.runtime.sendMessage({
        type: "setBadgeText",
        content: event.key
    });
});

document.addEventListener("listenerIntercepted", (event) => {
    browser.runtime.sendMessage({
        type: "listenerIntercepted",
        content: event.detail
    })
});