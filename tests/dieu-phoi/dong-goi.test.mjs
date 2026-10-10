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

// ---------- DP1-10: phân loại S4 theo cấu trúc lời gọi (AC-10, E10) ----------
const MA_TRAN_S4 = [
  // [nhãn, đầu vào công cụ, mã mong đợi]
  ['node --test …repin-lane-lop-cu.test.mjs', { tool_name: 'Bash', tool_input: { command: 'node --test tests/scripts/repin-lane-lop-cu.test.mjs' } }, 0],
  ['node --test …s4-args-tran-thuoc.test.mjs', { tool_name: 'Bash', tool_input: { command: 'node --test tests/scripts/s4-args-tran-thuoc.test.mjs' } }, 0],
  ['grep -n s4-args …SKILL.md', { tool_name: 'Bash', tool_input: { command: 'grep -n s4-args feature-loop/skills/feature-loop/SKILL.md' } }, 0],
  ['node feature-loop/scripts/repin-lane.mjs --root . --write', { tool_name: 'Bash', tool_input: { command: 'node feature-loop/scripts/repin-lane.mjs --root . --write' } }, 2],
  ['node /x/scripts/s4-args.mjs --slug a', { tool_name: 'Bash', tool_input: { command: 'node /x/scripts/s4-args.mjs --slug a' } }, 2],
  ['node /x/duong-nen.mjs --root .', { tool_name: 'Bash', tool_input: { command: 'node /x/duong-nen.mjs --root .' } }, 2],
  ['Workflow …/acceptance-verify.js', { tool_name: 'Workflow', tool_input: { scriptPath: TEP_S4 } }, 2],
];

export function maTranPhanLoai(gocGoi) {
  const { kho, dot } = khoCoDot(gocGoi);
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P9', slug: 'z', loai: 's4', worktree: tam('dp1-khac-'), cap_luc: new Date().toISOString(), han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
  const lenh = rutHook(gocGoi).find((h) => h.su === 'PreToolUse').lenh;
  const loi = [];
  for (const [nhan, vao, ma] of MA_TRAN_S4) {
    const r = chayLenhHook(lenh, gocGoi, { hook_event_name: 'PreToolUse', session_id: 's', cwd: kho, ...vao }, kho);
    if (r.ma !== ma) loi.push(`${nhan}: mã ${r.ma}, cần ${ma} — ${r.err.trim()}`);
    else if (ma === 0 && r.err !== '') loi.push(`${nhan}: stderr «${r.err.trim()}»`);
    else if (ma === 2 && !/^chan-s4: khoá/.test(r.err)) loi.push(`${nhan}: stderr không bắt đầu «chan-s4: khoá» — ${r.err.trim()}`);
  }
  return { loi, soO: MA_TRAN_S4.length };
}

test('DP1-10 phan-loai', async () => {
  const { loi, soO } = maTranPhanLoai(GOI);
  console.log(`  số ô: ${soO} (số dòng bảng: ${MA_TRAN_S4.length})`);
  assert.equal(soO, 7);
  assert.deepEqual(loi, []);
  // Review Focus 1: bảy dạng lệnh ghép vẫn ra «s4».
  const { phanLoaiLenh } = await import(path.join(GOI, 'scripts', 'phan-loai-s4.mjs'));
  const bayDang = [
    'TZ=UTC node ./repin-lane.mjs a',
    'cd sub && node ../repin-lane.mjs c',
    'node ./repin-lane.mjs p | cat',
    "bash -c 'node ./repin-lane.mjs x'",
    'node /g/giu-nhip.mjs -- node ./repin-lane.mjs',
    "node ./repin-lane.mjs 'hai tu'",
    'node ./repin-lane.mjs --slug=a',
  ];
  for (const l of bayDang) assert.equal(phanLoaiLenh(l), 's4', l);
});

test('DP1-10-do chuoi-con', () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(maTranPhanLoai(sao).loi, [], 'đối chứng dương: bản sao lành phải xanh');
  fs.writeFileSync(
    path.join(sao, 'scripts', 'phan-loai-s4.mjs'),
    "export const BANG_BASH = { 'repin-lane': 's4', 's4-args': 's4', 'duong-nen.mjs': 'duong-nen' };\n" +
      'export function phanLoaiLenh(lenh, bang = BANG_BASH) {\n  for (const [mau, tn] of Object.entries(bang)) if (String(lenh).includes(mau)) return tn;\n  return null;\n}\n',
  );
  const loi = maTranPhanLoai(sao).loi;
  assert.ok(loi.some((l) => l.startsWith('node --test …repin-lane-lop-cu.test.mjs: mã 2')), `phải nêu lệnh test bị chặn nhầm: ${loi.join(' | ')}`);
});

// ---------- DP1-07: không gì riêng của một kho tiêu thụ (AC-7, E7) ----------
const DS_CAM = ['onehub', 'crm', 'prisma', 'bunx', 'bun run', 'bun install', ':3000', ':3001', '5432', 'docs/plan/dot-'];

// Quét mọi tệp văn bản dưới các thư mục (bỏ tệp nhị phân: có byte 0). Trả khớp kèm số tệp đã quét.
export function quetRieng(goc, thuMucs) {
  const khop = [];
  let soTep = 0;
  const di = (d) => {
    if (!fs.existsSync(d)) return;
    for (const ten of fs.readdirSync(d)) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      if (st.isDirectory()) { di(p); continue; }
      if (!st.isFile()) continue;
      const buf = fs.readFileSync(p);
      if (buf.includes(0)) continue;
      soTep++;
      buf.toString('utf8').split('\n').forEach((dong, i) => {
        const thuong = dong.toLowerCase();
        for (const c of DS_CAM) if (thuong.includes(c)) khop.push({ tep: path.relative(goc, p), dong: i + 1, chuoi: c });
      });
    }
  };
  for (const t of thuMucs) di(path.join(goc, t));
  return { khop, soTep };
}

test('DP1-07 khong-rieng-kho', () => {
  const { khop, soTep } = quetRieng(KIT, ['dieu-phoi', 'tests/dieu-phoi/fixtures']);
  console.log(`  số tệp đã quét: ${soTep}`);
  assert.ok(soTep > 0, 'quét 0 tệp — phép quét hỏng');
  assert.deepEqual(khop.map((k) => `${k.tep}:${k.dong} «${k.chuoi}»`), []);
});

test('DP1-07-do', () => {
  const goc = tam();
  chep(GOI, path.join(goc, 'dieu-phoi'));
  assert.deepEqual(quetRieng(goc, ['dieu-phoi']).khop, [], 'đối chứng dương');
  const p = path.join(goc, 'dieu-phoi', 'scripts', 'lich.mjs');
  const dong = fs.readFileSync(p, 'utf8').split('\n');
  dong.splice(1, 0, '// nhanh onehub');
  fs.writeFileSync(p, dong.join('\n'));
  const khop = quetRieng(goc, ['dieu-phoi']).khop.map((k) => `${path.relative('dieu-phoi', k.tep)}:${k.dong}`);
  assert.deepEqual(khop, ['scripts/lich.mjs:2']);
});

// ---------- DP1-08: gói không tự bật qua acceptance-init (AC-8, E8) ----------
const KHAI_GOI = path.join(KIT, 'scripts', 'plugin-declare.mjs');
const khoiKhai = (tep, marker) => fs.readFileSync(tep, 'utf8').match(new RegExp(`<!-- <<<${marker} -->([\\s\\S]*?)<!-- ${marker}>>> -->`))?.[1] ?? null;

// Chạy bước khai gói trên một kho thử; so tập bật với (marketplace − mục mang dấu) ∪ superpowers.
export function kiemKhongTuBat(marketplace) {
  const kho = tam('dp1-khai-');
  const r = spawnSync(process.execPath, [KHAI_GOI, '--root', kho, '--write', '--marketplace', marketplace], { encoding: 'utf8', env: ENV });
  const loi = [];
  if (r.status !== 0) return { loi: [`plugin-declare thoát ${r.status}: ${r.stderr}`], bat: [], can: [] };
  const bat = Object.keys(docJ(path.join(kho, '.claude', 'settings.json')).enabledPlugins ?? {}).sort();
  const mk = docJ(marketplace);
  const can = [...mk.plugins.filter((p) => !(p.tags ?? []).includes('bat-theo-lua-chon')).map((p) => `${p.name}@${mk.name}`), 'superpowers@claude-plugins-official'].sort();
  if (bat.join('|') !== can.join('|')) loi.push(`enabledPlugins lệch: bật [${bat.join(', ')}] cần [${can.join(', ')}]`);
  if (bat.some((n) => n.startsWith('dieu-phoi@'))) loi.push('kho thử bị bật dieu-phoi@acceptance-gate-kit');
  return { loi, bat, can };
}

test('DP1-08 khong-tu-bat', () => {
  const kq = kiemKhongTuBat(path.join(KIT, '.claude-plugin', 'marketplace.json'));
  console.log(`  bật: ${kq.bat.join(', ')}`);
  console.log(`  cần: ${kq.can.join(', ')}`);
  assert.deepEqual(kq.loi, []);
  for (const [tep, mk] of [[path.join(KIT, 'commands', 'acceptance-init.md'), 'INIT-PLUGIN-DECLARE'], [path.join(KIT, 'GUIDE.md'), 'GUIDE-PLUGIN-DECLARE']]) {
    const khoi = khoiKhai(tep, mk);
    assert.ok(khoi, `không tìm thấy khối ${mk}`);
    assert.equal(khoi.includes('dieu-phoi'), false, `${mk} không được nhắc dieu-phoi`);
  }
});

test('DP1-08-do bo-dau', () => {
  const p = path.join(tam(), 'marketplace.json');
  const mk = docJ(path.join(KIT, '.claude-plugin', 'marketplace.json'));
  ghiJ(p, mk);
  assert.deepEqual(kiemKhongTuBat(p).loi, [], 'đối chứng dương: bản sao nguyên vẹn');
  for (const muc of mk.plugins) if (muc.name === 'dieu-phoi') delete muc.tags;
  ghiJ(p, mk);
  const kq = kiemKhongTuBat(p);
  assert.ok(kq.bat.includes('dieu-phoi@acceptance-gate-kit'), `kho thử phải bị bật dieu-phoi: ${kq.bat.join(', ')}`);
  assert.ok(kq.loi.some((l) => l.includes('dieu-phoi')), `lỗi phải nêu dieu-phoi: ${kq.loi.join(' | ')}`);
});

// ---------- DP1-05: hai bản cùng gắn trong lúc chuyển (AC-5, E5) ----------
// Tiến trình phat-lich.mjs đang chạy cho ĐÚNG thư mục đợt này (lọc theo đường, không đếm của ca khác).
const phatLichCua = (dot) =>
  execFileSync('ps', ['-axo', 'pid=,args='], { encoding: 'utf8' })
    .split('\n')
    .filter((d) => d.includes('phat-lich.mjs') && d.includes(dot))
    .map((d) => d.trim());

test('DP1-05 pid-song', () => {
  const { kho, dot } = khoCoDot(GOI);
  const ngu = spawnSync('bash', ['-c', 'sleep 60 >/dev/null 2>&1 & echo $!'], { encoding: 'utf8' });
  const pid = Number(ngu.stdout.trim());
  assert.ok(pid > 0, 'không sinh được tiến trình sleep');
  try {
    fs.writeFileSync(path.join(dot, 'phat-lich.pid'), String(pid));
    const truoc = phatLichCua(dot);
    const r = chayCli(GOI, kho, 'chay');
    assert.equal(r.ma, 0, r.err);
    assert.equal(r.out.trim(), `bộ phát lịch đang chạy (pid ${pid})`);
    assert.deepEqual(phatLichCua(dot), truoc, 'không được sinh bộ phát lịch thứ hai');
  } finally {
    try { process.kill(pid, 'SIGKILL'); } catch {}
  }
});

const KHOI_HOOK_CU = {
  hooks: {
    PreToolUse: [{ matcher: 'Workflow|Bash', hooks: [{ type: 'command', command: 'f="$CLAUDE_PROJECT_DIR/scripts/dieu-phoi/hook-chan-s4.mjs"; [ -f "$f" ] || exit 0; exec node "$f"' }] }],
  },
};

test('DP1-05 canh-bao-hai-ban', () => {
  const { kho } = khoCoDot(GOI);
  ghiJ(path.join(kho, '.claude', 'settings.json'), KHOI_HOOK_CU);
  const r = chayCli(GOI, kho, 'xem');
  assert.equal(r.ma, 0, r.err);
  const dong = r.out.split('\n').filter((d) => d.includes('.claude/settings.json') && d.includes('scripts/dieu-phoi'));
  assert.equal(dong.length, 1, `phải có đúng một dòng cảnh báo: ${r.out}`);
});

test('DP1-05 im-mot-ban', () => {
  const { kho } = khoCoDot(GOI);
  const vang = chayCli(GOI, kho, 'xem');
  assert.equal(vang.ma, 0, vang.err);
  assert.equal(vang.out.includes('scripts/dieu-phoi'), false, `settings vắng: ${vang.out}`);
  ghiJ(path.join(kho, '.claude', 'settings.json'), { hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node scripts/khac.mjs' }] }] } });
  const khac = chayCli(GOI, kho, 'xem');
  assert.equal(khac.ma, 0, khac.err);
  assert.equal(khac.out.includes('scripts/dieu-phoi'), false, `settings có hook khác: ${khac.out}`);
});

// ---------- DP1-11: lõi chép vào thư mục đợt, «lõi vắng» thì ngưng cấp (AC-11, E11) ----------
// io giả của một nhịp: chuỗi sức khoẻ lành (khuôn của loi/phat-lich.test.mjs), gh/git rỗng.
const ioGia = (nowMs, goi = []) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    goi.push([cmd, ...args].join(' '));
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    return '';
  },
});
const suKien = (dot) => {
  const p = path.join(dot, 'su-kien.jsonl');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : [];
};
const song = (pid) => {
  try { process.kill(pid, 0); return true; } catch { return false; }
};
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
const choChet = async (pid) => {
  for (let i = 0; i < 30 && song(pid); i++) await ngu(100);
};
const ghiDon = (dot, phien, loai, worktree) =>
  ghiJ(path.join(dot, 'xin', `${phien}-${loai}.json`), { phien, slug: `h-${phien}`, loai, luc: new Date().toISOString(), worktree });

// Chạy đợt từ một bản gói (chép ra tạm), xoá bản gói đó, rồi đo: bộ phát lịch thật còn sống, không
// cấp lại khoá s4 đang giữ; module bộ phát lịch ĐANG CHẠY (đường rút từ tiến trình) vẫn cấp đơn mới
// và không kêu «lõi vắng». Trả mảng lỗi + trạng thái để ca sau dùng tiếp.
async function chayTiepSauXoaGoi(gocGoi) {
  const sao = path.join(tam('dp1-goi-'), 'dieu-phoi');
  chep(gocGoi, sao);
  const kho = khoThu('dp1-dot11-');
  const kho2 = tam('dp1-wt2-');
  const r = chayCli(sao, kho, 'mo', 'thu');
  assert.equal(r.ma, 0, r.err);
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(dot, 'dieu-phoi.config.json'), { ...docJ(path.join(dot, 'dieu-phoi.config.json')), tick_giay: 1 });
  ghiJ(path.join(dot, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: kho }, { id: 'P2', worktree: kho2 }], hang: [], ngoai_hang_merge: [] });
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'h-P1', loai: 's4', worktree: kho, cap_luc: new Date().toISOString(), han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
  fs.writeFileSync(path.join(dot, 'khoa', 's4', 'nhip'), new Date().toISOString());

  const c = chayCli(sao, kho, 'chay');
  assert.equal(c.ma, 0, c.err);
  const pid = Number(/pid (\d+)/.exec(c.out)?.[1]);
  assert.ok(pid > 0, `chay không in pid: ${c.out}`);
  const dangChay = execFileSync('ps', ['-o', 'args=', '-p', String(pid)], { encoding: 'utf8' }).trim().split(/\s+/).find((t) => t.endsWith('phat-lich.mjs'));
  const mod = await import(dangChay);
  fs.rmSync(path.dirname(sao), { recursive: true, force: true });
  await ngu(2500);
  const loi = [];
  if (!song(pid)) loi.push('bộ phát lịch chết sau khi xoá gói');
  try { process.kill(pid, 'SIGTERM'); } catch {}
  await choChet(pid);
  if (suKien(dot).some((e) => e.loai === 'cap' && e.tai_nguyen === 's4')) loi.push('khoá s4 đang giữ bị cấp lại');

  ghiDon(dot, 'P2', 'duong-nen', kho2);
  const vong = mod.taoVong(dot, ioGia(Date.now()));
  await vong();
  await vong();
  const sk = suKien(dot);
  if (sk.some((e) => e.loai === 'loi-vang')) loi.push(`lõi vắng: ${sk.find((e) => e.loai === 'loi-vang').ly_do}`);
  if (!sk.some((e) => e.loai === 'cap' && e.tai_nguyen === 'duong-nen')) loi.push('đơn mới (duong-nen) không được cấp');
  if (sk.some((e) => e.loai === 'cap' && e.tai_nguyen === 's4')) loi.push('khoá s4 đang giữ bị cấp lại');
  return { loi, dot, kho, dangChay, vong };
}

let trangThai11 = null;

test('DP1-11 ban-theo-dot', async () => {
  trangThai11 = await chayTiepSauXoaGoi(GOI);
  const { loi, dot, dangChay } = trangThai11;
  const pb = docJ(path.join(dot, 'loi', 'PHIEN-BAN.json'));
  console.log(`  bộ phát lịch chạy từ: ${dangChay} · phiên bản lõi theo đợt: ${pb.phien_ban}`);
  assert.equal(dangChay, path.join(dot, 'loi', 'phat-lich.mjs'));
  assert.equal(pb.phien_ban, docJ(path.join(GOI, '.claude-plugin', 'plugin.json')).version);
  assert.deepEqual(loi, []);
});

test('DP1-11 loi-vang', async () => {
  assert.ok(trangThai11, 'cần trạng thái của DP1-11 ban-theo-dot');
  const { dot, kho, vong } = trangThai11;
  fs.rmSync(path.join(dot, 'loi'), { recursive: true, force: true });
  ghiDon(dot, 'P1', 'merge', kho);
  await vong();
  const sk = suKien(dot);
  const vang = sk.filter((e) => e.loai === 'loi-vang');
  assert.equal(vang.length, 1, 'phải có đúng một sự kiện loi-vang');
  assert.equal(vang[0].can_phan, true);
  assert.match(vang[0].ly_do, /lõi vắng/);
  assert.equal(sk.some((e) => e.loai === 'cap' && e.tai_nguyen === 'merge'), false, 'không được cấp khoá khi lõi vắng');
});

test('DP1-11-do bo-chep', async () => {
  const sao = path.join(tam('dp1-bochep-'), 'dieu-phoi');
  chep(GOI, sao);
  const p = path.join(sao, 'scripts', 'dieu-phoi.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('  const loi = chepLoi(thuMuc);\n', '  const loi = DAY;\n');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await chayTiepSauXoaGoi(sao);
  assert.ok(loi.some((l) => l.includes('lõi vắng')), `phải nêu «lõi vắng»: ${loi.join(' | ')}`);
});

// ---------- DP1-12: không fetch khi đang giữ khoá s4 (AC-12, E12) ----------
test('DP1-12 khong-fetch-khi-giu-s4', async () => {
  const { taoVong } = await import(path.join(GOI, 'scripts', 'phat-lich.mjs'));
  const { NHIP } = await import(path.join(GOI, 'scripts', 'cau-hinh.mjs'));
  const { kho, dot } = khoCoDot(GOI);
  let gio = Date.now();
  const goi = [];
  const vong = taoVong(dot, ioGia(gio, goi), () => gio);
  const fetch = () => goi.filter((g) => g.startsWith('git fetch'));
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'a', loai: 's4', worktree: kho, cap_luc: new Date().toISOString(), han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
  await vong();
  gio += NHIP.fetchMs + 1;
  await vong();
  assert.deepEqual(fetch(), [], 'khoá s4 đang giữ: không được fetch');
  const boFetch = suKien(dot).filter((e) => e.loai === 'bo-fetch');
  assert.equal(boFetch.length, 1, 'một dòng bỏ fetch cho cả quãng giữ khoá');
  // Đối chứng dương: khoá trống → đúng một lời gọi fetch.
  fs.rmSync(path.join(dot, 'khoa', 's4'), { recursive: true, force: true });
  gio += 1;
  await vong();
  assert.deepEqual(fetch(), ['git fetch -q origin']);
});

// ---------- DP1-06: gói chạy ở chỗ khác cây kit (AC-6, E6) ----------
// Bản chép CHỈ gồm dieu-phoi/, đặt trong thư mục tạm của hệ điều hành — như bộ nhớ đệm gói.
function banChep(gocGoi) {
  const d = tam('dp1-banchep-');
  const sao = path.join(d, 'dieu-phoi');
  chep(gocGoi, sao);
  const toTien = [];
  for (let p = path.dirname(sao); ; p = path.dirname(p)) {
    toTien.push(p);
    if (path.dirname(p) === p) break;
  }
  const vuong = toTien.filter((p) => fs.existsSync(path.join(p, 'node_modules')) || fs.existsSync(path.join(p, 'feature-loop')));
  return { sao, vuong };
}

const LOI_NAP = /Cannot find module|ERR_MODULE_NOT_FOUND/;

// Mọi lệnh của một bản trên một kho thử mới: mo → 4 hook trong đợt → chay → xem → một nhịp → dong.
async function bangMaThoat(gocGoi) {
  const kho = khoThu('dp1-ban-');
  const bang = [];
  const loiNap = [];
  const ghi = (ten, r) => {
    bang.push([ten, r.ma]);
    if (LOI_NAP.test(r.err ?? '')) loiNap.push(`${ten}: ${r.err.trim()}`);
  };
  ghi('mo', chayCli(gocGoi, kho, 'mo', 'thu'));
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  ghiJ(path.join(dot, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: kho }], hang: [], ngoai_hang_merge: [] });
  for (const h of rutHook(gocGoi)) ghi(`hook ${h.su}`, chayLenhHook(h.lenh, gocGoi, DAU_VAO_MAU[h.su](kho), kho));
  ghi('chay', chayCli(gocGoi, kho, 'chay'));
  ghi('xem', chayCli(gocGoi, kho, 'xem'));
  let maNhip = 0;
  try {
    const { taoVong } = await import(path.join(gocGoi, 'scripts', 'phat-lich.mjs'));
    await taoVong(dot, ioGia(Date.now()))();
    if (suKien(dot).some((e) => e.loai === 'loi-nhip')) maNhip = 1;
  } catch (e) {
    maNhip = 1;
    if (LOI_NAP.test(String(e))) loiNap.push(`nhip: ${e}`);
  }
  bang.push(['nhip', maNhip]);
  ghi('dong', chayCli(gocGoi, kho, 'dong'));
  return { bang, loiNap };
}

test('DP1-06 ban-chep', async () => {
  const { sao, vuong } = banChep(GOI);
  console.log(`  bản chép: ${sao} · tổ tiên có node_modules/feature-loop: ${vuong.length ? vuong.join(', ') : 'không'}`);
  assert.deepEqual(vuong, []);
  const nguon = await bangMaThoat(GOI);
  const chepRa = await bangMaThoat(sao);
  console.log(`  bảng mã thoát (nguồn | bản chép): ${nguon.bang.map(([t, m], i) => `${t}=${m}|${chepRa.bang[i]?.[1]}`).join(' · ')}`);
  assert.deepEqual(chepRa.bang, nguon.bang);
  assert.deepEqual(chepRa.loiNap, []);
});

test('DP1-06 boc-dung-ban', () => {
  const { sao } = banChep(GOI);
  for (const goc of [GOI, sao]) {
    const { kho, dot } = khoCoDot(goc);
    ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'a', loai: 's4', worktree: kho, cap_luc: new Date().toISOString(), han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
    const lenh = rutHook(goc).find((h) => h.su === 'PreToolUse').lenh;
    const r = chayLenhHook(lenh, goc, { hook_event_name: 'PreToolUse', session_id: 's', cwd: kho, tool_name: 'Bash', tool_input: { command: 'node x/repin-lane.mjs --root .', run_in_background: true } }, kho);
    assert.equal(r.ma, 2, r.err);
    const boc = /node (\S*giu-nhip\.mjs) -- /.exec(r.err)?.[1];
    assert.ok(boc, `không thấy dòng lệnh bọc: ${r.err}`);
    assert.ok(boc.startsWith(fs.realpathSync(goc)), `lệnh bọc phải trỏ bản đang chạy ${goc}: ${boc}`);
    assert.equal(fs.existsSync(boc), true, boc);
  }
});

test('DP1-06-do import-ngoai', () => {
  const kitGia = tam('dp1-kitgia-');
  fs.mkdirSync(path.join(kitGia, 'feature-loop', 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(kitGia, 'feature-loop', 'scripts', 'resolve-plugin.mjs'), 'export {};\n');
  const trongKit = path.join(kitGia, 'dieu-phoi');
  chep(GOI, trongKit);
  const p = path.join(trongKit, 'scripts', 'dieu-phoi.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(p, goc.replace(/^(import .* from 'node:child_process';\n)/m, "$1import '../../feature-loop/scripts/resolve-plugin.mjs';\n"));
  assert.notEqual(fs.readFileSync(p, 'utf8'), goc, 'bước tiêm không áp được');
  const kho = khoCoDot(GOI).kho;
  const trong = chayCli(trongKit, kho, 'xem');
  assert.equal(trong.ma, 0, `đối chứng: bản trong cây kit phải chạy — ${trong.err}`);
  const ngoai = path.join(tam('dp1-ngoai-'), 'dieu-phoi');
  chep(trongKit, ngoai);
  const r = chayCli(ngoai, kho, 'xem');
  assert.notEqual(r.ma, 0, 'bản chép có import ngoài gói phải đỏ');
  assert.match(r.err, /dieu-phoi\.mjs/);
  assert.match(r.err, LOI_NAP);
});

// ---------- DP1-04: đọc-cũ — bản chụp thật thư mục đợt do bản crm dựng (AC-4, E4) ----------
const AN_DANH = path.join(DAY, 'an-danh.mjs');
const FIXTURE = path.join(DAY, 'fixtures', 'dot-crm-0910');

// Tập đường khoá (mọi cấp, mảng tính []) của một giá trị JSON.
const duongKhoa = (v, tien = '', ra = new Set()) => {
  if (Array.isArray(v)) v.forEach((x) => duongKhoa(x, `${tien}[]`, ra));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
    ra.add(`${tien}.${k}`);
    duongKhoa(x, `${tien}.${k}`, ra);
  }
  return ra;
};

test('DP1-04 an-danh', async () => {
  const { anDanh, tepCanChep, doiTenKhoa } = await import(AN_DANH);
  // Bản chụp gốc GIẢ LẬP dựng từ khuôn của gói, cài chuỗi riêng kho vào mọi loại giá trị.
  const goc = tam('dp1-chupgia-');
  const G = '/Users/ai-do/dev/crm';
  const mau = (f) => docJ(path.join(GOI, 'scripts', 'mau', f));
  ghiJ(path.join(goc, 'dieu-phoi.config.json'), { ...mau('dieu-phoi.config.json'), nhanh_chinh: 'onehub', goc_kho: G, bao_ve: ['packages/db/prisma/**', 'apps/web/:3000/x.ts'] });
  ghiJ(path.join(goc, 'hang-viec.json'), { ...mau('hang-viec.json'), dot: 'thu', day: [{ id: 'P1', worktree: `${G}/.claude/worktrees/onehub-k2`, link: 'claude://claude.ai/x/1' }], hang: [{ ma: 'K2', slug: 'crm-deal-onehub', day: 'P1', ranh_gioi: ['docs/plan/dot-x/**'] }] });
  ghiJ(path.join(goc, 'khoa', 's4', 'chu.json'), { phien: 'P1', slug: 'crm-deal-onehub', loai: 's4', worktree: `${G}/.claude/worktrees/onehub-k2`, cap_luc: '2026-10-10T00:00:00Z', han_thue_den: '2026-10-10T01:00:00Z' });
  fs.writeFileSync(path.join(goc, 'khoa', 's4', 'nhip'), '2026-10-10T00:05:00Z');
  ghiJ(path.join(goc, 'xin', 'P1-s4.json'), { phien: 'P1', slug: 'crm-deal-onehub', loai: 's4', luc: '2026-10-10T00:01:00Z', worktree: `${G}/.claude/worktrees/onehub-k2`, uoc_phut: 30, ghi_chu: 'bun run db 5432 trên nhánh onehub' });
  ghiJ(path.join(goc, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'viec-phu', hang: 'crm-deal-onehub', noi_dung: { onehub_da_gop: 'bunx prisma migrate', trang_thai: 'Đã gộp origin/onehub, chạy bun install' }, luc: '2026-10-10T00:02:00Z' });
  const dich = tam('dp1-chupan-');
  anDanh(goc, dich);
  const nhanh = 'onehub';
  for (const rel of tepCanChep(goc).filter((r) => r.endsWith('.json'))) {
    const truoc = [...duongKhoa(docJ(path.join(goc, rel)))].map((k) => k.split('.').map((d) => doiTenKhoa(d, nhanh)).join('.')).sort();
    const sau = [...duongKhoa(docJ(path.join(dich, rel)))].sort();
    assert.deepEqual(sau, truoc, `tập khoá lệch ở ${rel}`);
  }
  const { khop } = quetRieng(dich, ['.']);
  assert.deepEqual(khop.map((k) => `${k.tep}:${k.dong} «${k.chuoi}»`), []);
  // Đối chứng dương của phép quét: bản gốc giả lập PHẢI có khớp.
  assert.ok(quetRieng(goc, ['.']).khop.length > 0, 'bản gốc giả lập không cài được chuỗi riêng kho');
});

// Chép fixture vào một kho thử: thay @KHO@ bằng gốc kho, dựng các worktree được nhắc, dựng symlink,
// đặt mtime tệp nhịp bằng chính mốc trong tệp. Trả thư mục đợt + giờ chụp.
function dungDotCu() {
  const kho = khoThu('dp1-doccu-');
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  chep(FIXTURE, dot);
  const tatCa = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tatCa(path.join(d, e.name)) : [path.join(d, e.name)]));
  const worktree = new Set();
  for (const p of tatCa(dot)) {
    const t = fs.readFileSync(p, 'utf8');
    if (!t.includes('@KHO@')) continue;
    const moi = t.split('@KHO@').join(kho);
    for (const m of moi.matchAll(new RegExp(`"(${kho.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*)"`, 'g'))) worktree.add(m[1]);
    fs.writeFileSync(p, moi);
  }
  for (const w of worktree) fs.mkdirSync(w, { recursive: true });
  for (const tn of fs.existsSync(path.join(dot, 'khoa')) ? fs.readdirSync(path.join(dot, 'khoa')) : []) {
    const pn = path.join(dot, 'khoa', tn, 'nhip');
    if (fs.existsSync(pn)) {
      const luc = new Date(fs.readFileSync(pn, 'utf8').trim());
      if (!Number.isNaN(luc.getTime())) fs.utimesSync(pn, luc, luc);
    }
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  const chup = Date.parse(docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi);
  return { kho, dot: fs.realpathSync(dot), chup };
}

const khoaCua = (dot) =>
  ['s4', 'duong-nen', 'merge']
    .map((tn) => ({ tn, chu: fs.existsSync(path.join(dot, 'khoa', tn, 'chu.json')) ? docJ(path.join(dot, 'khoa', tn, 'chu.json')) : null }))
    .filter((k) => k.chu);

async function motNhipDotCu(dot, chup) {
  const { taoVong } = await import(path.join(GOI, 'scripts', 'phat-lich.mjs'));
  const sau = chup + 60_000;
  await taoVong(dot, ioGia(sau), () => sau)();
}

test('DP1-04 doc-cu', async () => {
  const { kho, dot, chup } = dungDotCu();
  const khoa = khoaCua(dot);
  const conHan = khoa.filter((k) => Date.parse(k.chu.han_thue_den) > chup);
  const soDon = fs.readdirSync(path.join(dot, 'xin')).filter((f) => f.endsWith('.json')).length;
  const tt = docJ(path.join(dot, 'trang-thai.json'));
  console.log(`  bản chụp: đợt ${tt.dot} · giờ chụp ${new Date(chup).toISOString()} · khoá còn hạn ${conHan.length} · đơn chờ ${soDon}`);
  assert.ok(conHan.length >= 1, 'bản chụp phải có ít nhất một khoá còn hạn');
  assert.ok(soDon >= 1, 'bản chụp phải có ít nhất một đơn trong xin/');

  const r = chayCli(GOI, kho, 'xem');
  assert.equal(r.ma, 0, r.err);
  assert.ok(r.out.includes(`đợt ${tt.dot}`), `xem phải in tên đợt: ${r.out}`);
  for (const k of khoa) assert.ok(r.out.includes(`${k.tn}:${k.chu.phien}`), `xem phải in ${k.tn}:${k.chu.phien}: ${r.out}`);
  assert.ok(r.out.includes(`chờ lượt ${soDon}`), `xem phải in chờ lượt ${soDon}: ${r.out}`);

  await motNhipDotCu(dot, chup);
  assert.equal(docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi, new Date(chup + 60_000).toISOString(), 'nhịp phải chạy trọn tới bước ghi trang-thai.json');
  const sk = suKien(dot);
  assert.deepEqual(sk.filter((e) => e.loai === 'loi-nhip').map((e) => e.ly_do), [], 'nhịp không được phát loi-nhip');
  assert.deepEqual(sk.filter((e) => e.loai === 'don-hong').map((e) => e.tep), [], 'không đơn nào bị chuyển vào hong/');
  for (const k of conHan) assert.equal(fs.existsSync(path.join(dot, 'khoa', k.tn, 'chu.json')), true, `khoá còn hạn ${k.tn} phải còn giữ`);
});

test('DP1-04-do thieu-han-thue', async () => {
  const { dot, chup } = dungDotCu();
  const p = path.join(dot, 'dieu-phoi.config.json');
  const cfg = docJ(p);
  delete cfg.han_thue_phut.merge;
  ghiJ(p, cfg);
  await motNhipDotCu(dot, chup);
  const loi = suKien(dot).filter((e) => e.loai === 'loi-nhip');
  assert.equal(loi.length, 1, 'phải có đúng một loi-nhip');
  assert.equal(loi[0].can_phan, true);
  assert.match(loi[0].ly_do, /han_thue_phut/);
});

// ---------- DP1-13: danh mục chuyển cho kho đang chép tay lõi (Notes T13) ----------
test('DP1-13 kiem-chuyen', () => {
  const sach = khoThu('dp1-chuyen-sach-');
  const nha = tam('dp1-home-');
  const env = { ...ENV, HOME: nha };
  const xemChuyen = (kho) => {
    const r = spawnSync(process.execPath, [CLI(GOI), 'xem', '--kiem-chuyen'], { cwd: kho, env, encoding: 'utf8' });
    return { ma: r.status, out: r.stdout.trim().split('\n'), err: r.stderr };
  };
  // Đối chứng dương: kho sạch.
  assert.deepEqual(xemChuyen(sach), { ma: 0, out: ['kiem-chuyen: sach'], err: '' });

  const kho = khoThu('dp1-chuyen-');
  const viet = (rel, t) => {
    fs.mkdirSync(path.dirname(path.join(kho, rel)), { recursive: true });
    fs.writeFileSync(path.join(kho, rel), t);
  };
  viet('.claude/settings.json', JSON.stringify(KHOI_HOOK_CU, null, 2));
  viet('package.json', '{\n  "scripts": {\n    "test:dieu-phoi": "node --test \\"scripts/dieu-phoi/test/*.test.mjs\\""\n  }\n}\n');
  viet('_acceptance/x/evals.yaml', 'evals:\n  - id: E1\n    cmd: node scripts/dieu-phoi/dieu-phoi.mjs xem\n');
  viet('scripts/dieu-phoi/README.md', 'node scripts/dieu-phoi/dieu-phoi.mjs mo\n');
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'add', '-A'], { cwd: kho, env: ENV });
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'ban cu'], { cwd: kho, env: ENV });
  viet('.git/hooks/pre-push', '#!/bin/sh\nnode scripts/dieu-phoi/kiem-cheo.mjs\n');
  fs.mkdirSync(path.join(nha, 'Library', 'LaunchAgents'), { recursive: true });
  fs.writeFileSync(path.join(nha, 'Library', 'LaunchAgents', 'a.plist'), `<string>${kho}</string>\n<string>scripts/dieu-phoi/kiem-cheo.mjs</string>\n`);
  fs.writeFileSync(path.join(nha, 'Library', 'LaunchAgents', 'b.plist'), '<string>/kho/khac</string>\n<string>scripts/dieu-phoi/kiem-cheo.mjs</string>\n');
  assert.equal(chayCli(GOI, kho, 'mo', 'thu').ma, 0);
  const luat = path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai', 'LUAT.md');
  fs.appendFileSync(luat, 'node scripts/dieu-phoi/giu-nhip.mjs -- x\n');
  const dongLuat = fs.readFileSync(luat, 'utf8').split('\n').length - 1;

  const dongCua = (rel, chuoi) => fs.readFileSync(path.join(kho, rel), 'utf8').split('\n').findIndex((d) => d.includes(chuoi)) + 1;
  const r = xemChuyen(kho);
  assert.equal(r.ma, 1, r.err);
  assert.deepEqual(r.out, [
    `kiem-chuyen: .claude/settings.json:${dongCua('.claude/settings.json', 'scripts/dieu-phoi/')}`,
    'kiem-chuyen: _acceptance/x/evals.yaml:3',
    'kiem-chuyen: package.json:3',
    'kiem-chuyen: .git/hooks/pre-push:2',
    'kiem-chuyen: ~/Library/LaunchAgents/a.plist:2',
    `kiem-chuyen: <thư mục đợt>/LUAT.md:${dongLuat}`,
  ]);
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
