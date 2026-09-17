// s4-args-tran-thuoc.test.mjs — thuoc-co-cua AC-12 (E17): trần 3 nhát sửa thước ở
// implemented, MÁY giữ trong bộ sinh args. Chạm trần → mã 4, không tệp args (không có tệp
// thì không dispatch được), thông điệp ghim số nhát + ba lối + đúng một dòng lệnh mở vòng
// thước. Van: dòng sổ «trần thước — » ĐÃ commit dời mốc sàn.
//
//   TT1 đối chứng dương (im): hai nhát → mã 0, có tệp.
//   TT2 chiều đỏ (cùng fixture + đúng một commit thước): mã 4, không tệp, thông điệp ghim.
//   TT3 van: dòng sổ «trần thước — » commit → mã 0, có tệp.
//   TT4 dòng sổ ấy CHƯA commit → trần vẫn đóng.
//   TT5 chiều im: sau mốc sàn chỉ ghi hồ sơ ×3 và lẫn ×3 → mã 0, có tệp.
// Kho do code sinh (thuoc-vat-fixture.mjs, chung với thuoc-vat.test.mjs); đường dẫn suy từ
// vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { dungKho, buoc, ghiDongVan, SLUG } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-tran-'));
let n = 0;
const moiKho = kb => dungKho(path.join(TMP, `k-${++n}`), kb);

const run = d => {
  const out = path.join(TMP, `args-${++n}.json`);
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', SLUG, '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'],
    { encoding: 'utf8' });
  return { status: r.status, stderr: String(r.stderr || ''), coTep: existsSync(out) };
};
const cuoi = s => s.trim().split('\n').slice(-3).join(' | ');
const loi = e => String((e && e.message) || e).split('\n')[0];

// ── TT1 · TT2 · TT3 trên CÙNG một kho ───────────────────────────────────────
let tt1Xanh = false;
let tt2Xanh = false;
{
  try {
    const { d } = moiKho();
    const r1 = run(d);
    if (r1.status !== 0 || !r1.coTep) bad('TT1 hai nhat phai thoat 0 va sinh tep args', `exit ${r1.status} · tep ${r1.coTep} · ${cuoi(r1.stderr)}`);
    else { tt1Xanh = true; ok('TT1 doi chung duong — hai nhat o implemented: ma 0, co tep args'); }

    buoc(d, 'thuoc');
    const r2 = run(d);
    const dongLenh = r2.stderr.split('\n').map(s => s.trim()).filter(s => s.startsWith(`/feature-loop:feature-loop "thước của ${SLUG}:`));
    const baLoi = ['(1) khai gioi han co ten', '(2) doi cach do', '(3) mo vong co chu ngu la thuoc'];
    if (!tt1Xanh) bad('TT2 doi chung duong TT1 khong xanh — khong tin duoc chieu do');
    else if (r2.status !== 4) bad('TT2 ba nhat phai thoat ma 4', `exit ${r2.status} · ${cuoi(r2.stderr)}`);
    else if (r2.coTep) bad('TT2 cham tran ma van sinh tep args');
    else if (!r2.stderr.includes('tran nhat sua thuoc: 3 nhat')) bad('TT2 thong diep thieu «tran nhat sua thuoc: 3 nhat»', cuoi(r2.stderr));
    else if (baLoi.some(s => !r2.stderr.includes(s))) bad('TT2 thong diep thieu mot trong ba loi', baLoi.filter(s => !r2.stderr.includes(s)).join(' ; '));
    else if (dongLenh.length !== 1) bad('TT2 phai co DUNG MOT dong lenh mo vong thuoc mang slug', String(dongLenh.length));
    else { tt2Xanh = true; ok('TT2 chieu do — ba nhat: ma 4, khong tep args, thong diep ghim so nhat, ba loi va dung mot dong lenh'); }

    ghiDongVan(d, { commit: true });
    const r3 = run(d);
    if (!tt2Xanh) bad('TT3 chieu do TT2 khong xanh — khong tin duoc van');
    else if (r3.status !== 0 || !r3.coTep) bad('TT3 dong so «tran thuoc — » da commit phai mo tran', `exit ${r3.status} · tep ${r3.coTep} · ${cuoi(r3.stderr)}`);
    else ok('TT3 van — dong so «tran thuoc — » da commit: moc san doi, ma 0, co tep args');
  } catch (e) { bad('TT1/TT2/TT3 loi', loi(e)); }
}

// ── TT4: dòng sổ CHƯA commit không mở trần ──────────────────────────────────
{
  try {
    const { d } = moiKho();
    buoc(d, 'thuoc');
    const truoc = run(d);
    ghiDongVan(d, { commit: false });
    const r = run(d);
    if (truoc.status !== 4) bad('TT4 doi chung: ba nhat truoc khi ghi so phai ma 4', `exit ${truoc.status}`);
    else if (r.status !== 4 || r.coTep) bad('TT4 dong so chua commit ma tran da mo', `exit ${r.status} · tep ${r.coTep}`);
    else ok('TT4 dong so «tran thuoc — » chua commit — tran van dong, ma 4, khong tep');
  } catch (e) { bad('TT4 loi', loi(e)); }
}

// ── TT5 (chiều im): ba commit ghi hồ sơ + ba commit lẫn sau mốc sàn ──────────
{
  try {
    const { d } = moiKho(['vat', 'implemented', 'ho-so', 'ho-so', 'ho-so', 'lan', 'lan', 'lan']);
    const r = run(d);
    if (r.status !== 0 || !r.coTep) bad('TT5 chi ghi ho so va commit lan phai thoat 0 va sinh tep', `exit ${r.status} · tep ${r.coTep} · ${cuoi(r.stderr)}`);
    else ok('TT5 chieu im — ba commit ghi run-log va so, ba commit lan: ma 0, co tep args');
  } catch (e) { bad('TT5 loi', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-tran-thuoc)`);
process.exit(fail ? 1 : 0);
