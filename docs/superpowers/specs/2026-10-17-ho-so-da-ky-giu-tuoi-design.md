# Hồ sơ đã ký luôn tươi (K-A) — thiết kế

Ngày: 2026-10-17 · Hạng: T3 (chạm `lib/` và bên đọc của lưới trước-gộp) · Ô cơ hội đã ký Cổng Đáng 17/10 13:08Z:
`_acceptance/ho-so-da-ky-giu-tuoi/opportunity.md` · Hợp đồng: `_acceptance/ho-so-da-ky-giu-tuoi/contract.md`.

## Ý định và vì sao

Màu đỏ của một hồ sơ đã ký phải tới **đúng người — PR gây ra nó — trong ngày**, thay vì tới vòng kế tiếp tình cờ chạm
vào. Vòng chạm vào mà thấy đúng cái đỏ ấy đã có sẵn trên nền thì đi tiếp với một nhãn hiện trên thẻ, không gọi người,
không sửa vật của người khác.

Ngày 17/10 trên onehub cho thấy giá của việc thiếu điều này: hai PR không liên quan gộp sau khi một vòng đã ký → 8 hồ
sơ của vòng ấy hoá cũ → ≈4 giờ máy ghim lại (≈2,5 giờ là đỏ vì hạ tầng) → onehub giữ đứng yên ≈4,5 giờ, chặn cả ba
máy. Ca neo 15/10: `crm-onehub/_acceptance/okr-soat-anh-luot-3` đỏ sẵn E9/E13 khi vòng DH2 chạm vào.

## Mục tiêu · không-mục-tiêu · phản-mục-tiêu

**Mục tiêu.**
1. Một lệnh **giữ tươi**: cho một khoảng gộp `<từ>..<đến>` trên nhánh chính, chọn hồ sơ đã ký hoá cũ VÌ khoảng ấy,
   ghim lại trên đỉnh, ghi kết cục từng hồ sơ.
2. Ca đỏ được **quy về PR gây ra** bằng cặp sha trước/sau — hoặc nói rõ «không quy được» với lý do (đỏ sẵn trước
   khoảng · hạ tầng · nhiều PR cùng chạm).
3. Nhãn trạng thái **«đỏ sẵn trên nền»**: một vòng khác ghim lại hồ sơ ấy và gặp đúng cái đỏ đã ghi trên nền thì làn
   ghi được dấu ghim mang nhãn thay vì dừng; lưới trước-gộp, thẻ và bản đồ đọc nhãn.
4. Mặc định tắt: kho không bật khoá thì mọi bên đọc và làn ghim lại cư xử y như 2.32.

**Không-mục-tiêu** (vòng này không làm): lịch đêm của crm; dọn hồ sơ cũ tồn đọng; tự mở PR vệ sinh; chia đôi để tìm
PR; nhãn cho suite chung; hạn «đỏ sẵn quá N ngày»; K-B/K-C/K-D.

**Phản-mục-tiêu** (chạy được mà vẫn là thất bại): nhãn che một hồi quy MỚI (thêm ca đỏ, đổi thông điệp, đổi định
nghĩa eval); một ca đỏ vì hạ tầng bị đổ cho PR vô tội; kho không bật khoá thấy bất kỳ khác biệt nào; nhãn đọc thành
ĐẠT ở bất kỳ đâu.

## Ràng buộc từ vật đã có (đọc dò 17/10)

- Lưới trước-gộp tính «cũ» bằng bash (`scripts/pre-merge-check.sh`, khối 1419–1518: `git diff <verified_commit>` trừ
  `_acceptance/` và `t1_skip_globs`, rồi lọc theo `paths` khi `stale_scope: paths`). Không có hàm JS cùng nguồn. Với
  `--base`, hồ sơ không có tệp trong diff của PR thì không bị soi — nên lệnh mới KHÔNG chọn qua `--base`.
- Làn ghim lại (`feature-loop/scripts/repin-lane.mjs`): một làn cho N hồ sơ, đỏ bất kỳ lệnh nào thì không hồ sơ nào được
  ghim; dòng `repin-do` dùng `lan_id` (không `run_id`) và KHÔNG ghi thông điệp đỏ — chỉ `chap_chon.ca` có tên ca.
- Lưới trước-gộp không đọc dòng `repin-do`; mọi bên đọc lọc `kind === "repin"`.
- Bảng nhãn trạng thái dùng chung với CI: `lib/nhan-canh-gay.cjs` (`NHAN`). Từ chuẩn «Nhãn trạng thái» ở `CONTEXT.md`
  :442–456; tránh «baseline» (đã là `kind: baseline`) và tránh lẫn với «Dòng đỏ» của đường nền hạ tầng.

## Cách làm — phần máy đã chọn (mỗi dòng có một dòng sổ S1)

**1. Chọn theo khoảng = hai lượt của CHÍNH lưới trước-gộp.** Chạy `pre-merge-check.sh` (không `--base`) trên đỉnh
`<đến>` và trên một cây tạm tách ở `<từ>` — cùng bản lưới của đỉnh, khác gốc kho. Hồ sơ «cũ vì khoảng» = cũ ở đỉnh MÀ
tươi ở `<từ>` — hồ sơ chưa có (hay chưa ký) ở `<từ>` tính là tươi ở `<từ>`, nên hồ sơ được gộp trong khoảng rồi bị
gộp sau chạm vẫn vào tập. Cũ ở cả hai = **tồn đọng**: chỉ đếm và in tên, không ghim (dọn tồn đọng là việc của kho). Một nguồn
với bên đọc: không viết lại luật «cũ» bằng JS.

**2. Ghim từng hồ sơ trong một làn.** Thêm chế độ cho làn ghim lại: suite chung chạy MỘT lần; suite đỏ → không ai được
ghim (như hôm nay); suite xanh → hồ sơ nào mọi eval đạt thì được ghim, hồ sơ có eval đỏ thì nhận `repin-do`. Không làn
nào ghim một hồ sơ có eval đỏ.

**3. Thông điệp đỏ.** Làn ghi cho mỗi lệnh đỏ: `thong_diep_bam` = băm của từng cặp (tên ca đỏ · thông điệp lỗi đã
chuẩn hoá của ca ấy) khi rút được tên ca (`rutTenCa`), hoặc của 20 dòng cuối nhật ký đã chuẩn hoá (bỏ giờ, đường dẫn
tuyệt đối, id lượt) — cùng ca mà đổi lỗi («expected 3 got 4» thành TypeError) là băm khác + `trich` ≤ 3 dòng để người đọc.
Lệch băm → không nhãn (sai về phía đỏ).

**4. Quy về PR.** Với mỗi hồ sơ đỏ: chạy lại ĐÚNG các lệnh đỏ trên cây tạm ở `<từ>`.
- Lệnh thuộc lớp hạ tầng (mã 126/127, mã ≥ 128 hay bị ngắt, nhãn `chet` của `nhan-canh-gay`), hoặc xanh khi chạy lại
  trên đỉnh → **«không quy được — hạ tầng»**, không gọi tên PR; dòng sổ vẫn mang cặp sha của khoảng để người tự kiểm.
- Đỏ ở `<từ>` với cùng băm → **«đỏ sẵn trước khoảng»**.
- Xanh ở `<từ>` (hoặc đỏ khác băm) → do khoảng: ứng viên = các commit cha-đầu trong `<từ>..<đến>` có tệp đổi giao với
  `paths` của eval đỏ. Một ứng viên → tên PR (rút từ tiêu đề gộp `#<n>`) + cặp sha trước/sau. Nhiều → liệt cả, mỗi cái
  một cặp sha, kết cục «nhiều PR cùng chạm». Eval không khai `paths` → mọi commit có mã trong khoảng là ứng viên, kèm
  lý do «eval không khai paths».
Không chia đôi (mỗi bước chia là một lượt ghim — giá nhân log₂N).

**5. Dòng sổ nền đỏ.** Mỗi hồ sơ đỏ nhận MỘT dòng `kind: "nen-do"` trong `run-log.jsonl` của chính nó: `run_id` (của
lượt giữ tươi) · `sha` (đỉnh) · `tu` · `ket_cuc` (`do-khoang` | `do-san-truoc-khoang` | `ha-tang` | `nhieu-pr`) ·
`lenh_do[]` {`eval` hoặc `suite`, `cmd`, `exit`, `thong_diep_bam`, `trich`, `log`} · `quy_ve[]` {`pr`, `sha_truoc`,
`sha_sau`} · `evals_hash` của các eval đỏ. Đây là BÊN VIẾT của bằng chứng mà nhãn trích.

**6. Nhãn ở làn ghim lại của vòng khác.** Khoá `feature_loop.do_san_tren_nen: true` bật; làn ghim hồ sơ X gặp eval E
đỏ. Làn đọc `run-log.jsonl` của X **tại merge-base** của HEAD với nhánh chính (`git show`), tìm dòng `nen-do` gần nhất
có E. Nhãn chỉ gắn khi ĐỦ: cùng id E · cùng `thong_diep_bam` · `evals_hash` của E bằng nhau (định nghĩa không đổi) · sha
của dòng nền là tổ tiên của HEAD · suite xanh · mọi eval đỏ khác của X cũng được phủ như vậy. Đủ → dòng `repin` ghi
`evals_exit` thật (E ≠ 0) kèm `do_san: {E: {run_id, thong_diep_bam}}`, mục «Re-pin lần N» thêm hậu tố
` · đỏ sẵn trên nền: E←<run_id>`. Thiếu bất kỳ vế nào → làn đỏ như hôm nay. Hồ sơ của chính vòng tự bị loại vì nó
chưa có dòng nền trên merge-base.

**7. Bên đọc.** Một hàm dùng chung (đặt ở `lib/`) kiểm `do_san` của một dòng `repin`: dòng `nen-do` có `run_id` ấy tồn
tại trong run-log của hồ sơ, cùng E, cùng băm, sha tổ tiên của HEAD, và khoá đang bật. Lưới trước-gộp và
`recheck-evidence.cjs` gọi hàm ấy: đạt → in một dòng «NOTE [<slug>]: đỏ sẵn trên nền — E (nền <run_id>, PR <n>)» thay
cho VIOLATION mã eval ≠ 0; không đạt → VIOLATION như hôm nay. Thẻ và bản đồ sản phẩm hiện nhãn trạng thái mới
«đỏ sẵn trên nền» (thêm vào `NHAN` của `lib/nhan-canh-gay.cjs`), không bao giờ ĐẠT.

**8. Đầu ra lệnh.** Bảng tiếng sản phẩm: hồ sơ · kết cục (tươi lại · đỏ do PR #n · nhiều PR · đỏ sẵn trước khoảng ·
hạ tầng) · phút máy; cuối bảng: số tồn đọng không ghim, tổng giờ máy. `--json` cho máy khác đọc. `--write` mới ghi
sổ; không cờ thì chỉ in. Lệnh không commit, không mở PR.

## Khoá cấu hình

`feature_loop.do_san_tren_nen`: vắng hay `false` → tắt (mặc định); `true` → bật; giá trị khác → bên đọc báo lỗi gọi tên
khoá và «true | false» (khuôn `dinh-tuyen-may.cjs`). Lệnh giữ tươi tự nó chạy được khi khoá tắt (nó chỉ ghi sổ và ghim
như làn hôm nay); khoá chỉ quyết nhãn có được dùng ở làn và bên đọc hay không.

## Đường đọc-cũ

- Hồ sơ không có dòng `nen-do` và dòng `repin` không có `do_san` → mọi bên đọc như 2.32.
- Bản kit cũ (≤ 2.32) gặp dòng `repin` mang `do_san` + mã eval ≠ 0 → VIOLATION như mọi pin đỏ (đóng kín về phía đỏ),
  không vỡ; gặp dòng `nen-do` → bỏ qua (mọi bên đọc cũ lọc `kind === "repin"`).

## Phần để người thi công tự quyết

Tên tệp lệnh (khuyên `feature-loop/scripts/giu-tuoi.mjs`), tên cờ của chế độ ghim từng hồ sơ, vị trí hàm dùng chung
trong `lib/`, cách chuẩn hoá 20 dòng cuối — miễn đúng các vế ở trên và các ca của hợp đồng.

## Quét không gian tiêu chí (morphological-scan)

- Ngữ cảnh: kit nghiệm thu (engine cho nhiều kho) — chân sản phẩm: `CLAUDE.md`, `CONTEXT.md`, ô cơ hội · chân ngành:
  [NGÀNH: bors-ng / «Not Rocket Science Rule» — chỉ gộp khi đỉnh sau gộp xanh] · [NGÀNH: GitHub merge queue] ·
  [NGÀNH: git bisect — tìm commit gây lỗi bằng chia đôi].
- Trục A — trạng thái hồ sơ sau một khoảng gộp: tươi | cũ-ghim-xanh | cũ-đỏ-do-một-PR | cũ-đỏ-nhiều-PR |
  cũ-đỏ-sẵn-trước-khoảng | cũ-đỏ-hạ-tầng | tồn-đọng (cũ từ trước khoảng) | eval ngoài làn máy bị chạm.
  [thước CE: ba kết cục làn ghim lại hôm nay (xanh · `repin-do` · dừng sớm) × hai trạng thái ở `<từ>`; ca thật 17/10]
- Trục B — bên: lệnh giữ tươi (viết) | làn ghim lại của vòng khác (viết nhãn) | lưới trước-gộp + kiểm lại bằng chứng
  (đọc) | thẻ + bản đồ (đọc) | bản kit cũ (đọc-cũ). [thước CE: danh sách bên đọc `kind === "repin"` từ đọc dò]
- Trục C — khoá: vắng | false | true | giá trị sai. [thước CE: khuôn `docKhoa` của `dinh-tuyen-may.cjs`]
- Trục D — vế khớp nhãn: cùng eval · cùng băm · cùng định nghĩa · nền là tổ tiên · thêm eval đỏ mới · suite đỏ.
  [thước CE: điều kiện nhãn ở finding §5 PC mục 3 + chính sách ô cơ hội]
- **Core** → AC-1…AC-10 của hợp đồng. **Later:** chia đôi; nhãn cho suite; hạn «đỏ sẵn quá N ngày»; tự mở PR quy về;
  ghim cả tồn đọng theo cờ. **Never:** nhãn thành ĐẠT — phạm chính sách chủ kho 17/10 (không giấu đỏ).
- Cross-cutting: mọi phép đo mới có cặp hai chiều trên cùng kho thử do code sinh; «bản trước vòng» = `git archive` của
  merge-base với `main` lúc mở vòng.
