
import { InitHappyHub } from './main-module.js';
import webStorage from './WebStorage.lua.js'; 


const customConfig = {
    apiVersion: "v11.7.0",
    themeColors: {
        accent: "#ff6b00", 
        bgMain: "#0d1117",
        bgSidebar: "#010409",
        text: "#e6edf3"
    },
    customMessage: "Spooky evening, replicatedman",
    verifiedBadgeUrl: "https://tr.rbxcdn.com/180DAY-87e64343dde2f4088286444b269310ff/420/420/Decal/Webp/noFilter"
};


InitHappyHub(customConfig, webStorage);
