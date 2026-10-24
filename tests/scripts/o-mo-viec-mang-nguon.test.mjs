// o-mo-viec-mang-nguon.test.mjs — hồ sơ o-mo-viec-mang-nguon (TT3, đợt tri-thuc-2410). Ca ON-1…ON-7.
//
// Mọi kho thử dựng trong thư mục tạm của lượt (git init + commit thật). Trang tri thức SINH từ khối TRI-THUC-TRANG rút từ
// khuôn tri-thuc-template.md thật; băm tính bằng git hash-object lúc chạy. «Bộ máy trước vòng» = git archive GOC_VONG
// scripts lib skills. Bản tiêm là bản sao scripts/lib/skills của cây với nhát tiêm khớp đúng một lần. Đường dẫn suy từ vị
// trí tệp. Mỗi ca đỏ chạy đối chứng xanh trước trên cùng đầu vào; ma trận viết sẵn, số hàng in ra.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, realpathSync, existsSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
// Gốc vòng: commit của nhánh chính lúc cắt vòng (#406 gộp TT1). Vòng sau đổi hình dạng ô cơ hội thì dời hằng này tới gốc
// vòng ấy — so từng byte với bộ máy trước vòng là lời hứa của AC-2, AC-3, AC-6.
const GOC_VONG = '6a51d4c221d55b8cf6c3588f96a4e1e65598caa9';
const KHUON_TT = readFileSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'), 'utf8');
const KHUON_OPP = readFileSync(path.join(KIT, 'skills/acceptance/references/opportunity-template.md'), 'utf8');
const TAM = realpathSync(mkdtempSync(path.join(tmpdir(), 'on-mo-viec-')));
const NGAY = '2026-10-24';
let soDo = 0;
const ok = (ca, m) => console.log(`PASS: ${ca} — ${m}`);
const bad = (ca, m) => { soDo++; console.log(`FAIL: ${ca} — ${m}`); };
const ca = async (ten, fn) => { try { const r = await fn(); if (r && r.length) bad(ten, r.join(' ; ')); else ok(ten, 'đạt'); } catch (e) { bad(ten, `ném lỗi: ${e.stack || e}`); } };

const khoiRao = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const KHOI_TRANG = khoiRao(KHUON_TT, 'TRI-THUC-TRANG');
const [L_NEN, L_CHU_DE, L_DOT] = khoiRao(KHUON_TT, 'TRI-THUC-LOAI').trim().split(/\s+/);
const RE_CON_TRO = new RegExp(khoiRao(KHUON_TT, 'TRI-THUC-CON-TRO').trim());
const TIEN_TO = (t => { const m = t.match(/<<<OPP-NGUON-PREFIX -->\n([\s\S]*?)<!-- OPP-NGUON-PREFIX>>>/); if (!m) throw new Error('khuôn ô cơ hội thiếu khối OPP-NGUON-PREFIX'); return m[1].trim(); })(KHUON_OPP);

const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => execFileSync('git', ['hash-object', '--', p], { encoding: 'utf8' }).trim();
const ghi = (p, t) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, t); };
let dem = 0; const thuMuc = ten => { const d = path.join(TAM, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const khoGit = d => { mkdirSync(d, { recursive: true }); g(d, 'init', '-q', '-b', 'main'); g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't'); return d; };
const commit = (d, m = 'c') => { g(d, 'add', '-A'); g(d, 'commit', '-q', '--allow-empty', '-m', m); };

// Trang sinh từ khối TRI-THUC-TRANG: thay giá trị từng khoá theo thứ tự khối.
const trangTu = v => KHOI_TRANG.replace(/^([A-Za-z_]+):.*$/gm, (m, k) => (k in v ? `${k}: ${v[k]}` : m)) + '\n\nNội dung.\n';
const RAW = 'raw/2026-10-24-vi-du';
// Bảy trang của AC-1 (đường tương đối gốc tri thức) → giá trị frontmatter.
const TRANG = {
  'wiki/nen/a-nen.md': { loai: L_NEN, ma: '[]' },
  'wiki/nen/b-nen.md': { loai: L_NEN, ma: '[]' },
  'wiki/dot/d1.md': { loai: L_DOT, ma: '[A1, A2, B1]' },
  'wiki/chu-de/c-a1.md': { loai: L_CHU_DE, ma: '[A1]' },
  'wiki/chu-de/d-a2b1.md': { loai: L_CHU_DE, ma: '[A2, B1]' },
  'wiki/chu-de/e-b1.md': { loai: L_CHU_DE, ma: '[B1]' },
  'wiki/chu-de/f-rong.md': { loai: L_CHU_DE, ma: '[]' },
};
const MONG = ['wiki/nen/a-nen.md', 'wiki/nen/b-nen.md', 'wiki/dot/d1.md', 'wiki/chu-de/c-a1.md', 'wiki/chu-de/d-a2b1.md'];
function dungGoc(G) {
  ghi(path.join(G, RAW, 'ghi-chu.md'), 'ghi chú gốc\n');
  ghi(path.join(G, RAW, 'nguon.md'), `---\nloai: phien\ngoc: x\nluc: ${NGAY}\nai: t\n---\n\n- \`ghi-chu.md\` ${bam(path.join(G, RAW, 'ghi-chu.md'))}\n`);
  for (const [p, v] of Object.entries(TRANG)) ghi(path.join(G, p), trangTu({ ...v, nguon: `[${RAW}/ghi-chu.md]`, cap_nhat: NGAY }));
}
// Khoá đợt và khoá mã của hàng thử rút từ hàng TT3 thật của lộ trình kit: hàng do phiên cắt viết, không có bên ghi máy;
// ca neo vào hàng thật và vào bảng phủ của răng phủ (ON-5) — bên đọc của răng phủ và của mở ô cùng một khoá.
const TT3 = (JSON.parse(readFileSync(path.join(KIT, 'docs/plans/lo-trinh-kit.json'), 'utf8')).hang || []).find(h => h && h.ma === 'TT3');
const [K_DOT, K_PHU] = ['dot', 'phu'].map(k => { if (!TT3 || !(k in TT3)) throw new Error(`hàng TT3 thật thiếu khoá ${k}`); return k; });
const LO = { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [
  { ma: 'X', slug: 'viec-x', hang: 'T2', [K_DOT]: 'd1', [K_PHU]: ['A1', 'A2'], cau_giao: 'Việc X của đợt d1', bat_khi: 'X chạy được' },
  { ma: 'Y', slug: 'viec-y', hang: 'T2', cau_giao: 'Việc Y không thuộc đợt nào', bat_khi: 'Y chạy được' },
], da_bac: [] };
const CFG_GOC = 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/plans/lo-trinh.json\n';
const CFG_NOI = 'tri_thuc:\n  noi: docs/tri-thuc\n';
// Kho thử: lộ trình + (tuỳ chọn) gốc tri thức trong kho; `tt` là khối tri_thuc (rỗng = không khai).
function khoThu({ tt = CFG_NOI, goc = true } = {}) {
  const d = khoGit(thuMuc('kho'));
  ghi(path.join(d, '_acceptance/config.yaml'), CFG_GOC + tt);
  ghi(path.join(d, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n');
  if (goc) dungGoc(path.join(d, 'docs/tri-thuc'));
  commit(d);
  return d;
}
const ENV = { ...process.env, ACCEPTANCE_TODAY: NGAY };
const chay = (bin, args) => { const r = spawnSync('node', [bin, ...args], { encoding: 'utf8', env: ENV }); return { thoat: r.status, out: r.stdout, err: r.stderr }; };
const LO_BIN = (may = KIT) => path.join(may, 'scripts/lo-trinh.mjs');
const moO = (kho, ma, may = KIT) => chay(LO_BIN(may), ['--root', kho, '--hang', ma, '--mo-o', '--owner', 'x@y.z']);
const docO = (kho, slug) => readFileSync(path.join(kho, '_acceptance', slug, 'opportunity.md'));
const conTro = (kho, ref) => chay(path.join(KIT, 'scripts/tri-thuc.mjs'), ['--root', kho, '--con-tro', ref]);
const TN = require(path.join(KIT, 'scripts/tri-thuc-nguon.cjs'));
const dongNguonCua = txt => String(txt).split('\n').filter(l => l === TIEN_TO || l.startsWith(`${TIEN_TO} `));

// Bộ máy trước vòng (archive GOC_VONG) và bản tiêm của cây; mỗi nhát tiêm khớp đúng một lần.
let MAY_CU = null;
function mayCu() {
  if (MAY_CU) return MAY_CU;
  const d = thuMuc('may-cu');
  const tar = execFileSync('git', ['-C', KIT, 'archive', GOC_VONG, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return (MAY_CU = d);
}
function banTiem(sua) {
  const d = thuMuc('may-tiem');
  for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true });
  for (const [tep, [tim, thay]] of Object.entries(sua)) {
    const p = path.join(d, tep); const t = readFileSync(p, 'utf8'); const n = t.split(tim).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần ở ${tep}: ${tim}`);
    writeFileSync(p, t.replace(tim, thay));
    if (readFileSync(p, 'utf8') === t) throw new Error(`nhát tiêm không áp ở ${tep}`);
  }
  return d;
}
// Cùng kho, hai bộ máy: chép kho ra hai bản (chưa mở ô), mở ô ở mỗi bản, so từng byte ô và stdout.
function soHaiMay(kho, ma, slug, may) {
  // Cùng tên thư mục: tên phiên trong stdout của --mo-o lấy theo tên kho.
  const a = path.join(thuMuc('ban-a'), 'kho'); const b = path.join(thuMuc('ban-b'), 'kho');
  cpSync(kho, a, { recursive: true }); cpSync(kho, b, { recursive: true });
  const ra = moO(a, ma, may); const rb = moO(b, ma, mayCu());
  const oa = existsSync(path.join(a, '_acceptance', slug, 'opportunity.md')) ? docO(a, slug) : Buffer.from('');
  const ob = existsSync(path.join(b, '_acceptance', slug, 'opportunity.md')) ? docO(b, slug) : Buffer.from('');
  return { bang: ra.thoat === rb.thoat && ra.out === rb.out && oa.equals(ob) && oa.length > 0, ra, rb, oa, ob };
}

// ── ON-1 (AC-1): hàng có đợt → dòng Nguồn đúng năm trang, round-trip ─────────
await ca('ON-1', () => {
  const sai = []; const kho = khoThu();
  const r = moO(kho, 'X');
  if (r.thoat !== 0 || !r.out.includes('"moi":true')) return [`mở ô thoát ${r.thoat} «${r.out.trim()}» ${r.err.trim()}`];
  const o = docO(kho, 'viec-x').toString('utf8'); const dong = o.split('\n');
  const ds = dongNguonCua(o);
  if (ds.length !== 1) return [`có ${ds.length} dòng «${TIEN_TO}», cần đúng một`];
  const i = dong.indexOf(ds[0]);
  if (!/^Mở từ hàng X /.test(dong[i - 1] || '')) sai.push(`dòng trước dòng Nguồn là «${dong[i - 1]}», không phải «Mở từ hàng X …»`);
  if (ds[0].includes('chưa có trang')) sai.push(`dòng mang «chưa có trang»: ${ds[0]}`);
  const G = path.join(kho, 'docs/tri-thuc');
  const mong = MONG.map(p => `${p}#${bam(path.join(G, p))}`);
  const thay = [...ds[0].matchAll(/`([^`]+)`/g)].map(m => m[1]);
  console.log(`  ON-1 dòng: ${ds[0]}`);
  console.log(`  ON-1 mong ${mong.length} đường trỏ: ${MONG.join(' · ')}`);
  if (JSON.stringify(thay) !== JSON.stringify(mong)) sai.push(`đường trỏ ${JSON.stringify(thay)} ≠ mong ${JSON.stringify(mong)}`);
  for (const p of ['wiki/chu-de/e-b1.md', 'wiki/chu-de/f-rong.md']) if (ds[0].includes(p)) sai.push(`dòng mang trang không thuộc hàng: ${p}`);
  const doc = TN.docDongNguon(o, TN.napKhuonNguon());
  if (!doc.coDong || JSON.stringify(doc.conTro) !== JSON.stringify(mong)) sai.push(`bộ đọc trả ${JSON.stringify(doc)}`);
  for (const c of mong) { const x = conTro(kho, c); if (x.thoat !== 0) sai.push(`--con-tro ${c} thoát ${x.thoat} ${x.out.trim()} ${x.err.trim()}`); }
  return sai;
});

// ── ON-2 (AC-2): hàng không đợt → giống từng byte bộ máy trước vòng; mutant bỏ điều kiện «có dot» ──
const TIM_DOT = 'if (chuoi(hang.dot)) {';
await ca('ON-2', () => {
  const kho = khoThu(); const s = soHaiMay(kho, 'Y', 'viec-y', KIT);
  console.log(`  ON-2 ô cây ${s.oa.length} byte · ô trước vòng ${s.ob.length} byte · stdout bằng nhau: ${s.ra.out === s.rb.out}`);
  return s.bang ? [] : [`ô hàng Y khác bộ máy trước vòng (thoát ${s.ra.thoat}/${s.rb.thoat}); dòng Nguồn: ${JSON.stringify(dongNguonCua(s.oa))}`];
});
await ca('ON-2-mutant', () => {
  const M = banTiem({ 'scripts/lo-trinh.mjs': [TIM_DOT, 'if (true) {'] });
  const kho = khoThu(); const s = soHaiMay(kho, 'Y', 'viec-y', M);
  const cau = !s.bang && dongNguonCua(s.oa).length ? 'hàng không đợt mà ô có dòng Nguồn' : null;
  console.log(`  ON-2-mutant: ${cau || 'bản tiêm không bị bắt'}`);
  return cau === 'hàng không đợt mà ô có dòng Nguồn' ? [] : ['bản tiêm bỏ điều kiện «có dot» không làm ca đỏ'];
});

// ── ON-3 (AC-3): kho không khai tri_thuc → giống từng byte; mutant đọc gốc mặc định khi khối vắng ──
const TIM_KHAI = "const tt = docTriThuc(existsSync(pCfg) ? readFileSync(pCfg, 'utf8') : '');";
await ca('ON-3', () => {
  const kho = khoThu({ tt: '' }); const s = soHaiMay(kho, 'X', 'viec-x', KIT);
  console.log(`  ON-3 ô cây ${s.oa.length} byte · ô trước vòng ${s.ob.length} byte · stdout bằng nhau: ${s.ra.out === s.rb.out}`);
  return s.bang ? [] : [`ô kho không khai khác bộ máy trước vòng; dòng Nguồn: ${JSON.stringify(dongNguonCua(s.oa))}`];
});
await ca('ON-3-mutant', () => {
  const M = banTiem({ 'scripts/lo-trinh.mjs': [TIM_KHAI, `${TIM_KHAI.slice(0, -1)} || { noi: 'docs/tri-thuc', congKhai: false, kho: null, loi: [], canhBao: [] };`] });
  const kho = khoThu({ tt: '' }); const s = soHaiMay(kho, 'X', 'viec-x', M);
  const cau = !s.bang && dongNguonCua(s.oa).length ? 'kho không khai tri_thuc mà ô có dòng Nguồn' : null;
  console.log(`  ON-3-mutant: ${cau || 'bản tiêm không bị bắt'}`);
  return cau === 'kho không khai tri_thuc mà ô có dòng Nguồn' ? [] : ['bản tiêm đọc gốc mặc định không làm ca đỏ'];
});

const TEP_TT = ['scripts/tri-thuc.mjs', 'scripts/tri-thuc-khoa.cjs', 'scripts/tri-thuc-nguon.cjs'];
const xoaTepTt = d => { for (const f of TEP_TT) rmSync(path.join(d, f)); return d; };
const soDocHang = (kho, may) => { const a = chay(LO_BIN(may), ['--root', kho, '--hang', 'X']); const b = chay(LO_BIN(mayCu()), ['--root', kho, '--hang', 'X']); return a.thoat === b.thoat && a.out === b.out && a.thoat === 0; };
await ca('ON-3-thieu-tep', () => {
  const sai = []; const M = xoaTepTt(banTiem({}));
  const kho = khoThu(); const s = soHaiMay(kho, 'Y', 'viec-y', M); const h = soDocHang(kho, M);
  console.log(`  ON-3-thieu-tep: bản sao không có ${TEP_TT.join(', ')} · mở ô hàng Y bằng từng byte: ${s.bang} · --hang X bằng từng byte: ${h}`);
  if (!s.bang) sai.push(`mở ô hàng Y trên bản sao thiếu tệp tri thức khác bộ máy trước vòng (thoát ${s.ra.thoat}: ${s.ra.err.trim()})`);
  if (!h) sai.push('--hang X trên bản sao thiếu tệp tri thức khác bộ máy trước vòng');
  return sai;
});
await ca('ON-3-thieu-tep-mutant', () => {
  const dau = readFileSync(LO_BIN(KIT), 'utf8').split('\n').find(l => l.startsWith('import '));
  const M = xoaTepTt(banTiem({ 'scripts/lo-trinh.mjs': [dau, `${dau}\nimport './tri-thuc-nguon.cjs';`] }));
  const kho = khoThu(); const s = soHaiMay(kho, 'Y', 'viec-y', M);
  const cau = !s.bang && s.ra.thoat !== 0 ? 'bên đọc cũ nạp mô-đun tri thức' : null;
  console.log(`  ON-3-thieu-tep-mutant: ${cau || 'bản tiêm không bị bắt'}`);
  return cau === 'bên đọc cũ nạp mô-đun tri thức' ? [] : ['bản tiêm import tĩnh tri-thuc-nguon.cjs không làm ca đỏ'];
});

// ── ON-4 (AC-4): ma trận sáu hàng biên ────────────────────────────────────────
await ca('ON-4', () => {
  const sai = []; const ten = 'nguon-rieng';
  const MA_TRAN = [
    { hang: 'xoá trang đợt', dung: () => { const k = khoThu(); unlinkSync(path.join(k, 'docs/tri-thuc/wiki/dot/d1.md')); commit(k); return k; }, duoi: '— chưa có trang: trang đợt d1', so: 4 },
    { hang: 'xoá trang [A2, B1]', dung: () => { const k = khoThu(); unlinkSync(path.join(k, 'docs/tri-thuc/wiki/chu-de/d-a2b1.md')); commit(k); return k; }, duoi: '— chưa có trang: mã A2', so: 4 },
    { hang: 'xoá hai trang nền', dung: () => { const k = khoThu(); for (const p of ['a-nen', 'b-nen']) unlinkSync(path.join(k, `docs/tri-thuc/wiki/nen/${p}.md`)); commit(k); return k; }, duoi: '— chưa có trang: trang nền', so: 3 },
    { hang: 'kho riêng vắng', dung: () => { const cha = thuMuc('cap'); const k = khoGit(path.join(cha, 'tieu-thu')); ghi(path.join(k, '_acceptance/config.yaml'), CFG_GOC + `tri_thuc:\n  kho:\n    ten: ${ten}\n    duong: ../${ten}\n    remote: https://example.com/${ten}.git\n`); ghi(path.join(k, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n'); commit(k); return k; },
      dung_dong: k => `${TIEN_TO} không đọc được ở đây: ${ten} — git clone https://example.com/${ten}.git ${path.join(path.dirname(k), ten)}`, so: 0 },
    { hang: 'khối tri_thuc lỗi', dung: () => khoThu({ tt: 'tri_thuc:\n  noi: docs/tri-thuc\n  cong_khai: co\n' }), dung_dong: () => `${TIEN_TO} khối tri_thuc lỗi — cong_khai phải là true hoặc false`, so: 0 },
    { hang: 'kho riêng có', dung: () => { const cha = thuMuc('cap'); const k = khoGit(path.join(cha, 'tieu-thu')); ghi(path.join(k, '_acceptance/config.yaml'), CFG_GOC + `tri_thuc:\n  kho:\n    ten: ${ten}\n    duong: ../${ten}\n`); ghi(path.join(k, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n'); commit(k); const C = khoGit(path.join(cha, ten)); dungGoc(C); commit(C); return k; }, tien_kho: `${ten}:`, so: 5 },
  ];
  for (const h of MA_TRAN) {
    const k = h.dung(); const r = moO(k, 'X');
    const o = existsSync(path.join(k, '_acceptance/viec-x/opportunity.md')) ? docO(k, 'viec-x').toString('utf8') : '';
    const ds = dongNguonCua(o); const d = ds[0] || '';
    const tro = [...d.matchAll(/`([^`]+)`/g)].map(m => m[1]).filter(x => RE_CON_TRO.test(x));
    console.log(`  ON-4 ${h.hang} · thoát ${r.thoat} · moi ${r.out.includes('"moi":true')} · ${tro.length} đường trỏ · ${d}`);
    if (r.thoat !== 0 || !r.out.includes('"moi":true')) { sai.push(`${h.hang}: thoát ${r.thoat} «${r.out.trim()}» ${r.err.trim()}`); continue; }
    if (ds.length !== 1) { sai.push(`${h.hang}: ${ds.length} dòng Nguồn`); continue; }
    if (h.duoi && !d.endsWith(h.duoi)) sai.push(`${h.hang}: dòng không kết bằng «${h.duoi}»`);
    if (h.dung_dong && d !== h.dung_dong(k)) sai.push(`${h.hang}: dòng «${d}» ≠ «${h.dung_dong(k)}»`);
    if (tro.length !== h.so) sai.push(`${h.hang}: ${tro.length} đường trỏ, cần ${h.so}`);
    if (h.tien_kho) for (const c of tro) { if (!c.startsWith(h.tien_kho)) sai.push(`${h.hang}: ${c} thiếu tiền tố ${h.tien_kho}`); const x = conTro(k, c); if (x.thoat !== 0) sai.push(`${h.hang}: --con-tro ${c} thoát ${x.thoat}`); }
  }
  console.log(`  ON-4 số hàng: ${MA_TRAN.length}`);
  return sai;
});

// ── ON-5 (AC-5): răng phủ — tám hàng nguồn sai, đối chứng xanh trước mỗi hàng ──
const PV = nguon => `# Bản phạm vi thử\n\n<!-- <<<PHAM-VI-MA -->\n\`\`\`\ndot: d1\ndang: chuoi\nnguon: ${nguon}\n\n- \`A1\` — việc một\n- \`A2\` — việc hai\n\`\`\`\n<!-- PHAM-VI-MA>>> -->\n`;
const LO_PHU = { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [
  { ma: 'X', slug: 'viec-x', hang: 'T2', [K_DOT]: 'd1', [K_PHU]: ['A1', 'A2'], vai: 'nen', tieu_chi: 9, cau_giao: 'Việc X của đợt d1', bat_khi: 'X chạy được' },
], da_bac: [] };
const CAT_BIN = (may = KIT) => path.join(may, 'scripts/cat-luot.mjs');
function khoPhu({ tt = CFG_NOI, goc = true, nguon = '' } = {}) {
  const d = khoGit(thuMuc('kho-phu'));
  ghi(path.join(d, '_acceptance/config.yaml'), CFG_GOC.replace('docs/plans/lo-trinh.json', 'docs/plans/lo-trinh-phu.json') + tt);
  ghi(path.join(d, 'docs/plans/lo-trinh-phu.json'), JSON.stringify(LO_PHU, null, 2) + '\n');
  ghi(path.join(d, 'docs/x.md'), 'tài liệu trong git\n');
  if (goc) dungGoc(path.join(d, 'docs/tri-thuc'));
  ghi(path.join(d, 'docs/plans/pham-vi-d1.md'), PV(nguon));
  commit(d);
  return d;
}
const rangPhu = (kho, may = KIT) => chay(CAT_BIN(may), ['--root', kho, '--pham-vi', 'docs/plans/pham-vi-d1.md', '--lo-trinh', 'docs/plans/lo-trinh-phu.json']);
const datNguon = (kho, nguon) => { ghi(path.join(kho, 'docs/plans/pham-vi-d1.md'), PV(nguon)); commit(kho); };
const dongNhacNguon = out => out.split('\n').filter(l => /^(lỗi|cảnh báo): (nguồn «|bản phạm vi thiếu nguon)/.test(l));
await ca('ON-5', () => {
  const sai = []; let doiChung = 0;
  const tro = (kho, p) => `${p}#${bam(path.join(kho, 'docs/tri-thuc', p))}`;
  const DUNG = kho => `${tro(kho, 'wiki/dot/d1.md')}, ${tro(kho, 'wiki/chu-de/c-a1.md')}`;
  const MA_TRAN = [
    { hang: 'liên kết', nguon: () => 'https://example.com/x', ma: '[nguon-khong-phai-trang]', cau: 'không phải đường trỏ băm' },
    { hang: 'tệp trong git không phải đường trỏ', nguon: () => 'docs/x.md', ma: '[nguon-khong-phai-trang]', cau: 'không phải đường trỏ băm' },
    { hang: 'chữ tự do', nguon: () => 'đội sản phẩm gửi qua cửa tín hiệu', ma: '[nguon-khong-phai-trang]', cau: 'không phải đường trỏ băm' },
    { hang: 'rỗng', nguon: () => '', ma: '[nguon-khong-phai-trang]', cau: 'bản phạm vi thiếu nguon — kho đã khai tri_thuc' },
    { hang: 'băm lệch', nguon: () => `wiki/dot/d1.md#${'0'.repeat(40)}`, ma: '[nguon-lech]', cau: 'băm lệch' },
    { hang: 'tệp không có', nguon: () => `wiki/chu-de/khong-co.md#${'0'.repeat(40)}`, ma: '[nguon-lech]', cau: 'không có tệp' },
    { hang: 'chưa vào git', nguon: kho => { const p = path.join(kho, 'docs/tri-thuc/wiki/chu-de/moi.md'); ghi(p, trangTu({ loai: L_CHU_DE, ma: '[A1]', nguon: `[${RAW}/ghi-chu.md]`, cap_nhat: NGAY })); return tro(kho, 'wiki/chu-de/moi.md'); }, ma: '[nguon-chua-vao-kho]', cau: 'tệp chưa vào git' },
    { hang: 'tệp dưới raw/', nguon: kho => tro(kho, `${RAW}/ghi-chu.md`), ma: '[nguon-khong-phai-trang]', cau: 'không phải trang wiki' },
  ];
  const kho = khoPhu();
  for (const h of MA_TRAN) {
    datNguon(kho, DUNG(kho)); const xanh = rangPhu(kho); doiChung++;
    if (xanh.thoat !== 0 || dongNhacNguon(xanh.out).length) { sai.push(`${h.hang}: đối chứng thoát ${xanh.thoat}, ${dongNhacNguon(xanh.out).length} dòng nhắc nguồn ${xanh.out.trim()} ${xanh.err.trim()}`); continue; }
    for (const m of ['A1', 'A2']) if (!xanh.out.split('\n').includes(`  ${m} → hàng X`)) sai.push(`${h.hang}: bảng phủ của đối chứng không đặt ${m} ở hàng X`);
    const n = h.nguon(kho); ghi(path.join(kho, 'docs/plans/pham-vi-d1.md'), PV(n)); g(kho, 'add', 'docs/plans/pham-vi-d1.md'); g(kho, 'commit', '-q', '-m', h.hang);
    const r = rangPhu(kho); const dl = dongNhacNguon(r.out);
    console.log(`  ON-5 ${h.hang} · thoát ${r.thoat} · ${dl.join(' | ')}`);
    if (r.thoat !== 1) sai.push(`${h.hang}: thoát ${r.thoat}, cần 1`);
    if (dl.length !== 1 || !dl[0].startsWith('lỗi: ') || !dl[0].includes(h.ma) || !dl[0].includes(h.cau)) sai.push(`${h.hang}: dòng nhắc nguồn ${JSON.stringify(dl)}, cần đúng một dòng lỗi mang ${h.ma} «${h.cau}»`);
    const p = path.join(kho, 'docs/tri-thuc/wiki/chu-de/moi.md'); if (existsSync(p)) unlinkSync(p);
  }
  console.log(`  ON-5 số hàng: ${MA_TRAN.length} · số lần đối chứng: ${doiChung}`);
  return sai;
});

await ca('ON-5-khoi-loi', () => {
  const kho = khoPhu({ tt: 'tri_thuc:\n  noi: docs/tri-thuc\n  cong_khai: co\n' });
  datNguon(kho, `wiki/dot/d1.md#${bam(path.join(kho, 'docs/tri-thuc/wiki/dot/d1.md'))}, wiki/chu-de/c-a1.md#${bam(path.join(kho, 'docs/tri-thuc/wiki/chu-de/c-a1.md'))}`);
  const r = rangPhu(kho); const dl = r.out.split('\n').filter(l => l.startsWith('lỗi: khối tri_thuc lỗi')); const nn = r.out.split('\n').filter(l => /\[nguon-/.test(l));
  console.log(`  ON-5-khoi-loi · thoát ${r.thoat} · ${dl.join(' | ')}`);
  return r.thoat === 1 && dl.length === 1 && dl[0] === 'lỗi: khối tri_thuc lỗi: cong_khai phải là true hoặc false' && !nn.length ? [] : [`thoát ${r.thoat}, dòng ${JSON.stringify(dl)}, ${nn.length} dòng [nguon-*]`];
});

// ── ON-6 (AC-6): kho riêng vắng → cảnh báo; kho không khai → giống từng byte ──
await ca('ON-6', () => {
  const sai = []; const ten = 'nguon-rieng'; const cha = thuMuc('cap'); const k = khoGit(path.join(cha, 'tieu-thu'));
  ghi(path.join(k, '_acceptance/config.yaml'), CFG_GOC.replace('docs/plans/lo-trinh.json', 'docs/plans/lo-trinh-phu.json') + `tri_thuc:\n  kho:\n    ten: ${ten}\n    duong: ../${ten}\n`);
  ghi(path.join(k, 'docs/plans/lo-trinh-phu.json'), JSON.stringify(LO_PHU, null, 2) + '\n');
  const ref = `${ten}:wiki/dot/d1.md#${'1'.repeat(40)}`;
  ghi(path.join(k, 'docs/plans/pham-vi-d1.md'), PV(ref)); commit(k);
  const r = rangPhu(k); const dl = dongNhacNguon(r.out);
  console.log(`  ON-6 kho riêng vắng · thoát ${r.thoat} · ${dl.join(' | ')}`);
  if (r.thoat !== 0) sai.push(`kho riêng vắng: thoát ${r.thoat} ${r.out.trim()}`);
  if (dl.length !== 1 || !dl[0].startsWith(`cảnh báo: nguồn «${ref}»: không đọc được ở đây: ${ten}`)) sai.push(`kho riêng vắng: dòng ${JSON.stringify(dl)}`);
  // Vế hình dạng không cần kho: liên kết, chữ tự do vẫn đỏ trên máy thiếu kho riêng.
  for (const n of ['https://example.com/x', 'đội sản phẩm gửi qua cửa tín hiệu']) {
    datNguon(k, n); const x = rangPhu(k); const d = dongNhacNguon(x.out);
    console.log(`  ON-6 kho riêng vắng · «${n}» · thoát ${x.thoat} · ${d.join(' | ')}`);
    if (x.thoat !== 1 || d.length !== 1 || !d[0].startsWith('lỗi: ') || !d[0].includes('[nguon-khong-phai-trang]')) sai.push(`kho riêng vắng «${n}»: thoát ${x.thoat}, ${JSON.stringify(d)}`);
  }
  // Đối chứng: dựng kho riêng lành, ghim đúng băm → không cảnh báo nguồn.
  const C = khoGit(path.join(cha, ten)); dungGoc(C); commit(C);
  const ref2 = `${ten}:wiki/dot/d1.md#${bam(path.join(C, 'wiki/dot/d1.md'))}`; datNguon(k, ref2);
  const r2 = rangPhu(k);
  if (r2.thoat !== 0 || dongNhacNguon(r2.out).length) sai.push(`kho riêng lành: thoát ${r2.thoat}, ${dongNhacNguon(r2.out).join(' | ')}`);
  return sai;
});
await ca('ON-6-im', () => {
  const sai = [];
  for (const nguon of ['đội sản phẩm gửi qua cửa tín hiệu', 'https://example.com/x']) {
    const k = khoPhu({ tt: '', goc: false, nguon });
    const a = rangPhu(k); const b = rangPhu(k, mayCu());
    console.log(`  ON-6-im «${nguon}» · thoát ${a.thoat}/${b.thoat} · stdout bằng nhau: ${a.out === b.out}`);
    if (a.thoat !== b.thoat || a.out !== b.out) sai.push(`«${nguon}»: răng phủ khác bộ máy trước vòng`);
  }
  return sai;
});

// ── ON-7 (AC-7): khuôn một nguồn — tiêm tiền tố, mất khối ─────────────────────
await ca('ON-7', () => {
  const sai = []; const OPP = 'skills/acceptance/references/opportunity-template.md';
  const M = banTiem({ [OPP]: [`<<<OPP-NGUON-PREFIX -->\n${TIEN_TO}\n`, '<<<OPP-NGUON-PREFIX -->\nNguồn-thử:\n'] });
  const kho = khoThu(); const r = moO(kho, 'X', M);
  if (r.thoat !== 0) return [`mở ô bằng khuôn tiêm thoát ${r.thoat} ${r.err.trim()}`];
  const o = docO(kho, 'viec-x').toString('utf8');
  const d = o.split('\n').find(l => l.startsWith('Nguồn-thử: '));
  if (!d) sai.push('ô không có dòng mở bằng tiền tố tiêm «Nguồn-thử:»');
  const TNm = require(path.join(M, 'scripts/tri-thuc-nguon.cjs'));
  const tiem = TNm.docDongNguon(o, TNm.napKhuonNguon());
  const that = TN.docDongNguon(o, TN.napKhuonNguon());
  console.log(`  ON-7 bộ đọc khuôn tiêm: ${tiem.conTro.length} đường trỏ · bộ đọc khuôn thật: coDong ${that.coDong}`);
  if (!tiem.coDong || tiem.conTro.length !== 5) sai.push(`bộ đọc khuôn tiêm trả ${JSON.stringify(tiem)}`);
  if (that.coDong !== false) sai.push(`bộ đọc khuôn thật trả coDong ${that.coDong}`);
  // Khuôn mất khối → bên ghi ném lỗi nêu tên khối (mở ô thoát 2).
  const tpl = readFileSync(path.join(KIT, OPP), 'utf8'); const khoiDu = tpl.match(/<!-- <<<OPP-NGUON-PREFIX -->\n[\s\S]*?<!-- OPP-NGUON-PREFIX>>> -->\n/);
  if (!khoiDu) return [...sai, 'khuôn thật thiếu khối OPP-NGUON-PREFIX'];
  const M2 = banTiem({ [OPP]: [khoiDu[0], ''] });
  const kho2 = khoThu(); const r2 = moO(kho2, 'X', M2);
  console.log(`  ON-7 khuôn mất khối · thoát ${r2.thoat} · ${r2.err.trim()}`);
  if (r2.thoat !== 2 || !r2.err.includes('OPP-NGUON-PREFIX')) sai.push(`khuôn mất khối: thoát ${r2.thoat} «${r2.err.trim()}»`);
  return sai;
});

rmSync(TAM, { recursive: true, force: true });
console.log(soDo ? `${soDo} ca đỏ` : 'mọi ca xanh');
process.exit(soDo ? 1 : 0);
