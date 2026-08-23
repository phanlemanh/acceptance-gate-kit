#!/usr/bin/env node
// start-scan.mjs — bộ quét vào phiên của /start: đọc _acceptance/*/ và xếp mỗi
// slug đúng MỘT ô theo bảng phân ô trong docs/specs/2026-08-03-start-command-design.md.
// CHỈ-ĐỌC tuyệt đối. Đầu ra: JSON một dòng (schema_version 1) — các key mà
// commands/start.md đọc được ghim trong khối START-SCAN-KEYS của chính file đó;
// case P99 round-trip giữ hai đầu khớp, P98 giữ bảng phân ô.
// F-B: đọc thêm uat-session.md (ô Cổng Giá trị) + trạng thái bản đồ sản phẩm
// (`map.present` / `map.fresh`). Hai nguồn này trước đây chưa dựng nên bộ quét
// emit `skipped[]` có tên thay vì bịa dữ liệu; F-B dựng xong cả hai nên khoá đó
// đã GỠ HẲN — một khoá khai mà không thứ gì sinh ra được là hợp đồng chết.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Vị từ «hồ sơ verified chưa ký này còn cần người không?» — MỘT bộ đọc mặt
// người dùng nó (máy quét); bản đồ KHÔNG dùng (ô đổi ở chỗ người ký). «Một
// nguồn» với lưới trước-merge giữ bằng phép đo đẳng thức LV5, không bằng import.
import { khongCanNguoi } from './khong-can-nguoi.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField, resolveConfigKey } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));
// Luật "hồ sơ nào được tiêu thụ" VÀ luật "field điều hướng có hợp lệ không"
// đều sống MỘT chỗ, bản đồ sản phẩm dùng chung — hai bên đọc cùng hồ sơ không
// được cho hai kết luận trái nhau. Kiểm tay lại ở đây là cách hai bên đã trôi
// khỏi nhau ở r12 và r13 dù bảng enum đã gom xong từ r3.
const { recordProblem, navValues, consumedTexts, usesOpportunity, readRecord, ioReason,
        configList, fieldProblem, missingArtifact, mapState, MAP_LABELS, mapTracked } =
  require(path.join(__dirname, '..', 'lib', 'workspace-record.cjs'));

// Argv hỏng CHẾT TO (exit 2), không âm thầm rơi về cwd: một cờ được KHAI mà
// dùng không được lại đổi nghĩa lệnh thành "quét cây khác rồi báo thành công",
// và `--root` sai biến lỗi gõ lệnh thành chẩn đoán "repo chưa dựng cổng".
// Cùng doctrine với pre-merge-check v1.22.1 (mode lạ là lỗi cứng, không đoán).
// MỖI lối một thông điệp riêng — dùng chung một câu thì đột biến chỉ chứng
// minh được một nhánh (bài học P95).
const args = process.argv.slice(2);
const bail = msg => { process.stderr.write(`start-scan: ${msg}\n`); process.exit(2); };
let rootArg = '.';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') {
    if (i + 1 >= args.length) bail('--root khai báo nhưng thiếu giá trị — nêu thư mục repo cần quét');
    if (args[i + 1] === '') bail('--root nhận chuỗi rỗng — nêu thư mục repo cần quét');
    rootArg = args[++i];
  } else bail(`tham số lạ ${args[i]} — chỉ nhận --root <thư mục>`);
}
const root = path.resolve(rootArg);
if (!existsSync(root)) bail(`--root trỏ đường dẫn không tồn tại: ${root}`);
if (!statSync(root).isDirectory()) bail(`--root trỏ vào thứ không phải thư mục: ${root}`);
const out = obj => process.stdout.write(JSON.stringify(obj) + '\n');

const acc = path.join(root, '_acceptance');
if (!existsSync(path.join(acc, 'config.yaml'))) { out({ schema_version: 1, config: false }); process.exit(0); }

// ENOENT (file vắng) là tin bình thường; MỌI lỗi khác là sự thật phải nêu tên —
// nuốt chung một rọ biến "mất quyền đọc" thành "không có file", và slug bị phân
// ô theo artifact bên cạnh (Cổng 2 start-command, known-limit 1).
// read/ioReason KHÔNG có bản sao ở đây: chúng là một phần của luật đọc hồ sơ
// và sống ở lib/workspace-record.cjs. Hai bản y hệt nhau hôm nay vẫn là đúng
// hình dạng đã sinh ra ba hồi quy liên tiếp — lần sửa ENOENT (hay sửa câu
// "không đọc được (CODE)" mà broken[].reason bị assert theo) tiếp theo sẽ rơi
// vào một bên (S4-r15).
const read = readRecord;
// KHÔNG có parser fence thứ hai: tiêu chí "đọc được" là CHÍNH frontmatterField
// của evidence-core trả ra key bắt buộc (S4-r1: hasFm riêng đã chặt hơn reader
// chuẩn — CRLF/dòng trắng đầu file bị báo hỏng oan trong khi mọi cổng khác đọc được)
const fmOrNull = (t, key) => (t == null ? null : frontmatterField(t, key));
const kcn = (cTxt, eTxt) => khongCanNguoi(cTxt, eTxt);
const git = (() => {
  const q = args => {
    try {
      return execFileSync('git', ['-C', root, ...args],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }).trim();
    } catch { return null; }
  };
  const branch = q(['rev-parse', '--abbrev-ref', 'HEAD']);
  // `q()` tra null khi lenh git nem (index.lock, quyen, kho la). `null !== ''` la
  // TRUE, nen viet gon se TUYEN «cay co thay doi chua commit» o dung ca may KHONG
  // BIET — trai chinh luat «chua biet khac han da khop» khai ba dong duoi. Ban cu
  // bat loi cho ca cum va tra dirty: null; giu nguyen nghia do.
  const st = branch === null ? null : q(['status', '--porcelain']);
  const dirty = st === null ? null : st !== '';
  // Thang so: BẢN CHUNG trước, nhánh trên cùng CỦA CHÍNH NHÁNH NÀY là nấc CUỐI.
  // Đảo thứ tự là nói dối: một nhánh tính năng đã push và khớp nhánh trên cùng
  // của nó sẽ ra «khớp» trong khi bản chung đã đi trước — đúng ca lệch 22/08.
  // KHÔNG gọi mạng: chỉ đọc ref đã có sẵn trong kho.
  let compareRef = null;
  const head = q(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']);
  for (const cand of [head, 'origin/main', 'origin/master', '@{u}']) {
    if (!cand) continue;
    if (q(['rev-parse', '--verify', '--quiet', cand]) === null) continue;
    compareRef = cand; break;
  }
  // Không nấc nào giải được → null, KHÔNG phải 0. «Chưa biết» khác hẳn «đã khớp»:
  // in số 0 ở đây là thẻ tuyên cây đang khớp trong khi nó chưa hề so được.
  let ahead = null, behind = null;
  if (compareRef) {
    const c = q(['rev-list', '--left-right', '--count', `${compareRef}...HEAD`]);
    const m = c && c.match(/^(\d+)\s+(\d+)$/);
    if (m) { behind = Number(m[1]); ahead = Number(m[2]); }
    else compareRef = null;
  }
  return { branch, dirty, ahead, behind, compareRef };
})();

// Chữ mặt người rút từ MỘT bảng — máy quét là bộ PHÂN Ô duy nhất, ba bộ đọc
// còn lại HỎI nó chứ không tự phán (hồ sơ start-bang-dieu-khien).
//
// ⚠ Khoá mới tên `stateKey`, KHÔNG dùng lại `state`: `done[].state` ĐANG là hợp
// đồng máy — commands/start.md đọc giá trị `lan-v-mo`/`xanh-sach`, và ca P98/P123
// đọc nó. Đổi nghĩa một khoá đang có bên đọc chính là lớp bên-viết-và-bên-đọc-
// trôi-khỏi-nhau mà hồ sơ này sinh ra để giết (ledger S2).
const { chu } = require(path.join(__dirname, 'trang-thai-ho-so.cjs'));
const g = (stateKey, obj) => ({ ...obj, stateKey, label: chu(stateKey).nhan, viecKe: chu(stateKey).viecKe });

const gates = [], inProgress = [], considering = [], done = [], broken = [];
// CỬA VETO MỞ — mảng CẮT NGANG bốn nhóm, độc lập với việc slug rơi vào ô nào.
// Hỏi ĐÚNG câu lưới trước-merge hỏi: mọi contract.md có `veto_state: mo`, BẤT KỂ
// status. Nhánh `signed-off` của bộ phân ô không đọc veto_state lần nào, nên 14
// hồ sơ đã ký biến khỏi thẻ và thẻ đếm 2 trong khi lưới đếm 16.
// Veto-default chỉ sống nếu owner THẤY TÊN — đếm một con số mà không nêu tên là
// giấu đúng thứ mình đang mời người veto.
const vetoOpen = [];
// MỌI lối hỏng về cùng một khoá — gom về một cửa duy nhất.
const pushHong = obj => broken.push(g('ho-so-hong', obj));
// MỘT từ vựng verdict cho MỌI nhánh: nhánh `verified` gọi tên giá trị lạ trong
// khi nhánh `implemented` nuốt im lặng là chỗ duy nhất cùng một artifact hỏng
// được phát hiện hay không tuỳ status của contract (Cổng 2 start-command, known-limit 3).
// Từ vựng phải khớp bên VIẾT, không phải trí nhớ của bên đọc: nguồn là
// skills/acceptance/references/evidence-report-template.md (dòng `verdict:`),
// và acceptance-verify.js tự sinh BLOCKED khi verifier không chạy được.
// Bỏ sót BLOCKED = một vòng đang dở bị chặn môi trường bị gọi là "hồ sơ hỏng"
// rồi biến khỏi danh sách chọn của /start (S4-r2, thoái lui do chính vòng này gây).
// P104 round-trip rút từ vựng TỪ khuôn writer rồi đọc bằng reader — hai đầu hết trôi.
// MỘT bảng tra verdict → ý nghĩa, CẢ HAI nhánh status đọc chung. Hai danh sách
// song song ở hai nhánh là hình dạng đã hỏng HAI round liên tiếp: r2 bỏ sót
// BLOCKED ở nhánh implemented, r3 bỏ sót đúng nó ở nhánh verified. Gộp về một
// bảng để khi khuôn writer thêm giá trị thì chỉ còn MỘT chỗ phải sửa.
//   settled=true  → máy chấm xong, việc còn lại là của NGƯỜI (cổng bằng chứng)
//   settled=false → máy chưa xong, còn việc của MÁY (nextStep)
const VERDICT_MEANING = {
  'PASS':             { settled: true,  nextStep: 'S4' },
  'PENDING-JUDGMENT': { settled: true,  nextStep: 'S4' },
  'REJECT':           { settled: false, nextStep: 'S3-fix' },
  'BLOCKED':          { settled: false, nextStep: 'S4' },
};
// Bảng Ý NGHĨA này là từ vựng thứ hai bên cạnh enum của bảng luật chung —
// hai bảng lệch nhau là bộ quét sập giữa chừng (đã dựng lại được: nới enum
// trong lib mà không thêm nghĩa ở đây). Giá trị hợp luật chung nhưng không có
// nghĩa ở bảng này phải là hồ sơ-đọc-được-nhưng-bộ-quét-lệch, nêu đích danh.
const meaningOf = verdict => VERDICT_MEANING[verdict] || null;
const bangLech = verdict => ({ file: 'evidence-report.md',
  reason: `verdict ${verdict} hợp bảng luật chung nhưng bảng ý nghĩa của bộ quét không biết nó — hai bảng lệch, sửa VERDICT_MEANING` });
// verdict của PHIÊN NGHIỆM THU → ô kết cục. Giá trị ngoài bảng này không tới
// được đây: luật chung đã gọi nó là hồ sơ hỏng trước đó.
const UAT_STATE = { release: 'released', iterate: 'uat-iterate', kill: 'uat-kill' };
// Khoá trạng thái song song — `state` ở trên là hợp đồng máy có bên đọc, giữ nguyên.
const UAT_KEY = { release: 'da-nghiem-thu-release', iterate: 'da-nghiem-thu-iterate', kill: 'da-nghiem-thu-kill' };
// Khớp CHẶT khuôn tên plan YYYY-MM-DD-<slug>.md — substring trần khiến slug là
// tiền tố của slug khác dính plan không phải của nó (S4-r1, nextStep S3 oan)
const planSlug = f => { const m = f.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/); return m ? m[1] : null; };
const planExists = slug => [path.join(root, 'docs', 'superpowers', 'plans'), path.join(root, 'docs', 'plans')]
  .some(d => existsSync(d) && readdirSync(d).some(f => planSlug(f) === slug));
// since: timestamp frontmatter thắng mtime — cổng chờ lâu nhất không được trôi
// xuống cuối nhóm chỉ vì file bị format/sync chạm lại (AC-6, đối chứng P98)
const since = (file, fmTs) => fmTs || statSync(file).mtime.toISOString();
const { section } = require(path.join(__dirname, '..', 'lib', 'md-section.cjs'));
// NGÀY của một việc đã đóng — suy từ hồ sơ SẴN CÓ, không thêm trường, không bắt
// hồ sơ nào migrate: đã thử trên 57 hồ sơ signed-off của chính kit, 57/57 ra
// ngày ngay ở nấc một. Nấc nào cũng không ra → null, KHÔNG mượn mtime bịa mốc:
// một con số sai chỗ này là thẻ nói dối về thứ tự việc vừa làm.
const NGAY_RE = /(\d{4}-\d{2}-\d{2})/;
const ngayXong = (dir, anchorPath) => {
  const e = read(path.join(dir, 'evidence-report.md'));
  if (!e.err && e.t != null) {
    const m = NGAY_RE.exec(frontmatterField(e.t, 'human_signoff') || '');
    if (m) return m[1];
  }
  for (const f of ['uat-session.md', 'opportunity.md']) {
    const r = read(path.join(dir, f));
    if (r.err || r.t == null) continue;
    const m = NGAY_RE.exec(frontmatterField(r.t, 'decided_at') || '');
    if (m) return m[1];
  }
  try {
    const o = execFileSync('git', ['-C', root, 'log', '-1', '--format=%cs', '--', path.relative(root, anchorPath)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return NGAY_RE.test(o) ? o : null;
  } catch { return null; }
};
// ── Ý đang cân nhắc vs chờ Cổng Đáng (hồ sơ vao-co-o-ra-co-ten) ──────────────
// Nhãn bullet của section Ngưỡng đọc từ CHÍNH KHUÔN lúc chạy — khuôn là một
// nguồn; chép tay vào đây là hai bản trôi (d-4202). Đọc LƯỜI: repo không có ý
// nào thì không đụng khuôn. Khuôn hỏng → chết to, không im lặng.
const OPP_TEMPLATE = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');
const UAT_THRESHOLD_HEADING = 'Ngưỡng chết / ngưỡng UAT';
const PLACEHOLDER_RE = /^(…|\.\.\.)?$/;                      // giá trị sau dấu ':' — rỗng/«…» là chưa điền
const bulletOf = l => { const m = l.match(/^\s*[-*]\s+([^:]+):(.*)$/); return m ? { label: m[1].trim(), value: m[2].trim() } : null; };
let _labels = null;
const thresholdLabels = () => {
  if (_labels) return _labels;
  let tpl;
  try { tpl = readFileSync(OPP_TEMPLATE, 'utf8'); }
  catch (e) { bail(`khuôn opportunity-template không đọc được: ${OPP_TEMPLATE} (${e.code || e.message})`); }
  const labels = section(tpl, UAT_THRESHOLD_HEADING).map(bulletOf).filter(Boolean).map(b => b.label);
  if (!labels.length) bail(`khuôn không có section Ngưỡng «${UAT_THRESHOLD_HEADING}» (hoặc section không có bullet): ${OPP_TEMPLATE}`);
  return (_labels = labels);
};
const thresholdFilled = oTxt => {
  const got = new Map();
  for (const l of section(oTxt, UAT_THRESHOLD_HEADING)) { const b = bulletOf(l); if (b) got.set(b.label, b.value); }
  return thresholdLabels().every(lb => got.has(lb) && !PLACEHOLDER_RE.test(got.get(lb)));
};
// since của ý đang cân nhắc = committer date của commit ĐẦU TIÊN thêm file
// (--diff-filter=A); chưa commit / không git → mtime (d-4203).
const gitBirth = file => {
  try {
    const o = execFileSync('git', ['-C', root, 'log', '--diff-filter=A', '--format=%cI', '--', path.relative(root, file)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (!o) return null;
    const ls = o.split('\n'); return new Date(ls[ls.length - 1]).toISOString();
  } catch { return null; }
};
const ageDays = iso => Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86400000));

for (const entry of readdirSync(acc, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const dir = path.join(acc, slug);
  const cPath = path.join(dir, 'contract.md'), oPath = path.join(dir, 'opportunity.md');
  // opportunity.md CHỈ được đọc khi KHÔNG có contract.md (nhánh else bên dưới).
  // Đọc-rồi-bail vô điều kiện khiến một việc có hợp đồng lành mạnh đang chờ ký
  // biến khỏi thẻ chỉ vì một file không bao giờ dùng tới bị lỗi quyền (S4-r3,
  // lỗi trong hợp đồng do chính round 1 gây). Lỗi của file KHÔNG dùng tới thì
  // không được quyết định ô của slug.
  const cRead = read(cPath);
  if (cRead.err) { pushHong({ slug, file: 'contract.md', reason: ioReason(cRead.err) }); continue; }
  const cTxt = cRead.t;
  if (cTxt != null) {
    // status đi qua LUẬT CHUNG (fieldProblem) — bản kiểm tay ở đây từng lệch
    // chuỗi với lib ("parse" vs "đọc") và là một trong hai bản sao cuối cùng
    // của luật contract/status (workspace-reader-unification AC-1).
    // Cửa veto hỏi TRƯỚC chốt status hỏng: lưới trước-merge chỉ đòi contract.md
    // tồn tại rồi đọc thẳng veto_state, nên đặt sau `continue` là hồ sơ có cửa
    // veto mở mà status hỏng biến khỏi thẻ trong khi lưới vẫn đếm — đúng lớp
    // «thẻ đếm 2 lưới đếm 16» mà hồ sơ này sinh ra để giết, chỉ ở góc khác.
    if ((frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo')
      vetoOpen.push({ slug, status: (frontmatterField(cTxt, 'status') || '').toLowerCase() });
    const statusProblem = fieldProblem('contract.md', cTxt, 'status');
    if (statusProblem) { pushHong({ slug, ...statusProblem }); continue; }
    const status = frontmatterField(cTxt, 'status').toLowerCase();
    const tier = frontmatterField(cTxt, 'risk_tier') || null;
    // evidence-report.md CHỈ được đọc trong hai nhánh tiêu thụ nó (verified,
    // implemented). Chốt lỗi đặt TRƯỚC chỗ rẽ trạng thái là lớp lỗi đã dẫm 4
    // round (r1: opportunity, r4: chính file này) — lỗi của hồ sơ mà trạng thái
    // hiện tại KHÔNG cần vẫn quyết định ô của slug. Câu hỏi kiểm đúng: "MỌI lối
    // đi qua chốt này có dùng file đó không?" — không phải "file có được dùng
    // đâu đó không". Helper trả null = đã kết luận broken, nhánh gọi dừng luôn.
    // P105 ghim TOÀN BỘ ma trận (trạng thái × tình trạng evidence): chốt dời
    // ngược lên là ma trận đỏ.
    const readEvidence = () => {
      const eRead = read(path.join(dir, 'evidence-report.md'));
      if (eRead.err) { pushHong({ slug, file: 'evidence-report.md', reason: ioReason(eRead.err) }); return null; }
      const eTxt = eRead.t;
      // Rỗng = VẮNG, kết luận một chỗ cho cả hai nhánh (S4-r1: frontmatterField
      // trả '' cho key-có-giá-trị-rỗng nên `== null` để lọt xuống offVocab(''))
      if (eTxt != null) {
        const p = fieldProblem('evidence-report.md', eTxt, 'verdict');
        if (p) { pushHong({ slug, ...p }); return null; }
      }
      return {
        exists: eTxt != null,
        raw: eTxt,
        verdict: eTxt != null ? frontmatterField(eTxt, 'verdict').toUpperCase() : null,
        signoff: eTxt != null ? (frontmatterField(eTxt, 'human_signoff') || '') : '',
      };
    };
    // uat-session.md CHỈ được tiêu thụ ở nhánh signed-off — một phiên nghiệm
    // thu nằm cạnh hợp đồng còn draft là hồ sơ chưa tới lượt, lỗi của nó không
    // được quyết định ô của slug (cùng doctrine với opportunity/evidence ở
    // trên, học qua 4 round của start-scan-hardening).
    if (status === 'signed-off') {
      const uRead = read(path.join(dir, 'uat-session.md'));
      if (uRead.err) { pushHong({ slug, file: 'uat-session.md', reason: ioReason(uRead.err) }); continue; }
      const uTxt = uRead.t;
      // Đường A (cơ hội đã quyết build/iterate) còn MỘT cổng người nữa: phiên
      // nghiệm thu. Đường B/C/E ship thẳng — không dựng phiên giả cho chúng.
      // CÓ đọc opportunity.md hay không là câu hỏi của luật chung, không phải
      // của chỗ này: đọc lười vẫn giữ (lỗi quyền ở file không dùng tới không
      // được quyết định ô của slug), nhưng điều kiện thì hỏi usesOpportunity.
      let oTxt = null;
      if (usesOpportunity(cTxt, uTxt)) {
        const oR = read(oPath);
        if (oR.err) { pushHong({ slug, file: 'opportunity.md', reason: ioReason(oR.err) }); continue; }
        oTxt = oR.t;
      }
      // MỘT lượt hỏi luật chung cho CẢ tập hồ sơ được tiêu thụ. Kiểm tay từng
      // field là cách chắc chắn sót một field — sót field nào thì bản đồ với
      // bộ quét lệch nhau đúng ở đó (r12: stage/frontmatter của opportunity;
      // r13: stage của phiên nghiệm thu, và decision lạ khi stage chưa quyết).
      const texts = consumedTexts({ contract: cTxt, opportunity: oTxt, uat: uTxt });
      const problem = recordProblem(texts);
      if (problem) { pushHong({ slug, ...problem }); continue; }
      const { decision, verdict } = navValues(texts);
      // verdict RỖNG = phiên đã dựng nhưng CHƯA ký → rơi xuống ô chờ-Cổng-Giá-trị
      if (verdict) { done.push(g(UAT_KEY[verdict], { slug, state: UAT_STATE[verdict], at: ngayXong(dir, cPath) })); continue; }
      if (decision === 'build' || decision === 'iterate')
        // since CHỈ từ decided_at của phiên — nghi thức thật chưa sinh mốc thì
        // để trống, không mượn mtime bịa một mốc (AC-8 workspace-reader-unification)
        gates.push(g('cho-cong-gia-tri', { slug, gate: 'gia-tri', since: fmOrNull(uTxt, 'decided_at') || '', tier }));
      else done.push(g('da-giao', { slug, state: 'signed-off', at: ngayXong(dir, cPath) }));
    }
    else if (status === 'verified') {
      // Bảng phân ô spec: chờ-Cổng-Bằng-chứng = verdict đã-chốt (PASS/PENDING-
      // JUDGMENT) và CHƯA human_signoff — verified không kèm điều kiện là hiện
      // "chờ ký" oan (S4-r1)
      const ev = readEvidence();
      if (ev) {
        const meaning = ev.exists ? meaningOf(ev.verdict) : null;
        const kcnState = ev.exists && !ev.signoff ? kcn(cTxt, ev.raw) : null;
        if (!ev.exists) pushHong({ slug, ...missingArtifact({ 'contract.md': cTxt, 'evidence-report.md': null }) });
        else if (!meaning) pushHong({ slug, ...bangLech(ev.verdict) });
        else if (ev.signoff) done.push(g('da-giao', { slug, state: 'signed-off', at: ngayXong(dir, cPath) }));
        // KCN-NHANH: hồ sơ KHÔNG còn cần người — cùng câu lưới trước-merge hỏi
        // (da-veto · Cổng 1 đúng vết · sáu điều kiện xanh-sạch). Trả về tên
        // trạng thái «đã giao»: lan-v-mo (cửa veto mở) hay xanh-sach (người duyệt
        // Cổng 1). Hồ sơ chưa sạch rơi xuống nhánh dưới và VẪN là cổng — đó là
        // lỗi vòng một của hồ sơ lan-v-khong-phai-cho-ky (khoá vào veto_state).
        else if (kcnState) done.push(g(kcnState === 'lan-v-mo' ? 'may-di-tiep-veto-mo' : 'may-di-tiep-xanh-sach', { slug, state: kcnState, at: ngayXong(dir, cPath) }));
        else if (meaning.settled) gates.push(g('cho-cong-bang-chung', { slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier }));
        // Còn việc của MÁY: REJECT -> đang sửa theo bằng chứng · BLOCKED -> nghiệm thu bị chặn.
        else inProgress.push(g(meaning.nextStep === 'S3-fix' ? 'dang-sua-theo-bang-chung' : 'nghiem-thu-bi-chan', { slug, status, nextStep: meaning.nextStep, tier }));
      }
    }
    else if (status === 'implemented') {
      const ev = readEvidence();
      if (ev) {
        // Chưa có evidence = máy chưa chấm lần nào → bước kế là nghiệm thu máy
        const meaning = !ev.exists ? { nextStep: 'S4' } : meaningOf(ev.verdict);
        if (!meaning) pushHong({ slug, ...bangLech(ev.verdict) });
        else {
          // REJECT -> đang sửa · BLOCKED -> nghiệm thu bị chặn · còn lại (chưa có
          // bằng chứng, hoặc đã PASS mà hợp đồng chưa lên verified) -> máy còn
          // một lượt chấm phải chạy.
          const k = !ev.exists ? 'cho-nghiem-thu-may'
            : ev.verdict === 'REJECT' ? 'dang-sua-theo-bang-chung'
            : ev.verdict === 'BLOCKED' ? 'nghiem-thu-bi-chan' : 'cho-nghiem-thu-may';
          inProgress.push(g(k, { slug, status, nextStep: meaning.nextStep, tier }));
        }
      }
    }
    else if (status === 'approved') inProgress.push(g(planExists(slug) ? 'dang-viet-code' : 'dang-lap-ke-hoach', { slug, status, nextStep: planExists(slug) ? 'S3' : 'S2', tier }));
    else if (status === 'draft') gates.push(g('cho-cong-pham-vi', { slug, gate: 'pham-vi', since: since(cPath, null), tier }));
    else pushHong({ slug, file: 'contract.md', reason: `status không nhận diện được: ${status || '(rỗng)'}` });
    continue;
  }
  // Không có contract.md — GIỜ mới đọc opportunity.md (xem ghi chú ở trên)
  const oRead = read(oPath);
  if (oRead.err) { pushHong({ slug, file: 'opportunity.md', reason: ioReason(oRead.err) }); continue; }
  // MỌI field điều hướng qua LUẬT CHUNG, kể cả khi trạng thái không dùng tới
  // nó để xếp ô. Bảng enum chép tay ở đây là chỗ r13 lệch: `decision` ngoài từ
  // vựng lọt im lặng vì nhánh `stage !== 'decided'` rẽ TRƯỚC khi nó được đối
  // chiếu — hồ sơ ghi dở phải được NÊU TÊN, không hoá thành "chờ-Cổng-Đáng".
  // recordProblem cũng trả luôn ca không-có-cả-hai-hồ-sơ (ANCHOR_FILES).
  const texts = consumedTexts({ contract: null, opportunity: oRead.t, uat: null });
  const problem = recordProblem(texts);
  if (problem) { pushHong({ slug, ...problem }); continue; }
  const { stage, decision } = navValues(texts);
  if (stage !== 'decided' || !decision) {
    // Chưa có ngưỡng thì chưa có gì để ký: xếp «đang cân nhắc», không phải cổng.
    if (thresholdFilled(oRead.t)) gates.push(g('cho-cong-dang', { slug, gate: 'dang', since: since(oPath, fmOrNull(oRead.t, 'decided_at')), tier: null }));
    else {
      const s = gitBirth(oPath) || statSync(oPath).mtime.toISOString();
      considering.push(g('y-can-nhac', { slug, name: fmOrNull(oRead.t, 'feature') || slug, since: s, ageDays: ageDays(s) }));
    }
  }
  else if (decision === 'build' || decision === 'iterate') inProgress.push(g('sap-mo-vong', { slug, status: 'opportunity-decided', nextStep: 'S1', tier: null }));
  else done.push(g(decision === 'park' ? 'xep-lai' : 'da-bac', { slug, state: decision, at: ngayXong(dir, oPath) }));
}
// Mốc RỖNG = nghi thức thật chưa sinh mốc, KHÔNG phải «chờ lâu nhất». Chuỗi rỗng
// sort lên đầu khiến Cổng Giá trị luôn mở đầu thẻ bất kể tuổi — thẻ in một thứ tự
// không mang tin (hố 4 của hồ sơ cơ hội).
gates.sort((a, b) => {
  const ea = !String(a.since || ''), eb = !String(b.since || '');
  if (ea !== eb) return ea ? 1 : -1;
  return String(a.since).localeCompare(String(b.since));
});
vetoOpen.sort((a, b) => a.slug.localeCompare(b.slug));
// done[] xếp theo NGÀY giảm dần, mốc trống xuống cuối — thân lệnh chỉ lấy N phần
// tử ĐẦU. Không sort ở đây là giao việc xếp 57 mốc cho model, đúng thứ hồ sơ này
// sinh ra để chấm dứt: máy quét là bộ phân ô duy nhất, thẻ in nguyên văn.
done.sort((a, b) => {
  const ea = !a.at, eb = !b.at;
  if (ea !== eb) return ea ? 1 : -1;
  return String(b.at).localeCompare(String(a.at));
});
considering.sort((a, b) => a.since.localeCompare(b.since));   // cũ nhất lên đầu
// Tuổi TRÙNG không phải tuổi: 6/7 ý của chính kit mang CÙNG một dấu thời gian
// vì cùng một commit đổ stub. In «cũ nhất X ngày» cho một nhóm như vậy là nói
// một con số không có thật — thẻ phải nói «chưa rõ tuổi».
{
  const dem = new Map();
  for (const c of considering) dem.set(c.since, (dem.get(c.since) || 0) + 1);
  for (const c of considering) c.ageTied = dem.get(c.since) > 1;
}

// Hai nguồn từng vắng (PRODUCT-MAP, phiên nghiệm thu) đã dựng ở F-B, nên mảng
// skipped[] không còn nguồn sinh nào và đã được gỡ: một khoá khai mà không thứ
// gì sinh ra được là hợp đồng chết — case round-trip P99 đòi mọi khoá khai
// phải soi được trong đầu ra THẬT.
const mapPath = path.join(root, 'PRODUCT-MAP.md');
// `enabled` = repo NÀY đã bật bản đồ chưa (PRODUCT-MAP.md có trong
// risk_tiers.t1_skip_globs). Không có tín hiệu này thì thẻ hứa với repo dựng
// trước 1.31.0 rằng "bản đồ sẽ tự vẽ ở lần ký cổng kế" — trong khi đường
// đọc-cũ dặn CẢ NĂM thân cổng người BỎ QUA đúng ở repo đó, nên lời hứa không
// bao giờ thành sự thật và người đợi một thứ không tới (S4-r14).
// Đọc bằng LUẬT CHUNG (configList), không phải regex quét cả file: khoá này
// đã có hai bên đọc khác trong repo (pre-merge-check.sh cắt đúng section, và
// năm thân cổng người được dặn đọc `risk_tiers.t1_skip_globs`). Regex toàn file
// sai cả hai chiều — comment đuôi dòng thành "chưa bật", và cùng chuỗi nằm dưới
// một list khác thành "đã bật" (S4-r15).
const cfgRead = read(path.join(root, '_acceptance', 'config.yaml'));
// Ổ cắm F-K (`discovery.brainstorm_skill`): tên skill mở buổi khai thác vòng
// HIỂU do repo tiêu thụ TỰ KHAI — engine không hardcode tên plugin bên-thứ-ba
// không-dependency (bệnh "luật gắn vào kho đồ của MỘT repo", bảng soi 06/08).
//
// ĐỌC bằng resolveConfigKey của lib — reader config DÙNG CHUNG của kit, đúng
// hàm mà ổ cắm anh em `design_pass.host_embed` đọc (scripts/gate-card.js).
// KHÔNG tự viết parser: bốn round S4 của chính vòng này đã vá bốn hình dạng
// YAML (CRLF · thụt đầu dòng · chú thích chứa dấu nháy · section lạ kế tiếp)
// mà reader chung ĐÚNG SẴN cả bốn — vá hình dạng thứ năm là đi tiếp một khuôn
// giải sai. Hai bên đọc cùng một config.yaml không được cho hai kết luận trái
// nhau (cùng doctrine với ghi chú `configList` ở trên; entry d-10019 siêu chọn
// d-10002, tiền đề "chưa có consumer thứ hai / phải sửa lib" đã sai cả hai vế).
//
// GUARD hình dạng đặt NGOÀI reader — đây là luật của Ổ CẮM NÀY (đích phải là
// tên skill dùng được ngay), không phải luật đọc YAML:
//   · từ vựng rỗng/null của YAML (mọi cách viết hoa-thường + boolean) → null
//   · phi-scalar (`[`/`{`/`>`/`|`) và neo/alias (`&`/`*`) → null
//   · không khớp khuôn `plugin:skill` / `skill` → null
// MỌI hình dạng "không đọc ra tên dùng ngay" đều về null ⇒ thẻ trỏ nghi thức
// khai thác theo khuôn kit-own, KHÔNG cờ đỏ, không chặn (đường fallback phải sống ở repo
// chưa khai). Thụt đầu dòng: reader chung đòi 2-space, ĐÚNG hợp đồng repo
// (`commands/acceptance-init.md` "2-space indentation REQUIRED"; pre-merge coi
// thụt lẻ là VIOLATION) — bản vá r1 từng nới chỗ này và gây bất đồng thật với
// `configList` cùng file (map.enabled sai ⇒ thẻ nói dối về bản đồ, R4-3).
const SKILL_NAME_RE = /^[A-Za-z0-9_.-]+(?::[A-Za-z0-9_.-]+)*$/;
const YAML_NULLISH = new Set(['~', 'null', 'Null', 'NULL', 'true', 'false', 'True', 'False', 'TRUE', 'FALSE']);
const discoverySkill = cfgTxt => {
  const v = resolveConfigKey(String(cfgTxt || ''), 'discovery.brainstorm_skill');
  if (v == null) return null;
  const s = String(v).trim();
  if (!s || YAML_NULLISH.has(s)) return null;
  if (/^[\[{>|&*]/.test(s)) return null;
  return SKILL_NAME_RE.test(s) ? s : null;
};
const discovery = {
  brainstormSkill: cfgRead.err || cfgRead.t == null ? null : discoverySkill(cfgRead.t),
};
const map = {
  present: existsSync(mapPath),
  fresh: null,
  // Không đọc được config KHÔNG phải "chưa bật" — nói thẳng là chưa biết, để
  // thẻ đừng khuyên bật một thứ có thể đã bật rồi.
  enabled: cfgRead.err || cfgRead.t == null ? null
    : configList(cfgRead.t, 't1_skip_globs').includes('PRODUCT-MAP.md'),
};
// state/label rút từ BẢNG NHÃN CHUNG và tracked từ MỘT HÀM CHUNG (lib) —
// cùng nguồn với product-map --check, để "đã xoá" ở cổng CI không hoá "chưa
// dựng" trên thẻ /start kể cả khi config không khai mà git còn nhớ file
// (S4-r1 vòng này: hai bên từng suy tracked từ hai tín hiệu khác nhau).
// enabled null (config không đọc được) → state null, thẻ nói "chưa biết".
map.state = map.enabled == null ? null
  : mapState({ exists: map.present, tracked: mapTracked(root, cfgRead.t) });
map.label = map.state == null ? null : MAP_LABELS[map.state];
if (map.present) {
  // fresh = null khi KHÔNG kiểm được (không phải "khớp"): thẻ nói "chưa kiểm
  // được bản đồ", không nói xanh.
  try {
    const { renderProductMap } = await import('./product-map.mjs');
    map.fresh = readFileSync(mapPath, 'utf8') === renderProductMap(root);
  } catch { map.fresh = null; }
}

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, considering, done }, vetoOpen, map, discovery, broken });
