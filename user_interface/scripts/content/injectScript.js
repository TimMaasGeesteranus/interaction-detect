var s = document.createElement('script');
s.src = chrome.runtime.getURL('user_interface/scripts/page/eventDetection.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);