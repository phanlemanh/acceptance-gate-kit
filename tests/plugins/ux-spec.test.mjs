// tests/plugins/ux-spec.test.mjs — ca hồ sơ dac-ta-ux-vat-hoa-cau-truc (UX1–UX4).
// Fixture CODE-SINH rút từ CHÍNH ux-spec-template.md qua marker («điền» = luật
// bỏ-ngoặc {{x}}→x); đường dẫn suy từ vị trí
// file; mỗi ca có đối chứng dương + chiều đỏ trên bản sao, ghim thông điệp.
//   UX_CASES=UX1,UX4 node tests/plugins/ux-spec.test.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'ux-spec-template.md');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const MIEN = 'bỏ đặc-tả-UX — ';

let failures = 0;
const ALL_IDS = ['UX1', 'UX3', 'UX4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.UX_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = m => console.log('  PASS: ' + m);
const fail = m => { console.log('  FAIL: ' + m); failures++; };
const ok = (cond, m) => (cond ? pass(m) : fail(m));

// writer → section mẫu: trích marker rồi «điền» bằng luật bỏ-ngoặc.
function uxSection(tplText) {
  const a = tplText.indexOf('<!-- <<<UX-SPEC-TEMPLATE -->');
  const b = tplText.indexOf('<!-- UX-SPEC-TEMPLATE>>> -->');
  if (a < 0 || b < 0) return null;
  return tplText.slice(a, b + '<!-- UX-SPEC-TEMPLATE>>> -->'.length)
    .replace(/\{\{([^}]*)\}\}/g, '$1');
}


// ── UX1: khuôn đủ 6 mục + marker con + cửa miễn ─────────────────────────────
// Chiều đỏ KHÔNG tautology (bài học r2): mỗi mutant đi qua CHÍNH bộ kiểm của
// chiều xanh (cùng hàm, khác input) — mutation và assertion không là một thao tác.
if (want('UX1')) {
  const t = readFileSync(TPL, 'utf8');
  const sec = uxSection(t);
  ok(sec !== null, 'UX1 marker UX-SPEC-TEMPLATE tồn tại');
  const HEADINGS = ['1. Luồng', '2. Kiểm kê màn', '3. Bảng trạng thái', '4. Hành vi', '5. Xuất xứ component', '6. Khuôn IA đã chọn + căn cứ'];
  const hasHeading = (secText, h) => secText.includes('### ' + h);
  if (sec !== null) {
    for (const h of HEADINGS) ok(hasHeading(sec, h), `UX1 mục «${h}» có mặt`);
    ok(sec.includes('<<<UX-STATE-TABLE') && sec.includes('UX-STATE-TABLE>>>'),
      'UX1 UX-SPEC-TEMPLATE có UX-STATE-TABLE');
    ok(/^Khuôn IA:/m.test(sec) && /^Căn cứ:/m.test(sec), 'UX1 nhãn Khuôn IA/Căn cứ đúng khuôn dòng');
  }
  ok(t.includes(MIEN), 'UX1 đầu khuôn có chuỗi cửa miễn');
  // Khuôn dùng được như VẬT máy-đọc cho việc khớp vòng sẽ làm sau (AC-2):
  // trích qua marker rồi «điền» phải ra bảng ≥2 dòng và giữ nguyên hai marker.
  const stRows = (sec || '').split('\n').filter(l => /^\|\s*ST-/.test(l));
  ok(stRows.length >= 2 && sec.includes('<<<UX-STATE-TABLE') && sec.includes('UX-STATE-TABLE>>>'),
    `UX2-trich bản trích giữ đủ marker và ${stRows.length} dòng trạng thái mẫu`);
  // đỏ-1: gỡ marker bảng khỏi bản sao → CÙNG bộ trích của chiều xanh mất bảng
  const secMut = uxSection(t.replace(/UX-STATE-TABLE/g, 'UX-XXX-TABLE'));
  ok(secMut !== null && !secMut.includes('<<<UX-STATE-TABLE'),
    'UX1-đỏ gỡ marker bảng khỏi bản sao → cùng bộ trích thấy section mất UX-STATE-TABLE');
  // đỏ-2: gỡ TRỌN mục 6 → cùng bộ kiểm hasHeading phải trượt đúng mục đó, các mục khác vẫn xanh
  const HEAD6 = '### 6. Khuôn IA đã chọn + căn cứ';
  // mutant ĐỔI TÊN mục (không xoá chuỗi rồi kiểm chuỗi vắng — tránh tautology):
  // bộ kiểm tiêu đề của chiều xanh phải trượt đúng mục 6, các mục khác vẫn xanh
  const secRenamed = uxSection(t.replace(HEAD6, '### 6. Ghi chú thêm'));
  ok(secRenamed !== null && !hasHeading(secRenamed, HEADINGS[5]) && hasHeading(secRenamed, HEADINGS[0]) && hasHeading(secRenamed, HEADINGS[3]),
    `UX1-đỏ2 bản sao ĐỔI TÊN mục 6 → cùng bộ kiểm trượt đúng «${HEAD6}», mục 1 và 4 vẫn xanh`);
}

// ── UX3: quan hệ trong SKILL feature-loop — đo bằng MUTANT, không đếm chữ ──
// Lỗi round 1: ba regex rời trên toàn file khớp vào câu ui_standards_skill CÓ SẴN,
// nên xoá trọn câu chỉ dẫn mới mà ca vẫn xanh. Nay mỗi mệnh đề có mutant riêng:
// gỡ đúng câu mang mệnh đề khỏi BẢN SAO thì phép kiểm PHẢI đỏ.
if (want('UX3')) {
  const s = readFileSync(SKILL, 'utf8');
  // Bộ kiểm chạy trên MỘT chuỗi bất kỳ (bản thật hoặc bản sao đã mutate) —
  // cùng hàm cho cả hai chiều, nên chiều đỏ đi qua đúng bộ kiểm của chiều xanh.
  const checks = {
    a: t => {
      // QUAN HỆ: câu nào vừa buộc thứ tự «trước 3 artifact» VỪA nói Đặc tả UX
      const step4 = (t.match(/^4\. Kết thúc brainstorm[\s\S]*?(?=\n\d+\. |\n## )/m) || [''])[0];
      return step4.split(/(?<=[.;])\s+/).some(sen =>
        /Đặc tả UX/.test(sen) && /TRƯỚC khi sinh 3 artifact/.test(sen) && /ux-spec-template\.md/.test(sen));
    },
    a2: t => {
      // QUAN HỆ trong bước 4: mệnh đề resolve-qua-resolver phải ôm đúng tên khuôn,
      // và bước 4 không được dạy đường cache cứng cho khuôn
      const step4 = (t.match(/^4\. Kết thúc brainstorm[\s\S]*?(?=\n\d+\. |\n## )/m) || [''])[0];
      return /resolve-plugin\.mjs[\s\S]{0,300}ux-spec-template\.md/.test(step4)
        && !/plugins\/cache[^\n]{0,200}ux-spec-template\.md/.test(step4);
    },
    b: t => /design_doc: <path/.test(t) && /GIỮ NGUYÊN các marker/.test(t),
    c: t => {
      // QUAN HỆ: câu vẽ-từ-khuôn phải nằm TRONG bước [3] của nghi thức hình,
      // không phải chỉ có mặt đâu đó — mutation đổi chữ không nghịch đảo được
      const b3 = (t.match(/- \*\*\[3\] Vẽ\*\*[\s\S]*?(?=\n- \*\*\[4\])/) || [''])[0];
      return /Đặc tả UX/.test(b3) && /hình là chiếu của khuôn/.test(b3);
    },
    d: t => {
      // MỌI lần «dòng state-matrix» xuất hiện đều phải đứng trong con trỏ về khuôn
      let i = -1, ok2 = true;
      while ((i = t.indexOf('dòng state-matrix', i + 1)) !== -1) {
        if (!t.slice(Math.max(0, i - 400), i + 400).includes('ux-spec-template.md')) ok2 = false;
      }
      return ok2;
    },
  };
  const SEN = 'Kế đó, VẪN TRƯỚC khi sinh 3 artifact:';
  const cutSentence = (t, marker, endMarker) => {
    const i = t.indexOf(marker); if (i < 0) return t;
    const j = t.indexOf(endMarker, i); return j < 0 ? t : t.slice(0, i) + t.slice(j);
  };
  const mutA = cutSentence(s, SEN, 'Rồi sinh CÙNG LÚC');       // gỡ TRỌN câu chỉ dẫn mới
  // mutant: gỡ TRỌN câu khỏi bước [3] (không đổi đúng chuỗi mà assertion tìm)
  const mutC = s.replace(/ Feature chạm UI: hình luồng\/màn vẽ TỪ section Đặc tả UX[^.]*\./, '');
  const labels = {
    a: 'UX3a S1 buộc điền Đặc tả UX TRƯỚC khi sinh 3 artifact (một câu, quan hệ)',
    a2: 'UX3a2 khuôn resolve qua resolve-plugin.mjs (cấm hardcode path cache)',
    b: 'UX3b chỉ dẫn contract ghi design_doc: + giữ marker (khuôn máy-đọc cho việc sau)',
    c: 'UX3c nghi thức hình: hình luồng/màn vẽ TỪ section Đặc tả UX',
    d: 'UX3d «dòng state-matrix» cũ không còn đứng ngoài con trỏ về khuôn (một nguồn)',
  };
  for (const k of Object.keys(checks)) ok(checks[k](s), labels[k]);       // đối chứng dương
  ok(!checks.a(mutA), 'UX3a-đỏ bản sao gỡ trọn câu → S1 thiếu chỉ dẫn điền Đặc tả UX trước 3 artifact');
  ok(!checks.b(mutA), 'UX3b-đỏ cùng mutant → mất luôn chỉ dẫn design_doc:/W8a (dây máy-đọc nằm trong câu bị gỡ)');
  ok(!checks.c(mutC), 'UX3c-đỏ bản sao đổi câu vẽ-từ-khuôn → phép kiểm bắt được');
  // a2-đỏ: thay mệnh đề resolve bằng đường cache cứng (resolve-plugin.mjs vẫn còn chỗ khác)
  const mutA2 = s.replace(
    /\(resolve bằng `AGX=[\s\S]*?KHÔNG dừng vòng\)/,
    '(đọc thẳng ~/.claude/plugins/cache/acceptance-gate-kit/acceptance-gate/2.3.0/skills/acceptance/references/ux-spec-template.md)');
  ok(!checks.a2(mutA2), 'UX3a2-đỏ bản sao hardcode path cache → phép kiểm bắt được');
  // d-đỏ: chèn một câu state-matrix MỒ CÔI (xa con trỏ) → d phải trượt
  const mutD = s + '\n\nFeature chạm UI thì design-doc phải có dòng state-matrix.\n';
  ok(!checks.d(mutD), 'UX3d-đỏ chèn câu state-matrix mồ côi → phép kiểm quét mọi lần xuất hiện');
}

// ── UX4: chuỗi miễn khớp từng ký tự giữa SKILL và khuôn ─────────────────────
if (want('UX4')) {
  const t = readFileSync(TPL, 'utf8');
  const s = readFileSync(SKILL, 'utf8');
  // Đo đúng điều hứa được: HAI TÀI LIỆU chép cùng một chuỗi cửa miễn (bên đọc
  // là NGƯỜI và ván thử — engine KHÔNG có reader cho chuỗi này, đã khai ở AC-4).
  // MỘT bộ kiểm cho cả hai chiều: cả hai bên cùng chứa đúng chuỗi trong nháy
  const mienKhop = (skillText, tplText) => skillText.includes(`"${MIEN}`) && tplText.includes(`"${MIEN}`);
  ok(mienKhop(s, t), `UX4 chuỗi miễn "${MIEN}" có mặt cả hai bên`);
  const sMut = s.replace(`"${MIEN}`, '"bỏ dac-ta-ux — ');
  ok(!mienKhop(sMut, t), 'UX4-đỏ bản sao đổi một bên → cùng bộ kiểm báo chuỗi miễn lệch giữa SKILL và khuôn');
}

process.exit(failures === 0 ? 0 : 1);
