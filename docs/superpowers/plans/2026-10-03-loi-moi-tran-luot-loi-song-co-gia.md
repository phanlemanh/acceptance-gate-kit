# Lối ra ở trần lượt — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Vòng T2 của feature-loop: thực thi TUẦN TỰ trong phiên chính (không task nào `independent: true` với task khác — cả ba chạm cùng một luồng thẻ).

**Goal:** Thẻ Cổng Bằng chứng CHƯA-ký-được in khối «Lối ra» (ba lối sống, có giá, khuyến nghị tất định) khi vòng chạm trần 3 lượt hoặc một eval chưa đạt lặp lại.

**Architecture:** Một mô-đun thuần `scripts/loi-ra-tran-luot.cjs` (không đọc đĩa) tính đối tượng `loi_ra` từ văn bản sổ chạy + bản khai eval. `scripts/gate-card.js` gọi nó trong nhánh `!approvable`, in khối HTML và thêm khoá `loi_ra` vào `--extract` chỉ khi khác null. SKILL feature-loop thay câu «Tối đa 3 round …» bằng khối marker `TRAN-LUOT-LOI-RA`.

**Tech Stack:** Node (CommonJS cho mô-đun thẻ đọc, ESM cho tệp test), harness `tests/workflows/harness.mjs`, fixture `tests/scripts/thuoc-vat-fixture.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-03-loi-moi-tran-luot-loi-song-co-gia-design.md` · hợp đồng `_acceptance/loi-moi-tran-luot-loi-song-co-gia/contract.md` (approved 02/10).

## Global Constraints

- Không chạm `feature-loop/workflows/acceptance-verify.js`, `lib/**`, số phiên bản gói.
- Thẻ ký được và mọi thẻ không thoả điều kiện kích hoạt giữ NGUYÊN từng byte (HTML lẫn `--extract`).
- Không lối nào mang mã hay chữ mời ký; đúng ba mã `thu-pham-vi`, `luot-nua`, `dung`.
- Không in số phút khi thiếu một vế; không in 0.
- Hằng xuất của mô-đun: `TEN_KHOI = 'Lối ra'`, `TRAN_LUOT = 3`, `TRUONG_GIO = 'ts'`.
- Mọi đường dẫn trong test suy từ vị trí tệp test, không hardcode gốc kho.

## Review Focus

1. Sổ thật có dòng eval với `round` là chuỗi (sổ tay cũ) → không được ném lỗi, bỏ dòng. Pin ở Task 1 (hàng AC-9).
2. Hai hồ sơ dùng `expected_exit` dạng chuỗi `"2"` → so bằng chuỗi như `maDat` của thẻ. Pin ở Task 1 hàng 4 (dùng bộ đọc `evalYamlLib.expectedExits` có sẵn của thẻ, không tự parse).
3. Lượt có `round: null` (BLOCKED sớm) → không tính vào lượt cuối. Pin ở Task 1 (hàng sổ hỏng).
4. Eval từng chưa đạt nhưng đã được carry (vắng dòng vì đã đạt ở lượt trước nữa) → không vào `lap`. Luật: chỉ eval có dòng CHƯA ĐẠT ở lượt gần nhất trước lượt cuối mà nó có dòng. Pin ở Task 1 hàng 8.
5. HTML thoát ký tự `<`/`&` trong id/AC → so một-nguồn sau khi thoát. Pin ở Task 2 (AC-7).

---

### Task 1: Mô-đun `loi-ra-tran-luot.cjs` + lưới AC-1/2/4/5/9

**Files:** Create `scripts/loi-ra-tran-luot.cjs` · Create `tests/scripts/lmtl-the.test.mjs` (phần mô-đun + thẻ) · Phục vụ E1, E2, E4, E5, E9 · `independent: false`

**Interfaces — Produces:**
```js
// require('./loi-ra-tran-luot.cjs')
TEN_KHOI   // 'Lối ra'
TRAN_LUOT  // 3
TRUONG_GIO // 'ts'
loiRa({ runLogText: string, verdict: string, approvable: boolean, trangThai: string,
        expectedExit: Map<string,number>|object, evalMeta: object|null })
  → null | { tran, luot:[{round,verdict,phut}], lap:[{evalId,ac,luot:number[],vang:number|null}],
             loi:[{ma,ten,gia}], khuyen_nghi:{ma,vi_sao}, canh_bao:string[] }
khoiHtml(loiRa, esc) → string   // HTML của khối, mọi chữ rút từ đối tượng loiRa
```

- [ ] Step 1: Viết `lmtl-the.test.mjs` với khung `ok/bad/want` theo `ntr-the-canh-gay.test.mjs`, hàm `cham(round, invokedAt, e2)` gọi `runWorkflow` thật, hàm `hoSo({verdict, runLog, evalsExtra})` dựng hồ sơ, hàm `the(d, gc)` trả `{html, j}`; ca `LT-AC1-lap` (ma trận 9 hàng), `LT-AC1-tuan-tu`, `LT-AC1-blocked`, `LT-AC2-tran`, `LT-AC4-khuyen-nghi`, `LT-AC5-phut`, `LT-AC5-chua-do`, `LT-AC9-so-hong` (4 hàng); cuối tệp: ca được gọi tên qua `LMTL_CASES` mà không in PASS/FAIL → `ca không chạy: <tên>`, thoát 1.
- [ ] Step 2: Chạy `node tests/scripts/lmtl-the.test.mjs` → mong FAIL (mô-đun chưa có, khoá `loi_ra` vắng).
- [ ] Step 3: Viết mô-đun theo design §4.1 (lớp sáu hình, lượt cuối cụt, phút từ cặp `round-tally`↔`thuoc-vat` dùng `TRUONG_GIO`, ba lối cố định, khuyến nghị theo lặp, cờ vàng `evals.yaml` không đọc được).
- [ ] Step 4: Nối mô-đun vào nhánh `!approvable` của `scripts/gate-card.js`: tính `LR = loiRa(...)` sau `cg`; `--extract` Cổng 2 thêm `...(LR ? { loi_ra: LR } : {})`; HTML: khi `LR` thì thay khối «không cần làm gì» bằng `khoiHtml(LR, esc)`.
- [ ] Step 5: Chạy lại → các ca Task 1 PASS. Commit `feat(gate-card): khối Lối ra ở trần lượt — mô-đun và lưới`.

### Task 2: Biên và im lặng — AC-3/6/7 + bốn đột biến

**Files:** Modify `tests/scripts/lmtl-the.test.mjs` · Phục vụ E3, E6, E7 + đột biến của E1/E5/E9 · `independent: false`

- [ ] Step 1: Thêm ca `LT-AC3-khong-ky` (6 hàng), `LT-AC6-im` (5 hàng, so HTML + `--extract` với bản `git archive` ở cha của commit đầu đưa chuỗi `loi-ra-tran-luot` vào `scripts/gate-card.js`), `LT-AC7-mot-nguon`.
- [ ] Step 2: Thêm khung đột biến: chép `scripts lib skills` của cây đang chạy vào thư mục tạm, thay nguyên văn đúng một chỗ trong bản sao `scripts/loi-ra-tran-luot.cjs` (chứng: chuỗi gốc khớp đúng 1 lần, bản sao khác bản thật), chạy ca đích với `GC` của bản sao, kỳ vọng FAIL đúng tên ca. Sáu đột biến: `tat-khoi`, `them-loi-ky`, `phut-ve-0`, `lap-moi-luot`, `bo-expected-exit`, `bo-loc-id`, `nuot-evals-hong` → ca `LT-dot-bien-<tên>`.
- [ ] Step 3: Chạy cả tệp → mọi ca PASS, mỗi đột biến báo đỏ đúng ca. Commit `test(loi-moi-tran-luot-loi-song-co-gia): biên, chiều im và đột biến`.

### Task 3: Chỉ dẫn SKILL — AC-8

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (đoạn «Tối đa 3 round» ở S4 bước 3) · Modify `tests/scripts/lmtl-the.test.mjs` (ca `LT-AC8-skill`) · Phục vụ E8 · `independent: false`

- [ ] Step 1: Ca `LT-AC8-skill`: rút khối giữa `<!-- <<<TRAN-LUOT-LOI-RA -->` và `<!-- TRAN-LUOT-LOI-RA>>> -->` của SKILL (đường suy từ vị trí test); kiểm chứa `TEN_KHOI`, «dừng-vá», «không mời ký»; số trong «Tối đa <n> round» = `TRAN_LUOT`; chiều đỏ trong ca: bản sao văn bản gỡ khối → hàm kiểm trả sai, tên khối được gọi.
- [ ] Step 2: Chạy → FAIL (khối chưa có).
- [ ] Step 3: Viết khối marker trong SKILL ngay sau câu «Tối đa 3 round»; thêm một câu sau điều khoản dừng-vá: «ship với giới hạn đã biết» = thu phạm vi có tên, không phải ký trên báo cáo REJECT.
- [ ] Step 4: Chạy cả tệp + `bash tests/plugins/run-tests.sh --manh vung:1` (P85/P32 giữ các khối SKILL) → xanh. Commit `docs(feature-loop): ở trần lượt mời bằng khối Lối ra của thẻ`.
- [ ] Step 5: Đặt contract `status: implemented`, commit `chore(loi-moi-tran-luot-loi-song-co-gia): xong S3`.
