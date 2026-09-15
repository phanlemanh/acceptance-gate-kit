// RB — bản ghi mốc ĐỊNH TUYẾN là vật T1 máy sinh (hồ sơ chu-ky-khong-tu-lam-hoa-cu
// 15/09/2026, ADR 0017 nới ADR 0007).
//
// Hai chiều cho mỗi phép đo, trên kho git CODE-SINH trong chính lần chạy:
//   RB1  — có glob T1 → commit chỉ chạm bản ghi mốc + _acceptance/ → pre-merge 0 stale
//   RB1b — CHIỀU ĐỎ: gỡ glob → đúng VIOLATION stale, gọi tên tệp bản ghi mốc
//   RB2* — lệnh sinh: đúng một dòng của slug; dòng khác + comment nguyên văn;
//          đối chứng dương là CA LM20 THẬT chạy trên kho fixture, không phải bản chép.
//   RB3  — hai văn bản lệnh cổng: bước 6b, 7c, và hai bản chép bằng nhau từng ký tự.
// Pin của kho fixture do CHÍNH repin-lane.mjs --write ghi (writer thật).
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { routingLine, settled, spliceLine, FIXTURE_REL } from './routing-baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const RB = path.join(ROOT, 'tests', 'scripts', 'routing-baseline.mjs');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const PM = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const LMCMS = path.join(ROOT, 'tests', 'scripts', 'gate-card-lmcms.test.mjs');
const SIGNOFF = path.join(ROOT, 'commands', 'signoff.md');
const SKILL = path.join(ROOT, 'skills', 'acceptance', 'SKILL.md');
const require_ = createRequire(import.meta.url);
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

check('RB0 config cua KIT THAT khai ban ghi moc trong t1_skip_globs (doc bang chinh reader cua kit)', () => {
  const core = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const globs = core.resolveConfigList(readFileSync(path.join(ROOT, '_acceptance', 'config.yaml'), 'utf8'), 'risk_tiers.t1_skip_globs');
  assert.ok(Array.isArray(globs) && globs.includes(FIXTURE_REL), `t1_skip_globs phải có ${FIXTURE_REL}`);
});

// ── kho git code-sinh cho RB1/RB1b ─────────────────────────────────────────
const R = mkdtempSync(path.join(tmpdir(), 'rb-t1-'));
const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WS = path.join(R, '_acceptance', 'feat');
mkdirSync(WS, { recursive: true });
mkdirSync(path.join(R, 'tests', 'scripts', 'fixtures'), { recursive: true });
const BASE = path.join(R, FIXTURE_REL);
const CFG = path.join(R, '_acceptance', 'config.yaml');
const CFG_T1 = 'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "tests/scripts/fixtures/routing-baseline.txt"\n';
const CFG_NO_T1 = CFG_T1.replace('    - "tests/scripts/fixtures/routing-baseline.txt"\n', '');
writeFileSync(CFG, CFG_T1);
writeFileSync(path.join(R, 'suite.sh'), 'exit 0\n');
writeFileSync(path.join(R, 'rang-e1.sh'), 'test -f tien-de.txt\n');
writeFileSync(path.join(R, 'tien-de.txt'), 'x\n');
writeFileSync(BASE, '# moc dinh tuyen — comment phai giu NGUYEN VAN\nkhac\thoi=ký hay trả\tbao=cắt/hoãn\n');
writeFileSync(path.join(WS, 'contract.md'), '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n');
writeFileSync(path.join(WS, 'evals.yaml'), 'schema_version: 1\nfeature_slug: feat\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n');
git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
const H1 = git('rev-parse', 'HEAD');
writeFileSync(path.join(WS, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
writeFileSync(path.join(WS, 'evidence-report.md'),
  `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-09-01\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-01\n\n## Iterations\n\nRound 1 — PASS.\n`);
git('add', '-A'); git('commit', '-qm', 'evidence');
// PIN do writer thật ghi — bên đọc pre-merge phải đọc đúng vật writer sinh ra.
const w = spawnSync(process.execPath, [LANE, '--root', R, '--ag-root', ROOT, '--slug', 'feat', '--reason', 'ghim ban dau', '--write'], { encoding: 'utf8' });
if (w.status !== 0) { console.log(`  FAIL: RB-pin writer thật không ghi được\n    ${w.stderr}`); failed++; } else { passed++; console.log('  PASS: RB-pin do repin-lane --write that ghi'); }
git('add', '-A'); git('commit', '-qm', 'repin');
const pm = () => spawnSync('bash', [PM, R], { encoding: 'utf8' });

check('RB1 baseline trong T1: commit chi cham baseline + _acceptance -> pre-merge 0 stale', () => {
  writeFileSync(BASE, readFileSync(BASE, 'utf8') + 'feat\thoi=ký hay trả\tbao=cắt/hoãn\n');
  writeFileSync(path.join(WS, 'contract.md'), readFileSync(path.join(WS, 'contract.md'), 'utf8').replace('status: signed-off', 'status: signed-off\n# ghi chu'));
  git('add', '-A'); git('commit', '-qm', 'chu ky + dong ban ghi moc');
  const r = pm();
  assert.doesNotMatch(r.stdout, /VIOLATION \[feat\]: evidence is stale/, `bản ghi mốc trong T1 mà vẫn stale:\n${r.stdout}`);
});

check('RB1b CHIEU DO: go glob khoi config -> dung VIOLATION stale, goi ten ban ghi moc', () => {
  writeFileSync(CFG, CFG_NO_T1);
  const r = pm();
  assert.match(r.stdout, /VIOLATION \[feat\]: evidence is stale/, `gỡ glob mà lưới vẫn im — miễn trừ T1 không phải thứ đang giữ màu:\n${r.stdout}`);
  assert.match(r.stdout, /routing-baseline\.txt/, 'VIOLATION phải gọi tên tệp bản ghi mốc');
  writeFileSync(CFG, CFG_T1);   // hoàn nguyên cây; không commit (không có gì đổi so HEAD)
});

// ── RB2*: lệnh sinh ────────────────────────────────────────────────────────
// Kho riêng, có hồ sơ THẬT để gate-card --extract chạy được.
const R2 = mkdtempSync(path.join(tmpdir(), 'rb-sinh-'));
const WS2 = path.join(R2, '_acceptance', 'moi');
mkdirSync(WS2, { recursive: true });
mkdirSync(path.join(R2, 'tests', 'scripts', 'fixtures'), { recursive: true });
const BASE2 = path.join(R2, FIXTURE_REL);
const HEAD2 = '# comment dau tep — phai giu NGUYEN VAN\n# dong hai\n';
writeFileSync(BASE2, HEAD2);
writeFileSync(path.join(R2, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\n');
writeFileSync(path.join(WS2, 'contract.md'), '---\nschema_version: 1\nfeature: moi\nslug: moi\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n\n# Acceptance Contract: moi\n\n## Criteria\n\n### AC-1 — x\n\n**Given** a **When** b **Then** c\n\n## Out of scope\n\n- khong lam x\n- khong lam y\n');
writeFileSync(path.join(WS2, 'evals.yaml'), 'schema_version: 1\nfeature_slug: moi\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: "true"\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n');
const REPORT2 = path.join(WS2, 'evidence-report.md');
const repOf = (slug, ky) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff:${ky ? ' Manh 2026-09-15' : ''}\n---\n\n## Evidence\n- eval: E1\n  run_id: r1\n  exit_code: 0\n  verifier: config:executors.script.x\n  verified_at: 2026-09-01\n`;
const REP_CHUA_KY = repOf('moi', false);
writeFileSync(REPORT2, REP_CHUA_KY);
// Hồ sơ THỨ HAI, đã ký — dòng của nó trong bản ghi mốc do CHÍNH lệnh sinh ra
// (không gõ tay), để LM20 thật có một xưởng nhất quán mà soi.
const WSK = path.join(R2, '_acceptance', 'ho-so-khac');
mkdirSync(WSK, { recursive: true });
writeFileSync(path.join(WSK, 'contract.md'), readFileSync(path.join(WS2, 'contract.md'), 'utf8').replace(/moi/g, 'ho-so-khac'));
writeFileSync(path.join(WSK, 'evals.yaml'), readFileSync(path.join(WS2, 'evals.yaml'), 'utf8').replace('feature_slug: moi', 'feature_slug: ho-so-khac'));
writeFileSync(path.join(WSK, 'evidence-report.md'), repOf('ho-so-khac', true));
const rbFor = (slug, ...a) => spawnSync(process.execPath, [RB, '--root', R2, '--slug', slug, ...a], { encoding: 'utf8' });
const rb = (...a) => rbFor('moi', ...a);
{
  const r = rbFor('ho-so-khac', '--write');
  if (r.status !== 0) { console.log(`  FAIL: RB-seed không sinh được dòng hồ sơ thứ hai\n    ${r.stderr}`); failed++; }
}
const KHAC = readFileSync(BASE2, 'utf8').split('\n').find(l => l.startsWith('ho-so-khac\t')) + '\n';

check('RB2d CHUA KY -> exit 2, thong diep neu slug + «chua ky», tep khong doi', () => {
  const before = readFileSync(BASE2, 'utf8');
  const r = rb('--write');
  assert.equal(r.status, 2, `hồ sơ chưa ký phải exit 2, thấy ${r.status}`);
  assert.match(r.stderr, /moi/); assert.match(r.stderr, /chưa ký/);
  assert.equal(readFileSync(BASE2, 'utf8'), before, 'chưa ký mà tệp vẫn bị ghi');
});

writeFileSync(REPORT2, REP_CHUA_KY.replace('human_signoff:', 'human_signoff: Manh 2026-09-15'));

check('RB2 sinh dong: them dung mot dong cua slug, dong khac va comment nguyen van, idempotent', () => {
  const r = rb('--write');
  assert.equal(r.status, 0, r.stderr);
  const txt = readFileSync(BASE2, 'utf8');
  assert.ok(txt.startsWith(HEAD2), 'comment đầu tệp phải nguyên văn');
  assert.ok(txt.includes(KHAC), 'dòng hồ sơ khác phải nguyên văn');
  const dong = txt.split('\n').filter(l => l.split('\t')[0] === 'moi');
  assert.equal(dong.length, 1, `đúng MỘT dòng cho slug, thấy ${dong.length}`);
  assert.equal(dong[0], r.stdout.trim(), 'dòng ghi vào tệp phải bằng dòng in ra stdout');
  const lan1 = txt;
  assert.equal(rb('--write').status, 0);
  assert.equal(readFileSync(BASE2, 'utf8'), lan1, 'chạy lần hai phải KHÔNG đổi tệp (idempotent)');
});

check('RB2c CHIEU IM: dong cua ho so KHAC sua tay -> lenh sinh cho slug X KHONG cham no', () => {
  const doi = KHAC.replace('bao=Treo', 'bao=cắt/hoãn|Treo');
  writeFileSync(BASE2, readFileSync(BASE2, 'utf8').replace(KHAC, doi));
  assert.equal(rb('--write').status, 0);
  assert.ok(readFileSync(BASE2, 'utf8').includes(doi), 'lệnh sinh đã chạm dòng của hồ sơ khác');
  writeFileSync(BASE2, readFileSync(BASE2, 'utf8').replace(doi, KHAC));
});

check('RB2e ROUND-TRIP: LM20 NHAP routingLine + settled tu routing-baseline.mjs (import that, khong grep)', () => {
  const src = readFileSync(LMCMS, 'utf8');
  assert.match(src, /from '\.\/routing-baseline\.mjs'/, 'LM20 phải nhập từ nguồn của writer');
  // vị từ thật, không phải chuỗi: hai hàm cùng đối tượng với bản writer đang chạy
  const mod = require_('node:module');
  assert.equal(typeof routingLine, 'function');
  assert.equal(typeof settled, 'function');
  assert.equal(routingLine('s', { hoi: ['a', 'b'], bao: ['c'] }), 's\thoi=a|b\tbao=c');
  assert.equal(settled(R2, 'moi'), true, 'settled phải thấy chữ ký vừa ghi');
  assert.equal(settled(R2, 'khong-co'), false, 'hồ sơ không tồn tại phải là chưa-định-đoạt');
  assert.ok(mod);
});

check('RB2f gate-card --extract HONG -> exit khac 0 goi ten slug, tep byte-giong truoc', () => {
  const before = readFileSync(BASE2, 'utf8');
  const sap = path.join(R2, 'gate-card-sap.js');
  writeFileSync(sap, 'process.exit(9)\n');
  // dùng chính đường extract của lệnh, nhưng trỏ vào một bộ dựng thẻ sập
  const mod = spawnSync(process.execPath, ['-e', `
    import('${RB.replace(/\\/g, '/')}').then(m => {
      const got = m.extractRouting('${R2.replace(/\\/g, '/')}', 'moi', '${sap.replace(/\\/g, '/')}');
      if (!got.err) { console.error('KHONG bao loi'); process.exit(1); }
      if (!/moi/.test(got.err)) { console.error('loi khong goi ten slug'); process.exit(1); }
      process.exit(0);
    })`], { encoding: 'utf8' });
  assert.equal(mod.status, 0, `extract sập phải trả err gọi tên slug:\n${mod.stderr}`);
  assert.equal(readFileSync(BASE2, 'utf8'), before, 'extract sập mà tệp vẫn bị ghi');
});

check('RB2b DOI CHUNG DUONG: CA LM20 THAT chay tren kho fixture -> PASS: LM20', () => {
  // Không chép phép so: gọi đúng tệp ca của kit, trỏ gốc vào kho fixture.
  const r = spawnSync(process.execPath, [LMCMS], { encoding: 'utf8', env: { ...process.env, LMCMS_ROOT: R2 } });
  const lm20 = (r.stdout || '').split('\n').filter(l => /LM20/.test(l));
  assert.equal(lm20.length, 1, `ca LM20 phải chạy đúng một lần, thấy ${lm20.length}`);
  assert.match(lm20[0], /^\s*PASS: LM20/, `sau khi sinh dòng, LM20 THẬT phải xanh:\n${lm20[0]}`);
});

check('RB3 signoff.md buoc 6 goi lenh sinh, 7c them tep; SKILL chep khoi SIGNOFF-LANE-CLAUSE bang tung ky tu', () => {
  const so = readFileSync(SIGNOFF, 'utf8'), sk = readFileSync(SKILL, 'utf8');
  assert.match(so, /routing-baseline\.mjs --root \. --slug <slug> --write/, 'bước 6 phải chạy lệnh sinh');
  assert.match(so, /LMCMS_ONLY=LM20 node tests\/scripts\/gate-card-lmcms\.test\.mjs/, 'bước 6 phải chạy ĐÚNG MỘT ca LM20 làm đối chứng dương trong luồng thật');
  // Lời dặn phải mang SỐ ĐO THẬT của bước nó bắt chạy — vòng này tồn tại để cắt
  // phút; một bước cộng ~2 phút mà khai «vài giây» là tự dối ngay trong văn bản.
  assert.doesNotMatch(so.slice(so.indexOf('6b —'), so.indexOf('7. **Ghi và commit')), /vài giây/, 'bước 6b không được khai «vài giây» — đo thật là ≈1 ph 45 s');
  assert.match(so, /1 ph 45 s/, 'bước 6b phải nêu số đo thật của chính nó');
  assert.match(so, /git add[^\n]*routing-baseline\.txt|routing-baseline\.txt[^\n]*git add|thêm ` tests\/scripts\/fixtures\/routing-baseline\.txt`/, '7c phải đưa bản ghi mốc vào commit chữ ký');
  const pat = /<!-- <<<SIGNOFF-LANE-CLAUSE -->\n([\s\S]*?)<!-- SIGNOFF-LANE-CLAUSE>>> -->/;
  const a = (so.match(pat) || [])[1], b = (sk.match(pat) || [])[1];
  assert.ok(a && b, 'thiếu khối ở một trong hai văn bản');
  assert.equal(a, b, 'lệch bản chép: khối SIGNOFF-LANE-CLAUSE ở SKILL.md khác bản gốc ở signoff.md');
  assert.match(a, /--skip-unchanged/, 'khối gốc phải mang cờ --skip-unchanged');
  assert.match(a, /cây BẰNG PIN|cây bằng pin/, 'khối gốc phải nói ca cây bằng pin tự bỏ qua');
});

check('RB3-IM: sua mot dong NGOAI khoi va ngoai buoc 6/7c -> RB3 van XANH (rang do QUAN HE, khong ghim chuoi co dinh)', () => {
  const so = readFileSync(SIGNOFF, 'utf8');
  const pat = /<!-- <<<SIGNOFF-LANE-CLAUSE -->\n([\s\S]*?)<!-- SIGNOFF-LANE-CLAUSE>>> -->/;
  // bản sao có một dòng văn xuôi thêm ở cuối, ngoài mọi khối răng đọc
  const banSao = so + '\n<!-- một dòng ghi chú vô hại ở cuối tệp -->\n';
  assert.equal((banSao.match(pat) || [])[1], (so.match(pat) || [])[1], 'sửa ngoài khối mà khối đổi theo');
  // và: sửa GIỐNG NHAU ở cả hai bản vẫn phải bằng nhau (quan hệ, không phải chuỗi cố định)
  const them = 'x';
  assert.equal((so.match(pat) || [])[1] + them, (readFileSync(SKILL, 'utf8').match(pat) || [])[1] + them);
});

rmSync(R, { recursive: true, force: true });
rmSync(R2, { recursive: true, force: true });
console.log(`\nResults: ${passed} passed, ${failed} failed (routing-baseline-t1)`);
process.exit(failed ? 1 : 0);
