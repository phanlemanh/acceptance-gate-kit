// ghi-tri-thuc.test.mjs — hồ sơ ghi-tri-thuc (TT2, đợt tri-thuc-2410). Ca GT-1…GT-10.
//
// Mọi kho thử dựng trong thư mục tạm của lượt (git init + commit thật; remote trần bằng git init --bare). Khuôn rút từ
// tri-thuc-template.md thật lúc chạy; kết quả bên ghi được đọc bằng lint TT1 thật (scripts/tri-thuc.mjs). Đường dẫn suy
// từ vị trí tệp. Mỗi ca đỏ: chiều xanh trên cùng đầu vào trước; mutant là bản sao bộ máy với nhát tiêm khớp đúng một lần.
// «Ảnh cây» = băm mọi tệp (trừ .git) + git status --porcelain + HEAD, chụp trước và sau.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, realpathSync, existsSync, readdirSync, statSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const KHUON = readFileSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'), 'utf8');
const TAM = realpathSync(mkdtempSync(path.join(tmpdir(), 'gt-tri-thuc-')));
let soDo = 0;
const ok = (ca, m) => console.log(`PASS: ${ca} — ${m}`);
const bad = (ca, m) => { soDo++; console.log(`FAIL: ${ca} — ${m}`); };
const ca = async (ten, fn) => { try { const r = await fn(); if (r && r.length) bad(ten, r.join(' ; ')); else ok(ten, 'đạt'); } catch (e) { bad(ten, `ném lỗi: ${e.stack || e}`); } };

const khoi = ten => { const m = KHUON.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const LOAI = khoi('TRI-THUC-LOAI').trim().split(/\s+/);
const NGUON = khoi('TRI-THUC-NGUON').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
const RE_DONG = new RegExp(khoi('TRI-THUC-RAW-DONG').trim());
const RE_CON_TRO = new RegExp(khoi('TRI-THUC-CON-TRO').trim());
const khoaCua = b => { const d = b.split('\n'); const h = d.indexOf('---', 1); return d.slice(1, h).map(l => (l.match(/^([A-Za-z_]+):/) || [])[1]).filter(Boolean); };
const KHOA_RAW = khoaCua(khoi('TRI-THUC-RAW'));
const KHOA_TRANG = khoaCua(khoi('TRI-THUC-TRANG'));

const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => execFileSync('git', ['hash-object', '--', p], { encoding: 'utf8' }).trim();
const ghiTep = (p, t) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, t); return p; };
let dem = 0; const thuMuc = ten => { const d = path.join(TAM, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const khoGit = d => { mkdirSync(d, { recursive: true }); g(d, 'init', '-q', '-b', 'main'); g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't'); return d; };
const commit = (d, m = 'c') => { g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', m); };
const head = d => { try { return g(d, 'rev-parse', 'HEAD'); } catch { return 'khong-head'; } };

function anh(d) {
  if (!existsSync(d)) return 'vắng';
  const tep = [];
  const di = x => { for (const e of readdirSync(x, { withFileTypes: true })) { if (e.name === '.git') continue; const p = path.join(x, e.name); if (e.isDirectory()) di(p); else tep.push(`${path.relative(d, p)} ${bam(p)}`); } };
  di(d);
  const laGit = existsSync(path.join(d, '.git'));
  return [...tep.sort(), laGit ? g(d, 'status', '--porcelain') : '', laGit ? head(d) : ''].join('\n');
}

const CFG_NOI = 'tri_thuc:\n  noi: docs/tri-thuc\n';
const cfgKho = (ten, remote) => `tri_thuc:\n  kho:\n    ten: ${ten}\n    duong: ../${ten}\n` + (remote ? `    remote: ${remote}\n` : '');
function khoNoi(cfg = CFG_NOI) {
  const d = khoGit(thuMuc('kho'));
  ghiTep(path.join(d, '_acceptance/config.yaml'), cfg); ghiTep(path.join(d, 'README.md'), 'kho thử\n'); commit(d);
  return d;
}
function khoRieng({ remoteKhai = null, cfgThem = '', dungRieng = true, laGit = true } = {}) {
  const cha = thuMuc('cap'); const d = khoGit(path.join(cha, 'tieu-thu')); const ten = 'nguon-rieng';
  const C = path.join(cha, ten); const B = path.join(cha, `${ten}.git`);
  ghiTep(path.join(d, '_acceptance/config.yaml'), cfgKho(ten, remoteKhai === null ? B : remoteKhai) + cfgThem); commit(d);
  if (dungRieng) {
    if (laGit) { execFileSync('git', ['init', '-q', '--bare', B]); khoGit(C); ghiTep(path.join(C, 'README.md'), 'kho riêng\n'); commit(C); g(C, 'remote', 'add', 'origin', B); g(C, 'push', '-q', '-u', 'origin', 'main'); }
    else mkdirSync(C, { recursive: true });
  }
  return { d, C, B, ten };
}
const nguonNgoai = (ten = 'chu.md', noiDung = 'trích phiên\n') => ghiTep(path.join(thuMuc('nguon'), ten), noiDung);
const than = (t = '# Tóm\n\nNội dung tóm.\n') => ghiTep(path.join(thuMuc('than'), 'than.md'), t);

const BIN_GHI = path.join(KIT, 'scripts/tri-thuc-ghi.mjs');
const BIN_DOC = path.join(KIT, 'scripts/tri-thuc.mjs');
const chay = (bin, root, args, env = {}) => { const r = spawnSync('node', [bin, '--root', root, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } }); return { thoat: r.status, out: r.stdout.trim(), err: r.stderr.trim() }; };
const ghi = (root, args, { bin = BIN_GHI, env = {} } = {}) => chay(bin, root, args, env);
const lint = (root, bin = BIN_DOC) => chay(bin, root, ['--kiem']);
const conTro = (root, ref) => chay(BIN_DOC, root, ['--con-tro', ref]);
const doiSo = ({ loai = 'phien', goc = 'phiên-1', ten = 'vi-du', tep, trang = 'chu-de/vi-du.md', than: th, ma, luc = '2026-10-24', them = [] }) =>
  ['--loai', loai, '--goc', goc, '--ten', ten, ...[].concat(tep).flatMap(t => ['--tep', t]), '--trang', trang, ...(th ? ['--than', th] : []), ...(ma ? ['--ma', ma] : []), '--luc', luc, ...them];

// Bản sao bộ máy (scripts, lib, skills) để tiêm: sua = { tệp: [[tìm, thay], …] }, mỗi nhát khớp đúng một lần.
function banSaoMay(sua = {}) {
  const d = thuMuc('may');
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true });
  for (const [tep, cap] of Object.entries(sua)) for (const [tim, thay] of cap) {
    const p = path.join(d, tep); const t = readFileSync(p, 'utf8'); const n = t.split(tim).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (phải 1): ${tep} «${tim.slice(0, 60)}»`);
    writeFileSync(p, t.replace(tim, thay));
  }
  return d;
}
const GHI_REL = 'scripts/tri-thuc-ghi.mjs';

// gh giả: ghi đối số ra GH_LOG, trả độ riêng tư theo GH_MODE (PUBLIC · PRIVATE · khác = thoát 1).
const GH_DIR = thuMuc('gh');
ghiTep(path.join(GH_DIR, 'gh'), '#!/bin/sh\necho "$@" >> "$GH_LOG"\ncase "$GH_MODE" in PUBLIC) echo PUBLIC;; PRIVATE) echo PRIVATE;; *) echo "gh: không kết nối được" >&2; exit 1;; esac\n');
chmodSync(path.join(GH_DIR, 'gh'), 0o755);
const ghGia = mode => { const log = path.join(thuMuc('ghlog'), 'log'); writeFileSync(log, ''); return { env: { PATH: `${GH_DIR}:${process.env.PATH}`, GH_MODE: mode, GH_LOG: log }, log }; };

const GHI_MD = path.join(KIT, 'tri-thuc/commands/ghi.md');
const khoiLenh = t => { const m = t.match(/<!-- <<<TT-GHI-LENH -->\n```\n([\s\S]*?)\n```\n<!-- TT-GHI-LENH>>> -->/); return m ? m[1].trim() : null; };
const LENH_GT1 = `node "$AG/scripts/tri-thuc-ghi.mjs" --root . --loai <loai> --goc '<goc>' --ten <ten> --tep <tep> --trang <trang> --than <than> --ma <ma>`;

// ── GT-1: ghi raw + trang bằng dòng lệnh của ghi.md, lint TT1 đọc lại xanh ──
await ca('GT-1', () => {
  const sai = []; const d = khoNoi();
  const lenh = khoiLenh(readFileSync(GHI_MD, 'utf8')); if (!lenh) return ['ghi.md thiếu khối TT-GHI-LENH'];
  const chu = nguonNgoai('chu.md', 'trích phiên chat\n'); const anhNhiPhan = path.join(path.dirname(chu), 'anh.png');
  writeFileSync(anhNhiPhan, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 255, 254, 10, 0]));
  const th = than();
  const dong = lenh.replace('<loai>', 'phien').replace('<goc>', 'phiên-1').replace('<ten>', 'vi-du').replace('--tep <tep>', `--tep ${chu} --tep ${anhNhiPhan}`)
    .replace('<trang>', 'chu-de/vi-du.md').replace('<than>', th).replace('<ma>', 'A1,A2') + ' --luc 2026-10-24';
  const r = spawnSync('sh', ['-c', dong], { cwd: d, encoding: 'utf8', env: { ...process.env, AG: KIT } });
  if (r.status !== 0) return [`lệnh ghi thoát ${r.status}: ${r.stderr}`];
  const G = path.join(d, 'docs/tri-thuc'); const R = path.join(G, 'raw/2026-10-24-vi-du');
  for (const [goc, ten] of [[chu, 'chu.md'], [anhNhiPhan, 'anh.png']]) if (!readFileSync(goc).equals(readFileSync(path.join(R, ten)))) sai.push(`${ten} không giống từng byte bản gốc`);
  const nm = readFileSync(path.join(R, 'nguon.md'), 'utf8');
  for (const k of KHOA_RAW) if (!new RegExp(`^${k}: \\S`, 'm').test(nm)) sai.push(`nguon.md thiếu khoá ${k}`);
  if (!/^loai: phien$/m.test(nm)) sai.push('nguon.md không ghi loai: phien');
  const dongTep = nm.split('\n').filter(l => RE_DONG.test(l));
  if (dongTep.length !== 2) sai.push(`nguon.md có ${dongTep.length} dòng tệp (phải 2)`);
  for (const ten of ['chu.md', 'anh.png']) { const l = dongTep.find(x => x.match(RE_DONG)[1] === ten); if (!l || l.match(RE_DONG)[2] !== bam(path.join(R, ten))) sai.push(`dòng tệp ${ten} thiếu hay sai băm`); }
  const luat = readFileSync(path.join(G, 'TRI-THUC.md'), 'utf8');
  if (luat !== khoi('TRI-THUC-LUAT').replaceAll('<kho>', path.basename(d)) + '\n') sai.push('TRI-THUC.md khác khối TRI-THUC-LUAT');
  const l = lint(d); if (l.thoat !== 0 || !l.out.includes('tri thức: 1 trang, 1 raw, 0 lỗi')) sai.push(`lint TT1: ${l.thoat} «${l.out}»`);
  // Chiều đỏ: bên ghi viết dòng tệp lệch khuôn → lint TT1 đỏ đúng mã.
  const may = banSaoMay({ [GHI_REL]: [['mau.replace(m[1], ten).replace(m[2], bam));', "mau.replace(m[1], ten).replace(m[2], bam).replace(/`/g, ''));"]] });
  const d2 = khoNoi(); const r2 = ghi(d2, doiSo({ tep: chu, than: th }), { bin: path.join(may, GHI_REL) });
  const l2 = lint(d2);
  if (r2.thoat !== 0 || l2.thoat !== 1 || !l2.out.includes('[raw-bi-sua]') || !l2.out.includes('tệp không có dòng trong nguon.md')) sai.push(`GT-1-mutant: ghi ${r2.thoat}, lint ${l2.thoat} «${l2.out}»`);
  else ok('GT-1-mutant', 'dòng tệp lệch khuôn → lint TT1 «[raw-bi-sua] … tệp không có dòng trong nguon.md»');
  return sai;
});

// ── GT-2: năm loại nguồn, ma trận mười một hàng ──
async function maTranGT2(bin) {
  const hang = [];
  const dung = ({ loai, goc, tepTrong = null, theoDoi = true }) => {
    const d = khoNoi(); let tep;
    if (tepTrong) { tep = ghiTep(path.join(d, 'docs', tepTrong), 'tệp trong kho\n'); if (theoDoi) commit(d); }
    else tep = nguonNgoai();
    return { d, args: doiSo({ loai, goc, tep, than: than() }) };
  };
  const H = [
    ['phien hợp lệ', { loai: 'phien', goc: 'phiên-1' }, 0],
    ['artifact hợp lệ', { loai: 'artifact', goc: 'https://claude.ai/public/artifacts/x' }, 0],
    ['issue hợp lệ', { loai: 'issue', goc: 'chu/kho#12' }, 0],
    ['tep-may hợp lệ', { loai: 'tep-may', goc: '' }, 0],
    ['tep-kho hợp lệ', { loai: 'tep-kho', goc: '', tepTrong: 'a.md' }, 0],
    ['phien phạm', { loai: 'phien', goc: '' }, 2, 'loại phien:'],
    ['artifact phạm', { loai: 'artifact', goc: 'http://x' }, 2, 'loại artifact:'],
    ['issue phạm', { loai: 'issue', goc: 'abc' }, 2, 'loại issue:'],
    ['tep-may phạm', { loai: 'tep-may', goc: '', tepTrong: 'b.md' }, 2, 'loại tep-may:'],
    ['tep-kho phạm', { loai: 'tep-kho', goc: '', tepTrong: 'c.md', theoDoi: false }, 2, 'loại tep-kho:'],
    ['loại lạ', { loai: 'blog', goc: 'x' }, 2, 'loại nguồn lạ:'],
  ];
  for (const [ten, dv, mong, cau] of H) {
    const { d, args } = dung(dv); const truoc = anh(d); const r = ghi(d, args, { bin });
    const nm = path.join(d, 'docs/tri-thuc/raw/2026-10-24-vi-du/nguon.md');
    hang.push({ ten, thoat: r.thoat, mong, cau, err: r.err, loaiGhi: existsSync(nm) ? (readFileSync(nm, 'utf8').match(/^loai: (\S+)$/m) || [])[1] : null, loai: dv.loai, doi: anh(d) !== truoc });
  }
  return hang;
}
await ca('GT-2', async () => {
  const sai = []; const H = await maTranGT2(BIN_GHI);
  if (H.length !== 11) sai.push(`ma trận ${H.length} hàng (phải 11)`);
  for (const h of H) {
    console.log(`  GT-2 · ${h.ten} · thoát ${h.thoat} · ${h.mong === 0 ? `loai ${h.loaiGhi}` : h.err}`);
    if (h.thoat !== h.mong) { sai.push(`${h.ten}: thoát ${h.thoat} (phải ${h.mong}) «${h.err}»`); continue; }
    if (h.mong === 0 && h.loaiGhi !== h.loai) sai.push(`${h.ten}: nguon.md ghi loai ${h.loaiGhi}`);
    if (h.mong === 2 && (!h.err.includes(h.cau) || h.doi)) sai.push(`${h.ten}: câu «${h.err}» hay ảnh cây đổi (${h.doi})`);
  }
  const la = H.find(h => h.ten === 'loại lạ');
  const nhan = la && (la.err.split('nhận: ')[1] || '').trim().split(/\s+/);
  if (!nhan || nhan.sort().join(' ') !== [...NGUON].sort().join(' ')) sai.push(`hàng loại lạ liệt ${nhan} (khối: ${NGUON})`);
  const may = banSaoMay({ [GHI_REL]: [["if (git(root, ['ls-files', '--error-unmatch', '--', r]).status !== 0) return `${x} không được git theo dõi trong kho tiêu thụ`;", '']] });
  const M = await maTranGT2(path.join(may, GHI_REL));
  const doi = M.filter((m, i) => m.thoat !== H[i].thoat).map(m => m.ten);
  if (doi.join() !== 'tep-kho phạm') sai.push(`GT-2-mutant: hàng đổi ${JSON.stringify(doi)} (phải chỉ tep-kho phạm)`);
  else ok('GT-2-mutant', 'gỡ kiểm tep-kho → đúng hàng tep-kho-phạm thôi thoát 2, mười hàng kia giữ nguyên');
  return sai;
});

// ── GT-3: raw bất biến, dùng lại, hàng nối ──
async function hangKhacNoiDung(bin) {
  const d = khoNoi(); const chu = nguonNgoai(); const th = than();
  const r1 = ghi(d, doiSo({ tep: chu, than: th })); if (r1.thoat !== 0) throw new Error(`ghi lần đầu ${r1.thoat}: ${r1.err}`);
  writeFileSync(chu, 'trích phiên khác một byte\n'); const truoc = anh(d);
  const r = ghi(d, doiSo({ tep: chu }), { bin }); return { r, doi: anh(d) !== truoc };
}
await ca('GT-3', async () => {
  const sai = [];
  const { r, doi } = await hangKhacNoiDung(BIN_GHI);
  if (r.thoat !== 2 || !r.err.includes('raw bất biến: raw/2026-10-24-vi-du đã có nội dung khác — nguồn mới là thư mục mới') || doi) sai.push(`khác nội dung: ${r.thoat} «${r.err}» ảnh đổi ${doi}`);
  const d = khoNoi(); const chu = nguonNgoai(); const th = than();
  ghi(d, doiSo({ tep: chu, than: th })); const h0 = head(d);
  const y = ghi(d, doiSo({ tep: chu }));
  if (y.thoat !== 0 || !y.out.includes('dùng lại raw') || head(d) !== h0) sai.push(`y hệt: ${y.thoat} «${y.out}» HEAD ${head(d) === h0 ? 'giữ' : 'đổi'}`);
  async function noi(bin) {
    const e = khoNoi(); const c = nguonNgoai(); const t = than();
    const a = ghi(e, doiSo({ tep: c, than: t, them: ['--khong-commit'] })); const h1 = head(e);
    if (a.thoat !== 0) throw new Error(`--khong-commit thoát ${a.thoat}`);
    const b = ghi(e, doiSo({ tep: c, than: t }), { bin }); const h2 = head(e);
    const ten = h2 !== h1 ? g(e, 'show', '--name-only', '--format=', 'HEAD') : '';
    const c2 = ghi(e, doiSo({ tep: c, than: than('# Thân mới\n') }), { bin }); const h3 = head(e);
    const ten3 = h3 !== h2 ? g(e, 'show', '--name-only', '--format=', 'HEAD') : '';
    return { b, tien: h2 !== h1, ten, c2, tien3: h3 !== h2, ten3 };
  }
  const n = await noi(BIN_GHI);
  if (n.b.thoat !== 0 || !n.tien || !n.ten.includes('raw/2026-10-24-vi-du/chu.md') || !n.ten.includes('wiki/chu-de/vi-du.md')) sai.push(`nối 1: ${n.b.thoat} tiến ${n.tien} «${n.ten}»`);
  if (n.c2.thoat !== 0 || !n.tien3 || !n.ten3.includes('wiki/chu-de/vi-du.md')) sai.push(`nối 2: ${n.c2.thoat} tiến ${n.tien3} «${n.ten3}»`);
  const m1 = banSaoMay({ [GHI_REL]: [['    if (!khop) return sai(`raw bất biến: raw/${tenRaw} đã có nội dung khác — nguồn mới là thư mục mới`);\n', '']] });
  const k1 = await hangKhacNoiDung(path.join(m1, GHI_REL));
  if (k1.r.thoat === 2) sai.push('GT-3-mutant: gỡ phép so mà hàng khác-nội-dung vẫn thoát 2'); else ok('GT-3-mutant', `gỡ phép so nội dung → hàng khác-nội-dung thoát ${k1.r.thoat}`);
  const m2 = banSaoMay({ [GHI_REL]: [['if (!tt.stdout.trim()) {', 'if (dungLai || !tt.stdout.trim()) {']] });
  const k2 = await noi(path.join(m2, GHI_REL));
  if (k2.tien) sai.push('GT-3-mutant-theo-doi: bỏ kiểm theo dõi mà HEAD vẫn tiến'); else ok('GT-3-mutant-theo-doi', 'bỏ kiểm raw đã theo dõi → hàng nối 1 đỏ «HEAD không tiến»');
  return sai;
});

// ── GT-4: trang — tạo, gộp, thân, loại trang ──
await ca('GT-4', () => {
  const sai = []; const d = khoNoi(); const G = path.join(d, 'docs/tri-thuc'); const P = path.join(G, 'wiki/chu-de/vi-du.md');
  const r1 = ghi(d, doiSo({ tep: nguonNgoai('mot.md'), than: than('# Thân gốc\n\nGiữ nguyên.\n'), ma: 'A1,A2' }));
  if (r1.thoat !== 0) return [`ghi lần một ${r1.thoat}: ${r1.err}`];
  if (lint(d).thoat !== 0) sai.push('lint sau lần một đỏ');
  const thanCu = readFileSync(P, 'utf8').split('\n---\n').slice(1).join('\n---\n');
  const r2 = ghi(d, doiSo({ ten: 'vi-du-2', tep: nguonNgoai('hai.md'), ma: 'A2,A3', luc: '2026-10-25' }));
  if (r2.thoat !== 0) return [...sai, `ghi lần hai ${r2.thoat}: ${r2.err}`];
  const t = readFileSync(P, 'utf8'); const dong = t.split('\n'); const het = dong.indexOf('---', 1); const fm = dong.slice(1, het);
  const thuTu = fm.map(l => l.split(':')[0]);
  if (thuTu.join() !== KHOA_TRANG.join()) sai.push(`thứ tự khoá ${thuTu} ≠ khối ${KHOA_TRANG}`);
  const lay = k => (fm.find(l => l.startsWith(`${k}:`)) || '').slice(k.length + 1).trim();
  if (lay('ma') !== '[A1, A2, A3]') sai.push(`ma ${lay('ma')}`);
  if (lay('nguon') !== '[raw/2026-10-24-vi-du/mot.md, raw/2026-10-25-vi-du-2/hai.md]') sai.push(`nguon ${lay('nguon')}`);
  if (lay('cap_nhat') !== '2026-10-25') sai.push(`cap_nhat ${lay('cap_nhat')}`);
  if (t.split('\n---\n').slice(1).join('\n---\n') !== thanCu) sai.push('thân trang đổi khi không có --than');
  if (lint(d).thoat !== 0) sai.push('lint sau lần hai đỏ');
  let truoc = anh(d);
  const r3 = ghi(d, doiSo({ ten: 'ba', tep: nguonNgoai('ba.md'), trang: 'chu-de/moi.md' }));
  if (r3.thoat !== 2 || !r3.err.includes('--than thiếu') || anh(d) !== truoc) sai.push(`trang mới không --than: ${r3.thoat} «${r3.err}»`);
  truoc = anh(d);
  const r4 = ghi(d, doiSo({ ten: 'bon', tep: nguonNgoai('bon.md'), trang: 'blog/x.md', than: than() }));
  const liet = (r4.err.split('không thuộc: ')[1] || '').trim().split(/\s+/);
  if (r4.thoat !== 2 || liet.join(' ') !== LOAI.join(' ') || anh(d) !== truoc) sai.push(`loại trang lạ: ${r4.thoat} «${r4.err}»`);
  return sai;
});

// ── GT-5: commit đúng tập tệp ở kho riêng, không đẩy, hoàn lại khi commit hỏng ──
async function hangHook(bin) {
  const { d, C } = khoRieng(); ghiTep(path.join(C, '.git/hooks/pre-commit'), '#!/bin/sh\necho "hook chặn commit" >&2\nexit 1\n'); chmodSync(path.join(C, '.git/hooks/pre-commit'), 0o755);
  const a1 = anh(d); const a2 = anh(C);
  const r = ghi(d, doiSo({ tep: nguonNgoai(), than: than() }), { bin });
  return { r, doiTieuThu: anh(d) !== a1, doiRieng: anh(C) !== a2 };
}
await ca('GT-5', async () => {
  const sai = []; const { d, C, B } = khoRieng();
  const aTT = anh(d); const h0 = head(C); const rem0 = g(C, 'ls-remote', B);
  const r = ghi(d, doiSo({ tep: nguonNgoai(), than: than() }));
  if (r.thoat !== 0) return [`ghi ${r.thoat}: ${r.err}`];
  const n = Number(g(C, 'rev-list', '--count', `${h0}..HEAD`));
  const coTep = g(C, 'show', '--name-only', '--format=', 'HEAD').split('\n').sort();
  const mong = ['TRI-THUC.md', 'raw/2026-10-24-vi-du/chu.md', 'raw/2026-10-24-vi-du/nguon.md', 'wiki/chu-de/vi-du.md'].sort();
  console.log(`  GT-5 · commit có: ${coTep.join(', ')}\n  GT-5 · mong:     ${mong.join(', ')}`);
  if (n !== 1 || coTep.join() !== mong.join()) sai.push(`commit mới ${n}, tệp ${coTep}`);
  if (anh(d) !== aTT) sai.push('ảnh cây kho tiêu thụ đổi');
  if (g(C, 'ls-remote', B) !== rem0) sai.push('remote trần đổi — lệnh đã đẩy');
  if (!r.out.includes('cảnh báo: remote không phải GitHub')) sai.push('thiếu cảnh báo remote không phải GitHub');
  const h1 = head(C); const k = ghi(d, doiSo({ ten: 'khong-commit', tep: nguonNgoai(), them: ['--khong-commit'] }));
  if (k.thoat !== 0 || head(C) !== h1 || !existsSync(path.join(C, 'raw/2026-10-24-khong-commit/chu.md'))) sai.push(`--khong-commit: ${k.thoat} HEAD ${head(C) === h1 ? 'giữ' : 'đổi'}`);
  const kg = khoRieng({ laGit: false }); const a3 = anh(kg.d); const a4 = anh(kg.C);
  const rk = ghi(kg.d, doiSo({ tep: nguonNgoai(), than: than() }));
  if (rk.thoat !== 2 || !rk.err.includes('kho riêng không phải kho git') || anh(kg.d) !== a3 || anh(kg.C) !== a4) sai.push(`không phải kho git: ${rk.thoat} «${rk.err}»`);
  const hk = await hangHook(BIN_GHI);
  if (hk.r.thoat !== 2 || !hk.r.err.includes('hook chặn commit') || hk.doiTieuThu || hk.doiRieng) sai.push(`hook: ${hk.r.thoat} «${hk.r.err}» đổi ${hk.doiTieuThu}/${hk.doiRieng}`);
  const m = banSaoMay({ [GHI_REL]: [['    hoanLai();\n', '']] });
  const mk = await hangHook(path.join(m, GHI_REL));
  if (!mk.doiRieng) sai.push('GT-5-mutant: gỡ hoàn lại mà ảnh cây kho riêng không đổi'); else ok('GT-5-mutant', 'gỡ hoàn lại → «ảnh cây kho riêng đổi»');
  return sai;
});

// ── GT-6: đường trỏ in ra khớp khuôn và phân giải bằng --con-tro ──
await ca('GT-6', () => {
  const sai = [];
  for (const [ten, dung] of [['trong kho', () => { const d = khoNoi(); return { d, gocRepo: d, tien: '' }; }], ['kho riêng', () => { const k = khoRieng(); return { d: k.d, gocRepo: k.C, tien: `${k.ten}:` }; }]]) {
    const { d, gocRepo, tien } = dung();
    const r = ghi(d, doiSo({ tep: nguonNgoai(), than: than() })); if (r.thoat !== 0) { sai.push(`${ten}: ghi ${r.thoat}`); continue; }
    const tro = r.out.split('\n').filter(l => /^(raw|trang): /.test(l)).map(l => l.replace(/^(raw|trang): /, ''));
    if (tro.length !== 2) sai.push(`${ten}: ${tro.length} đường trỏ (phải 2)`);
    for (const t of tro) {
      const m = t.match(RE_CON_TRO); if (!m) { sai.push(`${ten}: «${t}» sai khuôn`); continue; }
      if ((m[1] ? `${m[1]}:` : '') !== tien) sai.push(`${ten}: tiền tố «${m[1] || ''}»`);
      const c = conTro(d, t); if (c.thoat !== 0) sai.push(`${ten}: --con-tro ${t} → ${c.thoat} «${c.out}»`);
    }
    const sha = (r.out.match(/^commit: (\S+)$/m) || [])[1];
    if (sha !== head(gocRepo)) sai.push(`${ten}: dòng commit ${sha} ≠ HEAD`);
    ghiTep(path.join(gocRepo, 'khac.txt'), 'khác\n'); commit(gocRepo);
    for (const t of tro) if (conTro(d, t).thoat !== 0) sai.push(`${ten}: sau commit khác ${t} không phân giải`);
  }
  return sai;
});

// ── GT-7: kho công khai chưa có kho riêng → mã 4 cho cả năm loại ──
const HANG_NAM = [['phien', 'phiên-1', null], ['artifact', 'https://claude.ai/x', null], ['issue', 'chu/kho#1', null], ['tep-may', '', null], ['tep-kho', '', 'a.md']];
async function namHangCongKhai(bin) {
  return HANG_NAM.map(([loai, goc, trongKho]) => {
    const d = khoNoi(CFG_NOI + '  cong_khai: true\n'); let tep = nguonNgoai();
    if (trongKho) { tep = ghiTep(path.join(d, 'docs', trongKho), 'tệp kho\n'); commit(d); }
    const truoc = anh(d); const r = ghi(d, doiSo({ loai, goc, tep, than: than() }), { bin });
    return { loai, d, r, doi: anh(d) !== truoc };
  });
}
await ca('GT-7', async () => {
  const sai = [];
  for (const h of await namHangCongKhai(BIN_GHI)) {
    const du = ['kho công khai chưa có kho riêng', 'khai tri_thuc.kho', 'bỏ cong_khai'].every(s => h.r.out.includes(s));
    if (h.r.thoat !== 4 || !du || h.doi) sai.push(`${h.loai}: ${h.r.thoat} câu đủ ${du} ảnh đổi ${h.doi}`);
  }
  for (const [loai, goc, trongKho] of HANG_NAM) {
    const k = khoRieng({ cfgThem: '  cong_khai: true\n' }); let tep = nguonNgoai();
    if (trongKho) { tep = ghiTep(path.join(k.d, 'docs', trongKho), 'tệp kho\n'); commit(k.d); }
    const truoc = anh(k.d); const r = ghi(k.d, doiSo({ loai, goc, tep, than: than() }));
    if (r.thoat !== 0 || !existsSync(path.join(k.C, 'raw/2026-10-24-vi-du/nguon.md')) || anh(k.d) !== truoc) sai.push(`đối chứng ${loai}: ${r.thoat} «${r.err}»`);
  }
  const may = banSaoMay({ [GHI_REL]: [['if (cfg.congKhai && trongKho) return', 'if (false) return']] });
  const M = await namHangCongKhai(path.join(may, GHI_REL));
  const conBon = M.filter(h => h.r.thoat === 4).map(h => h.loai);
  const lintDo = M.every(h => { const l = lint(h.d); return l.thoat === 1 && l.out.includes('[raw-trong-kho-cong-khai]'); });
  if (conBon.length || !lintDo) sai.push(`GT-7-mutant: còn thoát 4 ${conBon}, lint đỏ ${lintDo}`);
  else ok('GT-7-mutant', 'gỡ phép chặn → cả năm thôi thoát 4, lint TT1 «[raw-trong-kho-cong-khai]»');
  return sai;
});

// ── GT-8: hỏi GitHub độ riêng tư của nơi giữ raw ──
function hangRieng({ remoteKhai, originRieng = null, mode, bin = BIN_GHI }) {
  const k = khoRieng({ remoteKhai });
  if (originRieng) g(k.C, 'remote', 'set-url', 'origin', originRieng);
  const { env, log } = ghGia(mode); const a1 = anh(k.d); const a2 = anh(k.C);
  const r = ghi(k.d, doiSo({ tep: nguonNgoai(), than: than() }), { bin, env });
  return { r, log: readFileSync(log, 'utf8'), doi: anh(k.d) !== a1 || anh(k.C) !== a2 };
}
const URL_GH = 'https://github.com/chu/kho-rieng.git';
const DANG = [['https có .git', { remoteKhai: URL_GH }], ['https không .git', { remoteKhai: 'https://github.com/chu/kho-rieng' }],
  ['git@github.com:', { remoteKhai: 'git@github.com:chu/kho-rieng.git' }], ['ssh://git@github.com/', { remoteKhai: 'ssh://git@github.com/chu/kho-rieng.git' }],
  ['origin SSH', { remoteKhai: '', originRieng: 'git@github.com:chu/kho-rieng.git' }]];
await ca('GT-8', () => {
  const sai = []; let so = 0;
  const A = [['PUBLIC', 4, 'nơi giữ raw đang công khai trên GitHub: chu/kho-rieng'], ['PRIVATE', 0, null], ['LOI', 4, 'không kiểm được nơi giữ raw có riêng tư không']];
  for (const [mode, mong, cau] of A) {
    so++; const h = hangRieng({ remoteKhai: URL_GH, mode }); console.log(`  GT-8 (a) · ${mode} · thoát ${h.r.thoat}`);
    if (h.r.thoat !== mong || (cau && !h.r.out.includes(cau)) || (mong === 4 && h.doi) || !h.log.includes('chu/kho-rieng')) sai.push(`(a) ${mode}: ${h.r.thoat} «${h.r.out}» đổi ${h.doi} log «${h.log.trim()}»`);
  }
  for (const [ten, dv] of DANG) {
    so++; const h = hangRieng({ ...dv, mode: 'PUBLIC' }); console.log(`  GT-8 (b) · ${ten} · thoát ${h.r.thoat}`);
    if (h.r.thoat !== 4 || h.doi || !h.log.split('\n').some(l => l.includes('repo view chu/kho-rieng'))) sai.push(`(b) ${ten}: ${h.r.thoat} log «${h.log.trim()}»`);
  }
  so++; const gl = hangRieng({ remoteKhai: 'https://gitlab.com/chu/x.git', mode: 'PUBLIC' }); console.log(`  GT-8 (b) · gitlab · thoát ${gl.r.thoat}`);
  if (gl.r.thoat !== 0 || !gl.r.out.includes('cảnh báo: remote không phải GitHub')) sai.push(`(b) gitlab: ${gl.r.thoat} «${gl.r.out}»`);
  for (const [mode, mong] of [['PUBLIC', 4], ['PRIVATE', 0]]) {
    so++; const d = khoNoi(); g(d, 'remote', 'add', 'origin', 'https://github.com/chu/tieu-thu.git');
    const { env, log } = ghGia(mode); const truoc = anh(d); const r = ghi(d, doiSo({ tep: nguonNgoai(), than: than() }), { env });
    console.log(`  GT-8 (c) · ${mode} · thoát ${r.thoat}`);
    if (r.thoat !== mong || (mong === 4 && anh(d) !== truoc) || !readFileSync(log, 'utf8').includes('chu/tieu-thu')) sai.push(`(c) ${mode}: ${r.thoat} «${r.out}»`);
  }
  if (so !== 11) sai.push(`ma trận ${so} hàng (phải 11)`);
  const m1 = banSaoMay({ [GHI_REL]: [["if (g.stdout.trim().toUpperCase() === 'PUBLIC') return", 'if (false) return']] });
  const k1 = hangRieng({ remoteKhai: URL_GH, mode: 'PUBLIC', bin: path.join(m1, GHI_REL) });
  if (k1.r.thoat === 4) sai.push('GT-8-mutant: gỡ nhánh PUBLIC mà hàng (a)1 vẫn thoát 4'); else ok('GT-8-mutant', `gỡ nhánh PUBLIC → hàng (a)1 thoát ${k1.r.thoat}`);
  const m2 = banSaoMay({ [GHI_REL]: [['/^git@github\\.com:', '/^KHONG-git@github\\.com:'], ['/^ssh:\\/\\/git@github', '/^KHONG-ssh:\\/\\/git@github']] });
  const ssh = DANG.slice(2).map(([ten, dv]) => [ten, hangRieng({ ...dv, mode: 'PUBLIC', bin: path.join(m2, GHI_REL) }).r.thoat]);
  const https = DANG.slice(0, 2).map(([ten, dv]) => [ten, hangRieng({ ...dv, mode: 'PUBLIC', bin: path.join(m2, GHI_REL) }).r.thoat]);
  if (ssh.some(([, t]) => t === 4) || https.some(([, t]) => t !== 4)) sai.push(`GT-8-mutant-ssh: ssh ${JSON.stringify(ssh)} https ${JSON.stringify(https)}`);
  else ok('GT-8-mutant-ssh', 'bộ tách chỉ nhận https → ba hàng SSH thôi thoát 4, hai hàng https giữ thoát 4');
  return sai;
});

// ── GT-9: đối số nguy hiểm và «không đọc được ở đây» ──
function maTranGT9(bin) {
  const out = [];
  const H = [
    ['--ten có /', d => doiSo({ ten: 'a/b', tep: nguonNgoai(), than: than() }), 2, '--ten'],
    ['--ten có ..', d => doiSo({ ten: '..', tep: nguonNgoai(), than: than() }), 2, '--ten'],
    ['--trang có ..', d => doiSo({ trang: 'chu-de/../x.md', tep: nguonNgoai(), than: than() }), 2, '--trang'],
    ['--trang không .md', d => doiSo({ trang: 'chu-de/x.txt', tep: nguonNgoai(), than: than() }), 2, '--trang'],
    ['--tep không có', d => doiSo({ tep: path.join(TAM, 'khong-co.md'), than: than() }), 2, '--tep'],
    ['thiếu --tep', d => doiSo({ tep: [], than: than() }), 2, '--tep'],
  ];
  for (const [ten, a, mong, cau] of H) { const d = khoNoi(); const truoc = anh(d); const r = ghi(d, a(d), { bin }); out.push({ ten, r, mong, cau, doi: anh(d) !== truoc }); }
  const d7 = khoGit(thuMuc('kho')); ghiTep(path.join(d7, 'README.md'), 'x\n'); commit(d7);
  let truoc = anh(d7); out.push({ ten: 'không khai tri_thuc', r: ghi(d7, doiSo({ tep: nguonNgoai(), than: than() }), { bin }), mong: 2, cau: 'tri_thuc', doi: false }); out.at(-1).doi = anh(d7) !== truoc;
  const k = khoRieng({ dungRieng: false, remoteKhai: 'git@github.com:chu/kho-rieng.git' }); truoc = anh(k.d);
  out.push({ ten: 'kho riêng chưa có', r: ghi(k.d, doiSo({ tep: nguonNgoai(), than: than() }), { bin }), mong: 3, cau: `git clone git@github.com:chu/kho-rieng.git ${k.C}`, doi: false, them: `không đọc được ở đây: ${k.ten}` });
  out.at(-1).doi = anh(k.d) !== truoc;
  return out;
}
await ca('GT-9', () => {
  const sai = []; const H = maTranGT9(BIN_GHI);
  if (H.length !== 8) sai.push(`ma trận ${H.length} hàng (phải 8)`);
  for (const h of H) {
    const chu = h.mong === 3 ? h.r.out : h.r.err; console.log(`  GT-9 · ${h.ten} · thoát ${h.r.thoat} · ${chu.split('\n')[0]}`);
    if (h.r.thoat !== h.mong || !chu.includes(h.cau) || (h.them && !chu.includes(h.them)) || h.doi) sai.push(`${h.ten}: ${h.r.thoat} «${chu}» đổi ${h.doi}`);
  }
  const cau = H.filter(h => h.mong === 2).map(h => h.r.err);
  if (new Set(cau).size !== cau.length) sai.push('câu lỗi các hàng thoát 2 không riêng');
  const may = banSaoMay({ [GHI_REL]: [["if (path.isAbsolute(trang) || trang.split('/').includes('..')) return", 'if (false) return']] });
  const M = maTranGT9(path.join(may, GHI_REL)); const h3 = M.find(h => h.ten === '--trang có ..');
  if (h3.r.thoat === 2) sai.push('GT-9-mutant: gỡ chặn .. mà hàng --trang có .. vẫn thoát 2'); else ok('GT-9-mutant', `gỡ chặn .. → hàng --trang có .. thoát ${h3.r.thoat}`);
  return sai;
});

// ── GT-10: lệnh /tri-thuc:ghi ──
function kiemGhiMd(t) {
  const sai = [];
  if (t.includes('disable-model-invocation')) sai.push('ghi.md khoá model-invocation');
  const lenh = khoiLenh(t); if (!lenh) return ['thiếu khối TT-GHI-LENH'];
  if (lenh !== LENH_GT1) sai.push(`dòng lệnh của ghi.md lệch lệnh ca GT-1: «${lenh}»`);
  const ma = [...t.matchAll(/^- (\d) — /gm)].map(m => m[1]).sort().join(',');
  if (ma !== '0,2,3,4') sai.push(`bảng mã thoát ${ma} (phải 0,2,3,4)`);
  return sai;
}
await ca('GT-10', () => {
  const sai = kiemGhiMd(readFileSync(GHI_MD, 'utf8'));
  const readme = readFileSync(path.join(KIT, 'tri-thuc/README.md'), 'utf8');
  for (const l of ['/tri-thuc:kiem', '/tri-thuc:ghi']) if (!new RegExp(`^\\| \`${l}\` \\|`, 'm').test(readme)) sai.push(`README thiếu dòng ${l}`);
  const lenh = khoiLenh(readFileSync(GHI_MD, 'utf8'));
  const banSao = readFileSync(GHI_MD, 'utf8').replace(lenh, lenh.replace('--root .', '--root ..'));
  const m = kiemGhiMd(banSao);
  if (!m.some(x => x.startsWith('dòng lệnh của ghi.md lệch lệnh ca GT-1'))) sai.push(`GT-10-mutant không đỏ: ${JSON.stringify(m)}`);
  else ok('GT-10-mutant', 'đổi dòng lệnh trong khối → «dòng lệnh của ghi.md lệch lệnh ca GT-1»');
  return sai;
});

rmSync(TAM, { recursive: true, force: true });
console.log(soDo ? `Results: ${soDo} ca đỏ` : 'Results: mọi ca xanh');
process.exit(soDo ? 1 : 0);
