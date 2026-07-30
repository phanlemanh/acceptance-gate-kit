---
slug: gate-card-ac-visibility
at: 2026-07-30T00:00:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Provenance — ĐỌC TRƯỚC

Phản biện này **KHÔNG chạy trong context sạch**. Phiên có chỉ thị không dispatch
subagent, nên người viết contract và người phản biện là MỘT. Đó là điểm yếu thật
của hồ sơ này, không phải chi tiết thủ tục: tự phản biện bỏ sót đúng những giả
định mà mình không biết là mình đang giữ. Bốn finding dưới đây là những chỗ tôi
tự bắt được — hãy đọc chúng như *sàn dưới*, không phải trần trên. Nếu Manh muốn
sàn cao hơn thì cho chạy lại bước này bằng agent context sạch trước khi duyệt.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|-----|----------|----------|---------------|----------|-------|
| P0 | contract | AC-5 bản đầu ràng "Given contract **có section `## Criteria`**" — nhưng ca heading lệch (`## Acceptance criteria`) làm `section()` trả rỗng, tức KHÔNG CÓ section để quét | Đúng ca đã sinh ra feature này (`w0-media-assets`, `cross-feature-claim-index`) vẫn CÂM sau khi vá. Cảnh báo được xây xong mà không bao giờ nổ trên ca thật đầu tiên | Phạm vi quét là CẢ FILE, không riêng section; case P62(b) dựng fixture heading lệch → phải kêu | fixed: viết lại AC-5 (quét cả file + nêu heading đã tìm); tách P62 thành 2 ca kích hoạt |
| P0 | contract | Chỉ có luật cho ca RỖNG (n=0). Ca CỤT (n≥1 mà thiếu) không AC nào phủ | Chính ca đã lọt qua chữ ký thật: `radar-d3-crawl-cron` card ra `[AC-1, AC-8]` trên tổng 8, trông bình thường nên không ai nghi. Vá regex hôm nay cứu ca đó, nhưng biến thể khuôn NGÀY MAI lại tạo ca cụt mới và lại câm | AC mới + case P64: 8 dòng nghi vấn, parser bóc 2 → card nêu thiếu 6 và liệt số dòng; đối chứng m=n → không cảnh báo | fixed: thêm AC-11 + eval E13 |
| P1 | evals | P59/P60 chạy trên `_acceptance/` của chính kit, mà corpus đó chỉ dùng **2/5 khuôn** (đo: 88 dòng `- AC-n:` + 13 dòng `- **AC-n**`) | Eval xanh rực mà chưa từng chạm 3 khuôn đã gây ra lỗi. Bao-tập trên tập gần-như-toàn-khuôn-chuẩn là phép đo rỗng nghĩa — đúng lớp "thước xanh vì không đo gì" | Corpus fixture trong repo, mỗi dòng ghim sẵn id/gwt/judgment mong đợi; hợp với `_acceptance/` chứ không thay | fixed: AC-1 viết lại quanh corpus ghim; P58/P59/P60 đều trỏ corpus |
| P1 | evals | P61 (AC-4) đo "một nguồn sự thật" bằng **grep đếm số regex** — assertion vắng-mặt-một-mình, đúng lớp CLAUDE.md #4 cấm | Viết lại khuôn bằng cú pháp khác (hoặc tách thành 2 hằng) → grep vẫn xanh trong khi hai lối gọi đã trôi khỏi nhau, tức đúng điều kiện đã sinh ra lớp lỗi này | Đo HÀNH VI: cho cả hai lối gọi (card Cổng 1 và `critText` Cổng 2) bóc cùng corpus → phải trả cùng tập; đối chứng dương: một lối dùng khuôn hẹp hơn → ĐỎ | **fixed ở VÒNG VERIFY 2, không phải ở Cổng 1.** Bản Cổng 1 ghi "fixed" là SAI: AC-4 được viết lại nhưng P61 thì không — nó vẫn grep đếm regex rồi gọi cùng một hàm hai lần so với chính nó. Verify vòng 1 (context sạch) bác bằng đột biến: tách đôi hai lối gọi THẬT mà P61 vẫn PASS. Vòng 2 viết lại P61 chạy hai lối gọi qua CLI trên cùng contract fixture, kèm đột biến làm lệch thật ⇒ case phải ĐỎ |

| P1 | contract | Cờ judgment bắt chuỗi `(judgment)` ở BẤT KỲ đâu trong dòng, kể cả khi criterion đang TRÍCH DẪN cái dấu trong code span | Bắt được bằng dogfood: render chính contract này ra card → AC-1 và AC-3 biến mất khỏi khối will/wont vì thân chúng trích dẫn dấu. Hệ quả trên T3: hai criterion máy-kiểm-được bị đẩy thành human-only, Manh phải tự phán ở Cổng 2 những thứ eval đã chứng minh. Không phải hồi quy của bản vá — parser CŨ cũng vậy — nhưng AC-3 sở hữu ngữ nghĩa cờ này nên nó thuộc phạm vi | Dấu nằm hoàn toàn trong code span → không tính; cùng luật `lib/context-glossary.js` dùng cho W6. Đo bán kính: 178 contract, 157 dòng mang dấu, 4 dòng dấu-chỉ-trong-backtick — 2 là AC-1/AC-3 (đổi đúng chiều), 2 còn lại giữ judgment qua nhãn | fixed: thêm vế code-span vào AC-3 + E3, kèm phủ hồi quy 2 dòng repo tiêu thụ |

## Hậu kiểm sau verify vòng 1 — phản biện tự-làm này đã bỏ sót gì

Đúng như dòng Provenance cảnh báo, đây là *sàn dưới*. Context sạch ở vòng verify 1
bắt thêm những thứ tôi tự soi không thấy:

- **Tôi đánh dấu `fixed` cho một finding chưa sửa** (P1 số 4 ở trên). Tôi sửa AC-4
  rồi coi như xong, không quay lại kiểm P61 có làm theo AC mới không. Đây chính là
  hình dạng lỗi mà feature này tồn tại để bắt — *trông bình thường nên không ai soi*
  — xảy ra ngay trong hồ sơ của chính nó.
- **Bốn lệch phủ** tôi không tự thấy: AC-2 khai "cả hai repo" mà eval chỉ quét một;
  AC-3 thiếu 2 dòng repo tiêu thụ nó nêu đích danh; AC-11 chỉ có tầng đơn vị dù AC
  viết "When render card Cổng 1"; đối chứng dương của E2 chỉ là chữ trong `expected`.
- **Phép đo của P59 không đọc corpus** (dòng corpus mang tiền tố `INPUT `) — lộ ra
  khi vòng 2 script-hoá đối chứng dương. Con số "+13" trước đó chỉ đến từ
  `_acceptance/`; corpus đóng góp 0 dù nó là lý do corpus tồn tại.

Bài học ghi lại: một finding tự-đóng-sổ cần bằng chứng máy như mọi thứ khác. Cột
"Xử lý" ghi `fixed` mà không có case đỏ-được kèm theo thì không khác gì lời hứa.

## Đã cân nhắc và LOẠI (không đủ kịch bản fail Gate)

- **AC-8 (P53 byte-đối-byte) có thể đỏ vì AC-5 thêm dòng cảnh báo vào card.** Fixture `s4-scope-triage` không phải ca rỗng-criterion nên cảnh báo không nổ trên nó. Nếu vẫn đỏ khi implement thì đó là tín hiệu đúng (cảnh báo đang nổ sai chỗ), không phải nhiễu.
- **`gwt` giờ nuốt cả nhãn có thể làm dài dòng trên card.** Đã có AC-9 (judgment) canh; không cần eval máy.
- **Corpus fixture sẽ trôi khỏi contract thật theo thời gian.** Thật, nhưng cái giá của việc không có corpus (đo rỗng nghĩa) lớn hơn. Ghi nhận là known-limit ở Cổng 2 nếu Manh muốn.

## Không lật quyết định nào đã ghi ledger

Slug này chưa có `decisions.jsonl`. Bốn finding trên đều là bổ sung, không đảo ngược lựa chọn nào đã chốt trước đó.
