# Thiết kế — kho cam kết có lộ trình: chặn mở vòng không thuộc hàng (RM5)

Hồ sơ: `_acceptance/kho-cam-ket-co-lo-trinh/` · hàng RM5 của `docs/plans/lo-trinh-kit.json` · nấc 4 (+ nấc 3) của
ADR 0025 · hướng B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`). Dựng trên RM4 (`docBat`/`khoaBat` của
`scripts/lo-trinh-khoi-tao.mjs`) và RM2 (`ghiLoTrinh`/`dangChuan` của `scripts/lo-trinh.mjs`).

## 1. Một câu

Kho bật chặn (gói `road-map` bật ở `.claude/settings.json` của kho **và** `lo_trinh.chan: true` trong
`_acceptance/config.yaml`) thì hồ sơ mới không thuộc hàng lộ trình nào bị từ chối lúc mở (hook ghi tệp) và lúc gộp
(lưới trước-merge); đường chính không thêm việc cho người vì mở vòng từ một câu mô tả thì máy tự thêm hàng trước
(nấc 3). Kho không bật: không đổi byte nào.

## 2. Ba chỗ đặt răng, một bộ đọc

```
                 lib/chan-lo-trinh.cjs  (MỘT bộ đọc: bật? · hồ sơ nối? · hồ sơ mới trong diff?)
                   ▲                ▲                         ▲
  hook ghi tệp (lúc MỞ)    lưới trước-merge (lúc GỘP)    lo-trinh.mjs --them-hang (nấc 3)
  acceptance-evidence-gate  pre-merge-check.sh            feature-loop S0, mô tả tự do
```

- **Bật** = cả hai: `enabledPlugins["road-map@<marketplace>"] === true` ở `.claude/settings.json` (đọc bằng đúng
  `docBat` + `khoaBat` của RM4 — phạm vi local/người dùng không tính) **và** khoá `lo_trinh.chan` = `true`. Khoá vắng
  hoặc `false` → tắt. Khoá giá trị khác (chuỗi, số…) ở kho đã bật gói → **từ chối có tên** («lo_trinh.chan phải là
  true hoặc false»): không đoán, cùng nếp `dinh-tuyen-may`. Gói không bật → khoá không được đọc (kho chưa cam kết).
- **Nối** = cùng luật với bản đồ lộ trình (`suyTrangThai` của `lo-trinh.mjs`): một hàng của tệp đã khai mang
  `slug` = hồ sơ, HOẶC `opportunity.md` của hồ sơ ghi `lo_trinh_ma` trỏ một hàng có thật (trong `lo_trinh_tep` nếu
  ghi, không thì trong mọi tệp đã khai). Bộ đọc CJS viết lại phép nối tối thiểu ấy; bộ kiểm đối chiếu nó với
  `phanTichKho` trên cùng kho thử (round-trip hai bên đọc), để hai bên không trôi.
- **Mới** — hook: hồ sơ chưa có `contract.md` lẫn `opportunity.md` trên đĩa, và tệp đang ghi là một trong hai.
  Lưới trước-merge: hồ sơ mà ở `merge-base` chưa có tệp nào trong hai, ở HEAD có. Hồ sơ cũ không bao giờ bị chấm
  (đường đọc-cũ — không bắt kho dọn 15 + 10 hồ sơ ngoài lộ trình đang mở).

## 3. Hook — chỗ «chặn mở»

Thêm MỘT luật vào `hooks/acceptance-evidence-gate.js` (hook đã chặn `contract.md` theo cổng; thêm `opportunity.md`
vào tập tệp nó soi). Không thêm hook vào gói `road-map`: thư mục cài của gói ấy không với tới mã lõi nếu không chép
bộ giải gói (hai bản `resolve-plugin`), còn hook lõi đã cài ở mọi kho có `acceptance-gate`, và ADR 0025 giữ «mã ở
lõi». Gói `road-map` vẫn là dấu cam kết: không bật gói thì luật không đọc khoá.

Ghi `opportunity.md` mới: nội dung đang ghi có `lo_trinh_ma` trỏ hàng có thật → cho qua. Ghi `contract.md` mới:
hồ sơ đã nối (theo §2) → cho qua. Còn lại → exit 2, thông điệp:

```
kho bật chặn lộ trình (lo_trinh.chan): hồ sơ <slug> chưa thuộc hàng nào của kế hoạch.
Mở từ một hàng: /feature-loop:feature-loop <mã>
Hoặc để máy thêm hàng (câu giao qua stdin): node "<gói>/scripts/lo-trinh.mjs" --root . --them-hang --slug <slug>
```

`lo_trinh_ma` trỏ hàng không có → thông điệp nêu mã. Luật theo chính sách sẵn có của hook: `enforcement: off` → im,
`warn` → in rồi cho qua, `ACCEPTANCE_GATE_BYPASS=1` → qua. Lỗi nội bộ của luật → fail-open có tiếng (stderr), như
phần còn lại của hook.

## 4. Lưới trước-merge — chỗ «không lọt»

Hook không thấy tệp ghi bằng Bash (vd `cat > …/contract.md`) và chịu `BYPASS`. Lưới trước-merge
(`scripts/pre-merge-check.sh`) gọi `node lib/chan-lo-trinh.cjs --root . --base <ref>`: kho bật → mỗi hồ sơ mới
không nối thành một dòng `VIOLATION [<slug>]: hồ sơ mới không thuộc hàng lộ trình nào (lo_trinh.chan)`; kho không
bật → không in gì, không đổi mã thoát. Kho bật gói mà thiếu `lib/chan-lo-trinh.cjs` (bản chép CI cũ) → một dòng
`NOTE: luật chặn lộ trình NOT ENFORCED — …`, không im (nếp «luật nghỉ NOT ENFORCED»). Lệnh ấy cũng là thước của ô
cơ hội (`--base <commit bật khoá>` đếm hồ sơ lọt). `lib/chan-lo-trinh.cjs` vào `INIT-CI-COPY-LIST` với dấu
`[only-if-declared: lo_trinh]`.

## 5. Nấc 3 — máy tự thêm hàng

`lo-trinh.mjs --root . --them-hang --slug <slug>`, câu giao đọc từ stdin (không bao giờ qua đối số shell):
- Kho không bật chặn → thoát 1, một dòng, 0 byte (feature-loop đi như cũ — nấc 3 không đổi mặc định của kho chưa
  cam kết; luật 26/09).
- Kho bật: tệp đích = tệp đầu tiên trong `lo_trinh.tep`. Thêm MỘT hàng cuối khối `hang`:
  `{ "ma": <slug>, "cau_giao": <stdin, bỏ khoảng trắng đầu/cuối>, "slug": <slug>, "vi_sao": "Máy thêm khi mở vòng
  từ mô tả, <ngày>" }`, ghi bằng `ghiLoTrinh`. Mã = slug: duy nhất trong kho, khớp mẫu mã của S0, không cần sổ cấp số.
- Từ chối (thoát 2, tệp nguyên byte): tệp không ở dạng chuẩn (`dangChuan` sai) · đã có hàng mang mã hay `slug` ấy ·
  stdin rỗng · slug sai mẫu · tệp không đọc được · khoá `lo_trinh.chan` sai giá trị.
- Mở lại bằng slug sau khi hàng đã thêm và hợp đồng đã ghi: `S0-MO-O` thấy thư mục hồ sơ → `moi: false` → resume.
  Cửa sổ hở: phiên dừng sau khi thêm hàng mà trước khi ghi hợp đồng → lần mở lại sinh ô cơ hội (Cổng Đáng).
- Không ghi sổ `.so.jsonl` (sổ tự áp của RM2 — bộ đọc `phatLai` không biết loại dòng này); dấu vết là `vi_sao` và
  commit. Hàng mới chưa gắn mốc: cờ nấc 1 «đang mở vòng mà chưa thuộc mốc nào» đã hiện ở thẻ khởi động.

SKILL feature-loop, S0 bước 3: thêm khối máy-đọc `S0-THEM-HANG` (lệnh + heredoc nháy đơn) và bảng mã thoát
`S0-THEM-HANG-THOAT` (0 → đi tiếp S1 như cũ, commit hàng cùng hồ sơ · 1 → đi như cũ · 2 → dừng, in nguyên văn). Khối
chạy khi đối số là mô tả (không khớp `S0-MA-HANG-RE`, hoặc `S0-MO-O` thoát 1). Phiên quên chạy khối → hook chặn
`contract.md` và thông điệp mang đúng lệnh → phiên tự gỡ, không gọi người.

## 6. Không làm

- Câu «gắn mốc nào» trên thẻ Cổng Phạm vi cho hàng nấc 3 — cờ nấc 1 ở thẻ khởi động đã hiện; ô cơ hội mở từ hàng đã
  in dòng «Mốc: chưa gắn» (MC1 AC-8).
- Bật chặn cho kit hay crm — mỗi kho tự bật bằng một dòng khoá; kit có 5 hồ sơ cắt bản không thuộc hàng.
- Hook trong gói `road-map`, lệnh `/road-map:bat-chan` — khoá một dòng đủ; lệnh mới là lệnh khoá (ADR 0002 + P32).
- Lối miễn trừ theo loại hồ sơ (cắt bản, sửa sự cố) — nấc 3 cho mọi loại một hàng với 0 lượt người; miễn trừ theo tên
  là neo vào từ vựng một kho (luật 26/09).

## 7. Giới hạn đã khai

- Hook không thấy tệp ghi bằng Bash và chịu `BYPASS` → lưới trước-merge bắt lúc gộp, không lúc mở. Ngưỡng mở lại
  (đang đếm): ≥ 1 hồ sơ ở kho bật bị lưới trước-merge bắt mà hook đã không chặn lúc mở.
- Nhiều tệp lộ trình: nấc 3 chỉ ghi vào tệp đầu. Ngưỡng: ≥ 1 kho bật chặn có ≥ 2 tệp lộ trình.
- Heredoc của khối S0 dùng dấu kết cố định; câu giao chứa đúng dòng dấu kết sẽ bị cắt.

## 8. Đặc tả UX

Bỏ (sổ `descope`): vòng không chạm giao diện người nhìn — mặt của nó là thông điệp dòng lệnh và thẻ sẵn có.
