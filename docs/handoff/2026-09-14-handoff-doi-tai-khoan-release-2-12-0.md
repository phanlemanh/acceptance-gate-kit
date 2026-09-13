# Bàn giao đổi tài khoản — mốc phát hành 2.12.0

Viết 14/09/2026. Phiên trước ngắt giữa lúc chờ bốn suite, owner đổi tài khoản.

## 0. Một phút

Mốc `release-2-12-0` đang ở **lượt chấm 3 REJECT**, owner đã chọn **lối 1 (trừ hết dàn
đo)**, nhát trừ **đã làm xong và đã commit** ở `3f492e2e`. Việc kế tiếp: **chạy bốn suite,
rồi tung lượt chấm 4.**

Ba con số phiên bản — thứ mốc này thật sự giao — **xanh từ lượt 1**. Cả ba lượt REJECT
đều do dàn đo mà chính phiên trước dựng thêm, không do vật.

## 1. Đang ở đâu

| Thứ | Giá trị |
|---|---|
| Worktree | `.claude/worktrees/release-2-12-0` |
| Nhánh | `release/2.12.0`, 8 commit trước `origin/main`, **chưa push** |
| HEAD | `3f492e2e` |
| Cây | sạch |
| Hồ sơ | `_acceptance/release-2-12-0/`, `status: implemented`, Cổng 1 đã ký |
| Hạng | **T2** — không chạm `t3_paths`, nên làn V mở |

Hồ sơ còn **4 tiêu chí, 8 phép đo**: E1 ca cắt số · E2 răng giữ số · E3a–E3e bốn suite
và bản đồ · E4 hội đồng đọc `## Notes`.

## 2. Làm ngay khi vào

**Lưới đã XANH trên đúng nội dung của `3f492e2e`** — lượt chạy nền kết thúc sau khi owner
ngắt, kết quả đọc được:

| Lưới | Kết quả |
|---|---|
| `tests/scripts` | 868 đạt, 0 trượt |
| `tests/hooks` | 70 đạt, 0 trượt |
| `tests/workflows` | đủ |
| `tests/plugins` | đủ |
| `product-map --check` | khớp |
| E1 ca cắt số · E2 răng giữ số · E3e bản đồ | đều thoát 0 |
| lint độ phủ · `gap-probe classify` | sạch · `ok` |

Đã kiểm `git diff 3f492e2e HEAD` trên `lib scripts tests feature-loop commands skills
hooks _acceptance .claude-plugin` là RỖNG, nên lưới chạy đúng cây đã commit; commit sau
đó chỉ thêm chính tệp bàn giao này.

**`main` ĐÃ NHÍCH 4 commit** sau khi nhánh này lập (`origin/main` = `c82e7570`): một đợt
dọn nhà tài liệu 27 lần `git mv` cộng hồ sơ thiết kế cho ô `nha-tai-lieu-router`. Chúng
KHÔNG chạm mã, nhưng có chạm `docs/`, mà nhánh này vừa thêm chính tệp bàn giao vào
`docs/handoff/`. Nhánh mốc **chưa gộp** main — gộp giữa chừng làm bằng chứng hoá cũ và
phải ghim lại. Hai lối:

- **Chấm trước, gộp sau** (nếp PR #174 đã dùng): tung lượt 4 trên nhánh như hiện tại, gộp
  `origin/main` một lần trước khi mở PR, rồi ghim lại nếu lưới báo hoá cũ.
- **Gộp trước, chấm sau**: chỉ chọn nếu đợt dọn tài liệu có đổi đường dẫn mà hồ sơ mốc
  đang trỏ tới. Kiểm bằng `git diff --stat release/2.12.0...origin/main -- docs/`.

**Việc kế tiếp là tung thẳng lượt chấm 4.** Nếu muốn chắc thì chạy lại bốn suite trước —
nếp ấy vừa làm CI xanh ngay lượt đầu ở PR #174 và đã bắt được một lỗi của chính hồ sơ này
(phép đo judgment thiếu trường `question`).

Sinh tham số và tung lượt 4:

```bash
S=/private/tmp/claude-501/-Users-manh-macmini-dev-acceptance-gate-kit/<session>/scratchpad
node feature-loop/scripts/s4-args.mjs --slug release-2-12-0 --root . --round 4 --no-carry --out "$S/args.json"
```

Rồi nhúng args thành hằng vào một BẢN SAO của `feature-loop/workflows/acceptance-verify.js`
lấy TỪ CÂY (không lấy từ cache plugin), kiểm vòng tròn rút-lại-khớp, `node --check`, rồi
dispatch bằng `scriptPath`. Workflow KHÔNG nhận đường dẫn tệp args.

## 3. Vì sao mốc này đã ăn ba lượt — đọc trước khi làm gì thêm

**14 trên 14 phát hiện của lượt 3 nằm trong bộ máy hồ sơ tự dựng; 0 nằm ở vật được giao.**

Trình tự đã xảy ra, kể để không lặp:

1. **Lượt 1** bắt được ba số tôi gõ tay đều sai: neo cửa sổ trỏ vào một commit Cổng 1.5
   giữa vòng (đúng là `45e5f1d8`), số vòng 2 thay vì 5, và thời gian `39h01` thay vì
   `14h11` — lệch đúng 24 giờ.
2. **Lượt 1 → 2:** tôi dựng ba script trong hồ sơ để chấm những số ấy bằng máy.
3. **Lượt 2** bắt được chính ba script đó. Nặng nhất: phép đo đối chiếu ghim **hình dạng
   diff của chính PR** vào hồ sơ sắp ký — nó đếm commit tới HEAD, nên commit chữ ký và
   commit ghim-lại (hai commit BẮT BUỘC) đều làm nó đỏ. Không có HEAD nào nó xanh được
   lúc ký. Đây là **ca thứ năm** của lớp «bất biến không được nằm trong hồ sơ đã ký», và
   bộ nhớ có sẵn ghi chú gọi đích danh «hình dạng diff của chính PR».
4. **Lượt 2 → 3:** tôi gỡ phép đo đó, giữ hai script còn lại.
5. **Lượt 3** bắt được hai script còn lại, cộng mô tả phát hành vẫn ship số 253 đã bị
   chính hợp đồng bác.
6. **Owner chọn lối 1:** trừ hết. Xong ở `3f492e2e`.

**Bài học cho phiên kế:** một mốc THUẦN CẮT SỐ không nuôi dàn đo riêng. Ba mốc 2.9.0,
2.10.0, 2.11.0 đều khai thẳng ba dòng số của luật (c) là **văn đếm tay ở Known limits**.
Đừng dựng script trong hồ sơ mốc để chấm chúng.

## 4. Đã trừ những gì ở `3f492e2e`

- `phan-lop-ha-tang.cjs` + eval `E3f` + khoá config — 7 trong 14 phát hiện. Nó thuộc ô
  `thuoc-khong-lat-verdict` ngả 5, không thuộc một mốc cắt số.
- `do-ba-dong-so.cjs` — mồ côi sau khi eval của nó bị bỏ ở lượt 2.
- Mô tả phát hành `v2.12.0`: bỏ số **253** (đúng là 182), bỏ **bốn tên kho tiêu thụ** khỏi
  manifest — product context của repo tiêu thụ không được nằm trong engine.
- `expected` của E2 và AC-2: bỏ sha ghim cứng. Lượt 2 đổi răng để suy mốc từ kho nhưng
  quên hai chỗ này, nên `expected` ghim `45e5f1d8` trong khi răng in `ef36d81f`.

## 5. Nội dung mốc — cửa sổ `45e5f1d8..HEAD`

**130 commit, NĂM vòng đóng** (bản Cổng 1 khai nhầm là hai):

| Vòng | Hạng | Lượt chấm | làm-xong→quyết-được |
|---|---|---:|---|
| `ma-so-quyet-dinh-duy-nhat` | T2 làn V | 2 | 0h30 |
| `ghim-lai-tren-lop-cu` | T2 | 1 | 9h50 |
| `cua-veto-sau-chu-ky` | T3 | 6 | 10h02 |
| `lan-doc-status-not-run` | T3 | 2 | 1h49 |
| `cong-nguoi-doc-du-nguon` | T3 | 8 | 14h11 |

**Lớp vendored đổi 4 trên 9 mục** — kho tiêu thụ chép lại đúng bốn: `lib/ac-line.cjs`
(+93 −6) · `lib/evidence-core.cjs` (+156 −4) · `lib/md-section.cjs` (+68 −1) ·
`scripts/pre-merge-check.sh` (+96 −2). Danh sách chín mục KHÔNG có mục mới.

**Giá trị tới kho tiêu thụ:** 8 kho gốc, 303 hồ sơ, 20 đọc thêm, **182 tiêu chí**. Số này
là VĂN, đã khai giới hạn — script đo nó đã gỡ vì nó duyệt `~/dev`.

## 6. Bẫy đã cắn trong phiên này, đừng dẫm lại

- **`grep -n` chung lệnh với `git`** bị hook `block-no-verify` chặn. Tách lệnh.
- **Backtick trong thông điệp commit** bị shell diễn giải khi dùng heredoc không trích
  dẫn. Dùng `<<'EOF'` hoặc tránh backtick.
- **Suite plugins đỏ trong tác tử, xanh khi chạy tại chỗ** — đã xảy ra BA lần. Khuôn
  `permissions-allow-deny` làm hạ tầng trung hoà đầu ra. Chạy lại đúng chuỗi lệnh trước
  khi tin màu đỏ.
- **LM20**: hồ sơ vừa ký thành `settled` nên đòi một dòng trong
  `tests/scripts/fixtures/routing-baseline.txt`, và chính dòng đó làm bằng chứng hoá cũ.
  Nghi thức: thêm dòng vào commit chữ ký, ghim lại ngay sau, rồi mới chạy lại pre-merge.
- **Làn ghim lại cần `--ag-root .`** ở kho tự host kit; cache plugin đang 2.11.0 thiếu ba
  export mà làn đòi.

## 7. Hàng đợi sau mốc

1. **Chiến dịch ghim lại** của mốc — một chiến dịch mỗi release.
2. **Rollout tám kho tiêu thụ.** Có một mục CÓ TÊN phải kiểm: `lib/evidence-core.cjs`
   lệch ở **cả tám kho**, không kho nào khớp 2.11.0, ba kho lệch khác nhau.
3. **Ô `thuoc-khong-lat-verdict`** — sáu ngả sửa cho chính kit, cả sáu một vòng, chấm
   bằng cổng CŨ (sửa luật verdict rồi dùng luật đã sửa để chấm là vòng tròn).
4. Ba ô mở 13/09 · mười hồ sơ chờ Cổng Giá trị · worktree `lan-status-not-run` đã gộp
   main trọn vẹn, dọn được an toàn.

## 8. Bối cảnh phiên trước

Vòng `cong-nguoi-doc-du-nguon` **đã ký và đã gộp** (PR #174, merge `5a5e29e4`), CI xanh
ngay lượt đầu. Vòng ấy ăn 8 lượt chấm và 14 lượt gọi người so trần 4; gốc rễ chi phí đã
định vị và vào ô `thuoc-khong-lat-verdict`. Bộ nhớ phiên đã ghi ở
`memory/vong-cong-nguoi-doc-du-nguon.md`.
