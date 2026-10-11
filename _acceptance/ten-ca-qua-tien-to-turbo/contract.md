---
schema_version: 1
feature: Tên ca chập chờn đọc được qua tiền tố của bộ chạy monorepo — dòng pin chap_chon gọi đúng tên ca khi suite chạy qua turbo
slug: ten-ca-qua-tien-to-turbo
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/scripts/lib, không chạm t3_paths
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T09:50:54Z
design_doc: docs/superpowers/specs/2026-10-11-ten-ca-qua-tien-to-turbo-design.md
---

# Acceptance Contract: ten-ca-qua-tien-to-turbo

## Context

Gốc: crm/_acceptance/tro-ly-okr-bo-final-output — dòng `repin` 07/10 05:07 mang `chap_chon` của
suite 1/7 với `"ca": ["không rút được tên ca"]`, lần chạy lại thật duy nhất ở crm từ khi kho bật
`feature_loop.repin_retry: 1` (06/10).

AC-1 của hồ sơ đã ký `gia-lan-ghim-lai` hứa dòng pin gọi tên ca chập chờn, rút từ nhật ký lần đỏ
theo năm khuôn neo đầu dòng. Chạy qua turbo mà không có TTY — đúng hoàn cảnh của làn ghim lại —
mọi dòng con mang tiền tố `<gói>:<tác vụ>: `, nên neo đầu dòng không gặp khuôn nào và lời hứa
rỗng ở mọi kho dùng turbo. Tái hiện 11/10 bằng turbo 2.10.8 và `bun test` 1.3.12. Đây là sai
hợp đồng của vật đã giao; Điều phối M5 gật mở vòng 11/10 (hàng G2 của lộ trình kit, kiểm trước
khi mở).

Source input: kiểm trước khi mở hàng G2 (11/10); run-log crm nêu trên; bản ghi turbo + bun thật.

## Criteria

- AC-1: Given bản ghi đầu ra THẬT của `turbo run test --concurrency=1 --filter=<gói>` (hình dạng lệnh suite của crm; turbo 2.10.8 chạy `bun test` 1.3.12) chạy qua chính `chayLenh` của làn và ghép stdout rồi stderr như làn đưa vào `rutTenCa`, trên một kho monorepo có một ca đỏ `app-rieng > chay canh apps/agent` và hai ca xanh — tệp `tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log` kèm `NGUON.md` ghi lệnh đã chạy, đối chiếu với lệnh suite của crm và phép thay đường dẫn tuyệt đối, When `rutTenCa` đọc trọn bản ghi, Then nó trả đúng `["app-rieng > chay canh apps/agent"]`.
- AC-2: Given năm dòng mẫu của năm khuôn hiện có (bun `(fail)`, vitest/jest `✗`, vitest/jest `×`, playwright `✘`, node:test `not ok`), mỗi dòng ở hai dạng — trần, và đứng sau tiền tố rút từ dòng ca đỏ của bản ghi AC-1, When `rutTenCa` đọc từng dòng, Then cả mười ô cho đúng tên đã viết trước, và dạng có tiền tố cho cùng tên với dạng trần.
- AC-3: Given các dòng của bản ghi AC-1 trừ dòng ca đỏ (dòng ca xanh `(pass)` — kể cả ca xanh có tên chứa «: (fail) » —, dòng tổng kết, dòng `error:` của bun, dòng `ERROR` của turbo), When `rutTenCa` đọc, Then không dòng nào thành tên ca và kết quả là `["không rút được tên ca"]`; And với đầu vào không mang tiền tố, ca `AC1-rut-ten-ca` của hồ sơ `gia-lan-ghim-lai` vẫn xanh.
- AC-4: Given `feature_loop.repin_retry: 1` và một suite lần đầu in bản ghi AC-1 rồi thoát 1, lần hai thoát 0, When làn ghim lại chạy `--write`, Then dòng `repin` mang `chap_chon[0].ca` bằng `["app-rieng > chay canh apps/agent"]`; And cùng kho ấy chạy bằng bản sao trọn thư mục `feature-loop/scripts` đã tắt phần bóc tiền tố cho `chap_chon[0].ca` bằng `["không rút được tên ca"]`.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix, trục dựng lại theo bài toán), 11/10.
Chân sản phẩm: `feature-loop/scripts/lib/chay-lai.mjs`, `feature-loop/scripts/repin-lane.mjs:357`
(bên gọi duy nhất). Chân ngành: trợ giúp của turbo (`--log-prefix auto|none|task`, mặc định ≈ task);
Trunk Flaky Tests (đọc JUnit XML, khuyên tắt chạy lại vì làm mờ việc phát hiện ca chập chờn).

- **Trục A — tiền tố dòng:** không có | turbo `<gói>:<tác vụ>: ` | một cụm khác kết bằng `: ` (lerna, yarn) | có khoảng trắng (pnpm đệ quy) | mã màu ANSI.
  - Thước CE: `turbo run --help`; bản ghi turbo + bun thật 11/10; run-log crm 07/10. Hai giá trị cuối là `[GIẢ ĐỊNH]` — chưa có đầu ra thật của kho tiêu thụ.
- **Trục B — khuôn ca:** bun | vitest/jest (`✗`, `×`) | playwright | node:test.
  - Thước CE: `KHUON_TEN_CA` trong `chay-lai.mjs`.
- **Trục C — loại dòng:** ca đỏ | ca xanh | tổng kết | dòng lỗi của bộ chạy | dòng trống.
  - Thước CE: bản ghi thật.
- **Trục D — nơi đọc:** hàm `rutTenCa` | dòng pin `chap_chon` của làn ghim lại.
  - Thước CE: `git grep rutTenCa` — một bên gọi.
- **Ô Core:** A-turbo × B-bun × C-đỏ × D (AC-1, AC-4) · A-turbo/A-không × mọi B × C-đỏ (AC-2) · A-turbo × C khác đỏ, và A-không (AC-3).
- **Later:** A-cụm khác (lerna, yarn) đo trên đầu ra thật · A-khoảng trắng · A-ANSI.
- **Never:** chạy lại mức ca (quyết của `gia-lan-ghim-lai`: chạy lại mức LỆNH) · đọc JUnit XML thay stdout (đổi mặc định mọi kho).

## Out of scope

- Bóc tiền tố có khoảng trắng (pnpm đệ quy `<thư mục> <script>: `) và mã màu ANSI — chưa có đầu ra thật nào của kho tiêu thụ mang hai dạng đó.
- Đọc báo cáo JUnit XML thay cho stdout — mỗi kho phải bật reporter, đổi mặc định của mọi kho.
- Chạy lại hay chọn theo ca — `gia-lan-ghim-lai` đã quyết chạy lại mức lệnh.
- Sửa `feature-loop/scripts/repin-lane.mjs` — bên gọi không cần đổi; vòng vá gate-card đang sửa tệp này.
- Ca sống gọi turbo thật trong suite — kit không cài turbo; bản ghi đã commit là đầu ra thật, `NGUON.md` ghi cách sinh lại.

## Notes

- Không migration. Trường `ca` giữ nguyên khuôn; chỉ những dòng hôm nay rơi về câu dự phòng mới có thể đổi kết quả.
- Hạn chế đã biết khi giao:
  - Tiền tố một cụm của bộ chạy khác (lerna, yarn) cùng hình dạng nên được bóc, nhưng chưa đo trên đầu ra thật của chúng.
  - Dòng log trần dạng `nhan: (fail) x`, hôm nay không khớp, sẽ thành tên `x`. Trường `ca` là chỉ dẫn cho người sửa ca, không vào phán quyết của làn.
  - Ngưỡng mở lại phần ngoài phạm vi (đếm được sau khi dọn worktree — nhật ký trọn thì không): ≥1 dòng `repin` có `chap_chon` mang câu dự phòng, ở một kho đã cài mốc chứa vòng này. Đếm: grep chuỗi «không rút được tên ca» trên các tệp run-log của kho, chỉ dòng ghi sau ngày cài. Nổ thì mở điều tra dạng tiền tố ngay lúc đó, khi nhật ký còn.
- Quan sát reality (Ý↔Vật, ADR 0020): lần chạy lại thật đầu tiên ở crm sau khi crm cài mốc chứa vòng này phải có `chap_chon[].ca` khác câu dự phòng. N = số dòng `chap_chon` của crm ghi sau ngày cài; N bằng 0 thì chưa đọc được, không đọc thành «đã chữa».
