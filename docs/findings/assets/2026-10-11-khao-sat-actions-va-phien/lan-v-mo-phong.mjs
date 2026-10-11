// Mô phỏng: hồ sơ nào của một kho sẽ đi làn V (xanh-sạch, không mời ký Cổng 2) nếu máy tự
// định tuyến mục Ngoài-n mà chính máy đề xuất known-limits / wont-fix. Chỉ đọc.
//   node lan-v-mo-phong.mjs <thư mục chứa _acceptance/> <danh sách slug, mỗi dòng một slug>
// Dựng thư mục từ nhánh gộp, không đọc cây làm việc:
//   git -C <kho> archive origin/<nhánh> _acceptance | tar -x -C <thư mục>
import { readFileSync } from 'node:fs';
const [root, slugFile] = process.argv.slice(2);
const rd = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const cls = f => !f ? '(không file)' : /(^|\/)(test|tests|__tests__|e2e)\/|\.(spec|test)\.[a-z]+$|^_acceptance\/|evals?\.ya?ml|\/rang\//.test(f) ? 'thước' : /^docs\/|\.md$/.test(f) ? 'tài liệu' : /^(scripts|\.github|tooling)\//.test(f) ? 'công cụ' : 'mã SP';
const route = t => /Known limits/i.test(t) ? 'known-limits' : /hợp đồng mới/i.test(t) ? 'new-contract' : /không sửa|wont/i.test(t) ? 'wont-fix' : 'khác';
const R = {}, M = {}; let ho = 0, muc = 0, sauMay = 0, nguoi = 0, trung = 0; const lech = [];
for (const s of readFileSync(slugFile, 'utf8').split('\n').filter(Boolean)) {
  const d = `${root}/_acceptance/${s}`, c = rd(`${d}/contract.md`), r = rd(`${d}/evidence-report.md`);
  if (!c || !r || !/^status:\s*signed-off/m.test(c)) continue; ho++;
  const t2 = (c.match(/^risk_tier:\s*(\S+)/m) || [])[1] === 'T2', unc = /(^|[^a-z])UNCERTAIN([^a-z]|$)/i.test(r);
  const items = ((rd(`${d}/review-findings.md`) || '').split(/^## Ngoài hợp đồng.*$/m)[1] || '').split(/^- \*\*/m).slice(1)
    .map(it => ({ de: (it.match(/Đề xuất:\s*([\w-]+)/) || [])[1] || '?', lop: cls((it.match(/^\s*file:\s*`([^`]+)`/m) || [])[1]) }));
  muc += items.length; sauMay += items.filter(i => i.de === 'new-contract').length;
  for (const i of items) M[`${i.lop}|${i.de}`] = (M[`${i.lop}|${i.de}`] || 0) + 1;
  for (const l of (rd(`${d}/decisions.jsonl`) || '').split('\n')) {
    let j; try { j = JSON.parse(l); } catch { continue; }
    const m = (j.decision || '').match(/^Ngoài-(\d+):\s*(.*)$/); if (!m || j.stage !== 'gate2') continue;
    const it = items[+m[1] - 1]; if (!it) continue; nguoi++;
    if (route(m[2]) === it.de) trung++; else lech.push(`${s} Ngoài-${m[1]} máy=${it.de} người=${route(m[2])}`);
  }
  const k = !t2 ? 'T3 — luôn ký' : unc ? 'UNCERTAIN — luôn ký' : items.some(i => i.de === 'new-contract') ? 'có đề xuất mở việc mới — người' : 'làn V khi máy tự định tuyến';
  R[k] = (R[k] || 0) + 1;
}
console.log({ hoSo: ho, mucNgoaiN: muc, mucNguoiConXu: sauMay, dinhTuyenCuaNguoi: nguoi, trungDeXuatMay: trung });
console.log(R); console.log(M); console.log(lech.join('\n'));
