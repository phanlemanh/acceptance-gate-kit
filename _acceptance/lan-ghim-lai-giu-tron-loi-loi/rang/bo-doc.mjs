// Bảng cách gọi MỌI bộ đọc run-log của cây đang kiểm — viết TRƯỚC. Chân E4 rút danh sách bộ
// đọc bằng tìm «run-log.jsonl» trong scripts/, lib/, feature-loop/scripts/ (trừ test) và đòi
// mỗi tệp rút được có ĐÚNG một hàng ở đây; thiếu hàng → «bộ đọc chưa đo».
// goi(kho) → { status, out } · nhieu: cách làm nhiễu sổ để chứng bộ đọc ĐÃ đọc nó
//   'xoa-log'  — xoá run-log.jsonl của hồ sơ · 'sha-pin' — đổi sha của dòng repin chống lưng pin
//   'them-tally' · 'them-panel' · 'them-baseline' · 'them-thuoc-vat-hong' — thêm đúng loại dòng bộ đọc ấy đọc
//   'eval-pin-do' — dòng pin chống lưng mang mã đỏ cho E1 · 'noi' — bên VIẾT: dòng pin mới nối SAU dấu đỏ
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { KIT } from './kho-mau.mjs';
const N = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', ...o });
const R = (r) => ({ status: r.status, out: (r.stdout || '') + '\n--stderr--\n' + (r.stderr || '') });
const S = (p) => path.join(KIT, p);
export const BO_DOC = [
  { tep: 'scripts/pre-merge-check.sh', nhieu: 'sha-pin', goi: (k) => R(spawnSync('bash', [S('scripts/pre-merge-check.sh'), k.R], { encoding: 'utf8' })) },
  { tep: 'scripts/recheck-evidence.cjs', nhieu: 'sha-pin', goi: (k) => R(N([S('scripts/recheck-evidence.cjs'), path.join(k.R, '_acceptance/feat/evidence-report.md')])) },
  // Thư viện: không có hàm công khai nào đọc trọn sổ để quyết; quyết định của nó lộ qua bộ kiểm lại.
  { tep: 'lib/evidence-core.cjs', nhieu: 'eval-pin-do', goi: (k) => R(N([S('scripts/recheck-evidence.cjs'), path.join(k.R, '_acceptance/feat/evidence-report.md')])) },
  { tep: 'scripts/gate-card.js', nhieu: 'them-thuoc-vat-hong', goi: (k) => R(N([S('scripts/gate-card.js'), '--root', k.R, '--slug', 'feat', '--extract'])) },
  { tep: 'scripts/loop-health.mjs', nhieu: 'xoa-log', goi: (k) => R(N([S('scripts/loop-health.mjs'), '--root', k.R])) },
  { tep: 'scripts/acceptance-gold.mjs', nhieu: 'them-panel', goi: (k) => R(N([S('scripts/acceptance-gold.mjs'), '--root', k.R, '--json'])) },
  { tep: 'feature-loop/scripts/thuoc-vat.mjs', nhieu: 'them-hai-tally', goi: (k) => R(N([S('feature-loop/scripts/thuoc-vat.mjs'), '--root', k.R, '--slug', 'feat', '--ag-root', KIT, '--giua-hai-luot'])) },
  { tep: 'feature-loop/scripts/round-tally-read.mjs', nhieu: 'them-tally', goi: (k) => R(N([S('feature-loop/scripts/round-tally-read.mjs'), '--run-log', path.join(k.R, '_acceptance/feat/run-log.jsonl')])) },
  { tep: 'feature-loop/scripts/s4-args.mjs', nhieu: 'them-baseline', goi: (k) => { const o = path.join(k.R, '..', path.basename(k.R) + '-s4.json'); const r = R(N([S('feature-loop/scripts/s4-args.mjs'), '--slug', 'feat', '--root', k.R, '--ag-root', KIT, '--no-carry', '--diff-base', 'HEAD~1', '--out', o])); let t = ''; try { t = JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(readFileSync(o, 'utf8'))).filter(([x]) => !/^(invoked|generated)/.test(x)))); } catch { t = '(không có tệp args)'; } return { status: r.status, out: r.out + '\n--args--\n' + t }; } },
  { tep: 'lib/nhan-canh-gay.cjs', nhieu: 'them-cay-doi', goi: (k) => R(N([S('lib/nhan-canh-gay.cjs'), '--luot', '--root', k.R, '--slug', 'feat'])) },
  { tep: 'feature-loop/scripts/repin-lane.mjs', nhieu: 'noi', goi: (k) => R(N([S('feature-loop/scripts/repin-lane.mjs'), '--root', k.R, '--ag-root', KIT, '--slug', 'feat', '--skip-unchanged', '--allow-dirty'])) },
];
