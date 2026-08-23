# Ra có tên ở Vòng LÀM và TRAO — thiết kế

Hồ sơ: `_acceptance/ra-co-ten-lam-va-trao/` · Cổng Đáng ký `build` 23/08 (Manh Phan) ·
hạng **T3** (chạm `lib/workspace-record.cjs`, `lib/evidence-core.cjs`, `hooks/`,
`scripts/pre-merge-check.sh`). Đề bài: `opportunity.md` của hồ sơ + audit
`docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §3 lớp A (A1–A3, A7–A9), §6 Core 1–3.

## 0. Vì sao — nói bằng North Star

Kit hứa: sản phẩm đến tay người dùng nhanh hơn mà vẫn tin được. Hai thước: thời gian
*làm-xong → quyết-được*, và số lần gọi người mỗi kết quả ship. Ba chỗ đứt, mỗi chỗ đập
thẳng một thước:

| Chỗ đứt | Chuyện gì | Thước bị đập |
|---|---|---|
| ① Cổng Đáng không có cửa | quyết định quan trọng nhất (ý định trước khi làm) không có nghi thức: hai lượt gọi người, hai PR, lượt hai chỉ còn «ừ» | gọi người ×2, một lượt là trạm thu phí |
| ② Làn máy-tự-đi cụt | hồ sơ máy tự thông dừng ở `verified`, không bao giờ tới Cổng Giá trị → ngưỡng đã khai không bao giờ được đo | làm-xong → quyết-được = vô hạn |
| ③ Vòng không đo được kẹt | vòng không có người dùng cuối vào Cổng Giá trị mà không có lối ra; lối duy nhất là sửa tay không vết | treo vô hạn; bằng chứng bắt đầu dối |

Cả ba đụng bốn bộ phận dùng chung (luật đọc hồ sơ · bộ quét · bản đồ · bảng điều khiển)
nên làm chung một lượt. Hồ sơ `start-bang-dieu-khien` (gộp 23/08, #101) đã dựng **một bảng
chữ chung** (`scripts/trang-thai-ho-so.cjs`) và bộ quét là nơi phân ô duy nhất — việc này
phần lớn là thêm hàng vào bảng đó và thêm nhánh vào bộ quét.

## 1. Làn máy-tự-đi có ô kết — trạng thái «máy đã thông»

### 1.1 Định nghĩa

Bảng trạng thái hợp đồng thêm giá trị thứ sáu, đặt sau `verified`:

```
draft → approved → implemented → verified → { signed-off | machine-cleared }
```

`machine-cleared` (mặt người: **máy đã thông**) = máy đã qua Cổng Bằng chứng bằng sáu điều
kiện xanh-sạch (verdict PASS · không bypass · enforcement không off · hạng T2 · 0 UNCERTAIN ·
«Known limits» và «Ngoài hợp đồng» hiện-diện-và-rỗng), **không có** `human_signoff`. Cửa veto
vẫn ghi ở `veto_state`/`veto_opened_at` như nay — `machine-cleared` không thay thế vết veto.

**Bất biến phân biệt (điều kiện chết a):** không bộ đọc nào được in hồ sơ `machine-cleared`
dưới cùng chữ với hồ sơ `signed-off`. Hai trạng thái, hai tên, ở mọi mặt.

### 1.2 Ai viết

`feature-loop/skills/feature-loop/SKILL.md`, hàng `verified` của bảng state machine và bước
S4 (3): xanh-sạch ∧ không chạm khó-đảo → set `status: machine-cleared` (không để nguyên
`verified`), commit, đi S5. Resume vào `machine-cleared` → hàng riêng: S5 SHIP (cùng hành vi
với `signed-off`). Thân `skills/acceptance/SKILL.md` (làn V) nói cùng câu.

### 1.3 Ai đọc — từng bộ phận

| Bộ phận | Đổi gì | Vì sao |
|---|---|---|
| `lib/workspace-record.cjs` | enum `contract.md/status` thêm `machine-cleared`; `usesUat()` nhận `signed-off` **hoặc** `machine-cleared`; `usesEvidence()` thêm `machine-cleared` (lời khai cần bằng chứng đi kèm) | luật tiêu thụ hồ sơ sống một chỗ |
| `scripts/pre-merge-check.sh` | (i) ba chỗ liệt `implemented\|verified\|signed-off` thêm `machine-cleared`; (ii) **răng lời khai**: status `machine-cleared` ⇒ `xanh_sach_check` phải ĐÚNG và Cổng 1 hợp lệ (approved_by, gate1_skipped, hoặc làn V đúng vết); trượt ⇒ `VIOLATION [slug]: status machine-cleared nhưng hồ sơ còn cần người — <điều kiện trượt>`; (iii) nhánh `human_signoff` rỗng giữ nguyên logic xanh-sạch — `machine-cleared` đi qua nhánh đó, in NOTE cùng chữ | «máy đã thông» là lời khai; lưới đòi bằng chứng — máy không tự phong |
| `lib/evidence-core.cjs` (`checkContract`, hook lúc ghi) | `machine-cleared` với `approved_by` rỗng ⇒ phải có làn V đúng vết hoặc `gate1_skipped`, y hệt `verified`; dòng lifecycle trong thông điệp hook thêm trạng thái mới | hook không chặn oan, không mở cửa mới |
| `scripts/start-scan.mjs` | nhánh `signed-off` thành nhánh `signed-off \|\| machine-cleared`; **không có ô cơ hội** → `machine-cleared` rơi vào hai khoá MỚI `da-giao-may-thong-veto-mo` / `da-giao-may-thong-xanh-sach` (theo `veto_state`), KHÔNG phải `da-giao`; có ô cơ hội `build`/`iterate` → chờ Cổng Giá trị (mục 3 quyết tiếp theo ô ngưỡng) | chỗ đứt ② lành; bất biến 1.1 |
| `scripts/trang-thai-ho-so.cjs` | hai khoá mới, nhãn «đã giao — máy thông, cửa veto còn mở» / «đã giao — máy thông, bằng chứng xanh-sạch», bucket `da-ship` | bản đồ và bảng điều khiển cùng chữ, không tự chế |
| `scripts/gate-card.js` | regex nhận cổng: `machine-cleared` → Cổng Bằng chứng; thẻ in dòng «máy đã thông — không có chữ ký người; cửa veto <mở/không>» | thẻ không in nhầm thành chờ ký |
| `skills/uat-session/SKILL.md` §0 | điều kiện vào: `status: signed-off` **hoặc** `machine-cleared` | phiên nghiệm thu nhận làn V |
| `skills/acceptance/references/contract-template.md` · `commands/acceptance-status.md` · `commands/acceptance-report.md` · `CONTEXT.md` | ghi chú enum + term «máy đã thông» (mục Gates & verbs, kèm `_Avoid_`) | N6 |

**Đường đọc-cũ:** hồ sơ `verified` + làn V đời cũ (`release-2-0-0`, `release-2-1-0`) không
migrate; bộ quét giữ nhánh `verified` + vị từ `khongCanNguoi` như nay (`may-di-tiep-*`).
Chỉ hồ sơ `machine-cleared` mới tới Cổng Giá trị.

## 2. Cổng Đáng có cửa — một lượt, một PR

### 2.1 Máy đề xuất ngưỡng khi kết buổi khai thác

Khối `START-HIEU-KET` (`commands/start.md`) ⑤ đổi: section «Ngưỡng chết / ngưỡng UAT» máy
**được** điền bằng đề xuất khi có căn cứ, mỗi bullet mang tiền tố `[đề xuất]` ngay sau
dấu `:` — ví dụ `- Kết quả nào là SỐNG: [đề xuất] …`. Ý còn mờ thật thì giữ `…` như cũ.
Tiền tố là hằng MỘT chỗ trong `opportunity-template.md` (khối marker
`OPP-DE-XUAT-PREFIX`), bộ quét và lệnh ký rút từ đó (round-trip, mẫu chip C).

Bộ quét: bullet có giá trị `[đề xuất] <gì đó>` tính là **đã điền** → hồ sơ sang «chờ Cổng
Đáng» ngay, không qua «đang cân nhắc». «Đang cân nhắc» chỉ còn cho ý máy không đề xuất
nổi.

Máy ĐƯỢC khuyên (ngưỡng + căn cứ), máy KHÔNG quyết (`decision`, `decided_by`, `decided_at`
để trống tới khi người ký) — cùng bất biến với GATE-ONESHOT-GRAMMAR / ADR 0002.

### 2.2 Thẻ Cổng Đáng

`scripts/gate-card.js` biết cổng thứ ba. Tự nhận: workspace **không** có `contract.md`,
có `opportunity.md`, `stage ≠ archived`. Nội dung thẻ (cùng khuôn hai thẻ kia):

- tiêu đề: tên ý + «Cổng Đáng — việc này có đáng làm không?»
- khối «Vấn đề & ai gặp» (section nguyên văn, lột markdown như các khối khác)
- khối «Giả định sinh tử» — tối đa 3 hàng đầu của bảng
- khối «Ngưỡng» — bullet nào mang `[đề xuất]` hiện chip «máy đề xuất — anh sửa hoặc nhận»;
  `…` hiện «chưa có»; dòng «Không đo được — …» hiện chip «khai không đo được»
- khối «Nguồn ngoài» — hàng chưa phân loại ⇒ cờ đỏ (răng khuôn :76 lần đầu có vật)
- **bốn lối ra**, mỗi lối một câu gộp mẫu: làm · lặp · xếp lại · dừng; có `prototype.base_commit`
  → thêm câu hỏi giữ/lưu proto
- cờ: ngưỡng còn `…` và không có dòng «Không đo được» ⇒ cờ đỏ «ký *làm* lúc này là ký trên
  thước trang trí — điền ngưỡng hoặc khai không đo được»
- `--extract` trả thêm `cong_dang: { applicable, nguong: 'chua-chot'|'de-xuat'|'chot'|'khong-do-duoc', nguon_ngoai_chua_phan_loai: n, loi_ra: [...] }`

`commands/start.md` bước 4: chọn cổng `dang` → `/acceptance-card <slug>` (nay đúng thẻ) rồi
`/approve <slug>` để ký.

### 2.3 Ký bằng `/approve` — chế độ Cổng Đáng

`commands/approve.md` nhận ra chế độ: `contract.md` VẮNG ∧ `opportunity.md` có ∧ `decision`
rỗng ∧ `stage ≠ archived`. Không lệnh mới, không khoá model-invocation mới (ADR 0002 đã khoá
`approve`). Câu gộp (thêm vào `GATE-ONESHOT-GRAMMAR`, slot `g0`):

```
/approve <slug> làm|lặp|xếp lại|dừng [; giữ proto|lưu proto] [; không đo được: <lý do>] [: <tên> [<ngày>]]
```

Khi ký:
1. **Răng chiều đỏ:** `làm`/`lặp` mà ô ngưỡng còn `…` **và** không có dòng «Không đo được» (trong
   file hoặc trong câu gộp) → TỪ CHỐI, in đúng câu của thẻ; `xếp lại`/`dừng` không cần ngưỡng.
   `làm`/`lặp` khi bảng Nguồn ngoài còn hàng chưa phân loại → TỪ CHỐI (khuôn :76).
2. Gỡ tiền tố `[đề xuất]` khỏi mọi bullet ngưỡng (người ký = người nhận; muốn sửa thì sửa
   file trước khi gõ — vẫn một lượt); câu gộp có «không đo được: …» → ghi dòng
   `Không đo được — <lý do>` vào section ngưỡng (thay các bullet `…`).
3. Ghi `stage: decided`, `decision` (map làm→build · lặp→iterate · xếp lại→park · dừng→kill),
   `decided_by`, `decided_at` (ISO, ngày lệnh chạy), `prototype.disposition` khi hỏi;
   `dừng` → `stage: archived`.
4. Append entry sổ quyết định `{"type":"gate0", ...}` (cùng kiểu hai hồ sơ 23/08 đã ghi tay).
5. Vẽ lại bản đồ (`product-map.mjs`), commit một lượt (hồ sơ + bản đồ), in bước kế:
   `build`/`iterate` → `/feature-loop <slug>`; `park` → «đã xếp lại, không ai phải làm gì»;
   `kill` → «đã đóng có hồ sơ».

Danh tính/ngày suy theo bậc thang của GATE-ONESHOT-GRAMMAR, hiển thị lại trước khi ghi —
không viết luật mới.

## 3. Cổng Giá trị có lối ra cho vòng không đo được

### 3.1 Ô ngưỡng — ba trạng thái máy đọc

Section «Ngưỡng chết / ngưỡng UAT» của `opportunity.md`:

| Trạng thái | Dạng | Ai khai |
|---|---|---|
| `chua-chot` | mọi bullet khuôn còn `…`/rỗng | — |
| `de-xuat` | ≥1 bullet `[đề xuất] …` | máy, khi kết buổi HIỂU |
| `chot` | đủ bullet khuôn, giá trị thật, không tiền tố | người (ký Cổng Đáng gỡ tiền tố) |
| `khong-do-duoc` | một dòng bắt đầu đúng chuỗi `Không đo được — ` + lý do | người, tại Cổng Đáng (hoặc bổ sung có vết cho hồ sơ đã ký) |

Tiền tố `Không đo được — ` là hằng MỘT chỗ trong `opportunity-template.md` (khối marker
`OPP-KHONG-DO-DUOC-PREFIX`, kèm một dòng mẫu), bộ quét · thẻ · `uat-session` · `approve` rút
từ đó; đổi chuỗi một phía là phép đo round-trip đỏ.

### 3.2 Bộ quét — nhánh «đã thông Cổng Bằng chứng» (signed-off | machine-cleared) + ô cơ hội build/iterate

| Ô ngưỡng | Xếp vào | Khoá | Việc kế |
|---|---|---|---|
| `chot` | chờ Cổng Giá trị | `cho-cong-gia-tri` (có sẵn) | như nay |
| `khong-do-duoc` | đã giao | **mới** `da-giao-khong-do` — «đã giao — không đo, khai ở Cổng Đáng», bucket `da-ship` | không ai |
| `chua-chot` / `de-xuat` | chờ Cổng Giá trị **kèm cờ** | `cho-cong-gia-tri` + `flags: ['nguong-chua-chot']` | «điền ngưỡng vào ô, hoặc khai “Không đo được — …” kèm một dòng sổ» |

`de-xuat` ở đây = hồ sơ ký Cổng Đáng bằng đường cũ mà chưa ai gỡ tiền tố — coi như chưa
chốt, không coi là chốt (máy đề xuất ≠ người chốt).

Bảng điều khiển (`commands/start.md`) in cờ đó ngay dòng cổng. Phiên nghiệm thu §0: ngưỡng
`chua-chot`/`de-xuat` → DỪNG, in đúng hai lối; `khong-do-duoc` → DỪNG một dòng «ô này khai
không đo được — không có phiên nghiệm thu, không treo».

Hồ sơ `duong-do-trong-dinh-nghia-xong` (đang treo) thoát bằng: một dòng «Không đo được — …»
trong ô + một entry `revisit` trong sổ. Ghi trong hồ sơ này, PR này — là ca thử thật đầu
tiên của điều kiện sống (3).

### 3.3 Răng chống lách (điều kiện chết b)

Hợp đồng `surfaces` chứa `ui` hoặc `mobile` ∧ ô cơ hội `khong-do-duoc` ⇒ **cờ đỏ** ở:
thẻ Cổng Phạm vi (`gate-card.js`, cạnh khối «Ngưỡng nghiệm thu»), bộ quét (`flags:
['mien-do-co-nguoi-dung']`, hồ sơ VẪN ở ô của nó — không hoá hỏng), bảng điều khiển.
Gap-probe S1#7 thêm một câu cross-check cùng điều kiện. Không đụng lưới trước-merge (lưới mù
Vòng TRAO là quyết định có chủ đích — audit §6 Never).

### 3.4 Ba chỗ nhỏ cùng lớp (A8, A9)

- `uat-session` ký `kill` → ghi `stage: archived` vào `opportunity.md` cùng lượt; ký `iterate`
  → in một dòng bước kế: «mở vòng kế bằng `/feature-loop <mô tả>` (hồ sơ mới, ô cơ hội giữ
  nguyên với `decision: iterate`)».
- Bộ quét/bản đồ đọc `stage: archived` → khoá **mới** `da-dong-ho-so` («đã đóng có hồ sơ»,
  bucket `da-bac`), không còn rơi vào «đang cân nhắc».
- Bộ quét đọc bullet `Timebox:` — tìm ngày (ISO `YYYY-MM-DD` hoặc `DD/MM/YYYY`) — quá hạn
  ∧ chưa có verdict nghiệm thu ⇒ `flags: ['qua-timebox']` trên hồ sơ, bảng điều khiển in một
  dòng; KHÔNG tự đổi `decision`.

## 4. Đường đọc-cũ, phép đo, phạm vi

### 4.1 Đọc-cũ (điều kiện sống 5)

Bộ đọc mới chạy trên **toàn bộ hồ sơ hiện có** của repo (57 slug lúc viết) → `broken: []`,
không hồ sơ nào phải sửa. Khác biệt được phép so với bộ đọc cũ: `duong-do-trong-dinh-nghia-xong`
thêm `flags: ['nguong-chua-chot']` (trước khi ghi dòng thoát). Mọi hồ sơ `verified` + làn V
đời cũ giữ nguyên khoá. Phép đo: snapshot JSON bộ quét cũ vs mới trên cây thật, diff chỉ được
chạm đúng các khoá mới liệt kê.

### 4.2 Phép đo — mỗi cái có chiều đỏ (MEASURE-BIRTH-CLAUSE)

- Fixture máy sinh ở mọi trạng thái (6 hợp đồng × veto × evidence, 10 ô cơ hội ở 4 trạng
  thái ngưỡng), dựng bởi script test từ vị trí script, không hardcode root.
- Mutant «`machine-cleared` → `signed-off`» trên hồ sơ làn V: bộ quét/bản đồ/thẻ ĐỎ (in ra
  chữ «đã giao» của người ký = sai). Mutant gỡ `machine-cleared` (về `verified`) trên hồ sơ có
  ô cơ hội `build`: ba bộ đọc (bộ quét · `uat-session` §0 qua script kiểm · lưới) từ chối và
  NÊU «chưa có ô kết».
- Mutant hồ sơ `machine-cleared` mà evidence có UNCERTAIN: lưới VIOLATION ghim «còn cần người —
  có mục UNCERTAIN»; bản nguyên vẹn xanh trước.
- Round-trip ba chuỗi: `[đề xuất]` · `Không đo được — ` · enum status — rút từ khuôn/lib, đọc
  bằng từng reader; bản sao khuôn đổi chuỗi → đỏ nêu hai chuỗi.
- `/approve` chế độ Cổng Đáng: fixture ngưỡng `…` + câu `làm` → từ chối đúng câu; + `xếp lại`
  → ghi; + `làm; không đo được: …` → ghi dòng + decided. Nguồn ngoài chưa phân loại + `làm` →
  từ chối. (Lệnh là SKILL/markdown: đo bằng case đọc thân lệnh có đủ mệnh đề — assert, không
  mô tả — cộng ca round-trip hằng; hành vi LLM không dựng hội đồng, theo nếp chip C §4.)
- Lưới đẳng thức hai bản dựng `xanh_sach_check` (bash) ↔ `xanhSach` (mjs) giữ nguyên LV5;
  thêm hàng fixture `machine-cleared` vào ma trận.

### 4.3 Không làm (điều kiện chết e — giữ ba chỗ, không hoá sáu)

Veto có động từ (A5) · vết duyệt kế hoạch T3 (A6) · Cổng Phạm vi lối «không làm», «Trả lại»
có vết (A10) · re-pin có tên (A11) · lái-thử có người khởi động (A12) · `iterate` ≡ `build` ở
bộ đọc (giữ) · lưới trước-merge đọc Vòng TRAO (Never) · migrate hồ sơ cũ (cấm).

## 5. Đối chiếu Stage-Gate — ba chuyển trạng thái mới đủ năm thành phần

| Chuyển | Vật nộp | Tiêu chí | Lối ra | Người gác | Chủ bước kế |
|---|---|---|---|---|---|
| verified → machine-cleared | evidence-report | sáu điều kiện xanh-sạch (lưới kiểm lời khai) | machine-cleared / Gate 2 | máy, người veto | vòng làm → S5; sau đó Cổng Giá trị hoặc «đã giao» |
| discovery → decided (Cổng Đáng) | opportunity.md + thẻ | ngưỡng chốt hoặc khai không đo được; nguồn ngoài đã phân loại | làm / lặp / xếp lại / dừng | người ký qua `/approve` | `/feature-loop` · «không ai» · đóng hồ sơ |
| đã thông → Cổng Giá trị | uat-session.md + ô ngưỡng | ngưỡng `chot` | release / iterate / kill / **không đo (khai trước)** | người ký phiên | iterate → vòng kế (in); kill → archived (ghi) |

## 6. Quét không gian tiêu chí (morphological-scan, preset test-matrix)

### Ngữ cảnh
- Sản phẩm: máy trạng thái hồ sơ của kit — chân sản phẩm: `[SUY-TỪ-REPO: lib/workspace-record.cjs NAV_RULES]`, `[SUY-TỪ-REPO: scripts/trang-thai-ho-so.cjs]`, `[SUY-TỪ-REPO: CONTEXT.md §Gates & verbs]` · chân ngành: `[NGÀNH: Stage-Gate, R. Cooper]` (năm thành phần một cổng) + `[NGÀNH: ISTQB state-transition testing / Chow N-switch]` (mỗi chuyển hợp lệ VÀ mỗi chuyển cấm đều có ca).

### Trục
- **A — Vật mới:** A1 trạng thái `machine-cleared` (ghi + đọc) | A2 thẻ + ký Cổng Đáng qua `/approve` | A3 ô ngưỡng bốn trạng thái + lối `khong-do-duoc` | A4 răng chống lách (surfaces ui/mobile) | A5 archived · timebox · kill/iterate chủ bước kế. `[thước CE: §1–§3 đặc tả; audit §3 A1–A3, A7–A9]`
- **B — Bộ đọc:** B-máy: workspace-record | start-scan+trang-thai | product-map | gate-card | pre-merge | hook/evidence-core. B-nghi-thức: uat-session | feature-loop SKILL | approve | start | khuôn+CONTEXT. `[thước CE: grep "signed-off" toàn repo = 14 file, mỗi file là một bộ đọc]`
- **C — Chiều đo:** dương | âm ghim thông điệp | mutant cô lập lớp | round-trip hằng | đọc-cũ/snapshot. `[thước CE: MEASURE-BIRTH-CLAUSE + 4 lớp thước chip ③b + Chow: chuyển cấm phải có ca]`

### Không gian: 5 × 11 × 5 = 275 ô → quét theo lát A, pairwise A×B, C áp cross-cutting
Ô vô nghĩa (gạch): A2×B-máy{workspace-record, pre-merge, hook} — Cổng Đáng không có hợp đồng nên ba bộ này không đọc nó (Never, «lưới mù Vòng TRAO» audit §6); A4×{pre-merge, hook} — cùng lý do; A5×{hook, pre-merge, gate-card} — archived/timebox là ô cơ hội.

### Core (13 / ~60 ô có nghĩa ≈ 22 % — gộp thành ≤ 12 AC)
1. A1×workspace-record×{dương, round-trip} — enum + usesUat/usesEvidence nhận `machine-cleared`; enum rút từ lib so với khuôn contract-template.
2. A1×pre-merge×{dương, âm} — arm ba chỗ; răng lời khai: `machine-cleared` mà không xanh-sạch → VIOLATION ghim điều kiện trượt; nguyên vẹn xanh trước.
3. A1×hook×{dương, âm} — `machine-cleared` không approved_by: làn V đúng vết → qua; T3/thiếu vết → chặn ghim câu.
4. A1×start-scan×{dương, mutant} — không ô cơ hội → hai khoá `da-giao-may-thong-*`; có ô `build` → `cho-cong-gia-tri`; mutant `machine-cleared→signed-off` → chữ đổi (bất biến phân biệt); mutant về `verified` + ô build → KHÔNG tới Cổng Giá trị (cô lập lớp).
5. A1×{product-map, gate-card}×dương — bucket `da-ship` với nhãn riêng; thẻ nhận Cổng Bằng chứng + dòng «máy đã thông».
6. A1×{uat-session, feature-loop, acceptance SKILL}×round-trip — thân nghi thức có mệnh đề `machine-cleared` đúng chỗ (cắt phạm vi đúng, assert không mô tả).
7. A2×gate-card×{dương, âm} — thẻ Cổng Đáng tự nhận; `--extract` trả `cong_dang.nguong` bốn giá trị; cờ đỏ khi `chua-chot` ∧ không `khong-do-duoc`; nguồn ngoài chưa phân loại → cờ đỏ.
8. A2×approve×{round-trip, âm} — thân lệnh có chế độ Cổng Đáng + răng chiều đỏ + map làm/lặp/xếp lại/dừng; câu gộp `g0` trong GATE-ONESHOT-GRAMMAR round-trip với slot list; start.md bàn giao `dang` → card → approve (hết con trỏ chết).
9. A3×start-scan×{dương ×4 trạng thái ngưỡng} — `chot`→cổng; `khong-do-duoc`→`da-giao-khong-do`; `chua-chot`/`de-xuat`→cổng + `flags:['nguong-chua-chot']`; `[đề xuất]` tính là đã điền ở nhánh Cổng Đáng.
10. A3×{khuôn, start-scan, uat-session, gate-card, approve}×round-trip — hai hằng `[đề xuất]` và `Không đo được — ` rút từ khối marker của khuôn; bản sao khuôn đổi chuỗi → đỏ nêu hai chuỗi.
11. A4×{gate-card, start-scan}×{dương, âm} — surfaces ui/mobile ∧ `khong-do-duoc` → cờ đỏ/flags; surfaces cli → không cờ (đối chứng).
12. A5×{start-scan, product-map, uat-session}×dương — `archived` → `da-dong-ho-so`; timebox quá hạn → `flags:['qua-timebox']`; uat-session kill ghi archived, iterate in bước kế.
13. (tất cả)×đọc-cũ — snapshot bộ quét trên toàn bộ hồ sơ thật: `broken: []`, diff chỉ ở khoá mới liệt kê; `verified`+làn V cũ giữ `may-di-tiep-*`.

### Later
- A2 hành vi LLM của `/approve` (máy có từ chối thật không) — hội đồng chỉ khi ô lọt lần ba (nếp chip C).
- A1 `acceptance-status`/`acceptance-report` in `machine-cleared` — một câu mỗi nơi khi đụng.
- A5 timebox dạng ngày tự do («cuối tháng 9») — chỉ nhận hai dạng ngày.

### Never
- A1×pre-merge đọc Vòng TRAO (uat verdict) — quyết định có chủ đích (audit §6).
- Migrate hồ sơ `verified`+làn V cũ sang `machine-cleared` — trái luật đọc-cũ.
- Lệnh thứ bảy cho Cổng Đáng — «chỉ TRỪ không CỘNG», khoá ADR 0002.

### Cross-cutting áp mọi ô Core
- Fixture do script test sinh từ vị trí script; mọi ca âm có đối chứng dương cùng fixture + ghim thông điệp.
- Mọi chữ mặt người vào `trang-thai-ho-so.cjs`; khoá lạ chết to (có sẵn).
- Chuyển cấm có ca: `draft→machine-cleared`, `machine-cleared` với T3, `machine-cleared` với UNCERTAIN.
