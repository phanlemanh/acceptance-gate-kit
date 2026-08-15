# Siết răng T1-escape: chỉ `_acceptance/<slug>/` THẬT mới bảo lãnh cho PR — ĐÃ TỪ CHỐI

**Trạng thái:** owner từ chối 2026-08-15. PR #54 đóng, KHÔNG merge.
**Đã tốn:** 13 commit, hợp đồng + 18 eval + gap-probe + bộ răng riêng, 4 vòng S4,
chữ ký Cổng 2 đã ký 2026-08-12, cộng một lượt merge 2.0.0 giải 6 xung đột.
**Đường đảo:** nhánh `fix/t1-escape-slug-only` (tip `d2c3ed2`) còn trên origin —
CỐ Ý không xoá. Chữ ký Cổng 2 ở `f3093c1`, pin `a938623`.

## Đề xuất là gì

Răng T1-escape coi *mọi* path dưới `_acceptance/` là "PR có mang bằng chứng",
kể cả file nằm ngay tại đó (`config.yaml`, `README.md`). Bản vá siết lại đúng
điều thông điệp violation đã hứa (*"carries NO `_acceptance/<slug>/` artifacts"*):
phải có **thư mục slug thật** có `contract.md` trên đĩa; và `_acceptance/config.yaml`
tự nó tính là file cần cổng — sửa luật của cổng phải qua cổng, cùng lý lẽ `t3_paths`.

## Lỗ này CÓ THẬT và đã đo sống — ghi lại để không ai phải đo lại

floorplanstudio PR #6 (2026-08-12), hai chiều trên cùng bộ mã:

- PR đổi 30+ file mã non-T1 → **bị chặn đúng**.
- Commit kế tiếp sửa `_acceptance/config.yaml` để trỏ executor sang CLI mới →
  **cùng bộ mã đó pass**, cả local lẫn CI.

Tức một dòng cấu hình cổng tắt được răng cho phần còn lại của PR. Lỗ **vẫn mở**
trên `main` và cả 4 repo tiêu thụ tính đến ngày từ chối.

## Vì sao bác — quyết định CHI PHÍ của owner, không phải lỗi kỹ thuật

Owner nêu nghi vấn: đây là nhánh **không hội tụ**, kéo tiếp sẽ bỏ dở. Rà soát
đối chiếu với ba vòng sa lầy có thật của kit (`premerge-unjudged-pass` ~6,7M
token / `s4-scope-triage` 4 round / `tai-lap-ceremony-diet` r5 REJECT) cho kết
quả **ngược lại** — ghi nguyên văn ở đây để lần sau khỏi tranh luận lại:

- Lõi kỹ thuật đã sống trên nền 2.0.0: `rang.sh` cho 12/12 ca phản chứng và
  **đột biến PASS** (dựng lại dòng `case` cũ thì lỗ tái xuất hiện, bản vá chặn).
- Nguyên nhân đỏ **không đổi da**: cả 5 chỗ đỏ cùng MỘT gốc một-lần — vật đo bị
  lưu kho ngày 12/08 (`8723546`). Sự kiện đã xảy ra xong, không tái phát.
- Việc còn lại là **danh sách đóng, toàn phép TRỪ**: rút AC-8/E10 · dọn 4 phép
  đo chết trong `rang.sh` · chạy 6 suite · re-pin 1 làn (§7.1 cho phép, vì là
  "vấp thật") · 1 chữ ký Cổng 2 (T3 nên không đi được làn xanh-sạch).

Owner vẫn chọn bỏ sau khi đọc các số trên. **Đây là quyết định về giá phải trả,
không phải kết luận rằng bản vá sai.** Ràng buộc nền: gate-fatigue là ràng buộc
số 1 của kit, và giờ-kit là chi phí.

## Giá của việc bỏ — khai thẳng

1. Lỗ vẫn mở ở **lõi cưỡng chế** (`scripts/pre-merge-check.sh` là `t3_paths`:
   *"bug ở đây biến thành false-green im lặng trên MỌI repo tiêu thụ"*).
2. 2.0.0 vừa cho máy đi trước nhiều hơn (làn V, xanh-sạch không mời ký). Máy càng
   được tin thì một cửa hậu tắt-cổng-không-qua-cổng càng đắt.
3. Làm lại sau sẽ **đắt hơn**: kit tự chặn PASS-chưa-ai-phán nên bản vá T3 không
   lẻn vào main không hồ sơ được — phải dựng lại trọn vòng, trong khi vòng cũ đã
   trả tiền và đã có chữ ký.

## Prior requests

- **2026-08-12** — đề xuất gốc, phát hiện từ sự cố thật ở floorplanstudio PR #6.
  Làm trọn vòng, ký Cổng 2 cùng ngày (`f3093c1`), nhưng không push.
- **2026-08-15** — merge 2.0.0 vào nhánh, mở **PR #54**, CI đỏ đúng 2 nhóm
  (staleness + `mirror_sync` của AC-8). Owner từ chối; PR đóng.

## Nếu đề xuất này quay lại

Nó sẽ quay lại đúng lúc đau: một repo tiêu thụ merge nhầm một PR mà cổng lẽ ra
phải chặn, rồi ai đó truy ra `case "$f" in _acceptance/*`. Trước khi làm lại
**từ đầu**, đọc nhánh cũ — gần như chắc chắn rẻ hơn:

```bash
git log --oneline main..fix/t1-escape-slug-only
git show d2c3ed2   # lượt merge 2.0.0 + cách giải 6 xung đột
```

Ba điều bản cũ đã trả tiền mà bản mới không cần trả lại:

1. **Đừng rebase nhánh đó.** `evidence-report.md` ghim `verified_commit a938623`
   — một commit nằm trên chính nhánh. Rebase đổi SHA ⇒ pin hoá phantom ⇒ luật
   phantom-pin của 2.0.0 bắn VIOLATION. Merge giữ SHA.
2. **AC-8 phải rút, không phải sửa.** Nó đòi `sync-plugin-packages.sh --check`
   xanh — mâu thuẫn trực tiếp với bất biến *"MỘT cây nguồn, KHÔNG có bản sao nào
   phải giữ đồng bộ"* (CLAUDE.md từ 12/08). Kéo theo trục Coverage "lan toả sang
   consumer" mất thước CE (P30 cũng đã chết), chỉ còn AC-9.
3. **`scripts/pre-merge-check.sh` tự merge SẠCH mà vẫn phải kiểm ngữ nghĩa tay** —
   đúng lớp bẫy kề-nhau-văn-bản. Mốc kiểm: vá nhánh ở `GIT_TOP` + khối slug-only;
   luật main ở `LEDGER_EXPECTED` có `veto-trace`.

Nếu quyết làm lại: đánh số **minor** (luật gate mới, GUIDE §10) — bản cũ tự đánh
`1.41.0` nhưng số đó đã bị đợt lưu kho Codex dùng mất, nên phải đọc lại số hiện
hành rồi cộng minor.
