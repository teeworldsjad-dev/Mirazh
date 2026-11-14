/* ═══════════════════════════════════════════════════════════════
   Нативный мост Android · «Весовщики: Мираж»
   Сохранения (Preferences + localStorage), Telegram-shim,
   кнопка «Назад», экран сохранений 💾, шаринг, вибрация.
   Код игры не меняется.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PREFIX = 'mirazh', STORE = 'mirazh.save.v1';
  var restoring = false, dirty = false, timer = 0, lastSave = 0, panel = null, loaded = false;
  var rawSet = Storage.prototype.setItem, rawDel = Storage.prototype.removeItem, rawClear = Storage.prototype.clear;

  function plug(n) { var c = window.Capacitor; return (c && c.Plugins && c.Plugins[n]) || null; }
  function native() { var c = window.Capacitor; return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function G() { try { return typeof S !== 'undefined' ? S : null; } catch (e) { return null; } }
  function K() { try { return typeof CAR !== 'undefined' ? CAR : null; } catch (e) { return null; } }

  /* ── хранилище ── */
  function collect() {
    var o = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PREFIX) === 0) o[k] = localStorage.getItem(k); } } catch (e) {}
    return o;
  }
  function markDirty() {
    if (restoring) return;
    dirty = true; pulse();
    clearTimeout(timer); timer = setTimeout(flush, 350);
  }
  Storage.prototype.setItem = function (k, v) { rawSet.apply(this, arguments); if (this === localStorage && String(k).indexOf(PREFIX) === 0) markDirty(); };
  Storage.prototype.removeItem = function (k) { rawDel.apply(this, arguments); if (this === localStorage && String(k).indexOf(PREFIX) === 0) markDirty(); };
  Storage.prototype.clear = function () { rawClear.apply(this, arguments); if (this === localStorage) markDirty(); };

  function flush() {
    clearTimeout(timer);
    if (!dirty) return Promise.resolve();
    dirty = false; lastSave = Date.now();
    try { rawSet.call(localStorage, 'mirazh.__flush', String(lastSave)); } catch (e) {}
    var p = plug('Preferences');
    return p ? p.set({ key: STORE, value: JSON.stringify({ v: 1, ts: lastSave, data: collect() }) }).catch(function () {}) : Promise.resolve();
  }
  function hardFlush() { dirty = true; return flush(); }

  function restore() {
    var p = plug('Preferences');
    if (!p) return Promise.resolve();
    return p.get({ key: STORE }).then(function (r) {
      if (!r || !r.value) return;
      var box; try { box = JSON.parse(r.value); } catch (e) { return; }
      if (!box || !box.data) return;
      var localTs = 0; try { localTs = parseInt(localStorage.getItem('mirazh.__flush') || '0', 10) || 0; } catch (e) {}
      if (localTs > (box.ts || 0)) return;
      restoring = true;
      Object.keys(box.data).forEach(function (k) { try { rawSet.call(localStorage, k, box.data[k]); } catch (e) {} });
      try { rawSet.call(localStorage, 'mirazh.__flush', String(box.ts || Date.now())); } catch (e) {}
      restoring = false; lastSave = box.ts || 0;
    }).catch(function () { restoring = false; });
  }

  /* ── вьюпорт ── */
  var subs = {};
  function emit(e) { (subs[e] || []).forEach(function (f) { try { f(); } catch (err) {} }); }
  function insets() {
    var r = document.documentElement;
    r.style.setProperty('--app-h', window.innerHeight + 'px');
    r.style.setProperty('--tg-top', '0px');
    r.style.setProperty('--tg-bot', '0px');
  }

  /* ── тактильная отдача ── */
  function impact(s) { var H = plug('Haptics'); if (H) H.impact({ style: ({ light: 'LIGHT', medium: 'MEDIUM', heavy: 'HEAVY', rigid: 'MEDIUM', soft: 'LIGHT' })[s] || 'LIGHT' }).catch(function () {}); }
  function notify(t) { var H = plug('Haptics'); if (H) H.notification({ type: ({ success: 'SUCCESS', warning: 'WARNING', error: 'ERROR' })[t] || 'SUCCESS' }).catch(function () {}); }

  /* ── Telegram-совместимый слой ── */
  var WA = {
    platform: 'android', version: '8.0', colorScheme: 'dark', isExpanded: true, isFullscreen: false,
    viewportHeight: innerHeight, viewportStableHeight: innerHeight,
    safeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
    contentSafeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
    themeParams: { bg_color: '#080b11', text_color: '#f6f1e4', hint_color: '#95a4b6', button_color: '#f0be4e', secondary_bg_color: '#151e2b' },
    ready: function () { var sp = plug('SplashScreen'); setTimeout(function () { if (sp) sp.hide({ fadeOutDuration: 250 }).catch(function () {}); }, 400); },
    expand: function () {}, close: function () { var A = plug('App'); if (A) A.exitApp(); },
    requestFullscreen: function () { emit('fullscreenChanged'); }, exitFullscreen: function () {},
    disableVerticalSwipes: function () {}, enableVerticalSwipes: function () {},
    enableClosingConfirmation: function () {}, disableClosingConfirmation: function () {},
    setHeaderColor: function (c) { var B = plug('StatusBar'); if (B) B.setBackgroundColor({ color: c }).catch(function () {}); },
    setBackgroundColor: function () {}, isVersionAtLeast: function () { return true; },
    onEvent: function (e, f) { (subs[e] = subs[e] || []).push(f); },
    offEvent: function (e, f) { if (subs[e]) subs[e] = subs[e].filter(function (x) { return x !== f; }); },
    HapticFeedback: { impactOccurred: impact, notificationOccurred: notify, selectionChanged: function () { impact('light'); } },
    openTelegramLink: function (u) {
      var t = ''; try { var x = new URL(u); t = x.searchParams.get('text') || u; } catch (e) { t = String(u); }
      shareText(t);
    },
    openLink: function (u) { shareText(String(u)); },
    showPopup: function (p, cb) {
      var D = plug('Dialog');
      if (!D) { if (cb) cb('ok'); return; }
      D.confirm({ title: p && p.title || 'Мираж', message: p && p.message || '', okButtonTitle: 'ОК', cancelButtonTitle: 'Отмена' })
        .then(function (r) { if (cb) cb(r && r.value ? 'ok' : 'cancel'); });
    }
  };
  window.Telegram = window.Telegram || {}; window.Telegram.WebApp = WA;

  /* ── тост ── */
  function toast(text, emoji) {
    var host = document.getElementById('toasts');
    if (!host) { host = document.createElement('div'); host.id = 'toasts'; document.body.appendChild(host); }
    var el = document.createElement('div');
    el.className = 'toast info'; el.style.position = 'relative'; el.style.zIndex = '400';
    el.innerHTML = '<div class="te">' + (emoji || '💾') + '</div><div><div class="tt">' + esc(text) + '</div></div>';
    host.appendChild(el); impact('light');
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }, 2100);
  }
  function copy(t) {
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast('Скопировано в буфер', '📋'); }, function () { toast('Буфер недоступен', '⚠️'); });
    else toast('Буфер недоступен', '⚠️');
  }
  function shareText(text) {
    var Sh = plug('Share');
    if (Sh) return Sh.share({ title: 'Весовщики: Мираж', text: text, dialogTitle: 'Поделиться' }).catch(function () {});
    if (navigator.share) return navigator.share({ title: 'Весовщики: Мираж', text: text }).catch(function () {});
    copy(text);
  }
  function confirmBox(title, message) {
    var D = plug('Dialog');
    if (D) return D.confirm({ title: title, message: message, okButtonTitle: 'Да', cancelButtonTitle: 'Отмена' })
      .then(function (r) { return !!(r && r.value); }).catch(function () { return false; });
    return Promise.resolve(window.confirm(title + '\n\n' + message));
  }
  function stamp() { var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); }; return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()); }

  /* ── резервные копии ── */
  function exportSave() {
    return hardFlush().then(function () {
      var json = JSON.stringify({ app: 'mirazh-weighers', v: 1, ts: Date.now(), data: collect() }, null, 2);
      var name = 'mirazh-save-' + stamp() + '.json';
      var FS = plug('Filesystem'), Sh = plug('Share');
      if (FS && Sh) {
        return FS.writeFile({ path: name, data: json, directory: 'CACHE', encoding: 'utf8', recursive: true })
          .then(function (r) { return Sh.share({ title: 'Сохранение — Мираж', text: 'Резервная копия прогресса.', files: [r.uri], dialogTitle: 'Сохранить копию' }); })
          .then(function () { toast('Копия отправлена', '📤'); })
          .catch(function () { copy(json); });
      }
      try {
        var b = new Blob([json], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        toast('Файл скачан', '📤');
      } catch (e) { copy(json); }
    });
  }
  function importSave() {
    var i = document.createElement('input');
    i.type = 'file'; i.accept = 'application/json,.json'; i.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(i);
    i.addEventListener('change', function () {
      var f = i.files && i.files[0]; i.remove(); if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var box; try { box = JSON.parse(String(fr.result)); } catch (e) { return toast('Файл повреждён', '⚠️'); }
        var d = box && box.data ? box.data : box;
        if (!d || typeof d !== 'object') return toast('Это не сохранение Миража', '⚠️');
        var keys = Object.keys(d).filter(function (k) { return k.indexOf(PREFIX) === 0; });
        if (!keys.length) return toast('В файле нет прогресса', '⚠️');
        confirmBox('Загрузить сохранение?', 'Текущий прогресс будет заменён данными из файла.').then(function (yes) {
          if (!yes) return;
          restoring = true;
          keys.forEach(function (k) { try { rawSet.call(localStorage, k, d[k]); } catch (e) {} });
          restoring = false; hardFlush().then(function () { location.reload(); });
        });
      };
      fr.onerror = function () { toast('Не удалось прочитать файл', '⚠️'); };
      fr.readAsText(f);
    });
    i.click();
  }
  function resetSave() {
    confirmBox('Сбросить весь прогресс?', 'Смены, копилка вахты и все трофеи будут удалены. Отменить нельзя.').then(function (yes) {
      if (!yes) return;
      var keys = []; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PREFIX) === 0) keys.push(k); }
      restoring = true; keys.forEach(function (k) { try { rawDel.call(localStorage, k); } catch (e) {} }); restoring = false;
      var p = plug('Preferences');
      Promise.resolve(p ? p.remove({ key: STORE }).catch(function () {}) : null).then(function () { location.reload(); });
    });
  }

  /* ── кнопка 💾 ── */
  var pt = 0;
  function pulse() { var b = document.getElementById('bFs'); if (!b) return; b.classList.add('mn-saving'); clearTimeout(pt); pt = setTimeout(function () { b.classList.remove('mn-saving'); }, 620); }
  function installButton() {
    var b = document.getElementById('bFs'); if (!b) return;
    b.textContent = '💾'; b.title = 'Сохранения'; b.onclick = function (e) { if (e) e.preventDefault(); openPanel(); };
  }

  /* ── экран сохранений ── */
  function styles() {
    if (document.getElementById('mn-css')) return;
    var s = document.createElement('style'); s.id = 'mn-css';
    s.textContent =
      'html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
      '.mn-saving{animation:mnP .62s ease}@keyframes mnP{0%{box-shadow:0 0 0 0 rgba(240,190,78,.55)}100%{box-shadow:0 0 0 14px rgba(240,190,78,0)}}' +
      '.mn-scrim{position:fixed;inset:0;z-index:300;background:rgba(3,5,9,.92);display:flex;justify-content:center;animation:mnF .2s ease}' +
      '@keyframes mnF{from{opacity:0}to{opacity:1}}' +
      '.mn-panel{width:100%;max-width:600px;display:flex;flex-direction:column;gap:10px;padding:calc(16px + env(safe-area-inset-top,0px)) 12px calc(14px + env(safe-area-inset-bottom,0px));background:radial-gradient(120% 70% at 8% -10%,rgba(240,190,78,.16),transparent 58%),linear-gradient(180deg,#0a0e15,#0d131c 60%,#080b11);animation:mnU .26s cubic-bezier(.2,.9,.3,1)}' +
      '@keyframes mnU{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
      '.mn-head{display:flex;align-items:center;gap:12px;padding:15px;border-radius:20px;border:1px solid rgba(240,190,78,.24);background:linear-gradient(140deg,rgba(240,190,78,.16),rgba(21,30,43,.95) 55%,rgba(212,99,58,.14));flex:0 0 auto}' +
      '.mn-head .e{font-size:32px}.mn-head b{display:block;font-size:21px;font-weight:900;color:#f6f1e4}.mn-head span{display:block;font-size:11.5px;color:#95a4b6;margin-top:4px;line-height:1.35}' +
      '.mn-body{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:9px;padding-right:5px;scrollbar-width:thin;scrollbar-color:#c58d24 rgba(255,255,255,.05)}' +
      '.mn-body::-webkit-scrollbar{width:9px}.mn-body::-webkit-scrollbar-track{background:rgba(255,255,255,.04);border-radius:99px}' +
      '.mn-body::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#f0be4e,#d4633a);border-radius:99px;border:2px solid transparent;background-clip:padding-box}' +
      '.mn-card{border-radius:16px;padding:13px;border:1px solid rgba(255,255,255,.09);background:linear-gradient(160deg,#1e2a39,#151e2b)}' +
      '.mn-card h4{margin:0 0 9px;font-size:10.5px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#f0be4e}' +
      '.mn-rows{display:grid;gap:6px;font-size:12.5px;color:#95a4b6}.mn-rows div{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed rgba(255,255,255,.09);padding-bottom:5px}.mn-rows b{color:#f6f1e4;font-variant-numeric:tabular-nums}' +
      '.mn-note{font-size:11.5px;line-height:1.5;color:#95a4b6;border-radius:14px;padding:12px;background:rgba(92,172,239,.08);border:1px dashed rgba(92,172,239,.3)}' +
      '.mn-btn{display:flex;align-items:center;gap:12px;width:100%;min-height:66px;padding:12px 14px;text-align:left;border-radius:16px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,#27364a,#1e2a39);color:#f6f1e4;font-family:inherit;font-size:14.5px;font-weight:900;cursor:pointer;transition:transform .1s}' +
      '.mn-btn:active{transform:scale(.975)}' +
      '.mn-btn .i{width:44px;height:44px;flex:0 0 44px;border-radius:13px;display:grid;place-items:center;font-size:22px;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.07)}' +
      '.mn-btn .t{flex:1;min-width:0}.mn-btn .t small{display:block;font-size:10.5px;font-weight:700;color:#95a4b6;margin-top:4px;line-height:1.3}' +
      '.mn-btn.ok{border-color:rgba(79,192,109,.5);background:linear-gradient(160deg,#2f7a4b,#1f5334)}' +
      '.mn-btn.warn{border-color:rgba(240,190,78,.5);background:linear-gradient(160deg,rgba(240,190,78,.24),rgba(240,190,78,.08));color:#ffeec2}' +
      '.mn-btn.bad{border-color:rgba(234,77,64,.5);background:linear-gradient(160deg,#8f2f26,#5f1f19)}' +
      '.mn-close{flex:0 0 auto;min-height:54px;border-radius:15px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#95a4b6;font-family:inherit;font-size:14.5px;font-weight:900;cursor:pointer}' +
      '.mn-live{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:900;color:#a8e850;padding:5px 10px;border-radius:999px;background:rgba(168,232,80,.13);border:1px solid rgba(168,232,80,.4)}' +
      '.mn-live i{width:6px;height:6px;border-radius:50%;background:#a8e850;box-shadow:0 0 8px #a8e850}';
    document.head.appendChild(s);
  }
  function fmt(ts) { if (!ts) return 'ещё не сохранялось'; var d = new Date(ts), p = function (n) { return String(n).padStart(2, '0'); }; return p(d.getDate()) + '.' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }

  function openPanel() {
    if (panel) return;
    styles(); hardFlush(); impact('medium');
    var s = G(), c = K(), d = collect(), bytes = 0;
    Object.keys(d).forEach(function (k) { bytes += (d[k] || '').length + k.length; });
    var who = s && s.char ? (s.char === 'sasha' ? 'Саша' : 'Валера') : '—';
    panel = document.createElement('div');
    panel.className = 'mn-scrim';
    panel.innerHTML =
      '<div class="mn-panel"><div class="mn-head"><div class="e">💾</div><div><b>Сохранения</b><span>Прогресс пишется автоматически после каждого действия</span></div></div>' +
      '<div class="mn-body">' +
      '<div class="mn-card"><h4>Текущий прогресс</h4><div class="mn-rows">' +
      '<div><span>Весовщик</span><b>' + esc(who) + '</b></div>' +
      '<div><span>Машины за смену</span><b>' + (s ? s.prog : 0) + ' / 60</b></div>' +
      '<div><span>Деньги</span><b>' + (s ? Math.round(s.money) : 0) + ' ₽</b></div>' +
      '<div><span>Копилка вахты</span><b>' + (c ? Math.round(c.wMoney) : 0) + ' ₽</b></div>' +
      '<div><span>Отработано смен</span><b>' + (c ? c.shifts : 0) + '</b></div>' +
      '<div><span>Трофеи</span><b>' + (c && c.ach ? Object.keys(c.ach).length : 0) + '</b></div></div></div>' +
      '<div class="mn-card"><h4>Хранилище</h4><div class="mn-rows">' +
      '<div><span>Способ</span><b>' + (native() ? 'Android + WebView' : 'Браузер') + '</b></div>' +
      '<div><span>Последняя запись</span><b>' + fmt(lastSave) + '</b></div>' +
      '<div><span>Размер</span><b>' + (bytes / 1024).toFixed(1) + ' КБ</b></div>' +
      '<div><span>Статус</span><span class="mn-live"><i></i>Автосохранение</span></div></div></div>' +
      '<button class="mn-btn ok" data-a="export"><span class="i">📤</span><span class="t">Сделать резервную копию<small>Отправить файл в мессенджер, на диск или в почту</small></span></button>' +
      '<button class="mn-btn warn" data-a="import"><span class="i">📥</span><span class="t">Загрузить из файла<small>Восстановить прогресс на новом телефоне</small></span></button>' +
      '<button class="mn-btn" data-a="copy"><span class="i">📋</span><span class="t">Скопировать код сохранения<small>Текстовая копия в буфер обмена</small></span></button>' +
      '<div class="mn-note">Сохранение переживает закрытие игры, перезагрузку телефона и обновление приложения. Удаляется только вместе с данными приложения — перед переустановкой сделай копию.</div>' +
      '<button class="mn-btn bad" data-a="reset"><span class="i">🗑</span><span class="t">Сбросить прогресс<small>Смены, копилка и трофеи начнутся с нуля</small></span></button>' +
      '</div><button class="mn-close" data-a="close">Закрыть</button></div>';
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-a]');
      if (!t) { if (e.target === panel) closePanel(); return; }
      impact('light');
      var a = t.getAttribute('data-a');
      if (a === 'close') closePanel();
      else if (a === 'export') exportSave();
      else if (a === 'import') importSave();
      else if (a === 'copy') copy(JSON.stringify({ app: 'mirazh-weighers', v: 1, ts: Date.now(), data: collect() }));
      else if (a === 'reset') resetSave();
    });
    document.body.appendChild(panel);
  }
  function closePanel() { if (!panel) return; var el = panel; panel = null; el.style.animation = 'mnF .18s ease reverse'; setTimeout(function () { el.remove(); }, 170); }

  /* ── назад / жизненный цикл ── */
  function back() {
    if (panel) return closePanel();
    var s = G(); if (!s) return quit();
    if (s.screen === 'rules' || s.screen === 'tro' || s.screen === 'end') { if (window.toStart) window.toStart(); return; }
    if (s.screen === 'game') {
      if (s.view === 'shop') { if (window.closeShop) window.closeShop(); return; }
      if (s.view === 'mini') { toast('Сначала проведи документ в 1С', '🖥'); return; }
      if (s.view === 'choice') { toast('Нужно выбрать вариант', '👉'); return; }
      if (s.view === 'event') { if (window.cont) window.cont(); return; }
      if (s.view === 'sleep' || s.view === 'sleepResult') { if (window.wake) window.wake(); return; }
      confirmBox('Выйти в меню?', 'Смена сохранится, прогресс не потеряется.').then(function (y) { if (y && window.toStart) { hardFlush(); window.toStart(); } });
      return;
    }
    quit();
  }
  function quit() {
    hardFlush().then(function () {
      confirmBox('Выйти из игры?', 'Прогресс сохранён автоматически.').then(function (y) {
        if (!y) return; var A = plug('App'); if (A) A.exitApp(); else window.close();
      });
    });
  }
  function bind() {
    var A = plug('App');
    if (A) {
      A.addListener('backButton', back);
      A.addListener('appStateChange', function (st) { if (!st.isActive) hardFlush(); else { insets(); emit('viewportChanged'); } });
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) hardFlush(); });
    addEventListener('pagehide', hardFlush);
    addEventListener('resize', function () { WA.viewportHeight = WA.viewportStableHeight = innerHeight; insets(); emit('viewportChanged'); }, { passive: true });
    addEventListener('orientationchange', function () { setTimeout(function () { WA.viewportStableHeight = innerHeight; insets(); emit('viewportChanged'); }, 220); }, { passive: true });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { if (!/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) e.preventDefault(); });
    var B = plug('StatusBar');
    if (B) { B.setOverlaysWebView({ overlay: false }).catch(function () {}); B.setBackgroundColor({ color: '#080b11' }).catch(function () {}); B.setStyle({ style: 'DARK' }).catch(function () {}); }
  }

  /* ── запуск ── */
  function fatal(m) {
    document.body.innerHTML = '<div style="position:fixed;inset:0;display:grid;place-items:center;padding:28px;text-align:center;background:#080b11;color:#f6f1e4;font-family:system-ui,sans-serif"><div><div style="font-size:56px">🏗</div><h2 style="margin:14px 0 8px;font-size:22px;font-weight:900;color:#f0be4e">Объект «Мираж»</h2><p style="margin:0;font-size:14px;line-height:1.5;color:#95a4b6">' + esc(m) + '</p></div></div>';
    var sp = plug('SplashScreen'); if (sp) sp.hide().catch(function () {});
  }
  function loadGame() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script');
    s.src = 'game.js'; s.onerror = function () { fatal('Не удалось загрузить game.js'); };
    document.body.appendChild(s);
    setTimeout(function () { installButton(); window.fsBtn = openPanel; insets(); emit('viewportChanged'); }, 60);
    setTimeout(installButton, 800);
  }

  window.MIRAZH = { flush: hardFlush, export: exportSave, import: importSave, reset: resetSave, panel: openPanel, isNative: native };

  styles(); insets();
  var t0 = Date.now();
  (function wait() {
    if (plug('Preferences') || !native() || Date.now() - t0 > 2500) {
      restore().then(bind, bind).then(function () {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadGame, { once: true });
        else loadGame();
      });
    } else setTimeout(wait, 40);
  })();
})();