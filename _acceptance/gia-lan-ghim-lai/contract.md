---
schema_version: 1
feature: Giá làn ghim lại — tệp test chỉ làm hoá cũ hồ sơ gọi tên nó, chạy lại lệnh đỏ một lần, trần mỗi lượt, suite ở môi trường giống CI, carry kết quả eval theo băm đầu vào (mọi điểm kho tự bật)
slug: gia-lan-ghim-lai
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh + lib/** (t3_paths)
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md
---

# Acceptance Contract: gia-lan-ghim-lai

Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop (PR phanlemanh/crm-onehub#277), cùng đợt với
crm-onehub/_acceptance/eval-model-that-dung-luc và crm-onehub/_acceptance/ca-chap-chon-cach-ly.

## Context

Đêm 05–06/10 ở crm, PR R1g (phanlemanh/crm-onehub#276) đi từ ký Cổng 2 tới gộp mất ~17 giờ, ~14
giờ là làn ghim lại: một lượt bị công cụ ngắt ở trần 90 phút không để vết, bốn lượt dài ~3–4 giờ.
Lượt dài 3 sinh ra chỉ vì bốn dòng của một tệp test; lượt 3 đỏ vì một ca chập chờn; lỗi thật duy
nhất do CI bắt vì làn chạy với `.env` có khoá; Gateway 43,91 → 32,51 USD phần lớn do eval gọi model
thật chạy lại với đầu vào không đổi. Owner duyệt thiết kế năm điểm 06/10 (design doc), Đ3 chế độ
THAY, thứ tự thi công Đ1 → Đ4 → Đ5 → Đ3 → Đ2.

Số nền đo trên crm 22/09 → 06/10 (design doc §1): 174 làn xanh (~12/ngày); 12/203 cặp ghim lại
chỉ đổi tệp test; 1 726/2 912 lần chạy eval có `paths` không bị diff chạm; 434/441 eval có lệnh
nạp một tệp test mà `paths` không liệt — gần hết là tệp nạp trước dùng chung (`setup-dom.ts`).

Phép thử mọi kho (luật 26/09): mỗi điểm sau một khoá config; khoá vắng = hành vi trước vòng từng
byte, TRỪ ba phần chỉ-thêm của Đ5 bật mặc định và kê đích danh ở AC-3 (tổng kết cuối lượt, dòng
dấu khi bị ngắt, chạy lệnh trong nhóm riêng + giết cả cây). Kho không có bão ghim (radar,
oneflow…) chỉ nhận thêm một dòng tổng kết; kho bật khoá được bớt lượt, đổi lại nhận các giới hạn
khai ở Notes. Hành vi cũ ai dựa: CI trước-merge của mọi kho (bộ đọc vendored trước vòng phải đọc
được dòng mới — AC-3, AC-10), làn con lồng trong eval của kho (E11 crm gọi chính `repin-lane.mjs`
— AC-5), và chiến dịch ghim lại ở mốc (cờ `--stale-all` ép luật cũ — AC-2).

Từ ngữ: **thước** = tệp khớp `risk_tiers.test_globs`; **gọi tên** = định nghĩa ở AC-1;
**carry** = nghĩa trong `CONTEXT.md` (mang kết quả của lượt chạy thật sang lượt sau khi phần được
đo không đổi — minh bạch, không phải «cache»); **BASE-GIA** = `bf79fdb11fe6e69b12efa1b4c9c7cf40fbb36e1d`
(engine trước vòng); **SAU-GIA** = commit mới nhất có `(gia-lan-ghim-lai)` trong thông điệp và
chạm `scripts/`, `lib/` hoặc `feature-loop/scripts/` (engine của vòng, cố định sau khi gộp).

## Criteria

- AC-1: Given kho khai `risk_tiers.test_globs` và hồ sơ P nằm trong phạm vi soi hoá cũ, When một tệp thước đổi sau `verified_commit` của P mà P KHÔNG gọi tên nó, Then `pre-merge-check.sh` KHÔNG báo P hoá cũ vì tệp đó và in MỘT dòng NOTE mang slug P, số tệp thước bỏ qua và tối đa 10 tên; `repin-lane.mjs --skip-unchanged` cùng kết luận (bỏ qua). P **gọi tên** tệp f khi (a) một mục `paths` của một eval của P khớp f VÀ chuỗi glob của mục đó tự khớp `test_globs` (glob nhắm vào thước; glob phủ rộng như `app/**` KHÔNG gọi tên), hoặc (b) lệnh đã giải (`config:` → `config.yaml`) của một eval của P chứa một token đường dẫn GIẢI CHÍNH XÁC ra f: đường tương đối giải theo các `cd` đứng trước nó trong cùng lệnh (tính cả `../`), nhận `--cờ=đường` và `--cờ đường`, token trỏ thư mục gọi tên mọi tệp dưới nó, token glob khớp theo glob; bỏ qua đường tuyệt đối, gán biến, cờ, từ trần và đường dưới `.acceptance-runs/`; không khớp lỏng theo hậu tố. Lệnh KHÔNG GIẢI ĐƯỢC (biến, `$(…)`/backtick, `cd` tới đường không giải được, token dạng đường trong kho không trỏ tệp/thư mục đang theo dõi nào) → P giữ MỌI tệp thước (fail-closed) và NOTE gọi tên token. Định nghĩa sống ở MỘT khối marker trong `lib/evidence-core.cjs`, không nạp gì ngoài lớp CI vendored; cả hai bên gọi nó. Chiều đỏ trên CÙNG fixture: bản sao gỡ bộ lọc thước → P hoá cũ, ghim «thước không gọi tên vẫn làm hoá cũ»; bản sao bỏ dòng NOTE → ghim «bỏ thước im lặng».
- AC-2: Given `test_globs` khai (mặc định ma trận: `["**/*.spec.ts"]`; ô ghi khác thì theo ô), When hồ sơ mang các ô của ma trận T, Then đúng cột Kỳ vọng ở cả `pre-merge-check.sh` và `repin-lane.mjs --skip-unchanged` (round-trip, ĐÚNG 22 ô viết trước — bộ sinh đếm lệch là ĐỎ «số ô lệch»); bộ lọc chỉ BỚT tệp (tập hoá cũ dưới khoá ⊆ tập luật cũ trên cả 22 ô); và CÙNG 22 ô chạy trên một kho chỉ có lớp CI vendored (danh sách tệp rút từ marker chép của `commands/acceptance-init.md`, không chép tay, không có `feature-loop/`) ra cùng kết luận ở `pre-merge-check.sh`. Mỗi vế có cặp đỏ trên cùng fixture, thông điệp ghim riêng: bỏ vế lệnh → T4/T5/T7 im, «lệnh gọi tên bị bỏ» · không giải `config:` → T7 im, «không giải config» · khớp theo hậu tố → T6 hoá cũ, «khớp theo hậu tố» · coi glob rộng là gọi tên → T3 hoá cũ, «glob rộng thành gọi tên» · coi lệnh không giải được là không gọi tên → T19/T20 im, «lệnh không giải được thành im» · nuốt lỗi đọc → T9/T10 im, «lỗi thành im» · bỏ qua `--stale-all` → T12 im, «chiến dịch bị thu hẹp» · lib nạp tệp ngoài danh sách chép → vế kho tiêu thụ lệch, «lib không tự đứng ở kho tiêu thụ».

  | Ô | Hồ sơ P | Diff sau pin | Kỳ vọng |
  |---|---|---|---|
  | T1 | `paths` liệt đúng `app/test/a.spec.ts` | đổi đúng tệp đó | hoá cũ, liệt tệp ấy |
  | T2 | `paths` là glob thước `app/test/*.spec.ts` | đổi `app/test/a.spec.ts` | hoá cũ |
  | T3 | `paths` chỉ `app/**` (glob rộng) | đổi `app/test/a.spec.ts` | không hoá cũ + NOTE |
  | T4 | như T3, lệnh `cd app && runner test/a.spec.ts` | như T3 | hoá cũ |
  | T5 | như T3, lệnh `cd app/sub && runner --preload=../test/setup.ts`; `test_globs` gồm `**/test/**` | đổi `app/test/setup.ts` | hoá cũ |
  | T6 | như T5 | đổi `lib/test/setup.ts` (cùng hậu tố, khác tệp) | không hoá cũ + NOTE |
  | T7 | như T3, lệnh `config:executors.test.x` giải ra lệnh của T4 | như T3 | hoá cũ |
  | T8 | như T3 | đổi tệp sản phẩm `app/src/x.ts` | hoá cũ (luật cũ nguyên) |
  | T9 | như T7 nhưng khoá `config:` không giải được | như T3 | hoá cũ + NOTE «bộ lọc thước không áp» kèm lý do |
  | T10 | không có `evals.yaml` | như T3 | hoá cũ + NOTE lý do |
  | T11 | `paths` liệt `app/test/tài.spec.ts` (git in trong ngoặc) | đổi đúng tệp đó | hoá cũ, danh sách giữ nguyên chữ git in |
  | T12 | như T3, chạy với `--stale-all` | như T3 | hoá cũ (luật cũ) |
  | T13 | như T3, khoá `test_globs` VẮNG | như T3 | hoá cũ (luật cũ) |
  | T14 | như T3 | đổi `app/test/a.spec.ts` VÀ `app/src/x.ts` | hoá cũ, chỉ liệt `app/src/x.ts` + NOTE |
  | T15 | như T3, thêm `risk_tiers.stale_scope: paths` | như T3 | không hoá cũ (hai bộ lọc nối nhau) |
  | T16 | như T3, lệnh `cd app && runner 'test/*.spec.ts'` | như T3 | hoá cũ |
  | T17 | `paths` `app/test/**`; `test_globs` chỉ `**/*.spec.ts` | như T3 | không hoá cũ + NOTE (dưới cách khai này glob thư mục là glob rộng) |
  | T18 | `paths` `app/test/**`; `test_globs` gồm `**/test/**` | như T3 | hoá cũ |
  | T19 | như T3, lệnh `cd "$APP" && runner test/a.spec.ts` | như T3 | hoá cũ + NOTE «lệnh không giải được» gọi tên `$APP` |
  | T20 | như T3, lệnh `cd app && runner test/khong-co.spec.ts` (không trỏ tệp theo dõi nào) | như T3 | hoá cũ + NOTE «lệnh không giải được» gọi tên token |
  | T21 | lệnh crm NGUYÊN VĂN `bun run test -- "cd apps/agent && bun test test/zalo-va.integration.spec.ts -t nang-luc"`, `paths` `apps/**` | đổi `apps/agent/test/zalo-va.integration.spec.ts` | hoá cũ |
  | T22 | lệnh crm NGUYÊN VĂN `cd apps/app && bun test --preload ../../packages/ui/test/setup-dom.ts ./test/tai-lieu-soan.dom.tsx -t chua-doi`, `paths` `apps/**`; `test_globs` gồm `**/test/**` | đổi `packages/ui/test/setup-dom.ts` | hoá cũ |

- AC-3: Given kho KHÔNG khai khoá mới nào (`risk_tiers.test_globs`, `feature_loop.repin_retry`, `feature_loop.model_evals`, `feature_loop.repin_budget_min`, `feature_loop.repin_cost_cmd`, `feature_loop.repin_ci_blank_env`, `feature_loop.repin_carry`, `feature_loop.repin_carry_env`), When `pre-merge-check.sh` và `repin-lane.mjs` (`--skip-unchanged`, `--write` xanh, `--write` đỏ, và bị SIGTERM giữa lệnh) chạy trên fixture của AC-1…AC-11 đã gỡ khoá, Then sau khi gỡ ĐÚNG các phần thêm bật mặc định đã kê — dòng stderr cuối `[lane] TỔNG KẾT …`, khoá `tong_ket` ở JSON stdout và ở dòng `repin`/`repin-do`, dòng `repin-do` `ly_do: "bi-ngat"` của ca bị ngắt — thì stdout, mã thoát, dòng run-log và section Re-pin của engine SAU-GIA BẰNG HỆT engine BASE-GIA trên cùng fixture (cả hai lấy bằng `git archive <sha> scripts lib feature-loop/scripts`, không chép danh sách tay; chỉ chuẩn hoá `run_id`, `ts`, `wall_s` và số giây trong dòng stderr của làn); bộ đọc của BASE-GIA đọc một dòng `repin` có `tong_ket` → sạch; làn khoá vắng chạy được với `--ag-root` = bộ máy BASE-GIA, còn khoá `test_globs` bật trên bộ máy đó → thoát 2 gọi tên hàm thiếu và mốc cần. So SAU-GIA chứ không so HEAD, để phép vi phân không tự hết hạn khi kit đi tiếp. Chiều đỏ: mỗi bản sao đổi mặc định MỘT khoá thành bật → vi phân khác, ghim «đổi mặc định: <khoá>»; bản sao thêm một dòng hay khoá ngoài danh sách đã kê → «thêm ngoài danh sách»; bản sao đòi hàm mới vô điều kiện → khoá vắng thoát 2 trên bộ máy cũ, «khoá vắng mà đòi lib mới».
- AC-4: Given `feature_loop.repin_retry: 1`, When một lệnh (suite hay eval máy) lệch kỳ vọng ở lần chạy đầu, Then làn chạy lại ĐÚNG lệnh đó MỘT lần, một mình, SAU khi khối suite song song (nếu bật) đã xong hết; lần hai đạt → lệnh tính đạt và dòng `repin` mang `chap_chon: [{lenh, nhan, lan_dau, log, ca}]` (`log` = nhật ký TRỌN của lần đỏ, tệp tồn tại; `ca` = tên ca rút từ nhật ký đó theo năm khuôn bun `(fail) …`, vitest/jest `✗`/`×`, playwright `✘`, node:test `not ok N - …`, tối đa 10, rút rỗng thì `["không rút được tên ca"]`), section Re-pin thêm hậu tố «chập chờn (đỏ lần đầu, đạt khi chạy lại): …»; lần hai lệch → làn đỏ như cũ, giữ nhật ký CẢ HAI lần, mục `lenh_do` của dòng `repin-do` mang `lan_thu_lai`. KHÔNG chạy lại khi: eval có tên `<slug>/<Eid>` trong `feature_loop.model_evals` (lệnh dùng chung với một eval model thật cũng không) · lần đầu dài hơn 30 phút · trần còn lại (AC-5) ít hơn thời lượng lần đầu · khoá vắng/0. Giá trị khoá ngoài `0 | 1` → thoát 2 gọi tên khoá và hai giá trị hợp lệ. Bảng quyết định chạy lại là hàm thuần có bảng chân trị viết trước. Chiều đỏ: bản sao tính lần hai đỏ là đạt → ghim «lần hai đỏ vẫn tính đạt»; bản sao chạy lại eval model thật → «chạy lại eval model thật»; bản sao bỏ `chap_chon` → «chập chờn im»; bản sao chạy lại xen trong khối song song → «chạy lại dưới tải».
- AC-5: Given trần N phút (`--tran-phut N` thắng `feature_loop.repin_budget_min`; N thập phân > 0; đồng hồ tính từ lúc làn khởi động), When tổng thời gian làn chạm N giữa một lệnh, Then làn DỪNG LỆNH bằng cách thu danh sách MỌI hậu duệ của lệnh theo `ppid` cộng nhóm tiến trình của nó TRƯỚC khi gửi tín hiệu nào, gửi SIGTERM cho cả danh sách và SIGKILL sau 10 giây cho mọi pid trong danh sách còn sống; không chạy lệnh nào nữa; thoát **4**; không ghi pin (`verified_commit` và báo cáo giữ nguyên); với `--write` mỗi slug nhận MỘT dòng `repin-do` mang `ly_do: "vuot-tran"`, `tran_phut`, `da_chay_phut`, `chua_chay: [nhãn lệnh]`. Ô (trần của ca đặt rộng so với thời gian khởi động làn; lệnh ghi pid của cháu TRƯỚC khi trần chạm — dấu dương, vắng tệp pid là ĐỎ «cháu chưa kịp sinh» chứ không phải xanh): B1 cháu thường → làn thoát 4 trong N + 15 s, pid cháu đã chết · B2 cháu BẪY SIGTERM → chết sau SIGKILL, trong N + 10 + 15 s · B3 làn LỒNG hai tầng (lệnh của làn ngoài là một `repin-lane` khác có trần rộng hơn, lệnh của làn trong sinh cháu bẫy SIGTERM) → sau khi làn ngoài thoát 4, mọi pid đã ghi ở cả hai tầng đều chết · B4 `--write` → dòng `repin-do` đủ trường · B5 khoá thay cờ cho cùng kết quả, cờ thắng khoá · B6 trần vắng → lệnh dài chạy hết, xanh · B7 cờ `0`/chữ → thoát 3, khoá sai → thoát 2. Chiều đỏ: bản sao chỉ giết pid của `bash` → B1 cháu sống, ghim «cháu tiến trình sót»; bản sao bỏ SIGKILL → B2 cháu sống, «không SIGKILL»; bản sao chỉ giết theo nhóm → B3 cháu tầng trong sống, «làn lồng sót cháu»; bản sao thoát 1 → «trùng mã làn đỏ»; bản sao ghi pin khi vượt trần → «pin trên làn chưa xong».
- AC-6: Given làn đang chạy một lệnh có tiến trình cháu (đã ghi pid), When làn nhận SIGTERM, SIGINT hoặc SIGHUP (3 ô), Then làn dừng lệnh theo đúng cách của AC-5 (thu cây trước, SIGTERM rồi SIGKILL), thoát 128 + số hiệu tín hiệu (143 · 130 · 129), pid cháu đã chết; với `--write` mỗi slug nhận một dòng `repin-do` mang `ly_do: "bi-ngat"`, `tin_hieu`, `chua_chay`; không `--write` thì cây git không có tệp theo dõi nào đổi. Phần này BẬT MẶC ĐỊNH (không sau khoá — kê ở AC-3). Chiều đỏ: bản sao bỏ bộ bắt tín hiệu → không dòng `bi-ngat`, ghim «ngắt không để vết».
- AC-7: Given mọi kết cục làn (xanh · đỏ · vượt trần · bị ngắt), When làn kết thúc, Then dòng stderr CUỐI bắt đầu `[lane] TỔNG KẾT` và nêu: kết cục, phút, số lệnh thực chạy, «eval model thật: gọi n, carry m» (n = số lần thực chạy một lệnh thuộc eval có tên trong `model_evals`; m = số eval model thật được carry ở AC-9), «chập chờn: k», và — khi kho khai `feature_loop.repin_cost_cmd` (lệnh in MỘT số tăng theo chi tiêu) — «chi phí đo: <sau − trước> (chênh trong khoảng làn chạy, gồm mọi phiên chạy cùng lúc)»; cùng các số đó nằm ở khoá `tong_ket` của JSON stdout, của dòng `repin` (xanh) và của dòng `repin-do` (đỏ · vượt trần · bị ngắt, khi `--write`). Phần này BẬT MẶC ĐỊNH (kê ở AC-3). Đo bằng quan hệ: fixture có hai eval model thật, mỗi lần chạy cộng 1 vào bộ đếm chi tiêu ngoài kho mà lệnh đo chi phí đọc → `n` và «chi phí đo» đều bằng số lần các eval đó thực chạy. Lệnh đo chi phí lỗi hoặc không in số → «chi phí đo: lỗi (<lý do>)», kết cục làn không đổi. Chiều đỏ: bản sao đếm `n` theo eval thay vì theo lần chạy thật → ghim «đếm model sai»; bản sao bỏ tổng kết ở làn đỏ → «tổng kết vắng ở làn đỏ».
- AC-8: Given `feature_loop.repin_ci_blank_env: [K, …]`, When làn chạy suite, Then mỗi lệnh suite chạy với từng tên K đặt **rỗng tường minh** (thắng giá trị trong `.env` của bộ nạp `node --env-file`; đặt rỗng chứ không xoá biến — đo 06/10: xoá thì bộ nạp điền lại từ `.env`), eval chạy với env đầy đủ của tiến trình; một eval có lệnh trùng nguyên văn một suite vẫn chạy riêng (không gộp kết quả hai môi trường); dòng `repin` mang `suites_env: "ci"` và section thêm hậu tố «suite chạy ở môi trường giống CI (biến rỗng: K…)»; suite đỏ ở env này → làn đỏ, dòng stderr của làn và mục `lenh_do` gọi «môi trường giống CI (biến rỗng: K…)»; chạy lại (AC-4) dùng cùng env. Tên biến không hợp lệ → thoát 2. Đối chứng: khoá vắng → cùng suite xanh với K từ env tiến trình. Chiều đỏ: bản sao xoá biến thay vì đặt rỗng → suite xanh, ghim «xoá biến thay vì rỗng»; bản sao áp env CI cho eval → eval đỏ, «env CI tràn sang eval»; bản sao gộp lệnh khác env → eval không chạy riêng, «gộp lệnh khác env».
- AC-9: Given `feature_loop.repin_carry: paths` (và `feature_loop.repin_carry_env` tuỳ chọn), When làn ghim lại một hồ sơ, Then mỗi eval máy CÓ `paths` và lệnh giải được trọn (AC-1) được carry — không chạy, mang mã thoát của lượt nguồn — khi và chỉ khi băm đầu vào BẰNG băm của một dòng `repin` xanh trong run-log của CHÍNH hồ sơ mà eval đó CHẠY THẬT, ts dòng nguồn cách giờ chạy làn ≤ 7 ngày, và cặp (eval, băm) chưa từng nằm trong `carry_lech` (AC-11). Băm đầu vào = khối eval trong `evals.yaml` + lệnh đã giải + danh sách `đường⇥blob` tại `sha` của làn của (tệp git-theo-dõi khớp `paths`) HỢP (mọi tệp lệnh đã giải gọi tên, rút bằng CHÍNH hàm gọi-tên của AC-1) + băm của `TÊN=giá trị` cho mỗi tên khai (giá trị env không bao giờ ghi ra). Dòng mới ghi `evals_hash` cho mọi eval máy đủ điều kiện và `evals_carry: {Eid: <run_id nơi nó chạy thật>}` (chuỗi carry dàn phẳng). Suite KHÔNG BAO GIỜ carry. Ma trận C (ĐÚNG 15 ô viết trước, đếm lần chạy bằng dấu vết ngoài kho; lượt nguồn do writer THẬT ghi): C1 tệp trong `paths` đổi → chạy · C2 chỉ tệp ngoài `paths` và ngoài mọi tệp lệnh gọi tên đổi → carry · C3 khối eval trong `evals.yaml` đổi → chạy · C4 lệnh trong `config.yaml` đổi → chạy · C5 giá trị env khai đổi → chạy · C6 env KHÔNG khai đổi → carry (giới hạn khai) · C7 nguồn quá 7 ngày → chạy · C8 `--allow-dirty` → chạy hết · C9 eval không `paths` → chạy · C10 khoá vắng → chạy hết · C11 lượt thứ ba cùng đầu vào → `evals_carry` trỏ lượt 1 (chạy thật), không trỏ lượt 2 · C12 tệp `_acceptance/<slug>/rang/x.mjs` lệnh gọi tên đổi (ngoài `paths`) → chạy · C13 suite chạy ở cả ba lượt · C14 tệp setup NGOÀI `paths` và ngoài `_acceptance/`, lệnh nạp bằng `--preload=../../…`, đổi → chạy · C15 lệnh có biến (`$APP`) → luôn chạy, không có khoá `evals_hash` cho eval đó. Section Re-pin thêm hậu tố «carry (đầu vào không đổi, ≤ 7 ngày): E… ← <run_id>». Giá trị khoá ngoài `paths` → thoát 2. Chiều đỏ: bản sao băm bỏ vế tệp → C1 carry, ghim «băm bỏ vế tệp» · băm chỉ lấy tệp `_acceptance/` lệnh gọi tên → C14 carry, «băm bỏ tệp lệnh gọi tên» · bỏ vế env → C5 carry, «băm bỏ vế env» · bỏ hạn 7 ngày → C7 carry, «quá hạn vẫn carry» · không dàn phẳng → C11 trỏ lượt 2, «chuỗi carry không dàn phẳng» · carry cả suite → C13 hụt, «carry suite».
- AC-10: Given dòng `repin` chống lưng `verified_commit` mang `evals_carry`, When `pre-merge-check.sh` và `recheck-evidence.cjs` đọc hồ sơ, Then mỗi id trong `evals_carry` phải có dòng nguồn trong run-log của chính hồ sơ: `kind: repin` (dòng `repin-do` không phải nguồn), `run_id` khớp, đã chạy thật id đó (id không nằm trong `evals_carry` của dòng nguồn), cùng `evals_hash[id]`, cùng `evals_exit[id]`, ts dòng nguồn cách ts DÒNG CHỐNG LƯNG ≤ 7 ngày (so hai dòng với nhau, KHÔNG so giờ hiện tại), và dòng chống lưng có `evals_hash[id]`; ma trận D (ĐÚNG 10 ô viết trước; D1 do writer THẬT ghi, các ô khác là bản biến đổi code-sinh của chính dòng đó): D1 hợp lệ → sạch · D2 nguồn vắng · D3 nguồn đã carry chính id · D4 băm lệch · D5 mã lệch · D6 nguồn cách dòng chống lưng 8 ngày · D7 thiếu băm · D8 nguồn là `repin-do` → mỗi ô D2–D8 một VIOLATION ở CẢ HAI bên đọc gọi tên id và lý do ghim («nguồn vắng» · «nguồn không chạy thật» · «băm lệch nguồn» · «mã thoát lệch nguồn» · «nguồn quá 7 ngày» · «thiếu băm» · «nguồn không phải pin xanh») · D9 bộ đọc BASE-GIA đọc dòng D1 → sạch (đường đọc-cũ) · D10 cả hai dòng của D1 lùi 30 ngày, cách nhau 1 ngày → sạch; và D1–D10 chạy trên kho chỉ có lớp CI vendored (như AC-2) ra cùng kết luận. Luật sống ở MỘT hàm trong `lib/evidence-core.cjs` mà cả hai bên đọc gọi. Chiều đỏ: bản sao bỏ lời gọi luật carry → D2–D8 sạch, ghim «bên đọc bỏ qua carry»; bản sao so tuổi với giờ hiện tại → D10 VIOLATION, «so tuổi với giờ hiện tại».
- AC-11: Given khoá carry bật, When một eval CHẠY THẬT có băm bằng băm của một lượt nguồn xanh mà mã thoát KHÁC mã của lượt đó (đầu vào khai không đủ, hoặc chập chờn), Then dòng của lượt này (`repin` nếu làn xanh, `repin-do` nếu đỏ) ghi `carry_lech: [{id, bam}]`, tổng kết in «carry lệch: <id>», và lượt sau KHÔNG carry cặp (id, băm) đó dù còn nguồn xanh ≤ 7 ngày; băm đổi → carry trở lại bình thường. Ô: L1 lệch được ghi · L2 lượt sau chạy thật · L3 băm đổi → carry lại. Chiều đỏ: bản sao không đọc `carry_lech` → L2 carry, ghim «carry lệch vẫn carry».
- AC-12: Given writer thật của làn chạy trên fixture bật mọi khoá, When rút các khoá của dòng `repin`/`repin-do` nó ghi, Then mọi khoá có mặt trong khuôn `REPIN-TEMPLATE` của SKILL feature-loop theo ĐÚNG thứ tự writer ghi, và văn bản nghi thức re-pin của SKILL nêu mã thoát 4 cùng hai `ly_do` (`vuot-tran`, `bi-ngat`); danh sách khoá config của làn rút từ MỘT khối marker trong `repin-lane.mjs` (nguồn duy nhất) và mỗi khoá có một dòng trong GUIDE §7.1 — ca rút kỳ vọng từ vật, rút rỗng là ĐỎ «rút rỗng». Chiều đỏ: bản sao writer thêm một khoá mới không có trong khuôn → ghim «khoá ngoài khuôn»; bản sao bỏ một khoá khỏi GUIDE → «khoá chưa khai ở GUIDE».
- AC-13: Given năm điểm đã dựng, When chạy `_acceptance/gia-lan-ghim-lai/rang/so-do.mjs` (fixture code-sinh, mỗi điểm chạy khoá vắng rồi khoá bật trên CÙNG cây), Then nó in bảng năm hàng trước → sau: Đ1 số hồ sơ hoá cũ · Đ4 kết cục làn có một lệnh chập chờn · Đ5 giây tới khi làn dừng với một lệnh treo · Đ3 số lỗi chỉ-CI làn bắt được · Đ2 số lần thực chạy eval ở lượt ghim thứ hai — và thoát 0 khi và chỉ khi MỌI hàng đi đúng chiều đã hứa (2 → 1 · đỏ → xanh · ≥ thời lượng lệnh treo → ≤ trần + 15 s · 0 → 1 · tổng số eval → chỉ eval có đầu vào chạm diff). Chiều đỏ: bản sao tắt MỘT điểm → hàng đó không đổi, thoát 1, ghim «Đx không đổi số».

## Coverage

- Quét bằng `morphological-scan` (preset test-matrix + risk-premortem). Chân sản phẩm: kit là engine, người dùng là phiên Claude Code và qua nó là owner [SUY-TỪ-REPO: CLAUDE.md, khối ĐỊNH VỊ]; mã `feature-loop/scripts/repin-lane.mjs`, `scripts/pre-merge-check.sh`, `lib/evidence-core.cjs` [SUY-TỪ-REPO]; số crm [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md §1].
- Chân ngành: [NGÀNH: Playwright `retries` + nhãn «flaky»] và [NGÀNH: Bazel `--flaky_test_attempts`] — chạy lại và gọi tên ca chập chờn tách khỏi ca đỏ (Đ4) · [NGÀNH: Turborepo — băm tác vụ từ `inputs` + biến `env` khai trong turbo.json; biến không khai không vào băm] (Đ2, cùng giới hạn C6) · [NGÀNH: Nx affected / Jest `--findRelatedTests`] — chọn theo đồ thị phụ thuộc; ở đây dùng tên gọi trong `paths`/lệnh, không đồ thị (Đ1) · [NGÀNH: GitHub Actions `timeout-minutes` + huỷ cả cây tiến trình] (Đ5) · [NGÀNH: GitHub Actions — biểu thức trỏ secret chưa khai cho chuỗi rỗng] (Đ3: rỗng tường minh ≈ CI).

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Điểm | Đ1 · Đ4 · Đ5 · Đ3 · Đ2 | design doc đã duyệt 06/10 |
| B. Khoá | vắng (= trước vòng, trừ phần chỉ-thêm đã kê) · bật hợp lệ · giá trị sai | luật «cân trên mọi kho» 26/09; nếp `stale_scope` (giá trị lạ → VIOLATION/thoát 2) |
| C. Kết cục phép đo | chiều đỏ (vật/thước đổi, lệnh đỏ thật, vượt trần, đỏ chỉ ở env CI, đầu vào đổi) · chiều im (thước không gọi tên, chập chờn, đầu vào không đổi) · hạ tầng hỏng (lib cũ, config/lệnh không giải, tín hiệu ngắt, làn lồng) | sổ đêm 05–06/10 crm (LUAT.md); phản biện 06/10 |
| D. Bên gọi / bên đọc | pre-merge PR · pre-merge `--stale-all` · làn `--skip-unchanged` · làn `--write` + recheck tự kiểm · bộ đọc trước vòng vendored · kho chỉ có lớp CI vendored · làn con lồng trong eval | sổ bàn giao mốc; `rang/ho-so-cham.mjs` crm |

- Core → AC-1…AC-13. Cross-cutting áp mọi ô Core: tên tệp có dấu (git quotepath), gốc làn là thư mục con của kho git, lệnh trùng gộp một lần, suite song song bật/tắt, `--allow-dirty`, thứ tự khoá JSON.
- Later: chạy lại theo CA (cú pháp chọn ca riêng từng bộ chạy test) · trần theo chi phí USD dừng làn · carry trong lượt chấm S4 theo băm · bên đọc tự tính lại băm · lệnh đo chi phí AI Gateway dựng sẵn trong kit · phát lại R1g trên bản clone crm thành eval (phụ thuộc kho crm trên máy — số đo ghi ở tài liệu số đo, AC-13 phủ trên fixture, T21/T22 phủ lệnh nguyên văn).
- Never: chạy lại eval model thật (chọn lượt rút tốt hơn trong hai = bằng chứng tự dối) · carry suite · chế độ «xoá biến» cho Đ3 (đo 06/10: bộ nạp điền lại từ `.env`) · chế độ THÊM của Đ3 (owner chọn THAY 06/10) · khớp lỏng theo hậu tố khi giải lệnh.
- `[GIẢ ĐỊNH]` chờ gạch ở Cổng 1: (G1) bảy ngày là trần tuổi carry đủ ngắn cho phần trôi ngoài băm (phiên bản runtime, dịch vụ ngoài, model đổi hành vi) · (G2) thu cây theo `ppid` + nhóm tiến trình gom đủ hậu duệ trên macOS/Linux; tiến trình tách cây (double-fork, cha thành 1) vẫn thoát lưới — giới hạn khai · (G3) **lưới của Đ1 là suite**: thước không gọi tên mà bị sửa hỏng thì suite của chính làn hồ sơ sở hữu nó, và CI, đỏ — vì MỌI làn chạy trọn `suite_keys`; kho có suite không phủ một thước thì mất lưới cho thước đó.

## Đường đo

Không có `opportunity.md` (owner duyệt thiết kế trực tiếp 06/10) — không có ngưỡng UAT. Đo trước/sau
ở kho thật sau rollout (phiên crm làm, kit không ghi vào crm): làn/ngày và `wall_s` trung vị từ dòng
`repin` · số `repin-do` có `ly_do` · số mục `chap_chon` · số `evals_carry` × eval model thật ·
«chi phí đo» trong `tong_ket` — 14 ngày trước và sau ngày crm bật khoá. Số nền 14 ngày trước đã đo
(design doc §1). AC-13 là số đo trước/sau trên fixture, chạy được ở mọi máy; phát lại R1g ở
`58404077` và 203 cặp ghim lại trên bản clone `--shared` của crm ghi ở tài liệu số đo của vòng.

## Out of scope

- Tách E11 khỏi `tra-loi-tin-nhac`, job kiểm chéo sau gộp — crm `kiem-cheo-sau-gop`.
- Làm kín ca chập chờn, dọn `.eve` sót — crm `ca-chap-chon-cach-ly`.
- Chấm eval model theo biên thống kê — crm `eval-model-that-dung-luc` (phần chấm).
- Thước tự hết hạn theo ref nhánh — crm `thuoc-khong-tu-het-han`.
- Thẻ Cổng 2 in phát hiện mức thấp trong hợp đồng — chip đã có ở phiên P4 crm.
- Carry trong lượt chấm S4 theo băm; hợp nhất hai bộ đọc `paths` của làn (hạt giống đã có).
- Bật bất kỳ khoá nào ở bất kỳ kho nào, kể cả kit — việc của từng kho sau khi mốc được nhận.

## Notes

- **Chính sách chốt cho vòng (owner duyệt 06/10, máy áp về sau không hỏi lại):** Đ2 (AC-9, AC-10,
  AC-11) là đuôi cắt được — S4 đỏ hai lượt liên tiếp mà chỉ ở AC của Đ2 → park Đ2 thành hạt giống
  (AC-9…AC-11 ra Known limits, AC-7 vế «carry m» về 0 không đổi nghĩa, AC-13 bỏ hàng Đ2), ship Đ1/Đ4/Đ5/Đ3.
- **Điểm quyết định ở Cổng 1 — đổi mặc định cho mọi kho:** ba phần chỉ-thêm của Đ5 (tổng kết cuối
  lượt, dòng `repin-do` khi bị ngắt, nhóm riêng + giết cả cây) bật không cần khoá (sổ quyết định).
  Duyệt Cổng 1 là duyệt điểm này; muốn đặt chúng sau khoá thì sửa ở đây.
- Thứ tự thi công: Đ1 → Đ4 → Đ5 → Đ3 → Đ2.
- Bộ răng: chiều xanh chạy ca bền trên cây hiện hành; chiều đỏ và phép vi phân chạy trên bản archive
  của SAU-GIA/BASE-GIA (cố định), để hồ sơ đã ký còn ghim lại được ở mọi HEAD sau này. Một vòng sau
  đổi tên hay gỡ ca bền của hồ sơ này thì chân báo «số ô lệch» — tín hiệu cập nhật răng hoặc nghỉ hồ
  sơ, không phải lỗi vật.
- Giới hạn khai (kèm ngưỡng): tệp thước nạp NGẦM qua cấu hình bộ chạy (bunfig `preload`, vitest
  `setupFiles`) không hiện trong lệnh → đổi chúng không làm hồ sơ không gọi tên hoá cũ, lưới là suite
  (G3); ngưỡng mở: ≥1 hồi quy ở kho thật lọt vì tệp thước nạp ngầm. `paths` thiếu đầu vào → carry xanh
  sai — ngưỡng: `carry_lech` ≥ 1 ở bất kỳ kho nào. Env ngoài danh sách khai không vào băm — trần 7
  ngày. Tệp chưa theo dõi vô hình với git (như ADR 0019). Tiến trình tách cây thoát lưới giết (G2).
- Mã thoát của làn sau vòng: 0 xanh · 1 đỏ · 2 nguồn hỏng · 3 usage · **4 vượt trần** · 128+n bị ngắt.
