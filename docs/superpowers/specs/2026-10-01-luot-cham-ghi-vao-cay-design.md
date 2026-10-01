# Lượt chấm ghi vào cây — thiết kế vòng T3

> Ngày: 2026-10-01 · hồ sơ `_acceptance/luot-cham-ghi-vao-cay/` · owner duyệt mở vòng 01/10
> (CỘNG đích danh, ADR 0018) · hạt giống gốc
> [2026-09-21-hat-giong-tac-nhan-cham-ghi-vao-cay](../../plans/2026-09-21-hat-giong-tac-nhan-cham-ghi-vao-cay.md)
> · nền: [finding 2026-09-26](../../findings/2026-09-26-loi-kit-tu-luot-4-okr.md) B8, B10, §9.1 ·
> hợp đồng `cham-khong-tu-dot-luot` (AC-5 + mục Out of scope «vế phát hiện của B8»).
> Brainstorm không hỏi lại điều lời giao việc đã chốt; mọi lựa chọn dưới đây máy tự quyết theo
> mục tiêu + luật đã khai, có sổ và cửa veto ở Cổng Phạm vi.

## 1. Vấn đề trong một đoạn

Lượt chấm S4 giả định cây đứng yên: mọi tác tử chấm cùng một `invokedSha`. Không gì giữ giả
định ấy. Ba ca thật ở crm, cả ba sau khi lượt chấm đã chạy xong mới có người thấy:

| Hồ sơ (crm) | Ngày | Điều đã xảy ra | Sổ |
|---|---|---|---|
| `dieu-phoi-30-ngay-dau` | 21/09 | tác tử chạy E2 commit `508ed3f7` chạm vật + khối báo cáo; lần hai trong 24 giờ | `d-20260921T061816Z-16` |
| `claimdue-chi-thay-dong-cua-minh` | 24/09 | bốn tác tử máy sửa tệp test đang chấm, một tác tử commit `53a4adf3` | `d-20260924T014018Z-8` |
| `hydrat-giai-doan-deals` | 30/09 (kit 2.19.0) | tác tử chấm tự sửa mã và commit **bốn** lần (StatusIndicator, nhãn giai đoạn, ngày tương đối, prefetch); nhánh đưa về `1d1ad2d8`, chấm lại | `d-20260930T113057Z-6` |

Ca 30/09 vượt ngưỡng hạt giống («một lần nữa ở bất kỳ kho nào sau khi crm cài 2.18.0»). Hôm nay
kit chỉ bắt được phần chạm **thước** (thước lệch, `nhan-trang-thai-va-reality` AC-3) — ca
`claimdue` lẽ ra rơi vào đó; phần chạm **vật** và **commit** thì im. Hậu quả: một lượt chấm
không chấm vật đã giao (chấm vật tác tử vừa sửa — doer = grader) vẫn ra được PASS ký được.

## 2. Đường đọc cây sau lượt — chọn bước SAU-LƯỢT của phiên chính, không phải tác tử

Ba đường khả dĩ, đã cân:

| Đường | Ai đọc HEAD/cây | Vì sao loại / chọn |
|---|---|---|
| A. JS thuần trong `acceptance-verify.js` | — | Workflow không có hệ tệp: JS không đọc được HEAD. Loại. |
| B. Thêm một tác tử «provenance» cuối fan-out | tác tử | Tác tử TỰ KHAI — đúng lớp lỗi AC-5 của `cham-khong-tu-dot-luot` vừa gỡ (vòng 3 lượt 4 OKR khai `verified_commit: ec2849e5`, không trùng sha nào). Và tác tử ấy chạy TRONG cùng lượt mà cây đang bị ghi. Loại. |
| C. Script tất định ở bước sau-lượt mà SKILL đã bắt chạy sau MỌI Workflow (`thuoc-vat.mjs --write`, kể cả BLOCKED) | `git` qua script | **Chọn.** Không tác tử nào khai; cùng chỗ với ảnh chụp thước (tiền lệ «thước lệch» đã ship, đã có bên đọc). Không thêm bước SKILL mới — chỉ thêm một mã thoát cho bước có sẵn. |

Hệ quả của C: bộ chấm `acceptance-verify.js` KHÔNG đổi. Phần «so trước/sau» sống ở hai đầu sẵn
có — `s4-args.mjs` chụp (TRƯỚC fan-out, cùng lúc ghi `invokedSha`), `thuoc-vat.mjs --write` so
(NGAY SAU fan-out). Ca đo vì thế nằm ở `tests/scripts/` chứ không ở `tests/workflows/` (lời giao
việc gợi ý nơi sau vì giả định so trong workflow).

Giới hạn khai của C (không giả vờ có răng): bước sau-lượt là bước SKILL — phiên chính bỏ bước ấy
thì không có dòng sổ nào. Đây CÙNG giới hạn với «thước lệch», và lưới trước-merge không có cách
phân biệt «đã so, cây sạch» với «không so». Ngưỡng mở răng «lượt nào cũng phải có dòng so»: ≥1 hồ
sơ ký mà lượt chấm cuối có commit lạ được phát hiện SAU khi ký.

## 3. Định nghĩa «cây đổi trong lượt chấm»

**Ảnh chụp trước (s4-args, cùng lúc `invokedSha`):** `args.cayChup = { sha, ban, chuaTheoDoi }`
— `sha` = `invokedSha`; `ban` = `{đường: băm nội dung}` của mọi tệp ĐANG THEO DÕI mà `git status
--porcelain -z --untracked-files=normal` liệt là đổi (sửa, xoá, đã stage) và nằm trong VÙNG XÉT;
`chuaTheoDoi` = tên các mục `??` trong vùng xét (không băm — §5.1). Tệp bị `.gitignore` che không
bao giờ xuất hiện. Cây sạch → `ban = {}`, `chuaTheoDoi = []`.

**Vùng xét** = đường mà `lib/phan-loai.mjs` xếp `vat` hoặc `thuoc` (MỘT nguồn phân lớp với bộ
đếm vật · thước · nhát và vùng vật của s4-args), TRỪ ba tiền tố — hằng `NGOAI_VUNG` một chỗ trong
`feature-loop/scripts/lib/cay-doi.mjs`, ảnh chụp và phép so cùng gọi:
- `.acceptance-runs/` — nơi lần chạy ghi tạo phẩm (`eval-executors.md` «Where a run writes its
  artifacts»); `phan-loai` xếp nó `vat` vì nó nằm ngoài `_acceptance/`;
- `_acceptance/<slug>/evidence/` của chính hồ sơ — ui-check ghi vào đó; phần lớn tệp ở đó là
  `ho-so`, nhưng tệp đuôi script (`.js`, `.mjs`…) bị `phan-loai` xếp `thuoc`;
- `.claude/` — cấu hình phiên của harness, không phải vật; đo §5.1: crm có `.claude/launch.json`
  ĐANG THEO DÕI và bị công cụ xem trước của phiên ghi (gap-probe P1).

Bảng lớp THẬT (đầu ra `phanLoai`, t1 = `docs/**`, chạy 01/10) — chỗ dựa cho ba tiền tố trên và cho
các hàng ma trận AC-2/AC-3:

| Đường | `phanLoai` | Trong vùng xét? |
|---|---|---|
| `_acceptance/<slug>/evidence/f.png` | ho-so | không |
| `_acceptance/<slug>/evidence/chup.mjs` | thuoc | không (trừ đích danh) |
| `_acceptance/khac/evidence/ve-that.json` | ho-so | không |
| `_acceptance/khac/rang.sh`, `_acceptance/khac/rang/a.mjs` | thuoc | **có** |
| `_acceptance/khac/tests/x.test.ts` | ho-so | không |
| `.acceptance-runs/s/x.json` | vat | không (trừ đích danh) |
| `.claude/launch.json` | vat | không (trừ đích danh) |
| `src/a.js`, `tests/k.test.mjs` | vat | **có** |
| `docs/x.md` | ngoai | không |

Đường lớp `ho-so` và `ngoai` KHÔNG xét: đó là đúng luật «hoá cũ» của Staleness guard và lưới
trước-merge (`git diff <verified_commit>` bỏ qua `_acceptance/` và `t1_skip_globs`). Thứ hai nơi đã
coi là «không phải vật» thì nơi thứ ba không được coi là vật — ba bên đọc một câu. Thước của hồ sơ
(kể cả hồ sơ khác — cấu hình có thể trỏ lệnh eval vào răng của hồ sơ khác) VẪN xét.

**So sau lượt (thuoc-vat `--write`):**
1. **Commit lạ** — mọi tệp trong vùng xét mà `git diff --name-only <sha> HEAD` HOẶC `git log
   --format= --name-only <sha>..HEAD` liệt. Vế `log` bắt cả commit rồi hoàn lại trong lượt (tổng
   diff rỗng nhưng vật từng khác khi một tác tử khác đang chấm). Kèm danh sách commit
   (sha ngắn) chạm các tệp ấy.
2. **Tệp đang theo dõi bị sửa** — CHỈ duyệt đường ĐANG THEO DÕI (có ở `<sha>` hoặc trong index lúc
   so) thuộc vùng xét và có mặt ở `ban` HOẶC ở `git status` sau: băm-trước = `ban[đường]` nếu có,
   ngược lại băm nội dung tại `<sha>` (vắng ở sha = «vắng»); băm-sau = nội dung trên đĩa (vắng =
   «vắng»). Khác → tệp bị chạm. Chỉ băm nội dung, không mtime (cùng luật `soThuoc`). Mục chưa theo
   dõi — có sẵn trong `chuaTheoDoi` hay mới — KHÔNG BAO GIỜ vào vế này (gap-probe P0: tạo phẩm
   chưa theo dõi từ lượt trước, bị ghi lại ở lượt sau, không được khoá).
3. **Mục chưa theo dõi MỚI** (không có trong `chuaTheoDoi`) — KHÔNG khoá. Script in một dòng stderr
   `tep moi chua theo doi: <đường>`; dòng sổ (nếu có vì vế 1/2) mang danh sách ở khoá `moi`, thẻ
   không đọc. Lý do ở §5 (bẫy c).

Có (1) hoặc (2) → lượt KHÔNG dùng được.

**Hoàn lại trước khi chấm lại — vật máy giữ, không chỉ lời dặn (gap-probe P1).** Khi sinh args,
`s4-args.mjs` đọc dòng `cay-doi` MỚI NHẤT của sổ; nếu không có dòng `round-tally` nào mang `ts` mới
hơn `luot_ts` của nó (tức chưa có lượt nào chạy sau nó — kể cả dòng mồ côi khi lượt chết không ghi
tally), thì kiểm: commit nào của dòng ấy còn là tổ tiên của HEAD, tệp nào của dòng ấy còn bẩn trong
cây. Còn → thoát 2 ghim `cay doi chua hoan lai` + danh sách, KHÔNG sinh tệp. Lối đi tiếp có tên:
`--nhan-cay-moi` (phiên khác gộp có chủ đích — chấm trên HEAD mới), in một dòng và ghi
`cayNhanMoi: [<sha ngắn>]` vào args; SKILL bắt ghi một dòng sổ `fix` cho lựa chọn ấy. Không lối
nào để «quên hoàn lại» đi im lặng sang ảnh chụp mới.

## 4. Một nhãn trạng thái mới, đi qua MỘT nguồn

Tên: **cây đổi trong lượt chấm** (không phải «lượt chấm đã ghi vào cây» như lời giao việc đề
xuất). Lý do: phép so biết CÂY đổi, không biết AI đổi — B10 của finding 26/09 là phiên điều phối
gộp PR vào cây giữa lượt, không phải tác tử chấm; §9.1 cùng finding đã sửa lời B8 vì đúng lý do
này («không khẳng định điều không đo»). Người gỡ và giá như nhau ở cả hai ca.

| Chỗ | Đổi gì |
|---|---|
| `thuoc-vat.mjs --write` | so như §3; có (1)/(2) → nối dòng `{"kind":"cay-doi",…}` (khuôn marker `CAY-DOI-LINE`) và thoát **6**, thông điệp ghim `cay doi trong luot cham` + từng tệp + từng commit. Thước lệch VẪN thắng: cả hai cùng xảy ra → ghi cả hai dòng, thoát 5. |
| `lib/nhan-canh-gay.cjs` | `NHAN.CAY = 'cây đổi trong lượt chấm'`; `canhGay` trả `trangThai: 'cay-doi'` + `cay: {tep, commit}` khi có dòng `cay-doi` cùng `round` và cùng `luot_ts` với dòng `round-tally` cuối — BẤT KỂ verdict. Thứ tự: `lech` → `cay-doi` → các nhánh cũ. Hàm mới `luotKhongDungDuoc` + CLI `--luot` cho lưới bash. |
| `scripts/gate-card.js` (Cổng 2) | `cay-doi` → không ký được; nhãn, từng tệp, từng commit; việc: «máy hoàn lại thay đổi lạ rồi chấm lại cùng vòng — không đếm vào trần». |
| `feature-loop/scripts/s4-args.mjs` | (i) chụp `cayChup`; (ii) kiểm «đã hoàn lại» (§3, cuối) — thoát 2 hoặc `--nhan-cay-moi`; (iii) lượt cuối mang `cay-doi` và chưa thử lại vì nhãn này → CÙNG round (cùng khối `THU-LAI-CUNG-ROUND`, mở rộng điều kiện), in một dòng; đã thử lại một lần vẫn `cay-doi` → in dòng «trình thẻ, không chấm tiếp», round kế như cũ. |
| `scripts/pre-merge-check.sh` | TRƯỚC nhánh verdict: lib + node có mặt, `node lib --luot` thoát 1 (`CAY-DOI …`) → VIOLATION ghim «lượt chấm cuối không dùng được — cây đổi trong lượt chấm». Thoát 0 → đi tiếp. Mã khác (lib ĐỜI CŨ không biết `--luot` in cách dùng và thoát 3) → một dòng NOTE «lib chưa biết nhãn cây đổi — bỏ qua», luật cũ. Lib/node vắng → luật cũ. |
| `scripts/recheck-evidence.cjs` | báo cáo họ PASS + `luotKhongDungDuoc` báo cây đổi → thoát 1, cùng thông điệp. Dò năng lực trước: lib vắng HOẶC lib đời cũ không có hàm (`typeof … !== 'function'`) → như cũ, không ném. |
| `feature-loop/skills/feature-loop/SKILL.md` | câu «Mã 5» ở S4 thêm «Mã 6 = cây đổi trong lượt chấm»: không ghi PASS, không set `verified`; đọc danh sách; HOÀN LẠI rồi sinh args lại (s4-args tự ra cùng round). Hoàn lại = commit lạ CHƯA đẩy mà phiên này không tạo và không phối hợp → đưa nhánh về `sha`; còn lại (phiên khác gộp có chủ đích) → chấm lại trên HEAD mới. Khó-đảo (commit đã đẩy, việc của người khác) → hỏi người. |
| `CONTEXT.md` | thêm *cây đổi trong lượt chấm* vào danh sách **Nhãn trạng thái**. |

Khớp dòng `cay-doi` với lượt: khoá `luot_ts` = `args.invokedAt` — đúng giá trị `ts` mà bộ chấm
ghi lên dòng `round-tally` (`acceptance-verify.js:73`). Lần thử lại cùng round mint `invokedAt`
mới, nên dòng `cay-doi` của lần trước không dính lần sau (cùng nếp `cungLan` của `canhGay`).
Không phụ thuộc thứ tự ghi giữa dòng `round-tally` và dòng `cay-doi`.

## 5. Cân trên mọi kho

Phép thử luật 26/09: «kho KHÔNG có sự cố này được gì, mất gì?» và «hành vi cũ có ai đang dựa?»

- **Kho không có sự cố:** HEAD = `sha`, vùng xét không đổi → không dòng, thoát 0; lib/thẻ/lưới đọc
  sổ không có dòng mới → ra đúng như trước vòng (ca đối chứng so thẻ TỪNG BYTE với bản trước vòng).
- **(a) Phiên chính commit bằng chứng/sổ giữa lượt:** mọi tệp ấy dưới `_acceptance/<slug>/` → lớp
  `ho-so` → không xét. HEAD dời nhưng không tệp nào trong vùng xét → IM. (`verified_commit` vẫn là
  `invokedSha` theo AC-5 cũ; Staleness guard cũng bỏ qua `_acceptance/`.)
- **(b) ui-check ghi khung vào `evidence/`:** trừ đích danh → IM.
- **(c) Lệnh eval của kho tự sinh tệp trong cây:** đo ở §5.1. Quyết theo luật «bất định thì
  đoán về phía sót đã khai»: tệp MỚI chưa theo dõi không khoá (gọi tên ở stderr + khoá `moi`);
  chỉ tệp ĐANG THEO DÕI bị đổi nội dung hoặc commit mới khoá. Ca tệp theo dõi bị lệnh của kho ghi
  lại (oneflow ABI khi vật lệch; răng đột biến tại chỗ bị giết) là khoá ĐÚNG hoặc giới hạn khai.
- **(d) Carry-forward / round delta:** eval carry không chạy lại nên không ghi gì; phép so không
  phụ thuộc tập eval chạy. Round fix sau REJECT sinh args mới → ảnh chụp mới.
- **Cây bẩn sẵn trước lượt** (người đang sửa dở): nằm trong ảnh trước → chỉ khoá khi nội dung đổi
  TRONG lượt.
- **Kho không phải git / sha không giải được:** không so, một dòng stderr, không dòng sổ (đường
  khoan dung — cùng nếp «không có ảnh chụp thước»).
- **Đường đọc-cũ:** tệp args đời cũ không có `cayChup` → không so, một dòng stderr; sổ đời cũ không
  có dòng `cay-doi` → `canhGay` ra như trước. Lib này nằm trong INIT-CI-COPY-LIST: kho tiêu thụ
  nhận nó theo chiến dịch phát hành, không giữa vòng.

### 5.1 Đo 4 kho (01/10, chỉ đọc — không chạy suite; [BC] = thấy bằng chứng, [SUY] = đọc mã)

| Kho | Lệnh/đường ghi vào cây | Bị che? | Lớp tác động |
|---|---|---|---|
| crm | build/test: `.turbo/`, `.next/`, `*.tsbuildinfo`, `dist`, prisma generated | che [BC] | không |
| crm | `ve-that.json` dưới `_acceptance/chan-lai-component-ra-man/evidence/` | không | `ho-so` → không xét |
| crm | răng đột biến tại chỗ rồi trả lại (`ld_bat_duoc_lop_loi` → `layout.tsx`; `cr_*` → `vercel.json`; `be-rong-do-lib.sh`) | không, **tracked** | thoát bình thường: sạch; bị giết giữa chừng: để lại tệp sửa → KHOÁ, và khoá là đúng (lỗi cũ [BC]: `cron-theo-ban-khai/review-findings.md:6`; `tong-quan-va-khung-noi-tieng-viet/contract.md:145` — hội đồng đọc trúng chuỗi đột biến) |
| crm | `apps/app/.next-phien-do-*`, `.next-proto-ui/` | KHÔNG che sau đổi nhánh [BC] | chưa theo dõi → không khoá |
| crm | gốc chính có ` M .claude/launch.json` (cấu hình phiên) | — | tracked bẩn SẴN → vì vậy phép so là chênh trước/sau, không trạng thái tuyệt đối |
| oneflow | `pnpm build` / `gen_abi_clean` ghi lại `src/generated/abi/index.ts` + `sdk/.../tongflow.abi.json` | không, **tracked** | chỉ đổi byte khi vật lệch → KHOÁ một lượt mà `gen_abi_clean` vốn đỏ đúng (giới hạn khai §7) |
| oneflow | Next ghi đè `tsconfig.json` khi `include` thiếu thư mục dist (đã sửa, `add-media-library` S4-r8 [BC]) | tracked | quay lại thì KHOÁ — đúng: lượt đó lint đỏ vì cây đổi |
| radar | `test-results/`, `playwright-report/`, `data/*.sqlite`, `dist-*` | che [BC] | không |
| radar | tạo phẩm của bộ chạy S4/tác tử: `.wf/acceptance-verify*.js`, `.s4-acceptance-verify.js`, `/evidence/`, `public/__e18_*`, `.playwright-mcp/` | che ở radar SAU sự cố; KHÔNG che ở ba kho kia | chưa theo dõi → không khoá |
| media-library | build/typecheck/smoke/itest, răng `.pha-*` | che / tmpdir [BC][SUY] | không |

Kết luận đã dùng ở §3: (i) không lệnh suite nào ở 4 kho sửa tệp đang theo dõi ngoài
`_acceptance/` khi chạy bình thường; (ii) nguồn chặn oan lớn nhất là TỆP MỚI CHƯA THEO DÕI — kể cả
tạo phẩm của chính bộ chạy kit ở gốc kho — nên vế (3) «tệp mới chưa theo dõi» chỉ gọi tên, không
khoá; (iii) cây bẩn sẵn có thật (crm) nên phép so phải là chênh trước/sau. Ảnh chụp trước băm
CHỈ tệp đang theo dõi bị sửa; tệp chưa theo dõi chỉ ghi tên ở chế độ `--untracked-files=normal`
(thư mục chưa theo dõi gộp một dòng — `.next-phien-do-*` có hàng nghìn tệp, băm hết là chi phí vô
ích cho một vế không khoá).

## 6. Phép đo (cặp hai chiều trên cùng fixture)

Fixture: kho git do code sinh (`tests/scripts/thuoc-vat-fixture.mjs`), args do `s4-args.mjs`
THẬT sinh, dòng sổ do `thuoc-vat.mjs --write` THẬT ghi, dòng `round-tally` dựng bằng `tallyLine`
nạp qua harness vm của `tests/workflows` (round-trip writer→reader). Ma trận viết trước (§7 của
plan), một tệp ca thường trực `tests/scripts/cay-doi-trong-luot.test.mjs`; răng hồ sơ
`_acceptance/luot-cham-ghi-vao-cay/rang.sh` chạy từng nhóm trên cây thật (xanh) rồi trên bản sao
trọn cây có MỘT đột biến thay thế nguyên văn (đỏ ghim tên ca):

| Đột biến | Ca phải đỏ |
|---|---|
| `bo-so` — gỡ phép so cây trong thuoc-vat | LC2 hàng 1–5 |
| `chi-diff` — bỏ vế `git log` (chỉ diff ròng) | LC2 hàng 4 (commit rồi hoàn) |
| `khong-tru-runs` — gỡ `.acceptance-runs/` khỏi `NGOAI_VUNG` | LC1, LC3 hàng 2 |
| `khong-tru-evidence` — gỡ `evidence/` của hồ sơ khỏi `NGOAI_VUNG` | LC3 hàng 3 (tệp `.mjs` đang theo dõi dưới evidence) |
| `khong-tru-claude` — gỡ `.claude/` khỏi `NGOAI_VUNG` | LC3 hàng 10 |
| `xet-chua-theo-doi` — vế (2) duyệt cả mục chưa theo dõi | LC3 hàng 9 (tạo phẩm chưa theo dõi có sẵn, bị ghi lại) |
| `bo-kiem-hoan-lai` — gỡ kiểm «đã hoàn lại» trong s4-args | LC5 hàng hoàn-lại |
| `lib-bo-cay` — `canhGay` bỏ nhánh `cay-doi` | LC4, LC5, LC6, LC7 |
| `bo-do-nang-luc` — recheck gọi hàm lib không dò `typeof` | LC7 hàng lib đời cũ |

## 7. Giới hạn khai (kèm ngưỡng đang đếm)

- Phiên chính bỏ bước sau-lượt → không phát hiện (§2). Ngưỡng: ≥1 hồ sơ ký có commit lạ lộ ra sau ký.
- Tệp mới chưa theo dõi không khoá (§3, §5c) — một tác tử thêm tệp test mới được bộ chạy tự nhặt
  sẽ lọt. Ngưỡng: ≥1 ca thật tệp mới chưa theo dõi đổi kết quả lượt chấm.
- Lệnh của kho ghi lại một tệp đang theo dõi CHỈ khi vật lệch (oneflow `gen:abi` → tệp ABI): lượt
  mà ô `gen_abi_clean` đỏ đúng thành «cây đổi», chạy lại cùng round một lần rồi thẻ khoá với tên
  tệp — mất đường REJECT→máy sửa ở đúng lượt ấy. Ngưỡng: ≥1 ca thật.
- Thay đổi rồi hoàn lại TRƯỚC khi lượt xong mà không commit (sửa đĩa, chạy, khôi phục) → không thấy.
  Không có ca thật; ngưỡng: ≥1 ca.
- Tác tử chấm (ui-check, judgment) ghi một tệp ĐANG THEO DÕI ngoài ba tiền tố trừ — ví dụ công cụ
  của harness sửa một tệp cấu hình ngoài `.claude/` — sẽ khoá lượt. Đo §5.1 chỉ ĐỌC mã và lịch sử
  (không chạy lượt nào ở kho tiêu thụ); giả định này giữ `[GIẢ ĐỊNH]` ở Coverage. Ngưỡng nới thành
  cờ vàng: ≥1 lượt khoá oan có tên ở bất kỳ kho nào. Chi phí trần mỗi ca: một lượt chấm lại cùng
  round rồi thẻ khoá có tên tệp — không đốt trần.
- Thẻ Cổng Phạm vi và vị từ `khong-can-nguoi.mjs` (đường máy-thông T2) KHÔNG đọc nhãn: lưới trước-
  merge là chốt. Lối máy-thông trên một lượt `cay-doi` dừng ở CI. Ngưỡng: ≥1 hồ sơ máy-thông bị CI
  chặn vì nhãn này.

## 8. Ngoài phạm vi → hạt giống

- A. Phép đo dài hơn trần 600 s của làn máy → `docs/plans/2026-10-01-hat-giong-phep-do-qua-tran-lan-may.md`.
- B. Tham số lượt chấm đi bằng đường tệp → `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md`.
- C. B6 (câu người gõ được chuyển vào mọi tác tử chấm) — không thêm lời dặn; vế PHÁT HIỆN hậu quả
  là chính vòng này. Ngưỡng mở lại giữ nguyên ở Out of scope của `cham-khong-tu-dot-luot`.
- «Thước lệch» cũng không bị lưới trước-merge đọc (cùng lỗ §7 dòng 4) — không có ca thật, không mở.

## 9. Bảng dự báo năm dòng (luật (c)) + điều kiện tin cậy

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Thời gian làm-xong→quyết-được | ↓ | lượt hỏng bị máy gọi tên ngay sau lượt, không chờ người phát hiện ở thẻ (3 ca crm: người tự thấy) |
| Lượt gọi người/vòng | = (↓ ở ca có sự cố) | thêm 0 cổng; ca có sự cố hôm nay tốn ≥1 lượt người truy và quyết hoàn lại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | ↓ | lượt cây đổi chạy lại CÙNG round, không đếm trần |
| Token máy/vòng | = (↑ một lượt ở ca có sự cố) | ca có sự cố chấm lại một lần — hôm nay cũng chấm lại, chỉ muộn hơn |
| Phút máy/lượt chấm | = | thêm `git status` + băm vài tệp, < 1 s |

Điều kiện tin cậy: vòng này ĐỔI thành phần đường verdict (thêm một nhánh «không dùng được» sau
fan-out) → luật (c)(i) đòi răng CẢ HAI chiều — chiều đỏ (commit vật, sửa tệp theo dõi, commit
hoàn lại) và chiều im (cây sạch, `.acceptance-runs`, `evidence/`, commit sổ của phiên chính, tệp
`t1`, cây bẩn sẵn) đều nằm trong bộ ca §6, kèm đột biến chứng mỗi vế.
