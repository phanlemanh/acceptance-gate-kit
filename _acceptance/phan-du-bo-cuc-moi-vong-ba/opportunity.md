---
schema_version: 1
slug: phan-du-bo-cuc-moi-vong-ba
feature: «Phần bộ kiểm còn bám bố cục phẳng (K4-LT, K4-TB, K4-MP, K4-RG) chạy được ở cả bố cục hôm nay lẫn plugins/<tên>/, và nhánh chính hết đỏ ở bang-ten-lo-trinh»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: manh
decided_at: 2026-11-16T07:30:00Z   # chủ kho gõ «Mở vòng ba» sau khi đọc số đo B2 16/11; phiên giữ đợt chuyển lời, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

> Mở 16/11/2026. Chủ kho gọi tên vòng ở phiên giữ đợt «chuyển nhà» bằng câu «Mở vòng ba», sau khi đọc lượt đo B2 trên
> `d8c42965`. Thay đổi đi theo mốc 3.0: **không cắt số, không gắn thẻ** ở vòng này.

## Vấn đề & ai gặp

Gốc: kit/_acceptance/phan-du-bo-cuc-moi/ — vòng hai; «Out of scope» của hợp đồng ấy dời K4-LT (174 khoá) và K4-TB (98 khoá)
«sang vòng kế dùng cùng bộ dịch». Vòng này là vòng kế ấy, cộng hai cụm mới mà chính vòng hai đẻ ra (K4-MP, K4-RG) và một
lỗi thật trên nhánh chính.

**Số NHẬN LẠI từ B2** (lượt đo 16/11, cây kịch bản `9eed5714` so cây cũ `d8c42965`, `migration/viec-kho-cu-b2.md` §4.3 và
`ket-qua/phan-du-luot-7.tsv` ở nhánh B2 chưa đẩy): cây mới thiếu **486 / 5 791** khoá.

| Cụm | Thiếu | Tệp | Hình dạng | Vòng này |
|---|---|---|---|---|
| K4-LT | 155 | 14 | lộ trình, tín hiệu: kho tiêu thụ giả trùng chữ đường kit, bản sao kit thiếu `.claude-plugin` lõi, so bản trước vòng | nhận |
| K4-TB | 92 | 8 | thẻ, bản đồ, khuôn: bung lõi vào thư mục tạm theo danh sách thư mục phẳng | nhận |
| K4-MP | 225 | 2 | `bo-cuc.test.mjs` (218), `bang-ten-lo-trinh.test.mjs` (7) dựng kho mới TỪ CÂY ĐANG CHẠY; ở cây mới cây đang chạy đã là bố cục mới → «source lạ», mã 3, không ca nào in | nhận |
| K4-RG | 5 | 1 | `recheck-goc-goi-loi.test.mjs` khai tự đúng đường mà vẫn đường phẳng | nhận |
| K4-DN | 6 | — | đổi nghĩa, chưa có chủ | không (trừ khi chủ kho nói khác) |
| B2 | 2 | — | KM-1, CT-10-do — luật đảo của kịch bản | không |
| K4-PL | 1 | — | P161: hai lối gỡ (kho này hoặc B2) | câu hỏi ở Cổng Phạm vi |

**Lỗi thật trên nhánh chính** (đọc từ CI, không phải số của B2): việc `tests` của lượt `gate` đỏ ở `d8c42965` (lượt
43786353437) và `795baf96` (lượt 43789721705), đúng một tệp `tests/scripts/bang-ten-lo-trinh.test.mjs`. Dòng 59 lấy bản
gốc bằng `git merge-base HEAD origin/main`, còn cột kỳ vọng (chú thích dòng 41) viết sẵn theo mốc `644e9b49`. Sau khi gộp,
merge-base là chính đỉnh nhánh → ca SP so mã mới với chính nó. Mọi nhánh cắt từ nhánh chính hôm nay đỏ ca này.

**Ai trả giá:**
- **Mọi nhánh của kho này** — nhánh chính đỏ, nhánh mới đỏ theo; lưới CI mất nghĩa cho tới khi sửa.
- **Phiên B2 và Cổng Bằng chứng của B2** — 477 khoá vòng này nhận là 98 % phần dư còn lại; không có vòng này thì B2 chỉ còn
  lối «bỏ khoá có lý do».
- **Mốc 3.0 (hạn đợt 04/12/2026)** — B3 cắt mốc sau B2.

**Cân trên mọi kho:** vòng chỉ đổi `tests/` và hồ sơ của chính nó — `tests/` không phát hành tới kho tiêu thụ nào. Kho
tiêu thụ: được không, mất không. Kho kit hôm nay: bộ kiểm phải xanh nguyên, cùng túi khoá. Kho kit sau cắt sang: B2 bỏ
mục vá của các tệp vòng này làm tự đúng đường (vật giao `gui-b2.md`).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bộ dịch `tests/bo-cuc.mjs` của vòng hai đủ cho K4-LT, K4-TB — không phải dựng bộ giải thứ hai | Cỡ vòng tăng nhiều lần | Chạy 25 tệp ở kho mới tạm, đọc dạng gãy | đang đo |
| 2 | Ở cây bố cục mới, «cây phẳng» mà ca K4-MP cần lấy được từ lịch sử: commit cha của commit dọn nhà là cây phẳng của chính mã ấy | Phải dựng bộ đổi NGƯỢC (mới → phẳng) có kiểm khứ hồi | Đọc cách B2 dựng cây kịch bản (con của HEAD kho cũ) | đã đọc — đúng ở lượt đo của B2 |
| 3 | Ghim bản gốc vào một commit cố định giữ được chiều đỏ của ca SP mà không phụ thuộc quan hệ HEAD ↔ origin/main | Ca vẫn đỏ sau gộp, hoặc xanh rỗng | Chạy tệp trong bản sao có origin/main = HEAD | chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau vòng này, lượt đo giữ khoá kế tiếp của B2 còn thiếu bao nhiêu khoá ở bốn cụm vòng nhận, và nhánh chính có xanh không?
- Kết quả nào là SỐNG: lượt đo giữ khoá kế tiếp của B2 thiếu 0 khoá ở K4-LT, K4-TB, K4-MP, K4-RG (không tính khoá chủ kho cho rời vòng ở Cổng Phạm vi); bộ kiểm xanh cả trên nhánh PR lẫn khi mô phỏng sau gộp.
- Kết quả nào là CHẾT: ở bố cục hôm nay một ca từng xanh hoá đỏ, biến khỏi túi khoá, hoặc một chiều đỏ có sẵn thôi đỏ — gặp là gỡ bản sửa của tệp ấy.
- Timebox: gộp trước lượt đo lại kế của B2; hạn đợt 04/12/2026.

## Kết quả prototype

Không dựng. Lớp lỗi đã đo bằng bảy lượt của B2 và hai vòng sửa ở kho này (#503, #505).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Danh sách khoá thiếu lượt 7 | nhánh B2: `migration/kich-ban/ket-qua/phan-du-luot-7.tsv`, `migration/viec-kho-cu-b2.md` §4.3 | khoá + cụm (đo trên `d8c42965`) | có, chép vào `khoa-dich.tsv` của hồ sơ, ghi rõ nguồn | — |
| Bảng vá theo tệp của B2 | nhánh B2: `migration/kich-ban/va-bo-kiem.json` | ràng-buộc nền | có, chép ảnh chụp để rút mục vá thừa | — |
| Bộ dịch, bộ dựng kho mới, thước vòng hai | `tests/bo-cuc.mjs`, `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`, `_acceptance/phan-du-bo-cuc-moi/rang/` | vật của vòng trước | có, dùng lại — không sửa byte nào của hồ sơ đã ký | — |

## Cổng 0

- **decision = build** Chủ kho gọi tên 16/11 bằng câu «Mở vòng ba», sau khi đọc số đo B2; phiên giữ đợt chuyển lời.
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** ba dòng SỐNG, CHẾT, timebox ở mục Ngưỡng — chép từ lời giao của phiên giữ đợt.
- **Neo:** `_acceptance/phan-du-bo-cuc-moi/` — hồ sơ đã ký của kho này; «Out of scope» của nó dời K4-LT, K4-TB sang vòng kế.

## Thước đo thành công → ứng viên criterion

- Nhánh chính: bộ kiểm xanh trên nhánh PR và trong bản sao mô phỏng sau gộp (origin/main = HEAD).
- Bố cục hôm nay: bộ kiểm xanh trọn; túi khoá mỗi tệp đã chạm không mất khoá nào so với bản gốc ghim.
- Bố cục mới: kho dựng bằng mã (bước 1–3 + luật đổi tên + luật chung bước 6, bỏ qua tệp tự đúng đường, không bảng vá) —
  mọi khoá đích của bốn cụm có mặt và xanh; thay bộ dịch bằng bản đồng nhất thì ca canh đỏ đúng câu.
- `gui-b2.md` bốn mục, mục vá thừa rút bằng máy từ ảnh chụp bảng vá của B2.

## Out of scope từ khám phá

- Không sửa gì ở `~/dev/delivery-loop`.
- Không sửa lệnh ký của kit (chờ CI xanh trước khi mời ký là cách làm của vòng này, không phải luật mới).
- Không cắt số, không gắn thẻ.
- K4-DN, nhóm «Ngoài-11», cụm B2 — trừ khi chủ kho nói khác ở Cổng Phạm vi.
