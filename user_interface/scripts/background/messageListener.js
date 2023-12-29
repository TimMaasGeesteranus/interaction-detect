let SRSwithEvents = [];
let SRSbySize = [];
let SRSbyTime = [];
let foundSRSs = [];
let host;

// Listen for tab activation events
chrome.tabs.onActivated.addListener((activeInfo) => {
    // Get the details of the active tab
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        const tabUrl = new URL(tab.url);
        host = tabUrl.host;
    });
});


// Receive messages from extension popup and content scripts
chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
    const data = message.data;

    switch (message["type"]) {
        // From page scripts
        case "addInterceptedListeners": // events
            addToSRSwithEvents(data);
            findMatches();
            break;
        case "updateSRS_size": // requests
            addToSRSArray(data, SRSbySize);
            findMatches();
            break;
        case "updateSRS_time": // requests
            addToSRSArray(data, SRSbyTime);
            findMatches();
            break;

        // From popup scripts
        case "getSRSlist":
            sendResponse(foundSRSs);
            break;
        case "getCurrentPage":
            sendResponse(host);
            break;
    }
}

function addToSRSwithEvents(data) {
    data.forEach(newObj => {
        // Check if script already is in array
        let index = SRSwithEvents.findIndex(obj => obj.script === newObj.script);

        if (index !== -1) { // update existing script
            SRSwithEvents[index].click += newObj.click;
            SRSwithEvents[index].input += newObj.input;
            SRSwithEvents[index].keydown += newObj.keydown;
            SRSwithEvents[index].keypress += newObj.keypress;
            SRSwithEvents[index].keyup += newObj.keyup;
            SRSwithEvents[index].mousedown += newObj.mousedown;
            SRSwithEvents[index].mousemove += newObj.mousemove;
            SRSwithEvents[index].mouseout += newObj.mouseout;
            SRSwithEvents[index].mouseover += newObj.mouseover;
            SRSwithEvents[index].mouseup += newObj.mouseup;
            SRSwithEvents[index].pointerdown += newObj.pointerdown;
            SRSwithEvents[index].scroll += newObj.scroll;
            SRSwithEvents[index].total += newObj.total;
            SRSwithEvents[index].wheel += newObj.wheel;
            SRSwithEvents[index].touchstart += newObj.touchstart;
            SRSwithEvents[index].touchend += newObj.touchend;
            SRSwithEvents[index].touchmove += newObj.touchmove;
            SRSwithEvents[index].touchcancel += newObj.touchcancel;
            SRSwithEvents[index].change += newObj.change;
            SRSwithEvents[index].select += newObj.select;
        }
        else { // script does not exist yet
            SRSwithEvents.push(newObj);
        }
    })
}

function addToSRSArray(newObj, SRSArray) {
    // Check if pageUrl is already in list
    let index = SRSArray.findIndex(obj => obj.pageUrl === newObj.pageUrl);

    // Update existing page scripts or add new page scripts
    index !== -1 ? Object.assign(SRSArray[index], newObj) : SRSArray.push(newObj);
}

function findMatches() {
    SRSwithEvents.forEach(SRSobj => {
        if (!foundSRSs.includes(SRSobj) && hasMatch(SRSobj)) { // Check if in all three lists and not found yet
            foundSRSs.push(SRSobj); //save script in foundSRSs
            alertUserSRSFound()
        }
    });

    function hasMatch(SRSobj) {
        const matchInSRSbySize = Object.values(SRSbySize).some(obj => obj.pageUrl === SRSobj.pageurl && obj.SRSSet.includes(SRSobj.script));
        const matchInSRSbyTime = Object.values(SRSbyTime).some(obj => obj.pageUrl === SRSobj.pageurl && obj.SRSSet.includes(SRSobj.script));
        return matchInSRSbySize && matchInSRSbyTime;
    }
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