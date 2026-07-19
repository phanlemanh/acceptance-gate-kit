---
name: morphological-scan
description: "Dùng khi bài toán thuộc dạng 'liệt kê cho đủ' một không gian rời rạc nhiều chiều và cần chặn sót — scope tính năng quanh một entity, test matrix / QA coverage, content plan đa kênh, benchmark đối thủ, risk / pre-mortem, dựng hệ metric — hoặc khi user hỏi 'còn thiếu gì / đủ chưa / cover hết chưa', cần quét không gian lựa chọn, kiểm coverage, decompose scope; áp dụng kể cả khi user không gọi tên MECE, Zwicky box hay Morphological Analysis."
---

# Morphological Scan (Zwicky Box)

**Test kích hoạt (1 câu):** Bài toán là "liệt kê cho đủ một không gian rời rạc nhiều chiều" → dùng. Bài toán "chọn 1 đáp án đúng" hay "tối ưu một biến liên tục" → không dùng.

**Vị trí trong pipeline:** chạy ở phase Brainstorm/Discovery, TRƯỚC design doc. Output của scan là input cho design doc và là thước CE cho writing-plans phía sau.

**Ngữ cảnh sản phẩm (bắt buộc trước khi quét):** trục thuộc skill — giá trị thuộc sản phẩm. Mọi giá trị cụ thể (kênh, surface, role, thị trường, domain map…) lấy từ **Product Context** của repo: mục `## Product Context` trong CLAUDE.md, hoặc `docs/product-context.md`. Không tìm thấy → hỏi user 5 ý (sản phẩm gì; loại hình — marketplace mấy phía / SaaS / tool nội bộ; actor & phía; surface + kênh; thị trường & khung pháp lý) rồi mới quét; hỏi xong đề nghị lưu câu trả lời vào CLAUDE.md theo mẫu `references/product-context-template.md` để lần sau khỏi hỏi. Ví dụ gắn nhãn "vd" trong preset chỉ minh họa hình dạng — cấm dùng làm giá trị mặc định cho sản phẩm khác.

## Quy trình 4 bước — đúng thứ tự generate → check → cut, cấm nhảy cóc

### B1. Chọn trục — First Principles
1. Khớp tình huống trong bảng routing dưới → đọc file preset tương ứng trong `references/`. Preset là điểm xuất phát, không phải chân lý — vẫn phải chạy test trục.
2. Test mỗi trục: *"Nêu được trong 1 câu vì sao đây là một chiều độc lập của bài toán?"* Không nêu được → nó là giá trị của trục khác, không phải trục.
3. Độc lập = đổi giá trị trục này không ép đổi giá trị trục kia.
4. Giới hạn 2–4 trục. Trục thứ 5 trở đi: gộp vào trục có sẵn hoặc chuyển thành lớp cross-cutting.
5. Cảnh giác trục đặt theo cấu trúc team / màn hình thay vì bản chất bài toán — nguồn sót cross-cutting phổ biến nhất.

### B2. Quét giá trị dọc từng trục — MECE per axis
1. Quét hết một trục rồi mới sang trục kế. Cấm nhảy trục giữa chừng.
2. Test ME: hai giá trị bất kỳ có chồng lấn không?
3. Test CE: phải nêu được *thước đo* — spec, user journey, dữ liệu thật, domain checklist. Không có thước đo → ghi `[CE chưa kiểm chứng]` ngay cạnh trục, cấm tuyên bố "đủ".
4. Một trục > 7 giá trị → nghi trục đó là 2 trục bị gộp, tách ra.

### B3. Dựng không gian — tích Descartes
1. ≤ ~30 ô: liệt kê hết. Lớn hơn: quét theo từng lát cắt của trục quan trọng nhất.
2. Mỗi ô trả lời một câu: "tổ hợp này có tồn tại / có cần không?" Ô vô nghĩa gạch luôn, ghi lý do 1 từ.

### B4. Cắt — Pareto / YAGNI
1. Gắn nhãn 3 mức: **Core** (làm ngay) / **Later** (park, 1 dòng) / **Never** (1 dòng lý do — để khỏi bàn lại).
2. Core ≤ ~20% số ô có nghĩa. Vượt → chưa cắt thật, cắt lại.
3. Cấm cắt trước khi quét xong B2.

## Preset routing

| Tình huống | Đọc file |
|---|---|
| Feature quanh 1 entity (contact, listing, deal…) | `references/entity-feature.md` |
| Test matrix / QA coverage | `references/test-matrix.md` |
| Content plan đa kênh, news-to-video | `references/content-matrix.md` |
| Benchmark / teardown đối thủ | `references/benchmark.md` |
| Risk / pre-mortem trước launch | `references/risk-premortem.md` |
| Dựng hệ metric | `references/metrics-tree.md` |
| Không khớp preset nào | Tự dựng trục từ B1 |

## Output chuẩn

```
## Ngữ cảnh
- Sản phẩm: <tên> — nguồn giá trị: <Product Context | user trả lời>

## Trục
- Trục A: v1 | v2 | v3   [thước CE: …]
- Trục B: …

## Core (≤20%)
1. <ô> — vì sao (1 dòng)

## Later
- <ô> (1 dòng)

## Never
- <ô> — lý do (1 dòng)

## Cross-cutting áp mọi ô Core
- …
```

## Red flags
- Ô nào cũng Core → chưa Pareto.
- Không nêu được thước CE mà vẫn tuyên bố "đủ" → CE giả.
- Dùng preset không chất vấn trục → chọn sai chiều thì quét kỹ mấy cũng sót.
- Bắt đầu cắt (B4) khi chưa quét xong (B2) → sót đúng thứ đáng ra phải thấy.
- Giá trị trục (kênh, surface, role…) không truy được về Product Context hay câu trả lời user → đang bịa theo ngữ cảnh của sản phẩm khác.
