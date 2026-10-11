---
schema_version: 1
slug: evals-sat-le-doc-du
feature: «Kho viết evals.yaml kiểu danh sách sát lề vẫn được kit đọc đủ đầu vào và vùng tệp»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-10T10:47:38Z   # owner gõ «Làm» một chạm trong phiên 10/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: R1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 10/10 từ hàng R1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang R1 --mo-o --slug evals-sat-le-doc-du` (slug suy
> tất định từ câu giao là `kho-viet-evals-yaml-kieu-danh` — máy đặt slug ngắn hơn, đảo được).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/dieu-phoi-va-bien — commit `352ef33ac` (07/10) phải viết lại 309 dòng `evals.yaml` từ danh sách sát lề sang khuôn thụt 4 «để bộ đọc của kit thấy inputs và paths». YAML cũ hợp lệ.

**Người gặp:** phiên Claude Code ở kho tiêu thụ, và qua nó là owner ở Cổng Bằng chứng. Khi một
phiên sinh `evals.yaml` bằng thư viện YAML (kiểu xuất mặc định: `- id:` ở cột 0, khoá ở cột 2, mục
danh sách cũng ở cột 2, giá trị lặp thành neo `&id001`/`*id001`), lượt chấm nhận tệp tham số **thiếu
đầu vào của hội đồng, thiếu vùng tệp, thiếu danh sách bằng chứng — mà mã thoát vẫn 0, không một dòng
cảnh báo**. Hệ quả đọc được trên thẻ:

- tiêu chí phán xét không có đầu vào → hội đồng không chấm, mục rơi về **người quyết ở Cổng Bằng
  chứng** (thêm việc cho owner đúng chỗ kit hứa bớt);
- vùng tệp của bộ đo vắng → bộ tìm lỗi soi cả tệp đo như soi vật, và dòng «cụm ngoài vùng phủ» in
  «không đo được»;
- lượt sửa không giữ được ô xanh của lượt trước vì không biết ô nào chạm vùng nào → chạy lại hết.

**Đo lại 10/10 trên `main` `3200ba3a` (không tin lời hàng):**

| Phép đo | Kết quả |
|---|---|
| Bộ sinh tham số lượt chấm, kho thử do mã sinh, cùng hai tiêu chí viết bốn kiểu | thụt 4: đủ `paths`/`inputs`/`evidence_required` · **sát lề: cả ba trường biến mất, exit 0** · sát lề + mục thụt: biến mất · `- id:` thụt 2 + mục ngang khoá: ra **mảng rỗng** |
| Quét theo LỚP mọi bộ đọc `evals.yaml` (16 tệp) | hỏng cùng hình dạng: bộ sinh tham số lượt chấm (khoá cố định cột 4, mục cột ≥6) · bộ dựng nhãn ở `acceptance-gold` (tách khối theo đúng hai dấu cách trước `- id:` — chỉ hiển thị). Hỏng khác hình dạng cùng lớp «đọc thiếu im lặng»: bộ lập kế hoạch giữ-ô-xanh chỉ đọc vùng tệp dạng `[...]` một dòng, bỏ dạng khối **ở mọi thụt** (crm khai 393 khối / 49 một dòng) → mọi ô bị chạy lại. Đọc đúng cả hai thụt: bộ đọc vùng tệp ở `lib/evidence-core.cjs` và bộ đọc trường đơn ở `lib/eval-yaml.cjs` |
| Phép vi phân trước khi sửa: bộ đọc vùng tệp của lượt chấm so với bộ đọc vùng tệp ở `lib`, trên **620 hồ sơ thật / 7.364 tiêu chí** ở bảy kho (kit, crm, oneflow, artifact-platform, radar, media-library, map) | **0 lệch ở mọi hồ sơ thụt 4**; lệch đúng 6 tiêu chí, cùng một hồ sơ |
| Hồ sơ lệch đó | `crm/_acceptance/thuoc-mot-cho-khai-quet-man` — viết **hôm nay** (10/10, `ee4ae662c`), sát lề **và có neo** `paths: &id001` / `paths: *id001`. Lần dẫm thứ hai trong bốn ngày, cùng nguồn (bộ xuất YAML). Trên tệp này bộ đọc ở `lib` — bộ «đọc đúng» — trả vùng tệp `["&id001"]`: đọc SAI im lặng, không chỉ đọc thiếu |
| Khuôn lạ khác | 21 hồ sơ artifact-platform viết mỗi tiêu chí thành một dòng `- { id: E1, … }` — bộ sinh tham số dừng to «không có eval nào» (không im), cả 21 đã ký; ghi để biết, không vào phạm vi |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một bộ đọc danh sách duy nhất (tổng quát hoá bộ đọc vùng tệp đang có ở `lib`) đọc ra Y HỆT trên mọi hồ sơ thụt 4 đang chạy | kho đang xanh đổi phán quyết mà vật không đổi — đúng ca luật 26/09 cấm | phép vi phân trước/sau trên 620 hồ sơ thật | **Đã thử một nửa**: `paths` 0 lệch / 7.364; `inputs`, `evidence_required` đo trong vòng |
| 2 | Neo YAML chỉ xuất hiện do bộ xuất tự động, và cờ vàng có tên đủ để phiên tự viết lại — không cần bộ đọc giải neo | phiên vẫn phải viết lại tay mỗi lần; R1 chỉ đổi «im» thành «ồn» | đếm hồ sơ có neo trên bảy kho sau mốc | Chưa thử (hôm nay: 1 hồ sơ) |
| 3 | Dồn bộ đọc vào `lib` không làm vỡ bên vẽ thẻ / bộ kiểm trước gộp ở kho tiêu thụ | mọi kho trả giá | suite kit + chạy bộ đọc mới trên bản sao crm | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: cùng một bộ tiêu chí viết sát lề, thụt 2 và thụt 4 có cho lượt chấm cùng đầu vào, cùng vùng tệp, cùng danh sách bằng chứng không; và khuôn không đọc được có lên cờ vàng có tên không?
- Kết quả nào là SỐNG: ba cách viết ra tệp tham số giống nhau từng trường; phép vi phân trên 620 hồ sơ thật (kit + crm + năm kho) 0 lệch ở hồ sơ thụt 4; hồ sơ có neo hoặc khoá danh sách không đọc được in cờ vàng gọi tên tiêu chí + trường, không im; bản sao bộ đọc cũ ĐỎ trên kho thử sát lề do mã sinh, bản mới XANH.
- Kết quả nào là CHẾT: một hồ sơ thụt 4 đang chạy đổi kết quả đọc, hoặc còn một đường đọc sát lề rơi im lặng sau khi sửa.
- Timebox: 2026-10-18 (mốc kế, cùng DP1 + A1 — dự kiến từ nhịp đo được, sai số vài ngày); không cắt mốc trong vòng này.

## Kết quả prototype

Không dựng prototype — việc nền của bộ công cụ. Số đo nền là bảng «Đo lại 10/10» ở trên; kho thử và
phép vi phân do mã sinh trong phiên mở ô (sẽ vào bộ kiểm của vòng, không giữ ở đây).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hồ sơ crm làm chứng (sát lề cũ, sát lề + neo) | `crm` `352ef33ac^:_acceptance/dieu-phoi-va-bien/evals.yaml` · `crm` `ee4ae662c:_acceptance/thuoc-mot-cho-khai-quet-man/evals.yaml` | triết-lý/logic (hình dạng dữ liệu để đo) | có — chỉ làm hình mẫu cho kho thử do mã sinh, không chép tệp | — |
| Hạt giống hợp nhất ba bộ đọc vùng tệp | `docs/plans/2026-09-20-hat-giong-hop-nhat-bo-doc-paths.md` | triết-lý/logic | có một phần — xem «Out of scope» | — |

## Cổng 0

- **decision = build** (hạng T3) — owner gõ «Làm» 10/10 trên khuyến nghị bên dưới. Căn cứ: lỗi đo lại trên `main` (bảng «Đo lại 10/10»), lần dẫm thứ hai trong bốn ngày ở crm, phép vi phân 0 lệch ở hồ sơ thụt 4.
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ «Làm».

**Máy khuyến nghị lúc mời ký (owner chọn đúng lối này):** `build`, hạng **T3** thay vì T2 của
hàng. Lý do hạng: nghiệm đúng tầng là MỘT bộ đọc danh sách ở `lib/` cho bộ sinh tham số lượt chấm,
bộ lập kế hoạch giữ-ô-xanh và bộ đọc vùng tệp hiện có — `lib/**` nằm trong `t3_paths` của kit, nên
vòng có thêm lượt duyệt kế hoạch (trần T3 = 4 lượt gọi, vẫn là lượt trong thiết kế). Lối T2 rẻ hơn
một lượt gọi nhưng giữ hai bộ đọc viết tay ngoài `lib` và để nguyên lỗi đọc neo `["&id001"]` ở bộ đọc
trong `lib` — trái luật «một khuôn cho bên viết và bên đọc».

## Thước đo thành công → ứng viên criterion

- Kho thử do mã sinh, một mô hình tiêu chí → ba cách viết (sát lề, thụt 2 mục ngang khoá, thụt 4): tệp tham số lượt chấm giống nhau từng trường `inputs`/`paths`/`evidence_required`/trường bắt buộc; bản sao bộ sinh tham số cũ (rút từ commit gốc bằng `git archive`) ĐỎ trên sát lề, bản mới XANH; đối chứng dương thụt 4 xanh ở cả hai.
- Bộ lập kế hoạch giữ-ô-xanh đọc vùng tệp dạng khối như dạng một dòng: ô xanh không chạm vùng sửa được giữ, không «thiếu paths — luôn chạy lại».
- Phép vi phân cũ↔mới trên bộ hồ sơ thật (kit + crm + năm kho tiêu thụ đang có trên máy): 0 lệch ở mọi hồ sơ không sát lề, cho cả bốn trường danh sách.
- Cờ vàng có tên: hồ sơ có neo/bí danh YAML trên trường danh sách, hoặc khoá danh sách có mặt mà đọc ra rỗng → dòng cảnh báo gọi tên tiêu chí + trường, mang vào tệp tham số để thẻ in ra; chiều đỏ: gỡ nhánh cờ → ca đo đỏ ghim đúng thông điệp.
- Bộ dựng nhãn ở `acceptance-gold` tìm được câu hỏi/kỳ vọng của tiêu chí sát lề.

## Out of scope từ khám phá

- **Hợp nhất trọn hạt giống 20/09** (đưa danh sách vào bộ đọc trường đơn `parseEvals` + bốn hình dạng khối chữ nhiều dòng làm bộ đọc vùng tệp sai): lớp đó latent — 0 lệch trên 283 hồ sơ lúc gieo; vòng này chỉ dời bộ đọc danh sách về một chỗ, hạt giống giữ nguyên làm sổ.
- **Giải neo/bí danh YAML** (`*id001` → danh sách thật): bác cho vòng này — cờ vàng có tên đủ để phiên tự viết lại; mở lại khi hồ sơ có neo lặp ở ≥2 kho hoặc ≥3 hồ sơ sau mốc.
- **Khuôn một dòng `- { id: E1, … }`** (21 hồ sơ artifact-platform, đã ký): bộ sinh tham số đã dừng to, không im — không phải lớp R1.
- **Đổi khuôn sinh `evals.yaml` hay bắt kho viết lại**: trái thứ tự luật 26/09 (đổi mặc định là mọi kho trả giá); kho giữ cách viết của mình.
