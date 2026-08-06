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

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField, resolveConfigKey } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));
// Luật "hồ sơ nào được tiêu thụ" VÀ luật "field điều hướng có hợp lệ không"
// đều sống MỘT chỗ, bản đồ sản phẩm dùng chung — hai bên đọc cùng hồ sơ không
// được cho hai kết luận trái nhau. Kiểm tay lại ở đây là cách hai bên đã trôi
// khỏi nhau ở r12 và r13 dù bảng enum đã gom xong từ r3.
const { recordProblem, navValues, consumedTexts, usesOpportunity, readRecord, ioReason,
        configList } =
  require(path.join(__dirname, '..', 'lib', 'workspace-record.js'));

// Argv hỏng CHẾT TO (exit 2), không âm thầm rơi về cwd: một cờ được KHAI mà
// dùng không được lại đổi nghĩa lệnh thành "quét cây khác rồi báo thành công",
// và `--root` sai biến lỗi gõ lệnh thành chẩn đoán "repo chưa dựng cổng".
// Cùng doctrine với pre-merge-check v1.22.1 + sync-plugin-packages (mode lạ).
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
// và sống ở lib/workspace-record.js. Hai bản y hệt nhau hôm nay vẫn là đúng
// hình dạng đã sinh ra ba hồi quy liên tiếp — lần sửa ENOENT (hay sửa câu
// "không đọc được (CODE)" mà broken[].reason bị assert theo) tiếp theo sẽ rơi
// vào một bên (S4-r15).
const read = readRecord;
// KHÔNG có parser fence thứ hai: tiêu chí "đọc được" là CHÍNH frontmatterField
// của evidence-core trả ra key bắt buộc (S4-r1: hasFm riêng đã chặt hơn reader
// chuẩn — CRLF/dòng trắng đầu file bị báo hỏng oan trong khi mọi cổng khác đọc được)
const fmOrNull = (t, key) => (t == null ? null : frontmatterField(t, key));
const git = (() => {
  try {
    const branch = execFileSync('git', ['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
    return { branch, dirty };
  } catch { return { branch: null, dirty: null }; }
})();

const gates = [], inProgress = [], done = [], broken = [];
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
const offVocab = verdict => ({ file: 'evidence-report.md', reason: `verdict không nhận diện được: ${verdict}` });
// verdict của PHIÊN NGHIỆM THU → ô kết cục. Giá trị ngoài bảng này không tới
// được đây: luật chung đã gọi nó là hồ sơ hỏng trước đó.
const UAT_STATE = { release: 'released', iterate: 'uat-iterate', kill: 'uat-kill' };
// Khớp CHẶT khuôn tên plan YYYY-MM-DD-<slug>.md — substring trần khiến slug là
// tiền tố của slug khác dính plan không phải của nó (S4-r1, nextStep S3 oan)
const planSlug = f => { const m = f.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/); return m ? m[1] : null; };
const planExists = slug => [path.join(root, 'docs', 'superpowers', 'plans'), path.join(root, 'docs', 'plans')]
  .some(d => existsSync(d) && readdirSync(d).some(f => planSlug(f) === slug));
// since: timestamp frontmatter thắng mtime — cổng chờ lâu nhất không được trôi
// xuống cuối nhóm chỉ vì file bị format/sync chạm lại (AC-6, đối chứng P98)
const since = (file, fmTs) => fmTs || statSync(file).mtime.toISOString();

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
  if (cRead.err) { broken.push({ slug, file: 'contract.md', reason: ioReason(cRead.err) }); continue; }
  const cTxt = cRead.t;
  if (cTxt != null) {
    const statusRaw = fmOrNull(cTxt, 'status');
    if (statusRaw == null) { broken.push({ slug, file: 'contract.md', reason: 'frontmatter không parse được hoặc thiếu status' }); continue; }
    const status = statusRaw.toLowerCase();
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
      if (eRead.err) { broken.push({ slug, file: 'evidence-report.md', reason: ioReason(eRead.err) }); return null; }
      const eTxt = eRead.t;
      // Rỗng = VẮNG, kết luận một chỗ cho cả hai nhánh (S4-r1: frontmatterField
      // trả '' cho key-có-giá-trị-rỗng nên `== null` để lọt xuống offVocab(''))
      if (eTxt != null && !fmOrNull(eTxt, 'verdict')) { broken.push({ slug, file: 'evidence-report.md', reason: 'frontmatter không parse được hoặc thiếu verdict' }); return null; }
      return {
        exists: eTxt != null,
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
      if (uRead.err) { broken.push({ slug, file: 'uat-session.md', reason: ioReason(uRead.err) }); continue; }
      const uTxt = uRead.t;
      // Đường A (cơ hội đã quyết build/iterate) còn MỘT cổng người nữa: phiên
      // nghiệm thu. Đường B/C/E ship thẳng — không dựng phiên giả cho chúng.
      // CÓ đọc opportunity.md hay không là câu hỏi của luật chung, không phải
      // của chỗ này: đọc lười vẫn giữ (lỗi quyền ở file không dùng tới không
      // được quyết định ô của slug), nhưng điều kiện thì hỏi usesOpportunity.
      let oTxt = null;
      if (usesOpportunity(cTxt, uTxt)) {
        const oR = read(oPath);
        if (oR.err) { broken.push({ slug, file: 'opportunity.md', reason: ioReason(oR.err) }); continue; }
        oTxt = oR.t;
      }
      // MỘT lượt hỏi luật chung cho CẢ tập hồ sơ được tiêu thụ. Kiểm tay từng
      // field là cách chắc chắn sót một field — sót field nào thì bản đồ với
      // bộ quét lệch nhau đúng ở đó (r12: stage/frontmatter của opportunity;
      // r13: stage của phiên nghiệm thu, và decision lạ khi stage chưa quyết).
      const texts = consumedTexts({ contract: cTxt, opportunity: oTxt, uat: uTxt });
      const problem = recordProblem(texts);
      if (problem) { broken.push({ slug, ...problem }); continue; }
      const { decision, verdict } = navValues(texts);
      // verdict RỖNG = phiên đã dựng nhưng CHƯA ký → rơi xuống ô chờ-Cổng-Giá-trị
      if (verdict) { done.push({ slug, state: UAT_STATE[verdict] }); continue; }
      if (decision === 'build' || decision === 'iterate')
        gates.push({ slug, gate: 'gia-tri', since: since(cPath, fmOrNull(uTxt, 'decided_at')), tier });
      else done.push({ slug, state: 'signed-off' });
    }
    else if (status === 'verified') {
      // Bảng phân ô spec: chờ-Cổng-Bằng-chứng = verdict đã-chốt (PASS/PENDING-
      // JUDGMENT) và CHƯA human_signoff — verified không kèm điều kiện là hiện
      // "chờ ký" oan (S4-r1)
      const ev = readEvidence();
      if (ev) {
        const meaning = VERDICT_MEANING[ev.verdict];
        if (!ev.exists) broken.push({ slug, file: '(workspace)', reason: 'status verified nhưng thiếu evidence-report.md' });
        else if (ev.signoff) done.push({ slug, state: 'signed-off' });
        else if (!meaning) broken.push({ slug, ...offVocab(ev.verdict) });
        else if (meaning.settled) gates.push({ slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier });
        else inProgress.push({ slug, status, nextStep: meaning.nextStep, tier });
      }
    }
    else if (status === 'implemented') {
      const ev = readEvidence();
      if (ev) {
        // Chưa có evidence = máy chưa chấm lần nào → bước kế là nghiệm thu máy
        const meaning = !ev.exists ? { nextStep: 'S4' } : VERDICT_MEANING[ev.verdict];
        if (!meaning) broken.push({ slug, ...offVocab(ev.verdict) });
        else inProgress.push({ slug, status, nextStep: meaning.nextStep, tier });
      }
    }
    else if (status === 'approved') inProgress.push({ slug, status, nextStep: planExists(slug) ? 'S3' : 'S2', tier });
    else if (status === 'draft') gates.push({ slug, gate: 'pham-vi', since: since(cPath, null), tier });
    else broken.push({ slug, file: 'contract.md', reason: `status không nhận diện được: ${status || '(rỗng)'}` });
    continue;
  }
  // Không có contract.md — GIỜ mới đọc opportunity.md (xem ghi chú ở trên)
  const oRead = read(oPath);
  if (oRead.err) { broken.push({ slug, file: 'opportunity.md', reason: ioReason(oRead.err) }); continue; }
  // MỌI field điều hướng qua LUẬT CHUNG, kể cả khi trạng thái không dùng tới
  // nó để xếp ô. Bảng enum chép tay ở đây là chỗ r13 lệch: `decision` ngoài từ
  // vựng lọt im lặng vì nhánh `stage !== 'decided'` rẽ TRƯỚC khi nó được đối
  // chiếu — hồ sơ ghi dở phải được NÊU TÊN, không hoá thành "chờ-Cổng-Đáng".
  // recordProblem cũng trả luôn ca không-có-cả-hai-hồ-sơ (ANCHOR_FILES).
  const texts = consumedTexts({ contract: null, opportunity: oRead.t, uat: null });
  const problem = recordProblem(texts);
  if (problem) { broken.push({ slug, ...problem }); continue; }
  const { stage, decision } = navValues(texts);
  if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', since: since(oPath, fmOrNull(oRead.t, 'decided_at')), tier: null });
  else if (decision === 'build' || decision === 'iterate') inProgress.push({ slug, status: 'opportunity-decided', nextStep: 'S1', tier: null });
  else done.push({ slug, state: decision });
}
gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));

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
// grill kit-own, KHÔNG cờ đỏ, không chặn (đường fallback phải sống ở repo
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
if (map.present) {
  // fresh = null khi KHÔNG kiểm được (không phải "khớp"): thẻ nói "chưa kiểm
  // được bản đồ", không nói xanh.
  try {
    const { renderProductMap } = await import('./product-map.mjs');
    map.fresh = readFileSync(mapPath, 'utf8') === renderProductMap(root);
  } catch { map.fresh = null; }
}

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, done }, map, discovery, broken });
