// Ca của hồ sơ lan-v-khong-phai-cho-ky (LV1–LV7). Mỗi ca dựng fixture CODE-SINH
// từ khuôn canonical, hỏi CẢ HAI bộ đọc (start-scan.mjs + renderProductMap) và
// ghim GIÁ TRỊ của từng bộ đọc trước, rồi mới ghim quan hệ giữa hai bên.
//
// Vì sao không so hai bộ đọc với nhau rồi thôi: hai bên dùng CÙNG một vị từ,
// nên quan hệ luôn khớp bất kể vị từ đúng hay sai — phép so đó xanh theo cấu
// trúc, không theo sự thật (gap-probe P0 của hồ sơ này).
//
// Chạy một phần: LV_CASES=LV1,LV7 node tests/plugins/lan-v.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const { renderProductMap, VETO_OPEN_NOTE } = await import(path.join(ROOT, 'scripts', 'product-map.mjs'));
const { fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));

const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');

let failures = 0;
const only = (process.env.LV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };

// Frontmatter hợp đồng rút từ khuôn CANONICAL (bên VIẾT), không gõ tay theo
// khuôn bên đọc — khuôn viết trôi khỏi khuôn đọc thì mọi ca ở đây đỏ, đó là
// mục đích. Hai khoá làn V được TIÊM SAU vì khuôn gốc chưa có chúng (đúng như
// đời thật: nghi thức làn V ghi thêm hai khoá vào frontmatter đã có).
function contractText(slug, { status, veto, opened, tier }) {
  const base = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fixture@example.com', risk_tier: tier, surfaces: 'cli', status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  const extra = [];
  if (veto !== null && veto !== undefined) extra.push(`veto_state: ${veto}`);
  if (opened !== null && opened !== undefined) extra.push(`veto_opened_at: ${opened}`);
  if (!extra.length) return base;
  return base.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
}

function mkWorkspace(root, slug, { status, veto, opened, tier, verdict, signoff }) {
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'contract.md'), contractText(slug, { status, veto, opened, tier }));
  if (verdict !== null && verdict !== undefined) {
    writeFileSync(path.join(dir, 'evidence-report.md'),
      `---\nschema_version: 1\nslug: ${slug}\nverdict: ${verdict}\n` +
      `verified_commit: ${'0'.repeat(40)}\nhuman_signoff:${signoff ? ' ' + signoff : ''}\n---\n\n# Evidence: ${slug}\n`);
  }
  return dir;
}

function mkRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'lanv-'));
  mkdirSync(path.join(root, '_acceptance'), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\n');
  return root;
}

// Bộ đọc 1 — máy quét vào phiên.
function scan(root) {
  const out = execFileSync('node', [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', root], { encoding: 'utf8' });
  const j = JSON.parse(out);
  return {
    gates: new Set((j.groups.gates || []).map(g => g.slug)),
    done: new Map((j.groups.done || []).map(d => [d.slug, d.state])),
    inProgress: new Set((j.groups.inProgress || []).map(p => p.slug)),
    broken: new Set((j.broken || []).map(b => b.slug)),
  };
}

// Bộ đọc 2 — bản đồ sản phẩm.
function mapOf(root, slug) {
  const md = renderProductMap(root);
  let section = null, line = null;
  for (const l of md.split('\n')) {
    if (l.startsWith('## ')) section = l.slice(3).trim();
    else if (l.startsWith('- ') && l.includes(`\`${slug}\``)) { line = l; break; }
  }
  return { section, line, note: line ? line.includes(VETO_OPEN_NOTE) : false };
}

const R_PLUS = { status: 'verified', veto: 'mo', opened: '2026-08-21T09:00:00Z', tier: 'T2', verdict: 'PASS', signoff: '' };

if (want('LV1')) {
  const root = mkRepo();
  try {
    mkWorkspace(root, 'lv-r-plus', R_PLUS);
    const s = scan(root), m = mapOf(root, 'lv-r-plus');
    const errs = [];
    if (s.gates.has('lv-r-plus')) errs.push('V-mo PASS T2 van nam trong gates');
    if (s.done.get('lv-r-plus') !== 'lan-v-mo')
      errs.push(`may quet: state ky vong lan-v-mo, thuc te ${s.done.get('lv-r-plus') ?? '(khong co trong done)'}`);
    if (m.section !== 'Đã giao') errs.push(`ban do van xep ${m.section ?? '(khong thay slug)'}`);
    if (!m.note) errs.push(`ban do thieu chu thich "${VETO_OPEN_NOTE}"`);
    if (errs.length) fail('LV1', errs.join(' · '));
    else pass('LV1', 'V-mo PASS T2 -> done lan-v-mo, khong gates (ca hai bo doc)');
  } finally { rmSync(root, { recursive: true, force: true }); }
}

process.exit(failures ? 1 : 0);
