// ntr-hieu-chuan.test.mjs — hồ sơ nhan-trang-thai-va-reality, AC-13 (E13): dòng hiệu chuẩn
// «ĐẠT đã ký → prod đỏ: k / N» (ADR 0020 Đ9). Dòng quan sát của fixture sinh từ khuôn RÚT
// từ khối THUC-TE-LINE của commands/observed.md (bên viết) — không dựng tay.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SCRIPT = path.join(KIT, 'scripts', 'hieu-chuan-moc.mjs');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-hc-'));
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');

const khuon = (() => {
  const m = readFileSync(path.join(KIT, 'commands', 'observed.md'), 'utf8').match(/<!-- <<<THUC-TE-LINE -->\n\s*([^\n]+)\n\s*<!-- THUC-TE-LINE>>> -->/);
  if (!m) throw new Error('khong rut duoc khoi THUC-TE-LINE tu commands/observed.md');
  return m[1].trim();
})();
let n = 0;
const tt = () => `{"id":"d-20260921T100000Z-${++n}",` + khuon.replace('<ISO ngày quan sát>', '2026-09-21').replace('<tên>', 'Manh')
  .replace('<40-hex bản dựng đang phục vụ prod>', 'b'.repeat(40)).replace('<một câu người nói>', 'dang chay') + '}';
const doProd = () => JSON.stringify({ id: `d-20260922T100000Z-${++n}`, type: 'revisit', stage: 'gate2', at: '2026-09-22T10:00:00Z', decision: 'prod đỏ — sự cố thanh toán', impact: 'x' });
const kho = hoSo => {
  const r = mkdtempSync(path.join(TMP, 'k-'));
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  for (const [slug, dong] of Object.entries(hoSo)) {
    mkdirSync(path.join(r, '_acceptance', slug), { recursive: true });
    writeFileSync(path.join(r, '_acceptance', slug, 'decisions.jsonl'), dong.join('\n') + '\n');
  }
  return r;
};
const chay = r => spawnSync(process.execPath, [SCRIPT, '--root', r], { encoding: 'utf8' });

try {
  // ba hồ sơ quan sát hợp lệ; một có «prod đỏ» SAU quan sát (đếm), một có «prod đỏ» TRƯỚC (không đếm);
  // một hồ sơ không có dòng quan sát (ngoài mẫu số).
  const r = kho({ a: [tt(), doProd()], b: [doProd(), tt()], c: [tt()], d: [doProd()] });
  const x = chay(r);
  if (x.status !== 0 || x.stdout.trim() !== 'ĐẠT đã ký → prod đỏ: 1 / 3') bad('NH-AC13-so', `thoat ${x.status}, in «${x.stdout.trim()}»`);
  else ok('NH-AC13-so', '— ba hồ sơ quan sát, một prod đỏ sau quan sát: «1 / 3»');
} catch (e) { bad('NH-AC13-so', loi(e)); }

try {
  const r = kho({ d: [doProd()] });
  const out = chay(r).stdout;
  if (out.trim() !== 'ĐẠT đã ký → prod đỏ: vô hiệu (N = 0)') bad('NH-AC13-vo-hieu', `in «${out.trim()}»`);
  else if (out.includes('0 / 0') || out.includes('0 sự cố')) bad('NH-AC13-vo-hieu', 'in chuoi cam');
  else ok('NH-AC13-vo-hieu', '— không hồ sơ nào quan sát: «vô hiệu (N = 0)», không «0 / 0», không «0 sự cố»');
} catch (e) { bad('NH-AC13-vo-hieu', loi(e)); }

try {
  const g = readFileSync(path.join(KIT, 'GUIDE.md'), 'utf8');
  if (!/^\| 6 \| \*\*Hiệu chuẩn «đủ»\*\*.*scripts\/hieu-chuan-moc\.mjs/m.test(g)) bad('NH-AC13-guide', 'GUIDE khong co dong muc tieu tro scripts/hieu-chuan-moc.mjs');
  else ok('NH-AC13-guide', '— GUIDE có dòng mục tiêu thứ sáu trỏ lệnh hiệu chuẩn');
} catch (e) { bad('NH-AC13-guide', loi(e)); }

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-hieu-chuan)`);
process.exit(fail ? 1 : 0);
