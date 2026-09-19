// tests/scripts/ho-so-nghi.test.mjs — ca hồ sơ ho-so-nghi (HSN…).
//
// Fixture do CODE SINH trong chính lần chạy; mọi đường dẫn suy từ vị trí tệp
// này, không hardcode gốc kho. Bản sao cây để tiêm mutant lấy TRỌN `scripts lib`
// bằng `git archive`, không chép danh sách tệp tay (P150).
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, cpSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const require = createRequire(import.meta.url);
const { hoSoNghi } = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));

let pass = 0, fail = 0;
const check = (name, ok, got) => {
  if (ok) { pass += 1; console.log(`  PASS: ${name}`); }
  else { fail += 1; console.log(`  FAIL: ${name}${got === undefined ? '' : ` — ${JSON.stringify(got)}`}`); }
};

const dong = (o) => JSON.stringify({
  id: 'd-20260919T120000Z-9', type: 'nghi', stage: 'gate2', at: '2026-09-19T12:00:00Z',
  by: 'Mạnh', decision: 'kho nguồn plugin biến mất 26/08', ...o,
});

// ─── HSN-LIB: vị từ, chín hình dạng, ma trận so BẰNG NHAU ────────────────────
console.log('HSN-LIB vị từ hoSoNghi — mười hai hình dạng, so BẰNG NHAU');
{
  const KY = '---\nhuman_signoff: Mạnh 2026-09-01\n---\n';
  const CA = [
    ['dòng hợp lệ', { ledgerText: dong({}), reportText: KY, contractAtRoot: true, suLieuContract: false }, 'dong-so'],
    ['hợp lệ nhưng CHƯA ký', { ledgerText: dong({}), reportText: '---\nverdict: PASS\n---\n', contractAtRoot: true, suLieuContract: false }, 'chua-ky'],
    ['hợp lệ, chữ ký là chỗ-giữ', { ledgerText: dong({}), reportText: '---\nhuman_signoff: <!-- tên người ký -->\n---\n', contractAtRoot: true, suLieuContract: false }, 'chua-ky'],
    ['hợp lệ, KHÔNG có báo cáo', { ledgerText: dong({}), reportText: null, contractAtRoot: true, suLieuContract: false }, 'chua-ky'],
    ['thiếu by', { ledgerText: dong({ by: '' }), reportText: KY, contractAtRoot: true, suLieuContract: false }, 'dong-so-thieu'],
    ['thiếu decision', { ledgerText: dong({ decision: '  ' }), reportText: KY, contractAtRoot: true, suLieuContract: false }, 'dong-so-thieu'],
    ['at không parse được', { ledgerText: dong({ at: 'hôm qua' }), reportText: KY, contractAtRoot: true, suLieuContract: false }, 'dong-so-thieu'],
    ['văn xuôi descope', { ledgerText: JSON.stringify({ id: 'd-1', type: 'descope', decision: 'hồ sơ nghỉ hẳn' }), reportText: KY, contractAtRoot: true, suLieuContract: false }, null],
    ['sổ vắng', { ledgerText: null, reportText: KY, contractAtRoot: true, suLieuContract: false }, null],
    ['thư mục sử liệu cũ', { ledgerText: null, contractAtRoot: false, suLieuContract: true }, 'su-lieu-cu'],
    ['dòng nghỉ + supersedes', { ledgerText: `${dong({})}\n${JSON.stringify({ id: 'd-2', type: 'revisit', supersedes: 'd-20260919T120000Z-9' })}`, reportText: KY, contractAtRoot: true, suLieuContract: false }, null],
    ['supersedes trỏ id khác', { ledgerText: `${dong({})}\n${JSON.stringify({ id: 'd-2', type: 'revisit', supersedes: 'd-khac' })}`, reportText: KY, contractAtRoot: true, suLieuContract: false }, 'dong-so'],
  ];
  const got = CA.map(([ten, inp]) => { const r = hoSoNghi(inp); return `${ten}=${r === null ? 'null' : r.kieu}`; });
  const mong = CA.map(([ten, , k]) => `${ten}=${k === null ? 'null' : k}`);
  check('HSN-LIB ma trận mười hai ca so bằng nhau', got.join(' | ') === mong.join(' | '), { got, mong });

  const t = hoSoNghi({ ledgerText: dong({ by: '', at: 'hôm qua' }), reportText: KY, contractAtRoot: true, suLieuContract: false });
  check('HSN-LIB nêu ĐÚNG tập vế thiếu, đã sort', t.kieu === 'dong-so-thieu' && t.thieu.join(',') === 'at,by', t);

  const ok = hoSoNghi({ ledgerText: dong({}), reportText: KY, contractAtRoot: true, suLieuContract: false });
  check('HSN-LIB dòng hợp lệ trả đủ bốn trường',
    ok.by === 'Mạnh' && ok.at === '2026-09-19T12:00:00Z' && ok.ly_do.includes('26/08') && ok.id === 'd-20260919T120000Z-9', ok);

  check('HSN-LIB dòng hỏng JSON KHÔNG làm vỡ, bỏ qua như mọi bộ đọc sổ',
    hoSoNghi({ ledgerText: `{hỏng\n${dong({})}`, reportText: KY, contractAtRoot: true, suLieuContract: false }).kieu === 'dong-so');
}

// ─── Kho fixture dùng chung ──────────────────────────────────────────────────
// `luat` chọn luật nào của cổng sẽ đỏ — cổng `continue` sau vi phạm ĐẦU TIÊN,
// nên một kho chỉ chứng được MỘT luật (đó là lý do ba kho, không phải một).
const RAC = [];
function khoFixture({ luat = 'eval', nghi = null, them = null, status = 'signed-off', chuKy = 'that' } = {}) {
  const r = mkdtempSync(path.join(os.tmpdir(), 'hsn-'));
  RAC.push(r);
  const d = path.join(r, '_acceptance', 'hsn');
  mkdirSync(d, { recursive: true });
  const git = (...a) => execFileSync('git', ['-C', r, ...a], { encoding: 'utf8' });
  git('init', '-q');
  git('config', 'user.email', 'x@y.z'); git('config', 'user.name', 'x');
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  writeFileSync(path.join(r, 'ma.js'), 'v1\n');
  writeFileSync(path.join(d, 'contract.md'),
    `---\nschema_version: 1\nslug: hsn\nfeature: ho so thu\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: Mạnh\napproved_at: 2026-09-01T00:00:00Z\n---\n\n# c\n\n## Criteria\n\n### AC-1 — x\n**Given** a **When** b **Then** c\n\n## Out of scope\n\n- x\n- y\n`);
  writeFileSync(path.join(d, 'evals.yaml'),
    'schema_version: 1\nfeature_slug: hsn\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: "true"\n    expected: Exit 0 — KHÔNG có dòng lạ\n');
  git('add', '-A'); git('commit', '-q', '-m', 'nen');
  const sha = git('rev-parse', 'HEAD').trim();
  const lan = { ts: '2026-09-01T00:00:00Z', kind: 'repin', run_id: 'r-1', sha, suites_exit: [0] };
  if (luat === 'lan') lan.sha = '0'.repeat(40);
  else if (luat === 'cu-hoa') lan.evals_exit = { E1: 0 };
  writeFileSync(path.join(d, 'run-log.jsonl'), `${JSON.stringify(lan)}\n`);
  writeFileSync(path.join(d, 'evidence-report.md'),
    `---\nslug: hsn\nverdict: PASS\nverified_commit: ${sha}\n${chuKy === 'that' ? 'human_signoff: Mạnh 2026-09-01\n' : chuKy === 'giu-cho' ? 'human_signoff: <!-- tên người ký -->\n' : ''}---\n\n## Evidence\n\n### Re-pin lần 1 — 01/09, do nền\nrun_id: r-1\nsha: ${sha} · suites: 1 lệnh exit 0\n`);
  const so = [nghi, them].filter(Boolean);
  if (so.length) writeFileSync(path.join(d, 'decisions.jsonl'), `${so.join('\n')}\n`);
  git('add', '-A'); git('commit', '-q', '-m', 'ho so');
  if (luat === 'cu-hoa') { writeFileSync(path.join(r, 'ma.js'), 'v2\n'); git('add', '-A'); git('commit', '-q', '-m', 'ma doi sau pin'); }
  return { r, d, sha, git };
}

const scan = (r) => JSON.parse(spawnSync(process.execPath,
  [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', r],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout);
const oSlug = (j, slug = 'hsn') => {
  const g = j.groups || {};
  return [...(g.gates || []), ...(g.inProgress || []), ...(g.done || []), ...(g.considering || []),
    ...(j.broken || [])].find((x) => x.slug === slug) || null;
};

// ─── Ba bộ đọc chạy được, dùng chung từ HSN5 trở đi ─────────────────────────
const congThoat = (r) => {
  const p = spawnSync('bash', [path.join(ROOT, 'scripts', 'pre-merge-check.sh'), r, '--no-t1-escape'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { ma: p.status, out: `${p.stdout || ''}${p.stderr || ''}` };
};
const recheck = (d) => {
  const p = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(d, 'evidence-report.md')],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { ma: p.status, out: `${p.stdout || ''}${p.stderr || ''}` };
};
// Bỏ mã màu trước khi so cụm chữ — luật NO4 của kho: một chuỗi ANSI xen giữa
// làm phép so «có câu này không» trượt lặng lẽ.
const the = (r) => (spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--root', r, '--slug', 'hsn'],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout || '').replace(/\x1b\[[0-9;]*m/g, '');

// Chuỗi mời ký của thẻ — dùng chung cho HSN-THE và HSN7; phải CÓ THẬT trong bộ
// dựng thẻ (ca HSN-THE kiểm), nếu không phép đo «thẻ có mời ký» không bao giờ khớp.
const MOI_KY_HANG = 'Ký duyệt';

// SHA NỀN — điểm cắt nhánh của vòng này, GHI THẲNG. Không dùng `origin/main` hay
// merge-base: sau khi nhánh vào nhánh chính, ref ấy trỏ chính commit ĐÃ mang bản
// vá, nên mọi đối chứng neo vào nó chết vĩnh viễn (lớp «thước ghim vào thứ SẼ ĐỔI»).
const SHA_NEN = 'dc47c55496cc75b373f5715741f61ebdd10534c8';

// Chuỗi ghim của TỪNG luật — phải CÓ THẬT trong script cổng; gõ tay một câu đã
// chết là phép đo xanh vì không bao giờ khớp được gì.
const CHUOI = { 'cu-hoa': 'evidence is stale', lan: 'none of the cited re-pin lane', eval: 'recorded no evals_exit' };

// ─── HSN5: bộ quét ───────────────────────────────────────────────────────────
console.log('\nHSN5 bộ quét — ba hình dạng, so BẰNG NHAU');
{
  const a = khoFixture({ nghi: dong({}) });
  const b = khoFixture({ nghi: dong({}), status: 'approved', chuKy: 'khong' });
  const c = khoFixture({});
  mkdirSync(path.join(c.d, 'su-lieu'), { recursive: true });
  cpSync(path.join(c.d, 'contract.md'), path.join(c.d, 'su-lieu', 'contract.md'));
  rmSync(path.join(c.d, 'contract.md'));
  writeFileSync(path.join(c.d, 'opportunity.md'),
    '---\nschema_version: 1\nslug: hsn\nfeature: x\nowner: x@y.z\nstage: archived\ndecision: kill\ndecided_by: Mạnh\ndecided_at: 2026-09-01\n---\n\n# o\n');
  const got = [a, b, c].map(({ r }) => { const x = oSlug(scan(r)); return `${x && x.stateKey}/${((x && x.flags) || []).join('+') || '-'}`; });
  // Ca thứ hai đổi kết cục sau khi THU PHẠM VI: hồ sơ `approved` chưa ai ký thì
  // dòng nghỉ KHÔNG có hiệu lực — giữ ô của hồ sơ đang sống, kèm cờ nói ra.
  const mong = ['da-nghi/-', 'vat-da-o-nhanh-goc/nghi-chua-ky', 'da-dong-ho-so/nghi-kieu-cu'];
  check('HSN5 ba hình dạng cho đúng bộ ba trạng thái + cờ', got.join(' | ') === mong.join(' | '), { got, mong });

  // BẢN ĐỒ — chạy bộ dựng THẬT, không tin rằng «bộ quét đúng thì bản đồ đúng».
  // Hợp đồng hứa hai điều ở đây và trước đây không phép đo nào gọi bộ dựng bản
  // đồ: (i) không đẻ khối mới; (ii) hồ sơ nghỉ đậu đúng khối. Bản đồ là bộ đọc
  // thứ hai của cùng sự thật, và nó ĐÃ trôi khỏi bộ quét (lượt chấm 1, t3).
  const banDo = (r) => {
    spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'product-map.mjs'), '--root', r],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return readFileSync(path.join(r, 'PRODUCT-MAP.md'), 'utf8');
  };
  const khoi = (md) => md.split('\n').filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim());
  const duoiKhoi = (md, ten) => {
    const ls = md.split('\n'); const i = ls.findIndex((l) => l.trim() === `## ${ten}`);
    if (i < 0) return '';
    const j = ls.findIndex((l, k) => k > i && l.startsWith('## '));
    return ls.slice(i + 1, j < 0 ? undefined : j).join('\n');
  };
  const nen = khoFixture({});                       // đối chứng: cùng khuôn, KHÔNG dòng nghỉ
  const mdNen = banDo(nen.r), mdA = banDo(a.r), mdB = banDo(b.r);
  // «Không đẻ khối mới» đo bằng QUAN HỆ với danh sách khối ĐÓNG của chính bộ
  // dựng, không so hai bản đồ với nhau: bản đồ chỉ in khối CÓ thành viên, nên
  // một kho một hồ sơ luôn có đúng một khối và phép so hai bản đồ là vô nghĩa.
  // Kỳ vọng rút từ bản `product-map.mjs` ở SHA NỀN — KHÔNG từ chính bản đang đo:
  // lấy hằng của vật bị đo làm kỳ vọng thì phép so luôn đúng, kể cả khi vòng này
  // đẻ thêm một khối (lượt chấm 2 bắt đúng lỗ ấy).
  const tenKhoi = (src) => {
    const b = (src.match(/const SECTIONS = \[([\s\S]*?)\];/) || [])[1] || '';
    return new Set([...b.matchAll(/'([^']+)'\]/g)].map((m) => m[1]));
  };
  const KHOI_NEN = tenKhoi(execFileSync('git', ['-C', ROOT, 'show', `${SHA_NEN}:scripts/product-map.mjs`], { encoding: 'utf8' }));
  const KHOI_NAY = tenKhoi(readFileSync(path.join(ROOT, 'scripts', 'product-map.mjs'), 'utf8'));
  check('HSN5-map rút được danh sách khối ở CẢ HAI bản (nền và nay)',
    KHOI_NEN.size >= 8 && KHOI_NAY.size >= 8, { nen: KHOI_NEN.size, nay: KHOI_NAY.size });
  check('HSN5-map tập tên khối KHÔNG đổi so với sha NỀN (nghỉ không đẻ khối mới)',
    [...KHOI_NAY].sort().join('|') === [...KHOI_NEN].sort().join('|'),
    { them: [...KHOI_NAY].filter((k) => !KHOI_NEN.has(k)), mat: [...KHOI_NEN].filter((k) => !KHOI_NAY.has(k)) });
  const la = [mdNen, mdA, mdB].flatMap(khoi).filter((k) => !KHOI_NEN.has(k));
  check('HSN5-map mọi khối bản đồ in ra đều nằm trong tập của sha NỀN', la.length === 0, la);
  const oMap = [
    `đã-thông=${duoiKhoi(mdA, 'Đã giao').includes('hsn') ? 'Đã giao' : 'KHÁC'}`,
    `chưa-ký=${duoiKhoi(mdB, 'Đang làm').includes('hsn') ? 'Đang làm' : 'KHÁC'}`,
    `đối-chứng=${duoiKhoi(mdNen, 'Đã giao').includes('hsn') ? 'Đã giao' : 'KHÁC'}`,
  ];
  check('HSN5-map bản đồ và bộ quét xếp hồ sơ nghỉ vào CÙNG nhóm, hai hình dạng',
    oMap.join(' | ') === 'đã-thông=Đã giao | chưa-ký=Đang làm | đối-chứng=Đã giao', oMap);

  // Ma trận TOÀN PHẦN: 3 vế thiếu × 3 bộ đọc = 9 ô, SINH bằng vòng lặp. Bản
  // trước viết tay một vế cho bộ quét và một vế cho thẻ (5/9 ô) trong khi E2
  // tuyên quét cả lớp — số assert phải bằng số phần tử của lớp được tuyên.
  const VE = [['by', { by: '' }], ['decision', { decision: '  ' }], ['at', { at: 'hôm qua' }]];
  const oMat = [];
  for (const [ve, bien] of VE) {
    const k = khoFixture({ luat: 'eval', nghi: dong(bien), status: 'verified' });
    const x = oSlug(scan(k.r));
    const h = the(k.r);
    const g = congThoat(k.r);
    oMat.push(`${ve}/cổng=${g.ma !== 0 && g.out.includes(`dòng nghỉ thiếu ${ve}`) ? 'đỏ+nêu-vế' : `KHÁC(${g.ma})`}`);
    oMat.push(`${ve}/quét=${x && x.stateKey !== 'da-nghi' && (x.flags || []).includes(`nghi-thieu-ve:${ve}`) ? 'cờ-đúng-vế' : `KHÁC(${x && x.stateKey}/${x && (x.flags || []).join('+')})`}`);
    oMat.push(`${ve}/thẻ=${h.includes(`thiếu ${ve}`) && h.includes(MOI_KY_HANG) ? 'cờ-vàng+mời-ký' : `KHÁC(${h.includes(`thiếu ${ve}`)},${h.includes(MOI_KY_HANG)})`}`);
  }
  const mongMat = VE.flatMap(([ve]) => [`${ve}/cổng=đỏ+nêu-vế`, `${ve}/quét=cờ-đúng-vế`, `${ve}/thẻ=cờ-vàng+mời-ký`]);
  check('HSN5b ma trận TOÀN PHẦN 3 vế × 3 bộ đọc (9 ô) so BẰNG NHAU',
    oMat.length === 9 && oMat.join(' | ') === mongMat.join(' | '), { oMat, mongMat });

  // Nhánh «máy đi tiếp» (làn V) là ô thứ mười của cùng lớp: hồ sơ đã thông Cổng 2
  // KHÔNG do chữ ký mà do xanh-sạch. Bản trước đánh rơi cờ ở đúng nhánh này.
  const dv = khoFixture({ luat: 'eval', nghi: dong({ by: '' }), status: 'verified' });
  writeFileSync(path.join(dv.d, 'contract.md'),
    readFileSync(path.join(dv.d, 'contract.md'), 'utf8').replace('approved_by: Mạnh', 'approved_by:\nveto_state: mo\nveto_opened_at: 2026-09-01T00:00:00Z'));
  execFileSync('git', ['-C', dv.r, 'commit', '-qam', 'lan V'], { encoding: 'utf8' });
  const xdv = oSlug(scan(dv.r));
  check('HSN5b-lanV nhánh máy-đi-tiếp cũng mang cờ thiếu vế (không nhánh nào đánh rơi)',
    !!xdv && (xdv.flags || []).includes('nghi-thieu-ve:by'), xdv);

  const d3 = khoFixture({ nghi: JSON.stringify({ id: 'd-1', type: 'descope', decision: 'nghỉ hẳn' }) });
  const x3 = oSlug(scan(d3.r));
  check('HSN5c văn xuôi → da-giao và KHÔNG cờ nào (đặc hiệu)',
    !!x3 && x3.stateKey === 'da-giao' && (x3.flags || []).length === 0, x3);
}

// ─── HSN9: cây kit thật ──────────────────────────────────────────────────────
console.log('\nHSN9 cây kit thật — cờ kiểu cũ có, tập hồ sơ hỏng KHÔNG đổi');
{
  const j = scan(ROOT);
  const x = oSlug(j, 'bo-qua-phai-thay-dinh-nghia-phep-do');
  check('HSN9 hồ sơ nghỉ kiểu cũ của kit mang cờ nghi-kieu-cu',
    !!x && (x.flags || []).includes('nghi-kieu-cu'), x);
  // Đối chứng neo vào ĐIỂM CẮT NHÁNH, không neo vào HEAD: HEAD dịch theo từng
  // commit của chính vòng này, nên neo vào nó là thước tự dối ngay sau lượt ghi
  // đầu tiên (lớp «thước ghim vào thứ SẼ ĐỔI»).
  const truoc = execFileSync('git', ['-C', ROOT, 'show', `${SHA_NEN}:scripts/start-scan.mjs`], { encoding: 'utf8' });
  check('HSN9 đối chứng: bản ở sha NỀN KHÔNG có cờ này (cờ đến từ chính bản vá)',
    !truoc.includes('nghi-kieu-cu'));
  // QUAN HỆ, không phải hằng: lời hứa của AC-9 là «không hồ sơ nào hỏng THÊM so
  // với trước vòng». Ghim hằng 0 thì một hồ sơ khác hỏng về sau làm ca này đỏ và
  // trỏ nhầm vào tính năng này.
  const hongNen = (() => {
    const d = mkdtempSync(path.join(os.tmpdir(), 'hsn-nen-'));
    RAC.push(d);
    execFileSync('bash', ['-c', `git -C ${JSON.stringify(ROOT)} archive ${SHA_NEN} scripts lib _acceptance | tar -x -C ${JSON.stringify(d)}`]);
    const out = spawnSync(process.execPath, [path.join(d, 'scripts', 'start-scan.mjs'), '--root', d],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout;
    return new Set(((out ? JSON.parse(out).broken : []) || []).map((b) => b.slug));
  })();
  const hongNay = new Set((j.broken || []).map((b) => b.slug));
  check('HSN9 tập hồ sơ hỏng là TẬP CON của tập ở sha NỀN (quan hệ, không phải hằng 0)',
    [...hongNay].every((x) => hongNen.has(x)), { nay: [...hongNay], nen: [...hongNen] });
}

// ─── Cổng, kiểm lại, thẻ ─────────────────────────────────────────────────────
console.log('\nHSN0/HSN1 cổng — ba luật, đối chứng dương rồi dòng nghỉ');
{
  const LUAT = ['cu-hoa', 'lan', 'eval'];
  // Chuỗi ghim phải CÓ THẬT ở nguồn luật. Hai luật đầu do chính script cổng phát;
  // luật làn eval do `lib/evidence-core.cjs` phát (cổng gọi checkRepinEvals) —
  // tra cả hai nguồn, vì gõ tay một câu đã chết là phép đo không bao giờ khớp.
  const src = readFileSync(path.join(ROOT, 'scripts', 'pre-merge-check.sh'), 'utf8')
    + readFileSync(path.join(ROOT, 'lib', 'evidence-core.cjs'), 'utf8');
  check('HSN0 ba chuỗi ghim CÓ THẬT ở nguồn luật',
    LUAT.every((k) => src.includes(CHUOI[k])), LUAT.filter((k) => !src.includes(CHUOI[k])));

  const truoc = LUAT.map((luat) => {
    const { r } = khoFixture({ luat });
    const x = congThoat(r);
    return `${luat}=${x.ma !== 0 && x.out.includes(CHUOI[luat]) ? 'đỏ-đúng-luật' : `KHÁC(${x.ma})`}`;
  });
  check('HSN0 đối chứng dương: ba kho, mỗi kho đỏ đúng luật của nó',
    truoc.join(' | ') === 'cu-hoa=đỏ-đúng-luật | lan=đỏ-đúng-luật | eval=đỏ-đúng-luật', truoc);

  const sau = LUAT.map((luat) => {
    const { r } = khoFixture({ luat, nghi: dong({}) });
    const x = congThoat(r);
    const soVi = (x.out.match(/^VIOLATION \[hsn\]/gm) || []).length;
    const note = /NOTE \[hsn\]: hồ sơ nghỉ — Mạnh .*thôi bị chấm ở phần còn lại của lưới/.test(x.out);
    return `${luat}=${x.ma === 0 && soVi === 0 && note ? 'xanh+note' : `KHÁC(ma=${x.ma},vi=${soVi},note=${note})`}`;
  });
  check('HSN1 ba kho + dòng nghỉ → xanh, 0 vi phạm, đúng một dòng NOTE',
    sau.join(' | ') === 'cu-hoa=xanh+note | lan=xanh+note | eval=xanh+note', sau);
}

console.log('\nHSN2/HSN3/HSN8 cổng — fail-closed ba đường');
{
  const VE = [['by', ''], ['decision', '  '], ['at', 'hôm qua']];
  const got = VE.map(([ve, v]) => {
    const { r } = khoFixture({ luat: 'eval', nghi: dong({ [ve]: v }) });
    const x = congThoat(r);
    return `${ve}=${x.ma !== 0 && x.out.includes(CHUOI.eval) && x.out.includes(`dòng nghỉ thiếu ${ve}`) ? 'đỏ+nêu-vế' : `KHÁC(${x.ma})`}`;
  });
  check('HSN2 ba vế thiếu → cổng vẫn đỏ và nêu ĐÚNG vế',
    got.join(' | ') === 'by=đỏ+nêu-vế | decision=đỏ+nêu-vế | at=đỏ+nêu-vế', got);

  const { r: r3 } = khoFixture({ luat: 'eval', nghi: JSON.stringify({ id: 'd-1', type: 'descope', decision: 'nghỉ hẳn' }) });
  const x3 = congThoat(r3);
  check('HSN3 văn xuôi → y hệt đối chứng: đỏ, KHÔNG dòng nghỉ nào',
    x3.ma !== 0 && x3.out.includes(CHUOI.eval) && !x3.out.includes('hồ sơ nghỉ'), x3.ma);

  const sao = mkdtempSync(path.join(os.tmpdir(), 'hsn-sao-'));
  RAC.push(sao);
  execFileSync('bash', ['-c', `git -C ${JSON.stringify(ROOT)} archive HEAD scripts lib | tar -x -C ${JSON.stringify(sao)}`]);
  for (const f of ['lib/workspace-record.cjs', 'scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs']) {
    cpSync(path.join(ROOT, f), path.join(sao, f));
  }
  const libSao = path.join(sao, 'lib', 'workspace-record.cjs');
  const coTruoc = existsSync(libSao);
  rmSync(libSao);
  check('HSN8 mũi tiêm CHỨNG MINH đổi được cây (tệp có trước, mất sau)', coTruoc && !existsSync(libSao));
  const { r: r8 } = khoFixture({ luat: 'eval', nghi: dong({}) });
  const p8 = spawnSync('bash', [path.join(sao, 'scripts', 'pre-merge-check.sh'), r8, '--no-t1-escape'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const o8 = `${p8.stdout || ''}${p8.stderr || ''}`;
  check('HSN8 lib vắng → NOT ENFORCED có tên VÀ vẫn đỏ như đối chứng',
    p8.status !== 0 && o8.includes('luật nghỉ NOT ENFORCED') && o8.includes(CHUOI.eval), { ma: p8.status });
}

console.log('\nHSN4 kiểm lại bằng chứng — ba kết quả so BẰNG NHAU');
{
  const a = khoFixture({ luat: 'eval', nghi: dong({}) });
  const b = khoFixture({ luat: 'eval' });
  const c = khoFixture({ luat: 'eval', nghi: dong({ by: '' }) });
  const ra = recheck(a.d), rb = recheck(b.d), rc = recheck(c.d);
  const got = [
    `nghỉ=${ra.ma === 0 && ra.out.includes('hồ sơ nghỉ') && ra.out.includes('bỏ kiểm lại') ? 'xanh+note' : `KHÁC(${ra.ma})`}`,
    `không-nghỉ=${rb.ma !== 0 && rb.out.includes('REPIN x') ? 'đỏ' : `KHÁC(${rb.ma})`}`,
    `thiếu-vế=${rc.ma !== 0 && rc.out.includes('REPIN x') && !rc.out.includes('hồ sơ nghỉ') ? 'đỏ' : `KHÁC(${rc.ma})`}`,
  ];
  check('HSN4 ba kết quả đúng bộ ba', got.join(' | ') === 'nghỉ=xanh+note | không-nghỉ=đỏ | thiếu-vế=đỏ', got);
}

console.log('\nHSN6 vi phân byte — dòng nghỉ do CHÍNH khối lệnh của GUIDE sinh');
{
  const { r, d } = khoFixture({ luat: 'eval' });
  const bam = () => ['contract.md', 'evidence-report.md', 'run-log.jsonl']
    .map((f) => createHash('sha256').update(readFileSync(path.join(d, f))).digest('hex')).join(',');
  const truoc = bam();

  const guide = readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8');
  const m = guide.match(/<!-- <<<NGHI-LINE-RECIPE -->\n```(?:bash|sh)?\n([\s\S]*?)```\n<!-- NGHI-LINE-RECIPE>>> -->/);
  check('HSN6 rút được khối lệnh từ marker GUIDE', !!m, 'marker NGHI-LINE-RECIPE không khớp');
  if (m) {
    const lenh = m[1].replace(/<slug>/g, 'hsn').replace(/<tên người>/g, 'Mạnh')
      .replace(/<lý do một câu>/g, 'kho nguồn plugin biến mất').replace(/<hồ sơ thôi hứa gì>/g, 'thôi hứa plugin');
    execFileSync('bash', ['-c', `cd ${JSON.stringify(r)} && ${lenh}`], { encoding: 'utf8' });
    const soDong = readFileSync(path.join(d, 'decisions.jsonl'), 'utf8').trim().split('\n').length;
    check('HSN6 khối lệnh ghi ĐÚNG một dòng', soDong === 1, soDong);
    check('HSN6 ba tệp đã ký KHÔNG đổi một byte', bam() === truoc);
    const n = hoSoNghi({ ledgerText: readFileSync(path.join(d, 'decisions.jsonl'), 'utf8'),
      reportText: readFileSync(path.join(d, 'evidence-report.md'), 'utf8'), contractAtRoot: true, suLieuContract: false });
    check('HSN6 bên ĐỌC nhận đúng dòng bên VIẾT sinh (round-trip)', !!n && n.kieu === 'dong-so' && n.by === 'Mạnh', n);

    const lenhMeo = lenh.replace('"by"', '"nguoi"');
    check('HSN6 mũi tiêm đổi được lệnh', lenhMeo !== lenh);
    const { r: r2, d: d2 } = khoFixture({ luat: 'eval' });
    execFileSync('bash', ['-c', `cd ${JSON.stringify(r2)} && ${lenhMeo}`], { encoding: 'utf8' });
    const n2 = hoSoNghi({ ledgerText: readFileSync(path.join(d2, 'decisions.jsonl'), 'utf8'),
      reportText: readFileSync(path.join(d2, 'evidence-report.md'), 'utf8'), contractAtRoot: true, suLieuContract: false });
    check('HSN6 mutant đổi tên trường → KHÔNG còn là nghỉ hợp lệ',
      !!n2 && n2.kieu === 'dong-so-thieu' && n2.thieu.includes('by'), n2);
  }
}

console.log('\nHSN11 chưa ký — dòng nghỉ KHÔNG có hiệu lực, bốn bộ đọc cùng nói ra');
{
  // Mỗi biến vướng một luật chữ ký KHÁC NHAU của cổng — ghim đúng câu của luật
  // nó kích, không gộp thành một chuỗi chung (gộp là mất chiều phân biệt).
  const BIEN = [['vắng chữ ký', 'khong', 'human_signoff is empty'],
    ['chữ ký là chỗ-giữ', 'giu-cho', 'is a placeholder, not a signature']];
  const oKy = [];
  for (const [ten, ck, cauCong] of BIEN) {
    const k = khoFixture({ luat: 'eval', nghi: dong({}), chuKy: ck });
    const g = congThoat(k.r), rc = recheck(k.d), x = oSlug(scan(k.r)), h = the(k.r);
    // Hồ sơ chưa ký vướng LUẬT CHỮ KÝ trước luật làn — ghim đúng câu cổng thật in
    // ra, không ghim câu của một luật khác (phép đo sẽ không bao giờ khớp).
    oKy.push(`${ten}/cổng=${g.ma !== 0 && g.out.includes(cauCong) && g.out.includes('CHƯA có chữ ký người') ? 'đỏ+nói-ra' : `KHÁC(${g.ma})`}`);
    oKy.push(`${ten}/kiểm-lại=${rc.ma !== 0 && rc.out.includes('REPIN x') && !rc.out.includes('bỏ kiểm lại') ? 'đỏ' : `KHÁC(${rc.ma})`}`);
    oKy.push(`${ten}/quét=${x && x.stateKey !== 'da-nghi' && (x.flags || []).includes('nghi-chua-ky') ? 'sống+cờ' : `KHÁC(${x && x.stateKey}/${x && (x.flags || []).join('+')})`}`);
    oKy.push(`${ten}/thẻ=${!h.includes('đã nghỉ') && h.includes(MOI_KY_HANG) ? 'mời-ký' : `KHÁC(${h.includes('đã nghỉ')},${h.includes(MOI_KY_HANG)})`}`);
  }
  const mongKy = BIEN.flatMap(([t]) => [`${t}/cổng=đỏ+nói-ra`, `${t}/kiểm-lại=đỏ`, `${t}/quét=sống+cờ`, `${t}/thẻ=mời-ký`]);
  check('HSN11 ma trận 2 biến × 4 bộ đọc so BẰNG NHAU — chưa ký thì dòng nghỉ không ăn',
    oKy.length === 8 && oKy.join(' | ') === mongKy.join(' | '), { oKy, mongKy });

  // ĐỐI CHỨNG DƯƠNG trong CÙNG ca: thêm chữ ký THẬT vào chính báo cáo ấy thì cả
  // bốn lật sang nghỉ. Thiếu vế này thì «bốn bộ đọc đều đỏ» không phân biệt được
  // «luật chữ ký đang chạy» với «fixture hỏng nên mọi thứ đỏ».
  const k2 = khoFixture({ luat: 'eval', nghi: dong({}), chuKy: 'khong' });
  const rep = path.join(k2.d, 'evidence-report.md');
  const truocKy = readFileSync(rep, 'utf8');
  const sauKy = truocKy.replace('verdict: PASS', 'verdict: PASS\nhuman_signoff: Mạnh 2026-09-01');
  check('HSN11 mũi tiêm chữ ký CHỨNG MINH đổi được báo cáo', sauKy !== truocKy);
  writeFileSync(rep, sauKy);
  execFileSync('git', ['-C', k2.r, 'commit', '-qam', 'ky'], { encoding: 'utf8' });
  const g2 = congThoat(k2.r), rc2 = recheck(k2.d), x2b = oSlug(scan(k2.r)), h2 = the(k2.r);
  const oSau = [
    `cổng=${g2.ma === 0 && g2.out.includes('hồ sơ nghỉ') ? 'xanh+nghỉ' : `KHÁC(${g2.ma})`}`,
    `kiểm-lại=${rc2.ma === 0 && rc2.out.includes('bỏ kiểm lại') ? 'xanh+nghỉ' : `KHÁC(${rc2.ma})`}`,
    `quét=${x2b && x2b.stateKey === 'da-nghi' ? 'da-nghi' : `KHÁC(${x2b && x2b.stateKey})`}`,
    `thẻ=${h2.includes('đã nghỉ') && !h2.includes(MOI_KY_HANG) ? 'nói-nghỉ' : `KHÁC(${h2.includes('đã nghỉ')})`}`,
  ];
  check('HSN11 đối chứng dương: thêm chữ ký thật → CẢ BỐN lật sang nghỉ',
    oSau.join(' | ') === 'cổng=xanh+nghỉ | kiểm-lại=xanh+nghỉ | quét=da-nghi | thẻ=nói-nghỉ', oSau);
}

console.log('\nHSN10 mở lại — supersedes trỏ đúng id thì hồ sơ sống lại ở cả bốn bộ đọc');
{
  const idNghi = 'd-20260919T120000Z-9';
  const a = khoFixture({ luat: 'eval', nghi: dong({}), them: JSON.stringify({ id: 'd-2', type: 'revisit', at: '2026-09-20T00:00:00Z', supersedes: idNghi }) });
  const b = khoFixture({ luat: 'eval', nghi: dong({}), them: JSON.stringify({ id: 'd-2', type: 'revisit', at: '2026-09-20T00:00:00Z', supersedes: 'd-khac' }) });
  // Mã thoát trần KHÔNG đủ: mọi đường đỏ khác (lib ném lỗi, fixture hỏng, node
  // vắng) cũng cho «khác 0». Ghim thông điệp của ĐÚNG luật đang đo, như HSN0/HSN2/
  // HSN4/HSN8 đã làm trên cùng loại fixture. Và đo CẢ BỐN bộ đọc như E11 tuyên —
  // thẻ là bộ đọc thứ tư, trước đây vắng hẳn khỏi ca này.
  const ga = congThoat(a.r), gb = congThoat(b.r);
  const ra = recheck(a.d), rb = recheck(b.d);
  const sa = oSlug(scan(a.r)), sb = oSlug(scan(b.r));
  const ha10 = the(a.r), hb10 = the(b.r);
  const got = [
    `mở-lại=${ga.ma !== 0 && ga.out.includes(CHUOI.eval) && ra.ma !== 0 && ra.out.includes('REPIN x')
      && sa && sa.stateKey === 'da-giao' && !ha10.includes('đã nghỉ') ? 'sống-lại' : `KHÁC(${ga.ma},${ga.out.includes(CHUOI.eval)},${ra.ma},${sa && sa.stateKey},${!ha10.includes('đã nghỉ')})`}`,
    `id-khác=${gb.ma === 0 && gb.out.includes('hồ sơ nghỉ') && rb.ma === 0 && rb.out.includes('bỏ kiểm lại')
      && sb && sb.stateKey === 'da-nghi' && hb10.includes('đã nghỉ') ? 'vẫn-nghỉ' : `KHÁC(${gb.ma},${rb.ma},${sb && sb.stateKey},${hb10.includes('đã nghỉ')})`}`,
  ];
  check('HSN10 hai chiều × bốn bộ đọc, thông điệp ghim: mở lại sống lại · trỏ id khác KHÔNG gỡ nghỉ',
    got.join(' | ') === 'mở-lại=sống-lại | id-khác=vẫn-nghỉ', got);
}

console.log('\nHSN-THE thẻ — một sự thật với bộ quét');
{
  // Hồ sơ CHƯA ký (verified) là ca phân biệt: ở signed-off thẻ vốn không mời ký
  // nên một bản vá hỏng vẫn xanh. Cùng trạng thái, chỉ khác đúng một biến.
  const a = khoFixture({ luat: 'eval', nghi: dong({}), status: 'verified' });
  const b = khoFixture({ luat: 'eval', nghi: dong({ by: '' }), status: 'verified' });
  const ha = the(a.r), hb = the(b.r);
  // Chuỗi mời ký phải CÓ THẬT trong bộ dựng thẻ — thẻ đổi chữ thì ca này đỏ,
  // thay vì lặng lẽ đo một câu không ai in nữa.
  const cardSrc = readFileSync(path.join(ROOT, 'scripts', 'gate-card.js'), 'utf8');
  const MOI_KY = MOI_KY_HANG;
  check('HSN-THE chuỗi mời ký CÓ THẬT trong bộ dựng thẻ', cardSrc.includes(MOI_KY));
  const got = [
    `nghỉ=${ha.includes('đã nghỉ') && ha.includes('ký giữ làm sử liệu') && !ha.includes(MOI_KY) ? 'nói-nghỉ+không-mời' : `KHÁC(${ha.includes('đã nghỉ')},${ha.includes('ký giữ làm sử liệu')},${ha.includes(MOI_KY)})`}`,
    `thiếu-vế=${hb.includes('thiếu by') && !hb.includes('đã nghỉ') && hb.includes(MOI_KY) ? 'cờ-vàng+vẫn-mời' : `KHÁC(${hb.includes('thiếu by')},${hb.includes('đã nghỉ')},${hb.includes(MOI_KY)})`}`,
  ];
  check('HSN-THE hai ca so BẰNG NHAU: nghỉ thì không mời ký · thiếu vế thì vẫn mời',
    got.join(' | ') === 'nghỉ=nói-nghỉ+không-mời | thiếu-vế=cờ-vàng+vẫn-mời', got);
}

console.log('\nHSN7 mutant — phá hàm thì CẢ BỐN bộ đọc lật');
{
  const sao = mkdtempSync(path.join(os.tmpdir(), 'hsn-mut-'));
  RAC.push(sao);
  execFileSync('bash', ['-c', `git -C ${JSON.stringify(ROOT)} archive HEAD scripts lib | tar -x -C ${JSON.stringify(sao)}`]);
  for (const f of ['lib/workspace-record.cjs', 'scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs',
    'scripts/start-scan.mjs', 'scripts/trang-thai-ho-so.cjs', 'scripts/gate-card.js']) {
    cpSync(path.join(ROOT, f), path.join(sao, f));
  }
  const libP = path.join(sao, 'lib', 'workspace-record.cjs');
  const truoc = readFileSync(libP, 'utf8');
  const sau = truoc.replace('function hoSoNghi({ ledgerText = null',
    'function hoSoNghi(_bo) { return null; }\nfunction hoSoNghiCu({ ledgerText = null');
  check('HSN7 mũi tiêm CHỨNG MINH đổi được tệp', sau !== truoc);

  const { r } = khoFixture({ luat: 'eval', nghi: dong({}) });
  const chay = (rel, args) => spawnSync(rel.endsWith('.sh') ? 'bash' : process.execPath,
    [path.join(sao, rel), ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  // ĐỐI CHỨNG DƯƠNG trên CHÍNH bản sao, TRƯỚC khi tiêm: bốn bộ đọc phải nói
  // «nghỉ». Thiếu vế này thì mọi đường chết (thẻ vỡ vì lib, sai slug, exit 127)
  // đều đọc thành «đã lật» — assertion vắng-mặt một mình.
  const chayO = (goc, rel, args) => {
    const x = spawnSync(rel.endsWith('.sh') ? 'bash' : process.execPath,
      [path.join(goc, rel), ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return { status: x.status, stdout: x.stdout || '', out2: `${x.stdout || ''}${x.stderr || ''}` };
  };
  const bonBoDoc = (goc, kho) => {
    const g = chayO(goc, 'scripts/pre-merge-check.sh', [kho, '--no-t1-escape']);
    const rc = chayO(goc, 'scripts/recheck-evidence.cjs', [path.join(kho, '_acceptance', 'hsn', 'evidence-report.md')]);
    const scOut = chayO(goc, 'scripts/start-scan.mjs', ['--root', kho]).stdout;
    const x = scOut ? oSlug(JSON.parse(scOut)) : null;
    const tc = (chayO(goc, 'scripts/gate-card.js', ['--root', kho, '--slug', 'hsn']).stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
    return [
      `cổng=${g.status === 0 && g.out2.includes('hồ sơ nghỉ') ? 'xanh+nghỉ' : g.status !== 0 && g.out2.includes(CHUOI.eval) ? 'đỏ-đúng-luật' : `KHÁC(${g.status})`}`,
      `kiểm-lại=${rc.status === 0 && rc.out2.includes('bỏ kiểm lại') ? 'xanh+nghỉ' : rc.status !== 0 && rc.out2.includes('REPIN x') ? 'đỏ-đúng-luật' : `KHÁC(${rc.status})`}`,
      `bộ-quét=${x ? x.stateKey : 'KHÔNG-ĐỌC-ĐƯỢC'}`,
      `thẻ=${tc.includes('đã nghỉ') ? 'nói-nghỉ' : tc.includes(MOI_KY_HANG) ? 'mời-ký' : 'RỖNG-HOẶC-LẠ'}`,
    ];
  };
  const truocTiem = bonBoDoc(sao, r);
  check('HSN7 đối chứng dương: bản CHƯA tiêm, bốn bộ đọc đều nói nghỉ',
    truocTiem.join(' | ') === 'cổng=xanh+nghỉ | kiểm-lại=xanh+nghỉ | bộ-quét=da-nghi | thẻ=nói-nghỉ', truocTiem);
  writeFileSync(libP, sau);
  const got = bonBoDoc(sao, r);
  check('HSN7 cả bốn bộ đọc lật khi hàm bị phá (thông điệp ghim, thẻ phải MỜI KÝ chứ không rỗng)',
    got.join(' | ') === 'cổng=đỏ-đúng-luật | kiểm-lại=đỏ-đúng-luật | bộ-quét=da-giao | thẻ=mời-ký', got);
}

for (const r of RAC) { try { rmSync(r, { recursive: true, force: true }); } catch { /* dọn best-effort */ } }
console.log(`\nResults: ${pass} passed, ${fail} failed (ho-so-nghi)`);
process.exit(fail ? 1 : 0);
