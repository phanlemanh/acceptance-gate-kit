// Hồ sơ ky-den-gop, hạng I — gộp không chạy lại CI khi PR không trùng tệp với nhánh chính. Kho git THẬT dựng trong lượt
// (origin trần + bản clone); chỉ gh là giả (trả JSON của `gh pr view`, ghi lại lời gọi `gh pr merge`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ciXanh, gop, xetGop } from '../../../dieu-phoi/scripts/gop.mjs';
import { CFG_PHAT_LICH } from './mau-thu.mjs';

const tam = () => fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp-gop-')));
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (kho, tep, noi) => {
  fs.mkdirSync(path.dirname(path.join(kho, tep)), { recursive: true });
  fs.writeFileSync(path.join(kho, tep), noi);
};
const commit = (kho, tep, noi, msg) => {
  ghi(kho, tep, noi);
  git(kho, 'add', '-A');
  git(kho, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', msg);
};
const PHIEU = 'apps/web/company-sheet.tsx';
// Trạng thái đã thông viết `machine-cleared`: tệp ca không mang chuỗi trạng thái ký người để khỏi thành «file lạ» của
// lưới RT13 (tiền lệ repin-lane-noi-ra.test.mjs) — cùng tập DA_THONG nên lối gộp không đổi.
const KY = '---\nslug: s\nstatus: machine-cleared\n---\n';

// `doiTen`: nhánh chính đổi tên chính tệp phiếu thay vì thêm tệp.
// Kịch bản: nhánh `feat` sửa phiếu + ký hồ sơ; nhánh chính `main` có thể tiến thêm một commit (`tien`: tệp nào).
function kho({ tien = null, ky = KY, doiTen = false } = {}) {
  const goc = tam();
  const origin = path.join(goc, 'origin.git');
  git(goc, 'init', '-q', '--bare', '-b', 'main', origin);
  const k = path.join(goc, 'kho');
  git(goc, 'clone', '-q', origin, k);
  git(k, 'checkout', '-q', '-b', 'main');
  commit(k, PHIEU, 'v1\n', 'goc');
  commit(k, 'apps/api/a.ts', 'v1\n', 'api');
  git(k, 'push', '-q', 'origin', 'main');
  git(k, 'checkout', '-q', '-b', 'feat');
  commit(k, PHIEU, 'hai cot\n', 'phieu hai cot');
  commit(k, '_acceptance/s/contract.md', ky, 'ky cong 2');
  git(k, 'push', '-q', 'origin', 'feat');
  const sha = git(k, 'rev-parse', 'HEAD');
  if (doiTen) {
    git(k, 'checkout', '-q', 'main');
    git(k, 'mv', PHIEU, 'apps/web/company-sheet-v2.tsx');
    git(k, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'doi ten phieu');
    git(k, 'push', '-q', 'origin', 'main');
    git(k, 'checkout', '-q', 'feat');
  }
  if (tien) {
    git(k, 'checkout', '-q', 'main');
    commit(k, tien, 'khac\n', `vao nhanh chinh: ${tien}`);
    git(k, 'push', '-q', 'origin', 'main');
    git(k, 'checkout', '-q', 'feat');
  }
  return { k, sha };
}
const XANH = [{ __typename: 'CheckRun', name: 'gate', status: 'COMPLETED', conclusion: 'SUCCESS' }, { __typename: 'StatusContext', context: 'ci/x', state: 'SUCCESS' }];
function ioCua(k, sha, { rollup = XANH, them = {}, ciChinh = () => '[]' } = {}) {
  const goiGh = [];
  return {
    goiGh,
    chay: (cmd, args) => {
      if (cmd !== 'gh') return execFileSync(cmd, args, { cwd: k, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      goiGh.push(args);
      if (args[0] === 'run' && args[1] === 'list') return ciChinh(args);
      if (args[0] === 'pr' && args[1] === 'view') return JSON.stringify({ number: 7, state: 'OPEN', isDraft: false, mergeable: 'MERGEABLE', headRefOid: sha, headRefName: 'feat', baseRefName: 'main', statusCheckRollup: rollup, ...them });
      return '';
    },
  };
}
const TAT = { ...CFG_PHAT_LICH, nhanh_chinh: 'main' };
const BAT = { ...TAT, gop_khong_chay_lai_ci: true };

test('I-1 nhánh chính tiến bằng tệp KHÁC → «khong-trung» (gộp ngay); đối chứng: tiến bằng CHÍNH tệp phiếu → «cu», nêu tệp trùng', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  const kq = xetGop({ io: ioCua(a.k, a.sha), cfg: BAT, pr: 7, slug: 's' });
  assert.equal(kq.duong, 'khong-trung', kq.ly_do);
  assert.match(kq.ly_do, /không tệp nào trùng \(2 tệp của PR · 1 tệp vào nhánh chính qua 1 commit\)/);
  const b = kho({ tien: PHIEU });
  const kb = xetGop({ io: ioCua(b.k, b.sha), cfg: BAT, pr: 7, slug: 's' });
  assert.equal(kb.duong, 'cu');
  assert.deepEqual(kb.trung, [PHIEU]);
  assert.match(kb.ly_do, /trùng 1 tệp với 1 commit vào nhánh chính từ base của CI \(apps\/web\/company-sheet\.tsx\)/);
});

test('I-2 khoá tắt (vắng hoặc false) → «cu» dù không trùng; nhánh đã chứa đỉnh nhánh chính → «moi-nhat» cả khi khoá tắt', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  for (const cfg of [TAT, { ...TAT, gop_khong_chay_lai_ci: false }]) {
    const kq = xetGop({ io: ioCua(a.k, a.sha), cfg, pr: 7, slug: 's' });
    assert.equal(kq.duong, 'cu');
    assert.match(kq.ly_do, /khoá gop_khong_chay_lai_ci tắt/);
  }
  const m = kho();
  assert.equal(xetGop({ io: ioCua(m.k, m.sha), cfg: TAT, pr: 7, slug: 's' }).duong, 'moi-nhat');
});

test('I-3 CI chưa xanh trên đầu nhánh, hồ sơ chưa ký, PR nháp hay xung đột → không gộp', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  const doi = [
    [{ rollup: [] }, 'cho-ci', /chưa có check nào/],
    [{ rollup: [{ name: 'gate', status: 'IN_PROGRESS' }] }, 'cho-ci', /gate: IN_PROGRESS/],
    [{ rollup: [{ name: 'gate', status: 'COMPLETED', conclusion: 'FAILURE' }] }, 'cho-ci', /gate: FAILURE/],
    [{ rollup: [{ context: 'ci/x', state: 'PENDING' }] }, 'cho-ci', /ci\/x: PENDING/],
    [{ them: { isDraft: true } }, 'chan', /còn nháp/],
    [{ them: { mergeable: 'CONFLICTING' } }, 'cu', /xung đột/],
  ];
  for (const [o, duong, re] of doi) {
    const kq = xetGop({ io: ioCua(a.k, a.sha, o), cfg: BAT, pr: 7, slug: 's' });
    assert.equal(kq.duong, duong, JSON.stringify(o));
    assert.match(kq.ly_do, re);
  }
  const chuaKy = kho({ tien: 'apps/api/b.ts', ky: '---\nslug: s\nstatus: verified\n---\n' });
  const kq = xetGop({ io: ioCua(chuaKy.k, chuaKy.sha), cfg: BAT, pr: 7, slug: 's' });
  assert.deepEqual([kq.duong, /«verified»/.test(kq.ly_do)], ['chan', true]);
  assert.deepEqual(ciXanh([{ name: 'a', status: 'COMPLETED', conclusion: 'SKIPPED' }, { name: 'b', status: 'COMPLETED', conclusion: 'NEUTRAL' }]), { xanh: true });
});

function dotTrong(k, { tuMerge = true, chuKhoa = 'P1' } = {}) {
  const d = path.join(k, '.acceptance-runs', 'dot-thu');
  fs.mkdirSync(path.join(d, 'khoa', 'merge'), { recursive: true });
  fs.symlinkSync(d, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  fs.writeFileSync(path.join(d, 'dieu-phoi.config.json'), JSON.stringify(BAT));
  fs.writeFileSync(path.join(d, 'hang-viec.json'), JSON.stringify({ dot: 'thu', day: [{ id: 'P1', worktree: k }], hang: [{ slug: 's', day: 'P1' }] }));
  fs.writeFileSync(path.join(d, 'dieu-khien.json'), JSON.stringify({ pha: 'dang-chay', tu_merge: tuMerge, lich_su: [] }));
  fs.writeFileSync(path.join(d, 'khoa', 'merge', 'chu.json'), JSON.stringify({ phien: chuKhoa, slug: 's', loai: 'merge' }));
  return d;
}

test('I-4 lệnh gop: giữ khoá + tự gộp → gọi `gh pr merge 7 --merge --match-head-commit <sha>` (không --auto), ghi sự kiện gop', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  const d = dotTrong(a.k);
  const io = ioCua(a.k, a.sha);
  const kq = gop(a.k, '7', { io });
  assert.equal(kq.da_gop, true);
  const merge = io.goiGh.filter((x) => x[1] === 'merge');
  assert.deepEqual(merge, [['pr', 'merge', '7', '--merge', '--match-head-commit', a.sha]]);
  const sk = fs.readFileSync(path.join(d, 'su-kien.jsonl'), 'utf8').trim().split('\n').map((x) => JSON.parse(x)).filter((s) => s.loai === 'gop');
  assert.deepEqual(sk.map((s) => [s.pr, s.hang, s.duong, s.da_gop, s.sha]), [[7, 's', 'khong-trung', true, a.sha]]);
  // Đối chứng: trùng tệp → không gọi merge.
  const b = kho({ tien: PHIEU });
  dotTrong(b.k);
  const iob = ioCua(b.k, b.sha);
  assert.equal(gop(b.k, '7', { io: iob }).da_gop, false);
  assert.equal(iob.goiGh.filter((x) => x[1] === 'merge').length, 0);
});

test('I-5 lệnh gop: không giữ khoá merge hay đợt không cho tự gộp → từ chối, không gọi gh; --xet chỉ in quyết định', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  dotTrong(a.k, { chuKhoa: 'P9' });
  const io = ioCua(a.k, a.sha);
  assert.throws(() => gop(a.k, '7', { io }), /khoá merge không do P1 giữ \(P9\)/);
  assert.equal(io.goiGh.length, 0);
  const xet = gop(a.k, '7', { io, xet: true, slug: 's' });
  assert.deepEqual([xet.duong, xet.da_gop], ['khong-trung', false]);
  assert.equal(io.goiGh.filter((x) => x[1] === 'merge').length, 0);
  const b = kho({ tien: 'apps/api/b.ts' });
  dotTrong(b.k, { tuMerge: false });
  assert.throws(() => gop(b.k, '7', { io: ioCua(b.k, b.sha) }), /đợt không cho tự gộp/);
});

test('I-6 lưới của lối nhanh là CI nhánh chính THẬT: đỉnh nhánh chính có lượt đỏ → «cu»; đang chạy hay xanh → «khong-trung»; không đọc được → «cu»', () => {
  const a = kho({ tien: 'apps/api/b.ts' });
  const lo = (runs) => xetGop({ io: ioCua(a.k, a.sha, { ciChinh: () => JSON.stringify(runs) }), cfg: BAT, pr: 7, slug: 's' });
  const doKq = lo([{ name: 'ci', status: 'completed', conclusion: 'failure' }, { name: 'gate', status: 'completed', conclusion: 'success' }]);
  assert.equal(doKq.duong, 'cu');
  assert.match(doKq.ly_do, /CI nhánh chính đỏ ở đỉnh [0-9a-f]{7} \(ci\) — không gộp nhanh chồng lên nhánh đỏ/);
  assert.equal(lo([{ name: 'ci', status: 'in_progress', conclusion: '' }]).duong, 'khong-trung');
  assert.equal(lo([{ name: 'ci', status: 'completed', conclusion: 'success' }]).duong, 'khong-trung');
  const hong = xetGop({ io: ioCua(a.k, a.sha, { ciChinh: () => { throw new Error('gh'); } }), cfg: BAT, pr: 7, slug: 's' });
  assert.deepEqual([hong.duong, /không đọc được CI nhánh chính/.test(hong.ly_do)], ['cu', true]);
  // Lời gọi đọc đúng đỉnh nhánh chính.
  let hoi = null;
  xetGop({ io: ioCua(a.k, a.sha, { ciChinh: (args) => { hoi = args; return '[]'; } }), cfg: BAT, pr: 7, slug: 's' });
  assert.deepEqual(hoi.slice(0, 6), ['run', 'list', '--branch', 'main', '--commit', git(a.k, 'rev-parse', 'origin/main')]);
});

test('I-7 nhánh chính ĐỔI TÊN chính tệp PR sửa → «cu», nêu tên cũ (trùng tệp thật, ngoài rủi ro chủ kho đã nhận)', () => {
  const a = kho({ doiTen: true });
  const kq = xetGop({ io: ioCua(a.k, a.sha), cfg: BAT, pr: 7, slug: 's' });
  assert.equal(kq.duong, 'cu', kq.ly_do);
  assert.deepEqual(kq.trung, [PHIEU]);
});
