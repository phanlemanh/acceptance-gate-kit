// dong-goi.test.mjs — các ca của hồ sơ dieu-phoi-dong-goi-loi (tên ca bắt đầu «DP1-»).
// Kho thử do chính ca dựng (git init trong thư mục tạm); mọi đường suy từ vị trí tệp này.
// Mỗi phép đo có cặp hai chiều trên cùng fixture: bản lành xanh trước, bản bị tiêm đỏ sau, ghim
// thông điệp.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp1-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const chep = (nguon, dich) => fs.cpSync(nguon, dich, { recursive: true });

// ---------- DP1-03: bước CI của gói (AC-3, E3b) ----------
const CHAY_BUOC_CI = path.join(DAY, 'chay-buoc-ci.mjs');

function banSaoCi() {
  const d = tam('dp1-ci-');
  chep(path.join(KIT, '.github', 'workflows', 'gate.yml'), path.join(d, '.github', 'workflows', 'gate.yml'));
  chep(GOI, path.join(d, 'dieu-phoi'));
  chep(path.join(DAY, 'loi'), path.join(d, 'tests', 'dieu-phoi', 'loi'));
  chep(CHAY_BUOC_CI, path.join(d, 'tests', 'dieu-phoi', 'chay-buoc-ci.mjs'));
  return d;
}

test('DP1-03-do ca-tiem-loi', () => {
  const d = banSaoCi();
  const chay = () => spawnSync(process.execPath, [path.join(d, 'tests', 'dieu-phoi', 'chay-buoc-ci.mjs'), '--root', d], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lanh = chay();
  assert.equal(lanh.status, 0, `đối chứng dương: bản sao lành phải xanh — ${lanh.stdout}`);
  assert.match(lanh.stdout, /^PASS: DP1-03 buoc-ci/m);

  const tep = path.join(d, 'tests', 'dieu-phoi', 'loi', 'lich.test.mjs');
  const goc = fs.readFileSync(tep, 'utf8');
  const m = /^test\('([^']+)'.*\{\s*$/m.exec(goc);
  assert.ok(m, 'không tìm thấy ca đầu của lich.test.mjs');
  const daTiem = goc.replace(m[0], `${m[0]}\n  assert.fail('tiem');`);
  assert.notEqual(daTiem, goc, 'bước tiêm không đổi tệp');
  fs.writeFileSync(tep, daTiem);
  const do_ = chay();
  assert.notEqual(do_.status, 0, `bản bị tiêm phải đỏ — ${do_.stdout}`);
  assert.ok(do_.stdout.includes(m[1]), `đầu ra phải nêu tên ca bị tiêm «${m[1]}»: ${do_.stdout}`);
});
