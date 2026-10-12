// dai-tom-tat.test.mjs — hồ sơ dai-tom-tat-doc-dung (gốc: crm/_acceptance/ngan-ho-so-trong-lo-trinh, LT1b).
// Ba ô của dải tóm tắt hồ sơ (scripts/ho-so-tom-tat.cjs) nói đúng trên dữ liệu thật: production không đọc
// thành «chưa lên», chưa làm đếm giới hạn ở `## Notes` của hợp đồng và gọi Out of scope là «để ngoài phạm
// vi», vì sao không cụt ở câu dẫn và có trần 400 ký tự. Ca DT-1..DT-8; DT-9 (bản sao crm) ở
// dai-tom-tat-crm.mjs, ngoài suite.
//
// DT-11 (kho khai nhánh production) đọc git của kho thử: commit có ngày ghim qua GIT_*_DATE.
// Hồ sơ thử mang `status: implemented`: tệp ca không phải bộ đọc trạng thái ký, chuỗi trạng thái ký
// trong tệp chỉ làm lưới RT13 kêu (cùng lối repin-lane-noi-ra.test.mjs).
// Kho thử do mã sinh trong lượt (git init thư mục tạm, đường dẫn suy từ vị trí tệp này); ô cơ hội do CHÍNH
// `lo-trinh.mjs --mo-o` ghi; gạch giới hạn của DT-8 rút từ khối KNOWN-LIMITS-NOTE của commands/signoff.md.
// Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra. Chiều đỏ: bản lành xanh trước, rồi CHÍNH hàm đo
// chạy trên bản sao cây (scripts lib skills commands) bị tiêm, ghim thông điệp hàm đo trả.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'dai-tom-tat-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.DT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-') || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SL = 'hs';

const HS = kit => createRequire(import.meta.url)(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);

// ── kho thử ───────────────────────────────────────────────────────────────
let khoN = 0;
// Một kho git có lộ trình một hàng mang slug `hs`; ô cơ hội do `--mo-o` của cây đang kiểm ghi. Trả gốc kho.
// nhanh: kho khai `production: nhanh: <tên>`; gop: 'merge' (mã đã chấm ở nhánh vong, gộp --no-ff vào main
// ngày 2026-10-10) · 'chua' (mã ở vong, chưa gộp; HEAD ở vong) · 'thang' (mã commit thẳng trên main ngày
// 2026-10-09) · null (mã đã chấm là một sha giả không có trong kho).
function khoThu({ notes = '', oos = ['Không làm a.', 'Không làm b.'], known = [], so = 'khong-thuc-te', vanDe = null, nhanh = null, gop = null } = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(path.join(r, 'docs'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\n${nhanh ? `production:\n  nhanh: ${nhanh}   # nhánh production của kho\n` : ''}`);
  writeFileSync(path.join(r, 'docs', 'lo-trinh.json'), JSON.stringify({ schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'X', slug: SL, cau_giao: 'Việc X có dải tóm tắt', vi_sao: 'Gốc: crm/_acceptance/a — lý do một câu đủ.' }] }, null, 2) + '\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho');
  const mo = node([path.join(KIT, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', 'X', '--mo-o', '--slug', SL, '--owner', 'x@y.z']);
  if (mo.status !== 0) throw new Error(`--mo-o exit ${mo.status}: ${mo.stderr}`);
  const d = path.join(r, '_acceptance', SL);
  let ma = 'a'.repeat(40);
  const ngayGit = (ngay, f) => { const env = { ...process.env, GIT_AUTHOR_DATE: ngay, GIT_COMMITTER_DATE: ngay }; return f(env); };
  if (gop === 'thang') { writeFileSync(path.join(r, 'vat.txt'), 'vat\n'); git(r, 'add', '-A'); ngayGit('2026-10-09T10:00:00+07:00', env => execFileSync('git', ['-C', r, 'commit', '-qm', 'vat'], { env })); ma = git(r, 'rev-parse', 'HEAD'); }
  if (gop === 'merge' || gop === 'chua') {
    git(r, 'checkout', '-qb', 'vong'); writeFileSync(path.join(r, 'vat.txt'), 'vat\n'); git(r, 'add', '-A');
    ngayGit('2026-10-08T10:00:00+07:00', env => execFileSync('git', ['-C', r, 'commit', '-qm', 'vat'], { env })); ma = git(r, 'rev-parse', 'HEAD');
  }
  if (vanDe != null) {
    const p = path.join(d, 'opportunity.md'); const t = readFileSync(p, 'utf8');
    if (!/## Vấn đề & ai gặp\n/.test(t)) throw new Error('ô cơ hội của --mo-o không có mục «Vấn đề & ai gặp»');
    writeFileSync(p, t.replace(/(## Vấn đề & ai gặp\n)[\s\S]*?(?=\n## )/, `$1\n${vanDe}\n`));
  }
  writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nfeature: Việc X có dải tóm tắt\nslug: ${SL}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\napproved_by: M\napproved_at: 2026-10-02T00:00:00Z\n---\n\n## Context\n\nBối cảnh.\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n${oos.map(x => `- ${x}`).join('\n')}\n\n## Notes\n\n${notes}\n`);
  writeFileSync(path.join(d, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: ${SL}\nverdict: PASS\nverified_commit: ${ma}\nhuman_signoff: M 2026-10-06\n---\n\n# Evidence Report: ${SL}\n\n## Known limits\n\n${known.map(x => `- ${x}`).join('\n')}\n\n## Ngoài hợp đồng\n`);
  const dong = [{ id: 'd-1', type: 'approach', stage: 'S1', at: '2026-10-01T00:00:00Z', decision: 'Chọn.', why: 'Vì.', cost_if_wrong: 'Ít.' }];
  if (so === 'thuc-te') dong.push({ id: 'd-2', type: 'thuc-te', stage: 'thuc-te', at: '2026-10-08T00:00:00Z', by: 'M', build_sha: 'b'.repeat(40), decision: 'Đang chạy.' });
  if (so !== 'vang') writeFileSync(path.join(d, 'decisions.jsonl'), dong.map(x => JSON.stringify(x)).join('\n') + '\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'vong X');
  if (gop === 'merge') { git(r, 'checkout', '-q', 'main'); ngayGit('2026-10-10T09:00:00+07:00', env => execFileSync('git', ['-C', r, 'merge', '--no-ff', '-q', '-m', 'Merge pull request #9 from x/vong', 'vong'], { env })); }
  return r;
}
const boEsc = s => String(s).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
// Bộ đọc HTML ĐỘC LẬP của ca (không gọi mô-đun): dải chín ô và danh sách giới hạn của trang hồ sơ.
const daiCua = h => Object.fromEntries([...h.matchAll(/<div class="o" data-o="(\w+)" data-nguon="[^"]*"><div class="hoi">[^<]*<\/div><div class="tra">([\s\S]*?)<\/div><\/div>/g)].map(m => [m[1], boEsc(m[2])]));
const gioiHanTrang = h => [...h.matchAll(/<li data-loai="gioi-han">([\s\S]*?)<\/li>/g)].map(m => boEsc(m[1]));
function trang(kit, r) {
  const x = node([path.join(kit, 'scripts', 'evidence-page.js'), '--root', r, '--slug', SL]);
  const p = path.join(r, '_acceptance', SL, 'evidence-page.html');
  if (x.status !== 0 || !existsSync(p)) throw new Error(`evidence-page exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  return readFileSync(p, 'utf8');
}
function khoi(kit, r) {
  const x = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', r]);
  if (x.status !== 0) throw new Error(`product-map exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  const d = LT.docDuLieu(readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8')).duLieu;
  const h = d && d.lo_trinh[0].hang.find(y => y.ma === 'X');
  if (!h || !h.tom_tat) throw new Error('khối không có hàng X mang tom_tat');
  return h.tom_tat.moi_nguoi;
}
const tomTat = (kit, r) => HS(kit).tomTatHoSo(path.join(r, '_acceptance', SL));

let bsN = 0;
function banSao(tiem) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands']) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const chayCa = async (id, f, moTa) => { try { const s = await f(KIT); if (s.length) bad(id, s.join(' ; ')); else ok(id, moTa); } catch (e) { bad(id, loi(e)); } };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};
const HS_FILE = 'scripts/ho-so-tom-tat.cjs';

// ── DT-1: ô production — kho KHÔNG khai nhánh production: hành vi cũ giữ nguyên ──────────────────
const CHUA_GHI = 'chưa ghi quan sát production';
const THUC_TE = `đã chạy ở production — bản dựng ${'b'.repeat(7)}, quan sát 2026-10-08, M`;
function dt1(kit) {
  const sai = [];
  const r = khoThu();
  for (const [n, v] of [['trang', daiCua(trang(kit, r)).production], ['khối', khoi(kit, r).production]]) if (v !== CHUA_GHI) sai.push(`kho không khai, production (${n}) «${v}» ≠ «${CHUA_GHI}»`);
  const r2 = khoThu({ so: 'thuc-te' });
  for (const [n, v] of [['trang', daiCua(trang(kit, r2)).production], ['khối', khoi(kit, r2).production]]) if (v !== THUC_TE) sai.push(`có quan sát, production (${n}) «${v}»`);
  const t3 = tomTat(kit, khoThu({ so: 'vang' }));
  if (t3.dai.moi_nguoi.production !== null || !t3.thieu.includes('decisions.jsonl')) sai.push(`không sổ: production «${t3.dai.moi_nguoi.production}», thieu ${JSON.stringify(t3.thieu)}`);
  return sai;
}

// ── DT-11: ô production — kho KHAI nhánh production: «đã triển khai» máy suy, tách khỏi reality ─────
const CA_11 = [
  ['gộp merge', { nhanh: 'main', gop: 'merge' }, 'đã triển khai — gộp vào main 2026-10-10; chưa ai ghi đã thấy chạy ở production'],
  ['commit thẳng', { nhanh: 'main', gop: 'thang' }, 'đã triển khai — gộp vào main 2026-10-09; chưa ai ghi đã thấy chạy ở production'],
  ['chưa gộp', { nhanh: 'main', gop: 'chua' }, 'chưa gộp vào main (nhánh production kho khai)'],
  ['reality thắng', { nhanh: 'main', gop: 'merge', so: 'thuc-te' }, THUC_TE],
  ['không có nhánh', { nhanh: 'khong-co', gop: 'merge' }, 'chưa đọc được triển khai ở đây — không thấy nhánh khong-co'],
  ['mã lạ', { nhanh: 'main' }, 'chưa đọc được triển khai ở đây — mã đã chấm không có trong kho'],
];
function dt11(kit) {
  const sai = [];
  for (const [ten, o, mong] of CA_11) {
    const r = khoThu(o);
    for (const [n, v] of [['trang', daiCua(trang(kit, r)).production], ['khối', khoi(kit, r).production]]) if (v !== mong) sai.push(`ca «${ten}» (${n}): «${v}» ≠ «${mong}»`);
  }
  // Gốc không phải kho git: chép hồ sơ ra thư mục không .git.
  const r = khoThu({ nhanh: 'main', gop: 'merge' }); const t = path.join(TMP, `khong-git-${++khoN}`);
  cpSync(path.join(r, '_acceptance'), path.join(t, '_acceptance'), { recursive: true });
  const v = tomTat(kit, t).dai.moi_nguoi.production;
  if (v !== 'chưa đọc được triển khai ở đây — gốc không phải kho git') sai.push(`ca «không git»: «${v}»`);
  if (!sai.length) console.log(`    · DT-11 ma trận ${CA_11.length + 1} ca`);
  return sai;
}

// ── DT-2: gạch giới hạn có 13 gạch con ở Notes, báo cáo rỗng ──────────────
const CAU_13 = Array.from({ length: 13 }, (_, i) => `Ngoài-${i + 1}: giới hạn thứ ${i + 1} của trang, một câu.`);
function dt2(kit) {
  const sai = [];
  const notes = `- Phụ thuộc: kho nhận bản kit mới.\n- Known limits — anh chọn ở Cổng Bằng chứng 2026-10-10, từ S4 vòng 3:\n${CAU_13.map(c => `  - ${c}`).join('\n')}\n- Ghi chú khác sau cùng.`;
  const r = khoThu({ notes });
  const h = trang(kit, r); const cl = daiCua(h).chua_lam;
  if (!/ · 13 giới hạn đã biết$/.test(cl)) sai.push(`chua_lam «${cl}» — cần kết «13 giới hạn đã biết»`);
  const ds = gioiHanTrang(h); if (!deq(ds, CAU_13)) sai.push(`trang liệt ${ds.length} giới hạn, cần 13 câu theo thứ tự: ${JSON.stringify(ds.slice(0, 2))}`);
  // Cờ vàng: Notes NHẮC giới hạn mà bộ đọc không nhận được gạch nào → không in «0 giới hạn».
  const v1 = daiCua(trang(kit, khoThu({ notes: '- Phụ thuộc: kho nhận kit; known limits của vòng ghi ở hồ sơ kia.' }))).chua_lam;
  if (v1 !== '2 mục để ngoài phạm vi · giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn') sai.push(`nhắc sai khuôn, không gạch: «${v1}» (không được in 0)`);
  const v2 = daiCua(trang(kit, khoThu({ notes: '- Known limits: một.\n- Ghi chú: còn known limits ở chỗ khác.' }))).chua_lam;
  if (v2 !== '2 mục để ngoài phạm vi · 1 giới hạn đã biết (Notes còn chỗ nhắc giới hạn sai khuôn)') sai.push(`nhắc sai khuôn + một gạch: «${v2}»`);
  return sai;
}

// ── DT-3: ma trận dạng gạch ở Notes ───────────────────────────────────────
const MA_TRAN_3 = [
  ['Known limits trơn', '- Known limits: một câu giới hạn.', 1],
  ['in đậm có ngoặc', '- **Known limits (Cổng 2, 05/10):** một câu.', 1],
  ['đầu gạch + gạch con', '- Known limits — chọn ở Cổng Bằng chứng 2026-10-10:\n  - Ngoài-1: một.\n  - Ngoài-2: hai.', 2],
  ['known-limits gạch nối', '- known-limits (Ngoài-4): lưới tuyên một lớp.', 1],
  ['known-limit số ít in đậm', '- **known-limit (người chốt ở Cổng 2, 06/09):** Ngoài-3 — chiều đỏ.', 1],
  ['Known limit nhỏ', '- Known limit nhỏ, khai trước: mock viết tay.', 1],
  ['Giới hạn đã biết', '- Giới hạn đã biết (đo 05/09): bộ sinh bản đồ lệch.', 1],
  ['hoa toàn bộ', '- KNOWN LIMITS: một câu.', 1],
  ['Hạn chế đã biết', '- Hạn chế đã biết, chủ kho chọn ở Cổng 2 (08/10): một câu.', 1],
  ['đầu đoạn + gạch', 'Known limits — chấp nhận tại Cổng Bằng chứng 2026-09-21, từ mục ngoài hợp đồng của S4:\n\n- Ngoài-1: một.\n- Ngoài-2: hai,\n  bọc dòng.\n\nĐoạn khác sau cùng.\n\n- Gạch thường không thuộc khối.', 2],
  ['tiêu đề phụ + gạch', '### Known limits — Cổng Bằng chứng 2026-09-18\n\n- Một.\n- Hai.\n- Ba.', 3],
  ['đầu đoạn in đậm trơn', '**Known limits (không mở việc):** một câu giới hạn.', 1],
  ['ba gạch trơn liền nhau', '- Known limits (Ngoài-2, Cổng 2): một.\n- Known limits (Ngoài-3, Cổng 2): hai.\n- Known limits (Ngoài-5, Cổng 2): ba.', 3],
  ['giữa câu', '- Phụ thuộc: kho nhận kit; known limits của vòng trước ghi ở hồ sơ kia.', 0],
  ['gạch thường', '- Phụ thuộc: crm nhận bộ kit 2.26.', 0],
  ['gạch con của gạch thường', '- Ghi chú vận hành:\n  - Known limits: không phải gạch cấp ngoài.', 0],
  ['gạch con none và không có', '- Known limits — chọn ở Cổng Bằng chứng 2026-10-10:\n  - none\n  - không có', 0],
  ['trơn none', '- **Known limits:** none', 0],
  ['trơn không có', '- Giới hạn đã biết: không có', 0],
];
function dt3(kit) {
  const sai = [];
  for (const [ten, notes, mong] of MA_TRAN_3) {
    const n = HS(kit).gioiHanTuNotes(`## Notes\n\n${notes}\n`).length;
    if (n !== mong) sai.push(`ca «${ten}»: đếm ${n}, cần ${mong}`);
  }
  if (!sai.length) console.log(`    · DT-3 ma trận ${MA_TRAN_3.length} ca`);
  return sai;
}

// ── DT-4: hai nguồn ───────────────────────────────────────────────────────
const cauBC = n => Array.from({ length: n }, (_, i) => `Báo cáo ${i + 1}.`);
const cauHD = n => Array.from({ length: n }, (_, i) => `Hợp đồng ${i + 1}.`);
const notesHD = n => (n ? `- Known limits — chọn ở Cổng Bằng chứng 2026-10-10:\n${cauHD(n).map(c => `  - ${c}`).join('\n')}` : '- Phụ thuộc: không.');
function dt4(kit) {
  const sai = [];
  for (const [bc, hd, so, ds] of [[3, 2, 3, cauBC(3)], [1, 4, 4, cauHD(4)], [2, 2, 2, cauHD(2)], [2, 0, 2, cauBC(2)]]) {
    const r = khoThu({ known: cauBC(bc), notes: notesHD(hd) }); const h = trang(kit, r);
    const cl = daiCua(h).chua_lam; const m = cl.match(/ · (\d+) giới hạn đã biết$/);
    if (!m || Number(m[1]) !== so) sai.push(`{báo cáo ${bc} · hợp đồng ${hd}}: chua_lam «${cl}», cần ${so}`);
    if (!deq(gioiHanTrang(h), ds)) sai.push(`{báo cáo ${bc} · hợp đồng ${hd}}: trang liệt ${JSON.stringify(gioiHanTrang(h))}`);
  }
  return sai;
}

// ── DT-5: vế để ngoài phạm vi ─────────────────────────────────────────────
function dt5(kit) {
  const sai = [];
  const r = khoThu({ oos: ['A.', 'B.', 'C.', 'D.'], known: ['Một giới hạn.'] });
  const mong = '4 mục để ngoài phạm vi · 1 giới hạn đã biết';
  for (const [n, v] of [['trang', daiCua(trang(kit, r)).chua_lam], ['khối', khoi(kit, r).chua_lam]]) {
    if (v !== mong) sai.push(`chua_lam (${n}) «${v}», cần «${mong}» (để ngoài phạm vi)`);
    if (/ngoài hợp đồng/.test(String(v))) sai.push(`chua_lam (${n}) còn «ngoài hợp đồng»`);
  }
  return sai;
}

// ── DT-6: câu dẫn + danh sách ─────────────────────────────────────────────
const MO = 'Mở từ hàng X của «Lộ trình thử».';
const CA_6 = [
  ['(a)', `${MO}\n\nSoi mã ở nhánh chính, ba chỗ hở:\n\n- **Bảng rỗng không nói vì sao.** Màn hiện một câu cố định do màn truyền vào,\n  kể cả khi không có bộ lọc nào.\n- **Nút bỏ lọc sai tên.** Nút ghi «Bỏ hết» nhưng chỉ bỏ một tiêu chí.\n- **Lựa chọn có số 0 biến mất.** Menu lọc bỏ lựa chọn đếm 0.\n\n**Người gặp:** mọi người.`,
    'Soi mã ở nhánh chính, ba chỗ hở: Bảng rỗng không nói vì sao · Nút bỏ lọc sai tên · Lựa chọn có số 0 biến mất'],
  ['(b)', `${MO}\n\nHai chỗ đau:\n\n- Người phải mở từng mục. Mất mười phút mỗi tuần.\n- Ban lãnh đạo không thấy toàn cảnh. Phải hỏi từng đơn vị.`,
    'Hai chỗ đau: Người phải mở từng mục · Ban lãnh đạo không thấy toàn cảnh'],
  ['(c)', `${MO}\n\nBối cảnh như sau:\n\nĐoạn văn tiếp theo không phải danh sách.`, 'Bối cảnh như sau:'],
  ['(d)', `${MO}\n\nSau khi số đã vào, **chưa ai nhìn được chúng cùng lúc:**\n\n- **Họp tuần mở từng mục.** Chi tiết.\n- **Không có toàn cảnh.** Chi tiết.`,
    'Sau khi số đã vào, chưa ai nhìn được chúng cùng lúc: Họp tuần mở từng mục · Không có toàn cảnh'],
  ['(e)', `${MO}\n\nCác ca đã gặp:\n\n| Ca | Biểu hiện |\n| --- | --- |\n| \`ca-mot\` | đỏ một lượt |\n| ca-hai | đỏ hai lượt |`, 'Các ca đã gặp: ca-mot · ca-hai'],
];
function dt6(kit) {
  const sai = [];
  for (const [ten, vanDe, mong] of CA_6) {
    const v = tomTat(kit, khoThu({ vanDe })).dai.moi_nguoi.vi_sao;
    if (v !== mong) sai.push(`ca ${ten}: vi_sao «${v}» ≠ «${mong}»`);
    if (ten !== '(c)' && /:$/.test(String(v))) sai.push(`ca ${ten}: vi_sao còn kết «:»`);
  }
  return sai;
}

// ── DT-7: trần 400 ký tự ──────────────────────────────────────────────────
const cau150 = i => { const dau = `Câu thứ ${i} nói một ý về vì sao làm việc này`; return `${dau}${' và thêm chữ'.repeat(30)}`.slice(0, 149) + '.'; };
const CAU_7A = [1, 2, 3, 4, 5].map(cau150);
const TU = Array.from({ length: 100 }, (_, i) => `chu${String(i).padStart(2, '0')}`).join(' ');
const DOAN_399 = (`Một đoạn vừa đủ dài${' để thử trần'.repeat(40)}`).slice(0, 398) + '.';
const MUC_90 = i => `Chỗ hở thứ ${i}${' kéo dài cho đủ chữ'.repeat(6)}`.slice(0, 90);
const CA_7 = [
  ['(a)', `${MO}\n\n${CAU_7A.join(' ')}`, v => v === `${CAU_7A[0]} ${CAU_7A[1].slice(0, -1)}…`],
  ['(b)', `${MO}\n\n${TU}`, v => v.endsWith('…') && TU.startsWith(v.slice(0, -1)) && TU[v.length - 1] === ' '],
  ['(c)', `${MO}\n\n${DOAN_399}`, v => v === DOAN_399],
  ['(d)', `${MO}\n\nSáu chỗ hở:\n\n${[1, 2, 3, 4, 5, 6].map(i => `- **${MUC_90(i)}.** Chi tiết của mục ${i}.`).join('\n')}`,
    v => v === `Sáu chỗ hở: ${[1, 2, 3, 4].map(MUC_90).join(' · ')}…`],
];
function dt7(kit) {
  const sai = [];
  if (DOAN_399.length !== 399 || CAU_7A.some(c => c.length !== 150) || TU.length < 500) return [`ca dựng sai độ dài (${DOAN_399.length}, ${CAU_7A.map(c => c.length)}, ${TU.length})`];
  for (const [ten, vanDe, dung] of CA_7) {
    const v = String(tomTat(kit, khoThu({ vanDe })).dai.moi_nguoi.vi_sao);
    if (v.length > 400) sai.push(`ca ${ten}: vi_sao dài ${v.length} > 400`);
    if (!dung(v)) sai.push(`ca ${ten}: vi_sao «${v.slice(0, 60)}…${v.slice(-40)}» (dài ${v.length}) sai hình dạng`);
  }
  return sai;
}

// ── DT-8: khối KNOWN-LIMITS-NOTE (bên viết) → bộ đọc ───────────────────────
function dt8(kit) {
  const t = readFileSync(path.join(kit, 'commands', 'signoff.md'), 'utf8');
  const m = t.match(/<!-- <<<KNOWN-LIMITS-NOTE -->\n```\n([\s\S]*?)```\n<!-- KNOWN-LIMITS-NOTE>>> -->/);
  if (!m) return ['commands/signoff.md không có khối KNOWN-LIMITS-NOTE'];
  const dong = m[1].replace(/\n$/, '').split('\n'); const dau = dong[0]; const con = dong.slice(1);
  if (con.length !== 1) return [`khối KNOWN-LIMITS-NOTE có ${con.length} dòng gạch con mẫu, cần 1`];
  const notes = [dau.replace('<YYYY-MM-DD>', '2026-10-12'), con[0].replace('<Ngoài-n>', 'Ngoài-1').replace(/<giới hạn[^>]*>/, 'trang đếm lệch khi lọc.'), con[0].replace('<Ngoài-n>', 'Ngoài-2').replace(/<giới hạn[^>]*>/, 'bàn phím mất chỗ đứng.')].join('\n');
  const cl = daiCua(trang(kit, khoThu({ notes }))).chua_lam;
  return / · 2 giới hạn đã biết$/.test(cl) ? [] : [`chua_lam «${cl}» — khối mẫu điền hai giới hạn phải ra «2 giới hạn đã biết»`];
}

if (want('DT-1')) await chayCa('DT-1', dt1, 'kho không khai: «chưa ghi quan sát production» ở trang và khối như cũ; có quan sát → câu reality; không sổ → null + thiếu');
if (want('DT-1-do')) await chayDo('DT-1-do', dt1, [[HS_FILE, "else if (!nhanh) { nguon.production = 'decisions.jsonl'; moi.production = 'chưa ghi quan sát production'; }", 'else if (false) { /* tiêm */ }']], 'kho không khai', 'bản sao bật suy triển khai cho kho không khai');
if (want('DT-11')) await chayCa('DT-11', dt11, 'kho khai main: gộp merge → ngày commit gộp · commit thẳng → ngày của nó · chưa gộp · reality thắng · không nhánh / mã lạ / không git → «chưa đọc được» có tên');
if (want('DT-11-do')) await chayDo('DT-11-do', dt11, [[HS_FILE, ': tk.gop ? `đã triển khai', ': false ? `đã triển khai']], 'gộp merge', 'bản sao không bao giờ nói «đã triển khai»');
if (want('DT-11-do-ngay')) await chayDo('DT-11-do-ngay', dt11, [[HS_FILE, 'if (!chau.has(x)) break; c = x; }', 'if (!chau.has(x)) break; c = maDu; }']], '2026-10-10', 'bản sao lấy ngày của mã đã chấm thay vì ngày tới nhánh');
if (want('DT-2')) await chayCa('DT-2', dt2, 'gạch đầu + 13 gạch con ở Notes, báo cáo rỗng → 13 trên dải, 13 câu trên trang; Notes nhắc sai khuôn → «chưa đọc được», không in 0');
if (want('DT-2-do-co')) await chayDo('DT-2-do-co', dt2, [[HS_FILE, 'moi.chua_lam = T.contract == null ? null : `${oos.length} mục để ngoài phạm vi · ${!ghHD.lech ?', 'moi.chua_lam = T.contract == null ? null : `${oos.length} mục để ngoài phạm vi · ${true ?']], 'không được in 0', 'bản sao bỏ cờ nhắc sai khuôn');
if (want('DT-2-do')) await chayDo('DT-2-do', dt2, [[HS_FILE, 'const knownHopDong = ghHD.ds;', 'const knownHopDong = [];']], '13', 'bản sao chỉ đọc Known limits của báo cáo');
if (want('DT-3')) await chayCa('DT-3', dt3, `ma trận ${MA_TRAN_3.length} dạng gạch, mỗi ca đếm đúng số viết sẵn`);
if (want('DT-3-do')) await chayDo('DT-3-do', dt3, [[HS_FILE, '(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)(?![\\w-])/i;', '(?:known[ -]limits|giới hạn đã biết|hạn chế đã biết)(?![\\w-])/i;']], 'số ít', 'bản sao bỏ dạng known-limit số ít');
if (want('DT-3-do-giua-cau')) await chayDo('DT-3-do-giua-cau', dt3, [[HS_FILE, 'if (!m || !DAU_GIOI_HAN.test(m[1])) continue;', 'if (!m || !/known[ -]limits?|giới hạn đã biết/i.test(m[1])) continue;']], 'giữa câu', 'bản sao khớp chữ ở bất kỳ đâu trong gạch');
if (want('DT-3-do-tron-none')) await chayDo('DT-3-do-tron-none', dt3, [[HS_FILE, 'else if (!RONG_GIOI_HAN.test(sauDau(dau))) ra.push(dau);', 'else ra.push(dau);']], 'trơn none', 'bản sao bỏ lọc none ở gạch trơn');
if (want('DT-4')) await chayCa('DT-4', dt4, 'bốn ca hai nguồn: nguồn nhiều hơn thắng, hoà → hợp đồng, chỉ báo cáo như trước');
if (want('DT-4-do')) await chayDo('DT-4-do', dt4, [[HS_FILE, 'const known = knownBaoCao.length > knownHopDong.length ? knownBaoCao : knownHopDong;', 'const known = [...knownBaoCao, ...knownHopDong];']], 'cần 3', 'bản sao cộng hai nguồn (3 + 2 = 5)');
if (want('DT-5')) await chayCa('DT-5', dt5, '«4 mục để ngoài phạm vi · 1 giới hạn đã biết» ở trang và khối');
if (want('DT-5-do')) await chayDo('DT-5-do', dt5, [[HS_FILE, 'mục để ngoài phạm vi', 'mục ngoài hợp đồng']], 'để ngoài phạm vi', 'bản sao trả lại «mục ngoài hợp đồng»');
if (want('DT-6')) await chayCa('DT-6', dt6, 'câu dẫn + danh sách in đậm / thường / dấu nhấn / bảng → câu dẫn + mục nối « · »; câu dẫn không danh sách giữ nguyên');
if (want('DT-6-do')) await chayDo('DT-6-do', dt6, [[HS_FILE, 'if (/:$/.test(d)) {', 'if (false) {']], 'ca (a)', 'bản sao trả lại đoạn đầu trơn');
if (want('DT-6-do-nhan')) await chayDo('DT-6-do-nhan', dt6, [[HS_FILE, 'const d = boNhanCuoi(k[i].chu);', 'const d = k[i].chu;']], 'ca (d)', 'bản sao dò «:» trước khi bỏ dấu nhấn');
if (want('DT-7')) await chayCa('DT-7', dt7, 'năm câu → hai câu trọn + «…»; một câu dài → cắt ở khoảng trắng; 399 ký tự nguyên văn; sáu mục → bốn mục trọn + «…»');
if (want('DT-7-do')) await chayDo('DT-7-do', dt7, [[HS_FILE, 'if (du.length <= TRAN_VI_SAO) return du;', 'return du;']], '400', 'bản sao bỏ trần');
if (want('DT-7-do-muc')) await chayDo('DT-7-do-muc', dt7, [[HS_FILE, "return catTran([`${d} ${muc[0]}`, ...muc.slice(1)], ' · ');", "return catTran([[`${d} ${muc[0]}`, ...muc.slice(1)].join(' · ')], ' · ');"]], 'ca (d)', 'bản sao cắt danh sách theo ký tự');
if (want('DT-8')) await chayCa('DT-8', dt8, 'khối KNOWN-LIMITS-NOTE điền hai giới hạn → «2 giới hạn đã biết»');
if (want('DT-8-do')) await chayDo('DT-8-do', dt8, [['commands/signoff.md', '- Known limits — chọn ở Cổng Bằng chứng <YYYY-MM-DD>:', '- Hạn chế — chọn ở Cổng Bằng chứng <YYYY-MM-DD>:']], '2 giới hạn', 'bản sao signoff.md đổi đầu khối sang «Hạn chế»');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (dai-tom-tat)`);
process.exit(fail ? 1 : 0);
