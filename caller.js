const LUA_URL = "https://raw.githubusercontent.com/overthcode2011-stack/replicatedscripts/refs/heads/happyhub.net/DataStorage.lua";

const translations = {
    en: {
        nav_home: "Home", nav_scripts: "Official Scripts", nav_features: "Features", nav_whatsnew: "What's New", nav_api: "API Reference", nav_donate: "Donate",
        user_name: "User", search_placeholder: "Search current page...",
        home_eyebrow: "private dashboard", home_title: "Welcome back, User",
        home_desc: "This is your private dashboard. Access official scripts, API documentation, and the latest updates.",
        home_btn_scripts: "explore scripts", home_btn_api: "read api docs",
        catalog_eyebrow: "official releases", catalog_title: "Happy Hub Scripts",
        catalog_desc: "Only scripts maintained and verified by the Happy Hub team.",
        policies_eyebrow: "policies", privacy_title: "Privacy & Terms",
        back_btn: "Back to Scripts", copy_btn: "Copy Script", copied_btn: "Copied!", play_btn: "Play", desc_title: "Description",
        privacy_hide: "What We Hide", privacy_allowed: "What You Can Do", privacy_denied: "What You Cannot Do",
        features_eyebrow: "capabilities", features_title: "Features", features_desc: "What you get out of the box.",
        feat_h1: "UI & Themes", feat_l1: "<strong>10 built-in themes</strong> including the new <strong>Dark</strong> default.",
        feat_l2: "<strong>Pill toggles with check/X icons</strong> inside the knob.", feat_l3: "<strong>Image cards</strong> with title, subtitle, and description.",
        feat_h2: "Configs & Storage", feat_l4: "<strong>Per-game config files</strong> keyed by PlaceId.",
        feat_l5: "<strong>Save, load, delete, and reset to defaults.</strong>", feat_l6: "<strong>Customizable storage folder, subfolder and extension.</strong>",
        wn_eyebrow: "changelog", wn_title: "What's New", wn_desc: "Latest updates and patches.",
        tag_feature: "feature", wn_e1_title: "API.Config — global configuration table", wn_e1_desc: "A single table that controls game compatibility and the key system.",
        api_eyebrow: "documentation", api_title: "API Reference", api_desc: "Everything you can build with the Happy Hub library.",
        donate_eyebrow: "support", donate_title: "Donate", donate_desc: "Optional. Everything here stays free either way.", donate_btn: "Donate"
    },
    es: {
        nav_home: "Inicio", nav_scripts: "Scripts Oficiales", nav_features: "Funciones", nav_whatsnew: "Novedades", nav_api: "Referencia API", nav_donate: "Donar",
        user_name: "User", search_placeholder: "Buscar en esta página...",
        home_eyebrow: "panel privado", home_title: "Bienvenido de nuevo, User",
        home_desc: "Este es tu panel privado. Accede a scripts oficiales, documentación de la API y las últimas actualizaciones.",
        home_btn_scripts: "explorar scripts", home_btn_api: "leer docs api",
        catalog_eyebrow: "lanzamientos oficiales", catalog_title: "Scripts de Happy Hub",
        catalog_desc: "Solo scripts mantenidos y verificados por el equipo de Happy Hub.",
        policies_eyebrow: "políticas", privacy_title: "Privacidad y Términos",
        back_btn: "Volver a Scripts", copy_btn: "Copy Script", copied_btn: "¡Copiado!", play_btn: "Jugar", desc_title: "Descripción",
        privacy_hide: "Lo que ocultamos", privacy_allowed: "Lo que puedes hacer", privacy_denied: "Lo que no puedes hacer",
        features_eyebrow: "capacidades", features_title: "Funciones", features_desc: "Lo que obtienes out of the box.",
        feat_h1: "UI y Temas", feat_l1: "<strong>10 temas integrados</strong> incluyendo el nuevo <strong>Dark</strong> por defecto.",
        feat_l2: "<strong>Toggles pill con iconos check/X</strong> dentro del knob.", feat_l3: "<strong>Image cards</strong> con título, subtítulo y descripción.",
        feat_h2: "Configs y Almacenamiento", feat_l4: "<strong>Archivos de config por juego</strong> usando PlaceId.",
        feat_l5: "<strong>Guardar, cargar, eliminar y resetear a defaults.</strong>", feat_l6: "<strong>Carpeta raíz, subcarpeta y extensión configurables.</strong>",
        wn_eyebrow: "changelog", wn_title: "Novedades", wn_desc: "Últimas actualizaciones y parches.",
        tag_feature: "novedad", wn_e1_title: "API.Config — tabla de configuración global", wn_e1_desc: "Una única tabla que controla la compatibilidad de juego y el sistema de claves.",
        api_eyebrow: "documentación", api_title: "Referencia API", api_desc: "Todo lo que puedes construir con la librería de Happy Hub.",
        donate_eyebrow: "soporte", donate_title: "Donar", donate_desc: "Opcional. Todo aquí sigue siendo gratis de todas formas.", donate_btn: "Donar"
    }
};

const userLang = navigator.language.split('-')[0];
const currentLang = translations[userLang] ? userLang : 'en';
const t = (key) => translations[currentLang][key] || translations['en'][key];

let currentScriptCode = "";
let WebStorage = null;

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
}

// Robust Lua to JSON Parser
function parseLuaToJSON(luaText) {
    try {
        let clean = luaText
            .replace(/--.*$/gm, '')
            .replace(/local\s+WebStorage\s*=\s*/, 'return ')
            .replace(/return\s+WebStorage\s*;?/, '');
            
        // Fix missing commas between properties
        clean = clean.replace(/(["'])(.*?)\1\s*([a-zA-Z_])/g, '$1$2$1, $3');
        clean = clean.replace(/(true|false|\d+)\s*([a-zA-Z_])/g, '$1, $2');
        clean = clean.replace(/\}\s*([a-zA-Z_])/g, '}, $1');
        
        // Ensure Scripts array is closed correctly before PrivacyPolicy
        clean = clean.replace(/\},\s*PrivacyPolicy/g, '}], PrivacyPolicy');

        // Quote keys
        clean = clean.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, '$1"$2":');

        return new Function(clean)();
    } catch (error) {
        console.error("Lua Parse Error:", error);
        return null;
    }
}

async function fetchDataStorage() {
    try {
        const response = await fetch(LUA_URL);
        if (!response.ok) throw new Error("Network response error");
        const text = await response.text();
        
        WebStorage = parseLuaToJSON(text);
        
        if (WebStorage) {
            renderCatalog();
            renderPrivacy();
        } else {
            document.getElementById('loadingText').innerText = "Error parsing DataStorage.lua. Fix syntax errors in your file.";
            document.getElementById('loadingText').style.color = "#ff6b6b";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('loadingText').innerText = "Failed to fetch DataStorage.lua.";
        document.getElementById('loadingText').style.color = "#ff6b6b";
    }
}

function renderCatalog() {
    const scriptGrid = document.getElementById('scriptGrid');
    scriptGrid.innerHTML = '';
    
    const badgeUrl = WebStorage.SiteConfig.VerifiedBadgeUrl;

    WebStorage.Scripts.forEach(script => {
        const verifiedHTML = script.Verified ? `<img src="${badgeUrl}" class="verified-badge" title="Verified" alt="Verified">` : '';
        
        scriptGrid.innerHTML += `
            <div class="card" onclick="window.openScriptDetail('${script.Id}')">
                <img src="${script.Thumbnail}" class="card-image" alt="${script.Title}" loading="lazy" onerror="this.src='https://tr.rbxcdn.com/180DAY-85562c0efb45221628a4c872e35cf587/420/420/Decal/Webp/noFilter'">
                <div class="card-content">
                    <div class="game-title">${script.GameName || 'Unknown Game'}</div>
                    <div class="script-name">${script.Title}</div>
                    <div class="script-desc">${script.Description}</div>
                    <div class="card-footer">
                        <div class="uploader">by ${script.Uploader} ${verifiedHTML}</div>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderPrivacy() {
    const privacyGrid = document.getElementById('privacyGrid');
    if (!WebStorage.PrivacyPolicy) return;
    const policy = WebStorage.PrivacyPolicy;
    
    const createList = (title, items) => `
        <div class="privacy-box">
            <h3>${title}</h3>
            <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
    `;
    
    privacyGrid.innerHTML = 
        createList(t('privacy_hide'), policy.WhatWeHide) +
        createList(t('privacy_allowed'), policy.Allowed) +
        createList(t('privacy_denied'), policy.NotAllowed);
}

window.openScriptDetail = function(id) {
    if (!WebStorage) return;
    const script = WebStorage.Scripts.find(s => s.Id === id);
    if (!script) return;

    currentScriptCode = script.ScriptCode;

    document.getElementById('detailImg').src = script.Thumbnail;
    document.getElementById('detailGame').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4m8-2h.01M18 10h.01"/></svg> ${script.GameName || 'Unknown Game'}`;
    document.getElementById('detailTitle').textContent = script.Title;
    document.getElementById('detailAuthor').innerHTML = `by ${script.Uploader} ${script.Verified ? `<img src="${WebStorage.SiteConfig.VerifiedBadgeUrl}" class="verified-badge" style="display:inline; vertical-align:middle; margin-left:4px;">` : ''}`;
    document.getElementById('detailDesc').textContent = script.Description;
    document.getElementById('detailPlayBtn').href = script.GameUrl || '#';

    const noteEl = document.getElementById('detailNote');
    if (script.CreatorComment) {
        noteEl.style.display = 'block';
        noteEl.innerHTML = `"${script.CreatorComment}" — ${script.Uploader}`;
    } else {
        noteEl.style.display = 'none';
    }

    window.navigate('detail');
};

window.copyScript = function() {
    if (!currentScriptCode) return;
    
    navigator.clipboard.writeText(currentScriptCode).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ${t('copied_btn')}`;
        btn.style.background = "#fff";
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = "var(--green)";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
};

window.navigate = function(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    const navTarget = viewId === 'detail' ? 'catalog' : viewId;
    const activeNav = document.querySelector(`.nav-item[data-target="${navTarget}"]`);
    if (activeNav) activeNav.classList.add('active');

    document.getElementById('viewContainer').scrollTop = 0;
};

applyTranslations();
fetchDataStorage();
