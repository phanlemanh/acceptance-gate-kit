// Khuôn CHUNG cho mọi chiều đỏ của bộ răng lan-ghim-lai-theo-paths (owner chọn «đổi khuôn» 03/10 sau
// hai lượt chấm cùng lớp «khẳng định âm tính một mình»). Một phép phá chỉ được tính «đã bắt» khi CÓ
// dấu dương rằng bản sao đã chạy tới đúng bước của hồ sơ — vắng một dòng mà bản sao sập sớm thì
// không phân biệt được với bắt đúng lỗi (CLAUDE.md, bất biến «âm tính một mình»).
// Lưới trước-merge chạy trọn: in dòng tổng kết cuối VÀ có ít nhất một dòng của hồ sơ feat.
export const daChayLuoi = (out) => /pre-merge-check: (clean|\d+ violation)/.test(out) && /\[feat\]/.test(out);
// Làn đi qua bước bỏ-qua và chạy thật: in dòng «[lane] sha <40 hex>».
export const daChayLan = (err) => /\[lane\] sha [0-9a-f]{40}/.test(String(err || ''));
// ok(chay ∧ thay) — thông điệp ghim cả hai vế để người đọc thấy vế nào hụt.
export const batDo = (ok, ten, chay, thay) => ok(chay && thay, `${ten} [bản sao chạy tới hồ sơ: ${chay ? 'có' : 'KHÔNG'} · thấy lỗi: ${thay ? 'có' : 'KHÔNG'}]`);
