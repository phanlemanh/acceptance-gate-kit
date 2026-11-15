// bo-cuc.test.mjs — hồ sơ phan-du-bo-cuc-moi, răng bền của bộ dịch đường `tests/bo-cuc.mjs` (AC-2; eval E2 ghim các
// dòng «PASS: BC …» của tệp này).
//
// Ma trận viết TRƯỚC (`DONG`): mỗi dòng là một đường phẳng, đường của nó ở kho mới, và đường trong gói ở hai bản sao gốc
// gói lộ trình. Ô = (đường vào × cây) có kỳ vọng; đường vào là cả dạng phẳng lẫn dạng `plugins/…` mà luật bước 6 sinh ra.
// Mỗi ô kiểm HAI thứ: bộ dịch ra đúng chuỗi viết trước, VÀ chuỗi ấy có thật ở cây (tệp/thư mục, hoặc `git cat-file -e`).
// Số dòng «PASS: BC <đường> · <cây>» phải bằng số ô.
//
// Fixture do mã sinh trong lần chạy, dưới `mkdtemp(os.tmpdir())`: cây phẳng = `git archive HEAD` TRỌN cây; kho mới =
// `dungKhoMoi` của hồ sơ gọi chéo (bước 1–3 của kịch bản chuyển nhà) trên cây phẳng, cộng các thư mục gốc kho giữ nguyên
// chỗ (`tests/`, `_acceptance/config.yaml`); commit trước #503 = cha của commit thêm `lib/ho-goi.cjs`; bản sao gốc gói =
// `gocGoi(kho mới, 'lo-trinh')` chép ra ngoài (và bản phẳng của nó). Mọi đường suy từ vị trí tệp này; không ca nào ghi
// vào cây kit. Hạ tầng hỏng (git archive, dựng kho mới) → «HẠ TẦNG: …», mã 3, không in PASS.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boCuc, duong, gocGoi, pathspec, tenGoi, tep } from '../bo-cuc.mjs';
import { LENH, dungKhoMoi } from '../../_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BO_CUC = path.join(KIT, 'tests', 'bo-cuc.mjs');
const BANG = JSON.parse(readFileSync(path.join(KIT, 'tests', 'fixtures', 'bo-cuc-phang.json'), 'utf8'));
const CAU_THIEU = 'không có .claude-plugin/marketplace.json';

let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const git = (...a) => execFileSync('git', ['-C', KIT, ...a], { encoding: 'utf8', maxBuffer: 1 << 26 }).trim();
const nem = f => { try { f(); return null; } catch (e) { return String(e.message || e); } };

// ── Fixture ─────────────────────────────────────────────────────────────────────────────────────────────────────────
let TMP; let cayPhang; let khoMoi; let dichGoi; let refCu; let refTruocCho; let banSaoGoi; let banSaoGoiPhang;
try {
  TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'bo-cuc-')));
  cayPhang = path.join(TMP, 'phang'); mkdirSync(cayPhang);
  execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive HEAD | tar -x -C "$2"', '_', KIT, cayPhang]);
  khoMoi = path.join(TMP, 'moi');
  ({ dichGoi } = dungKhoMoi(cayPhang, khoMoi));
  // dungKhoMoi chỉ dựng plugins/ + tệp khai chợ; phần gốc kho giữ nguyên chỗ ở kho mới thì chép sang như kịch bản để nguyên.
  cpSync(path.join(cayPhang, 'tests'), path.join(khoMoi, 'tests'), { recursive: true });
  mkdirSync(path.join(khoMoi, '_acceptance'));
  cpSync(path.join(cayPhang, '_acceptance', 'config.yaml'), path.join(khoMoi, '_acceptance', 'config.yaml'));
  const themHoGoi = git('log', '--diff-filter=A', '--format=%H', '--', 'lib/ho-goi.cjs').split('\n').filter(Boolean).pop();
  refCu = git('rev-parse', `${themHoGoi}^`);
  const themCho = git('log', '--diff-filter=A', '--format=%H', '--', '.claude-plugin/marketplace.json').split('\n').filter(Boolean).pop();
  refTruocCho = git('rev-parse', `${themCho}^`);
  banSaoGoi = path.join(TMP, 'goi-moi');
  cpSync(path.join(khoMoi, 'plugins', 'roadmap'), banSaoGoi, { recursive: true });
  banSaoGoiPhang = path.join(TMP, 'goi-phang');
  cpSync(path.join(cayPhang, 'road-map'), banSaoGoiPhang, { recursive: true });
} catch (e) {
  console.log(`HẠ TẦNG: dựng fixture hỏng — ${String(e.message || e).split('\n')[0]}`);
  if (TMP) rmSync(TMP, { recursive: true, force: true });
  process.exit(3);
}

const CAY = [
  { nhan: 'cây phẳng', cay: { thuMuc: cayPhang }, cot: 'phang' },
  { nhan: 'kho mới', cay: { thuMuc: khoMoi }, cot: 'moi' },
  { nhan: 'HEAD', cay: { kho: KIT, ref: 'HEAD' }, cot: 'phang' },
  { nhan: 'trước #503', cay: { kho: KIT, ref: refCu }, cot: 'cu' },
  { nhan: 'bản sao gốc gói', cay: { goiGoc: banSaoGoi, vai: 'lo-trinh' }, cot: 'goi' },
  { nhan: 'bản sao gói phẳng', cay: { goiGoc: banSaoGoiPhang, vai: 'lo-trinh' }, cot: 'goiPhang' },
];

// ── Ma trận viết trước ──────────────────────────────────────────────────────────────────────────────────────────────
// [đường phẳng, đường ở kho mới, thêm] — `thêm.cu === false`: không có ở commit trước #503; `thêm.goi`/`goiPhang`: đường
// trong bản sao gốc gói lộ trình (vắng = không thuộc gói ấy, không phải ô).
const DONG = [
  ['skills/acceptance/SKILL.md', 'plugins/acceptance-gate/skills/acceptance/SKILL.md'],
  ['skills/cat-luot/SKILL.md', 'plugins/acceptance-gate/skills/scope-slice/SKILL.md'],
  ['commands/approve.md', 'plugins/acceptance-gate/commands/approve.md'],
  ['hooks/hooks.json', 'plugins/acceptance-gate/hooks/hooks.json'],
  ['scripts/lo-trinh.mjs', 'plugins/acceptance-gate/scripts/lo-trinh.mjs'],
  ['lib/ho-goi.cjs', 'plugins/acceptance-gate/lib/ho-goi.cjs', { cu: false }],
  ['vendor', 'plugins/acceptance-gate/vendor'],
  ['evals', 'plugins/acceptance-gate/evals'],
  ['design-floor', 'plugins/acceptance-gate/design-floor'],
  ['.claude-plugin/plugin.json', 'plugins/acceptance-gate/.claude-plugin/plugin.json'],
  ['.claude-plugin/marketplace.json', '.claude-plugin/marketplace.json'],
  ['feature-loop/scripts/s4-args.mjs', 'plugins/feature-loop/scripts/s4-args.mjs'],
  ['dieu-phoi/scripts/dot.mjs', 'plugins/dispatch/scripts/dot.mjs'],
  ['dieu-phoi/commands/mo-dot.md', 'plugins/dispatch/commands/open.md'],
  ['road-map/commands/xem.md', 'plugins/roadmap/commands/status.md', { goi: 'commands/status.md', goiPhang: 'commands/xem.md' }],
  ['road-map/README.md', 'plugins/roadmap/README.md', { goi: 'README.md', goiPhang: 'README.md' }],
  ['road-map/.claude-plugin/plugin.json', 'plugins/roadmap/.claude-plugin/plugin.json', { goi: '.claude-plugin/plugin.json', goiPhang: '.claude-plugin/plugin.json' }],
  ['tri-thuc', 'plugins/knowledge'],
  ['tri-thuc/commands/ghi.md', 'plugins/knowledge/commands/ingest.md'],
  ['diagram-design/NOTICE', 'plugins/diagram-design/NOTICE'],
  ['tests/scripts/run-tests.sh', 'tests/scripts/run-tests.sh'],
  ['_acceptance/config.yaml', '_acceptance/config.yaml'],
];

function coThat(c, rel) {
  if (c.thuMuc) return existsSync(path.join(c.thuMuc, rel));
  if (c.goiGoc) return existsSync(path.join(c.goiGoc, rel));
  return spawnSync('git', ['-C', c.kho, 'cat-file', '-e', `${c.ref}:${rel}`], { stdio: 'ignore' }).status === 0;
}

const O = [];
for (const [phang, moi, them = {}] of DONG) {
  const kv = { phang, moi, cu: them.cu === false ? undefined : phang, goi: them.goi, goiPhang: them.goiPhang };
  for (const vao of [...new Set([phang, moi])]) for (const t of CAY) if (kv[t.cot] !== undefined) O.push({ vao, t, cho: kv[t.cot] });
}
let soBC = 0;
for (const { vao, t, cho } of O) {
  const id = `BC ${vao} · ${t.nhan}`;
  let ra;
  try { ra = duong(vao, t.cay); } catch (e) { bad(id, `ném: ${e.message}`); continue; }
  if (ra !== cho) { bad(id, `ra ${ra}, chờ ${cho}`); continue; }
  if (!coThat(t.cay, ra)) { bad(id, `${ra} không có ở cây`); continue; }
  soBC += 1; ok(id);
}
try { assert.equal(soBC, O.length); ok('BC-SO', `${soBC}/${O.length} ô`); }
catch { bad('BC-SO', `${soBC}/${O.length} ô xanh`); }

// ── BC-LUY-DANG — dịch hai lần bằng một lần (mọi ô của cây gốc kho; bản sao gốc gói ra đường trong gói, không cùng hệ) ──
{
  const ds = O.filter(o => !o.t.cay.goiGoc);
  const lech = [];
  for (const { vao, t } of ds) {
    const m = nem(() => { const a = duong(vao, t.cay); const b = duong(a, t.cay); if (a !== b) throw new Error(`${a} → ${b}`); });
    if (m) lech.push(`${vao} · ${t.nhan}: ${m}`);
  }
  lech.length ? bad('BC-LUY-DANG', lech.slice(0, 3).join(' · ')) : ok(`BC-LUY-DANG ${ds.length}/${ds.length} đường dịch hai lần bằng một lần`);
}

// ── BC-LENH — mỗi mục LENH của luật đổi chữ → tệp mới có thật ở kho mới, và quay về đúng đường phẳng ──────────────────
{
  const mucBang = Object.values(BANG.doi_ten_tep).reduce((n, m) => n + Object.keys(m).length, 0);
  const soLenh = Object.keys(LENH).length;
  mucBang === soLenh ? ok(`BC-LENH-DU ${mucBang}/${soLenh} mục LENH có trong doi_ten_tep`) : bad('BC-LENH-DU', `doi_ten_tep ${mucBang} mục, LENH ${soLenh}`);
  for (const [cu, moi] of Object.entries(LENH)) {
    const [pc, lc] = cu.split(':'); const lm = moi.split(':')[1];
    const goiPhang = pc === 'acceptance-gate' ? '' : pc;
    const laLenh = existsSync(path.join(cayPhang, goiPhang, 'commands', `${lc}.md`));
    const vaoPhang = path.posix.join(goiPhang, laLenh ? `commands/${lc}.md` : `skills/${lc}`);
    const choMoi = path.posix.join(dichGoi[pc], laLenh ? `commands/${lm}.md` : `skills/${lm}`);
    const id = `BC-LENH ${cu}`;
    const m = nem(() => {
      const ra = duong(vaoPhang, { thuMuc: khoMoi });
      if (ra !== choMoi) throw new Error(`${vaoPhang} ra ${ra}, chờ ${choMoi}`);
      if (!existsSync(path.join(khoMoi, ra))) throw new Error(`${ra} không có ở kho mới`);
      const ve = duong(choMoi, { thuMuc: cayPhang });
      if (ve !== vaoPhang) throw new Error(`${choMoi} về ${ve}, chờ ${vaoPhang}`);
    });
    m ? bad(id, m) : ok(id, `${vaoPhang} → ${choMoi}`);
  }
}

// ── BC-GLOB — dịch tiền tố, giữ đuôi glob ───────────────────────────────────────────────────────────────────────────
{
  const moi = { thuMuc: khoMoi }; const phang = { thuMuc: cayPhang };
  const ca = [
    ['scripts/**', moi, 'plugins/acceptance-gate/scripts/**'],
    ['plugins/acceptance-gate/scripts/**', phang, 'scripts/**'],
    ['skills/cat-luot/**', moi, 'plugins/acceptance-gate/skills/scope-slice/**'],
    ['road-map/commands/*.md', moi, 'plugins/roadmap/commands/*.md'],
    ['tests/*.mjs', moi, 'tests/*.mjs'],
  ];
  const lech = ca.map(([r, c, k]) => { const m = nem(() => { const ra = duong(r, c); if (ra !== k) throw new Error(`ra ${ra}`); }); return m && `${r}: ${m}, chờ ${k}`; }).filter(Boolean);
  lech.length ? bad('BC-GLOB', lech.join(' · ')) : ok('BC-GLOB', `${ca.length} đường glob giữ đuôi`);
}

// ── BC-TUYET — đường tuyệt đối hoặc có `..` ném đúng câu ─────────────────────────────────────────────────────────────
{
  const lech = [];
  for (const r of ['/abs/x', '../x', 'scripts/../x']) {
    const m = nem(() => duong(r, { thuMuc: khoMoi }));
    if (m !== `bo-cuc: chỉ nhận đường tương đối gốc kho: ${r}`) lech.push(`${r}: ${m ?? '(không ném)'}`);
  }
  lech.length ? bad('BC-TUYET', lech.join(' · ')) : ok('BC-TUYET', '3 đường ném «bo-cuc: chỉ nhận đường tương đối gốc kho: <đường>»');
}

// ── BC-THIEU + đối chứng BC-DU ──────────────────────────────────────────────────────────────────────────────────────
{
  const thieu = [
    [{ thuMuc: banSaoGoi }, `bo-cuc: ${banSaoGoi} ${CAU_THIEU}`],
    [{ kho: KIT, ref: refTruocCho }, `bo-cuc: ${refTruocCho} ${CAU_THIEU}`],
  ];
  const lech = [];
  for (const [c, cau] of thieu) {
    const m1 = nem(() => boCuc(c));
    const m2 = nem(() => duong('scripts/lo-trinh.mjs', c));
    if (m1 !== cau) lech.push(`boCuc: ${m1 ?? '(không lỗi)'}`);
    if (m2 !== cau) lech.push(`duong: ${m2 ?? '(không lỗi — lùi lặng về phẳng)'}`);
  }
  lech.length ? bad('BC-THIEU', `không lỗi đúng câu: ${lech.join(' · ')}`)
    : ok('BC-THIEU cây thiếu marketplace.json → bo-cuc: <cây> không có .claude-plugin/marketplace.json', `${thieu.length} cây`);
  const du = [[{ thuMuc: cayPhang }, true], [{ thuMuc: khoMoi }, false], [{ kho: KIT, ref: 'HEAD' }, true], [{ kho: KIT, ref: refCu }, true]];
  const lechDu = [];
  for (const [c, phang] of du) {
    const m = nem(() => { const b = boCuc(c); if (b.phang !== phang) throw new Error(`phang=${b.phang}, chờ ${phang}`); });
    if (m) lechDu.push(`${c.thuMuc || c.ref}: ${m}`);
  }
  lechDu.length ? bad('BC-DU', lechDu.join(' · ')) : ok('BC-DU cây đủ → giải được', `${du.length} cây`);
}

// ── BC-RONG — chốt chống rỗng của pathspec + đối chứng ──────────────────────────────────────────────────────────────
{
  const H = { kho: KIT, ref: 'HEAD' };
  const m = nem(() => pathspec('khong-co/x', H));
  m === 'bo-cuc: pathspec rỗng ở HEAD: khong-co/x' ? ok('BC-RONG', m) : bad('BC-RONG', `chờ «bo-cuc: pathspec rỗng ở HEAD: khong-co/x», được ${m ?? '(không ném)'}`);
  const d = nem(() => { for (const [r, k] of [['scripts', 'scripts'], ['scripts/**', 'scripts/**'], ['plugins/roadmap/commands/status.md', 'road-map/commands/xem.md']]) { const ra = pathspec(r, H); if (ra !== k) throw new Error(`${r} ra ${ra}, chờ ${k}`); } });
  d ? bad('BC-RONG-DOI-CHUNG', d) : ok('BC-RONG-DOI-CHUNG', 'pathspec có thật trả đường đã dịch');
}

// ── BC-TEN / BC-GOC / BC-TEP — tên theo vai đọc từ chính cây; gốc gói; tệp ──────────────────────────────────────────
{
  const ca = [
    [() => tenGoi({ thuMuc: cayPhang }, 'lo-trinh'), 'road-map'],
    [() => tenGoi({ thuMuc: khoMoi }, 'lo-trinh'), 'roadmap'],
    [() => tenGoi({ thuMuc: khoMoi }, 'dieu-phoi'), 'dispatch'],
    [() => tenGoi({ kho: KIT, ref: 'HEAD' }, 'tri-thuc'), 'tri-thuc'],
    [() => tenGoi({ kho: KIT, ref: refCu }, 'lo-trinh'), 'road-map'],
    [() => tenGoi({ kho: KIT, ref: refCu }, 'loi'), 'acceptance-gate'],
    [() => tenGoi({ goiGoc: banSaoGoi, vai: 'lo-trinh' }, 'lo-trinh'), 'roadmap'],
  ];
  const lech = ca.map(([f, k], i) => { const m = nem(() => { const ra = f(); if (ra !== k) throw new Error(`ra ${ra}`); }); return m && `#${i + 1} ${m}, chờ ${k}`; }).filter(Boolean);
  lech.length ? bad('BC-TEN', lech.join(' · ')) : ok('BC-TEN', `${ca.length} tên theo vai đọc từ bảng tên của chính cây`);
  const goc = [
    [() => gocGoi({ thuMuc: khoMoi }, 'lo-trinh'), path.join(khoMoi, 'plugins', 'roadmap')],
    [() => gocGoi({ thuMuc: cayPhang }, 'loi'), cayPhang],
    [() => gocGoi({ thuMuc: cayPhang }, 'dieu-phoi'), path.join(cayPhang, 'dieu-phoi')],
    [() => tep('road-map/commands/xem.md', { thuMuc: khoMoi }), path.join(khoMoi, 'plugins', 'roadmap', 'commands', 'status.md')],
    [() => tep('plugins/roadmap/commands/status.md', { kho: KIT, ref: 'HEAD' }), 'HEAD:road-map/commands/xem.md'],
  ];
  const lechG = goc.map(([f, k], i) => { const m = nem(() => { const ra = f(); if (ra !== k) throw new Error(`ra ${ra}`); }); return m && `#${i + 1} ${m}, chờ ${k}`; }).filter(Boolean);
  lechG.length ? bad('BC-GOC', lechG.join(' · ')) : ok('BC-GOC', `${goc.length} gốc gói / tệp`);
  const ngoai = nem(() => duong('scripts/lo-trinh.mjs', { goiGoc: banSaoGoi, vai: 'lo-trinh' }));
  ngoai === `bo-cuc: scripts/lo-trinh.mjs không thuộc gói vai «lo-trinh» của ${banSaoGoi}`
    ? ok('BC-NGOAI-GOI', 'đường ngoài gói ném câu có tên') : bad('BC-NGOAI-GOI', `được ${ngoai ?? '(không ném)'}`);
}

// ── BC-CLI — một dòng đường, mã 0; lỗi → stderr + mã 2 ───────────────────────────────────────────────────────────────
{
  const chay = (...a) => spawnSync(process.execPath, [BO_CUC, ...a], { encoding: 'utf8' });
  const lech = [];
  const r1 = chay('duong', 'road-map/commands/xem.md', '--thu-muc', khoMoi);
  if (r1.status !== 0 || r1.stdout !== 'plugins/roadmap/commands/status.md\n') lech.push(`--thu-muc: mã ${r1.status}, «${r1.stdout.trim()}» ${r1.stderr.trim()}`);
  const r2 = chay('duong', 'plugins/dispatch/scripts/dot.mjs', '--kho', KIT, '--ref', 'HEAD');
  if (r2.status !== 0 || r2.stdout !== 'dieu-phoi/scripts/dot.mjs\n') lech.push(`--kho --ref: mã ${r2.status}, «${r2.stdout.trim()}» ${r2.stderr.trim()}`);
  const r3 = chay('duong', '/abs/x', '--thu-muc', khoMoi);
  if (r3.status !== 2 || r3.stdout !== '' || !r3.stderr.includes('bo-cuc: chỉ nhận đường tương đối gốc kho: /abs/x')) lech.push(`lỗi: mã ${r3.status}, stderr «${r3.stderr.trim()}»`);
  lech.length ? bad('BC-CLI', lech.join(' · ')) : ok('BC-CLI', 'một dòng đường mã 0; lỗi stderr mã 2');
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nbo-cuc: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
