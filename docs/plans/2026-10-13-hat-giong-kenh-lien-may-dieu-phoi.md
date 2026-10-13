# Hạt giống — kênh liên máy riêng cho các phiên điều phối (kho git làm hộp thư)

**Ngày:** 2026-10-13 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** CỘNG, cần owner duyệt đích danh (ADR 0018).
Gốc: hai kênh liên máy đang chạy bằng issue GitHub — `phanlemanh/acceptance-gate-kit#308` (khoá gộp `main` kit,
60 bình luận từ 11/10) và `phanlemanh/crm-onehub#375` (phân vùng ba máy, 54 bình luận / ≈ 70 nghìn ký tự trong ≈ 15
giờ, 12/10 09:46Z → 13/10 01:12Z). Đo ngày 13/10 bằng `gh issue view --json comments`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Thiết kế dưới đây là kết quả một phiên thảo luận với owner ngày 13/10. Owner dặn chưa thực hiện.

**Đánh giá cuối ngày 13/10 (Điều phối M5, owner đồng ý):** giữ bản đầy đủ ở SỔ. Lợi đo được trong ngày nhỏ hơn giá
dựng hạ tầng mới trên ba máy. Ngưỡng cũ đếm *số lần xảy ra* nên chạm hai lần mà thiệt hại ≈ 0; ngưỡng mới ở cuối tệp
đếm *thiệt hại*. Lớp lỗi thật còn hở là **bộ canh câm** — xem «Bước nhỏ trước».

## Giới hạn của kênh issue hiện tại

1. **Không có gì đánh thức phiên.** Bên nhận chỉ thấy tin khi tự đọc theo lịch 30′. Phiên đã đóng, hết ngữ cảnh
   hay đang giữa một lượt thì tin nằm đó.
2. **Không biết bên kia đã đọc chưa.** Không có trạng thái «đã nhận» hay «đã đọc» (cùng lớp với `queued` ngày 23/09).
3. **Danh tính chỉ là lời tự khai.** 114/114 bình luận cùng tài khoản `phanlemanh`. Máy và phiên chỉ nằm ở dòng
   đầu `[máy · phiên → …]` do model tự viết. Bình luận owner gõ không phân biệt được với bình luận máy viết, nên
   kênh không chở được quyết định người (ADR 0002).
4. **Khoá #308 không chặn được hai máy cùng lấy.** `KHOÁ:` và `NHẢ:` là bình luận. Hai máy đăng cách nhau vài giây
   đều có thể tưởng mình giữ khoá. Khoá quá hạn không tự nhả.
5. **Không có trạng thái có cấu trúc.** Ai giữ gì phải suy từ chuỗi tin. Sửa bình luận không tạo sự kiện. Không có
   luồng con.
6. **Chi phí đọc tăng theo độ dài luồng.** Đọc trọn #375 tốn ≈ 20 nghìn token mỗi lần, ba máy đọc 30′ một lần.
   Đây là chỗ sẽ vỡ đầu tiên, trước mọi giới hạn cứng của GitHub (65 536 ký tự mỗi bình luận, giới hạn tạo nội dung
   cỡ 80 lượt/phút và 500 lượt/giờ).
7. **Công khai và riêng tư bị tách đôi.** #308 ở kho PUBLIC nên chỉ ghi tên máy, PR, sha, giờ. Lỗi kit lộ ở crm
   phải báo ở #375.
8. **GitHub chết thì cả kênh im**, không có đường dự phòng.

## Nghiệm đã nghĩ (chưa làm)

Một **kho git private riêng làm hộp thư**, mỗi máy có một **bộ trực chạy nền (launchd, không phải LLM)**. Bộ trực ghi
tin mới vào hộp thư cục bộ, và Monitor mà phiên điều phối đã giăng sẽ đánh thức phiên.

```
Máy A: phiên điều phối ──kenh gui──▶ commit + push ──▶ kho git «kenh»
Máy B: bộ trực (ls-remote 20–30 s) ─▶ lọc tin gửi B ─▶ một dòng vào hộp thư cục bộ
          ─▶ Monitor (tail -F | grep) ─▶ phiên điều phối B thức ─▶ kenh doc ─▶ biên nhận «đã đọc»
```

- **Đường truyền:** mỗi tin một tệp `tin/<giờ UTC>-<máy>-<n>.json`, nên ba máy cùng gửi không xung đột nội dung.
  Lịch sử có sẵn. Mất mạng vẫn ghi được, có mạng thì đẩy sau.
- **Đánh thức:** dùng lại khuôn `tail -n0 -F … | grep --line-buffered '"can_phan":true'` của
  `dieu-phoi/commands/mo-dot.md` bước 6, cùng lịch 30′ gia hạn Monitor. Không thêm công cụ app nào.
- **Danh tính:** bộ trực điền tên máy và phiên từ cấu hình của máy, model không gõ (dòng tự xưng của hạ tầng).
  Máy nhận xác minh bằng `git verify-commit` với tệp `allowed_signers` chứa khoá SSH của từng máy.
- **Biên nhận ba trạng thái:** *đã gửi* → *đã đến máy* (bộ trực ghi) → *đã đọc* (phiên gọi `kenh doc`).
- **Khoá:** nhánh `khoa/<tên>`, lấy bằng `push --force-with-lease` với điều kiện nhánh đang trống. Máy chủ đối chiếu
  sha cũ ngay trong giao thức git, nên chỉ một máy thắng. Nhả bằng xoá nhánh với điều kiện nhánh vẫn là sha của
  mình. Khoá quá hạn thì báo owner, không tự phá (giữ luật #308).
- **CLI `kenh`:** `gui` · `doc` (chỉ tin chưa đọc gửi máy mình) · `khoa` / `nha` · `xem` (toàn cảnh cho owner) ·
  `kiem` (thử trọn vòng gửi, khoá, nhả lúc cài).
- **Khuôn tin, mượn tên từ A2A 1.0 ở tầng dữ liệu:** `messageId` (loại tin trùng) · `contextId` (gom một mạch) ·
  `tu` · `toi[]` · `loai` · `tra_loi_cho` · `ref` · danh sách *parts* (chữ, dữ liệu, con trỏ tệp). Thân ≤ khoảng
  1 500 ký tự, dài hơn thì trỏ tệp hoặc PR. Ánh xạ: `yeu-cau` → Task (SUBMITTED → WORKING → COMPLETED / FAILED /
  CANCELED / REJECTED) · `hoi` → INPUT_REQUIRED · `tra-loi` → cập nhật trạng thái hoặc artifact · `bao` → Message
  đứng riêng.
- **Nơi ở:** gói `dieu-phoi`, vì kênh dùng lại hộp thư và Monitor của gói. Không thuộc engine nghiệm thu.

Số dự kiến so với hôm nay: độ trễ ≤ 30 giây cộng thời gian phiên nhận chạy xong lượt đang dở (thay vì tới lần đọc
30′ kế tiếp) · vài trăm token mỗi tin gửi mình (thay vì ≈ 20 nghìn mỗi lần đọc trọn #375) · ≈ 360 lần `ls-remote`
mỗi giờ cho cả ba máy.

### Không phụ thuộc GitHub

Thiết kế chỉ dùng thao tác git thuần (`push`, `ls-remote`, `fetch`, cập nhật ref có điều kiện), nên chạy được trên
GitLab nội bộ hay một kho git trần qua SSH. Kho kênh không cần nằm cùng chỗ với kho sản phẩm. Đo 13/10: script của
`dieu-phoi/` không gọi `gh` lần nào, nên kênh không được là thứ đầu tiên kéo một nền tảng vào gói. Năm điểm phải giữ:

1. Khoá dùng **nhánh** `khoa/*`, không dùng ref riêng `refs/khoa/*`. Không chắc mọi GitLab tự cài nhận ref ngoài
   `heads/` và `tags/`. Kho kênh không đặt luật bảo vệ nhánh theo mẫu, kẻo chặn xoá `khoa/*`.
2. Bộ trực sinh commit theo khuôn cố định, chịu được luật đẩy và hook nội bộ (bắt ký, khuôn thông điệp, tên tệp).
   `kenh kiem` làm lộ chỗ vấp ngay hôm cài.
3. Mạng là ca hỏng chính (VPN). Bộ trực báo khi không tới được máy chủ quá N phút, kèm thông báo macOS.
4. Xác thực bằng khoá SSH hoặc deploy key có quyền ghi kho kênh, không dùng token có hạn. Dòng báo sức khoẻ ở điểm 3
   bắt luôn ca khoá hết hiệu lực.
5. Trường `ref` ghi sha, tên nhánh hoặc URL đầy đủ, không ghi số trần (GitHub `#123`, GitLab `!123`).

### Vì sao không dùng thứ đã có

- **`SendMessage` qua Remote Control:** ngày 13/10 `ListAgents` thấy phiên của máy khác ở trạng thái `offline`.
  Đường này chỉ sống khi Remote Control bật, chỉ trong cùng một tài khoản (owner có đổi tài khoản), không lưu tin và
  không có khoá.
- **A2A làm đường truyền:** mỗi bên phải mở cổng chờ kết nối vào (NAT, tường lửa, TLS), trong khi máy Mac ngủ và đổi
  mạng. Spec 1.0 tự nhận gửi tin không tin cậy cho thông tin quan trọng, giữ lịch sử là tuỳ bên chủ, không có khoá,
  gửi điểm–điểm, và không giải quyết việc đánh thức phiên Claude. A2A sinh ra cho tác tử khác hãng, khác tổ chức,
  chạy như dịch vụ luôn bật.

## Không sửa, cố ý giữ

- **Quyết định người không đi qua kênh.** Không có loại tin «duyệt». Cổng vẫn gõ trong phiên vòng (ADR 0002).
  *Đo 13/10: giả định này bị thực tế vượt.* Ba quyết định của owner đi qua #375 bằng lời máy CHUYỂN LẠI trong một
  ngày (crm đợi 2.29.1 · giao mốc OneFlow 27/10 · cửa sổ gộp `onehub`). Chưa ca nào sai, vì máy chuyển luôn ghi
  «nói ở phiên <tên>». Đây không phải cổng (không gõ thay lệnh cổng), nhưng là chỗ danh tính tự khai đáng giá nhất
  của kênh — một tin chuyển sai sẽ được hai máy kia làm theo.
- **Sổ ai giữ hàng nào vẫn là `docs/plan/lo-trinh-*.json`** trong kho sản phẩm. Kênh chỉ dùng để báo.
- Phiên điều phối của máy nhận không chạy thì tin chờ. App không cho tin chen vào giữa một lượt.

## Số đo 13/10 (Điều phối M5, `gh api …/comments`)

| | crm #375 | kit #308 |
|---|---|---|
| Tổng tới 13:20Z | 112 bình luận · ≈ 106 nghìn ký tự | 83 · ≈ 29 nghìn |
| Riêng 13/10 (≈ 13 giờ) | 67 · ≈ 44 nghìn | 25 · ≈ 9 nghìn |

| Ca | Trễ | Thiệt hại đường găng |
|---|---|---|
| Bộ canh còn sống (10:00→10:01Z · 12:18→12:19Z · 12:32→12:33Z) | ≈ 1′ | 0 |
| Bộ canh Mac Studio câm «từ sáng»: M5 `yeu-cau` 09:35Z → trả 11:29Z | 114′ | ≈ 0 (DA1b còn xếp hàng làn nặng) |
| Bộ canh MacBook Pro câm từ 12/10 (`gh --jq` không nhận `--arg`): M5 hỏi luật 5 08:56Z → trả 11:30Z | 154′ | ≈ 0 |
| Khoá #308 cho #341 quên nhả (CI xanh 11:19Z, nhả 12:33Z sau một lời nhắc) | 74′ treo | ≈ 1′ (#342 vừa sẵn) |
| Gộp chen trên kit `main` khi khoá đang giữ | — | 0 ca |

Đọc lại theo từng lợi ích của thiết kế: *đánh thức ≤ 30 s* — bộ canh 60 s đã cho ≈ 1′, chỗ hỏng là bộ canh CÂM chứ
không phải chậm · *token* — các phiên đã đọc tăng dần theo `since` và chỉ dòng đầu, đọc trọn chỉ khi cố ý · *khoá
nguyên tử* — 0 ca tranh; ca thật là khoá bị QUÊN, mà nhánh `khoa/<tên>` cũng quên được y vậy · *danh tính* — xem mục
«Không sửa, cố ý giữ» · *thoát GitHub* — chưa có ca. Hai luật rẻ đã đóng phần lớn lớp lỗi trong ngày: cửa sổ gộp
`onehub` (owner chốt 13/10) xoá «giữ onehub» và ca gộp sai thứ tự kiểu crm #386; đọc tăng dần cắt token.

## Bước nhỏ trước (đề xuất, CỘNG — ra Cổng Đáng sau mốc 2.29.1)

Lớp lỗi còn hở là **bộ canh câm không ai biết** — đúng lớp «xanh chưa từng đỏ»: im lặng của bộ canh hỏng trông y như
«không có tin». Nghiệm máy-giữ, không dặn bằng lời, gói trong MỘT script canh kênh dùng chung (vài chục dòng):

1. **Chiều đỏ lúc giăng:** bộ canh tự đọc lại tin cuối đã biết của kênh; không thấy thì in lỗi và thoát khác 0, không
   im. Lỗi `--arg` của MacBook Pro sẽ đỏ ở phút đầu thay vì câm một ngày.
2. **Yêu cầu quá hạn phía người gửi:** `yeu-cau`/`hoi` không có tin nào của máy được gọi tên sau 30′ → phiên gửi tự
   thấy, nhắc một lần, rồi báo owner.
3. **Khoá có hạn tự khai:** dòng `KHOÁ:` ghi giờ dự kiến nhả; quá hạn thì máy kia nhắc (vẫn KHÔNG tự phá khoá).

Người hưởng: phiên điều phối của cả ba máy và owner (bớt ca phải hỏi «máy kia có nghe không»). Trace: nguyên tố 2.

## Ngưỡng mở thành ô (đếm THIỆT HẠI, sửa 13/10)

Bản đầy đủ (kho git làm hộp thư) mở khi bất kỳ một trong ba, đo trên #308, #375 hay kênh thay thế:

- ≥ 1 lần gộp chen nhau trên kit `main` khi khoá #308 đang có người giữ (giữ nguyên — cũng là ngưỡng răng #308).
- ≥ 1 ca kênh câm, tin cũ hay yêu cầu quá hạn **làm chậm đường găng ≥ 30′ hoặc thêm một lượt gọi người** — *sau khi*
  bước nhỏ ở trên đã gộp (trước đó ca kiểu này mở bước nhỏ, không mở bản đầy đủ).
- ≥ 1 quyết định owner bị máy chuyển SAI qua kênh và có máy làm theo.

Ngưỡng cũ «≥ 1 lần tin tới mà không ai đọc» đã bỏ: 13/10 nó chạm hai lần với thiệt hại ≈ 0. Trước ngưỡng, việc rẻ vẫn
là: đóng issue theo mốc rồi mở issue mới trỏ về issue cũ, và mỗi phiên chỉ đọc bình luận có `createdAt` sau lần đọc
trước.

**Ngưỡng riêng cho bộ chuyển A2A** (phơi sổ git ra một điểm cuối A2A): ≥ 1 kho tiêu thụ cần phiên điều phối trao đổi
với tác tử ngoài các máy của chủ kho. Chưa có ca thì A2A chỉ dừng ở tên trường.

Nguồn ngoài: [A2A Protocol Specification 1.0.0](https://a2a-protocol.org/latest/specification/).
