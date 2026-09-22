# Audit S4 cách mới — thông lệ, skill, vật có bị bỏ qua không? (crm 15 vòng · kit 3 vòng, 16–22/09)

**Ngày:** 2026-09-22 · **Chủ:** owner gọi tên («audit S4 xem các thông lệ, skill, vật như UX, contract… có bị
bỏ qua không, như một hoạt động đảm bảo cho cách mới so với cách cũ») · **Cách đo:** chỉ đọc VẬT máy ghi —
tệp hồ sơ trên `origin/onehub` của crm và `main`/nhánh vòng của kit, `decisions.jsonl`, `run-log.jsonl`,
lịch sử commit, transcript phiên (`tool_use` Skill/Workflow/Agent, `<command-name>` của người). Không đọc
lời kể. Lệnh đo: hai script cạnh bản này (`audit_ho_so.py`, `audit_skill.py`, chép lại ở Phụ lục).

**Nhóm so sánh.** *Cách cũ* = 7 vòng crm mở 16–19/09 (`cho-phep-ai-vao-o-man-hinh`, `duong-proto-cho-design-pass`,
`man-xin-quyen-co-rang`, `go-thanh-vien-phai-giu-duoc`, `loi-moi-da-huy-van-cho-vao`, `truong-tu-tao-o-cai-dat`,
`vao-bang-email-va-mat-khau`). *Cách mới* = 8 vòng crm 20–22/09 (`dieu-phoi-30-ngay-dau` chấm lại,
`bang-cot-loi-va-nhan`, `khai-lang-gioi-thieu`, `loi-vao-dieu-phoi-30-ngay`, `noi-bon-nut-dieu-phoi`,
`quan-ly-danh-muc-30-ngay`, `khuon-mat-bo-phan`, `sua-luu-tru-dieu-phoi`) + kit `nhan-trang-thai-va-reality`,
`release-2-18-0`, `ho-so-khep-thoi-hoi` (đang S4).

## 0. Kết luận một đoạn

**Không có thông lệ nào bị bỏ qua IM LẶNG.** Mọi bước bị bỏ (design-pass, đặc tả UX, coverage-scan, ui-observed,
đường đo) đều có một dòng `descope` có tên trong sổ, và ở bốn vòng đi làn V Cổng Phạm vi (không dấu niêm) thẻ
Cổng Bằng chứng trình chúng thành khối «CHƯA duyệt» (Treo-1…n) — fail-visible đúng thiết kế. Điều bị bỏ là
**khoảnh khắc**: cách mới bỏ design-pass ở **6/6 vòng chạm UI** (cách cũ 2/5 có), gọi skill `ux-ui-craft` **0 lần**
trong 21–22/09 (3 lần trong 16–20/09), và owner **«Treo: phê hết» 5–20 mục mỗi chữ ký** không sửa mục nào — đúng
hình dạng «trạm thu phí» mà luật lời mời cổng (01/09) cấm. Hai khoảng trống đo được nữa: **ý định** chỉ ghi ở
4/8 vòng mới (M5 đòi 100 % T2/T3), và **chiều đỏ không đọc được từ lịch sử commit** ở crm (cả hai cách: test và
vật đi cùng commit) — nó nằm ở làn `baseline` của run-log, không ở lịch sử như khối ĐỊNH VỊ mô tả.

## 1. Vật hồ sơ — có mặt hay không (crm)

| Vật / thông lệ | Cách cũ (7) | Cách mới (8) | Đọc |
|---|---|---|---|
| `opportunity.md` (ý định, Cổng Đáng) | 2/7 | **4/8** (`sua-luu-tru` T3 15 AC không có; `bang-cot`, `loi-vao`, `noi-bon-nut` không có) | M5 lên 29 % → 50 %, chưa 100 % |
| `design-pass.md` (S1-D) trên vòng chạm UI | 2/5 | **0/6**; 7/7 vòng bỏ có dòng `bỏ design-pass — <lý do>` | bỏ có tên, nhưng lý do lặp «dùng lại thành phần sẵn có» kể cả `sua-luu-tru` (menu «…», kéo-thả, Hoàn tác, mục Đã lưu trữ) |
| «Đặc tả UX» + «Khuôn IA» trong design-doc | 3/7 có | 6/8 có (`khai-lang`, `khuon-mat` không — cả hai khai không đổi màn) | giữ |
| `gap-probe.md` | 7/7 | 8/8 | giữ |
| `review-findings.md` + làn `finding` trong run-log | 7/7 | 8/8 (finding 1–15/vòng) | giữ |
| `morphological-scan.md` / coverage-scan | 1/7 | 1/8; 5/8 ghi `bỏ coverage-scan — <lý do>` | bỏ có tên |
| `duong-nen.md` (đường nền hạ tầng) | 1/7 | **8/8** | mới, đo được đỏ-hạ-tầng ≠ đỏ-vật |
| `usage-report.md` (token S4) | 1/7 | **6/8** | dòng 4 luật (c) đo được |
| Mục hợp đồng Coverage · Out of scope · Notes | 7/7 | 8/8 | giữ |
| Mục «Đường đo» (ngưỡng ↔ AC) | 2/7 | 2/8 (+1 `bỏ đường-đo` có tên) | chỉ vòng có ngưỡng |
| Dấu niêm Cổng 1 (`seal`) | 7/7 | **4/8** — 4 vòng làn V Cổng Phạm vi, `approved_by` rỗng | đúng luật làn V; thẻ Cổng 2 trình mọi dòng S1 làm Treo |
| Thẻ Cổng 2 có khối «CHƯA duyệt» | — | 3/4 vòng làn V có (Treo 5 · 6 · 12); `loi-vao` không có thẻ (máy thông cả hai cổng) | fail-visible đúng; `loi-vao` là ca người không thấy quyết định máy cho tới `observed` |

## 2. Bộ đo và làn S4

| | Cách cũ | Cách mới |
|---|---|---|
| Executor | `script` nặng (duong-proto 15/17, man-xin 9/11, truong-tu-tao 15/22), `judgment` 2 vòng | **`test` của kho** áp đảo (28/29, 13/14, 13/14, 6/6, 4/4…), `judgment` 0 vòng |
| `ui-check` trên vòng chạm UI | 5 · 2 · 1 · 1 · 0 | 1 · 1 · 1 · 0 · 0 · 0 (`bang-cot`, `khai-lang`, `loi-vao` bỏ có tên `bỏ ui-observed`) |
| Số lượt chấm S4 | 6 · 4 · 1 · 1 · 6 · 3 · 1 | **1** ở 6/8, 2 ở 2/8 |
| Làn `panel` (hội đồng) | 1 vòng (4) | 0 | Đ5 «hội đồng theo yêu cầu» đang xảy ra tự nhiên |
| `vang-mat` (hệ thống chết) | 1 | 2 (đều `dieu-phoi`) | nhãn có từ 2.18.0 |
| Kit `nhan-trang-thai` / `ho-so-khep` | — | 13 + 8 eval `script`, 2 + (1) lượt, `finding` 15 | đúng nếp |

Đọc theo ĐỊNH VỊ: «thước ở cùng nhà với vật» đã thành mặc định (test của kho). Đổi lại, lớp nhìn-thấy mỏng đi:
0–1 `ui-check`/vòng và không đọc được «frame» nào từ `evals.yaml` ở cả 15 vòng — M2 chưa đo được bằng từ khoá.

## 3. Sổ quyết định và chữ ký

- **Mục Ngoài hợp đồng mỗi chữ ký (cách mới):** 1 · 2 · 7 · 8 · 10 · 21 dòng `revisit@gate2`. Owner gõ «ghi Known
  limits» cho hầu hết; «mở hợp đồng mới» 2 lần (`sua-luu-tru`). Cách cũ cùng cỡ (14 · 16 · 19 · 23).
- **Treo (quyết định máy ghi sau/không có dấu niêm) mỗi chữ ký:** 5 · 6 · 12 · 20 — **owner «phê hết» 4/4 lần**,
  không sửa mục nào. Đây là phép thử «người trả lời khác khuyến nghị thì dựa vào gì máy không có?» trả lời
  KHÔNG: các mục Treo là `bỏ coverage-scan`, `bỏ design-pass`, `KHÔNG làm X trong vòng này` — căn cứ là quy tắc
  đã khai, thuộc nhóm «máy đi tiếp, ghi sổ, cửa veto», không phải câu hỏi cho người.
- Lệnh cổng người / tin thường mỗi ngày trong phiên crm: 18/09 **17 / 95** · 20/09 **5 / 70** · 21/09 **29 / 110**
  · 22/09 **9 / 23**. Tỉ lệ tin-thường trên một lệnh cổng: 5,6 → 14 → 3,8 → **2,6**. Xu hướng đúng; 21/09 vẫn
  110 tin thường vì hai lượt chấm bị đốt và cửa sổ cài 2.18.0.

## 4. Chiều đỏ trong lịch sử (TDD) và thước : vật

| Vòng (mới) | commit chạm vật | chuỗi T/S/M | test-trước ở commit đầu | vật | thước | tỉ lệ |
|---|---|---|---|---|---|---|
| bang-cot | 1 | M | trộn | 43 | 490 | 11,4 |
| khai-lang | 4 | SMMM | KHÔNG | 1 084 | 1 207 | 1,1 |
| loi-vao | 11 | MMMMMTTSMMS | trộn | 2 145 | 1 868 | 0,9 |
| noi-bon-nut | 2 | MM | trộn | 751 | 1 178 | 1,6 |
| quan-ly-danh-muc | 10 | MMMMTTSMMS | trộn | 2 062 | 1 793 | 0,9 |
| khuon-mat | 1 | M | trộn | 60 | 332 | 5,5 |
| sua-luu-tru | 6 | MMMMMT | trộn | 2 178 | 3 117 | 1,4 |
| *cũ:* vao-bang-email | 22 | TTTSMM… | CÓ | 1 714 | 2 267 | 1,3 |
| *cũ:* cho-phep-ai | 69 | SSSSSMM… | KHÔNG | 26 871 | 5 882 | 0,2 |

(T = commit chỉ test, S = chỉ vật, M = trộn; docs/hồ sơ loại ra.) Ở crm, cả hai cách đều **trộn test và vật trong
một commit** — phiên viết test đỏ trước rồi commit cùng vật. Máy không đọc được «đỏ rồi xanh» từ lịch sử; nó đọc
được từ làn `baseline` của run-log (8/8 vòng mới có). Kit thì commit T trước S (vòng `ho-so-khep-thoi-hoi`: 8/8
cặp). Thước : vật của vòng tính năng ở 0,9–1,6, đúng vùng ngân sách; hai vòng vá nhỏ (43 và 60 dòng vật) lên
5–11 vì mẫu số nhỏ, đọc theo M4 là bình thường.

## 5. Skill gọi trong phiên crm (tool_use `Skill`)

| Skill | 16–20/09 (cũ) | 21–22/09 (mới) |
|---|---|---|
| `superpowers:brainstorming` | 8 | 1 |
| `superpowers:writing-plans` | 8 | 1 |
| `acceptance-gate:morphological-scan` | 8 | 3 |
| `acceptance-gate:design-pass` | 5 | **0** |
| `acceptance-gate:ux-ui-craft` | 3 | **0** |
| `acceptance-gate:uat-session` | 1 | 1 |
| `feature-loop:feature-loop` | 12 | 14 |
| Workflow S4 | 41 | 28 |

Giới hạn của phép đếm: skill nạp qua lệnh gạch chéo của người hoặc do feature-loop làm tại chỗ không hiện ở đây
(vd kế hoạch 10 task của `sua-luu-tru` tồn tại mà `writing-plans` đếm 0). Nhưng `design-pass` và `ux-ui-craft`
không có đường nạp ngầm nào: 0 là 0.

## 6. Điều đi ngược North Star, xếp theo giá

1. **Treo «phê hết» 5–20 mục/chữ ký** — trạm thu phí đo được 4/4. Chỗ sửa đúng tầng là lời mời (không phải răng):
   thẻ Cổng 2 phân loại từng mục Treo theo nguồn căn cứ; mục có quy tắc đã khai (`bỏ coverage-scan` khi phạm vi
   đóng, `KHÔNG làm X` đã ở Out of scope) → máy đi tiếp ghi sổ, cửa veto; chỉ mục thiếu quy tắc mới là ô hỏi.
2. **`bỏ design-pass` bằng lời** — lý do «dùng lại thành phần sẵn có» là lời dặn, không phải vật. Dạng đúng tầng:
   máy kiểm được (diff của vòng không thêm tệp component mới / không đổi tệp trong `packages/ui`) → tự bỏ có
   bằng chứng; ngược lại → S1-D chạy. `sua-luu-tru` đổi `packages/ui/src/components/combobox.tsx` mà vẫn bỏ.
3. **Ý định 4/8** — hai vòng lớn nhất không có `opportunity.md` (`sua-luu-tru` 15 AC, `noi-bon-nut` 10 AC) vì owner
   giao thẳng trong phiên. Đường B hợp lệ, nhưng S4 không có ý định để đọc ở Cổng Bằng chứng (Đ7 mỏng vô hiệu).
4. **Chiều đỏ không ở lịch sử** — câu «commit test đứng trước commit vật» của ĐỊNH VỊ chưa đúng ở kho tiêu thụ;
   bằng chứng đỏ nằm ở làn `baseline`. Sửa lời ĐỊNH VỊ cho khớp vật, hoặc dặn commit tách — chọn cái đầu (vật đã
   có, lời chưa khớp).
5. **`loi-vao` không có thẻ nào cho người** — làn V cả hai cổng, 3 quyết định máy (`bỏ design-pass`, `bỏ
   coverage-scan`, `bỏ ui-observed`) chỉ được người thấy khi `observed`. Đúng luật hôm nay; ghi để phiên tổng kết
   đặt cạnh M3.

## 7. Điều đi đúng, để không cắt nhầm

- Bỏ bước nào cũng có tên trong sổ: 24 dòng `bỏ … — <lý do>` trên 8 vòng, 0 bỏ im lặng.
- Thẻ Cổng 2 trình mọi quyết định S1 của vòng làn V thành «CHƯA duyệt» — lưới cho phân loại sai chạy đúng.
- Số lượt chấm 1/vòng ở 6/8; `duong-nen.md` 8/8 tách đỏ-hạ-tầng; `usage-report.md` 6/8 cho dòng token đo được.
- Thước là test của kho: 28/29 · 13/14 · 13/14 — «vật tạo ra bàn giao» đang xảy ra.

## 8. Việc kế — vào phiên tổng kết, không mở ô

Bốn điểm §6.1–6.4 là đầu vào cho phiên tổng kết (`docs/superpowers/plans/2026-09-22-tong-ket-hieu-qua-cach-moi-cua-so-2-18.md`
§5 câu 2 và câu 6); thành hạt giống có `Gốc:` khi phiên ấy chốt. Không thước mới, không vòng meta trong cửa sổ.

## Phụ lục — lệnh đo

Hai script tạm dùng trong phiên điều phối 22/09, chép lại để tái lập: `audit_ho_so.py <repo> <ref> <slug,…>`
(đọc contract/evals/run-log/decisions/review-findings/evidence-report của từng slug ở `<ref>`; in hạng, mục hợp
đồng, executor, làn run-log, loại dòng sổ, tệp hồ sơ) · `audit_skill.py <thư mục transcript…>` (đếm `tool_use`
Skill/Workflow/Agent theo ngày) · đếm lệnh người: regex `<command-name>(/[^<]+)` trên các dòng `role: user`
không `isMeta` · TDD: `git rev-list --reverse <S1>^..<ký>` rồi phân loại tệp `.spec|.test|/test/|/rang/|evals.yaml`
= thước, `_acceptance/|docs/|*.md` = loại, còn lại = vật.
