// vong-don-le-tra-tri-thuc.test.mjs — hồ sơ vong-don-le-tra-tri-thuc (TT5, đợt tri-thuc-2410). Ca TD-1…TD-9.
//
// Mọi kho thử dựng trong thư mục tạm của lượt (git init + commit thật). Trang tri thức SINH từ khối TRI-THUC-TRANG rút từ
// khuôn tri-thuc-template.md thật; dòng sổ của hồ sơ khác ghi bằng khối lệnh DEC-ID-RECIPE rút từ SKILL feature-loop thật
// (bash); lệnh tra chạy qua khối TRI-THUC-TRA-MO-TA rút từ SKILL ở các ca hợp đồng đòi; ô mở từ hàng SINH bằng chính lệnh
// mở ô. «Bộ máy trước vòng» = git archive GOC_VONG scripts lib skills feature-loop commands. Bản tiêm là bản sao trọn các
// thư mục ấy của cây, nhát tiêm khớp đúng một lần. Đường dẫn suy từ vị trí tệp. Mỗi ca đỏ chạy đối chứng xanh trước trên
// cùng đầu vào; ma trận viết sẵn, số hàng in ra. Chuỗi kỳ vọng chép từ hợp đồng, không rút từ mô-đun được đo.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, realpathSync, existsSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
// Gốc vòng: nhánh chính lúc cắt vòng (#409 gộp TT4). Vòng sau đổi thẻ hay lệnh đếm thì dời hằng này tới gốc vòng ấy.
const GOC_VONG = '396c08f82b5db61cbeb556cf09b65fca6ed0ddc0';
const THU_MUC = ['scripts', 'lib', 'skills', 'feature-loop', 'commands'];
const KHUON_TT = readFileSync(path.join(KIT, 'skills/acceptance/references/tri-thuc-template.md'), 'utf8');
const SKILL_TEP = path.join(KIT, 'feature-loop/skills/feature-loop/SKILL.md');
const TAM = realpathSync(mkdtempSync(path.join(tmpdir(), 'td-tra-')));
const NGAY = '2026-10-25';
let soDo = 0;
const ok = (ca, m) => console.log(`PASS: ${ca} — ${m}`);
const bad = (ca, m) => { soDo++; console.log(`FAIL: ${ca} — ${m}`); };
const ca = async (ten, fn) => { try { const r = await fn(); if (r && r.length) bad(ten, r.join(' ; ')); else ok(ten, 'đạt'); } catch (e) { bad(ten, `ném lỗi: ${e.stack || e}`); } };

// Chuỗi ghim — chép từ hợp đồng.
const S = {
  khongLienQuan: 'đã tra, không có trang liên quan',
  kd: 'không đọc được ở đây:',
  chuaKhai: 'chưa khai tri_thuc',
  chanSo: 'CHƯA vào được Cổng Phạm vi: chưa tra sổ quyết định của hồ sơ trước',
  soVang: 'dòng sổ hồ sơ trước không có: ',
  duongDo: 'đường đo tri thức: 2/4 hồ sơ có dòng tra có căn cứ trỏ trang hay sổ trước',
};

const khoiRao = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const KHOI_TRANG = khoiRao(KHUON_TT, 'TRI-THUC-TRANG');
const [L_NEN, L_CHU_DE, L_DOT] = khoiRao(KHUON_TT, 'TRI-THUC-LOAI').trim().split(/\s+/);

const g = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bam = p => execFileSync('git', ['hash-object', '--', p], { encoding: 'utf8' }).trim();
const ghi = (p, t) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, t); };
let dem = 0; const thuMuc = ten => { const d = path.join(TAM, `${ten}-${++dem}`); mkdirSync(d, { recursive: true }); return d; };
const khoGit = d => { mkdirSync(d, { recursive: true }); g(d, 'init', '-q', '-b', 'main'); g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't'); return d; };
const commit = (d, m = 'c') => { g(d, 'add', '-A'); g(d, 'commit', '-q', '--allow-empty', '-m', m); };
const giaiHtml = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const ENV = { ...process.env, ACCEPTANCE_TODAY: NGAY };
const chay = (bin, args, cwd, input) => { const r = spawnSync('node', [bin, ...args], { encoding: 'utf8', env: ENV, cwd, input, maxBuffer: 1 << 26 }); return { thoat: r.status, out: r.stdout || '', err: r.stderr || '' }; };

// Trang sinh từ khối TRI-THUC-TRANG; thân mang tiêu đề và mục.
const trangTu = (v, than = 'Nội dung.') => KHOI_TRANG.replace(/^([A-Za-z_]+):.*$/gm, (m, k) => (k in v ? `${k}: ${v[k]}` : m)) + `\n\n${than}\n`;
const RAW = 'raw/2026-10-25-vi-du';
function dungGoc(G, trang) {
  ghi(path.join(G, RAW, 'ghi-chu.md'), 'ghi chú gốc\n');
  ghi(path.join(G, RAW, 'nguon.md'), `---\nloai: phien\ngoc: x\nluc: ${NGAY}\nai: t\n---\n\n- \`ghi-chu.md\` ${bam(path.join(G, RAW, 'ghi-chu.md'))}\n`);
  for (const [p, [v, than]] of Object.entries(trang)) ghi(path.join(G, p), trangTu({ ...v, nguon: `[${RAW}/ghi-chu.md]`, cap_nhat: NGAY }, than));
}
// Bốn trang của TD-1 cộng một nền: khớp ở tiêu đề · chỉ ở tiêu đề mục · chỉ ở giá trị frontmatter · không chỗ nào.
const CAU_TD1 = 'Vòng đơn lẻ tra sổ quyết định cho QX7';
const TRANG_TD1 = {
  'wiki/nen/nen.md': [{ loai: L_NEN, ma: '[]' }, '# Nền chung của kho'],
  'wiki/chu-de/a-tieu-de.md': [{ loai: L_CHU_DE, ma: '[]' }, '# Sổ quyết định của hồ sơ trước\n\nThân không lặp chữ.'],
  'wiki/chu-de/b-muc.md': [{ loai: L_CHU_DE, ma: '[]' }, '# Ghi chép khác\n\n## Tra sổ quyết định\n\nThân.'],
  'wiki/chu-de/c-fm.md': [{ loai: L_CHU_DE, ma: '[QX7]' }, '# Trang ba\n\nThân.'],
  'wiki/chu-de/d-khong.md': [{ loai: L_CHU_DE, ma: '[]' }, '# Thời tiết hôm nay\n\n## Mưa rào\n\nThân.'],
};
const KHOP_TD1 = ['wiki/nen/nen.md', 'wiki/chu-de/a-tieu-de.md', 'wiki/chu-de/b-muc.md', 'wiki/chu-de/c-fm.md'];

const CFG_GOC = 'schema_version: 1\ngap_probe: required\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\nlo_trinh:\n  tep: docs/plans/lo-trinh.json\n';
const CFG_NOI = 'tri_thuc:\n  noi: docs/tri-thuc\n';
const cfgKho = duong => `tri_thuc:\n  kho:\n    ten: tt-rieng\n    duong: ${duong}\n`;
const TT4 = (JSON.parse(readFileSync(path.join(KIT, 'docs/plans/lo-trinh-kit.json'), 'utf8')).hang || []).find(h => h && h.ma === 'TT4');
const [K_DOT, K_PHU] = ['dot', 'phu'].map(k => { if (!TT4 || !(k in TT4)) throw new Error(`hàng TT4 thật thiếu khoá ${k}`); return k; });
const CAU_GIAO_X = 'Việc X của đợt d1';
const LO = { schema: 1, ten: 'Lộ trình thử', moc: [], hang: [
  { ma: 'X', slug: 'viec-x', hang: 'T2', [K_DOT]: 'd1', [K_PHU]: ['A1'], cau_giao: CAU_GIAO_X, bat_khi: 'X chạy được' },
], da_bac: [] };
function khoThu({ tt = CFG_NOI, trang = TRANG_TD1 } = {}) {
  const d = khoGit(thuMuc('kho'));
  ghi(path.join(d, '_acceptance/config.yaml'), CFG_GOC + tt);
  ghi(path.join(d, 'docs/plans/lo-trinh.json'), JSON.stringify(LO, null, 2) + '\n');
  ghi(path.join(d, 'README.md'), 'Kho thử của ca TD — câu trích làm căn cứ nằm ở dòng này cho bộ xếp.\n');
  if (trang) dungGoc(path.join(d, 'docs/tri-thuc'), trang);
  commit(d);
  return d;
}
const G_NOI = kho => path.join(kho, 'docs/tri-thuc');
const tro = (G, p, ten = '') => `${ten ? `${ten}:` : ''}${p}#${bam(path.join(G, p))}`;
const conTro = (kho, ref) => chay(path.join(KIT, 'scripts/tri-thuc.mjs'), ['--root', kho, '--con-tro', ref]);
const moO = (kho, ma) => chay(path.join(KIT, 'scripts/lo-trinh.mjs'), ['--root', kho, '--hang', ma, '--mo-o', '--owner', 'x@y.z']);

// Hồ sơ thử: hợp đồng ba tiêu chí, evals, phản biện sạch, sổ (chuỗi đã nối).
const hopDong = (slug, status = 'draft', n = 3) => `---\nschema_version: 1\nfeature: F\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${status === 'draft' ? '' : 'approved_by: A\napproved_at: 2026-10-05T00:00:00Z\n'}---\n\n## Criteria\n\n${Array.from({ length: n }, (_, i) => `- AC-${i + 1}: Given a${i}, When b${i}, Then c${i}.`).join('\n')}\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n- y.\n`;
const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n    expected: xanh\n';
const PROBE = slug => `---\nslug: ${slug}\nat: 2026-10-25T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
function hoSo(kho, slug, { status = 'draft', so = '', n = 3 } = {}) {
  const d = path.join(kho, '_acceptance', slug);
  ghi(path.join(d, 'contract.md'), hopDong(slug, status, n));
  ghi(path.join(d, 'evals.yaml'), EVALS);
  ghi(path.join(d, 'gap-probe.md'), PROBE(slug));
  ghi(path.join(d, 'decisions.jsonl'), so);
  return d;
}
let soDong = 0;
const dongSo = o => JSON.stringify({ id: `d-20261025T000000Z-${++soDong}`, type: 'approach', stage: 'S1', at: '2026-10-25T00:00:00Z', decision: 'd', why: 'w', cost_if_wrong: 'c', ...o }) + '\n';
const MOT_LOI = { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Kho đã khai tri_thuc — bỏ tra là phạm luật nạp.' };

// Khuôn SKILL → sổ qua khối lệnh DEC-ID-RECIPE (bash).
const khoiDong = (t, ten) => { const m = t.match(new RegExp(`<!-- <<<${ten} -->\\n([^\\n]+)\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`SKILL thiếu khối ${ten} (một dòng)`); return m[1]; };
const congThuc = t => { const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/); if (!m) throw new Error('SKILL thiếu khối DEC-ID-RECIPE'); return m[1].split('\n'); };
function chayCongThuc(kho, slug, giua, skill) {
  const [l1, , l3] = congThuc(skill);
  const r = spawnSync('bash', ['-c', `${l1.replace('<slug>', slug)}\n${giua}\n${l3}\n`], { cwd: kho, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`khối lệnh DEC-ID-RECIPE thoát ${r.status}: ${r.stderr}`);
  const ls = readFileSync(path.join(kho, '_acceptance', slug, 'decisions.jsonl'), 'utf8').trim().split('\n');
  return JSON.parse(ls[ls.length - 1]);
}
// Dòng sổ thường qua công thức: dòng giữa dựng từ khuôn ba vế của công thức thật, thêm phần đuôi tuỳ ý.
function ghiDong(kho, slug, { stage = 'S1', decision, them = '' }, skill = readFileSync(SKILL_TEP, 'utf8')) {
  const giuaGoc = congThuc(skill)[1];
  const dien = { '<type>': 'approach', '<stage>': stage, '<ISO>': '2026-10-25T00:00:00Z', '<1 câu>': decision, '<vì sao, 1 câu>': 'w', '<sai thì tốn gì, 1 câu>': 'c' };
  const giua = Object.entries(dien).reduce((s, [a, b]) => s.split(a).join(b), giuaGoc) + them;
  return chayCongThuc(kho, slug, giua, skill);
}
// Dòng tra từ khối DEC-TRI-THUC-TRA thật, ô điền từ đối tượng lệnh tra in.
function ghiTra(kho, slug, dt, { skill = readFileSync(SKILL_TEP, 'utf8'), them = '' } = {}) {
  const k = khoiDong(skill, 'DEC-TRI-THUC-TRA');
  for (const o of ['"<đường trỏ băm>"', '"<đường trỏ sổ>"', '<mã hàng hoặc câu tra>']) if (!k.includes(o)) throw new Error(`khối DEC-TRI-THUC-TRA thiếu ô ${o}`);
  const cau = JSON.stringify(dt.tra).slice(1, -1);
  let giua = k.split('<ISO>').join('2026-10-25T00:00:00Z').split('<mã hàng hoặc câu tra>').join(cau)
    .split('"<đường trỏ băm>"').join(dt.trang.map(x => JSON.stringify(x)).join(','))
    .split('"<đường trỏ sổ>"').join(dt.so.map(x => JSON.stringify(x)).join(','));
  if (dt.khong_doc) giua = giua.replace(/\]\}$/, `],"khong_doc":${JSON.stringify(dt.khong_doc)}}`);
  return chayCongThuc(kho, slug, giua + them, skill);
}

// Lệnh tra: trực tiếp (stdin) hoặc qua khối TRI-THUC-TRA-MO-TA của SKILL (bash, heredoc của khối).
const tra = (may, kho, cau, them = []) => chay(path.join(may, 'scripts/tri-thuc.mjs'), ['--root', kho, '--tra', ...them], kho, cau);
const traJson = (may, kho, cau, them = []) => { const r = tra(may, kho, cau, ['--json', ...them]); let j = null; try { j = JSON.parse(r.out); } catch { /* ca báo */ } return { ...r, j }; };
function khoiTra(skill) {
  const m = skill.match(/<!-- <<<TRI-THUC-TRA-MO-TA -->\n```\n([\s\S]*?)\n```\n<!-- TRI-THUC-TRA-MO-TA>>> -->/);
  if (!m) throw new Error('SKILL thiếu khối TRI-THUC-TRA-MO-TA');
  return m[1];
}
function chayKhoiTra(may, kho, slug, cau, skill = readFileSync(SKILL_TEP, 'utf8')) {
  const k = khoiTra(skill);
  const ag = k.replace(/^AG=\$\([^\n]*?\) && /, `AG='${may}' && `);
  if (ag === k) throw new Error('khối TRI-THUC-TRA-MO-TA: không thay được bước giải gói AG=$(…)');
  for (const o of ['<slug>', '<câu mô tả hoặc câu giao>']) if (!ag.includes(o)) throw new Error(`khối TRI-THUC-TRA-MO-TA thiếu ô ${o}`);
  const sc = ag.replace('<slug>', slug).replace('<câu mô tả hoặc câu giao>', () => cau);
  const r = spawnSync('bash', ['-c', sc], { cwd: kho, encoding: 'utf8', env: ENV });
  const dong = (r.stdout || '').split('\n').find(l => l.startsWith('tri_thuc_tra: '));
  return { thoat: r.status, out: r.stdout || '', err: r.stderr || '', dt: dong ? JSON.parse(dong.slice('tri_thuc_tra: '.length)) : null };
}

// Thẻ Cổng 1: HTML + --extract.
function the(may, kho, slug) {
  const bin = path.join(may, 'scripts/gate-card.js');
  const h = chay(bin, ['--root', kho, '--slug', slug, '--gate', '1']);
  const x = chay(bin, ['--root', kho, '--slug', slug, '--gate', '1', '--extract']);
  let j = null; try { j = JSON.parse(x.out); } catch { /* ca báo */ }
  return { html: h.out, xout: x.out, j, err: h.err + x.err };
}
const quyet = t => (t.j && typeof t.j.one_shot === 'string' ? t.j.one_shot.trim().split(/\s+/).pop() : null);
const coTriThuc = html => [...html.matchAll(/<div class="flag (fred|fwarn) tri-thuc">([\s\S]*?)<\/div>/g)].map(m => ({ lop: m[1], van: giaiHtml(m[2]).replace(/^⚠\s*/, '') }));
const coVang = html => coTriThuc(html).filter(c => c.lop === 'fwarn');

// Bộ máy trước vòng và bản tiêm.
let MAY_CU = null;
function mayCu() {
  if (MAY_CU) return MAY_CU;
  const d = thuMuc('may-cu');
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', GOC_VONG, ...THU_MUC], { maxBuffer: 1 << 28 }) });
  return (MAY_CU = d);
}
function banCay() { const d = thuMuc('may-cay'); for (const x of THU_MUC) cpSync(path.join(KIT, x), path.join(d, x), { recursive: true }); return d; }
function banTiem(sua) {
  const d = banCay();
  for (const [tep, [tim, thay]] of Object.entries(sua)) {
    const p = path.join(d, tep); const t = readFileSync(p, 'utf8'); const n = t.split(tim).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần ở ${tep}: ${tim}`);
    writeFileSync(p, t.replace(tim, thay));
    if (readFileSync(p, 'utf8') === t) throw new Error(`nhát tiêm không áp ở ${tep}`);
  }
  return d;
}

// ── TD-1 (AC-1): tra trang theo câu mô tả ─────────────────────────────────────────────────────────────────────────────
function soTD1(may) {
  const sai = []; const k = khoThu(); const G = G_NOI(k);
  const a = traJson(may, k, CAU_TD1); const b = traJson(may, k, CAU_TD1);
  if (a.thoat !== 0 || !a.j) return [`lệnh tra thoát ${a.thoat}: ${a.err.slice(0, 200)}`];
  const ra = a.j.tri_thuc_tra.trang;
  for (const p of Object.keys(TRANG_TD1)) console.log(`  TD-1 ${p}: ${ra.some(r => r.startsWith(`${p}#`)) ? 'có' : 'vắng'} trong trang ra`);
  const mong = KHOP_TD1.map(p => tro(G, p)).sort();
  if (JSON.stringify([...ra].sort()) !== JSON.stringify(mong)) sai.push(`trang ra ${JSON.stringify(ra)} ≠ ${JSON.stringify(mong)}`);
  if (a.out !== b.out) sai.push('hai lần chạy cho đầu ra khác nhau');
  for (const r of ra) { const c = conTro(k, r); if (c.thoat !== 0) sai.push(`--con-tro ${r} thoát ${c.thoat}`); }
  const c2 = traJson(may, k, 'Bánh mì nướng giòn buổi sáng');
  if (!c2.j || JSON.stringify(c2.j.tri_thuc_tra.trang) !== JSON.stringify([tro(G, 'wiki/nen/nen.md')])) sai.push(`câu không khớp: trang ${JSON.stringify(c2.j && c2.j.tri_thuc_tra.trang)} ≠ chỉ trang nền`);
  const k3 = khoThu({ trang: Object.fromEntries(Object.entries(TRANG_TD1).filter(([p]) => !p.includes('/nen/'))) });
  const c3 = tra(may, k3, 'Bánh mì nướng giòn buổi sáng'); const c3j = traJson(may, k3, 'Bánh mì nướng giòn buổi sáng');
  console.log(`  TD-1 kho không nền: thoát ${c3.thoat} · trang ${JSON.stringify(c3j.j && c3j.j.tri_thuc_tra.trang)}`);
  if (c3.thoat !== 0) sai.push(`kho không nền: thoát ${c3.thoat}`);
  if (!c3j.j || c3j.j.tri_thuc_tra.trang.length !== 0) sai.push('kho không nền: trang không rỗng');
  if (!c3.out.includes(S.khongLienQuan)) sai.push(`kho không nền: văn bản thiếu «${S.khongLienQuan}»`);
  return sai;
}
await ca('TD-1', () => soTD1(KIT));
await ca('TD-1-mutant', () => {
  const doi = soTD1(KIT); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/tri-thuc.mjs': ['Object.values(fm), muc);', 'Object.values(fm));'] });
  const sai = soTD1(m);
  return sai.some(s => s.includes('trang ra')) ? [] : [`bỏ quét tiêu đề mục mà trang vẫn ra — bản tiêm cho: ${sai.join(' ; ') || 'xanh'}`];
});

// ── TD-2 (AC-2): tra sổ quyết định của hồ sơ trước ──────────────────────────────────────────────────────────────────────
const CAU_SO = 'tra sổ quyết định hồ sơ trước';
function khoTD2() {
  const k = khoThu();
  const id = {};
  for (const s of ['dang-chay', 'ho-a', 'ho-b', 'ho-c']) hoSo(k, s);
  id.minh = ghiDong(k, 'dang-chay', { decision: 'Của chính vòng: tra sổ quyết định của hồ sơ trước cho mọi vòng' }).id;
  id.nguoi = ghiDong(k, 'ho-a', { stage: 'gate1', decision: 'Chủ kho chốt tra sổ quyết định của hồ sơ trước khi mở vòng', them: ',"decided_by":"Chủ Kho"' }).id;
  id.lac = ghiDong(k, 'ho-a', { decision: 'Bánh mì nướng giòn buổi sáng' }).id;
  appendFileSync(path.join(k, '_acceptance/ho-a/decisions.jsonl'), '{khong phai json\n');
  id.may = ghiDong(k, 'ho-b', { decision: 'Máy chọn tra sổ quyết định của hồ sơ trước cho mọi vòng' }).id;
  id.nhay = ghiDong(k, 'ho-b', { decision: 'Dòng có \\"nháy\\" và \\\\ gạch: tra sổ quyết định của hồ sơ trước ở mọi kho' }).id;
  id.cu = ghiDong(k, 'ho-c', { decision: 'Cũ: tra sổ quyết định của hồ sơ trước theo mã' }).id;
  id.thay = ghiDong(k, 'ho-c', { decision: 'Thay: tra sổ quyết định của hồ sơ trước theo câu', them: `,"supersedes":"${id.cu}"` }).id;
  id.vun = ghiDong(k, 'ho-c', { decision: 'tra sổ \\"quyết\\" định \\"hồ\\" sơ \\"trước\\"' }).id;
  commit(k);
  return { k, id };
}
function soTD2(may) {
  const sai = []; const { k, id } = khoTD2();
  const r = traJson(may, k, CAU_SO, ['--slug', 'dang-chay']);
  if (r.thoat !== 0 || !r.j) return [`lệnh tra thoát ${r.thoat}: ${r.err.slice(0, 200)}`];
  const so = r.j.tri_thuc_tra.so;
  console.log(`  TD-2 so: ${JSON.stringify(so)}`);
  const mong = [`ho-a#${id.nguoi}`, `ho-b#${id.may}`, `ho-b#${id.nhay}`, `ho-c#${id.thay}`, `ho-c#${id.vun}`];
  if (JSON.stringify([...so].sort()) !== JSON.stringify([...mong].sort())) sai.push(`so ${JSON.stringify(so)} ≠ ${JSON.stringify(mong)}`);
  if (so.some(x => x.startsWith('dang-chay#'))) sai.push('so có dòng của hồ sơ đang chạy');
  if (!(so.indexOf(`ho-a#${id.nguoi}`) >= 0 && so.indexOf(`ho-a#${id.nguoi}`) < so.indexOf(`ho-b#${id.may}`))) sai.push('dòng gate1 không đứng trước dòng S1 cùng điểm');
  for (const x of so) {
    const [hs, ma] = x.split('#');
    const t = readFileSync(path.join(k, '_acceptance', hs, 'decisions.jsonl'), 'utf8');
    if (!t.split('\n').some(l => { try { return JSON.parse(l).id === ma; } catch { return false; } })) sai.push(`${x} không trỏ dòng nào`);
  }
  const canh = r.err.trim().split('\n').filter(l => /dòng sổ hỏng/.test(l));
  if (canh.length !== 1 || !/\b1 dòng sổ hỏng/.test(canh[0])) sai.push(`stderr cảnh báo ${JSON.stringify(r.err)} — cần đúng một dòng nêu 1 dòng sổ hỏng`);
  const cc = r.j.so.filter(s => s.can_cu);
  console.log(`  TD-2 khối can_cu: ${cc.length}`);
  if (cc.length < 2) sai.push(`chỉ ${cc.length} khối can_cu`);
  for (const s of cc) {
    const tho = readFileSync(path.join(k, s.can_cu.tep), 'utf8').replace(/\s+/g, ' ');
    if (!tho.includes(s.can_cu.trich)) sai.push(`${s.tro}: trich không nằm nguyên văn trong chữ thô`);
    if (/["\\]/.test(s.can_cu.trich)) sai.push(`${s.tro}: trich chứa nháy kép hay gạch chéo ngược`);
  }
  const vun = r.j.so.find(s => s.tro === `ho-c#${id.vun}`);
  if (!vun || vun.can_cu) sai.push('dòng không đoạn sạch vẫn kèm khối can_cu (hoặc vắng)');
  return sai;
}
await ca('TD-2', () => soTD2(KIT));
await ca('TD-2-mutant', () => {
  const doi = soTD2(KIT); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['if (hs === slug) continue;', 'if (false) continue;'] });
  const sai = soTD2(m);
  return sai.some(s => s.includes('hồ sơ đang chạy')) ? [] : [`không loại hồ sơ đang chạy mà sổ vẫn sạch — bản tiêm cho: ${sai.join(' ; ') || 'xanh'}`];
});

// ── TD-3 (AC-3): kho riêng vắng · không khai · câu rỗng ─────────────────────────────────────────────────────────────────
await ca('TD-3', () => {
  const sai = [];
  const cha = thuMuc('td3'); const kho = path.join(cha, 'kho'); const rieng = path.join(cha, 'tt-rieng');
  khoGit(kho); ghi(path.join(kho, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng'));
  hoSo(kho, 'dang-chay'); hoSo(kho, 'ho-a'); const nguoi = ghiDong(kho, 'ho-a', { stage: 'gate1', decision: 'Chủ kho chốt tra sổ quyết định của hồ sơ trước khi mở vòng' }).id; commit(kho);
  const r = traJson(KIT, kho, CAU_SO, ['--slug', 'dang-chay']);
  const dt = r.j && r.j.tri_thuc_tra;
  console.log(`  TD-3 kho riêng vắng: thoát ${r.thoat} · ${JSON.stringify(dt)}`);
  if (r.thoat !== 0 || !dt) sai.push(`kho riêng vắng: thoát ${r.thoat} ${r.err.slice(0, 160)}`);
  else {
    if (dt.trang.length !== 0) sai.push('kho riêng vắng: trang không rỗng');
    if (typeof dt.khong_doc !== 'string' || !dt.khong_doc.startsWith(S.kd) || !dt.khong_doc.includes('tt-rieng')) sai.push(`khong_doc «${dt.khong_doc}»`);
    if (!dt.so.includes(`ho-a#${nguoi}`)) sai.push('kho riêng vắng: so thiếu dòng khớp');
  }
  khoGit(rieng); dungGoc(rieng, TRANG_TD1); commit(rieng);
  const r2 = traJson(KIT, kho, CAU_SO, ['--slug', 'dang-chay']);
  if (!r2.j || 'khong_doc' in r2.j.tri_thuc_tra) sai.push('đối chứng: kho riêng có ở máy mà vẫn khong_doc');
  if (r2.j && !r2.j.tri_thuc_tra.trang.some(x => x.startsWith('tt-rieng:wiki/nen/nen.md#'))) sai.push('đối chứng: trang nền kho riêng không mang tiền tố kho');
  const k0 = khoThu({ tt: '' }); const r3 = tra(KIT, k0, CAU_SO);
  console.log(`  TD-3 không khai: thoát ${r3.thoat} «${r3.err.trim()}» · câu rỗng: thoát ${tra(KIT, kho, '').thoat}`);
  if (r3.thoat !== 2 || !r3.err.includes(S.chuaKhai)) sai.push(`không khai: thoát ${r3.thoat} «${r3.err.trim()}»`);
  const r4 = tra(KIT, kho, '');
  if (r4.thoat !== 2) sai.push(`stdin rỗng: thoát ${r4.thoat}`);
  return sai;
});

// ── TD-4 (AC-4): câu độc đi qua khối lệnh của SKILL mà không chạy ───────────────────────────────────────────────────────
await ca('TD-4', () => {
  const sai = []; const k = khoThu(); hoSo(k, 'dang-chay'); commit(k);
  const canh = n => path.join(k, `CANH${n}`);
  const cau = `Câu \`touch ${canh(1)}\` và $(touch ${canh(2)}) có 'nháy đơn' "nháy kép"\ndòng hai`;
  const doiChung = thuMuc('td4-dc');
  spawnSync('bash', ['-c', `echo "${cau.split(k).join(doiChung)}" > /dev/null`], { cwd: doiChung });
  const docDc = existsSync(path.join(doiChung, 'CANH1')) && existsSync(path.join(doiChung, 'CANH2'));
  console.log(`  TD-4 đối chứng dương (câu trong nháy kép tạo tệp canh): ${docDc}`);
  if (!docDc) sai.push('đối chứng dương: câu không độc — nháy kép không chạy được backtick và $(...)');
  const r = chayKhoiTra(KIT, k, 'dang-chay', cau);
  console.log(`  TD-4 khối tra: thoát ${r.thoat} · tệp canh ${[1, 2].map(n => existsSync(canh(n))).join('/')}`);
  if (r.thoat !== 0) sai.push(`khối tra thoát ${r.thoat}: ${r.err.slice(0, 200)}`);
  if (existsSync(canh(1)) || existsSync(canh(2))) sai.push('tệp canh được tạo — câu đã chạy như lệnh');
  if (!r.dt || r.dt.tra !== cau) sai.push(`tra ${JSON.stringify(r.dt && r.dt.tra)} ≠ câu nguyên văn`);
  return sai;
});

// ── TD-5 (AC-5): thẻ kiểm mảng so ────────────────────────────────────────────────────────────────────────────────────
function hangTD5(may) {
  const { k, id } = khoTD2();
  const T = (so, status = 'draft') => { hoSo(k, 'the', { status, so: dongSo({ can_cu: MOT_LOI, tri_thuc_tra: { tra: 'X', trang: [], ...so } }) }); return the(may, k, 'the'); };
  const tot = [`ho-a#${id.nguoi}`, `ho-b#${id.may}`]; const vang = `ho-a#d-20990101T000000Z-1`;
  return [
    { hang: 1, t: T({}), chan: true },
    { hang: 2, t: T({ so: 'ho-a' }), chan: true },
    { hang: 3, t: T({ so: [] }), chan: false, co: [] },
    { hang: 4, t: T({ so: tot }), chan: false, co: [] },
    { hang: 5, t: T({ so: [tot[0], vang] }), chan: false, co: [S.soVang + vang] },
    { hang: 'approved', t: T({}, 'approved'), chan: false, co: [] },
  ];
}
function soTD5(hs, chiHang = null) {
  const sai = [];
  for (const h of hs) {
    if (chiHang && !chiHang.includes(h.hang)) continue;
    const tt = h.t.j && h.t.j.tri_thuc; const html = giaiHtml(h.t.html); const cv = coVang(h.t.html).map(c => c.van);
    console.log(`  TD-5 hàng ${h.hang}: chan=${tt && tt.chan} ô quyết=${quyet(h.t)} cờ=${JSON.stringify(cv)}`);
    if (!tt) { sai.push(`hàng ${h.hang}: --extract không có khoá tri_thuc (${h.t.err.slice(0, 160)})`); continue; }
    if (tt.chan !== h.chan) sai.push(`hàng ${h.hang}: chan ${tt.chan} ≠ ${h.chan}`);
    if (h.chan) {
      if (quyet(h.t) !== '___') sai.push(`hàng ${h.hang}: ô quyết «${quyet(h.t)}», cần «___»`);
      if (!html.includes(S.chanSo)) sai.push(`hàng ${h.hang}: thiếu dòng «${S.chanSo}»`);
    } else {
      if (h.hang !== 'approved' && quyet(h.t) !== 'duyệt') sai.push(`hàng ${h.hang}: ô quyết «${quyet(h.t)}»`);
      if (html.includes(S.chanSo)) sai.push(`hàng ${h.hang}: có dòng chặn khi không chặn`);
      const triThuc = cv.filter(c => c.startsWith(S.soVang) || c.includes('sổ quyết định'));
      if (h.hang === 'approved') { if (triThuc.length) sai.push(`hồ sơ approved có cờ sổ ${JSON.stringify(triThuc)}`); }
      else if (JSON.stringify(coTriThuc(h.t.html).map(c => c.van)) !== JSON.stringify(h.co)) sai.push(`hàng ${h.hang}: cờ tri thức ${JSON.stringify(coTriThuc(h.t.html).map(c => c.van))} ≠ ${JSON.stringify(h.co)}`);
    }
  }
  return sai;
}
await ca('TD-5', () => soTD5(hangTD5(KIT)));
await ca('TD-5-mutant', () => {
  const doi = soTD5(hangTD5(KIT), [1]); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['(!e || chuaTra.length > 0 || thieuSo)', '(!e || chuaTra.length > 0)'] });
  const h1 = hangTD5(m)[0]; const tt = h1.t.j && h1.t.j.tri_thuc;
  return tt && tt.chan === false ? [] : [`bỏ chặn thiếu so mà thẻ vẫn chặn — KHÔNG: bản tiêm cho chan ${tt && tt.chan}`];
});

// ── TD-6 (AC-6): khuôn SKILL → lệnh tra → sổ → thẻ và bộ xếp; hồ sơ mở từ hàng mang dòng «Nguồn:» ─────────────────────
function td6(skill, may = KIT) {
  const { k, id } = khoTD2();
  const r = chayKhoiTra(may, k, 'dang-chay', CAU_SO, skill);
  if (!r.dt) throw new Error(`khối tra không in đối tượng: ${r.err.slice(0, 200)}`);
  ghiTra(k, 'dang-chay', r.dt, { skill });
  const hit = JSON.parse(tra(may, k, CAU_SO, ['--json', '--slug', 'dang-chay']).out).so.find(s => s.tro === `ho-a#${id.nguoi}`);
  if (!hit || !hit.can_cu) throw new Error('lệnh tra không in khối can_cu cho dòng gate1');
  ghiDong(k, 'dang-chay', { decision: 'Chọn theo lời chủ kho ở cổng vòng trước', them: `,"can_cu":${JSON.stringify(hit.can_cu)}` }, skill);
  const t = the(KIT, k, 'dang-chay');
  const CC = require(path.join(KIT, 'scripts/can-cu-s1.cjs'));
  const base = g(k, 'rev-parse', 'HEAD');
  const kq = CC.phanLoaiSo(CC.docSo(readFileSync(path.join(k, '_acceptance/dang-chay/decisions.jsonl'), 'utf8')).entries, { root: k, slug: 'dang-chay', base });
  return { t, kq, dt: r.dt };
}
function td6Hang(may, skill = readFileSync(SKILL_TEP, 'utf8')) {
  const trang = {
    'wiki/nen/a-nen.md': [{ loai: L_NEN, ma: '[]' }, '# Nền'],
    'wiki/dot/d1.md': [{ loai: L_DOT, ma: '[A1]' }, '# Đợt một'],
    'wiki/chu-de/c-a1.md': [{ loai: L_CHU_DE, ma: '[A1]' }, '# Chủ đề riêng'],
  };
  const k = khoThu({ trang });
  const o = moO(k, 'X'); if (o.thoat !== 0) throw new Error(`mở ô X thoát ${o.thoat}: ${o.err}`);
  hoSo(k, 'viec-x'); commit(k);
  const r = chayKhoiTra(may, k, 'viec-x', CAU_GIAO_X, skill);
  if (!r.dt) throw new Error(`khối tra (từ hàng) không in đối tượng: ${r.err.slice(0, 200)}`);
  ghiTra(k, 'viec-x', r.dt, { skill });
  const nguon = Object.keys(trang).map(p => tro(G_NOI(k), p));
  return { t: the(KIT, k, 'viec-x'), dt: r.dt, nguon };
}
await ca('TD-6', () => {
  const sai = []; const skill = readFileSync(SKILL_TEP, 'utf8');
  const { t, kq, dt } = td6(skill);
  const tt = t.j && t.j.tri_thuc;
  console.log(`  TD-6: so=${JSON.stringify(dt.so)} chan=${tt && tt.chan} cờ=${JSON.stringify(coTriThuc(t.html).map(c => c.van))} bộ xếp=${JSON.stringify(kq.dong.map(d => [d.lop, d.ma]))}`);
  if (!tt || tt.chan !== false) sai.push(`thẻ chan ${tt && tt.chan}`);
  if (coTriThuc(t.html).length) sai.push('thẻ có cờ tri thức');
  const hai = kq.dong.slice(-2);
  if (hai.length !== 2 || !hai.every(d => d.lop === 'da-quyet')) sai.push(`bộ xếp (dòng tra, dòng căn cứ) ${JSON.stringify(hai.map(d => [d.lop, d.ma]))}`);
  const h = td6Hang(KIT, skill); const th = h.t.j && h.t.j.tri_thuc;
  console.log(`  TD-6 từ hàng: trang=${JSON.stringify(h.dt.trang)} chan=${th && th.chan}`);
  for (const n of h.nguon) if (!h.dt.trang.includes(n)) sai.push(`từ hàng: trang thiếu đường trỏ «Nguồn:» ${n}`);
  if (!th || th.chan !== false) sai.push(`từ hàng: chan ${th && th.chan} (${JSON.stringify(th && th.chua_tra)})`);
  return sai;
});
await ca('TD-6-mutant', () => {
  const skill = readFileSync(SKILL_TEP, 'utf8');
  const tiem = skill.replace(/(<!-- <<<DEC-TRI-THUC-TRA -->\n[^\n]*)"so":/, '$1"sx":');
  if (tiem === skill) throw new Error('mũi tiêm khuôn không áp');
  const { t } = td6(tiem); const tt = t.j && t.j.tri_thuc;
  return tt && tt.chan === true ? [] : [`đổi tên khoá so mà thẻ vẫn nhận — bản tiêm cho chan ${tt && tt.chan}`];
});
await ca('TD-6-mutant-nguon', () => {
  const h0 = td6Hang(KIT); if (!(h0.t.j && h0.t.j.tri_thuc && h0.t.j.tri_thuc.chan === false)) return ['đối chứng xanh đỏ: hồ sơ từ hàng chặn trên cây'];
  const m = banTiem({ 'scripts/tri-thuc.mjs': ['for (const r of o.conTro) them(', 'for (const r of []) them('] });
  const h = td6Hang(m); const tt = h.t.j && h.t.j.tri_thuc;
  return tt && tt.chan === true ? [] : [`bỏ đọc Nguồn mà thẻ vẫn nhận — bản tiêm cho chan ${tt && tt.chan}`];
});

// ── TD-7 (AC-7): lệnh đếm của đường đo ───────────────────────────────────────────────────────────────────────────────
function khoTD7(may) {
  const k = khoThu(); const G = G_NOI(k);
  hoSo(k, 'goc'); ghiDong(k, 'goc', { stage: 'gate1', decision: 'Chủ kho chốt tra sổ quyết định của hồ sơ trước khi mở vòng' });
  for (const s of ['h1', 'h2', 'h3', 'h4', 'h5']) hoSo(k, s);
  commit(k);
  ghiDong(k, 'h1', { decision: 'Một lựa chọn thường', them: `,"can_cu":${JSON.stringify(MOT_LOI)}` });
  const skill = readFileSync(SKILL_TEP, 'utf8');
  const slot = khoiDong(skill, 'DEC-CAN-CU-TRI-THUC');
  for (const s of ['h2', 'h3', 'h4', 'h5']) {
    const r = traJson(may, k, `${CAU_SO} ${CAU_TD1}`, ['--slug', s]);
    if (!r.j) throw new Error(`lệnh tra ${s}: ${r.err.slice(0, 200)}`);
    const tra1 = ghiTra(k, s, r.j.tri_thuc_tra);
    if (s === 'h3') ghiDong(k, s, { decision: 'Chọn theo trang tri thức', them: slot.split('<kho>:<trang>#<băm>').join(r.j.tri_thuc_tra.trang.find(x => x.startsWith('wiki/chu-de/'))) });
    if (s === 'h4') { const h = r.j.so.find(x => x.ho_so === 'goc' && x.can_cu); if (!h) throw new Error('lệnh tra không in can_cu cho sổ goc'); ghiDong(k, s, { decision: 'Chọn theo lời chủ kho', them: `,"can_cu":${JSON.stringify(h.can_cu)}` }); }
    if (s === 'h5') ghiDong(k, s, { decision: 'Chọn theo sổ của chính mình', them: `,"can_cu":${JSON.stringify({ nguon: 'muc-tieu', kho_dao: false, tep: `_acceptance/${s}/decisions.jsonl`, trich: tra1.decision })}` });
  }
  commit(k);
  return k;
}
const MONG_TD7 = { h1: [false, 0], h2: [true, 0], h3: [true, 1], h4: [true, 1], h5: [true, 0] };
function soTD7(may) {
  const sai = []; const k = khoTD7(KIT);
  const bin = path.join(may, 'scripts/can-cu-s1.cjs');
  const vb = chay(bin, ['--root', k, '--dem']); const js = chay(bin, ['--root', k, '--dem', '--json']);
  let rows = []; try { rows = JSON.parse(js.out); } catch { return [`--dem --json không đọc được: ${js.err.slice(0, 160)}`]; }
  for (const [s, [dt, n]] of Object.entries(MONG_TD7)) {
    const r = rows.find(x => x.slug === s); const dong = vb.out.split('\n').find(l => l.startsWith(`${s} · `)) || '';
    console.log(`  TD-7 ${s}: dong_tra=${r && r.dong_tra} can_cu_tri_thuc=${r && r.can_cu_tri_thuc} · văn bản «…${dong.slice(-60)}»`);
    if (!r || r.dong_tra !== dt || r.can_cu_tri_thuc !== n) sai.push(`${s}: ${JSON.stringify(r && [r.dong_tra, r.can_cu_tri_thuc])} ≠ ${JSON.stringify([dt, n])}`);
    if (!dong.includes(`dòng tra ${dt ? 'có' : 'không'} · căn cứ trỏ trang hay sổ trước ${n}`)) sai.push(`${s}: văn bản lệch JSON`);
  }
  const cuoi = vb.out.trim().split('\n').pop();
  console.log(`  TD-7 dòng cuối: «${cuoi}»`);
  if (cuoi !== S.duongDo) sai.push(`dòng cuối «${cuoi}» ≠ «${S.duongDo}»`);
  return sai;
}
await ca('TD-7', () => soTD7(KIT));
await ca('TD-7-mutant', () => {
  const doi = soTD7(KIT); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/can-cu-s1.cjs': ["d.lop === 'da-quyet' && troTriThuc(d.e.can_cu, slug)", 'troTriThuc(d.e.can_cu, null)'] });
  const sai = soTD7(m);
  return sai.some(s => s.includes('dòng cuối')) ? [] : [`đếm sổ của chính hồ sơ mà số vẫn 2/4 — bản tiêm cho: ${sai.join(' ; ') || 'xanh'}`];
});

// ── TD-8 (AC-8): đường trỏ kho riêng thiếu tiền tố kèm câu trích ───────────────────────────────────────────────────────
function soTD8(may) {
  const sai = []; const CC = require(path.join(may, 'scripts/can-cu-s1.cjs'));
  const cha = thuMuc('td8'); const kho = path.join(cha, 'kho'); const rieng = path.join(cha, 'tt-rieng');
  khoGit(kho); ghi(path.join(kho, '_acceptance/config.yaml'), CFG_GOC + cfgKho('../tt-rieng')); hoSo(kho, 'g'); commit(kho);
  khoGit(rieng); dungGoc(rieng, TRANG_TD1); commit(rieng);
  const kNoi = khoThu(); hoSo(kNoi, 'g'); commit(kNoi);
  const trich = 'câu trích chở từ trang tri thức sang sổ công khai';
  const dong = ref => ({ id: 'd-1', stage: 'S1', can_cu: { nguon: 'muc-tieu', kho_dao: false, tri_thuc: ref, trich } });
  const H = [
    ['kho riêng · không tiền tố', kho, tro(rieng, 'wiki/nen/nen.md'), 'do', 'tri-thuc-kem-trich'],
    ['chỉ noi · không tiền tố', kNoi, tro(G_NOI(kNoi), 'wiki/nen/nen.md'), 'da-quyet', undefined],
    ['kho riêng · có tiền tố', kho, tro(rieng, 'wiki/nen/nen.md', 'tt-rieng'), 'do', 'tri-thuc-kem-trich'],
  ];
  for (const [ten, root, ref, lop, ma] of H) {
    const d = CC.phanLoaiSo([dong(ref)], { root, slug: 'g' }).dong[0];
    console.log(`  TD-8 ${ten}: ${ref} → ${d.lop} ${d.ma || ''}`);
    if (d.lop !== lop || d.ma !== ma) sai.push(`${ten}: ${d.lop}/${d.ma} ≠ ${lop}/${ma}`);
  }
  return sai;
}
await ca('TD-8', () => soTD8(KIT));
await ca('TD-8-mutant', () => {
  const doi = soTD8(KIT); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/tri-thuc-tra.cjs': ['if ((m[1] || rieng) &&', 'if (m[1] &&'] });
  const sai = soTD8(m);
  return sai.some(s => s.startsWith('kho riêng · không tiền tố')) ? [] : [`luật theo tiền tố mà đường trỏ không tiền tố vẫn đỏ — bản tiêm cho: ${sai.join(' ; ') || 'xanh'}`];
});

// ── TD-9 (AC-9): kho không khai → năm đầu ra giống từng byte bộ máy trước vòng ─────────────────────────────────────────
const CHI_NGUOI = { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Giữ như cũ.', loi_khac: 'Đổi — tốn hai tiêu chí.' };
function khoTD9() {
  const kho = khoThu({ tt: '' });
  hoSo(kho, 'g1');
  hoSo(kho, 'g2', { so: dongSo({ can_cu: CHI_NGUOI }) });
  hoSo(kho, 'g3', { n: 11 });
  hoSo(kho, 'g4', { status: 'approved' });
  hoSo(kho, 'g5', { so: dongSo({ can_cu: { nguon: 'muc-tieu', kho_dao: false, tep: 'README.md', trich: 'câu trích làm căn cứ nằm ở dòng này cho bộ xếp' } }) });
  commit(kho);
  return kho;
}
function soTD9(may) {
  const sai = []; const kho = khoTD9();
  const dem2 = m => [chay(path.join(m, 'scripts/can-cu-s1.cjs'), ['--root', kho, '--dem']), chay(path.join(m, 'scripts/can-cu-s1.cjs'), ['--root', kho, '--dem', '--json'])];
  for (const s of ['g1', 'g2', 'g3', 'g4', 'g5']) {
    const a = the(may, kho, s); const b = the(mayCu(), kho, s);
    const ca1 = chay(path.join(may, 'scripts/can-cu-s1.cjs'), ['--root', kho, '--slug', s, '--json']);
    const cb = chay(path.join(mayCu(), 'scripts/can-cu-s1.cjs'), ['--root', kho, '--slug', s, '--json']);
    const [da, dja] = dem2(may); const [db, djb] = dem2(mayCu());
    console.log(`  TD-9 ${s}: HTML ${a.html.length}/${b.html.length} · JSON ${a.xout.length}/${b.xout.length} · bộ xếp ${ca1.out.length}/${cb.out.length} · đếm ${da.out.length}/${db.out.length} · đếm JSON ${dja.out.length}/${djb.out.length} byte (cây/trước vòng)`);
    if (!b.html.length || !b.xout.length || !db.out.length) sai.push(`${s}: bộ máy trước vòng không chạy được — ${b.err.slice(0, 160)}`);
    for (const [ten, x, y] of [['HTML', a.html, b.html], ['--extract', a.xout, b.xout], ['can-cu-s1 --json', ca1.out, cb.out], ['--dem', da.out, db.out], ['--dem --json', dja.out, djb.out]]) {
      if (!Buffer.from(x).equals(Buffer.from(y))) sai.push(`${s}: ${ten} lệch`);
    }
  }
  return sai;
}
await ca('TD-9', () => soTD9(KIT));
await ca('TD-9-mutant', () => {
  const doi = soTD9(KIT); if (doi.length) return [`đối chứng xanh đỏ: ${doi.join(' ; ')}`];
  const m = banTiem({ 'scripts/can-cu-s1.cjs': ['...(khai ? { dong_tra:', '...(true ? { dong_tra:'] });
  const sai = soTD9(m);
  return sai.some(s => s.endsWith('--dem --json lệch')) ? [] : [`luôn thêm khoá mà lệnh đếm vẫn im — bản tiêm cho: ${sai.join(' ; ') || 'mọi đầu ra bằng nhau'}`];
});

console.log(`\nvong-don-le-tra-tri-thuc: ${soDo ? `${soDo} ca đỏ` : 'mọi ca xanh'}`);
process.exit(soDo ? 1 : 0);
