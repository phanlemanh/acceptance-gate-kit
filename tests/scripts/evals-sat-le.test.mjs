// evals-sat-le.test.mjs — hồ sơ evals-sat-le-doc-du (hàng R1 của lộ trình kit).
//
// Kho viết evals.yaml kiểu danh sách sát lề vẫn được kit đọc đủ đầu vào, vùng tệp, danh sách
// bằng chứng; danh sách không đọc được lên cờ có tên. Mỗi ca ghim MỘT vế của một AC, có đối chứng
// dương và chiều đỏ trên CÙNG fixture (do mã sinh), thông điệp ghim. Bản base = git archive của
// hằng BASE_DIRS (evals-sat-le-lib.mjs). Đường dẫn suy từ vị trí tệp này.
import { createRequire } from 'node:module';
import path from 'node:path';
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

console.log(`Results: ${pass} passed, ${fail} failed (evals-sat-le)`);
process.exit(fail ? 1 : 0);
