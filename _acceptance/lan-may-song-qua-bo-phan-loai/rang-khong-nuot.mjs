// Răng hồ sơ lan-may-song-qua-bo-phan-loai — AC-3 «không nuốt cấu hình khác».
// Đường dẫn suy từ tham số do .sh truyền (nó suy từ vị trí script), không hardcode.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [ROOT, HERE] = process.argv.slice(2);
const SETTINGS = path.join(ROOT, '.claude', 'settings.json');
const CONTRACT = path.join(HERE, 'contract.md');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// HAI CHÂN RỜI, mỗi chân thông điệp riêng. Danh sách khoá phải-giữ DUYỆT TỪ bản ở
// mốc, không liệt tay.
function checkPreserved(baseObj, treeObj) {
  const errs = [];
  for (const k of Object.keys(baseObj)) {
    if (k === 'permissions') continue;
    if (!(k in treeObj)) { errs.push(`(a) MAT khoa cap cao: "${k}"`); continue; }
    if (!same(baseObj[k], treeObj[k])) errs.push(`(a) DOI gia tri khoa cap cao: "${k}"`);
  }
  const bp = baseObj.permissions, tp = treeObj.permissions || {};
  if (bp) {
    for (const k of Object.keys(bp)) {
      if (k === 'allow') continue;
      if (!same(bp[k], tp[k])) errs.push(`(b) khoa trong permissions bi doi hoac mat: "${k}"`);
    }
    for (const e of (bp.allow || [])) {
      if (!(tp.allow || []).includes(e)) errs.push(`(b) MAT entry allow von co o moc: "${e}"`);
    }
  }
  return errs;
}

const m = readFileSync(CONTRACT, 'utf8').match(/\*\*BASE-LMSQBPL:\*\*\s*`([0-9a-f]{40})`/);
if (!m) { console.log('khong doc duoc moc BASE-LMSQBPL tu contract.md'); process.exit(1); }
const base = JSON.parse(execFileSync('git', ['show', `${m[1]}:.claude/settings.json`], { cwd: ROOT, encoding: 'utf8' }));
const tree = JSON.parse(readFileSync(SETTINGS, 'utf8'));
const bad = [];

// ── CHÂN 1: đối chứng dương trên CẶP THẬT mốc ↔ cây, chạy TRƯỚC mọi mutant ──
const clean = checkPreserved(base, tree);
if (clean.length) bad.push(`CHAN 1 DO — doi chung duong tren cap THAT: ${clean.join(' · ')}`);

// ── CHÂN 2: chân (a) biết đỏ, tiêm vào BẢN SAO của bản trong cây ──
const topKeys = Object.keys(base).filter(k => k !== 'permissions');
if (!topKeys.length) bad.push('CHAN 2 DO: ban o moc khong co khoa cap cao nao ngoai permissions — chan (a) hang dung');
else {
  const m1 = structuredClone(tree); delete m1[topKeys[0]];
  if (!checkPreserved(base, m1).some(e => e.includes(`(a) MAT khoa cap cao: "${topKeys[0]}"`)))
    bad.push('CHAN 2 DO: xoa mot khoa cap cao ma khong do');
  const m2 = structuredClone(tree); m2[topKeys[0]] = { 'da-doi': true };
  if (!checkPreserved(base, m2).some(e => e.includes(`(a) DOI gia tri khoa cap cao: "${topKeys[0]}"`)))
    bad.push('CHAN 2 DO: doi gia tri mot khoa cap cao ma khong do');
}

// ── CHÂN 3: chân (b). Bản ở mốc CHƯA có khối `permissions` nên cặp thật không có
// gì để mất — chứng chân này biết đỏ trên CẶP SINH BỞI CODE, CÙNG hàm so khác input.
if (base.permissions) bad.push('CHAN 3: ban o moc NAY DA co khoi permissions — cap nhat rang: chan (b) do duoc tren cap that, bo cap sinh');
const bSyn = { permissions: { allow: ['Bash(a)', 'Bash(b)'], deny: ['Bash(rm -rf /)'], defaultMode: 'default' } };
const tSyn = { permissions: { allow: ['Bash(a)', 'Bash(b)', 'Bash(c)'], deny: ['Bash(rm -rf /)'], defaultMode: 'default' } };
if (checkPreserved(bSyn, tSyn).length) bad.push('CHAN 3 DO: doi chung duong tren cap sinh khong xanh');
const s2 = structuredClone(tSyn); delete s2.permissions.deny;
if (!checkPreserved(bSyn, s2).some(e => e.includes('"deny"'))) bad.push('CHAN 3 DO: xoa permissions.deny ma khong do');
const s3 = structuredClone(tSyn); s3.permissions.allow = s3.permissions.allow.filter(x => x !== 'Bash(a)');
if (!checkPreserved(bSyn, s3).some(e => e.includes('MAT entry allow von co o moc: "Bash(a)"'))) bad.push('CHAN 3 DO: xoa entry allow von co o moc ma khong do');
const s4 = structuredClone(tSyn); s4.permissions.defaultMode = 'bypassPermissions';
if (!checkPreserved(bSyn, s4).some(e => e.includes('"defaultMode"'))) bad.push('CHAN 3 DO: doi defaultMode ma khong do');

if (bad.length) { bad.forEach(b => console.log(b)); console.log(`khong-nuot: ${bad.length} chan do`); process.exit(1); }
console.log(`khong-nuot OK (moc ${m[1].slice(0, 12)}: ${topKeys.length} khoa cap cao giu nguyen · chan (b) chung tren cap sinh)`);
