# Chân công cụ đọc đúng lệnh chỉ-gán mang lệnh con — design

Hồ sơ: `_acceptance/nen-cong-cu-gan-bang-lenh-con/` · T2 · 2026-09-24

## Vấn đề (tái hiện được)

Ở `~/dev/crm` nhánh `onehub`, khoá `executors.script.zqw_giu_nqz` là

```
B=$(git merge-base HEAD origin/onehub) && { git diff --quiet "$B" -- … || { echo "…" >&2; exit 1; }; } && bun run test -- "…"
```

Đường nền ghi `nen cong-cu: THIEU merge-base (khoa executors.script.zqw_giu_nqz)` — đỏ
nhầm: lệnh này chạy xanh ở hai lượt S4 của hồ sơ `zalo-qua-webhook` (crm-onehub#105).

Gốc: `tuDau()` trong `feature-loop/scripts/duong-nen.mjs` tách từ chỉ theo khoảng trắng
và nháy. Từ đầu `B=$(git` khớp mẫu phép gán nên bị bỏ; từ kế `merge-base` bị lấy làm tên
chương trình. Tái hiện cô lập trên chính hàm (2026-09-24) cho thấy lỗi là một LỚP, không
một ca:

| Chuỗi | `tuDau` hôm nay | Đúng |
|---|---|---|
| `B=$(git merge-base …) && …` | `merge-base` | `git` |
| `B="$(git rev-parse HEAD)" && echo` | `&&` | `git` |
| `` B=`git rev-parse HEAD`; echo $B `` | `rev-parse` | `git` |

## Ngữ nghĩa đúng (neo ngoài)

POSIX.1-2017 XCU §2.9.1 «Simple Commands»: các từ dạng `TEN=giá-trị` đứng trước tên lệnh
là phép gán; lệnh đơn KHÔNG có tên lệnh (chỉ gán) mà chứa phép thay thế lệnh thì chương
trình thật sự chạy là chương trình trong phép thay thế. `;` `&` `|` (và `&&` `||`) kết
thúc một lệnh đơn.

## Thiết kế

Thay bộ tách phẳng bằng bộ tách hiểu ba thứ, vẫn không LLM, vẫn một hàm thuần:

1. **Vùng thay thế** `$(…)`, `${…}`, `` `…` `` là MỘT phần của từ, kể cả khi bên trong có
   khoảng trắng hay nháy (cân ngoặc, lồng được); nháy đơn/kép như cũ, và trong nháy kép
   vùng thay thế vẫn được nhận.
2. **Ranh giới lệnh đơn**: `;` `&` `|` ngoài nháy/vùng kết thúc lệnh đơn
   (`>&2`, `<&0` là chuyển hướng, không phải ranh giới).
3. **Từ đầu** = từ đầu tiên không phải phép gán của lệnh đơn ĐẦU TIÊN có tên lệnh. Lệnh
   đơn chỉ-gán mà phép gán mang lệnh con `$(…)`/`` `…` `` → từ đầu là từ đầu của lệnh con
   ấy (đệ quy). Lệnh đơn chỉ-gán không lệnh con (`A=1 && x`) → xét lệnh đơn kế.

Không đổi: luật `tenChuongTrinh` (khối marker `CONG-CU-TU-DAU`) — từ đầu mang `$`, `` ` ``,
`(`, `{` vẫn bị bỏ tra và in một dòng lý do. Hệ quả duy nhất ở đó: từ đầu như
`${VAR:-$(node …)}/x.js` nay là trọn từ thay vì mảnh cụt `${VAR:-$(node` — vẫn bị bỏ tra
như cũ, và các ca đột biến NEN-TD5/TD6 ghim bằng `includes` nên vẫn khớp.

Chỉ tra MỘT chương trình mỗi khoá như hôm nay: `git merge-base`, `git diff` là lệnh con
CỦA `git`, không phải chương trình riêng; các lệnh đơn sau (`bun …`) không tra — mở rộng
sang tra mọi lệnh đơn là việc khác, ngoài phạm vi.

## Đo trên dữ liệu thật (một lần, trước khi viết vá)

Quét 5 113 khoá `executors.*` ở mọi `~/dev/*/_acceptance/config.yaml` + crm@onehub bằng
`tuDau` hiện tại: đúng MỘT khoá có từ đầu kiểu lỗi này (`zqw_giu_nqz` → `merge-base`).
Sau vá chạy lại cùng phép quét: kỳ vọng đúng một dòng đổi (`merge-base` → `git`), 0 dòng
khác đổi — số này ghi vào Notes của contract khi S3 xong. Phép quét đọc máy của tác giả
nên KHÔNG là eval; eval dùng fixture code-sinh.

## Kiểm (hai chiều, cùng fixture lành NEN0)

- NEN-LC1: chuỗi NGUYÊN VĂN của crm (dòng YAML nháy đơn chép từ `origin/onehub`, ca
  assert sha256 của nó) ở một khoá ngoài suite → mã 0, chân cong_cu xanh, 0 bullet, 0 dòng
  bỏ-qua cho khoá ấy — kèm khoá đối chứng `${X_KHONG_CO:-git} --version` cùng lượt phải có
  ĐÚNG một dòng bỏ-qua nguyên văn (chứng bộ dò nhìn thấy dòng bỏ-qua; gap-probe F1).
- NEN-LC2: `khong-co-that --x` → chân cong_cu đỏ, ghim đúng
  `nen cong-cu: THIEU khong-co-that (khoa …)`.
- NEN-LC3: ma trận 8 khoá trong MỘT lượt — {`$(…)`, `"$(…)"`, `` `…` ``, chỉ-gán trần} ×
  {chương trình có, không có}, chuỗi ghim nguyên văn trong evals.yaml (có `;` và nháy lồng);
  tập bullet cong-cu phải BẰNG ĐÚNG 4 dòng mong đợi (so bằng nhau, không `includes`), 0
  dòng bỏ-qua cho cả 8 khoá, đúng 1 cho khoá đối chứng.
- Mỗi ca kiểm round-trip trước: `resolveConfigKey` trên config fixture trả ĐÚNG chuỗi đã
  định — fixture hỏng thì ca tự đỏ với thông điệp riêng, không đọc thành xanh.
- Chiều đỏ nằm trong lịch sử: commit ca kiểm trước commit vá; trên bản chưa vá LC1 và LC3
  đỏ (đo lại ở S3 và ghi vào sổ).
