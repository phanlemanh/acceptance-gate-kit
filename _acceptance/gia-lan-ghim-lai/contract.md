---
schema_version: 1
feature: Giá làn ghim lại, Vòng A — chạy lại lệnh đỏ một lần, trần mỗi lượt và dọn sạch tiến trình khi dừng hay bị ngắt, tổng kết cuối lượt, suite ở môi trường giống CI (kho tự bật)
slug: gia-lan-ghim-lai
owner: phanlemanh@gmail.com
risk_tier: T2               # chỉ chạm feature-loop/scripts (+ khuôn trong SKILL, GUIDE) — ngoài t3_paths
surfaces: [cli]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-10-06T03:45:16Z
design_doc: docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md
---

# Acceptance Contract: gia-lan-ghim-lai (Vòng A)

Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop (PR phanlemanh/crm-onehub#277), cùng đợt với
crm-onehub/_acceptance/ca-chap-chon-cach-ly.

## Context

Đêm 05–06/10 ở crm, PR R1g (phanlemanh/crm-onehub#276) đi từ ký Cổng 2 tới gộp mất ~17 giờ 30 phút,
~14 giờ là làn ghim lại: một lượt bị công cụ ngắt ở trần 90 phút không để vết và để lại tiến trình
sót làm lượt sau đỏ giả; hai lượt dài đỏ vì một ca chập chờn trong suite; lỗi thật duy nhất do CI bắt
vì làn chạy với `.env` có khoá. Owner duyệt thiết kế năm điểm 06/10 (design doc), rồi 06/10 08:43
**thu vòng về Vòng A**: Đ4 (chạy lại), Đ5 (trần, ngắt, tổng kết), Đ3 (env giống CI, chế độ THAY) —
chỉ chạm `feature-loop/scripts`, hạng T2, bỏ Cổng 1.5, Cổng 1 ký trên bảng chữ. Đ1 (thước không gọi
tên) và Đ2 (carry theo băm) thành hạt giống Vòng B: `docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`.

Phép thử mọi kho (luật 26/09): mỗi điểm sau một khoá config; khoá vắng = hành vi trước vòng từng
byte, TRỪ ba phần chỉ-thêm của Đ5 bật mặc định và kê đích danh ở AC-7 (tổng kết cuối lượt, dòng dấu
khi bị ngắt, chạy lệnh trong nhóm riêng + giết cả cây). Hành vi cũ ai dựa: CI trước-merge của mọi kho
(bộ đọc trước vòng phải đọc được dòng mới — AC-7) và làn con lồng trong eval của kho (crm từng gọi
chính `repin-lane.mjs` trong eval — AC-2).

Từ ngữ: **BASE-GIA** = `bf79fdb11fe6e69b12efa1b4c9c7cf40fbb36e1d` (engine trước vòng); **SAU-GIA** =
commit mới nhất có `(gia-lan-ghim-lai)` trong thông điệp và chạm `feature-loop/scripts/` (engine của
vòng, cố định sau khi gộp).

## Criteria

- AC-1: Given `feature_loop.repin_retry: 1`, When một lệnh (suite hay eval máy) lệch kỳ vọng ở lần chạy đầu, Then làn chạy lại ĐÚNG lệnh đó MỘT lần, một mình, SAU khi khối suite song song (nếu bật) đã xong hết; lần hai đạt → lệnh tính đạt và dòng `repin` mang `chap_chon: [{lenh, nhan, lan_dau, log, ca}]` (`log` = nhật ký TRỌN của lần đỏ, tệp tồn tại; `ca` = tên ca rút từ nhật ký đó theo năm khuôn bun `(fail) …`, vitest/jest `✗`/`×`, playwright `✘`, node:test `not ok N - …`, tối đa 10, rút rỗng thì `["không rút được tên ca"]`), section Re-pin thêm hậu tố «chập chờn (đỏ lần đầu, đạt khi chạy lại): …»; lần hai lệch → làn đỏ như cũ, giữ nhật ký CẢ HAI lần, mục `lenh_do` của dòng `repin-do` mang `lan_thu_lai`. KHÔNG chạy lại khi: eval có tên `<slug>/<Eid>` trong `feature_loop.model_evals` (lệnh dùng chung với một eval model thật cũng không) · lần đầu dài hơn 30 phút · trần còn lại (AC-2) ít hơn thời lượng lần đầu · khoá vắng/0. Giá trị khoá ngoài `0 | 1` → thoát 2 gọi tên khoá và hai giá trị hợp lệ. Bảng quyết định chạy lại là hàm thuần có bảng chân trị viết trước. Chiều đỏ: bản sao tính lần hai đỏ là đạt → ghim «lần hai đỏ vẫn tính đạt»; bản sao chạy lại eval model thật → «chạy lại eval model thật»; bản sao bỏ `chap_chon` → «chập chờn im»; bản sao chạy lại xen trong khối song song → «chạy lại dưới tải».
- AC-2: Given trần N phút (`--tran-phut N` thắng `feature_loop.repin_budget_min`; N thập phân > 0; đồng hồ tính từ lúc làn khởi động), When tổng thời gian làn chạm N giữa một lệnh, Then làn DỪNG LỆNH bằng cách thu danh sách MỌI hậu duệ của lệnh theo `ppid` cộng nhóm tiến trình của nó TRƯỚC khi gửi tín hiệu nào, gửi SIGTERM cho cả danh sách và SIGKILL sau 10 giây cho mọi pid trong danh sách còn sống; không chạy lệnh nào nữa; thoát **4**; không ghi pin (`verified_commit` và báo cáo giữ nguyên); với `--write` mỗi slug nhận MỘT dòng `repin-do` mang `ly_do: "vuot-tran"`, `tran_phut`, `da_chay_phut`, `chua_chay: [nhãn lệnh]`. Ô (trần của ca đặt rộng so với thời gian khởi động làn; lệnh ghi pid của cháu TRƯỚC khi trần chạm — dấu dương, vắng tệp pid là ĐỎ «cháu chưa kịp sinh» chứ không phải xanh): B1 cháu thường → làn thoát 4 trong N + 15 s, pid cháu đã chết · B2 cháu BẪY SIGTERM → chết sau SIGKILL, trong N + 10 + 15 s · B3 làn LỒNG hai tầng (lệnh của làn ngoài là một `repin-lane` khác có trần rộng hơn, lệnh của làn trong sinh cháu bẫy SIGTERM) → sau khi làn ngoài thoát 4, mọi pid đã ghi ở cả hai tầng đều chết · B4 `--write` → dòng `repin-do` đủ trường · B5 khoá thay cờ cho cùng kết quả, cờ thắng khoá · B6 trần vắng → lệnh dài chạy hết, xanh · B7 cờ `0`/chữ → thoát 3, khoá sai → thoát 2. Chiều đỏ: bản sao chỉ giết pid của `bash` → B1 cháu sống, ghim «cháu tiến trình sót»; bản sao bỏ SIGKILL → B2 cháu sống, «không SIGKILL»; bản sao chỉ giết theo nhóm → B3 cháu tầng trong sống, «làn lồng sót cháu»; bản sao thoát 1 → «trùng mã làn đỏ»; bản sao ghi pin khi vượt trần → «pin trên làn chưa xong».
- AC-3: Given làn đang chạy một lệnh có tiến trình cháu (đã ghi pid), When làn nhận SIGTERM, SIGINT hoặc SIGHUP (3 ô), Then làn dừng lệnh theo đúng cách của AC-2 (thu cây trước, SIGTERM rồi SIGKILL), thoát 128 + số hiệu tín hiệu (143 · 130 · 129), pid cháu đã chết; với `--write` mỗi slug nhận một dòng `repin-do` mang `ly_do: "bi-ngat"`, `tin_hieu`, `chua_chay`; không `--write` thì cây git không có tệp theo dõi nào đổi. Phần này BẬT MẶC ĐỊNH (không sau khoá — kê ở AC-7). Chiều đỏ: bản sao bỏ bộ bắt tín hiệu → không dòng `bi-ngat`, ghim «ngắt không để vết».
- AC-4: Given mọi kết cục làn (xanh · đỏ · vượt trần · bị ngắt), When làn kết thúc, Then dòng stderr CUỐI bắt đầu `[lane] TỔNG KẾT` và nêu: kết cục, phút, số lệnh thực chạy, «eval model thật: gọi n, carry m» (n = số lần thực chạy một lệnh thuộc eval có tên trong `model_evals`; m = 0 CỐ ĐỊNH ở vòng này — khuôn giữ chỗ cho Vòng B, không cơ chế nào ghi khác 0), «chập chờn: k», và — khi kho khai `feature_loop.repin_cost_cmd` (lệnh in MỘT số tăng theo chi tiêu) — «chi phí đo: <sau − trước> (chênh trong khoảng làn chạy, gồm mọi phiên chạy cùng lúc)»; cùng các số đó nằm ở khoá `tong_ket` của JSON stdout, của dòng `repin` (xanh) và của dòng `repin-do` (đỏ · vượt trần · bị ngắt, khi `--write`). Phần này BẬT MẶC ĐỊNH (kê ở AC-7). Đo bằng quan hệ: fixture có hai eval model thật, mỗi lần chạy cộng 1 vào bộ đếm chi tiêu ngoài kho mà lệnh đo chi phí đọc → `n` và «chi phí đo» đều bằng số lần các eval đó thực chạy. Lệnh đo chi phí lỗi hoặc không in số → «chi phí đo: lỗi (<lý do>)», kết cục làn không đổi. Chiều đỏ: bản sao đếm `n` theo eval thay vì theo lần chạy thật → ghim «đếm model sai»; bản sao bỏ tổng kết ở làn đỏ → «tổng kết vắng ở làn đỏ».
- AC-5: Given `feature_loop.repin_ci_blank_env: [K, …]`, When làn chạy suite, Then mỗi lệnh suite chạy với từng tên K đặt **rỗng tường minh** (thắng giá trị trong `.env` của bộ nạp `node --env-file`; đặt rỗng chứ không xoá biến — đo 06/10: xoá thì bộ nạp điền lại từ `.env`), eval chạy với env đầy đủ của tiến trình; một eval có lệnh trùng nguyên văn một suite vẫn chạy riêng (không gộp kết quả hai môi trường); dòng `repin` mang `suites_env: "ci"` và section thêm hậu tố «suite chạy ở môi trường giống CI (biến rỗng: K…)»; suite đỏ ở env này → làn đỏ, dòng stderr của làn và mục `lenh_do` gọi «môi trường giống CI (biến rỗng: K…)»; chạy lại (AC-1) dùng cùng env. Tên biến không hợp lệ → thoát 2. Đối chứng: khoá vắng → cùng suite xanh với K từ env tiến trình. Chiều đỏ: bản sao xoá biến thay vì đặt rỗng → suite xanh, ghim «xoá biến thay vì rỗng»; bản sao áp env CI cho eval → eval đỏ, «env CI tràn sang eval»; bản sao gộp lệnh khác env → eval không chạy riêng, «gộp lệnh khác env».
- AC-6: Given writer thật của làn chạy trên fixture bật mọi khoá, When rút các khoá của dòng `repin`/`repin-do` nó ghi, Then mọi khoá có mặt trong khuôn `REPIN-TEMPLATE` của SKILL feature-loop theo ĐÚNG thứ tự writer ghi, và văn bản nghi thức re-pin của SKILL nêu mã thoát 4 cùng hai `ly_do` (`vuot-tran`, `bi-ngat`); danh sách khoá config của làn rút từ MỘT khối marker trong `repin-lane.mjs` (nguồn duy nhất) và mỗi khoá có một dòng trong GUIDE §7.1 — ca rút kỳ vọng từ vật, rút rỗng là ĐỎ «rút rỗng». Chiều đỏ: bản sao writer thêm một khoá mới không có trong khuôn → ghim «khoá ngoài khuôn»; bản sao bỏ một khoá khỏi GUIDE → «khoá chưa khai ở GUIDE».
- AC-7: Given kho KHÔNG khai khoá mới nào (`feature_loop.repin_retry`, `feature_loop.model_evals`, `feature_loop.repin_budget_min`, `feature_loop.repin_cost_cmd`, `feature_loop.repin_ci_blank_env`), When `repin-lane.mjs` (`--skip-unchanged`, `--write` xanh, `--write` đỏ, và bị SIGTERM giữa lệnh) chạy trên fixture của AC-1…AC-5 đã gỡ khoá, Then sau khi gỡ ĐÚNG các phần thêm bật mặc định đã kê — dòng stderr cuối `[lane] TỔNG KẾT …`, khoá `tong_ket` ở JSON stdout và ở dòng `repin`/`repin-do`, dòng `repin-do` `ly_do: "bi-ngat"` của ca bị ngắt — thì stdout, mã thoát, dòng run-log và section Re-pin của làn SAU-GIA BẰNG HỆT làn BASE-GIA trên cùng fixture (cả hai lấy bằng `git archive <sha> feature-loop/scripts`, cùng một bộ máy acceptance-gate tại BASE-GIA làm `--ag-root`; chỉ chuẩn hoá `run_id`, `ts`, `wall_s` và số giây trong dòng stderr của làn); và `recheck-evidence.cjs` của BASE-GIA đọc một dòng `repin` có `tong_ket` → xanh. So SAU-GIA chứ không so HEAD, để phép vi phân không tự hết hạn khi kit đi tiếp. Chiều đỏ: mỗi bản sao đổi mặc định MỘT khoá thành bật → vi phân khác, ghim «đổi mặc định: <khoá>»; bản sao thêm một dòng hay khoá ngoài danh sách đã kê → «thêm ngoài danh sách».
- AC-8: Given ba điểm đã dựng, When chạy `_acceptance/gia-lan-ghim-lai/rang/so-do.mjs` (fixture code-sinh, mỗi hàng chạy khoá vắng rồi khoá bật — hay bản BASE-GIA rồi bản SAU-GIA — trên CÙNG cây), Then nó in bảng ba hàng trước → sau, hai hàng dựng lại hai kịch bản thật của R1g: Đ4 *ca chập chờn trong suite* (một ca hết giờ ở lần chạy đầu, đạt ở lần sau — như `agent-okr app-rieng`): kết cục làn đỏ → xanh, và tên ca có trong báo cáo · Đ5 *làn bị ngắt giữa lệnh* (SIGTERM tới làn khi lệnh có cháu đang chạy — như trần 90 phút của công cụ): dòng dấu 0 → 1, tiến trình sót 1 → 0 · Đ3 *lỗi chỉ-CI* (ca chỉ đỏ khi khoá rỗng, như `nang-luc: khong`): lỗi làn bắt được 0 → 1 — và thoát 0 khi và chỉ khi MỌI hàng đi đúng chiều đã hứa. Chiều đỏ: bản sao tắt MỘT điểm → hàng đó không đổi, thoát 1, ghim «Đx không đổi số».

## Coverage

- Quét bằng `morphological-scan` (preset test-matrix + risk-premortem) trên năm điểm, rồi thu về ba điểm theo quyết định 08:43. Chân sản phẩm: kit là engine, người dùng là phiên Claude Code và qua nó là owner [SUY-TỪ-REPO: CLAUDE.md, khối ĐỊNH VỊ]; mã `feature-loop/scripts/repin-lane.mjs` [SUY-TỪ-REPO]; sổ R1g [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md §1].
- Chân ngành: [NGÀNH: Playwright `retries` + nhãn «flaky»] và [NGÀNH: Bazel `--flaky_test_attempts`] — chạy lại và gọi tên ca chập chờn tách khỏi ca đỏ (Đ4) · [NGÀNH: GitHub Actions `timeout-minutes` + huỷ cả cây tiến trình] (Đ5) · [NGÀNH: GitHub Actions — biểu thức trỏ secret chưa khai cho chuỗi rỗng] (Đ3: rỗng tường minh ≈ CI).

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Điểm | Đ4 · Đ5 · Đ3 | design doc đã duyệt 06/10, thu về Vòng A 08:43 |
| B. Khoá | vắng (= trước vòng, trừ phần chỉ-thêm đã kê) · bật hợp lệ · giá trị sai | luật «cân trên mọi kho» 26/09 |
| C. Kết cục | lệnh đỏ thật · chập chờn · vượt trần · bị ngắt · đỏ chỉ ở env CI · xanh | sổ đêm 05–06/10 crm (LUAT.md) |
| D. Bên gọi / bên đọc | làn `--skip-unchanged` · làn `--write` + recheck tự kiểm · bộ đọc trước vòng · làn con lồng trong eval | `rang/ho-so-cham.mjs` crm (trước 06/10) |

- Core → AC-1…AC-8. Cross-cutting: lệnh trùng gộp một lần, suite song song bật/tắt, `--allow-dirty`, thứ tự khoá JSON.
- Later: chạy lại theo CA (cú pháp chọn ca riêng từng bộ chạy test) · trần theo chi phí USD dừng làn · lệnh đo chi phí AI Gateway dựng sẵn trong kit · Đ1 và Đ2 (hạt giống Vòng B).
- Never: chạy lại eval model thật (chọn lượt rút tốt hơn trong hai = bằng chứng tự dối) · chế độ «xoá biến» cho Đ3 (đo 06/10: bộ nạp điền lại từ `.env`) · chế độ THÊM của Đ3 (owner chọn THAY 06/10).
- `[GIẢ ĐỊNH]` chờ gạch ở Cổng 1: (G2) thu cây theo `ppid` + nhóm tiến trình gom đủ hậu duệ trên macOS/Linux; tiến trình tách cây (double-fork, cha thành 1) vẫn thoát lưới — giới hạn khai.

## Đường đo

Không có `opportunity.md` (owner duyệt thiết kế trực tiếp 06/10). AC-8 dựng lại hai kịch bản thật của
R1g (ca chập chờn trong suite, làn bị ngắt giữa lệnh) và lỗi chỉ-CI trên fixture, chạy được ở mọi máy.
Ở kho thật sau rollout (phiên crm làm, kit không ghi vào crm): số mục `chap_chon`, số `repin-do` có
`ly_do`, «eval model thật: gọi n» và «chi phí đo» trong `tong_ket`, số lần CI đỏ mà làn cùng sha xanh —
14 ngày trước và sau ngày crm bật khoá. Danh sách khoá cho rollout crm ghi ở GUIDE §7.1 (AC-6).

## Out of scope

- Đ1 (tệp test chỉ làm hoá cũ hồ sơ gọi tên nó) và Đ2 (carry theo băm) — hạt giống Vòng B `docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`, mở sau khi đo lại trên crm không còn E11 (Đ1 tiết kiệm < 10 % thì bỏ Đ1, chỉ làm Đ2).
- Tách E11 khỏi `tra-loi-tin-nhac`, job kiểm chéo sau gộp — crm `kiem-cheo-sau-gop`.
- Làm kín ca chập chờn, dọn `.eve` sót — crm `ca-chap-chon-cach-ly`.
- Chấm eval model theo biên thống kê — crm `eval-model-that-dung-luc`.
- Thẻ Cổng 2 in phát hiện mức thấp trong hợp đồng — chip đã có ở phiên P4 crm.
- Bật bất kỳ khoá nào ở bất kỳ kho nào, kể cả kit — việc của từng kho sau khi mốc được nhận.

## Notes

- **Chính sách chốt cho vòng (owner duyệt 06/10 08:43, máy áp về sau không hỏi lại):** trần 2 ngày tính
  tới khi crm bật được khoá; quá trần thì cắt tiếp phạm vi (Known limits có tên), không thêm giờ máy.
- **Điểm quyết định ở Cổng 1 — đổi mặc định cho mọi kho:** ba phần chỉ-thêm của Đ5 (tổng kết cuối
  lượt, dòng `repin-do` khi bị ngắt, nhóm riêng + giết cả cây) bật không cần khoá (sổ quyết định).
  Duyệt Cổng 1 là duyệt điểm này; muốn đặt chúng sau khoá thì sửa ở đây.
- Thứ tự thi công: Đ4 → Đ5 → Đ3. **Quá trần thì cắt theo thứ tự ngược:** Đ3 là đuôi cắt được của Vòng A
  (ra hạt giống có tên), rồi Đ4; Đ5 là lỗ của chính kit, giữ tới cùng.
- AC-3 chỉ cứu được khi thứ ngắt làn gửi tín hiệu MỀM (SIGTERM/SIGINT/SIGHUP). Với ngắt cứng (SIGKILL) không
  gì chạy được — cái cứu lượt như R1g 15:11 là trần của làn (AC-2) đặt DƯỚI trần của công cụ, không phải AC-3.
- Bộ răng: chiều xanh chạy ca bền trên cây hiện hành; chiều đỏ và phép vi phân chạy trên bản archive
  của SAU-GIA/BASE-GIA (cố định), để hồ sơ đã ký còn ghim lại được ở mọi HEAD sau này.
- Giới hạn khai: tiến trình tách cây thoát lưới giết (G2); chạy lại ở mức lệnh, không mức ca; **chế độ THAY
  của Đ3** — test tự bỏ qua khi thiếu khoá (`skipIf`) hôm nay chạy trong làn, sau khi bật khoá sẽ bỏ qua
  như ở CI, tức làn mất phủ cho chúng; lưới là eval của hồ sơ vẫn chạy có khoá. Ngưỡng mở: ≥1 hồi quy ở kho
  thật lọt qua làn vì một test bị bỏ qua dưới env giống CI. Mã đọc khoá bằng `??` thay vì `?.trim()` coi
  rỗng là «có khoá» — kho soát trước khi liệt `repin_ci_blank_env`.
- Mã thoát của làn sau vòng: 0 xanh · 1 đỏ · 2 nguồn hỏng · 3 usage · **4 vượt trần** · 128+n bị ngắt.
