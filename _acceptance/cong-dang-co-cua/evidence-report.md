---
schema_version: 2
feature_slug: cong-dang-co-cua
verdict: PASS
failed_evals: []
reason: người ký NÂNG PENDING-JUDGMENT → PASS ngày 2026-09-01 với năm hạn chế đã khai; máy không tự kết luận (bằng chứng vòng 3 do chính phiên thi công chạy)
verified_by: implementing session (KHÔNG phải fresh-context subagent — xem Known limits #4)
enforcement_mode: strict
bypass_used: false
verified_commit: cd94d0048760da55e89ecdcae12463186b5fec10
human_signoff: Manh Phan 2026-09-01 — ký với giới hạn đã khai (Known limits #1–#5)
---

# Evidence Report: cong-dang-co-cua

**Đọc dòng này trước mọi dòng khác.** Đây là báo cáo cho **hợp đồng đã THU PHẠM
VI** (ba tiêu chí AC-A/AC-B/AC-C). Hai vòng chấm bằng phiên sạch trước đó
(r1, r2) chấm bản hợp đồng **13 tiêu chí** đã bị cắt, và cả hai trả REJECT; hồ
sơ của chúng còn nguyên ở `review-findings.md` và ở commit `d90af7d2` (r1) /
`528caaa8` (r2). Vòng 3 KHÔNG phải một lần chấm sạch — nó là lần chạy lại của
chính phiên thi công. Vì thế **máy khai `PENDING-JUDGMENT`, không tự khai `PASS`**:
máy không đủ tư cách tự kết luận về mã chính nó vừa viết.

**Người ký đã nâng `PENDING-JUDGMENT` → `PASS` ngày 2026-09-01**, có ý thức về
cả năm hạn chế dưới đây — đặc biệt #1 (lỗ gốc chưa đóng) và #4 (bằng chứng vòng
3 không do phiên sạch tạo). Chữ ký nhận trách nhiệm cho đúng phần đó; nó KHÔNG
biến bằng chứng thành thứ nó không phải.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| EA | AC-A | script | PASS |
| EB | AC-A | script | PASS |
| EC | AC-C | script | PASS |

(AC-B phủ bởi EA — cùng chân `loi-thuat` ghim cả tám dòng ca của hai lời thuật.)

## Evidence

- eval: EA
  run_id: local-cong-dang-co-cua-EA-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_loi_thuat
  verified_at: 2026-09-01T07:48:00Z
  output: 11 assert xanh — hai hằng thông điệp rút từ khối marker, tám dòng ca
    của lưới thường trực (GD01…GD03-ten-field) ghim đúng tên, cộng cặp đối chứng
    hai chiều cho chính phép grep (ca chắc chắn có phải thấy; chuỗi chắc chắn
    không có phải không thấy).

- eval: EB
  run_id: local-cong-dang-co-cua-EB-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_gioi_han
  verified_at: 2026-09-01T07:48:00Z
  output: 6 assert xanh — bốn dòng ca ghim GIỚI HẠN ĐÃ KHAI, cộng hai lượt chạy
    thật: ô đang chờ Cổng Đáng thoát 2 với stdout rỗng, và cờ ép `--gate 0`
    không vẽ được gì.

- eval: EC
  run_id: local-cong-dang-co-cua-EC-r3
  exit_code: 0
  verifier: config:executors.script.cdcc_dang_thuc_lop
  verified_at: 2026-09-01T07:48:00Z
  output: 3 assert xanh — chân `round-trip` của hồ sơ đã ký `khong-ve-the-ma`
    chạy lại cho 17 pass / 0 fail; chiều đỏ ghim lại hằng số 3 trên bản sao trọn
    cây làm nó ĐỎ, chứng phép đo đọc bên viết thật.

- cmd: bash tests/scripts/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-scripts-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: 793 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-hooks-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: 60 passed, 0 failed

- cmd: bash tests/plugins/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-plugins-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: local-cong-dang-co-cua-SUITE-workflows-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: local-cong-dang-co-cua-SUITE-map-r3
  exit_code: 0
  verified_at: 2026-09-01T07:48:00Z
  output: bản đồ sản phẩm khớp hồ sơ xưởng

## Known limits

1. **Lỗ gốc CHƯA ĐÓNG.** Ô đang chờ Cổng Đáng vẫn nhận lời thuật «hồ sơ chưa có
   contract.md» với việc-kế sai hướng — đúng DEFECT 1 của báo cáo 01/09 mở ra
   vòng này. Bốn ô ở kho kit còn kẹt: `lan-may-thong-duong-ghi`,
   `phep-kiem-sach-do-theo-vung`, `hinh-o-moi-cong-dung-cho-nguoi`,
   `the-xep-nham-o-se-lam`. Ca `GD05` + chân `gioi-han` ghim đúng trạng thái đó
   để lỗ không vô hình.
2. **Ô cơ hội không đọc được thì báo sai nguyên nhân.** `opportunity.md` bị
   EACCES/EISDIR hoặc quá 1MB bị bộ đọc nuốt thành chuỗi rỗng, rồi rơi vào lời
   thuật «chưa có contract.md» thay vì kêu to. Phát hiện của vòng chấm r1, ngoài
   hợp đồng, chưa sửa. Sổ vòng-đời: `cong-dang-co-cua#4`.
3. **Đối chứng dương SELF02 CHÉP công thức thay vì GỌI phép quét của SELF01.**
   Hai bản byte-gần-giống; sửa bản này quên bản kia thì SELF01 có thể mù mà
   SELF02 vẫn xanh. Phát hiện của cả r1 lẫn r2, ngoài hợp đồng, chưa sửa. Sổ
   vòng-đời: `cong-dang-co-cua#2` và `#9`.
4. **Bằng chứng vòng 3 KHÔNG do phiên sạch tạo.** Bản thu phạm vi (gỡ làn thẻ)
   và bản vá lớp cho chân `round-trip` viết SAU vòng chấm r2, nên chưa bộ chấm
   độc lập nào đọc chúng. Ba eval + bốn suite ở trên do chính phiên thi công
   chạy. Đây là lý do máy khai `PENDING-JUDGMENT`; `PASS` trong frontmatter là
   NÂNG của người ký ngày 2026-09-01, không phải kết luận của máy.
5. **Mười hai mục «đề xuất known-limits» của r1 và các mục của r2** đã vào sổ
   vòng-đời `docs/research/known-limits-ledger.tsv` với `status: song` (đang
   mở). Phần lớn thuộc làn thẻ đã trả về ô — đọc
   `discovery/LAY-VE-LAN-THE.md` trước khi mở lại.

## Ngoài hợp đồng

Toàn bộ mục ngoài hợp đồng của r1 và r2 giữ nguyên trong `review-findings.md`.
Những mục thuộc làn thẻ Cổng Đáng đi cùng làn về ô (cây ghim `528caaa8`); ba mục
còn áp cho mã đang giao đã nêu ở Known limits #1–#3.

## Analyst

Không có eval nào không phân biệt được: mỗi chân đều mang đối chứng dương của
riêng nó, và chân `dang-thuc-lop` mang chiều đỏ chạy trên bản sao trọn cây.

## Variance

Không eval nào có `runs > 1` trong vòng này.

## Iterations

**Round 1** (phiên sạch, `394af3fb`): 14 phép đo máy + 5 suite + hội đồng phán
đoán XANH HẾT; rà soát đối kháng trả 18 phát hiện, 5 trong hợp đồng. REJECT.

**Round 2** (phiên sạch, `8e34b7da`): sửa 5 phát hiện, nới xưởng 9→12 ô. 12 phép
đo chạy lại + 2 mang sang + 5 suite + hội đồng XANH HẾT; rà soát trả 16 phát
hiện, 7 trong hợp đồng. REJECT. **Ba lớp lỗi tái phát y nguyên từ vòng 1** —
cờ-người-dùng-xuyên-chốt · hai-nguồn-cho-một-luật · đối-chứng-chép-công-thức —
nên **điều khoản dừng-vá kích hoạt**: khuôn giải sai, không phải chi tiết sai.
Máy KHÔNG mở vòng ba, trình người ba đường.

**Round 3** (phiên thi công, `b480dbb8`): owner quyết **thu phạm vi**. Làn thẻ
Cổng Đáng, chế độ ký, ngữ pháp `g0`, bộ răng 13 chân **trả về ô** (cây ghim
`528caaa8`). Hợp đồng viết lại còn ba tiêu chí; ba phép đo mới neo vào lưới
thường trực. Bốn suite + bản đồ xanh. Không phải một lần chấm sạch — xem Known
limits #4.

## Re-pin

### Re-pin lần 1 — 2026-09-01, chiến dịch mốc 2.6.0 (§7.1)

Đường khai của hồ sơ (`commands/acceptance-card.md` · `tests/scripts/run-tests.sh`)
bị cửa sổ phát hành chạm sau pin (sửa lời khai giới hạn + đính chính bình luận —
đều là chữ, không đổi hành vi đo).
run_id: repin-260-lane1
sha: 93da8752ca0e504fcd92391ee43c6897ef7fb314 · rang.sh 3/3 chân exit 0
(loi-thuat · gioi-han · dang-thuc-lop) · suite scripts + gate CI xanh trên cùng
sha · pin cũ: b480dbb8 · chữ ký người giữ nguyên.

### Re-pin lần 2 — 2026-09-03, chiến dịch mốc 2.7.0 (§7.1)

Đường khai (`scripts/gate-card.js` · `commands/acceptance-card.md` ·
`tests/scripts/run-tests.sh`) bị cửa sổ 2.7.0 chạm sau pin. Chân `dang-thuc-lop`
đỏ trên `f265b475` vì nó gọi chân `round-trip` của `khong-ve-the-ma` — cùng một
gốc (ba hằng thông điệp mới chưa có lời thuật), sửa ở `9f76d6d3`.
run_id: repin-270-lane-cdcc
sha: 9f76d6d329bf6e7476e11cd88f2bd327b46d8c58 · rang.sh **3/3 chân exit 0** · pin cũ: 93da8752 · chữ ký người giữ nguyên.

### Re-pin lần 3 — 2026-09-03, chiến dịch mốc 2.8.0 (§7.1)

Đường khai bị cửa sổ chạm sau pin `9f76d6d3`: `scripts/gate-card.js` (hằng
`GOAL_TEMPLATE`, `goal_line`, dòng HTML mới trên thẻ Cổng 1) và
`commands/acceptance-card.md`. Chạy lại **ba chân, 3/3 exit 0**
(`loi-thuat` · `dang-thuc-lop` · `gioi-han`) — trong đó `dang-thuc-lop` gọi
chân `round-trip` của hồ sơ `khong-ve-the-ma` kèm chiều đỏ, cũng xanh.
run_id: repin-20260903-r280-cdcc
sha: cd94d0048760da55e89ecdcae12463186b5fec10 · pin cũ: 9f76d6d3 · chữ ký người giữ nguyên · bốn suite + product-map --check exit 0 trên cùng cây.
