# Kế hoạch: cong-cu-xet-tep-ton-tai

Hai việc tuần tự, không task độc lập (cùng hai tệp).

1. **Ca đo trước** — `tests/scripts/duong-nen.test.mjs` thêm NEN-TT1…TT5 (lượt «có», lượt «vắng», ba đột biến);
   `tests/scripts/duong-nen-fixture.mjs` cho `chayNen` nhận `cwd`. Verify: chạy tệp ca trên bản trước vá → NEN-TT1
   và NEN-TT5 ĐỎ có tên; commit riêng. Phục vụ E1–E5.
2. **Vật** — `feature-loop/scripts/duong-nen.mjs` thêm khối marker `CONG-CU-DUONG-TEP` (`laDuongTep`, `coTep`) và
   nhánh xét tệp trong chân công cụ. Verify: tệp ca 57/57 xanh, lệnh `config:executors.script.cxt_ton_tai` thoát 0.
   Phục vụ E1–E5.
