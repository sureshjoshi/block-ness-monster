const callback = function (details) {
    return {
        redirectUrl: "https://bitbucket.org/dashboard/issues"
    };
};

// TODO: Hardcoded filters - these should be added by the user using the storage API
const filter = {
    urls: [
        "*://*.facebook.com/*",
        "*://*.twitter.com/*",
        "*://*.linkedin.com/*",
        "*://*.netflix.com/*",
        "*://*.tsn.ca/*",
    ]
};

const options = ["blocking"];

// https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(callback, filter, options);
