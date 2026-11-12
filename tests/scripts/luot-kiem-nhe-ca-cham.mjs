// Ca AC-9 của hồ sơ luot-kiem-nhe: ba ca chậm (P161 của bộ plugin; LM13, LM20 của gate-card-lmcms.test.mjs) chạy
// nhanh hơn mà GIỮ NGUYÊN điều chúng khẳng định. Bản cũ của hai tệp ca rút từ điểm rẽ khỏi nhánh chính bằng
// `git show`; bản cũ và bản mới chạy trên CÙNG cây, so dòng kết quả; trên fixture hỏng, hai bản cùng đỏ cùng thông
// điệp. Không phải *.test.mjs: chạy bản cũ tốn vài phút nên không vào bộ kiểm thường trực — chỉ chạy ở lượt chấm.
// Fixture: một worktree tạm của HEAD (dùng chung lịch sử git — P161 cần commit mốc của nó), xoá khi xong.
// Dùng: node tests/scripts/luot-kiem-nhe-ca-cham.mjs [--ca p161,lm,do-p161,do-khoa,do-lm13,do-lm20]
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'lkn9-'));
const WT = path.join(TMP, 'wt');
const PLUGINS = path.join(ROOT, 'tests', 'plugins', 'run-tests.sh');
const LMCMS = path.join(ROOT, 'tests', 'scripts', 'gate-card-lmcms.test.mjs');
let wtCo = false;
const don = () => {
  if (wtCo) spawnSync('git', ['-C', ROOT, 'worktree', 'remove', '--force', WT]);
  try { rmSync(TMP, { recursive: true, force: true }); } catch {}
};
process.on('exit', don);
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { don(); process.exit(130); });

const i = process.argv.indexOf('--ca');
const CHON = i > 0 ? process.argv[i + 1].split(',') : ['p161', 'lm', 'do-p161', 'do-khoa', 'do-lm13', 'do-lm20'];
let passed = 0, failed = 0;
const ca = async (n, khoa, f) => {
  if (!CHON.includes(khoa)) return;
  try { const g = await f(); passed++; console.log(`  PASS: ${n}${g ? ` — ${g}` : ''}`); }
  catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${String(e.message).split('\n').join('\n    ')}`); }
};
const die = (m) => { throw new Error(m); };
const git = (...a) => {
  const r = spawnSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) die(`git ${a.join(' ')} thoát ${r.status}: ${r.stderr}`);
  return r.stdout;
};
const motLan = (src, kim, ten) => { const n = src.split(kim).length - 1; if (n !== 1) die(`kim «${ten}» khớp ${n} lần (cần 1)`); };

// Điểm rẽ khỏi nhánh chính: origin/main nếu có, không thì main.
const nhanh = ['origin/main', 'main'].find((b) => spawnSync('git', ['-C', ROOT, 'rev-parse', '--verify', '-q', b]).status === 0);
if (!nhanh) die('không tìm thấy nhánh chính (origin/main, main)');
const BASE = git('merge-base', 'HEAD', nhanh).trim();
const CU_PLUGINS = path.join(TMP, 'plugins-cu.sh');
writeFileSync(CU_PLUGINS, git('show', `${BASE}:tests/plugins/run-tests.sh`));
const CU_LMCMS_SRC = git('show', `${BASE}:tests/scripts/gate-card-lmcms.test.mjs`);
if (readFileSync(PLUGINS, 'utf8') === readFileSync(CU_PLUGINS, 'utf8')) die(`bộ chạy plugin ở ${BASE.slice(0, 8)} trùng bản hiện tại — không có gì để so`);

const env = (them) => {
  const e = { ...process.env, THOI_GIAN_CA_DIR: path.join(TMP, 'tg'), ...them };
  delete e.GITHUB_ACTIONS; delete e.GITHUB_STEP_SUMMARY;
  return e;
};
const chay = (lenh, args, them, cwd) => new Promise((res) => {
  const t0 = Date.now();
  const c = spawn(lenh, args, { env: env(them), cwd });
  let out = '';
  c.stdout.setEncoding('utf8'); c.stderr.setEncoding('utf8');
  c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
  c.on('close', (ma) => res({ ma, out, giay: ((Date.now() - t0) / 1000).toFixed(1) }));
});
const p161 = (runner, goc) => chay('bash', [runner, '--manh', 'vung:2'], { ONLY_BLOCK: 'P161', _PLUGINS_ROOT_GOC: goc });
const dongOk = (out) => out.split('\n').find((l) => l.startsWith('P161 OK:'));

// Gốc gương cho tệp ca LM: tests/scripts/<tệp ca> + gate-fixture.mjs + routing-baseline.mjs thật, scripts/ và lib/ trỏ về
// kho thật — tệp ca suy gốc từ vị trí nó, nên bản cũ và bản mới đứng CÙNG chỗ, cùng bộ dựng thẻ.
const guongLm = (ten, src) => {
  const g = path.join(TMP, `guong-${ten}`);
  mkdirSync(path.join(g, 'tests', 'scripts'), { recursive: true });
  for (const f of ['gate-fixture.mjs', 'routing-baseline.mjs']) copyFileSync(path.join(ROOT, 'tests', 'scripts', f), path.join(g, 'tests', 'scripts', f));
  for (const d of ['scripts', 'lib']) if (!existsSync(path.join(g, d))) symlinkSync(path.join(ROOT, d), path.join(g, d));
  const f = path.join(g, 'tests', 'scripts', 'lmcms.mjs');
  writeFileSync(f, src);
  return f;
};
const LM_CU = guongLm('cu', CU_LMCMS_SRC);
const LM_MOI = guongLm('moi', readFileSync(LMCMS, 'utf8'));
const lm = (tep, ca, goc) => chay('node', [tep], { LMCMS_ONLY: ca, LMCMS_ROOT: goc });
const dongLm = (out, ca) => out.split('\n').filter((l) => new RegExp(`^\\s*(PASS|FAIL): ${ca} `).test(l)).map((l) => l.trim());

const datWorktree = () => {
  if (wtCo) return;
  git('worktree', 'add', '--detach', '-q', WT, 'HEAD');
  wtCo = true;
};

await ca('LKN-AC9-p161', 'p161', async () => {
  const [cu, moi] = await Promise.all([p161(CU_PLUGINS, ROOT), p161(PLUGINS, ROOT)]);
  if (cu.ma !== 0 || moi.ma !== 0) die(`P161 trên cây thật: bản cũ thoát ${cu.ma}, bản mới thoát ${moi.ma}\n${moi.out.slice(-600)}`);
  const a = dongOk(cu.out), b = dongOk(moi.out);
  if (!a || !b) die(`thiếu dòng «P161 OK:» — cũ: ${a} · mới: ${b}`);
  if (a !== b) die(`dòng kết quả lệch\n  cũ : ${a}\n  mới: ${b}`);
  return `«${b}» · bản cũ ${cu.giay} s · bản mới ${moi.giay} s (chạy song song trên cùng máy)`;
});

await ca('LKN-AC9-lm', 'lm', async () => {
  const kq = [];
  for (const c of ['LM13', 'LM20']) {
    const [cu, moi] = await Promise.all([lm(LM_CU, c, ROOT), lm(LM_MOI, c, ROOT)]);
    const a = dongLm(cu.out, c), b = dongLm(moi.out, c);
    if (a.length !== 1 || b.length !== 1) die(`${c}: cần đúng một dòng kết quả mỗi bản — cũ ${JSON.stringify(a)} · mới ${JSON.stringify(b)}`);
    if (a[0] !== b[0]) die(`${c} lệch\n  cũ : ${a[0]}\n  mới: ${b[0]}`);
    kq.push(`${a[0].startsWith('PASS') ? 'PASS' : 'FAIL'} ${c} ở cả hai · cũ ${cu.giay} s · mới ${moi.giay} s`);
  }
  return kq.join(' ; ');
});

await ca('LKN-AC9-do-p161-mot-cong', 'do-p161', async () => {
  datWorktree();
  // một hồ sơ mà thẻ cổng 1 dựng được, thẻ cổng 2 (cũng là cổng hiện hành vì có báo cáo bằng chứng) thì không
  const d = path.join(WT, '_acceptance', 'zz-lkn-hong-cong-2'); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'contract.md'), '---\nschema_version: 1\nfeature: thu\nslug: zz-lkn-hong-cong-2\nrisk_tier: T2\nsurfaces: [cli]\nstatus: verified\napproved_by: X\napproved_at: 2026-11-11\n---\n\n# C\n\n## Criteria\n\n- AC-1: Given a When b Then c\n\n## Out of scope\n\n- a\n- b\n');
  writeFileSync(path.join(d, 'evidence-report.md'), '---\nschema_version: 1\nverdict: PASS\n---\n');
  const gc = path.join(WT, 'scripts', 'gate-card.js');
  const src = readFileSync(gc, 'utf8');
  const kim = "'use strict';\n";
  motLan(src, kim, "'use strict' của gate-card.js");
  writeFileSync(gc, src.replace(kim, kim + "{ const a = process.argv, i = a.indexOf('--slug'), g = a.indexOf('--gate');\n  if (i > 0 && a[i + 1] === 'zz-lkn-hong-cong-2' && !(g > 0 && a[g + 1] === '1')) { process.stderr.write('tiem: the cong 2 hong\\n'); process.exit(1); } }\n"));
  const k1 = spawnSync('node', [gc, '--root', WT, '--slug', 'zz-lkn-hong-cong-2', '--gate', '1'], { encoding: 'utf8' }).status;
  const k2 = spawnSync('node', [gc, '--root', WT, '--slug', 'zz-lkn-hong-cong-2', '--gate', '2'], { encoding: 'utf8' }).status;
  if (k1 !== 0 || k2 === 0) die(`fixture không hỏng đúng một cổng: cổng 1 thoát ${k1}, cổng 2 thoát ${k2}`);
  const [cu, moi] = await Promise.all([p161(CU_PLUGINS, WT), p161(PLUGINS, WT)]);
  const loi = (o) => (o.split('\n').find((l) => l.includes('KHONG dung duoc')) || '').trim();
  const a = loi(cu.out), b = loi(moi.out);
  if (cu.ma === 0 || moi.ma === 0) die(`bản ${cu.ma === 0 ? 'cũ' : 'mới'} vẫn xanh trên hồ sơ hỏng cổng 2`);
  if (!a || a !== b) die(`hai bản đỏ khác thông điệp\n  cũ : ${a || cu.out.slice(-300)}\n  mới: ${b || moi.out.slice(-300)}`);
  return `cả hai bản đỏ: «${b}»`;
});

await ca('LKN-AC9-do-khoa-nho', 'do-khoa', async () => {
  const src = readFileSync(PLUGINS, 'utf8');
  const kim = '        return (str(js), h, slug, gate)  # KHOA-NHO\n';
  motLan(src, kim, 'khoá nhớ của P161');
  const tep = path.join(TMP, 'plugins-khoa-gop.sh');
  writeFileSync(tep, src.replace(kim, '        return (str(js), h, slug)  # KHOA-NHO\n'));
  const r = await p161(tep, ROOT);
  if (r.ma === 0) die('bản khoá nhớ bỏ cổng vẫn xanh — P161 không bắt');
  if (!r.out.includes('khoa nho gop hai cong')) die(`đỏ sai thông điệp: ${r.out.slice(-400)}`);
  return 'khoá nhớ gộp hai cổng';
});

const hongBaseline = (tep) => {
  datWorktree();
  const f = path.join(WT, 'tests', 'scripts', 'fixtures', tep);
  const L = readFileSync(f, 'utf8').split('\n');
  const j = L.findIndex((l) => l.trim() && !l.startsWith('#'));
  if (j < 0) die(`${tep} không có dòng nào`);
  const slug = L[j].split(/[\t|]/)[0].trim();
  writeFileSync(f, [...L.slice(0, j), ...L.slice(j + 1)].join('\n'));
  return { slug, phucHoi: () => writeFileSync(f, L.join('\n')) };
};
for (const [ten, khoa, c, tep] of [['LKN-AC9-do-lm13', 'do-lm13', 'LM13', 'sweep-baseline.txt'], ['LKN-AC9-do-lm20', 'do-lm20', 'LM20', 'routing-baseline.txt']]) {
  await ca(ten, khoa, async () => {
    const { slug, phucHoi } = hongBaseline(tep);
    try {
      const [cu, moi] = await Promise.all([lm(LM_CU, c, WT), lm(LM_MOI, c, WT)]);
      const a = dongLm(cu.out, c), b = dongLm(moi.out, c);
      if (!a[0]?.startsWith('FAIL') || !b[0]?.startsWith('FAIL')) die(`${c} không đỏ ở cả hai bản khi bản ghi mốc thiếu dòng của ${slug} — cũ ${a[0]} · mới ${b[0]}`);
      if (!cu.out.includes(slug) || !moi.out.includes(slug)) die(`${c}: thông điệp đỏ không gọi tên hồ sơ ${slug}`);
      return `${c} đỏ ở cả hai bản, cùng gọi tên ${slug}`;
    } finally { phucHoi(); }
  });
}

console.log(`\nResults: ${passed} passed, ${failed} failed (luot-kiem-nhe-ca-cham)`);
process.exit(failed ? 1 : 0);
