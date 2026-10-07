# Lượt sửa giữ đủ, đếm đúng — thiết kế

Ngày: 2026-10-07 · hồ sơ: `_acceptance/luot-sua-giu-du-dem-dung/` · hạng T2 (không chạm `t3_paths`).

## Gốc

Ba lỗ quan sát ở crm ngày 07/10, hồ sơ `crm/_acceptance/don-okr-nhap-sai`, S4 lượt 2 chạy
`s4-args.mjs --carry-anchor 3b54471f --diff-base origin/onehub` trên feature-loop 2.24.0. Cả ba
tái hiện được trên dữ liệu thật của crm bằng bộ máy ở `main` `7b1afe1e`
(`gate-card.js --extract` cho `ui_observed {present:false, passed:0}` và `thuoc_vat` +1780/−12).

| # | Thấy gì | Gốc trong mã |
|---|---|---|
| 1 | Ba mục ngoài hợp đồng của lượt 1 biến mất khỏi `review-findings.md` lượt 2 (`carried.findings = []`); crm vá tay `0bd50fdd9`. | `carry-plan.mjs` chỉ mang sang mục ngoài hợp đồng khi tệp của nó KHÔNG nằm trong diff lượt sửa (`!deltaFiles.includes(l.file)`). Ba mục đều trên `apps/api/test/okr-xoa-muc-tieu.spec.ts` mà lượt sửa có chạm (sửa một mục TRONG hợp đồng cùng tệp). Giả định ngầm «tệp đổi thì lượt sau tự tìm lại» sai: tìm lỗi là LLM, không tất định; lượt 2 tìm ra một mục khác. Kết cục: mục rụng IM LẶNG ở chiều fail-open — đúng thứ người ở Cổng 2 phải quyết. |
| 2 | Khối E12 (ui-check, carry từ lượt 1) không còn `screenshot`/`observed`; thẻ Cổng 2 báo «Bằng chứng lớp nhìn-thấy: KHÔNG có». | Prompt synthesize CẤM ghi `screenshot:`/`observed:` cho khối carry; sổ chạy không giữ hai trường đó, nên không đâu trong lượt 2 có chúng. Thẻ đếm ui-check đạt = khối có `exit_code: 0` + `screenshot:`. |
| 3 | Sau khi gộp `origin/onehub` (17 commit của hồ sơ khác), `thuoc-vat.mjs --write` in vật +1780/−12, thước +1021/−1, nhát 2, `tep_thuoc` gồm `_acceptance/dieu-phoi-hai-tang/rang/*.mjs`. | `git diff --numstat <sàn>..HEAD` và `git log <sàn>..HEAD` đều thấy nội dung và commit đi vào qua merge từ nhánh nền. |

## Lối đã chọn

### 1 · Mục ngoài hợp đồng luôn được mang sang

- `carry-plan.mjs`: mọi dòng `kind: finding` của lượt trước có `inContract === false` và không
  `unclassified` đều vào `carriedFindings`, bất kể tệp có trong diff hay không. Mục mà tệp nằm
  trong diff mang thêm `tepDoi: true` — dấu cho người đọc rằng lượt sửa có chạm tệp đó, mục có
  thể đã khác.
- `acceptance-verify.js`: bản findings KHÔNG còn trông vào tác tử tổng hợp để in mục carry. Sau
  synthesize, một hàm thuần dựng từng mục carry theo khuôn `OOC-ITEM-TEMPLATE` (cùng hằng mà
  prompt in cho tác tử — một nguồn) với tiêu đề `<title> (r<N>)`, hoặc `<title> (r<N> · tệp đã
  đổi)`, rồi chèn vào mục `## Ngoài hợp đồng — người quyết ở Gate 2` (tạo mục nếu tác tử không
  viết). Mục tác tử đã in rồi (tiêu đề chứa nguyên văn title) thì không chèn lần hai.
- Vì sao không giữ luật «tệp đổi thì không mang»: giá của mang thừa là người đọc một dòng đã có
  nhãn «tệp đã đổi»; giá của rụng là một lỗi thật đi qua Cổng 2 không ai thấy. Máy KHÔNG sửa mục
  ngoài hợp đồng trong lượt sửa (SKILL S4 bước 3), nên tệp đổi không có nghĩa mục đã hết.

### 2 · Khối ui-check carry giữ khung của lượt gốc

- `s4-args.mjs`: với mỗi eval carry có executor `ui-check`, đọc `evidence-report.md` đang nằm
  trong hồ sơ (bản của lượt trước — lượt mới chưa ghi đè), tìm khối `- eval: <id>` có CÙNG
  `run_id` với dòng carry; khối có `screenshot:` trỏ tới tệp CÓ THẬT trong hồ sơ và `observed:`
  thực chất → gắn `screenshot`, `observed`, `networkObserved` vào mục `carriedEvals`. Lệch
  run_id, thiếu tệp ảnh, thiếu observed → không gắn, in một dòng stderr gọi tên eval + lý do.
- `acceptance-verify.js`: `carriedForReport` mang ba trường đó; prompt bảo chép nguyên văn; và
  một hàm thuần sau synthesize chèn ba dòng vào khối carry nếu tác tử bỏ sót (cùng nếp chốt máy
  `chotTruongNguoi` — vật máy giữ, không trông vào lời dặn).
- Chuỗi carry ba lượt tự nối: lượt 2 có khung trong khối carry, lượt 3 đọc lại đúng khối đó.
- Lối KHÔNG chọn: thẻ coi mọi khối `carried_from_round` ui-check là có bằng chứng. Thẻ sẽ nói «xem
  frame ở trang bằng chứng» trong khi trang không có đường tới frame nào — thẻ nói điều nó không
  chứng được.

### 3 · Thước-vật chỉ đếm việc của vòng

- Merge thuộc nhánh chính (first-parent) sau mốc sàn mà cha thứ hai KHÔNG có mốc sàn làm tổ
  tiên = nhập từ nền. Cha thứ hai CÓ mốc sàn làm tổ tiên (nhánh con của chính vòng, ví dụ worktree
  của `execute-parallel`) = việc của vòng, đếm như cũ.
- Commit của vòng = `git rev-list --no-merges <sàn>..HEAD ^<các cha nền>`. Nhát/lẫn đếm trên tập
  này.
- Dòng: tệp của vòng = hợp tên tệp các commit của vòng. Tệp chỉ vòng chạm → lấy `numstat` ròng
  `<sàn>..HEAD` như cũ. Tệp cả vòng lẫn nền cùng chạm → cộng `numstat` từng commit của vòng trên
  tệp đó (ròng không tách được hai nguồn khi không có `merge-tree --write-tree`, máy này git 2.37).
  Tệp chỉ nền chạm → không đếm.
- Không có merge từ nền → đường cũ, từng byte (kho không có sự cố này không trả giá gì).
- `--giua-hai-luot`: cùng bộ lọc trên khoảng giữa hai sha lượt.
- Lối KHÔNG chọn: neo `diff-base` từ config/`--diff-base`. thuoc-vat không nhận ref nền và luật
  «cha có mốc sàn làm tổ tiên» không cần ref — không thêm cờ.
- Ngoài phạm vi có chủ đích: `deltaFiles` của `s4-args` (carry staleness) VẪN gồm tệp nhập từ nền.
  Nền đổi một tệp mà eval đo thì eval phải chạy lại — đó là đúng, không phải lỗi.

## Phép thử mọi kho (luật 26/09)

| Kho | Được | Mất |
|---|---|---|
| Không có mục ngoài hợp đồng trên tệp bị sửa | không đổi | không |
| Có | mục không còn rụng; mục trên tệp đổi mang nhãn | thêm dòng trên thẻ cho mục có thể đã hết — người gạch ở Cổng 2 |
| Không ui-check carry | không đổi | không |
| Có, report cũ đủ khung | thẻ thấy bằng chứng nhìn-thấy | không |
| Không merge từ nền | đếm y hệt từng byte (AC-8 so bản base) | không |
| Có merge từ nền | số thôi phồng | tệp vòng và nền cùng chạm đếm cộng-từng-commit thay vì ròng |

Đường đọc-cũ: args đời cũ không có trường khung / `tepDoi` → workflow chạy y như cũ; sổ chạy
không có dòng `finding` → mảng rỗng như cũ.

## Đặc tả UX

Bỏ — vòng không chạm màn hình (entry `descope` trong sổ).
