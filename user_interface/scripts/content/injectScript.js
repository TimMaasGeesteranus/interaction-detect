let scriptPath = chrome.runtime.getURL("user_interface/scripts/page/eventDetection.js");
loadScriptSynchronously(scriptPath);

// This will slow the page down a bit, but that is probably not noticable
function loadScriptSynchronously(scriptPath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', scriptPath, false); // Third parameter is set to false for synchronous request
    xhr.send();

    if (xhr.status === 200) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = xhr.responseText;
        (document.head || document.documentElement).appendChild(script);
    }
}