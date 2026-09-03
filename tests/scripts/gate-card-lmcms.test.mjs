// Lưới thường trực của hồ sơ loi-moi-cong-may-sinh (2.7): cờ fail-quiet của
// thẻ, cột SẼ/KHÔNG, luật rơi bậc, câu gộp máy-sinh, bảng định tuyến.
// Fixture CODE-SINH trong chính lần chạy; mọi chuỗi ghim RÚT từ hằng của
// scripts/gate-card.js (khuôn gmpick) — không gõ literal ở phía test.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
import { ROOT as FX_ROOT, GC, SRC, mkWs, card, extract, CONTRACT_G2, EVALS, REPORT_PASS, G2, ITEM, OOC, G1, PROBE, LEDGER, REVIEW2, G2FULL } from './gate-fixture.mjs';
// Rút hằng QUA MARKER, không phải qua regex tên hằng: AC-1 khai «rút từ hằng có
// marker ONE-SHOT-CMD», nên xoá marker phải làm ca ĐỎ. Bản đầu chỉ dò
// `^const <TÊN> =` nên marker là trang trí (S4-r1 M7 xoá marker vẫn XANH).
const blockOf = marker => {
  const m = SRC.match(new RegExp(`<<<${marker}[^\\n]*\\n([\\s\\S]*?)\\n// ${marker}>>>`));
  if (!m) throw new Error('gate-card.js thieu khoi marker ' + marker);
  return m[1];
};
const pickIn = (marker, name) => {
  const m = blockOf(marker).match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm'));
  if (!m) throw new Error(`hang ${name} khong nam trong khoi marker ${marker}`);
  return m[1];
};
const pick = name => {
  const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm'));
  if (!m) throw new Error('gate-card.js khong khai hang ' + name);
  return m[1];
};
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };



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
  // ĐẲNG THỨC như LM15 (Cổng 1): S4-r3 M10 thêm đuôi vào one_shot Cổng 2 mà
  // `includes` vẫn xanh — cùng lớp vòng 2 đã vá ở Cổng 1, bản sao cách 80 dòng
  // không được quét. Rút đúng dòng lệnh trên thẻ rồi so từng ký tự.
  const m = html.match(/Dòng lệnh[^<]*<b>([^<]*)<\/b>/);
  if (!m) die('the Cong 2 khong in dong lenh may sinh');
  if (m[1] !== j.one_shot) die(`HTML Cong 2 lech --extract\n  html: ${m[1]}\n  ext : ${j.one_shot}`);
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

// ── Task 8: quét TRỌN xưởng — cờ oan không được xanh lén (E11) ──
// KHUÔN (owner quyết 03/09, hồ sơ vu-trang-goal-luc-goi-ten sau ba lần tái phạm): hai bản ghi mốc
// quét kho chỉ ghim hồ sơ ĐÃ CHỐT — có chữ ký người trong evidence-report. Hồ sơ đang mở đổi trạng
// thái hợp lệ (draft→implemented→BLOCKED→PENDING→…) nên routing/cờ của nó đổi theo; ghim nó là
// ghim thứ SẼ ĐỔI (lớp «thước ghim vào thứ sẽ đổi»). Hồ sơ đang mở được phủ bằng fixture code-sinh.
// Hai file mốc sống ở tests/scripts/fixtures/ (không trong hồ sơ đã ký → hết thuế ghim lại).
const FIX = path.join(ROOT, 'tests', 'scripts', 'fixtures');
// «Đã chốt» đọc từ CHỮ KÝ NGƯỜI trong evidence-report (human_signoff khác rỗng) — không đọc bảng chữ status
// (bộ đọc status là tập đóng do hồ sơ ra-co-ten-lam-va-trao canh; RT13 không cho mọc bộ đọc lạ).
const settled = slug => { try { const m = readFileSync(path.join(ROOT, '_acceptance', slug, 'evidence-report.md'), 'utf8').match(/^human_signoff:[ \t]*(\S.*)$/m)   /* [ \t]* — KHÔNG \s*: \s nuốt xuống dòng, chữ ký rỗng khớp dòng kế */; return !!m && m[1].trim().length > 0; } catch { return false; } };
// Baseline đã ĐỊNH ĐOẠT từng dòng (sweep-baseline.txt). Ca này giữ nó: một cờ
// vàng MỚI ở bất kỳ hồ sơ nào — kể cả hồ sơ đã có tên trong baseline — đều
// lệch, vì baseline ghi cả LOẠI cờ chứ không chỉ slug.
check('LM13 quet xuong: tap (slug, loai co) == baseline da dinh doat', () => {
  const base = readFileSync(path.join(FIX, 'sweep-baseline.txt'), 'utf8')
    .split('\n').filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('\t').slice(0, 2).join('\t')).sort();
  const acc = path.join(ROOT, '_acceptance');
  const got = [];
  for (const slug of readdirSync(acc)) {
    if (!existsSync(path.join(acc, slug, 'contract.md'))) continue;
    if (!settled(slug)) continue;   // hồ sơ đang mở: không ghim (khuôn 03/09)
    const r = spawnSync('node', [GC, '--root', ROOT, '--slug', slug, '--extract'], { encoding: 'utf8' });
    if (r.status !== 0) continue;
    let j; try { j = JSON.parse(r.stdout); } catch { continue; }
    const o = j.out_of_contract || {};
    const kinds = new Set();
    if (o.suspect_empty) kinds.add('suspect_empty');
    for (const x of (o.findings || [])) if (x.proposal_raw && !x.proposal) kinds.add('token-la');
    if (j.roi_bac && j.roi_bac.on) kinds.add('roi-bac');
    for (const k of kinds) got.push(slug + '\t' + k);
  }
  got.sort();
  if (JSON.stringify(got) !== JSON.stringify(base)) {
    die('lech baseline\n  got: ' + JSON.stringify(got) + '\n base: ' + JSON.stringify(base));
  }
});

// ── S4-r3 chẩn đoán gốc: 100% hồi quy định tuyến hai vòng lộ ở XƯỞNG THẬT, 0% ở
// fixture — vì không phép đo nào canh «mỗi hồ sơ mời người trả lời bao nhiêu
// ô». Baseline này là bản ghi mốc ĐỊNH TUYẾN, cùng hình dạng sweep-baseline.txt.
check('LM20 quet xuong: routing (hoi|bao) tung ho so == routing-baseline da dinh doat', () => {
  const base = readFileSync(path.join(FIX, 'routing-baseline.txt'), 'utf8')
    .split('\n').filter(l => l.trim() && !l.startsWith('#')).sort();
  const acc = path.join(ROOT, '_acceptance');
  const got = [], crashed = [];
  for (const slug of readdirSync(acc)) {
    if (!existsSync(path.join(acc, slug, 'contract.md'))) continue;
    if (!settled(slug)) continue;   // hồ sơ đang mở: không ghim (khuôn 03/09)
    const r = spawnSync('node', [GC, '--root', ROOT, '--slug', slug, '--extract'], { encoding: 'utf8' });
    let j; try { j = JSON.parse(r.stdout); } catch { j = null; }
    // Hồ sơ làm bộ dựng thẻ sập KHÔNG được bỏ qua im lặng (Ngoài-hợp-đồng r1/r2/r3).
    if (r.status !== 0 || !j) { crashed.push(slug); continue; }
    const rt = j.routing || { hoi: [], bao: [] };
    got.push(slug + '\thoi=' + (rt.hoi || []).join('|') + '\tbao=' + (rt.bao || []).join('|'));
  }
  if (crashed.length) die('bo dung the SAP tren ho so that: ' + crashed.join(', '));
  got.sort();
  if (JSON.stringify(got) !== JSON.stringify(base)) {
    const gs = new Set(got), bs = new Set(base);
    die('lech routing-baseline\n  +got : ' + got.filter(x => !bs.has(x)).join('\n         ') + '\n  -base: ' + base.filter(x => !gs.has(x)).join('\n         '));
  }
});

// ── S4-r1: ba nhánh trước đây KHÔNG có răng (đột biến của phiên soi đều XANH) ──
check('LM14 hang ONE-SHOT-CMD nam TRONG marker (xoa marker -> do)', () => {
  const a = pickIn('ONE-SHOT-CMD', 'ONE_SHOT_CMD_APPROVE');
  const b = pickIn('ONE-SHOT-CMD', 'ONE_SHOT_CMD_SIGNOFF');
  if (!a.startsWith('/acceptance-gate:') || !b.startsWith('/acceptance-gate:')) die(`ten lenh thieu tien to plugin: ${a} · ${b}`);
});
check('LM15 round-trip HTML<->extract cho CONG 1 (khong chi Cong 2)', () => {
  const r = mkWs('g', G1(PROBE('findings')));
  const j = extract(r, 'g', ['--gate', '1']);
  const html = spawnSync('node', [GC, '--root', r, '--slug', 'g', '--gate', '1'], { encoding: 'utf8' }).stdout;
  // ĐẲNG THỨC, không phải phép CHỨA: `includes` để lọt mọi kiểu trôi bằng thêm
  // đầu/thêm đuôi — hình dạng dễ xảy ra nhất khi ai đó nối chú thích vào dòng
  // lệnh (S4-r2 chứng: thêm « XXLECH» vẫn xanh).
  const m = html.match(/Dòng lệnh[^<]*<b>([^<]*)<\/b>/);
  if (!m) die('the Cong 1 khong in dong lenh may sinh');
  if (m[1] !== j.one_shot) die(`HTML Cong 1 lech --extract\n  html: ${m[1]}\n  ext : ${j.one_shot}`);
});
check('LM16 the Cong 1 co CO DO -> KHONG dien san (nhanh g1Blocked co rang)', () => {
  // Cờ đỏ dùng ở đây: «khai KHÔNG ĐO ĐƯỢC nhưng hợp đồng có mặt người dùng» —
  // lối không-đo-được chỉ dành cho vòng không có người dùng cuối. Tiền tố rút
  // từ chính khuôn ô cơ hội, không gõ literal.
  const NG1 = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs'));
  const kd = NG1.prefixes(readFileSync(path.join(ROOT, 'skills/acceptance/references/opportunity-template.md'), 'utf8')).khongDo;
  const f = G1(PROBE('findings'));
  f['contract.md'] = f['contract.md'].replace('surfaces: [cli]', 'surfaces: [ui]');
  f['opportunity.md'] = `---\nschema_version: 1\nslug: g\nstage: decided\ndecision: build\n---\n\n## ${NG1.UAT_THRESHOLD_HEADING}\n\n- ${kd} vòng này không có người dùng cuối.\n`;
  const j = extract(mkWs('g', f), 'g', ['--gate', '1']);
  if (!j.one_shot.endsWith('___')) die('the co diem mu van dien san: ' + j.one_shot);
  const clean0 = extract(mkWs('g2', G1(PROBE('findings'))), 'g2', ['--gate', '1']);   // sạch: surfaces cli, không ô cơ hội
  if (!clean0.one_shot.endsWith('duyệt')) die('doi chung duong: the sach lai KHONG dien san: ' + clean0.one_shot);
});
check('LM17 dieu khoan AC-8 co mat o NGUON va CA HAI ban chep', () => {
  // ĐO QUAN HỆ, không đo từ vựng: rút MỆNH ĐỀ ở nguồn qua marker rồi đòi hai bản
  // chép khai CÙNG MỘT LUẬT. Bản trước chỉ dò hai cụm chữ có mặt, nên một bản
  // chép đổi «ghi thẳng» thành «VẪN CHỜ XÁC NHẬN» — ngược hẳn nguồn — vẫn xanh,
  // vì cụm kia còn khớp một chỗ khác trong cùng file (S4-r2).
  const LAW = path.join(ROOT, 'skills/acceptance/references/human-facing-language.md');
  const src = readFileSync(LAW, 'utf8');
  const mm = src.match(/<!-- <<<IDENTITY-ECHO-RULE -->\n([\s\S]*?)\n<!-- IDENTITY-ECHO-RULE>>> -->/);
  if (!mm) die('ban luat thieu khoi marker IDENTITY-ECHO-RULE');
  const rule = mm[1].trim();
  if (!/khớp tuyệt đối/i.test(rule) || !/ghi thẳng/i.test(rule)) die('menh de nguon mat mot trong hai ve');
  for (const p of ['commands/approve.md', 'commands/signoff.md']) {
    const t2 = readFileSync(path.join(ROOT, p), 'utf8');
    const m2 = t2.match(/<!-- <<<IDENTITY-ECHO-RULE -->\n([\s\S]*?)\n<!-- IDENTITY-ECHO-RULE>>> -->/);
    if (!m2) die('ban chep thieu khoi marker IDENTITY-ECHO-RULE: ' + p);
    if (m2[1].trim() !== rule) die('ban chep TROI khoi nguon (khong khop tung ky tu): ' + p);
  }
});
check('LM18 Treo LUON la dong bao — moi phuong ngu so quyet dinh cua xuong, khong suy tu hinh dang entry', () => {
  // Truy nguyên 02/09: Treo = máy đã quyết + ghi sổ + cửa veto mở → loại-1 →
  // dòng báo (D2, AC-3, entry sổ 3002). Hai vòng S4 cháy vì thêm một bộ phân
  // loại theo entry mà hợp đồng không đòi (r2 theo `type`, r3 theo hình dạng).
  // Bốn phương ngữ dưới đây là bốn hình dạng THẬT trong xưởng đã làm ba hồ sơ
  // mọc ô hỏi; thêm bất kỳ suy diễn nào theo entry thì ít nhất một ca đỏ.
  const dialects = {
    'chi-loi-quyet-impact-rong':      '{"id":"d-9","type":"fix","stage":"S4-r1","at":"2026-09-01T02:00:00Z","decision":"co loi quyet","impact":""}',
    'loai-la-ngoai-thiet-ke':         '{"id":"d-9","type":"gate2","stage":"S4-r1","at":"2026-09-01T02:00:00Z","decision":"loai la","impact":"x"}',
    'chu-ky-nguoi-trong-decision':    '{"id":"d-9","type":"approach","stage":"gate2","decision":"Cổng 2 — ĐỒNG Ý CẮT. Phạm vi giao là…","decided_by":"Manh Phan","decided_at":"2026-08-22T00:00:00Z"}',
    'phuong-ngu-what-why-khong-decision': '{"ts":"2026-08-30T00:00:00Z","type":"descope","by":"agent","what":"bo coverage-scan","why":"moc phat hanh khong co ho so co hoi"}',
    'serves-mang-rong':               '{"id":"d-9","type":"descope","stage":"S2","at":"2026-09-01T02:00:00Z","decision":"bo duong-do","serves":[]}',
  };
  let i = 0;
  for (const [name, line] of Object.entries(dialects)) {
    const f = G2FULL(); f['decisions.jsonl'] = LEDGER + line + '\n';
    const j = extract(mkWs('s3' + (i++), f), 's3' + (i - 1));
    if (!j.routing.bao.includes('Treo') || j.routing.hoi.includes('Treo')) die(name + ': Treo bi keo ve O HOI — co suy dien theo entry: ' + JSON.stringify(j.routing));
    if (!/Treo: phê hết/.test(j.one_shot)) die(name + ': one_shot khong dien san «Treo: phê hết»: ' + j.one_shot);
  }
  // Đối chứng dương của chính phép đo: không có Treo thì nhãn không xuất hiện ở đâu cả.
  const f0 = G2FULL(); f0['decisions.jsonl'] = LEDGER;
  const j0 = extract(mkWs('s3z', f0), 's3z');
  const hasTreo = j0.decisions_provisional && j0.decisions_provisional.length;
  if (!hasTreo && (j0.routing.bao.includes('Treo') || /Treo:/.test(j0.one_shot))) die('khong co Treo ma van in nhan Treo');
});
check('LM18c the CHUA-KY-DUOC: routing RONG, khop voi «khong can lam gi» tren HTML', () => {
  const f = G2FULL();
  f['evidence-report.md'] = REPORT_PASS.replace('verdict: PASS', 'verdict: REJECT').replace('| E1 | AC-1 | test | PASS |', '| E1 | AC-1 | test | FAIL |');
  const r = mkWs('s6', f);
  const j = extract(r, 's6');
  if (j.one_shot !== null) die('the khong ky duoc van co one_shot');
  if (j.routing.hoi.length || j.routing.bao.length) die('HTML noi «khong can lam gi» ma routing khai viec: ' + JSON.stringify(j.routing));
  const html = spawnSync('node', [GC, '--root', r, '--slug', 's6'], { encoding: 'utf8' }).stdout;
  if (!html.includes('không cần làm gì')) die('the khong-ky-duoc mat cau «khong can lam gi»');
});
check('LM19 khoi VIEC-CUA-ANH tren THE dung dung bo o hoi cua routing', () => {
  const r = mkWs('s', G2FULL());
  const j = extract(r, 's');
  const html = spawnSync('node', [GC, '--root', r, '--slug', 's'], { encoding: 'utf8' }).stdout;
  const m = html.match(/Trả lời mẫu[^«]*«([^»]*)»/);
  if (!m) die('the khong co dong Tra loi mau');
  const labels = m[1].split(';').map(x => x.split(':')[0].trim()).filter(Boolean);
  if (JSON.stringify(labels) !== JSON.stringify(j.routing.hoi)) {
    die('dong mau tren THE lech routing.hoi\n  the: ' + JSON.stringify(labels) + '\n  ext: ' + JSON.stringify(j.routing.hoi));
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-lmcms)`);
process.exit(failed ? 1 : 0);
