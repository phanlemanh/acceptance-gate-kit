#!/usr/bin/env node
// ky-cong-dang.mjs — bộ GHI chữ ký Cổng Đáng. Lệnh duyệt (`/acceptance-gate:approve
// <slug> đáng: <lối>`, khoá model-invocation theo ADR 0002) gọi script này SAU khi người
// đã phát ngôn lối ra; script không hỏi ai, không quyết gì — nó chỉ ghi đúng lời người
// vào ô cơ hội, và TỪ CHỐI to khi lời đó không ghi được.
//
// Vì sao là một script chứ không phải lời dặn trong thân lệnh (ca thật 27/09, kho crm):
// không có lối ký Cổng Đáng có tên, nên người nói quyết định trong chat và máy tự sửa
// frontmatter bằng tay (commit 0a76458b của kho đó). Luật «ký là nhận ngưỡng» (gỡ tiền tố
// đề xuất) và «làm/lặp cần ngưỡng đã có» nếu chỉ sống bằng lời thì mỗi lượt ghi tay là
// một bản dựng mới của luật — đúng lớp «hai nguồn cho một luật» làm hỏng làn 01/09.
// Ở đây cả hai luật HỎI lib/nguong-o-co-hoi.cjs (luật ngưỡng) và lib/workspace-record.cjs
// (ô còn chờ Cổng Đáng không) — cùng hàm bộ quét vào phiên và bản đồ hỏi.
//
//   node ky-cong-dang.mjs --root <repo> --slug <slug> --loi <làm|lặp|xếp lại|dừng> --by "<tên>" [--at <ngày|ISO>]
//   node ky-cong-dang.mjs --loi-ra        # in bảng lối ra (một dòng một lối) rồi thoát
//
// Ghi: frontmatter `stage: decided` · `decision` · `decided_by` · `decided_at`; với làm/lặp
// gỡ tiền tố đề xuất khỏi các dòng của section Ngưỡng (và CHỈ section đó); nối một dòng sổ
// `seal` gate 0 khi hồ sơ có `decisions.jsonl`. Không đụng contract.md, không commit.
import { readFileSync, writeFileSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));
const WR = require(path.join(__dirname, '..', 'lib', 'workspace-record.cjs'));
const NG = require(path.join(__dirname, '..', 'lib', 'nguong-o-co-hoi.cjs'));
const OPP_TEMPLATE = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');

// Bảng lối ra — MỘT nguồn. Thân lệnh duyệt in đúng bốn chữ bên trái (khối G0-LOI-RA của
// commands/approve.md); ca CD6 so hai bên bằng nhau. Bên phải là từ vựng `decision` của
// NAV_RULES — ca CD6 cũng so tập đó với lib, lệch một giá trị là đỏ.
const LOI_RA = [['làm', 'build'], ['lặp', 'iterate'], ['xếp lại', 'park'], ['dừng', 'kill']];
const CAN_NGUONG = new Set(['build', 'iterate']);

const args = process.argv.slice(2);
// Mỗi lối chết một thông điệp riêng (bài học P95: câu chung chỉ chứng được một nhánh).
const bail = msg => { process.stderr.write(`ky-cong-dang: ${msg}\n`); process.exit(2); };
if (args.includes('--loi-ra')) { process.stdout.write(LOI_RA.map(([a, b]) => `${a} -> ${b}`).join('\n') + '\n'); process.exit(0); }

const opt = {};
for (let i = 0; i < args.length; i++) {
  const k = args[i];
  if (!['--root', '--slug', '--loi', '--by', '--at'].includes(k)) bail(`tham số lạ ${k} — nhận --root --slug --loi --by --at`);
  if (i + 1 >= args.length || args[i + 1] === '') bail(`${k} khai báo nhưng thiếu giá trị`);
  opt[k.slice(2)] = args[++i].normalize('NFC');
}
const root = path.resolve(opt.root || '.');
if (!existsSync(root) || !statSync(root).isDirectory()) bail(`--root không phải thư mục: ${root}`);
if (!opt.slug) bail('thiếu --slug — nêu hồ sơ cần ký');
if (!opt.loi) bail(`thiếu --loi — một trong: ${LOI_RA.map(x => x[0]).join(' · ')}`);
const loi = LOI_RA.find(([a]) => a === opt.loi.trim().toLowerCase());
if (!loi) bail(`lối ra lạ «${opt.loi}» — chỉ nhận: ${LOI_RA.map(x => x[0]).join(' · ')}`);
const decision = loi[1];
if (!opt.by || !opt.by.trim()) bail('thiếu --by — chữ ký cần tên người (lệnh duyệt suy theo bậc thang danh tính rồi truyền vào)');
const at = opt.at ? opt.at.trim() : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
if (Number.isNaN(Date.parse(at))) bail(`--at không đọc được thành ngày: ${at}`);

const acc = path.join(root, '_acceptance');
if (!existsSync(path.join(acc, 'config.yaml'))) bail(`kho chưa mở sổ nghiệm thu — không thấy _acceptance/config.yaml dưới ${root}`);
const dir = path.join(acc, opt.slug);
if (!existsSync(dir)) bail(`không có hồ sơ «${opt.slug}» — _acceptance/${opt.slug}/ không tồn tại`);
const oPath = path.join(dir, 'opportunity.md');
const oR = WR.readRecord(oPath);
if (oR.err) bail(`opportunity.md của «${opt.slug}» ${WR.ioReason(oR.err)}`);
if (oR.t == null || !oR.t.trim()) bail(`hồ sơ «${opt.slug}» không có ô cơ hội (opportunity.md) — việc này không đi qua Cổng Đáng`);
const opp = oR.t;

const fp = WR.fieldProblem('opportunity.md', opp, 'stage') || WR.fieldProblem('opportunity.md', opp, 'decision');
if (fp) bail(`hồ sơ hỏng «${opt.slug}» — ${fp.reason}. Sửa đúng chỗ đó rồi ký lại`);
const truoc = WR.oCoHoiTruocPhamVi(opp);
if (truoc !== 'cho-cong-dang') {
  const { stage: st, decision: dec } = WR.navValues({ 'opportunity.md': opp });
  bail(st === 'archived'
    ? `ô «${opt.slug}» đã đóng hồ sơ — không có gì để ký; mở lại là một quyết định riêng`
    : `ô «${opt.slug}» đã quyết «${dec}» (${frontmatterField(opp, 'decided_by') || 'không rõ người'}, ${frontmatterField(opp, 'decided_at') || 'không rõ ngày'}) — ký lại là một quyết định riêng, không ghi đè`);
}

let tpl;
try { tpl = readFileSync(OPP_TEMPLATE, 'utf8'); } catch (e) { bail(`khuôn opportunity-template không đọc được: ${OPP_TEMPLATE} (${e.code || e.message})`); }
const ngTruoc = NG.thresholdState(opp, tpl);
if (CAN_NGUONG.has(decision) && ngTruoc === 'chua-chot')
  bail(`ngưỡng chưa chốt — «${loi[0]}» mở việc nên cần ngưỡng: điền section «${NG.UAT_THRESHOLD_HEADING}» (hoặc một dòng «${NG.prefixes(tpl).khongDo} <lý do>») rồi ký lại; «xếp lại»/«dừng» không cần ngưỡng`);

// ── Ghi. Mọi phép biến đổi làm trên chuỗi, kiểm lại bằng CHÍNH bộ đọc, rồi mới ghi đĩa.
const fm = opp.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)/);
if (!fm) bail(`opportunity.md của «${opt.slug}» không mở đầu bằng khối frontmatter`);
let khoi = fm[2];
const datKhoa = (k, v) => {
  const re = new RegExp(`^(${k}:)[^\\S\\r\\n]*([^#\\r\\n]*?)([^\\S\\r\\n]*#.*)?$`, 'm');
  if (re.test(khoi)) khoi = khoi.replace(re, (_, a, _b, c) => `${a} ${v}${c ? '  ' + c.trim() : ''}`);
  else khoi += `\n${k}: ${v}`;
};
datKhoa('stage', 'decided');
datKhoa('decision', decision);
datKhoa('decided_by', opt.by.trim());
datKhoa('decided_at', at);
let moi = fm[1] + khoi + fm[3] + opp.slice(fm[0].length);

// Ký làm/lặp là NHẬN ngưỡng: gỡ tiền tố đề xuất — CHỈ trong section Ngưỡng; tiền tố ở chỗ
// khác (bảng giả định, ghi chú) là chữ của hồ sơ, không phải ngưỡng, và không được chạm.
let goTienTo = 0;
if (CAN_NGUONG.has(decision) && ngTruoc === 'de-xuat') {
  const { deXuat } = NG.prefixes(tpl);
  const esc = deXuat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dong = moi.split('\n');
  const dau = dong.findIndex(l => l.replace(/\r$/, '').trim() === `## ${NG.UAT_THRESHOLD_HEADING}`);
  for (let i = dau + 1; dau >= 0 && i < dong.length && !/^#{1,2}\s/.test(dong[i]); i++) {
    const r = dong[i].replace(new RegExp(`^(\\s*[-*]\\s+[^:]+:\\s*)${esc}\\s*`), '$1');
    if (r !== dong[i]) { dong[i] = r; goTienTo++; }
  }
  moi = dong.join('\n');
}

// Tự kiểm bằng bộ đọc chung trước khi ghi: ô sau ký phải là «đã quyết» với đúng lối, và
// (làm/lặp) ngưỡng không còn là đề xuất. Sai là không ghi gì — một chữ ký nửa vời trên đĩa
// là thứ tệ hơn không ký.
const sau = WR.navValues({ 'opportunity.md': moi });
if (WR.fieldProblem('opportunity.md', moi, 'stage') || sau.stage !== 'decided' || sau.decision !== decision)
  bail(`tự kiểm hỏng — frontmatter sau khi ghi không đọc ra «decided/${decision}»; KHÔNG ghi gì`);
const ngSau = NG.thresholdState(moi, tpl);
if (CAN_NGUONG.has(decision) && ngSau === 'de-xuat')
  bail(`tự kiểm hỏng — ngưỡng vẫn còn tiền tố đề xuất sau khi gỡ (dòng viết khác khuôn?); KHÔNG ghi gì`);

writeFileSync(oPath, moi);
const L = path.join(dir, 'decisions.jsonl');
let soGhi = false;
if (existsSync(L)) {
  const n = readFileSync(L, 'utf8').split('\n').filter(l => l.trim()).length + 1;
  const id = `d-${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}-${n}`;
  appendFileSync(L, JSON.stringify({ id, type: 'seal', gate: 0, at, by: opt.by.trim(), decision }) + '\n');
  soGhi = true;
}
const buocKe = CAN_NGUONG.has(decision)
  ? (existsSync(path.join(dir, 'contract.md')) ? 'cong-pham-vi' : 'S1')
  : 'khong-ai';
process.stdout.write(JSON.stringify({ slug: opt.slug, stage: 'decided', decision, decided_by: opt.by.trim(), decided_at: at,
  nguong: ngSau, goTienTo, soGhi, buocKe }) + '\n');
