#!/usr/bin/env node
// vi-phan.mjs — AC-7 của hồ sơ gia-lan-ghim-lai: khoá vắng thì làn SAU-GIA nói và ghi BẰNG HỆT làn
// BASE-GIA, sau khi gỡ ĐÚNG ba phần chỉ-thêm đã kê (dòng stderr «[lane] TỔNG KẾT», khoá tong_ket ở mọi
// JSON, dòng repin-do ly_do bi-ngat). Cả hai làn dùng CHUNG bộ máy acceptance-gate tại BASE-GIA.
// Kho mỗi kịch bản dựng MỘT lần rồi chép thành hai bản → cùng sha, cùng nội dung.
// Trong bản sao bị phá (chan.mjs, GG_REPO có mặt) thì làn SAU là làn của chính bản sao.
import { spawnSync, spawn } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ROOT, baseGia, sauGia, banSao, THU_MUC_BAN_MAY } from './ban-sao.mjs';

const { mkKho, lenhChau, song, ngu } = await import(path.join(ROOT, 'tests', 'scripts', 'gia-lan-fixture.mjs'));
const base = banSao(baseGia(), THU_MUC_BAN_MAY);
const sauGoc = process.env.GG_REPO ? ROOT : banSao(sauGia({ chiLan: true }), THU_MUC_BAN_MAY);
const LAN = { BASE: path.join(base, 'feature-loop', 'scripts', 'repin-lane.mjs'), SAU: path.join(sauGoc, 'feature-loop', 'scripts', 'repin-lane.mjs') };
const RUN_ID = 'repin-vi-phan-gia';

function chepKho(k) { const d = mkdtempSync(path.join(tmpdir(), 'gg-vp-')); cpSync(k.root, d, { recursive: true }); return d; }
const envLan = () => ({ ...process.env, GG_DAU: mkdtempSync(path.join(tmpdir(), 'gg-vp-dau-')) });
function chay(lan, root, args) {
  const r = spawnSync(process.execPath, [lan, '--root', root, '--ag-root', base, '--slug', 'feat', ...args], { encoding: 'utf8', env: envLan(), maxBuffer: 256 * 1024 * 1024, timeout: 300000 });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}
async function chayNgat(lan, root, args) {
  const env = envLan();
  const p = spawn(process.execPath, [lan, '--root', root, '--ag-root', base, '--slug', 'feat', ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  p.stdout.on('data', d => { stdout += d; }); p.stderr.on('data', d => { stderr += d; });
  const xong = new Promise(res => p.on('close', (status, signal) => res({ status, signal })));
  const t = Date.now(); let pid = null;
  while (Date.now() - t < 20000) { const f = path.join(env.GG_DAU, 'chau.pid'); if (existsSync(f) && /^\d+$/.test(readFileSync(f, 'utf8').trim())) { pid = Number(readFileSync(f, 'utf8').trim()); break; } await ngu(100); }
  if (!pid) throw new Error('cháu chưa kịp sinh — kịch bản bị ngắt không đo được');
  p.kill('SIGTERM');
  const r = await xong;
  await ngu(500);
  if (song(pid)) { try { process.kill(pid, 'SIGKILL'); } catch { /* */ } }     // bản trước vòng để cháu sót — dọn sau khi đo
  // Bị giết bởi SIGTERM (bản trước vòng) và tự thoát 143 (bản sau) là CÙNG một mã ở mắt shell.
  return { status: r.status === null && r.signal === 'SIGTERM' ? 143 : r.status, stdout, stderr };
}

// ── chuẩn hoá + gỡ ĐÚNG phần chỉ-thêm ──────────────────────────────────────
function boThem(o) {
  if (!o || typeof o !== 'object') return o;
  delete o.tong_ket;
  if (o.slugs) for (const s of Object.values(o.slugs)) if (typeof s.line === 'string') { const l = JSON.parse(s.line); delete l.tong_ket; s.line = JSON.stringify(l); }
  return o;
}
function chuan(text, root) {
  return String(text).split(root).join('<ROOT>')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/g, '<TS>')
    .replace(/"wall_s":\s*[\d.]+/g, '"wall_s":<T>')
    .replace(/\(\d+\.\ds\)/g, '(<T>s)')
    .replace(/"tai":\{[^{}]*\}/g, '"tai":<TAI>');
}
function stdoutSach(s, root) {
  try { return chuan(JSON.stringify(boThem(JSON.parse(s)), null, 2), root); } catch { return chuan(s, root); }
}
const stderrSach = (s, root) => chuan(s.split('\n').filter(l => !l.startsWith('[lane] TỔNG KẾT')).join('\n'), root);
function logSach(root) {
  const p = path.join(root, '_acceptance', 'feat', 'run-log.jsonl');
  if (!existsSync(p)) return '';
  return chuan(readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
    .filter(o => !(o.kind === 'repin-do' && o.ly_do === 'bi-ngat')).map(o => JSON.stringify(boThem(o))).join('\n'), root);
}
const reportSach = (root) => chuan(readFileSync(path.join(root, '_acceptance', 'feat', 'evidence-report.md'), 'utf8'), root);

// ── kịch bản (khoá vắng) ────────────────────────────────────────────────────
const KICH_BAN = [
  { ten: 'skip-unchanged', dung: () => { const k = mkKho(); const r = chay(LAN.BASE, k.root, ['--reason', 'pin', '--write', '--run-id', 'repin-pin-dau']); if (r.status !== 0) throw new Error(`pin đầu đỏ: ${r.stderr}`); k.git('add', '-A'); k.git('commit', '-qm', 'pin'); return k; }, args: ['--skip-unchanged'] },
  { ten: 'write-xanh', dung: () => mkKho(), args: ['--write', '--run-id', RUN_ID, '--reason', 'vi phan'] },
  { ten: 'write-do', dung: () => mkKho({ suite: 'echo "(fail) do-that"\nexit 1\n' }), args: ['--write', '--run-id', RUN_ID, '--reason', 'vi phan'] },
  { ten: 'sigterm-giua-lenh', dung: () => mkKho({ suiteCmd: lenhChau() }), args: ['--write', '--run-id', RUN_ID], ngat: true },
];

const loi = [];
for (const kb of KICH_BAN) {
  console.log(`… [AC7-${kb.ten}]`);
  const k = kb.dung();
  const ra = {};
  for (const ben of ['BASE', 'SAU']) {
    const root = chepKho(k);
    const r = kb.ngat ? await chayNgat(LAN[ben], root, kb.args) : chay(LAN[ben], root, kb.args);
    ra[ben] = { status: r.status, stdout: stdoutSach(r.stdout, root), stderr: stderrSach(r.stderr, root), log: logSach(root), report: reportSach(root), root };
  }
  for (const phan of ['status', 'stdout', 'stderr', 'log', 'report']) {
    const a = String(ra.BASE[phan]); const b = String(ra.SAU[phan]);
    if (a === b) continue;
    if (phan === 'status') { loi.push(`VI PHÂN KHÁC ở ${kb.ten} (mã thoát): BASE ${a} · SAU ${b}`); continue; }
    const la = a.split('\n'), lb = b.split('\n');
    const i = la.findIndex((l, j) => l !== lb[j]);
    loi.push(`VI PHÂN KHÁC ở ${kb.ten} (${phan}), dòng ${i + 1}:\n    BASE «${la[i] ?? '(hết)'}»\n    SAU  «${lb[i] ?? '(hết)'}»`);
  }
  if (kb.ten === 'write-xanh' && ra.SAU.status === 0) {
    const rc = spawnSync(process.execPath, [path.join(base, 'scripts', 'recheck-evidence.cjs'), path.join(ra.SAU.root, '_acceptance', 'feat', 'evidence-report.md')], { encoding: 'utf8' });
    if (rc.status !== 0) loi.push(`recheck-evidence của BASE-GIA đỏ trên báo cáo làn SAU ghi (dòng có tong_ket): ${rc.stderr.trim().split('\n')[0]}`);
    else console.log('    recheck-evidence của BASE-GIA đọc dòng repin có tong_ket: xanh');
  }
  console.log(loi.some(l => l.includes(` ${kb.ten} `)) ? `    khác` : `    giống (sau khi gỡ phần chỉ-thêm)`);
}
if (loi.length) { console.log(`\n${loi.join('\n')}`); process.exit(1); }
console.log('\nAC-7: khoá vắng → làn SAU-GIA bằng hệt BASE-GIA ở 4 kịch bản, trừ đúng phần chỉ-thêm đã kê');
