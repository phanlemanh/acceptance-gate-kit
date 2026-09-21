---
schema_version: 1
feature: Hồ sơ đã khép (chấm bởi thực tế · đã nghỉ) thôi bị đối xử như đang mở — bộ đếm cửa veto, thẻ, làn V đọc đủ nguồn — và lớp CI vendored chép đủ bao đóng nạp; để kho tiêu thụ cài 2.18.1 không phải tự vá một tệp nào
slug: ho-so-khep-thoi-hoi
owner: phanlemanh@gmail.com
risk_tier: T3      # scripts/pre-merge-check.sh + lib/workspace-record.cjs + lib/out-of-contract.cjs — lõi cưỡng chế (t3_paths); vá điểm, không đổi enum, không CỘNG
surfaces: [cli, ci, docs]
status: draft      # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-22-ho-so-khep-thoi-hoi-design.md
---

# Acceptance Contract: ho-so-khep-thoi-hoi

## Context

Ngày crm cài 2.18.0 (22/09) lộ bốn lỗ cùng cỡ vá điểm, và phiên điều phối thêm một lỗ thứ năm
khi kit gộp hồ sơ `da-cham-boi-thuc-te` thật đầu tiên (`observed release-2-0-0`, PR #199, CI đỏ
2/891). Người hưởng: owner ở Cổng Bằng chứng (thẻ thôi hỏi «veto hay để yên» khi việc là ký;
hồ sơ đã khép thôi có ô hỏi) · phiên Claude Code cài kit ở kho tiêu thụ (CI không đỏ vì thiếu
tệp) · người đọc NOTE trước-merge (đếm cửa veto đúng). Trace: nguyên tố 2 (bằng chứng không tự
dối — làn V không được gọi xanh-sạch khi tệp phát hiện của chính lượt chấm có mục) · nguyên tố
3 (khoảnh khắc quyết thật — hồ sơ đã khép không còn câu hỏi nào). Toàn bộ là vá điểm; không
CỘNG (ADR 0018), không đổi enum, không thêm thao tác cổng người.

Hạng T3 do máy suy từ `t3_paths` (ô dự kiến T2 — design doc §2.1). Kế hoạch soạn trong S1 và
trình cùng thẻ này để Cổng Phạm vi và Gate 1.5 là MỘT lượt gọi người.

Source input: `_acceptance/ho-so-khep-thoi-hoi/opportunity.md` (Cổng Đáng `build` 22/09) ·
`docs/plans/2026-09-22-hat-giong-bon-loi-nho-2-18-0-tu-crm.md` · tin phiên điều phối 22/09
(việc 5) · `docs/superpowers/specs/2026-09-22-ho-so-khep-thoi-hoi-design.md`.

## Criteria

- AC-1: Given ma trận năm hồ sơ viết trước — nghỉ đủ vế · nghỉ trên hồ sơ chưa ký · `da-cham-boi-thuc-te` có dòng quan sát đủ vế · `da-cham-boi-thuc-te` dòng thiếu vế · hồ sơ sống `signed-off` — When hỏi `hoSoDaKhep` của `lib/workspace-record.cjs` và CLI `--da-khep`, Then đúng ô thứ nhất (`nghi`) và ô thứ ba (`thuc-te`) ra «khép», ba ô còn lại ra không khép; số assert bằng năm; CLI in đúng tập slug ấy.
- AC-2: Given kho fixture code sinh có hai hồ sơ cùng frontmatter `veto_state: mo`, không chữ ký — một `da-cham-boi-thuc-te` có dòng quan sát đủ vế, một `verified` sống — When chạy `start-scan.mjs` và `pre-merge-check.sh`, Then `vetoOpenUnsigned` và dòng `NOTE: cửa veto đang mở` có tên hồ sơ sống và KHÔNG có tên hồ sơ khép, `vetoOpen[]` vẫn giữ cả hai với `daKhep` đúng; bản sao gỡ bộ lọc khép ở mỗi bên → tên hồ sơ khép quay lại dòng ấy (thông điệp ghim tên).
- AC-3: Given danh sách chép `INIT-CI-COPY-LIST`, When tính bao đóng nạp của ba điểm vào CI — `pre-merge-check.sh`, `recheck-evidence.cjs`, và tệp mà dòng `product_map:` của khuôn config trong `commands/acceptance-init.md` chạy — Then mọi tệp của bao đóng nằm trong danh sách, GUIDE §5.3 khai cùng tập và câu «đủ N file» khớp độ dài; kho tiêu thụ giả lập `"type": "module"` chép đúng danh sách chạy `product-map.mjs --root . --check` không lỗi nạp; bản chép gỡ `scripts/trang-thai-ho-so.cjs` → đỏ, thông điệp nêu tên tệp; và grep `out-of-contract` trên `scripts lib skills feature-loop commands tests` ra 0 tham chiếu đuôi `.js` (bản sao khôi phục một `require` `.js` → đỏ gọi tên tệp).
- AC-4: Given hồ sơ `verified` T2 có báo cáo PASS đủ sáu điều kiện (mục «Ngoài hợp đồng» hiện diện-và-rỗng) và `review-findings.md` có hai mục ngoài hợp đồng sinh từ khuôn `OOC-ITEM-TEMPLATE`, When hỏi vị từ «mục chưa định tuyến» của `lib/out-of-contract.cjs` qua `xanhSach` (`khong-can-nguoi.mjs`) và `xanh_sach_check` (`pre-merge-check.sh`), Then ma trận bốn hàng viết trước cho đúng kết quả ở CẢ HAI bản dựng: sổ không có dòng `stage: gate2` nào nhắc «Ngoài-N» → KHÔNG xanh-sạch, lý do ghim «review-findings.md có 2 mục ngoài hợp đồng chưa người định tuyến: Ngoài-1, Ngoài-2» · sổ có dòng gate2 «Ngoài-1» → không xanh-sạch, lý do chỉ nêu «Ngoài-2» · sổ có dòng gate2 «Ngoai-1 den Ngoai-2» (không dấu, dạng khoảng — dạng thật ở crm) → xanh-sạch · findings 0 mục hoặc vắng → xanh-sạch như trước; khối có chữ mà bộ đọc ra 0 mục → không xanh-sạch. Lưới in VIOLATION thay NOTE làn V ở hàng không sạch; thẻ Cổng 2 in «ký hay trả» ở hàng ấy. Hai bản dựng trả cùng kết luận trên mọi hàng (LV5).
- AC-5: Given bản sao cây `_acceptance/` thật của kit (sau khi gộp commit `observed release-2-0-0`), When so bộ quét và dòng `NOTE: cửa veto đang mở` của `pre-merge-check.sh` ở bản trước vòng (`git archive` merge-base) với HEAD trên CÙNG bản sao, Then mọi hồ sơ đổi ô hoặc rời danh sách veto đều giải thích được bằng vật — `hoSoDaKhep` khác null, hoặc có ≥ 1 mục ngoài hợp đồng chưa định tuyến và báo cáo chưa ký — và không hồ sơ nào đổi mà không có một trong hai; tên trong dòng NOTE của HEAD giao với tập `--da-khep` là rỗng (đối chứng: bản base có `release-2-0-0` trong dòng ấy); ca in số đổi theo từng lý do. Chiều đỏ: bản sao HEAD ép một hồ sơ đã ký sạch đổi ô → ca đỏ gọi tên slug ấy «không giải thích».
- AC-6: Given hồ sơ đã nghỉ (dòng sổ đủ vế trên hồ sơ đã ký) và hồ sơ `da-cham-boi-thuc-te`, When dựng thẻ Cổng 2 bằng `gate-card.js --extract`, Then `routing.hoi` rỗng, không có câu gộp, và thẻ có dòng «hồ sơ đã khép … không còn câu hỏi nào cho người»; đối chứng — hồ sơ sống có cùng findings/sổ → `routing.hoi` như trước vòng; `tests/scripts/fixtures/routing-baseline.txt` sinh lại bằng chính `--extract` và quan hệ HAI chiều với tập `--da-khep` rút trên cây thật: mọi slug khép có `hoi=` rỗng, và mọi dòng đổi thuộc tập khép (tập ≥ 16: 15 nghỉ + `release-2-0-0`; rút rỗng thì đỏ).
- AC-7: Given cây kit có hồ sơ `release-2-0-0` ở `da-cham-boi-thuc-te`, When chạy `ntr-trang-thai.test.mjs` (NS-AC9-cu) và `lan-status-not-run.test.mjs` (L05), Then cả hai xanh — NS-AC9-cu so bản trước vòng với `verified_commit` của hồ sơ `nhan-trang-thai-va-reality` (rút từ báo cáo) trên bản sao dữ liệu đã loại hồ sơ khép theo vị từ AC-1; L05 loại hồ sơ khép theo cùng vị từ; bản sao ca gỡ bộ lọc khép → đỏ đúng thông điệp cũ của ca.
- AC-8: Given danh sách bên gọi luật xanh-sạch RÚT bằng grep `xanhSach\|khongCanNguoi` trên `scripts/` (không gõ tay), When chạy từng bên gọi trên CÙNG fixture hàng một của AC-4, Then mỗi bên gọi ra «không xanh-sạch / còn cần người» (bộ quét: không `may-di-tiep-*`; bản đồ: không ô máy-thông; CLI `--check`: thoát 2); số assert bằng số bên gọi rút được, rút rỗng thì ca đỏ; bản sao bỏ truyền findings ở một bên gọi → ca đỏ gọi tên bên gọi ấy.

## Coverage

Quét Zwicky rút gọn (preset test-matrix), đầy đủ ở design doc §3.

- **Trục A — bên đọc «hồ sơ này còn mở không»** [thước CE: `grep -rln "vetoOpen\|VETO_OPEN\|MAY_DI_TIEP\|xanhSach\|xanh_sach_check" scripts lib` — SUY-TỪ-REPO]: bộ quét (AC-2, AC-5) · lưới trước-merge (AC-2, AC-4) · thẻ Cổng 2 (AC-4, AC-6) · bản đồ sản phẩm qua `khongCanNguoi` (AC-8) · CLI `khong-can-nguoi --write|--check` (AC-8) — danh sách bên gọi rút bằng grep ở AC-8, không gõ tay.
- **Trục B — trạng thái khép**: nghỉ đủ vế · nghỉ chưa ký · thực tế đủ vế · thực tế thiếu vế · sống (AC-1 toàn phần; AC-2, AC-6 lấy mẫu).
- **Trục C — nguồn ngoài hợp đồng × sổ**: findings có mục chưa định tuyến · định tuyến một phần · định tuyến đủ (dạng khoảng không dấu) · 0 mục/vắng · có chữ sai khuôn (AC-4 toàn phần).
- **Trục D — kho**: kit tự host · kho tiêu thụ ESM (AC-3).
- **Trục E — chiều**: nhạy (mọi AC có bản sao đỏ) · im (AC-5 cây thật; AC-4, AC-6 đối chứng).
- `[GIẢ ĐỊNH]` S4 hôm nay luôn ghi `review-findings.md`; tệp vắng = hồ sơ đời trước triage → vế mới im.

## Đường đo

- hồ sơ đã khép trong NOTE cửa veto (kit + crm) = 0: số từ dòng `NOTE: cửa veto đang mở` của `pre-merge-check.sh` chạy ở kit và ở crm sau cài · AC bảo đảm: AC-1, AC-2
- ô hỏi trên thẻ hồ sơ khép = 0: số từ `routing-baseline.txt` (kit) và `gate-card.js --extract` trên 7 hồ sơ thực tế ở crm · AC bảo đảm: AC-6
- ca khai-lang tái lập → «không xanh-sạch»: số từ ca AC-4 hàng một · AC bảo đảm: AC-4, AC-8
- CI crm lượt đầu sau cài: 0 tệp thiếu, và 0 hồ sơ đỏ vì vế mới — `quyen-luot-mang-theo` có dòng sổ gate2 «Ngoai-1 den Ngoai-4» + «Ngoai-5» (đo 22/09) nên giữ làn V; số từ stderr lượt CI đầu của PR cài · AC bảo đảm: AC-3, AC-4
- số tệp lớp CI: không phải «12» của ô mà là độ dài bao đóng CE2 sinh ra (15 hôm nay) · AC bảo đảm: AC-3
- tệp crm phải tự vá khi cài = 0: số từ `diff -rq` danh sách chép crm vs kit `main` · AC bảo đảm: AC-3
- hồ sơ đã ký đổi làn oan = 0: số từ ca AC-5 · AC bảo đảm: AC-5
- lượt gọi người ≤ 3: số từ sổ quyết định + hội thoại (đếm tay) · AC bảo đảm: — (đếm, không phải vật)

## Out of scope

- Dựng `MAY_DI_TIEP` thành máy trạng thái mới; đổi enum trạng thái; thêm thao tác cổng người.
- Rollout 2.18.1 ra kho khác ngoài crm (chiến dịch ghim lại theo release, cửa sổ kế).
- Ký thay hay quyết thay bảy mục ngoài hợp đồng của `co-qua-timebox-nhom-da-xong` — owner quyết ở Cổng Phạm vi của vòng này, máy chỉ ghi sổ hộ.
- Nhắc lại ô hỏi «Ngoài-N» trên thẻ cho mục đã có dòng gate2 — thẻ vẫn in như hôm nay.
- Lỗ 2 của hạt giống (`observed` không vẽ lại bản đồ) — đã rút khi soạn ô, không tái mở.
- Sửa byte nào trong `_acceptance/<slug>/` của hồ sơ đã ký — AC-7 đổi TEST, hai hồ sơ giữ nó ghim lại ở chiến dịch mốc.

## Notes

- **Vị từ «mục đã được người định tuyến» (định hướng phiên điều phối 22/09, thay lối ân xá theo ngày — danh sách đóng bị hiến pháp cấm):** mục thứ N trong khối «Ngoài hợp đồng» của `review-findings.md` coi là đã định tuyến khi sổ quyết định có dòng `stage: gate2` mà câu quyết định nhắc «Ngoài-N» (có dấu hoặc không, đơn lẻ hoặc khoảng «Ngoài-a đến/den Ngoài-b»). Đo 22/09: `ghim-lai-tren-lop-cu` (kit) và `quyen-luot-mang-theo` (crm) có đủ dòng → giữ làn V; `co-qua-timebox-nhom-da-xong` có 0 dòng cho 7 mục → lật, và đó là câu hỏi thật ở Cổng Phạm vi.
- **Giới hạn đã khai, kèm ngưỡng đang đếm:** số thứ tự «Ngoài-N» là vị trí mục trong tệp findings lúc thẻ được dựng; một lượt S4 sau dòng gate2 mà đổi thứ tự/nội dung các mục sẽ làm dòng cũ định tuyến nhầm mục mới. Ngưỡng mở lại: ≥ 1 hồ sơ có lượt chấm mới SAU dòng gate2 nhắc «Ngoài-N» mà tệp findings đổi.
- Đổi đuôi `lib/out-of-contract.js` → `.cjs` là đổi TÊN tệp ở kho tiêu thụ: GUIDE §5.3 và Notes hồ sơ mốc 2.18.1 ghi rõ để rollout chép đúng và xoá tệp cũ.
