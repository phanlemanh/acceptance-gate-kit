---
schema_version: 1
slug: cham-lai-khong-tu-doi
feature: Lượt chấm lại không tự dối — eval đổi định nghĩa thì chạy lại, và thước của lượt nào so bằng tham số của chính lượt ấy
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:                   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: VA1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng VA1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026 (gộp SAU RM3b, trước cắt bản).

Gốc: crm-onehub/_acceptance/goi-y-mo-ke-hoach/ — lượt 3 của DA3b (M5 báo 16/10 trên crm-onehub #375): chủ kho sửa
AC-10 và `expected` của E10 (21→22) giữa lượt 2 và 3; S4 vẫn MANG SANG E10 từ lượt 2 vì `paths` không đổi → tiêu chí
mới không có bằng chứng, thẻ PENDING-JUDGMENT 0 đỏ. Lỗi thứ hai cùng lớp, cùng ngày (Mac Studio, vòng K7 của crm):
`thuoc-vat --write` ghi dòng «thước lệch» của lượt 2 và 3 bằng sha lượt 1 và ghi muộn một dòng «cây đổi» cho lượt 1
→ thẻ Cổng 2 khoá ở «thước lệch — chấm lại», mất khối Lối ra khi chạm trần 3 lượt.

**Ai đau:** chủ kho ký Cổng Bằng chứng. Cả hai lỗi làm thẻ nói sai về chính lượt chấm: lỗi một cho một màu xanh mà
không eval nào đã chạy cho câu hỏi hiện tại (ký nhầm); lỗi hai khoá thẻ ở một nhãn không có thật (không ký được, mất
lối ra). Đây là nguyên tố 2 — bằng chứng không tự dối — gãy ở đúng chỗ máy được tin để chạy nhanh.

**Số đo trước — máy đo 16/10:**
- Lỗi một: khoá mang sang (`feature-loop/scripts/carry-plan.mjs`) chỉ xét `paths` × diff + lượt trước xanh; không trường
  nào của chính khối eval hay chữ tiêu chí vào phép so. Tái hiện bằng kho do code sinh: 5/5 kiểu đổi khối (expected ·
  cmd · executor · expected_exit · criterion) và đổi chữ tiêu chí đều được mang sang trên bản hiện hành.
- Lỗi hai: `thuoc-vat --write` luôn đọc `<hồ sơ>/s4-args.json`. crm-onehub có 25 tệp `s4-args*.json` đã commit, trong
  đó `khung-man-chung` có `s4-args-r2.json` + `s4-args-r3.json` — thói quen lưu tham số lượt sau vào tệp riêng là
  thật; mỗi lượt như vậy bị so bằng ảnh chụp lượt 1. Tái hiện K7 nguyên hình (thoát 5, `thuoc-lech` r2 mang sha r1,
  `cay-doi` r1) trên bản hiện hành. `thuoc-vat.mjs` không đổi từ v2.28.0 tới main → lỗi sống ở mọi kho.

**Ý định:** lượt chấm lại chỉ mang sang một eval khi nó hỏi CÙNG câu với lần nó thật sự chạy; và mọi dòng nhãn mà
bộ ghi thước viết là của lượt vừa chấm. Kho không gặp hai ca này không đổi hành vi (luật 26/09): eval không đổi định
nghĩa vẫn mang sang như cũ, hồ sơ dùng một tệp `s4-args.json` ghi đúng các dòng như cũ.

**Ngoại lệ luật chiều rộng (b), nói thẳng:** nới luật (b) cho cửa sổ 16/10, chủ kho quyết — không phải tiền lệ.
Bản vá đi CÙNG bản phát hành với gói road-map (một lần kho nhận); K-A chạy sau.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi crm nhận bản có VA1, trong các lượt chấm lại (round ≥ 2) của 30 ngày — có eval nào
  được mang sang mà khối eval hay chữ tiêu chí của nó đã đổi từ lượt nó thật chạy, và có dòng `thuoc-lech`/`cay-doi`
  nào mang sha khác sha của lượt nó ghi cho không?
  Thước: với mỗi dòng mang sang (`carried_from_round`) trong run-log, so khối eval + chữ tiêu chí ở sha lượt gốc với sha
  lượt mang (`git show`); với mỗi dòng `thuoc-lech`, so `sha` với `sha` của round-tally cùng round.
- Kết quả nào là SỐNG: 0 dòng mang sang có định nghĩa đổi · 0 dòng thước/cây mang sha lượt khác.
- Kết quả nào là CHẾT: ≥ 1 dòng như thế trên nhánh chính crm sau khi nhận.
- Ở giữa (ITERATE): 0 dòng sai nhưng ≥ 1 lượt `thuoc-vat` dừng «không tệp args nào thuộc lượt cuối» mà phiên phải hỏi người thay vì tự chạy lại với `--args`.
- Timebox: 2026-11-19. Tới hạn mà crm chưa nhận bản → «chưa đọc được ở đây» (nhãn trạng thái, không phải CHẾT); kho
  thử máy sinh trong bộ kiểm đọc được ngay ở lượt chấm.
