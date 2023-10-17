let timer;

document.addEventListener('keypresss', (event) => {
    if (event.target.localName == "input") {
        browser.runtime.sendMessage({ type: "input", content: event.key });
    }
});

document.addEventListener('mousemove', (event) => {
    browser.runtime.sendMessage({ type: "input", content: "yes" });
    clearTimeout(timer);
    timer = setTimeout(handleMouseStoppedMoving, 100);
});

function handleMouseStoppedMoving() {
    browser.runtime.sendMessage({ type: "input", content: "no" })
}