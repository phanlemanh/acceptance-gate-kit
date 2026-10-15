// ap-chinh-sach-lo-trinh-crm.mjs — hồ sơ ap-chinh-sach-lo-trinh, ca AP-11 (AC-11): tự áp trên bản chụp kế hoạch THẬT của crm.
// Tệp không mang đuôi .test.mjs: cần kho crm trên máy (KHO_CRM, mặc định ~/dev/crm) — vắng thì thoát 2 nêu đường (mù, không
// xanh). Bản chụp: clone thưa (`--shared`, chỉ docs/plan, _acceptance, hai trang gốc) ở 3818ad4e — giữ lịch sử git thật để
// luật tuổi đọc được. Mỗi tệp lộ trình được thêm chinh_sach {tu_ap, tuoi_ngay 14, tran_ke_tiep 5} vào mốc phat-hanh đầu tiên
// có ngày ≥ 2026-10-15 (không có → thêm mốc «Chiến dịch thử» 2026-10-22). Tập mong đợi VIẾT SẴN dưới đây, từ phép đếm độc
// lập 15/10 (luật viết riêng — tuổi theo git tự tính, không gọi bộ rà soát): OKR «Kế tiếp» 16 việc, trần 5 → 11 hàng chờ điều
// kiện theo trần; Việc–Dự án: DA6–DA8 tự khai xếp lại; Kho tài liệu: không. Ngày 16 áp tối đa 5 hàng mỗi tệp, theo thứ tự hàng —
// CHỈ ở tệp mà chiến dịch đang chạy ngày 16 vẫn là mốc mang chính sách: mốc Việc–Dự án mang chính sách là 15/10, sang 16/10
// chiến dịch đang chạy là mốc 24/10 chưa khai → máy ngừng áp, DA6–DA8 ở lại báo trước, tệp Việc–Dự án không đổi ngày 16.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const CRM = process.env.KHO_CRM || path.join(homedir(), 'dev', 'crm');
const SHA = '3818ad4ecbaa06034dd83d0fa904a03cdc20aaeb';
const TEP = ['docs/plan/lo-trinh-okr.json', 'docs/plan/lo-trinh-kho-tai-lieu.json', 'docs/plan/lo-trinh-viec-du-an.json'];
const BAO_TRUOC = [
  ...['7n', 'TH4', 'TH5', 'TH1', 'TB1', 'TB2', 'TH2', 'TH3', 'TH6', 'LT1c', 'LT3'].map(m => `lo-trinh-okr.json|${m}|cho-dieu-kien|tran`),
  ...['DA6', 'DA7', 'DA8'].map(m => `lo-trinh-viec-du-an.json|${m}|cho-dieu-kien|xep-lai`),
].sort();
const DA_AP = ['7n', 'TH4', 'TH5', 'TH1', 'TB1'].map(m => `lo-trinh-okr.json|${m}|cho-dieu-kien`).sort();

if (!existsSync(path.join(CRM, '.git'))) { console.log(`  FAIL: AP-11 — không thấy kho crm ở ${CRM} (đặt KHO_CRM) — mù, không xanh`); process.exit(2); }
const K = path.join(realpathSync(mkdtempSync(path.join(tmpdir(), 'ap-crm-'))), 'crm');
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
git('clone', '-q', '--no-checkout', '--shared', CRM, K);
git('-C', K, 'sparse-checkout', 'set', '--no-cone', '/docs/plan/', '/_acceptance/', '/PRODUCT-MAP.md', '/LO-TRINH.html');
git('-C', K, 'checkout', '-q', SHA);
const doc = f => JSON.parse(readFileSync(path.join(K, f), 'utf8'));
const tapMa = d => new Set(['hang', 'chan_troi', 'da_bac'].flatMap(k => (d[k] || []).map(x => x.ma)));
const truoc = Object.fromEntries(TEP.map(f => [f, tapMa(doc(f))]));
for (const f of TEP) {
  const d = doc(f); const cs = { tu_ap: true, tuoi_ngay: 14, tran_ke_tiep: 5 };
  const m = (d.moc || []).find(x => x && x.loai === 'phat-hanh' && /^\d{4}-\d{2}-\d{2}$/.test(x.ngay || '') && x.ngay >= '2026-10-15');
  if (m) m.chinh_sach = cs; else (d.moc = d.moc || []).push({ ten: 'Chiến dịch thử', ngay: '2026-10-22', loai: 'phat-hanh', hang: [], chinh_sach: cs });
  writeFileSync(path.join(K, f), JSON.stringify(d, null, 2) + '\n');
}
const node = (args, today) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, ACCEPTANCE_TODAY: today } });
const LT = path.join(KIT, 'scripts', 'lo-trinh.mjs'); const PMJ = path.join(KIT, 'scripts', 'product-map.mjs');
const sai = [];
const VDA = path.join(K, 'docs/plan/lo-trinh-viec-du-an.json'); let vda15 = null;
for (const ngay of ['2026-10-15', '2026-10-16']) {
  const x = node([LT, '--root', K, '--ap', '--write'], ngay); if (x.status !== 0) sai.push(`--ap --write ngày ${ngay} thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  if (ngay === '2026-10-15') vda15 = readFileSync(VDA, 'utf8');
}
if (readFileSync(VDA, 'utf8') !== vda15) sai.push('chiến dịch mang chính sách đã qua mà máy vẫn dời hàng Việc–Dự án ngày 16');
const so = TEP.flatMap(f => { const p = path.join(K, f.replace(/\.json$/, '.so.jsonl')); return existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => ({ tep: path.basename(f), ...JSON.parse(l) })) : []; });
const bao = so.filter(d => d.loai === 'bao-truoc').map(d => `${d.tep}|${d.ma}|${d.de_xuat}|${d.luat}`).sort();
const ap = so.filter(d => d.loai === 'ap').map(d => `${d.tep}|${d.ma}|${d.de_xuat}`).sort();
if (JSON.stringify(bao) !== JSON.stringify(BAO_TRUOC)) sai.push(`tập báo trước ${JSON.stringify(bao)}, cần ${JSON.stringify(BAO_TRUOC)}`);
if (JSON.stringify(ap) !== JSON.stringify(DA_AP)) sai.push(`tập đã áp ${JSON.stringify(ap)}, cần ${JSON.stringify(DA_AP)}`);
for (const f of TEP) {
  const t = readFileSync(path.join(K, f), 'utf8');
  if (JSON.stringify(JSON.parse(t), null, 2) + '\n' !== t) sai.push(`${f}: sau ghi không ở dạng chuẩn`);
  const sau = tapMa(JSON.parse(t)); const mat = [...truoc[f]].filter(m => !sau.has(m)); const thua = [...sau].filter(m => !truoc[f].has(m));
  if (mat.length || thua.length) sai.push(`${f}: tập mã đổi — mất ${mat.join(',')} · thừa ${thua.join(',')}`);
}
const ve = node([PMJ, '--root', K], '2026-10-16'); const ck = node([PMJ, '--root', K, '--check'], '2026-10-16');
if (ve.status !== 0 || ck.status !== 0) sai.push(`product-map: vẽ ${ve.status} · --check ${ck.status} ${ck.stdout}${ck.stderr}`);
rmSync(path.dirname(K), { recursive: true, force: true });
if (sai.length) { console.log(`  FAIL: AP-11 — ${sai.join(' ; ')}`); console.log('\nResults: 0 passed, 1 failed (ap-chinh-sach-lo-trinh-crm)'); process.exit(1); }
console.log(`  PASS: AP-11 — crm ${SHA.slice(0, 8)}: báo trước ${bao.length} hàng BẰNG tập đếm độc lập; ngày 16 áp ${ap.length} hàng (trần 5/tệp); ba tệp vẫn dạng chuẩn, tập mã không đổi; product-map --check thoát 0`);
console.log('\nResults: 1 passed, 0 failed (ap-chinh-sach-lo-trinh-crm)');
