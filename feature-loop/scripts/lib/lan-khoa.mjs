// lan-khoa.mjs — MỘT nguồn danh sách khoá config của làn ghim lại thêm ở hồ sơ gia-lan-ghim-lai
// (Vòng A), bộ đọc kiểm giá trị, và dòng tổng kết cuối lượt. Khối LAN-KHOA là thứ GUIDE §7.1 và ca
// AC-6 rút ra — thêm một khoá ở đây mà không khai ở GUIDE là ca đó đỏ.
// Mọi khoá VẮNG = hành vi trước vòng (luật «cân trên mọi kho», CLAUDE.md 26/09).
import { spawnSync } from 'node:child_process';

// <<<LAN-KHOA
export const LAN_KHOA = [
  { khoa: 'feature_loop.repin_retry', kieu: '0 | 1', mo_ta: 'chạy lại một lệnh đỏ đúng một lần, một mình, gọi tên ca chập chờn' },
  { khoa: 'feature_loop.model_evals', kieu: 'danh sách <slug>/<Eid>', mo_ta: 'eval gọi model thật — không bao giờ chạy lại, đếm ở tổng kết' },
  { khoa: 'feature_loop.repin_budget_min', kieu: 'số phút > 0', mo_ta: 'trần mỗi lượt; cờ --tran-phut thắng khoá; vượt trần thoát 4' },
  { khoa: 'feature_loop.repin_cost_cmd', kieu: 'lệnh in một số tăng theo chi tiêu', mo_ta: 'chạy trước lệnh đầu và sau lệnh cuối, tổng kết ghi chênh' },
  { khoa: 'feature_loop.repin_ci_blank_env', kieu: 'danh sách tên biến', mo_ta: 'suite chạy với các biến này đặt rỗng (giống CI); eval giữ env đầy đủ' },
];
// LAN-KHOA>>>

const loi = (khoa, kieu, gia) => { const e = new Error(`config.yaml ${khoa}: "${gia}" không hợp lệ — ${kieu}`); e.khoa = khoa; return e; };
const BIEN_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const rong = (v) => v == null || String(v).trim() === '';

// core = lib/evidence-core.cjs của bộ máy (resolveConfigKey, resolveConfigList). Giá trị sai → ném
// Error gọi tên khoá + giá trị hợp lệ; làn bắt và thoát 2 (nguồn hỏng).
export function docKhoa(configText, core) {
  const k = (n) => core.resolveConfigKey(configText, n);
  const ds = (n) => { const v = core.resolveConfigList(configText, n); return Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean) : []; };
  const r = k('feature_loop.repin_retry');
  let retry = 0;
  if (!rong(r)) { if (!/^[01]$/.test(String(r).trim())) throw loi('feature_loop.repin_retry', 'dùng 0 | 1', r); retry = Number(String(r).trim()); }
  const model = ds('feature_loop.model_evals');
  for (const m of model) if (!/^[\w.-]+\/[\w.-]+$/.test(m)) throw loi('feature_loop.model_evals', 'mỗi mục dạng <slug>/<Eid>', m);
  const b = k('feature_loop.repin_budget_min');
  let budget = null;
  if (!rong(b)) { const n = Number(String(b).trim()); if (!(Number.isFinite(n) && n > 0)) throw loi('feature_loop.repin_budget_min', 'số phút > 0', b); budget = n; }
  const cost = k('feature_loop.repin_cost_cmd');
  const blank = ds('feature_loop.repin_ci_blank_env');
  for (const x of blank) if (!BIEN_RE.test(x)) throw loi('feature_loop.repin_ci_blank_env', 'tên biến môi trường (chữ, số, gạch dưới; không bắt đầu bằng số)', x);
  return { repin_retry: retry, model_evals: new Set(model), repin_budget_min: budget, repin_cost_cmd: rong(cost) ? null : String(cost), repin_ci_blank_env: blank };
}

// Chạy lệnh đo chi phí — không bao giờ ném: lỗi trả { loi } để tổng kết in «lỗi (…)».
export function doChiPhi(cmd, cwd, env) {
  try {
    const r = spawnSync('bash', ['-c', cmd], { cwd, env, encoding: 'utf8', timeout: 30000 });
    if (r.status !== 0) return { loi: `lệnh thoát ${r.status === null ? 'do hết giờ' : r.status}` };
    const m = String(r.stdout || '').match(/-?\d+(?:[.,]\d+)?/);
    if (!m) return { loi: 'lệnh không in số' };
    return Number(m[0].replace(',', '.'));
  } catch (e) { return { loi: String((e && e.message) || e).split('\n')[0] }; }
}

// → { obj (khoá tong_ket), dong (dòng stderr cuối, bắt đầu «[lane] TỔNG KẾT») }
// model_carry cố định 0 ở Vòng A — ô giữ chỗ cho carry của Vòng B (hạt giống).
export function dungTongKet({ ketCuc, ms, soLenh, modelGoi, chapChon, chiPhi }) {
  const phut = Math.round(ms / 6000) / 10;
  const obj = Object.assign({ ket_cuc: ketCuc, phut, so_lenh: soLenh, model_goi: modelGoi, model_carry: 0, chap_chon: chapChon },
    chiPhi === undefined ? {} : (typeof chiPhi === 'number' ? { chi_phi: Math.round(chiPhi * 10000) / 10000 } : { chi_phi_loi: chiPhi.loi }));
  const veChiPhi = chiPhi === undefined ? ''
    : (typeof chiPhi === 'number' ? ` · chi phí đo: ${obj.chi_phi} (chênh trong khoảng làn chạy, gồm mọi phiên chạy cùng lúc)` : ` · chi phí đo: lỗi (${chiPhi.loi})`);
  const dong = `[lane] TỔNG KẾT — ${ketCuc} · ${phut} phút · ${soLenh} lệnh · eval model thật: gọi ${modelGoi}, carry 0 · chập chờn: ${chapChon}${veChiPhi}`;
  return { obj, dong };
}
