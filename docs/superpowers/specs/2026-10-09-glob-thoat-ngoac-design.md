# Thiết kế — glob-thoat-ngoac

Hồ sơ: `_acceptance/glob-thoat-ngoac/` · T3 · nguồn: yêu cầu P6-9 của đợt điều phối crm sau-14-10 (09/10).

## Vấn đề

Kit dịch `paths` của eval sang RegExp bằng hai bản chép cùng ngữ nghĩa: `pathGlobToRe` (`lib/evidence-core.cjs`,
lib phải tự đứng ở kho tiêu thụ) và `globToRe` (`feature-loop/scripts/carry-plan.mjs`, dùng chung cho
`s4-args`, `repin-lane`, `thuoc-vat`, `phan-loai`). Cả hai chỉ hiểu `*`, `**`, `?`; mọi ký tự còn lại — kể cả
`[` và `]` — là chữ thường.

crm viết thư mục động của Next.js theo hai cách:
- **trần** `apps/app/app/(app)/[slug]/…` — 102 tệp `evals.yaml`, đang khớp đúng vì ngoặc là chữ thường;
- **thoát ngoặc** `apps/app/app/(app)/[[]slug]/…` — thành ngữ của fast-glob/micromatch/bash cho một dấu `[` thật
  (lớp ký tự chỉ chứa `[`); 1 tệp (`dien-thoai-ca-nhan`), có cả mục không `*`.

Kit đọc dạng thoát theo nghĩa đen → không khớp tệp nào. Ba hệ quả:

| Nơi | Hàm | Hệ quả | Chiều |
|---|---|---|---|
| Làn ghim lại | `chamTuPin` ← `phanLoaiMucPaths` | mục «không chứng được» → mọi diff khác rỗng là «chạm» → `evals_not_machine_touched` oan | báo thừa |
| Lưới hoá cũ | `staleByPaths` ← `phanLoaiMucPaths` | từ chối mục → giữ luật cũ (mọi tệp) | thận trọng |
| Kế hoạch mang sang S4 | `carry-plan` `globToRe` | không bao giờ «diff-fix chạm» → eval được mang sang dù tệp đã đổi | **xanh giả** |

## Phương án

**Chọn:** cả hai bộ dịch nhận đúng HAI thành ngữ — `[[]` → chữ `[`, `[]]` → chữ `]` — trước khi thoát ký tự
đặc biệt. `phanLoaiMucPaths` coi mục mang thành ngữ là glob (đi nhánh glob kể cả khi không có `*`), để mục
`…/[[]slug]/contacts/x.tsx` được chứng bằng tệp thật.

**Loại:**
- *Lớp ký tự đầy đủ* (`[abc]`, `[!a]`) — đổi nghĩa `[slug]` trần thành «một ký tự s/l/u/g», làm hỏng 102 tệp
  crm. Phạm luật «đổi mặc định là mọi kho trả giá».
- *Bỏ thành ngữ trước khi phân loại* (tiền xử lý trong `phanLoaiMucPaths` rồi trả glob đã gỡ) — chỉ chữa làn ghim
  lại; `carry-plan` đọc `paths` bằng bộ đọc riêng và vẫn xanh giả. Sửa ở bộ dịch là đúng tầng: mọi nơi khớp glob
  cùng hưởng.
- *Chỉ cảnh báo ở S1* — giám sát nêu làm lối lui «nếu không sửa được an toàn»; sửa được an toàn nên không cần.

Hai bộ dịch vẫn là hai bản chép (lib phải tự đứng). Ca AC-1 so hai bản trên cùng bảng ô để chúng không trôi.

## Ngoài

`{a,b}`, lớp ký tự đầy đủ, bộ đọc `paths` dạng khối của `carry-plan` (hôm nay coi là «thiếu paths — luôn chạy
lại», tức thận trọng), mọi sửa ở crm.

## Đặc tả UX

Không chạm UI — bỏ (entry `descope` trong sổ).
