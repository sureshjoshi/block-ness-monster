import { Nickel1 } from "../utils/nickel";
import { BlockedSite } from "../entities/blocked-site";

// import {chrome} from "chrome";

const nickel = new Nickel1();

const addToBlockList = async (hostname: string) => {
    console.log("Adding to block list:", hostname);
    const sites = (await nickel.storage.get([BlockedSite.key]))[BlockedSite.key] as BlockedSite[];
    console.log(`Currently blocking ${sites.length} sites: ${sites.map((s) => s.hostname)}`);
    const site = new BlockedSite(hostname);
    const newSites = [site, ...sites];
    console.log(`Now blocking ${newSites.length} sites: ${newSites.map((s) => s.hostname)}`);
    await nickel.storage.set({ blockedSite: newSites });
};

chrome.storage.onChanged.addListener(
    async (changes: chrome.storage.StorageChange, namespace: string) => {
        const sites = (await nickel.storage.get([BlockedSite.key]))[
            BlockedSite.key
        ] as BlockedSite[];
        const blockList = document.getElementById("blockList") as HTMLTextAreaElement;
        blockList.value = sites.map((s) => s.url).join("\n");
        console.log(`Blocking ${sites.length} sites: ${sites}`);
    }
);

const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
    const tabs = await nickel.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    return currentTab;
};

window.onload = async () => {
    console.log(chrome.storage);

    const urlInput = document.getElementById("blockUrl") as HTMLInputElement;
    const currentTab = await getCurrentTab();

    const url = new URL(currentTab.url || "");
    urlInput.value = url.hostname;

    const blockButtonClicked = async (element: MouseEvent) => {
        console.log(urlInput.value);
        await addToBlockList(urlInput.value);
    };

    const blockButton = document.getElementById("blockButton") as HTMLButtonElement;
    blockButton.onclick = blockButtonClicked;
};
