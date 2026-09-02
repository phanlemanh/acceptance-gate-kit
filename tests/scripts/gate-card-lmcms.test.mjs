// Lưới thường trực của hồ sơ loi-moi-cong-may-sinh (2.7): cờ fail-quiet của
// thẻ, cột SẼ/KHÔNG, luật rơi bậc, câu gộp máy-sinh, bảng định tuyến.
// Fixture CODE-SINH trong chính lần chạy; mọi chuỗi ghim RÚT từ hằng của
// scripts/gate-card.js (khuôn gmpick) — không gõ literal ở phía test.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const SRC = readFileSync(GC, 'utf8');
const pick = name => {
  const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm'));
  if (!m) throw new Error('gate-card.js khong khai hang ' + name);
  return m[1];
};
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

function mkWs(slug, files, cfg) {
  const root = mkdtempSync(path.join(tmpdir(), 'lmcms-'));
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), cfg || 'schema_version: 1\ngap_probe: required\n');
  for (const [f, t] of Object.entries(files)) writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return root;
}
const card = (root, slug, extra = []) => spawnSync('node', [GC, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

const CONTRACT_G2 = `---
schema_version: 1
feature: F
slug: s
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: A
approved_at: 2026-09-01T00:00:00Z
---

## Criteria

- AC-1: Given a, When b, Then c.

## Out of scope

- bỏ X.
`;
const EVALS = `evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.scripts
    expected: xanh
`;
const REPORT_PASS = `---
schema_version: 2
feature_slug: s
verdict: PASS
failed_evals: []
verified_commit: 0000000
human_signoff:
---

# E

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-01T00:00:00Z
`;
const G2 = review => ({ 'contract.md': CONTRACT_G2, 'evals.yaml': EVALS, 'evidence-report.md': REPORT_PASS, 'review-findings.md': review });
const ITEM = p => `- **Bat bien X**\n  Người dùng thấy gì: nguoi thay X\n  file: \`a.js\`\n  severity: medium\n  Đề xuất: ${p}\n`;
const OOC = body => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.\n\n${body}\n`;

// ── Task 3: cờ vàng cho hai đường fail-quiet (AC-5, AC-6) ──
check('LM01 OOC van xuoi -> co vang suspect (chuoi rut tu hang)', () => {
  const r = mkWs('s', G2(OOC('**N1 — Bat bien X khong nam trong luoi thuong truc, chi tiet du dai.**')));
  const out = card(r, 's').stdout;
  if (!out.includes(pick('MSG_OOC_SUSPECT'))) die('thieu co: ' + pick('MSG_OOC_SUSPECT'));
});
check('LM02 doi chung duong: dung khuon -> KHONG co suspect, van in de xuat', () => {
  const r = mkWs('s', G2(OOC(ITEM('known-limits'))));
  const out = card(r, 's').stdout;
  if (out.includes(pick('MSG_OOC_SUSPECT'))) die('co oan tren muc dung khuon');
  if (!out.includes('Máy đề xuất: ghi vào hạn chế đã biết rồi ship.')) die('mat de xuat hop le');
});
check('LM03 token la -> in nguyen van + ba token hop le, KHONG «chua de xuat»', () => {
  const r = mkWs('s', G2(OOC(ITEM('ghi Known limits'))));
  const out = card(r, 's').stdout;
  if (!out.includes(pick('MSG_PROPOSAL_LA'))) die('thieu: ' + pick('MSG_PROPOSAL_LA'));
  if (!out.includes('ghi Known limits')) die('khong in nguyen van token la');
  if (out.includes('Máy chưa đề xuất hướng nào.')) die('van in cau sai cu');
});
check('LM03b doi chung duong: khong co truong De xuat -> van la «chua de xuat»', () => {
  const r = mkWs('s', G2(OOC('- **Bat bien Y**\n  Người dùng thấy gì: nguoi thay Y\n  file: `b.js`\n  severity: low\n')));
  const out = card(r, 's').stdout;
  if (!out.includes('Máy chưa đề xuất hướng nào.')) die('mat nhanh mac dinh that');
  if (out.includes(pick('MSG_PROPOSAL_LA'))) die('co token-la oan khi khong co truong');
});

// ── Task 4: cột SẼ/KHÔNG dò MỆNH ĐỀ ĐẦU của vế Then (AC-7) ──
// Fixture RÚT ROUND-TRIP từ hợp đồng ĐÃ KÝ của hai bản phát hành — không viết
// tay AC. Neo SHA BẤT BIẾN (không `main`: CI checkout PR có thể vắng main →
// đỏ vì hạ tầng chứ không vì vật, lớp P150).
const PIN = '69e095e3';
const gitShow = p => spawnSync('git', ['-C', ROOT, 'show', `${PIN}:${p}`], { encoding: 'utf8' });
const extract = (root, slug, extra = []) => JSON.parse(spawnSync('node', [GC, '--root', root, '--slug', slug, '--extract', ...extra], { encoding: 'utf8' }).stdout);

for (const slug of ['release-2-5-0', 'release-2-6-0']) check(`LM04 ${slug}: AC co «không» GIUA ve nam cot SE lam`, () => {
  const c = gitShow(`_acceptance/${slug}/contract.md`);
  const e = gitShow(`_acceptance/${slug}/evals.yaml`);
  if (c.status !== 0 || e.status !== 0) die('khong doc duoc hop dong tai ' + PIN + ' — neo hong, khong phai vat hong');
  const r = mkWs(slug, {
    'contract.md': c.stdout.replace(/^status: .*$/m, 'status: draft').replace(/^approved_by: .*$/m, 'approved_by:'),
    'evals.yaml': e.stdout,
  });
  const j = extract(r, slug, ['--gate', '1']);
  const ids = j.will_do.map(x => x.id);
  for (const id of ['AC-1', 'AC-2', 'AC-6']) {
    if (!ids.includes(id)) die(id + ' roi vao cot KHONG lam: ' + JSON.stringify(j.wont_do.map(x => x.id)));
  }
});

// Ma trận đầu-vế: số assert = số phần tử (5 ô), phủ cả hai chiều.
const MATRIX = [
  ['KHÔNG ghi đè hồ sơ đã ký', 'wont'],
  ['không sinh file mới', 'wont'],
  ['script thoát khác 0 và KHÔNG sinh tệp args nào', 'wont'],
  ['ghi hồ sơ, không hỏi lại', 'will'],
  ['nó khớp ba số đọc từ manifest (một nguồn, không so hằng)', 'will'],
];
MATRIX.forEach(([then, side], i) => check(`LM05.${i + 1} «${then.slice(0, 22)}…» -> ${side}`, () => {
  const r = mkWs('m', {
    'contract.md': `---\nschema_version: 1\nfeature: F\nslug: m\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then ${then}.\n\n## Out of scope\n\n- x.\n`,
    'evals.yaml': EVALS,
  });
  const j = extract(r, 'm', ['--gate', '1']);
  const got = j.wont_do.length ? 'wont' : 'will';
  if (got !== side) die(`xep ${got} (then: ${then})`);
}));

// ── Task 5: luật rơi bậc (AC-4) — ĐẢO CHIỀU MẶC ĐỊNH ──
// Mọi trạng thái NGOÀI {đọc được ∧ verdict thuộc tập khai} đều rơi bậc, TRỪ ca
// vắng-mặt ở repo khai advisory/off (mặc định của pre-merge-check.sh là
// advisory — repo tiêu thụ crm/media-library/floorplanstudio đều advisory, đỏ
// oan ở đó thì mọi thẻ Cổng 1 của họ mất câu gộp).
const G1 = probe => {
  const f = {
    'contract.md': `---\nschema_version: 1\nfeature: F\nslug: g\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n`,
    'evals.yaml': EVALS,
    'decisions.jsonl': '',
  };
  if (probe !== null) f['gap-probe.md'] = probe;
  return f;
};
const PROBE = v => `---\nslug: g\nat: 2026-09-01T00:00:00Z\nverdict: ${v}\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n`;
const ROI = [
  ['findings', PROBE('findings'), 'required', false],
  ['probe-failed', PROBE('probe-failed'), 'required', true],
  ['vang-khi-required', null, 'required', true],
  ['file-hong-frontmatter-vo', 'verdict: maybe\nkhong co frontmatter', 'required', true],
  ['token-la', PROBE('co-le'), 'required', true],
  ['vang-khi-advisory', null, 'advisory', false],
];
for (const [n, probe, mode, expect] of ROI) check(`LM06 roi bac [${n}/${mode}] = ${expect}`, () => {
  const r = mkWs('g', G1(probe), `schema_version: 1\ngap_probe: ${mode}\n`);
  const j = extract(r, 'g', ['--gate', '1']);
  const out = spawnSync('node', [GC, '--root', r, '--slug', 'g', '--gate', '1'], { encoding: 'utf8' }).stdout;
  if (!!(j.roi_bac && j.roi_bac.on) !== expect) die('extract roi_bac=' + JSON.stringify(j.roi_bac));
  if (out.includes(pick('MSG_ROI_BAC')) !== expect) die('HTML khoi roi-bac ' + (expect ? 'THIEU' : 'THUA'));
});

// ── Task 6: câu gộp máy-sinh + bảng định tuyến + khối đối kháng (AC-1..AC-3) ──
const LEDGER = [
  '{"id":"d-1","type":"descope","stage":"S1","at":"2026-09-01T00:00:00Z","decision":"bo X","impact":"y"}',
  '{"id":"d-2","type":"seal","gate":1,"at":"2026-09-01T00:30:00Z"}',
  '{"id":"d-3","type":"fix","stage":"S4-r1","at":"2026-09-01T01:00:00Z","decision":"sua Z","impact":"w"}',
  '',
].join('\n');
// Ngoài-1 CÓ khuyến nghị (điền sẵn) · Ngoài-2 KHÔNG (để trống — người tự quyết)
const REVIEW2 = OOC(ITEM('known-limits') + '\n' + '- **Bat bien Y**\n  Người dùng thấy gì: nguoi thay Y\n  file: `b.js`\n  severity: low\n');
const G2FULL = () => { const f = G2(REVIEW2); f['decisions.jsonl'] = LEDGER; f['gap-probe.md'] = PROBE('findings').replace('p1: 0', 'p1: 2'); return f; };

check('LM07 one_shot Cong 1 sach -> dien san chu quyet', () => {
  const r = mkWs('g', G1(PROBE('findings')));
  const j = extract(r, 'g', ['--gate', '1']);
  const want = `${pick('ONE_SHOT_CMD_APPROVE')} g duyệt`;
  if (j.one_shot !== want) die('\n got: ' + j.one_shot + '\nwant: ' + want);
});
check('LM08 one_shot Cong 1 khi ROI BAC -> KHONG dien san', () => {
  const r = mkWs('g', G1(null));   // vang + required
  const j = extract(r, 'g', ['--gate', '1']);
  const want = `${pick('ONE_SHOT_CMD_APPROVE')} g ___`;
  if (j.one_shot !== want) die('\n got: ' + j.one_shot + '\nwant: ' + want);
});
check('LM09 one_shot Cong 2: o co khuyen nghi DIEN SAN, o loai-5 va chu quyet de trong', () => {
  const r = mkWs('s', G2FULL());
  const j = extract(r, 's');
  const want = `${pick('ONE_SHOT_CMD_SIGNOFF')} s Ngoài-1: ghi Known limits; Ngoài-2: ___; cắt/hoãn: đồng ý cắt; Treo: phê hết; ký hay trả: ___`;
  if (j.one_shot !== want) die('\n got: ' + j.one_shot + '\nwant: ' + want);
  const html = spawnSync('node', [GC, '--root', r, '--slug', 's'], { encoding: 'utf8' }).stdout;
  if (!html.includes(j.one_shot)) die('HTML khong chua dung chuoi one_shot — hai nguon');
});
check('LM10 routing: o HOI == loai-5; cat/hoan + Treo la dong BAO', () => {
  const r = mkWs('s', G2FULL());
  const j = extract(r, 's');
  if (JSON.stringify(j.routing.hoi) !== JSON.stringify(['Ngoài-1', 'Ngoài-2', 'ký hay trả'])) die('hoi=' + JSON.stringify(j.routing.hoi));
  if (!j.routing.bao.includes('cắt/hoãn') || !j.routing.bao.includes('Treo')) die('bao=' + JSON.stringify(j.routing.bao));
});
check('LM10b chieu do: them MOT muc loai-5 -> o HOI tang dung 1 (dang thuc so)', () => {
  const base = extract(mkWs('s', G2FULL()), 's');
  const f = G2FULL();
  f['contract.md'] = f['contract.md'].replace('risk_tier: T2', 'risk_tier: T3');
  f['evals.yaml'] = EVALS + '  - id: E9\n    criterion: AC-1\n    executor: judgment\n    expected: mat nguoi\n';
  f['evidence-report.md'] = REPORT_PASS
    .replace('| E1 | AC-1 | test | PASS |', '| E1 | AC-1 | test | PASS |\n| E9 | AC-1 | judgment | PASS |')
    .replace('verdict: PASS', 'verdict: PENDING-JUDGMENT');
  const j2 = extract(mkWs('s2', f), 's2');
  if (j2.routing.hoi.length !== base.routing.hoi.length + 1) {
    die(`them 1 loai-5 nhung o hoi ${base.routing.hoi.length} -> ${j2.routing.hoi.length}`);
  }
});
check('LM11 khoi PHAN QUYET DOI KHANG mang verdict + p0/p1/p2', () => {
  const r = mkWs('s', G2FULL());
  const html = spawnSync('node', [GC, '--root', r, '--slug', 's'], { encoding: 'utf8' }).stdout;
  if (!html.includes(pick('LBL_DOI_KHANG'))) die('thieu khoi doi khang');
  const txt = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');   // boc tag roi moi so — ghim MOT dang
  if (!/findings · P0 0 · P1 2 · P2 0/.test(txt)) {
    const i = txt.indexOf('findings');
    die('khong in dung so: ' + (i < 0 ? '(khong thay «findings»)' : txt.slice(i, i + 70)));
  }
});
check('LM12 the KHONG-ky-duoc (REJECT) -> one_shot = null, khong moi ky', () => {
  const f = G2FULL();
  f['evidence-report.md'] = REPORT_PASS.replace('verdict: PASS', 'verdict: REJECT').replace('| E1 | AC-1 | test | PASS |', '| E1 | AC-1 | test | FAIL |');
  const j = extract(mkWs('s', f), 's');
  if (j.one_shot !== null) die('the khong ky duoc van co one_shot: ' + j.one_shot);
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-lmcms)`);
process.exit(failed ? 1 : 0);
