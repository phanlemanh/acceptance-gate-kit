# Ô sinh từ nghi thức, và giá của một mốc cắt số — số đo 18/09/2026

**Câu hỏi của owner:** «Sao tôi có cảm giác kit dọn mãi không hoàn tất được?» rồi
«Kiểm tra lại nguyên nhân từ đâu?» và «hoạt động cắt số có đang tiêu tốn rất nhiều?».
**Ổ:** `_acceptance/o-chi-mo-khi-co-neo-ngoai/opportunity.md`.
**Cửa sổ đo:** 08/09 → 18/09/2026, nhánh `main` tại `380c1081`, máy của owner.

> Chữ trong tệp này là NGUỒN. Mọi số có lệnh tái lập ngay dưới — đừng đo lại trừ khi nghi
> số đã cũ. Lệnh chạy ở gốc kho, zsh.

## 1. Kit không dọn chậm

| | 10 ngày | lệnh |
|---|---|---|
| chữ ký Cổng Bằng chứng | **14** (9 vòng meta · 5 hồ sơ mốc · 0 vòng sản phẩm) | `git log --since=2026-09-08 --format=%s \| grep -c '^Gate 2 signoff'` |
| mốc phát hành | **7** (2.10.0 → 2.16.0) | `ls -d _acceptance/release-2-1*` |
| kho tiêu thụ nhận mốc | **0** — media-library và artifact-platform đứng ở 2.9.0, commit cuối 08/09 | `git -C ../media-library log -1 --date=short` |
| tính năng tới tay người dùng | **1** (`skill-system-v1`, OneFlow, 17/09 — theo CHANGELOG 2.15.0; máy này không tự đo được) | `grep -n 'lần đầu sau hai cửa sổ' CHANGELOG.md` |

## 2. Hàng đợi tự nuôi

| | 10 ngày | lệnh |
|---|---|---|
| ô có thư mục **mới** | **40** (35 sau khi loại 5 ô cũ nhận file mới) | `for d in _acceptance/*/; do f=$(git log --diff-filter=A --format=%ad --date=short -- "$d" \| tail -1); [[ "$f" > "2026-09-07" ]] && echo $d; done \| wc -l` |
| ô đóng | 14 | như trên |
| tồn kho chưa có hợp đồng | **46**, trong đó **24 không ghi nguồn** | `for d in _acceptance/*/; do [ -f $d/contract.md ] \|\| echo $d; done \| wc -l` |
| ô mở theo tuần | 29→31→32→33→34→35→36→37: 2 · 3 · 9 · 8 · 26 · 14 · 13 · **29** · 18 | `git log --diff-filter=A --format=%ad --date=format:%Y-%W -- _acceptance` gom theo thư mục |

Luật «cắt đuôi giữ lõi» ban hành tuần 35 (30/08). Tuần 36 mở **29 ô** — cao nhất lịch sử kho.

## 3. Ba mươi lăm ô mới sinh từ đâu

Truy commit tạo thư mục của từng ô (`git log --diff-filter=A -- _acceptance/<slug>`):

| nguồn sinh | số ô | ví dụ |
|---|---|---|
| **nghi thức phát hành** — hồ sơ mốc bắt buộc + vế «PHẢI gọi tên ≥1 chỗ cắt cho cửa sổ kế» (CLAUDE.md luật (c)) | **12** | 7 × `release-2-1x-0` · `ba-cho-cat-sau-chu-ky-cua-so-2-13` · `bo-qua-phai-thay-dinh-nghia-phep-do` · `gom-duc-ket-2-10-0` · `phep-do-o-doc-lap-thuoc-co-cua` · `rang-moc-neo-theo-ho-so` |
| **nghi thức ký** — mục «ngoài hợp đồng» định đoạt tại Cổng Bằng chứng thành «mở hợp đồng mới» (lối b) | **8** | `cong-nguoi-doc-du-nguon` một mình đẻ 4 (`bo-giai-nuot-chu-thich-yaml` · `chieu-do-xanh-vi-ban-tiem-sap` · `evals-khai-chieu-do-khong-co-vat` · `thuoc-khong-lat-verdict`) · `do-tin-tram-phan-loai` đẻ 2 · `thuoc-co-cua` đẻ 1 |
| **dọn tồn kho** — gộp 9 ô thành 3 = tạo 3 ô | **2** | `mot-khuon-cho-ben-viet-va-ben-doc` · `phat-hien-den-duoc-nguoi-ky` |
| vòng meta tự mở, không ghi neo | ~6 | `cua-veto-sau-chu-ky` · `ghim-lai-tren-lop-cu` · `ma-so-quyet-dinh-duy-nhat` · `khuon-so-tu-tinh-at` · `premerge-nhu-ci-truoc-khi-mo-pr` |
| **có neo ngoài** — ca thật ở kho tiêu thụ hoặc kit tự host | **~7** | `thuoc-co-cua` (phiên «Sửa lỗi tiếng việt») · `lan-doc-status-not-run` · `marker-descope-khong-co-bo-doc` (crm 18/09) · `nha-tai-lieu-router` · `guide-chep-ci-buoc-vao-writer` |

**22/35 ô sinh từ chính nghi thức của kit.** Không phải máy lười, không phải kho tiêu thụ đòi.

Vế «PHẢI gọi tên chỗ cắt» không có răng nào kiểm (`grep -rl 'chỗ cắt' tests scripts` = 0)
nhưng 7/7 mốc tuân đủ — vì nó nằm trong CLAUDE.md. Luật chống đếm-hình-thức là nguồn sinh
ô lớn nhất.

## 4. Ba luật hợp thành vòng khép kín

1. **Luật (c):** mỗi mốc phải có hồ sơ + phải gọi tên một chỗ cắt → mỗi lần phát hành đẻ ≥2 ô.
2. **Nghi thức thu-phạm-vi-ký-với-giới-hạn (01/09):** phạm vi không biến mất, nó chuyển sang ô
   kế. Một vòng ký = 1 ô đóng, 2–4 ô mở.
3. **Răng VC8 «mọi hạt giống có ô»** (`tests/plugins/vao-co-o.test.mjs:246`): mọi ý tưởng chạm
   tài liệu bắt buộc thành thư mục. Tồn kho là 46 thư mục bằng nhau về hình thức — không phân
   biệt «nghĩ thoáng qua» với «lỗi đang chạy ở crm».

Và luật (b) «tối đa một vòng meta giữa hai mốc» nghĩa là **muốn dọn tiếp phải phát hành
trước** — phát hành là giá để được dọn, và mỗi lần trả giá đẻ hai ô. Đơn vị kế toán của kit
là ô, không ô nào có giá âm: mở miễn phí (một commit tài liệu), đóng đắt (vòng gần nhất 54,8 M
token). Mọi phanh đang có là phanh chiều sâu, xả vào cùng một sổ không trần.

## 5. Giá của một mốc cắt số

| | số | lệnh / nguồn |
|---|---|---|
| mở → ký, giờ lịch, 7 mốc | 9,5 · 16 · 12,5 · 10 · 6,5 · 17 · 6,5 → **≈11 giờ/mốc**, ≈78 giờ/10 ngày | commit tạo thư mục vs commit `Gate 2 signoff: release-*` |
| commit toàn kho chạm hồ sơ mốc + CHANGELOG + version | **119 / 479 = 25 %** | `git log --since=2026-09-08 --no-merges --format=%h -- '_acceptance/release-2-1*' CHANGELOG.md .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json \| wc -l` |
| commit ghim lại | **38** (8 %) | `git log --since=2026-09-08 --format=%s \| grep -ciE '^repin\|ghim lại'` |
| lượt chấm S4 cho 7 mốc thuần cắt số | **≈24**: 2.10 ≥2 · 2.11 **6** · 2.12 **7** · 2.13 2 · 2.14 2 (1 BLOCKED) · 2.15 2 · 2.16 3 | `usage-report.md` + `evidence-report.md` từng mốc |
| mốc 2.16.0 — «không chạm đường vòng lặp» | 3 lượt chấm · **54,2 M token** (22,83 + 17,26 + 14,11) · **88 phút máy** · 12 phát hiện · **5 lượt gọi người so trần 4** · hợp đồng ≈490 dòng · chiến dịch ghim lại **2 h 25 → 0 hồ sơ** | `_acceptance/release-2-16-0/contract.md` §1 và §6 |
| tiền lệ rẻ | 2.5.0 và 2.7.0 đi **làn V, 1 lượt người**; 2.12.0 ghi «không đi làn V» | `git log --grep='release-2-12-0' --format=%s` |

Mốc phát hành đã phình từ «cắt số, làn V» thành một vòng T3 trọn: hợp đồng + eval + gap-probe
+ 5 dòng số + 5 khối Notes + judge AC-7 kiểm «năm khối đủ mặt» + nhát cắt + ghim lại. Một
phần tư công của kho trong 10 ngày là kế toán mốc, và không mốc nào tới kho tiêu thụ.

## 6. Giới hạn của phép đo

- Phân loại nguồn sinh ở §3 là đọc tay từ commit tạo thư mục + dòng «Gốc» trong
  `opportunity.md`; ~6 ô «không ghi neo» có thể có neo mà không ghi.
- OneFlow trên máy này dừng 18/08; `skill-system-v1` chỉ đọc qua CHANGELOG.
- Token của 2.10 → 2.15 không có bảng riêng cho chính hồ sơ mốc; chỉ 2.16 có (§6 của nó).

## 7. Ngưỡng mở lại nhánh răng — lệnh đếm (thêm 19/09)

Luật neo lên `main` bằng lời (răng VC8 mới park ở nhánh `cong-dang/o-chi-mo-khi-co-neo-ngoai`).
Ngưỡng gộp răng: **≥1 ô ở hàng chờ Cổng Đáng không có dòng `Gốc:`**. Hàng chờ = ô chưa có hợp
đồng mà `stage: discovery`, hoặc `stage: decided` + `decision: build`. Đếm:

```bash
for d in _acceptance/*/; do o=$d/opportunity.md; [ -f "$o" ] || continue; [ -f $d/contract.md ] && continue; st=$(grep -m1 '^stage:' "$o" | awk '{print $2}'); de=$(grep -m1 '^decision:' "$o" | awk '{print $2}'); { [ "$st" = discovery ] || { [ "$st" = decided ] && [ "$de" = build ]; }; } || continue; grep -q '^Gốc:' "$o" || echo "$d"; done
```

Ngày 19/09 sau khi rà: **0** dòng (hàng chờ 11 ô, cả 11 có `Gốc:`). Lệnh in ra ≥1 dòng là
ngưỡng nổ.
