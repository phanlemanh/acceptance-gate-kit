// Luật nháy shell của gói: mọi chỗ ghép một giá trị vào dòng lệnh cho người hay máy chạy đều đi qua đây.
// Gói được chép phẳng vào `<thư mục đợt>/loi/`, nên tệp này chỉ import `./` và `node:`.
export const KY_TU_AN_TOAN = /^[\w./:@%+,-]+(?: [\w./:@%+,-]+)*$/;

// Cả một lệnh: dấu cách giữa các từ an toàn thì để nguyên.
export const nhayDon = (s) => (KY_TU_AN_TOAN.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`);
// Một ĐỐI SỐ (không phải cả lệnh): dấu cách cũng phải bọc.
export const nhayDoiSo = (s) => (/^[\w./:@%+,-]+$/.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`);
