#!/usr/bin/env node
// bo-giai-nhay.test.mjs — răng của hồ sơ release-2-11-0.
//
// Vật được đo: MỘT bộ bóc nháy dùng chung (`unquoteScalar`) trên MỌI đường đọc
// giá trị sẽ được THI HÀNH hoặc dùng làm chỉ thị/đường dẫn. Vì sao cần răng:
// mệnh đề cũ `replace(/^["']|["']$/g, '')` là phép thay thế CÓ NEO dạng
// lựa-chọn, gỡ nháy đầu và nháy cuối ĐỘC LẬP nhau — một chuỗi chỉ TÌNH CỜ kết
// thúc bằng nháy vẫn mất ký tự đó, và vì nó chỉ cắt vỏ nên không biết gì về
// escape bên trong vỏ. Hệ quả đo được trên main d1d36479: `pytest -q -k 'a or b'`
// giải ra thiếu dấu đóng → `bash -c` thoát 2 → luật `expected_exit` (ship
// 10/09, cấm [97,127] chứ không cấm 2) đọc mã 2 của SHELL thành «giới hạn đã
// khai» của CÔNG CỤ → PASS. Xanh giả bốn bước.
//
// Sáu chân, mỗi chân in ĐÚNG một dòng `PASS: BG<n> …` khi xanh và một dòng
// `DO BG<n>: …` khi đỏ. MỘT lối thoát duy nhất ở cuối tệp — đừng thêm
// `process.exit` thứ hai ở bất kỳ đâu (bài học P200).
//
// Đường dẫn SUY TỪ VỊ TRÍ TỆP NÀY, không hardcode gốc kho (bài học P150).
// BG5 dựng bản sao bằng `git archive HEAD` TRỌN cây và chạy lại CHÍNH tệp này
// trong bản sao với BG_NO_RED=1 (chống đệ quy).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const require_ = createRequire(import.meta.url);
const core = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const evalYaml = require_(path.join(ROOT, 'lib', 'eval-yaml.cjs'));

const loi = [];
const xanh = (n, m) => console.log(`PASS: ${n} ${m}`);
const do_ = (n, m) => { console.error(`DO ${n}: ${m}`); loi.push(`${n} — ${m}`); };

const tmps = [];
process.on('exit', () => { for (const d of tmps) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} } });
const mkTmp = (p) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), p)); tmps.push(d); return d; };
const bam = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');

// ─── BG1 — bóc nháy chỉ khi CÂN và đúng một cặp vỏ ─────────────────────────
// Ma trận trục B: tám hình dạng một scalar YAML có thể mang nháy. Số dòng
// BG1-M phải BẰNG hằng khai trước — xoá một hình dạng thì phép đo tự tố cáo,
// không tàng hình.
const BG1_M_COUNT = 10;
function bg1() {
  const ca = [
    ['khong-nhay',            'pnpm test -q',                                'pnpm test -q'],
    ['vo-don-can',            "'echo hi'",                                   'echo hi'],
    ['vo-kep-can',            '"echo hi"',                                   'echo hi'],
    ['vo-kep-co-escape',      '"cd sdk && uv run --with \\"x==1\\" pytest"',  'cd sdk && uv run --with "x==1" pytest'],
    ['ket-thuc-bang-nhay',    "pytest -q -k 'a or b'",                       "pytest -q -k 'a or b'"],
    ['bat-dau-bang-nhay',     "'a or b' -k pytest",                          "'a or b' -k pytest"],
    ['hai-dau-khong-mot-cap', '"a" && echo "b"',                             '"a" && echo "b"'],
    ['suy-bien-rong',         '',                                            null],
    ['suy-bien-vo-rong',      '""',                                          null],
    ['suy-bien-mot-ky-tu',    '"',                                           '"'],
  ];
  if (ca.length !== BG1_M_COUNT) { do_('BG1', `so hinh dang ${ca.length} != BG1_M_COUNT ${BG1_M_COUNT} khai truoc`); return; }
  const cfg = 'bg1:\n' + ca.map(([k, v]) => `  ${k}: ${v}`).join('\n') + '\n';
  let hong = 0;
  for (const [ten, , mong] of ca) {
    const thay = core.resolveConfigKey(cfg, `bg1.${ten}`);
    console.log(`     BG1-M: ${ten}`);
    if (thay !== mong) { do_('BG1', `hinh dang [${ten}]: doi ${JSON.stringify(mong)}, thay ${JSON.stringify(thay)}`); hong++; }
  }
  if (!hong) xanh('BG1', `boc nhay chi khi CAN va dung mot cap vo (${BG1_M_COUNT} hinh dang)`);
}

// ─── BG2 — escape trong vỏ nháy kép được gỡ ────────────────────────────────
// Khẳng định là QUAN HỆ trên chuỗi ra (còn dấu chéo ngược nào trước nháy
// không), không phải phép có-mặt của một chuỗi con dễ trúng nhầm.
function bg2() {
  const cfg = [
    'bg2:',
    '  pin: "cd sdk && uv run --with \\"x==1\\" pytest"',
    '  cheo: "a\\\\b"',
  ].join('\n') + '\n';
  const pin = core.resolveConfigKey(cfg, 'bg2.pin');
  const cheo = core.resolveConfigKey(cfg, 'bg2.cheo');
  let hong = 0;
  if (typeof pin !== 'string' || !pin.includes('--with "x==1"')) { do_('BG2', `chuoi ra khong mang dung argv --with "x==1": ${JSON.stringify(pin)}`); hong++; }
  else if (/\\["\\]/.test(pin)) { do_('BG2', `chuoi ra van con dau cheo nguoc truoc nhay: ${JSON.stringify(pin)}`); hong++; }
  if (cheo !== 'a\\b') { do_('BG2', `\\\\ khong go thanh \\: doi ${JSON.stringify('a\\b')}, thay ${JSON.stringify(cheo)}`); hong++; }
  if (!hong) xanh('BG2', 'escape trong vo nhay kep duoc go');
}

// ─── Dựng workspace code-sinh (kho git tối thiểu) ──────────────────────────
// Fixture do CODE sinh trong chính lần chạy — không tệp viết tay nào.
function dungKho({ cmdValue, expectedExit, themEval = '', themCauHinh = '' }) {
  const d = mkTmp('bg-ws-');
  const slug = 'ca-do';
  fs.mkdirSync(path.join(d, '_acceptance', slug), { recursive: true });
  fs.writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\n'
    + 'executors:\n  script:\n    duoi_do: ' + cmdValue + '\n'
    + themCauHinh
    + 'feature_loop:\n  suite_keys: [executors.script.duoi_do]\n');
  fs.writeFileSync(path.join(d, '_acceptance', slug, 'contract.md'),
    '---\nschema_version: 1\nfeature: ca do\nslug: ' + slug + '\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\napproved_by: Ca Do\napproved_at: 2026-09-10\n---\n\n## Criteria\n\n### AC-1\n\nGiven x When y Then z\n');
  fs.writeFileSync(path.join(d, '_acceptance', slug, 'evals.yaml'),
    'evals:\n'
    + '  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.duoi_do\n'
    + (expectedExit == null ? '' : `    expected_exit: ${expectedExit}\n`)
    + '    expected: "ca do"\n'
    + themEval);
  execFileSync('git', ['-C', d, 'init', '-q'], { stdio: 'ignore' });
  execFileSync('git', ['-C', d, 'add', '-A'], { stdio: 'ignore' });
  execFileSync('git', ['-C', d, '-c', 'user.name=Ca Do', '-c', 'user.email=ca@do', 'commit', '-qm', 'nen'], { stdio: 'ignore' });
  return { dir: d, slug };
}

// Chạy CHÍNH s4-args.mjs của cây đang kiểm; trả object args nó SINH RA.
function chayS4Args(ws) {
  const out = path.join(ws.dir, 'args.json');
  const r = spawnSync(process.execPath, [
    path.join(ROOT, 'feature-loop', 'scripts', 's4-args.mjs'),
    '--slug', ws.slug, '--root', ws.dir, '--ag-root', ROOT,
    '--round', '1', '--no-carry', '--diff-base', 'HEAD', '--out', out,
  ], { encoding: 'utf8' });
  if (r.status !== 0) return { err: `s4-args exit ${r.status}: ${String(r.stderr || '').split('\n').filter(Boolean).slice(-2).join(' | ')}` };
  try { return { args: JSON.parse(fs.readFileSync(out, 'utf8')) }; }
  catch (e) { return { err: `khong doc duoc tep args: ${e.message}` }; }
}

// ─── BG3 — chuỗi xanh-giả bốn bước, ROUND-TRIP qua bên VIẾT thật ───────────
// Không mô phỏng: chuỗi lệnh RÚT TỪ tệp args mà chính s4-args.mjs sinh ra, mã
// kỳ vọng đọc bằng chính expectedExits. Công cụ giả GHI MỘT DẤU VẾT ra đĩa —
// dấu vết đó là thứ phân biệt «công cụ thật sự chạy và trả 2» với «shell vỡ cú
// pháp và trả 2», hai thứ mà mã thoát một mình không phân biệt được.
function bg3() {
  const bin = mkTmp('bg-bin-');
  const vet = path.join(bin, 'da-chay.vet');
  const gia = path.join(bin, 'cong-cu-gia.sh');
  fs.writeFileSync(gia, `#!/bin/sh\nprintf 'da chay: %s\\n' "$*" >> "${vet}"\nexit \${BG_FAKE_EXIT:-2}\n`);
  fs.chmodSync(gia, 0o755);

  // Giá trị KHÔNG bọc vỏ nhưng KẾT THÚC bằng nháy — đúng hình dạng gây xanh giả.
  const ws = dungKho({ cmdValue: `${gia} -k 'a or b'`, expectedExit: 2 });
  const r = chayS4Args(ws);
  if (r.err) { do_('BG3', `khong lay duoc chuoi lenh tu ben VIET: ${r.err}`); return; }
  const e1 = (r.args.evals || []).find(e => e.id === 'E1');
  if (!e1 || !e1.cmd) { do_('BG3', 'tep args khong co eval E1 hoac thieu cmd'); return; }

  const { byId, errs } = evalYaml.expectedExits(fs.readFileSync(path.join(ws.dir, '_acceptance', ws.slug, 'evals.yaml'), 'utf8'));
  if (errs.length) { do_('BG3', `expectedExits bao loi tren evals.yaml hop le: ${errs.join(' | ')}`); return; }
  const mong = byId.get('E1');

  let hong = 0;
  for (const [ten, fakeExit, phaiKhop] of [['cong cu tra 2', '2', true], ['cong cu tra 3', '3', false]]) {
    try { fs.rmSync(vet, { force: true }); } catch {}
    const run = spawnSync('bash', ['-c', e1.cmd], { encoding: 'utf8', env: { ...process.env, BG_FAKE_EXIT: fakeExit } });
    const daChay = fs.existsSync(vet);
    if (!daChay) { do_('BG3', `[${ten}] cong cu gia KHONG chay — chuoi lenh vo cu phap truoc khi toi no (ma thoat ${run.status}); ma 2 cua shell dang gia dang lam gioi han da khai`); hong++; continue; }
    const khop = run.status === mong;
    if (khop !== phaiKhop) { do_('BG3', `[${ten}] doi khop=${phaiKhop}, thay ma thoat ${run.status} vs expected_exit ${mong}`); hong++; }
  }
  if (!hong) xanh('BG3', 'chuoi xanh-gia bon buoc da dong (round-trip qua s4-args, cong cu gia de lai dau vet)');
}

// ─── BG4 — ma trận HÀNH VI bảy đường của bảng AC-4 ─────────────────────────
// Ba hình dạng lấy NGUYÊN VĂN từ bán kính đo trên cây thật của kho tiêu thụ
// (crm `steps`, artifact-platform `paths`, artifact-platform `config.yaml`) —
// hình dạng là HÀNG THẬT, không phải hàng dựng cho vừa bên đọc.
const BG4_ASSERTS = 13;
const CRM_STEP = 'Khang dinh <html lang=\\"vi\\"> trong HTML may chu tra ve';
const AP_PATH = 'evidence-report.md §"E7 — render thật"';
const AP_CMD = `bash -c 'for s in PICKER WARN BLOCK; do npx tsx uicheck.ts "$s" http://localhost:3001 || exit 1; done'`;
// Hình dạng B5 — KẾT THÚC bằng nháy mà KHÔNG phải vỏ. Đây là hình dạng đang
// sống ở `executors.script.uicheck_avatar_pool` của artifact-platform và là
// hình dạng sinh ra chuỗi xanh-giả; nó phải chạy trên CẢ đường s4-args, không
// chỉ trên resolveConfigKey (N5 tự-soi 10/09 bắt được chỗ thiếu này).
const B5_LIST = "ends'";
const B5_STEP = 'Bam nut co nhan "Save"';
function bg4() {
  const ket = [];
  // Đường 1 — resolveConfigKey lá (hình dạng NGUYÊN VĂN của artifact-platform).
  {
    const cfg = `bg4:\n  cmd: "${AP_CMD.replace(/"/g, '\\"')}"\n`;
    ket.push(['1 resolveConfigKey la', core.resolveConfigKey(cfg, 'bg4.cmd'), AP_CMD]);
  }
  // Đường 2 — resolveConfigList nhánh inline.
  {
    const cfg = `bg4:\n  inline: [plain, "d\\"e", ends']\n`;
    const v = core.resolveConfigList(cfg, 'bg4.inline');
    ket.push(['2 resolveConfigList inline [0]', v[0], 'plain']);
    ket.push(['2 resolveConfigList inline [1]', v[1], 'd"e']);
    ket.push(["2 resolveConfigList inline [2]", v[2], "ends'"]);
  }
  // Đường 3 — resolveConfigList nhánh khối.
  {
    const cfg = `bg4:\n  khoi:\n    - "cd x && echo \\"y\\""\n    - ends'\n`;
    const v = core.resolveConfigList(cfg, 'bg4.khoi');
    ket.push(['3 resolveConfigList khoi [0]', v[0], 'cd x && echo "y"']);
    ket.push(["3 resolveConfigList khoi [1]", v[1], "ends'"]);
  }
  // Đường 4–7 — s4-args: list inline (`paths`), list khối (`steps`), id, models.
  {
    const ws = dungKho({
      cmdValue: '"echo ok"',
      expectedExit: null,
      themCauHinh: '',
      themEval:
        '  - id: E2\n    criterion: AC-1\n    executor: ui-check\n    expected: "ca do"\n'
        + `    paths: [a.js, "${AP_PATH.replace(/"/g, '\\"')}", ${B5_LIST}]\n`
        + '    steps:\n'
        + `      - "${CRM_STEP}"\n`
        + `      - "${AP_PATH.replace(/"/g, '\\"')}"\n`
        + `      - ${B5_STEP}\n`,
    });
    // models sống trong feature_loop, splice thêm vào config đã sinh.
    const cfgP = path.join(ws.dir, '_acceptance', 'config.yaml');
    fs.writeFileSync(cfgP, fs.readFileSync(cfgP, 'utf8') + '  models:\n    executor: "haiku"\n');
    execFileSync('git', ['-C', ws.dir, 'add', '-A'], { stdio: 'ignore' });
    execFileSync('git', ['-C', ws.dir, '-c', 'user.name=Ca Do', '-c', 'user.email=ca@do', 'commit', '-qm', 'models'], { stdio: 'ignore' });
    const r = chayS4Args(ws);
    if (r.err) { do_('BG4', `s4-args khong sinh duoc args: ${r.err}`); return; }
    const e2 = (r.args.evals || []).find(e => e.id === 'E2');
    if (!e2) { do_('BG4', 'tep args khong co eval E2 — duong 6 (id) hong: id "E2" khong giai duoc'); return; }
    ket.push(['4 s4-args list inline [1] vo kep co escape', (e2.paths || [])[1], AP_PATH]);
    ket.push(['4 s4-args list inline [2] B5 ket-thuc-bang-nhay', (e2.paths || [])[2], B5_LIST]);
    ket.push(['5 s4-args list khoi [0] vo kep co escape', (e2.steps || [])[0], CRM_STEP.replace(/\\"/g, '"')]);
    ket.push(['5 s4-args list khoi [1] vo kep co escape', (e2.steps || [])[1], AP_PATH]);
    ket.push(['5 s4-args list khoi [2] B5 ket-thuc-bang-nhay', (e2.steps || [])[2], B5_STEP]);
    // Đường 6 là LƯỚI HỒI QUY, không phải ca phân biệt: một id BỌC NHÁY hôm
    // nay đã hỏng ở tầng KHÁC — `parseEvals` (lib/eval-yaml.cjs) giữ nguyên
    // `"E2"` trong khi vòng list-field của s4-args bóc thành `E2`, nên mọi
    // list-field của eval đó bị bỏ qua LẶNG. Đó là lỗi thật nhưng NGOÀI hợp
    // đồng vòng này (ghi ở Out of scope + sổ quyết định); bản vá ở đây là hợp
    // nhất lớp, cố ý KHÔNG đổi hành vi đường này.
    ket.push(['6 s4-args id (luoi hoi quy)', e2.id, 'E2']);
    ket.push(['7 s4-args models', (r.args.models || {}).executor, 'haiku']);
  }
  if (ket.length !== BG4_ASSERTS) { do_('BG4', `so khang dinh ${ket.length} != BG4_ASSERTS ${BG4_ASSERTS} khai truoc`); return; }
  let hong = 0;
  for (const [ten, thay, mong] of ket) {
    if (thay !== mong) { do_('BG4', `duong [${ten}]: doi ${JSON.stringify(mong)}, thay ${JSON.stringify(thay)}`); hong++; }
  }
  if (!hong) xanh('BG4', `bay duong thi-hanh tra dung chuoi nguoi viet (${BG4_ASSERTS} khang dinh)`);
}

// ─── BG6 — ranh giới vá bằng HAI danh sách đóng + phép đếm tổng ────────────
// Vá sót thì tổng lớn hơn, vá lan thì tổng nhỏ hơn. Danh sách GIỮ đo được, không
// tin trí nhớ: `isAuthenticVerifier` giữ mệnh đề cũ có lý do CỨNG — biểu thức
// bắt đường dẫn `(\S+\.(py|mjs|js|sh))\b` hút cả nháy MỞ vào chuỗi (`"./v.sh`),
// nên chuỗi nó cầm KHÔNG cân và bóc-theo-cặp sẽ để nguyên dấu nháy.
const GIU = ['extractRunIds', 'extractEvalBlockRunIds', 'walkEvalExits', 'extractVerifierValues', 'isAuthenticVerifier'];
const VA_CORE = ['resolveConfigKey', 'resolveConfigList'];
const CU_RE = /replace\(\s*\/\^\["']\+?\|\["']\+?\$\/g\s*,\s*(?:""|'')\s*\)/g;
function hamChua(lines, i) {
  for (let j = i; j >= 0; j--) {
    const m = lines[j].match(/^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (m) return m[1];
  }
  return '(ngoai ham top-level)';
}
function bg6() {
  const coreP = path.join(ROOT, 'lib', 'evidence-core.cjs');
  const argsP = path.join(ROOT, 'feature-loop', 'scripts', 's4-args.mjs');
  const quet = (p) => {
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    const hit = [];
    // Bỏ qua dòng chú thích: phép đo này đếm MÃ, không đếm VĂN. Chính chú
    // thích của `unquoteScalar` nêu nguyên văn mệnh đề cũ để giải thích vì sao
    // nó sai — đếm nó vào là thước tự bắt lời giải thích của chính mình.
    lines.forEach((l, i) => { if (l.trim().startsWith('//')) return; CU_RE.lastIndex = 0; if (CU_RE.test(l)) hit.push({ dong: i + 1, ham: hamChua(lines, i) }); });
    return hit;
  };
  const hCore = quet(coreP);
  const hArgs = quet(argsP);
  let hong = 0;
  // (a) bảy đường KHÔNG còn mệnh đề cũ.
  for (const h of hCore) if (VA_CORE.includes(h.ham)) { do_('BG6', `duong thi-hanh [${h.ham}] (evidence-core:${h.dong}) VAN con menh de boc-nhay vo dieu kien`); hong++; }
  if (hArgs.length) { do_('BG6', `s4-args.mjs con ${hArgs.length} menh de cu (dong ${hArgs.map(h => h.dong).join(', ')}) — bay duong phai sach`); hong++; }
  // (b) năm hàm cố-ý-giữ VẪN còn.
  const conGiu = new Set(hCore.map(h => h.ham));
  for (const g of GIU) if (!conGiu.has(g)) { do_('BG6', `ham co-y-giu [${g}] MAT menh de cu — va lan ra ngoai ranh gioi da khai`); hong++; }
  // (c) phép đếm tổng — chặn cả hai chiều trôi.
  if (hCore.length !== GIU.length) { do_('BG6', `tong khop trong evidence-core = ${hCore.length}, khai truoc ${GIU.length} (${hCore.map(h => `${h.ham}:${h.dong}`).join(' ')})`); hong++; }
  // (d) bảy đường phải GỌI bộ bóc dùng chung.
  const src = fs.readFileSync(coreP, 'utf8');
  const srcArgs = fs.readFileSync(argsP, 'utf8');
  const demCore = (src.match(/unquoteScalar\s*\(/g) || []).length;
  const demArgs = (srcArgs.match(/unquoteScalar\s*\(/g) || []).length;
  if (demCore < 4) { do_('BG6', `evidence-core goi unquoteScalar ${demCore} lan, can >= 4 (1 dinh nghia + 3 duong)`); hong++; }
  if (demArgs < 4) { do_('BG6', `s4-args goi unquoteScalar ${demArgs} lan, can >= 4 (bon cho)`); hong++; }
  if (!hong) xanh('BG6', `ranh gioi va dung bang danh sach dong (${GIU.length} ham giu, 0 khop o s4-args)`);
}

// ─── BG5 — chiều đỏ trên bản sao TRỌN cây ─────────────────────────────────
// `git archive HEAD` — TRỌN cây, không chép danh sách tệp tay (bài học P150:
// vật được đo gọi thêm một script mới thì bản base thiếu tệp, đỏ vì HẠ TẦNG
// chứ không vì vật).
const MENH_DE_MOI = /const val = unquoteScalar\(m\[2\]\.replace\(\/\\s\+#\.\*\$\/, ''\)\.trim\(\)\);/;
function bg5() {
  if (process.env.BG_NO_RED === '1') { xanh('BG5', 'bo qua trong ban sao (BG_NO_RED=1) — chong de quy'); return; }
  const d = mkTmp('bg-archive-');
  try {
    const tar = execFileSync('git', ['-C', ROOT, 'archive', 'HEAD'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
  } catch (e) { do_('BG5', `khong dung duoc ban sao tron cay: ${String(e.message).split('\n')[0]}`); return; }

  const tepCa = path.join(d, 'tests', 'scripts', 'bo-giai-nhay.test.mjs');
  if (!fs.existsSync(tepCa)) { do_('BG5', 'cay HEAD chua mang tep ca nay — commit truoc khi do chieu do'); return; }
  if (bam(tepCa) !== bam(path.join(HERE, 'bo-giai-nhay.test.mjs'))) { do_('BG5', 'tep ca o HEAD KHAC ban dang chay — chieu do se do mot vat khac; commit truoc'); return; }

  const chay = (root) => spawnSync(process.execPath, [path.join(root, 'tests', 'scripts', 'bo-giai-nhay.test.mjs')],
    { encoding: 'utf8', env: { ...process.env, BG_NO_RED: '1' } });

  // (1) ĐỐI CHỨNG DƯƠNG — bản sao NGUYÊN VẸN phải 0 vế đỏ. Không có nó thì mọi
  //     màu đỏ dưới đây vô nghĩa.
  const sach = chay(d);
  if (sach.status !== 0) { do_('BG5', `ban sao NGUYEN VEN da do (exit ${sach.status}) — moi chieu do duoi vo nghia:\n${String(sach.stderr || '').trim()}`); return; }

  // (2) TIÊM mệnh đề cũ, chứng minh bản sao THẬT SỰ đổi nội dung bằng so BĂM.
  const coreP = path.join(d, 'lib', 'evidence-core.cjs');
  const truoc = bam(coreP);
  const src = fs.readFileSync(coreP, 'utf8');
  if (!MENH_DE_MOI.test(src)) { do_('BG5', 'khong tim thay menh de MOI de tiem nguoc — neo doi, phep do khong con chieu do'); return; }
  fs.writeFileSync(coreP, src.replace(MENH_DE_MOI, "const val = m[2].replace(/\\s+#.*$/, '').trim().replace(/^[\"']|[\"']$/g, '');"));
  if (bam(coreP) === truoc) { do_('BG5', 'DOT BIEN KHONG AP DUOC — bam khong doi, chieu do vo nghia'); return; }

  // (3) Bản bị tiêm phải ĐỎ ở BG1, BG3 VÀ BG4 — ghim đúng tên, không chỉ exit≠0.
  const tiem = chay(d);
  const err = String(tiem.stderr || '') + String(tiem.stdout || '');
  if (tiem.status === 0) { do_('BG5', 'ban BI TIEM van XANH — phep do khong phan biet duoc ban va voi ban hong'); return; }
  const thieu = ['BG1', 'BG3', 'BG4'].filter(n => !err.includes(`DO ${n}:`));
  if (thieu.length) { do_('BG5', `ban bi tiem do nhung KHONG ghim ${thieu.join(', ')} — chan do khong phu het vat`); return; }
  for (const n of ['BG1', 'BG3', 'BG4']) console.log(`     [chieu do] ${n} -> DO`);
  xanh('BG5', 'chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)');
}

bg1(); bg2(); bg3(); bg4(); bg6(); bg5();

// ── MỘT lối thoát duy nhất ────────────────────────────────────────────────
if (loi.length) { console.error(`bo-giai-nhay: ${loi.length} ve do`); process.exit(1); }
console.log('bo-giai-nhay OK (6 chan)');
