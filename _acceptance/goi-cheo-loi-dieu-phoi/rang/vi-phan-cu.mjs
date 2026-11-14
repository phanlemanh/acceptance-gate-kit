#!/usr/bin/env node
// vi-phan-cu.mjs — vi phân bố cục cũ của hồ sơ goi-cheo-loi-dieu-phoi (E1, AC-1). Chạy cùng ma trận lệnh × kho trên bản
// gốc 593e6837 và trên cây đang kiểm (cả hai ở bố cục hôm nay: lõi = gốc cây, có dieu-phoi/ và marketplace.json); đòi
// stdout, stderr, mã thoát bằng nhau từng byte sau khi thay đường gốc cây/kho/thư mục tạm. KHÔNG có bảng khác biệt.
//
// Mỗi kho tiêu thụ chép lớp CI (khối INIT-CI-COPY-LIST) của ĐÚNG bản đang chạy. Có một biến thể «chợ fork»: bản sao cây
// mang marketplace.json đổi tên chợ thành `my-fork` (cả hai cây), kho bật `road-map@my-fork`.
// VP-DO tự phá phép so; VP-HT phá scripts/hop-thu/cua-tin-hieu.mjs trên bản sao cây rồi chạy ca cửa tín hiệu có sẵn.
//   node vi-phan-cu.mjs [--bo-ht]      0 xanh · 1 đỏ · 3 hạ tầng       (--bo-ht: bỏ VP-HT, chạy nhanh khi soạn)
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layCay } from './luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
const GOC_SHA = '593e6837';
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'goi-cheo-vp-')));
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude', 'plugins', 'cache'), { recursive: true });
const ENV = { ...process.env, HOME, GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
let seq = 0;
const tam = ten => { const d = path.join(TMP, `${ten}-${++seq}`); mkdirSync(d, { recursive: true }); return d; };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV });
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', env: ENV, maxBuffer: 1 << 26, ...o });
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} ${m}`); };

// ── cây (bố cục cũ) ─────────────────────────────────────────────────────────────────────────────────────────────────
function cay(ref, fork) {
  const d = tam(ref ? 'goc' : 'dang-kiem');
  layCay(KIT, d, ref);
  if (fork) {
    const p = path.join(d, '.claude-plugin', 'marketplace.json');
    writeFileSync(p, readFileSync(p, 'utf8').replace(/"name": "acceptance-gate-kit"/, '"name": "my-fork"'));
  }
  return d;
}
const tenCho = c => JSON.parse(readFileSync(path.join(c, '.claude-plugin', 'marketplace.json'), 'utf8')).name;
function chepCI(c, k) {
  const t = readFileSync(path.join(c, 'commands', 'acceptance-init.md'), 'utf8');
  const m = t.match(/<!-- <<<INIT-CI-COPY-LIST -->([\s\S]*?)<!-- INIT-CI-COPY-LIST>>> -->/);
  for (const x of m[1].matchAll(/`\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)` → `([^`]+)`/g)) {
    const d = path.join(k, x[2], path.basename(x[1])); mkdirSync(path.dirname(d), { recursive: true }); cpSync(path.join(c, x[1]), d);
  }
}
// Kinds: thuong · cua (tin_hieu) · lt-bat (lo_trinh + chan, bật gói) · lt-tat (lo_trinh, không bật) · kit (kho kit cũ).
async function kho(c, kind) {
  const r = tam(`kho-${kind}`);
  git(r, 'init', '-q', '-b', 'main');
  if (kind === 'kit') {
    for (const rel of ['.claude-plugin/marketplace.json', '.claude-plugin/plugin.json']) { mkdirSync(path.dirname(path.join(r, rel)), { recursive: true }); cpSync(path.join(c, rel), path.join(r, rel)); }
    mkdirSync(path.join(r, '_acceptance'), { recursive: true }); writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    git(r, 'add', '-A'); git(r, 'commit', '-qm', 'cắt số');
    mkdirSync(path.join(r, '_acceptance', 'vong-a'), { recursive: true });
    writeFileSync(path.join(r, '_acceptance', 'vong-a', 'contract.md'), '---\nschema_version: 1\nfeature: vòng a\nslug: vong-a\nrisk_tier: T2\nstatus: draft\napproved_by:\n---\n\n# vong-a\n');
    git(r, 'add', '-A'); git(r, 'commit', '-qm', 'vòng a');
    return { r };
  }
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const cfg = ['schema_version: 1'];
  if (kind === 'cua') cfg.push('tin_hieu:', '  nguon: [tin-hieu/kho]', '  gom: tin-hieu/gom');
  if (kind.startsWith('lt')) cfg.push('lo_trinh:', '  tep: docs/plan/lo-trinh.json', '  chan: true');
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), cfg.join('\n') + '\n');
  if (kind === 'cua') for (const d of ['tin-hieu/kho', 'tin-hieu/gom']) { mkdirSync(path.join(r, d), { recursive: true }); writeFileSync(path.join(r, d, '.gitkeep'), ''); }
  if (kind === 'lt-bat') { mkdirSync(path.join(r, '.claude'), { recursive: true }); writeFileSync(path.join(r, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [`road-map@${tenCho(c)}`]: true } }, null, 2) + '\n'); }
  chepCI(c, r);
  if (kind.startsWith('lt')) {
    const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
    mkdirSync(path.join(r, 'docs', 'plan'), { recursive: true });
    LT.ghiLoTrinh(path.join(r, 'docs', 'plan', 'lo-trinh.json'), { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [{ ma: 'A1', cau_giao: 'Việc một' }], chan_troi: [], da_bac: [] });
  }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thử');
  const base = git(r, 'rev-parse', 'HEAD').trim();
  if (kind.startsWith('lt')) {
    mkdirSync(path.join(r, '_acceptance', 'moi'), { recursive: true });
    writeFileSync(path.join(r, '_acceptance', 'moi', 'contract.md'), '---\nschema_version: 1\nslug: moi\nstatus: draft\napproved_by:\n---\n\n# moi\n');
    git(r, 'add', '-A'); git(r, 'commit', '-qm', 'hồ sơ mới');
  }
  return { r, base };
}

// ── ma trận viết sẵn: [id, nhãn lệnh, kho, fork, đối số (c = gốc cây, k = kho)] ────────────────────────────────────────
const MA_TRAN = [
  ['VP-1', 'plugin-declare --list', 'thuong', false, (c, k) => [path.join(c, 'scripts/plugin-declare.mjs'), '--root', k.r, '--list']],
  ['VP-2', 'plugin-declare khai thử', 'thuong', false, (c, k) => [path.join(c, 'scripts/plugin-declare.mjs'), '--root', k.r]],
  ['VP-3', 'plugin-declare --list', 'thuong', true, (c, k) => [path.join(c, 'scripts/plugin-declare.mjs'), '--root', k.r, '--list']],
  ['VP-4', 'khởi tạo lộ trình', 'lt-bat', false, (c, k) => [path.join(c, 'scripts/lo-trinh-khoi-tao.mjs'), '--root', k.r]],
  ['VP-5', 'khởi tạo lộ trình', 'lt-tat', false, (c, k) => [path.join(c, 'scripts/lo-trinh-khoi-tao.mjs'), '--root', k.r]],
  ['VP-6', 'khởi tạo lộ trình', 'lt-bat', true, (c, k) => [path.join(c, 'scripts/lo-trinh-khoi-tao.mjs'), '--root', k.r]],
  ['VP-7', 'luật chặn --base', 'lt-bat', false, (c, k) => [path.join(c, 'lib/chan-lo-trinh.cjs'), '--root', k.r, '--base', k.base]],
  ['VP-8', 'luật chặn --base', 'lt-tat', false, (c, k) => [path.join(c, 'lib/chan-lo-trinh.cjs'), '--root', k.r, '--base', k.base]],
  ['VP-9', 'luật chặn --base', 'lt-bat', true, (c, k) => [path.join(c, 'lib/chan-lo-trinh.cjs'), '--root', k.r, '--base', k.base]],
  ['VP-10', 'luật chặn --khong-base', 'lt-bat', false, (c, k) => [path.join(c, 'lib/chan-lo-trinh.cjs'), '--root', k.r, '--khong-base']],
  ['VP-11', 'tin-hieu --rang', 'cua', false, (c, k) => [path.join(c, 'scripts/tin-hieu.mjs'), '--root', k.r, '--rang']],
  ['VP-12', 'tin-hieu --rang', 'thuong', false, (c, k) => [path.join(c, 'scripts/tin-hieu.mjs'), '--root', k.r, '--rang']],
  ['VP-13', 'gui-tin-hieu', 'cua', false, (c, k) => [path.join(c, 'scripts/gui-tin-hieu.mjs'), '--root', k.r, '--noi-dung', 'câu thử vi phân']],
  ['VP-14', 'gui-tin-hieu', 'thuong', false, (c, k) => [path.join(c, 'scripts/gui-tin-hieu.mjs'), '--root', k.r, '--noi-dung', 'câu thử vi phân']],
  ['VP-15', 'start-scan', 'kit', false, (c, k) => [path.join(c, 'scripts/start-scan.mjs'), '--root', k.r]],
  ['VP-16', 'start-scan', 'cua', false, (c, k) => [path.join(c, 'scripts/start-scan.mjs'), '--root', k.r]],
];
const chuan = (s, c, k) => String(s).split(c).join('<CAY>').split(k).join('<KHO>').split(TMP).join('<TMP>')
  .replace(/\b[0-9a-f]{40}\b/g, '<SHA>').replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g, '<LUC>');
async function chayMot(c, [, , kind, , doiSo]) {
  const k = await kho(c, kind);
  const r = node(doiSo(c, k), { cwd: k.r });
  return { status: r.status, stdout: chuan(r.stdout, c, k.r), stderr: chuan(r.stderr, c, k.r) };
}
const khac = (a, b) => {
  for (const f of ['status', 'stdout', 'stderr']) if (String(a[f]) !== String(b[f])) {
    const la = String(a[f]).split('\n'); const lb = String(b[f]).split('\n'); const i = la.findIndex((l, j) => l !== lb[j]);
    return `${f}: «${(la[i] ?? '').slice(0, 160)}» ≠ «${(lb[i] ?? '').slice(0, 160)}»`;
  }
  return null;
};

try {
  const cGoc = cay(GOC_SHA, false); const cMoi = cay(null, false);
  const fGoc = cay(GOC_SHA, true); const fMoi = cay(null, true);
  const kqGoc = {};
  for (const m of MA_TRAN) {
    const [id, nhan, kind, fork] = m;
    const a = await chayMot(fork ? fGoc : cGoc, m); kqGoc[id] = a;
    if (process.env.VP_IN) console.log(`    [${id}] ${a.status} · ${(a.stdout.trim().split('\n').pop() || '').slice(0, 110)} · ${(a.stderr.trim().split('\n').pop() || '').slice(0, 110)}`);
    const b = await chayMot(fork ? fMoi : cMoi, m);
    const d = khac(a, b);
    const ten = `${id} ${nhan} · ${kind}${fork ? ' · fork' : ''}`;
    d ? bad(ten, `— lệch: ${d}`) : ok(ten, '— bản gốc = cây đang kiểm');
  }
  console.log(`  (ma trận ${MA_TRAN.length} dòng)`);
  // VP-DO: phép so phải đỏ khi một bên đổi một chữ đầu ra (bản sao cây gốc, đổi chuỗi in của plugin-declare --list).
  {
    const c2 = cay(GOC_SHA, false); const p = path.join(c2, 'scripts', 'plugin-declare.mjs'); const t = readFileSync(p, 'utf8');
    const t2 = t.replace('for (const n of names) console.log(n);', "for (const n of names) console.log(n + ' ');");
    if (t2 === t) bad('VP-DO', 'nhát phá không áp');
    else { writeFileSync(p, t2); const d = khac(kqGoc['VP-1'], await chayMot(c2, MA_TRAN[0])); d ? ok('VP-DO', `phép so đỏ khi đầu ra đổi một chữ (${d.slice(0, 60)}…)`) : bad('VP-DO', 'phép so không đỏ'); }
  }
  if (!process.argv.includes('--bo-ht')) {
    // VP-HT: bản sao kho (clone --shared, không ghi vào kho kit), lành → ca cửa tín hiệu xanh; phá hộp thư → đỏ.
    const ban = path.join(tam('ht'), 'acceptance-gate-kit');
    execFileSync('git', ['clone', '-q', '--shared', KIT, ban], { env: ENV });
    git(ban, 'checkout', '-q', '--detach', git(KIT, 'rev-parse', 'HEAD').trim());
    const CA = path.join('tests', 'scripts', 'cua-tin-hieu-goc-moi-worktree.test.mjs');
    const lanh = node([path.join(ban, CA)], { cwd: ban });
    if (lanh.status !== 0) bad('VP-HT', `lần lành chưa xanh trên cùng bản sao: ${String(lanh.stdout).split('\n').filter(l => /FAIL/.test(l)).slice(0, 2).join(' | ')}`);
    else {
      // Nhát phá CHỈ đánh bản hộp thư của lõi (bản điều phối giữ nguyên), vào đường mà ca LÀNH GW-1 đi qua: bộ đọc cửa
      // bỏ gốc nguồn của thư mục chính → ý người gửi từ worktree nằm lại trong worktree. Chuỗi phá không trùng nhát tiêm
      // nào bộ test tự áp (S4 lượt 1: nhát cũ trùng GW-1-do2 nên màu đỏ đến từ «nhát tiêm lệch», không từ vật).
      const p = path.join(ban, 'scripts', 'hop-thu', 'cua-tin-hieu.mjs');
      const t = existsSync(p) ? readFileSync(p, 'utf8') : '';
      const cu = 'const g = gocNguon ?? gocKho;';
      const GHIM = 'ý người nằm trong worktree';
      if (t.split(cu).length !== 2) bad('VP-HT', 'nhát phá không áp: scripts/hop-thu/cua-tin-hieu.mjs');
      else {
        writeFileSync(p, t.replace(cu, 'const g = gocKho;'));
        const pha = node([path.join(ban, CA)], { cwd: ban, env: { ...ENV, GW_CASES: 'GW-1' } });
        const dong = String(pha.stdout).split('\n').find(l => /^\s*FAIL: GW-1 — /.test(l)) || '';
        pha.status !== 0 && dong.includes(GHIM)
          ? ok('VP-HT', `phá scripts/hop-thu/cua-tin-hieu.mjs trên bản sao → ca cửa tín hiệu đỏ (GW-1: ${GHIM})`)
          : bad('VP-HT', `ca cửa tín hiệu không chạm hộp thư (thoát ${pha.status}; GW-1: ${dong.trim().slice(0, 160) || 'không có dòng FAIL'})`);
      }
    }
  }
} catch (e) {
  console.log(`HẠ TẦNG: ${String(e.message || e).split('\n')[0]}`);
  rmSync(TMP, { recursive: true, force: true });
  process.exit(3);
}
console.log(`goi-cheo vi-phan: ${pass} passed, ${fail} failed`);
rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
