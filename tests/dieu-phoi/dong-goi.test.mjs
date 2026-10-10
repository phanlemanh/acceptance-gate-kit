// dong-goi.test.mjs — các ca của hồ sơ dieu-phoi-dong-goi-loi (tên ca bắt đầu «DP1-»).
// Kho thử do chính ca dựng (git init trong thư mục tạm); mọi đường suy từ vị trí tệp này.
// Mỗi phép đo có cặp hai chiều trên cùng fixture: bản lành xanh trước, bản bị tiêm đỏ sau, ghim
// thông điệp.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
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
