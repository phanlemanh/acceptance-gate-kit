---
schema_version: 1
slug: cong-chan-theo-ho-so-khong-theo-diff
feature: Chốt chặn trước-merge chấm MỌI hồ sơ đã arm cổng, kể cả hồ sơ PR không chạm — một vòng dở làm kẹt mọi PR khác của kho
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

`scripts/pre-merge-check.sh` có hai luật cho hồ sơ. Luật «bằng chứng chưa arm cổng» được
gắn với diff PR (`slug_in_diff`). Nhưng luật «hồ sơ ở implemented/verified/signed-off thì
verdict phải PASS» **không gắn với diff**: mọi hồ sơ đã arm trong kho đều bị chấm ở mọi PR.

Ca thật, kho `crm-onehub`, 2026-09-06: ba vòng dừng ở S4 từ 04/09 (`cua-vao-noi-tieng-viet`
BLOCKED · `thuoc-cua-lat-3a-co-rang` BLOCKED · `tieng-viet-cho-crm` REJECT, đều `implemented`).
PR #2 của một vòng ĐÃ KÝ Cổng Bằng chứng, không chạm một tệp nào của ba hồ sơ đó (đo: diff
ba-chấm không có `_acceptance/<ba slug>/`), vẫn bị chặn với đúng ba vi phạm đó. PR #3 sửa CI
cũng bị chặn cùng lý do và được merge với cổng đỏ — tức luật này dạy người merge đỏ.

**Không có đường xếp-lại cho hợp đồng.** Kit có «Xếp lại sau» ở tầng cơ hội (`decision: park`)
nhưng không có trạng thái tương đương cho hợp đồng đang dở giữa S4. Hạ về `draft`/`approved`
thì dính luật thứ nhất (có evidence-report mà chưa arm); phải **đổi tên** `evidence-report.md`
mới clean — đó là thủ thuật, không phải nghi thức. PR #7 của kho crm là bản thi hành thủ thuật đó.

**Người trả giá:** người mở PR cho việc đã ký, bị kẹt bởi việc dở của người khác; và chính
cổng — khi mọi PR đều đỏ vì cùng ba dòng, đỏ mất nghĩa.

## Hai câu để người quyết

1. Luật verdict-phải-PASS nên gắn với diff (chỉ chấm hồ sơ PR chạm) hay giữ toàn kho? Nếu giữ
   toàn kho thì phải có lý do nói được thành lời — vì nó biến một vòng dở thành trạm thu phí.
2. Cần một trạng thái hợp đồng «xếp lại» có tên (vd `parked`), được cả pre-merge lẫn bản đồ
   đọc, thay cho việc đổi tên tệp bằng chứng?

Phép đo hai chiều bắt buộc cho cả hai: một kho mẫu có hồ sơ dở BLOCKED ngoài diff → PR khác
clean (xanh) / hồ sơ dở NẰM TRONG diff → vẫn chặn (đỏ, thông điệp ghim).

---

## Mặt thứ hai — luật lệch-cây cũng không gắn với vùng hồ sơ phủ (đo 2026-09-07)

Cùng một gốc với mặt thứ nhất, khác chỗ đau. Luật lệch-cây (`evidence is stale —
code changed after verify`) so `verified_commit` với **mọi** tệp mã đổi, không
chỉ tệp nằm trong vùng hồ sơ đó phủ. Trên một nhánh dùng chung có nhiều vòng
chạy song song, hệ quả là mọi hồ sơ đã ký lệch cây mỗi lần bất kỳ vòng nào khác
đẩy lên — và mỗi lần lệch tốn một lượt chạy trọn bốn bộ kiểm để ghim lại.

**Số đo trên kho `crm-onehub`, 07/09/2026:**

| Thước | Số |
|---|---|
| Hồ sơ có sổ chạy | 21 |
| Hồ sơ đã từng phải ghim lại | **17** |
| Tổng lượt ghim lại | **31** |
| Theo ngày: 04/09 · 05/09 · 06/09 · 07/09 | 3 · 1 · 12 · **15** |

Con số tăng theo độ bận của nhánh, không theo số lỗi tìm được — đó là dấu hiệu
chi phí sinh từ luật chứ không từ rủi ro thật.

**Ca cụ thể, hồ sơ `tiep-thi-tuyen-doi-tac` (đã ký, 4 lượt ghim lại):**

| Khoảng giữa hai mốc ghim | Tệp mã đổi | Trong đó thuộc vùng hồ sơ phủ |
|---|---|---|
| `8b98a3d → d8240a5` | 13 | **0** |
| `d8240a5 → c7b02d5` | 92 | 8 |
| `c7b02d5 → 24c6d58` | 2 | **0** |

Vùng hồ sơ phủ đo bằng tám đường có tên trong hợp đồng của nó: `apps/api/src/campaigns`,
`apps/api/src/listings`, `apps/api/src/saved-views`, `tools/listing-crawl`, giao diện
chiến dịch, `apps/app/components/data-table`, `packages/validation/src/listing-ingest.ts`,
`packages/db/prisma`.

Hai trong ba khoảng có **0 tệp** thuộc vùng đó, nhưng vẫn buộc ghim lại. Khoảng
giữa có 8 tệp thật — và ca đó đã đi đường ĐÚNG: chấm lại trọn vòng 4 hai làn,
không phải ghim lại. Tức người vận hành phân biệt được hai ca; chỉ có luật là
không.

Hai tệp làm lệch ở khoảng thứ ba là `packages/db/turbo.json` và
`packages/ui/turbo.json` — cấu hình đệm của bộ kiểm. Đó là ca đáng chạy lại
thật, nên luật không sai *mọi* lúc; nó chỉ không phân biệt được.

## Câu thứ ba để người quyết

3. Luật lệch-cây nên so `verified_commit` với **mọi** tệp mã đổi, hay chỉ với tệp
   nằm trong vùng hồ sơ đó phủ? Nếu có vùng phủ, nó khai ở đâu — suy từ `paths`
   của evals (đã có sẵn ở nhiều hồ sơ), hay thêm một khoá `covers:` trong
   frontmatter hợp đồng?

Ràng buộc phải giữ nếu đổi: đường đổi **không được** biến lệch-cây thành im
lặng. Ca `turbo.json` ở trên cho thấy một tệp ngoài mọi vùng phủ vẫn có thể đổi
kết quả bộ kiểm. Đường an toàn có thể là: ngoài vùng phủ thì hạ xuống **cờ vàng
kèm tên tệp** thay vì chặn, để người đọc quyết — chứ không phải bỏ kiểm.

Phép đo hai chiều bắt buộc: một kho mẫu có hồ sơ đã ký, rồi (a) đổi một tệp
NGOÀI vùng phủ → không chặn, có cờ vàng nêu tên tệp; (b) đổi một tệp TRONG vùng
phủ → chặn như cũ với thông điệp ghim.
