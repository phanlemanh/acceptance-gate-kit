#!/usr/bin/env node
// start-scan.mjs — bộ quét vào phiên của /start: đọc _acceptance/*/ và xếp mỗi
// slug đúng MỘT ô theo bảng phân ô trong docs/specs/2026-08-03-start-command-design.md.
// CHỈ-ĐỌC tuyệt đối. Đầu ra: JSON một dòng (schema_version 1) — các key mà
// commands/start.md đọc được ghim trong khối START-SCAN-KEYS của chính file đó;
// case P99 round-trip giữ hai đầu khớp, P98 giữ bảng phân ô.
// Ô chưa có nguồn (PRODUCT-MAP, phiên nghiệm thu) emit skipped[] có tên —
// KHÔNG bịa dữ liệu thay thế (ledger d-descope 03/08 của start-command).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));

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
const read = p => {
  try { return { t: readFileSync(p, 'utf8'), err: null }; }
  catch (e) { return e.code === 'ENOENT' ? { t: null, err: null } : { t: null, err: e }; }
};
const ioReason = err => `không đọc được (${err.code})`;
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
    if (status === 'signed-off') done.push({ slug, state: 'signed-off' });
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
  const oTxt = oRead.t;
  if (oTxt != null) {
    const stageRaw = fmOrNull(oTxt, 'stage');
    if (stageRaw == null) { broken.push({ slug, file: 'opportunity.md', reason: 'frontmatter không parse được hoặc thiếu stage' }); continue; }
    const stage = stageRaw.toLowerCase();
    const decision = (frontmatterField(oTxt, 'decision') || '').toLowerCase();
    if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', since: since(oPath, frontmatterField(oTxt, 'decided_at')), tier: null });
    else if (decision === 'build' || decision === 'iterate') inProgress.push({ slug, status: 'opportunity-decided', nextStep: 'S1', tier: null });
    else if (decision === 'park' || decision === 'kill') done.push({ slug, state: decision });
    else broken.push({ slug, file: 'opportunity.md', reason: `decision không nhận diện được: ${decision}` });
  } else {
    broken.push({ slug, file: '(workspace)', reason: 'không có contract.md lẫn opportunity.md' });
  }
}
gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));

const skipped = [{ source: 'phiên-nghiệm-thu', reason: 'nguồn chưa dựng — F-B' }];
if (!existsSync(path.join(root, 'PRODUCT-MAP.md'))) skipped.unshift({ source: 'PRODUCT-MAP.md', reason: 'chưa có — F-B' });

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, done }, skipped, broken });
