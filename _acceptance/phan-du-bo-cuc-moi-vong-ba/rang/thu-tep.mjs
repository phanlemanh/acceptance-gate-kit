#!/usr/bin/env node
// thu-tep.mjs — công cụ thi công của vòng ba (KHÔNG phải eval): chạy một hay vài tệp kiểm ở hai bố cục trên cây LÀM VIỆC.
//
//   node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/thu-tep.mjs tests/scripts/<tệp>.test.mjs [...]
//
// Chụp cây làm việc (gồm tệp mới chưa theo dõi) thành một commit tạm bằng chỉ mục tạm — không đổi nhánh, không đổi chỉ mục
// thật —, rồi với mỗi tệp: (1) bố cục cũ: bản sao commit tạm; (2) kho mới: `khoMoi` của thước vòng hai trên commit tạm,
// bước 6 bỏ qua tự-đúng-đường vòng hai ∪ vòng ba ∪ chính các tệp đưa vào. In số PASS/FAIL hai phía, các dòng FAIL đầu, và
// từng khoá đích (khoa-dich.tsv) của tệp ấy: có mặt + xanh ở kho mới hay không. Thoát 0 khi cả hai phía xanh và đủ khoá.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docKhoaDich, doiKhoa, rutKhoa } from '../../phan-du-bo-cuc-moi/rang/tui-khoa.mjs';
import { BX } from '../../phan-du-bo-cuc-moi/rang/buoc6-chep.mjs';
import { demKhop } from './giu-khoa-3.mjs';
import { apDuongDoiTen } from './buoc3-duong-chep.mjs';
import { docTuDung, khoMoi, moCtx } from '../../phan-du-bo-cuc-moi/rang/giu-khoa.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(HERE, '..', '..', '..');
const tep = process.argv.slice(2);
if (!tep.length || tep.some(t => !t.startsWith('tests/'))) { process.stderr.write('dùng: thu-tep.mjs tests/<bộ>/<tệp> [...]\n'); process.exit(2); }

const g = (a, env = {}) => execFileSync('git', ['-C', GOC, ...a], { encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 1 << 28 }).trim();
const tmp = mkdtempSync(path.join(tmpdir(), 'thu-tep-'));
const idx = path.join(tmp, 'index');
const E = { GIT_INDEX_FILE: idx, GIT_AUTHOR_NAME: 'thu-tep', GIT_AUTHOR_EMAIL: 'thu-tep@invalid', GIT_COMMITTER_NAME: 'thu-tep', GIT_COMMITTER_EMAIL: 'thu-tep@invalid' };
g(['read-tree', 'HEAD'], E); g(['add', '-A'], E);
const cay = g(['write-tree'], E);
const snap = g(['commit-tree', cay, '-p', 'HEAD', '-m', 'thu-tep: chụp cây làm việc'], E);

const td = f => docTuDung(readFileSync(path.join(GOC, f), 'utf8')) || [];
const ctx = moCtx(); ctx.originMain = g(['rev-parse', '--verify', '-q', 'origin/main']);
const cu = path.join(ctx.tmp, 'cu');
execFileSync('git', ['clone', '-q', '--shared', '--no-checkout', GOC, cu]); execFileSync('git', ['-C', cu, 'checkout', '-q', '--detach', snap]);
execFileSync('git', ['-C', cu, 'update-ref', 'refs/remotes/origin/main', ctx.originMain]);
const moi = khoMoi(ctx, snap, 'moi', { ten: true, buoc6: true, boQua: [...new Set([...td('_acceptance/phan-du-bo-cuc-moi/gui-b2.md'), ...td('_acceptance/phan-du-bo-cuc-moi-vong-ba/gui-b2.md'), ...tep])] });
if (apDuongDoiTen(moi)) { execFileSync('git', ['-C', moi, 'add', '-A']); execFileSync('git', ['-C', moi, '-c', 'commit.gpgsign=false', '-c', 'user.name=thu-tep', '-c', 'user.email=thu-tep@invalid', 'commit', '-q', '-m', 'kho mới: luật đường đổi tên của bước 3']); }
const hang = docKhoaDich(path.join(HERE, '..', 'khoa-dich.tsv'));

const env = { ...process.env, HOME: path.join(tmp, 'home'), TMPDIR: tmp };
for (const k of ['NODE_TEST_CONTEXT', 'LT_CASES', 'ONLY_BLOCK', 'NODE_OPTIONS']) delete env[k];
function chay(goc, rel) {
  const bo = rel.split('/')[1];
  const cmd = bo === 'dieu-phoi' ? ['--test', '--test-reporter=tap', rel] : [rel];
  let out = ''; let rc = 0;
  try { out = execFileSync(process.execPath, cmd, { cwd: goc, encoding: 'utf8', env, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { out = `${e.stdout || ''}\n${e.stderr || ''}`; rc = e.status ?? 1; }
  return { rc, out, kq: rutKhoa(out, bo === 'dieu-phoi' ? 'tap' : 'bash') };
}
let xau = 0;
for (const rel of tep) {
  const a = chay(cu, rel); const b = chay(moi, rel);
  const n = m => [...m.values()].reduce((x, y) => x + y, 0);
  console.log(`== ${rel}`);
  console.log(`  cũ : thoát ${a.rc} · đạt ${n(a.kq.dat)} · đỏ ${n(a.kq.do)}`);
  console.log(`  mới: thoát ${b.rc} · đạt ${n(b.kq.dat)} · đỏ ${n(b.kq.do)}`);
  for (const [nhan, r] of [['cũ', a], ['mới', b]]) {
    const l = r.out.split('\n').filter(x => /^\s*(FAIL:|not ok)|HẠ TẦNG|Error/.test(x)).slice(0, 8);
    for (const x of l) console.log(`    [${nhan}] ${x.trim().slice(0, 240)}`);
  }
  const ten = path.basename(rel);
  const dich = hang.filter(h => h.tepKiem === ten);
  const doi = doiKhoa(BX._bangTen, BX);
  const thieu = dich.filter(h => !(demKhop(b.kq.dat, h.khoa, doi) > 0) || demKhop(b.kq.do, h.khoa, doi) > 0);
  console.log(`  khoá đích: ${dich.length - thieu.length}/${dich.length} có mặt và xanh ở kho mới`);
  for (const h of thieu.slice(0, 15)) console.log(`    thiếu/đỏ: [${h.cum}] ${h.khoa}`);
  if (a.rc || b.rc || thieu.length) xau++;
}
rmSync(ctx.tmp, { recursive: true, force: true }); rmSync(tmp, { recursive: true, force: true });
process.exit(xau ? 1 : 0);
