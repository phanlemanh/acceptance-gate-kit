# Bộ hình kiến trúc & vận hành — Acceptance Gate Kit

> **Hồ sơ tầng 2** theo [DIAGRAM-RULE](../DIAGRAM-RULE.md): mỗi hình là **chiếu của một
> đoạn chữ** trong GUIDE / SKILL / ADR — đổi luật thì sửa chữ rồi vẽ lại, không sửa
> hình. Mỗi hình có ba dạng cạnh nhau: `.html` (nguồn, mở trong trình duyệt), `.svg`,
> `.png` (xem inline trong app / GitHub). Vẽ bằng plugin `diagram-design`, skin mặc
> định của repo ([diagram-skin.md](../diagram-skin.md)), qua bộ kiểm tràn chữ
> `check_overflow.py` của skill. Colophon ở chân mỗi hình ghi nguồn chữ + commit.

**Bổ sung, không thay thế:** GUIDE giữ nguyên; mỗi mục liên quan chỉ có một dòng trỏ về đây.

## Thứ tự đọc cho người mới

Từ *đứng đâu* → *chạy thế nào* → *vật gì sinh ra* → *tin được vì sao* → *vòng lớn*.

| # | Hình | Loại | Câu hỏi nó trả lời | Nguồn chữ |
|---|---|---|---|---|
| 1 | [Kit cắm vào đâu](kit-cam-vao-dau.png) | Nested | plugin nào chứa skill/lệnh nào; superpowers, ổ cắm, repo tiêu thụ đứng ở đâu | GUIDE §2 · marketplace.json · acceptance-init (INIT-CI-COPY-LIST) |
| 2 | [Kit là nan hoa, hồ sơ là trục](kien-truc-ho-so-la-truc.png) | Architecture | luồng ghi/đọc giữa máy · hồ sơ · người · lưới | GUIDE §2–3 · feature-loop/SKILL.md · commands/start.md |
| 3 | [Vào cửa nào, dày bao nhiêu](vao-cua-nao-day-bao-nhieu.png) | Flowchart | ba lối của `/start`; hạng T1/T2/T3 quyết số cổng | commands/start.md bước 3 · GUIDE §3 bảng tier · ADR 0005 |
| 4 | [Vòng LÀM S0→S5](vong-lam-s0-s5.png) | Swimlane | ai làm bước nào; người đứng ở biên chỗ nào | feature-loop/SKILL.md (bất biến dừng đợt 2) · GUIDE §3 |
| 5 | [Trạng thái hồ sơ](trang-thai-ho-so.png) | State machine | hồ sơ đang ở đâu, resume vào đâu; guard của từng chuyển tiếp | bảng state feature-loop/SKILL.md · GUIDE §3, §7 |
| 6 | [Bên trong S4](ben-trong-s4.png) | Sequence | bằng chứng từ đâu ra, theo thứ tự nào | GUIDE §4 · workflows/acceptance-verify.js · hooks/acceptance-evidence-gate.js |
| 7 | [Chuỗi bằng chứng](chuoi-bang-chung.png) | Evidence chain | màu xanh do ai sinh, ai kiểm; mắt xích tự khai nằm đâu | GUIDE §2 (một nguồn luật) + §4 · ADR 0012 · pre-merge-check.sh |
| 8 | [Vật × vai](vat-x-vai.png) | RACI | vòng sinh ra tài liệu gì; ai viết, ai đọc, ai giữ chữ K | kiểm kê `_acceptance/<slug>/` trong skills/ · commands/ · ADR 0007 |
| 9 | Ý tưởng có ô và lối ra | Flowchart | một cửa vào · ba nhịp tim · bốn số phận | nằm cạnh hạt giống «Vào có ô, ra có tên» — `docs/plans/assets/2026-08-21-hat-giong-vao-co-o-ra-co-ten/y-tuong-co-o-va-loi-ra.html` (PR #75) |
| 10 | Vòng từ ý đến số | Loop | hai hạt giống cắm vào đâu trong vòng outcome; hồ sơ là trục | cùng thư mục trên — `vong-tu-y-den-so.html` (PR #75) |

## Cách đọc từng hình (3–5 dòng, chỉ vào vật trong hình)

### 1 · Kit cắm vào đâu
- Ba vòng lồng nhau: phiên Claude Code ⊃ marketplace `acceptance-gate-kit` ⊃ **engine chung** (vòng cam) — càng vào trong càng hẹp, và vòng trong cùng là thứ duy nhất cả hook lẫn CI cùng `require`.
- Ba thẻ plugin nằm ngang trong marketplace; `feature-loop` là nhạc trưởng, nó *gọi* `acceptance-gate` và bốn skill `superpowers` (thẻ bên phải, ngoài marketplace).
- Thẻ nét đứt là **ổ cắm** repo tự khai — hiện chưa cắm; vắng thì kit đi nghi thức nội bộ.
- Dòng nghiêng dưới cùng: repo tiêu thụ đứng *ngoài* phiên, giữ hồ sơ + bản chép 7 file — vì vậy lưới còn chạy khi không có phiên nào.

### 2 · Kit là nan hoa, hồ sơ là trục
- Ô cam ở giữa là `_acceptance/<slug>/` — mọi nan hoa ghi vào hoặc đọc từ đây; `status` là nơi duy nhất giữ trạng thái.
- Cột trái: ba plugin ghi vào hồ sơ; hình chỉ đính vào lớp trình bày.
- Hồ sơ chiếu xuống thẻ / bản đồ → người đọc trong một phút → mũi tên cam ngược là quyết định, ghi thẳng vào hồ sơ.
- Lưới trước-merge đọc hồ sơ ở *biên* (mũi tên vòng bên phải, có cầu bắc qua) — nó canh lối ra, không nằm trong vòng.

### 3 · Vào cửa nào, dày bao nhiêu
- Hình thoi trên là **người** chọn lối: (a) ý còn mơ hồ → Vòng HIỂU; (b) việc đã rõ → S0; (c) việc vặt → thoát.
- Hình thoi dưới là **máy** suy hạng từ path dự kiến: T3 → ba cổng; T2 (cam, mặc định) → hai cổng có làn V; T1 → thoát kit.
- Dòng nghiêng: hạng tự khai ở S0 bị đối chiếu lại bằng diff thật ở S4 — khai T1 mà đụng code thì CI bắt.

### 4 · Vòng LÀM S0→S5
- Làn Nhạc trưởng chạy thẳng; hai hình thoi là hai cổng người nằm *trên đường máy*.
- Hai mũi tên cam là làn V: T2 đủ điều kiện thì đi tiếp trong cùng lượt; nét đứt lên làn Người là cửa veto.
- Làn Người chỉ có hai ô nét đứt: veto trên thẻ · ký khi khó-đảo.
- Làn Bộ đo: S4 trả REJECT về S2–S3 tối đa 3 vòng; làn Hồ sơ dưới cùng là vạch `status`.

### 5 · Trạng thái hồ sơ
- Năm trạng thái trái→phải; nhãn mỗi chuyển tiếp viết theo `sự kiện [điều kiện] / hành động`.
- Hai đường quay lui nét đứt: REJECT ≤3 vòng (vòng dưới `implemented`) và STALE (cung trên, `verified` → `implemented` khi code đổi sau `verified_commit`).
- Từ `verified` có **hai lối ra**: cam = làn V (đủ 6 sạch ∧ không khó-đảo → đã giao, không ký); xám = Cổng Bằng chứng → `signed-off`.
- Dòng nghiêng: từ bất kỳ trạng thái nào, người veto là máy dừng ngay (`da-veto`).

### 6 · Bên trong S4
- Năm cột theo thời gian từ trên xuống; Workflow S4 (viền cam) giữ quyền suốt lượt.
- Bộ chạy máy và Hội đồng nhận việc song song; trả về bằng nét đứt.
- Vòng tự gọi «merge tiền định» là chỗ mọi con số được máy chốt — LLM chỉ chép vào run-log và báo cáo.
- Khung ALT: hook lúc ghi rẽ hai nhánh — ghi xong, hoặc BLOCK khi run_id không có trong log / SHA giả / PASS thiếu bằng chứng.
- Mũi tên cam cuối: kết quả về nhạc trưởng.

### 7 · Chuỗi bằng chứng
- Một đường nét đứt đậm chia **bên làm** (trên) và **bên kiểm** (dưới); mỗi hiện vật có dòng định danh để kiểm lại được.
- Mắt xích viền cam «TỰ KHAI» là báo cáo bằng chứng — máy viết và tự khai; vì thế ba mắt xích bên kiểm (hook · thẻ+chữ ký · lưới) đối chiếu nó với sổ cái ghi lúc chạy.
- Chuỗi bước xuống qua ranh giới ba lần: chạy evals · chép nguyên văn · đối chiếu run_id — đó là ba lần bằng chứng đổi tay.

### 8 · Vật × vai
- Tám nhóm vật, sáu vai; chip **K** = giữ trách nhiệm cuối (đúng một ô mỗi hàng), **V** = viết, **Đ** = đọc/đối chiếu; ô trống là nội dung.
- Ô cam: hàng *Bằng chứng* là hàng duy nhất **máy** (Bộ đo S4) giữ K — chính vì vậy hàng đó có hai chữ Đ ở hook và lưới CI.
- Hàng *Bản đồ sản phẩm*: K thuộc lưới CI (canh bản đồ == hồ sơ, ADR 0007), máy vòng chỉ V.

### 9–10 · Ý tưởng có ô và lối ra · Vòng từ ý đến số
Cách đọc ghi trong hạt giống «Vào có ô, ra có tên» (`docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` §8).

## Khi nào vẽ lại

Khi chữ nguồn đổi (luật cổng, bảng state, danh sách plugin, INIT-CI-COPY-LIST). Sửa
`.html`, chạy lại `check_overflow.py`, xuất lại `.svg`/`.png`, cập nhật colophon commit.
Không có phép đo nào canh bộ hình — cố ý: hình là chiếu, không đỏ được, không phải chỗ đặt răng.
