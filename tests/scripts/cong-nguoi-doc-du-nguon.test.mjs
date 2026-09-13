// CN — cổng người đọc đủ nguồn (hồ sơ cong-nguoi-doc-du-nguon, 13/09/2026).
//
// Ca VĨNH VIỄN: suite scripts tự chạy mọi *.test.mjs qua glob, nên đây là lưới
// thường trực cho lớp «bên đọc hẹp hơn vật», không phải răng hồ sơ chết theo merge.
//
// Luật đo (chép từ đầu evals.yaml của hồ sơ, nguồn là đó):
//  - Fixture do CODE SINH trong chính lượt chạy. Không đọc hợp đồng thật của kho
//    làm fixture — hồ sơ đã ký là sử liệu. Hình dạng lấy từ hồ sơ thật thì CHÉP
//    CHUỖI vào tệp này, và chuỗi đó phải ghi rõ nguồn.
//  - Mỗi ca chạy HAI CHIỀU trên CÙNG fixture: đối chứng dương TRƯỚC (vật lành →
//    xanh), rồi hoàn nguyên đúng một đường trên BẢN SAO → phải ĐỎ với thông điệp
//    ghim. Bản sao .cjs/.mjs/.js phải qua `node --check`; mũi tiêm khớp đúng một lần.
//  - Mọi đường dẫn suy từ vị trí tệp này.
//  - Mỗi ca in ĐÚNG MỘT dòng kết quả `PASS: CNxx …` / `FAIL: CNxx … (DO: …)`;
//    chi tiết in bằng tiền tố `    · `. Bộ chọn CNDN_CASES khớp 0 ca → exit 1.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const req = createRequire(import.meta.url);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cndn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };

const CASES = {};
const fails = [];
const def = (id, fn) => { CASES[id] = fn; };
const say = (id, ok, why, chi) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${id}${ok ? '' : ` (DO: ${why})`}`);
  for (const c of chi || []) console.log(`    · ${c}`);
  if (!ok) fails.push(id);
};

// ── khuôn mục, rút từ bên VIẾT ────────────────────────────────────────────
// acceptance-verify.js dạy bước soạn báo cáo viết mục theo khuôn này. Rút bằng
// marker chứ không chép tay: chép tay là dựng lại đúng lớp lỗi bên-đọc-trôi-khỏi-
// bên-viết mà vòng này đi đóng.
function rutKhuon() {
  const wf = fs.readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
  if (!m) return null;
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
}
const mucTu = (khuon, ten, i) => khuon
  .replace('{title}', `${ten}-${i}`)
  .replace('{plain}', `người dùng thấy ${ten}-${i}`)
  .replace('{file}', `src/${ten}${i}.ts`)
  .replace('{severity}', 'medium')
  .replace('{proposal}', 'known-limits');

// ══ CN14 — khuôn mục rút từ bên VIẾT, đọc bằng bên ĐỌC ═════════════════════
def('CN14', () => {
  const chi = [];
  const khuon = rutKhuon();
  if (!khuon) return say('CN14', false, 'KHONG rut duoc OOC-ITEM-TEMPLATE tu writer', chi);
  if (!/\{title\}/.test(khuon)) return say('CN14', false, 'khuon rut ra khong co {title} — marker da troi', chi);
  chi.push(`khuôn rút từ writer, dòng đầu: ${khuon.split('\n')[0]}`);

  const rf = [
    '## Trong hợp đồng', '',
    mucTu(khuon, 'trong', 1), mucTu(khuon, 'trong', 2), '',
    '## Ngoài hợp đồng — người quyết ở Gate 2', '',
    mucTu(khuon, 'ngoai', 1), mucTu(khuon, 'ngoai', 2), mucTu(khuon, 'ngoai', 3), '',
  ].join('\n');

  const ooc = req(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
  const r = ooc.parse(rf);
  const soNgoai = (r.findings || []).length;
  const soTrong = (r.inContract || []).length;
  chi.push(`bên đọc thấy ngoài=${soNgoai} trong=${soTrong}`);
  if (soNgoai !== 3) return say('CN14', false, `ngoai=${soNgoai}, cho 3`, chi);
  if (soTrong !== 2) return say('CN14', false, `trong=${soTrong}, cho 2`, chi);

  // Hai mục phải bóc ra CÙNG hình dạng phần tử — chúng dùng chung một khuôn bên
  // viết, nên bên đọc mà trả hai hình dạng khác nhau là đã có bản bóc thứ hai.
  const truong = o => Object.keys(o).sort().join(',');
  const hdNgoai = truong(r.findings[0]);
  const hdTrong = truong(r.inContract[0]);
  chi.push(`hình dạng phần tử: ngoài=[${hdNgoai}] trong=[${hdTrong}]`);
  if (hdNgoai !== hdTrong) return say('CN14', false, 'hai muc boc ra HAI hinh dang — co ban boc thu hai', chi);
  if (r.inContract[0].title !== 'trong-1' || r.inContract[0].plain !== 'người dùng thấy trong-1') {
    return say('CN14', false, `noi dung muc Trong sai: ${JSON.stringify(r.inContract[0])}`, chi);
  }

  // CHIỀU ĐỎ: khuôn bên VIẾT đổi mà bên đọc vẫn ra số cũ nghĩa là nó không thật
  // sự theo bên viết — nó đang khớp một khuôn chép tay nằm đâu đó trong chính nó.
  const khuonKhac = khuon.replace('- **{title}**', '### {title}');
  if (khuonKhac === khuon) return say('CN14', false, 'khong tiem duoc khuon khac — dong dau khuon da doi', chi);
  const rfKhac = ['## Ngoài hợp đồng', '',
    mucTu(khuonKhac, 'ngoai', 1), mucTu(khuonKhac, 'ngoai', 2), mucTu(khuonKhac, 'ngoai', 3), ''].join('\n');
  const nKhac = (ooc.parse(rfKhac).findings || []).length;
  chi.push(`chiều đỏ: khuôn đổi → bên đọc ra ${nKhac} (phải khác 3)`);
  if (nKhac === 3) return say('CN14', false, 'ben doc khong theo ben viet — doi khuon van ra 3', chi);

  say('CN14', true, '', chi);
});

// ── dựng văn bản fixture, dùng lại ở nhiều ca ─────────────────────────────
// Khuôn mục lấy từ bên VIẾT ở CN14; ở đây dựng thẳng cho gọn vì các ca dưới đo
// VỊ TỪ chứ không đo quan hệ viết-đọc (quan hệ đó là việc của CN14).
const mucPhang = (n, i) => `- **${n}-${i}**\n  Người dùng thấy gì: ${n}-${i}\n  file: \`src/${n}${i}.ts\`\n  severity: medium\n  Đề xuất: known-limits`;
const rfText = (ngoai, trong) => {
  const out = [];
  if (trong > 0) { out.push('## Trong hợp đồng', ''); for (let i = 1; i <= trong; i++) out.push(mucPhang('trong', i)); out.push(''); }
  out.push('## Ngoài hợp đồng — người quyết ở Gate 2', '');
  for (let i = 1; i <= ngoai; i++) out.push(mucPhang('ngoai', i));
  return out.join('\n') + '\n';
};
// Dòng sổ ĐỊNH ĐOẠT phải NHẮC NHÃN «Ngoài-n»/«Trong-n» — thẻ đánh số mục bằng
// nhãn đó và người trả lời theo nhãn. Đếm mọi dòng `stage: gate2` là sai NGƯỢC
// chiều an toàn (lượt chấm 1): 621 dòng như thế trên 22 kho, 12 loại type, phần
// lớn không định đoạt mục nào — một hồ sơ 1 mục treo + 1 dòng veto sẽ ra n = 0.
const soText = (soGate2, soKhac = 0) => {
  const ln = [];
  for (let i = 0; i < soGate2; i++) ln.push(JSON.stringify({ id: `d-x-${i}`, type: 'descope', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: `Ngoài-${i + 1}: ghi Known limits`, impact: 'y' }));
  for (let i = 0; i < soKhac; i++) ln.push(JSON.stringify({ id: `d-y-${i}`, type: 'fix', stage: 'S4-r1', at: '2026-09-13T00:00:00Z', decision: 'x', impact: 'y' }));
  return ln.join('\n') + (ln.length ? '\n' : '');
};
const baoCao = (findingsOpen) => [
  '---', 'schema_version: 1', 'verdict: PASS',
  ...(findingsOpen == null ? [] : [`findings_open: ${findingsOpen}`]),
  '---', '', '## Known limits', '', '## Ngoài hợp đồng', '',
].join('\n');

// ══ CN04 — lời khai phải đối chiếu được với vật ════════════════════════════
def('CN04', () => {
  const chi = [];
  const core = req(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  if (typeof core.dieuKienFindings !== 'function') return say('CN04', false, 'core.dieuKienFindings chua ton tai', chi);
  // [tên ô, khoá findings_open, mục ngoài, mục trong, dòng sổ gate2, mong đợi sạch, chuỗi phải có trong why]
  const O = [
    ['khoá 0 · vật 0',                 0, 0, 0, 0, true,  ''],
    ['khoá 2 · vật 2',                 2, 2, 0, 0, false, '2'],
    ['khoá 0 · vật 2 (khai thấp)',     0, 2, 0, 0, false, 'lệch'],
    ['khoá 5 · vật 2 (khai cao)',      5, 2, 0, 0, false, 'lệch'],
    ['khoá 2 · 2 ngoài + 2 trong · 2 định đoạt', 2, 2, 2, 2, false, '2'],
    // KHÔNG TRỪ (owner duyệt 13/09): dòng sổ định đoạt KHÔNG kéo số về 0 nữa.
    // Mục còn trong tệp là mục còn chờ người, bất kể sổ ghi gì.
    ['khoá 2 · 2 mục · 2 dòng sổ',     2, 2, 0, 2, false, '2'],
    ['khoá 0 · 2 mục · 2 dòng sổ',     0, 2, 0, 2, false, 'lệch'],
  ];
  // Hai ô VẮNG TỆP — tách khỏi bảng vì chúng truyền findingsText = null.
  // 505/1242 hồ sơ có báo cáo trên 11 kho không có tệp rà soát; gộp ca này vào
  // nhánh fail-CLOSED là khoá 41% hồ sơ.
  const vt1 = core.dieuKienFindings({ findingsText: null, ledgerText: '', reportText: baoCao(null) });
  chi.push(`vắng tệp · báo cáo vắng khoá → clean=${vt1.clean} doiCu=${vt1.doiCu}`);
  if (!vt1.clean || !vt1.doiCu) return say('CN04', false, 'vang tep phai SACH va mang co doc-cu', chi);
  const vt2 = core.dieuKienFindings({ findingsText: null, ledgerText: soText(3), reportText: baoCao(0) });
  chi.push(`vắng tệp · báo cáo khai 0 → clean=${vt2.clean} doiCu=${vt2.doiCu}`);
  if (!vt2.clean || !vt2.doiCu) return say('CN04', false, 'vang tep + khai 0 phai SACH va mang co doc-cu', chi);

  // Ô mới sau lượt chấm 1: dòng sổ gate2 KHÔNG nhắc nhãn nào thì KHÔNG trừ gì —
  // veto và revisit của người cũng mang stage gate2 mà không định đoạt mục nào.
  const veto = JSON.stringify({ id: 'd-v', type: 'veto', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: 'owner veto, không nhắc mục nào', impact: 'x' });
  const rV = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: veto + '\n', reportText: baoCao(2) });
  chi.push(`2 mục + 1 dòng veto → clean=${rV.clean} (phải false)`);
  if (rV.clean) return say('CN04', false, 'dong so keo so ve 0 — sach gia', chi);
  // Và dòng sổ NHẮC ĐÚNG NHÃN cũng KHÔNG được trừ: đó là bản đếm thứ hai đã bỏ.
  const nhan = JSON.stringify({ id: 'd-n', type: 'approach', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: 'Ngoài-1: ghi Known limits · Ngoài-2: ghi Known limits', impact: 'x' });
  const rN = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: nhan + '\n', reportText: baoCao(2) });
  chi.push(`2 mục + 1 dòng nhắc đủ hai nhãn → clean=${rN.clean} (phải false)`);
  if (rN.clean) return say('CN04', false, 'nhan van bi tru — ban dem thu hai chua bo het', chi);
  // SAI KHUÔN — ba chiều, vì hai bên gánh hai phần khác nhau:
  //  (i) vắng khoá  → đường đọc-cũ CÓ CỜ, KHÔNG chặn (hồ sơ đời trước; fail-CLOSED
  //      ở đây làm một hồ sơ ĐÃ KÝ hoá «hỏng» ngược — đo được ở lượt sửa này);
  //  (ii) khoá khai KHÁC vật → VIOLATION «lời khai lệch vật» (hồ sơ MỚI: khoá do
  //      MÁY tính, nên bên viết trôi khuôn là lộ ngay ở đây);
  //  (iii) cờ ngoRong phải BẬT ở cả hai để bề mặt nói ra được.
  const saiKhuon = '## Trong hợp đồng\n\n- **T kiểu cũ** · severity: high · AC-1\n  chi tiết\n\n## Ngoài hợp đồng\n\n';
  const sCu = core.dieuKienFindings({ findingsText: saiKhuon, ledgerText: '', reportText: baoCao(null) });
  chi.push(`sai khuôn · vắng khoá → clean=${sCu.clean} doiCu=${sCu.doiCu} ngoRong=${sCu.ngoRong}`);
  if (!sCu.clean || !sCu.doiCu || !sCu.ngoRong) return say('CN04', false, 'sai khuon + vang khoa phai la duong doc-cu CO CO', chi);
  // Khoá CÓ mặt: cờ sai-khuôn chạy TRƯỚC phép đối chiếu và nói đúng nguyên nhân.
  // So một con số vô nghĩa (bộ đọc không đọc được vật) với lời khai chỉ sinh
  // thông điệp «lệch vật», tức chỉ người vận hành đi sửa nhầm chỗ.
  const sMoi = core.dieuKienFindings({ findingsText: saiKhuon, ledgerText: '', reportText: baoCao(1) });
  chi.push(`sai khuôn · khoá khai 1 → clean=${sMoi.clean} why="${String(sMoi.why).slice(0, 46)}"`);
  if (sMoi.clean) return say('CN04', false, 'ben viet troi khuon ma khong lo', chi);
  if (!/sai khuôn/.test(String(sMoi.why))) return say('CN04', false, 'why khong neu sai khuon', chi);
  // Và phép đối chiếu VẪN nổ khi vật đọc ĐƯỢC mà lời khai lệch — hai đường tách bạch.
  const lech = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: '', reportText: baoCao(5) });
  chi.push(`đọc được · khoá khai 5 · vật 2 → why="${String(lech.why).slice(0, 40)}"`);
  if (lech.clean || !/lệch vật/.test(String(lech.why))) return say('CN04', false, 'phep doi chieu khong con no khi vat doc duoc', chi);
  // Ô lượt chấm 3 bắt được vì ca THIẾU nó: sai khuôn + khoá khai 0. Bản trước
  // chỉ áp cờ ở nhánh vắng khoá nên ô này ra SẠCH, tức fail-open im lặng.
  const sKhong = core.dieuKienFindings({ findingsText: saiKhuon, ledgerText: '', reportText: baoCao(0) });
  chi.push(`sai khuôn · khoá khai 0 → clean=${sKhong.clean} ngoRong=${sKhong.ngoRong}`);
  if (sKhong.clean) return say('CN04', false, 'sai khuon + khoa 0 van ra SACH — fail-open', chi);
  if (!/sai khuôn/.test(String(sKhong.why))) return say('CN04', false, 'why khong neu sai khuon', chi);
  const ooc2 = req(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
  const co = ooc2.parse(saiKhuon).suspect_empty_in;
  chi.push(`bộ đọc bật cờ ngờ sai khuôn: ${co}`);
  if (!co) return say('CN04', false, 'bo doc KHONG bat co ngo sai khuon', chi);

  for (const [ten, khoa, ng, tr, g2, mongSach, phaiCo] of O) {
    const r = core.dieuKienFindings({ findingsText: rfText(ng, tr), ledgerText: soText(g2), reportText: baoCao(khoa) });
    chi.push(`${ten} → clean=${r.clean}${r.why ? ' why="' + String(r.why).slice(0, 70) + '"' : ''}`);
    if (r.clean !== mongSach) return say('CN04', false, `ô «${ten}» clean=${r.clean}, cho ${mongSach}`, chi);
    if (phaiCo && !String(r.why).includes(phaiCo)) return say('CN04', false, `ô «${ten}» why thiếu "${phaiCo}"`, chi);
    if (r.clean && r.why) return say('CN04', false, `ô «${ten}» sạch mà vẫn có why`, chi);
  }
  say('CN04', true, '', chi);
});

// ══ CN03 — HAI hình dạng THIẾU trên cùng một fixture ══════════════════════
// (1) vắng lib/out-of-contract.cjs · (2) vắng node. Cả hai phải fail-CLOSED và
// nêu đích danh thứ đang thiếu. Một ca, hai vế — đúng vật mà AC-3 mô tả.
def('CN03', () => {
  const chi = [];
  const d = mk('failclosed-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const core = req(path.join(d, 'lib', 'evidence-core.cjs'));
  if (typeof core.dieuKienFindings !== 'function') return say('CN03', false, 'core.dieuKienFindings chua ton tai', chi);
  // Đối chứng dương TRƯỚC: bản sao NGUYÊN VẸN, 2 mục chờ người → không sạch, nêu 2.
  const duong = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`đối chứng dương (bản sao nguyên vẹn): clean=${duong.clean} why="${String(duong.why).slice(0, 60)}"`);
  if (duong.clean || !String(duong.why).includes('2')) return say('CN03', false, 'doi chung duong khong dat', chi);
  // Mũi tiêm: gỡ bộ đọc khỏi một bản sao KHÁC (cache require của Node giữ bản cũ).
  const d2 = mk('failclosed-b-');
  fs.cpSync(path.join(d, 'lib'), path.join(d2, 'lib'), { recursive: true });
  fs.rmSync(path.join(d2, 'lib', 'out-of-contract.cjs'));
  const core2 = req(path.join(d2, 'lib', 'evidence-core.cjs'));
  const r = core2.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`vắng bộ đọc: clean=${r.clean} why="${String(r.why).slice(0, 80)}"`);
  if (r.clean) return say('CN03', false, 'vang bo doc ma van SACH — fail-open', chi);
  if (!String(r.why).includes('out-of-contract.cjs')) return say('CN03', false, 'why khong neu dich danh tep thieu', chi);
  if (!String(r.why).includes('INIT-CI-COPY-LIST')) return say('CN03', false, 'why khong neu duong sua', chi);
  // Ô «khai 0, vật 0» cũng KHÔNG được sạch khi vắng BỘ ĐỌC: có tệp nhưng không
  // có cách đọc nó thì «rỗng» là phỏng đoán. Khác hẳn ca VẮNG TỆP ở CN04 — ở đó
  // không có vật nào nên không có gì để phỏng đoán.
  const r0 = core2.dieuKienFindings({ findingsText: rfText(0, 0), ledgerText: '', reportText: baoCao(0) });
  chi.push(`vắng bộ đọc + khai 0: clean=${r0.clean}`);
  if (r0.clean) return say('CN03', false, 'vang bo doc ma khai 0 van duoc goi la SACH', chi);
  // ── vế (2): vắng node → lưới rơi về nhánh awk và VẪN không gọi là sạch ──
  return ve2VangNode(chi);
});

// ══ CN06 — cửa GHI đọc thẳng VẬT, không đi qua lời khai ═══════════════════
// Đường fail-open của luật thứ bảy (báo cáo vắng khoá → NOTE) chỉ chấp nhận
// được NẾU cửa ghi không dùng khoá đó. Ca này là thứ giữ tiền đề ấy sống.
def('CN06', () => {
  const chi = [];
  const d = mk('cuaghi-');
  const ws = path.join(d, '_acceptance', 'x');
  fs.mkdirSync(ws, { recursive: true });
  const hopDong = [
    '---', 'schema_version: 1', 'slug: x', 'risk_tier: T2',
    'status: verified   # khuôn hợp đồng mang đuôi chú thích; cửa ghi phải chừa nó',
    'approved_by: Người Duyệt', 'approved_at: 2026-09-13',
    'veto_state: mo', 'veto_opened_at: 2026-09-13T00:00:00Z', '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c', '',
  ].join('\n');
  const bcSach = ['---', 'schema_version: 1', 'verdict: PASS', '---', '',
    '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n');
  const chay = () => {
    const r = req('node:child_process').spawnSync(process.execPath,
      [path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs'), '--write', '--root', d, '--slug', 'x'],
      { encoding: 'utf8' });
    return { ma: r.status, err: String(r.stderr || '') + String(r.stdout || '') };
  };
  const dat = () => {
    fs.writeFileSync(path.join(ws, 'contract.md'), hopDong);
    fs.writeFileSync(path.join(ws, 'evidence-report.md'), bcSach);
    fs.writeFileSync(path.join(ws, 'decisions.jsonl'), '');
  };

  // Đối chứng dương TRƯỚC: review-findings RỖNG → ghi được.
  dat();
  fs.writeFileSync(path.join(ws, 'review-findings.md'), '## Trong hợp đồng\n\n## Ngoài hợp đồng\n\n');
  const a = chay();
  const sauA = fs.readFileSync(path.join(ws, 'contract.md'), 'utf8');
  const stA = (/status:\s*(\S+)/.exec(sauA) || [])[1];
  chi.push(`đối chứng dương: mã=${a.ma}, status→${stA}`);
  if (a.ma !== 0 || stA !== 'machine-cleared') return say('CN06', false, `doi chung duong: ma=${a.ma} status=${stA}`, chi);

  // Ô thật: 2 mục chờ người, báo cáo VẮNG khoá findings_open → vẫn phải CHẶN.
  dat();
  fs.writeFileSync(path.join(ws, 'review-findings.md'), rfText(2, 0));
  const truoc = fs.readFileSync(path.join(ws, 'contract.md'));
  const b = chay();
  const sau = fs.readFileSync(path.join(ws, 'contract.md'));
  chi.push(`vắng khoá + 2 mục: mã=${b.ma}, thông điệp="${b.err.trim().split('\n')[0].slice(0, 90)}"`);
  if (b.ma !== 2) return say('CN06', false, `cua ghi di qua loi khai — ma=${b.ma}, cho 2`, chi);
  if (!b.err.includes('2')) return say('CN06', false, 'thong diep khong neu so muc', chi);
  if (!truoc.equals(sau)) return say('CN06', false, 'da GHI DIA du bi chan', chi);

  // Ô ba: dòng sổ định đoạt KHÔNG mở cửa ghi (owner duyệt 13/09 — bỏ phép trừ).
  // Mục còn trong tệp là mục còn chờ người; đường đúng để đóng là chữ ký, không
  // phải một dòng sổ. Ô này ghim CHÍNH chỗ định nghĩa vừa đổi.
  dat();
  fs.writeFileSync(path.join(ws, 'review-findings.md'), rfText(2, 0));
  fs.writeFileSync(path.join(ws, 'decisions.jsonl'), soText(2));
  const c = chay();
  const stC = (/status:\s*(\S+)/.exec(fs.readFileSync(path.join(ws, 'contract.md'), 'utf8')) || [])[1];
  chi.push(`2 mục + 2 dòng sổ gate2: mã=${c.ma}, status→${stC}`);
  if (c.ma !== 2 || stC !== 'verified') return say('CN06', false, `dong so van mo duoc cua ghi: ma=${c.ma} status=${stC}`, chi);
  // Ô bốn: dọn HẾT mục thì cửa ghi mở lại — chứng rằng chốt không phải cửa chết.
  dat();
  fs.writeFileSync(path.join(ws, 'review-findings.md'), '## Trong hợp đồng\n\n## Ngoài hợp đồng\n\n');
  const e = chay();
  const stE = (/status:\s*(\S+)/.exec(fs.readFileSync(path.join(ws, 'contract.md'), 'utf8')) || [])[1];
  chi.push(`dọn hết mục: mã=${e.ma}, status→${stE}`);
  if (e.ma !== 0 || stE !== 'machine-cleared') return say('CN06', false, 'don het muc ma cua ghi van dong — cua chet', chi);

  say('CN06', true, '', chi);
});

// ── kho git fixture cho lưới trước-merge ──────────────────────────────────
// Khuôn dựng chép từ tests/plugins/lan-v.test.mjs (mkGitRepo) — cùng bộ tệp mà
// kho tiêu thụ chép khi acceptance-init. DANH SÁCH lib ở đây nay có
// out-of-contract.cjs: thiếu nó thì điều kiện thứ bảy fail-CLOSED và mọi ca đỏ
// vì HẠ TẦNG chứ không vì vật.
const LIB_CHEP = ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs', 'eval-yaml.cjs', 'lop-nhin-thay.cjs', 'out-of-contract.cjs'];
function khoGit({ slug = 'cn', findings = null, so = '', findingsOpen = null, boLib = [] } = {}) {
  const cp = req('node:child_process');
  const R = mk('cndn-git-');
  const git = (...a) => cp.execFileSync('git', ['-c', 'user.name=cn', '-c', 'user.email=cn@x', '-C', R, ...a],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  fs.mkdirSync(path.join(R, 'src'), { recursive: true });
  fs.mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  fs.mkdirSync(path.join(R, 'lib'), { recursive: true });
  fs.mkdirSync(path.join(R, 'scripts'), { recursive: true });
  git('init', '-q');
  fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
    'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  fs.writeFileSync(path.join(R, 'src', 'app.js'), 'code v1\n');
  for (const f of LIB_CHEP) { if (!boLib.includes(f)) fs.copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f)); }
  fs.copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git('add', '-A'); git('commit', '-qm', 'c1');
  git('branch', 'basepoint');
  fs.writeFileSync(path.join(R, 'src', 'app.js'), 'code v2\n');
  const d = path.join(R, '_acceptance', slug);
  fs.mkdirSync(d, { recursive: true });
  // Hồ sơ làn V: T2, verified, approved_by RỖNG, cửa veto mở có mốc parse được.
  fs.writeFileSync(path.join(d, 'contract.md'), [
    '---', 'schema_version: 1', `slug: ${slug}`, 'risk_tier: T2', 'surfaces: [cli]',
    'status: verified', 'approved_by:', 'approved_at:',
    'veto_state: mo', 'veto_opened_at: 2026-09-13T00:00:00Z', '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c', '',
    '## Out of scope', '', '- x', '',
  ].join('\n'));
  if (findings != null) fs.writeFileSync(path.join(d, 'review-findings.md'), findings);
  if (so) fs.writeFileSync(path.join(d, 'decisions.jsonl'), so);
  git('add', '-A'); git('commit', '-qm', 'c2');
  const c2 = git('rev-parse', 'HEAD').trim();
  fs.writeFileSync(path.join(d, 'evidence-report.md'), [
    '---', 'schema_version: 1', `feature_slug: ${slug}`, 'verdict: PASS',
    'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${c2}`,
    ...(findingsOpen == null ? [] : [`findings_open: ${findingsOpen}`]),
    '---', '', '## Evidence', '', '- E1 exit 0', '',
    '## Known limits', '', '## Ngoài hợp đồng', '',
  ].join('\n'));
  git('add', '-A'); git('commit', '-qm', 'c3');
  return R;
}
function luoi(R, { khongNode = false } = {}) {
  const cp = req('node:child_process');
  const env = { ...process.env }; delete env.PRE_MERGE_BASE;
  // Giả lập «vắng node» mà VẪN có bash/git/awk: PATH hệ thống trần. Trên máy này
  // node sống ở /opt/homebrew/bin và /usr/local/bin, không ở /usr/bin — ca tự
  // kiểm điều đó ngay dưới, nên nó KHÔNG xanh lặng trên máy có /usr/bin/node.
  if (khongNode) env.PATH = '/usr/bin:/bin';
  const r = cp.spawnSync('bash', [path.join(ROOT, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint'],
    { encoding: 'utf8', env });
  return { ma: r.status, out: (r.stdout || '') + '\n' + (r.stderr || '') };
}
const dongCua = (out, loai, slug) => (out.split('\n').filter(l => l.startsWith(`${loai} [${slug}]`)));

// ══ CN01 — hai bản dựng, CÙNG một lý do ═══════════════════════════════════
def('CN01', () => {
  const chi = [];
  const core = req(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  // Đối chứng dương TRƯỚC: hồ sơ làn V sạch → lưới KHÔNG chặn slug này.
  const rSach = khoGit({ findings: '## Trong hợp đồng\n\n## Ngoài hợp đồng\n\n', findingsOpen: 0 });
  const oSach = luoi(rSach);
  chi.push(`đối chứng dương: VIOLATION=${dongCua(oSach.out, 'VIOLATION', 'cn').length}`);
  if (dongCua(oSach.out, 'VIOLATION', 'cn').length) {
    return say('CN01', false, `ho so sach ma bi chan: ${dongCua(oSach.out, 'VIOLATION', 'cn')[0].slice(0, 130)}`, chi);
  }
  // Ô thật: 2 mục chờ người, báo cáo KHAI ĐÚNG 2 → cả hai bản dựng phải chặn.
  const rDo = khoGit({ findings: rfText(2, 0), findingsOpen: 2 });
  const oDo = luoi(rDo);
  const vi = dongCua(oDo.out, 'VIOLATION', 'cn');
  chi.push(`bash: ${vi.length} VIOLATION`);
  if (!vi.length) return say('CN01', false, 'ban dung bash KHONG chan ho so con muc cho nguoi', chi);
  const mjs = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: '', reportText: '---\nverdict: PASS\nfindings_open: 2\n---\n' });
  chi.push(`mjs why: "${String(mjs.why).slice(0, 80)}"`);
  // Đo QUAN HỆ: lý do của bash phải CHỨA nguyên văn lý do của mjs — cùng một
  // nguồn chữ, không phải hai câu viết tay giống nhau.
  if (!vi[0].includes(mjs.why)) {
    return say('CN01', false, `hai ban dung noi KHAC nhau — bash: "${vi[0].slice(0, 140)}"`, chi);
  }
  chi.push('lý do bash CHỨA nguyên văn lý do mjs');
  say('CN01', true, '', chi);
});

// ══ CN05 — đường đọc-cũ: NOTE, không VIOLATION ════════════════════════════
def('CN05', () => {
  const chi = [];
  // Hồ sơ còn 2 mục nhưng báo cáo VẮNG khoá findings_open → đời trước luật.
  const R = khoGit({ findings: rfText(2, 0), findingsOpen: null });
  const o = luoi(R);
  const vi = dongCua(o.out, 'VIOLATION', 'cn');
  const note = dongCua(o.out, 'NOTE', 'cn');
  chi.push(`VIOLATION=${vi.length} NOTE=${note.length}`);
  if (vi.length) return say('CN05', false, `doc-cu ma van VIOLATION: ${vi[0].slice(0, 130)}`, chi);
  const hop = note.filter(l => l.includes('mục chờ người'));
  chi.push(hop.length ? `NOTE: "${hop[0].slice(0, 130)}"` : '(không NOTE nào nói về mục chờ người)');
  if (!hop.length) return say('CN05', false, 'khong co NOTE nao neu so muc cho nguoi', chi);
  if (!/\b2\b/.test(hop[0])) return say('CN05', false, 'NOTE khong neu SO muc', chi);
  // Và hồ sơ VẮNG HẲN tệp rà soát cũng không được chặn (41% hồ sơ thật ở dạng này).
  const R2 = khoGit({ findings: null, findingsOpen: null });
  const o2 = luoi(R2);
  chi.push(`vắng hẳn tệp: VIOLATION=${dongCua(o2.out, 'VIOLATION', 'cn').length}`);
  if (dongCua(o2.out, 'VIOLATION', 'cn').length) return say('CN05', false, 'vang han tep ma bi chan', chi);
  say('CN05', true, '', chi);
});

// vế (2) của CN03 — vắng node thì fail-CLOSED CÓ TÊN.
function ve2VangNode(chi) {
  const R = khoGit({ findings: rfText(2, 0), findingsOpen: 2 });
  // Đối chứng dương TRƯỚC: có node → chặn có tên.
  const co = luoi(R);
  chi.push(`có node: VIOLATION=${dongCua(co.out, 'VIOLATION', 'cn').length}`);
  if (!dongCua(co.out, 'VIOLATION', 'cn').length) return say('CN03', false, 'doi chung duong: co node ma khong chan', chi);
  // Tự kiểm PATH giả lập: phải KHÔNG có node mà VẪN có bash — không thì ca này
  // xanh/đỏ vì lý do khác hẳn thứ nó đi đo.
  const cp2 = req('node:child_process');
  const coNode = cp2.spawnSync('sh', ['-c', 'command -v node'], { encoding: 'utf8', env: { PATH: '/usr/bin:/bin' } });
  const coBash = cp2.spawnSync('sh', ['-c', 'command -v bash'], { encoding: 'utf8', env: { PATH: '/usr/bin:/bin' } });
  chi.push(`PATH giả lập: node=${(coNode.stdout || '').trim() || '(không có)'} bash=${(coBash.stdout || '').trim() || '(không có)'}`);
  if ((coNode.stdout || '').trim()) return say('CN03', false, 'PATH gia lap VAN co node — ca khong do duoc thu no di do', chi);
  if (!(coBash.stdout || '').trim()) return say('CN03', false, 'PATH gia lap khong co bash — luoi khong chay duoc', chi);
  // Vắng node: lưới vẫn phải KHÔNG gọi hồ sơ này là sạch.
  const khong = luoi(R, { khongNode: true });
  const sachGia = /xanh-sạch — máy đi tiếp/.test(khong.out) && dongCua(khong.out, 'NOTE', 'cn').some(l => /xanh-sạch/.test(l));
  chi.push(`vắng node: sạch-giả=${sachGia}`);
  if (sachGia) return say('CN03', false, 'vang node ma van goi la xanh-sach', chi);
  const neuTen = /thiếu node|không chấm được|out-of-contract\.cjs|INIT-CI-COPY-LIST/.test(khong.out);
  chi.push(`vắng node: nêu đích danh thứ thiếu=${neuTen}`);
  if (!neuTen) return say('CN03', false, 'vang node ma khong neu dich danh thu thieu', chi);
  return say('CN03', true, '', chi);
}

// ── ba hình dạng NGUYÊN VĂN từ hợp đồng thật ──────────────────────────────
// Chép CHUỖI vào đây, KHÔNG đọc tệp thật lúc chạy: hồ sơ đã ký là sử liệu, và
// một ca đọc chúng sẽ đổi màu khi kho đổi, tức đo kho chứ không đo bộ bóc.
const THAT_CRM = '### AC-1 — Ở kho này, job không chạy — đo bằng số GitHub trả về';   // crm/auto-pr-thoi-do-o-ban-re
const THAT_AP  = '### AC-2 — Google Contacts một-cú-bấm';                             // artifact-platform/customer-segment-foundation
const THAT_KIT = '### AC-1 (bộ giải) — bóc nháy chỉ khi nháy CÂN và đúng một cặp vỏ'; // kit/release-2-11-0

const hopDong = (than, muc = 'Criteria') => ['---', 'schema_version: 1', 'slug: x', '---', '', `## ${muc}`, '', than, '', '## Out of scope', '', '- x', ''].join('\n');

// ══ CN07 — ma trận 12 hình dạng khai báo ══════════════════════════════════
def('CN07', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN07', false, 'lib.parseACBlock chua ton tai', chi);
  // [tên ô, thân, id mong đợi, chữ phải có trong gwt của id đó, judgment, crossLayer]
  const O = [
    ['tiêu đề · thân nhiều dòng', '### AC-1 — nhãn một\n\nGiven a\n\nWhen b\n\nThen c', 'AC-1', 'When b', false, false],
    ['tiêu đề · thân một dòng', '### AC-2 — nhãn hai\nGiven a, When b, Then c', 'AC-2', 'Then c', false, false],
    ['tiêu đề · (judgment) ở nhãn', '### AC-3 (judgment) — cần mắt người\nGiven a, When b, Then c', 'AC-3', 'cần mắt người', true, false],
    ['tiêu đề · (cross-layer) ở nhãn', '### AC-4 (cross-layer) — xuyên lớp\nGiven a, When b, Then c', 'AC-4', 'xuyên lớp', false, true],
    ['tiêu đề · tag ở THÂN', '### AC-5 — nhãn năm\nGiven a, When b, Then c (cross-layer)', 'AC-5', 'Then c', false, true],
    ['tiêu đề · tag trong code span KHÔNG tính', '### AC-6 — nhãn sáu\nGiven hồ sơ giải thích `(cross-layer)` cho người mới, When b, Then c', 'AC-6', 'người mới', false, false],
    ['tiêu đề có dấu đậm', '### **AC-8** — nhãn tám\nGiven a, When b, Then c', 'AC-8', 'nhãn tám', false, false],
    ['tiêu đề kế CẮT thân', '### AC-9 — nhãn chín\nGiven a\n### AC-10 — nhãn mười\nGiven b, When c, Then d', 'AC-9', 'nhãn chín', false, false],
    ['gạch đầu dòng LẪN tiêu đề', '- AC-11: Given a, When b, Then c\n\n### AC-12 — nhãn mười hai\nGiven d, When e, Then f', 'AC-11', 'When b', false, false],
    ['ca thật crm', THAT_CRM + '\nGiven commit đã đẩy, When chạy lệnh, Then số trả về là 0', 'AC-1', 'job không chạy', false, false],
    ['ca thật ap', THAT_AP + '\nGiven tenant đã nối, When bấm nhập, Then danh bạ kéo về', 'AC-2', 'một-cú-bấm', false, false],
  ];
  const boc = (than) => {
    const m = new Map();
    for (const a of lib.parseACBlock(hopDong(than))) if (!m.has(a.id)) m.set(a.id, a);
    return m;
  };
  const lech = [];
  for (const [ten, than, id, chu, jg, xl] of O) {
    const m = boc(than);
    const a = m.get(id);
    if (!a) { lech.push(`${ten}: KHÔNG ra ${id}`); continue; }
    if (!a.gwt.includes(chu)) lech.push(`${ten}: gwt thiếu "${chu}" (gwt="${a.gwt.slice(0, 60)}")`);
    if (a.judgment !== jg) lech.push(`${ten}: judgment=${a.judgment} cho ${jg}`);
    if (a.crossLayer !== xl) lech.push(`${ten}: crossLayer=${a.crossLayer} cho ${xl}`);
  }
  // Trộn hai cách khai theo CẢ HAI THỨ TỰ. Ô cũ chỉ có «gạch trước, tiêu đề sau»
  // nên lượt chấm 3 bắt được chiều ngược: gạch đầu dòng đứng SAU một tiêu đề bị
  // nuốt vào thân của tiêu chí phía trên, mất hẳn khỏi mọi bề mặt.
  for (const [ten, than, mong] of [
    ['tiêu đề → gạch → tiêu đề', '### AC-1 — một\nGiven a, When b, Then c\n\n- AC-2: Given d, When e, Then f\n\n### AC-3 — ba\nGiven g, When h, Then i', 'AC-1,AC-2,AC-3'],
    ['gạch → tiêu đề', '- AC-1: Given a, When b, Then c\n\n### AC-2 — hai\nGiven d, When e, Then f', 'AC-1,AC-2'],
  ]) {
    const ra = lib.parseACBlock(hopDong(than)).map(a => a.id).join(',');
    chi.push(`${ten} → ${ra}`);
    if (ra !== mong) return say('CN07', false, `tron khuon «${ten}» ra "${ra}", cho "${mong}"`, chi);
  }

  // Ô cấp h2 — dựng ĐÚNG hình dạng đời thật: `## AC-n` là cấu trúc TOP-LEVEL,
  // KHÔNG có mục bao ngoài (media-library/embed-on-approve và 17 hồ sơ khác).
  const h2Doi = ['---', 'schema_version: 1', '---', '', '# Contract — x', '',
    '## AC-7 (nhãn bảy)', 'Given a, When b, Then c', '', '## Known limits', '', '- x', ''].join('\n');
  const mH2 = new Map(lib.parseACBlock(h2Doi).map(a => [a.id, a]));
  if (!mH2.has('AC-7') || !mH2.get('AC-7').gwt.includes('nhãn bảy')) {
    return say('CN07', false, `cap h2 doi that: ${[...mH2.keys()].join(',') || 'khong ra id nao'}`, chi);
  }
  // Ô mục-CÓ-mà-không-chứa-tiêu-chí-nào: phải rơi về quét cả tệp, không nuốt phạm vi.
  const mucRong = ['---', 'schema_version: 1', '---', '', '## Criteria', '',
    'Xem các mục dưới đây.', '', '## AC-8 (nhãn tám)', 'Given a, When b, Then c', ''].join('\n');
  const mMR = lib.parseACBlock(mucRong).map(a => a.id).join(',');
  if (mMR !== 'AC-8') return say('CN07', false, `muc Criteria rong nuot pham vi: ra "${mMR}"`, chi);

  // Hai ô còn lại của ma trận: tham chiếu chéo trong thân, và tiêu chí thân RỖNG.
  const mTc = boc('### AC-13 — nhãn\nGiven a, When b, Then c. Xem thêm **AC-5, AC-9** ở Notes.');
  if (mTc.size !== 1 || !mTc.has('AC-13')) lech.push(`tham chiếu chéo sinh id lạ: ${[...mTc.keys()].join(',')}`);
  const mRong = boc('### AC-14\n\n### AC-15 — có chữ\nGiven a, When b, Then c');
  if (mRong.has('AC-14')) lech.push('tiêu chí thân RỖNG vẫn được tính');
  if (!mRong.has('AC-15')) lech.push('tiêu chí sau tiêu chí rỗng bị mất');
  chi.push(`ma trận 14 ô: ${lech.length ? lech.length + ' lệch' : 'đủ'}`);
  for (const l of lech.slice(0, 4)) chi.push(`  ${l}`);
  if (lech.length) return say('CN07', false, `ma tran lech ${lech.length} o`, chi);
  // Ca thật thứ ba mang nhãn trong ngoặc — ghim riêng vì nó là hình dạng của kit.
  const mKit = boc(THAT_KIT + '\nGiven giá trị scalar, When giải khoá, Then bóc đúng một cặp vỏ');
  const aKit = mKit.get('AC-1');
  if (!aKit || !aKit.gwt.includes('bóc nháy chỉ khi')) return say('CN07', false, 'ca that kit: nhan trong ngoac roi mat chu', chi);
  chi.push('ba ca nguyên văn từ hợp đồng thật: đạt');
  say('CN07', true, '', chi);
});

// ══ CN08 — bốn cách đặt tên mục tiêu chí ══════════════════════════════════
def('CN08', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN08', false, 'lib.parseACBlock chua ton tai', chi);
  const than = '### AC-1 — nhãn một\nGiven a, When b, Then c\n\n### AC-2 — nhãn hai\nGiven d, When e, Then f';
  const dau = (ls) => ls.map(a => `${a.id}|${a.gwt}`).join('\n');
  // Đối chứng dương TRƯỚC: mục tên chuẩn.
  const chuan = dau(lib.parseACBlock(hopDong(than, 'Criteria')));
  chi.push(`## Criteria → ${chuan.split('\n').length} tiêu chí`);
  if (!/AC-1\|/.test(chuan) || !/AC-2\|/.test(chuan)) return say('CN08', false, 'doi chung duong: muc chuan khong ra du id', chi);
  for (const muc of ['Acceptance Criteria', 'Acceptance criteria']) {
    const r = dau(lib.parseACBlock(hopDong(than, muc)));
    chi.push(`## ${muc} → ${r === chuan ? 'BẰNG chuẩn' : 'LỆCH'}`);
    if (r !== chuan) return say('CN08', false, `tieu de muc chua nhan het: "${muc}"`, chi);
  }
  // Ô thứ tư: KHÔNG mục nào → quét cả tệp, vẫn ra đủ id.
  const khongMuc = ['---', 'schema_version: 1', '---', '', than, ''].join('\n');
  const r4 = lib.parseACBlock(khongMuc).map(a => a.id).join(',');
  chi.push(`không mục nào → ${r4}`);
  if (r4 !== 'AC-1,AC-2') return say('CN08', false, `khong muc nao ma ra "${r4}"`, chi);
  say('CN08', true, '', chi);
});

// ══ CN09 — bộ dò điểm mù KHÔNG im trước dạng tiêu đề ══════════════════════
def('CN09', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN09', false, 'lib.parseACBlock chua ton tai', chi);
  const than = [1, 2, 3, 4, 5, 6].map(i => `### AC-${i} — nhãn ${i}\nGiven a, When b, Then c`).join('\n\n');
  const t = hopDong(than);
  // Đối chứng dương TRƯỚC, và đây là vế chống kêu-oan: hợp đồng LÀNH → im.
  const ids = lib.parseACBlock(t).map(a => a.id);
  chi.push(`hợp đồng lành: bóc ${ids.length} tiêu chí`);
  if (ids.length !== 6) return say('CN09', false, `boc ${ids.length} thay vi 6`, chi);
  const lanh = lib.acBlindSpot(t, ids);
  chi.push(`hợp đồng lành → ${lanh === null ? 'IM (đúng)' : 'KÊU OAN: ' + JSON.stringify(lanh)}`);
  if (lanh !== null) return say('CN09', false, 'bo do keu oan tren hop dong lanh', chi);
  // Ô bỏ sót 2/6 → kind short, nêu số 2 và liệt dòng.
  const short = lib.acBlindSpot(t, ids.slice(0, 4));
  chi.push(`bỏ sót 2/6 → ${short ? short.kind : 'null'}`);
  if (!short || short.kind !== 'short') return say('CN09', false, 'bo do van im truoc dang tieu de (short)', chi);
  const vanShort = lib.blindSpotText(short);
  if (!/\b2\b/.test(vanShort) || !short.lines.length) return say('CN09', false, 'van ban khong neu so bo sot hoac khong liet dong', chi);
  // Ô bỏ sót 6/6 → kind blank.
  const blank = lib.acBlindSpot(t, []);
  chi.push(`bỏ sót 6/6 → ${blank ? blank.kind : 'null'}`);
  if (!blank || blank.kind !== 'blank') return say('CN09', false, 'bo do van im truoc dang tieu de (blank)', chi);
  say('CN09', true, '', chi);
});

// ══ CN13 — bốn bên đọc cùng thấy MỘT số ═══════════════════════════════════
// Đo QUAN HỆ: bốn bề mặt chấm cùng một hợp đồng phải ra cùng tập id. Mũi tiêm
// hoàn nguyên ĐÚNG MỘT bên về khuôn hẹp → đúng bên đó lệch, ba bên kia không.
def('CN13', () => {
  const chi = [];
  const cp = req('node:child_process');
  const than = [1, 2, 3, 4, 5].map(i => `### AC-${i} — nhãn ${i}\nGiven a, When b, Then c`).join('\n\n');
  const hd = ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2', 'surfaces: [cli]',
    'status: draft', 'approved_by:', 'approved_at:', '---', '', '## Criteria', '', than, '',
    '## Coverage', '', '- trục: một', '', '## Out of scope', '', '- x', ''].join('\n');
  const ev = ['evals:', ...[1, 2, 3, 4, 5].flatMap(i => [
    `  - id: E${i}`, `    criterion: AC-${i}`, '    executor: script',
    '    cmd: config:executors.script.x', '    expected: x'])].join('\n');

  const dungKho = (root) => {
    const d = path.join(root, '_acceptance', 'x');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    fs.writeFileSync(path.join(d, 'contract.md'), hd);
    fs.writeFileSync(path.join(d, 'evals.yaml'), ev);
    return d;
  };
  // Bốn bên đọc, mỗi bên trả một CON SỐ tiêu chí đọc được.
  const doBon = (agRoot) => {
    const R = mk('cn13-kho-');
    const d = dungKho(R);
    // Bên (1) — bộ bóc: nạp qua tiến trình CON, không require trong tiến trình này.
    // createRequire cache theo đường dẫn, mà bản tiêm nằm ở đường dẫn KHÁC nên
    // không đụng cache; nhưng chạy con vẫn đúng hơn vì nó đo đúng thứ ba bên kia
    // đang chạy — cùng một Node, cùng một lần nạp.
    const rLib = cp.spawnSync(process.execPath, ['-e',
      'const{parseACBlock}=require(process.argv[1]);const fs=require("fs");process.stdout.write(String(parseACBlock(fs.readFileSync(process.argv[2],"utf8")).length))',
      path.join(agRoot, 'lib', 'ac-line.cjs'), path.join(d, 'contract.md')], { encoding: 'utf8' });
    const soLib = /^\d+$/.test(String(rLib.stdout || '').trim()) ? Number(rLib.stdout) : -1;
    if (soLib < 0) chi.push(`  bộ bóc lỗi: ${String(rLib.stderr || '').trim().split('\n')[0].slice(0, 120)}`);
    const the = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
    let soThe = -1;
    try { const j = JSON.parse(the.stdout); soThe = (j.will_do || []).length + (j.wont_do || []).length + (j.judgment || []).length; } catch (_) { /* giữ -1 */ }
    const lint = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'eval-coverage-lint.js'), '--files', path.join(R, '_acceptance', 'x', 'contract.md'), path.join(R, '_acceptance', 'x', 'evals.yaml')], { encoding: 'utf8' });
    // lint không in số tiêu chí; dùng W7 (bộ dò điểm mù) làm đại lượng. Khớp DÒNG
    // CẢNH BÁO `  [nhãn] W7 …`, KHÔNG khớp dòng chú giải cuối output — dòng đó
    // LUÔN in và giải thích cả W1..W8, nên `/W7 /` trần cho kết quả hằng-đúng.
    const lintThieu = /^\s*\[[^\]]*\]\s*W7 /m.test(lint.stdout || '');
    // Báo cáo phải mang BẢNG per-eval: trang bằng chứng chỉ dùng chữ của tiêu chí
    // để chú cho từng dòng eval, nên không có bảng thì nó không đọc tiêu chí nào
    // và phép đo hoá hằng-đúng (đo được ở chính lượt dựng ca này).
    fs.writeFileSync(path.join(R, '_acceptance', 'x', 'evidence-report.md'),
      ['---', 'schema_version: 1', 'feature_slug: x', 'verdict: PASS', 'human_signoff: Ng 2026-09-13', '---', '',
        '| Eval | Criterion | Executor | Verdict |', '|---|---|---|---|',
        ...[1, 2, 3, 4, 5].map(i => `| E${i} | AC-${i} | script | PASS |`), '',
        '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
    // evidence-page GHI RA TỆP rồi in đường dẫn — đọc TỆP, không đọc stdout.
    const trang = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'evidence-page.js'), '--slug', 'x', '--root', R], { encoding: 'utf8' });
    let soTrang = -1;
    try {
      const html = fs.readFileSync(String(trang.stdout || '').trim(), 'utf8');
      // Đếm CHỮ của tiêu chí, không đếm MÃ: mã AC-n cũng nằm trong bảng per-eval
      // của chính báo cáo, nên đếm mã cho kết quả hằng-đúng dù trang không đọc
      // được hợp đồng (đo được ở chính lượt dựng ca này).
      soTrang = (html.match(/nhãn \d+/g) || []).filter((v, i, a) => a.indexOf(v) === i).length;
    } catch (_) { /* giữ -1 */ }
    return { soLib, soThe, lintThieu, soTrang, theMa: the.status, trangMa: trang.status };
  };

  // Đối chứng dương TRƯỚC: cây đang đo — cả bốn bên thấy 5.
  const duong = doBon(ROOT);
  chi.push(`cây đang đo: lib=${duong.soLib} thẻ=${duong.soThe} trang=${duong.soTrang} lint-thiếu=${duong.lintThieu}`);
  if (duong.soLib !== 5) return say('CN13', false, `bo boc ra ${duong.soLib}, cho 5`, chi);
  if (duong.soThe !== 5) return say('CN13', false, `the ra ${duong.soThe}, cho 5 (ma thoat ${duong.theMa})`, chi);
  if (duong.soTrang !== 5) return say('CN13', false, `trang bang chung ra ${duong.soTrang}, cho 5 (ma thoat ${duong.trangMa})`, chi);
  if (duong.lintThieu) return say('CN13', false, 'lint bao doc thieu tren hop dong lanh', chi);

  // CHIỀU ĐỎ: bản sao cây, hoàn nguyên parseACBlock về «chỉ gạch đầu dòng».
  const ban = mk('cn13-tiem-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(ban, 'lib'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'), { recursive: true });
  const f = path.join(ban, 'lib', 'ac-line.cjs');
  const src = fs.readFileSync(f, 'utf8');
  const moc = '    const h = l.match(AC_HEAD);';
  if (src.split(moc).length !== 2) return say('CN13', false, 'mui tiem khong khop dung mot lan', chi);
  fs.writeFileSync(f, src.replace(moc, '    const h = null;'));
  const kt = cp.spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (kt.status !== 0) return say('CN13', false, 'ban tiem khong qua node --check', chi);
  const do_ = doBon(ban);
  chi.push(`bản tiêm: lib=${do_.soLib} thẻ=${do_.soThe} trang=${do_.soTrang} lint-thiếu=${do_.lintThieu}`);
  const lech = [];
  if (do_.soLib === 5) lech.push('lib');
  if (do_.soThe === 5) lech.push('thẻ');
  if (do_.soTrang === 5) lech.push('trang bằng chứng');
  if (!do_.lintThieu) lech.push('lint (W7 không kêu)');
  if (lech.length) return say('CN13', false, `ben KHONG theo bo boc chung: ${lech.join(', ')}`, chi);
  chi.push('cả bốn bên đổi theo mũi tiêm — chúng cùng một nguồn');
  say('CN13', true, '', chi);
});

// ══ CN11 — hai nhánh của răng xuyên lớp trả CÙNG tập id ═══════════════════
// Nhánh node và nhánh awk là hai bản dựng độc lập của cùng một luật. Hợp đồng
// khai tiêu chí bằng TIÊU ĐỀ mà chỉ một nhánh nhận ra Dấu thì hai máy khác nhau
// cho hai câu trả lời về cùng một PR — đúng lớp lỗi hồ sơ này đi đóng.
def('CN11', () => {
  const chi = [];
  const cp = req('node:child_process');
  // Hợp đồng: AC-1 MANG Dấu ở nhãn tiêu đề; evals.yaml KHÔNG có eval backend-effect
  // → răng phải nổ. AC-2 không mang Dấu.
  const hd = ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2', 'surfaces: [api]',
    'status: verified', 'approved_by: Ng', 'approved_at: 2026-09-13', '---', '',
    '## Criteria', '',
    '### AC-1 (cross-layer) — xuyên lớp', 'Given a, When b, Then c', '',
    '### AC-2 — thường', 'Given d, When e, Then f', '',
    '## Out of scope', '', '- x', ''].join('\n');
  const ev = ['evals:', '  - id: E1', '    criterion: AC-1', '    executor: test',
    '    cmd: config:executors.test.x', '    expected: x', '    layer: ui-observed'].join('\n');
  const kho = (khongNode) => {
    const R = mk('cn11-');
    const git = (...a) => cp.execFileSync('git', ['-c', 'user.name=cn', '-c', 'user.email=cn@x', '-C', R, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    fs.mkdirSync(path.join(R, '_acceptance', 'x'), { recursive: true });
    fs.mkdirSync(path.join(R, 'lib'), { recursive: true });
    fs.mkdirSync(path.join(R, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(R, 'src'), { recursive: true });
    git('init', '-q');
    fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "*.md"\n');
    fs.writeFileSync(path.join(R, 'src', 'app.js'), 'v1\n');
    for (const f of LIB_CHEP) fs.copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f));
    fs.copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
    git('add', '-A'); git('commit', '-qm', 'c1'); git('branch', 'basepoint');
    fs.writeFileSync(path.join(R, 'src', 'app.js'), 'v2\n');
    fs.writeFileSync(path.join(R, '_acceptance', 'x', 'contract.md'), hd);
    fs.writeFileSync(path.join(R, '_acceptance', 'x', 'evals.yaml'), ev);
    git('add', '-A'); git('commit', '-qm', 'c2');
    const env = { ...process.env }; delete env.PRE_MERGE_BASE;
    if (khongNode) env.PATH = '/usr/bin:/bin';
    const r = cp.spawnSync('bash', [path.join(ROOT, 'scripts', 'pre-merge-check.sh'), R, '--base', 'basepoint'], { encoding: 'utf8', env });
    return (r.stdout || '') + '\n' + (r.stderr || '');
  };
  const noiXL = (out) => /cross-layer/i.test(out) && /AC-1/.test(out);
  const coNode = kho(false);
  const khongNode = kho(true);
  chi.push(`nhánh node  → nêu AC-1 xuyên lớp: ${noiXL(coNode)}`);
  chi.push(`nhánh awk   → nêu AC-1 xuyên lớp: ${noiXL(khongNode)}`);
  if (!noiXL(coNode)) return say('CN11', false, 'nhanh node KHONG bat duoc Dau o tieu de', chi);
  if (!noiXL(khongNode)) return say('CN11', false, 'nhanh awk KHONG bat duoc Dau o tieu de — hai be mat hai cau tra loi', chi);
  say('CN11', true, '', chi);
});

// ── thẻ: dựng kho rồi rút HTML ────────────────────────────────────────────
// gate: '2' (mặc định, hồ sơ verified) hoặc '1' (hồ sơ draft — khối Độ phủ AC và
// khoá coverage_missing CHỈ có ở thẻ Cổng Phạm vi).
function theCong2({ trong = 0, ngoai = 0, coverage = 'bullet', gate = '2' } = {}) {
  const cp = req('node:child_process');
  const R = mk('cn-the-');
  const d = path.join(R, '_acceptance', 'x');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  const cov = coverage === 'khong' ? []
    : coverage === 'bang' ? ['## Coverage', '', '| Trục | Giá trị |', '|---|---|', '| hình dạng | gạch · bảng |', '| tên mục | Criteria |', '']
    : coverage === 'vanxuoi' ? ['## Coverage', '', 'Quét bằng khuôn ba trục, không gian Core 24 ô.', '']
    : ['## Coverage', '', '- trục hình dạng: gạch · bảng', ''];
  fs.writeFileSync(path.join(d, 'contract.md'), ['---', 'schema_version: 1', 'feature: x', 'slug: x',
    'risk_tier: T2', 'surfaces: [cli]',
    ...(gate === '1' ? ['status: draft', 'approved_by:', 'approved_at:'] : ['status: verified', 'approved_by: Ng', 'approved_at: 2026-09-13']),
    '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c', '', ...cov, '## Out of scope', '', '- x', ''].join('\n'));
  fs.writeFileSync(path.join(d, 'evals.yaml'), 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.x\n    expected: x\n');
  const muc = (n, i) => `- **${n}-${i}**\n  Người dùng thấy gì: người dùng thấy ${n}-${i}\n  file: \`src/${n}${i}.ts\`\n  severity: high\n  Đề xuất: known-limits`;
  fs.writeFileSync(path.join(d, 'review-findings.md'), [
    '## Trong hợp đồng', '', ...Array.from({ length: trong }, (_, i) => muc('trong', i + 1)), '',
    '## Ngoài hợp đồng — người quyết ở Gate 2', '', ...Array.from({ length: ngoai }, (_, i) => muc('ngoai', i + 1)), '',
  ].join('\n'));
  fs.writeFileSync(path.join(d, 'evidence-report.md'), ['---', 'schema_version: 1', 'feature_slug: x',
    'verdict: PENDING-JUDGMENT', 'human_signoff:', `findings_open: ${trong + ngoai}`, '---', '',
    '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R], { encoding: 'utf8' });
  const x = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
  let ex = {}; try { ex = JSON.parse(x.stdout); } catch (_) { /* giữ rỗng */ }
  return { html: r.stdout || '', ma: r.status, ex, root: R };
}

// ══ CN10 — thẻ Cổng Bằng chứng hiện lỗi TRONG hợp đồng chưa sửa ═══════════
def('CN10', () => {
  const chi = [];
  // Đối chứng dương TRƯỚC: mục Trong hợp đồng RỖNG → không khối nào, và thẻ nói
  // bằng chứng đầy đủ như hành vi hiện có.
  const duong = theCong2({ trong: 0, ngoai: 1 });
  chi.push(`0 mục trong hợp đồng: mã=${duong.ma}, có khối=${/Lỗi TRONG hợp đồng/.test(duong.html)}`);
  if (duong.ma !== 0) return say('CN10', false, `the chet, ma ${duong.ma}`, chi);
  if (/Lỗi TRONG hợp đồng/.test(duong.html)) return say('CN10', false, 'muc rong ma van hien khoi', chi);
  const noiDu = /Bằng chứng đầy đủ/.test(duong.html);
  chi.push(`0 mục: thẻ nói «Bằng chứng đầy đủ» = ${noiDu}`);

  // Ô thật: 2 mục trong hợp đồng chưa sửa.
  const r = theCong2({ trong: 2, ngoai: 1 });
  chi.push(`2 mục: có khối=${/Lỗi TRONG hợp đồng/.test(r.html)}`);
  if (!/Lỗi TRONG hợp đồng/.test(r.html)) return say('CN10', false, 'the giau loi trong hop dong', chi);
  if (!/Lỗi TRONG hợp đồng[^<]*\(2\)/.test(r.html)) return say('CN10', false, 'khoi khong neu dung so 2', chi);
  // Khối Trong hợp đồng phải đứng TRƯỚC khối Ngoài hợp đồng: nó nặng hơn.
  const iTrong = r.html.indexOf('Lỗi TRONG hợp đồng');
  const iNgoai = r.html.indexOf('Ngoài hợp đồng — bạn quyết');
  chi.push(`vị trí: Trong=${iTrong} Ngoài=${iNgoai}`);
  if (iNgoai >= 0 && iTrong > iNgoai) return say('CN10', false, 'khoi Trong dung SAU khoi Ngoai', chi);
  // Và thẻ thôi khẳng định bằng chứng đầy đủ khi còn mục như vậy.
  if (noiDu && /Bằng chứng đầy đủ/.test(r.html)) return say('CN10', false, 'con loi trong hop dong ma the van noi «Bang chung day du»', chi);
  say('CN10', true, '', chi);
});

// ══ CN15 — thẻ đọc được Coverage dạng BẢNG và văn xuôi ════════════════════
def('CN15', () => {
  const chi = [];
  // Đối chứng dương TRƯỚC: Coverage dạng gạch đầu dòng.
  const g = theCong2({ coverage: 'bullet', gate: '1' });
  chi.push(`gạch đầu dòng: coverage_missing=${g.ex.coverage_missing}`);
  if (g.ex.coverage_missing !== false) return say('CN15', false, 'doi chung duong: dang gach van bao thieu', chi);
  // Ô (1) BẢNG: phải KHÔNG báo thiếu, và khối phải mang chữ của một hàng bảng.
  const b = theCong2({ coverage: 'bang', gate: '1' });
  chi.push(`bảng: coverage_missing=${b.ex.coverage_missing}`);
  if (b.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc BANG', chi);
  if (!/hình dạng/.test(JSON.stringify(b.ex.coverage || []))) return say('CN15', false, 'khoi khong mang chu cua hang bang', chi);
  if (/chưa có section Coverage/.test(b.html)) return say('CN15', false, 'van con co vang «chua co section Coverage» tren muc BANG', chi);
  // Ô (1b) văn xuôi — cùng lớp.
  const v = theCong2({ coverage: 'vanxuoi', gate: '1' });
  chi.push(`văn xuôi: coverage_missing=${v.ex.coverage_missing}`);
  if (v.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc VAN XUOI', chi);
  // Ô (2) VẮNG HẲN: đường cũ KHÔNG được nới theo.
  const k = theCong2({ coverage: 'khong', gate: '1' });
  chi.push(`vắng hẳn: coverage_missing=${k.ex.coverage_missing}, còn cờ vàng=${/chưa có section Coverage/.test(k.html)}`);
  if (k.ex.coverage_missing !== true) return say('CN15', false, 'vang han muc ma khong bao thieu — da noi ca duong cu', chi);
  if (!/chưa có section Coverage/.test(k.html)) return say('CN15', false, 'vang han muc ma co vang bien mat', chi);
  say('CN15', true, '', chi);
});

// ══ CN12 — danh sách chép lớp CI, đo theo BAO ĐÓNG BẮC CẦU ════════════════
// Phép đo sẵn có (CE2 của tests/scripts/consumer-esm.test.mjs) quét tên tệp lib
// xuất hiện TRONG HAI TỆP cưỡng chế. Nó không lần theo require bắc cầu, nên một
// tệp lib nạp từ bên trong một tệp lib khác nằm ngoài tầm. Ở vòng này nó chỉ lọt
// lưới nhờ tên tình cờ nằm trong một câu thông điệp lỗi — gỡ câu đó đi thì nó
// XANH trên một lớp hỏng thật. Ca này đo chỗ trống ấy, và ghim luôn sự khác biệt.
def('CN12', () => {
  const chi = [];
  const cp = req('node:child_process');
  const DO = path.join(ROOT, '_acceptance', 'cong-nguoi-doc-du-nguon', 'do-ban-kinh.cjs');
  const chay = (agRoot) => {
    const r = cp.spawnSync(process.execPath, [DO, '--truc', 'chep', '--ag-root', agRoot, '--json'], { encoding: 'utf8' });
    let j = {}; try { j = JSON.parse(r.stdout); } catch (_) { /* giữ rỗng */ }
    return { ma: r.status, chep: j.chep || {}, err: String(r.stderr || '') };
  };
  // Đối chứng dương TRƯỚC: cây đang đo — không thiếu mục nào, thoát 0.
  const duong = chay(ROOT);
  chi.push(`cây đang đo: khai=${duong.chep.khai} dùng=${duong.chep.dung} thiếu=${(duong.chep.thieu || []).length} mã=${duong.ma}`);
  if (duong.ma !== 0) return say('CN12', false, `doi chung duong thoat ${duong.ma}`, chi);
  if ((duong.chep.thieu || []).length) return say('CN12', false, `cay dang do THIEU: ${duong.chep.thieu.join(', ')}`, chi);
  if (!(duong.chep.batCau || []).includes('lib/out-of-contract.cjs')) {
    return say('CN12', false, 'bao dong bac cau KHONG toi duoc lib/out-of-contract.cjs — phep do khong lan theo require', chi);
  }
  chi.push('bao đóng bắc cầu chạm tới bộ đọc nạp từ BÊN TRONG lõi');

  // Mũi tiêm: gỡ mục khỏi danh sách chép VÀ gỡ tên tệp khỏi thông điệp lỗi, để
  // phép đo không thể bắt được bằng cách dò chuỗi.
  const ban = mk('cn12-tiem-');
  for (const d of ['lib', 'scripts', 'commands']) fs.cpSync(path.join(ROOT, d), path.join(ban, d), { recursive: true });
  const pCmd = path.join(ban, 'commands', 'acceptance-init.md');
  const sCmd = fs.readFileSync(pCmd, 'utf8');
  const reMuc = /\n *- `\$\{CLAUDE_PLUGIN_ROOT\}\/lib\/out-of-contract\.cjs`[^\n]*/;
  if (!reMuc.test(sCmd)) return say('CN12', false, 'khong tim thay muc de go khoi danh sach chep', chi);
  fs.writeFileSync(pCmd, sCmd.replace(reMuc, ''));
  const pSh = path.join(ban, 'scripts', 'pre-merge-check.sh');
  const sSh = fs.readFileSync(pSh, 'utf8');
  const cauCu = '(thiếu node, hoặc lib/evidence-core.cjs + lib/out-of-contract.cjs chưa chép)';
  if (sSh.split(cauCu).length !== 2) return say('CN12', false, 'cau thong diep da doi — mui tiem khong khop dung mot lan', chi);
  fs.writeFileSync(pSh, sSh.replace(cauCu, '(thiếu node, hoặc lớp CI chưa chép đủ)'));
  const kt = cp.spawnSync('bash', ['-n', pSh], { encoding: 'utf8' });
  if (kt.status !== 0) return say('CN12', false, 'ban tiem khong qua bash -n', chi);

  const do_ = chay(ban);
  chi.push(`bản tiêm: thiếu=${JSON.stringify(do_.chep.thieu || [])} mã=${do_.ma}`);
  if (do_.ma === 0) return say('CN12', false, 'go muc khoi danh sach ma phep do van thoat 0', chi);
  if (!(do_.chep.thieu || []).includes('lib/out-of-contract.cjs')) {
    return say('CN12', false, 'phep do khong neu DICH DANH tep thieu', chi);
  }
  say('CN12', true, '', chi);
});

// ══ CN02 — MỘT nguồn: khối bảy điều kiện, hai bản dựng, không bên nào tự duyệt ═
def('CN02', () => {
  const chi = [];
  const cp = req('node:child_process');
  const TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'evidence-report-template.md');
  const MJS = path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs');
  const SH = path.join(ROOT, 'scripts', 'pre-merge-check.sh');

  // (1) khối rút ra ĐÚNG bảy khoá, khoá thứ bảy là `findings`.
  const rutKhoi = (tplText) => {
    const m = tplText.match(/<<<EVIDENCE-XANH-SACH-BLOCK -->\n([\s\S]*?)<!-- EVIDENCE-XANH-SACH-BLOCK>>>/);
    if (!m) return null;
    return m[1].trim().split('\n').map(l => l.trim().split(/\s+/)[0]).filter(Boolean);
  };
  const khoa = rutKhoi(fs.readFileSync(TPL, 'utf8'));
  chi.push(`khối: ${khoa ? khoa.join(' · ') : 'KHÔNG rút được'}`);
  if (!khoa) return say('CN02', false, 'khong rut duoc khoi EVIDENCE-XANH-SACH-BLOCK', chi);
  if (khoa.length !== 7 || khoa[6] !== 'findings') return say('CN02', false, `khoi co ${khoa.length} khoa, cuoi la ${khoa[6]}`, chi);

  // (2) hai thân hàm mỗi bên có ĐÚNG BẢY mốc, ĐÚNG thứ tự khối.
  const than = (src, mo, dong) => { const i = src.indexOf(mo); if (i < 0) return ''; const j = src.indexOf(dong, i); return j < 0 ? src.slice(i) : src.slice(i, j); };
  const mjsThan = than(fs.readFileSync(MJS, 'utf8'), 'export function xanhSach', 'export function khongCanNguoi');
  const shSrc = fs.readFileSync(SH, 'utf8');
  const shThan = (() => { const i = shSrc.indexOf('xanh_sach_check() {'); if (i < 0) return ''; const j = shSrc.indexOf('\n}\n', i); return j < 0 ? '' : shSrc.slice(i, j); })();
  if (!mjsThan || !shThan) return say('CN02', false, 'khong cat duoc than ham — pham vi cat khong co that', chi);
  const mocMjs = ["!== 'PASS'", 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN_RE.test', "'Known limits', 'Ngoài hợp đồng'", 'dieuKienFindings'];
  const mocSh = ['= "PASS"', 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"', 'dieuKienFindings'];
  const thuTu = (src, moc) => moc.map(n => src.indexOf(n));
  const okThuTu = (v) => v.every(x => x >= 0) && v.every((x, i) => i === 0 || x > v[i - 1]);
  const vMjs = thuTu(mjsThan, mocMjs), vSh = thuTu(shThan, mocSh);
  chi.push(`mốc mjs: ${vMjs.join(',')} · mốc bash: ${vSh.join(',')}`);
  if (mocMjs.length !== khoa.length || mocSh.length !== khoa.length) return say('CN02', false, 'so moc != so khoa khoi — thuoc khong phu het khoi', chi);
  if (!okThuTu(vMjs)) return say('CN02', false, 'thu tu bay moc trong xanhSach lech khoi', chi);
  if (!okThuTu(vSh)) return say('CN02', false, 'thu tu bay moc trong xanh_sach_check lech khoi', chi);

  // (3) không bên nào TỰ DUYỆT review-findings.md: tiêu đề mục chỉ được nhắc
  // trong lời gọi vị từ dùng chung, không nằm trong một phép dò riêng.
  const tuDuyet = (src) => (src.match(/Trong hợp đồng/g) || []).length;
  chi.push(`nhắc «Trong hợp đồng» — mjs ${tuDuyet(mjsThan)} · bash ${tuDuyet(shThan)}`);
  if (tuDuyet(mjsThan) || tuDuyet(shThan)) return say('CN02', false, 'mot ban dung TU DUYET review-findings', chi);

  // ── ba mũi tiêm ĐỘC LẬP ──
  const ban = mk('cn02-tiem-');
  for (const d of ['lib', 'scripts', 'skills']) fs.cpSync(path.join(ROOT, d), path.join(ban, d), { recursive: true });
  // (a) gỡ dòng `findings` khỏi khối → khẳng định (1) đỏ
  const tplB = path.join(ban, 'skills', 'acceptance', 'references', 'evidence-report-template.md');
  const tA = fs.readFileSync(tplB, 'utf8');
  const tA2 = tA.replace(/^findings {2,}.*\n/m, '');
  if (tA2 === tA) return say('CN02', false, 'khong go duoc dong findings khoi khoi', chi);
  fs.writeFileSync(tplB, tA2);
  const khoaA = rutKhoi(fs.readFileSync(tplB, 'utf8'));
  chi.push(`mũi (a): khối còn ${khoaA ? khoaA.length : '?'} khoá`);
  if (!khoaA || khoaA.length !== 6) return say('CN02', false, 'mui (a) khong lam khoi tut xuong 6', chi);
  // (b) đảo chỗ hai mốc trong thân mjs → (2) đỏ
  const mjsB = path.join(ban, 'scripts', 'khong-can-nguoi.mjs');
  const sB = fs.readFileSync(mjsB, 'utf8');
  const iA = sB.indexOf("const bp = (frontmatterField(evidenceTxt, 'bypass_used')");
  const iB = sB.indexOf("const enf = (frontmatterField(evidenceTxt, 'enforcement_mode')");
  if (iA < 0 || iB < 0 || iA > iB) return say('CN02', false, 'khong tim duoc hai moc de dao cho', chi);
  const dongA = sB.slice(iA, sB.indexOf('\n', iA)), dongB = sB.slice(iB, sB.indexOf('\n', iB));
  fs.writeFileSync(mjsB, sB.slice(0, iA) + dongB + sB.slice(sB.indexOf('\n', iA), iB) + dongA + sB.slice(sB.indexOf('\n', iB)));
  if (cp.spawnSync(process.execPath, ['--check', mjsB], { encoding: 'utf8' }).status !== 0) return say('CN02', false, 'ban tiem (b) khong qua node --check', chi);
  const thanB = than(fs.readFileSync(mjsB, 'utf8'), 'export function xanhSach', 'export function khongCanNguoi');
  chi.push(`mũi (b): thứ tự mốc còn đúng = ${okThuTu(thuTu(thanB, mocMjs))}`);
  if (okThuTu(thuTu(thanB, mocMjs))) return say('CN02', false, 'dao cho hai moc ma phep do thu tu van XANH', chi);
  // (c) thêm một phép dò riêng vào bản sao pre-merge → (3) đỏ
  const shB = path.join(ban, 'scripts', 'pre-merge-check.sh');
  const sC = fs.readFileSync(shB, 'utf8');
  const neo = 'xanh_sach_check() {';
  fs.writeFileSync(shB, sC.replace(neo, neo + '\n  # MUTANT: tự duyệt thay vì hỏi vị từ\n  grep -c "Trong hợp đồng" "$report" >/dev/null 2>&1'));
  if (cp.spawnSync('bash', ['-n', shB], { encoding: 'utf8' }).status !== 0) return say('CN02', false, 'ban tiem (c) khong qua bash -n', chi);
  const sC2 = fs.readFileSync(shB, 'utf8');
  const thanC = (() => { const i = sC2.indexOf('xanh_sach_check() {'); const j = sC2.indexOf('\n}\n', i); return sC2.slice(i, j); })();
  chi.push(`mũi (c): bash tự duyệt = ${tuDuyet(thanC)} lần`);
  if (!tuDuyet(thanC)) return say('CN02', false, 'mui (c) khong lam phep do tu-duyet do', chi);
  say('CN02', true, '', chi);
});

// ── chạy ──────────────────────────────────────────────────────────────────
const chon = (process.env.CNDN_CASES || '').split(/[,\s]+/).filter(Boolean);
const ids = Object.keys(CASES).filter(id => !chon.length || chon.includes(id));
if (!ids.length) { console.error('CNDN_CASES khop 0 ca'); process.exit(1); }
for (const id of ids) CASES[id]();
console.log(`\nResults: ${ids.length - fails.length} passed, ${fails.length} failed (cong-nguoi-doc-du-nguon)`);
process.exit(fails.length ? 1 : 0);
