---
schema_version: 1
slug: lan-ghim-lai-theo-paths
feature: Làn ghim lại bớt chạy vô ích — hồ sơ chỉ hoá cũ khi diff chạm `paths` các eval của nó (kho bật khoá; hồ sơ không khai `paths` giữ luật cũ; chiến dịch mốc vẫn ghim toàn bộ) · suite trong làn chạy song song (kho bật khoá), eval vẫn nối đuôi
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:                     # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 03/10 từ hạt giống `docs/plans/2026-10-02-hat-giong-lan-ghim-lai-theo-paths-va-suite-song-song.md`
> theo vế (ii) ngưỡng của nó: owner gọi tên thi công 02/10, sau mốc 2.20.0 được crm nhận
> (crm-onehub#233 `9660bf6c`, 02/10). Hồ sơ điều tra: `docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md`.
> Sống cạnh ô `_acceptance/lan-ghim-lai-giu-tron-loi-loi/` (cùng tệp `repin-lane.mjs`, đã ký build
> 02/10, CHƯA thi công) — ô này xếp SAU nó.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/noi-bon-nut-dieu-phoi — 12 dòng `kind: repin` trên `origin/onehub` (đếm 03/10); 186 làn ghim crm 04/09→02/10, 70 làn không chạm `paths` của bất kỳ eval nào trong hồ sơ được ghim

**Ai đau:** phiên Claude Code thi công ở crm, và qua nó owner. Hồ sơ của một nhánh hoá cũ ngay
khi nhánh gộp `onehub`, vì `stale_files` (`scripts/pre-merge-check.sh`) so MỌI tệp đổi từ pin trừ
`_acceptance/` và `t1_skip_globs` — không so theo `paths` mà 95 % eval máy crm đã khai
(1 700/1 774). Mỗi lần hoá cũ là một làn ghim lại: bảy lệnh suite nối đuôi (crm từ 02/10: bốn bộ
test + hai lint + build `--force`) rồi mọi eval máy. Giá ≈ 13,6 phút cố định + 0,08 phút/eval,
p50 6 phút · p75 15 · Σ ≈ **15 giờ/tuần nằm trên đường găng PR** (phiên đứng chờ làn rồi mới mở PR).
Nguồn: 100/155 commit ghim ở crm là «ghim lại sau khi gộp/kéo/trộn onehub».

**Số đã đo trên lịch sử (không phải hứa)** — mô phỏng luật mới trên 283 hồ sơ-lượt crm: 123 tránh
được (43 %), 70/186 làn tránh trọn; **3/70** làn tránh được từng theo sau một bản sửa — cả ba sửa
tệp test/`.githooks`, không sửa mã sản phẩm. Kit: 95/475, 28/124 làn.

**Tiền lệ nặng nhất vẫn bị bắt — kiểm 03/10 trước khi mở ô.** ADR 0014 sinh ra làn eval từ ca
`lenh-chung-khong-an-cache-doi` (crm, 07/09: hợp nhất 93 commit, mất tiền đề AC-3/AC-4, ghim xanh
hai lần). Đo lại diff `ed221f4b..538796cf` (96 tệp ngoài `_acceptance/`) so `paths` của chính hồ sơ
ấy bằng `globToRe` của kit: E1/E5 chạm `package.json`, E6 chạm 59 tệp `apps/**`·`packages/**` →
**luật mới vẫn gọi hồ sơ này hoá cũ**. Phép đo cũng lộ một ràng buộc: E1/E2 khai
`_acceptance/config.yaml` mà luật cũ LOẠI `_acceptance/` — nên luật mới phải là **giao** của luật
cũ với `paths` (chỉ thu, không bao giờ nới), nếu không kho nào cũng có thể đỏ ở chỗ hôm nay xanh.

**ADR 0014 đã loại một lối trông giống** — «ghim theo diff ngay trong bên đọc». Khác ở chỗ: lối kia
cho bên đọc NHẬN một pin mà không chạy lại eval; ô này không chạm bên đọc pin — nó chỉ đổi câu hỏi
«pin có cần làm mới không». Hồ sơ đã hoá cũ vẫn phải ghim bằng làn eval như ADR 0014 đòi.

**Đã cắt, không mở lại như mới** (hạt giống 02/10): «chỉ chặn hoá cũ ở mốc» — cắt 85–90 % làn
nhưng dời 14 % ca bắt được tới mốc và đổi mặc định mọi kho · «cache suite theo sha» — 180/186 làn
ở sha riêng · «ghim theo delta đi vòng S4» — GUIDE §7.1 đã có, tốn token hội đồng nên crm không đi.

**Đối chiếu E14 crm (phiên phân tích 03/10, vòng OKR lượt 4 — 5 giờ 10 phút cho một eval).** E14 dùng
`paths` theo chiều NGƯỢC với (b): diff chạm glob của hồ sơ khác → chạy eval của họ (44 → 237 eval), ba
tầng thước-chạy-thước, 79 % phút đi vào lệnh đỏ sẵn trên nhánh gốc. Hai điều cho ô này: (i) kho cần
phép chọn-theo-`paths` thật, và khi kit không có thì kho tự dựng ở sai tầng — (b) đưa vị từ ấy về
MỘT tầng (một hàm, kho chỉ được dùng để LIỆT KÊ hồ sơ cần ghim, không chạy eval trong eval);
(ii) glob rộng (`packages/**` khớp một component dùng chung của ~40 hồ sơ) là lý do 43 % là trần —
dưới (b) chính các hồ sơ ấy vẫn hoá cũ, đúng, vì mã dùng chung đổi.

**Giới hạn khai, kèm ngưỡng:** (b) đảo chiều khuyến khích — hôm nay glob rộng là tốn (E14), sau (b)
glob hẹp là đỡ ghim, nên có thể thu `paths` để né làn. Lưới: chiến dịch mốc ghim TOÀN BỘ bỏ qua vị
từ; ngưỡng là dòng CHẾT «≥ 1 ca bỏ lỡ chạm mã sản phẩm». Điều kiện bật (c) ở kho: không còn eval nào
gọi `repin-lane`/suite bên trong eval (E14 crm gọi làn trong eval trong S4 — song song lồng song song
là tranh chấp nhân lên).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Luật mới = luật cũ ∩ hợp `paths` của MỌI eval có khai `paths` (máy + ui-check + judgment); một eval máy không khai `paths` → cả hồ sơ giữ luật cũ | bỏ lỡ vật đổi của ô ui-check (làn không còn chạy nên dòng «ô ngoài làn máy có vật đổi» của hồ sơ `ghim-lai-noi-ra-o-khong-do` không in) | chạy lại mô phỏng 283 hồ sơ-lượt với hợp mở rộng: số tránh được giảm bao nhiêu so 123 | Chưa thử |
| 2 | Tiền lệ 88 commit (ADR 0014) vẫn hoá cũ dưới luật mới | (b) bỏ lỡ chính ca đẻ ra làn eval → CHẾT | diff pin→làn đầu so `paths` bằng `globToRe` | **Đạt 03/10** — E1/E5/E6 chạm (xem trên) |
| 3 | Suite crm chạy song song cho cùng mã thoát như nối đuôi trên cùng cây | (c) đổi nghĩa xanh/đỏ; crm có `suite_api` + `suite_agent_db` cùng chạm DB test, `build --force` ghi đầu ra mà bộ test có thể đọc | chạy làn hai cách × 3 lần trên cùng sha crm, so bảy mã thoát; đọc thêm dấu lượt đỏ + tải máy từ ô `lan-ghim-lai-giu-tron-loi-loi` | Chưa thử — chứng cũ yếu (S4 đã chạy các suite này song song qua tác nhân, 161 lượt, không phân biệt được tải) |
| 4 | Bộ đọc pin (recheck, pre-merge, thẻ) và vị từ `--skip-unchanged` của làn dùng CHUNG một vị từ hoá cũ — một nguồn, hai bên gọi | hai bản trôi: lưới gọi hoá cũ mà làn bỏ qua (hoặc ngược lại) | ca round-trip: cùng diff + cùng `evals.yaml` → hai bên cùng kết luận | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] *sau khi crm bật hai khoá, số làn ghim lại mỗi tuần và giá mỗi làn có giảm như dự báo mà không lọt một hồi quy mã sản phẩm nào không?*
- Kết quả nào là SỐNG: [đề xuất] đọc ở crm, so tuần trước-bật (dòng `wall_s` do ô `lan-ghim-lai-giu-tron-loi-loi` ghi) với các tuần sau-bật: làn/tuần giảm ≥ 25 % · `wall_s` p50 giảm ≥ 40 % · 0 ca bỏ lỡ chạm mã sản phẩm (ca bỏ lỡ = hồ sơ luật mới bỏ qua mà lượt đo kế tiếp của nó — S4 hoặc chiến dịch mốc — đỏ) · 0 lần bảy mã thoát song song khác nối đuôi trên cùng cây.
- Kết quả nào là CHẾT: [đề xuất] ≥ 1 ca bỏ lỡ chạm mã sản phẩm · hoặc ≥ 1 lần mã thoát song song khác nối đuôi mà vật không đổi · hoặc làn/tuần giảm < 10 %.
- Timebox: [đề xuất] một vòng T3, trần ba lượt chấm; đọc ngưỡng sau 30 ngày kể từ ngày crm bật khoá hoặc sau 50 làn crm, lấy cái đến trước.

## Kết quả prototype

Không dựng prototype — phép thử cho giả định 2 đã chạy trên lịch sử crm (03/10, số ở trên); giả định
1 và 3 thử bằng mô phỏng/chạy hai cách ở S1, trước khi viết mã.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ đọc `paths` hai cách viết (flow + block seq) | kit `feature-loop/scripts/repin-lane.mjs` `pathsCuaEval` (hồ sơ `ghim-lai-noi-ra-o-khong-do`) | triết-lý/logic | có — dời vào một chỗ hai bên cùng gọi; KHÔNG đụng bộ đọc của `carry-plan.mjs` (đường verdict) | — |
| Hàm khớp glob | kit `feature-loop/scripts/carry-plan.mjs` `globToRe` | triết-lý/logic | có — dùng chung, không viết bản thứ hai | — |
| Vị từ hoá cũ | kit `scripts/pre-merge-check.sh` `stale_files` + khối `SKIP-UNCHANGED-PREDICATE` của làn | triết-lý/logic | có — hai bản quy về một | — |
| Số đo crm | `crm/_acceptance/*/run-log.jsonl` + 155 commit `repin…` (hồ sơ điều tra 02/10) | số nền | có | — |

## Cổng 0

- **decision = …** [đề xuất] `build`, hạng **T3** — `scripts/pre-merge-check.sh` nằm trong `risk_tiers.t3_paths`; vị từ chung nhiều khả năng nằm ở `lib/**` (cũng T3). Phạm vi: (b) vị từ hoá cũ theo `paths`, bật bằng khoá config (mặc định TẮT), hồ sơ thiếu `paths` giữ luật cũ, chiến dịch mốc vẫn ghim toàn bộ; (c) suite song song trong làn, bật bằng khoá config (mặc định TẮT), eval vẫn nối đuôi. Việc (a) của hạt giống (`wall_s` + số lệnh trên dòng `kind: repin`) đề xuất GỘP vào ô `lan-ghim-lai-giu-tron-loi-loi` — xem gói trình.
- **disposition = …** Không prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** ba ngưỡng ở trên.

## Thước đo thành công → ứng viên criterion

- Độ nhạy (b): bản sao bỏ bộ lọc `paths` → hồ sơ hoá cũ như luật cũ, cùng danh sách tệp.
- Độ đặc hiệu (b): diff chạm đúng MỘT tệp trong `paths` → vẫn hoá cũ · diff chỉ chạm tệp ngoài `paths` → im.
- Đường đọc-cũ (b): khoá tắt, hoặc hồ sơ có eval máy thiếu `paths` → đầu ra pre-merge y hệt bản 2.20.0 từng byte.
- Chỉ thu (b): mọi tệp luật mới gọi hoá cũ ⊆ tệp luật cũ gọi hoá cũ, trên mọi ca.
- Một nguồn (b): pre-merge và `--skip-unchanged` của làn ra cùng kết luận trên cùng đầu vào (round-trip).
- (c): bảy (kit: số suite của kit) mã thoát song song y hệt nối đuôi trên cùng cây; một suite đỏ → làn đỏ, lời lỗi giữ trọn như ô `lan-ghim-lai-giu-tron-loi-loi` đã làm.
- Chiến dịch mốc: cờ ghim toàn bộ bỏ qua vị từ mới.

## Out of scope từ khám phá

- Không «chỉ chặn hoá cũ ở mốc» — cắt ở hạt giống: dời 14 % ca bắt được tới mốc, đổi mặc định mọi kho.
- Không «cache suite theo sha» — 180/186 làn ở sha riêng, không có gì để dùng lại.
- Không chạm bên đọc pin (`checkRepinEvals`) — ADR 0014 giữ nguyên: hồ sơ hoá cũ vẫn ghim bằng làn eval.
- Không chạy eval song song — chỉ suite; eval nối đuôi giữ nguyên.
- Không đổi mặc định ở bất kỳ kho nào — hai khoá mặc định TẮT; crm bật là lựa chọn của crm.
- Không hợp nhất bộ đọc `paths` của `carry-plan.mjs` (đường verdict S4) — vòng riêng, ngưỡng đã khai ở `repin-lane.mjs`.
