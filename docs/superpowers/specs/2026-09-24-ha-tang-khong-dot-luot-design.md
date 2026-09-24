# Thiết kế — hạ tầng thôi đốt lượt chấm và lượt gọi người (`ha-tang-khong-dot-luot`)

**Ngày:** 2026-09-24 · **Hồ sơ:** `_acceptance/ha-tang-khong-dot-luot/` · **Hạng:** T2 (không tệp nào
khớp `t3_paths`: `hooks/**`, `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`)
· **Vòng meta duy nhất** của cửa sổ sau 2.18.2 (owner gọi tên 24/09).

## 1. Vấn đề — một lớp, ba mặt

Cả ba hạt giống là CÙNG một lớp: *hạ tầng làm hỏng một lượt, và kit tính lượt hỏng ấy như một
lượt của vật hoặc như một câu hỏi cho người.* Khối ĐỊNH VỊ (K8 — CA DỪNG) đã khai luật đúng:
việc chỉ tự sinh từ *sai hợp đồng* (máy sửa vật) và *hệ thống chết* (thử lại MỘT lần). Vòng
2.18.0 dựng bên ĐỌC của luật ấy (`lib/nhan-canh-gay.cjs`: nhãn `chet`/`mu`, `daThuLai`), nhưng ba
chỗ bên VIẾT/bên ĐIỀU PHỐI chưa nối:

| Mặt | Chỗ đứt | Đo |
|---|---|---|
| A. Suite qua trần công cụ | suite scripts 601 s > 600 s của Bash tool trong tác tử chấm | round 1 `ho-so-khep-thoi-hoi` BLOCKED |
| B. Lượt BLOCKED thành round mới | `s4-args.mjs` đếm round = max(`## Iterations`) + 1, không đọc nhãn | 2/2 lượt BLOCKED thật sau 2.18.0 không đi đường thử-lại-cùng-round |
| C. Khuôn `/goal` coi BLOCKED là xong | khối GOAL-TEMPLATE (từ 30/07) liệt BLOCKED vào vế hoàn thành, đòi «set status: verified», ép «nêu lối để người chọn» | crm `kiem-auth` round 3: một lượt gọi người ngoài thiết kế + finding trong hợp đồng đẩy sang người |
| D. Thẻ hồ sơ khép vẫn hỏi | `gate-card.js` chọn nhánh Cổng 1 theo status/`evidence-report.md` TRƯỚC khi hỏi «đã khép» | crm 2/7 thẻ hồ sơ khép còn ô hỏi |

B và C là hai nửa của một luật; A là nguyên nhân hạ tầng thường gặp nhất ở kho kit; D là phần
iterate của ô `ho-so-khep-thoi-hoi`.

## 2. Thiết kế từng mặt

### 2.A Suite scripts dưới trần công cụ — ĐO trước khi chọn

Đo trước khi chọn (§5): trên máy rảnh suite scripts chạy **498,5 s** — ca bash 138,5 s, 54 tệp
`*.test.mjs` 358,7 s; hai tệp đắt nhất `repin-lane-noi-ra` 93,3 s và `gate-card-lmcms` 77,0 s. Con
số 601 s của mốc 2.18.1 là suite ấy chạy cùng tám tác tử chấm song song (hệ số tải ≈ 1,2). Không
ca nào một mình gần trần; cái gần trần là TỔNG. Vậy dạng nghiệm đúng tầng là **tách mảnh**, không
phải cắt ca hay đổi cách tác tử chạy lệnh.

**Bộ chọn mảnh trong chính runner** (`tests/scripts/run-tests.sh`), qua biến môi trường
`SCRIPTS_SHARD`:

| Giá trị | Chạy gì |
|---|---|
| vắng hoặc `all` | như hôm nay: mọi ca bash + mọi tệp `*.test.mjs` (CI, người gọi tay) |
| `bash` | mọi ca bash; vòng lặp tệp `*.test.mjs` bị bỏ qua |
| `mjs:<i>/<n>` | CHỈ các tệp `*.test.mjs` có chỉ số (theo thứ tự glob, đã loại `wf-usage.test.mjs` như hôm nay) `≡ i−1 (mod n)`; thoát trước ca bash đầu tiên |

`SCRIPTS_SHARD_LIST=1` in danh sách tệp của mảnh đang chọn rồi thoát — in bằng CHÍNH hàm chọn tệp
mà lượt chạy dùng (`mjs_cua_manh`), nên danh sách và lượt chạy không thể trôi khỏi nhau. Ca «có ít
nhất một `*.test.mjs` được chạy» đi theo mảnh mjs (mỗi mảnh phải có ≥ 1 tệp).

`feature_loop.suite_keys` thay `executors.test.scripts` bằng ba khoá `scripts_bash`,
`scripts_mjs_1`, `scripts_mjs_2`. Bộ chấm S4 đã chạy lệnh suite TUẦN TỰ (thuoc-co-cua AC-9), nên
tổng thời gian không đổi; mỗi lệnh riêng lẻ nằm dưới trần. Ước mảnh nặng nhất: ≈ 265 s máy rảnh
(nếu hai tệp đắt rơi cùng mảnh) → ≈ 320 s dưới tải, dưới ngưỡng 80 % (480 s). Mảnh chia theo chỉ
số chứ không theo thời gian đo: danh sách cân bằng theo số đo là danh sách viết tay, trôi ngay khi
thêm ca.

**Đã cân và LOẠI:**
- *Chạy nền có chờ trong prompt tác tử chấm* — là lời dặn cho LLM, không có răng; tác tử chết giữa
  lúc chờ thì lượt vẫn cháy. Hiến pháp cấm dặn-bằng-lời làm nghiệm.
- *Cắt ca đắt* — không ca nào quá trần; cắt là đổi thứ suite đo để lọt thước.

### 2.B `s4-args.mjs`: lượt BLOCKED vì hạ tầng thử lại CÙNG round

Luật đánh số mới, một chỗ, trong `s4-args.mjs`:

1. `base` = max(số round trong `## Iterations`, round của các dòng `round-tally` có số). Không có
   gì → round 1 như cũ. (Hôm nay chỉ đọc Iterations; lượt BLOCKED sớm không soạn báo cáo nên
   Iterations có thể thiếu round cuối — đọc cả tally là để hai nguồn không trôi.)
2. Dòng `round-tally` CUỐI của round `base` có verdict `BLOCKED` và **cả ba** điều sau đúng →
   `round = base` (thử lại cùng round, KHÔNG đếm vào trần):
   - `canhGay(...)` của `lib/nhan-canh-gay.cjs` (bên đọc DUY NHẤT của nhãn — gọi hàm, không chép
     luật) trả `trangThai ∈ {chet-lan-dau, mo}`, tức mọi mục chặn mang nhãn `chet` hoặc `mu`;
   - `daThuLai` là false (chưa có lượt thử lại nào cho round này — K8: thử lại MỘT lần);
   - không có dòng `kind: finding` nào của CÙNG lượt (cùng `round`, cùng `ts` với dòng tally)
     mang `inContract: true`. Có → lượt ấy là REJECT về bản chất: máy sửa vật, round kế đếm.
3. Ngược lại → `round = base + 1` như cũ.
4. `--round N` tường minh vẫn thắng (đường cũ, không đổi).
5. Đã thử lại một lần (`daThuLai`) mà vẫn BLOCKED-hạ-tầng → script vẫn ra `base + 1` nhưng in
   MỘT dòng stderr «round <base> đã thử lại một lần vẫn chặn vì hạ tầng — trình thẻ Cổng Bằng
   chứng (cạnh gãy), không chấm tiếp» để SKILL không có cớ tung thêm lượt.

`round = base` với `base ≥ 2` vẫn phải khai `--carry-anchor`/`--no-carry` (luật cũ giữ nguyên).

**Vì sao đọc nhãn chứ không đọc «vật có đổi không»:** phương án «thử lại cùng round khi cây
ngoài `_acceptance/` không đổi từ `sha` của dòng tally» đã cân và LOẠI: vá hạ tầng (tách suite,
đổi lệnh executor) là đổi cây, nên lượt sau vá hạ tầng sẽ bị đếm như round sửa vật — đúng ca
`ho-so-khep-thoi-hoi` cần sửa. Nhãn (`chet`/`mu`) + finding trong hợp đồng là dữ liệu bộ chấm đã
ghi, không suy diễn.

**run_id đúc trùng khi thử lại cùng round:** `minted-<slug>-<id>-r<round>` không mang mốc giờ,
nên lượt thử lại đúc lại cùng mã. Bộ đọc bằng chứng (`loadRunLogIds`) là phép có-mặt nên mã trùng
vô hại; `canhGay` đã tách lượt theo `ts`. Không đổi khuôn mã ở vòng này (khai ở Notes hợp đồng).

### 2.C Khuôn `/goal` và bước BLOCKED của SKILL

Khuôn mới (6 dòng, ba bản SKILL · GUIDE · hằng `gate-card.js`, P85 giữ khớp):

```
/goal Feature <slug>: coi là HOÀN THÀNH chỉ khi transcript cho thấy phiên chính
đã trình thẻ Cổng Bằng chứng của vòng này, hoặc đã dừng ở một cổng có tên — Cổng
Phạm vi, Gate 1.5, trần 3 round, dừng-vá, hoặc một DỪNG-lỗi có tên của skill.
Lượt BLOCKED vì hạ tầng chưa thử lại cùng round = CHƯA hoàn thành: máy thử lại, không hỏi.
Chỉ neo vào việc phiên đã trình trong transcript, không neo vào trạng thái tệp. Hoặc dừng
sau 15 turns.
```

Bỏ: vế BLOCKED-là-hoàn-thành · mệnh lệnh «set contract … status: verified» (kẹt Stop hook khi
hồ sơ đi làn V — contract sang `machine-cleared`, không bao giờ «verified» ở cuối lượt) · vế «dừng
mà không nêu lối để người chọn = chưa hoàn thành» (ép phiên dựng lối cho người đúng lúc luật S4
bảo tự chạy lại) · vế «mơ hồ/không chắc = chưa hoàn thành» (checker không có căn cứ ngoài
transcript; «cổng có tên» là căn cứ đọc được). Giữ: 15 turns · không nhắm `signed-off`.

Bước S4 BLOCKED trong SKILL: «trình NGUYÊN VĂN, khắc phục nguyên nhân, chạy lại — `s4-args`
tự đánh số: lượt hạ tầng ra CÙNG round, không đếm vào trần, thử lại MỘT lần; lượt còn finding
trong hợp đồng sửa như REJECT và round kế đếm; đã thử lại vẫn chặn → trình thẻ Cổng Bằng chứng
(cạnh gãy), không hỏi thêm.» Câu Gate 1.5 «khuôn coi chờ input người là hoàn thành» đổi thành
«khuôn coi dừng ở cổng có tên là hoàn thành». GUIDE mục /goal đổi đoạn «Vì sao template dài vậy».

Đường đọc-cũ: goal cũ đang chạy ở phiên nào vẫn chạy (khuôn chỉ là chữ người dán); bản mới chỉ
đổi chữ in ra ở thẻ Cổng 1 và SKILL.

### 2.D `gate-card.js`: vị từ «đã khép» hỏi TRƯỚC khi chọn nhánh cổng

Hôm nay `DA_KHEP` (từ bộ quét: `nghi` hoặc `thucTe`) chỉ được tính trong nhánh Cổng 2. Hồ sơ
`da-cham-boi-thuc-te` không có `evidence-report.md` rơi vào Cổng 1 (status lạ + không báo cáo)
và in «duyệt hay sửa». Sửa: rút lượt gọi bộ quét thành MỘT hàm dùng chung (`quetHoSo()`, gọi
một lần, nhớ kết quả), tính `DA_KHEP` trước nhánh cổng; nhánh Cổng 1 khi `DA_KHEP`: `routing.hoi`
rỗng, không dòng lệnh duyệt, không dòng goal, thêm dòng «hồ sơ đã khép … không còn câu hỏi nào
cho người» (cùng chữ AC-6 của 2.18.1). Hồ sơ sống: Cổng 1 như cũ. Giá: thẻ Cổng 1 thêm một lượt
`start-scan` (đo S4-r1 của hồ sơ cũ: +0,45 s) — chấp nhận, thẻ không nằm trên đường nóng.

## 3. Độ phủ (Zwicky rút gọn, preset test-matrix)

- **Trục 1 — kết cục lượt chấm cuối × nhãn**: PASS · REJECT · BLOCKED chet lần đầu · BLOCKED mu
  lần đầu · BLOCKED đã thử lại · BLOCKED có mục `vat`/không phân loại · BLOCKED hạ tầng + finding
  trong hợp đồng · BLOCKED sớm không báo cáo (Iterations thiếu round) → AC-3 toàn phần.
- **Trục 2 — bản khuôn goal**: SKILL · GUIDE · gate-card (P85) × tính chất (không BLOCKED trong
  vế hoàn thành, không `status:`) → AC-4.
- **Trục 3 — hồ sơ × nhánh cổng**: khép-thực-tế-không-báo-cáo · nghỉ-chưa-ký (draft/approved) ·
  sống draft · sống có báo cáo → AC-5.
- **Trục 4 — suite**: mảnh × (ca xanh, ca đỏ tiêm) + hợp các mảnh = suite nguyên → AC-1, AC-2.
- Later/Never: đổi khuôn run_id đúc (Never ở vòng này) · chạy-nền-có-chờ trong prompt tác tử
  chấm (xem §2.A) · răng bên đọc `verified_at`/chữ ký (CỘNG, chỉ khi owner phê).

## 4. Out of scope

- Đổi enum nhãn cạnh gãy, đổi thiết kế AC-7 của 2.18.0.
- Đổi thứ suite đo; xoá ca để lọt trần.
- Răng bên đọc `verified_at` chữ ký (`docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md`) — CỘNG.
- Rollout ra kho ngoài crm.

## 5. Phép đo từng ca suite scripts

Đo 24/09 trên cây `31041fb3`, máy không chạy lượt nào khác: đóng dấu giờ mỗi dòng đầu ra của
`bash tests/scripts/run-tests.sh`, gộp theo dòng tiêu đề ca. Kết quả `892 passed, 0 failed`.

| Nhóm | Giây |
|---|---|
| Tổng | 498,5 |
| 54 tệp `*.test.mjs` | 358,7 |
| ca bash (≈ 290 tiêu đề) | 138,5 |
| `repin-lane-noi-ra.test.mjs` | 93,3 |
| `gate-card-lmcms.test.mjs` | 77,0 |
| `hskt.test.mjs` | 39,9 |
| `duong-nen.test.mjs` | 20,4 |
| ca bash đắt nhất (`SA4`) | 10,3 |

Giới hạn đã khai: thời lượng là đại lượng máy — không ghim thành ca (ca theo đồng hồ là ca chập
chờn). Đường đo thật là dòng `round-tally` round 1 của chính vòng này.
