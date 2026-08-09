# Reflect — thử nghiệm lần 1 của kit sau tái lập (08–09/08/2026)

*Soạn: phiên B, trước khi mở feature #2 (quyết của owner). Nguồn: sổ vấp 20
dòng (`docs/research/so-vap-trien-khai.md`), hai vòng đã ký
(`mcp-cost-guard` @floorplanstudio · `consumer-copy-cjs` @kit), 3 lần re-pin,
[tổng kết ván 1](2026-08-08-gd2-van-1-mcp-cost-guard-tong-ket.md). Mọi sha
trích ở đây đã qua `git cat-file -e`.*

Thử nghiệm lần 1 phủ được gì: một feature sản phẩm trọn vòng ở repo tiêu thụ
(điều 29 việc trước chưa từng làm) · một bugfix engine tự-host trọn vòng ·
chế độ tự hành hai-phiên A/B với owner chỉ giữ cổng · ba tình huống re-pin
trong đó hai tình huống chưa có tiền lệ. Không món nào diễn tập — tất cả là
việc thật, chữ ký thật, main thật.

## 1 · Đứng vững — và đứng vững theo cách đắt giá hơn kỳ vọng

**Ba viên ngọc không chỉ sống sót, chúng bắt được cả chính hệ thống.**

- *Bằng chứng không giả được* bắt: bản vá công cụ của chính nó (staleness sau
  parity), subagent review sửa cây thật (SECURITY WARNING + hoàn tác), và cả
  chú-thích-đổi-trong-mã-t3. Lưới không chừa ai — kể cả B và A. Chữ ký owner
  nguyên vẹn qua cả 3 re-pin, kiểm từng lần.
- *Luật dừng* được thi hành **6 lần** trong 48 giờ bởi máy (khói 1a · chặn-merge
  recheck · lệch-phạm-vi re-pin 1 · P42/P45 lần-2-cùng-lớp · staleness parity ·
  lớp-mới comment-t3) — lần nào máy cũng dừng-và-hỏi thay vì lách. Đây là hành
  vi mà trước tái lập phải trả 5 vòng REJECT mới mua được một lần.
- *Cổng 1 trước code* chặn lỗi thật hai lần trước khi code tồn tại (chữ-vật
  "số dòng export"; coverage stale) — nhưng xem mục 3: chế độ tự hành đã một
  lần đảo thứ tự này.

**Khoá 6 thao tác cổng người (ADR 0002) là bất biến giá trị nhất của chế độ tự
hành** — nó biến "máy không được ký" từ lời dặn thành vật lý. Cả A lẫn B đều
từng vô ý thử vượt (khối dán của B giao lệnh cổng cho máy) và đều bị chặn đúng.

## 2 · Lộ ra — bốn lớp, không phải hai mươi vấp

20 dòng sổ vấp quy về bốn lớp; đề bài 2.1/GĐ4 nên đi theo lớp, đừng đi theo dòng:

1. **Vật-chép-sang-consumer chưa từng được đo ở consumer** (dòng 1–3, 5, 11–12):
   CJS/ESM giết recheck từ ngày init, lib chép thiếu tắt tiếng gap-probe, path
   ghim version cũ. → **ĐÃ VÁ TẬN GỐC 1.39.1** + phép đo consumer-sim round-trip
   canh vĩnh viễn. Lớp này coi như đóng; bài học ở lại: mọi vật phát đi phải có
   phép đo ở phía nhận.
2. **Lưới staleness bắt nhầm loại thay đổi** (dòng 8, 16–17, 20): 3 re-pin cho 1
   feature — vá công cụ, chép parity, sửa chú thích đều bị tính như "mã đổi sau
   chấm". Mỗi lần gỡ đều cần người quyết. → đề bài 2.1 số 1: staleness phân
   biệt bằng máy (đường công cụ có re-pin-sau-chép ghi trong docs init; diff
   comment-only có phép-chặt xoá-comment-so-byte đã có tiền lệ hẹp + proof file
   mẫu). KHÔNG đi đường miễn trừ — đã bác vì fail-silent.
3. **Nghi thức không co giãn theo cỡ việc** (dòng 13, cả GĐ1 cũ): bugfix đổi tên
   file mang trọn ceremony T3; /approve vẫn hỏi phút (1a chết cùng 2.0.0);
   re-pin 30 workspace cho một đổi-tên file test (1d cũng chết). → đề bài 2.1
   số 2: hồi sinh phần TRỪ của 2.0.0 bằng đường đã học (grep-sweep tập-rỗng cho
   việc TRỪ, `lib/workspace-record.js` cho 1b) — giờ có số liệu 2 vòng thật làm
   bằng chứng thay vì cảm giác mệt.
4. **Chế độ tự hành cần luật thành văn riêng** (dòng 4, 9–10, 14): phiên chip
   code trước Cổng 1; khối dán giao lệnh cổng-người cho máy; "owner đã uỷ
   quyền" trong tin nhắn buộc phiên nhận hỏi lại; sổ vấp ghi-rồi-mất. → ĐÃ
   THÀNH VĂN trong memory giao-thức phiên B (6 luật: contract-trước-code ·
   nghi-thức-tương-xứng · báo-cáo-chủ-động 4 mốc · thẩm-quyền-kiểm-chứng-được ·
   phép thử 6-thao-tác-cổng · ghi-xong-dán-lại). Chưa cần vào engine — thử
   thêm ≥2 ván rồi mới quyết nâng thành tài liệu kit (luật đóng băng).

## 3 · Lỗi của từng vai — ghi để không thành huyền thoại "máy tự chạy hoàn hảo"

- **B** (phiên cố vấn): giao lệnh cổng-người cho máy (vi phạm sổ luật mình cầm);
  chữ "owner đã uỷ quyền" trong tin giao việc gây 2 lượt hỏi lại; lệnh viết ẩu
  ("xoá mục nợ" — may A đọc đúng thành thu-hẹp-nợ); đề bài đầu góp phần
  ceremony-phình. Grep đầu tiên 3 lần liền quên sanity counter.
- **A** (các phiên thi hành): code trước Cổng 1 (chip); 2/3 vòng S4 kit cháy vì
  bộ đo của chính kit; sổ vấp phiên 1 ghi-rồi-mất không dấu vết.
- **Owner giữ đúng vai người**: 2 lần từ chối cám dỗ sửa-ngay-giữa-chừng (dấu
  hiệu cách-làm-cũ → sổ vấp thay vì hotfix), 3 quyết định tiền lệ đều kèm điều
  kiện khoá. Số lần bị gọi: nhiều hơn ngưỡng ≤2 — nhưng toàn quyết định thật,
  không có lần nào là nghi thức rỗng. Ngưỡng cần khai lại theo tier ở ván #2.

## 4 · Điều kiện trước khi mở feature #2 — checklist

- [x] Kit 1.39.1 + floorplanstudio parity + T1 sạch, CI xanh hai repo.
- [x] Giao thức tự hành thành văn (memory B + nhúng đề bài).
- [x] Sổ vấp 20 dòng phân lớp xong (hồ sơ này).
- [ ] Feature #2: chọn đề bài THẬT (không phải việc kit); đề bài mang đủ giao
      thức mới; ngưỡng gọi-người khai lại theo tier TRƯỚC khi mở.
- [ ] Cổng Giá trị lần đầu trên mcp-cost-guard — không cần chờ feature #2,
      chạy được song song khi owner sẵn.

**Không mở việc 2.1 nào cho tới khi đủ ≥3 feature thật + Cổng Giá trị đã chạy**
— lệnh đóng băng còn nguyên; hồ sơ này chỉ xếp hàng đề bài, không mở nó.
