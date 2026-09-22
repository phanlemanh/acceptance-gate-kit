// ntr-trang-thai.test.mjs — hồ sơ nhan-trang-thai-va-reality, AC-9 (E9): trạng thái thứ bảy
// `da-cham-boi-thuc-te` ở các bộ đọc (lib · bộ quét xưởng · bản đồ sản phẩm) + đường đọc-cũ.
// NS-AC9-cu so bộ quét và bản đồ của bản «SAU vòng» với bản «trước vòng» trên CÂY THẬT của kit.
// Bản trước vòng = `git archive` TRỌN scripts lib skills ở cha của commit đầu đưa chuỗi
// `da-cham-boi-thuc-te` vào lib/workspace-record.cjs. Bản SAU vòng = `verified_commit` mà báo cáo
// của hồ sơ nhan-trang-thai-va-reality mang lúc CHỮ KÝ được ghi (mã chữ ký chứng) — KHÔNG phải HEAD:
// lời hứa của ca là về DELTA của vòng ấy, và mọi vòng sau đổi bộ quét hợp lệ (vd ho-so-khep-thoi-hoi
// cộng khoá vetoOpen[].daKhep) sẽ làm phép so với HEAD đỏ oan. Cả hai sha là đầu ra lệnh.
// Dữ liệu = bản sao cây thật ĐÃ LOẠI hồ sơ khép theo vị từ hoSoDaKhep (không theo danh sách tên):
// bản trước vòng không biết trạng thái thứ bảy, nên hồ sơ thực tế thật đầu tiên (release-2-0-0,
// 22/09) là khác biệt ĐÚNG THIẾT KẾ, không phải hồi quy (hồ sơ ho-so-khep-thoi-hoi AC-7).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-tt-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const want = name => !process.env.NTR_CASES || process.env.NTR_CASES.split(',').includes(name);
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WR = require(path.join(KIT, 'lib', 'workspace-record.cjs'));
const SLUG = 'hs-thuc-te';

const hopDong = st => `---\nschema_version: 1\nslug: ${SLUG}\nfeature: vat da o prod\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${st}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
// Dòng quan sát: đủ đúng các vế lib khai (THUC_TE_VE) — rút danh sách vế từ lib, không gõ tay.
const dongTT = (o = {}) => JSON.stringify({ id: 'd-20260921T100000Z-1', type: 'thuc-te', stage: 'thuc-te',
  ...Object.fromEntries(WR.THUC_TE_VE.map(k => [k, { id: 'd-20260921T100000Z-1', by: 'M', at: '2026-09-21T09:00:00Z', build_sha: 'f'.repeat(40), decision: 'chay tren prod' }[k]])), ...o });
function kho(st) {
  const r = mkdtempSync(path.join(TMP, 'k-'));
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  const d = path.join(r, '_acceptance', SLUG); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n');
  writeFileSync(path.join(d, 'contract.md'), hopDong(st));
  writeFileSync(path.join(d, 'evidence-report.md'), '---\nschema_version: 2\nverdict: BLOCKED\nreason: x\nhuman_signoff:\n---\n');
  writeFileSync(path.join(d, 'decisions.jsonl'), dongTT() + '\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'ho so');
  return r;
}
const quet = (r, kit = KIT) => JSON.parse(spawnSync(process.execPath, [path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout);
const tim = (j, slug) => { const g = j.groups || {}; for (const [ten, arr] of Object.entries(g)) for (const x of arr || []) if (x.slug === slug) return { nhom: ten, x }; for (const x of j.broken || []) if (x.slug === slug) return { nhom: 'broken', x }; return null; };
const oBanDo = (md, slug) => { let h = null; for (const l of md.split('\n')) { const m = l.match(/^## (.+)$/); if (m) h = m[1]; else if (h && l.includes(slug)) return h; } return null; };

if (want('NS-AC9-moi')) {
  try {
    const sai = [];
    const fp = WR.fieldProblem('contract.md', hopDong('da-cham-boi-thuc-te'), 'status');
    if (fp) sai.push(`fieldProblem bao hong: ${fp.reason}`);
    const tt = WR.thucTe(dongTT());
    if (!tt || tt.kieu !== 'dong-so') sai.push(`thucTe: ${JSON.stringify(tt)}`);
    const r = kho('da-cham-boi-thuc-te');
    const h = tim(quet(r), SLUG);
    if (!h || h.nhom !== 'done' || h.x.stateKey !== 'da-cham-thuc-te' || h.x.label !== 'đã chấm bởi thực tế') sai.push(`bo quet: ${JSON.stringify(h)}`);
    const { renderProductMap } = await import(pathToFileURL(path.join(KIT, 'scripts', 'product-map.mjs')).href);
    const o = oBanDo(renderProductMap(r), SLUG);
    if (o === 'Đang làm' || !o) sai.push(`ban do xep o «${o}»`);
    // Đối chứng dương: cùng kho, status approved → bộ quét KHÔNG xếp vào done.
    const r2 = kho('approved'); const h2 = tim(quet(r2), SLUG);
    if (!h2 || h2.nhom === 'done') sai.push(`doi chung approved: ${JSON.stringify(h2)}`);
    if (sai.length) bad('NS-AC9-moi', sai.join(' ; '));
    else ok('NS-AC9-moi', `— status mới + dòng quan sát: lib nhận, bộ quét «đã chấm bởi thực tế» (nhóm xong), bản đồ ô «${o}»; approved thì không`);
  } catch (e) { bad('NS-AC9-moi', loi(e)); }
}

if (want('NS-AC9-cu')) {
  try {
    const shas = git(KIT, 'log', '--format=%H', '--reverse', '-S', 'da-cham-boi-thuc-te', '--', 'lib/workspace-record.cjs').split('\n').filter(Boolean);
    if (!shas.length) throw new Error('khong tim thay commit dua da-cham-boi-thuc-te vao lib/workspace-record.cjs');
    const cu = mkdtempSync(path.join(TMP, 'cu-'));
    execFileSync('tar', ['-x', '-C', cu], { input: execFileSync('git', ['-C', KIT, 'archive', `${shas[0]}^`, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 }) });
    // Bản SAU vòng: verified_commit của báo cáo ở lần đầu tiên chữ ký người được ghi.
    const RPT = '_acceptance/nhan-trang-thai-va-reality/evidence-report.md';
    const kyC = git(KIT, 'log', '--reverse', '--format=%H', '-G', '^human_signoff:[[:space:]]*[^[:space:]]', '--', RPT).split('\n')[0];
    if (!kyC) throw new Error('khong tim thay lan ghi chu ky cua nhan-trang-thai-va-reality');
    const sauSha = (/^verified_commit:[ \t]*([0-9a-f]{40})/m.exec(git(KIT, 'show', `${kyC}:${RPT}`)) || [])[1];
    if (!sauSha) throw new Error(`bao cao o ${kyC.slice(0, 8)} khong mang verified_commit`);
    const sau = mkdtempSync(path.join(TMP, 'sau-'));
    execFileSync('tar', ['-x', '-C', sau], { input: execFileSync('git', ['-C', KIT, 'archive', sauSha, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 }) });
    // Dữ liệu: bản sao cây thật của kit, LOẠI hồ sơ khép theo vị từ — một chỗ cho cả hai bản code.
    const du = mkdtempSync(path.join(TMP, 'du-'));
    cpSync(path.join(KIT, '_acceptance'), path.join(du, '_acceptance'), { recursive: true });
    if (!readFileSync(path.join(du, '_acceptance', 'config.yaml'), 'utf8')) throw new Error('ban sao cay that rong');
    const khep = WR.slugDaKhep(du);
    for (const k of khep) rmSync(path.join(du, '_acceptance', k), { recursive: true, force: true });
    const bo = j => JSON.stringify(j, (k, v) => (k === 'since' || k === 'ageDays' ? undefined : v));
    const a = bo(quet(du, sau)); const b = bo(quet(du, cu));
    const { renderProductMap: rMoi } = await import(pathToFileURL(path.join(sau, 'scripts', 'product-map.mjs')).href);
    const { renderProductMap: rCu } = await import(pathToFileURL(path.join(cu, 'scripts', 'product-map.mjs')).href);
    const soHoSo = (JSON.parse(a).groups ? Object.values(JSON.parse(a).groups).flat().length : 0);
    if (soHoSo < 50) bad('NS-AC9-cu', `doi chung: cay that chi co ${soHoSo} ho so — ban sao hong?`);
    else if (a !== b) bad('NS-AC9-cu', 'bo quet ban sau vong khac ban truoc vong tren cay that');
    else if (rMoi(du) !== rCu(du)) bad('NS-AC9-cu', 'ban do ban sau vong khac ban truoc vong tren cay that');
    else ok('NS-AC9-cu', `— ${soHoSo} hồ sơ thật (loại ${khep.length} khép theo vị từ): bộ quét và bản đồ bản sau vòng (${sauSha.slice(0, 8)}) bằng bản trước vòng (${shas[0].slice(0, 8)}^)`);
  } catch (e) { bad('NS-AC9-cu', loi(e)); }
}

if (want('NS-AC9-sai')) {
  try {
    const fp = WR.fieldProblem('contract.md', hopDong('da-cham-boi-thuc-t'), 'status');
    if (!fp || !fp.reason.includes('status không nhận diện được: da-cham-boi-thuc-t')) bad('NS-AC9-sai', `fieldProblem: ${JSON.stringify(fp)}`);
    else ok('NS-AC9-sai', '— gõ sai giá trị: vẫn hồ sơ hỏng «status không nhận diện được: da-cham-boi-thuc-t»');
  } catch (e) { bad('NS-AC9-sai', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-trang-thai)`);
process.exit(fail ? 1 : 0);
