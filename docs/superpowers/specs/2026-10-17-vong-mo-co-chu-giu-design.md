# Vòng mở có chủ giữ — thiết kế (GT1)

**Ngày:** 2026-10-17 · **Hồ sơ:** `_acceptance/vong-mo-co-chu-giu/` · **Hạng:** T2 · **Loại:** CỘNG. Chủ kho ký Cổng
Đáng 17/10 («đáng: build · ngưỡng: nhận»); ba phần CỘNG (lệnh `tin.mjs` · khối hook dừng · lời ghi danh sáu
trường) chờ duyệt đích danh ở Cổng Phạm vi (ADR 0018).
**Nguồn:** hạt giống `docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md` (§4 bộ luật, §5 bảng răng, §6
phạm vi) · hàng `GT1` của `docs/plans/lo-trinh-kit.json` · gói `dieu-phoi/` như ở `main` 43ed9e2b · lưu ý của điều phối
MacBook Pro 17/10: hook chặn kết lượt phải có lối thoát rõ và chiều đỏ trong bộ kiểm.

## 1. Bài toán trong một đoạn

Mỗi yêu cầu giữa các phiên là một vòng mở. Hôm nay chỉ cạnh thợ → giám sát trong đợt có máy giữ vòng (`yeu-cau` có mã,
`tra-loi/<mã>.json`). Cạnh giám sát → thợ và cạnh máy ↔ máy đóng vòng bằng trí nhớ. Đo 17/10: 0/44 yêu cầu trên #375 và
#308 có trả lời trỏ về được tin gốc. Vòng này cho máy giữ bốn thứ: **mã tin**, **sổ vòng mở**, **chặn kết lượt khi còn
tin chưa nhận**, **khuôn lời giao việc**. Tất cả nằm trong gói `dieu-phoi`, chạy trên hai nơi chứa đã có: thư mục đợt
và kênh issue liên máy.

## 2. Hình dạng

### 2.1 Một lệnh mới: `dieu-phoi/scripts/tin.mjs`

| Lệnh | Làm gì |
|---|---|
| `tin gui <GIAO\|HỎI\|BÁO> [--den <địa chỉ>] [trường…] [--kenh <chủ/kho#số>]` | sinh mã, dựng dòng đầu, kiểm trường, ghi. In mã. |
| `tin tra <mã> <NHẬN\|XONG\|KẸT\|TRẢ\|HUỶ> [trường…]` | đáp một vòng có mã; kiểm người đáp và trường bắt buộc. |
| `tin so [--cua-toi] [--json] [--kenh …]` | sổ vòng mở theo tuổi, kèm mức quá hạn. |
| `tin nhac <mã>` | người gửi nhắc MỘT lần khi quá hạn biên nhận; lần hai từ chối. |
| `tin vai --kenh <chủ/kho#số> --may <tên>` | ghi danh worktree này là người giữ kênh của máy `<tên>`. |
| `tin canh --kenh … [--cho]` | bộ canh có chiều đỏ: bắt lại tin cuối đã biết rồi mới đọc tiếp; `--cho` chờ tới khi có tin gửi mình. |

Mọi lệnh ghi qua MỘT hàm kiểm của bên đọc rồi mới ghi, đúng nếp `ghi.mjs`. Sai thì thoát 1, nêu trường sai, không ghi
byte nào.

### 2.2 Nơi chứa — hai nơi, không thêm hộp thư thứ ba

- **Trong đợt:** `<thư mục đợt>/tin.jsonl`, chỉ thêm dòng (cùng nếp `su-kien.jsonl`). Địa chỉ: mã dãy (`P1`…) hoặc `G`
  (giám sát). Người gửi suy từ cwd: cwd thuộc dãy → mã dãy; cwd là `vai.json → giam_sat.worktree` → `G`; ngoài cả hai
  → từ chối «không thuộc đợt».
  Yêu cầu cũ `yeu-cau/<id>.json` vẫn là HỎI có mã từ thợ tới `G`. `tin so` đọc chúng như vòng mở, và đóng chúng khi có
  `tra-loi/<id>.json`. Đọc thôi: `yeu-cau.mjs`, `kiemYeuCau` và các tệp đó không đổi một byte (luật 26/09: kho đang
  dùng `yeu-cau` không đổi gì).
- **Kênh liên máy:** bình luận issue GitHub, đọc và ghi qua `gh api`. Trạng thái cục bộ nằm ở
  `<gốc kho chính>/.acceptance-runs/tin/kenh-<chủ>-<kho>-<số>.json`: tên máy, worktree giữ kênh, con trỏ (mã bình luận
  cuối đã đọc), tin cuối đã biết (mã bình luận, dòng đầu), và bản chép các dòng đã phân loại. Tên máy không vào cấu
  hình commit, vì mỗi máy một tên. Lệnh `gh` lấy từ `DIEU_PHOI_GH` nếu có, không thì `gh`. Đó là chỗ duy nhất test thay
  `gh` thật bằng một `gh` giả đọc và ghi tệp ca. Bộ đọc luôn gọi `gh api --paginate` (trang 30 bình luận của GitHub),
  và mọi lời gọi `gh` có trần thời gian.
  `tin so --kenh --tu <ngày>` đếm cửa sổ theo `created_at` thành ba nhóm: có mã · khuôn cũ (kèm số có đích) · bỏ qua
  (kèm danh sách mã bình luận). Đây là thước của ngưỡng thứ hai, đếm cả câu văn xuôi không khẩu lệnh.

### 2.3 Mã và dòng đầu

- Mã: `<người gửi>-<ddmm>-<n>`, ví dụ `MBP-1710-3`, `G-1710-1`, `P2-1710-4`. `<n>` = lớn nhất cùng tiền tố và ngày trong
  nơi chứa, cộng 1. Mã ba khúc không bao giờ trùng mã yêu cầu cũ hai khúc `<dãy>-<số>`.
- Dòng đầu (máy chỉ đọc dòng này): `<KHẨU LỆNH> <mã> · <từ> → <đến>`. Dòng đáp mang mã của vòng nó đáp. Thân tin từ
  dòng thứ hai không bao giờ được phân loại.
- Bộ đọc `docDongDau` chuẩn hoá NFC, nhận đúng tám khẩu lệnh chữ hoa (`HỦY` là bí danh của `HUỶ`). Dòng đầu khuôn cũ
  `[máy · phiên → máy · phiên] loại` → mục `cu: true`, hiện dưới nhãn «tin không mã — không theo dõi vòng», không mở
  vòng. Mọi thứ khác → bỏ qua.

### 2.4 Trường bắt buộc (hạt giống §4.1, §4.3, §4.4)

| Khẩu lệnh | Thiếu thì từ chối |
|---|---|
| GIAO | `--y-dinh`, `--ket-qua`, `--ranh-gioi`. `--quyen`, `--diem-hoi`, `--bao-ve` có mặc định; `--han <phút>` mặc định 30. |
| HỎI | `--chan co\|khong`, `--khuyen <khuyến nghị kèm căn cứ>` |
| NHẬN một GIAO | `--se-giao`, `--giu-trong`, `--dung-hoi` (ba dòng đọc lại, §4.4) |
| NHẬN một HỎI | `--tra-luc <khi nào sẽ trả lời>` |
| XONG một GIAO | `--vat` (sha · PR · kết quả lệnh · tệp) |
| XONG một HỎI | `--tra-loi` |
| KẸT | `--can` (cần gì, từ ai, từ giờ nào) |
| TRẢ | `--ly-do`, `--chuyen` (ai, hoặc «không ai») |
| HUỶ | `--ly-do`; chỉ người giao được huỷ |

Người đáp NHẬN/XONG/KẸT/TRẢ phải là người nhận của vòng. Vòng đã đóng thì mọi lời đáp bị từ chối, nêu lời đóng.

### 2.5 Sổ vòng mở

`tin so` gấp mọi dòng: GIAO/HỎI mở vòng · NHẬN → «đã nhận» · KẸT → «kẹt» · XONG/TRẢ/HUỶ đóng · BÁO không mở vòng.
Mức quá hạn biên nhận: 0 khi đã NHẬN hoặc chưa tới hạn · 1 khi qua hạn · 2 khi qua hai lần hạn. Mức 2 lên bề mặt đã có
(`xem`, `xem --json`), không gửi tin mới cho chủ kho (§4.2.3). Mỗi mục mang thêm cờ `ket_luot_chua_nhan` khi bên nhận
đã được hook cho kết lượt qua lối thoát (§2.6).

### 2.6 Hook dừng — một khối `Stop` trong `dieu-phoi/hooks/hooks.json`

`hook-tin.mjs` đọc `cwd`, `session_id`, `stop_hook_active` từ stdin.

1. **Ai là mình:** dãy của cwd · `G` khi cwd là worktree giám sát · máy giữ kênh khi cwd là worktree đã `tin vai`.
   Không ai → thoát 0, không in, không tạo tệp. Đây là đường của mọi kho không có đợt, không có kênh (luật 26/09).
2. **Tin chưa NHẬN gửi mình:** vòng mở, đến mình, chưa có NHẬN/KẸT/TRẢ/XONG của mình — CHỈ tính vòng mở bằng `tin`
   (`tin.jsonl` hoặc kênh). Yêu cầu cũ `yeu-cau/` hiện trên sổ nhưng KHÔNG làm hook chặn: kho không ai dùng `tin` thì
   hook không bao giờ chặn, tức gói nâng lên không đổi hành vi của đợt đang chạy (luật 26/09: bật theo lựa chọn trước
   đổi mặc định — ở đây «lựa chọn» là chính việc có người gửi `tin`).
   Với kênh, hook đồng bộ một lần với trần 5 giây (kể cả khi `gh` treo, hook giết tiến trình con khi hết trần).
   `gh` lỗi hay quá trần → Hỏi-2 (Cổng Phạm vi). Khuyến nghị: **chặn MỘT lần** với lời «không đọc được kênh … — chạy
   `tin canh` rồi kết lượt lại». Lần dừng kế trong 30′ thì cho qua. Đây là nhánh lỗi của cùng lối thoát ở bước 4. Lối
   khác: không chặn, chỉ in một dòng `systemMessage`. Dòng ấy hiện cho người chứ không chắc tới model, nên hình dạng
   giống bộ canh câm 15/10.
3. **Chặn:** `{"decision":"block","reason":…}`. Lời chặn nêu từng mã, dòng đầu, và lệnh NHẬN chép được nguyên văn.
4. **Lối thoát — không bao giờ khoá phiên vĩnh viễn:** mỗi tập mã chặn tối đa MỘT lần. Lần dừng kế mà tập mã chưa
   nhận không có mã nào mới (hoặc `stop_hook_active` là true) → cho qua. Dấu «đã chặn» và dòng `ket-luot-chua-nhan`
   (mã, người nhận, lúc) LUÔN ghi ở chỗ cục bộ: `<thư mục đợt>/tin-chan/<mình>.json` trong đợt, trường `chan` của
   `.acceptance-runs/tin/kenh-….json` với kênh. Hook KHÔNG BAO GIỜ ghi lên issue (không lời gọi `gh` nào ghi). Sổ và
   `xem` đọc dấu ấy. Tin mới tới sau đó chặn lại một lần nữa.

### 2.7 Lời giao việc sáu trường — MỘT hàm `loiGiaoViec`

`tin gui GIAO` và lời ghi danh của chip trong `tiep-tuc.mjs` cùng gọi `loiGiaoViec({y_dinh, ket_qua, ranh_gioi, quyen,
diem_hoi, bao_ve})`, trả sáu dòng có nhãn. Ở chip trong đợt, máy điền:

- **Ý định:** dòng `Vì sao:` của ô cơ hội `_acceptance/<slug>/opportunity.md` trong worktree; vắng → `feature:` của
  hợp đồng; vắng → «đọc hồ sơ <slug>».
- **Kết quả:** «hồ sơ <slug> qua Cổng Bằng chứng · PR vào <nhanh_chinh>».
- **Ranh giới:** kho, worktree, `hang.ranh_gioi` (vắng → «vùng tệp chưa khai — hỏi giám sát trước khi chạm ngoài hồ
  sơ»), không chạm `bao_ve`.
- **Quyền:** tự gộp theo `pha … --tu-merge`; việc phụ đi qua `yeu-cau viec-phu`.
- **Điểm phải hỏi:** chép §4.5 của hạt giống.
- **Báo về:** «giám sát <mã phiên trong vai.json> qua `tin.mjs` — NHẬN · KẸT · XONG». Trường này mang mã phiên, không
  mang tên phiên — vấp 17/10 «báo nhầm về phiên mở chip».

Hàng không có hồ sơ (không suy được Kết quả) → dãy không nhận `mo-chip`; hành động là `khong-hang` với `ly_do` «lời giao
thiếu Kết quả». Ghi danh vẫn giữ mọi chuỗi con mà ca của hồ sơ đã ký đòi: thư mục đợt, lệnh `ghi-danh`, «đọc LUAT.md
trước S1», `/feature-loop:feature-loop <slug>`, dòng bàn giao. Bảy hành động của `HANH_DONG` không đổi.

### 2.8 Lời: `scripts/mau/LUAT.md` và `README.md`

Khuôn `LUAT.md` thêm mục «Giao tiếp — khẩu lệnh và vòng mở»: tám khẩu lệnh, luật vòng mở §4.2, đọc lại ba dòng §4.4,
khi nào phải hỏi và khi nào không được hỏi §4.5, lệnh `tin.mjs`. Khối nằm trong marker `<<<LUAT-TIN … LUAT-TIN>>>` để
test rút đúng khối và so với hằng của `tin.mjs` (một nguồn cho danh sách khẩu lệnh). README thêm mục «Giao tiếp giữa
các phiên» cùng giới hạn đã khai.

## 3. Lựa chọn đã cân (chi tiết + căn cứ ở `decisions.jsonl`)

- Nơi chứa trong đợt là `tin.jsonl` mới, KHÔNG thêm `loai` cho `yeu-cau`: lời giao cấm chạm `loai`/`kiemYeuCau`.
  Hạt giống §5 «khuôn yêu cầu cũ chính là GIAO / HỎI có mã» được giữ bằng cách sổ đọc luôn yêu cầu cũ.
- Tên máy và con trỏ kênh ở trạng thái cục bộ, không ở `_acceptance/config.yaml`: tệp commit thì mọi máy chung một tên.
- Hook chỉ chặn vòng mở bằng `tin`, không chặn vì yêu cầu cũ: nâng gói không đổi hành vi đợt đang chạy.
- Kênh lỗi lúc dừng: chặn một lần hay chỉ cảnh báo — Hỏi-2 ở Cổng Phạm vi (khẩu vị rủi ro).
- Chặn một lần mỗi tập mã: Claude Code sẽ chạy lại hook mỗi lần dừng; chặn mãi thì khoá phiên.
- Có răng cho sự có mặt của ba dòng đọc lại, nhưng sự khớp với lời giao vẫn là lời (hạt giống §5, ngưỡng giữ nguyên).
- Phiên ngoài đợt trên cùng máy (chip `start_session` của điều phối, không mở đợt) KHÔNG trong vòng. Đây là câu hỏi
  Hỏi-1 ở Cổng Phạm vi, vì nó là đánh đổi giá trị.

## 4. Giới hạn đã khai

- **So khớp đọc lại với lời giao là phán xét của giám sát.** Ngưỡng dựng răng (hạt giống §5): ≥ 1 ca thợ làm lệch phạm
  vi mà tin NHẬN đã khai đúng phạm vi.
- **Danh tính máy trên issue vẫn tự khai** (giới hạn của tệp 13/10, ngưỡng giữ nguyên).
- **Tin gửi bằng `send_message` của app không vào sổ.** Đó là đường truyền, không phải nơi chứa. Người gửi dùng
  `tin gui` để có mã, rồi chuyển chữ in ra qua đường truyền nào cũng được.
- **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Mạng lỗi lúc dừng thì chỉ có lời chặn một lần (hoặc cảnh báo, tuỳ
  Hỏi-2). Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.

## 5. Bảng dự báo năm dòng (luật (c))

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Lượt gọi người mỗi vòng | ↓ | bỏ «máy kia có nghe không» và «kiểm tra các phiên» |
| Làm-xong → quyết-được | ↓ | quá hạn tự nổi trên `xem`; XONG mang vật |
| Vòng bị hạ tầng kit đốt lượt chấm | = | không chạm S4 |
| Token máy mỗi vòng | ≈ / ↓ | đọc sổ thay cho đọc trọn luồng (≈ 20 nghìn token mỗi lần đọc #375) |
| Phút máy mỗi lượt chấm | = | không chạm S4 |

Điều kiện tin cậy: đường phán quyết S4 không đổi thành phần.

## 6. Đặc tả UX

Bỏ, vì vòng không có mặt người nhìn; mặt người là chữ CLI và chữ hook (sổ quyết định, dòng «bỏ đặc-tả-UX»).
