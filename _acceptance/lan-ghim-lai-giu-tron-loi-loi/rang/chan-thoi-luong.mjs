// E5 (AC-5) — wall_s + so_lenh trên dòng pin xanh; khuôn REPIN-TEMPLATE khớp (LN5).
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { dungKho, chayLan, banSao, bao, KIT } from './kho-mau.mjs';
const { ok, ket } = bao('E5');
const LANE = 'feature-loop/scripts/repin-lane.mjs';
const lam = () => dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'ngu2' }] }], suites: ['sleep 3', 'sleep 3'], scripts: { ngu2: 'sleep 2' } });
const pinMoi = (engine) => {
  const k = lam(); const t0 = Date.now();
  const r = chayLan(engine, k, ['feat'], ['--reason', 'do-thoi-luong', '--write']);
  const ngoai = (Date.now() - t0) / 1000;
  const ls = k.doc('_acceptance/feat/run-log.jsonl').split('\n').filter(l => l.includes('"kind":"repin"'));
  const d = JSON.parse(ls[ls.length - 1]); k.don(); return { r, d, ngoai };
};
const a = pinMoi(KIT);
ok(a.r.status === 0, `E5 làn xanh thoát 0 (${a.r.status})`);
ok(typeof a.d.wall_s === 'number' && a.d.wall_s >= 5 && a.d.wall_s <= a.ngoai + 1, `E5 wall_s ${a.d.wall_s} ∈ [5, đồng hồ ngoài ${a.ngoai.toFixed(1)} + 1]`);
ok(a.d.so_lenh === 2, `E5 so_lenh = 2 — hai suite trùng tính một + một eval (được ${a.d.so_lenh})`);
// ca biên KHÔNG bắn: không --write → run-log không đổi byte
{ const k = lam(); const t = k.doc('_acceptance/feat/run-log.jsonl'); chayLan(KIT, k, ['feat'], []); ok(k.doc('_acceptance/feat/run-log.jsonl') === t, 'E5 ca biên: làn xanh KHÔNG --write → run-log không đổi byte nào'); k.don(); }
// khuôn REPIN-TEMPLATE ↔ bên viết (LN5)
const ln = spawnSync(process.execPath, [path.join(KIT, 'tests/scripts/repin-lane.test.mjs')], { encoding: 'utf8' });
ok(/PASS: LN5/.test(ln.stdout) && !/FAIL: LN5/.test(ln.stdout), 'E5 ca LN5 (khoá dòng pin của script == khuôn SKILL) xanh');
// ba chiều đỏ
const M = [
  { pin: 'đếm lệnh trùng', sua: [{ tep: LANE, tu: 'const soLenh = results.size;', thanh: 'const soLenh = suiteCmds.length + perSlug.reduce((n, s) => n + s.evals.length, 0);' }], do: (d) => d.so_lenh !== 2 },
  { pin: 'thời lượng hằng', sua: [{ tep: LANE, tu: 'const wallS = Math.round((Date.now() - tBatDau) / 100) / 10;', thanh: 'const wallS = 0;' }], do: (d) => !(d.wall_s >= 5) },
  { pin: 'thời lượng một lệnh', sua: [
    { tep: LANE, tu: 'for (const s of perSlug) for (const e of s.evals) e.exit = runCmd(', thanh: 'const tEvalDau = Date.now();\nfor (const s of perSlug) for (const e of s.evals) e.exit = runCmd(' },
    { tep: LANE, tu: 'const wallS = Math.round((Date.now() - tBatDau) / 100) / 10;', thanh: 'const wallS = Math.round((Date.now() - tEvalDau) / 100) / 10;' }], do: (d) => !(d.wall_s >= 5) },
];
for (const m of M) { const sao = banSao(m.sua); const b = pinMoi(sao); ok(b.r.status === 0 && m.do(b.d), `E5 chiều đỏ: bản sao «${m.pin}» → thước thấy (wall_s ${b.d.wall_s}, so_lenh ${b.d.so_lenh})`); rmSync(sao, { recursive: true, force: true }); }
ket();
