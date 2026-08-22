---
schema_version: 1
slug: lenh-in-ra-phai-bam-duoc
feature: Lệnh in ra phải bấm được — một nguồn tên lệnh (/<plugin>:<tên>) cho mọi điểm bàn giao, cộng bốn mục TRỪ nhiễu thẻ và finding B/C
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-22T14:55:20Z    # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Owner bấm lệnh trên thẻ/câu trả lời của kit mà lệnh không khớp tên harness đăng ký (dạng trần `/start` thay vì `/acceptance-gate:start`; `uat-session <slug>` không có dấu gạch) — mỗi lần là một lượt gõ lại tay. Đề bài đầy đủ: `docs/plans/2026-08-22-hat-giong-lenh-in-ra-phai-bam-duoc.md`.

## Giả định chốt sinh tử

> Re-rank sau red-team D2 (22/08, pass tách biệt — vết: hạng cũ → hạng mới). Phép thử rẻ (D2.5) trước.

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1a (cũ 1) | 7 chỗ `uat-session <slug>` không dấu gạch sai ở MỌI máy | — | Không cần thử: không phải lệnh ở máy nào | **Chắc** (D2.5) |
| 1b (cũ 1) | Lỗi dạng trần owner gặp là do kit in, không do harness/mặt phẳng | Sửa 48 điểm mà lỗi còn | Một câu một chạm cho owner «anh gõ gì, ở đâu»; chuỗi không đến ≤ 48 h → ký với 1a + 48 điểm, 1b là giới hạn đã khai | Chờ chuỗi — KHÔNG chặn cổng |
| 2 (cũ 5) | Mục TRỪ là TRỪ thật, không CỘNG cờ/lối/khoá mới | Thẻ sau chip nhiều chữ hơn | Gắn nhãn TRỪ/CỘNG cho 13 dòng — đã làm (dưới): 4 CỘNG tách sang hồ sơ riêng | **Đã thử, sửa** |
| 3 (cũ 2) | Dạng `/<plugin>:<tên>` dán vào prompt chạy được ở CLI và app desktop («bấm» = dán; thẻ HTML không có gì bấm) | Dạng có tiền tố vẫn chết ở một mặt phẳng | 6 lần gõ (3 lệnh × 2 mặt phẳng), 2 phút; mặt phẳng không cài plugin = ngoài phạm vi | Chưa thử — làm ở S1 |
| 4 (cũ 3) | Bảng tên giữ hai đầu khớp: **bảng ⊆ thư mục** (không «hai chiều» — `skills/` có skill không ai bấm) + **48 điểm ⊆ bảng**; tiền tố đọc từ `plugin.json`, không từ tên thư mục; `/goal` là ngoại lệ khai tường minh có RED ngoài danh sách | Thêm lệnh quên bảng mà suite xanh; bảng sai tiền tố mà vẫn xanh | Phá thử ở S3: thêm `commands/x.md` vào bản sao → đỏ; đổi `name` trong plugin.json bản sao → đỏ | Đo ở S3 |
| 5 (cũ 4) | ~~Đổi 170 literal thước cũ sang rút-từ-bảng~~ — **CẮT**: viết và đọc cùng một nguồn là lớp (3) CLAUDE.md, và là giờ-kit lớn nhất cho thứ không ai bấm | — | Giữ literal cũ; thêm đúng 1 ca round-trip + 1 ca quét 48 điểm | **Cắt khỏi phạm vi** |
| H1 (ẩn) | Sửa 48 điểm kit in là đủ để câu Claude TỰ SINH cũng đúng dạng | Chip chỉ sửa thẻ, không sửa lỗi owner gặp | Phiên sạch ở consumer hỏi «tiếp theo chạy gì» ×3, đếm dạng; nếu còn trần → thêm MỘT câu luật ở bản luật ngôn ngữ mặt người (CỘNG 1 câu — khai ở đây) | Thử ở S1 |
| H2 (ẩn) | Dạng có tiền tố không làm thẻ khó đọc hơn (~45 ký tự × 3–5 lệnh) | Thẻ «đọc trong một phút» thành rối | Render thẻ A với dạng dài, áp phép thử xoá-tên-máy | Thử ở S1 |

## Ngưỡng chết / ngưỡng UAT

> Sửa sau D2: phần TĨNH (48 điểm khớp · 0 chỗ thiếu gạch · cờ thẻ) đo ở S4 — không treo vào nghiệm thu;
> UAT chỉ đo thứ chỉ owner biết. Đối chứng baseline: trước chip D có ≥ 7 chỗ chắc sai (`uat-session`).

- Câu hỏi phép đo trả lời: Trong ván lái-thử kế ở `artifact-platform`, owner có phải gõ lại tay lệnh nào do dạng kit in không?
- Kết quả nào là SỐNG: 0 lần gõ lại tay vì dạng kit in (owner tự đếm — một con số owner biết); kèm S4 đã chứng 48/48 điểm khớp bảng và 0 chỗ `uat-session` thiếu gạch (baseline trước: 7).
- Kết quả nào là CHẾT: ≥ 1 lần owner gõ lại vì dạng kit in.
- Timebox: ván lái-thử kế ≤ 30/08/2026; hồ sơ T2 ≤ 1 ngày máy.

## Thước đo thành công → ứng viên criterion

- Bảng `COMMAND-NAMES` ⊆ thư mục `commands/` + `skills/` hai plugin (tiền tố từ `plugin.json`); `/goal` ngoại lệ khai tường minh có RED → AC round-trip một chiều + chiều đỏ.
- 48 điểm bàn giao khai tường minh ⊆ bảng, in đúng dạng; 0 chỗ `uat-session` thiếu gạch → AC quét danh sách, chiều đỏ nêu file:dòng (baseline 7 → 0).
- Cờ đỏ «n-a baseline» có lý do → không đỏ; cờ «ngưỡng/biên» dò bằng dấu → bỏ; cờ info `--glossary-base` → bỏ → AC trên fixture thẻ, số cờ ba thẻ A/B/C sau < trước.
- H1: một câu luật «khi nêu lệnh, dùng dạng có tiền tố» — CỘNG duy nhất, khai trước, đo bằng mutant gỡ câu.

## Phạm vi chip D sau lọc TRỪ/CỘNG (red-team giả định 2)

**GIỮ (TRỪ / sửa đúng):** mục 1 (48 điểm + uat-session + bảng) · mục 2 cờ đỏ baseline oan → không đỏ · mục 3 bỏ cờ
ngưỡng/biên dò dấu · bỏ cờ info glossary-base · C1 dòng bỏ lệch gạch nối · C3 bỏ «metric» khỏi `_Avoid_` ·
B3 `decided_at` stub duong-do (owner xác nhận) · B5 dời khối START-HIEU-KET.
**TÁCH — là CỘNG, hồ sơ riêng:** B1 (+lối bàn giao ý cân nhắc ở `/start` bước 4) · B2 (+khoá frontmatter tuổi ý)
· B4 (+placeholder/nhãn) · C4 (khuôn «(tuỳ chọn) kèm entry») · C2 (heading tiền tố — chốt có chủ ý, không sửa).

## Out of scope từ khám phá

- Không đổi tên, không thêm, không alias lệnh nào — chỉ in đúng tên đã có.
- Không đổi ~170 literal của thước cũ (giả định 5 — cắt).
- Không quét «mọi tài liệu»; `docs/**` là sử liệu. Mặt phẳng không cài plugin: ngoài phạm vi.
- Năm mục CỘNG (B1 B2 B4 C4 C2) — hồ sơ riêng. Hai hạt giống rà soát 22/08 — hồ sơ riêng.
- Không chạm `lib/**`, hook, lưới trước-merge (T2).

## Cổng 0

- **decision = build** (owner «build», 2026-08-22). Căn cứ: lỗi chạm tay owner mỗi lượt; 7 chỗ chắc sai ở mọi máy; phạm vi đã cắt sau red-team (T2, ≤ 1 ngày máy); đảo được.
- **disposition = (không có prototype)** Căn cứ: mọi ẩn số trả lời bằng phép thử rẻ (D2.5) hoặc đo ở S1/S3/S4 — không có code để giữ hay vứt.
- **Ngưỡng UAT chốt cùng lúc ký:** SỐNG = 0 lần owner gõ lại tay vì dạng kit in ở ván lái-thử kế (≤ 30/08), kèm S4 chứng 48/48 điểm khớp bảng và 0 chỗ `uat-session` thiếu gạch (baseline 7); CHẾT = ≥ 1 lần gõ lại vì dạng kit in.
