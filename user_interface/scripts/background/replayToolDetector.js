export function listReplayTools(trackedUrls, eventsArray){
    console.table(eventsArray);
    console.log(`urls: ${trackedUrls}`);

    for (let event of eventsArray){
        if (trackedUrls.includes(event.url)){
            // Found in eventListenerscript and doing a lot of requests
        }
    }
}