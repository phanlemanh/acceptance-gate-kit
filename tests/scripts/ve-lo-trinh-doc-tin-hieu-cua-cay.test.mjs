// ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs — hồ sơ ve-lo-trinh-doc-tin-hieu-cua-cay (VA2, vá 2.32.1), ca VT-<n> = AC-n
// của hợp đồng. Mỗi eval của evals.yaml ghim đúng dòng «PASS: VT-…» của tệp này.
//
// Kho thử, worktree và bản tải sạch (`git clone --no-hardlinks` rồi checkout đúng sha — hình dạng CI) do CODE sinh trong
// lượt. «Bộ máy gốc» = `git archive <gốc so> …`, gốc so đọc từ _acceptance/<hồ sơ>/goc-so (v2.32.0). Ca đỏ chạy CHÍNH hàm
// ca trên BẢN SAO của vật (nhát tiêm khớp ĐÚNG một lần), SAU khi bản lành xanh, và ghim thông điệp. Tập id trên trang đọc
// từ khối dữ liệu của trang (bộ đọc `docDuLieu` của chính kit), so BẰNG tập mong đợi — không đo chuỗi có mặt. Mọi đường
// dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SLUG = 've-lo-trinh-doc-tin-hieu-cua-cay';
const GOC_SHA = readFileSync(path.join(KIT, '_acceptance', SLUG, 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'vt-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.VT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, '-c', 'commit.gpgsign=false', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let tamN = 0;
const tam = (ten = 't') => { const d = path.join(TMP, `${ten}-${++tamN}`); mkdirSync(d, { recursive: true }); return d; };
const bang = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

const CAY = ['scripts', 'lib', 'skills', 'commands', 'road-map', 'dieu-phoi', 'feature-loop'];
let GOC = null;
function gocMay() {
  if (GOC) return GOC;
  GOC = tam('goc');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive ${GOC_SHA} ${CAY.join(' ')} .claude-plugin | tar -x -C "${GOC}"`]);
  return GOC;
}
function banSao(tiem) {
  const r = tam('bs');
  for (const d of [...CAY, '.claude-plugin']) if (existsSync(path.join(KIT, d))) cpSync(path.join(KIT, d), path.join(r, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(r, tep); const t = readFileSync(p, 'utf8'); const n = t.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm lệch: «${cu.slice(0, 50)}» khớp ${n} lần trong ${tep}`);
    writeFileSync(p, t.replace(cu, moi));
  }
  return r;
}

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const LT = 'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\n';
const KHAI = 'tin_hieu:\n  nguon: [tin-hieu/kho]\n  gom: tin-hieu/gom\n';
const NGUON = ['tin-hieu', 'kho'];
function dung(k, { cua = true, boQuaY = false } = {}) {
  mkdirSync(path.join(k, '_acceptance'), { recursive: true });
  writeFileSync(path.join(k, '_acceptance', 'config.yaml'), `schema_version: 1\n${LT}${cua ? KHAI : ''}`);
  mkdirSync(path.join(k, 'docs'), { recursive: true });
  writeFileSync(path.join(k, 'docs', 'lo-trinh.json'), `${JSON.stringify({ schema: 1, ten: 'LT', moc: [], hang: [], da_bac: [] }, null, 2)}\n`);
  if (cua) {
    mkdirSync(path.join(k, ...NGUON), { recursive: true }); mkdirSync(path.join(k, 'tin-hieu', 'gom'), { recursive: true });
    writeFileSync(path.join(k, 'tin-hieu', 'gom', '.gitkeep'), '');
    if (boQuaY) writeFileSync(path.join(k, '.gitignore'), 'tin-hieu/kho/\n'); else writeFileSync(path.join(k, ...NGUON, '.gitkeep'), '');
  }
}
function kho(o = {}) {
  const k = tam('kho');
  execFileSync('git', ['init', '-q', '-b', 'main', k]); git(k, 'config', 'user.email', 'x@y.z'); git(k, 'config', 'user.name', 'Chủ Kho Thử');
  dung(k, o);
  return k;
}
const y = (k, id, tieuDe) => writeFileSync(path.join(k, ...NGUON, `${id}.json`),
  `${JSON.stringify({ phien: 'P1', loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: tieuDe }, luc: '2026-10-16T05:00:00Z' })}\n`);
const commitHet = (d, m) => { git(d, 'add', '-A'); git(d, 'commit', '-qm', m); return git(d, 'rev-parse', 'HEAD'); };

// ── Bộ vẽ, khối dữ liệu, CI ─────────────────────────────────────────────────────────────────────────────────────────
const ve = (may, root) => spawnSync(process.execPath, [path.join(may, 'scripts', 'product-map.mjs'), '--root', root], { encoding: 'utf8' });
let DOC = null;
async function trangCua(root) {
  if (!DOC) DOC = (await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href)).docDuLieu;
  const p = path.join(root, 'LO-TRINH.html');
  if (!existsSync(p)) return { ids: null, tieuDe: {} };
  const d = DOC(readFileSync(p, 'utf8')).duLieu;
  const th = (d && Array.isArray(d.tin_hieu)) ? d.tin_hieu : [];
  return { ids: th.map(t => t.id).sort(), tieuDe: Object.fromEntries(th.map(t => [t.id, t.tieu_de])) };
}
const KHOP = 'LO-TRINH.html khớp tệp ý định và hồ sơ.';
const LECH = 'LO-TRINH.html lệch';
// CI: bản tải sạch của sha đã commit, chạy `--check` bằng bộ máy hiện tại của kit.
function ci(k, sha, may = KIT) {
  const c = tam('ci');
  execFileSync('git', ['clone', '-q', '--no-hardlinks', k, c]); git(c, 'checkout', '-q', sha);
  const x = spawnSync(process.execPath, [path.join(may, 'scripts', 'product-map.mjs'), '--root', c, '--check'], { encoding: 'utf8' });
  return { status: x.status, out: x.stdout + x.stderr };
}
const ciXanh = r => r.status === 0 && r.out.includes(KHOP);

// ── Ca ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
// AC-1: hình dạng crm #452 — thư mục chính lùi nền + một ý chưa theo dõi; worktree --detach sạch ở commit mới hơn.
function suCo() {
  const k = kho();
  y(k, 'kho-1', 'Ý một'); commitHet(k, 'C0: một ý đã theo dõi');
  git(k, 'switch', '-qc', 'moi'); y(k, 'kho-2', 'Ý hai'); y(k, 'kho-3', 'Ý ba'); commitHet(k, 'C1: thêm hai ý');
  git(k, 'switch', '-q', 'main'); y(k, 'nguoi-x-1', 'Ý chưa theo dõi ở thư mục chính');
  const w = path.join(TMP, `wt-${++tamN}`); git(k, 'worktree', 'add', '-q', '--detach', w, 'moi');
  return { k, w: realpathSync(w) };
}
const DUNG1 = ['kho-1', 'kho-2', 'kho-3'];
async function ca1(may) {
  const sai = []; const { k, w } = suCo();
  const x = ve(may, w);
  const t = await trangCua(w);
  if (x.status !== 0) sai.push(`vẽ thoát ${x.status}: ${x.stderr.trim().slice(0, 160)}`);
  else if (!t.ids || !bang(t.ids, DUNG1)) sai.push(t.ids && t.ids.includes('nguoi-x-1') ? 'trang vẽ lấy tín hiệu của thư mục chính' : `tập id trên trang ${JSON.stringify(t.ids)} — cần ${JSON.stringify(DUNG1)}`);
  const sha = commitHet(w, 'vẽ lại trang');
  const r = ci(k, sha);
  if (!ciXanh(r)) sai.push(`CI không xanh (thoát ${r.status}): ${r.out.split('\n').filter(l => l.includes('LO-TRINH')).join(' | ')}`);
  // Chân khởi tạo lộ trình: trang vắng, kho bật road-map ở phạm vi kho → bước 5d vẽ trang bằng hàm vẽ chung.
  rmSync(path.join(w, 'LO-TRINH.html'));
  mkdirSync(path.join(w, '.claude'), { recursive: true });
  writeFileSync(path.join(w, '.claude', 'settings.json'), `${JSON.stringify({ enabledPlugins: { 'road-map@acceptance-gate-kit': true } }, null, 2)}\n`);
  const kt = spawnSync(process.execPath, [path.join(may, 'scripts', 'lo-trinh-khoi-tao.mjs'), '--root', w, '--write'], { encoding: 'utf8' });
  const t2 = await trangCua(w);
  if (kt.status !== 0) sai.push(`khởi tạo thoát ${kt.status}: ${(kt.stderr || kt.stdout).trim().slice(0, 160)}`);
  else if (!t2.ids || !bang(t2.ids, DUNG1)) sai.push(t2.ids && t2.ids.includes('nguoi-x-1') ? 'trang vẽ lấy tín hiệu của thư mục chính' : `khởi tạo: tập id ${JSON.stringify(t2.ids)} — cần ${JSON.stringify(DUNG1)}`);
  return [...new Set(sai)];
}
// Đối chứng: cùng fixture, bộ máy gốc phải TÁI HIỆN sự cố — không thì fixture không đo gì.
async function doiChung1() {
  const { k, w } = suCo();
  const x = ve(gocMay(), w); const t = await trangCua(w);
  const sha = commitHet(w, 'vẽ lại trang (gốc)'); const r = ci(k, sha);
  return x.status === 0 && t.ids && t.ids.includes('nguoi-x-1') && r.status === 1 && r.out.includes(LECH)
    ? [] : [`fixture không tái hiện sự cố (gốc vẽ ${JSON.stringify(t.ids)}, CI thoát ${r.status})`];
}

// AC-2: các trạng thái tệp ý ở thư mục chính, không worktree.
async function ca2(may) {
  const sai = []; const k = kho();
  y(k, 't-1', 'Ý đã commit'); y(k, 'x-1', 'Ý sẽ bị xoá'); y(k, 'm-1', 'Tiêu đề cũ của m'); commitHet(k, 'ba ý đã theo dõi');
  y(k, 's-1', 'Ý đã add'); git(k, 'add', '--', 'tin-hieu/kho/s-1.json');
  y(k, 'u-1', 'Ý chưa theo dõi');
  rmSync(path.join(k, ...NGUON, 'x-1.json'));
  y(k, 'm-1', 'Tiêu đề mới của m');
  const x = ve(may, k); const t = await trangCua(k);
  if (x.status !== 0) sai.push(`vẽ thoát (tệp đã xoá?) ${x.status}: ${x.stderr.trim().slice(0, 160)})`);
  else {
    if (!t.ids || t.ids.includes('u-1')) sai.push('trang vẽ hiện ý chưa theo dõi');
    if (t.tieuDe['m-1'] === 'Tiêu đề cũ của m') sai.push('trang vẽ bản tệp ý cũ trong index');
    if (!t.ids || !bang(t.ids, ['t-1', 's-1', 'm-1'])) sai.push(`tập id trên trang ${JSON.stringify(t.ids)} — cần [m-1,s-1,t-1]`);
    else if (t.tieuDe['m-1'] !== 'Tiêu đề mới của m') sai.push(`tiêu đề m-1 trên trang: ${JSON.stringify(t.tieuDe['m-1'])}`);
  }
  git(k, 'add', '-A', '--', '.', ':!tin-hieu/kho/u-1.json'); git(k, 'commit', '-qm', 'trừ u-1');
  let r = ci(k, git(k, 'rev-parse', 'HEAD'));
  if (!ciXanh(r)) sai.push(`CI (trừ u-1) thoát ${r.status}`);
  git(k, 'add', '--', 'tin-hieu/kho/u-1.json');
  const x2 = ve(may, k); const t2 = await trangCua(k);
  if (x2.status !== 0 || !t2.ids || !bang(t2.ids, ['t-1', 's-1', 'm-1', 'u-1'])) sai.push(`sau add u-1: thoát ${x2.status}, tập id ${JSON.stringify(t2.ids)}`);
  r = ci(k, commitHet(k, 'u-1 + trang'));
  if (!ciXanh(r)) sai.push(`CI (sau add u-1) thoát ${r.status}`);
  // Kho giữ MỌI ý ngoài git (khuôn RM3b): trang không mang id ý nào, CI xanh — giới hạn có tên.
  const k2 = kho({ boQuaY: true }); commitHet(k2, 'kho'); y(k2, 'r-1', 'Ý một'); y(k2, 'r-2', 'Ý hai');
  const x3 = ve(may, k2); const t3 = await trangCua(k2);
  if (x3.status !== 0 || !t3.ids || t3.ids.length) sai.push(t3.ids && t3.ids.length ? 'trang vẽ hiện ý chưa theo dõi' : `kho ý ngoài git: thoát ${x3.status}, tập id ${JSON.stringify(t3.ids)}`);
  r = ci(k2, commitHet(k2, 'trang'));
  if (!ciXanh(r)) sai.push(`CI (kho ý ngoài git) thoát ${r.status}`);
  return [...new Set(sai)];
}

// AC-3: fixture RM3b — tệp ý ngoài git, worktree A và B, ba ý gửi bằng khối RM-GUI-LENH.
function khoiLenh(may) {
  const t = readFileSync(path.join(may, 'road-map', 'commands', 'gui.md'), 'utf8');
  const m = t.match(/<!-- <<<RM-GUI-LENH -->\n([\s\S]*?)<!-- RM-GUI-LENH>>> -->/);
  if (!m) throw new Error('gui.md thiếu khối RM-GUI-LENH');
  return m[1].replace(/^```[a-z]*\n/, '').replace(/\n?```\s*$/, '\n');
}
const gui = (may, cwd, cau) => spawnSync('bash', ['-c', khoiLenh(may).replaceAll('$AG', may).replace('<câu của người>', cau)], { cwd, encoding: 'utf8' });
const th = (may, root, ...a) => spawnSync(process.execPath, [path.join(may, 'scripts', 'tin-hieu.mjs'), '--root', root, ...a], { encoding: 'utf8' });
const idsJson = (x, lay) => { try { return lay(JSON.parse(x.stdout)).map(t => t.id).sort(); } catch { return [`<hỏng ${x.status}: ${x.stderr.slice(0, 100)}>`]; } };
function khoRm3b() {
  const k = kho({ boQuaY: true }); commitHet(k, 'kho thử');
  const w = {};
  for (const ten of ['a', 'b']) { const p = path.join(TMP, `wt-${ten}-${++tamN}`); git(k, 'worktree', 'add', '-q', p, '-b', `wt-${ten}-${tamN}`); w[ten] = realpathSync(p); }
  return { k, w };
}
async function ca3(may) {
  const sai = []; const { k, w } = khoRm3b();
  [[w.a, 'Ý từ A'], [w.b, 'Ý từ B'], [k, 'Ý từ thư mục chính']].forEach(([cwd, c]) => { const x = gui(KIT, cwd, c); if (x.status !== 0) sai.push(`gửi thoát ${x.status}: ${x.stderr.trim().slice(0, 120)}`); });
  const goc3 = [['thư mục chính', k], ['worktree A', w.a], ['worktree B', w.b]];
  const so = (ten, f) => { const v = goc3.map(([, r]) => JSON.stringify(f(r))); if (new Set(v).size !== 1) sai.push(`${ten}: ${goc3.map(([n], i) => `${n}=${v[i]}`).join(' · ')}`); return JSON.parse(v[0]); };
  const ids = so('--chua-gom', r => idsJson(th(may, r, '--chua-gom'), j => j.tin_hieu));
  if (ids.length !== 3) sai.push(`--chua-gom: tập id ${JSON.stringify(ids)} — cần 3`);
  const dg = so('--duong', r => idsJson(th(may, r, '--duong'), j => (Array.isArray(j) ? j : (j.duong || j.tin_hieu || []))));
  if (!bang(dg, ids)) sai.push(`đối chứng không chạy: --duong ${JSON.stringify(dg)}`);
  const rg = so('--rang', r => { const x = th(may, r, '--rang'); return [x.status, (x.stdout + x.stderr).split('\n').filter(l => /^- \S+ → /.test(l))]; });
  const rIds = rg[1].map(l => (l.match(/^- (\S+) → /) || [])[1]).filter(Boolean).sort();
  if (!bang(rIds, ids)) sai.push(`đối chứng không chạy: --rang ${JSON.stringify(rg)}`);
  const cu = so('--cau', r => { const x = th(may, r, '--cau'); return [x.status, x.stdout.trim().split('\n').pop()]; });
  // Ghim QUAN HỆ với tập ý (S4 lượt 1, finding trong AC-3): dòng tóm tắt luôn có chữ kể cả khi bộ đọc mất hết ý, nên
  // «có chữ» không chứng gì — số câu phải bằng số ý của --chua-gom.
  const soCau = Number(((cu[1] || '').match(/^câu cho người gửi: (\d+) câu/) || [])[1]);
  if (!cu[1]) sai.push(`đối chứng không chạy: --cau ${JSON.stringify(cu)}`);
  else if (soCau !== ids.length) sai.push(`--cau: ${Number.isNaN(soCau) ? 'không đọc được số câu' : `${soCau} câu`} — cần ${ids.length} (${JSON.stringify(cu[1])})`);
  const the = so('thẻ', r => {
    const x = spawnSync(process.execPath, [path.join(may, 'scripts', 'start-scan.mjs'), '--root', r], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-17' } });
    let j = null; try { j = JSON.parse(x.stdout); } catch { j = null; }
    return (j?.loTrinh?.dong || ['<thẻ không chạy>']).filter(l => l.startsWith('Cửa tín hiệu:') || l.startsWith('! cửa tín hiệu:') || l === '<thẻ không chạy>');
  });
  if (the.length !== 1 || !the[0].startsWith('Cửa tín hiệu: 3 ý')) sai.push(`đối chứng không chạy: thẻ ${JSON.stringify(the)}`);
  if (ids.length < 3 || dg.length < 3 || soCau < 3) sai.unshift('bộ đọc tương tác mất ý chưa theo dõi');
  // Trang vẽ ở A: không mang ý nào (giới hạn có tên) — SAU đối chứng dương: bộ máy gốc vẽ ở A thấy đủ ba.
  const g = ve(gocMay(), w.a); const tg = await trangCua(w.a);
  if (g.status !== 0 || !tg.ids || tg.ids.length !== 3) sai.push(`đối chứng không chạy: trang (gốc ${JSON.stringify(tg.ids)})`);
  const x = ve(may, w.a); const t = await trangCua(w.a);
  if (x.status !== 0 || !t.ids || t.ids.length) sai.push(`trang ở A: thoát ${x.status}, tập id ${JSON.stringify(t.ids)} — cần []`);
  return [...new Set(sai)];
}

// AC-4: kho không có sự cố — bộ máy hiện tại và bộ máy gốc vẽ giống từng byte.
const TEP_VE = ['PRODUCT-MAP.md', 'LO-TRINH.html'];
function khoAc4(ca) {
  if (ca === 'khong-cua') { const k = kho({ cua: false }); commitHet(k, 'kho'); return { k, ids: [] }; }
  if (ca === 'theo-doi') { const k = kho(); y(k, 'a-1', 'Ý A'); y(k, 'a-2', 'Ý B'); commitHet(k, 'kho'); return { k, ids: ['a-1', 'a-2'] }; }
  const k = tam('thuong'); dung(k); y(k, 'b-1', 'Ý một'); y(k, 'b-2', 'Ý hai'); return { k, ids: ['b-1', 'b-2'] };
}
async function ca4(may) {
  const sai = [];
  for (const ca of ['khong-cua', 'theo-doi', 'thu-muc-thuong']) {
    const { k, ids } = khoAc4(ca);
    const g = ve(gocMay(), k); const tg = await trangCua(k);
    const bGoc = TEP_VE.map(f => (existsSync(path.join(k, f)) ? readFileSync(path.join(k, f)) : null));
    if (g.status !== 0 || bGoc.some(b => b == null || !b.length) || (ids.length && !(tg.ids && bang(tg.ids, ids)))) { sai.push(`đối chứng gốc không chạy: ${ca}`); continue; }
    for (const f of TEP_VE) rmSync(path.join(k, f));
    const x = ve(may, k); const t = await trangCua(k);
    if (x.status !== 0) { sai.push(`${ca}: vẽ thoát ${x.status}`); continue; }
    TEP_VE.forEach((f, i) => { if (!readFileSync(path.join(k, f)).equals(bGoc[i])) sai.push(ca === 'thu-muc-thuong' && t.ids && !t.ids.length ? 'thư mục thường mất ý trên trang' : `${ca}: ${f} khác byte bộ máy gốc`); });
  }
  return [...new Set(sai)];
}

// ── Chạy ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const PM = 'scripts/product-map.mjs'; const TH = 'scripts/tin-hieu.mjs';
async function lanh(id, f, them = async () => []) {
  if (!want(id)) return true;
  try { const sai = [...await them(), ...await f(KIT)]; if (sai.length) { bad(id, sai.join(' ; ')); return false; } ok(id); return true; } catch (e) { bad(id, loi(e)); return false; }
}
async function do_(id, tiem, f, ghim, lanhXanh) {
  if (!want(id)) return;
  if (!lanhXanh) { bad(id, 'bản lành chưa xanh — không tin chiều đỏ'); return; }
  try {
    const sai = await f(banSao(tiem));
    if (sai.some(s => s.startsWith(ghim))) ok(id, `đỏ đúng «${ghim}»`); else bad(id, `bản sao không đỏ đúng «${ghim}»: ${sai.join(' ; ') || 'xanh'}`);
  } catch (e) { bad(id, loi(e)); }
}
// Nhát tiêm — mỗi chuỗi khớp ĐÚNG một lần trong vật (banSao kiểm).
const BO_CO_CAY = [PM, 'TH.duongDi({ root, classify, sections: SECTIONS, chiTheoDoi: true })', 'TH.duongDi({ root, classify, sections: SECTIONS })'];
const BO_LOC = [TH, 'if (theoDoi) ds = ds.filter(f => theoDoi.has(f));', ''];
const DOC_INDEX = [TH, "o = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));", "o = JSON.parse(theoDoi ? execFileSync('git', ['-C', path.resolve(root), 'show', `:${posix(path.join(ng, f))}`], { encoding: 'utf8' }) : readFileSync(path.join(dir, f), 'utf8'));"];
// Chỉ chân --cau đi đường bộ vẽ (đọc ý đã theo dõi) — ca đo phải đỏ nhờ phép ghim số câu, không nhờ chân khác.
const CAU_THEO_DOI = [TH, '  const ds = dungDuong({ root, classify, sections });', '  const ds = dungDuong({ root, classify, sections, chiTheoDoi: true });'];
const MOI_BO_DOC = [TH, '{ loai = napLoai(), chiTheoDoi = false } = {}', '{ loai = napLoai(), chiTheoDoi = true } = {}'];
const RONG_NGOAI_GIT = [TH, '} catch { return null; } // không phải kho git', '} catch { return new Set(); } // không phải kho git'];

const l1 = await lanh('VT-1', ca1, doiChung1);
await do_('VT-1-do', [BO_CO_CAY], ca1, 'trang vẽ lấy tín hiệu của thư mục chính', l1);
const l2 = await lanh('VT-2', ca2);
await do_('VT-2-do', [BO_LOC], ca2, 'trang vẽ hiện ý chưa theo dõi', l2);
await do_('VT-2-do3', [DOC_INDEX], ca2, 'trang vẽ bản tệp ý cũ trong index', l2);
const l3 = await lanh('VT-3', ca3);
await do_('VT-3-do', [MOI_BO_DOC], ca3, 'bộ đọc tương tác mất ý chưa theo dõi', l3);
await do_('VT-3-do2', [CAU_THEO_DOI], ca3, 'bộ đọc tương tác mất ý chưa theo dõi', l3);
// road-map-de-dung (RD1) đổi CÓ CHỦ Ý trang lộ trình (mô hình hiển thị chung): «giống từng byte bộ máy gốc» so trên cây tắt
// đúng các khối RD1 (tests/scripts/tat-rd1.mjs, tự kiểm bằng ca RD-tat) — lành và đỏ cùng đi qua một phép tắt.
const { tatRD1 } = await import(pathToFileURL(path.join(HERE, 'tat-rd1.mjs')).href);
const ca4Tat = may => ca4(tatRD1(may));
const l4 = await lanh('VT-4', ca4Tat);
await do_('VT-4-do', [RONG_NGOAI_GIT], ca4Tat, 'thư mục thường mất ý trên trang', l4);

try { rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm không chặn kết quả */ }
console.log(`\nKết quả: ${pass} PASS · ${fail} FAIL`);
process.exit(fail ? 1 : 0);
