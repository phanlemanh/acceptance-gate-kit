---
schema_version: 1
feature: Phát hành kit 2.18.0 — đóng số cho cửa sổ 2.17 → 2.18 (hai vòng chạm engine đã ký «ghim-lai-noi-ra-o-khong-do» + «nhan-trang-thai-va-reality»), để kho crm — đang chờ đúng ba thứ bản này mang tới — nhận engine theo mốc có chủ đích; làn V, không dựng răng
slug: release-2-18-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + CHANGELOG + workspace hồ sơ + bản đồ — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-21T12:40:00Z
---

# Acceptance Contract: release-2-18-0

## Context

**Kho chờ nhận — một, đo được trước khi cắt** (lần đầu một mốc kit có kho chờ nhận định sẵn,
kế hoạch `docs/superpowers/plans/2026-09-21-dieu-phoi-cach-moi-kit-va-crm.md`):

- **crm** (nhánh onehub) — ba hồ sơ đang chờ đúng ba thứ kit chưa có trước bản này:
  `nhan-ung-dung-noi-tieng-viet` — vật ở prod từ `ff3fb8bf`, hồ sơ `approved / BLOCKED / chữ ký
  rỗng`, chặn PR crm #65; owner quyết đóng 18/09 mà kit không có chỗ ghi (nay: `observed`).
  `dieu-phoi-30-ngay-dau` — trần nhát sửa thước nổ vì ba nhát vào test của kho, và thẻ BLOCKED
  in «không cần làm gì» khi một eval đỏ vì bàn đo (nay: test là vật, thẻ gọi tên cạnh gãy).
  Hồ sơ `ho-so-*` đóng băng tới 2.18.0 theo kế hoạch.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `ghim-lai-noi-ra-o-khong-do` (T2, ký 20/09, #190) — làn ghim lại nói ra ô nó không đo: hai
  khoá mới trên dòng pin, section Re-pin và thẻ cả hai cổng nêu «AC không có chốt máy», W8 nói
  kèm giá. Không đổi hành vi chặn nào.
- `nhan-trang-thai-va-reality` (T3, ký 21/09, #194, ADR 0020) — test của kho là vật và thước
  chỉ-đọc trong lượt chấm; thẻ Cổng Bằng chứng gọi tên cạnh gãy và mở ô ký kèm giá; trạng thái
  thứ bảy `da-cham-boi-thuc-te` cùng thao tác cổng người thứ bảy `observed`; ý định in lên thẻ;
  dòng hiệu chuẩn `ĐẠT đã ký → prod đỏ: k / N`.

Ngoài hai hồ sơ ấy, cửa sổ còn hai PR tài liệu và sổ sách của chính kit (#191 hạt giống retro,
#192 định vị lại kit) — **không đi theo bản phát hành**, không đổi gì ở kho tiêu thụ.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.18.0`
trong mô tả hai gói và `CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0/2.7.0/2.17.0.

Source input: `git log 2826f807..4e14da81` · nếp phát hành `_acceptance/release-2-17-0/` ·
lệnh owner 21/09 «Gộp PR #194 rồi cắt mốc 2.18.0».

## Năm dòng số của luật (c) — cửa sổ hai ngày

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | `ghim-lai`: trong ngày 20/09 · `nhan-trang-thai`: S4 lượt 2 xong 11:13Z → ký 11:54Z, ≈ 41 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | `nhan-trang-thai`: **4** = trần T3, 0 ngoài thiết kế (Đáng · Phạm vi · 1.5 · Bằng chứng), mỗi lượt **1 chạm**; ba tin người tự gửi giữa vòng («kiểm tra agent», «gỡ goal») không phải máy gọi · `ghim-lai`: owner trả lại **2** lần ở Cổng Bằng chứng vì phép đo tự dối trong chính bộ ca (ngoài thiết kế) | sổ quyết định + hội thoại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** lượt — `nhan-trang-thai` S4 lượt 1 BLOCKED: harness Workflow chuyển nguyên văn tin người dùng mới nhất vào mọi tác tử con, một tác tử từ chối chạy; `ghim-lai`: 0 | `run-log.jsonl` round-tally |
| Token máy / vòng | `nhan-trang-thai` lượt 2: **1,39 M** token tác tử; tách ba khối theo out-token: chứng-minh-vật (machine+baseline) 14,7 k · tìm-lỗi (review+triage) 19,7 k · tổng hợp (capture+synthesize) 31,0 k. Lượt 1 (108 k out-token) **không tách được** — nhãn vai bị khung chuyển tiếp nuốt · `ghim-lai`: **không đo được** — không có `usage-report.md` | `usage-report.md` |
| Phút máy / lượt chấm | `nhan-trang-thai` lượt 2: ≈ 24 phút, đường găng là khối machine 1 000 s (suite scripts 523 s · plugins 385 s) · lượt 1 không tách được · `ghim-lai`: không đo được | `duration_ms` Workflow + bảng vai |

**Điều kiện tin cậy (ràng buộc, không phải chỉ số):** đường verdict đổi thành phần trong cửa sổ
này — `nhan-trang-thai` thêm phân nhãn cạnh gãy và thước chỉ-đọc, cả hai kèm răng hai chiều
(ca đỏ + ca im: NC-AC6, NT-AC3-im). Số lượt chấm SAI không tăng: lượt 1 bị đốt vì hạ tầng, không
chấm sai vật. Dòng 4–5 vì thế cắt được cho lượt 2, và khai «không đo được» cho phần còn lại thay
vì đoán.

**Đọc được, không phải đo hình thức:** dòng 3 là con số đáng nhìn nhất — lớp nhiễm tin chuyển
tiếp đã đốt lượt chấm ở cả `crm` (hai lượt, «Dừng nó») lẫn kit (một lượt, «gỡ goal»). Hạt giống
đã có ở phiên điều phối (PR #193); không mở ô ở đây.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 2826f807 …`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU — hồ sơ được ký mà mốc không kể là mốc nói dối về cửa sổ.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.0` và mục `v2.18.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.0` — đo trên đoạn cắt từ `v2.18.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-17-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) `[thước CE: bảy mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-6; không ô mới, không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-17-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước.
- Chiến dịch ghim lại các hồ sơ đã ký, kể cả dòng nghỉ cho `thuoc-co-cua` (E17 trần nhát mất tiền đề) — §7.1: việc SAU khi mốc merge.
- Cài bản mới lên `crm` và đóng/chấm ba hồ sơ của nó — việc SAU khi mốc merge (phiên crm-rollout), và là thước thật của mốc này.
- Sửa tám giới hạn có tên của `nhan-trang-thai-va-reality` và các giới hạn của `ghim-lai-noi-ra-o-khong-do` — đã ký với giới hạn.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng
suy từ kho, hồi quy là bốn suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto
lúc nào cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có HAI vòng meta, không phải một. `ghim-lai` là vòng
meta duy nhất được phép sau khi hai kho nhận 2.17.0 (owner gọi tên 20/09); `nhan-trang-thai` là
vòng cấu trúc MỘT-lần mà ADR 0020 và khối ĐỊNH VỊ của CLAUDE.md cho phép, buộc vào chính mốc
này. Không có vòng meta thứ ba nào được mở trước khi `crm` cài 2.18.0.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: một kho, ba hồ sơ, mỗi hồ sơ một lý do đo được. Ngưỡng đang đếm: một mốc cắt số mà sau
21 ngày không kho nào cài nó.

**Chỗ cắt cho cửa sổ kế (được phép ghi, không thành ô):** lớp nhiễm tin chuyển tiếp vào tác tử
con (hạt giống ở PR #193); hợp nhất bộ đọc `paths`
(`docs/plans/2026-09-20-hat-giong-hop-nhat-bo-doc-paths.md`).
