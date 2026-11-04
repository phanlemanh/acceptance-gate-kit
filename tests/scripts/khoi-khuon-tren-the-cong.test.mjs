// khoi-khuon-tren-the-cong.test.mjs — hồ sơ khoi-khuon-tren-the-cong (hàng KH2): bước nạp ghi nhóm đã chọn, khối
// «Khuôn» trên thẻ hai cổng, màn mới thành một câu hỏi, lỗi không im lặng, lệnh KHUON-S1 của SKILL.
//
// Luật đo (như khuon-loi.test.mjs):
//  - Kho mẫu do code sinh trong lượt (`khuon-loi-kho-mau.mjs`); gọi CHÍNH script của cây đang kiểm như tiến trình con.
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng); ca ma trận in «KK-4: k/N».
//  - Chiều đỏ: ca «-do» chạy CHÍNH hàm kiểm trên bản sao TRỌN `scripts/` + `lib/` (thêm `feature-loop/` + `skills/` cho
//    KK-2, KK-8) bị tiêm đúng một nhát, SAU khi bản lành xanh trên cùng fixture; ghim thông điệp lỗi.
//  - KK_CASES chọn ca; mã lạ → thoát 2.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { CONTRACT_G2, EVALS, REPORT_PASS, G1, PROBE } from './gate-fixture.mjs';
import { KIT, taoKhoMau, nhanh, banSaoTiem, ghi, git, chay, khoiMarker, thuMuc, BAN_DO } from './khuon-loi-kho-mau.mjs';

const LENH = 'scripts/design-floor-khuon.mjs';
const GC = 'scripts/gate-card.js';
const CC = 'scripts/can-cu-s1.cjs';
const SKILL = 'feature-loop/skills/feature-loop/SKILL.md';

const CA = ['KK-0-goc', 'KK-0-goc-do', 'KK-0-mot-moc', 'KK-0-mot-moc-do', 'KK-0-dot-bien', 'KK-1', 'KK-1-do', 'KK-2', 'KK-2-do', 'KK-2-do2', 'KK-3', 'KK-3-do', 'KK-4', 'KK-4-hong', 'KK-4-do', 'KK-4-do2', 'KK-5', 'KK-5-do', 'KK-6', 'KK-6-do', 'KK-7', 'KK-7-do', 'KK-8', 'KK-8-do', 'KK-8-do2', 'KK-8-tiem', 'KK-8-tiem-do'];
const chon = (process.env.KK_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`khoi-khuon-tren-the-cong.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : true);
const wantAny = p => CA.filter(c => c === p || c.startsWith(`${p}-`)).some(want);

const require = createRequire(import.meta.url);
let hong = 0;
const ket = (ma, loi) => {
  if (!loi.length) console.log(`PASS: [${ma}]`);
  else { hong++; console.log(`FAIL: [${ma}] ${loi.join(' | ')}`); }
};
let _khoSong = null;
const khoSong = () => (_khoSong ||= taoKhoMau());
// chiMot: MỌI lỗi của bản tiêm phải là đúng lỗi ghim — bản sao sập hay đỏ lan sang hàng khác không được tính là «bắt đúng».
const caDo = (ma, kiem, lanh, saoTiem, thongDiep, chiMot = false) => {
  if (lanh.length) return ket(ma, [`bản lành chưa xanh: ${lanh.join(' | ')}`]);
  let loi;
  try {
    const sao = saoTiem();
    const song = chay(sao, LENH, ['--root', khoSong(), '--dem']);
    if (song.out.trim() !== 'khuôn: 3 nhóm (2 màn · 1 phần tử)') return ket(ma, [`hạ tầng ca: bản sao không chạy (--dem in «${song.out.trim()}», thoát ${song.ma})`]);
    loi = kiem(sao);
  } catch (e) { return ket(ma, [`hạ tầng ca: ${e.message}`]); }
  if (chiMot && loi.some(x => !x.includes(thongDiep))) return ket(ma, [`bản tiêm đỏ ngoài hàng đích — không phân biệt «bắt đúng lỗi» với «bộ đọc sập» (lỗi: ${loi.join(' | ')})`]);
  ket(ma, loi.some(x => x.includes(thongDiep)) ? [] : [`bản tiêm không cho lỗi «${thongDiep}» (lỗi: ${loi.join(' | ') || 'không có'})`]);
};
// saoTu(goc, ds, tep, tim, thay) — như banSaoTiem nhưng chép từ một gốc bất kỳ (KK-7 tiêm chồng hai nhát).
const saoTu = (goc, ds, tep, tim, thay) => {
  const dich = thuMuc('sao-tu');
  for (const d of ds) fs.cpSync(path.join(goc, d), path.join(dich, d), { recursive: true });
  const f = path.join(dich, tep);
  const t = fs.readFileSync(f, 'utf8');
  const n = t.split(tim).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (cần 1): ${tim}`);
  fs.writeFileSync(f, t.replace(tim, thay));
  return dich;
};

// ── Hồ sơ mẫu ─────────────────────────────────────────────────────────────────────────────────────────────────
const THE_VIEC = {
  'Ai dùng': 'nhân viên kho', 'Việc chính': 'tra cứu phiếu nhập trong ngày', 'Tần suất': 'mỗi ngày nhiều lần',
  'Số bản ghi': 'hàng trăm trở lên', 'Thiết bị': 'máy tính',
};
// Thứ tự hàng đảo (Review Focus 2): bộ đọc phải theo tên trường, không theo vị trí.
const designBang = () => `# D\n\n## Đặc tả UX\n\n### 7. Thẻ việc\n\n| Trường | Giá trị |\n|---|---|\n${['Việc chính', 'Ai dùng', 'Thiết bị', 'Tần suất', 'Số bản ghi'].map(k => `| ${k} | ${THE_VIEC[k]} |`).join('\n')}\n\n### 8. Khác\n\nx\n`;
const DESIGN_VAN = '# D\n\n## Đặc tả UX\n\n### 7. Thẻ việc\n\nNhân viên kho tra cứu phiếu nhập mỗi ngày.\n';
const hoSoG1 = (kho, slug, { surfaces = 'ui', design = designBang() } = {}) => {
  const f = G1(PROBE('clean'));
  for (const [k, t] of Object.entries(f)) {
    let v = t;
    if (k === 'contract.md') v = t.replace('slug: g', `slug: ${slug}`).replace('surfaces: [cli]', `surfaces: [${surfaces}]\ndesign_doc: _acceptance/${slug}/design.md`);
    if (k === 'gap-probe.md') v = t.replace('slug: g', `slug: ${slug}`);
    ghi(kho, `_acceptance/${slug}/${k}`, v);
  }
  if (design !== null) ghi(kho, `_acceptance/${slug}/design.md`, design);
};
const hoSoG2 = (kho, slug, vc) => {
  ghi(kho, `_acceptance/${slug}/contract.md`, CONTRACT_G2.replace('slug: s', `slug: ${slug}`));
  ghi(kho, `_acceptance/${slug}/evals.yaml`, EVALS);
  ghi(kho, `_acceptance/${slug}/evidence-report.md`, REPORT_PASS.replace('feature_slug: s', `feature_slug: ${slug}`).replace('verified_commit: 0000000', `verified_commit: ${vc}`));
  ghi(kho, `_acceptance/${slug}/review-findings.md`, '# Review\n');
};
const nap = (kit, kho, slug, ...them) => chay(kit, LENH, ['--root', kho, '--nap', '--slug', slug, ...them]);
const docNap = (kho, slug) => { try { return JSON.parse(fs.readFileSync(path.join(kho, '_acceptance', slug, 'khuon-nap.json'), 'utf8')); } catch (_) { return null; } };
const the1 = (kit, kho, slug) => chay(kit, GC, ['--root', kho, '--slug', slug, '--gate', '1']);
const ex1 = (kit, kho, slug) => { const r = chay(kit, GC, ['--root', kho, '--slug', slug, '--gate', '1', '--extract']); try { return JSON.parse(r.out); } catch (_) { return { _loi: `${r.ma}: ${r.err.trim()}` }; } };
const k1 = (kit, kho, slug) => ex1(kit, kho, slug).khuon_g1 || { dong: [], co: [] };
const bam = (kho, rel) => git(kho, 'hash-object', '--', rel).trim();
// Khối DEC-ID-RECIPE rút từ SKILL feature-loop lúc chạy; dòng giữa thay bằng dòng lệnh nạp in ra.
const noiSo = (kit, kho, slug, dongGiua) => {
  const khoi = khoiMarker(path.join(kit, SKILL), 'DEC-ID-RECIPE').split('\n');
  const lenh = [khoi[0].replaceAll('<slug>', slug), dongGiua, khoi[2]].join('\n') + '\n';
  execFileSync('bash', ['-c', lenh], { cwd: kho });
};
const dongCauHoi = out => out.split('\n').find(l => l.includes('"stage":"S1"') && l.includes('"nguon":"chi-nguoi"')) || null;
const soCauHoi = (kit, kho, slug) => { const m = /câu hỏi (\d+)/.exec(chay(kit, CC, ['--root', kho, '--slug', slug]).out); return m ? Number(m[1]) : null; };

// ── KK-1: bước nạp ghi lựa chọn ──────────────────────────────────────────────────────────────────────────────
// Bản KH1 ghim cứng: main ngay trước khi vòng này gộp (#483). Không rút từ merge-base HEAD với main — sau khi vòng
// gộp, merge-base đã mang vật của vòng nên mọi phép so «bằng từng byte bản KH1» tự so với chính nó (xanh rỗng).
const KH1 = '0f734a69237616607a1401ae46d771eb2e4c5811';
const _goc = new Map();
const banGocVong = (mb = KH1) => {
  if (_goc.has(mb)) return _goc.get(mb);
  try { git(KIT, 'cat-file', '-e', `${mb}^{commit}`); } catch (_) { throw new Error(`bản KH1 ${mb} không có trong kho — checkout cần đủ lịch sử (fetch-depth: 0)`); }
  // Chốt chống xanh rỗng: mốc so phải KHÁC vật đang kiểm ở chính lệnh được so; trùng = phép so tự so với chính nó.
  if (git(KIT, 'rev-parse', `${mb}:${LENH}`).trim() === git(KIT, 'hash-object', path.join(KIT, LENH)).trim()) {
    throw new Error(`bản KH1 ${mb.slice(0, 8)} trùng vật ở ${LENH} — phép so tự so với chính nó`);
  }
  const d = thuMuc('goc-vong');
  execFileSync('bash', ['-c', `git -C "${KIT}" archive "${mb}" scripts lib | tar -x -C "${d}"`]);
  fs.cpSync(path.join(KIT, 'skills'), path.join(d, 'skills'), { recursive: true });
  _goc.set(mb, d);
  return d;
};
// tiemBoNhom(văn SKILL) — nhát tiêm của KK-8-do, sinh từ vật: gỡ dòng ghi lựa chọn (`--nhom '<nhóm>'`) khỏi khối
// KHUON-S1. Không đổi được byte nào → nổ, không để ca đỏ chạy trên bản trùng bản gốc.
const tiemBoNhom = goc => {
  const tiem = goc.replace(/<!-- <<<KHUON-S1 -->[\s\S]*?<!-- KHUON-S1>>> -->/,
    k => k.split('\n').filter(l => !/--nhom '<nhóm>'/.test(l)).join('\n'));
  if (tiem === goc) throw new Error('KK-8-do: bản tiêm không đổi gì — khối KHUON-S1 không còn dòng --nhom để gỡ');
  return tiem;
};
// ── KK-0: mốc so «bản KH1» là vật-máy-giữ (hồ sơ kk8-do-khong-rut-merge-base) ─────────────────────────────────────
// Lành: bản KH1 ghim dựng được và KHÁC vật đang kiểm. Đỏ: sha vắng → nổ «không có trong kho»; sha trỏ chính HEAD (hình
// dạng merge-base sống sau khi vòng gộp) → nổ «trùng vật». Thông điệp ghim; nổ sai thông điệp = đỏ.
const nemLoi = f => { try { f(); return ''; } catch (e) { return e.message; } };
if (want('KK-0-goc')) {
  const m = nemLoi(() => banGocVong());
  ket('KK-0-goc', m ? [`bản KH1 không dựng được: ${m}`] : (fs.existsSync(path.join(banGocVong(), LENH)) ? [] : [`bản KH1 thiếu ${LENH}`]));
}
if (want('KK-0-goc-do')) {
  const loi = [];
  if (nemLoi(() => banGocVong())) loi.push('bản lành chưa xanh: bản KH1 ghim không dựng được');
  const vang = nemLoi(() => banGocVong('f'.repeat(40)));
  if (!vang.includes('không có trong kho')) loi.push(`sha vắng không nổ đúng thông điệp (được: «${vang || 'không nổ'}»)`);
  const trung = nemLoi(() => banGocVong(git(KIT, 'rev-parse', 'HEAD').trim()));
  if (!trung.includes('trùng vật')) loi.push(`mốc trỏ HEAD không nổ đúng thông điệp (được: «${trung || 'không nổ'}»)`);
  ket('KK-0-goc-do', loi);
}
// KK-0-mot-moc: mọi bản so trong tệp này đi qua banGocVong — tệp không còn lời gọi git merge-base nào (chuỗi lệnh có
// nháy). Đỏ: chính văn tệp này chèn một lời gọi merge-base sống → bộ đếm thấy 1, thông điệp ghim. Chữ lệnh ghép lúc
// chạy để nhát tiêm không tự đếm vào tệp thật.
const LENH_MB = ['merge', 'base'].join('-');
const VAN_TEP = fs.readFileSync(new URL(import.meta.url), 'utf8');
// demMergeBase(văn) — số lời gọi git merge-base dạng chuỗi có nháy ('…' hay "…"); chú thích không có nháy nên không đếm.
const demMergeBase = van => (van.match(new RegExp(`['"]${LENH_MB}['"]`, 'g')) || []).length;
// vietLaiImport(văn) — import tương đối './x.mjs' thành URL tuyệt đối cạnh tệp này, để bản sao chạy được ở thư mục tạm.
const vietLaiImport = van => van.replace(/from '\.\/([\w.-]+\.mjs)'/g, (_, t) => `from '${new URL(`./${t}`, import.meta.url).href}'`);
// Hai mutant gỡ chốt: [tên, chuỗi tìm (khớp đúng 1 lần), chuỗi thay, ca phải đỏ, lời ghim].
const DOT_BIEN = [
  ['go-trung-vat', 'if (git(KIT, \'rev-parse\', `${mb}:${LENH}`)', 'if (false && git(KIT, \'rev-parse\', `${mb}:${LENH}`)', 'KK-0-goc-do', 'mốc trỏ HEAD không nổ đúng thông điệp'],
  ['go-tiem-rong', 'if (tiem === goc) throw new Error(\'KK-8-do:', 'if (false) throw new Error(\'KK-8-do:', 'KK-8-tiem-do', 'tiêm rỗng không nổ đúng thông điệp'],
];
if (want('KK-0-mot-moc')) {
  const n = demMergeBase(VAN_TEP);
  ket('KK-0-mot-moc', n === 0 ? [] : [`tệp test còn ${n} lời gọi ${LENH_MB} — bản so phải đi qua banGocVong`]);
}
if (want('KK-0-mot-moc-do')) {
  const tiem = VAN_TEP.replace('const banGocVong = ', `const _song = () => git(KIT, '${LENH_MB}', 'HEAD', 'origin/main');\nconst banGocVong = `);
  const n0 = demMergeBase(VAN_TEP);
  const n1 = demMergeBase(tiem);
  ket('KK-0-mot-moc-do', n0 !== 0 ? [`bản lành chưa xanh: ${n0} lời gọi`] : (tiem === VAN_TEP ? ['hạ tầng ca: nhát tiêm không khớp'] : (n1 === 1 ? [] : [`bản tiêm đếm ${n1} lời gọi (cần 1)`])));
}
// KK-0-dot-bien: hai mutant gỡ chốt chạy THẬT trên bản sao tệp này (import viết lại thành đường tuyệt đối, KIT vẫn là
// cây đang kiểm). Bản sao nguyên vẹn phải xanh ở KK-0-goc-do + KK-8-tiem-do trước; mỗi mutant phải đỏ đúng ca, đúng lời.
if (want('KK-0-dot-bien')) {
  const loi = [];
  const sao = thuMuc('dot-bien');
  const vanSao = vietLaiImport(VAN_TEP);
  const chayBan = (ten, van) => { const f = path.join(sao, `${ten}.mjs`); fs.writeFileSync(f, van);
    return spawnSync(process.execPath, [f], { encoding: 'utf8', env: { ...process.env, KK_CASES: 'KK-0-goc-do,KK-8-tiem-do' } }); };
  const lanh = chayBan('lanh', vanSao);
  if (lanh.status !== 0 || !/PASS: \[KK-0-goc-do\]/.test(lanh.stdout) || !/PASS: \[KK-8-tiem-do\]/.test(lanh.stdout)) {
    loi.push(`bản lành chưa xanh (thoát ${lanh.status}): ${(lanh.stdout + lanh.stderr).trim().slice(-200)}`);
  } else {
    for (const [ten, tim, thay, ca, loiGhim] of DOT_BIEN) {
      if (vanSao.split(tim).length !== 2) { loi.push(`${ten}: nhát tiêm khớp ${vanSao.split(tim).length - 1} lần (cần 1)`); continue; }
      const r = chayBan(ten, vanSao.replace(tim, thay));
      if (!new RegExp(`FAIL: \\[${ca}\\][^\\n]*${loiGhim}`).test(r.stdout)) loi.push(`${ten}: không đỏ «${ca} … ${loiGhim}» (thoát ${r.status}: ${r.stdout.trim().slice(-160)})`);
    }
  }
  ket('KK-0-dot-bien', loi);
}
const MAN_DAC_BIET = 'src/màn mẫu/A.tsx';
function kiemKK1(kit) {
  const loi = [];
  const kho = taoKhoMau();
  ghi(kho, 'design/patterns/man-dac-biet.md', BAN_DO['form-nhap.md'].replace('nhom: form-nhap', 'nhom: man-dac-biet').replace('src/man/form/NhapMau.tsx', MAN_DAC_BIET).replace('"src/man/form/**/*.tsx", "src/man/chung/**/*.tsx"', '"src/màn mẫu/**/*.tsx"'));
  ghi(kho, MAN_DAC_BIET, 'export default function A() { return null; }\n');
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'nhóm đặc biệt');
  const r = nap(kit, kho, 'a', '--nhom', 'bang-du-lieu');
  const j = docNap(kho, 'a');
  const c = j && j.chon;
  if (r.ma !== 0 || !c || c.nhom !== 'bang-du-lieu' || c.tep !== 'design/patterns/bang-du-lieu.md' || !c.mau || c.mau.tep !== 'src/man/bang/DanhSachMau.tsx') loi.push(`--nhom không ghi lựa chọn (thoát ${r.ma}: ${JSON.stringify(c)} ${r.err.trim()})`);
  else if (c.mau.bam !== bam(kho, 'src/man/bang/DanhSachMau.tsx')) loi.push(`thiếu băm màn mẫu (ghi ${c.mau.bam})`);
  const r2 = nap(kit, kho, 'a2', '--nhom', 'man-dac-biet');
  const c2 = (docNap(kho, 'a2') || {}).chon;
  if (r2.ma !== 0 || !c2 || !c2.mau || c2.mau.bam !== bam(kho, MAN_DAC_BIET)) loi.push(`màn mẫu đường có dấu cách: băm sai (thoát ${r2.ma}: ${JSON.stringify(c2)} ${r2.err.trim()})`);
  // Không cờ chọn → bằng từng byte bản KH1 trên cùng kho.
  nap(kit, kho, 'b');
  nap(banGocVong(), kho, 'b0');
  const b = fs.readFileSync(path.join(kho, '_acceptance/b/khuon-nap.json'), 'utf8');
  const b0 = fs.readFileSync(path.join(kho, '_acceptance/b0/khuon-nap.json'), 'utf8');
  if (b !== b0) loi.push('nạp không cờ chọn khác bản KH1');
  const r3 = nap(kit, kho, 'x', '--nhom', 'khong-co');
  if (r3.ma !== 2 || !['bang-du-lieu', 'form-nhap', 'trang-thai'].every(n => r3.err.includes(n)) || docNap(kho, 'x')) loi.push(`nhóm lạ không bị từ chối (thoát ${r3.ma}: ${r3.err.trim()})`);
  fs.renameSync(path.join(kho, 'src/man/form/NhapMau.tsx'), path.join(kho, 'NhapMau.tam'));
  const r4 = nap(kit, kho, 'c', '--nhom', 'form-nhap');
  fs.renameSync(path.join(kho, 'NhapMau.tam'), path.join(kho, 'src/man/form/NhapMau.tsx'));
  const c4 = (docNap(kho, 'c') || {}).chon;
  if (r4.ma !== 0 || !c4 || !c4.mau || c4.mau.bam !== null || !r4.out.includes('màn mẫu không có trên đĩa')) loi.push(`màn mẫu vắng: ${JSON.stringify(c4)} «${r4.out.trim()}»`);
  const r5 = nap(kit, kho, 'y', '--nhom', 'bang-du-lieu', '--nhom-moi', 'z');
  if (r5.ma !== 2) loi.push(`--nhom cùng --nhom-moi không bị từ chối (thoát ${r5.ma})`);
  return loi;
}
if (wantAny('KK-1')) {
  const lanh = kiemKK1(KIT);
  if (want('KK-1')) ket('KK-1', lanh);
  if (want('KK-1-do')) caDo('KK-1-do', kiemKK1, lanh, () => banSaoTiem(['scripts', 'lib'], LENH, 'bam: bamTep(root, mau)', 'bam: undefined'), 'thiếu băm màn mẫu');
}

// ── KK-2: màn mới thành đúng một câu hỏi ─────────────────────────────────────────────────────────────────────
const nhanMot = s => [...new Set((s || '').match(/[^\s;]+:/g) || [])].sort().join(' ');
function kiemKK2(kit) {
  const loi = [];
  const kho = taoKhoMau();
  hoSoG1(kho, 'd');
  const truocN = soCauHoi(kit, kho, 'd');
  const truoc = ex1(kit, kho, 'd');
  const r = nap(kit, kho, 'd', '--nhom-moi', 'bao-cao-tuan', '--gan', 'bang-du-lieu');
  const c = (docNap(kho, 'd') || {}).chon;
  if (r.ma !== 0 || !c || c.moi !== 'bao-cao-tuan' || c.gan !== 'bang-du-lieu') loi.push(`--nhom-moi không ghi lựa chọn (thoát ${r.ma}: ${JSON.stringify(c)} ${r.err.trim()})`);
  const d = dongCauHoi(r.out);
  if (!d) { loi.push(`nhóm mới không thành câu hỏi: không có dòng chi-nguoi («${r.out.trim()}»)`); return loi; }
  noiSo(kit, kho, 'd', d);
  const sauN = soCauHoi(kit, kho, 'd');
  const sau = ex1(kit, kho, 'd');
  const moi = (sau.routing?.hoi || []).filter(x => !(truoc.routing?.hoi || []).includes(x));
  const cau = (sau.can_cu?.cau_hoi || []).find(q => moi.includes(q.nhan));
  if (truocN === null || sauN !== truocN + 1 || moi.length !== 1 || !/^Hỏi-\d+$/.test(moi[0]) || !cau || !cau.decision.includes('bao-cao-tuan')) loi.push(`nhóm mới không thành câu hỏi (câu hỏi ${truocN} → ${sauN}, nhãn mới ${JSON.stringify(moi)})`);
  if (nhanMot(truoc.one_shot) !== nhanMot(sau.one_shot)) loi.push(`câu duyệt thêm nhãn: «${truoc.one_shot}» → «${sau.one_shot}»`);
  hoSoG1(kho, 'e');
  const e0 = soCauHoi(kit, kho, 'e');
  const r2 = nap(kit, kho, 'e', '--nhom-moi', 'bao-cao-tuan');
  const d2 = dongCauHoi(r2.out);
  let khac = '';
  try { khac = JSON.parse(`{${d2}}`).can_cu.loi_khac || ''; } catch (_) { khac = ''; }
  if (!d2 || !khac.includes('để màn ngoài bản đồ')) loi.push(`câu hỏi một lối: vắng --gan mà lối khác là «${khac}»`);
  else { noiSo(kit, kho, 'e', d2); if (soCauHoi(kit, kho, 'e') !== e0 + 1) loi.push('nhóm mới không thành câu hỏi khi vắng --gan'); }
  const r3 = nap(kit, kho, 'f', '--nhom-moi', 'Bao Cao');
  if (r3.ma !== 2) loi.push(`tên nhóm mới sai khuôn không bị từ chối (thoát ${r3.ma})`);
  return loi;
}
if (wantAny('KK-2')) {
  const lanh = kiemKK2(KIT);
  if (want('KK-2')) ket('KK-2', lanh);
  if (want('KK-2-do')) caDo('KK-2-do', kiemKK2, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], LENH, 'nguon: \'chi-nguoi\'', 'nguon: \'muc-tieu\''), 'nhóm mới không thành câu hỏi');
  if (want('KK-2-do2')) caDo('KK-2-do2', kiemKK2, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], LENH, 'gan ? `xếp vào ${gan}` : LOI_NGOAI_BAN_DO', 'gan ? `xếp vào ${gan}` : \'\''), 'câu hỏi một lối');
}

// ── KK-3: khối «Khuôn» trên thẻ Cổng 1 ────────────────────────────────────────────────────────────────────────
function kiemKK3(kit) {
  const loi = [];
  const kho = taoKhoMau();
  hoSoG1(kho, 'h');
  nap(kit, kho, 'h', '--nhom', 'bang-du-lieu');
  const k = k1(kit, kho, 'h');
  const html = the1(kit, kho, 'h').out;
  const can = ['bang-du-lieu', 'màn liệt kê nhiều bản ghi cùng loại', ...Object.values(THE_VIEC)];
  for (const s of can) {
    if (!k.dong.some(l => l.includes(s))) loi.push(`khuon_g1 thiếu «${s}»`);
    if (!html.includes(s)) loi.push(`HTML thiếu «${s}»`);
  }
  if (!k.dong.some(l => l.includes('nhận việc: tra cứu nhiều bản ghi')) || !html.includes('nhận việc: tra cứu nhiều bản ghi')) loi.push('thiếu việc nhóm nhận');
  if (!k.dong.some(l => l.includes('src/man/bang/DanhSachMau.tsx') && l.includes('băm khớp'))) loi.push(`màn mẫu không kèm «băm khớp»: ${JSON.stringify(k.dong)}`);
  hoSoG1(kho, 'v', { design: DESIGN_VAN });
  nap(kit, kho, 'v', '--nhom', 'bang-du-lieu');
  if (!k1(kit, kho, 'v').dong.includes('Thẻ việc: chưa điền')) loi.push(`Thẻ việc văn xuôi không ra «chưa điền»: ${JSON.stringify(k1(kit, kho, 'v').dong)}`);
  fs.renameSync(path.join(kho, 'design/patterns/bang-du-lieu.md'), path.join(kho, 'bang.tam'));
  const kx = k1(kit, kho, 'h');
  const rx = the1(kit, kho, 'h');
  fs.renameSync(path.join(kho, 'bang.tam'), path.join(kho, 'design/patterns/bang-du-lieu.md'));
  if (rx.ma !== 0 || !kx.dong.some(l => l.includes('nhóm bang-du-lieu không còn trong bản đồ'))) loi.push(`nhóm đã xoá khỏi bản đồ: thoát ${rx.ma}, ${JSON.stringify(kx.dong)}`);
  return loi;
}
if (wantAny('KK-3')) {
  const lanh = kiemKK3(KIT);
  if (want('KK-3')) ket('KK-3', lanh);
  if (want('KK-3-do')) caDo('KK-3-do', kiemKK3, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'dong.push(`nhận việc: ${n.nhan_viec || \'—\'}`);', ''), 'thiếu việc nhóm nhận');
}

// ── KK-4: cờ trên thẻ Cổng 1 — ma trận viết sẵn ──────────────────────────────────────────────────────────────
const CO_A = 'S1 chưa ghi đã chọn nhóm khuôn nào';
const CO_B = 'màn mẫu đổi sau khi S1 đọc';
const CO_C = 'nhóm mới bao-cao-tuan chưa thành câu hỏi ở cổng';
const coCo = (k, s) => k.co.some(x => x.includes(s));
const HANG_KK4 = [
  { ten: 'a', lam: (kit, kho) => { hoSoG1(kho, 'a'); return coCo(k1(kit, kho, 'a'), CO_A) ? null : 'hồ sơ mặt người nhìn chưa nạp mà không cờ (a)'; } },
  { ten: 'b', lam: (kit, kho) => {
    hoSoG1(kho, 'b'); nap(kit, kho, 'b', '--nhom', 'form-nhap');
    const f = path.join(kho, 'src/man/form/NhapMau.tsx'); const goc = fs.readFileSync(f, 'utf8');
    fs.writeFileSync(f, goc + '// sửa sau khi đọc\n'); const k = k1(kit, kho, 'b'); fs.writeFileSync(f, goc);
    return coCo(k, CO_B) ? null : 'màn mẫu đổi mà không cờ (b)'; } },
  { ten: 'c', lam: (kit, kho) => { hoSoG1(kho, 'c'); nap(kit, kho, 'c', '--nhom-moi', 'bao-cao-tuan', '--gan', 'bang-du-lieu'); return coCo(k1(kit, kho, 'c'), CO_C) ? null : 'nhóm mới chưa thành câu hỏi mà không cờ (c)'; } },
  { ten: 'd', lam: (kit, kho) => { hoSoG1(kho, 'd', { surfaces: 'cli' }); const k = k1(kit, kho, 'd'); return k.co.length ? `cờ thừa ở hàng (d): ${k.co.join(' · ')}` : null; } },
  { ten: 'e', lam: (kit, kho) => { hoSoG1(kho, 'e'); nap(kit, kho, 'e', '--nhom', 'bang-du-lieu'); const k = k1(kit, kho, 'e'); return k.co.length ? `cờ thừa ở hàng (e): ${k.co.join(' · ')}` : null; } },
  { ten: 'f', lam: (kit, kho) => {
    hoSoG1(kho, 'f'); const r = nap(kit, kho, 'f', '--nhom-moi', 'bao-cao-tuan', '--gan', 'bang-du-lieu');
    const d = dongCauHoi(r.out); if (d) noiSo(kit, kho, 'f', d);
    const k = k1(kit, kho, 'f'); return k.co.length ? `cờ thừa ở hàng (f): ${k.co.join(' · ')}` : null; } },
  { ten: 'g', lam: (kit, kho) => { hoSoG1(kho, 'g'); nap(kit, kho, 'g'); return coCo(k1(kit, kho, 'g'), CO_A) ? null : 'nạp không chọn mà không cờ (g)'; } },
  { ten: 'h', lam: (kit, kho) => { hoSoG1(kho, 'h', { surfaces: 'web' }); return coCo(k1(kit, kho, 'h'), CO_A) ? null : 'hồ sơ mặt người nhìn chưa nạp mà không cờ (h, web)'; } },
  { ten: 'h2', lam: (kit, kho) => { hoSoG1(kho, 'h2', { surfaces: 'web-ui' }); return coCo(k1(kit, kho, 'h2'), CO_A) ? null : 'hồ sơ mặt người nhìn chưa nạp mà không cờ (h2, web-ui)'; } },
  { ten: 'i', lam: (kit, kho) => {
    hoSoG1(kho, 'i'); nap(kit, kho, 'i', '--nhom', 'bang-du-lieu');
    const p = path.join(kho, '_acceptance/i/khuon-nap.json'); const j = docNap(kho, 'i');
    if (!j || !j.chon || !j.chon.mau) return 'màn mẫu vắng mà vẫn in băm khớp (i): bước nạp không ghi chon.mau';
    j.chon.mau.bam = null; fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
    const k = k1(kit, kho, 'i');
    return k.dong.some(l => l.includes('màn mẫu không có trên đĩa')) && !k.dong.some(l => l.includes('băm khớp')) ? null : `màn mẫu vắng mà vẫn in băm khớp (i): ${JSON.stringify(k.dong)}`; } },
];
function kiemKK4(kit, inSo = false) {
  const kho = taoKhoMau();
  const loi = HANG_KK4.map(h => h.lam(kit, kho)).filter(Boolean);
  if (inSo) console.log(`KK-4: ${HANG_KK4.length - loi.length}/${HANG_KK4.length}`);
  return loi;
}
if (wantAny('KK-4')) {
  const lanh = kiemKK4(KIT, want('KK-4'));
  if (want('KK-4')) ket('KK-4', lanh);
  if (want('KK-4-hong')) {
    const kho = taoKhoMau();
    hoSoG1(kho, 'j'); ghi(kho, '_acceptance/j/khuon-nap.json', '{hỏng');
    const r = the1(KIT, kho, 'j'); const k = k1(KIT, kho, 'j');
    ket('KK-4-hong', r.ma === 0 && coCo(k, CO_A) ? [] : [`khuon-nap.json hỏng: thoát ${r.ma}, cờ ${JSON.stringify(k.co)}`]);
  }
  if (want('KK-4-do')) caDo('KK-4-do', kiemKK4, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], 'scripts/ban-do-khuon.cjs', 'const khop = bamHienTai === mau.bam;', 'const khop = true;'), 'màn mẫu đổi mà không cờ', true);
  if (want('KK-4-do2')) caDo('KK-4-do2', kiemKK4, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], 'scripts/ban-do-khuon.cjs', 'const chon = chonNap(root, slug);\n  const matNguoi', "const chon = fs.existsSync(path.join(root, '_acceptance', slug, 'khuon-nap.json')) ? (chonNap(root, slug) || {}) : null;\n  const matNguoi"), 'nạp không chọn mà không cờ', true);
}

// ── KK-5: khối «Khuôn» trên thẻ Cổng 2 ────────────────────────────────────────────────────────────────────────
const RE_DONG_THE = /Khuôn: (\d+) tệp theo khuôn · (\d+) lệch mới · nợ cũ (\d+) · không đo (\d+)/;
const manForm = (nhap = '', jsx = '') => `import { KhungForm } from '@/khuon/KhungForm';\n${nhap}export default function M() {\n  return <KhungForm>${jsx}</KhungForm>;\n}\n`;
const manBang = () => `import { KhungBang } from '@/khuon/KhungBang';\nexport default function M() {\n  return <KhungBang />;\n}\n`;
const LECH = manForm("import { Hop } from '@/ui/Hop';\n", '<Hop />');
const vongG2 = (kit, kho, slug, soLech) => {
  const tep = { 'src/man/bang/Moi.tsx': manBang() };
  for (let i = 1; i <= soLech; i++) tep[`src/man/form/Lech${i}.tsx`] = LECH;
  nhanh(kho, `vong-${slug}`, tep);
  nap(kit, kho, slug, '--nhom', 'form-nhap');
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'nạp');
  const sha = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, slug, sha);
  const w = chay(kit, LENH, ['--root', kho, '--kiem', '--write', '--slug', slug, '--den', sha]);
  if (w.ma !== 0) throw new Error(`--kiem --write thoát ${w.ma}: ${w.err.trim()}`);
};
function kiemKK5(kit) {
  const loi = [];
  const B = (() => { const p = path.join(kit, 'scripts', 'ban-do-khuon.cjs'); delete require.cache[require.resolve(p)]; return require(p); })();
  const kho = taoKhoMau();
  vongG2(kit, kho, 'h', 2);
  const cham = JSON.parse(fs.readFileSync(path.join(kho, '_acceptance/h/khuon-cham.json'), 'utf8'));
  const html = chay(kit, GC, ['--root', kho, '--slug', 'h']).out;
  const m = RE_DONG_THE.exec(html);
  if (!m || m[2] !== '2') loi.push(`dòng số đo KH1 không còn hay sai (${m ? m[0] : 'không có'})`);
  if (typeof B.dongLech !== 'function') loi.push('bộ đọc không export dongLech (một nguồn)');
  else for (const x of cham.lech_moi) if (!html.includes(B.dongLech(x))) loi.push(`thẻ thiếu dòng lệch «${B.dongLech(x)}»`);
  if (!html.includes('vòng chọn nhóm form-nhap mà vật chạm nhóm bang-du-lieu')) loi.push('chạm nhóm khác mà không cờ');
  const kho2 = taoKhoMau();
  vongG2(kit, kho2, 'h7', 7);
  const html7 = chay(kit, GC, ['--root', kho2, '--slug', 'h7']).out;
  const so = (html7.match(/lệch: src\//g) || []).length;
  if (so !== 5 || !html7.includes('… và 2 lệch nữa')) loi.push(`bảy lệch: thẻ in ${so} dòng, «… và 2 lệch nữa» ${html7.includes('… và 2 lệch nữa')}`);
  const p = path.join(kho, '_acceptance/h/khuon-cham.json');
  const cu = { ...cham }; delete cu.lech_moi;
  fs.writeFileSync(p, JSON.stringify(cu, null, 2) + '\n');
  const r = chay(kit, GC, ['--root', kho, '--slug', 'h']);
  if (r.ma !== 0 || !RE_DONG_THE.test(r.out) || /lệch: src\//.test(r.out)) loi.push(`số đo đời cũ không có lech_moi: thoát ${r.ma}`);
  return loi;
}
if (wantAny('KK-5')) {
  const lanh = kiemKK5(KIT);
  if (want('KK-5')) ket('KK-5', lanh);
  if (want('KK-5-do')) caDo('KK-5-do', kiemKK5, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'if (khac.length) co2.push(', 'if (false) co2.push('), 'chạm nhóm khác mà không cờ');
}

// ── KK-6: kho không khai bản đồ ──────────────────────────────────────────────────────────────────────────────
function kiemKK6(kit) {
  const loi = [];
  const kho = taoKhoMau({ coBanDo: false });
  for (const [f, t] of Object.entries(G1(PROBE('clean')))) ghi(kho, `_acceptance/g/${f}`, t);
  hoSoG1(kho, 'u');
  const sha = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, 'h', sha);
  git(kho, 'add', '-A'); git(kho, 'commit', '-qm', 'hồ sơ');
  const truoc = git(kho, 'status', '--porcelain');
  for (const a of [['--nhom', 'x'], ['--nhom-moi', 'y']]) {
    const r = nap(kit, kho, 'u', ...a);
    if (r.ma !== 0 || r.out || r.err) loi.push(`kho không khai mà lệnh in (${a.join(' ')}: thoát ${r.ma}, «${(r.out + r.err).trim()}»)`);
  }
  if (git(kho, 'status', '--porcelain') !== truoc) loi.push('kho không khai mà lệnh ghi tệp');
  const goc = banGocVong();
  for (const [slug, them] of [['g', []], ['g', ['--extract']], ['u', []], ['u', ['--extract']], ['h', []], ['h', ['--extract']]]) {
    const moi = chay(kit, GC, ['--root', kho, '--slug', slug, ...them]);
    const cu = chay(goc, GC, ['--root', kho, '--slug', slug, ...them]);
    if (moi.out !== cu.out || moi.ma !== cu.ma) loi.push(`thẻ đổi khi kho không khai bản đồ: ${slug} ${them.join(' ')} (thoát ${moi.ma}/${cu.ma})`);
    if (!moi.out) loi.push(`thẻ ${slug} ${them.join(' ')} rỗng — đối chứng không đo gì`);
  }
  return loi;
}
if (wantAny('KK-6')) {
  const lanh = kiemKK6(KIT);
  if (want('KK-6')) ket('KK-6', lanh);
  if (want('KK-6-do')) caDo('KK-6-do', kiemKK6, lanh, () => banSaoTiem(['scripts', 'lib'], 'scripts/ban-do-khuon.cjs', 'if (!coBanDo) return null;', 'if (false) return null;'), 'thẻ đổi khi kho không khai bản đồ');
}

// ── KK-7: lỗi không im lặng ──────────────────────────────────────────────────────────────────────────────────
const NEM = "theCong1 = () => { throw new Error('hỏng thử'); }; theCong2 = () => { throw new Error('hỏng thử'); };\nmodule.exports = {";
function kiemKK7(kit) {
  const loi = [];
  const sao = saoTu(kit, ['scripts', 'lib', 'skills'], 'scripts/ban-do-khuon.cjs', 'module.exports = {', NEM);
  const kho = taoKhoMau();
  hoSoG1(kho, 'g1');
  const sha = git(kho, 'rev-parse', 'HEAD').trim();
  hoSoG2(kho, 'h', sha);
  for (const [slug, them] of [['g1', ['--gate', '1']], ['h', []]]) {
    const r = chay(sao, GC, ['--root', kho, '--slug', slug, ...them]);
    const n = r.out.split('không dựng được khối Khuôn: hỏng thử').length - 1;
    if (r.ma !== 0 || n !== 1) loi.push(`lỗi khối Khuôn bị nuốt ở ${slug} (thoát ${r.ma}, cờ ${n} lần)`);
  }
  return loi;
}
if (wantAny('KK-7')) {
  const lanh = kiemKK7(KIT);
  if (want('KK-7')) ket('KK-7', lanh);
  if (want('KK-7-do')) caDo('KK-7-do', kiemKK7, lanh, () => banSaoTiem(['scripts', 'lib', 'skills'], GC, 'khuonG1 = loiKhuon(e);', 'khuonG1 = null;'), 'lỗi khối Khuôn bị nuốt');
}

// ── KK-8: lệnh khối KHUON-S1 của SKILL ghi đúng vật ──────────────────────────────────────────────────────────
function kiemKK8(kit, inSo = false) {
  const loi = [];
  const dong = khoiMarker(path.join(kit, SKILL), 'KHUON-S1').split('\n').filter(l => l.trim());
  const datAG = l => l.replace(/^AG=\$\([^)]*\) && /, `AG='${kit}' && `);
  const chonL = dong.filter(l => /--nhom '<nhóm>'/.test(l));
  const moiL = dong.filter(l => /--nhom-moi/.test(l));
  if (inSo) console.log(`số dòng KHUON-S1: ${dong.length} (chọn ${chonL.length} · mới ${moiL.length})`);
  const kho = taoKhoMau();
  hoSoG1(kho, 'A'); hoSoG1(kho, 'B');
  const chayDong = l => spawnSync('bash', ['-c', datAG(l)], { cwd: kho, encoding: 'utf8' });
  if (chonL.length !== 1) loi.push(`lệnh khối KHUON-S1 không ghi lựa chọn: ${chonL.length} dòng --nhom`);
  else {
    const r = chayDong(chonL[0].replaceAll('<slug>', 'A').replaceAll('<nhóm>', 'bang-du-lieu'));
    const c = (docNap(kho, 'A') || {}).chon;
    if (r.status !== 0 || !c || c.nhom !== 'bang-du-lieu') loi.push(`lệnh khối KHUON-S1 không ghi lựa chọn (thoát ${r.status}: ${(r.stderr || '').trim()})`);
    else if (!k1(kit, kho, 'A').dong.some(l => l.includes('bang-du-lieu'))) loi.push('thẻ Cổng 1 không in nhóm lệnh SKILL đã ghi');
  }
  const r2 = moiL.length === 1 ? chayDong(moiL[0].replaceAll('<slug>', 'B').replaceAll('<tên>', 'bao-cao-tuan').replaceAll('<nhóm gần>', 'bang-du-lieu')) : null;
  const c2 = (docNap(kho, 'B') || {}).chon;
  if (!r2 || r2.status !== 0 || !c2 || c2.moi !== 'bao-cao-tuan' || !(r2.stdout || '').includes('"nguon":"chi-nguoi"')) loi.push(`nhánh nhóm mới của KHUON-S1 hỏng (${moiL.length} dòng, thoát ${r2 && r2.status}: ${r2 ? (r2.stderr || '').trim() : ''})`);
  const guide = fs.readFileSync(path.join(KIT, 'GUIDE.md'), 'utf8');
  const i = guide.indexOf('### 5.2 '); const j = guide.indexOf('\n### ', i + 1);
  const muc = i >= 0 ? guide.slice(i, j > i ? j : undefined) : '';
  if (!muc.includes('--nhom') || !muc.includes('--nhom-moi')) loi.push('GUIDE §5.2 không nêu --nhom và --nhom-moi');
  return loi;
}
if (wantAny('KK-8')) {
  const lanh = kiemKK8(KIT, want('KK-8'));
  if (want('KK-8')) ket('KK-8', lanh);
  if (want('KK-8-do')) caDo('KK-8-do', kiemKK8, lanh, () => {
    // Bản tiêm tự sinh từ vật (tiemBoNhom). Không rút «khối cũ» từ merge-base với main — sau khi vòng này gộp,
    // merge-base đã mang khối mới nên bản tiêm trùng bản gốc (CI ed44c2b8, run 41763815977).
    const sao = banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], SKILL, '<!-- <<<KHUON-S1 -->', '<!-- <<<KHUON-S1 -->');
    const f = path.join(sao, SKILL);
    fs.writeFileSync(f, tiemBoNhom(fs.readFileSync(f, 'utf8')));
    return sao;
  }, 'lệnh khối KHUON-S1 không ghi lựa chọn');
  // KK-8-tiem: nhát tiêm của KK-8-do gỡ ĐÚNG MỘT dòng khỏi vật thật. KK-8-tiem-do: tiêm lần hai lên chính bản đã tiêm
  // (khối không còn dòng --nhom — hình dạng «bản tiêm trùng bản gốc» của CI ed44c2b8) phải nổ thông điệp ghim.
  const vat = fs.readFileSync(path.join(KIT, SKILL), 'utf8');
  if (want('KK-8-tiem')) {
    const m = nemLoi(() => tiemBoNhom(vat));
    const bot = m ? -1 : vat.split('\n').length - tiemBoNhom(vat).split('\n').length;
    ket('KK-8-tiem', bot === 1 ? [] : [`nhát tiêm trên vật gỡ ${bot} dòng (cần 1)${m ? `: ${m}` : ''}`]);
  }
  if (want('KK-8-tiem-do')) {
    const m1 = nemLoi(() => tiemBoNhom(vat));
    const m2 = m1 ? '' : nemLoi(() => tiemBoNhom(tiemBoNhom(vat)));
    ket('KK-8-tiem-do', m1 ? [`bản lành chưa xanh: ${m1}`] : (m2.includes('bản tiêm không đổi gì') ? [] : [`tiêm rỗng không nổ đúng thông điệp (được: «${m2 || 'không nổ'}»)`]));
  }
  if (want('KK-8-do2')) caDo('KK-8-do2', kiemKK8, lanh, () => banSaoTiem(['scripts', 'lib', 'feature-loop', 'skills'], SKILL, "--gan '<nhóm gần>'", "--gần '<nhóm gần>'"), 'nhánh nhóm mới của KHUON-S1 hỏng');
}

process.exitCode = hong ? 1 : 0;
