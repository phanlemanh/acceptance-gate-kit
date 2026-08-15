---
slug: cat-hinh-thuc
at: 2026-08-12T07:48:32Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Gap-probe: cat-hinh-thuc

Critic context sạch (subagent tươi) chạy TRƯỚC Cổng 1, đọc đúng ba input —
`contract.md` + `evals.yaml` + file bài-học xuyên feature — và bị cấm đọc mã
nguồn (critic phán artifact, không audit code; code chưa tồn tại). Soi theo hai
rủi ro của hồ sơ chỉ-TRỪ: cắt nhầm lưới thật, và phép đo âm tính không sống.

Ánh xạ AC↔eval sạch: mọi AC có ít nhất một eval, không tiêu chí nào đi qua
backend, surfaces `cli` nên không làn mặt-người là đúng. **Lỗ nặng nhất không
nằm ở ánh xạ mà ở chỗ mục Coverage tự khai hai hạng mục "đưa vào phạm vi, không
âm thầm bỏ" rồi không dựng AC nào cho chúng** — tức chính dòng chữ trấn an người
duyệt là dòng sai.

Toàn bộ 5 finding định đoạt **one-pass, TRƯỚC Cổng 1** (sửa THƯỚC, không hạ đáp
án). Không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | Coverage khai hai hạng mục audit — KPI "giảm ≥50% thời gian người" ở GUIDE và ~10 lời hứa "5–10 phút/cổng" — nhưng KHÔNG AC/eval nào chạm. AC-1 chỉ bắt needle dạng HỎI-phút, mà văn KPI không phải câu hỏi nên lọt sạch | Ship xanh 16/16; tài liệu vẫn quảng cáo một chỉ tiêu đo bằng trường máy đã thôi ghi, chia cho mẫu số cố ý để trống. Nặng hơn: owner đọc dòng "đưa vào phạm vi, không âm thầm bỏ" nên DUYỆT SAI một phạm vi thực tế không có phép đo | Thêm một tiêu chí riêng cho lớp khẳng-định-phút với mảng needle viết trước, mỗi needle hai chân HEAD=0 và base>0, đếm suy từ mảng | **fixed (pre-Gate-1):** thêm **AC-1b** lớp KHẲNG-ĐỊNH-phút (tách hẳn khỏi lớp HỎI) + **E1b** với mảng 4 needle viết trước, mỗi needle hai chân HEAD=0 và base>0, đếm suy từ mảng |
| P1 | evals | E3 đo mực-đã-in: assert khối ngữ pháp KHAI rằng vế `, phút <số>` được bỏ qua, chứ không đo hành vi. Vế "không ghi" không có phép đo nào. Ngữ pháp còn bản chép per-site mà E3 không đọc | Bản sửa in đúng câu khai nhưng đường thi hành vẫn ghi `time_human_minutes: {gate1: 12}`; hoặc một thân lệnh chưa đồng bộ coi câu gộp là sai cú pháp và **chặn owner ngay tại cổng** — lời hứa bị vi phạm trong khi E3 xanh [stop-patching-law#F1] | Đổi sang eval judgment context sạch có ca đòi agent KHÔNG ghi trường phút vào bản nháp nó xuất ra, giữ ba chân văn bản làm lớp phụ và thêm chiều per-site | **fixed (pre-Gate-1) — LỜI KHAI ẤY CHỈ ĐÚNG MỘT NỬA, sửa nốt ở vòng sửa 1 (13/08):** thêm **E3b** judgment context sạch, ba ca, ca 1 có chân (b) đòi agent KHÔNG ghi trường phút vào bản nháp nó xuất ra — phần này đúng, và E3b tới nay VẪN CHƯA AI CHẤM. Nhưng vế «E3 được bổ sung chân per-site 3/3 site Claude» là chữ trong `expected`, không phải mã: bản thi công quét CẢ FILE bằng hai `grep -q` chuỗi rời nên câu đảo nghĩa 180° vẫn cho 3/3 OK, và nó thay vật đo bằng chính bản luật vì `commands/start.md` không mang cụm ấy (rà soát vòng 1, H2). Vòng sửa 1 cài chân thật: rút `GATE-ONESHOT-GRAMMAR` qua marker, neo dương đo CỤM LIỀN, chân giữ-gân so TẬP CÂU, per-site đọc bản khai `GATE-ONESHOT-SITES` (6 site) [mot-luot-go-cong-nguoi#F1] |
| P1 | evals | E2 tự sinh CẢ HAI fixture theo khuôn bên ĐỌC, không round-trip từ bên VIẾT thật — trong khi chính hồ sơ này sửa bên viết | Bên viết sau khi cắt để lại `time_human_minutes:` rỗng hoặc rụng theo khoá anh em; fixture tự nặn đúng khuôn nên 8/8 xanh, còn workspace THẬT tạo sau merge làm `pre-merge-check.sh` đỏ ở PR đầu tiên của đội — bên viết và bên đọc trôi khỏi nhau | Fixture mới phải là đầu ra nguyên si của đường khởi tạo thật trên cây hiện tại, fixture cũ lấy từ lịch sử, thêm dòng ghim round-trip và chiều đỏ bắt bên-viết-còn-ghi-phút | **KHAI SAI — sửa ở vòng sửa 1 (13/08).** Ô này từng ghi «fixed (pre-Gate-1)», nhưng cái được «fix» là CHỮ trong `expected`: bộ răng KHÔNG có một dòng mã nào cho E2 suốt ba vòng chạy, trong khi sổ chạy đóng dấu `exit_code: 0` cho nó — chín eval chia chung một `cmd:` và bộ ghi sổ gán rc của một lượt chạy cho MỌI eval-id trong nhóm (rà soát vòng 1, H1). Ba vật khai chỏi nhau: ô này nói đã fix, sổ chạy nói đã chạy xanh, trang bằng chứng chỉ liệt 4 eval judgment là chưa đo. Vòng sửa 1 đóng lỗ ở CẢ HAI tầng: (mã) E2 nay có 8 tổ hợp bên-đọc × fixture, chân bằng-nhau theo cặp, round-trip từ `CONTRACT-FRONTMATTER-TEMPLATE`, hai chiều đỏ tiêm thật; (cấu trúc) `ghi-so-chay-1a.mjs` đòi mỗi eval máy khai `pinned:` với ≥1 chuỗi RIÊNG trong nhóm-lệnh và chết to khi chuỗi khai vắng trong đầu ra — một eval không có chân không còn hưởng được màu xanh của eval khác |
| P1 | contract + evals | AC-9 là tiêu chí CẮT viết thuần dương, không neo âm; E9 chỉ nạp thân lệnh, thiếu chân LAN sang skill/reference | Câu "one question at a time" gỡ khỏi thân lệnh nhưng còn ở reference mà lệnh dẫn tới; agent hội đồng chỉ thấy thân lệnh nên PASS, phiên thật vẫn phỏng vấn tuần tự — đúng thứ hồ sơ tuyên đã cắt vẫn sống | Thêm neo âm quét toàn phạm vi với mảng needle hỏi-tuần-tự, chân LAN sang skill và reference, đỏ ghim file và dòng | **fixed (pre-Gate-1) — LỖI THỜI 14/08 (RA3-P2-7):** AC-13 (tên cũ AC-9b) và E9b đã RA khỏi hồ sơ ở vòng thu phạm vi, cùng AC-9/E9 sang 1c. Giữ nguyên văn làm sử liệu. Nguyên văn cũ: thêm **AC-9b** neo âm + **E9b** script quét toàn phạm vi với mảng 4 needle, chân LAN cùng lớp với E5, đỏ ghim file+dòng |
| P2 | evals | E12 là eval duy nhất không ghim sàn số ca; baseline `plugins` để trống trong Notes; chân âm không có đối chứng dương | Đúng suite mà hồ sơ này sửa case lại là suite không sàn: một file case không được nhặt sau khi đổi tên, suite in "all plugin tests passed" với ít hơn hàng chục ca mà E12 vẫn xanh; hoặc tên ca gõ sai nên chân âm đúng-một-cách-rỗng | Đo baseline suite trước Cổng 1 và khai vào contract, ghim sàn số ca, chân âm phải in đối chứng dương và đỏ khi base bằng 0 | **fixed (pre-Gate-1) — BA CHI TIẾT NAY ĐÃ SAI, khai lại 14/08 (RA3-04):** đo baseline `plugins` = **173 ca** (suite này KHÔNG in số, phải đếm dòng `PASS:` — chính vì thế nó dễ teo mà không ai thấy) — phần này đúng. Ba chi tiết còn lại KHÔNG còn đúng: (a) E12 nay ghim **ĐẲNG THỨC** `173 -> 146`, không phải sàn `≥173` (`evals.yaml`, mục `[SỬA SAU CỔNG 1 — 13/08]`); (b) chân `MOI-TIN-CASE` đã **rời khỏi E12** ở vòng sửa 1 (H15) — nó không thể sống ở đó, vì `cmd` của E12 là bộ đếm số ca **của hồ sơ 1b** và một script của 1b không in được chuỗi của 1a — rồi **rời hẳn khỏi hồ sơ** ở vòng thu phạm vi 14/08 cùng AC-5; (c) con số `62` cho `workflows` SAI ngay lúc khai (thật là **488**, hồ sơ 1b tìm ra) và hợp đồng đã có mục `[SỬA SAU CỔNG 1]` cho nó — ô này thì chưa. Giữ nguyên văn ô cũ làm sử liệu; sửa là xoá dấu vết một lần khai. |

## Ghi chú của phiên thi hành

Bốn trong năm finding là **lỗ của bộ THƯỚC**, không phải của vật — đúng như hai
vòng gần nhất. Cái đáng nhớ nhất là P0: tôi viết một dòng trấn an ("đưa vào
phạm vi, không âm thầm bỏ") rồi không dựng phép đo cho nó. Dòng đó nguy hiểm
hơn việc bỏ sót im lặng, vì nó **mua niềm tin của người duyệt bằng một lời hứa
không có răng**.
