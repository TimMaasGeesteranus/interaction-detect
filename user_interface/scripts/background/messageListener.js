let SRSwithListeners = [];
let SRSbySize = [];
let SRSbyTime = [];

// Receive messages from extension popup and content scripts
chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    const data = message.data;

    switch (message["type"]) {
        // From page scripts
        case "addInterceptedListeners":
            addToSRSwithListeners(data);
            break;
        case "updateSRS_size":
            SRSbySize = data
            break;
        case "updateSRS_time":
            SRSbyTime = data
            break;

        // From popup scripts
        case "getSRSlist":
            sendResponse(getSRSlist());
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

        }
        else { // script does not exist yet
            SRSwithListeners.push(newObj);
        }
    })
}

function getSRSlist() {
    let foundObjects = [];

    SRSwithListeners.forEach(SRSobj => { // Check if a script is in all three lists and push to foundObjects
        if (SRSbySize.includes(SRSobj.script) && SRSbyTime.includes(SRSobj.script)) {
            foundObjects.push(SRSobj);
        }
    })

    return foundObjects;
}