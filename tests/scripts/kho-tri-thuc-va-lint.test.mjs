// kho-tri-thuc-va-lint.test.mjs — hồ sơ kho-tri-thuc-va-lint (TT1, đợt tri-thuc-2410). Ca KT-1…KT-9.
//
// Mọi kho thử dựng trong thư mục tạm của lượt (git init + commit thật; remote trần bằng git init --bare). Trang, raw và
// nguon.md SINH từ khối marker rút từ khuôn tri-thuc-template.md thật; bản phạm vi là bản sao của bản phạm vi thật
// docs/plans/pham-vi-tri-thuc-2410.md. Đường dẫn suy từ vị trí tệp. Mỗi ca đỏ: kho lành xanh trước trên cùng đầu vào,
// rồi bản tiêm (bản sao bộ máy, nhát tiêm khớp đúng một lần) đỏ với thông điệp ghim.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, realpathSync, existsSync, appendFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const KHUON = readFileSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'), 'utf8');
const PV_THAT = path.join(KIT, 'docs/plans/pham-vi-tri-thuc-2410.md');
const TAM = realpathSync(mkdtempSync(path.join(tmpdir(), 'kt-tri-thuc-')));
let soDo = 0;
const LANH = [];
const ok = (ca, m) => console.log(`PASS: ${ca} — ${m}`);
const bad = (ca, m) => { soDo++; console.log(`FAIL: ${ca} — ${m}`); };
const ca = async (ten, fn) => { try { const r = await fn(); if (r && r.length) bad(ten, r.join(' ; ')); else ok(ten, 'đạt'); } catch (e) { bad(ten, `ném lỗi: ${e.stack || e}`); } };

const khoiCua = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const khoi = ten => khoiCua(KHUON, ten);
const BON_KHOI = ['TRI-THUC-TRANG', 'TRI-THUC-RAW', 'TRI-THUC-CON-TRO', 'TRI-THUC-LUAT'];
const LOAI = khoi('TRI-THUC-LOAI').trim().split(/\s+/);
const RE_CON_TRO = new RegExp(khoi('TRI-THUC-CON-TRO').trim());
const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => execFileSync('git', ['hash-object', '--', p], { encoding: 'utf8' }).trim();
const ghi = (p, t) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, t); };
let dem = 0; const thuMuc = ten => { const d = path.join(TAM, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const khoGit = d => { mkdirSync(d, { recursive: true }); g(d, 'init', '-q', '-b', 'main'); g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't'); return d; };
const commit = (d, m = 'c') => { g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', m); };

// Trang sinh từ khối TRI-THUC-TRANG: thay giá trị từng khoá theo thứ tự khối.
const trangTu = (khoiTrang, v) => khoiTrang.replace(/^([A-Za-z_]+):.*$/gm, (m, k) => (k in v ? `${k}: ${v[k]}` : m)) + '\n\nNội dung.\n';
const PV = (() => { const t = readFileSync(PV_THAT, 'utf8'); return { txt: t, ma: [...t.matchAll(/^- `([^`]+)` — /gm)].map(m => m[1]) }; })();
// Dựng gốc tri thức lành ở G: một raw hai tệp, ba trang (nền, chủ đề, đợt mang đủ mã của bản phạm vi thật).
function dungGoc(G, khoiTrang = khoi('TRI-THUC-TRANG')) {
  const R = 'raw/2026-10-24-vi-du';
  ghi(path.join(G, R, 'ghi-chu.md'), 'ghi chú gốc\n'); ghi(path.join(G, R, 'anh/a.txt'), 'ảnh giả\n');
  const raw = khoi('TRI-THUC-RAW'); const [dau] = raw.split('\n\n'); const mau = raw.split('\n').find(l => l.startsWith('- `'));
  const dong = f => mau.replace(/`[^`]+`/, '`' + f + '`').replace(/[0-9a-f]{40}/, bam(path.join(G, R, f)));
  ghi(path.join(G, R, 'nguon.md'), `${dau}\n\n${dong('anh/a.txt')}\n${dong('ghi-chu.md')}\n`);
  const n = `[${R}/ghi-chu.md]`;
  const [lNen, lChuDe, lDot] = LOAI;
  ghi(path.join(G, 'TRI-THUC.md'), khoi('TRI-THUC-LUAT') + '\n');
  ghi(path.join(G, 'wiki/nen/nen.md'), trangTu(khoiTrang, { loai: lNen, ma: '[]', nguon: n }));
  ghi(path.join(G, 'wiki/chu-de/chu-de.md'), trangTu(khoiTrang, { loai: lChuDe, ma: '[]', nguon: n }));
  ghi(path.join(G, 'wiki/dot/tri-thuc-2410.md'), trangTu(khoiTrang, { loai: lDot, ma: `[${PV.ma.join(', ')}]`, nguon: n }));
}
const CFG_NOI = 'tri_thuc:\n  noi: docs/tri-thuc\n';
const cfgKho = (ten, remote) => `tri_thuc:\n  kho:\n    ten: ${ten}\n    duong: ../${ten}\n    remote: ${remote}\n`;
function khoTrongKho({ them = '', ghiLanh = true } = {}) {
  const d = khoGit(thuMuc('kho'));
  ghi(path.join(d, '_acceptance/config.yaml'), CFG_NOI); ghi(path.join(d, 'docs/plans/pham-vi-tri-thuc-2410.md'), PV.txt);
  dungGoc(path.join(d, 'docs/tri-thuc')); commit(d);
  if (ghiLanh) LANH.push(lint(d).thoat);
  if (them) { ghi(path.join(d, '_acceptance/config.yaml'), CFG_NOI + them); commit(d); }
  return d;
}
// Kho tiêu thụ + kho riêng anh em (đã đẩy lên remote trần, nhánh theo dõi).
function khoCoKhoRieng({ dungRieng = true } = {}) {
  const cha = thuMuc('cap'); const d = khoGit(path.join(cha, 'tieu-thu')); const ten = 'nguon-rieng'; const C = path.join(cha, ten); const B = path.join(cha, `${ten}.git`);
  ghi(path.join(d, '_acceptance/config.yaml'), cfgKho(ten, B)); ghi(path.join(d, 'docs/plans/pham-vi-tri-thuc-2410.md'), PV.txt); commit(d);
  if (dungRieng) { execFileSync('git', ['init', '-q', '--bare', B]); khoGit(C); dungGoc(C); commit(C); g(C, 'remote', 'add', 'origin', B); g(C, 'push', '-q', '-u', 'origin', 'main'); LANH.push(lint(d).thoat); }
  return { d, C, B, ten };
}
const chay = (bin, cwdRoot, args, cwd = cwdRoot) => { const r = spawnSync('node', [bin, '--root', cwdRoot, ...args], { cwd, encoding: 'utf8' }); return { thoat: r.status, out: r.stdout.trim(), err: r.stderr.trim() }; };
const BIN = path.join(KIT, 'scripts/tri-thuc.mjs');
const lint = (root, extra = [], bin = BIN) => chay(bin, root, ['--kiem', ...extra]);
const dongLoi = out => out.split('\n').filter(l => l.startsWith('lỗi:'));
// Bản sao bộ máy (scripts, lib, skills) để tiêm.
function banSaoMay(sua = {}) {
  const d = thuMuc('may');
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true });
  for (const [tep, [tim, thay]] of Object.entries(sua)) {
    const p = path.join(d, tep); const t = readFileSync(p, 'utf8'); const n = t.split(tim).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (phải 1): ${tep} «${tim.slice(0, 60)}»`);
    writeFileSync(p, t.replace(tim, thay));
  }
  return d;
}

// ── KT-1: bộ đọc khối tri_thuc, ma trận chín hàng ──
await ca('KT-1', () => {
  const { docTriThuc } = require(path.join(KIT, 'scripts/tri-thuc-khoa.cjs')); const sai = [];
  const H = [
    ['vắng khối', '', v => v === null],
    ['chỉ noi', CFG_NOI, v => v.noi === 'docs/tri-thuc' && !v.congKhai && !v.kho && !v.loi.length],
    ['noi + cong_khai', CFG_NOI + '  cong_khai: true\n', v => v.congKhai === true && !v.loi.length],
    ['kho đủ', cfgKho('x', 'u'), v => v.kho && v.kho.ten === 'x' && v.kho.duong === '../x' && v.kho.remote === 'u' && !v.loi.length],
    ['thiếu noi lẫn kho', 'tri_thuc:\n  cong_khai: false\n', v => v.loi.includes('khối tri_thuc thiếu noi hoặc kho.duong'), 'khối tri_thuc thiếu noi hoặc kho.duong'],
    ['cong_khai: co', CFG_NOI + '  cong_khai: co\n', v => v.loi.includes('cong_khai phải là true hoặc false'), 'cong_khai phải là true hoặc false'],
    ['kho thiếu duong', 'tri_thuc:\n  kho:\n    ten: x\n', v => v.loi.includes('kho thiếu duong'), 'kho thiếu duong'],
    ['kho thiếu ten', 'tri_thuc:\n  kho:\n    duong: ../x\n', v => v.loi.includes('kho thiếu ten'), 'kho thiếu ten'],
    ['khoá lạ', CFG_NOI + '  abc: 1\n', v => !v.loi.length && v.canhBao.includes('khoá lạ trong tri_thuc: abc'), null, 'cảnh báo: khoá lạ trong tri_thuc: abc'],
  ];
  console.log('  KT-1 ma trận: ' + H.length + ' hàng');
  for (const [ten, cfg, dung, cauLoi, canhBao] of H) {
    const v = docTriThuc(cfg); if (!dung(v)) sai.push(`${ten}: ${JSON.stringify(v)}`);
    if (cauLoi || canhBao) {
      const d = khoGit(thuMuc('k1')); ghi(path.join(d, '_acceptance/config.yaml'), cfg); ghi(path.join(d, 'docs/tri-thuc/.keep'), ''); commit(d);
      const r = lint(d);
      if (cauLoi && !(r.thoat === 2 && r.err.includes(cauLoi))) sai.push(`${ten}: lint ${r.thoat} «${r.err}»`);
      if (canhBao && !(r.thoat !== 2 && r.out.includes(canhBao))) sai.push(`${ten}: không có «${canhBao}» (${r.thoat})`);
    }
  }
  return sai;
});

// ── KT-2: gốc kho riêng giải giống nhau ở checkout chính và worktree lồng sâu; mutant giải theo worktree ──
await ca('KT-2', () => {
  const sai = []; const { d, C } = khoCoKhoRieng();
  const wt = path.join(d, '.claude/worktrees/x'); g(d, 'worktree', 'add', '-q', wt);
  const mong = path.resolve(realpathSync(d), '../nguon-rieng');
  if (mong !== C) sai.push(`đường mong ${mong} != ${C}`);
  const a = lint(d); const b = lint(wt);
  console.log(`  KT-2 gốc ghim: ${mong}`);
  if (a.thoat !== 0 || b.thoat !== 0 || a.out !== b.out) sai.push(`checkout ${a.thoat} «${a.out}» vs worktree ${b.thoat} «${b.out}»`);
  const ref = `nguon-rieng:wiki/nen/nen.md#${bam(path.join(C, 'wiki/nen/nen.md'))}`;
  const c1 = chay(BIN, d, ['--con-tro', ref]); const c2 = chay(BIN, wt, ['--con-tro', ref]);
  if (c1.thoat !== 0 || c1.out !== path.join(C, 'wiki/nen/nen.md') || c2.out !== c1.out) sai.push(`con-tro ${c1.out} / ${c2.out}`);
  const M = banSaoMay({ 'scripts/tri-thuc.mjs': ['return path.dirname(realpathSync(r.stdout.trim()));', 'return realpathSync(root);'] });
  const m = lint(wt, [], path.join(M, 'scripts/tri-thuc.mjs'));
  if (m.out === b.out && m.thoat === b.thoat) sai.push('mutant giải theo worktree không bị bắt');
  else console.log('  KT-2-mutant: gốc tri thức lệch giữa checkout chính và worktree (mutant ra ' + m.thoat + ')');
  return sai;
});

// ── KT-3: kho lành dựng từ khuôn → xanh; khuôn tiêm đổi khoá nguon → trang-thieu-nguon mọi trang ──
await ca('KT-3', () => {
  const sai = [];
  for (const ten of BON_KHOI) { try { khoi(ten); } catch (e) { sai.push(e.message); } }
  for (const ten of BON_KHOI) {
    const bo = KHUON.replace(new RegExp(`<!-- <<<${ten} -->[\\s\\S]*?<!-- ${ten}>>> -->`), '');
    try { khoiCua(bo, ten); sai.push(`khuôn đã gỡ ${ten} mà vẫn rút được`); } catch (e) { if (e.message !== `khuôn thiếu khối ${ten}`) sai.push(`gỡ ${ten}: thông điệp «${e.message}»`); }
  }
  console.log(`  KT-3: rút đủ ${BON_KHOI.length} khối; gỡ từng khối → «khuôn thiếu khối <tên>»`);
  if (!existsSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'))) sai.push('khuôn không có');
  const d = khoTrongKho(); if (readFileSync(path.join(d, 'docs/tri-thuc/TRI-THUC.md'), 'utf8').trim() !== khoi('TRI-THUC-LUAT').trim()) sai.push('TRI-THUC.md không dựng từ khối LUAT');
  const r = lint(d);
  if (!(r.thoat === 0 && r.out.split('\n').pop() === 'tri thức: 3 trang, 1 raw, 0 lỗi')) sai.push(`lành: ${r.thoat} «${r.out}» «${r.err}»`);
  const M = banSaoMay({ 'skills/acceptance/references/tri-thuc-template.md': ['nguon: [raw/2026-10-24-vi-du/ghi-chu.md]\ncap_nhat', 'nguon_x: [raw/2026-10-24-vi-du/ghi-chu.md]\ncap_nhat'] });
  const m = lint(d, [], path.join(M, 'scripts/tri-thuc.mjs')); const L = dongLoi(m.out);
  if (!(m.thoat === 1 && L.length === 3 && L.every(l => l.startsWith('lỗi: [trang-thieu-nguon] wiki/')))) sai.push(`khuôn tiêm: ${m.thoat} ${JSON.stringify(L)}`);
  else console.log('  KT-3-do: khuôn tiêm → 3 dòng trang-thieu-nguon');
  return sai;
});

// ── KT-4 / KT-5: ma trận mười một vế, mười một mutant ──
const C1 = 'wiki/chu-de/chu-de.md'; const RAWD = 'raw/2026-10-24-vi-du';
const sua = (d, tep, f) => { const p = path.join(d, tep); writeFileSync(p, f(readFileSync(p, 'utf8'))); };
const HANG = [
  { ten: 'trang thiếu khoá nguon', dung: () => { const d = khoTrongKho(); sua(d, 'docs/tri-thuc/' + C1, t => t.replace(/^nguon:.*\n/m, '')); return { d }; }, mong: `lỗi: [trang-thieu-nguon] ${C1}: thiếu khoá nguon` },
  { ten: 'nguon rỗng', dung: () => { const d = khoTrongKho(); sua(d, 'docs/tri-thuc/' + C1, t => t.replace(/^nguon:.*$/m, 'nguon: []')); return { d }; }, mong: `lỗi: [trang-thieu-nguon] ${C1}: nguon rỗng` },
  { ten: 'frontmatter thiếu --- đóng', dung: () => { const d = khoTrongKho(); sua(d, 'docs/tri-thuc/' + C1, t => t.replace(/\n---\n/, '\n')); return { d }; }, mong: `lỗi: [trang-thieu-nguon] ${C1}: frontmatter sai khuôn (thiếu dòng --- mở hay đóng)` },
  { ten: 'nguon trỏ tệp không có', dung: () => { const d = khoTrongKho(); sua(d, 'docs/tri-thuc/' + C1, t => t.replace(/^nguon:.*$/m, 'nguon: [raw/khong-co.md]')); return { d }; }, mong: `lỗi: [nguon-khong-co] ${C1}: trỏ raw/khong-co.md — không có dưới gốc tri thức` },
  { ten: 'raw sửa một byte', dung: () => { const d = khoTrongKho(); appendFileSync(path.join(d, 'docs/tri-thuc', RAWD, 'ghi-chu.md'), 'x'); return { d }; }, mong: `lỗi: [raw-bi-sua] ${RAWD}/ghi-chu.md: băm khác dòng trong nguon.md` },
  { ten: 'raw thêm tệp không dòng', dung: () => { const d = khoTrongKho(); ghi(path.join(d, 'docs/tri-thuc', RAWD, 'moi.md'), 'mới\n'); return { d }; }, mong: `lỗi: [raw-bi-sua] ${RAWD}/moi.md: tệp không có dòng trong nguon.md` },
  { ten: 'raw xoá tệp còn dòng', dung: () => { const d = khoTrongKho(); unlinkSync(path.join(d, 'docs/tri-thuc', RAWD, 'anh/a.txt')); return { d }; }, mong: `lỗi: [raw-bi-sua] ${RAWD}/anh/a.txt: nguon.md liệt tệp không có` },
  { ten: 'mã không có trang (--pham-vi)', dung: () => { const d = khoTrongKho(); sua(d, 'docs/tri-thuc/wiki/dot/tri-thuc-2410.md', t => t.replace(/\[A1, /, '[')); return { d, extra: ['--pham-vi', 'docs/plans/pham-vi-tri-thuc-2410.md'] }; }, mong: 'lỗi: [ma-khong-co-trang] docs/plans/pham-vi-tri-thuc-2410.md: mã A1 của đợt tri-thuc-2410 không nằm trong ma của trang nào' },
  { ten: 'kho riêng commit chưa đẩy', dung: () => { const k = khoCoKhoRieng(); ghi(path.join(k.C, 'wiki/nen/them.txt'), 'x'); commit(k.C); return { d: k.d }; }, mong: 'lỗi: [kho-rieng-chua-day] nguon-rieng: 1 commit chưa đẩy lên origin/main' },
  { ten: 'kho riêng không theo dõi remote', dung: () => { const k = khoCoKhoRieng(); g(k.C, 'branch', '--unset-upstream'); return { d: k.d }; }, mong: 'lỗi: [kho-rieng-chua-day] nguon-rieng: nhánh của kho riêng không theo dõi remote' },
  { ten: 'raw trong kho công khai', dung: () => ({ d: khoTrongKho({ them: '  cong_khai: true\n' }) }), mong: `lỗi: [raw-trong-kho-cong-khai] ${RAWD}: kho công khai không giữ tài liệu thô — chuyển sang kho riêng (khai tri_thuc.kho)` },
];
const MUTANT = [
  ['if (!(K.nguon in fm))', 'if (false && !(K.nguon in fm))'],
  ['if (!ng || !ng.length)', 'if (false)'],
  ['if (!fm) { dat(CO.THIEU_NGUON', 'if (false) { dat(CO.THIEU_NGUON'],
  ['if (!existsSync(path.join(goc, n)))', 'if (false)'],
  ['if (bamTep(p) !== khai.get(r))', 'if (false)'],
  ['if (!khai.has(r)) {', 'if (false) {'],
  ['if (!existsSync(path.join(d, r))) dat(', 'if (false) dat('],
  ['if (!maCo.has(ma))', 'if (false)'],
  ['if (l.stdout.trim()) dat(', 'if (false) dat('],
  ['if (u.status !== 0) dat(', 'if (false) dat('],
  ['if (cfg.congKhai && trongKho && tepRaw.length)', 'if (false)'],
];
const KHO_HANG = HANG.map(h => { const k = h.dung(); return k; });
const ketQua = bin => KHO_HANG.map((k, i) => { const r = lint(k.d, k.extra || [], bin); return `${r.thoat}|${dongLoi(r.out).join('/')}`; });
const MONG = HANG.map(h => `1|${h.mong}`);
await ca('KT-4', () => {
  const sai = []; const kq = ketQua(BIN);
  console.log(`  KT-4 ma trận: ${HANG.length} hàng`);
  HANG.forEach((h, i) => { console.log(`    ${i + 1}. ${h.ten} → ${kq[i]}`); if (kq[i] !== MONG[i]) sai.push(`${h.ten}: «${kq[i]}» != «${MONG[i]}»`); });
  if (LANH.length < HANG.length || LANH.some(t => t !== 0)) sai.push(`kho lành trước hàng: ${JSON.stringify(LANH)}`);
  else console.log(`  KT-4 kho lành trước mỗi hàng thoát 0 (${LANH.length} lần)`);
  const doiChung = khoTrongKho({ ghiLanh: false }); const x = lint(doiChung); if (x.thoat !== 0) sai.push(`kho lành đối chứng (tự dò) ${x.thoat}`);
  const xp = lint(doiChung, ['--pham-vi', 'docs/plans/pham-vi-tri-thuc-2410.md']); if (xp.thoat !== 0 || dongLoi(xp.out).length) sai.push(`kho lành đối chứng (--pham-vi) ${xp.thoat} «${xp.out}»`);
  const k2 = khoCoKhoRieng(); const y = lint(k2.d); if (y.thoat !== 0) sai.push(`kho riêng lành đối chứng ${y.thoat} «${y.out}»`);
  const tuDo = lint(KHO_HANG[7].d); if (`${tuDo.thoat}|${dongLoi(tuDo.out).join('/')}` !== MONG[7]) sai.push(`mã không trang, lối tự dò: «${tuDo.out}»`);
  return sai;
});
await ca('KT-5', () => {
  const sai = []; console.log(`  KT-5: ${MUTANT.length} mutant × ${HANG.length} hàng`);
  MUTANT.forEach(([tim, thay], i) => {
    const M = banSaoMay({ 'scripts/tri-thuc.mjs': [tim, thay] }); const kq = ketQua(path.join(M, 'scripts/tri-thuc.mjs'));
    const lech = kq.map((x, j) => (x === MONG[j] ? '.' : 'X')).join('');
    console.log(`    mutant ${i + 1}: ${lech}`);
    if (kq[i] === MONG[i]) sai.push(`mutant ${i + 1} (${tim}) không bị bắt`);
    kq.forEach((x, j) => { if (j !== i && x !== MONG[j]) sai.push(`mutant ${i + 1} làm đổi hàng ${j + 1}`); });
  });
  return sai;
});

// ── KT-6: kho riêng chưa có bản ở máy → thoát 3 ──
await ca('KT-6', () => {
  const sai = []; const k = khoCoKhoRieng({ dungRieng: false });
  for (const args of [['--kiem'], ['--con-tro', `nguon-rieng:wiki/a.md#${'0'.repeat(40)}`]]) {
    const r = chay(BIN, k.d, args);
    if (!(r.thoat === 3 && r.out.includes('không đọc được ở đây: nguon-rieng') && r.out.includes(`git clone ${k.B} ${k.C}`) && !dongLoi(r.out).length)) sai.push(`${args[0]}: ${r.thoat} «${r.out}»`);
  }
  execFileSync('git', ['init', '-q', '--bare', k.B]); khoGit(k.C); dungGoc(k.C); commit(k.C); g(k.C, 'remote', 'add', 'origin', k.B); g(k.C, 'push', '-q', '-u', 'origin', 'main');
  const r = lint(k.d); if (r.thoat !== 0) sai.push(`đối chứng sau khi có kho riêng: ${r.thoat} «${r.out}»`);
  return sai;
});

// ── KT-7: đường trỏ năm hàng + gộp squash ──
await ca('KT-7', () => {
  const sai = []; const d = khoTrongKho(); const k = khoCoKhoRieng();
  const p = path.join(d, 'docs/tri-thuc/wiki/nen/nen.md'); const h = bam(p); const hk = bam(path.join(k.C, 'wiki/nen/nen.md'));
  const H = [
    [d, `wiki/nen/nen.md#${h}`, 0, p], [k.d, `nguon-rieng:wiki/nen/nen.md#${hk}`, 0, path.join(k.C, 'wiki/nen/nen.md')],
    [d, `wiki/nen/nen.md#${'1'.repeat(40)}`, 1, 'băm lệch: wiki/nen/nen.md'], [d, `wiki/khong.md#${h}`, 1, 'không có tệp: wiki/khong.md'], [d, 'abc', 2, 'đường trỏ sai khuôn'],
  ];
  console.log(`  KT-7 ma trận: ${H.length} hàng`);
  for (const [, ref, thoat] of H) if ((thoat !== 2) !== RE_CON_TRO.test(ref)) sai.push(`đường trỏ ${ref} lệch khối TRI-THUC-CON-TRO`);
  for (const [root, ref, thoat, chu] of H) { const r = chay(BIN, root, ['--con-tro', ref]); if (r.thoat !== thoat || !(r.out + r.err).includes(chu)) sai.push(`${ref}: ${r.thoat} «${r.out}${r.err}»`); }
  g(d, 'checkout', '-q', '-b', 'nhanh'); ghi(path.join(d, 'khac.txt'), 'x'); commit(d); g(d, 'checkout', '-q', 'main'); g(d, 'checkout', '-q', '-b', 'dich'); g(d, 'merge', '-q', '--squash', 'nhanh'); commit(d, 'squash');
  const r = chay(BIN, d, ['--con-tro', `wiki/nen/nen.md#${h}`]); if (r.thoat !== 0) sai.push(`sau squash ${r.thoat}`);
  return sai;
});

// ── KT-8: kho không khối → thoát 2; bên đọc cũ không nạp mô-đun tri thức ──
await ca('KT-8', () => {
  const sai = []; const d = khoGit(thuMuc('k8')); ghi(path.join(d, '_acceptance/config.yaml'), 'schema_version: 1\n'); commit(d);
  const r = lint(d); if (!(r.thoat === 2 && r.err === 'tri-thuc: kho chưa khai tri_thuc trong _acceptance/config.yaml')) sai.push(`không khối: ${r.thoat} «${r.err}»`);
  const doi = (M) => ['product-map.mjs --check', 'lo-trinh.mjs --hang TT1'].map(c => { const [s, ...a] = c.split(' '); const x = spawnSync('node', [path.join(M, 'scripts', s), '--root', KIT, ...a], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-24' } }); return `${x.status}\n${x.stdout}\n${x.stderr}`.split(M).join('<M>'); });
  const du = banSaoMay(); const thieu = banSaoMay(); for (const f of ['scripts/tri-thuc.mjs', 'scripts/tri-thuc-khoa.cjs']) rmSync(path.join(thieu, f));
  const a = doi(du); const b = doi(thieu);
  if (!a.every(x => x.startsWith('0\n'))) sai.push(`đối chứng dương: bộ máy đủ tệp không xanh — ${a.map(x => x.slice(0, 120)).join(' | ')}`);
  if (a.join() !== b.join()) sai.push('bản sao thiếu tệp tri thức cho đầu ra khác');
  const dauNhap = readFileSync(path.join(KIT, 'scripts/product-map.mjs'), 'utf8').split('\n').find(l => l.startsWith('import '));
  const mut = banSaoMay({ 'scripts/product-map.mjs': [dauNhap, `${dauNhap}\nawait import('./tri-thuc.mjs');`] }); for (const f of ['scripts/tri-thuc.mjs', 'scripts/tri-thuc-khoa.cjs']) rmSync(path.join(mut, f));
  const c = doi(mut); if (c.join() === a.join()) sai.push('mutant chèn nạp mô-đun tri thức không bị bắt'); else console.log('  KT-8-mutant: bên đọc cũ nạp mô-đun tri thức → đỏ');
  return sai;
});

// ── KT-9: lệnh /tri-thuc:kiem ──
await ca('KT-9', () => {
  const sai = []; const t = readFileSync(path.join(KIT, 'tri-thuc/commands/kiem.md'), 'utf8');
  if (t.includes('disable-model-invocation')) sai.push('kiem.md khoá model-invocation');
  const m = t.match(/<!-- <<<TT-KIEM-LENH -->\n```\n([\s\S]*?)\n```\n<!-- TT-KIEM-LENH>>> -->/); if (!m) return ['thiếu khối TT-KIEM-LENH'];
  const lenh = m[1].trim(); if (lenh !== 'node "$AG/scripts/tri-thuc.mjs" --root . --kiem') sai.push(`dòng lệnh «${lenh}»`);
  const d = khoTrongKho(); const r = spawnSync('sh', ['-c', lenh], { cwd: d, encoding: 'utf8', env: { ...process.env, AG: KIT } });
  if (r.status !== 0 || !r.stdout.includes('tri thức: 3 trang, 1 raw, 0 lỗi')) sai.push(`chạy lệnh trong kho lành: ${r.status} «${r.stdout}${r.stderr}»`);
  return sai;
});

rmSync(TAM, { recursive: true, force: true });
console.log(soDo ? `Results: ${soDo} ca đỏ` : 'Results: mọi ca xanh');
process.exit(soDo ? 1 : 0);
