
const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

// Load home page
browser.runtime.sendMessage({ type: "getUserInteractions" }, (response) => {
    content.innerHTML = getListenerContent(response);
})

// List page
listButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ type: "getScripts" }, (response) => {
        content.innerHTML = getScriptsContent(response);
    })
});

// Home page
homeButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ type: "getUserInteractions" }, (response) => {
        content.innerHTML = getListenerContent(response);
    })
});

function getListenerContent(interaction) {
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

function getScriptsContent(scripts) {
    let html = '<div><ul>';

    for (let i = 0; i < scripts.length; i++) {
        html += `<li>${scripts[i]}</li>`;
    }

    html += '</ul></div>';

    return html;
}