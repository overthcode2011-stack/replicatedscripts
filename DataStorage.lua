-- WebStorage.lua
local WebStorage = {
    -- Configuración global del sitio
    SiteConfig = {
        Version = "v11.7.0",
        Theme = "OrangeDark", -- Puede ser "GreenDark", "BlueDark", etc.
        HideHWID = true,
        HideIP = true,
    },

    -- Lista de scripts (Tarjetas)
    Scripts = {
        {
            Id = "script_1",
            Title = "NINJA OBBY ESCAPE",
            Name = "Auto Farm, Auto Equip Best Ninja",
            Description = "KEYLESS | Auto Farm | Auto Equip | Bypass Anti-Cheat",
            Thumbnail = "https://tr.rbxcdn.com/180DAY-b24021a5b4f2d78048587b78583bb2e7/420/420/Image/Webp/noFilter",
            Uploader = "replicated man",
            Verified = true,
            CreatorComment = "Tested on latest patch. Works flawlessly.",
            IsOfficial = true,
            Stats = { Views = "15K", Likes = 420, Date = "4h ago" }
        },
        {
            Id = "script_2",
            Title = "BLOX FRUITS",
            Name = "Cheese Hub [BETA]",
            Description = "Auto Farm, Sea Events & Items (Keyless)",
            Thumbnail = "https://tr.rbxcdn.com/180DAY-85562c0efb45221628a4c872e35cf587/420/420/Decal/Webp/noFilter",
            Uploader = "ODΣCODΣ",
            Verified = true,
            CreatorComment = "Beta build. Expect some bugs with fruit spawning.",
            IsOfficial = false,
            Stats = { Views = "39K", Likes = 890, Date = "8h ago" }
        }
    },

    -- Política de privacidad y términos
    PrivacyPolicy = {
        WhatWeHide = {
            "HWID (Hardware ID)",
            "Dirección IP",
            "Información del Executor",
            "Registros de teclas (Keylogs)"
        },
        Allowed = {
            "Usar el hub en cualquier juego soportado.",
            "Guardar configuraciones locales en tu executor.",
            "Crear scripts personalizados usando nuestra API."
        },
        NotAllowed = {
            "Vender o redistribuir keys de acceso.",
            "Intentar hacer reverse engineering del sistema de autenticación.",
            "Usar el hub para dañar servidores o a otros jugadores."
        }
    }
}

return WebStorage
