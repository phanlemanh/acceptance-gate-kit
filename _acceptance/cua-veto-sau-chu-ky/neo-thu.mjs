// Chạy CHÍNH bộ neo trên một kho bất kỳ — để chiều đỏ 2 của chân khong-noi đo
// được nhánh LỖI HẠ TẦNG (thoát 97) thay vì chỉ đọc mã nguồn của nó.
import { baseAnchor } from './base-anchor.mjs';
console.log(baseAnchor(process.argv[2]));
