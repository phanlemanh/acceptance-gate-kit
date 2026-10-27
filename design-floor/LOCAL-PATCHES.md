# Sổ bản vá cục bộ — design-floor

Mã Design OS trong `design-floor/vendor/design-os/` là bản ghim `a7ad5f1` (tệp khoá
`design-floor/upstream.lock.json`, băm UPSTREAM của từng tệp) cộng đúng các bản vá ghi ở đây. Kit không gửi PR
upstream: mọi sửa đổi là một bản vá cục bộ, một dòng một bản vá. Khối máy ở cuối tệp là nguồn; bộ đo
`tests/design-floor/` là bên đọc.

| Bản vá | Trạng thái | Sửa gì | Phép đo nó làm xanh |
|---|---|---|---|
| A — bộ chấm không bút | đã áp | gỡ đường ghi sự kiện (`withOutcome`, `memory-autorecord`) khỏi `gate.ts`, `autofix.ts`, `taste-lint.ts` | DF-07, DF-08, 16 cặp `memory-*` của FN-02 |
| B — mã thoát ba trạng thái | chờ (FL3) | `partial` không lỗi → 5; thiếu tệp 3 · sai cú pháp 4 · có lỗi 2; đích không phải HTML → 5; 0 khai báo → 5 | DF-01, DF-04, DF-05, DF-06 |
| C — đầu vào tường minh | chờ (FL3) | tắt tự dò design system và registry; vắng `--tokens`/`--file` → 4 | DF-03 |
| D — làm sạch tên token trung tính | chờ (FL3) | dời `sanitizeSeg`/`buildTokensTree` khỏi `figma-ds-tokens.ts` | 4 cặp figma của FN-02 |

**Luật của sổ (bộ đo giữ):**
- Mỗi dòng `da-ap` mang: `id` · `ten` · `vi_sao` · `lam_xanh` (phép đo nó làm xanh) · `tep_va` (tệp diff) ·
  `tep` — mỗi tệp nó chạm với `truoc` (= băm tệp khoá) và `sau` (= băm tệp vendored). Dòng `cho-va` chưa có tệp
  diff hay băm; nó là chỗ một giới hạn của hợp đồng nhập trỏ `ban_va` vào.
- Tệp vendored lệch băm tệp khoá mà không nằm trong một dòng `da-ap` → VA-01 đỏ, nêu đúng tệp.
- Đảo mọi tệp diff `da-ap` (thứ tự ngược) phải trả bản vendored về đúng băm tệp khoá → FN-01.
- Thêm hay sửa một bản vá: sửa tệp diff, thêm/sửa dòng ở khối máy, rồi `node tests/design-floor/dong-bo.mjs --write`
  (chép lại từ bản ghim, áp các bản vá theo thứ tự khối máy, điền `truoc`/`sau`, dựng lại bản gói).

<!-- <<<DESIGN-FLOOR-LOCAL-PATCHES -->
```json
{
  "schema": 1,
  "ban_va": [
    {
      "id": "A",
      "trang_thai": "da-ap",
      "ten": "bộ chấm không bút",
      "vi_sao": "Lệnh chấm của bản ghim nối sự kiện vào design/memory.events.jsonl của thư mục design/ gần nhất đi ngược từ đích (spec 006 của upstream, không có cờ tắt); một bộ chấm tự ghi sổ làm hồ sơ cũ ngay khi chấm xong (ADR 0007). gate.ts kéo taste-lint.ts (loadTokenHexes) nên taste-lint.ts cũng phải gỡ lệnh nhập.",
      "lam_xanh": [
        "DF-07",
        "DF-08",
        "FN-02: 16 cặp memory-* của gate và autofix"
      ],
      "tep_va": "design-floor/patches/A-bo-cham-khong-but.patch",
      "tep": [
        {
          "path": "src/commands/autofix.ts",
          "truoc": "74b6c53ae130713024448b1e1a92a552bcf88f50839306df49f6534ce6cdc2e3",
          "sau": "5869b142b4b0642de6b2844034dd0bb430cde807a9f9712575da7918f0f6b3b2"
        },
        {
          "path": "src/commands/gate.ts",
          "truoc": "a2eb0818638208f891393d1eca8f27523fb792423566dcef39f25779299c0d65",
          "sau": "8de1aef1c23c6a59e3b896ee31213fed8024b15393d0748be97eb04b544bbd7a"
        },
        {
          "path": "src/commands/taste-lint.ts",
          "truoc": "89fad8800a2ff3eee641505d3c6e4eacaaa3571a825a6ac66d1dbcc8bd265ef6",
          "sau": "67b646b20a426fd47786195cc80647a6092c78755b4ac8fcf1c563669c965d1d"
        }
      ]
    },
    {
      "id": "B",
      "trang_thai": "cho-va",
      "ten": "mã thoát ba trạng thái",
      "vi_sao": "Bản ghim trả 0/1 cho mọi lớp kết quả và trả 0 khi phép kiểm không tính được — một eval «|| exit 1» xanh rỗng.",
      "lam_xanh": [
        "DF-01",
        "DF-04",
        "DF-05",
        "DF-06"
      ]
    },
    {
      "id": "C",
      "trang_thai": "cho-va",
      "ten": "đầu vào tường minh",
      "vi_sao": "Vắng --tokens hay --file, bản ghim dò ngược thư mục cha tìm design system — phán quyết phụ thuộc chỗ checkout nằm.",
      "lam_xanh": [
        "DF-03"
      ]
    },
    {
      "id": "D",
      "trang_thai": "cho-va",
      "ten": "làm sạch tên token trung tính",
      "vi_sao": "sanitizeSeg/buildTokensTree nằm trong figma-ds-tokens.ts nên bốn lệnh chấm kéo module Figma vào đóng kín.",
      "lam_xanh": [
        "FN-02: 4 cặp figma-ds-tokens.ts"
      ]
    }
  ]
}
```
<!-- DESIGN-FLOOR-LOCAL-PATCHES>>> -->
