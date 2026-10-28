// kho-moi-cai-goi-road-map.test.mjs — hồ sơ kho-moi-cai-goi-road-map (hàng RM4, nấc 2 của ADR 0025), ca KM-<n> = AC-n của
// hợp đồng (AC-9 ở kho-moi-cai-goi-road-map-cac-kho.mjs). Mỗi eval của evals.yaml ghim đúng dòng «PASS: KM-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm; config.yaml rút từ khối ```yaml của
// commands/acceptance-init.md khi ca nói «theo khuôn»). Lệnh khởi tạo rút NGUYÊN VĂN từ khối INIT-LO-TRINH; khoá bật rút từ
// .claude-plugin/marketplace.json của cây đang đo. Giá trị mong đợi viết sẵn trong ca. «Bộ máy gốc» = `git archive <gốc so>`
// bung trong lượt, gốc so đọc từ _acceptance/kho-moi-cai-goi-road-map/goc-so. Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật
// (mỗi nhát tiêm khớp đúng một lần), SAU khi bản lành xanh trên cùng khuôn kho thử, và ghim thông điệp. Mọi đường dẫn suy
// từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, readdirSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'kho-moi-cai-goi-road-map', 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'km-rm4-')));
const DICH = 'docs/plan/lo-trinh.json';
const CHUA_CAI = 'kho chưa cài road-map ở phạm vi kho — không tạo lộ trình';
const DA_SAN = 'lộ trình đã sẵn — không đổi gì';
const LECH = 'bản chép khác bản gói — chép lại theo đợt phát hành';
const CHUA_CO_VIEC = 'Hàng kế: Lộ trình chưa có việc nào — thêm việc bằng skill cắt lượt (/acceptance-gate:cat-luot), rồi mở bằng /feature-loop:feature-loop <mã>';
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.KM_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude'), { recursive: true });
const maDaThay = new Set();
let seq = 0;

// ── Khối máy đọc ─────────────────────────────────────────────────────────────
const khoi = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const lenhInit = kit => {
  const b = khoi(readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8'), 'INIT-LO-TRINH');
  if (b == null) throw new Error('không rút được khối INIT-LO-TRINH');
  const d = b.split('\n').map(x => x.trim()).filter(x => x.startsWith('node "${CLAUDE_PLUGIN_ROOT}/scripts/lo-trinh-khoi-tao.mjs"'));
  if (d.length !== 1) throw new Error(`khối INIT-LO-TRINH có ${d.length} dòng lệnh`);
  return d[0];
};
const khoaBat = kit => {
  const j = JSON.parse(readFileSync(path.join(kit, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const p = j.plugins.find(x => x.name === 'road-map');
  if (!p) throw new Error('marketplace.json không có gói road-map');
  return `${p.name}@${j.name}`;
};
const khuonCfg = () => {
  const m = readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8').match(/```yaml\n([\s\S]*?)```/);
  if (!m) throw new Error('không rút được khối cấu hình ```yaml của acceptance-init.md');
  return m[1];
};
writeFileSync(path.join(HOME, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [khoaBat(KIT)]: true } }));

// ── Kho thử ──────────────────────────────────────────────────────────────────
// cfg: chuỗi config (mặc định khuôn khởi tạo) · settings/local: object hoặc chuỗi thô · ten: tên thư mục kho.
function kho({ ten = 'kho', cfg = null, settings = undefined, local = undefined, tep = {} } = {}) {
  const goc = path.join(TMP, `k${++seq}`, ten); mkdirSync(path.join(goc, '_acceptance'), { recursive: true });
  git(goc, 'init', '-q'); git(goc, 'config', 'user.email', 't@t'); git(goc, 'config', 'user.name', 't');
  writeFileSync(path.join(goc, '_acceptance', 'config.yaml'), cfg ?? khuonCfg());
  const s = (f, v) => { if (v === undefined) return; mkdirSync(path.join(goc, '.claude'), { recursive: true }); writeFileSync(path.join(goc, '.claude', f), typeof v === 'string' ? v : JSON.stringify(v, null, 2)); };
  s('settings.json', settings); s('settings.local.json', local);
  for (const [p, v] of Object.entries(tep)) { mkdirSync(path.dirname(path.join(goc, p)), { recursive: true }); writeFileSync(path.join(goc, p), v); }
  git(goc, 'add', '-A'); git(goc, 'commit', '-qm', 'khoi', '--allow-empty');
  return goc;
}
const bat = kit => ({ enabledPlugins: { [khoaBat(kit)]: true } });
function chay(kit, goc) {
  const lenh = lenhInit(kit).split('${CLAUDE_PLUGIN_ROOT}').join(kit).split('<path>').join(`'${goc}'`);
  const r = spawnSync('bash', ['-c', lenh], { encoding: 'utf8', env: { ...process.env, HOME }, cwd: goc });
  maDaThay.add(r.status);
  return r;
}
function bam(goc) {
  const h = createHash('sha256'); const di = d => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '.git') continue; const p = path.join(d, e.name);
      if (e.isDirectory()) di(p); else h.update(path.relative(goc, p) + '\0').update(readFileSync(p)).update('\0');
    }
  }; di(goc); return h.digest('hex');
}
const dsTep = goc => { const ra = []; const di = d => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.name === '.git') continue; const p = path.join(d, e.name); if (e.isDirectory()) di(p); else ra.push(path.relative(goc, p)); } }; di(goc); return ra.sort(); };
const commit = goc => { git(goc, 'add', '-A'); git(goc, 'commit', '-qm', 'k', '--allow-empty'); };
const check = (kit, goc) => node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', goc, '--check']);

// ── Bản sao của vật (ca đỏ) ──────────────────────────────────────────────────
const MA = ['scripts', 'lib', 'skills', 'commands', 'road-map', '.claude-plugin'];
function banSao(tiem, sua = null) {
  const d = path.join(TMP, `mut${++seq}`);
  for (const m of MA) cpSync(path.join(KIT, m), path.join(d, m), { recursive: true });
  for (const [f, cu, moi] of tiem) {
    const p = path.join(d, f); const t = readFileSync(p, 'utf8'); const n = t.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${f} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, t.replace(cu, moi));
  }
  if (sua) sua(d);
  return d;
}
function banGoc() {
  const d = path.join(TMP, 'goc'); if (existsSync(d)) return d; mkdirSync(d);
  execFileSync('bash', ['-c', `git -C '${KIT}' archive ${GOC} ${MA.join(' ')} | tar -x -C '${d}'`]);
  return d;
}
const chayCa = (id, f) => { try { const s = f(); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = (id, f, mut, ghim) => {
  try { const s = f(mut); const g = s.find(x => x.includes(ghim)); if (g) ok(id, `bản sao bị bắt: «${g}»`); else bad(id, `hàm đo không bắt «${ghim}»: ${JSON.stringify(s)}`); } catch (e) { bad(id, loi(e)); }
};

// ── KM-1 — điều kiện bật ─────────────────────────────────────────────────────
const CA1 = kit => [
  ['khong-settings', {}, false],
  ['khong-khoa', { settings: { enabledPlugins: {} } }, false],
  ['khoa-false', { settings: { enabledPlugins: { [khoaBat(kit)]: false } } }, false],
  ['true-project', { settings: bat(kit) }, true],
  ['chi-local', { local: bat(kit) }, false],
  ['project-true-local-false', { settings: bat(kit), local: { enabledPlugins: { [khoaBat(kit)]: false } } }, true],
  ['hong', { settings: '{ "enabledPlugins": ' }, false],
];
function km1(kit) {
  const sai = [];
  for (const [ca, o, ghi] of CA1(kit)) {
    const goc = kho(o); const truoc = bam(goc); const r = chay(kit, goc); const sau = bam(goc);
    const coTep = existsSync(path.join(goc, DICH));
    if (ghi) {
      if (r.status !== 0) sai.push(`${ca}: thoát ${r.status} (${r.stderr.trim()})`);
      if (!coTep) sai.push(`${ca}: bật mà không ghi tệp — khoá bật không rút từ marketplace.json?`);
    } else if (ca === 'hong') {
      if (r.status !== 3) sai.push(`hong: thoát ${r.status}, cần 3`);
      if (!r.stderr.includes('.claude/settings.json')) sai.push('hong: stderr không nêu .claude/settings.json');
      if (truoc !== sau) sai.push('hong: cây đổi');
    } else {
      if (coTep) sai.push(ca === 'chi-local' ? 'chi-local: tệp bị tạo — phạm vi local không được bật' : `${ca}: tệp bị tạo ở kho không bật`);
      if (r.status !== 0) sai.push(`${ca}: thoát ${r.status}`);
      if (!r.stdout.includes(CHUA_CAI)) sai.push(`${ca}: thiếu dòng «${CHUA_CAI}»`);
      if (ca === 'chi-local' && !r.stdout.includes('--scope project')) sai.push('chi-local: thiếu «--scope project»');
      if (truoc !== sau) sai.push(`${ca}: cây đổi`);
    }
  }
  return sai;
}
if (want('KM-1')) {
  if (chayCa('KM-1', () => km1(KIT))) ok('KM-1', 'bảy trạng thái: đúng hai ca bật ghi; bốn ca không bật một dòng, 0 byte; JSON hỏng thoát 3, 0 byte (HOME bật khoá)');
  if (want('KM-1-do')) chayDo('KM-1-do', km1, banSao([['scripts/lo-trinh-khoi-tao.mjs', '  if (!b.bat) {', '  if (false) {']]), 'tệp bị tạo ở kho không bật');
  if (want('KM-1-do2')) chayDo('KM-1-do2', km1, banSao([['scripts/lo-trinh-khoi-tao.mjs', 'return { bat: bat(proj), chiLocal:', 'return { bat: bat(proj) || bat(loc), chiLocal:']]), 'phạm vi local không được bật');
  if (want('KM-1-do3')) {
    const doiTen = d => { const p = path.join(d, '.claude-plugin', 'marketplace.json'); const j = JSON.parse(readFileSync(p, 'utf8')); j.name = 'kit-khac'; writeFileSync(p, JSON.stringify(j, null, 2)); };
    try {
      const lanh = banSao([], doiTen); const g = kho({ settings: bat(lanh) }); chay(lanh, g);
      if (!existsSync(path.join(g, DICH))) bad('KM-1-do3', 'đối chứng: bản lành trên marketplace đổi tên không ghi tệp');
      else chayDo('KM-1-do3', km1, banSao([['scripts/lo-trinh-khoi-tao.mjs', 'return p && j.name ? `${p.name}@${j.name}` : null;', "return 'road-map@acceptance-gate-kit';"]], doiTen), 'khoá bật không rút từ marketplace.json');
    } catch (e) { bad('KM-1-do3', loi(e)); }
  }
}

// ── KM-2 — tệp đúng khuôn ────────────────────────────────────────────────────
async function km2(kit, goc, tenMong) {
  const sai = []; const p = path.join(goc, DICH);
  if (!existsSync(p)) return [`không có ${DICH}`];
  const txt = readFileSync(p, 'utf8'); const d = JSON.parse(txt);
  const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
  if (LT.kiemKhuon(d).co.length) sai.push(`kiemKhuon có cờ: ${LT.kiemKhuon(d).co.join(', ')}`);
  if (!deq(Object.keys(d).sort(), ['chan_troi', 'da_bac', 'ghi_chu', 'hang', 'moc', 'schema', 'ten'])) sai.push(`khoá gốc: ${Object.keys(d).sort()}`);
  const khuon = Object.keys(JSON.parse(readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8')));
  const ngoai = Object.keys(d).filter(k => k !== 'ghi_chu' && !khuon.includes(k)); if (ngoai.length) sai.push(`khoá ngoài khuôn: ${ngoai}`);
  for (const k of ['moc', 'hang', 'chan_troi', 'da_bac']) if (!deq(d[k], [])) sai.push(`${k} không rỗng`);
  if (d.schema !== 1) sai.push('schema ≠ 1');
  if (d.ten !== tenMong) sai.push(`ten «${d.ten}», cần «${tenMong}»`);
  if (!LT.dangChuan(txt)) sai.push('tệp không ở dạng chuẩn — bộ tự áp của RM2 không ghi được');
  if (!String(d.ghi_chu).includes('/acceptance-gate:cat-luot')) sai.push('ghi_chu không nêu /acceptance-gate:cat-luot');
  return sai;
}
const km2Kho = async kit => { const g = kho({ ten: 'kho-thu-rm4', settings: bat(kit) }); chay(kit, g); return km2(kit, g, 'Lộ trình kho-thu-rm4'); };
if (want('KM-2')) {
  try { const s = await km2Kho(KIT); if (s.length) bad('KM-2', s.join(' ; ')); else ok('KM-2', 'tệp rỗng đúng khuôn, khoá ⊆ khuôn mẫu + ghi_chu, tên theo thư mục, dạng chuẩn'); } catch (e) { bad('KM-2', loi(e)); }
  if (want('KM-2-worktree')) {
    try {
      const g = kho({ ten: 'kho-thu-rm4', settings: bat(KIT) }); const wt = path.join(path.dirname(g), 'wt-ten-khac');
      git(g, 'worktree', 'add', '-q', wt); chay(KIT, wt);
      const s = await km2(KIT, wt, 'Lộ trình kho-thu-rm4'); if (s.length) bad('KM-2-worktree', s.join(' ; ')); else ok('KM-2-worktree', 'chạy từ worktree tên khác: tên vẫn theo kho chính');
    } catch (e) { bad('KM-2-worktree', loi(e)); }
  }
  if (want('KM-2-do')) {
    try {
      const mut = banSao([['scripts/lo-trinh-khoi-tao.mjs', '      LT.ghiLoTrinh(p, {', '      ((q, x) => writeFileSync(q, JSON.stringify(x)))(p, {']]);
      const s = await km2Kho(mut); const g = s.find(x => x.includes('tệp không ở dạng chuẩn — bộ tự áp của RM2 không ghi được'));
      if (g) ok('KM-2-do', `bản sao ghi không thụt bị bắt: «${g}»`); else bad('KM-2-do', `hàm đo không bắt: ${JSON.stringify(s)}`);
    } catch (e) { bad('KM-2-do', loi(e)); }
  }
}

// ── KM-3 — khoá + miễn trừ ───────────────────────────────────────────────────
const WR = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const MAU = ['docs/x.md', 'PRODUCT-MAP.md', 'LO-TRINH.html', 'src/a.ts', 'trang.html'];
function mien(goc) {
  const globs = WR.configList(readFileSync(path.join(goc, '_acceptance', 'config.yaml'), 'utf8'), 't1_skip_globs').join('\n');
  const pm = path.join(KIT, 'scripts', 'pre-merge-check.sh');
  const lenh = `eval "$(sed -n '/^glob_variants() {/,/^}/p;/^match_globs() {/,/^}/p' "$1")"; match_globs "$3" "$2"`;
  return MAU.filter(p => spawnSync('bash', ['-c', lenh, 'm', pm, globs, p]).status === 0);
}
const CFG = {
  a: 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "PRODUCT-MAP.md"\n',
  b: 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "PRODUCT-MAP.md"\n    - "*.html"\n',
  c: 'schema_version: 1\n',
};
async function km3(kit, chi = null) {
  const sai = []; const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
  for (const [ca, cfg] of Object.entries(CFG)) {
    if (chi && ca !== chi) continue;
    const g = kho({ cfg, settings: bat(kit) }); const truoc = mien(g);
    if (ca !== 'c' && !truoc.length) sai.push(`${ca}: đối chứng — tập miễn trước rỗng`);
    const r = chay(kit, g); if (r.status !== 0) { sai.push(`${ca}: thoát ${r.status} ${r.stderr.trim()}`); continue; }
    const sau = mien(g); const mong = [...new Set([...truoc, 'LO-TRINH.html'])].sort();
    if (!deq(sau.sort(), mong)) sai.push(`${ca}: tập miễn sau ${JSON.stringify(sau)} ≠ trước + LO-TRINH.html ${JSON.stringify(mong)}`);
    const k = LT.docCacTep(g); if (!k || !deq(k.tep, [DICH])) sai.push(`${ca}: docCacTep ${JSON.stringify(k)}`);
    const ns = git(g, 'diff', '--numstat', '--', '_acceptance/config.yaml').split('\t');
    if (ns[1] !== '0') sai.push(`${ca}: config có ${ns[1]} dòng xoá`);
    if (existsSync(path.join(g, '_acceptance', 'config.yaml.bak'))) sai.push(`${ca}: còn config.yaml.bak`);
    const cfgSau = readFileSync(path.join(g, '_acceptance', 'config.yaml'), 'utf8');
    if (ca === 'b' && cfgSau.includes('LO-TRINH.html')) sai.push('b: thêm dòng miễn trừ dù "*.html" đã phủ');
    if (ca === 'c' && !deq(WR.configList(cfgSau, 't1_skip_globs'), ['LO-TRINH.html'])) sai.push(`c: t1_skip_globs ${JSON.stringify(WR.configList(cfgSau, 't1_skip_globs'))}`);
    commit(g); const c = check(kit, g);
    if (c.status !== 0) sai.push(`${ca}: --check thoát ${c.status}: ${(c.stderr + c.stdout).trim().slice(0, 300)}`);
  }
  return sai;
}
if (want('KM-3')) {
  try { const s = await km3(KIT); if (s.length) bad('KM-3', s.join(' ; ')); else { ok('KM-3', 'ba kho: miễn sau = trước + LO-TRINH.html, khoá đọc lại đúng, chỉ thêm dòng, không .bak, --check 0'); ok('KM-3-glob-rong', '"*.html" đã phủ → không thêm dòng'); ok('KM-3-khong-khoi', 'không khối → tạo khối với đúng một mục'); } } catch (e) { bad('KM-3', loi(e)); }
  if (want('KM-3-append-trung')) {
    try {
      const g = kho({ cfg: CFG.a, settings: bat(KIT) }); chay(KIT, g); const cp = path.join(g, '_acceptance', 'config.yaml'); const h = bam(g);
      const r = node([path.join(KIT, 'scripts', 'config-patch.mjs'), '--config', cp, '--key', 'risk_tiers.t1_skip_globs', '--append', '--value', 'LO-TRINH.html', '--write']);
      if (r.status === 2 && bam(g) === h) ok('KM-3-append-trung', 'mục đã có → thoát 2, cây không đổi'); else bad('KM-3-append-trung', `thoát ${r.status}, cây ${bam(g) === h ? 'giữ' : 'đổi'}`);
    } catch (e) { bad('KM-3-append-trung', loi(e)); }
  }
  if (want('KM-3-do')) {
    try {
      const mut = banSao([['scripts/lo-trinh-khoi-tao.mjs', '  buoc2(); // bước 2', '  // bỏ bước 2']]);
      const g = kho({ cfg: CFG.a, settings: bat(mut) }); chay(mut, g); commit(g); const c = check(mut, g);
      const ghim = 'không glob nào trong risk_tiers.t1_skip_globs phủ LO-TRINH.html';
      if (c.status === 1 && c.stderr.includes(ghim)) ok('KM-3-do', `bỏ bước miễn trừ → --check 1 «${ghim}»`); else bad('KM-3-do', `--check thoát ${c.status}: ${c.stderr.trim().slice(0, 200)}`);
    } catch (e) { bad('KM-3-do', loi(e)); }
  }
}

// ── KM-4 — --check xanh ở commit khởi tạo ────────────────────────────────────
function km4(kit) {
  const sai = []; const g = kho({ settings: bat(kit) }); const truoc = dsTep(g);
  const r = chay(kit, g); if (r.status !== 0) return [`khởi tạo thoát ${r.status}: ${r.stderr}`];
  if (!dsTep(g).includes('PRODUCT-MAP.md') || truoc.includes('PRODUCT-MAP.md')) sai.push('kho theo khuôn (bản đồ đã bật): PRODUCT-MAP.md không do khởi tạo vẽ');
  commit(g); const c = check(kit, g);
  if (c.status !== 0) sai.push(`--check thoát ${c.status}: ${(c.stdout + c.stderr).trim().slice(0, 300)}`);
  if (!c.stdout.includes('LO-TRINH.html khớp tệp ý định và hồ sơ.')) sai.push('--check thiếu «LO-TRINH.html khớp tệp ý định và hồ sơ.»');
  const q = JSON.parse(node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', g]).stdout);
  if ('loTrinhChuaKhai' in q) sai.push('quét còn loTrinhChuaKhai');
  if (!q.loTrinh || q.loTrinh.loi !== null) sai.push(`loTrinh.loi = ${q.loTrinh && q.loTrinh.loi}`);
  const rs = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', g, '--ra-soat']);
  if (rs.status !== 0 || rs.stdout !== '') sai.push(`--ra-soat thoát ${rs.status}, stdout «${rs.stdout}»`);
  return sai;
}
if (want('KM-4')) {
  if (want('KM-4-truoc')) {
    try {
      const g = kho(); const sai = [];
      const p1 = node([path.join(KIT, 'scripts', 'config-patch.mjs'), '--config', path.join(g, '_acceptance', 'config.yaml'), '--key', 'lo_trinh.tep', '--value', DICH, '--write']);
      if (p1.status !== 0) sai.push(`dựng: config-patch thoát ${p1.status}`);
      const p2 = node([path.join(KIT, 'scripts', 'product-map.mjs'), '--root', g]); if (p2.status !== 0) sai.push(`dựng: vẽ thoát ${p2.status}`);
      commit(g); const c = check(KIT, g);
      const ghim = 'không glob nào trong risk_tiers.t1_skip_globs phủ LO-TRINH.html';
      if (c.status !== 1) sai.push(`--check thoát ${c.status}, cần 1`);
      if (!c.stderr.includes(ghim)) sai.push(`--check không nêu «${ghim}»: ${c.stderr.trim().slice(0, 200)}`);
      if (sai.length) bad('KM-4-truoc', sai.join(' ; ')); else ok('KM-4-truoc', `đối chứng số đo trước: khai tay khoá, vẽ, commit → --check 1 «${ghim}»`);
    } catch (e) { bad('KM-4-truoc', loi(e)); }
  }
  if (chayCa('KM-4', () => km4(KIT))) ok('KM-4', 'commit khởi tạo: --check 0, quét không cờ chưa khai, loi null, rà soát rỗng, bản đồ vẽ vì kho đã bật');
  if (want('KM-4-chua-bat-ban-do')) {
    try {
      const g = kho({ cfg: khuonCfg().replace('    - "PRODUCT-MAP.md"\n', ''), settings: bat(KIT) });
      if (khuonCfg() === khuonCfg().replace('    - "PRODUCT-MAP.md"\n', '')) throw new Error('khuôn không có dòng PRODUCT-MAP.md để bỏ');
      const truoc = dsTep(g); chay(KIT, g); const moi = dsTep(g).filter(x => !truoc.includes(x)); commit(g); const c = check(KIT, g);
      if (!moi.includes('PRODUCT-MAP.md') && c.status === 0) ok('KM-4-chua-bat-ban-do', `kho chưa bật bản đồ: tệp mới ${JSON.stringify(moi)}, --check 0`);
      else bad('KM-4-chua-bat-ban-do', `tệp mới ${JSON.stringify(moi)}, --check ${c.status}: ${(c.stdout + c.stderr).slice(0, 200)}`);
    } catch (e) { bad('KM-4-chua-bat-ban-do', loi(e)); }
  }
  if (want('KM-4-do')) {
    try {
      const mut = banSao([['scripts/lo-trinh-khoi-tao.mjs', 'if (ghi) writeFileSync(ban, PM.renderProductMap(root));', 'if (false) writeFileSync(ban, PM.renderProductMap(root));']]);
      const g = kho({ settings: bat(mut) }); chay(mut, g); commit(g); const c = check(mut, g);
      if (c.status === 1 && (c.stdout + c.stderr).includes('PRODUCT-MAP.md')) ok('KM-4-do', 'bỏ vẽ bản đồ → --check 1 nêu PRODUCT-MAP.md'); else bad('KM-4-do', `--check ${c.status}`);
    } catch (e) { bad('KM-4-do', loi(e)); }
  }
}

// ── KM-5 — hội tụ ────────────────────────────────────────────────────────────
const MOT_MACH = (() => { let h = null; return () => { if (h) return h; const g = kho({ ten: 'kho-dut', settings: bat(KIT) }); chay(KIT, g); h = bam(g); return h; }; })();
function dut(kitDut, kitLanh, k) {
  const g = kho({ ten: 'kho-dut', settings: bat(kitLanh) });
  const r1 = chay(kitDut, g); const sai = [];
  if (r1.status !== 9) return [`đối chứng: bản tiêm sau bước ${k} thoát ${r1.status}, cần 9`];
  const dau = { 1: () => !readFileSync(path.join(g, '_acceptance', 'config.yaml'), 'utf8').includes('LO-TRINH.html'), 2: () => !existsSync(path.join(g, DICH)), 3: () => !existsSync(path.join(g, 'LO-TRINH.html')), 4: () => !existsSync(path.join(g, 'LO-TRINH.html')) }[k];
  if (dau && !dau()) sai.push(`đối chứng: bước ${k + 1} đã để lại dấu trước khi đứt`);
  const r2 = chay(kitLanh, g);
  if (r2.status === 2 && r2.stderr.includes(DICH)) return [...sai, 'thoát 2 trên tệp do khởi tạo ghi'];
  if (r2.status !== 0) sai.push(`chạy lại thoát ${r2.status}: ${r2.stderr.trim()}`);
  if (bam(g) !== MOT_MACH()) sai.push(`chạy lại sau đứt bước ${k}: cây khác lần chạy liền một mạch`);
  return sai;
}
const tiemDut = k => banSao([['scripts/lo-trinh-khoi-tao.mjs', `  buoc${k}(); // bước ${k}`, `  buoc${k}(); process.exit(9); // bước ${k}`]]);
function chiemCho(kit) {
  const g = kho({ settings: bat(kit), tep: { [DICH]: 'không phải lộ trình\n' } }); const h = bam(g); const r = chay(kit, g); const sai = [];
  if (readFileSync(path.join(g, DICH), 'utf8') !== 'không phải lộ trình\n') sai.push('tệp của kho bị ghi đè');
  if (r.status !== 2) sai.push(`thoát ${r.status}, cần 2`);
  if (!r.stderr.includes(DICH)) sai.push(`stderr không nêu ${DICH}`);
  if (bam(g) !== h) sai.push('cây đổi');
  return sai;
}
if (want('KM-5')) {
  if (want('KM-5-lan-hai')) chayCa('KM-5-lan-hai', () => { const g = kho({ settings: bat(KIT) }); chay(KIT, g); const h = bam(g); const r = chay(KIT, g); return [...(bam(g) !== h ? ['lần hai đổi cây'] : []), ...(r.stdout.includes(DA_SAN) ? [] : [`thiếu «${DA_SAN}»`])]; }) && ok('KM-5-lan-hai', 'lần hai: 0 byte, «lộ trình đã sẵn»');
  if (want('KM-5-chiem-cho')) chayCa('KM-5-chiem-cho', () => chiemCho(KIT)) && ok('KM-5-chiem-cho', 'đích bị chiếm, chưa khai → thoát 2 nêu tệp, 0 byte');
  if (want('KM-5-trang-cu')) chayCa('KM-5-trang-cu', () => { const g = kho({ settings: bat(KIT), tep: { 'LO-TRINH.html': 'cũ' } }); chay(KIT, g); return readFileSync(path.join(g, 'LO-TRINH.html'), 'utf8') === 'cũ' ? [] : ['trang cũ bị ghi lại']; }) && ok('KM-5-trang-cu', 'trang có sẵn giữ byte');
  for (const k of [1, 2, 3, 4]) if (want(`KM-5-dut-${k}`)) chayCa(`KM-5-dut-${k}`, () => dut(tiemDut(k), KIT, k)) && ok(`KM-5-dut-${k}`, `đứt sau bước ${k} (thoát 9), chạy lại → cây bằng lần chạy liền một mạch`);
  if (want('KM-5-do')) chayDo('KM-5-do', chiemCho, banSao([
    ['scripts/lo-trinh-khoi-tao.mjs', 'if (khai() == null && existsSync(path.join(root, DICH_MAC_DINH)))', 'if (false)'],
    ['scripts/lo-trinh-khoi-tao.mjs', '      if (existsSync(p)) continue;\n', ''],
  ]), 'tệp của kho bị ghi đè');
  if (want('KM-5-do2')) {
    try {
      const mut = banSao([
        ['scripts/lo-trinh-khoi-tao.mjs', 'const ds = k ? k.tep : (ghi ? [] : [DICH_MAC_DINH]);', 'const ds = k ? k.tep : [DICH_MAC_DINH];'],
        ['scripts/lo-trinh-khoi-tao.mjs', '  buoc1(); // bước 1\n  buoc2(); // bước 2\n  buoc3(); // bước 3', '  buoc3(); process.exit(9); // bước 3\n  buoc1(); // bước 1\n  buoc2(); // bước 2'],
      ]);
      const s = dut(mut, KIT, 0); const g = s.find(x => x.includes('thoát 2 trên tệp do khởi tạo ghi'));
      if (g) ok('KM-5-do2', `thứ tự tệp-trước-khoá đứt sau bước tệp → «${g}»`); else bad('KM-5-do2', `hàm đo không bắt: ${JSON.stringify(s)}`);
    } catch (e) { bad('KM-5-do2', loi(e)); }
  }
}

// ── KM-6 — bản chép CI ───────────────────────────────────────────────────────
const mucCI = kit => {
  const b = khoi(readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8'), 'INIT-CI-COPY-LIST');
  return [...b.matchAll(/^.*`\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)` → `([^`]+)`.*$/gm)].map(m => ({ nguon: m[1], dich: path.posix.join(m[2], path.posix.basename(m[1])), loTrinh: m[0].includes('[only-if-declared: lo_trinh]') }));
};
function khoCI(kit, sua = null) {
  const g = kho({ settings: bat(kit) });
  for (const m of mucCI(KIT).filter(x => !x.loTrinh)) { mkdirSync(path.dirname(path.join(g, m.dich)), { recursive: true }); cpSync(path.join(KIT, m.nguon), path.join(g, m.dich)); }
  if (sua) sua(g); commit(g); return g;
}
function km6(kit) {
  const sai = []; const lt = mucCI(KIT).filter(x => x.loTrinh);
  if (lt.length < 2) return [`chỉ ${lt.length} mục mang dấu lộ trình`];
  const g = khoCI(kit); const truoc = dsTep(g); const r = chay(kit, g);
  if (r.status !== 0) return [`khởi tạo thoát ${r.status}: ${r.stderr}`];
  const moi = dsTep(g).filter(x => !truoc.includes(x) && (x.startsWith('scripts/') || x.startsWith('lib/')));
  if (!deq(moi.sort(), lt.map(x => x.dich).sort())) sai.push(`tệp mới dưới scripts/ và lib/ ${JSON.stringify(moi)} ≠ ${JSON.stringify(lt.map(x => x.dich))}`);
  for (const m of lt) if (existsSync(path.join(g, m.dich)) && !readFileSync(path.join(g, m.dich)).equals(readFileSync(path.join(KIT, m.nguon)))) sai.push(`${m.dich} khác bản gói`);
  commit(g); const c = node([path.join(g, 'scripts', 'product-map.mjs'), '--root', '.', '--check'], { cwd: g });
  if (c.status !== 0) sai.push(`bản chép --check thoát ${c.status}: ${(c.stdout + c.stderr).trim().slice(0, 400)}`);
  return sai;
}
if (want('KM-6')) {
  if (chayCa('KM-6', () => km6(KIT))) ok('KM-6', 'chép đúng các mục mang dấu lộ trình, giống từng byte; bản chép --check 0');
  if (want('KM-6-chua-chep')) chayCa('KM-6-chua-chep', () => { const g = kho({ settings: bat(KIT) }); const t = dsTep(g); chay(KIT, g); const m = dsTep(g).filter(x => !t.includes(x) && x.startsWith('scripts/')); return m.length ? [`tệp mới ${m}`] : []; }) && ok('KM-6-chua-chep', 'kho chưa chép CI → 0 tệp dưới scripts/');
  if (want('KM-6-lech')) chayCa('KM-6-lech', () => {
    const lech = '// bản chép cũ\n' + readFileSync(path.join(KIT, 'scripts', 'lo-trinh.mjs'), 'utf8');
    const g = khoCI(KIT, x => writeFileSync(path.join(x, 'scripts', 'lo-trinh.mjs'), lech)); const r = chay(KIT, g); const sai = [];
    if (readFileSync(path.join(g, 'scripts', 'lo-trinh.mjs'), 'utf8') !== lech) sai.push('bản chép lệch bị ghi đè');
    const n = r.stdout.split('\n').filter(x => x.includes(LECH)).length; if (n !== 1) sai.push(`${n} dòng «${LECH}»`);
    return sai;
  }) && ok('KM-6-lech', 'bản chép lệch giữ byte, đúng một dòng báo');
  if (want('KM-6-do')) {
    try {
      const mut = banSao([], d => { const p = path.join(d, 'commands', 'acceptance-init.md'); const t = readFileSync(p, 'utf8'); const dong = t.split('\n').filter(x => x.includes('scripts/ho-so-tom-tat.cjs') && x.includes('[only-if-declared: lo_trinh]')); if (dong.length !== 1) throw new Error(`mục ho-so-tom-tat khớp ${dong.length} lần`); writeFileSync(p, t.replace(dong[0] + '\n', '')); });
      const g = khoCI(mut); chay(mut, g); commit(g); const c = node([path.join(g, 'scripts', 'product-map.mjs'), '--root', '.', '--check'], { cwd: g });
      const t = c.stdout + c.stderr;
      if (c.status !== 0 && /ho-so-tom-tat|MODULE_NOT_FOUND/.test(t)) ok('KM-6-do', 'danh sách thiếu mục → bản chép --check đỏ nêu ho-so-tom-tat'); else bad('KM-6-do', `--check ${c.status}: ${t.slice(0, 200)}`);
    } catch (e) { bad('KM-6-do', loi(e)); }
  }
}

// ── KM-7 — vòng đầu ──────────────────────────────────────────────────────────
const TODAY = '2026-10-20';
const quetDong = (kit, g) => JSON.parse(node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', g], { env: { ...process.env, ACCEPTANCE_TODAY: TODAY } }).stdout).loTrinh.dong;
const km7Rong = kit => { const g = kho({ settings: bat(kit) }); chay(kit, g); const d = quetDong(kit, g); return d.includes(CHUA_CO_VIEC) ? [] : [`dòng «Hàng kế» nhận được: «${d.find(x => x.startsWith('Hàng kế')) || ''}»`]; };
if (want('KM-7')) {
  if (want('KM-7-rong')) chayCa('KM-7-rong', () => km7Rong(KIT)) && ok('KM-7-rong', 'lộ trình 0 việc: thẻ chỉ việc kế');
  if (want('KM-7-co-viec')) chayCa('KM-7-co-viec', () => {
    const data = { schema: 1, ten: 'L', moc: [], hang: [{ ma: '1', cau_giao: 'Việc một', dung_tren: ['9'] }] };
    const g = kho({ cfg: CFG.a + 'lo_trinh:\n  tep: docs/l.json\n', tep: { 'docs/l.json': JSON.stringify(data, null, 2) + '\n' } });
    const chuan = (ds, kit) => ds.map(x => [realpathSync(kit), kit].reduce((y, k) => y.split(k).join('<kit>'), x));
    const a = chuan(quetDong(KIT, g), KIT); const b = chuan(quetDong(banGoc(), g), banGoc());
    if (!a.length || !b.length) return [`đối chứng gốc không chạy: ${a.length}/${b.length}`];
    return deq(a, b) ? [] : [`khác bộ máy gốc: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`];
  }) && ok('KM-7-co-viec', 'lộ trình có việc chưa đủ điều kiện: thẻ giống từng byte bộ máy gốc');
  let gMo = null;
  if (want('KM-7-mo-o')) chayCa('KM-7-mo-o', () => {
    const g = kho({ settings: bat(KIT) }); chay(KIT, g); gMo = g;
    const LTp = path.join(KIT, 'scripts', 'lo-trinh.mjs');
    const h0 = JSON.parse(readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8')).hang[0];
    const { slug, dot, phu, ...hang } = h0; hang.ma = '1';
    const d = JSON.parse(readFileSync(path.join(g, DICH), 'utf8')); d.hang.push(hang);
    node(['--input-type=module', '-e', `const L=await import(${JSON.stringify(pathToFileURL(LTp).href)}); L.ghiLoTrinh(${JSON.stringify(path.join(g, DICH))}, ${JSON.stringify(d)});`]);
    commit(g);
    const b = khoi(readFileSync(path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8'), 'S0-MO-O');
    const lenh = b.split('\n').find(x => x.startsWith('AG=')); if (!lenh) return ['không rút được lệnh S0-MO-O'];
    const lenh2 = lenh.replace(/^AG=\$\(.*?\) && /, `AG='${KIT}' && `).replace("'<mã>'", "'1'");
    if (lenh2 === lenh) return ['khuôn S0-MO-O đổi: không thay được AG'];
    const r = spawnSync('bash', ['-c', lenh2], { cwd: g, encoding: 'utf8' }); const sai = [];
    let j = null; try { j = JSON.parse(r.stdout); } catch { sai.push(`S0-MO-O không in JSON: ${r.stdout} ${r.stderr}`); }
    if (j && j.moi !== true) sai.push(`moi = ${j.moi}`);
    const opp = j && j.hoSo ? path.join(g, '_acceptance', j.hoSo, 'opportunity.md') : null;
    if (!opp || !existsSync(opp) || !/^lo_trinh_ma: "?1"?$/m.test(readFileSync(opp, 'utf8'))) sai.push('ô cơ hội không có lo_trinh_ma: 1');
    node([path.join(KIT, 'scripts', 'product-map.mjs'), '--root', g]); commit(g);
    const c = check(KIT, g); if (c.status !== 0) sai.push(`--check ${c.status}: ${(c.stdout + c.stderr).slice(0, 300)}`);
    return sai;
  }) && ok('KM-7-mo-o', 'hàng chép từ khuôn → S0-MO-O mở ô (moi true, lo_trinh_ma 1), vẽ lại --check 0');
  if (want('KM-7-tu-ap')) chayCa('KM-7-tu-ap', () => {
    const g = kho({ settings: bat(KIT) }); chay(KIT, g); const p = path.join(g, DICH); const LTp = path.join(KIT, 'scripts', 'lo-trinh.mjs');
    const d = JSON.parse(readFileSync(p, 'utf8'));
    d.hang.push({ ma: '2', cau_giao: 'Việc hai', hang: 'T2' });
    d.moc.push({ ten: 'Mốc cũ', ngay: '2026-10-01', loai: 'phat-hanh', hang: ['2'] }, { ten: 'Chiến dịch', ngay: '2026-12-01', loai: 'phat-hanh', hang: [], chinh_sach: { tu_ap: true, nhip_ngay: 1 } });
    node(['--input-type=module', '-e', `const L=await import(${JSON.stringify(pathToFileURL(LTp).href)}); L.ghiLoTrinh(${JSON.stringify(p)}, ${JSON.stringify(d)});`]);
    node([path.join(KIT, 'scripts', 'product-map.mjs'), '--root', g]); commit(g);
    const ap = ngay => node([LTp, '--root', g, '--ap', '--write'], { env: { ...process.env, ACCEPTANCE_TODAY: ngay } });
    const sai = []; const h0 = readFileSync(p, 'utf8');
    const r1 = ap(TODAY); if (r1.status !== 0) sai.push(`--ap ngày ${TODAY} thoát ${r1.status}: ${r1.stderr}`);
    if (readFileSync(p, 'utf8') !== h0) sai.push('ngày một: tệp đổi (cần báo trước)');
    commit(g); const r2 = ap('2026-10-21'); if (r2.status !== 0) sai.push(`--ap ngày hai thoát ${r2.status}: ${r2.stderr}`);
    const t2 = readFileSync(p, 'utf8'); const m = JSON.parse(t2).moc.find(x => x.ten === 'Mốc cũ');
    if (!m || m.hang.includes('2')) sai.push(`ngày hai: hàng 2 vẫn trong Mốc cũ (${JSON.stringify(m)}) — stdout ${r2.stdout.trim().slice(0, 200)}`);
    const L = node(['--input-type=module', '-e', `const L=await import(${JSON.stringify(pathToFileURL(LTp).href)}); process.stdout.write(String(L.dangChuan(${JSON.stringify(t2)})));`]).stdout;
    if (L !== 'true') sai.push('ngày hai: tệp không còn dạng chuẩn');
    return sai;
  }) && ok('KM-7-tu-ap', 'bộ tự áp của RM2 chạy trên tệp khởi tạo: báo trước rồi dời, dạng chuẩn giữ');
  if (want('KM-7-do')) chayDo('KM-7-do', km7Rong, banSao([['scripts/lo-trinh.mjs', ' : rong ? `Hàng kế: ${CHUA_CO_VIEC}`', '']]), 'dòng «Hàng kế» nhận được');
}

// ── KM-8 — lời dặn trong lệnh khởi tạo ───────────────────────────────────────
function km8MaThoat(kit) {
  const b = khoi(readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8'), 'INIT-LO-TRINH');
  const ma = [...new Set([...b.matchAll(/^\s*- exit (\d+)/gm)].map(m => Number(m[1])))].sort();
  const sai = []; if (!deq(ma, [0, 2, 3])) sai.push(`bảng mã ${JSON.stringify(ma)} ≠ [0,2,3]`);
  for (const m of ma) if (!maDaThay.has(m)) sai.push(`mã ${m} không kho thử nào cho ra`);
  return sai;
}
if (want('KM-8')) {
  chayCa('KM-8', () => {
    const t = readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8'); const sai = [];
    if (!lenhInit(KIT).includes('--root <path> --write')) sai.push('dòng lệnh thiếu --root <path> --write');
    const b1 = t.slice(t.indexOf('\n1. If `_acceptance/config.yaml`'), t.indexOf('\n2. PROBE')); if (!b1.includes('5d')) sai.push('bước 1 không nêu 5d');
    const rd = readFileSync(path.join(KIT, 'road-map', 'README.md'), 'utf8'); const mc = rd.slice(rd.indexOf('## Cài cho một kho'), rd.indexOf('\n## ', rd.indexOf('## Cài cho một kho') + 3));
    if (!mc.includes('/acceptance-gate:acceptance-init')) sai.push('README «Cài cho một kho» không nêu /acceptance-gate:acceptance-init');
    return sai;
  }) && ok('KM-8', 'khối một dòng lệnh, bước 1 nêu 5d, README chỉ lệnh khởi tạo');
  if (want('KM-8-ma-thoat')) {
    if (!maDaThay.has(0)) chay(KIT, kho());
    if (!maDaThay.has(2)) chiemCho(KIT);
    if (!maDaThay.has(3)) chay(KIT, kho({ settings: '{' }));
    chayCa('KM-8-ma-thoat', () => km8MaThoat(KIT)) && ok('KM-8-ma-thoat', 'bảng mã {0,2,3}, mỗi mã có kho thử cho ra');
  }
  if (want('KM-8-khoi-khac')) chayCa('KM-8-khoi-khac', () => {
    const a = readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8'); const b = readFileSync(path.join(banGoc(), 'commands', 'acceptance-init.md'), 'utf8');
    // Vòng sau thêm dòng vào INIT-CI-COPY-LIST: lo-trinh-gio-may (RM6) `scripts/gio-may.mjs` (lo-trinh.mjs import nó) và
    // kho-cam-ket-co-lo-trinh (RM5) `lib/chan-lo-trinh.cjs` (lưới trước-merge gọi nó), và ho-so-da-ky-giu-tuoi (K-A)
    // `lib/do-san-tren-nen.cjs` (checkRepinEvals nạp nó), và o-mo-viec-mang-nguon (TT3) ba tệp tri thức mà lo-trinh.mjs
    // nạp lười ở lối --mo-o (`tri-thuc-khoa.cjs`, `tri-thuc-nguon.cjs`, `tri-thuc.mjs`), và vong-don-le-tra-tri-thuc (TT5) ba tệp
    // mà lối --tra của tri-thuc.mjs nạp (`tri-thuc-tra.cjs`, `can-cu-s1.cjs`, `luat-san-pham.cjs`), và mốc 2.34.0 khuôn
    // `tri-thuc-template.md` mà các tệp tri thức đọc lúc chạy (crm #565). Gỡ đích danh từng dòng trước khi so,
    // đối chứng là mỗi dòng có mặt đúng một lần; phần còn lại vẫn phải giống từng byte.
    const DONG_SAU = [['gio-may.mjs', /\n[^\n]*\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/gio-may\.mjs[^\n]*/g], ['chan-lo-trinh.cjs', /\n[^\n]*\$\{CLAUDE_PLUGIN_ROOT\}\/lib\/chan-lo-trinh\.cjs[^\n]*/g], ['do-san-tren-nen.cjs', /\n[^\n]*\$\{CLAUDE_PLUGIN_ROOT\}\/lib\/do-san-tren-nen\.cjs[^\n]*/g],
      ...['tri-thuc-khoa.cjs', 'tri-thuc-nguon.cjs', 'tri-thuc.mjs', 'tri-thuc-tra.cjs', 'can-cu-s1.cjs', 'luat-san-pham.cjs'].map(f => [f, new RegExp(String.raw`\n[^\n]*\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/${f.replace(/\./g, '\\.')}\` [^\n]*`, 'g')]),
      ['tri-thuc-template.md', /\n[^\n]*\$\{CLAUDE_PLUGIN_ROOT\}\/skills\/acceptance\/references\/tri-thuc-template\.md` [^\n]*/g]];
    return ['INIT-CI-COPY-LIST', 'INIT-PLUGIN-DECLARE', 'CONSUMER-ALLOW-ADVICE'].flatMap(k => { let x = khoi(a, k); const y = khoi(b, k); if (!x || !y) return [`đối chứng: khối ${k} rút không được`];
      if (k === 'INIT-CI-COPY-LIST') for (const [ten, re] of DONG_SAU) { const n = (x.match(re) || []).length; if (n !== 1) return [`đối chứng: dòng ${ten} có ${n} lần trong ${k}`]; x = x.replace(re, ''); }
      return x === y ? [] : [`khối ${k} khác bộ máy gốc`]; });
  }) && ok('KM-8-khoi-khac', 'ba khối máy đọc khác giống từng byte bộ máy gốc');
  if (want('KM-8-do')) chayDo('KM-8-do', km8MaThoat, banSao([['commands/acceptance-init.md', '    <!-- INIT-LO-TRINH>>> -->', '    - exit 4 → giả.\n    <!-- INIT-LO-TRINH>>> -->']]), 'mã 4 không kho thử nào cho ra');
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (kho-moi-cai-goi-road-map)`);
process.exit(fail ? 1 : 0);
