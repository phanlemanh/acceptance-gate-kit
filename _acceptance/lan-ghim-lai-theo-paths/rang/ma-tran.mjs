// Ma trận hồ sơ M — 12 ô, VIẾT TRƯỚC (hợp đồng lan-ghim-lai-theo-paths, mục «Ma trận hồ sơ M»).
// Mỗi ô: evals.yaml của hồ sơ + diff sau pin + kỳ vọng dưới khoá `paths`:
//   'hoa-cu'  — vẫn hoá cũ (tệp nào: `tep`)      'loc'  — bộ lọc áp, không hoá cũ, có NOTE bỏ qua
//   'cu'      — giữ luật cũ (hoá cũ như khoá vắng) 'khong' — không hoá cũ ở CẢ hai luật
// Răng đòi ĐÚNG M_SO_O ô; số ô lệch là đỏ (phản biện 03/10, P1 «ma trận tự đếm»).
export const M_SO_O = 12;

const ev = (id, ex, paths = '', extra = '') =>
  `  - id: ${id}\n    criterion: AC-1\n    executor: ${ex}\n    cmd: config:executors.script.rang_ok\n    expected: exit 0\n${paths}${extra}    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`;
const Y = (...b) => `schema_version: 1\nfeature_slug: feat\nevals:\n${b.join('')}`;
const P = (...g) => `    paths: [${g.map(x => `"${x}"`).join(', ')}]\n`;

export const MA_TRAN = [
  { id: 'M1', evalsYaml: Y(ev('E1', 'script', P('src/**'))), diff: ['src/a.js'], kyVong: 'hoa-cu', tep: ['src/a.js'] },
  { id: 'M2', evalsYaml: Y(ev('E1', 'script', P('src/**'))), diff: ['lib2/b.js'], kyVong: 'loc' },
  { id: 'M3', evalsYaml: Y(ev('E1', 'script', P('_acceptance/config.yaml', 'docs/**'))), diff: ['_acceptance/config.yaml', 'docs/x.md'], kyVong: 'khong' },
  { id: 'M4', evalsYaml: Y(ev('E1', 'script'), ev('E2', 'script', P('src/**'))), diff: ['lib2/b.js'], kyVong: 'cu' },
  { id: 'M5', evalsYaml: Y(ev('E1', 'script', P('src/**')), ev('E2', 'script', '', '    status: not-run\n')), diff: ['lib2/b.js'], kyVong: 'loc' },
  { id: 'M6', evalsYaml: Y(ev('E1', 'script', P('src/**')), ev('E2', 'ui-check', P('ui/**'))), diff: ['ui/p.tsx'], kyVong: 'hoa-cu', tep: ['ui/p.tsx'] },
  { id: 'M7', evalsYaml: null, diff: ['lib2/b.js'], kyVong: 'cu' },
  { id: 'M8', evalsYaml: 'evals:\n  - id: E1\n   executor: [script\n    paths: ["src/**"\n', diff: ['lib2/b.js'], kyVong: 'cu' },
  { id: 'M9', evalsYaml: Y(ev('E1', 'script', P('src/**'))), diff: ['lib2/b.js'], kyVong: 'loc' },
  { id: 'M10', evalsYaml: Y(ev('E1', 'script', '    paths:\n      - "src/**"\n')), diff: ['lib2/b.js'], kyVong: 'loc' },
  { id: 'M11', evalsYaml: Y(ev('E1', 'script', '    paths: "src/**"\n')), diff: ['lib2/b.js'], kyVong: 'loc' },
  { id: 'M12', evalsYaml: Y(ev('E1', 'judgment')), diff: ['lib2/b.js'], kyVong: 'cu' },
];
if (MA_TRAN.length !== M_SO_O) throw new Error(`số ô lệch: ${MA_TRAN.length} ≠ ${M_SO_O}`);
