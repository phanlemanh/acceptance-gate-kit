# findings-section-boundary — thiết kế

*2026-07-29 · **T3** (chạm `lib/**`) · Nguồn scope: disposition Gate 2 của
`claim-scan-parser-hardening` (Notes + entry revisit). Approach A chốt với
người duyệt: single-source luật trong `lib/`.*

## Bài toán THẬT (khác mô tả ở Gate 2 trước — khảo sát code làm rõ)

Finding S4 đề nghị "chọn một ranh giới rồi single-source". Khảo sát cho thấy
**hai luật đang xung đột có chủ đích**, mỗi bên có lỗi lịch sử ghi trong
comment:

| Reader | Luật | Lý do đã ghi trong code |
|---|---|---|
| `scripts/gate-card.js` `section()` · `scripts/evidence-page.js` `section()` (bản sao byte-identical) · `scripts/eval-coverage-lint.js` `sectionLines()` | dừng ở heading **cùng cấp hoặc cao hơn** — sub-heading là *content* | "Exiting on any heading dropped every AC after the first sub-heading … a human approving Gate 1 on a truncated card is **false-green**" |
| `feature-loop/scripts/claim-scan.mjs` (1.18.1) | dừng ở heading **mọi cấp** | sub-heading chứa bảng 6 cột → **claim ma có id citable** |

Nên "một luật cho tất cả" là SAI cả hai chiều: any-heading làm cụt AC trên
thẻ; same-or-higher làm lọt bảng ma vào `## Findings`. Luật đúng là
**per-section**: section chứa BẢNG (`Findings`) dừng ở mọi heading; section
văn xuôi (`Criteria`, `Coverage`, `Out of scope`, `Evidence`, `Iterations`,
`Analyst`, `Variance`) giữ sub-heading làm content.

## Approach A — luật per-section đặt MỘT chỗ có marker

1. **Mới: `lib/md-section.js`** — export `section(text, heading, opts)` +
   **bảng luật** `SECTION_BOUNDARY` khai per-section, bọc marker
   `<<<SECTION-BOUNDARY-TABLE … SECTION-BOUNDARY-TABLE>>>` (mẫu
   `OOC-ITEM-TEMPLATE` + case P55 của repo). Mặc định `same-or-higher`;
   `Findings` → `any-heading`.
2. `scripts/gate-card.js` + `scripts/evidence-page.js`: **xoá** định nghĩa
   `section()` riêng, `require('../lib/md-section.js')`. Không call-site nào
   tự khai luật — luật tra từ bảng theo TÊN section.
3. **Round-trip xuyên package:** `claim-scan.mjs` thuộc plugin *feature-loop*
   nên không import được `lib/` của *acceptance-gate*. Ràng buộc này đóng
   bằng test: rút bảng luật từ marker trong `lib/md-section.js`, chạy
   claim-scan trên cùng fixture, đối chiếu **hành vi** (cùng ranh giới cho
   `Findings`) — writer-đọc-bằng-reader, không so văn bản chép tay.
4. `scripts/eval-coverage-lint.js` giữ `sectionLines()` riêng ở V1 (luật của
   nó đang ĐÚNG cho `Criteria`, không có triệu chứng) — Out of scope, có vết.

## Không được làm hỏng (regression đinh)

- `## Acceptance criteria` có `### nhóm phụ` → thẻ Gate 1 và evidence-page
  vẫn hiện ĐỦ AC sau sub-heading (lỗi false-green cũ, comment đã ghi).
- `## Findings` có `### Notes`/`# Appendix` chứa bảng → 0 finding ma trên
  thẻ, và cờ "verdict clean nhưng bảng có finding" không bắn oan.

## Đóng gói

Bump acceptance-gate patch + `sync-plugin-packages.sh` + re-pin literal nếu
suite ghim. Vá luôn **đối chứng đột biến PH8** của vòng trước (hiện là phép
kiểm không-thể-đỏ: xoá chuỗi rồi tìm chuỗi) — đổi thành đối chứng thật
(regex phải TRƯỢT trên văn bản description tiền-1.18).

## Out of scope

- `eval-coverage-lint.sectionLines` gộp vào lib — V2, không triệu chứng.
- Đổi luật ranh giới cho section report (Evidence/Iterations/Analyst/Variance).
- Codex parity của claim-scan — vẫn chờ GO DP-1.
