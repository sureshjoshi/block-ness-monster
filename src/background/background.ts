import { BlockedSite } from "../entities/blocked-site";
import { Nickel1 } from "../utils/nickel";

console.log("Loading");

const nickel = new Nickel1();

// let blockedUrls = [];
// TODO: Hardcoded filters - these should be added by the user using the storage API
// let filter = {
//     urls: [
//         "*://*.facebook.com/*",
//         "*://*.twitter.com/*",
//         "*://*.linkedin.com/*",
//         "*://*.netflix.com/*",
//         "*://*.tsn.ca/*",
//     ],
// };

const listener = (details: chrome.webRequest.WebRequestBodyDetails) => {
    return {
        redirectUrl: "https://bitbucket.org/dashboard/issues",
    };
};

// Called whenever the storage API is called
chrome.storage.onChanged.addListener(async (changes, namespace) => {
    console.log("Storage changed");
    chrome.webRequest.onBeforeRequest.removeListener(listener);

    const sites = (await nickel.storage.getValue<BlockedSite[]>(BlockedSite.key)) ?? [];
    if (sites.length === 0) {
        console.log("No sites to filter");
        return;
    }

    const filter = {
        urls: sites.map((site) => site.url),
    };
    console.log("Filtering: ", filter);
    chrome.webRequest.onBeforeRequest.addListener(listener, filter, ["blocking"]);
    console.log("Changed listener - after filter = ", filter);
});

// Called on first run, or update (TODO: need to remove existing listeners?)
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Installed");
    // https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest
    const sites = (await nickel.storage.getValue<BlockedSite[]>(BlockedSite.key)) ?? [];

    if (sites.length === 0) {
        console.log("No sites to filter");
        return;
    }

    const filter = {
        urls: sites.map((site) => site.url),
    };
    console.log("Filtering: ", filter);
    chrome.webRequest.onBeforeRequest.addListener(listener, filter, ["blocking"]);
});
