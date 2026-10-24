// Ca đo của hồ sơ dieu-phoi-on-dinh-r2 (DP8). Tên ca bắt đầu «DP8-». Kho thử do mã sinh (git init + git worktree
// add thật trong thư mục tạm); đợt dựng bằng `mo` thật từ gói khai qua cấu hình; nhịp bộ phát lịch là
// `taoVong`/`motNhip` thật với đồng hồ giả; nhịp sống do hook thật ghi. Đường suy từ vị trí tệp. Mỗi ca đỏ chạy
// CHÍNH hàm đo trên bản sao gói bị tiêm, SAU khi bản lành xanh trên cùng fixture, kiểm bước tiêm đã áp, và ghim
// dấu hiệu của đúng lỗi được tiêm. Ma trận viết sẵn: số assert = số hàng, in ra.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const SLUG = 'dieu-phoi-on-dinh-r2';
const NHANH = `vong/${SLUG}`;
// Mốc so «bản cũ» ghim cứng (gap-probe P0): tag v2.27.0 — bản gói crm đang cài.
const MOC_CU = 'a1e2e0b9c42bfd1c0914b17816cd61bf9e08beb7';

const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp8-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;
const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp8-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiT = (p, t) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, t);
};
const ghiJ = (p, du) => ghiT(p, `${JSON.stringify(du, null, 2)}\n`);
const bam = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
function lenhHook(gocGoi, suKien) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  return hj.hooks[suKien][0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
function hookNhip(dauVao, { cwd, nowMs = null, gocGoi = GOI } = {}) {
  const env = { ...ENV };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'PostToolUse')], { cwd, env, input: JSON.stringify({ cwd, ...dauVao }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
const ioGia = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
const suKien = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : []);
const nhatKy = (dot) => {
  const t = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8');
  return t.slice(t.indexOf('## Nhật ký')).split('\n').filter((d) => d.startsWith('- '));
};
const PHUT = 60_000;
const GIO = Date.parse('2026-10-12T08:00:00Z');

// Bản sao gói bị tiêm: mỗi lần thay phải áp được.
function banSao(thay) {
  const sao = path.join(tam('dp8-sao-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  for (const [tep, cu, moi] of thay) {
    const p = path.join(sao, tep);
    const goc = fs.readFileSync(p, 'utf8');
    const tiem = goc.replace(cu, moi);
    assert.notEqual(tiem, goc, `bước tiêm không áp được: ${tep}`);
    fs.writeFileSync(p, tiem);
  }
  return sao;
}
// Gói ở mốc so ghim (v2.27.0), rút bằng git archive.
let goiCu = null;
function goiMocCu() {
  if (goiCu) return goiCu;
  const dir = tam('dp8-goi-cu-');
  execFileSync('tar', ['-x', '-C', dir], { input: execFileSync('git', ['archive', MOC_CU, 'dieu-phoi'], { cwd: KIT, env: ENV, maxBuffer: 1 << 28 }) });
  goiCu = path.join(dir, 'dieu-phoi');
  return goiCu;
}

// Đợt mở từ gói theo khuôn gói crm r2: worktree dãy là chỗ giữ `/CHUA-CO-WORKTREE/P<n>`; `r2` → mọi hàng mang mã
// và ô cơ hội ở kho chính mang `decision: build`. Thêm `soChip` worktree kiểu chip (tên ngẫu nhiên).
function dotChoGhiDanh({ soDay = 2, r2 = false, gocGoi = GOI, chayPha = true, soChip = soDay } = {}) {
  const kho = tam('dp8-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const ids = Array.from({ length: soDay }, (_, i) => `P${i + 1}`);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  const hang = ids.map((id, i) => ({ ...(r2 ? { ma: `M${i + 1}` } : {}), slug: `hang-${i + 1}`, day: id, uu_tien: 1 }));
  ghiJ(path.join(dir, 'hang-viec.json'), { dot: '', day: ids.map((id) => ({ id, worktree: `/CHUA-CO-WORKTREE/${id}`, link: '' })), hang, ngoai_hang_merge: [] });
  ghiT(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  if (r2) for (const h of hang) ghiT(path.join(kho, '_acceptance', h.slug, 'opportunity.md'), `---\nslug: ${h.slug}\nstage: decided\ndecision: build\n---\n`);
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 's-gs'], { gocGoi });
  assert.equal(mo.ma, 0, mo.err);
  if (chayPha) assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'], { gocGoi }).ma, 0);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  const cha = tam('dp8-chip-');
  const chip = Array.from({ length: soChip }, (_, i) => {
    const w = path.join(cha, `chip-${crypto.randomBytes(3).toString('hex')}`);
    git(kho, 'worktree', 'add', '-q', '-b', `chip-${i + 1}`, w);
    return fs.realpathSync(w);
  });
  return { kho: fs.realpathSync(kho), dot, chip, ids };
}
const worktreeCua = (dot, id) => docJ(path.join(dot, 'hang-viec.json')).day.find((d) => d.id === id).worktree;
// Tên khoá ghi rút từ gói (Ngoài-11 lượt 1: viết tay thì gói đổi tên mà ca vẫn xanh rỗng).
const { TEP_KHOA_HANG_VIEC: TEP_KHOA } = await nap(GOI, 'hang.mjs');

// ---------- DP8-01: phân lớp dòng chuyển (AC-1, E1) ----------
// Mỗi hàng: [tên, tệp (nhãn như kiemChuyen in), mã duy nhất trên dòng, nhóm cần]. Dòng của hàng = dòng chứa
// `scripts/dieu-phoi/<mã>`.
export const MA_TRAN_LOP = [
  ['(01) hook settings', '.claude/settings.json', 'r01', 'phai-sua'],
  ['(02) script package.json', 'package.json', 'r02', 'phai-sua'],
  ['(03) hook git', '.git/hooks/pre-push', 'r03', 'phai-sua'],
  ['(04) README gốc', 'README.md', 'r04', 'phai-sua'],
  ['(05) LUAT.md đợt', '<thư mục đợt>/LUAT.md', 'r05', 'phai-sua'],
  ['(06) eval script sống, hồ sơ đang mở', '_acceptance/mo-a/evals.yaml', 'r06', 'phai-sua'],
  ['(07) eval script sống, hồ sơ đã ký', '_acceptance/ky-a/evals.yaml', 'r07', 'phai-sua'],
  ['(08) eval judgment sống, hồ sơ đang mở', '_acceptance/mo-b/evals.yaml', 'r08', 'phai-sua'],
  ['(09) eval judgment sống, hồ sơ đã ký', '_acceptance/ky-b/evals.yaml', 'r09', 'eval-ngoai-lan-may'],
  ['(10) eval ui-check sống, hồ sơ machine-cleared', '_acceptance/mc-a/evals.yaml', 'r10', 'eval-ngoai-lan-may'],
  ['(11) eval not-run', '_acceptance/ky-c/evals.yaml', 'r11', 'eval-chet'],
  ['(12) executor eval sống gọi', '_acceptance/config.yaml', 'r12', 'phai-sua'],
  ['(13) executor chỉ eval not-run gọi', '_acceptance/config.yaml', 'r13', 'executor-chet'],
  ['(14) executor trong suite_keys', '_acceptance/config.yaml', 'r14', 'phai-sua'],
  ['(15) run-log.jsonl', '_acceptance/ky-a/run-log.jsonl', 'r15', 'ho-so'],
  ['(16) evidence-report.md', '_acceptance/ky-a/evidence-report.md', 'r16', 'ho-so'],
  ['(17) decisions.jsonl', '_acceptance/ky-a/decisions.jsonl', 'r17', 'ho-so'],
  ['(18) rang/x.mjs', '_acceptance/ky-a/rang/x.mjs', 'r18', 'ho-so'],
  ['(19) docs/superpowers', 'docs/superpowers/specs/x.md', 'r19', 'tai-lieu'],
  ['(20) docs/plan', 'docs/plan/y.md', 'r20', 'tai-lieu'],
  ['(21) LO-TRINH.html', 'LO-TRINH.html', 'r21', 'lo-trinh'],
  ['(22) glob khai', 'ke-hoach/cu/z.md', 'r22', 'khai-boi-kho'],
  ['(23) khối khai #id', '_acceptance/mien-a/evals.yaml', 'r23', 'khai-boi-kho'],
  ['(24) chú thích trong executors', '_acceptance/config.yaml', 'r24', 'phai-sua'],
  ['(25) eval sống cùng tệp với khối khai #id', '_acceptance/mien-a/evals.yaml', 'r25', 'phai-sua'],
  ['(26) executor gọi từ eval viết ở cột 0', '_acceptance/config.yaml', 'r26', 'phai-sua'],
  ['(27) khối not-run viết ở cột 0', '_acceptance/cot-0/evals.yaml', 'r27', 'eval-chet'],
];
const cu = (ma) => `scripts/dieu-phoi/${ma}.mjs`;
const hopDong = (st) => `---\nslug: x\nstatus: ${st}\n---\n`;
// Trạng thái «đã thông» lấy từ hằng của gói (một nguồn với bộ phân lớp), không viết cứng chữ trạng thái.
const { DA_THONG } = await nap(GOI, 'phat-lich.mjs');
const [DA_KY, MAY_THONG] = DA_THONG;
const khoiEvalYaml = (k) => `  - id: ${k.id}\n    criterion: AC-1\n    executor: ${k.executor}\n${k.cmd ? `    cmd: ${k.cmd}\n` : ''}${k.status ? `    status: ${k.status}\n` : ''}    expected: "exit 0; ${k.dong}"\n`;
// Bốn dạng viết cùng một khai báo (DP8-12): khối · một dòng · một dòng kèm chú thích · khối kèm chú thích sau mục.
export const DANG_KHAI = {
  khoi: `dieu_phoi:\n  lich_su:\n    - "ke-hoach/cu/**"\n    - _acceptance/mien-a/evals.yaml#E7\n`,
  'mot-dong': `dieu_phoi:\n  lich_su: ["ke-hoach/cu/**", _acceptance/mien-a/evals.yaml#E7]\n`,
  'mot-dong-chu-thich': `dieu_phoi:\n  lich_su: [ "ke-hoach/cu/**" , _acceptance/mien-a/evals.yaml#E7 ]  # khai 12/10\n`,
  'khoi-chu-thich': `dieu_phoi:\n  lich_su:\n    - "ke-hoach/cu/**"   # đợt cũ\n    - _acceptance/mien-a/evals.yaml#E7  # tệp mẫu\n`,
};
function cauHinh({ khai = true, dang = 'khoi' } = {}) {
  return `schema_version: 1\n${khai ? DANG_KHAI[dang] : ''}feature_loop:\n  suite_keys:\n    - executors.test.e_suite\nexecutors:\n  test:\n    # ghi chú ${cu('r24')}\n    e_song: "node ${cu('r12')}"\n    e_chet: "node ${cu('r13')}"\n    e_suite: "node ${cu('r14')}"\n    e_cot0: "node ${cu('r26')}"\n`;
}
function khoPhanLop() {
  const kho = tam('dp8-lop-');
  git(kho, 'init', '-q', '-b', 'main');
  const g = (rel, t) => ghiT(path.join(kho, rel), t);
  g('.claude/settings.json', `${JSON.stringify({ hooks: { PostToolUse: [{ hooks: [{ type: 'command', command: `node "$CLAUDE_PROJECT_DIR/${cu('r01')}"` }] }] } }, null, 2)}\n`);
  g('package.json', `{\n  "scripts": {\n    "x": "node ${cu('r02')}"\n  }\n}\n`);
  g('README.md', `# Kho\n\nChạy node ${cu('r04')}\n`);
  g('_acceptance/config.yaml', cauHinh());
  const hoSo = (slug, st, khoi) => {
    g(`_acceptance/${slug}/contract.md`, hopDong(st));
    g(`_acceptance/${slug}/evals.yaml`, `schema_version: 1\nevals:\n${khoi.map(khoiEvalYaml).join('\n')}`);
  };
  // (06) khối đặt `criterion` trước `id` (Review Focus 2).
  g('_acceptance/mo-a/contract.md', hopDong('implemented'));
  g('_acceptance/mo-a/evals.yaml', `schema_version: 1\nevals:\n  - criterion: AC-1\n    id: E1\n    executor: script\n    cmd: config:executors.test.e_song\n    expected: "exit 0; ${cu('r06')}"\n`);
  hoSo('ky-a', DA_KY, [{ id: 'E1', executor: 'script', dong: cu('r07') }]);
  hoSo('mo-b', 'approved', [{ id: 'E1', executor: 'judgment', dong: cu('r08') }]);
  hoSo('ky-b', DA_KY, [{ id: 'E1', executor: 'judgment', dong: cu('r09') }]);
  hoSo('mc-a', MAY_THONG, [{ id: 'E1', executor: 'ui-check', dong: cu('r10') }]);
  hoSo('ky-c', DA_KY, [{ id: 'E1', executor: 'script', cmd: 'config:executors.test.e_chet', status: 'not-run', dong: cu('r11') }]);
  hoSo('mien-a', 'implemented', [{ id: 'E6', executor: 'script', dong: cu('r25') }, { id: 'E7', executor: 'script', dong: cu('r23') }]);
  // (26), (27): evals.yaml viết mục danh sách ở cột 0 (YAML hợp lệ, có ở kho tiêu thụ thật).
  g('_acceptance/cot-0/contract.md', hopDong('implemented'));
  g('_acceptance/cot-0/evals.yaml', `schema_version: 1\nevals:\n- id: E1\n  executor: script\n  cmd: config:executors.test.e_cot0\n  expected: "exit 0"\n- id: E2\n  executor: script\n  status: not-run\n  expected: "exit 0; ${cu('r27')}"\n`);
  g('_acceptance/ky-a/run-log.jsonl', `{"kind":"x","cmd":"node ${cu('r15')}"}\n`);
  g('_acceptance/ky-a/evidence-report.md', `# Báo cáo\n\n${cu('r16')}\n`);
  g('_acceptance/ky-a/decisions.jsonl', `{"id":"d-1","decision":"${cu('r17')}"}\n`);
  g('_acceptance/ky-a/rang/x.mjs', `import '../../../${cu('r18')}';\n`);
  g('docs/superpowers/specs/x.md', `${cu('r19')}\n`);
  g('docs/plan/y.md', `${cu('r20')}\n`);
  g('LO-TRINH.html', `<p>${cu('r21')}</p>\n`);
  g('ke-hoach/cu/z.md', `${cu('r22')}\n`);
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'kho');
  // Không theo dõi: hook git và thư mục đợt đang chạy.
  g('.git/hooks/pre-push', `#!/bin/sh\nnode ${cu('r03')}\n`);
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-thu');
  ghiT(path.join(dot, 'LUAT.md'), `# Luật\n\n- chạy ${cu('r05')}\n`);
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return kho;
}
// `<tệp>:<dòng>` của một hàng — dòng chứa `scripts/dieu-phoi/<mã>`.
function dongCua(kho, tep, ma) {
  const abs = tep.startsWith('<thư mục đợt>/') ? path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai', tep.slice('<thư mục đợt>/'.length)) : path.join(kho, tep);
  const i = fs.readFileSync(abs, 'utf8').split('\n').findIndex((d) => d.includes(cu(ma)));
  assert.ok(i >= 0, `fixture: ${tep} thiếu ${ma}`);
  return `${tep}:${i + 1}`;
}
export async function kiemPhanLop(gocGoi, kho, maTran = MA_TRAN_LOP) {
  const { kiemChuyen, phanLopChuyen } = await nap(gocGoi, 'kiem-chuyen.mjs');
  const kq = phanLopChuyen(kho);
  const nhom = new Map([...kq.phai_sua.map((d) => [d, 'phai-sua']), ...kq.lich_su.map((x) => [x.dong, x.lop])]);
  const loi = [];
  for (const [ten, tep, ma, can] of maTran) {
    const co = nhom.get(dongCua(kho, tep, ma)) ?? '(vắng)';
    if (co !== can) loi.push(`${ten}: ${co}, cần ${can}`);
  }
  const hop = [...kq.phai_sua, ...kq.lich_su.map((x) => x.dong)].sort();
  const goc = [...kiemChuyen(kho)].sort();
  if (JSON.stringify(hop) !== JSON.stringify(goc)) loi.push(`hợp hai nhóm ≠ kiemChuyen (${hop.length} ≠ ${goc.length})`);
  return { loi, kq, soHang: maTran.length, soDong: goc.length };
}

test('DP8-01 phan-lop', async () => {
  const kho = khoPhanLop();
  const r = await kiemPhanLop(GOI, kho);
  console.log(`  số hàng ma trận: ${r.soHang} · dòng chuyển: ${r.soDong} · phải sửa ${r.kq.phai_sua.length} · lịch sử ${r.kq.lich_su.length}`);
  assert.equal(r.soDong, MA_TRAN_LOP.length, 'mỗi hàng đúng một dòng chuyển');
  assert.deepEqual(r.loi, []);
});

test('DP8-01 khong-khai', async () => {
  const kho = khoPhanLop();
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), cauHinh({ khai: false }));
  const maTran = MA_TRAN_LOP.map((h) => (h[3] === 'khai-boi-kho' ? [h[0], h[1], h[2], 'phai-sua'] : h));
  const r = await kiemPhanLop(GOI, kho, maTran);
  assert.deepEqual(r.loi, []);
});

test('DP8-01-do bo-eval-chet', async () => {
  const kho = khoPhanLop();
  assert.deepEqual((await kiemPhanLop(GOI, kho)).loi, [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/kiem-chuyen.mjs', "if (khoi?.status === 'not-run') return 'eval-chet';", '']]);
  const { loi } = await kiemPhanLop(sao, kho);
  assert.ok(loi.some((l) => l.startsWith('(11) eval not-run:')), `phải nêu hàng eval not-run: ${loi.join(' | ')}`);
});

test('DP8-01-do ho-so-nuot-eval', async () => {
  const kho = khoPhanLop();
  assert.deepEqual((await kiemPhanLop(GOI, kho)).loi, [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/kiem-chuyen.mjs', "if (hs && hs[2] !== 'evals.yaml') return 'ho-so';", "if (hs) return 'ho-so';"]]);
  const { loi } = await kiemPhanLop(sao, kho);
  assert.ok(loi.some((l) => l.startsWith('(06) eval script sống, hồ sơ đang mở: ho-so')), `phải nêu hàng eval sống của hồ sơ đang mở: ${loi.join(' | ')}`);
});

// ---------- DP8-12: bộ đọc khai và evals.yaml đọc đúng mọi dạng viết hợp lệ (AC-12, E14) ----------
test('DP8-12 dang-khai', async () => {
  const ra = [];
  for (const dang of Object.keys(DANG_KHAI)) {
    const kho = khoPhanLop();
    ghiT(path.join(kho, '_acceptance', 'config.yaml'), cauHinh({ dang }));
    const { loi } = await kiemPhanLop(GOI, kho);
    ra.push(`${dang}=${loi.length}`);
    assert.deepEqual(loi, [], `dạng ${dang}`);
  }
  console.log(`  số dạng khai: ${ra.length} · lỗi theo dạng: ${ra.join(' · ')}`);
  assert.equal(ra.length, 4);
});

export const MA_TRAN_DANH_SACH = [
  ['một dòng có #id', 'lich_su: [_acceptance/a/evals.yaml#E7, docs/old/**]', ['_acceptance/a/evals.yaml#E7', 'docs/old/**']],
  ['một dòng kèm chú thích', 'lich_su: [ "x/**" , y/evals.yaml#E1 ]  # ghi chú', ['x/**', 'y/evals.yaml#E1']],
  ['glob có ngoặc nhọn', 'lich_su: ["k/{cu,cu2}/**", z#E2]', ['k/{cu,cu2}/**', 'z#E2']],
  ['khối kèm chú thích', 'lich_su:\n    - "a/**"   # cũ\n    - b/evals.yaml#E7', ['a/**', 'b/evals.yaml#E7']],
  ['nháy giữ #', 'lich_su: ["c #d", e]', ['c #d', 'e']],
];
export async function kiemDanhSach(gocGoi = GOI) {
  const { docDanhSachKhoa } = await nap(gocGoi, 'kiem-chuyen.mjs');
  return MA_TRAN_DANH_SACH.flatMap(([ten, dong, can]) => {
    const co = docDanhSachKhoa(`dieu_phoi:\n  ${dong}\n`, 'dieu_phoi', 'lich_su');
    return JSON.stringify(co) === JSON.stringify(can) ? [] : [`${ten}: ${JSON.stringify(co)}, cần ${JSON.stringify(can)}`];
  });
}

test('DP8-12 doc-danh-sach', async () => {
  console.log(`  số hàng: ${MA_TRAN_DANH_SACH.length}`);
  assert.deepEqual(await kiemDanhSach(), []);
});

test('DP8-12-do chu-thich-cat-id', async () => {
  const kho = khoPhanLop();
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), cauHinh({ dang: 'mot-dong' }));
  assert.deepEqual((await kiemPhanLop(GOI, kho)).loi, [], 'đối chứng dương: bản lành, dạng một dòng');
  const sao = banSao([['scripts/kiem-chuyen.mjs', "if (giaTriDong.startsWith('[')) return tachDanhSachDong(giaTriDong).filter(Boolean);", "if (giaTriDong.startsWith('[')) return giaTriDong.replace(/#.*$/, '').replace(/^\\[|\\]$/g, '').split(',').map(giaTri).filter(Boolean);"]]);
  const { loi } = await kiemPhanLop(sao, kho);
  assert.ok(loi.includes('(25) eval sống cùng tệp với khối khai #id: khai-boi-kho, cần phai-sua'), `phải nêu hàng (25) bị miễn cả tệp: ${loi.join(' | ')}`);
});

test('DP8-12-do cot-0', async () => {
  const kho = khoPhanLop();
  assert.deepEqual((await kiemPhanLop(GOI, kho)).loi, [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/kiem-chuyen.mjs', 'if (thut(d) === 0 && !m) break;', 'if (thut(d) === 0) break;']]);
  const { loi } = await kiemPhanLop(sao, kho);
  assert.ok(loi.includes('(26) executor gọi từ eval viết ở cột 0: executor-chet, cần phai-sua'), `phải nêu hàng (26): ${loi.join(' | ')}`);
});

// ---------- DP8-02: import tương đối (AC-2, E2) ----------
const DEM = [
  ["import { a } from '../dieu-phoi/dot.mjs';", true],
  ["const b = await import('../dieu-phoi/hook-nhip.mjs');", true],
  ["const c = require('../dieu-phoi/x.cjs');", true],
  ["import '../dieu-phoi/y.mjs';", true],
  ["export { z } from '../dieu-phoi/z.mjs';", true],
  ["import d from '../dieu-phoi';", true],
  ['import {', false],
  ['  e,', false],
  ["} from '../dieu-phoi/e.mjs';", true],
  ["import k from '../dieu-phoi-khac/x.mjs';", false],
  ["import l from '/opt/goi/dieu-phoi/dot.mjs';", false],
  ["import m from '../../scripts/dieu-phoi/dot.mjs';", true],
];
function khoImport() {
  const kho = tam('dp8-imp-');
  git(kho, 'init', '-q', '-b', 'main');
  const g = (rel, t) => ghiT(path.join(kho, rel), t);
  g('scripts/kiem-cheo/dem.mjs', `${DEM.map(([d]) => d).join('\n')}\n`);
  g('scripts/kiem-cheo/test/khoa.test.mjs', "import { kiemDon } from '../../dieu-phoi/hinh-dang.mjs';\n");
  g('scripts/goc.mjs', "import x from './dieu-phoi/dot.mjs';\n");
  g('tools/a.mjs', "import y from './dieu-phoi/x.mjs';\n");
  g('ghi-chu.md', 'xem ../dieu-phoi/dot.mjs\n');
  g('scripts/dieu-phoi/dot.mjs', "import './hinh-dang.mjs';\n");
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'kho');
  return kho;
}
const CAN_BAT = [
  ...DEM.flatMap(([, bat], i) => (bat ? [`scripts/kiem-cheo/dem.mjs:${i + 1}`] : [])),
  'scripts/kiem-cheo/test/khoa.test.mjs:1',
  'scripts/goc.mjs:1',
];
export async function kiemImport(gocGoi, kho) {
  const { kiemChuyen, phanLopChuyen } = await nap(gocGoi, 'kiem-chuyen.mjs');
  const ds = kiemChuyen(kho);
  const loi = [];
  for (const d of CAN_BAT) if (!ds.includes(d)) loi.push(`thiếu ${d}`);
  for (const d of ds) if (!CAN_BAT.includes(d)) loi.push(`thừa ${d}`);
  const lap = ds.filter((d) => d === 'scripts/kiem-cheo/dem.mjs:12').length;
  if (lap > 1) loi.push(`dem.mjs:12 lặp ${lap} lần`);
  const phai = new Set(phanLopChuyen(kho).phai_sua);
  for (const d of CAN_BAT) if (ds.includes(d) && !phai.has(d)) loi.push(`${d} không phải phải sửa`);
  return loi;
}

test('DP8-02 import-tuong-doi', async () => {
  const kho = khoImport();
  console.log(`  phải bắt ${CAN_BAT.length} dòng · phải im ${DEM.filter(([, b]) => !b).length + 3} dòng`);
  assert.deepEqual(await kiemImport(GOI, kho), []);
});

test('DP8-02-do bo-quet-import', async () => {
  const kho = khoImport();
  assert.deepEqual(await kiemImport(GOI, kho), [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/kiem-chuyen.mjs', 'if (!trung && ma) {', 'if (false) {']]);
  const loi = await kiemImport(sao, kho);
  assert.ok(loi.some((l) => l.startsWith('thiếu scripts/kiem-cheo/dem.mjs')), `phải nêu dem.mjs thiếu: ${loi.join(' | ')}`);
});

// ---------- DP8-03: CLI `xem --kiem-chuyen` (AC-3, E3) ----------
const LOP = ['khai-boi-kho', 'ho-so', 'eval-chet', 'eval-ngoai-lan-may', 'executor-chet', 'tai-lieu', 'lo-trinh'];
function goPhaiSua(kho, phaiSua) {
  for (const d of phaiSua) {
    const c = d.lastIndexOf(':');
    const tep = d.slice(0, c);
    const abs = tep.startsWith('<thư mục đợt>/') ? path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai', tep.slice('<thư mục đợt>/'.length)) : path.join(kho, tep);
    const dong = fs.readFileSync(abs, 'utf8').split('\n');
    dong[Number(d.slice(c + 1)) - 1] = dong[Number(d.slice(c + 1)) - 1].split('scripts/dieu-phoi/').join('scripts/goi-moi/');
    fs.writeFileSync(abs, dong.join('\n'));
  }
}
export async function kiemCli(gocGoi) {
  const loi = [];
  const kho = khoPhanLop();
  const { phanLopChuyen } = await nap(GOI, 'kiem-chuyen.mjs');
  const kq = phanLopChuyen(kho);
  const xem = (chiTiet) => chayCli(kho, ['xem', '--kiem-chuyen', ...(chiTiet ? ['--chi-tiet'] : [])], { gocGoi });
  const dongTong = (out, i) => {
    const m = /^kiem-chuyen: lich-su (\d+) dòng — (.+) — để nguyên/.exec(out[i] ?? '');
    if (!m) return loi.push(`thiếu dòng tổng ở dòng ${i + 1}: ${out[i]}`);
    if (Number(m[1]) !== kq.lich_su.length) loi.push(`dòng tổng n=${m[1]} ≠ ${kq.lich_su.length}`);
    const cap = m[2].split(' · ').map((x) => x.split(' '));
    if (cap.reduce((s, [, k]) => s + Number(k), 0) !== Number(m[1])) loi.push('tổng các k ≠ n');
    const thuTu = cap.map(([l]) => l);
    if (JSON.stringify(thuTu) !== JSON.stringify(LOP.filter((l) => thuTu.includes(l)))) loi.push(`lớp sai thứ tự: ${thuTu}`);
  };
  let r = xem(false);
  let out = r.out.trim().split('\n');
  if (JSON.stringify(out.slice(0, kq.phai_sua.length)) !== JSON.stringify(kq.phai_sua.map((d) => `kiem-chuyen: ${d}`))) loi.push('dòng phải sửa lệch phanLopChuyen');
  dongTong(out, kq.phai_sua.length);
  if (out.length !== kq.phai_sua.length + 1) loi.push(`số dòng ${out.length} ≠ ${kq.phai_sua.length + 1}`);
  if (r.ma !== 1) loi.push(`thoát ${r.ma} khi còn phải sửa`);
  r = xem(true);
  out = r.out.trim().split('\n');
  const chi = out.slice(kq.phai_sua.length + 1);
  if (JSON.stringify(chi) !== JSON.stringify(kq.lich_su.map((x) => `kiem-chuyen lich-su: ${x.dong} · ${x.lop}`))) loi.push('--chi-tiet lệch lich_su');
  goPhaiSua(kho, kq.phai_sua);
  r = xem(false);
  out = r.out.trim().split('\n');
  if (out[0] !== 'kiem-chuyen: sach') loi.push(`sau khi gỡ: dòng đầu ${out[0]}`);
  dongTong(out, 1);
  if (r.ma !== 0) loi.push('thoát 1 khi chỉ còn lịch sử');
  const rong = tam('dp8-rong-');
  git(rong, 'init', '-q', '-b', 'main');
  r = chayCli(rong, ['xem', '--kiem-chuyen'], { gocGoi });
  if (r.out !== 'kiem-chuyen: sach\n' || r.ma !== 0) loi.push(`kho không dòng chuyển: ${JSON.stringify(r.out)} thoát ${r.ma}`);
  return loi;
}

test('DP8-03 cli', async () => {
  assert.deepEqual(await kiemCli(GOI), []);
});

test('DP8-03-do ma-thoat-tren-moi-dong', async () => {
  assert.deepEqual(await kiemCli(GOI), [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/dieu-phoi.mjs', 'process.exit(kq.phai_sua.length ? 1 : 0);', 'process.exit(kq.phai_sua.length + kq.lich_su.length ? 1 : 0);']]);
  assert.ok((await kiemCli(sao)).includes('thoát 1 khi chỉ còn lịch sử'));
});

// ---------- DP8-05: ghi danh worktree (AC-5, E5) ----------
test('DP8-05 ghi-danh', () => {
  const { dot, chip } = dotChoGhiDanh();
  const [w1] = chip;
  const truocTho = JSON.parse(chayCli(w1, ['tho', '--json']).out);
  assert.deepEqual([truocTho.trong_dot, truocTho.ly_do], [false, 'khong-phai-tho'], 'đối chứng: chưa ghi danh thì không phải thợ');
  const truocXin = chayCli(w1, ['xin', 's4']);
  assert.equal(truocXin.ma, 1);
  assert.match(truocXin.err, /không thuộc dãy nào/);
  assert.ok(fs.existsSync(path.join(dot, 'cho-ghi-danh', 'P1.json')), 'mo viết dấu chưa ghi danh');
  const hvTruoc = docJ(path.join(dot, 'hang-viec.json'));
  const nkTruoc = nhatKy(dot).length;
  const skTruoc = suKien(dot).length;
  fs.mkdirSync(path.join(w1, 'con'), { recursive: true });
  const r = chayCli(path.join(w1, 'con'), ['ghi-danh', 'P1']);
  assert.equal(r.ma, 0, r.err);
  assert.equal(r.out.trim().split('\n')[0], `ghi-danh: P1 → ${w1}`);
  const hvSau = docJ(path.join(dot, 'hang-viec.json'));
  assert.equal(hvSau.day.find((d) => d.id === 'P1').worktree, w1);
  assert.deepEqual({ ...hvSau, day: hvSau.day.map((d) => (d.id === 'P1' ? { ...d, worktree: '/CHUA-CO-WORKTREE/P1' } : d)) }, hvTruoc, 'chỉ day[P1].worktree đổi');
  assert.equal(nhatKy(dot).length, nkTruoc + 1);
  const moi = suKien(dot).slice(skTruoc);
  assert.equal(moi.length, 1);
  assert.deepEqual([moi[0].loai, moi[0].kieu, moi[0].day, moi[0].worktree], ['doi-ke-hoach', 'ghi-danh', 'P1', w1]);
  assert.ok(!fs.existsSync(path.join(dot, 'cho-ghi-danh', 'P1.json')));
  assert.ok(fs.existsSync(path.join(dot, 'cho-ghi-danh', 'P2.json')));
  const tho = JSON.parse(chayCli(w1, ['tho', '--json']).out);
  assert.deepEqual([tho.trong_dot, tho.day], [true, 'P1']);
  assert.equal(chayCli(w1, ['xin', 's4']).ma, 0);
  assert.equal(docJ(path.join(dot, 'xin', 'P1-s4.json')).worktree, w1);
  hookNhip({ session_id: 's-p1' }, { cwd: w1 });
  assert.equal(docJ(path.join(dot, 'song', 's-p1.json')).day, 'P1');
  const lai = chayCli(w1, ['ghi-danh', 'P1']);
  assert.equal(lai.ma, 0);
  assert.match(lai.out, /đã ghi danh/);
  assert.equal(suKien(dot).filter((e) => e.kieu === 'ghi-danh').length, 1, 'chạy lại không thêm sự kiện');
});

// ---------- DP8-06: từ chối + bất biến «mời chip ⇔ ghi danh được» (AC-6, E6) ----------
test('DP8-06 tu-choi', () => {
  const hang = [];
  const thu = (ten, cwd, doiSo, mau, dot) => {
    const pHv = dot ? path.join(dot, 'hang-viec.json') : null;
    const truoc = pHv ? [bam(pHv), suKien(dot).length] : null;
    const r = chayCli(cwd, doiSo);
    hang.push(ten);
    console.log(`  ${ten}: thoát ${r.ma} · ${r.err.trim()}`);
    assert.equal(r.ma, 1, ten);
    assert.match(r.err, mau, ten);
    if (pHv) assert.deepEqual([bam(pHv), suKien(dot).length], truoc, `${ten}: không ghi byte nào`);
  };
  const a = dotChoGhiDanh();
  thu('(a) dãy không có', a.chip[0], ['ghi-danh', 'P9'], /không có dãy P9 trong đợt/, a.dot);
  const b = dotChoGhiDanh();
  assert.equal(chayCli(b.chip[1], ['ghi-danh', 'P2']).ma, 0);
  thu('(b) W của dãy khác', b.chip[1], ['ghi-danh', 'P1'], /đã là worktree của dãy P2/, b.dot);
  const c = dotChoGhiDanh();
  thu('(c) gốc kho chính', c.kho, ['ghi-danh', 'P1'], /là gốc kho chính/, c.dot);
  const kho = tam('dp8-khong-dot-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const w = path.join(tam('dp8-w-'), 'w');
  git(kho, 'worktree', 'add', '-q', '-b', 'w', w);
  thu('(d) không có đợt', w, ['ghi-danh', 'P1'], /không có đợt nào đang chạy/, null);
  assert.ok(!fs.existsSync(path.join(kho, '.acceptance-runs')), '(d) không tạo thư mục đợt');
  assert.equal(hang.length, 4);
});

const BAN = ['khong', 'nhan-giang-lai', 'cho-nguoi'];
const ENV_GIO = { DIEU_PHOI_NOW_MS: String(GIO) };
export const MA_TRAN_SONG = [
  ['nhịp 3′', ({ cuW }) => hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 3 * PHUT })],
  ['nhịp 9′', ({ cuW }) => hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 9 * PHUT })],
  ['nhịp 11′', ({ cuW }) => hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 11 * PHUT })],
  ['nhịp 25′', ({ cuW }) => hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 25 * PHUT })],
  ['giữ s4 trong hạn, phiên chết', ({ dot, cuW }) => ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'hang-1', loai: 's4', worktree: cuW, cap_luc: new Date(GIO - 30 * PHUT).toISOString(), han_thue_den: new Date(GIO + 60 * PHUT).toISOString() })],
  ['còn đơn, phiên chết', ({ dot, cuW }) => {
    hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 25 * PHUT });
    ghiJ(path.join(dot, 'xin', 'P1-s4.json'), { phien: 'P1', slug: 'hang-1', loai: 's4', luc: new Date(GIO - 40 * PHUT).toISOString(), worktree: cuW });
  }],
  ['cho-nguoi/P1.json', ({ dot, cuW }) => {
    hookNhip({ session_id: 's-p1' }, { cwd: cuW, nowMs: GIO - 25 * PHUT });
    ghiJ(path.join(dot, 'cho-nguoi', 'P1.json'), { phien: 'P1', loai: 'idle_prompt', tin: 'chờ', luc: new Date(GIO - 20 * PHUT).toISOString() });
  }],
  ['worktree cũ đã xoá', ({ cuW }) => fs.rmSync(cuW, { recursive: true, force: true })],
];
export function kiemBatBien(gocGoi = GOI) {
  const loi = [];
  const ra = [];
  for (const [ten, dung] of MA_TRAN_SONG) {
    const { kho, dot, chip } = dotChoGhiDanh({ soChip: 2, gocGoi });
    const [cuW, moiW] = chip;
    assert.equal(chayCli(cuW, ['ghi-danh', 'P1'], { gocGoi }).ma, 0, 'fixture: P1 ghi danh worktree cũ');
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO, gocGoi });
    dung({ dot, cuW });
    const donTruoc = fs.existsSync(path.join(dot, 'xin', 'P1-s4.json')) ? docJ(path.join(dot, 'xin', 'P1-s4.json')) : null;
    // chan-doan (chỉ đọc) đọc cùng keHoachDay với tiep-tuc; tiep-tuc ở pha dang-chay chạy bộ phát lịch thật (nền),
    // nó cấp đơn còn chờ theo đồng hồ thật và làm hàng «còn đơn» đổi trạng thái giữa hai lệnh.
    const cd = chayCli(kho, ['chan-doan', '--json', '--chi-tiet'], { gocGoi, env: ENV_GIO });
    assert.equal(cd.ma, 0, cd.err);
    const hanh = JSON.parse(cd.out).find((m) => m.muc === 'day:P1').chi_tiet.hanh_dong;
    const r = chayCli(moiW, ['ghi-danh', 'P1'], { gocGoi, env: ENV_GIO });
    ra.push(`${ten}=${hanh}/${r.ma}`);
    if (BAN.includes(hanh) !== (r.ma === 1)) {
      loi.push(`${ten}: lệch bất biến (${hanh}, thoát ${r.ma})`);
      continue;
    }
    if (r.ma !== 0) continue;
    if (worktreeCua(dot, 'P1') !== moiW) loi.push(`${ten}: worktree không đổi`);
    const sk = suKien(dot).filter((e) => e.kieu === 'ghi-danh').at(-1);
    if (sk?.thay !== cuW) loi.push(`${ten}: sự kiện thiếu thay`);
    if (fs.existsSync(cuW) && !r.out.includes('nhánh cũ còn checkout')) loi.push(`${ten}: không nhắc nhánh cũ`);
    if (donTruoc) {
      const don = docJ(path.join(dot, 'xin', 'P1-s4.json'));
      if (don.worktree !== moiW || don.luc !== donTruoc.luc) loi.push(`${ten}: đơn không đổi sang worktree mới giữ giờ xin`);
    }
  }
  return { loi, ra };
}

test('DP8-06 bat-bien', () => {
  const { loi, ra } = kiemBatBien();
  console.log(`  số hàng: ${ra.length} · ${ra.join(' · ')}`);
  assert.equal(ra.length, MA_TRAN_SONG.length);
  assert.deepEqual(loi, []);
});

test('DP8-06-do luon-nhan', () => {
  assert.deepEqual(kiemBatBien().loi, [], 'đối chứng dương: bản lành trên cùng ma trận');
  const sao = banSao([['scripts/hang.mjs', 'if (kh && HANH_DONG_CON_PHIEN.includes(kh.hanh_dong)) throw', 'if (false) throw']]);
  const { loi } = kiemBatBien(sao);
  assert.ok(loi.includes('nhịp 3′: lệch bất biến (khong, thoát 0)'), `phải nêu hàng nhịp 3′ bị đè: ${loi.join(' | ')}`);
});

// ---------- DP8-07: dãy chưa ghi danh được mời chip (AC-7, E7) ----------
export async function kiemChoGhiDanh(gocGoi = GOI) {
  const loi = [];
  const { kho, dot, chip } = dotChoGhiDanh({ r2: true, gocGoi });
  hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO, gocGoi });
  const { motNhip } = await nap(gocGoi, 'phat-lich.mjs');
  await motNhip(dot, ioGia(GIO));
  assert.equal(docJ(path.join(dot, 'tiep', 'P1.json')).hang, 'hang-1', 'đối chứng đầu vào: hàng đã quyết build được giao');
  const cd = JSON.parse(chayCli(kho, ['chan-doan', '--json', '--chi-tiet'], { gocGoi, env: ENV_GIO }).out);
  const tt = JSON.parse(chayCli(kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env: ENV_GIO }).out);
  chayCli(kho, ['dung'], { gocGoi }); // tiep-tuc vừa chạy bộ phát lịch thật (nền) — dừng ngay kẻo rò tiến trình
  for (const id of ['P1', 'P2']) {
    const m = cd.find((x) => x.muc === `day:${id}`);
    const k = tt.ke_hoach.find((x) => x.day === id);
    if (m?.chi_tiet?.hanh_dong !== 'mo-chip') loi.push(`day:${id} ${m?.chi_tiet?.hanh_dong} — dãy chưa ghi danh không được mời chip`);
    if (k?.hanh_dong !== m?.chi_tiet?.hanh_dong) loi.push(`day:${id}: tiep-tuc ${k?.hanh_dong} ≠ chan-doan ${m?.chi_tiet?.hanh_dong}`);
    if (m?.trang_thai !== 'du') loi.push(`day:${id} trạng thái ${m?.trang_thai}`);
    const gd = m?.chi_tiet?.ghi_danh ?? '';
    if (!gd.includes(`node ${path.join(dot, 'loi', 'dieu-phoi.mjs')} ghi-danh ${id}`)) loi.push(`day:${id}: ghi_danh thiếu lệnh ghi-danh`);
    if (!gd.includes('worktree chưa ghi danh')) loi.push(`day:${id}: ghi_danh thiếu «worktree chưa ghi danh»`);
  }
  assert.equal(chayCli(chip[0], ['ghi-danh', 'P1'], { gocGoi }).ma, 0);
  hookNhip({ session_id: 's-p1' }, { cwd: chip[0], nowMs: GIO, gocGoi });
  const sau = JSON.parse(chayCli(kho, ['chan-doan', '--json', '--chi-tiet'], { gocGoi, env: ENV_GIO }).out).find((x) => x.muc === 'day:P1');
  if (sau?.chi_tiet?.hanh_dong !== 'khong') loi.push(`sau ghi danh: day:P1 ${sau?.chi_tiet?.hanh_dong}`);
  return loi;
}

test('DP8-07 cho-ghi-danh', async () => {
  assert.deepEqual(await kiemChoGhiDanh(), []);
});

test('DP8-07-do bo-dau', async () => {
  assert.deepEqual(await kiemChoGhiDanh(), [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/tiep-tuc.mjs', "const chuaGhiDanh = !laThuMuc(d.worktree) && fs.existsSync(path.join(thuMuc, THU_MUC_CHO_GHI_DANH, `${d.id}.json`));", 'const chuaGhiDanh = false;']]);
  const loi = await kiemChoGhiDanh(sao);
  assert.ok(loi.includes('day:P1 worktree-mat — dãy chưa ghi danh không được mời chip'), loi.join(' | '));
});

export const MA_TRAN_DAU = [
  ['có dấu · có hàng', 'mo-chip', {}, ({ kho }) => hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO })],
  ['có dấu · nghỉ', 'khong-hang', {}, ({ kho }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    assert.equal(chayCli(kho, ['hang', 'nghi', 'P1']).ma, 0);
  }],
  ['có dấu · chưa song/', 'chua-biet', {}, () => {}],
  ['có dấu · cho-nguoi', 'cho-nguoi', {}, ({ kho, dot }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    ghiJ(path.join(dot, 'cho-nguoi', 'P1.json'), { phien: 'P1', loai: 'idle_prompt', tin: 'chờ', luc: new Date(GIO).toISOString() });
  }],
  ['có dấu · khoá ghi cho P1', 'khong', {}, ({ kho, dot }) => {
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
    ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', worktree: '/CHUA-CO-WORKTREE/P1', cap_luc: new Date(GIO - PHUT).toISOString() });
  }],
  ['không dấu (gói v2.27.0)', 'worktree-mat', { cu: true }, ({ kho }) => hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO })],
];

test('DP8-07 ma-tran-dau', async () => {
  const { HANH_DONG } = await nap(GOI, 'tiep-tuc.mjs');
  const loi = [];
  const toi = new Set();
  for (const [ten, can, tuy, dung] of MA_TRAN_DAU) {
    const ctx = dotChoGhiDanh({ gocGoi: tuy.cu ? goiMocCu() : GOI });
    const coDau = fs.existsSync(path.join(ctx.dot, 'cho-ghi-danh', 'P1.json'));
    if (coDau === Boolean(tuy.cu)) loi.push(`${ten}: fixture dấu ${coDau}`);
    dung(ctx);
    const m = JSON.parse(chayCli(ctx.kho, ['chan-doan', '--json', '--chi-tiet'], { env: ENV_GIO }).out).find((x) => x.muc === 'day:P1');
    const co = m?.chi_tiet?.hanh_dong;
    toi.add(co);
    if (co !== can) loi.push(`${ten}: ${co}, cần ${can}`);
  }
  console.log(`  số hàng: ${MA_TRAN_DAU.length} · hành động không với tới khi có dấu: ${Object.values(HANH_DONG).filter((h) => !toi.has(h)).join(', ') || '(không)'}`);
  assert.deepEqual(loi, []);
  // Dãy đã có worktree (ma trận DP3-03 hàng (c)): lời ghi danh cũng mang lệnh ghi-danh, không mang «chưa ghi danh».
  const { kho, dot, chip } = dotChoGhiDanh({ soChip: 1 });
  assert.equal(chayCli(chip[0], ['ghi-danh', 'P1']).ma, 0);
  hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO });
  hookNhip({ session_id: 's-p1' }, { cwd: chip[0], nowMs: GIO - 25 * PHUT });
  const m = JSON.parse(chayCli(kho, ['chan-doan', '--json', '--chi-tiet'], { env: ENV_GIO }).out).find((x) => x.muc === 'day:P1');
  assert.equal(m.chi_tiet.hanh_dong, 'mo-chip');
  assert.ok(m.chi_tiet.ghi_danh.includes(`node ${path.join(dot, 'loi', 'dieu-phoi.mjs')} ghi-danh P1`));
  assert.ok(m.chi_tiet.ghi_danh.includes(`worktree ${chip[0]}`) && !m.chi_tiet.ghi_danh.includes('chưa ghi danh'));
});

// ---------- DP8-08: khoá ghi hang-viec.json (AC-8, E8) ----------
const chayDongThoi = (viec) => Promise.all(viec.map(({ cwd, doiSo, gocGoi = GOI }) => new Promise((xong) => {
  const con = spawn(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, DIEU_PHOI_TRE_GHI_MS: '300' } });
  let err = '';
  con.stderr.on('data', (b) => { err += b; });
  con.on('exit', (ma) => xong({ ma, err, doiSo }));
})));
export async function kiemTranhChap(gocGoi = GOI) {
  const loi = [];
  const { dot, chip, ids } = dotChoGhiDanh({ soDay: 8, gocGoi });
  const nk = nhatKy(dot).length;
  const kq = await chayDongThoi(ids.map((id, i) => ({ cwd: chip[i], doiSo: ['ghi-danh', id], gocGoi })));
  for (const r of kq) if (r.ma !== 0) loi.push(`${r.doiSo.join(' ')} thoát ${r.ma}: ${r.err.trim()}`);
  ids.forEach((id, i) => {
    if (worktreeCua(dot, id) !== chip[i]) loi.push(`${id} mất bản ghi`);
  });
  const sk = suKien(dot).filter((e) => e.kieu === 'ghi-danh').length;
  if (sk !== 8) loi.push(`${sk} sự kiện ghi-danh`);
  if (nhatKy(dot).length !== nk + 8) loi.push(`Nhật ký thêm ${nhatKy(dot).length - nk} dòng`);
  if (fs.existsSync(path.join(dot, TEP_KHOA))) loi.push(`còn ${TEP_KHOA}`);
  return loi;
}
export async function kiemTron(gocGoi = GOI) {
  const loi = [];
  const { kho, dot, chip, ids } = dotChoGhiDanh({ soDay: 4, gocGoi });
  const kq = await chayDongThoi([
    ...ids.map((id, i) => ({ cwd: chip[i], doiSo: ['ghi-danh', id], gocGoi })),
    ...ids.map((id, i) => ({ cwd: kho, doiSo: ['hang', 'them', `viec-${i + 1}`, '--day', id], gocGoi })),
  ]);
  for (const r of kq) if (r.ma !== 0) loi.push(`${r.doiSo.join(' ')} thoát ${r.ma}`);
  const hv = docJ(path.join(dot, 'hang-viec.json'));
  ids.forEach((id, i) => {
    if (hv.day.find((d) => d.id === id).worktree !== chip[i]) loi.push(`${id} mất bản ghi`);
    if (!hv.hang.some((h) => h.day === id && h.slug === `viec-${i + 1}`)) loi.push(`hàng viec-${i + 1} mất bản ghi`);
  });
  return loi;
}

test('DP8-08 tranh-chap', async () => {
  assert.deepEqual(await kiemTranhChap(), []);
});

test('DP8-08 tron', async () => {
  assert.deepEqual(await kiemTron(), []);
});

test('DP8-08 khoa-bo-roi', () => {
  const { dot, chip } = dotChoGhiDanh({ soChip: 1 });
  const k = path.join(dot, TEP_KHOA);
  const pHv = path.join(dot, 'hang-viec.json');
  // Đối chứng: khoá TƯƠI cùng tên, cùng fixture → lệnh chờ hết hạn rồi từ chối, không ghi gì (bộ lõi thật sự đọc khoá này).
  fs.mkdirSync(k);
  const truoc = bam(pHv);
  let t0 = Date.now();
  const tuoi = chayCli(chip[0], ['ghi-danh', 'P1']);
  console.log(`  khoá tươi: thoát ${tuoi.ma} sau ${Date.now() - t0} ms · ${tuoi.err.trim()}`);
  assert.equal(tuoi.ma, 1);
  assert.match(tuoi.err, /hang-viec\.json đang bị khoá quá 10″/);
  assert.equal(bam(pHv), truoc, 'khoá tươi: không ghi byte nào');
  assert.ok(fs.existsSync(k), 'khoá tươi không bị dọn');
  // Khoá bỏ rơi (31″): lệnh dọn, ghi danh, và trả khoá.
  const cu31 = new Date(Date.now() - 31_000);
  fs.utimesSync(k, cu31, cu31);
  t0 = Date.now();
  const r = chayCli(chip[0], ['ghi-danh', 'P1']);
  console.log(`  khoá bỏ rơi 31″: thoát ${r.ma} sau ${Date.now() - t0} ms`);
  assert.equal(r.ma, 0, r.err);
  assert.equal(worktreeCua(dot, 'P1'), chip[0]);
  assert.ok(!fs.existsSync(k), 'khoá bỏ rơi đã được dọn và không để lại khoá mới');
});

test('DP8-08-do bo-khoa', async () => {
  assert.deepEqual(await kiemTranhChap(), [], 'đối chứng dương: bản lành');
  // Hồ sơ ky-den-gop: khoá ghi dời sang khoa-hang-viec.mjs (hang.mjs xuất lại) — nhát tiêm theo vật tới đó.
  const sao = banSao([['scripts/khoa-hang-viec.mjs', '  const d = path.join(thuMuc, TEP_KHOA_HANG_VIEC);\n  const het', '  return viec();\n  const d = path.join(thuMuc, TEP_KHOA_HANG_VIEC);\n  const het']]);
  const loi = await kiemTranhChap(sao);
  assert.ok(loi.some((l) => /^P\d mất bản ghi$/.test(l)), `phải nêu dãy mất bản ghi: ${loi.join(' | ')}`);
});

test('DP8-08-do bo-khoa-hang-them', async () => {
  assert.deepEqual(await kiemTron(), [], 'đối chứng dương: bản lành');
  // Hồ sơ ky-den-gop: themHangTrongKhoa nhận thêm vùng tệp (`ranhGioi`) — chuỗi tiêm theo chữ ký mới.
  const sao = banSao([['scripts/hang.mjs', 'return voiKhoaHangViec(thuMuc, () => themHangTrongKhoa(thuMuc, khoa, day, ranhGioi));', 'return themHangTrongKhoa(thuMuc, khoa, day, ranhGioi);']]);
  const loi = await kiemTron(sao);
  assert.ok(loi.some((l) => / mất bản ghi$/.test(l)), `phải nêu dãy hoặc hàng mất bản ghi: ${loi.join(' | ')}`);
});

// ---------- DP8-09: việc nền ngoài dãy giữ nhịp khoá (AC-9, E9) ----------
const ngu = (ms) => new Promise((x) => setTimeout(x, ms));
// DP10 (hồ sơ dieu-phoi-khoa-day-giu-nhip): ma trận toàn phần người giữ × nguồn nhịp — người giữ không đổi kết quả.
// `cua` = worktree của người giữ, `khac` = worktree kia (chamNhip chỉ chạm khoá mà cwd nằm trong chu.worktree).
const NGUON_NHIP = [
  ['chạm nhịp khoá (chamNhip)', 0, async ({ cua, gocGoi }) => (await nap(gocGoi, 'hook-nhip.mjs')).chamNhip({ cwd: cua })],
  ['chạy qua giu-nhip.mjs', 0, async ({ cua, gocGoi }) => {
    const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'giu-nhip.mjs'), '--', process.execPath, '-e', ''], { cwd: cua, env: ENV, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
  }],
  ['nhịp khoá trước lúc cấp', 1, async ({ dot, T }) => {
    const p = path.join(dot, 'khoa', 's4', 'nhip');
    fs.writeFileSync(p, new Date(T - PHUT).toISOString());
    fs.utimesSync(p, new Date(T - PHUT), new Date(T - PHUT));
  }],
  ['worktree khác chạm nhịp khoá', 1, async ({ khac, gocGoi }) => (await nap(gocGoi, 'hook-nhip.mjs')).chamNhip({ cwd: khac })],
  ['không chạm nhịp', 1, async () => {}],
];
export const MA_TRAN_VIEC_NEN = [['kiem-cheo', 'kiem-cheo'], ['dãy P1', 'P1']].flatMap(([nhan, phien]) =>
  NGUON_NHIP.map(([nguon, can, lam]) => [`${nhan} ${nguon}`, can, phien, lam]),
);
async function kichBanViecNen({ phien, lam, gocGoi = GOI, nhipSau = [11, 12] }) {
  const { kho, dot, chip } = dotChoGhiDanh({ soChip: 2, gocGoi });
  const [w1, cay] = chip;
  assert.equal(chayCli(w1, ['ghi-danh', 'P1'], { gocGoi }).ma, 0);
  try {
    if (phien === 'kiem-cheo') {
      const don = { phien: 'kiem-cheo', slug: 'kiem-cheo-sau-gop', loai: 's4', luc: new Date().toISOString(), worktree: cay, uoc_phut: 90 };
      (await nap(gocGoi, 'hinh-dang.mjs')).kiemDon(don);
      ghiJ(path.join(dot, 'xin', 'kiem-cheo-s4.json'), don);
    } else assert.equal(chayCli(w1, ['xin', 's4'], { gocGoi }).ma, 0);
    await ngu(5);
    const T = Date.now();
    hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: T, gocGoi });
    const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
    const nhip = (ms) => taoVong(dot, ioGia(ms), () => ms)();
    await nhip(T);
    const pChu = path.join(dot, 'khoa', 's4', 'chu.json');
    assert.equal(fs.existsSync(pChu) ? docJ(pChu).phien : null, phien, 'đối chứng đầu vào: khoá cấp đúng phiên');
    await ngu(5);
    const [cua, khac] = phien === 'P1' ? [w1, cay] : [cay, w1];
    await lam({ dot, cay, w1, cua, khac, T, gocGoi });
    for (const p of nhipSau) await nhip(T + p * PHUT);
    const ev = suKien(dot).filter((e) => e.loai === 'khoa-khong-nhip');
    const nhipPhien = (await nap(gocGoi, 'song.mjs')).nhipMoiNhatCua(dot, cua);
    return { soBao: ev.length, canPhan: ev[0]?.can_phan, lyDo: ev[0]?.ly_do, nhipPhien, dot, sk: suKien(dot) };
  } finally {
    chayCli(kho, ['dong'], { gocGoi });
  }
}
export async function kiemViecNen(gocGoi = GOI) {
  const loi = [];
  const ra = [];
  const ket = [];
  for (const [ten, can, phien, lam] of MA_TRAN_VIEC_NEN) {
    const r = await kichBanViecNen({ phien, lam, gocGoi });
    ra.push(`${ten}=${r.soBao}`);
    ket.push(r.soBao);
    if (r.nhipPhien) loi.push(`${ten}: có nhịp phiên của người giữ`);
    if (r.soBao !== can) loi.push(can === 0 ? `${ten}: việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip` : `${ten}: ${r.soBao} sự kiện, cần ${can}`);
    if (can === 1 && r.canPhan !== true) loi.push(`${ten}: thiếu can_phan`);
    if (can === 1 && r.soBao === 1 && !String(r.lyDo).includes('nhịp khoá')) loi.push(`${ten}: ly_do không nêu nhịp khoá`);
  }
  return { loi, ra, ket };
}

test('DP8-09 viec-nen', async () => {
  const { loi, ra } = await kiemViecNen();
  console.log(`  số hàng: ${ra.length} · ${ra.join(' · ')}`);
  assert.equal(ra.length, MA_TRAN_VIEC_NEN.length);
  assert.deepEqual(loi, []);
});

test('DP8-09 thu-hoi', async () => {
  const r = await kichBanViecNen({ phien: 'kiem-cheo', lam: MA_TRAN_VIEC_NEN[0][3], nhipSau: [11, 200] });
  const th = r.sk.filter((e) => e.loai === 'thu-hoi' && e.phien === 'kiem-cheo');
  console.log(`  sau 200′ không chạm nhịp: ${th.length} sự kiện thu-hoi · khoá s4 ${fs.existsSync(path.join(r.dot, 'khoa', 's4', 'chu.json')) ? 'còn' : 'vắng'}`);
  assert.equal(th.length, 1);
  assert.equal(r.soBao, 0);
});

test('DP8-09-do bo-mien', async () => {
  assert.deepEqual((await kiemViecNen()).loi, [], 'đối chứng dương: bản lành');
  const sao = banSao([['scripts/phat-lich.mjs', '    if (viecNenGiuNhip(thuMuc, tn, chu)) continue;\n', '']]);
  const { loi } = await kiemViecNen(sao);
  assert.ok(loi.includes('kiem-cheo chạm nhịp khoá (chamNhip): việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip'), loi.join(' | '));
});

// ---------- DP8-10: tài liệu (AC-10, E10) ----------
const doanCo = (md, chu) => md.split(/\n\s*\n/).filter((d) => d.includes(chu));
export function kiemTaiLieu(readme, luat, dung) {
  const loi = [];
  const gd = doanCo(readme, '`ghi-danh').join('\n');
  if (!gd) return ['README thiếu ghi-danh'];
  for (const c of ['worktree của chip', 'trước S1', 'dãy khác', 'gốc kho chính', 'còn phiên', 'không có đợt']) if (!gd.includes(c)) loi.push(`README đoạn ghi-danh thiếu «${c}»`);
  for (const c of [...LOP, 'dieu_phoi.lich_su', '#<id>', '--chi-tiet']) if (!readme.includes(c)) loi.push(`README thiếu «${c}»`);
  if (!doanCo(readme, 'ngoài dãy').some((d) => d.includes('chamNhip') || d.includes('giu-nhip.mjs'))) loi.push('README thiếu việc nền ngoài dãy giữ nhịp khoá');
  const muc = /## Cách xin tài nguyên\n([\s\S]*?)\n## /.exec(luat)?.[1] ?? '';
  if (!muc.includes('ghi-danh')) loi.push('LUAT.md «Cách xin tài nguyên» thiếu ghi-danh');
  for (const c of ['ghi-danh <dãy>', 'xem [--kiem-chuyen [--chi-tiet]]']) if (!dung.includes(c)) loi.push(`chuỗi dùng thiếu «${c}»`);
  return loi;
}
const docTaiLieu = (goi) => [fs.readFileSync(path.join(goi, 'README.md'), 'utf8'), fs.readFileSync(path.join(goi, 'scripts', 'mau', 'LUAT.md'), 'utf8'), chayCli(KIT, [], { gocGoi: goi }).err];

test('DP8-10 tai-lieu', () => {
  assert.deepEqual(kiemTaiLieu(...docTaiLieu(GOI)), []);
});

test('DP8-10-do readme', () => {
  const [readme, luat, dung] = docTaiLieu(GOI);
  assert.deepEqual(kiemTaiLieu(readme, luat, dung), [], 'đối chứng dương: bản lành');
  const bo = readme.split(/\n\s*\n/).filter((d) => !d.includes('`ghi-danh')).join('\n\n');
  assert.notEqual(bo, readme, 'bước bỏ đoạn không áp được');
  assert.deepEqual(kiemTaiLieu(bo, luat, dung), ['README thiếu ghi-danh']);
});

// ---------- DP8-11: ca đã ký không đổi thân (AC-11, E11) — khuôn SDT-07, chép (không import tệp .test.mjs) ----------
const RE_PR = new RegExp(`\\tMerge pull request #\\d+ from \\S+/${NHANH.replace(/\//g, '\\/')}$`);
export function mocSo(goc, reGop = RE_PR) {
  const dong = git(goc, 'log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n').find((l) => reGop.test(l));
  if (dong) {
    const m = dong.split('\t')[0];
    return { tu: git(goc, 'merge-base', `${m}^1`, `${m}^2`), toi: git(goc, 'rev-parse', `${m}^2`), cach: 'commit gộp PR' };
  }
  for (const n of ['origin/main', 'main']) {
    try {
      return { tu: git(goc, 'merge-base', 'HEAD', n), toi: git(goc, 'rev-parse', 'HEAD'), cach: `merge-base ${n}` };
    } catch {}
  }
  throw new Error('không tìm được mốc so');
}
const noiDungTai = (goc, sha, p) => {
  const r = spawnSync('git', ['show', `${sha}:${p}`], { cwd: goc, env: ENV, encoding: 'utf8', maxBuffer: 1 << 28 });
  return r.status === 0 ? r.stdout : null;
};
const tepTai = (goc, sha, p) => {
  const r = spawnSync('git', ['ls-tree', '-r', '--name-only', sha, '--', p], { cwd: goc, env: ENV, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split('\n').filter((f) => f.endsWith('.mjs')) : [];
};
// Khối của một ca = từ dòng sau khi ca trước khép tới dòng khép ca này (phần dựng nằm ngay trên ca thuộc về ca ấy).
// Lượt 1 (finding trong hợp đồng AC-11): bộ tách cũ chỉ nhận `test(` ở cột 0 khép bằng `});` cột 0, nên ca một
// dòng nuốt ca kế và ca sinh trong vòng lặp (thụt lề) không thành khoá. Nay: `test(` ở mọi mức thụt, khép theo
// `dongKhep`.
// Dòng khép lời gọi `test(` mở ở dòng i: ngoặc cân bằng ngay trên dòng ấy → i; dòng mở kết bằng `{` (thân khối) →
// dòng đầu tiên sau đó bắt đầu bằng `}` CÙNG mức thụt; còn lại (thân biểu thức xuống dòng) → đếm ngoặc qua các dòng
// (bỏ qua chuỗi; biểu thức chính quy có ngoặc lẻ không được hiểu — ca như thế hiếm, tự kiểm số khối bắt được).
function dongKhep(dong, i, thutMo) {
  let sau = 0;
  let nhay = null;
  const quet = (d, tu) => {
    for (let k = tu; k < d.length; k++) {
      const c = d[k];
      if (nhay) {
        if (c === '\\') k++;
        else if (c === nhay) nhay = null;
      } else if (c === "'" || c === '"' || c === '`') nhay = c;
      else if (c === '(') sau++;
      else if (c === ')' && --sau === 0) return true;
    }
    if (nhay !== '`') nhay = null;
    return false;
  };
  if (quet(dong[i], dong[i].indexOf('test('))) return i;
  if (/\{\s*$/.test(dong[i])) {
    const khep = new RegExp(`^${thutMo}\\}`);
    let j = i + 1;
    while (j < dong.length && !khep.test(dong[j])) j++;
    return j;
  }
  for (let j = i + 1; j < dong.length; j++) if (quet(dong[j], 0)) return j;
  return dong.length - 1;
}
export function khoiCa(text, tep) {
  const ra = new Map();
  if (text == null) return ra;
  const dong = text.split('\n');
  let dau = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = /^(\s*)test\((['"`])(.+?)\2/.exec(dong[i]);
    if (!m) continue;
    if (!ra.size && dau === 0 && i > 0) ra.set(`(đầu ${tep})`, dong.slice(0, i).join('\n'));
    const j = dongKhep(dong, i, m[1]);
    ra.set(m[3], dong.slice(dau, j + 1).join('\n'));
    dau = j + 1;
    i = j;
  }
  return ra;
}
// Bộ tách cũ của SDT-07 — chỉ để chạy chiều đỏ của DP8-11 (ca DP8-11-do tach-khoi-cu).
export function khoiCaCu(text, tep) {
  const ra = new Map();
  if (text == null) return ra;
  const dong = text.split('\n');
  let dau = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = /^test\((['"`])(.+?)\1/.exec(dong[i]);
    if (!m) continue;
    if (!ra.size && dau === 0 && i > 0) ra.set(`(đầu ${tep})`, dong.slice(0, i).join('\n'));
    let j = i;
    while (j < dong.length && !/^\}\);\s*$/.test(dong[j])) j++;
    ra.set(m[2], dong.slice(dau, j + 1).join('\n'));
    dau = j + 1;
    i = j;
  }
  return ra;
}
export function caDoiThan(goc, { tu, toi }, ds = ['tests/dieu-phoi'], tach = khoiCa) {
  const ra = [];
  for (const p of ds) {
    for (const f of tepTai(goc, tu, p).sort()) {
      const cuK = tach(noiDungTai(goc, tu, f), path.basename(f));
      const moiK = tach(noiDungTai(goc, toi, f), path.basename(f));
      for (const [ten, than] of cuK) if (moiK.get(ten) !== than) ra.push(ten);
    }
  }
  return ra;
}
export function thieuSo(ten, soText) {
  const fix = soText.split('\n').filter(Boolean).flatMap((d) => {
    try {
      const o = JSON.parse(d);
      return o.type === 'fix' ? [`${o.decision} ${o.why} ${o.cost_if_wrong ?? o.impact ?? ''}`] : [];
    } catch {
      return [];
    }
  });
  return ten.filter((t) => !fix.some((f) => f.includes(t))).map((t) => `${t} chưa có dòng sổ`);
}
const SO = path.join(KIT, '_acceptance', SLUG, 'decisions.jsonl');

test('DP8-11 ca-da-ky', () => {
  const moc = mocSo(KIT);
  const ds = caDoiThan(KIT, moc);
  console.log(`  mốc (${moc.cach}): ${moc.tu.slice(0, 12)}..${moc.toi.slice(0, 12)} · ca đã ký đổi thân: ${ds.length ? ds.join(' · ') : '0 ca đã ký đổi thân'}`);
  assert.deepEqual(thieuSo(ds, fs.readFileSync(SO, 'utf8')), []);
});

// Bộ tách khối trên tệp mẫu do code sinh: ca nhiều dòng · ca một dòng · ca sinh trong vòng lặp · ca nhiều dòng.
const TEP_MAU = (y, b) => `test('X', () => {\n  a();\n});\n\ntest('Y', () => ${y});\n\nfor (const t of ['p', 'q']) {\n  test(\`L \${t}\`, () => {\n    ${b}();\n  });\n}\n\ntest('Z', () => {\n  c();\n});\n`;
export function kiemTachKhoi(tach) {
  const loi = [];
  const ten = (text) => [...tach(text, 'mau.test.mjs').keys()].filter((k) => !k.startsWith('(đầu'));
  const can = ['X', 'Y', 'L ${t}', 'Z'];
  if (JSON.stringify(ten(TEP_MAU('a1()', 'b'))) !== JSON.stringify(can)) loi.push(`khoá ${JSON.stringify(ten(TEP_MAU('a1()', 'b')))}, cần ${JSON.stringify(can)}`);
  const doi = (truoc, sau) => {
    const a = tach(truoc, 'mau.test.mjs');
    const b = tach(sau, 'mau.test.mjs');
    return [...a.keys()].filter((k) => a.get(k) !== b.get(k));
  };
  const y = doi(TEP_MAU('a1()', 'b'), TEP_MAU('a2()', 'b'));
  if (JSON.stringify(y) !== '["Y"]') loi.push(`đổi thân ca một dòng Y bị báo là ${JSON.stringify(y)}`);
  const l = doi(TEP_MAU('a1()', 'b'), TEP_MAU('a1()', 'b2'));
  if (JSON.stringify(l) !== '["L ${t}"]') loi.push(`đổi thân ca trong vòng lặp bị báo là ${JSON.stringify(l)}`);
  return loi;
}

test('DP8-11 tach-khoi', () => {
  assert.deepEqual(kiemTachKhoi(khoiCa), []);
  // Tự kiểm trên tệp ca thật: số khối có tên == số lời gọi `test(` của từng tệp.
  const lech = [];
  let tong = 0;
  for (const f of fs.readdirSync(DAY).filter((x) => x.endsWith('.test.mjs')).sort()) {
    const text = fs.readFileSync(path.join(DAY, f), 'utf8');
    const goi = text.split('\n').filter((d) => /^\s*test\((['"`])/.test(d)).length;
    const khoi = [...khoiCa(text, f).keys()].filter((k) => !k.startsWith('(đầu')).length;
    tong += goi;
    if (goi !== khoi) lech.push(`${f}: ${khoi} khối ≠ ${goi} lời gọi test(`);
  }
  console.log(`  tệp ca thật: ${tong} lời gọi test( · lệch ${lech.length}`);
  assert.deepEqual(lech, []);
});

test('DP8-11-do tach-khoi-cu', () => {
  assert.deepEqual(kiemTachKhoi(khoiCa), [], 'đối chứng dương: bộ tách lành');
  const loi = kiemTachKhoi(khoiCaCu);
  assert.ok(loi.includes('đổi thân ca trong vòng lặp bị báo là ["Y"]'), `bộ tách cũ phải gán nhầm ca trong vòng lặp: ${loi.join(' | ')}`);
});

function khoHaiChieu() {
  const kho = tam('dp8-moc-');
  git(kho, 'init', '-q', '-b', 'main');
  const p = path.join(kho, 'tests', 'dieu-phoi', 'a.test.mjs');
  const viet = (x, y) => ghiT(p, `test('X', () => {\n  ${x}();\n});\n\ntest('Y', () => {\n  ${y}();\n});\n`);
  viet('a', 'b');
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'hai ca');
  git(kho, 'checkout', '-q', '-b', NHANH);
  viet('a2', 'b');
  git(kho, 'commit', '-q', '-am', 'nhanh doi X');
  return { kho, viet };
}

test('DP8-11-do so-thieu-ten', () => {
  const { kho } = khoHaiChieu();
  const ds = caDoiThan(kho, mocSo(kho));
  assert.deepEqual(ds, ['X'], 'fixture: nhánh đổi thân đúng ca X');
  const coSo = `{"id":"d-1","type":"fix","stage":"S3","decision":"đổi thân ca X cho khớp lời mới","why":"x","cost_if_wrong":"y"}\n`;
  assert.deepEqual(thieuSo(ds, coSo), [], 'đối chứng dương: sổ nêu X thì im');
  assert.deepEqual(thieuSo(ds, ''), ['X chưa có dòng sổ']);
});

test('DP8-11 chon-moc', () => {
  const { kho, viet } = khoHaiChieu();
  git(kho, 'checkout', '-q', 'main');
  viet('a', 'b2');
  git(kho, 'commit', '-q', '-am', 'main doi Y');
  git(kho, 'checkout', '-q', NHANH);
  git(kho, 'merge', '-q', '--no-edit', 'main');
  const buoc = [];
  buoc.push(['nhánh sau khi gộp main', caDoiThan(kho, mocSo(kho))]);
  git(kho, 'checkout', '-q', 'main');
  git(kho, 'merge', '-q', '--no-ff', '-m', `Merge pull request #1 from t/${NHANH}`, NHANH);
  buoc.push(['main sau khi gộp PR', caDoiThan(kho, mocSo(kho))]);
  console.log(`  ${buoc.map(([t, d]) => `${t}: [${d}]`).join(' · ')}`);
  for (const [t, d] of buoc) assert.deepEqual(d, ['X'], t);
});

// ---------- DP10: khoá của DÃY cũng tính nhịp khoá (hồ sơ dieu-phoi-khoa-day-giu-nhip) ----------
let ketLanh = null;
const kiemLanh = () => (ketLanh ??= kiemViecNen());
const hangMaTran = (ten) => MA_TRAN_VIEC_NEN.find((h) => h[0] === ten);

test('DP10-01 day-giu-nhip', async () => {
  const r = await kichBanViecNen({ phien: 'P1', lam: hangMaTran('dãy P1 chạy qua giu-nhip.mjs')[3] });
  console.log(`  dãy P1 chạy qua giu-nhip.mjs, không nhịp phiên (${r.nhipPhien ? 'CÓ' : 'vắng'}) → ${r.soBao} sự kiện khoa-khong-nhip`);
  assert.equal(r.nhipPhien, null, 'đối chứng đầu vào: không nhịp phiên của worktree P1');
  assert.equal(r.soBao, 0);
  // Đối chứng dương của phép kiểm «vắng nhịp phiên» (S4-r1, ngoài hợp đồng t2): hook thật ghi một nhịp phiên từ
  // worktree người giữ → phép kiểm THẤY nó, nên giá trị null ở trên không phải do so đường dẫn lệch.
  const co = await kichBanViecNen({ phien: 'P1', lam: async ({ cua, gocGoi }) => hookNhip({ session_id: 's-p1' }, { cwd: cua, gocGoi }) });
  console.log(`  đối chứng dương: hook ghi nhịp phiên từ worktree P1 → phép kiểm ${co.nhipPhien ? 'thấy' : 'KHÔNG thấy'}`);
  assert.ok(co.nhipPhien, 'phép kiểm vắng nhịp phiên không thấy nhịp phiên hook thật ghi');
});

// Bản tiêm dựng lại ĐÚNG hành vi DP8: luồn lại hangViec qua hai chữ ký và chèn lại dòng loại dãy (gap-probe P1 —
// chỉ chèn dòng thì hangViec ngoài phạm vi, bộ phát lịch ném lỗi chứ không báo).
const TIEM_LOAI_DAY = [
  ['scripts/phat-lich.mjs', 'const viecNenGiuNhip = (thuMuc, tn, chu) => {\n', 'const viecNenGiuNhip = (thuMuc, tn, chu, hangViec) => {\n  if ((hangViec?.day ?? []).some((d) => d.id === chu.phien)) return false;\n'],
  ['scripts/phat-lich.mjs', '    if (viecNenGiuNhip(thuMuc, tn, chu)) continue;\n', '    if (viecNenGiuNhip(thuMuc, tn, chu, hangViec)) continue;\n'],
  ['scripts/phat-lich.mjs', 'function baoKhoaKhongNhip(thuMuc, cu, nowMs) {', 'function baoKhoaKhongNhip(thuMuc, cu, nowMs, hangViec = null) {'],
  ['scripts/phat-lich.mjs', 'baoKhoaKhongNhip(thuMuc, cu, nowMs);', 'baoKhoaKhongNhip(thuMuc, cu, nowMs, hangViec);'],
];
test('DP10-01-do tra-lai-loai-day', async () => {
  assert.deepEqual((await kiemLanh()).loi, [], 'đối chứng dương: bản lành');
  const { loi, ra } = await kiemViecNen(banSao(TIEM_LOAI_DAY));
  console.log(`  bản tiêm: ${ra.join(' · ')}`);
  assert.deepEqual(loi, [
    'dãy P1 chạm nhịp khoá (chamNhip): việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip',
    'dãy P1 chạy qua giu-nhip.mjs: việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip',
  ]);
});

test('DP10-02 hai-nua-bang-nhau', async () => {
  const { ket } = await kiemLanh();
  const n = NGUON_NHIP.length;
  const [viecNen, day] = [ket.slice(0, n), ket.slice(n)];
  console.log(`  ${ket.length} hàng · kiem-cheo [${viecNen}] · P1 [${day}]`);
  // Số hàng ghim bằng hằng viết trước (S4-r1, finding trong hợp đồng AC-2): đếm theo chính ma trận là hằng đúng.
  assert.equal(ket.length, 10);
  assert.equal(n, 5);
  assert.deepEqual(day, viecNen);
  assert.ok(viecNen.includes(0) && viecNen.includes(1), 'nửa ma trận không được hằng');
});

test('DP10-04 day-thu-hoi', async () => {
  const r = await kichBanViecNen({ phien: 'P1', lam: hangMaTran('dãy P1 chạy qua giu-nhip.mjs')[3], nhipSau: [11, 200] });
  const th = r.sk.filter((e) => e.loai === 'thu-hoi' && e.phien === 'P1');
  const conKhoa = fs.existsSync(path.join(r.dot, 'khoa', 's4', 'chu.json'));
  console.log(`  dãy P1 thôi chạm nhịp, sau 200′: ${th.length} sự kiện thu-hoi · khoá s4 ${conKhoa ? 'còn' : 'vắng'}`);
  assert.equal(th.length, 1);
  assert.equal(conKhoa, false);
  assert.equal(r.soBao, 0);
});

// README ở merge-base của vòng với main — sha GHIM (gap-probe P1: mốc suy từ trạng thái gộp trôi về HEAD sau khi gộp).
const MOC_DP10 = 'e76684fd51ee1e737329ff7d56465d5fef0018a2';
export function kiemTaiLieuDp10(readme, luat) {
  const loi = [];
  const d = doanCo(readme, 'ngoài dãy').filter((x) => x.includes('giu-nhip.mjs')).join('\n').replace(/\s+/g, ' ');
  if (!d) return ['README thiếu đoạn việc nền giữ nhịp khoá'];
  if (!d.includes('Khoá của dãy')) loi.push('README không nói luật nhịp của khoá dãy');
  if (d.includes('vẫn đòi nhịp phiên')) loi.push('README còn nói khoá của dãy đòi nhịp phiên');
  const muc = /## Cách xin tài nguyên\n([\s\S]*?)\n## /.exec(luat)?.[1] ?? '';
  if (!muc.includes('giu-nhip.mjs')) loi.push('LUAT.md «Cách xin tài nguyên» thiếu giu-nhip.mjs');
  return loi;
}

test('DP10-05 tai-lieu', () => {
  const [readme, luat] = docTaiLieu(GOI);
  assert.deepEqual(kiemTaiLieuDp10(readme, luat), []);
});

test('DP10-05-do readme-cu', () => {
  const [readme, luat] = docTaiLieu(GOI);
  assert.deepEqual(kiemTaiLieuDp10(readme, luat), [], 'đối chứng dương: bản lành');
  const cu = noiDungTai(KIT, MOC_DP10, 'dieu-phoi/README.md');
  assert.ok(cu && cu !== readme, 'đối chứng đầu vào: README ở mốc ghim phải rút được và khác bản hiện tại');
  assert.deepEqual(kiemTaiLieuDp10(cu, luat), ['README còn nói khoá của dãy đòi nhịp phiên']);
});

const RE_DP10 = /\tMerge pull request #\d+ from \S+\/vong\/dieu-phoi-khoa-day-giu-nhip$/;
const KHAI_DOI_THAN_DP10 = ['DP3-10-do bo-dieu-kien', 'DP8-09 viec-nen', 'DP8-09-do bo-mien'];
test('DP10-06 ca-da-ky', () => {
  const moc = mocSo(KIT, RE_DP10);
  const ds = caDoiThan(KIT, moc).sort();
  console.log(`  mốc (${moc.cach}): ${moc.tu.slice(0, 12)}..${moc.toi.slice(0, 12)} · ca đã ký đổi thân: ${ds.join(' · ') || '0'}`);
  assert.deepEqual(ds, KHAI_DOI_THAN_DP10);
  assert.deepEqual(thieuSo(ds, fs.readFileSync(path.join(KIT, '_acceptance', 'dieu-phoi-khoa-day-giu-nhip', 'decisions.jsonl'), 'utf8')), []);
});
