---
schema_version: 1
feature: Phát hành kit 2.10.0 — đóng số cho cửa sổ 2.9→2.10 (PR 157 glob-hai-sao · 159 duong-lui-phai-song · 163 vòng T3 gom đúc kết 08/09), để repo tiêu thụ nhận bộ máy theo mốc có chủ đích
slug: release-2-10-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật của PR: 2 manifest + dòng khớp-phiên-bản GUIDE + hồ sơ + bản đồ — không dính t3_paths
surfaces: [cli]
status: implemented
design_doc:
approved_by:
approved_at:
veto_state: mo
---

# Acceptance Contract: release-2-10-0

## Context

Từ mốc 2.9.0 (`bafe2aad`, 08/09 04:39 +07) tới `da7ac3fc` (09/09 20:24 +07): **bảy PR**
gộp vào `main`, 141 commit. Bốn trong số đó là **vòng sửa**:

- `glob-hai-sao-khop-goc-kho` (#157) — glob `**` giải từ gốc kho.
- `lop-bang-chung-nhin-thay` (#158) — lớp bằng chứng nhìn-thấy (W8); ký với **7 nợ
  Known limits**, chính bảy nợ đó là nhóm C1 của vòng #163.
- `duong-lui-phai-song` (#159) — làn V một đường kiểm.
- `gom-duc-ket-2-10-0` (#163) — vòng T3 gom C1 + K1–K8. **Rút ba nhóm giữa vòng**
  (K4 · K7 sau lượt chấm 4, K6 sau lượt 5), phạm vi cuối 7 AC.

Ba PR còn lại không phải vòng: #160 đúc kết 08/09 · #161 lịch sử 14–15/08 · #162 ba
hồ sơ phiên nghiệm thu + làn ghim lại.

**Lớp vendored KHÔNG đổi một dòng nào** (`git diff bafe2aad..da7ac3fc -- vendor/` rỗng)
→ không repo tiêu thụ nào phải ghim lại lớp CI; mệnh đề (5) của manifest và
INIT-CI-COPY-LIST giữ nguyên.

**`diagram-design` GIỮ 2.7.0, không nâng theo.** Phác thảo đầu cửa sổ định nâng nó lên
2.10.0; bằng chứng nói ngược: `git diff bafe2aad..da7ac3fc -- diagram-design/` rỗng. P200
chỉ đòi HAI plugin cùng số, và mốc 2.9.0 đã có tiền lệ giữ 2.7.0. Nâng số cho một gói
không đổi dòng nào là lời khai sai.

## Criteria

- AC-1: Given ba manifest sau lần cắt số, When chạy ca vĩnh viễn P200, Then `acceptance-gate` và `feature-loop` CÙNG số `2.10.0`, cả ba số hợp semver, và mọi số P200 đọc đều lấy TỪ manifest (không ghim một mốc trong ca).
- AC-2: Given `GUIDE.md`, When P200 dựng câu «Khớp phiên bản» từ ba số đọc trong manifest rồi so, Then GUIDE chứa ĐÚNG câu dẫn xuất đó; bản sao giữ số cũ → đỏ ghim nguyên câu.
- AC-3: Given cây tại lần cắt số, When chạy bốn suite + `product-map.mjs --check`, Then tất cả exit 0 và `PRODUCT-MAP.md` khớp hồ sơ xưởng.
- AC-4: Given mô tả của hai manifest, When P200 rút mục của CHÍNH số `2.10.0`, Then mục `v2.10.0` của `acceptance-gate` có mặt và nói người dùng nhận gì; mục `v2.10.0` của `feature-loop` TỰ KHAI cặp `acceptance-gate >= 2.10.0` TRONG mục đó (câu khai cặp nằm ở mục lịch sử không tính).

## Coverage

- Trục A — bề mặt người dùng đọc số: manifest acceptance-gate | manifest feature-loop | manifest diagram-design | GUIDE | mô tả của chính số đó [thước CE: ca P200, 5 đột biến + đối chứng dương]
- Trục B — hồi quy của cây tại lần cắt: scripts | hooks | plugins | workflows | bản đồ sản phẩm [thước CE: bốn suite + product-map]
- Trục C — chiều đo: dương | đột biến ghim đúng câu | đối chứng dương bản-sao-nguyên-vẹn
- Ô gạch có lý do: ba dòng số luật (c) và nhát cắt kế là VĂN — không phép đo máy nào chấm được, khai ở Known limits đúng như mốc 2.9.0 đã làm.

## Out of scope

- Nâng `diagram-design` — không đổi dòng nào trong cửa sổ (xem Context).
- Chiến dịch ghim lại của mốc — chạy sau khi hồ sơ này gộp, một chiến dịch mỗi release.
- Rollout tới 7 repo tiêu thụ — mỗi repo một PR, chủ repo gộp; không thuộc hồ sơ này.
- Bảy ô đã ghi sổ chờ mở sau mốc: `resolve-config-go-escape` · `s5-merge-khong-tu-gop` ·
  `bao-cao-rong-khong-duoc-ghi-de` · `paths-chuan-hoa` · `triage-tac-hai-hai-ben-doc` ·
  `loop-health-doc-frontmatter` · `pv5-chieu-do-that`.
- Phiên nghiệm thu gộp cho 10 hồ sơ chờ Cổng Giá trị — đó là NHÁT CẮT KẾ, mở sau mốc.

## Notes

### Ba dòng số của luật (c) — ĐẾM TAY

Đếm tay theo đúng chữ luật (c). **KHÔNG dùng `scripts/loop-health.mjs`**: công cụ đó suy
mốc cổng bằng `git log -S`, tức khớp CHỮ ở bất kỳ đâu trong thân hợp đồng, nên ra thời
lượng ÂM trên chính kho này. Cách đếm dùng ở đây: đọc `status:` trong FRONTMATTER của
TỪNG revision (`git show <sha>:<contract>`), lấy revision đầu tiên sang `implemented` và
revision đầu tiên sang `signed-off`; số lượt chấm đọc từ `run-log.jsonl` (`round`), không
đọc văn xuôi.

| Vòng | làm-xong → quyết-được | lượt chấm | lượt gọi người (thiết kế / ngoài) | bị hạ tầng đốt |
|---|---|---|---|---|
| `glob-hai-sao-khop-goc-kho` (#157) | 211′ (3h31) | 3 | không đếm được — vết hội thoại ngoài kho | 0 |
| `lop-bang-chung-nhin-thay` (#158) | 522′ (8h42) | 3 | 15 tổng (sổ vòng), trần 4 | 1 |
| `duong-lui-phai-song` (#159) | 390′ (6h30) | 4 | không đếm được | 1 |
| `gom-duc-ket-2-10-0` (#163) | **547′ (9h07)** | **6** | **4 / 6** | 1 |

- **Dòng 1 — làm-xong→quyết-được:** trung bình 417′ trên bốn vòng. Vòng T3 gom là vòng
  CHẬM NHẤT cửa sổ (547′) dù nó là vòng duy nhất có mục tiêu rút ngắn. Mốc T3 cùng hạng ở
  `8caa9998` là 3,25 lượt chấm; vòng này 6.
- **Dòng 2 — lượt gọi người:** chỉ vòng #163 có số tách được, vì phiên của nó nằm trọn
  trong một mạch làm việc: **4 trong thiết kế** (gọi tên vòng · Cổng Phạm vi · Gate 1.5 ·
  Cổng Bằng chứng — đúng trần T3 = 4) và **6 NGOÀI thiết kế** (dispatch S4 · «Try again»
  sau hạn mức · «review lại» trước khi vá · «vá 8 mở lượt 4» · «đồng ý rút K4/K7» · «chọn
  lối 2 rút K6»). **Chạm/lượt = 1** ở cả mười lượt: người gõ một chữ hoặc dán lại một dòng
  máy soạn sẵn. Ba vòng kia không đếm được từ kho — cùng giới hạn mốc 2.5.0→2.9.0 đã khai.
- **Dòng 3 — vòng bị hạ tầng kit đốt: 3/16 lượt chấm** — #158 một lượt, #159 một lượt,
  #163 một lượt (hạn mức phiên giết 3 suite + 3 làn rà soát + xuất-xứ giữa lượt 2). Không
  lượt nào là lỗi vật.

### Nếp nào thật sự cắt việc, nếp nào không

- **CẮT ĐƯỢC — tự-soi N5 trước khi khai `implemented`:** ở #163 nó bắt 8 điểm sau khi cả
  bốn suite đã xanh, trong đó có răng chạy từ worktree thì bỏ qua cả ba cây tiêu thụ rồi
  PASS rỗng. Đó đúng chỗ vòng trước mất hai lượt chấm.
- **CẮT ĐƯỢC — làn ghim lại bằng máy:** đỏ hai lần ở đoạn bàn giao và KHÔNG ghi gì lần
  nào; chính nó tìm ra lỗi bộ giải config bên dưới.
- **CẮT ĐƯỢC — một chạm mỗi lượt:** giữ được ở 10/10 lượt.
- **KHÔNG CẮT ĐƯỢC — trần lượt gọi người:** 6 lượt ngoài thiết kế ở một vòng. Nguyên nhân
  gốc không phải kit mà là lỗi QUY TRÌNH của máy: ba lượt chấm đầu máy đọc danh sách
  «trong hợp đồng» từ đầu ra THÔ của agent phân loại thay vì kết quả cuối của workflow, nên
  vá 3/1/0 mục trong khi thật là 10/6/1; luật dừng-vá nổ oan và bốn lượt gọi người sau đó
  đều là hệ quả.

### Lớp lỗi TÁI PHÁT — căn cứ cho nhát cắt kế

Hồ sơ mốc 2.9.0 đã ghi đích danh, ở vòng `co-qua-timebox-nhom-da-xong` (#149 r1): «xanh
vì args được chỉnh ngoài đường máy ở lượt dispatch — bằng chứng E6 chưa đi qua s4-args;
gốc là **bộ giải config đọc theo dòng không gỡ `\"`**». **CẢ HAI lớp tái phát nguyên vẹn ở
cửa sổ này**, một mốc sau:

- `resolveConfigKey` (`lib/evidence-core.cjs`) bóc MỘT ký tự nháy ở đầu và cuối giá trị,
  vô điều kiện, không gỡ escape → lệnh khai của E1 vòng #163 giải ra vỡ cú pháp, chạy thật
  exit 127. Bán kính đo tại chỗ: 1/104 executor của kho.
- E1 xanh ở lượt chấm 6 KHÔNG đi qua đường config: args chép tay đã vô tình sửa lệnh —
  đúng hình dạng #149 r1.

Lời dặn trong Known limits của một mốc KHÔNG tới được vòng của mốc sau. Đó là cùng kết
luận mà 2.9.0 rút về bài học «thêm dòng định tuyến TRƯỚC, cùng commit chữ ký» (không được
lặp ở #146 lẫn #151). Hai mốc liên tiếp, cùng hình dạng: **giới hạn khai bằng LỜI không
phải nghiệm.**

### Nhát cắt cho cửa sổ kế (luật (c) đòi gọi tên)

**Một phiên nghiệm thu GỘP cho 10 hồ sơ đang chờ Cổng Giá trị:** `cong-dang-co-cua` ·
`dac-ta-ux-vat-hoa-cau-truc` · `design-pass-nac-khong-dong-bo` ·
`lan-may-song-qua-bo-phan-loai` · `lenh-in-ra-phai-bam-duoc` · `loi-moi-cong-may-sinh` ·
`nhanh-chinh-khong-ten-main` · `ra-co-ten-lam-va-trao` · `start-bang-dieu-khien` ·
`vu-trang-goal-luc-goi-ten`. Hai hồ sơ mang cờ `nguong-chua-chot` phải chốt ngưỡng hoặc
khai «Không đo được — <lý do>» TRƯỚC phiên. Số lấy bằng máy:
`node scripts/start-scan.mjs --root .` → `groups.gates` với `gate=gia-tri`.

**Ứng viên thứ hai, có căn cứ số ở trên:** biến `resolve-config-go-escape` thành RĂNG chứ
không phải lời dặn — nó là lớp duy nhất tái phát qua hai mốc liên tiếp.

### Known limits

- Ba dòng số của luật (c) và nhát cắt kế là VĂN — không phép đo máy nào chấm. Cùng giới
  hạn mốc 2.9.0 khai; ở mốc này còn NẶNG HƠN vì `loop-health` (máy đếm dựng ở #163) đã bị
  rút giữa vòng, nên số quay lại đếm tay hoàn toàn.
- Lượt gọi người của ba vòng #157/#158/#159 không đếm được từ kho (vết hội thoại). Chỉ
  #163 có số tách trong-thiết-kế / ngoài-thiết-kế.
- `## Iterations` của `_acceptance/gom-duc-ket-2-10-0/evidence-report.md` chỉ còn Round 2
  và Round 3 — agent tổng hợp đánh rơi 4/6 lượt. Số lượt chấm ở bảng trên đọc từ
  `run-log.jsonl` (round 1–6, 7 dòng tổng kết) chứ không từ mục đó. Hồ sơ đã ký và đã gộp
  nên KHÔNG sửa; ghi ở đây làm vết.
