// Chân E3 (truoc-merge), E5 (mot-nguon), E7 (doc-cu) của hồ sơ loc-paths-dong-mac-dinh — lưới trước-
// gộp và làn ghim lại THẬT của cây đang kiểm (đường suy từ vị trí tệp). Mỗi chân: bản lành XANH trước,
// bản sao bị tiêm ĐỎ với thông điệp ghim kèm dấu dương «bản sao đã chạy tới hồ sơ».
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { KIT, dungKho, banSao, banBase, chayPremerge, chayLan } from './kho.mjs';
import { rutMaTran, evalsCua, D_SO_O, CAY_D, MOI } from './ma-tran-d.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const PM = 'scripts/pre-merge-check.sh';
const LANE = 'feature-loop/scripts/repin-lane.mjs';
const coStale = (out) => /VIOLATION \[feat\]: evidence is stale/.test(out);
const soStale = (out) => (out.match(/VIOLATION \[[^\]]+\]: evidence is stale/g) || []).length;
const tepStale = (out) => { const m = out.match(/VIOLATION \[feat\]: evidence is stale[^\n]*Changed:\n((?: {4}\S.*\n?)*)/); return m ? m[1].split('\n').map(l => l.trim()).filter(Boolean) : []; };
const noteKhongAp = (out) => (out.match(/NOTE \[feat\]: bộ lọc paths không áp \(([^)]*)\) — giữ luật cũ/) || [])[1] || null;
const noteBoQua = (out) => (out.match(/NOTE \[feat\]: hoá cũ theo luật cũ, bỏ qua theo paths: (\d+) tệp/) || [])[1] || null;
const daChayLuoi = (out) => /pre-merge-check: (clean|\d+ violation)/.test(out) && /\[feat\]/.test(out);
const khoO = (o, staleScope, doi = o.doi, prefix) => { const k = dungKho({ staleScope, hoSo: [{ slug: 'feat', evalsYaml: evalsCua(o) }], tep: CAY_D, prefix }); k.doi(doi); return k; };
const lyDoMong = (o) => (o.ma === 'evals-hong' ? 'evals-hong' : o.ma.includes(':') ? o.ma : `${o.ma}:E1:${o.mucDau}`);
const M = rutMaTran();
const O = Object.fromEntries(M.map(o => [o.id, o]));

if (chan === 'truoc-merge') {
  const BASE = banBase();
  // (a) thư mục trần có thật, tệp bên trong đổi → hoá cũ; bản base cùng kho xanh (lỗ có thật trước vòng).
  { const k = khoO(O.D4, 'paths', ['src/sub/c.js']);
    const r = chayPremerge(KIT, k), b = chayPremerge(BASE, k);
    ok(coStale(r.out) && tepStale(r.out).includes('src/sub/c.js') && r.st === 1, `(a) mục «src/sub», đổi src/sub/c.js → VIOLATION hoá cũ liệt đúng tệp (mã ${r.st})`);
    ok(daChayLuoi(b.out) && !coStale(b.out), `(a) chiều đỏ lịch sử: bản base cùng kho KHÔNG hoá cũ — lỗ xanh-mà-sai có thật trước vòng [base chạy tới hồ sơ: ${daChayLuoi(b.out) ? 'có' : 'KHÔNG'}]`);
    k.don(); }
  // (b) mỗi dạng bị từ chối → luật cũ + NOTE gọi đúng mục.
  const TU_CHOI = M.filter(o => !o.nhan && o.id !== 'D18');
  ok(TU_CHOI.length === 12, `(b) đúng 12 dạng bị từ chối D7–D17, D19 (được ${TU_CHOI.length})`);
  for (const o of TU_CHOI) {
    const k = khoO(o, 'paths'); const r = chayPremerge(KIT, k);
    ok(coStale(r.out) && noteKhongAp(r.out) === lyDoMong(o), `(b) ${o.id} «${o.mucDau}» → VIOLATION luật cũ + NOTE (${noteKhongAp(r.out)})`);
    k.don();
  }
  // (c) thư mục trần, diff chỉ ngoài phần đo → không hoá cũ, NOTE bỏ qua.
  { const k = khoO(O.D4, 'paths', [MOI]); const r = chayPremerge(KIT, k);
    ok(!coStale(r.out) && noteBoQua(r.out) === '1', `(c) mục «src/sub», chỉ đổi ${MOI} → không hoá cũ, NOTE bỏ qua 1 tệp`); k.don(); }
  // Tên có dấu (D6) và hồ sơ ở thư mục con.
  { const k = khoO(O.D6, 'paths', ['src/tài.js']); const r = chayPremerge(KIT, k);
    ok(coStale(r.out) && tepStale(r.out).some(t => t.includes('src/t')), `D6 tên có dấu «src/tài.js» đổi → VIOLATION hoá cũ (liệt: ${tepStale(r.out).join(', ')})`); k.don(); }
  { const k = khoO(O.D4, 'paths', ['src/sub/c.js'], 'pkg/a/'); const r = chayPremerge(KIT, k);
    ok(coStale(r.out) && tepStale(r.out).some(t => t.endsWith('src/sub/c.js')), `hồ sơ ở thư mục con pkg/a/: mục «src/sub» vẫn nhận, VIOLATION liệt src/sub/c.js`); k.don(); }
  // Chiều đỏ: bỏ dòng NOTE «không áp» → từ chối im lặng.
  { const s = banSao([{ tep: PM, tu: 'echo "NOTE [$slug]: bộ lọc paths không áp', thanh: ': "NOTE [$slug]: bộ lọc paths không áp' }]);
    const k = khoO(O.D12, 'paths'); const r = chayPremerge(s, k);
    ok(daChayLuoi(r.out) && coStale(r.out) && noteKhongAp(r.out) === null, `chiều đỏ «từ chối im lặng»: bản sao bỏ NOTE → không còn dòng gọi tên mục [lưới chạy tới hồ sơ: ${daChayLuoi(r.out) ? 'có' : 'KHÔNG'}]`);
    k.don(); }
  ket('E3');
} else if (chan === 'mot-nguon') {
  // E5 — 19 ô × hai diff: lưới «hoá cũ?» ⇔ làn «không bỏ qua?».
  const boQua = (r) => r.status === 0 && /làn bỏ qua/.test(r.stderr || '');
  const hoi = (engine, o, doi) => {
    const k = khoO(o, 'paths', doi);
    const pm = chayPremerge(KIT, k);
    const lan = chayLan(engine, k, ['feat'], ['--skip-unchanged', '--allow-dirty'], KIT);
    k.don();
    return { luoi: coStale(pm.out), lanChay: !boQua(lan), daChay: daChayLuoi(pm.out) && /\[lane\]|--skip-unchanged/.test(lan.stderr || '') };
  };
  const quet = (engine) => { const lech = []; let n = 0, chay = 0;
    for (const o of M) for (const [ten, doi] of [['đổi', o.doi], ['chỉ-mồi', [MOI]]]) { const h = hoi(engine, o, doi); n++; if (h.daChay) chay++; if (h.luoi !== h.lanChay) lech.push(`${o.id}/${ten}`); }
    return { n, chay, lech }; };
  const lanh = quet(KIT);
  ok(lanh.n === 2 * D_SO_O && lanh.lech.length === 0, `đối chứng dương: lưới và làn cùng kết luận ở ${lanh.n - lanh.lech.length}/${2 * D_SO_O} lượt (lệch: ${lanh.lech.join(', ') || 'không'})`);
  const s = banSao([{ tep: LANE, tu: '{ prefix: tienToGit, cay: cayHead() }', thanh: '{ prefix: tienToGit }' }]);
  const r = quet(s);
  console.log(`  làn mù cây → lệch ${r.lech.length} lượt: ${r.lech.join(', ')}`);
  ok(r.chay === r.n && r.lech.includes('D4/chỉ-mồi'), `chiều đỏ «làn mù cây»: tập lệch phải chứa D4/chỉ-mồi [bản sao chạy tới hồ sơ ${r.chay}/${r.n}]`);
  ket('E5');
} else if (chan === 'doc-cu') {
  // E7 — khoá vắng, dạng thường D1–D3: lưới + làn BẰNG HỆT base VÀ đúng kết cục ghim trước.
  const BASE = banBase();
  const chuan = (s, k) => String(s || '').split(k.R).join('<KHO>').replace(/\(\d+(\.\d+)?s\)/g, '(<s>)').replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g, '<TS>')
    .replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>').replace(/\b[0-9a-f]{40}\b/g, '<SHA>').replace(/\b[0-9a-f]{7,12}\b/g, '<sha>')
    .replace(/"wall_s":[\d.]+/g, '"wall_s":<w>').replace(/wall_s \d+(\.\d+)?/g, 'wall_s <w>').replace(/"phut":[\d.]+/g, '"phut":<p>').replace(/\d+(\.\d+)? phút/g, '<p> phút');
  const luoi = (eng, o) => { const k = khoO(o, undefined); const r = chayPremerge(eng, k); const v = { st: r.st, out: chuan(r.out, k), stale: soStale(r.out) }; k.don(); return v; };
  const lan = (eng, o, args) => { const k = khoO(o, undefined); const log0 = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8');
    const r = chayLan(eng, k, ['feat'], args, eng); const moi = readFileSync(path.join(k.AR, '_acceptance/feat/run-log.jsonl'), 'utf8').slice(log0.length);
    const v = { st: r.status, out: chuan(r.stdout, k), err: chuan(r.stderr, k), log: chuan(moi, k), repin: (moi.match(/"kind":"repin"/g) || []).length }; k.don(); return v; };
  for (const id of ['D1', 'D2', 'D3']) {
    const a = luoi(KIT, O[id]), b = luoi(BASE, O[id]);
    ok(a.st === b.st && a.out === b.out, `${id} lưới khoá vắng: bằng hệt base (mã ${a.st}/${b.st})`);
    ok(a.st === 1 && a.stale === 1 && b.st === 1 && b.stale === 1, `${id} lưới kết cục ghim: mã 1, đúng một VIOLATION hoá cũ ở CẢ HAI bản — bằng nhau mà sai là «vi phân rỗng» (KIT ${a.st}/${a.stale}, base ${b.st}/${b.stale})`);
    const c = lan(KIT, O[id], ['--skip-unchanged', '--allow-dirty']), d = lan(BASE, O[id], ['--skip-unchanged', '--allow-dirty']);
    ok(c.st === d.st && c.out === d.out && c.err === d.err, `${id} làn --skip-unchanged khoá vắng: bằng hệt base (mã ${c.st}/${d.st})`);
    ok(c.st === 0 && /làn chạy trọn/.test(c.err) && /làn chạy trọn/.test(d.err), `${id} làn --skip-unchanged kết cục ghim: chạy trọn ở cả hai bản`);
    const e = lan(KIT, O[id], ['--reason', 'x', '--write']), f = lan(BASE, O[id], ['--reason', 'x', '--write']);
    ok(e.st === f.st && e.out === f.out && e.err === f.err && e.log === f.log, `${id} làn --write khoá vắng: stdout, stderr, dòng run-log bằng hệt base (mã ${e.st}/${f.st})`);
    ok(e.st === 0 && e.repin === 1 && f.repin === 1, `${id} làn --write kết cục ghim: thoát 0, đúng một dòng repin mới ở cả hai bản (${e.repin}/${f.repin})`);
  }
  const s = banSao([{ tep: PM, tu: "  ''|all) STALE_SCOPE=all ;;", thanh: "  '') STALE_SCOPE=paths ;;\n  all) STALE_SCOPE=all ;;" }]);
  const a = luoi(s, O.D1), b = luoi(BASE, O.D1);
  ok(/\[feat\]/.test(a.out) && a.out !== b.out, `chiều đỏ «đổi mặc định»: bản sao coi khoá vắng là paths → đầu ra lưới khác base`);
  ket('E7');
} else {
  console.log(`chan-premerge: chân lạ ${chan}`); process.exit(3);
}
