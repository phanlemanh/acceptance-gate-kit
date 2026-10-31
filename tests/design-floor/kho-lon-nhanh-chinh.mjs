#!/usr/bin/env node
// Bộ đo hồ sơ va-design-floor-kho-lon-nhanh-chinh (#460): lệnh bậc ở kho có danh sách tệp git trên 1 MiB, git hỏng nói
// lỗi thật, S3/S4 tìm nhánh chính qua origin/HEAD, kho nhỏ dùng main y như 2.36.0, và quét cùng lớp trần bộ đệm.
// Bản gốc = cây phát hành 2.36.0 (sha ghim dưới) lấy TRỌN scripts + lib + design-floor bằng git archive — không lấy
// điểm rẽ khỏi nhánh chính, vì sau khi gộp điểm rẽ chính là bản vá. Kho fixture là git thật do mã sinh trong lượt: kho
// lớn dựng chỉ mục bằng `git update-index --index-info`; kho có remote clone từ một remote trần để origin/HEAD do chính
// git ghi. Mỗi nhãn chạy chiều xanh trên bản sửa, chiều đỏ trên bản gốc với thông điệp ghim, rồi đột biến cùng nhãn trên
// bản sao lệnh — đột biến phải làm đúng ca đỏ với đúng thông điệp ghim.
// Dùng: node tests/design-floor/kho-lon-nhanh-chinh.mjs [--chi LON,HONG,KHAC,CU,NHO,LOP]
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TMP = mkdtempSync(join(tmpdir(), 'df-va460-'));
const GOC_SHA = '4f891b078abae111b60301e31984961362d8da08'; // thẻ v2.36.0
const SLUG = 'vd';
const MIB = 1024 * 1024;
const TOKENS = JSON.stringify({ color: { ink: { $type: 'color', $value: '#111111' } } });
const REG = JSON.stringify({ version: '0.1.0', components: [] });
// Trang có hai lỗi sàn autofix sửa được (thiếu thẻ viewport, id trùng) và một khai báo dùng token.
const TRANG = '<!doctype html><html><head><title>p</title><style>.a{color:var(--color-ink)}</style></head><body><div id="a" class="a">x</div><div id="a">y</div></body></html>\n';

let dem = 0;
const moi = (ten) => { const d = join(TMP, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const W = (R, f, s) => { mkdirSync(path.dirname(join(R, f)), { recursive: true }); writeFileSync(join(R, f), s); };
const gitR = (R, ...a) => execFileSync('git', a, { cwd: R, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * MIB }).trim();
const coRef = (R, ref) => spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], { cwd: R }).status === 0;
const bam = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

// ── bản gốc 2.36.0 ────────────────────────────────────────────────────────────────────────────────────
let gocCache = null;
function banGoc() {
  if (gocCache) return gocCache;
  const G = moi('goc');
  const tar = execFileSync('git', ['archive', GOC_SHA, 'scripts', 'lib', 'design-floor'], { cwd: KIT, maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', G], { input: tar });
  gocCache = G;
  return G;
}

// Bản sao kit cho đột biến: mọi thư mục là liên kết, riêng scripts/ là thư mục thật chứa liên kết từng tệp; tệp bị đột
// biến được chép rồi sửa. Chuỗi cũ phải có đúng một lần (không thì đột biến hỏng).
function kitDotBien(tep, ...cap) {
  const K = moi('kit');
  for (const d of ['lib', 'design-floor']) symlinkSync(join(KIT, d), join(K, d));
  mkdirSync(join(K, 'scripts'));
  for (const f of readdirSync(join(KIT, 'scripts'))) if (f !== tep) symlinkSync(join(KIT, 'scripts', f), join(K, 'scripts', f));
  let noi = readFileSync(join(KIT, 'scripts', tep), 'utf8');
  for (const [cu, thay] of cap) {
    if (noi.split(cu).length !== 2) throw new Error(`đột biến hỏng: «${cu.slice(0, 60)}» không có đúng một lần trong ${tep}`);
    noi = noi.replace(cu, thay);
  }
  writeFileSync(join(K, 'scripts', tep), noi);
  return K;
}

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────────────
function chay(kit, ten, args, cwd, env = {}) {
  const r = spawnSync(process.execPath, [join(kit, 'scripts', ten), ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { ec: r.status, out: r.stdout || '', err: r.stderr || '' };
}
const bac = (kit, R, ...them) => chay(kit, 'design-floor-bac.mjs', ['--root', R, ...them], R);
const s1 = (kit, R) => chay(kit, 'design-floor-s1.mjs', ['--root', R, '--slug', SLUG], R, { DESIGN_FLOOR_KHONG_MANG: '1' });
const s3 = (kit, R) => chay(kit, 'design-floor-s3.mjs', ['--root', R, '--slug', SLUG], R);
const s4 = (kit, R) => chay(kit, 'design-floor-s4.mjs', ['--root', R], R);
const dong = (r) => `thoát ${r.ec} · out «${r.out.trim()}» · err «${r.err.trim()}»`;

// ── fixture ───────────────────────────────────────────────────────────────────────────────────────────
function cfgKho({ bac: b = 'M1', sinhLai = null } = {}) {
  let cfg = 'design:\n  surface_globs: ["web/**", "design/**"]\n';
  const df = [];
  if (b === 'M2') df.push('  tokens: design/t.json', '  registry: design/r.json');
  if (sinhLai) df.push(`  sinh_lai: [${sinhLai.map((l) => JSON.stringify(l)).join(', ')}]`);
  if (df.length) cfg += `design_floor:\n${df.join('\n')}\n`;
  return cfg;
}
function dungGoc(R, cfg, them = {}) {
  W(R, '_acceptance/config.yaml', cfg);
  W(R, `_acceptance/${SLUG}/contract.md`, '---\nfeature: vd\n---\n');
  W(R, 'design/t.json', TOKENS);
  W(R, 'design/r.json', REG);
  W(R, 'README.md', 'kho mẫu\n');
  for (const [f, s] of Object.entries(them)) W(R, f, s);
}
function initKho(R, nhanh) {
  gitR(R, 'init', '-q', '-b', nhanh);
  gitR(R, 'config', 'user.email', 't@t');
  gitR(R, 'config', 'user.name', 't');
}
function commitVong(R, vong, tu = null) {
  gitR(R, 'checkout', '-q', '-b', 'vong', ...(tu ? [tu] : []));
  for (const [f, s] of Object.entries(vong)) W(R, f, s);
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'vòng', '--allow-empty');
}

// Kho không remote, nhánh chính `nhanh`.
function khoTran({ nhanh = 'main', cfg, goc = {}, vong = {} }) {
  const R = moi('tran');
  dungGoc(R, cfg, goc);
  initKho(R, nhanh);
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'gốc');
  commitVong(R, vong);
  return R;
}

// Kho clone từ remote trần có nhánh mặc định `nhanh` — origin/HEAD do git ghi lúc clone. `sauClone` nhận đường kho hạt
// giống để đẩy thêm commit lên remote SAU khi clone (nhánh cục bộ đứng sau origin/<nhanh>).
function khoClone({ vong = {}, nhanh = 'main', ...o }) {
  const { R } = khoCloneThem({ nhanh, ...o });
  commitVong(R, vong, `origin/${nhanh}`);
  return R;
}
function khoCloneThem({ nhanh = 'main', cfg, goc = {}, sauClone = null }) {
  const B = moi('remote');
  gitR(B, 'init', '-q', '--bare', '-b', nhanh);
  const H = moi('hat');
  dungGoc(H, cfg, goc);
  initKho(H, nhanh);
  gitR(H, 'add', '-A');
  gitR(H, 'commit', '-qm', 'gốc');
  gitR(H, 'remote', 'add', 'origin', B);
  gitR(H, 'push', '-q', 'origin', nhanh);
  const R = join(moi('clone'), 'k');
  execFileSync('git', ['clone', '-q', B, R], { stdio: 'ignore' });
  gitR(R, 'config', 'user.email', 't@t');
  gitR(R, 'config', 'user.name', 't');
  if (sauClone) {
    for (const [f, s] of Object.entries(sauClone)) W(H, f, s);
    gitR(H, 'add', '-A');
    gitR(H, 'commit', '-qm', 'sau clone');
    gitR(H, 'push', '-q', 'origin', nhanh);
    gitR(R, 'fetch', '-q', 'origin');
  }
  return { R, H, B };
}

// Kho lớn: chỉ mục dựng thẳng bằng update-index (một blob, N đường dài) — git ls-files in trên 1 MiB mà không ghi N tệp.
const N_LON = 10000;
function khoLon() {
  const R = moi('lon');
  dungGoc(R, cfgKho());
  initKho(R, 'main');
  gitR(R, 'add', '-A');
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: R, input: 'x\n', encoding: 'utf8' }).trim();
  const duong = [];
  for (let i = 0; i < N_LON; i++) duong.push(`${i % 2 ? 'web' : 'lib'}/d${i % 50}/${'x'.repeat(100)}-${i}.css`);
  execFileSync('git', ['update-index', '--add', '--index-info'], { cwd: R, input: duong.map((d) => `100644 ${blob}\t${d}\n`).join('') });
  gitR(R, 'commit', '-qm', 'gốc lớn');
  const nKhop = duong.filter((d) => d.startsWith('web/')).length + 2; // + design/t.json, design/r.json
  return { R, nKhop };
}

// Ảnh chụp băm mọi tệp dưới gốc (gồm .git/ nếu có).
function chup(R) {
  const anh = new Map();
  const di = (d) => {
    for (const t of readdirSync(join(R, d), { withFileTypes: true })) {
      const f = d ? `${d}/${t.name}` : t.name;
      if (t.isDirectory()) di(f);
      else anh.set(f, bam(join(R, f)));
    }
  };
  di('');
  return anh;
}
const giongAnh = (a, b) => a.size === b.size && [...a].every(([f, h]) => b.get(f) === h);

// ── ca ───────────────────────────────────────────────────────────────────────────────────────────────
const MSG_BASE = 'không tìm được nhánh chính để so diff — truyền --base <ref>';
let lonCache = null;
const lon = () => lonCache || (lonCache = khoLon());

const CA = {
  'LON-CO': () => {
    const { R } = lon();
    const n = Buffer.byteLength(execFileSync('git', ['ls-files'], { cwd: R, encoding: 'utf8', maxBuffer: 256 * MIB }));
    return n > MIB ? null : `LON-CO: git ls-files chỉ ${n} byte, không vượt 1 MiB`;
  },
  'LON-SUA': (kit) => {
    const { R, nKhop } = lon();
    const j = bac(kit, R, '--json');
    if (j.ec !== 0) return `LON-SUA: thoát ${j.ec} — ${j.err.trim()}`;
    const o = JSON.parse(j.out);
    if (o.bac !== 'M1') return `LON-SUA: ra ${o.bac} — ${o.ly_do}`;
    if (!o.ly_do.startsWith(`có giao diện (${nKhop} tệp khớp design.surface_globs)`)) return `LON-SUA: lý do «${o.ly_do}», mong ${nKhop} tệp khớp`;
    const c = bac(kit, R);
    if (!c.out.startsWith('design-floor: bậc M1 — có giao diện (')) return `LON-SUA: dòng chữ «${c.out.trim()}»`;
    return null;
  },
  'LON-GOC': () => {
    const { R } = lon();
    const o = JSON.parse(bac(banGoc(), R, '--json').out);
    return o.bac === 'M0' && o.ly_do.startsWith('design.surface_globs không khớp tệp nào') ? null : `LON-GOC: bản 2.36.0 ra ${o.bac} — ${o.ly_do}`;
  },

  'HONG-BON': (kit) => {
    const R = moi('khong-git');
    dungGoc(R, cfgKho());
    const env = { GIT_CEILING_DIRECTORIES: path.dirname(R) };
    const truoc = chup(R);
    const ds = [
      ['bac', chay(kit, 'design-floor-bac.mjs', ['--root', R], R, env)],
      ['s1', chay(kit, 'design-floor-s1.mjs', ['--root', R, '--slug', SLUG], R, { ...env, DESIGN_FLOOR_KHONG_MANG: '1' })],
      ['s3', chay(kit, 'design-floor-s3.mjs', ['--root', R, '--slug', SLUG], R, env)],
      ['s4', chay(kit, 'design-floor-s4.mjs', ['--root', R], R, env)],
    ];
    for (const [ten, r] of ds) {
      if (r.ec !== 1) return `HONG-BON: ${ten} thoát ${r.ec} — ${dong(r)}`;
      // Đúng MỘT dòng stderr mang tiền tố của lệnh: lệnh sập không bắt cũng thoát 1 và in cùng thông điệp, kèm chồng lời gọi.
      const dongLoi = r.err.trim().split('\n');
      const tienTo = `design-floor-${ten}: không đọc được danh sách tệp git (`;
      if (dongLoi.length !== 1 || !dongLoi[0].startsWith(tienTo)) return `HONG-BON: ${ten} stderr không phải một dòng «${tienTo}…» — ${dong(r)}`;
      if ((r.out + r.err).includes('không khớp tệp nào')) return `HONG-BON: ${ten} in «không khớp tệp nào»`;
    }
    return giongAnh(truoc, chup(R)) ? null : 'HONG-BON: cây đổi sau bốn lệnh';
  },
  'HONG-GOC': () => {
    const R = moi('khong-git');
    dungGoc(R, cfgKho());
    const r = chay(banGoc(), 'design-floor-bac.mjs', ['--root', R], R, { GIT_CEILING_DIRECTORIES: path.dirname(R) });
    return r.ec === 0 && r.out === '' ? null : `HONG-GOC: bản 2.36.0 ${dong(r)}`;
  },

  'KHAC-CO': () => {
    const R = khacKho();
    const h = gitR(R, 'symbolic-ref', 'refs/remotes/origin/HEAD');
    if (h !== 'refs/remotes/origin/onehub') return `KHAC-CO: origin/HEAD = ${h}`;
    const co = ['origin/main', 'origin/master', 'main', 'master'].filter((r) => coRef(R, r));
    return co.length ? `KHAC-CO: fixture có ${co.join(', ')}` : null;
  },
  'KHAC-SUA': (kit) => {
    const R = khacKho();
    const a = s3(kit, R);
    if (a.ec !== 0) return `KHAC-SUA: S3 thoát ${a.ec} — ${a.err.trim()}`;
    const b = s4(kit, R);
    if (b.ec !== 2 || b.out.trim() !== 'design-floor S4: hex thô web/a.css:1 #fff') return `KHAC-SUA: S4 ${dong(b)}`;
    return null;
  },
  'KHAC-GOC': () => {
    const R = khacKho();
    for (const [ten, r] of [['S3', s3(banGoc(), R)], ['S4', s4(banGoc(), R)]]) {
      if (r.ec !== 1 || !r.err.includes(MSG_BASE)) return `KHAC-GOC: bản 2.36.0 ${ten} ${dong(r)}`;
    }
    return null;
  },

  'CU-LUI': (kit) => {
    const R = khoClone({ cfg: cfgKho(), vong: { 'web/a.css': '.a { color: #fff; }\n' } });
    gitR(R, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/xoa');
    const sua = s4(kit, R);
    const goc = s4(banGoc(), R);
    if (dong(sua) !== dong(goc)) return `CU-LUI: bản sửa ≠ bản gốc — sửa ${dong(sua)} / gốc ${dong(goc)}`;
    return sua.ec === 2 ? null : `CU-LUI: S4 không chấm (${dong(sua)})`;
  },
  'CU-DUNG': (kit) => {
    const R = khacKho();
    gitR(R, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/xoa');
    const r = s4(kit, R);
    if (r.ec !== 1) return `CU-DUNG: ${dong(r)}`;
    return r.err.includes('origin/HEAD') && r.err.includes('origin/xoa') && r.err.includes('truyền --base <ref>') ? null : `CU-DUNG: thông điệp «${r.err.trim()}»`;
  },
  'CU-KHONG': (kit) => {
    const R = khoTran({ nhanh: 'onehub', cfg: cfgKho(), vong: { 'web/a.css': '.a { color: #fff; }\n' } });
    const sua = s4(kit, R);
    const goc = s4(banGoc(), R);
    if (sua.ec !== 1 || !goc.err.includes(MSG_BASE)) return `CU-KHONG: sửa ${dong(sua)} / gốc ${dong(goc)}`;
    return sua.err === goc.err ? null : `CU-KHONG: thông điệp sửa «${sua.err.trim()}» ≠ gốc «${goc.err.trim()}»`;
  },

  // Remote đổi master→main rồi fetch --prune: origin/master mất, origin/HEAD vẫn trỏ nó, nhánh cục bộ master CÒN. Bản sửa
  // không được chọn master cục bộ cũ — phải ra đúng như 2.36.0 (origin/main).
  'CU-DOI-TEN': (kit) => {
    const { R, H, B } = khoCloneThem({ nhanh: 'master', cfg: cfgKho(), sauClone: { 'web/moi.css': '.m { color: #123; }\n' } });
    gitR(H, 'branch', '-q', '-m', 'master', 'main');
    gitR(H, 'push', '-q', 'origin', 'main');
    gitR(B, 'symbolic-ref', 'HEAD', 'refs/heads/main');
    gitR(H, 'push', '-q', 'origin', '--delete', 'master');
    gitR(R, 'fetch', '-q', '--prune', 'origin');
    if (coRef(R, 'origin/master') || !coRef(R, 'master') || gitR(R, 'symbolic-ref', 'refs/remotes/origin/HEAD') !== 'refs/remotes/origin/master') return 'CU-DOI-TEN: fixture không đúng hình (origin/master phải mất, master cục bộ còn, origin/HEAD treo)';
    commitVong(R, { 'web/a.css': '.a { color: #fff; }\n' }, 'origin/main');
    const sua = s4(kit, R);
    const goc = s4(banGoc(), R);
    if (dong(sua) !== dong(goc)) return `CU-DOI-TEN: bản sửa ≠ bản gốc — sửa ${dong(sua)} / gốc ${dong(goc)}`;
    return sua.ec === 2 ? null : `CU-DOI-TEN: S4 không chấm (${dong(sua)})`;
  },
  // Bản sao có remote mà không có origin/HEAD (checkout kiểu CI trên git cũ hơn 2.48: init + remote add + fetch). Git từ
  // 2.48 tự ghi origin/HEAD khi fetch (remote.<tên>.followRemoteHEAD), nên fixture gỡ nó tường minh để ca đúng hình trên
  // mọi bản git. Giới hạn đã khai: như 2.36.0, thoát 1.
  'CU-CI': (kit) => {
    const { B } = khoCloneThem({ nhanh: 'onehub', cfg: cfgKho() });
    const R = moi('ci');
    initKho(R, 'vong');
    gitR(R, 'remote', 'add', 'origin', B);
    gitR(R, 'fetch', '-q', 'origin');
    spawnSync('git', ['remote', 'set-head', 'origin', '-d'], { cwd: R, stdio: 'ignore' });
    gitR(R, 'checkout', '-q', '-B', 'vong', 'origin/onehub');
    if (coRef(R, 'refs/remotes/origin/HEAD')) return 'CU-CI: fixture có origin/HEAD';
    const sua = s4(kit, R);
    const goc = s4(banGoc(), R);
    if (sua.ec !== 1 || dong(sua) !== dong(goc)) return `CU-CI: sửa ${dong(sua)} / gốc ${dong(goc)}`;
    return sua.err.includes(MSG_BASE) ? null : `CU-CI: thông điệp «${sua.err.trim()}»`;
  },

  'NHO-CLONE-M1': (kit) => soHaiBan(kit, 'NHO-CLONE-M1', () => khoClone({ cfg: cfgKho(), vong: { 'web/a.css': '.a { color: #fff; }\n' }, sauClone: { 'web/cu.css': '.c { color: #abc; }\n' } })),
  'NHO-CLONE-M2': (kit) => soHaiBan(kit, 'NHO-CLONE-M2', () => khoClone({ cfg: cfgKho({ bac: 'M2' }), vong: { 'web/p.html': TRANG, 'web/a.css': '.a { color: #fff; }\n' } })),
  'NHO-TRAN-M1': (kit) => soHaiBan(kit, 'NHO-TRAN-M1', () => khoTran({ cfg: cfgKho(), vong: { 'web/a.css': '.a { color: #fff; }\n' } })),
  'NHO-TRAN-M2': (kit) => soHaiBan(kit, 'NHO-TRAN-M2', () => khoTran({ cfg: cfgKho({ bac: 'M2' }), vong: { 'web/p.html': TRANG, 'web/a.css': '.a { color: #fff; }\n' } })),

  'LOP-QUET': (kit) => {
    let n = 0;
    for (const f of readdirSync(join(kit, 'scripts')).filter((t) => /^design-floor-.*\.mjs$/.test(t)).sort()) {
      const noi = readFileSync(join(kit, 'scripts', f), 'utf8');
      for (const m of noi.matchAll(RE_GOI)) {
        const loi = loiGoi(noi, m.index + m[0].length - 1);
        n++;
        if (!loi.includes(TRAN)) return `LOP-QUET: thiếu maxBuffer scripts/${f}:${noi.slice(0, m.index).split('\n').length}`;
      }
    }
    if (!n) return 'LOP-QUET: không quét được lời gọi nào';
    console.log(`  LOP-QUET: ${n} lời gọi, lời gọi nào cũng mang maxBuffer`);
    return null;
  },
  'LOP-SINH-LAI': (kit) => {
    const r = s3(kit, khoSinhLai());
    return r.ec === 0 ? null : `LOP-SINH-LAI: S3 ${dong(r)}`;
  },
  'LOP-GOC': () => {
    const r = s3(banGoc(), khoSinhLai());
    return r.ec === 1 && r.err.includes('lệnh sinh lại thoát null') ? null : `LOP-GOC: bản 2.36.0 S3 ${dong(r)}`;
  },
};

function khacKho() {
  return khoClone({ nhanh: 'onehub', cfg: cfgKho(), vong: { 'web/a.css': '.a { color: #fff; }\n' } });
}
function khoSinhLai() {
  return khoTran({ cfg: cfgKho({ sinhLai: ['node to.mjs'] }), goc: { 'to.mjs': `process.stdout.write('x'.repeat(${2 * MIB}));\n` }, vong: { 'web/a.css': '.a { }\n' } });
}

// Lời gọi lệnh con đọc stdout và trần bộ đệm mà mọi lời gọi phải mang (bằng trần s3/s4 đã dùng từ 2.36.0).
const RE_GOI = /\b(execFileSync|spawnSync|execSync)\(/g;
const TRAN = 'maxBuffer: 64 * 1024 * 1024';
// Ma trận đột biến LOP: mỗi lời gọi một đột biến gỡ trần của RIÊNG nó — phải đỏ đúng tệp:dòng của nó.
function dotTungLoiGoi() {
  const ds = [];
  for (const f of readdirSync(join(KIT, 'scripts')).filter((t) => /^design-floor-.*\.mjs$/.test(t)).sort()) {
    const noi = readFileSync(join(KIT, 'scripts', f), 'utf8');
    for (const m of noi.matchAll(RE_GOI)) {
      const loi = loiGoi(noi, m.index + m[0].length - 1);
      const dongSo = noi.slice(0, m.index).split('\n').length;
      const bo = loi.replace(`, ${TRAN}`, '');
      if (bo === loi || noi.split(loi).length !== 2) throw new Error(`ma trận LOP hỏng ở scripts/${f}:${dongSo}`);
      ds.push([`LOP-DOT ${f}:${dongSo}`, () => kitDotBien(f, [loi, bo]), 'LOP-QUET', `LOP-QUET: thiếu maxBuffer scripts/${f}:${dongSo}`]);
    }
  }
  return ds;
}

// Đoạn lời gọi từ dấu «(» mở tới dấu «)» khớp — đếm ngoặc, bỏ qua chuỗi và template.
function loiGoi(noi, mo) {
  let sau = 0;
  let q = null;
  for (let i = mo; i < noi.length; i++) {
    const c = noi[i];
    if (q) {
      if (c === '\\') i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '(') sau++;
    else if (c === ')' && --sau === 0) return noi.slice(mo, i + 1);
  }
  return noi.slice(mo);
}

// Hai bản sao giống hệt của một kho → bản sửa chạy trên bản A, bản 2.36.0 trên bản B; so từng lệnh sau khi thay đường tạm.
function soHaiBan(kit, id, dung) {
  const R = dung();
  const A = `${R}-sua`;
  const B = `${R}-goc`;
  cpSync(R, A, { recursive: true });
  cpSync(R, B, { recursive: true });
  const chuan = (s, X) => s.split(X).join('<K>').replace(/commit [0-9a-f]{7,40}/g, 'commit <sha>');
  const lenh = [
    ['bậc', (k, X) => bac(k, X)],
    ['bậc --json', (k, X) => bac(k, X, '--json')],
    ['S3', (k, X) => s3(k, X)],
    ['S4', (k, X) => s4(k, X)],
  ];
  let hex = false;
  for (const [ten, f] of lenh) {
    const a = f(kit, A);
    const b = f(banGoc(), B);
    if (a.ec !== b.ec || chuan(a.out, A) !== chuan(b.out, B) || chuan(a.err, A) !== chuan(b.err, B)) {
      return `${id}: ${ten} lệch — sửa ${dong(a)} / gốc ${dong(b)}`;
    }
    if (ten === 'S3') {
      const ds = (X) => gitR(X, 'show', '--name-only', '--format=%s', 'HEAD');
      if (ds(A) !== ds(B)) return `${id}: commit S3 lệch — sửa «${ds(A)}» / gốc «${ds(B)}»`;
    }
    if (ten === 'S4' && a.out.includes('hex thô')) hex = true;
  }
  return hex ? null : `${id}: S4 không in dòng hex thô nào — ca không thật sự chấm`;
}

// ── nhãn: chiều xanh + bản gốc + đột biến ─────────────────────────────────────────────────────────────
const NHAN = {
  LON: {
    xanh: ['LON-CO', 'LON-SUA', 'LON-GOC'],
    dot: [['LON-DOT', () => kitDotBien('design-floor-bac.mjs', ["['ls-files'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }", "['ls-files'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }"]), 'LON-SUA', 'LON-SUA: thoát 1 — design-floor-bac: không đọc được danh sách tệp git (']],
  },
  HONG: {
    xanh: ['HONG-BON', 'HONG-GOC'],
    dot: [
      ['HONG-DOT', () => kitDotBien('design-floor-bac.mjs', ['throw new Error(`không đọc được danh sách tệp git', 'dsTep = []; if (0) throw new Error(`không đọc được danh sách tệp git']), 'HONG-BON', 'HONG-BON: bac thoát 0'],
      ['HONG-DOT-S1', () => kitDotBien('design-floor-s1.mjs', ['  let ra;\n  try {\n    ra = chayS1(root, slug);\n  } catch (e) {\n    process.stderr.write(`design-floor-s1: ${e.message}\\n`);\n    return 1;\n  }\n', '  const ra = chayS1(root, slug);\n']), 'HONG-BON', 'HONG-BON: s1 stderr không phải một dòng'],
    ],
  },
  // Đột biến trên bản sao design-floor-s4.mjs: S3 nhập timBase qua đường thật của tệp liên kết nên vẫn dùng bản lành —
  // ca đỏ ở bước S4.
  KHAC: {
    xanh: ['KHAC-CO', 'KHAC-SUA', 'KHAC-GOC'],
    dot: [['KHAC-DOT', () => kitDotBien('design-floor-s4.mjs', ["'symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD'", "'symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/KHONG-CO'"]), 'KHAC-SUA', 'KHAC-SUA: S4 thoát 1']],
  },
  CU: {
    xanh: ['CU-LUI', 'CU-DOI-TEN', 'CU-DUNG', 'CU-KHONG', 'CU-CI'],
    dot: [['CU-DOT', () => kitDotBien('design-floor-s4.mjs', ['for (const ref of [...khai, ...TEN_QUEN]) {', 'for (const ref of khai.length ? khai : TEN_QUEN) {']), 'CU-LUI', 'CU-LUI: bản sửa ≠ bản gốc']],
  },
  NHO: {
    xanh: ['NHO-CLONE-M1', 'NHO-CLONE-M2', 'NHO-TRAN-M1', 'NHO-TRAN-M2'],
    dot: [['NHO-DOT', () => kitDotBien('design-floor-s4.mjs', ['khai = [`origin/${ten}`]', 'khai = [ten]']), 'NHO-CLONE-M1', 'NHO-CLONE-M1: S4 lệch']],
  },
  LOP: {
    xanh: ['LOP-QUET', 'LOP-SINH-LAI', 'LOP-GOC'],
    dot: 'tung-loi-goi',
  },
};

function chayCa(id, kit = KIT) {
  try {
    return CA[id](kit);
  } catch (e) {
    return `${id}: ca hỏng — ${String(e.message).split('\n')[0]}`;
  }
}

const argv = process.argv.slice(2);
const iChi = argv.indexOf('--chi');
const chi = iChi >= 0 ? argv[iChi + 1].split(',') : Object.keys(NHAN);
let hong = 0;
for (const nhan of chi) {
  const n = NHAN[nhan];
  if (!n) { console.log(`FAIL: nhãn lạ ${nhan}`); hong++; continue; }
  for (const id of n.xanh) {
    const loi = chayCa(id);
    if (loi) { console.log(`FAIL: ${loi}`); hong++; } else console.log(`PASS: ${id}`);
  }
  let dsDot = n.dot;
  if (dsDot === 'tung-loi-goi') {
    try { dsDot = dotTungLoiGoi(); } catch (e) { console.log(`FAIL: ${e.message}`); hong++; dsDot = []; }
    console.log(`  LOP: ${dsDot.length} đột biến, một cho mỗi lời gọi`);
  }
  for (const [ten, dung, ca, ghim] of dsDot) {
    let loi;
    try {
      loi = chayCa(ca, dung());
    } catch (e) {
      loi = `đột biến không dựng được — ${e.message}`;
    }
    if (loi && loi.startsWith(ghim)) console.log(`PASS: ${ten} — đỏ đúng «${loi.split('\n')[0]}»`);
    else { console.log(`FAIL: ${ten} — mong ca ${ca} đỏ «${ghim}…», được ${loi ? `«${loi}»` : 'XANH'}`); hong++; }
  }
}
rmSync(TMP, { recursive: true, force: true });
console.log(hong ? `kho-lon-nhanh-chinh: ĐỎ ${hong}` : 'kho-lon-nhanh-chinh: XANH');
process.exit(hong ? 1 : 0);
