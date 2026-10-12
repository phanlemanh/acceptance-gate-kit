---
schema_version: 1
feature: Vòng mở thẳng bằng Feature Loop cũng bị đo cỡ — hợp đồng từ 13 tiêu chí không vào được Cổng Phạm vi khi chưa tách hoặc chưa có dòng sổ giữ có tên, 11–12 tiêu chí lên thẻ thành cờ vàng; khoảng đọc từ chính khối CAT-LUOT-CO của lượt cắt, năm chỗ dạy «5–15» nói cùng chính sách
slug: vong-mo-thang-bang-feature-loop
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/gate-card.js + scripts/cat-luot.mjs + mô-đun mới scripts/co-hop-dong.cjs + commands/approve.md + ba SKILL/khuôn + GUIDE + test — không chạm lib/**, hooks/**, lưới trước-merge.
surfaces: [cli, docs]
design_doc: docs/superpowers/specs/2026-10-12-vong-mo-thang-bang-feature-loop-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T09:15:00Z
---

# Acceptance Contract: vong-mo-thang-bang-feature-loop

## Context

Hàng S3c của lộ trình kit — mở lại OOS-1 của `vong-la-mot-ket-qua` (dòng sổ `d-20261011T002900Z-3`,
điều kiện mở lại «DP7 gộp» đã đạt 11/10). Chính sách cỡ 10/10 sống ở khối `CAT-LUOT-CO` nhưng răng chỉ
đứng ở lượt cắt lộ trình và chỉ đọc cỡ khai lúc cắt. Kết quả của vòng — dáng việc nền: mọi hợp đồng,
bất kể mở từ đâu, bị đo cỡ ở lối vào Cổng Phạm vi bằng bộ đọc tiêu chí chung; ba bên đọc (thẻ, bước S1
của Feature Loop, lệnh duyệt) cùng đọc một khoá máy sinh; đồng hồ cỡ đếm được hồ sơ lọt để phiên nghiệm
thu đọc ngưỡng Cổng Đáng. Số đo nền 12/10 ở `opportunity.md`.

## Criteria

- AC-1: Given khối `CAT-LUOT-CO` của `skills/cat-luot/SKILL.md`, When thẻ Cổng Phạm vi (`scripts/gate-card.js`, HTML lẫn `--extract`) và đồng hồ cỡ (`cat-luot.mjs --co`) chạy trên cùng kho thử, Then cả hai lấy khoảng từ chính khối ấy của SKILL nằm cạnh script trong gói qua mô-đun đọc chung `scripts/co-hop-dong.cjs` (`docKhoang`, `napKhoang` mà `cat-luot.mjs` xuất ra là CHÍNH hàm của mô-đun) — bản sao gói sửa khối (`tach_tu: 13` → `11`, `cho_phep_den: 12` → `10`) thì cùng hợp đồng draft 11 tiêu chí đổi từ cờ vàng sang cờ đỏ trên thẻ và từ nhóm `cho-phep` sang `phai-tach` trên đồng hồ; bản sao gỡ khối thì thẻ vẫn dựng (thoát 0) với cờ vàng «không đọc được khoảng cỡ», `co_hop_dong.loi` mang đúng thông điệp của bộ đọc khối và `chan: false`.
- AC-2: Given hợp đồng `status: draft` có lần lượt 1…16 tiêu chí (cỡ lẻ khai bằng gạch đầu dòng, cỡ chẵn bằng tiêu đề `### AC-n`), mỗi cỡ một ca không và một ca có dòng giữ hợp lệ trong `decisions.jsonl`, cộng hai ca biên — hợp đồng không có dòng tiêu chí nào đọc được, và 13 dòng tiêu chí mang 12 mã khác nhau — phần còn lại của hồ sơ đủ để thẻ không có cờ đỏ nào khác, When dựng thẻ Cổng 1, Then mỗi ca ra đúng bảng viết sẵn: ≤ 10 không cờ cỡ · 11–12 cờ vàng · ≥ 13 không dòng giữ → cờ đỏ đứng TRƯỚC khối «Hệ thống SẼ làm», câu gộp duyệt mang `___` thay chữ quyết, `--extract` khai `co_hop_dong` với `nhom: "phai-tach"`, `giu: null`, `chan: true` · ≥ 13 có dòng giữ → cờ vàng, `chan: false`, câu gộp mang `duyệt` · không đọc được tiêu chí → cờ vàng «không đọc được tiêu chí — chưa kiểm cỡ», `co_hop_dong.loi` có mặt, `chan: false` · 13 dòng 12 mã → `n: 12`, `nhom: "cho-phep"`, cờ vàng; văn của mọi cờ cỡ nêu đúng số tiêu chí của ca, ngưỡng lấy từ khối (cuối mục tiêu với cờ vàng, `tach_tu` với cờ đỏ), mã và lý do dòng giữ khi có, và cờ đỏ in chuỗi giữ nguyên văn — chuỗi rút từ HTML thẻ đỏ, ghép một lý do, ghi vào sổ rồi dựng lại thẻ thì `chan: false`; số ca bằng số phần tử ma trận (34, in ra).
- AC-3: Given `decisions.jsonl` trên ma trận viết sẵn {dòng giữ hợp lệ · chuỗi giữ dạng tổ hợp NFD · khoảng trắng trước chuỗi giữ · gạch ngắn «–» thay gạch dài · gạch thường «-» thay gạch dài · dòng giữ đứng sau một dòng JSON hỏng · chuỗi không dấu «giu co —» · chuỗi giữ nằm giữa câu · chuỗi giữ không kèm lý do (chỉ khoảng trắng sau dấu gạch) · hai dòng giữ · sổ rỗng · sổ vắng}, When thẻ dựng cho hợp đồng draft 14 tiêu chí và đồng hồ cỡ đọc cùng sổ trên bản hồ sơ đã chốt (`approved`), Then thẻ (`co_hop_dong.giu`, `chan`) và đồng hồ (`n_giu` của nhóm `phai-tach`) ra cùng kết luận ở mọi ca, đúng bảng: nhận · nhận · nhận · nhận · nhận · nhận · không · không · không · nhận (mã của dòng đầu) · không · không.
- AC-4: Given hợp đồng 14 tiêu chí không dòng giữ ở từng trạng thái đã qua Cổng Phạm vi (`approved` · `approved` làn V với `veto_state: mo` · `implemented` · `verified` · `signed-off` · `machine-cleared`), When dựng thẻ ép `--gate 1`, Then không cờ cỡ nào xuất hiện và `co_hop_dong.chan: false`; và trên mọi hồ sơ thật của cây kit đang kiểm có ≥ 11 tiêu chí và không ở `draft` (số hồ sơ > 0, in ra), thẻ Cổng 1 ép không mang cờ cỡ — trong khi bản chép từng hồ sơ ấy sang kho thử với `status: draft` mang đúng cờ theo cỡ (vàng 11–12, đỏ từ 13 khi sổ không có dòng giữ): trạng thái là thứ duy nhất lật cờ.
- AC-5: Given `--extract` của thẻ Cổng 1 trên hợp đồng draft 14 tiêu chí không dòng giữ, When rút khối marker `CO-HOP-DONG-CHAN` ở `commands/approve.md` và ở SKILL Feature Loop, Then cả hai khối mang một dòng điều kiện có cấu trúc `khi: co_hop_dong.chan = true → <khoá>: <giá trị> · …` mà đường khoá đúng bằng khoá thẻ phát ra (có mặt, giá trị `true`); dòng của Feature Loop có đúng `lan_v: khong · moi_nguoi: khong · loi_ra: tach, giu`, dòng của lệnh duyệt có đúng `ghi_duyet: khong · loi_ra: tach, giu` và khối nêu lối `sửa:` kèm chuỗi giữ bằng `GIU_CO_MO_DAU` của mô-đun; bản sao đổi tên khoá ở thẻ → ca đỏ nêu đúng hai tệp lệch; bản sao đổi `lan_v: khong` thành `lan_v: co` → ca đỏ ghim «khối cho làn V khi khoá đúng».
- AC-6: Given năm chỗ dạy cỡ (SKILL Feature Loop bước S1#3 và S1#4, Phase 1 bước 3 của skill `acceptance`, `skills/acceptance/references/contract-template.md`, `GUIDE.md` mục coverage), When ca đo dựng câu kỳ vọng «mục tiêu A–B · cho phép tới C · từ T» từ `docKhoang` của khối sống, Then mỗi tệp chứa câu ấy cùng tên khối `CAT-LUOT-CO` — ở SKILL Feature Loop thì có trong CẢ đoạn bước S1#3 lẫn đoạn bước S1#4 (rút theo đầu bước); và trên toàn cây dạy `skills/`, `feature-loop/`, `commands/`, `dieu-phoi/`, `GUIDE.md`, `README.md`, `QUICKSTART.md`, số dòng mang ngưỡng cỡ cũ (khoảng «5-15»/«5–15» hay «>15» cùng dòng với AC, criteria, tiêu chí hoặc Core) bằng 0 (in số tệp quét); bản sao sửa khối (`muc_tieu: 8-10` → `6-9`) thì ca đỏ liệt đúng bốn tệp; bản sao chèn «Core >15 → hợp nhất» vào một tệp NGOÀI bốn tệp (`skills/morphological-scan/SKILL.md`) thì ca đỏ nêu đúng tệp ấy.
- AC-7: Given kho thử có hồ sơ đã chốt (`approved`, `signed-off`, `machine-cleared`) và `draft`, cỡ trải bốn nhóm, mỗi nhóm có hồ sơ có và không dòng giữ, ngày chốt hai phía một mốc, When chạy `cat-luot.mjs --root . --co` và `--co --tu <mốc>`, Then `--tu` lọc theo ngày chốt phạm vi (`approved_at`, làn V thì `veto_opened_at`) — hồ sơ ≥ 13 không dòng giữ chốt trước mốc mà ký sau mốc KHÔNG vào nhóm của `--tu <mốc>` —, mỗi nhóm mang `n_giu` đúng giá trị tính tay trong ca (chỉ hồ sơ đã chốt, chỉ dòng giữ hợp lệ theo AC-3) và `n_chot − n_giu` của `phai-tach` bằng số hồ sơ ≥ 13 đã chốt không dòng giữ; các trường cũ của nhóm (`n_chot`, `n`, `luot_tb`, `cham_tran_pt`, `it_du_lieu`) bằng đúng đầu ra trên bản kho thử đã gỡ mọi dòng giữ.
- AC-8: Given khối `DEC-GIU-CO` của SKILL Feature Loop (dòng giữa cho khối `DEC-ID-RECIPE`), When ca đo rút khối, thay ô lý do, chạy NGUYÊN VĂN khối `DEC-ID-RECIPE` của cùng SKILL trong kho thử có hợp đồng draft 14 tiêu chí rồi dựng thẻ thật, Then dòng sổ mới parse được JSON với `type` và `stage` đúng khối, và thẻ nhận nó là dòng giữ (`chan: false`, `co_hop_dong.giu.id` bằng mã dòng mới); bản sao khối đổi một ký tự trong chuỗi giữ → thẻ trả `chan: true`, ca ghim «bên ghi lệch bên đọc».

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = một hợp đồng × lối vào Cổng Phạm vi, cộng
đồng hồ trên tập hồ sơ). Chân sản phẩm: chính sách cỡ `[SUY-TỪ-REPO: skills/cat-luot/SKILL.md]` (khối
`CAT-LUOT-CO`) · thẻ Cổng 1 và khái niệm thẻ đang đỏ `[SUY-TỪ-REPO: scripts/gate-card.js]` (`g1Blocked`)
· bộ đọc tiêu chí `[SUY-TỪ-REPO: lib/ac-line.cjs]` · đồng hồ cỡ `[SUY-TỪ-REPO: scripts/cat-luot.mjs]` ·
tiền lệ lối bỏ có tên `[SUY-TỪ-REPO: lib/gap-probe.cjs]` (`bỏ gap-probe —`) · số đo nền
`[SUY-TỪ-REPO: _acceptance/vong-mo-thang-bang-feature-loop/opportunity.md]`. Chân ngành: `[NGÀNH: Google
Engineering Practices — «Small CLs»]` (thay đổi nhỏ, tách theo kết quả) · `[NGÀNH: Danger JS — cảnh báo
«Big PR» theo ngưỡng cỡ]` (cảnh báo trước, chặn có lối thoát có tên).

- Trục A — cỡ hợp đồng: không đọc được tiêu chí | dưới mục tiêu | mục tiêu | cho phép | phải tách | mã trùng  [thước CE: khối CAT-LUOT-CO; ma trận 1…16 của vong-la-mot-ket-qua AC-2] → AC-2
- Trục B — dòng giữ: sổ vắng | sổ rỗng | không dòng giữ | giữ hợp lệ | biến thể chữ (NFD, khoảng trắng) | sai chuỗi | không lý do | dòng hỏng đứng trước | hai dòng  [thước CE: ma trận biến thể của tiền lệ `bỏ gap-probe` (tests/scripts/run-tests.sh, dòng 3175)] → AC-3, AC-8
- Trục C — trạng thái hồ sơ: draft | đã qua Cổng Phạm vi (approved · làn V · implemented · verified · signed-off · machine-cleared)  [thước CE: workspace-record DA_THONG; P161 dựng thẻ Cổng 1 ép cho mọi hồ sơ] → AC-4
- Trục D — bên đọc: thẻ HTML | `--extract` | lệnh duyệt | Feature Loop S1#5 (làn V) | đồng hồ cỡ | năm chỗ dạy  [thước CE: câu giao + ghi chú hàng S3c] → AC-2, AC-5, AC-6, AC-7
- Cross-cutting: một nguồn khoảng và khối hỏng (AC-1) · bên ghi ↔ bên đọc dòng giữ (AC-8).
- Later: răng cỡ ở hook ghi và lưới trước-merge (T3) · dòng giữ ≥ 13 phải qua người ở Cổng Phạm vi · gợi ý gộp hợp đồng dưới mục tiêu.
- Never: máy tự tách hợp đồng bằng mã (tách là phán đoán của phiên S1) · khoá khoảng cỡ theo kho (khoảng là chính sách của kit).

## Đường đo

Ngưỡng ở `opportunity.md` (Cổng Đáng 12/10, manh): ba mươi ngày từ ngày crm cài mốc chứa vòng, 0 hợp đồng
mới từ 13 tiêu chí qua Cổng Phạm vi mà không có dòng sổ giữ có tên, ở kit và crm.

- Số hợp đồng ≥ 13 lọt · số từ: `cat-luot.mjs --co --tu <ngày crm cài mốc>` trên kit và trên crm (`--tu` lọc theo ngày chốt phạm vi `approved_at`/`veto_opened_at`, không theo ngày ký — hồ sơ chốt dưới engine cũ không bị đếm), nhóm `phai-tach`, `n_chot − n_giu`, kèm `n_chot` làm N (N = 0 → chưa đo được) · AC-7, AC-3.
- Giả định G3 (lối giữ thành phản xạ) · số từ: cùng lệnh, tỉ lệ `n_giu / n_chot` nhóm `phai-tach` — đọc ở phiên nghiệm thu, không phải ngưỡng · AC-7.

## Out of scope

- OOS-1: Răng cỡ ở hook ghi (`hooks/**`) và lưới trước-merge (`scripts/pre-merge-check.sh`) — T3; mở khi đồng hồ đếm ≥ 1 hợp đồng ≥ 13 qua Cổng Phạm vi không dòng giữ.
- OOS-2: Đổi số trong khối `CAT-LUOT-CO` — chính sách, đổi ở PR riêng kèm số đo đồng hồ.
- OOS-3: Bắt dòng giữ ≥ 13 phải qua người ở Cổng Phạm vi — G3 đọc ở phiên nghiệm thu trước.
- OOS-4: Gợi ý gộp hợp đồng dưới mục tiêu (1–7) ở Cổng Phạm vi; sửa SKILL cắt lượt cho có lối giữ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/co-hop-dong.test.mjs` — tên ca = mã AC, biến `CHD_CASES` chọn ca; khoá executor
  `executors.script.chd_ac1…chd_ac8`.
- Vòng không cắt số, không gắn thẻ phát hành (kit đóng băng engine cho crm tới sau đợt thử 26–27/10); mốc
  nhắm 01/11.
- Giới hạn đo đã khai: AC-5 và AC-8 đo CHỈ DẪN (khối marker của SKILL và lệnh duyệt — dòng điều kiện có cấu trúc, so từng cặp khoá–giá trị) và ĐẦU RA của thẻ, không đo hành vi của một phiên Feature Loop thật ở S1#5. Ngưỡng: đồng hồ cỡ đếm ≥ 1 hợp đồng ≥ 13 qua Cổng Phạm vi không dòng giữ → đó cũng là ngưỡng mở OOS-1.
- PR #320 (A2, máy Macbook Pro) sửa sát cùng ba tệp (SKILL Feature Loop S1, Cổng 1 của thẻ, GUIDE) — đồng
  bộ main có A2 trước lượt chấm; dòng giữ theo ô `can_cu` của A2 nếu A2 gộp trước.
