function addToBlockList(hostname) {
    console.log("Adding to block list:", hostname);
    chrome.storage.local.get(["blockedUrls"], function(result) {
        console.log("Result:", result);
        chrome.storage.local.set({ blockedUrls: [hostname, ...result.blockedUrls] });
    });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    chrome.storage.local.get(["blockedUrls"], function(result) {
        const blockList = this.document.getElementById("blockList");
        blockList.value = result.blockedUrls;
    });
});

window.onload = function() {
    console.log(chrome.storage);
    const urlInput = this.document.getElementById("blockUrl");
    const query = { active: true, currentWindow: true };
    function callback(tabs) {
        const currentTab = tabs[0]; // there will be only one in this array
        console.log(currentTab); // also has properties like currentTab.id
        const url = new URL(currentTab.url);
        urlInput.value = url.hostname;
    }
    chrome.tabs.query(query, callback);

    const blockButton = document.getElementById("blockButton");
    blockButton.onclick = function(element) {
        console.log(urlInput.value);
        addToBlockList(urlInput.value);
    };
};
