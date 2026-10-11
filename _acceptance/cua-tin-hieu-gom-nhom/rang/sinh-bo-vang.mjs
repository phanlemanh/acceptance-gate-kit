#!/usr/bin/env node
// sinh-bo-vang.mjs — BỘ VÀNG của hồ sơ cua-tin-hieu-gom-nhom (AC-10, AC-11): dữ liệu GIẢ do máy sinh từ hồ
// sơ thật của crm, có nhãn, KÍN ĐÁP ÁN.
//
//   node sinh-bo-vang.mjs --crm <đường kho crm> --sha <sha nội dung> --trang-thai <sha trạng thái> --ra <thư mục mau>
//
// Nguồn: mọi `_acceptance/<slug>/opportunity.md` ở <sha> có mục «## Hạng mục cùng lớp» (gom tay của chủ kho).
// Mỗi hồ sơ HAI tín hiệu: câu văn đầu của «Vấn đề & ai gặp» và ý đầu của «Giả định chốt sinh tử» — KHÔNG
// lấy câu `feature` (đó là câu giao mà `--chua-gom` in cho hồ sơ đã giao: lấy nó là trao đáp án). Mọi tên
// hồ sơ trong câu bị gỡ; nhãn chỉ mang «giả» + sha; người gửi trung tính; số thứ tự xáo theo băm cố định để
// hai tín hiệu một cặp không đứng cạnh nhau. Đáp án (hồ sơ nguồn của từng tín hiệu, cặp trùng, hồ sơ đã
// giao ở thời điểm <trang-thai>, liên kết «cùng lớp») chỉ nằm ở bo-vang.json.
//
// Chỉ ghi vào --ra. crm vắng / sha không có → thoát 2 có tên (ca đo dùng bản đã commit).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';

const a = process.argv.slice(2);
const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const bail = m => { process.stderr.write(`sinh-bo-vang: ${m}\n`); process.exit(2); };
const crm = lay('--crm'); const sha = lay('--sha'); const shaTT = lay('--trang-thai'); const ra = lay('--ra');
if (!crm || !sha || !shaTT || !ra) bail('cần --crm <kho> --sha <sha> --trang-thai <sha> --ra <thư mục>');
if (!existsSync(path.join(crm, '.git'))) bail(`không thấy kho git crm ở ${crm}`);
const g = (...x) => execFileSync('git', ['-C', crm, ...x], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
const show = (s, f) => { try { return g('show', `${s}:${f}`); } catch { return null; } };
let full; let fullTT;
try { full = g('rev-parse', '--verify', `${sha}^{commit}`).trim(); fullTT = g('rev-parse', '--verify', `${shaTT}^{commit}`).trim(); } catch { bail(`crm không có sha ${sha} hoặc ${shaTT} — fetch trước`); }

const muc = (txt, ten) => { const m = String(txt).split('\n'); const i = m.findIndex(l => l.trim() === `## ${ten}`); if (i < 0) return []; const ra2 = []; for (const l of m.slice(i + 1)) { if (/^## /.test(l)) break; ra2.push(l); } return ra2; };
const fm = (txt, k) => { const m = String(txt).match(new RegExp(`^${k}:\\s*(.*)$`, 'm')); return m ? m[1].replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '') : ''; };

const cacTep = g('grep', '-l', '^## Hạng mục cùng lớp', full, '--', '_acceptance/*/opportunity.md').split('\n').filter(Boolean).map(l => l.replace(`${full}:`, ''));
const slugs = cacTep.map(f => f.split('/')[1]).sort();
if (slugs.length < 2) bail(`chỉ thấy ${slugs.length} hồ sơ có «Hạng mục cùng lớp» ở ${sha}`);
const BO_TEN = new RegExp(`\\b(${slugs.map(s => s.replace(/[-]/g, '\\-')).join('|')})\\b`, 'g');
// Câu văn: bỏ dòng bảng / tiêu đề / trích dẫn / rào mã; gỡ backtick, đậm, liên kết; gỡ tên hồ sơ.
const sach = s => String(s).replace(/`([^`]*)`/g, '$1').replace(/\*\*([^*]*)\*\*/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(BO_TEN, 'một việc khác').replace(/\s+/g, ' ').trim();
const cauDau = s => { const m = s.match(/^(.{20,}?[.!?…])(\s|$)/); let c = m ? m[1] : s; if (c.length > 200) c = c.slice(0, 200).replace(/\s+\S*$/, '') + '…'; return c; };
// Ghép khối trước khi lấy câu (crm ngắt dòng cứng ~100 ký tự): mục danh sách cột 0 + dòng thụt nối tiếp;
// đoạn văn = các dòng liền cột 0; bảng = dòng mở bằng «|». Ưu tiên: đoạn văn → mục danh sách → ô dài nhất
// của dòng dữ liệu bảng (bảng số liệu ít giống lời người gửi).
const LIST_RE = /^(-|\*|\d+\.)\s+/;
function khoi(dong) {
  const ra2 = []; let cur = null;
  for (const l of dong) {
    if (!l.trim() || /^(#|>|```)/.test(l.trim())) { cur = null; continue; }
    if (l.trim().startsWith('|')) { ra2.push({ k: 'bang', t: l.trim() }); cur = null; continue; }
    if (LIST_RE.test(l)) { cur = { k: 'muc', t: l.replace(LIST_RE, '') }; ra2.push(cur); continue; }
    if (/^\s/.test(l) && cur) { cur.t += ' ' + l.trim(); continue; }
    if (cur && cur.k === 'van') { cur.t += ' ' + l.trim(); continue; }
    cur = { k: 'van', t: l.trim() }; ra2.push(cur);
  }
  return ra2;
}
function yDau(dong) {
  const k = khoi(dong);
  const van = k.find(x => x.k === 'van');
  if (van) return cauDau(sach(van.t.replace(/^\*\*[^*]+:\*\*\s*/, '')));
  const muc1 = k.find(x => x.k === 'muc');
  if (muc1) return cauDau(sach(muc1.t));
  for (const x of k.filter(y => y.k === 'bang')) {
    const o = x.t.split('|').map(y => y.trim()).filter(Boolean);
    if (!o.length || o.every(y => /^:?-+:?$/.test(y))) continue;
    const dai = o.reduce((p2, c) => (c.length > p2.length ? c : p2), '');
    if (dai.length > 20) return cauDau(sach(dai));
  }
  return null;
}
const daGiao = new Set(['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te']);
const hoSo = {}; const lienKet = {}; const nguonTin = [];
for (const s of slugs) {
  const o = show(full, `_acceptance/${s}/opportunity.md`);
  const a1 = yDau(muc(o, 'Vấn đề & ai gặp')); const b1 = yDau(muc(o, 'Giả định chốt sinh tử'));
  if (!a1 || !b1) bail(`hồ sơ ${s}: không rút được câu từ «Vấn đề & ai gặp» hoặc «Giả định chốt sinh tử»`);
  lienKet[s] = [...new Set(muc(o, 'Hạng mục cùng lớp').join('\n').match(/`([a-z0-9][a-z0-9-]+)`/g) || [])].map(x => x.slice(1, -1)).filter(x => slugs.includes(x) && x !== s);
  const c = show(fullTT, `_acceptance/${s}/contract.md`); const ot = show(fullTT, `_acceptance/${s}/opportunity.md`);
  const tt = c ? fm(c, 'status') : ot ? `o-co-hoi:${fm(ot, 'stage')}` : 'chua-co';
  hoSo[s] = { trang_thai: tt, da_giao: daGiao.has(tt), feature: c ? fm(c, 'feature') : ot ? fm(ot, 'feature') : null };
  nguonTin.push({ slug: s, kieu: 'van-de', tieu_de: a1 }, { slug: s, kieu: 'gia-dinh', tieu_de: b1 });
}
// Xáo theo băm cố định của (slug, kiểu) — tất định, hai tín hiệu một cặp không đứng cạnh nhau.
const bam = x => createHash('sha256').update(`bo-vang-1|${x.slug}|${x.kieu}`).digest('hex');
nguonTin.sort((x, y) => bam(x).localeCompare(bam(y)));
const NHAN = `giả — sinh từ crm ${full.slice(0, 9)}`;
const BAT_DAU = Date.parse('2026-10-09T10:00:00Z');
const thuMucTin = path.join(ra, 'tin-hieu'); rmSync(thuMucTin, { recursive: true, force: true }); mkdirSync(thuMucTin, { recursive: true });
const mucDs = nguonTin.map((x, i) => {
  const phien = i % 2 ? 'vang-b' : 'vang-a'; const id = `${phien}-${i + 1}`;
  const o = { phien, loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: x.tieu_de, nhan: NHAN }, luc: new Date(BAT_DAU + i * 60_000).toISOString() };
  writeFileSync(path.join(thuMucTin, `${id}.json`), JSON.stringify(o, null, 2) + '\n');
  return { id, tieu_de: x.tieu_de, ho_so: x.slug, kieu: x.kieu };
});
const capTrung = slugs.map(s => mucDs.filter(m => m.ho_so === s).map(m => m.id));
// Hợp đồng THẬT (frontmatter + mục Criteria) của hồ sơ đã có hợp đồng lúc <trang-thai> — để phiên gom đọc
// tiêu chí trước khi xếp «đã phủ», như ở kho thật. Không phải đáp án: kho thật cũng có các tệp này.
const thuMucHs = path.join(ra, 'ho-so'); rmSync(thuMucHs, { recursive: true, force: true });
for (const s of slugs) {
  const c = show(fullTT, `_acceptance/${s}/contract.md`); if (!c) continue;
  const fmKhoi = (c.match(/^---\n[\s\S]*?\n---\n/) || [''])[0];
  const tc = muc(c, 'Criteria').join('\n').trim();
  mkdirSync(path.join(thuMucHs, s), { recursive: true });
  writeFileSync(path.join(thuMucHs, s, 'contract.md'), `${fmKhoi}\n# Acceptance Contract: ${s}\n\n## Criteria\n\n${tc}\n`);
}
writeFileSync(path.join(ra, 'bo-vang.json'), JSON.stringify({
  nhan: 'ĐÁP ÁN của bộ vàng — dữ liệu giả máy sinh; KHÔNG đưa tệp này cho phiên gom',
  nguon: { kho: 'crm', sha: full, trang_thai_sha: fullTT, cach: 'mỗi hồ sơ có «Hạng mục cùng lớp»: câu đầu «Vấn đề & ai gặp» + ý đầu «Giả định chốt sinh tử», gỡ tên hồ sơ' },
  muc: mucDs, cap_trung: capTrung, da_giao: slugs.filter(s => hoSo[s].da_giao), ho_so: hoSo, lien_ket_cung_lop: lienKet,
}, null, 2) + '\n');
process.stdout.write(`sinh-bo-vang: ${mucDs.length} tín hiệu từ ${slugs.length} hồ sơ · ${capTrung.length} cặp trùng · đã giao ${slugs.filter(s => hoSo[s].da_giao).length} → ${ra}\n`);
