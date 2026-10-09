// lo-trinh-kho-thu.mjs — dựng năm trạng thái của trang lộ trình thành kho thử (hồ sơ
// trang-lo-trinh-doc-mot-phut). Kho do CODE sinh trong lượt: git init thư mục tạm, tệp kế hoạch lấy
// từ fixtures/lo-trinh/ (rút từ crm), hồ sơ sinh theo `_nguon.ho_so` của fixture. Dùng chung cho ca
// đo Chrome (LTT-*), ca cấu trúc (LT-9x) và trang mẫu hội đồng.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(HERE, 'fixtures', 'lo-trinh');
const docFx = ten => { const { _nguon, ...data } = JSON.parse(readFileSync(path.join(FX, `${ten}.json`), 'utf8')); return { data, nguon: _nguon }; };

const OPP = (stage, decision) => `---\nschema_version: 1\nslug: x\nfeature: viec x\nowner: x@y.z\nstage: ${stage}\ndecision: ${decision}\ndecided_by: ${decision ? 'M' : ''}\ndecided_at: ${decision ? '2026-09-01T00:00:00Z' : ''}\n---\n\n## Vấn đề & ai gặp\n\nNgười dùng X.\n\n## Ngưỡng chết / ngưỡng UAT\n\n- Câu hỏi phép đo trả lời: ${decision ? 'có giảm không' : '…'}\n- Kết quả nào là SỐNG: ${decision ? 'giảm một nửa' : '…'}\n- Kết quả nào là CHẾT: ${decision ? 'không giảm' : '…'}\n- Timebox: ${decision ? 'một tháng' : '…'}\n`;
const HD = (slug, status, tier) => `---\nschema_version: 1\nfeature: viec ${slug}\nslug: ${slug}\nowner: x@y.z\nrisk_tier: ${tier || 'T2'}\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV = slug => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: M 2026-09-02\n---\n`;
export const HO_SO = {
  'can-nhac': () => ({ 'opportunity.md': OPP('discovery', '') }),
  'cho-duyet': (s, t) => ({ 'contract.md': HD(s, 'draft', t) }),
  'dang-dung': (s, t) => ({ 'contract.md': HD(s, 'approved', t) }),
  'da-ship': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s) }),
  // Ô «Đã giao — chờ phiên nghiệm thu» (hồ sơ lo-trinh-cat-luot, ca LTT-buoc-ke): đã ký + ô cơ hội build.
  'cho-nghiem-thu': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s), 'opportunity.md': OPP('decided', 'build') }),
};

// Kế hoạch sạch: không chỗ lệch nào, có hàng đã giao/đang làm/chưa mở, một mốc đã qua, một mốc tới.
export const SACH = {
  schema: 1, ten: 'Kế hoạch gọn',
  moc: [{ ten: 'Bản đầu cho nhóm bán hàng', ngay: '2026-09-15', hang: ['A'] }, { ten: 'Mở cho cả công ty', ngay: '2026-11-02', hang: ['C'] }],
  hang: [
    { ma: 'A', cau_giao: '«Tôi thấy danh sách khách của mình ngay khi đăng nhập»', slug: 'ds-khach', hang: 'T2' },
    { ma: 'B', cau_giao: '«Tôi lọc khách theo giai đoạn mua»', slug: 'loc-khach', hang: 'T2', dung_tren: ['A'] },
    { ma: 'C', cau_giao: '«Tôi xuất danh sách khách ra bảng tính»', hang: 'T2', dung_tren: ['B'], bat_khi: 'Nhóm bán hàng dùng bộ lọc hai tuần' },
  ],
  da_bac: [],
};
export const RONG = { schema: 1, ten: 'Lộ trình mới', moc: [], hang: [], da_bac: [] };
// Hồ sơ không lộ trình nào trỏ — để khối «không thuộc kế hoạch nào» có mặt.
// crm có 132 hồ sơ như thế lúc audit 03/10 (opportunity.md) — đúng thứ làm trang cũ dài; kho thử giữ số đó.
const NGOAI = Object.fromEntries(Array.from({ length: 132 }, (_, i) => [`ho-so-ngoai-${String(i + 1).padStart(3, '0')}`, i % 4 ? 'da-ship' : 'can-nhac']));

let n = 0;
export function khoMoi(goc, { tep, files = {}, hoSo = {} }) {
  const r = path.join(goc, `kho-${++n}`); mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const git = (...a) => execFileSync('git', ['-C', r, ...a], { stdio: ['ignore', 'pipe', 'pipe'] });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git('config', 'user.email', 'x@y.z'); git('config', 'user.name', 'x');
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep:\n${tep.map(t => `    - ${t}\n`).join('')}`);
  for (const [p, t] of Object.entries(files)) { mkdirSync(path.dirname(path.join(r, p)), { recursive: true }); writeFileSync(path.join(r, p), typeof t === 'string' ? t : JSON.stringify(t, null, 2) + '\n'); }
  for (const [slug, [o, tier]] of Object.entries(hoSo)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(HO_SO[o](slug, tier))) writeFileSync(path.join(d, f), t);
  }
  git('add', '-A'); git('commit', '-qm', 'kho thu');
  return r;
}
// Hồ sơ của fixture: mỗi slug ở ô khai trong `_nguon.ho_so`, hạng = hạng hàng đầu tiên trỏ slug
// (hồ sơ thử không được tự đẻ cờ đổi hạng).
function hoSoCua({ data, nguon }) {
  const ra = {};
  for (const [slug, o] of Object.entries((nguon && nguon.ho_so) || {})) ra[slug] = [o, (data.hang.find(h => h && h.slug === slug) || {}).hang];
  return ra;
}

export const TRANG_THAI = ['hai-lo-trinh', 'mot-lo-trinh', 'loi-tep', 'khong-co', 'rong'];
export function dungKho(ten, goc) {
  const okr = docFx('crm-okr'); const ktl = docFx('crm-kho-tai-lieu');
  const T_OKR = 'docs/plan/lo-trinh-okr.json'; const T_KTL = 'docs/plan/lo-trinh-kho-tai-lieu.json';
  const ngoai = Object.fromEntries(Object.entries(NGOAI).map(([s, o]) => [s, [o]]));
  switch (ten) {
    case 'hai-lo-trinh': return khoMoi(goc, { tep: [T_OKR, T_KTL], files: { [T_OKR]: okr.data, [T_KTL]: ktl.data }, hoSo: { ...hoSoCua(okr), ...ngoai } });
    case 'mot-lo-trinh': return khoMoi(goc, { tep: [T_OKR], files: { [T_OKR]: okr.data }, hoSo: { ...hoSoCua(okr), ...ngoai } });
    case 'loi-tep': return khoMoi(goc, { tep: [T_OKR, 'docs/plan/hong.json'], files: { [T_OKR]: okr.data, 'docs/plan/hong.json': '{ "schema": 1, "hang": [ ' }, hoSo: hoSoCua(okr) });
    case 'khong-co': return khoMoi(goc, { tep: ['docs/plan/khach.json'], files: { 'docs/plan/khach.json': SACH }, hoSo: { 'ds-khach': ['da-ship', 'T2'], 'loc-khach': ['dang-dung', 'T2'] } });
    case 'rong': return khoMoi(goc, { tep: ['docs/plan/rong.json'], files: { 'docs/plan/rong.json': RONG }, hoSo: ngoai });
    default: throw new Error(`trạng thái lạ: ${ten}`);
  }
}
