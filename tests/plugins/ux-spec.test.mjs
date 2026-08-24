// tests/plugins/ux-spec.test.mjs — ca hồ sơ dac-ta-ux-vat-hoa-cau-truc (UX1–UX4).
// Fixture CODE-SINH rút từ CHÍNH ux-spec-template.md qua marker («điền» = luật
// bỏ-ngoặc {{x}}→x), chạy CHÍNH eval-coverage-lint.js; đường dẫn suy từ vị trí
// file; mỗi ca có đối chứng dương + chiều đỏ trên bản sao, ghim thông điệp.
//   UX_CASES=UX1,UX4 node tests/plugins/ux-spec.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'ux-spec-template.md');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const MIEN = 'bỏ đặc-tả-UX — ';

let failures = 0;
const ALL_IDS = ['UX1', 'UX2', 'UX3', 'UX4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.UX_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = m => console.log('  PASS: ' + m);
const fail = m => { console.log('  FAIL: ' + m); failures++; };
const ok = (cond, m) => (cond ? pass(m) : fail(m));

// writer → section mẫu: trích marker rồi «điền» bằng luật bỏ-ngoặc.
function uxSection(tplText) {
  const a = tplText.indexOf('<!-- <<<UX-SPEC-TEMPLATE -->');
  const b = tplText.indexOf('<!-- UX-SPEC-TEMPLATE>>> -->');
  if (a < 0 || b < 0) return null;
  return tplText.slice(a, b + '<!-- UX-SPEC-TEMPLATE>>> -->'.length)
    .replace(/\{\{([^}]*)\}\}/g, '$1');
}
const stIds = sec => [...new Set([...sec.matchAll(/^\|\s*(ST-[A-Za-z0-9_-]+)\s*\|/gm)].map(m => m[1]))];

function mkFixture(section, { states } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'ux-'));
  mkdirSync(path.join(r, '_acceptance', 'feat-ux'), { recursive: true });
  mkdirSync(path.join(r, 'docs'), { recursive: true });
  writeFileSync(path.join(r, 'docs', 'design.md'), section);
  writeFileSync(path.join(r, '_acceptance', 'feat-ux', 'contract.md'),
    '---\nschema_version: 1\nfeature: feat-ux\nslug: feat-ux\nrisk_tier: T2\nsurfaces: [ui]\nstatus: approved\ndesign_doc: docs/design.md\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n');
  const sts = states ?? stIds(section);
  writeFileSync(path.join(r, '_acceptance', 'feat-ux', 'evals.yaml'),
    `evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    states: [${sts.join(', ')}]\n    expected: "exit 0"\n`);
  return r;
}
const lint = r => spawnSync(process.execPath, [LINT, r], { encoding: 'utf8' });

// ── UX1: khuôn đủ 6 mục + marker con + cửa miễn ─────────────────────────────
if (want('UX1')) {
  const t = readFileSync(TPL, 'utf8');
  const sec = uxSection(t);
  ok(sec !== null, 'UX1 marker UX-SPEC-TEMPLATE tồn tại');
  if (sec !== null) {
    for (const h of ['1. Luồng', '2. Kiểm kê màn', '3. Bảng trạng thái', '4. Hành vi', '5. Xuất xứ component', '6. Khuôn IA đã chọn + căn cứ']) {
      ok(sec.includes('### ' + h), `UX1 mục «${h}» có mặt`);
    }
    ok(sec.includes('<<<UX-STATE-TABLE') && sec.includes('UX-STATE-TABLE>>>'),
      'UX1 UX-SPEC-TEMPLATE có UX-STATE-TABLE (chiều đỏ: gỡ marker → «UX-SPEC-TEMPLATE thiếu UX-STATE-TABLE»)');
    ok(/^Khuôn IA:/m.test(sec) && /^Căn cứ:/m.test(sec), 'UX1 nhãn Khuôn IA/Căn cứ đúng khuôn dòng');
  }
  ok(t.includes(MIEN), 'UX1 đầu khuôn có chuỗi cửa miễn');
  // chiều đỏ trên BẢN SAO: gỡ marker con → uxSection vẫn trích được nhưng thiếu bảng
  const mut = t.replace(/UX-STATE-TABLE/g, 'UX-XXX-TABLE');
  const secMut = uxSection(mut);
  ok(secMut !== null && !secMut.includes('<<<UX-STATE-TABLE'),
    'UX1-đỏ bản sao gỡ marker: UX-SPEC-TEMPLATE thiếu UX-STATE-TABLE (phép thử phân biệt được)');
}

// ── UX2: round-trip writer→reader qua CHÍNH lint ────────────────────────────
if (want('UX2')) {
  const sec = uxSection(readFileSync(TPL, 'utf8'));
  const ids = stIds(sec);
  ok(ids.length >= 2, `UX2 khuôn mẫu khai ≥2 trạng thái (thấy ${ids.length})`);
  // đối chứng dương: khai đủ → 0 cờ W8
  const rPos = mkFixture(sec);
  const oPos = lint(rPos);
  ok(oPos.status === 0 && !/W8/.test(oPos.stdout), 'UX2 bản lành: reader 0 cờ W8');
  // số ST reader thấy == số ST writer khai — đếm TỪ OUTPUT READER (xoá hết states)
  const rCount = mkFixture(sec, { states: [] });
  const oCount = lint(rCount);
  const nReader = (oCount.stdout.match(/W8b /g) || []).length;
  ok(nReader === ids.length, `UX2 reader đọc ra ${nReader} == writer khai ${ids.length}`);
  // chiều đỏ ĐI QUA READER: giữ evals đủ, xoá 1 dòng ST khỏi design fixture → W8c ghim đúng id
  const victim = ids[0];
  const secCut = sec.split('\n').filter(l => !l.startsWith(`| ${victim} `)).join('\n');
  const rRed = mkFixture(secCut, { states: ids });
  const oRed = lint(rRed);
  ok(oRed.status === 1 && oRed.stdout.includes(`W8c eval E1 đo trạng thái ${victim} không có trong bảng khai trước`),
    `UX2-đỏ xoá ${victim} khỏi design-doc → lint bật W8c ghim đúng id (không bộ đếm tự thân)`);
  for (const r of [rPos, rCount, rRed]) rmSync(r, { recursive: true, force: true });
}

// ── UX3: quan hệ trong SKILL feature-loop ───────────────────────────────────
if (want('UX3')) {
  const s = readFileSync(SKILL, 'utf8');
  ok(/Đặc tả UX/.test(s) && /TRƯỚC khi sinh 3 artifact/.test(s) && /ux-spec-template\.md/.test(s),
    'UX3a S1 có chỉ dẫn điền Đặc tả UX trước 3 artifact theo khuôn (đỏ: gỡ câu → «S1 thiếu chỉ dẫn điền Đặc tả UX trước 3 artifact»)');
  const idx = s.indexOf('ux-spec-template.md');
  ok(idx >= 0 && /resolve-plugin\.mjs/.test(s.slice(Math.max(0, idx - 800), idx + 800)),
    'UX3a2 khuôn resolve qua resolve-plugin.mjs (cấm hardcode path cache)');
  ok(/design_doc:/.test(s) && /states:\s*\[ST-/.test(s),
    'UX3b chỉ dẫn contract ghi design_doc: + evals khai states: [ST-…]');
  ok(/vẽ TỪ section Đặc tả UX/.test(s),
    'UX3c nghi thức hình: hình luồng/màn vẽ TỪ section Đặc tả UX');
  const smIdx = s.indexOf('dòng state-matrix');
  ok(smIdx === -1 || s.slice(Math.max(0, smIdx - 400), smIdx + 400).includes('ux-spec-template.md'),
    'UX3d «dòng state-matrix» cũ không còn đứng ngoài con trỏ về khuôn (một nguồn)');
}

// ── UX4: chuỗi miễn khớp từng ký tự giữa SKILL và khuôn ─────────────────────
if (want('UX4')) {
  const t = readFileSync(TPL, 'utf8');
  const s = readFileSync(SKILL, 'utf8');
  const inTpl = t.includes(`"${MIEN}`);
  const inSkill = s.includes(`"${MIEN}`);
  ok(inTpl && inSkill, `UX4 chuỗi miễn "${MIEN}" có mặt cả hai bên`);
  // chiều đỏ trên bản sao: đổi một bên → phép so phải phân biệt được
  const sMut = s.replace(`"${MIEN}`, '"bỏ dac-ta-ux — ');
  ok(!(sMut.includes(`"${MIEN}`)) !== !(t.includes(`"${MIEN}`)),
    'UX4-đỏ bản sao đổi một bên → chuỗi miễn lệch giữa SKILL và khuôn (phép so còn răng)');
}

process.exit(failures === 0 ? 0 : 1);
