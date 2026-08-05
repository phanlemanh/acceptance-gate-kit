// measure-pins.mjs — PIN 6 hình dạng đo-lường, HẰNG ĐỘC LẬP chép nguyên văn
// từ design doc docs/superpowers/specs/2026-08-05-matrix-measure-law-design.md
// §"Sáu hình dạng" (chống expectation-cùng-nguồn với vật đo — gap-probe P0
// của matrix-measure-law). Dùng chung bởi acceptance-verify.test.mjs (MM3)
// và measure-law-mutants.test.mjs (MM7).
export const PIN_SHAPES = [
  'Đo CHỈ DẪN thay vì ĐẦU RA (grep file hướng dẫn trong khi renderer không đọc key).',
  'Fixture VIẾT TAY đúng khuôn bên đọc — không round-trip rút-từ-writer-đọc-bằng-reader.',
  'Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ giữa các giá trị.',
  'Assertion âm-tính-một-mình: không đối chứng dương, không ghim thông điệp.',
  'Tuyên quét LỚP nhưng chỉ có điểm-case — thiếu ma trận toàn phần viết-trước (số assert = số phần tử, mẫu P105).',
  'Đường dẫn hardcode ROOT — đo checkout của tác giả thay vì cây đang kiểm.',
];

// Phép đo ba-chiều: pin ↔ const MEASUREMENT_SHAPES trong văn bản script ↔ prompt.
export function measureShapes(srcText, promptText) {
  const m = srcText.match(/const MEASUREMENT_SHAPES = \[([\s\S]*?)\]/);
  if (!m) return { ok: false, why: 'không thấy const MEASUREMENT_SHAPES' };
  const constShapes = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
  for (const p of PIN_SHAPES) {
    if (!constShapes.some(c => c === p)) return { ok: false, why: `const thiếu pin: ${p.slice(0, 40)}` };
    if (promptText && !promptText.includes(p)) return { ok: false, why: `prompt thiếu pin: ${p.slice(0, 40)}` };
  }
  if (constShapes.length !== PIN_SHAPES.length) return { ok: false, why: `const có ${constShapes.length} phần tử, pin có ${PIN_SHAPES.length}` };
  return { ok: true };
}
