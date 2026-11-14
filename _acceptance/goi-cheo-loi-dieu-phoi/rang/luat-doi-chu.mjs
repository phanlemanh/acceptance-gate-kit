// luat-doi-chu.mjs — MỘT chỗ cho bảng xếp + luật đổi chữ của kịch bản chuyển nhà, dùng chung cho bo-cuc-moi.mjs và
// vi-phan-cu.mjs (hồ sơ goi-cheo-loi-dieu-phoi, design §5, §7).
//
// CHÉP (không nạp) từ kho kế nhiệm, nhánh `chuyen-nha` @ 5192aff2: `migration/kich-ban/bang-xep.json` (thu_muc, tep),
// `migration/chay-thu-phien/bang-ten.json` (plugin, lenh) và `luatDoiChu` + `buoc3DoiTen` của
// `migration/kich-ban/don-nha.mjs`. Chép vì CI kho này không có kho kế nhiệm; rủi ro trôi đã khai (design §7) và được bù
// bằng đo chéo cuối vòng (E16). Không bước nào ghi vào cây kit: mọi thao tác trên thư mục đích do người gọi đưa.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const THU_MUC = {
  skills: 'plugins/acceptance-gate/skills', commands: 'plugins/acceptance-gate/commands', hooks: 'plugins/acceptance-gate/hooks',
  scripts: 'plugins/acceptance-gate/scripts', lib: 'plugins/acceptance-gate/lib', vendor: 'plugins/acceptance-gate/vendor',
  evals: 'plugins/acceptance-gate/evals', 'design-floor': 'plugins/acceptance-gate/design-floor',
  'feature-loop': 'plugins/feature-loop', 'diagram-design': 'plugins/diagram-design',
  'dieu-phoi': 'plugins/dispatch', 'road-map': 'plugins/roadmap', 'tri-thuc': 'plugins/knowledge',
};
export const TEP = { '.claude-plugin/plugin.json': 'plugins/acceptance-gate/.claude-plugin/plugin.json' };
export const PLUGIN = { 'dieu-phoi': 'dispatch', 'road-map': 'roadmap', 'tri-thuc': 'knowledge' };
export const LENH = {
  'dieu-phoi:mo-dot': 'dispatch:open', 'dieu-phoi:dong-dot': 'dispatch:close', 'dieu-phoi:tiep-tuc': 'dispatch:resume',
  'dieu-phoi:ban-giao': 'dispatch:handoff', 'dieu-phoi:xem': 'dispatch:status', 'road-map:xem': 'roadmap:status',
  'road-map:ghim': 'roadmap:pin', 'road-map:bo-ghim': 'roadmap:unpin', 'road-map:tra-lai': 'roadmap:undo',
  'road-map:gui': 'roadmap:suggest', 'tri-thuc:ghi': 'knowledge:ingest', 'tri-thuc:kiem': 'knowledge:health',
  'acceptance-gate:cat-luot': 'acceptance-gate:scope-slice', 'acceptance-gate:gom-tin-hieu': 'acceptance-gate:signal-intake',
};
export const CHO_CU = 'acceptance-gate-kit';
export const CHO_MOI = 'delivery-loop';

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function luatDoiChu() {
  const L = [];
  for (const [cu, moi] of Object.entries(LENH)) L.push({ re: new RegExp(`(?<![\\w-])${esc(cu)}(?![\\w-])`, 'g'), thay: moi });
  for (const [p, q] of Object.entries(PLUGIN)) {
    L.push({ re: new RegExp(`(?<![\\w-])${esc(p)}:(?=[a-z])`, 'g'), thay: `${q}:` });
    L.push({ re: new RegExp(`(?<![\\w-])${esc(p)}@`, 'g'), thay: `${q}@` });
    L.push({ re: new RegExp(`--plugin ${esc(p)}(?![\\w-])`, 'g'), thay: `--plugin ${q}` });
    L.push({ re: new RegExp(`plugin: '${esc(p)}'`, 'g'), thay: `plugin: '${q}'` });
    L.push({ re: new RegExp(`'${esc(p)}': \\{`, 'g'), thay: `'${q}': {` });
  }
  L.push({ re: new RegExp(`${esc(CHO_CU)}(?![\\w-])`, 'g'), thay: CHO_MOI });
  return L;
}

const laChu = buf => !buf.subarray(0, 8192).includes(0);
function moiTep(goc) {
  const ra = [];
  const di = d => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) di(p); else if (e.isFile()) ra.push(p); } };
  if (existsSync(goc)) di(goc);
  return ra;
}

// Lấy cây nguồn vào `dich`: `ref` → git archive; vắng `ref` → tệp đang theo dõi + tệp mới chưa bỏ qua của cây đang kiểm.
export function layCay(kit, dich, ref = null) {
  const muc = [...Object.keys(THU_MUC), '.claude-plugin'].filter(m => existsSync(path.join(kit, m)));
  mkdirSync(dich, { recursive: true });
  if (ref) { execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$2" -- "${@:4}" | tar -x -C "$3"', '_', kit, ref, dich, ...muc]); return; }
  const ds = execFileSync('git', ['-C', kit, 'ls-files', '-co', '--exclude-standard', '-z', '--', ...muc], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\0').filter(Boolean);
  for (const rel of ds) {
    const p = path.join(kit, rel);
    if (!existsSync(p) || !statSync(p).isFile()) continue;
    mkdirSync(path.dirname(path.join(dich, rel)), { recursive: true });
    cpSync(p, path.join(dich, rel));
  }
}

// Dựng kho bố cục mới từ cây nguồn `nguon` (thư mục) vào `dich`. Đúng các bước 1–3 của kịch bản.
export function dungKhoMoi(nguon, dich) {
  mkdirSync(dich, { recursive: true });
  for (const [cu, moi] of Object.entries(THU_MUC)) if (existsSync(path.join(nguon, cu))) cpSync(path.join(nguon, cu), path.join(dich, moi), { recursive: true });
  for (const [cu, moi] of Object.entries(TEP)) if (existsSync(path.join(nguon, cu))) { mkdirSync(path.dirname(path.join(dich, moi)), { recursive: true }); cpSync(path.join(nguon, cu), path.join(dich, moi)); }
  // bước 2 — tệp khai: chợ ở gốc, source ./plugins/<tên>, tên plugin mới; plugin.json của gói đổi tên.
  const mk = JSON.parse(readFileSync(path.join(nguon, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const dichGoi = {};
  for (const p of mk.plugins) {
    const nguonDir = String(p.source).replace(/^\.\//, '').replace(/\/$/, '') || '.';
    const d = nguonDir === '.' ? 'plugins/acceptance-gate' : THU_MUC[nguonDir];
    if (!d) throw new Error(`mục chợ ${p.name} có source lạ: ${p.source}`);
    dichGoi[p.name] = d;
    p.source = `./${d}`; p.name = PLUGIN[p.name] || p.name;
  }
  mk.name = CHO_MOI;
  mkdirSync(path.join(dich, '.claude-plugin'), { recursive: true });
  writeFileSync(path.join(dich, '.claude-plugin', 'marketplace.json'), JSON.stringify(mk, null, 2) + '\n');
  for (const [cu, moi] of Object.entries(PLUGIN)) {
    const pj = path.join(dich, dichGoi[cu], '.claude-plugin', 'plugin.json');
    if (existsSync(pj)) writeFileSync(pj, readFileSync(pj, 'utf8').replace(`"name": "${cu}"`, `"name": "${moi}"`));
  }
  // bước 3 — đổi tên tệp lệnh / thư mục skill theo bảng lệnh, rồi luật đổi chữ trên mọi tệp chữ dưới plugins/.
  for (const [cu, moi] of Object.entries(LENH)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1]; const D = dichGoi[pc];
    if (!D) throw new Error(`luật trỏ plugin không có: ${cu}`);
    const cmd = path.join(dich, D, 'commands', `${lc}.md`); const sk = path.join(dich, D, 'skills', lc);
    if (existsSync(cmd)) renameSync(cmd, path.join(dich, D, 'commands', `${lm}.md`));
    else if (existsSync(sk)) {
      renameSync(sk, path.join(dich, D, 'skills', lm));
      const tep = path.join(dich, D, 'skills', lm, 'SKILL.md');
      if (existsSync(tep)) writeFileSync(tep, readFileSync(tep, 'utf8').replace(new RegExp(`^name: ${esc(lc)}$`, 'm'), `name: ${lm}`));
    }
  }
  const L = luatDoiChu();
  for (const p of moiTep(path.join(dich, 'plugins'))) {
    const buf = readFileSync(p); if (!laChu(buf)) continue;
    let nd = buf.toString('utf8'); const goc = nd;
    for (const l of L) nd = nd.replace(l.re, l.thay);
    if (nd !== goc) writeFileSync(p, nd);
  }
  return { dichGoi };
}
