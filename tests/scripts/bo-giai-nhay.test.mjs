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
  // So BẰNG trọn chuỗi, KHÔNG dùng `includes`: giá trị mong đợi là hằng biết
  // trước, nên phép có-mặt một chuỗi con chỉ để lọt mọi sai lệch ngoài đoạn đó
  // (vd off-by-one ở `slice(1,-1)` nuốt mất ký tự đầu vẫn xanh). Lượt chấm 1
  // bắt được; AC-12.
  const MONG = 'cd sdk && uv run --with "x==1" pytest';
  if (pin !== MONG) { do_('BG2', `chuoi ra KHAC hang mong doi:\n      doi  ${JSON.stringify(MONG)}\n      thay ${JSON.stringify(pin)}`); hong++; }
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
    // `"haiku"` là vỏ kép CÂN không escape — mệnh đề CŨ xử y hệt unquoteScalar,
    // nên ô này TRƠ (lượt chấm 1 chứng: hoàn nguyên s4-args vẫn xanh 13/13).
    // Đổi sang vỏ kép CÓ ESCAPE để ô mang tín hiệu thật (AC-12).
    fs.writeFileSync(cfgP, fs.readFileSync(cfgP, 'utf8') + '  models:\n    executor: "hai\\"ku"\n');
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
    ket.push(['7 s4-args models', (r.args.models || {}).executor, 'hai"ku']);
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
  // (d) TÁM đường phải GỌI bộ dùng chung — neo THEO CHỖ GỌI, KHÔNG đếm văn bản.
  // Bản trước đếm `unquoteScalar(` trên nguồn thô, nên một chuỗi THÔNG ĐIỆP
  // `die('… không có unquoteScalar (cần ≥ 2.11.0) …')` cũng được tính: thước
  // nhận dư một đơn vị từ VĂN và dung thứ việc mất MỘT trong bốn chỗ gọi thật
  // (lượt chấm 1 bắt được; AC-12 — đếm MÃ, không đếm VĂN).
  const cpP = path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs');
  const boChuThich = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  const sCore = boChuThich(coreP), sArgs = boChuThich(argsP), sCp = boChuThich(cpP);
  const SRC = new Map([[CORE, sCore], [ARGS, sArgs], [CP, sCp]]);
  const GOI = DUONG.map(d => [d[0], SRC.get(d[1]), d[2]]);
  for (const [ten, src, neo] of GOI)
    if (!src.includes(neo)) { do_('BG6', `duong [${ten}] KHONG con goi bo dung chung — mat neo «${neo}»`); hong++; }
  { // carry-plan cũng phải sạch mệnh đề cũ (đường thứ tám, AC-10)
    const lines = fs.readFileSync(cpP, 'utf8').split('\n');
    const hitCp = [];
    lines.forEach((l, i) => { if (l.trim().startsWith('//')) return; CU_RE.lastIndex = 0; if (CU_RE.test(l)) hitCp.push(i + 1); });
    if (hitCp.length) { do_('BG6', `carry-plan.mjs con ${hitCp.length} menh de cu (dong ${hitCp.join(', ')})`); hong++; }
  }
  if (!hong) xanh('BG6', `ranh gioi va dung bang danh sach dong (${GIU.length} ham giu, ${GOI.length} duong qua CONG CHUNG, 0 khop o s4-args va carry-plan)`);
}

// ─── BG7 — cắt chú thích và tách phẩy phải NHẬN BIẾT VỎ NHÁY ──────────────
// Hồi quy do CHÍNH bản vá này gây ra, S4 lượt 1 bắt được: `unquoteScalar` chỉ
// bóc khi cả chuỗi CÂN, nhưng bên gọi lại tự làm hỏng tính cân TRƯỚC khi đưa
// vào — `replace(/\s+#.*$/)` xén một scalar hợp lệ có ` #` bên trong vỏ, và
// `split(',')` xẻ ngay giữa vỏ. Mảnh còn lại không cân nên trả về NGUYÊN VĂN
// kèm dấu nháy MỞ, rồi `bash -c '"echo a'` thoát 2 — đúng chuỗi xanh-giả bốn
// bước mà vòng này tồn tại để đóng, chỉ đổi nguồn gây nháy-không-cân từ NGƯỜI
// VIẾT sang CHÍNH BỘ GIẢI. Mệnh đề cũ ít ra còn gỡ được ký tự thừa đó.
const BG7_ASSERTS = 13;
function bg7() {
  const cfg = [
    'bg7:',
    '  vo_kep_co_thang: "echo a # b"',
    '  vo_don_co_thang: \'x # y\'',
    '  tran_co_thang: echo a # b',
    '  vo_kep_roi_chu_thich: "echo a"   # ghi chu that',
    '  vo_kep_co_escape_va_thang: "echo \\"a # b\\" done"',
    '  inline: [plain, "a, b", z]',
    '  inline_thang: ["click #submit", "then b"]',   // hình dạng làm nổ lượt chấm 2
    '  hong_khong_dong: [x, y',                     // `[` không đóng — phải fail-CLOSED
    '  hong_dong_trong_vo: ["a]b", c',              // `]` chỉ có bên trong vỏ
    '  khoi:',
    '    - "cd x # y"',
    '    - "p, q"',
  ].join('\n') + '\n';
  const ca = [
    ['vo_kep_co_thang', core.resolveConfigKey(cfg, 'bg7.vo_kep_co_thang'), 'echo a # b'],
    ['vo_don_co_thang', core.resolveConfigKey(cfg, 'bg7.vo_don_co_thang'), 'x # y'],
    ['tran_co_thang', core.resolveConfigKey(cfg, 'bg7.tran_co_thang'), 'echo a'],
    ['vo_kep_roi_chu_thich', core.resolveConfigKey(cfg, 'bg7.vo_kep_roi_chu_thich'), 'echo a'],
    ['vo_kep_co_escape_va_thang', core.resolveConfigKey(cfg, 'bg7.vo_kep_co_escape_va_thang'), 'echo "a # b" done'],
  ];
  const inline = core.resolveConfigList(cfg, 'bg7.inline');
  ca.push(['inline[1] phay trong vo', inline[1], 'a, b']);
  ca.push(['inline dai', String(inline.length), '3']);
  const khoi = core.resolveConfigList(cfg, 'bg7.khoi');
  ca.push(['khoi[0] thang trong vo', khoi[0], 'cd x # y']);
  ca.push(['khoi[1] phay trong vo', khoi[1], 'p, q']);
  // Hình dạng đã tái mở chuỗi xanh-giả ở lượt chấm 2: `#` bên trong vỏ, Ở
  // NHÁNH INLINE. Bản trước chỉ thử `#` ở nhánh KHỐI nên ma trận xanh mà lỗ
  // vẫn sống — đúng lớp AC-12 sinh ra để chặn.
  const it = core.resolveConfigList(cfg, 'bg7.inline_thang');
  ca.push(['inline thang trong vo [0]', it[0], 'click #submit']);
  ca.push(['inline thang trong vo dai', String(it.length), '2']);
  // `[` không đóng thì KHÔNG được đoán: trả [] (fail-CLOSED) chứ không tách bừa.
  ca.push(['ngoac khong dong -> fail-CLOSED', JSON.stringify(core.resolveConfigList(cfg, 'bg7.hong_khong_dong')), '[]']);
  ca.push(['] chi trong vo -> fail-CLOSED', JSON.stringify(core.resolveConfigList(cfg, 'bg7.hong_dong_trong_vo')), '[]']);
  if (ca.length !== BG7_ASSERTS) { do_('BG7', `so khang dinh ${ca.length} != BG7_ASSERTS ${BG7_ASSERTS} khai truoc`); return; }
  let hong = 0;
  for (const [ten, thay, mong] of ca) {
    if (thay !== mong) { do_('BG7', `[${ten}]: doi ${JSON.stringify(mong)}, thay ${JSON.stringify(thay)}`); hong++; }
  }
  // Chân cuối: chuỗi ra phải CHẠY ĐƯỢC — không vỡ cú pháp. Đây là chỗ nối
  // thẳng sang chuỗi xanh-giả: mã 2 của shell không được phép sinh ra ở đây.
  const val = core.resolveConfigKey(cfg, 'bg7.vo_kep_co_thang');
  const r = spawnSync('bash', ['-c', `${val} >/dev/null 2>&1`], { encoding: 'utf8' });
  if (r.status === 2) { do_('BG7', `chuoi giai ra vo cu phap: bash -c thoat 2 tren ${JSON.stringify(val)} — dung chuoi xanh-gia vong nay dong`); hong++; }
  if (!hong) xanh('BG7', `cat chu thich va tach phay nhan biet vo nhay (${BG7_ASSERTS} khang dinh + chan chay-duoc)`);
}

// ─── BG9 — carry-plan và s4-args phải ĐỒNG Ý về CÙNG trường `paths:` ──────
// Đo HỆ QUẢ, không so chuỗi: `paths` ở carry-plan biến thành glob quyết eval
// nào được CARRY-FORWARD. Nếu bộ đọc của nó mangle đường dẫn, glob không khớp
// file nào → eval được mang màu xanh cũ sang lượt mới dù file thật ĐÃ đổi. Đó
// là chiều FAIL-OPEN, nên ca này khẳng định đúng quyết định carry chứ không
// khẳng định một chuỗi bằng nhau (AC-10).
function bg9() {
  const duong = 'src/§"E7 — render thật".js';   // hình dạng vỏ kép có escape, lấy từ bán kính artifact-platform
  const d = mkTmp('bg9-ws-'); const slug = 'ca-carry';
  fs.mkdirSync(path.join(d, '_acceptance', slug), { recursive: true });
  fs.writeFileSync(path.join(d, '_acceptance', slug, 'contract.md'),
    '---\nschema_version: 1\nrisk_tier: T2\nstatus: implemented\n---\n\n## Criteria\n\n### AC-1\n\nGiven x When y Then z\n');
  fs.writeFileSync(path.join(d, '_acceptance', slug, 'evals.yaml'),
    'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: echo ok\n'
    + `    paths: ["${duong.replace(/"/g, '\\"')}"]\n`);
  fs.writeFileSync(path.join(d, '_acceptance', slug, 'run-log.jsonl'),
    JSON.stringify({ ts: 't', sha: 'a'.repeat(40), round: 1, evalId: 'E1', run_id: 'r-1', exit_code: 0, verified_at: 'x', cmd: 'echo ok' }) + '\n');
  const chay = (delta) => {
    const r = spawnSync(process.execPath, [
      path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs'),
      '--run-log', path.join(d, '_acceptance', slug, 'run-log.jsonl'),
      '--evals', path.join(d, '_acceptance', slug, 'evals.yaml'),
      '--contract', path.join(d, '_acceptance', slug, 'contract.md'),
      '--round', '2', '--ag-root', ROOT,
      ...(delta ? ['--delta-files', delta] : ['--no-delta']),
    ], { encoding: 'utf8' });
    if (r.status !== 0) return { err: `carry-plan exit ${r.status}: ${String(r.stderr || '').split('\n').filter(Boolean).pop()}` };
    try { return { j: JSON.parse(r.stdout) }; } catch (e) { return { err: `stdout khong phai JSON: ${e.message}` }; }
  };
  let hong = 0;
  // (a) bản sửa CHẠM đúng đường đó → PHẢI chạy lại, KHÔNG được carry.
  const A = chay(duong);
  if (A.err) { do_('BG9', `[cham dung duong] ${A.err}`); hong++; }
  else {
    const daCarry = (A.j.carriedEvals || []).some(e => e.id === 'E1');
    if (daCarry) { do_('BG9', `[cham dung duong] E1 VAN duoc carry — bo doc paths cua carry-plan mangle duong dan nen glob khong khop file nao (FAIL-OPEN: mang mau xanh cu sang luot moi du file that da doi)`); hong++; }
    else if (!(A.j.rerun || []).includes('E1')) { do_('BG9', `[cham dung duong] E1 khong nam trong rerun: ${JSON.stringify(A.j.rerun)}`); hong++; }
  }
  // (b) ĐỐI CHỨNG DƯƠNG: bản sửa chạm đường KHÁC → carry là ĐÚNG.
  const B = chay('src/khac.js');
  if (B.err) { do_('BG9', `[cham duong khac] ${B.err}`); hong++; }
  else if (!(B.j.carriedEvals || []).some(e => e.id === 'E1')) {
    do_('BG9', `[cham duong khac] E1 KHONG duoc carry — doi chung duong hong, ve (a) mat y nghia`); hong++;
  }
  if (!hong) xanh('BG9', 'carry-plan va s4-args dong y ve paths (2 chieu tren cung fixture)');
}

// ─── BG8 — MỌI ô của ma trận phải PHÂN BIỆT ĐƯỢC ─────────────────────────
// Hoàn nguyên ĐÚNG MỘT đường về mệnh đề cũ trên bản sao trọn cây, rồi đòi đúng
// (các) khẳng định của đường đó ĐỎ. Lượt chấm 1 đo được hai ô TRƠ — ô «đường 7
// (models)» xanh đủ 13/13 kể cả khi hoàn nguyên s4-args, và phép đếm của BG6
// dung thứ việc mất một chỗ gọi. Một thước không phân biệt được bản vá với bản
// chưa vá thì màu xanh của nó không nói gì (AC-12).
//
// Đường 6 (`id`) CỐ Ý không có trong danh sách: nó là LƯỚI HỒI QUY, bản vá ở
// đó là hợp nhất lớp và không đổi hành vi — xem Out of scope của hợp đồng.
const CORE = ['lib', 'evidence-core.cjs'], ARGS = ['feature-loop', 'scripts', 's4-args.mjs'], CP = ['feature-loop', 'scripts', 'carry-plan.mjs'];

// ─── MỘT BẢNG ĐƯỜNG, ba chân tiêu thụ ────────────────────────────────────
// `neo` = chuỗi NGUYÊN VĂN tại chỗ gọi cổng chung · `cu` = mệnh đề ad-hoc đời
// trước để hoàn nguyên (null = đường không đột biến được) · `chan` = chân nào
// phải ĐỎ khi hoàn nguyên đường đó.
//   BG6 kiểm mọi `neo` còn có mặt · BG8 hoàn nguyên mọi đường có `cu` ·
//   BG5 hoàn nguyên ba đường của evidence-core cùng lúc.
// Trước đó ba chân giữ BA bản danh sách và chúng trôi khỏi nhau HAI lần trong
// cùng một vòng (BG5 đỏ vì neo đổi, rồi BG6 đỏ vì mã đổi mà neo không đổi) —
// đúng lớp «bên VIẾT trôi khỏi bên ĐỌC» mà đường A đang áp cho mã sản phẩm.
const DUONG = [
  ['1 resolveConfigKey la', CORE,
   "const pv = parseFlowValue(m[2]);\n        const val = pv.kind === 'seq' ? pv.text : pv.value;",
   "const val = m[2].replace(/\\s+#.*$/, '').trim().replace(/^[\"']|[\"']$/g, '');", 'BG4'],
  ['2 resolveConfigList inline', CORE,
   "if (parseFlowValue(m[2]).kind === 'seq') return parseFlowValue(m[2]).items;",
   "{ const _t = m[2].replace(/\\s+#.*$/, '').trim(); if (_t.startsWith('[')) return _t.replace(/^\\[|\\]$/g, '').split(',').map(s => s.trim().replace(/^[\"']|[\"']$/g, '')).filter(Boolean); }", 'BG4'],
  ['3 resolveConfigList khoi', CORE,
   'out.push(parseFlowValue(m[1]).value)',
   "out.push(m[1].replace(/\\s+#.*$/, '').trim().replace(/^[\"']|[\"']$/g, ''))", 'BG4'],
  ['4 s4-args list field', ARGS,
   'const pv = parseFlowValue(vRaw);',
   "const _v = vRaw.replace(/\\s+#.*$/, '').trim();\n      const pv = _v.startsWith('[') ? { kind: 'seq', items: _v.replace(/^\\[|\\]$/g, '').split(',').map(x => x.trim().replace(/^[\"']|[\"']$/g, '')).filter(Boolean) } : { kind: 's', value: _v };", 'BG4'],
  ['5 s4-args list khoi', ARGS,
   'cur[pendingList].push(parseFlowValue(itemM[1]).value)',
   "cur[pendingList].push(itemM[1].trim().replace(/^[\"']|[\"']$/g, ''))", 'BG4'],
  ['6 s4-args id', ARGS, 'parseFlowValue(idM[1]).value', null, null],
  ['7 s4-args models', ARGS,
   'out[m[1]] = parseFlowValue(m[2]).value',
   "out[m[1]] = m[2].replace(/^[\"']|[\"']$/g, '')", 'BG4'],
  ['8 carry-plan paths', CP,
   'const pv = R.parseFlowValue(f[1]);',
   "const pv = { kind: 'seq', items: f[1].replace(/^\\[|\\]$/g, '').split(',').map(s => s.trim().replace(/^[\"']|[\"']$/g, '')).filter(Boolean) };", 'BG9'],
  ['9 carry-plan cmd', CP, 'cur.cmd = R.parseFlowValue(f[1]).value', null, null],
];
const MUT_ALL = DUONG.filter(d => d[3] !== null).map(d => [d[0], d[1], d[2], d[3], d[4]]);

const BG8_MUTANTS = MUT_ALL.length;   // suy TỪ bảng, không gõ tay
function bg8() {
  if (process.env.BG_NO_RED === '1') { xanh('BG8', 'bo qua trong ban sao (BG_NO_RED=1) — chong de quy'); return; }
  const MUT = MUT_ALL;
  if (MUT.length !== BG8_MUTANTS) { do_('BG8', `so dot bien ${MUT.length} != BG8_MUTANTS ${BG8_MUTANTS} khai truoc`); return; }
  const d = mkTmp('bg8-archive-');
  try {
    const tar = execFileSync('git', ['-C', ROOT, 'archive', 'HEAD'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
  } catch (e) { do_('BG8', `khong dung duoc ban sao tron cay: ${String(e.message).split('\n')[0]}`); return; }
  const tepCa = path.join(d, 'tests', 'scripts', 'bo-giai-nhay.test.mjs');
  if (!fs.existsSync(tepCa) || bam(tepCa) !== bam(path.join(HERE, 'bo-giai-nhay.test.mjs'))) {
    do_('BG8', 'tep ca o HEAD khac ban dang chay — commit truoc khi do phan biet'); return;
  }
  const chay = (chan) => spawnSync(process.execPath, [tepCa], { encoding: 'utf8', env: { ...process.env, BG_NO_RED: '1', BG_ONLY: chan } });
  // ĐỐI CHỨNG DƯƠNG: bản NGUYÊN VẸN phải xanh ở cả hai chân được dùng làm thước.
  const sach = chay('BG4,BG9');
  if (sach.status !== 0) { do_('BG8', `ban sao NGUYEN VEN da do (exit ${sach.status}) — moi phep phan biet duoi vo nghia:\n${String(sach.stderr || '').trim().slice(0, 400)}`); return; }
  let hong = 0;
  for (const [ten, rel, moi, cu, chan] of MUT) {
    const f = path.join(d, ...rel);
    const goc = fs.readFileSync(f, 'utf8');
    if (!goc.includes(moi)) { do_('BG8', `khong tim thay neo [${ten}] — neo doi, o nay khong con do duoc`); hong++; continue; }
    const truoc = bam(f);
    fs.writeFileSync(f, goc.replace(moi, cu));
    if (bam(f) === truoc) { do_('BG8', `DOT BIEN KHONG AP DUOC [${ten}] — bam khong doi`); fs.writeFileSync(f, goc); hong++; continue; }
    const r = chay(chan);
    const err = String(r.stderr || '') + String(r.stdout || '');
    fs.writeFileSync(f, goc);   // hoàn nguyên NGAY, mỗi đột biến đứng một mình
    if (r.status === 0) { do_('BG8', `o [${ten}] TRO — hoan nguyen ve menh de cu ma ${chan} van XANH; mau xanh cua o nay khong noi gi`); hong++; continue; }
    if (!err.includes(`DO ${chan}:`)) { do_('BG8', `o [${ten}] do nhung khong ghim ${chan}`); hong++; continue; }
    console.log(`     [phan biet] ${ten} -> ${chan} DO`);
  }
  if (!hong) xanh('BG8', `moi o cua ma tran phan biet duoc ban va voi ban chua va (${BG8_MUTANTS} dot bien, doi chung duong xanh)`);
}

// ─── BG5 — chiều đỏ trên bản sao TRỌN cây ─────────────────────────────────
// `git archive HEAD` — TRỌN cây, không chép danh sách tệp tay (bài học P150:
// vật được đo gọi thêm một script mới thì bản base thiếu tệp, đỏ vì HẠ TẦNG
// chứ không vì vật).
// Chiều đỏ của BG5 lấy ĐÚNG ba ô evidence-core từ MUT_ALL — một nguồn.
const DOT_BIEN = () => MUT_ALL.filter(m => m[1] === CORE).map(m => [m[0], m[2], m[3]]);
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
  let src = fs.readFileSync(coreP, 'utf8');
  const DB = DOT_BIEN();
  for (const [ten, moi, cu] of DB) {
    if (!src.includes(moi)) { do_('BG5', `khong tim thay neo [${ten}] de tiem nguoc — neo doi, phep do khong con chieu do`); return; }
    src = src.replace(moi, cu);
  }
  fs.writeFileSync(coreP, src);
  if (bam(coreP) === truoc) { do_('BG5', 'DOT BIEN KHONG AP DUOC — bam khong doi, chieu do vo nghia'); return; }

  // (3) Bản bị tiêm phải ĐỎ ở BG1, BG3 VÀ BG4 — ghim đúng tên, không chỉ exit≠0.
  const tiem = chay(d);
  const err = String(tiem.stderr || '') + String(tiem.stdout || '');
  if (tiem.status === 0) { do_('BG5', 'ban BI TIEM van XANH — phep do khong phan biet duoc ban va voi ban hong'); return; }
  const CHAN_DO = ['BG1', 'BG3', 'BG4', 'BG7'];
  const thieu = CHAN_DO.filter(n => !err.includes(`DO ${n}:`));
  if (thieu.length) { do_('BG5', `ban bi tiem do nhung KHONG ghim ${thieu.join(', ')} — chan do khong phu het vat`); return; }
  for (const n of CHAN_DO) console.log(`     [chieu do] ${n} -> DO`);
  xanh('BG5', `chieu do tren ban sao TRON CAY (${DB.length} dot bien, doi chung duong xanh, bam doi, ghim ${CHAN_DO.join('+')})`);
}

// BG_ONLY=<danh sách> chạy đúng các chân được nêu — BG8 dùng nó để chấm từng
// đột biến bằng một chân rẻ thay vì chạy trọn tệp bảy lần.
const CHAN = { BG1: bg1, BG2: bg2, BG3: bg3, BG4: bg4, BG6: bg6, BG7: bg7, BG9: bg9, BG8: bg8, BG5: bg5 };
const chon = String(process.env.BG_ONLY || '').split(',').map(s => s.trim()).filter(Boolean);
if (chon.length) {
  const la = chon.filter(c => !CHAN[c]);
  if (la.length) { console.error(`bo-giai-nhay: BG_ONLY co chan khong ton tai: ${la.join(', ')}`); process.exit(2); }
  for (const c of chon) CHAN[c]();
} else {
  for (const c of Object.keys(CHAN)) CHAN[c]();
}

// ── MỘT lối thoát duy nhất ────────────────────────────────────────────────
if (loi.length) { console.error(`bo-giai-nhay: ${loi.length} ve do`); process.exit(1); }
console.log(`bo-giai-nhay OK (${chon.length ? chon.join('+') : '9 chan'})`);
