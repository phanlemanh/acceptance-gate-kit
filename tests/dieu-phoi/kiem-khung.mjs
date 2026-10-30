#!/usr/bin/env node
// kiem-khung.mjs — hồ sơ trang-thai-dot-dieu-phoi-tho (DP6b), AC-5…AC-9: phần mod khung trạng thái đợt đặt trước
// CHÍNH Claude Code. Cùng khung với kiem-mod.mjs của DP4: tìm bản Claude Code có `plugin test` (PATH, rồi bản đi kèm
// app theo semver), không có → FAIL nêu đúng điều đó (không bao giờ xanh khi chưa chạy). CI của kit không có Claude
// Code: script chạy ở lượt chấm trên máy.
//   KH-05 dải · KH-06 nhịp · KH-07 pane — `claude plugin test` trên bản sao gói kèm tests/dieu-phoi/mod/khung.test.ts;
//     ba chỗ giữ trong tệp ca được thay bằng stdout THẬT mà CLI in trong lượt này trên kho thử (round-trip CLI → mod).
//   KH-08 — `claude -p "/dieu-phoi:xem"` trong môi trường CÔ LẬP (bỏ mọi biến CLAUDE_*/ANTHROPIC_*, thư mục cấu hình
//     tạm, khoá API giả, đường tới model trỏ cổng chết): mọi lần gọi model lộ thành api_error, không tốn token, không
//     chạm tài khoản nào.
//   KH-09 — `claude plugin validate --strict --json` + kiemKhungMod + kiemChiVe (răng «mod chỉ vẽ»).
// Mỗi ca đỏ chạy CHÍNH phép đo trên bản sao bị tiêm, SAU khi bản lành xanh, và kiểm bước tiêm đã áp.
// Dùng: node tests/dieu-phoi/kiem-khung.mjs [--root <gốc kho>]
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--root');
const GOC = path.resolve(i > -1 ? process.argv[i + 1] : path.join(DAY, '..', '..'));
const GOI = path.join(GOC, 'dieu-phoi');
const FIXTURE = path.join(GOC, 'tests', 'dieu-phoi', 'fixtures', 'dot-crm-0910');
const CA_TEP = path.join(GOC, 'tests', 'dieu-phoi', 'mod', 'khung.test.ts');
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const TZ = 'Asia/Ho_Chi_Minh';

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

// ---- bản Claude Code: PATH trước, rồi các bản đi kèm app theo SỐ phiên bản giảm dần ----
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
const BAN = cacBan().find((b) => coLenh(b, 'test')) ?? null;
const tenBan = (b) => (b ? spawnSync(b, ['--version'], { encoding: 'utf8', env: ENV }).stdout.trim() : 'không có');

// ---- kho thử: đợt «sau-14-10» chép từ fixture (cùng cách khoDot của khung.test.mjs) ----
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, stdio: 'ignore' });
function khoGit() {
  const kho = tam('kk-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return kho;
}
function khoDot({ nhip = true, hong = false, canhBao = false } = {}) {
  const kho = khoGit();
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  fs.cpSync(FIXTURE, dot, { recursive: true });
  for (const f of ['hang-viec.json', 'trang-thai.json']) {
    const p = path.join(dot, f);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split('@KHO@').join(kho));
  }
  for (const d of JSON.parse(fs.readFileSync(path.join(dot, 'hang-viec.json'), 'utf8')).day) if (path.isAbsolute(d.worktree)) fs.mkdirSync(d.worktree, { recursive: true });
  if (!nhip) fs.rmSync(path.join(dot, 'trang-thai.json'));
  if (hong) fs.writeFileSync(path.join(dot, 'trang-thai.json'), '{hỏng');
  if (canhBao) {
    fs.mkdirSync(path.join(kho, '.claude'), { recursive: true });
    fs.writeFileSync(path.join(kho, '.claude', 'settings.json'), JSON.stringify({ hooks: { PostToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: 'node scripts/dieu-phoi/hook-nhip.mjs' }] }] } }));
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return kho;
}
const cli = (cwd, ...a) => spawnSync(process.execPath, [path.join(GOI, 'scripts', 'dieu-phoi.mjs'), ...a], { cwd, env: { ...ENV, TZ }, encoding: 'utf8' });

// ---- bản sao gói ----
function banSao(sua = null) {
  const sao = path.join(tam('kk-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  if (sua) sua(sao);
  return sao;
}
function tiem(p, cu, moi) {
  const goc = fs.readFileSync(p, 'utf8');
  const sau = goc.replace(cu, moi);
  if (sau === goc) throw new Error(`bước tiêm không áp được ở ${path.basename(p)}: ${String(cu).slice(0, 60)}`);
  fs.writeFileSync(p, sau);
}
const tepKhung = (sao) => path.join(sao, 'hooks', 'mod', 'khung.ts');

if (!BAN) {
  for (const k of ['KH-05', 'KH-06', 'KH-07', 'KH-08', 'KH-09']) ket(false, k, 'không có Claude Code có lệnh test');
  xong();
}
console.log(`engine: ${tenBan(BAN)}`);

// ================= KH-05 · KH-06 · KH-07 — plugin test =================
const wt3 = (kho) => path.join(kho, '.claude', 'worktrees', 'wt-3');
const khoP3 = khoDot();
const STDOUT = {
  json_p3: cli(wt3(khoP3), 'xem', '--json', '--khung').stdout,
  json_khong: cli(khoGit(), 'xem', '--json', '--khung').stdout,
  chu: cli(wt3(khoP3), 'xem').stdout,
};
const caTep = fs.readFileSync(CA_TEP, 'utf8')
  .replace('__XEM_JSON_P3__', JSON.stringify(STDOUT.json_p3))
  .replace('__XEM_JSON_KHONG__', JSON.stringify(STDOUT.json_khong))
  .replace('__XEM_CHU__', JSON.stringify(STDOUT.chu));
function chayPluginTest(sua = null) {
  const sao = banSao(sua);
  // Gốc gói của CHÍNH bản sao: AC-6 hứa argv[1] BẰNG <gốc gói>/scripts/dieu-phoi.mjs, không chỉ khớp đuôi.
  fs.writeFileSync(path.join(sao, 'hooks', 'mod', 'khung.test.ts'), caTep.replace('__GOC_GOI__', JSON.stringify(sao)));
  const r = spawnSync(BAN, ['plugin', 'test', sao], { cwd: path.dirname(sao), encoding: 'utf8', env: ENV, timeout: 180_000 });
  const tho = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const ca = new Map([...tho.matchAll(/^\((pass|fail)\) (.+?) \[/gm)].map((m) => [m[2], m[1]]));
  return { ca, tho };
}
// Khối lỗi của MỘT ca trong đầu ra plugin test: từ dòng «(fail) <ca> [» tới dòng «(pass)/(fail)» kế tiếp.
function khoiLoi(tho, ca) {
  const i = tho.indexOf(`(fail) ${ca} [`);
  if (i < 0) return '';
  const sau = tho.slice(i + 1);
  const j = sau.search(/^\((pass|fail)\) /m);
  return j < 0 ? sau : sau.slice(0, j);
}
const NHOM = {
  'KH-05 dai': ['dai co dot', 'dai khong dot', 'dai loi doc', 'dai stdout hong', 'dai survey', 'bam xem mo pane'],
  'KH-06 nhip': ['nhip co dot', 'nhip khong dot', 'nhip loi 20s'],
  'KH-07 pane': ['pane dung chu khung', 'pane dang doc', 'pane loi doc', 'khong mo pane khi khong hoi', 'lenh xem tra chu'],
};
const lanh = chayPluginTest();
for (const [ten, ds] of Object.entries(NHOM)) {
  const truot = ds.filter((c) => lanh.ca.get(c) !== 'pass');
  ket(truot.length === 0, ten, truot.length ? `trượt: ${truot.map((c) => `${c}=${lanh.ca.get(c) ?? 'vắng'}`).join(', ')}` : `${ds.length}/${ds.length} pass · terminal+desktop`);
  for (const c of truot) console.log(khoiLoi(lanh.tho, c).split('\n').slice(0, 30).join('\n'));
}
// Chiều đỏ: mỗi bản tiêm phải làm ĐÚNG ca nhắm tới thành (fail), SAU khi bản lành xanh đúng ca đó (đối chứng
// dương trên chính dòng), và khối lỗi THẬT của ca trong đầu ra plugin test phải mang thông điệp ghim — không in
// chữ tự nối (finding t2/t3/t5 của lượt chấm 1).
const DO = [
  ['KH-05-do bo-next-khong-dot', 'dai khong dot', /toBeUndefined/, (s) => tiem(tepKhung(s), '    if (dai === null) return next(e)\n', '')],
  ['KH-06-do chu-ky', 'nhip khong dot', /Expected: 1\s+Received: 2/, (s) => tiem(path.join(s, 'scripts', 'khung.mjs'), 'khong_dot: 120000', 'khong_dot: 20000')],
  ['KH-06-do argv-goc', 'nhip co dot', /scripts\/dieu-phoi\.mjs/, (s) => tiem(tepKhung(s), "['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json', '--khung']", "['node', './scripts/dieu-phoi.mjs', 'xem', '--json', '--khung']")],
  // Hồ sơ khung-dot-dinh-vi AC-5: pane vẽ lại chữ `xem` thì ca pane khung phải đỏ.
  ['KH-07-do pane-chu-xem', 'pane dung chu khung', /Expected|toEqual/, (s) => tiem(tepKhung(s), 'chuKhung(k.kq).split', 'chuXem(k.kq).split')],
  ['KH-07-do mo-khong-hoi', 'khong mo pane khi khong hoi', /Expected: 0\s+Received: 1/, (s) => tiem(tepKhung(s), "  on('session.start', async ($, e, next) => {\n", "  on('session.start', async ($, e, next) => {\n    void $.ui.open({ id: PANE, title: 'Đợt' })\n")],
];
for (const [ten, caNham, ghim, sua] of DO) {
  const r = chayPluginTest(sua);
  const khoi = khoiLoi(r.tho, caNham);
  const dong = khoi.split('\n').map((x) => x.trim()).filter((x) => ghim.test(x) || /^(Expected|Received)/.test(x)).slice(0, 2).join(' · ');
  const ok = lanh.ca.get(caNham) === 'pass' && r.ca.get(caNham) === 'fail' && ghim.test(khoi);
  ket(ok, ten, `lành ${lanh.ca.get(caNham) ?? 'vắng'} · tiêm ${r.ca.get(caNham) ?? 'vắng'} ${caNham} · ${dong || 'không thấy thông điệp ghim'}`);
}

// ================= KH-08 — lệnh qua engine thật, môi trường cô lập =================
const moiTruongCoLap = () => {
  const env = Object.fromEntries(Object.entries(ENV).filter(([k]) => !/^(CLAUDE|ANTHROPIC)/.test(k)));
  // CLAUDE_CODE_MAX_RETRIES=0: không có nó engine thử lại API theo backoff hàng phút trên cổng chết (đo 12/10).
  return { ...env, TZ, CLAUDE_CONFIG_DIR: tam('kk-cfg-'), ANTHROPIC_API_KEY: 'khoa-gia-kiem-thu', ANTHROPIC_BASE_URL: 'http://127.0.0.1:9', CLAUDE_CODE_MAX_RETRIES: '0' };
};
function chayLenh(sao, kho) {
  const r = spawnSync(BAN, ['-p', '/dieu-phoi:xem', '--plugin-dir', sao, '--output-format', 'json'], { cwd: kho, env: moiTruongCoLap(), encoding: 'utf8', timeout: 120_000 });
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { loi_tho: `${r.stdout}${r.stderr}`.slice(0, 200) };
  }
}
const goiLanh = banSao();
const HANG = [
  ['(a) có nhịp', khoDot()],
  ['(b) chưa có nhịp', khoDot({ nhip: false })],
  ['(c) không đợt', khoGit()],
  ['(d) có cảnh báo', khoDot({ canhBao: true })],
];
const hangLoi = [];
for (const [ten, kho] of HANG) {
  const x = cli(kho, 'xem');
  const mong = ten.startsWith('(c)') ? x.stderr.replace(/\n$/, '') : `dieu-phoi: ${x.stdout.replace(/\n$/, '')}`;
  const d = chayLenh(goiLanh, kho);
  const ok = d.is_error === false && d.num_turns === 0 && d.total_cost_usd === 0 && d.result === mong;
  console.log(`  KH-08 ${ten} · num_turns ${d.num_turns} · cost ${d.total_cost_usd} · ${d.result === mong ? 'result khớp xem' : `result «${String(d.result ?? d.loi_tho).slice(0, 80)}»`}`);
  if (!ok) hangLoi.push(ten);
}
ket(hangLoi.length === 0, 'KH-08 lenh-dong-co-that', hangLoi.length ? `trượt: ${hangLoi.join(', ')}` : `${HANG.length}/${HANG.length} hàng · không lượt model`);
const aXanh = hangLoi.length === 0;
const veModel = (d) => d.num_turns >= 1 && d.terminal_reason === 'api_error';
// Đường lùi: gói CÓ mod, CLI lỗi → hook ném, engine bỏ qua hook, lệnh markdown chạy (đi tới model đã chết).
const lui = chayLenh(goiLanh, khoDot({ hong: true }));
ket(aXanh && veModel(lui) && !String(lui.result ?? '').startsWith('dieu-phoi: khung'), 'KH-08 duong-lui', `num_turns ${lui.num_turns} · ${lui.terminal_reason}`);
const khoA = HANG[0][1];
const doMatcher = chayLenh(banSao((s) => tiem(tepKhung(s), "{ command: 'dieu-phoi:xem' }", "{ command: 'dieu-phoi:xem-khac' }")), khoA);
ket(aXanh && veModel(doMatcher), 'KH-08-do matcher', `num_turns ${doMatcher.num_turns} · ${doMatcher.terminal_reason}`);
const doKhongMod = chayLenh(banSao((s) => {
  const p = path.join(s, 'hooks', 'hooks.json');
  const hj = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!hj.modules) throw new Error('bước tiêm không áp được: hooks.json không có modules');
  delete hj.modules;
  fs.writeFileSync(p, JSON.stringify(hj, null, 2));
}), khoA);
ket(aXanh && veModel(doKhongMod), 'KH-08-do khong-mod', `num_turns ${doKhongMod.num_turns} · ${doKhongMod.terminal_reason}`);

// ================= KH-09 — răng «mod chỉ vẽ» =================
function baoValidate(gocGoi) {
  const r = spawnSync(BAN, ['plugin', 'validate', '--strict', '--json', gocGoi], { encoding: 'utf8', env: ENV });
  let bao = null;
  try {
    bao = JSON.parse(r.stdout);
  } catch {}
  const cacLoi = bao ? [...(bao.manifest?.errors ?? []), ...(bao.contents ?? []).flatMap((c) => c.errors ?? [])] : null;
  const notes = bao ? (bao.contents ?? []).flatMap((c) => c.notes ?? []) : [];
  const gatingHooks = bao ? (bao.contents ?? []).flatMap((c) => c.gatingHooks ?? []) : [];
  const dong = notes.find((n) => n.startsWith('./mod/register.ts hooks:'));
  return { ok: bao?.success === true && cacLoi?.length === 0, cacLoi, notes, gatingHooks, dong };
}
async function kiemRang(gocGoi) {
  const { kiemKhungMod, kiemChiVe, SU_KIEN_MOD, SU_KIEN_CONG, tachSuKienValidate } = await import(`${pathToFileURL(path.join(gocGoi, 'scripts', 'mod-luat.mjs')).href}?v=${Math.random()}`);
  const v = baoValidate(gocGoi);
  const ds = [];
  if (!v.ok) ds.push(`validate: ${v.cacLoi === null ? 'báo cáo không đọc được' : v.cacLoi.map((e) => e.message).join(' | ')}`);
  const reg = fs.readFileSync(path.join(gocGoi, 'hooks', 'mod', 'register.ts'), 'utf8');
  if (!SU_KIEN_MOD['./mod/khung.ts'] || !/dangKyKhung\(on\)/.test(reg)) ds.push('bảng MOD-SU-KIEN thiếu ./mod/khung.ts hoặc register.ts không gọi dangKyKhung(on)');
  for (const [rel, su] of Object.entries(SU_KIEN_MOD)) if (su.some((s) => SU_KIEN_CONG.includes(s))) ds.push(`${rel}: bảng chứa sự kiện cổng`);
  ds.push(...kiemKhungMod(gocGoi, { suKienValidate: tachSuKienValidate(v.dong ? v.dong.slice('./mod/register.ts hooks:'.length) : '') }));
  ds.push(...kiemChiVe(gocGoi, { notes: v.notes, gatingHooks: v.gatingHooks }));
  return { ds, v };
}
const rLanh = await kiemRang(GOI);
console.log(`  KH-09 calls: ${rLanh.v.notes.find((n) => n.startsWith('./mod/register.ts calls:')) ?? '(không có dòng calls)'}`);
ket(rLanh.ds.length === 0, 'KH-09 rang', rLanh.ds.length ? rLanh.ds.join(' | ') : `validate sạch · gating [${rLanh.v.gatingHooks.map((g) => `${g.hook} catch=${g.hasCatch}`).join(', ')}]`);
const lanhXanh = rLanh.ds.length === 0;
const RANG_DO = [
  ['KH-09-do cong', (l) => l.includes('khung.ts') && l.includes('tool.call'), (s) => {
    tiem(tepKhung(s), "  on('session.start', async ($, e, next) => {\n", "  on('tool.call', ($, e, next) => next(e))\n  on('session.start', async ($, e, next) => {\n");
    tiem(path.join(s, 'scripts', 'mod-luat.mjs'), "'./mod/khung.ts': ['command.run', 'session.start', 'ui.render']", "'./mod/khung.ts': ['command.run', 'session.start', 'tool.call', 'ui.render']");
  }],
  ['KH-09-do gating', (l) => l.startsWith('gatingHooks lệch') && l.includes('prompt.submit'), (s) => {
    tiem(tepKhung(s), "  on('session.start', async ($, e, next) => {\n", "  on('prompt.submit', ($, e, next) => next(e))\n  on('session.start', async ($, e, next) => {\n");
    tiem(path.join(s, 'scripts', 'mod-luat.mjs'), "'./mod/khung.ts': ['command.run', 'session.start', 'ui.render']", "'./mod/khung.ts': ['command.run', 'prompt.submit', 'session.start', 'ui.render']");
  }],
  ['KH-09-do allow', (l) => /hooks\/mod\/khung\.ts:\d+ trả lời cho phép/.test(l), (s) => fs.appendFileSync(tepKhung(s), "export const tra = () => ({ decision: 'allow' })\n")],
  ['KH-09-do ghi-tep', (l) => l.includes('$.fs.write'), (s) => tiem(tepKhung(s), '  await update($, khung, () => moi)\n  $.clock.after', "  await update($, khung, () => moi)\n  await $.fs.write('/tmp/khung-dem.json', '{}')\n  $.clock.after")],
  ['KH-09-do argv', (l) => l.includes('khung.ts') && l.includes('pha'), (s) => tiem(tepKhung(s), "'xem', '--json', '--khung']", "'pha', 'dang-chay']")],
];
for (const [ten, khop, sua] of RANG_DO) {
  const { ds } = await kiemRang(banSao(sua));
  const trung = ds.filter(khop);
  ket(lanhXanh && trung.length > 0, ten, trung[0] ?? ds.join(' | '));
}
xong();
