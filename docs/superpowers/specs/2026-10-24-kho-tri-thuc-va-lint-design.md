# TT1 — kho tri thức và lint (thiết kế)

Hồ sơ `_acceptance/kho-tri-thuc-va-lint/` · hàng TT1 của đợt `tri-thuc-2410` · mã A1, A2, A3 · nguồn
`docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md` (mục 3.1, 3.4, 3.5, 4, 7).

## Kết quả

Một kho khai nơi để tri thức một lần; một lệnh chỉ đọc kiểm kho tri thức theo khuôn một nguồn và đỏ đúng sáu lỗi cấu
trúc; đường trỏ băm phân giải giống nhau ở checkout chính và mọi worktree. Đây là nền cho TT2–TT5 — không vòng nào khác
đọc tri thức trước khi TT1 có.

## Khai trong `_acceptance/config.yaml`

```yaml
tri_thuc:
  noi: docs/tri-thuc            # gốc tri thức trong kho
  cong_khai: true               # tuỳ chọn — kho tiêu thụ công khai
  kho:                          # tuỳ chọn — kho riêng đi kèm; có khối này thì gốc tri thức là kho riêng
    ten: crm-onehub-nguon
    duong: ../crm-onehub-nguon  # tương đối thư mục CHA của git-common-dir (checkout chính), không theo worktree
    remote: https://github.com/phanlemanh/crm-onehub-nguon.git
```

Bộ đọc một nguồn `scripts/tri-thuc-khoa.cjs` (nếp `lo-trinh-khoa.cjs`: cắt đúng khối cột 0 rồi đọc khoá thụt). Vắng
khối → `null`: không bên đọc nào đổi. Có khối mà thiếu cả `noi` lẫn `kho.duong`, `cong_khai` khác true/false, `kho`
thiếu `ten` hay `duong` → danh sách lỗi có tên, lệnh thoát 2.

Gốc tri thức: `kho` có mặt → `resolve(<gốc checkout chính>, duong)`, với gốc checkout chính = thư mục cha của
`git rev-parse --path-format=absolute --git-common-dir` (crm ở `~/dev/crm`, `duong: ../crm-onehub-nguon` → `~/dev/crm-onehub-nguon`,
giống hệt khi chạy từ `~/dev/crm/.claude/worktrees/<x>`); vắng → `<gốc kho đang chạy>/<noi>`. `kho.remote` tuỳ chọn; vắng
thì dòng «không đọc được ở đây» nói «khai kho.remote để có lệnh clone» thay cho dòng `git clone`.

## Khuôn một nguồn — `skills/acceptance/references/tri-thuc-template.md`

Bốn khối marker, bên ghi (TT2, người) và bên đọc (lint, TT3–TT5) cùng rút:

- `TRI-THUC-TRANG` — frontmatter trang wiki: `loai` (nen | chu-de | dot), `ma` (danh sách, rỗng với trang nền), `nguon`
  (danh sách đường tương đối gốc tri thức tới tệp raw), `cap_nhat` (YYYY-MM-DD).
- `TRI-THUC-RAW` — `raw/<YYYY-MM-DD>-<tên>/nguon.md`: frontmatter `loai` (phien | artifact | issue | tep | kho), `goc`,
  `luc`, `ai`; thân có dòng `- \`<đường tương đối thư mục raw>\` <băm git hash-object>` cho MỌI tệp khác trong thư mục.
- `TRI-THUC-CON-TRO` — biểu thức của đường trỏ: `[<kho>:]<đường>#<băm 40 hex>`.
- `TRI-THUC-LUAT` — mẫu `TRI-THUC.md` cho kho (luật riêng của kho).

## Lệnh — `scripts/tri-thuc.mjs`

```
node scripts/tri-thuc.mjs --root . --kiem [--pham-vi <tệp>]     0 xanh · 1 đỏ · 2 không chạy được · 3 không đọc được ở đây
node scripts/tri-thuc.mjs --root . --con-tro '<ref>'           0 khớp · 1 lệch/không có · 3 không đọc được ở đây
```

Sáu lỗi của `--kiem`, mỗi lỗi một dòng `lỗi: [<mã>] <tệp>: <câu>`:

| Mã | Khi |
|---|---|
| `trang-thieu-nguon` | trang dưới `wiki/` không có `nguon` hoặc danh sách rỗng, hoặc frontmatter sai khuôn |
| `nguon-khong-co` | `nguon` của trang trỏ tệp không có dưới gốc tri thức |
| `raw-bi-sua` | băm của một tệp raw khác dòng của nó trong `nguon.md`, tệp có mà không có dòng, dòng có mà tệp không |
| `ma-khong-co-trang` | mã của bản phạm vi không nằm trong `ma` của trang nào. Bản phạm vi đọc bằng CHÍNH bộ đọc `docPhamVi` của `scripts/cat-luot.mjs` (khuôn `pham-vi-template.md`, khối `PHAM-VI-MA`) — không bộ đọc thứ hai. Nối với đợt qua khoá `dot`: trang `wiki/dot/<dot>.md`. `--pham-vi <tệp>` kiểm một bản; vắng cờ thì tự dò mọi tệp `.md` git theo dõi mà `docPhamVi` đọc ra `dot` và ≥ 1 mã, chỉ những bản có trang đợt tương ứng |
| `kho-rieng-chua-day` | kho riêng có commit chạm gốc tri thức mà remote chưa có (`git log @{u}..HEAD`), hoặc nhánh không theo dõi remote |
| `raw-trong-kho-cong-khai` | `cong_khai: true`, gốc tri thức nằm trong kho tiêu thụ, và `raw/` có tệp khác `nguon.md` |

Mã 3 «không đọc được ở đây»: khai `kho` mà máy không có bản ở đường đã giải — in đúng dòng `git clone <remote> <đường>`.
Không coi là xanh, không coi là đỏ (nhãn trạng thái của khối ĐỊNH VỊ).

`--con-tro` phân giải một đường trỏ: có tiền tố kho → kho riêng; không → gốc tri thức của kho. Băm tính bằng
`git hash-object` trên tệp ở đĩa — không cần sha commit, nên sau gộp squash hay ở máy chưa kéo commit vẫn khớp nếu nội dung
khớp.

## Gói `tri-thuc`

Theo nếp `road-map`: `tri-thuc/.claude-plugin/plugin.json` (cùng số với acceptance-gate), một mục marketplace, một lệnh
`tri-thuc/commands/kiem.md` (chỉ đọc, không khoá model-invocation) chạy đúng dòng trong khối marker `TT-KIEM-LENH`. Ca
P200 (một lần cắt số nhất quán) thêm gói thứ sáu vào danh sách cùng số.

## Không làm (vòng này)

- Ghi tri thức (`/tri-thuc:ghi`) — TT2. Trỏ nguồn từ bản phạm vi, dòng «Nguồn:» — TT3. Dòng «đã tra» — TT4.
- Chỉ mục commit, `log.md` — bỏ hẳn (phản biện mục 4).
- Lint nghĩa — TT-C2.

## Đặc tả UX

Bỏ — không có mặt web.
