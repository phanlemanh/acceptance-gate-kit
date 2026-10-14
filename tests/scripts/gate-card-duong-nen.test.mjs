// Lưới hồ sơ thuoc-co-cua AC-8: khối «Nền hạ tầng» trên thẻ Cổng Phạm vi.
// Seam bên-VIẾT → bên-ĐỌC: MỌI `duong-nen.md` ở đây do CHÍNH feature-loop/scripts/duong-nen.mjs
// ghi trên kho fixture code-sinh (tests/scripts/duong-nen-fixture.mjs) — không tệp nào viết tay
// theo khuôn bên đọc. Ca GN5 đổi khuôn dòng đỏ ở BÊN VIẾT (bản sao khuôn, truyền qua --ag-root)
// và đòi phép kiểm GN2 đỏ: dòng đỏ trên thẻ được ghim bằng chữ độc lập, không chép từ tệp.
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { KIT, dungKho, dungCache, chayNen, tamDir, donDep } from './duong-nen-fixture.mjs';

const GC = path.join(KIT, 'scripts', 'gate-card.js');
const SRC = readFileSync(GC, 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
// Hai chữ cờ rút từ hằng của bên đọc (một nguồn); chữ dòng đỏ thì ghim ĐỘC LẬP ở GN2.
const hang = ten => { const m = SRC.match(new RegExp(`const ${ten} = '([^']+)';`)); return m ? m[1] : die(`gate-card.js thieu hang ${ten}`); };
const NEN_DO = hang('NEN_DO_FLAG');
const NEN_VANG = hang('NEN_VANG_FLAG');
const LAB = 'Nền hạ tầng (máy kiểm trước khi vòng viết gì)';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CONTRACT = `---
schema_version: 1
feature: F
slug: demo
risk_tier: T2
surfaces: [cli]
status: draft
---

## Criteria

- AC-1: Given a, When b, Then c.

## Coverage

- trục A [thước CE: x].

## Out of scope

- x.
`;
const EVALS = `evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.a
    expected: xanh
`;
// Sau khi đường nền đã ghi tệp: dựng hợp đồng đủ khuôn để thẻ Cổng 1 vẽ được.
const hoSo = dir => {
  writeFileSync(path.join(dir, '_acceptance', 'demo', 'contract.md'), CONTRACT);
  writeFileSync(path.join(dir, '_acceptance', 'demo', 'evals.yaml'), EVALS);
};
const the = (dir, extra = []) => {
  const r = spawnSync(process.execPath, [GC, '--root', dir, '--slug', 'demo', ...extra], { encoding: 'utf8' });
  if (r.status !== 0) die(`gate-card thoat ${r.status}: ${(r.stderr || '').slice(0, 300)}`);
  return r.stdout.replace(/\x1b\[[0-9;]*m/g, '');
};

const CACHE = dungCache();
const CONFIG_THIEU = 'schema_version: 1\nexecutors:\n  test:\n    a: "khong-co-lenh-nay-xyz --x"\n    b: "bash suite-b.sh"\nfeature_loop:\n  suite_keys:\n    - executors.test.b\n';
const DONG_DO_GHIM = 'nen cong-cu: THIEU khong-co-lenh-nay-xyz (khoa executors.test.a)';

// Phép kiểm GN2 là HÀM để GN5 chạy lại nó trên bên viết đã đột biến.
function kiemGN2(agRoot) {
  const kho = dungKho({ config: CONFIG_THIEU });
  const r = chayNen(kho, { cache: CACHE, agRoot });
  if (r.code !== 1 || !r.tep) return `duong-nen khong ghi tep nen do (ma ${r.code}): ${r.stderr.slice(0, 200)}`;
  hoSo(kho.dir);
  const h = the(kho.dir);
  if (!h.includes(LAB)) return 'the khong co khoi Nen ha tang';
  if (!h.includes(esc(DONG_DO_GHIM))) return `the khong in nguyen van dong do «${DONG_DO_GHIM}»`;
  if (!h.includes(esc(NEN_DO))) return 'the thieu co nen do';
  return null;
}

check('GN1 nen xanh do chinh duong-nen ghi — the co khoi Nen ha tang bon chan, khong co', () => {
  const kho = dungKho();
  const r = chayNen(kho, { cache: CACHE });
  if (r.code !== 0 || !r.tep) die(`doi chung duong hong: duong-nen ma ${r.code}: ${r.stderr.slice(0, 200)}`);
  hoSo(kho.dir);
  const h = the(kho.dir);
  if (!h.includes(LAB)) die('thieu khoi Nen ha tang');
  if (!h.includes('Nền: <b>xanh</b>')) die('khoi khong in nen xanh');
  for (const c of ['công cụ xanh', 'bộ kiểm xanh', 'lưới như CI', 'bộ máy']) if (!h.includes(c)) die(`khoi thieu chan «${c}»`);
  if (h.includes(esc(NEN_DO)) || h.includes(esc(NEN_VANG))) die('the co co tren nen xanh');
});

check('GN2 chieu do cung fixture doi mot executor sang lenh khong co — khoi in nguyen van dong do ben viet va co nen do', () => {
  const loi = kiemGN2(KIT);
  if (loi) die(loi);
});

check('GN3 doc-cu — ho so khong co duong-nen.md: the van dung, ma 0, dung mot co vang noi ca hai kha nang', () => {
  const kho = dungKho();
  hoSo(kho.dir);
  const h = the(kho.dir);
  if (h.includes(LAB)) die('the in khoi Nen ha tang khi khong co tep');
  const n = h.split(esc(NEN_VANG)).length - 1;
  if (n !== 1) die(`co vang xuat hien ${n} lan, can 1`);
  if (!NEN_VANG.includes('sinh trước bản này') || !NEN_VANG.includes('chưa chạy xong')) die('chu co vang khong noi du hai kha nang');
});

check('GN4 round-trip — bon gia tri chan the doc ra bang dung bon gia tri script ghi', () => {
  const kho = dungKho({ config: CONFIG_THIEU });
  const r = chayNen(kho, { cache: CACHE });
  if (!r.tep) die('duong-nen khong ghi tep');
  // Đọc tệp ĐỘC LẬP với bên đọc của thẻ: từng dòng khoá của frontmatter.
  const giaTri = k => { const m = r.tep.match(new RegExp(`^${k}:\\s*(\\S+)`, 'm')); return m ? m[1] : die(`tep khong co khoa ${k}`); };
  hoSo(kho.dir);
  const out = spawnSync(process.execPath, [GC, '--root', kho.dir, '--slug', 'demo', '--extract'], { encoding: 'utf8' });
  const nen = JSON.parse(out.stdout).nen;
  for (const k of ['nen', 'cong_cu', 'suite', 'luoi', 'engine']) {
    if (nen[k] !== giaTri(k)) die(`chan ${k}: the doc «${nen[k]}», tep ghi «${giaTri(k)}»`);
  }
  if (!nen.do.includes(DONG_DO_GHIM)) die(`extract khong mang dong do ${DONG_DO_GHIM}`);
});

check('GN5 chieu do cua seam — doi khuon dong do o ben viet thi GN2 do', () => {
  const ag = tamDir('gn5-ag-');
  for (const d of ['lib', 'scripts', 'commands', 'skills']) cpSync(path.join(KIT, d), path.join(ag, d), { recursive: true });
  mkdirSync(path.join(ag, 'feature-loop'), { recursive: true });
  cpSync(path.join(KIT, 'feature-loop', 'scripts'), path.join(ag, 'feature-loop', 'scripts'), { recursive: true });
  const f = path.join(ag, 'skills', 'acceptance', 'references', 'duong-nen-template.md');
  const src = readFileSync(f, 'utf8');
  const KIM = '`nen cong-cu: THIEU {tu} (khoa {khoa})`';
  if (src.split(KIM).length - 1 !== 1) die('kim khuon cong-cu-thieu khong khop dung mot lan trong khuon that');
  writeFileSync(f, src.replace(KIM, '`nen cong-cu: VANG {tu} (khoa {khoa})`'));
  const loi = kiemGN2(ag);
  if (!loi) die('doi khuon dong do o ben viet ma GN2 van xanh — seam khong co rang');
  if (!/khong in nguyen van dong do/.test(loi)) die('GN2 do vi ly do khac: ' + loi);
});

// ── GN-TV* — hồ sơ nen-khong-tinh-tep-cua-vong AC-7: thẻ đọc mục «Dòng vàng» do CHÍNH script ghi ──
const NEN_VANG_LAB = hang('NEN_VANG_LAB');
const unesc = s => String(s).replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
const mucVang = tep => { const d = String(tep).split('\n'); const i = d.findIndex(l => l === '## Dòng vàng'); if (i < 0) return null; const sau = d.slice(i + 1); const j = sau.findIndex(l => /^#{1,6}\s/.test(l)); return (j < 0 ? sau : sau.slice(0, j)).filter(l => l.startsWith('- ')).map(l => l.slice(2)).filter(l => l !== 'không có'); };
// Dòng in dưới nhãn vàng: các <p class="li"> sau nhãn tới hết khối Nền hạ tầng.
const dongDuoiNhan = h => {
  const i = h.indexOf(esc(NEN_VANG_LAB)); if (i < 0) return null;
  const khoi = h.slice(i, h.indexOf('</div>', i));
  return [...khoi.matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(m => unesc(m[1])).filter(t => !t.includes(NEN_VANG_LAB));
};
const ghiTV = (...ds) => ds.map(d => `mkdir -p "$(dirname '${d}')" && echo x > '${d}'\n`).join('');
const KHO_GN = {
  tv1: () => dungKho({ giuaA: ghiTV('_acceptance/demo/a.md', '_acceptance/demo/b.md') }),
  tv4: () => dungKho({ giuaA: 'echo sua >> README.md\n' + ghiTV('_acceptance/demo/a.md') }),
};
check('GN-TV1 the Cong 1 in nguyen van muc vang duoi nhan rieng; nen chi do khi co dong do', () => {
  for (const [ca, coDo] of [['tv1', false], ['tv4', true]]) {
    const kho = KHO_GN[ca](); const r = chayNen(kho, { cache: CACHE });
    if (!r.tep) die(`${ca}: duong-nen khong ghi tep`);
    const want = mucVang(r.tep);
    if (!want || !want.length) die(`${ca}: fixture khong sinh dong vang nao — ${r.tep.slice(-300)}`);
    hoSo(kho.dir);
    const h = the(kho.dir);
    const got = dongDuoiNhan(h);
    if (!got) die(`${ca}: the khong co nhan «${NEN_VANG_LAB}»`);
    if (JSON.stringify([...got].sort()) !== JSON.stringify([...want].sort())) die(`${ca}: dong duoi nhan ${JSON.stringify(got)} ≠ muc vang ${JSON.stringify(want)}`);
    if (!h.includes(`${esc(NEN_VANG_LAB)} (${want.length})`)) die(`${ca}: nhan thieu so dem (${want.length})`);
    if (h.includes(esc(NEN_DO)) !== coDo) die(`${ca}: co nen do ${coDo ? 'phai co' : 'khong duoc co'}`);
  }
});
check('GN-TV2 doc-cu — duong-nen.md do ban goc v2.30.0 ghi: khoi Nen ha tang cua the ban vong BANG the ban goc, khong nhan vang', () => {
  const goc = tamDir('gn-tv2-goc-');
  const ar = spawnSync('bash', ['-c', `git -C "$1" archive v2.30.0 feature-loop skills commands lib scripts | tar -x -C "$2"`, '_', KIT, goc], { encoding: 'utf8' });
  if (ar.status !== 0) die(`khong rut duoc ban goc v2.30.0: ${(ar.stderr || '').slice(0, 200)}`);
  const kho = dungKho({ giuaA: 'echo sua >> README.md\n' });
  const r = chayNen(kho, { cache: CACHE, script: path.join(goc, 'feature-loop', 'scripts', 'duong-nen.mjs'), agRoot: goc });
  if (!r.tep || r.tep.includes('## Dòng vàng')) die('ban goc phai ghi tep khong co muc vang');
  hoSo(kho.dir);
  const khoi = h => { const i = h.indexOf(LAB); return i < 0 ? null : h.slice(i, h.indexOf('</div></div>', i)); };
  const sau = khoi(the(kho.dir));
  const rg = spawnSync(process.execPath, [path.join(goc, 'scripts', 'gate-card.js'), '--root', kho.dir, '--slug', 'demo'], { encoding: 'utf8' });
  const truoc = khoi(String(rg.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''));
  if (!sau || !truoc) die(`thieu khoi Nen ha tang (sau ${!!sau}, truoc ${!!truoc})`);
  if (sau.includes(esc(NEN_VANG_LAB))) die('the ban vong in nhan vang tren tep doi truoc');
  if (sau !== truoc) die(`khoi lech ban goc:\n  goc: ${truoc.slice(0, 300)}\n  sau: ${sau.slice(0, 300)}`);
});

donDep();
console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-duong-nen)`);
process.exit(failed ? 1 : 0);
