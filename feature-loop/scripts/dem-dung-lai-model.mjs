#!/usr/bin/env node
// dem-dung-lai-model.mjs — đường đo của hồ sơ eval-goi-model-that-khong-chay (hàng G3): đếm trên run-log
// của MỌI hồ sơ xem làn ghim lại đã gọi model bao nhiêu lần, dùng lại bao nhiêu lần, và lượt nào «cùng băm
// mà kết quả khác» (carry_lech). Chỉ đọc; không gọi model, không ghi tệp.
//
//   node dem-dung-lai-model.mjs --root <kho> [--tu YYYY-MM-DD]
//
// In (mỗi dòng một ý, máy đọc được):
//   TỔNG — model_goi <n> · model_carry <n> · carry_lech <n>
//   <slug>/<E>: dùng lại <n> · carry_lech <n>                      (eval có dùng lại hoặc lệch)
//   carry_lech <slug>/<E> @ <lượt>: lệch không tất định | nghi thiếu đầu vào: <tệp, …> | không thấy nguồn
//   nguồn không có: <slug>/<E> → <run_id>
// Nhãn lệch: tệp git đổi giữa sha của lượt chạy thật cùng băm gần nhất trước đó và sha lượt lệch, trừ hai
// tệp làn tự ghi — rỗng thì cùng đầu vào mà kết quả khác (eval không tất định), khác rỗng thì có tệp đổi
// mà băm không thấy (`paths` thiếu đầu vào — ngưỡng CHẾT của ô cơ hội đọc nhãn này).
// «nguồn không có»: `evals_carry` trỏ run_id không có dòng `repin` nào trong run-log của chính hồ sơ —
// giới hạn «bên đọc không chứng chuỗi dùng lại», ngưỡng mở vòng răng bên đọc là ≥ 1 dòng.
// Mã thoát: 0 · 2 = --root không phải thư mục / tham số sai.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { docRunLog, TEP_LAN_GHI } from './lib/dung-lai-model.mjs';

const die = (m) => { console.error(`dem-dung-lai-model: ${m}`); process.exit(2); };
const a = process.argv.slice(2);
let root = null; let tu = null;
for (let i = 0; i < a.length; i += 1) {
  if (a[i] === '--root' && a[i + 1]) { root = a[i + 1]; i += 1; } else if (a[i] === '--tu' && /^\d{4}-\d{2}-\d{2}$/.test(a[i + 1] || '')) { tu = a[i + 1]; i += 1; } else die(`tham số lạ ${a[i]} — dùng --root <kho> [--tu YYYY-MM-DD]`);
}
if (!root) die('thiếu --root <kho>');
try { if (!fs.statSync(root).isDirectory()) die(`--root không phải thư mục: ${root}`); } catch { die(`--root không tồn tại: ${root}`); }
const goc = path.join(root, '_acceptance');
const slugs = fs.existsSync(goc) ? fs.readdirSync(goc).filter(s => fs.existsSync(path.join(goc, s, 'run-log.jsonl'))).sort() : [];

const trongKy = (o) => !tu || String(o.ts || '') >= tu;
const daChay = (o, id) => o.kind === 'repin' && o.evals_hash && typeof o.evals_hash[id] === 'string'
  && !(o.evals_carry && Object.prototype.hasOwnProperty.call(o.evals_carry, id)) && o.evals_exit && typeof o.evals_exit[id] === 'number';
function tepDoi(slug, tu_, den) {
  const r = spawnSync('git', ['-C', root, 'diff', '--name-only', '--relative', tu_, den], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  return r.stdout.split('\n').filter(Boolean).filter(f => !TEP_LAN_GHI.some(t => f === `_acceptance/${slug}/${t}`));
}

const daDem = new Set(); // mỗi lượt (run_id/lan_id) một lần — tong_ket giống nhau ở mọi hồ sơ của lượt
let modelGoi = 0, modelCarry = 0, soLech = 0;
const theoEval = new Map(); // `${slug}/${E}` → { dungLai, lech }
const dongLech = [], dongMat = [];
const mucEval = (k) => { if (!theoEval.has(k)) theoEval.set(k, { dungLai: 0, lech: 0 }); return theoEval.get(k); };
for (const slug of slugs) {
  const dong = docRunLog(fs.readFileSync(path.join(goc, slug, 'run-log.jsonl'), 'utf8'));
  const runIds = new Set(dong.filter(o => o.kind === 'repin' && o.run_id).map(o => o.run_id));
  dong.forEach((o, i) => {
    if ((o.kind !== 'repin' && o.kind !== 'repin-do') || !trongKy(o)) return;
    const luot = o.run_id || o.lan_id;
    if (o.tong_ket && luot && !daDem.has(luot)) {
      daDem.add(luot);
      modelGoi += Number(o.tong_ket.model_goi) || 0;
      modelCarry += Number(o.tong_ket.model_carry) || 0;
    }
    for (const [id, nguon] of Object.entries(o.kind === 'repin' && o.evals_carry ? o.evals_carry : {})) {
      mucEval(`${slug}/${id}`).dungLai += 1;
      if (!runIds.has(nguon)) dongMat.push(`nguồn không có: ${slug}/${id} → ${nguon}`);
    }
    for (const id of Array.isArray(o.carry_lech) ? o.carry_lech : []) {
      soLech += 1;
      mucEval(`${slug}/${id}`).lech += 1;
      const bam = o.evals_hash && o.evals_hash[id];
      const truoc = dong.slice(0, i).reverse().find(x => daChay(x, id) && x.evals_hash[id] === bam && o.evals_exit && x.evals_exit[id] !== o.evals_exit[id]);
      let nhan = 'không thấy nguồn';
      if (truoc) {
        const doi = tepDoi(slug, truoc.sha, o.sha);
        nhan = doi === null ? 'không so được (git)' : (doi.length ? `nghi thiếu đầu vào: ${doi.join(', ')}` : 'lệch không tất định');
      }
      dongLech.push(`carry_lech ${slug}/${id} @ ${luot}: ${nhan}`);
    }
  });
}
const ra = [`TỔNG — model_goi ${modelGoi} · model_carry ${modelCarry} · carry_lech ${soLech}`];
for (const [k, v] of [...theoEval].sort()) ra.push(`${k}: dùng lại ${v.dungLai} · carry_lech ${v.lech}`);
process.stdout.write([...ra, ...dongLech, ...dongMat].join('\n') + '\n');
