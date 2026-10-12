# Đo trước — ô «chưa làm gì» trên dữ liệu thật của sáu kho (12/10/2026)

Bản chụp làm chứng cho ô cơ hội (Cổng Đáng). Không phải phép đo của hợp đồng — phép đo có chiều đỏ sinh ở S1.

**Nguồn** (mỗi kho `git fetch` rồi `git archive <nhánh chính> _acceptance` vào thư mục tạm — không ghi gì vào kho):
kit `vong/dai-tom-tat-doc-dung` @ `bd8163dc` · crm `origin/onehub` @ `4c440ab17` · radar `origin/master` @ `0d355f3` ·
oneflow `origin/main` @ `93b0129` · artifact-platform `origin/main` @ `92fc58a3e` · media-library `origin/main` @ `75f4bf4`.

**Cách đo:** với mỗi hồ sơ có `contract.md`, dựng ô `chua_lam` bằng `tomTatHoSo` của nhánh vòng trước (bản «cũ») và
bằng bản thử bộ đọc (`do-truoc-ban-thu.diff` — một bộ đọc khối dùng chung cho đầu đoạn ở `## Notes` và mục
`## Known limits` của báo cáo), so phần sau « · ». Mọi ca đổi số ở bảng dưới đã được soi tay theo cơ chế
(bốn cơ chế ở cuối tệp); số «đúng» là số MỤC của danh sách trong khối, không phải con số lời văn tự kể.

| Kho | Hồ sơ | Đổi | Số sai → số đúng | Sai → «chưa đọc được» | Chỉ bỏ cờ vàng thừa |
|---|---|---|---|---|---|
| kit | 140 | 35 | 28 | 5 | 2 |
| crm | 229 | 21 | 18 | 3 | 0 |
| radar | 36 | 21 | 15 | 3 | 3 |
| oneflow | 41 | 10 | 7 | 3 | 0 |
| artifact-platform | 192 | 0 | 0 | 0 | 0 |
| media-library | 23 | 4 | 3 | 1 | 0 |
| **Cộng** | **661** | **91** | **71** | **15** | **5** |

Sửa bản thử sau lần đo đầu (đã ghi số ở ô cơ hội: 68 · 18): mục Known limits của báo cáo dừng ở tiêu đề
`### Re-pin` — khuôn `REPIN-TEMPLATE` mà làn ghim lại của kit nối vào CUỐI báo cáo; ở báo cáo đời cũ (oneflow)
mục cuối là Known limits nên các khối ghim lại bị đọc thành giới hạn. Ba hồ sơ từ «chưa đọc được» thành đúng số.
Khối có tiêu đề mà thân trống đếm 0 — không hồ sơ thật nào đổi vì luật này.

**Giá của luật «khối hai danh sách → chưa đọc được»:** hai hồ sơ hôm nay đếm ĐÚNG nhờ may chuyển sang «chưa đọc
được» — `crm/bo-dung-khong-ket` (8 giới hạn, rồi nhóm «Tách thành việc riêng» KHÔNG phải giới hạn) và
`radar/doc-mang-v0` (13 + 19 mục, đếm phẳng ra 32 đúng). Không luật máy nào phân biệt hai kiểu nhóm đó mà không
hiểu câu; luật chủ kho: không đọc được thì không in số.

**Bốn cơ chế đếm sai hôm nay** (kèm một ca soi tay mỗi cơ chế):

1. **Đầu đoạn bọc dòng hoặc có đoạn dẫn** → bộ đọc dừng ở dòng chữ đầu tiên không phải gạch, đếm tiêu đề là 1 và
   bỏ cả danh sách. `kit/card-text-fidelity` hiện 1, khối có 6 gạch; `crm/tiep-thi-tuyen-doi-tac` hiện 2, hai khối
   có 17 + 10 gạch.
2. **Gạch trong khối tự mở bằng «known-limit(s)»** → đếm hai lần (một lần là mục của khối, một lần là gạch giới
   hạn trơn). `crm/toan-canh-okr` hiện 28, khối có 14 gạch; `radar/vo-bon-nhom` hiện 8, khối có 4.
3. **Báo cáo viết danh sách ĐÁNH SỐ** → bộ đọc mục báo cáo chỉ nhận gạch «-», nối các mục đánh số thành một đoạn.
   `kit/release-2-20-0` hiện 1, báo cáo có 7 mục; `crm/hinh-cua-luoi` hiện 1, có 6.
4. **Khối có tiêu đề con, nhiều nhóm, hoặc nhiều danh sách** → số hôm nay là ngẫu nhiên của cách nối dòng.
   `crm/auto-pr-thoi-do-o-ban-re` hiện 63, đoạn dẫn nói «Mười một giới hạn»; `crm/tong-quan-va-khung-noi-tieng-viet`
   hiện 26, đoạn dẫn nói «Ba giới hạn». Bản thử nói «chưa đọc được» — luật chủ kho đặt: không đọc được thì không in số.
   Biến thể: báo cáo đời cũ có khối `### Re-pin` (kit tự nối) nằm trong mục Known limits — bộ đọc phải dừng ở đó.

**«None.» / «Không có»:** 0 hồ sơ thật trên sáu kho ghi khối giới hạn chỉ bằng chữ ấy (305 báo cáo để TRỐNG mục
Known limits — đã đếm 0 đúng). Ca này là bảo hiểm. Một giới hạn THẬT mở bằng «không có» có tồn tại
(`crm/vao-bang-email-va-mat-khau`: «Giới hạn đã biết: không có kênh báo cho người dùng…») — bộ lọc phải giữ chặt.

**Ngoài-9 (trang đầy đủ):** hồ sơ có «Vì sao» dài hơn 400 ký tự — tức trang hồ sơ đầy đủ sẽ mất chữ khi mốc mang
vòng `dai-tom-tat-doc-dung` tới kho: kit 101 · crm 99 · radar 8 · oneflow 14 · artifact-platform 68 · media-library 11
— **301** hồ sơ.

## Từng hồ sơ đổi (cũ → bản thử)

| Hồ sơ | Hôm nay | Bản thử |
|---|---|---|
| `kit/card-text-fidelity` | 1 | 6 |
| `kit/cat-hinh-thuc` | 1 | chưa đọc được |
| `kit/codex-script-packaging` | 1 | 3 |
| `kit/cong-dang-co-cua` | 1 | 5 |
| `kit/cong-nguoi-doc-du-nguon` | 2 + cờ vàng | chưa đọc được |
| `kit/design-pass-nac-khong-dong-bo` | 1 | 6 |
| `kit/do-tin-tram-phan-loai` | 8 + cờ vàng | 7 |
| `kit/ghim-lai-noi-ra-o-khong-do` | 3 + cờ vàng | 22 |
| `kit/gom-duc-ket-2-10-0` | 1 | 8 |
| `kit/ho-so-nghi` | 2 | chưa đọc được |
| `kit/khoi-tim-loi-tra-phi-theo-vat` | 14 + cờ vàng | 12 + cờ vàng |
| `kit/lan-may-song-qua-bo-phan-loai` | 1 | 8 |
| `kit/loi-moi-cong-may-sinh` | 10 + cờ vàng | 9 + cờ vàng |
| `kit/measure-teeth-cleanup` | 1 | chưa đọc được |
| `kit/nen-cong-cu-gan-bang-lenh-con` | 4 + cờ vàng | 4 |
| `kit/nen-cong-cu-lenh-shell` | 6 + cờ vàng | 6 |
| `kit/release-2-10-0` | 4 + cờ vàng | 8 + cờ vàng |
| `kit/release-2-14-0` | 9 + cờ vàng | 8 |
| `kit/release-2-15-0` | 17 | 12 |
| `kit/release-2-16-0` | 22 + cờ vàng | 15 + cờ vàng |
| `kit/release-2-17-0` | 1 | 4 |
| `kit/release-2-18-0` | 1 | 4 |
| `kit/release-2-18-1` | 1 | 4 |
| `kit/release-2-18-2` | 1 | 4 |
| `kit/release-2-18-3` | 1 | 5 |
| `kit/release-2-18-4` | 1 | 6 |
| `kit/release-2-18-5` | 1 | 6 |
| `kit/release-2-19-0` | 1 | 6 |
| `kit/release-2-20-0` | 1 | 7 |
| `kit/release-2-6-0` | 1 + cờ vàng | 7 + cờ vàng |
| `kit/release-2-7-0` | 3 | 7 |
| `kit/release-2-9-0` | 7 | 8 |
| `kit/start-bang-dieu-khien` | 2 + cờ vàng | chưa đọc được |
| `kit/thuoc-co-cua` | 10 | 8 |
| `kit/thuoc-khai-mot-dang-do-mot-neo` | 3 | 7 |
| `crm/agent-builder-noi-tieng-viet` | 9 | 8 |
| `crm/auto-pr-thoi-do-o-ban-re` | 63 | chưa đọc được |
| `crm/bo-dung-khong-ket` | 8 | chưa đọc được |
| `crm/cai-dat-con-lai-noi-tieng-viet` | 7 + cờ vàng | 16 + cờ vàng |
| `crm/chan-lai-component-ra-man` | 7 | 4 |
| `crm/chu-mac-dinh-thu-vien-ngoai` | 6 | 5 |
| `crm/cua-so-tro-chuyen-noi-tieng-viet` | 11 | 7 |
| `crm/dieu-phoi-30-ngay-dau` | 23 | 28 |
| `crm/duong-proto-cho-design-pass` | 1 | 13 |
| `crm/hinh-cua-luoi` | 1 | 6 |
| `crm/khang-dinh-microsoft-co-rang` | 1 | 6 |
| `crm/lenh-chung-khong-an-cache-doi` | 8 | 6 |
| `crm/luoi-day-do-that` | 1 | 5 |
| `crm/man-xin-quyen-co-rang` | 2 | 5 |
| `crm/noi-zalo-cho-nguoi-moi` | 10 | 14 |
| `crm/quyen-luot-mang-theo` | 5 + cờ vàng | 10 |
| `crm/tat-preview-agent-okr` | 1 | 6 |
| `crm/thuoc-cache-het-doi-tuong` | 5 | 3 |
| `crm/tiep-thi-tuyen-doi-tac` | 2 + cờ vàng | 27 |
| `crm/toan-canh-okr` | 28 | 14 |
| `crm/tong-quan-va-khung-noi-tieng-viet` | 26 + cờ vàng | chưa đọc được |
| `radar/bo-hinh-loi` | 1 + cờ vàng | 10 |
| `radar/bon-vai-va-be-mat` | 2 + cờ vàng | 10 + cờ vàng |
| `radar/bon-vai-va-quyen` | 11 + cờ vàng | 11 |
| `radar/do-dung-cai-da-hua` | 6 | 3 |
| `radar/doc-mang-v0` | 32 | chưa đọc được |
| `radar/dot-0a-nhin-duoc` | 7 + cờ vàng | 6 |
| `radar/duong-ghi-cham-sang` | 6 + cờ vàng | 6 |
| `radar/duong-ghi-mot-luat-va-noi-ra` | 3 | 11 |
| `radar/hai-man-phai-noi-duoc` | 2 + cờ vàng | 10 |
| `radar/loi-thoai-va-cam-nguon` | 2 | chưa đọc được |
| `radar/luoi-phai-thuc-su-do` | 3 | 5 |
| `radar/may-chu-va-lop-ngu-nghia` | 24 | chưa đọc được |
| `radar/mo-hinh-cam-duoc` | 1 + cờ vàng | 6 |
| `radar/o1` | 10 | 11 |
| `radar/quet-lop-phai-dem-duoc` | 2 | 10 |
| `radar/reui-khoa-cau-do` | 1 + cờ vàng | 6 + cờ vàng |
| `radar/reui-khoa-pro` | 1 | 5 |
| `radar/reui-setup` | 1 | 6 |
| `radar/thuoc-do-phai-in-nhan` | 5 + cờ vàng | 5 |
| `radar/vo-bon-nhom` | 8 | 4 |
| `radar/xuong-du-lieu-mau` | 1 + cờ vàng | 7 |
| `oneflow/cong-tu-canh-minh` | 1 | 6 |
| `oneflow/director-wire-shape` | 9 + cờ vàng | chưa đọc được |
| `oneflow/hai-duong-chay-mot-venv` | 1 + cờ vàng | 10 |
| `oneflow/kho-khoa-toan-ven` | 11 | 7 |
| `oneflow/mo-hoa-b01` | 22 | chưa đọc được |
| `oneflow/o-do-chay-0-ca-van-xanh` | 12 | 7 |
| `oneflow/roadmap-drift-guard` | 4 | chưa đọc được |
| `oneflow/scan-scope-diagnostics` | 1 | 5 |
| `oneflow/scan-with-block-imports` | 1 | 3 |
| `oneflow/skill-system-v1` | 1 | 16 |
| `media-library/cua-nguon-thong-nhat` | 1 + cờ vàng | 7 + cờ vàng |
| `media-library/duyet-tai-cho` | 6 + cờ vàng | 2 + cờ vàng |
| `media-library/lai-lo-tai-cho` | 10 + cờ vàng | chưa đọc được |
| `media-library/tiktok-external-ref` | 1 + cờ vàng | 6 + cờ vàng |
