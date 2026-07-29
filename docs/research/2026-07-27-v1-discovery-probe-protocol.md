# V1 — Protocol probe discovery tay (Artifact Platform) & scorecard DP-1

*2026-07-27 · Thuộc [plan rollout](../plans/2026-07-27-discovery-gate0-rollout.md)
hạng mục V1. V1 chính là prototype của cơ chế discovery → theo đúng luật của
nó: ngưỡng sống/chết khai TRƯỚC khi chạy, dưới đây.*

## Ngưỡng DP-1 (khai trước — không sửa sau khi đã chạy)

**GO (mối nối thật) khi đủ CẢ 3:**
1. **≥70%** mục trong "Thước đo thành công" của `opportunity.md` xuất hiện
   thành criterion trong `contract.md` (cho phép đổi từ ngữ; đếm bằng bảng
   truy vết dưới).
2. "Out of scope từ khám phá" được chép sang Out of scope của contract —
   không mất bullet nào mà không có giải trình.
3. S1 hỏi lại **≤1** thông tin đã có sẵn trong `opportunity.md` (đếm trong
   journal; hỏi trùng = file không truyền được).

**NO-GO khi bất kỳ:** <50% thước đo vào contract · S1 bỏ qua opportunity.md
viết lại từ đầu · phải mở lại brainstorm nghiệp vụ trong session giao hàng.

**Vùng giữa (50–70%):** sửa template/quy ước theo journal rồi chạy V1 lần 2 —
đúng MỘT lần; lần 2 vẫn giữa → NO-GO.

## Luật context-sạch (điều kiện hợp lệ của phép đo)

- D1a/D1b/D2/D3 + Cổng 0: session tuỳ ý, bao nhiêu session cũng được.
- `/feature-loop <slug>` (S0/S1): **session MỚI**. Input discovery duy nhất
  là file trong `_acceptance/<slug>/`. CẤM chạy S1 trong cùng session
  discovery — kế thừa từ trí nhớ hội thoại là false-green của chính phép đo.
- **Prompt chuẩn session mới (NGUYÊN VĂN, không kể thêm về discovery):**
  `/feature-loop <slug> — workspace đã có opportunity.md từ giai đoạn khám
  phá; đọc nó (và các file _acceptance/<slug>/) làm input trước khi hỏi tôi.`
  Một câu neo là hợp lệ: DP-1 đo "contract kế thừa được từ FILE không",
  không đo "model tự đoán ra file không" (dạy S0 tự đọc là việc của F-A).

## Tiền đề trên Artifact Platform (kiểm trước khi bắt đầu)

- [ ] Repo đã có `_acceptance/config.yaml` (chưa → chạy `/acceptance-init`).
- [ ] (Khuyến nghị, phục vụ luôn R1/V2) đã chạy `/document-app` +
      `/derive-tests` để D1a có nền hệ thống.
- [ ] Skill cần cho D1/D2 dùng được: `product-management:brainstorm`,
      `strategy-red-team` (pm-execution). Thiếu → làm tay, ghi journal.

## Trình tự & vết phải lưu (tất cả trong repo Artifact Platform)

| Bước | Làm | Vết bắt buộc |
|---|---|---|
| D1a | `/brainstorm` làm rõ → 2-3 hướng + riskiest assumption | journal: phút · friction |
| D1b | Đúc slug, viết `opportunity.md` TAY theo template trong [spec §5](../specs/2026-07-27-discovery-gate0-design.md) — đủ frontmatter (`base_commit` ghi lúc vào D3, ngưỡng chết, disposition để trống) | `_acceptance/<slug>/opportunity.md` |
| D2 | `strategy-red-team` lên opportunity; cập nhật bảng giả định | bản red-team lưu `_acceptance/<slug>/evidence/discovery/red-team.md` |
| D3 | Ghi `prototype.base_commit` TRƯỚC commit đầu; dựng trong timebox; điền "Kết quả prototype" | branch prototype + journal |
| Cổng 0 | Quyết tay: `decision` + `disposition` (+ bảng nợ nếu keep) + `decided_by/at` + phút gate0 | frontmatter opportunity + ledger entries |
| S0/S1 | **SESSION MỚI** → `/feature-loop <slug>` đến hết Gate 1 | contract/evals/gap-probe như thường |
| Đo | Điền bảng truy vết + scorecard | `v1-journal.md` |

## `v1-journal.md` (tạo trong `_acceptance/<slug>/`, ghi NGAY sau mỗi bước — cấm hồi tưởng cuối ngày)

```markdown
# V1 journal — <slug>

| Bước | Phút | Làm tay phần nào | Friction / thiếu gì | Ghi chú |
|---|---|---|---|---|
| D1a | | | | |
| D1b | | | | |
| D2  | | | | |
| D3  | | | | |
| Cổng 0 | | | | |
| S0/S1 (session mới) | | | | |

## Bảng truy vết opportunity → contract (điền sau Gate 1)
| Thước đo thành công (opportunity) | AC trong contract | Kế thừa? (nguyên/chỉnh/mất) |
|---|---|---|

## Câu S1 hỏi trùng thông tin đã có trong opportunity
1. ...

## Out of scope: bullet gốc → bullet contract (mất cái nào, vì sao)
```

## Kết quả về đâu

Scorecard + verdict GO / NO-GO / VÙNG-GIỮA điền vào section **DP-1** của
[plan rollout](../plans/2026-07-27-discovery-gate0-rollout.md), kèm chữ ký
Manh + ngày. Journal ở lại Artifact Platform (nó là vết của feature đó);
plan kit chỉ nhận scorecard tổng hợp.
