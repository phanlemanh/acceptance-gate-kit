#!/usr/bin/env node
// Bộ đo hồ sơ design-floor-moc-s3-s4 (FL5): lệnh cuối S3 (autofix + sinh lại + commit), lệnh S4 chỉ đọc (hex thô, độ phủ
// token, chặn theo bậc), răng bộ chấm tổng, vòng mẫu S0→S5 qua pre-merge-check, khối SKILL cuối S3.
// Kho fixture là git thật (nhánh main + nhánh vòng) do mã sinh trong chính lượt chạy; bảng chặn theo bậc rút từ khối
// DF-CHAN-THEO-BAC của chính hợp đồng. Mỗi nhãn chạy chiều xanh trên cây thật rồi đột biến cùng nhãn trên bản sao lệnh —
// đột biến phải làm đúng ca đỏ với đúng thông điệp ghim.
// Dùng: node tests/design-floor/moc-s3-s4.mjs [--chi S3-AUTOFIX,S3-SINH-LAI,S3-VIEC-DO,S4-HEX,S4-TC,S4-BAC,S4-CHI-DOC,GATE,VONG-MAU,SKILL-S3,BAC-FLOOR]
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TMP = mkdtempSync(join(tmpdir(), 'df-moc5-'));
const UI = join(KIT, 'design-floor', 'dist', 'ui.mjs');
const SLUG = 'vd';
const HOP_DONG_FL5 = join(KIT, '_acceptance', 'design-floor-moc-s3-s4', 'contract.md');
const bam = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

// ── fixture ───────────────────────────────────────────────────────────────────────────────────────────
const TOKENS = JSON.stringify({ color: { ink: { $type: 'color', $value: '#111111' } } });
const REG = JSON.stringify({ version: '0.1.0', components: [] });
// Trang có hai lỗi sàn autofix sửa được (thiếu thẻ viewport, id trùng), không có giá trị màu nào.
const TRANG_SAN = '<!doctype html><html><head><title>p</title></head><body><div id="a">x</div><div id="a">y</div></body></html>\n';
const TRANG_TOKEN = '<html><head><style>.a{color:var(--color-ink)}</style></head><body><div class="a">x</div></body></html>\n';
const TRANG_RGB = '<html><head><style>.a{color:rgb(255,0,0)}</style></head><body><div class="a">x</div></body></html>\n';
const TRANG_KHONG_CSS = '<html><body>x</body></html>\n';

let dem = 0;
const W = (R, f, s) => { mkdirSync(path.dirname(join(R, f)), { recursive: true }); writeFileSync(join(R, f), s); };
const gitR = (R, ...a) => execFileSync('git', a, { cwd: R, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// bac: M0–M3 · goc: tệp ở commit gốc (nhánh main) · vong: tệp commit trên nhánh vòng · cfgThem: dòng cấu hình thêm.
function kho({ bac = 'M1', goc = {}, vong = {}, tokensM1 = false, sinhLai = null, cfgThem = '' } = {}) {
  const R = join(TMP, `kho-${++dem}`);
  mkdirSync(R);
  let cfg = cfgThem;
  if (bac !== 'M0') cfg += 'design:\n  surface_globs: ["web/**", "design/**"]\n';
  const dfDong = [];
  if (bac === 'M2' || bac === 'M3' || tokensM1) dfDong.push('  tokens: design/t.json');
  if (bac === 'M2' || bac === 'M3') dfDong.push('  registry: design/r.json');
  if (bac === 'M3') dfDong.push('  niem_phong: "2026-10-28 chu kho"');
  if (sinhLai) dfDong.push(`  sinh_lai: [${sinhLai.map((l) => JSON.stringify(l)).join(', ')}]`);
  if (dfDong.length) cfg += `design_floor:\n${dfDong.join('\n')}\n`;
  W(R, '_acceptance/config.yaml', cfg);
  W(R, `_acceptance/${SLUG}/contract.md`, '---\nfeature: vd\n---\n');
  W(R, 'design/t.json', TOKENS);
  W(R, 'design/r.json', REG);
  W(R, 'README.md', 'kho mẫu\n');
  for (const [f, s] of Object.entries(goc)) W(R, f, s);
  gitR(R, 'init', '-q', '-b', 'main');
  gitR(R, 'config', 'user.email', 't@t');
  gitR(R, 'config', 'user.name', 't');
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'gốc');
  gitR(R, 'checkout', '-q', '-b', 'vong');
  for (const [f, s] of Object.entries(vong)) W(R, f, s);
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'vòng', '--allow-empty');
  return R;
}

// Ảnh chụp băm mọi tệp dưới gốc (gồm .git/) — so hai chiều.
function chup(R) {
  const anh = new Map();
  const di = (d) => {
    for (const t of readdirSync(join(R, d), { withFileTypes: true })) {
      const f = d ? `${d}/${t.name}` : t.name;
      if (t.isDirectory()) di(f);
      else anh.set(f, bam(join(R, f)));
    }
  };
  di('');
  return anh;
}
function soAnh(a, b) {
  for (const [f, h] of a) if (b.get(f) !== h) return b.has(f) ? `đổi ${f}` : `mất ${f}`;
  for (const f of b.keys()) if (!a.has(f)) return `thêm ${f}`;
  return null;
}

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────────────
function chay(kit, ten, args, cwd, env = {}) {
  const r = spawnSync(process.execPath, [join(kit, 'scripts', ten), ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { ec: r.status, out: r.stdout || '', err: r.stderr || '' };
}
const s3 = (kit, R, env) => chay(kit, 'design-floor-s3.mjs', ['--root', R, '--slug', SLUG], R, env);
const s4 = (kit, R, env) => chay(kit, 'design-floor-s4.mjs', ['--root', R], R, env);
const tepCommit = (R) => gitR(R, 'show', '--name-only', '--format=', 'HEAD').split('\n').filter(Boolean).sort();

// Vỏ thay bản gói: ghi argv vào tệp nhật ký, thoát theo VO_MA.
function vo() {
  const d = mkdtempSync(join(TMP, 'vo-'));
  const p = join(d, 'vo.mjs');
  writeFileSync(p, "import { appendFileSync } from 'node:fs';\nappendFileSync(process.env.VO_LOG, JSON.stringify(process.argv.slice(2)) + '\\n');\nprocess.exit(Number(process.env.VO_MA || 0));\n");
  return { p, log: join(d, 'log.jsonl') };
}

// Bản sao kit cho đột biến (khuôn của moc-s0-s1.mjs): mọi thư mục là liên kết, riêng scripts/ là thư mục thật chứa liên
// kết từng tệp; tệp bị đột biến được chép rồi sửa. Chuỗi cũ phải có (không thì đột biến hỏng).
function kitDotBien(tep, ...cap) {
  const K = mkdtempSync(join(TMP, 'kit-'));
  for (const d of ['lib', 'design-floor', 'skills', 'feature-loop', 'commands', 'hooks', 'tests', 'docs', '_acceptance']) if (existsSync(join(KIT, d))) symlinkSync(join(KIT, d), join(K, d));
  for (const f of ['CONTEXT.md', 'package.json']) if (existsSync(join(KIT, f))) symlinkSync(join(KIT, f), join(K, f));
  mkdirSync(join(K, 'scripts'));
  for (const f of readdirSync(join(KIT, 'scripts'))) if (f !== tep) symlinkSync(join(KIT, 'scripts', f), join(K, 'scripts', f));
  let noi = readFileSync(join(KIT, 'scripts', tep), 'utf8');
  for (const [cu, moi] of cap) {
    if (!noi.includes(cu)) throw new Error(`đột biến hỏng: không thấy «${cu.slice(0, 60)}» trong ${tep}`);
    noi = noi.split(cu).join(moi);
  }
  writeFileSync(join(K, 'scripts', tep), noi);
  return K;
}

// ── bảng chặn theo bậc, rút từ hợp đồng ────────────────────────────────────────────────────────────────
const COT = ['hex', 'tc-truot', 'tc-khong-do'];
function bangChan() {
  const md = readFileSync(HOP_DONG_FL5, 'utf8');
  const a = md.indexOf('<!-- <<<DF-CHAN-THEO-BAC -->');
  const b = md.indexOf('<!-- DF-CHAN-THEO-BAC>>> -->');
  if (a < 0 || b < a) throw new Error('hợp đồng thiếu khối DF-CHAN-THEO-BAC');
  const o = [];
  for (const dong of md.slice(a, b).split('\n')) {
    const m = /^\s*\|\s*(M[0-3])\s*\|(.*)\|\s*$/.exec(dong);
    if (!m) continue;
    m[2].split('|').map((s) => s.trim()).forEach((o2, i) => {
      const c = /^thoát (\d+), (?:không dòng|dòng «([^»]+)»)$/.exec(o2);
      if (!c) throw new Error(`ô không đọc được: ${m[1]} × ${COT[i]} «${o2}»`);
      o.push({ bac: m[1], cot: COT[i], ma: Number(c[1]), nhan: c[2] || null });
    });
  }
  return o;
}
function khoO(bac, cot) {
  if (cot === 'hex') return kho({ bac, vong: { 'web/a.css': '.a { color: #fff; }\n' } });
  return kho({ bac, vong: { 'web/p.html': cot === 'tc-truot' ? TRANG_RGB : TRANG_KHONG_CSS } });
}

// ── răng bộ chấm tổng: (skill, lệnh S4, hợp đồng nhập, lộ trình) → null | thông điệp ──────────────────────
function khoiMd(md, ten) {
  const a = md.indexOf(`<!-- <<<${ten} -->`);
  const b = md.indexOf(`<!-- ${ten}>>> -->`);
  return a >= 0 && b > a ? md.slice(a, b) : null;
}
function rangGate({ skill, lenhS4, hopDong, loTrinh }) {
  const khoi = khoiMd(skill, 'DESIGN-FLOOR-S4');
  if (khoi === null) return 'GATE: thiếu khối DESIGN-FLOOR-S4 trong SKILL';
  const hd = JSON.parse(/```json\n([\s\S]*?)\n```/.exec(khoiMd(hopDong, 'DESIGN-FLOOR-HOP-DONG'))[1]);
  const moc = /\bui gate\b/.test(khoi) || /\bui gate\b/.test(lenhS4) || /['"]gate['"]/.test(lenhS4);
  if (!moc) return null;
  if ((loTrinh.chan_troi || []).some((h) => h.ma === 'FL-C1')) return 'móc ui gate vào S4 khi FL-C1 còn chờ';
  if (JSON.stringify(hd.gioi_han || []).includes('DF-07')) return 'móc ui gate vào S4 khi khối máy còn giới hạn DF-07';
  return null;
}
const nguonThat = () => ({
  skill: readFileSync(SKILL, 'utf8'),
  lenhS4: readFileSync(join(KIT, 'scripts', 'design-floor-s4.mjs'), 'utf8'),
  hopDong: readFileSync(join(KIT, 'design-floor', 'HOP-DONG-NHAP.md'), 'utf8'),
  loTrinh: JSON.parse(readFileSync(join(KIT, 'docs', 'plans', 'lo-trinh-kit.json'), 'utf8')),
});
const chenSkill = (n) => ({ ...n, skill: n.skill.replace('<!-- DESIGN-FLOOR-S4>>> -->', 'node ui.mjs ui gate {dich}\n<!-- DESIGN-FLOOR-S4>>> -->') });
const chenLenh = (n) => ({ ...n, lenhS4: n.lenhS4.replace("'token-coverage'", "'gate'") });
const boFlC1 = (n) => ({ ...n, loTrinh: { ...n.loTrinh, chan_troi: n.loTrinh.chan_troi.filter((h) => h.ma !== 'FL-C1') } });
const themDf07 = (n) => ({ ...n, hopDong: n.hopDong.replace('"gioi_han": []', '"gioi_han": [{"id": "DF-07", "ban_va": "A"}]') });

// ── vòng mẫu S0→S5 ──────────────────────────────────────────────────────────────────────────────────
function vongMau(kit) {
  const s4Lenh = `node ${join(kit, 'scripts', 'design-floor-s4.mjs')} --root .`;
  const cfg = ['schema_version: 1', 'enforcement: strict', 'recheck: strict', 'gap_probe: off', 'feature_loop:', '  suite_keys:',
    '    - executors.test.s0', 'executors:', '  test:', '    s0: "true"', '  design:', `    floor: ${JSON.stringify(s4Lenh)}`,
    'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"', ''].join('\n');
  const R = kho({ bac: 'M2', cfgThem: cfg, vong: { 'web/p.html': TRANG_SAN } });
  // Hồ sơ của vòng mẫu: hợp đồng + một eval trỏ executors.design.floor.
  W(R, `_acceptance/${SLUG}/contract.md`, `---\nschema_version: 1\nfeature: ${SLUG}\nslug: ${SLUG}\nrisk_tier: T2\nsurfaces: [ui]\nstatus: implemented\napproved_by: Nguoi Ky\n---\n`);
  W(R, `_acceptance/${SLUG}/evals.yaml`, 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.design.floor\n    expected: >\n      Xanh.\n');
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'hồ sơ');
  const b = chay(kit, 'design-floor-bac.mjs', ['--root', R], R);
  if (!b.out.startsWith('design-floor: bậc M2')) return { R, loi: `S0 ra «${b.out.trim()}»` };
  const env = { DESIGN_FLOOR_KHONG_MANG: '1' };
  const r1 = chay(kit, 'design-floor-s1.mjs', ['--root', R, '--slug', SLUG], R, env);
  if (r1.ec !== 0) return { R, loi: `S1 thoát ${r1.ec}` };
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'S1');
  const r3 = s3(kit, R);
  if (r3.ec !== 0) return { R, loi: `S3 thoát ${r3.ec}: ${r3.err.trim()}` };
  // Trang thứ hai vào sau S3, chưa qua autofix — đích của đột biến «S4 ghi»; tiền điều kiện: autofix trên bản sao đổi băm.
  W(R, 'web/q.html', TRANG_SAN);
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'trang q');
  const ban = join(TMP, `q-${++dem}.html`);
  writeFileSync(ban, TRANG_SAN);
  spawnSync(process.execPath, [UI, 'autofix', ban, '--write', '--json'], { encoding: 'utf8' });
  if (bam(ban) === bam(join(R, 'web/q.html'))) return { R, loi: 'tiền điều kiện hỏng: autofix không đổi trang q' };
  const H = gitR(R, 'rev-parse', 'HEAD');
  W(R, `_acceptance/${SLUG}/run-log.jsonl`, `${JSON.stringify({ ts: '2026-10-28T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H, eval: 'E1', exit_code: 0 })}\n`);
  W(R, `_acceptance/${SLUG}/evidence-report.md`, `---\nschema_version: 1\nfeature_slug: ${SLUG}\nverdict: PASS\nverified_commit: ${H}\nhuman_signoff: Nguoi Ky 2026-10-28\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.design.floor\n  verified_at: 2026-10-28\n\n## Iterations\n\nRound 1 — PASS.\n`);
  gitR(R, 'add', '-A');
  gitR(R, 'commit', '-qm', 'S4 + ký');
  // Làn ghim của kit chạy eval E1 = lệnh S4 thật (hay bản đột biến) và ghi pin; rồi chỉ commit hồ sơ.
  const lan = spawnSync(process.execPath, [join(KIT, 'feature-loop', 'scripts', 'repin-lane.mjs'), '--root', R, '--ag-root', KIT, '--slug', SLUG, '--reason', 'vòng mẫu', '--write'], { encoding: 'utf8' });
  if (lan.status !== 0) return { R, loi: `làn ghim thoát ${lan.status}: ${(lan.stderr || '').trim().split('\n').slice(-2).join(' ')}` };
  gitR(R, 'add', '--', '_acceptance');
  gitR(R, 'commit', '-qm', 'ghim');
  const pm = spawnSync('bash', [join(KIT, 'scripts', 'pre-merge-check.sh'), R, '--base', 'main'], { encoding: 'utf8' });
  return { R, pm: `${pm.stdout || ''}${pm.stderr || ''}`, ec: pm.status };
}

// ── khối SKILL cuối S3 ─────────────────────────────────────────────────────────────────────────────
const SKILL = join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
function boKhoi(p, ten) {
  const md = readFileSync(p, 'utf8');
  const a = md.indexOf(`<!-- <<<${ten} -->`);
  const b = md.indexOf(`<!-- ${ten}>>> -->`) + `<!-- ${ten}>>> -->`.length;
  const q = join(TMP, `skill-${++dem}.md`);
  writeFileSync(q, md.slice(0, a) + md.slice(b));
  return q;
}
function kiemSkillS3(kit, skillPath) {
  const md = readFileSync(skillPath, 'utf8');
  const khoi = khoiMd(md, 'DESIGN-FLOOR-S3');
  if (khoi === null) return 'SKILL-S3: thiếu khối DESIGN-FLOOR-S3';
  const iKhoi = md.indexOf('<!-- <<<DESIGN-FLOOR-S3 -->');
  const iImpl = md.indexOf('set contract `status: implemented`', md.indexOf('## S3 — EXECUTE'));
  if (iImpl < 0 || iKhoi > iImpl || iKhoi < md.indexOf('## S3 — EXECUTE')) return 'SKILL-S3: khối không đứng trước dòng sang implemented của S3';
  const m = /```\n([\s\S]*?)\n```/.exec(khoi);
  if (!m || !m[1].includes('scripts/design-floor-s3.mjs')) return 'SKILL-S3: khối không gọi scripts/design-floor-s3.mjs';
  const lenh = m[1].trim()
    .replace('"$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs"', JSON.stringify(join(kit, 'feature-loop', 'scripts', 'resolve-plugin.mjs')))
    .replace('--plugin acceptance-gate', `--plugin acceptance-gate --root ${JSON.stringify(kit)}`)
    .replace("'<slug>'", SLUG);
  const A = kho({ bac: 'M2', vong: { 'web/p.html': TRANG_SAN } });
  const B = kho({ bac: 'M2', vong: { 'web/p.html': TRANG_SAN } });
  const quaKhoi = spawnSync('bash', ['-c', lenh], { cwd: A, encoding: 'utf8' });
  const truc = spawnSync(process.execPath, [join(kit, 'scripts', 'design-floor-s3.mjs'), '--root', '.', '--slug', SLUG], { cwd: B, encoding: 'utf8' });
  const chuan = (s) => (s || '').replace(/commit [0-9a-f]{7,}/g, 'commit <sha>');
  if (quaKhoi.status !== truc.status) return `SKILL-S3: qua khối thoát ${quaKhoi.status}, gọi trực tiếp thoát ${truc.status}: ${(quaKhoi.stderr || '').trim().split('\n')[0]}`;
  if (!quaKhoi.stdout.trim() || chuan(quaKhoi.stdout) !== chuan(truc.stdout)) return `SKILL-S3: đầu ra qua khối «${quaKhoi.stdout.trim()}» ≠ gọi trực tiếp «${truc.stdout.trim()}»`;
  if (JSON.stringify(tepCommit(A)) !== JSON.stringify(tepCommit(B))) return `SKILL-S3: commit qua khối ${tepCommit(A)} ≠ trực tiếp ${tepCommit(B)}`;
  return null;
}

// ── ca: (kit[, thêm]) → null khi đạt, chuỗi thông điệp khi đỏ ────────────────────────────────────────
const CA = {
  'S3-AUTOFIX': (kit) => {
    const R = kho({ vong: { 'web/p.html': TRANG_SAN, 'web/c.tsx': 'export const C = 1;\n' } });
    const truoc = chup(R);
    const H0 = gitR(R, 'rev-parse', 'HEAD');
    const r = s3(kit, R);
    if (r.ec !== 0) return `S3-AUTOFIX: thoát ${r.ec}: ${r.err.trim()}`;
    const p = readFileSync(join(R, 'web/p.html'), 'utf8');
    if (bam(join(R, 'web/p.html')) === truoc.get('web/p.html')) return 'S3-AUTOFIX: trang không đổi';
    if (!/name="viewport"/.test(p)) return 'S3-AUTOFIX: trang đổi mà thiếu thẻ viewport autofix lẽ ra thêm';
    if (gitR(R, 'rev-parse', 'HEAD~1') !== H0) return 'S3-AUTOFIX: không đúng một commit mới';
    if (JSON.stringify(tepCommit(R)) !== '["web/p.html"]') return `S3-AUTOFIX: commit S3 mang ${tepCommit(R).join(', ')}, mong web/p.html`;
    for (const [f, h] of truoc) if (!f.startsWith('.git/') && f !== 'web/p.html' && bam(join(R, f)) !== h) return `S3-AUTOFIX: ${f} đổi băm`;
    return null;
  },
  'S3-M0': (kit) => {
    const R = kho({ bac: 'M0', vong: { 'web/p.html': TRANG_SAN } });
    const truoc = chup(R);
    const r = s3(kit, R);
    if (r.ec !== 0 || r.out !== '') return `S3-M0: thoát ${r.ec}, in «${r.out.trim()}», mong im lặng thoát 0`;
    const lech = soAnh(truoc, chup(R));
    return lech ? `S3-M0: ${lech}` : null;
  },
  'S3-SINH-LAI': (kit) => {
    const gen = (n) => `import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';\nmkdirSync('gen', { recursive: true });\nconst sau = readFileSync('web/p.html', 'utf8').includes('name="viewport"') ? ' sau-autofix' : ' truoc-autofix';\nappendFileSync('gen/thu-tu.txt', '${n}' + sau + '\\n');\n`;
    const R = kho({ goc: { 'tools/g1.mjs': gen(1), 'tools/g2.mjs': gen(2) }, sinhLai: ['node tools/g1.mjs', 'node tools/g2.mjs'], vong: { 'web/p.html': TRANG_SAN } });
    const r = s3(kit, R);
    if (r.ec !== 0) return `S3-SINH-LAI: thoát ${r.ec}: ${r.err.trim()}`;
    if (!tepCommit(R).includes('gen/thu-tu.txt')) return 'S3-SINH-LAI: thiếu tệp sinh lại trong commit';
    const tt = readFileSync(join(R, 'gen/thu-tu.txt'), 'utf8');
    if (tt !== '1 sau-autofix\n2 sau-autofix\n') return `S3-SINH-LAI: thứ tự «${tt.trim()}», mong «1 sau-autofix / 2 sau-autofix»`;
    if (JSON.stringify(tepCommit(R)) !== '["gen/thu-tu.txt","web/p.html"]') return `S3-SINH-LAI: commit mang ${tepCommit(R).join(', ')}`;
    return null;
  },
  'S3-SINH-LAI-HONG': (kit) => {
    const R = kho({ sinhLai: ['true', 'node -e "process.exit(7)"'], vong: { 'web/p.html': TRANG_SAN } });
    const H0 = gitR(R, 'rev-parse', 'HEAD');
    const r = s3(kit, R);
    if (r.ec !== 1) return `S3-SINH-LAI-HONG: thoát ${r.ec}, mong 1`;
    if (!r.err.includes('lệnh sinh lại thoát 7 — node -e "process.exit(7)"')) return `S3-SINH-LAI-HONG: stderr không gọi tên lệnh: «${r.err.trim()}»`;
    return gitR(R, 'rev-parse', 'HEAD') === H0 ? null : 'S3-SINH-LAI-HONG: có commit dù lệnh sinh lại hỏng';
  },
  'S3-SINH-LAI-VANG': (kit) => {
    const r = s3(kit, kho({ vong: { 'web/p.html': TRANG_SAN } }));
    return r.ec === 0 && r.out.includes('chưa khai lệnh sinh lại') ? null : `S3-SINH-LAI-VANG: thoát ${r.ec}, in «${r.out.trim()}»`;
  },
  'S3-VIEC-DO': (kit) => {
    const R = kho({ vong: { 'web/p.html': TRANG_SAN, 'web/c.tsx': 'export const C = 1;\n' } });
    W(R, 'web/c.tsx', 'export const C = 2; // việc dở\n');
    W(R, 'ghi-chu.txt', 'chưa theo dõi\n');
    const hC = bam(join(R, 'web/c.tsx'));
    const hG = bam(join(R, 'ghi-chu.txt'));
    const r = s3(kit, R);
    if (r.ec !== 0) return `S3-VIEC-DO: thoát ${r.ec}: ${r.err.trim()}`;
    const lan = tepCommit(R).filter((f) => f !== 'web/p.html');
    if (lan.length) return `S3-VIEC-DO: commit S3 chứa việc dở ${lan.join(', ')}`;
    if (!tepCommit(R).includes('web/p.html')) return 'S3-VIEC-DO: trang đích không được autofix';
    if (bam(join(R, 'web/c.tsx')) !== hC || bam(join(R, 'ghi-chu.txt')) !== hG) return 'S3-VIEC-DO: việc dở đổi băm';
    return null;
  },
  'S3-DICH-BAN': (kit) => {
    const R = kho({ goc: { 'tools/g1.mjs': "import { appendFileSync } from 'node:fs';\nappendFileSync('sinh.log', 'chạy\\n');\n" }, sinhLai: ['node tools/g1.mjs'], vong: { 'web/p.html': TRANG_SAN } });
    W(R, 'web/p.html', `${TRANG_SAN}<!-- người đang sửa -->\n`);
    const hP = bam(join(R, 'web/p.html'));
    const H0 = gitR(R, 'rev-parse', 'HEAD');
    const r = s3(kit, R);
    if (r.ec !== 2 && bam(join(R, 'web/p.html')) !== hP) return 'S3-DICH-BAN: lệnh ghi đè đích bẩn';
    if (r.ec !== 2) return `S3-DICH-BAN: thoát ${r.ec}, mong 2`;
    if (!r.err.includes('web/p.html')) return `S3-DICH-BAN: stderr không gọi tên tệp: «${r.err.trim()}»`;
    if (bam(join(R, 'web/p.html')) !== hP) return 'S3-DICH-BAN: lệnh ghi đè đích bẩn';
    if (existsSync(join(R, 'sinh.log'))) return 'S3-DICH-BAN: lệnh sinh lại vẫn chạy';
    return gitR(R, 'rev-parse', 'HEAD') === H0 ? null : 'S3-DICH-BAN: có commit';
  },
  'S4-HEX': (kit, them = {}) => {
    const duong = ['.a { color: #fff; }', '.b { color: #FFFF; }', '.c { color: #1a2b3c; }', '.d { color: #1a2b3c80; }'];
    const am = ['.e { color: #12345; }', '.f { color: #1234567; }', '.g::before { content: "&#039;"; }', '.h { x: #fffg; }'];
    const mau = (coDuong) => kho({
      tokensM1: true,
      goc: { 'khac/x.css': '.z { color: #abc; }\n' },
      vong: { 'web/a.css': `${[...(coDuong ? duong : []), ...am].join('\n')}\n`, 'web/tok.css': '.t { color: var(--color-ink); }\n', 'design/t.json': `${TOKENS}\n`, 'khac/x.css': '.z { color: #abc; }\n.y { color: #def; }\n' },
    });
    const r = s4(kit, mau(true));
    const mong = new Set(duong.map((d, i) => `design-floor S4: hex thô web/a.css:${i + 1} ${/#[0-9a-fA-F]+/.exec(d)[0]}`));
    const co = new Set(r.out.split('\n').filter(Boolean));
    const thua = [...co].filter((d) => !mong.has(d));
    if (thua.some((d) => d.includes('design/t.json'))) return 'S4-HEX: dòng thừa ở tệp token';
    if (thua.length) return `S4-HEX: dòng thừa ${thua.join(' | ')}`;
    const thieu = [...mong].filter((d) => !co.has(d));
    if (thieu.length) return `S4-HEX: thiếu dòng ${thieu.join(' | ')}`;
    if (r.ec !== 2) return `S4-HEX: thoát ${r.ec}, mong 2`;
    const doiChung = s4(kit, mau(false));
    return doiChung.ec === 0 && doiChung.out === '' ? null : `S4-HEX: đối chứng không hex thoát ${doiChung.ec}, in «${doiChung.out.trim()}»`;
  },
  'S4-TC': (kit) => {
    const v = vo();
    const mong = { 0: ['đạt', 0], 2: ['độ phủ token trượt', 2], 3: ['không đo được ở đây (mã 3)', 0], 4: ['không đo được ở đây (mã 4)', 0], 5: ['không đo được ở đây (mã 5)', 0], 1: ['lệnh ui lỗi (mã 1)', 1] };
    for (const [ma, [nhan, thoat]] of Object.entries(mong)) {
      const R = kho({ bac: 'M3', vong: { 'web/p.html': TRANG_TOKEN } });
      const r = s4(kit, R, { DESIGN_FLOOR_UI: v.p, VO_LOG: v.log, VO_MA: ma });
      if (!r.out.includes(nhan) || r.ec !== thoat) return `S4-TC: mã ${ma} → thoát ${r.ec}, in «${r.out.trim()}», mong «${nhan}» thoát ${thoat}`;
      const argv = JSON.parse(readFileSync(v.log, 'utf8').trim().split('\n').pop());
      const i = argv.indexOf('--tokens');
      if (argv[0] !== 'token-coverage' || i < 0 || argv[i + 1] !== join(R, 'design/t.json')) return `S4-TC: argv «${argv.join(' ')}» không mang --tokens từ khai báo kho`;
    }
    return null;
  },
  'S4-TC-THAT': (kit) => {
    for (const [trang, nhan, thoat] of [[TRANG_TOKEN, 'độ phủ token đạt', 0], [TRANG_RGB, 'độ phủ token trượt', 2], [TRANG_KHONG_CSS, 'không đo được ở đây (mã 5)', 0]]) {
      const R = kho({ bac: 'M3', vong: { 'web/p.html': trang } });
      const truc = spawnSync(process.execPath, [UI, 'token-coverage', join(R, 'web/p.html'), '--tokens', join(R, 'design/t.json'), '--json'], { encoding: 'utf8' }).status;
      const r = s4(kit, R);
      if (!r.out.includes(nhan) || r.ec !== thoat) return `S4-TC-THAT: bản gói trả ${truc}, lệnh S4 thoát ${r.ec} in «${r.out.trim()}», mong «${nhan}»`;
    }
    return null;
  },
  'S4-TC-M1': (kit) => {
    const v = vo();
    const r = s4(kit, kho({ bac: 'M1', vong: { 'web/p.html': TRANG_RGB } }), { DESIGN_FLOOR_UI: v.p, VO_LOG: v.log });
    if (existsSync(v.log)) return `S4-TC-M1: lệnh ui được gọi ở M1: ${readFileSync(v.log, 'utf8').trim()}`;
    return r.ec === 0 ? null : `S4-TC-M1: thoát ${r.ec}`;
  },
  'S4-BAC': (kit) => {
    const bang = bangChan();
    for (const b of ['M0', 'M1', 'M2', 'M3']) if (!bang.some((o) => o.bac === b)) return `S4-BAC: bảng thiếu bậc ${b}`;
    const loi = [];
    for (const o of bang) {
      const r = s4(kit, khoO(o.bac, o.cot));
      if (r.ec !== o.ma) loi.push(`S4-BAC ${o.bac} ${o.cot}: thoát ${r.ec}, mong ${o.ma}`);
      else if (o.nhan ? !r.out.includes(o.nhan) : r.out !== '') loi.push(`S4-BAC ${o.bac} ${o.cot}: in «${r.out.trim()}», mong ${o.nhan ? `«${o.nhan}»` : 'không dòng'}`);
      else if (kit === KIT) console.log(`PASS: S4-BAC ${o.bac} ${o.cot}`);
    }
    return loi.length ? loi.join(' · ') : null;
  },
  'S4-CHI-DOC': (kit) => {
    const R = kho({ bac: 'M3', vong: { 'web/a.css': '.a { color: #fff; }\n', 'web/p.html': TRANG_SAN } });
    W(R, `_acceptance/${SLUG}/ghi-chu.md`, 'chưa theo dõi\n');
    const ban = join(TMP, `p-${++dem}.html`);
    writeFileSync(ban, TRANG_SAN);
    spawnSync(process.execPath, [UI, 'autofix', ban, '--write', '--json'], { encoding: 'utf8' });
    if (bam(ban) === bam(join(R, 'web/p.html'))) return 'S4-CHI-DOC: tiền điều kiện hỏng — autofix không đổi trang mẫu';
    const truoc = chup(R);
    s4(kit, R);
    const lech = soAnh(truoc, chup(R));
    return lech ? `S4-CHI-DOC: ${lech.replace(/^đổi /, 'đổi ')}` : null;
  },
  'GATE-DF07': () => rangGate(nguonThat()),
  'GATE-FLC1': () => {
    for (const [ten, chen] of [['khối SKILL', chenSkill], ['lệnh S4', chenLenh]]) {
      const r = rangGate(chen(nguonThat()));
      if (r !== 'móc ui gate vào S4 khi FL-C1 còn chờ') return `GATE-FLC1: chèn vào ${ten} cho ${r ? `«${r}»` : 'XANH'}`;
    }
    return null;
  },
  'GATE-DF07-GIOI-HAN': () => {
    const r = rangGate(chenSkill(themDf07(boFlC1(nguonThat()))));
    return r === 'móc ui gate vào S4 khi khối máy còn giới hạn DF-07' ? null : `GATE-DF07-GIOI-HAN: được ${r ? `«${r}»` : 'XANH'}`;
  },
  'GATE-MO': () => {
    const n = boFlC1(nguonThat());
    if (!n.hopDong.includes('"gioi_han": []')) return 'GATE-MO: khối máy thật không còn gioi_han rỗng — sửa ca';
    const r = rangGate(chenSkill(n));
    return r === null ? null : `GATE-MO: FL-C1 đã rời và không DF-07 mà vẫn đỏ «${r}»`;
  },
  'VONG-MAU': (kit) => {
    const v = vongMau(kit);
    if (v.loi) return `VONG-MAU: ${v.loi}`;
    if (v.ec !== 0 || /VIOLATION/.test(v.pm)) return `VONG-MAU: pre-merge thoát ${v.ec}: ${v.pm.split('\n').filter((l) => /VIOLATION|violation/.test(l)).join(' | ').slice(0, 400)}`;
    if (!/pre-merge-check: clean/.test(v.pm)) return `VONG-MAU: pre-merge không in clean: ${v.pm.trim().split('\n').slice(-2).join(' | ')}`;
    if (!/OK \[vd\]: PASS, signed off/.test(v.pm)) return `VONG-MAU: pre-merge không chạy tới hồ sơ vd: ${v.pm.trim().split('\n').slice(0, 3).join(' | ')}`;
    return null;
  },
  'SKILL-S3': (kit, them = {}) => kiemSkillS3(kit, them.skill || SKILL),
  'BAC-FLOOR': (kit) => {
    const dong = 'design-floor: S4 chưa chấm tuân thủ design system — chưa khai executors.design.floor';
    const chua = chay(kit, 'design-floor-bac.mjs', ['--root', kho({ bac: 'M1' })], TMP);
    const da = chay(kit, 'design-floor-bac.mjs', ['--root', kho({ bac: 'M1', cfgThem: 'executors:\n  design:\n    floor: "node s4.mjs --root ."\n' })], TMP);
    if (chua.err.split('\n').filter((l) => l === dong).length !== 1) return `BAC-FLOOR: kho chưa nối in stderr «${chua.err.trim()}»`;
    if (chua.out.trim().split('\n').length !== 1) return `BAC-FLOOR: stdout không còn đúng một dòng bậc: «${chua.out.trim()}»`;
    return da.err.includes(dong) ? 'BAC-FLOOR: kho đã nối vẫn in dòng chưa khai' : null;
  },
};

// Vòng mẫu với bản đột biến: pre-merge phải báo hồ sơ cũ gọi tên trang bị ghi.
function vongMauDot(kit) {
  const v = vongMau(kit);
  if (v.loi) return `VONG-MAU-DOT: ${v.loi}`;
  return /evidence is stale/.test(v.pm) && /web\/q\.html/.test(v.pm) ? 'VONG-MAU: pre-merge báo stale web/q.html' : null;
}

// ── nhãn: chiều xanh + đột biến ─────────────────────────────────────────────────────────────────────
const S4_GHI = ["  if (bac.bac === 'M2' || bac.bac === 'M3') {\n    const hd = khoiMay(", "  { const hx = khoiMay(HOP_DONG, 'DESIGN-FLOOR-HOP-DONG'); for (const f of dich.filter(LA_HTML)) goiUi(hx, 'autofix', { dich: path.join(root, f) }, root, 'argv_ghi'); }\n  if (bac.bac === 'M2' || bac.bac === 'M3') {\n    const hd = khoiMay("];
const NHAN = {
  'S3-AUTOFIX': { xanh: ['S3-AUTOFIX', 'S3-M0'], dot: [['S3-AUTOFIX-DOT', () => kitDotBien('design-floor-s3.mjs', ["const ma = goiUi(hd, 'autofix', { dich: p }, root, 'argv_ghi');", 'const ma = 0;']), 'S3-AUTOFIX', 'S3-AUTOFIX: trang không đổi']] },
  'S3-SINH-LAI': { xanh: ['S3-SINH-LAI', 'S3-SINH-LAI-HONG', 'S3-SINH-LAI-VANG'], dot: [['S3-SINH-LAI-DOT', () => kitDotBien('design-floor-s3.mjs', ['for (const l of lenh) {', 'for (const l of []) {']), 'S3-SINH-LAI', 'S3-SINH-LAI: thiếu tệp sinh lại trong commit']] },
  'S3-VIEC-DO': {
    xanh: ['S3-VIEC-DO', 'S3-DICH-BAN'],
    dot: [
      ['S3-VIEC-DO-DOT', () => kitDotBien('design-floor-s3.mjs', ['(!truoc.has(f) || truoc.get(f) !== b)', 'true']), 'S3-VIEC-DO', 'S3-VIEC-DO: commit S3 chứa việc dở'],
      ['S3-DICH-BAN-DOT', () => kitDotBien('design-floor-s3.mjs', ['if (ban.length) {', 'if (false) {']), 'S3-DICH-BAN', 'S3-DICH-BAN: lệnh ghi đè đích bẩn'],
    ],
  },
  'S4-HEX': { xanh: ['S4-HEX'], dot: [['S4-HEX-DOT', () => kitDotBien('design-floor-s4.mjs', ['if (tokens && path.normalize(f) === tokens) continue;', '']), 'S4-HEX', 'S4-HEX: dòng thừa ở tệp token']] },
  'S4-TC': { xanh: ['S4-TC', 'S4-TC-THAT', 'S4-TC-M1'], dot: [['S4-TC-DOT', () => kitDotBien('design-floor-s4.mjs', ['else if (ma === 3 || ma === 4 || ma === 5)', 'else if (ma === 3 || ma === 4 || ma === 5 || ma === 1)']), 'S4-TC', 'S4-TC: mã 1 → thoát 0']] },
  'S4-BAC': { xanh: ['S4-BAC'], dot: [['S4-BAC-DOT', () => kitDotBien('design-floor-s4.mjs', ["else if (ma === 2 && bac.bac === 'M3') {", 'else if (ma === 2) {']), 'S4-BAC', 'S4-BAC M2 tc-truot: thoát 2, mong 0']] },
  'S4-CHI-DOC': { xanh: ['S4-CHI-DOC'], dot: [['S4-CHI-DOC-DOT', () => kitDotBien('design-floor-s4.mjs', S4_GHI), 'S4-CHI-DOC', 'S4-CHI-DOC: đổi web/p.html']] },
  GATE: { xanh: ['GATE-DF07', 'GATE-FLC1', 'GATE-DF07-GIOI-HAN', 'GATE-MO'], dot: [] },
  'VONG-MAU': { xanh: ['VONG-MAU'], dot: [['VONG-MAU-DOT', () => ({ vongDot: kitDotBien('design-floor-s4.mjs', S4_GHI) }), 'VONG-MAU', 'VONG-MAU: pre-merge báo stale web/q.html']] },
  'SKILL-S3': { xanh: ['SKILL-S3'], dot: [['SKILL-S3-DOT', () => ({ skill: boKhoi(SKILL, 'DESIGN-FLOOR-S3') }), 'SKILL-S3', 'SKILL-S3: thiếu khối DESIGN-FLOOR-S3']] },
  'BAC-FLOOR': { xanh: ['BAC-FLOOR'], dot: [['BAC-FLOOR-DOT', () => kitDotBien('design-floor-bac.mjs', ['if (!r.floor) process.stderr.write(', 'if (false) process.stderr.write(']), 'BAC-FLOOR', 'BAC-FLOOR: kho chưa nối in stderr']] },
};

function chayCa(id, kit = KIT, them = {}) {
  try {
    if (them.vongDot) return vongMauDot(them.vongDot);
    return CA[id](kit, them);
  } catch (e) {
    return `${id}: ca hỏng — ${String(e.message).split('\n')[0]}`;
  }
}

const argv = process.argv.slice(2);
const iChi = argv.indexOf('--chi');
const chi = iChi >= 0 ? argv[iChi + 1].split(',') : Object.keys(NHAN);
let hong = 0;
for (const nhan of chi) {
  const n = NHAN[nhan];
  if (!n) { console.log(`FAIL: nhãn lạ ${nhan}`); hong++; continue; }
  for (const id of n.xanh) {
    const loi = chayCa(id);
    if (loi) { console.log(`FAIL: ${loi}`); hong++; } else console.log(`PASS: ${id}`);
  }
  for (const [ten, dung, ca, ghim] of n.dot) {
    let loi;
    try {
      const d = dung();
      loi = typeof d === 'string' ? chayCa(ca, d) : chayCa(ca, KIT, d);
    } catch (e) {
      loi = `đột biến không dựng được — ${e.message}`;
    }
    if (loi && loi.startsWith(ghim)) console.log(`PASS: ${ten} — đỏ đúng «${loi}»`);
    else { console.log(`FAIL: ${ten} — mong ca ${ca} đỏ «${ghim}…», được ${loi ? `«${loi}»` : 'XANH'}`); hong++; }
  }
}
rmSync(TMP, { recursive: true, force: true });
console.log(hong ? `moc-s3-s4: ĐỎ ${hong}` : 'moc-s3-s4: XANH');
process.exit(hong ? 1 : 0);
