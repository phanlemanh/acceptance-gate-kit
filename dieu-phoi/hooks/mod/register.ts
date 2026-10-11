import type { Register } from 'claude-code'
import { dangKyDocMucDung } from './doc-muc-dung'

// Module mod DUY NHẤT của gói (Claude Code nhận một module mỗi gói). Chỉ gọi từng phần; mỗi phần khai sự kiện của nó
// trong bảng MOD-SU-KIEN của scripts/mod-luat.mjs — DP6 và các hàng sau thêm một dòng gọi phần của mình ở đây.
export const register: Register = (on) => {
  dangKyDocMucDung(on)
}
