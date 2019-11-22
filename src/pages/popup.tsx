import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Nickel1 } from "../utils/nickel";
import { BlockedSite } from "../entities/blocked-site";
import "./popup.css";

// import {chrome} from "chrome";

const nickel = new Nickel1();

const addToBlockList = async (hostname: string) => {
    console.log(`Adding to ${hostname} to block list`);

    const blockedSites = (await nickel.storage.getValue<BlockedSite[]>(BlockedSite.key)) ?? [];
    const blockedHostnames = blockedSites.map((s) => s.hostname);
    console.log(`Currently blocking ${blockedHostnames.length} sites: ${blockedHostnames}`);

    // Check if the desired hostname is already blocked
    if (blockedHostnames.includes(hostname)) {
        return;
    }

    const newSite = new BlockedSite(hostname);
    const newBlockedSites = [newSite, ...blockedSites];
    console.log(
        `New block list is ${newBlockedSites.length} sites: ${newBlockedSites.map(
            (s) => s.hostname
        )}`
    );

    await nickel.storage.setValue(BlockedSite.key, newBlockedSites);
    // const doubleCheck = (await nickel.storage.getValue<BlockedSite[]>(BlockedSite.key)) ?? [];
    // console.log(`Now blocking ${doubleCheck.length} sites: ${doubleCheck.map((s) => s.hostname)}`);
};

// chrome.storage.onChanged.addListener(
// async (changes: chrome.storage.StorageChange, namespace: string) => {
//         const sites = (await nickel.storage.get([BlockedSite.key]))[
//             BlockedSite.key
//         ] as BlockedSite[];
//         const blockList = document.getElementById("blockList") as HTMLTextAreaElement;
//         blockList.value = sites.map((s) => s.url).join("\n");
// console.log(`Blocking ${sites.length} sites: ${sites}`);
// }
// );

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

    const blockList = document.getElementById("blockList") as HTMLTextAreaElement;
    const blockedSites = (await nickel.storage.getValue<BlockedSite[]>(BlockedSite.key)) ?? [];
    blockList.value = blockedSites.map((s) => s.url).join("\n");
};

const UrlComponent = (hostname: string) => (
    <div className="flex flex-row">
        <text className="">{hostname}</text>
        <button className="">X</button>
    </div>
);

const PopupComponent = () => {
    const [currentHostname, setCurrentHostname] = useState("");
    const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);

    useEffect(() => {
        async function onLoad() {
            const currentTab = await getCurrentTab();
            const url = new URL(currentTab.url || "");
            setCurrentHostname(url.hostname);
        }
        onLoad();
    }, []);

    const onBlockClicked = async () => {
        await addToBlockList(currentHostname);
    };

    return (
        <div className="flex flex-col">
            <input>{currentHostname}</input>
            <button onClick={() => onBlockClicked()}></button>
            {blockedSites.map((site) => UrlComponent(site.url))}
        </div>
    );
};

ReactDOM.render(<PopupComponent />, document.getElementById("root"));
