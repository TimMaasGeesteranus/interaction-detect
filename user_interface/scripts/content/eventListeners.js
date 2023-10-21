document.addEventListener('keypress', (event) => {
    browser.runtime.sendMessage({
        type: "setBadgeText",
        content: event.key
    });
});

document.addEventListener("listenerIntercepted", (event) => {
    if (event.detail == "click") {
        notifyUser();
    }
    browser.runtime.sendMessage({
        type: "listenerIntercepted",
        content: event.detail
    })
});

function notifyUser() {
    const originalBackgroundColor = document.body.style.backgroundColor;

    document.body.style.backgroundColor = '#354172';

    setTimeout(() => {
        document.body.style.backgroundColor = originalBackgroundColor; // Change it back to the original color (e.g., white)
    }, 100);
}