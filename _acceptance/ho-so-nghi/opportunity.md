---
schema_version: 1
slug: ho-so-nghi
feature: Hồ sơ nghỉ — một sự thật «nghỉ» có sử liệu mà cổng, thẻ và bản đồ cùng rút từ một hàm; hồ sơ đã ký mà tiền đề chết hoặc vật đã đổi có chủ đích rời khỏi luật làn và luật cũ hoá, giữ nguyên chữ ký
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-09-19T09:29:17Z   # owner gật một chạm trong phiên 19/09 («duyệt mục tiêu 2.17.0 và gọi tên hai ô CỘNG»), máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: OneFlow/_acceptance/normalize-text-vi — dòng sổ 17/09 của owner: «kit không có trạng thái nghỉ, status giữ signed-off, nên vi phạm evals_exit vẫn chặn lưới và owner bỏ qua có ghi nhận mỗi lần merge»

Đồng ca ở chính kit: `_acceptance/release-2-16-0` (chiến dịch ghim lại 72 hồ sơ: 14 đỏ, 60 eval,
0 hồ sơ được ghim — Notes §4 xếp ba lớp, hai lớp là «vật đã đổi có chủ đích sau chữ ký»),
và `_acceptance/bo-qua-phai-thay-dinh-nghia-phep-do` (kit tự cho nghỉ bằng cách chuyển hợp
đồng vào thư mục `su-lieu/`; hợp đồng `thuoc-co-cua` dòng 103 tự thú «vì kit chưa có trạng
thái nghỉ cho vòng»).

**Gốc rễ không ở OneFlow.** Luật làn eval của kit (owner quyết 08/09, hai lần) nói: pin chưa
chứng là vi phạm ở MỌI lượt chạy, không mốc ngày, không phạm vi diff, lối ra duy nhất là ghim
lại. Luật ấy đúng, nhưng không có lối ra cho món nợ **không bao giờ trả được**: tiền đề ngoài
đã chết (kho nguồn plugin biến mất, API vendor bỏ model) hay chính kit đã cố ý đổi vật sau
chữ ký. Mọi kho từng gỡ một tính năng sẽ chạm.

**Ba bộ đọc, ba sự thật.** Cổng (`scripts/pre-merge-check.sh`) chỉ đọc một trường trạng thái
của hợp đồng, 0 lần đọc ô cơ hội. Thẻ và bản đồ rút từ `scripts/trang-thai-ho-so.cjs`, có
`da-dong-ho-so` suy từ `stage: archived` — nhưng chiếu vào ô «Đã bác từ khám phá», nên một hồ
sơ ĐÃ KÝ rồi nghỉ hiện trên bản đồ như bị bác lúc khám phá. Thư mục `su-lieu/` làm cổng mù
chỉ vì đường dẫn: bất kỳ ai giấu hợp đồng vào thư mục con là cổng bỏ qua — một lỗ fail-open
đang được dùng làm nghi thức.

**Người trả giá:** owner ở OneFlow — một lượt người mỗi PR từ 17/09, đúng «trạm thu phí»
kim chỉ nam gọi tên; kit — 58 hồ sơ lẽ ra ghim được nhưng 14 hồ sơ nghỉ-không-tên làm đỏ cả
làn; mọi kho tiêu thụ sẽ gỡ một tính năng.

**Trace:** nguyên tố 2 — chữ ký là sử liệu, không được giả (owner từ chối 17/09 việc đổi
status hay khai không-chạy để hợp thức hoá); cổng · thẻ · bản đồ phải đọc một sự thật.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | «Nghỉ» ghi được như một sự thật MỚI (dòng sổ có người + lý do, trường ghi thêm) mà không đổi `status` đã ký | Phải sửa chữ ký cũ → vi phạm luật sử liệu | Dựng fixture: hồ sơ signed-off + dòng nghỉ → ba bộ đọc cùng nói «nghỉ», `git log` hợp đồng không đổi dòng status | Chưa thử |
| 2 | Cổng rút được trạng thái từ CÙNG hàm với thẻ/bản đồ (bash gọi node như luật làn eval đã làm) mà không chậm hơn đáng kể | Cổng giữ bộ đọc riêng → hai sự thật tiếp diễn | Đo thời gian cổng trên kho kit (122 hồ sơ) trước/sau | Chưa thử |
| 3 | Hồ sơ nghỉ kiểu `su-lieu/` (kit) và kiểu OneFlow (status giữ nguyên + dòng descope) đọc được bằng đường đọc-cũ, cờ vàng, không bắt sửa | Kho cũ đỏ ngay khi nhận 2.17.0 | Chạy cổng mới trên bản sao kho kit và OneFlow | Chưa thử |
| 4 | Nghỉ là việc NGƯỜI quyết, đảo được (mở lại bằng một dòng sổ), nên không cần khoá model-invocation riêng ngoài nếp của sổ quyết định | Máy tự cho nghỉ để xanh → bằng chứng tự dối | Răng: dòng nghỉ thiếu `actor: human` hoặc thiếu lý do → cổng vẫn chấm như chưa nghỉ | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

Vòng engine có kho tiêu thụ chờ; đo ở kho sau khi nhận 2.17.0, không đo ở kit.

- Câu hỏi phép đo trả lời: sau khi nhận, cổng của kho có thôi thu phí cho hồ sơ đã chết không?
- Kết quả nào là SỐNG: OneFlow — `normalize-text-vi` nghỉ bằng một dòng sổ, cổng xanh trên
  nhánh không chạm nó, 0 lần «bỏ qua có ghi nhận» trong 7 ngày sau khi nhận · kit — chiến
  dịch ghim lại kế ghim được ≥ 58/72 hồ sơ (14 hồ sơ lớp hai/ba đã nghỉ có tên) · bản đồ
  của cả hai kho xếp hồ sơ nghỉ vào một ô nói đúng sự thật, không phải «đã bác».
- Kết quả nào là CHẾT: một hồ sơ nghỉ mà chữ ký hay verdict cũ bị sửa; hoặc máy tự ghi nghỉ
  không có người; hoặc kho cũ đỏ vì thiếu trạng thái mới.
- Timebox: ngân sách 3 lượt chấm S4; bảng ba kết cục viết trước lượt 1 (đạt → ký · chỉ thước
  hỏng → khai giới hạn rồi ký · vật hỏng → park, mốc 2.17.0 cắt với phần đã ký).

## Kết quả prototype

Không dựng. Ca thật đã có ở hai kho; phép thử là chính cửa sổ 2.17.0.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Báo cáo quét «hạng mục kit cần nâng» 19/09 (owner chuyển) | phiên OneFlow | triết-lý/logic | có — hình dạng nghiệm mục 1, đã đối chiếu số trên máy này | — |

## Cổng 0

- **decision = build** (Mạnh, 19/09, một chạm «Gật» sau khi đọc nhìn-lại ba lăng kính; là
  phê duyệt CỘNG đích danh theo ADR 0018). Căn cứ: hai kho + lỗ fail-open đường dẫn.
- **disposition = archive** Căn cứ: không có code prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** như mục Ngưỡng.

## Thước đo thành công → ứng viên criterion

- Một hàm trạng thái cho cổng · thẻ · bản đồ, có marker; mutant đổi hàm → cả ba đổi (AC răng).
- Hồ sơ nghỉ có dòng sổ người ký → cổng loại khỏi luật làn eval + luật cũ hoá; thiếu người
  hay lý do → chấm như chưa nghỉ (AC hai chiều).
- Chữ ký, verdict, `verified_commit` của hồ sơ nghỉ không đổi một byte (AC vi phân).
- Kiểu `su-lieu/` và kiểu «status giữ nguyên + descope» → cờ vàng có tên, không đỏ (AC đọc-cũ).
- Bản đồ và thẻ xếp hồ sơ nghỉ vào ô «đã nghỉ có sử liệu», không vào «đã bác» (AC bộ đọc).

## Out of scope từ khám phá

- Không đổi `status`/`verdict` sang giá trị không thật — owner đã từ chối 17/09.
- Không gắn luật làn eval hay luật cũ hoá vào diff PR — đó là ô
  `cong-chan-theo-ho-so-khong-theo-diff`, câu hỏi khác.
- Không dựng bộ phân loại trước làn ghim lại (`repin-lane --plan`) — việc kế, phụ thuộc ô này.
- Không port cụm phạm vi hẹp trong fork cổng của OneFlow.
