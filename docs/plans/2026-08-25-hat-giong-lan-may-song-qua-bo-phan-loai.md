# Hạt giống — Làn máy sống qua bộ phân loại (ô A+B, mở 25/08)

**Xuất xứ:** retro 3 tuần
`docs/findings/2026-08-25-retro-classifier-va-nghi-thuc-khong-hoc.md` — lớp lỗi
«bộ phân loại an toàn chặn làn máy» dính **~15 vòng nghiệm thu trên 5 hồ sơ,
≥28 triệu token chi cho những vòng không sinh một dòng bằng chứng máy nào**
(04/08 → 25/08). Owner gật mở ô 25/08. Ô này CHÍNH LÀ ứng viên hạt giống (c)
mà chip A ghi ngày 21/08 rồi nằm chờ — cộng thêm phần chặn gốc.

**Trace ba nguyên tố:** nguyên tố 2 — *bằng chứng không tự dối* là món cho
MÁY, nhưng tiền đề của nó là máy CHẠY ĐƯỢC lệnh kiểm; hôm nay xác suất một
vòng fan-out sống là pⁿ với n agent cần Bash. Người hưởng cụ thể: owner (thời
gian làm-xong → quyết-được đang bị cộng thêm hàng giờ chờ + chạy lại), và làn
S4 (mỗi lượt chặn đốt ~2,3M token).

## Điều muốn có — hai việc, một ô

**A · Chặn gốc cho kho tự host.** Các lệnh kiểm CỐ ĐỊNH của chính kho (bốn bộ
kiểm `tests/*/run-tests.sh` · `product-map --check` · răng hồ sơ
`_acceptance/*/rang*.sh`) được khai vào danh sách cho-phép-sẵn của
`.claude/settings.json`, để chúng thôi phải hỏi bộ phân loại ở MỌI lần chạy
của MỌI agent. Khuôn `acceptance-init` thêm một khối khuyên repo tiêu thụ làm
điều tương tự với suite của họ.

**B · Đường thoái hoá vào nghi thức.** Nhánh BLOCKED của vòng lặp hiện chỉ nói
«khắc phục nguyên nhân, chạy lại cùng round». Thêm một câu có răng: lượt
fan-out bị chặn **vì bộ phân loại** → lượt kế đi **verify độc lập — một phiên
tươi, lệnh chạy tuần tự** (đường đã sống ở skill acceptance Phase 3), KHÔNG
fan-out lại. Tiền lệ đã chứng 2/2: chip A vòng 4 thông ngay sau ba vòng chặn;
chip B đi đường này từ đầu, 0 vòng chặn.

## Vì sao tin là đúng thuốc

- **Cơ chế đã tra tận gốc:** kho có 0 luật cho phép → mọi Bash của mọi agent
  qua bộ phân loại; bão 26–30 agent = rate-limit. s4-scope-triage là ván xúc
  xắc: 3 vòng liên tiếp, mỗi vòng MỘT lệnh khác nhau trúng.
- **B không phải ý tưởng — là điều đã xảy ra hai lần và được ghi sổ**, chỉ
  chưa được viết vào vật. Retro gọi tên lớp: *bài học chưa vào VẬT là chưa tồn
  tại* — phiên 25/08 có bài học trong trí nhớ mà vẫn fan-out 4 lượt.

## Đánh đổi khai thẳng

- A cho các lệnh đó **bỏ qua bộ phân loại**. Chấp nhận được vì: danh sách
  ĐÓNG, toàn script nằm trong repo, đã qua PR review, chạy hàng chục lần/ngày;
  đảo = xoá rule. Rule phải khớp ĐÚNG lệnh (prefix cố định), không glob rộng —
  allowlist rộng là fail-open, cùng lý do kho từng từ chối miễn trừ cả
  `.github/**`.
- B thêm MỘT đoạn vào SKILL — không skill mới, không engine mới; «chỉ TRỪ
  không CỘNG» giữ được vì tổng vật phải nuôi không tăng.

## Ngưỡng chết / ngưỡng UAT (đề xuất — owner chốt CÙNG LƯỢT chữ ký Cổng Đáng)

- **Câu hỏi phép đo trả lời:** sau khi ô ship, các vòng S4 còn chết vì bộ
  phân loại không, và khi vẫn nghẽn thì có thoát được trong MỘT lượt không?
- **SỐNG:** trong 5 vòng S4 kế tiếp trên kho kit (hoặc tới 30/09, cái nào tới
  trước): 0 vòng BLOCKED vì bộ phân loại trên các lệnh đã cho-phép-sẵn; và
  không còn chuỗi ≥2 lượt fan-out BLOCKED liên tiếp — lượt kế sau một lượt
  chặn phải là đường tuần tự và phải thông.
- **CHẾT:** vẫn có chuỗi 2 lượt fan-out chặn liên tiếp; HOẶC danh sách
  cho-phép gây một sự cố thật (một lệnh trong danh sách bị dùng chạy nội dung
  ngoài dự kiến).
- **Số từ đâu:** run-log + mục Iterations của evidence-report các hồ sơ —
  đúng nguồn retro này đã dùng, không cần đường đo mới.
- **Timebox:** 2026-09-30 → không đủ vòng để đo thì `park` với số đã có.

## Giả định sinh tử

| # | Giả định | Nếu sai | Phép thử rẻ nhất |
|---|---|---|---|
| 1 | Luật cho phép trong settings áp cho CẢ Bash của subagent trong workflow | A vô hiệu, chỉ còn B | thêm 1 rule, cho 1 subagent chạy 1 lệnh suite, xem còn qua bộ phân loại không — làm NGAY đầu thi công |
| 2 | Đường tuần tự vẫn thông khi fan-out nghẽn | B vô hiệu | đã chứng 2/2 (chip A r4 · chip B r1) |
| 3 | Nhu cầu Bash còn lại của làn (judge/review/baseline) đủ thưa để không tự gây nghẽn sau khi A gỡ phần lệnh suite | giảm tần suất nhưng chưa hết lớp | đếm số lệnh Bash ngoài-suite trong một vòng từ transcript |

## Out of scope

- **C · fail-fast** (lệnh máy đầu bị chặn → dừng vòng sớm khỏi chi ~2M cho
  hội đồng/rà soát) — chạm engine workflow, xếp kho, mở lại nếu sau ô này tần
  suất chặn vẫn đáng kể.
- Sửa mint `run_id` khi BLOCKED-cùng-round (vấp 21/08) — họ hàng nhưng khác
  vật; giữ làm ứng viên riêng.
- Máy xoá chữ ký người khi ghi đè bằng chứng · làn «ship kèm giới hạn đã
  khai» — hai lỗ nghi thức khác họ, đã ghi ở retro, không nhét vào ô này.

## Prior requests

- 21/08, chip A, ứng viên hạt giống (c): «S4 cần đường thoái hoá khi fan-out
  làm classifier quá tải — đường VERIFY độc lập tuần tự đã cứu nhưng nghi thức
  chưa chỉ» — chưa từng mở file; ô này là nó.
