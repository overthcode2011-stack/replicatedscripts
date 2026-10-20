(() => {
  'use strict';

  const LUA_URL = 'https://raw.githubusercontent.com/overthcode2011-stack/replicatedscripts/refs/heads/happyhub.net/DataStorage.lua';
  const FALLBACK_THUMB = 'https://tr.rbxcdn.com/180DAY-85562c0efb45221628a4c872e35cf587/420/420/Decal/Webp/noFilter';



  const LUA_TOKEN = new RegExp([
    '\\s+',                                   
    '--\\[(=*)\\[[\\s\\S]*?\\]\\1\\]',        
    '--[^\\n]*',                              
    '\\[(=*)\\[([\\s\\S]*?)\\]\\2\\]',         
    '"((?:[^"\\\\\\n]|\\\\[\\s\\S])*)"',       
    "'((?:[^'\\\\\\n]|\\\\[\\s\\S])*)'",     
    '(-?(?:0[xX][0-9a-fA-F]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?|\\.\\d+))', 
    '([A-Za-z_][A-Za-z0-9_]*)',                
    '(\\.\\.|[{}\\[\\]=,;])'                 
  ].join('|'), 'y');

  const LUA_ESCAPES = { n: '\n', t: '\t', r: '\r', a: '\x07', b: '\b', f: '\f', v: '\v' };

  function unescapeLua(s) {
    return s.replace(
      /\\(?:(\d{1,3})|x([0-9a-fA-F]{2})|u\{([0-9a-fA-F]+)\}|z\s*|([\s\S]))/g,
      (_, dec, hex, uni, ch) => {
        if (dec !== undefined) return String.fromCharCode(Number(dec));
        if (hex !== undefined) return String.fromCharCode(parseInt(hex, 16));
        if (uni !== undefined) return String.fromCodePoint(parseInt(uni, 16));
        if (ch === undefined) return '';
        return LUA_ESCAPES[ch] ?? ch;
      }
    );
  }

  function tokenizeLua(src) {
    const tokens = [];
    LUA_TOKEN.lastIndex = 0;
    while (LUA_TOKEN.lastIndex < src.length) {
      const at = LUA_TOKEN.lastIndex;
      const m = LUA_TOKEN.exec(src);
      if (!m) throw new SyntaxError(`Unexpected character "${src[at]}" at position ${at}`);
      if (m[3] !== undefined) tokens.push({ t: 'str', v: m[3].replace(/^\r?\n/, '') });
      else if (m[4] !== undefined) tokens.push({ t: 'str', v: unescapeLua(m[4]) });
      else if (m[5] !== undefined) tokens.push({ t: 'str', v: unescapeLua(m[5]) });
      else if (m[6] !== undefined) tokens.push({ t: 'num', v: Number(m[6]) });
      else if (m[7] !== undefined) tokens.push({ t: 'id', v: m[7] });
      else if (m[8] !== undefined) tokens.push({ t: m[8] });
    }
    return tokens;
  }

  function parseLua(source) {
    const tokens = tokenizeLua(source);
    let pos = tokens.findIndex((tk) => tk.t === '{');
    if (pos === -1) throw new SyntaxError('No table constructor found');

    const expect = (type) => {
      if (!tokens[pos] || tokens[pos].t !== type) {
        throw new SyntaxError(`Expected "${type}" but found "${tokens[pos]?.t ?? 'end of file'}"`);
      }
      pos++;
    };

    function parseAtom() {
      const tk = tokens[pos];
      if (!tk) throw new SyntaxError('Unexpected end of file');
      if (tk.t === '{') return parseTable();
      pos++;
      if (tk.t === 'str' || tk.t === 'num') return tk.v;
      if (tk.t === 'id') {
        if (tk.v === 'true') return true;
        if (tk.v === 'false') return false;
        if (tk.v === 'nil') return null;
      }
      throw new SyntaxError(`Unexpected token "${tk.v ?? tk.t}"`);
    }

    function parseValue() {
      let value = parseAtom();
      while (typeof value === 'string' && tokens[pos]?.t === '..') {
        pos++;
        value += String(parseAtom());
      }
      return value;
    }

    function parseTable() {
      expect('{');
      const list = [];
      const map = {};
      let hasKeys = false;

      while (pos < tokens.length && tokens[pos].t !== '}') {
        const tk = tokens[pos];
        if (tk.t === 'id' && tokens[pos + 1]?.t === '=') {
          pos += 2;
          map[tk.v] = parseValue();
          hasKeys = true;
        } else if (tk.t === '[') {
          pos++;
          const key = parseValue();
          expect(']');
          expect('=');
          map[key] = parseValue();
          hasKeys = true;
        } else {
          list.push(parseValue());
        }
       
        if (tokens[pos]?.t === ',' || tokens[pos]?.t === ';') pos++;
      }

      if (pos >= tokens.length) {
        console.warn('DataStorage.lua: tabla sin cerrar, se cierra automaticamente al final del archivo.');
      } else {
        pos++;
      }

      if (!hasKeys) return list;
      list.forEach((v, i) => { map[i + 1] = v; });
      return map;
    }

    return parseTable();
  }

  /* ------------------------------------------------------------------ *
   *  Internacionalizacion (EN / ES)
   *  Los terminos de PROTECTED se inyectan con {clave} y nunca se
   *  traducen. Los datos del .lua (nombres de scripts) tampoco.
   * ------------------------------------------------------------------ */

  const PROTECTED = { brand: 'Happy Hub', hub: 'Script Hub', copy: 'Copy Script' };

  const TRANSLATIONS = {
    en: {
      nav_home: 'Home', nav_scripts: 'Official Scripts', nav_features: 'Features', nav_whatsnew: "What's New", nav_api: 'API Reference', nav_donate: 'Donate',
      user_name: 'User', search_placeholder: 'Search current page...',
      home_eyebrow: 'private dashboard', home_title: 'Welcome back, User',
      home_desc: 'This is your private dashboard. Access official scripts, API documentation, and the latest updates.',
      home_btn_scripts: 'explore scripts', home_btn_api: 'read api docs',
      catalog_eyebrow: 'official releases', catalog_title: '{brand} Scripts',
      catalog_desc: 'Only scripts maintained and verified by the {brand} team.',
      loading_text: 'Loading catalog...', catalog_empty: 'No scripts available yet.',
      error_fetch: 'Could not download the catalog. Check your connection and try again.',
      error_parse: 'The catalog file could not be read. Check the syntax of DataStorage.lua.',
      retry_btn: 'Retry', by: 'by', verified: 'Verified', unknown_game: 'Unknown Game',
      policies_eyebrow: 'policies', privacy_title: 'Privacy & Terms',
      back_btn: 'Back to Scripts', copy_btn: '{copy}', copied_btn: 'Copied!', play_btn: 'Play', desc_title: 'Description',
      privacy_hide: 'What We Hide', privacy_allowed: 'What You Can Do', privacy_denied: 'What You Cannot Do',
      features_eyebrow: 'capabilities', features_title: 'Features', features_desc: 'What you get out of the box with {brand}.',
      feat_h1: 'UI & Themes', feat_l1: '<strong>10 built-in themes</strong> including the new <strong>Dark</strong> default.',
      feat_l2: '<strong>Pill toggles with check/X icons</strong> inside the knob.', feat_l3: '<strong>Image cards</strong> with title, subtitle, and description.',
      feat_h2: 'Configs & Storage', feat_l4: '<strong>Per-game config files</strong> keyed by PlaceId.',
      feat_l5: '<strong>Save, load, delete, and reset to defaults.</strong>', feat_l6: '<strong>Customizable storage folder, subfolder and extension.</strong>',
      wn_eyebrow: 'changelog', wn_title: "What's New", wn_desc: 'Latest updates and patches.',
      tag_feature: 'feature', wn_e1_title: 'API.Config — global configuration table', wn_e1_desc: 'A single table that controls game compatibility and the key system.',
      api_eyebrow: 'documentation', api_title: 'API Reference', api_desc: 'Everything you can build with the {brand} library.',
      donate_eyebrow: 'support', donate_title: 'Donate', donate_desc: 'Optional. Everything here stays free either way.', donate_btn: 'Donate'
    },
    es: {
      nav_home: 'Inicio', nav_scripts: 'Scripts Oficiales', nav_features: 'Funciones', nav_whatsnew: 'Novedades', nav_api: 'Referencia API', nav_donate: 'Donar',
      user_name: 'Usuario', search_placeholder: 'Buscar en esta página...',
      home_eyebrow: 'panel privado', home_title: 'Bienvenido de nuevo, Usuario',
      home_desc: 'Este es tu panel privado. Accede a scripts oficiales, documentación de la API y las últimas actualizaciones.',
      home_btn_scripts: 'explorar scripts', home_btn_api: 'leer docs api',
      catalog_eyebrow: 'lanzamientos oficiales', catalog_title: 'Scripts de {brand}',
      catalog_desc: 'Solo scripts mantenidos y verificados por el equipo de {brand}.',
      loading_text: 'Cargando catálogo...', catalog_empty: 'Todavía no hay scripts disponibles.',
      error_fetch: 'No se pudo descargar el catálogo. Revisa tu conexión e inténtalo de nuevo.',
      error_parse: 'No se pudo leer el archivo del catálogo. Revisa la sintaxis de DataStorage.lua.',
      retry_btn: 'Reintentar', by: 'por', verified: 'Verificado', unknown_game: 'Juego desconocido',
      policies_eyebrow: 'políticas', privacy_title: 'Privacidad y Términos',
      back_btn: 'Volver a Scripts', copy_btn: '{copy}', copied_btn: '¡Copiado!', play_btn: 'Jugar', desc_title: 'Descripción',
      privacy_hide: 'Lo que ocultamos', privacy_allowed: 'Lo que puedes hacer', privacy_denied: 'Lo que no puedes hacer',
      features_eyebrow: 'capacidades', features_title: 'Funciones', features_desc: 'Lo que obtienes de serie con {brand}.',
      feat_h1: 'UI y Temas', feat_l1: '<strong>10 temas integrados</strong> incluyendo el nuevo <strong>Dark</strong> por defecto.',
      feat_l2: '<strong>Toggles tipo píldora con iconos check/X</strong> dentro del selector.', feat_l3: '<strong>Tarjetas con imagen</strong>, título, subtítulo y descripción.',
      feat_h2: 'Configs y Almacenamiento', feat_l4: '<strong>Archivos de config por juego</strong> usando PlaceId.',
      feat_l5: '<strong>Guardar, cargar, eliminar y restablecer valores por defecto.</strong>', feat_l6: '<strong>Carpeta raíz, subcarpeta y extensión configurables.</strong>',
      wn_eyebrow: 'changelog', wn_title: 'Novedades', wn_desc: 'Últimas actualizaciones y parches.',
      tag_feature: 'novedad', wn_e1_title: 'API.Config — tabla de configuración global', wn_e1_desc: 'Una única tabla que controla la compatibilidad de juego y el sistema de claves.',
      api_eyebrow: 'documentación', api_title: 'Referencia API', api_desc: 'Todo lo que puedes construir con la librería de {brand}.',
      donate_eyebrow: 'soporte', donate_title: 'Donar', donate_desc: 'Opcional. Todo aquí sigue siendo gratis de todas formas.', donate_btn: 'Donar'
    }
  };

  const browserLang = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en')
    .slice(0, 2).toLowerCase();
  const currentLang = TRANSLATIONS[browserLang] ? browserLang : 'en';

  const t = (key) =>
    (TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.en[key] ?? key)
      .replace(/\{(\w+)\}/g, (match, name) => PROTECTED[name] ?? match);

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  }

  
  const $ = (id) => document.getElementById(id);
  const state = { data: null, currentScript: null };

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
  const safeUrl = (url, fallback = '') => (/^https?:\/\//i.test(url || '') ? url : fallback);
  const toList = (value) => (Array.isArray(value) ? value : []);

  const CHECK_SVG = '<svg class="verified-badge" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function verifiedBadge(script) {
    const config = state.data?.SiteConfig || {};
    if (!script.Verified || config.ShowVerifiedBadge === false) return '';
    const url = safeUrl(config.VerifiedBadgeUrl);
    return url
      ? `<img src="${esc(url)}" class="verified-badge" title="${esc(t('verified'))}" alt="${esc(t('verified'))}">`
      : CHECK_SVG;
  }

  
  function showStatus(messageKey, { error = false, retry = false } = {}) {
    $('scriptGrid').innerHTML =
      `<div class="status-msg${error ? ' error' : ''}"><p>${esc(t(messageKey))}</p>` +
      (retry ? `<button class="btn" data-action="retry">${esc(t('retry_btn'))}</button>` : '') +
      '</div>';
  }

  function renderCatalog() {
    const scripts = toList(state.data?.Scripts);
    if (!scripts.length) { showStatus('catalog_empty'); return; }

    $('scriptGrid').innerHTML = scripts.map((s) => `
      <div class="card" data-id="${esc(s.Id)}" role="button" tabindex="0">
        <img src="${esc(safeUrl(s.Thumbnail, FALLBACK_THUMB))}" class="card-image" alt="${esc(s.Title)}" loading="lazy">
        <div class="card-content">
          <div class="game-title">${esc(s.GameName || t('unknown_game'))}</div>
          <div class="script-name">${esc(s.Title)}</div>
          <div class="script-desc">${esc(s.Description)}</div>
          <div class="card-footer">
            <div class="uploader">${esc(t('by'))} ${esc(s.Uploader)} ${verifiedBadge(s)}</div>
          </div>
        </div>
      </div>`).join('');
  }

  function renderPrivacy() {
    const policy = state.data?.PrivacyPolicy;
    if (!policy) return;

    const box = (title, items) => `
      <div class="privacy-box">
        <h3>${esc(title)}</h3>
        <ul>${toList(items).map((item) => `<li>${esc(String(item).trim())}</li>`).join('')}</ul>
      </div>`;

    $('privacyGrid').innerHTML =
      box(t('privacy_hide'), policy.WhatWeHide) +
      box(t('privacy_allowed'), policy.Allowed) +
      box(t('privacy_denied'), policy.NotAllowed);
  }

  function openScriptDetail(id) {
    const script = toList(state.data?.Scripts).find((s) => String(s.Id) === String(id));
    if (!script) return;
    state.currentScript = script;

    const img = $('detailImg');
    img.src = safeUrl(script.Thumbnail, FALLBACK_THUMB);
    img.alt = script.Title || '';

    $('detailGameName').textContent = script.GameName || t('unknown_game');
    $('detailTitle').textContent = script.Title || '';
    $('detailAuthor').innerHTML = `${esc(t('by'))} ${esc(script.Uploader)} ${verifiedBadge(script)}`;
    $('detailDesc').textContent = script.Description || '';

    const play = $('detailPlayBtn');
    const gameUrl = safeUrl(script.GameUrl);
    play.hidden = !gameUrl;
    play.href = gameUrl || '#';
    play.rel = 'noopener noreferrer';

    const note = $('detailNote');
    note.hidden = !script.CreatorComment;
    note.textContent = script.CreatorComment ? `"${script.CreatorComment}" — ${script.Uploader}` : '';

    resetCopyButton();
    navigate('detail');
  }

  
  let copyTimer = null;

  function legacyCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    if (!ok) throw new Error('execCommand("copy") was rejected');
  }

  async function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      legacyCopy(text);
    }
  }

  function resetCopyButton() {
    clearTimeout(copyTimer);
    $('copyBtn').classList.remove('copied');
    $('copyLabel').textContent = t('copy_btn');
  }

  async function copyScript() {
    const code = state.currentScript?.ScriptCode;
    if (!code) return;
    try {
      await writeClipboard(code);
      $('copyBtn').classList.add('copied');
      $('copyLabel').textContent = t('copied_btn');
      clearTimeout(copyTimer);
      copyTimer = setTimeout(resetCopyButton, 2000);
    } catch (err) {
      console.error('Could not copy the script:', err);
    }
  }

  

  function navigate(viewId) {
    const view = $(`view-${viewId}`);
    if (!view) return;
    document.querySelectorAll('.view-section').forEach((v) => v.classList.toggle('active', v === view));
    const navTarget = viewId === 'detail' ? 'catalog' : viewId;
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.nav === navTarget));
    $('viewContainer').scrollTop = 0;
  }

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) { navigate(nav.dataset.nav); return; }
    const card = e.target.closest('.card[data-id]');
    if (card) { openScriptDetail(card.dataset.id); return; }
    const action = e.target.closest('[data-action]');
    if (action?.dataset.action === 'copy') copyScript();
    if (action?.dataset.action === 'retry') loadData();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.card[data-id]')) {
      e.preventDefault();
      openScriptDetail(e.target.dataset.id);
    }
  });

  
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.classList.contains('card-image') && img.src !== FALLBACK_THUMB) {
      img.src = FALLBACK_THUMB;
    }
  }, true);



  async function loadData() {
    showStatus('loading_text');
    try {
      const response = await fetch(LUA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = parseLua(await response.text());
      renderCatalog();
      renderPrivacy();
    } catch (err) {
      console.error('DataStorage.lua:', err);
      showStatus(err instanceof SyntaxError ? 'error_parse' : 'error_fetch', { error: true, retry: true });
    }
  }

  applyTranslations();
  loadData();
})();
