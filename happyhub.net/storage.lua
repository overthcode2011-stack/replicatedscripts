-- replicatedscripts.net | storage.lua
-- Database consumed by source.js. Keep the table structure intact.

local WebStorage = {
    SiteConfig = {
        Version = "v11.7.0",
        Theme = "OrangeDark",
        ShowVerifiedBadge = true,
        VerifiedBadgeUrl = "https://tr.rbxcdn.com/180DAY-3e194685a7be45100d9d8fed5ce79612/420/420/Decal/Webp/noFilter",
    },

    Scripts = {
        {
            Id = "1",
            GameName = "Murder Mystery 2",
            Title = "[ 🎃 ] Happy Hub by replicated man fully free",
            Name = "Happy Hub",
            Description = "Keyless · Auto Farm · Esp · fully free · xeno supported",
            Thumbnail = "https://www.rblxscripts.net/_next/image?url=https%3A%2F%2Fcdn.rblxscripts.net%2Fthumbnails%2FFfCAJLZMaS8rNX8HHQQ7zdWfCYFGaKO2_1792456751969_thumb.jpg&w=1080&q=75",
            Uploader = "replicated man",
            Verified = true,
            CreatorComment = "My principal script.",
            ScriptCode = [==[loadstring(game:HttpGet('https://raw.githubusercontent.com/overthcode2011-stack/HHB/refs/heads/main/MurderMistery.lua'))()]==],
            IsOfficial = true,
            GameUrl = "https://www.roblox.com/games/142823291",
            
         
            OpenSource = true,
            MobileFriendly = true,
        },
        {
            Id = "2",
            GameName = "Rivals",
            Title = "[UPD] Happy Hub keyless free cheats",
            Name = "Happy Hub",
            Description = "Keyless · Aimbot · Esp · fully free · xeno supported",
            Thumbnail = "https://www.rblxscripts.net/_next/image?url=https%3A%2F%2Fcdn.rblxscripts.net%2Fthumbnails%2FFfCAJLZMaS8rNX8HHQQ7zdWfCYFGaKO2_1789224669490_thumb.jpg&w=1080&q=75",
            Uploader = "replicated man",
            Verified = true,
            CreatorComment = "It works.",
            ScriptCode = [==[loadstring(game:HttpGet('https://raw.githubusercontent.com/overthcode2011-stack/HHB/refs/heads/main/Rivals.lua'))()]==],
            IsOfficial = true,
            GameUrl = "https://www.roblox.com/games/17625359962",
            
         
            OpenSource = true,
            MobileFriendly = true,
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
