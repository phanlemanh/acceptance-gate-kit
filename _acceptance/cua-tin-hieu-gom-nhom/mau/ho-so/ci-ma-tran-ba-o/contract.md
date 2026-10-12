---
schema_version: 1
feature: CI của kho chạy test thành ma trận ba ô song song trên ba máy, và ci.yml do OneHub tự giữ thay vì là tệp cấm sửa của hãng
slug: ci-ma-tran-ba-o
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: []
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-10-09
design_doc: _acceptance/ci-ma-tran-ba-o/design.md
---

# Acceptance Contract: ci-ma-tran-ba-o

## Criteria

- AC-1: Given `.github/workflows/ci.yml` sau vòng này, When đọc tệp, Then có đúng ba job: `check` (checkout, setup-bun,
  `bun install --frozen-lockfile`, `bun run check-types` với `NODE_OPTIONS=--max-old-space-size=6144`, `bun run lint`,
  `bun run lint:slop`), `test` dạng ma trận ba ô (`api` · `app-ui` · `con-lai`) mỗi ô chạy `bun run test -- <bộ lọc>` sau
  `bun run db:deploy` với dịch vụ Postgres và cùng bộ biến môi trường như job cũ, `fail-fast: false`, và `ci-ok`
  `needs: [check, test]`, `if: always()`; mỗi job có `timeout-minutes` ≤ 20.
- AC-2: Given mọi gói trong workspace có script `test`, When ghép tập gói mà turbo chọn cho ba bộ lọc, Then mỗi gói có
  test nằm ở đúng một ô, không gói nào thiếu, không gói nào hai ô; ô `con-lai` chỉ dùng bộ lọc loại trừ (`--filter=!…`)
  nên gói mới tự rơi vào nó.
- AC-3: Given một ô `test` hay job `check` đỏ, bị dừng (`cancelled`) hoặc bị bỏ qua (`skipped`), When job `ci-ok` chạy, Then `ci-ok` đỏ; chỉ khi cả
  hai đều `success` thì `ci-ok` xanh.
- AC-4: Given bản `ci.yml` của vòng này, When so với bản đã đo trên branch thử `thu/ci-tach-job` (#323, commit
  `341a9d6c1`), Then hai bản giống nhau về job, bước, bộ lọc và biến môi trường — số đo ở #323 (cả lượt 10,1′ và 11,2′,
  job dài nhất 9,8′ và 11,0′) là số đo của chính cấu hình được gộp.
- AC-6: Given hồ sơ, When cần đo ngưỡng 7 ngày, Then có `rang/do-7-ngay.mjs` định nghĩa sẵn lượt xanh (`ci-ok` =
  success), job dài nhất, dừng vì trần (job `cancelled` dài ≥ trần của chính nó − 1′, khác với dừng vì đẩy chồng) và ngưỡng
  mẫu (< 10 lượt xanh → «chưa đủ mẫu»), chạy được trên dữ liệu thật của một branch.
- AC-5: Given CLAUDE.md sau vòng này, When đọc mục «Kho này là bản riêng», Then không còn câu «không bao giờ vào `ci.yml`
  của hãng» và có nguyên văn đoạn ở Notes (`ci.yml` do OneHub giữ; kéo bản mới của hãng về thì giữ bản OneHub ở tệp
  này); CI riêng của công ty vẫn ở `acceptance.yml`.
