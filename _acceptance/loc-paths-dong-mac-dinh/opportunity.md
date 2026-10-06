---
schema_version: 1
slug: loc-paths-dong-mac-dinh
feature: Bộ lọc hoá cũ theo paths đóng mặc định — chỉ bớt tệp khi MỌI mục paths của hồ sơ thuộc dạng đã chứng; thư mục trần thành thư-mục/** chỉ khi cây đang kiểm có thư mục ấy; mục không trỏ được tới tệp nào thì hồ sơ giữ luật cũ; hai bộ đọc paths trong làn ghim lại về một nguồn
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-10-06T06:39:04Z   # owner gõ «làm» một chạm trong phiên 06/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 06/10 từ hạt giống `docs/plans/2026-10-03-hat-giong-loc-paths-dong-mac-dinh.md`: ngưỡng mở ô
> («một kho tiêu thụ muốn bật `stale_scope: paths`») đã chạm. Owner quyết 06/10 bật khoá ở crm
> (crm-onehub#279, gộp `e753383a`), vượt giới hạn đã ký của vòng `lan-ghim-lai-theo-paths`, kèm ba
> lưới ở phía kho. Là vòng SỬA một lỗ của vật đã ký, không thêm khoá hay lệnh; có kho chờ nhận (crm).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/go-khoa-goc-nhin — 06/10 crm bật `risk_tiers.stale_scope: paths`; lỗ thư mục trần tái hiện trên chính hồ sơ này (`staleByPaths` trả `kept: []` cho tệp trong thư mục trần), kho phải tự vá 8 mục thành `thư-mục/**` và dựng lưới CI tạm `scripts/kiem-paths-dong.mjs`

Người gặp: owner và mọi phiên ở crm. Khoá bật nghĩa là lưới trước-merge và làn ghim lại tin
`paths` của eval để quyết hồ sơ đã ký có hoá cũ không. Bộ lọc hôm nay (`staleByPaths`,
`lib/evidence-core.cjs`) nhận MỌI chuỗi làm glob và đoán về phía «bỏ qua»: tái hiện 06/10 trên
`main` `bf79fdb1`, một tệp `apps/api/src/saved-views/a.ts` đổi thì bốn cách khai sau đều cho
`apply: true, kept: 0`, tức cổng xanh mà sai:

| Mục `paths` khai | Kết quả hôm nay |
|---|---|
| `apps/api/src/saved-views` (thư mục trần) | bỏ qua |
| `apps/api/src/saved-views/` (`/` cuối) | bỏ qua |
| `./apps/api/src/saved-views/**` (`./` đầu) | bỏ qua |
| `apps/api/src/*-views` (glob chỉ khớp thư mục) | bỏ qua |
| `apps/api/src/saved-views/**` | giữ, đúng |

Đây là lỗ thứ năm cùng một lớp qua năm lượt (lỗi node xoá trắng danh sách · tên tệp có dấu · chú
thích cuối dòng và dòng trống · thư mục trần · nay các dạng lạ): bộ đọc chấp nhận một dạng khai mà
nó không chứng được là hiểu đúng. Vá từng dạng đã thua bốn lần; nghiệm đúng tầng là đảo chiều mặc
định.

Hôm nay crm được che bằng lưới TẠM của chính kho: `scripts/kiem-paths-dong.mjs` chặn CI khi một mục
là thư mục trần, rỗng, hay dạng lạ (`./`, `/` đầu, `/` cuối, `\`, khoảng trắng), chỉ cảnh báo khi mục
trỏ tới tệp không còn. Lưới đó là thứ kit phải làm: một kho thứ hai bật khoá sẽ không có nó.

Ngoài-1 của lượt chấm 4 (`_acceptance/lan-ghim-lai-theo-paths/contract.md`, Known limits): làn ghim
lại có hai bộ đọc `paths` lệch nhau — `evalPathsOf` của lib (bộ lọc dùng) và `pathsCuaEval` riêng của
`repin-lane.mjs` (dòng cảnh báo «ô ngoài làn máy có vật đổi» dùng); vá chú thích và dòng trống chỉ vào
bộ thứ nhất. Đảo chiều mặc định mà chỉ sửa một bộ thì bộ kia giữ lỗ.

**Số đo 06/10 trên crm `onehub` `e753383a`** (bản chụp `_acceptance/` + `git ls-tree`, kit `main`
`bf79fdb1`; hàm thật, không mô phỏng):

- 167 hồ sơ có `evals.yaml`, **126 áp được bộ lọc hôm nay** (khớp số chủ kho đo ở `0e56349e`); 41 không
  áp vì eval thiếu `paths` (36 ngoài làn máy, 5 máy).
- 5 333 mục `paths` trong 126 hồ sơ đó: 4 078 tệp có thật · 1 216 glob khớp ≥ 1 tệp (1 128 kết bằng `/**`, 88 chỉ
  khớp tệp như `apps/*/package.json`, `apps/app/app/(app)/**/error.tsx`) · **37 tệp không còn trong kho** ·
  **2 glob không khớp tệp nào** · 0 thư mục trần (crm vừa vá) · 0 dạng lạ.
- Hai luật cho mục không trỏ được tới tệp nào: **giữ luật cũ cho hồ sơ đó → 115/167 áp được** (11 hồ sơ
  rơi về luật cũ) · vẫn lọc kèm cảnh báo → 126/167.
- Phía kho đang tự gỡ: một phiên crm 06/10 khai lại các mục trỏ tệp không còn, ghi vào sổ quyết định
  «trước đây sửa tệp mới chứa vật đo không làm hồ sơ hoá cũ; nay có». Kho đã tự xếp ca này là LỖ.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một danh sách dạng đã chứng (tệp có thật ở cây đang kiểm · glob kết bằng `/**` khớp ≥ 1 tệp · glob khác khớp ≥ 1 tệp và không khớp thư mục nào · thư mục trần có thật → `<thư mục>/**`) phủ 100 % mục `paths` hợp lệ của crm, nên hồ sơ crm đang áp được không rơi về luật cũ vì một dạng ĐÚNG mà bộ lọc không nhận | crm mất phần tiết kiệm vì luật quá chặt, kho quay lại tắt khoá | chạy bộ phân loại trên bản chụp crm `onehub` lúc dựng: mọi hồ sơ rơi về luật cũ phải gọi tên được một mục thật sự trỏ sai | Đã thử nửa (06/10: 5 333 mục, chỉ 39 mục ngoài danh sách, cả 39 trỏ tới thứ không có) |
| 2 | Mục không trỏ được tới tệp nào (tệp không còn · glob không khớp) giữ luật cũ cho CẢ hồ sơ là đúng hướng và rẻ: tệp vật đo đã dời chỗ thì sửa tệp mới phải làm hồ sơ hoá cũ | luật chặn phần tiết kiệm mà không bắt lỗ thật nào | đếm trên crm: 11/126 hồ sơ rơi về luật cũ, mỗi hồ sơ một NOTE gọi tên mục; phiên crm 06/10 đã xếp ca này là lỗ | Đã thử (06/10, số ở trên) |
| 3 | Gộp `pathsCuaEval` của làn vào `evalPathsOf` + phân loại chung chỉ đổi dòng cảnh báo «ô ngoài làn máy có vật đổi», không đổi mã thoát hay hồ sơ ghi ra ở kho nào | kho không bật khoá cũng đổi hành vi, trái luật «sửa vì một kho phải cân trên mọi kho» | chạy làn thử không ghi trên các cây tiêu thụ đang có trước/sau, vi phân: chỉ dòng cảnh báo được khác | Chưa thử |
| 4 | Kho không bật `stale_scope: paths` giữ từng byte ở lưới trước-merge | mọi kho trả giá cho một kho | ca vi phân AC-1 của vòng `lan-ghim-lai-theo-paths` chạy lại nguyên văn | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: *crm gỡ được lưới tạm `kiem-paths-dong.mjs` mà không mở lại lỗ nào nó đang che, và vẫn giữ phần lớn phần tiết kiệm của khoá?*
- Kết quả nào là SỐNG: trên bản chụp crm `onehub` lúc cắt mốc · mọi dạng lưới crm chặn (thư mục trần, rỗng, `./`, `/` đầu, `/` cuối, `\`, khoảng trắng) và glob chỉ khớp thư mục đều làm bộ lọc trả `apply: false` kèm lý do gọi tên mục · thư mục trần có thật ở cây đang kiểm giữ tệp bên trong · áp được ≥ 115/167 hồ sơ · phát lại các lượt ghim lại từ 27/09 vẫn tránh ≥ 33 % lượt hồ sơ (hôm nay 41 %) · kho không bật khoá giữ từng byte.
- Kết quả nào là CHẾT: còn một dạng lưới crm chặn mà bộ lọc vẫn bỏ qua tệp, hoặc phát lại tránh < 25 % lượt hồ sơ, hoặc một kho không bật khoá đổi đầu ra lưới trước-merge.
- Timebox: một vòng T3 (chạm `lib/**`), trần bốn lượt gọi người; ngưỡng đọc trên bản chụp crm trước khi cắt mốc mang vòng này.

## Kết quả prototype

Chưa dựng. Bộ phân loại thử (scratchpad 06/10, không commit) chạy hàm thật của kit trên bản chụp crm:
cho số ở «Vấn đề & ai gặp». Bản tái hiện bốn dạng bỏ qua chạy trên `lib/evidence-core.cjs` của `main`.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ lọc `staleByPaths`, `evalPathsOf`, `pathGlobToRe` | kit `lib/evidence-core.cjs` (vòng `lan-ghim-lai-theo-paths`) | vật đã ký | có — sửa tại chỗ, hàm vẫn một nguồn cho lưới trước-merge và làn | — |
| Bộ đọc `pathsCuaEval` + `globToRe` của làn | kit `feature-loop/scripts/repin-lane.mjs` | vật đã ký | KHÔNG — xoá, gọi bộ của lib | — |
| Lưới tạm `kiem-paths-dong.mjs` | crm `scripts/kiem-paths-dong.mjs` (PR crm-onehub#279) | thước đối chứng | có — làm ĐỐI CHỨNG: mọi dạng nó chặn thì bộ lọc mới phải từ chối áp dụng; ma trận ca đỏ rút từ nó | — |
| Bộ đọc `paths` của `carry-plan.mjs` | kit `feature-loop/scripts/carry-plan.mjs` | thành phần đường verdict S4 | KHÔNG chạm (điều kiện tin cậy «đường verdict không đổi thành phần») | — |

## Cổng 0

- **decision = build** T3: (1) `staleByPaths` phân loại từng mục `paths` trước khi so khớp — chỉ ba dạng đã chứng được lọc; mục ngoài danh sách → `apply: false`, lý do `dang-khai-la:<mục>`, NOTE gọi tên; mục không trỏ tới tệp nào → `apply: false`, lý do `paths-khong-tro-toi-tep:<mục>`; (2) «cây đang kiểm» là danh sách tệp git theo dõi ở commit đang kiểm, truyền vào hàm, không đọc đĩa; (3) làn ghim lại bỏ `pathsCuaEval` và `globToRe` riêng, gọi `evalPathsOf` + `pathGlobToRe` + cùng bộ phân loại; (4) ma trận ca đỏ rút từ lưới crm, mỗi ca có đối chứng dương và ghim đúng lý do; (5) GUIDE §7.1 và CHANGELOG đổi lời khai «chưa bật» thành điều kiện bật.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** ngưỡng SỐNG ở trên, đọc trên bản chụp crm trước khi cắt mốc.

## Out of scope từ khám phá

- Không đổi mặc định khoá (`stale_scope` vắng = luật cũ); không thêm khoá, lệnh hay chế độ cảnh-báo-thay-chặn.
- Không chạm bộ đọc `paths` của `carry-plan.mjs` (đường verdict S4); hạt giống hợp nhất ba bộ đọc giữ ngưỡng cũ của nó.
- Không tự sửa `paths` của kho tiêu thụ; kit chỉ gọi tên mục, kho sửa.
- Không làm lại quét thước hằng tuần của crm (lưới thứ ba) — việc của kho.

## Ghi chú cho mốc mang vòng này

Khi mốc chứa vòng này được cắt, ghi vào ghi chú mốc (mục «kho tiêu thụ phải làm gì khi nhận»): **crm gỡ
lưới tạm `scripts/kiem-paths-dong.mjs` và bước CI «Paths đóng mặc định» trong
`.github/workflows/acceptance.yml`**, cùng lượt nhận mốc; trước khi gỡ, chạy lưới tạm và bộ lọc mới trên
cùng cây, mọi mục lưới báo LỖI phải là mục bộ lọc từ chối.
