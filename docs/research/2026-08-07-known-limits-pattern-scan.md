# Rà 108 giới hạn đã biết — quét đa lăng kính tìm pattern

**Ngày:** 2026-08-07 · **Corpus:** 108 mục `Đề xuất: known-limits` trong
`_acceptance/*/review-findings.md` của 27 hồ sơ (12 high · 43 medium · 32 low ·
21 mục regex cắt lệch mức nặng nhưng vẫn đọc được thân) · **Cách làm:** rút
trọn corpus một chỗ, đọc đủ 108, soi 5 lăng kính, kiểm chứng tay 8 mục nghi
đã-đóng.

## Lăng kính 1 — vòng đời: sổ chỉ ghi VÀO, chưa từng có ai gạch RA

Kiểm chứng 8 mục nghi ngờ: **6 đã được việc sau đóng hẳn** mà sổ không ghi gì.

| Mục | Đóng bởi | Bằng chứng kiểm hôm nay |
|---|---|---|
| #88 configList nuốt key-comment | workspace-reader-unification T1 | chạy thật trả `['PRODUCT-MAP.md']`, P130 ghim |
| #17 carry-plan không ship Codex | codex-script-packaging | file có mặt trong gói |
| #66/#69/#71/#72 P165/mẫu-số-tautology | measure-teeth-cleanup gỡ nhóm B | case đã xoá, `assert-ratchet.tsv` không còn |
| #43/#50 JR11a khoá lib/hooks vĩnh viễn | đã gỡ | 0 hit trong suite |
| #95/#96/#97/#98 start-scan nuốt I/O, verdict lạ, --root | start-scan-hardening + wru | `readRecord` tách ENOENT, guard bảng-lệch, bail 5 lối |
| #89/#92 SKILL trỏ reportPath đã bỏ | SKILL tự định nghĩa lại inline | dòng 192 ghi rõ `reportPath = evidence-report.md` |

Ngoại suy dè dặt: **25–35% của 108 mục là nợ đã chết** nhưng vẫn đứng tên
trong sổ. Sổ tăng 66 → 108 trong ba ngày không phải vì nợ phát sinh nhanh
bằng đó — vì **không có chiều ghi giảm**. Hệ quả kép: (a) mọi lần triage sau
đều đọc thừa một phần ba; (b) con số tổng mất khả năng nói lên điều gì.

Còn sống chắc chắn (kiểm tay): GUIDE.md vẫn tả agent `scribe` đã xoá ở 7 chỗ
(#93); changelog feature-loop dừng ở v1.24 qua hai bản phát hành (#100); hai
câu mặt-người sai vừa ký hôm nay (#106 thứ tự cổng chờ, #107 nhãn "đã xoá"
với kho vừa bật bản đồ).

## Lăng kính 2 — lớp lỗi: quá nửa sổ là nợ-của-THƯỚC, không phải nợ sản phẩm

Gom theo sổ lớp lỗi có tên của kho:

| Lớp | ~Số mục | Ví dụ điển hình |
|---|---|---|
| Phép-đo-không-thể-đỏ (hằng-đúng, vacuous, tự-vô-hiệu) | ~19 | #5 PH8, #46/#59 mutant tự tắt khi chuỗi lặp, #62/#63 MM12m không mutate gì, #71 mẫu số hai vế cùng nguồn |
| Fail-open / fail-silent | ~13 | #9/#13 claim rơi im lặng, #22/#24 bảng luật gõ sai → default không nổ, #53 sai --root ra sổ vàng rỗng tự tin |
| Doc/SKILL trôi khỏi vật (writer→reader drift) | ~13 | #20 thẻ hứa hiển thị material không có bên đọc, #85–#93 GUIDE/SKILL tả cơ chế đã bỏ |
| Snapshot ghim nguồn sống / hardcode mốc | ~9 | #29/#34/#39 SHA cứng, #35/#48 ghim corpus `_acceptance/` sống, #99 sửa SKILL là suite đỏ |
| Đóng gói / release-intent | ~8 | #11/#86/#100 changelog câm, #30/#33 file tạm lọt cây nguồn, #67/#70 TSV nội bộ ship cho consumer |
| Đo-chuỗi-thay-quan-hệ | ~5 | #55 token 3 bản không ai ghim bằng nhau, #38 property tuyên bố nhưng thân là blacklist 4 chuỗi |
| Fixture viết tay đúng khuôn bên đọc | ~4 | #36, #57, #65 |
| Mặt người nói sai sự thật | ~4 | #32, #52, #106, #107 |
| Codex parity / hứa thứ không ship | ~4 | #21 quảng cáo design-pass, (uat-session claim của wru) |

Cộng dồn 5 lớp đầu thuộc về THƯỚC: **~55–60 mục, quá nửa sổ**. Khớp đúng kết
luận mục 7.3 của hiến chương 80/20: chi phí của kit đã dồn về "viết một phép
đo cho đúng" — và sổ nợ này là bản đồ chi tiết của đúng chỗ đó.

## Lăng kính 3 — nguồn sinh: nhịp phát sinh ≈ nhịp trả, cân bằng chứ không hội tụ

Hồ sơ sinh nhiều nhất: judge-required-evidence (12) · gold-output-measure (9)
· ngon-ngu-mat-nguoi (9) · measure-teeth-cleanup (7) · stop-patching-law (6) ·
delta-verify-repin (6) · s4-scope-triage (5). Toàn bộ nhóm đầu bảng là các
vòng **pha Đo** — mỗi vòng viết phép đo mới sinh 5–9 nợ đo mới, kể cả chính
vòng dọn nợ (measure-teeth-cleanup vừa dọn 5 vừa sinh 7). Nhịp sinh xấp xỉ
nhịp dọn → tồn kho đứng yên là kịch bản TỐT nhất của cách làm hiện tại. Muốn
giảm tồn phải giảm PHÁT SINH tại nguồn (thủ tục lúc viết phép đo), không phải
tăng chuyến dọn.

## Lăng kính 4 — ai chịu: ~3/4 sổ là nhiễu nội bộ, ~15 mục chạm người thật

- **Chạm consumer/người duyệt (~15):** hai câu mặt-người sai (#106 #107), nhãn
  sổ vàng giải thích sai nguyên nhân (#32 #52), changelog câm (#11 #86 #100),
  gói ship thứ thừa/hứa thứ thiếu (#21 #67 #70), Codex đứt gãy giữa vòng (#74
  #79). Đây là nhóm DUY NHẤT lộ ra ngoài kit.
- **Chạm người bảo trì kit (~80):** suite đỏ oan, phép đo trang trí, dev
  friction — phiền nhưng không lừa ai ngoài xưởng.

Ưu tiên rà phải theo trục NÀY, không theo mức nặng máy gắn: một mục "medium"
nói dối consumer đắt hơn một mục "high" chỉ làm suite chậm.

## Lăng kính 5 — trùng lặp nội sổ: ~20% là cùng finding ghi hai lần

Các cặp EN/VI hoặc hai-vòng-cùng-lỗi: #10↔#12, #28↔#34, #40↔#42, #66↔#69↔#72,
#73↔#81, #74↔#79, #76↔#80, #89↔#92, #29↔#34, #30↔#33. Vòng soi chạy nhiều
round + hai ngôn ngữ, mỗi lần ghi lại từ đầu. Số mục **duy nhất** thật sự
khoảng **~85**, trừ tiếp nợ-đã-chết còn **~55–65 mục sống**.

## Tổng hợp — 5 pattern

1. **Sổ nợ không có vòng đời.** Không trường `closed_by`, không nghi thức gạch
   — nên số chỉ tăng và mất nghĩa. Đây là lỗ CẤU TRÚC, không phải lỗ nội dung.
2. **Quá nửa nợ là nợ-của-thước, dồn vào 3 lớp có tên** (không-thể-đỏ ·
   fail-open · snapshot-nguồn-sống). Corpus này chính là **ngân hàng RED-case
   viết sẵn** cho việc (a) khuôn-viết-phép-đo: mỗi mục sống là một ca "khuôn
   phải chặn được đúng cái này".
3. **Cân bằng động:** vòng dọn nợ cũng sinh nợ cùng nhịp — giảm tồn chỉ đến từ
   khuôn lúc viết, không từ thêm chuyến dọn. (Cùng hình dạng với bài học
   "chốt cưỡng chế cần chốt cho chính nó".)
4. **~15 mục chạm người thật là nhóm rẻ nhất và đáng dọn nhất** — phần lớn là
   sửa câu chữ (nhãn, changelog, GUIDE) chứ không phải sửa máy.
5. **Trùng lặp ~20%** vì review nhiều vòng ghi lại từ đầu — dedupe là việc của
   bên GHI (vòng soi), không phải bên đọc.

## Khuyến nghị (chưa thi hành — chờ người quyết)

Một vòng `known-limits-lifecycle` gồm ba việc xếp theo giá:

1. **Gạch nợ chết** (rẻ, một lượt): rà đủ 108, đánh dấu `closed_by: <slug>`
   cho mục đã đóng — sổ về ~55–65 mục sống, con số nói thật trở lại.
2. **Dọn nhóm chạm-người ~15 mục** (rẻ, phần lớn là chữ): hai nhãn hôm nay,
   GUIDE còn tả scribe, changelog feature-loop, gói ship thừa/thiếu.
3. **Việc (a) khuôn viết phép đo** dùng nhóm nợ-của-thước làm RED-case bank —
   (c) không thay (a), nó CẤP ĐẠN cho (a).
