---
schema_version: 1
feature: Phát hành kit 2.20.0 — đóng số cho cửa sổ 2.19.0 → 2.20.0 (hai vòng đã ký «thuoc-biet-truoc-khong-phan-duoc» · «luot-cham-ghi-vao-cay» và một vòng máy thông «nghi-van-mang-co-qua-han»: giám khảo chỉ được hỏi điều nằm trong danh sách tệp, lượt chấm mà cây đổi giữa chừng không dùng được, hồ sơ đã nghỉ thôi làm đỏ bộ kiểm theo ngày), để crm cài vào; làn V, không dựng răng
slug: release-2-20-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-01T16:54:17Z
---

# Acceptance Contract: release-2-20-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Ba neo của cửa sổ đều nằm ở crm: `va-tro-ly-okr-sau-thu`
(giám khảo hỏi diff mà hội đồng bị cấm đọc), `hydrat-giai-doan-deals` (30/09, kit 2.19.0) và
`claimdue-chi-thay-dong-cua-minh` (24/09) (tác tử chấm ghi vào cây giữa lượt). crm đang có vòng
`soan-okr-cung-tro-ly` ở lượt chấm cuối nên CHƯA nhận ngay — đưa crm nhận là việc sau mốc, khi owner báo
vòng ấy đã ký và gộp. Owner gọi mốc 01/10 («tạo chip cắt mốc phát hành»; bàn giao
`docs/handoff/2026-10-01-handoff-cat-moc-2-20.md`, PR #235).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- Hồ sơ **được ký** trong cửa sổ (tập của AC-4):
  - `thuoc-biet-truoc-khong-phan-duoc` (T2, owner ký 01/10, PR #233) — `feature-loop/scripts/s4-args.mjs`
    thoát 2, gọi tên eval, khi một eval `judgment` hỏi diff của lượt hoặc bảo chạy lệnh (bộ dò một nguồn
    `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs`); luật chọn người chấm theo từng vế ở
    `eval-executors.md`, hai SKILL và `judge-personas.md`.
  - `luot-cham-ghi-vao-cay` (T3, owner ký 01/10, PR #234) — lượt mà tác tử chấm ghi vào cây (commit lạ
    hoặc tệp vật bị sửa) mang nhãn «cây đổi trong lượt chấm» và không dùng được; nhãn đi qua một nguồn
    `lib/nhan-canh-gay.cjs`, thẻ Cổng Bằng chứng, lưới trước-merge và `recheck-evidence.cjs` cùng đọc.
- Hồ sơ **máy thông** trong cửa sổ — KHÔNG thuộc tập của AC-4 vì `scripts/rel-cua-so.sh` chỉ rút hồ sơ
  `signed-off` (xem Notes): `nghi-van-mang-co-qua-han` (T2, máy thông 01/10, cửa veto mở, PR #232) — lối
  nghỉ của `scripts/start-scan.mjs` mang cờ quá hạn, nên ca RT13 thôi đỏ theo NGÀY trên `main`.
- PR #231 — một dòng `CONTEXT.md`: `_Avoid_` của «đạt-có-giới-hạn» về đúng term. Không phải hồ sơ.

Vật engine đổi trong cửa sổ: mười ba tệp (đo: `git diff --stat v2.19.0 HEAD -- scripts lib hooks skills
feature-loop commands vendor`). **Lớp chép CI ĐỔI lần này** — ba tệp của khối `GUIDE-CI-COPY-LIST` (và
`INIT-CI-COPY-LIST`, cùng mười lăm tên): `lib/nhan-canh-gay.cjs`, `scripts/pre-merge-check.sh`,
`scripts/recheck-evidence.cjs`. Kho còn đường chép vì thế phải chép lại đủ ba tệp LẪN cài lại plugin.

Số là **2.20.0, không 2.19.1**, vì cửa sổ thêm hành vi mới ở đường chấm: bước chuẩn bị tham số từ chối
một loại eval, bộ chấm có một nhãn trạng thái mới, lưới trước-merge và bộ kiểm lại bằng chứng đọc nhãn
đó. Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.20.0` trong mô
tả hai gói và `CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0 → 2.19.0. Năm dòng số của luật (c), bảng
dự báo, điều kiện tin cậy và dòng hiệu chuẩn nằm ở mục `2.20.0` của `CHANGELOG.md` — một nguồn, hồ sơ
không chép lại.

Source input: `git log v2.19.0..HEAD` · nếp phát hành `_acceptance/release-2-19-0/` · bàn giao 01/10.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.20.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 7f45f37d …`, mốc = commit ký của `v2.19.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `7f45f37d` (tag `v2.19.0`), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.20.0` và mục `v2.20.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.20.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-19-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: mười bốn mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-19-0). Ngưỡng của hai răng mới (eval judgment hỏi ngoài inputs tới được lượt chấm · lượt chấm mang nhãn «cây đổi») đếm SAU khi crm cài, bằng script quét `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs`.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1). Kể cả cho `scripts/rel-cua-so.sh` rút thêm hồ sơ máy thông (Notes).
- Sửa Known limits của ba vòng trong cửa sổ — đều là mã cổng hoặc ca kiểm; xếp cho cửa sổ kế nếu owner gọi tên.
- Các hạt giống của cửa sổ (`docs/plans/2026-10-01-hat-giong-*.md`) — đã có ô trích tên, mốc không làm chúng.
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc gộp, chỉ khi lưới báo hoá cũ.
- Đưa crm nhận 2.20.0 (chép ba tệp lớp CI, cài lại plugin, đo trước→sau) — việc SAU khi tag có mặt và vòng `soan-okr-cung-tro-ly` của crm đã ký và gộp.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có ba vòng chạm engine. Hai vòng (`thuoc-biet-…`,
`luot-cham-…`) có neo ngoài ở hồ sơ crm và sửa đường chấm mà crm đang vấp; vòng thứ ba
(`nghi-van-mang-co-qua-han`) sửa ca kiểm đỏ theo ngày của chính kit, mở theo lời owner ở sổ
`d-20261001T025809Z-11` của `thuoc-biet-…` — đó là suất meta duy nhất của cửa sổ.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Tag `v2.20.0`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không
là tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn** — cùng lý do mốc 2.18.3 (giới hạn Ngoài-1 của
`ha-tang-khong-dot-luot`).

**Bàn giao lệch công cụ (phát hiện khi mở hồ sơ):** bàn giao 01/10 bảo chạy `rel-cua-so.sh` với «ba slug
của cửa sổ»; lệnh ấy thoát 1 vì `nghi-van-mang-co-qua-han` là `machine-cleared`, mà công cụ chỉ rút
`signed-off`. Mốc giữ định nghĩa của công cụ (AC-4 = tập được ký) và kể vòng máy thông riêng trong
Context; sổ `d-20261001T165533Z-3`. Hệ quả khai thẳng: AC-4 không phủ hồ sơ máy thông — một mốc quên kể vòng máy thông
sẽ không đỏ. Ngưỡng mở việc sửa công cụ: ≥1 mốc kể thiếu một vòng máy thông mà chỉ người đọc diff bắt được.

**Chỗ cắt cho cửa sổ kế** (không mở ô — bốn mục có ca thật trong cửa sổ):

1. **Thuế tự-host:** vòng ở kho kit đi tới «máy thông» phải khai một dòng vào khối `KHAC-BIET-DOC-CU`
   của `ra-co-ten-lam-va-trao` rồi ghim lại hồ sơ đó — PR #232 đỏ CI hai lần liên tiếp vì đúng việc này.
   Hạt giống `docs/plans/2026-10-01-hat-giong-thue-tu-host-rt13-may-thong.md`.
2. **Phép đo dài hơn trần 600 giây của làn máy** — ca thật thứ hai: crm `soan-okr-cung-tro-ly` (01/10)
   có một phép đo chạy 35 phút, phải khai không-chạy và đo ngoài lượt chấm; cùng vòng đó hai phép đo dài
   tranh một khoá cộng lại vượt trần, phải đưa thêm một phép ra ngoài lượt. Hạt giống
   `docs/plans/2026-10-01-hat-giong-phep-do-qua-tran-lan-may.md`.
3. **Tham số lượt chấm bằng đường tệp** — hai lần trong ngày: 35 KB ở kit, 196 KB ở crm, cả hai phải
   sinh bản bộ chấm nhúng tham số khác bản gốc đúng một dòng. Hạt giống
   `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md`.
4. **Ca thật đầu tiên cho hạt giống «bất biến sản phẩm»**
   (`docs/plans/2026-09-02-hat-giong-bat-bien-san-pham.md`): ở crm, thước quyền xem OKR nằm trong
   `rang/` của một hồ sơ đã ký nên tắt im hai ngày — lưới stale chỉ soi hồ sơ có tệp trong diff PR, năm
   lời đọc lọt qua hai PR có cổng xanh, vòng chạm hồ sơ kế tiếp gánh nợ và không ghim lại được.
