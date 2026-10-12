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
// Trạng thái hồ sơ rút từ lib (RT13: tệp ca không viết cứng chữ trạng thái) — «đã giao» = tập của lưới trước-gộp.
const WR = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const DA_GIAO_TT = [...WR.DA_THONG_CONG_2, ...WR.DA_DONG_THUC_TE];
const GIAO = WR.DA_THONG_CONG_2[0];
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
    else { writeFileSync(path.join(d, 'contract.md'), HD(slug, st)); if (DA_GIAO_TT.includes(st)) writeFileSync(path.join(d, 'evidence-report.md'), EV(slug)); }
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
  const rXanh = kho({ tins, gom: { 'gom-1.md': vietGom(kit, base) }, hoSo: { 'giao-x': GIAO } });
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
    const r = kho({ tins, gom, hoSo: { 'giao-x': GIAO } }); const y = th(kit, r, '--rang'); const L = dongLoi(y.stdout);
    if (y.status !== 1 || L.length !== 1 || !ghim.every(gg => L[0].includes(gg))) sai.push(`${ten}: exit ${y.status}, ${L.length} dòng lỗi ${JSON.stringify(L).slice(0, 200)}`);
  }
  if (soCa !== 8) sai.push(`ma trận: đo ${soCa} ca`);
  console.log(`    TH-4: số ca đỏ đo == ${soCa}`);
  // Ca im: tín hiệu gửi sau mốc den.
  const t7 = tin(kit, 7, { luc: LUC_SAU });
  const rSau = kho({ tins: [...tins, t7], gom: { 'gom-1.md': vietGom(kit, base) }, hoSo: { 'giao-x': GIAO } });
  const z = th(kit, rSau, '--rang');
  if (z.status !== 0 || !z.stdout.includes(`- ${t7.id} → chưa gom`)) sai.push(`sau-den: exit ${z.status} ${z.stdout.slice(-160)}`);
  // Chỉ đọc: băm cây + git status trước == sau.
  const anh = r => { const h = createHash('sha256'); const di = d => { for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { if (e.name === '.git') continue; const p = path.join(d, e.name); if (e.isDirectory()) di(p); else h.update(p).update(readFileSync(p)); } }; di(r); return `${h.digest('hex')}|${git(r, 'status', '--porcelain')}`; };
  const rDo = kho({ tins, gom: CA['khong-cho'][0], hoSo: { 'giao-x': GIAO } });
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
  const r = kho({ tins: s.slice(1), gom: { 'gom-1.md': gom }, hoSo: { 'giao-x': GIAO, 'viec-h4': 'approved' }, lt });
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
  const k2 = (truoc) => { const r = kho({ tins: t2, hoSo: { 'giao-x': GIAO, 'hs-1': 'draft' } }); const da = () => { mkdirSync(path.join(r, 'vang'), { recursive: true }); writeFileSync(path.join(r, 'vang', 'bv.json'), JSON.stringify(bv2)); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'dap an'); }; const gg = () => { mkdirSync(path.join(r, 'docs', 'gom'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'gom', 'g.md'), gom2); git(r, 'add', '-A'); goi(r, 'commit', '-qm', 'gom'); }; if (truoc) { da(); gg(); } else { gg(); da(); } return r; };
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
    // Khai trước TRÊN LỊCH SỬ THẬT của kho kit (kho chấm ở trên dựng lại thứ tự commit nên không chứng được):
    // commit đầu của đáp án là tổ tiên nghiêm ngặt của commit cuối đổi bản gom, và đáp án không đổi sau đó.
    const rel = f => path.relative(KIT, path.join(MAU, f));
    const lg = (...a) => { try { return git(KIT, 'log', ...a); } catch { return ''; } };
    const dauBv = lg('--diff-filter=A', '--format=%H', '--reverse', '--', rel('bo-vang.json')).split('\n').filter(Boolean)[0];
    const doiBv = lg('--format=%H', '--', rel('bo-vang.json')).split('\n').filter(Boolean);
    const cuoiGom = lg('-1', '--format=%H', '--', rel('gom-bo-vang.md')).trim();
    let truoc = false; try { truoc = !!dauBv && !!cuoiGom && dauBv !== cuoiGom && (git(KIT, 'merge-base', '--is-ancestor', dauBv, cuoiGom), true); } catch { truoc = false; }
    if (!truoc) x.dong.push(`khai trước (lịch sử kit): đáp án ${String(dauBv).slice(0, 8)} không đứng trước bản gom ${String(cuoiGom).slice(0, 8)}`);
    if (doiBv.length > 1) x.dong.push(`khai trước (lịch sử kit): đáp án bị đổi sau commit đầu (${doiBv.length} commit)`);
    if (!truoc || doiBv.length > 1) x.thoat = 1;
    for (const l of x.dong) console.log(`    TH-10: ${l.replace(r + '/', '')}`);
    if (x.thoat === 0) ok('TH-10', 'bản gom của phiên trên bộ vàng: răng xanh, mọi cặp trùng chung chỗ, hồ sơ đã giao ra đã phủ, còn lại ở nhóm');
    else bad('TH-10', `bản gom của phiên lệch đáp án ở ${x.dong.length} chỗ (xem các dòng TH-10 ở trên)`);
  } catch (e) { bad('TH-10', loi(e)); }
} else if (!only.length) console.log('  BỎ QUA: TH-10 — kết quả lượt gom của skill so bộ vàng chỉ chạy qua executors.test.tin_hieu_vang (chấm vật mô hình viết một lần, không làm đỏ bộ kiểm chung)');

// ══ Hồ sơ cau-tin-hieu-nguoi-gui — câu cho người gửi (ca CN-1…CN-8) ════════════
// Mỗi eval của _acceptance/cau-tin-hieu-nguoi-gui/evals.yaml ghim đúng dòng «PASS: CN-…». Dùng lại bộ dựng kho
// thử ở trên; hợp đồng + báo cáo của hồ sơ thử viết qua `them` để câu giao không chứa tên hồ sơ. Báo cáo
// đã ký THẬT của hồ sơ L3 được chép nguyên văn (đường suy từ vị trí tệp này); ngày mong đợi rút ĐỘC LẬP.
const BAO_CAO_THAT = path.join(KIT, '_acceptance', 'cua-tin-hieu-gom-nhom', 'evidence-report.md');
const HD_CAU = (slug, status, feature) => `---\nschema_version: 1\n${feature == null ? '' : `feature: ${feature}\n`}slug: ${slug}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`;
const EV_KY = (slug, ky) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: ${ky}\n---\n\n## Evidence\n`;
const OPP_PARK = slug => `---\nschema_version: 1\nslug: ${slug}\nfeature: «việc để sau»\nowner: x@y.z\nstage: decided\ndecision: park\ndecided_by: M\ndecided_at: 2026-09-01T00:00:00Z\n---\n\n## Vấn đề & ai gặp\n\nNgười dùng X.\n`;
const ngayDocLap = txt => { const m = String(txt).match(/^human_signoff:[^\n]*?(\d{4})-(\d{2})-(\d{2})/m); return m ? `${Number(m[3])}/${Number(m[2])}/${m[1]}` : null; };
const escRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Quét mã của ca (biểu thức riêng, không gọi mã vật): mã đứng như một từ riêng trong câu.
const coMa = (cau, ma) => new RegExp(`(?<![\\p{L}\\p{N}_-])${escRe(ma)}(?![\\p{L}\\p{N}_-])`, 'u').test(String(cau).normalize('NFC'));
const hoSoThu = (slug, status, feature, ky) => ({ [`_acceptance/${slug}/contract.md`]: HD_CAU(slug, status, feature), ...(ky == null ? {} : { [`_acceptance/${slug}/evidence-report.md`]: EV_KY(slug, ky) }) });
const tieuDeO = async (kit, khoa) => Object.fromEntries((await nap(kit, 'scripts/product-map.mjs')).SECTIONS)[khoa];

// Kho bảy chỗ + một «đã phủ» bởi việc chưa giao (AC-1, AC-2).
function khoCau(kit) {
  const t = (i, luc = LUC_TRUOC) => tin(kit, i, { luc }); const s = [null, t(1, LUC_SAU), t(2), t(3), t(4), t(5), t(6), t(7), t(8)];
  const gom = vietGom(kit, { dot: 'gom-1', nhom: [['G1', 'Trưởng phòng ban thấy "số" tuần trước', [s[4].id]], ['G2', 'Nhân viên căn chỉnh OKR', [s[5].id]], ['G3', 'Nhân viên tìm quy trình', [s[6].id]], ['G6', 'Mọi người gửi góp ý', [s[7].id]]], le: [[s[2].id, 'lời cảm ơn, không đòi thay đổi']], phu: [[s[3].id, 'cua-tin-hieu-gom-nhom'], [s[8].id, 'viec-h4']] });
  const lt = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H3', cau_giao: '«Nhân viên tìm được quy trình»', dot: 'gom-1', phu: ['G3'] }, { ma: 'H6', cau_giao: '«Gửi góp ý «một chạm» trong CRM»', dot: 'gom-1', phu: ['G6'], slug: 'cua-tin-hieu-gom-nhom' }], chan_troi: [{ ma: 'CT1', dot: 'gom-1', phu: ['G2'], ly_do: 'chờ chu kỳ quý I' }] };
  const them = { ...hoSoThu('cua-tin-hieu-gom-nhom', 'signed-off', '«Gửi góp ý «một chạm» trong CRM»'), '_acceptance/cua-tin-hieu-gom-nhom/evidence-report.md': readFileSync(BAO_CAO_THAT, 'utf8'), ...hoSoThu('viec-h4', 'approved', '«Trưởng phòng xem số tuần trước»') };
  return { s, r: kho({ tins: s.slice(1), gom: { 'gom-1.md': gom }, lt, them }) };
}
async function cn1(kit) {
  const sai = [];
  const NGAY = ngayDocLap(readFileSync(BAO_CAO_THAT, 'utf8')); if (!NGAY) return ['đối chứng: báo cáo thật không có ngày ký'];
  console.log(`    CN-1: ngày rút độc lập từ báo cáo thật == ${NGAY}`);
  const { s, r } = khoCau(kit);
  const MONG = {
    [s[1].id]: ['chua-gom', 'chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới'],
    [s[2].id]: ['le', 'không xếp vào nhóm nào: lời cảm ơn, không đòi thay đổi'],
    [s[3].id]: ['da-phu', `đã có trong việc "Gửi góp ý «một chạm» trong CRM" — đã giao ngày ${NGAY}`],
    [s[4].id]: ['nhom-chua-cat', 'đã vào nhóm "Trưởng phòng ban thấy "số" tuần trước" — nhóm chưa thành việc'],
    [s[5].id]: ['chan-troi', 'đã vào nhóm "Nhân viên căn chỉnh OKR" — để sau: chờ chu kỳ quý I'],
    [s[6].id]: ['hang-chua-ho-so', 'đã vào nhóm "Nhân viên tìm quy trình" và thành việc "Nhân viên tìm được quy trình" — chưa bắt đầu'],
    [s[7].id]: ['hang-co-ho-so', `đã vào nhóm "Mọi người gửi góp ý" và thành việc "Gửi góp ý «một chạm» trong CRM" — đã giao ngày ${NGAY}`],
    [s[8].id]: ['da-phu', 'đã có trong việc "Trưởng phòng xem số tuần trước" — đang làm'],
  };
  const x = th(kit, r, '--duong'); if (x.status !== 0) return [`--duong exit ${x.status} ${x.stderr.slice(0, 160)}`];
  const ds = JSON.parse(x.stdout); const cho = new Set(); let soBan = 0;
  for (const [id, [c, cau]] of Object.entries(MONG)) {
    const b = ds.find(d => d.id === id); if (!b) { sai.push(`${c}: thiếu bản ghi ${id}`); continue; }
    cho.add(c); soBan += 1;
    if (b.cho !== c || b.cau_nguoi_gui !== cau) sai.push(`${c}: «${b.cho}» «${b.cau_nguoi_gui}» ≠ «${cau}»`);
  }
  console.log(`    CN-1: số chỗ đo == ${cho.size}, số bản ghi đo == ${soBan}`);
  if (cho.size !== 7 || soBan !== 8) sai.push(`đo ${cho.size} chỗ, ${soBan} bản ghi`);
  // Bộ mã của kho thử, rút từ chính kho (tệp tín hiệu, bản gom, lộ trình, thư mục hồ sơ).
  const lt = JSON.parse(readFileSync(path.join(r, 'docs', 'lo-trinh.json'), 'utf8'));
  const MA = [...readdirSync(path.join(r, 'tin-hieu')).map(f => f.replace(/\.json$/, '')), 'G1', 'G2', 'G3', 'G6', 'gom-1',
    ...lt.hang.flatMap(h => [h.ma, h.slug].filter(Boolean)), ...lt.chan_troi.map(c => c.ma),
    ...readdirSync(path.join(r, '_acceptance'), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)];
  for (const b of ds) for (const m of MA) if (coMa(b.cau_nguoi_gui, m)) sai.push(`${b.cho}: câu cho người gửi lọt mã «${m}»: ${b.cau_nguoi_gui}`);
  const cu = ds.find(d => d.id === s[7].id);
  if (!cu || !coMa(cu.cau, 'H6') || !coMa(cu.cau, 'cua-tin-hieu-gom-nhom')) sai.push(`đối chứng: câu cũ của «thành việc có hồ sơ» không chứa mã — phép quét không chứng được: ${cu && cu.cau}`);
  return sai;
}
if (want('CN-1') && await chayCa('CN-1', cn1)) ok('CN-1', 'tám bản ghi bảy chỗ == bảng viết sẵn (ngày rút độc lập từ báo cáo thật); không câu nào lọt mã của kho thử; đối chứng: câu cũ có mã');
if (want('CN-1-do')) await chayDo('CN-1-do', cn1, [['scripts/tin-hieu.mjs', 'và thành ${c.cauGiao ? `việc ${q(c.cauGiao)}`', 'và thành ${c.cauGiao ? `việc ${x.hang}`']], 'hang-co-ho-so', 'bản sao khuôn câu «thành việc» chèn mã việc');
if (want('CN-1-do2')) await chayDo('CN-1-do2', cn1, [['scripts/tin-hieu.mjs', 'return m ? `${Number(m[3])}/${Number(m[2])}/${m[1]}` : null;', 'return null;']], 'ngày', 'bản sao bộ đọc ngày ký trả null');

// ── CN-2: trường cũ không đổi byte so với 2.27 (AC-2) ─────────────────────────
const BASE_TH = '294b29db846a75f875f7c7637ce5a9080cda50aa';
async function cn2(kit) {
  const sai = [];
  let goc; try { goc = execFileSync('git', ['-C', KIT, 'show', `${BASE_TH}:scripts/tin-hieu.mjs`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch { return [`kho kit không có ${BASE_TH} — fetch trước`]; }
  const base = banSao([], kit); writeFileSync(path.join(base, 'scripts', 'tin-hieu.mjs'), goc);
  console.log(`    CN-2: base = cây đang kiểm + scripts/tin-hieu.mjs @${BASE_TH.slice(0, 8)}`);
  const { r } = khoCau(kit);
  const xm = th(kit, r, '--duong'); const xb = th(base, r, '--duong');
  if (xm.status !== 0 || xb.status !== 0) return [`--duong exit mới ${xm.status} base ${xb.status} ${xb.stderr.slice(0, 120)}`];
  const moi = JSON.parse(xm.stdout); const cu = JSON.parse(xb.stdout);
  if (moi.length !== cu.length) sai.push(`số bản ghi mới ${moi.length} ≠ base ${cu.length}`);
  for (const b of moi) { const a = cu.find(z => z.id === b.id); const { cau_nguoi_gui, ...bo } = b; if (!a || JSON.stringify(bo) !== JSON.stringify(a)) sai.push(`${b.cho}: bản ghi bỏ cau_nguoi_gui ≠ base: ${JSON.stringify(bo).slice(0, 140)} ≠ ${JSON.stringify(a).slice(0, 140)}`); }
  console.log(`    CN-2: số bản ghi so == ${moi.length}`);
  if (moi.length && JSON.stringify(moi[0]) === JSON.stringify(cu.find(z => z.id === moi[0].id))) sai.push('đối chứng: bản ghi đủ trường trùng base — phép so không thấy khác biệt');
  const TM = await nap(kit, 'scripts/tin-hieu.mjs'); const TB = await nap(base, 'scripts/tin-hieu.mjs');
  if (!deq(TM.TRUONG_DUONG, [...TB.TRUONG_DUONG, 'cau_nguoi_gui'])) sai.push(`TRUONG_DUONG ${JSON.stringify(TM.TRUONG_DUONG)} ≠ base + cau_nguoi_gui`);
  // Ca im: một PR khác đổi cách vẽ trang ở base → phép so bản ghi vẫn xanh (và trang thật sự khác).
  const lo = path.join(base, 'scripts', 'lo-trinh.mjs'); const loTxt = readFileSync(lo, 'utf8'); const MOC = "const khoiDuLieu = o => `<script";
  if (loTxt.split(MOC).length !== 2) return [...sai, 'ca im: không tìm thấy chỗ tiêm trong lo-trinh.mjs của base'];
  writeFileSync(lo, loTxt.replace(MOC, "const khoiDuLieu = o => `<!-- pr-khac -->\\n<script"));
  const pB = pm(base, r); const pageB = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8'); const pM = pm(kit, r); const pageM = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
  if (pB.status !== 0 || pM.status !== 0 || pageB === pageM || !pageB.includes('pr-khac')) sai.push('ca im: nhát tiêm vào trang base không có hiệu lực');
  const xb2 = th(base, r, '--duong'); const cu2 = JSON.parse(xb2.stdout || '[]');
  for (const b of moi) { const { cau_nguoi_gui, ...bo } = b; const a = cu2.find(z => z.id === b.id); if (JSON.stringify(bo) !== JSON.stringify(a)) sai.push(`ca im: ${b.cho} đỏ sau khi base đổi cách vẽ trang`); }
  return sai;
}
if (want('CN-2') && await chayCa('CN-2', cn2)) ok('CN-2', 'mọi bản ghi bỏ cau_nguoi_gui == base 2.27 (cùng thứ tự khoá); TRUONG_DUONG == base + cau_nguoi_gui; đối chứng khác biệt; ca im base đổi cách vẽ trang vẫn xanh');
if (want('CN-2-do')) await chayDo('CN-2-do', cn2, [['scripts/tin-hieu.mjs', '— để sau: ${x.ly_do}', '— hoãn: ${x.ly_do}']], 'chan-troi', 'bản sao đổi câu cũ của chỗ để sau');

// ── CN-3: cụm tình trạng theo nhóm tiến độ (AC-3) ─────────────────────────────
const BANG_TT = {
  'can-nhac': ['chua-bat-dau', 'chưa bắt đầu'], 'sap-mo': ['chua-bat-dau', 'chưa bắt đầu'],
  'cho-duyet': ['dang-lam', 'đang làm'], 'dang-dung': ['dang-lam', 'đang làm'],
  'cho-nghiem-thu': ['da-giao', 'đã giao'], 'da-ship': ['da-giao', 'đã giao'], 'da-nghiem-thu': ['da-giao', 'đã giao'],
  'xep-lai': ['khac', 'tạm hoãn'], 'da-bac': ['khac', 'đội sản phẩm quyết định không làm'], 'ngoai-pham-vi': ['khac', 'đội sản phẩm quyết định không làm'],
  hong: ['khac', 'chưa xem được tình trạng'],
};
const CUM_NHOM = { 'da-giao': 'đã giao', 'dang-lam': 'đang làm', 'chua-bat-dau': 'chưa bắt đầu' };
async function cn3(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs'); const PMM = await nap(kit, 'scripts/product-map.mjs'); const LT = await nap(kit, 'scripts/lo-trinh.mjs');
  const nhomDocLap = (khoa, chu) => (khoa && LT.DA_GIAO_O.includes(khoa) ? 'da-giao' : khoa && LT.DANG_LAM_O.includes(khoa) ? 'dang-lam' : (chu === LT.CHUA_MO || (khoa && LT.CHUA_LAM_O.includes(khoa))) ? 'chua-bat-dau' : 'khac');
  let so = 0;
  const xet = (khoa, chu, mong) => { so += 1; const r = T.tinhTrangCua(chu, null, PMM.SECTIONS); if (!mong) { sai.push(`ô ${khoa} chưa có cụm trong bảng`); return; } if (r.nhom !== mong[0] || r.cum !== mong[1]) sai.push(`${khoa}: «${r.nhom}» «${r.cum}» ≠ «${mong[0]}» «${mong[1]}»`); if (r.nhom !== nhomDocLap(khoa, chu)) sai.push(`${khoa}: nhóm ${r.nhom} ≠ nhóm tiến độ ${nhomDocLap(khoa, chu)}`); };
  for (const [khoa, chu] of PMM.SECTIONS) xet(khoa, chu, BANG_TT[khoa]);
  xet('chua-mo', LT.CHUA_MO, ['chua-bat-dau', 'chưa bắt đầu']); xet('khong-suy', LT.KHONG_SUY, ['khac', 'chưa xem được tình trạng']); xet('chu-la', 'chữ lạ thử', ['khac', 'chưa xem được tình trạng']);
  console.log(`    CN-3: số chữ đo == ${so} (SECTIONS ${PMM.SECTIONS.length} + 3)`);
  if (so !== PMM.SECTIONS.length + 3) sai.push(`đo ${so} chữ`);
  const daShip = PMM.SECTIONS.find(([k]) => k === 'da-ship')[1];
  if (T.tinhTrangCua(daShip, '5/10/2026', PMM.SECTIONS).cum !== 'đã giao ngày 5/10/2026') sai.push('ngày: đã giao không kèm ngày');
  const dangLam = PMM.SECTIONS.find(([k]) => k === 'dang-dung')[1];
  if (T.tinhTrangCua(dangLam, '5/10/2026', PMM.SECTIONS).cum !== 'đang làm') sai.push('ngày: đang làm mang ngày');
  // Kho: ba việc ở ba nhóm, cụm trong câu == nhom_trang_thai của chính hàng trong khối vẽ cùng kho.
  const t = i => tin(kit, i, { luc: LUC_TRUOC }); const a = t(1); const b = t(2); const c = t(3);
  const lt = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'HA', cau_giao: '«việc a»', dot: 'gom-1', phu: ['GA'], slug: 'cua-tin-hieu-gom-nhom' }, { ma: 'HB', cau_giao: '«việc b»', dot: 'gom-1', phu: ['GB'], slug: 'viec-hb' }, { ma: 'HC', cau_giao: '«việc c»', dot: 'gom-1', phu: ['GC'] }] };
  const them = { ...hoSoThu('cua-tin-hieu-gom-nhom', 'signed-off', '«việc a»'), '_acceptance/cua-tin-hieu-gom-nhom/evidence-report.md': readFileSync(BAO_CAO_THAT, 'utf8'), ...hoSoThu('viec-hb', 'approved', '«việc b»') };
  const r = kho({ tins: [a, b, c], gom: { 'gom-1.md': vietGom(kit, { nhom: [['GA', 'Nhóm a', [a.id]], ['GB', 'Nhóm b', [b.id]], ['GC', 'Nhóm c', [c.id]]] }) }, lt, them });
  if (pm(kit, r).status !== 0) return [...sai, 'vẽ trang kho thử hỏng'];
  const k = LT.docDuLieu(readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8')).duLieu;
  const ds = k.tin_hieu || []; const nhomGap = new Set();
  for (const x of ds) {
    const h = k.lo_trinh[0].hang.find(z => z.ma === x.hang); if (!h) { sai.push(`kho: tín hiệu ${x.id} không nối hàng`); continue; }
    nhomGap.add(h.nhom_trang_thai);
    const cum = CUM_NHOM[h.nhom_trang_thai]; if (!cum || !x.cau_nguoi_gui.includes(` — ${cum}`)) sai.push(`kho: hàng ${h.ma} nhóm ${h.nhom_trang_thai} mà câu «${x.cau_nguoi_gui}»`);
  }
  if (nhomGap.size !== 3) sai.push(`kho: chỉ gặp ${nhomGap.size} nhóm tiến độ ${JSON.stringify([...nhomGap])}`);
  return sai;
}
if (want('CN-3') && await chayCa('CN-3', cn3)) ok('CN-3', 'ma trận toàn phần chữ trạng thái == bảng, nhóm == nhóm tiến độ; ngày chỉ đi với đã giao; kho ba nhóm: cụm trong câu == nhom_trang_thai của khối');
if (want('CN-3-do')) await chayDo('CN-3-do', cn3, [['scripts/product-map.mjs', "  ['hong', 'Hồ sơ hỏng'],", "  ['o-moi-thu', 'Ô mới thử'],\n  ['hong', 'Hồ sơ hỏng'],"]], 'o-moi-thu', 'bản sao bản đồ thêm một ô chưa có cụm');

// ── CN-4: thiếu dữ liệu → câu nguyên văn của bảng, không ô trống lộ ra (AC-4) ──
async function cn4(kit) {
  const sai = []; const t1 = tin(kit, 1, { luc: LUC_TRUOC });
  const viec = (hang, them = {}) => ({ lt: { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H1', cau_giao: '«Việc một»', dot: 'gom-1', phu: ['G1'], ...hang }] }, gom: vietGom(kit, { nhom: [['G1', 'Nhóm một', [t1.id]]] }), them });
  const phu = (slug, them) => ({ lt: null, gom: vietGom(kit, { phu: [[t1.id, slug]] }), them });
  const CA = {
    'viec-khong-cau-giao': [viec({ cau_giao: '' }), 'đã vào nhóm "Nhóm một" và thành một việc chưa có tên — chưa bắt đầu'],
    'phu-khong-feature': [phu('giao-y', hoSoThu('giao-y', 'signed-off', null, 'manh 2026-10-05')), 'đã có trong một việc chưa có tên — đã giao ngày 5/10/2026'],
    'giao-khong-chu-ky': [viec({ slug: 'giao-z' }, hoSoThu('giao-z', 'signed-off', '«Việc một»', '')), 'đã vào nhóm "Nhóm một" và thành việc "Việc một" — đã giao'],
    'phu-giao-khong-chu-ky': [phu('giao-w', hoSoThu('giao-w', 'signed-off', '«Việc w»', '')), 'đã có trong việc "Việc w" — đã giao'],
    'le-khong-ly-do': [{ lt: null, gom: vietGom(kit, { le: [[t1.id, '']] }) }, 'không xếp vào nhóm nào'],
    'de-sau-khong-ly-do': [{ lt: { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'H9', cau_giao: '«khác»' }], chan_troi: [{ ma: 'CT1', dot: 'gom-1', phu: ['G1'] }] }, gom: vietGom(kit, { nhom: [['G1', 'Nhóm một', [t1.id]]] }) }, 'đã vào nhóm "Nhóm một" — để sau'],
  };
  let so = 0;
  for (const [ten, [o, mong]] of Object.entries(CA)) {
    so += 1;
    const r = kho({ tins: [t1], gom: { 'gom-1.md': o.gom }, lt: o.lt, them: o.them || {} });
    const x = th(kit, r, '--duong'); if (x.status !== 0) { sai.push(`${ten}: --duong exit ${x.status} ${x.stderr.slice(0, 100)}`); continue; }
    const c = (JSON.parse(x.stdout)[0] || {}).cau_nguoi_gui;
    if (c !== mong) sai.push(`${ten}: «${c}» ≠ «${mong}»`);
    if (/undefined|null|""/.test(String(c)) || /[:—\s]$/.test(String(c))) sai.push(`${ten}: câu lộ ô trống «${c}»`);
  }
  console.log(`    CN-4: số ca đo == ${so}`);
  if (so !== 6) sai.push(`đo ${so} ca`);
  return sai;
}
if (want('CN-4') && await chayCa('CN-4', cn4)) ok('CN-4', 'sáu ca thiếu dữ liệu == câu nguyên văn của bảng; không undefined/null/"", không dấu treo cuối câu');
if (want('CN-4-do')) await chayDo('CN-4-do', cn4, [['scripts/tin-hieu.mjs', 'và thành ${c.cauGiao ? `việc ${q(c.cauGiao)}` : VIEC_KHONG_TEN}', 'và thành việc ${q(c.cauGiao)}']], 'viec-khong-cau-giao', 'bản sao bỏ nhánh dự phòng của câu giao vắng');

// ── CN-5: phép kiểm câu — lọt mã (AC-5) ───────────────────────────────────────
const dongTH = s => String(s).split('\n').filter(l => l.startsWith('tín hiệu '));
function khoCan(kit, { ten1 = 'Nhóm thử', le = 'cảm ơn', feature = '«Việc đã giao thử»', ky = 'manh 2026-10-05', h7 = '«Việc bảy»', lt = true, hang = null } = {}) {
  const t = i => tin(kit, i, { luc: LUC_TRUOC }); const s = [null, t(1), t(2), t(3), t(4)];
  const gom = vietGom(kit, { nhom: [['G1', ten1, [s[1].id]], ['G2', 'Nhóm hai', [s[2].id]]], le: [[s[3].id, le]], phu: [[s[4].id, 'giao-x']] });
  const ltO = { schema: 1, ten: 'Lộ trình thử', hang: hang || [{ ma: 'K2', cau_giao: '«Đọc bảng K2b»', dot: 'gom-1', phu: ['G1'] }, { ma: 'H7', cau_giao: h7, dot: 'gom-1', phu: ['G2'] }, { ma: 'H8', cau_giao: '«Việc tám»' }] };
  return { s, r: kho({ tins: s.slice(1), gom: { 'gom-1.md': gom }, lt: lt ? ltO : null, them: hoSoThu('giao-x', 'signed-off', feature, ky) }) };
}
async function cn5(kit) {
  const sai = [];
  const { s, r } = khoCan(kit);
  const x = th(kit, r, '--cau'); const tom = x.stdout.split('\n').filter(l => l.startsWith('câu cho người gửi:'));
  if (x.status !== 0 || tom.length !== 1 || !tom[0].includes('4 câu') || !tom[0].includes('bỏ qua') || dongTH(x.stdout).length) sai.push(`sạch: exit ${x.status} ${JSON.stringify(x.stdout.slice(0, 240))} ${x.stderr.slice(0, 120)}`);
  const CA = {
    'ten-nhom-id': [{ ten1: `Nhóm giống ${s[3].id}` }, s[1].id, s[3].id],
    'ten-nhom-ho-so': [{ ten1: 'Nhóm giống giao-x' }, s[1].id, 'giao-x'],
    'le-ma-nhom': [{ le: 'trùng nhóm G2' }, s[3].id, 'G2'],
    'cau-giao-ma-viec': [{ h7: '«Làm tiếp H8»' }, s[2].id, 'H8'],
    'feature-ho-so': [{ feature: '«Việc giao-x đã xong»' }, s[4].id, 'giao-x'],
  };
  let so = 0;
  for (const [ten, [o, id, ma]] of Object.entries(CA)) {
    so += 1;
    const k2 = khoCan(kit, o).r; const y = th(kit, k2, '--cau'); const L = dongTH(y.stdout);
    const duong = JSON.parse(th(kit, k2, '--duong').stdout || '[]'); const cau = (duong.find(d => d.id === id) || {}).cau_nguoi_gui;
    if (y.status !== 1 || L.length !== 1 || !L[0].includes(id) || !L[0].includes(`«${ma}»`) || !cau || !L[0].includes(cau)) sai.push(`${ten}: exit ${y.status}, ${L.length} dòng ${JSON.stringify(L).slice(0, 220)}`);
  }
  console.log(`    CN-5: số ca đỏ đo == ${so}`);
  if (so !== 5) sai.push(`đo ${so} ca`);
  // Ca im: mã chỉ chữ số trùng chữ thường trong câu giao.
  const q4 = khoCan(kit, { hang: [{ ma: '4', cau_giao: '«Đo trên khuôn quý 4»', dot: 'gom-1', phu: ['G2'] }, { ma: 'K2', cau_giao: '«Đọc bảng K2b»', dot: 'gom-1', phu: ['G1'] }] }).r;
  const z = th(kit, q4, '--cau'); const bq = (z.stdout.match(/bỏ qua (\d+)/) || [])[1];
  if (z.status !== 0 || !(Number(bq) >= 1) || !z.stdout.includes('chỉ chữ số')) sai.push(`quy-4: exit ${z.status} ${JSON.stringify(z.stdout.slice(0, 200))}`);
  // Chữ ký có mà không đọc được ngày → đỏ nêu hồ sơ và giá trị.
  const kk = khoCan(kit, { ky: 'manh hôm qua' }).r; const w = th(kit, kk, '--cau'); const Lw = dongTH(w.stdout);
  if (w.status !== 1 || Lw.length !== 1 || !Lw[0].includes('giao-x') || !Lw[0].includes('manh hôm qua')) sai.push(`chu-ky-khong-ngay: exit ${w.status} ${JSON.stringify(Lw)}`);
  // Kho không có tệp lộ trình; kho không khai cửa.
  const kl = khoCan(kit, { lt: false }).r; const v = th(kit, kl, '--cau'); if (v.status !== 0) sai.push(`khong-lo-trinh: exit ${v.status} ${v.stderr.slice(0, 120)}`);
  const kv = kho({ cfg: '' }); const u = th(kit, kv, '--cau'); if (u.status !== 2 || !u.stderr.includes('kho chưa khai cửa tín hiệu')) sai.push(`khong-khai: exit ${u.status}`);
  // Chỉ đọc.
  const anh = d => { const h = createHash('sha256'); const di = p => { for (const e of readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { if (e.name === '.git') continue; const f = path.join(p, e.name); if (e.isDirectory()) di(f); else h.update(f).update(readFileSync(f)); } }; di(d); return `${h.digest('hex')}|${git(d, 'status', '--porcelain')}`; };
  for (const d of [r, kk, q4, r]) { const t0 = anh(d); th(kit, d, '--cau'); if (anh(d) !== t0) sai.push('chỉ đọc: --cau đổi cây'); }
  return sai;
}
if (want('CN-5') && await chayCa('CN-5', cn5)) ok('CN-5', 'kho sạch một dòng tóm tắt; năm ca lọt mã mỗi ca đúng một dòng nêu tín hiệu, mã, câu; quý 4 im và được đếm bỏ qua; chữ ký không ngày đỏ; không lộ trình chạy; không khai thoát 2; chỉ đọc');
if (want('CN-5-do')) await chayDo('CN-5-do', cn5, [['scripts/tin-hieu.mjs', '  for (const s of thuMucHoSo(root)) them(s);\n', '']], 'ten-nhom-ho-so', 'bản sao bỏ tên thư mục hồ sơ khỏi bộ mã');
if (want('CN-5-do2')) await chayDo('CN-5-do2', cn5, [['scripts/tin-hieu.mjs', 'const kiemDuoc = m => ', 'const kiemDuoc = m => true || ']], 'quy-4', 'bản sao bỏ bộ lọc mã giống chữ thường');

// ── CN-6: từ cấm một nguồn có marker (AC-6) ───────────────────────────────────
async function cn6(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs'); let cam;
  try { cam = T.napCam(); } catch (e) { return [`napCam: ${e.message}`]; }
  const thuong = cam.filter(c => !c.khung); const khung = cam.filter(c => c.khung);
  if (!thuong.length || !khung.length) return [`khối cần ≥1 từ thường và ≥1 từ khung: ${JSON.stringify(cam)}`];
  if (!khung.some(c => c.tu === 'hồ sơ')) sai.push('«hồ sơ» không mang nhãn khung trong khối');
  const w0 = thuong[0].tu;
  // Đối chứng: kho sạch có đủ chỗ chưa gom (khung không chỗ trống) và việc xếp lại → thoát 0.
  const t = (i, luc = LUC_TRUOC) => tin(kit, i, { luc }); const a = t(1, LUC_SAU); const b = t(2); const c = t(3); const d = t(4);
  const ltXL = { schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'HX', cau_giao: '«việc để sau»', dot: 'gom-1', phu: ['GX'], slug: 'viec-xl' }, { ma: 'HH', cau_giao: '«Mở hồ sơ khách hàng nhanh»', dot: 'gom-1', phu: ['GH'] }] };
  const dung = le => kho({ tins: [a, b, c, d], gom: { 'gom-1.md': vietGom(kit, { nhom: [['GX', 'Nhóm để sau', [b.id]], ['GH', 'Nhóm khách', [d.id]]], le: [[c.id, le]] }) }, lt: ltXL, them: { '_acceptance/viec-xl/opportunity.md': OPP_PARK('viec-xl') } });
  const r0 = dung('cảm ơn'); const x0 = th(kit, r0, '--cau');
  if (x0.status !== 0) sai.push(`sạch: exit ${x0.status} ${dongTH(x0.stdout).join(' | ').slice(0, 300)} ${x0.stderr.slice(0, 120)}`);
  const ds0 = JSON.parse(th(kit, r0, '--duong').stdout || '[]');
  if (!ds0.some(z => z.cau_nguoi_gui.endsWith('— tạm hoãn'))) sai.push(`đối chứng: không có câu của việc xếp lại ${JSON.stringify(ds0.map(z => z.cau_nguoi_gui))}`);
  // Từ thường trong lý do → đỏ; dạng NFD vẫn đỏ.
  const r1 = dung(`ghi chú ${w0} cũ`); const x1 = th(kit, r1, '--cau'); const L1 = dongTH(x1.stdout);
  if (x1.status !== 1 || L1.length !== 1 || !L1[0].includes(`«${w0}»`) || !L1[0].includes(`ghi chú ${w0} cũ`)) sai.push(`tu-thuong: exit ${x1.status} ${JSON.stringify(L1)}`);
  const nfd = w0.normalize('NFD'); if (nfd === w0.normalize('NFC')) sai.push(`nfd: từ «${w0}» không có dạng tổ hợp khác — chọn từ có dấu`);
  const r2 = dung(`ghi chú ${nfd} cũ`); const x2 = th(kit, r2, '--cau');
  if (x2.status !== 1 || dongTH(x2.stdout).length !== 1) sai.push(`nfd: exit ${x2.status} ${JSON.stringify(dongTH(x2.stdout))}`);
  return sai;
}
if (want('CN-6') && await chayCa('CN-6', cn6)) ok('CN-6', 'khối đủ hai loại, «hồ sơ» mang nhãn khung; kho sạch (chưa gom, xếp lại, «hồ sơ khách hàng» trong câu giao) xanh; từ thường trong lý do đỏ, cả dạng NFD');
if (want('CN-6-do')) await chayDo('CN-6-do', cn6, [['scripts/tin-hieu.mjs', "'chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới'", "'chưa xếp vào nhóm nào — hồ sơ sẽ xem ở lần xếp nhóm tới'"]], 'hồ sơ', 'bản sao khuôn câu «chưa gom» chèn «hồ sơ»');
if (want('CN-6-do-tt')) await chayDo('CN-6-do-tt', cn6, [['scripts/tin-hieu.mjs', "'xep-lai': 'tạm hoãn'", "'xep-lai': 'tạm hoãn hồ sơ'"]], 'hồ sơ', 'bản sao cụm tình trạng «tạm hoãn» chèn «hồ sơ»');
if (want('CN-6-do4')) await chayDo('CN-6-do4', cn6, [['scripts/tin-hieu.mjs', "const nfc = s => String(s ?? '').normalize('NFC');", "const nfc = s => String(s ?? '');"]], 'nfd', 'bản sao bỏ chuẩn hoá NFC');
if (want('CN-6-do2')) {
  try {
    const lanh = await cn6(KIT); if (lanh.length) bad('CN-6-do2', `bản lành chưa xanh: ${lanh[0]}`); else {
      const bs = banSao([['skills/acceptance/references/tin-hieu-template.md', '- slug\n', '- slug\n- đội sản phẩm (khung)\n']]);
      const t = (i, luc = LUC_TRUOC) => tin(KIT, i, { luc }); const a = t(1, LUC_SAU); const b = t(2); const c = t(3);
      const r = kho({ tins: [a, b, c], gom: { 'gom-1.md': vietGom(KIT, { nhom: [['G1', 'Nhóm một', [b.id]]], le: [[c.id, 'cảm ơn']] }) } });
      const x = th(bs, r, '--cau'); const L = dongTH(x.stdout).filter(l => l.includes('«đội sản phẩm»'));
      const ds = JSON.parse(th(bs, r, '--duong').stdout || '[]'); const coTu = ds.filter(z => z.cau_nguoi_gui.includes('đội sản phẩm')).length;
      console.log(`    CN-6-do2: câu đỏ == ${L.length}, câu có «đội sản phẩm» == ${coTu}`);
      if (x.status === 1 && coTu > 0 && L.length === coTu) ok('CN-6-do2', `bản sao khối cấm thêm «đội sản phẩm (khung)»: ${L.length} câu đang xanh thành đỏ, «${L[0].slice(0, 90)}»`); else bad('CN-6-do2', `exit ${x.status}, ${L.length} đỏ ≠ ${coTu}`);
    }
  } catch (e) { bad('CN-6-do2', loi(e)); }
}
if (want('CN-6-do3')) {
  try {
    const bs = banSao([['skills/acceptance/references/tin-hieu-template.md', '<!-- <<<TIN-HIEU-CAU-CAM -->', '<!-- da-xoa -->']]);
    const r = kho({ tins: [tin(KIT, 1, { luc: LUC_TRUOC })], gom: { 'gom-1.md': vietGom(KIT, { le: [[tin(KIT, 1).id, 'cảm ơn']] }) } });
    const x = th(bs, r, '--cau');
    if (x.status === 2 && x.stderr.includes('TIN-HIEU-CAU-CAM')) ok('CN-6-do3', `bản sao khuôn mất khối: thoát 2, «${x.stderr.trim().slice(0, 90)}»`); else bad('CN-6-do3', `exit ${x.status} ${x.stderr.slice(0, 120)}`);
  } catch (e) { bad('CN-6-do3', loi(e)); }
}

// ── CN-7: đường đọc-cũ + cờ vàng + tài liệu (AC-7) ────────────────────────────
async function cn7(kit) {
  const sai = [];
  const T = await nap(kit, 'scripts/tin-hieu.mjs');
  const { r } = khoCau(kit); if (pm(kit, r).status !== 0) return ['vẽ trang hỏng'];
  const html = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
  const doc = chepRoi(readFileSync(path.join(kit, 'scripts', 'lo-trinh.mjs'), 'utf8'));
  const a = doc(html); const ds = (a.duLieu && a.duLieu.tin_hieu) || [];
  if (!ds.length) return ['khối không có tin_hieu'];
  for (const b of ds) { const v = T.cauChoNguoiGui(b); if (v.cau !== b.cau_nguoi_gui || v.co !== null) sai.push(`trang mới: ${b.id} ${JSON.stringify(v)}`); }
  const cu = html.replace(/(<script type="application\/json" id="lo-trinh-du-lieu">)([\s\S]*?)(<\/script>)/, (m, p1, j, p3) => { const o = JSON.parse(j); for (const b of o.tin_hieu) delete b.cau_nguoi_gui; return p1 + JSON.stringify(o).replace(/</g, '\\u003c') + p3; });
  const bb = doc(cu); const dsc = (bb.duLieu && bb.duLieu.tin_hieu) || [];
  for (const b of dsc) { const v = T.cauChoNguoiGui(b); if (v.cau !== b.cau || !String(v.co).includes('bản vẽ cũ')) sai.push(`trang cũ: ${b.id} ${JSON.stringify(v)}`); }
  if (!deq(a.duLieu.tin_hieu, khoiThô(html).tin_hieu) || !deq(dsc, khoiThô(cu).tin_hieu)) sai.push('docDuLieu chép rời không giữ nguyên mảng');
  if (!deq(a.canhBao, bb.canhBao)) sai.push(`cảnh báo khác giữa trang mới và cũ: ${JSON.stringify(a.canhBao)} ≠ ${JSON.stringify(bb.canhBao)}`);
  const tlTxt = readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-du-lieu.md'), 'utf8');
  const tl = khoiMd(tlTxt, 'LO-TRINH-DU-LIEU-TUY-CHON'); if (tl == null) return [...sai, 'tài liệu thiếu khối LO-TRINH-DU-LIEU-TUY-CHON'];
  const truong = tl.split('\n').filter(Boolean).map(l => (l.match(/^tin_hieu\.([a-z_]+) — /) || [])[1]);
  for (const f of T.TRUONG_DUONG) if (!truong.includes(f)) sai.push(`tài liệu thiếu trường ${f}`);
  for (const f of truong) if (!T.TRUONG_DUONG.includes(f)) sai.push(`tài liệu có trường lạ ${f}`);
  const doan = (tlTxt.split('### Khoá tuỳ chọn `tin_hieu`')[1] || '').split('\n### ')[0];
  if (!doan.includes('cau_nguoi_gui') || !doan.includes('bản vẽ cũ')) sai.push('đoạn khoá tin_hieu chưa nêu luật đọc lùi cau_nguoi_gui + cờ «bản vẽ cũ»');
  return sai;
}
if (want('CN-7') && await chayCa('CN-7', cn7)) ok('CN-7', 'trang mới: câu người gửi, không cờ; trang cũ: câu cũ + cờ «bản vẽ cũ»; docDuLieu chép rời giữ mảng, cảnh báo như nhau; tài liệu == TRUONG_DUONG và nêu luật đọc lùi');
if (want('CN-7-do')) await chayDo('CN-7-do', cn7, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'tin_hieu.cau_nguoi_gui — ', 'tin_hieu.cau_nguoi_guiX — ']], 'cau_nguoi_gui', 'bản sao tài liệu thiếu dòng cau_nguoi_gui');

// ── CN-8: skill gom chạy phép kiểm câu (AC-8) ─────────────────────────────────
async function cn8(kit) {
  const sai = []; const sk = SKILL(kit);
  const b = khoiMd(sk, 'GOM-CAU'); if (b == null) return ['GOM-CAU: SKILL thiếu khối'];
  const chay = r => spawnSync('bash', ['-c', b.trim()], { cwd: r, encoding: 'utf8', env: { ...process.env, AG: kit } });
  const t1 = tin(kit, 1, { luc: LUC_TRUOC }); const t2 = tin(kit, 2, { luc: LUC_TRUOC });
  const rX = kho({ tins: [t1, t2], gom: { 'gom-1.md': vietGom(kit, { nhom: [['G1', 'Kỹ sư ghim lại nhanh', [t1.id, t2.id]]] }) } });
  const rD = kho({ tins: [t1, t2], gom: { 'gom-1.md': vietGom(kit, { nhom: [['G1', `Kỹ sư ghim lại ${t2.id}`, [t1.id, t2.id]]] }) } });
  const x = chay(rX); if (x.status !== 0) sai.push(`GOM-CAU: xanh thoát ${x.status} ${String(x.stderr || '').slice(0, 100)}`);
  const d = chay(rD); if (d.status !== 1 || !d.stdout.includes('lọt mã')) sai.push(`GOM-CAU: đỏ thoát ${d.status} ${String(d.stdout).slice(0, 100)}`);
  const iR = sk.indexOf('<!-- <<<GOM-RANG -->'); const iC = sk.indexOf('<!-- <<<GOM-CAU -->'); const i4 = sk.indexOf('## Bước 4 — chuyển cho cắt lượt');
  if (!(iR >= 0 && iR < iC && iC < i4)) sai.push(`GOM-CAU: thứ tự GOM-RANG ${iR} < GOM-CAU ${iC} < Bước 4 ${i4} sai`);
  const doan = sk.slice(sk.indexOf('<!-- GOM-RANG>>> -->'), i4); if (!/người gửi/.test(doan)) sai.push('GOM-CAU: đoạn quanh khối không nói tên nhóm / lý do hiện cho người gửi');
  return sai;
}
if (want('CN-8') && await chayCa('CN-8', cn8)) ok('CN-8', 'GOM-CAU chạy nguyên văn: sạch 0, tên nhóm lọt mã 1 «lọt mã»; đứng sau GOM-RANG, trước Bước 4; nói câu hiện cho người gửi');
if (want('CN-8-do')) await chayDo('CN-8-do', cn8, [['skills/gom-tin-hieu/SKILL.md', '--root . --cau', '--root . --cauu']], 'GOM-CAU', 'bản sao SKILL gõ sai lệnh trong GOM-CAU');


rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (tin-hieu)`);
process.exit(fail ? 1 : 0);
