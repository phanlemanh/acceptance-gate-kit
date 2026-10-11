#!/usr/bin/env node
// pham-vi.mjs — AC-12: hạng T2 giữ được. Tập tệp của vòng = tệp mà các commit KHÔNG-GỘP trong
// BASE_G3..HEAD mang dấu «(eval-goi-model-that-khong-chay)» đã chạm, trừ hồ sơ của chính vòng — rút từ
// LỊCH SỬ của vòng nên gộp main giữa vòng hay chiến dịch ghim lại về sau không làm nó đỏ (phản biện 11/10,
// P0). Luật: không tệp nào khớp risk_tiers.t3_paths (đọc lúc chạy), không tệp nào dưới
// _acceptance/<hồ sơ khác>/ mà hồ sơ đó đã signed-off/machine-cleared.
// Chạy hai việc: (1) trên kho thật → phải sạch; (2) tự kiểm trên kho thử code-sinh: chiều im (commit KHÔNG
// mang dấu chạm hồ sơ đã ký → sạch) và hai chiều đỏ trên CÙNG phép đo, mỗi chiều một thông điệp ghim.
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT, SLUG, baseG3 } from './ban-sao.mjs';

const core = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const DA_KY = new Set(['signed-off', 'machine-cleared']);

export function phamVi({ repo, base, slug }) {
  const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const tep = [...new Set(git('log', '--no-merges', '--name-only', '--format=', '--fixed-strings', `--grep=(${slug})`, `${base}..HEAD`)
    .split('\n').filter(Boolean))].filter(f => !f.startsWith(`_acceptance/${slug}/`)).sort();
  if (!tep.length) return { tep, loi: ['rút rỗng: không commit nào của vòng mang dấu'] };
  // Luật vùng T3 đọc Ở MỐC trước vòng (lượt 3, Ngoài-9): kho siết t3_paths về sau không làm hồ sơ đã ký tự đỏ.
  const cfg = git('show', `${base}:_acceptance/config.yaml`);
  const t3 = (core.resolveConfigList(cfg, 'risk_tiers.t3_paths') || []).map(String);
  if (!t3.length) return { tep, loi: ['rút rỗng: risk_tiers.t3_paths không có mục nào'] };
  const res = t3.map(g => core.pathGlobToRe(g));
  const loi = [];
  for (const f of tep) {
    if (res.some(re => re.test(f))) loi.push(`chạm vùng T3: ${f}`);
    const m = f.match(/^_acceptance\/([^/]+)\//);
    if (m && m[1] !== slug) {
      // Đã ký ở MỐC hoặc ở HEAD — đọc cả hai: một vòng ghi đè hợp đồng của hồ sơ khác cũng xoá luôn dòng
      // trạng thái, nên chỉ đọc HEAD là để lọt đúng ca nặng nhất.
      const rel = `_acceptance/${m[1]}/contract.md`;
      let goc = ''; try { goc = git('show', `${base}:${rel}`); } catch { /* chưa có ở mốc */ }
      const nay = fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
      const st = [goc, nay].map(t => String(core.frontmatterField(t, 'status') || '').trim()).find(x => DA_KY.has(x));
      if (st) loi.push(`chạm hồ sơ đã ký: ${f} (${m[1]} ${st})`);
    }
  }
  return { tep, loi };
}

function khoThu() {
  const r = fs.mkdtempSync(path.join(tmpdir(), 'egm-pham-vi-'));
  const git = (...a) => execFileSync('git', ['-C', r, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ghi = (rel, nd) => { const f = path.join(r, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, nd); };
  ghi('_acceptance/config.yaml', 'risk_tiers:\n  t3_paths:\n    - "lib/**"\n');
  ghi('_acceptance/da-ky/contract.md', '---\nslug: da-ky\nstatus: signed-off\n---\n');
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'goc');
  const base = git('rev-parse', 'HEAD');
  const cm = (rel, msg) => { ghi(rel, `${Math.random()}\n`); git('add', '-A'); git('commit', '-qm', msg); };
  cm('src/x.txt', `feat(${SLUG}): vật của vòng`);
  return { r, base, cm };
}

const loi = [];
const that = phamVi({ repo: ROOT, base: baseG3(), slug: SLUG });
console.log(`kho thật: ${that.tep.length} tệp của vòng${that.loi.length ? ` — ${that.loi.join(' · ')}` : ' — sạch'}`);
if (that.loi.length) loi.push(...that.loi.map(x => `kho thật: ${x}`));
{ // chiều im: commit ghim lại KHÔNG mang dấu chạm hồ sơ đã ký
  const k = khoThu(); k.cm('_acceptance/da-ky/run-log.jsonl', 'repin(da-ky): ghim lại');
  const v = phamVi({ repo: k.r, base: k.base, slug: SLUG });
  if (v.loi.length) loi.push(`chiều im đỏ oan: ${v.loi.join(' · ')}`);
}
{ // chiều im thứ hai: commit KHÔNG mang dấu về sau siết t3_paths thêm src/** — vòng đã chạm src/x.txt
  const k = khoThu();
  fs.writeFileSync(path.join(k.r, '_acceptance', 'config.yaml'), 'risk_tiers:\n  t3_paths:\n    - "lib/**"\n    - "src/**"\n');
  execFileSync('git', ['-C', k.r, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qam', 'siet t3'], { stdio: 'ignore' });
  const v = phamVi({ repo: k.r, base: k.base, slug: SLUG });
  if (v.loi.length) loi.push(`luật siết về sau làm hồ sơ tự đỏ: ${v.loi.join(' · ')}`);
}
for (const [rel, ghim] of [['lib/evidence-core.cjs', 'chạm vùng T3'], ['_acceptance/da-ky/contract.md', 'chạm hồ sơ đã ký']]) {
  const k = khoThu(); k.cm(rel, `fix(${SLUG}): tiêm`);
  const v = phamVi({ repo: k.r, base: k.base, slug: SLUG });
  if (!v.loi.some(x => x.startsWith(ghim))) loi.push(`chiều đỏ «${ghim}» không bắt (${rel}): ${JSON.stringify(v.loi)}`);
  else console.log(`ĐỎ đúng: ${rel} → «${ghim}»`);
}
if (loi.length) { console.log(`AC-12: ĐỎ\n  - ${loi.join('\n  - ')}`); process.exit(1); }
console.log('AC-12: XANH — kho thật sạch; chiều im giữ; hai chiều đỏ bắt đúng thông điệp ghim');
