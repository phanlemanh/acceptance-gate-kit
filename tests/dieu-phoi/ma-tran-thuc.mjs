// Ma trận đánh thức viết sẵn của DP3-09 — một nguồn cho ca DP3-09 (tiep-tuc.test.mjs) và ca TC1-03, TC1-06
// (danh-thuc-ma-phien.test.mjs). Tệp .test.mjs không import lẫn nhau (khuôn DP8-11), nên dữ liệu chung sống ở đây.
// Mỗi hàng: [nhãn, cần, thức (phút trước), nhịp giám sát (phút trước | null), việc chờ: none|yeu-cau|su-kien|khong-dot]
export const MA_TRAN_THUC = [
  ['a', 'khong', 5, 3, 'yeu-cau'],
  ['b', 'nhan-giam-sat', 50, 3, 'yeu-cau'],
  ['c', 'khong', 50, 50, 'none'],
  ['d', 'bao-chu-kho', 50, 50, 'yeu-cau'],
  ['e', 'khong', null, null, 'khong-dot'],
  ['f', 'khong', 80, 80, 'none'],
  ['g', 'nhan-giam-sat', 50, 3, 'su-kien'],
];
