---
schema_version: 1
feature: hồ sơ đã nghỉ vẫn mang cờ quá hạn trên thẻ khởi động — bên viết khớp lại bên đọc của RT13
slug: nghi-van-mang-co-qua-han
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-01T02:54:52Z
---

# Acceptance Contract: nghi-van-mang-co-qua-han

Gốc: acceptance-gate-kit/_acceptance/cong-dang-co-cua

## Context

Từ 01/10/2026 ca RT13 (`tests/plugins/ra-co-ten.test.mjs`) đỏ trên `main`: hồ sơ
`cong-dang-co-cua` được owner cho nghỉ 21/09 (d-20260921T221508Z-18) và hạn tự khai
«muộn nhất 2026-09-30» vừa qua. Bên đọc (RT13) đòi cờ `qua-timebox` cắt ngang MỌI ô
của bộ quét thẻ khởi động; bên viết (`scripts/start-scan.mjs`) không tính cờ ở lối
nghỉ. Ca đỏ theo ngày lịch nên mọi vòng của kit bị trả về ở lượt chấm từ hôm đó (đo ở
vòng `thuoc-biet-truoc-khong-phan-duoc`, lượt 1). Owner chọn 01/10: sửa bên viết —
chú thích sẵn có trong mã nói cờ này «thuộc về hồ sơ» bất kể lối nó đậu.

## Criteria

- AC-1: Given một hồ sơ đã ký, có dòng nghỉ hợp lệ trong sổ quyết định, và `opportunity.md` khai hạn đã qua, When chạy bộ quét thẻ khởi động, Then hồ sơ đậu ô `da-nghi` và mang cờ `qua-timebox`; cùng hồ sơ với hạn còn ở tương lai, hoặc không có `opportunity.md`, → ô `da-nghi`, KHÔNG cờ, bộ quét không ném (ma trận fixture không phụ thuộc ngày chạy); đột biến gỡ cờ ở lối nghỉ trên bản sao bộ quét → ca nêu đúng slug «nghỉ quá hạn» thiếu cờ; và trên cây thật mọi ô đọc cờ khớp vị từ `quaTimebox` của lib.
- AC-2: Given các bộ đọc khác của hồ sơ nghỉ (ô, cờ nghỉ-thiếu-vế, nghỉ-chưa-ký, cửa veto), When chạy bộ ca của hồ sơ `ho-so-nghi`, Then không ca nào đổi — lối nghỉ chỉ thêm khoá `flags`, không đổi ô.

## Coverage

Một chiều (lối nghỉ × hạn qua/chưa qua) cộng một ô hồi quy; không chạy quét không
gian (entry `descope` «bỏ coverage-scan» trong sổ).

- Trục hạn: đã qua (AC-1 ô 1) | chưa qua (AC-1 ô 2) | không có `opportunity.md` (lối đọc lười trả null → không cờ; AC-1 ô fixture thứ mười). [thước CE: ba nhánh của `oNghiTxt && quaTimebox(oNghiTxt)`]
- Trục bộ đọc: RT13 (AC-1) | bộ ca hồ sơ nghỉ (AC-2).

## Out of scope

- KHÔNG đổi nghĩa ô `da-nghi` hay thứ tự nhóm trên thẻ — chỉ thêm cờ.
- KHÔNG gỡ hạn tự khai của `cong-dang-co-cua` hay của 13 hồ sơ quá hạn khác trên cây — đó là hồ sơ đã ký/nghỉ.
- KHÔNG tăng phiên bản gói — kit lên số theo mốc phát hành.

## Notes

- Hạng T2: `scripts/start-scan.mjs`, `tests/plugins/**`; ngoài `t3_paths`.
- Fixture do code sinh trong lần chạy (`mkWs` sẵn có của tệp ca); đột biến đi qua vòng MUTANT sẵn có (kiểm mỏ neo khớp đúng một lần, bản sao chạy được) — không dựng thước mới.
