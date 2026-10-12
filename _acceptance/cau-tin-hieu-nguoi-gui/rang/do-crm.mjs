#!/usr/bin/env node
// do-crm.mjs — hồ sơ cau-tin-hieu-nguoi-gui, AC-9: câu cho người gửi đo trên DỮ LIỆU THẬT.
//
//   node do-crm.mjs --crm <kho crm> --sha <sha crm> [--ghi]
//
// Dựng hai bản sao bằng `git archive` (chỉ tệp chữ của hồ sơ + lộ trình + cấu hình, không ảnh), mỗi bản sao
// nhận tín hiệu MẪU của kit (khối TIN-HIEU-MAU của khuôn) và một bản gom sinh từ khối GOM-MAU (rút từ khuôn,
// không viết tay) đặt tín hiệu vào mọi chỗ: một việc thật ở mỗi nhóm tiến độ kho đang có (máy chọn tất định:
// việc đầu tiên của mỗi nhóm theo thứ tự tệp lộ trình) · nhóm chưa thành việc · để sau · lẻ · đã phủ một hồ
// sơ đã ký thật · chưa xếp. Rồi chạy `--duong` + `--cau` của kit ĐANG KIỂM (gốc kit suy từ vị trí tệp này).
//   1. crm @ --sha — kho tiêu thụ thật (câu giao thật, mã chỉ chữ số / một chữ cái thật, tên hồ sơ thật).
//   2. kit @ BASE_KIT (2.27) — chỉ để kiểm máy «0 câu lọt» trên ~150 hồ sơ thật; lộ trình kit là của người
//      phát triển, không phải của người gửi ở phòng ban, nên câu của nó KHÔNG vào tệp mẫu cho giám khảo.
//   3. kho thử bảy chỗ do máy dựng (câu giao tiếng sản phẩm, hồ sơ đã ký mang bản chép báo cáo thật).
// In «PASS: CRM-xanh» · «PASS: KIT-xanh» · «PASS: KHO-THU-xanh» · «PASS: CRM-mau» · «PASS: CRM-do». `--ghi`
// ghi mau/cau-mau.json = câu của kho thử + bản sao crm (đầu vào của giám khảo E10, đúng AC-9/AC-10); không
// `--ghi` → so tệp đã commit với bản sinh lại. Chỉ đọc kho crm; mọi bản
// sao ở thư mục tạm. Mã thoát: 0 đạt · 1 có ca sai · 2 không chạy được (kho crm vắng, sha không có).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HS = path.resolve(HERE, '..');
const KIT = path.resolve(HS, '..', '..');
const BASE_KIT = '294b29db846a75f875f7c7637ce5a9080cda50aa';
const TEP_MAU = path.join(HS, 'mau', 'cau-mau.json');
const a = process.argv.slice(2);
const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const bail = m => { process.stderr.write(`do-crm: ${m}\n`); process.exit(2); };
const crm = lay('--crm'); const sha = lay('--sha'); const ghi = a.includes('--ghi');
if (!crm || !sha) bail('cần --crm <kho crm> --sha <sha>');
if (!existsSync(path.join(crm, '.git'))) bail(`không thấy kho git crm ở ${crm} (đã thử đường này) — đặt CRM_ROOT hoặc --crm`);
const g = (d, ...x) => execFileSync('git', ['-C', d, ...x], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
for (const [d, s] of [[crm, sha], [KIT, BASE_KIT]]) { try { g(d, 'rev-parse', '--verify', `${s}^{commit}`); } catch { bail(`${d} không có commit ${s} — fetch trước`); } }

const TMP = mkdtempSync(path.join(tmpdir(), 'do-crm-'));
const sai = []; const ok = (id, m) => console.log(`  PASS: ${id} — ${m}`); const bad = (id, m) => { sai.push(id); console.log(`  FAIL: ${id} — ${m}`); };
const nap = rel => import(pathToFileURL(path.join(KIT, rel)).href);
const T = await nap('scripts/tin-hieu.mjs'); const LT = await nap('scripts/lo-trinh.mjs'); const PMM = await nap('scripts/product-map.mjs');
const req = createRequire(import.meta.url);
const { boNgoacNgoai } = req(path.join(KIT, 'scripts', 'ho-so-tom-tat.cjs'));
// Trạng thái hồ sơ rút từ lib (không viết cứng chữ trạng thái — luật RT13 của kho).
const { DA_THONG_CONG_2 } = req(path.join(KIT, 'lib', 'workspace-record.cjs'));
const DA_KY = DA_THONG_CONG_2[0];
const khoi = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const KHUON = readFileSync(path.join(KIT, 'skills', 'acceptance', 'references', 'tin-hieu-template.md'), 'utf8');
const ngayDocLap = txt => { const m = String(txt).match(/^human_signoff:[^\n]*?(\d{4})-(\d{2})-(\d{2})/m); return m ? `${Number(m[3])}/${Number(m[2])}/${m[1]}` : null; };
const tin = (pre, i, luc) => { const [, ...than] = khoi(KHUON, 'TIN-HIEU-MAU').trim().split('\n'); const o = JSON.parse(than.join('\n')); o.noi_dung.tieu_de = `điều gặp số ${i}`; o.luc = luc; o.phien = pre; return { id: `${pre}-${i}`, o }; };
function vietGom({ dot, den, nhom, le, phu }) {
  const L = khoi(KHUON, 'GOM-MAU').split('\n'); const iN = L.findIndex(l => l.startsWith('- `'));
  const dau = L.filter(l => /^(dot|dang|nguon|truc|den):/.test(l)).map(l => l.replace(/^dot:.*/, `dot: ${dot}`).replace(/^den:.*/, `den: ${den}`));
  const ra = [...dau, ''];
  for (const [ma, ten, ids] of nhom) { ra.push(L[iN].replace(/`[^`]*`/, `\`${ma}\``).replace(/ — .*$/, ` — ${ten}`)); ra.push(L[iN + 1].replace(/:.*$/, `: ${ids.map(x => `\`${x}\``).join(', ')}`)); }
  ra.push('');
  const lLe = L.find(l => l.startsWith('- lẻ ')); const lPhu = L.find(l => l.startsWith('- đã phủ '));
  for (const [id, ly] of le) ra.push(lLe.replace(/`[^`]*`/, `\`${id}\``).replace(/ — .*$/, ` — ${ly}`));
  for (const [id, slug] of phu) ra.push(lPhu.replace(/`[^`]*`/, `\`${id}\``).replace(/ — .*$/, ` — ${slug}`));
  return ra.join('\n') + '\n';
}

// Bản sao: chỉ tệp chữ của hồ sơ + lộ trình + cấu hình ở <s>, rồi git init để mọi bộ đọc chạy như ở kho thật.
function banSao(goc, s, ten, them) {
  const r = path.join(TMP, ten); mkdirSync(r, { recursive: true });
  const tar = path.join(TMP, `${ten}.tar`);
  execFileSync('git', ['-C', goc, 'archive', '-o', tar, s, '--', ':(glob)_acceptance/**/*.md', ':(glob)_acceptance/**/*.jsonl', ':(glob)_acceptance/**/*.yaml', ':(glob)docs/**/*.json']);
  execFileSync('tar', ['-xf', tar, '-C', r]);
  const cfgP = path.join(r, '_acceptance', 'config.yaml'); if (them) writeFileSync(cfgP, readFileSync(cfgP, 'utf8') + them);
  return r;
}
const cam = (r, ...x) => spawnSync(process.execPath, [path.join(KIT, 'scripts', 'tin-hieu.mjs'), '--root', r, ...x], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
// Một lượt đo trên một bản sao: chọn việc thật theo nhóm tiến độ, nối tín hiệu, chạy --duong + --cau.
function do1(r, pre) {
  const khai = T.docKhai(r); if (!khai) throw new Error(`${pre}: bản sao không khai cửa tín hiệu`);
  const kho = LT.phanTichKho({ root: r, classify: PMM.classify, sections: PMM.SECTIONS });
  const cacTep = LT.docCacTep(r).tep; const chon = new Map();
  kho.cacTep.forEach((t, i) => { if (!t.kq) return; for (const d of t.kq.dong) {
    const nhom = T.tinhTrangCua(d.chu, null, PMM.SECTIONS).nhom; const k = nhom === 'chua-bat-dau' ? (d.hoSo ? 'chua-bat-dau+ho-so' : nhom) : nhom;
    if (!chon.has(k) && (nhom !== 'da-giao' || d.hoSo)) chon.set(k, { tep: cacTep[i], ma: String(d._ma), cauGiao: boNgoacNgoai(String(d.cau_giao || '').trim()), hoSo: d.hoSo || null, nhom });
  } });
  const viec = [...chon.values()].filter(v => v.nhom !== 'chua-bat-dau' || !chon.has('chua-bat-dau') || !v.hoSo);
  // Hồ sơ đã ký thật đầu tiên (theo tên) có ngày ký và câu giao — đích của «đã phủ».
  const acc = path.join(r, '_acceptance'); let phu = null;
  for (const s of readdirSync(acc, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort()) {
    const st = T.trangThaiHoSo(r, s); const ev = existsSync(path.join(acc, s, 'evidence-report.md')) ? readFileSync(path.join(acc, s, 'evidence-report.md'), 'utf8') : '';
    if (st.daGiao && st.feature && ngayDocLap(ev)) { phu = { slug: s, ngay: ngayDocLap(ev), cauGiao: boNgoacNgoai(st.feature) }; break; }
  }
  if (!phu) throw new Error(`${pre}: không có hồ sơ đã ký có ngày`);
  const LUC = '2026-10-20T00:00:00Z'; const DEN = '2026-12-31T00:00:00Z'; const DOT = 'gom-do-cau';
  const TEN = ['Nhân viên gửi góp ý ngay trong CRM', 'Trưởng phòng thấy việc của phòng mình', 'Người dùng tìm được hướng dẫn', 'Quản trị xem chi phí theo tháng'];
  const tins = []; const nhom = []; const nho = [];
  viec.forEach((v, i) => { const t = tin(pre, i + 1, LUC); tins.push(t); nhom.push([`N${i + 1}`, TEN[i % TEN.length], [t.id]]); nho.push({ ...v, ma_nhom: `N${i + 1}`, id: t.id }); });
  const n = viec.length;
  const tChua = tin(pre, n + 1, LUC); const tSau = tin(pre, n + 2, LUC); const tLe = tin(pre, n + 3, LUC); const tPhu = tin(pre, n + 4, LUC); const tXep = tin(pre, n + 5, LUC);
  tins.push(tChua, tSau, tLe, tPhu, tXep);
  nhom.push(['N-chua', 'Nhân viên xem lại tín hiệu đã gửi', [tChua.id]], ['N-sau', 'Trưởng phòng đặt lịch họp nhanh', [tSau.id]]);
  // Nối nhóm vào việc thật (bản sao), thêm một mục chân trời.
  const theoTep = new Map(); for (const v of nho) { if (!theoTep.has(v.tep)) theoTep.set(v.tep, []); theoTep.get(v.tep).push(v); }
  const tep0 = cacTep[0];
  for (const tep of new Set([...theoTep.keys(), tep0])) {
    const p = path.join(r, tep); const j = JSON.parse(readFileSync(p, 'utf8'));
    for (const v of theoTep.get(tep) || []) { const h = j.hang.find(x => String(x.ma) === v.ma); h.dot = DOT; h.phu = [v.ma_nhom]; }
    if (tep === tep0) j.chan_troi = [...(Array.isArray(j.chan_troi) ? j.chan_troi : []), { ma: 'CT-do-cau', dot: DOT, phu: ['N-sau'], ly_do: 'chờ đợt góp ý sau 14/10' }];
    writeFileSync(p, JSON.stringify(j, null, 2));
  }
  const nguon = path.join(r, khai.nguon[0]); mkdirSync(nguon, { recursive: true });
  for (const t of tins) writeFileSync(path.join(nguon, `${t.id}.json`), JSON.stringify(t.o));
  mkdirSync(path.join(r, khai.gom), { recursive: true });
  const gomTep = path.join(r, khai.gom, `${DOT}.md`);
  writeFileSync(gomTep, vietGom({ dot: DOT, den: DEN, nhom, le: [[tLe.id, 'lời cảm ơn, không đòi thay đổi gì']], phu: [[tPhu.id, phu.slug]] }));
  const x = cam(r, '--duong'); if (x.status !== 0) throw new Error(`${pre}: --duong thoát ${x.status} ${x.stderr.slice(0, 200)}`);
  const ds = JSON.parse(x.stdout).filter(b => b.id.startsWith(`${pre}-`));
  const y = cam(r, '--cau');
  return { ds, y, nho, phu, tPhu, tXep, gomTep, nhom, tLe, DOT, DEN };
}
function kiem(id, r, pre) {
  const k = do1(r, pre); const loi = [];
  if (k.y.status !== 0) loi.push(`--cau thoát ${k.y.status}: ${k.y.stdout.split('\n').slice(0, 4).join(' | ').slice(0, 400)}`);
  for (const v of k.nho) {
    const b = k.ds.find(z => z.id === v.id); console.log(`    ${id}: nhóm tiến độ ${v.nhom} → việc ${v.ma}${v.hoSo ? ` (hồ sơ ${v.hoSo})` : ''}: ${b && b.cau_nguoi_gui}`);
    if (!b || !b.hang || (v.cauGiao && !b.cau_nguoi_gui.includes(`"${v.cauGiao}"`))) loi.push(`việc ${v.ma}: câu không chứa câu giao thật «${v.cauGiao}»: ${b && b.cau_nguoi_gui}`);
  }
  const bp = k.ds.find(z => z.id === k.tPhu.id);
  console.log(`    ${id}: đã phủ → hồ sơ ${k.phu.slug} ký ngày ${k.phu.ngay}: ${bp && bp.cau_nguoi_gui}`);
  if (!bp || !bp.cau_nguoi_gui.includes(` ngày ${k.phu.ngay}`) || !bp.cau_nguoi_gui.includes(`"${k.phu.cauGiao}"`)) loi.push(`đã phủ: câu thiếu câu giao hoặc ngày ký thật ${k.phu.ngay}: ${bp && bp.cau_nguoi_gui}`);
  const cho = new Set(k.ds.map(z => z.cho)); console.log(`    ${id}: ${k.ds.length} tín hiệu, ${cho.size} chỗ ${JSON.stringify([...cho].sort())}`);
  if (loi.length) bad(id, loi.join(' ; ')); else ok(id, `${k.nho.length} việc thật ở ${new Set(k.nho.map(v => v.nhom)).size} nhóm tiến độ + đã phủ hồ sơ đã ký thật: --cau thoát 0, câu mang câu giao thật và ngày ký thật`);
  return k;
}

// Kho thử bảy chỗ: câu giao tiếng sản phẩm; hồ sơ đã ký mang bản chép NGUYÊN VĂN báo cáo đã ký thật của hồ
// sơ L3 trong kit (đúng tên thư mục để bộ phân ô đọc được), hồ sơ đang làm ở trạng thái duyệt phạm vi.
function khoThu() {
  const r = path.join(TMP, 'kho-thu'); const L3 = 'cua-tin-hieu-gom-nhom';
  const viet = (f, t) => { mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); writeFileSync(path.join(r, f), t); };
  const hd = (slug, st, feature) => `---\nschema_version: 1\nfeature: ${feature}\nslug: ${slug}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${st}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`;
  viet('_acceptance/config.yaml', 'schema_version: 1\nlo_trinh:\n  tep: docs/lo-trinh.json\ntin_hieu:\n  nguon: tin-hieu\n  gom: docs/gom\n');
  viet(`_acceptance/${L3}/contract.md`, hd(L3, DA_KY, '«Nhân viên gửi góp ý ngay trong CRM»'));
  viet(`_acceptance/${L3}/evidence-report.md`, readFileSync(path.join(KIT, '_acceptance', L3, 'evidence-report.md'), 'utf8'));
  viet('_acceptance/viec-hai/contract.md', hd('viec-hai', 'approved', '«Trưởng phòng xem số tuần trước khi cập nhật KR»'));
  viet('docs/lo-trinh.json', JSON.stringify({ schema: 1, ten: 'Lộ trình thử', hang: [
    { ma: 'H1', cau_giao: '«Nhân viên tìm được quy trình trong một phút»', dot: 'gom-1', phu: ['G1'] },
    { ma: 'H2', cau_giao: '«Trưởng phòng xem số tuần trước khi cập nhật KR»', dot: 'gom-1', phu: ['G2'], slug: 'viec-hai' },
    { ma: 'H3', cau_giao: '«Nhân viên gửi góp ý ngay trong CRM»', dot: 'gom-1', phu: ['G3'], slug: L3 }],
    chan_troi: [{ ma: 'CT1', dot: 'gom-1', phu: ['G5'], ly_do: 'chờ đợt góp ý sau 14/10' }] }, null, 2));
  const LUC = '2026-10-20T00:00:00Z'; const t = i => tin('kho-thu', i, LUC); const s = [1, 2, 3, 4, 5, 6, 7, 8].map(t);
  for (const x of s) viet(`tin-hieu/${x.id}.json`, JSON.stringify(x.o));
  viet('docs/gom/gom-1.md', vietGom({ dot: 'gom-1', den: '2026-12-31T00:00:00Z', nhom: [
    ['G1', 'Nhân viên tìm quy trình nhanh hơn', [s[0].id]], ['G2', 'Trưởng phòng thấy số của phòng mình', [s[1].id]],
    ['G3', 'Nhân viên góp ý không phải nhắn riêng', [s[2].id]], ['G4', 'Người dùng xem lại tín hiệu đã gửi', [s[3].id]],
    ['G5', 'Nhân viên căn chỉnh OKR với phòng khác', [s[4].id]]],
    le: [[s[5].id, 'lời cảm ơn, không đòi thay đổi gì']], phu: [[s[6].id, L3]] }));
  return r;
}

try {
  const rThu = khoThu();
  const kThu = cam(rThu, '--duong'); const yThu = cam(rThu, '--cau');
  const dsThu = kThu.status === 0 ? JSON.parse(kThu.stdout) : [];
  const choThu = new Set(dsThu.map(b => b.cho));
  console.log(`    KHO-THU-xanh: ${dsThu.length} tín hiệu, ${choThu.size} chỗ ${JSON.stringify([...choThu].sort())}`);
  if (kThu.status === 0 && yThu.status === 0 && choThu.size === 7) ok('KHO-THU-xanh', `kho thử bảy chỗ: --cau thoát 0 — ${yThu.stdout.trim().split('\n').pop()}`);
  else bad('KHO-THU-xanh', `--duong ${kThu.status} --cau ${yThu.status}, ${choThu.size} chỗ: ${(yThu.stdout + kThu.stderr).slice(0, 300)}`);
  const rCrm = banSao(crm, sha, 'crm');
  const kCrm = kiem('CRM-xanh', rCrm, 'crm-mau');
  const rKit = banSao(KIT, BASE_KIT, 'kit', '\ntin_hieu:\n  nguon: tin-hieu/mau\n  gom: tin-hieu/gom\n');
  const kKit = kiem('KIT-xanh', rKit, 'kit-mau');
  // Tệp mẫu câu — đầu vào của giám khảo E10. Không mang sha kit đang chạy (để không trôi theo commit).
  const mot = ds => ds.map(b => ({ cho: b.cho, cau_nguoi_gui: b.cau_nguoi_gui, cau: b.cau }));
  const mau = { giai_thich: 'Câu kit viết cho người gửi tín hiệu (cau_nguoi_gui) ở mọi chỗ một tín hiệu có thể đứng: trên bản sao dữ liệu thật của CRM (câu giao do chủ kho CRM viết, hiện nguyên văn) và trên kho thử do máy dựng. Trường cau là câu cũ cho chủ kho — để đối chiếu, KHÔNG chấm. Trường cho là nhãn máy của chỗ.', nguon: { crm: sha }, crm: mot(kCrm.ds), kho_thu: mot(dsThu) };
  const moi = JSON.stringify(mau, null, 2) + '\n';
  if (ghi) { mkdirSync(path.dirname(TEP_MAU), { recursive: true }); writeFileSync(TEP_MAU, moi); console.log(`    đã ghi ${path.relative(KIT, TEP_MAU)}`); }
  const cu = existsSync(TEP_MAU) ? readFileSync(TEP_MAU, 'utf8') : null;
  const lech = moi.replace('đã vào nhóm', 'đã vào nhóm X'); if (lech === moi || lech === cu) bad('CRM-mau', 'đối chứng: bản lệch một chữ vẫn bằng tệp — phép so không thấy khác biệt');
  else if (cu === moi) ok('CRM-mau', `mau/cau-mau.json đã commit == bản sinh lại (${kCrm.ds.length} câu crm + ${dsThu.length} câu kho thử)`);
  else bad('CRM-mau', cu == null ? 'chưa có mau/cau-mau.json — chạy --ghi' : 'mau/cau-mau.json lệch bản sinh lại — chạy --ghi rồi commit');
  // Chiều đỏ trên CÙNG bản sao crm: một tên nhóm mang tên một thư mục hồ sơ crm thật.
  const ten = readdirSync(path.join(rCrm, '_acceptance'), { withFileTypes: true }).filter(e => e.isDirectory() && e.name.includes('-')).map(e => e.name).sort()[0];
  const txt = readFileSync(kCrm.gomTep, 'utf8'); const mo = 'Nhân viên xem lại tín hiệu đã gửi';
  if (!txt.includes(mo)) bad('CRM-do', 'không tìm thấy tên nhóm để tiêm'); else {
    writeFileSync(kCrm.gomTep, txt.replace(mo, `Nhân viên xem lại ${ten}`));
    const z = cam(rCrm, '--cau'); const L = z.stdout.split('\n').filter(l => l.startsWith('tín hiệu ') && l.includes(`«${ten}»`));
    if (z.status === 1 && L.length === 1) ok('CRM-do', `tên nhóm mang tên hồ sơ crm thật «${ten}»: --cau thoát 1, «${L[0].slice(0, 120)}»`);
    else bad('CRM-do', `thoát ${z.status}, ${L.length} dòng nêu «${ten}»: ${z.stdout.slice(0, 300)}`);
  }
} catch (e) { bad('do-crm', String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); }
rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${sai.length ? `${sai.length} failed` : 'all passed'} (do-crm)`);
process.exit(sai.length ? 1 : 0);
