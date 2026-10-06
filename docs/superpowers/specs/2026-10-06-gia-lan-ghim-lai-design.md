# Giá làn ghim lại — năm điểm giảm thời gian, token và số lượt (thiết kế)

**Ngày:** 2026-10-06 · **Trạng thái:** owner DUYỆT 06/10 — Đ3 chế độ THAY, thứ tự Đ1 → Đ4 → Đ5 → Đ3 → Đ2, một vòng T3

> **Thu vòng 06/10 08:43 (chủ kho, qua phiên điều phối crm):** vòng này chỉ làm **Vòng A** — Đ4, Đ5, Đ3, hạng T2, bỏ Cổng 1.5, trần 2 ngày tới khi crm bật khoá. Đ1 và Đ2 thành hạt giống `docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`; phần thiết kế của chúng dưới đây giữ làm đầu vào cho Vòng B. · **Hạng dự kiến:** T3
(đổi cái gì được tính là «đã chứng lại» trong dòng `repin`, và bộ đọc pin).

Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop — cùng đợt với
`crm-onehub/_acceptance/eval-model-that-dung-luc` và `crm-onehub/_acceptance/ca-chap-chon-cach-ly`
(PR phanlemanh/crm-onehub#277, nhánh `docs/hat-giong-gia-ghim-lai`), sổ điều phối crm
`.acceptance-runs/dieu-phoi-1410/LUAT.md` dòng 05/10 15:05 → 06/10 07:15.

---

## 0. Hiểu đề

**Owner nói (06/10):** ba trục giá — thời gian, token, số lượt xuất hiện — đều lớn mà giá
trị thu về thấp. Năm điểm sửa trong kit, mỗi điểm có test và số đo trước/sau, thứ tự đề
xuất 1 → 4 → 3 → 2 → 5. Không sửa kho crm từ phiên này; lỗi thấy ở crm thì ghi lại.

**Máy giả định (sửa được):**
- Phần tách E11 khỏi `tra-loi-tin-nhac` là việc của crm (#277). Kit không cố «chữa» E11.
- Mọi điểm là **bật theo lựa chọn** của từng kho (khoá config vắng = hành vi 2.22.0 nguyên
  văn) — theo luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho» (CLAUDE.md, 26/09).
- Lỗ «thẻ Cổng 2 không in phát hiện mức thấp trong hợp đồng» (R1e round 4, AC-6(b)) **đã
  có chip** ở phiên P4 crm («Cho thẻ Cổng 2 in phát hiện trong hợp đồng mức thấp»), chưa
  phiên nào chạy. Thiết kế này **không** làm lại nó.

**Thành công nghĩa là:** một lượt ghim lại chỉ chạy lại thứ đầu vào của nó thật sự đổi,
không chết vì một ca chập chờn, không để lọt lỗi chỉ hiện ở CI, và không bao giờ chạy câm
quá trần — mỗi điều đo được bằng số trên lịch sử thật của crm.

---

## 1. Số nền (đo 06/10, chỉ đọc trên `origin/onehub` của crm)

| Số | Giá trị | Cách đo |
|---|---|---|
| Làn ghim lại xanh từ 22/09 | **174** (≈ 12,4 làn/ngày) | `run_id` khác nhau của dòng `kind: repin` |
| Làn đỏ có dấu (`repin-do`, từ 2.20) | 9 | `lan_id` khác nhau |
| Thời lượng làn (29 làn có `wall_s`) | trung vị 7 phút · P90 24 phút · max 92 phút | `wall_s` |
| Cặp ghim lại liên tiếp cùng hồ sơ | 203 | run-log từng hồ sơ |
| — trong đó diff (bỏ `_acceptance/`, T1) **chỉ gồm tệp test** | **12 (6 %)** | khớp `**/test/**`, `*.spec.*`, `*.test.*`, `*.dom.tsx` |
| — có mã sản phẩm | 186 | |
| Lần chạy eval máy trong các làn đó | 2 912 | `evals_exit` |
| — eval mà diff giữa hai pin **không chạm `paths`** (carry được) | **1 726 (59 %)** | `evalPathsOf` + glob của `paths` |
| — eval không khai `paths` (không bao giờ carry) | 57 | |

**Ca R1g (zalo-va, phanlemanh/crm-onehub#276):** ký Cổng 2 15:11 → merge ~08:10 hôm sau ≈ 17
giờ; ~14 giờ là 1 lượt bị ngắt ở trần 90 phút của công cụ (không để vết) + 4 lượt dài
(E11 ~3 giờ 25 phút/lượt). Lượt dài 3 sinh ra từ commit `58404077`: diff chỉ có
`apps/agent/test/zalo-va.integration.spec.ts` (+4 dòng) và `decisions.jsonl`. Lượt 3 đỏ vì
ca chập chờn `agent-okr app-rieng` (timeout 5000 ms) bên trong làn con của E11 — làn con
đó **chính là `repin-lane.mjs` của kit** (`rang/ho-so-cham.mjs` gọi nó), nên mọi sửa ở làn
cũng có hiệu lực trong E11. Số dư AI Gateway 43,91 → 32,51 USD trong ~14 giờ.

---

## 2. Năm điểm

Thứ tự máy khuyến nghị: **Đ1 → Đ4 → Đ5 → Đ3 → Đ2** (đề bài: 1 → 4 → 3 → 2 → 5). Lý do đổi ở §5.

### Đ1 — Tệp test không đánh hoá cũ hồ sơ không gọi tên nó

**Vấn đề.** `stale_files()` (pre-merge-check.sh) coi mọi tệp ngoài `_acceptance/` và
`t1_skip_globs` là «vật đổi». Đổi bốn dòng test của `zalo-va` làm `tra-loi-tin-nhac` hoá cũ
chỉ vì E11 khai `paths: apps/**` — một lượt dài 4 giờ cho một tệp mà không eval nào của
`tra-loi-tin-nhac` gọi tên.

**Nguyên lý.** Đổi **vật** (mã sản phẩm) làm cũ mọi phép đo phủ vật đó. Đổi **thước** (tệp
test) không đổi hành vi sản phẩm; nó chỉ làm cũ phép đo **dùng chính thước đó**.

**Cơ chế.**
- Khoá mới `risk_tiers.test_globs` (danh sách glob). Vắng → không đổi gì.
- Hàm một nguồn mới trong `lib/evidence-core.cjs` (khối marker `GOI-TEN-THUOC`), gọi ở
  **cả hai** chỗ đang tính hoá cũ: `pre-merge-check.sh` (sau `stale_files` và bộ lọc
  `stale_scope: paths`, cùng nếp `staleByPaths`) và vị từ `--skip-unchanged` của
  `repin-lane.mjs`. Hàm chỉ **bớt** tệp, không bao giờ thêm — kho bật khoá không thể đỏ ở
  chỗ hôm nay xanh.
- Một tệp `f` khớp `test_globs` được **giữ** trong danh sách hoá cũ của hồ sơ P chỉ khi P
  **gọi tên** nó:
  1. một mục `paths` của một eval của P khớp `f` **và chính mục đó là một glob thước** (chuỗi
     glob khớp `test_globs`) — `apps/agent/test/zalo-va.integration.spec.ts` gọi tên;
     `apps/agent/test/*.spec.ts` gọi tên; `apps/**` **không** gọi tên (nó phủ cả cây);
  2. hoặc lệnh đã giải (`config:` → `config.yaml`) của một eval của P chứa một token
     đường dẫn GIẢI ĐÚNG ra `f` (`test/zalo-va.integration.spec.ts` sau `cd apps/agent`;
     `../../packages/ui/test/setup-dom.ts` → mọi eval nạp tệp setup chung đều hoá cũ —
     đúng, đó là thước dùng chung). Giải đường **chính xác**, không khớp lỏng theo hậu tố:
     token tương đối giải theo `cd` đứng trước nó (cd nối tiếp nhau, `../` được tính), nhận dạng
     `--cờ=đường`, token trỏ thư mục gọi tên mọi tệp dưới nó, token glob khớp theo glob; bỏ qua
     đường tuyệt đối (ngoài kho), gán biến (`A=b`), cờ, từ trần (`bun`, `test`) và đường dưới
     `.acceptance-runs/`. Đo 06/10 ở crm: 434/441 ca lệnh nạp một tệp test mà `paths` không liệt
     là tệp nạp trước dùng chung — nên vế lệnh là bắt buộc, không phải phụ.
- **Lệnh không giải được** — có biến hay `$(…)`/backtick, `cd` tới đường không giải được, hoặc
  một token dạng đường trong kho không trỏ tệp/thư mục nào đang theo dõi — thì P **giữ mọi tệp
  thước** (fail-closed về phía chạy) và NOTE gọi tên token. Không đọc được `evals.yaml`/`config.yaml`
  hay khoá `config:` không giải được → cũng giữ, cùng nếp `staleByPaths`.
- Glob thư mục test trong `paths` (`apps/agent/test/**`) chỉ gọi tên khi `test_globs` khai mẫu
  thư mục (`**/test/**`); với `test_globs` chỉ gồm mẫu tệp ca (`**/*.spec.ts`) thì nó là glob
  rộng theo chính định nghĩa của kho. Hai cách khai là lựa chọn của kho, mỗi cách một ô ma trận.
- **Lưới cho thước không gọi tên là suite.** Nghĩa của Đ1 là SỞ HỮU, không phải «lệnh nào chạy
  tệp nào»: một eval chạy cả thư mục (`bun test` không đối số) vẫn chạy cả thước của hồ sơ khác
  mà không gọi tên chúng. An toàn đến từ chỗ MỌI làn ghim lại và CI chạy trọn `suite_keys`: một
  thước bị sửa hỏng làm suite của chính làn hồ sơ sở hữu nó đỏ, nên không gộp được. Kho có suite
  không phủ một thước thì mất lưới cho thước đó — giả định ghi ở Coverage của hợp đồng.
- Vế «với chính hồ sơ thì chỉ chạy lại eval chạm tệp đó» **không** làm ở Đ1 bằng một cơ chế
  diff riêng: nó là đúng carry của Đ2 (§Đ2). Hai cơ chế cho cùng một câu hỏi là hai khuôn sẽ trôi.

**Răng.** Repo fixture do code sinh trong chính lần chạy:
- chiều đỏ: đổi tệp sản phẩm → P hoá cũ (như cũ); đổi test mà `paths` của P gọi tên → hoá
  cũ; đổi test mà chỉ **lệnh** của P gọi tên → hoá cũ;
- chiều im: đổi test mà P chỉ phủ bằng `apps/**` → P **không** hoá cũ;
- đối chứng: không khai `test_globs` → đầu ra pre-merge-check giống byte với bản trước vòng
  (bản base lấy bằng `git archive <BASE-GIA> scripts lib`, không chép danh sách tay);
- kho tiêu thụ: cùng ma trận chạy trên một kho chỉ có lớp CI vendored (danh sách rút từ
  marker chép của `acceptance-init`, không có `feature-loop/`) phải ra cùng kết luận
  [bài học lan-ghim-lai-theo-paths#F1];
- round-trip: cùng fixture, `pre-merge-check.sh` và `repin-lane.mjs --skip-unchanged` cho
  cùng kết luận;
- mutant: gỡ vế «gọi tên qua lệnh» → ca chiều đỏ thứ ba đỏ; coi glob rộng là gọi tên → ca
  chiều im đỏ.

**Số đo trước/sau.**
- R1g: chạy pre-merge-check (bản mới) trên một bản clone `--shared` của crm (không ghi gì vào
  kho crm) ở `58404077`, `test_globs` tiêm vào bản clone. Trước: 2 hồ sơ hoá cũ
  (`zalo-va`, `tra-loi-tin-nhac` ≈ 4 giờ). Dự báo sau: 1 (`zalo-va`, ≈ 25 phút).
- 14 ngày: phát lại 203 cặp, đếm (hồ sơ, cặp) hoá cũ theo luật cũ và luật mới. Trần trên đã
  biết: 12 cặp diff chỉ-test (6 %). Đ1 rẻ theo số đếm; giá trị của nó tập trung ở hồ sơ có
  `paths` rộng như E11.

### Đ4 — Lệnh đỏ được chạy lại một lần trước khi kết luận lượt đỏ

**Vấn đề.** Một ca chập chờn làm đỏ cả lượt dài 3 (1 giờ 50 phút) và kéo theo lượt dài 4
(~4 giờ). Đã có tiền lệ trong khối ĐỊNH VỊ (K8): «hệ thống chết — thử lại MỘT lần».

**Cơ chế.**
- Khoá `feature_loop.repin_retry: 1` (vắng/0 = như cũ).
- Lệnh (suite hoặc eval máy) trả mã lệch kỳ vọng → chạy lại **đúng lệnh đó một lần, một
  mình** (sau khi khối suite song song đã xong — ca chập chờn vì tải được một lượt máy yên).
  Lần hai đạt → lệnh tính đạt; lần hai lệch → lượt đỏ như cũ, giữ nhật ký **cả hai** lần.
- Mức chạy lại là **lệnh**, không phải ca: kit là bộ máy cho mọi kho, mỗi bộ chạy test
  (bun, vitest, playwright, node:test) chọn ca một kiểu. Nhờ làn con của E11 cũng là
  `repin-lane`, chạy lại suite 4 trong làn con chỉ tốn một suite chứ không tốn 3 giờ.
- **Không** chạy lại eval có tên trong `feature_loop.model_evals`: chạy lại một eval ngưỡng
  trên model ngẫu nhiên là chọn lượt rút tốt hơn trong hai — bằng chứng tự dối. Không chạy
  lại lệnh mà lần đầu đã dài hơn 30 phút, hay không còn đủ trần (Đ5).
- **Báo tên.** Dòng `repin` mang `chap_chon: [{lenh, nhan, lan_dau, log, ca}]`; section
  Re-pin thêm «chập chờn: suite 4 (đỏ lần đầu, đạt khi chạy lại) — ca: …». `ca` rút từ
  nhật ký lần đỏ bằng mẫu chung (`(fail) …` của bun, `✗`/`×`/`FAIL` của vitest/jest, `✘`
  của playwright, `not ok N - …` của node:test), tối đa 10 tên; rút rỗng thì nói thẳng
  «không rút được tên ca».

**Răng.** Lệnh fixture đỏ lần một, đạt lần hai (tệp trạng thái) → làn xanh, `chap_chon` gọi
tên; lệnh đỏ cả hai → làn đỏ, hai nhật ký; eval trong `model_evals` đỏ → không chạy lại;
khoá vắng → đỏ ngay (đối chứng); mutant «lần hai đỏ vẫn tính đạt» → ca đỏ.

**Số đo trước/sau.** Trước: R1g lượt dài 3 đỏ sau 1 giờ 50 phút + lượt dài 4 ≈ 4 giờ, vì một
ca. Sau: đo ở crm sau khi cài — số làn đỏ mà lệnh đỏ đạt khi chạy lại (đếm `chap_chon`) và
số làn `repin-do` trong 7 ngày trước/sau.

### Đ5 — Trần mỗi lượt, mã thoát riêng, tổng kết cuối lượt

**Vấn đề.** Lượt ghim lại R1g 15:11 bị ngắt ở trần 90 phút của công cụ: 1 giờ 05 phút máy,
**không một dòng vết**, và tiến trình con sót lại (`.eve` dev-runtime) làm lượt sau đỏ giả.
Không làn nào báo đã gọi bao nhiêu eval model thật.

**Cơ chế.**
- `--tran-phut N` (ưu tiên) hoặc `feature_loop.repin_budget_min`. Vắng → không trần (như cũ).
- Mỗi lệnh chạy trong **nhóm tiến trình riêng**. Dừng một lệnh = **giết cả cây**: TRƯỚC khi
  gửi tín hiệu nào, làn thu danh sách mọi hậu duệ của lệnh theo `ppid` (`ps -A -o pid=,ppid=`)
  cộng nhóm tiến trình; gửi SIGTERM cho cả danh sách, 10 giây sau SIGKILL mọi pid trong danh
  sách còn sống. Thu theo cây chứ không chỉ theo nhóm vì làn có thể LỒNG (E11 crm chạy chính
  `repin-lane.mjs` làm lệnh): làn trong mở nhóm `detached` riêng cho lệnh của nó, nên tín hiệu
  gửi theo nhóm của làn ngoài không tới đó; và làn ngoài SIGKILL làn trong ở giây 10 thì hẹn
  SIGKILL của làn trong chết theo — danh sách thu trước là thứ không phụ thuộc vào ai sống.
  Tiến trình tách cây (double-fork, cha thành 1) vẫn thoát lưới — giới hạn khai.
- Hết trần → dừng lệnh đang chạy như trên, không chạy lệnh nào nữa, **mã thoát 4** (mới — 0 xanh
  · 1 đỏ · 2 nguồn hỏng · 3 usage giữ nguyên). Với `--write`: mỗi slug nhận một dòng `repin-do`
  mang `ly_do: "vuot-tran"`, `tran_phut`, `da_chay_phut`, `chua_chay: [nhãn lệnh]`. Không ghi pin.
- Làn nhận SIGTERM/SIGINT/SIGHUP (công cụ ngắt) → dừng lệnh đang chạy như trên, ghi `repin-do`
  `ly_do: "bi-ngat"` nếu `--write`, thoát 128+tín hiệu. (SIGKILL thì không gì cứu được — nên trần
  của làn đặt dưới trần công cụ.)
- **Ba phần của Đ5 BẬT MẶC ĐỊNH, không sau khoá** (phản biện 06/10, P1-b): tổng kết cuối lượt,
  bắt tín hiệu, và chạy lệnh trong nhóm riêng + giết cả cây. Lý do: cả ba chỉ THÊM (một dòng
  stderr, một khoá JSON mà bên đọc bỏ qua, một dòng `repin-do` khi bị ngắt — trước đây lượt bị
  ngắt không để vết) và không đổi kết cục làn nào; bắt kho bật khoá mới có tổng kết thì kho
  chưa bật không có số cho dòng «phút máy» của luật (c). Đây là đổi mặc định cho mọi kho — trình
  ở Cổng 1 như một điểm quyết định; hợp đồng kê đích danh các phần thêm ấy và phép vi phân
  với bản trước vòng gỡ đúng chúng.
- **Tổng kết cuối lượt** — một dòng stderr cuối + khoá `tong_ket` trong JSON stdout + hậu tố
  section: thời gian · số lệnh · **eval model thật: gọi n, carry m** (đọc `model_evals`) ·
  số lệnh chập chờn · **chi phí đo** nếu kho khai `feature_loop.repin_cost_cmd` (lệnh in một
  số; làn chạy nó trước lệnh đầu và sau lệnh cuối, ghi chênh lệch — nói rõ «chênh số dư,
  gồm mọi phiên chạy cùng lúc»). Kit không đếm token được ở mọi kho; đây là chỗ «ước nếu đo
  được».

**Răng.** Lệnh dài vượt trần → thoát 4 trong trần + 15 giây, cháu tiến trình (ghi pid TRƯỚC khi
trần chạm — dấu dương) đã chết, có dòng `vuot-tran`; cháu BẪY SIGTERM (`trap '' TERM`) chết sau
SIGKILL; làn LỒNG hai tầng (lệnh của làn ngoài là một `repin-lane` khác, lệnh trong sinh cháu bẫy
SIGTERM) → sau khi làn ngoài thoát, mọi pid đã ghi đều chết; trần vắng → như cũ; SIGTERM vào làn →
dòng `bi-ngat`. Trần của ca đặt rộng so với thời gian khởi động làn, không phải vài giây tuyệt
đối (dưới tải lượt chấm, khởi động có thể ăn hết trần hẹp). Mutant: «chỉ giết pid bash» → cháu
sống · «không SIGKILL» → cháu bẫy TERM sống · «chỉ giết theo nhóm» → cháu của làn trong sống.

**Số đo trước/sau.** Trước: 1 lượt bị ngắt, 0 dòng vết, 1 lượt kế đỏ vì trạng thái sót. Sau:
fixture đo thời gian dừng và số tiến trình sót; ở crm đếm dòng `vuot-tran`/`bi-ngat` và ca
«đỏ vì trạng thái sót» 7 ngày trước/sau.

### Đ3 — Suite chạy ở môi trường giống CI

**Vấn đề.** Ca `nang-luc: khong` của R1g đỏ ở CI 22 phút sau khi mở PR, vì làn ghim lại 4 giờ
chạy với `.env` có khoá Zalo, CI thì không. Kéo theo một vòng sửa + lượt dài 3.

**Cơ chế.**
- Khoá `feature_loop.repin_ci_blank_env: [TÊN, …]` — các khoá tuỳ chọn CI không có.
- Suite chạy với mỗi tên trong danh sách **đặt RỖNG tường minh**. Đo 06/10 (Bun 1.3.12,
  Node `--env-file`): `env -u TÊN` **không** mô phỏng được CI — Bun nạp lại giá trị từ
  `.env`; chỉ chuỗi rỗng mới thắng. Ở crm mã đọc khoá bằng `Boolean(process.env.X?.trim())`
  nên rỗng ≡ vắng, mô phỏng đúng.
- Eval vẫn chạy với env đầy đủ (eval model thật, eval Zalo thật cần khoá).
- **Chế độ THAY, không THÊM (owner duyệt 06/10):** suite chạy một lần, ở env giống CI; dòng
  repin ghi `suites_env: "ci"`. Lý do bằng số: thêm một lượt suite là cộng vào ~12 làn/ngày ở
  crm (suite là phần cố định lớn nhất của làn trung vị 7 phút); còn một ca suite cần khoá
  thật thì CI cũng đỏ nó rồi — lượt «env đầy đủ» của suite không phủ thêm điều gì CI phủ, và
  nhánh «có khoá» đã do eval chạy với khoá. Đề bài nói «chạy thêm»; nếu owner giữ «thêm»,
  dòng repin mang thêm `suites_exit_ci` và làn dài thêm một lượt suite.
- Đỏ ở env giống CI → làn đỏ, nhãn «đỏ ở môi trường giống CI (biến rỗng: …)»; Đ4 áp như mọi lệnh.

**Răng.** Suite fixture đỏ khi biến rỗng: khoá khai → làn đỏ đúng nhãn; khoá vắng → xanh (đối
chứng, hành vi cũ); biến đặt rỗng thắng `.env` (ca dùng chính `bun` nếu có trên máy, không có
thì `node --env-file`); mutant «unset thay vì rỗng» → ca `.env` đỏ.

**Số đo trước/sau.** Trước: lỗi chỉ-CI của R1g lọt qua lượt dài 2, CI bắt sau 22 phút, tốn một
vòng sửa + lượt dài 3. Sau: phiên P4 đã tái hiện đúng ca đó «bằng env Zalo rỗng — cũ đỏ, mới
xanh» (LUAT 06/10 01:45) — tức làn có Đ3 bắt được nó trước khi mở PR. Ở crm đếm số lần CI đỏ
mà làn ghim lại cùng sha xanh, 14 ngày trước/sau.

### Đ2 — Carry kết quả eval theo băm đầu vào

**Vấn đề.** 59 % lần chạy eval trong làn ghim lại ở crm (1 726/2 912, 14 ngày) chạy lại một
eval mà diff không chạm `paths` của nó — kể cả eval gọi model thật (Gateway trả tiền mỗi lần).

**Thuật ngữ.** Đây là **carry** theo nghĩa của `CONTEXT.md` («mang kết quả xanh của lượt trước
sang lượt sau khi phần được đo không đổi — phải minh bạch»), mở rộng từ S4 sang làn ghim lại.
Không gọi là «cache».

**Cơ chế.**
- Khoá `feature_loop.repin_carry: paths` (vắng = chạy hết như cũ) +
  `feature_loop.repin_carry_env: [TÊN, …]` (biến mà giá trị góp vào băm, ví dụ id model).
- **Băm đầu vào** của một eval máy (hàm thuần ở bên viết — `feature-loop/scripts/lib/`, khối
  marker `CARRY-INPUT-HASH`; ma trận C và các bản sao bị phá giữ nó):
  - *định nghĩa*: khối của eval trong `evals.yaml` + lệnh đã giải;
  - *tệp*: danh sách `đường<TAB>blob` của tệp git-theo-dõi tại `sha` của làn (`git ls-tree
    -r`) khớp `paths` (CÙNG `evalPathsOf` + glob mà `staleByPaths` dùng), HỢP với **mọi tệp mà
    lệnh đã giải gọi tên** — rút bằng CHÍNH hàm gọi-tên một nguồn của Đ1 (tệp setup nạp trước,
    spec nêu trong lệnh, script thước dưới `_acceptance/`), không giới hạn ở `_acceptance/`
    (phản biện 06/10, P0: 394 eval crm nạp `setup-dom.ts` mà `paths` không liệt);
  - *env*: băm của `TÊN=giá trị` cho từng tên khai — giá trị **không bao giờ** được ghi ra.
- **Luật carry (bên viết):** eval có `paths`, lệnh giải được trọn (Đ1 — có biến hay token không
  giải được thì eval luôn chạy), cây sạch (không `--allow-dirty`), và run-log của chính hồ sơ có
  một dòng `repin` xanh mà eval đó **thật sự chạy** (không carry ở đó), cùng băm, cách lượt này
  ≤ 7 ngày → không chạy, mang mã thoát của lượt đó. Dòng mới ghi
  `evals_hash` cho mọi eval máy và `evals_carry: {Eid: <run_id nơi nó thật sự chạy>}` (chuỗi
  carry dàn phẳng — luôn trỏ về lượt chạy thật). Suite **không bao giờ** carry.
- **Lượt chạy thật buộc tự kiểm carry:** quá 7 ngày, eval chạy lại; nếu băm **bằng** băm cũ mà
  mã thoát **khác** → `paths` của eval thiếu đầu vào → dòng repin ghi `carry_lech: [Eid]`, tổng
  kết in đỏ, và eval đó thôi carry tới khi băm đổi. Đây là ngưỡng đang đếm của giới hạn
  «`paths` không đủ» (bên dưới) — máy giữ, không dặn bằng lời.
- **Bên đọc** (hàm mới cạnh `checkRepinEvals`, cả `pre-merge-check.sh` lẫn `recheck-evidence.cjs`
  gọi): mỗi id trong `evals_carry` phải có dòng nguồn trong run-log của chính hồ sơ, `kind:
  repin`, đã chạy id đó, cùng băm, cùng mã thoát, và ts dòng nguồn cách ts **dòng chống lưng**
  ≤ 7 ngày — so hai dòng với nhau, KHÔNG so với giờ hiện tại (so giờ hiện tại thì 8 ngày sau
  một pin không gì đổi, CI tự đỏ — trái luật ghim lại theo release). Lệch → VIOLATION. Luật chỉ
  dùng hàm trong lớp CI vendored (`lib/evidence-core.cjs`, `lib/eval-yaml.cjs`), không nạp gì
  của `feature-loop/` — kho tiêu thụ không có thư mục đó. Bộ đọc 2.22.0 (bản vendored ở CI kho
  tiêu thụ) bỏ qua khoá lạ và vẫn thấy `evals_exit` đủ → **đọc được dòng mới** (đường đọc-cũ).
- Lượt S4 không ghi băm → lượt ghim lại đầu tiên sau khi cài chạy trọn, rồi mới có nguồn carry.
- Hợp với Đ1: đổi một tệp test mà `zalo-va` gọi tên → chỉ eval có `paths` chứa tệp đó HOẶC có
  lệnh gọi tên tệp đó đổi băm và chạy lại; eval khác carry.

**Giới hạn khai (kèm ngưỡng):** `paths` thiếu đầu vào → carry xanh sai — ngưỡng là
`carry_lech` ≥ 1 ở bất kỳ kho nào thì mở vòng siết luật carry. Env ngoài danh sách (phiên bản
runtime, dịch vụ ngoài, model trôi theo thời gian) không vào băm — trần 7 ngày chặn tuổi. Tệp
chưa theo dõi vô hình với git (như `--skip-unchanged`, ADR 0019).

**Răng.** Fixture hai eval E1 (`paths: a.ts`), E2 (`paths: b.ts`): lượt 1 chạy cả hai; đổi
`b.ts` → lượt 2 chỉ chạy E2 (tệp đếm chứng E1 không chạy), carry E1; đổi khối E1 trong
`evals.yaml` → chạy E1; đổi giá trị biến khai → chạy; nguồn quá 7 ngày → chạy; khoá vắng →
chạy hết (đối chứng). Bên đọc: dòng carry viết tay thiếu nguồn → VIOLATION; mã carry khác
nguồn → VIOLATION; bộ đọc `v2.22.0` (`git archive`) đọc dòng mới xanh. Mutant: băm bỏ vế
*tệp* → ca «đổi b.ts» đỏ; chuỗi carry không dàn phẳng → ca bên đọc đỏ.

**Số đo trước/sau.** Trước (đã đo): 1 726/2 912 lần chạy eval carry được trong 14 ngày. Sau
khi dựng: chạy lại phép đo bằng **chính hàm băm mới** trên 203 cặp (số chính xác thay số ước),
tách riêng eval trong `model_evals` của crm × giá một lượt gọi.

---

## 3. Khoá config (mọi khoá bật theo lựa chọn; vắng = hành vi 2.22.0, trừ ba phần chỉ-thêm của Đ5 bật mặc định — §Đ5)

| Khoá | Điểm | Giá trị gợi ý cho crm (crm tự thêm, không từ phiên này) |
|---|---|---|
| `risk_tiers.test_globs` | Đ1 | `["**/test/**", "**/*.spec.ts", "**/*.test.ts", "**/*.dom.tsx"]` |
| `feature_loop.repin_retry` | Đ4 | `1` |
| `feature_loop.model_evals` | Đ4, Đ5 (Đ2 đếm) | `[tro-ly-doc-kho/E15, …]` — crm liệt kê |
| `feature_loop.repin_budget_min` | Đ5 | `80` (dưới trần 90 phút của công cụ) |
| `feature_loop.repin_cost_cmd` | Đ5 | lệnh in số dư AI Gateway — cần kiểm khi bật |
| `feature_loop.repin_ci_blank_env` | Đ3 | `[ZALO_BOT_TOKEN, …]` — crm liệt kê |
| `feature_loop.repin_carry` | Đ2 | `paths` |
| `feature_loop.repin_carry_env` | Đ2 | tên biến chọn model |

Hằng số không thành khoá (YAGNI): carry tối đa 7 ngày · không chạy lại lệnh dài hơn 30 phút ·
SIGKILL sau SIGTERM 10 giây.

## 4. Lược đồ dòng `repin` — chỉ THÊM khoá tuỳ chọn, rỗng thì vắng hẳn

`chap_chon` (Đ4) · `suites_env` (Đ3) · `evals_hash`, `evals_carry`, `carry_lech` (Đ2) ·
`tong_ket` (Đ5). `repin-do` thêm `ly_do: vuot-tran | bi-ngat`. Mã thoát mới 4. Khuôn
REPIN-TEMPLATE trong SKILL cập nhật cùng lượt, thứ tự khoá dựng bằng `Object.assign` như hiện có.
Đổi chạm bên đọc: `lib/evidence-core.cjs` (Đ1 hàm gọi tên, Đ2 băm + luật carry) và
`scripts/pre-merge-check.sh` (Đ1) — hai tệp thuộc lớp CI vendored, kho tiêu thụ chép lại ở
chiến dịch phát hành.

## 5. Đóng gói

- **Một vòng feature-loop T3** trong kit, slug đề xuất `gia-lan-ghim-lai`, `Gốc:` như đầu tệp.
  Bốn lượt gọi người theo thiết kế (Cổng Đáng · Cổng 1 · Cổng 1.5 · Cổng 2) = trần T3.
- **Thứ tự thi công Đ1 → Đ4 → Đ5 → Đ3 → Đ2.** Đ5 lên trước Đ3/Đ2 vì nó nhỏ và là lưới cho mọi
  thứ chưa biết (lượt bị ngắt không vết là một trong ba nguồn giờ chết của R1g). Đ2 đi cuối dù
  tiết kiệm lớn nhất theo số đếm (59 %), vì nó là điểm duy nhất đổi cái được tính là «đã chứng»
  và chạm bên đọc — nên nó là **đuôi cắt được**.
- **Chính sách chốt ở Cổng Đáng (một lần, máy áp về sau):** S4 đỏ hai lượt liên tiếp mà chỉ ở
  AC của Đ2 → park Đ2 thành hạt giống, ship Đ1/Đ4/Đ5/Đ3. Không AC nào đổi mặc định của kho
  không bật khoá.
- **Phát hành:** mốc 2.23.0 cắt khi vòng gộp — crm đang chờ nhận (luật (b): mốc chỉ cắt khi có
  kho chờ nhận). Rollout ở crm (phiên crm làm): cập nhật plugin, chép lại lớp CI vendored, thêm
  khoá §3, liệt kê `model_evals` và `repin_ci_blank_env`.

## 6. Không làm ở đây

- Tách E11 khỏi `tra-loi-tin-nhac`, job kiểm chéo sau gộp (crm #277 `kiem-cheo-sau-gop`).
- Làm kín ca chập chờn, dọn `.eve` sót (crm #277 `ca-chap-chon-cach-ly`).
- Chấm eval model theo biên thống kê (crm #277 `eval-model-that-dung-luc`, phần chấm).
- Thước tự hết hạn (crm #277 `thuoc-khong-tu-het-han`).
- Thẻ Cổng 2 in phát hiện mức thấp trong hợp đồng — chip đã có ở phiên P4.
- Carry trong vòng S4 (acceptance-verify) bằng băm — S4 đã có carry P1 theo `paths`; hợp nhất
  hai bộ đọc `paths` là hạt giống đã có (`pathsCuaEval` trong repin-lane, ngưỡng ghi ở chú
  thích tệp).
- Chạy lại theo **ca** (đặc thù bộ chạy test) và cắt theo token chính xác.

## 7. Ghi cho chủ kho crm (không sửa từ phiên này)

1. onehub **chưa bật** `risk_tiers.stale_scope: paths` (có từ 2.21.0). Một dòng config, giảm
   hoá cũ cho hồ sơ có `paths` hẹp — không cứu E11 (`apps/**` khớp mọi thứ).
2. E11 (`tra-loi-tin-nhac`) khai `paths: apps/**, packages/**, docs/**, CONTEXT.md` và chạy lại
   mọi hồ sơ đã ký bị chạm → mọi lần ghim lại hồ sơ này trả trọn lượt dài (#277 đang xử lý).
3. Tái hiện lỗi chỉ-CI phải đặt biến **rỗng** (`ZALO_BOT_TOKEN= …`), **không** `env -u`: Bun nạp
   lại `.env` khi biến vắng (đo 06/10). Nếu có mã đọc khoá bằng `??` thay vì `?.trim()`, rỗng
   sẽ bị coi là «có khoá» — soát khi liệt kê `repin_ci_blank_env`.
4. 57 eval máy chưa khai `paths` (14 ngày qua) — không bao giờ carry được, và khi bật
   `stale_scope: paths` thì cả hồ sơ của chúng rơi về luật cũ (`eval-may-thieu-paths`).
5. Công tắc `SOKR_KHONG_CHAY_AGENT_CU=1` đang dùng tay cho một lượt dài; nên thành sổ cách ly
   có tên (#277 `ca-chap-chon-cach-ly`).
