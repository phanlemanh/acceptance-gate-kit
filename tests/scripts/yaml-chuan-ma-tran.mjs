// yaml-chuan-ma-tran.mjs — ma trận viết trước của bộ dò YAML không chuẩn (hồ sơ bo-doc-ho-so-khoan-dung, AC-1).
// MỘT nguồn cho hai bên đo: ca YC-1 (tests/scripts/yaml-chuan.test.mjs) so bộ dò với cột `mong`, răng dữ liệu thật
// (_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs) cho PyYAML đọc CHÍNH 19 ô này — bản hỏng phải bị từ chối,
// bản lành và dạng hợp lệ phải được nhận — để bản hỏng/lành không phải trí tưởng tượng của người viết bộ dò.
// Mỗi bản hỏng mang ĐÚNG một chỗ của lớp mình, ở dòng biết trước; bản lành là chính bản ấy đã sửa chỗ đó.

const DAU = ['schema_version: 1', 'feature_slug: thu', 'evals:', '  - id: E1', '    criterion: AC-1', '    executor: script', '    cmd: config:executors.script.a'];
const PATHS = '    paths: [scripts/a.mjs, "apps/(app)/[slug]/b.tsx"]';
const DUOI = ['    evidence_required: [run_id, exit_code]', '  - id: E2', '    criterion: AC-2', '    executor: judgment', '    inputs: [CHANGELOG.md]', ''];
// tep(than) — thân (mảng dòng) chèn sau dòng 7; dòng 8 là dòng đầu của thân.
const tep = (than, { dau = DAU } = {}) => [...dau, ...than, ...DUOI].join('\n');

// [ô, mã lớp | null, dòng mong đợi | null, văn bản]
export function maTran() {
  const o = [];
  const hong = (lop, dong, text) => o.push({ o: `${lop}/hong`, text, mong: { loai: lop, dong } });
  const lanh = (lop, text) => o.push({ o: `${lop}/lanh`, text, mong: null });
  const hopLe = (ten, text) => o.push({ o: `hop-le/${ten}`, text, mong: null });

  hong('chu-sau-nhay-dong', 9, tep([PATHS, '    expected: "exit 0; gọi "okr" rồi" xong']));
  lanh('chu-sau-nhay-dong', tep([PATHS, '    expected: \'exit 0; gọi "okr" rồi xong\'']));

  hong('thoat-sai-nhay-kep', 9, tep([PATHS, '    expected: "dòng khớp \'^đợt \\S+ xong\'"']));
  lanh('thoat-sai-nhay-kep', tep([PATHS, '    expected: "dòng khớp \'^đợt \\\\S+ xong\'"']));

  hong('ngoac-trong-muc-tran', 8, tep(['    paths: [scripts/a.mjs, apps/(app)/[slug]/b.tsx]', '    expected: exit 0']));
  lanh('ngoac-trong-muc-tran', tep(['    paths: [scripts/a.mjs, "apps/(app)/[slug]/b.tsx"]', '    expected: exit 0']));

  hong('khoi-chu-thut-lui', 11, tep([PATHS, '    expected: |', '        dòng đầu thụt tám', '      Anh: dòng thụt sáu']));
  lanh('khoi-chu-thut-lui', tep([PATHS, '    expected: |', '      dòng đầu thụt sáu', '      Anh: dòng thụt sáu']));

  hong('hai-cham-trong-gia-tri-tran', 9, tep([PATHS, '    expected: exit 0 — kiểm nút (mới): chỉ dùng token']));
  lanh('hai-cham-trong-gia-tri-tran', tep([PATHS, '    expected: \'exit 0 — kiểm nút (mới): chỉ dùng token\'']));

  hong('dong-goc-khong-phai-khoa', 1, tep([PATHS, '    expected: exit 0'], { dau: ['> Ghi chú đầu tệp viết như trích dẫn', ...DAU] }));
  lanh('dong-goc-khong-phai-khoa', tep([PATHS, '    expected: exit 0'], { dau: ['# Ghi chú đầu tệp viết như trích dẫn', ...DAU] }));

  hopLe('nhay-kep-nhieu-dong', tep([PATHS, '    expected: "exit 0; dòng một', '      dòng hai có # không phải chú thích"']));
  hopLe('nhay-don-nhieu-dong', tep([PATHS, '    expected: \'exit 0; dòng một', '      dòng hai\'']));
  hopLe('nhay-don-hai-nhay', tep([PATHS, '    expected: \'nó\'\'s ổn, gọi "okr"\'']));
  hopLe('nhay-kep-thoat-nhay', tep([PATHS, '    expected: "gọi \\"okr\\" xong # không phải chú thích"  # chú thích thật']));
  hopLe('khoi-chu-chu-thich', tep([PATHS, '    expected: >   # chú thích đầu khối', '      dòng một # không phải chú thích', '', '      dòng ba: vẫn là chữ']));
  hopLe('luong-nhay-ngoac', tep(['    paths: ["apps/(app)/[slug]/b.tsx", \'apps/[id]/c.ts\', scripts/a.mjs]', '    expected: exit 0']));
  hopLe('neo-bi-danh', tep(['    paths: &p [scripts/a.mjs]', '    inputs: *p', '    expected: exit 0']));
  return o;
}
