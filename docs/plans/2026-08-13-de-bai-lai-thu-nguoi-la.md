# ĐỀ BÀI — Phiên lái-thử người-lạ (tiền trạm Cổng Giá trị)

*2026-08-13 · Nguồn: hội thoại owner ↔ phiên phân tích cùng ngày. Owner đã gật
chủ trương («Đồng ý») và yêu cầu làm giàu hai thứ: (1) hạng mục nào lái thử
được, (2) giới hạn thật giữa Claude và một người, để tiệm cận Kiểm thử và
Dùng thử ở người thật. Trạng thái: **đề bài pilot, docs-only** — KHÔNG phải
cơ chế engine mới (bản neo 12/08 §M5 chỉ cho phép đúng một cơ chế mới là V);
đường đảo = revert 1 commit.*

---

## 0 · Ý ĐỊNH VÀ RANH GIỚI

Quá khứ owner đã hiệu quả với nếp: tạo môi trường cho Claude tự lái E2E trên
UI, chụp màn hình cẩn thận, phân tích — sửa được rất nhiều lỗi. Đề bài này
biến nếp đó thành **nghi thức lặp lại được**, đặt đúng chỗ trong hệ:

- **Nó LÀ:** phiên Claude Code **fresh hoàn toàn** đóng vai người-không-ngữ-cảnh,
  lái sản phẩm thật, giao lại **nhật-ký-vấp + frames**. Chạy TRƯỚC phiên
  nghiệm thu người thật (`uat-session` §0 đòi "sản phẩm bấm được" — hiện là
  giả định không ai kiểm; phiên này biến giả định thành bằng chứng), hoặc
  chạy rời sau một đợt đổi UI lớn.
- **Nó KHÔNG LÀ:** UAT. Máy không điền verdict, không chấm "đáng", không thay
  chấm kín của người — lõi chữ-ký-người giữ nguyên. Mọi câu hỏi giá-trị mà
  phiên gặp phải được GHI thành câu hỏi chuyển cho phiên người, không tự trả lời.

Trace về bản neo: nguyên tố 2 (bằng chứng không tự dối — kế thừa rails ảnh +
network) và nguyên tố 3 (máy đi trước, người về biên). Người hưởng: owner khỏi
cháy phiên người thật vì build vấp; Claude có lưới bắt lỗi *giữa các tiêu chí*
mà eval theo-kịch-bản không phủ.

---

## 1 · BẢN ĐỒ HẠNG MỤC (morphological scan)

### Ngữ cảnh
- Chân sản phẩm `[SP]`: rails sẵn có của kit — ui-check (frame-per-transition,
  `observed:`, network truth), design gate (sàn a11y), luật cross-layer,
  câu-ràng-buộc của uat-session.
- Chân ngành `[NGÀNH]`: Nielsen Norman Group 10 usability heuristics · Steve
  Krug (*Don't Make Me Think*, *Rocket Surgery Made Easy*) · WCAG 2.x · thực
  hành E2E Playwright/Cypress · nghiên cứu "5 users tìm ~85% vấn đề" (NN/g) ·
  lớp công cụ panel-người (UserTesting, Maze) làm mốc cho phần máy KHÔNG thay được.

### Trục
- **Trục A — câu hỏi phép thử trả lời:** Chạy-được | Chịu-được | Hiểu-được |
  Đáng-giá. *[thước CE: 4 executor của kit + phân tầng mechanics/value của NN/g]*
- **Trục B — năng lực người mà phép thử phải mượn:** Tri-giác (thấy gì) |
  Ngữ-cảnh (biết gì trước) | Kiên-nhẫn (bỏ cuộc khi nào) | Động-cơ (được mất
  gì thật). *Trục này SINH ra ranh giới máy/người ở §2.*
- **Trục C — chặng hành trình:** Đến-lần-đầu | Làm-việc-chính | Quay-lại |
  Gặp-sự-cố. *[thước CE: preset test-matrix + journey map]*

### Hạng mục, chấm theo ba mức

**MÁY-MẠNH — Claude làm được ≥ một người, rẻ hơn (lớp "Kiểm thử"):**

| # | Hạng mục | Ghi chú / nguồn |
|---|---|---|
| 1 | Flow chính đầu-cuối theo contract, kèm sự thật đường dây (console + network) mọi bước | `[SP]` rail network-truth sẵn |
| 2 | First-run trắng: profile sạch, không cookie/localStorage — phiên fresh là mô phỏng HOÀN HẢO trạng thái này | điểm mạnh độc nhất của "fresh" |
| 3 | Round-trip dữ liệu: tạo→reload→còn · sửa→đổi · xoá→mất | `[SP]` luật cross-layer |
| 4 | Đường lỗi có lối ra: 404, dead link, trang lỗi có nút quay về | `[NGÀNH: Nielsen #9]` |
| 5 | Trạng thái dữ liệu: rỗng · 1 bản ghi · điển hình · biên (tiếng Việt có dấu, chuỗi dài, unicode) · khối lớn | `[NGÀNH: preset test-matrix]` |
| 6 | Ngõ vào hỏng: validation, input rác, double-submit, click nhanh (idempotency) | `[NGÀNH]` |
| 7 | Back/refresh giữa flow, deep-link vào giữa chừng | `[NGÀNH: Nielsen #3]` |
| 8 | Đa khung nhìn: mobile/tablet/desktop, vỡ layout, tràn ngang | `[NGÀNH: WCAG reflow]` |
| 9 | Sàn a11y: keyboard-only đi trọn flow, focus thấy được, contrast | `[SP]` design gate đã có nửa này |
| 10 | Rác copy: lorem ipsum, chuỗi chưa dịch, placeholder sót, chữ tràn cắt | `[NGÀNH]` |
| 11 | Nhất quán từ vựng/hành vi: cùng nút cùng nghĩa ở mọi trang | `[NGÀNH: Nielsen #4]` |

**MÁY-XẤP-XỈ — làm được NẾU có kỷ luật mượn (§2), đây là mép "Dùng thử":**

| # | Hạng mục | Kỷ luật mượn bắt buộc |
|---|---|---|
| 12 | Tìm-đường: "muốn làm X thì bấm đâu?" | lái pixel-only (cấm DOM) + VLM khác họ hỏi câu ĐÓNG trên frame `[NGÀNH: Krug]` |
| 13 | Bỏ-cuộc: người thật rời đi ở đâu | ngân-sách bước/phút mỗi mục tiêu; vượt → ghi «BỎ CUỘC TẠI ĐÂY» rồi mới được phá rào `[NGÀNH: NN/g time-on-task]` |
| 14 | Gánh-đọc: tường chữ trước hành động đầu tiên | máy đếm được, ngưỡng chịu là của người — chỉ ghi số, không phán |
| 15 | Cảm nhận độ trễ | máy đo ms chuẩn hơn người; chỉ so với budget đã khai, không tự đặt ngưỡng |
| 16 | Persona đa dạng: người-vội / người-cẩn-thận / người-không-rành | chấp nhận là biếm hoạ; giảm nhưng KHÔNG xoá lỗi tương quan cùng-model |

**NGƯỜI-GIỮ — không tiệm cận được, by design (ở lại Cổng Giá trị):**

| # | Hạng mục | Vì sao máy không mượn được |
|---|---|---|
| 17 | Đáng-giá: dùng lại · trả tiền · giới thiệu | cần động-cơ thật — máy không có gì để mất `[SP]` ngưỡng opportunity.md |
| 18 | Câu ràng buộc «gửi cho khách nào, khi nào» | cam kết chỉ có nghĩa từ người có khách thật `[SP]` uat-session §3 |
| 19 | Cảm xúc tích luỹ: thất vọng dồn, thích thú | stakes, không phải tri giác |
| 20 | Khớp-đời-thật: workflow thật, dữ liệu thật, thiết bị thật, gián đoạn thật | môi trường sống không mô phỏng được |
| 21 | Phương sai quần thể: 5 người thật ≠ 5 lần chạy model | lỗi của model TƯƠNG QUAN với chính nó `[NGÀNH: NN/g 5-users]` |

### Cắt Pareto cho pilot ván 1 (Core ≤ ~20%)

- **Core:** #1 (+#4 gộp cùng lượt lái) · #2 · #3 · #5 (rỗng + biên tiếng Việt)
  · #12+#13 (MỘT lượt lái pixel-only có ngân-sách — đây là phần MỚI so với S4).
- **Later:** #6, #7, #8, #9-phần-keyboard, #10, #11, #14, #15, #16, VLM cho
  #12, mạng chậm/offline, concurrent 2 tab.
- **Never (cho loại phiên này):** #17–#21 — thuộc phiên người; máy chỉ được
  GHI câu hỏi chuyển tiếp. Lý do 1 dòng: đây chính là ranh giới chữ-ký-người.

---

## 2 · GIỚI HẠN THẬT — Claude vs một người

Bốn năng lực người mà phép thử phải mượn (trục B) cho ra định lý giới hạn:

| Năng lực | Claude mượn được? | Cách mượn |
|---|---|---|
| **Ngữ-cảnh trắng** (không biết gì trước) | ✅ HOÀN HẢO | chính là "phiên fresh" — người build không giả vờ quên được, phiên mới thì quên thật |
| **Tri-giác** (chỉ thấy màn hình) | ⚠️ phải TỰ TRÓI | mặc định Claude đọc DOM = nhìn xuyên tường; chế độ người-lạ phải lái bằng pixel/screenshot, DOM chỉ dùng sau khi đã ghi vấp |
| **Kiên-nhẫn hữu hạn** (bỏ cuộc) | ⚠️ phải GIẢ LẬP | máy kiên nhẫn vô hạn → ngân-sách bước/phút viết trước; vượt ngân sách = "người thật đã rời đi ở đây" |
| **Động-cơ / stakes** (được mất thật) | ❌ KHÔNG | máy đóng kịch mục tiêu, không trả giá — nên mọi phán "đáng/không đáng" của máy là diễn |

Cộng thêm giới hạn quần thể: một phiên Claude ≈ **một người dùng rất lạ**, và
N lần chạy vẫn tương quan với nhau (cùng model, cùng thiên vị "looks done" —
nhất là khi soi sản phẩm do chính họ-hàng nó build). Thuốc sẵn trong kit: câu
hỏi ĐÓNG cho VLM khác họ trên frame đã lưu.

**Phát biểu gọn:** máy tiệm cận **Kiểm thử** gần trọn vẹn (hạng 1–11), chạm
**mép Dùng thử** qua đúng hai proxy có kỷ luật (tìm-đường #12, bỏ-cuộc #13),
và **không tiệm cận Đáng-giá** — không phải vì công nghệ chưa tới, mà vì câu
hỏi đó định nghĩa bằng stakes của người. Ranh này là ranh thiết kế, không
phải ranh tạm.

### Bậc thang tiệm cận (chạy từ rẻ đến đắt, dừng được ở mọi bậc)

1. **Bậc 1 — quét chạy-được** (DOM cho phép): Core #1–#5. Bắt: hỏng, gãy, mất dữ liệu.
2. **Bậc 2 — lượt lái người-lạ** (pixel-only + ngân sách bỏ-cuộc): #12–#13. Bắt: lạc, mù đường, ma sát.
3. **Bậc 3 — khử tương quan**: VLM khác họ câu đóng trên frames của bậc 2. Bắt: "máy tin nhầm chính nó".
4. **Bậc 4 — bàn giao**: nhật-ký-vấp + frames vào phiên `uat-session`; người thật chỉ còn tiêu phút của họ vào việc duy nhất của người: phán giá trị.

---

## 3 · NGHI THỨC PHIÊN (cho phiên thi hành tương lai — tự đủ ngữ cảnh)

**Điều kiện vào:** sản phẩm chạy được ở một URL (dev/staging/flag); feature có
`_acceptance/<slug>/contract.md`. Không đòi signed-off — phiên này chạy được
cả trước S4 (săn lỗi) lẫn trước uat-session (tiền trạm).

**Chuẩn bị (phiên cũ / người điều phối làm, KHÔNG phải phiên lái):**
1. Viết `_acceptance/<slug>/stranger-drive.md` từ khuôn §4: danh sách **mục
   tiêu người dùng** chép từ contract nhưng viết lại thành tiếng sản phẩm
   ("đặt được một đơn hàng", KHÔNG phải "bấm nút #checkout") — không lộ đường
   đi, không lộ tên component.
2. Khai ngân sách mỗi mục tiêu (mặc định: 12 bước hoặc 5 phút, tuỳ cái đến trước).
3. Mở phiên Claude Code **MỚI HOÀN TOÀN**, cấp đúng: URL + file stranger-drive.md.
   Không cấp code, không cấp contract gốc, không cấp evals.

**Phiên lái làm, theo thứ tự bậc thang:**
- Bậc 1 rồi bậc 2 theo Core §1. Mỗi bước chuyển trạng thái chụp frame vào
  `_acceptance/<slug>/evidence/SD-<mục tiêu>-step<n>.png`; nhìn lại từng frame
  đã lưu và ghi `observed:` (luật ảnh-lưu-phải-nhìn); cuối mỗi mục tiêu dump
  network/console lỗi (luật network-truth, từ vựng chữ không số).
- Chế độ người-lạ (bậc 2): CẤM đọc DOM/read_page cho tới khi (a) mục tiêu
  xong, hoặc (b) ngân sách cạn và đã ghi «BỎ CUỘC TẠI ĐÂY». Phá rào DOM sau đó
  phải ghi rõ trong nhật ký.
- Gặp câu hỏi giá-trị ("cái này có đáng không?") → ghi vào mục «Chuyển phiên
  người», đi tiếp. Không tự trả lời.

**Luật dừng:** hết mục tiêu, hoặc 3 vấp CHẶN (build không đáng lái tiếp —
trả sớm rẻ hơn lái cố).

## 4 · KHUÔN NHẬT-KÝ-VẤP (`stranger-drive.md`)

```markdown
# Lái-thử người-lạ — <slug>
ngày: · phiên: fresh · url: · ngân sách/mục tiêu: 12 bước hoặc 5 phút

## Mục tiêu (tiếng sản phẩm, không lộ đường đi)
1. <mục tiêu 1>
2. …

## Nhật ký vấp (append theo thời gian)
- [CHẶN|LẠC|KHÓ-CHỊU|VẶT] mục tiêu <n>, bước <k> — thấy: <observed + frame> ·
  chờ: <điều một người lạ chờ> · phá-rào-DOM: có/không
  (CHẶN = không đi tiếp được · LẠC = quá ngân sách mới tìm ra/bỏ cuộc ·
   KHÓ-CHỊU = đi được nhưng ma sát rõ · VẶT = copy/polish)

## Đường dây (mỗi mục tiêu một dòng, từ vựng network-truth)
- mục tiêu <n>: clean | no-app-traffic | third-party-only | app-fail | …

## Chuyển phiên người (câu hỏi giá-trị máy không được trả lời)
- …

## Kết phiên (máy tường thuật, KHÔNG verdict)
- đi trọn: x/y mục tiêu · CHẶN: n · LẠC: n · KHÓ-CHỊU: n · VẶT: n
```

## 5 · THƯỚC ĐO CỦA CHÍNH PILOT (đo trước khi nghĩ đến codify)

Chạy trên 1–2 feature thật kế tiếp (khớp đợt 3 bản neo). Sau mỗi ván đếm MỘT
con số: **số vấp CHẶN/LẠC mà 4 suite S4 xanh không bắt được.**

- ≥1 CHẶN hoặc ≥2 LẠC sau 2 ván → failure mode có tỉ lệ đo được (đúng câu
  North Star đòi) → lúc đó mới bàn codify thành skill/reference.
- 0 sau 2 ván → nghi thức không trả tiền cho chi phí của nó → chuyển file này
  vào `.out-of-scope/` kèm số liệu, đóng có hồ sơ.

**Cấm leo thang trước số liệu:** không viết skill, không sửa engine, không
thêm cổng, không đòi chạy mọi feature — chừng nào thước trên chưa nói.
