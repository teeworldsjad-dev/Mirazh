#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Одна команда — готовый APK.
   node build.mjs            → debug (или release, если есть ключ)
   node build.mjs --release  → требовать ключ подписи
   node build.mjs --web-only → только собрать www/
   node build.mjs --keygen   → создать ключ подписи
   Флаги: --ci --game <путь>
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const APK_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(APK_DIR, '..');
const WWW = path.join(APK_DIR, 'www');
const AND = path.join(APK_DIR, 'android');
const DIST = path.join(APK_DIR, 'dist');
const WIN = process.platform === 'win32';

const argv = process.argv.slice(2);
const flag = n => argv.includes('--' + n);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };

const CI = flag('ci') || !!process.env.GITHUB_ACTIONS;
const WEB_ONLY = flag('web-only');
const KEYGEN = flag('keygen');
const FORCE_RELEASE = flag('release');
const GAME_DIR = path.resolve(APK_DIR, opt('game', ROOT));

const C = { sand: '#f0be4e', rust: '#d4633a', night: '#080b11', asphalt: '#0d131c', diesel: '#3f8d9f', muted: '#95a4b6' };
const log = (...a) => console.log(...a);
const ok = (...a) => console.log('\x1b[32m✓\x1b[0m', ...a);
const warn = (...a) => console.log('\x1b[33m!\x1b[0m', ...a);
const die = (...a) => { console.error('\x1b[31m✗\x1b[0m', ...a); process.exit(1); };
const has = p => fs.access(p).then(() => true).catch(() => false);
const sh = (cmd, args, cwd = APK_DIR) => {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: WIN, env: process.env });
  if (r.status !== 0) die(`${cmd} ${args.join(' ')} — код ${r.status}`);
};

/* ───────────────────────── КЛЮЧ ПОДПИСИ ───────────────────────── */
if (KEYGEN) {
  const store = path.join(APK_DIR, 'mirazh.keystore');
  const props = path.join(APK_DIR, 'keystore.properties');
  if (await has(props)) { ok('keystore.properties уже существует'); process.exit(0); }
  const pass = crypto.randomBytes(18).toString('base64url');
  const r = spawnSync('keytool', ['-genkeypair', '-v', '-keystore', store, '-alias', 'mirazh',
    '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-storepass', pass, '-keypass', pass,
    '-dname', 'CN=Mirazh Weighers, OU=Games, O=Mirazh, C=RU'], { stdio: 'inherit', shell: WIN });
  if (r.status !== 0) die('keytool не найден — установи JDK 21 и добавь его bin в PATH');
  await fs.writeFile(props, `storeFile=${store.replace(/\\/g, '/')}\nstorePassword=${pass}\nkeyAlias=mirazh\nkeyPassword=${pass}\n`, 'utf8');
  ok('Ключ создан:', path.basename(store));
  log('\n  Сохни mirazh.keystore и keystore.properties — без них нельзя выпустить обновление.');
  log('  Для облачной сборки положи их в Secrets репозитория:');
  log('    KEYSTORE_BASE64   = base64 от файла mirazh.keystore');
  log('    KEYSTORE_PASSWORD = пароль из keystore.properties');
  log('    KEY_ALIAS         = mirazh');
  log('\n  base64:  base64 -w0 mirazh.keystore   (Linux/macOS)');
  log('           certutil -encode mirazh.keystore out.txt   (Windows)');
  process.exit(0);
}

/* ───────────────────────── 1. ВЕБ-ЧАСТЬ ───────────────────────── */
log('\n\x1b[1m▸ Шаг 1/6 · Веб-часть\x1b[0m');

const idxPath = path.join(GAME_DIR, 'index.html');
if (!await has(idxPath)) die(`Не найден ${idxPath}\n  Положи игру в корень репозитория или укажи: npm run apk -- --game ../mirazh`);
let html = await fs.readFile(idxPath, 'utf8');
if (!/Мираж|Весовщики|mirazh/i.test(html)) die('index.html не похож на игру «Мираж»');

await fs.rm(WWW, { recursive: true, force: true });
await fs.mkdir(WWW, { recursive: true });

const inline = [...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => ({ raw: m[0], code: m[1] })).sort((a, b) => b.code.length - a.code.length);

let game = null, shell = html;
if (inline.length && inline[0].code.length > 2000) {
  game = inline[0].code;
  shell = shell.replace(inline[0].raw, '<!--GAME-->');
} else {
  for (const f of ['game.js', 'app.js', 'main.js']) {
    const p = path.join(GAME_DIR, f);
    if (await has(p)) {
      game = await fs.readFile(p, 'utf8');
      shell = shell.replace(new RegExp(`<script[^>]*src=["']${f}["'][^>]*>\\s*</script>`, 'i'), '<!--GAME-->');
      break;
    }
  }
}
if (!game) die('В index.html не найден код игры');

const names = await fs.readdir(GAME_DIR);
const contentRe = /^(cards|events|shop|rules)-\d+\.js$/i;
const content = names.filter(n => contentRe.test(n)).sort();
for (const n of content) await fs.copyFile(path.join(GAME_DIR, n), path.join(WWW, n));
const MAXF = Math.max(1, ...content.map(n => parseInt((n.match(/-(\d+)\.js$/) || [0, 1])[1], 10)));

for (const dir of ['assets', 'img', 'audio', 'fonts']) {
  const p = path.join(GAME_DIR, dir);
  if (await has(p)) await fs.cp(p, path.join(WWW, dir), { recursive: true });
}

game = game
  .replace(/const\s+MAXF\s*=\s*\d+/, `const MAXF=${MAXF}`)
  .replace(/⛶\s*Во весь экран/g, '💾 Сохранения')
  .replace(/Обнови Telegram до последней версии\./g, 'Полный экран управляется системой Android.')
  .replace(/Панель управления внизу — Telegram её не перекрывает\./g, 'Автосохранение включено. Резервная копия — кнопка 💾.');

shell = shell
  .replace(/<script[^>]*src=["'][^"']*telegram-web-app[^"']*["'][^>]*>\s*<\/script>/gi, '')
  .replace(/<title>[\s\S]*?<\/title>/i, '<title>Весовщики: Мираж</title>');
if (!/name="color-scheme"/i.test(shell)) {
  shell = shell.replace(/<head([^>]*)>/i, '<head$1>\n<meta name="color-scheme" content="dark">\n<meta name="format-detection" content="telephone=no">');
}
shell = shell.replace('<!--GAME-->', '<script src="native-bridge.js"></script>');
if (!shell.includes('native-bridge.js')) shell = shell.replace(/<\/body>/i, '<script src="native-bridge.js"></script>\n</body>');

await fs.writeFile(path.join(WWW, 'index.html'), shell, 'utf8');
await fs.writeFile(path.join(WWW, 'game.js'), game, 'utf8');
await fs.copyFile(path.join(APK_DIR, 'native-bridge.js'), path.join(WWW, 'native-bridge.js'));
await fs.writeFile(path.join(WWW, 'build-info.json'), JSON.stringify({
  builtAt: new Date().toISOString(), platform: 'android', content, maxContentIndex: MAXF
}, null, 2), 'utf8');

ok(`www/ · контент: ${content.length} файл(ов) · MAXF=${MAXF}`);
if (WEB_ONLY) { ok('Готово (--web-only)'); process.exit(0); }

/* ───────────────────────── 2. ГРАФИКА ───────────────────────── */
log('\n\x1b[1m▸ Шаг 2/6 · Иконки и заставка\x1b[0m');
const sharp = (await import('sharp')).default;
const ASSETS = path.join(APK_DIR, 'assets');
await fs.mkdir(ASSETS, { recursive: true });

const beam = `<path d="M-330 -300 L-90 -300 L150 250 L-120 250 Z" fill="${C.sand}" opacity=".13"/>`;
const ticks = Array.from({ length: 11 }, (_, i) => `<rect x="${-268 + i * 54}" y="180" width="8" height="22" rx="4"/>`).join('');
const art = `<g transform="translate(512 512)">
  ${beam}
  <rect x="-300" y="168" width="600" height="46" rx="12" fill="#1e2a39" stroke="${C.sand}" stroke-width="7"/>
  <rect x="-300" y="214" width="600" height="20" rx="8" fill="${C.asphalt}"/>
  <g fill="${C.sand}" opacity=".85">${ticks}</g>
  <path d="M-244 150 L-244 -26 L-40 -70 L104 -70 L104 150 Z" fill="${C.rust}"/>
  <path d="M-244 -26 L-40 -70 L104 -70 L104 -34 L-40 -34 L-244 6 Z" fill="#e8794c" opacity=".55"/>
  <path d="M-232 -12 L-46 -52 L92 -52 L92 -40 L-46 -40 L-232 -2 Z" fill="${C.sand}" opacity=".5"/>
  <rect x="112" y="-8" width="128" height="158" rx="16" fill="#27364a" stroke="${C.sand}" stroke-width="6"/>
  <rect x="130" y="10" width="92" height="62" rx="10" fill="${C.diesel}" opacity=".85"/>
  <rect x="130" y="10" width="92" height="62" rx="10" fill="none" stroke="${C.sand}" stroke-width="4"/>
  <rect x="112" y="96" width="128" height="12" fill="${C.sand}" opacity=".35"/>
  <circle cx="-160" cy="158" r="46" fill="${C.asphalt}" stroke="${C.sand}" stroke-width="8"/><circle cx="-160" cy="158" r="17" fill="#27364a"/>
  <circle cx="34" cy="158" r="46" fill="${C.asphalt}" stroke="${C.sand}" stroke-width="8"/><circle cx="34" cy="158" r="17" fill="#27364a"/>
  <circle cx="182" cy="158" r="40" fill="${C.asphalt}" stroke="${C.sand}" stroke-width="8"/><circle cx="182" cy="158" r="15" fill="#27364a"/>
  <rect x="236" y="24" width="20" height="34" rx="6" fill="${C.sand}"/>
  <g fill="${C.sand}" opacity=".7"><circle cx="-268" cy="112" r="9"/><circle cx="-286" cy="146" r="6"/><circle cx="-256" cy="150" r="5"/></g>
  <g transform="translate(-4 -206)">
    <rect x="-150" y="-58" width="300" height="104" rx="18" fill="${C.asphalt}" stroke="${C.sand}" stroke-width="7"/>
    <text x="0" y="18" text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif" font-size="62" font-weight="bold" fill="${C.sand}">35 т</text>
  </g>
</g>`;

const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.asphalt}"/><stop offset=".58" stop-color="${C.night}"/><stop offset="1" stop-color="#05070b"/></linearGradient>
    <radialGradient id="a" cx="18%" cy="8%" r="82%"><stop offset="0" stop-color="${C.sand}" stop-opacity=".26"/><stop offset=".6" stop-color="${C.sand}" stop-opacity="0"/></radialGradient>
    <radialGradient id="r" cx="92%" cy="96%" r="72%"><stop offset="0" stop-color="${C.rust}" stop-opacity=".3"/><stop offset=".65" stop-color="${C.rust}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#b)"/><rect width="1024" height="1024" fill="url(#a)"/><rect width="1024" height="1024" fill="url(#r)"/>
</svg>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${bgSvg.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(512 512) scale(.78) translate(-512 -512)">${art}</g></svg>`;
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><g transform="translate(512 512) scale(.62) translate(-512 -512)">${art}</g></svg>`;
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <defs><linearGradient id="sb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.asphalt}"/><stop offset=".56" stop-color="${C.night}"/><stop offset="1" stop-color="#05070b"/></linearGradient>
  <radialGradient id="sa" cx="20%" cy="14%" r="80%"><stop offset="0" stop-color="${C.sand}" stop-opacity=".2"/><stop offset=".62" stop-color="${C.sand}" stop-opacity="0"/></radialGradient></defs>
  <rect width="2732" height="2732" fill="url(#sb)"/><rect width="2732" height="2732" fill="url(#sa)"/>
  <g transform="translate(1366 1200) translate(-512 -512)">${art}</g>
  <g text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif">
    <text x="1366" y="2010" font-size="132" font-weight="bold" fill="${C.sand}" letter-spacing="14">МИРАЖ</text>
    <text x="1366" y="2108" font-size="58" fill="${C.muted}" letter-spacing="20">ВЕСОВЩИКИ</text>
  </g>
</svg>`;

const render = async (svg, file, size) => {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(ASSETS, file));
};
await render(iconSvg, 'icon.png', 1024);
await render(fgSvg, 'icon-foreground.png', 1024);
await render(bgSvg, 'icon-background.png', 1024);
await render(splashSvg, 'splash.png', 2732);
await render(splashSvg, 'splash-dark.png', 2732);
ok('assets/ · icon + splash');

/* ───────────────────────── 3. НАТИВНЫЙ ПРОЕКТ ───────────────────────── */
log('\n\x1b[1m▸ Шаг 3/6 · Android-проект\x1b[0m');
if (!await has(path.join(AND, 'gradlew'))) {
  sh('npx', ['cap', 'add', 'android']);
  ok('android/ создан');
} else ok('android/ уже существует');

sh('npx', ['cap', 'sync', 'android']);
ok('cap sync');

try {
  sh('npx', ['@capacitor/assets', 'generate', '--android',
    '--iconBackgroundColor', C.night, '--iconBackgroundColorDark', C.night,
    '--splashBackgroundColor', C.night, '--splashBackgroundColorDark', C.night]);
  ok('иконки разложены по плотностям');
} catch { warn('capacitor-assets не отработал — останутся стандартные иконки'); }

/* ───────────────────────── 4. ПАТЧ ANDROID ───────────────────────── */
log('\n\x1b[1m▸ Шаг 4/6 · Настройки приложения\x1b[0m');
const pkg = JSON.parse(await fs.readFile(path.join(APK_DIR, 'package.json'), 'utf8'));
const [maj, min, pat] = String(pkg.version).split('.').map(n => parseInt(n, 10) || 0);
const versionCode = maj * 10000 + min * 100 + pat;
const keyProps = path.join(APK_DIR, 'keystore.properties');
const hasKey = await has(keyProps);
if (FORCE_RELEASE && !hasKey) die('Нет keystore.properties. Создай ключ: npm run keygen');
const RELEASE = hasKey;

async function edit(rel, fn) {
  const p = path.join(AND, rel);
  if (!await has(p)) { warn('пропущен', rel); return; }
  const before = await fs.readFile(p, 'utf8');
  const after = fn(before);
  if (after !== before) { await fs.writeFile(p, after, 'utf8'); ok(rel); }
}

await edit('app/src/main/res/values/strings.xml', s => s
  .replace(/<string name="app_name">[\s\S]*?<\/string>/, '<string name="app_name">Весовщики: Мираж</string>')
  .replace(/<string name="title_activity_main">[\s\S]*?<\/string>/, '<string name="title_activity_main">Весовщики: Мираж</string>'));

await edit('variables.gradle', s => s
  .replace(/minSdkVersion\s*=\s*\d+/, 'minSdkVersion = 23')
  .replace(/compileSdkVersion\s*=\s*\d+/, 'compileSdkVersion = 35')
  .replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 35'));

await edit('app/src/main/AndroidManifest.xml', s => {
  if (!/android.permission.VIBRATE/.test(s))
    s = s.replace(/<manifest([^>]*)>/, '<manifest$1>\n    <uses-permission android:name="android.permission.VIBRATE" />');
  s = s.replace(/<application([^>]*)>/, (m, a) => {
    if (!/android:hardwareAccelerated/.test(a)) a += ' android:hardwareAccelerated="true"';
    if (!/android:usesCleartextTraffic/.test(a)) a += ' android:usesCleartextTraffic="false"';
    return '<application' + a + '>';
  });
  s = s.replace(/<activity([\s\S]*?)>/, (m, a) => {
    a = /android:screenOrientation/.test(a)
      ? a.replace(/android:screenOrientation="[^"]*"/, 'android:screenOrientation="portrait"')
      : a + ' android:screenOrientation="portrait"';
    return '<activity' + a + '>';
  });
  return s;
});

await edit('app/src/main/res/values/styles.xml', s => s
  .replace(/(<style name="AppTheme\.NoActionBar"[\s\S]*?>)([\s\S]*?)(<\/style>)/, (m, o, b, c) => {
    ['android:statusBarColor', 'android:navigationBarColor', 'android:windowLightStatusBar', 'android:windowBackground']
      .forEach(k => { b = b.replace(new RegExp(`\\s*<item name="${k}">[\\s\\S]*?</item>`), ''); });
    return o + b.replace(/\s*$/, '') +
      `\n        <item name="android:statusBarColor">${C.night}</item>` +
      `\n        <item name="android:navigationBarColor">${C.night}</item>` +
      `\n        <item name="android:windowLightStatusBar">false</item>` +
      `\n        <item name="android:windowBackground">${C.night}</item>\n    ` + c;
  }));

await edit('app/build.gradle', s => {
  s = s.replace(/versionCode\s+\d+/, 'versionCode ' + versionCode)
       .replace(/versionName\s+"[^"]*"/, `versionName "${pkg.version}"`);
  if (!s.includes('// mirazh-signing')) {
    s = `// mirazh-signing
def ksProps = new Properties()
def ksFile = rootProject.file("../keystore.properties")
if (ksFile.exists()) { ksProps.load(new FileInputStream(ksFile)) }

` + s;
    s = s.replace(/android\s*\{/, `android {
    signingConfigs {
        mirazhRelease {
            if (ksFile.exists()) {
                storeFile file(ksProps["storeFile"])
                storePassword ksProps["storePassword"]
                keyAlias ksProps["keyAlias"]
                keyPassword ksProps["keyPassword"]
            }
        }
    }`);
    s = s.replace(/buildTypes\s*\{([\s\S]*?)\n    \}/, (m, body) => {
      let b = body;
      if (/release\s*\{/.test(b)) {
        if (!/signingConfig signingConfigs\.mirazhRelease/.test(b))
          b = b.replace(/release\s*\{/, 'release {\n            if (ksFile.exists()) { signingConfig signingConfigs.mirazhRelease }');
      } else {
        b += `\n        release {
            if (ksFile.exists()) { signingConfig signingConfigs.mirazhRelease }
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }`;
      }
      return 'buildTypes {' + b + '\n    }';
    });
  }
  return s;
});

await edit('gradle.properties', s => {
  s = /org.gradle.jvmargs/.test(s)
    ? s.replace(/org.gradle.jvmargs=.*/, 'org.gradle.jvmargs=-Xmx2560m -Dfile.encoding=UTF-8')
    : s + '\norg.gradle.jvmargs=-Xmx2560m -Dfile.encoding=UTF-8\n';
  if (!/org.gradle.parallel/.test(s)) s += 'org.gradle.parallel=true\n';
  return s;
});

await edit('app/src/main/assets/capacitor.config.json', s => {
  try { const j = JSON.parse(s); j.android = j.android || {}; j.android.webContentsDebuggingEnabled = !RELEASE; return JSON.stringify(j, null, 2); }
  catch { return s; }
});

ok(`версия ${pkg.version} (${versionCode}) · ${RELEASE ? 'RELEASE, подписан' : 'DEBUG'}`);

/* ───────────────────────── 5. СБОРКА ───────────────────────── */
log('\n\x1b[1m▸ Шаг 5/6 · Gradle\x1b[0m');
const wrapper = path.join(AND, WIN ? 'gradlew.bat' : 'gradlew');
if (!WIN) await fs.chmod(wrapper, 0o755);
const task = RELEASE ? 'assembleRelease' : 'assembleDebug';
const args = [task, '--no-daemon', '--warning-mode=none'];
if (CI) args.push('--console=plain');
const g = spawnSync(wrapper, args, { cwd: AND, stdio: 'inherit', shell: WIN });
if (g.status !== 0) die('Gradle завершился с ошибкой');

/* ───────────────────────── 6. РЕЗУЛЬТАТ ───────────────────────── */
log('\n\x1b[1m▸ Шаг 6/6 · Готовый файл\x1b[0m');
const src = path.join(AND, 'app/build/outputs/apk', RELEASE ? 'release' : 'debug',
  RELEASE ? 'app-release.apk' : 'app-debug.apk');
if (!await has(src)) die('APK не найден: ' + src);
await fs.mkdir(DIST, { recursive: true });
const outName = `mirazh-${pkg.version}-${RELEASE ? 'release' : 'debug'}.apk`;
const out = path.join(DIST, outName);
await fs.copyFile(src, out);
const mb = ((await fs.stat(out)).size / 1048576).toFixed(1);

log('\n\x1b[32m╔════════════════════════════════════════════════╗');
log('║  ГОТОВО                                        ║');
log('╚════════════════════════════════════════════════╝\x1b[0m');
log(`\n  ${out}`);
log(`  ${mb} МБ · ${RELEASE ? 'подписанный релиз' : 'отладочная сборка'}\n`);
log('  Установка:  adb install -r "' + out + '"');
log('  Или просто скинь APK на телефон и открой файл.\n');