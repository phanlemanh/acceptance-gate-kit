// Hồ sơ lenh-cho-khoa-nhay-duong-dan. Ca «KN-<n>» = AC-<n>. Lệnh chờ sinh ra được CHẠY THẬT bằng vỏ shell thật với jq thật,
// trong thư mục tạm do ca dựng. `sleep` thay bằng bản rút ngắn trên PATH: không chờ 15 giây, và ĐẾM số vòng kiểm đã qua, để
// «còn chờ» là đã kiểm rồi, không phải chưa kịp chạy. Chiều đỏ: commit ca đứng trước commit vật, cộng các ca «-do» dựng bản
// sao lich.mjs bị phá. Đường dẫn suy từ vị trí tệp.
//   node --test --test-name-pattern=KN-3 tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chepLoi } from '../../dieu-phoi/scripts/dieu-phoi.mjs';
import { lenhChoKhoa } from '../../dieu-phoi/scripts/lich.mjs';
import { lenhBoc, TEP_GIU_NHIP } from '../../dieu-phoi/scripts/hook-chan-s4.mjs';
import { motNhip } from '../../dieu-phoi/scripts/phat-lich.mjs';
import { CFG_PHAT_LICH } from './loi/mau-thu.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS = path.resolve(DAY, '..', '..', 'dieu-phoi', 'scripts');
// Trần «phải thoát»: rộng để máy bận không đỏ giả. Trần «phải treo»: đủ cho nhiều vòng kiểm, ca đọc số vòng đếm được.
const TRAN_THOAT_MS = 15000;
const TRAN_TREO_MS = 2000;
const VONG_TOI_THIEU = 2;
const THONG_DIEP_KET = 'lệnh chờ không thoát';

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = () => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'kn-')));
  canDon.push(d);
  return d;
};
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(du));
};
const moiTruongSach = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

const SHIM = (() => {
  const d = tam();
  const p = path.join(d, 'sleep');
  fs.writeFileSync(p, '#!/bin/sh\necho x >> "$KN_DEM"\nexec /bin/sleep 0.05\n');
  fs.chmodSync(p, 0o755);
  return d;
})();
const moiDem = () => path.join(tam(), 'dem');
const soVong = (dem) => (fs.existsSync(dem) ? fs.readFileSync(dem, 'utf8').trim().split('\n').filter(Boolean).length : 0);
const moiTruongVo = (dem) => ({ ...moiTruongSach(), PATH: `${SHIM}${path.delimiter}${process.env.PATH}`, KN_DEM: dem });

const coVo = (v) => spawnSync('sh', ['-c', `command -v ${v}`], { encoding: 'utf8' }).status === 0;
const VO = ['bash', 'sh', ...(coVo('zsh') ? ['zsh'] : [])];

// Chạy nguyên văn: đưa đúng chuỗi lệnh cho vỏ. Trả mã, số vòng, và `treo` khi bị trần giết.
function chay(lenh, { vo = 'bash', cwd, tran = TRAN_THOAT_MS } = {}) {
  const dem = moiDem();
  const r = spawnSync(vo, ['-c', lenh], { cwd, env: moiTruongVo(dem), encoding: 'utf8', timeout: tran, killSignal: 'SIGKILL' });
  const treo = r.error?.code === 'ETIMEDOUT' || r.signal !== null;
  return { ma: r.status, treo, vong: soVong(dem) };
}
function phaiThoat0(lenh, tuyChon) {
  const r = chay(lenh, tuyChon);
  if (r.treo) throw new Error(`${THONG_DIEP_KET} trong ${TRAN_THOAT_MS}ms: ${lenh}`);
  assert.equal(r.ma, 0, `mã thoát ${r.ma}: ${lenh}`);
  return r;
}
function phaiTreo(lenh, tuyChon) {
  const r = chay(lenh, { tran: TRAN_TREO_MS, ...tuyChon });
  assert.ok(r.treo, `lệnh đáng lẽ treo lại thoát mã ${r.ma}: ${lenh}`);
  assert.ok(r.vong >= VONG_TOI_THIEU, `chưa qua ${VONG_TOI_THIEU} vòng kiểm mà đã kết luận treo (${r.vong})`);
  return r;
}

const dotCo = (tenThuMuc) => {
  const dot = path.join(tam(), tenThuMuc, 'dot');
  fs.mkdirSync(dot, { recursive: true });
  return dot;
};
const ghiKhoa = (dot, tn, phien) => ghiJ(path.join(dot, 'khoa', tn, 'chu.json'), { phien, slug: 's', loai: tn });

// Bản sao nhỏ của lich.mjs để phá: chép đúng ba module nó cần, đổi đúng một chỗ, kim phải khớp nguồn thật.
async function banSaoLich(pha) {
  const d = tam();
  for (const t of ['lich.mjs', 'cau-hinh.mjs', 'nhay.mjs']) {
    const nguon = path.join(SCRIPTS, t);
    if (fs.existsSync(nguon)) fs.copyFileSync(nguon, path.join(d, t));
  }
  const p = path.join(d, 'lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const moi = pha(goc);
  assert.notEqual(moi, goc, 'kim phá không khớp nguồn lich.mjs — thước không còn đo vật thật');
  fs.writeFileSync(p, moi);
  return (await import(pathToFileURL(p).href)).lenhChoKhoa;
}
const KIM_DUONG = /\$\{nhayDoiSo\((path\.join\(thuMuc, 'khoa', giaiTaiNguyen\(loai\), 'chu\.json'\))\)\}/;
const KIM_PHIEN = /\$\{nhayDoiSo\(`\.phien==\$\{JSON\.stringify\(phien\)\}`\)\}/;
const boBoc = (s) => s.replace(KIM_DUONG, '${$1}');
const bocNhayKep = (s) => s.replace(KIM_DUONG, '"${$1}"');
const luonBoc = (s) => s.replace(KIM_DUONG, "'${$1}'");
const boViTu = (s) => s.replace(KIM_PHIEN, "'.'");
const phienTran = (s) => s.replace(KIM_PHIEN, `'.phien=="\${phien}"'`);

// ── KN-1: thư mục có dấu cách, khoá đúng dãy → thoát ở vòng kiểm đầu ────────────────────
test('KN-1 thư mục đợt có dấu cách — lệnh chờ thoát 0 ở vòng kiểm đầu', () => {
  const dot = dotCo('kho co dau cach');
  ghiKhoa(dot, 's4', 'P1');
  for (const vo of VO) assert.equal(phaiThoat0(lenhChoKhoa(dot, 'P1', 's4'), { vo }).vong, 0, `vỏ ${vo}: phải thoát trước lần ngủ đầu`);
});

test('KN-1-do bản bỏ bọc nháy, cùng fixture — lệnh treo qua nhiều vòng kiểm', async () => {
  const dot = dotCo('kho co dau cach');
  ghiKhoa(dot, 's4', 'P1');
  phaiTreo((await banSaoLich(boBoc))(dot, 'P1', 's4'));
});

// ── KN-2: lệnh thật sự chờ, và chỉ thoát khi khoá về đúng dãy ───────────────────────────
function chayNen(lenh) {
  const dem = moiDem();
  const con = spawn('bash', ['-c', lenh], { env: moiTruongVo(dem), stdio: 'ignore' });
  const ket = new Promise((r) => con.on('exit', (ma) => r(ma)));
  return { con, ket, dem, conSong: () => con.exitCode === null && con.signalCode === null };
}
// Chờ tới khi lệnh qua thêm `them` vòng kiểm; nó thoát trước đó thì báo đúng bước.
async function quaThemVong(nen, them, buoc) {
  const moc = soVong(nen.dem) + them;
  const het = Date.now() + TRAN_THOAT_MS;
  while (soVong(nen.dem) < moc) {
    if (!nen.conSong()) throw new Error(`thoát sớm khi ${buoc}`);
    if (Date.now() > het) throw new Error(`hết trần mà chưa qua ${them} vòng kiểm khi ${buoc}`);
    await nghi(20);
  }
  if (!nen.conSong()) throw new Error(`thoát sớm khi ${buoc}`);
}
async function kiemCho(lenhCho) {
  const dot = dotCo('kho co dau cach');
  const nen = chayNen(lenhCho(dot, 'P1', 's4'));
  try {
    await quaThemVong(nen, VONG_TOI_THIEU, 'khoá vắng');
    ghiKhoa(dot, 's4', 'P2');
    await quaThemVong(nen, VONG_TOI_THIEU, 'khoá của dãy khác');
    ghiKhoa(dot, 's4', 'P1');
    const ma = await Promise.race([nen.ket, nghi(TRAN_TREO_MS * 2).then(() => 'tran')]);
    if (ma === 'tran') throw new Error(THONG_DIEP_KET);
    assert.equal(ma, 0, `mã thoát ${ma}`);
  } finally {
    nen.con.kill('SIGKILL');
  }
}

test('KN-2 khoá vắng hay của dãy khác — còn chờ qua vòng kiểm; khoá về đúng dãy — thoát 0', () => kiemCho(lenhChoKhoa));

test('KN-2-do hai bản phá, cùng thước — mỗi bản đỏ đúng bước', async () => {
  await assert.rejects(kiemCho(await banSaoLich(boViTu)), /thoát sớm khi khoá của dãy khác/);
  await assert.rejects(kiemCho(await banSaoLich(boBoc)), new RegExp(THONG_DIEP_KET));
});

// ── KN-3: ma trận ký tự viết trước — số ca bằng số phần tử ──────────────────────────────
// Tên thư mục không chứa «/», nên tệp canh là đường tương đối, chạy trong cwd riêng.
const CANH = 'CANH';
// Cột `boBoc` khai trước kết cục của bản bỏ nháy dưới bash: `treo`, `cu-phap`, hoặc `khong-phan-biet` (đường vẫn đúng khi trần).
const KY_TU = [
  { ten: 'dấu cách', dat: 'co dau cach', boBoc: 'treo', canh: false },
  { ten: 'nháy đơn', dat: "co'nhay", boBoc: 'cu-phap', canh: false },
  { ten: 'nháy kép', dat: 'co"nhay', boBoc: 'cu-phap', canh: false },
  { ten: 'lệnh nhúng', dat: `a$(touch ${CANH})b`, boBoc: 'treo', canh: true },
  { ten: 'backtick', dat: `a\`touch ${CANH}\`b`, boBoc: 'treo', canh: true },
  { ten: 'chấm phẩy', dat: `a;touch ${CANH};b`, boBoc: 'treo', canh: true },
  { ten: 'và', dat: `a&touch ${CANH}&b`, boBoc: 'treo', canh: true },
  { ten: 'sao', dat: 'a*b', boBoc: 'khong-phan-biet', canh: false },
  { ten: 'tiếng Việt', dat: 'đợt-thử', boBoc: 'khong-phan-biet', canh: false },
];

test('KN-3 bảng ký tự đủ chín phần tử viết trước', () => {
  assert.equal(KY_TU.length, 9);
});

for (const { ten, dat } of KY_TU) {
  test(`KN-3 ${ten} — thoát 0, không lệnh nhúng nào chạy`, () => {
    const cwd = tam();
    const dot = dotCo(dat);
    ghiKhoa(dot, 's4', 'P1');
    for (const vo of VO) {
      phaiThoat0(lenhChoKhoa(dot, 'P1', 's4'), { vo, cwd });
      assert.equal(fs.existsSync(path.join(cwd, CANH)), false, `lệnh nhúng đã chạy (${vo})`);
    }
  });
}

test('KN-3-do bản bỏ nháy — chín hàng đúng kết cục đã khai trước', async () => {
  const lenhHong = await banSaoLich(boBoc);
  let daXet = 0;
  for (const { ten, dat, boBoc: mong, canh } of KY_TU) {
    const cwd = tam();
    const dot = dotCo(dat);
    ghiKhoa(dot, 's4', 'P1');
    const r = chay(lenhHong(dot, 'P1', 's4'), { cwd, tran: TRAN_TREO_MS });
    // Tệp canh xét trước kết cục: lệnh nhúng chạy rồi mới treo.
    assert.equal(fs.existsSync(path.join(cwd, CANH)), canh, `${ten}: tệp canh khác bảng`);
    const thucTe = r.treo ? 'treo' : r.ma === 0 ? 'khong-phan-biet' : 'cu-phap';
    assert.equal(thucTe, mong, `${ten}: kết cục khác bảng (mã ${r.ma})`);
    daXet += 1;
  }
  assert.equal(daXet, KY_TU.length);
});

test('KN-3-do2 bọc nháy kép — lệnh nhúng và backtick đều chạy, tệp canh sinh ra', async () => {
  const lenhHong = await banSaoLich(bocNhayKep);
  for (const dat of [`a$(touch ${CANH})b`, `a\`touch ${CANH}\`b`]) {
    const cwd = tam();
    const dot = dotCo(dat);
    ghiKhoa(dot, 's4', 'P1');
    chay(lenhHong(dot, 'P1', 's4'), { cwd, tran: TRAN_TREO_MS });
    assert.throws(() => assert.equal(fs.existsSync(path.join(cwd, CANH)), false, 'lệnh nhúng đã chạy'), /lệnh nhúng đã chạy/);
  }
});

// ── KN-4: đường đi thật — chép lõi, xin từ bản chép, bộ phát lịch cấp, chạy nguyên văn ──
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const NOW = Date.parse('2026-10-05T12:00:00Z');
const ioLich = () => ({
  nowMs: () => NOW,
  chay: (cmd, args) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 1024.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 3.00 2.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('not found');
    return '';
  },
});
function dotThat() {
  const k = path.join(tam(), 'kho co dau cach');
  fs.mkdirSync(k, { recursive: true });
  git(k, 'init', '-q', '-b', 'main');
  const lienKet = path.join(k, '.acceptance-runs', 'dot thu');
  for (const t of ['khoa', 'xin', 'yeu-cau', 'tra-loi', 'cho-nguoi', 'tiep']) fs.mkdirSync(path.join(lienKet, t), { recursive: true });
  fs.symlinkSync(lienKet, path.join(k, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(lienKet, 'dieu-phoi.config.json'), { ...CFG_PHAT_LICH, nhanh_chinh: 'main' });
  ghiJ(path.join(lienKet, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: k }], hang: [{ slug: 's', day: 'P1' }] });
  const d = fs.realpathSync(lienKet);
  return { k, d, loi: chepLoi(d) };
}
const cliLoi = ({ k, loi }, ...a) => spawnSync(process.execPath, [path.join(loi, 'dieu-phoi.mjs'), ...a], { cwd: k, env: moiTruongSach(), encoding: 'utf8' });

test('KN-4 xin ghim-lai từ bản lõi của đợt có dấu cách — dòng chờ in ra chạy nguyên văn thoát 0, trỏ khoa/s4', async () => {
  const dot = dotThat();
  assert.ok(fs.existsSync(path.join(dot.loi, 'nhay.mjs')), 'bản lõi thiếu nhay.mjs');
  const r = cliLoi(dot, 'xin', 'ghim-lai', '--slug', 's');
  assert.equal(r.status, 0, `xin: ${r.stderr}`);
  const lenh = r.stdout.split('chờ (chạy nền): ')[1]?.trim();
  assert.ok(lenh, `không thấy dòng chờ: ${r.stdout}`);
  assert.ok(lenh.includes(path.join('khoa', 's4', 'chu.json')), `phải trỏ khoa/s4: ${lenh}`);
  assert.ok(!lenh.includes('khoa/ghim-lai'), `không được trỏ khoa/ghim-lai: ${lenh}`);
  // Đối chứng cùng fixture: trước nhịp cấp, cùng lệnh còn chờ qua nhiều vòng kiểm.
  phaiTreo(lenh);
  await motNhip(dot.d, ioLich());
  phaiThoat0(lenh);
});

test('KN-4-do bản lõi thiếu nhay.mjs — CLI hỏng, thông điệp gọi tên module', () => {
  const dot = dotThat();
  fs.rmSync(path.join(dot.loi, 'nhay.mjs'));
  const r = cliLoi(dot, 'xin', 'ghim-lai', '--slug', 's');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /nhay\.mjs/);
});

// ── KN-5: đường an toàn in y như cũ, đủ mọi lớp ký tự an toàn ──────────────────────────
const dangCu = (dot, phien, tn) => `until jq -e '.phien=="${phien}"' ${path.join(dot, 'khoa', tn, 'chu.json')} >/dev/null 2>&1; do sleep 15; done`;
const LOP_AN_TOAN = ['A', 'z', '0', '_', '.', '/', ':', '@', '%', '+', ',', '-'];
const DOT_AN_TOAN = (c) => `/kho-thu/.acceptance-runs/x${c}y`;

test('KN-5 đường an toàn — mười hai lớp ký tự giống từng byte dạng không nháy cũ', () => {
  assert.equal(LOP_AN_TOAN.length, 12);
  for (const c of LOP_AN_TOAN) {
    assert.equal(lenhChoKhoa(DOT_AN_TOAN(c), 'P1', 's4'), dangCu(DOT_AN_TOAN(c), 'P1', 's4'), `đường an toàn bị đổi: ${c}`);
  }
  for (const [loai, tn] of [['s4', 's4'], ['ghim-lai', 's4'], ['duong-nen', 'duong-nen'], ['merge', 'merge']]) {
    assert.equal(lenhChoKhoa(DOT_AN_TOAN('_'), 'P1', loai), dangCu(DOT_AN_TOAN('_'), 'P1', tn), `đường an toàn bị đổi: ${loai}`);
  }
});

test('KN-5-do bản luôn bọc nháy — bộ so bắt được, thông điệp ghim', async () => {
  const lenhHong = await banSaoLich(luonBoc);
  assert.throws(() => assert.equal(lenhHong(DOT_AN_TOAN('_'), 'P1', 's4'), dangCu(DOT_AN_TOAN('_'), 'P1', 's4'), 'đường an toàn bị đổi'), /đường an toàn bị đổi/);
});

// ── KN-6: một bộ nháy, hook không đổi hành vi ───────────────────────────────────────────
const dinhNghia = (noiDung, ten) => (noiDung.match(new RegExp(`\\b(?:const|function)\\s+${ten}\\b`, 'g')) ?? []).length;
const noiDinhNghia = (thuMuc, ten) =>
  fs.readdirSync(thuMuc)
    .filter((t) => t.endsWith('.mjs'))
    .flatMap((t) => Array(dinhNghia(fs.readFileSync(path.join(thuMuc, t), 'utf8'), ten)).fill(t))
    .sort();
const kiemTap = (thuMuc, ten, mong) => {
  const co = noiDinhNghia(thuMuc, ten);
  if (JSON.stringify(co) !== JSON.stringify(mong)) throw new Error(`định nghĩa trùng ${ten}: ${JSON.stringify(co)}`);
};

test('KN-6 nhayDoiSo một nơi, nhayDon đúng hai nơi đã khai, nhay.mjs chỉ import ./ hoặc node:', () => {
  kiemTap(SCRIPTS, 'nhayDoiSo', ['nhay.mjs']);
  // `phan-loai-s4.mjs` có `nhayDon` riêng, luôn bọc, khác nghĩa (dựng lại đối số đã tách) — design doc khai giữ nguyên.
  kiemTap(SCRIPTS, 'nhayDon', ['nhay.mjs', 'phan-loai-s4.mjs']);
  const nguon = fs.readFileSync(path.join(SCRIPTS, 'nhay.mjs'), 'utf8');
  for (const [, tu] of nguon.matchAll(/from\s+['"]([^'"]+)['"]/g)) assert.match(tu, /^(\.\/|node:)/, `import lạ: ${tu}`);
});

test('KN-6-do bản sao thêm định nghĩa thứ ba — bộ đếm đỏ, thông điệp ghim', () => {
  const d = tam();
  for (const t of fs.readdirSync(SCRIPTS).filter((x) => x.endsWith('.mjs'))) fs.copyFileSync(path.join(SCRIPTS, t), path.join(d, t));
  const p = path.join(d, 'lich.mjs');
  fs.writeFileSync(p, `${fs.readFileSync(p, 'utf8')}\nconst nhayDon = (s) => s;\n`);
  assert.throws(() => kiemTap(d, 'nhayDon', ['nhay.mjs', 'phan-loai-s4.mjs']), /định nghĩa trùng nhayDon/);
});

// Bảng chụp từ hook TRƯỚC khi dời helper: ca này phải xanh ở cả commit ca lẫn commit vật.
test('KN-6-bang lenhBoc giống từng byte bảng chụp trước khi dời, đủ nhánh an toàn và nhánh bọc', () => {
  const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
  const dau = /^[\w./:@%+,-]+(?: [\w./:@%+,-]+)*$/.test(TEP_GIU_NHIP) ? TEP_GIU_NHIP : q(TEP_GIU_NHIP);
  const BANG = [
    ['npm test', 'npm test'],
    ['  node a.mjs --x  ', 'node a.mjs --x'],
    ['echo $HOME', `bash -c 'echo $HOME'`],
    ["echo 'a b'", `bash -c 'echo '\\''a b'\\'''`],
  ];
  assert.equal(BANG.length, 4);
  for (const [vao, than] of BANG) assert.equal(lenhBoc(vao), `node ${dau} -- ${than}`, `lenhBoc đổi hành vi với: ${vao}`);
});

// ── KN-7: tên dãy có nháy trong vị từ ───────────────────────────────────────────────────
const TEN_DAY = [
  ['nháy đơn', "day'1"],
  ['nháy kép', 'day"1'],
  ['gạch chéo ngược', 'day\\1'],
];

test('KN-7 tên dãy có nháy — thoát 0 khi khoá đúng dãy, còn chờ khi khoá của dãy khác', () => {
  assert.equal(TEN_DAY.length, 3);
  for (const [ten, phien] of TEN_DAY) {
    const dot = dotCo('kho co dau cach');
    ghiKhoa(dot, 's4', phien);
    assert.equal(phaiThoat0(lenhChoKhoa(dot, phien, 's4')).vong, 0, ten);
    ghiKhoa(dot, 's4', 'P9');
    phaiTreo(lenhChoKhoa(dot, phien, 's4'));
  }
});

test('KN-7-do bản ghép tên dãy trần — treo hoặc lỗi cú pháp, không thoát 0', async () => {
  const lenhHong = await banSaoLich(phienTran);
  for (const [, phien] of TEN_DAY) {
    const dot = dotCo('kho co dau cach');
    ghiKhoa(dot, 's4', phien);
    const r = chay(lenhHong(dot, phien, 's4'), { tran: TRAN_TREO_MS });
    assert.ok(r.treo || r.ma !== 0, `bản ghép trần đáng lẽ hỏng với ${phien}`);
  }
});
