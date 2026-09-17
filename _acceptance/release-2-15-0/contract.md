---
schema_version: 1
feature: Phát hành kit 2.15.0 — cắt số cho hai gói kit sau cửa sổ chạy dưới R (0 vòng meta mới, một vòng sản phẩm thật ở OneFlow), khai MỘT vòng meta đã ký trước R, mang tiêu chí cho ba việc meta đã vào cửa sổ qua chip mà owner đếm là vá-trong-mốc, sửa khuôn /goal để hook nhận hai lần dừng hợp lệ, cộng hạt giống «vòng meta đang mở trong cửa sổ» trên thẻ mở phiên của kho kit
slug: release-2-15-0
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm scripts/start-scan.mjs, commands/start.md, hai manifest, GUIDE, CHANGELOG; ba việc meta đã trên main chạm feature-loop/scripts và skills/. KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: implemented
approved_by: Mạnh
approved_at: 2026-09-17
---

# Acceptance Contract: release-2-15-0

## Context

Cửa sổ 2.14 → 2.15 mở khi 2.14.0 ký 15/09. **Owner chốt R ngày 16/09**
(`docs/findings/2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md` §3): không mở vòng
meta mới, đo cái đã ship trên một vòng sản phẩm thật. Vòng đó — R1, `skill-system-v1` ở
OneFlow — ký Cổng Bằng chứng 17/09 và cho số «sau» đầu tiên
(`docs/findings/2026-09-17-quan-sat-r1-ba-dinh.md`).

**Cửa sổ vẫn không phải «0 meta» theo nghĩa đen.** Trong một ngày có ba việc của kit đi
vào qua chip, mỗi việc owner gọi tên. Owner quyết 17/09 (Q2 ở
`docs/findings/2026-09-17-boi-canh-truoc-va-sau-R.md` §6): đếm là **vá-trong-mốc**, đếm đủ —
hồ sơ này mang tiêu chí cho cả ba, và hạt giống «vòng meta đang mở: N» thành việc của mốc.

**Và cửa sổ có MỘT vòng meta đã ký, trước R.** `guide-chep-ci-buoc-vao-writer` (T2) ký Cổng
Bằng chứng 16/09 lúc 09:17, sáu giờ trước commit chốt R (15:09). Nó buộc hai bản khai danh
sách chép CI vào writer bằng một phép đo trong `tests/scripts/`, không chạm engine; một commit
T1 cùng sáng sửa GUIDE §5.3 khai đủ chín tệp. Cả phiên dựng hồ sơ này lẫn finding bối cảnh
đều bỏ sót nó — phản biện context sạch của mốc chỉ ra lỗ đo, phép kiểm theo kho lộ ra vòng.
Luật (b) cho tối đa một vòng meta giữa hai mốc: cửa sổ ở đúng trần, không vượt. Tập hồ sơ
vòng sinh sau lần cắt số trước, do răng `rang-cua-so.mjs` đối chiếu:

<!-- <<<VIEC-META-CUA-SO
guide-chep-ci-buoc-vao-writer
VIEC-META-CUA-SO>>> -->

| việc | ở đâu | engine | vì sao |
|---|---|---|---|
| **start-scan: vật đã ở nhánh gốc** | nhánh này, chưa lên main (tiền lệ 2.11.0) | `scripts/start-scan.mjs` · `scripts/trang-thai-ho-so.cjs` · `commands/start.md` | crm-onehub 16/09: thẻ in «viết code» cho vòng đã merge từ 04/09, một phiên 8 giờ 25 phút chấm lại thứ đã ở prod |
| **răng chụp hồ sơ đã thông cổng** | main `fc1f0f22`, không hồ sơ riêng | `feature-loop/scripts/chup-ho-so-da-thong.mjs` · `repin-lane.mjs` · luật ở `skills/acceptance/` | crm-onehub 16/09: một phép đo ghi đè bằng chứng của hồ sơ đã ký sau mỗi lượt chạy, không răng nào thấy |
| **veto một nguồn** | main `bcd0f166` + ghim lại `3ad5608e` | cùng hai tệp trên + bảng AG-ENGINE | owner veto lối khai gạch hai tệp của răng trong hồ sơ đã ký `ra-co-ten-lam-va-trao`; thay bằng hỏi `DA_THONG_CONG_2` của bộ máy |
| **hạt giống vòng meta đang mở** | nhánh này | `scripts/start-scan.mjs` · `commands/start.md` | luật (b) cho tối đa một vòng meta giữa hai mốc mà không vật máy giữ nào đếm |
| **khuôn `/goal` nhận hai lần dừng hợp lệ** | nhánh này | ba bản chép `GOAL-TEMPLATE`: `feature-loop/skills/feature-loop/SKILL.md` · `GUIDE.md` · `scripts/gate-card.js` | R1: hook chặn **11** lần dừng hợp lệ — 2 lần khi máy dừng chờ người cài `uv`, 9 lần khi máy dừng ở trần nhát sửa thước chờ chọn lối; bộ chấm hook đọc «chờ input người» là chỉ ở tầng cả vòng |
| *(đã ký, không phải vá-trong-mốc)* `guide-chep-ci-buoc-vao-writer` | main `b0aaa515`, hồ sơ riêng | không — `tests/scripts/consumer-esm.test.mjs` | hai bản khai danh sách chép CI trôi khỏi nhau; đợt rollout 2.14 cho thấy thiếu một tệp là tắt lặng một lớp cưỡng chế |

Năm việc bảng trên (trừ vòng đã ký) đi đường ADR 0018: CỘNG được owner phê đích danh (chip 16/09 cho ba việc đầu, Q2
17/09 cho hạt giống; mục D của finding bối cảnh, 17/09, cho khuôn `/goal`). **Mười một tệp
đổi kể từ lần cắt số `45b72057`**, chưa kể hai manifest: sáu tệp đã trên main từ răng chụp hồ sơ
và veto (trong đó có SKILL feature-loop); ba tệp trên nhánh này từ start-scan và hạt giống
(`scripts/start-scan.mjs` · `scripts/trang-thai-ho-so.cjs` · `commands/start.md`); và hai tệp
khuôn `/goal` thêm vào (`scripts/gate-card.js` · `GUIDE.md`), vì bản chép thứ ba nằm trong SKILL
đã đếm. Lớp CI vendored
không đổi tệp nào — AC-12 đo.

Hai gói cùng lên **2.15.0**; `diagram-design` giữ 2.7.0.

Source input: prompt owner 17/09 (phiên cắt mốc), nguồn chữ là bốn finding kể trên cộng
`docs/findings/2026-09-16-truy-nguyen-thuoc-khong-co-cua.md` §1.

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc, và số phải TĂNG

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy `rang-p200.sh` và `rang-so-tang.sh` của hồ sơ này (chép nguyên thân từ 2.14.0)
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang MỘT số hợp semver;
`GUIDE.md` dẫn xuất số đó từ manifest; mục mô tả của số đó nói người dùng nhận gì;
`feature-loop` tự khai cặp `acceptance-gate >= <số đó>`; và số ở cây LỚN HƠN theo semver
số tại commit đưa hồ sơ mốc này vào kho. Vế giá trị — số ấy là **2.15.0** — owner xác nhận
trên thẻ.

### AC-2 (gói không đổi thì GIỮ số) — diagram-design ở 2.7.0, chứng bằng cửa sổ diff

**Given** cây tại HEAD
**When** chạy `rang-moc.sh --chan diagram`
**Then** `diagram-design/` không đổi một dòng nào kể từ lần cắt số gần nhất của nó, số đọc
được tại HEAD là 2.7.0, và đối chứng dương trong cùng lượt nói cửa sổ không rỗng, bộ lọc
còn khớp vật.

### AC-3 (vá-trong-mốc) — hồ sơ «đã duyệt» có vật đã ở nhánh gốc vào nhóm riêng

**Given** một hồ sơ `status: approved` mà trong thư mục của nó có ít nhất một tệp bằng
chứng — tên bắt đầu bằng `evidence-report`, đuôi `.md`, kể cả bản đổi tên có đoạn
`xep-lai` — mang `verified_commit` là tổ tiên của HEAD
**When** chạy bộ quét mở phiên trên kho đó
**Then** hồ sơ nằm trong nhóm «Đang dở» với khoá `vat-da-o-nhanh-goc`, `nextStep` là
`null`, nhãn đúng nguyên văn «vật đã nằm trong nhánh gốc — hồ sơ còn treo ở «đã duyệt»»
và việc kế đúng nguyên văn «người: chọn một lối — đóng theo quan sát (ghi quyết định,
không chấm lại) hoặc chấm lại (đưa về «code xong», chạy nghiệm thu máy)». Đúng cho cả hồ
sơ có kế hoạch lẫn chưa có kế hoạch.

### AC-4 (độ đặc hiệu) — không đủ căn cứ thì IM, giữ nhãn cũ

**Given** CÙNG kho git của AC-3
**When** hồ sơ `approved` không có bằng chứng · có bằng chứng mà commit nằm trên nhánh
KHÔNG merge · có bằng chứng mà commit không có trong kho đối tượng; và khi hồ sơ ở
`implemented` với bằng chứng có commit đã vào nhánh gốc
**Then** ba ca đầu vẫn «đang viết code» (bước kế `S3`), ca cuối vẫn «code xong, chưa ai
chấm» (bước kế `S4`); không hồ sơ nào bị đẩy sang hỏng. «Chưa biết» không được in thành
«đã ở nhánh gốc».

### AC-5 (chiều đỏ) — gỡ phép hỏi tổ tiên trong bản sao thì kết luận LẬT

**Given** bản sao TRỌN thư mục `scripts/` và `lib/` của cây đang kiểm
**When** bản sao chưa phá chạy trên kho của AC-3 (đối chứng dương), rồi thay đúng một
chỗ gọi phép hỏi tổ tiên bằng `false`
**Then** bản chưa phá cho nhóm mới; bản đã phá đưa hồ sơ đã merge về lại «đang viết
code». Neo đột biến có đúng một chỗ gọi — neo mất thì ca đỏ, không im.

### AC-6 (judgment) — thẻ mở phiên không mời resume trơn cho dòng «vật đã ở nhánh gốc»

**Given** thân lệnh mở phiên và bảng chữ trạng thái
**When** hội đồng đọc khối `START-VAT-DA-O-NHANH-GOC` và điều khoản bàn giao ở bước 4
**Then** thẻ in nhãn thay cho bước máy, trình HAI lối trong CÙNG một câu hỏi chọn (không
thêm câu hỏi, không thêm cổng), máy không chọn hộ, và lối «chấm lại» bàn giao kèm câu dặn
đưa hồ sơ về `implemented` trước khi vào nghiệm thu máy — không bao giờ đưa lệnh resume
trơn vào một hồ sơ «đã duyệt» có vật đã merge. Câu chữ theo bản luật ngôn ngữ mặt người.

### AC-7 (răng chụp hồ sơ) — làn ghim lại đỏ khi chạm hồ sơ đã thông cổng, và IM trên cây thật

**Given** một kho git do code sinh có một hồ sơ người ký, một hồ sơ máy thông và một hồ sơ
đang `implemented`, cùng CHÍNH làn ghim lại thật
**When** chạy sáu ca CH0–CH5 của `tests/scripts/chup-ho-so-da-thong.test.mjs`
**Then** CH0 module không mang bản chép của mảng trạng thái, gọi thiếu mảng thì dừng có
tên · CH1 đối chứng dương: tạo phẩm ra `.acceptance-runs/`, suite ghi vào hồ sơ
`implemented` → làn xanh, dòng chụp nói 0 tệp bị chạm · CH2 eval ghi vào bằng chứng của hồ
sơ đã ký → làn đỏ exit 1, ghim đúng đường tệp, không ghi sổ · CH3 ghi lại đúng byte vẫn đỏ
«ghi lại, cùng nội dung» · CH4 suite thêm tệp vào hồ sơ máy thông → đỏ «thêm» · CH5 dọn
xong thì cùng lệnh xanh và tự kiểm xanh.

**VÀ chiều im trên cây thật.** **Given** worktree tách tại HEAD của kho kit **When** chụp
mọi hồ sơ đã thông cổng bằng chính module của làn, chạy tuần tự các suite trong
`feature_loop.suite_keys`, rồi chụp lại **Then** mọi suite exit 0 và **0 tệp bị chạm**, trên
một tập chụp KHÔNG rỗng, và sha in ra là HEAD của lượt chấm. Cây của lượt chấm phải sạch ngoài
`_acceptance/` và thư mục lượt chạy — nếu không, worktree tại HEAD đo một phiên bản khác vật
đang chấm, và răng dừng mã 2 gọi tên tệp chưa commit. Chiều im mới là thứ phải đúng trên cây này: răng kêu oan thì mọi
lượt ghim lại của kit dừng.

### AC-8 (một nguồn) — hai trạng thái đã thông cổng chỉ sống ở bộ máy

**Given** cây tại HEAD
**When** chạy `rang-mot-nguon.mjs --chan da-thong-cong-2`
**Then** bảng AG-ENGINE của làn ghim lại có hàng `DA_THONG_CONG_2` của
`lib/workspace-record.cjs` · ca GL03 xanh (mọi lời gọi bộ máy có hàng, mọi hàng được dùng)
· khối khai gạch của hồ sơ đã ký `ra-co-ten-lam-va-trao` không còn dòng nào cho tệp của
răng chụp hồ sơ · module chụp hồ sơ không gõ tay trạng thái nào · hai tệp của răng không
chứa chuỗi mà RT13 quét · RT13 xanh. Tức RT13 im **vì** không còn chuỗi, **không phải vì**
được khai gạch. Mỗi phép quét có đối chứng dương ngay trước nó.

### AC-9 (hạt giống) — thẻ mở phiên của kho kit đếm vòng meta đang mở

**Given** một kho git do code sinh mang manifest `acceptance-gate`, một commit cắt số, một
hồ sơ mở sinh TRƯỚC mốc, và sau mốc: một hồ sơ mốc `release-<x>-<y>-<z>` còn draft, một hồ
sơ đã thông cổng, một vòng mở
**When** chạy bộ quét mở phiên thật
**Then** khoá `metaOpen` trả đúng: một vòng mở sau mốc → `n` 1, KHÔNG cờ, mốc là commit đổi
dòng version (không phải commit đổi mô tả sau đó) · thêm vòng thứ hai, kể cả chưa commit →
`n` 2, CỜ, đúng tên cả hai · kho tiêu thụ (manifest tên khác) → không áp · kho kit không
phải git → `moc` và `n` là `null`, không cờ · bản sao trọn `scripts/` + `lib/` chưa phá cho
đúng kết quả ca hai vòng, gỡ đúng một chỗ đếm thì ca ấy đỏ gọi tên `n` và cờ.

**VÀ thẻ in đúng.** Hội đồng đọc khối `START-VONG-META` của thân lệnh: chỉ in khi kho là kho
kit; in số kèm tên từng hồ sơ; cờ là một câu, không cổng, không lệnh, máy không chọn hộ;
«chưa biết» không in thành 0.

### AC-10 (hồi quy) — bốn suite và bản đồ sản phẩm

**Given** cây tại HEAD
**When** chạy bốn suite của kho cùng `product-map --check`
**Then** cả năm lệnh exit 0. Ca đang ghim bộ quét (ma trận phân ô P105, bảng chữ BDK2,
round-trip khoá P99, RT13) xanh mà KHÔNG nới: P99 thấy năm khoá `metaOpen` ở cả đầu ra thật
lẫn khối khai của thân lệnh.

### AC-11 (judgment) — bốn khối Notes đủ mặt, năm dòng số có nguồn, điều bất lợi nói thẳng

**Given** khối `## Notes` của hợp đồng này
**When** hội đồng đọc nó cùng BỐN nguồn: finding quan sát R1 · finding truy nguyên phiên crm
· finding bối cảnh trước và sau R · hợp đồng mốc 2.14.0
**Then** đủ bốn khối (năm dòng số · lớp vendored · lớp lỗi tái phát · nhát cắt cho cửa sổ
kế); bảng năm dòng có BỐN CỘT (vòng sản phẩm R1 · phiên crm · vòng meta đã ký · ba việc
chip);
mỗi ô có nguồn rút gọi tên hoặc ghi «không đo được» kèm lý do; dòng 2 tách trong/ngoài
thiết kế và gọi tên lớp hạ tầng; và NĂM phép đối chiếu dưới đây khớp từng chữ số.

**Năm phép đối chiếu, liệt kê ĐÓNG.** (i) dòng 4 của R1 — ba số token từng lượt trọn và
tổng S4 — so §5 của finding R1 · (ii) dòng 4b của R1 — tỉ lệ tìm-lỗi ba lượt, tỉ lệ gộp, và
tỉ lệ làn `ui` lượt cuối — so bảng §3 của finding R1 · (iii) dòng 2 của R1 so dòng «Tổng»
§4 của finding R1 · (iv) dòng 2 của phiên crm so bảng §1 của finding truy nguyên · (v) số
145,93 M của vòng meta nặng nhất 2.14 so dòng 4 Notes §1 của hợp đồng mốc 2.14.0, và câu giải
thích vì sao finding bối cảnh ghi 142 M so 146 M là hai nền. Hồ sơ gốc
của R1 và phiên crm nằm ở hai repo tiêu thụ, không nằm trong kho này; nên phép đối chiếu
máy là với NHÂN CHỨNG đã đọc chúng, và hồ sơ nói thẳng thế.

**Và nói thẳng tám điều bất lợi:** hiệu lực của khuôn `/goal` mới không đo được trước khi ship · cửa sổ «0 vòng meta mới» có một vòng meta đã ký trước R
mà hai tài liệu tổng kết bỏ sót · token một vòng sản phẩm KHÔNG rẻ hơn vòng meta nặng nhất
của 2.14 · lượt gọi người vượt trần bốn vòng liền, qua ba cửa sổ · tìm-lỗi rơi về 9,5 % nhưng làn
`ui` chiếm 91 % lượt cuối · việc meta của cửa sổ không có số token nào · ngưỡng mở lại của luật (a) đã
chạm · router trượt lần thứ tư. Che bất kỳ điều nào là FAIL. §4 phải gọi tên đủ năm nhát
cắt owner dịch 17/09 và định đoạt hai mục T1 của R2 kèm lý do.

### AC-13 (khuôn `/goal`) — hook nhận hai lần dừng hợp lệ là hoàn thành, vẫn chặn lần dừng lười

**Given** khuôn `GOAL-TEMPLATE` ở ba bản chép, và bốn mẫu lần dừng trong `mau-goal/`: hai mẫu
hợp lệ rút gọn từ hai lần dừng thật của R1 (dừng trước S4 chờ người gỡ tiền đề `uv` · dừng giữa
S4 ở trần nhát sửa thước chờ người chọn một trong ba lối), hai mẫu tự dừng viết tay
**When** chạy `rang-goal.mjs --chan khuon-goal`, ca `gate-card-goal` và ca thường trực P85; và hội
đồng đọc khuôn mới, khuôn cũ cùng bốn mẫu
**Then** máy: ba bản chép khớp, đúng 6 dòng, thẻ Cổng 1 in đúng dòng rút từ SKILL; khuôn ở cây
KHÁC khuôn ở lần cắt số trước; tệp khuôn cũ bằng khuôn rút từ kho. Hội đồng: khuôn mới đặt hai lần
dừng hợp lệ vào ĐÚNG vế «chờ input người», nói rõ vế ấy gồm cả dừng GIỮA vòng, trước hoặc trong
S4; điều kiện hẹp — máy phải nêu đích danh tiền đề chỉ người gỡ được, hoặc nêu các lối để người
chọn; có câu nói thẳng dừng không nêu tiền đề hay lối nào là CHƯA hoàn thành; và không nới thêm lối
dừng nào khác, không nhắm tới `signed-off`.

**Giới hạn của tiêu chí này, khai thẳng:** hiệu lực thật — hook THẬT có thôi chặn hay không —
không đo được trước khi ship. Lúc dựng hồ sơ, một bộ chấm dựng lại (model nhỏ, hai kiểu đầu vào:
tin nhắn trần · kèm ngữ cảnh vòng và lệnh đọc chặt) cho **cùng phán quyết với khuôn cũ và khuôn
mới ở cả 16 lượt chấm**: hai mẫu hợp lệ qua, hai mẫu lười bị chặn, ở cả hai khuôn. Tức nó không tái
hiện được chiều đỏ mà hook thật đã gây ra 11 lần ở R1, và một cặp ca «gỡ vế mới thì đỏ» dựng trên
nó là thước giả. Căn cứ của nhát sửa là lý do hook thật tự ghi: «dừng giữa vòng lặp S4 … không phải
escalation ở tầng feature-loop». Ngưỡng đang đếm: **≥ 1 lần hook chặn một lần dừng có nêu tiền đề
hoặc lối** ở vòng sản phẩm đầu tiên chạy trên 2.15.0 → mở lại.

### AC-12 (sự thật của cửa sổ) — hai lời khai về cửa sổ suy từ kho, không chép tay

**Given** cây làm việc và lần cắt số trước suy từ kho (commit mới nhất đổi dòng version mà
số tại đó khác số ở cây)
**When** chạy `rang-cua-so.mjs --chan vendored` và `rang-cua-so.mjs --chan viec-meta`
**Then** (a) chín tệp của khối chép `INIT-CI-COPY-LIST` không đổi một dòng kể từ lần cắt số
trước, trên một cửa sổ toàn kho KHÔNG rỗng; (b) tập hồ sơ vòng có `contract.md` không có ở
lần cắt số trước, trừ hồ sơ mốc, BẰNG khối `VIEC-META-CUA-SO` của hợp đồng — thiếu hay thừa
đều đỏ, gọi tên; đối chứng dương: chính hồ sơ mốc này phải được thấy là sinh sau neo; và bộ
quét mở phiên chạy trên cây thật nhận kho kit, đếm được `n`. Việc chỉ có commit, không mở hồ
sơ, vô hình với vế (b) — khai ở Known limits.

## Coverage

Mốc phát hành là bài liệt-kê-đủ theo BỀ MẶT người dùng đọc số và theo VIỆC đã vào cửa sổ,
không theo tổ hợp.

- **Trục bề mặt số** `[thước CE: ca P200 trong tests/plugins/run-tests.sh]`: manifest gói một
  · manifest gói hai · số dẫn xuất trong GUIDE · mục mô tả của chính số đó · cặp phụ thuộc
  feature-loop tự khai · số tăng so với lúc hồ sơ ra đời. → AC-1.
- **Trục gói** `[thước CE: ba manifest có thật trong kho]`: hai gói lên số · gói thứ ba giữ
  số. → AC-1, AC-2.
- **Trục việc-đã-vào-cửa-sổ** `[thước CE: bảng Context — bốn việc owner gọi tên, liệt kê
  đóng, và tập hồ sơ vòng đối chiếu bằng máy ở AC-12]`: start-scan vật-đã-ở-nhánh-gốc →
  AC-3, AC-4, AC-5, AC-6 · răng chụp hồ sơ → AC-7 · veto một nguồn → AC-8 · hạt giống vòng
  meta → AC-9 · khuôn `/goal` → AC-13 · vòng đã ký `guide-chep-ci-buoc-vao-writer` → có hồ sơ và chữ ký riêng, mốc chỉ
  khai và đếm nó (AC-11, AC-12).
- **Trục của nhát vá start-scan** `[thước CE: ca thật crm-onehub 16/09 + ba lối thoát của
  merge-base]`: tệp bằng chứng vắng · tên chuẩn · tên đổi `xep-lai` × commit tổ tiên ·
  nhánh không merge · không có trong kho × approved có kế hoạch · chưa kế hoạch ·
  implemented. → AC-3, AC-4. Tổ hợp không đo, khai thẳng: tệp bằng chứng đọc không được với
  hồ sơ `approved` (P105 ghim ở kho không phải git) · hai tệp bằng chứng cùng lúc, một tổ
  tiên một không — vòng lặp dừng ở tệp tổ tiên đầu tiên.
- **Trục của răng chụp hồ sơ** `[thước CE: bốn kiểu chạm soChup trả về + hai loại hồ sơ đã
  thông cổng]`: đổi nội dung · ghi lại cùng byte · thêm · xoá × người ký · máy thông, cộng
  chiều im trên cây thật. → AC-7. Kiểu «xoá» không có ca riêng — khai thẳng.
- **Trục của hạt giống** `[thước CE: bốn điều kiện của phép đếm]`: có phải kho kit · hồ sơ
  có ở mốc · trạng thái đã thông cổng · có phải hồ sơ mốc; cộng «chưa biết». → AC-9.
- **Trục việc-của-mốc** `[thước CE: luật re-pin-theo-release và luật (c)]`: hồi quy · bốn khối
  Notes · hai lời khai về cửa sổ. → AC-10, AC-11, AC-12.

## Out of scope

- **Chiến dịch ghim lại** — R3: KHÔNG chạy ở dạng hiện tại. Hồ sơ tụt pin giữa hai mốc là
  sử liệu chấp nhận được (CLAUDE.md §re-pin); lượt ĐO của mốc 2.14.0 đã chứng làn chỉ sinh
  ra một làn đỏ không ghi được dòng nào. Điều kiện tồn tại của chiến dịch là «ghim lại
  theo diff», vẫn chưa làm.
- **Mở vòng `thuoc-co-cua`** — là vòng meta của cửa sổ 2.15 → 2.16 (Notes §4), không phải
  của mốc này.
- **Trạng thái xếp lại cho vòng** (`park`). Lối «đóng theo quan sát» của AC-3 chưa có trạng
  thái hợp đồng để ghi: người ghi quyết định vào sổ xong thì bộ quét VẪN đọc `approved`.
  Lỗ đã có tên ở mục ngoài phạm vi của ô `_acceptance/thuoc-co-cua/opportunity.md`; không
  mở ô thứ hai.
- **Vòng lặp tính năng tự nhận ra vật đã merge.** Chặn chỉ đặt ở thẻ mở phiên.
- **Vòng S4 và CI chụp cây hồ sơ.** Chỉ làn ghim lại chụp; gọi tên ở Notes §4.
- **Bản đồ sản phẩm.** Không đổi: khoá `vat-da-o-nhanh-goc` chiếu về cùng ô «đang dựng»;
  khoá `metaOpen` không phải ô.
- **Hai mục T1 của R2** — định đoạt ở Notes §4, không làm trong mốc.
- Dựng phép đo mới cho chính phép đo của mốc — luật (a).

## Notes

### Known limits

- **Phép hỏi tổ tiên so với HEAD của cây đang quét**, không với nhánh gốc có tên. Chạy thẻ
  trên một nhánh tính năng đã chứa commit ấy cũng cho nhóm «vật đã ở nhánh gốc».
- **Dòng đếm vòng meta nhận hồ sơ mốc theo tên** `release-<x>-<y>-<z>`. Hồ sơ mốc đặt tên
  khác sẽ bị đếm là một vòng meta. Ngưỡng đang đếm: ≥ 1 lần cờ bật sai vì tên giữa hai mốc.
- **Dòng đếm vòng meta nhận kho kit theo tên manifest** `acceptance-gate` ở gốc. Một fork
  đổi tên plugin sẽ không thấy dòng này.
- **Khuôn `/goal` mới chưa có bằng chứng hiệu lực** — xem giới hạn khai ở AC-13; ngưỡng mở lại
  đang đếm ở đó. Mẫu hợp lệ rút gọn và gỡ chi tiết sản phẩm, nên đầu vào hội đồng không phải
  transcript nguyên văn.
- **Tiêu chí AC-13 thêm SAU phản biện context sạch** — không qua lượt phản biện nào; lượt chấm S4
  là lượt soi đầu tiên của nó.
- **Việc meta không mở hồ sơ vô hình với mọi phép đếm máy** — cả dòng thẻ mở phiên lẫn vế
  (b) của AC-12. Hai trong ba việc chip của cửa sổ này có đúng hình dạng đó. Ngưỡng đang đếm:
  ≥ 1 việc chạm engine lên nhánh gốc không qua hồ sơ nào giữa hai mốc — cửa sổ này đã 2.
- **Chiều im của răng chụp hồ sơ tốn một lượt chạy trọn các suite** trong worktree riêng,
  ngoài lượt chạy suite của chính S4. Tốn phút máy một lần ở lượt chấm mốc này, không lặp ở
  vòng nào khác.

### 1. Năm dòng số của luật (c) — lần đầu có cột từ repo tiêu thụ

Bốn cột, đếm cùng luật. Cột một là vòng sản phẩm R1 đã ký. Cột hai là phiên crm 16/09 —
không phải một vòng trọn, mà là ca chẩn đoán sinh ra ô `thuoc-co-cua` và hai chip đầu. Cột
ba là vòng meta đã ký của cửa sổ. Cột bốn là ba việc chip, đếm từ sổ và git của kho kit.

| Dòng | R1 `skill-system-v1` (OneFlow, T3) | phiên `cua-vao-noi-tieng-viet` (crm-onehub, T2) | vòng meta `guide-chep-ci-buoc-vao-writer` (kho kit, T2) | ba việc chip (kho kit) | Nguồn rút |
|---|---|---|---|---|---|
| 1 làm-xong → quyết-được | **5 h 49**: `implemented` 16/09 19:55 → chữ ký Cổng Bằng chứng 17/09 01:45 (+07); trong đó **3 h 49** chờ ở một lượt gọi hạ tầng | **không đo được** — vòng không tới Cổng Bằng chứng; phiên kéo **8 h 25** và kết ở việc duyệt lại Cổng Phạm vi | **17 phút**: dòng eval đầu của lượt 1 (16/09 02:00Z) → commit chữ ký 09:17 (+07) | start-scan: đóng ở chữ ký mốc này · răng chụp hồ sơ: **không có khoảnh khắc quyết** — lên main không qua cổng nào · veto: **2 h 05** từ commit khai gạch tới commit veto | R1: giờ tác giả của `cca41a6` · `51b7112` ở OneFlow, finding R1 §4 mục e · crm: finding truy nguyên §1 · vòng meta: `run-log.jsonl` của nó và commit `b0aaa515` · chip: git `9ddcd021` → `bcd0f166` |
| 2 lượt gọi người | **8** so trần T3 **4**: 7 đã xảy ra lúc nhân chứng đo + 1 chữ ký sau đó. Trong thiết kế **3** (Phạm vi · 1.5 · Bằng chứng) · ngoài thiết kế **5**, trong đó **hạ tầng 4** (API chết · agent treo · `uv` · tranh tài nguyên làn chấm) và phạm vi đo 1. Chạm: trong 2 · ngoài 10 — chạm của lượt ký không đếm được. **Cộng một lượt máy tiêu vô ích không tính là lượt gọi người:** hook `/goal` chặn **11** lần dừng hợp lệ — 2 ở ca chờ `uv`, 9 ở ca trần nhát sửa thước, trong đó máy trả lời lại cùng một câu **7** lượt | **9** = **hạ tầng 4** · phạm vi đo 4 · Cổng Phạm vi 1; tức trong thiết kế 1 · ngoài 8. Chạm không đếm | sàn **2** đếm từ sổ: Bằng chứng (trong thiết kế) · chọn tách commit sau khi cổng T1 đỏ (ngoài thiết kế); Phạm vi đi làn V | sàn **3** đếm từ sổ, không từ transcript: phê CỘNG start-scan · chọn giữ nhánh tới lượt chấm mốc · veto lối khai gạch. Mức cửa sổ, ghi riêng: R (16/09) · câu trả lời Q1–Q3 (17/09) | R1: finding R1 §4 dòng «Tổng» cộng commit `51b7112`; số lần hook chặn đếm từ transcript phiên R1 (dòng «Stop hook feedback»: 12:56:32Z và 12:56:50Z · chín dòng 13:50:18Z–13:51:29Z) — finding R1 ghi 9, finding bối cảnh ghi «bảy», cả hai đúng một phần · crm: finding truy nguyên §1 · vòng meta: `decisions.jsonl` của nó, dòng 1 · chip: `decisions.jsonl` của hồ sơ này và của `ra-co-ten-lam-va-trao` |
| 3 lượt chấm bị hạ tầng đốt | **2 / 3** lượt trọn — lượt 1 (`uv` vắng · ô `not-run` vẫn bị thi hành) · lượt 3 (E14 dưới tải · hai lượt cùng ghi bản dựng); cộng **1** lượt huỷ vì args soạn tay | **0 / 3** lượt BLOCKED; cả ba lượt đỏ vì THƯỚC của repo, không vì vật; cộng 1 lượt chấm tuần tự tự ứng biến rồi vứt; phép đo ghi đè hồ sơ đã ký, khôi phục tay **3** lần | **0 / 1** — lượt 1 PASS | **0** lượt chấm S4 (start-scan chờ lượt mốc; hai việc kia không hồ sơ) · **2** làn ghim lại riêng cho hồ sơ đã ký bị chạm (`7ebfe3de` · `3ad5608e`) | R1: finding R1 §5 · crm: commit `53d6b8f` · `9f9d042` ở crm và finding truy nguyên §2 · vòng meta: commit `22f89822` · chip: git kho kit |
| 4 token máy | lượt 1 **42,83 M** · lượt 2 **34,82 M** · lượt 3 **69,43 M** · huỷ 0,69 M · **S4 gộp 147,77 M** (36,9 M/lượt trọn). Lượt cho verdict là lượt chạy lại hạ tầng không có `wf-usage` → **không đo được** | **không đo được** — không `wf-usage`. Đếm theo loại từ transcript: cache-read 179,2 M · tạo cache 4,4 M · ra 0,34 M | **không đo được** — hồ sơ không có `usage-report.md` | **không đo được** — phiên chip không có `wf-usage` | R1: finding R1 §5, NỀN per-model có cache_create như mốc 2.14.0; phiên này đã cộng lại `usage-report.md` của OneFlow và khớp từng lượt · crm: finding truy nguyên §1 |
| 4b ba khối | tìm-lỗi lượt 1 **20,2 %** · lượt 2 **10,0 %** · lượt 3 **2,7 %** · gộp **9,5 %**; làn `ui` lượt 3 **91,2 %** | không đo được | không đo được | không đo được | finding R1 §3, NỀN bảng vai trò (không cache_create), ánh xạ như mốc 2.14.0; `ui` và `judge` xếp vào chứng-minh-vật |
| 5 phút máy/lượt chấm | **23,3 · 21,6 · 30,0**; S4 gộp **75,0**; đường găng cả ba lượt là làn `ui` | không đo được | không đo được — sổ chạy không ghi thời lượng | làn ghim lại `3ad5608e`: hai suite nặng **371 s + 416 s**; làn `7ebfe3de` không ghi thời gian | R1: finding R1 §5 · chip: thông điệp commit `3ad5608e` |

**Hai con số khác với finding bối cảnh, và vì sao.** Finding ấy viết «S4 142 M» cho R1 và so
với «146 M» của vòng meta nặng nhất 2.14. Hai số đó ở HAI NỀN: 142,27 M là nền bảng vai trò,
không có cache_create; 145,93 M của vòng `chu-ky-khong-tu-lam-hoa-cu` là nền per-model có
cache_create (`_acceptance/release-2-14-0/contract.md` Notes §1 dòng 4). Cùng nền per-model thì
R1 là **147,77 M so 145,93 M** — R1 đắt hơn, không rẻ hơn. Finding ấy cũng ghi chuỗi lượt gọi
người kết thúc ở 7, vì nhân chứng đo trước khi Cổng Bằng chứng ký; sau chữ ký là 8.

**Điều số nói, kể cả khi bất lợi.**

- **Cửa sổ «0 vòng meta mới» có một vòng meta.** Nó ký trước R nên không trái quyết định R,
  và cửa sổ ở đúng trần luật (b). Nhưng hai tài liệu tổng kết cửa sổ — finding bối cảnh và
  bản đầu hồ sơ này — đều không thấy nó; chỉ phép đếm theo kho thấy.
- **Token một vòng sản phẩm KHÔNG rẻ hơn vòng meta.** 147,77 M cho R1, so 145,93 M của vòng
  meta nặng nhất cửa sổ 2.13 → 2.14 trên cùng nền. Cửa sổ này không có bằng chứng nào cho
  thấy chi phí một vòng đã giảm.
- **Tìm-lỗi đã rơi, nhưng tiền không biến mất — nó dời sang làn `ui`.** 9,5 % gộp so lời hứa
  46 % của spec token, và tuyệt đối lượt 1 là 8,30 M. Nhưng làn `ui` phình 67,7 → 71,5 →
  91,2 %; riêng một eval giao diện ở lượt 3 tốn 40,3 M cache-read. Chỗ cắt kế là ở đó.
- **Lượt gọi người vượt trần bốn vòng liền, qua ba cửa sổ:** 4 · 5 · 5 · 8. Lớp hạ tầng là lớp lớn
  nhất ở cả hai repo tiêu thụ — 4/9 ở crm, 4/8 ở OneFlow. Cả hai cổng trong thiết kế của R1
  chỉ tốn một chạm; và Cổng 1.5 được «duyệt» bằng dán một dòng hai giây sau khi kế hoạch
  trình — một trạm thu phí, không phải điểm quyết định.
- **Việc meta của cửa sổ không có số token nào.** Vòng đã ký không có `usage-report.md`; phiên
  chip không chạy `wf-usage`. Dòng 4 của cửa sổ thiếu đúng phần mà luật (b) cần soi. Hạt giống
  AC-9 đếm SỐ vòng, không đếm chi phí.
- **Ngưỡng mở lại của luật (a) đã chạm:** ≥ 2 lượt chấm sai do phép đo tự dối trên vòng sản
  phẩm giữa hai mốc — `cua-vao` (sàn thiết kế báo P0 giả trên nền tối · thẻ cổng đếm mã thoát
  đã khai thành trượt) và R1 (ô khai `not-run` vẫn bị thi hành).
- **Router trượt lần thứ tư.** Owner chấp nhận (Q3 17/09); §4 ghi nó là mặc định của cửa sổ
  2.16 → 2.17 để hàng đợi không thành lời hứa suông.

**Dự báo năm dòng cho chính thay đổi của mốc này.**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không chạm đường vòng lặp |
| 2 | ↓ ở repo có hồ sơ xếp lại · = ở kho kit | thẻ thôi mời chấm lại vật đã merge; cờ vòng meta là một dòng đọc, không phải câu hỏi |
| 3 | ↓ lâu dài · ↑ tạm ở repo còn phép đo ghi sai chỗ | ghi đè hồ sơ đã ký dừng có tên thay vì khôi phục tay; crm đỏ cho tới khi dời đích ghi |
| 4 | = | không chạm S4 |
| 5 | = mọi vòng · ↑ một lần ở lượt chấm mốc này | chụp 70 hồ sơ mất vài giây; chiều im AC-7 chạy thêm trọn các suite một lần |

Điều kiện tin cậy: (i) đường verdict — finder, bác bỏ trong hợp đồng, REJECT — KHÔNG đổi
thành phần; mốc này không chạm workflow chấm. (ii) Số lượt chấm sai giữa hai mốc: ngưỡng (a)
đã chạm, nên dòng 4–5 của cửa sổ kế KHÔNG được cắt dựa trên số của mốc này.

### 2. Lớp vendored — KHÔNG tệp nào đổi

Chín tệp của khối chép `INIT-CI-COPY-LIST` trong `commands/acceptance-init.md` so với lần cắt
số trước: không đổi một dòng — răng AC-12 chân `vendored` đo, không chép tay. Repo tiêu thụ
không phải chép lại gì ở mốc này. Riêng GUIDE §5.3 nay khai đủ chín tệp (commit T1 16/09), và
vòng `guide-chep-ci-buoc-vao-writer` buộc hai bản khai ấy vào writer bằng một phép đo.

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

**Lớp một — hạ tầng là lớp gọi người lớn nhất, ở cả hai repo tiêu thụ.** 4/9 ở crm, 4/8 ở
OneFlow. Ở R1, dry-run tiền đề bắt được 2 tường trước Cổng Phạm vi nhưng không có bước gỡ
trước S4, nên `uv` vẫn làm BLOCKED lượt 1 và lộ thêm lớp Python 3.9 ở lượt 2.

**Lớp hai — phép đo chạm sử liệu đã ký, hai lần trong một ngày.** Ở crm, một phép đo ghi đè
bằng chứng của hồ sơ đã ký sau mỗi lượt chạy. Ở kho kit, chính nhát chữa lớp ấy lại chạm
một hồ sơ đã ký — khai gạch hai tệp trong khối của `ra-co-ten-lam-va-trao` — kéo theo hai
làn ghim lại riêng, rồi owner veto. Răng chụp hồ sơ nay giữ lớp này ở làn ghim lại; S4 và
CI chưa giữ.

**Lớp ba — thước không có cửa.** Phiên crm: 9 chỗ hỏng thước so 1 chỗ hỏng vật, 701 dòng
thước so 20 dòng vật. R1: 3 nhát «thước:» theo tiền tố, 5 theo tệp chạm, trần dừng nổ đúng
một lần. Sổ không phân biệt nhát sửa thước với nhát sửa vật.

**Lớp bốn — lời khai rộng hơn phép đo, bắt ngay trong mốc này.** Bản đầu của răng một
nguồn khai «hai tệp của răng chụp hồ sơ không gõ tay trạng thái nào». Lần chạy đầu đỏ mã 6:
tệp ca vẫn gõ tay tên trạng thái máy-thông. Veto chỉ chốt hai điều hẹp hơn — module không
chép mảng, và không tệp nào chứa chuỗi RT13 quét. Răng đã thu hẹp về đúng hai điều ấy.

**Lớp năm — «mỗi phiên tự thấy mình nhỏ», và tổng kết bằng trí nhớ.** Ba việc meta vào cửa
sổ qua ba chip, hai trong số đó không có hồ sơ riêng, đúng hình dạng chẩn đoán số hai của R.
Vòng meta đã ký trước R thì có hồ sơ đầy đủ, vậy mà finding bối cảnh và bản đầu hồ sơ này vẫn
kể cửa sổ bằng trí nhớ phiên và bỏ sót nó. Phản biện context sạch chỉ ra lời khai không có
thước; răng AC-12 đếm theo kho và lộ vòng ấy. Hạt giống AC-9 và vế (b) của AC-12 đếm được vòng
có hồ sơ; việc không mở hồ sơ vẫn vô hình với cả hai.

### 4. Nhát cắt cho cửa sổ kế — gọi tên

1. **Vòng meta của cửa sổ 2.15 → 2.16 là `thuoc-co-cua` thu hẹp** (owner Q1 17/09):
   ① tiền đề tách khỏi tiêu chí, dry-run trước Cổng Phạm vi, **kèm bước gỡ tường trước khi
   mời chấm** · ② cửa cho thước — sổ gắn đích thước / vật / hồ sơ suy từ đường dẫn, một
   dòng đếm trong gói Cổng Bằng chứng, trần gộp nhát sửa thước ở `implemented` với ba lối,
   lối «mở vòng có chủ ngữ là thước» là một lệnh · ④ khuôn đường đo cấp repo — cờ chạy,
   mã 2 khi hỏng tiền đề, đặt/trả, DB của lượt, máy chủ tự xưng cây và SHA; code thuộc
   repo. Không router, không vòng token. Lưu ý: ② là một phép đếm trên lớp thước, thứ luật
   (a) vốn đóng — ngưỡng mở lại đã chạm (§1), nên nó hợp lệ ở cửa sổ kế.
2. **Router là vòng meta mặc định của cửa sổ 2.16 → 2.17, chỉ lùi nếu vòng sản phẩm kế cho
   số khác** (owner Q3 17/09). Công thức 4b của R đã trả lời xong câu của nó và **bỏ** — không
   dùng lại để chọn vòng.
3. **Chỗ cắt gọi tên: làn `ui`.** 91,2 % token lượt cuối của R1; đường găng cả ba lượt. Chưa
   đề bài, chưa hồ sơ.
4. **Trạng thái `park` cho vòng.** Nguyên thuỷ thiếu: kit chỉ có xếp lại cho ô, nên hồ sơ
   phải nói dối `approved` để cổng thôi chấm — mắt xích đầu của ca crm 16/09, và lý do lối
   «đóng theo quan sát» của AC-3 chưa có chỗ ghi. Đã có tên ở mục ngoài phạm vi của ô
   `thuoc-co-cua`.
5. **Giới hạn của răng chụp hồ sơ: S4 và CI chưa chụp cây.** Một phép đo ghi đè hồ sơ đã ký
   trong lượt chấm S4 hoặc trên CI vẫn im, chỉ lộ ở lượt ghim lại kế.
6. **R2 #2 — `wf-usage` kêu khi không chạy: KHÔNG làm trong mốc, ghi ở đây.** Chỗ kêu gọn nhất
   là bộ sinh args S4 đếm tiêu đề «S4 round N» trong `usage-report.md`. Nhưng tiêu đề ấy do
   bên VIẾT nhận tự do từ người gõ, còn bên ĐỌC khớp cứng khuôn — chính seam mà ô
   `mot-nguon-usage-report` đang giữ ở discovery. Làm ở đây là dựng thêm một bên đọc thứ ba
   cho seam chưa một nguồn, rồi ô kia phải sửa ba chỗ. Và R1 cho thấy lỗ thật lớn hơn: lượt
   cho verdict là lượt chạy lại hạ tầng ngoài Workflow, nên đếm tiêu đề cũng không kêu.
7. **R2 #3 — lệnh cổng in dòng trần: KHÔNG làm trong mốc, ghi ở đây.** Máy đã in dòng trần:
   thẻ dựng dòng lệnh từ một nguồn `ONE-SHOT-CMD` và không chỗ nào của kit bọc `claude "…"`.
   Lỗi nằm ở lớp model trình bày lời mời, nơi không có vật máy giữ; sửa bằng một câu dặn
   là «dặn-bằng-lời làm nghiệm», thứ north star cấm. Cần một răng ở tầng trình bày trước.
8. **Đếm token cho việc meta ngoài Workflow.** Ba việc của cửa sổ không có số vì phiên chip
   không có `wf-usage`; luật (b) cần đúng số đó.
9. **Đo hiệu lực khuôn `/goal` ở vòng sản phẩm kế** — ngưỡng ở AC-13. Nếu hook vẫn chặn, nhát sửa
   bằng chữ đã hết đường; lối kế là một vật máy giữ (trạng thái dừng ghi vào hồ sơ để hook đọc).
10. **Chiến dịch ghim lại** — R3 giữ nguyên: không chạy dạng hiện tại, điều kiện tồn tại là
   «ghim lại theo diff».

- Thước tự dối: không dán cụm hình glob vào văn hồ sơ; mọi mẫu ở đây nói bằng chữ.
