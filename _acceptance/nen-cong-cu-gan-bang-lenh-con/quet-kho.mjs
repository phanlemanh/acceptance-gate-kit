// quet-kho.mjs — phép quét một lần của hồ sơ nen-cong-cu-gan-bang-lenh-con (gap-probe F2): in từ đầu
// mà `tuDau` của một bản duong-nen.mjs rút ra cho mọi khoá executors.* của các config được chỉ.
// Dùng: node quet-kho.mjs <duong-nen.mjs> <config.yaml>…  (chạy từ gốc kho kit — cần lib/evidence-core.cjs)
// Liệt kê từ đầu của mọi khoá executors.* trong config của các kho tiêu thụ, bằng tuDau của script được chỉ định.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const [script, ...cfgs] = process.argv.slice(2);
const src = fs.readFileSync(script,'utf8');
const pick = (a,b) => src.slice(src.indexOf(a), src.indexOf(b));
const body = pick('function khoaExecutor', '// <<<CONG-CU-TU-DAU') + pick('const tenChuongTrinh', '// CONG-CU-TU-DAU>>>');
const f = new Function(body + '; return { khoaExecutor, tuDau, tenChuongTrinh };')();
const { resolveConfigKey } = createRequire(import.meta.url)(path.resolve('lib/evidence-core.cjs'));
for (const c of cfgs) { const t = fs.readFileSync(c,'utf8');
  for (const k of f.khoaExecutor(t)) { const cmd = resolveConfigKey(t,k); if (!cmd) continue; const tu = f.tuDau(cmd);
    console.log(`${path.basename(path.dirname(path.dirname(c)))}\t${k}\t${tu && !f.tenChuongTrinh(tu) ? 'BOQUA' : 'TRA'}\t${tu}`); } }
