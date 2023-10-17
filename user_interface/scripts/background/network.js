let trackercount = 0;
let fscount = 0;

browser.webRequest.onCompleted.addListener(
    function (details) {

        for (let thirdparty of details.urlClassification.thirdParty) {
            incrementTotalCount();
            if (thirdparty.includes("tracking")) {
                incrementTrackerCount();
                if (details.url.includes('fullstory')) {
                    incrementFsCount();
                    browser.browserAction.setBadgeText({text: "!!!"})
                }
            }
        }
    },
    { urls: ['<all_urls>'] }, // Match all URLs
    []
)

