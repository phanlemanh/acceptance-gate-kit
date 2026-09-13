---
schema_version: 1
feature: Phát hành kit 2.12.0 — đóng số cho cửa sổ 2.11→2.12, THUẦN CẮT SỐ. Hai vòng đã ký trong cửa sổ đưa 253 tiêu chí tới bốn kho tiêu thụ và đóng cửa veto sau chữ ký.
slug: release-2-12-0
owner: phanlemanh@gmail.com
risk_tier: T2               # KHÔNG chạm t3_paths — mốc này chỉ cắt số. Khác 2.10.0 và 2.11.0 vốn phải lên T3 vì vá lib/** TRONG mốc. Vì là T2 nên làn V mở.
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: release-2-12-0

## Context

Cửa sổ `698badbf` (mốc 2.11.0) → `97e2d713`: **99 commit, HAI vòng đã ký.**

- `cua-veto-sau-chu-ky` (T3, PR #172) — chữ ký người ở Cổng Bằng chứng đóng cửa veto;
  lưới trước-merge và máy quét `/start` thôi nói «owner chưa veto» về hồ sơ đã ký.
  Lưới từng nói sai **27 trên 30** hồ sơ.
- `cong-nguoi-doc-du-nguon` (T3, PR #174) — thẻ đọc được tiêu chí khai bằng TIÊU ĐỀ
  `### AC-n` và cả ba cách đặt tên mục, ở cả ba bên gọi; mục `## Coverage` viết bằng
  bảng hoặc văn xuôi thôi bị báo là vắng.

**Mốc này THUẦN CẮT SỐ.** Không vá gì trong mốc. Đó là khác biệt có chủ ý so với hai
mốc trước: 2.10.0 vá lỗ fail-open làn V và 2.11.0 vá bộ giải nháy, cả hai đều kéo hồ
sơ mốc lên T3 và mất lối làn V. Cửa sổ này không có lỗ nào đòi vá gấp, nên mốc giữ T2.

**Vì sao mốc là việc kế tiếp, không phải một vòng nữa.** Tám kho tiêu thụ đang chạy bộ
bóc tiêu chí CŨ — `lib/ac-line.cjs` ở cả tám trùng byte với kit 2.11.0. Giá trị của hai
vòng trên chỉ chạm người ở BẢN PHÁT HÀNH; tới lúc đó nó là mã nằm trên `main`.

Đo trên hồ sơ thật của tám kho, ngày 13/09:

| Kho | Hồ sơ | Đọc thêm | Tiêu chí cứu được |
|---|---:|---:|---:|
| crm | 31 | 10 | 80 |
| artifact-platform | 192 | 7 | 71 |
| ap-media-roadmap | 192 | 7 | 71 |
| oneflow | 40 | 3 | 31 |
| map · policy-graph-hub · media-library · floorplanstudio | 38 | 0 | 0 |
| **TỔNG** | **493** | **27** | **253** |

Con số 1 110 từng nêu trong thân PR #174 đo trên 22 cây, gồm chính kho kit và các bản
sao worktree. Số chạm kho tiêu thụ là **253**.

## Criteria

### AC-1 (cắt số) — 2.12.0 nhất quán ở mọi bề mặt người dùng đọc

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy ca thường trực `P200`
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang `2.12.0`; `GUIDE.md`
dẫn xuất số từ manifest chứ không gõ tay; và mục mô tả của chính số đó nói người dùng
nhận gì. Ca `P200` là ca VĨNH VIỄN đọc mọi số TỪ manifest — hồ sơ này KHÔNG dựng dàn
đo dùng-một-lần, vì ba mốc 2.0.0 · 2.1.0 · 2.2.0 mỗi lần tự dựng một dàn riêng và mỗi
vòng soi lại tìm ra một cách nó không đo thật.

### AC-2 (cắt số) — `diagram-design` giữ 2.7.0, có bằng chứng đo được KHÔNG fail-open

**Given** `diagram-design/` không đổi dòng nào trong cửa sổ
**When** chạy răng `rang-moc.sh --chan diagram` của hồ sơ này
**Then** răng xanh, và nó xanh vì ĐO chứ không vì thiếu vật: mốc so suy TỪ KHO (commit
gần nhất chạm manifest của `diagram-design`), không gõ vào cấu hình; bốn lối hỏng đều
có mã thoát riêng (không tìm được lần cắt số · cửa sổ rỗng · có đổi sau lần cắt số ·
không đọc được số tại HEAD).

### AC-3 (không hồi quy) — bốn suite và bản đồ sản phẩm XANH tại HEAD của mốc

**Given** cây tại HEAD sau khi cắt số
**When** chạy `tests/scripts` · `tests/hooks` · `tests/plugins` · `tests/workflows` và
`product-map.mjs --root . --check`
**Then** cả năm đều thoát 0. Cắt số là sửa manifest, và manifest được đọc bởi bộ giải
plugin lẫn ca thường trực — nên «chỉ đổi ba dòng số» KHÔNG phải lý do bỏ lưới.

### AC-4 (hồ sơ mốc) — bốn khối bắt buộc, có nguồn rút cho từng số

**Given** `## Notes` của hợp đồng này
**When** người đọc ở Cổng Bằng chứng
**Then** có đủ: **ba dòng số** của luật (c) · **bảng lớp vendored** 9 mục với số +/−
đo tại sha nêu tên · **lớp lỗi tái phát** gọi tên kèm dẫn chứng · **nhát cắt kế** gọi
tên. Mỗi số phải nói được nguồn rút. Khối nào cố ý để trống phải khai rõ lý do, không
được là khối rỗng.

## Coverage

Quét bằng `morphological-scan`, preset test-matrix. Hai trục, không gian Core = 8 ô.

| Trục | Giá trị |
|---|---|
| VẬT bị đo | manifest của ba plugin · `GUIDE.md` · `diagram-design/` · bốn suite · hồ sơ mốc |
| CHIỀU | xanh (số nhất quán) · đỏ (số lệch / có đổi mà giữ số) · không-đo-được (vật vắng) |

Ô Core có AC phủ: số nhất quán ở mọi bề mặt (AC-1) · giữ số CÓ căn cứ với bốn lối hỏng
riêng (AC-2) · hồi quy bốn suite (AC-3) · hồ sơ mốc đủ bốn khối (AC-4).

Ô Never: «số đã tăng so với base» — đã TRỪ khỏi P200 từ 18/08 vì nó kéo theo một mốc
di động làm mọi làn song song đỏ oan ngay sau khi mốc merge.

[CE chưa kiểm chứng] — không có.

## Đường đo

| Trục | Trước mốc | Sau mốc |
|---|---|---|
| Kho tiêu thụ chạy bộ bóc tiêu chí mới | 0 trên 8 | 8 sau chiến dịch rollout |
| Tiêu chí cứu được ở kho tiêu thụ | 0 | 253 |
| Hồ sơ tiêu thụ đọc thêm tiêu chí | 0 | 27 |
| `diagram-design` | 2.7.0 | 2.7.0, có răng chứng minh |

Rollout là hồ sơ RIÊNG chạy sau khi mốc này gộp — xem Out of scope.

## Out of scope

- **Chiến dịch ghim lại của mốc** — chạy sau khi hồ sơ này gộp, một chiến dịch mỗi
  release, đúng charter 07/08 mục 1d.
- **Rollout tới tám kho tiêu thụ** — mỗi kho một PR, chủ kho gộp. Trong đó có một mục
  CÓ TÊN phải kiểm: `lib/evidence-core.cjs` lệch ở **cả tám kho**, không kho nào khớp
  2.11.0 và ba kho lệch khác nhau. Sổ tay ghi một phần là trôi-cũ vô hại, một phần là
  vá local thật. Không mở vòng mới cho nó; nó là một mục của chiến dịch rollout.
- **Sáu ngả sửa của ô `thuoc-khong-lat-verdict`** — mở SAU mốc này, cả sáu một vòng,
  chấm bằng cổng CŨ. Ngả 1 sửa chính luật tính verdict nên dùng luật đã sửa để chấm
  việc sửa đó là vòng tròn; và nhét nó vào đây biến mốc từ T2 làn V thành T3.
- **Ba ô mở 13/09** (`bo-giai-nuot-chu-thich-yaml` · `chieu-do-xanh-vi-ban-tiem-sap` ·
  `evals-khai-chieu-do-khong-co-vat`) và **mười hồ sơ chờ Cổng Giá trị** — mười phiên
  nghiệm thu là mười lượt gọi người, đúng thứ chi phí cửa sổ này vừa đo được.
- **Vá bất cứ thứ gì TRONG mốc.** Cửa sổ không có lỗ nào fail-open đang cháy. Giữ mốc
  ở T2 là điều kiện để làn V mở và để mục tiêu ≤1 lượt gọi người còn với tới được.

## Notes

Bốn khối bắt buộc của AC-4 nằm dưới đây.

### 1. Ba dòng số của luật (c) — ĐẾM TAY

| Vòng | làm-xong→quyết-được | Lượt chấm | Gọi người (trong / ngoài thiết kế) | Hạ tầng đốt lượt |
|---|---|---:|---|---:|
| `cua-veto-sau-chu-ky` | 9h03 (`04:03`→`13:06` 12/09) | 6 | chưa đếm tay được — xem ghi chú | 0 ghi được |
| `cong-nguoi-doc-du-nguon` | 39h01 (`12/09 23:26`→`13/09 14:27`) | 8 | **2 trong / 12 ngoài** | **2** |
| hồ sơ mốc này | điền sau chữ ký | — | — | — |

*Nguồn rút:* cột thời gian và lượt chấm từ `run-log.jsonl` của từng hồ sơ (dòng `round`
đầu → dòng cuối, và chữ ký từ commit `Gate 2 signoff`). Cột gọi người ĐẾM TAY từ sổ tay
phiên: mỗi lần máy DỪNG chờ người phát ngôn, giữa lúc mở vòng và lúc ký.

**Trần thiết kế T3 là 4.** `cong-nguoi-doc-du-nguon` gọi **14** lượt — 3,5 lần trần.
Hai lượt trong thiết kế là Cổng Phạm vi và Cổng Bằng chứng. Mười hai lượt ngoài gồm:
mở vòng · duyệt lại Cổng Phạm vi sau khi nới phạm vi · «Tiếp tục» ×3 · xin xem lại
khuyến nghị · duyệt kiến nghị sửa · «Vá» · hai lần DỪNG-VÁ · duyệt phân tích North Star
· một lượt do hạ tầng.

Ô `cua-veto-sau-chu-ky` để trống CÓ CHỦ Ý: phiên chạy vòng đó không phải phiên này, và
sổ quyết định không ghi số lượt gọi người. Đếm lại bằng cách đọc transcript phiên kia là
dựng phép đo mới, trái luật (c) («đọc từ ba dòng số — không dựng phép đo mới»).

**Hai lượt hạ tầng đốt của `cong-nguoi-doc-du-nguon`, mỗi lượt có tên:**
lượt 5 — tệp ca là tệp MỚI nên cây gốc trả `MODULE_NOT_FOUND`, tác tử ghi thành «đỏ =
có phân biệt» cho cả bảy phép đo; lượt 8 — đầu ra suite plugins khớp khuôn
`permissions-allow-deny` nên bị hạ tầng trung hoà, tác tử trả đỏ trong khi cùng chuỗi
lệnh chạy tại chỗ thoát 0.

### 2. Lớp vendored — bốn trên chín mục ĐỔI trong cửa sổ

Đo bằng `git diff --numstat 698badbf..97e2d713 -- <tệp>`:

| Mục của `INIT-CI-COPY-LIST` | +/− |
|---|---|
| `lib/ac-line.cjs` | +93 −6 |
| `lib/evidence-core.cjs` | +156 −4 |
| `lib/md-section.cjs` | +68 −1 |
| `scripts/pre-merge-check.sh` | +96 −2 |
| `lib/eval-yaml.cjs` · `lib/gap-probe.cjs` · `lib/lop-nhin-thay.cjs` · `lib/workspace-record.cjs` · `scripts/recheck-evidence.cjs` | không đổi |

**Ghi chú phát hành phải nói:** kho tiêu thụ chép lại BỐN mục trên. Danh sách chín mục
KHÔNG có mục mới.

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

- **Hạ tầng tự sinh tín hiệu đỏ** — 2 lượt ở `cong-nguoi-doc-du-nguon`; mốc 2.11.0 ghi
  5, mốc 2.10.0 ghi 5. **Ba cửa sổ liên tiếp.** Ô `thuoc-khong-lat-verdict` ngả 5 đi
  đóng lớp này.
- **DỪNG-VÁ nổ rồi lượt sửa lại đẻ lỗi cùng lớp** — 3 lần liên tiếp ở
  `cong-nguoi-doc-du-nguon` (lượt 3→4, 4→5, 6→7). Cả ba đều là NỚI một bộ đọc; hai bản
  vá cuối là HỢP NHẤT luật về một nguồn và không đẻ hồi quy.
- **Sửa một ca thay vì quét theo LỚP** — lượt 7 áp luật tiêu đề cho một trong ba nhánh
  của cùng một hàm; lượt 8 bắt đúng nhánh còn lại. Hiến pháp đã ghi luật này từ 26/07.
- **Bộ đọc nhân bản** — vòng này đóng ba bên gọi nhưng phát hiện thêm bên thứ TƯ
  (`pre-merge-check.sh`, bán kính 2 hồ sơ) và thứ NĂM (`carry-plan.mjs`, bán kính 9).
  Cả hai đã có ô, chưa đóng.

### 4. Nhát cắt cho cửa sổ kế — gọi tên

**Nhát cắt đề xuất: gỡ nhánh lật verdict theo ý kiến tác tử** (`acceptance-verify.js`
dòng 1042). Đó là dòng làm lượt 7 của `cong-nguoi-doc-du-nguon` đỏ trong khi mọi phép
đo xanh, và là chỗ máy định nghĩa lại «tốt» sau khi owner đã chốt ở Cổng Phạm vi. Phép
trừ, một dòng. Ô `thuoc-khong-lat-verdict` ngả 1.

### 5. CÂU HỎI CHO NGƯỜI — luật thu hồi vế «có thể CỘNG»

Luật NỚI 2026-09-07 có điều kiện thu hồi: *«lượt gọi người/vòng vượt trần ở hai mốc
phát hành liên tiếp»*. Số đang có:

| Mốc | Lượt gọi người ghi trong hồ sơ mốc | Trần |
|---|---|---|
| 2.11.0 | 7 trong thiết kế + 1 ngoài = **8** | mốc ≤1 |
| 2.12.0 (vòng trong cửa sổ) | `cong-nguoi-doc-du-nguon` **14** | vòng T3 ≤4 |

Sổ tay ghi 2.11.0 là lần trượt trần ≤1 **thứ ba liên tiếp**. Máy KHÔNG tự tuyên thu
hồi: đó là quyết định chính sách, và hệ quả của nó là **27 ô đang mở phải khai lại căn
cứ**. Người đọc số rồi quyết. Ba lối: thu hồi · giữ nguyên · giữ nguyên kèm một ngưỡng
mới do người đặt.
