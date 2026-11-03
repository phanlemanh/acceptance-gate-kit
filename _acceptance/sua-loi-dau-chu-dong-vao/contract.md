---
schema_version: 1
feature: Điều phối thôi kẹt hàng vì `sau` trỏ slug, thôi treo khoá sau gộp và thôi canh nhầm khoá ghim lại; người chấm ui-check biết URL bản dev và chạy lần lượt — sửa năm lỗi của đợt dau-chu-dong-vao (#477) cho mốc 2.37.0
slug: sua-loi-dau-chu-dong-vao
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-02T23:18:18Z
design_doc: _acceptance/sua-loi-dau-chu-dong-vao/design.md
---

# Acceptance Contract: sua-loi-dau-chu-dong-vao

## Context

Gốc: issue phanlemanh/acceptance-gate-kit#477 — năm lỗi kit v2.36.0 gặp trong đợt `dau-chu-dong-vao` của
onehub-quy-hang (5 dãy, 35 hàng gộp, 53 PR), đều đã lách tay; lỗi (a) của nhóm 3/4 đã báo ở #403 §3 ngày 23/10.
Kho chờ nhận mốc 2.37.0: onehub-quy-hang (nâng `KIT_TAG` trước đợt `dau-khach-nhap`). Thiết kế: design doc ở
frontmatter.

Thuật ngữ:
- **đợt thử** = thư mục đợt tạm do ca đo dựng trong lượt (kho git tạm + `.acceptance-runs/dieu-phoi-hien-tai`).
- **khoá** = thư mục `khoa/<tài nguyên>/chu.json` của đợt; **tài nguyên** ∈ `s4`, `duong-nen`, `merge`; **loại** đơn ∈
  `s4`, `ghim-lai`, `duong-nen`, `merge` (bảng `TAI_NGUYEN` ánh xạ loại → tài nguyên).
- **đã gộp** = hợp đồng của hồ sơ trên `origin/<nhánh chính>` đọc ra đã thông theo `daGopTrenNhanhChinh`.

## Criteria

- AC-1: Given hàng C khai `sau` bằng SLUG của hàng B, B mang `ma`, When B đã gộp và bộ chọn hàng kế chạy cho dãy của
  C, Then C được giao; đối chứng: B chưa gộp → C không được giao, lý do chờ `phu-thuoc`; `sau` khai bằng mã vẫn như cũ.
- AC-2: Given `sau` của một hàng trỏ chuỗi không khớp mã hay slug của hàng nào, When bộ chọn hàng kế chạy, Then phán
  quyết không đổi so với bản trước (hàng không được giao, chờ `phu-thuoc`) và kết quả mang `sau_khong_co` gọi tên
  «<slug hàng>→<chuỗi>»; bộ đọc `tiep/<dãy>.json` (`hangKeTuTiep`) trả lý do chứa «sau trỏ hàng không có».
- AC-3: Given thợ của một dãy, When `xin ghim-lai`, Then lệnh chờ in ra trỏ `khoa/s4/chu.json` (tài nguyên đã giải),
  không trỏ `khoa/ghim-lai`; `xin s4` trỏ `khoa/s4`, `xin merge` trỏ `khoa/merge`; và mẫu LUAT của đợt bảo thợ chép
  đúng lệnh chờ do `xin` in thay vì tự điền `<tài nguyên>`.
- AC-4: Given dãy đang giữ `khoa/s4`, When thợ chạy `nha ghim-lai`, Then `khoa/s4` bị xoá và lệnh in «đã nhả s4»;
  When `nha <tên không phải loại hay tài nguyên>`, Then thoát 1 với thông điệp nêu tên ấy và bảng tên hợp lệ, không
  khoá nào bị chạm; When `nha ghim-lai` mà `khoa/s4` đứng tên dãy KHÁC, Then thoát 1 nêu chủ khoá, khoá còn nguyên;
  When `nha merge` mà khoá vắng, Then như cũ: thoát 0, «không có — không làm gì».
- AC-5: Given dãy giữ `khoa/merge` và đợt cho tự gộp, When `gop <PR>` gộp thành công, Then `khoa/merge` không còn và
  sự kiện `gop` ghi đã nhả; When `gop` không gộp (lối `cu`), Then `khoa/merge` vẫn còn, chủ giữ nguyên.
- AC-6: Given một khoá còn hạn thuê, nhịp tươi, mà hồ sơ `chu.slug` VỪA sang đã gộp trên nhánh chính ở nhịp này
  (khoá có trước lúc gộp), When bộ phát lịch chạy một nhịp, Then khoá bị thu hồi với sự kiện `thu-hoi` lý do «hồ sơ
  <slug> đã gộp trên nhánh chính», `can_phan: false`, và lượt đo của khoá khép với `ket_thuc: nha` (không phải
  `thu-hoi`); đối chứng: hồ sơ chưa gộp → khoá giữ nguyên; hồ sơ đã gộp từ nhịp trước (khoá cấp cố ý sau lúc gộp, vd
  ghim lại hồ sơ đã gộp) → khoá giữ nguyên; khoá chưa gộp hết hạn thuê với nhịp cũ → lượt đo vẫn mang `thu-hoi` như cũ.
- AC-7: Given hồ sơ có eval ui-check và `_acceptance/config.yaml` khai `dev_server.url`, When `s4-args.mjs` sinh args,
  Then args mang `devServerUrl` bằng giá trị đã giải; config không khai → trường vắng và s4-args vẫn sinh tệp; và lời
  gọi người chấm ui-check của workflow chứa giá trị `devServerUrl`, vắng thì chứa «config chưa khai dev_server.url»;
  eval không có trường `target` mới.
- AC-8: Given lượt chấm có từ hai eval ui-check, When workflow chạy khối ui, Then khoảng chạy của hai người chấm
  ui-check không chồng nhau (người sau chỉ bắt đầu khi người trước xong), mỗi eval vẫn đúng một người chấm và kết quả
  của cả hai vào báo cáo; khối ui vẫn chạy song song với lệnh máy.
- AC-9: Given kho cài kit theo plugin (gốc kho không có `lib/`, script đặt cạnh `../lib/`), When lưới trước gộp kiểm
  hồ sơ máy-thông xanh-sạch, Then hồ sơ qua lưới (ca LK1 có sẵn), và bộ giải chỉ-gốc-kho làm nó đỏ với thông điệp
  fail-closed (ca LK1-do) — lỗi 1 đi cùng mốc 2.37.0.

## Coverage

Bỏ quét không gian — phạm vi do spec ngoài chốt (issue #477, năm lỗi đã định danh, mỗi lỗi một hướng sửa đã giao);
xem entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`. Ma trận lỗi → AC: lỗi 1 → AC-9 · lỗi 2 → AC-1, AC-2 ·
lỗi 3/4 (a) → AC-3 · (b) → AC-4 · (c) → AC-5 · (d) → AC-6 · lỗi 5 → AC-7, AC-8.

## Out of scope

- Trường `target` mới cho eval ui-check — là CỘNG, cần owner phê; vòng này chỉ tiêm `dev_server.url` đã giải.
- Truyền tham số lớn của lượt chấm bằng tệp — sống ở hạt giống
  `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md`; vòng này chỉ thêm dòng `Gốc:` trỏ #477 §5.
- Đổi tên khoá `ghim-lai` thành khoá riêng — ghim lại và chấm cố ý dùng chung một chỗ (hai lượt nặng).
- Đổi `chamNhip` (hook nhịp) — thu hồi theo «đã gộp» ở bộ phát lịch là nghiệm đúng tầng; nhịp vẫn là tín hiệu sống.
- Vùng khai rộng tự thêm `sau` (#430) và ghim lại nhiều lần mỗi hàng (#468, #459) — đã có issue riêng.

## Notes

- Trace nguyên tố 3 (khoảnh khắc quyết thật): mỗi lỗi đã đốt lượt gọi giám sát/chủ kho trong đợt — 5 hàng kẹt, 4 lần
  nhả tay, 3 lần đứng 10–11′, mỗi hồ sơ máy-thông hạ về ký tay. Người hưởng: giám sát và chủ kho onehub-quy-hang ở
  đợt `dau-khach-nhap`, và mọi kho chạy Điều phối – Thợ.
