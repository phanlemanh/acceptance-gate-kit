---
schema_version: 1
slug: bat-bien-san-pham
feature: "«Mỗi kho khai các luật sản phẩm của mình trong một tệp; luật được nạp lúc viết đặc tả, và vòng nào phạm luật thì thẻ cổng nêu tên luật đó»"
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:    # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: BB1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> **Mở lại 11/10 — hàng BB1 của «Lộ trình kit nghiệm thu» (`docs/plans/lo-trinh-kit.json`).** Chủ kho
> gọi tên 11/10 (tư duy SaaS cho OneHub). Điều kiện mở của khối «Xếp lại 18/09» bên dưới đã đủ: có một
> hồ sơ cụ thể ở kho tiêu thụ để trỏ — dòng `Gốc:` ở mục «Vấn đề & ai gặp». `stage` về `discovery`;
> chữ «làm» vẫn do chủ kho gõ ở Cổng Đáng. Câu giao thay tên cũ của ô: «Bất biến sản phẩm —
> PRODUCT-INVARIANTS.md ở gốc repo tiêu thụ, luật sản phẩm nạp lúc viết đặc tả, thứ khó-đảo tự nổi lên
> thẻ như mục người».

> **Xếp lại (park) 18/09 — luật neo thu phạm vi (owner chọn đường B), Mạnh ký.** chưa hồ sơ cụ thể
> nào ở kho tiêu thụ để trỏ — bản đồ sản phẩm là lớp tài liệu, chưa thành hồ sơ. Chữ giữ nguyên,
> không xoá: khi có một hồ sơ cụ thể `<kho>/_acceptance/<slug>` để trỏ thì thêm dòng `Gốc:` dạng ấy
> và đổi `stage:` về `discovery` là ô mở lại.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/okr-soat-anh-luot-3 — `contract.md` mục Known limits, dòng «Ngoài-1 và Ngoài-7»: bộ rà nêu hai lần «ghi cứng lại múi giờ Việt Nam», chủ kho ghi giới hạn đã biết ở Cổng Bằng chứng 26/09 vì thẻ trình nó là chuyện mã lặp, không phải câu «múi giờ là cấu hình của tổ chức hay hằng số».

**Người gặp:** chủ kho crm, và qua chủ kho là **phiên Claude Code** của crm. Chủ kho 11/10 đặt tư duy
SaaS cho OneHub: không ghi cứng thứ riêng của một tổ chức, khác nhau giữa các tổ chức là cấu hình, luôn
có tổ chức mẫu, việc lặp lại thành tự phục vụ. Hôm nay luật ấy chỉ sống trong đầu chủ kho. Máy không
đọc nó ở bước thiết kế, nên mỗi vòng tự quyết ngầm thứ riêng của tổ chức. Cổng chỉ thấy nó muộn, ở dạng
một lỗi mã của riêng vòng đó.

**Đo 11/10 trên crm** (`origin/onehub` `27d47de04`, chỉ đọc; bản chụp + lệnh sinh:
[`do-11-10/mui-gio-crm.md`](do-11-10/mui-gio-crm.md)):

| Phép đo | Kết quả |
|---|---|
| Tệp mã sản phẩm ghi cứng múi giờ Việt Nam (`Asia/Ho_Chi_Minh` hoặc `+07:00`) | **12 tệp · 14 dòng**, rải ở OKR, Kho tài liệu, nhắc 30 ngày, thư mật khẩu, chi phí và đối soát AI |
| Hàm «ngày/giờ Việt Nam» tự dựng lại | **8 hàm** ở 5 tệp (`ngayVN` hai bản, `gioVN` hai bản, `homNayVN` + `homNayVn`, `thangVN`, `dauNgayVN`) |
| Múi giờ trong khuôn dữ liệu (`*.prisma`) | **0 dòng** — không phải cấu hình của không gian làm việc |
| Dòng sổ người quyết có nhắc múi giờ, trên 238 hồ sơ | **5/5 là «ghi Known limits» ở Cổng Bằng chứng** · 0 ở bước thiết kế hay Cổng Phạm vi |
| Hồ sơ neo `okr-soat-anh-luot-3` | Ngoài-1 + Ngoài-7 (mã lặp lại múi giờ) → Known limits; thẻ không gọi tên luật nào vì kho chưa khai luật |
| Vòng riêng đã tốn cho lỗi múi giờ | `zalo-gio-theo-mui-gio-xuong` (lỗi thấy ở production 25/09, 3 tiêu chí) · `ngay-gieo-theo-gio-vn` (6 tiêu chí) |

Cùng lớp «thứ riêng của một tổ chức bị ghi cứng», thấy trong lời rà của crm (chưa đếm đủ, ghi để lần
ra): đồng tiền USD dự phòng khi thiết lập tiền tệ chưa tải (`o-so-tien-doc-theo-tieng` → thêm vòng
`tien-te-chua-tai-khong-doan`, 10 tiêu chí) · lời chào Slack ghi cứng «30 ngày đầu» dù mỗi kế hoạch có
số ngày riêng (`may-nhac-truoc-nguoi`) · mã quốc gia `'84'` viết lần hai trong câu SQL
(`dien-thoai-ca-nhan`).

**Vì sao là việc của kit, không chỉ của crm** (luật 26/09): mọi kho tiêu thụ đều có luật sản phẩm sống
ngoài vật — media-library `## Product Context` trong `CLAUDE.md`, artifact-platform spec kiến trúc + skill
hub-invariants, radar `docs/00-nen-tang`, crm/oneflow thư mục ADR. Kit không có chỗ nạp nó lúc viết đặc tả
và không có chỗ gọi tên nó trên thẻ. Kho KHÔNG khai tệp thì không được gì, không mất gì: không đổi byte nào.

Đề bài gốc: `docs/plans/2026-09-02-hat-giong-bat-bien-san-pham.md`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Ở kho tiêu thụ, máy đang tự quyết thứ riêng của một tổ chức mà không cổng nào hỏi thành câu cho người | không có lỗ, việc này là bảo hiểm | đếm trên hồ sơ thật của một kho | **Đã thử 11/10** — bảng đo trên: 12 tệp, 5/5 quyết định người là «ghi Known limits», 0 câu hỏi ở bước thiết kế |
| 2 | Một tệp một trang ở gốc kho, mỗi luật một mã, là đủ — nội dung do kho viết, kit chỉ mang khuôn | tệp phình, không ai đọc; hoặc kit phải soạn luật hộ kho | crm viết bản đầu (luật SaaS) trên khuôn của vòng này | Chưa thử — bàn đo là chính tệp crm sẽ viết |
| 3 | Không cần bộ đọc mới: trích một luật ở bước thiết kế là căn cứ «mục tiêu + quy tắc đã khai» của khoá `can_cu` (vòng A2) — tệp + câu trích kiểm có ở gốc nhánh; phạm luật là câu hỏi mang mã luật | phải tự chế bộ đọc → lớp lỗi khớp-tờ-khai-với-vật tái phát | ma trận hình dạng viết trước, chạy trên bản sao do mã sinh theo hình dạng hồ sơ `okr-soat-anh-luot-3` | Chưa thử — đứng sau khi A2 lên `main` |
| 4 | Thẻ Cổng Bằng chứng gọi được tên luật từ lời rà mà không sửa `feature-loop/workflows/` — hợp đồng chở mục «luật đã nạp», bộ rà đã đọc hợp đồng | nửa Cổng Bằng chứng cần sửa bộ chấm (vùng của máy kia) → tách thành vòng hai | thử một lượt rà trên bản sao có hợp đồng mang mục ấy | Chưa thử — đo ở bước thiết kế |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] khi một kho đã khai luật sản phẩm, vòng nào chạm luật có bị thẻ cổng gọi đúng tên luật trước khi gộp, mà không thêm lượt gọi người?
- Kết quả nào là SỐNG: [đề xuất] ba mươi ngày sau khi crm commit tệp luật: mọi vòng mới của crm có dòng nạp luật ở bước thiết kế (ghi phiên bản tệp), và ≥ 1 lần thẻ cổng nêu đúng tên một luật bị chạm trước khi gộp (ghi kèm N vòng); 0 lần máy sửa tệp luật; 0 lượt gọi người thêm mỗi vòng
- Kết quả nào là CHẾT: [đề xuất] một vòng crm sau ngày khai có mục ngoài hợp đồng cùng lớp với một luật đã khai (ví dụ thêm một hằng múi giờ) mà thẻ không gọi tên luật đó; hoặc máy sửa tệp luật; hoặc thêm một lượt gọi người mỗi vòng
- Timebox: [đề xuất] đọc ở Cổng Giá trị ba mươi ngày sau ngày crm commit tệp luật; crm chưa khai tệp trong 21 ngày sau khi mốc mang vòng này phát hành → ô xếp lại (không kho nào nhận)

## Kết quả prototype

Không dựng prototype — vật là một khuôn tệp, một dòng nạp ở bước thiết kế và hai khối trên thẻ đã có;
bàn đo là bản sao do mã sinh theo hình dạng hồ sơ crm, dựng trong vòng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hồ sơ `okr-soat-anh-luot-3` và năm hồ sơ cùng lớp | `crm` `27d47de04:_acceptance/` | dữ liệu đo | có — chỉ đọc; bộ kiểm dựng bản sao do mã sinh theo hình dạng, không chép tệp crm vào kit | — |
| Khoá `can_cu` + bộ xếp lớp căn cứ | vòng A2 `buoc-len-thiet-ke-khong-hoi` (chưa lên `main`) | mã của kit | có — đứng trên nó, không dựng bộ đọc thứ hai | — |
| Ổ cắm mẫu `ds_skill` (khoá config trỏ file + luật vắng-thì-gì) | kit `_acceptance/config.yaml` | triết-lý/logic | có — chỉ luật vắng-thì-gì; tệp ở đường cố định nên không thêm khoá config | — |
| Play «Requirements and design» | The AI-Native SDLC playbook (Anthropic, 21/08/2026), `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | triết-lý/logic — luật nạp lúc viết, cờ có chủ luật, ghi phiên bản luật | có | — |
| Bản consumer tự làm | media-library `CLAUDE.md ## Product Context`; artifact-platform `docs/spec/…` + skill hub-invariants | vật liệu tham chiếu, không chép | không | — |

## Cổng 0

- **decision = …** Chờ chữ chủ kho ở Cổng Đáng (gọi tên 11/10; luật CỘNG đòi chữ ký đích danh).
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` ở trên sau khi người gỡ tiền tố.

**Máy khuyến nghị:** `build`, hạng **T2**, **một vòng**, dự kiến **10 tiêu chí**. Hạng: vật chạm khuôn
mẫu trong `skills/acceptance/references/`, bước thiết kế của `feature-loop/skills/feature-loop/SKILL.md`,
`scripts/gate-card.js`, bộ xếp lớp căn cứ của A2 và tài liệu — không chạm `lib/**`, `hooks/**` hay cổng
chặn gộp. Thứ tự: thiết kế đi ngay, làm vật chỉ sau khi A2 lên `main`. Cỡ vượt 13 ở bước thiết kế → máy tự
tách nửa Cổng Bằng chứng (giả định 4) thành vòng hai, không hỏi lại. Chính sách của vòng, chốt một lần
ở đây: mọi lần phạm một luật đã khai là câu hỏi trên thẻ đã có (không thêm lượt); luật khai «khó đảo»
mang nhãn khó-đảo bất kể nguồn căn cứ; máy chỉ đề nghị sửa tệp luật trong hồ sơ vòng, không bao giờ
sửa tệp. Chữ «Làm» ở đây là chữ ký đích danh của luật CỘNG.

## Thước đo thành công → ứng viên criterion

1. Khuôn tệp luật trong kit: mỗi luật một mã, một câu luật, có/không khó đảo, chủ luật, cách giữ (tên test, hoặc «giữ bằng mắt»). Chỉ khái niệm — không có luật mẫu nào của một kho.
2. Kho không có tệp ở gốc → sổ quyết định, thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng không đổi byte nào (so trên mọi hồ sơ thật đang có trên máy).
3. Kho có tệp → bước thiết kế ghi một dòng nạp kèm phiên bản tệp, mang căn cứ theo khuôn của A2.
4. Lựa chọn thiết kế trích một luật → căn cứ trỏ tệp luật + câu trích; câu trích không có ở gốc nhánh → đỏ với thông điệp ghim (dùng bộ xếp lớp của A2, không bộ đọc mới).
5. Lựa chọn thiết kế phạm một luật → câu hỏi trên thẻ Cổng Phạm vi nêu mã + câu luật + chủ luật; luật khó đảo mang nhãn khó-đảo.
6. Mã luật được nêu mà tệp không có → đỏ (thước gắn vật).
7. Vòng sửa tệp luật → thẻ nêu thành mục người khó-đảo; commit của máy sửa tệp → cờ đỏ.
8. Thẻ Cổng Bằng chứng: mục ngoài hợp đồng gọi một mã luật → mang tên luật và đứng ở khối câu hỏi, không vào «ghi Known limits» mặc định — phát lại trên bản sao do mã sinh theo hình dạng `okr-soat-anh-luot-3`.
9. Hồ sơ đời trước (không dòng nạp) đọc như cũ; hồ sơ nháp ở kho có tệp mà thiếu dòng nạp → một cờ vàng có tên.
10. Không thêm lượt gọi người: mọi câu luật gom vào thẻ đã có — đếm lượt dừng của vòng mẫu trước và sau.

## Out of scope từ khám phá

- Máy KHÔNG sửa `PRODUCT-INVARIANTS.md` (đính chính ADR 0007: tệp người viết ≠ bản đồ máy sinh). Máy chỉ đề nghị trong hồ sơ vòng; chủ kho sửa bằng commit riêng.
- **Nội dung luật** của bất kỳ kho nào — crm tự viết bản đầu (luật SaaS); kit không chở luật mẫu của một tổ chức.
- **Sửa crm** cho múi giờ, đồng tiền, mã quốc gia thành cấu hình — việc sản phẩm của crm, hàng riêng bên crm sau khi có luật. Phanh «phổ quát quá sớm»: luật giữ ranh giới cấu hình/mã từ đầu; phần phổ quát chỉ làm khi có tổ chức hay kho thứ hai thật.
- **Cờ vàng «chưa khai luật»** cho kho không có tệp (hạt giống 02/09 từng đề xuất) — bỏ: kho không có sự cố này không được trả giá (luật 26/09).
- **Khoá config trỏ đường tệp** — tệp ở đường cố định gốc kho; bớt một ổ cắm.
- Không gọi là spec / kiến trúc / PRD; không đặt nhịp quyết-hết-từ-đầu; không dựng bộ đọc frontmatter thứ hai; không thêm cổng người hay thao tác cổng thứ tám.
- Không sửa `feature-loop/workflows/`, `feature-loop/scripts/`, khối TRONG-DOT, `dieu-phoi/` (vùng máy kia).
