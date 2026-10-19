# Vòng mở không mất dấu — thiết kế (hàng GT2)

Hồ sơ: `_acceptance/vong-mo-khong-mat-dau/` · ô cơ hội đã ký Cổng Đáng 19/10 (build, nhận ngưỡng) · dựng trên GT1
(`_acceptance/vong-mo-co-chu-giu/`, gộp #387). Ba hạt giống nguồn: `docs/plans/2026-10-19-hat-giong-kenh-ghi-chong-dau-may.md`
(Ngoài-4, Ngoài-9), `-han-go-sai-bi-lo.md` (Ngoài-5), `-dap-yeu-cau-cu-bi-nuot.md` (Ngoài-7).

## 1. Người dùng gặp gì hôm nay

| # | Ca | Hậu quả | Tệp |
|---|---|---|---|
| 1 | Bộ canh nền (`tin canh --cho`) đang chờ mạng thì hook ghi «đã đến», «chấp nhận», «kết lượt khi chưa nhận» | Đồng bộ ghi đè trọn tệp trạng thái kênh bằng bản đọc trước khi chờ → dấu mất; vòng kẹt ở «chờ chấp nhận» dù người giao đã nghe | `dieu-phoi/scripts/tin-kenh.mjs` (`dongBo`) |
| 2 | Gõ `--han 1.5`, `--han abc`, `--han -5`, `--han-xong 0` | Lệnh báo thành công; bộ đọc chỉ hiểu `<số nguyên> phút` nên lặng lẽ dùng hạn mặc định 30′ hoặc coi như không hạn | `dieu-phoi/scripts/tin.mjs` (`gui`) ↔ `tin-doc.mjs` (`soPhut`) |
| 3 | `tin XONG P1-7 "…"` trên yêu cầu kiểu cũ (mã `<dãy>-<số>`) | Ghi một dòng mà bộ đọc dòng đầu bỏ qua (mã không đủ ba khúc) → báo thành công, người hỏi không nhận được, sổ vẫn mở | `tin.mjs` (`dap`) |

## 2. Thiết kế

### 2.1 Dấu máy ghi chỉ-thêm (ca 1)

- Tệp mới cạnh tệp trạng thái kênh: `kenh-<chủ>-<kho>-<số>.may.jsonl`. Mỗi dấu máy là MỘT lần `appendFileSync` một dòng
  JSON kết bằng `\n` — đúng nếp hộp tin của đợt (`tin-noi-chua.mjs`: «hai phiên ghi cùng lúc không đan dòng vào nhau»).
- Một nơi duy nhất đọc và ghi dấu máy kênh (một cặp hàm, đặt ở `tin-noi-chua.mjs` vì hook nạp nó an toàn, không kéo
  `tin-gh.mjs`): đọc = dấu cũ trong `may_su` của tệp JSON (đường đọc-cũ, không bắt chuyển) ∪ các dòng của tệp chỉ-thêm;
  ghi = chỉ thêm dòng. Hai bên ghi hôm nay (`noiChuaKenhCua().nc.them` trong `tin-kenh.mjs` và `cacMinh().nc.them` trong
  `tin-dua.mjs`) đều gọi hàm ghi này.
- Tên tệp kết bằng `.jsonl` nên bộ quét kênh của hook (`/^kenh-.+\.json$/`) không nhận nhầm nó là một kênh.
- `dongBo` thôi ghi đè bản cũ: sau khi gọi mạng, đọc LẠI tệp trạng thái, gộp bình luận mới vào `dong` theo id (hợp, không
  thay), đặt `con_tro`/`tin_cuoi` theo bình luận lớn nhất, giữ nguyên mọi trường khác (`chan`, `kenh_loi_chan_luc`, `may`,
  `worktree`, `ten`, `may_su` cũ) của bản vừa đọc lại, rồi ghi nguyên tử. Hai lần đồng bộ chồng nhau vì thế không làm mất
  bình luận hay lùi con trỏ.
- Giới hạn khai (sổ quyết định, dòng descope): giữa lần đọc lại và lần đổi tên tệp còn một khe cỡ mili-giây cho các trường
  JSON còn lại; không dựng khoá tệp. Ngưỡng mở: ≥ 1 lần hook dừng chặn kết lượt hai lần cho cùng một vòng trên kênh thật.

### 2.2 Hạn chỉ nhận số phút nguyên dương (ca 2)

- Một hàm kiểm `phutNguyenDuong(co, khoa)` trong `tin.mjs`: vắng → giá trị mặc định cũ; có mà không khớp `^[1-9]\d*$`
  → `LoiTin` «--<khoa> phải là số phút nguyên dương, nhận «<giá trị gõ>»». Gọi TRƯỚC mọi bước ghi hay gọi mạng của
  `GIAO` (`--han`, `--han-xong`) và `HỎI` (`--han`), ở cả đợt lẫn kênh.
- Không trần trên: số lớn hợp lệ được ghi nguyên văn và bộ đọc đọc lại đúng số ấy (ca round-trip bên viết → bên đọc).

### 2.3 Đáp yêu cầu kiểu cũ tới đúng người hỏi (ca 3)

Yêu cầu kiểu cũ chỉ có trong đợt (`yeu-cau/<dãy>-<số>.json`, sổ đọc nó thành vòng `yeu_cau_cu`, người nhận `G`).
Người hỏi chờ ở `tra-loi/<id>.json` — tệp mà bộ phát lịch, `hook-cho-nguoi`, `viec-cho` và lệnh chờ của phiên thợ đều đọc.

| Khẩu lệnh trên yêu cầu kiểu cũ | Hành vi mới |
|---|---|
| `XONG <id> "<câu>" [--ket-qua <kq>]` | Ghi `tra-loi/<id>.json` = `{ket_qua: <kq> ?? "da-tra-loi", boi: "giam-sat", ly_do: <câu>, luc}` qua `ghiTraLoi` của `ghi.mjs` (cùng bộ ghi và bộ kiểm `kiemTraLoi` của lệnh `dieu-phoi.mjs tra-loi`); in một dòng «đã trả lời <id> vào hộp của <dãy>». Thiếu câu → từ chối như XONG một câu hỏi. |
| `TRẢ <id> "<lý do>" --chuyen <ai>` | Ghi `tra-loi/<id>.json` = `{ket_qua: "tra-lai", boi: "giam-sat", ly_do: "<lý do> — chuyển: <ai>", luc}` cùng đường. |
| `NHẬN`, `KẸT`, `HUỶ`, `MỞ LẠI` | Từ chối, thoát 1, không ghi byte: «<id> là yêu cầu kiểu cũ — chỉ đáp được bằng tin XONG <id> "<câu>" hoặc tin TRẢ <id> "<lý do>" --chuyen <ai>». |

- Máy không bao giờ tự ghi `duyet`: với yêu cầu gia hạn, `duyet` tự kéo dài hạn thuê ở nhịp kế (README gói). Người đáp
  muốn duyệt thì ghi `--ket-qua duyet`.
- Kiểm danh tính giữ như vòng mã mới: chỉ `G` (người nhận của yêu cầu kiểu cũ) được XONG/TRẢ.
- Sau khi ghi, sổ đọc lại thấy `da_tra_loi` → vòng `dong`, không còn trong sổ mở.

### 2.4 Lời (LUAT.md của gói)

Bảng «Mỗi việc một lệnh» trong khối `LUAT-TIN` của `dieu-phoi/scripts/mau/LUAT.md` thêm hai điều, mỗi điều một dòng:
hạn là số phút nguyên dương; yêu cầu kiểu cũ đáp bằng `tin XONG`/`tin TRẢ`, câu trả lời vào hộp người hỏi.

## 3. Đo thế nào (kế hoạch, chiều đỏ)

- Tệp ca mới `tests/dieu-phoi/tin-khong-mat-dau.test.mjs`, tên ca `GD-01…GD-10`, dùng chung bộ dựng kho thử của GT1
  (`tin-kho-thu.mjs`: kho git tạm, gh giả qua `DIEU_PHOI_GH`, hook rút từ `hooks.json`). Mọi fixture do lệnh `tin`, hook
  thật và CLI `dieu-phoi.mjs` sinh trong lượt.
- Chen thật cho ca 1: gh giả thêm một tuỳ chọn trễ (giữ lời gọi đọc bình luận N ms); ca chạy `tin canh --kenh …` của BẢN
  ĐANG KIỂM (không phải gói thật — tránh lỗi «chạy gói thật GOI» GT1 đã ghi giới hạn) ở tiến trình nền, trong khe trễ chạy
  hook thật (PostToolUse ghi «đã đến»/«chấp nhận», Stop ghi «kết lượt» + dấu chặn), chờ canh xong, rồi đọc sổ.
- Mỗi ca xanh có ca đỏ chạy CHÍNH hàm đo trên bản sao gói bị tiêm (kiểm bước tiêm đã áp), sau khi bản lành xanh trên cùng
  fixture, ghim thông điệp của đúng hàng bị tiêm. «0 byte ghi» = băm nơi chứa trước === sau.

## 4. Ngoài phạm vi

- Khoá tệp cho các trường JSON còn lại của trạng thái kênh (khe mili-giây — §2.1).
- HUỶ yêu cầu kiểu cũ bởi chính người hỏi; chuyển yêu cầu kiểu cũ sang khuôn mã mới.
- Các mục Ngoài-n khác của GT1 (dấu báo lỗi nạp không gỡ — Ngoài-8; mốc 24 giờ của MỞ LẠI — Ngoài-10; các giới hạn bộ kiểm).
