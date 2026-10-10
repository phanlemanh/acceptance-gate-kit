// evals-sat-le.test.mjs — hồ sơ evals-sat-le-doc-du (hàng R1 của lộ trình kit).
//
// Kho viết evals.yaml kiểu danh sách sát lề vẫn được kit đọc đủ đầu vào, vùng tệp, danh sách
// bằng chứng; danh sách không đọc được lên cờ có tên. Mỗi ca ghim MỘT vế của một AC, có đối chứng
// dương và chiều đỏ trên CÙNG fixture (do mã sinh), thông điệp ghim. Bản base = git archive của
// hằng BASE_DIRS (evals-sat-le-lib.mjs). Đường dẫn suy từ vị trí tệp này.
import { createRequire } from 'node:module';
import path from 'node:path';
import { realpathSync } from 'node:fs';
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
ca('BC1', 'ba cách viết cho cùng inputs/paths/evidence_required/mảng bắt buộc (ma trận viết trước)', () => {
  let can = 0, so = 0; const sai = [];
  for (const cach of L.CACH) for (const tc of L.MO_HINH) for (const k of truongCua(tc)) can++;
  for (const cach of L.CACH) {
    const r = CHAY[cach];
    if (r.rc !== 0) return `${cach}: s4-args rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
    if (/danh sách không đọc được/.test(r.stderr)) return `${cach}: cờ sai trên cách hợp lệ`;
    for (const tc of L.MO_HINH) {
      const e = r.args.evals.find(x => x.id === tc.id);
      for (const k of truongCua(tc)) { so++; if (J(giaTriArgs(r.d, e || {}, k)) !== J(tc.ds[k])) sai.push(`${cach} ${tc.id}.${k}=${J(e && e[k])}`); }
    }
  }
  if (so !== can) return `ma trận hụt: ${so}/${can}`;
  return !sai.length || `thiếu: ${sai.slice(0, 3).join(' · ')} (${sai.length} phần tử)`;
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
  const dot = L.dungBanSaoLib('canhBao.push(', 'void (', 3);
  const r = L.chayS4(KHO_KD, { agRoot: dot });
  if (r.rc !== 0) return `rc ${r.rc} — ${r.stderr.trim().split('\n').pop()}`;
  if (dongCo(r.stderr).length) return 'đột biến không tắt được cờ';
  console.log(`    · cờ im: ${MUC_KD[0]}`); return true;
});

console.log(`Results: ${pass} passed, ${fail} failed (evals-sat-le)`);
process.exit(fail ? 1 : 0);
