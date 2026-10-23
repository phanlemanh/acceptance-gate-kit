// Hồ sơ ky-den-gop — chiều đỏ NẰM TRONG bộ kiểm. Mỗi nhát tiêm chạy trên bản sao trọn `dieu-phoi/scripts/` (và
// `feature-loop/scripts/` + SKILL.md cho hạng H) trong thư mục tạm: (a) bản sao CHƯA tiêm xanh trên cùng tệp ca;
// (b) chuỗi gốc có mặt trước khi tiêm, chuỗi tiêm có mặt và chuỗi gốc vắng sau khi tiêm; (c) tệp ca đỏ và ĐÚNG các ca
// được nêu tên đỏ — không chỉ «mã thoát khác 0».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CHEP = [
  'dieu-phoi/scripts',
  'dieu-phoi/.claude-plugin',
  'feature-loop/scripts',
  'feature-loop/skills/feature-loop/SKILL.md',
  'feature-loop/workflows',
  'tests/dieu-phoi/loi/mau-thu.mjs',
  'tests/dieu-phoi/loi/trung-tep.test.mjs',
  'tests/dieu-phoi/loi/gop.test.mjs',
  'tests/dieu-phoi/loi/do-gop.test.mjs',
  'tests/workflows/pr-san-sang.test.mjs',
];
function banSao() {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'kdg-mut-')));
  for (const p of CHEP) fs.cpSync(path.join(GOC, p), path.join(d, p), { recursive: true });
  return d;
}
// Bỏ NODE_TEST_CONTEXT của trình chạy cha: còn biến ấy thì tiến trình con chỉ báo về cha, không in ✔/✖ — mọi lượt
// trông «xanh» mà không ca nào chạy (lớp assertion-không-sống của CLAUDE.md).
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
const chay = (d, tep) => spawnSync(process.execPath, ['--test', '--test-reporter=spec', tep], { cwd: d, encoding: 'utf8', timeout: 120_000, env: ENV });
const doCa = (out) => [...out.matchAll(/^✖ ([A-Z]+-\d+) /gm)].map((m) => m[1]).filter((x, i, a) => a.indexOf(x) === i).sort();

const NHAT = [
  // C — lịch biết tệp
  ['C chonHangKe bỏ hàm trùng', 'dieu-phoi/scripts/lich.mjs', 'const voi = trung ? trung(h).trung : [];', 'const voi = [];', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-11', 'C-12', 'C-2', 'C-3', 'C-7', 'C-8', 'C-9']],
  ['C PR của chính dãy tính là xung đột', 'dieu-phoi/scripts/trung-tep.mjs', '    if (nhanh === nhanhMinh) continue;\n', '', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-4', 'C-8']],
  ['C dò PR nuốt lỗi gh', 'dieu-phoi/scripts/trung-tep.mjs', "loi: `gh pr list lỗi: ${String(e.message ?? e).split('\\n')[0]}`", 'loi: null', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-11', 'C-5', 'C-9']],
  ['C chạm tệp duyệt khi không dò được nhánh', 'dieu-phoi/scripts/yeu-cau.mjs', 'if (nguCanh.nhanhLoi) return', 'if (false) return', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-6']],
  ['C đã ký chưa gộp không tính đang dở', 'dieu-phoi/scripts/trung-tep.mjs', "new Set(['dang', 'ky'])", "new Set(['dang'])", 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-2']],
  ['C gh lỗi thì giao mù dù có bản chụp cũ', 'dieu-phoi/scripts/phat-lich.mjs', 'const hongHan = (nm) => nm.loi && nm.theoNhanh.size === 0 && chupCu?.theo_nhanh && !chupCu.loi;', 'const hongHan = () => false;', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-11', 'C-13']],
  ['C đường xét chạm tệp bỏ qua bản chụp cũ (S4-r1)', 'dieu-phoi/scripts/phat-lich.mjs', 'song: () => quaChup(doc()),', 'song: doc,', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-13']],
  ['C themSau dựng vòng chờ nhau', 'dieu-phoi/scripts/khoa-hang-viec.mjs', ' && !choLai(k)', '', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-12']],
  ['C hang them không ghi sau', 'dieu-phoi/scripts/hang.mjs', '  if (sau.length) hangMoi.sau = sau;\n', '', 'tests/dieu-phoi/loi/trung-tep.test.mjs', ['C-10']],
  // I — gộp không chạy lại CI khi không trùng tệp
  ['I bỏ phép giao tệp', 'dieu-phoi/scripts/gop.mjs', "if (trung.length) return { duong: 'cu'", "if (false) return { duong: 'cu'", 'tests/dieu-phoi/loi/gop.test.mjs', ['I-1', 'I-4', 'I-7']],
  ['I bỏ khoá cấu hình', 'dieu-phoi/scripts/gop.mjs', 'if (cfg.gop_khong_chay_lai_ci !== true)', 'if (false)', 'tests/dieu-phoi/loi/gop.test.mjs', ['I-2']],
  ['I bỏ đòi CI xanh', 'dieu-phoi/scripts/gop.mjs', 'if (!ci.xanh) return', 'if (false) return', 'tests/dieu-phoi/loi/gop.test.mjs', ['I-3']],
  ['I không đọc CI nhánh chính', 'dieu-phoi/scripts/gop.mjs', 'if (doChinh.length) return', 'if (false) return', 'tests/dieu-phoi/loi/gop.test.mjs', ['I-6']],
  ['I đổi tên chỉ tính tên mới', 'dieu-phoi/scripts/gop.mjs', "['diff', '--name-only', '--no-renames', mb, dinh]", "['diff', '--name-only', mb, dinh]", 'tests/dieu-phoi/loi/gop.test.mjs', ['I-7']],
  ['I gộp bằng --auto', 'dieu-phoi/scripts/gop.mjs', "'--match-head-commit', kq.sha]", "'--auto']", 'tests/dieu-phoi/loi/gop.test.mjs', ['I-4']],
  ['I gộp không cần khoá merge', 'dieu-phoi/scripts/gop.mjs', 'if (chu?.phien !== day) throw', 'if (false) throw', 'tests/dieu-phoi/loi/gop.test.mjs', ['I-5']],
  // Thước ký → gộp
  ['Đo gộp không theo lối cha-đầu', 'dieu-phoi/scripts/do-gop.mjs', "['rev-list', '--first-parent', nhanh]", "['rev-list', nhanh]", 'tests/dieu-phoi/loi/do-gop.test.mjs', ['DG-1', 'DG-2', 'DG-4']],
  ['Đo giờ gộp = commit đầu chạm hồ sơ', 'dieu-phoi/scripts/do-gop.mjs', '.find((x) => chaDau.has(x));', ".find((x) => chaDau.has(x)) && dong1(chay(['log', '--reverse', '--first-parent', '--format=%H', nhanh, '--', tep]) ?? '');", 'tests/dieu-phoi/loi/do-gop.test.mjs', ['DG-4']],
  ['Đo ghim lại không lọc theo giờ ký', 'dieu-phoi/scripts/dem.mjs', 'Date.parse(c.luc) > ky', 'true', 'tests/dieu-phoi/loi/do-gop.test.mjs', ['DG-2']],
  ['Đo hàng gộp không mang số đo', 'dieu-phoi/scripts/phat-lich.mjs', '...(io && cfg ? soDoGop(io, cfg, h.slug, DA_THONG) : {})', '', 'tests/dieu-phoi/loi/do-gop.test.mjs', ['DG-2']],
  // H — PR sẵn sàng lúc trình thẻ
  ['H mở PR khi chưa verified', 'feature-loop/scripts/pr-san-sang.mjs', "if (st !== 'verified') throw", 'if (false) throw', 'tests/workflows/pr-san-sang.test.mjs', ['H-3', 'H-5', 'H-6']],
  ['H để PR ở nháp', 'feature-loop/scripts/pr-san-sang.mjs', "if (pr.isDraft) gh('pr', 'ready'", "if (false) gh('pr', 'ready'", 'tests/workflows/pr-san-sang.test.mjs', ['H-1', 'H-2']],
  ['H đẩy khi vật đổi sau lượt chấm', 'feature-loop/scripts/pr-san-sang.mjs', 'if (ngoai.length) throw', 'if (false) throw', 'tests/workflows/pr-san-sang.test.mjs', ['H-3']],
];

const TEP_CA = [...new Set(NHAT.map((n) => n[4]))];
const lanh = banSao();

test('KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca', () => {
  for (const tep of TEP_CA) {
    const r = chay(lanh, tep);
    assert.equal(r.status, 0, `${tep}:\n${r.stdout.slice(-2000)}`);
    assert.match(r.stdout, /^ℹ pass [1-9]\d*$/m, `${tep}: không ca nào chạy`);
    assert.match(r.stdout, /^ℹ fail 0$/m);
  }
});

for (const [ten, tep, goc, tiem, ca, doMong] of NHAT) {
  test(`KDG-M ${ten} → đỏ đúng ${doMong.join(', ')}`, () => {
    const d = banSao();
    const p = path.join(d, tep);
    const t = fs.readFileSync(p, 'utf8');
    assert.ok(t.includes(goc), `chuỗi gốc vắng trong ${tep} — nhát tiêm đã lỗi thời`);
    const moi = t.replace(goc, tiem);
    fs.writeFileSync(p, moi);
    assert.ok(!moi.includes(goc) && (tiem === '' || moi.includes(tiem)), 'tiêm không đổi tệp');
    const r = chay(d, ca);
    assert.notEqual(r.status, 0, `${ten}: tệp ca vẫn xanh`);
    assert.deepEqual(doCa(r.stdout), [...doMong].sort(), r.stdout.slice(-3000));
  });
}
