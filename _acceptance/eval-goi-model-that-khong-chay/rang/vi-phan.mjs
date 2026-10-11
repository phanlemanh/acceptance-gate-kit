#!/usr/bin/env node
// vi-phan.mjs — AC-7 vế đông cứng: CÙNG kho thử (eval model E1 khai paths, KHÔNG khai model_carry_cmd), ba
// lượt bằng làn của mốc trước vòng (BASE_G3) và ba lượt bằng làn của SAU-G3 — hai bản `git archive` cố định,
// nên phép so không tự hết hạn khi vòng sau đổi làn. Phải bằng nhau: bộ đếm mỗi lệnh, tập khoá mọi dòng
// `repin`, tập khoá JSON stdout. Hai nguồn trùng nhau → ĐỎ «base trùng cây» (phép so rỗng).
import path from 'node:path';
import { mkKho } from '../../../tests/scripts/gia-lan-fixture.mjs';
import { baseG3, sauG3, banSao, cayCua, THU_MUC_BAN_MAY } from './ban-sao.mjs';

const loi = [];
let base, sau;
try { base = baseG3(); sau = sauG3(); } catch (e) { console.log(`ĐỎ hạ tầng: ${e.message}`); process.exit(1); }
if (cayCua(base, 'feature-loop/scripts') === cayCua(sau, 'feature-loop/scripts')) { console.log(`ĐỎ: base trùng cây (${base.slice(0, 7)} ↔ ${sau.slice(0, 7)})`); process.exit(1); }
const goc = { base: banSao(base, THU_MUC_BAN_MAY), sau: banSao(sau, THU_MUC_BAN_MAY) };
const E1 = 'echo ran >> "$GG_DAU/E1.txt"\nexit 0\n';
const dung = (ben) => mkKho({
  config: '  model_evals: [feat/E1]\n',
  evals: [{ id: 'E1', cmd: 'rang_e1', sh: 'sh tools/e1.sh', paths: ['src/a.txt'] }, { id: 'E2', cmd: 'rang_e2' }],
  files: { 'tools/e1.sh': E1, 'src/a.txt': 'a\n' },
  lane: path.join(goc[ben], 'feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: goc[ben],
});
const kq = {};
for (const ben of ['base', 'sau']) {
  const k = dung(ben);
  const out = [];
  for (let n = 1; n <= 3; n += 1) {
    const r = k.lane(['--write']);
    if (r.status !== 0) { loi.push(`${ben} lượt ${n}: mã ${r.status}\n${r.stderr.split('\n').slice(-6).join('\n')}`); break; }
    out.push(JSON.parse(r.stdout));
    k.git('add', '-A'); k.git('commit', '-qm', `repin ${n}`);
  }
  kq[ben] = {
    dem: ['suite.txt', 'E1.txt', 'E2.txt'].map(t => `${t}=${k.dem(t)}`).join(' '),
    dong: k.docLog().filter(l => l.kind === 'repin').map(l => Object.keys(l).join(',')),
    stdout: out.map(o => `${Object.keys(o).join(',')}|${Object.keys(o.slugs.feat).join(',')}`),
  };
}
if (!loi.length) {
  for (const x of ['dem', 'dong', 'stdout']) {
    const a = JSON.stringify(kq.base[x]), b = JSON.stringify(kq.sau[x]);
    if (a !== b) loi.push(`khoá vắng mà dòng đổi — ${x}: mốc ${a} · SAU-G3 ${b}`);
  }
  if (kq.sau.dem !== 'suite.txt=3 E1.txt=3 E2.txt=3') loi.push(`bộ đếm ${kq.sau.dem}, mong suite.txt=3 E1.txt=3 E2.txt=3`);
}
if (loi.length) { console.log(`AC-7 vi phân: ĐỎ\n  - ${loi.join('\n  - ')}`); process.exit(1); }
console.log(`AC-7 vi phân: XANH — mốc ${base.slice(0, 7)} ↔ SAU-G3 ${sau.slice(0, 7)}: ${kq.sau.dem}; ${kq.sau.dong.length} dòng repin cùng tập khoá; stdout cùng tập khoá`);
