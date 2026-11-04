---
schema_version: 1
feature: Ca KK-8-do và mốc so «bản KH1» của khoi-khuon không rút bản trước vòng từ merge-base sống với main — main xanh lại
slug: kk8-do-khong-rut-merge-base
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: _acceptance/kk8-do-khong-rut-merge-base/design.md
---

# Acceptance Contract: kk8-do-khong-rut-merge-base

## Context

Gốc: acceptance-gate-kit/_acceptance/khoi-khuon-tren-the-cong/

CI `tests` trên `main` đỏ từ `ed44c2b8` (PR #483 gộp), run 41763815977: `FAIL: [KK-8-do] bản tiêm không cho lỗi «lệnh
khối KHUON-S1 không ghi lựa chọn» (lỗi: không có)`. Đây là check bắt buộc, nên mọi PR bị chặn. Gốc rễ: tệp test dựng bản
«trước vòng» từ `git merge-base HEAD origin/main`, mà sau khi vòng gộp thì điểm ấy đã mang vật của vòng. Chi tiết và kết
quả quét lớp ở design doc.

Thuật ngữ:

- **tệp test**: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`; mỗi ca in `PASS: [KK-…]` hoặc `FAIL: [KK-…] <lỗi>`.
- **bản KH1**: cây `scripts/` + `lib/` ở commit `0f734a69237616607a1401ae46d771eb2e4c5811` (main ngay trước #483).

## Criteria

- **AC-1** — Given cây là `main` sau #483 cộng nhánh này, tức `merge-base HEAD origin/main` đã mang vật của vòng
  khoi-khuon. When chạy trọn tệp test. Then thoát 0, in đúng 27 dòng `PASS: [KK-…]` và 0 dòng `FAIL`, trong đó có `PASS:
  [KK-8-do]`. Chiều đỏ nằm trong lịch sử: chính tệp này ở `ed44c2b8` cho `FAIL: [KK-8-do]` (CI run 41763815977).
- **AC-2** — Given SKILL feature-loop đang có trong cây. When KK-8-do dựng bản tiêm. Then nhát tiêm sinh từ vật: gỡ đúng
  một dòng (`PASS: [KK-8-tiem]`); tiêm lần hai lên bản đã tiêm thì nổ «bản tiêm không đổi gì» (`PASS: [KK-8-tiem-do]`);
  và KK-8-do bắt đúng lỗi «lệnh khối KHUON-S1 không ghi lựa chọn» (`PASS: [KK-8-do]`).
- **AC-3** — Given phép so «bằng từng byte bản KH1» của KK-1 và KK-5. When dựng bản KH1. Then mốc là sha ghim, dựng được
  và chứa `scripts/design-floor-khuon.mjs` (`PASS: [KK-0-goc]`); mốc vắng thì nổ «không có trong kho», và mốc trỏ chính
  HEAD thì nổ «trùng vật» (`PASS: [KK-0-goc-do]`).
- **AC-4** — Given tệp test của cây đang kiểm. When đếm lời gọi `git merge-base` dạng chuỗi trong chính tệp. Then số đếm
  là 0, nên mọi bản so đi qua `banGocVong` (`PASS: [KK-0-mot-moc]`); văn tệp bị chèn một lời gọi merge-base sống thì bộ
  đếm thấy đúng 1 (`PASS: [KK-0-mot-moc-do]`).
- **AC-5** — Given bản sao của tệp test, import viết lại tuyệt đối, chạy trên cây đang kiểm. When chạy bản sao nguyên vẹn
  rồi hai mutant gỡ chốt. Then bản nguyên vẹn xanh ở KK-0-goc-do và KK-8-tiem-do; mutant gỡ chốt «trùng vật» cho `FAIL:
  [KK-0-goc-do] … mốc trỏ HEAD không nổ đúng thông điệp`; mutant gỡ chốt «không đổi gì» cho `FAIL: [KK-8-tiem-do] … tiêm
  rỗng không nổ đúng thông điệp` (`PASS: [KK-0-dot-bien]`).

## Coverage

Bỏ quét hình thái: bài toán một chiều (một tệp test, hai chỗ lấy mốc). Lý do và giá ở entry `descope` «bỏ coverage-scan»
trong `decisions.jsonl`. Độ phủ theo LỚP thay bằng hai lệnh quét ghi nguyên văn ở design doc §Quét theo LỚP (A: 79 dòng ở 23 tệp; B: 7
dòng ở 5 tệp); mỗi tệp trong đầu ra có đúng một nhãn.

## Out of scope

- Năm chỗ cùng lớp ở tệp khác (THE-M0 · DP2-11 khong-dot · DP4-08 khong-ban-giao · KL-8 · ND-1-trang-giu/ND-7). Hôm nay
  chúng xanh rỗng trên main, và sẽ đỏ oan ở nhánh sau nào chạm hợp lệ các tệp mà chúng so. Đi tiếp ở hạt giống
  `docs/plans/2026-11-04-hat-giong-moc-so-merge-base-song.md`.
- Không đổi `scripts/`, `lib/`, `feature-loop/`, `skills/`; không ghi vào hồ sơ đã ký `khoi-khuon-tren-the-cong`.
- Không dựng khuôn dùng chung «mốc so của vòng» cho cả kho: vòng của hạt giống trên sẽ quyết hình dạng.

## Notes

### Known limits

- Năm chỗ cùng lớp chưa vá (xem Out of scope). Ngưỡng mở vòng: ≥1 lượt CI hoặc lượt chấm S4 đỏ oan ở một trong năm ca đó,
  hoặc trước hàng đầu tiên của đợt `nen-thiet-ke-0411` chạm `scripts/gate-card.js` — mốc nào tới trước.
- Mã của vòng viết trước Cổng Phạm vi: bản sửa `ad00a4db` có sẵn từ phiên điều phối khi vòng mở. Chiều đỏ vẫn đứng trước
  vật trong lịch sử nhánh (`305db2fa` đỏ → `0ca2325e` xanh), và CI đỏ ở `ed44c2b8` là chiều đỏ của AC-1.
