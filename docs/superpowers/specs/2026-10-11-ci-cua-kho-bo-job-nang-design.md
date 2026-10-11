# Thiết kế — `pre-merge-check.sh --hang-pr`: CI của kho bỏ job nặng cho PR không chạm vật

Hồ sơ: `_acceptance/ci-cua-kho-bo-job-nang/` · hàng lộ trình C1 · Cổng Đáng: chủ kho quyết build 11/10.
**Hạng T3** — vật nằm trong `scripts/pre-merge-check.sh`, thuộc `risk_tiers.t3_paths` của kit. Hàng lộ trình
ghi T2; máy suy T3 theo luật S0 và nói ra, không sửa tệp ý định.

## 1. Vấn đề

crm trả ≈ 98 % tiền Actions của tài khoản; 30 % phút của crm là test sản phẩm trên PR không đổi dòng mã nào
(17 % PR chỉ T1, 12,5 % PR chỉ hồ sơ). crm PR #369 tự lo phần T1 bằng cách rút `glob_variants`/`match_globs`
khỏi bản chép `scripts/pre-merge-check.sh` bằng `sed` — kit đổi tên hàm là khoản tiết kiệm tắt mà không ai
biết. Phần PR chỉ-hồ-sơ chưa ai lo: PR ấy không là T1, nhưng cũng không cần test sản phẩm. Số đo và cân trên
mọi kho: ô cơ hội + `docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md` §1.1, §4, §5.

## 2. Thiết kế

### 2.1 Lối gọi

```
bash <kit>/scripts/pre-merge-check.sh [root] --base <ref> --hang-pr
```

Một chế độ CỦA CHÍNH cổng, bật bằng cờ. Chế độ chỉ phân loại PR rồi thoát; không chạy luật nào của cổng
(per-slug, gap-probe, T1-escape, sổ luật). Kho không truyền cờ thì cổng chạy y như hôm nay.

### 2.2 Đầu ra — khuôn máy đọc, một chỗ có marker

Khối marker `HANG-PR-KHOA` ở đầu `pre-merge-check.sh` là bản gốc DUY NHẤT của tên khoá và tập giá trị; test và
GUIDE rút từ đó (round-trip bên viết ↔ bên đọc).

| Khoá | Giá trị | Nghĩa |
|---|---|---|
| `hang` | `T1` · `ho-so` · `T2` · `T3` · `khong-ro` | `T1`: mọi tệp khớp `t1_skip_globs` · `ho-so`: chỉ `_acceptance/` (± T1) · `T2`: có tệp ngoài `_acceptance/` và ngoài `t1_skip_globs` · `T3`: có tệp khớp `t3_paths` · `khong-ro`: không chứng minh được |
| `cham_vat` | `true` · `false` | `false` chỉ khi `hang` ∈ {`T1`, `ho-so`} |
| `ly_do` | `phan-loai` · `khong-co-pham-vi-diff` · `diff-rong` · `doi-danh-sach-hang` · `cau-hinh-loi` · `khong-phan-loai-duoc` | vì sao ra kết quả đó |

Bất biến: `cham_vat=false` ⟺ `ly_do=phan-loai` ∧ `hang` ∈ {`T1`, `ho-so`}.

Kênh: ba dòng `khoá=giá-trị` ra stdout (và CHỈ ba dòng đó, cộng dòng cảnh báo khi có) · nối đúng ba dòng vào
`$GITHUB_OUTPUT` khi biến có · một dòng tiếng người vào `$GITHUB_STEP_SUMMARY` khi biến có · một dòng
`::warning title=hang-pr::<lý do>` trên stdout cho các ca nghi ngờ do LỖI (không cho ca bình thường như push
không có base). Mọi dòng khác cổng in ra trong lúc chạy (WARNING recheck, NOTE phạm vi) bị nuốt vào một tệp tạm.

Mã thoát: 0 cho MỌI phán quyết, kể cả nghi ngờ. Lỗi cú pháp tham số (cờ lạ, `--base ""`) vẫn thoát 2 như
hôm nay — đó là lỗi nối dây, phải đỏ ngay lần đầu.

### 2.3 Phân loại — một nguồn với cổng

Chế độ đọc lại đúng các biến khối «Phân loại diff-chịu-cổng» đã tính (`DIFF_FILES` = `git diff base...HEAD`,
`DIFF_GATE_TOUCHED`, `DIFF_T3_HITS`, `DIFF_NONT1_HITS`) — cùng `match_globs`, cùng `config_list`, cùng tiến
trình. Không có bộ khớp thứ hai, không có danh sách thứ hai.

Thứ tự (dừng ở điều kiện đầu tiên đúng):

1. Cổng dừng trước khi tới khối phân loại (không có `_acceptance/`, base không giải được, git không dùng được,
   bộ lọc `--slug` sai…) → bẫy `EXIT` của chế độ in `khong-ro` · `true` · `khong-phan-loai-duoc` + cảnh báo
   chép dòng cuối của thông điệp cổng; thoát 0.
2. HEAD không có `_acceptance/config.yaml`, hoặc khối kiểm cấu hình đã đếm vi phạm (TAB, thụt lẻ, mode sai) →
   `cau-hinh-loi` + cảnh báo.
3. Không dựng được phạm vi diff (`DIFF_READY=0`) → `khong-co-pham-vi-diff`; cảnh báo chỉ khi `--base` đã khai.
4. Diff rỗng → `diff-rong` + cảnh báo.
5. Hai danh sách `t1_skip_globs`, `t3_paths` ở merge-base KHÁC ở HEAD (kể cả merge-base không có config) →
   `doi-danh-sach-hang`, không cảnh báo. Đọc danh sách merge-base bằng CHÍNH `config_list` trong một tiến trình
   con có `ACC` trỏ vào bản `config.yaml` lấy bằng `git show <merge-base>:./_acceptance/config.yaml` — không sửa
   thân hàm, cả đường node lẫn đường sed dự phòng đều là của cổng.
6. Còn lại → phân loại: `DIFF_T3_HITS` → `T3`; `DIFF_NONT1_HITS` → `T2`; `DIFF_GATE_TOUCHED` → `ho-so`; còn
   lại `T1`.

Điều 5 đóng lỗ «PR tự nới danh sách để tự bỏ test» (thêm `src/**` vào `t1_skip_globs` cùng lúc sửa `src/`) mà
không mất khoản tiết kiệm: PR đổi danh sách hiếm (khai đường mới, nâng kit ở kho chép). Đây là chính sách chủ
kho chốt ở Cổng Đáng: «nghi ngờ thì chạy đủ».

### 2.4 Không gọi thì không đổi byte

Mọi dòng thêm vào `pre-merge-check.sh` nằm giữa cặp marker `# >>> HANG-PR` … `# <<< HANG-PR` (khối khai khoá,
nhánh cờ trong vòng parse, khối cài bẫy, khối phân loại). Phép đo: bản cắt bỏ mọi vùng marker phải cho stdout +
mã thoát giống từng byte với bản đầy đủ khi không truyền cờ, trên kho mẫu và trên chính kho kit — vùng marker trơ
khi không có cờ. Vế lịch sử (bất biến còn đúng sau 50 commit): với MỌI commit không-gộp của vòng này chạm tệp cổng
(tìm bằng `git log --no-merges --grep=ci-cua-kho-bo-job-nang -- scripts/pre-merge-check.sh`), bản cắt marker của
commit đó bằng từng byte bản cắt marker của commit cha — tức vòng này chỉ CHÈN trong vùng marker. Hai vế cộng lại:
cổng không cờ sau vòng này = cổng trước vòng này. `glob_variants`
và `match_globs` giữ nguyên tên và thân (crm #369 đang dựa): công thức `sed` của crm chép nguyên văn vào test
phải còn rút được hàm và khớp đúng bảng viết trước.

### 2.5 Tài liệu cho kho — GUIDE §5.3

Một mục ngắn «Bỏ job nặng cho PR không chạm vật (tuỳ chọn)»:

```yaml
hang-pr:
  runs-on: ubuntu-latest
  outputs:
    cham_vat: ${{ steps.hang.outputs.cham_vat }}
  steps:
    - uses: actions/checkout@v4
      with: { fetch-depth: 0 }
    # lấy kit ở sha ghim như bước 2 phía trên (kho đang chép kit: gọi bản chép)
    - id: hang
      run: bash "$CLAUDE_PLUGIN_ROOT/scripts/pre-merge-check.sh" . ${GITHUB_BASE_REF:+--base "origin/$GITHUB_BASE_REF"} --hang-pr
test:
  needs: hang-pr
  if: ${{ !cancelled() && needs.hang-pr.outputs.cham_vat != 'false' }}
```

Ba điều GUIDE nói thẳng: (1) `!cancelled() &&` là bắt buộc — biểu thức `if:` không gọi hàm trạng thái nào thì
GitHub ngầm ghép `success()`, nên job `hang-pr` đỏ (lấy kit hỏng, runner lỗi, lỗi nối dây thoát 2) làm job `test`
bị BỎ QUA, và job bị bỏ qua báo «Success» kể cả khi là check bắt buộc → PR chạm vật gộp được mà không test; so
`!= 'false'` chứ không `== 'true'`, để đầu ra vắng vẫn chạy. Bảng bốn hàng: `hang-pr` xanh + `false` → bỏ ·
xanh + `true` → chạy · xanh + đầu ra vắng → chạy · `hang-pr` đỏ → chạy; (2) lọc bằng `if:` ở cấp job, không bằng `paths-ignore` ở cấp workflow — workflow bị lọc không chạy thì
check bắt buộc treo «Expected» (GitHub docs, «Handling skipped but required checks»); (3) job nào đọc hồ sơ
(ví dụ lint quét cả `_acceptance/**/rang/*.mjs`, như oxlint của crm) thì đừng gắn vào bit — bit chỉ nói «chạm
vật», không nói «chạm thước của hồ sơ».

## 3. Phương án đã loại

- **Script riêng bằng JS** (`scripts/hang-pr.mjs`, dùng `globToRe` của kit): bộ khớp JS lệch bộ khớp bash của
  cổng — đo 11/10: glob `*.md` với `docs/a.md` → bash `true`, JS `false`; `src/*.ts` với `src/a/b.ts` → bash
  `true`, JS `false`. Bit lệch cổng là đúng lỗi ô này đóng.
- **Script bash riêng rút `match_globs` bằng `sed`** (như `product-map.mjs` đang làm trong kit): dựng lại khớp
  nối mong manh, chép lại logic phạm vi diff (giải base, `...`, ba lối hỏng), và kho đang chép kit phải chép thêm
  một tệp + khai nó vào `t1_skip_globs`. Giá của phương án chọn: hạng T3.
- **Đọc danh sách merge-base ∪ HEAD rồi phân loại hai lần**: đúng hơn một chút cho PR đổi danh sách, nhưng phải
  bọc khối phân loại thành hàm (dời mã dùng chung khi vòng A và G3 đang làm gần vùng). Điều 5 rẻ hơn và theo
  đúng chính sách.
- **Bit PR nháp**: nháp là sự kiện GitHub, không phải hạng; crm #369 đã tự lo.

## 4. Giới hạn đã biết

- Cổng (không phải chế độ) vẫn đọc config ở HEAD — lỗ «PR tự nới danh sách» của luật T1-escape có từ trước, không
  thuộc vòng này.
- Phát hiện ngoài phạm vi: kit có ít nhất ba ngữ nghĩa glob cho `t1_skip_globs` — bash `match_globs` của cổng
  (`*` vượt `/`), `globToRe` của `carry-plan.mjs` mà `feature-loop/scripts/lib/phan-loai.mjs` dùng cho lớp
  `ngoai` của S4 (`*` không vượt `/`), và bản đo `savings.mjs` của finding 11/10. Hệ quả nghi ngờ: S4 xếp
  `docs/a.md` của kho khai `*.md` vào lớp vật. Ghi sổ ở đây và báo Điều phối; không sửa trong vòng này.
- Sự kiện `push` không có base → luôn chạy đủ (chính sách).

## 5. Đo

Tệp ca `tests/scripts/hang-pr.test.mjs`, kho mẫu git dựng trong lần chạy, gọi CHÍNH `scripts/pre-merge-check.sh`;
mọi đường dẫn suy từ vị trí tệp ca; mỗi ca có đối chứng dương và chiều đỏ với thông điệp ghim; ma trận viết
trước, số khẳng định = số hàng. Chi tiết ở `evals.yaml`.
