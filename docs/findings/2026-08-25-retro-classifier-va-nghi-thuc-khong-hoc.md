# Retro: lớp lỗi hạ tầng lặp 3 tuần — và vì sao nghi thức không học được nó

*Phạm vi: 6 hồ sơ, 04/08 → 25/08, dữ liệu từ run-log / evidence-report / sổ
trí nhớ các phiên. Viết 25/08, sau khi vòng design-pass-nac dính lớp này lần
thứ tư trong ngày.*

---

## 1. Sổ cái lớp lỗi «bộ phân loại an toàn chặn làn máy»

| Khi | Hồ sơ | Vòng dính | Hình dạng | Giá |
|---|---|---|---|---|
| 04/08 | judgment-runs | **5/8 vòng** BLOCKED | classifier chập chờn theo từng request; ~9 agent cần Bash, MỘT cái trúng là cả vòng hỏng | **~17M token** |
| 18/08 | release-2-2-0 | 1 vòng REJECT **GIẢ** | anh em khác họ: trần công cụ 120s giết suite 108s, mã thoát của công cụ bị đọc thành của lệnh | 1 vòng oan → đẻ luật TOOL-KILL |
| 20–21/08 | s4-scope-triage | r3, r4, r5 BLOCKED | mỗi vòng MỘT lệnh phụ trợ KHÁC NHAU trúng — mọi eval chính đều xanh cả ba lần | 3 lần chạy lại trọn vòng |
| 21/08 | repo-khai-plugin (chip A) | r1–r3 BLOCKED | fan-out 23–28 agent → rate-limit | **~7M token cho 0 bằng chứng** |
| 21–22/08 | vao-co-o-ra-co-ten (chip B) | **0** BLOCKED | đi đường verify độc lập tuần tự TỪ ĐẦU | 1 vòng sạch |
| 24–25/08 | design-pass-nac | r1, r2, r5a, r5b BLOCKED | fan-out; riêng 25/08 hai lượt liên tiếp | hôm nay ~4,6M cho 2 lượt chặn |

**Cộng dồn ghi nhận được: ~15 vòng bị chặn trong 3 tuần, ≥28M token chi cho
những vòng không sinh một dòng bằng chứng máy nào.**

## 2. Cơ chế — ba tầng

**Tầng cơ học.** Kho có **0 allow rule** trong `.claude/settings.json`, nên
MỌI lệnh Bash của MỌI agent đều phải qua bộ phân loại an toàn — kể cả 6 lệnh
suite CỐ ĐỊNH của chính kho, chạy hàng chục lần mỗi ngày. Fan-out 26–30 agent
cùng gọi Bash trong vài phút = bão request → rate-limit. Xác suất cả vòng sống
là pⁿ với n agent cần Bash; s4-scope-triage là minh hoạ xúc xắc: ba vòng liên
tiếp, ba lệnh khác nhau trúng đạn.

**Tầng thiết kế vòng.** Khi làn máy bị chặn, làn hội đồng + rà soát VẪN chạy
(~2M token/lượt). Không phí hẳn — hôm nay chúng bắt lỗi thật — nhưng mỗi lượt
chặn cũng đẻ finding mới → sửa → hash bộ đo đổi → carry-forward mất hiệu lực →
lượt sau lại chạy full. Và «BLOCKED → chạy lại CÙNG round» đụng cách mint
run_id (biết từ 21/08, chưa sửa).

**Tầng nghi thức — đây là phát hiện chính của retro.** Lời giải đã được TÌM RA
và CHỨNG MINH hai lần:

- 21/08, chip A vòng 4: đổi sang **verify độc lập — một phiên tươi, 5 lệnh
  tuần tự** → thông ngay sau 3 vòng chặn.
- 21–22/08, chip B: dùng đường đó **từ vòng đầu** → 0 BLOCKED.

Rồi lời giải đi đâu? Vào **trí nhớ** (một mệnh đề trong dòng chip A) và vào
**một ứng viên hạt giống chưa bao giờ được mở** («S4 cần đường thoái hoá khi
fan-out làm classifier quá tải — nghi thức chưa chỉ»). Nhánh BLOCKED của nghi
thức feature-loop đến hôm nay vẫn chỉ có một câu: *khắc phục nguyên nhân, chạy
lại cùng round* — không một chữ về đường thoái hoá. Đường verify độc lập sống
ở skill khác (acceptance Phase 3) và không được trỏ tới.

Hệ quả đo được ngay hôm nay: phiên này CÓ bài học đó trong chỉ mục trí nhớ,
và vẫn chạy fan-out **bốn lượt**, hai lượt cuối bị chặn, không một lần chuyển
đường.

## 3. Chẩn đoán gộp — một câu

> **Bài học chưa vào VẬT là chưa tồn tại.** Cùng một luật với kho skill («chưa
> commit là chưa tồn tại») và cùng một lớp với lỗi nặng nhất của vòng
> design-pass-nac («đóng trên giấy»: hứa trong hợp đồng mà thi công không
> giao). Kit đo được sản phẩm của nó rất gắt, nhưng **vòng học của chính kit
> không có chặng TRAO**: bài học sinh ra trong phiên → ghi trí nhớ / ghi ứng
> viên hạt giống → nằm đó → phiên sau trả học phí lại bằng token thật. Retro
> này xác nhận bằng số cứng đúng hạt giống đã mở từ rà soát North Star 2.3.0:
> *«vòng kit tự-dùng không có chặng bàn giao».*

## 4. Các vấn đề nghi thức KHÁC lộ ra cùng kỳ (không phải hạ tầng)

- **Vòng máy ghi đè bằng chứng thì xoá luôn chữ ký người** — máy không được
  viết lẫn xoá trường quyết định của người; chưa có lưới canh (25/08).
- **Không có làn «ship kèm giới hạn đã khai»** — luật dừng-vá nêu đó là một
  trong ba đường người được chọn; biên merge đòi PASS cứng. Owner ký rồi vẫn
  không gộp được (25/08).
- **Giới hạn cấu trúc của tự-chấm** — thước máy viết + mutant máy viết = một
  trí tưởng tượng; 5 vòng, 5 hình dạng lọt. Số lỗi BỘ ĐO không hội tụ về 0;
  thứ đáng đọc ở cổng là lỗi SẢN PHẨM (đã hội tụ 5→0 sau một vòng).
- **Finding ngoài hợp đồng bị TÁI khám phá mỗi vòng** — CONTEXT.md thiếu term
  được làn rà soát tìm lại nguyên vẹn ở vòng 3, 4, 5 — trả tiền rà soát ba lần
  cho cùng một tri thức đã ghi sổ.

## 5. Ba cửa sửa (đề xuất — chưa làm cái nào)

| Cửa | Nội dung | Giá / đảo | Giết được gì |
|---|---|---|---|
| **A** | Allowlist 6 lệnh suite cố định của chính kho vào `.claude/settings.json`; khuôn `acceptance-init` khuyên consumer làm tương tự với suite của họ | rẻ nhất; đảo = xoá rule. Đánh đổi: các lệnh này bỏ qua bộ phân loại — chấp nhận được vì chúng là script trong repo, đã qua PR review, chạy hàng chục lần/ngày | **~90% lớp lỗi tại gốc** cho self-host |
| **B** | Mở hạt giống (c) 21/08: viết đường thoái hoá vào nghi thức — một lượt fan-out BLOCKED vì classifier → lượt kế BẮT BUỘC đi verify độc lập tuần tự (tiền lệ: chip A r4, chip B r1) | một đoạn trong SKILL + con trỏ sang acceptance Phase 3 | phần còn lại của lớp, cho cả consumer không muốn allowlist |
| **C** | Fail-fast trong workflow: lệnh máy đầu bị classifier chặn → dừng vòng sớm, khỏi chi ~2M cho hội đồng/rà soát | chạm engine workflow — cần vòng nghiệm thu riêng | chi phí mỗi lượt chặn, không phải tần suất chặn |

**Khuyến nghị:** A + B gộp một ô nhỏ, làm trước khi chạy thêm bất kỳ lượt S4
nào; C xếp kho chờ. Căn cứ: A giết gốc cho kho tự host, B là bài học đã chứng
hai lần chỉ chờ được viết xuống, còn C tối ưu chi phí của một sự kiện mà A+B
làm cho hiếm.
