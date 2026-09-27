// tests/scripts/cong-dang-truoc-pham-vi.test.mjs — thứ tự cổng Đáng → Phạm vi + lối ký Cổng Đáng.
//
// Ca thật 27/09 (kho crm, hồ sơ khep-ky-okr): ô cơ hội `stage: discovery`, `decision:` trống,
// ngưỡng mang tiền tố đề xuất, và vòng làm đã sinh contract.md nháp cùng lượt. Bộ quét vào phiên
// xếp hồ sơ vào «chờ Cổng Phạm vi» — bỏ qua Cổng Đáng — và không có lối ký Cổng Đáng có tên nào.
//
// Fixture CODE-SINH từ khuôn (OPP-FRONTMATTER-TEMPLATE · CONTRACT-FRONTMATTER-TEMPLATE · bullet
// Ngưỡng · tiền tố OPP-DE-XUAT-PREFIX, tất cả rút từ references/ lúc chạy). Chạy script THẬT.
// Chiều đỏ NẰM TRONG bộ kiểm: mỗi ca có ít nhất một đột biến trên bản sao cây plugin, mũi tiêm
// phải chứng minh nó đổi được tệp, và phép đo phải ĐỎ trên bản đột biến. Chiều im: các hàng
// «không phải ca này» trong ma trận (không ô cơ hội · ô đã quyết · ô hỏng) phải giữ ô cũ.
//   CD_CASES=CD1,CD3 node tests/scripts/cong-dang-truoc-pham-vi.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const REF = path.join(ROOT, 'skills', 'acceptance', 'references');
const OPP_TPL = path.join(REF, 'opportunity-template.md');
const CON_TPL = path.join(REF, 'contract-template.md');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
const { frontmatterField } = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const { NAV_RULES } = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
const NG = require(path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs'));

const ALL_IDS = ['CD1', 'CD2', 'CD3', 'CD4', 'CD5', 'CD6'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.CD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
let failures = 0;
const pass = (id, m) => console.log(`PASS: [${id}] ${m}`);
const fail = (id, m) => { console.log(`FAIL: [${id}] ${m}`); failures++; };
const dirs = [];
const tmp = () => { const d = mkdtempSync(path.join(tmpdir(), 'cd-')); dirs.push(d); return d; };
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const R = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);

// ── Bản sao cây plugin để đột biến. Mỗi mũi tiêm PHẢI đổi được tệp — mũi tiêm câm là chiều đỏ giả.
const plugin = (mut = {}) => {
  const r = tmp();
  for (const d of ['scripts', 'lib', 'skills/acceptance/references', 'commands']) cpSync(path.join(ROOT, d), path.join(r, d), { recursive: true });
  // mut: { '<tệp>': [tu, sang] } hoặc { '<tệp>': [[tu, sang], ...] } — nhiều mũi trên cùng tệp.
  for (const [rel, v] of Object.entries(mut)) {
    for (const [tu, sang] of (Array.isArray(v[0]) ? v : [v])) {
      const p = path.join(r, rel), s = readFileSync(p, 'utf8');
      if (!s.includes(tu)) throw new Error(`mũi tiêm không tìm thấy chuỗi trong ${rel}: ${tu.slice(0, 60)}`);
      const t = s.split(tu).join(sang);
      if (t === s) throw new Error(`mũi tiêm không đổi được ${rel}`);
      writeFileSync(p, t);
    }
  }
  return r;
};
const THAT = ROOT;
const run = (pl, script, args) => spawnSync(process.execPath, [path.join(pl, 'scripts', script), ...args], { encoding: 'utf8' });
const scan = (root, pl = THAT) => {
  const r = run(pl, 'start-scan.mjs', ['--root', root]);
  if (r.status !== 0) throw new Error(`start-scan chết (${r.status}): ${r.stderr}`);
  return JSON.parse(r.stdout);
};
const renderMap = (root, pl = THAT) => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e',
    'const m = await import(process.env.M); process.stdout.write(m.renderProductMap(process.env.R));'],
    { encoding: 'utf8', env: { ...process.env, M: path.join(pl, 'scripts', 'product-map.mjs'), R: root } });
  if (r.status !== 0 || !r.stdout.startsWith('# ')) throw new Error(`bản đồ không dựng được: ${r.stderr}`);
  return r.stdout;
};
const ky = (root, args, pl = THAT) => run(pl, 'ky-cong-dang.mjs', ['--root', root, ...args]);

// ── Fixture rút từ khuôn.
const oppTplTxt = readFileSync(OPP_TPL, 'utf8');
const DE_XUAT = NG.prefixes(oppTplTxt).deXuat;
const NHAN = NG.thresholdLabels(oppTplTxt);
const nguong = mode => `\n## ${NG.UAT_THRESHOLD_HEADING}\n\n` + NHAN.map(lb =>
  `- ${lb}: ${mode === 'trong' ? '…' : (mode === 'de-xuat' ? DE_XUAT + ' ' : '') + 'giá trị thật của ' + lb}`).join('\n') + '\n';
// Bảng giả định mang tiền tố đề xuất NGOÀI section Ngưỡng — bộ ghi không được chạm nó (chiều im).
const DONG_GIA_DINH = `| 1 | Người dùng cần | ${DE_XUAT} |`;
// Bullet mang tiền tố đề xuất ở section SAU Ngưỡng — bộ ghi phải dừng ở tiêu đề kế tiếp.
const DONG_SAU = `- Ghi chú: ${DE_XUAT} ngoài ngưỡng`;
const GIA_DINH = `\n## Giả định chốt sinh tử\n\n| # | Giả định | Trạng thái |\n|---|---|---|\n${DONG_GIA_DINH}\n`;
const opp = (slug, { stage = 'discovery', decision = '', mode = 'de-xuat' } = {}) => fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE',
  { slug, feature: `Ý ${slug}`, owner: 'o@x', stage, decision, decided_by: decision ? 'Người Cũ' : '', decided_at: decision ? '2026-09-01T00:00:00Z' : '', base_commit: '', disposition: '' },
  `\n## Vấn đề & ai gặp\n\nMột câu.\n${GIA_DINH}${nguong(mode)}\n## Cổng 0\n\n- **decision = …**\n${DONG_SAU}\n`);
const hopDong = slug => fileFromTemplate(CON_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
  { slug, feature: slug, owner: 'o@x', risk_tier: 'T2', surfaces: 'api', status: 'draft' }, '\n# fixture\n');

// Ma trận MỘT nguồn cho CD1/CD2: mọi hàng có hợp đồng NHÁP; chỉ ô cơ hội khác nhau.
// kq = [nhóm, stateKey, gate|null, tiêu đề mục bản đồ]
const MA_TRAN = [
  ['mo-de-xuat', { mode: 'de-xuat' }, ['gates', 'cho-cong-dang', 'dang', 'Đang cân nhắc cơ hội']],   // ca crm
  ['mo-trong', { mode: 'trong' }, ['gates', 'cho-cong-dang', 'dang', 'Đang cân nhắc cơ hội']],
  ['khong-o', null, ['gates', 'cho-cong-pham-vi', 'pham-vi', 'Chờ duyệt phạm vi']],                     // chiều im
  ['da-build', { stage: 'decided', decision: 'build', mode: 'chot' }, ['gates', 'cho-cong-pham-vi', 'pham-vi', 'Chờ duyệt phạm vi']],
  ['da-iterate', { stage: 'decided', decision: 'iterate', mode: 'chot' }, ['gates', 'cho-cong-pham-vi', 'pham-vi', 'Chờ duyệt phạm vi']],
  ['da-park', { stage: 'decided', decision: 'park', mode: 'chot' }, ['done', 'xep-lai', null, 'Xếp lại sau']],
  ['da-kill', { stage: 'decided', decision: 'kill', mode: 'chot' }, ['done', 'da-bac', null, 'Đã bác từ khám phá']],
  ['o-hong', { stage: 'lung-tung', mode: 'chot' }, ['gates', 'cho-cong-pham-vi', 'pham-vi', 'Chờ duyệt phạm vi']], // ô không đọc được → giữ ô cũ
];
const xuong = () => {
  const r = tmp(); W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  for (const [slug, o] of MA_TRAN) {
    W(r, `_acceptance/${slug}/contract.md`, hopDong(slug));
    if (o) W(r, `_acceptance/${slug}/opportunity.md`, opp(slug, o));
  }
  return r;
};
const kqQuet = j => MA_TRAN.map(([slug]) => {
  for (const [nhom, arr] of Object.entries(j.groups)) {
    const x = arr.find(e => e.slug === slug);
    if (x) return [slug, nhom, x.stateKey, x.gate || null];
  }
  return [slug, j.broken.some(b => b.slug === slug) ? 'broken' : 'vang', null, null];
});
const muonQuet = MA_TRAN.map(([slug, , k]) => [slug, k[0], k[1], k[2]]);
const mucBanDo = (txt, slug) => {
  let h = null;
  for (const l of txt.split('\n')) { if (l.startsWith('## ')) h = l.slice(3).trim(); if (l.includes('`' + slug + '`')) return h; }
  return null;
};
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

try {
  // ── CD1 bộ quét: ma trận toàn phần so BẰNG NHAU + hai đột biến (bộ quét · lib) phải đỏ.
  if (want('CD1')) {
    const x = xuong();
    const got = kqQuet(scan(x));
    if (!bang(got, muonQuet)) fail('CD1', `ma trận bộ quét lệch:\n  muốn ${JSON.stringify(muonQuet)}\n  được ${JSON.stringify(got)}`);
    else pass('CD1', `bộ quét xếp ${MA_TRAN.length} hàng đúng thứ tự cổng (ca crm → Cổng Đáng; 6 hàng chiều im giữ ô)`);
    const co = scan(x).groups.gates.find(g => g.slug === 'mo-trong');
    if (!co || !co.flags.includes('nguong-chua-chot')) fail('CD1', `ô chưa có ngưỡng thiếu cờ nguong-chua-chot: ${JSON.stringify(co)}`);
    else pass('CD1', 'ô chờ Cổng Đáng chưa có ngưỡng mang cờ nguong-chua-chot');
    for (const [ten, mut] of [
      ['bộ quét bỏ vị từ', { 'scripts/start-scan.mjs': ['oCoHoiTruocPhamVi(oD.t)', 'null'] }],
      ['lib bỏ nhánh chưa quyết', { 'lib/workspace-record.cjs': ["if (stage !== 'decided' || !decision) return 'cho-cong-dang';", ''] }],
    ]) {
      const m = kqQuet(scan(x, plugin(mut)));
      if (bang(m, muonQuet)) fail('CD1', `PHÉP ĐO MÙ: đột biến «${ten}» mà ma trận vẫn khớp`);
      else if (m[0][2] !== 'cho-cong-pham-vi') fail('CD1', `đột biến «${ten}» đỏ nhưng không ở hàng ca crm: ${JSON.stringify(m[0])}`);
      else pass('CD1', `đột biến «${ten}» → ca crm rơi lại Cổng Phạm vi, ma trận ĐỎ`);
    }
  }

  // ── CD2 bản đồ nói CÙNG ô với bộ quét trên cùng xưởng + đột biến bản đồ phải đỏ.
  if (want('CD2')) {
    const x = xuong();
    const muon = MA_TRAN.map(([slug, , k]) => [slug, k[3]]);
    const got = (map => MA_TRAN.map(([slug]) => [slug, mucBanDo(map, slug)]))(renderMap(x));
    if (!bang(got, muon)) fail('CD2', `bản đồ lệch:\n  muốn ${JSON.stringify(muon)}\n  được ${JSON.stringify(got)}`);
    else pass('CD2', `bản đồ đặt ${MA_TRAN.length} hàng đúng mục, khớp bộ quét`);
    const mp = plugin({ 'scripts/product-map.mjs': ['oCoHoiTruocPhamVi(oTxt)', 'null'] });
    const m = (map => MA_TRAN.map(([slug]) => [slug, mucBanDo(map, slug)]))(renderMap(x, mp));
    if (bang(m, muon)) fail('CD2', 'PHÉP ĐO MÙ: bản đồ bỏ vị từ mà vẫn khớp');
    else if (m[0][1] !== 'Chờ duyệt phạm vi') fail('CD2', `đột biến bản đồ đỏ sai hàng: ${JSON.stringify(m[0])}`);
    else pass('CD2', 'đột biến «bản đồ bỏ vị từ» → ca crm về «Chờ duyệt phạm vi», ĐỎ');
  }

  // ── CD3 bộ ghi: ký «làm» trên ca crm — ghi đúng bốn khoá, gỡ tiền tố CHỈ ở Ngưỡng, không đụng
  //    hợp đồng, nối đúng một dòng sổ; rồi bộ quét đưa hồ sơ sang Cổng Phạm vi (thứ tự cổng).
  if (want('CD3')) {
    const kiemKy = (x, r) => {
      const loi = [];
      const d = path.join(x, '_acceptance', 'mo-de-xuat');
      if (r.status !== 0) return [`thoát ${r.status}: ${r.stderr}`];
      const o = R(path.join(d, 'opportunity.md')), o0 = opp('mo-de-xuat', { mode: 'de-xuat' });
      for (const [k, v] of [['stage', 'decided'], ['decision', 'build'], ['decided_by', 'Chủ Kho'], ['decided_at', '2026-09-27T10:00:00Z']])
        if (frontmatterField(o, k) !== v) loi.push(`${k} = ${frontmatterField(o, k)} (muốn ${v})`);
      const ng = section(o, NG.UAT_THRESHOLD_HEADING).join('\n');
      if (ng.includes(DE_XUAT)) loi.push('section Ngưỡng còn tiền tố đề xuất');
      if (NG.thresholdState(o, oppTplTxt) !== 'chot') loi.push(`ngưỡng sau ký = ${NG.thresholdState(o, oppTplTxt)}`);
      // Đo thẳng DÒNG bảng, không qua section(): bộ cắt section khớp tiêu đề bằng `\b`, mà
      // «…sinh tử» kết bằng chữ có dấu nên `\b` không khớp và section trả rỗng (thước tự dối).
      if (!o.split('\n').includes(DONG_GIA_DINH)) loi.push('bảng giả định MẤT tiền tố — bộ ghi chạm ngoài section Ngưỡng');
      if (!o.split('\n').includes(DONG_SAU)) loi.push('bullet sau section Ngưỡng MẤT tiền tố — bộ ghi vượt ranh giới section');
      // Mọi dòng đổi phải thuộc bốn khoá frontmatter hoặc bullet Ngưỡng — không dòng nào khác.
      const a = o0.split('\n'), b = o.split('\n');
      if (a.length !== b.length) loi.push(`số dòng đổi ${a.length} → ${b.length}`);
      else a.forEach((l, i) => { if (l !== b[i] && !/^(stage|decision|decided_by|decided_at):/.test(l) && !NHAN.some(lb => l.startsWith(`- ${lb}:`))) loi.push(`dòng lạ bị đổi: ${l}`); });
      if (R(path.join(d, 'contract.md')) !== hopDong('mo-de-xuat')) loi.push('contract.md bị đụng');
      const so = R(path.join(d, 'decisions.jsonl')).split('\n').filter(Boolean);
      if (so.length !== 2) loi.push(`sổ có ${so.length} dòng (muốn 2)`);
      else { const e = JSON.parse(so[1]); if (e.type !== 'seal' || e.gate !== 0 || e.decision !== 'build' || e.by !== 'Chủ Kho') loi.push(`dòng sổ sai: ${so[1]}`); }
      const g = scan(x).groups.gates.find(e => e.slug === 'mo-de-xuat');
      if (!g || g.gate !== 'pham-vi') loi.push(`sau ký bộ quét xếp ${JSON.stringify(g)} (muốn pham-vi)`);
      return loi;
    };
    const mk = () => { const x = xuong(); W(x, '_acceptance/mo-de-xuat/decisions.jsonl', '{"id":"d-1","type":"approach"}\n'); return x; };
    const ARGS = ['--slug', 'mo-de-xuat', '--loi', 'làm', '--by', 'Chủ Kho', '--at', '2026-09-27T10:00:00Z'];
    const x = mk(); const loi = kiemKy(x, ky(x, ARGS));
    if (loi.length) fail('CD3', 'ký «làm»: ' + loi.join(' · ')); else pass('CD3', 'ký «làm» ghi đủ bốn khoá, gỡ tiền tố chỉ ở Ngưỡng, một dòng sổ, hồ sơ sang Cổng Phạm vi');
    // Không sổ → không tạo sổ.
    const y = xuong(); const ry = ky(y, ARGS);
    if (ry.status !== 0 || existsSync(path.join(y, '_acceptance', 'mo-de-xuat', 'decisions.jsonl')) || JSON.parse(ry.stdout).soGhi !== false)
      fail('CD3', `hồ sơ không có sổ mà bộ ghi tạo sổ / thoát ${ry.status}`); else pass('CD3', 'hồ sơ không có sổ → bộ ghi không tạo sổ');
    // Đột biến 1: bỏ bước gỡ tiền tố → lưới tự kiểm của bộ ghi phải CHẶN, không ghi gì.
    const p1 = plugin({ 'scripts/ky-cong-dang.mjs': ["if (CAN_NGUONG.has(decision) && ngTruoc === 'de-xuat') {", 'if (false) {'] });
    const x1 = mk(), t1 = R(path.join(x1, '_acceptance/mo-de-xuat/opportunity.md')), r1 = ky(x1, ARGS, p1);
    if (r1.status === 2 && r1.stderr.includes('tự kiểm hỏng') && R(path.join(x1, '_acceptance/mo-de-xuat/opportunity.md')) === t1)
      pass('CD3', 'đột biến «bỏ gỡ tiền tố» → bộ ghi tự chặn, tệp nguyên'); else fail('CD3', `đột biến «bỏ gỡ tiền tố» không bị tự kiểm chặn: ${r1.status} ${r1.stderr}`);
    // Đột biến 3 (chiều im): bỏ ranh giới section → bộ ghi gỡ cả bullet ở section sau; CD3 phải đỏ.
    const p3 = plugin({ 'scripts/ky-cong-dang.mjs': ['!/^#{1,2}\\s/.test(dong[i])', 'true'] });
    const x3 = mk(), l3 = kiemKy(x3, ky(x3, ARGS, p3));
    if (l3.some(e => e.includes('vượt ranh giới section'))) pass('CD3', 'đột biến «bỏ ranh giới section» → phép đo CD3 ĐỎ đúng lý do');
    else fail('CD3', `PHÉP ĐO MÙ: bỏ ranh giới section mà CD3 không đỏ đúng lý do (${l3.join(' · ') || 'xanh'})`);
    // Đột biến 2: bỏ cả gỡ tiền tố lẫn tự kiểm → CHÍNH phép đo CD3 phải đỏ.
    const p2 = plugin({ 'scripts/ky-cong-dang.mjs': [
      ["if (CAN_NGUONG.has(decision) && ngTruoc === 'de-xuat') {", 'if (false) {'],
      ["if (CAN_NGUONG.has(decision) && ngSau === 'de-xuat')", 'if (false)']] });
    const x2 = mk(), l2 = kiemKy(x2, ky(x2, ARGS, p2));
    // GỌI chính phép đo CD3 (không chép công thức): nó phải đỏ, và đỏ đúng vì tiền tố còn lại.
    if (l2.some(e => e.includes('section Ngưỡng còn tiền tố'))) pass('CD3', 'đột biến «bỏ gỡ tiền tố + tự kiểm» → phép đo CD3 ĐỎ đúng lý do');
    else fail('CD3', `PHÉP ĐO MÙ: đột biến kép mà phép đo CD3 không đỏ đúng lý do (${l2.join(' · ') || 'xanh'})`);
  }

  // ── CD4 chiều đỏ ngưỡng: «làm»/«lặp» trên ô chưa có ngưỡng → từ chối, tệp nguyên. Đối chứng
  //    dương TRƯỚC: cùng fixture «xếp lại»/«dừng» ký được (fixture không hỏng) và không gỡ tiền tố.
  if (want('CD4')) {
    const t = (x, s) => R(path.join(x, '_acceptance', s, 'opportunity.md'));
    let ok = true;
    for (const [loi, dec] of [['xếp lại', 'park'], ['dừng', 'kill']]) {
      const x = xuong(); const r = ky(x, ['--slug', 'mo-trong', '--loi', loi, '--by', 'Chủ Kho']);
      if (r.status !== 0 || frontmatterField(t(x, 'mo-trong'), 'decision') !== dec) { ok = false; fail('CD4', `đối chứng dương «${loi}» không ký được: ${r.status} ${r.stderr}`); }
      const y = xuong(); const ry = ky(y, ['--slug', 'mo-de-xuat', '--loi', loi, '--by', 'Chủ Kho']);
      if (ry.status !== 0 || !section(t(y, 'mo-de-xuat'), NG.UAT_THRESHOLD_HEADING).join('\n').includes(DE_XUAT)) { ok = false; fail('CD4', `«${loi}» gỡ tiền tố đề xuất (xếp lại/dừng không nhận ngưỡng)`); }
    }
    if (ok) pass('CD4', 'đối chứng dương: «xếp lại»/«dừng» ký được ô chưa có ngưỡng, không gỡ tiền tố đề xuất');
    for (const loi of ['làm', 'lặp']) {
      const x = xuong(); const t0 = t(x, 'mo-trong');
      const r = ky(x, ['--slug', 'mo-trong', '--loi', loi, '--by', 'Chủ Kho']);
      if (r.status === 2 && r.stderr.includes('ngưỡng chưa chốt') && t(x, 'mo-trong') === t0) pass('CD4', `«${loi}» trên ô chưa có ngưỡng → từ chối đúng thông điệp, tệp nguyên`);
      else fail('CD4', `«${loi}» trên ô chưa có ngưỡng: thoát ${r.status}, stderr ${r.stderr.trim()}`);
    }
    const p = plugin({ 'scripts/ky-cong-dang.mjs': ["if (CAN_NGUONG.has(decision) && ngTruoc === 'chua-chot')", 'if (false)'] });
    const x = xuong(); const r = ky(x, ['--slug', 'mo-trong', '--loi', 'làm', '--by', 'Chủ Kho'], p);
    if (r.status === 0) pass('CD4', 'đột biến «bỏ chốt ngưỡng» → «làm» lọt, phép đo từ chối ĐỎ');
    else fail('CD4', `PHÉP ĐO MÙ: bỏ chốt ngưỡng mà vẫn bị từ chối (${r.stderr.trim()})`);
  }

  // ── CD5 mọi lối từ chối có TÊN riêng, thoát 2, không ghi gì (ma trận so bằng nhau).
  if (want('CD5')) {
    const HANG = [
      ['đã quyết', x => x, ['--slug', 'da-build', '--loi', 'làm', '--by', 'A'], 'đã quyết «build»'],
      ['ô hỏng', x => x, ['--slug', 'o-hong', '--loi', 'làm', '--by', 'A'], 'hồ sơ hỏng'],
      ['không ô cơ hội', x => x, ['--slug', 'khong-o', '--loi', 'làm', '--by', 'A'], 'không có ô cơ hội'],
      ['không hồ sơ', x => x, ['--slug', 'khong-ton-tai', '--loi', 'làm', '--by', 'A'], 'không có hồ sơ'],
      ['lối lạ', x => x, ['--slug', 'mo-de-xuat', '--loi', 'build', '--by', 'A'], 'lối ra lạ'],
      ['thiếu tên', x => x, ['--slug', 'mo-de-xuat', '--loi', 'làm'], 'thiếu --by'],
      ['ngày hỏng', x => x, ['--slug', 'mo-de-xuat', '--loi', 'làm', '--by', 'A', '--at', 'hôm-qua'], 'không đọc được thành ngày'],
      ['đã đóng', x => { W(x, '_acceptance/mo-de-xuat/opportunity.md', opp('mo-de-xuat', { stage: 'archived' })); return x; }, ['--slug', 'mo-de-xuat', '--loi', 'làm', '--by', 'A'], 'đã đóng hồ sơ'],
      ['kho chưa mở sổ', x => { rmSync(path.join(x, '_acceptance', 'config.yaml')); return x; }, ['--slug', 'mo-de-xuat', '--loi', 'làm', '--by', 'A'], 'chưa mở sổ'],
    ];
    const snap = x => MA_TRAN.map(([s]) => R(path.join(x, '_acceptance', s, 'opportunity.md'))).join('\0');
    const got = HANG.map(([ten, dung, args, msg]) => {
      const x = dung(xuong()); const s0 = snap(x); const r = ky(x, args);
      return [ten, r.status, r.stderr.includes(msg), snap(x) === s0];
    });
    const muon = HANG.map(([ten]) => [ten, 2, true, true]);
    if (bang(got, muon)) pass('CD5', `${HANG.length} lối từ chối: thoát 2, đúng thông điệp riêng, không ghi gì`);
    else fail('CD5', `ma trận từ chối lệch:\n  muốn ${JSON.stringify(muon)}\n  được ${JSON.stringify(got)}`);
    const msgs = new Set(HANG.map(h => h[3]));
    if (msgs.size !== HANG.length) fail('CD5', 'hai lối từ chối dùng chung một thông điệp'); else pass('CD5', 'mỗi lối từ chối một thông điệp riêng');
  }

  // ── CD6 round-trip: bảng lối ra của bộ ghi = khối G0-LOI-RA của lệnh duyệt; vế phải = từ vựng
  //    `decision` của NAV_RULES; hai thân lệnh bàn giao cùng một dòng ký. Đột biến thân lệnh → đỏ.
  if (want('CD6')) {
    const khoi = (txt, m) => { const x = txt.match(new RegExp(`<<<${m}\\n([\\s\\S]*?)\\n${m}>>>`)); return x ? x[1].split('\n').map(s => s.trim()).filter(Boolean) : null; };
    const DONG_KY = '/acceptance-gate:approve <slug> đáng: ___';
    const doi = pl => {
      const loi = [];
      const r = run(pl, 'ky-cong-dang.mjs', ['--loi-ra']);
      const nguon = r.stdout.split('\n').filter(Boolean);
      const ap = readFileSync(path.join(pl, 'commands', 'approve.md'), 'utf8');
      const st = readFileSync(path.join(pl, 'commands', 'start.md'), 'utf8');
      const hfl = readFileSync(path.join(pl, 'skills', 'acceptance', 'references', 'human-facing-language.md'), 'utf8');
      if (!bang(khoi(ap, 'G0-LOI-RA'), nguon)) loi.push(`G0-LOI-RA ${JSON.stringify(khoi(ap, 'G0-LOI-RA'))} ≠ bộ ghi ${JSON.stringify(nguon)}`);
      const phai = nguon.map(l => l.split(' -> ')[1]).sort();
      if (!bang(phai, [...NAV_RULES['opportunity.md'].decision.enum].sort())) loi.push(`vế phải ${phai} ≠ từ vựng decision`);
      if (!ap.includes(DONG_KY)) loi.push('lệnh duyệt thiếu dòng ký Cổng Đáng ở chốt thứ tự');
      if (!st.includes(DONG_KY)) loi.push('lệnh vào phiên không bàn giao cổng dang sang dòng ký');
      const slots = (hfl.match(/<!-- <<<GATE-ONESHOT-SLOTS -->\n([\s\S]*?)<!-- GATE-ONESHOT-SLOTS>>> -->/) || [])[1] || '';
      if (!/^extra đáng$/m.test(slots)) loi.push('GATE-ONESHOT-SLOTS thiếu «extra đáng»');
      return loi;
    };
    const l0 = doi(THAT);
    if (l0.length) fail('CD6', l0.join(' · ')); else pass('CD6', 'bảng lối ra một nguồn: bộ ghi = lệnh duyệt = từ vựng decision; hai thân lệnh cùng dòng ký');
    for (const [ten, mut, can] of [
      ['thân lệnh mất một lối', { 'commands/approve.md': ['xếp lại -> park\n', ''] }, 'G0-LOI-RA'],
      ['vào phiên mất bàn giao', { 'commands/start.md': [DONG_KY, '/acceptance-gate:acceptance-card <slug>'] }, 'vào phiên'],
    ]) {
      const l = doi(plugin(mut));
      if (l.some(e => e.includes(can))) pass('CD6', `đột biến «${ten}» → ĐỎ đúng chỗ`); else fail('CD6', `PHÉP ĐO MÙ: đột biến «${ten}» không đỏ (${l.join(' · ') || 'xanh'})`);
    }
  }
} catch (e) {
  fail('HA-TANG', e.stack || String(e));
} finally {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
}

for (const id of only) if (!ran.has(id)) fail(id, 'ca được gọi tên nhưng không tồn tại');
console.log(failures ? `\n${failures} FAIL` : '\nOK');
process.exit(failures ? 1 : 0);
