// Chân E8 (song song cùng kết quả) + E9 (lời lỗi không xen) của lan-ghim-lai-theo-paths.
// Làn THẬT của cây đang kiểm. Kho mẫu ghim bằng suite xanh, rồi ĐỔI suite sang lệnh của ca.
import { spawnSync } from 'node:child_process';
import { rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dungKho, banSao, KIT } from './kho-mau.mjs';
import { batDo } from './chieu-do.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const Y = 'schema_version: 1\nfeature_slug: feat\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_ok\n    expected: exit 0\n    paths: ["src/**"]\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n';
const LANE = (eng) => path.join(eng, 'feature-loop', 'scripts', 'repin-lane.mjs');

// Kho có pin xanh, rồi cấu hình đổi sang suite của ca (+ khoá song song nếu bật). Commit để cây sạch.
function kho(suites, songSong, evalCmd = 'true') {
  const k = dungKho({ evalsYaml: Y });
  const cfg = path.join(k.AR, '_acceptance/config.yaml');
  let t = readFileSync(cfg, 'utf8');
  t = t.replace(/  suite_keys:\n(?:    - .*\n)+/, '  suite_keys:\n' + suites.map((_, i) => `    - executors.test.s${i}\n`).join('') + (songSong ? '  repin_parallel_suites: true\n' : ''));
  t = t.replace(/  test:\n(?:    \S.*\n)+/, '  test:\n' + suites.map((c, i) => `    s${i}: ${JSON.stringify(c)}\n`).join(''));
  t = t.replace(/    rang_ok: .*\n/, `    rang_ok: ${JSON.stringify(evalCmd)}\n`);
  writeFileSync(cfg, t);
  k.git('add', '-A'); k.git('commit', '-qm', 'suite cua ca');
  return k;
}
const chay = (eng, k, args = ['--reason', 'ss', '--write']) => {
  const log0 = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8');
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [LANE(eng), '--root', k.AR, '--ag-root', KIT, '--slug', 'feat', ...args], { encoding: 'utf8' });
  const giay = (Date.now() - t0) / 1000;
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* làn đỏ vẫn in JSON — để null nếu hỏng */ }
  const moi = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8').slice(log0.length).split('\n').filter(Boolean).map(l => JSON.parse(l));
  return { st: r.status, err: r.stderr || '', suites: j ? j.suites.map(x => x.exit) : null, pin: moi.some(o => o.kind === 'repin'), giay };
};

if (chan === 'song-song') {
  const CA = [
    { ten: 'tất xanh', s: ['sleep 3', 'sleep 2', 'sleep 1'] },
    { ten: 'một đỏ', s: ['sleep 3; exit 4', 'sleep 2', 'sleep 1'] },
    { ten: 'hai đỏ', s: ['sleep 3; exit 4', 'sleep 2; exit 5', 'sleep 1'] },
    { ten: 'lệnh trùng', s: ['sleep 2', 'sleep 2', 'sleep 1; exit 3'] },
  ];
  ok(CA.length === 4, 'E8 đúng 4 ca');
  for (const c of CA) {
    const kN = kho(c.s, false), kS = kho(c.s, true);
    const n = chay(KIT, kN), s = chay(KIT, kS);
    ok(n.suites && JSON.stringify(n.suites) === JSON.stringify(s.suites) && n.st === s.st && n.pin === s.pin,
      `E8 ${c.ten}: nối đuôi ${JSON.stringify(n.suites)}/${n.st}/${n.pin ? 'pin' : '-'} = song song ${JSON.stringify(s.suites)}/${s.st}/${s.pin ? 'pin' : '-'}`);
    if (c.ten === 'tất xanh') {
      ok(s.giay < 5.5, `E8 song song: tổng ${s.giay.toFixed(1)}s < tổng sleep 6s (chạy cùng lúc thật)`);
      ok(n.giay >= 6, `E8 khoá vắng: tổng ${n.giay.toFixed(1)}s ≥ 6s (nối đuôi như cũ)`);
    }
    kN.don(); kS.don();
  }
  // chiều đỏ: bản sao ghi suites_exit theo thứ tự xong
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: '  return cmds.map((c, i) => {', thanh: '  return [...cmds].sort((a, b) => ((xong.get(a) || { ms: 0 }).ms - (xong.get(b) || { ms: 0 }).ms)).map((c, i) => {' }]);
  const kM = kho(CA[2].s, true), kR = kho(CA[2].s, false);
  const m = chay(sao, kM), r = chay(KIT, kR);
  const hoanVi = (a, b) => Array.isArray(a) && Array.isArray(b) && JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  ok(m.st === r.st && hoanVi(m.suites, r.suites) && JSON.stringify(m.suites) !== JSON.stringify(r.suites), `E8 chiều đỏ: bản sao chạy trọn (mã ${m.st}) nhưng xếp theo lúc xong ${JSON.stringify(m.suites)} — hoán vị khác thứ tự ${JSON.stringify(r.suites)} — «thứ tự theo lúc xong» được thấy`);
  kM.don(); kR.don(); rmSync(sao, { recursive: true, force: true });
  ket('E8');
} else if (chan === 'loi-khong-xen') {
  const XEN = ['for i in 1 2 3 4; do echo A-$i; sleep 0.3; done; exit 1', 'sleep 0.15; for i in 1 2 3 4; do echo B-$i; sleep 0.3; done; exit 2'];
  const khoi = (err, tien) => { const ls = err.split('\n'); const idx = ls.map((l, i) => (l.startsWith(`    ${tien}-`) ? i : -1)).filter(i => i >= 0); return idx.length === 4 && idx[3] - idx[0] === 3; };
  const k = kho(XEN, true, 'echo EVAL-CHAY');
  const r = chay(KIT, k, []);
  ok(r.st === 1 && khoi(r.err, 'A') && khoi(r.err, 'B'), 'E9 hai suite đỏ in xen theo thời gian → lời lỗi mỗi suite là MỘT khối liền');
  const iEval = r.err.indexOf('feat E1:'); const iSuiteCuoi = r.err.lastIndexOf('suite 2/2');
  ok(iEval > iSuiteCuoi && iSuiteCuoi >= 0, 'E9 eval bắt đầu SAU khi suite cuối xong (eval nối đuôi)');
  k.don();
  // ca biên KHÔNG bắn: một đỏ, hai xanh in nhiều dòng → không khối lời lỗi nào của suite xanh
  const k2 = kho(['for i in 1 2 3; do echo G1-$i; done', 'echo DO-1; exit 3', 'for i in 1 2 3; do echo G2-$i; done'], true);
  const r2 = chay(KIT, k2, []);
  ok(r2.st === 1 && !/^ {4}G[12]-/m.test(r2.err) && /^ {4}DO-1$/m.test(r2.err), 'E9 ca biên: suite xanh KHÔNG in khối lời lỗi; suite đỏ có');
  k2.don();
  // chạm hồ sơ đã thông cổng → làn đỏ như cũ (chụp còn sống)
  const k3 = kho(['mkdir -p _acceptance/feat/evidence && echo x > _acceptance/feat/evidence/cham.txt', 'true'], true);
  const r3 = chay(KIT, k3, []);
  ok(r3.st === 1 && /_acceptance\/feat\/evidence\/cham\.txt/.test(r3.err), 'E9 suite song song ghi vào hồ sơ đã ký → làn đỏ, gọi tên tệp bị chạm');
  k3.don();
  // chiều đỏ: bản sao in dòng ngay khi nhận
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: "    p.stdout.on('data', d => { out += d; });", thanh: "    p.stdout.on('data', d => { out += d; process.stderr.write(String(d).split('\\n').filter(Boolean).map(l => '    ' + l + '\\n').join('')); });" }]);
  const k4 = kho(XEN, true);
  const r4 = chay(sao, k4, []);
  batDo(ok, 'E9 chiều đỏ: bản sao in ngay khi nhận → khối xen — «lời lỗi xen» được thấy', r4.st === 1 && /suite 2\/2/.test(r4.err) && ['A-1', 'A-4', 'B-1', 'B-4'].every(x => r4.err.includes(`    ${x}`)), !(khoi(r4.err, 'A') && khoi(r4.err, 'B')));
  k4.don(); rmSync(sao, { recursive: true, force: true });
  ket('E9');
}
