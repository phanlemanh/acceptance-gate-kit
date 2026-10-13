#!/usr/bin/env node
// kiem-mod.mjs — hồ sơ dieu-phoi-doi-tai-khoan, AC-12 (mod đọc mức dùng) và AC-13 (răng an toàn của lớp mod, spec
// workflow §12.1, §16 T11). Đặt phần mod trước CHÍNH Claude Code: `claude plugin test` trên bản sao gói kèm tệp ca
// (tests/dieu-phoi/mod/doc-muc-dung.test.ts, fixture chung tests/dieu-phoi/fixtures/rate-limits-mod.json), chạy THẬT
// argv mà mod gọi bằng CLI han-muc (round-trip mod → CLI), và `claude plugin validate --strict --json` đối chiếu bảng
// MOD-SU-KIEN. Không có bản Claude Code có lệnh `test` → FAIL nêu đúng điều đó (không bao giờ xanh khi chưa chạy). CI
// của kit không có Claude Code: script chạy ở lượt chấm trên máy, như kiem-validate.mjs của DP1.
// Dùng: node tests/dieu-phoi/kiem-mod.mjs [--root <gốc kho>]
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--root');
const GOC = path.resolve(i > -1 ? process.argv[i + 1] : path.join(DAY, '..', '..'));
const GOI = path.join(GOC, 'dieu-phoi');
const FX_TEP = path.join(GOC, 'tests', 'dieu-phoi', 'fixtures', 'rate-limits-mod.json');
const CA_TEP = path.join(GOC, 'tests', 'dieu-phoi', 'mod', 'doc-muc-dung.test.ts');
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));

let loi = 0;
const ket = (ok, ten, chi = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${ten}${chi ? ` · ${chi}` : ''}`);
  if (!ok) loi++;
};
const canDon = [];
const tam = (tien) => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tien)));
  canDon.push(d);
  return d;
};
const xong = () => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
  process.exit(loi ? 1 : 0);
};

// Bản Claude Code: PATH trước, rồi các bản đi kèm app, sắp theo SỐ phiên bản giảm dần (không theo chữ).
function cacBan() {
  const ra = ['claude'];
  const goc = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude-code');
  if (fs.existsSync(goc)) {
    const so = (v) => v.split('.').map((x) => Number(x) || 0);
    const banApp = fs.readdirSync(goc).filter((v) => /^\d+\.\d+\.\d+$/.test(v)).sort((a, b) => {
      const [x, y] = [so(a), so(b)];
      for (let k = 0; k < 3; k++) if (x[k] !== y[k]) return y[k] - x[k];
      return 0;
    });
    for (const v of banApp) {
      const d = path.join(goc, v);
      for (const con of fs.readdirSync(d)) {
        const b = path.join(d, con, 'claude.app', 'Contents', 'MacOS', 'claude');
        if (fs.existsSync(b)) ra.push(b);
      }
    }
  }
  return ra;
}
const coLenh = (bin, lenh) => {
  const r = spawnSync(bin, ['plugin', '--help'], { encoding: 'utf8', env: ENV });
  return !r.error && new RegExp(`^\\s+${lenh}\\b`, 'm').test(`${r.stdout}${r.stderr}`);
};
const banTest = cacBan().find((b) => coLenh(b, 'test')) ?? null;
const banValidate = cacBan().find((b) => coLenh(b, 'validate')) ?? null;
const tenBan = (b) => (b ? spawnSync(b, ['--version'], { encoding: 'utf8', env: ENV }).stdout.trim() : 'không có');

const { kiemKhungMod, MODULE_MOD, tachSuKienValidate } = await import(pathToFileURL(path.join(GOI, 'scripts', 'mod-luat.mjs')).href);
const FX = JSON.parse(fs.readFileSync(FX_TEP, 'utf8'));

// ---- DP4-12 modules ----
const hj = JSON.parse(fs.readFileSync(path.join(GOI, 'hooks', 'hooks.json'), 'utf8'));
const reg = fs.existsSync(path.join(GOI, 'hooks', 'mod', 'register.ts')) ? fs.readFileSync(path.join(GOI, 'hooks', 'mod', 'register.ts'), 'utf8') : '';
ket(JSON.stringify(hj.modules) === JSON.stringify([MODULE_MOD]) && /dangKyDocMucDung\(on\)/.test(reg), 'DP4-12 modules', `modules ${JSON.stringify(hj.modules)}`);

// Bản sao gói kèm tệp ca (fixture nhúng), chạy `plugin test`; trả {pass, fail, argv, tho}.
function chayPluginTest(sua = null) {
  const sao = path.join(tam('dp4-mod-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  if (sua) sua(sao);
  fs.writeFileSync(path.join(sao, 'hooks', 'mod', 'doc-muc-dung.test.ts'), fs.readFileSync(CA_TEP, 'utf8').replace('__FIXTURE__', JSON.stringify(FX)));
  const r = spawnSync(banTest, ['plugin', 'test', sao], { encoding: 'utf8', env: ENV, timeout: 180_000 });
  const tho = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const pass = Number(/(\d+)\s+pass\b/.exec(tho)?.[1] ?? -1);
  const fail = Number(/(\d+)\s+fail\b/.exec(tho)?.[1] ?? -1);
  const dong = tho.split('\n').find((d) => d.startsWith('ARGV '));
  return { sao, pass, fail, goi: dong ? JSON.parse(dong.slice(5)) : null, tho };
}

// Kho thử có đợt dựng bằng CLI thật của gói (mo + pha dang-chay); trả {kho, dot}.
function khoCoDot() {
  const kho = tam('dp4-kho-');
  const g = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: kho, env: ENV, stdio: 'ignore' });
  g('init', '-q', '-b', 'main');
  g('commit', '-q', '--allow-empty', '-m', 'goc');
  const goi = path.join(kho, 'goi', 'dot-thu');
  fs.mkdirSync(goi, { recursive: true });
  fs.copyFileSync(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'), path.join(goi, 'dieu-phoi.config.json'));
  fs.writeFileSync(path.join(goi, 'hang-viec.json'), JSON.stringify({ dot: '', day: [], hang: [], ngoai_hang_merge: [] }));
  fs.writeFileSync(path.join(goi, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const cli = (...a) => spawnSync(process.execPath, [path.join(GOI, 'scripts', 'dieu-phoi.mjs'), ...a], { cwd: kho, env: ENV, encoding: 'utf8' });
  if (cli('mo', 'thu', '--phien', 's-gs').status !== 0 || cli('pha', 'dang-chay').status !== 0) throw new Error('không dựng được đợt thử');
  return { kho, dot: fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai')) };
}
// Chạy THẬT argv mà mod gọi: đổi gốc bản sao về gốc gói thật, cwd là kho thử có đợt.
function chayArgv(goi, saoGoc) {
  const { kho, dot } = khoCoDot();
  const argv = goi.argv.map((x) => (typeof x === 'string' ? x.split(saoGoc).join(GOI) : x));
  const r = spawnSync(argv[0] === 'node' ? process.execPath : argv[0], argv.slice(1), { cwd: kho, env: ENV, encoding: 'utf8' });
  const p = path.join(dot, 'han-muc.json');
  return { r, doc: fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).doc : [] };
}

if (!banTest) {
  ket(false, 'DP4-12 plugin-test', 'không có Claude Code có lệnh test');
} else {
  const lanh = chayPluginTest();
  ket(lanh.pass === 3 && lanh.fail === 0 && lanh.goi != null, 'DP4-12 plugin-test', `${tenBan(banTest)} · ${lanh.pass} pass ${lanh.fail} fail`);
  if (lanh.goi) {
    const { r, doc } = chayArgv(lanh.goi, lanh.sao);
    const ok = r.status === 0 && doc.length === 1 && doc[0].nguon === 'mod' && JSON.stringify(doc[0].cua_so) === JSON.stringify(FX.mong_doi);
    ket(ok, 'DP4-12 round-trip', `argv ${lanh.goi.argv.slice(2, 6).join(' ')} … · thoát ${r.status} · ${doc.length} lần đọc ${doc[0]?.nguon ?? ''}`);
  } else ket(false, 'DP4-12 round-trip', 'plugin test không in ARGV');
  const boDk = chayPluginTest((sao) => {
    const p = path.join(sao, 'hooks', 'mod', 'doc-muc-dung.ts');
    const goc = fs.readFileSync(p, 'utf8');
    const tiem = goc.replace("e.changed.includes('rateLimits') && ", '');
    if (tiem === goc) throw new Error('bước tiêm bo-dieu-kien không áp được');
    fs.writeFileSync(p, tiem);
  });
  ket(/\(fail\) khong goi khi chi context doi/.test(boDk.tho), 'DP4-12-do bo-dieu-kien', `${boDk.pass} pass ${boDk.fail} fail`);
  const bocMang = chayPluginTest((sao) => {
    const p = path.join(sao, 'hooks', 'mod', 'doc-muc-dung.ts');
    const goc = fs.readFileSync(p, 'utf8');
    const tiem = goc.replace('JSON.stringify(e.rateLimits)', 'JSON.stringify({ rateLimits: e.rateLimits })');
    if (tiem === goc) throw new Error('bước tiêm boc-mang không áp được');
    fs.writeFileSync(p, tiem);
  });
  if (bocMang.goi) {
    const { r, doc } = chayArgv(bocMang.goi, bocMang.sao);
    ket(r.status === 1 && /nguồn mod/.test(r.stderr) && doc.length === 0, 'DP4-12-do boc-mang', `thoát ${r.status} · ${r.stderr.trim()}`);
  } else ket(false, 'DP4-12-do boc-mang', 'bản tiêm không in ARGV');
}

// ---- DP4-13: validate + sự kiện + ba chiều đỏ ----
function suKienValidate(gocGoi) {
  const r = spawnSync(banValidate, ['plugin', 'validate', '--strict', '--json', gocGoi], { encoding: 'utf8', env: ENV });
  let bao = null;
  try {
    bao = JSON.parse(r.stdout);
  } catch {
    bao = null;
  }
  const cacLoi = bao ? [...(bao.manifest?.errors ?? []), ...(bao.contents ?? []).flatMap((c) => c.errors ?? [])] : null;
  const notes = bao ? (bao.contents ?? []).flatMap((c) => c.notes ?? []) : [];
  const dong = notes.find((n) => n.startsWith(`${MODULE_MOD} hooks:`));
  const su = dong ? tachSuKienValidate(dong.slice(`${MODULE_MOD} hooks:`.length)) : new Set();
  return { ma: r.status, ok: bao?.success === true && cacLoi?.length === 0, cacLoi, su };
}
if (!banValidate) ket(false, 'DP4-13 validate', 'không có Claude Code có lệnh validate');
else {
  const v = suKienValidate(GOI);
  ket(v.ok, 'DP4-13 validate', `${tenBan(banValidate)} · thoát ${v.ma} · ${v.cacLoi === null ? 'báo cáo không đọc được' : `${v.cacLoi.length} lỗi`}`);
  const lanh = kiemKhungMod(GOI, { suKienValidate: v.su });
  ket(lanh.length === 0, 'DP4-13 su-kien', lanh.length ? lanh.join(' | ') : `validate thấy: ${[...v.su].join(', ')}`);
  const saoMod = (sua) => {
    const sao = path.join(tam('dp4-t11-'), 'dieu-phoi');
    fs.cpSync(GOI, sao, { recursive: true });
    sua(sao);
    return kiemKhungMod(sao, { suKienValidate: suKienValidate(sao).su });
  };
  const tep = (sao) => path.join(sao, 'hooks', 'mod', 'doc-muc-dung.ts');
  const allow = saoMod((sao) => fs.appendFileSync(tep(sao), "export const tra = () => ({ decision: 'allow' })\n"));
  ket(allow.some((l) => /doc-muc-dung\.ts:\d+ trả lời cho phép/.test(l)), 'DP4-13-do allow', allow.join(' | '));
  const ngoai = saoMod((sao) => {
    const goc = fs.readFileSync(tep(sao), 'utf8');
    const tiem = goc.replace("  on('session.measure',", "  on('tool.call', ($, e, next) => next(e))\n  on('session.measure',");
    if (tiem === goc) throw new Error('bước tiêm ngoai-bang không áp được');
    fs.writeFileSync(tep(sao), tiem);
  });
  ket(ngoai.some((l) => l.includes('doc-muc-dung.ts') && l.includes('tool.call')), 'DP4-13-do ngoai-bang', ngoai.join(' | '));
  const la = saoMod((sao) => fs.writeFileSync(path.join(sao, 'hooks', 'mod', 'la.ts'), 'export const la = 1\n'));
  ket(la.some((l) => l.includes('la.ts')), 'DP4-13-do phan-la', la.join(' | '));
}
xong();
