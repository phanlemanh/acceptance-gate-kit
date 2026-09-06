# Design — co-qua-timebox-nhom-da-xong (T2)

> Vòng vá nhỏ, làn bounded. Nguồn: CI `tests` đỏ trên `main` ngày 06/09/2026 tại
> `RT13`: `baseline-127-tin-hieu-phan-biet: cờ qua-timebox thiếu`. Hồ sơ ấy đã
> park từ 30/08 với «Timebox: ship trước 2026-09-05»; qua ngày 06/09 phép đo quan
> hệ (iii) của RT13 đòi cờ, bộ quét không gắn cho nhóm «đã xong». Lỗi theo ngày:
> `main` sạch chạy cục bộ cũng đỏ y hệt (đo 06/09, worktree tạm).

## Bài toán một câu

Cờ `qua-timebox` được tính bằng MỘT vị từ của lib (`NG.quaTimebox`) và phải cắt ngang
mọi ô; bộ quét tính nó ở dòng 417 nhưng ba lối đẩy vào nhóm «đã xong» bỏ quên nó: hồ
sơ park/bác (dòng 432), hồ sơ `stage: archived` (dòng 416), và hồ sơ đã có phán quyết
giá trị (dòng 331, cờ được tính ở dòng 334, tức SAU khi đẩy). Thân lệnh start đã dạy
in cờ ở «Vừa xong» (RT12 [2]) — bộ quét đang không phát thứ thẻ được dạy in.

## Ba quyết định thiết kế

**D1 · Vá theo quan hệ, không vá một dòng.** Mọi lối đẩy vào `done` mà hồ sơ có
`opportunity.md` đều mang `flags` tính từ cùng vị từ: (a) nhánh opportunity-only: tính
`oFlags` TRƯỚC khi rẽ `archived`, truyền vào cả `da-dong-ho-so` lẫn `xep-lai`/`da-bac`;
(b) nhánh signed-off: dời khối tính `flags` (qua-timebox + mien-do-co-nguoi-dung) lên
trước lối `verdict` để mục `da-nghiem-thu-*` mang cờ; sau phán quyết bộ quét không «tiêu thụ» cơ hội
(`usesOpportunity` trả false khi uat có verdict) nên văn bản cơ hội được đọc RIÊNG cho cờ, lỗi đọc
không quyết ô (giữ doctrine đọc lười). Nhánh `verified` không đọc
opportunity nên không đổi (expQua = false ở đó là đúng theo phép đo).

**D2 · Đối chứng hai chiều không phụ thuộc ngày.** RT13 (iii) đo trên cây thật nên chỉ
đỏ khi có hồ sơ thật vượt hạn — hôm nay có, ngày mai có thể không. Thêm (iii-b): ma trận
fixture trong thư mục tạm, timebox ghi CỐ ĐỊNH quá khứ (2026-01-01) và tương lai
(hôm nay + 2 ngày, tính lúc chạy): park quá hạn · park chưa hạn (chiều should-NOT-fire)
· kill quá hạn · archived quá hạn · archived chưa hạn · signed-off có phán quyết release quá hạn
· release chưa hạn (đủ 6 ô của ma trận, cộng kill). Phép kiểm khoá Ô trước rồi mới soi cờ. Cùng fixture,
BA mutant của bộ quét (mỗi bản sao gỡ `flags` khỏi đúng một lối) phải làm phép kiểm đỏ nêu đúng slug
của lối ấy — chứng minh assertion bám vật ở từng lối (measure-birth §2, §3; gap-probe 06/09 P1).

**D3 · Không đổi ô, không đổi bản đồ.** Cờ không đổi `stateKey`, nên khối
`KHAC-BIET-DOC-CU` của hồ sơ ra-co-ten không cần dòng mới và `product-map --check` xanh
mà không sinh lại. RT13 (ii) so bản cũ tại mốc `cb38ea01` với bản mới vẫn đồng ô.

## Đụng đâu

- `scripts/start-scan.mjs` — ba chỗ ở §D1 (T2: không trong `t3_paths`).
- `tests/plugins/ra-co-ten.test.mjs` — khối RT13: (iii) đếm và nêu tên hồ sơ quá hạn trên cây thật;
  thêm (iii-b) bảy fixture + ba mutant. Câu tóm tắt PASS của RT13 được NỐI thêm đúng chuỗi sau (ô đo ghim
  nguyên văn từng mảnh): `iii: <n> hồ sơ quá hạn trên cây thật (<tên>) · iii-b: 7 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · mutant ×3 bắt: pk-qua · ar-qua · rl-qua`.
- `_acceptance/config.yaml` — hai khoá: `executors.script.cqt_rt13` (`RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs`),
  `cqt_o_khong_doi` (RT13 + `product-map --check` + `git status --porcelain PRODUCT-MAP.md` rỗng). Không có
  CHANGELOG.md trong kho nên không có mục changelog.

## Không làm

- Không đổi vị từ `quaTimebox` hay khuôn dòng Timebox.
- Không thêm cờ mới, không đổi thân lệnh start (đã dạy in cờ ở mọi nhóm).
- Không đụng bản đồ sản phẩm (không đọc cờ).
- Không sửa hồ sơ `baseline-127` cho «hết đỏ» — đó là giấu lỗi, không phải vá.

## Rủi ro

- `tests/plugins/ra-co-ten.test.mjs` nằm trong `paths` của E13 hồ sơ ra-co-ten-lam-va-trao:
  hồ sơ ấy chạy lại ô đo ở lần re-pin sau merge (đúng luật carry-forward).
- Mục `da-nghiem-thu-*` nay có thể mang thêm `mien-do-co-nguoi-dung` nếu điều kiện đúng —
  đúng ý «cờ cắt ngang mọi ô», nêu ở Notes.
