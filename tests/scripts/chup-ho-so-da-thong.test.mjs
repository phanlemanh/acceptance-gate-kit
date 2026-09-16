// CH — răng «làn không được chạm hồ sơ đã thông Cổng Bằng chứng»
// (feature-loop/scripts/chup-ho-so-da-thong.mjs, cắm trong repin-lane.mjs).
//
// Ca thật: crm-onehub 16/09/2026 — một spec trong suite chung ghi đè
// `evidence/ve-that.json` của hồ sơ đã ký sau MỖI lượt chạy. Mọi ca dưới
// chạy CHÍNH làn thật trên MỘT kho git code-sinh; executor ghi vào đường dẫn
// lấy từ env `DICH`, nên chiều xanh và chiều đỏ là CÙNG fixture, chỉ khác đúng
// biến đang đo: tệp đích nằm trong hay ngoài cây hồ sơ đã thông cổng.
// Hai trạng thái «đã thông cổng» của fixture RÚT từ lib/workspace-record.cjs —
// một nguồn, không chép (owner veto 17/09 lối khai gạch hai tệp này trong hồ sơ
// đã ký ra-co-ten-lam-va-trao). Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, existsSync, utimesSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { evalsYamlWith } from './repin-fixture.mjs';
import { hoSoDaThong } from '../../feature-loop/scripts/chup-ho-so-da-thong.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const CHUP = path.join(ROOT, 'feature-loop', 'scripts', 'chup-ho-so-da-thong.mjs');
const req = createRequire(import.meta.url);
const { DA_THONG_CONG_2 } = req(path.join(ROOT, 'lib', 'workspace-record.cjs'));
const { frontmatterField } = req(path.join(ROOT, 'lib', 'evidence-core.cjs'));
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// Hai trạng thái đã thông cổng, hỏi lib: MAY là trạng thái máy thông (tên bất biến
// của làn V), KY là trạng thái còn lại — người ký. Nguồn rỗng hay thiếu một vế là
// bộ rút hỏng, không phải nguồn đổi.
const MAY = 'machine-cleared';
const KY = (Array.isArray(DA_THONG_CONG_2) ? DA_THONG_CONG_2 : []).find(s => s !== MAY);
assert.ok(KY && DA_THONG_CONG_2.includes(MAY) && DA_THONG_CONG_2.length === 2, `DA_THONG_CONG_2 của lib không đúng khuôn hai trạng thái: ${JSON.stringify(DA_THONG_CONG_2)}`);

// ── kho git code-sinh ──────────────────────────────────────────────────────
// feat-ky   KY (người ký)   — hồ sơ được ghim, có evidence/ve-that.json đã ký
// feat-may  MAY (máy thông) — không ghim, vẫn phải được chụp
// feat-dang implemented     — vòng S4 đang chấm: được ghi, răng phải IM
const R = mkdtempSync(path.join(tmpdir(), 'chup-ho-so-'));
process.on('exit', () => { try { rmSync(R, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const git = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const contract = (slug, status) => `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: ${status}\napproved_by: Manh Phan\n---\n`;
const WS = path.join(R, '_acceptance', 'feat-ky');
const VE_THAT = path.join(WS, 'evidence', 've-that.json');
mkdirSync(path.join(WS, 'evidence'), { recursive: true });
mkdirSync(path.join(R, '_acceptance', 'feat-may'), { recursive: true });
mkdirSync(path.join(R, '_acceptance', 'feat-dang', 'evidence'), { recursive: true });
writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
  'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_e1: "sh rang-e1.sh"\n');
// suite: ghi vào $SUITE_DICH nếu có (chiều «thêm tệp» ở pha suite)
writeFileSync(path.join(R, 'suite.sh'), 'if [ -n "$SUITE_DICH" ]; then mkdir -p "$(dirname "$SUITE_DICH")" && printf "suite\\n" > "$SUITE_DICH"; fi\nexit 0\n');
// eval của feat-ky: tạo phẩm đi tới $DICH, nội dung $NOI_DUNG — thiếu DICH là exit 9 (không xanh lặng)
writeFileSync(path.join(R, 'rang-e1.sh'), ': "${DICH:?thieu DICH}" || exit 9\nmkdir -p "$(dirname "$DICH")" && printf "%s\\n" "${NOI_DUNG:-lan-chay}" > "$DICH"\n');
writeFileSync(path.join(WS, 'contract.md'), contract('feat-ky', KY));
writeFileSync(path.join(WS, 'evals.yaml'), evalsYamlWith(['E1']).replace('slug: feat-repin', 'slug: feat-ky'));
writeFileSync(VE_THAT, 'da-ky\n');
writeFileSync(path.join(R, '_acceptance', 'feat-may', 'contract.md'), contract('feat-may', MAY));
writeFileSync(path.join(R, '_acceptance', 'feat-dang', 'contract.md'), contract('feat-dang', 'implemented'));
writeFileSync(path.join(R, '.gitignore'), '.acceptance-runs/\n');
git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
const HEAD1 = git('rev-parse', 'HEAD');
writeFileSync(path.join(WS, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-16T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: HEAD1, eval: 'E1', exit_code: 0 }) + '\n');
writeFileSync(path.join(WS, 'evidence-report.md'),
  `---\nschema_version: 1\nfeature_slug: feat-ky\nverdict: PASS\nverified_commit: ${HEAD1}\nhuman_signoff: Manh 2026-09-16\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-16\n\n## Iterations\n\nRound 1 — PASS.\n`);
git('add', '-A'); git('commit', '-qm', 'evidence');
// mtime cũ có chủ đích: «ghi lại cùng byte» phải lộ ra bằng mtime, không nhờ may về độ phân giải đồng hồ
const QUA_KHU = new Date('2026-09-01T00:00:00Z');
utimesSync(VE_THAT, QUA_KHU, QUA_KHU);

// ── CH0: MỘT nguồn cho hai trạng thái đã thông cổng ────────────────────────
// Module không được mang bản chép của mảng lib; làn truyền mảng vào. Ba vế:
// (a) mã nguồn module không chứa mảng chuỗi trạng thái nào; (b) gọi thiếu mảng
// → dừng có tên, không lặng lẽ trả 0 hồ sơ; (c) gọi với mảng của lib → đúng hai
// hồ sơ đã thông cổng, hồ sơ implemented ở ngoài. Mutant (a): tiêm một mảng vào
// bản sao của mã nguồn → vế (a) đỏ.
check('CH0 module không chép mảng trạng thái (hỏi lib); thiếu mảng → dừng có tên; có mảng → đúng 2 hồ sơ đã thông cổng', () => {
  const src = readFileSync(CHUP, 'utf8');
  const mangChuoi = /\[\s*'[a-z][a-z-]*'\s*(,\s*'[a-z][a-z-]*'\s*)*\]/;
  assert.doesNotMatch(src, mangChuoi, 'module chứa một mảng chuỗi — bản chép của DA_THONG_CONG_2 mọc lại');
  const mut = src.replace('export function hoSoDaThong', `const CHEP = ['${MAY}'];\nexport function hoSoDaThong`);
  assert.notEqual(mut, src, 'mutant không tiêm được — mốc hàm đổi tên?');
  assert.match(mut, mangChuoi, 'phép quét không thấy mảng vừa tiêm — thước mù');
  assert.throws(() => hoSoDaThong(R, frontmatterField), /thiếu mảng trạng thái đã thông cổng.*DA_THONG_CONG_2/);
  assert.throws(() => hoSoDaThong(R, frontmatterField, []), /thiếu mảng trạng thái đã thông cổng/);
  assert.deepEqual(hoSoDaThong(R, frontmatterField, DA_THONG_CONG_2), ['feat-ky', 'feat-may']);
});

const REPORT = path.join(WS, 'evidence-report.md');
const LOG = path.join(WS, 'run-log.jsonl');
const lane = (env, ...a) => spawnSync(process.execPath, [LANE, '--root', R, '--ag-root', ROOT, '--slug', 'feat-ky', ...a], { encoding: 'utf8', env: { ...process.env, ...env } });
const trangThai = () => ({ log: readFileSync(LOG, 'utf8'), rep: readFileSync(REPORT, 'utf8') });

check('CH1 ĐỐI CHỨNG DƯƠNG: tạo phẩm ra .acceptance-runs/ + suite ghi vào hồ sơ implemented → làn XANH, dòng chụp nói 2 hồ sơ, 0 tệp bị chạm', () => {
  const truoc = trangThai();
  const r = lane({ DICH: '.acceptance-runs/feat-ky/ve-that.json', SUITE_DICH: '_acceptance/feat-dang/evidence/khung.json' });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(path.join(R, '.acceptance-runs', 'feat-ky', 've-that.json')), 'eval không chạy thật — xanh này không chứng gì');
  assert.ok(existsSync(path.join(R, '_acceptance', 'feat-dang', 'evidence', 'khung.json')), 'suite không ghi thật vào hồ sơ implemented — chiều im không được đo');
  assert.match(r.stderr, /chụp 2 hồ sơ đã thông Cổng Bằng chứng \(\d+ tệp\) trước suite · sau eval: 0 tệp bị chạm/);
  assert.equal(readFileSync(VE_THAT, 'utf8'), 'da-ky\n');
  assert.deepEqual(trangThai(), truoc, 'làn không --write mà hồ sơ đổi');
});

check('CH2 PHÁ VẬT THẬT (cùng fixture, chỉ đổi DICH): eval ghi vào evidence/ của hồ sơ đã ký → làn ĐỎ exit 1, ghim đúng đường tệp, KHÔNG ghi run-log/report', () => {
  const truoc = trangThai();
  const r = lane({ DICH: '_acceptance/feat-ky/evidence/ve-that.json' }, '--write');
  assert.equal(r.status, 1, `làn phải đỏ:\n${r.stderr}`);
  assert.match(r.stderr, /LÀN ĐỎ — không ghi gì \(suite \[0\]; eval đỏ: không\)/);
  assert.match(r.stderr, /executor chạm hồ sơ đã thông Cổng Bằng chứng — 1 tệp:\n {2}- _acceptance\/feat-ky\/evidence\/ve-that\.json \(đổi nội dung\)\n/);
  assert.deepEqual(trangThai(), truoc, 'làn đỏ mà run-log/report vẫn bị ghi');
  assert.doesNotMatch(r.stderr, /recheck-evidence xanh/);
  writeFileSync(VE_THAT, 'da-ky\n'); utimesSync(VE_THAT, QUA_KHU, QUA_KHU);
});

check('CH3 ghi lại ĐÚNG byte đã ký → vẫn ĐỎ, gọi «ghi lại, cùng nội dung» (mtime là một nửa dấu vết)', () => {
  const r = lane({ DICH: '_acceptance/feat-ky/evidence/ve-that.json', NOI_DUNG: 'da-ky' });
  assert.equal(r.status, 1, r.stderr);
  assert.equal(readFileSync(VE_THAT, 'utf8'), 'da-ky\n', 'fixture sai: nội dung phải trùng byte');
  assert.match(r.stderr, / {2}- _acceptance\/feat-ky\/evidence\/ve-that\.json \(ghi lại, cùng nội dung\)\n/);
  utimesSync(VE_THAT, QUA_KHU, QUA_KHU);
});

check('CH4 suite THÊM tệp vào hồ sơ máy thông không được ghim → ĐỎ gọi tên tệp «thêm»', () => {
  const r = lane({ DICH: '.acceptance-runs/feat-ky/ve-that.json', SUITE_DICH: '_acceptance/feat-may/evidence/moi.json' });
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /executor chạm hồ sơ đã thông Cổng Bằng chứng — 1 tệp:\n {2}- _acceptance\/feat-may\/evidence\/moi\.json \(thêm\)\n/);
  rmSync(path.join(R, '_acceptance', 'feat-may', 'evidence'), { recursive: true, force: true });
});

check('CH5 sau khi dọn: cùng lệnh xanh của CH1 với --write → exit 0, recheck xanh (răng không để lại trạng thái)', () => {
  const r = lane({ DICH: '.acceptance-runs/feat-ky/ve-that.json' }, '--write');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stderr, /0 tệp bị chạm/);
  assert.match(r.stderr, /recheck-evidence xanh/);
});

console.log(`\nchup-ho-so-da-thong: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
