#!/usr/bin/env node
// lo-trinh-mau.mjs — sinh trang mẫu cho hội đồng (hồ sơ viec-ke-theo-plan, AC-14/E14) từ fixture crm
// OKR thật cộng một cây hồ sơ do CODE sinh theo `_nguon.ho_so` của fixture (mỗi slug một hồ sơ ở một
// ô; ít nhất một hàng tự khai lệch). Trang hội đồng đọc là VẬT MÁY SINH: `--check` so bản đã commit
// với bản vẽ lại trong lượt (LT-06-mau). Không ghi gì ngoài tệp mẫu; kho tạm xoá khi xong.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const OUT = path.join(KIT, '_acceptance', 'viec-ke-theo-plan', 'mau', 'lo-trinh-crm-okr.html');
const check = process.argv.includes('--check');
const f = JSON.parse(readFileSync(path.join(HERE, 'fixtures', 'lo-trinh', 'crm-okr.json'), 'utf8'));
const { _nguon, ...data } = f;

const OPP = (stage, decision) => `---\nschema_version: 1\nslug: x\nfeature: viec x\nowner: x@y.z\nstage: ${stage}\ndecision: ${decision}\ndecided_by: ${decision ? 'M' : ''}\ndecided_at: ${decision ? '2026-09-01T00:00:00Z' : ''}\n---\n\n## Vấn đề & ai gặp\n\nNgười dùng X.\n\n## Ngưỡng chết / ngưỡng UAT\n\n- Câu hỏi phép đo trả lời: ${decision ? 'có giảm không' : '…'}\n- Kết quả nào là SỐNG: ${decision ? 'giảm một nửa' : '…'}\n- Kết quả nào là CHẾT: ${decision ? 'không giảm' : '…'}\n- Timebox: ${decision ? 'một tháng' : '…'}\n`;
const HD = (slug, status, tier) => `---\nschema_version: 1\nfeature: viec ${slug}\nslug: ${slug}\nowner: x@y.z\nrisk_tier: ${tier || 'T2'}\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV = slug => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: M 2026-09-02\n---\n`;
const HO_SO = {
  'can-nhac': s => ({ 'opportunity.md': OPP('discovery', '') }),
  'cho-duyet': (s, t) => ({ 'contract.md': HD(s, 'draft', t) }),
  'dang-dung': (s, t) => ({ 'contract.md': HD(s, 'approved', t) }),
  'da-ship': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s) }),
};

const r = mkdtempSync(path.join(tmpdir(), 'lo-trinh-mau-'));
try {
  execFileSync('git', ['init', '-q', '-b', 'main', r]);
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nlo_trinh:\n  tep: docs/plan/lo-trinh-okr.json\n');
  mkdirSync(path.join(r, 'docs', 'plan'), { recursive: true });
  writeFileSync(path.join(r, 'docs', 'plan', 'lo-trinh-okr.json'), JSON.stringify(data, null, 2) + '\n');
  for (const [slug, o] of Object.entries(_nguon.ho_so)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    // Hạng của hồ sơ = hạng hàng khai (hàng đầu tiên trỏ slug): hồ sơ mẫu không được tự đẻ cờ đổi hạng.
    const tier = (data.hang.find(h => h.slug === slug) || {}).hang;
    for (const [t, txt] of Object.entries(HO_SO[o](slug, tier))) writeFileSync(path.join(d, t), txt);
  }
  const PM = await import(pathToFileURL(path.join(KIT, 'scripts', 'product-map.mjs')).href);
  const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
  const html = LT.veTrang({ root: r, classify: PM.classify, sections: PM.SECTIONS });
  if (check) {
    const cu = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
    if (cu === html) { console.log('lo-trinh-mau: trang mẫu khớp bản vẽ lại.'); process.exitCode = 0; }
    else { console.error(`lo-trinh-mau: trang mẫu ${cu == null ? 'chưa có' : 'lệch bản vẽ lại'} — chạy: node tests/scripts/lo-trinh-mau.mjs`); process.exitCode = 1; }
  } else {
    mkdirSync(path.dirname(OUT), { recursive: true }); writeFileSync(OUT, html); console.log(OUT);
  }
} finally { rmSync(r, { recursive: true, force: true }); }
