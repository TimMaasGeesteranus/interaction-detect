const scriptNames = [
    "user_interface/scripts/page/eventDetection.js"
  ];

for (const script of scriptNames) {
    let scriptPath = chrome.runtime.getURL(script);
    loadScriptSynchronously(scriptPath);
}

function loadScriptSynchronously(scriptPath) { //This will slow the page down a bit, but that is probably not noticable
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
