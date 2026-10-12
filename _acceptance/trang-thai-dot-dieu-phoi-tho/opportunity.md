---
schema_version: 1
slug: trang-thai-dot-dieu-phoi-tho
feature: «Trạng thái đợt Điều phối – Thợ hiện ngay trong app, không phải mở trang hay dò nhật ký»
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: DP6b
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 12/10 từ hàng DP6b của lộ trình kit (Điều phối M5 mở hàng cho mốc 01/11 trong đề xuất sau 2.27.0).
> Phần mod của DP6, tách khỏi DP6 ngày 11/10 vì phải chờ khung mod của DP4. Nay DP4 (#312) và lõi DP6
> (#315) đều đã gộp vào `main`. Engine của crm đóng băng tới sau đợt thử 26–27/10, nên vòng này
> **không cắt số và không gắn tag**. Bản phát hành gom về mốc 01/11.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/dieu-phoi-hai-tang — chủ kho đồng ý đưa Mods vào vòng 10/10 (bản ghi nhu cầu §5 mục 6; spec `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` §12.2 hàng «Khung trạng thái đợt», §13 hàng «Đang chạy — xem»)

**Ai trả giá:**
- **Chủ kho.** Muốn biết đợt đang ở đâu thì phải hỏi phiên giám sát, mở `bang.html` trong thư mục đợt, hoặc gõ
  `/dieu-phoi:xem`. Mỗi lần hỏi là một lượt gọi người ngoài thiết kế.
- **Phiên giám sát.** Mỗi lần được hỏi trạng thái là tốn một lượt model.
- **Phiên thợ.** Không thấy mình đang đứng thứ mấy trong hàng chờ khoá S4, hay khoá đang thuộc ai và tới mấy giờ.

**Bằng chứng:**
- Đợt crm 04/10: **20 trên 33 tin** chủ kho gửi phiên điều phối là «Kiểm tra các phiên…» hoặc hỏi trạng thái.
  Lý do: chủ kho không thấy trạng thái đợt, mà trang lộ trình chỉ là ảnh chụp, không tự làm mới
  (`docs/findings/2026-10-05-doi-phien-co-dieu-phoi.md` §4.4).
- Hôm nay đã có trạng thái nhưng phải đi lấy. `dieu-phoi.mjs xem` (DP2) và `bang.html` vẽ từ cùng hàm
  `moHinh` (`dieu-phoi/scripts/mo-hinh.mjs`). Lệnh `/dieu-phoi:xem` là lệnh markdown nên mỗi lần gọi tốn một lượt
  model (`dieu-phoi/commands/xem.md`). Không có gì hiện sẵn trong app.
- Khung mod đã có trên `main`: `hooks.json` khai `modules: ["./mod/register.ts"]`; bảng `MOD-SU-KIEN` ở
  `dieu-phoi/scripts/mod-luat.mjs`; răng T11 ở `tests/dieu-phoi/kiem-mod.mjs` (DP4, `_acceptance/dieu-phoi-doi-tai-khoan`).
  Vòng này chỉ thêm một tệp phần cùng một dòng bảng, và răng tự phủ phần mới.

**Cân trên mọi kho** (theo luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»):

| Kho | Được gì | Mất gì | Hành vi cũ có ai dựa |
|---|---|---|---|
| crm (đang cài `dieu-phoi`, đợt thật) | Trạng thái đợt hiện sẵn ở mọi phiên. `/dieu-phoi:xem` không tốn lượt model | Mỗi phiên gọi `node … xem --json` 20″ một lần khi có đợt, 120″ một lần khi không có | Kết quả của `xem` không cờ phải giữ nguyên từng byte. Phiên chưa có mod vẫn chạy được lệnh markdown như cũ |
| Kho chưa cài `dieu-phoi` | Không có gì | Không mất gì: gói chỉ cài theo kho bằng `--scope project` | — |
| App/CLI chưa hỗ trợ mod (CLI 2.1.281 trên PATH máy M5) | — | Không mất gì: mod không nạp, hook thường của DP1 vẫn chạy | Hook thường không nhường cho mod (§12.2) |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | App desktop (2.1.295) vẽ được dải `AbovePrompt` và pane của mod trong phiên mở từ chip | Không ai thấy dải trên bề mặt chủ kho dùng hằng ngày, nên giá trị chính mất | Theo tài liệu kiểu: `AbovePrompt` có ở terminal và desktop (D10253), `Pane` có ở mọi bề mặt (D10310). Nghi thức đo sống §12.3 kịch bản 2 (hạt giống) | Tài liệu nói có. Chưa nhìn tận mắt |
| 2 | Từ app desktop, mod gọi được `$.process.run(['node', …])` | Dải không có số liệu | Đo sống §12.3 kịch bản 4. Nhánh dự phòng: mod đọc thẳng tệp đợt bằng `$.fs` rồi gọi `moHinh`, vì `mo-hinh.mjs` đã qua `validate` | Chưa thử |
| 3 | Hook `command.run` trả lời được lệnh markdown của chính gói (`/dieu-phoi:xem`) mà không qua model | `/dieu-phoi:xem` vẫn tốn lượt model | `claude plugin test` với một ca `command.run`. Không được thì đăng ký lệnh riêng `dot` | Chưa thử |
| 4 | Gọi CLI 20″ một lần ở mọi phiên không làm nặng máy (6 thợ + 1 giám sát → khoảng 21 lần chạy node mỗi phút) | Gánh thêm việc cho máy mà bộ phát lịch đang canh để giảm tải | Đo thời gian `xem --json` trên thư mục đợt thật | Chưa thử |
| 5 | crm nhận bản phát hành 01/11 trước đợt kế | Làm xong mà chưa ai dùng | Điều phối M5 đã xếp crm nhận 2.27.0 từ 15/10. Bản 01/11 là lượt nhận kế tiếp | Đã có lịch |

## Ngưỡng chết / ngưỡng UAT

- **Câu hỏi phép đo trả lời:** sau khi crm nhận bản có DP6b, chủ kho còn phải hỏi «đợt thế nào» không, và dải có
  nói đúng trạng thái không?
- **Kết quả SỐNG:** đo trong đợt crm đầu tiên chạy bản này, ít nhất một ngày chạy.
  - Chủ kho hỏi phiên giám sát về trạng thái **≤ 2 lần mỗi ngày**. Mốc so sánh: 20 tin ngày 04/10. Số này đếm
    từ bản ghi phiên giám sát.
  - Dải hiện ở **mọi phiên** giám sát và thợ mở trên desktop.
  - `/dieu-phoi:xem` trả lời mà **không tốn token model** nào.
  - **Ít nhất 3 lần** đối chiếu dải với `xem` chạy cùng lúc, và không lần nào lệch.
- **Kết quả CHẾT** (gặp là gỡ mod ngay, bất kể ngày):
  - Mod làm một lời gọi công cụ chạy mà không qua hỏi quyền.
  - Mod làm treo hoặc làm chậm phiên thấy rõ, ví dụ `process.run` không trả về.
- **Kết quả iterate:**
  - Trên desktop, dải không hiện ở phiên nào cả.
  - Hoặc chủ kho vẫn hỏi trạng thái **≥ 5 lần mỗi ngày**. Đây là ngưỡng mở của đề H4 trong finding 05/10.
- **Timebox:** làm xong trước mốc 2026-11-01 của hàng DP6b. Đọc ngưỡng ở đợt crm đầu tiên sau khi crm nhận bản
  phát hành 01/11.
- **Chính sách rủi ro (đề xuất của máy):** mod chỉ đọc và vẽ.
  - Nghi ngờ thì không vẽ. CLI lỗi hoặc dữ liệu hỏng thì dải in đúng một dòng «khung: không đọc được đợt», không
    đoán.
  - Mod không bao giờ cho phép một lời gọi công cụ, và không ghi tệp đợt.
  - Việc «chưa nhìn thấy dải trên desktop» là một **nhãn** trên thẻ Cổng Bằng chứng. Nó không thành việc phải làm
    và không thêm lượt gọi chủ kho. Reality (đợt crm đầu tiên) đọc nó.

## Kết quả prototype

Chưa dựng. Ba lời hứa và răng đã thiết kế ở hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`.
Mod thăm dò §12.3 đã qua `validate --strict` 2.1.295 ngày 11/10 nhưng chưa nạp. Vòng này kiểm giả định 3 bằng
`claude plugin test`. Giả định 1 và 2 được đo bằng máy ở mức tài liệu kiểu cộng `plugin test`. Phần nhìn tận mắt
trên desktop do reality đọc, theo chính sách ở trên.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn dải một dòng và pane | hạt giống DP6b §«Việc còn lại» mục 2 | ngôn-ngữ/hình-thái | có, làm đầu vào brainstorm | — |
| API mod (`$.process.run`, `$.ui.open`, `AbovePrompt`, `command.run`) | `claude-code.d.ts` 2.1.295 trong app | ràng-buộc nền | có, bám đúng bản đã tra | — |
| Mod thăm dò §12.3 | phụ lục hạt giống | mã thăm dò | không. Chỉ lấy cách gọi API, không nghe `tool.call`/`tool.check` | — |

## Cổng 0

- **decision = …** Máy khuyến nghị **build**. Đây là hàng T2 có neo ngoài, khung đã sẵn, và chỉ bật ở kho tự cài
  `dieu-phoi`.
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- `dieu-phoi.mjs xem --json` in mô hình kèm `day_cua_cwd`. Kho không có đợt thì in `{"dot":null}` và thoát 0.
  `xem` không cờ in từng byte như cũ.
- `xem`, `bang.html`, dải và pane cùng vẽ từ một mô hình. Ca round-trip: trên cùng một thư mục đợt, các số khớp
  nhau.
- Dải một dòng `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`.
  - Ở phiên thợ, dải thêm `Dãy <id>: <hàng> · <tiến độ>`.
  - Khi giảm tải, dải mở đầu bằng `GIẢM TẢI`.
  - CLI lỗi thì dải in «khung: không đọc được đợt».
  - Dải làm mới mỗi 20″ khi có đợt, mỗi 120″ khi không có.
- Nút «xem» trên dải mở pane ở mọi bề rộng.
- `/dieu-phoi:xem` qua mod trả chữ mà không qua model. Phiên chưa có mod vẫn chạy lệnh markdown như cũ.
- Răng:
  - Phần `mod/khung.ts` chỉ nghe {`session.start`, `ui.render`, `ui.press`, `command.run`}.
  - Răng T11 của DP4 phủ phần mới: sự kiện nằm trong bảng, và không có chữ `allow` hay `result`.
  - Hàm vẽ thuần ở `dieu-phoi/scripts/khung.mjs`, không import gì.

## Out of scope từ khám phá

- Không đo §12.3 câu 1 (hộp quyền của tác tử Workflow có tới hook `Notification` không). Không đo câu 3
  (`session.send` giữa lượt) và câu 4 (mod tự đánh thức thay Monitor). Ba câu này không thuộc câu giao «trạng thái
  hiện trong app», nên vẫn nằm ở hạt giống.
- Mod không chặn S4, không ghi tệp đợt, không nghe `tool.call`, `tool.check` hay `classic.*`.
- Không sửa `bang.html` hay bộ phát lịch. Không sửa luật heredoc, «S4 tự xưng», hay `can_phan` đánh thức hai lần.
  Các việc đó có ngưỡng riêng ở hạt giống.
- Không cắt số, không gắn tag. Bản phát hành gom về mốc 01/11.
