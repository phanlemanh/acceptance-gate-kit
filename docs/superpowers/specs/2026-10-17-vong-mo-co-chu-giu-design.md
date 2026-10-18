# Vòng mở có chủ giữ — thiết kế (GT1)

**Ngày:** 2026-10-17, viết lại 18/10 theo bản «nghi thức do máy gánh» · **Hồ sơ:** `_acceptance/vong-mo-co-chu-giu/` ·
**Hạng:** T2 · **Loại:** CỘNG. Chủ kho ký Cổng Đáng 17/10 («đáng: build · ngưỡng: nhận»). Ba phần CỘNG (lệnh
`tin.mjs` · hook tin · lời ghi danh sáu trường) chờ duyệt đích danh ở Cổng Phạm vi (ADR 0018).
**Nguồn:** hạt giống `docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md` (§4 bộ luật, §5 bảng răng, §6
phạm vi) · hàng `GT1` của `docs/plans/lo-trinh-kit.json` · gói `dieu-phoi/` ở `main` 3745b3e9 · lưu ý của điều phối
MacBook Pro 17/10 (hook chặn có lối thoát rõ, chiều đỏ trong bộ kiểm) · chủ kho 18/10: «Làm thế nào giảm thiểu nghi
thức cho người dùng mà vẫn đạt được mục đích, tôi muốn trải nghiệm người dùng đơn giản» → «làm».

## 1. Bài toán trong một đoạn

Mỗi yêu cầu giữa các phiên là một vòng mở. Hôm nay chỉ cạnh thợ → giám sát trong đợt có máy giữ vòng. Cạnh giám sát → thợ
và cạnh máy ↔ máy đóng vòng bằng trí nhớ (17/10: 0/44 yêu cầu trên #375 và #308 có trả lời trỏ về được tin gốc). Vòng
này cho máy giữ bốn thứ: **mã tin**, **sổ vòng mở**, **tin tự đến và chặn kết lượt khi còn việc chưa nhận**, **lời giao
việc đủ trường**. Ràng buộc trải nghiệm (chủ kho 18/10): **nghi thức do máy gánh**. Chủ kho không gõ khẩu lệnh nào; phiên
chỉ nói điều chỉ nó biết (một câu ý định, một câu trả lời), mọi thứ khác máy điền và tự kiểm.

## 2. Trải nghiệm

| Ai | Làm gì | Máy làm gì thay |
|---|---|---|
| Chủ kho | Không gì mới. Thấy vòng quá hạn trên bảng đợt đã có; ký ở các cổng như cũ. | Đưa vòng quá hạn mức 2 lên `xem`. |
| Người giao | `tin GIAO <đích> "<một câu ý định>" [--hang <mã>]` | Điền năm trường còn lại, in đủ sáu trường, sinh mã. |
| Người hỏi | `tin HỎI <đích> "<câu hỏi>" [--chan] [--khuyen "<khuyến nghị>"]` | Sinh mã, đánh dấu chặn hay không. |
| Người nhận | Thấy tin tự hiện trong phiên. Gõ `tin NHẬN <mã>`. | Đưa tin vào ngữ cảnh, ghi «đã đến», so kho với ranh giới. |
| Người làm xong | `tin XONG <mã>` (câu hỏi thì thêm câu trả lời) | Đính sha, nhánh, PR. |
| Ca hiếm | `tin KẸT <mã> "<cần gì>"` · `tin TRẢ <mã> "<lý do>" --chuyen <ai>` · `tin HUỶ <mã> "<lý do>"` · `tin BÁO <đích> "<câu>"` | — |
| Máy | — | Tự nhắc một lần khi quá hạn; tự canh kênh và báo khi chính bộ canh hỏng; chặn kết lượt một lần khi còn việc giao chưa nhận. |

Mọi lệnh một khuôn: `tin <KHẨU LỆNH> <đích hoặc mã> ["một câu"]`. Đếm chạm một vòng giao việc thông thường: một câu ý
định · một lệnh nhận · một lệnh xong (so với khoảng 7 trường gõ tay ở bản 17/10).

## 3. Hình dạng

### 3.1 Lệnh `dieu-phoi/scripts/tin.mjs`

Tám khẩu lệnh (hằng `KHAU_LENH`, một nguồn cho bộ đọc, `LUAT.md` và README): GIAO · HỎI · BÁO mở hoặc không mở vòng;
NHẬN · XONG · KẸT · TRẢ · HUỶ đáp. Thêm các lệnh phụ: `tin so` (sổ), `tin nhac <mã>` (nhắc tường minh, dùng trên kênh),
`tin vai --kenh <chủ/kho#số> --may <tên>` (ghi danh worktree giữ kênh, một lần mỗi máy), `tin canh` (bộ canh). Mọi lệnh
ghi kiểm bằng CHÍNH hàm kiểm của bên đọc rồi mới ghi, nếp `ghi.mjs`; sai thì thoát 1, nêu điều sai, 0 byte ghi.

### 3.2 Nơi chứa — hai nơi, không thêm hộp thư thứ ba

- **Trong đợt:** `<thư mục đợt>/tin.jsonl`, chỉ thêm dòng. Địa chỉ: mã dãy hoặc `G` (giám sát). Người gửi suy từ cwd:
  thuộc dãy → mã dãy; là `vai.json → giam_sat.worktree` → `G`; ngoài cả hai → từ chối «không thuộc đợt». Yêu cầu cũ
  `yeu-cau/<id>.json` là HỎI có mã từ thợ tới `G`, sổ đọc chúng và đóng khi có `tra-loi/<id>.json`. `yeu-cau.mjs`,
  `kiemYeuCau` và các tệp ấy không đổi một byte.
- **Kênh liên máy:** bình luận issue GitHub qua `gh api --paginate` (trang 30), mọi lời gọi `gh` có trần thời gian. Trạng
  thái cục bộ `<gốc kho chính>/.acceptance-runs/tin/kenh-<chủ>-<kho>-<số>.json`: tên máy, worktree giữ kênh, con trỏ, tin
  cuối đã biết, bản đã đồng bộ, dấu «đã đến», dấu «đã chặn». `gh` lấy từ `DIEU_PHOI_GH` nếu có (test thay bằng `gh` giả).
  `tin so --kenh --tu <ngày>` đếm cửa sổ theo `created_at`, mỗi trường một nghĩa: `vong_da_dong` · `vong_mo_qua_han_2` ·
  `vong_mo_chua_qua_han` · `khuon_cu_co_dich` · `bo_qua` + `bo_qua_ma` (bình luận không khẩu lệnh, để người đếm tay lọc văn
  xuôi không phải yêu cầu). Lệnh in thẳng phán quyết của ngưỡng: CHẾT khi `vong_mo_qua_han_2 + khuon_cu_co_dich > 0` · «cần
  đếm tay <k> bình luận» khi `bo_qua > 0` · SỐNG khi mọi số kia bằng 0 và tổng > 0 · VÔ HIỆU khi tổng bằng 0.

### 3.3 Mã và dòng đầu

- Mã `<người gửi>-<ddmm>-<n>` (ví dụ `MBP-1810-3`, `G-1810-1`, `P2-1810-4`); ba khúc nên không trùng mã yêu cầu cũ hai
  khúc `<dãy>-<số>`.
- Dòng đầu (máy chỉ đọc dòng này): `<KHẨU LỆNH> <mã> · <từ> → <đến>`. Lời đáp mang mã của vòng nó đáp. Thân từ dòng hai
  không bao giờ được phân loại.
- `docDongDau` chuẩn hoá NFC, nhận đúng tám khẩu lệnh chữ hoa (`HỦY` là bí danh của `HUỶ`). Dòng đầu khuôn cũ `[máy ·
  phiên → máy · phiên] loại` → `cu: true`, nhãn «tin không mã — không theo dõi vòng». Mọi thứ khác → bỏ qua.

### 3.4 Máy điền lời giao — MỘT hàm `loiGiaoViec`

`tin GIAO` và lời ghi danh của chip trong `tiep-tuc.mjs` cùng gọi `loiGiaoViec`. Máy điền:

| Trường | Trong đợt (đích là dãy) | Trên kênh (`--hang <mã>`) | Không suy được |
|---|---|---|---|
| Ý định | câu người giao; ở chip: dòng `Vì sao:` của ô cơ hội | câu người giao | thiếu câu → từ chối |
| Kết quả | «hồ sơ <slug> qua Cổng Bằng chứng · PR vào <nhanh_chinh>» từ hàng ĐANG CHẠY của dãy (hồ sơ chưa signed-off trong worktree); chưa vào hàng nào → hàng kế; hết hàng → từ chối | như trái, slug từ hàng lộ trình | từ chối «không suy được Kết quả», trừ khi có `--ket-qua` |
| Ranh giới | kho (remote `origin`), worktree, `hang.ranh_gioi` (vắng → «vùng tệp chưa khai — hỏi giám sát»), không chạm `bao_ve` | kho `--kho <chủ/kho>` (mặc định kho người giao), `ranh_gioi` của hàng nếu có | từ chối «không suy được Ranh giới», trừ khi có `--ranh-gioi` |
| Quyền | tự gộp theo `pha --tu-merge`; việc phụ qua `yeu-cau viec-phu` | «không tự gộp; việc phụ ghi hạt giống» | — |
| Điểm phải hỏi | chép §4.5 hạt giống | như trái | — |
| Báo về | «giám sát <mã phiên trong vai.json> qua tin — NHẬN · XONG» | «<tên máy> trên <kênh>» | — |

`--hang <slug>` chọn hàng tường minh; `--ket-qua`, `--ranh-gioi` ghi đè trường đã suy (cái gõ tay luôn thắng cái suy).
Lời giao in đủ sáu trường lên stdout trước khi ghi. Chip trong đợt mà hàng không có hồ sơ (không suy được Kết quả) → hành
động `khong-hang` với `ly_do` «lời giao thiếu Kết quả»; bảy hành động `HANH_DONG` không đổi; mọi chuỗi con mà ca của hồ sơ
đã ký đọc trong `ghi_danh` vẫn còn.

### 3.5 Đáp — người đáp không gõ gì máy biết được

- **NHẬN** không kèm gì. Máy ghi `sha` HEAD của người nhận lúc NHẬN (điểm xuất phát của việc). Với GIAO, máy so kho của
  cwd người nhận (remote `origin`, chuẩn hoá) với kho trong Ranh giới; lệch → từ chối, nêu hai kho và lệnh
  `tin KẸT <mã> "kho lệch"` chép được. Bước so này chỉ có tác dụng trên kênh: trong đợt, danh tính dãy đã chặn kho lệch từ
  trước («không thuộc đợt»). Với HỎI, NHẬN không bắt buộc (trả lời thẳng bằng XONG).
- **XONG** của GIAO không kèm gì CHỈ KHI cả ba cùng đúng: kho của cwd khớp Ranh giới · cây sạch · HEAD khác `sha` lúc NHẬN.
  Khi ấy máy đính `sha` HEAD, nhánh, và PR đang mở của nhánh (qua `gh pr view`, có trần; vắng thì bỏ). Thiếu một điều →
  đòi `--vat "<…>"`, nêu điều thiếu. XONG của HỎI đòi một câu trả lời.
- **KẸT / TRẢ / HUỶ** đòi đúng một câu (cần gì · lý do); TRẢ thêm `--chuyen <ai|không ai>`; HUỶ chỉ người giao.
- Người đáp NHẬN/XONG/KẸT/TRẢ phải là người nhận. Mã không có → từ chối. Vòng đã đóng → từ chối, nêu lời đóng.

### 3.6 Sổ vòng mở

GIAO/HỎI mở · «đã đến» (máy ghi) · NHẬN → `da-nhan` · KẸT → `ket` · XONG/TRẢ/HUỶ đóng · BÁO không mở. Trạng thái vòng mở:
`chua-den` → `da-den` → `da-nhan` | `ket`. Mức quá hạn biên nhận (chưa NHẬN): 0 trước hạn · 1 qua hạn · 2 qua hai lần hạn;
hạn mặc định 30′, GIAO khai `--han <phút>`. Mức 2 và cờ `ket_luot_chua_nhan` lên `xem` / `xem --json`.

### 3.7 Hook tin — ba chỗ, một tệp `hook-tin.mjs`

Ai là mình: dãy của cwd · `G` khi cwd là worktree giám sát · máy giữ kênh khi cwd là worktree đã `tin vai`. Lời gọi đến từ
tác tử con (stdin mang danh tính tác tử con theo khuôn Claude Code) → hook không làm gì: chỉ phiên chính nhận tin. Không ai →
thoát 0, không in, không tạo tệp (đường của mọi kho không dùng gói hay không dùng `tin`, luật 26/09). Hook chỉ xét vòng mở
bằng `tin` — yêu cầu cũ `yeu-cau/` không làm hook làm gì.

1. **Sau lời gọi công cụ và lời nhắc (`PostToolUse`, `UserPromptSubmit`) — tin tự đến:** tin mới gửi mình chưa từng đưa
   → trả `additionalContext` gồm dòng đầu, thân và lệnh đáp chép được, đúng MỘT lần mỗi tin; ghi «đã đến». Trên kênh chỉ
   đọc bản đã đồng bộ, KHÔNG gọi mạng. Vòng mình gửi chạm mức 1 → tự nhắc một lần: trong đợt ghi BÁO «nhắc <mã>»; trên kênh
   đưa vào ngữ cảnh lệnh `tin nhac <mã>` chép được (hook không tự đăng ra ngoài kho).
2. **Lúc dừng (`Stop`) — chặn kết lượt:** còn GIAO gửi mình chưa NHẬN (HỎI không chặn) → `{"decision":"block"}`, lời chặn
   nêu mã và lệnh NHẬN chép được. Với kênh, hook đồng bộ một lần trần 5 giây (giết tiến trình con khi hết trần); đọc không
   được → Hỏi-1 (khuyến nghị: chặn một lần với lời «không đọc được kênh — chạy `tin canh` rồi kết lượt lại»).
3. **Lối thoát — không bao giờ khoá phiên:** mỗi tập mã chặn tối đa một lần; lần dừng kế không có mã mới (hoặc
   `stop_hook_active`) → cho qua, ghi `ket-luot-chua-nhan`. Dấu luôn ghi cục bộ (`<thư mục đợt>/tin-chan/<mình>.json`, hoặc
   trạng thái kênh); hook KHÔNG BAO GIỜ ghi lên issue.

`hooks.json`: thêm mục `hook-tin.mjs` vào `PostToolUse`, `UserPromptSubmit` và khối `Stop` mới; mọi mục cũ giữ nguyên.

### 3.8 Lời: `scripts/mau/LUAT.md` và `README.md`

Khuôn `LUAT.md` thêm khối `<<<LUAT-TIN … LUAT-TIN>>>`: bảng «làm gì — máy làm gì thay» (§2), tám khẩu lệnh, luật vòng mở,
khi nào phải hỏi / không được hỏi (§4.5 hạt giống). README thêm mục «Giao tiếp giữa các phiên» cùng giới hạn đã khai.

## 4. Lựa chọn đã cân (căn cứ từng dòng ở `decisions.jsonl`)

- Năm trường lời giao do máy điền — hạt giống §4.3 đã đặt vậy.
- Bỏ ba dòng đọc lại, thay bằng máy so kho — lệch hạt giống §4.4, câu hỏi ở Cổng Phạm vi.
- Xong tự đính vật · tin tự đến · tự nhắc — máy quyết theo luật kit («render, không soạn») và theo gốc bài toán (trí nhớ).
- Hook chỉ xét vòng mở bằng `tin`; nơi chứa trong đợt là tệp mới; trạng thái kênh cục bộ; hook không ghi lên issue.
- Phiên ngoài đợt (chip điều phối mở thẳng) không trong vòng — câu hỏi ở Cổng Phạm vi.

## 5. Giới hạn đã khai

- **Hiểu sai ý định (khác với sai kho) lộ muộn hơn** khi bỏ đọc lại bằng lời. Ngưỡng: ≥ 1 ca thợ làm lệch ý định mà kho
  khớp và lời giao đủ trường.
- **Tin tới phiên đang ngủ chỉ đến ở lượt kế của phiên đó.** Đánh thức phiên đã đóng ngoài phạm vi.
- **Nhận biết tác tử con dựa vào khuôn stdin của Claude Code.** Ca kiểm chạy trên khuôn ghi trong ca, chưa phát lại stdin thật.
  Ngưỡng: ≥ 1 ca tin bị đưa vào tác tử con (sổ «đã đến» mà phiên chính không thấy).
- **So kho khi nhận việc chỉ bắt được nhầm kho trên kênh** và chỉ khi người giao khai đúng `--kho`.
- **Danh tính máy trên issue vẫn tự khai** (tệp 13/10).
- **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.
- **`send_message` của app không vào sổ** — đó là đường truyền; người gửi dùng `tin` để có mã.

## 6. Bảng dự báo năm dòng (luật (c))

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Lượt gọi người mỗi vòng | ↓ | bỏ «máy kia nghe chưa», «kiểm tra các phiên»; chủ kho không thêm nghi thức nào |
| Làm-xong → quyết-được | ↓ | quá hạn tự nổi, tin tự đến, xong mang vật |
| Vòng bị hạ tầng kit đốt lượt chấm | = | không chạm S4 |
| Token máy mỗi vòng | ≈ / ↓ | đọc sổ thay đọc luồng; vài dòng ngữ cảnh mỗi tin mới |
| Phút máy mỗi lượt chấm | = | không chạm S4 |

Điều kiện tin cậy: đường phán quyết S4 không đổi thành phần.

## 7. Đặc tả UX

Bỏ (sổ: «bỏ đặc-tả-UX»). Mặt người là chữ CLI và chữ hook; khuôn của nó là bảng §2 và khuôn lệnh §2.
