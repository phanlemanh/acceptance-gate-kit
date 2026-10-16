---
schema_version: 1
slug: ho-so-da-ky-giu-tuoi
feature: Bộ hồ sơ đã ký của một kho được ghim lại trên đỉnh nhánh chính theo các lần gộp trong một khoảng; ca đỏ quy về PR gây ra bằng cặp sha trước/sau; ca đã đỏ sẵn trên nền mang nhãn trạng thái «đỏ sẵn trên nền» (cùng ca, cùng thông điệp, run_id của nền) thay vì chặn vòng khác — mặc định tắt, kho không bật thì hành vi không đổi
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: K-A
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng K-A của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Gốc: crm-onehub/_acceptance/okr-soat-anh-luot-3 — hồ sơ đã ký trên onehub (ký 26/09), đỏ sẵn E9 (luật DS «lớp cấm»,
`soi-ma.mjs`) và E13 ngày 15/10 khi vòng DH2 chạm vào, vì DH1 gộp trước đó (sổ `dieu-huong-khu-muc-tieu`,
d-20261015T124855Z-42). Finding nền: `docs/findings/2026-10-16-truy-nguyen-toc-do-m5.md` (nhánh
`docs/truy-nguyen-toc-do-vong`) §5 PC, §10 — chủ kho duyệt 16/10 kèm câu «phân rõ ranh giới để điều chỉnh phù hợp
luôn ưu tiên kit vì nó tác động mọi repo».

**Ai đau:** chủ kho (lượt gọi người ngoài thiết kế), và thợ của MỌI vòng chạm một hồ sơ đã ký mà người khác làm cũ.
Hồ sơ đã ký mục dần mà không ai chạy lại eval của chúng, vì `pre-merge-check.sh --base` chỉ soi hồ sơ mà PR chạm;
tới khi một vòng khác chạm vào thì vòng ấy thừa hưởng màu đỏ không phải của mình, và hôm nay không có cách nói điều
đó: luật hai vế (2.12.0) cấm khai `not-run` trên eval đã ký còn mã thoát, nên thợ chỉ có hai đường — sửa vật của
người khác ngay trong vòng mình, hoặc gọi người.

**Số đo trước** (máy đo 16/10, chỉ đọc):
- crm (onehub): trung bình **4,2 lượt gọi người/vòng** trên 9 vòng, 13 lượt ngoài thiết kế; nguồn lớn nhất là «đỏ
  sẵn». Ca DH2: 2,5 h máy ghim lại đỏ + 5,3 h chờ người, rồi đẻ một vòng vệ sinh. Quét pre-merge toàn phần 16/10
  (finding §Kết luận): 242 vi phạm trên 248 hồ sơ `signed-off`.
- kit: CI đỏ hai lần vì hồ sơ của vòng khác (#349, #359); 5/6 đường nền gần nhất «đỏ sẵn».
- Quét pre-merge toàn phần (không `--base`) lúc mở ô, bằng `scripts/pre-merge-check.sh` của HEAD: crm (onehub 7ebcb024, `stale_scope: paths`) **257/280**
  hồ sơ đã ký cũ, quét 658 s · kit (main bd821d8d, phạm vi `all`) **148/168**, 91 s · oneflow (main, phạm vi `all`)
  **31/41**, 16 s. Ở kho phạm vi `all` mọi thay đổi mã đều làm cũ — con số là trần trên của tập lệnh giữ tươi phải
  ghim lại, nên lệnh phải chọn theo `paths` của eval để có giá chấp nhận được (giả định 4).
- Hai ca «đỏ sẵn» trên onehub còn chứa lỗi prod thật (hydration, 403 của quản trị) — màu đỏ ấy có giá trị, chỉ là
  đến sai người, sai lúc.

**Công cụ đã có, và chỗ thiếu.** `repin-lane.mjs` ghim lại một danh sách slug (`--slug` lặp), có `--skip-unchanged`
theo `stale_scope: paths` và suite song song (`repin_parallel_suites`); lượt đỏ ghi một dòng `repin-do` (lệnh đỏ ·
mã · nhật ký). Chưa có: (1) lệnh **chọn** hồ sơ đã ký bị cũ do các lần gộp trong một khoảng — finding nhắc
`repin-lane.mjs --stale-all --base`, nhưng cờ ấy KHÔNG tồn tại (đo 16/10); (2) phần **quy đỏ về PR** gây ra; (3) lối
khai **«đỏ sẵn trên nền»** mà bên đọc (pre-merge, thẻ) hiểu.

**Ý định:** màu đỏ của một hồ sơ đã ký đến đúng người — PR gây ra nó — trong ngày, thay vì đến vòng kế tiếp tình
cờ chạm vào. Vòng chạm vào mà thấy đúng cái đỏ ấy đã có sẵn trên nền thì đi tiếp với một nhãn trạng thái hiện trên
thẻ, không gọi người, không sửa vật của người khác. Nhãn KHÔNG phải PASS: chỉ gắn khi cùng ca, cùng thông điệp đỏ đã
ghim trên merge-base, có `run_id` của nền; HEAD thêm ca đỏ nào thì vẫn đỏ. Mặc định tắt, có cờ bật trong config,
có đường đọc-cũ và cờ vàng; kho không bật thì hành vi không đổi.

**Luật chiều rộng (b):** chủ kho đề xuất gọi tên K-A là vòng meta DUY NHẤT của cửa sổ này (finding §10.3); K-B, K-C,
K-D xếp sau, mở khi một kho cài mốc chứa K-A. Kho chờ nhận: crm (Điều phối M5 đã giữ phần lịch đêm tạm bằng
`repin-lane.mjs` hiện có, chờ lệnh kit để thay).

**Bước 0 (K-E, đã xong 16/10):** đường đọc-cũ của DP11 đọc đúng hồ sơ ký bằng 2.28 ở mọi chỗ có cổng — vi phân lib
2.28 ↔ HEAD trên 567 hồ sơ của 8 kho: 9 đổi kết quả, 7 đúng thiết kế DP11, 1 lệch giả chỉ ở thẻ của một hồ sơ crm đã
đóng (`khai-lang-gioi-thieu`, `at` chỉ có ngày), 1 lệch ở khuôn mới (người ký rút gọn `tieu_de`, 2/268 dòng). Không
phải sai hợp đồng; khai giới hạn kèm ngưỡng, không mở nhánh sửa. Không trộn vào vòng này.

Bộ hồ sơ đã ký của một kho được ghim lại trên đỉnh nhánh chính theo các lần gộp trong một khoảng; ca đỏ quy về PR gây ra bằng cặp sha trước/sau; ca đã đỏ sẵn trên nền mang nhãn trạng thái «đỏ sẵn trên nền» (cùng ca, cùng thông điệp, run_id của nền) thay vì chặn vòng khác — mặc định tắt, kho không bật thì hành vi không đổi

Vì sao: Gốc: crm-onehub/_acceptance/okr-soat-anh-luot-3 — hồ sơ đã ký trên onehub, đỏ sẵn E9/E13 ngày 15/10 khi vòng DH2 chạm vào (DH2 tốn 2,5 h máy ghim lại đỏ + 5,3 h chờ người, rồi đẻ một vòng vệ sinh). Quét pre-merge toàn phần trên onehub 16/10: 242 vi phạm trên 248 hồ sơ signed-off; kit đỏ CI hai lần vì hồ sơ vòng khác (#349, #359). Finding docs/findings/2026-10-16-truy-nguyen-toc-do-m5.md (nhánh docs/truy-nguyen-toc-do-vong) §5 PC, §10 — chủ kho duyệt 16/10.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Phần lớn «đỏ sẵn» là hồ sơ đã ký bị PR khác làm cũ (đỏ thật, có chủ), không phải eval chập chờn | Nhãn chỉ che chập chờn; lệnh giữ tươi quy đỏ về PR vô tội | Phân loại lại các ca đỏ sẵn 14–16/10 của M5 theo `repin-do` + diff | Một ca đã thấy: okr-soat-anh-luot-3 E9 đỏ vì DH1 gộp |
| 2 | Cặp sha trước/sau của các lần gộp trong khoảng chỉ ra đúng MỘT PR gây đỏ | Người phải chọn PR — thêm lượt gọi người | Chạy lại ngày 15/10 của onehub: bao nhiêu ca đỏ rơi vào một lần gộp duy nhất | Chưa thử |
| 3 | «Cùng ca + cùng thông điệp + run_id nền» không mở đường lọt | Một PR làm hỏng đúng eval ấy theo cùng thông điệp sẽ lọt | Đột biến: PR làm đỏ thêm ca mới · đổi thông điệp · làm đỏ đúng ca nền — hai ca đầu phải đỏ; ca ba là giới hạn khai | Chưa thử |
| 4 | Giá máy của lệnh giữ tươi chấp nhận được | Lệnh đốt giờ máy nhiều hơn giờ nó cứu | Finding PC: 8–9 hồ sơ ≈75′/lượt; đo lại trên kit bằng `--skip-unchanged` | Ước, chưa đo |
| 5 | Kho không bật cờ thì hành vi không đổi | Mọi kho trả giá cho sự cố của crm | Vi phân pre-merge + thẻ trên bộ hồ sơ thật của kit, oneflow, crm — cờ tắt | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Sau khi crm cài mốc chứa K-A và bật cờ, màu đỏ của hồ sơ đã ký có tới đúng PR gây ra trong ngày, thay vì thành lượt gọi người ở vòng khác không?
- Kết quả nào là SỐNG: [đề xuất] Trong 14 ngày sau khi crm cài mốc và bật cờ: 0 lượt gọi người ngoài thiết kế trên onehub có nguyên nhân «đỏ sẵn» (hôm nay ≈4 lượt trong 2 ngày, finding §5), VÀ mỗi ca đỏ của lệnh giữ tươi quy về đúng một PR gây ra (hoặc nói rõ «không quy được» kèm cặp sha).
- Kết quả nào là CHẾT: [đề xuất] Trong cùng 14 ngày có ≥2 lượt gọi người ngoài thiết kế vì «đỏ sẵn», HOẶC có một PR làm đỏ thêm ca mà vẫn lọt nhờ nhãn (chiều đỏ của nhãn hỏng).
- Timebox: [đề xuất] 2026-11-05 (mốc «Tinh chỉnh sau hai đợt thử»). Tới hạn mà crm chưa cài mốc → «chưa đọc được ở đây», không phải CHẾT.

## Kết quả prototype

Không dựng prototype — vật là một lệnh và một nhãn trạng thái của bộ công cụ; đo bằng ca hai chiều (độ nhạy: phá vật
thật thì đỏ · độ đặc hiệu: chạm thứ không phải vật thì im) và bằng dữ liệu thật của kho nhận mốc.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Phương án PC «Nền onehub có chủ» + điều kiện của nhãn | finding `2026-10-16-truy-nguyen-toc-do-m5.md` §5, §10 (nhánh `docs/truy-nguyen-toc-do-vong`) | triết-lý/logic | có | |
| Hồ sơ neo và các ca đỏ sẵn 14–16/10 | `crm-onehub/_acceptance/okr-soat-anh-luot-3`, sổ `dieu-huong-khu-muc-tieu` | triết-lý/logic | có (làm ca thử, không chép vật) | |

## Trọng số và chính sách (chốt MỘT lần ở cổng này — khối ĐỊNH VỊ)

- **Trọng số:** mảnh (b) nhãn «đỏ sẵn trên nền» chở cơn đau chính — lượt gọi người ngoài thiết kế. Mảnh (a) lệnh giữ
  tươi chở phòng ngừa và quy trách nhiệm, và là BÊN VIẾT của bằng chứng nền mà (b) trích (`run_id` + lệnh đỏ +
  thông điệp trên đỉnh nhánh chính). Phải cắt thì giữ cặp viết–đọc ấy, cắt phần quy-về-PR trước.
- **Chính sách (khẩu vị rủi ro) máy khuyên:** nhãn cho vòng khác đi tiếp nhưng KHÔNG bao giờ thành PASS, KHÔNG xoá đỏ
  khỏi thẻ, và chỉ áp cho hồ sơ KHÔNG thuộc vòng đang chấm; hồ sơ của chính vòng vẫn theo luật cũ. Không đặt hạn «đỏ
  sẵn quá N ngày» trong vòng này (Later — ghi hạt giống nếu số cho thấy đỏ sẵn sống lâu).
- **CỘNG cần owner phê đích danh (ADR 0018):** lệnh mới + lối khai mới trên eval đã ký. Phê ở Cổng Phạm vi của chính
  vòng này, không ở cổng này.

## Cổng 0

- **decision = …** Máy khuyên `build`. Căn cứ: neo ngoài có thật trên onehub; 242 vi phạm ở crm và hai CI đỏ ở kit
  cùng một gốc ở tầng kit; chủ kho đề xuất gọi tên K-A là vòng meta duy nhất của cửa sổ.
- **disposition = —** Căn cứ: không prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Lệnh chọn đúng tập hồ sơ đã ký bị cũ do các lần gộp trong khoảng (so với quét pre-merge toàn phần trên cùng cây) → AC chọn.
- Ghim lại tập ấy trên đỉnh nhánh chính bằng `repin-lane.mjs`; xanh → pin như hôm nay; đỏ → ghi bằng chứng nền → AC ghim.
- Mỗi ca đỏ mang cặp sha trước/sau và PR gây ra, hoặc «không quy được» có lý do → AC quy về PR.
- Nhãn chỉ gắn khi cùng ca + cùng thông điệp + `run_id` nền; HEAD thêm ca đỏ → vẫn đỏ; đổi thông điệp → vẫn đỏ → AC nhãn (ma trận viết trước).
- Pre-merge và thẻ đọc nhãn; hồ sơ không có nhãn đọc như cũ; nhãn trên hồ sơ của chính vòng → không có tác dụng → AC bên đọc.
- Cờ tắt (mặc định) → vi phân pre-merge + thẻ trên bộ hồ sơ thật của kit, oneflow, crm: 0 khác → AC cờ tắt.
- Bản mốc cũ đọc hồ sơ mang nhãn → cờ vàng, không vỡ → AC đọc-cũ.
- Mỗi phép đo mới có cặp hai chiều (độ nhạy + độ đặc hiệu) → điều khoản MEASURE-BIRTH, không phải AC riêng.

## Out of scope từ khám phá

- Lịch đêm trên crm, luân phiên ba máy, vòng dọn 242 hồ sơ tồn đọng (giữ / nghỉ / thay bởi) — việc của crm và Điều
  phối M5 (finding §10.4); vòng này chỉ giao lệnh.
- CI chạy test trên đỉnh onehub sau mỗi lần gộp (PC mục 4) — ≈650 phút-job/ngày, không bắt được ca nào trong cửa sổ đo.
- Tự mở PR vệ sinh hay tự sửa vật của hồ sơ đỏ — lệnh chỉ quy về PR gây ra; sửa là việc của chủ PR.
- K-B, K-C, K-D — cửa sổ kế (luật chiều rộng b).
- Sửa `mocDong` cho `at` chỉ có ngày (K-E) — giới hạn đã khai, ngưỡng: ≥1 hồ sơ chưa ký / làn V / machine-cleared đổi phán quyết.
- Hạn «đỏ sẵn quá N ngày» — Later.
