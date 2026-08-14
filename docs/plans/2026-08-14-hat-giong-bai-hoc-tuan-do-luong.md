# Hạt giống — bài học đo lường của tuần 08–14/08, chờ Cổng 0 để promote vào engine

*Trạng thái: **HẠT GIỐNG, chỉ capture**. Không sửa engine ở đây — mọi phép CỘNG
vào engine đi qua Cổng 0 bằng một hồ sơ nhỏ SAU khi 1a/1c xong. Tệp này tồn tại
để không bài học nào chết theo sử liệu hồ sơ.*

Nguồn: ba vòng rà soát đối kháng của hồ sơ `cat-hinh-thuc` (9 phiên chấm, 41
lượt phá thật ghi lệnh). Biên bản gốc:
`_acceptance/cat-hinh-thuc/review-findings.md`.

## Phát hiện cấu trúc quan trọng nhất — vùng trắng của MEASURE-BIRTH

**Hai lớp lỗi trung tâm của cả ba vòng (`doc-drift`, `chuoi-thay-quan-he`) ĐÃ
nằm sẵn trong bảng `measure-birth.md` trước khi 1a bắt đầu — và bộ răng của 1a
vẫn dẫm lên cả hai, ba vòng liền.** Nguyên nhân không phải capture thiếu mà là
vùng phủ: `MEASURE-BIRTH-CLAUSE` cưỡng chế phép đo mới trong *suite thường
trực* (cặp case hai-chiều tự chạy mỗi CI), còn **răng-chết-theo-hồ-sơ** nằm
ngoài vành đai — chiều đỏ của chúng chỉ được bảo đảm bằng kỷ luật người viết.

Câu hỏi đáng Cổng 0 (một trong hai, không cả hai):
- (a) nâng bộ ghi sổ + luật khai-sinh thành `lib/` dùng chung cho răng-hồ-sơ, hay
- (b) tuyên thẳng: răng-hồ-sơ là lớp RẺ, chết nhanh; **mọi bảo đảm dài hạn phải
  vào lưới thường trực ngay từ đầu** (như 1a đã làm ở vòng thu phạm vi:
  `P185`/`P186`/`P194` nhận răng thay vì bộ răng hồ sơ).
Kinh nghiệm 1a nghiêng về (b) — rẻ hơn và thuận chiều sống/chết theo merge.

## Bốn lớp lỗi MỚI cho bảng `measure-birth.md` (kèm ca đại diện)

| Lớp | Ca đại diện | Hình dạng |
|---|---|---|
| **tap-so-rong** (hằng-đúng qua tập so sánh rỗng) | cat-hinh-thuc, vòng 2 Hb: `GATE-INVITE-CLAUSE` trên base là ĐÚNG MỘT câu chứa từ-lọc → `grep -v` cho tập trái RỖNG → chân xanh bất kể HEAD viết gì | filter rút từ base tự loại chính câu chịu lực; mọi phép `comm/diff` với vế trái rỗng là hằng đúng |
| **doi-chung-tu-sinh** (định lý về grep) | cat-hinh-thuc, vòng 2 He: «đối chứng dương tự sinh» = chèn chuỗi vào bản sao rồi grep lại chính nó; thay 3/4 needle bằng chuỗi rác vẫn 4/4 | chèn-rồi-tìm-lại không chứng minh needle tương ứng vật thật; chỉ `base>0` hoặc fixture-do-code-sinh chứng được |
| **mut-khong-qua-chan-that** | cat-hinh-thuc, vòng 3 RB3-03: `MUTANT-PHUT` tự grep đầu ra bằng BẢN CHÉP của regex; xoá chân canh thật → suite vẫn xanh, mutant vẫn in «bi bat dung» | chiều đỏ phải đi qua CHÍNH hàm/khối mà chân xanh dùng; bản chép của phép đo không phải phép đo |
| **pinned-khong-dem-duoc** | cat-hinh-thuc, vòng 3 RA3-01: eval hứa «đúng SÁU dòng» nhưng `pinned:` chỉ đối chiếu SỰ CÓ MẶT của chuỗi — một SỐ ĐẾM không diễn đạt được thành chuỗi ghim | mọi lời hứa dạng «đúng N» cần bộ đếm thật (kiểu `so-ca.sh`), không nằm được trong lưới ghim-chuỗi |

## Hai nguyên tắc mới (chưa có chỗ trong engine)

1. **Phủ định phổ quát trên văn tự nhiên → lật allow-list.** «Không lời hứa X ở
   bất kỳ cách diễn đạt nào» là mệnh đề grep KHÔNG chứng được — ba vòng của 1a
   là bằng chứng: mỗi vòng thêm một literal, vòng sau tìm đúng cái chưa thêm
   (`5–10 phút` → `~5 phút` → `~10 phút` → `vài phút`). Cái chứng được: (a) lớp
   cú pháp hữu hạn (`[0-9~]\s*phút|minutes`) + **miễn trừ khai trước theo cặp
   (tệp, từ khoá), bánh cóc hai chiều**; (b) tên trường (`time_human_minutes`)
   — tập bên ghi hữu hạn, liệt kê được. Phần dư (từ-hình: «vài phút», «khoảng
   năm phút») là known-limit PHẢI KHAI kèm lệnh tái lập, backstop là mắt người
   + eval hành vi.
2. **Luật chứng-nhân-riêng của bộ ghi sổ** (đã trả giá H1 + H15, viết tay HAI
   lần — `ghi-so-chay.mjs` của 1b và `ghi-so-chay-1a.mjs`, trùng ~70%): mỗi
   eval máy khai `pinned:` ≥1 chuỗi; trong cùng nhóm-lệnh mỗi eval phải có ≥1
   chuỗi RIÊNG; chuỗi vắng trong đầu ra thật → eval đỏ dù lệnh thoát 0. Nó bắt
   được lỗ thứ 15 ngay lượt chạy đầu. **Giới hạn phải khai kèm:** hạt của nó là
   KHỐI/CHUỖI, không phải sức sống của từng chân — nó trả lời «khối có chạy
   không», không trả lời «khối có ĐỎ khi vật hỏng không» (vòng 2, kết luận
   trung tâm).

## Khuôn ba-lăng-kính chấm đối kháng (viết tay 3 lần tuần này — đáng thành reference)

Ba mandate song song, worktree riêng, context sạch, người thi công không chấm:
1. **Phép-đo-có-sống-không** — với MỖI chân: «nếu tôi phá vật thật trong bản
   sao, phép đo có đỏ không?» — phá thật, ghi lệnh, mục bắt buộc «Đã phá thử mà
   KHÔNG đỏ».
2. **Cắt-quá-tay / cộng-lén** — đọc TỪNG hunk của diff, đối chiếu từng hunk với
   tiêu chí đã duyệt; đếm độc lập số ca; so DANH SÁCH TÊN ca hai cây.
3. **Hợp-đồng-đối-vật** — đo lại TỪNG khẳng định định lượng; lớp lỗi đặc trưng:
   «số viết ở commit này, không đo lại sau commit kế».
Kèm ba bẫy môi trường phải dặn trước (root làm `chmod 000` FAIL giả → chạy qua
`su - tester`; pipe nuốt mã thoát; worktree chung `.git`). Nghi thức vòng sau:
**tái lập các lượt phá đã ghi lệnh của vòng trước** trước khi phá mới.

## Đường promote (SAU 1a/1c, một hồ sơ nhỏ)

- 4 hàng mới vào bảng `measure-birth.md` + cập nhật case `MM1` (TRIM/EXTEND,
  giữ đẳng thức số ca).
- Nguyên tắc allow-list thành một mục trong `measure-birth.md`.
- Khuôn ba-lăng-kính thành `skills/acceptance/references/` (hoặc nhập vào
  judge-personas).
- Quyết (a)/(b) cho vùng trắng răng-hồ-sơ.
