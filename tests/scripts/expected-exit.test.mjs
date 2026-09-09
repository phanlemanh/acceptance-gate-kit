import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const EY = require(path.join(HERE, '..', '..', 'lib', 'eval-yaml.cjs'));

let pass = 0, fail = 0;
const ok = (id, m) => { console.log(`  PASS: ${id} ${m}`); pass++; };
const bad = (id, m) => { console.log(`  DO: ${id} ${m}`); fail++; };
const t = (id, cond, m) => cond ? ok(id, m) : bad(id, m);

const Y = (body) => `evals:\n${body}`;
const ev = (id, executor, extra = '') =>
  `  - id: ${id}\n    executor: ${executor}\n    cmd: x\n${extra}`;

// EE1 vắng trường → 0
{
  const r = EY.expectedExits(Y(ev('E1', 'script')));
  t('EE1', r.errs.length === 0 && r.byId.get('E1') === 0, 'vắng trường → 0, không lỗi');
}
// EE2 khai 0 TƯỜNG MINH → BẰNG HỆT vắng trường
{
  const a = EY.expectedExits(Y(ev('E1', 'script')));
  const b = EY.expectedExits(Y(ev('E1', 'script', '    expected_exit: 0\n')));
  t('EE2', b.errs.length === 0 && b.byId.get('E1') === a.byId.get('E1'),
    'khai 0 tường minh bằng hệt vắng trường');
}
// EE3 khai hợp lệ
{
  const r = EY.expectedExits(Y(ev('E1', 'script', '    expected_exit: 2\n')));
  t('EE3', r.errs.length === 0 && r.byId.get('E1') === 2, 'khai 2 hợp lệ');
}
// EE4 sai kiểu — bốn hình dạng, mỗi cái phải lỗi VÀ nêu tên eval
for (const [i, v] of [['a', 'hai'], ['b', '-1'], ['c', '256'], ['d', '2.5']]) {
  const r = EY.expectedExits(Y(ev('E9', 'script', `    expected_exit: ${v}\n`)));
  t(`EE4${i}`, r.errs.length === 1 && r.errs[0].includes('E9'),
    `giá trị ${v} → lỗi gọi tên eval`);
}
// EE5 mã hạ tầng
for (const [i, v] of [['a', 97], ['b', 127]]) {
  const r = EY.expectedExits(Y(ev('E9', 'test', `    expected_exit: ${v}\n`)));
  t(`EE5${i}`, r.errs.length === 1 && r.errs[0].includes('E9') && r.errs[0].includes('hạ tầng'),
    `mã ${v} → lỗi nêu «hạ tầng»`);
}
// EE6 executor sai — thông điệp nêu TÊN executor
for (const [i, x] of [['a', 'judgment'], ['b', 'ui-check']]) {
  const r = EY.expectedExits(Y(ev('E9', x, '    expected_exit: 2\n')));
  t(`EE6${i}`, r.errs.length === 1 && r.errs[0].includes('E9') && r.errs[0].includes(x),
    `executor ${x} → lỗi nêu tên executor`);
}
// EE7 KHÔNG rơi thầm về 0: mọi ca lỗi ở trên không được vừa im vừa trả 0
{
  const r = EY.expectedExits(Y(ev('E9', 'script', '    expected_exit: hai\n')));
  t('EE7', r.errs.length > 0, 'khai sai không được im mà trả 0');
}
// EE8 danh sách mã cấm khớp khối marker INFRA-EXIT-CODES (round-trip)
{
  const fs = require('node:fs');
  const wf = fs.readFileSync(
    path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const blk = (wf.split('// <<<INFRA-EXIT-CODES')[1] || '').split('// INFRA-EXIT-CODES>>>')[0];
  const keys = [...blk.matchAll(/^\s*(\d+):/gm)].map(m => Number(m[1])).sort((a, b) => a - b);
  const banned = [...EY.EXPECTED_EXIT_BANNED].sort((a, b) => a - b);
  t('EE8', keys.length === 2 && JSON.stringify(keys) === JSON.stringify(banned),
    `mã cấm khớp marker: marker=${JSON.stringify(keys)} lib=${JSON.stringify(banned)}`);
}

console.log(`Results: expected-exit ${fail === 0 ? 'passed' : 'FAILED'} (${pass} pass, ${fail} do)`);
process.exit(fail === 0 ? 0 : 1);
