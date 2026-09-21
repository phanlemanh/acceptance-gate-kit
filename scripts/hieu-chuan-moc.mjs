#!/usr/bin/env node
// hieu-chuan-moc.mjs — dòng hiệu chuẩn của hồ sơ mốc (ADR 0020 Đ9, hồ sơ
// nhan-trang-thai-va-reality AC-13): «ĐẠT đã ký → prod đỏ: k / N».
//
//   node scripts/hieu-chuan-moc.mjs --root <kho nhận>
//
// N = số hồ sơ có dòng quan sát prod (`type: thuc-te`) hợp lệ — đọc bằng CHÍNH vị từ thucTe
//     của lib/workspace-record.cjs trên phần sổ tới dòng ấy (một dòng `supersedes` về sau là
//     đường mở lại vì prod đỏ, nên nó KHÔNG được làm hồ sơ rơi khỏi mẫu số).
// k = trong N, hồ sơ có dòng `revisit` mở đầu «prod đỏ — » ĐỨNG SAU dòng quan sát.
// N là CHIỀU ĐỎ của chính dòng này: N = 0 → in «vô hiệu», cấm in «0 / 0» hay «0 sự cố».
// Không phải phép đo mới theo nghĩa luật (c)(a): nó chỉ đọc sổ đã có.
// Mã thoát: 0 in được một dòng · 2 --root không phải kho có _acceptance/.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WR = createRequire(import.meta.url)(path.join(HERE, '..', 'lib', 'workspace-record.cjs'));
const TIEN_TO_DO = 'prod đỏ — ';

export function hieuChuan(root) {
  const acc = path.join(root, '_acceptance');
  let N = 0; let k = 0;
  for (const e of fs.readdirSync(acc, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    let so;
    try { so = fs.readFileSync(path.join(acc, e.name, 'decisions.jsonl'), 'utf8'); } catch { continue; }
    const dong = so.split('\n');
    const iTT = dong.map((l, i) => [l, i]).filter(([l]) => /"type"\s*:\s*"thuc-te"/.test(l)).map(([, i]) => i).pop();
    if (iTT == null) continue;
    const tt = WR.thucTe(dong.slice(0, iTT + 1).join('\n'));
    if (!tt || tt.kieu !== 'dong-so') continue;
    N += 1;
    const sau = dong.slice(iTT + 1).some(l => { try { const o = JSON.parse(l); return o.type === 'revisit' && typeof o.decision === 'string' && o.decision.startsWith(TIEN_TO_DO); } catch { return false; } });
    if (sau) k += 1;
  }
  return { N, k, dong: N === 0 ? 'ĐẠT đã ký → prod đỏ: vô hiệu (N = 0)' : `ĐẠT đã ký → prod đỏ: ${k} / ${N}` };
}

const isMain = (() => { try { return fs.realpathSync(process.argv[1] || '') === fs.realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (isMain) {
  const i = process.argv.indexOf('--root');
  const root = i >= 0 ? process.argv[i + 1] : null;
  if (!root || !fs.existsSync(path.join(root, '_acceptance'))) { console.error('hieu-chuan-moc: --root phải trỏ một kho có _acceptance/'); process.exit(2); }
  console.log(hieuChuan(root).dong);
}
