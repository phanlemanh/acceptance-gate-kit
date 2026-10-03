// Chân E7 (một nguồn) + E10 (làn đọc-cũ) của lan-ghim-lai-theo-paths. Làn + lưới THẬT của cây
// đang kiểm; đường suy từ vị trí tệp. Mỗi chân: lành xanh trước, bản sao tiêm đỏ, thông điệp ghim.
import { spawnSync, execFileSync } from 'node:child_process';
import { rmSync, mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { dungKho, banSao, KIT } from './kho-mau.mjs';
import { MA_TRAN, M_SO_O } from './ma-tran.mjs';
import { banBase } from './ban-base.mjs';
import { daChayLan, batDo } from './chieu-do.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const HONG = new Set(['M7', 'M8', 'M12']);
const khoO = (o, staleScope) => { const k = dungKho({ evalsYaml: o.evalsYaml, ghimBangBanHopLe: HONG.has(o.id), staleScope }); k.apDiff(o.diff); return k; };
const pm = (pmFile, k) => spawnSync('bash', [pmFile, k.AR], { encoding: 'utf8' });
const lan = (laneFile, k, agRoot, args) => spawnSync(process.execPath, [laneFile, '--root', k.AR, '--ag-root', agRoot, '--slug', 'feat', ...args], { encoding: 'utf8' });
const coStale = (out) => /VIOLATION \[feat\]: evidence is stale/.test(out);
const boQua = (r) => r.status === 0 && /"skipped": true/.test(r.stdout || '');
const LANE = (eng) => path.join(eng, 'feature-loop', 'scripts', 'repin-lane.mjs');
const PMF = (eng) => path.join(eng, 'scripts', 'pre-merge-check.sh');
// Vế riêng của làn: tệp định nghĩa phép đo (config.yaml / evals.yaml) đổi sau pin → làn KHÔNG bỏ qua.
const dinhNghiaDoi = (o) => HONG.has(o.id) || o.diff.some(f => /(^|\/)_acceptance\/(config\.yaml|[^/]+\/evals\.yaml)$/.test(f));

if (chan === 'mot-nguon') {
  // (1) round-trip 12 ô: làn bỏ qua ⇔ lưới không gọi hoá cũ ∧ không tệp định nghĩa đổi.
  let soO = 0;
  for (const o of MA_TRAN) {
    const k = khoO(o, 'paths');
    const st = coStale(pm(PMF(KIT), k).stdout);
    const bq = boQua(lan(LANE(KIT), k, KIT, ['--skip-unchanged', '--allow-dirty']));
    const ky = !st && !dinhNghiaDoi(o);
    ok(bq === ky, `E7 ${o.id}: lưới ${st ? 'hoá cũ' : 'im'} · làn ${bq ? 'bỏ qua' : 'chạy'} (kỳ vọng làn ${ky ? 'bỏ qua' : 'chạy'})`);
    soO++; k.don();
  }
  ok(soO === M_SO_O, `E7 đúng ${M_SO_O} ô (được ${soO})`);
  // (2) tĩnh: MỘT định nghĩa, hai bên gọi, tệp lib nằm trong danh sách chép.
  const dinh = execFileSync('bash', ['-c', 'cd "$1" && grep -rln "function staleByPaths" scripts lib feature-loop || true', '_', KIT], { encoding: 'utf8' }).split('\n').filter(Boolean);
  ok(JSON.stringify(dinh) === JSON.stringify(['lib/evidence-core.cjs']), `E7 hàm vị từ định nghĩa ở ĐÚNG một tệp lib (${JSON.stringify(dinh)})`);
  ok(/staleByPaths/.test(readFileSync(PMF(KIT), 'utf8')) && /core\.staleByPaths/.test(readFileSync(LANE(KIT), 'utf8')), 'E7 lưới và làn cùng gọi staleByPaths');
  const khoi = (readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8').split('<<<INIT-CI-COPY-LIST')[1] || '').split('INIT-CI-COPY-LIST>>>')[0];
  const DS = [...khoi.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/(\S+?)` → `(\S+?)`/g)].map(m => ({ src: m[1], dst: m[2] }));
  ok(DS.some(d => d.src === 'lib/evidence-core.cjs'), `E7 lib/evidence-core.cjs có trong danh sách chép của acceptance-init (${DS.length} mục)`);
  // (3) KHO TIÊU THỤ dựng bằng CHÍNH danh sách chép; plugin feature-loop ở thư mục riêng ngoài kho.
  const tieuThu = (engine) => {
    const k = khoO(MA_TRAN.find(o => o.id === 'M2'), 'paths');
    for (const d of DS) { const dst = path.join(k.AR, d.dst, path.basename(d.src)); mkdirSync(path.dirname(dst), { recursive: true }); cpSync(path.join(engine, d.src), dst); }
    k.git('add', '-A'); k.git('commit', '-qm', 'cai bo may theo danh sach chep');
    const fl = mkdtempSync(path.join(tmpdir(), 'lgtp-fl-')); cpSync(path.join(engine, 'feature-loop'), path.join(fl, 'feature-loop'), { recursive: true });
    const p = pm(path.join(k.AR, 'scripts', 'pre-merge-check.sh'), k);
    const l = lan(LANE(fl), k, k.AR, ['--skip-unchanged', '--allow-dirty']);
    const out = { pmOut: p.stdout, lErr: l.stderr || '', lOut: l.stdout || '' };
    k.don(); rmSync(fl, { recursive: true, force: true }); return out;
  };
  const t = tieuThu(KIT);
  ok(/NOTE \[feat\]: hoá cũ theo luật cũ, bỏ qua theo paths/.test(t.pmOut) && !/bộ lọc paths không chạy được/.test(t.pmOut), 'E7 kho tiêu thụ: lưới bản chép lọc được (NOTE bỏ qua, KHÔNG «không chạy được»)');
  ok(/--skip-unchanged theo paths: bỏ qua/.test(t.lErr) && !/không lọc theo paths/.test(t.lErr), 'E7 kho tiêu thụ: làn từ plugin riêng lọc được (dòng bỏ qua, KHÔNG «không lọc»)');
  // chiều đỏ 1: lib nạp tệp NGOÀI danh sách chép → ở kho tiêu thụ bộ lọc không chạy
  const s1 = banSao([{ tep: 'lib/evidence-core.cjs', tu: 'function staleByPaths(staleFiles, evalsText, opts = {}) {', thanh: "function staleByPaths(staleFiles, evalsText, opts = {}) { require(path.join(__dirname, 'context-glossary.js'));" }]);
  const t1 = tieuThu(s1);
  ok(/bộ lọc paths không chạy được/.test(t1.pmOut), 'E7 chiều đỏ: lib nạp tệp ngoài danh sách chép → kho tiêu thụ báo «không chạy được» — «lib không tự đứng ở kho tiêu thụ» được thấy');
  // chiều đỏ 2: làn dùng luật cũ → lệch ở M2
  const s2 = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: "if (staleScope === 'paths' && doiSlug.length) {", thanh: "if (false && staleScope === 'paths' && doiSlug.length) {" }]);
  const k2 = khoO(MA_TRAN.find(o => o.id === 'M2'), 'paths');
  { const r2 = lan(LANE(s2), k2, KIT, ['--skip-unchanged', '--allow-dirty']); batDo(ok, 'E7 chiều đỏ: bản sao cho làn dùng luật cũ → lưới im mà làn chạy — «hai bên lệch» được thấy', daChayLan(r2.stderr) && /--skip-unchanged: \d+ tệp vật đổi so pin/.test(r2.stderr), !coStale(pm(PMF(KIT), k2).stdout) && !boQua(r2)); }
  // vế riêng của làn: evals.yaml đổi → KHÔNG bỏ qua dưới khoá paths
  const k3 = khoO(MA_TRAN.find(o => o.id === 'M2'), 'paths');
  writeFileSync(path.join(k3.AR, '_acceptance/feat/evals.yaml'), readFileSync(path.join(k3.AR, '_acceptance/feat/evals.yaml'), 'utf8') + '# doi\n');
  k3.git('add', '-A'); k3.git('commit', '-qm', 'doi evals');
  { const r3 = lan(LANE(KIT), k3, KIT, ['--skip-unchanged', '--allow-dirty']); ok(!boQua(r3) && /KHÔNG bỏ qua — tệp định nghĩa phép đo đổi so với pin: _acceptance\/feat\/evals\.yaml/.test(r3.stderr), 'E7 vế riêng: evals.yaml đổi → làn KHÔNG bỏ qua dưới khoá paths, gọi tên tệp định nghĩa'); }
  k2.don(); k3.don(); rmSync(s1, { recursive: true, force: true }); rmSync(s2, { recursive: true, force: true });
  ket('E7');
} else if (chan === 'lan-doc-cu') {
  // E10 — khoá vắng: làn (bỏ qua + đủ --write) BẰNG HỆT bản base trên 12 ô.
  const BASE = banBase();
  const chuan = (s, k) => String(s || '').split(k.R).join('<KHO>').replace(/\(\d+\.\d+s\)/g, '(<s>)').replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ/g, '<TS>')
    .replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>').replace(/\b[0-9a-f]{40}\b/g, '<SHA>').replace(/\b[0-9a-f]{7}\b/g, '<sha>').replace(/"wall_s":[\d.]+/g, '"wall_s":<w>').replace(/wall_s \d+(\.\d+)?/g, 'wall_s <w>');
  const chay = (eng, o, args) => { const k = khoO(o, undefined); const truoc = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8'); const r = lan(LANE(eng), k, eng, args); const moi = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8').slice(truoc.length); const o2 = { st: r.status, out: chuan(r.stdout, k), err: chuan(r.stderr, k), log: chuan(moi, k) }; k.don(); return o2; };
  let soO = 0;
  for (const o of MA_TRAN) {
    for (const args of [['--skip-unchanged', '--allow-dirty'], ['--reason', 'x', '--write']]) {
      const a = chay(KIT, o, args), b = chay(BASE, o, args);
      ok(a.st === b.st && a.out === b.out && a.err === b.err && a.log === b.log, `E10 ${o.id} ${args[0]}: làn khoá vắng bằng hệt base (mã ${a.st}/${b.st})`);
    }
    soO++;
  }
  ok(soO === M_SO_O, `E10 đúng ${M_SO_O} ô (được ${soO})`);
  // ô lib cũ: --ag-root = bản base (lib chưa có staleByPaths)
  const o2 = MA_TRAN.find(o => o.id === 'M2');
  const kV = khoO(o2, undefined); const rV = lan(LANE(KIT), kV, BASE, ['--skip-unchanged', '--allow-dirty']); kV.don();
  ok(rV.status === 0, `E10 khoá vắng + lib cũ → làn chạy như thường (mã ${rV.status})`);
  // so TRỌN đầu ra với bản base chạy trên CHÍNH bộ máy cũ (lượt chấm 3, phát hiện trong hợp đồng)
  { const kA = khoO(o2, undefined), kB = khoO(o2, undefined);
    const a = lan(LANE(KIT), kA, BASE, ['--reason', 'x', '--write']), b = lan(LANE(BASE), kB, BASE, ['--reason', 'x', '--write']);
    ok(a.status === b.status && chuan(a.stdout, kA) === chuan(b.stdout, kB) && chuan(a.stderr, kA) === chuan(b.stderr, kB), `E10 khoá vắng + bộ máy cũ: đầu ra làn bằng hệt base cùng bộ máy (mã ${a.status}/${b.status})`);
    kA.don(); kB.don(); }
  const kP = khoO(o2, 'paths'); const rP = lan(LANE(KIT), kP, BASE, ['--skip-unchanged', '--allow-dirty']); kP.don();
  ok(rP.status === 2 && /staleByPaths/.test(rP.stderr), `E10 khoá paths + lib cũ → KHÔNG bỏ qua, dừng gọi tên staleByPaths (mã ${rP.status})`);
  const s = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: ", khi: 'stale_scope=paths' }", thanh: ' }' }]);
  const kS = khoO(o2, undefined); const rS = lan(LANE(s), kS, BASE, ['--skip-unchanged', '--allow-dirty']); kS.don();
  ok(rS.status === 2 && /staleByPaths/.test(rS.stderr), 'E10 chiều đỏ: bản sao đòi vị từ vô điều kiện → làn khoá vắng thoát 2 GỌI TÊN staleByPaths trên lib cũ — «khoá vắng mà đòi lib mới» được thấy');
  rmSync(s, { recursive: true, force: true }); rmSync(BASE, { recursive: true, force: true });
  ket('E10');
}
