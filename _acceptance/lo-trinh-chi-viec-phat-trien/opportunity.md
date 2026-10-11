---
schema_version: 1
slug: lo-trinh-chi-viec-phat-trien
feature: Lượt cắt chỉ sinh hàng phát triển máy giao và chứng minh được — việc vận hành của người thành mốc ngoài, không hàng nào đứng chờ nó; thiếu dữ liệu thật thì có hàng dữ liệu giả do máy sinh đứng trước
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-11T08:59:58Z   # owner gõ «Làm» một chạm trong phiên 11/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: S3b
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng S3b của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang S3b --mo-o --slug lo-trinh-chi-viec-phat-trien` (hàng
> không khai slug; slug suy tất định từ câu giao dài và không đọc được — máy đặt slug ngắn, đảo được).
> Hàng đứng trên S3 (răng cỡ và dáng câu giao của lượt cắt, đã gộp).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/khung-okr-truoc-r1 — lượt cắt OKR của crm; cùng đo trên lộ trình Kho tài liệu của crm.

**Người gặp:** chủ kho crm và phiên Claude Code cắt lượt. Lộ trình của kho trộn hai loại việc: việc
PHÁT TRIỂN máy giao và chứng minh được, và việc VẬN HÀNH của người (gửi danh sách, gửi OKR, đào tạo,
công bố, gom câu hỏi thật). Skill cắt lượt hôm nay chỉ có hai chỗ cho một mã — hàng hoặc chân trời —
nên việc vận hành hoặc thành hàng, hoặc thành mốc không ai nối vào đâu; và hàng phát triển đứng chờ việc
vận hành xong mới chạy được. Răng phủ không thấy gì trong cả hai ca.

**Đo 11/10 trên lộ trình thật** (`crm` `origin/onehub` `27d47de04`):

| Phép đo | Kết quả |
|---|---|
| Lộ trình OKR — mốc | **16 mốc, 11 là việc vận hành của người** (nhân sự gửi danh sách · ban lãnh đạo gửi OKR · dựng cây, nhập người, đào tạo · mọi phòng ban dùng thật · phòng ban công bố OKR · phiên nghiệm thu · đọc số · ban lãnh đạo đặt OKR năm · phòng ban đặt OKR quý 1 · chấm và nhìn lại quý · đo bốn tuần đầu quý); 4 là bản phát hành, 1 là lịch (Tết). **10/16 mốc không gắn hàng nào** — trang lộ trình in «10/16 mốc chưa gắn việc nào» |
| Lộ trình Kho tài liệu — hàng | 13 hàng, **2 hàng là việc vận hành**: `ct` «Mọi phòng ban tự nạp 10–20 tệp, dùng hai tuần; góp ý gom một chỗ» · `cb` «Việc của chủ kho chạy song song». **3 hàng phát triển đứng trên hàng vận hành `ct`**: `l5`, `d9`, `d6` — treo tới khi người vận hành xong. Hàng `l2` đã giao 28/09 nhưng «chưa tải tệp thật nào» — chờ người thử tay |
| Từ vựng loại mốc | không thống nhất: crm dùng `han` · `han-cung` · `phat-hanh` · `su-kien` · bỏ trống (9/16 mốc OKR); kit dùng `ngoai` · `phat-hanh`; khuôn dùng `han`. Không bộ đọc nào của kit đọc `loai` |
| Tiền lệ đúng đã có | OKR hàng `M` «một công ty giả chạy OKR đủ một quý» — hàng `9b` đứng trên nó; ba hàng `10` · `9b` · `9c` ghi «dựng bằng dữ liệu mẫu, bật bằng dữ liệu thật» (chủ kho quyết 28/09) |
| Hai mục ngoài hợp đồng của S3 (ký 11/10) | Ngoài-1: SKILL nói mọi dòng `cảnh báo:` là hàng ngoài đợt — phiên cắt bỏ qua gợi ý gộp của CHÍNH đợt · Ngoài-2: SKILL bảo chủ kho tự sửa khối khoảng cỡ, nhưng kho tiêu thụ không có chỗ sửa — khoảng sống ở bản phát hành kit. Hồ sơ S3 ghi «đáng sửa trước khi crm nhận mốc mang vòng này» |
| Kho có lộ trình | kit (1 tệp) · crm (3 tệp: OKR · Kho tài liệu · Việc dự án). oneflow, media-library chưa khai |

Chủ kho chốt 11/10 «đưa vào»: lộ trình chỉ chứa việc phát triển máy giao và chứng minh được; việc
vận hành thành mốc ngoài, không hàng nào đứng chờ nó; thiếu dữ liệu thật thì dùng dữ liệu giả có nhãn
(ba luật); vận hành LẶP LẠI thì đề xuất tính năng tự phục vụ, kèm phanh «không phổ quát quá sớm».

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Phân loại «vận hành hay phát triển» là phán xét của phiên cắt; răng chỉ giữ HÌNH DẠNG — mốc ngoài là chỗ thứ ba trong bảng phủ (người gộp PR thấy mã nào thành mốc), và không hàng nào được đứng trên một mốc | Phiên cắt vẫn xếp việc vận hành thành hàng mà răng xanh — luật chỉ là lời | Giám khảo làm theo SKILL cắt một bản phạm vi dựng từ hai lộ trình crm thật, đếm hàng vận hành | Chưa thử — đo ở lượt chấm |
| 2 | Mọi hàng cần dữ liệu thật đều đi được bằng dữ liệu giả máy sinh (hoặc tiêu chí bỏ qua có tên ở vòng); hàng mà PHẠM VI chỉ biết sau vận hành (vd `l5` «sửa danh sách góp ý đã gom») thì vào chân trời, mở lại khi mốc vận hành xong | Có hàng không cắt được theo cả hai đường — luật đẻ ra hàng treo kiểu mới | Áp luật tay lên `l5` · `d9` · `d6` của Kho tài liệu | Đã thử bằng tay: `l5` → chân trời (mở lại khi mốc chạy thật xong); `d9`, `d6` có phạm vi đã biết → thôi đứng trên `ct`, chỉ đứng trên hàng phát triển chúng thật sự cần |
| 3 | Thêm trường lượt cắt mới (mốc ngoài phủ mã, nguồn dữ liệu của hàng) không đổi phán quyết của lộ trình đời trước — luật 26/09 | Một kho đang chạy đỏ răng mà vật không đổi | Chạy răng cũ và mới trên bốn lộ trình thật (kit + ba tệp crm), so mã thoát và các dòng không phải cảnh báo | Chưa thử — đo trong vòng |
| 4 | Phiên cắt nhận ra «vận hành lặp lại» từ bản phạm vi và đề xuất tự phục vụ mà không phổ quát quá sớm (đưa vào chân trời chờ tổ chức thứ hai khi chưa có) | Hàng tự phục vụ mọc cho việc một lần, hoặc không mọc | Cùng giám khảo của giả định 1 | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Ở lượt cắt kế của crm: 0 hàng là việc vận hành của người, 0 hàng phát triển đứng chờ mốc vận hành, mọi hàng cần dữ liệu thật có hàng dữ liệu giả đứng trước hoặc tiêu chí bỏ qua có tên» chưa?
- Kết quả nào là SỐNG: Ở lượt cắt kế của crm: 0 hàng là việc vận hành của người, 0 hàng phát triển đứng chờ mốc vận hành, mọi hàng cần dữ liệu thật có hàng dữ liệu giả đứng trước hoặc tiêu chí bỏ qua có tên
- Kết quả nào là CHẾT: chưa đạt «Ở lượt cắt kế của crm: 0 hàng là việc vận hành của người, 0 hàng phát triển đứng chờ mốc vận hành, mọi hàng cần dữ liệu thật có hàng dữ liệu giả đứng trước hoặc tiêu chí bỏ qua có tên» khi hết timebox
- Timebox: lượt cắt đầu tiên của crm sau khi crm cài mốc mang S3b (mốc 2026-11-01); tới 2026-11-30 crm chưa cắt lượt nào → ghi «chưa đo», không tính SỐNG

## Kết quả prototype

Không dựng prototype — vật là chữ của skill cắt lượt, khuôn lộ trình và răng phủ; bản phạm vi mẫu
dựng từ hai lộ trình crm thật làm dữ liệu đo ở lượt chấm.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Lộ trình OKR + Kho tài liệu của crm làm dữ liệu đo | `crm` `27d47de04:docs/plan/lo-trinh-{okr,kho-tai-lieu}.json` | dữ liệu đo | có — chỉ đọc; bản phạm vi mẫu do máy dựng trong hồ sơ, không chép tệp crm vào kit | — |
| Tiền lệ «công ty giả một quý» | crm hàng `M` | triết-lý/logic | có — làm khuôn hàng dữ liệu giả | — |
| Răng cắt lượt hiện có (S3) | `scripts/cat-luot.mjs` · `skills/cat-luot/SKILL.md` | mã của kit | có — mở rộng, không dựng răng thứ hai | — |

## Cổng 0

- **decision = build** (hạng T2) — owner gõ «Làm» 11/10 trên khuyến nghị bên dưới. Căn cứ: bảng «Đo 11/10 trên lộ trình thật» (11/16 mốc OKR là vận hành; ba hàng Kho tài liệu đứng chờ hàng vận hành `ct`), giả định 2 đã thử tay; CỘNG đã được chủ kho đồng ý 11/10 «đưa vào» — chữ ký này là chữ ký đích danh của luật CỘNG. Ý định của vòng (trọng số + chính sách rủi ro) chốt cùng chữ này.
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ «Làm».

**Máy khuyến nghị lúc mời ký (owner chọn đúng lối này):** `build`, hạng **T2**, **một vòng**, dự kiến **9–10 tiêu chí**. Hạng: vật chỉ chạm
`scripts/cat-luot.mjs`, `skills/cat-luot/SKILL.md`, khuôn `lo-trinh-template.json` và ca đo — không
chạm `lib/**`, `hooks/**` hay cổng chặn gộp; không chạm trang lộ trình, khối dữ liệu lộ trình hay
Feature Loop. CỘNG (trường lượt cắt + cờ mới): chủ kho đồng ý 11/10 «đưa vào» — chữ ký ở đây là chữ ký
đích danh của luật CỘNG.

**Ý định của vòng — chốt một lần ở đây, máy áp cho mọi cạnh gãy sau mà không hỏi lại:**

- *Trọng số* (cơn đau nào nặng nhất): (1) hàng phát triển đứng chờ vận hành — ba hàng Kho tài liệu
  đang treo; (2) việc vận hành ra khỏi hàng, thành mốc ngoài người gộp PR thấy được trong bảng phủ;
  (3) dữ liệu giả có nhãn; (4) tự phục vụ cho vận hành lặp lại — chỉ gợi ý (vàng), có phanh;
  (5) Ngoài-1/2 của S3.
- *Chính sách rủi ro:* răng chỉ ĐỎ hàng của đợt đang cắt; lộ trình đời trước chỉ vàng, mã thoát không
  đổi (luật 26/09). Phân loại vận hành↔phát triển là phán xét — đo bằng giám khảo ở lượt chấm và bằng
  Cổng Giá trị trên lượt cắt thật của crm, không giả vờ răng đọc được nghĩa câu.

## Thước đo thành công → ứng viên criterion

1. Bảng phủ có chỗ thứ ba: mã của bản phạm vi nằm ở đúng một trong hàng · chân trời · **mốc ngoài**
   (mốc `loai: ngoai` mang `dot` + `phu` + `ai`); mốc mang mã mà không phải mốc ngoài, hay thiếu người
   làm, thì đỏ.
2. Hàng của đợt đứng trên (`dung_tren`) một mốc ngoài → đỏ với cờ có tên, câu chỉ hai lối: dữ liệu giả,
   hoặc chân trời mở lại khi mốc xong.
3. Nguồn dữ liệu của hàng: hàng khai đo trên dữ liệu giả phải đứng trên một hàng sinh dữ liệu giả; ma
   trận giá trị viết sẵn (đúng · thiếu hàng sinh · giá trị lạ · không khai).
4. Vận hành lặp lại: mốc ngoài khai lặp lại mà không trỏ hàng tự phục vụ hay chân trời → vàng có tên;
   trỏ mã không có → đỏ.
5. Hàng và mốc ngoài đợt: mã thoát không đổi, mỗi cờ mới đúng một dòng vàng gom.
6. Bốn lộ trình đời trước (kit + ba tệp crm) và khuôn cũ: răng cũ và mới cùng mã thoát, cùng các dòng
   không phải cảnh báo; trang lộ trình vẽ ra giống từng byte khi thêm/bỏ các trường mới.
7. SKILL: luật «chỉ việc phát triển» + ba luật dữ liệu giả + nghĩa mới của luật 2 + tự phục vụ có
   phanh; bảng cờ == danh sách cờ của răng; khối lệnh chạy nguyên văn; khuôn có mẫu mốc ngoài phủ mã,
   hàng sinh dữ liệu giả, hàng dùng dữ liệu giả — răng trên đợt mẫu 0 lỗi 0 cảnh báo.
8. Ngoài-1: SKILL tách đúng hai loại dòng `cảnh báo:` (của đợt — phải xử lý hoặc nêu lý do trong PR;
   ngoài đợt — chép vào PR), đo bằng chính đầu ra răng trên một kho có cả hai.
9. Ngoài-2: SKILL nói khoảng cỡ sống ở bản phát hành kit và kho tiêu thụ nêu bất đồng thế nào (bảng
   đồng hồ trong PR), không bảo kho sửa khối.
10. (judgment) Giám khảo chỉ có SKILL + khuôn + bản phạm vi dựng từ hai lộ trình crm, tự cắt: 0 hàng
    vận hành · 0 hàng chờ vận hành · hàng cần dữ liệu có hàng dữ liệu giả đứng trước · vận hành lặp
    lại có đề xuất tự phục vụ hoặc chân trời có phanh · răng xanh trên chính đầu ra · nêu bước SKILL
    dẫn tới từng lựa chọn.

## Out of scope từ khám phá

- **Feature Loop khai nguồn dữ liệu cho TỪNG tiêu chí** (giả hay thật, thật → ô bỏ qua có tên trên
  thẻ) — chân trời `H-FL-DL` của lộ trình kit, mở khi DP7 vào main (máy M5 đang giữ Feature Loop).
- **Trang lộ trình tách mốc ngoài khỏi mốc phát hành / thôi đếm mốc vận hành vào «mốc chưa gắn việc»**
  — `lo-trinh.mjs` là bộ vẽ mọi kho dùng; đổi là mọi kho trả giá. Hạt giống, mở khi crm cắt lại và
  trang còn in sai.
- **Cắt lại lộ trình OKR + Kho tài liệu của crm** — việc của crm, sau khi nhận mốc mang vòng này;
  đó cũng là lần đọc ngưỡng.
- **Bất biến sản phẩm** (`PRODUCT-INVARIANTS.md`) — hàng BB1, vòng sau.
- **Răng đọc nghĩa câu để đoán việc vận hành** — bác: đoán từ vựng trên không gian mở là blacklist,
  bắn giả; phân loại thuộc phán xét, đo bằng giám khảo + thực tế.
