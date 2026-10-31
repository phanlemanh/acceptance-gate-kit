# Thiết kế: luật bằng chứng cũ chỉ kéo hồ sơ vào xét khi PR chạm tệp vật

Hồ sơ `chi-tep-vat-keo-xet-lai` · vòng vá cho bản 2.36.2 · issue #468 · Cổng Đáng: chủ kho «Mở cả bốn» (31/10).

## Vấn đề

`slug_in_diff` (pre-merge-check.sh) trả «trong diff» khi PR đổi BẤT KỲ tệp nào dưới `_acceptance/<slug>/`. Ba luật
dùng chung nó: gap-probe, bằng chứng cũ (`STALE-DIFF-SCOPE-GUARD`), soi lại (ADR 0010). Với luật bằng chứng cũ, cửa
vào này quá rộng: sửa `opportunity.md` (timebox, ngưỡng) hay `decisions.jsonl` (sổ quyết định) không làm bằng chứng
cũ thêm chút nào — `verified_commit` không ghim hai tệp ấy và `stale_files` đã loại `_acceptance/**` — nhưng lại mở
cửa xét toàn bộ mã đã trôi kể từ lần ghim. crm: hai việc dọn chữ → 111 hồ sơ ghim lại, ~13 giờ máy.

## Lối chọn

1. **Vị từ riêng, không sửa `slug_in_diff`** (đề nghị (a) của issue). Thêm `slug_vat_in_diff <slug> <evals.yaml>`:
   0 khi PR đổi ít nhất một tệp VẬT của hồ sơ. Luật gap-probe, soi lại và ba chỗ khác dùng `slug_in_diff` không đổi.
2. **Nhánh thêm, không sửa dòng cũ** — giữ lưới DV5 «chỉ thêm» và ca VC11 (mutant gỡ guard cũ):
   ```
   if [ "$DIFF_READY" -eq 1 ] && ! slug_in_diff "$slug"; then # STALE-DIFF-SCOPE-GUARD
     :   # sử liệu ngoài diff (không đổi)
   elif [ "$DIFF_READY" -eq 1 ] && slug_in_diff "$slug" && ! slug_vat_in_diff "$slug" "<evals>"; then # STALE-TEP-CHU-GUARD
     echo "NOTE [<slug>]: sửa tệp chữ, không xét bằng chứng cũ — PR chỉ đổi <tệp> của hồ sơ (…)"
   else
     … khối hoá cũ như cũ …
   ```
   `slug_in_diff` lặp lại trong `elif` để nhánh tự đứng: gỡ guard cũ (VC11) thì sử liệu ngoài diff vẫn rơi xuống khối
   hoá cũ như bản cũ.
3. **Liệt kê tệp CHỮ đích danh, mọi thứ khác là vật** — chiều fail-safe. Tệp chữ = đúng `opportunity.md` và
   `decisions.jsonl` ở gốc thư mục hồ sơ (hai tệp khuôn kit định nghĩa: khuôn ô cơ hội, sổ quyết định), nằm trong khối
   marker `TEP-CHU-HO-SO` của `lib/evidence-core.cjs` — một nguồn. Tệp lạ (`note.md`), tệp thư mục con (`rang/**`),
   `run-log.jsonl`, `evidence/**` … đều là vật. Lối «danh sách cho phép tệp vật» của issue bị loại: với danh sách
   vật đóng, tệp lạ sẽ KHÔNG kéo xét lại — ngược chính yêu cầu fail-safe của issue (§2).
4. **`paths` của eval thắng tên** — tệp chữ mà `paths` của một eval trong `evals.yaml` phủ (glob, đúng tên, hay thư
   mục) là vật: eval đó đo nó. Trường `paths` không đọc được ở bất kỳ eval nào (bí danh, khối chữ — cờ của
   `evalListsOf`) → mọi tệp là vật. Đo 31/10: crm có 20 eval khai `_acceptance/<slug>/**` — các hồ sơ ấy vẫn xét lại
   khi sửa chữ, đúng vì thước của chúng đọc cả hồ sơ.
5. **Lùi về luật cũ khi không phân được**: thiếu `node`, thiếu lib, đầu ra không đọc được → coi là vật (kéo xét lại
   như trước vòng). Không có đường im lặng nào bớt xét.
6. **Cắt phải thấy được** (ADR 0010): mỗi hồ sơ bỏ qua vì chỉ sửa chữ in đúng một dòng NOTE đích danh nêu tên tệp.

## Cân trên mọi kho (luật 26/09)

| Kho | Trước vòng | Sau vòng |
|---|---|---|
| PR chỉ sửa tệp chữ của hồ sơ cũ | xét lại toàn bộ mã trôi, thường VIOLATION | NOTE, không xét — như mọi hồ sơ ngoài diff |
| PR sửa tệp vật của hồ sơ | xét lại | xét lại (không đổi) |
| PR sửa tệp lạ trong hồ sơ | xét lại | xét lại (không đổi) |
| thước của hồ sơ đọc chính tệp chữ (`paths`) | xét lại | xét lại (không đổi) |
| gap-probe / soi lại | xét hồ sơ có tệp bất kỳ trong diff | không đổi |

Ai mất gì: một PR đổi mã mà hồ sơ X đo VÀ chỉ sửa tệp chữ của X thì X không còn bị bắt — giống hệt PR đổi mã đó mà
không chạm X (ADR 0010 đã chấp nhận). Khai ở ADR 0028.

## Thước

Tệp ca `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs`, kho thử code sinh (git), ca TV1…TV5 theo năm AC; chiều đỏ
chạy bản gốc thật `115100b6` (git archive trọn thư mục) và bản sao tiêm nhánh mới thành `elif false`.
