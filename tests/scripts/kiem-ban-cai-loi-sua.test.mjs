#!/usr/bin/env node
// kiem-ban-cai-loi-sua.test.mjs — ca đo của hồ sơ kiem-ban-cai-loi-sua-chay-duoc (ca KL-<n> = AC-n).
//
//   node tests/scripts/kiem-ban-cai-loi-sua.test.mjs      # khoá executors.test.kiem_ban_cai_loi_sua
//
// Chỉ chế độ `--may` (và bước giải ref) — không cần CLI claude, nên tệp mang đuôi .test.mjs và chạy trong mảnh mjs
// của CI. Mọi thứ dựng bằng code trong thư mục tạm của lượt: kho kit thu nhỏ (chợ + plugin.json chép từ HEAD của kit,
// tệp mẫu mỗi vùng, thẻ thật, một commit sau thẻ), bộ đệm = `git archive`, kho tiêu thụ có worktree liên kết thật, sổ
// cài khuôn `version: 2` (đo trên máy 29/10). Lệnh sửa · dọn · lấy thẻ mà lệnh kiểm in ra được ÁP bằng vỏ thật rồi chạy
// lại lệnh kiểm. Ca đỏ chạy sau đối chứng dương cùng fixture và ghim thông điệp; mutant là bản sao lệnh bị tiêm — tiêm
// không áp được thì ca FAIL «tiêm không áp», không xanh im. Mỗi ca in đúng một dòng «PASS: LS-…» hoặc «FAIL: LS-… —
// <vì sao>»; có FAIL thì thoát 1.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'kiem-ban-cai.mjs');
// Ba mẫu «tệp không chạy» của tiêu chí bật hàng TC4 (docs/plans/lo-trinh-kit.json): ghi Ở ĐÂY, không đọc lại hằng của
// lệnh — một hằng bị nới rộng phải làm ca đỏ (KL-2b-dot), không được tự xanh theo.
const BA_MAU = ['docs/', '_acceptance/', 'LO-TRINH.html'];

let soFail = 0;
const pass = (ten) => console.log(`PASS: ${ten}`);
const fail = (ten, vi) => { soFail++; console.log(`FAIL: ${ten} — ${vi}`); };
const kiem = (ten, dieu) => { const loi = loiCua(dieu); loi.length ? fail(ten, loi.join('; ')) : pass(ten); return !loi.length; };
const loiCua = (dieu) => dieu.filter(([ok]) => !ok).map(([, m]) => m);

const G = ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', '-c', 'user.email=ls@local', '-c', 'user.name=ls'];
const gitOk = (dir, args) => {
  const r = spawnSync('git', ['-C', dir, ...G, ...args], { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${(r.stderr || '').trim()}`);
  return r.stdout;
};
const ghi = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const bam = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ls-'));
let dem = 0;
const moi = (ten) => { const d = path.join(tam, `${ten}-${++dem}`); fs.mkdirSync(d, { recursive: true }); return d; };

// ---------- kho kit thu nhỏ ----------
const MK = JSON.parse(gitOk(ROOT, ['show', 'HEAD:.claude-plugin/marketplace.json']));
const CHO = MK.name;
const ID = `acceptance-gate@${CHO}`;
const SO = JSON.parse(gitOk(ROOT, ['show', 'HEAD:.claude-plugin/plugin.json'])).version;
const TAG = `v${SO}`;
const MAU = { 'scripts/a.mjs': 'export const a = 1;\n', 'scripts/docs/x.mjs': 'export const x = 1;\n', 'skills/a/docs/b.md': '# kỹ năng\n',
  'feature-loop/LO-TRINH.html': '<p>gói con</p>\n', 'docs/a.md': 'tài liệu\n', '_acceptance/a/x.md': 'hồ sơ\n', '_acceptance/a/y.md': 'hồ sơ sẽ xoá\n',
  'LO-TRINH.html': '<p>lộ trình</p>\n' };

function dungKit() {
  const kit = moi('kit');
  gitOk(kit, ['init', '-q', '-b', 'main']);
  ghi(path.join(kit, '.claude-plugin', 'marketplace.json'), JSON.stringify(MK, null, 2) + '\n');
  for (const p of MK.plugins) {
    const nguon = path.posix.normalize(String(p.source).replace(/^\.\//, '')) || '.';
    const rel = `${nguon === '.' ? '' : nguon + '/'}.claude-plugin/plugin.json`;
    ghi(path.join(kit, rel), gitOk(ROOT, ['show', `HEAD:${rel}`]));
  }
  for (const [rel, s] of Object.entries(MAU)) ghi(path.join(kit, rel), s);
  gitOk(kit, ['add', '-A']); gitOk(kit, ['commit', '-qm', 'the']); gitOk(kit, ['tag', TAG]);
  const shaThe = gitOk(kit, ['rev-parse', 'HEAD']).trim();
  // Commit sau thẻ CÙNG số — đúng hình 25/10: chỉ chạm ba mẫu không chạy (sửa · xoá · thêm).
  fs.appendFileSync(path.join(kit, 'docs', 'a.md'), 'sửa sau thẻ\n');
  fs.rmSync(path.join(kit, '_acceptance', 'a', 'y.md'));
  ghi(path.join(kit, '_acceptance', 'b', 'moi.md'), 'hồ sơ mới sau thẻ\n');
  fs.appendFileSync(path.join(kit, 'LO-TRINH.html'), '<p>vẽ lại</p>\n');
  gitOk(kit, ['add', '-A']); gitOk(kit, ['commit', '-qm', 'sau the']);
  return { kit, shaThe, shaSau: gitOk(kit, ['rev-parse', 'HEAD']).trim() };
}

const lưu = (kit, ref, dich) => {
  fs.mkdirSync(dich, { recursive: true });
  const r = spawnSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" | tar -x -C "$3"', '_', kit, ref, dich], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git archive ${ref}: ${r.stderr}`);
  return dich;
};

// ---------- kho tiêu thụ giả + worktree liên kết thật ----------
function dungKho(ten, { cayPhu = true } = {}) {
  const kho = moi(ten);
  gitOk(kho, ['init', '-q', '-b', 'main']);
  ghi(path.join(kho, 'README.md'), 'kho tiêu thụ\n');
  gitOk(kho, ['add', '-A']); gitOk(kho, ['commit', '-qm', 'goc']);
  if (!cayPhu) return { kho };
  const phu = path.join(path.dirname(kho), `${path.basename(kho)}-phu`);
  gitOk(kho, ['worktree', 'add', '-q', phu, '-b', 'phu']);
  return { kho, phu };
}

// ---------- cấu hình Claude giả ----------
const banGhi = (o) => ({ scope: 'project', installedAt: '2026-10-01T00:00:00.000Z', lastUpdated: '2026-10-01T00:00:00.000Z', ...o });
const soCua = (cfg) => path.join(cfg, 'plugins', 'installed_plugins.json');
const ghiSo = (cfg, ds) => ghi(soCua(cfg), JSON.stringify({ version: 2, plugins: { [ID]: ds } }, null, 2) + '\n');
const docSo = (cfg) => JSON.parse(fs.readFileSync(soCua(cfg), 'utf8')).plugins[ID];
// Bộ đệm nằm DƯỚI plugins/ của chính cấu hình, để phép chụp chỉ-đọc (KL-8) phủ cả bộ đệm.
const boDem = (cfg, ten) => path.join(cfg, 'plugins', 'cache', CHO, 'acceptance-gate', ten);

function chup(cfg) {
  const ds = [];
  const di = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
      const p = path.join(d, e.name), st = fs.lstatSync(p);
      ds.push(`${rel}/${e.name}|${st.size}|${st.mtimeMs}`);
      if (e.isDirectory()) di(p, `${rel}/${e.name}`);
    }
  };
  di(path.join(cfg, 'plugins'), 'plugins');
  return JSON.stringify({ so: bam(fs.readFileSync(soCua(cfg))), ds });
}

const CHI_DOC = []; // KL-8: mỗi lần chạy lệnh THẬT được chụp trước/sau
function chay(cfg, { root, ref = TAG, script = SCRIPT } = {}) {
  const truoc = script === SCRIPT && fs.existsSync(soCua(cfg)) ? chup(cfg) : null;
  const r = spawnSync(process.execPath, [script, '--may', '--ref', ref, '--root', root], { encoding: 'utf8', env: { ...process.env, CLAUDE_CONFIG_DIR: cfg }, timeout: 120_000 });
  if (truoc !== null) CHI_DOC.push({ cfg, bang: chup(cfg) === truoc });
  const dong = (r.stdout || '').split('\n').filter(Boolean);
  return { ma: r.status, dong, cuoi: dong[dong.length - 1] || '', err: r.stderr || '', co: (s) => dong.filter(l => l.includes(s)) };
}
const tt = (k) => `thoát ${k.ma}; ${k.cuoi}${k.err ? ` | stderr: ${k.err.trim().split('\n').pop()}` : ''}`;
const ap = (vo, lenh) => spawnSync(vo, ['-c', lenh], { encoding: 'utf8', timeout: 60_000 });
const sauNhan = (dong, nhan) => (dong || '').split(nhan)[1];
// Vế «khác tag: …» của một dòng ĐỎ — tới dấu « · » hay « — » kế.
const veKhacTag = (l) => ((l || '').split('khác tag: ')[1] || '').split(/ · | — /)[0];

// Sao lưu của một lệnh ghi sổ: đúng một tệp cạnh sổ, băm bằng sổ TRƯỚC khi áp, chép đè thì sổ trở lại từng byte.
function loiSaoLuu(cfg, truoc) {
  const dir = path.join(cfg, 'plugins');
  const bak = fs.readdirSync(dir).filter(f => f.startsWith('installed_plugins.json.bak-'));
  if (bak.length !== 1) return [`mong đúng một tệp sao lưu, có ${bak.length}`];
  const loi = [];
  const b = fs.readFileSync(path.join(dir, bak[0]));
  if (bam(b) !== bam(truoc)) loi.push('tệp sao lưu khác sổ trước khi áp');
  fs.copyFileSync(path.join(dir, bak[0]), soCua(cfg));
  if (bam(fs.readFileSync(soCua(cfg))) !== bam(truoc)) loi.push('chép sao lưu đè lên sổ mà sổ không trở lại');
  return loi;
}

// Bản sao lệnh bị tiêm: thay đúng một chuỗi; chuỗi vắng → ném (ca FAIL «tiêm không áp»).
function banTiem(ten, tu, thanh) {
  const src = fs.readFileSync(SCRIPT, 'utf8');
  if (!src.includes(tu)) throw new Error(`tiêm không áp (${ten}): lệnh không còn chuỗi «${tu.slice(0, 60)}»`);
  const f = path.join(moi(`tiem-${ten}`), 'kiem-ban-cai.mjs');
  fs.writeFileSync(f, src.split(tu).join(thanh));
  return f;
}

function main() {
  const { kit, shaThe, shaSau } = dungKit();
  const goc = (cfg, ip, o = {}) => banGhi({ projectPath: o.projectPath, installPath: ip, version: SO, gitCommitSha: shaThe, lastUpdated: '2026-10-25T10:00:00.000Z', ...o });

  // ===== KL-1: lệch sau thẻ chỉ ở ba mẫu không chạy → VÀNG có tên, ĐẠT =====
  const { kho } = dungKho('kho1', { cayPhu: false });
  const cfgThe = moi('cfg'); ghiSo(cfgThe, [goc(cfgThe, lưu(kit, TAG, boDem(cfgThe, 'the')), { projectPath: kho })]);
  const dc = chay(cfgThe, { root: kit });
  const dcOk = kiem('KL-1 doi-chung', [[dc.ma === 0, `mong thoát 0 (${tt(dc)})`], [!dc.co('lệch chỉ ở tệp không chạy').length, 'bộ đệm nguyên vẹn mà có dòng «lệch chỉ ở tệp không chạy»'], [dc.cuoi.includes('TỔNG KẾT: ĐẠT 1 '), `TỔNG KẾT «${dc.cuoi}»`]]);
  // Thư mục mới ngoài cây thẻ được kể MỘT mục «_acceptance/b/» (soBanCai không đi sâu thư mục thừa).
  const tenBon = ['docs/a.md', '_acceptance/a/y.md', '_acceptance/b/', 'LO-TRINH.html'];
  const cfgSau = moi('cfg'); ghiSo(cfgSau, [goc(cfgSau, lưu(kit, shaSau, boDem(cfgSau, 'sau')), { projectPath: kho, gitCommitSha: shaSau })]);
  if (!dcOk) fail('KL-1', 'không có đối chứng dương (KL-1 doi-chung không PASS)');
  else {
    const k = chay(cfgSau, { root: kit });
    const v = k.dong.filter(l => l.startsWith('[kiem-ban-cai] VÀNG may:') && l.includes('lệch chỉ ở tệp không chạy'));
    kiem('KL-1', [
      [k.ma === 0, `mong thoát 0 (${tt(k)})`],
      [!k.dong.some(l => l.startsWith('[kiem-ban-cai] ĐỎ')), `có dòng ĐỎ: ${k.dong.find(l => l.startsWith('[kiem-ban-cai] ĐỎ'))}`],
      [v.length === 1, `mong đúng một dòng VÀNG «lệch chỉ ở tệp không chạy», có ${v.length}`],
      [tenBon.every(t => (v[0] || '').includes(t)), `dòng VÀNG thiếu tên: ${tenBon.filter(t => !(v[0] || '').includes(t)).join(', ')} «${v[0]}»`],
      [k.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT 1 '), `TỔNG KẾT «${k.cuoi}»`],
    ]);
  }

  // ===== KL-2: tệp mã lệch vẫn ĐỎ; vế «khác tag» chỉ kể tệp mã =====
  const cfgLech = (ref, sua) => {
    const cfg = moi('cfg');
    const d = lưu(kit, ref, boDem(cfg, 'lech'));
    sua(d);
    ghiSo(cfg, [goc(cfg, d, { projectPath: kho })]);
    return cfg;
  };
  const sua1 = (rel) => (d) => fs.appendFileSync(path.join(d, rel), '// lệch mã\n');
  if (dcOk) {
    const ka = chay(cfgLech(shaSau, sua1('scripts/a.mjs')), { root: kit });
    const la = ka.dong.find(l => l.startsWith('[kiem-ban-cai] ĐỎ may:')) || '';
    const kt = veKhacTag(la);
    const kb = chay(cfgLech(TAG, sua1('scripts/a.mjs')), { root: kit });
    const lb = kb.dong.find(l => l.startsWith('[kiem-ban-cai] ĐỎ may:')) || '';
    kiem('KL-2', [
      [ka.ma === 1, `(a) mong thoát 1 (${tt(ka)})`],
      [la.includes('khác tag: 1 tệp') && kt.includes('scripts/a.mjs'), `(a) dòng ĐỎ «${la}»`],
      [!tenBon.some(t => kt.includes(t)), `(a) vế khác tag kể tệp không chạy «${kt}»`],
      [tenBon.every(t => la.replace(kt, '').includes(t)), `(a) bốn tệp không chạy mất tên khỏi dòng «${la}»`],
      [kb.ma === 1 && lb.includes('scripts/a.mjs'), `(b) mong thoát 1 có tên tệp (${tt(kb)})`],
      [!lb.includes('tệp không chạy'), `(b) có vế tệp không chạy «${lb}»`],
    ]);
  }
  // KL-2b: tệp mã có tên giống mẫu — mỗi tệp phải ĐỎ có tên. Hàm nhận lệnh để chạy lại trên bản tiêm.
  const giongMau = ['scripts/docs/x.mjs', 'skills/a/docs/b.md', 'feature-loop/LO-TRINH.html'];
  const loiGiongMau = (script) => giongMau.flatMap(rel => {
    const k = chay(cfgLech(TAG, sua1(rel)), { root: kit, script });
    const l = k.dong.find(x => x.startsWith('[kiem-ban-cai] ĐỎ may:')) || '';
    return loiCua([[k.ma === 1, `${rel}: mong thoát 1 (${tt(k)})`], [veKhacTag(l).includes(rel), `${rel}: vế khác tag «${veKhacTag(l)}»`]]);
  });
  if (dcOk) kiem('KL-2b', loiGiongMau(SCRIPT).map(m => [false, m]));
  try {
    const tiem = [
      ['bo-neo', banTiem('bo-neo', "m.endsWith('/') ? rel.startsWith(m) : rel === m", 'rel.includes(m)')],
      ['them-skills', banTiem('them-skills', "['docs/', '_acceptance/', 'LO-TRINH.html']", "['docs/', '_acceptance/', 'LO-TRINH.html', 'skills/']")],
    ];
    kiem('KL-2b-dot', tiem.map(([ten, f]) => [loiGiongMau(f).length > 0, `bản tiêm ${ten} mà KL-2b vẫn xanh`]));
    kiem('KL-2b-mau', [[JSON.stringify(BA_MAU) === JSON.stringify(['docs/', '_acceptance/', 'LO-TRINH.html']), 'ba mẫu của ca lệch tiêu chí bật']]);
  } catch (e) { fail('KL-2b-dot', e.message); }

  // ===== KL-3: bản clone thiếu thẻ → lệnh lấy thẻ chạy được =====
  {
    const clone = path.join(moi('clone'), 'c');
    gitOk(tam, ['clone', '-q', '--no-tags', `file://${kit}`, clone]);
    const tienDe = gitOk(clone, ['tag', '-l']).trim() === '';
    const k = chay(cfgThe, { root: clone });
    const lenh = sauNhan(k.cuoi, 'lấy thẻ rồi chạy lại: ');
    const loi = loiCua([
      [tienDe, 'tiền đề: bản clone --no-tags vẫn có thẻ'],
      [k.ma === 2, `mong thoát 2 (${tt(k)})`],
      [k.cuoi.includes('KHÔNG CHẠY ĐƯỢC') && k.cuoi.includes(`ref không có: ${TAG}`), `TỔNG KẾT «${k.cuoi}»`],
      [!!lenh && lenh.includes('fetch --tags origin') && lenh.includes(clone), `lệnh lấy thẻ «${lenh}»`],
    ]);
    if (!loi.length) {
      const a = ap('bash', lenh);
      const k2 = chay(cfgThe, { root: clone });
      loi.push(...loiCua([[a.status === 0, `áp lệnh thoát ${a.status}: ${a.stderr}`], [!k2.cuoi.includes('ref không có'), `chạy lại vẫn «${k2.cuoi}»`], [k2.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT'), `chạy lại «${k2.cuoi}»`]]));
    }
    const ok3 = kiem('KL-3', loi.map(m => [false, m]));
    const c2 = path.join(moi('clone'), 'c');
    gitOk(tam, ['clone', '-q', '--no-tags', `file://${kit}`, c2]);
    gitOk(c2, ['remote', 'remove', 'origin']);
    const kn = chay(cfgThe, { root: c2 });
    if (!ok3) fail('KL-3-khong-remote', 'không có đối chứng dương (KL-3 không PASS)');
    else kiem('KL-3-khong-remote', [[kn.ma === 2, `mong thoát 2 (${tt(kn)})`], [kn.cuoi.includes('không có remote'), `TỔNG KẾT «${kn.cuoi}»`], [!kn.cuoi.includes('fetch'), `có «fetch» «${kn.cuoi}»`]]);
    const ks = chay(cfgThe, { root: kit, ref: 'deadbeefdeadbeef' });
    kiem('KL-3-sha', [[ks.ma === 2, `mong thoát 2 (${tt(ks)})`], [ks.cuoi.includes('ref không có: deadbeefdeadbeef'), `TỔNG KẾT «${ks.cuoi}»`], [!ks.cuoi.includes('fetch'), `có «fetch» «${ks.cuoi}»`]]);
  }

  // ===== KL-4 · KL-5 · KL-9: bản ghi cây phụ → lệnh sửa chạy được =====
  const dungCayPhu = ({ ten = 'kho', cfgDir = null, cungSo = false } = {}) => {
    const { kho: k, phu } = dungKho(ten);
    const cfg = cfgDir || moi('cfg');
    const ipGoc = lưu(kit, TAG, boDem(cfg, 'the'));
    const g = goc(cfg, ipGoc, { projectPath: k });
    let p;
    if (cungSo) { const d = lưu(kit, TAG, boDem(cfg, 'lech')); sua1('scripts/a.mjs')(d); p = banGhi({ projectPath: phu, installPath: d, version: SO, gitCommitSha: '1'.repeat(40) }); }
    else { const d = path.join(boDem(cfg, '0.0.1')); fs.mkdirSync(d, { recursive: true }); ghi(path.join(d, 'cu.txt'), 'bản cũ\n'); p = banGhi({ projectPath: phu, installPath: d, version: '0.0.1', gitCommitSha: '1'.repeat(40), lastUpdated: '2026-09-01T00:00:00.000Z' }); }
    ghiSo(cfg, [g, p]);
    return { cfg, kho: k, phu };
  };
  const apLenhSua = (cfg, phu, { script = SCRIPT, vo = 'bash' } = {}) => {
    const k = chay(cfg, { root: kit, script });
    const l = k.dong.find(x => x.startsWith('[kiem-ban-cai] VÀNG cay-phu:') && x.includes(phu)) || '';
    const lenh = sauNhan(l, 'lệnh sửa: ');
    const truoc = fs.readFileSync(soCua(cfg));
    const a = lenh ? ap(vo, lenh) : null;
    return { k, l, lenh, truoc, a };
  };
  {
    const { cfg, kho: k4, phu } = dungCayPhu();
    const truocDs = docSo(cfg);
    const s = apLenhSua(cfg, phu);
    const sauDs = docSo(cfg);
    const k2 = chay(cfg, { root: kit });
    const BON = ['installPath', 'version', 'gitCommitSha', 'lastUpdated'];
    const iP = truocDs.findIndex(b => b.projectPath === phu), iG = truocDs.findIndex(b => b.projectPath === k4);
    const khac = Object.keys({ ...truocDs[iP], ...sauDs[iP] }).filter(x => JSON.stringify(truocDs[iP][x]) !== JSON.stringify(sauDs[iP][x])).sort();
    kiem('KL-4', [
      [s.k.ma === 0, `mong thoát 0 trước khi sửa (${tt(s.k)})`],
      [s.l.includes(phu) && s.l.includes(k4), `dòng cay-phu thiếu đường «${s.l}»`],
      [!!s.lenh, `thiếu «lệnh sửa:» «${s.l}»`],
      [!s.k.dong.some(x => x.startsWith('[kiem-ban-cai] VÀNG may:') && x.includes('khác số')), `dòng khác số vẫn đếm cây phụ: ${s.k.co('khác số').join(' | ')}`],
      [s.a && s.a.status === 0, `áp lệnh sửa thoát ${s.a && s.a.status}: ${s.a && s.a.stderr}`],
      [!k2.dong.some(x => x.includes('cay-phu')), `chạy lại vẫn có cay-phu: ${k2.co('cay-phu').join(' | ')}`],
      [k2.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT 2 ') && s.k.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT 1 '), `ĐẠT không tăng đúng 1: «${s.k.cuoi}» → «${k2.cuoi}»`],
      [JSON.stringify(khac) === JSON.stringify([...BON].sort()), `trường đổi: ${khac.join(',')}`],
      [BON.every(x => sauDs[iP][x] === truocDs[iG][x]), 'bốn trường cây phụ khác bản ghi gốc'],
      [JSON.stringify(sauDs[iG]) === JSON.stringify(truocDs[iG]), 'bản ghi gốc bị đổi'],
    ]);
    kiem('KL-4 sao-luu', loiSaoLuu(cfg, s.truoc).map(m => [false, m]));
    try {
      const tiem = [
        ['bo-sao-luu', banTiem('bo-sao-luu', 'fs.copyFileSync(f,bak);', '')],
        ['ghi-truoc', banTiem('ghi-truoc', 'fs.copyFileSync(f,bak);Object.assign(m[0],p.dat);fs.writeFileSync(f,JSON.stringify(d,null,2)+nl);', 'Object.assign(m[0],p.dat);fs.writeFileSync(f,JSON.stringify(d,null,2)+nl);fs.copyFileSync(f,bak);')],
      ];
      kiem('KL-4-dot', tiem.map(([ten, f]) => {
        const c = dungCayPhu();
        const t = apLenhSua(c.cfg, c.phu, { script: f });
        return [!!t.lenh && loiSaoLuu(c.cfg, t.truoc).length > 0, `bản tiêm ${ten} mà ca sao lưu vẫn xanh (lệnh «${(t.lenh || '').slice(0, 40)}»)`];
      }));
    } catch (e) { fail('KL-4-dot', e.message); }
  }
  {
    const { cfg, phu } = dungCayPhu({ cungSo: true });
    const s = apLenhSua(cfg, phu);
    const k2 = chay(cfg, { root: kit });
    kiem('KL-5', [
      [s.k.ma === 1, `mong thoát 1 trước khi sửa (${tt(s.k)})`],
      [!s.k.dong.some(x => x.includes('cài lại ở') && sauNhan(x, 'cài lại ở').includes(phu)), `«cài lại ở» còn kể cây phụ: ${s.k.co('cài lại ở').join(' | ')}`],
      [!!s.lenh, `thiếu dòng cay-phu kèm lệnh sửa: ${s.k.dong.join(' | ')}`],
      [s.a && s.a.status === 0, `áp lệnh thoát ${s.a && s.a.status}: ${s.a && s.a.stderr}`],
      [k2.ma === 0 && k2.cuoi.startsWith('[kiem-ban-cai] TỔNG KẾT: ĐẠT 2 '), `chạy lại (${tt(k2)})`],
    ]);
  }

  // ===== KL-6: gốc cũ · kho khác · cây phụ không có bản ghi gốc =====
  {
    const cfg = moi('cfg');
    const ip = lưu(kit, TAG, boDem(cfg, 'the'));
    const cu = path.join(boDem(cfg, '0.0.1')); fs.mkdirSync(cu, { recursive: true });
    const k2 = dungKho('kho6a'), kk = dungKho('kho6b', { cayPhu: false }), k3 = dungKho('kho6c');
    const nguoiDung = banGhi({ scope: 'user', installPath: ip, version: SO, gitCommitSha: shaThe });
    const goc2 = banGhi({ projectPath: k2.kho, installPath: cu, version: '0.0.1' });
    const a = banGhi({ projectPath: k2.phu, installPath: cu, version: '0.0.1' });
    const b = banGhi({ projectPath: kk.kho, installPath: cu, version: '0.0.1' });
    const c = banGhi({ projectPath: k3.phu, installPath: cu, version: '0.0.1' });
    ghiSo(cfg, [nguoiDung, goc2]);
    const nen = chay(cfg, { root: kit });
    ghiSo(cfg, [nguoiDung, goc2, a, b, c]);
    const k = chay(cfg, { root: kit });
    const cp = k.co('VÀNG cay-phu:');
    const ks = k.dong.filter(l => l.startsWith('[kiem-ban-cai] VÀNG may:') && l.includes('khác số'));
    kiem('KL-6', [
      [cp.length === 1 && cp[0].includes(k2.phu) && cp[0].includes('nâng bản ghi gốc trước'), `(a) dòng cay-phu «${cp.join(' | ')}»`],
      [!k.dong.some(x => x.includes('lệnh sửa:')), `có «lệnh sửa:»: ${k.co('lệnh sửa:').join(' | ')}`],
      [!cp.some(x => x.includes(kk.kho) || x.includes(k3.phu)), '(b)/(c) bị kể ở dòng cay-phu'],
      [ks.length === 1 && ks[0].includes('3 bản ghi'), `(b)(c)+gốc cũ phải đếm 3 ở dòng khác số: «${ks.join(' | ')}»`],
      [k.ma === nen.ma, `mã thoát ${k.ma} ≠ mã của sổ bỏ ba bản ghi ${nen.ma}`],
    ]);
  }

  // ===== KL-7: bản ghi mồ côi → khối riêng + lệnh dọn =====
  {
    const cfg = moi('cfg');
    const ip = lưu(kit, TAG, boDem(cfg, 'the'));
    const g = goc(cfg, ip, { projectPath: kho });
    const x1 = path.join(tam, 'da-xoa-1'), x2 = path.join(tam, 'da-xoa-2');
    ghiSo(cfg, [g]);
    const nen = chay(cfg, { root: kit });
    ghiSo(cfg, [g, banGhi({ projectPath: x1, installPath: ip, version: SO }), banGhi({ projectPath: x2, installPath: ip, version: '0.0.1' })]);
    const k = chay(cfg, { root: kit });
    const mc = k.co('[kiem-ban-cai] VÀNG mo-coi:');
    const lenh = sauNhan(mc[0], 'lệnh dọn: ');
    const truoc = fs.readFileSync(soCua(cfg));
    const a = lenh ? ap('bash', lenh) : null;
    const sau = docSo(cfg);
    const k2 = chay(cfg, { root: kit });
    const datCua = (s) => (s.match(/TỔNG KẾT: ĐẠT (\d+) /) || [])[1];
    kiem('KL-7', [
      [mc.length === 1 && mc[0].includes('2 bản ghi trỏ thư mục đã xoá') && mc[0].includes(x1) && mc[0].includes(x2), `dòng mo-coi «${mc.join(' | ')}»`],
      [!!lenh, 'thiếu «lệnh dọn:»'],
      [!k.dong.some(x => !x.includes('VÀNG mo-coi:') && (x.includes(x1) || x.includes(x2))), 'bản ghi mồ côi có mặt ở dòng khác'],
      [datCua(k.cuoi) === datCua(nen.cuoi) && !!datCua(k.cuoi), `số ĐẠT «${k.cuoi}» ≠ «${nen.cuoi}»`],
      [k.cuoi.includes('2 bản ghi mồ côi'), `TỔNG KẾT «${k.cuoi}»`],
      [a && a.status === 0, `áp lệnh dọn thoát ${a && a.status}: ${a && a.stderr}`],
      [!k2.dong.some(x => x.includes('mo-coi')), 'chạy lại vẫn có mo-coi'],
      [JSON.stringify(sau) === JSON.stringify([g]), `sổ sau dọn ${JSON.stringify(sau).slice(0, 200)}`],
    ]);
    kiem('KL-7 sao-luu', loiSaoLuu(cfg, truoc).map(m => [false, m]));
    try {
      const f = banTiem('don-bo-sao-luu', 'fs.copyFileSync(f,b);', '');
      const c = moi('cfg');
      const ipc = lưu(kit, TAG, boDem(c, 'the'));
      ghiSo(c, [goc(c, ipc, { projectPath: kho }), banGhi({ projectPath: x1, installPath: ipc, version: SO })]);
      const kt = chay(c, { root: kit, script: f });
      const lt = sauNhan(kt.co('VÀNG mo-coi:')[0], 'lệnh dọn: ');
      const tr = fs.readFileSync(soCua(c));
      if (lt) ap('bash', lt);
      kiem('KL-7-dot', [[!!lt && loiSaoLuu(c, tr).length > 0, 'bản tiêm bỏ sao lưu của lệnh dọn mà ca sao lưu vẫn xanh']]);
    } catch (e) { fail('KL-7-dot', e.message); }
  }

  // ===== KL-9: đường có dấu cách và nháy đơn — bash và zsh =====
  {
    const goc9 = path.join(tam, "có cách 'nháy'");
    fs.mkdirSync(goc9, { recursive: true });
    const vo = [['bash', true], ['zsh', spawnSync('sh', ['-c', 'command -v zsh'], { encoding: 'utf8' }).status === 0]];
    for (const [ten, co] of vo) {
      if (!co) { console.log(`BỎ QUA: KL-9 ${ten} — máy không có ${ten}`); continue; }
      const cfgDir = path.join(goc9, `cấu hình ${ten} 'x'`);
      const { cfg, phu } = dungCayPhu({ ten: `kho ${ten} 'y'`, cfgDir });
      const s = apLenhSua(cfg, phu, { vo: ten });
      const k2 = chay(cfg, { root: kit });
      kiem(`KL-9 ${ten}`, [[!!s.lenh, `thiếu lệnh sửa «${s.l}»`], [s.a && s.a.status === 0, `${ten} -c lệnh sửa thoát ${s.a && s.a.status}: ${s.a && s.a.stderr}`], [!k2.dong.some(x => x.includes('cay-phu')), 'chạy lại vẫn có cay-phu']]);
    }
  }

  // ===== KL-8: lệnh kiểm chỉ đọc =====
  const lech = CHI_DOC.filter(x => !x.bang);
  kiem('KL-8', [[CHI_DOC.length >= 12, `chỉ chụp được ${CHI_DOC.length} lần chạy`], [!lech.length, `sổ hay bộ đệm đổi sau khi chạy lệnh kiểm: ${lech.map(x => x.cfg).join(', ')}`]]);
  {
    const c = moi('cfg'); ghiSo(c, [goc(c, lưu(kit, TAG, boDem(c, 'the')), { projectPath: kho })]);
    const a = chup(c); fs.appendFileSync(soCua(c), ' ');
    kiem('KL-8-nhay', [[chup(c) !== a, 'ghi một byte vào sổ mà phép chụp không đổi']]);
  }
}

try { main(); } catch (e) { fail('KL-0 dung', e.stack || e.message); }
finally {
  // Dọn rác, không phải phép đo — thử lại khi tệp còn đang được ghi; vẫn hỏng thì nói ra, không lật kết quả các ca.
  try { fs.rmSync(tam, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 }); }
  catch (e) { console.log(`CẢNH BÁO: KL — không dọn được thư mục tạm ${tam}: ${e.code || e.message}`); }
}
console.log(soFail ? `KL: ${soFail} ca FAIL` : 'KL: mọi ca PASS');
process.exitCode = soFail ? 1 : 0;
