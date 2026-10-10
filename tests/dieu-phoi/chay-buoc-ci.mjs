#!/usr/bin/env node
// chay-buoc-ci.mjs — hồ sơ dieu-phoi-dong-goi-loi, AC-3 (E3).
// Rút ĐÚNG MỘT bước của .github/workflows/gate.yml có lệnh chứa `tests/dieu-phoi` — không chép
// lệnh tay — rồi chạy nó từ gốc kho và đọc tổng kết TAP. Xanh khi: thoát 0, «# pass» ≥ 84 (số ca
// lõi chép từ crm), «# fail 0», «# skipped 0», «# todo 0».
// Dùng: node tests/dieu-phoi/chay-buoc-ci.mjs [--root <gốc kho>]
// Gốc mặc định suy từ vị trí tệp này (tests/dieu-phoi/ → ../..).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SO_CA_LOI = 84;
const DAY = path.dirname(fileURLToPath(import.meta.url));

// Mỗi bước bắt đầu bằng «- name:»; lệnh là giá trị `run:` một dòng hoặc khối `run: |`.
export function rutBuoc(yaml, can = 'tests/dieu-phoi') {
  const buoc = yaml.split(/\n(?=\s*- name:)/).slice(1);
  const ra = [];
  for (const b of buoc) {
    const ten = /- name:\s*(.*)/.exec(b)?.[1]?.trim() ?? '';
    let lenh = null;
    const khoi = /\n(\s*)run:\s*\|\s*\n((?:\1\s+.*(?:\n|$))+)/.exec(b);
    if (khoi) lenh = khoi[2].split('\n').map((d) => d.trim()).filter(Boolean).join('\n');
    else lenh = /\n\s*run:\s*(.+)/.exec(b)?.[1]?.trim() ?? null;
    if (lenh && lenh.includes(can)) ra.push({ ten, lenh });
  }
  return ra;
}

export function docTongKet(tap) {
  const so = (k) => {
    const m = new RegExp(`^# ${k} (\\d+)$`, 'm').exec(tap);
    return m ? Number(m[1]) : null;
  };
  return { pass: so('pass'), fail: so('fail'), skipped: so('skipped'), todo: so('todo') };
}

function main() {
  const i = process.argv.indexOf('--root');
  const goc = path.resolve(i > -1 ? process.argv[i + 1] : path.join(DAY, '..', '..'));
  const yaml = fs.readFileSync(path.join(goc, '.github', 'workflows', 'gate.yml'), 'utf8');
  const buoc = rutBuoc(yaml);
  if (buoc.length !== 1) {
    console.log(`FAIL: DP1-03 buoc-ci · tim thay ${buoc.length} buoc chua tests/dieu-phoi trong gate.yml (can dung 1)`);
    process.exit(1);
  }
  const { lenh } = buoc[0];
  // Gỡ NODE_TEST_CONTEXT: khi tệp này chạy bên trong một `node --test` (ca DP1-03-do), biến đó làm
  // `node --test` con nói giao thức nội bộ với cha thay vì in TAP — tổng kết đọc ra rỗng.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync('bash', ['-c', lenh], { cwd: goc, env, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const tap = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
  const tk = docTongKet(tap);
  const dong = `lenh: ${lenh} · exit ${r.status} · pass ${tk.pass} fail ${tk.fail} skipped ${tk.skipped} todo ${tk.todo}`;
  const xanh = r.status === 0 && tk.pass !== null && tk.pass >= SO_CA_LOI && tk.fail === 0 && tk.skipped === 0 && tk.todo === 0;
  if (xanh) {
    console.log(`PASS: DP1-03 buoc-ci · ${dong}`);
    process.exit(0);
  }
  const hong = tap.split('\n').filter((d) => /^\s*not ok /.test(d)).map((d) => d.trim());
  console.log(`FAIL: DP1-03 buoc-ci · ${dong}${hong.length ? ` · ${hong.join(' | ')}` : ''}`);
  process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) main();
