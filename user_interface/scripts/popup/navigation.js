const homeButton = document.getElementById('homeButton');
const listButton = document.getElementById('listButton');
const content = document.getElementById('content');

// Load home page
chrome.runtime.sendMessage({ type: "getSRSlist" }, (response) => {
    if (response.length == 0) {
        content.innerHTML = "<p>Nothing found yet...</p>";
    }
    else {
        content.innerHTML = getSRSlistContent(response);
    }
})

function getSRSlistContent(SRSitems) {
    let htmlOutput = '<div class="SRSlist"><ul>';

    SRSitems.forEach(item => {
        if (item.total > 2000) item.total = "2000+"
        if (item.mousemove > 2000) item.mousemove = "2000+"

        htmlOutput += `<li>
        <div class="SRSlistTitle">${item.script}</div>
        <div class="SRSlistText">
            <div title="total">
                <span class="material-icons">format_list_numbered</span>${item.total}
            </div>
            <div title="mousemove: ${item.mousemove}">
                <span class="material-symbols-outlined">touchpad_mouse</span>${item.mousemove}
            </div>
            <div title="mouseover: ${item.mouseover} mouseout: ${item.mouseout} mousedown: ${item.mousedown} mouseup: ${item.mouseup}">
                <span class="material-icons">mouse</span>${item.mouseover + item.mouseout + item.mousedown + item.mouseup}
            </div>
            <div title="click: ${item.click} pointerdown: ${item.pointerdown}">
                <span class="material-icons">ads_click</span>${item.click + item.pointerdown}
            </div>
            <br/>
            <div title="scroll: ${item.scroll} wheel: ${item.wheel}">
                <span class="material-icons">height</span>${item.scroll + item.wheel}
            </div>
            <div title="touchstart: ${item.touchstart} touchend: ${item.touchend} touchmove: ${item.touchmove} touchcancel: ${item.touchcancel}">
                <span class="material-icons">touch_app</span>${item.touchstart + item.touchend + item.touchmove + item.touchcancel}
            </div>
            <div title="keypress: ${item.keypress} keyup: ${item.keyup} keydown: ${item.keyup}">
                <span class="material-icons">keyboard</span>${item.keypress + item.keyup + item.keydown}
            </div>
            <div title="input: ${item.input} change: ${item.change}">
                <span class="material-icons">edit_square</span>${item.input + item.change}
            </div>
            <div title="select">
                <span class="material-symbols-outlined">gesture_select</span>${item.select}
            </div>
        </div>
        </li><br/>`
    });

    htmlOutput += '</ul></div>'
    return htmlOutput;
}