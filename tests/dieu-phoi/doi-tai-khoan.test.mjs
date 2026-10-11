// Ca đo của hồ sơ dieu-phoi-doi-tai-khoan (DP4). Tên ca bắt đầu «DP4-». Kho thử do mã sinh, có worktree LIÊN KẾT
// thật (git worktree add) cho từng dãy; đường suy từ vị trí tệp; đồng hồ giả qua tham số hoặc biến DIEU_PHOI_NOW_MS
// (hook và CLI là tiến trình con). Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm, sau khi bản lành xanh trên cùng
// fixture, kiểm bước tiêm đã áp, và ghim dấu hiệu của đúng lỗi được tiêm. Khung kho thử chép từ tiep-tuc.test.mjs
// (không import tệp test đã ký: import chạy lại mọi ca của nó — sổ DP4 d-…-24).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');

const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp4-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp4-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const bamTep = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function bamCay(goc) {
  const h = crypto.createHash('sha256');
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      const rel = path.relative(goc, p);
      if (st.isSymbolicLink()) h.update(`L ${rel} ${fs.readlinkSync(p)}\n`);
      else if (st.isDirectory()) {
        if (d === goc && ten === '.git') continue;
        h.update(`D ${rel}\n`);
        di(p);
      } else h.update(`F ${rel} `).update(fs.readFileSync(p)).update('\n');
    }
  };
  di(goc);
  return h.digest('hex');
}
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const PHUT = 60_000;
const GIO = Date.parse('2026-10-11T08:00:00Z');

// Kho thử + hai worktree liên kết thật cho P1, P2 + gói đợt khai qua cấu hình + đợt «thu» mở bằng CLI thật rồi đặt
// pha dang-chay. `cauHinh` ghi đè từng khoá của khuôn cấu hình đợt. Trả đường đã realpath.
function khoLienKet({ gocGoi = GOI, hang = null, cauHinh = {} } = {}) {
  const kho = tam('dp4-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const cha = tam('dp4-wt-');
  const w1 = path.join(cha, 'p1');
  const w2 = path.join(cha, 'p2');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  git(kho, 'worktree', 'add', '-q', '-b', 'p2', w2);
  for (const w of [kho, w1, w2]) {
    execFileSync('git', ['config', 'user.name', 't'], { cwd: w, env: ENV });
    execFileSync('git', ['config', 'user.email', 't@t'], { cwd: w, env: ENV });
  }
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), { ...docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')), ...cauHinh });
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [{ id: 'P1', worktree: fs.realpathSync(w1) }, { id: 'P2', worktree: fs.realpathSync(w2) }],
    hang: hang ?? [
      { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
      { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 },
    ],
    ngoai_hang_merge: [],
  });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 's-gs'], { gocGoi });
  assert.equal(mo.ma, 0, mo.err);
  assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--ly-do', 'thu'], { gocGoi }).ma, 0);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot, w1: fs.realpathSync(w1), w2: fs.realpathSync(w2) };
}

// Lệnh hook của gói, rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}).
function lenhHook(gocGoi, suKien, matcher = null) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const muc = hj.hooks[suKien].find((m) => matcher == null || m.matcher === matcher);
  return muc.hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
function chayHook(suKien, dauVao, { cwd, nowMs = null, gocGoi = GOI } = {}) {
  const env = { ...ENV };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  return spawnSync('sh', ['-c', lenhHook(gocGoi, suKien)], { cwd, env, input: JSON.stringify({ cwd, hook_event_name: suKien, ...dauVao }), encoding: 'utf8' });
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
async function motNhip(dot, nowMs, gocGoi = GOI) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(nowMs), () => nowMs)();
}
const suKienCua = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : []);

// Đặt thẳng ô xuất phát của một ca (fixture, không phải vật đo): pha + khối ban_giao khi là pha ★.
const PHA_SAO_THU = new Set(['dang-ban-giao', 'cho-tiep-tuc']);
function datTruc(dot, pha, { phaTruoc = 'dang-chay', vaoLuc = '2026-10-11T07:50:00.000Z' } = {}) {
  const p = path.join(dot, 'dieu-khien.json');
  const dk = docJ(p);
  const { ban_giao: _bo, ...con } = dk;
  ghiJ(p, {
    ...con,
    pha,
    ...(PHA_SAO_THU.has(pha) ? { ban_giao: { ma: 'bg-20261011T075000Z', pha_truoc: phaTruoc, vao_luc: vaoLuc, ly_do: 'thu', boi: 'thu' } } : {}),
    lich_su: [{ pha, dat_boi: 'thu', dat_luc: vaoLuc, ly_do: 'thu' }],
  });
}

// ---------- DP4-01: hai pha ★ trong bảng chuyển (AC-1, E1) ----------
const PHA6 = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong', 'dang-ban-giao', 'cho-tiep-tuc'];
// Chép từ AC-1 — KHÔNG rút từ CHUYEN của mã.
const CANH_AC1 = new Set([
  'nhap>dang-chay', 'dang-chay>tam-dung', 'dang-chay>dang-dong', 'tam-dung>dang-chay', 'tam-dung>dang-dong',
  'dang-chay>dang-ban-giao', 'tam-dung>dang-ban-giao', 'dang-ban-giao>cho-tiep-tuc',
  'cho-tiep-tuc>dang-chay', 'cho-tiep-tuc>tam-dung', 'cho-tiep-tuc>dang-dong',
]);

test('DP4-01 bang-chuyen', () => {
  const { kho, dot } = khoLienKet();
  const p = path.join(dot, 'dieu-khien.json');
  const dong = [];
  for (const tu of PHA6) {
    for (const sang of PHA6) {
      datTruc(dot, tu);
      const bam = bamTep(p);
      const dai = docJ(p).lich_su.length;
      const r = chayCli(kho, ['pha', sang, '--boi', 't']);
      const mong = tu === sang ? 'cheo' : CANH_AC1.has(`${tu}>${sang}`) ? 'hop-le' : 'tu-choi';
      let thuc;
      if (r.ma === 0) {
        const n = docJ(p).lich_su.length;
        thuc = n === dai + 1 && docJ(p).pha === sang ? 'hop-le' : n === dai && bamTep(p) === bam ? 'cheo' : `la(${n})`;
      } else thuc = bamTep(p) === bam ? 'tu-choi' : 'tu-choi-nhung-ghi';
      dong.push(`${tu}>${sang} · ${mong} · ${thuc}`);
    }
  }
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 36);
  assert.deepEqual(dong.filter((d) => { const [, m, t] = d.split(' · '); return m !== t; }), []);
});

test('DP4-01 vao-ban-giao', () => {
  const { kho, dot } = khoLienKet();
  const r = chayCli(kho, ['pha', 'dang-ban-giao', '--boi', 't', '--ly-do', 'đổi tài khoản']);
  assert.equal(r.ma, 0, r.err);
  const dk = docJ(path.join(dot, 'dieu-khien.json'));
  console.log(`  ban_giao: ${JSON.stringify(dk.ban_giao)}`);
  assert.match(dk.ban_giao?.ma ?? '', /^bg-\d{8}T\d{6}Z$/);
  assert.equal(dk.ban_giao.pha_truoc, 'dang-chay');
  assert.equal(dk.ban_giao.ly_do, 'đổi tài khoản');
  assert.equal(chayCli(kho, ['pha', 'cho-tiep-tuc', '--boi', 't']).ma, 0);
  assert.equal(docJ(path.join(dot, 'dieu-khien.json')).ban_giao?.ma, dk.ban_giao.ma, 'cho-tiep-tuc giữ khối ban_giao');
  assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't']).ma, 0);
  assert.equal(docJ(path.join(dot, 'dieu-khien.json')).ban_giao, undefined, 'rời pha ★ gỡ khối ban_giao');
});

// Một nhịp thật ở pha `pha` với một đơn s4 lành chờ: trả lỗi khi khoá được cấp hoặc đơn bị đụng.
export async function kiemKhongCap(gocGoi, pha) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-'); // khoá s4 cấp máy riêng cho ca này
  const { dot, w1 } = khoLienKet({ gocGoi });
  const r = chayCli(w1, ['xin', 's4'], { gocGoi });
  assert.equal(r.ma, 0, r.err);
  datTruc(dot, pha);
  const bamXin = bamCay(path.join(dot, 'xin'));
  await motNhip(dot, Date.now(), gocGoi);
  const loi = [];
  if (fs.existsSync(path.join(dot, 'khoa', 's4', 'chu.json'))) loi.push(`${pha}: nhịp cấp khoá s4`);
  if (bamCay(path.join(dot, 'xin')) !== bamXin) loi.push(`${pha}: đơn trong xin/ bị đụng`);
  return loi;
}

test('DP4-01 khong-cap', async () => {
  for (const pha of ['dang-ban-giao', 'cho-tiep-tuc']) assert.deepEqual(await kiemKhongCap(GOI, pha), [], pha);
  const doiChung = await kiemKhongCap(GOI, 'dang-chay');
  console.log(`  đối chứng dang-chay: ${doiChung.join(' · ')}`);
  assert.deepEqual(doiChung, ['dang-chay: nhịp cấp khoá s4', 'dang-chay: đơn trong xin/ bị đụng'], 'đối chứng dương: dang-chay phải cấp');
});

test('DP4-01-do cap-o-ban-giao', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', 'phat-lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("(pha, taiNguyen) => pha === 'dang-chay' ||", "(pha, taiNguyen) => pha === 'dang-chay' || pha === 'dang-ban-giao' ||");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const loi = await kiemKhongCap(sao, 'dang-ban-giao');
  console.log(`  bản tiêm: ${loi.join(' · ')}`);
  assert.ok(loi.includes('dang-ban-giao: nhịp cấp khoá s4'), loi.join(' | '));
});

// ---------- DP4-02: CLI han-muc (AC-2, E2) ----------
const FX = docJ(path.join(DAY, 'fixtures', 'rate-limits-mod.json'));
const MA_TRAN_DOC = [
  ['mod', FX.rateLimits, FX.mong_doi],
  ['get-usage', { windows: [
    { label: '5-hour limit', percentUsed: 23, resetsAt: '2026-10-11T03:09:59.919Z' },
    { label: 'Weekly · all models', percentUsed: 12, resetsAt: '2026-10-12T23:59:59.919Z' },
    { label: 'Weekly · Fable', percentUsed: 0, resetsAt: '2026-10-13T00:00:00.000Z' },
  ] }, { five_hour: { pct: 23, dat_lai: '2026-10-11T03:09:59.919Z' }, seven_day: { pct: 12, dat_lai: '2026-10-12T23:59:59.919Z' } }],
  ['statusline', { rate_limits: { five_hour: { used_percentage: 41, resets_at: 1760151600 } } }, { five_hour: { pct: 41, dat_lai: new Date(1760151600 * 1000).toISOString() } }],
  ['mod', [], null],
  ['mod', '{hỏng', null],
  ['la', FX.rateLimits, null],
];
const docHanMuc = (dot) => docJ(path.join(dot, 'han-muc.json'));
const hanMuc = (cwd, nguon, du, { phien = 's-gs', nowMs = null } = {}) => chayCli(cwd, ['han-muc', '--nguon', nguon, '--phien', phien, '--doc', typeof du === 'string' ? du : JSON.stringify(du)], { env: nowMs != null ? { DIEU_PHOI_NOW_MS: String(nowMs) } : {} });

test('DP4-02 chuan-hoa', () => {
  const { kho, dot } = khoLienKet();
  const p = path.join(dot, 'han-muc.json');
  const dong = MA_TRAN_DOC.map(([nguon, du, mong], i) => {
    const truoc = fs.existsSync(p) ? bamTep(p) : null;
    const r = hanMuc(kho, nguon, du);
    if (mong === null) {
      assert.equal(r.ma, 1, `hàng ${i}: ${r.out}`);
      assert.match(r.err, nguon === 'la' ? /nguồn «la»/ : new RegExp(`nguồn ${nguon}`), `hàng ${i}: ${r.err}`);
      assert.equal(fs.existsSync(p) ? bamTep(p) : null, truoc, `hàng ${i}: tệp đổi`);
      return `${i} ${nguon} · từ chối · ${r.err.trim()}`;
    }
    assert.equal(r.ma, 0, r.err);
    assert.deepEqual(docHanMuc(dot).doc.at(-1).cua_so, mong, `hàng ${i}`);
    return `${i} ${nguon} · ${JSON.stringify(mong)}`;
  });
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 6);
});

test('DP4-02 hai-muoi', () => {
  const { kho, dot } = khoLienKet();
  for (let i = 0; i < 25; i++) assert.equal(hanMuc(kho, 'mod', FX.rateLimits, { nowMs: GIO + i * PHUT }).ma, 0);
  const ds = docHanMuc(dot).doc;
  console.log(`  ${ds.length} lần đọc · đầu ${ds[0].luc} · cuối ${ds.at(-1).luc}`);
  assert.equal(ds.length, 20);
  assert.equal(ds[0].luc, new Date(GIO + 5 * PHUT).toISOString());
  assert.equal(ds.at(-1).luc, new Date(GIO + 24 * PHUT).toISOString());
});

const khoaSau = (o, tien = '') => (o && typeof o === 'object' && !Array.isArray(o)
  ? Object.keys(o).flatMap((k) => [`${tien}${k}`, ...khoaSau(o[k], `${tien}${k}.`)])
  : Array.isArray(o) && o.length ? khoaSau(o[0], `${tien}[].`) : []).sort();

test('DP4-02 khuon', () => {
  const { kho, dot } = khoLienKet();
  assert.equal(hanMuc(kho, 'mod', FX.rateLimits).ma, 0);
  const khuon = docJ(path.join(GOI, 'scripts', 'mau', 'han-muc.json'));
  assert.deepEqual(khoaSau(docHanMuc(dot)), khoaSau(khuon));
});

test('DP4-02 round-trip', async () => {
  const { kho, dot } = khoLienKet();
  assert.equal(hanMuc(kho, 'get-usage', MA_TRAN_DOC[1][1], { nowMs: GIO }).ma, 0);
  const { lanDocHieuLuc } = await nap(GOI, 'han-muc.mjs');
  const { lan } = lanDocHieuLuc(dot, { nowMs: GIO + 2 * PHUT });
  assert.deepEqual(lan, docHanMuc(dot).doc.at(-1));
  assert.equal(lan.nguon, 'get-usage');
});

test('DP4-02-do khong-dot', () => {
  const kho = tam('dp4-trong-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const truoc = bamCay(kho);
  const r = hanMuc(kho, 'mod', FX.rateLimits);
  assert.equal(r.ma, 0, r.err);
  assert.equal(r.out.trim(), 'khong-co-dot');
  assert.equal(bamCay(kho), truoc, 'kho không đợt: cây phải không đổi');
  const { kho: k2, dot } = khoLienKet();
  assert.equal(hanMuc(k2, 'mod', FX.rateLimits).ma, 0);
  assert.ok(fs.existsSync(path.join(dot, 'han-muc.json')), 'đối chứng dương: kho có đợt thì tệp được tạo');
});

// ---------- DP4-04: khoá cấu hình han_muc và thẻ khởi tạo (AC-4, E4) ----------
const HM_MAU = { bao_truoc_pct: 80, ban_giao_pct: 90, cho_ban_giao_phut: 20, cho_dat_lai_phut: 45 };
test('DP4-04 cau-hinh', async () => {
  const { kiemCauHinh } = await nap(GOI, 'hinh-dang.mjs');
  const khuon = docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'));
  assert.doesNotThrow(() => kiemCauHinh(khuon));
  assert.deepEqual(khuon.han_muc, HM_MAU);
  assert.doesNotThrow(() => kiemCauHinh(docJ(path.join(DAY, 'fixtures', 'dot-crm-0910', 'dieu-phoi.config.json'))));
  const { cho_dat_lai_phut: _bo, ...thieu } = HM_MAU;
  const SAI = [
    [{ ...khuon, han_muc: thieu }, 'han_muc.cho_dat_lai_phut'],
    [{ ...khuon, han_muc: { ...HM_MAU, ban_giao_pct: 120 } }, 'han_muc.ban_giao_pct'],
    [{ ...khuon, han_muc: { ...HM_MAU, bao_truoc_pct: 90, ban_giao_pct: 90 } }, 'han_muc.bao_truoc_pct'],
    [{ ...khuon, han_muc: { ...HM_MAU, x: 1 } }, 'han_muc.x'],
  ];
  const dong = SAI.map(([cfg, khoa]) => {
    let thong = '';
    try {
      kiemCauHinh(cfg);
    } catch (e) {
      thong = e.message;
    }
    assert.ok(thong.includes(khoa), `${khoa}: «${thong}»`);
    return `${khoa} · ${thong}`;
  });
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 4);
  assert.doesNotThrow(() => kiemCauHinh({ ...khuon, han_muc: { ...HM_MAU, bao_truoc_pct: 89, ban_giao_pct: 90 } }), 'biên {89, 90} qua');
});

test('DP4-04 the-khoi-tao', () => {
  const hm = { bao_truoc_pct: 70, ban_giao_pct: 85, cho_ban_giao_phut: 15, cho_dat_lai_phut: 30 };
  const { kho } = khoLienKet({ cauHinh: { han_muc: hm } });
  const r = chayCli(kho, ['the', 'khoi-tao', '--json']);
  assert.equal(r.ma, 0, r.err);
  const the = JSON.parse(r.out);
  console.log(`  hoi: ${JSON.stringify(the.hoi)} · han_muc: ${JSON.stringify(the.han_muc)}`);
  assert.ok(the.hoi.includes('khau-vi-han-muc'));
  assert.deepEqual(the.han_muc, hm);
});

// ---------- DP4-02 (phần chẩn đoán): mục han-muc (AC-2, E2) ----------
const mucCua = (ds, ten) => ds.find((m) => m.muc === ten) ?? null;
const chanDoanJson = (cwd, them = [], env = {}) => {
  const r = chayCli(cwd, ['chan-doan', '--json', ...them], { env });
  assert.equal(r.ma, 0, r.err);
  return JSON.parse(r.out);
};
function datNhanLuc(dot, luc) {
  const p = path.join(dot, 'vai.json');
  const v = docJ(p);
  ghiJ(p, { ...v, giam_sat: { ...v.giam_sat, nhan_luc: luc } });
}
test('DP4-02 chan-doan-han-muc', () => {
  const luc = (ms) => ({ DIEU_PHOI_NOW_MS: String(ms) });
  const hang = [];
  {
    const { kho } = khoLienKet();
    const m = mucCua(chanDoanJson(kho, [], luc(GIO)), 'han-muc');
    hang.push(['không lần đọc', m?.trang_thai, m?.viec]);
  }
  {
    const { kho } = khoLienKet();
    assert.equal(hanMuc(kho, 'mod', FX.rateLimits, { nowMs: GIO }).ma, 0);
    const m = mucCua(chanDoanJson(kho, [], luc(GIO + 40 * PHUT)), 'han-muc');
    hang.push(['lần đọc 40′', m?.trang_thai, m?.viec]);
  }
  {
    const { kho, dot } = khoLienKet();
    assert.equal(hanMuc(kho, 'mod', FX.rateLimits, { phien: 's-khac', nowMs: GIO }).ma, 0);
    datNhanLuc(dot, new Date(GIO + 5 * PHUT).toISOString());
    const m = mucCua(chanDoanJson(kho, [], luc(GIO + 10 * PHUT)), 'han-muc');
    hang.push(['phiên khác trước nhận vai', m?.trang_thai, m?.viec]);
  }
  {
    const { kho, dot } = khoLienKet();
    datNhanLuc(dot, new Date(GIO - 5 * PHUT).toISOString());
    assert.equal(hanMuc(kho, 'mod', FX.rateLimits, { phien: 's-khac', nowMs: GIO }).ma, 0);
    const m = mucCua(chanDoanJson(kho, [], luc(GIO + 10 * PHUT)), 'han-muc');
    hang.push(['có lần đọc hiệu lực', m?.trang_thai, m?.viec]);
  }
  console.log(hang.map((h) => `  ${h[0]} · ${h[1]} · ${h[2]}`).join('\n'));
  for (const [ten, tt, viec] of hang.slice(0, 3)) {
    assert.equal(tt, 'thieu', ten);
    assert.ok(viec.includes('get_usage') && viec.includes('han-muc --nguon get-usage'), `${ten}: ${viec}`);
  }
  assert.equal(hang[3][1], 'du', 'đối chứng dương');
  const { kho } = khoLienKet({ cauHinh: { han_muc: undefined } });
  const ds = chanDoanJson(kho, [], luc(GIO));
  assert.equal(mucCua(ds, 'han-muc'), null, `đợt không khai han_muc: ${ds.map((m) => m.muc).join(', ')}`);
});

// ---------- DP4-03: xét hạn mức trong nhịp bộ phát lịch (AC-3, E3) ----------
const T = GIO;
const ISO = (ms) => new Date(ms).toISOString();
// Một lần đọc của ma trận: nguồn, phiên, tuổi (phút), và % + giờ đặt lại (phút từ T) mỗi cửa sổ.
const docVao = (kho, { nguon = 'mod', phien = 's-gs', tuoi = 2, nam, tuan }) => {
  const cs = [];
  if (nam) cs.push(['five_hour', nam[0], T + nam[1] * PHUT]);
  if (tuan) cs.push(['seven_day', tuan[0], T + tuan[1] * PHUT]);
  const du = nguon === 'mod'
    ? cs.map(([kind, p, r]) => ({ kind, percentUsed: p, resetsAt: ISO(r) }))
    : { windows: cs.map(([k, p, r]) => ({ label: k === 'five_hour' ? '5-hour limit' : 'Weekly · all models', percentUsed: p, resetsAt: ISO(r) })) };
  const r = hanMuc(kho, nguon, du, { phien, nowMs: T - tuoi * PHUT });
  assert.equal(r.ma, 0, r.err);
};
const SU_HM = new Set(['gan-han-muc', 'cham-han-muc', 'cho-dat-lai']);
// Hàng: [nhãn, dựng(kho, dot), số nhịp, kỳ vọng {su, pha, nguong?, khoa?, cho?}]. Số 80, 84 tính tay.
const MA_TRAN_HM = [
  ['a', (k) => docVao(k, { nam: [50, 180] }), 1, { su: [], pha: 'dang-chay' }],
  ['b', (k) => docVao(k, { nam: [82, 180] }), 1, { su: ['gan-han-muc'], pha: 'dang-chay' }],
  ['c', (k) => docVao(k, { nam: [82, 180] }), 2, { su: ['gan-han-muc'], pha: 'dang-chay' }],
  ['d', (k, w1) => { docVao(k, { nam: [91, 30] }); chayCli(w1, ['xin', 's4']); }, 1, { su: ['cho-dat-lai'], pha: 'dang-chay', khoa: false, cho: true }],
  ['e', (k) => docVao(k, { nam: [91, 180] }), 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao', boi: 'phat-lich' }],
  ['f', (k) => docVao(k, { nam: [91, 180], tuoi: 40 }), 1, { su: [], pha: 'dang-chay' }],
  ['g', (k, w1, dot) => { docVao(k, { nam: [91, 180], phien: 's-khac' }); datNhanLuc(dot, ISO(T - 1 * PHUT)); }, 1, { su: [], pha: 'dang-chay' }],
  ['h', (k, w1, dot) => { docVao(k, { nam: [91, 180], phien: 's-gs' }); datNhanLuc(dot, ISO(T - 1 * PHUT)); }, 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao' }],
  ['i', (k) => { for (const [tuoi, p] of [[30, 37], [15, 59.5], [0, 82]]) docVao(k, { nguon: 'get-usage', tuoi, nam: [p, 180] }); }, 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao', nguong: 80 }],
  ['j', (k) => docVao(k, { nam: [40, 180], tuan: [91, 3000] }), 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao', cuaSo: 'seven_day' }],
  ['k', (k, w1, dot) => ghiJ(path.join(dot, 'ban-giao', 'dau', 'P1.json'), { day: 'P1', phien: 's-p1', luc: ISO(T - PHUT), loi: 'rate_limit', wip: null, luot_do: false }), 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao', lyDo: 'P1' }],
  ['l', (k) => docVao(k, { nam: [99, 180] }), 1, { su: [], pha: 'dang-chay', khongHanMuc: true }],
  ['m', (k) => { for (const [tuoi, p] of [[30, 79], [15, 82], [0, 85]]) docVao(k, { nguon: 'get-usage', tuoi, nam: [p, 180] }); }, 1, { su: ['cham-han-muc'], pha: 'dang-ban-giao', nguong: 84 }],
  ['n', (k) => { for (const [tuoi, p] of [[30, 77], [15, 80], [0, 83]]) docVao(k, { nguon: 'get-usage', tuoi, nam: [p, 180] }); }, 1, { su: ['gan-han-muc'], pha: 'dang-chay', nguong: 84 }],
  ['o', (k, w1) => { docVao(k, { nam: [91, 30] }); chayCli(w1, ['xin', 's4']); }, 'dat-lai', { su: ['cho-dat-lai'], pha: 'dang-chay', khoa: true, cho: false }],
];

async function chayHangHm([nhan, dung, soNhip, mong], gocGoi = GOI) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const { kho, dot, w1 } = khoLienKet({ gocGoi, cauHinh: mong.khongHanMuc ? { han_muc: undefined } : {} });
  datNhanLuc(dot, ISO(T - 60 * PHUT));
  dung(kho, w1, dot);
  await motNhip(dot, T, gocGoi);
  if (soNhip === 2) await motNhip(dot, T + PHUT, gocGoi);
  if (soNhip === 'dat-lai') {
    docVao(kho, { nam: [10, 330], tuoi: -31 });
    await motNhip(dot, T + 31 * PHUT, gocGoi);
  }
  const su = suKienCua(dot).filter((e) => SU_HM.has(e.loai));
  const dk = docJ(path.join(dot, 'dieu-khien.json'));
  const tt = docJ(path.join(dot, 'trang-thai.json'));
  const loi = [];
  const thuc = su.map((e) => e.loai);
  if (JSON.stringify(thuc) !== JSON.stringify(mong.su)) loi.push(`(${nhan}) sự kiện [${thuc}], cần [${mong.su}]`);
  if (dk.pha !== mong.pha) loi.push(`(${nhan}) pha ${dk.pha}, cần ${mong.pha}`);
  if (mong.boi && dk.dat_boi !== mong.boi) loi.push(`(${nhan}) dat_boi ${dk.dat_boi}, cần ${mong.boi}`);
  if (mong.nguong != null) {
    const ng = tt.han_muc?.cua_so?.find((w) => w.ten === 'five_hour')?.nguong_ban_giao;
    if (ng !== mong.nguong) loi.push(`(${nhan}) ngưỡng hiệu lực ${ng}, cần ${mong.nguong}`);
  }
  if (mong.cuaSo && !su.some((e) => e.cua_so === mong.cuaSo)) loi.push(`(${nhan}) sự kiện không mang cửa sổ ${mong.cuaSo}`);
  if (mong.lyDo && !String(dk.ly_do).includes(mong.lyDo)) loi.push(`(${nhan}) lý do «${dk.ly_do}» không nêu ${mong.lyDo}`);
  if (mong.khoa != null && fs.existsSync(path.join(dot, 'khoa', 's4', 'chu.json')) !== mong.khoa) loi.push(`(${nhan}) khoá s4 ${mong.khoa ? 'không được cấp' : 'bị cấp'}`);
  if (mong.cho != null && Boolean(tt.cho_dat_lai) !== mong.cho) loi.push(`(${nhan}) cho_dat_lai ${tt.cho_dat_lai ? 'có' : 'vắng'}`);
  return { nhan, thuc, pha: dk.pha, loi };
}

test('DP4-03 ma-tran', async () => {
  const kq = [];
  for (const hang of MA_TRAN_HM) kq.push(await chayHangHm(hang));
  console.log(kq.map((r) => `  (${r.nhan}) · [${r.thuc}] · ${r.pha}${r.loi.length ? ` · ${r.loi.join('; ')}` : ''}`).join('\n'));
  assert.equal(kq.length, 15);
  assert.deepEqual(kq.flatMap((r) => r.loi), []);
});

test('DP4-03-do bo-ve-giam-sat', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', 'han-muc.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace(' || l.phien === gs?.phien', '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const lech = [];
  for (const hang of MA_TRAN_HM) {
    const r = await chayHangHm(hang, sao);
    if (r.loi.length) lech.push(r.nhan);
  }
  console.log(`  hàng lệch trên bản tiêm: ${lech.join(', ')}`);
  assert.deepEqual(lech, ['h']);
});
