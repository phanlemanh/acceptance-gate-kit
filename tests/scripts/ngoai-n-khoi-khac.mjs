// E9c của hồ sơ ngoai-n-tu-dinh-tuyen — «không đổi bảng cổng», đo bằng máy so với sha GỐC CỐ ĐỊNH của
// vòng (HEAD lúc mở hồ sơ), KHÔNG merge-base: gốc ấy trôi, sau gộp thành so tệp với chính nó.
// Vòng sau sửa có chủ đích các khối này làm script đỏ ĐÚNG (hồ sơ thôi chứng chúng) — lúc đó eval đổi
// `status: not-run` kèm `superseded_by` theo GUIDE §7.1, không sửa sha.
//   node tests/scripts/ngoai-n-khoi-khac.mjs   → thoát 0 xanh · 1 lệch · 2 không đọc được gốc
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHA = 'd9d1f3a6';
const SKILL = 'feature-loop/skills/feature-loop/SKILL.md';
const HFL = 'skills/acceptance/references/human-facing-language.md';
const KHOI = [[SKILL, 'TRONG-DOT'], [SKILL, 'GOAL-TEMPLATE'], [SKILL, 'S5-SHIP-DEFAULT'], [HFL, 'GATE-ONESHOT-LAN-V']];
const LOI_GOI = /\s*\(trước đó: khối DINH-TUYEN-MAY\)/g;

const goc = f => { try { return execFileSync('git', ['-C', ROOT, 'show', `${SHA}:${f}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch { return null; } };
const khoi = (t, m) => { const r = t.match(new RegExp(`<!-- <<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>> -->`)); return r ? r[1] : null; };
// Đoạn «Bất biến dừng» + bảng trạng thái của SKILL, gỡ lời gọi khối mới.
const bangCong = t => {
  const bb = (t.split('\n').find(l => l.startsWith('**Bất biến dừng')) || '').replace(LOI_GOI, '');
  // Chỉ các DÒNG BẢNG của mục «State machine & resume» — mục ấy còn chứa khuôn REPIN-TEMPLATE mà vòng khác
  // sửa hợp lệ (đo 12/10: #316 thêm ba khoá dùng lại), không phải bảng cổng.
  const s = t.indexOf('## State machine & resume'), e = t.indexOf('\n## ', s + 1);
  const bang = (s < 0 ? '' : t.slice(s, e)).split('\n').filter(l => l.startsWith('|')).join('\n');
  return bb + '\n' + bang.replace(LOI_GOI, '');
};

function so(hienTai) {
  const loi = [], dong = [];
  for (const [f, m] of KHOI) {
    const a = khoi(goc(f) || '', m), b = khoi(hienTai[f], m);
    if (a == null || b == null) loi.push(`${m} vang (${f})`);
    else if (a !== b) loi.push(`${m} lech`);
    else dong.push(`khoi ${m} bang`);
  }
  const gS = goc(SKILL);
  if (bangCong(gS) === bangCong(hienTai[SKILL]) && bangCong(gS).split('\n').length > 8) dong.push('bat-bien-dung + bang trang thai: chi them loi goi DINH-TUYEN-MAY');
  else loi.push('bat-bien-dung/bang trang thai lech');
  return { loi, dong };
}

if (goc(SKILL) == null) { console.error(`khong doc duoc ${SHA}:${SKILL} — kho thiếu commit gốc (clone nông?)`); process.exit(2); }
console.log(`sha goc: ${SHA}`);
const hienTai = Object.fromEntries([SKILL, HFL].map(f => [f, readFileSync(path.join(ROOT, f), 'utf8')]));
const lanh = so(hienTai);
for (const d of lanh.dong) console.log(d);
if (lanh.loi.length) { for (const l of lanh.loi) console.log(l); process.exit(1); }
// Chiều đỏ trên CÙNG đầu vào: đổi một chữ trong GOAL-TEMPLATE của bản sao trong bộ nhớ.
const g = khoi(hienTai[SKILL], 'GOAL-TEMPLATE');
const doT = { ...hienTai, [SKILL]: hienTai[SKILL].replace(g, g.replace('HOÀN THÀNH', 'HOAN THANH')) };
const r = so(doT);
if (!r.loi.includes('GOAL-TEMPLATE lech')) { console.log('chieu do: KHONG bat duoc — phep so hang dung'); process.exit(1); }
console.log('chieu do: ok (ban sao doi GOAL-TEMPLATE -> "GOAL-TEMPLATE lech")');
// Chiều đỏ thứ hai — đổi một ô của bảng trạng thái trên bản sao trong bộ nhớ.
const hang = '| `implemented` | S4 VERIFY |';
if (!hienTai[SKILL].includes(hang)) { console.log('chieu do bang: KHONG tim thay hang mau — phep so khong kiem duoc'); process.exit(1); }
const r2 = so({ ...hienTai, [SKILL]: hienTai[SKILL].replace(hang, '| `implemented` | S4 VERIFY rồi Gate 2 |') });
if (!r2.loi.includes('bat-bien-dung/bang trang thai lech')) { console.log('chieu do bang: KHONG bat duoc'); process.exit(1); }
console.log('chieu do bang: ok (ban sao doi mot o bang -> "bat-bien-dung/bang trang thai lech")');
