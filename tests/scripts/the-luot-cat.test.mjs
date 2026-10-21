// the-luot-cat.test.mjs — thẻ lượt cắt (`cat-luot.mjs --the`), trường `chay_sau`, và mốc chốt phạm vi của nhịp
// (`--nhip` đọc dòng seal Cổng 1 sớm nhất của sổ quyết định). Ca TL-1…TL-11.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm); bản phạm vi viết bằng dòng mẫu rút từ khuôn
// skills/acceptance/references/pham-vi-template.md (round-trip writer/reader). Ca đỏ chạy trên BẢN SAO của vật với
// nhát tiêm khớp đúng một lần, SAU khi bản lành xanh trên cùng dữ liệu; thông điệp ghim. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'the-luot-cat-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.TL_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = args => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

let bsN = 0;
function banSao(tiem) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const chayCa = async (id, f) => { try { const s = await f(KIT); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};

let khoN = 0;
function kho(files = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  for (const [p, t] of Object.entries(files)) { mkdirSync(path.dirname(path.join(r, p)), { recursive: true }); writeFileSync(path.join(r, p), typeof t === 'string' ? t : JSON.stringify(t, null, 2) + '\n'); }
  writeFileSync(path.join(r, '.keep'), ''); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thu');
  return r;
}
const chayCL = (kit, r, args) => node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, ...args]);

// ── Nhịp: mốc chốt phạm vi ──────────────────────────────────────────────────
// Lệnh duyệt Cổng 1 GHI ĐÈ approved_at mỗi lần mở lại cổng (commands/approve.md bước 5), còn sổ quyết định giữ mọi dòng seal
// — đo 21/10 trên crm: 36/291 hồ sơ đã ký có approved_at muộn hơn lần chốt đầu (vd agent-builder-noi-tieng-viet: 09-06 → 09-16).
const HD = (tier, approved) => `---\nschema_version: 1\nfeature: x\nslug: x\nowner: x@y.z\nrisk_tier: ${tier}\nsurfaces: [cli]\nstatus: implemented\napproved_by: M\napproved_at: ${approved}T03:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV = ky => `---\nschema_version: 2\nfeature_slug: x\nverdict: PASS\nhuman_signoff: ${ky}\n---\n`;
const SEAL = (at, gate = 1) => JSON.stringify({ id: `d-${at.replace(/[-:]/g, '')}-1`, type: 'seal', gate, at });
async function tl1(kit) {
  const sai = [];
  // [slug, approved_at, dòng sổ, ngày ký, số ngày mong đợi]
  const CA = [
    ['mo-lai', '2026-09-10', [SEAL('2026-09-01T02:00:00Z'), SEAL('2026-09-10T02:00:00Z')], '2026-09-12', 11],
    ['khong-so', '2026-09-05', null, '2026-09-08', 3],
    ['seal-muon', '2026-09-05', [SEAL('2026-09-07T02:00:00Z')], '2026-09-09', 4],
    ['seal-cong-2', '2026-09-05', [SEAL('2026-09-01T02:00:00Z', 2), '{hỏng', JSON.stringify({ type: 'approach', at: '2026-08-01T00:00:00Z' })], '2026-09-06', 1],
  ];
  const files = {};
  for (const [s, ap, so, ky] of CA) {
    files[`_acceptance/${s}/contract.md`] = HD('T2', ap); files[`_acceptance/${s}/evidence-report.md`] = EV(`Manh Phan ${ky}`);
    if (so) files[`_acceptance/${s}/decisions.jsonl`] = so.join('\n') + '\n';
  }
  const x = chayCL(kit, kho(files), ['--nhip']); let j;
  try { j = JSON.parse(x.stdout); } catch { return [`--nhip không ra JSON: exit ${x.status} ${x.stderr.trim()}`]; }
  const a = CA.map(c => c[4]).sort((p, q) => p - q); const tv = (a[1] + a[2]) / 2;
  if (j.hang.T2.n !== 4 || j.hang.T2.trung_vi !== tv) sai.push(`T2 ${JSON.stringify(j.hang.T2)} ≠ n 4 trung vị ${tv} — mốc chốt phải là dòng seal Cổng 1 sớm nhất`);
  // Một hồ sơ mở lại: trung vị phải đúng 11 (không phải 2 của approved_at bị ghi đè).
  const x1 = chayCL(kit, kho({ '_acceptance/a/contract.md': HD('T3', '2026-09-10'), '_acceptance/a/evidence-report.md': EV('M 2026-09-12'), '_acceptance/a/decisions.jsonl': SEAL('2026-09-01T02:00:00Z') + '\n' }), ['--nhip']);
  const j1 = JSON.parse(x1.stdout); if (j1.hang.T3.trung_vi !== 11) sai.push(`hồ sơ mở lại Cổng 1: trung vị ${j1.hang.T3.trung_vi} ≠ 11 (đọc approved_at bị ghi đè)`);
  return sai;
}
if (want('TL-1') && await chayCa('TL-1', tl1)) ok('TL-1', 'nhịp tính từ dòng seal Cổng 1 sớm nhất; vắng sổ → approved_at; seal muộn hơn, seal Cổng 2, dòng hỏng không đổi mốc');
if (want('TL-1-do')) await chayDo('TL-1-do', tl1, [['scripts/cat-luot.mjs', 'const ngayChot = (c, so = null) =>', 'const ngayChot = (c, so = null, _ = so = null) =>']], 'seal Cổng 1', 'bản sao bỏ sổ quyết định khỏi mốc chốt');

// ── Thẻ lượt cắt ────────────────────────────────────────────────────────────
// Bản phạm vi viết bằng dòng mẫu của khuôn (round-trip: dòng mã rút từ khối PHAM-VI-MA của chính tệp khuôn).
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
function vietPV(dot, ma, kit = KIT) {
  const khoi = khoiMd(readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'pham-vi-template.md'), 'utf8'), 'PHAM-VI-MA');
  const mau = khoi.split('\n').find(l => l.startsWith('- `')); const m = mau.match(/^(- `)[^`]*(` — ).*$/);
  return `# Bản phạm vi thử\n\ndot: ${dot}\ndang: chuoi\nnguon: kho thử\n\n${ma.map(([c, t]) => `${m[1]}${c}${m[2]}${t}`).join('\n')}\n`;
}
const R = (ma, x = {}) => ({ ma, dot: 'd1', cau_giao: `«Người dùng làm việc ${ma}»`, vai: 'Người dùng', vi_sao: 'v', hang: 'T3', tieu_chi: 9, ten_ngan: `Việc ${ma}`, bat_khi: `xong ${ma}`, ...x });
// Đợt mẫu: bảy mã → năm hàng (B đứng trên A thật; C chạy sau A vì cùng tệp; D lẻ; E dưới mục tiêu, T2) + hai mục chờ.
const LT_MAU = () => ({ schema: 1, moc: [], hang: [
  R('A', { phu: ['P1'] }), R('B', { phu: ['P2'], dung_tren: ['A'] }), R('C', { phu: ['P3'], chay_sau: ['A'] }), R('D', { phu: ['P4'] }),
  R('E', { phu: ['P5'], tieu_chi: 5, hang: 'T2' }), { ma: 'Z', dot: 'cu', cau_giao: '«việc đời trước»', vi_sao: 'v', hang: 'T2' }],
  chan_troi: [{ ma: 'H1', dot: 'd1', cau_giao: '«sau»', ly_do: 'chờ dữ liệu thật', mo_lai_khi: 'có khách thứ hai', phu: ['P6'] },
    { ma: 'H2', dot: 'd1', cau_giao: '«sau nữa»', ly_do: 'chưa ai cần', phu: ['P7'] }, { ma: 'H9', dot: 'cu', cau_giao: '«đợt trước»', ly_do: 'cũ', phu: ['Q9'] }] });
const MA7 = [['P1', 'mô tả một'], ['P2', 'mô tả hai'], ['P3', 'mô tả ba'], ['P4', 'mô tả bốn'], ['P5', 'mô tả năm'], ['P6', 'mô tả sáu'], ['P7', 'mô tả bảy']];
const khoThe = (lt = LT_MAU(), them = {}) => kho({ 'docs/pv.md': vietPV('d1', MA7), 'docs/lt.json': lt, ...them });
const the = (kit, r, them = []) => chayCL(kit, r, ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json', '--the', ...them]);
const muc = (md, ten) => { const i = md.indexOf(`### ${ten}`); if (i < 0) return null; const j = md.indexOf('\n### ', i + 1); return md.slice(i, j < 0 ? undefined : j); };
const RA2 = ['--ra', 'Gửi danh sách phòng ban · nhân sự · trước 01/11', '--ra', 'Đào tạo trưởng nhóm · chủ kho'];

async function tl2(kit) {
  const sai = []; const x = the(kit, khoThe(), RA2); const md = x.stdout;
  if (x.status !== 0) return [`exit ${x.status} (cần 0): ${x.stderr.trim()}`];
  const TEN = ['Đợt trong bốn con số', 'Mã nào về đâu', 'hàng chạy thành', 'Cỡ từng hàng', 'Cảnh báo của đợt', 'Chưa làm — mục chờ điều kiện', 'Ra khỏi kho', 'Ngày', 'Sau khi gộp'];
  const vt = TEN.map(t => md.indexOf(`### ${t}`.replace('### hàng', '### 5 hàng')));
  if (vt.some(v => v < 0) || vt.some((v, i) => i && v < vt[i - 1])) sai.push(`mục thiếu hay sai thứ tự: ${TEN.filter((t, i) => vt[i] < 0).join(', ') || vt.join(',')}`);
  if (!md.includes('**Răng phủ: xanh** — 7 mã') || md.indexOf('Việc của người gộp PR') > md.indexOf('### Đợt')) sai.push('đầu thẻ phải nói răng xanh rồi việc của người gộp PR trước mọi mục');
  if (!md.includes('| 7 | 5 | 2 | 2 |')) sai.push('bốn con số ≠ 7 mã · 5 hàng · 2 mục chờ · 2 việc của người');
  // Mỗi mã của bản phạm vi một dòng, về đúng chỗ của bảng phủ, kèm mô tả của bản phạm vi.
  const C = await import(path.join(kit, 'scripts', 'cat-luot.mjs') + `?v=${++bsN}`);
  const kq = C.kiemPhu(C.docPhamVi(vietPV('d1', MA7)), LT_MAU());
  for (const b of kq.bang) { const d = (muc(md, 'Mã nào về đâu') || '').split('\n').find(l => l.startsWith(`| \`${b.ma}\` |`)); const ve = b.cho.replace(/^hàng /, '').replace(/^chờ điều kiện /, '');
    if (!d || !d.includes(`**${ve}**`) || !d.includes(MA7.find(m => m[0] === b.ma)[1])) sai.push(`mã ${b.ma}: dòng ${JSON.stringify(d)} không về ${ve}`); }
  if (md.includes('việc đời trước')) sai.push('hàng ngoài đợt lọt vào thẻ');
  return sai;
}
if (want('TL-2') && await chayCa('TL-2', tl2)) ok('TL-2', 'chín mục đúng thứ tự, răng xanh + việc của người đứng đầu, bốn con số, mỗi mã về đúng chỗ của bảng phủ, hàng ngoài đợt không lọt');
if (want('TL-2-do')) await chayDo('TL-2-do', tl2, [['scripts/the-luot-cat.mjs', "const cho = (Array.isArray(data.chan_troi) ? data.chan_troi : []).filter(c => c && typeof c === 'object' && chuoi(c.dot) === pv.dot);", "const cho = (Array.isArray(data.chan_troi) ? data.chan_troi : []).filter(c => c && typeof c === 'object');"]], 'bốn con số', 'bản sao đếm mục chờ mọi đợt');

async function tl3(kit) {
  const sai = []; const md = the(kit, khoThe(), RA2).stdout; const d = muc(md, '5 hàng chạy thành') || '';
  if (!d.startsWith('### 5 hàng chạy thành 3 dãy')) sai.push(`tiêu đề dãy: ${d.split('\n')[0]} (cần 3 dãy: A·B·C, D, E)`);
  const dong = ma => d.split('\n').find(l => l.includes(`**${ma}** Việc ${ma}`)) || '';
  if (!dong('B').includes('_cần A đã giao_')) sai.push(`B phải nối thật với A: ${dong('B')}`);
  if (!dong('C').includes('_chạm cùng tệp với A_')) sai.push(`C phải nối cùng tệp với A: ${dong('C')}`);
  if (/_/.test(dong('D').replace(/\*\*/g, ''))) sai.push(`D không nối gì: ${dong('D')}`);
  if (d.includes('Chưa hàng nào của đợt khai `chay_sau`')) sai.push('đợt có chay_sau mà thẻ vẫn nói chưa khai');
  // Đường đọc-cũ: lộ trình không có chay_sau → C thành dãy riêng, thẻ nói rõ dãy chỉ tính từ dung_tren.
  const cu = LT_MAU(); delete cu.hang[2].chay_sau; const d2 = muc(the(kit, khoThe(cu), RA2).stdout, '5 hàng chạy thành') || '';
  if (!d2.startsWith('### 5 hàng chạy thành 4 dãy') || !d2.includes('Chưa hàng nào của đợt khai `chay_sau`')) sai.push(`đường đọc-cũ: ${d2.split('\n')[0]}`);
  // Hàng nối ra ngoài đợt: in tên kèm «ngoài đợt», không kéo hàng ngoài đợt vào dãy.
  const n = LT_MAU(); n.hang[3].dung_tren = ['Z']; const d3 = muc(the(kit, khoThe(n), RA2).stdout, '5 hàng chạy thành') || '';
  if (!d3.includes('_cần Z (ngoài đợt) đã giao_') || d3.includes('**Z**')) sai.push('nối ra ngoài đợt phải in «Z (ngoài đợt)» và không vẽ Z thành hàng');
  return sai;
}
if (want('TL-3') && await chayCa('TL-3', tl3)) ok('TL-3', 'dãy = thành phần liên thông dung_tren ∪ chay_sau; nối thật và nối cùng tệp mang nhãn khác nhau; vắng chay_sau → nói rõ; nối ra ngoài đợt có nhãn');
if (want('TL-3-do')) await chayDo('TL-3-do', tl3, [['scripts/the-luot-cat.mjs', "...mang(r.chay_sau).map(x => [x, 'tep'])", "...mang(r.chay_sau).map(x => [x, 'that'])"]], 'cùng tệp', 'bản sao gọi nối cùng tệp là nối thật');

async function tl4(kit) {
  const sai = [];
  const CA = [['khong-co', h => { h[3].chay_sau = ['Q']; }, 'hàng D: chạy sau mã không có: Q'], ['chinh-no', h => { h[3].chay_sau = ['D']; }, 'hàng D: chạy sau chính nó'],
    ['hai-lan', h => { h[1].chay_sau = ['A']; }, 'hàng B: nối A hai lần'], ['sai-kieu', h => { h[3].chay_sau = 'A'; }, 'hàng D: chay_sau phải là một mảng'],
    ['vong', h => { h[0].chay_sau = ['C']; }, 'vòng nối dung_tren/chay_sau: A → C → A — thứ tự không xếp được']];
  for (const [ten, f, cau] of CA) {
    const lt = LT_MAU(); f(lt.hang); const x = chayCL(kit, khoThe(lt), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json']);
    if (x.status !== 1 || !x.stdout.split('\n').some(l => l.startsWith(`lỗi: ${cau}`))) sai.push(`${ten}: exit ${x.status}, cần «lỗi: ${cau}»`);
  }
  // Đối chứng: lộ trình mẫu (có chay_sau hợp lệ) xanh; cùng lỗi ở hàng ngoài đợt chỉ là cảnh báo.
  const lanh = chayCL(kit, khoThe(), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json']); if (lanh.status !== 0) sai.push(`lộ trình mẫu đỏ: ${lanh.stdout.split('\n').filter(l => l.startsWith('lỗi')).join(' · ')}`);
  const ng = LT_MAU(); ng.hang[5].chay_sau = ['Q']; const x = chayCL(kit, khoThe(ng), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json']);
  if (x.status !== 0 || !x.stdout.includes('cảnh báo: hàng Z: chạy sau mã không có: Q')) sai.push(`ngoài đợt: exit ${x.status}, cần cảnh báo`);
  // Vòng nằm trọn ngoài đợt (dù hàng của đợt đứng trên nó) → cảnh báo; vòng chỉ gồm dung_tren → răng không xét, như trước.
  const v1 = LT_MAU(); v1.hang.push({ ma: 'Y', dot: 'cu', cau_giao: '«y»', vi_sao: 'v', hang: 'T2', chay_sau: ['Z'] }); v1.hang[5].dung_tren = ['Y']; v1.hang[3].dung_tren = ['Y'];
  const y1 = chayCL(kit, khoThe(v1), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json']);
  if (y1.status !== 0 || !y1.stdout.includes('cảnh báo: vòng nối dung_tren/chay_sau: Y → Z → Y')) sai.push(`vòng ngoài đợt: exit ${y1.status}, cần một dòng cảnh báo`);
  const v2 = LT_MAU(); v2.hang[0].dung_tren = ['B'];
  const y2 = chayCL(kit, khoThe(v2), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json']);
  if (y2.status !== 0 || y2.stdout.includes('vòng nối')) sai.push(`vòng chỉ dung_tren A ⇄ B: exit ${y2.status} — răng cũ không xét, không được đổi`);
  return sai;
}
if (want('TL-4') && await chayCa('TL-4', tl4)) ok('TL-4', 'chay_sau: mã không có · chính nó · trùng dung_tren · sai kiểu · khép vòng → lỗi ở hàng trong đợt; lộ trình mẫu xanh; ngoài đợt → cảnh báo; vòng ngoài đợt → cảnh báo; vòng chỉ dung_tren → không xét');
if (want('TL-4-do ngoai-dot')) await chayDo('TL-4-do ngoai-dot', tl4, [['scripts/cat-luot.mjs', "(c.some(x => trongDot(theoMa.get(x))) ? loi : canhBao).push(`vòng", "(loi).push(`vòng"]], 'vòng ngoài đợt', 'bản sao tính vòng ngoài đợt là lỗi của đợt');
if (want('TL-4-do dung-tren')) await chayDo('TL-4-do dung-tren', tl4, [['scripts/cat-luot.mjs', "if (c.slice(0, -1).some((x, i) => cs(theoMa.get(x)).includes(c[i + 1]))) vong.set", "vong.set"]], 'dung_tren A ⇄ B', 'bản sao xét cả vòng chỉ dung_tren');
if (want('TL-4-do')) await chayDo('TL-4-do', tl4, [['scripts/cat-luot.mjs', "  for (const [v, c] of vong) (", "  for (const [v, c] of []) ("]], 'vong', 'bản sao bỏ luật khép vòng');

async function tl5(kit) {
  const sai = []; const lt = LT_MAU(); lt.hang[3].tieu_chi = 11; lt.hang[5].tieu_chi = 20;
  const x = the(kit, khoThe(lt), [...RA2, '--giu', 'E: gộp vào A thì quá ngưỡng tách']); const d = muc(x.stdout, 'Cảnh báo của đợt') || '';
  const sau = cau => { const L = d.split('\n'); const i = L.findIndex(l => l.startsWith(`- hàng ${cau}`)); return i < 0 ? null : L[i + 1] || ''; };
  if (sau('E [duoi-muc-tieu]') !== '  - Giữ vì: gộp vào A thì quá ngưỡng tách') sai.push(`E phải mang lý do giữ: ${sau('E [duoi-muc-tieu]')}`);
  if (!(sau('D [tren-muc-tieu]') || '').includes('**Chưa ghi lý do giữ**')) sai.push(`D chưa có lý do phải nói ra: ${sau('D [tren-muc-tieu]')}`);
  const ngoai = d.slice(d.indexOf('<details>'));
  if (d.indexOf('<details>') < 0 || !ngoai.includes('[can-tach] 1 hàng ngoài đợt d1 — Z') || d.slice(0, d.indexOf('<details>')).includes('ngoài đợt d1')) sai.push('cảnh báo ngoài đợt phải nằm trong khối gập, không lẫn vào cảnh báo của đợt');
  const y = the(kit, khoThe(lt), [...RA2, '--giu', 'E thiếu dấu hai chấm']); if (y.status !== 2 || !y.stderr.includes('--giu phải dạng')) sai.push(`--giu sai dạng: exit ${y.status} (cần 2)`);
  return sai;
}
if (want('TL-5') && await chayCa('TL-5', tl5)) ok('TL-5', 'cảnh báo của đợt (theo dòng cua-dot của SKILL) kèm lý do giữ hoặc «chưa ghi»; ngoài đợt vào khối gập; --giu sai dạng → thoát 2');
if (want('TL-5-do')) await chayDo('TL-5-do', tl5, [['skills/cat-luot/SKILL.md', 'cua-dot: ^cảnh báo: (hàng|mốc) .+? \\[[a-z-]+\\]:', 'cua-dot: ^cảnh báo: ']], 'khối gập', 'bản sao SKILL nới dòng cua-dot');

async function tl6(kit) {
  const sai = [];
  const ra = them => muc(the(kit, khoThe(), them).stdout, 'Ra khỏi kho') || '';
  const so = them => (the(kit, khoThe(), them).stdout.match(/\| 7 \| 5 \| 2 \| ([^|]+) \|/) || [])[1];
  if (!ra([]).includes('**Chưa khai.**') || so([]) !== 'chưa khai') sai.push('vắng --ra phải nói «chưa khai» ở mục và ở bốn con số');
  if (!ra(['--ra', '-']).includes('Không có việc nào (đã khai).') || so(['--ra', '-']) !== '0') sai.push('--ra - phải khai 0 việc');
  const r2 = ra(RA2);
  if (!r2.includes('| Gửi danh sách phòng ban | nhân sự | trước 01/11 |') || !r2.includes('| Đào tạo trưởng nhóm | chủ kho | — |')) sai.push(`--ra tách việc · ai · khi: ${r2}`);
  const x = chayCL(kit, khoThe(), ['--pham-vi', 'docs/pv.md', '--lo-trinh', 'docs/lt.json', '--ra', 'x']); if (x.status !== 2) sai.push(`--ra không --the: exit ${x.status} (cần 2)`);
  return sai;
}
if (want('TL-6') && await chayCa('TL-6', tl6)) ok('TL-6', '«Ra khỏi kho» từ --ra: vắng → chưa khai, «-» → 0, dòng tách việc · ai · khi; --ra không --the → thoát 2');
if (want('TL-6-do')) await chayDo('TL-6-do', tl6, [['scripts/the-luot-cat.mjs', "  if (!ds.length) return null;\n", "  if (!ds.length) return [];\n"]], 'chưa khai', 'bản sao coi vắng lời khai là không có việc');

async function tl7(kit) {
  const sai = [];
  // Ba vòng T3 đã ký: 0, 0, 3 ngày (trung vị 0, hai vòng ký cùng ngày chốt); không vòng T2 nào.
  const hs = {}; [['a', 0], ['b', 0], ['c', 3]].forEach(([s, n]) => { hs[`_acceptance/${s}/contract.md`] = HD('T3', '2026-09-01'); hs[`_acceptance/${s}/evidence-report.md`] = EV(`M 2026-09-0${1 + n}`); });
  const lt = LT_MAU(); lt.moc = [{ ten: 'Bản đầu', ngay: '2026-11-02', loai: 'phat-hanh', hang: ['A'] }];
  const d = muc(the(kit, khoThe(lt, hs), RA2).stdout, 'Ngày') || '';
  if (!d.includes('- **A**: chưa ghi ngày · gắn mốc «Bản đầu» 2026-11-02')) sai.push('hàng gắn mốc phải in mốc và ngày');
  if (!d.includes('4/5 hàng chưa có ngày và không gắn mốc nào: B, C, D, E.')) sai.push('phải đếm hàng chưa có ngày');
  if (!d.includes('Nhịp hạng T3 (`--nhip`): trung vị 0 ngày') || !d.includes('trên 3 vòng đã ký; 2 vòng ký ngay trong ngày chốt')) sai.push(`nhịp T3: ${d}`);
  if (!d.includes('Nhịp hạng T2: kho chưa có vòng hạng T2 nào đã ký')) sai.push('hạng chưa đo được nhịp phải nói không đặt ngày');
  const j = JSON.parse(chayCL(kit, khoThe(lt, hs), ['--nhip']).stdout); if ('cung_ngay' in j.hang.T3) sai.push('JSON của --nhip không được đổi khoá');
  return sai;
}
if (want('TL-7') && await chayCa('TL-7', tl7)) ok('TL-7', 'ngày: hàng gắn mốc in mốc; hàng chưa ngày đếm đủ; nhịp theo hạng kèm số vòng ký cùng ngày; hạng n 0 → không đặt ngày; JSON --nhip không đổi');
if (want('TL-7-do')) await chayDo('TL-7-do', tl7, [['scripts/the-luot-cat.mjs', 'cung_ngay} vòng ký ngay trong ngày chốt', 'n} vòng ký ngay trong ngày chốt']], 'nhịp T3', 'bản sao in sai số vòng ký cùng ngày');

async function tl8(kit) {
  const sai = []; const d = muc(the(kit, khoThe(), RA2).stdout, 'Sau khi gộp') || '';
  const t3 = d.slice(d.indexOf('**T3**'), d.indexOf('**T2**')); const t2 = d.slice(d.indexOf('**T2**'));
  if (!t3.startsWith('**T3** (A, B, C, D) — trần 4') || !t2.startsWith('**T2** (E) — trần 3')) sai.push(`nhóm theo hạng: ${d.slice(0, 200)}`);
  if (!t3.includes('**Duyệt kế hoạch** — _người — vì T3_') || t2.includes('Duyệt kế hoạch')) sai.push('duyệt kế hoạch chỉ ở T3');
  for (const c of ['Cổng Đáng', 'Cổng Phạm vi', 'Cổng Bằng chứng', 'Cổng Giá trị']) if (!t3.includes(`**${c}**`) || !t2.includes(`**${c}**`)) sai.push(`thiếu ${c}`);
  if (!t2.includes('**Cổng Phạm vi** — _máy đi tiếp khi đủ điều kiện')) sai.push('T2: Cổng Phạm vi đi làn V khi đủ điều kiện');
  return sai;
}
if (want('TL-8') && await chayCa('TL-8', tl8)) ok('TL-8', 'cổng sau khi gộp theo hạng: T3 có duyệt kế hoạch và bốn cổng người; T2 không duyệt kế hoạch, Cổng Phạm vi đi tiếp khi đủ điều kiện');
if (want('TL-8-do')) await chayDo('TL-8-do', tl8, [['scripts/the-luot-cat.mjs', "['Duyệt kế hoạch', 'người — vì T3',", "['Duyệt bản kế hoạch', 'người — vì T3',"]], 'duyệt kế hoạch', 'bản sao đổi tên bước duyệt kế hoạch');

async function tl9(kit) {
  const sai = []; const lt = LT_MAU(); lt.hang[0].phu = []; const r = khoThe(lt);
  const truoc = git(r, 'status', '--porcelain', '--ignored'); const x = the(kit, r, RA2);
  if (x.status !== 1 || !x.stdout.includes('**Răng phủ: ĐỎ — 1 lỗi.** Đừng gộp PR') || !x.stdout.includes('- lỗi: mã P1 không ở hàng hay mục chờ điều kiện nào')) sai.push(`răng đỏ: exit ${x.status}, thẻ phải nói ĐỎ và in lỗi`);
  if (git(r, 'status', '--porcelain', '--ignored') !== truoc) sai.push('thẻ ghi tệp vào kho');
  return sai;
}
if (want('TL-9') && await chayCa('TL-9', tl9)) ok('TL-9', 'răng đỏ → thẻ vẫn dựng, mở đầu bằng ĐỎ + từng lỗi, thoát 1; thẻ không ghi gì vào kho');
if (want('TL-9-do')) await chayDo('TL-9-do', tl9, [['scripts/cat-luot.mjs', "    process.exit(loi.length ? 1 : 0);\n  }\n  const ra = [", "    process.exit(0);\n  }\n  const ra = ["]], 'răng đỏ', 'bản sao thẻ thoát 0 khi răng đỏ');

// Mã trùng và lời khai sai: răng đỏ vẫn ra thẻ (không nổ); --ra/--giu sai dạng thoát 2; lý do giữ thừa được nêu.
async function tl11(kit) {
  const sai = []; const lt = LT_MAU(); lt.hang.push(R('A', { phu: [] }));
  const x = the(kit, khoThe(lt), RA2);
  if (x.status !== 1 || !x.stdout.includes('- lỗi: mã trùng: A') || x.stderr.trim()) sai.push(`mã trùng: exit ${x.status}, stderr «${x.stderr.trim().slice(0, 80)}» — thẻ phải dựng và in lỗi`);
  for (const [them, cau] of [[['--ra', '-', '--ra', 'x'], '--ra - (không có việc nào)'], [['--ra', '  · ai'], '--ra cần một việc'], [['--nhip', '--ra', 'x'], '--the không đi với']]) {
    const y = them[0] === '--nhip' ? chayCL(kit, khoThe(), ['--the', ...them]) : the(kit, khoThe(), them);
    if (y.status !== 2 || !y.stderr.includes(cau)) sai.push(`${them.join(' ')}: exit ${y.status} (cần 2, «${cau}»)`);
  }
  const t = muc(the(kit, khoThe(), [...RA2, '--giu', 'Q: không có hàng này']).stdout, 'Cảnh báo của đợt') || '';
  if (!t.includes('**Lý do giữ cho mã không có cảnh báo nào:** `Q`')) sai.push('lý do giữ cho mã không có cảnh báo phải được nêu');
  return sai;
}
if (want('TL-11') && await chayCa('TL-11', tl11)) ok('TL-11', 'mã trùng → thẻ vẫn dựng, in lỗi, thoát 1; --ra mâu thuẫn · rỗng, --the với --nhip → thoát 2; --giu thừa được nêu');
if (want('TL-11-do')) await chayDo('TL-11-do', tl11, [['scripts/the-luot-cat.mjs', '  const hang = hangVao.filter((r, i) => hangVao.findIndex(x => x._ma === r._ma) === i);', '  const hang = hangVao;']], 'mã trùng', 'bản sao bỏ khử mã trùng khi dựng dãy');

// SKILL bước 4 chạy được: lệnh trong khối CAT-LUOT-THE, thay chỗ giữ bằng tệp thử, thoát 0 trên kho mẫu.
async function tl10(kit) {
  const sk = readFileSync(path.join(kit, 'skills', 'cat-luot', 'SKILL.md'), 'utf8'); const k = khoiMd(sk, 'CAT-LUOT-THE');
  if (!k) return ['SKILL thiếu khối CAT-LUOT-THE'];
  const lenh = k.split('\n').find(l => l.includes('cat-luot.mjs')) || '';
  const m = lenh.match(/cat-luot\.mjs" (.*)$/); if (!m) return [`khối CAT-LUOT-THE không có lệnh cat-luot.mjs: ${lenh}`];
  const args = m[1].replace('<bản phạm vi>', 'docs/pv.md').replace('<tệp lộ trình>', 'docs/lt.json').match(/"[^"]*"|\S+/g).map(a => a.replace(/^"|"$/g, ''))
    .map(a => a.replace('<việc> · <ai> · <khi>', 'Gửi danh sách · nhân sự · 01/11').replace('<mã>: <lý do>', 'E: lý do'));
  const r = khoThe(); const i = args.indexOf('--root'); if (i >= 0) args.splice(i, 2);
  const x = node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, ...args]);
  return x.status === 0 && x.stdout.startsWith('## Thẻ lượt cắt') ? [] : [`lệnh của SKILL bước 4 (CAT-LUOT-THE): exit ${x.status} ${x.stderr.trim()}`];
}
if (want('TL-10') && await chayCa('TL-10', tl10)) ok('TL-10', 'lệnh thẻ trong khối CAT-LUOT-THE của SKILL chạy được, ra thẻ');
if (want('TL-10-do')) await chayDo('TL-10-do', tl10, [['skills/cat-luot/SKILL.md', '--root . --the --pham-vi', '--root . --thẻ --pham-vi']], 'CAT-LUOT-THE', 'bản sao SKILL gõ sai cờ --the');

console.log(`\nResults: ${pass} passed, ${fail} failed (the-luot-cat)`);
process.exit(fail ? 1 : 0);
