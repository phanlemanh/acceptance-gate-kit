// msbv-fixture.mjs — helper hồ sơ mot-so-ba-ve: ghi sổ bằng CHÍNH lệnh rút từ khối DEC-ID-RECIPE
// của SKILL feature-loop (round-trip bên viết → bên đọc), không gõ tay dòng JSON.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
export const recipeOf = t => {
  const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/g);
  if (!m || m.length !== 1) throw new Error(`khoi DEC-ID-RECIPE phai co dung mot, thay ${m ? m.length : 0}`);
  return m[0].replace(/^<!-- <<<DEC-ID-RECIPE -->\n```\n/, '').replace(/\n```\n<!-- DEC-ID-RECIPE>>> -->$/, '');
};
const jsonStr = s => JSON.stringify(String(s)).slice(1, -1);
export function ghiSo(ledgerPath, f, skillText = readFileSync(SKILL, 'utf8')) {
  mkdirSync(path.dirname(ledgerPath), { recursive: true });
  const slugDir = path.dirname(ledgerPath);
  const slug = path.basename(slugDir);
  const cwd = path.dirname(path.dirname(slugDir));
  const cmd = recipeOf(skillText)
    .split('<slug>').join(slug).split('<type>').join(f.type).split('<stage>').join(f.stage)
    .split('<ISO>').join(f.at).split('<1 câu>').join(jsonStr(f.decision))
    .split('<vì sao, 1 câu>').join(jsonStr(f.why ?? ''))
    .split('<sai thì tốn gì, 1 câu>').join(jsonStr(f.cost_if_wrong ?? ''));
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error('lenh ghi so loi: ' + r.stderr);
  const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n');
  return JSON.parse(lines[lines.length - 1]);
}
