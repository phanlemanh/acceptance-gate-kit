# Thiết kế: hồ sơ có bằng chứng nhưng status chưa arm cổng — không được tàng hình

Ngày: 2026-08-18 · Slug: `status-chua-arm-cong` · Hạng: T3 (chạm
`scripts/pre-merge-check.sh` — `t3_paths`; đề bài nói T2, tiền lệ
`stale-theo-diff-pr` và `veto-co-dau-vet` cùng chạm file này đều T3, nghi thức
giữ gọn theo đề bài).

## Vấn đề (vấp thật, S4 vòng 4 hồ sơ `release-2-2-0`, 18/08)

`scripts/pre-merge-check.sh` (vòng per-slug, ~dòng 641):

```sh
case "$status" in implemented|verified|signed-off) ;; *) continue ;; esac
```

loại slug khỏi cổng **hoàn toàn** ở mọi status khác. Chạy thật: hồ sơ để
`status: approved` nhưng đã có `evidence-report.md` verdict REJECT +
`human_signoff` rỗng → pre-merge in «clean», không một dòng nào cho slug đó.
Toàn bộ luật Cổng Bằng chứng (verdict PASS · stale-guard · xanh-sạch/chữ ký ·
bypass) không chạy. Răng T1-escape (PR chạm code chịu cổng phải kèm
`_acceptance/<slug>/`) được thoả bởi *chính* hồ sơ đó — nó «kèm hồ sơ» — nên
lớp PR cũng im.

Đây đúng là lớp «PASS chưa ai phán» mà khối code ấy sinh ra để bịt (1.24.0:
thư mục tự khai đã phát hành mà không có contract / thiếu field). Khối đó chỉ
bịt hai cửa (không contract · thiếu field); cửa thứ ba — **có field, giá trị
ngoài phạm vi, nhưng có bằng chứng** — được comment gọi là «khai báo → im lặng
đúng thiết kế». Vòng 4 chứng minh thiết kế đó sai ở một góc: *khai báo chưa
arm* + *đã có bằng chứng* không phải scaffold bỏ hoang, mà là hồ sơ đang mang
kết quả chấm mà cổng không đọc.

## Luật mới (một chỗ, trong vòng per-slug)

Gọi **armed** = `status ∈ {implemented, verified, signed-off}`. Slug đủ tier
(`required_for`) nhưng **chưa armed** thì KHÔNG `continue` im lặng nữa; xét
hai điều kiện, trúng một là VIOLATION, không trúng mới im lặng (đường đọc-cũ):

| # | Điều kiện | Vì sao |
|---|---|---|
| (a) | thư mục có `evidence-report.md` (**bất kỳ** verdict) **và** hồ sơ nằm trong phạm vi diff PR (`slug_in_diff`), hoặc không dựng được phạm vi diff (`DIFF_READY=0` → xét mọi slug, fail-safe như luật staleness) | bằng chứng đã sinh mà status không cho cổng đọc → «PASS/REJECT chưa ai phán» |
| (b) | hồ sơ nằm trong diff PR **và** diff PR đổi ít nhất một file chịu cổng (ngoài `_acceptance/`, khớp `t3_paths` hoặc ngoài `t1_skip_globs`) | hồ sơ này là thứ đang thoả T1-escape cho code chịu cổng, mà nó chưa arm nên không luật nào chấm code đó |

Thông điệp — **một tên máy-đọc cho cả hai**, đuôi lý do khác nhau, đủ hai lối
ra sống:

```
VIOLATION [<slug>]: hồ sơ có bằng chứng nhưng status chưa arm cổng — status=<st>; <lý do>. Cổng chỉ chấm hồ sơ ở implemented/verified/signed-off, hồ sơ này đang tàng hình. Đặt status: implemented để cổng chấm, hoặc gỡ evidence-report.md / tách hồ sơ khỏi PR nếu bằng chứng thuộc phạm vi đã bỏ.
```

- lý do (a): `evidence-report.md verdict=<v> đã có`
- lý do (b): `PR đổi code chịu cổng (<file đầu tiên>…) mà hồ sơ trong PR chưa arm`

**Giữ nguyên (đường đọc-cũ):** draft/approved **không** evidence **và** PR
không chạm code chịu cổng → im lặng như cũ (S04 hiện hành; hạt giống hồ sơ
merge kèm docs vẫn qua; `crosslayer-uncoded`/`premerge-ac-line` trên main
không nổ). Tier ngoài `required_for` → im lặng như cũ. Không đổi tên/thứ tự
dòng nào khác của stdout.

**Không thêm tên luật vào sổ luật** (`LEDGER_EXPECTED`): nhánh mới nằm trong
khối `per-slug`, cùng cách hai nhánh tàng hình 1.24.0 đang nằm — sổ vẫn
`expected=4`.

**Hoist phân loại diff-chịu-cổng:** khối T1-escape cuối file đang tính
`t3_hits`/`nont1_hits`; luật (b) cần chúng TRƯỚC vòng per-slug → tính một lần
trước vòng vào `DIFF_GATED_HITS`, T1-escape dùng lại (thông điệp và thứ tự
output của T1-escape giữ nguyên văn).

## Quét lớp: mọi lối rẽ theo status trong `pre-merge-check.sh` và `lib/`

| Nơi | Hình dạng | Xử |
|---|---|---|
| `pre-merge-check.sh:641` `case status … continue` | loại slug hoàn toàn | **SỬA** (luật trên) |
| `pre-merge-check.sh:396` `claims_released` — contract armed ⇒ «tự nhận đã phát hành» | bộ dò cho hai cửa tàng hình cũ; là bên NHẬN, không phải bên loại | giữ; luật mới là cửa thứ ba cùng khối |
| `pre-merge-check.sh:640` `case REQUIRED_FOR … continue` | tier ngoài required_for | giữ — tier là khai báo có chủ đích của config, không phải trạng thái vòng đời |
| `pre-merge-check.sh:1135` vòng veto-trace `[ -f contract ] \|\| continue` | không theo status | ngoài lớp |
| `lib/workspace-record.cjs` `usesEvidence` (`EVIDENCE_CONSUMING = implemented, verified`) + `missingArtifact` (chỉ `verified` đòi file) | cùng hình dạng — status quyết định có ĐỌC evidence không — nhưng cho bên đọc **tư vấn** (bản đồ sản phẩm, `/start`), không phải điểm cưỡng chế | **KHÔNG sửa vòng này**, ghi sổ `descope`: thêm tín hiệu «có evidence mà status không tiêu thụ» vào bản đồ/`/start` là CỘNG một luật cho mặt tư vấn, đổi bucket bản đồ, đụng ma trận P105 — không có mặt trong vấp thật; cửa mở lại: khi `/start` resume nhầm bảng trạng thái vì evidence lạc status (chưa xảy ra) |
| `scripts/start-scan.mjs`, `scripts/product-map.mjs` | tiêu thụ `usesEvidence` ở trên | theo dòng trên |
| `hooks/acceptance-evidence-gate.js` + `lib/evidence-core.cjs:505` | chặn chuyển draft→implemented nhảy cóc | chiều ngược (chặn LÚC GHI), không loại slug |

## Phép đo (răng gắn vào vật thật)

Case mới trong `tests/scripts/run-tests.sh` (suite `executors.test.scripts`),
tiền tố **`ARM`** (tránh đụng số P-case với nhánh song song — bài học
moi-noi-vong-trao). Fixture **code-sinh** bằng git, hai commit: c1 = base
(config có t1 globs + `src/app.js` + hồ sơ), c2 = nhánh PR. Mọi lần chạy
`env -u PRE_MERGE_BASE`. Ma trận toàn phần viết trước:

| Ca | status | evidence | PR chạm code chịu cổng | slug trong diff | Kỳ vọng |
|---|---|---|---|---|---|
| ARM01 (đối chứng dương) | implemented | REJECT | có | có | KHÔNG dòng «chưa arm cổng»; CÓ đúng dòng `VIOLATION [feat-arm]: verdict=REJECT (must be PASS to merge)` — chứng minh cổng CHẠY khi armed |
| ARM02 (chiều đỏ a — tái hiện vòng 4) | approved | REJECT | có | có | exit 1 + `VIOLATION [feat-arm]: hồ sơ có bằng chứng nhưng status chưa arm cổng` + `verdict=REJECT` |
| ARM03 (chiều đỏ b) | draft | không | có (`src/app.js`, ngoài t1) | có | exit 1 + cùng tên + `PR đổi code chịu cổng (src/app.js` |
| ARM04 (đường đọc-cũ — hạt giống) | draft | không | không (chỉ `docs/`) | có | exit 0, KHÔNG dòng «chưa arm»; CÓ dấu dương `rules ran=` … `expected=4` |
| ARM05 (đường đọc-cũ — sử liệu) | approved | REJECT (đã ở base) | có | KHÔNG (slug khác, armed, trong diff) | KHÔNG dòng «chưa arm» cho slug cũ; CÓ dòng chấm slug armed (`[feat-new]`) + `expected=4` |
| ARM06 (không base — fail-safe a) | approved | REJECT | — | — | chạy không `--base` → exit 1 + dòng «chưa arm» |
| ARM07 (không base — đọc-cũ) | draft | không | — | — | chạy không `--base` → exit 0 (S04 hiện hành vẫn đúng) + `expected=4` |
| ARM08 (T1-escape không đổi, nhánh non-T1) | — | — | có (`src/app.js`), PR KHÔNG kèm `_acceptance/` | — | VIOLATION `[PR]: non-T1 files changed (outside t1_skip_globs) but the PR carries NO _acceptance/<slug>/ artifacts` y nguyên văn + `expected=4` |
| ARM08b (T1-escape không đổi, nhánh t3) | — | — | có (file khớp `t3_paths`), PR KHÔNG kèm `_acceptance/` | — | VIOLATION `[PR]: T3 paths (t3_paths) changed but the PR carries NO _acceptance/<slug>/ artifacts` y nguyên văn + `expected=4` |
| ARM09 (b độc lập với status) | approved | không | có | có | exit 1 + cùng tên + `PR đổi code chịu cổng (` |
| ARM10 (a độc lập với b) | approved | REJECT | không (chỉ `docs/`) | có | exit 1 + cùng tên + `verdict=REJECT` |
| ARM11 (b qua nhánh t3_paths) | draft | không | có (file khớp `t3_paths`) | có | exit 1 + cùng tên + `PR đổi code chịu cổng (` tên file t3 |
| ARM12 (tier ngoài required_for) | approved | REJECT | có | có | tier T1 với `required_for: [T2, T3]` → exit 0, KHÔNG dòng «chưa arm» + `expected=4` |

Lưới đầy đủ status {draft, approved} × evidence {có, không} × diff {code
ngoài-t1, t3_paths, chỉ-T1, ngoài diff, không base}: mọi ô ĐỎ có ca (ARM02,
03, 06, 09, 10, 11); mọi ô XANH có ca kèm **dấu dương** cổng đã chạy (ARM04,
05, 07, 12 ghim dòng sổ luật `expected=4`; ARM01 ghim đúng dòng verdict).
Ba ca âm-tính-một-mình bị critic bắt (gap-probe F2) đều được vá bằng dấu dương
cùng lượt.

Eval trong `evals.yaml` ghim đích danh dòng `PASS: ARMnn` trong stdout suite
(luật tổng-kết-phải-kèm-số-ca), không tin mã thoát trọn suite. Cặp hai chiều
trên CÙNG fixture: ARM01↔ARM02 chỉ khác một chữ `status`.

## Nếp GUIDE

- §7 bảng CI pre-merge: thêm một hàng VIOLATION cho luật mới; hàng NOTE
  «scaffold bỏ hoang vẫn im lặng» giữ và nói rõ điều kiện: *không* evidence và
  PR không chạm code chịu cổng. Răng hồ sơ `rang.sh` đếm hàng bảng trong ĐÚNG
  khối §7 (cắt heading §7 → §7.1) và gạch §7.1 (cắt §7.1 → §8); **hai chiều
  đỏ** cùng lượt trên bản sao GUIDE: gỡ hàng → `GUIDE 7: 0 hàng «chưa arm
  cổng»`, gỡ gạch → `GUIDE 7.1: 0 dòng «không dựng răng»`.
- §7.1: thêm **một** gạch đầu dòng: «Mốc phát hành **không dựng răng** —
  ca vĩnh viễn P200 canh nhất quán, người đọc diff 3 dòng.» (bài học ba mốc
  2.0.0/2.1.0/2.2.0 đều tự dựng răng và đều thủng — `release-2-2-0/contract.md`
  Notes + gap-probe P0).

## Ngoài phạm vi

- Sửa `lib/workspace-record.cjs` / bản đồ / `/start` (bảng quét lớp).
- Đổi bảng trạng thái resume của feature-loop (`approved` → S2) — SKILL.md,
  hồ sơ khác nếu vấp.
- Thêm cờ tắt luật mới — không có cờ: luật này là fail-closed cùng khối
  1.24.0, hai lối ra đều nằm trong hồ sơ.
