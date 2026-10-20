-- Happy Hub | DataStorage.lua
-- Database consumed by caller.js. Keep the table structure intact.
-- Tip: ScriptCode uses long-brackets [==[ ... ]==], which supports single quotes, double quotes, and multiple lines without escaping.

local WebStorage = {
    SiteConfig = {
        Version = "v11.7.0",
        Theme = "OrangeDark",
        ShowVerifiedBadge = true,
        VerifiedBadgeUrl = "https://tr.rbxcdn.com/180DAY-87e64343dde2f4088286444b269310ff/420/420/Decal/Webp/noFilter",
    },

    Scripts = {
        {
            Id = "1",
            GameName = "Murder Mystery 2",
            Title = "[ 🎃 ] Happy Hub by replicated man fully free",
            Name = "Auto Farm, Auto Equip Best Ninja",
            Description = "Keyless · Auto Farm · Esp · fully free · xeno supported",
            Thumbnail = "https://www.rblxscripts.net/_next/image?url=https%3A%2F%2Fcdn.rblxscripts.net%2Fthumbnails%2FFfCAJLZMaS8rNX8HHQQ7zdWfCYFGaKO2_1792456751969_thumb.jpg&w=1080&q=75",
            Uploader = "replicated man",
            Verified = true,
            CreatorComment = "Tested on latest patch. Works flawlessly.",
            ScriptCode = [==[loadstring(game:HttpGet('https://raw.githubusercontent.com/overthcode2011-stack/HHB/refs/heads/main/main.lua'))()]==],
            IsOfficial = true,
            GameUrl = "https://www.roblox.com/games/142823291",
        },
    },

    PrivacyPolicy = {
        WhatWeHide = {
            "UNC 60%",
            "Commands admin if you use our api",
        },
        Allowed = {
            "Use the hub in any supported game.",
            "Save local configurations to your executor.",
            "Create custom scripts using our API.",
        },
        NotAllowed = {
            "Selling an existing script hub that uses our API",
            "Using our API to create fake script hubs that contain tools for account theft.",
        },
    },
}

return WebStorage
