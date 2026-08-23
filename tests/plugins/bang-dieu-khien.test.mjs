// tests/plugins/bang-dieu-khien.test.mjs — ca hồ sơ start-bang-dieu-khien (BDK1–BDK4).
// Fixture CODE-SINH trong chính lần chạy, chạy start-scan.mjs THẬT; đường dẫn suy từ vị
// trí file; mỗi ca có đối chứng dương + chiều đỏ ghim thông điệp.
//   BDK_CASES=BDK1,BDK2 node tests/plugins/bang-dieu-khien.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const START_MD = path.join(ROOT, 'commands', 'start.md');
const require = createRequire(import.meta.url);

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
// Chỉ liệt ca ĐÃ CÓ THÂN: khai một id chưa dựng thì `--ids` làm suite đỏ, không
// xanh im lặng. BDK3/BDK4 thêm cùng lượt với thân của chúng.
const ALL_IDS = ['BDK1', 'BDK2', 'BDK3', 'BDK4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.BDK_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [BDK1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const tmp = () => mkdtempSync(path.join(tmpdir(), 'bdk-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const fx = () => { const r = tmp(); W(r, '_acceptance/config.yaml', 'schema_version: 1\n'); return r; };
const scan = (root, script = SCAN) => {
  const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  if (r.status !== 0) return { status: r.status, stderr: r.stderr, groups: {}, broken: [] };
  return JSON.parse(r.stdout);
};

// ── BDK2: bảng trạng-thái→chữ — ma trận TOÀN PHẦN + mọi bộ đọc rút từ bảng ────
if (want('BDK2')) {
  const errs = [];
  let BANG = null;
  try { BANG = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs')); }
  catch (e) { errs.push(`không nạp được bảng: ${e.message}`); }

  if (BANG) {
    // Ma trận TOÀN PHẦN viết TRƯỚC: 20 khoá gõ tay, KHÔNG sinh từ chính bảng.
    // Viết `=== Object.keys(BANG.TRANG_THAI).length` một mình là hằng đúng — cấm.
    const KHOA = ['y-can-nhac', 'cho-cong-dang', 'sap-mo-vong', 'xep-lai', 'da-bac',
      'cho-cong-pham-vi', 'dang-lap-ke-hoach', 'dang-viet-code', 'cho-nghiem-thu-may',
      'dang-sua-theo-bang-chung', 'nghiem-thu-bi-chan', 'cho-cong-bang-chung',
      'may-di-tiep-veto-mo', 'may-di-tiep-xanh-sach', 'da-giao', 'cho-cong-gia-tri',
      'da-nghiem-thu-release', 'da-nghiem-thu-iterate', 'da-nghiem-thu-kill', 'ho-so-hong'];
    const N = 20;
    if (KHOA.length !== N) errs.push(`danh sách ca ${KHOA.length} != ${N}`);
    if (Object.keys(BANG.TRANG_THAI).length !== N)
      errs.push(`bảng khai ${Object.keys(BANG.TRANG_THAI).length} khoá != ${N} — thêm khoá thì thêm ca`);
    // Ô của bản đồ là danh sách ĐÓNG — rút từ chính product-map.mjs lúc chạy, không chép tay
    const pmSrc = readFileSync(path.join(ROOT, 'scripts', 'product-map.mjs'), 'utf8');
    const secBlock = (pmSrc.match(/const SECTIONS = \[([\s\S]*?)\];/) || [])[1] || '';
    const O_BAN_DO = new Set([...secBlock.matchAll(/\['([a-z-]+)',/g)].map(m => m[1]));
    if (O_BAN_DO.size !== 11) errs.push(`rút được ${O_BAN_DO.size} ô bản đồ từ product-map.mjs, mong 11`);
    for (const k of KHOA) {
      const c = BANG.TRANG_THAI[k];
      if (!c) { errs.push(`bảng thiếu khoá ${k}`); continue; }
      if (!c.nhan || !c.viecKe) errs.push(`khoá ${k} thiếu nhan/viecKe`);
      const b = BANG.BUCKET_OF[k];
      if (!b) errs.push(`khoá ${k} không có ô bản đồ trong BUCKET_OF`);
      else if (!O_BAN_DO.has(b)) errs.push(`khoá ${k} chiếu về ô «${b}» không có trong SECTIONS của bản đồ`);
    }
    // khoá lạ phải CHẾT TO, không trả mặc định câm
    let threw = false;
    try { BANG.chu('khoa-khong-ton-tai'); } catch (e) { threw = /khoa-khong-ton-tai/.test(e.message); }
    if (!threw) errs.push('chu() với khoá lạ không throw nêu tên khoá');

    // ── máy quét: MỌI phần tử mang stateKey ∈ bảng, và label/viecKe rút TỪ bảng ──
    const j = scan(ROOT);
    const all = [...(j.groups.gates || []), ...(j.groups.inProgress || []),
                 ...(j.groups.considering || []), ...(j.groups.done || []), ...(j.broken || [])];
    if (all.length < 50) errs.push(`sàn đếm: chỉ ${all.length} phần tử trên cây thật — phép đo chưa chạy`);
    for (const it of all) {
      const c = BANG.TRANG_THAI[it.stateKey];
      if (!c) { errs.push(`${it.slug}: stateKey lạ «${it.stateKey}»`); continue; }
      if (it.label !== c.nhan) errs.push(`${it.slug}: label «${it.label}» lệch bảng «${c.nhan}»`);
      if (it.viecKe !== c.viecKe) errs.push(`${it.slug}: viecKe lệch bảng`);
    }

    // ── acceptance-status.md: ALLOWLIST, không blacklist ──
    // Không gian nhãn là MỞ: cấm «Chờ người ký» thì bên viết đặt «Đợi chữ ký» và ca
    // vẫn xanh. Rút MỌI nhãn ứng viên rồi assert TẬP CON của bảng.
    const md = readFileSync(path.join(ROOT, 'commands', 'acceptance-status.md'), 'utf8');
    const blk = (md.match(/<!-- <<<STATUS-NHAN\n([\s\S]*?)STATUS-NHAN>>> -->/) || [])[1];
    if (blk === undefined) errs.push('không thấy khối STATUS-NHAN trong acceptance-status.md');
    else {
      const nhan = [...blk.matchAll(/^\s*[-*]\s+«([^»]+)»/gm)].map(m => m[1]);
      const hop = new Set(Object.values(BANG.TRANG_THAI).flatMap(c => [c.nhan, c.viecKe]));
      for (const n of nhan) if (!hop.has(n)) errs.push(`nhãn ngoài bảng: ${n}`);
    }
    // Danh sách đen theo TỪ bắt oan chính câu giải thích vì sao không dùng danh
    // sách đen. Đo hai thứ thật thay vào đó:
    //   (1) DẤU HIỆU CẤU TRÚC của danh sách if cũ — bullet ánh xạ một status máy
    //       sang một chuỗi viết tay. Đo quan hệ, không đo từ vựng.
    //   (2) MỆNH ĐỀ DƯƠNG — file phải gọi máy quét và phải dặn in nguyên văn.
    const ifList = [...md.matchAll(/^\s*-\s*`(draft|approved|implemented|verified|signed-off)`[^\n]*→\s*"/gm)];
    if (ifList.length) errs.push(`acceptance-status.md còn danh sách if tự chế chữ (${ifList.length} dòng, vd \`${ifList[0][1]}\`)`);
    if (!/start-scan\.mjs/.test(md)) errs.push('acceptance-status.md không gọi máy quét');
    for (const [ten, re] of [['in label nguyên văn', /`label` NGUYÊN VĂN/],
                             ['in viecKe nguyên văn', /`viecKe` NGUYÊN VĂN/]])
      if (!re.test(md)) errs.push(`acceptance-status.md thiếu «${ten}»`);
  }
  if (errs.length) fail('BDK2', errs.join(' · '));
  else pass('BDK2', 'bảng 20 khoá (ma trận toàn phần, hai vế độc lập) · máy quét rút chữ từ bảng · nhãn bảng trạng thái theo allowlist · khoá lạ chết to');
}

// ── BDK1: thân lệnh mở phiên — nêu tên, nói ngày, nói khi cây lệch ───────────
if (want('BDK1')) {
  const errs = [];
  const md = readFileSync(START_MD, 'utf8');
  // N việc vừa xong phải khai TƯỜNG MINH bằng số trong chính thân lệnh — không
  // để model tự chọn, không giấu con số trong văn xuôi.
  const n = (md.match(/in \*\*(\d+) việc\*\* ĐẦU TIÊN của/) || [])[1];
  if (!n) errs.push('thân lệnh không khai tường minh số việc vừa xong');
  else if (Number(n) < 1) errs.push(`số việc vừa xong phải ≥ 1, đang ${n}`);
  for (const [ten, re] of [
    ['dòng «vừa xong» mỗi việc một dòng', /mỗi việc MỘT dòng: `at` · `label`/],
    ['thẻ KHÔNG tự xếp lại — máy quét đã xếp', /máy quét đã xếp `at` giảm dần[\s\S]{0,80}KHÔNG tự xếp lại/],
    ['at null → «chưa rõ ngày», không bỏ dòng', /chưa rõ ngày.*KHÔNG bỏ dòng/s],
    ['nêu TÊN từng hồ sơ veto-mở', /`vetoOpen` có phần tử → in \*\*TÊN từng hồ sơ\*\*/],
    ['cùng con số lưới trước-merge in', /cùng con số lưới trước-merge/],
    ['dòng cây sau bản chung', /`git\.behind` > 0 → «cây này\n?\s*đang sau bản chung/],
    ['compareRef null → chưa biết, không nói đã khớp', /chưa so được với bản\n?\s*chung.*ĐỪNG nói là đã khớp/s],
    ['behind 0 → không in dòng nào', /`behind` là 0 → không in dòng nào/],
    ['không cắm skill hội thoại mở', /KHÔNG cắm skill hội thoại mở vào bước này/],
    ['ổ cắm giữ nguyên', /`discovery\.brainstorm_skill` vẫn giữ nguyên/],
  ]) if (!re.test(md)) errs.push(`start.md thiếu «${ten}»`);
  // Thẻ dài hơn KHÔNG được sinh câu hỏi thứ hai (ngưỡng: 0 lượt gọi người thêm)
  if (!/MỘT câu hỏi chọn bằng chữ cái\/số dòng\*\* — không hỏi câu thứ hai/.test(md))
    errs.push('start.md mất điều khoản MỘT câu hỏi — thẻ dài hơn không được sinh lượt gọi người mới');
  if (errs.length) fail('BDK1', errs.join(' · '));
  else pass('BDK1', `thẻ in ${n} việc vừa xong có ngày · nêu tên hồ sơ veto-mở · nói khi cây sau bản chung · không cắm skill hội thoại · vẫn đúng MỘT câu hỏi`);
}

// ── BDK3: ổ cắm còn sống + §9.1 đã TRỪ + câu phủ định ở lối (a) ─────────────
if (want('BDK3')) {
  const errs = [];
  // Ổ cắm đo bằng QUAN HỆ, không hash khối mã: hash làm mọi lần format lại hay
  // đổi tên biến đỏ vĩnh viễn trong suite chung dù ổ cắm không đổi một chữ nghĩa.
  // Ba hình dạng config -> ba kết quả, chứng đường fallback vẫn sống và không chặn.
  for (const [ten, cfg, mong] of [
    ['khoá VẮNG', 'schema_version: 1\n', null],
    ['khoá khai tên skill hợp lệ', 'schema_version: 1\ndiscovery:\n  brainstorm_skill: mot-skill\n', 'mot-skill'],
    ['khoá khai plugin:skill', 'schema_version: 1\ndiscovery:\n  brainstorm_skill: pl:sk\n', 'pl:sk'],
    ['khoá khai phi-scalar', 'schema_version: 1\ndiscovery:\n  brainstorm_skill: [a, b]\n', null],
  ]) {
    const r = tmp(); W(r, '_acceptance/config.yaml', cfg);
    const j = scan(r);
    const got = (j.discovery || {}).brainstormSkill;
    if (got !== mong) errs.push(`ổ cắm ${ten}: được ${JSON.stringify(got)}, mong ${JSON.stringify(mong)}`);
    // vắng/không giải được KHÔNG được thành cờ đỏ hay hồ sơ hỏng — đường fallback phải sống
    if (mong === null && (j.broken || []).length)
      errs.push(`ổ cắm ${ten} sinh broken[] — đường fallback phải im lặng, không chặn`);
  }
  const seed = readFileSync(path.join(ROOT, 'docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md'), 'utf8');
  if (!/###\s*9\.1[^\n]*ĐÃ TRỪ/.test(seed)) errs.push('§9.1 của hạt giống chưa mang dấu vết TRỪ');
  if (!/Ổ cắm `discovery\.brainstorm_skill` GIỮ NGUYÊN/.test(seed)) errs.push('§9.1 không nói rõ ổ cắm giữ nguyên');
  const md = readFileSync(START_MD, 'utf8');
  const iA = md.indexOf('(a) ý còn mơ hồ'), iB = md.indexOf('(b)', iA);
  const loiA = iA > -1 && iB > iA ? md.slice(iA, iB) : '';
  if (!/KHÔNG cắm skill hội thoại mở/.test(loiA))
    errs.push('câu phủ định không nằm TRONG lối (a) — đặt chỗ khác thì người đi lối (a) không đọc được');
  if (!/superpowers:brainstorming/.test(loiA)) errs.push('lối (a) mất câu đã có về superpowers:brainstorming');
  if (errs.length) fail('BDK3', errs.join(' · '));
  else pass('BDK3', 'ổ cắm 4 hình dạng đúng + fallback không chặn · §9.1 TRỪ có dấu vết, ổ cắm giữ nguyên · câu phủ định nằm trong lối (a)');
}

// ── BDK4: ba thân cổng in bước kế ───────────────────────────────────────────
if (want('BDK4')) {
  const errs = [];
  for (const [rel, ten, re] of [
    ['commands/approve.md', 'bước kế S2', /Bước kế: máy lập kế hoạch thi công \(S2\)/],
    ['commands/signoff.md', 'bước kế S5', /Bước kế: bàn giao \(S5\)/],
    ['commands/acceptance-card.md', 'hai lệnh ký', /`\/acceptance-gate:approve <slug>`[\s\S]{0,200}`\/acceptance-gate:signoff <slug>`/],
  ]) {
    const txt = readFileSync(path.join(ROOT, rel), 'utf8');
    if (!re.test(txt)) errs.push(`${rel} thiếu «${ten}»`);
  }
  // signoff phải nói CẢ HAI ngả của Vòng TRAO — có hồ sơ cơ hội thì còn một cổng nữa
  const so = readFileSync(path.join(ROOT, 'commands/signoff.md'), 'utf8');
  if (!/acceptance-gate:uat-session <slug>/.test(so)) errs.push('signoff.md không nêu phiên nghiệm thu cho vòng có hồ sơ cơ hội');
  if (!/không hồ\s*\n?\s*sơ cơ hội nên ship thẳng/.test(so)) errs.push('signoff.md không nêu ngả không có hồ sơ cơ hội');
  // Vũ trụ quét dạng-lệnh GIỮ 16: ba thân cổng đã nằm trong đó từ chip D
  const lb = readFileSync(path.join(ROOT, 'tests/plugins/lenh-bam-duoc.test.mjs'), 'utf8');
  if (!/FILES\.length !== 16/.test(lb)) errs.push('hằng vũ trụ quét dạng-lệnh không còn là 16 — ba thân cổng đã nằm trong đó, đừng nới');
  if (errs.length) fail('BDK4', errs.join(' · '));
  else pass('BDK4', 'ba thân cổng in bước kế (S2 · S5 · hai lệnh ký), hai ngả Vòng TRAO, vũ trụ quét giữ 16');
}

// BDK_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [BDK_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`bang-dieu-khien: ${failures} ca đỏ`); process.exit(1); }
