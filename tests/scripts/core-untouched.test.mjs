// JR11 (judge-required-evidence, AC-11) — lõi bằng chứng bất động + đường
// đọc-cũ: lib/** và hooks/** không đổi so với base; recheck strict trên corpus
// thật == baseline viết-trước (0 fail); đối chứng dương: tiêm 1 vi phạm biết
// trước vào BẢN SAO → recheck ĐỎ đúng thông điệp — lưới thật sự chạy.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, readdirSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { assertCorpus } from './mirror-sync-grandfather.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8' });

// NEO PHẠM VI RIÊNG (sửa 2026-08-07 — xem Amendment của judge-required-evidence).
//
// Bản đầu so `lib/**` + `hooks/**` với một base DI ĐỘNG (merge-base với
// origin/main). Viết thế thì câu nó khẳng định không còn là "feature NÀY không
// phải đụng lõi" mà thành "KHÔNG AI được đụng lõi, mãi mãi" — một bất biến chưa
// ai duyệt, và nó chặn đúng lát đầu tiên có lý do chính đáng để sửa `lib/`
// (crosslayer-uncoded, #36: Dấu cross-layer phải về cùng một nguồn với judgment).
// Cùng lớp với `check-manifest-unmoved.sh` bên repo tiêu thụ: ảnh chụp của MỘT
// PR viết ra trông như luật vĩnh viễn.
//
// Nay ghim vào đúng phạm vi commit mà judge-required-evidence sở hữu:
//   RANGE_BASE = cha của commit Cổng 1 của nó   (d2b6b19^)
//   RANGE_TIP  = commit chữ ký Cổng 2 của nó    (e6dad45)
// Đo tại thời điểm ghim: diff `lib`+`hooks` trên phạm vi này TRỐNG — tức lời
// khẳng định của AC-11 vẫn đúng, chỉ thôi bắt các lát sau chịu chung.
//
// KHÔNG dùng `verified_commit` của hồ sơ làm neo: sóng dogfood re-pin ghi đè nó
// sang commit làn mới nhất mỗi đợt (hiện trỏ ad46195), nên nó không neo được
// bất kỳ phạm vi lịch sử nào.
const JR11_RANGE_BASE = 'd2b6b194f9f174321b3f3a44e39a67d30d88c33d~1';
const JR11_RANGE_TIP  = 'e6dad45';

function haveCommit(rev) {
  try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', '-q', `${rev}^{commit}`], { stdio: 'ignore' }); return true; }
  catch (_) { return false; }
}

check('JR11a lib/** + hooks/** KHÔNG đổi TRONG PHẠM VI của judge-required-evidence', () => {
  // FAIL-CLOSED khi không resolve được mốc. Bản nháp đầu của tôi `return` im ở
  // đây — nhưng `check()` đếm một lần return êm là PASS, tức một phép đo KHÔNG
  // CHẠY lại báo xanh: đúng thứ false-green cả bộ kit sinh ra để chặn, và tôi
  // suýt tự tay dựng lại nó ngay trong cái guard đang đi sửa.
  // An toàn để fail-closed: cả hai job trong .github/workflows/gate.yml đều
  // `fetch-depth: 0`, nên CI luôn có đủ lịch sử. Clone nông tại chỗ mà đỏ là
  // đúng — nó nói "chưa đo được", không phải "đo rồi và sạch".
  for (const rev of [JR11_RANGE_BASE, JR11_RANGE_TIP]) {
    assert.ok(haveCommit(rev), `không resolve được mốc ${rev} — phép đo KHÔNG chạy (clone nông?). Fetch đủ sâu (CI dùng fetch-depth: 0) rồi chạy lại; đừng đọc dòng này là "lõi sạch"`);
  }
  // Răng chống rỗng: phạm vi phải thật sự chứa commit, nếu không thì diff trống
  // là trống-vì-không-có-gì chứ không phải trống-vì-lõi-bất-động.
  const n = Number(git('rev-list', '--count', `${JR11_RANGE_BASE}..${JR11_RANGE_TIP}`).trim());
  assert.ok(n > 0, `phạm vi rỗng (${n} commit) — phép đo tự-khớp, không chứng minh gì`);
  for (const d of ['lib', 'hooks']) {
    assert.ok(readdirSync(path.join(ROOT, d)).length > 0, `sanity: ${d}/ rỗng`);
    const diff = git('diff', '--name-only', JR11_RANGE_BASE, JR11_RANGE_TIP, '--', d).trim();
    assert.equal(diff, '', `lõi ${d}/ bị chạm TRONG phạm vi của feature:\n${diff}`);
  }
});

check('JR11b recheck strict trên corpus thật == baseline viết-trước (0 fail NGOÀI grandfather)', () => {
  // Baseline "0 fail" trần chết khi hồ sơ luu-kho gỡ khoá
  // `executors.script.mirror_sync` (AC-9 của nó): 21 hồ sơ ĐÃ KÝ có eval trỏ
  // khoá ấy nên đỏ vĩnh viễn, và không hồ sơ nào sửa được mà không viết vào vật
  // đã ký. Thay ngưỡng trần bằng ALLOWLIST CÓ TÊN + đúng-một-lý-do + kiểm hai
  // chiều — xem `mirror-sync-grandfather.mjs` (một bản, DV4a đọc chung).
  assertCorpus(assert, ROOT, 'JR11b');
});

check('JR11c đối chứng dương: tiêm token cấm vào BẢN SAO 1 report → recheck ĐỎ đúng thông điệp', () => {
  const acc = path.join(ROOT, '_acceptance');
  const src = readdirSync(acc).map(s => path.join(acc, s)).find(d => existsSync(path.join(d, 'evidence-report.md')));
  assert.ok(src, 'không có workspace nào để sao');
  const t = mkdtempSync(path.join(tmpdir(), 'jr11-'));
  const dir = path.join(t, '_acceptance', path.basename(src));
  mkdirSync(path.dirname(dir), { recursive: true });
  cpSync(src, dir, { recursive: true });
  const rp = path.join(dir, 'evidence-report.md');
  writeFileSync(rp, readFileSync(rp, 'utf8') + '\nghi chu tiem: verdict: FAIL\n');
  let err = '';
  try { execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.cjs'), rp], { stdio: ['ignore', 'ignore', 'pipe'] }); }
  catch (e) { err = String(e.stderr || ''); }
  assert.ok(err, 'bản tiêm vẫn xanh — lưới không chạy thật');
  assert.match(err, /CONSISTENCY/, `đỏ nhưng sai thông điệp: ${err.slice(0, 120)}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
