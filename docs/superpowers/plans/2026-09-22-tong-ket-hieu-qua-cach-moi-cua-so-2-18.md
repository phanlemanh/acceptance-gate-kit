# Kế hoạch phiên tổng kết — hiệu quả hoạt động của kit theo cách mới, cửa sổ 2.18.0 → 2.18.1

**Ngày:** 2026-09-22 · **Chủ:** owner gọi tên 22/09 («khi kit 2.18.1 xong, một phiên tổng kết
lấy dữ liệu của các phiên đã chạy theo cách mới») · **Phiên:** MỚI, ngữ cảnh sạch, mở bằng chip
từ phiên điều phối SAU KHI PR vòng `ho-so-khep-thoi-hoi` gộp và mốc 2.18.1 cắt.

## 0. Một trang

Phiên này KHÔNG dựng thước mới (luật chiều rộng (a)) và KHÔNG mở vòng meta (luật (b)). Nó làm
ba việc đã có nghi thức sẵn, đặt cạnh nhau để một người đọc trong mười phút thấy kit có
đi nhanh hơn mà vẫn tin được không:

1. **Cổng Giá trị của hai vòng meta trong cửa sổ** — `/acceptance-gate:uat-session
   nhan-trang-thai-va-reality` và `/acceptance-gate:uat-session ho-so-khep-thoi-hoi`: đặt số đo
   cạnh ngưỡng đã chốt ở Cổng Đáng của chính hai ô, owner ký release / iterate / kill. Đây là
   cơ chế có sẵn của kit cho câu «vòng này có đáng không», không phải bản tổng kết tự do.
2. **Năm dòng số của luật (c) cho TỪNG vòng chạy theo cách mới** (bảng §2), đọc từ vật máy ghi,
   không từ lời kể. Hai vòng crm chạy TRƯỚC cách mới (`thuoc-khai-dung-tieng`,
   `ho-so-khai-dung-tieng`) làm nhóm đối chứng.
3. **M1–M6 so với nền 21/09** (bảng §4 của `docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md`,
   dòng 148–153): cùng lệnh đo, cùng nguồn, chỉ đổi cửa sổ thời gian.

Đầu ra: MỘT bản `docs/findings/2026-09-2x-tong-ket-cach-moi-cua-so-2-18.md` (hình theo
DIAGRAM-RULE), hai verdict UAT do owner ký, dòng số vào Notes hồ sơ mốc 2.18.1. Phát hiện mới →
hạt giống, KHÔNG mở ô. Người: owner ký hai verdict (2 chạm) và đọc bản tổng kết.

## 1. Vòng lấy dữ liệu (theo cách mới = từ 21/09, có `opportunity.md` hoặc đi qua 2.18.0)

| Kho | Hồ sơ | Đường | Kết cục | Nguồn số |
|---|---|---|---|---|
| crm | `dieu-phoi-30-ngay-dau` | T3, chấm lại bằng phiên mới sau 3 lượt bị đốt | ký, PR #66, `observed` | `_acceptance/…/{run-log.jsonl,decisions.jsonl,evidence-report.md,usage-report.md}` |
| crm | `loi-vao-dieu-phoi-30-ngay` | T2 làn V machine-cleared | PR #67, `observed` | như trên |
| crm | `quan-ly-danh-muc-30-ngay` | T2, 2 lượt chấm | ký, PR #68, `observed` | như trên |
| crm | `bang-cot-loi-va-nhan` | T2 làn V | ký, PR #69 | như trên |
| crm | `noi-bon-nut-dieu-phoi` | T2 | ký, PR #71 | như trên |
| crm | `khai-lang-gioi-thieu` | vòng nhỏ đầu tiên: 3 cổng + 1 P0, 1 lượt chấm, 0 bàn đo | ký, PR #72, `observed` | như trên |
| crm | `sua-luu-tru-dieu-phoi` | T3, ký → lưới đòi E29 → chấm lại → ký lại | PR #74 | như trên |
| crm | `khuon-mat-bo-phan` | T2 làn V, 1 lượt chấm | machine-cleared, PR #75 | như trên |
| crm | `chi-quan-tri-sua-duoc-truong` | T3, S1 → ký ≈ 90 phút, 3 lượt gọi người | ký, PR #76 | như trên |
| crm | `ke-hoach-la-mot-ban-ghi` | T3 (vòng kéo UX màn điều phối về khuôn chung — hệ quả của bỏ design-pass), 20/20 lượt đầu | ký, PR #77; uat-session HOÃN sang lượt 2 | như trên |
| crm | `moi-phia-deu-thay-ke-hoach` (lượt 2) | T3, có bản bấm được 13 trạng thái (S1-D chạy thật) | (đang S3 22/09) | như trên |
| crm | 3 hồ sơ cũ đóng bằng `observed` (`cua-vao-noi-tieng-viet`, `tieng-viet-cho-crm`, `nhan-ung-dung-noi-tieng-viet`) | reality đóng | PR #70 | `decisions.jsonl` dòng `thuc-te` |
| crm | **đối chứng** `thuoc-khai-dung-tieng` (9 lượt) · `ho-so-khai-dung-tieng` (4 lượt, REJECT) | cách cũ | tháp 57 : 1 | như trên |
| kit | `nhan-trang-thai-va-reality` | T3, vòng meta duy nhất cửa sổ 2.17→2.18 | ký, PR #194 | như trên + `wf-usage` |
| kit | `release-2-18-0` · chiến dịch ghim lại 65 + nghỉ 15 | làn V | #195, #196 | hồ sơ mốc, `docs/findings/2026-09-22-chien-dich-ghim-lai-2-18-0.md` |
| kit | `ho-so-khep-thoi-hoi` | T3, 4 lượt gọi người (trả lại 1 lần → nâng phạm vi), 3 lượt chấm (BLOCKED hạ tầng · PASS · PASS) | ký `28809024`, PR #202 | như trên + `wf-usage` (1,47 M · 1,25 M · 1,34 M) |
| kit | `release-2-18-1` | làn V, 1 lượt gọi người, 4 Known limits (suite 601 s) | #204 `ccabea22` | hồ sơ mốc: 5 dòng số + M3 `0 / 8` |
| kit | sự cố `main` đỏ hậu-gộp ×2 (#196 LM20 · #202→#203 merge-base) | — | vá trong ngày | hạt giống `ca-do-neo-ref-tuong-doi` |
| kit | audit S4 22/09 (`docs/findings/2026-09-22-audit-s4-cach-moi-thong-le-co-bi-bo-qua.md`, #201) | đầu vào §5 câu 2, 6 | — | hạt giống `audit-s4-bon-diem` |
| kit | `release-2-0-0` | đóng bằng `observed` (PR #199 → qua vòng) | reality | `decisions.jsonl` |

Transcript phiên (đếm lượt gọi người và chạm): `~/.claude/projects/-Users-manh-macmini-dev-crm-.claude-worktrees-zen-brattain-ac74d0/*.jsonl`
(crm-A, hai tệp nối tiếp) · `…-mystifying-wiles-84ba51/*.jsonl` (crm-rollout) · `…-zen-edison-7766af/*.jsonl`
(Kit-vòng 2.18.0) · `…-sweet-lumiere-b79aa8/*.jsonl` (Kit-vòng 2.18.1) · phiên điều phối
`-Users-manh-macmini-dev-acceptance-gate-kit/053aad10-*.jsonl`. Phiên B/C của `dieu-phoi` (bị đốt)
nằm trong `-Users-manh-macmini-dev-crm/*.jsonl` (`local_453c80d1`, `local_2d063e1c`).

## 2. Năm dòng số của luật (c) — mỗi vòng một hàng, LỆNH ĐO ĐI KÈM

| Dòng | Đọc từ đâu | Lệnh / quy tắc |
|---|---|---|
| 1 · làm-xong → quyết-được | commit `status: implemented` → commit `Gate 2 signoff` / `machine-cleared` / `observed` | `git log --format='%ci %s' -- _acceptance/<slug>/contract.md` |
| 2 · lượt gọi người, TÁCH trong / ngoài thiết kế, kèm số chạm | transcript: mỗi `<command-name>` `approve` / `signoff` / `observed` / `start` = 1 lượt trong thiết kế; mỗi tin người KHÔNG phải lệnh trong cửa sổ vòng = 1 lượt ngoài thiết kế; chạm = số tin người cho tới khi máy đi tiếp | script đếm trên jsonl (viết một lần trong phiên, ghi cạnh bản tổng kết, KHÔNG vào engine) |
| 3 · lượt chấm bị hạ tầng / hệ thống đốt | `run-log.jsonl` `kind:round-tally` có `vang-mat`; `cannotRun`; mã 97/127; dòng «hệ thống chết» trên thẻ | `grep -c` theo từng hình dạng, ghi tên lượt |
| 4 · token máy / vòng, tách 3 khối | `usage-report.md` của mỗi lượt S4 (chứng-minh-vật / tìm-lỗi / tổng hợp) | `wf-usage`; lượt không có báo cáo → ghi «không đo được», KHÔNG ước |
| 5 · phút máy / lượt chấm | `duration_ms` của Workflow, đường găng | như hồ sơ mốc 2.18.0 dòng 5 |

Điều kiện tin cậy của luật (c) áp nguyên: dòng 4–5 chỉ so sánh giữa hai mốc khi đường verdict
không đổi thành phần — 2.18.1 đổi làn V (đọc thêm sổ) nên GHI RÕ cắt ở đâu.

## 3. Ngưỡng UAT đã chốt ở Cổng Đáng — đặt số cạnh, không sửa ngưỡng sau khi thấy số

`nhan-trang-thai-va-reality` (opportunity.md §Ngưỡng): hồ sơ crm tàng hình 0 · PR #65 · lượt chấm
`dieu-phoi` bị đốt 0 · lượt ngoài thiết kế 0 (T3 ≤ 4) · dòng M3 `k / 3` · thước : vật ≤ 3 : 1.
`ho-so-khep-thoi-hoi`: hồ sơ khép trong NOTE veto 0 · ô hỏi trên thẻ hồ sơ khép 0 · ca khai-lang
tái lập «không xanh-sạch» · tệp crm tự vá 0 · hồ sơ ký đổi làn oan 0 · lượt gọi người ≤ 3 (đã lên
T3 → 4). Số nào đo được thì đo bằng lệnh của §7 kế hoạch điều phối; số nào KHÔNG đo được (crm chưa
cài 2.18.1) thì ghi «chưa đo — chờ cài» và verdict là `iterate`, không phải `release`.

## 4. M1–M6 so nền 21/09

Cùng lệnh, cùng nguồn như Phụ lục A của bản định vị; cửa sổ = 21/09 → ngày tổng kết. M3 là dòng
đáng nhìn nhất: N = số dòng `thuc-te` (crm 7 + kit 1 tính đến 22/09), k = số dòng `revisit` /
`supersedes` trỏ sự cố prod. **N không tăng so với mốc trước thì M3 vô hiệu** — ghi đúng chữ đó.
M4 đọc theo ngân sách khai ở Cổng Đáng, không đọc «càng thấp càng tốt».

## 5. Điều bản tổng kết PHẢI trả lời, mỗi câu một số + một chiều đỏ

1. Thời gian làm-xong → quyết-được có giảm không, và giảm ở đâu (cổng nào)?
2. Lượt gọi người ngoài thiết kế: bao nhiêu, gốc ở lớp nào (harness relay `/goal` · lưới đòi sau
   chữ ký · bàn đo · hỏi thật)? Mỗi gốc đã có hạt giống chưa?
3. Token: khối tìm-lỗi còn chiếm bao nhiêu, và bao nhiêu phát hiện của nó chạm phán quyết?
4. Reality: 8 hồ sơ đóng bằng `observed` — có hồ sơ nào sau đó đỏ ở prod không (k)?
5. Hai cược §6.1 của bản định vị (chất lượng thước từ *ép* sang *nhìn thấy*; lớp nhìn-thấy từ
   *frame giả* sang *mù có tên*) — số nào ủng hộ, số nào bác?
6. Điều gì đi ngược North Star (giờ người tăng, chi phí máy tăng mà kết quả ship không tăng)?

## 6. Ranh giới

- Không dựng thước mới, không vá engine, không mở ô. Phát hiện → hạt giống với `Gốc:`.
- Không đọc lại các finding cũ để «rà tồn kho» — tồn kho đã qua lọc 21/09.
- Owner xuất hiện đúng hai chỗ: ký hai verdict UAT; đọc bản tổng kết. Câu hỏi khác → máy dựng
  căn cứ trước, phép thử «người trả lời khác thì dựa vào gì máy không có?».
