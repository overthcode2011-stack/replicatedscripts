
import { InitHappyHub } from './main-module.js';
import webStorage from './WebStorage.lua.js'; 

const customConfig = {
    apiVersion: webStorage.SiteConfig.Version,
    greeting: "Welcome back, User",
    themeColors: { bgMain: "#000000", accent: "#ff9100", text: "#ffffff" }
};


InitHappyHub(customConfig, webStorage);
