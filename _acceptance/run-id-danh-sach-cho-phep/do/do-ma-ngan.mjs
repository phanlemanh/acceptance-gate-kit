// Đo mã lượt ngắn (dưới 4 ký tự) mà đúng dạng chữ-số trên dòng eval của sổ lượt chạy, mỗi kho một dòng.
// Luật và hàm bóc RÚT từ bộ chấm (khối RUN-ID-HINH + dòng docRid), đường suy từ vị trí tệp này — không chép biểu thức.
// Kho không đọc được hoặc không có sổ nào → dừng có tên, mã 1 (không in dòng toàn số 0 giống kho sạch).
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process'; import { fileURLToPath } from 'url';
const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { hinhRunId } = await import(path.join(kit, 'feature-loop/scripts/carry-plan.mjs'));
const R = hinhRunId();
const src = fs.readFileSync(path.join(kit, 'feature-loop/workflows/acceptance-verify.js'), 'utf8');
const dong = src.match(/^const docRid = .*$/m);
if (!dong) { console.error('do-ma-ngan: không rút được dòng docRid từ bộ chấm'); process.exit(1); }
// docRid với luật nhận mọi chuỗi = đúng bước bóc của bộ chấm, trả chuỗi đã bóc kể cả khi sai hình dạng.
const strip = new Function(`const RUN_ID_HINH = /^[\\s\\S]*$/; ${dong[0]}; return docRid`)();
// Hình dạng hợp lệ trừ độ dài: luật của bộ chấm bỏ lượng từ độ dài.
if (!/\{\d+,\d+\}/.test(R.source)) { console.error('do-ma-ngan: luật không có lượng từ độ dài {m,n}'); process.exit(1); }
const okShape = new RegExp(R.source.replace(/\{\d+,\d+\}/, '*'));
let loi = 0;
for (const repo of process.argv.slice(2)) {
  let files;
  try { files = execFileSync('git', ['-C', repo, 'ls-files', '_acceptance/*/run-log.jsonl']).toString().trim().split('\n').filter(Boolean); }
  catch (e) { console.error(`do-ma-ngan: ${repo}: không đọc được kho git`); loi = 1; continue; }
  if (!files.length) { console.error(`do-ma-ngan: ${repo}: không có sổ lượt chạy nào`); loi = 1; continue; }
  let tong = 0, hong = 0; const ngan = [];
  for (const f of files) {
    for (const l of fs.readFileSync(path.join(repo, f), 'utf8').split('\n')) {
      if (!l.trim()) continue; let o; try { o = JSON.parse(l); } catch { continue; }
      if (!o.evalId || o.kind) continue; tong++;
      const s = strip(o.run_id); if (s === '' || R.test(s)) continue; hong++;
      if (s.length < 4 && okShape.test(s)) ngan.push(s);
    }
  }
  console.log(repo, 'tep', files.length, 'dong eval', tong, 'khong dat', hong, 'ngan-nhung-dung-dang', ngan.length, JSON.stringify([...new Set(ngan)].slice(0, 10)));
}
process.exit(loi);
