
const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

// Load home page
browser.runtime.sendMessage({ type: "getUserInteractions" }, (response) => {
    content.innerHTML = getContent(response);
})

// List page
listButton.addEventListener('click', () => {
    content.textContent = "To be implemented";
});

// Home page
homeButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ type: "getUserInteractions" }, (response) => {
        content.innerHTML = getContent(response);
    })
});

function getContent(interaction){
    return `<div>
    mousemove: ${interaction["mousemove"]}
    <br>click: ${interaction["click"]}
    <br>keypress: ${interaction["keypress"]}
    <br>scroll: ${interaction["scroll"]}
    <br>drag: ${interaction["drag"]}
    <br>copy: ${interaction["copy"]}
    <br>cut: ${interaction["cut"]}
    <br>paste: ${interaction["paste"]}
    </div>`;
}