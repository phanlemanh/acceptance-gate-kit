# Kế hoạch: chi-tep-vat-keo-xet-lai

Hạng T3 — duyệt kế hoạch (Gate 1.5) gom cùng lượt Cổng Phạm vi. Thứ tự là TDD: commit tệp ca đứng trước commit vật.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Tệp ca TV1…TV5 (kho thử code sinh, bản gốc thật 115100b6, bản sao tiêm `elif false`) — commit riêng, ĐỎ trên cây trước vòng | `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs` | `node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs` đỏ ở TV1/TV4-doi-chung/TV5 | E1–E5 | false |
| 2 | Khối marker `TEP-CHU-HO-SO` + `phanTepHoSo(files, slug, evalsText, {prefix})` (paths thắng tên, cờ paths → mọi tệp là vật) | `lib/evidence-core.cjs` | `node -e` gọi thử ba hình dạng | E1, E4 | false |
| 3 | Vị từ `slug_vat_in_diff` + nhánh `elif … # STALE-TEP-CHU-GUARD` in NOTE; lùi về vật khi không phân được | `scripts/pre-merge-check.sh` | tệp ca xanh 8/8; `node tests/scripts/additive-only.test.mjs` xanh | E1–E5 | false |
| 4 | ADR 0028 (thu AC-3 của `stale-theo-diff-pr` cho luật bằng chứng cũ) + khoá `executors.script.tvx_e1…e5` | `docs/adr/0028-*.md`, `_acceptance/config.yaml` | khoá giải được bằng `resolveConfigKey` | — | true |
| 5 | Chạy suite cũ chạm vùng: khối VC (run-tests.sh `--manh bash`), additive-only | — | xanh | — | false |
