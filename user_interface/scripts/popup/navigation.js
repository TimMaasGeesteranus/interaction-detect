
const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

// Load home page
browser.runtime.sendMessage({ type: "getCounters" }, (response) => {
    content.innerHTML = getContent(response);
})

// List page
listButton.addEventListener('click', () => {
    content.textContent = "To be implemented";
});

// Home page
homeButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ type: "getCounters" }, (response) => {
        content.innerHTML = getContent(response);
    })
});

function getContent(counters){
    return `<div>Third parties: ${counters["total"]}
    <br>Trackers: ${counters["tracker"]}
    <br>FullStory: ${counters["fs"]}</div>`;
}