---
schema_version: 1
slug: cua-tin-hieu-gom-nhom
feature: Mọi người gửi tín hiệu vào một cửa của kho; máy gom thành nhóm đặt tên bằng tiếng sản phẩm — mỗi tín hiệu ở đúng một nhóm, lẻ kèm lý do, hoặc đã phủ bởi việc đã giao — và người gửi thấy tín hiệu của mình đi tới đâu
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-11T08:50:52Z   # owner gõ «Làm» một chạm trong phiên 11/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: L3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng L3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang L3 --mo-o --slug cua-tin-hieu-gom-nhom` (slug suy
> tất định từ câu giao là `moi-nguoi-gui-tin-hieu-vao` — máy đặt slug ngắn hơn, đảo được). Hàng đứng
> trên L2 (cắt lượt, đã gộp #289) và X1 (khối dữ liệu lộ trình, đã gộp #283).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/kiem-cheo-sau-gop — `opportunity.md` mục «Hạng mục cùng lớp»: chủ kho gom tay bốn ô F9–F12 thành một đợt («Đưa F9-F12 vào đợt», 07/10); phần thuộc kit của bốn ô chỉ nối được với hai hạt giống kit (`gia-lan-ghim-lai-vong-b`, `suite-chap-chon-ho-so-khac-khoa-the`) khi máy đọc chéo hai kho ngày 08/10.

**Người gặp** (bốn chốt của chủ kho 08/10):
- **Chủ kho** — người gom. 08/10: phân loại và gom nhóm là việc khó nhất với người dùng kit. Hôm nay
  việc gom là chép tay mục «Hạng mục cùng lớp», và không có gì nói một ý mới đã được việc đã giao phủ hay chưa.
- **Đội sản phẩm không dùng git và trưởng phòng ban** — chỉ XEM và GỬI TÍN HIỆU. Hôm nay không có cửa
  nào; góp ý đi qua chat rồi chủ kho chép lại, người gửi không biết ý của mình đi tới đâu. Nút «Gửi tín
  hiệu» trong CRM là hàng LT2 của crm — nó đứng trên hàng này.
- **Kỹ sư dùng git** (qua phiên Claude Code của họ) — phát sinh trong lúc làm đã có kênh yêu cầu của
  gói Điều phối; tín hiệu của người khác phải đi CÙNG khuôn đó (một hộp thư, không hai).

**Đo 11/10 trên dữ liệu thật:**

| Phép đo | Kết quả |
|---|---|
| Kênh yêu cầu của Điều phối — đợt crm 07–09/10 (bản ẩn danh `tests/dieu-phoi/fixtures/dot-crm-0910/yeu-cau/`) | **374 yêu cầu, 9 loại**: khác 186 · chạm tệp 88 · cần người 55 · hàng mới 20 · gia hạn 9 · việc phụ 8 · sẵn gộp 4 · báo 3 · thêm hàng 1. Bảng loại của spec §4.9 có 7 dòng; ba loại thật nằm ngoài bảng → khuôn đã mở theo thực tế. Phép gộp trùng duy nhất hôm nay: `viec-phu` cùng kho + cùng tiêu đề hoặc cùng tệp trong 24 giờ |
| Khuôn yêu cầu có nhận tín hiệu của người không git mà không đổi khuôn? | **Đã thử**: tín hiệu `{phien, loai: "tin-hieu", hang: null, noi_dung: {tieu_de, man}, luc}` qua CHÍNH hàm kiểm của Điều phối (`kiemYeuCau`, `dieu-phoi/scripts/hinh-dang.mjs`) — đạt; hàm chỉ đòi `phien` và `loai` không rỗng. Thả nhầm vào thư mục yêu cầu của đợt thì bộ xét trả «cần phán» và đánh thức giám sát → tín hiệu người nằm ở **nguồn kho khai**, không ở thư mục đợt |
| Gom tay ở crm (`origin/onehub` `27d47de04`) | **10/238 hồ sơ** có mục «Hạng mục cùng lớp» viết tay, nối thành 4 cụm: giá lượt ghim lại (F9–F12) · ca chập chờn (F11, F17, F18, `so-moi-khong-chap-chon`) · phút CI (F16, F20, F21, F22, `thuoc-7-ngay-loc-pr`) · vòng đời (`luat-kho-vong-doi`, E3, E5, V2). **Gom tay không phải phân hoạch**: F11 nằm ở hai cụm, và `thuoc-7-ngay-loc-pr` trỏ F9 theo cơ chế («cũng đọc lượt CI») chứ không theo kết quả — người gom trộn hai trục trong cùng một mục |
| Kit | 103 hạt giống · 12 ô chờ Cổng Đáng · 104 báo cáo bằng chứng có mục «Ngoài hợp đồng»; kiểm kê 08/10 thấy ≥3 hạt giống «mở» thật ra đã được việc đã giao phủ — không bộ nào nối chúng về việc đã giao |
| Đầu ra của bước gom đã có chỗ chờ | khuôn bản phạm vi của L2 (`skills/acceptance/references/pham-vi-template.md`, khối PHAM-VI-MA) viết sẵn ví dụ `nguon: đội sản phẩm gửi qua cửa tín hiệu`; bộ đọc `docPhamVi` + răng phủ `kiemPhu` của `scripts/cat-luot.mjs` dùng lại được bằng import |
| Tín hiệu người thật đầu tiên | crm: mọi phòng ban vào CRM từ 14/10, «góp ý gom một chỗ» (hàng `ct` của lộ trình Kho tài liệu) → lượt gom thật đầu tiên rơi trước timebox 01/11 |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một khuôn cho cả hai nguồn: tín hiệu người và yêu cầu phát sinh của thợ đọc bằng cùng hàm kiểm của Điều phối, không đổi gì ở `dieu-phoi/` | hai hộp thư, hai khuôn trôi khỏi nhau — đúng lớp lỗi «bên viết và bên đọc trôi» | dựng tín hiệu người qua `kiemYeuCau` | **Đã thử** (bảng trên). Nếu S1 thấy buộc phải đổi khuôn chung → dừng, báo phiên điều phối kèm lý do, không tự sửa |
| 2 | Việc PHÁN (tín hiệu nào vào nhóm nào, tên nhóm) do phiên Claude Code làm theo skill; mã của kit chỉ kiểm phủ và vẽ đường đi — 0 lời gọi mô hình trong mã | kit thành nơi soạn — trái «kit render, không soạn» | tiền lệ L2: skill cắt, `cat-luot.mjs` chỉ kiểm phủ — đã chạy trên crm | Có tiền lệ |
| 3 | Một trục gom duy nhất do chủ kho chốt một lần đủ để máy gom bộ vàng thật đúng (cụm F9–F12 chung một nhóm; F11 vào đúng một nhóm kèm lý do; hạt giống đã phủ ra «đã phủ») | máy phải hỏi lại mỗi lượt → thêm lượt gọi người, phá đúng thước của kit | S1: máy sinh tín hiệu giả có nhãn từ 10 hồ sơ crm thật + hạt giống kit, chạy skill gom trên đó trước Cổng Phạm vi | Chưa thử — đo trong vòng |
| 4 | Lượt gom thật đầu tiên của crm có đủ tín hiệu trước 01/11 dù nút LT2 chưa có (góp ý của đợt 14/10 được crm đổi sang khuôn tín hiệu) | Cổng Giá trị đọc «chưa đo» — giới hạn có tên, không chặn giao | hỏi lượt kế của crm khi nhận mốc | Chưa thử — việc của crm, ngoài vòng |

## Chính sách trục gom (chốt một lần ở cổng này, máy áp cho mọi lượt sau)

Thử trên bộ vàng thật ở bảng trên:

| Trục | Nhóm là gì | Trên bộ vàng crm | Hệ quả |
|---|---|---|---|
| **A — Kết quả người dùng** *(máy khuyên)* | một điều một vai muốn làm được («Kỹ sư ghim lại một hồ sơ mà không trả giá cho hồ sơ khác») | F9–F12 chung một nhóm (cùng phục vụ một kết quả — đúng cách chủ kho đã xếp chúng vào một đợt); F11 phải chọn MỘT trong hai cụm, máy ghi lý do | nhóm = một mã của bản phạm vi → cắt lượt đóng gói thành hàng «một vòng một kết quả» không phải dịch lại; người gửi nhận ra ý mình trong tên nhóm. Giá: máy phải diễn lại lời phàn nàn thành kết quả |
| B — Gốc vấn đề (cùng lớp) | các tín hiệu cùng một nguyên nhân trong mã | khớp cách kỹ sư viết «Hạng mục cùng lớp» | tín hiệu của phòng ban chỉ gom được sau khi có người đọc mã; tên nhóm thành tiếng kỹ thuật — người gửi không nhận ra ý mình |
| C — Màn / khu vực sản phẩm | các tín hiệu gửi từ cùng một màn | không áp được — hồ sơ hạ tầng không có màn | máy gom không cần phán; nhưng một màn chứa nhiều kết quả, và một trùng lặp thấy ở hai màn bị tách đôi → hỏng vế «trùng đã biết gộp đúng» |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở lượt gom thật đầu tiên của crm, chủ kho có nhận nhóm máy đề xuất mà chỉ sửa ít không?
- Kết quả nào là SỐNG: ở lượt gom kế của crm (tín hiệu thật từ đợt phòng ban 14/10), chủ kho sửa dưới 1/5 số nhóm máy đề xuất (đổi tên, tách, gộp hay chuyển tín hiệu đều tính là sửa một nhóm), và mọi cặp trùng lặp đã biết trong bộ vàng — khai TRƯỚC lượt gom — nằm chung một nhóm. «0 tín hiệu lọt» do răng phủ của máy giữ ở mọi lượt, không đo bằng người.
- Kết quả nào là CHẾT: chủ kho sửa từ 2/5 số nhóm trở lên, hoặc có cặp trùng đã biết bị tách, khi hết timebox — gom máy không thay được gom tay. Giữa hai ngưỡng → lặp.
- Timebox: 2026-11-01 (mốc kế sau đợt thử — cùng DP6, X2, S3, G2, G3, A2).

## Kết quả prototype

Không dựng prototype — bước gom không có màn; S1 chạy thử skill gom trên tín hiệu giả máy sinh từ bộ
vàng thật (giả định 3) trước Cổng Phạm vi.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn yêu cầu + hàm kiểm | `dieu-phoi/scripts/hinh-dang.mjs` (`kiemYeuCau`), `dieu-phoi/scripts/ghi.mjs` (`ghiYeuCau`), spec 2026-10-05 §4.9 | mã của kit, máy M5 giữ | có — chỉ import, KHÔNG sửa `dieu-phoi/` | — |
| Răng phủ + khuôn bản phạm vi | `scripts/cat-luot.mjs` (`docPhamVi`, `kiemPhu`), `pham-vi-template.md` | mã của kit (L2), phiên S3b đang sửa | có — chỉ import; cần tách hàm chung thì báo phiên điều phối trước | — |
| Bộ vàng | 10 hồ sơ crm có «Hạng mục cùng lớp» (`origin/onehub` `27d47de04`) + hạt giống kit đã phủ | dữ liệu đo | có — chỉ đọc; tín hiệu giả máy sinh từ chúng, có nhãn, không chép tệp crm vào kit | — |
| Kênh yêu cầu thật (ẩn danh) | `tests/dieu-phoi/fixtures/dot-crm-0910/` | dữ liệu đo | có — đếm loại, kiểm khuôn | — |

## Cổng 0

- **decision = build** (hạng T2) — owner gõ «Làm» 11/10 trên khuyến nghị bên dưới. CỘNG: hàng ghi «cần owner phê ở Cổng Đáng» — chữ ký này là chữ ký đích danh của luật CỘNG.
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ «Làm».
- **Trục gom chốt cùng lúc ký: A — kết quả người dùng** (chính sách của chủ kho; máy áp cho mọi lượt gom sau, không hỏi lại; đổi trục = một Cổng Đáng mới).

**Máy khuyến nghị lúc mời ký (owner chọn đúng lối này):** `build`, hạng **T2**, **một vòng**, **trục A — kết quả người dùng**.
Hạng: vật dự kiến ở `scripts/` (bộ đọc tín hiệu + răng phủ + đường đi), một skill gom, khuôn tín hiệu,
tài liệu ổ cắm — không chạm `lib/**`, `hooks/**`, cổng chặn gộp, `dieu-phoi/` hay `scripts/cat-luot.mjs`.
Cỡ: dự kiến 10–11 tiêu chí (bảng dưới) — trong khoảng cho phép của chính sách 10/10; S1 vượt 13 thì máy
tự tách «đường đi tín hiệu trong khối dữ liệu lộ trình» thành vòng hai, không hỏi lại. CỘNG: hàng ghi
«cần owner phê ở Cổng Đáng» — chữ ký ở đây là chữ ký đích danh của luật CỘNG. Trace: nguyên tố 1 (ý định
của người gửi được chốt thành nhóm → bản phạm vi TRƯỚC khi có hàng); người hưởng: chủ kho (bớt gom tay),
người không git (thấy tín hiệu đi tới đâu). Kho không khai nguồn tín hiệu: không đổi gì (luật 26/09).

## Thước đo thành công → ứng viên criterion

Cửa và khuôn:

1. Tín hiệu người và yêu cầu phát sinh của thợ cùng một khuôn; bộ đọc kiểm bằng chính hàm kiểm của
   Điều phối (round-trip: bên ghi của Điều phối sinh tệp → bộ đọc của vòng này đọc được).
2. Kho khai nguồn tín hiệu cạnh `lo_trinh.tep` trong `_acceptance/config.yaml`; kho không khai → mọi
   lệnh im, không đổi byte nào (đo vi phân trên các kho trên máy).

Gom:

3. Skill gom (phiên Claude Code) đọc tín hiệu mới + việc đã giao → bản gom ba ngăn: nhóm (tên tiếng sản
   phẩm, theo trục đã chốt) · lẻ (kèm lý do) · đã phủ (trỏ việc đã giao).
4. Răng phủ: mỗi tín hiệu ở đúng một chỗ; thiếu, hai chỗ, hay trỏ tín hiệu không có → đỏ gọi tên.
5. «Đã phủ» chỉ trỏ hồ sơ có thật và đã giao (cùng tập trạng thái lưới trước-gộp dùng); trỏ ô chưa giao → đỏ.
6. Trục gom là chính sách khai một lần, một nguồn máy đọc; lượt sau áp không hỏi lại; tên nhóm có vai mở câu.
7. Bản gom sinh ra bản phạm vi mà cắt lượt đọc được (round-trip qua `docPhamVi`).

Đường đi về người gửi:

8. Đường đi của một tín hiệu: tín hiệu → nhóm → hàng → hồ sơ → trạng thái, in bằng tiếng sản phẩm;
   bước chưa tới nói «chưa …» có tên.
9. Khối dữ liệu lộ trình mang đường đi tín hiệu để crm (LT2) hiện cho người gửi; bộ đọc cũ đọc phần biết.

Chứng minh:

10. (judgment) Trên bộ vàng (tín hiệu giả máy sinh từ 10 hồ sơ crm thật + hạt giống kit đã phủ, có
    nhãn): cụm thật chung nhóm, F11 ở đúng một nhóm có lý do, hạt giống đã phủ ra «đã phủ».
11. Mã chỉ đọc, 0 lời gọi mô hình, hai lần chạy cùng byte.

## Out of scope từ khám phá

- **Nút «Gửi tín hiệu» trong CRM và nơi crm cất tín hiệu** — hàng LT2 của crm; kit không giữ kho tín hiệu.
- **Sửa `dieu-phoi/` hay thêm dòng vào bảng loại của Điều phối** — máy M5 giữ; buộc phải đổi khuôn chung thì dừng và báo phiên điều phối.
- **Sửa `scripts/cat-luot.mjs`** — phiên S3b đang sửa; vòng này chỉ import.
- **Gom bằng mô hình trong mã, máy chủ, lịch chạy tự động** — trái «kit render, không soạn».
- **Trục gom thứ hai (B, C) hay trục theo từng kho** — mở khi một kho thứ hai thật sự cần (phanh SaaS: không phổ quát sớm).
- **Kit tự khai nguồn tín hiệu cho hạt giống của chính nó** — hạt giống là markdown, không phải khuôn tín hiệu; mở khi có neo.
- **Lệnh mở ô ghi «Vì sao: Gốc: …» làm dòng `Gốc:` không đứng đầu dòng** (gặp lần ba, sau R1 và X2) — hạt giống, không vào vòng này.
