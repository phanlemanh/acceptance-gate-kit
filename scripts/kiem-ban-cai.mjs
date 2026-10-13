#!/usr/bin/env node
// kiem-ban-cai.mjs — kiểm bản cài sau phát hành (hồ sơ kiem-ban-cai-sau-phat-hanh, hàng KC1).
//
//   node scripts/kiem-ban-cai.mjs --ref <tag|sha> [--root <kho kit>] [--nguon-cai <dir>] [--giu]
//   node scripts/kiem-ban-cai.mjs --may --ref <tag|sha> [--root <kho kit>]
//
// Chế độ kho giả lập (`--ref`): cài ĐÚNG cây của ref (git archive) vào một cấu hình Claude CÁCH LY
// (CLAUDE_CONFIG_DIR tạm — không chạm ~/.claude thật), dựng một kho giả lập sạch bằng code, rồi kiểm
// tám mục theo thứ tự cố định (MUC). `--nguon-cai` thay nguồn cài (ca đo tiêm lỗi; hay chứng một bản
// checkout bất kỳ so với ref). Chế độ máy thật (`--may`): CHỈ ĐỌC sổ cài `plugins/installed_plugins.json`
// của cấu hình đang dùng (không chạy CLI) và so từng bản ghi của chợ kit với cây của ref.
//
// Gốc: A1 chưa chạy sống ở 2.27 vì bản cài thiếu agents/; bản «2.27.0» ở M5 là main, không phải tag.
// Đo 13/10: chợ kit kiểu THƯ MỤC chép bản checkout lúc cài, và bộ đệm khoá theo số — `update` báo
// «đã mới nhất» mà giữ nội dung cũ.
//
// Mỗi dòng kết quả: `[kiem-ban-cai] ĐẠT|ĐỎ|VÀNG <mục>: <chi tiết>`; dòng cuối luôn `TỔNG KẾT: …`.
// Thoát 0 = ĐẠT · 1 = ĐỎ · 2 = KHÔNG CHẠY ĐƯỢC (không bao giờ in «ĐẠT» trong ca ấy).
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TIEN_TO = '[kiem-ban-cai]';
const HAN_MS = 120_000;
export const MUC = ['so-phien-ban', 'khop-tag', 'thu-muc-goi', 'tac-tu-cham', 'hook-goi', 'the-cong', 'luoi-truoc-gop', 'dieu-phoi'];
const CONG_CU_BUT = ['Edit', 'Write', 'NotebookEdit', 'MultiEdit'];
const SLUG_KHO = 'kho-thu';

export class KhongChay extends Error {}

const git = (root, args, buffer = false) =>
  spawnSync('git', ['-C', root, ...args], { encoding: buffer ? undefined : 'utf8', maxBuffer: 1 << 28, timeout: HAN_MS });

// Danh sách gói + số mong đợi rút từ manifest TẠI ref — không danh sách gõ tay.
export function docManifest(root, ref) {
  const m = git(root, ['show', `${ref}:.claude-plugin/marketplace.json`]);
  if (m.status !== 0) throw new KhongChay(`không đọc được .claude-plugin/marketplace.json tại ${ref}`);
  const mk = JSON.parse(m.stdout);
  const goi = mk.plugins.map(p => {
    const nguon = path.posix.normalize(String(p.source).replace(/^\.\//, '')) || '.';
    const pj = git(root, ['show', `${ref}:${nguon === '.' ? '' : nguon + '/'}.claude-plugin/plugin.json`]);
    if (pj.status !== 0) throw new KhongChay(`không đọc được plugin.json của gói ${p.name} tại ${ref}`);
    return { ten: p.name, nguon, so: JSON.parse(pj.stdout).version };
  });
  return { cho: mk.name, goi };
}

// Cây của ref dưới thư mục nguồn của một gói: đường tương đối nguồn → sha blob.
export function cayCuaRef(root, ref, nguon) {
  const r = git(root, ['ls-tree', '-r', '-z', ref, '--', nguon === '.' ? '.' : nguon]);
  if (r.status !== 0) throw new KhongChay(`git ls-tree ${ref} ${nguon} thất bại`);
  const cay = new Map();
  for (const muc of r.stdout.split('\0')) {
    if (!muc) continue;
    const [dau, p] = muc.split('\t');
    const [, kieu, sha] = dau.split(' ');
    if (kieu !== 'blob') continue;
    cay.set(nguon === '.' ? p : p.slice(nguon.length + 1), sha);
  }
  return cay;
}

export function bamBlob(tep) {
  const buf = fs.readFileSync(tep);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');
}

// So bản cài với cây: thiếu/lệch quyết ĐỎ; thừa (tệp ngoài cây — .claude/, node_modules/, .DS_Store mà chợ
// kiểu thư mục chép từ bản checkout) chỉ đếm. Thư mục không có trong cây đếm MỘT mục, không đi sâu.
export function soBanCai(installPath, cay) {
  const thieu = [], lech = [], thua = [];
  for (const [rel, sha] of cay) {
    const f = path.join(installPath, rel);
    let st;
    try { st = fs.lstatSync(f); } catch { thieu.push(rel); continue; }
    if (!st.isFile() || bamBlob(f) !== sha) lech.push(rel);
  }
  const thuMuc = new Set();
  for (const rel of cay.keys()) { const p = rel.split('/'); for (let i = 1; i < p.length; i++) thuMuc.add(p.slice(0, i).join('/')); }
  const di = (relDir) => {
    let ds;
    try { ds = fs.readdirSync(path.join(installPath, relDir), { withFileTypes: true }); } catch { return; }
    for (const e of ds) {
      const rel = relDir ? `${relDir}/${e.name}` : e.name;
      if (e.isDirectory()) { if (thuMuc.has(rel)) di(rel); else thua.push(`${rel}/`); }
      else if (!cay.has(rel)) thua.push(rel);
    }
  };
  di('');
  return { thieu, lech, thua };
}

export function thuMucCapMotThieu(installPath, cay) {
  const cap1 = new Set([...cay.keys()].filter(r => r.includes('/')).map(r => r.split('/')[0]));
  return [...cap1].filter(d => { try { return !fs.statSync(path.join(installPath, d)).isDirectory(); } catch { return true; } }).sort();
}

// Tác tử chấm: mọi loại `<gói>:<tên>` mà workflow ĐÃ CÀI gọi tên phải có agents/<tên>.md trong CHÍNH bản cài.
export function kiemTacTu(flPath, tenGoi = 'feature-loop') {
  const wf = path.join(flPath, 'workflows', 'acceptance-verify.js');
  let src;
  try { src = fs.readFileSync(wf, 'utf8'); } catch { return { loi: [`không đọc được workflows/acceptance-verify.js của bản cài ${tenGoi}`], ten: [] }; }
  const re = new RegExp(`['"]${tenGoi}:([\\w-]+)['"]`, 'g');
  const ten = [...new Set([...src.matchAll(re)].map(m => m[1]))]; // thứ tự workflow gọi tên
  const loi = [], vang = [];
  for (const t of ten) {
    let md;
    try { md = fs.readFileSync(path.join(flPath, 'agents', `${t}.md`), 'utf8'); } catch { vang.push(`${tenGoi}:${t}`); continue; }
    const fm = (md.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] || '';
    const name = ((fm.match(/^name:\s*(.+)$/m) || [])[1] || '').trim();
    if (name !== t) loi.push(`${t}.md: name không khớp (${name || 'trống'})`);
    const tools = ((fm.match(/^tools:\s*(.+)$/m) || [])[1] || '').split(/[,\s]+/).filter(Boolean);
    const but = tools.filter(x => CONG_CU_BUT.includes(x));
    if (but.length) loi.push(`${t}.md: tác tử chấm cầm bút: ${but.join(', ')}`);
  }
  if (vang.length) loi.unshift(`tác tử chấm vắng trong bản cài: ${vang.join(', ')}`);
  return { loi, ten };
}

// Móc nối của gói: mọi tệp hooks.json trỏ qua ${CLAUDE_PLUGIN_ROOT}, và mọi `modules` (tương đối thư mục hooks).
export function kiemHook(installPath) {
  const hj = path.join(installPath, 'hooks', 'hooks.json');
  let raw;
  try { raw = fs.readFileSync(hj, 'utf8'); } catch { return []; }
  const can = new Set([...raw.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"'\s\\]+)/g)].map(m => m[1]));
  try { for (const m of JSON.parse(raw).modules || []) can.add(path.posix.join('hooks', m)); } catch { return ['hooks/hooks.json không phải JSON'] }
  return [...can].filter(rel => !fs.existsSync(path.join(installPath, rel))).sort();
}

const ghiTep = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

// Kho giả lập do code sinh: main (config + tài liệu + hồ sơ nháp) · nhánh `lanh` (chỉ sửa tài liệu) ·
// nhánh `pham` (thêm hồ sơ báo PASS mà một phép đo thoát 1 — lưới trước-gộp phải chặn bằng phép kiểm lại
// bằng chứng, cùng một vi phạm dù trạng thái là verified hay đã ký).
export function dungKhoGiaLap(dir) {
  const kho = path.join(dir, 'kho');
  fs.mkdirSync(kho, { recursive: true });
  const g = (...a) => {
    const r = spawnSync('git', ['-C', kho, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...a], { encoding: 'utf8' });
    if (r.status !== 0) throw new KhongChay(`dựng kho giả lập: git ${a.join(' ')}: ${(r.stderr || '').trim()}`);
  };
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 'kiem-ban-cai@local'); g('config', 'user.name', 'kiem-ban-cai');
  ghiTep(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\nrecheck: strict\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  ghiTep(path.join(kho, 'docs', 'a.md'), 'kho giả lập\n');
  ghiTep(path.join(kho, '_acceptance', SLUG_KHO, 'contract.md'),
    `---\nschema_version: 1\nfeature: Kho thử của lệnh kiểm bản cài\nslug: ${SLUG_KHO}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n# Acceptance Contract: ${SLUG_KHO}\n\n## Criteria\n\n- AC-1: Given kho thử, When chạy lệnh, Then thoát 0.\n\n## Out of scope\n\n- Không gì cả.\n- Không gì nữa.\n`);
  ghiTep(path.join(kho, '_acceptance', SLUG_KHO, 'evals.yaml'),
    `schema_version: 1\nfeature_slug: ${SLUG_KHO}\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: "true"\n    expected: "exit 0"\n`);
  g('add', '-A'); g('commit', '-qm', 'goc');
  g('checkout', '-qb', 'lanh');
  fs.appendFileSync(path.join(kho, 'docs', 'a.md'), 'một dòng tài liệu\n');
  g('commit', '-qam', 'tai lieu');
  g('checkout', '-qb', 'pham');
  const verify = path.join(kho, 'verify.sh');
  ghiTep(verify, '#!/bin/sh\nexit 0\n');
  ghiTep(path.join(kho, '_acceptance', 'pham-luat', 'contract.md'),
    '---\nschema_version: 1\nfeature: Hồ sơ phạm luật\nslug: pham-luat\nrisk_tier: T2\nsurfaces: [api]\nstatus: verified\napproved_by: kiem-ban-cai\napproved_at: 2026-06-10\n---\n');
  ghiTep(path.join(kho, '_acceptance', 'pham-luat', 'evidence-report.md'),
    `---\nschema_version: 1\nfeature_slug: pham-luat\nverdict: PASS\nhuman_signoff: kiem-ban-cai 2026-06-21\n---\n\n## Evidence\n- eval: E1\n  run_id: pham-luat-E1-001\n  exit_code: 1\n  verifier: ${verify}\n  verified_at: 2026-06-20\n`);
  g('add', '-A'); g('commit', '-qm', 'pham luat');
  g('checkout', '-q', 'lanh');
  return { kho, slug: SLUG_KHO, chuyen: (nhanh) => g('checkout', '-q', nhanh) };
}

function claude(args, env) {
  const r = spawnSync('claude', args, { encoding: 'utf8', env, timeout: HAN_MS, maxBuffer: 1 << 26 });
  if (r.error && r.error.code === 'ENOENT') throw new KhongChay('không tìm thấy lệnh claude trong PATH');
  if (r.error) throw new KhongChay(`claude ${args.join(' ')}: ${r.error.message}`);
  return r;
}

function danhSachCai(env) {
  const r = claude(['plugin', 'list', '--json'], env);
  if (r.status !== 0) throw new KhongChay(`claude plugin list --json thoát ${r.status}: ${(r.stderr || '').trim().split('\n').pop()}`);
  const d = JSON.parse(r.stdout);
  return Array.isArray(d) ? d : (d.plugins || []);
}

const run = (cmd, args, opts) => spawnSync(cmd, args, { encoding: 'utf8', timeout: HAN_MS, maxBuffer: 1 << 26, ...opts });

function moTa(ds, n = 5) { return ds.slice(0, n).join(', ') + (ds.length > n ? ` … (+${ds.length - n})` : ''); }

function docArgs(argv) {
  const a = { ref: null, root: path.resolve(HERE, '..'), nguonCai: null, giu: false, may: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--ref') a.ref = argv[++i];
    else if (k === '--root') a.root = path.resolve(argv[++i]);
    else if (k === '--nguon-cai') a.nguonCai = path.resolve(argv[++i]);
    else if (k === '--giu') a.giu = true;
    else if (k === '--may') a.may = true;
    else throw new KhongChay(`đối số lạ: ${k}`);
  }
  if (!a.ref) throw new KhongChay('thiếu --ref <tag|sha>');
  return a;
}

function giaiRef(root, ref) {
  if (git(root, ['rev-parse', '--git-dir']).status !== 0) throw new KhongChay(`${root} không phải kho git của kit — truyền --root <bản checkout kit có tag>`);
  const r = git(root, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  if (r.status !== 0) throw new KhongChay(`ref không có: ${ref}`);
  return r.stdout.trim();
}

function cheDoGiaLap(a, sha, mf, out) {
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kiem-ban-cai-'));
  const cfg = path.join(tam, 'cau-hinh');
  fs.mkdirSync(cfg);
  const env = { ...process.env, CLAUDE_CONFIG_DIR: cfg };
  try {
    let nguon = a.nguonCai;
    if (!nguon) {
      nguon = path.join(tam, 'nguon');
      fs.mkdirSync(nguon);
      const ar = run('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" | tar -x -C "$3"', '_', a.root, sha, nguon]);
      if (ar.status !== 0) throw new KhongChay(`git archive ${a.ref} thất bại: ${(ar.stderr || '').trim()}`);
    }
    const khoGL = dungKhoGiaLap(tam);
    out(`${TIEN_TO} ref ${a.ref} = ${sha.slice(0, 8)} · nguồn: ${a.nguonCai || 'git archive'} · cấu hình cách ly ${cfg} · kho giả lập ${khoGL.kho}`);
    let cho = mf.cho;
    try { cho = JSON.parse(fs.readFileSync(path.join(nguon, '.claude-plugin', 'marketplace.json'), 'utf8')).name || cho; } catch { /* giữ tên chợ tại ref */ }
    const ma = claude(['plugin', 'marketplace', 'add', nguon], env);
    if (ma.status !== 0) throw new KhongChay(`claude plugin marketplace add thoát ${ma.status}: ${(ma.stderr || ma.stdout || '').trim().split('\n').pop()}`);
    const caiLoi = {};
    for (const g of mf.goi) {
      const r = claude(['plugin', 'install', `${g.ten}@${cho}`, '--scope', 'user'], env);
      if (r.status !== 0) caiLoi[g.ten] = (r.stderr || r.stdout || '').trim().split('\n').pop();
    }
    const banGhi = Object.fromEntries(danhSachCai(env).filter(p => String(p.id).endsWith(`@${cho}`)).map(p => [String(p.id).split('@')[0], p]));
    const ketQua = {};
    const ghi = (muc, ok, chiTiet) => { ketQua[muc] = ok; out(`${TIEN_TO} ${ok ? 'ĐẠT' : 'ĐỎ'} ${muc}: ${chiTiet}`); };
    const vang = (muc, chiTiet) => out(`${TIEN_TO} VÀNG ${muc}: ${chiTiet}`);
    const p = (ten) => banGhi[ten] && banGhi[ten].installPath && fs.existsSync(banGhi[ten].installPath) ? banGhi[ten].installPath : null;

    // 1. so-phien-ban
    const lechSo = mf.goi.map(g => caiLoi[g.ten] ? `${g.ten}: cài thất bại (${caiLoi[g.ten]})`
      : !banGhi[g.ten] ? `${g.ten}: không có bản cài`
        : banGhi[g.ten].version !== g.so ? `${g.ten}: cài ${banGhi[g.ten].version}, ref ${g.so}` : null).filter(Boolean);
    ghi('so-phien-ban', !lechSo.length, lechSo.length ? lechSo.join(' · ') : mf.goi.map(g => `${g.ten} ${g.so}`).join(' · '));

    // 2. khop-tag + 3. thu-muc-goi
    const cay = Object.fromEntries(mf.goi.map(g => [g.ten, cayCuaRef(a.root, sha, g.nguon)]));
    const sai = [], thua = [], thieuDir = [];
    let soTep = 0;
    for (const g of mf.goi) {
      const ip = p(g.ten);
      if (!ip) { sai.push(`${g.ten}: không có bản cài`); thieuDir.push(`${g.ten} (không có bản cài)`); continue; }
      const s = soBanCai(ip, cay[g.ten]);
      soTep += cay[g.ten].size;
      for (const r of [...s.thieu, ...s.lech]) sai.push(`${g.ten}:${r}`);
      for (const r of s.thua) thua.push(`${g.ten}:${r}`);
      for (const d of thuMucCapMotThieu(ip, cay[g.ten])) thieuDir.push(`${g.ten}/${d}`);
    }
    ghi('khop-tag', !sai.length, sai.length ? `bản cài khác tag: ${sai.length} tệp — ${moTa(sai)}` : `${mf.goi.length} gói, ${soTep} tệp khớp`);
    if (thua.length) vang('khop-tag', `thừa ${thua.length} tệp/thư mục ngoài cây — ${moTa(thua)}`);
    ghi('thu-muc-goi', !thieuDir.length, thieuDir.length ? `THIẾU thư mục gói: ${thieuDir.join(', ')}` : 'đủ thư mục cấp một của mọi gói');

    // 4. tac-tu-cham
    const fl = p('feature-loop');
    if (!fl) ghi('tac-tu-cham', false, 'không có bản cài feature-loop');
    else { const t = kiemTacTu(fl); ghi('tac-tu-cham', !t.loi.length, t.loi.length ? t.loi.join(' · ') : `${t.ten.length} loại tác tử có định nghĩa: ${t.ten.join(', ')}`); }

    // 5. hook-goi
    const hongHook = mf.goi.flatMap(g => p(g.ten) ? kiemHook(p(g.ten)).map(r => `${g.ten}:${r}`) : []);
    ghi('hook-goi', !hongHook.length, hongHook.length ? `móc nối trỏ tệp vắng: ${hongHook.join(', ')}` : 'mọi tệp móc nối trỏ tới đều có');

    // 6–8. vòng chạm từ BẢN CÀI trong kho giả lập
    const ag = p('acceptance-gate');
    if (!ag) ghi('the-cong', false, 'không có bản cài acceptance-gate');
    else {
      const r = run('node', [path.join(ag, 'scripts', 'gate-card.js'), '--root', khoGL.kho, '--slug', khoGL.slug]);
      const ok = r.status === 0 && (r.stdout || '').includes(khoGL.slug);
      ghi('the-cong', ok, ok ? `thẻ Cổng Phạm vi của hồ sơ ${khoGL.slug} dựng được` : `thẻ cổng không dựng được (thoát ${r.status}): ${(r.stderr || '').trim().split('\n').pop() || 'đầu ra thiếu tên hồ sơ'}`);
    }
    if (!ag) ghi('luoi-truoc-gop', false, 'không có bản cài acceptance-gate');
    else {
      const pm = () => run('bash', [path.join(ag, 'scripts', 'pre-merge-check.sh'), '.', '--base', 'main'], { cwd: khoGL.kho });
      khoGL.chuyen('lanh'); const lanh = pm();
      khoGL.chuyen('pham'); const pham = pm();
      khoGL.chuyen('lanh');
      const loi = [];
      if (lanh.status !== 0) loi.push(`kho lành bị chặn (thoát ${lanh.status})`);
      if (pham.status === 0 || !/VIOLATION/.test(`${pham.stdout}${pham.stderr}`)) loi.push(`lưới không chặn hồ sơ phạm luật (thoát ${pham.status})`);
      ghi('luoi-truoc-gop', !loi.length, loi.length ? loi.join(' · ') : 'kho lành thoát 0 · hồ sơ phạm luật bị chặn (VIOLATION)');
    }
    const dp = p('dieu-phoi');
    if (!dp) ghi('dieu-phoi', false, 'không có bản cài dieu-phoi');
    else {
      const r = run('node', [path.join(dp, 'scripts', 'dieu-phoi.mjs'), 'chan-doan', '--json'], { cwd: khoGL.kho });
      let ok = false;
      try { ok = r.status === 0 && JSON.parse(r.stdout).some(m => m.muc === 'co-dot'); } catch { ok = false; }
      ghi('dieu-phoi', ok, ok ? 'chẩn đoán đợt chạy được từ bản cài' : `chẩn đoán đợt không chạy được (thoát ${r.status}): ${(r.stderr || '').trim().split('\n').pop() || 'đầu ra không phải JSON mong đợi'}`);
    }

    const do_ = MUC.filter(m => !ketQua[m]);
    out(do_.length
      ? `${TIEN_TO} TỔNG KẾT: ĐỎ ${do_.length}/${MUC.length} — ${a.ref} (${sha.slice(0, 8)}): ${do_.join(', ')}`
      : `${TIEN_TO} TỔNG KẾT: ĐẠT ${MUC.length}/${MUC.length} — ${a.ref} (${sha.slice(0, 8)}) cài đúng tag`);
    return do_.length ? 1 : 0;
  } finally {
    if (a.giu) out(`${TIEN_TO} giữ lại ${tam}`);
    else fs.rmSync(tam, { recursive: true, force: true });
  }
}

// Sổ cài của cấu hình đang dùng, đọc THẲNG tệp — không chạy CLI: `claude plugin list` làm mới các tệp đánh dấu
// `.in_use` trong bộ đệm thật (đo 13/10), mà chế độ này hứa chỉ đọc. Định dạng lạ → không chạy được, không đoán.
function docSoCai(cfg) {
  const f = path.join(cfg, 'plugins', 'installed_plugins.json');
  let j;
  try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { throw new KhongChay(`không đọc được sổ cài ${f}: ${e.message}`); }
  if (!j || typeof j.plugins !== 'object' || Array.isArray(j.plugins)) throw new KhongChay(`sổ cài ${f} có định dạng lạ (thiếu khối plugins) — CLI đổi định dạng?`);
  return Object.entries(j.plugins).flatMap(([id, ds]) => (Array.isArray(ds) ? ds : []).map(b => ({ id, ...b })));
}

function cheDoMay(a, sha, mf, out) {
  const cfg = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  out(`${TIEN_TO} máy: cấu hình ${cfg} · ref ${a.ref} = ${sha.slice(0, 8)} · chợ ${mf.cho}`);
  const banGhi = docSoCai(cfg).filter(p => String(p.id).endsWith(`@${mf.cho}`));
  if (!banGhi.length) {
    out(`${TIEN_TO} ĐỎ may: không có bản ghi nào của ${mf.cho}`);
    out(`${TIEN_TO} TỔNG KẾT: ĐỎ — máy không có bản cài nào của ${mf.cho}`);
    return 1;
  }
  // Gom theo thư mục cài: nhiều bản ghi (mỗi cây phụ một bản ghi) dùng chung một bộ đệm — băm một lần,
  // in một dòng kèm số bản ghi; dòng ĐỎ kể nơi cần cài lại.
  const cay = {}, nhom = new Map(), lechSo = new Map();
  let dat = 0, do_ = 0, khacSo = 0;
  for (const b of banGhi) {
    const ten = String(b.id).split('@')[0];
    const g = mf.goi.find(x => x.ten === ten);
    if (!g || b.version !== g.so) {
      const k = `${b.id}|${b.version}`;
      lechSo.set(k, { id: b.id, so: b.version, ref: g ? g.so : null, n: (lechSo.get(k)?.n || 0) + 1 });
      khacSo++; continue;
    }
    const k = b.installPath || '(trống)';
    if (!nhom.has(k)) nhom.set(k, { b, ten, g, noi: [] });
    nhom.get(k).noi.push(`${b.scope || '-'} ${b.projectPath || '-'}`);
  }
  for (const [ip, { b, ten, g, noi }] of nhom) {
    const nhan = `${b.id} ${b.version} (${ip}) · ${noi.length} bản ghi`;
    if (!b.installPath || !fs.existsSync(b.installPath)) { out(`${TIEN_TO} ĐỎ may: ${nhan}: bản cài không có trên đĩa — ${moTa(noi, 3)}`); do_ += noi.length; continue; }
    cay[ten] ||= cayCuaRef(a.root, sha, g.nguon);
    const s = soBanCai(b.installPath, cay[ten]);
    const thieuDir = thuMucCapMotThieu(b.installPath, cay[ten]).map(d => `${ten}/${d}`);
    const sai = [...s.thieu, ...s.lech];
    const thua = s.thua.length ? ` · thừa ${s.thua.length} (${moTa(s.thua, 3)})` : '';
    if (thieuDir.length || sai.length) {
      const ve = [];
      if (thieuDir.length) ve.push(`THIẾU thư mục gói: ${thieuDir.join(', ')}`);
      if (sai.length) ve.push(`khác tag: ${sai.length} tệp (${moTa(sai, 3)})`);
      out(`${TIEN_TO} ĐỎ may: ${nhan}: ${ve.join(' · ')}${thua} — cài lại ở: ${moTa(noi, 5)}`); do_ += noi.length;
    } else { out(`${TIEN_TO} ĐẠT may: ${nhan}: khớp ${a.ref}${thua}`); dat += noi.length; }
  }
  for (const v of lechSo.values()) {
    out(`${TIEN_TO} VÀNG may: ${v.id} khác số ${v.so}${v.ref ? ` (ref ${v.ref})` : ' (gói không có trong chợ tại ref)'} · ${v.n} bản ghi — chưa nâng`);
  }
  const duoi = khacSo ? ` · ${khacSo} bản ghi khác số (VÀNG)` : '';
  out(do_
    ? `${TIEN_TO} TỔNG KẾT: ĐỎ ${do_}/${dat + do_} bản ghi cùng số lệch ${a.ref} (${sha.slice(0, 8)}) — gỡ rồi cài lại${duoi}`
    : `${TIEN_TO} TỔNG KẾT: ĐẠT ${dat} bản ghi khớp ${a.ref} (${sha.slice(0, 8)})${duoi}`);
  return do_ ? 1 : 0;
}

export async function chay(argv, { out = (s) => process.stdout.write(s + '\n') } = {}) {
  try {
    const a = docArgs(argv);
    if (!a.may) claude(['--version'], process.env); // dò lệnh trước mọi việc khác — thiếu thì nói đúng nguyên nhân
    const sha = giaiRef(a.root, a.ref);
    const mf = docManifest(a.root, sha);
    return a.may ? cheDoMay(a, sha, mf, out) : cheDoGiaLap(a, sha, mf, out);
  } catch (e) {
    if (!(e instanceof KhongChay)) throw e;
    out(`${TIEN_TO} TỔNG KẾT: KHÔNG CHẠY ĐƯỢC — ${e.message}`);
    return 2;
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  chay(process.argv.slice(2)).then(ma => { process.exitCode = ma; });
}
