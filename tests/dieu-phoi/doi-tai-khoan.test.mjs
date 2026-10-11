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
  // Giờ vào pha và nhịp chung MỘT đồng hồ: vao_luc cố định + nhịp theo giờ thật thì sau 20′ bước bàn giao rời pha ★
  // trước khi cấp — ca xanh rỗng và chiều đỏ câm (đo 11/10, sau 08:10Z).
  const now = Date.now();
  datTruc(dot, pha, { vaoLuc: new Date(now - PHUT).toISOString() });
  const bamXin = bamCay(path.join(dot, 'xin'));
  await motNhip(dot, now, gocGoi);
  const loi = [];
  const sau = docJ(path.join(dot, 'dieu-khien.json')).pha;
  if (sau !== pha) loi.push(`${pha}: nhịp rời pha (${sau})`);
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
  // Hồ sơ dieu-phoi-sua-truoc-dot-thu (E1, Ngoài-1 của hồ sơ này): khẩu vị hạn mức không có lối ghi nên không hỏi —
  // thẻ giữ trường han_muc làm thông tin.
  assert.ok(!the.hoi.includes('khau-vi-han-muc'), `hoi không được có khau-vi-han-muc: ${JSON.stringify(the.hoi)}`);
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

// ---------- DP4-05: lệnh con ban-giao, ban-giao-xong (AC-5, E5) ----------
const envGio = (ms) => ({ DIEU_PHOI_NOW_MS: String(ms) });
const dk = (dot) => docJ(path.join(dot, 'dieu-khien.json'));
// Remote giả là một kho bare; nhánh p1, p2 đẩy lúc dựng để «đã đẩy» đo được.
function khoCoRemote(tuyChon = {}) {
  const k = khoLienKet(tuyChon);
  const bare = path.join(tam('dp4-remote-'), 'r.git');
  execFileSync('git', ['init', '-q', '--bare', bare], { env: ENV });
  execFileSync('git', ['remote', 'add', 'origin', bare], { cwd: k.kho, env: ENV });
  for (const [w, nh] of [[k.w1, 'p1'], [k.w2, 'p2']]) execFileSync('git', ['push', '-q', '-u', 'origin', nh], { cwd: w, env: ENV, stdio: 'ignore' });
  const refs = () => execFileSync('git', ['for-each-ref', '--format=%(refname) %(objectname)'], { cwd: bare, env: ENV, encoding: 'utf8' });
  return { ...k, bare, refs };
}

test('DP4-05 ban-giao', () => {
  const { kho, dot } = khoLienKet();
  const r1 = chayCli(kho, ['ban-giao', '--ly-do', 'đổi tài khoản', '--json']);
  assert.equal(r1.ma, 0, r1.err);
  const d1 = dk(dot);
  assert.equal(d1.pha, 'dang-ban-giao');
  assert.equal(d1.ban_giao.pha_truoc, 'dang-chay');
  const r2 = chayCli(kho, ['ban-giao', '--json']);
  assert.equal(r2.ma, 0, r2.err);
  const d2 = dk(dot);
  assert.equal(d2.ban_giao.ma, d1.ban_giao.ma, 'chạy lại giữ mã');
  assert.equal(d2.lich_su.length, d1.lich_su.length, 'chạy lại không thêm dòng lịch sử pha');
  const cam = ['nhap', 'dang-dong', 'cho-tiep-tuc'].map((pha) => {
    datTruc(dot, pha);
    const r = chayCli(kho, ['ban-giao']);
    assert.equal(r.ma, 1, `${pha}: ${r.out}`);
    assert.match(r.err, new RegExp(pha));
    return `${pha} · ${r.err.trim()}`;
  });
  console.log(cam.map((c) => `  ${c}`).join('\n'));
});

const KHOA_XONG = ['co_wip', 'da_day', 'day', 'dinh', 'luc', 'ma', 'nhanh', 'phien_cu'];
test('DP4-05 ban-giao-xong', () => {
  const k = khoCoRemote();
  const { kho, dot, w1, w2 } = k;
  const refTruoc = k.refs();
  chayHook('PostToolUse', { session_id: 's-cu' }, { cwd: w1 });
  assert.equal(chayCli(kho, ['ban-giao']).ma, 0);
  const hang = [];
  fs.writeFileSync(path.join(w1, 'ban.txt'), 'x');
  let r = chayCli(w1, ['ban-giao-xong']);
  hang.push(['a', r.ma === 1 && r.err.includes('ban.txt'), r.err.trim()]);
  fs.rmSync(path.join(w1, 'ban.txt'));
  assert.equal(chayCli(w1, ['xin', 's4']).ma, 0);
  r = chayCli(w1, ['ban-giao-xong']);
  hang.push(['b', r.ma === 1 && r.err.includes('xin/P1-s4.json'), r.err.trim()]);
  fs.rmSync(path.join(dot, 'xin', 'P1-s4.json'));
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'hang-a', loai: 's4', worktree: w1, cap_luc: ISO(Date.now()), han_thue_den: ISO(Date.now() + 90 * PHUT) });
  r = chayCli(w1, ['ban-giao-xong']);
  hang.push(['c', r.ma === 1 && r.err.includes('đang xong'), r.err.trim()]);
  fs.rmSync(path.join(dot, 'khoa', 's4'), { recursive: true });
  r = chayCli(kho, ['ban-giao-xong']);
  hang.push(['d', r.ma === 1 && r.err.includes('ban-giao-xong'), r.err.trim()]);
  r = chayCli(w1, ['ban-giao-xong']);
  const x1 = fs.existsSync(path.join(dot, 'ban-giao', 'xong', 'P1.json')) ? docJ(path.join(dot, 'ban-giao', 'xong', 'P1.json')) : {};
  hang.push(['e', r.ma === 0 && JSON.stringify(Object.keys(x1).sort()) === JSON.stringify(KHOA_XONG) && x1.phien_cu.includes('s-cu') && x1.da_day === true, `${r.err.trim()} ${JSON.stringify(x1)}`]);
  fs.writeFileSync(path.join(w2, 'do.txt'), 'dở');
  r = chayCli(w2, ['ban-giao-xong', '--wip', 'dở S3']);
  const tieuDe = git(w2, 'log', '-1', '--format=%s');
  const sach = git(w2, 'status', '--porcelain') === '';
  hang.push(['f', r.ma === 0 && tieuDe === 'wip(ban-giao): dở S3' && sach && fs.existsSync(path.join(dot, 'ban-giao', 'xong', 'P2.json')), `${r.err.trim()} · ${tieuDe} · sạch=${sach}`]);
  console.log(hang.map(([n, ok, ct]) => `  (${n}) · ${ok ? 'đúng' : 'SAI'} · ${ct}`).join('\n'));
  assert.equal(hang.length, 6);
  assert.deepEqual(hang.filter(([, ok]) => !ok).map(([n]) => n), []);
  assert.equal(k.refs(), refTruoc, 'không lời gọi nào đẩy nhánh');
});

// ---------- DP4-06: dựng ban-giao.json + đồng hồ bàn giao (AC-6, E6) ----------
function hoSoThu(w, slug, status) {
  const d = path.join(w, '_acceptance', slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'contract.md'), `---\nstatus: ${status}\n---\n`);
  git(w, 'add', '-A');
  git(w, 'commit', '-q', '-m', `ho so ${slug}`);
}
function giuS4(dot, day, w, nhipMs) {
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: day, slug: 'hang-b', loai: 's4', worktree: w, cap_luc: ISO(T - 30 * PHUT), han_thue_den: ISO(T + 90 * PHUT) });
  const p = path.join(dot, 'khoa', 's4', 'nhip');
  fs.writeFileSync(p, ISO(nhipMs));
  fs.utimesSync(p, new Date(nhipMs), new Date(nhipMs));
}
// Đợt vào bàn giao lúc T (CLI thật, đồng hồ giả), P1 báo xong; `p2` = 'chua' | 'xong' | 's4-song' | 's4-cu'.
function dotBanGiao({ p2 = 'chua', cauHinh = {} } = {}) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoCoRemote({ cauHinh });
  hoSoThu(k.w2, 'hang-b', 'implemented');
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { env: envGio(T) }).ma, 0);
  const r1 = chayCli(k.w1, ['ban-giao-xong'], { env: envGio(T + PHUT) });
  assert.equal(r1.ma, 0, r1.err);
  if (p2 === 'xong') assert.equal(chayCli(k.w2, ['ban-giao-xong'], { env: envGio(T + PHUT) }).ma, 0);
  if (p2 === 's4-song') giuS4(k.dot, 'P2', k.w2, T + 4 * PHUT);
  if (p2 === 's4-cu') giuS4(k.dot, 'P2', k.w2, T - 20 * PHUT);
  return k;
}
const tepBg = (dot) => path.join(dot, 'ban-giao.json');
const mucBg = (dot, id) => docJ(tepBg(dot)).day.find((m) => m.id === id);

test('DP4-06 dong-ho', async () => {
  const hang = [];
  let k = dotBanGiao();
  await motNhip(k.dot, T + 5 * PHUT);
  hang.push(['a', !fs.existsSync(tepBg(k.dot)) && dk(k.dot).pha === 'dang-ban-giao']);
  k = dotBanGiao({ p2: 's4-song' });
  await motNhip(k.dot, T + 5 * PHUT);
  hang.push(['b', fs.existsSync(tepBg(k.dot)) && mucBg(k.dot, 'P2').ban_giao === 'dang-xong' && mucBg(k.dot, 'P2').cham_lai_cung_round === true && dk(k.dot).pha === 'dang-ban-giao']);
  k = dotBanGiao();
  await motNhip(k.dot, T + 21 * PHUT);
  hang.push(['c', fs.existsSync(tepBg(k.dot)) && mucBg(k.dot, 'P2').ban_giao === 'do' && dk(k.dot).pha === 'cho-tiep-tuc']);
  k = dotBanGiao({ p2: 's4-cu' });
  await motNhip(k.dot, T + 5 * PHUT);
  hang.push(['d', dk(k.dot).pha === 'cho-tiep-tuc']);
  k = dotBanGiao({ p2: 'xong' });
  await motNhip(k.dot, T + 5 * PHUT);
  const dung = suKienCua(k.dot).filter((e) => e.loai === 'ban-giao-dung');
  hang.push(['e', dk(k.dot).pha === 'cho-tiep-tuc' && dung.length === 1 && dung[0].can_phan === true && dung[0].dich === 'owner' && dung[0].tin.includes('/dieu-phoi:tiep-tuc')]);
  k = dotBanGiao({ cauHinh: { han_muc: undefined } });
  await motNhip(k.dot, T + 19 * PHUT);
  const doiChung = !fs.existsSync(tepBg(k.dot)) && dk(k.dot).pha === 'dang-ban-giao';
  await motNhip(k.dot, T + 21 * PHUT);
  hang.push(['f', doiChung && mucBg(k.dot, 'P2').ban_giao === 'do' && dk(k.dot).pha === 'cho-tiep-tuc']);
  console.log(hang.map(([n, ok]) => `  (${n}) · ${ok ? 'đúng' : 'SAI'}`).join('\n'));
  assert.equal(hang.length, 6);
  assert.deepEqual(hang.filter(([, ok]) => !ok).map(([n]) => n), []);
});

test('DP4-06 tu-git', async () => {
  const k = dotBanGiao({ p2: 'xong' });
  await motNhip(k.dot, T + 5 * PHUT);
  for (const [id, w] of [['P1', k.w1], ['P2', k.w2]]) {
    const m = mucBg(k.dot, id);
    const thuc = {
      nhanh: git(w, 'rev-parse', '--abbrev-ref', 'HEAD'),
      dinh: git(w, 'rev-parse', 'HEAD'),
      da_day: (() => { try { return git(w, 'rev-parse', '@{u}') === git(w, 'rev-parse', 'HEAD'); } catch { return false; } })(),
      co_wip: git(w, 'log', '-1', '--format=%s').startsWith('wip(ban-giao)'),
    };
    console.log(`  ${id}: ${JSON.stringify(thuc)}`);
    assert.deepEqual({ nhanh: m.nhanh, dinh: m.dinh, da_day: m.da_day, co_wip: m.co_wip }, thuc, id);
  }
});

test('DP4-06 khuon', async () => {
  // Hàng có khoá s4 sống để mảng `khoa` không rỗng — so được cả khoá con của nó.
  const k = dotBanGiao({ p2: 's4-song' });
  await motNhip(k.dot, T + 5 * PHUT);
  assert.deepEqual(khoaSau(docJ(tepBg(k.dot))), khoaSau(docJ(path.join(GOI, 'scripts', 'mau', 'ban-giao.json'))));
  assert.deepEqual(khoaSau(docJ(path.join(k.dot, 'ban-giao', 'xong', 'P1.json'))), khoaSau(docJ(path.join(GOI, 'scripts', 'mau', 'ban-giao-xong.json'))));
});

test('DP4-06 cung-ham', async () => {
  const k = dotBanGiao();
  const vao = dk(k.dot).ban_giao;
  const r = chayCli(k.kho, ['ban-giao'], { env: envGio(T + 21 * PHUT) });
  assert.equal(r.ma, 0, r.err);
  const quaCli = docJ(tepBg(k.dot));
  datTruc(k.dot, 'dang-ban-giao', { vaoLuc: vao.vao_luc });
  const p = path.join(k.dot, 'dieu-khien.json');
  ghiJ(p, { ...docJ(p), ban_giao: vao });
  fs.rmSync(tepBg(k.dot));
  await motNhip(k.dot, T + 21 * PHUT);
  const quaNhip = docJ(tepBg(k.dot));
  const bo = ({ luc: _l, ...con }) => con;
  assert.deepEqual(bo(quaNhip), bo(quaCli));
  // Lời ghi danh của tiep-tuc cho P2 (không phiên sống → mo-chip) mang mục dãy của CÙNG hàm.
  chayHook('PostToolUse', { session_id: 's-gs' }, { cwd: k.kho, nowMs: T + 20 * PHUT });
  const keHoach = (await nap(GOI, 'tiep-tuc.mjs')).keHoachDay(k.dot, { nowMs: T + 21 * PHUT });
  const p2 = keHoach.find((x) => x.day === 'P2');
  assert.equal(p2.hanh_dong, 'mo-chip');
  const CHUNG = ['hang', 'slug', 'trang_thai_ho_so', 'nhanh', 'dinh', 'da_day', 'co_wip'];
  const lay = (o) => Object.fromEntries(CHUNG.map((x) => [x, o[x]]));
  console.log(`  P2 ghi danh: ${JSON.stringify(lay(p2.muc))}`);
  assert.deepEqual(lay(p2.muc), lay(quaNhip.day.find((m) => m.id === 'P2')));
});

// ---------- DP4-07: tiếp tục sau bàn giao (AC-7, E7) ----------
const docB = (kho, p5, gio, gocGoi = GOI) => {
  const du = { windows: [{ label: '5-hour limit', percentUsed: p5, resetsAt: ISO(T + 180 * PHUT) }, { label: 'Weekly · all models', percentUsed: 10, resetsAt: ISO(T + 3000 * PHUT) }] };
  const r = chayCli(kho, ['han-muc', '--nguon', 'get-usage', '--phien', 'B', '--doc', JSON.stringify(du)], { gocGoi, env: envGio(gio) });
  assert.equal(r.ma, 0, r.err);
};
// Dựng một hàng: `pha` ★ đích, `phaTruoc`, trạng thái P2 ('xong' | 'chua' | 's4-song'), mức B đọc (null = không đọc).
async function hangTiepTuc({ pha, phaTruoc = 'dang-chay', p2 = 'xong', p5B = 30 }, gocGoi = GOI) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet({ gocGoi });
  hoSoThu(k.w2, 'hang-b', 'implemented');
  if (phaTruoc === 'tam-dung') assert.equal(chayCli(k.kho, ['pha', 'tam-dung', '--boi', 't'], { gocGoi }).ma, 0);
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { gocGoi, env: envGio(T) }).ma, 0);
  assert.equal(chayCli(k.w1, ['ban-giao-xong'], { gocGoi, env: envGio(T + PHUT) }).ma, 0);
  if (p2 === 'xong') assert.equal(chayCli(k.w2, ['ban-giao-xong'], { gocGoi, env: envGio(T + PHUT) }).ma, 0);
  if (p2 === 's4-song') giuS4(k.dot, 'P2', k.w2, T + 4 * PHUT);
  ghiJ(path.join(k.dot, 'ban-giao', 'dau', 'P1.json'), { day: 'P1', phien: 's-p1', luc: ISO(T + 2 * PHUT), loi: 'rate_limit', wip: null, luot_do: false });
  if (pha === 'cho-tiep-tuc') {
    await motNhip(k.dot, T + 5 * PHUT, gocGoi);
    assert.equal(dk(k.dot).pha, 'cho-tiep-tuc', 'fixture: nhịp thật dựng bàn giao');
  }
  if (p5B != null) docB(k.kho, p5B, T + 6 * PHUT, gocGoi);
  return k;
}
function tiepTucB(k, gocGoi = GOI) {
  const r = chayCli(k.kho, ['tiep-tuc', '--phien', 'B', '--json'], { gocGoi, env: envGio(T + 7 * PHUT) });
  chayCli(k.kho, ['dung'], { gocGoi });
  return r;
}
const tepLichSu = (dot) => {
  const d = path.join(dot, 'ban-giao', 'lich-su');
  return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.json')).sort() : [];
};
const MA_TRAN_TT = [
  ['a', { pha: 'cho-tiep-tuc', p5B: null }, (k, kq) => kq.can_doc_han_muc === true && dk(k.dot).pha === 'cho-tiep-tuc'],
  ['b', { pha: 'cho-tiep-tuc', p5B: 85 }, (k, kq) => kq.khuyen_cho?.cua_so === 'five_hour' && kq.khuyen_cho?.dat_lai === ISO(T + 180 * PHUT) && dk(k.dot).pha === 'cho-tiep-tuc'],
  ['c', { pha: 'cho-tiep-tuc' }, (k, kq, bgCu) => {
    const ls = tepLichSu(k.dot);
    if (ls.length !== 1) return false;
    const h = docJ(path.join(k.dot, 'ban-giao', 'lich-su', ls[0]));
    const { trang_thai: _t, tiep_tuc_luc: _l, tiep_tuc_boi: boi, dau, phien_da_biet: _pdb, ...con } = h;
    const { trang_thai: _t2, ...cu } = bgCu;
    return JSON.stringify(con) === JSON.stringify(cu) && h.trang_thai === 'da-tiep-tuc' && boi === 'B' && dau.some((x) => x.day === 'P1')
      && !fs.existsSync(path.join(k.dot, 'ban-giao.json')) && !(fs.existsSync(path.join(k.dot, 'ban-giao', 'dau')) && fs.readdirSync(path.join(k.dot, 'ban-giao', 'dau')).length)
      && dk(k.dot).pha === 'dang-chay' && /chạy bộ phát lịch|đang chạy/.test(String(kq.phat_lich));
  }],
  ['d', { pha: 'cho-tiep-tuc', phaTruoc: 'tam-dung' }, (k) => dk(k.dot).pha === 'tam-dung' && tepLichSu(k.dot).length === 1],
  ['e', { pha: 'dang-ban-giao' }, (k) => {
    const ls = dk(k.dot).lich_su.slice(-2).map((x) => x.pha);
    return tepLichSu(k.dot).length === 1 && dk(k.dot).pha === 'dang-chay' && JSON.stringify(ls) === JSON.stringify(['cho-tiep-tuc', 'dang-chay']);
  }],
  ['f', { pha: 'dang-ban-giao', phaTruoc: 'tam-dung', p2: 'chua' }, (k) => {
    const ls = tepLichSu(k.dot);
    return ls.length === 1 && docJ(path.join(k.dot, 'ban-giao', 'lich-su', ls[0])).day.find((m) => m.id === 'P2').ban_giao === 'do' && dk(k.dot).pha === 'tam-dung';
  }],
  ['g', { pha: 'dang-ban-giao', p2: 's4-song' }, (k, kq, bgCu, bamKhoa) => {
    const ls = tepLichSu(k.dot);
    return ls.length === 1 && docJ(path.join(k.dot, 'ban-giao', 'lich-su', ls[0])).day.find((m) => m.id === 'P2').ban_giao === 'dang-xong'
      && bamTep(path.join(k.dot, 'khoa', 's4', 'chu.json')) === bamKhoa && dk(k.dot).pha === 'dang-chay';
  }],
];
async function chayHangTt([nhan, cfg, kiem], gocGoi = GOI) {
  const k = await hangTiepTuc(cfg, gocGoi);
  const bgCu = fs.existsSync(path.join(k.dot, 'ban-giao.json')) ? docJ(path.join(k.dot, 'ban-giao.json')) : null;
  const pKhoa = path.join(k.dot, 'khoa', 's4', 'chu.json');
  const bamKhoa = fs.existsSync(pKhoa) ? bamTep(pKhoa) : null;
  const r = tiepTucB(k, gocGoi);
  let kq = {};
  try { kq = JSON.parse(r.out); } catch { kq = {}; }
  const vai = docJ(path.join(k.dot, 'vai.json'));
  const nhanVai = vai.lich_su.some((x) => x.phien === 's-gs' && x.thoi_luc) && vai.giam_sat.phien === 'B';
  const ok = r.ma === 0 && nhanVai && kiem(k, kq, bgCu, bamKhoa);
  return { nhan, ok, chi: `${r.ma} · pha ${dk(k.dot).pha} · ${r.err.trim().slice(0, 120)}`, k };
}

test('DP4-07 tiep-tuc', async () => {
  const kq = [];
  for (const hang of MA_TRAN_TT) kq.push(await chayHangTt(hang));
  const lan2 = kq.find((x) => x.nhan === 'c').k;
  const bamDk = bamTep(path.join(lan2.dot, 'dieu-khien.json'));
  const soLs = tepLichSu(lan2.dot).length;
  const r = tiepTucB(lan2);
  kq.push({ nhan: 'h', ok: r.ma === 0 && tepLichSu(lan2.dot).length === soLs && bamTep(path.join(lan2.dot, 'dieu-khien.json')) === bamDk, chi: `${r.ma}` });
  console.log(kq.map((x) => `  (${x.nhan}) · ${x.ok ? 'đúng' : 'SAI'} · ${x.chi}`).join('\n'));
  assert.equal(kq.length, 8);
  assert.deepEqual(kq.filter((x) => !x.ok).map((x) => x.nhan), []);
});

test('DP4-07-do goi-thang', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', 'ban-giao.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("  if (dk.pha === 'dang-ban-giao') buocBanGiao(thuMuc, { nowMs: now, cuongBuc: true });", "  if (dk.pha === 'dang-ban-giao') datPha(thuMuc, dk.ban_giao.pha_truoc, { boi: 'tiep-tuc', nowMs: now });");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const f = await chayHangTt(MA_TRAN_TT.find((h) => h[0] === 'f'), sao);
  console.log(`  (f) trên bản tiêm: ${f.ok ? 'đúng' : 'SAI'} · ${f.chi}`);
  assert.equal(f.ok, false);
  assert.match(f.chi, /không có trong bảng chuyển/);
});

// ---------- DP4-08: phiên đã bàn giao không tính sống (AC-8, E8) ----------
async function dotPhienCu(gocGoi = GOI) {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet({ gocGoi });
  // Đợt mở từ gói chỉ giao hàng đã quyết build (hồ sơ dieu-phoi-sua-truoc-dot-thu, B1): hai hàng có ô build.
  for (const s of ['hang-a', 'hang-b']) {
    fs.mkdirSync(path.join(k.kho, '_acceptance', s), { recursive: true });
    fs.writeFileSync(path.join(k.kho, '_acceptance', s, 'opportunity.md'), '---\nstage: decided\ndecision: build\n---\n');
  }
  chayHook('PostToolUse', { session_id: 's-cu' }, { cwd: k.w1, nowMs: T + 30_000, gocGoi });
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { gocGoi, env: envGio(T) }).ma, 0);
  assert.equal(chayCli(k.w1, ['ban-giao-xong'], { gocGoi, env: envGio(T + PHUT) }).ma, 0);
  giuS4(k.dot, 'P2', k.w2, T + 4 * PHUT);
  await motNhip(k.dot, T + 5 * PHUT, gocGoi);
  assert.ok(fs.existsSync(path.join(k.dot, 'ban-giao.json')), 'fixture: bàn giao mở đã dựng');
  return k;
}
function hanhDong(k, gocGoi = GOI, gio = T + 6 * PHUT) {
  const cd = JSON.parse(chayCli(k.kho, ['chan-doan', '--json', '--chi-tiet', '--phien', 's-gs'], { gocGoi, env: envGio(gio) }).out);
  const tt = JSON.parse(chayCli(k.kho, ['tiep-tuc', '--phien', 's-gs', '--json'], { gocGoi, env: envGio(gio) }).out);
  chayCli(k.kho, ['dung'], { gocGoi });
  const tu = (id) => ({ cd: cd.find((m) => m.muc === `day:${id}`)?.chi_tiet ?? {}, tt: tt.ke_hoach.find((x) => x.day === id) ?? {} });
  return { P1: tu('P1'), P2: tu('P2') };
}

test('DP4-08 phien-cu', async () => {
  const k = await dotPhienCu();
  const h = hanhDong(k);
  console.log(`  P1: ${h.P1.cd.hanh_dong}/${h.P1.tt.hanh_dong} da_ban_giao=${h.P1.tt.da_ban_giao} · P2: ${h.P2.cd.hanh_dong}/${h.P2.tt.hanh_dong}`);
  console.log(`  ghi_danh P1: ${h.P1.tt.ghi_danh}`);
  assert.equal(h.P1.tt.hanh_dong, 'mo-chip');
  assert.equal(h.P1.cd.hanh_dong, 'mo-chip');
  assert.equal(h.P1.tt.da_ban_giao, true);
  assert.match(h.P1.tt.ghi_danh, /bàn giao bg-\d{8}T\d{6}Z: xong/);
  assert.equal(h.P2.tt.hanh_dong, 'khong');
  assert.equal(h.P2.cd.hanh_dong, 'khong');
  chayHook('PostToolUse', { session_id: 's-moi' }, { cwd: k.w1, nowMs: T + 5 * PHUT });
  assert.equal(hanhDong(k).P1.tt.hanh_dong, 'khong', 'phiên mới trên worktree P1 là phiên sống');
});

test('DP4-08 khong-ban-giao', async () => {
  const base = execFileSync('git', ['merge-base', 'HEAD', 'origin/main'], { cwd: KIT, env: ENV, encoding: 'utf8' }).trim();
  const goiCu = tam('dp4-base-');
  execFileSync('sh', ['-c', `git archive ${base} dieu-phoi | tar -x -C "${goiCu}"`], { cwd: KIT, env: ENV });
  const k = khoLienKet();
  chayHook('PostToolUse', { session_id: 's-p1' }, { cwd: k.w1, nowMs: T });
  const moi = (await nap(GOI, 'tiep-tuc.mjs')).keHoachDay(k.dot, { nowMs: T + 3 * PHUT }).map((x) => [x.day, x.hanh_dong]);
  const cu = (await nap(path.join(goiCu, 'dieu-phoi'), 'tiep-tuc.mjs')).keHoachDay(k.dot, { nowMs: T + 3 * PHUT }).map((x) => [x.day, x.hanh_dong]);
  console.log(`  mới ${JSON.stringify(moi)} · merge-base ${JSON.stringify(cu)}`);
  assert.deepEqual(moi, cu);
});

test('DP4-08-do bo-loai', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', 'tiep-tuc.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('nhipMoiNhatCua(thuMuc, d.worktree, { boQua: phienCu, denLuc: moc })', 'nhipMoiNhatCua(thuMuc, d.worktree)');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const k = await dotPhienCu(sao);
  const h = hanhDong(k, sao);
  console.log(`  bản tiêm: P1 ${h.P1.tt.hanh_dong}`);
  assert.equal(h.P1.tt.hanh_dong, 'khong', 'P1');
});

// ---------- DP4-09: hook nhịp nhắc thợ bàn giao (AC-9, E9) ----------
test('DP4-09 nhac', () => {
  const k = khoLienKet();
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { env: envGio(T) }).ma, 0);
  const loi = chayCli(k.kho, ['chay']); // để có <thư mục đợt>/loi/
  chayCli(k.kho, ['dung']);
  assert.equal(loi.ma, 0, loi.err);
  const duongLoi = path.join(k.dot, 'loi', 'dieu-phoi.mjs');
  const nhip = (cwd, phien, gio) => chayHook('PostToolUse', { session_id: phien, tool_name: 'Bash' }, { cwd, nowMs: gio });
  const laNhac = (r) => {
    try {
      const j = JSON.parse(r.stdout);
      return j.hookSpecificOutput?.hookEventName === 'PostToolUse' && j.hookSpecificOutput.additionalContext.includes('ban-giao-xong') && j.hookSpecificOutput.additionalContext.includes(duongLoi);
    } catch {
      return false;
    }
  };
  const hang = [];
  let r = nhip(k.w1, 's-p1', T + PHUT);
  hang.push(['a', r.status === 0 && laNhac(r)]);
  r = nhip(k.w1, 's-p1', T + 3 * PHUT);
  hang.push(['b', r.status === 0 && r.stdout === '']);
  r = nhip(k.w1, 's-p1', T + 7 * PHUT);
  hang.push(['c', r.status === 0 && laNhac(r)]);
  assert.equal(chayCli(k.w1, ['ban-giao-xong'], { env: envGio(T + 8 * PHUT) }).ma, 0);
  r = nhip(k.w1, 's-p1', T + 20 * PHUT);
  hang.push(['d', r.status === 0 && r.stdout === '']);
  const k2 = khoLienKet();
  r = nhip(k2.w1, 's-x', T);
  hang.push(['e', r.status === 0 && r.stdout === '']);
  const trong = tam('dp4-trong-');
  git(trong, 'init', '-q', '-b', 'main');
  git(trong, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const bam = bamCay(trong);
  r = nhip(trong, 's-y', T);
  hang.push(['f', r.status === 0 && r.stdout === '' && bamCay(trong) === bam]);
  console.log(hang.map(([n, ok]) => `  (${n}) · ${ok ? 'đúng' : 'SAI'}`).join('\n'));
  assert.equal(hang.length, 6);
  assert.deepEqual(hang.filter(([, ok]) => !ok).map(([n]) => n), []);
  for (const [dot, phien] of [[k.dot, 's-p1'], [k2.dot, 's-x']]) assert.ok(fs.existsSync(path.join(dot, 'song', `${phien}.json`)), `nhịp sống ${phien} vẫn ghi`);
});

// ---------- DP4-10: lưới cuối StopFailure (AC-10, E10) ----------
test('DP4-10 luoi-cuoi', () => {
  const khoi = docJ(path.join(GOI, 'hooks', 'hooks.json')).hooks.StopFailure?.[0]?.hooks?.[0];
  assert.ok(khoi && khoi.timeout >= 60, `hooks.json phải có khối StopFailure timeout ≥ 60: ${JSON.stringify(khoi)}`);
  const het = (cwd, error = 'rate_limit') => chayHook('StopFailure', { session_id: 's-p1', error }, { cwd, nowMs: T });
  const dem = (w) => Number(git(w, 'rev-list', '--count', 'HEAD'));
  const porcelain = (w) => git(w, 'status', '--porcelain');
  const tho = (dot) => suKienCua(dot).filter((e) => e.loai === 'tho-het-han-muc');
  const pDau = (dot) => path.join(dot, 'ban-giao', 'dau', 'P1.json');
  const hang = [];
  {
    const k = khoLienKet();
    fs.writeFileSync(path.join(k.w1, 'do.txt'), 'dở');
    const n = dem(k.w1);
    const r = het(k.w1);
    const d = fs.existsSync(pDau(k.dot)) ? docJ(pDau(k.dot)) : {};
    hang.push(['a', r.status === 0 && dem(k.w1) === n + 1 && git(k.w1, 'log', '-1', '--format=%s').startsWith('wip(ban-giao): lưới cuối') && porcelain(k.w1) === '' && d.wip === git(k.w1, 'rev-parse', 'HEAD') && tho(k.dot).length === 1 && tho(k.dot)[0].can_phan === true]);
  }
  {
    const k = khoLienKet();
    fs.writeFileSync(path.join(k.w1, 'do.txt'), 'dở');
    ghiJ(path.join(k.dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'hang-a', loai: 's4', worktree: k.w1, cap_luc: ISO(T), han_thue_den: ISO(T + 90 * PHUT) });
    const dinh = git(k.w1, 'rev-parse', 'HEAD');
    const r = het(k.w1);
    hang.push(['b', r.status === 0 && git(k.w1, 'rev-parse', 'HEAD') === dinh && porcelain(k.w1) !== '' && docJ(pDau(k.dot)).luot_do === true]);
  }
  {
    const k = khoLienKet();
    const dinh = git(k.w1, 'rev-parse', 'HEAD');
    const r = het(k.w1);
    hang.push(['c', r.status === 0 && git(k.w1, 'rev-parse', 'HEAD') === dinh && docJ(pDau(k.dot)).wip === null]);
  }
  {
    const k = khoLienKet();
    fs.writeFileSync(path.join(k.w1, 'do.txt'), 'dở');
    const dinh = git(k.w1, 'rev-parse', 'HEAD');
    const rD = het(k.w1, 'overloaded');
    const okD = rD.status === 0 && git(k.w1, 'rev-parse', 'HEAD') === dinh && !fs.existsSync(path.join(k.dot, 'ban-giao', 'dau')) && tho(k.dot).length === 0;
    hang.push(['d', okD]);
    const rE = het(k.kho);
    hang.push(['e', rE.status === 0 && !fs.existsSync(path.join(k.dot, 'ban-giao', 'dau')) && tho(k.dot).length === 0]);
  }
  {
    const trong = tam('dp4-trong-');
    git(trong, 'init', '-q', '-b', 'main');
    git(trong, 'commit', '-q', '--allow-empty', '-m', 'goc');
    fs.writeFileSync(path.join(trong, 'do.txt'), 'dở');
    const bam = bamCay(trong);
    const dinh = git(trong, 'rev-parse', 'HEAD');
    const r = het(trong);
    hang.push(['f', r.status === 0 && bamCay(trong) === bam && git(trong, 'rev-parse', 'HEAD') === dinh]);
  }
  {
    const k = khoLienKet();
    const dHook = tam('dp4-hook-');
    fs.writeFileSync(path.join(dHook, 'pre-commit'), '#!/bin/sh\necho chan-boi-kho >&2\nexit 1\n', { mode: 0o755 });
    execFileSync('git', ['config', 'core.hooksPath', dHook], { cwd: k.w1, env: ENV });
    fs.writeFileSync(path.join(k.w1, 'do.txt'), 'dở');
    const dinh = git(k.w1, 'rev-parse', 'HEAD');
    const r = het(k.w1);
    const d = docJ(pDau(k.dot));
    hang.push(['g', r.status === 0 && git(k.w1, 'rev-parse', 'HEAD') === dinh && fs.existsSync(path.join(k.w1, 'do.txt')) && porcelain(k.w1).includes('do.txt') && String(d.loi_commit).includes('chan-boi-kho')]);
  }
  console.log(hang.map(([n, ok]) => `  (${n}) · ${ok ? 'đúng' : 'SAI'}`).join('\n'));
  assert.equal(hang.length, 7);
  assert.deepEqual(hang.filter(([, ok]) => !ok).map(([n]) => n), []);
});

// ---------- DP4-11: lượt chấm chết giữa chừng ra cùng round (AC-11, E11) ----------
const S4_ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
function hoSoChamThu() {
  const kho = tam('dp4-s4-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const d = path.join(kho, '_acceptance', 'thu');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  test:\n    x: "true"\nfeature_loop:\n  suite_keys:\n    - executors.test.x\n');
  fs.writeFileSync(path.join(d, 'contract.md'), '---\nschema_version: 1\nfeature: thu\nslug: thu\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\n---\n\n# Acceptance Contract: thu\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n');
  fs.writeFileSync(path.join(d, 'evals.yaml'), 'schema_version: 1\nfeature_slug: thu\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: exit 0\n    evidence_required: [run_id, exit_code]\n');
  fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: REJECT\n---\n\n# Evidence\n\n## Iterations\n\n- Round 1 — REJECT (E1)\n');
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'ho so');
  return kho;
}
const sinhArgs = (kho, ra) => spawnSync(process.execPath, [S4_ARGS, '--slug', 'thu', '--root', kho, '--no-carry', '--diff-base', 'HEAD', '--ag-root', KIT, '--out', ra], { cwd: kho, env: ENV, encoding: 'utf8' });

test('DP4-11 cung-round', async () => {
  const kho = hoSoChamThu();
  const a1 = path.join(tam('dp4-a-'), 'a1.json');
  const r1 = sinhArgs(kho, a1);
  assert.equal(r1.status, 0, r1.stderr);
  // Lượt round 2 «chết giữa chừng»: args đã sinh vào hồ sơ, không dòng run-log, không đổi báo cáo.
  fs.copyFileSync(a1, path.join(kho, '_acceptance', 'thu', 's4-args.json'));
  const a2 = path.join(tam('dp4-a-'), 'a2.json');
  const r2 = sinhArgs(kho, a2);
  assert.equal(r2.status, 0, r2.stderr);
  const [n1, n2] = [docJ(a1).round, docJ(a2).round];
  console.log(`  round lần 1: ${n1} · lần 2 (sau lượt chết): ${n2}`);
  assert.equal(n1, 2);
  assert.equal(n2, 2);
  // Đối chứng: lượt round 2 CÓ ghi sổ chạy (một dòng round-tally) thì lần sinh kế phải ra round 3 — bộ đếm thật sự đọc sổ.
  fs.appendFileSync(path.join(kho, '_acceptance', 'thu', 'run-log.jsonl'), `${JSON.stringify({ kind: 'round-tally', round: 2, ts: ISO(T) })}\n`);
  const a3 = path.join(tam('dp4-a-'), 'a3.json');
  const r3 = sinhArgs(kho, a3);
  assert.equal(r3.status, 0, r3.stderr);
  console.log(`  đối chứng — có dòng sổ round 2: round ${docJ(a3).round}`);
  assert.equal(docJ(a3).round, 3, 'đối chứng: lượt có ghi sổ thì round tăng');
  // Bàn giao không phải nguồn đếm lượt: ban-giao.json không có khoá round nào ngoài gợi ý cham_lai_cung_round.
  const k = dotBanGiao({ p2: 'xong' });
  await motNhip(k.dot, T + 5 * PHUT);
  const khoaRound = khoaSau(docJ(tepBg(k.dot))).filter((x) => /round/i.test(x));
  console.log(`  khoá mang «round» trong ban-giao.json: ${khoaRound.join(', ')}`);
  assert.deepEqual(khoaRound, ['day.[].cham_lai_cung_round']);
});

// ---------- DP4-13 (phần không cần Claude Code): khung mod + quét «không bao giờ cho phép» (AC-13, E13b) ----------
const KHOI_MOD = (nguon) => /\/\/ <<<MOD-SU-KIEN\n([\s\S]*?)\/\/ MOD-SU-KIEN>>>/.exec(nguon)?.[1] ?? null;
test('DP4-13 bang-mod', async () => {
  const nguon = fs.readFileSync(path.join(GOI, 'scripts', 'mod-luat.mjs'), 'utf8');
  const khoi = KHOI_MOD(nguon);
  assert.ok(khoi, 'mod-luat.mjs phải có khối marker MOD-SU-KIEN');
  const bang = [...khoi.matchAll(/'(\.\/mod\/[\w-]+\.ts)'\s*:/g)].map((m) => m[1]).sort();
  const tep = fs.readdirSync(path.join(GOI, 'hooks', 'mod')).filter((f) => f.endsWith('.ts') && f !== 'register.ts' && !f.endsWith('.test.ts')).map((f) => `./mod/${f}`).sort();
  console.log(`  bảng (rút từ marker): ${bang.join(', ')} · tệp phần: ${tep.join(', ')}`);
  assert.deepEqual(bang, tep);
  assert.deepEqual(docJ(path.join(GOI, 'hooks', 'hooks.json')).modules, ['./mod/register.ts']);
  const { kiemKhungMod } = await nap(GOI, 'mod-luat.mjs');
  assert.deepEqual(kiemKhungMod(GOI), []);
});

test('DP4-13-do quet-chu', async () => {
  const sao = tam('dp4-goi-');
  fs.cpSync(GOI, sao, { recursive: true });
  const { kiemKhungMod } = await nap(GOI, 'mod-luat.mjs');
  assert.deepEqual(kiemKhungMod(sao), [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'hooks', 'mod', 'doc-muc-dung.ts');
  const goc = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(p, `${goc}export const tra = () => ({ behavior: 'allow' })\n`);
  const dong = fs.readFileSync(p, 'utf8').split('\n').findIndex((d) => d.includes("behavior: 'allow'")) + 1;
  const loi = kiemKhungMod(sao);
  console.log(`  bản tiêm: ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l.includes(`doc-muc-dung.ts:${dong}`)), `phải nêu doc-muc-dung.ts:${dong}`);
});

// ---------- DP4-14: lệnh người và tài liệu (AC-14, E14) ----------
const thanSau = (t, moc) => t.slice(Math.max(0, t.indexOf(moc)));
export function kiemBanGiaoMd(gocGoi = GOI) {
  const p = path.join(gocGoi, 'commands', 'ban-giao.md');
  if (!fs.existsSync(p)) return ['ban-giao.md: không có'];
  const t = fs.readFileSync(p, 'utf8');
  const body = thanSau(t, '\nCác bước');
  const loi = [];
  const vi = { cli: body.indexOf('dieu-phoi.mjs" ban-giao'), nhan: body.indexOf('Nhắn từng phiên thợ'), bao: body.indexOf('Báo chủ kho') };
  if (Object.values(vi).some((x) => x < 0) || !(vi.cli < vi.nhan && vi.nhan < vi.bao)) loi.push(`ban-giao.md: trình tự phải là CLI ban-giao → nhắn thợ → báo chủ kho (vị trí ${vi.cli} · ${vi.nhan} · ${vi.bao})`);
  const cauBao = body.slice(vi.bao);
  if (!cauBao.includes('/dieu-phoi:tiep-tuc') || !cauBao.includes('loi/dieu-phoi.mjs tiep-tuc')) loi.push('ban-giao.md: câu báo thiếu /dieu-phoi:tiep-tuc hoặc đường lùi loi/dieu-phoi.mjs tiep-tuc');
  if (/^disable-model-invocation:/m.test(t)) loi.push('ban-giao.md: không được khoá model-invocation');
  return loi;
}
export function kiemTiepTucMdDp4(gocGoi = GOI) {
  const t = fs.readFileSync(path.join(gocGoi, 'commands', 'tiep-tuc.md'), 'utf8');
  const body = thanSau(t, '\nCác bước');
  const loi = [];
  const iHm = body.indexOf('han-muc --nguon get-usage');
  const iCli = body.indexOf('dieu-phoi.mjs" tiep-tuc --phien');
  if (iHm < 0 || iCli < 0 || !(iHm < iCli)) loi.push(`tiep-tuc.md: đọc mức dùng phải đứng trước CLI tiep-tuc (vị trí ${iHm} · ${iCli})`);
  const nhe = /\*\*Dạng `--nhe`\*\*[\s\S]*$/.exec(body)?.[0] ?? '';
  if (!nhe.includes('han-muc')) loi.push('tiep-tuc.md: dạng --nhe thiếu bước đọc mức dùng');
  const lich = body.slice(body.indexOf('Lịch 30′'));
  const iLh = lich.indexOf('han-muc');
  const iDt = lich.indexOf('danh-thuc');
  if (iLh < 0 || iDt < 0 || !(iLh < iDt)) loi.push(`tiep-tuc.md: việc của lịch 30′ phải gọi han-muc trước danh-thuc (vị trí ${iLh} · ${iDt})`);
  for (const k of ['can_doc_han_muc', 'khuyen_cho']) if (!body.includes(`\`${k}\`:`)) loi.push(`tiep-tuc.md: thiếu dòng xử lý ${k}`);
  return loi;
}
test('DP4-14 ban-giao-md', () => assert.deepEqual(kiemBanGiaoMd(), []));
test('DP4-14 tiep-tuc-md', () => assert.deepEqual(kiemTiepTucMdDp4(), []));
test('DP4-14 tai-lieu', () => {
  const ctx = fs.readFileSync(path.join(KIT, 'CONTEXT.md'), 'utf8');
  const muc = /\*\*Bàn giao tài khoản\*\*:\n[\s\S]*?(?=\n\*\*|$)/.exec(ctx)?.[0] ?? '';
  assert.ok(muc && /_Avoid_/.test(muc), 'CONTEXT.md phải có mục «Bàn giao tài khoản» kèm _Avoid_');
  for (const tep of ['GUIDE.md', 'QUICKSTART.md']) assert.ok(fs.readFileSync(path.join(KIT, tep), 'utf8').includes('/dieu-phoi:ban-giao'), `${tep} phải nêu /dieu-phoi:ban-giao`);
});
const saoLenh = (sua) => {
  const sao = path.join(tam('dp4-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  sua(sao);
  return sao;
};
test('DP4-14-do dao-buoc', () => {
  assert.deepEqual(kiemBanGiaoMd(saoLenh(() => {})), [], 'đối chứng dương');
  const sao = saoLenh((s) => {
    const p = path.join(s, 'commands', 'ban-giao.md');
    const goc = fs.readFileSync(p, 'utf8');
    const iCli = goc.indexOf('1. **CLI bàn giao.**');
    const iBao = goc.indexOf('4. **Báo chủ kho**');
    assert.ok(iCli > 0 && iBao > iCli, 'bước tiêm không áp được');
    const dongBao = goc.slice(iBao);
    fs.writeFileSync(p, `${goc.slice(0, iCli)}${dongBao}\n${goc.slice(iCli, iBao)}`);
  });
  const loi = kiemBanGiaoMd(sao);
  assert.ok(loi.some((l) => l.startsWith('ban-giao.md: trình tự')), loi.join(' | '));
});
test('DP4-14-do bo-nhe', () => {
  assert.deepEqual(kiemTiepTucMdDp4(saoLenh(() => {})), [], 'đối chứng dương');
  const sao = saoLenh((s) => {
    const p = path.join(s, 'commands', 'tiep-tuc.md');
    const goc = fs.readFileSync(p, 'utf8');
    const iNhe = goc.indexOf('**Dạng `--nhe`**');
    const tiem = goc.slice(0, iNhe) + goc.slice(iNhe).replace(/bước 0 \([^)]*\), /, '');
    assert.notEqual(tiem, goc, 'bước tiêm không áp được');
    fs.writeFileSync(p, tiem);
  });
  const loi = kiemTiepTucMdDp4(sao);
  assert.ok(loi.some((l) => l.includes('--nhe')), loi.join(' | '));
});

// ---------- DP4-15: nhánh DP0 theo kết quả đo (AC-15, E15) ----------
const KHOI_MD = (t, mk) => new RegExp(`<!-- <<<${mk} -->\\n([\\s\\S]*?)<!-- ${mk}>>> -->`).exec(t)?.[1] ?? null;
const bangMd = (khoi) => (khoi ?? '').split('\n').filter((d) => /^\|\s*\d/.test(d)).map((d) => d.split('|').slice(1, -1).map((x) => x.trim()));
const GIA_TRI = ['còn', 'mất', 'khác', 'chưa-đo'];
export function kiemNhanhDp0(hopDong, ketQua) {
  const loi = [];
  const anh = new Map(bangMd(KHOI_MD(hopDong, 'NHANH-DP0')).map(([c, ...v]) => [c, Object.fromEntries(GIA_TRI.map((g, i) => [g, v[i]]))]));
  const chon = new Map(bangMd(KHOI_MD(hopDong, 'NHANH-DP0-CHON')).map(([c, g, n]) => [c, { g, n }]));
  const kq = new Map(bangMd(KHOI_MD(ketQua, 'KET-QUA-DP0')).map(([c, , g]) => [c, g]));
  const notes = hopDong.slice(hopDong.indexOf('## Notes'));
  for (const c of ['1', '2', '3', '5', '6']) {
    const g = kq.get(c);
    if (!GIA_TRI.includes(g)) {
      loi.push(`câu ${c}: ket-qua.md mang «${g}», cần một trong ${GIA_TRI.join(' · ')}`);
      continue;
    }
    if (chon.get(c)?.g !== g) loi.push(`câu ${c}: hợp đồng chọn giá trị «${chon.get(c)?.g}», ket-qua.md «${g}»`);
    if (chon.get(c)?.n !== anh.get(c)?.[g]) loi.push(`câu ${c}: nhánh «${chon.get(c)?.n}» khác ánh xạ «${anh.get(c)?.[g]}»`);
    const coNguong = new RegExp(`câu ${c}[^\\n]*ngưỡng`).test(notes);
    if (g === 'chưa-đo' && !coNguong) loi.push(`câu ${c}: chưa-đo mà Notes không có giới hạn kèm ngưỡng`);
  }
  return loi;
}
const HD_P = path.join(KIT, '_acceptance', 'dieu-phoi-doi-tai-khoan', 'contract.md');
const KQ_P = path.join(KIT, '_acceptance', 'dieu-phoi-tho-trong-kit', 'discovery', 'do-tai-khoan', 'ket-qua.md');
test('DP4-15 nhanh-dp0', () => {
  const hd = fs.readFileSync(HD_P, 'utf8');
  const kq = fs.readFileSync(KQ_P, 'utf8');
  const dong = bangMd(KHOI_MD(kq, 'KET-QUA-DP0')).map(([c, , g]) => `câu ${c} · ${g}`);
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 5);
  assert.deepEqual(kiemNhanhDp0(hd, kq), []);
});
test('DP4-15-do doi-cau-6', () => {
  const hd = fs.readFileSync(HD_P, 'utf8');
  const kq = fs.readFileSync(KQ_P, 'utf8');
  assert.deepEqual(kiemNhanhDp0(hd, kq), [], 'đối chứng dương');
  const dong6 = kq.split('\n').find((d) => /^\|\s*6\s*\|/.test(d));
  const giaTri = dong6.split('|')[3].trim();
  const moi = giaTri === 'còn' ? 'mất' : 'còn';
  const tiem = kq.replace(dong6, dong6.replace(`| ${giaTri} |`, `| ${moi} |`));
  assert.notEqual(tiem, kq, 'bước tiêm không áp được');
  const loi = kiemNhanhDp0(hd, tiem);
  console.log(`  bản tiêm (câu 6 → ${moi}): ${loi.join(' | ')}`);
  assert.ok(loi.some((l) => l.startsWith('câu 6')), loi.join(' | '));
});

// ---------- Vòng sửa sau review (C1, I1): vòng đời dấu «thợ chết vì hạn mức» và phiên đã bàn giao ----------
const ghiDau = (dot, day, phien, luc) => ghiJ(path.join(dot, 'ban-giao', 'dau', `${day}.json`), { day, phien, luc: ISO(luc), loi: 'rate_limit', wip: null, luot_do: false });
const chamCua = (dot) => suKienCua(dot).filter((e) => e.loai === 'cham-han-muc');

test('DP4-03 dau-cho-dat-lai', async () => {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet();
  datNhanLuc(k.dot, ISO(T - 60 * PHUT));
  docVao(k.kho, { nam: [99, 30] });
  ghiDau(k.dot, 'P1', 's-p1', T - PHUT);
  for (let i = 0; i < 4; i++) await motNhip(k.dot, T + i * 5000);
  console.log(`  4 nhịp khi đang chờ đặt lại: ${chamCua(k.dot).length} cham-han-muc · pha ${dk(k.dot).pha}`);
  assert.equal(chamCua(k.dot).length, 0, 'đang chờ đặt lại thì dấu không phát cham-han-muc');
  assert.equal(dk(k.dot).pha, 'dang-chay');
});

test('DP4-03 dau-sau-dat-lai', async () => {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet();
  datNhanLuc(k.dot, ISO(T - 120 * PHUT));
  ghiDau(k.dot, 'P1', 's-p1', T - 60 * PHUT);
  docVao(k.kho, { nam: [4, 300] });
  await motNhip(k.dot, T);
  console.log(`  dấu cũ + lần đọc mới 4 %: pha ${dk(k.dot).pha} · ${chamCua(k.dot).length} cham-han-muc`);
  assert.equal(dk(k.dot).pha, 'dang-chay', 'lần đọc mới hơn dấu dưới ngưỡng báo trước → dấu hết hiệu lực');
  assert.equal(chamCua(k.dot).length, 0);
  ghiDau(k.dot, 'P2', 's-p2', T + PHUT);
  await motNhip(k.dot, T + 2 * PHUT);
  assert.equal(dk(k.dot).pha, 'dang-ban-giao', 'đối chứng: dấu mới hơn lần đọc vẫn kéo vào bàn giao');
});

test('DP4-07 dau-phien-cu', async () => {
  const k = await hangTiepTuc({ pha: 'cho-tiep-tuc' });
  chayHook('PostToolUse', { session_id: 's-p1' }, { cwd: k.w1, nowMs: T + 3 * PHUT });
  assert.equal(tiepTucB(k).ma, 0);
  assert.equal(dk(k.dot).pha, 'dang-chay');
  const ls = docJ(path.join(k.dot, 'ban-giao', 'lich-su', tepLichSu(k.dot)[0]));
  assert.ok((ls.phien_da_biet ?? []).includes('s-p1'), `lịch sử phải ghi phien_da_biet: ${JSON.stringify(ls.phien_da_biet)}`);
  ghiDau(k.dot, 'P1', 's-p1', T + 20 * PHUT);
  await motNhip(k.dot, T + 21 * PHUT);
  assert.equal(dk(k.dot).pha, 'dang-chay', 'dấu của phiên tài khoản cũ sau khi tiếp tục không kéo đợt vào bàn giao');
  fs.rmSync(path.join(k.dot, 'ban-giao', 'dau'), { recursive: true, force: true });
  fs.writeFileSync(path.join(k.w1, 'cua-tho-moi.txt'), 'việc của thợ mới');
  const dinh = git(k.w1, 'rev-parse', 'HEAD');
  const r = chayHook('StopFailure', { session_id: 's-p1', error: 'rate_limit' }, { cwd: k.w1, nowMs: T + 22 * PHUT });
  assert.equal(r.status, 0);
  assert.equal(git(k.w1, 'rev-parse', 'HEAD'), dinh, 'phiên tài khoản cũ chết sau khi tiếp tục không commit việc của thợ mới');
});

test('DP4-08 tho-chet', async () => {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet();
  chayHook('PostToolUse', { session_id: 's-p2' }, { cwd: k.w2, nowMs: T + 30_000 });
  assert.equal(chayCli(k.kho, ['ban-giao', '--ly-do', 'thu'], { env: envGio(T) }).ma, 0);
  assert.equal(chayCli(k.w1, ['ban-giao-xong'], { env: envGio(T + PHUT) }).ma, 0);
  ghiDau(k.dot, 'P2', 's-p2', T + 2 * PHUT);
  const p2 = (await nap(GOI, 'tiep-tuc.mjs')).keHoachDay(k.dot, { nowMs: T + 4 * PHUT }).find((x) => x.day === 'P2');
  console.log(`  P2 (thợ chết vì hạn mức, nhịp 3′): ${p2.hanh_dong}`);
  assert.equal(p2.hanh_dong, 'mo-chip', 'dãy có dấu thợ chết: phiên chết không tính là phiên sống');
});

test('DP4-08 het-han', async () => {
  const k = await dotPhienCu();
  docB(k.kho, 30, T + 6 * PHUT);
  const r = chayCli(k.kho, ['tiep-tuc', '--phien', 'B', '--json'], { env: envGio(T + 7 * PHUT) });
  chayCli(k.kho, ['dung']);
  assert.equal(r.ma, 0, r.err);
  chayHook('PostToolUse', { session_id: 's-cu' }, { cwd: k.w1, nowMs: T + 9 * PHUT });
  const p1 = (await nap(GOI, 'tiep-tuc.mjs')).keHoachDay(k.dot, { nowMs: T + 10 * PHUT }).find((x) => x.day === 'P1');
  console.log(`  P1 sau khi tiếp tục, phiên cũ s-cu có nhịp MỚI: ${p1.hanh_dong}`);
  assert.equal(p1.hanh_dong, 'khong', 'nhịp ghi SAU lúc tiếp tục nghĩa là phiên sống lại thật');
});

// ---------- Vòng sửa sau review (I2, I3, I7, M1, M2) ----------
test('DP4-05 loi-cu', () => {
  const k = khoLienKet();
  assert.equal(chayCli(k.kho, ['chay']).ma, 0);
  chayCli(k.kho, ['dung']);
  fs.rmSync(path.join(k.dot, 'loi', 'ban-giao.mjs'));
  const r = chayCli(k.kho, ['ban-giao']);
  console.log(`  lõi đợt chưa có bàn giao: thoát ${r.ma} · ${r.err.trim()}`);
  assert.equal(r.ma, 1);
  assert.match(r.err, /lõi của đợt chưa có bàn giao.*`dung`.*`chay`/);
  assert.equal(dk(k.dot).pha, 'dang-chay', 'không vào pha khi lõi cũ');
  const k2 = khoLienKet();
  assert.equal(chayCli(k2.kho, ['chay']).ma, 0);
  chayCli(k2.kho, ['dung']);
  assert.equal(chayCli(k2.kho, ['ban-giao']).ma, 0, 'đối chứng: lõi mới thì vào bàn giao');
});

test('DP4-06 duong-lui', async () => {
  const k = dotBanGiao({ p2: 'xong' });
  await motNhip(k.dot, T + 5 * PHUT);
  const tin = suKienCua(k.dot).find((e) => e.loai === 'ban-giao-dung')?.tin ?? '';
  assert.ok(tin.includes('han-muc --nguon get-usage') && tin.indexOf('han-muc --nguon get-usage') < tin.lastIndexOf('tiep-tuc --phien'), `đường lùi phải đọc mức dùng trước tiep-tuc: ${tin}`);
  const r = chayCli(k.kho, ['tiep-tuc', '--phien', 'B', '--json'], { env: envGio(T + 7 * PHUT) });
  chayCli(k.kho, ['dung']);
  const kq = JSON.parse(r.out);
  assert.equal(kq.can_doc_han_muc, true);
  assert.match(String(kq.viec ?? ''), /han-muc --nguon get-usage --phien B/);
});

test('DP4-03 toc-do-nhieu', async () => {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp4-may-');
  const k = khoLienKet();
  datNhanLuc(k.dot, ISO(T - 60 * PHUT));
  docVao(k.kho, { nguon: 'get-usage', tuoi: 20 / 60, nam: [82, 180] });
  docVao(k.kho, { nguon: 'get-usage', tuoi: 0, nam: [82.5, 180] });
  await motNhip(k.dot, T);
  const ng = docJ(path.join(k.dot, 'trang-thai.json')).han_muc.cua_so.find((w) => w.ten === 'five_hour').nguong_ban_giao;
  console.log(`  hai lần đọc cách 20″: ngưỡng hiệu lực ${ng} · pha ${dk(k.dot).pha}`);
  assert.equal(ng, 90, 'khoảng đo < 10′ thì không hạ ngưỡng');
  assert.equal(dk(k.dot).pha, 'dang-chay');
});

test('DP4-07 cuong-buc-im', async () => {
  const k = await hangTiepTuc({ pha: 'dang-ban-giao', phaTruoc: 'tam-dung', p2: 'chua' });
  const truoc = suKienCua(k.dot).filter((e) => e.loai === 'ban-giao-dung' && e.can_phan).length;
  assert.equal(tiepTucB(k).ma, 0);
  const sau = suKienCua(k.dot).filter((e) => e.loai === 'ban-giao-dung' && e.can_phan).length;
  assert.equal(sau, truoc, 'tiếp tục cưỡng bức không phát «Đổi tài khoản…» thành việc chờ');
});

test('DP4-06 khoa-khong-nhip', async () => {
  const k = dotBanGiao({ p2: 'xong' });
  ghiJ(path.join(k.dot, 'khoa', 's4', 'chu.json'), { phien: 'P2', slug: 'hang-b', loai: 's4', worktree: k.w2, cap_luc: ISO(T - 30 * PHUT), han_thue_den: ISO(T + 90 * PHUT) });
  await motNhip(k.dot, T + 5 * PHUT);
  assert.equal(dk(k.dot).pha, 'cho-tiep-tuc', 'khoá cấp 35′ trước, chưa có nhịp nào → coi như chết');
});

// ---------- Vòng sửa sau review (I4, I5): lưới cuối và --wip không phá trạng thái cây ----------
function xungDotMerge(w) {
  fs.writeFileSync(path.join(w, 'f.txt'), 'goc\n');
  git(w, 'add', '-A'); git(w, 'commit', '-q', '-m', 'f goc');
  git(w, 'checkout', '-q', '-b', 'nhanh-x');
  fs.writeFileSync(path.join(w, 'f.txt'), 'x\n');
  git(w, 'commit', '-q', '-am', 'x');
  git(w, 'checkout', '-q', '-');
  fs.writeFileSync(path.join(w, 'f.txt'), 'y\n');
  git(w, 'commit', '-q', '-am', 'y');
  spawnSync('git', ['merge', 'nhanh-x'], { cwd: w, env: ENV, encoding: 'utf8' });
  assert.ok(fs.existsSync(path.join(execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: w, env: ENV, encoding: 'utf8' }).trim(), 'MERGE_HEAD')), 'fixture: phải đang merge dở');
}
test('DP4-10 dang-merge', () => {
  const k = khoLienKet();
  xungDotMerge(k.w1);
  const dinh = git(k.w1, 'rev-parse', 'HEAD');
  const r = chayHook('StopFailure', { session_id: 's-p1', error: 'rate_limit' }, { cwd: k.w1, nowMs: T });
  const d = docJ(path.join(k.dot, 'ban-giao', 'dau', 'P1.json'));
  console.log(`  lưới cuối khi đang merge dở: HEAD ${git(k.w1, 'rev-parse', 'HEAD') === dinh ? 'giữ' : 'ĐỔI'} · ${d.bo_commit}`);
  assert.equal(r.status, 0);
  assert.equal(git(k.w1, 'rev-parse', 'HEAD'), dinh);
  assert.match(String(d.bo_commit), /MERGE_HEAD/);
  const k2 = khoLienKet();
  assert.equal(chayCli(k2.kho, ['ban-giao']).ma, 0);
  xungDotMerge(k2.w1);
  const x = chayCli(k2.w1, ['ban-giao-xong', '--wip', 'dở']);
  assert.equal(x.ma, 1);
  assert.match(x.err, /MERGE_HEAD/);
});
test('DP4-10 giu-stage', () => {
  const k = khoLienKet();
  const dHook = tam('dp4-hook-');
  // Hook kho từ chối, và ghi lại lúc chạy dấu đã có hay chưa (dấu phải ghi TRƯỚC commit — review I4).
  fs.writeFileSync(path.join(dHook, 'pre-commit'), `#!/bin/sh\n[ -f "${path.join(k.dot, 'ban-giao', 'dau', 'P1.json')}" ] && echo co > "${path.join(dHook, 'dau-luc-commit')}"\necho chan-boi-kho >&2\nexit 1\n`, { mode: 0o755 });
  execFileSync('git', ['config', 'core.hooksPath', dHook], { cwd: k.w1, env: ENV });
  fs.writeFileSync(path.join(k.w1, 'chu-y.txt'), 'thợ stage có chủ ý');
  git(k.w1, 'add', 'chu-y.txt');
  fs.writeFileSync(path.join(k.w1, 'chua-stage.txt'), 'chưa stage');
  chayHook('StopFailure', { session_id: 's-p1', error: 'rate_limit' }, { cwd: k.w1, nowMs: T });
  const staged = git(k.w1, 'diff', '--cached', '--name-only');
  console.log(`  sau commit lỗi: stage = [${staged}] · dấu lúc commit: ${fs.existsSync(path.join(dHook, 'dau-luc-commit'))}`);
  assert.equal(staged, 'chu-y.txt', 'commit lỗi phải trả index về đúng phần thợ đã stage');
  assert.ok(fs.existsSync(path.join(dHook, 'dau-luc-commit')), 'dấu phải có trước khi commit chạy');
});
