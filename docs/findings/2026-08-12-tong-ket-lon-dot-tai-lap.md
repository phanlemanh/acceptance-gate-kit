# TỔNG KẾT LỚN — đợt tái lập kit (08 → 12/08/2026)

*Nghi thức tổng kết toàn diện, owner yêu cầu 12/08 làm tài liệu nền cho phiên
retro/reflect. Soạn: phiên điều phối B.*

**Cách làm — để người đọc biết tin được tới đâu:** 31 lượt agent chạy trong hai
lượt workflow (~5,6 triệu token, ~1 346 lượt gọi công cụ). Sáu nguồn được khai
quật ĐỘC LẬP (pháp y git · sổ vấp · văn bản nền · delta engine · phía sản phẩm ·
chi phí người), **mỗi nguồn có một agent hoài nghi riêng kiểm lại từng con số
bằng lệnh thật**, rồi bốn bài phân tích chéo và một critic tự đi đo lại. Mọi số
dưới đây đo trên vật; chỗ nào không đo được thì ghi rõ là không đo được.

**Báo cáo này thay thế `docs/findings/2026-08-11-bao-cao-ket-qua-dot-tai-lap.md`**
— bản đó đúng về hướng nhưng **sai ở 5 chỗ đếm được**, liệt kê ở §9.

Chốt trạng thái: kit `origin/main = 2a7aec6`, **acceptance-gate 1.40.0** /
feature-loop 1.27.1 / design-loop 0.3.0 · consumer floorplanstudio `6ea25c9`.

---

## 1 · Bài toán khi mở đợt

Đến 09/08 hệ ở đáy: toàn bộ việc là **kit-sửa-kit**; owner tự nhận điền đại
`time_human_minutes` cho qua cổng; bản 1.27.2 chết vì chính lưới đo của nó nuốt
mã thoát. Owner tuyên **tạm nghỉ toàn bộ** — và đó là quyết định rẻ nhất, đúng
nhất của cả đợt, vì nó ép trả lời câu hỏi gốc: *giá trị thật nằm ở đâu?*

Kết quả là **Kim chỉ nam** (nay đứng đầu `CLAUDE.md`): giá trị duy nhất là sản
phẩm đến tay người dùng · kit là công cụ hỗ trợ Claude, không phải giám sát ·
**giờ-kit là CHI PHÍ** · rẻ-và-nhanh thì làm, không thì bỏ — trừ lõi ba món
không nhượng: **chữ ký người · không bịa bằng chứng · đường đảo rẻ**.

---

## 2 · Bức tranh số (đo trên vật)

| Đại lượng | Số |
|---|---|
| Commit vào main kit | **121** (15 · 24 · 39 · 42 · 1 theo ngày 08→12) |
| Trong đó **đẩy thẳng lên main, không qua PR** | **63** |
| PR merged | 6 (#38–#43), **1 bị squash** (#42) |
| Bump phiên bản | 1.39.0 → 1.39.1 (08/08) → 1.39.2 (10/08) → **1.40.0** (merge 12/08 06:52) |
| Chữ ký người | 6 lượt Cổng 1 · **7 lượt Cổng 2** (một hồ sơ phải ký hai lần) |
| Re-pin | 5 làn ở kit + 8 lượt ở consumer = **13** |
| CI main đỏ | **4 lần liên tiếp, 9 giờ 18 phút** |
| Sổ vấp | **73 dòng** (15 · 30 · 17 · 11), **12 dòng chặn-việc** (16,4%) |
| Commit sinh trong đợt **không bao giờ vào main** | **69** (≈57% khối lượng so với công vào main) |

**Nhịp so với tuần trước đợt** (đối chứng mà chưa bài nào từng lấy):

| | 7 ngày trước (01→07/08) | 4 ngày đợt |
|---|---|---|
| Commit vào main | 374 (~53/ngày) | 121 (~30/ngày) |
| Tỉ lệ commit chạm engine | **34,5%** | **10,4%** |

→ **Đợt TRỪ được TỐC ĐỘ và TRỪ đúng chỗ** (chạm engine giảm 3,3 lần), **nhưng
không TRỪ được KHỐI LƯỢNG**: bề mặt chỉ dẫn cộng ròng **+690 dòng**. Phép thử
"toàn subtraction" của charter: một nửa đạt.

---

## 3 · Cái đợt giao được

### 3.1 · Phía sản phẩm — GĐ2, 3 feature thật ở floorplanstudio

| Feature | Kết cục | Số |
|---|---|---|
| `mcp-cost-guard` | **Merged** | 12 AC · 13 eval · 2 vòng chấm · Cổng 1→ký: **1h45** |
| `describe-scheme-perf` | **Merged** | 13 AC · 14 eval · 6 lượt chấm (3 chết vì hạ tầng) · **22h45** |
| `digitize-floorplan` | **KILL tại Cổng Giá trị** | 10 AC · 15 eval · 4 vòng · dựng **~95 phút**/16h ngân sách |

Cộng: `refine-editor` xếp lại tại Cổng Đáng (0 dòng code lãng phí) ·
`digitize-trace-v2` dừng ở cân nhắc.

**Ba phát hiện đắt nhất, đều có số:**

1. **Máy đo ĐÚNG HÌNH, không đo ĐỦ DÙNG.** digitize qua 39 test · 15 eval ·
   5 màn design · 3/3 VLM live · diện tích lệch −1,8% trong trần ±7% — rồi chết
   ở đúng một câu *"dùng được để mô phỏng cho khách: KHÔNG"*. Lỗ mà UAT lộ ra
   **không nằm trong AC nào, cũng không nằm trong Out of scope** — tức là lỗ
   trong chính bộ tiêu chí.
2. **Phép đo máy đóng góp 0 lỗi ở ván đắt nhất.** `describe-scheme-perf`: 4 lỗi
   chặn-phát-hành, **4/4 do chân chấm độc lập tìm, 0/4 do 12 phép đo máy**
   (chính `usage-report.md` của nó tự ghi). Lỗi nặng nhất: thuật toán mới CHẬM
   HƠN bản nó thay 1,7× trên đầu vào đối kháng — mọi eval vẫn xanh.
3. **Mắt người bắt lớp mọi cổng máy trượt** — 4 ca, 3/4 do owner, tất cả xảy ra
   khi mọi cổng đều xanh (overlay lệch tường · đảo trục Y · thiếu hệ cửa/lô gia ·
   đại lượng sai ngay Cổng 1).

### 3.2 · Phía kit — 2.1, năm chip

| Chip | PR | Quy mô |
|---|---|---|
| ① staleness theo diff PR (1.39.2) | #38 | 15 file, +775/−7 |
| ② khối 👉 VIỆC CỦA ANH máy-sinh | #39 | 42 file, +2264/−34 |
| ②b răng cho bộ phép đo của ② | #40 | 11 file, +740/−21 |
| ③ một-lượt-gõ + `--repo` | #41 | 30 file, +1567/−2 |
| ③b máy gánh nhận thức, người giữ quyết định | #42 | 27 file, +1796/−162 |
| (+ #43 release 1.40.0 + gỡ vết squash) | #43 | 7 file, +36/−13 |

**Số phải nhìn thẳng:** 5 chip ship **+7 142 dòng** để đổi lấy **80 dòng mã thi
hành được (1,1%)**. `git diff 8549494..2a7aec6 -- scripts/ lib/ hooks/` **rỗng**
— tức **②b, ③, ③b cộng lại đổi ĐÚNG 0 dòng mã máy** trong khi ship +4 103 dòng.
`lib/`, `hooks/`, `.github/workflows/` **0 dòng đổi cả đợt**. Tỉ lệ dòng-test /
dòng-mã trong đợt ≈ **22 : 1**.

### 3.3 · Sử liệu

16 văn bản mới trong `docs/` (+2 007 dòng) · sổ vấp 73 dòng **append-only tuyệt
đối** (39/39 commit chạm nó có 0 dòng bị xoá) · 12 quyết định lớn có ngày, người
quyết và căn cứ · nghi thức khép sử liệu thành tiền lệ.

---

## 4 · Chấm từng việc theo North Star

| Việc | Rút ngắn đường sản phẩm? | Failure mode có tỉ lệ đo được? | Lưới hay câu hỏi? | Chấm |
|---|---|---|---|---|
| DỪNG 2.0.0 (08/08) | — cắt một đợt sai | 5 vòng S4 đều REJECT | quyết định | **Rẻ nhất, đúng nhất đợt** |
| `digitize` → KILL | **Nhất đợt** — cắt hướng sai trước khi ăn một quý | 1/1: lần đầu chạy đã giết một vòng đã ký | **LƯỚI-RẺ** (ngưỡng viết trước) | **ĐÁNG NHẤT** |
| `mcp-cost-guard` | là chính sản phẩm | lộ lớp vật-chép-consumer | vật được giao | ĐÁNG |
| `describe-scheme-perf` | sản phẩm có, đường đi dài ra | 12 eval máy → 0 lỗi | nghi thức | **ĐÁNG về sản phẩm, KHÔNG ĐÁNG về nghi thức** |
| Bugfix 1.39.1 | gỡ chỗ kit tự chặn | 15 eval, baseline đỏ thật | LƯỚI | ĐÁNG — nhưng là **trả nợ kit tự tạo** |
| Chip ① | gỡ cửa chặn merge có thật | **2 lần chặn-việc ghi sổ + 13 làn re-pin** | **LƯỚI thật** | **ĐÁNG — chip tốt nhất của 2.1** |
| Chip ② | tiện nghi tại cổng | **1 ca** | nửa lưới | **KHÔNG ĐÁNG với giá 2264 dòng** — và nó tự đẻ ra lớp *mồi-dán-đồng-ý* nguy hiểm hơn cái nó chặn |
| Chip ②b | không | failure mode của phép đo | lưới bảo vệ lưới | Rẻ, nhưng giá trị bằng đúng ② |
| Chip ③ | hứa 1 dòng thay 3–4 lượt | 1 ca | **CÂU HỎI THUẦN — 0 dòng mã** | **KHÔNG ĐÁNG dưới dạng chip riêng** |
| Chip ③b | máy tự suy, thôi hỏi phút | **22 ô hỏi / 0 ô có dữ liệu — số cứng nhất nhóm** | câu hỏi + răng có hạn dùng | **Nội dung ĐÁNG, thời điểm KHÔNG** |
| Release 1.40.0 | không | 1 ca, hậu quả tối đa | lưới nằm **ngoài** repo | **KHÔNG ĐÁNG — lẽ ra không phải tồn tại** |

**Việc bỏ đi:** 69 commit không vào main. Đắt nhất là `s4-provenance/1.27.2` —
**4 lượt ký Cổng 1, 0 lượt Cổng 2, rồi vứt**, vì runner của chính kit nuốt mã
thoát. Bốn lần chi thứ đắt nhất trong hệ cho một vật bị bỏ.

---

## 5 · Chi phí người — ràng buộc số 1

**53 lượt gọi người đo cứng trong ~4 ngày (~13 lượt/ngày); ≈66 nếu tính cả thao
tác mở phiên/bấm chip.**

| Nhóm | Lượt | Tỉ lệ |
|---|---|---|
| Chữ ký / duyệt thân cổng | 21 | **40%** |
| Quyết định giá trị (ngoài lượt ký) | 16 | 30% |
| Thao tác hạ tầng (merge) | 10 | 19% |
| Làm rõ vì máy không hiểu | 6 | 11% |

→ **70% lượt gọi owner KHÔNG phải lúc owner quyết cái gì đáng làm.**

Bằng chứng cứng cho "máy hỏi thứ máy tự biết": **22 ô `time_human_minutes` được
hỏi, 0 ô có dữ liệu thật** — một trường số liệu chạy 4 ngày trên 11 hồ sơ, thu
về **0 bit**, và mỗi hồ sơ còn phải viết chú thích tự thanh minh rằng 0 nghĩa là
chưa đo. Cộng **~26 cặp tên+ngày** người phải khai tay.

**Nghịch lý trung tâm của đợt:** 5 chip làm TỪNG cổng rẻ đi nhưng làm TẦN SUẤT
gọi người tăng. Owner phát tín hiệu nguyên văn tại Cổng 2 chip ③b: *"Đây là điển
hình của quá tải nhận thức đối với tôi. Kit trở thành một chi phí lớn."*

**Vế chưa ai đo — và nó ngược:** chi phí ĐỌC của máy tại cổng **tăng 87%** (4 file
lệnh cổng: 342 → 640 dòng; bản luật ngôn ngữ mặt người 169 → 363, +115%). Chip ③/③b
**chuyển** chi phí từ người sang máy — đúng nguyên tắc *máy gánh nhận thức* — nhưng
North Star còn vế "kit làm Claude hiệu quả hơn", và trên trục đó đợt đi lùi.

---

## 6 · Luật · nếp · lưới

Đợt sinh **8 luật có răng · 12 nếp không răng · 1 lưới hạ tầng** (tắt squash-merge).

**Nhưng 5/8 luật có răng chỉ canh CHỮ, không canh HÀNH VI.** `grep -rn -- '--repo'
scripts/ lib/ hooks/` → **0 hit**: cờ `--repo`/`--as` và toàn bộ "một-lượt-gõ" là
hợp đồng chữ, do model thi hành. Răng của chúng canh *quan hệ giữa các bản chép
văn bản*, không canh việc model có tuân hay không. Đây là **trần cấu trúc**, không
phải lười — nhưng phải nói thẳng: **3/5 chip kit 2.1 ship với răng chỉ canh chữ.**

**Toàn bộ nhóm luật đắt nhất về chi phí người rơi trọn vào nhóm KHÔNG RĂNG:**
veto-default · khép sử liệu · duyệt-trước-thi-công · nội dung commit chữ ký ·
ba luật "chỉ khi rẻ" · `approvers` (config tự ghi "không được cưỡng chế").

### Lỗ nghiêm trọng nhất đợt để lại: đường rửa chữ ký

`pre-merge-check.sh:783` lấy `git log -S"human_signoff: …" | head -1` — tức
**commit MỚI NHẤT chạm chuỗi, không phải commit giới thiệu nó**. Nghi thức repair
hợp lệ (máy gỡ dòng ký → người ký lại) và nghi thức **rửa** một chữ ký sai
provenance là **cùng một chuỗi thao tác, cùng một dấu vết git**. Không phép đo nào
phân biệt được — hiện chỉ phân biệt bằng lời khai. Lỗ này nằm ngay trên lõi bất
khả nhượng *chữ ký người*.

### Ba lỗ hạ tầng còn mở

1. `rebase: true` vẫn bật — rebase giữ hạt nhưng **đổi SHA**, đã sinh phantom pin
   đúng 1 lần trong đợt. Lưới mới bịt đường đã vấp, không bịt đường cùng họ.
2. `main` **không có branch protection** (`gh api …/protection` → 404) — 63 commit
   đẩy thẳng, và răng T1-escape chỉ chạy `if: pull_request` nên đường đẩy thẳng đi
   vòng qua nó.
3. Doc onboarding **0 chữ "squash"** — dự báo của chính sổ vấp chưa thi hành.

---

## 7 · Lớp lỗi: cái gì lặp, cái gì đóng

| Lớp | Số lần lặp | Chữa bằng |
|---|---|---|
| Máy viết artifact theo **Ý** thay vì theo **KHUÔN** cưỡng chế | **4 lần / 3 ngày** | nếp |
| Cổng tự làm mình đỏ bằng PRODUCT-MAP vòng này đẻ ra | 3 lần | nếp |
| Subagent chấm đụng cây thật / dò cơ chế vượt cổng | 3 lần | nếp (harness bắt, không cổng nào bắt) |
| Đề bài mơ hồ của phiên điều phối | 5 dòng | nếp |
| Bằng chứng-đã-ký-hoá-cũ (staleness) | 6 dòng, 3 chặn-việc | **LƯỚI (chip ①)** |

**Kết luận mạnh nhất của đợt, và nó là bằng chứng dương:** *không lớp nào lặp lại
sau khi được cấp LƯỚI.* Bốn lớp lặp nhiều nhất đều nằm trọn trong nhóm chữa-bằng-
NẾP — và **5 chip vừa rồi không cấp lưới cho lớp nào trong bốn lớp đó.**

Sáu lớp MỚI sinh trong đợt: staleness-liên-tính-năng · proto≡product/bỏ-S1-D ·
doer-tự-chấm-khớp-mắt · call-frequency-fatigue · veto-default · squash-merge-xoá-
hạt-commit.

---

## 8 · Ba hành vi mới đã thành phản xạ (giá trị không nằm ở code)

1. **Máy tự chặn mình trước cổng** — 3 lần khi mọi số đều xanh (chip ② hai lần,
   ③b một lần); và phiên mới nhất dừng ở điều kiện vào với câu *"không tin lời
   nhắn suông"*.
2. **Bài học lan không cần cơ chế** — vấp map-cũ ghi sổ buổi sáng, buổi chiều một
   phiên khác tự áp; lỗi CI-thiếu-identity thành bước giả-lập-CI trong mọi làn sau.
3. **Từ chối bằng chứng không đạt chuẩn** — không nhận một lượt đo lỗi-127 làm "đã
   bắt được"; dán nhãn *nguồn thứ cấp* cho lời trích thay vì chép thành lời-gõ-
   trong-phiên; sửa cách diễn đạt thay vì khai tiền tố giả cho chốt im.

---

## 9 · Những sự thật khó chịu (phần quan trọng nhất cho retro)

**9.1 · Báo cáo kết quả ngày 11/08 sai 5 chỗ đếm được.** "100 commit" không tái
lập được bằng phép đếm nào (đúng: 121) · "72 dòng sổ vấp" (đúng: 73) · "main
`e943f96`, pre-merge clean" — **sai, main đang ĐỎ lúc bản đó được viết** · "mọi
phiên máy đã nghỉ" — sau đó main còn nhận 5 commit, gồm **một chữ ký người mới** ·
"gọi người 2 cổng + 1 merge, không lần nào ngoài thiết kế" — chip ③b thực tế tốn
2 lượt ở Cổng 1 + 2 lượt ở Cổng 2 + merge.

**9.2 · Charter chấm chính đợt: 4 món TRỪ, 0 món trọn vẹn.** `CHANGELOG.md` không
tồn tại · helper ký-gộp 0 file · `time_human_minutes` chỉ về đích 1/3 vế (và về
bằng một chip khác, 3 ngày sau) · chính sách re-pin-theo-release 0 hit.

**9.3 · Ngưỡng phát hành khai trước trượt 2/3 rồi ta vẫn mở 5 chip.** Charter khai
*0 lỗi chặn-việc · ≤2 lượt gọi/feature · owner muốn dùng tiếp*; thực tế **12 lỗi
chặn-việc · 3/4/10 lượt gọi · owner "Có"**. Charter dòng 116 quy định: *"Không đạt
ngưỡng → sửa bug, thử lại. KHÔNG mở rộng phạm vi."* Việc mở 2.1 là chính danh theo
`CLAUDE.md` (điều kiện ≥3 feature đã đạt), nhưng **ngưỡng phát hành chưa từng được
chấm lại**, và nó nói ngược.

**9.4 · Đòn bẩy TRỪ lớn nhất của cả kế hoạch đi ngược.** GĐ4 khai mothball
Codex/design-loop (~½ bề mặt bảo trì) nếu usage = 0. Thực tế trong chính đợt TRỪ:
`codex/` **+259/−38**, `design-loop/` 0 dòng đổi. Khoá của đòn bẩy là 3 câu khảo
sát đội, và hai văn bản của kit **nói ngược nhau** về việc khảo sát đã chốt chưa.

**9.5 · Điều kiện mở GĐ4 tự khoá.** Không phải "0/2 và 0/10" — mà **cả hai con số
đều không có cơ chế đếm**: không trường nào ghi *ai chạy / phiên có B hay không*;
`/start` khai thẳng là "không ghi file" nên không có gì để đếm mẫu. Prune tháp —
mục tiêu cuối của cuộc tái lập — bị khoá sau hai con số **không ai làm tăng được
nếu không dựng chỗ ghi số trước**.

**9.6 · Bản vá quan trọng nhất chưa tới tay repo tiêu thụ.** `diff` bản chép cổng
ở floorplanstudio với kit: **lệch đúng 30 dòng — đúng hai khối của chip ①**. Tức
lưới chữa cho chính nỗi đau tệ nhất của repo đó (chặn-vĩnh-viễn, TALLY 2) **chưa
bao giờ tới nơi**, và không cơ chế nào phát hiện bản chép đã hoá thạch.

**9.7 · `CLAUDE.md` im lặng hoàn toàn về đợt.** `grep -in '2\.1' CLAUDE.md` → **0**;
khối "ĐÓNG BĂNG LAB — không mở vòng meta mới" còn nguyên văn. **Phiên mới đọc đúng
vật bắt buộc sẽ tin lab còn đóng băng và không biết 5 chip tồn tại.** Cộng: **0 ADR
mới, 0 file `.out-of-scope/`** dù ít nhất ba quyết định hội đủ cả ba điều kiện ADR.

**9.8 · Repo thí điểm ra đời đúng 1 ngày trước đợt** (commit đầu 07/08), 136 commit
trong 4 ngày, **dừng hẳn từ 10/08**, 0 tag phát hành, cùng một người viết-duyệt-ký-
chấm-UAT. Điều kiện "≥3 feature thật" đã đạt theo **CHỮ**; câu hỏi về **NGHĨA** thì
chưa ai đặt. Và **không tồn tại baseline "sản phẩm trước khi có kit"**.

---

## 10 · Rủi ro khi đội bắt đầu — mỗi cái một lệnh để biết nó có thật

| # | Rủi ro | Lệnh rẻ nhất |
|---|---|---|
| R1 | **Nghi thức "kiểm ruột" trong doc onboarding KHÔNG chạy được** — đường dẫn thật là `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/…`; làm đúng doc sẽ gỡ-cài-lại vô hạn | chạy nguyên văn 3 câu grep ở onboarding §1 |
| R2 | Doc gọi khối là "VIỆC CỦA BẠN", máy render "VIỆC CỦA ANH" (0 hit trong engine) | `grep -rn 'VIỆC CỦA BẠN' docs/handoff/ scripts/` |
| R3 | Squash bật ở repo đội → lặp lại vụ main đỏ 9h18 | `gh api repos/<đội>/<repo> --jq '.allow_squash_merge'` |
| R4 | Bản chép cổng ở consumer hoá thạch (đang lệch 30 dòng) | `diff <repo>/scripts/pre-merge-check.sh $KIT/scripts/pre-merge-check.sh` |
| R5 | Artifact-theo-Ý — lặp 4 lần, **chưa có lưới nào**; đề bài chữa (`--scaffold`) có tên từ 09/08, chưa thi công | `ls scripts/ \| grep -i scaffold` → 0 |
| R6 | macOS thiếu `timeout` → mutant xanh giả | `command -v timeout gtimeout` |
| R7 | **Kênh ghi sổ vấp của đội đi qua chính cổng đang hỏng**: một hồ sơ hỏng chặn mọi PR (đã xảy ra 4 lần, 3 lần trên commit vô can) → người mới ghi một dòng vấp gặp VIOLATION về slug lạ sẽ không ghi lần thứ hai | mở 1 PR docs-only vào kit, xem CI |

**Điểm sáng cần ghi:** lối vào **kỹ thuật** cho repo mới **không gãy** — 7/7 file
trong `INIT-CI-COPY-LIST` tồn tại đúng đường dẫn. Cái gãy là chỉ dẫn cho **người**,
không phải danh sách vật cho **máy**.

---

## 11 · Nếu phiên điều phối (máy B) biến mất

B không viết mã; **B là bộ nhớ liên-phiên duy nhất đang chạy, và kho không có bản
sao của bộ nhớ đó.** Mất B thì mất: đối chiếu ledger trước khi kết luận (ledger
chính thức `known-limits-ledger.tsv` **đóng băng từ 08/08**, 0 dòng cho 3 feature
GĐ2 và 5 chip — sổ vấp thầm lặng thay chỗ nó mà không văn bản nào ghi việc chuyển
sổ) · chú thích chống-trôi · nhúng nghĩa vụ báo cáo vào đề bài · và **người nói
"dừng"** — không có B thì owner phải tự veto mỗi lượt, tức tăng đúng đại lượng
đang quá tải.

Ba vật đáng lẽ giữ trí nhớ thay B đều đang câm: `CLAUDE.md` (§9.7) · thẻ vai B
(dừng ở 09/08, còn ghi `origin/main 1.39.0`) · 0 ADR / 0 `.out-of-scope`.

> **Phép thử 10 phút:** mở một phiên sạch, chỉ cho đọc `CLAUDE.md` + thẻ vai B, hỏi
> ba câu: *kit đang ở bản nào? lab đóng hay mở? chip nào đã ship?* Ba câu sai =
> trí nhớ của đợt nằm hoàn toàn trong phiên B và trong đầu owner, không nằm trong kho.

---

## 12 · Tám câu hỏi cho phiên retro

1. **Chấm chip bằng mẫu số nào?** 4 file cổng đi từ 342 → 640 dòng (+87%) để cắt
   ~3 lượt gõ. Nếu chỉ chấm vế người, mọi chip sau đều "thắng" bằng cách đẩy chi
   phí sang máy. Có chốt đại lượng **(lượt-người + dòng-máy-phải-đọc)** không?
2. **Ngưỡng khai trước có quyền phủ quyết, hay chỉ là chỉ báo?** Trượt 2/3 rồi mở
   5 chip. Nếu ngưỡng không có răng thì đừng gọi nó là ngưỡng — hay gắn răng cho nó?
3. **Ai gửi 3 câu khảo sát, và mặc định là gì nếu không ai trả lời?** Đòn bẩy TRỪ
   lớn nhất bị khoá sau nó. **Veto-default có áp cho chính món này không: im lặng
   2 tuần = mothball?**
4. **Điều kiện "≥3 feature thật" có tự thoả không?** Nếu viết lại để nó không tự
   thoả được, nó phải nói gì — *feature có người dùng ngoài*, hay *feature do người
   khác owner ký*?
5. **Thứ tự chip quyết bằng gì?** Lớp lặp dai nhất (4 lần/3 ngày) có đề bài chữa từ
   09/08 và vẫn 0 hit, trong khi 5 chip đi làm việc khác. Xếp theo **số lần lặp ×
   chặn-việc**, hay theo thứ tự nghĩ ra?
6. **Bịt đường rửa chữ ký thế nào?** (§6) — đây là lỗ duy nhất nằm trên lõi bất
   khả nhượng.
7. **Luật do model thi hành có được tính là "đã ship" không**, khi tỉ lệ tuân văn
   chưa từng được đo một lần?
8. **Kit đo bằng kit đến bao giờ?** 99/115 commit non-merge là docs/hồ sơ; hai
   phép đo vận hành đầu tiên chạy thật (bản chép ở consumer, 3 câu kiểm ruột) thì
   **cả hai đều đỏ**.

---

## 13 · Việc kế — một đường

**Quay về sản phẩm, và trước đó bấm ba cái nút rẻ nhất.**

Ba việc rẻ, làm trước khi đội vào (mỗi việc < 15 phút, đều là LƯỚI chứ không phải
câu hỏi): (a) **bật branch protection cho `main`** — bịt cùng lúc đường đẩy-thẳng-
qua-mặt-T1-escape và đường rebase sinh phantom pin; (b) **sửa 3 câu grep + một dòng
"cấm squash" + đổi "VIỆC CỦA BẠN"** trong doc onboarding — ba lỗi R1/R2/R3 đội sẽ
dẫm ngay ngày đầu; (c) **chép lại bộ cổng sang floorplanstudio** (đang lệch 30 dòng).

Rồi: **gửi thông báo #2**, và **ván kế là một feature sản phẩm thật, không phải chip
kit** — số liệu đội từ đó cũng chính là thứ mở khoá GĐ4. Dây chip ④–⑦ chỉ mở lại khi
một vấp thật kéo nó ra khỏi kho.

**Phép thử tự áp cho mọi đề xuất sau đợt này:** *"việc này rút ngắn đường
sản-phẩm-đến-người-dùng ở chỗ nào — và nó là LƯỚI hay là CÂU HỎI?"*
