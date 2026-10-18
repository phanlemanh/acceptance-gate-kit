#!/usr/bin/env node
// gh giả cho ca GT- (hồ sơ vong-mo-co-chu-giu). Trạng thái ở $GH_GIA_DIR/ca.json:
//   {comments: [{id, created_at, body}], pr: {<nhánh>: <url>}, loi: bool, treo: bool, next_id}
// Nhật ký mỗi lời gọi ở $GH_GIA_DIR/nhat-ky.jsonl: {lenh: 'doc'|'ghi'|'khac', so_muc, doi_so}.
// Bắt chước hình JSON của `gh api …/issues/<số>/comments`: trang 30 bình luận, `since` lọc created_at ≥ since,
// `--paginate` đi hết trang (không có cờ thì chỉ trang đầu), `--jq '.[] | …'` in mỗi bình luận một dòng JSON gọn.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.env.GH_GIA_DIR;
const pCa = path.join(DIR, 'ca.json');
const ca = JSON.parse(fs.readFileSync(pCa, 'utf8'));
const doi = process.argv.slice(2);
const ghiNhatKy = (lenh, soMuc) => fs.appendFileSync(path.join(DIR, 'nhat-ky.jsonl'), `${JSON.stringify({ lenh, so_muc: soMuc, doi_so: doi })}\n`);
const luu = () => fs.writeFileSync(pCa, `${JSON.stringify(ca, null, 2)}\n`);

if (ca.treo) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30_000);
}
if (ca.loi) {
  ghiNhatKy('khac', 0);
  process.stderr.write('gh giả: lỗi tiêm\n');
  process.exit(1);
}

const gon = (c) => JSON.stringify({ id: c.id, created_at: c.created_at, body: c.body });

if (doi[0] === 'auth' && doi[1] === 'status') process.exit(0);

if (doi[0] === 'pr' && doi[1] === 'view') {
  let nhanh = '';
  try {
    nhanh = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {}
  ghiNhatKy('khac', 0);
  const url = ca.pr?.[nhanh];
  if (!url) {
    process.stderr.write('no pull requests found\n');
    process.exit(1);
  }
  process.stdout.write(`${url}\n`);
  process.exit(0);
}

if (doi[0] === 'api') {
  const viTri = doi.slice(1).filter((a, i, arr) => !a.startsWith('-') && !['-f', '-X', '--jq', '-F'].includes(arr[i - 1]));
  const duong = viTri[0] ?? '';
  const iX = doi.indexOf('-X');
  const phuongThuc = iX >= 0 ? doi[iX + 1] : doi.includes('-f') ? 'POST' : 'GET';
  const [duongTrong, truyVan = ''] = duong.split('?');
  const q = new URLSearchParams(truyVan);
  const mDs = /^repos\/[^/]+\/[^/]+\/issues\/\d+\/comments$/u.exec(duongTrong);
  const mMot = /^repos\/[^/]+\/[^/]+\/issues\/comments\/(\d+)$/u.exec(duongTrong);
  if (mDs && phuongThuc === 'POST') {
    const iF = doi.indexOf('-f');
    const body = doi[iF + 1].replace(/^body=/u, '');
    const now = process.env.DIEU_PHOI_NOW_MS ? Number(process.env.DIEU_PHOI_NOW_MS) : Date.now();
    const c = { id: ca.next_id++, created_at: new Date(now).toISOString().replace(/\.\d+Z$/u, 'Z'), body };
    ca.comments.push(c);
    luu();
    ghiNhatKy('ghi', 1);
    process.stdout.write(`${gon(c)}\n`);
    process.exit(0);
  }
  if (mDs) {
    let ds = [...ca.comments].sort((a, b) => a.id - b.id);
    if (q.get('since')) ds = ds.filter((c) => c.created_at >= q.get('since'));
    const trang = [];
    for (let i = 0; i < ds.length; i += 30) trang.push(ds.slice(i, i + 30));
    const tra = doi.includes('--paginate') ? trang.flat() : trang[0] ?? [];
    ghiNhatKy('doc', tra.length);
    process.stdout.write(tra.map((c) => `${gon(c)}\n`).join(''));
    process.exit(0);
  }
  if (mMot) {
    const c = ca.comments.find((x) => String(x.id) === mMot[1]);
    ghiNhatKy('doc', c ? 1 : 0);
    if (!c) {
      process.stderr.write('gh: Not Found (HTTP 404)\n');
      process.exit(1);
    }
    process.stdout.write(`${gon(c)}\n`);
    process.exit(0);
  }
}
ghiNhatKy('khac', 0);
process.stderr.write(`gh giả: không hỗ trợ ${doi.join(' ')}\n`);
process.exit(2);
