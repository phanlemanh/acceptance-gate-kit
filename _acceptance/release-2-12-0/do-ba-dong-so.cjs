#!/usr/bin/env node
'use strict';
/**
 * do-ba-dong-so.cjs — sinh BA DÒNG SỐ của luật (c) cho một cửa sổ phát hành.
 *
 * Vì sao tồn tại: lượt chấm 1 của hồ sơ này bắt được hai con số tôi GÕ TAY vào
 * `## Notes` đều sai — `cong-nguoi-doc-du-nguon` khai 39h01 trong khi hiệu thật là
 * 14h11 (lệch đúng 24 giờ), `cua-veto-sau-chu-ky` khai 9h03 trong khi thật là 10h02
 * vì tôi đo tới dòng run-log cuối chứ không tới chữ ký. Và phép đo của AC-4 là một
 * hội đồng ĐỌC CHÍNH VĂN ẤY, nên nó không thể thấy. Ba dòng số là thứ owner dùng để
 * quyết thu hồi luật NỚI; số gõ tay ở đó là đúng bệnh «đo hình thức» mà luật (c)
 * sinh ra để chặn.
 *
 *   node do-ba-dong-so.cjs --neo <sha mốc trước> [--root <kho>] [--json]
 *
 * ĐÂY LÀ CÔNG CỤ, KHÔNG PHẢI PHÉP ĐO. Lượt chấm 2 đã gỡ lối vào `--doi-chieu` vốn
 * định biến nó thành eval. Ba lý do, cả ba đo được:
 *   1. Nó ghim HÌNH DẠNG DIFF CỦA CHÍNH PR vào hồ sơ sắp ký: ô «số commit» đếm tới
 *      HEAD, nên commit chữ ký Cổng 2 và commit ghim-lại-sau-chữ-ký — hai commit
 *      BẮT BUỘC theo thiết kế — đều làm nó đỏ. Không có HEAD nào nó xanh được lúc
 *      ký. Đây là ca thứ NĂM của lớp «bất biến không được nằm trong hồ sơ đã ký»,
 *      và ghi chú của lớp ấy gọi đích danh «hình dạng diff của chính PR».
 *   2. Ô «số vòng» fail-open: khuôn `(NĂM|<n>)` nhận chữ NĂM nên số máy đo không
 *      bao giờ được dùng tới — đo được: máy đo 3, 5 hay 9 đều khớp.
 *   3. Ô «lượt chấm» quét TOÀN VĂN hợp đồng 280 dòng bằng `\b<n>\b`, và mọi chữ
 *      số 1..9 đều có mặt ở đâu đó — thước không gắn vào vật.
 * Ba mốc 2.9.0, 2.10.0 và 2.11.0 đều khai thẳng ba dòng số là VĂN ĐẾM TAY ở Known
 * limits. Hồ sơ này quay về đúng tiền lệ ấy, và script còn lại để SINH bảng chứ
 * không để chấm.
 *
 * MỌI ô đều rút từ vật đã có trong kho, không dựng phép đo mới:
 *   danh sách vòng        ← commit Cổng 2 trong cửa sổ (`Gate 2 signoff:` / `gate2(`)
 *   lượt chấm             ← max(round) trong `_acceptance/<slug>/run-log.jsonl`
 *   làm-xong→quyết-được   ← dòng `round` ĐẦU của run-log → thời điểm commit Cổng 2
 *   gọi người (CẬN DƯỚI)  ← số entry mang dấu người trong `decisions.jsonl`
 *                           (`seal` · `escalate` · có `decided_by`)
 *
 * GIỚI HẠN ĐÃ KHAI của cột cuối: nó là CẬN DƯỚI, không phải số lượt gọi người thật.
 * Một lượt gọi người sinh ra nhiều entry (hồ sơ này: một chữ «Ký» sinh 8 entry định
 * đoạt), và một lượt «Tiếp tục» không sinh entry nào. Số thật chỉ đếm tay được từ
 * phiên đã chạy vòng đó. Ô nào có số đếm tay thì truyền bằng `--tay <slug>=<n>`.
 *
 * Mọi đường dẫn suy từ vị trí tệp này.
 * exit 0 = in được bảng · 2 = nguồn thiếu/hỏng · 3 = usage.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const HO_SO = path.dirname(__filename);
const CAY = path.resolve(HO_SO, '..', '..');

function usage(m) { process.stderr.write(`do-ba-dong-so: ${m}\nusage: --neo <sha> [--root <kho>] [--tay <slug>=<n>]... [--json]\n`); process.exit(3); }
function die(m) { process.stderr.write(`do-ba-dong-so: ${m}\n`); process.exit(2); }

const o = { root: CAY, tay: {}, json: false };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--neo') o.neo = process.argv[++i];
  else if (a === '--root') o.root = path.resolve(process.argv[++i]);
  else if (a === '--json') o.json = true;
  else if (a === '--tay') { const [s, n] = String(process.argv[++i]).split('='); o.tay[s] = Number(n); }
  else usage(`cờ lạ ${a}`);
}
if (!o.neo) usage('thiếu --neo');

const G = (...args) => cp.execFileSync('git', ['-C', o.root, ...args], { encoding: 'utf8' }).trim();
let neoSha; try { neoSha = G('rev-parse', '--verify', o.neo + '^{commit}'); } catch { die(`không giải được neo "${o.neo}"`); }
const head = G('rev-parse', 'HEAD');
const soCommit = Number(G('rev-list', '--count', `${neoSha}..HEAD`));

// Vòng đóng trong cửa sổ: commit Cổng 2. Hai khuôn thông điệp cùng tồn tại trong kho.
const dong = G('log', `${neoSha}..HEAD`, '--format=%H\t%cI\t%s').split('\n').filter(Boolean);
const vong = new Map();
for (const l of dong) {
  const [sha, ts, ...rest] = l.split('\t');
  const s = rest.join('\t');
  let m = s.match(/^Gate 2 signoff:\s*([a-z0-9-]+)/) || s.match(/^gate2\(([a-z0-9-]+)\)/);
  if (!m) continue;
  if (!vong.has(m[1])) vong.set(m[1], { slug: m[1], sha, ky: ts });   // log là mới→cũ, giữ lần ĐẦU gặp = mới nhất
}
if (!vong.size) die(`không commit Cổng 2 nào trong ${neoSha.slice(0, 8)}..HEAD — cửa sổ rỗng hay neo sai?`);

const gio = (a, b) => { const h = (new Date(b) - new Date(a)) / 36e5; return h < 0 ? null : `${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, '0')}`; };

const hang = [];
for (const v of [...vong.values()].sort((a, b) => a.ky.localeCompare(b.ky))) {
  const ws = path.join(o.root, '_acceptance', v.slug);
  let luot = null, dau = null, goiNguoi = null;
  try {
    const ls = fs.readFileSync(path.join(ws, 'run-log.jsonl'), 'utf8').trim().split('\n')
      .map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean).filter(x => x.round);
    if (ls.length) { luot = Math.max(...ls.map(x => x.round)); dau = ls.map(x => x.ts).filter(Boolean).sort()[0] || null; }
  } catch { /* vắng run-log: để null, KHÔNG đoán */ }
  try {
    const ds = fs.readFileSync(path.join(ws, 'decisions.jsonl'), 'utf8').trim().split('\n')
      .map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    goiNguoi = ds.filter(d => d.type === 'seal' || d.type === 'escalate' || d.decided_by).length;
  } catch { /* vắng sổ */ }
  hang.push({
    slug: v.slug, luotCham: luot, batDau: dau, ky: v.ky,
    lamXongQuyetDuoc: dau ? gio(dau, v.ky) : null,
    goiNguoiCanDuoi: goiNguoi,
    goiNguoiDemTay: Object.prototype.hasOwnProperty.call(o.tay, v.slug) ? o.tay[v.slug] : null,
  });
}

const ket = { neo: neoSha, head, soCommit, soVong: hang.length, hang };
if (o.json) { process.stdout.write(JSON.stringify(ket, null, 2) + '\n'); process.exit(0); }

process.stdout.write(`cửa sổ ${neoSha.slice(0, 8)}..${head.slice(0, 8)} · ${soCommit} commit · ${hang.length} vòng đóng\n\n`);
process.stdout.write('| Vòng | Lượt chấm | làm-xong→quyết-được | Gọi người (cận dưới) | Gọi người (đếm tay) |\n');
process.stdout.write('|---|---:|---|---:|---:|\n');
for (const h of hang) {
  process.stdout.write(`| \`${h.slug}\` | ${h.luotCham ?? '—'} | ${h.lamXongQuyetDuoc ?? '—'} | ${h.goiNguoiCanDuoi ?? '—'} | ${h.goiNguoiDemTay ?? '—'} |\n`);
}
