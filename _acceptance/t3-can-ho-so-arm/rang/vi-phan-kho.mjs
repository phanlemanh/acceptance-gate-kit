#!/usr/bin/env node
// Đo lại danh sách PR đã chốt: chạy bản v2.38.0 và bản đang xét trên từng PR thật, so với kết quả đã ghi sẵn.
// Thoát 0: đúng hết và đạt sàn · 1: lệch, nêu tên PR · 2: mù (thiếu kho, dưới sàn, không dựng được bản gốc).
// Kho đọc bằng clone tạm; không ghi vào kho nào. Gốc kho: KHO_GOC, không có thì thư mục cha của checkout chính.
// T3HA_MAY: thư mục bản đang xét, chỉ dùng cho lượt đối chứng phá thử.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..', '..');
const MSG = 'no record in it is judged by the gate';
const mu = why => { console.log(`vi-phan-kho: MU — ${why}`); process.exit(2); };
const g = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).trim();
const thu = (d, ...a) => { try { return g(d, ...a); } catch { return null; } };

const { san, pr: ds } = JSON.parse(readFileSync(path.join(HERE, 'ds-pr.json'), 'utf8'));
const commonDir = thu(KIT, 'rev-parse', '--path-format=absolute', '--git-common-dir');
const GOC = process.env.KHO_GOC || (commonDir ? path.dirname(path.dirname(commonDir)) : null);
if (!GOC) mu('không suy được thư mục chứa các kho');

const TMP = mkdtempSync(path.join(tmpdir(), 'vpk-'));
const BAN_GOC = path.join(TMP, 'ban-goc');
mkdirSync(BAN_GOC);
try {
  const tar = execFileSync('git', ['-C', KIT, 'archive', 'v2.38.0'], { maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
  execFileSync('tar', ['-x', '-C', BAN_GOC], { input: tar });
} catch { rmSync(TMP, { recursive: true, force: true }); mu('không dựng được bản v2.38.0 từ thẻ'); }
const BAN_MOI = process.env.T3HA_MAY || KIT;

const chay = (may, c, p) => {
  const o = spawnSync('bash', [path.join(may, 'scripts', 'pre-merge-check.sh'), c, '--base', p.base, ...(p.slug ? ['--slug', p.slug] : [])], { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, PRE_MERGE_BASE: undefined } });
  return `${o.stdout || ''}${o.stderr || ''}`;
};

const clone = new Map();
const lay = kho => {
  if (clone.has(kho)) return clone.get(kho);
  const src = path.join(GOC, kho); const c = path.join(TMP, 'k', kho);
  let kq = null;
  if (existsSync(path.join(src, '.git'))) {
    try {
      mkdirSync(path.dirname(c), { recursive: true });
      execFileSync('git', ['clone', '-q', '--local', '--no-checkout', src, c], { stdio: 'ignore' });
      thu(c, 'fetch', '-q', src, '+refs/remotes/origin/*:refs/remotes/nguon/*');
      // Kho nguồn là partial clone thì blob còn thiếu phải lấy từ remote của nó, nếu không checkout hỏng.
      if (thu(src, 'config', '--get', 'remote.origin.promisor') === 'true') {
        g(c, 'config', 'core.repositoryformatversion', '1');
        g(c, 'config', 'extensions.partialClone', 'origin');
        g(c, 'config', 'remote.origin.url', g(src, 'config', '--get', 'remote.origin.url'));
        g(c, 'config', 'remote.origin.promisor', 'true');
        g(c, 'config', 'remote.origin.partialclonefilter', 'blob:none');
      }
      g(c, 'sparse-checkout', 'set', '_acceptance', '.claude');
      kq = c;
    } catch { kq = null; }
  }
  clone.set(kho, kq);
  return kq;
};

const doc = {}; const khoDoc = new Set(); const lech = []; const khongDoc = [];
for (const p of ds) {
  const ten = `${p.kho}@${p.sha}`;
  const c = lay(p.kho);
  if (!c || thu(c, 'cat-file', '-e', `${p.tip}^{commit}`) === null || thu(c, 'cat-file', '-e', `${p.base}^{commit}`) === null || thu(c, 'checkout', '-q', '--detach', '-f', p.tip) === null) { khongDoc.push(ten); continue; }
  const cu = chay(BAN_GOC, c, p); const moi = chay(BAN_MOI, c, p);
  doc[p.nhom] = (doc[p.nhom] || 0) + 1; khoDoc.add(p.kho);
  if (cu.includes(MSG)) { lech.push(`${ten} (${p.nhom}): bản gốc đã có thông điệp, phép đo chạy nhầm bản`); continue; }
  const chanThem = moi.includes(MSG);
  if (chanThem !== p.chan_them) lech.push(`${ten} (${p.nhom}): chốt chan_them=${p.chan_them}, đo được ${chanThem}`);
}
rmSync(TMP, { recursive: true, force: true });

const mauSo = Object.keys(san).filter(k => k !== 'so_kho').map(k => `${k}=${doc[k] || 0}/${san[k]}`).join(' · ');
console.log(`vi-phan-kho: da doc ${ds.length - khongDoc.length}/${ds.length} PR · ${khoDoc.size} kho · ${mauSo}`);
if (khongDoc.length) console.log(`  khong doc duoc: ${khongDoc.join(', ')}`);
if (lech.length) { console.log('vi-phan-kho: DO — lech ket qua da chot:'); for (const l of lech) console.log(`  ${l}`); process.exit(1); }
const thieu = Object.keys(san).filter(k => k !== 'so_kho' && (doc[k] || 0) < san[k]);
if (thieu.length) mu(`dưới sàn nhóm: ${thieu.join(', ')}`);
if (khoDoc.size < san.so_kho) mu(`chỉ đọc được ${khoDoc.size} kho, sàn ${san.so_kho}`);
console.log('vi-phan-kho: XANH — moi PR doc duoc khop ket qua da chot');
