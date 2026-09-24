---
schema_version: 1
slug: ha-tang-khong-dot-luot
feature: Hạ tầng thôi đốt lượt chấm và lượt gọi người — suite scripts chạy được dưới trần công cụ, lượt BLOCKED vì hạ tầng thử lại cùng round thay vì thành round mới hay câu hỏi cho người, và thẻ Cổng 1 của hồ sơ đã khép thôi hỏi; để kho tiêu thụ cài 2.18.3 không gặp lại ba hình này
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-09-23T23:48:08Z   # owner gọi tên vòng meta duy nhất của cửa sổ sau 2.18.2 (24/09) kèm ba hạt giống, máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/ho-so-khep-thoi-hoi — round 1 BLOCKED (`e325b918`) vì công cụ ngắt suite scripts ở 600 s; `s4-args.mjs` đánh số lượt chấm lại thành «round 2» (run-log: round-tally round 1 BLOCKED rồi round 2 PASS) thay vì thử lại cùng round
Gốc: acceptance-gate-kit/_acceptance/release-2-18-1 — Known limit 4: suite scripts 601 s trên cây của chính mốc, qua trần 600 s của Bash tool trong tác tử chấm
Gốc: crm/_acceptance/kiem-auth-khong-phu-thuoc-thu-tu — round 3 (23/09 05:15Z) BLOCKED vì agent chạy E5 chết; phiên (kit 2.18.1) khai «đủ 3 round, là trần», hạ hợp đồng về `implemented`, không dựng thẻ Cổng 2 và hỏi owner chọn ba lối, kèm một finding TRONG hợp đồng (AC-7) đẩy sang người
Gốc: crm/_acceptance/cua-vao-noi-tieng-viet — hồ sơ `da-cham-boi-thuc-te` (observed 21/09) không có `evidence-report.md`; thẻ trên kit 2.18.1 (crm PR #78) vẫn in ô hỏi «duyệt hay sửa»
Gốc: crm/_acceptance/tieng-viet-cho-crm — cùng hình, cùng ngày đo (thẻ hồ sơ khép ở crm 5/7 = 0 ô hỏi, 2/7 còn hỏi → Cổng Giá trị `ho-so-khep-thoi-hoi` ra iterate)

**Ai gặp:** owner (lượt gọi người ngoài thiết kế khi lượt chấm chết vì hạ tầng; thẻ hồ sơ đã
khép vẫn hỏi) · phiên Claude Code chạy vòng ở kit và ở kho tiêu thụ (Stop hook của `/goal` coi
BLOCKED là điểm dừng; round đầu của mọi vòng kit BLOCKED vì suite qua trần) · chi phí máy của
mỗi vòng (≈ 27 phút + một lượt chấm lại mỗi lần hạ tầng đốt).

**Cơn đau, đo 22–24/09** (ba hạt giống ở `docs/plans/`):
1. `docs/plans/2026-09-22-hat-giong-suite-scripts-qua-tran-cong-cu.md` — suite scripts 528 s →
   581 s → 595 s → **601 s**; trần 600 s là của công cụ chạy lệnh, không của kit. Mọi vòng kit kế
   thêm ca vào suite gần như chắc chắn BLOCKED ở lượt chấm đầu.
2. `docs/plans/2026-09-23-hat-giong-goal-template-coi-blocked-la-xong.md` — ba chỗ cãi nhau:
   SKILL feature-loop S4 «BLOCKED → chạy lại CÙNG round» · `s4-args.mjs` đếm round từ
   `## Iterations` nên lần thử lại thành round mới · khối `GOAL-TEMPLATE` coi BLOCKED là
   HOÀN THÀNH, mang mệnh lệnh «set contract … status: verified» (kẹt Stop hook khi hồ sơ đi
   làn V, 22/09) và vế «không chắc = chưa hoàn thành». Đốt 6 lượt trong 4 ngày ở crm. Vòng
   `nhan-trang-thai-va-reality` (2.18.0, AC-7) đã thiết kế đúng ca này — `lib/nhan-canh-gay.cjs`
   đọc `daThuLai` = ≥ 2 dòng round-tally BLOCKED CÙNG round — nhưng hai mảnh chưa nối, nên cả
   hai lượt BLOCKED thật sau 2.18.0 đều không đi qua đường thử-lại-cùng-round.
3. `docs/plans/2026-09-22-hat-giong-the-cong-1-ho-so-khep-van-hoi.md` — `scripts/gate-card.js`
   chọn nhánh cổng theo `evidence-report.md` TRƯỚC khi hỏi vị từ «đã khép»; hồ sơ khép chưa từng
   có lượt chấm rơi vào nhánh Cổng 1 và vẫn in ô hỏi. Phần iterate của ô `ho-so-khep-thoi-hoi`.

Hồ sơ này là **vòng meta duy nhất** của cửa sổ giữa mốc 2.18.2 (crm nâng plugin ở mọi scope
sống 24/09) và mốc kế crm sẽ cài — owner gọi tên 24/09 (luật chiều rộng (b)).

## Giả định chốt sinh tử

1. **Đổi cách CHẠY suite, không đổi thứ suite đo.** Tách mảnh/chạy nền không làm mất ca nào:
   tổng số ca của các mảnh = số ca của suite nguyên; một ca đỏ tiêm vào bất kỳ mảnh nào vẫn làm
   làn đỏ. Sai nếu một mảnh im lặng nuốt ca.
2. **Lượt BLOCKED vì hạ tầng (nhãn `chet`/`mu`) không đếm vào trần; BLOCKED còn finding TRONG
   hợp đồng là REJECT về bản chất và đếm bình thường.** Sai nếu phân biệt đó đòi đổi enum nhãn
   hay đổi thiết kế AC-7 của 2.18.0 — vòng này NỐI, không đổi thiết kế đã ký.
3. **Khuôn `/goal` mới vẫn dán được và goal cũ đang chạy không gãy** (đường đọc-cũ): điều kiện
   hoàn thành chỉ xét phiên chính đã trình thẻ Cổng Bằng chứng hoặc dừng ở cổng có tên.
4. **Vị từ «đã khép» một nguồn** (`checkThucTe` / `NGHI` đã có) hỏi trước khi chọn nhánh cổng;
   hồ sơ sống vẫn có ô hỏi như cũ ở cả hai nhánh.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Sau khi crm cài 2.18.3, hạ tầng (suite qua trần, agent chết) còn đốt lượt chấm hay lượt gọi người nào không, và thẻ hồ sơ đã khép còn hỏi không?
- Kết quả nào là SỐNG: round 1 của chính vòng này không BLOCKED vì trần công cụ; một lượt BLOCKED-vì-hạ-tầng (chạy thật hoặc tái lập) được thử lại CÙNG round, không thành round mới, không sinh câu hỏi cho người; thẻ hồ sơ đã khép ở crm 7/7 = 0 ô hỏi; khuôn goal không còn BLOCKED trong vế hoàn thành và không còn mệnh lệnh trạng thái tệp.
- Kết quả nào là CHẾT: round 1 của vòng này BLOCKED vì trần công cụ; hoặc một mảnh suite nuốt ca; hoặc thẻ hồ sơ khép ở crm còn ≥ 1 ô hỏi sau cài; hoặc vòng cần > trần lượt gọi người.
- Timebox: 2026-10-01 — quá hạn mà crm chưa cài 2.18.3 thì chính việc ấy là tín hiệu.

| Số | Trước 24/09 | Ngưỡng UAT | Chết |
|---|---|---|---|
| lượt chấm bị trần công cụ đốt (vòng này, round 1) | 1/1 vòng kit gần nhất | 0 | ≥ 1 |
| ca của các mảnh suite so suite nguyên | — | bằng nhau | lệch |
| BLOCKED-vì-hạ-tầng thành round mới | 2/2 lượt thật sau 2.18.0 | 0 | ≥ 1 |
| câu hỏi cho người sinh từ BLOCKED-vì-hạ-tầng | 1 (crm kiem-auth) | 0 | ≥ 1 |
| ô hỏi trên thẻ hồ sơ đã khép ở crm | 2/7 | 0/7 | ≥ 1 |
| lượt gọi người của vòng | — | ≤ trần hạng | > trần |

## Kết quả prototype

Không có bản mẫu — vòng đổi engine; mặt người chỉ đổi ở thẻ (bớt một ô hỏi) và ở khuôn `/goal`.

## Nguồn ngoài & phạm vi kế thừa

- Luật: khối ĐỊNH VỊ (K8 — CA DỪNG: *hệ thống chết* → thử lại MỘT lần) trong `CLAUDE.md` ·
  ADR 0020 · ADR 0002 · ADR 0018 (vòng này TRỪ + vá điểm + đổi cách chạy, không CỘNG).
- Dùng lại, không dựng mới: `lib/nhan-canh-gay.cjs` (`daThuLai`, nhãn `chet`/`mu`) · dòng
  `round-tally` của run-log · vị từ «đã khép» của `ho-so-khep-thoi-hoi` (AC-6) · ca P85
  (GOAL-TEMPLATE ↔ GUIDE ↔ gate-card) đổi cùng khối.
- Kế thừa từ `nhan-trang-thai-va-reality` (AC-7) và `ho-so-khep-thoi-hoi` (AC-6).

## Cổng 0

Owner gọi tên 24/09 kèm ba hạt giống — lối *build*. Lối khác đã cân ở hạt giống: *park* thì mỗi
vòng kit kế trả thêm một lượt chấm và ≈ 27 phút máy vì trần công cụ, và crm tiếp tục nhận câu
hỏi ngoài thiết kế khi agent chết. Hạng theo `t3_paths`: S0 phân loại.

Tuỳ chọn, CỘNG, chỉ khi owner phê ở Cổng Phạm vi:
`docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md` (răng bên đọc; vế 2 owner
đã không phê ở 2.18.2). Mặc định: NGOÀI phạm vi.

## Thước đo thành công → ứng viên criterion

S1 rút thành AC Given/When/Then, mỗi AC một chiều đỏ và một chiều im:
1. **Suite dưới trần** — đo thời gian từng ca trước khi chọn cách; lệnh khai/đo > 80 % trần công
   cụ chạy nền có chờ, hoặc suite tách mảnh mỗi mảnh dưới trần. Chiều đỏ: ca giả ngủ quá trần →
   làn không BLOCKED; gỡ cơ chế → BLOCKED như hôm nay. Chiều im: tổng ca các mảnh = suite nguyên.
2. **Thử lại cùng round** — `s4-args.mjs` bỏ lượt round-tally BLOCKED-vì-hạ-tầng khi đánh số.
   Chiều đỏ: run-log round 1 BLOCKED (nhãn chet) → args ra round 1; chiều im: round 1 REJECT →
   round 2 như cũ; BLOCKED còn finding trong hợp đồng → đếm như REJECT.
3. **Khuôn `/goal`** — vế hoàn thành chỉ xét thẻ Cổng Bằng chứng đã trình hoặc dừng ở cổng có
   tên; không «BLOCKED» trong vế hoàn thành, không «status:». Ca đọc SKILL rút khối bằng marker;
   P85 vẫn giữ ba bản khớp. Bước S4 BLOCKED nói rõ lượt chạy lại không đếm vào trần.
4. **Thẻ hồ sơ khép** — vị từ «đã khép» hỏi trước khi chọn nhánh cổng. Chiều đỏ: hồ sơ
   `da-cham-boi-thuc-te` không có `evidence-report.md` → `--extract` không có nhãn hỏi; chiều
   im: hồ sơ `approved` thường → nhãn hỏi Cổng 1 như cũ.

## Out of scope từ khám phá

- Không đổi enum nhãn cạnh gãy, không đổi thiết kế AC-7 của 2.18.0 — chỉ nối.
- Không đổi thứ suite đo, không xoá ca để lọt trần (trừ khi đo từng ca chỉ ra ca đắt trùng lặp
  — khi ấy vẫn là quyết định có tên trong hợp đồng).
- Răng bên đọc `verified_at`/chữ ký — CỘNG, chỉ vào khi owner phê ở Cổng Phạm vi.
- Rollout 2.18.3 ra kho khác ngoài crm — chiến dịch theo release.
