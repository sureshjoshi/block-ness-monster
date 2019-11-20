let blockedUrls = [];
// TODO: Hardcoded filters - these should be added by the user using the storage API
let filter = {
    urls: [
        "*://*.facebook.com/*",
        "*://*.twitter.com/*",
        "*://*.linkedin.com/*",
        "*://*.netflix.com/*",
        "*://*.tsn.ca/*",
    ],
};

const listener = function(details: chrome.webRequest.WebRequestBodyDetails) {
    return {
        redirectUrl: "https://bitbucket.org/dashboard/issues",
    };
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
    chrome.webRequest.onBeforeRequest.removeListener(listener);

    chrome.storage.local.get(["blockedUrls"], function(result) {
        const urls = result.blockedUrls.map((url) => `*://*.${url}/*`);
        if (urls.length === 0) {
            return;
        }

        const filter = {
            urls,
        };
        chrome.webRequest.onBeforeRequest.addListener(listener, filter, ["blocking"]);
        console.log("Changed listener - after filter = ", filter);
    });
});

// https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(listener, filter, ["blocking"]);
