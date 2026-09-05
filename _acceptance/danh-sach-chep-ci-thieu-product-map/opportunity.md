---
schema_version: 1
slug: danh-sach-chep-ci-thieu-product-map
feature: Danh sách chép CI của acceptance-init dặn repo tiêu thụ chạy product-map --check nhưng không chép product-map lẫn đồ nó kéo theo — CI của consumer đỏ ngay khi kit dùng khuôn ô cơ hội
owner:
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

**Ca thật:** kho `phanlemanh/crm-onehub`, job `acceptance gate` trong
`.github/workflows/acceptance.yml` đỏ **8 lượt liên tiếp** từ 2026-09-04 ở bước
`Product map`, exit 2:

```
product-map: khuôn opportunity-template không đọc được:
/home/runner/work/crm-onehub/crm-onehub/skills/acceptance/references/opportunity-template.md (ENOENT)
```

Vá tại kho tiêu thụ (2026-09-05): chép nguyên bản khuôn từ kit 2.8.0 về
`skills/acceptance/references/opportunity-template.md` —
https://github.com/phanlemanh/crm-onehub/pull/3. Trên runner, `Product map`
xanh sau vá.

**Truy nguyên trong kit** (số liệu ở HEAD `bddd8b9a`):

1. `commands/acceptance-init.md` khối marker `INIT-CI-COPY-LIST` (dòng 138–154)
   khai «ALL SEVEN files» chép sang CI của repo tiêu thụ: `pre-merge-check.sh`,
   `recheck-evidence.cjs` và 5 tệp `lib/` (evidence-core · gap-probe ·
   workspace-record · ac-line · md-section). **Không có `scripts/product-map.mjs`.**
2. Cùng tệp, dòng 39 bảo chủ repo chạy `executors.script.product_map` trong CI
   (đó là cổng canh duy nhất cho miễn trừ t1 của bản đồ — ADR 0007), và dòng 66
   cho lệnh là `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root . --check`.
   Trên runner CI không có plugin, `${CLAUDE_PLUGIN_ROOT}` rỗng. Repo tiêu thụ
   buộc phải chép tay `product-map.mjs` (crm-onehub làm ở commit `304a950`,
   2026-08-31) mà không có danh sách nào nói nó kéo theo gì.
3. `scripts/product-map.mjs` đọc theo đường dẫn tương đối từ `__dirname`:
   `lib/evidence-core.cjs` · `lib/workspace-record.cjs` · `lib/nguong-o-co-hoi.cjs`
   (→ `lib/md-section.cjs`) · `scripts/trang-thai-ho-so.cjs` ·
   `scripts/khong-can-nguoi.mjs` (import ESM; → evidence-core, md-section) · và
   `skills/acceptance/references/opportunity-template.md` (hằng `OPP_TPL_MAP`,
   dòng 38). Đường đọc khuôn vào product-map ở commit `47299d3c` (2026-08-24,
   S4-r2 `ra-co-ten-lam-va-trao`), TRƯỚC ngày crm-onehub chép (08-31): lỗ có sẵn
   lúc chép, không phải lệch do nâng bản sau. (Bản thân tệp khuôn có từ
   `c9a7c8f8`, 2026-07-30.)
4. Phép đo hiện có `tests/scripts/consumer-esm.test.mjs` CE2 ghim quan hệ «mọi
   tệp `pre-merge-check.sh` + `recheck-evidence.cjs` dùng ⊆ danh sách chép». Nó
   chỉ xét HAI điểm vào đó, và chỉ bắt tên `*.cjs` bằng regex. `product-map.mjs`
   không nằm trong quan hệ; một tệp `.md` không bao giờ khớp regex. Nên suite kit
   xanh trong khi consumer chết đúng lớp «vật chép sang consumer chưa từng được
   đo ở consumer» mà chính test này mở đầu bằng lời khai.
5. Cùng lớp đã ghi ở `docs/research/so-vap-trien-khai.md` dòng 30 (2026-08-08,
   floorplanstudio: acceptance-init chép thiếu `lib/gap-probe.js` → vòng
   `consumer-copy-cjs` 1.39.1) và `docs/findings/2026-08-12-tong-ket-lon-dot-tai-lap.md`
   mục R4 («bản chép cổng ở consumer hoá thạch»). Lần này khác một điểm: lỗi
   **không im** — product-map fail-closed đúng thiết kế, thông điệp nêu đường sửa
   — nhưng vẫn là danh sách chép không theo kịp thứ script thật sự cần.

**Ai gặp:** mọi repo tiêu thụ chạy `product_map --check` trong CI theo lời dặn
của acceptance-init — tức mọi repo init từ 1.31.0 có wire cổng canh bản đồ.

**Chi phí đã trả:** crm-onehub 8 lượt CI đỏ, một phiên truy nguyên, một PR vá tay
ở repo tiêu thụ (bản chép thứ hai phải giữ đồng bộ tay — đúng thứ kit tự cấm
mình từ 12/08).

## Ngả sửa (chưa quyết)

(a) **Mở rộng `INIT-CI-COPY-LIST`** cho `product-map.mjs` và toàn bộ đồ nó kéo
theo (hai `lib/` + hai `scripts/` + một `.md`), kèm mở rộng CE2 sang MỌI điểm
vào trong danh sách và bắt cả `.md`/`.mjs`. Ưu: đúng nếp hiện có, một chỗ khai
+ một răng round-trip. Nhược: danh sách tay phình từ 7 lên 13 mục và vẫn là
danh sách tay — lần script kế đọc thêm một tệp là lại lệch.

(b) **product-map tự đứng được:** nhúng hai chuỗi máy-đọc của khuôn vào lib
dùng chung, hoặc nhận `--template <path>`. Ưu: bớt một tệp phải chép, cắt đúng
mắt xích đã nổ. Nhược: khuôn hết là một-nguồn (marker `OPP-*-PREFIX` sinh ra để
writer/reader cùng rút — P115), và chỉ vá tệp `.md` chứ không vá lớp «script
kéo theo gì».

(c) **`acceptance-init --sync-ci`** sinh danh sách chép từ đồ thị phụ thuộc
thật (`require`/`import`/`readFileSync` theo `__dirname`) thay vì khai tay. Ưu:
biến bất biến từ đầu-người sang vật-máy-giữ — dạng nghiệm đúng tầng theo khung
30/08. Nhược: một lệnh mới + bộ phân giải phụ thuộc mới phải có răng riêng; tốn
hơn (a) rõ rệt cho một lớp lỗi mới nổ hai lần.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] một repo tiêu thụ dựng ĐÚNG theo danh sách chép của acceptance-init (không chép thêm gì) có chạy được `product-map --check` không?
- Kết quả nào là SỐNG: [đề xuất] consumer giả-lập dựng trong chính lần chạy test từ danh sách chép rút qua marker `INIT-CI-COPY-LIST`, chạy `node scripts/product-map.mjs --root . --check` exit 0; mutant bỏ một mục bất kỳ khỏi danh sách phải ĐỎ ghim đúng tên tệp thiếu.
- Kết quả nào là CHẾT: [đề xuất] consumer giả-lập vẫn phải chép tay tệp ngoài danh sách để cổng bản đồ xanh, hoặc lại có repo tiêu thụ đỏ CI ở bước `Product map` vì ENOENT.
- Timebox: …

## Out of scope từ khám phá

- Không sửa cách crm-onehub đã vá (PR #3 của kho đó giữ nguyên tới khi kit phát hành bản có đường sửa gốc).
- Không mở lại lớp «bản chép cổng hoá thạch» (R4) nói chung — chỉ mắt xích product-map; re-pin bản chép vẫn theo release (GUIDE §7.1).
