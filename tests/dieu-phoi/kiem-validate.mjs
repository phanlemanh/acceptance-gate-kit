#!/usr/bin/env node
// kiem-validate.mjs — hồ sơ dieu-phoi-dong-goi-loi, AC-1 vế bộ nạp thật (E1b).
// Đặt gói trước bộ kiểm gói của Claude Code (`claude plugin validate --strict --json`): gói lành
// phải sạch lỗi; bản sao bỏ lớp `hooks` ngoài cùng của hooks.json phải bị báo lỗi nêu «hooks».
// Không có CLI `claude` → FAIL (không bao giờ xanh khi chưa chạy). CI của kit không có CLI này,
// nên eval chỉ chạy ở lượt chấm trên máy.
// Dùng: node tests/dieu-phoi/kiem-validate.mjs [--root <gốc kho>]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--root');
const GOC = path.resolve(i > -1 ? process.argv[i + 1] : path.join(DAY, '..', '..'));
const GOI = path.join(GOC, 'dieu-phoi');

let loi = 0;
const ket = (ok, ten, chi) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${ten}${chi ? ` · ${chi}` : ''}`);
  if (!ok) loi++;
};

const ban = spawnSync('claude', ['--version'], { encoding: 'utf8' });
if (ban.error) {
  ket(false, 'DP1-01b validate', `claude CLI vắng (${ban.error.code})`);
  process.exit(1);
}
const phienBan = ban.stdout.trim();

const validate = (dir) => {
  const r = spawnSync('claude', ['plugin', 'validate', '--strict', '--json', dir], { encoding: 'utf8' });
  let bao = null;
  try {
    bao = JSON.parse(r.stdout);
  } catch {
    bao = null;
  }
  const cacLoi = bao ? [...(bao.manifest?.errors ?? []), ...(bao.contents ?? []).flatMap((c) => c.errors ?? [])] : null;
  return { ma: r.status, bao, cacLoi, tho: `${r.stdout}${r.stderr}` };
};

const lanh = validate(GOI);
ket(
  lanh.ma === 0 && lanh.cacLoi !== null && lanh.cacLoi.length === 0,
  'DP1-01b validate',
  `claude ${phienBan} · exit ${lanh.ma} · ${lanh.cacLoi === null ? 'báo cáo không đọc được' : `${lanh.cacLoi.length} lỗi`}`,
);

const tamDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp1-validate-')));
try {
  const saoGoi = path.join(tamDir, 'dieu-phoi');
  fs.cpSync(GOI, saoGoi, { recursive: true });
  const tepHook = path.join(saoGoi, 'hooks', 'hooks.json');
  const goc = JSON.parse(fs.readFileSync(tepHook, 'utf8'));
  if (!goc.hooks) {
    ket(false, 'DP1-01b-do bo-lop-hooks', 'hooks.json của gói không có lớp hooks để bỏ — bước tiêm không áp được');
  } else {
    fs.writeFileSync(tepHook, `${JSON.stringify(goc.hooks, null, 2)}\n`);
    const do_ = validate(saoGoi);
    const neuHooks = (do_.cacLoi ?? []).some((e) => JSON.stringify(e).includes('hooks'));
    ket(do_.ma !== 0 && neuHooks, 'DP1-01b-do bo-lop-hooks', `exit ${do_.ma} · ${neuHooks ? 'báo cáo nêu hooks' : `báo cáo KHÔNG nêu hooks: ${do_.tho.slice(0, 300)}`}`);
  }
} finally {
  fs.rmSync(tamDir, { recursive: true, force: true });
}

process.exit(loi ? 1 : 0);
