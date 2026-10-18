// Hàm dựng chung cho ca GT- của hồ sơ vong-mo-co-chu-giu (GT1). Tệp không mang đuôi .test.mjs nên `node --test` không
// chạy nó như một tệp ca; tệp ca import từ đây (không import từ *.test.mjs, kẻo ca của tệp kia chạy lại). Mọi đường
// suy từ vị trí tệp này.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DAY = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(DAY, '..', '..');
export const GOI = path.join(KIT, 'dieu-phoi');
export const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && !k.startsWith('DIEU_PHOI_')));

const canDon = [];
export const donDep = () => {
  for (const d of canDon.splice(0)) fs.rmSync(d, { recursive: true, force: true });
};
export const tam = (tienTo = 'gt-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
export const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
export const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

// Nạp một mô-đun của MỘT gốc gói (gói thật hoặc bản sao bị tiêm), không dùng bộ đệm nạp.
export const nap = (gocGoi, tep) => import(`${pathToFileURL(path.join(gocGoi, 'scripts', tep)).href}?v=${Math.random()}`);

// Bản sao gói bị tiêm: thay `cu` bằng `moi` trong `tep`; bước tiêm phải áp đúng một chỗ, không thì ca đỏ không đo gì.
export function banSao(tep, cu, moi) {
  const goc = tam('gt-tiem-');
  fs.cpSync(GOI, goc, { recursive: true });
  const p = path.join(goc, 'scripts', tep);
  const truoc = fs.readFileSync(p, 'utf8');
  const soCho = truoc.split(cu).length - 1;
  assert.equal(soCho, 1, `bước tiêm vào ${tep} phải khớp đúng một chỗ, khớp ${soCho}: «${cu.slice(0, 60)}»`);
  fs.writeFileSync(p, truoc.replace(cu, moi));
  assert.notEqual(fs.readFileSync(p, 'utf8'), truoc, `bước tiêm vào ${tep} không áp`);
  return goc;
}

// Băm trọn một cây thư mục (đường tương đối + nội dung) — «0 byte ghi» là băm trước bằng băm sau.
export function bamCay(goc) {
  const h = crypto.createHash('sha256');
  if (!fs.existsSync(goc)) return 'vang';
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      h.update(path.relative(goc, p));
      if (st.isDirectory()) di(p);
      else if (st.isFile()) h.update(fs.readFileSync(p));
    }
  };
  di(goc);
  return h.digest('hex');
}

// In bảng hàng của một ma trận viết sẵn: số assert = số hàng, mỗi hàng «hàng · kỳ vọng · thực tế».
export function inMaTran(ten, hang) {
  console.log(`  ${ten}: ${hang.length} hàng`);
  for (const h of hang) console.log(`    ${h.hang} · ${h.ky_vong} · ${h.thuc_te}`);
}

export const chayNode = (args, { cwd, env = {}, input = undefined } = {}) => {
  const r = spawnSync(process.execPath, args, { cwd, env: { ...ENV, ...env }, encoding: 'utf8', input });
  return { ma: r.status, out: r.stdout ?? '', err: r.stderr ?? '' };
};
