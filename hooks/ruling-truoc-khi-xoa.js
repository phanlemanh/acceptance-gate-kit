#!/usr/bin/env node
/*
 * ruling-truoc-khi-xoa.js — PreToolUse (matcher Bash) của acceptance-gate. Hồ sơ mot-so-ba-ve, ADR 0021.
 * superpowers xoá thư mục tạm .superpowers/sdd/<ws>/ ở bước Finish — cùng lúc là ruling trong progress.md
 * mất. Hook này neo vào LỆNH rm đệ quy (không vào chuỗi): đối số giải được về dưới .superpowers/sdd →
 * chạy cầu nối gặt ruling vào decisions.jsonl rồi mới cho xoá; gặt lỗi → exit 2 chặn kèm lệnh chạy tay.
 * Đối số mang thay thế shell ($, dấu huyền) không giải được: cho qua, khai một dòng (giới hạn đã khai).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const CAU_NOI = path.join(__dirname, '..', 'scripts', 'cau-noi-ruling.mjs');

function tachLenh(s) { // tách theo ; && || | xuống dòng, tôn trọng nháy
  const out = []; let cur = '', q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if (c === ';' || c === '\n' || c === '|' || (c === '&' && s[i + 1] === '&')) { out.push(cur); cur = ''; if (s[i + 1] === c) i++; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
function tachTu(s) { // trả [{ raw, val }]
  const out = []; let raw = '', val = '', q = null, co = false;
  for (const c of s) {
    if (q) { raw += c; if (c === q) q = null; else val += c; continue; }
    if (c === "'" || c === '"') { q = c; raw += c; co = true; continue; }
    if (/\s/.test(c)) { if (co || raw) out.push({ raw, val }); raw = ''; val = ''; co = false; continue; }
    raw += c; val += c;
  }
  if (co || raw) out.push({ raw, val });
  return out;
}
const laRm = t => t && (t.val === 'rm' || t.val.endsWith('/rm'));
const coThayThe = raw => /\$|`/.test(raw.replace(/'[^']*'/g, ''));
function workspacesBiXoa(command, cwd0) {
  const ws = new Set(), khongGiai = []; let cwd = cwd0;
  for (const lenh of tachLenh(command)) {
    const w = tachTu(lenh);
    if (!w.length) continue;
    if (w[0].val === 'cd') { if (w[1] && !coThayThe(w[1].raw)) cwd = path.resolve(cwd, w[1].val); continue; }
    if (!laRm(w[0])) continue;
    let deQuy = false; const args = []; let hetCo = false;
    for (const t of w.slice(1)) {
      if (!hetCo && t.val === '--') { hetCo = true; continue; }
      if (!hetCo && t.val.startsWith('-')) { if (t.val === '--recursive' || /^-[a-zA-Z]*[rR]/.test(t.val)) deQuy = true; continue; }
      args.push(t);
    }
    if (!deQuy) continue;
    for (const t of args) {
      if (coThayThe(t.raw)) { if (/superpowers|\$/.test(t.raw)) khongGiai.push(t.raw); continue; }
      const abs = path.resolve(cwd, t.val).replace(/\/+$/, '');
      const iSdd = abs.indexOf(`${path.sep}.superpowers${path.sep}sdd`);
      if (abs.endsWith(`${path.sep}.superpowers`) || abs.endsWith(`${path.sep}.superpowers${path.sep}sdd`)) {
        const sdd = abs.endsWith('sdd') ? abs : path.join(abs, 'sdd');
        if (fs.existsSync(sdd)) for (const d of fs.readdirSync(sdd)) if (fs.statSync(path.join(sdd, d)).isDirectory()) ws.add(path.join(sdd, d));
      } else if (iSdd >= 0) {
        const sdd = abs.slice(0, iSdd + `${path.sep}.superpowers${path.sep}sdd`.length);
        const rest = path.relative(sdd, abs).split(path.sep)[0];
        if (rest && rest !== '..') ws.add(path.join(sdd, rest));
      }
    }
  }
  return { ws: [...ws], khongGiai };
}
module.exports = { workspacesBiXoa };

if (require.main === module) {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  if (input.tool_name && input.tool_name !== 'Bash') process.exit(0);
  const command = (input.tool_input && input.tool_input.command) || '';
  const { ws, khongGiai } = workspacesBiXoa(command, input.cwd || process.cwd());
  for (const k of khongGiai) console.error(`ruling-truoc-khi-xoa: không giải được đường: ${k} — ruling trong đó (nếu có) chưa được gặt; giới hạn đã khai`);
  for (const w of ws) {
    if (!fs.existsSync(w)) continue;
    const root = path.dirname(path.dirname(path.dirname(w)));
    // Kho chưa dùng kit (không có _acceptance/config.yaml): không có sổ nào để gặt vào — im, cho xoá.
    // acceptance-gate cài ở phạm vi người dùng nên hook chạy ở MỌI kho; chặn ở đây là chặn superpowers
    // ở kho không liên quan (sổ quyết định mot-so-ba-ve, dòng S3).
    if (!fs.existsSync(path.join(root, '_acceptance', 'config.yaml'))) continue;
    const r = spawnSync(process.execPath, [CAU_NOI, '--root', root, '--workspace', w, '--write'], { encoding: 'utf8' });
    if (r.status === 0) { if (r.stdout.trim()) console.log(r.stdout.trim()); continue; }
    const lyDo = (r.stderr || '').trim().split('\n')[0] || `exit ${r.status}`;
    console.error(`ruling-truoc-khi-xoa: ruling chưa vào sổ — ${lyDo}; chạy tay: node ${CAU_NOI} --root ${root} --workspace ${w} --slug <slug> --write rồi xoá lại`);
    process.exitCode = 2;
  }
}
