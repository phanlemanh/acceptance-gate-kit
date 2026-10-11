---
schema_version: 1
slug: ci-cua-kho-bo-job-nang
feature: «CI của kho bỏ job nặng cho PR không chạm mã sản phẩm bằng một lệnh của kit — không chép hàm nội bộ, không danh sách thứ hai»
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: C1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng C1 của lộ trình kit (hàng vào `main` qua PR #318; lúc mở ô, hàng mới ở nhánh PR
> đó). Vòng B của khảo sát 11/10 — đề 8 của hạt giống PR #301. Không phải vòng meta: kho chờ nhận là
> crm, sau hạn cứng 14/10 của crm.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/giam-phut-acceptance — 09/10 GitHub dừng mọi job của tài khoản vì crm vượt mức chi Actions

**Ai trả giá:** chủ kho (tiền Actions — crm ≈ 98 % số trả tháng 10, nhịp tháng 10 ≈ $170/tháng và
đang dốc theo số máy × số hàng song song) và người giữ CI của crm (một khớp nối mong manh).

**Bằng chứng** (`docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md` §1.1, §4, §5):

- 30 ngày tới 11/10, 14 701 phút-job của crm: **116/335 PR (35 %) không đổi dòng mã sản phẩm nào**,
  vẫn chạy đủ test/build — 72 PR chỉ T1 (2 541 phút, 17 %) · **44 PR chỉ hồ sơ `_acceptance/` + T1
  (1 837 phút, 12,5 %)**. Đây là PR của chính quy trình kit: lộ trình, sổ đợt, nâng kit, ghim lại,
  sửa thước.
- crm PR #369 (đang mở) tự bỏ job nặng cho PR nháp và PR chỉ T1 bằng `.github/scripts/phan-loai.mjs`:
  rút hai hàm `glob_variants`/`match_globs` khỏi bản chép `scripts/pre-merge-check.sh` bằng `sed`.
  Kit đổi tên hay tách hai hàm đó thì bộ phân loại thoát mã 3 → crm rơi về «nặng» (đúng chiều an
  toàn) — khoản tiết kiệm tắt mà không ai được báo. Kit đang có một người tiêu thụ hàm nội bộ mà không biết.
- Cùng thành ngữ `sed` sống TRONG kit (`scripts/product-map.mjs` khớp `LO-TRINH.html`: «kit giữ MỘT bộ
  khớp glob») — ở đó suite của kit canh; ở crm thì không gì canh.
- #369 chỉ lo phần T1. 12,5 % phút của PR chỉ-hồ-sơ còn nguyên: PR ấy KHÔNG là T1 (pre-merge đòi hồ
  sơ), nhưng cũng không cần test sản phẩm. Thiếu đúng một bit: **«PR có chạm vật sản phẩm không?»**

**Cân trên mọi kho** (luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho»):

| Kho | Được gì | Mất gì | Hành vi cũ ai dựa |
|---|---|---|---|
| crm (sống, 100 PR/6 ngày, private) | ≈ 12,5 % phút (PR chỉ hồ sơ) · bỏ khớp nối `sed` | một bước lấy kit trong job phân loại (kho đang chép kit thì không) | #369 dựa tên `glob_variants`/`match_globs` — vòng này KHÔNG đổi tên, không dời |
| OneFlow (đợt thử ~27/10, public) | thời gian chờ nhỏ (CI trung vị 1,3′); tiền $0 | không gì nếu không gọi | — |
| kit · MapPoster · OpenMAIC (public) | không đáng kể | không gì nếu không gọi | — |
| 8 kho ngủ | không | không gì nếu không gọi | 12 kho dựa `pre-merge-check.sh` — đầu ra của nó phải không đổi byte khi lệnh mới không được gọi |

Thứ tự nghiệm của luật: đúng tầng (crm đã tự làm — #369, nhưng mượn hàm nội bộ) → **bật thêm theo
lựa chọn** (ô này: lệnh mới, kho không gọi thì không đổi gì) → không đổi mặc định của kho nào.
Neo vào khuôn kit định nghĩa (`risk_tiers.t1_skip_globs`, `risk_tiers.t3_paths`, thư mục
`_acceptance/`), không vào từ vựng crm.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Lệnh phân loại bằng ĐÚNG bộ khớp và bộ đọc danh sách của `pre-merge-check.sh` (một nguồn), nên tầng nó in = tầng cổng xử | hai bộ khớp trôi khỏi nhau: CI bỏ test cho PR mà cổng coi là chạm vật | ca round-trip: cùng một diff, phân loại của lệnh = phân loại khối `[PR]` của pre-merge trên ma trận tệp viết trước (T1 · hồ sơ · T3 · ngoài T1 · `**/` ở gốc) | Chưa thử |
| 2 | PR chỉ đổi `_acceptance/**` (+ T1) không cần **test** sản phẩm | bỏ test cho thứ test có đọc | đọc CI crm: job `test` (`bun packages/db/scripts/test-run.ts`) không đọc hồ sơ; NHƯNG job `check` chạy `oxlint` ở gốc kho và `.oxlintrc.json` KHÔNG loại `_acceptance/` → `rang/*.mjs` của hồ sơ đang được lint | **Đúng một nửa (đọc 11/10)**: bit chỉ nói «chạm vật»; job nào bỏ là lựa chọn của kho — crm nên bỏ `test`, giữ `check` |
| 3 | Đọc `t1_skip_globs` ở **nhánh gốc** của PR (không ở HEAD) đóng lỗ «PR tự nới danh sách để tự bỏ test» mà không mất khoản tiết kiệm | PR thêm `src/**` vào danh sách cùng lúc sửa `src/` → được coi là chỉ T1 | ca đỏ: PR như thế phải ra «chạm vật»; lỗ này hôm nay cũng có ở pre-merge (đọc HEAD) — ngoài phạm vi ô, ghi Known limits | Chưa thử |
| 4 | Không phân loại được (thiếu base, git hỏng, config vắng, bash lỗi) → in «chạm vật» kèm lý do | lỗi lặng thành bỏ test | ca đỏ cho từng lối hỏng; thông điệp ghim | Chưa thử |
| 5 | crm nhận mốc chứa lệnh trước 01/11 và thay khối `sed` | ô xong mà không ai dùng — bỏ phí | Điều phối xác nhận crm có lượt nâng kit sau 14/10; #369 có thể nhận lệnh ở PR kế | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] sau khi crm thay khối `sed` bằng lệnh của kit, PR chỉ đổi hồ sơ còn tốn phút test sản phẩm không, và có PR chạm vật nào bị bỏ test không?
- Kết quả nào là SỐNG: [đề xuất] trên 30 ngày crm sau khi nhận lệnh: 0 PR chỉ-hồ-sơ chạy job `test` · 0 PR chạm vật bị bỏ job `test` (đếm từ dòng `cham_vat` trong tóm tắt bước so với danh sách tệp của PR) · `phan-loai.mjs` của crm không còn gọi `sed` vào `pre-merge-check.sh` · kho không gọi lệnh thì đầu ra `pre-merge-check.sh` không đổi byte
- Kết quả nào là CHẾT: [đề xuất] một PR chạm vật bị bỏ test vì lệnh phân loại sai (gỡ ngay, bất kể ngày) · hoặc tới 2026-11-01 crm vẫn chạy khối `sed`
- Timebox: [đề xuất] 2026-11-01 (mốc của hàng C1); ngưỡng đọc 30 ngày sau khi crm nhận, bằng `savings.mjs` + `pull-daily.mjs` ở `docs/findings/assets/2026-10-11-khao-sat-actions-va-phien/`
- Chính sách rủi ro: [đề xuất] nghi ngờ thì chạy đủ — lệnh chỉ được nói «không chạm vật» khi chứng minh được; mất tiền thì chịu, mất phép thử thì không

## Kết quả prototype

Không dựng. Vật là một lệnh dòng lệnh; phép thử rẻ (đọc CI crm, đọc #369) đã làm ở bảng giả định.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ phân loại PR của crm | crm PR #369 `.github/scripts/phan-loai.mjs` | triết-lý/logic (bỏ nặng khi mọi tệp T1, nháp, sự kiện không phải PR) | có phần logic tầng; KHÔNG kế thừa luật riêng «chạm `.github/` là nặng» và bit nháp — đó là chính sách CI của kho | — |
| Khuôn đầu ra `nang=`/`ly_do=` ra `GITHUB_OUTPUT` | cùng tệp | ngôn-ngữ/hình-thái | không — khoá đầu ra theo từ vựng kit | — |

## Cổng 0

- **decision = …** Khuyến nghị máy: build — T2, một lệnh bật theo lựa chọn; đây là CỘNG nên cần chủ kho phê đích danh ở Cổng Phạm vi.
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Lệnh in tầng của PR (T1 · chỉ hồ sơ · T2 · T3) và bit `cham_vat`, ra stdout và `$GITHUB_OUTPUT` khi có.
- Phân loại của lệnh = phân loại khối `[PR]` của `pre-merge-check.sh` trên cùng diff khi PR không đổi `risk_tiers` (round-trip, một bộ khớp).
- `t1_skip_globs` đọc ở nhánh gốc; PR tự nới danh sách vẫn ra «chạm vật».
- Mọi lối không phân loại được ra «chạm vật» kèm lý do ghim.
- `.github/**` không khai trong `t1_skip_globs` thì là chạm vật (án `.out-of-scope/t1-skip-globs-github-and-manifests.md` giữ).
- Kho không gọi lệnh: đầu ra `pre-merge-check.sh` trên bộ hồ sơ thật không đổi byte; `glob_variants`/`match_globs` giữ tên.
- GUIDE §5.3 có khuôn bước phân loại cho workflow của kho.

## Out of scope từ khám phá

- Không thêm danh sách thứ hai hay khoá config mới — lệnh đọc đúng `t1_skip_globs`/`t3_paths` của kho.
- Không nới `t1_skip_globs` cho `.github/**` hay manifest (án 26/07 giữ nguyên).
- Không sửa CI của kho nào trong vòng này — crm thay khối `sed` trong vòng của chính crm, sau mốc phát hành.
- Không làm bit PR nháp (đề 5): nháp là sự kiện GitHub, không phải tầng; #369 đã tự lo.
- Không đổi tên, không dời `glob_variants`/`match_globs` — crm #369 đang dựa; vòng A và G3 làm gần vùng.
- Không tách CI của kit thành job song song (finding §6 — meta, vào sổ, không mở ô).
