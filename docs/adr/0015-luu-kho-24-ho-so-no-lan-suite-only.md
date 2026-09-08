# ADR 0015 — Lưu kho 24 hồ sơ đã ký còn nợ làn suite-only (gỡ khỏi cây, giữ ở mốc git)

2026-09-08 · owner: «Lưu kho 24 hồ sơ còn nợ, rút tên, đẩy main». Sau ADR 0014
(luật làn eval, không mốc ngày, không phạm vi diff) và chiến dịch ghim lại 25 hồ
sơ bằng làn eval, 24 hồ sơ đã ký của kit vẫn đỏ ở mọi lượt pre-merge: **6** có
eval máy đỏ thật trên cây hiện tại (`cham-dung-cay-dung-cho-dung`,
`cong-chan-nham-cho`, `het-gio-khong-phai-truot`, `khong-ve-the-ma`,
`moi-noi-vong-trao`, `release-2-1-0` — răng của chúng mất tiền đề sau các mốc
sau đó) và **18** có `evals.yaml` trỏ `executors.script.mirror_sync` đã gỡ (ADR
0010) nên làn không chạy được. Cả hai nhóm chỉ hết nợ bằng cách viết vào vật đã
ký rồi ký lại — trái nguyên tắc «hồ sơ đã ký là sử liệu bất biến» — hoặc rời
corpus. **Quyết: rời corpus**, cùng cách ADR 0008: `git rm` 24 thư mục
`_acceptance/<slug>/`, giữ trọn tại mốc **`truoc-luu-kho-no-lan-2026-09-08`**
(commit `f0ac9dfc`) để lấy về bằng `git checkout <tag> -- _acceptance/<slug>`;
gỡ 40 khoá `executors.script` chỉ răng của 7 hồ sơ ấy dùng (không hồ sơ sống nào
trỏ tới); cắt 24 dòng baseline định tuyến/quét xưởng; rút 18 tên khỏi danh sách
`mirror_sync` (còn 3) và làm rỗng `SUITE_ONLY_LANE_DEBT` (giữ khung); bốn răng
từng đọc vật của hồ sơ lưu kho đổi sang hồ sơ sống cùng tính chất (P70 → `cong-
dang-co-cua`, P142 và W-G8 → `inputs-tinh-tu-goc-kho`, CS9 → `cong-dang-co-cua`),
riêng P146/P147 cần đúng artifact có bullet gói dòng nên artifact của `delta-
verify-repin` chép NGUYÊN VĂN vào `tests/plugins/fixtures/luu-kho-2026-09-08/`
(bản đông lạnh có tên, không viết tay); W-G7 thôi ghi dump vào thư mục hồ sơ.
**Lối bị loại:** sửa răng/`evals.yaml` đã ký rồi ký lại 24 lần (viết vào sử
liệu, 24 lượt gọi người); để gate của kit đỏ vĩnh viễn (đỏ mất nghĩa); nới
reader bằng danh sách miễn trừ (ADR 0014 đã bác). **Giá nhận:** 24 hồ sơ — kể
cả `delta-verify-repin` là hồ sơ gốc của chính nghi thức re-pin — không còn hiện
trên bản đồ sản phẩm và không còn được `recheck` soi; lịch sử của chúng chỉ còn
trong git và tài liệu `docs/` trỏ tới chúng nay trỏ vào mốc. Bài học ghi ở GUIDE
§7.1: một răng hồ sơ đo «cây trước tính năng» bằng `origin/main` di động sẽ
chết khi nhánh chính trôi qua tính năng ấy — răng vĩnh viễn phải neo mốc bất
biến, cùng lớp với `truoc-luu-kho-2026-08`.

**Bổ sung 2026-09-08 (owner: «Lưu kho 3 hồ sơ mirror_sync luôn, rút tên»).** Ba hồ
sơ còn lại của danh sách ADR 0010 (`consumer-copy-cjs` E10 · `mot-luot-go-cong-
nguoi` E6 · `rang-phep-do-viec-cua-anh` E6) — không nợ làn, chỉ đỏ vì một eval trỏ
khoá `mirror_sync` đã gỡ — rời corpus cùng khuôn, mốc
**`truoc-luu-kho-mirror-sync-2026-09-08`** (commit `5dd77b0b`). Không khoá config,
không răng, không hồ sơ sống nào trỏ vào chúng; chỉ 4 hàng bảng vàng của
`gold-output-measure` rời đi (sinh lại cùng lệnh + xuất xứ). Hệ quả: cả hai danh
sách trong `tests/scripts/mirror-sync-grandfather.mjs` RỖNG — trigger xoá tệp của
ADR 0010 đã tới, nhưng tệp giữ lại vì phần sống của nó là răng «corpus sạch tuyệt
đối» (`assertCorpus`): từ nay một hồ sơ đỏ ở recheck là lỗi mới, không có nợ nào
để trốn sau. `--recheck-all` trên kit: 0 vi phạm.
