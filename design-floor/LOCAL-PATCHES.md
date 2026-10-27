# Sổ bản vá cục bộ — design-floor

Mã Design OS trong `design-floor/vendor/design-os/` là bản ghim `a7ad5f1` (tệp khoá
`design-floor/upstream.lock.json`, băm UPSTREAM của từng tệp) cộng đúng các bản vá ghi ở đây. Kit không gửi PR
upstream: mọi sửa đổi là một bản vá cục bộ, một dòng một bản vá. Khối máy ở cuối tệp là nguồn; bộ đo
`tests/design-floor/` là bên đọc.

| Bản vá | Trạng thái | Sửa gì | Phép đo nó làm xanh |
|---|---|---|---|
| A — bộ chấm không bút | đã áp | gỡ đường ghi sự kiện (`withOutcome`, `memory-autorecord`) khỏi `gate.ts`, `autofix.ts`, `taste-lint.ts` | DF-07, DF-08, 17 cặp của FN-02 |
| B — mã thoát ba trạng thái | đã áp | bảng mã lớp lỗi ở `output.ts` (thiếu 3 · sai cú pháp 4 · nội bộ 1); có lỗi 2; không đo được 5 | DF-01, DF-04, DF-05, DF-06 |
| C — đầu vào tường minh | đã áp | vắng `--tokens`/`--file` → 4, không tự dò | DF-03 |
| D — cây token trung tính | đã áp | chép thân `figma-ds-tokens.ts` sang `dtcg-token-tree.ts`, đổi hai chỗ nhập | 3 cặp figma của FN-02 |

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
        "FN-02: 17 cặp — 16 cặp memory-* của gate và autofix, cộng cặp figma-ds-tokens.ts của autofix (nó chỉ kéo module Figma qua đường ghi sự kiện)"
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
      "trang_thai": "da-ap",
      "ten": "mã thoát ba trạng thái",
      "vi_sao": "Bản ghim trả 0/1 cho mọi lớp kết quả và 0 khi phép kiểm không tính được — một eval «|| exit 1» xanh rỗng. Bảng EXIT_BY_CODE ở output.ts gom lớp lỗi về một chỗ (thiếu/không đọc được 3 · sai cú pháp 4 · khác 1 = lỗi nội bộ); gate, token-coverage trả 5 cho đích không phải HTML, partial không lỗi, 0 khai báo; có lỗi → 2 ở bốn lệnh.",
      "lam_xanh": [
        "DF-01",
        "DF-04",
        "DF-05",
        "DF-06"
      ],
      "tep_va": "design-floor/patches/B-ma-thoat-ba-trang-thai.patch",
      "tep": [
        {
          "path": "src/commands/flow.ts",
          "truoc": "632a70d6c6aa15a124e1987062d0cb14bc6a9d9270794af1c3763123f9e44ae7",
          "sau": "130efc30026ada400ae6f4dbff76185b73530dfaced59292880acc98a27d27da"
        },
        {
          "path": "src/commands/gate.ts",
          "truoc": "8de1aef1c23c6a59e3b896ee31213fed8024b15393d0748be97eb04b544bbd7a",
          "sau": "cce795f5e55f52f269163b7037844b1161741ff50db0c1634714db952802935e"
        },
        {
          "path": "src/commands/reuse-plan-check-impl.ts",
          "truoc": "0f4fec7c03eb62af9f8acfe821f13dc1df7e5388badc87d1fb111aa39b409066",
          "sau": "ae9ee05fa0272ac64eff8ca2536fcd59a09f91f6f937a5016c0cc48ea5884a6c"
        },
        {
          "path": "src/commands/token-coverage.ts",
          "truoc": "c20aadd8828d893ccd97fda498daa947d4be47b3baabc8e4df2d87615e15d7f9",
          "sau": "3d29527d4c8614e6b6c1355cae91c753f4f3483efc729fe7ce9daca2f2b60bbe"
        },
        {
          "path": "src/core/output.ts",
          "truoc": "6148fd60c8b71d4e6450dc9905cc964871449517ffe58221e8d922e645aca24b",
          "sau": "8a4e2dfb5abd37ac06e80e56034c789ebf91527f60f2f8503171f66421b1a434"
        }
      ]
    },
    {
      "id": "C",
      "trang_thai": "da-ap",
      "ten": "đầu vào tường minh",
      "vi_sao": "Vắng --tokens hay --file, bản ghim dò ngược thư mục cha tìm design system — phán quyết phụ thuộc chỗ checkout nằm. Ba lệnh đòi đầu vào tường minh, vắng → BAD_ARG (4 qua bảng của B).",
      "lam_xanh": [
        "DF-03"
      ],
      "tep_va": "design-floor/patches/C-dau-vao-tuong-minh.patch",
      "tep": [
        {
          "path": "src/commands/gate.ts",
          "truoc": "cce795f5e55f52f269163b7037844b1161741ff50db0c1634714db952802935e",
          "sau": "7974c7d8acb8d22ccaf418308bc1774ee61970e3a50194c5a1780fd14457e791"
        },
        {
          "path": "src/commands/reuse-plan-check-impl.ts",
          "truoc": "ae9ee05fa0272ac64eff8ca2536fcd59a09f91f6f937a5016c0cc48ea5884a6c",
          "sau": "0e603af5dae72e922a6b820153bdb601ab84c90c04f0aaaafb8837d4b41b2876"
        },
        {
          "path": "src/commands/token-coverage.ts",
          "truoc": "3d29527d4c8614e6b6c1355cae91c753f4f3483efc729fe7ce9daca2f2b60bbe",
          "sau": "9f2f525cc88b782ad97fc63942af6054f5648f3c3deda0bc42d09d279abc6f37"
        }
      ]
    },
    {
      "id": "D",
      "trang_thai": "da-ap",
      "ten": "làm sạch tên token trung tính",
      "vi_sao": "sanitizeSeg/buildTokensTree nằm trong figma-ds-tokens.ts nên gate, token-coverage, reuse-plan check kéo module mang tên miền Figma vào đóng kín. Bản chép nguyên văn dưới tên trung tính dtcg-token-tree.ts; hai chỗ nhập đổi sang nó; figma-ds-tokens.ts giữ nguyên, rời đóng kín.",
      "lam_xanh": [
        "FN-02: 3 cặp figma-ds-tokens.ts còn lại sau bản vá A"
      ],
      "tep_va": "design-floor/patches/D-cay-token-trung-tinh.patch",
      "tep": [
        {
          "path": "src/core/css-selector-mode.ts",
          "truoc": "1a8a69738fcd4e0eb50d57720a2d17af0f2a0c1acd4c712694480b83e049ff57",
          "sau": "183a54da3b7acdb4e007afcf958b7bc3aa247f5d5cf512264675629b1d098482"
        },
        {
          "path": "src/core/ds-kit-inventory.ts",
          "truoc": "026decd699a9c6ae60b91ed14ca7770e84d0f99d14e22ee4b624abade043cc1d",
          "sau": "c55a23d4fbf6148fc928bacbc8223fa8ee86894ebf56a90c84808cbbbe7ead13"
        },
        {
          "path": "src/core/dtcg-token-tree.ts",
          "truoc": null,
          "sau": "c5adf24d467cbe79f1f6496e7e67d7542ef46dcdb055b856e314ed689106d226"
        }
      ]
    }
  ]
}
```
<!-- DESIGN-FLOOR-LOCAL-PATCHES>>> -->
