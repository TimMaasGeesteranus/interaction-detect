document.addEventListener('mousemove', (event) => {
    browser.runtime.sendMessage({
        type: "setBadgeText",
        content: "M"
    });
});

document.addEventListener("listenerIntercepted", (event) => {
    browser.runtime.sendMessage({
        type: "listenerIntercepted",
        content: event.detail
    })
});