#!/usr/bin/env node
// doc-cu.mjs — AC-8 vế đông cứng: làn của SAU-G3 (khoá model_carry_cmd bật) ghi hai lượt — lượt 2 dùng lại
// E1 — rồi bộ đọc của mốc trước vòng (`recheck-evidence.cjs` ở BASE_G3, hai bản `git archive`) đọc báo cáo
// của kho thử: phải thoát 0 (đường đọc-cũ, kho tiêu thụ không chép lại lớp CI). Đối chứng: sửa
// `evals_exit.E1` của dòng repin cuối thành 1 → bộ đọc cũ thoát khác 0 và nêu E1 (nó thật sự đọc dòng).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { mkKho } from '../../../tests/scripts/gia-lan-fixture.mjs';
import { baseG3, sauG3, banSao, THU_MUC_BAN_MAY } from './ban-sao.mjs';

const loi = [];
let base, sau;
try { base = baseG3(); sau = sauG3(); } catch (e) { console.log(`ĐỎ hạ tầng: ${e.message}`); process.exit(1); }
const gSau = banSao(sau, THU_MUC_BAN_MAY), gBase = banSao(base, THU_MUC_BAN_MAY);
const k = mkKho({
  config: '  model_evals: [feat/E1]\n  model_carry_cmd: "echo m1"\n',
  evals: [{ id: 'E1', cmd: 'rang_e1', sh: 'sh tools/e1.sh', paths: ['src/a.txt'] }, { id: 'E2', cmd: 'rang_e2' }],
  files: { 'tools/e1.sh': 'echo ran >> "$GG_DAU/E1.txt"\nexit 0\n', 'src/a.txt': 'a\n' },
  lane: path.join(gSau, 'feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: gSau,
});
for (let n = 1; n <= 2; n += 1) {
  const r = k.lane(['--write']);
  if (r.status !== 0) { console.log(`ĐỎ: làn SAU-G3 lượt ${n} mã ${r.status}\n${r.stderr.split('\n').slice(-6).join('\n')}`); process.exit(1); }
  k.git('add', '-A'); k.git('commit', '-qm', `repin ${n}`);
}
const cuoi = k.docLog().filter(l => l.kind === 'repin').pop();
if (!cuoi.evals_carry || !cuoi.evals_carry.E1) loi.push(`lượt 2 không dùng lại E1 — phép đo không đo điều nó hứa: ${JSON.stringify(cuoi)}`);
const doc = () => spawnSync(process.execPath, [path.join(gBase, 'scripts', 'recheck-evidence.cjs'), path.join(k.ws, 'evidence-report.md')], { encoding: 'utf8' });
const r1 = doc();
if (r1.status !== 0) loi.push(`bộ đọc mốc ${base.slice(0, 7)} từ chối pin dùng lại: mã ${r1.status}\n${r1.stdout}${r1.stderr}`);
const f = path.join(k.ws, 'run-log.jsonl');
const dong = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean);
const i = dong.map(l => JSON.parse(l).kind).lastIndexOf('repin');
const o = JSON.parse(dong[i]); o.evals_exit.E1 = 1; dong[i] = JSON.stringify(o);
fs.writeFileSync(f, dong.join('\n') + '\n');
const r2 = doc();
if (r2.status === 0 || !/E1/.test(r2.stdout + r2.stderr)) loi.push(`bộ đọc mốc không đọc dòng repin (sửa evals_exit.E1 = 1 vẫn qua): mã ${r2.status}`);
if (loi.length) { console.log(`AC-8 bên đọc cũ: ĐỎ\n  - ${loi.join('\n  - ')}`); process.exit(1); }
console.log(`AC-8 bên đọc cũ: XANH — bộ đọc mốc ${base.slice(0, 7)} đọc pin dùng lại của SAU-G3 ${sau.slice(0, 7)} (mã 0); dòng bị sửa → mã ${r2.status}, nêu E1`);
