# Bộ đọc hồ sơ khoan dung — kit đọc hồ sơ thật của kho tiêu thụ không im lặng sai

Ngày: 13/10/2026 · hồ sơ `_acceptance/bo-doc-ho-so-khoan-dung/` · hạng T2 · hàng lộ trình R2 (mốc «Tinh chỉnh
sau hai đợt thử», 05/11).

## 1. Gốc (neo ngoài)

1. **crm-onehub#375, 13/10 09:09Z (Mac Studio):** bộ đọc `evals.yaml` theo dòng của kit cho qua YAML sai cú pháp
   chuẩn — crm có hồ sơ đã ký mà Bun.YAML/PyYAML không đọc được; lưới trước-gộp và CI không bắt.
2. **Hạt giống `docs/plans/2026-10-13-hat-giong-ngay-ky-dang-ngay-thang-nam.md`** (Cổng Bằng chứng
   `cau-tin-hieu-nguoi-gui`, Ngoài-12/13): chữ ký ghi ngày kiểu «10/09/2026» → câu cho người gửi mất ngày giao,
   `--cau` đỏ.

## 2. Số đo trước khi thiết kế (13/10, máy MacBook Pro)

**YAML — PyYAML 6.0.3 trên mọi `_acceptance/*/evals.yaml` của bảy kho:**

| Kho | Tệp | Không đọc được | Lớp |
|---|---|---|---|
| kit | 155 | 1 (`release-2-0-0`, đã ký) | chữ sau nháy đóng |
| crm | 228 | 4 (`dieu-phoi-hai-tang`, `no-sau-luot-5-okr`, `zalo-gui-hong-ghi-ly-do` — ba hồ sơ #375 còn lại; `danh-sach-keo-chung` — ngoài danh sách #375) | thoát sai trong nháy kép · chữ sau nháy đóng · ngoặc trong mục trần · khối chữ thụt lùi |
| artifact-platform | 176 | 1 | «: » trong giá trị trần |
| radar | 36 | 2 | dòng gốc không phải khoá (tệp mở đầu bằng trích dẫn `> …`) |
| media-library | 18 | 1 | chữ sau nháy đóng |
| oneflow · map | 41 · 8 | 0 | — |

Tổng 9/662 tệp, **sáu lớp**, lớp nào cũng có ít nhất một ca thật. Bộ đọc theo dòng của kit đọc tiếp cả 9 tệp mà
không nói gì; cái sai là **kit im**: công cụ khác của kho (Bun.YAML, PyYAML, bộ soạn) vấp mà không lưới nào của kit
nói ra. Vòng này KHÔNG đổi cách kit đọc (răng §6 so bộ đọc cũ–mới trên bảy kho).

**Ngày ký — dòng `human_signoff` của mọi `evidence-report.md` ở bảy kho:** 655 chữ ký khác rỗng, 654 mang năm-tháng-ngày; đúng 1 chữ ký không mang ngày dạng
năm-tháng-ngày mà mang ngày: `crm/_acceptance/nen-chat-ai-elements` «Mạnh 10/09/2026 — …». Bốn bộ đọc ngày ký của
kit, mỗi bộ tự viết một biểu thức chỉ nhận năm-tháng-ngày: câu cho người gửi + `--cau` (`scripts/tin-hieu.mjs`),
bảng điều khiển mở phiên (`scripts/start-scan.mjs` `ngayXong`), dải tóm tắt hồ sơ (`scripts/ho-so-tom-tat.cjs`
`ngayCua`), nhịp của bản cắt lượt (`scripts/cat-luot.mjs` `ngayDau`). Cả bốn bỏ ngày của hồ sơ ấy **im lặng**.

## 3. Thứ tự nghiệm (luật 26/09) và chỗ vòng này đứng

- *Sửa đúng tầng* cho chín tệp YAML là việc của từng kho (vật của kho): kit không sửa hồ sơ của kho, càng không
  sửa hồ sơ đã ký. Kit làm bậc kế: **bộ đọc khoan dung + cờ vàng** — đọc như hôm nay, nói ra chỗ không chuẩn.
- **Bật thêm theo lựa chọn:** một lệnh kiểm kho có thể đưa vào CI của mình, chặn khi hồ sơ trong diff không chuẩn.
- **Không đổi mặc định:** lưới trước-gộp (`scripts/pre-merge-check.sh`) và mọi tệp `lib/` không đổi — chúng là lõi
  cưỡng chế (t3_paths), và thêm một dòng cảnh báo mặc định vào CI của mọi kho là bậc cuối của thang. Ngưỡng lên
  bậc đó ghi ở §7.
- Ngày ký: *sửa đúng tầng* là **một bộ đọc chung** cho bốn mặt; bộ đọc khoan dung nhận thêm ngày/tháng/năm.

Phép thử «kho KHÔNG có sự cố này được gì, mất gì?»: YAML — được một cờ ở thẻ khi lỡ viết sai, mất 0 (không lệnh nào
đổi mã thoát, không tệp nào phải chép thêm); ngày — được 0, mất 0 (mọi chữ ký có năm-tháng-ngày đọc ra y hệt — luật
«năm-tháng-ngày thắng» ở §5 giữ đúng từng byte đầu ra cũ).

## 4. Bộ dò YAML không chuẩn — `scripts/yaml-chuan.cjs`

Hàm `yamlKhongChuan(text) → [{ dong, loai, mo_ta }]` — không ném, không đọc đĩa. Sáu lớp rút từ đặc tả YAML 1.2
(chân ngành), mỗi lớp có ca thật ở §2:

| Mã lớp | Chữ trên thẻ | Luật YAML |
|---|---|---|
| `chu-sau-nhay-dong` | chữ đứng sau nháy đóng | vô hướng có nháy đóng lại thì sau đó chỉ được chú thích |
| `thoat-sai-nhay-kep` | thoát sai trong nháy kép (vd `\S`, `\d`) | nháy kép chỉ nhận bộ thoát của đặc tả |
| `ngoac-trong-muc-tran` | ngoặc trong mục không nháy của danh sách một dòng | vô hướng trần trong ngữ cảnh luồng không chứa `[]{}` |
| `khoi-chu-thut-lui` | dòng của khối chữ thụt lùi dưới dòng đầu | thụt của khối chữ định bằng dòng nội dung đầu |
| `hai-cham-trong-gia-tri-tran` | «: » trong giá trị không nháy | vô hướng trần không chứa «: » |
| `dong-goc-khong-phai-khoa` | dòng ở lề không phải khoá | dòng cột 0 phải là khoá, chú thích, `---`/`...` |

Bộ dò **đọc theo dòng như bộ đọc của kit** và phải im trên mọi dạng hợp lệ kit đang gặp: nháy kép/đơn nhiều dòng,
`''` trong nháy đơn, `\"` trong nháy kép, khối chữ có chú thích, danh sách luồng có mục nháy chứa `[slug]`, neo
`&a`. Đây là danh sách lớp (blacklist) trên một không gian mở — chấp nhận có chủ đích (§7) và **thước của nó là
phép vi phân với PyYAML trên bảy kho**: tập tệp bộ dò cắm cờ phải BẰNG tập tệp PyYAML từ chối, từng kho, và bộ dò phải có mục ở đúng dòng lỗi đầu PyYAML báo; cùng răng ấy cho PyYAML đọc 19 ô ma trận của ca để bản hỏng/lành của ca không phải trí tưởng tượng của người viết bộ dò.

**Mặt hiện:**
- **Thẻ hai cổng** (`scripts/gate-card.js`, cạnh cờ «danh sách không đọc được» có sẵn): một cờ vàng
  «evals.yaml không phải YAML chuẩn — công cụ khác của kho (Bun.YAML, PyYAML) sẽ không đọc được, kit vẫn đọc theo
  dòng: dòng 148 (thoát sai trong nháy kép), …». Bộ dò vắng / lỗi → cờ «không kiểm được YAML chuẩn», không sập thẻ.
- **Lệnh kiểm** `node scripts/yaml-chuan.cjs --root <kho> [--base <ref>]`: in mỗi chỗ một dòng
  `<slug>/evals.yaml:<dòng> — <chữ lớp>`; thoát 0 sạch · 1 có chỗ không chuẩn · 2 không chạy được (không phải kho
  git, ref không có). `--base`: chỉ xét hồ sơ có tệp đổi từ ĐIỂM RẼ (merge-base của ref và HEAD) — hồ sơ cũ đã ký không chặn ai, kể cả khi nhánh chính đi trước chạm chúng.

## 5. Một bộ đọc ngày ký — `ngayChuKy` trong `scripts/ho-so-tom-tat.cjs`

`ngayChuKy(s) → 'YYYY-MM-DD' | null`:
1. Chuỗi có năm-tháng-ngày → trả cái ĐẦU TIÊN, đúng như các bộ đọc cũ (không kiểm lịch — giữ từng byte đầu ra cũ).
2. Không có → ngày/tháng/năm `d/m/yyyy` hoặc `dd/mm/yyyy` ĐẦU TIÊN, kiểm lịch thật (31/02 → bỏ), trả dạng
   năm-tháng-ngày. Đọc theo lối Việt (ngày trước tháng) — kit viết bằng tiếng Việt, chữ ký người Việt.
3. Không có gì → null (`--cau` vẫn đỏ «chữ ký không đọc được ngày» với chữ ký thật sự không ngày).

Nhà của hàm: `ho-so-tom-tat.cjs` đã được `tin-hieu.mjs` `require` và đã nằm trong danh sách chép sang kho tiêu thụ
khi kho khai lộ trình — không thêm tệp nào phải chép. Bốn mặt gọi nó: `tin-hieu.mjs` (`ngayKy`, `chuKyKhongNgay`),
`start-scan.mjs` (`ngayXong`, nấc chữ ký), `ho-so-tom-tat.cjs` (`ngayCua`), `cat-luot.mjs` (`ngayDau` của nhịp).

## 6. Thước

- **Ca trong suite** (`tests/scripts/yaml-chuan.test.mjs` mã YC-…, `tests/scripts/ngay-ky.test.mjs` mã NK-…):
  fixture do mã sinh trong lượt; ma trận viết trước; mỗi ca đỏ chạy CHÍNH hàm đo/lệnh trên bản base
  (`git archive 3c88d138 scripts lib dieu-phoi`) hoặc bản sao bị tiêm, sau khi bản lành xanh trên cùng fixture.
- **Răng dữ liệu thật** (`_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs`, ngoài suite — cần sáu kho trên
  máy và PyYAML): đọc bảy kho ở sha ghim (`git show <sha>:<đường>`, không đọc cây làm việc), in sha + số tệp + số
  hồ sơ từng kho; thiếu kho hoặc thiếu PyYAML → thoát 2 «không đọc được ở đây: <tên>», không bao giờ xanh trên bộ
  hụt.

## 7. Giới hạn khai trước + ngưỡng đang đếm

- **Bộ dò là danh sách sáu lớp.** Một lớp lỗi YAML thứ bảy sẽ lọt im. Ngưỡng mở hàng «bộ đọc YAML thật» (vendor một
  bộ phân tích có tên + phiên bản): ≥1 tệp ở một lần chạy `bay-kho.mjs` mà PyYAML từ chối và bộ dò im.
- **Không vào lưới trước-gộp mặc định.** Ngưỡng mở hàng T3 đưa bộ dò vào `pre-merge-check.sh`: ≥1 kho bật lệnh
  kiểm trong CI và xin nó thành mặc định, hoặc ≥1 hồ sơ mới ký sau mốc phát hành vòng này mà PyYAML từ chối.
- **Ngày kiểu Mỹ** (`m/d/yyyy`) đọc sai khi ngày ≤ 12 — 0 chữ ký như vậy ở bảy kho hôm nay.
- Bộ đọc `kiem-chuyen` của gói dieu-phoi (giới hạn đã khai của DP8: lọt ánh xạ luồng, danh sách thụt ngang khoá)
  là bộ đọc khác, ở vùng M5 — không chạm.
