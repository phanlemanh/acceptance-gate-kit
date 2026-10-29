---
schema_version: 1
feature: Chân cong_cu của đường nền xét một từ đầu là đường tệp kịch bản theo việc tệp có tồn tại, không theo quyền chạy, và vẫn đỏ đúng tên khi chương trình hay tệp vắng
slug: cong-cu-xet-tep-ton-tai
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: verified     # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-29T03:10:05Z
design_doc: _acceptance/cong-cu-xet-tep-ton-tai/design.md
---

# Acceptance Contract: cong-cu-xet-tep-ton-tai

## Context

Chân `cong_cu` của đường nền (`feature-loop/scripts/duong-nen.mjs`) tra `command -v` trên từ đầu của mọi
khoá `executors.*`. Khuôn kit của `executors.design.ui_check` là một đường tệp `.js` không có quyền chạy, nên
kho nào ghim đường thật cho khoá ấy thì chân đỏ «THIẾU» ở mọi dãy dù tệp có trên đĩa (lần nhận 2.34.0 của một
kho tiêu thụ, 25/10; tái hiện trên kit `45e9f2cf` — hạt giống
`docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 4). Người hưởng: người ký
Cổng Phạm vi ở mọi kho ghim đường tệp cho một executor. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: hàng TC5 của `docs/plans/lo-trinh-kit.json` · ô `_acceptance/cong-cu-xet-tep-ton-tai/opportunity.md` (Cổng Đáng `build` 25/10).

## Criteria

- AC-1: Given kho fixture lành của NEN0 thêm, ngoài suite, các khoá executor có từ đầu là tệp có thật trên đĩa, không quyền chạy (`-rw-r--r--`) — `executors.design.ui_check` mang đường tuyệt đối tới `…/scripts/design-scan.js` (đúng vị trí sự cố), một đường tương đối gốc kho, ba tên trần đuôi `.js` `.mjs` `.cjs` nằm ở gốc kho, và một tên trần đuôi `.mjs` KHÔNG ở gốc kho nhưng có quyền chạy trên PATH — When đường nền chạy từ một thư mục KHÁC gốc kho, Then mã 0, chân `cong_cu` XANH, không bullet `nen cong-cu:` nào và không dòng bỏ-tra nào cho các khoá ấy — trong khi `command -v` trên chính tệp tuyệt đối ấy thoát khác 0 (ca chứng rằng luật cũ sẽ đỏ).
- AC-2: Given một lượt riêng mang các khoá có từ đầu là đường tệp KHÔNG trỏ tới một tệp thường — đường tuyệt đối vắng, đường tương đối vắng, đường trỏ một thư mục, tên trần đuôi `.mjs` không ở gốc kho cũng không trên PATH — When đường nền chạy, Then chân `cong_cu` ĐỎ, mã 1, và mỗi khoá đúng một bullet ghim nguyên văn `nen cong-cu: THIEU <từ đầu như khoá ghi> (khoa <khoá>)`.
- AC-3: Given từ đầu là TÊN chương trình trần (không `/`, không đuôi `.js`/`.mjs`/`.cjs`) thật sự vắng — kể cả khi phần sau có ống dẫn (`khong-co-lenh | head`, ca NEN-TD2) — When đường nền chạy, Then chân vẫn ĐỎ, ghim đúng tên chương trình, như trước vòng; và tập bullet `nen cong-cu:` của lượt AC-2 BẰNG ĐÚNG tập mong đợi viết trước.
- AC-4: Given khoá ở đúng khuôn kit `${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js` trong lượt AC-1, When đường nền chạy, Then không bullet cho khoá ấy và stderr có ĐÚNG MỘT dòng bỏ-tra nguyên văn `cong-cu: bo qua <khoá> — tu dau «${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js» dung cu phap shell, khong phai ten chuong trinh` — như trước vòng.
- AC-5: Given bản sao `duong-nen.mjs` bị tiêm đột biến ở khối marker `CONG-CU-DUONG-TEP` — (a) không coi gì là đường tệp, (b) coi mọi đường tệp là có, (c) chỉ nhận đuôi `.cjs` — When chạy lại lượt AC-1 hoặc AC-2 trên từng bản, Then bản sao CHƯA tiêm cho đúng kết quả AC-1 và AC-2 trước, và mỗi đột biến làm ca đỏ có tên: (a) khoá `ui_check` tuyệt đối có bullet `THIEU <đường ấy>`, (b) khoá tuyệt đối vắng mất bullet, (c) khoá tên trần `.js` ở gốc kho có bullet `THIEU <tên ấy>`.

## Coverage

- Trục A — hình dạng từ đầu: tên trần | tên trần đuôi `.js`/`.mjs`/`.cjs` | đường tương đối có `/` | đường tuyệt đối | mang cú pháp shell (`${…}`, `$(…)`, nhóm) [thước CE: luật hiện có `tenChuongTrinh` + đề xuất hạt giống mục 4].
- Trục B — trạng thái đích: tệp thường ở chỗ đường chỉ, không quyền chạy | chỉ có trên PATH (riêng tên trần) | vắng | thư mục [thước CE: `fs.statSync().isFile()` + `command -v`].
- Ô Core: A2 × gốc kho (ba đuôi), A2 × PATH, A3/A4 × có (AC-1) · A2/A3/A4 × vắng, A3 × thư mục (AC-2) · A1 × vắng (AC-3) · A5 khuôn kit (AC-4) · thước treo vào luật (AC-5).
- Ô đã có ca, giữ: A1 × có (NEN0) · A1 × vắng (NEN1, NEN-TD2) · A5 (NEN-TD1, NEN-TD3, NEN-TD6) · chỉ-gán (NEN-LC1…LC3).
- Bỏ quét bằng skill: dòng sổ `descope` d-20261029T022118Z-9 (phạm vi đã chốt từ ngoài).

## Out of scope

- Giải `${CLAUDE_PLUGIN_ROOT}` để xét tệp sau giải: câu giao giữ dòng bỏ-tra như cũ cho khoá dạng ấy.
- Mở rộng `~/` ở từ đầu: hôm nay `command -v` trên `~/x` cũng đỏ; hành vi không đổi.
- Xét quyền chạy của đường tệp: chân công cụ trả lời «có trên máy không»; lệnh suite không chạy được thì chân suite đỏ.
- Đổi khuôn dòng đỏ hay bộ đọc thẻ Cổng Phạm vi: dùng lại mã `cong-cu-thieu`.

## Notes

- Vật: `feature-loop/scripts/duong-nen.mjs` (khối marker mới `CONG-CU-DUONG-TEP`) · thước: `tests/scripts/duong-nen.test.mjs` ca NEN-TT1…NEN-TT5 · khoá eval `executors.script.cxt_ton_tai` thêm vào `_acceptance/config.yaml` (khai vùng ở Cổng Phạm vi).
