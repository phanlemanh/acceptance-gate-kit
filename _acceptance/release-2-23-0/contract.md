---
schema_version: 1
feature: Phát hành kit 2.23.0 — đóng số cho cửa sổ 2.22.0 → 2.23.0 (hai vòng đã ký «nhan-lan-v-theo-huong» và «gia-lan-ghim-lai»: thẻ làn V đọc theo hướng, làn ghim lại rẻ hơn), để crm cài vào; làn V, không dựng răng
slug: release-2-23-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-06T09:32:10Z
---

# Acceptance Contract: release-2-23-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Vòng `gia-lan-ghim-lai` neo ở hồ sơ crm
`kiem-cheo-sau-gop` (sự cố R1g, PR crm-onehub#277); owner thu vòng về Vòng A với trần «2 ngày tới khi
crm bật được khoá». Phiên điều phối crm gọi mốc 06/10 ngay sau khi PR #268 gộp (`f3e03d8c`, owner bấm).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `nhan-lan-v-theo-huong` (T2, ký 05/10; PR #265) — thẻ làn V in dòng báo «đi tiếp hay kéo lại: đi tiếp».
- `gia-lan-ghim-lai` (T2, ký 06/10; PR #268) — làn ghim lại: chạy lại ca chập chờn, trần + mã 4, dấu khi
  bị ngắt, giết cả cây, tổng kết, env giống CI.

Ngoài hồ sơ: chiến dịch ghim lại 2.22.0 (#263), bản sửa bước dọn của bộ đo trang lộ trình (#264). Vật
engine đổi trong cửa sổ (`git diff --name-only v2.22.0 HEAD -- scripts lib hooks skills feature-loop commands vendor`):
`commands/acceptance-init.md`, `commands/signoff.md`, `feature-loop/scripts/repin-lane.mjs` và ba thư viện
`feature-loop/scripts/lib/{chay-lai,chay-lenh,lan-khoa}.mjs`, `feature-loop/skills/feature-loop/SKILL.md`,
`scripts/gate-card.js`, `skills/acceptance/references/human-facing-language.md`. **Lớp chép CI KHÔNG đổi**
(không tệp nào trong danh sách 17 tệp bị chạm).

Số là **2.23.0, không 2.22.1**: năm khoá mới, mã thoát mới 4, ba hành vi bật mặc định. Mốc **không đổi
một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.23.0` trong mô tả hai gói và
`CHANGELOG.md`), đi **làn V** như tiền lệ 2.5.0 → 2.22.0. Năm dòng số, bảng dự báo, điều kiện tin cậy
và dòng hiệu chuẩn nằm ở mục `2.23.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.22.0..HEAD` · nếp phát hành `_acceptance/release-2-22-0/` · bàn giao
`docs/handoff/2026-10-01-handoff-cat-moc-2-20.md` (khuôn các bước).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.23.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh aa29f5b5 …`, mốc = commit gắn tag `v2.22.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `aa29f5b5` (tag `v2.22.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.23.0` và mục `v2.23.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.23.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-22-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: mười bảy mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-22-0). Số trước/sau của làn ghim lại đọc ở AC-8 của `gia-lan-ghim-lai`.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Sửa Known limits của hai vòng trong cửa sổ — kể cả lỗi thẻ giấu mục ngoài hợp đồng mang hậu tố «(r1)» (việc riêng đã tách ở phiên gia-lan-ghim-lai).
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc gộp, chỉ khi lưới báo hoá cũ.
- Đưa crm nhận 2.23.0 (cài lại plugin, bật khoá) — việc của chủ kho crm sau khi tag có mặt; phiên kit không chạm kho crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào khớp `t3_paths`.
- Cả hai vòng của cửa sổ neo kho tiêu thụ (crm); luật (b) — mốc này là mốc KHO NHẬN kế tiếp sau 2.22.0.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-2): repin-lane.mjs header contract is stale: no exit 4 / 128+n, no --tran-phut, and «env hiện tại» is no longer true — Lời giải thích ở đầu công cụ ghim lại còn thiếu một mã kết quả mới và một tuỳ chọn mới, nên ai chỉ đọc phần đó sẽ hiểu sai cách dùng. Phần hướng dẫn chính thức đã cập nhật đúng.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-3): The «lệch kỳ vọng» predicate now has a third hand-written copy — Cùng một quy tắc phán đoán đang được viết tay ở ba chỗ. Hôm nay chúng khớp nhau, nhưng nếu sau này chỉ sửa một chỗ thì việc chạy lại và việc chốt kết quả có thể kết luận khác nhau.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-5): doChiPhi takes the first numeric token: thousands separators and leading numbers give a wrong cost delta with no warning — Nếu lệnh đo chi phí in số có dấu phân cách hàng nghìn hoặc có số khác đứng trước, con số chi phí báo cho người quyết định sẽ sai mà không có cảnh báo. Mức chênh lệch trông hợp lý nên dễ bị tin nhầm.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-6): A large lane budget overflows setTimeout and triggers vuot-tran (exit 4) right away — Nếu ai đó đặt trần thời gian cho một lượt ghim lại ở mức rất lớn để ý nói không giới hạn, mọi lượt sẽ bị dừng ngay lập tức và báo vượt trần. Chỉ xảy ra khi đặt con số cực lớn.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-8): Hình dạng 1/2 — AC-6 rút danh sách khoá từ khối LAN-KHOA, mà bộ đọc thật (docKhoa) không dùng khối đó — Danh sách các khoá cấu hình ghi trong tài liệu và danh sách mà công cụ thật sự đọc là hai bản riêng. Thêm một khoá mới mà quên cập nhật tài liệu thì kiểm thử vẫn xanh.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-9): Hình dạng 6 — Chiều đỏ của E1–E6 và chiều xanh của E7 đo bản archive cố định SAU-GIA, không đo cây đang kiểm — Bộ đo kiểm tra lỗi dùng một bản chốt cố định thay vì cây đang kiểm. Hôm nay hai bản giống nhau nên chưa sai, nhưng sau này nếu bài kiểm bị làm yếu đi mà không đánh dấu thì bộ đo có thể không nhận ra.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-10): Hình dạng 5+4 — Chiều đỏ AC-7 hứa mỗi khoá một bản sao + ghim «đổi mặc định: <khoá>» / «thêm ngoài danh sách»; ma trận chỉ có 3/5 khoá, ghim là mảnh vi phân hoặc chính chuỗi tiêm — Tài liệu hứa mỗi khoá cấu hình đều có phép thử gây lỗi riêng, nhưng thực tế chỉ 3 trong 5 khoá có. Người đọc có thể tưởng độ phủ đầy đủ hơn thực tế.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-11): Hình dạng 2/3 — Round-trip khuôn REPIN-TEMPLATE chỉ so khoá tầng ngoài; trường lồng không được đo (writer ghi tong_ket.chi_phi_loi ngoài khuôn; chap_chon[].lenh không ca nào ghim) — Phép kiểm khuôn dòng ghi lại chỉ soi lớp ngoài cùng, nên một số trường bên trong có thể bị thiếu hoặc thừa mà không ai phát hiện. Hậu quả là sổ ghim lại có thể thiếu thông tin mà kiểm thử vẫn xanh.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-12): Hình dạng 2 — «Bảng chân trị viết trước» của AC-1 nằm trong chính module được đo; ca đọc kỳ vọng từ vật — Bảng đáp án dùng để kiểm quy tắc chạy lại nằm cùng chỗ với chính quy tắc đó. Nếu ai sửa cả hai cùng lúc theo hướng sai thì kiểm thử vẫn xanh.
- known-limits (Cổng Bằng chứng 06/10, Ngoài-13): Hình dạng 5 — AC-4 hứa hai ô lỗi của lệnh đo chi phí («thoát 1 / không in số»), ca chỉ phủ một ô — Khi lệnh đo chi phí chạy xong nhưng không in ra con số nào, không có phép kiểm nào xác nhận thông báo lỗi hiện đúng. Trường hợp này chưa được kiểm thử.
- Hạt giống mới của cửa sổ: `docs/plans/2026-10-06-hat-giong-rang-lan-ghim-lai-sau-moc-2-23.md` (Ngoài-1, Ngoài-4, Ngoài-7 → «mở hợp đồng mới», owner 06/10).
