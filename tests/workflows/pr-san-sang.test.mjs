// Hồ sơ ky-den-gop, hạng H — PR sẵn sàng ngay lúc trình thẻ Cổng Bằng chứng. Kho git THẬT (origin trần + bản clone),
// gh giả ghi lại lời gọi. Mỗi lối «không làm» ghim cả việc KHÔNG đẩy (origin không có nhánh) và KHÔNG gọi gh.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Loi, prSanSang } from '../../feature-loop/scripts/pr-san-sang.mjs';

const LENH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'feature-loop', 'scripts', 'pr-san-sang.mjs');
const tam = () => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'pss-')));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (k, f, t) => {
  fs.mkdirSync(path.dirname(path.join(k, f)), { recursive: true });
  fs.writeFileSync(path.join(k, f), t);
};

function kho({ status = 'verified', verdict = 'PASS', vatDoiSau = false, config = '' } = {}) {
  const goc = tam();
  const origin = path.join(goc, 'o.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'k');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  ghi(k, 'src/a.ts', '1');
  if (config) ghi(k, '_acceptance/config.yaml', config);
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goc');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'vong/s');
  ghi(k, 'src/a.ts', '2');
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'vat');
  const vc = git(k, 'rev-parse', 'HEAD');
  ghi(k, '_acceptance/s/contract.md', `---\nfeature: Phiếu công ty hai cột\nslug: s\nstatus: ${status}\n---\n`);
  ghi(k, '_acceptance/s/evidence-report.md', `---\nverdict: ${verdict}\nverified_commit: ${vc}\n---\n`);
  git(k, 'add', '-A');
  git(k, 'commit', '-q', '-m', 'goi bang chung');
  if (vatDoiSau) {
    ghi(k, 'src/a.ts', '3');
    git(k, 'add', '-A');
    git(k, 'commit', '-q', '-m', 'sua sau cham');
  }
  return { k, origin };
}
function ghGia(k, { co = null } = {}) {
  const goi = [];
  let pr = co;
  const chay = (cmd, args) => {
    if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    goi.push(args.slice(0, 2).join(' '));
    if (args[1] === 'view') {
      if (!pr) throw new Error('no pull requests found');
      return JSON.stringify(pr);
    }
    if (args[1] === 'create') pr = { number: 12, isDraft: args.includes('--draft'), state: 'OPEN', url: 'u' };
    if (args[1] === 'ready') pr = { ...pr, isDraft: false };
    return '';
  };
  return { chay, goi, pr: () => pr };
}
const nhanhTrenOrigin = (origin) => spawnSync('git', ['rev-parse', '--verify', '-q', 'refs/heads/vong/s'], { cwd: origin, encoding: 'utf8' }).stdout.trim();

test('H-1 verified + PASS, chưa có PR → đẩy đúng HEAD, mở nháp rồi chuyển sẵn sàng', () => {
  const { k, origin } = kho();
  const g = ghGia(k);
  const kq = prSanSang({ root: k, slug: 's', base: 'main', chay: g.chay });
  assert.equal(nhanhTrenOrigin(origin), git(k, 'rev-parse', 'HEAD'));
  assert.deepEqual(g.goi, ['pr view', 'pr create', 'pr view', 'pr ready']);
  assert.equal(g.pr().isDraft, false);
  assert.match(kq.dong, /^pr-san-sang: PR #12 sẵn sàng \(mới mở\) @[0-9a-f]{7} — CI chạy trong lúc người đọc thẻ/);
});

test('H-2 PR nháp đã có → chỉ chuyển sẵn sàng; PR đã sẵn sàng → không mở, không đổi gì (chạy lại được)', () => {
  const a = kho();
  const nhap = ghGia(a.k, { co: { number: 9, isDraft: true, state: 'OPEN' } });
  prSanSang({ root: a.k, slug: 's', chay: nhap.chay });
  assert.deepEqual(nhap.goi, ['pr view', 'pr ready']);
  const san = ghGia(a.k, { co: { number: 9, isDraft: false, state: 'OPEN' } });
  assert.match(prSanSang({ root: a.k, slug: 's', chay: san.chay }).dong, /PR #9 sẵn sàng @/);
  assert.deepEqual(san.goi, ['pr view']);
});

test('H-3 chưa đủ điều kiện (chưa verified · verdict REJECT · vật đổi sau lượt chấm) → thoát 2, KHÔNG đẩy, KHÔNG gọi gh', () => {
  const bang = [
    [{ status: 'implemented' }, /hợp đồng ở «implemented», cần verified/],
    [{ verdict: 'REJECT' }, /verdict «REJECT»/],
    [{ vatDoiSau: true }, /vật đổi sau lượt chấm \(src\/a\.ts\)/],
  ];
  for (const [o, re] of bang) {
    const { k, origin } = kho(o);
    const g = ghGia(k);
    assert.throws(() => prSanSang({ root: k, slug: 's', chay: g.chay }), (e) => e instanceof Loi && e.ma === 2 && re.test(e.message), JSON.stringify(o));
    assert.equal(nhanhTrenOrigin(origin), '', `${JSON.stringify(o)}: không được đẩy`);
    assert.deepEqual(g.goi, []);
  }
});

test('H-4 ship_default khác pr → chỉ đẩy, không mở PR; không remote → thoát 3 (hạ tầng, vòng đi tiếp)', () => {
  const { k, origin } = kho({ config: 'feature_loop:\n  ship_default: branch\n' });
  const g = ghGia(k);
  assert.match(prSanSang({ root: k, slug: 's', chay: g.chay }).dong, /ship_default branch, không mở PR/);
  assert.equal(nhanhTrenOrigin(origin), git(k, 'rev-parse', 'HEAD'));
  assert.deepEqual(g.goi, []);
  const b = kho();
  git(b.k, 'remote', 'remove', 'origin');
  assert.throws(() => prSanSang({ root: b.k, slug: 's', chay: ghGia(b.k).chay }), (e) => e.ma === 3 && /không đẩy được vong\/s/.test(e.message));
});

test('H-5 dòng lệnh: thoát 2 kèm lý do khi chưa verified; thiếu --slug → 64', () => {
  const { k } = kho({ status: 'implemented' });
  const r = spawnSync(process.execPath, [LENH, '--root', k, '--slug', 's'], { encoding: 'utf8' });
  assert.deepEqual([r.status, r.stderr.trim()], [2, 'pr-san-sang: hợp đồng ở «implemented», cần verified — bước này chạy lúc trình thẻ Cổng Bằng chứng']);
  assert.equal(spawnSync(process.execPath, [LENH, '--root', k], { encoding: 'utf8' }).status, 64);
});

// Thước gắn vào vật: dòng lệnh trong khối PR-SAN-SANG của SKILL.md (thứ phiên thật chạy) phải trỏ đúng lệnh này và
// chạy được. Đối chứng: khối thay tên tệp → lệnh rút ra không tồn tại (mã 1 của node, không phải 2).
const SKILL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const WORKFLOWS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'feature-loop', 'workflows');
function chayKhoi(t, k) {
  const khoi = /<!-- <<<PR-SAN-SANG -->\n([\s\S]*?)<!-- PR-SAN-SANG>>> -->/.exec(t)?.[1];
  assert.ok(khoi, 'SKILL.md thiếu khối PR-SAN-SANG');
  const lenh = /```\n(node [^\n]+)\n```/.exec(khoi)?.[1];
  assert.ok(lenh, 'khối PR-SAN-SANG thiếu dòng lệnh');
  return spawnSync('bash', ['-c', lenh.replace('<slug>', 's').replace('<nhánh chính>', 'main')], { cwd: k, encoding: 'utf8', env: { ...process.env, WORKFLOWS_DIR } });
}
test('H-6 dòng lệnh rút từ khối PR-SAN-SANG của skill chạy đúng lệnh (thoát 2 trên hồ sơ chưa verified); đối chứng tên tệp sai', () => {
  const { k } = kho({ status: 'implemented' });
  const t = fs.readFileSync(SKILL, 'utf8');
  const r = chayKhoi(t, k);
  assert.deepEqual([r.status, /cần verified/.test(r.stderr)], [2, true], r.stderr);
  const sai = chayKhoi(t.replace('scripts/pr-san-sang.mjs', 'scripts/pr-san-sang-cu.mjs'), k);
  assert.equal(sai.status, 1);
  assert.match(sai.stderr, /Cannot find module/);
});
