const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

// Load home page
chrome.runtime.sendMessage({ type: "getSRSlist" }, (response) => {
    content.innerHTML = getSRSlistContent(response);
})

function getSRSlistContent(SRSitems) {
    let htmlOutput = '<div class="SRSlist"><ul>';

    SRSitems.forEach(item => {
        htmlOutput += `<li>
        <div class="SRSlistTitle">${item.script}</div>
        <div class="SRSlistText">
        <span class="material-icons">format_list_numbered</span>${item.total}
        <span class="material-icons">ads_click</span>${item.click}
        ?${item.pointerdown}
        <span class="material-icons">mouse</span>${item.mouseover}
        <span class="material-icons">mouse</span>${item.mouseout}
        <span class="material-icons">mouse</span>${item.mousedown} <br/>
        <span class="material-icons">mouse</span>${item.mouseup}
        ?${item.scroll}
        ?${item.wheel}
        <span class="material-icons">keyboard</span>${item.keydown}
        <span class="material-icons">keyboard</span>${item.keyup}
        <span class="material-icons">keyboard</span>${item.keypress}
        ?${item.input}
        </div>
        </li><br/>`

    });

    htmlOutput += '</ul></div>'
    return htmlOutput;
}