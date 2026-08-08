#!/usr/bin/env node
// sign-batch.mjs — helper ký-gộp MỘT lệnh (GĐ1 tái lập, món 1b).
//
// Việc nó làm: với các hồ sơ `status: verified` (mặc định: tất cả; hoặc
// --slugs a,b), điền `human_signoff` vào evidence-report.md + nâng contract
// sang `signed-off`, rồi IN MỘT lệnh `git commit` đích danh các file vừa sửa
// để NGƯỜI tự chạy.
//
// Ranh giới cứng (giữ nguyên chuẩn bằng chứng — charter tái lập):
//   - Script này KHÔNG BAO GIỜ chạy git commit. Commit chữ ký là hành vi
//     người; `signoff.require_human_commit` giữ nguyên răng. Không có cờ nào
//     mở khoá điều này (quyết định d-...-S1, decisions.jsonl của
//     tai-lap-ceremony-diet).
//   - Hồ sơ ngoài trạng thái `verified` trong lô → TỪ CHỐI ghim tên slug,
//     exit 2 — không ký mù, không ký một phần rồi im.
//   - UNCERTAIN / human_override KHÔNG thuộc helper: hồ sơ có judgment chờ
//     override vẫn phải đi /signoff từng item. Helper chỉ gộp phần chữ ký.
//
// Usage: node scripts/sign-batch.mjs --name "Manh Phan" [--slugs a,b] [--root <repo>]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name') opt.name = args[++i];
  else if (args[i] === '--slugs') opt.slugs = args[++i];
  else if (args[i] === '--root') opt.root = args[++i];
  else { console.error(`cờ lạ: ${args[i]} — chỉ nhận --name, --slugs, --root`); process.exit(2); }
}
if (!opt.name || !opt.name.trim()) { console.error('THIẾU --name "<tên người ký>" — chữ ký phải mang tên người thật'); process.exit(2); }
if (/["`$\\]/.test(opt.name)) { console.error('TÊN chứa ký tự phá khuôn (" ` $ \\) — dùng tên trơn; chữ ký đi vào YAML và lệnh shell'); process.exit(2); }

const root = path.resolve(opt.root || '.');
const acc = path.join(root, '_acceptance');
if (!existsSync(acc)) { console.error(`không thấy _acceptance/ dưới ${root}`); process.exit(2); }

const wanted = opt.slugs ? opt.slugs.split(',').map(s => s.trim()).filter(Boolean) : null;
const all = readdirSync(acc).filter(d => existsSync(path.join(acc, d, 'contract.md')));
const slugs = wanted || all.filter(s => /^status:[ \t]*verified[ \t]*$/m.test(readFileSync(path.join(acc, s, 'contract.md'), 'utf8')));
if (wanted) for (const s of wanted) if (!all.includes(s)) { console.error(`slug không tồn tại: ${s}`); process.exit(2); }
if (!slugs.length) { console.error('không có hồ sơ nào ở trạng thái verified để ký'); process.exit(2); }

// Soát TRƯỚC cả lô — một hồ sơ hỏng là từ chối cả lô, không ký một phần.
const jobs = [];
const reject = [];
for (const slug of slugs) {
  const cPath = path.join(acc, slug, 'contract.md');
  const rPath = path.join(acc, slug, 'evidence-report.md');
  const contract = readFileSync(cPath, 'utf8');
  if (!/^status:[ \t]*verified[ \t]*$/m.test(contract)) { reject.push(`${slug}: contract không ở verified`); continue; }
  if (!existsSync(rPath)) { reject.push(`${slug}: thiếu evidence-report.md`); continue; }
  const report = readFileSync(rPath, 'utf8');
  // Khuôn template thật cho phép comment đuôi trên dòng human_signoff —
  // regex phải khớp mold (round-trip), không đòi dòng trống thuần.
  // MỌI regex frontmatter ở file này dùng [ \t] thay \s: \s khớp cả xuống
  // dòng nên 'bypass_ack:' bỏ trống từng LỌT qua nhờ ký tự của dòng kế
  // (fail-open r3, ma trận 6 hình dạng trong P187 giữ lằn ranh này).
  if (!/^human_signoff:[ \t]*(#.*)?$/m.test(report)) { reject.push(`${slug}: evidence-report không có dòng human_signoff trống (đã ký rồi, hoặc khuôn lạ)`); continue; }
  // Vế mở rộng AC-3 (người phê Cổng 2, 2026-08-08): KHÔNG ký hồ sơ còn
  // việc-của-người — verdict phải là PASS sạch, bypass phải có người nhận.
  const verdict = (report.match(/^verdict:[ \t]*([^\s#]+)/m) || [, ''])[1];
  if (verdict !== 'PASS') { reject.push(`${slug}: verdict là ${verdict || '(trống)'} — còn việc-của-người (chỉ ký PASS; PENDING-JUDGMENT đi /signoff từng item)`); continue; }
  const bypass = (report.match(/^bypass_used:[ \t]*([^\s#]+)/m) || [, ''])[1];
  if (bypass === 'true' && !/^bypass_ack:[ \t]*[^\s#]/m.test(report)) { reject.push(`${slug}: bypass_used chưa có bypass_ack — người phải nhận đường thoát trước khi ký`); continue; }
  jobs.push({ slug, cPath, rPath, contract, report });
}
if (reject.length) {
  console.error('TỪ CHỐI cả lô — không ký mù:');
  for (const r of reject) console.error('  - ' + r);
  process.exit(2);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // ngày LOCAL — chữ ký là hành vi người tại chỗ
const files = [];
for (const j of jobs) {
  writeFileSync(j.rPath, j.report.replace(/^human_signoff:[ \t]*(#.*)?$/m, () => `human_signoff: "${opt.name} ${today}"`));
  writeFileSync(j.cPath, j.contract.replace(/^status:[ \t]*verified[ \t]*$/m, 'status: signed-off'));
  files.push(path.relative(root, j.rPath), path.relative(root, j.cPath));
  console.log(`ký: ${j.slug}`);
}

console.log(`\nĐã điền chữ ký "${opt.name} ${today}" cho ${jobs.length} hồ sơ.`);
console.log('BƯỚC CỦA NGƯỜI — đọc thẻ/diff rồi TỰ chạy đúng một lệnh commit này:');
console.log('');
console.log(`  git add ${files.join(' ')} && git commit -m "signoff(lô ${jobs.length} hồ sơ): ${opt.name} ký Cổng 2 — ${jobs.map(j => j.slug).join(', ')}"`);
console.log('');
console.log('(sign-batch không tự commit — commit chữ ký là hành vi người, require_human_commit giữ nguyên.)');
