// Ma trận dạng D của hồ sơ loc-paths-dong-mac-dinh — RÚT từ bảng của contract.md (nguồn đã duyệt ở
// Cổng Phạm vi), không chép tay. Đường dẫn suy từ vị trí tệp này.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HO_SO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const D_SO_O = 19;   // hằng viết trước — bảng trả khác số này là «số ô lệch»
export const CAY_D = ['src/a.js', 'src/tài.js', 'src/a b.js', 'src/sub/c.js', 'app/[slug]/(app)/page.tsx', 'other/z.js'];
export const MOI = 'other/z.js';

// Nội dung trong backtick; ô `""` / `"   "` mang nháy kép của bảng → bóc nháy.
const trongMa = (s) => [...s.matchAll(/`([^`]*)`/g)].map(m => (/^".*"$/.test(m[1]) ? m[1].slice(1, -1) : m[1]));

export function rutMaTran(contractPath = path.join(HO_SO, 'contract.md')) {
  const t = readFileSync(contractPath, 'utf8');
  const dong = t.split('\n').filter(l => /^\| D\d+ \|/.test(l));
  return dong.map(l => {
    const c = l.replace(/^\| /, '').replace(/ \|$/, '').split(' | ');
    if (c.length !== 5) throw new Error(`ma trận D: hàng sai khuôn (${c.length} cột): ${l}`);
    const [id, cMuc, cDoi, cKet, cKept] = c;
    // Cột mục: hồ sơ hai eval (D18) ghi «E1 `a`, E2 `b`».
    const evals = /E1 `/.test(cMuc)
      ? [...cMuc.matchAll(/(E\d+) `([^`]*)`/g)].map(m => ({ id: m[1], muc: [m[2]] }))
      : [{ id: 'E1', muc: [trongMa(cMuc)[0]] }];
    const mucDau = evals[evals.length - 1].muc[0];
    const doi = new Set(cDoi.includes('tệp ấy') ? [evals[0].muc[0]] : trongMa(cDoi));
    if (cDoi.includes('mồi')) doi.add(MOI);
    const nhan = cKet.startsWith('nhận');
    const ma = nhan ? null : trongMa(cKet)[0];
    const kept = cKept === '—' ? [] : (cKept.includes('tệp ấy') ? [evals[0].muc[0]] : trongMa(cKept));
    return { id, evals, mucDau, doi: [...doi], nhan, ma, kept };
  });
}

// evals.yaml cho một ô — mục viết trong nháy đơn (bộ đọc của lib giữ nguyên chữ, kể cả `\`).
export function evalsCua(o, executor = 'script') {
  return 'schema_version: 1\nfeature_slug: feat\nevals:\n' + o.evals.map(e =>
    `  - id: ${e.id}\n    criterion: AC-1\n    executor: ${executor}\n    cmd: config:executors.script.rang_ok\n    expected: exit 0\n    paths:\n` +
    e.muc.map(m => `      - '${m}'`).join('\n') + '\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n').join('');
}
