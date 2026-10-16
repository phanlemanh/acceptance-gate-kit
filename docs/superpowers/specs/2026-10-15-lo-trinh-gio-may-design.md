# Lộ trình tính bằng giờ máy và token — thiết kế (RM6, hồ sơ `lo-trinh-gio-may`)

Ô cơ hội: `_acceptance/lo-trinh-gio-may/opportunity.md` (chủ kho ký Cổng Đáng 15/10, «đáng: build · ngưỡng: nhận»).
Nền mã: nhánh RM2 (`ap-chinh-sach-lo-trinh`) — cùng tệp `scripts/lo-trinh.mjs`; RM6 dựng trên đỉnh RM2.

## 1. Bài toán

Ngày mốc hôm nay do người gõ theo nhịp ngày-người: năm mốc phát hành 2.25 → 2.29 lệch ngày ra thật 3–14 ngày
(trung vị 9). Ngày gõ bị ghi đè đúng hôm phát hành, nên độ lệch không bao giờ lộ ra. Kit không ghi giờ máy hay
token của phiên thợ cho vòng nào. Chủ kho 15/10: «người dùng kit nhìn roadmap là vòng làm của MÁY».

## 2. Lối chọn

Ba lớp, đều chỉ thêm. Kho không khai gì mới vẫn chạy như cũ, chỉ thấy thêm số ước do máy tính.

**Lớp ước (tất định, không «hôm nay»).**
- Mỗi hàng có `gio_may` ước theo thứ tự ưu tiên:
  - khoá `gio_may` người khai trên hàng — một số giờ dương, hoặc cặp `[thấp, cao]`;
  - khoảng p25–p75 giờ máy ĐO của ≥ 5 vòng đã giao cùng hạng trong kho;
  - bảng luật 15/10: T2 4–7 · T3 7–10; hàng không hạng (hay hạng ngoài bảng) ước như T2, kèm chữ «chưa khai hạng»
    (kit tự xếp mọi vòng không chạm vùng T3 là T2);
  - hàng nhóm `phat-hanh` CHÍNH LÀ phần cắt bản của mốc: 1,5–2, không cộng gộp.
- Hàng thiếu khoá thì ô giờ máy mang chữ «máy ước». Trang có MỘT dòng cờ vàng đếm số hàng máy tự ước.
- Bật mặc định ở mọi kho có lộ trình (câu hỏi ở Cổng Phạm vi — lối khác: bật bằng khoá trong tệp). Kho tiêu thụ nâng
  kit thì `product-map --check` báo trang lệch, vẽ lại một lần — đường đã có của mọi lần đổi trang.
- Token: chỉ ước khi ≥ 5 vòng đã giao có `% hạn mức tuần` đo được. Ước = trung vị theo hạng nếu hạng đủ năm vòng,
  không thì trung vị chung. Chưa đủ → «chưa ước (k/5 vòng đo)».
- Mốc cộng:
  - Σ giờ máy các hàng chưa giao;
  - mỗi hàng thêm gộp 1–1,5;
  - mốc `phat-hanh` thêm cắt bản 1,5–2 — trừ khi mốc đã có hàng nhóm `phat-hanh` (không đếm hai lần);
  - Σ % ước — có hàng chưa ước thì nêu số hàng thiếu.

**Lớp ngày (theo hôm nay).**
- `lo-trinh.mjs --xem` in mỗi mốc chưa khép một dòng đúng khuôn luật 15/10:
  `<mốc>: bắt đầu ~dd/mm · ~X giờ máy · ~Y % hạn mức tuần · hoàn tất dự kiến dd/mm · mục tiêu dd/mm`.
- Bắt đầu dự kiến = max(hôm nay, hoàn tất dự kiến của mọi hàng `dung_tren` nằm ngoài mốc). Hàng ngoài mốc ấy tính
  theo mốc của chính nó; hàng không mốc thì xem như bắt đầu hôm nay.
- Hoàn tất dự kiến = bắt đầu + Σ (giờ máy giữa khoảng + giờ chờ mỗi vòng) + gộp + cắt bản, đếm liền 24 giờ một ngày.
  Một mốc một làn tuần tự: khoá máy giữ một việc nặng mỗi lúc.
- Giờ chờ mỗi vòng = trung vị giờ chờ ĐO của các vòng đã giao (hạt giống: «độ trễ cổng người đã đo»). Chưa vòng nào
  đo → 0, và dòng mốc mang «(chưa có giờ chờ đo)» — ngày khi ấy là cận sớm.
- Hàng đang dở trừ phần giờ máy đã đo của chính hồ sơ (dòng `gio-may` mới nhất trong sổ chạy); chưa đo thì tính đủ.
- `ngay` của mốc đọc là MỤC TIÊU — đọc-cũ, không đổi khoá. Hoàn tất dự kiến > mục tiêu → cờ vàng
  «mốc quá tải: dự kiến dd/mm, mục tiêu dd/mm». Không chặn.

**Lớp đo (ghi vào hồ sơ, trước chữ ký).**
- *Đóng băng dự báo.* `--mo-o` ghi `_acceptance/<slug>/du-bao.json`:
  - ước của chính hàng (giờ máy, %);
  - dự báo của mốc chứa hàng tại ngày mở (bắt đầu, hoàn tất, Σ giờ máy, giờ chờ đã cộng, giờ chờ có phải số đo không).
  Tệp mới, ghi một lần, không bao giờ ghi đè. Stdout và ô cơ hội của `--mo-o` giữ nguyên từng byte — răng AC-10 của RM2.
- *Đo vòng.* `scripts/do-vong.mjs --root . --slug <slug> --write` chạy ngay khi lượt chấm trả về, cạnh `thuoc-vat`.
  Nó nối MỘT dòng `kind:"gio-may"` vào `run-log.jsonl`:
  - cửa sổ: từ `decided_at` của ô (hay commit đầu của hồ sơ) tới lúc đo;
  - nguồn: các thư mục bản ghi phiên trên máy mà bản ghi chạm `_acceptance/<slug>/`, gồm cả tác tử con và workflow;
  - giờ máy = độ dài HỢP các khoảng hoạt động trên dòng thời gian gộp mọi bản ghi (hai sự kiện liên tiếp cách ≤ 10 phút
    là hoạt động) — tác tử chạy song song không cộng trùng; giờ chờ = phần còn lại của cửa sổ;
  - chỉ sự kiện trong cửa sổ vòng vào giờ lẫn token;
  - token theo model × loại (vào · ra · đọc bộ đệm · ghi bộ đệm), mỗi lời nhắn đếm một lần theo mã;
  - `phan_tram_tuan` (xem dưới).
  Không có bản ghi nào → dòng mang `nguon:"khong-co-ban-ghi"` và giờ/token null — nhãn «không đọc được ở đây», không
  số bịa.
- *Quy đổi % hạn mức tuần.*
  - Phiên đọc hạn mức tuần (`get_usage`) ở bước mở vòng và khi lượt chấm trả về.
  - Ghi bằng `do-vong.mjs --doc-han-muc <phần trăm> --dat-lai <ISO>` vào tệp cục bộ của máy
    (`~/.claude/acceptance-gate/han-muc.jsonl` — sự kiện của tài khoản, không của kho).
  - Tỉ lệ = Δ% giữa hai lần đọc gần nhất cùng mốc đặt lại ÷ token quy đổi của MỌI bản ghi trên máy trong cùng khoảng.
  - Token quy đổi theo giá niêm yết tương đối của từng model × loại token.
  - Cặp đọc khác mốc đặt lại hay % giảm (đổi tài khoản) → loại, `phan_tram_tuan:null` kèm lý do.
- *Đo lệch.* `lo-trinh.mjs --do-lech` in, với mỗi mốc mà mọi hàng đã giao:
  - dự báo đóng băng sớm nhất (`du-bao.json` mở sớm nhất trong mốc);
  - ngày khép thật = ngày ký Cổng Bằng chứng muộn nhất của các hàng;
  - lệch bao nhiêu ngày, cùng giờ chờ ước so với đo (để nhánh ITERATE tách được lệch do giờ máy hay giờ chờ);
  - với mỗi hàng: giờ máy ước lúc mở và giờ máy đo; hàng thiếu số đo in «thiếu số đo», và một dòng «k/N vòng có số đo».
  Đây là đường đo của ngưỡng Cổng Đáng.

**Bước của vòng.**
- SKILL feature-loop thêm một khối máy đọc `S4-DO-VONG`: lệnh đo vòng, cùng chỗ với `thuoc-vat`.
- Hai câu đọc hạn mức (S0 và S4), nằm trong khối.
- `road-map/commands/xem.md` nói thêm khối giờ máy.

## 3. Phạm vi bỏ ngoài (vào hạt giống)

- Khối dữ liệu máy đọc của trang (`lo-trinh-du-lieu`) chưa mang giờ máy. Đổi khuôn khối là phiên bản 3 — mọi bộ đọc
  chép ở kho tiêu thụ sẽ cảnh báo, nên để vòng riêng có neo.
- Đo bù vòng cũ từ bản ghi phiên — ghi vào hồ sơ đã ký là chạm hồ sơ đã ký; năm vòng đầu sau gộp tự đủ.
- Hệ số ×1,3 khi chạm vùng máy khác, hàng chờ khoá máy, lô gộp — người khai `gio_may` tay khi biết.
- Nhiều làn song song trên một mốc.

## 4. Giới hạn đã khai

- Bản ghi phiên chỉ có ở máy đã chạy vòng. Vòng chạy ở máy khác thì đo ở máy đó.
- Tỉ lệ % giả định trong khoảng hai lần đọc chỉ máy này tiêu tài khoản. Ba máy dùng chung tài khoản thì % đo cao hơn
  thật — tỉ lệ vẫn ghi kèm khoảng đọc để người soi.
- Ngưỡng 10 phút tách hoạt động/chờ là hằng của kit — tác tử chạy nền dài không sinh sự kiện sẽ bị tính là chờ.
- Khuôn bản ghi phiên là của Claude Code, không có đặc tả công bố: ca đo chạy thêm trên bản ghi thật của chính vòng
  (bỏ qua có tên khi máy không có bản ghi, như ở CI).
- Phiên dài chạm nhiều hồ sơ đổ token các việc khác trong cửa sổ vào vòng.
- Ngày đếm liền 24 giờ một ngày; giờ chờ đo được đã gồm đêm và chờ cổng.
- Dự báo đóng băng một lần lúc mở hàng đầu của mốc; chủ kho thêm hàng sau đó thì lệch là do phạm vi, `--do-lech` nêu
  số hàng thêm sau khi đóng băng.

## Đặc tả UX

Không chạm UI web theo nghĩa mặt phẳng `ui` — trang lộ trình là tệp tĩnh máy sinh, bộ đo đọc HTML. Bỏ bằng dòng sổ
«bỏ đặc-tả-UX».
