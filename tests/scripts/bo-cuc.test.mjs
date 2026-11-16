// bo-cuc.test.mjs — hồ sơ phan-du-bo-cuc-moi, răng bền của bộ dịch đường `tests/bo-cuc.mjs` (AC-2; eval E2 ghim các
// dòng «PASS: BC …» của tệp này).
//
// Ma trận viết TRƯỚC (`DONG`): mỗi dòng là một đường phẳng, đường của nó ở kho mới, và đường trong gói ở hai bản sao gốc
// gói lộ trình. Ô = (đường vào × cây) có kỳ vọng; đường vào là cả dạng phẳng lẫn dạng `plugins/…` mà luật bước 6 sinh ra.
// Mỗi ô kiểm HAI thứ: bộ dịch ra đúng chuỗi viết trước, VÀ chuỗi ấy có thật ở cây (tệp/thư mục, hoặc `git cat-file -e`).
// Số dòng «PASS: BC <đường> · <cây>» phải bằng số ô.
//
// Fixture do mã sinh trong lần chạy, dưới `mkdtemp(os.tmpdir())`, qua `haiCay` (tests/hai-bo-cuc.mjs — hồ sơ
// phan-du-bo-cuc-moi-vong-ba): HEAD phẳng → cây phẳng = `git archive HEAD` TRỌN cây; HEAD đã dọn nhà → cây phẳng = bản bung
// của cha commit dọn nhà (REF_PHANG), kho mới = chính HEAD. Hàng «HEAD» lấy cột theo bố cục thật của HEAD; mọi phép khẳng
// định «đọc một commit phẳng» dùng REF_PHANG (= HEAD ở cây cũ). Nhánh HEAD phẳng như cũ: kho mới =
// `dungKhoMoi` của hồ sơ gọi chéo (bước 1–3 của kịch bản chuyển nhà) trên cây phẳng, cộng các thư mục gốc kho giữ nguyên
// chỗ (`tests/`, `_acceptance/config.yaml`); commit trước #503 = cha của commit thêm `lib/ho-goi.cjs`; bản sao gốc gói =
// `gocGoi(kho mới, 'lo-trinh')` chép ra ngoài (và bản phẳng của nó). Mọi đường suy từ vị trí tệp này; không ca nào ghi
// vào cây kit. Hạ tầng hỏng (git archive, dựng kho mới) → «HẠ TẦNG: …», mã 3, không in PASS.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boCuc, boPhan, duong, gocGoi, pathspec, tenCho, tenGoi, tep } from '../bo-cuc.mjs';
// CHO_CU/CHO_MOI từ bảng đổi tên đã chép (ngoài tests/): chữ tên chợ viết cứng ở đây bị luật đổi tên của kịch bản đổi thành
// tên mới ở kho mới, trong khi cây phẳng vẫn mang tên cũ (hồ sơ phan-du-bo-cuc-moi-vong-ba).
import { CHO_CU, CHO_MOI, LENH } from '../../_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs';
import { haiCay } from '../hai-bo-cuc.mjs';
import { BX, Dung, buoc6BoKiem } from '../../_acceptance/phan-du-bo-cuc-moi/rang/buoc6-chep.mjs';

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
let TMP; let cayPhang; let khoMoi; let dichGoi; let hienTai; let REF_PHANG; let refCu; let refTruocCho; let banSaoGoi; let banSaoGoiPhang;
try {
  TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'bo-cuc-')));
  ({ phang: cayPhang, moi: khoMoi, dichGoi, hienTai, refPhang: REF_PHANG } = haiCay(KIT, TMP));
  // HEAD phẳng: dungKhoMoi chỉ dựng plugins/ + tệp khai chợ; phần gốc kho giữ nguyên chỗ ở kho mới thì chép sang như kịch
  // bản để nguyên. HEAD đã dọn nhà: kho mới là bản bung trọn của HEAD, đã có sẵn các phần ấy.
  if (hienTai === 'phang') {
    cpSync(path.join(cayPhang, 'tests'), path.join(khoMoi, 'tests'), { recursive: true });
    mkdirSync(path.join(khoMoi, '_acceptance'));
    cpSync(path.join(cayPhang, '_acceptance', 'config.yaml'), path.join(khoMoi, '_acceptance', 'config.yaml'));
  }
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
  { nhan: 'HEAD', cay: { kho: KIT, ref: 'HEAD' }, cot: hienTai },
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
  const du = [[{ thuMuc: cayPhang }, true], [{ thuMuc: khoMoi }, false], [{ kho: KIT, ref: REF_PHANG }, true], [{ kho: KIT, ref: refCu }, true]];
  const lechDu = [];
  for (const [c, phang] of du) {
    const m = nem(() => { const b = boCuc(c); if (b.phang !== phang) throw new Error(`phang=${b.phang}, chờ ${phang}`); });
    if (m) lechDu.push(`${c.thuMuc || c.ref}: ${m}`);
  }
  lechDu.length ? bad('BC-DU', lechDu.join(' · ')) : ok('BC-DU cây đủ → giải được', `${du.length} cây`);
}

// ── BC-RONG — chốt chống rỗng của pathspec + đối chứng ──────────────────────────────────────────────────────────────
{
  const H = { kho: KIT, ref: REF_PHANG };
  const m = nem(() => pathspec('khong-co/x', H));
  m === `bo-cuc: pathspec rỗng ở ${REF_PHANG}: khong-co/x` ? ok('BC-RONG', m) : bad('BC-RONG', `chờ «bo-cuc: pathspec rỗng ở ${REF_PHANG}: khong-co/x», được ${m ?? '(không ném)'}`);
  const d = nem(() => { for (const [r, k] of [['scripts', 'scripts'], ['scripts/**', 'scripts/**'], ['plugins/roadmap/commands/status.md', 'road-map/commands/xem.md']]) { const ra = pathspec(r, H); if (ra !== k) throw new Error(`${r} ra ${ra}, chờ ${k}`); } });
  d ? bad('BC-RONG-DOI-CHUNG', d) : ok('BC-RONG-DOI-CHUNG', 'pathspec có thật trả đường đã dịch');
}

// ── BC-TEN / BC-GOC / BC-TEP — tên theo vai đọc từ chính cây; gốc gói; tệp ──────────────────────────────────────────
{
  const ca = [
    [() => tenGoi({ thuMuc: cayPhang }, 'lo-trinh'), 'road-map'],
    [() => tenGoi({ thuMuc: khoMoi }, 'lo-trinh'), 'roadmap'],
    [() => tenGoi({ thuMuc: khoMoi }, 'dieu-phoi'), 'dispatch'],
    [() => tenGoi({ kho: KIT, ref: REF_PHANG }, 'tri-thuc'), 'tri-thuc'],
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
    [() => tep('plugins/roadmap/commands/status.md', { kho: KIT, ref: REF_PHANG }), `${REF_PHANG}:road-map/commands/xem.md`],
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
  const r2 = chay('duong', 'plugins/dispatch/scripts/dot.mjs', '--kho', KIT, '--ref', REF_PHANG);
  if (r2.status !== 0 || r2.stdout !== 'dieu-phoi/scripts/dot.mjs\n') lech.push(`--kho --ref: mã ${r2.status}, «${r2.stdout.trim()}» ${r2.stderr.trim()}`);
  const r3 = chay('duong', '/abs/x', '--thu-muc', khoMoi);
  if (r3.status !== 2 || r3.stdout !== '' || !r3.stderr.includes('bo-cuc: chỉ nhận đường tương đối gốc kho: /abs/x')) lech.push(`lỗi: mã ${r3.status}, stderr «${r3.stderr.trim()}»`);
  lech.length ? bad('BC-CLI', lech.join(' · ')) : ok('BC-CLI', 'một dòng đường mã 0; lỗi stderr mã 2');
}

// ── Task 1c (thu-bo-dich.md H1, H2, H7) ─────────────────────────────────────────────────────────────────────────────
const CO_CHO = ds => ds.some(x => x === '.claude-plugin/marketplace.json' || x === '.claude-plugin');
const CAU_TACH = c => `bo-cuc: .claude-plugin tách ở ${c} — dùng boPhan`;

// ── BC-BOPHAN — danh sách thư mục lõi phẳng → cây: từng phần tử dịch, `.claude-plugin` tách, luôn kèm tệp khai chợ ─────
{
  const LOI = ['scripts', 'lib', 'skills', 'hooks', 'commands', '.claude-plugin'];
  const G = 'plugins/acceptance-gate';
  const H = { kho: KIT, ref: REF_PHANG };
  const ca = [
    ['lõi có .claude-plugin → kho mới', LOI, { thuMuc: khoMoi },
      [`${G}/scripts`, `${G}/lib`, `${G}/skills`, `${G}/hooks`, `${G}/commands`, '.claude-plugin/marketplace.json', `${G}/.claude-plugin/plugin.json`]],
    ['lõi không .claude-plugin → kho mới', ['scripts', 'lib', 'skills'], { thuMuc: khoMoi },
      [`${G}/scripts`, `${G}/lib`, `${G}/skills`, '.claude-plugin/marketplace.json']],
    ['lõi có .claude-plugin → cây phẳng', LOI, { thuMuc: cayPhang }, LOI],
    ['lõi không .claude-plugin → HEAD', ['scripts', 'lib', 'skills'], H, ['scripts', 'lib', 'skills', '.claude-plugin/marketplace.json']],
    ['dạng plugins/… → HEAD', [`${G}/scripts`, 'plugins/roadmap/commands/status.md', '.claude-plugin'], H,
      ['scripts', 'road-map/commands/xem.md', '.claude-plugin']],
  ];
  for (const [nhan, ds, c, cho] of ca) {
    const id = `BC-BOPHAN ${nhan}`;
    const m = nem(() => {
      const ra = boPhan(ds, c);
      if (JSON.stringify(ra) !== JSON.stringify(cho)) throw new Error(`ra ${JSON.stringify(ra)}, chờ ${JSON.stringify(cho)}`);
      const vang = ra.filter(x => !coThat(c, x));
      if (vang.length) throw new Error(`không có ở cây: ${vang.join(', ')}`);
      if (!CO_CHO(ra)) throw new Error('thiếu tệp khai chợ');
    });
    m ? bad(id, m) : ok(id, `${ds.length} → ${cho.length} phần tử, mỗi phần tử có thật, có tệp khai chợ`);
  }
  // Bản sao dựng từ kết quả phải giải được bằng bộ dịch (lý do H1); đối chứng âm: dịch từng phần tử mà bỏ tệp khai chợ.
  const m = nem(() => {
    const chep = (ds, dich) => { for (const x of ds) cpSync(path.join(khoMoi, x), path.join(dich, x), { recursive: true }); };
    const sao = path.join(TMP, 'bophan-moi'); chep(boPhan(LOI, { thuMuc: khoMoi }), sao);
    const b = boCuc({ thuMuc: sao });
    if (b.phang !== false) throw new Error(`bản sao kho mới phang=${b.phang}`);
    const d = duong('scripts/lo-trinh.mjs', { thuMuc: sao });
    if (!existsSync(path.join(sao, d))) throw new Error(`${d} không có ở bản sao`);
    if (!existsSync(path.join(gocGoi({ thuMuc: sao }, 'loi'), '.claude-plugin', 'plugin.json'))) throw new Error('plugin.json của lõi rơi mất');
    const tran = path.join(TMP, 'bophan-tran'); chep(['scripts', 'lib'].map(x => duong(x, { thuMuc: khoMoi })), tran);
    const am = nem(() => boCuc({ thuMuc: tran }));
    if (am !== `bo-cuc: ${tran} ${CAU_THIEU}`) throw new Error(`đối chứng âm (không tệp khai chợ): ${am ?? '(không ném)'}`);
    const arc = path.join(TMP, 'bophan-head'); mkdirSync(arc);
    execFileSync('bash', ['-c', 'set -o pipefail; git -C "$1" archive "$3" -- "${@:4}" | tar -x -C "$2"', '_', KIT, arc, REF_PHANG, ...boPhan(['scripts', 'lib', 'skills'], H)]);
    if (boCuc({ thuMuc: arc }).phang !== true) throw new Error('bản bung HEAD không phẳng');
  });
  m ? bad('BC-BOPHAN-DUNG', m) : ok('BC-BOPHAN-DUNG', 'cpSync kho mới + git archive HEAD theo boPhan giải được; bỏ tệp khai chợ → ném BC-THIEU');
  const g = nem(() => boPhan(['commands'], { goiGoc: banSaoGoi, vai: 'lo-trinh' }));
  g && g.startsWith('bo-cuc: boPhan chỉ nhận { thuMuc } · { kho, ref }')
    ? ok('BC-BOPHAN-GOI', 'bản sao gốc gói ném câu có tên') : bad('BC-BOPHAN-GOI', `được ${g ?? '(không ném)'}`);
}

// ── BC-TACH — `.claude-plugin` trần ở cây không phẳng ném đúng câu + đối chứng cây phẳng trả nguyên ───────────────────
{
  const lech = [];
  for (const r of ['.claude-plugin', '.claude-plugin/', './.claude-plugin']) {
    const m = nem(() => duong(r, { thuMuc: khoMoi }));
    if (m !== CAU_TACH(khoMoi)) lech.push(`${r}: ${m ?? '(không ném — nửa plugin.json rơi lặng)'}`);
  }
  lech.length ? bad('BC-TACH', lech.join(' · ')) : ok('BC-TACH', `3 dạng ném «${CAU_TACH('<cây>')}»`);
  const dc = [
    ['.claude-plugin', { thuMuc: cayPhang }, '.claude-plugin'],
    ['.claude-plugin', { kho: KIT, ref: REF_PHANG }, '.claude-plugin'],
    ['.claude-plugin', { kho: KIT, ref: refCu }, '.claude-plugin'],
    ['.claude-plugin/marketplace.json', { thuMuc: khoMoi }, '.claude-plugin/marketplace.json'],
    ['.claude-plugin/plugin.json', { thuMuc: khoMoi }, 'plugins/acceptance-gate/.claude-plugin/plugin.json'],
  ];
  const lechD = dc.map(([r, c, k]) => { const m = nem(() => { const ra = duong(r, c); if (ra !== k) throw new Error(`ra ${ra}`); if (!coThat(c, ra)) throw new Error(`${ra} không có ở cây`); }); return m && `${r} · ${c.thuMuc || c.ref}: ${m}, chờ ${k}`; }).filter(Boolean);
  lechD.length ? bad('BC-TACH-DOI-CHUNG', lechD.join(' · ')) : ok('BC-TACH-DOI-CHUNG', `${dc.length} ca: cây phẳng trả .claude-plugin, tệp con ở kho mới vẫn dịch`);
}

// ── BC-CHO — tên chợ đọc từ tệp khai chợ của chính cây + đối chứng cây thiếu chợ ─────────────────────────────────────
{
  const ca = [
    [{ thuMuc: cayPhang }, CHO_CU],
    [{ thuMuc: khoMoi }, CHO_MOI],
    [{ kho: KIT, ref: REF_PHANG }, CHO_CU],
  ];
  const lech = ca.map(([c, k]) => { const m = nem(() => { const ra = tenCho(c); if (ra !== k) throw new Error(`ra ${ra}`); }); return m && `${c.thuMuc || c.ref}: ${m}, chờ ${k}`; }).filter(Boolean);
  lech.length ? bad('BC-CHO', lech.join(' · ')) : ok('BC-CHO', 'acceptance-gate-kit ở cây phẳng và HEAD, delivery-loop ở kho mới');
  const thieu = [
    [{ thuMuc: banSaoGoi }, `bo-cuc: ${banSaoGoi} ${CAU_THIEU}`],
    [{ kho: KIT, ref: refTruocCho }, `bo-cuc: ${refTruocCho} ${CAU_THIEU}`],
  ];
  const lechT = thieu.map(([c, cau]) => { const m = nem(() => tenCho(c)); return m !== cau && `${c.thuMuc || c.ref}: ${m ?? '(không ném)'}`; }).filter(Boolean);
  lechT.length ? bad('BC-CHO-THIEU', lechT.join(' · ')) : ok('BC-CHO-THIEU', `${thieu.length} cây thiếu tệp khai chợ ném câu BC-THIEU`);
}

// ── BC-CLI-PHU — lệnh bo-phan / ten-cho cùng cờ cây; lỗi tách qua CLI ─────────────────────────────────────────────────
{
  const chay = (...a) => spawnSync(process.execPath, [BO_CUC, ...a], { encoding: 'utf8' });
  const lech = [];
  const r1 = chay('bo-phan', 'scripts', 'lib', '.claude-plugin', '--thu-muc', khoMoi);
  const k1 = 'plugins/acceptance-gate/scripts\nplugins/acceptance-gate/lib\n.claude-plugin/marketplace.json\nplugins/acceptance-gate/.claude-plugin/plugin.json\n';
  if (r1.status !== 0 || r1.stdout !== k1) lech.push(`bo-phan --thu-muc: mã ${r1.status}, «${r1.stdout.trim()}» ${r1.stderr.trim()}`);
  const r2 = chay('bo-phan', 'plugins/roadmap/commands/status.md', '--kho', KIT, '--ref', REF_PHANG);
  if (r2.status !== 0 || r2.stdout !== 'road-map/commands/xem.md\n.claude-plugin/marketplace.json\n') lech.push(`bo-phan --kho --ref: mã ${r2.status}, «${r2.stdout.trim()}» ${r2.stderr.trim()}`);
  const r3 = chay('ten-cho', '--thu-muc', khoMoi);
  if (r3.status !== 0 || r3.stdout !== `${CHO_MOI}\n`) lech.push(`ten-cho --thu-muc: mã ${r3.status}, «${r3.stdout.trim()}» ${r3.stderr.trim()}`);
  const r4 = chay('ten-cho', '--kho', KIT, '--ref', REF_PHANG);
  if (r4.status !== 0 || r4.stdout !== `${CHO_CU}\n`) lech.push(`ten-cho --kho --ref: mã ${r4.status}, «${r4.stdout.trim()}» ${r4.stderr.trim()}`);
  const r5 = chay('duong', '.claude-plugin', '--thu-muc', khoMoi);
  if (r5.status !== 2 || r5.stdout !== '' || !r5.stderr.includes(CAU_TACH(khoMoi))) lech.push(`duong .claude-plugin: mã ${r5.status}, stderr «${r5.stderr.trim()}»`);
  const r6 = chay('bo-phan', '--thu-muc', khoMoi);
  if (r6.status !== 2 || r6.stdout !== '' || !r6.stderr.includes('bo-cuc: cách dùng')) lech.push(`bo-phan không đường: mã ${r6.status}, stderr «${r6.stderr.trim()}»`);
  lech.length ? bad('BC-CLI-PHU', lech.join(' · ')) : ok('BC-CLI-PHU', 'bo-phan một dòng mỗi phần tử, ten-cho một dòng, mã 0; lỗi stderr mã 2');
}

// ── BC-B6 — bộ dịch qua luật bước 6 (bản chép, không bảng vá) vẫn bằng từng byte + đối chứng tiêm lại hằng đường cũ ─────
// Bản sao chỉ chứa tests/bo-cuc.mjs (chặt hơn kho thật: không thư mục nào cạnh tệp kiểm che luật). Luật «không khớp chỗ
// nào» = 0 chỗ đổi. Đối chứng: hằng plugin.json viết lại thành chuỗi đường (dạng trước khi dời sang bảng) → bước 6 phải đổi.
{
  const quaBuoc6 = (nd, nhan) => {
    const wt = path.join(TMP, `b6-${nhan}`); mkdirSync(path.join(wt, 'tests'), { recursive: true });
    writeFileSync(path.join(wt, 'tests', 'bo-cuc.mjs'), nd);
    execFileSync('git', ['-C', wt, 'init', '-q']); execFileSync('git', ['-C', wt, 'add', '-A']);
    let so;
    try { so = buoc6BoKiem(wt, BX, KIT, REF_PHANG, dichGoi); }
    catch (e) { if (!(e instanceof Dung) || e.message !== 'luật bộ kiểm không khớp chỗ nào') throw e; so = []; }
    return { sau: readFileSync(path.join(wt, 'tests', 'bo-cuc.mjs'), 'utf8'), so };
  };
  const goc = readFileSync(BO_CUC, 'utf8');
  const m = nem(() => {
    const { sau, so } = quaBuoc6(goc, 'nguyen');
    if (sau !== goc) throw new Error(`bước 6 đổi ${so.map(([lop, , c]) => `${lop}×${c}`).join(', ')}`);
  });
  m ? bad('BC-B6', m) : ok('BC-B6 tests/bo-cuc.mjs qua luật bước 6 vẫn bằng từng byte');
  const hang = 'const PLUGIN_JSON = BANG.tep_khai.plugin;';
  const cu = `const PLUGIN_JSON = '${BANG.tep_khai.plugin}';`;
  const d = nem(() => {
    if (goc.split(hang).length !== 2) throw new Error(`nhát tiêm không áp: «${hang}» không có đúng một lần`);
    const { sau } = quaBuoc6(goc.replace(hang, cu), 'tiem');
    const cho = `const PLUGIN_JSON = '${BX.tep[BANG.tep_khai.plugin]}';`;
    if (!sau.includes(cho)) throw new Error(`bản tiêm qua bước 6 không ra «${cho}»`);
  });
  d ? bad('BC-B6-DOI-CHUNG', d) : ok('BC-B6-DOI-CHUNG', 'tiêm lại hằng đường plugin.json → bước 6 đổi nó sang bố cục mới');
}

// ── BC-LA — gói không rõ vai trong tệp khai: đọc được, đường lõi vẫn giải; đường vào gói lạ ném đúng câu ──────────────
// Hai cây: thư mục tạm có tệp khai chép từ cây phẳng cộng một gói lạ; và commit thật cuối cùng còn khai gói ấy (cha của
// commit gỡ nó khỏi tệp khai — rút bằng `git log -S`, không ghim sha).
{
  const LA = 'design-loop';
  const tmpLa = path.join(TMP, 'goi-la'); mkdirSync(path.join(tmpLa, '.claude-plugin'), { recursive: true });
  const mk = JSON.parse(readFileSync(path.join(cayPhang, BANG.tep_khai.cho), 'utf8'));
  writeFileSync(path.join(tmpLa, BANG.tep_khai.cho), JSON.stringify({ ...mk, plugins: [...mk.plugins, { name: LA, source: `./${LA}` }] }, null, 2));
  const goCho = git('log', '-1', '--format=%H', `-S"${LA}"`, '--', BANG.tep_khai.cho);
  const refLa = goCho && git('rev-parse', `${goCho}^`);
  const cays = [[{ thuMuc: tmpLa }, tmpLa], ...(refLa ? [[{ kho: KIT, ref: refLa }, refLa]] : [])];
  const lech = [];
  if (!refLa) lech.push(`không rút được commit còn khai «${LA}»`);
  for (const [c, nhan] of cays) {
    const cau = `bo-cuc: ${nhan} có gói «${LA}» không rõ vai`;
    const m = nem(() => {
      if (c.kho && !git('show', `${refLa}:${BANG.tep_khai.cho}`).includes(`"${LA}"`)) throw new Error(`${refLa} không khai «${LA}» — fixture hỏng`);
      const b = boCuc(c);
      if (b.phang !== true) throw new Error(`phang=${b.phang}, chờ true`);
      for (const [r, k] of [['scripts/lo-trinh.mjs', 'scripts/lo-trinh.mjs'], ['plugins/acceptance-gate/hooks/hooks.json', 'hooks/hooks.json'], ['feature-loop/README.md', 'feature-loop/README.md']]) {
        const ra = duong(r, c); if (ra !== k) throw new Error(`${r} ra ${ra}, chờ ${k}`);
      }
      if (c.thuMuc && gocGoi(c, 'loi') !== tmpLa) throw new Error(`gocGoi lõi ra ${gocGoi(c, 'loi')}`);
    });
    if (m) lech.push(`${nhan}: ${m}`);
    for (const r of [`${LA}/commands/x.md`, `plugins/${LA}/skills/y`, LA]) {
      const e = nem(() => duong(r, c));
      if (e !== cau) lech.push(`duong ${r} · ${nhan}: ${e ?? '(không ném)'}`);
    }
    if (c.thuMuc) { const e = nem(() => gocGoi(c, LA)); if (e !== cau) lech.push(`gocGoi ${LA}: ${e ?? '(không ném)'}`); }
  }
  lech.length ? bad('BC-LA', lech.join(' · '))
    : ok('BC-LA gói không rõ vai: đường lõi vẫn giải, đường vào gói lạ ném «bo-cuc: <cây> có gói «<tên>» không rõ vai»', `${cays.length} cây`);
}

// ── BC-CLI-GOI — cờ --goi-goc <dir> --vai <vai>: cây bản sao gốc gói qua CLI; lỗi stderr + mã 2 ──────────────────────
{
  const chay = (...a) => spawnSync(process.execPath, [BO_CUC, ...a], { encoding: 'utf8' });
  const lech = [];
  const dung = [
    ['road-map/commands/xem.md', banSaoGoi, 'commands/status.md'],
    ['plugins/roadmap/commands/status.md', banSaoGoi, 'commands/status.md'],
    ['road-map/commands/xem.md', banSaoGoiPhang, 'commands/xem.md'],
    ['plugins/roadmap/commands/status.md', banSaoGoiPhang, 'commands/xem.md'],
  ];
  for (const [r, g, k] of dung) {
    const x = chay('duong', r, '--goi-goc', g, '--vai', 'lo-trinh');
    if (x.status !== 0 || x.stdout !== `${k}\n`) lech.push(`${r} · ${path.basename(g)}: mã ${x.status}, «${x.stdout.trim()}» ${x.stderr.trim()}`);
    else if (!existsSync(path.join(g, k))) lech.push(`${k} không có ở ${g}`);
    else if (x.stdout !== `${duong(r, { goiGoc: g, vai: 'lo-trinh' })}\n`) lech.push(`${r}: CLI khác hàm duong`);
  }
  const sai = [
    [['duong', 'scripts/lo-trinh.mjs', '--goi-goc', banSaoGoi, '--vai', 'lo-trinh'], `bo-cuc: scripts/lo-trinh.mjs không thuộc gói vai «lo-trinh» của ${banSaoGoi}`],
    [['duong', 'README.md', '--goi-goc', banSaoGoi], 'bo-cuc: --goi-goc và --vai phải đi cùng nhau'],
    [['duong', 'README.md', '--vai', 'lo-trinh'], 'bo-cuc: --goi-goc và --vai phải đi cùng nhau'],
    [['duong', 'README.md', '--goi-goc', banSaoGoi, '--vai', 'lo-trinh', '--thu-muc', khoMoi], 'bo-cuc: --goi-goc/--vai không đi cùng --thu-muc · --kho/--ref'],
    [['duong', 'README.md', '--goi-goc', banSaoGoi, '--vai', 'dieu-phoi'], `bo-cuc: ${banSaoGoi}: plugin «roadmap» không mang vai «dieu-phoi»`],
  ];
  for (const [a, cau] of sai) {
    const x = chay(...a);
    if (x.status !== 2 || x.stdout !== '' || !x.stderr.startsWith(cau)) lech.push(`${a.slice(2).join(' ')}: mã ${x.status}, stderr «${x.stderr.trim()}»`);
  }
  lech.length ? bad('BC-CLI-GOI', lech.join(' · ')) : ok('BC-CLI-GOI', `--goi-goc --vai: ${dung.length} đường trong gói mã 0, ${sai.length} lỗi stderr mã 2`);
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nbo-cuc: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
