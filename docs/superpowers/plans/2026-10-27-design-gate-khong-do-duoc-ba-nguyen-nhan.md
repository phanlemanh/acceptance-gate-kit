# Kế hoạch — design-gate-khong-do-duoc-ba-nguyen-nhan (FL1, T3)

Hồ sơ `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/` · thiết kế
`docs/superpowers/specs/2026-10-27-design-gate-khong-do-duoc-ba-nguyen-nhan-design.md`. Thứ tự lịch sử: commit bộ đo
TRƯỚC commit vật, để chiều đỏ nằm trong lịch sử (bộ đo đỏ trên vật cũ rồi xanh trên vật mới).

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Bộ đo trước vật: sinh trang, ca KD1…KD7, lệnh chạy nhóm ca, khoá jsdom ghim | `tests/design-eval/lib/sinh-trang.mjs` · `tests/design-eval/khong-do-duoc.test.mjs` · `tests/design-eval/kdd.sh` · `tests/design-eval/package.json` · `tests/design-eval/package-lock.json` | `bash tests/design-eval/kdd.sh KD1` ĐỎ trên vật cũ ở KD1-moi (bản mới = bản gốc → REJECT), KD1-goc xanh; commit riêng | E1–E7 | không |
| 2 | Lớp lọc ba nguyên nhân + phán quyết ba trạng thái | `lib/design-detect.mjs` | `bash tests/design-eval/kdd.sh KD1` … `KD5` xanh | E1–E5 | không (sau 1) |
| 3 | Hợp đồng mã thoát + JSON + stderr của chế độ dom | `scripts/design-gate.mjs` | `bash tests/design-eval/kdd.sh KD6` xanh; `bash tests/scripts/run-tests.sh --manh bash` không đỏ ca design-gate cũ | E6 | không (sau 2) |
| 4 | Ba đột biến (nhãn dòng một nguồn trong lib) | `tests/design-eval/khong-do-duoc.test.mjs` | `bash tests/design-eval/kdd.sh KD7`: lành xanh, ba đột biến đỏ đúng ca; phá thử: đổi một nhãn → «DOT_BIEN_LECH» | E7 | không (sau 2) |
| 5 | Hồi quy design-eval đòi dom + ca KD8 + vi phân ba kho | `tests/design-eval/run-tests.sh` · `tests/design-eval/vi-phan-kho.mjs` · `tests/design-eval/README.md` | `bash tests/design-eval/kdd.sh --hoi-quy` xanh; che jsdom → đỏ; `node tests/design-eval/vi-phan-kho.mjs` in số theo kho | E8, E8b | không |
| 6 | Job CI `design-eval` (Hỏi-1 duyệt 27/10) | `.github/workflows/gate.yml` | ca KD8-ci; CI của PR xanh | E8c | có |
| 7 | Lời của cổng: chú thích đầu `design-gate.mjs`, đoạn ba nguyên nhân ở `design-ui-check.md`, CHANGELOG mục chưa phát hành | `scripts/design-gate.mjs` · `skills/acceptance/references/design-ui-check.md` · `CHANGELOG.md` | suite plugins + scripts không đỏ | — | có |

Cuối S3: chạy bốn mảnh suite scripts, hooks, ba vùng plugins, workflows, `product-map --check` (đúng `suite_keys`) trước
khi xin lượt S4 — đỏ thì sửa trước, không gửi S4 khi suite còn đỏ vì chính vòng.

**North Star.** Không ghi sau S4 · 0 lượt người trong S2–S4 ngoài Gate 1.5 · 0 token lúc chạy; máy ước ~2,4–5,4 giờ cả
vòng (du-bao.json) · mỗi nhánh mới có đột biến đỏ + đối chứng xanh trên cùng trang sinh.
