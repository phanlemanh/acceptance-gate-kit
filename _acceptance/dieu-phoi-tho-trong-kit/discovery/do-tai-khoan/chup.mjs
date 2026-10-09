#!/usr/bin/env node
// Chụp phần TRÊN ĐĨA của phép đo DP0 (đổi tài khoản trong app desktop), chạy y hệt trước và sau
// khi đổi. Chỉ in số đếm và giờ — không in mã tài khoản, tên phiên hay email (kho kit công khai).
// Phần đọc qua công cụ của phiên (list_sessions, list_scheduled_tasks, list_groups, get_usage)
// do phiên chạy phép đo ghi tay vào cùng tệp, theo README.md cạnh script này.
// Dùng: node chup.mjs <nhãn> [--crm <gốc kho crm>]  → in JSON ra stdout.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [nhan, ...du] = process.argv.slice(2);
if (!nhan) {
  process.stderr.write('dùng: chup.mjs <nhãn> [--crm <gốc kho crm>]\n');
  process.exit(2);
}
const crm = du[du.indexOf('--crm') + 1] && du.includes('--crm') ? du[du.indexOf('--crm') + 1] : path.join(os.homedir(), 'dev/crm');
const home = os.homedir();
const moiNhat = (d) => {
  let t = 0;
  for (const f of fs.readdirSync(d)) t = Math.max(t, fs.statSync(path.join(d, f)).mtimeMs);
  return t ? new Date(t).toISOString() : null;
};

const khoPhien = path.join(home, 'Library/Application Support/Claude/claude-code-sessions');
const cacKho = [];
if (fs.existsSync(khoPhien)) {
  for (const a of fs.readdirSync(khoPhien).sort()) {
    const pa = path.join(khoPhien, a);
    if (!fs.statSync(pa).isDirectory()) continue;
    for (const b of fs.readdirSync(pa).sort()) {
      const pb = path.join(pa, b);
      if (!fs.statSync(pb).isDirectory()) continue;
      cacKho.push({ so_phien: fs.readdirSync(pb).length, ghi_cuoi: moiNhat(pb) });
    }
  }
}
cacKho.sort((x, y) => String(y.ghi_cuoi).localeCompare(String(x.ghi_cuoi)));

const projects = path.join(home, '.claude/projects');
const banGhi = {};
for (const d of fs.existsSync(projects) ? fs.readdirSync(projects) : []) {
  const nhom = d.includes('dev-crm') ? 'crm' : d.includes('acceptance-gate-kit') ? 'kit' : 'khac';
  const n = fs.readdirSync(path.join(projects, d)).filter((f) => f.endsWith('.jsonl')).length;
  banGhi[nhom] = (banGhi[nhom] ?? 0) + n;
}

const lichHen = path.join(home, '.claude/scheduled-tasks');
const pidTep = path.join(crm, '.acceptance-runs/dieu-phoi-hien-tai/phat-lich.pid');
let boPhatLich = 'khong-co-dot';
if (fs.existsSync(pidTep)) {
  const pid = Number(fs.readFileSync(pidTep, 'utf8'));
  try {
    process.kill(pid, 0);
    boPhatLich = 'song';
  } catch {
    boPhatLich = 'chet';
  }
}
let worktreeCrm = null;
try {
  worktreeCrm = execFileSync('git', ['-C', crm, 'worktree', 'list'], { encoding: 'utf8' }).trim().split('\n').length;
} catch {}

process.stdout.write(
  `${JSON.stringify(
    {
      nhan,
      luc: new Date().toISOString(),
      kho_phien_app: cacKho,
      ban_ghi_hoi_thoai_jsonl: banGhi,
      lich_hen_tren_dia: fs.existsSync(lichHen) ? fs.readdirSync(lichHen).length : 0,
      bo_phat_lich_crm: boPhatLich,
      worktree_crm: worktreeCrm,
    },
    null,
    2,
  )}\n`,
);
