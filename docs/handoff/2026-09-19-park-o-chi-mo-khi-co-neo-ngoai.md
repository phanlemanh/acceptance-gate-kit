# Bàn giao — vòng `o-chi-mo-khi-co-neo-ngoai` PARK ở lượt chấm 6 (19/09/2026)

**Nhánh:** `cong-dang/o-chi-mo-khi-co-neo-ngoai` · **HEAD khi park:** xem `git log -1`
**Trạng thái hồ sơ:** `implemented`, verdict cuối REJECT, **không merge**.
**Neo để mở lại:** chính hồ sơ này — `acceptance-gate-kit/_acceptance/o-chi-mo-khi-co-neo-ngoai`.

## Vì sao park (owner chốt trước lượt 6)

Bảng ba kết cục: đạt → ký · không đạt chỉ vì thước → ghi giới hạn rồi ký · **không đạt có lỗi
vật → park**. Lượt 6 rơi vào vế ba: 3 finding trong hợp đồng, cùng một lỗi ở **AC-1**, mức cao.

## Cái gì ĐÚNG và đã có răng chứng minh — giữ nguyên, đừng làm lại

| Vật | Bằng chứng |
|---|---|
| Luật neo: ô ở hàng chờ phải có dòng `Gốc:` | ma trận 9 ca đỏ chấm dưới luật thật, so BẰNG NHAU |
| Neo không được trỏ chính ô (3 cách viết) | 4 mũi tiêm, mỗi mũi chứng minh đổi được file, cả 4 ĐỎ |
| Luật rút từ `CLAUDE.md` (KIT-GOC-RULE / KIT-GOC-TU-TRO) | 4 mutant trên bản sao luật, lật kết luận |
| Lối (b) ghi hạt giống, không tạo ô | LB1–LB3, hai chiều đỏ |
| 14 ô hàng chờ đều trỏ một hồ sơ có thật | VC8 trên cây thật |
| Hình dạng kit rời khuôn giao đi (khái niệm ở lại) | khuôn ô, khuôn hợp đồng, `start.md` đã sạch |

Bốn bộ kiểm xanh tại HEAD; `product-map --check` khớp.

## Cái gì HỎNG — chỗ duy nhất phải làm lại

**AC-1, chân RANH GIỚI của VC8** (`tests/plugins/vao-co-o.test.mjs`, khối `roRi` / `manhLuat`).

Nó tuyên bắt «mọi chuỗi ≥8 ký tự của luật kit rò vào vật giao đi». Thực tế:
`split(/[\s|]+/)` chạy trên hai khối luật **không chứa khoảng trắng**, nên không tách được mảnh
nào — tập đo đúng bằng hai chuỗi regex nguyên vẹn. Đo tại chỗ (chạy lại được trong 10 giây):

```
tiêm «<kho>/_acceptance/<slug-khác>»            → KHÔNG bắt
tiêm «Kho chờ nhận: media-library»              → KHÔNG bắt
tiêm «dòng Gốc phải trỏ tới _acceptance kho khác» → KHÔNG bắt
```

Tức **chính câu rò rỉ mà vòng này vừa gỡ khỏi `commands/start.md` sẽ không bị bắt lại.**
Chiều đỏ hiện có tiêm nguyên khối regex — hằng-đúng, không phân biệt «bắt hình dạng» với
«so bằng một hằng».

Bản trước đó (danh sách đen ba chuỗi) **bắt được** ca ấy. Nghĩa là bản «sửa theo lớp» ở lượt 5
làm YẾU phép đo. Ai mở lại: đừng lặp lại nước đi đó mà không có ca chứng minh bản mới mạnh hơn
bản cũ trên CÙNG một mũi tiêm.

## Hướng cho phiên mở lại (chưa thử, không phải khuyến nghị chắc)

Vị từ nên đo **quan hệ**, không đo từ vựng: một vật giao đi rò rỉ khi nó chứa một chuỗi mà
**chính regex của luật kit khớp được** (thử `new RegExp(rule).test(dòng)` trên từng dòng của
vật), cộng một vế cho tên marker. Chiều đỏ phải tiêm **ba hình dạng khác nhau** — bản chép
nguyên văn · placeholder người viết · một câu văn xuôi — và cả ba phải đỏ.

## Sổ và số

- Sổ quyết định: `_acceptance/o-chi-mo-khi-co-neo-ngoai/decisions.jsonl` (28 dòng, đọc từ cuối).
- Known limits: `docs/research/known-limits-ledger.tsv`, 20 dòng mang slug này — 8 đã đóng
  (vật mất), 12 còn sống.
- Hai hạt giống có neo, chưa mở ô: `docs/plans/2026-09-19-hat-giong-bo-dem-vong-meta-neo-sai-mau-so.md`
  · `docs/plans/2026-09-19-hat-giong-iterate-thoat-rang-neo.md`.
- Chi phí vòng: **7 lượt chấm · ~14,4 M token · ~150 phút máy · 7 lượt gọi người** (trần T2 là 3).
- Còn chặn merge: 1 — fixture `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`
  (làn ghim lại chạy được, chưa chạy).

## Lớp lỗi của vòng này — đọc trước khi mở lại

Sáu lần cùng một lớp: máy viết assertion, phá thử bằng tay, rồi tuyên trong commit và hợp đồng
— trong khi vật không mang dấu vết phép thử. Hai lần bản «sửa» còn làm yếu thứ nó đi sửa.
Bài học đã vào trí nhớ phiên: chiều đỏ phải là **một ca trong bộ kiểm**, và mỗi mũi tiêm phải
`assert` rằng nó đổi được file trước khi tin kết quả.
