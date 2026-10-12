'use strict';
// dinh-tuyen-may.cjs — máy tự định tuyến mục Ngoài-n mà chính máy đề xuất known-limits / wont-fix
// (hồ sơ ngoai-n-tu-dinh-tuyen). Kho bật `feature_loop.ngoai_n_tu_dinh_tuyen: true` thì mỗi mục như
// thế nhận MỘT dòng sổ `stage: gate2` mang dấu máy — bên đọc làn V (`daDinhTuyen` của
// lib/out-of-contract.cjs) đã nhận mọi dòng gate2 gọi tên Ngoài-n, nên làn V chạy được mà lib
// không đổi dòng nào.
//
//   node dinh-tuyen-may.cjs --write|--check --root <repo> --slug <slug>
//   node dinh-tuyen-may.cjs --soat-lech --root <repo>     (đếm ngưỡng của giới hạn dưới đây, chỉ đọc)
//   Thoát 0: đã ghi / không có gì để ghi / tắt / hồ sơ không đủ điều kiện (in một dòng lý do).
//   Thoát 2: khoá kho sai giá trị · dòng máy cũ trỏ mục đã đổi · lưới ghi từ chối hợp đồng.
//   Thoát 3: dùng sai lệnh, không đọc được hợp đồng.
//
// Dòng máy KHÔNG mang `decided_by`: scripts/ho-so-tom-tat.cjs (`laNguoi`) coi decided_by khác rỗng
// là người. Dấu máy là khoá `may`. Đọc-cũ: sổ không có dòng nào mang khoá đó → mọi bộ đọc như cũ.
//
// GIỚI HẠN ĐÃ KHAI (design §5): dòng máy cũ trỏ nhầm mục sau một lượt chấm mới — bên ghi này và
// thẻ bắt (so `tieu_de`, sau khi gỡ nhãn lượt), lưới trước-merge (lib) KHÔNG bắt. Ngưỡng mở vòng sửa
// lib: ≥1 hồ sơ có dòng máy lệch mục — đếm bằng `--soat-lech --root <repo>` (thoát 2 khi có), lệnh
// KHÔNG đọc khoá kho và KHÔNG xét điều kiện hồ sơ, nên đếm được cả hồ sơ đã máy thông hay đã ký.
const fs = require('fs');
const path = require('path');

const LIB = path.join(__dirname, '..', 'lib');
const core = require(path.join(LIB, 'evidence-core.cjs'));
const ooc = require(path.join(LIB, 'out-of-contract.cjs'));

const KHOA = 'feature_loop.ngoai_n_tu_dinh_tuyen';
const DAU_MAY = 'dinh-tuyen-ngoai-n';
const TOKEN_MAY = ['known-limits', 'wont-fix'];

// <<<DINH-TUYEN-MAY-LINE — MỘT nguồn của khuôn dòng máy; ca NT2 rút tập khoá từ đây.
const KHUON_DONG = '{"id":"d-<UTC>-<n>","type":"revisit","stage":"gate2","at":"<ISO>","decision":"Ngoài-<n>: <chữ người>","why":"<vì sao>","cost_if_wrong":"<giá>","may":"' + DAU_MAY + '","tieu_de":"<tiêu đề mục>","dao":"/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng mới; Ký"}';
// DINH-TUYEN-MAY-LINE>>>

const lenhDao = (slug, n) => `/acceptance-gate:signoff ${slug} Ngoài-${n}: ${ooc.OOC_GLOSS_NGUOI['new-contract']}; Ký`;
const GIA = {
  'known-limits': 'hạn chế còn trong bản ship tới khi có việc riêng sửa nó; người đảo bằng lệnh ở khoá dao',
  'wont-fix': 'lỗi được chấp nhận và không sửa; người đảo bằng lệnh ở khoá dao',
};

// Khoá kho. Vắng → tắt (hành vi trước vòng). Giá trị ngoài true|false → ném, gọi tên khoá.
function docKhoa(configText) {
  const v = configText == null ? null : core.resolveConfigKey(configText, KHOA);
  if (v == null) return { bat: false };
  const s = String(v).trim().toLowerCase();
  if (s === 'true') return { bat: true };
  if (s === 'false') return { bat: false };
  const e = new Error(`${KHOA}: "${v}" không hợp lệ — dùng true | false`);
  e.khoa = KHOA;
  throw e;
}

// Vế điều kiện hồ sơ. Năm mã đầu sau `status` là mã của khối EVIDENCE-XANH-SACH-BLOCK
// (skills/acceptance/references/evidence-report-template.md) — ca NT4 so tập; cùng regex
// UNCERTAIN với xanhSach của khong-can-nguoi.mjs, ca NT4 vi-phan đối chiếu hai bên.
const UNCERTAIN_RE = /(^|[^a-z])UNCERTAIN([^a-z]|$)/i;
const fm = (t, k) => (core.frontmatterField(t || '', k) || '').trim();
const VE = [
  { ma: 'status', xet: c => { const s = fm(c.contract, 'status').toLowerCase(); return s === 'verified' ? null : `status ${s || '(rỗng)'} (chỉ verified)`; } },
  { ma: 'verdict-pass', xet: c => { const v = fm(c.evidence, 'verdict'); return v === 'PASS' ? null : `verdict=${v || '(rỗng)'} (chỉ PASS)`; } },
  { ma: 'bypass', xet: c => { const b = fm(c.evidence, 'bypass_used').toLowerCase(); return ['true', '1', 'yes'].includes(b) ? `bypass_used=${b}` : null; } },
  { ma: 'enforcement', xet: c => (fm(c.evidence, 'enforcement_mode').toLowerCase() === 'off' ? 'enforcement_mode=off' : null) },
  { ma: 'tier', xet: c => { const t = fm(c.contract, 'risk_tier').toUpperCase(); return t === 'T2' ? null : `hạng ${t || '(rỗng)'} (chỉ T2)`; } },
  { ma: 'uncertain', xet: c => (UNCERTAIN_RE.test(c.evidence || '') ? 'có mục UNCERTAIN' : null) },
  { ma: 'triage', xet: c => (/^(true|yes|1)$/i.test(fm(c.evidence, 'triage_failed')) ? 'triage_failed: true (phân loại phạm vi không trọn)' : null) },
  { ma: 'findings-sai-khuon', xet: c => (c.p.suspect_empty ? 'review-findings.md có chữ trong «Ngoài hợp đồng» mà không đọc ra mục nào (sai khuôn OOC-ITEM-TEMPLATE)' : null) },
  { ma: 'chua-phan-loai', xet: c => (c.p.unclassified ? 'review-findings.md có khối «Chưa phân loại»' : null) },
];
function veTruot({ contract, evidence, findings }) {
  if (evidence == null) return { ma: 'verdict-pass', ly_do: 'không có evidence-report.md' };
  const c = { contract, evidence, p: ooc.parse(findings == null ? '' : findings) };
  for (const v of VE) { const ly = v.xet(c); if (ly) return { ma: v.ma, ly_do: ly }; }
  return null;
}

// Nhãn → SỐ (đơn và khoảng), cùng hình dạng NHAN_RE của lib/out-of-contract.cjs. So theo số
// để Ngoài-1 không lẫn Ngoài-11 (gap-probe F2).
const NHAN_RE = /Ngo[aà]i-(\d+)(?:\s*(?:đến|den|to|–|—|-)\s*Ngo[aà]i-(\d+))?/gi;
function soNhan(text) {
  const out = [];
  for (const m of String(text || '').matchAll(NHAN_RE)) {
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) out.push(i);
  }
  return out;
}
const GLOSS_TOKEN = Object.fromEntries(Object.entries(ooc.OOC_GLOSS_NGUOI).map(([k, v]) => [v, k]));
// Dòng gate2 MỚI NHẤT gọi tên mỗi nhãn — người viết sau máy thì người thắng.
function docDinhTuyen(ledgerText) {
  const map = new Map();
  for (const l of String(ledgerText || '').split('\n')) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (!e || typeof e !== 'object' || String(e.stage || '').trim().toLowerCase() !== 'gate2') continue;
    const sau = String(e.decision || '').replace(/^[^:]*:\s*/, '').trim();
    for (const n of soNhan(e.decision)) {
      map.set(n, { may: e.may === DAU_MAY, id: e.id || '', decision: String(e.decision || ''), tieu_de: e.tieu_de == null ? null : String(e.tieu_de), dao: e.dao || '', de_xuat: GLOSS_TOKEN[sau] || '' });
    }
  }
  return map;
}

// Nhãn lượt mà bước mang-sang của S4 chèn vào tiêu đề mục («X (r1)», «X (r1 · tệp đã đổi)») — cùng
// hình dạng nhóm nhãn của OOC_TITLE_RE trong lib/out-of-contract.cjs (bộ đọc chuẩn hoá hai cách viết
// về «<tiêu đề> (rN…)»). Gỡ nhãn trước khi so: cùng mục ở lượt sau không phải mục đã đổi.
const NHAN_LUOT_RE = /\s+\([rR](?:\d+|\?)(?:\s*[·,—–-][^()]*)?\)\s*$/;
const tieuDeGoc = s => String(s == null ? '' : s).replace(NHAN_LUOT_RE, '').trim();
// MỘT hàm so «cùng mục» — bên ghi, soát lệch và thẻ (scripts/gate-card.js) cùng gọi.
const cungMuc = (a, b) => a != null && b != null && tieuDeGoc(a) === tieuDeGoc(b);

// Kế hoạch thuần (không I/O) — bên CLI và test cùng gọi.
function keHoach({ contract, evidence, findings, ledger, config }) {
  if (!docKhoa(config).bat) return { tat: true };
  const tr = veTruot({ contract, evidence, findings });
  if (tr) return { truot: tr };
  const p = ooc.parse(findings == null ? '' : findings);
  const dt = docDinhTuyen(ledger);
  const lech = [], ghi = [];
  p.findings.forEach((f, i) => {
    const n = i + 1, d = dt.get(n);
    if (d) { if (d.may && !cungMuc(d.tieu_de, f.title)) lech.push({ n, cu: d.tieu_de, moi: f.title }); return; }
    if (TOKEN_MAY.includes(f.proposal)) ghi.push({ n, token: f.proposal, f });
  });
  return { lech, ghi };
}

const soDong = t => (t === '' ? 0 : t.split('\n').length - (t.endsWith('\n') ? 1 : 0));
const dauGio = d => d.toISOString().replace(/\.\d+Z$/, 'Z');

function dongMay(slug, g, idSo, now) {
  return {
    id: `d-${dauGio(now).replace(/[-:]/g, '')}-${idSo}`,
    type: 'revisit', stage: 'gate2', at: dauGio(now),
    decision: `Ngoài-${g.n}: ${ooc.OOC_GLOSS_NGUOI[g.token]}`,
    why: `máy tự định tuyến theo đề xuất S4 «${g.token}» — kho bật ${KHOA}`,
    cost_if_wrong: GIA[g.token],
    may: DAU_MAY, tieu_de: g.f.title, dao: lenhDao(slug, g.n),
  };
}

// Gạch Notes cho mục known-limits — vào ĐÚNG mục `## Notes` (trước heading kế), vắng thì tạo cuối tệp.
function themNotes(contract, gach) {
  if (!gach.length) return contract;
  const lines = contract.split('\n');
  const i = lines.findIndex(l => /^##\s+Notes\s*$/.test(l));
  if (i < 0) return contract.replace(/\n*$/, '\n') + '\n## Notes\n\n' + gach.join('\n') + '\n';
  let j = lines.findIndex((l, k) => k > i && /^#{1,2}\s/.test(l));
  if (j < 0) j = lines.length;
  let end = j;
  while (end > i + 1 && !lines[end - 1].trim()) end--;
  const truoc = lines.slice(0, end), sau = lines.slice(j);
  const chen = [...(end === i + 1 ? [''] : []), ...gach];
  return [...truoc, ...chen, ...(sau.length ? ['', ...sau] : [''])].join('\n');
}

// Soát lệch toàn kho — ngưỡng của giới hạn đã khai. Mỗi hồ sơ: dòng máy MỚI NHẤT của một nhãn mà
// không còn cùng mục ở vị trí ấy (hoặc vị trí ấy hết mục) là một lệch. Chỉ đọc.
function soatLech(root) {
  const goc = path.join(root, '_acceptance');
  const doc = f => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
  let ten = []; try { ten = fs.readdirSync(goc, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort(); } catch { return []; }
  const out = [];
  for (const slug of ten) {
    // (soát lệch KHÔNG xét điều kiện hồ sơ)
    const ledger = doc(path.join(goc, slug, 'decisions.jsonl'));
    if (!ledger || !ledger.includes(DAU_MAY)) continue;
    const p = ooc.parse(doc(path.join(goc, slug, 'review-findings.md')) || '');
    const lech = [];
    for (const [n, d] of docDinhTuyen(ledger)) {
      if (!d.may) continue;
      const f = p.findings[n - 1];
      if (!f || !cungMuc(d.tieu_de, f.title)) lech.push({ n, cu: d.tieu_de, moi: f ? f.title : '(không còn mục ở vị trí này)' });
    }
    if (lech.length) out.push({ slug, lech });
  }
  return out;
}

function chay(argv) {
  const get = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  if (argv.includes('--soat-lech')) {
    const root = get('--root');
    if (!root) { console.error('dinh-tuyen-may: dùng --soat-lech --root <repo>'); return 3; }
    const s = soatLech(root);
    console.log(`dinh-tuyen-may: ${s.length} hồ sơ có dòng máy lệch mục`);
    for (const h of s) console.log(`- ${h.slug}: ` + h.lech.map(x => `Ngoài-${x.n} dòng máy «${x.cu}» ≠ «${x.moi}»`).join(' · '));
    return s.length ? 2 : 0;
  }
  const mode = argv.includes('--write') ? 'write' : argv.includes('--check') ? 'check' : null;
  const root = get('--root'), slug = get('--slug');
  if (!mode || !root || !slug) { console.error('dinh-tuyen-may: dùng --write|--check --root <repo> --slug <slug>'); return 3; }
  const dir = path.join(root, '_acceptance', slug);
  const doc = f => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
  const contract = doc(path.join(dir, 'contract.md'));
  if (contract == null) { console.error(`dinh-tuyen-may: không đọc được ${path.join(dir, 'contract.md')}`); return 3; }
  const ledgerPath = path.join(dir, 'decisions.jsonl');
  const ledger = doc(ledgerPath) || '';
  let k;
  try {
    k = keHoach({ contract, evidence: doc(path.join(dir, 'evidence-report.md')), findings: doc(path.join(dir, 'review-findings.md')), ledger, config: doc(path.join(root, '_acceptance', 'config.yaml')) });
  } catch (e) { console.error(`dinh-tuyen-may: ${e.message}`); return 2; }
  if (k.tat) { console.log(`dinh-tuyen-may: tắt (${KHOA} vắng hoặc false)`); return 0; }
  if (k.truot) { console.log(`không định tuyến: ${k.truot.ly_do}`); return 0; }
  if (k.lech.length) {
    console.error('dinh-tuyen-may: dòng máy trỏ mục đã đổi — ' + k.lech.map(x => `Ngoài-${x.n}: dòng máy «${x.cu}» ≠ mục hiện tại «${x.moi}»`).join(' · '));
    return 2;
  }
  if (!k.ghi.length) { console.log('dinh-tuyen-may: 0 mục'); return 0; }
  const now = new Date();
  const base = soDong(ledger);
  const dong = k.ghi.map((g, i) => dongMay(slug, g, base + i + 1, now));
  const ngay = dauGio(now).slice(0, 10);
  const gach = k.ghi.filter(g => g.token === 'known-limits')
    .map(g => `- Ngoài-${g.n} (máy định tuyến ${ngay}, đề xuất S4 known-limits): ${g.f.plain || g.f.title}${g.f.file ? ' — `' + g.f.file + '`' : ''}`);
  const nextContract = themNotes(contract, gach);
  if (nextContract !== contract) {
    const r = core.evaluateContractWrite(nextContract, contract);
    if (r.anyFailure) { console.error(`dinh-tuyen-may: lưới ghi từ chối hợp đồng: ${r.failures.join(' | ')}`); return 2; }
  }
  const a = k.ghi.filter(g => g.token === 'known-limits').length;
  console.log(`dinh-tuyen-may: ${k.ghi.length} mục (known-limits ${a} · wont-fix ${k.ghi.length - a}) — đảo: ${dong[0].dao}`);
  if (mode === 'write') {
    const noi = (ledger && !ledger.endsWith('\n') ? '\n' : '') + dong.map(d => JSON.stringify(d)).join('\n') + '\n';
    fs.appendFileSync(ledgerPath, noi);
    if (nextContract !== contract) fs.writeFileSync(path.join(dir, 'contract.md'), nextContract);
  }
  return 0;
}

module.exports = { KHOA, DAU_MAY, KHUON_DONG, VE, docKhoa, veTruot, soNhan, docDinhTuyen, keHoach, themNotes, lenhDao, tieuDeGoc, cungMuc, soatLech };

if (require.main === module) process.exit(chay(process.argv.slice(2)));
