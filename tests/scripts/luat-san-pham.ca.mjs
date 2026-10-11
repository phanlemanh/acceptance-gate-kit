// luat-san-pham.ca.mjs — ca đo hồ sơ bat-bien-san-pham (LS-01..LS-11). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash) — tệp KHÔNG mang đuôi .test.mjs để không trôi
// giữa các mảnh mjs. Kho thử do code sinh trong lượt (thư mục tạm + git init); tệp luật của kho thử dựng
// TỪ khối PRODUCT-INVARIANTS-TEMPLATE rút bằng marker; giá trị mong đợi viết sẵn trong ca, KHÔNG rút từ
// đầu ra mô-đun, bộ soi hay thẻ. Đường dẫn suy từ vị trí tệp này.
// Chạy một phần: LS_CASES=LS-01,LS-05 node tests/scripts/luat-san-pham.ca.mjs
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const LSP = path.join(ROOT, 'scripts', 'luat-san-pham.cjs');
const CC = path.join(ROOT, 'scripts', 'can-cu-s1.cjs');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const KCN = path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const KHUON_TEP = path.join(ROOT, 'skills', 'acceptance', 'references', 'product-invariants-template.md');
const HFL = path.join(ROOT, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const require = createRequire(import.meta.url);
const CHON = process.env.LS_CASES ? new Set(process.env.LS_CASES.split(',').map(s => s.trim())) : null;
const want = id => !CHON || CHON.has(id);
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghiTep = (root, rel, t) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), t); };
const tam = p => mkdtempSync(path.join(tmpdir(), p));
// Nạp bản mới của một mô-đun CJS (bản sao tiêm ở thư mục tạm, hoặc bản lành) — không dùng cache.
const napMoi = f => { delete require.cache[require.resolve(f)]; return require(f); };

// ── Khuôn tệp luật: rút từ marker, điền bằng giá trị viết sẵn ───────────────────────────────────────────
const rutKhuon = t => { const m = String(t).match(/<!-- <<<PRODUCT-INVARIANTS-TEMPLATE -->\n```markdown\n([\s\S]*?)\n```\n<!-- PRODUCT-INVARIANTS-TEMPLATE>>> -->/); if (!m) die('khối PRODUCT-INVARIANTS-TEMPLATE vắng'); return m[1]; };
const KHUON = rutKhuon(readFileSync(KHUON_TEP, 'utf8'));
const dien = (khuon, o) => khuon.split('\n')
  .filter(l => !(o.dau_hieu == null && /\{dau_hieu\}/.test(l)) && !(o.pham_vi == null && /\{pham_vi\}/.test(l)) && !(o.chu == null && /\{chu\}/.test(l)))
  .join('\n').replace(/\{(\w+)\}/g, (_, k) => o[k]);
const SP1 = { so: 1, cau: 'Múi giờ của tổ chức đọc từ cấu hình, không khai hằng mới', muc: 'khó đảo', chu: 'Chủ A', giu: 'test mui-gio-mot-nguon', dau_hieu: 'Asia/Ho_Chi_Minh|\\+07:00', pham_vi: '`apps/**`', vi_sao: 'Tổ chức thứ hai ở múi giờ khác.' };
const SP2 = { so: 2, cau: 'Mỗi tổ chức có một tổ chức mẫu để thử', muc: 'thường', chu: 'Chủ B', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Người mới thử được ngay.' };
const SP3 = { so: 3, cau: "Câu có 'nháy', $tien và | ống", muc: 'thường', chu: 'Chủ C', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Ca ký tự lạ.' };
const tepLuat = (khuon, ds) => '# Luật sản phẩm — kho thử\n\nVăn tự do của kho, bộ đọc bỏ qua.\n\n' + ds.map(o => dien(khuon, o)).join('\n\n') + '\n';

// ── LS-01: khuôn + bộ đọc + băm phiên bản ───────────────────────────────────────────────────────────────
if (want('LS-01')) {
  const SAI = [
    { so: 4, cau: 'Thiếu chủ luật', muc: 'thường', chu: null, giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 5, cau: 'Mức lạ', muc: 'vừa', chu: 'Chủ D', giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 6, cau: 'Dấu hiệu hỏng', muc: 'thường', chu: 'Chủ E', giu: 'x', dau_hieu: '(', pham_vi: null, vi_sao: 'x' },
    { so: 1, cau: 'Trùng mã', muc: 'thường', chu: 'Chủ F', giu: 'x', dau_hieu: null, pham_vi: null, vi_sao: 'x' },
    { so: 7, cau: 'Dấu hiệu khớp rỗng', muc: 'thường', chu: 'Chủ G', giu: 'x', dau_hieu: 'a*', pham_vi: null, vi_sao: 'x' },
  ];
  // Review Focus 1: BOM + CRLF.
  const t = '﻿' + tepLuat(KHUON, [SP1, SP2, SP3, ...SAI]).replace(/\n/g, '\r\n');
  check('LS-01 doc-luat', () => {
    const m = napMoi(LSP);
    const r = m.docLuat(t);
    eq(r.luat.map(l => [l.ma, l.cau, l.muc, l.chu, l.giu, l.dau_hieu_nguon, l.pham_vi]), [
      ['SP-1', SP1.cau, 'kho-dao', 'Chủ A', 'test mui-gio-mot-nguon', 'Asia/Ho_Chi_Minh|\\+07:00', ['apps/**']],
      ['SP-2', SP2.cau, 'thuong', 'Chủ B', 'giữ bằng mắt', null, []],
      ['SP-3', "Câu có 'nháy', $tien và | ống", 'thuong', 'Chủ C', 'giữ bằng mắt', null, []],
    ], 'ba luật đọc ra');
    eq(r.sai_khuon.map(s => [s.ma, s.ly_do]), [
      ['SP-4', 'thiếu Chủ luật'], ['SP-5', 'mức lạ: vừa'], ['SP-6', 'dấu hiệu không biên dịch được'], ['SP-1', 'mã trùng'], ['SP-7', 'dấu hiệu khớp chuỗi rỗng'],
    ], 'năm khối sai khuôn');
    const gitBan = execFileSync('git', ['hash-object', '--stdin'], { input: t }).toString().trim();
    eq(m.banLuat(t), gitBan, 'banLuat khớp git hash-object');
  });
  check('LS-01-do', () => {
    // Bản sao khuôn đổi nhãn «Chủ luật» → dựng lại ba luật lành → bộ đọc phải ra 0 luật (khuôn và bộ đọc là một cặp).
    const khuonHong = KHUON.replace('Chủ luật:', 'Người giữ:');
    if (khuonHong === KHUON) die('tiêm không đổi được khuôn');
    const r = napMoi(LSP).docLuat(tepLuat(khuonHong, [SP1, SP2, SP3]));
    if (r.luat.length !== 0) die(`khuôn đổi nhãn mà vẫn đọc ra ${r.luat.length} luật`);
  });
}

console.log(`luat-san-pham.ca: ${passed} đạt, ${failed} trượt`);
process.exit(failed ? 1 : 0);
