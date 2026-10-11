// evals-sat-le.test.mjs — hồ sơ evals-sat-le-doc-du (hàng R1 của lộ trình kit).
//
// Kho viết evals.yaml kiểu danh sách sát lề vẫn được kit đọc đủ đầu vào, vùng tệp, danh sách
// bằng chứng; danh sách không đọc được lên cờ có tên. Mỗi ca ghim MỘT vế của một AC, có đối chứng
// dương và chiều đỏ trên CÙNG fixture (do mã sinh), thông điệp ghim. Bản base = git archive của
// hằng BASE_DIRS (evals-sat-le-lib.mjs). Đường dẫn suy từ vị trí tệp này.
import { createRequire } from 'node:module';
import path from 'node:path';
import { realpathSync, writeFileSync, readFileSync, mkdirSync, cpSync, statSync, readdirSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import * as L from './evals-sat-le-lib.mjs';

const require = createRequire(import.meta.url);
let pass = 0, fail = 0;
const ca = (ma, moTa, f) => {
  let r; try { r = f(); } catch (e) { r = String(e.message || e).split('\n')[0]; }
  if (r === true) { console.log(`  PASS: ${ma} ${moTa}`); pass++; } else { console.log(`  FAIL: ${ma} ${moTa} — ${r}`); fail++; }
};
const J = x => JSON.stringify(x);

let CORE = null, BASE_DIR = null, CORE_BASE = null;
try { CORE = require(path.join(L.KIT, 'lib', 'evidence-core.cjs')); } catch (e) { console.log(`  FAIL: NAP lib — ${e.message}`); fail++; }
try { BASE_DIR = L.dungBase(); CORE_BASE = require(path.join(BASE_DIR, 'lib', 'evidence-core.cjs')); } catch (e) { console.log(`  FAIL: BASE ${e.message}`); fail++; }

// ── AC-5: neo &ten và bí danh *ten ─────────────────────────────────────────────
const NEO = 'evals:\n- id: E1\n  executor: script\n  paths: &id001\n  - a/x.js\n  # ghi chu giua muc\n\n  - "b/**"   # duoi\n- id: E2\n  executor: script\n  paths: *id001\n';
ca('NEO1', 'neo &id001 + mục khối (chú thích, dòng trống giữa mục) → đúng các mục', () =>
  J(CORE.evalPathsOf(NEO, 'E1')) === '["a/x.js","b/**"]' || `evalPathsOf E1 = ${J(CORE.evalPathsOf(NEO, 'E1'))}`);
ca('NEO2', 'bí danh *id001 → null + cờ bi-danh; không phần tử nào bắt đầu & hay *', () => {
  if (typeof CORE.evalListsOf !== 'function') return 'lib không có evalListsOf';
  const p = CORE.evalPathsOf(NEO, 'E2'); const c = CORE.evalListsOf(NEO, ['paths']).canhBao;
  const rac = [...CORE.evalListsOf(NEO, ['paths']).byId.values()].flatMap(f => f.paths || []).filter(x => /^[&*]/.test(x));
  return (p === null && c.some(x => x.id === 'E2' && x.key === 'paths' && x.ly_do === 'bi-danh') && !rac.length) || J({ p, c, rac });
});
ca('NEO3', 'chiều đỏ: base đọc neo thành glob', () => {
  const p = CORE_BASE.evalPathsOf(NEO, 'E1');
  if (!(Array.isArray(p) && p[0] === '&id001')) return `base không tái hiện lỗi: ${J(p)}`;
  console.log('    · neo thành glob (base)'); return true;
});

// ── AC-3: vi phân trên mọi hồ sơ của kit ───────────────────────────────────────
ca('VP1', 'vi phân base ↔ mới trên hồ sơ kit: 0 lệch ngoài sát lề', () => {
  const kq = L.viPhan({ khos: [L.KIT], cu: L.docBase(BASE_DIR), moi: L.docLib(L.KIT) });
  console.log(`    · ${kq.hoSo} hồ sơ / ${kq.tieuChi} tiêu chí đã so`);
  if (!kq.hoSo || !kq.tieuChi) return 'vi phân rỗng';
  const x = kq.lech.filter(l => !l.satLe);
  return !x.length || `vi phân lệch: ${x[0].hoSo} ${x[0].id}.${x[0].key} ${x[0].cu} → ${x[0].moi} (${x.length} mục)`;
});
ca('VP2', 'chiều đỏ: bản sao bộ đọc bỏ mục cuối của mọi danh sách khối → lệch', () => {
  const KIM = 'if (it && it[1].length >= keyCol) { seq.items.push(';
  const dot = L.dungBanSaoLib(KIM, 'if (it && it[1].length >= keyCol) { if (seq.tre !== undefined) seq.items.push(seq.tre); seq.tre = (');
  const doi = L.viPhan({ khos: [L.KIT], cu: L.docLib(L.KIT), moi: L.docLib(dot) }).lech.length;
  if (!doi) return 'đột biến tương đương';
  const x = L.viPhan({ khos: [L.KIT], cu: L.docBase(BASE_DIR), moi: L.docLib(dot) }).lech.filter(l => !l.satLe);
  if (!x.length) return 'đột biến không làm lệch';
  console.log(`    · vi phân lệch: ${x[0].hoSo} (${doi} trường đổi)`); return true;
});

// ── AC-1: ba cách viết → cùng tệp args, ma trận cách × tiêu chí × trường ───────────
const REQ = L.evalRequired();
const truongCua = tc => {
  const can = (REQ[tc.executor] || { arr: [] }).arr;
  const thieu = can.filter(k => !(tc.ds && k in tc.ds));
  if (thieu.length) throw new Error(`mô hình hụt trường: ${tc.executor}.${thieu[0]}`);
  return [...new Set([...can, ...Object.keys(tc.ds || {})])];
};
const giaTriArgs = (d, e, k) => (k === 'inputs' && Array.isArray(e[k]) ? e[k].map(x => path.relative(realpathSync(d), x)) : e[k]);
const CHAY = {};
for (const cach of L.CACH) { const d = L.dungKho(L.vietMoHinh(cach)); CHAY[cach] = { d, ...L.chayS4(d) }; }
// GÕ TAY, không suy từ mô hình (lượt chấm 1, Hình dạng 5): 3 cách × (S1: paths, evidence_required ·
// J1: inputs, paths · U1: steps, paths) = 18. Đếm suy từ chính vòng lặp thì phép so là hằng đúng —
// bỏ một tiêu chí hay một trường khỏi mô hình làm ma trận co lại LẶNG. Đổi mô hình thì đổi số này.
const BC1_PHAN_TU = 18;
const demMaTran = (cachs, moHinh) => { let n = 0; for (const c of cachs) for (const tc of moHinh) n += truongCua(tc).length; return n; };
ca('BC1', 'ba cách viết cho cùng inputs/paths/evidence_required/mảng bắt buộc (ma trận viết trước)', () => {
  let so = 0; const sai = [];
  const can = demMaTran(L.CACH, L.MO_HINH);
  if (can !== BC1_PHAN_TU) return `ma trận hụt: mô hình cho ${can} phần tử, khai trước ${BC1_PHAN_TU}`;
  for (const cach of L.CACH) {
    const r = CHAY[cach];
    if (r.rc !== 0) return `${cach}: s4-args rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
    if (/danh sách không đọc được/.test(r.stderr)) return `${cach}: cờ sai trên cách hợp lệ`;
    for (const tc of L.MO_HINH) {
      const e = r.args.evals.find(x => x.id === tc.id);
      for (const k of truongCua(tc)) { so++; if (J(giaTriArgs(r.d, e || {}, k)) !== J(tc.ds[k])) sai.push(`${cach} ${tc.id}.${k}=${J(e && e[k])}`); }
    }
  }
  if (so !== BC1_PHAN_TU) return `ma trận hụt: so ${so}/${BC1_PHAN_TU}`;
  return !sai.length || `thiếu: ${sai.slice(0, 3).join(' · ')} (${sai.length} phần tử)`;
});
ca('BC1b', 'chiều đỏ: mô hình bớt một trường → phép đếm lệch con số khai trước («ma trận hụt»)', () => {
  const bot = L.MO_HINH.map(tc => tc.id === 'S1' ? { ...tc, ds: { paths: tc.ds.paths } } : tc);
  const n = demMaTran(L.CACH, bot);
  if (n === BC1_PHAN_TU) return 'bớt trường mà phép đếm không đổi — thước trơ';
  console.log(`    · ma trận hụt: ${n}/${BC1_PHAN_TU}`); return true;
});
ca('BC2', 'base: thụt 4 đúng (đối chứng dương), sát lề mất danh sách im lặng; cây mới xanh trên sát lề', () => {
  // Mô hình không ui-check: base dừng to khi rơi trường BẮT BUỘC (steps), nên phần im lặng chỉ đo được
  // trên trường không bắt buộc — đúng lớp lỗi crm dieu-phoi-va-bien gặp.
  const MH = L.MO_HINH.filter(tc => tc.executor !== 'ui-check');
  const s4 = path.join(BASE_DIR, 'feature-loop', 'scripts', 's4-args.mjs');
  const mat = [];
  for (const cach of ['thut4', 'satle']) {
    const d = L.dungKho(L.vietMoHinh(cach, MH));
    const r = L.chayS4(d, { s4, agRoot: BASE_DIR });
    if (r.rc !== 0) return `base ${cach}: rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
    for (const tc of MH) for (const k of Object.keys(tc.ds)) {
      const e = r.args.evals.find(x => x.id === tc.id) || {};
      const dung = J(giaTriArgs(d, e, k)) === J(tc.ds[k]);
      if (cach === 'thut4' && !dung) return `đối chứng dương hỏng: base thụt 4 ${tc.id}.${k}=${J(e[k])}`;
      if (cach === 'satle' && !dung) mat.push(`${tc.id}.${k}`);
    }
  }
  for (const k of ['paths', 'inputs', 'evidence_required']) if (!mat.some(m => m.endsWith('.' + k))) return `base không mất ${k} trên sát lề`;
  for (const m of mat) console.log(`    · base mất danh sách: ${m}`);
  return CHAY.satle.rc === 0 || 'cây mới đỏ trên sát lề';
});

// ── AC-4: danh sách không đọc được → một dòng gọi tên + khoá args ───────────────
const KHONG_DOC = 'schema_version: 1\nfeature_slug: demo\nevals:\n'
  + '  - id: X1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    paths: *id001\n'
  + '  - id: X2\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    inputs: |\n      chu khong phai danh sach\n'
  + '  - id: X3\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    paths: {a: b}\n'
  + '  - id: X4\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    evidence_required:\n';
const MUC_KD = ['X1.paths', 'X2.inputs', 'X3.paths', 'X4.evidence_required'];
const KHO_KD = L.dungKho(KHONG_DOC);
const dongCo = s => s.split('\n').filter(l => l.startsWith('s4-args: danh sách không đọc được:'));
ca('CB1', 'bốn cách không đọc được → đúng một dòng gọi tên 4/4 + args.canhBaoDanhSach 4 mục', () => {
  const r = L.chayS4(KHO_KD);
  if (r.rc !== 0) return `rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
  const dong = dongCo(r.stderr);
  if (dong.length !== 1) return `${dong.length} dòng cờ`;
  const thieu = MUC_KD.filter(m => !dong[0].includes(m));
  if (thieu.length) return `dòng thiếu ${thieu.join(', ')}`;
  return (Array.isArray(r.args.canhBaoDanhSach) && r.args.canhBaoDanhSach.length === 4) || `canhBaoDanhSach=${J(r.args.canhBaoDanhSach)}`;
});
ca('CB2', 'chiều im: hồ sơ sạch (kể cả `[]` tường minh) → 0 dòng, khoá vắng hẳn', () => {
  const t = L.vietMoHinh('thut4') + '  - id: S2\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    paths: []\n';
  const r = L.chayS4(L.dungKho(t));
  if (r.rc !== 0) return `rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
  if (dongCo(r.stderr).length) return 'có dòng cờ trên hồ sơ sạch';
  return !('canhBaoDanhSach' in r.args) || 'khoá canhBaoDanhSach có mặt';
});
ca('CB3', 'chiều đỏ: bản sao lib gỡ nhánh cờ → dòng cờ biến mất', () => {
  const dot = L.dungBanSaoLib('canhBao.push(', 'void (', 4);
  const r = L.chayS4(KHO_KD, { agRoot: dot });
  if (r.rc !== 0) return `rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
  if (dongCo(r.stderr).length) return 'đột biến không tắt được cờ';
  console.log(`    · cờ im: ${MUC_KD[0]}`); return true;
});

ca('CB4', 'giá trị mở bằng «[» mà không tách được → cờ không-phải-danh-sách, không thành glob rác', () => {
  const t = 'evals:\n  - id: Y1\n    executor: script\n    paths: [a/**, "b\n';
  const p = CORE.evalPathsOf(t, 'Y1'); const c = CORE.evalListsOf(t, ['paths']).canhBao;
  return (p === null && c.some(x => x.id === 'Y1' && x.ly_do === 'khong-phai-danh-sach')) || J({ p, c });
});

ca('CT1', '«#» nằm TRONG nháy không phải chú thích — mục khối và giá trị một dòng giữ nguyên (crm cua-vao-dang-nhap E14)', () => {
  const t = 'evals:\n  - id: Z1\n    executor: ui-check\n    steps:\n      - "buoc sau #150 tu dung"   # chu thich that\n    paths: ["a #b/**", c/**]   # chu thich\n';
  const f = CORE.evalListsOf(t, ['steps', 'paths']).byId.get('Z1') || {};
  return (J(f.steps) === '["buoc sau #150 tu dung"]' && J(f.paths) === '["a #b/**","c/**"]') || J(f);
});

// ── AC-6: lượt sửa giữ ô xanh cho paths dạng khối (CLI carry-plan, mỗi lượt một tiến trình) ──
const CP_EVALS = {
  thut4: 'schema_version: 1\nevals:\n'
    + '  - id: A\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    paths: [src/a/**]\n'
    + '  - id: B\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    paths:\n      - src/a/**\n',
  satle: 'schema_version: 1\nevals:\n'
    + '- id: C\n  criterion: AC-1\n  executor: script\n  cmd: config:executors.script.cli\n  paths:\n  - src/a/**\n',
};
const runLog1 = ids => ids.map(id => JSON.stringify({ ts: '2026-10-10T00:00:00Z', evalId: id, round: 1, sha: 'abc1234', exit_code: 0, run_id: 'r1-x', cmd: 'echo x' })).join('\n') + '\n';
function chayCarry(cach, delta, { cp = path.join(L.KIT, 'feature-loop', 'scripts', 'carry-plan.mjs'), agRoot = L.KIT } = {}) {
  const d = L.tam('cp');
  const ids = cach === 'thut4' ? ['A', 'B'] : ['C'];
  writeFileSync(path.join(d, 'evals.yaml'), CP_EVALS[cach]);
  writeFileSync(path.join(d, 'run-log.jsonl'), runLog1(ids));
  writeFileSync(path.join(d, 'contract.md'), '---\nslug: demo\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n');
  const r = spawnSync(process.execPath, [cp, '--run-log', path.join(d, 'run-log.jsonl'), '--evals', path.join(d, 'evals.yaml'),
    '--contract', path.join(d, 'contract.md'), '--round', '2', '--ag-root', agRoot, '--delta-files', delta], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(r.stdout); } catch (_) {}
  return { rc: r.status, stderr: String(r.stderr || ''), j };
}
const lyDo = (j, id) => (j && j.reason ? j.reason[id] : undefined);
ca('CP1', 'diff-fix ngoài vùng → A (một dòng), B (khối thụt 4), C (khối sát lề) đều được giữ', () => {
  for (const cach of ['thut4', 'satle']) {
    const r = chayCarry(cach, 'docs/x.md');
    if (r.rc !== 0 || !r.j) return `${cach}: rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
    for (const id of cach === 'thut4' ? ['A', 'B'] : ['C'])
      if (lyDo(r.j, id) !== 'paths không chạm diff-fix, round trước xanh') return `${id}: ${lyDo(r.j, id)}`;
  }
  return true;
});
ca('CP2', 'diff-fix chạm vùng → cả ba chạy lại «diff-fix chạm src/a/b.js»', () => {
  for (const cach of ['thut4', 'satle']) {
    const r = chayCarry(cach, 'src/a/b.js');
    if (r.rc !== 0 || !r.j) return `${cach}: rc ${r.rc}`;
    for (const id of cach === 'thut4' ? ['A', 'B'] : ['C'])
      if (lyDo(r.j, id) !== 'diff-fix chạm src/a/b.js') return `${id}: ${lyDo(r.j, id)}`;
  }
  return true;
});
ca('CP3', 'chiều đỏ: carry-plan của base bỏ paths dạng khối', () => {
  const cp = path.join(BASE_DIR, 'feature-loop', 'scripts', 'carry-plan.mjs');
  const a = chayCarry('thut4', 'docs/x.md', { cp, agRoot: BASE_DIR });
  if (a.rc !== 0 || !a.j) return `base rc ${a.rc} — ${a.stderr.trim().split('\n').pop()}`;
  if (lyDo(a.j, 'A') !== 'paths không chạm diff-fix, round trước xanh') return `đối chứng dương hỏng: base A ${lyDo(a.j, 'A')}`;
  const c = chayCarry('satle', 'docs/x.md', { cp, agRoot: BASE_DIR });
  for (const [id, r] of [['B', a], ['C', c]]) if (lyDo(r.j, id) !== 'thiếu paths — luôn chạy lại') return `base ${id}: ${lyDo(r.j, id)}`;
  console.log('    · base bỏ paths khối'); return true;
});

// ── AC-9: một nguồn đọc — thay hàm trong bản sao lib thì CẢ HAI bên lật; lib thiếu hàm thì dừng có tên ──
ca('MN1', 'evalListsOf rỗng trong bản sao lib → lượt chấm mất paths VÀ lượt sửa «thiếu paths»', () => {
  const dot = L.dungBanSaoLib('function evalListsOf(evalsText, keys) {', 'function evalListsOf(evalsText, keys) { return { byId: new Map(), canhBao: [] };');
  const r = L.chayS4(L.dungKho(L.vietMoHinh('thut4', L.MO_HINH.filter(tc => tc.executor !== 'ui-check'))), { agRoot: dot });
  if (r.rc !== 0) return `s4-args rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
  const s1 = r.args.evals.find(e => e.id === 'S1');
  if (s1 && Array.isArray(s1.paths) && s1.paths.length) return 'lượt chấm không lật (vẫn có paths)';
  const c = chayCarry('thut4', 'docs/x.md', { agRoot: dot });
  return lyDo(c.j, 'A') === 'thiếu paths — luôn chạy lại' || `lượt sửa không lật: A ${lyDo(c.j, 'A')}`;
});
// Vế «không sinh tệp» đo trên kho MỚI (lượt chấm 1, Hình dạng 4): kho của BC1 đã có args.json nên
// một kiểm «không có tệp» trên đó là hằng đúng. Phép kiểm là một hàm — MN2b chạy nó trên bản sao s4-args
// ghi tệp TRƯỚC khi thoát 2 và đòi nó ĐỎ.
const loiMN2 = r => (r.rc !== 2 ? `rc ${r.rc}` : !/evalListsOf/.test(r.stderr) ? 'stderr không gọi tên evalListsOf' : r.coTep ? 'sinh tệp dù thoát 2' : null);
ca('MN2', 'lib không có evalListsOf → lượt chấm và lượt sửa thoát 2 gọi tên evalListsOf, không sinh tệp', () => {
  const dot = L.dungBanSaoLib('  evalListsOf,\n', '');
  const r = L.chayS4(L.dungKho(L.vietMoHinh('thut4')), { agRoot: dot });
  const e = loiMN2(r); if (e) return `s4-args: ${e} — ${r.stderr.trim().split('\n').pop()}`;
  const c = chayCarry('thut4', 'docs/x.md', { agRoot: dot });
  return (c.rc === 2 && /evalListsOf/.test(c.stderr)) || `carry-plan rc ${c.rc} — ${c.stderr.trim().split('\n').pop()}`;
});
ca('MN2b', 'chiều đỏ: bản sao s4-args ghi tệp args TRƯỚC khi dừng → phép kiểm MN2 bắt «sinh tệp dù thoát 2»', () => {
  const dot = L.dungBanSaoLib('  evalListsOf,\n', '');
  const d = L.tam('s4dot');
  cpSync(path.join(L.KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 's4-args.mjs');
  const src = readFileSync(f, 'utf8'); const KIM = "if (!flags.slug || !flags.root) usage('thiếu --slug hoặc --root');\n";
  if (src.split(KIM).length !== 2) return 'kim không khớp đúng một lần';
  writeFileSync(f, src.replace(KIM, KIM + "fs.writeFileSync(flags.out, '{}');\n"));
  const e = loiMN2(L.chayS4(L.dungKho(L.vietMoHinh('thut4')), { agRoot: dot, s4: f }));
  if (e !== 'sinh tệp dù thoát 2') return `phép kiểm không bắt: ${e}`;
  console.log('    · sinh tệp dù thoát 2'); return true;
});

// ── AC-8: cờ trên thẻ Cổng Phạm vi và Cổng Bằng chứng (hằng rút từ nguồn) ─────────
const GC_SRC = readFileSync(path.join(L.KIT, 'scripts', 'gate-card.js'), 'utf8');
const CO_THE = (GC_SRC.match(/const DANH_SACH_KHONG_DOC_FLAG = '([^']+)';/) || [])[1];
const HD = (status) => `---\nschema_version: 1\nfeature: F\nslug: demo\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${status === 'draft' ? '' : 'approved_by: A\napproved_at: 2026-10-10\n'}---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- bỏ X.\n- bỏ Y.\n`;
const BC = '---\nschema_version: 2\nfeature_slug: demo\nverdict: PASS\nfailed_evals: []\nverified_commit: 0000000\n---\n\n# E\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| X1 | AC-1 | script | PASS |\n\n## Evidence\n\n- eval: X1\n  run_id: r1abc\n  exit_code: 0\n  verifier: config:executors.script.cli\n  verified_at: 2026-10-10T00:00:00Z\n';
function hoSoThe(evalsText, cong) {
  const d = L.tam('the');
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), HD(cong === 1 ? 'draft' : 'verified'));
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsText);
  if (cong === 2) writeFileSync(path.join(d, '_acceptance', 'demo', 'evidence-report.md'), BC);
  return d;
}
const the = (d, gc = path.join(L.KIT, 'scripts', 'gate-card.js')) => {
  const r = spawnSync(process.execPath, [gc, '--root', d, '--slug', 'demo'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card rc ${r.status}: ${String(r.stderr).trim().split('\n').pop()}`);
  return r.stdout;
};
const SACH = L.vietMoHinh('thut4');
ca('TH1', 'hồ sơ có danh sách không đọc được → hai thẻ cổng in cờ kèm tên từng <id>.<trường>', () => {
  if (!CO_THE) return 'gate-card.js không khai hằng DANH_SACH_KHONG_DOC_FLAG';
  for (const cong of [1, 2]) {
    const h = the(hoSoThe(KHONG_DOC, cong));
    if (!h.includes(CO_THE)) return `Cổng ${cong}: thẻ không có cờ`;
    const thieu = MUC_KD.filter(m => !h.includes(m));
    if (thieu.length) return `Cổng ${cong}: cờ thiếu ${thieu.join(', ')}`;
  }
  return true;
});
ca('TH2', 'chiều im: hồ sơ sạch → hai thẻ không có cờ', () => {
  if (!CO_THE) return 'gate-card.js không khai hằng DANH_SACH_KHONG_DOC_FLAG';
  for (const cong of [1, 2]) if (the(hoSoThe(SACH, cong)).includes(CO_THE)) return `Cổng ${cong}: cờ trên hồ sơ sạch`;
  return true;
});
ca('TH3', 'commands/acceptance-card.md có dòng thuật cho cờ', () =>
  (CO_THE && readFileSync(path.join(L.KIT, 'commands', 'acceptance-card.md'), 'utf8').includes(CO_THE)) || 'thiếu dòng thuật');
ca('TH4', 'chiều đỏ: bản sao gate-card gỡ dòng đẩy cờ → thẻ im', () => {
  const KIM = "flags.push(['fwarn', esc(DANH_SACH_KHONG_DOC_FLAG";
  const n = GC_SRC.split(KIM).length - 1;
  if (n !== 2) return `kim khớp ${n} lần (cần 2)`;
  const d = L.tam('gc');
  cpSync(path.join(L.KIT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  cpSync(path.join(L.KIT, 'lib'), path.join(d, 'lib'), { recursive: true });
  cpSync(path.join(L.KIT, 'skills'), path.join(d, 'skills'), { recursive: true });
  writeFileSync(path.join(d, 'scripts', 'gate-card.js'), GC_SRC.split(KIM).join("void (['fwarn', esc(DANH_SACH_KHONG_DOC_FLAG"));
  for (const cong of [1, 2]) if (the(hoSoThe(KHONG_DOC, cong), path.join(d, 'scripts', 'gate-card.js')).includes(CO_THE)) return `Cổng ${cong}: đột biến không tắt cờ`;
  console.log('    · thẻ im khi danh sách không đọc được'); return true;
});

// ── AC-7: nhãn bảng chấm mẫu (glossOf của CHÍNH acceptance-gold, rút từ nguồn) ────────
function glossCua(srcGold) {
  const lay = (dau, cuoi) => { const a = srcGold.indexOf(dau); if (a < 0) throw new Error(`thiếu «${dau}» trong acceptance-gold`); return srcGold.slice(a, srcGold.indexOf(cuoi, a) + cuoi.length); };
  const ell = lay('const ellipsize = (s, max) =>', ';\n');
  const g = lay('function glossOf(root, slug, evalId, rationale) {', '\n}\n');
  return new Function('fs', 'path', `${ell}\n${g}\nreturn glossOf;`)(require('node:fs'), path);
}
const CAU_HOI = 'Cau hoi co nhay du dai de khop';
const MH_GOLD = [{ id: 'J1', criterion: 'AC-1', executor: 'judgment', question: `"${CAU_HOI}"`, ds: { inputs: ['README.md'] } },
  { id: 'J2', criterion: 'AC-1', executor: 'judgment', ds: { inputs: ['README.md'] } }];
function khoGold(cach) { const d = L.tam('gold'); mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true }); writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), L.vietMoHinh(cach, MH_GOLD)); return d; }
const GOLD_MOI = glossCua(readFileSync(path.join(L.KIT, 'scripts', 'acceptance-gold.mjs'), 'utf8'));
ca('GD1', 'sát lề: nhãn là câu hỏi; thụt 4 cùng nhãn; tiêu chí không câu hỏi → không bịa, về rationale', () => {
  const a = GOLD_MOI(khoGold('satle'), 'demo', 'J1', 'RATIONALE'), b = GOLD_MOI(khoGold('thut4'), 'demo', 'J1', 'RATIONALE');
  if (a !== CAU_HOI) return `sát lề: ${a}`;
  if (b !== a) return `thụt 4 khác: ${b}`;
  const c = GOLD_MOI(khoGold('satle'), 'demo', 'J2', 'RATIONALE');
  return c === 'RATIONALE' || `J2 bịa nhãn: ${c}`;
});
ca('GD2', 'chiều đỏ: glossOf của base trên sát lề rơi về rationale', () => {
  const g = glossCua(readFileSync(path.join(BASE_DIR, 'scripts', 'acceptance-gold.mjs'), 'utf8'));
  if (g(khoGold('thut4'), 'demo', 'J1', 'RATIONALE') !== CAU_HOI) return 'đối chứng dương hỏng: base thụt 4';
  const a = g(khoGold('satle'), 'demo', 'J1', 'RATIONALE');
  if (a !== 'RATIONALE') return `base không tái hiện: ${a}`;
  console.log('    · gold mất câu hỏi sát lề (base)'); return true;
});

// ── AC-11: lưới phân loại MỌI bên đọc evals.yaml (đóng lớp «đọc thiếu im lặng») ────────
// Bảng VIẾT TRƯỚC: mỗi tệp mã nhắc `evals.yaml` một kết luận. `danh-sach` = đọc trường danh sách
// và PHẢI đi qua MỘT bộ đọc ở lib · `truong-don` = chỉ đọc trường đơn (parseEvals/expectedExits/…)
// · `khong-doc` = chỉ nhắc tên tệp, không đọc nội dung. Tệp mới chưa phân loại là ĐỎ.
const BEN_DOC = {
  'feature-loop/scripts/carry-plan.mjs': 'danh-sach',
  'feature-loop/scripts/repin-lane.mjs': 'danh-sach',
  'feature-loop/scripts/s4-args.mjs': 'danh-sach',
  'lib/evidence-core.cjs': 'danh-sach',
  'scripts/gate-card.js': 'danh-sach',
  'lib/eval-yaml.cjs': 'truong-don',
  'lib/lop-nhin-thay.cjs': 'truong-don',
  'lib/nhan-canh-gay.cjs': 'truong-don',
  'scripts/acceptance-gold.mjs': 'truong-don',
  'scripts/eval-coverage-lint.js': 'truong-don',
  'scripts/pre-merge-check.sh': 'truong-don',
  'scripts/recheck-evidence.cjs': 'truong-don',
  'feature-loop/scripts/chup-ho-so-da-thong.mjs': 'khong-doc',
  'feature-loop/scripts/lib/phan-loai.mjs': 'khong-doc',
  'feature-loop/workflows/acceptance-verify.js': 'khong-doc',
  'lib/workspace-record.cjs': 'khong-doc',
  'scripts/loi-ra-tran-luot.cjs': 'khong-doc',
};
function benDocCua(root) {
  const out = [];
  const di = rel => {
    const abs = path.join(root, rel);
    let st; try { st = statSync(abs); } catch (_) { return; }
    if (st.isDirectory()) { for (const n of readdirSync(abs)) if (n !== 'node_modules') di(path.join(rel, n)); return; }
    if (/\.(c?js|mjs|sh)$/.test(rel) && readFileSync(abs, 'utf8').includes('evals.yaml')) out.push(rel.split(path.sep).join('/'));
  };
  for (const g of ['lib', 'scripts', 'feature-loop', 'hooks']) di(g);
  return out.sort();
}
// «Thật sự gọi» (lượt chấm 1, Hình dạng 3): bỏ dòng chú thích và chuỗi một dòng, rồi tìm một LỜI GỌI
// `evalListsOf(` / `evalPathsOf(` / `danhSachKhongDoc(` không phải định nghĩa. `danhSachKhongDoc` là vỏ của
// evalListsOf trong lib (thẻ hai cổng gọi nó). Tên đứng trong chú thích, thông điệp hay bảng tên hàm KHÔNG tính.
function goiLib(src) {
  const ma = src.split('\n').filter(l => !/^\s*(\/\/|\*|#)/.test(l)).join('\n')
    .replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/g, "''");
  return /(?<!function )\b(evalListsOf|evalPathsOf|danhSachKhongDoc)\s*\(/.test(ma);
}
function luoiBenDoc(root) {
  const loi = [];
  for (const f of benDocCua(root)) {
    if (!BEN_DOC[f]) { loi.push(`bên đọc chưa phân loại: ${f}`); continue; }
    if (BEN_DOC[f] === 'danh-sach' && !goiLib(readFileSync(path.join(root, f), 'utf8'))) loi.push(`bên đọc danh sách không qua lib: ${f}`);
  }
  return loi;
}
ca('LB1', 'mọi tệp mã nhắc evals.yaml đều có trong bảng; tệp «danh sách» đi qua lib; cây không báo dòng nào', () => {
  const ds = benDocCua(L.KIT);
  if (!ds.length) return 'không rút được tệp nào (lưới rỗng)';
  const loi = luoiBenDoc(L.KIT);
  return !loi.length || loi.join(' · ');
});
ca('LB2', 'chiều đỏ: bản sao cây thêm một tệp đọc evals.yaml bằng biểu thức riêng → đỏ gọi tên', () => {
  const d = L.tam('luoi');
  execFileSync('bash', ['-c', 'git -C "$1" archive HEAD lib scripts feature-loop hooks | tar -x -C "$2"', '_', L.KIT, d]);
  if (luoiBenDoc(d).length) return `đối chứng dương hỏng: bản sao sạch đã đỏ — ${luoiBenDoc(d)[0]}`;
  writeFileSync(path.join(d, 'scripts', 'doc-rieng.mjs'), "import fs from 'node:fs';\nconst t = fs.readFileSync('evals.yaml', 'utf8');\nexport const paths = t.match(/^    paths: (.*)$/m);\n");
  const loi = luoiBenDoc(d);
  if (!loi.includes('bên đọc chưa phân loại: scripts/doc-rieng.mjs')) return `lưới không bắt: ${J(loi)}`;
  console.log('    · bên đọc chưa phân loại: scripts/doc-rieng.mjs');
  // Gỡ LỜI GỌI ở carry-plan nhưng giữ tên trong bảng hàm bắt buộc và chú thích → lưới vẫn phải đỏ.
  const cp = path.join(d, 'feature-loop', 'scripts', 'carry-plan.mjs');
  const s = readFileSync(cp, 'utf8'); const KIM = "const { byId } = R.evalListsOf(text, ['paths']);";
  if (s.split(KIM).length !== 2) return 'kim gỡ lời gọi carry-plan không khớp đúng một lần';
  writeFileSync(cp, s.replace(KIM, 'const byId = new Map();'));
  if (!/evalListsOf/.test(readFileSync(cp, 'utf8'))) return 'đột biến xoá cả tên — không thử được chuỗi-có-mặt';
  if (!luoiBenDoc(d).includes('bên đọc danh sách không qua lib: feature-loop/scripts/carry-plan.mjs')) return 'lưới không bắt carry-plan gỡ lời gọi (còn tên trong chú thích)';
  console.log('    · bên đọc danh sách không qua lib: feature-loop/scripts/carry-plan.mjs'); return true;
});

console.log(`Results: ${pass} passed, ${fail} failed (evals-sat-le)`);
process.exit(fail ? 1 : 0);
