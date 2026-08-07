# Kế hoạch — stop-patching-law

Cổng 1 duyệt 2026-08-07 (Manh Phan). T2 · 6 AC · 6 eval (5 máy + 1 hội đồng).

## Bảng kế hoạch

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Vòng lặp dừng lại hỏi khi bản sửa lần hai hỏng cùng kiểu, thay vì đốt thêm một vòng | `feature-loop/skills/feature-loop/SKILL.md` | AC-1 (mệnh đề đủ bốn ý) |
| Trợ lý chạy môi trường Codex xử sự y hệt bản chính | `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` | AC-1, AC-3 (cùng nhánh, đúng thứ tự) |
| Người duyệt biết "cùng kiểu lỗi" nghĩa gì, không hiểu rộng hẹp tuỳ hứng | hai bản chỉ dẫn trên | AC-2 (hai vế định nghĩa) |
| Phép kiểm đỏ đúng chỗ khi ai đó gỡ mất luật | `tests/plugins/run-tests.sh` | AC-4 (16 ca phá thử) |
| Bản đóng gói mang đúng luật mới | `plugins/` (gương) | AC-5 (lưới xanh, gương khớp) |
| Luật thật sự đổi cách xử sự, không chỉ nằm trên giấy | hồ sơ chấm của việc này | AC-6 (bốn lượt đóng vai) |

## Vị trí đặt luật (đã chốt)

- Bản chính: trong `## S4 — VERIFY`, **bên trong** nhánh `REJECT → quay S3 fix`,
  ngay sau câu "append entry `fix`" và ngay **trước** "Tối đa 3 round".
- Bản Codex: trong `## S4 - Verify`, ngay **trước** câu "Cap at three rounds".
- Tiêu đề bao ngoài gần nhất của cả hai mệnh đề dừng phải BẰNG NHAU — đây là
  thứ AC-3 đo, không phải thứ tự ký tự.

## Task

1. **T1 — soạn khối luật** (nguyên văn dùng cho cả hai bản, chỉ khác ngôn ngữ):
   4 ý + 2 vế, gói giữa cặp mốc `STOP-PATCHING-CLAUSE`.
2. **T2 — chèn bản chính** vào `feature-loop/.../SKILL.md` đúng vị trí trên.
3. **T3 — chèn bản Codex** vào `codex/.../SKILL.md` đúng vị trí trên.
4. **T4 — viết phép đo** (một khối mới trong `tests/plugins/run-tests.sh`):
   - rút khối giữa cặp mốc từng bản; mốc ≠ 1 lần → ĐỎ nêu số lần
   - 8 ô nội dung (4 ý × 2 bản) + 4 ô định nghĩa (2 vế × 2 bản), đo **trong khối**
   - quan hệ chứa: tiêu đề bao ngoài gần nhất của hai mệnh đề dừng bằng nhau;
     đối chứng dời-khối-ra-ngoài phải ĐỎ, bản nguyên vẹn XANH trước
   - ma trận 16 ca đọc từ bảng `STOP-PATCH-MUTANTS` trong hợp đồng; số ca chạy
     phải bằng tổng suy từ bảng; mỗi ca ghim NGUYÊN VĂN cụm ở cột ba
5. **T5 — sinh biên bản vòng-2** cho phép chấm hành vi: script rút từ hồ sơ
   thật của `card-text-fidelity` (vòng 1 và vòng 2 cùng lớp lỗi), KHÔNG viết tay.
6. **T6 — đóng gói + lưới**: `sync-plugin-packages.sh`, `product-map.mjs`,
   nâng số bản `acceptance-gate` / `feature-loop`, chạy 6 lệnh kiểm.

## Rủi ro đã biết

- Chèn giữa một gạch đầu dòng rất dài (bản chính) dễ làm hỏng cấu trúc danh
  sách → kiểm bằng chính phép đo rút khối, không kiểm bằng mắt.
- Phép chấm hành vi có phương sai → bốn lượt, tiêu chí chấm ghi sẵn trong eval.
