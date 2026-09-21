# ho-so-khep-thoi-hoi — thiết kế (vòng meta 2.18.1)

**Ngày:** 2026-09-22 · **Hạng:** T3 (máy suy: chạm `scripts/pre-merge-check.sh` + `lib/**`) ·
**Ô:** `_acceptance/ho-so-khep-thoi-hoi/opportunity.md` (Cổng Đáng `build` 22/09) ·
**Hạt giống:** `docs/plans/2026-09-22-hat-giong-bon-loi-nho-2-18-0-tu-crm.md`

## 1. Một câu

Hồ sơ đã khép (đã nghỉ · đã chấm bởi thực tế) thôi bị đếm là cửa veto mở và thôi mang ô hỏi;
làn V đọc cả `review-findings.md` trước khi gọi một hồ sơ là xanh-sạch; lớp CI vendored chép
đủ bao đóng nạp của cả ba lệnh CI mà `acceptance-init` dựng; và hai bộ đo của kit thôi vỡ khi
cây có hồ sơ `da-cham-boi-thuc-te` thật đầu tiên.

## 2. Hai phát hiện lúc đọc mã (đổi dự kiến của ô)

1. **Hạng là T3, không phải T2.** Lỗ 1 (NOTE cửa veto) và lỗ 4-gốc (fail-open làn V) đều sống
   ở `scripts/pre-merge-check.sh`; `khong-can-nguoi.mjs` là BẢN DỰNG THỨ HAI của luật xanh-sạch,
   giữ bằng nhau với bash `xanh_sach_check` bởi ca LV5. Vá một bên là làm hai bên lệch. Cả hai
   tệp nằm trong `t3_paths` → T3, trần thiết kế 4 lượt gọi người (Đáng · Phạm vi · 1.5 · Bằng
   chứng). Ô khai ngưỡng chết «> 3 lượt». Cách giữ ≤ 3: kế hoạch S2 soạn ngay trong S1 và
   trình CÙNG thẻ Cổng Phạm vi — một chạm duyệt cả hợp đồng lẫn kế hoạch (Gate 1.5 gộp).
2. **Vá lỗ fail-open lộ ra ba hồ sơ đã lọt qua đúng lỗ ấy** (đo 22/09, `khongCanNguoi` hiện
   hành × `out-of-contract.parse` trên cây thật):

   | Kho | Hồ sơ | Trạng thái | Mục ngoài hợp đồng bị giấu | Người đã quyết từng mục? |
   |---|---|---|---|---|
   | kit | `co-qua-timebox-nhom-da-xong` | verified · chưa ký · veto mở | 7 | **không** — 0 dòng sổ gate2 |
   | kit | `ghim-lai-tren-lop-cu` | verified · chưa ký · veto mở | 2 | có — sổ gate2 12/09, «ghi Known limits» |
   | crm | `quyen-luot-mang-theo` | machine-cleared · chưa ký | 6 | có — sổ gate2 08/09 |

   Mọi hồ sơ khác có mục ngoài hợp đồng đều đã có chữ ký (7 ở kit, 7 ở crm) → không đổi làn.
   Hai trong ba hồ sơ đã có dòng sổ gate2 do người quyết cho từng mục — bắt ký lại chúng là trạm
   thu phí. Vì thế vế mới đọc NGUỒN CĂN CỨ (định hướng phiên điều phối 22/09): mục có dòng sổ
   gate2 nhắc «Ngoài-N» là mục ĐÃ ĐƯỢC NGƯỜI ĐỊNH TUYẾN. Kết quả: chỉ `co-qua-timebox-nhom-da-xong`
   lật (7 mục chưa ai quyết) — câu hỏi thật, trình ở Cổng Phạm vi kèm khuyến nghị từng mục; CI crm
   ngày cài giữ xanh.

## 3. Năm việc

### V1 — «đã khép» là MỘT vị từ (lỗ 1)

`lib/workspace-record.cjs` thêm `hoSoDaKhep({ status, ledgerText, reportText })` →
`{ vi: 'nghi' | 'thuc-te' } | null`: nghỉ = `hoSoNghi(...).kieu === 'dong-so'`; thực tế =
`status ∈ DA_DONG_THUC_TE` ∧ `thucTe(ledger).kieu === 'dong-so'`. Dòng quan sát thiếu vế hoặc
đã mở lại → KHÔNG khép (cùng chiều fail-closed của lưới: rơi về luật hồ sơ đã arm). CLI
`--da-khep --root <repo>` in mỗi slug khép một dòng (một lần gọi node cho cả vòng lặp bash).

Bên đọc:
- `start-scan.mjs`: phần tử `vetoOpen[]` giữ nguyên tập (lời hứa start-bang-dieu-khien) và CỘNG
  khoá `daKhep` (bool); `vetoOpenUnsigned` lọc thêm `!daKhep`. Khối `START-SCAN-KEYS` của
  `commands/start.md` thêm `vetoOpen[].daKhep`, câu thân lệnh thêm «hồ sơ đã khép cũng không
  hiện».
- `pre-merge-check.sh` vòng lặp veto-trace: slug khép → không đếm vào `VETO_OPEN_N` (đổi
  nhãn tạm như `mo-da-ky`, trả lại sau `case` — luật chỉ-thêm DV5 giữ nguyên dòng cũ).

### V2 — lớp CI vendored = bao đóng nạp của ba lệnh CI (lỗ 3 của hạt giống)

`acceptance-init` dựng ba lệnh CI ở kho tiêu thụ: `pre-merge-check.sh`, (qua nó)
`recheck-evidence.cjs`, và `product-map.mjs --check` (khoá `product_map` trong khuôn config).
Danh sách chép hôm nay chỉ tính bao đóng của hai điểm vào đầu. Thêm điểm vào thứ ba — rút từ
CHÍNH dòng `product_map:` của khuôn config trong `commands/acceptance-init.md`, không gõ tay —
thì bao đóng cộng bốn tệp: `scripts/product-map.mjs` · `scripts/trang-thai-ho-so.cjs` ·
`scripts/khong-can-nguoi.mjs` · `lib/nguong-o-co-hoi.cjs` (đúng bốn tệp crm đã tự chép).
V3 thêm `lib/out-of-contract.cjs` vào bao đóng → danh sách 10 → **15**. Không đếm tay: CE2 sinh
số, GUIDE §5.3 và `INIT-CI-COPY-LIST` phải khớp nó.

Round-trip thật: dựng kho tiêu thụ giả lập (`"type": "module"`), chép ĐÚNG danh sách, chạy
`node scripts/product-map.mjs --root . --check` → không `MODULE_NOT_FOUND`/`ReferenceError`.
Mutant: gỡ `trang-thai-ho-so.cjs` khỏi bản chép → đỏ, thông điệp nêu tên tệp.

### V3 — làn V đọc `review-findings.md` (lỗ 4-gốc, TÁI PHÁT)

Điều kiện thứ sáu «Ngoài hợp đồng HIỆN DIỆN-và-rỗng» hôm nay đọc BÁO CÁO. Báo cáo do tác tử
tổng hợp viết, `review-findings.md` do chính workflow viết từ triage; hai tệp trôi nhau được
(khai-lang). Thêm một vế vào CÙNG điều kiện, ở CẢ HAI bản dựng, qua MỘT hàm trong
`lib/out-of-contract.cjs` — `mucChuaDinhTuyen(findingsText, ledgerText)` → danh sách nhãn
«Ngoài-N» chưa có dòng sổ `stage: gate2` nhắc tới (đơn lẻ hoặc khoảng «a đến/den b», có dấu hay
không). Danh sách khác rỗng, hoặc khối có chữ mà bộ đọc ra 0 mục (`suspect_empty`) → KHÔNG
xanh-sạch, lý do «review-findings.md có N mục ngoài hợp đồng chưa người định tuyến: Ngoài-…».
Tệp findings vắng → vế này im (hồ sơ đời trước triage).

Giới hạn khai kèm ngưỡng: nhãn là vị trí mục lúc thẻ dựng; lượt S4 sau dòng gate2 mà đổi tệp
findings thì dòng cũ trỏ nhầm. Ngưỡng mở lại: ≥ 1 ca như vậy.

- `lib/out-of-contract.js` → `lib/out-of-contract.cjs` (khong-can-nguoi nạp nó; kho tiêu thụ
  `"type": "module"` đọc `.js` thành ESM — lớp CE). Cập nhật mọi bên `require`.
- `xanhSach(contractTxt, evidenceTxt, { findings, ledger })`; mọi bên gọi (rút bằng grep ở AC-8,
  không gõ tay) đọc hai tệp cạnh báo cáo; ca AC-8 bắt bên gọi quên truyền.
- bash `xanh_sach_check` đọc cùng bộ đọc qua `node -e` (nếp đã có của khối section).
- LV5 (đẳng thức hai bản dựng) thêm sáu hàng ma trận của AC-4.

### V4 — thẻ hồ sơ đã khép in 0 ô hỏi (lỗ 5 của hạt giống)

`gate-card.js`: `DA_KHEP = NGHI || scanState === 'da-cham-thuc-te'` (khoá đầu ra của bộ quét,
không tự đọc sổ). Khi `DA_KHEP`: `routingHoi` rỗng, không câu gộp, khối việc-của-người thay
bằng một dòng «hồ sơ đã khép (<đã nghỉ | chấm bởi thực tế>) — không còn câu hỏi nào cho
người»; `routingBao` giữ. `MAY_DI_TIEP` thôi dùng `!!NGHI` làm vế (nghỉ không phải «máy đi
tiếp»). `routing-baseline.txt` sinh lại: 15 dòng nghỉ đổi `hoi=` → rỗng, + `release-2-0-0`
(thực tế, sau khi gộp commit `observed`).

### V5 — hai bộ đo thôi vỡ trên hồ sơ thực-tế thật (phiên điều phối thêm 22/09)

Nguồn: kit PR #199 (`a68340c5`, owner gõ `observed release-2-0-0`), CI 35667164103 đỏ 2/891.
- `ntr-trang-thai.test.mjs` NS-AC9-cu so bộ quét/bản đồ «HEAD» với bản trước vòng trên cây
  thật; tiền đề «cây chưa có hồ sơ trạng thái mới» hết đúng, VÀ mọi vòng sau đổi bộ quét hợp
  lệ (chính V1/V3) cũng làm nó đỏ. Đổi khuôn: «bản sau» = `verified_commit` của hồ sơ
  `nhan-trang-thai-va-reality` (rút từ báo cáo, không gõ tay) — lời hứa của ca là về DELTA của
  vòng ấy, không về HEAD mãi mãi; và bản sao dữ liệu loại hồ sơ khép theo vị từ V1, không theo
  danh sách tên.
- `lan-status-not-run.test.mjs` L05 dựng corpus bằng `git init` trong thư mục tạm → `git
  cat-file` không thấy sha bản dựng → hồ sơ thực-tế thành VIOLATION ở cả bản base lẫn bản mới.
  Sửa: corpus loại hồ sơ khép theo vị từ V1 (lời hứa L05 là về pin, hồ sơ thực-tế không còn bị
  chấm pin).
- Vật thật: cherry-pick `a68340c5` (giữ tác giả, lời owner) vào nhánh vòng. Hai hồ sơ đã ký
  giữ hai bộ đo này (`nhan-trang-thai-va-reality`, `lan-doc-status-not-run`) ghim lại RIÊNG ở
  chiến dịch ghim lại của mốc — không chạm byte hồ sơ đã ký ngoài dòng repin.

## 4. Ngoài phạm vi

- Không đổi enum trạng thái, không thêm thao tác cổng người, không CỘNG luật.
- Không dựng `MAY_DI_TIEP` thành máy trạng thái mới.
- Rollout 2.18.1 ra kho khác ngoài crm.

## 5. Đường đo (ngưỡng ô → vật)

| Ngưỡng ô | Số từ đâu | AC |
|---|---|---|
| hồ sơ đã khép trong NOTE veto = 0 | `pre-merge-check.sh` dòng `NOTE: cửa veto đang mở` ở kit + crm sau cài | AC-1 |
| ô hỏi trên thẻ hồ sơ khép = 0 | `gate-card.js --extract` / `routing-baseline.txt` | AC-6 |
| ca khai-lang → «không xanh-sạch» | fixture sinh từ khuôn `OOC-ITEM-TEMPLATE` | AC-4 |
| tệp crm tự vá = 0 | `diff -rq` 15 tệp crm vs kit sau cài | AC-3 |
| hồ sơ đổi làn oan = 0 | so bộ quét cũ/mới trên cây thật; mọi hồ sơ đổi phải có ≥ 1 mục thật | AC-5 |
| lượt gọi người ≤ 3 | sổ + hội thoại | — (đếm) |

## 6. Câu hỏi thật cho owner ở Cổng Phạm vi

`co-qua-timebox-nhom-da-xong` có 7 mục ngoài hợp đồng chưa ai quyết; sau vá nó rời làn V. Máy
khuyên theo đúng đề xuất triage của từng mục (3 «mở hợp đồng mới» → ghi HẠT GIỐNG theo luật
«Ô chỉ mở khi có NEO NGOÀI», 3 «ghi Known limits», 1 «chấp nhận, không sửa»). Owner một chạm; máy
ghi 7 dòng sổ gate2 hộ → hồ sơ giữ làn V, không cần chữ ký.
