let SRSwithListeners = [];
let SRSbySize = [];
let SRSbyTime = [];

let foundSRSs = [];

// Receive messages from extension popup and content scripts
chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    const data = message.data;

    switch (message["type"]) {
        // From page scripts
        case "addInterceptedListeners":
            addToSRSwithListeners(data);
            findMatches();
            break;
        case "updateSRS_size":
            SRSbySize = data;
            findMatches();
            break;
        case "updateSRS_time":
            SRSbyTime = data;
            findMatches();
            break;

        // From popup scripts
        case "getSRSlist":
            sendResponse(foundSRSs);
            chrome.action.setBadgeText({ text: null });
            break;
    }
}

function addToSRSwithListeners(data) {
    data.forEach(newObj => {
        // Check if script already is in array
        let index = SRSwithListeners.findIndex(obj => obj.script === newObj.script);

        if (index !== -1) { // update existing script
            SRSwithListeners[index].click += newObj.click;
            SRSwithListeners[index].input += newObj.input;
            SRSwithListeners[index].keydown += newObj.keydown;
            SRSwithListeners[index].keypress += newObj.keypress;
            SRSwithListeners[index].keyup += newObj.keyup;
            SRSwithListeners[index].mousedown += newObj.mousedown;
            SRSwithListeners[index].mousemove += newObj.mousemove;
            SRSwithListeners[index].mouseout += newObj.mouseout;
            SRSwithListeners[index].mouseover += newObj.mouseover;
            SRSwithListeners[index].mouseup += newObj.mouseup;
            SRSwithListeners[index].pointerdown += newObj.pointerdown;
            SRSwithListeners[index].scroll += newObj.scroll;
            SRSwithListeners[index].total += newObj.total;
            SRSwithListeners[index].wheel += newObj.wheel;
            SRSwithListeners[index].touchstart += newObj.touchstart;
            SRSwithListeners[index].touchend += newObj.touchend;
            SRSwithListeners[index].touchmove += newObj.touchmove;
            SRSwithListeners[index].touchcancel += newObj.touchcancel;
            SRSwithListeners[index].change += newObj.change;
            SRSwithListeners[index].select += newObj.select;
        }
        else { // script does not exist yet
            SRSwithListeners.push(newObj);
        }
    })
}

function findMatches() {
    foundSRSs = [];
    SRSwithListeners.forEach(SRSobj => { // Check if a script is in all three lists and push to foundSRSs
        if (SRSbySize.includes(SRSobj.script) && SRSbyTime.includes(SRSobj.script)) {
            foundSRSs.push(SRSobj);
            alertUserSRSFound()
        }
    })
}

function alertUserSRSFound() {
    // Set extension badge
    chrome.action.setBadgeBackgroundColor({ color: 'red' })
    chrome.action.setBadgeText({ text: "!" });

    // Send message to mark interactions that SRS is listening to
    // (async () => {
    //     const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    //     const response = await chrome.tabs.sendMessage(tab.id, { type: "SRSFound", data: foundSRSs });
    //     // do something with response here, not outside the function
    //     console.log(response);
    // })();


}