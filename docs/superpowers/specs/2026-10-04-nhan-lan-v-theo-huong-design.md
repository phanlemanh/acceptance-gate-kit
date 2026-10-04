# Nhãn lối ra làn V theo hướng sản phẩm — design

Gốc: crm/_acceptance/soan-okr-khong-tru-luot · hồ sơ `_acceptance/nhan-lan-v-theo-huong/`

## 1. Điều owner muốn (đã viết lại, owner sửa nếu lệch)

Owner đọc thẻ Cổng Bằng chứng của phiên crm «P5: Soạn OKR — Kara sập không trừ lượt (R1h)»
(04/10) và nhầm nhiều lần ở ô «veto hay để yên»: cả hai lối đều đọc như đi lùi hoặc đứng yên,
trong khi một hành động duyệt thường là đi tới. Owner duyệt (04/10): nhãn đặt theo HƯỚNG của
sản phẩm — **«đi tiếp hay kéo lại»** — máy điền sẵn «đi tiếp», ô chuyển sang dòng báo, và
lệnh signoff vẫn nhận chữ cũ.

Thành công = người đọc thẻ làn V biết trong một lần đọc rằng máy ĐÃ đi tới, và việc duy nhất
của họ là kéo lại nếu muốn — không ô trống nào mời họ gõ một chữ không ghi gì.

## 2. Vì sao lỗi có chỗ sống

Ở làn V máy đã qua Cổng Bằng chứng không chữ ký; lối «để yên» không ghi gì và sản phẩm đi tiếp.
Nhãn gọi tên ĐỘNG TÁC của người (không làm gì) chứ không gọi HƯỚNG của sản phẩm (đi tiếp), nên
đọc ngược. Thêm vào đó ô được xếp vào nhóm HỎI với chỗ trống `___`, trong khi chính dòng hướng
dẫn nói «hoặc không trả lời gì» — câu hỏi mà câu trả lời hợp lý duy nhất là im lặng là trạm thu
phí (CLAUDE.md, North Star). Khuôn đúng đã có ngay cạnh: `Treo: phê hết`, `cắt/hoãn: đồng ý cắt`
— máy đã quyết, cửa veto mở → dòng BÁO điền sẵn.

## 3. Thiết kế

Một chỗ sinh nhãn trong `scripts/gate-card.js` (khối câu gộp Cổng 2, ~dòng 1100):

| | Trước | Sau |
|---|---|---|
| Nhãn làn V | `veto hay để yên: ___` | `đi tiếp hay kéo lại: đi tiếp` |
| Định tuyến | `routing.hoi` | `routing.bao` |
| Dòng «Trả lời mẫu» | có ô `veto hay để yên: ___` | không có ô này |
| Mục VIỆC CỦA ANH | «trả lời dạng: «veto: nêu lý do» … hoặc không trả lời gì» | «máy đã đi tiếp — không cần trả lời; muốn dừng: sửa ô cuối thành «kéo lại: <lý do>»» |
| Nút chân thẻ | «Veto» | «Kéo lại» |
| Thẻ thường | `ký hay trả: ___` (hỏi) | không đổi một byte |

Hồ sơ ĐÃ KHÉP (nghỉ · chấm bởi thực tế) hôm nay vẫn đi nhánh `MAY_DI_TIEP` (vế `NGHI`) và ô
cũ bị xoá khỏi `hoi` ở nhánh `DA_KHEP`. Vì ô mới nằm ở `bao` — mà `DA_KHEP` cố ý GIỮ dòng báo —
nhãn phải được lọc khỏi `bao` khi hồ sơ đã khép, nếu không thẻ khép sẽ báo một lối ra không còn.

Lệnh `/acceptance-gate:signoff` (thân lệnh `commands/signoff.md`) và ngữ pháp
`GATE-ONESHOT-GRAMMAR` dạy chữ mới, giữ chữ cũ làm đường đọc-cũ:
`kéo lại: <lý do>` ≡ `veto: <lý do>` (ghi `veto_state: da-veto` + entry sổ + commit
`Veto: <slug> — <tên>`, máy dừng); `đi tiếp` ≡ `để yên` (không ghi gì). Ma trận «dạng người gõ
→ hành vi» sống ở MỘT khối marker mới `GATE-ONESHOT-LAN-V` trong bản luật (gồm cả dạng ô có nhãn
`đi tiếp hay kéo lại: kéo lại: <lý do>` mà người tạo ra khi sửa ô điền sẵn); thân lệnh signoff
trỏ tên khối, không chép lại. Thuật ngữ nội bộ
(`veto_state`, `da-veto`, khối «Cửa veto» của CONTEXT.md, commit `Veto:`) giữ nguyên — chỉ chữ
mặt người đổi. `GATE-ONESHOT-SLOTS` đổi dòng `g2 veto hay để yên` → `g2 đi tiếp hay kéo lại`.
CONTEXT.md mục «Cửa veto» thêm một câu: trên thẻ, lối ra của cửa veto mang nhãn «đi tiếp hay
kéo lại».

## 4. Đo

Tệp ca mới `tests/scripts/nlvh-the.test.mjs`, fixture do code sinh (kịch bản bash
`gate2-may-di-tiep` / `gate2-4loai` của `tests/plugins/fixtures/viec-cua-anh-scenarios.sh`, thêm
review-findings + sổ khi cần). Mỗi ca chạy trên cây thật (đối chứng dương) và trên bản sao
`scripts/` đã tiêm đột biến (chiều đỏ, thông điệp ghim):

| Đột biến | Tiêm | Ca phải đỏ |
|---|---|---|
| `nhan-cu` | nhãn mới → `veto hay để yên` | NL-AC1 «nhan cu» |
| `ve-o-hoi` | `routingBao.push(lbl)` của làn V → `routingHoi.push(lbl)` | NL-AC1, NL-AC2 |
| `khep-ro` | bỏ bộ lọc nhãn khỏi `bao` ở `DA_KHEP` | NL-AC4 hàng 1 (nghỉ) |

(Đột biến «lọc chỉ khi NGHI» đã cân và BỎ: đo 04/10 hồ sơ khép bằng thực tế không đi nhánh
máy-đi-trước, nên nhãn không bao giờ tới `bao` — đột biến tương đương. Hàng thực tế giữ làm lưới
hồi quy.)
| `lech-the-thuong` | bản SAU: «Ký duyệt» → «Ký» | NL-AC3 «gate2-4loai» |
| luật: hành vi `để yên` → kéo-lại · gỡ marker LAN-V | bản sao bản luật | NL-AC5 |

AC-4 là ma trận ba hàng viết trước (nghỉ trên hồ sơ đã ký · khép bằng thực tế · `da-veto`), mỗi
hàng kiểm tiền đề trước (thẻ thật sự khép, hoặc thật sự ở «ký hay trả»).

Chiều im (NL-AC3): bản TRƯỚC = `git archive` trọn `scripts lib skills` ở cha của commit ĐẦU chạm
`scripts/gate-card.js` mang dấu `(nhan-lan-v-theo-huong)`, bản SAU = commit CUỐI như thế — cặp
commit cố định trong lịch sử nên phép so còn đúng sau 50 commit (không neo HEAD, không neo
merge-base: sau khi gộp merge-base trùng HEAD). Dựng thẻ trên `gate2-4loai` và MỌI hồ sơ thật của
kho: mỗi thẻ hoặc bằng nhau từng byte, hoặc là thẻ làn V cũ và `--extract` đổi đúng ba chỗ (nhãn
rời `hoi`, nhãn mới cuối `bao`, ô trong `one_shot`). Kịch bản `gate2-may-di-tiep` phải rơi vế hai
(đối chứng đặc hiệu: phép so nhìn thấy thay đổi).

Ca cũ ghim chữ cũ đổi theo: `HK-AC4-the` (hskt), `P192` (fixture grep), chú thích kịch bản bash.
`LM19` (dòng mẫu == `routing.hoi`) và `LM20` (routing-baseline) giữ nguyên làm lưới.

## 5. Ngoài phạm vi

- Câu «người: veto lúc nào cũng được» của bảng trạng thái (`scripts/trang-thai-ho-so.cjs`) và bản đồ.
- Câu báo một dòng làn V trong SKILL feature-loop.
- Đổi thuật ngữ nội bộ `veto_state` / `da-veto` / commit `Veto:`.
