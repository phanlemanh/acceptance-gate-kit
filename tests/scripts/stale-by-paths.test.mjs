// Đường dẫn suy từ vị trí tệp (không hardcode ROOT).
import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const core = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const { globToRe } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs'));
const Y = (blocks) => `evals:\n${blocks}`;
const ev = (id, ex, paths, extra = '') => `  - id: ${id}\n    criterion: AC-1\n    executor: ${ex}\n${paths}${extra}`;
let pass = 0; const ca = (n, f) => { f(); pass++; console.log('  PASS: ' + n); };
ca('SBP1 một tệp trong paths → kept', () => {
  const r = core.staleByPaths(['src/a.js', 'doc/x.txt'], Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, true); assert.deepEqual(r.kept, ['src/a.js']); assert.deepEqual(r.skipped, ['doc/x.txt']);
});
ca('SBP2 eval máy thiếu paths → apply=false', () => {
  const r = core.staleByPaths(['x'], Y(ev('E1', 'script', '') + ev('E2', 'test', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, false); assert.match(r.reason, /^eval-may-thieu-paths:E1$/);
});
ca('SBP3 chỉ ô not-run thiếu paths → apply=true', () => {
  const r = core.staleByPaths(['doc/x'], Y(ev('E1', 'script', '', '    status: not-run\n') + ev('E2', 'script', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, true); assert.deepEqual(r.kept, []);
});
ca('SBP4 paths ui-check vào hợp', () => {
  const r = core.staleByPaths(['ui/p.tsx'], Y(ev('E1', 'script', '    paths: ["src/**"]\n') + ev('E2', 'ui-check', '    paths: ["ui/**"]\n')));
  assert.deepEqual(r.kept, ['ui/p.tsx']);
});
ca('SBP5 evals vắng / hỏng / hợp rỗng / paths: [] → apply=false', () => {
  assert.equal(core.staleByPaths(['x'], null).reason, 'khong-co-evals');
  // ghim LÝ DO, không chỉ apply:false (lượt chấm 1, t5): YAML hỏng phải ra evals-hong, không lọt nhánh khác
  assert.equal(core.staleByPaths(['x'], 'evals:\n  - id: E1\n   executor: [script\n').reason, 'evals-hong');
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'script', '    paths: ["src/**"]\n')) + '  - id: E2\n    executor: [script\n').reason, 'evals-hong', 'một eval hỏng cạnh eval lành vẫn là hỏng');
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'judgment', ''))).reason, 'eval-ngoai-may-thieu-paths:E1');
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'script', '', '    status: not-run\n'))).reason, 'hop-paths-rong');
  assert.equal(core.staleByPaths(['x'], null).apply, false);
  assert.match(core.staleByPaths(['x'], Y(ev('E1', 'script', '    paths: []\n'))).reason, /eval-may-thieu-paths:E1/);
});
ca('SBP6 ba cách viết paths cùng kết luận', () => {
  const f = ['src/a.js', 'doc/x'];
  const a = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  const b = core.staleByPaths(f, Y(ev('E1', 'script', '    paths:\n      - "src/**"\n')));
  const c = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: "src/**"\n')));
  assert.deepEqual(a, b); assert.deepEqual(a, c);
});
ca('SBP7 bản glob của lib ≡ globToRe của carry-plan trên ma trận glob viết trước', () => {
  const G = ['src/**', 'src/**/x.js', '**/*.md', 'a/*.js', 'a?b.js', 'v1.0/(x)+[y].js', '_acceptance/**/rang/**'];
  const P = ['src/a.js', 'src/d/x.js', 'x.md', 'd/e/x.md', 'a/b.js', 'a/b/c.js', 'axb.js', 'a/b.js', 'v1.0/(x)+[y].js', '_acceptance/s/rang/r.sh'];
  let o = 0; for (const g of G) for (const p of P) { assert.equal(core.pathGlobToRe(g).test(p), globToRe(g).test(p), `${g} ~ ${p}`); o++; }
  assert.equal(o, G.length * P.length, 'số ô lệch');
});
ca('SBP8 chỉ thu: kept ⊆ staleFiles, kept ∪ skipped = staleFiles', () => {
  const f = ['src/a.js', 'doc/x', 'src/b.js'];
  const r = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  assert.deepEqual([...r.kept, ...r.skipped].sort(), [...f].sort());
});
ca('SBP9 tên tệp git in trong ngoặc (core.quotepath, tên có dấu) vẫn khớp paths; danh sách giữ nguyên chữ git', () => {
  const q = '"src/t\\303\\240i.js"';   // đúng chuỗi `git diff --name-only` in cho src/tài.js
  const r = core.staleByPaths(['src/a.js', q, '"lib2/b\\303\\240.js"'], Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  assert.deepEqual(r.kept, ['src/a.js', q], 'tên có dấu trong paths phải ở kept (giữ nguyên chữ git in)');
  assert.deepEqual(r.skipped, ['"lib2/b\\303\\240.js"']);
});
ca('SBP10 eval ngoài làn máy KHÔNG khai paths → giữ luật cũ (trừ ô not-run)', () => {
  const r = core.staleByPaths(['ui/Page.tsx'], Y(ev('E1', 'script', '    paths: ["src/**"]\n') + ev('E2', 'ui-check', '')));
  assert.equal(r.apply, false); assert.equal(r.reason, 'eval-ngoai-may-thieu-paths:E2');
  const r2 = core.staleByPaths(['ui/Page.tsx'], Y(ev('E1', 'script', '    paths: ["src/**"]\n') + ev('E2', 'judgment', '', '    status: not-run\n')));
  assert.equal(r2.apply, true, 'ô not-run không chặn lọc, bất kể executor');
});
ca('SBP11 chú thích cuối dòng paths: không nuốt danh sách khối', () => {
  const r = core.staleByPaths(['src/a.js'], Y(ev('E1', 'script', '    paths:   # vat do\n      - "src/**"\n')));
  assert.deepEqual(r.kept, ['src/a.js']);
});
ca('SBP12 dòng trống / chú thích giữa các mục khối không cắt mục sau; glob rỗng là hỏng', () => {
  const r = core.staleByPaths(['src/b/c.js'], Y(ev('E1', 'script', '    paths:\n      - "src/a/**"\n\n      # ghi chu\n      - "src/b/**"\n')));
  assert.deepEqual(r.kept, ['src/b/c.js']);
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'script', '    paths: [""]\n'))).apply, false, 'mảng chỉ có chuỗi rỗng → giữ luật cũ');
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'script', '    paths:\n      - ""\n'))).reason, 'evals-hong', 'glob rỗng dạng khối → hỏng, không phải «không vật»');
});
console.log(`Results: ${pass} passed`);
