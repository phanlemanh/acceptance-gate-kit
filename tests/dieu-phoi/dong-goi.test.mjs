// dong-goi.test.mjs — các ca của hồ sơ dieu-phoi-dong-goi-loi (tên ca bắt đầu «DP1-»).
// Kho thử do chính ca dựng (git init trong thư mục tạm); mọi đường suy từ vị trí tệp này.
// Mỗi phép đo có cặp hai chiều trên cùng fixture: bản lành xanh trước, bản bị tiêm đỏ sau, ghim
// thông điệp.
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

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp1-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const chep = (nguon, dich) => fs.cpSync(nguon, dich, { recursive: true });
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};

// Môi trường sạch cho tiến trình con: bỏ biến GIT_* (ca chạy trong hook git) và NODE_TEST_CONTEXT.
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));

// Kho thử: git init + một commit, trong thư mục tạm.
function khoThu(tienTo = 'dp1-kho-') {
  const d = tam(tienTo);
  const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: d, env: ENV, stdio: 'ignore' });
  git('init', '-q', '-b', 'main');
  git('commit', '-q', '--allow-empty', '-m', 'goc');
  return d;
}

// Bộ ba (sự kiện, matcher, tệp thân) + lệnh, rút từ hooks.json của một gói.
function rutHook(gocGoi) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const ra = [];
  for (const [su, khoi] of Object.entries(hj.hooks ?? {})) {
    for (const k of khoi) {
      for (const h of k.hooks ?? []) {
        const tep = /([\w-]+\.mjs)/.exec(h.command ?? '')?.[1] ?? null;
        ra.push({ su, matcher: k.matcher ?? '—', tep, lenh: h.command });
      }
    }
  }
  return ra;
}

// Chạy MỘT lệnh hook như Claude Code: thay ${CLAUDE_PLUGIN_ROOT} bằng gốc gói, stdin là JSON sự kiện.
function chayLenhHook(lenh, gocGoi, dauVao, cwd) {
  const r = spawnSync('bash', ['-c', lenh.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi)], {
    cwd,
    input: JSON.stringify(dauVao),
    env: { ...ENV, CLAUDE_PLUGIN_ROOT: gocGoi },
    encoding: 'utf8',
  });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Đầu vào mẫu của từng sự kiện.
const DAU_VAO_MAU = {
  PreToolUse: (cwd) => ({ hook_event_name: 'PreToolUse', session_id: 's', cwd, tool_name: 'Bash', tool_input: { command: 'ls' } }),
  PostToolUse: (cwd) => ({ hook_event_name: 'PostToolUse', session_id: 's', cwd, tool_name: 'Bash', tool_input: { command: 'ls' }, tool_response: {} }),
  Notification: (cwd) => ({ hook_event_name: 'Notification', session_id: 's', cwd, notification_type: 'idle_prompt', message: 'cho' }),
  UserPromptSubmit: (cwd) => ({ hook_event_name: 'UserPromptSubmit', session_id: 's', cwd, prompt: 'xin chao' }),
};

// ---------- DP1-01: cài là đủ (AC-1, E1) ----------
const BANG_HOOK = [
  ['PreToolUse', 'Workflow|Bash', 'hook-chan-s4.mjs'],
  ['PostToolUse', '*', 'hook-nhip.mjs'],
  ['Notification', 'idle_prompt|permission_prompt', 'hook-cho-nguoi.mjs'],
  ['UserPromptSubmit', '—', 'hook-cho-nguoi.mjs'],
];

export function kiemCaiDat(gocKit, gocGoi) {
  const loi = [];
  const mk = docJ(path.join(gocKit, '.claude-plugin', 'marketplace.json'));
  const muc = (mk.plugins ?? []).find((p) => p.name === 'dieu-phoi');
  if (!muc) loi.push('marketplace.json không có mục dieu-phoi');
  else if (muc.source !== './dieu-phoi') loi.push(`mục dieu-phoi trỏ ${muc.source}, cần ./dieu-phoi`);
  const vGoi = docJ(path.join(gocGoi, '.claude-plugin', 'plugin.json')).version;
  const vFl = docJ(path.join(gocKit, 'feature-loop', '.claude-plugin', 'plugin.json')).version;
  if (vGoi !== vFl) loi.push(`phiên bản lệch: dieu-phoi ${vGoi} vs feature-loop ${vFl}`);
  const hooks = rutHook(gocGoi);
  const co = new Set(hooks.map((h) => `${h.su}|${h.matcher}|${h.tep}`));
  const can = new Set(BANG_HOOK.map((b) => b.join('|')));
  const thieu = [...can].filter((x) => !co.has(x));
  const thua = [...co].filter((x) => !can.has(x));
  if (thieu.length || thua.length) loi.push(`bộ ba hooks.json lệch bảng — thiếu [${thieu.join(' ; ')}] thừa [${thua.join(' ; ')}]`);
  for (const h of hooks) {
    if (!h.tep || !fs.existsSync(path.join(gocGoi, 'scripts', h.tep))) loi.push(`${h.su}: tệp thân ${h.tep ?? '(không rút được)'} không có trong gói`);
  }
  return { loi, hooks, co: [...co], can: [...can], vGoi, vFl };
}

test('DP1-01 cai-la-du', () => {
  const kq = kiemCaiDat(KIT, GOI);
  console.log(`  phiên bản dieu-phoi ${kq.vGoi} · feature-loop ${kq.vFl}`);
  console.log(`  bộ ba rút: ${kq.co.join(' ; ')}`);
  console.log(`  bảng viết sẵn: ${kq.can.join(' ; ')}`);
  assert.deepEqual(kq.loi, []);
  const kho = khoThu();
  let daChay = 0;
  for (const h of kq.hooks) {
    const r = chayLenhHook(h.lenh, GOI, DAU_VAO_MAU[h.su](kho), kho);
    assert.equal(r.ma, 0, `${h.su}: mã ${r.ma} — ${r.err}`);
    assert.doesNotMatch(r.err, /Cannot find module|ERR_MODULE_NOT_FOUND/, h.su);
    daChay++;
  }
  console.log(`  số lệnh đã chạy: ${daChay}`);
  assert.equal(daChay, 4);
});

test('DP1-01-do doi-ten-tep', () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(kiemCaiDat(KIT, sao).loi, [], 'đối chứng dương: bản sao nguyên vẹn phải sạch');
  fs.renameSync(path.join(sao, 'scripts', 'hook-nhip.mjs'), path.join(sao, 'scripts', 'hook-nhip-cu.mjs'));
  const loi = kiemCaiDat(KIT, sao).loi;
  assert.ok(loi.some((l) => l.includes('hook-nhip.mjs')), `phải nêu hook-nhip.mjs: ${loi.join(' | ')}`);
});

test('DP1-01-do dao-lenh', () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(kiemCaiDat(KIT, sao).loi, [], 'đối chứng dương: bản sao nguyên vẹn phải sạch');
  const p = path.join(sao, 'hooks', 'hooks.json');
  const hj = docJ(p);
  const a = hj.hooks.PostToolUse[0].hooks[0].command;
  hj.hooks.PostToolUse[0].hooks[0].command = hj.hooks.Notification[0].hooks[0].command;
  hj.hooks.Notification[0].hooks[0].command = a;
  ghiJ(p, hj);
  const loi = kiemCaiDat(KIT, sao).loi;
  assert.ok(loi.some((l) => l.includes('PostToolUse')), `phải nêu PostToolUse: ${loi.join(' | ')}`);
});

// ---------- DP1-02: chiều im ở kho không đợt + đối chứng dương từng hook (AC-2, E2) ----------

const CLI = (gocGoi) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(gocGoi, cwd, ...doiSo) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: ENV, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Băm cây tệp (trừ .git/): đường tương đối + nội dung, symlink tính bằng đích.
function bamCay(goc) {
  const h = crypto.createHash('sha256');
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      if (d === goc && ten === '.git') continue;
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      const rel = path.relative(goc, p);
      if (st.isSymbolicLink()) h.update(`L ${rel} ${fs.readlinkSync(p)}\n`);
      else if (st.isDirectory()) { h.update(`D ${rel}\n`); di(p); }
      else h.update(`F ${rel} `).update(fs.readFileSync(p)).update('\n');
    }
  };
  di(goc);
  return h.digest('hex');
}

// Tệp Workflow S4 thật nằm NGOÀI kho thử (để không đổi cây đang băm).
const TEP_S4 = (() => {
  const d = tam('dp1-s4-');
  const p = path.join(d, 'acceptance-verify.js');
  fs.writeFileSync(p, "export const meta = { name: 'acceptance-verify', description: 'x' };\n");
  return p;
})();

const BAY_DAU_VAO = [
  ['PreToolUse', 'Workflow S4', (cwd) => ({ hook_event_name: 'PreToolUse', session_id: 's', cwd, tool_name: 'Workflow', tool_input: { scriptPath: TEP_S4 } })],
  ['PreToolUse', 'Bash repin-lane', (cwd) => ({ hook_event_name: 'PreToolUse', session_id: 's', cwd, tool_name: 'Bash', tool_input: { command: 'node feature-loop/scripts/repin-lane.mjs --root . --write' } })],
  ['PreToolUse', 'Bash ls', DAU_VAO_MAU.PreToolUse],
  ['PostToolUse', 'Bash ls', DAU_VAO_MAU.PostToolUse],
  ['Notification', 'idle_prompt', DAU_VAO_MAU.Notification],
  ['Notification', 'permission_prompt', (cwd) => ({ ...DAU_VAO_MAU.Notification(cwd), notification_type: 'permission_prompt' })],
  ['UserPromptSubmit', 'lời nhắn', DAU_VAO_MAU.UserPromptSubmit],
];
const SO_O = 21;

function baKhoIm(gocGoi) {
  const trong = khoThu('dp1-trong-');
  const coAcc = khoThu('dp1-acc-');
  fs.mkdirSync(path.join(coAcc, '_acceptance'));
  fs.writeFileSync(path.join(coAcc, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  const daDong = khoThu('dp1-dong-');
  for (const lenh of [['mo', 'thu'], ['dong']]) {
    const r = chayCli(gocGoi, daDong, ...lenh);
    assert.equal(r.ma, 0, `dựng kho đợt đã đóng: ${lenh.join(' ')} — ${r.err}`);
  }
  assert.equal(fs.existsSync(path.join(daDong, '.acceptance-runs', 'dieu-phoi-hien-tai')), false, 'symlink phải đã gỡ');
  assert.equal(fs.existsSync(path.join(daDong, '.acceptance-runs', 'dieu-phoi-thu')), true, 'thư mục đợt phải còn');
  return [['trong', trong], ['co-acceptance', coAcc], ['dot-da-dong', daDong]];
}

export function chieuIm(gocGoi, baKho) {
  const lenhCua = Object.fromEntries(rutHook(gocGoi).map((h) => [h.su, h.lenh]));
  const loi = [];
  let soO = 0;
  for (const [tenKho, kho] of baKho) {
    for (const [su, ten, dauVao] of BAY_DAU_VAO) {
      const truoc = bamCay(kho);
      const r = chayLenhHook(lenhCua[su], gocGoi, dauVao(kho), kho);
      const sau = bamCay(kho);
      soO++;
      const o = `${tenKho}/${su}/${ten}`;
      if (r.ma !== 0) loi.push(`${o}: mã ${r.ma}`);
      if (r.out !== '') loi.push(`${o}: stdout=«${r.out.trim()}»`);
      if (r.err !== '') loi.push(`${o}: stderr=«${r.err.trim()}»`);
      if (truoc !== sau) loi.push(`${o}: cây tệp đổi`);
    }
  }
  return { loi, soO };
}

test('DP1-02 chieu-im', () => {
  const { loi, soO } = chieuIm(GOI, baKhoIm(GOI));
  console.log(`  số ô đo: ${soO} (SO_O = ${SO_O})`);
  assert.equal(soO, SO_O);
  assert.deepEqual(loi, []);
});

test('DP1-02 ngoai-git', () => {
  const d = tam('dp1-ngoai-git-');
  const loi = [];
  for (const h of rutHook(GOI)) {
    const r = chayLenhHook(h.lenh, GOI, DAU_VAO_MAU[h.su](d), d);
    if (r.ma !== 0 || r.out !== '' || r.err !== '') loi.push(`${h.su}: mã ${r.ma} out «${r.out}» err «${r.err}»`);
  }
  assert.deepEqual(loi, []);
});

// Kho có đợt mở bằng gói, dãy P1 có worktree = chính kho thử.
function khoCoDot(gocGoi) {
  const kho = khoThu('dp1-dot-');
  const r = chayCli(gocGoi, kho, 'mo', 'thu');
  assert.equal(r.ma, 0, r.err);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(dot, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: kho }], hang: [], ngoai_hang_merge: [] });
  return { kho, dot };
}

test('DP1-02-duong tung-hook', async (t) => {
  const { kho, dot } = khoCoDot(GOI);
  const lenhCua = Object.fromEntries(rutHook(GOI).map((h) => [h.su, h.lenh]));
  await t.test('DP1-02-duong chan-s4', () => {
    const r = chayLenhHook(lenhCua.PreToolUse, GOI, BAY_DAU_VAO[0][2](kho), kho);
    assert.equal(r.ma, 2, r.err);
    assert.match(r.err, /^chan-s4: khoá s4/);
  });
  await t.test('DP1-02-duong nhip', () => {
    ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'a', loai: 's4', worktree: kho, cap_luc: new Date().toISOString(), han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
    const pNhip = path.join(dot, 'khoa', 's4', 'nhip');
    fs.writeFileSync(pNhip, 'cu');
    const r = chayLenhHook(lenhCua.PostToolUse, GOI, DAU_VAO_MAU.PostToolUse(kho), kho);
    assert.equal(r.ma, 0, r.err);
    assert.notEqual(fs.readFileSync(pNhip, 'utf8'), 'cu', 'tệp nhip phải đổi');
    fs.rmSync(path.join(dot, 'khoa', 's4'), { recursive: true, force: true });
  });
  await t.test('DP1-02-duong cho-nguoi', () => {
    const r = chayLenhHook(lenhCua.Notification, GOI, DAU_VAO_MAU.Notification(kho), kho);
    assert.equal(r.ma, 0, r.err);
    assert.equal(fs.existsSync(path.join(dot, 'cho-nguoi', 'P1.json')), true);
  });
  await t.test('DP1-02-duong xoa-cho-nguoi', () => {
    const r = chayLenhHook(lenhCua.UserPromptSubmit, GOI, DAU_VAO_MAU.UserPromptSubmit(kho), kho);
    assert.equal(r.ma, 0, r.err);
    assert.equal(fs.existsSync(path.join(dot, 'cho-nguoi', 'P1.json')), false);
  });
});

test('DP1-02-do in-stdout', () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const baKho = baKhoIm(sao);
  assert.deepEqual(chieuIm(sao, baKho).loi, [], 'đối chứng dương: bản sao lành phải im');
  const p = path.join(sao, 'scripts', 'hook-cho-nguoi.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("if (!thuMuc) return 'ngoai-dot';", "if (!thuMuc) { process.stdout.write('chan-doan\\n'); return 'ngoai-dot'; }");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const loi = chieuIm(sao, baKho).loi;
  assert.ok(loi.some((l) => l.includes('UserPromptSubmit') && l.includes('chan-doan')), `phải nêu UserPromptSubmit + chan-doan: ${loi.join(' | ')}`);
});

// ---------- DP1-06 khuôn: LUAT.md và README không trỏ bản chép tay (AC-6, E6) ----------
const CHUOI_BAN_CU = 'scripts/dieu-phoi/';
export function kiemKhuon(gocGoi) {
  const loi = [];
  for (const rel of ['scripts/mau/LUAT.md', 'README.md']) {
    fs.readFileSync(path.join(gocGoi, rel), 'utf8').split('\n').forEach((d, i) => {
      if (d.includes(CHUOI_BAN_CU)) loi.push(`${rel}:${i + 1}`);
    });
  }
  return loi;
}

test('DP1-06 khuon', () => {
  assert.deepEqual(kiemKhuon(GOI), []);
});

test('DP1-06-do khuon', () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(kiemKhuon(sao), [], 'đối chứng dương');
  const p = path.join(sao, 'scripts', 'mau', 'LUAT.md');
  const dong = fs.readFileSync(p, 'utf8').split('\n');
  dong.splice(3, 0, 'node scripts/dieu-phoi/giu-nhip.mjs -- node x.mjs');
  fs.writeFileSync(p, dong.join('\n'));
  assert.deepEqual(kiemKhuon(sao), ['scripts/mau/LUAT.md:4']);
});

// ---------- DP1-03: bước CI của gói (AC-3, E3b) ----------
const CHAY_BUOC_CI = path.join(DAY, 'chay-buoc-ci.mjs');

function banSaoCi() {
  const d = tam('dp1-ci-');
  chep(path.join(KIT, '.github', 'workflows', 'gate.yml'), path.join(d, '.github', 'workflows', 'gate.yml'));
  chep(GOI, path.join(d, 'dieu-phoi'));
  chep(path.join(DAY, 'loi'), path.join(d, 'tests', 'dieu-phoi', 'loi'));
  chep(CHAY_BUOC_CI, path.join(d, 'tests', 'dieu-phoi', 'chay-buoc-ci.mjs'));
  return d;
}

test('DP1-03-do ca-tiem-loi', () => {
  const d = banSaoCi();
  const chay = () => spawnSync(process.execPath, [path.join(d, 'tests', 'dieu-phoi', 'chay-buoc-ci.mjs'), '--root', d], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lanh = chay();
  assert.equal(lanh.status, 0, `đối chứng dương: bản sao lành phải xanh — ${lanh.stdout}`);
  assert.match(lanh.stdout, /^PASS: DP1-03 buoc-ci/m);

  const tep = path.join(d, 'tests', 'dieu-phoi', 'loi', 'lich.test.mjs');
  const goc = fs.readFileSync(tep, 'utf8');
  const m = /^test\('([^']+)'.*\{\s*$/m.exec(goc);
  assert.ok(m, 'không tìm thấy ca đầu của lich.test.mjs');
  const daTiem = goc.replace(m[0], `${m[0]}\n  assert.fail('tiem');`);
  assert.notEqual(daTiem, goc, 'bước tiêm không đổi tệp');
  fs.writeFileSync(tep, daTiem);
  const do_ = chay();
  assert.notEqual(do_.status, 0, `bản bị tiêm phải đỏ — ${do_.stdout}`);
  assert.ok(do_.stdout.includes(m[1]), `đầu ra phải nêu tên ca bị tiêm «${m[1]}»: ${do_.stdout}`);
});
