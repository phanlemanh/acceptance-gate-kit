---
schema_version: 1
feature: Làn ghim lại bớt chạy vô ích — hoá cũ theo paths (kho tự bật, chỉ thu) và suite song song trong làn (kho tự bật)
slug: lan-ghim-lai-theo-paths
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh + lib/** (t3_paths)
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-10-02T22:28:59Z
design_doc: docs/superpowers/specs/2026-10-03-lan-ghim-lai-theo-paths-design.md
---

# Acceptance Contract: lan-ghim-lai-theo-paths

## Context

Ở crm, hồ sơ của một nhánh hoá cũ ngay khi nhánh gộp `onehub`, vì luật hoá cũ so MỌI tệp đổi từ
pin chứ không so phần hồ sơ thật sự đo. Mỗi lần hoá cũ là một làn ghim lại nối đuôi bảy lệnh
suite rồi mọi eval máy: ≈ 15 giờ/tuần phiên thi công đứng chờ trên đường găng PR; mô phỏng trên
lịch sử cho 70/186 làn là thừa (hồ sơ điều tra 02/10). Ô `opportunity.md` đã ký build 03/10 kèm
ngưỡng UAT; thiết kế ở `design_doc`.

Hai món CỘNG, owner phê đích danh ở Cổng Đáng 03/10, cả hai **mặc định TẮT** — kho tự bật:
(b) hoá cũ theo `paths`, dạng BỘ LỌC đặt sau luật cũ (chỉ thu, không nới); (c) suite trong làn
chạy song song, eval vẫn nối đuôi. Việc (a) — thời lượng làn — thuộc ô `lan-ghim-lai-giu-tron-loi-loi`.

Phép thử mọi kho (luật 26/09): kho không có bão ghim (radar, ≈ 1 làn/tuần) không bật khoá thì
không đổi byte nào (AC-1, AC-8); nếu bật, được bớt làn khi diff nằm ngoài phần đo, đổi lại mất
độ chặt ở ca thước/phụ thuộc gián tiếp nằm ngoài `paths` (≈ 4 % ca ở crm, toàn thước). Hành vi
cũ ai dựa: CI trước-merge của mọi kho và chiến dịch ghim lại ở mốc — cả hai giữ nguyên khi khoá
tắt, và chiến dịch có cờ ép luật cũ khi khoá bật (AC-6).

## Ma trận hồ sơ M (12 ô, viết trước — E3/E4/E7/E10 assert ĐÚNG 12)

Mọi ô: khoá `paths`, diff sau pin chạm tệp nêu ở cột Diff. «Cũ» = luật cũ (hoá cũ); «Lọc» = bộ lọc áp (không hoá cũ).

| Ô | Hình dạng hồ sơ | Diff chạm | Kỳ vọng |
|---|---|---|---|
| M1 | mọi eval máy khai `paths` | đúng một tệp trong `paths` | hoá cũ, liệt đúng tệp ấy |
| M2 | như M1 | chỉ tệp ngoài `paths` | Lọc + NOTE |
| M3 | `paths` gồm `_acceptance/config.yaml` + một glob thuộc `t1_skip_globs` | chỉ hai tệp đó | không hoá cũ (luật cũ cũng không) |
| M4 | một eval `test`/`script` thiếu `paths` | ngoài `paths` các eval khác | Cũ |
| M5 | chỉ ô `status: not-run` thiếu `paths` | ngoài `paths` | Lọc |
| M6 | ô `ui-check` có `paths` | chỉ `paths` của ô ui-check | hoá cũ |
| M7 | không có `evals.yaml` | bất kỳ tệp mã | Cũ |
| M8 | `evals.yaml` hỏng cú pháp (code sinh) | bất kỳ tệp mã | Cũ |
| M9 | `paths` viết một dòng `[a, b]` | ngoài `paths` | Lọc |
| M10 | cùng `paths` viết block seq | ngoài `paths` | Lọc |
| M11 | một glob trần trên cùng dòng | ngoài `paths` | Lọc |
| M12 | hợp `paths` RỖNG (không eval nào khai `paths`, không eval máy) | bất kỳ tệp mã | Cũ |

## Criteria

- AC-1: Given một kho fixture code-sinh có hồ sơ đã ký và diff sau pin chạm tệp ngoài `paths`, When `risk_tiers.stale_scope` VẮNG hoặc `all`, Then đầu ra + mã thoát của `pre-merge-check.sh` BẰNG HỆT bản engine trên `main` trước vòng (bản base lấy trọn thư mục `scripts` + `lib` bằng `git archive`) trên CÙNG fixture — vi phân từng byte, cả hai giá trị khoá; chiều đỏ: bản sao đổi mặc định khoá vắng thành `paths` → vi phân khác, thông điệp ghim «đổi mặc định».
- AC-2: Given khoá `paths` và một hồ sơ mọi eval máy khai `paths`, When diff sau pin (a) chạm ĐÚNG MỘT tệp khớp `paths` và (b) chỉ chạm tệp ngoài `paths`, Then (a) vẫn VIOLATION hoá cũ, liệt đúng tệp ấy (độ đặc hiệu: một tệp là đủ) — kể cả tệp tên có dấu mà git in trong ngoặc (`"src/t\303\240i.js"`), danh sách giữ nguyên chữ git in; (b) KHÔNG VIOLATION hoá cũ cho hồ sơ ấy VÀ có một dòng NOTE mang slug hồ sơ, số tệp luật cũ gọi hoá cũ mà bộ lọc bỏ qua theo `paths`, và tối đa 10 tên tệp ấy (dấu đếm ca bỏ lỡ); chiều đỏ trên CÙNG fixture: bản sao gỡ bộ lọc → (b) lại VIOLATION (độ nhạy của ca với bộ lọc), thông điệp ghim «bộ lọc không chạy»; bản sao bỏ dòng NOTE → ĐỎ ghim «bỏ qua im lặng».
- AC-3: Given khoá `paths`, When diff chạm tệp khớp `paths` nhưng luật cũ loại (dưới `_acceptance/`, hoặc khớp `t1_skip_globs`), Then KHÔNG hoá cũ (ô M3) — tập tệp hoá cũ dưới khoá `paths` là TẬP CON của tập dưới luật cũ trên ĐÚNG 12 ô của ma trận M (hằng viết trước; bản sao xoá một ô khỏi bộ sinh → ĐỎ ghim «số ô lệch»); chiều đỏ: bản sao so `paths` với diff THÔ (không qua luật cũ) → hồ sơ khai `paths: [_acceptance/config.yaml]` hoá cũ khi config đổi, thông điệp ghim «nới: tệp ngoài luật cũ».
- AC-4: Given khoá `paths`, When hồ sơ mang các hình dạng M4–M12 của ma trận M, Then đúng cột Kỳ vọng từng ô: eval máy thiếu `paths` (M4), không `evals.yaml` (M7), `evals.yaml` hỏng (M8), hợp `paths` RỖNG (M12) → giữ luật cũ; chỉ ô not-run thiếu `paths` (M5) → lọc; diff chạm `paths` ô ui-check (M6) → VẪN hoá cũ; ba cách viết `paths` (M9–M11) → cùng kết luận; mỗi vế có cặp đỏ riêng trên cùng fixture, thông điệp ghim riêng: bản sao chỉ gom eval máy → M6 im, «im ô ngoài làn máy» · bản sao bỏ vế eval-máy-thiếu → M4 im, «eval máy thiếu paths» · bản sao coi tệp hỏng/hợp rỗng là «không vật nào» → M8/M12 im, «hợp rỗng thành im» · bản sao bỏ ngoại lệ not-run → M5 hoá cũ, «not-run chặn lọc» · bản sao chỉ đọc dạng một dòng → M10 lệch M9, «bộ đọc paths một dạng»; đối chứng dương: cây lành → 9/9 ô đúng kỳ vọng.
- AC-5: Given khoá `paths` bật, When môi trường không chạy được bộ lọc (thiếu `node`, thiếu tệp lib, hàm lib ném lỗi — tiêm từng cái trong bản sao), Then giữ NGUYÊN danh sách luật cũ (VIOLATION như cũ) và in một dòng NOTE nêu bộ lọc không chạy được và vì sao; KHÔNG im, KHÔNG thoát 0 sạch nhờ lỗi; đối chứng dương: môi trường lành → bộ lọc chạy (ca AC-2 (b) im).
- AC-6: Given `risk_tiers.stale_scope` mang giá trị khác `paths`/`all` (vd `path`), When `pre-merge-check.sh` chạy, Then VIOLATION `[config]` gọi tên giá trị và hai giá trị hợp lệ, không âm thầm rơi về luật nào; và Given khoá `paths`, When chạy với cờ `--stale-all`, Then đầu ra BẰNG HỆT khoá vắng trên cùng fixture (cờ chiến dịch ép luật cũ); chiều đỏ: bản sao bỏ qua cờ → vi phân khác, ghim «chiến dịch bị thu hẹp».
- AC-7: Given cùng một diff + cùng `evals.yaml` + khoá `paths`, When hỏi `pre-merge-check.sh` (hoá cũ?) và `repin-lane.mjs --skip-unchanged` (bỏ qua?), Then hai bên cùng kết luận trên ĐÚNG 12 ô ma trận M (round-trip, hằng viết trước); vị từ sống ở MỘT hàm trong `lib/` mà cả hai gọi; chiều đỏ: bản sao cho một bên dùng luật cũ → lệch ở M2, ghim «hai bên lệch»; vế riêng của làn (tệp định nghĩa phép đo đổi → không bỏ qua) giữ nguyên dưới khoá `paths`. **Và bộ lọc tự đứng ở KHO TIÊU THỤ:** dựng kho tiêu thụ fixture bằng CHÍNH lệnh chép của `acceptance-init` (không chép tay), đặt plugin feature-loop ở một thư mục riêng ngoài kho, chạy `pre-merge-check.sh` bản chép và `repin-lane.mjs --skip-unchanged` từ plugin trên ô M2 → cả hai có dấu lọc (NOTE «bỏ qua theo paths» / dòng bỏ qua) và KHÔNG có NOTE «không chạy được»; chiều đỏ: bản sao cho lib nạp một tệp nằm ngoài danh sách chép → ĐỎ ghim «lib không tự đứng ở kho tiêu thụ».
- AC-8: Given một kho fixture có ba lệnh suite giả với thời lượng KHÁC nhau (xong theo thứ tự ngược `suite_keys`) và mã thoát chọn trước, When làn chạy với `feature_loop.repin_parallel_suites` vắng và với `true` trên CÙNG cây, Then mảng `suites_exit`, mã thoát làn, và việc ghi/không ghi dòng repin BẰNG HỆT nhau ở bốn ca (tất xanh · một đỏ · hai đỏ · lệnh trùng gộp một lần); ca `true` tổng thời gian < tổng thời lượng các suite (chứng chạy song song thật, không phải nối đuôi đổi nhãn); khoá vắng thì thứ tự chạy là nối đuôi như cũ; chiều đỏ: bản sao ghi `suites_exit` theo thứ tự xong → lệch, ghim «thứ tự theo lúc xong».
- AC-9: Given khoá song song bật và ≥2 suite đỏ cùng lúc, When làn in lời lỗi, Then lời lỗi mỗi suite đứng thành MỘT khối liền dưới nhãn của suite ấy (không xen dòng giữa hai suite), và suite xanh KHÔNG in khối lời lỗi nào (ca biên không bắn) và eval vẫn chạy NỐI ĐUÔI sau khi mọi suite xong; chụp hồ sơ đã thông cổng vẫn trước suite đầu và sau eval cuối — tiêm một suite ghi vào hồ sơ đã ký → làn đỏ như cũ; chiều đỏ: bản sao in dòng ngay khi nhận → khối xen, ghim «lời lỗi xen».
- AC-10: Given kho KHÔNG bật khoá nào (`stale_scope` vắng, `repin_parallel_suites` vắng), When `repin-lane.mjs` chạy (`--skip-unchanged` và làn đủ `--write`) trên 12 ô ma trận M, Then stdout, stderr (bỏ dấu thời gian và giây) và dòng run-log BẰNG HỆT bản base (lấy trọn `scripts` + `lib` + `feature-loop/scripts` bằng `git archive` tại merge-base) — gồm cả `evals_not_machine_touched` sau khi bộ đọc `paths` dời về lib; và khi lib của vị từ vắng hoặc ném lỗi: khoá vắng → làn chạy y như base (vị từ mới KHÔNG nằm trong danh sách bắt buộc của cổng bộ máy khi khoá vắng); khoá `paths` → KHÔNG bỏ qua, in một dòng gọi tên lý do; chiều đỏ: bản sao thêm vị từ vào danh sách bắt buộc vô điều kiện → làn khoá vắng thoát 2 trên lib cũ, ghim «khoá vắng mà đòi lib mới».

## Coverage

- Quét bằng `morphological-scan` (preset test-matrix + risk-premortem). Chân sản phẩm: mã engine `scripts/pre-merge-check.sh`, `feature-loop/scripts/repin-lane.mjs` [SUY-TỪ-REPO]; số crm [SUY-TỪ-REPO: docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md].
- Chân ngành: chọn việc theo thay đổi kiểu Nx `affected` / Turborepo `--affected` [NGÀNH: Nx, Turborepo] — cả hai đi theo ĐỒ THỊ phụ thuộc; luật theo glob `paths` ở đây không thấy phụ thuộc gián tiếp.

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Khoá (b) | vắng · `all` · `paths` · sai chính tả · cờ `--stale-all` | nếp `gap_probe:` cùng tệp |
| B. Hình dạng hồ sơ | mọi eval máy có `paths` · eval máy thiếu `paths` · chỉ ô not-run thiếu · ô ui-check có `paths` · không `evals.yaml` · ba cách viết `paths` | 1 774 eval máy crm, 95 % khai `paths` |
| C. Diff so pin | một tệp trong `paths` · chỉ ngoài `paths` · trong `paths` mà luật cũ loại | luật `stale_files` |
| D. Bên hỏi / môi trường | pre-merge PR · pre-merge chiến dịch · làn `--skip-unchanged` · thiếu node/lib | sổ bàn giao mốc 2.20 bước 8 |
| E. Khoá (c) × kết cục suite | vắng/true × tất xanh · một đỏ · hai đỏ · lệnh trùng | `suites_exit` của dòng repin |

- Core → AC-1…AC-10 (ma trận M liệt ô trục B × C).
- Later: chọn việc theo đồ thị phụ thuộc [NGÀNH: Nx, Turborepo] — máy hiểu mã theo ngôn ngữ, ngoài engine · thời gian chờ tối đa cho từng suite song song — làn hôm nay cũng không có, mở khi có ca treo thật.
- Never: chạy eval song song — eval của nhiều hồ sơ chung tài nguyên kho, và hạt giống đã khoanh phần cố định là suite.
- `[GIẢ ĐỊNH]` chờ gạch ở Cổng Phạm vi: suite crm chạy song song cho cùng mã thoát như nối đuôi (giả định 3 của ô) — bộ răng chứng trên suite giả; trên crm chỉ đo được khi crm thử bật.

## Đường đo

- Làn/tuần ở crm: đếm dòng `kind: repin` theo tuần trong `_acceptance/*/run-log.jsonl` (vật đã có) · trước/sau ngày crm bật khoá.
- `wall_s` p50: khoá của dòng repin do ô `lan-ghim-lai-giu-tron-loi-loi` thêm — không thuộc vòng này.
- Ca bỏ lỡ: KHÔNG dựa vào log CI (hết hạn). Vị từ là hàm thuần của (diff, `evals.yaml`) nên tính lại được trên lịch sử git bất kỳ lúc nào: với mỗi hồ sơ đỏ ở làn chiến dịch mốc (chạy `--stale-all`, AC-6; dấu lượt đỏ bền do ô `lan-ghim-lai-giu-tron-loi-loi` ghi vào run-log), gọi hàm lib trên (pin trước của hồ sơ, base chiến dịch): luật cũ hoá cũ ∧ khoá `paths` lọc hết → một ca bỏ lỡ; xem tệp đỏ nằm ở mã sản phẩm hay thước. Dòng NOTE mang slug (AC-2) là dấu phụ cho người đọc CI, không phải nguồn đếm.
- Mã thoát song song ≠ nối đuôi: trước khi bật, AC-8 trên suite giả + phép thử trên crm (giả định 3). **Sau khi bật: giới hạn khai** — không còn lượt nối đuôi để so; dấu đọc được là làn song song đỏ (dấu lượt đỏ) mà chạy lại nối đuôi cùng sha thì xanh. Ngưỡng: ≥1 ca như vậy → tắt khoá ở crm và mở hạt giống.

## Out of scope

- «Chỉ chặn hoá cũ ở mốc» — cắt ở hạt giống: dời 14 % ca bắt được tới mốc, đổi mặc định mọi kho.
- «Cache suite theo sha» — 180/186 làn ở sha riêng.
- Bên đọc pin (`checkRepinEvals`, ADR 0014) — hồ sơ đã hoá cũ vẫn ghim bằng làn eval.
- Chạy eval song song.
- Bật khoá ở bất kỳ kho nào, kể cả kit — là việc của từng kho sau khi mốc được nhận.
- Hợp nhất bộ đọc `paths` của `carry-plan.mjs` (đường verdict S4).
- Thời lượng làn (`wall_s`) — ô `lan-ghim-lai-giu-tron-loi-loi`.

## Notes

- Khuôn chiều đỏ (owner chọn «đổi khuôn» 03/10 ở dừng-vá lượt 2): mọi phép phá trong bộ răng đi qua `rang/chieu-do.mjs` — chỉ tính «đã bắt» khi có dấu dương bản sao đã chạy tới hồ sơ.

- Giới hạn khai: phụ thuộc gián tiếp ngoài `paths` không làm hồ sơ hoá cũ; glob hẹp đổi thành bớt ghim (khuyến khích ngược). Lưới: chiến dịch mốc (AC-6). Ngưỡng: ≥1 ca bỏ lỡ chạm mã sản phẩm = dòng CHẾT của ngưỡng UAT.
- Thứ tự với ô `lan-ghim-lai-giu-tron-loi-loi`: cùng tệp `repin-lane.mjs` (hàm `runCmd`). Phần code của vòng này (S3) chỉ bắt đầu sau khi ô ấy gộp.
