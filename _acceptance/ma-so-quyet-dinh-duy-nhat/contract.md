---
schema_version: 1
feature: Mã sổ quyết định duy nhất — khuôn mã d-<UTC>-<n> ở bên ghi, khoá overlay theo dòng ở bên đọc để thẻ không lặp một câu dịch lên mọi dòng chung mã
slug: ma-so-quyet-dinh-duy-nhat
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/gate-card.js + SKILL feature-loop + 3 commands + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
status: machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-11T09:11:15Z
---

# Acceptance Contract: ma-so-quyet-dinh-duy-nhat

## Context

Sổ quyết định cấp mã `d-<giây UTC>-$RANDOM`; khi máy tính mã một lần rồi dùng lại cho cả lượt ghi,
nhiều dòng chung MỘT mã — sổ release-2-11-0 có 8 dòng đã duyệt chung `d-20260910T121327Z-6517`, và
các nhóm dòng treo ×4, ×3. Thẻ cổng tra overlay `decisions_plain` bằng mã trần nên một câu dịch hiện
trên MỌI dòng cùng mã, và người viết thẻ đành bỏ không dịch các dòng trùng. Người hưởng: người đọc
thẻ ở Cổng Phạm vi và Cổng Bằng chứng (mỗi dòng quyết định phải là câu của chính nó) — nguyên tố
«bằng chứng không tự dối». Hồ sơ dựng SAU khi code xong (entry d-20260911T090249Z-1): owner giao
việc bằng lời, CI t1-escape của PR #168 đòi hồ sơ.

Source input: prompt của owner 11/09/2026 (hội thoại) · PR https://github.com/phanlemanh/acceptance-gate-kit/pull/168

## Criteria

- AC-1: Given lệnh append trong khối marker `DEC-ID-RECIPE` của SKILL feature-loop, When chạy NGUYÊN VĂN lệnh đó ba lần liền (chỉ thay `<slug>`) với đồng hồ ghim cùng một giây, dưới bash và zsh, Then sổ có ba dòng JSON với mã đúng bằng `d-<UTC>-1`, `d-<UTC>-2`, `d-<UTC>-3`; bản sao lệnh cắt phần đếm dòng → ba mã trùng, thông điệp ghim «id trung: …».
- AC-2: Given sổ có một mã chung cho ba dòng (một dòng descope ở vị trí 2) và một mã duy nhất, When chạy `gate-card.js --extract`, Then mỗi entry của `decisions` (Cổng 1), `decisions_approved` và `decisions_provisional` (Cổng 2) mang trường `key` = mã nếu mã duy nhất, `<id>#<k>` theo thứ tự DÒNG SỔ nếu mã trùng — kể cả khi mã trùng vắt qua dấu niêm Cổng 1 (khoá đếm trên toàn sổ: khối đã duyệt `#1 #2`, khối Treo `#3`); trường `id` giữ nguyên.
- AC-3: Given overlay `decisions_plain` sinh từ các `key` của extract, When render thẻ Cổng 1 và khối Treo của Cổng 2, Then mỗi dòng sổ hiện đúng câu của chính nó và không dòng quyết định nào lặp lại.
- AC-4: Given overlay cũ dùng mã trần cho một mã trùng và cho một mã duy nhất, When render, Then các dòng mang mã trùng in chữ gốc của sổ (các dòng khác nhau), mã duy nhất vẫn được dịch, câu dịch của mã trùng không hiện, và stderr in thông điệp ghim nêu mã và dải khoá `<id>#1…#<n>`.
- AC-5: Given bản sao gate-card.js khôi phục lối tra cũ `x.id === e.id` trong khối `DEC-PLAIN-KEY`, When render cùng fixture overlay cũ (sau khi bản thật chạy xanh trên chính fixture đó), Then thẻ lặp một câu lên ba dòng và phép đo đỏ với thông điệp ghim `dong trung: "CAU TRAN" x3` ở cả Cổng 1 lẫn Treo.
- AC-6: Given `decisions_plain` sai dạng (phần tử null trong mảng; object thay mảng), When render, Then gate-card thoát 0 và in chữ gốc của sổ; bản sao gỡ guard → thoát khác 0 với TypeError.
- AC-7: Given cây ở commit đã kiểm, When chạy bốn suite (scripts · plugins · hooks · workflows), Then cả bốn thoát 0 — gồm P147 (reader chỉ đọc key trong khuôn CARD-PLAIN-KEYS), DV5 (pre-merge-check.sh chỉ thêm) và GPM12 (thông điệp khớp bản chụp).
- AC-8: Given `commands/approve.md` (dòng seal) và `commands/signoff.md` (dòng veto), When đọc, Then mỗi file trỏ tới khối `DEC-ID-RECIPE` và không còn dạng mã cũ nào (`d-<next>`, `d-<UTC>-<rand>`, `$RANDOM`); bản sao approve.md chèn lại `d-<next>` → đỏ với thông điệp ghim nêu file và dạng.
- AC-9: Given khuôn MỘT phần tử overlay trong khối marker `DEC-PLAIN-ITEM-TEMPLATE` của `commands/acceptance-card.md` (bên viết thật của thẻ), When điền khuôn bằng `key` của `--extract` rồi render Cổng 1, Then mọi dòng sổ hiện đúng câu của nó; bản sao khuôn đổi tên trường `id` thành `key` → đỏ với thông điệp ghim «khuon overlay khong dich duoc 4/4 dong».

## Coverage

- Bỏ coverage-scan — không gian AC là ba mặt đã biết của lỗi: bên ghi (AC-1, AC-8), bên đọc (AC-2..AC-5, AC-9), độ bền overlay (AC-6), cộng hồi quy (AC-7) (entry d-20260911T090249Z-5).

## Out of scope

- Không ép khuôn mã bằng một script ghi sổ — khuôn vẫn là lời dặn trong SKILL; lưới là bên đọc (entry d-20260911T090249Z-6).
- Không sửa `feature-loop/scripts/claim-scan.mjs` (lặng lẽ giữ dòng đầu trong các dòng khác nội dung chung mã) — việc riêng (entry d-20260911T090249Z-7).
- Không đổi câu gợi ý `d-<UTC>-<rand>` trong `scripts/pre-merge-check.sh` — luật additive-only (entry d-20260911T090249Z-8).
- Không sửa dòng nào của các sổ đã ghi (sổ append-only; release-2-11-0 giữ mã trùng, đọc qua đường đọc-cũ).
- Không nâng version plugin — gộp theo mốc phát hành.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl` (xem skill feature-loop — repo chưa dùng feature-loop thì bỏ qua).

## Notes

- Ca đo: `tests/scripts/gate-card-dec-key.test.mjs` (DK01–DK13; DK13 thêm ở S4 vòng 1 cho câu thật có dấu nháy đơn), suite scripts tự chạy qua glob `*.test.mjs`.
- Kiểm chỉ-đọc trên sổ thật release-2-11-0 lúc làm: 35 khoá phân biệt, các dòng Treo đều khác nhau.
