#!/usr/bin/env node
// E4b của hồ sơ vong-mo-co-chu-giu: CHỈ ĐỌC kênh thật phanlemanh/acceptance-gate-kit#308 bằng gh thật, vào một trạng thái
// cục bộ TẠM (kho git tạm, không chạm .acceptance-runs/ của kho này, không ghi gì lên kênh). In
// «tong <n> · doc-lap <m> · co-ma <a> · khuon-cu <b> · bo-qua <c>»; m đếm ĐỘC LẬP bằng gh api --paginate --jq length,
// không qua tin.mjs. Thoát 0 khi n === m, a + b + c === n, b > 0, n > 30. gh vắng / chưa đăng nhập → thoát 2.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const KENH = { chu: 'phanlemanh', kho: 'acceptance-gate-kit', so: '308' };

const auth = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
if (auth.error || auth.status !== 0) {
  process.stderr.write('không đọc được ở đây: gh vắng hoặc chưa đăng nhập\n');
  process.exit(2);
}
const dem = spawnSync('gh', ['api', '--paginate', `repos/${KENH.chu}/${KENH.kho}/issues/${KENH.so}/comments?per_page=100`, '--jq', 'length'], { encoding: 'utf8' });
if (dem.status !== 0) {
  process.stderr.write(`không đọc được ở đây: ${dem.stderr}\n`);
  process.exit(2);
}
const docLap = dem.stdout.trim().split('\n').filter(Boolean).reduce((t, x) => t + Number(x), 0);

const tam = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gt-that-')));
try {
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: tam });
  const env = { ...process.env };
  delete env.DIEU_PHOI_GH;
  const vai = spawnSync(process.execPath, [path.join(KIT, 'dieu-phoi', 'scripts', 'tin.mjs'), 'vai', '--kenh', `${KENH.chu}/${KENH.kho}#${KENH.so}`, '--may', 'DOC'], { cwd: tam, env, encoding: 'utf8' });
  if (vai.status !== 0) throw new Error(vai.stderr);
  const { tachKenh, tepKenh, dongBo, docTrangThai } = await import(pathToFileURL(path.join(KIT, 'dieu-phoi', 'scripts', 'tin-kenh.mjs')).href);
  const { docDongDau } = await import(pathToFileURL(path.join(KIT, 'dieu-phoi', 'scripts', 'tin-doc.mjs')).href);
  const k = tachKenh(`${KENH.chu}/${KENH.kho}#${KENH.so}`);
  const p = tepKenh(tam, k);
  const db = dongBo(p, k, { tranMs: 60_000 });
  if (db.loi) {
    process.stderr.write(`không đọc được ở đây: ${db.loi}\n`);
    process.exit(2);
  }
  const ds = docTrangThai(p).dong;
  let coMa = 0;
  let cu = 0;
  let boQua = 0;
  for (const d of ds) {
    const dd = docDongDau(d.text);
    if (dd?.cu) cu++;
    else if (dd) coMa++;
    else boQua++;
  }
  const n = ds.length;
  console.log(`tong ${n} · doc-lap ${docLap} · co-ma ${coMa} · khuon-cu ${cu} · bo-qua ${boQua}`);
  const sai = [];
  if (n !== docLap) sai.push(`tong ${n} ≠ doc-lap ${docLap}`);
  if (coMa + cu + boQua !== n) sai.push('ba nhóm không cộng đủ tổng');
  if (cu <= 0) sai.push('không thấy tin khuôn cũ nào — bộ đọc khuôn cũ hỏng?');
  if (n <= 30) sai.push(`tong ${n} ≤ 30 — chưa đi qua phân trang`);
  if (sai.length) {
    process.stderr.write(`FAIL: ${sai.join(' · ')}\n`);
    process.exit(1);
  }
  console.log('PASS: E4b đọc kênh thật qua phân trang, đếm khớp độc lập');
} finally {
  fs.rmSync(tam, { recursive: true, force: true });
}
