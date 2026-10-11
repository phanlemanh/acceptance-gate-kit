// tin-hieu.test.mjs — hồ sơ cua-tin-hieu-gom-nhom (hàng L3: cửa tín hiệu, bản gom, răng phủ, đường đi),
// ca TH-1…TH-10. Mỗi eval của _acceptance/cua-tin-hieu-gom-nhom/evals.yaml ghim đúng dòng «PASS: TH-…».
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm). Tín hiệu thử dựng từ khối TIN-HIEU-MAU,
// bản gom thử dựng bằng cách nhân các DÒNG của khối GOM-MAU — cả hai rút từ khuôn
// skills/acceptance/references/tin-hieu-template.md lúc chạy, không viết tay đúng khuôn bên đọc.
// Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (`banSao`) với nhát tiêm được kiểm khớp đúng một lần, SAU
// khi bản lành xanh; thông điệp ghim rút từ đầu ra hàm đo. Mọi đường dẫn suy từ vị trí tệp này; không ca
// nào ghi vào cây kit. `kiemYeuCau` gọi THẬT từ dieu-phoi/scripts/hinh-dang.mjs của cây đang kiểm — khuôn
// yêu cầu của gói Điều phối đổi thì ca đỏ ngay (lời phiên điều phối 11/10).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'tin-hieu-'));
const FX_DOT = path.join(KIT, 'tests', 'dieu-phoi', 'fixtures', 'dot-crm-0910', 'yeu-cau');
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.TH_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const nap = async (kit, rel) => import(pathToFileURL(path.join(kit, rel)).href);
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const KHUON = kit => readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'), 'utf8');
const dongLoi = s => String(s).split('\n').filter(l => l.trim() && !l.startsWith('cảnh báo:'));

let bsN = 0;
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'dieu-phoi']) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 220)}`);
  } catch (e) { bad(id, loi(e)); }
};

// ── Vật dựng từ khuôn ─────────────────────────────────────────────────────────
function mauTin(kit) {
  const b = khoiMd(KHUON(kit), 'TIN-HIEU-MAU'); if (b == null) throw new Error('khuôn thiếu khối TIN-HIEU-MAU');
  const [dau, ...than] = b.trim().split('\n'); const ten = dau.replace(/^tệp:\s*/, '').trim();
  return { ten, id: ten.replace(/\.json$/, ''), obj: JSON.parse(than.join('\n')) };
}
// Tín hiệu thứ i: bản sao của mẫu, đổi tiêu đề/lúc; id cùng tiền tố phiên của mẫu.
function tin(kit, i, { luc, tieu_de, loai } = {}) {
  const m = mauTin(kit); const o = JSON.parse(JSON.stringify(m.obj));
  o.noi_dung.tieu_de = tieu_de ?? `tín hiệu thử số ${i}`; if (luc) o.luc = luc; if (loai) o.loai = loai;
  return { id: `${o.phien}-${i}`, o };
}
function khuonGom(kit) {
  const b = khoiMd(KHUON(kit), 'GOM-MAU'); if (b == null) throw new Error('khuôn thiếu khối GOM-MAU');
  const L = b.split('\n'); const iN = L.findIndex(l => l.startsWith('- `'));
  return { dau: L.filter(l => /^(dot|dang|nguon|truc|den):/.test(l)), nhom: L[iN], th: L[iN + 1], le: L.find(l => l.startsWith('- lẻ ')), phu: L.find(l => l.startsWith('- đã phủ ')) };
}
const DEN = '2026-10-28T00:00:00Z';
function vietGom(kit, { dot = 'gom-1', truc = null, bo = [], den = DEN, nhom = [], le = [], phu = [] } = {}) {
  const k = khuonGom(kit);
  const dau = k.dau.filter(l => !bo.some(b => l.startsWith(`${b}:`))).map(l => l.replace(/^dot:.*/, `dot: ${dot}`).replace(/^den:.*/, `den: ${den}`).replace(/^truc:.*/, m => (truc == null ? m : `truc: ${truc}`)));
  const ra = [...dau, ''];
  for (const [ma, ten, ids] of nhom) {
    ra.push(k.nhom.replace(/`[^`]*`/, `\`${ma}\``).replace(/ — .*$/, ` — ${ten}`));
    if (ids.length) ra.push(k.th.replace(/:.*$/, `: ${ids.map(x => `\`${x}\``).join(', ')}`));
  }
  ra.push('');
  for (const [id, ly] of le) ra.push(k.le.replace(/`[^`]*`/, `\`${id}\``).replace(/ — .*$/, ly ? ` — ${ly}` : ''));
  for (const [id, slug] of phu) ra.push(k.phu.replace(/`[^`]*`/, `\`${id}\``).replace(/ — .*$/, ` — ${slug}`));
  return ra.join('\n') + '\n';
}
const HD = (slug, status) => `---\nschema_version: 1\nfeature: «việc ${slug}»\nslug: ${slug}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`;
const EV = slug => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: M 2026-09-02\n---\n\n## Evidence\n`;
const OPP = `---\nschema_version: 1\nslug: x\nfeature: viec x\nowner: x@y.z\nstage: discovery\ndecision:\n---\n\n## Vấn đề & ai gặp\n\nNgười dùng X.\n`;
const KHAI = 'tin_hieu:\n  nguon: tin-hieu\n  gom: docs/gom\n';
let khoN = 0;
// kho({ cfg, tin: [{id,o,nguon}], gom: {tệp: chữ}, hoSo: {slug: status|'opp'}, lt, chuaAddGom })
function kho({ cfg = KHAI, tins = [], gom = {}, hoSo = {}, lt = null, chuaAddGom = false, them = {} } = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n${lt ? 'lo_trinh:\n  tep: docs/lo-trinh.json\n' : ''}${cfg}`);
  for (const t of tins) { const d = path.join(r, t.nguon || 'tin-hieu'); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, `${t.id}.json`), typeof t.o === 'string' ? t.o : JSON.stringify(t.o)); }
  mkdirSync(path.join(r, 'tin-hieu'), { recursive: true });
  for (const [f, txt] of Object.entries(gom)) { mkdirSync(path.join(r, 'docs', 'gom'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'gom', f), txt); }
  for (const [slug, st] of Object.entries(hoSo)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    if (st === 'opp') writeFileSync(path.join(d, 'opportunity.md'), OPP);
    else { writeFileSync(path.join(d, 'contract.md'), HD(slug, st)); if (['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te'].includes(st)) writeFileSync(path.join(d, 'evidence-report.md'), EV(slug)); }
  }
  if (lt) { mkdirSync(path.join(r, 'docs'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'lo-trinh.json'), JSON.stringify(lt, null, 2)); }
  for (const [f, txt] of Object.entries(them)) { mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); writeFileSync(path.join(r, f), txt); }
  writeFileSync(path.join(r, '.gitkeep'), '');
  git(r, 'add', '-A'); if (chuaAddGom) git(r, 'reset', '-q', '--', 'docs/gom');
  git(r, '-c', 'commit.gpgsign=false', 'commit', '-qm', 'kho thu');
  return r;
}
const th = (kit, r, ...a) => node([path.join(kit, 'scripts', 'tin-hieu.mjs'), '--root', r, ...a]);
const pm = (kit, r) => node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', r]);
const khoiThô = html => { const m = String(html).match(/<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/); return m ? JSON.parse(m[1]) : null; };

// ── TH-1: khuôn tín hiệu = khuôn yêu cầu của Điều phối (AC-1) ───────────────────
async function th1(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs'); const D = await nap(kit, 'dieu-phoi/scripts/hinh-dang.mjs');
  const m = mauTin(kit);
  try { D.kiemYeuCau(JSON.parse(JSON.stringify(m.obj))); } catch (e) { sai.push(`mau: kiemYeuCau thật ném ${e.message}`); }
  const r1 = kho({ tins: [{ id: m.id, o: m.obj }] });
  const a = T.docTinHieu(r1, ['tin-hieu']);
  if (a.tinHieu.length !== 1 || a.loi.length || a.tinHieu[0].id !== m.id || a.tinHieu[0].tieu_de !== m.obj.noi_dung.tieu_de) sai.push(`mau: ${JSON.stringify(a).slice(0, 160)}`);
  // 374 yêu cầu thật (ẩn danh): đếm độc lập trong ca.
  const LOAI = T.napLoai(path.join(kit, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'));
  const tepFx = readdirSync(FX_DOT).filter(f => f.endsWith('.json')).sort();
  const dem = {}; for (const f of tepFx) { const o = JSON.parse(readFileSync(path.join(FX_DOT, f), 'utf8')); dem[o.loai] = (dem[o.loai] || 0) + 1; }
  const b = T.docTinHieu(KIT, [path.relative(KIT, FX_DOT)]);
  const soLoaiTin = LOAI.reduce((s, l) => s + (dem[l] || 0), 0);
  const loiLoaiTin = b.loi.filter(l => / sai khuôn: /.test(l)).length;
  if (b.tinHieu.length + loiLoaiTin !== soLoaiTin) sai.push(`that: ${b.tinHieu.length} tín hiệu + ${loiLoaiTin} lỗi ≠ ${soLoaiTin} tệp loại tín hiệu`);
  const ngoai = Object.fromEntries(Object.entries(dem).filter(([k]) => !LOAI.includes(k)));
  if (!deq(Object.fromEntries(Object.entries(b.ngoaiKhuon).sort()), Object.fromEntries(Object.entries(ngoai).sort()))) sai.push(`that: ngoài khuôn ${JSON.stringify(b.ngoaiKhuon)} ≠ ${JSON.stringify(ngoai)}`);
  if (tepFx.length !== 374) sai.push(`that: fixture có ${tepFx.length} tệp, không phải 374`);
  const rFx = kho({ cfg: `tin_hieu:\n  nguon: ${FX_DOT}\n  gom: docs/gom\n` });
  const out = th(kit, rFx, '--rang');
  const dongNk = out.stdout.split('\n').filter(l => l.includes('ngoài khuôn tín hiệu'));
  if (dongNk.length !== 1) sai.push(`that: ${dongNk.length} dòng «ngoài khuôn tín hiệu» (cần 1)`);
  else for (const [k, n] of Object.entries(ngoai)) if (!dongNk[0].includes(`${k} ${n}`)) sai.push(`that: dòng ngoài khuôn thiếu «${k} ${n}»`);
  // Bốn tệp hỏng: mỗi tệp đúng một lỗi nêu tên tệp.
  const hong = { 'json-hong': '{khong phai json', 'thieu-phien': JSON.stringify({ ...m.obj, phien: '' }), 'luc-sai': JSON.stringify({ ...m.obj, luc: 'hôm qua' }), 'tieu-de-rong': JSON.stringify({ ...m.obj, noi_dung: { ...m.obj.noi_dung, tieu_de: '  ' } }) };
  const r2 = kho({ tins: Object.entries(hong).map(([id, o]) => ({ id, o })) });
  const c = T.docTinHieu(r2, ['tin-hieu']); let soCa = 0;
  for (const ten of Object.keys(hong)) { soCa += 1; const n = c.loi.filter(l => l.includes(`${ten}.json`)).length; if (n !== 1) sai.push(`${ten}: ${n} lỗi nêu tệp (cần 1)`); }
  if (soCa !== 4 || c.tinHieu.length) sai.push(`hỏng: đo ${soCa} ca, lọt ${c.tinHieu.length} tín hiệu`);
  console.log(`    TH-1: số ca hỏng đo == ${soCa}`);
  // Review-1: cùng id ở hai nguồn · Review-4: nguồn không tồn tại.
  const t1 = tin(kit, 1);
  const r3 = kho({ cfg: 'tin_hieu:\n  nguon: [a, b]\n  gom: docs/gom\n', tins: [{ ...t1, nguon: 'a' }, { ...t1, nguon: 'b' }] });
  const d3 = T.docTinHieu(r3, ['a', 'b']);
  if (d3.tinHieu.length !== 1 || d3.loi.length !== 1 || !d3.loi[0].includes(t1.id) || !d3.loi[0].includes('a/') || !d3.loi[0].includes('b/')) sai.push(`trung-id-hai-nguon: ${JSON.stringify(d3.loi)}`);
  const d4 = T.docTinHieu(r3, ['khong-co']);
  if (d4.loi.length !== 1 || !d4.loi[0].includes('khong-co')) sai.push(`nguon-khong-ton-tai: ${JSON.stringify(d4.loi)}`);
  return sai;
}
if (want('TH-1') && await chayCa('TH-1', th1)) ok('TH-1', 'mẫu qua kiemYeuCau thật; 374 yêu cầu thật đếm khớp, một dòng ngoài khuôn; bốn tệp hỏng mỗi tệp một lỗi; trùng id hai nguồn; nguồn vắng');
if (want('TH-1-do')) await chayDo('TH-1-do', th1, [['scripts/tin-hieu.mjs', "catch { loi.push(`tín hiệu ${rel} sai khuôn: JSON hỏng`); continue; }", 'catch { continue; }']], 'json-hong', 'bản sao bộ đọc bỏ lặng tệp JSON hỏng');

// ── TH-2: ổ cắm; kho không khai không đổi gì (AC-2) ────────────────────────────
const KHOA_CA = {
  chuoi: ['tin_hieu:\n  nguon: tin-hieu\n  gom: docs/gom\n', { nguon: ['tin-hieu'], gom: 'docs/gom' }],
  'dong-mang': ['tin_hieu:\n  nguon: [a, "b"]\n  gom: g\n', { nguon: ['a', 'b'], gom: 'g' }],
  'danh-sach': ['tin_hieu:\n  nguon:\n    - a   # thư mục a\n    - b\n  gom: g\n', { nguon: ['a', 'b'], gom: 'g' }],
  'nguon-thut-o-khoi-khac': ['khac:\n  nguon: x\n  gom: y\ntin_hieu:\n  gom: g\n', null],
  'vang-khoi': ['lo_trinh:\n  tep: a.json\n', null],
  'vang-nguon': ['tin_hieu:\n  gom: g\n', null],
  'vang-gom': ['tin_hieu:\n  nguon: a\n', null],
};
const STUB_TH = "throw new Error('nap-cua');\n";
async function th2(kit) {
  const sai = [];
  const K = createRequire(import.meta.url)(path.join(kit, 'scripts', 'tin-hieu-khoa.cjs'));
  let soCa = 0;
  for (const [ten, [cfg, mong]] of Object.entries(KHOA_CA)) { soCa += 1; const v = K.khoaTinHieu(cfg); const g = v && { nguon: v.nguon, gom: v.gom }; if (!deq(g, mong)) sai.push(`khoá ${ten}: ${JSON.stringify(g)} ≠ ${JSON.stringify(mong)}`); }
  if (soCa !== 7) sai.push(`khoá: đo ${soCa} ca`);
  console.log(`    TH-2: số ca khoá == ${soCa}`);
  const LT_KHO = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'A1', cau_giao: '«việc a»' }] };
  const rVang = kho({ cfg: '', lt: LT_KHO });
  for (const l of ['--rang', '--chua-gom', '--duong']) { const x = th(kit, rVang, l); if (x.status !== 2 || !x.stderr.includes('kho chưa khai cửa tín hiệu')) sai.push(`khong-khai ${l}: exit ${x.status} «${x.stderr.trim().slice(0, 80)}»`); }
  // Khối thô trên kho không khai: đúng bảng khoá chuẩn, không có tin_hieu.
  const LT = await nap(kit, 'scripts/lo-trinh.mjs');
  const v1 = pm(kit, rVang); if (v1.status !== 0) sai.push(`vẽ kho không khai: exit ${v1.status} ${v1.stderr.slice(0, 120)}`);
  const k1 = khoiThô(readFileSync(path.join(rVang, 'LO-TRINH.html'), 'utf8'));
  if (!k1 || 'tin_hieu' in k1 || !deq(Object.keys(k1).sort(), [...LT.KHUON_DU_LIEU.goc].sort())) sai.push(`khối thô tin_hieu: kho không khai mang khoá ${JSON.stringify(k1 && Object.keys(k1))}`);
  // So byte với bản sao KHÔNG có bộ đọc khoá và có mô-đun cửa bị thay bằng bản ném lỗi khi nạp — kho
  // không khai không cần tệp nào của cửa (bộ đọc khoá nạp khoan dung, luật 26/09).
  const stub = banSao([], kit); writeFileSync(path.join(stub, 'scripts', 'tin-hieu.mjs'), STUB_TH);
  const stubB = banSao([], stub); rmSync(path.join(stubB, 'scripts', 'tin-hieu-khoa.cjs'));
  const rVang2 = kho({ cfg: '', lt: LT_KHO }); const v2 = pm(stubB, rVang2);
  if (v2.status !== 0) sai.push(`bản thay trên kho không khai: exit ${v2.status} ${v2.stderr.slice(0, 120)}`);
  for (const f of ['PRODUCT-MAP.md', 'LO-TRINH.html']) if (readFileSync(path.join(rVang, f), 'utf8') !== readFileSync(path.join(rVang2, f), 'utf8')) sai.push(`byte ${f}: kho không khai vẽ khác khi mô-đun cửa vắng`);
  // Đối chứng: kho CÓ khai + bản thay → bản thay thật sự được nạp.
  const rKhai = kho({ lt: LT_KHO }); const v3 = pm(stub, rKhai);
  if (v3.status === 0 || !v3.stderr.includes('nap-cua')) sai.push(`đối chứng: kho khai + bản thay thoát ${v3.status}, không thấy «nap-cua»`);
  // Kho khai mà thiếu bộ đọc khoá → bước bản đồ đỏ to gọi tên tệp, không im lặng thiếu khoá tin_hieu.
  const v4 = pm(stubB, kho({ lt: LT_KHO }));
  if (v4.status === 0 || !v4.stderr.includes('tin-hieu-khoa.cjs')) sai.push(`khai-thieu-khoa: thoát ${v4.status}, «${v4.stderr.trim().slice(0, 100)}»`);
  return sai;
}
if (want('TH-2') && await chayCa('TH-2', th2)) ok('TH-2', 'ma trận 7 ca khoá; kho không khai: ba lệnh thoát 2, khối thô không có tin_hieu, hai trang giống byte khi mô-đun cửa vắng; đối chứng nạp');
if (want('TH-2-do')) await chayDo('TH-2-do', th2, [['scripts/lo-trinh.mjs', '...(tinHieu != null ? { tin_hieu: tinHieu } : {})', 'tin_hieu: tinHieu ?? []']], 'khối thô tin_hieu', 'tiêm ĐỐI XỨNG: bộ vẽ luôn thêm tin_hieu: [] (cả hai phía so byte)');
if (want('TH-2-do-khoa')) await chayDo('TH-2-do-khoa', th2, [['scripts/tin-hieu-khoa.cjs', "const i = dong.findIndex(l => /^tin_hieu:\\s*(#.*)?$/.test(l));", "const i = dong.findIndex(l => /^\\S+:\\s*(#.*)?$/.test(l));"]], 'nguon-thut-o-khoi-khac', 'bản sao khoá nhặt khối đầu tiên bất kể tên');

// ── TH-3: bản gom đọc được như bản phạm vi (AC-3) ─────────────────────────────
async function th3(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs'); const CL = await nap(kit, 'scripts/cat-luot.mjs');
  const txt = khoiMd(KHUON(kit), 'GOM-MAU'); if (txt == null) return ['khuôn thiếu GOM-MAU'];
  const g = T.docBanGom(txt); const L = txt.split('\n');
  // Đếm độc lập bằng regex trong ca.
  const k = Object.fromEntries(L.map(l => l.match(/^(dot|dang|nguon|truc|den):\s*(.*)$/)).filter(Boolean).map(m => [m[1], m[2].trim()]));
  for (const f of ['dot', 'dang', 'nguon', 'truc', 'den']) if (g[f] !== (k[f] || '')) sai.push(`khoá ${f}: «${g[f]}» ≠ «${k[f]}»`);
  const nhom = []; let cur = null;
  for (const l of L) { let m; if ((m = l.match(/^- `([^`]*)` — (.*)$/))) { cur = { ma: m[1], ten: m[2], tinHieu: [] }; nhom.push(cur); } else if (/^\s+- tín hiệu:/.test(l) && cur) cur.tinHieu.push(...[...l.matchAll(/`([^`]+)`/g)].map(x => x[1])); else if (!/^\s/.test(l)) cur = null; }
  if (!deq(g.nhom.map(n => ({ ma: n.ma, ten: n.ten, tinHieu: n.tinHieu })), nhom)) sai.push(`nhóm: ${JSON.stringify(g.nhom).slice(0, 160)}`);
  const le = L.map(l => l.match(/^- lẻ `([^`]+)` — (.*)$/)).filter(Boolean).map(m => ({ id: m[1], lyDo: m[2] }));
  const phu = L.map(l => l.match(/^- đã phủ `([^`]+)` — (.*)$/)).filter(Boolean).map(m => ({ id: m[1], hoSo: m[2] }));
  if (!le.length) sai.push('khối mẫu không còn dòng «- lẻ» nào — lẻ thành mã hoặc mất');
  else if (!deq(g.le.map(x => ({ id: x.id, lyDo: x.lyDo })), le)) sai.push(`lẻ: ${JSON.stringify(g.le)}`);
  if (!phu.length) sai.push('khối mẫu không còn dòng «- đã phủ» nào — đã phủ thành mã hoặc mất');
  else if (!deq(g.daPhu.map(x => ({ id: x.id, hoSo: x.hoSo })), phu)) sai.push(`đã phủ: ${JSON.stringify(g.daPhu)}`);
  if (g.loi.length) sai.push(`lỗi đọc: ${g.loi}`);
  const pv = CL.docPhamVi(txt);
  if (pv.loi.length) sai.push(`docPhamVi lỗi: ${pv.loi}`);
  if (!deq(pv.ma.map(x => x.ma), nhom.map(n => n.ma))) sai.push(`docPhamVi mã ${JSON.stringify(pv.ma.map(x => x.ma))} ≠ mã nhóm`);
  const ngan = new Set([...le, ...phu].map(x => x.id));
  for (const x of pv.ma) if (ngan.has(x.ma)) sai.push(`lẻ thành mã: ${x.ma}`);
  return sai;
}
if (want('TH-3') && await chayCa('TH-3', th3)) ok('TH-3', 'GOM-MAU: bộ đọc == đếm regex độc lập; docPhamVi đọc cùng văn bản ra đúng mã nhóm, 0 lỗi, lẻ/đã phủ không thành mã');
if (want('TH-3-do')) await chayDo('TH-3-do', th3, [['skills/acceptance/references/tin-hieu-template.md', '- lẻ `crm-u9-1` — hỏi cách dùng', '- `crm-u9-1` — lẻ: hỏi cách dùng']], 'lẻ thành mã', 'bản sao khuôn có dòng lẻ mở bằng «- `»');

// ── TH-4: răng phủ (AC-4) ─────────────────────────────────────────────────────
const LUC_TRUOC = '2026-10-20T00:00:00Z'; const LUC_SAU = '2026-10-30T00:00:00Z';
function coSoTh4(kit, them = {}) {
  const t = i => tin(kit, i, { luc: LUC_TRUOC });
  const ids = [1, 2, 3, 4, 5, 6].map(i => t(i).id);
  const base = { nhom: [['G1', 'Trưởng phòng ban thấy số tuần trước', [ids[0], ids[1]]], ['G2', 'Kỹ sư ghim lại nhanh', [ids[2], ids[5]]]], le: [[ids[3], 'hỏi cách dùng']], phu: [[ids[4], 'giao-x']] };
  return { tins: [1, 2, 3, 4, 5, 6].map(t), ids, base, ...them };
}
async function th4(kit) {
  const sai = [];
  const { tins, ids, base } = coSoTh4(kit);
  const rXanh = kho({ tins, gom: { 'gom-1.md': vietGom(kit, base) }, hoSo: { 'giao-x': 'signed-off' } });
  const x = th(kit, rXanh, '--rang');
  const bang = x.stdout.split('\n').filter(l => /^- \S+ → /.test(l));
  if (x.status !== 0 || bang.length !== 6) sai.push(`xanh: exit ${x.status}, ${bang.length} dòng bảng phủ: ${x.stdout.slice(0, 200)}`);
  for (const id of ids) if (!bang.some(l => l.startsWith(`- ${id} → `))) sai.push(`xanh: bảng thiếu ${id}`);
  const doi = (f) => { const b = JSON.parse(JSON.stringify(base)); f(b); return b; };
  const CA = {
    'khong-cho': [{ 'gom-1.md': vietGom(kit, doi(b => { b.nhom[1][2] = [ids[2]]; })) }, [ids[5], 'chưa có chỗ']],
    'hai-nhom': [{ 'gom-1.md': vietGom(kit, doi(b => { b.nhom[1][2].push(ids[0]); })) }, [ids[0], 'nhóm G1', 'nhóm G2']],
    'nhom-va-le': [{ 'gom-1.md': vietGom(kit, doi(b => { b.le.push([ids[0], 'trùng']); })) }, [ids[0], 'nhóm G1', 'lẻ']],
    'hai-tep': [{ 'gom-1.md': vietGom(kit, base), 'gom-2.md': vietGom(kit, { dot: 'gom-2', nhom: [['G9', 'Việc khác', [ids[0]]]] }) }, [ids[0], 'gom-1.md', 'gom-2.md']],
    'lap-trong-nhom': [{ 'gom-1.md': vietGom(kit, doi(b => { b.nhom[0][2].push(ids[0]); })) }, [ids[0], '2 chỗ', 'nhóm G1']],
    'tin-hieu-la': [{ 'gom-1.md': vietGom(kit, doi(b => { b.nhom[1][2].push('la-99'); })) }, ['la-99', 'không có trong nguồn']],
    'le-thieu-ly-do': [{ 'gom-1.md': vietGom(kit, doi(b => { b.le[0][1] = ''; })) }, [ids[3], 'thiếu lý do']],
    'nhom-rong': [{ 'gom-1.md': vietGom(kit, doi(b => { b.nhom.push(['G4', 'Nhóm rỗng', []]); })) }, ['G4', 'không kê tín hiệu']],
  };
  let soCa = 0;
  for (const [ten, [gom, ghim]] of Object.entries(CA)) {
    soCa += 1;
    const r = kho({ tins, gom, hoSo: { 'giao-x': 'signed-off' } }); const y = th(kit, r, '--rang'); const L = dongLoi(y.stdout);
    if (y.status !== 1 || L.length !== 1 || !ghim.every(gg => L[0].includes(gg))) sai.push(`${ten}: exit ${y.status}, ${L.length} dòng lỗi ${JSON.stringify(L).slice(0, 200)}`);
  }
  if (soCa !== 8) sai.push(`ma trận: đo ${soCa} ca`);
  console.log(`    TH-4: số ca đỏ đo == ${soCa}`);
  // Ca im: tín hiệu gửi sau mốc den.
  const t7 = tin(kit, 7, { luc: LUC_SAU });
  const rSau = kho({ tins: [...tins, t7], gom: { 'gom-1.md': vietGom(kit, base) }, hoSo: { 'giao-x': 'signed-off' } });
  const z = th(kit, rSau, '--rang');
  if (z.status !== 0 || !z.stdout.includes(`- ${t7.id} → chưa gom`)) sai.push(`sau-den: exit ${z.status} ${z.stdout.slice(-160)}`);
  // Chỉ đọc: băm cây + git status trước == sau.
  const anh = r => { const h = createHash('sha256'); const di = d => { for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { if (e.name === '.git') continue; const p = path.join(d, e.name); if (e.isDirectory()) di(p); else h.update(p).update(readFileSync(p)); } }; di(r); return `${h.digest('hex')}|${git(r, 'status', '--porcelain')}`; };
  const rDo = kho({ tins, gom: CA['khong-cho'][0], hoSo: { 'giao-x': 'signed-off' } });
  for (const [r, l] of [[rXanh, '--rang'], [rDo, '--rang'], [rXanh, '--chua-gom'], [rXanh, '--duong']]) { const t0 = anh(r); th(kit, r, l); if (anh(r) !== t0) sai.push(`chỉ đọc: ${l} đổi cây`); }
  return sai;
}
if (want('TH-4') && await chayCa('TH-4', th4)) ok('TH-4', 'đối chứng 6 tín hiệu xanh đủ bảng; 8 ca đỏ mỗi ca đúng một dòng lỗi ghim; tín hiệu sau den im; bốn lệnh không đổi cây');
if (want('TH-4-do')) await chayDo('TH-4-do', th4, [['scripts/tin-hieu.mjs', "return readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => {", "return readdirSync(dir).filter(f => f.endsWith('.md')).sort().slice(0, 1).map(f => {"]], 'hai-tep', 'bản sao răng chỉ xét tệp bản gom đầu tiên');

// ── TH-5: đã phủ chỉ trỏ hồ sơ đã giao (AC-5) ─────────────────────────────────
async function th5(kit) {
  const sai = [];
  const WR = createRequire(import.meta.url)(path.join(kit, 'lib', 'workspace-record.cjs'));
  const giao = [...WR.DA_THONG_CONG_2, ...WR.DA_DONG_THUC_TE];
  const t = i => tin(kit, i, { luc: LUC_TRUOC });
  const tins = giao.map((_, i) => t(i + 1));
  const r = kho({ tins, gom: { 'gom-1.md': vietGom(kit, { phu: giao.map((s, i) => [tins[i].id, `giao-${s}`]) }) }, hoSo: Object.fromEntries(giao.map(s => [`giao-${s}`, s])) });
  const x = th(kit, r, '--rang'); if (x.status !== 0) sai.push(`đã giao (${giao.join(', ')}): exit ${x.status} ${x.stdout.slice(0, 200)}`);
  const CHUA = { 'khong-co': [null, 'không có'], 'o-co-hoi': ['opp', 'ô cơ hội đang chờ'], draft: ['draft', 'draft'], approved: ['approved', 'approved'], implemented: ['implemented', 'implemented'] };
  let soCa = 0;
  for (const [ten, [st, chu]] of Object.entries(CHUA)) {
    soCa += 1; const t1 = t(1);
    const rr = kho({ tins: [t1], gom: { 'gom-1.md': vietGom(kit, { phu: [[t1.id, `hs-${ten}`]] }) }, hoSo: st ? { [`hs-${ten}`]: st } : {} });
    const y = th(kit, rr, '--rang'); const L = dongLoi(y.stdout);
    if (y.status !== 1 || L.length !== 1 || !L[0].includes(t1.id) || !L[0].includes(`hs-${ten}`) || !L[0].includes(chu)) sai.push(`${ten}: exit ${y.status} ${JSON.stringify(L).slice(0, 160)}`);
  }
  if (soCa !== 5) sai.push(`chưa giao: đo ${soCa} ca`);
  console.log(`    TH-5: trạng thái đã giao ${giao.length}, ca chưa giao == ${soCa}`);
  return sai;
}
if (want('TH-5') && await chayCa('TH-5', th5)) ok('TH-5', 'mọi trạng thái đã giao (rút từ lib) không lỗi; 5 ca chưa giao mỗi ca nêu tín hiệu, hồ sơ, trạng thái');
if (want('TH-5-do')) await chayDo('TH-5-do', th5, [['scripts/tin-hieu.mjs', 'return { coThat: true, daGiao: DA_GIAO.has(st),', 'return { coThat: true, daGiao: true,']], 'implemented', 'bản sao coi mọi hồ sơ có hợp đồng là đã giao');

// ── TH-6: chính sách trục + bản gom phải trong git (AC-6) ──────────────────────
async function th6(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs'); const truc = T.napTruc(path.join(kit, 'skills', 'gom-tin-hieu', 'SKILL.md'));
  const t1 = tin(kit, 1, { luc: LUC_TRUOC }); const nhom = [['G1', 'Kỹ sư ghim lại nhanh', [t1.id]]];
  const a = th(kit, kho({ tins: [t1], gom: { 'gom-1.md': vietGom(kit, { nhom, bo: ['truc'] }) } }), '--rang');
  if (a.status !== 1 || !dongLoi(a.stdout).some(l => l.includes('thiếu truc'))) sai.push(`vang-truc: exit ${a.status} ${a.stdout.slice(0, 120)}`);
  const b = th(kit, kho({ tins: [t1], gom: { 'gom-1.md': vietGom(kit, { nhom, truc: 'goc-van-de' }) } }), '--rang');
  if (b.status !== 1 || !dongLoi(b.stdout).some(l => l.includes('goc-van-de') && l.includes(`«${truc}»`))) sai.push(`khac-truc: exit ${b.status} ${b.stdout.slice(0, 160)}`);
  // Bản gom đang xanh trên cây này phải đỏ trên bản sao SKILL đổi giá trị khối GOM-TRUC.
  const rX = kho({ tins: [t1], gom: { 'gom-1.md': vietGom(kit, { nhom }) } });
  const xanh = th(kit, rX, '--rang'); if (xanh.status !== 0) sai.push(`đối chứng trục: exit ${xanh.status} ${xanh.stdout.slice(0, 120)}`);
  const bs = banSao([['skills/gom-tin-hieu/SKILL.md', `truc: ${truc}\n`, 'truc: truc-khac\n']], kit);
  if (th(bs, rX, '--rang').status !== 1) sai.push('GOM-TRUC: đổi khối trong SKILL mà bản gom vẫn xanh — chính sách không đọc từ SKILL');
  // Bản gom ngoài git → 2; commit → 0.
  const rG = kho({ tins: [t1], gom: { 'gom-1.md': vietGom(kit, { nhom }) }, chuaAddGom: true });
  const c = th(kit, rG, '--rang'); if (c.status !== 2 || !c.stderr.includes('bản gom phải là tệp có trong git')) sai.push(`ngoai-git: exit ${c.status} «${c.stderr.trim().slice(0, 100)}»`);
  git(rG, 'add', 'docs/gom'); git(rG, '-c', 'commit.gpgsign=false', 'commit', '-qm', 'gom');
  if (th(kit, rG, '--rang').status !== 0) sai.push('ngoai-git: sau commit vẫn không xanh');
  return sai;
}
if (want('TH-6') && await chayCa('TH-6', th6)) ok('TH-6', 'vắng truc / khác truc đỏ nêu hai giá trị; đổi khối GOM-TRUC làm bản gom xanh thành đỏ; ngoài git thoát 2, sau commit xanh');
if (want('TH-6-do')) await chayDo('TH-6-do', th6, [['scripts/tin-hieu.mjs', 'export function kiemPhu({ root, khai = docKhai(root), truc = napTruc(),', "export function kiemPhu({ root, khai = docKhai(root), truc = 'ket-qua',"]], 'GOM-TRUC', 'bản sao răng ghi cứng chính sách');

// ── TH-7: đường đi về người gửi (AC-7) ────────────────────────────────────────
// Bảng chỗ → câu VIẾT SẴN (design §3.6); trạng thái hàng lấy từ khối của trang cùng kho.
async function th7(kit) {
  const sai = [];
  const PMM = await nap(kit, 'scripts/product-map.mjs'); const LT = await nap(kit, 'scripts/lo-trinh.mjs');
  const TEN_O = Object.fromEntries(PMM.SECTIONS);
  const t = (i, luc = LUC_TRUOC) => tin(kit, i, { luc }); const s = [null, t(1, LUC_SAU), t(2), t(3), t(4), t(5), t(6), t(7), t(8)];
  const gom = vietGom(kit, { dot: 'gom-1', nhom: [['G1', 'Nhóm một', [s[4].id]], ['G2', 'Nhóm hai', [s[5].id]], ['G3', 'Nhóm ba', [s[6].id]], ['G4', 'Nhóm bốn', [s[7].id]], ['G5', 'Nhóm năm', [s[8].id]]], le: [[s[2].id, 'hỏi cách dùng']], phu: [[s[3].id, 'giao-x']] });
  const lt = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H3', cau_giao: '«việc ba»', dot: 'gom-1', phu: ['G3'] }, { ma: 'H4', cau_giao: '«việc bốn»', dot: 'gom-1', phu: ['G4'], slug: 'viec-h4' }, { ma: 'H5', cau_giao: '«việc năm»', dot: 'gom-0', phu: ['G5'] }], chan_troi: [{ ma: 'CT1', dot: 'gom-1', phu: ['G2'], ly_do: 'chờ kho nhận mốc' }] };
  const r = kho({ tins: s.slice(1), gom: { 'gom-1.md': gom }, hoSo: { 'giao-x': 'signed-off', 'viec-h4': 'approved' }, lt });
  if (pm(kit, r).status !== 0) return ['vẽ trang kho thử hỏng'];
  const k = LT.docDuLieu(readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8')).duLieu;
  const ttHang = ma => k.lo_trinh[0].hang.find(h => h.ma === ma)?.trang_thai;
  const MONG = {
    [s[1].id]: ['chua-gom', 'chưa gom — tín hiệu tới sau lượt gom gần nhất'],
    [s[2].id]: ['le', 'lẻ — hỏi cách dùng'],
    [s[3].id]: ['da-phu', `đã có việc đã giao: giao-x (${TEN_O['da-ship']})`],
    [s[4].id]: ['nhom-chua-cat', 'vào nhóm Nhóm một — nhóm chưa thành việc'],
    [s[5].id]: ['chan-troi', 'vào nhóm Nhóm hai — để sau: chờ kho nhận mốc'],
    [s[6].id]: ['hang-chua-ho-so', `vào nhóm Nhóm ba → việc H3: ${ttHang('H3')}`],
    [s[7].id]: ['hang-co-ho-so', `vào nhóm Nhóm bốn → việc H4 → hồ sơ viec-h4: ${ttHang('H4')}`],
    [s[8].id]: ['nhom-chua-cat', 'vào nhóm Nhóm năm — nhóm chưa thành việc'],
  };
  const x = th(kit, r, '--duong'); if (x.status !== 0) return [`--duong exit ${x.status} ${x.stderr.slice(0, 120)}`];
  const ds = JSON.parse(x.stdout);
  const choDo = new Set();
  for (const [id, [cho, cau]] of Object.entries(MONG)) {
    const b = ds.find(d => d.id === id); if (!b) { sai.push(`${cho}: thiếu bản ghi ${id}`); continue; }
    choDo.add(cho);
    if (b.cho !== cho || b.cau !== cau) sai.push(`${cho}: «${b.cho}» «${b.cau}» ≠ «${cau}»`);
  }
  if (choDo.size !== 7) sai.push(`đo ${choDo.size} chỗ`);
  console.log(`    TH-7: số chỗ đo == ${choDo.size}`);
  if (ds.find(d => d.id === s[8].id)?.hang) sai.push('hang-khac-dot: nối vào hàng khác đợt');
  if (!ttHang('H3') || !ttHang('H4')) sai.push('đối chứng: khối thiếu trạng thái H3/H4');
  const one = th(kit, r, '--duong', '--id', s[4].id); if (one.status !== 0 || JSON.parse(one.stdout).id !== s[4].id) sai.push(`--id: exit ${one.status}`);
  const la = th(kit, r, '--duong', '--id', 'khong-co-99'); if (la.status !== 1 || !la.stderr.includes('khong-co-99')) sai.push(`--id lạ: exit ${la.status}`);
  return sai;
}
if (want('TH-7') && await chayCa('TH-7', th7)) ok('TH-7', '7 chỗ, câu == bảng viết sẵn, trạng thái hàng == khối trang; hàng khác đợt không nối; --id một bản ghi, id lạ thoát 1');
if (want('TH-7-do')) await chayDo('TH-7-do', th7, [['scripts/tin-hieu.mjs', '— để sau: ${x.ly_do}', '— hoãn: ${x.ly_do}']], 'chan-troi', 'bản sao đổi câu của chỗ chân trời');

// ── TH-8: khoá tuỳ chọn tin_hieu trong khối dữ liệu (AC-8) ────────────────────
const chepRoi = src => { const i = src.indexOf('export function docDuLieu'); if (i < 0) throw new Error('nguồn không có docDuLieu'); let j = src.indexOf('{', i); let sau = 0; for (; j < src.length; j++) { if (src[j] === '{') sau++; else if (src[j] === '}') { sau--; if (!sau) break; } } return new Function(`return (${src.slice(i + 7, j + 1)});`)(); };
async function th8(kit) {
  const sai = [];
  const LT = await nap(kit, 'scripts/lo-trinh.mjs'); const T = await nap(kit, 'scripts/tin-hieu.mjs');
  const t1 = tin(kit, 1, { luc: LUC_TRUOC, tieu_de: 'kẹt ở </script> và \u2028 dòng' }); const t2 = tin(kit, 2, { luc: LUC_TRUOC });
  const lt = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H1', cau_giao: '«việc một»', dot: 'gom-1', phu: ['G1'] }] };
  const r = kho({ tins: [t1, t2], gom: { 'gom-1.md': vietGom(kit, { nhom: [['G1', 'Nhóm một', [t1.id]]], le: [[t2.id, 'cảm ơn']] }) }, lt });
  if (pm(kit, r).status !== 0) return ['vẽ trang hỏng'];
  const html = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
  if ((html.match(/id="lo-trinh-du-lieu"/g) || []).length !== 1) sai.push('số khối dữ liệu ≠ 1');
  let k; try { k = khoiThô(html); } catch (e) { return [`khối không phải JSON: ${e.message}`]; }
  const duong = JSON.parse(th(kit, r, '--duong').stdout);
  if (!k || !deq(k.tin_hieu, duong)) sai.push(`tin_hieu của khối ≠ --duong: ${String(JSON.stringify(k && k.tin_hieu)).slice(0, 120)}`);
  if (pm(kit, r).status !== 0 || readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8') !== html) sai.push('vẽ hai lần khác byte');
  for (const [cap, ds] of Object.entries(LT.KHUON_DU_LIEU)) if (ds.includes('tin_hieu') || cap === 'tin_hieu') sai.push(`KHUON_DU_LIEU có tin_hieu ở cấp ${cap}`);
  const doc = chepRoi(readFileSync(path.join(kit, 'scripts', 'lo-trinh.mjs'), 'utf8'));
  const a = doc(html); const goKhoa = html.replace(/(<script type="application\/json" id="lo-trinh-du-lieu">)([\s\S]*?)(<\/script>)/, (m, p1, j, p3) => { const o = JSON.parse(j); delete o.tin_hieu; return p1 + JSON.stringify(o).replace(/</g, '\\u003c') + p3; });
  const b = doc(goKhoa);
  if (!a.duLieu || !deq(a.duLieu.tin_hieu, k.tin_hieu)) sai.push('bản chép rời không giữ tin_hieu');
  if (!deq(a.canhBao, b.canhBao)) sai.push(`cảnh báo khác khi có/không khoá: ${JSON.stringify(a.canhBao)} ≠ ${JSON.stringify(b.canhBao)}`);
  if (b.duLieu && 'tin_hieu' in b.duLieu) sai.push('bản chép rời tự điền tin_hieu khi trang không có khoá');
  // Tài liệu kho tiêu thụ: khối khoá tuỳ chọn == TRUONG_DUONG.
  const tl = khoiMd(readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-du-lieu.md'), 'utf8'), 'LO-TRINH-DU-LIEU-TUY-CHON');
  if (tl == null) sai.push('tài liệu thiếu khối LO-TRINH-DU-LIEU-TUY-CHON');
  else { const ds = tl.split('\n').filter(Boolean).map(l => (l.match(/^tin_hieu\.([a-z_]+) — /) || [])[1]); for (const f of T.TRUONG_DUONG) if (!ds.includes(f)) sai.push(`tài liệu thiếu trường ${f}`); for (const f of ds) if (!T.TRUONG_DUONG.includes(f)) sai.push(`tài liệu có trường lạ ${f}`); }
  for (const d of duong) if (!deq(Object.keys(d), T.TRUONG_DUONG)) sai.push(`bản ghi ${d.id} lệch TRUONG_DUONG`);
  return sai;
}
if (want('TH-8') && await chayCa('TH-8', th8)) ok('TH-8', 'khối mang tin_hieu == --duong, hai lần cùng byte, KHUON_DU_LIEU không đổi; bộ đọc chép rời giữ khoá, cảnh báo như trang không khoá; tài liệu == TRUONG_DUONG; tiêu đề có </script> vẫn một khối JSON');
if (want('TH-8-do')) await chayDo('TH-8-do', th8, [['scripts/lo-trinh.mjs', ', ...(tinHieu != null ? { tin_hieu: tinHieu } : {})', '']], 'tin_hieu', 'bản sao bộ vẽ bỏ khoá tin_hieu');
if (want('TH-8-do2')) await chayDo('TH-8-do2', th8, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'tin_hieu.ho_so_phu — hồ sơ đã giao phủ tín hiệu (ngăn đã phủ)\n', '']], 'ho_so_phu', 'bản sao tài liệu thiếu một trường');

// ── TH-9: skill gom chạy được nguyên văn (AC-9) ───────────────────────────────
const SKILL = kit => readFileSync(path.join(kit, 'skills', 'gom-tin-hieu', 'SKILL.md'), 'utf8');
const CUM_THU_TU = ['## Bước 2 — gom theo trục', 'Commit tệp', '<!-- <<<GOM-RANG -->', '## Bước 4 — chuyển cho cắt lượt'];
const MAU_CAM = [/giữ.{0,20}kho tín hiệu/i, /ghi trạng thái vào tệp/i];
async function th9(kit) {
  const sai = []; const sk = SKILL(kit);
  const chay = (ten, r) => { const b = khoiMd(sk, ten); if (b == null) return { status: -1, ten }; return spawnSync('bash', ['-c', b.trim()], { cwd: r, encoding: 'utf8', env: { ...process.env, AG: kit } }); };
  const t1 = tin(kit, 1, { luc: LUC_TRUOC }); const t2 = tin(kit, 2, { luc: LUC_TRUOC });
  const rX = kho({ tins: [t1, t2], gom: { 'gom-1.md': vietGom(kit, { nhom: [['G1', 'Kỹ sư ghim lại nhanh', [t1.id, t2.id]]] }) } });
  const rD = kho({ tins: [t1, t2], gom: { 'gom-1.md': vietGom(kit, { nhom: [['G1', 'Kỹ sư ghim lại nhanh', [t1.id]]] }) } });
  for (const ten of ['GOM-CHUA-GOM', 'GOM-RANG', 'GOM-DUONG']) { const x = chay(ten, rX); if (x.status !== 0) sai.push(`${ten}: xanh thoát ${x.status} ${String(x.stderr || '').slice(0, 100)}`); }
  const d = chay('GOM-RANG', rD); if (d.status !== 1) sai.push(`GOM-RANG: đỏ thoát ${d.status}`);
  const truc = khoiMd(sk, 'GOM-TRUC'); if (!truc || !/^truc: ket-qua$/m.test(truc)) sai.push('GOM-TRUC thiếu «truc: ket-qua»');
  for (const ngan of ['**nhóm**', '**lẻ**', '**đã phủ**']) if (!sk.includes(ngan)) sai.push(`thiếu ngăn ${ngan}`);
  let truoc = -1; for (const c of CUM_THU_TU) { const i = sk.indexOf(c); if (i < 0 || i < truoc) sai.push(`thứ tự: «${c}» ở ${i} (sau ${truoc})`); else truoc = i; }
  for (const l of sk.split('\n')) for (const re of MAU_CAM) if (re.test(l) && !/không/i.test(l)) sai.push(`câu cấm: «${l.slice(0, 80)}»`);
  return sai;
}
if (want('TH-9') && await chayCa('TH-9', th9)) ok('TH-9', 'ba khối lệnh của SKILL chạy nguyên văn (xanh 0, đỏ 1); GOM-TRUC ket-qua; ba ngăn; thứ tự gom → commit → răng → cắt lượt; 0 câu cấm');
if (want('TH-9-do')) await chayDo('TH-9-do', th9, [['skills/gom-tin-hieu/SKILL.md', 'node "$AG/scripts/tin-hieu.mjs" --root . --rang', 'node "$AG/scripts/tin-hieu.mjs" --root . --rangg']], 'GOM-RANG', 'bản sao SKILL gõ sai lệnh trong GOM-RANG');

// ── TH-10: bộ vàng (AC-10) ──────────────────────────────────────────────────
// Vật đo ở hồ sơ: rang/sinh-bo-vang.mjs (bộ sinh) · rang/dung-kho-tac-tu.mjs (kho đưa phiên gom) ·
// rang/cham-bo-vang.mjs (lệnh chấm, quetKin) · mau/ (đáp án, tín hiệu giả, hợp đồng thật, bản gom của phiên).
// TH-10-ong (ống dẫn) chạy trong bộ kiểm chung. TH-10 (KẾT QUẢ lượt gom của skill so đáp án) chỉ chạy khi
// gọi đích danh — executors.test.tin_hieu_vang — vì nó chấm một vật do mô hình viết một lần, không phải mã
// của kit: đỏ ở đó là dữ liệu cho Cổng Bằng chứng, không được làm đỏ bộ kiểm chung của mọi PR.
const HS = path.join(KIT, '_acceptance', 'cua-tin-hieu-gom-nhom');
const MAU = path.join(HS, 'mau');
const goi = (r, ...a) => git(r, '-c', 'commit.gpgsign=false', ...a);
async function khoCham(kit, { gomTxt, boVang, dapAnTruoc = true }) {
  const { dungKho } = await import(pathToFileURL(path.join(HS, 'rang', 'dung-kho-tac-tu.mjs')).href);
  const r = path.join(TMP, `cham-${++khoN}`); dungKho({ boVang: path.join(MAU, 'bo-vang.json'), tin: path.join(MAU, 'tin-hieu'), ra: r });
  const dapAn = () => { mkdirSync(path.join(r, 'vang'), { recursive: true }); writeFileSync(path.join(r, 'vang', 'bo-vang.json'), JSON.stringify(boVang)); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'dap an'); };
  const gom = () => { writeFileSync(path.join(r, 'docs', 'gom', 'gom-vang.md'), gomTxt); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'ban gom'); };
  if (dapAnTruoc) { dapAn(); gom(); } else { gom(); dapAn(); }
  return r;
}
async function th10ong(kit) {
  const sai = [];
  const C = await import(pathToFileURL(path.join(HS, 'rang', 'cham-bo-vang.mjs')).href);
  const { dungKho } = await import(pathToFileURL(path.join(HS, 'rang', 'dung-kho-tac-tu.mjs')).href);
  const T = await nap(kit, 'scripts/tin-hieu.mjs');
  const bv = JSON.parse(readFileSync(path.join(MAU, 'bo-vang.json'), 'utf8'));
  // Kín đáp án trên ĐÚNG kho đưa phiên gom.
  const rT = dungKho({ boVang: path.join(MAU, 'bo-vang.json'), tin: path.join(MAU, 'tin-hieu'), ra: path.join(TMP, `tac-tu-${++khoN}`) });
  const tepTin = readdirSync(path.join(rT, 'tin-hieu')).map(f => path.join(rT, 'tin-hieu', f));
  const kin = C.quetKin({ root: rT, boVang: bv, tepTin }); if (kin.length) sai.push(`kín: ${kin.join(' ; ')}`);
  if (!C.quetKin({ root: rT, boVang: bv, tepTin: [path.join(MAU, 'bo-vang.json')] }).length) sai.push('kín: đối chứng — phép quét không thấy tên hồ sơ ngay trong tệp đáp án');
  if (!tepTin.every(f => JSON.parse(readFileSync(f, 'utf8')).noi_dung?.nhan?.startsWith('giả'))) sai.push('nhãn: có tệp tín hiệu không mang nhãn giả');
  // 20 mục đáp án == 20 tệp tín hiệu, đọc bằng bộ đọc thật.
  const doc = T.docTinHieu(MAU, ['tin-hieu']);
  const a = bv.muc.map(m => `${m.id}|${m.tieu_de}`).sort(); const b2 = doc.tinHieu.map(x => `${x.id}|${x.tieu_de}`).sort();
  if (doc.loi.length || a.length !== 20 || !deq(a, b2)) sai.push(`đáp án ↔ tệp: ${a.length} mục, ${b2.length} tín hiệu, lỗi ${doc.loi.length}`);
  // Bộ vàng thứ hai do mã sinh: 3 cặp trùng + 1 hồ sơ đã giao — lệnh chấm không ghi cứng bộ vàng kit.
  const t2 = [1, 2, 3, 4, 5, 6].map(i => tin(kit, i, { luc: LUC_TRUOC }));
  const bv2 = { muc: t2.map((x, i) => ({ id: x.id, ho_so: i < 2 ? 'giao-x' : `hs-${Math.floor(i / 2)}` })), cap_trung: [[t2[0].id, t2[1].id], [t2[2].id, t2[3].id], [t2[4].id, t2[5].id]], da_giao: ['giao-x'] };
  const gom2 = vietGom(kit, { nhom: [['G1', 'Kỹ sư một', [t2[2].id, t2[3].id]], ['G2', 'Kỹ sư hai', [t2[4].id, t2[5].id]]], phu: [[t2[0].id, 'giao-x'], [t2[1].id, 'giao-x']] });
  const k2 = (truoc) => { const r = kho({ tins: t2, hoSo: { 'giao-x': 'signed-off', 'hs-1': 'draft' } }); const da = () => { mkdirSync(path.join(r, 'vang'), { recursive: true }); writeFileSync(path.join(r, 'vang', 'bv.json'), JSON.stringify(bv2)); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'dap an'); }; const gg = () => { mkdirSync(path.join(r, 'docs', 'gom'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'gom', 'g.md'), gom2); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'gom'); }; if (truoc) { da(); gg(); } else { gg(); da(); } return r; };
  const x1 = await C.cham({ root: k2(true), boVangTep: 'vang/bv.json', kit }); if (x1.thoat !== 0) sai.push(`bộ vàng hai: ${x1.dong.join(' ; ')}`);
  const x2 = await C.cham({ root: k2(false), boVangTep: 'vang/bv.json', kit }); if (x2.thoat !== 1 || !x2.dong.some(l => l.includes('khai trước'))) sai.push(`khai trước: đảo thứ tự commit mà chấm thoát ${x2.thoat}`);
  return { sai, bv2, gom2, k2, C };
}
if (want('TH-10-ong')) { try { const { sai } = await th10ong(KIT); if (sai.length) bad('TH-10-ong', sai.join(' ; ')); else ok('TH-10-ong', 'kho đưa phiên gom kín đáp án (đối chứng thấy tên trong đáp án); 20 mục == 20 tệp; lệnh chấm chạy trên bộ vàng thứ hai; đảo thứ tự commit → «khai trước»'); } catch (e) { bad('TH-10-ong', loi(e)); } }
if (want('TH-10-do')) {
  try {
    const { sai, bv2, gom2, k2, C } = await th10ong(KIT); if (sai.length) { bad('TH-10-do', `bản lành chưa xanh: ${sai[0]}`); } else {
      const r = k2(true); const tach = gom2.replace(`, \`${bv2.cap_trung[1][1]}\``, '') + vietGom(KIT, { nhom: [['G9', 'Tách ra', [bv2.cap_trung[1][1]]]] }).split('\n').filter(l => l.startsWith('- `') || l.startsWith('  - tín hiệu')).join('\n') + '\n';
      writeFileSync(path.join(r, 'docs', 'gom', 'g.md'), tach); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'tach');
      const x = await C.cham({ root: r, boVangTep: 'vang/bv.json', kit: KIT }); const g = x.dong.find(l => l.includes('cặp trùng tách') && l.includes(bv2.cap_trung[1][1]));
      if (x.thoat === 1 && g) ok('TH-10-do', `bản gom tách một cặp trùng: lệnh chấm trả «${g.slice(0, 100)}»`); else bad('TH-10-do', `không bắt: ${JSON.stringify(x).slice(0, 200)}`);
    }
  } catch (e) { bad('TH-10-do', loi(e)); }
}
if (want('TH-10-do2')) {
  try {
    const C = await import(pathToFileURL(path.join(HS, 'rang', 'cham-bo-vang.mjs')).href);
    const bv = JSON.parse(readFileSync(path.join(MAU, 'bo-vang.json'), 'utf8'));
    const d = path.join(TMP, `ro-${++khoN}`); mkdirSync(d); const f0 = readdirSync(path.join(MAU, 'tin-hieu')).sort()[0];
    const o = JSON.parse(readFileSync(path.join(MAU, 'tin-hieu', f0), 'utf8')); o.noi_dung.nhan = `giả — sinh từ ${Object.keys(bv.ho_so)[0]}`;
    writeFileSync(path.join(d, f0), JSON.stringify(o));
    const l = C.quetKin({ root: d, boVang: bv, tepTin: [path.join(d, f0)] });
    if (l.some(x => x.includes(f0))) ok('TH-10-do2', `bộ sinh giữ tên hồ sơ trong nhãn: phép quét kín trả «${l[0].slice(0, 90)}»`); else bad('TH-10-do2', `không bắt: ${JSON.stringify(l)}`);
  } catch (e) { bad('TH-10-do2', loi(e)); }
}
// KẾT QUẢ: chỉ khi gọi đích danh (executors.test.tin_hieu_vang).
if (only.includes('TH-10')) {
  try {
    const C = await import(pathToFileURL(path.join(HS, 'rang', 'cham-bo-vang.mjs')).href);
    const bv = JSON.parse(readFileSync(path.join(MAU, 'bo-vang.json'), 'utf8'));
    const r = await khoCham(KIT, { gomTxt: readFileSync(path.join(MAU, 'gom-bo-vang.md'), 'utf8'), boVang: bv });
    const x = await C.cham({ root: r, boVangTep: 'vang/bo-vang.json', kit: KIT });
    for (const l of x.dong) console.log(`    TH-10: ${l.replace(r + '/', '')}`);
    if (x.thoat === 0) ok('TH-10', 'bản gom của phiên trên bộ vàng: răng xanh, mọi cặp trùng chung chỗ, hồ sơ đã giao ra đã phủ, còn lại ở nhóm');
    else bad('TH-10', `bản gom của phiên lệch đáp án ở ${x.dong.length} chỗ (xem các dòng TH-10 ở trên)`);
  } catch (e) { bad('TH-10', loi(e)); }
} else if (!only.length) console.log('  BỎ QUA: TH-10 — kết quả lượt gom của skill so bộ vàng chỉ chạy qua executors.test.tin_hieu_vang (chấm vật mô hình viết một lần, không làm đỏ bộ kiểm chung)');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (tin-hieu)`);
process.exit(fail ? 1 : 0);
