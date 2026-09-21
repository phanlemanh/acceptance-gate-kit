// thuoc-vat-fixture.mjs — dựng kho git cho bộ đếm vật · thước · nhát (thuoc-co-cua
// AC-11, AC-12, AC-13). Dùng chung cho `thuoc-vat.test.mjs`, `s4-args-tran-thuoc.test.mjs`
// và ca thẻ đọc dòng đếm — MỘT hàm dựng, không ba bản fixture viết tay.
//
// Kho do CODE sinh trong chính lượt chạy. Mỗi bước của kịch bản là một commit:
//   'vat'         — sửa `src/a.js`                         (lớp vật)
//   'thuoc'       — sửa `tests/a.test.mjs`                 (lớp thước)
//   'lan'         — sửa cả hai trong CÙNG một commit
//   'ho-so'       — nối một dòng vào run-log và sổ quyết định của hồ sơ
//   'implemented' — đưa hợp đồng từ `status: draft` sang `status: implemented`
// Nhánh `main` giữ commit gốc; mọi bước đi trên nhánh `vong` nên `--diff-base main` luôn
// khác HEAD (khuôn s4-args-expected-exit.test.mjs).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const SLUG = 'demo';
export const TEP = {
  vat: 'src/a.js',
  // Thước = răng của hồ sơ (test KHO là vật từ vòng nhan-trang-thai-va-reality, 21/09).
  thuoc: `_acceptance/${SLUG}/rang/a.mjs`,
  runLog: `_acceptance/${SLUG}/run-log.jsonl`,
  so: `_acceptance/${SLUG}/decisions.jsonl`,
  hopDong: `_acceptance/${SLUG}/contract.md`,
};
// Kịch bản chuẩn: một commit vật và BA commit thước ở S3 (trước mốc sàn), rồi mốc sàn,
// rồi hai nhát sửa thước và một commit vật.
export const KICH_BAN_CHUAN = ['vat', 'thuoc', 'thuoc', 'thuoc', 'implemented', 'thuoc', 'thuoc', 'vat'];

export const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

let dem = 0;
const noi = (d, rel, dong) => appendFileSync(path.join(d, rel), dong + '\n');

// buoc(d, loai) → sha của commit vừa tạo.
export function buoc(d, loai) {
  dem += 1;
  if (loai === 'vat') noi(d, TEP.vat, `// vat ${dem}`);
  else if (loai === 'thuoc') noi(d, TEP.thuoc, `// thuoc ${dem}`);
  else if (loai === 'lan') { noi(d, TEP.vat, `// vat ${dem}`); noi(d, TEP.thuoc, `// thuoc ${dem}`); }
  else if (loai === 'ho-so') {
    noi(d, TEP.runLog, JSON.stringify({ kind: 'ghi-chu', round: 1, n: dem }));
    noi(d, TEP.so, JSON.stringify({ id: `d-fixture-${dem}`, type: 'note', decision: `ghi so ${dem}` }));
  } else if (loai === 'implemented') {
    const f = path.join(d, TEP.hopDong);
    const src = readFileSync(f, 'utf8');
    if (!src.includes('status: draft')) throw new Error('fixture: hop dong khong con status: draft');
    writeFileSync(f, src.replace('status: draft', 'status: implemented'));
  } else throw new Error(`fixture: buoc la: ${loai}`);
  git(d, 'add', '-A');
  git(d, 'commit', '-qm', `${loai} ${dem}`);
  return git(d, 'rev-parse', 'HEAD');
}

// dungKho(dir, kichBan) → { d, goc, shas } — `goc` là commit đầu (có hồ sơ), `shas[i]`
// là commit của bước thứ i.
export function dungKho(dir, kichBan = KICH_BAN_CHUAN) {
  const d = dir;
  mkdirSync(path.join(d, '_acceptance', SLUG), { recursive: true });
  mkdirSync(path.join(d, 'src'), { recursive: true });
  mkdirSync(path.join(d, '_acceptance', SLUG, 'rang'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n'
    + 'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  writeFileSync(path.join(d, TEP.hopDong),
    `---\nschema_version: 1\nslug: ${SLUG}\nrisk_tier: T2\nstatus: draft\n---\n`);
  writeFileSync(path.join(d, '_acceptance', SLUG, 'evals.yaml'),
    `schema_version: 1\nfeature_slug: ${SLUG}\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/**]\n    expected: x\n`);
  writeFileSync(path.join(d, TEP.runLog), '');
  writeFileSync(path.join(d, TEP.so), JSON.stringify({ id: 'd-fixture-0', type: 'note', decision: 'mo ho so' }) + '\n');
  writeFileSync(path.join(d, TEP.vat), '// a\n');
  writeFileSync(path.join(d, TEP.thuoc), '// ca a\n');
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'goc');
  const goc = git(d, 'rev-parse', 'HEAD');
  git(d, 'checkout', '-qb', 'vong');
  const shas = kichBan.map(k => buoc(d, k));
  return { d, goc, shas };
}

// Dòng sổ «trần thước — » (van của AC-12). commit=false để dựng ca dòng sổ CHƯA commit.
export function ghiDongVan(d, { id = 'd-2026-09-17-9', commit = true } = {}) {
  noi(d, TEP.so, JSON.stringify({ id, type: 'revisit', decision: 'trần thước — khai giới hạn E2', stage: 'decided' }));
  if (!commit) return null;
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'van tran thuoc');
  return git(d, 'rev-parse', 'HEAD');
}
