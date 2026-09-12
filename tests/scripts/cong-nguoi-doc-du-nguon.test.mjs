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
const soText = (soGate2, soKhac = 0) => {
  const ln = [];
  for (let i = 0; i < soGate2; i++) ln.push(JSON.stringify({ id: `d-x-${i}`, type: 'descope', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: 'x', impact: 'y' }));
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
    ['khoá 0 · 2 mục · 2 định đoạt',   0, 2, 0, 2, true,  ''],
    ['khoá 2 · 2 mục · 2 định đoạt',   2, 2, 0, 2, false, 'lệch'],
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

  for (const [ten, khoa, ng, tr, g2, mongSach, phaiCo] of O) {
    const r = core.dieuKienFindings({ findingsText: rfText(ng, tr), ledgerText: soText(g2), reportText: baoCao(khoa) });
    chi.push(`${ten} → clean=${r.clean}${r.why ? ' why="' + String(r.why).slice(0, 70) + '"' : ''}`);
    if (r.clean !== mongSach) return say('CN04', false, `ô «${ten}» clean=${r.clean}, cho ${mongSach}`, chi);
    if (phaiCo && !String(r.why).includes(phaiCo)) return say('CN04', false, `ô «${ten}» why thiếu "${phaiCo}"`, chi);
    if (r.clean && r.why) return say('CN04', false, `ô «${ten}» sạch mà vẫn có why`, chi);
  }
  say('CN04', true, '', chi);
});

// ══ CN03a — vắng bộ đọc thì fail-CLOSED, nêu đích danh tệp thiếu ═══════════
def('CN03a', () => {
  const chi = [];
  const d = mk('failclosed-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const core = req(path.join(d, 'lib', 'evidence-core.cjs'));
  if (typeof core.dieuKienFindings !== 'function') return say('CN03a', false, 'core.dieuKienFindings chua ton tai', chi);
  // Đối chứng dương TRƯỚC: bản sao NGUYÊN VẸN, 2 mục chờ người → không sạch, nêu 2.
  const duong = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`đối chứng dương (bản sao nguyên vẹn): clean=${duong.clean} why="${String(duong.why).slice(0, 60)}"`);
  if (duong.clean || !String(duong.why).includes('2')) return say('CN03a', false, 'doi chung duong khong dat', chi);
  // Mũi tiêm: gỡ bộ đọc khỏi một bản sao KHÁC (cache require của Node giữ bản cũ).
  const d2 = mk('failclosed-b-');
  fs.cpSync(path.join(d, 'lib'), path.join(d2, 'lib'), { recursive: true });
  fs.rmSync(path.join(d2, 'lib', 'out-of-contract.cjs'));
  const core2 = req(path.join(d2, 'lib', 'evidence-core.cjs'));
  const r = core2.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`vắng bộ đọc: clean=${r.clean} why="${String(r.why).slice(0, 80)}"`);
  if (r.clean) return say('CN03a', false, 'vang bo doc ma van SACH — fail-open', chi);
  if (!String(r.why).includes('out-of-contract.cjs')) return say('CN03a', false, 'why khong neu dich danh tep thieu', chi);
  if (!String(r.why).includes('INIT-CI-COPY-LIST')) return say('CN03a', false, 'why khong neu duong sua', chi);
  // Ô «khai 0, vật 0» cũng KHÔNG được sạch khi vắng BỘ ĐỌC: có tệp nhưng không
  // có cách đọc nó thì «rỗng» là phỏng đoán. Khác hẳn ca VẮNG TỆP ở CN04 — ở đó
  // không có vật nào nên không có gì để phỏng đoán.
  const r0 = core2.dieuKienFindings({ findingsText: rfText(0, 0), ledgerText: '', reportText: baoCao(0) });
  chi.push(`vắng bộ đọc + khai 0: clean=${r0.clean}`);
  if (r0.clean) return say('CN03a', false, 'vang bo doc ma khai 0 van duoc goi la SACH', chi);
  say('CN03a', true, '', chi);
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

  // Ô ba: mục đã được định đoạt ở Cổng Bằng chứng → ghi lại được. Không có ô này
  // thì luật mới biến mọi hồ sơ từng có phát hiện thành không-bao-giờ-ghi-được.
  dat();
  fs.writeFileSync(path.join(ws, 'review-findings.md'), rfText(2, 0));
  fs.writeFileSync(path.join(ws, 'decisions.jsonl'), soText(2));
  const c = chay();
  const stC = (/status:\s*(\S+)/.exec(fs.readFileSync(path.join(ws, 'contract.md'), 'utf8')) || [])[1];
  chi.push(`2 mục + 2 dòng sổ gate2: mã=${c.ma}, status→${stC}`);
  if (c.ma !== 0 || stC !== 'machine-cleared') return say('CN06', false, `dinh doat roi ma van chan: ma=${c.ma}`, chi);

  say('CN06', true, '', chi);
});

// ── chạy ──────────────────────────────────────────────────────────────────
const chon = (process.env.CNDN_CASES || '').split(/[,\s]+/).filter(Boolean);
const ids = Object.keys(CASES).filter(id => !chon.length || chon.includes(id));
if (!ids.length) { console.error('CNDN_CASES khop 0 ca'); process.exit(1); }
for (const id of ids) CASES[id]();
console.log(`\nResults: ${ids.length - fails.length} passed, ${fails.length} failed (cong-nguoi-doc-du-nguon)`);
process.exit(fails.length ? 1 : 0);
