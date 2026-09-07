# Hạt giống — Thước sống theo đời model

**Ngày:** 2026-09-07 · **Trạng thái:** hạt giống, chờ owner gọi tên · **Hạng dự
kiến:** T2 (một trường ghi + một cờ vàng + một lý do ghim lại + một hình dạng
thứ 7 trong danh sách đã có; đổi schema **có đường đọc-cũ**). **Mở dưới luật
cộng 07/09.**

**Sinh từ:** «The AI-Native SDLC playbook» (07/09), play *Recurring codebase
scans* dòng 996 & 1003 và play *Continuous evals* dòng 557–558 — lớp «máy tin
nhầm chính nó» playbook chỉ ra mà kit chưa canh (mục B1 · B3 · A4 của
[bản kỹ thuật](../findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md)).

## 0. Tóm tắt một đoạn

Một hồ sơ đã ký là lời hứa «đã kiểm». Lời hứa ấy cũ đi theo **hai** trục — mã
đổi và **model đổi** — và kit chỉ theo dõi trục thứ nhất. Playbook nói thẳng:
một lượt quét là «phát biểu tại một thời điểm, *dưới một model*, và cả hai vế
đều cũ đi»; độ phủ tính từ lần chạy **gần nhất**; ca đo từng phân biệt được sẽ
**nhạt dần khi model khoẻ lên** và phải thêm ca mới. Hôm nay hồ sơ ký dưới model
đời cũ đọc y hệt hồ sơ ký đời nay, mãi mãi. Hạt giống này cho bằng chứng một
**ngày sinh theo model**, cho thước một **cờ nhạt** có việc kế, và cho danh sách
hình dạng lỗi đo-lường **hình dạng thứ 7**: thước bị nới sau khi đã đỏ.

## 1. Lỗ — bằng chứng trên nguồn (07/09, main `5c15e065`)

| Số đo | Giá trị |
|---|---|
| `evidence-report.md` ghi model nào sinh ra nó | **0/78** (4 file nhắc chữ «model» tình cờ trong lời thuật) |
| `grep model lib/evidence-core.cjs` | **0** — bộ đọc/ghi bằng chứng không biết khái niệm này |
| Cơ chế «cũ» của kit | 100 % theo diff mã (`verified_commit` → staleness theo diff PR, §7.1) |
| Vật đã có, chưa ai ghép | `feature-loop/scripts/s4-args.mjs:330-336` băm `evals.yaml` và so với dòng `kind:"baseline"` gần nhất · `feature-loop/workflows/acceptance-verify.js:943-947` ghi `non_discriminating` + `evals_hash` mỗi vòng · thẻ đã có cờ đỏ + hai con số red/green (`scripts/gate-card.js:950, 721-722`) |
| Sáu hình dạng lỗi đo-lường (`acceptance-verify.js:463-470`) | đều nói về phép đo **sinh ra đã sai**; **không** hình dạng nào nói về phép đo *hoá vô hại theo thời gian* hay *bị nới giữa hai vòng* |

## 2. Điều muốn có

1. **Ngày sinh theo model.** Bằng chứng ghi `model:` (id của phiên chấm) cạnh
   `verified_at`/`verified_commit` — phía ghi, một trường; phía đọc: hồ sơ vắng
   trường → **cờ vàng «không rõ đời model»**, không bắt migrate (nếp 1.13.0 /
   1.14.0). Khi model mặc định của kit đổi (manifest / config), thẻ của hồ sơ ký
   dưới model cũ hiện **«cũ theo model»** — là **cờ**, không tự ghim lại: ghim
   lại vẫn theo mốc phát hành (§7.1), một chiến dịch khi owner gọi.
2. **Cờ nhạt có việc kế.** `non_discriminating` bật ≥2 vòng liên tiếp cho cùng
   một eval → thẻ Cổng 2 nêu đúng eval kèm hai lối: *thêm ca mới* hay *khai giới
   hạn*. Máy **không** tự sửa thước.
3. **Hình dạng thứ 7 — thước bị nới sau khi đã đỏ.** Một dòng thêm vào
   `MEASUREMENT_SHAPES`: `evals_hash` đổi giữa vòng đỏ và vòng xanh kế tiếp
   **trong khi** diff mã không chạm `paths` của eval đó → cờ đỏ gọi tên eval. Vật
   cần đã sinh sẵn (mục 1, hàng 4).

## 3. Ràng buộc

- **Chỉ một câu hỏi cho người**, và là câu thật (khẩu vị rủi ro): *hồ sơ ký dưới
  model đời cũ có còn được tin để merge không, hay chỉ cần cờ?* Mặc định đề
  xuất: **cờ**, không chặn — chặn là biến mỗi lần đổi model thành một chiến dịch
  ghim lại toàn kho, ngược §7.1.
- Không đo-thước-của-thước: ba việc trên đều đọc vật đã có, không dựng phép đo
  đo phép đo.
- Ghi model là **vật máy ghi** — không được điền tay; hook chặn lúc ghi nếu
  `model:` không khớp phiên chấm (cùng họ với răng `verified_at`).

## 4. Vì sao chưa làm

Meta-work đóng băng; giữa hai mốc tối đa một vòng. Và vì mục 1 đổi schema:
phải đi theo mốc phát hành, có đường đọc-cũ, không rải lẻ.

## 5. Điều kiện mở lại

Ngưỡng đang đếm: **≥1 lần** một hồ sơ đã ký bị phát hiện sai bởi model đời sau
mà thẻ/lưới vẫn xanh (hôm nay 0/1 — chưa ai đo, vì chưa ghi model nên **không
thể** đếm; đó chính là lý do mục 1 nên đi trước mọi thứ khác: nó là điều kiện
để đếm được ngưỡng của chính nó). Hoặc: khi kit đổi model mặc định lần kế.

## 6. Ngưỡng (chép sang ô cơ hội khi mở)

- **SỐNG:** mọi bằng chứng mới có `model:` máy ghi; hồ sơ cũ hiện cờ vàng, không
  đỏ, không migrate; đổi model trong config → thẻ hồ sơ cũ hiện «cũ theo model»;
  chiều đỏ: bản sao gỡ trường → cờ; bản sao nới `expected` giữa vòng đỏ và vòng
  xanh → hình dạng 7 gọi đúng eval; 0 lượt gọi người thêm.
- **CHẾT:** bắt migrate hàng loạt; cờ tắt được bằng xoá một dòng (ô nuốt luật);
  `model:` điền tay qua được hook; thêm lượt gọi người/vòng.
