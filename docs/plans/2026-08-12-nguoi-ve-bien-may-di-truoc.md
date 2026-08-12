# KẾ HOẠCH — Người về biên, máy đi trước

*2026-08-12 · Soạn: Phiên B (cố vấn) từ đối thoại First-Principles owner ↔ Phiên A
cùng ngày + trang audit ~60 điểm-gọi-người / ~70 bộ phận máy do B thực hiện.
Trạng thái: **owner duyệt 12/08** (nguyên văn: «neo chuẩn, viết đề bài»). Đây là
BẢN NEO: mọi PR của đợt này phải trỏ về file này; mọi lệch khỏi nó ghi vào
«Nhật ký lệch» cuối file. Đề bài thi hành:
[đợt 1](2026-08-12-de-bai-dot1-cat-va-luu-kho.md) ·
[đợt 2](2026-08-12-de-bai-dot2-nguoi-ve-bien.md).*

---

## 0 · Ý ĐỊNH (lời owner, chốt 12/08 — nguồn gốc mọi thứ bên dưới)

Ý tưởng khai sinh kit là **Loop Engineering**: tự động hoá quá trình, vòng tự
hoàn thành, dùng chính kit kiểm soát chất lượng — nay tiến đến **Graph
Engineering** (điều phối nhiều agent thành đồ thị). Kit ra đời trên giả định cũ
«an toàn = người soát tại cổng»; giả định đó đã bị owner lật (09/08: enablement,
không phải surveillance) nhưng cơ chế chưa được suy lại từ đầu — quá tải của
owner là tiếng cọt kẹt của chỗ vênh đó. Kế hoạch này là lần suy-lại-một-lần,
KHÔNG phải thêm một bản vá.

### North Star (phát biểu lại, owner duyệt 12/08)

> Kit tồn tại vì một điều duy nhất: **sản phẩm đến tay người dùng nhanh hơn mà
> vẫn tin được.** Nó làm điều đó bằng cách chia lại đúng việc: **máy làm và tự
> chứng minh** (bằng chứng không tự dối — màu xanh phải từng chạy chiều đỏ),
> **người chỉ ra quyết định** — tại ít khoảnh khắc thật, trên bằng chứng đọc
> được trong một phút, với đường đảo rẻ cho mọi thứ còn lại.
>
> Kit hướng tới **vòng tự chạy — tự hoàn thành — tự kiểm bằng chính kit**;
> người đứng ở **biên** của vòng, không đứng giữa: quyết ở nơi có đánh-đổi thật
> hoặc khó-đảo, veto được mọi thứ còn lại mà không làm vòng phải dừng chờ.
>
> Thước đo của kit: **thời gian từ làm-xong đến quyết-được** và **số lần phải
> gọi người trên mỗi kết quả ship**. Giờ-kit là chi phí. Cổng mà câu trả lời
> hợp lý duy nhất là «ừ» là trạm thu phí, không phải điểm quyết định.

### Ba nguyên tố (hiến pháp trace — A chưng cất, B phản biện, owner duyệt 12/08)

1. **Ý định chốt trước khi làm.** Chỉ owner biết «tốt» nghĩa là gì; chốt sau
   khi làm xong thì mọi kết quả tự biện minh được.
2. **Bằng chứng không tự dối.** Món này cho MÁY: «máy tin nhầm chính nó» là lớp
   lỗi có tỉ lệ đo được cao nhất; nhờ nó máy mới được chạy nhanh mà người khỏi
   kiểm lại.
3. **Khoảnh khắc quyết thật.** Người xuất hiện đúng nơi có đánh-đổi hoặc
   khó-đảo, trên bằng chứng đọc <1 phút, cổng phải có ≥2 lối ra sống.
   **Đảo-rẻ là mặt sau của nguyên tố này**: máy giữ đường đảo thì máy được đi
   trước; hành động không có đường đảo tự động rơi về khoảnh khắc quyết thật.

**Luật trace:** mọi bộ phận hiện có và mọi đề xuất mới phải trace về một trong
ba nguyên tố + nêu được **người hưởng cụ thể**. Không trace được = hình thức =
cắt. Chỉ TRỪ, không CỘNG.

### Lợi ích (người hưởng cụ thể — thước cho audit mọi đề xuất tương lai)

- **Owner (người quyết):** không kiểm lại việc máy làm; chỉ bị gọi khi có
  đánh-đổi thật/khó-đảo; mỗi lần gọi kèm bằng chứng <1 phút + khuyến nghị kèm
  căn cứ; quyết sai đảo rẻ.
- **Claude (người làm):** biết «tốt» nghĩa là gì TRƯỚC khi làm; được chạy
  nhanh/tự chủ VÌ có lưới bắt chỗ máy tin nhầm mình; không dừng chờ người ở chỗ
  không cần người.
- **Đội (khi nhân rộng):** khi AI code hỏng, biết người nào đã quyết gì trên
  bằng chứng nào; người mới dùng ngay không phải trả giá lại bài cũ.

---

## 1 · MỤC TIÊU ĐO ĐƯỢC (trước → sau)

| # | Thước | Hiện trạng (audit 12/08) | Đích |
|---|---|---|---|
| M1 | Số lần chặn owner trong một vòng T2 xanh sạch | 4–5 (duyệt phạm vi · xác nhận T1/bối cảnh · gõ lệnh nối · ký bằng chứng · khai phút) | **1** (nói đề bài) + 0 chặn cuối |
| M2 | Chữ ký xuất hiện ở đâu | mọi vòng T2/T3, bất kể có gì để quyết | chỉ nơi đánh-đổi (UNCERTAIN/known-limits/bypass/vượt trần) hoặc khó-đảo; tỉ-lệ-cổng-đổi-kết-cục theo dõi bằng sổ vàng |
| M3 | Số tầng văn bản tuyên bố nguyên tắc | 4 (Kim chỉ nam · 3 nguyên tắc UX · nhịp toàn cục · ba nguyên tố) | **1** chỗ trong CLAUDE.md, các bản cũ trỏ về |
| M4 | Nơi phải sửa-hai-lần khi đổi kit (Codex song sinh) | 3 gói + 6 template + suite ngoài CI | **0** (lưu kho) |
| M5 | Cơ chế MỚI được thêm | — | đúng **1**: trạng thái veto có dấu vết (V) |

---

## 2 · PHẠM VI — và CẤM ĐỤNG

**Nhóm GIỮ NGUYÊN (chép vào từng đề bài như danh sách cấm đụng):** chốt ý định
trước khi code · toàn bộ răng bằng chứng cho máy (hook chặn-lúc-ghi, recheck
CI, run-log đối chiếu) · lưới biên merge chạy bằng máy · các điểm máy-cạn
(hết 3 vòng, 2 vòng cùng lớp lỗi, môi trường hỏng) · Cổng Giá trị · thẻ quyết
định + trang bằng chứng · mọi đường thoát có dấu vết · design-pass (điểm
gọi-người đắt nhất còn lại, giữ CÓ CHỦ ĐÍCH: thẩm mỹ là ý định owner; nếu vài
ván nữa nó hoá thủ tục thì đó là vấp thật, bàn lúc đó).

---

## 3 · KẾ HOẠCH — 4 đợt

### Đợt 0 — bản neo (B, docs-only, hôm nay)
Commit file này. Đảo: revert 1 commit.

### Đợt 1 — cắt hình thức (A thi hành, 2 hồ sơ qua cổng theo LUẬT CŨ, gom cổng một lần ngồi)

Lưu ý luật: ở repo kit, SKILL/command `.md` LÀ hành vi (non-T1) → mọi việc dưới
đây đi qua cổng đầy đủ. Hai hồ sơ để S4 hội tụ (diff to là nguyên nhân REJECT
vô hạn đã ghi sổ); trình Gate 1 của CẢ HAI trong một lần ngồi, Gate 2 cũng vậy.

**Hồ sơ 1a — cắt hình thức trong luật hành xử:**
- Cắt đo-phút-người ở cả 4 cổng: thôi hỏi, thôi ghi; trường cũ thành optional —
  bên đọc giữ đường đọc-cũ (38 hồ sơ cũ còn trường, reader không được sập);
  nhánh báo cáo phút-vs-baseline gỡ, **sổ vàng giữ nguyên**.
- Khối «VIỆC CỦA ANH»: giữ trên THẺ CỔNG (một câu hỏi đóng tại điểm quyết
  thật), gỡ tư cách luật-mỗi-tin khỏi các văn bản luật + test canh nó.
- Bỏ câu bắt-xác-nhận T1 → máy TUYÊN kèm căn cứ rồi đi (lưới T1-escape ở CI đã
  bắt phân-loại-sai).
- Quét-độ-phủ: máy tự điền bối cảnh từ repo + gắn nhãn giả định, người gạch
  trên thẻ Cổng 1 (thôi hỏi trước từng câu).
- Setup lần đầu: máy đọc repo đề xuất TRỌN config, người sửa/gật một lần (thay
  9 câu hỏi tuần tự).
- Đồng bộ 2 mâu thuẫn văn bản: (a) hỏi/không-hỏi phút → chết theo cắt-phút;
  (b) ai commit chữ ký → chọn MỘT câu trả lời cho các ca còn ký.
- Hợp nhất tuyên bố vào CLAUDE.md (mục 0 file này thành phần vận hành; gỡ khối
  ĐÓNG BĂNG LAB đã hết hiệu lực từ 10/08).

**Hồ sơ 1b — khai tử (chỉ TRỪ):**
- Lưu kho `codex/` (3 gói + 6 template + suite ngoài CI). Căn cứ: owner 12/08
  «đội chủ yếu dùng Claude». Trigger mở lại ghi ở §5.
- Khai tử phần NGHI LỄ design-loop (mockup/evidence/push — 3 bước không tự
  động được, vai chính PRODUCT-MAP đã ghi khai tử); phần MÁY ĐO để git giữ.
- Ghi 2 ADR một-đoạn (khai tử Codex · khai tử nghi lễ design-loop) + tag git
  `truoc-luu-kho-2026-08` ngay trước commit gỡ — đường đảo tường minh.
- Gỡ khỏi 2 marketplace + QUICKSTART/README/GUIDE hết trỏ vào đồ đã lưu kho.

### Đợt 2 — người về biên (A thi hành, MỘT hồ sơ engine qua cổng theo luật cũ)

- **V — trạng thái veto có dấu vết** (cơ chế mới duy nhất): vật ghi «máy đã đi
  trước, owner chưa veto», lưới CI đếm được, KHÁC nghĩa với bỏ-cổng
  (`gate1_skipped` giữ nguyên nghĩa cũ).
- **Cổng Phạm vi T2**: máy chốt hợp đồng → đi tiếp luôn ở trạng thái V; chặn-chờ
  chỉ khi đánh-đổi thật (gap-probe P0, danh từ mờ, coverage cluster). **Chốt chủ
  quyền ý định:** đề bài mơ hồ thì vẫn hỏi; ranh giới T3 đứng trên `t3_paths`
  do owner đặt, máy không tự vẽ lại. T3 + Gate 1.5 giữ chặn như cũ.
- **Cổng Bằng chứng xanh-sạch**: verdict PASS không UNCERTAIN, không bypass,
  không known-limits mới, đảo rẻ → máy đi tiếp + báo một dòng, KHÔNG mời ký;
  chữ ký chỉ còn ở ca có đánh-đổi hoặc khó-đảo (ra người dùng thật, xoá dữ
  liệu, cam kết ngoài).
- Nghi thức bắt-người-gõ-lệnh-nối: KHÔNG làm việc riêng — tự tan khi cổng hết
  chặn.
- Sửa đồng bộ 3 tầng: luật văn bản + hook chặn-lúc-ghi + pre-merge (đã kiểm
  trên vật 12/08: hook đang chặn cứng mọi transition thiếu duyệt — vì thế nhóm
  này KHÔNG «đổi nếp bằng lời» được, phải một hồ sơ engine).
- Hậu-merge: chiến dịch re-pin theo nghi thức sẵn có (engine đổi → workspace cũ
  stale là ĐẶC TÍNH, xử một lần).

### Đợt 3 — nghiệm trên vật thật
≥2 feature thật ở repo tiêu thụ chạy trọn luật mới; đo M1, M2; retro bằng dao
trace. Chỉ sau đợt này mới bàn tiếp bất kỳ chip mới nào.

---

## 4 · SỔ QUYẾT ĐỊNH CỦA KẾ HOẠCH (để suy xét lại không trôi)

| Quyết định | Căn cứ (nguồn) | Xét lại khi | Đường đảo |
|---|---|---|---|
| Chữ ký theo đánh-đổi/khó-đảo, không theo thủ tục | Đối thoại 12/08; bằng chứng: owner từng điền đại phút; các lần cổng đổi-kết-cục đều là quyết-hướng | Sổ vàng cho thấy ca xanh-sạch-lẽ-ra-cần-người | Bật lại mời-ký ở Cổng 2 (1 dòng luật) |
| T2 máy đi trước (V), T3 giữ chặn | Nguyên tố 3 + ý định tự-động-hoá; t3_paths là của owner | Một ca T2 gây hậu quả khó đảo thật | V là trạng thái, tắt = trở về blocking |
| Cắt đo-phút | Owner tự thú điền đại (07/08); config tự ghi «điền số là bịa mẫu số»; thước mới M1/M2 | Cần KPI phút cho báo cáo đội (chưa có nhu cầu thật) | Trường còn nguyên schema, bật ghi lại được |
| Khối VIỆC-CỦA-ANH chỉ sống trên thẻ cổng | Quá tải 11/08 là TẦN SUẤT; khối mỗi-tin chứa nhầm VIỆC thay vì QUYẾT ĐỊNH | Owner lạc mất «tôi cần làm gì» sau 2–3 ván | Khuôn còn trong git, nâng lại thành luật 1 commit |
| Lưu kho Codex | Owner 12/08: «đội chủ yếu dùng Claude, đồng ý bỏ, sau mở rộng khi cần» | Có ≥1 người đội dùng Codex thật | Tag `truoc-luu-kho-2026-08`; ADR ghi sha |
| Khai tử nghi lễ design-loop, giữ máy đo trong git | PRODUCT-MAP tự ghi vai chính khai tử; 3 bước không tự động được; consumer «CHƯA có UI» | Spec 2 canvas editor khởi động | Lấy lại từ tag; máy đo độc lập nghi lễ |
| design-pass GIỮ dù đắt | Thẩm mỹ = ý định owner, máy không gánh hộ | Nó hoá thủ tục sau vài ván (vấp thật) | Có sẵn đường descope từng vòng |
| Không đại tu thêm gì ngoài V | Điều (3)(4) owner: đừng vì một nhận thức đẻ cơ chế mới; đơn giản là tốt | — | — |

## 5 · TRIGGER MỞ LẠI ĐỒ ĐÃ LƯU KHO

- **Codex:** khi có người đội dùng Codex thật (tên cụ thể) → mở từ tag, chạy
  suite codex tay, cập nhật theo diff kit từ ngày lưu kho.
- **Máy đo design:** khi Spec 2 (canvas editor) của repo tiêu thụ khởi động.

## 6 · RỦI RO & LƯỚI

- **Diff to → S4 không hội tụ** (sổ đã ghi): chia 2 hồ sơ đợt 1 + luật triage
  viết trước trong đề bài.
- **Stale-cascade đợt 2**: kế hoạch re-pin một lần, có nghi thức sẵn.
- **Cắt nhầm gân**: §2 là danh sách cấm-đụng chép nguyên văn vào từng đề bài.
- **Máy chốt nhầm tier**: `t3_paths` owner đặt + T1-escape backstop giữ nguyên.
- **Đề bài liên phiên rơi ngữ cảnh**: nghĩa vụ báo-cáo 4 mốc + trỏ về file này
  NHÚNG trong từng đề bài (worktree không chung sổ nhớ).

## 7 · VIỆC CỦA AI

- **B (phiên này):** commit bản neo; viết 3 đề bài (1a · 1b · đợt 2) tự đủ ngữ
  cảnh; đối chiếu hồ sơ trước khi mời owner ký.
- **A:** thi hành từng hồ sơ qua cổng hiện hành.
- **Owner:** gạch bản neo này; 2 lần ngồi cho đợt 1 (Gate 1 gom · Gate 2 gom);
  1–2 lần cho đợt 2; tuyên khi nào coi là xong.

## Nhật ký lệch

*(append-only — mọi quyết định lệch khỏi bản neo ghi vào đây kèm ngày + lý do)*
