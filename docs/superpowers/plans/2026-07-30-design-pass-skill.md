# design-pass-skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (feature-loop S3 tuần tự main loop). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Skill `design-pass` — nghi thức thiết kế in-harness (S1-D), theo contract `_acceptance/design-pass-skill/` đã approved (12 AC, 15 eval).

**Architecture:** 1 file SKILL.md mới trong `skills/design-pass/` (phương án A — plugin acceptance-gate) + ~10 case test mới trong `tests/plugins/run-tests.sh` (P58–P67) + bump 1.25.0→1.26.0 ba manifest + sync mirror. Không script mới, không sửa feature-loop.

**Tech Stack:** markdown skill, bash/python3 test heredoc (khuôn `run()` hiện hành), `scripts/sync-plugin-packages.sh`.

## Global Constraints

- Sửa nguồn `skills/` PHẢI chạy `bash scripts/sync-plugin-packages.sh` và commit mirror `plugins/` CÙNG COMMIT (P30 chặn drift — CLAUDE.md).
- Mọi case âm tính PHẢI có (a) đối chứng dương bản-nguyên-vẹn-xanh cùng harness, (b) ghim ĐÚNG thông điệp mong đợi (chuỗi trong evals.yaml), không chỉ exit code (CLAUDE.md).
- Fixture do CODE SINH trong chính lần chạy; đường dẫn suy từ `$ROOT`, không hardcode checkout (bất biến thước-gắn-vào-vật).
- SKILL.md không chứa chuỗi consumer (`onehub`/`OneHub`/`deal-page`/`@onehub`/`mstar`) và không chuỗi surface-ngoài (`claude.ai/design`, `/design-sync`, `/design-login`, `/design-mockup`) — AC-9.
- Văn theo glossary CONTEXT.md (Gate viết hoa chỉ cho điểm dừng người; "signoff" viết liền; không "test" thay "eval").
- Git add ĐÍCH DANH từng file (repo self-host, không `-A`).
- Nghi thức "phá thử một lần cho mỗi phép đo mới": sau khi viết mỗi case, tạm phá vật thật trong BẢN SAO để thấy case đỏ đúng thông điệp rồi mới tin.

Chuỗi ghim (nguồn sự thật = evals.yaml, chép nguyên văn — test và SKILL.md phải khớp các anchor này):
`design-pass bi khoa model-invocation` · `SKILL.md thieu key design_pass.<key>` · `proto_route thieu template {slug}` · `thieu nhanh DUNG khi vang proto_route` · `thieu nhanh degrade ds_skill` · `thieu mac dinh shadcn cho repo 0 token` · `thieu cau cam tu dung route/logic` · `thieu khai material khi ha bac vat lieu` · `thieu luat cung: <ten-luat>` · `thieu cau cam tu cham tham my` · `design-pass dang tro vao lan CT2` · `thieu cau cam provenance.json` · `thieu nhanh hoi owner danh sach state` · `KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE` · `khuon template mo coi — than nghi thuc khong tro toi marker` · `vat lieu consumer/surface ngoai trong design-pass`

---

### Task 1: skills/design-pass/SKILL.md (+ sync mirror, commit)

**Files:**
- Create: `skills/design-pass/SKILL.md`
- Modify (máy sinh): `plugins/acceptance-gate/skills/design-pass/SKILL.md` (qua sync)

**Interfaces:**
- Produces: file SKILL.md chứa ĐỦ các anchor mà Task 2 grep (danh sách Global Constraints) + khối marker `<<<DESIGN-PASS-NOTE-TEMPLATE` … `DESIGN-PASS-NOTE-TEMPLATE>>>` có frontmatter 10 trường.
- Phục vụ eval: E1–E9 (nội dung), E10/E11 (có mặt trong mirror), E15 (chất lượng).

- [ ] **Step 1: Viết file theo khung dưới** (khung là BẮT BUỘC về cấu trúc + anchor; văn trong mỗi mục viết đầy đủ theo design doc §2, không rút gọn anchor):

```markdown
---
name: design-pass
description: Nghi thức thiết kế IN-HARNESS cho bước S1-D của feature-loop — phiên chuyên trách CHỈ thẩm mỹ + UX trên bản bấm được đang chạy trong Browser pane, owner ngồi xem và phản ứng bằng lời từng vòng; Gate 1 duyệt trên bản bấm được, không duyệt UI bằng chữ. Dùng khi feature chạm UI cần khoảnh khắc visual trước Gate 1, hoặc user muốn design-pass một surface đang chạy. KHÔNG dùng cho logic/backend, KHÔNG sửa component nền, KHÔNG chấm fidelity (grading ở S4), KHÔNG thay vòng lặp code.
---

# design-pass — phiên thẩm mỹ + UX trên bản bấm được

Một mặt phẳng làm việc: mọi vòng lặp trong Claude Code, trên artifact thật.
Không surface thứ hai, không gương ngoài. Phiên này CHỈ làm thẩm mỹ + UX.

## 1. Preflight (thiếu gì nói đích danh — không lỗi mờ)
- Đọc `_acceptance/config.yaml` khối `design_pass`:
  - `design_pass.proto_route` (BẮT BUỘC) — TEMPLATE per-repo chứa `{slug}` …
  - `design_pass.ds_skill` (khuyến nghị) · `design_pass.dev_cmd` (optional) ·
    `design_pass.capture_cmd` (optional)
  - Lệnh mẫu thêm khối: `node <plugin>/scripts/config-patch.mjs --key design_pass.proto_route --value "<url-template>" --write`
- Thiếu khối / thiếu `proto_route` → **DỪNG nghi thức**, in key thiếu đích danh… (tuyệt đối không fail-open sang route mặc định)
- Xác định workspace slug đang phục vụ; gọi standalone không slug → hỏi đúng 1 câu chọn slug trong `_acceptance/`; không có workspace → nói rõ design-pass phục vụ một feature đang trong vòng lặp, không chạy mồ côi.

## 2. Nạp 2 nguồn luật
- (a) skill `ux-ui-craft` (cùng plugin).
- (b) nguồn luật DS theo THANG: `ds_skill` từ config → vắng/không resolve:
  (i) từ vựng token repo nhận diện được → dùng nó; (ii) repo 0 token → từ
  vựng **shadcn** làm mặc định CÓ TÊN (chỉ mượn từ vựng token với repo ngoài
  React/Tailwind). CẢ HAI nấc tự ghi finding Nhóm 2 nêu nấc đã dùng.

## 3. Mở đối tượng làm việc (Browser pane)
- Thang vật liệu 3 bậc — hạ bậc PHẢI khai `material:` trong ghi vết:
  `real-components` (mặc định — kể cả surface mới ghép từ component sẵn có) ·
  `scaffold` · `static`.
- Route không mở được → DỪNG: in `dev_cmd` nếu repo khai + hướng dựng.
- KHÔNG tự dựng route/logic thay repo.

## 4. Vòng lặp owner-phản-ứng
- Nhịp mỗi vòng: sửa code proto → reload Browser pane → CHỜ owner phản ứng
  bằng lời → vòng kế. KHÔNG tự chấm thẩm mỹ thay owner (grading ở S4).

## RÀNG BUỘC CỨNG (cả phiên)
- không hex mới (chỉ từ vựng token của repo)
- không webfont
- không sửa `components/ui` "cho proto đẹp" — thiếu/xấu tầng component = finding Nhóm 2 chờ Gate 1, sửa ở Build
- không logic nghiệp vụ / write-path

## 5. Kết phiên (ghi vết workspace)
- Capture ma trận state × breakpoint (× theme khi repo có dark mode) về
  `_acceptance/<slug>/evidence/design-pass/`. Proto không khai states → hỏi
  owner danh sách state ngay đầu phiên, ghi frontmatter — không bịa.
- KHÔNG ghi vào `evidence/design/`, KHÔNG tạo `provenance.json` (đường của
  công tắc CT2 đã khai tử).
- Ghi `_acceptance/<slug>/design-pass.md` theo ĐÚNG khuôn giữa cặp marker
  DESIGN-PASS-NOTE-TEMPLATE dưới đây.

<<<DESIGN-PASS-NOTE-TEMPLATE
---
slug: <slug>
at: <ISO UTC>
route: <url đã mở>
material: real-components|scaffold|static
ds_skill: <tên-skill|repo-tokens|shadcn-default>
states: [<danh sách state đã duyệt>]
breakpoints: [mobile-375, desktop-1280]
themes: [light]           # [light, dark] khi repo có dark mode
patched: <n>
deferred: <n>
---
## Ma trận capture
| state | breakpoint | theme | file |
## Findings
### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)
- <finding — đã đổi gì, 1 dòng>
### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)
- <finding — thiếu gì ở tầng DS/component>
DESIGN-PASS-NOTE-TEMPLATE>>>

## Degrade (bảng tra — mỗi thiếu hụt 1 hàng)
(5 hàng đúng design doc §2.4)

## Ranh giới
- Phiên SAU Gate 1 (phản hồi giữa S3/S4) → findings đổ `review-findings.md`,
  không ghi đè design-pass.md của bản đã duyệt.
```

- [ ] **Step 2: Sync mirror**: `bash scripts/sync-plugin-packages.sh` rồi `bash scripts/sync-plugin-packages.sh --check` → exit 0.
- [ ] **Step 3: Smoke tay**: `grep -c "DESIGN-PASS-NOTE-TEMPLATE" skills/design-pass/SKILL.md` → ≥2; grep các anchor chính có mặt.
- [ ] **Step 4: Commit** (nguồn + mirror CÙNG commit):
```bash
git add skills/design-pass/SKILL.md plugins/acceptance-gate/skills/design-pass/SKILL.md
git commit -m "feat(design-pass): SKILL.md nghi thức in-harness 5 giai đoạn + 2 thang (vật liệu, DS) + khuôn marker"
```

`independent: false` · verify: sync --check exit 0 · phục vụ E1–E9, E15.

### Task 2: Case P58–P67 trong tests/plugins/run-tests.sh

**Files:**
- Modify: `tests/plugins/run-tests.sh` (chèn TRƯỚC khối tổng kết cuối file, sau case P57)

**Interfaces:**
- Consumes: `skills/design-pass/SKILL.md` (Task 1) + mirror `plugins/acceptance-gate/skills/design-pass/SKILL.md`.
- Phục vụ eval: E1–E9 (răng), E11 (smoke mirror).

Khuôn chung mỗi case: python heredoc; đọc file THẬT từ `$ROOT`; kiểm khẳng định dương trên bản thật; đột biến trên BẢN SAO trong `tempfile.mkdtemp()`; hàm `check()` của test trả danh sách vi phạm với THÔNG ĐIỆP GHIM đúng chuỗi evals.yaml; assert bản nguyên vẹn 0 vi phạm TRƯỚC khi tin bản đột biến đỏ.

- [ ] **Step 1: viết P58 (E1)** — mẫu đầy đủ, các case sau cùng khuôn:

```bash
run "P58 design-pass SKILL.md frontmatter + open invocation (E1)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text()

def check(text):
    errs = []
    if not re.search(r"^name: design-pass$", text, re.M):
        errs.append("SKILL.md thieu frontmatter name: design-pass")
    if "KHÔNG dùng cho" not in text and "KHONG dung cho" not in text:
        errs.append("description thieu NOT-for")
    if "disable-model-invocation" in text:
        errs.append("design-pass bi khoa model-invocation")
    return errs

assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"          # đối chứng dương
mut = t.replace("---\nname: design-pass", "---\ndisable-model-invocation: true\nname: design-pass", 1)
assert any("design-pass bi khoa model-invocation" in e for e in check(mut)), \
    "dot bien tiem lock phai do dung thong diep"
PY
```

- [ ] **Step 2: P59 (E2)** — `check()` đòi các chuỗi: `design_pass.proto_route`, `design_pass.ds_skill`, `design_pass.dev_cmd`, `design_pass.capture_cmd`, `{slug}` (cạnh proto_route), `config-patch`, đoạn DỪNG (regex `DỪNG.*proto_route|proto_route.*DỪNG` trong mục Preflight), bước slug standalone. Vi phạm ghim: `SKILL.md thieu key design_pass.<key>` (điền key thật), `proto_route thieu template {slug}`, `thieu nhanh DUNG khi vang proto_route`. 3 đột biến: xoá key `dev_cmd`; xoá chuỗi `{slug}`; xoá đoạn DỪNG. Đối chứng dương như P58.
- [ ] **Step 3: P60 (E3)** — đòi `ux-ui-craft`, `ds_skill`, thang 2 nấc, `shadcn`, finding Nhóm 2 nêu nấc. Đột biến: xoá cả nhánh thang → `thieu nhanh degrade ds_skill`; xoá riêng `shadcn` → `thieu mac dinh shadcn cho repo 0 token`.
- [ ] **Step 4: P61 (E4)** — đòi đủ 3 bậc `real-components`/`scaffold`/`static`, chuỗi `material:`, câu cấm tự dựng. Đột biến: xoá câu cấm → `thieu cau cam tu dung route/logic`; xoá đoạn material → `thieu khai material khi ha bac vat lieu`.
- [ ] **Step 5: P62 (E5)** — 4 luật cứng, mỗi luật một anchor (`không hex mới`, `không webfont`, ``không sửa `components/ui` ``, `write-path`). 4 đột biến xoá từng luật → `thieu luat cung: <ten-luat>`.
- [ ] **Step 6: P63 (E6)** — nhịp `sửa` + `reload` + `phản ứng bằng lời` + câu cấm chấm. Đột biến xoá câu cấm → `thieu cau cam tu cham tham my`.
- [ ] **Step 7: P64 (E7)** — `evidence/design-pass/`, câu cấm `evidence/design/`, câu cấm `provenance.json`, nhánh hỏi owner states. 3 đột biến → `design-pass dang tro vao lan CT2` / `thieu cau cam provenance.json` / `thieu nhanh hoi owner danh sach state`.
- [ ] **Step 8: P65 (E8)** — rút khối giữa `<<<DESIGN-PASS-NOTE-TEMPLATE` và `DESIGN-PASS-NOTE-TEMPLATE>>>` (thiếu → in `KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE`, đột biến xoá marker kiểm điều đó); SINH fixture từ khối (thay `<slug>`→`fx-slug`, `<n>`→`0`…); parse fixture bằng reader của test → đủ 10 khoá frontmatter `slug/at/route/material/ds_skill/states/breakpoints/themes/patched/deferred` + 2 heading `### Nhóm 1` `### Nhóm 2`; thân kết-phiên (ngoài khối marker) phải chứa `design-pass.md` + `DESIGN-PASS-NOTE-TEMPLATE` — đột biến xoá tham chiếu → `khuon template mo coi — than nghi thuc khong tro toi marker`.
- [ ] **Step 9: P66 (E9)** — quét `skills/design-pass/SKILL.md` + đoạn diff test mới (chính file test đọc vùng P58–P67 của nó): 0 hit cho `onehub|OneHub|deal-page|@onehub|mstar` và 0 hit cho `claude.ai/design|/design-sync|/design-login|/design-mockup`; sanity counter số file quét ≥1; 2 lớp tiêm riêng (1 chuỗi consumer, 1 chuỗi surface-ngoài) vào bản sao → `vat lieu consumer/surface ngoai trong design-pass`.
- [ ] **Step 10: P67 (E11)** — smoke DƯƠNG bản mirror: đọc `plugins/acceptance-gate/skills/design-pass/SKILL.md`, assert `name: design-pass` + có marker — vật giao chạy thật.
- [ ] **Step 11: chạy suite** `bash tests/plugins/run-tests.sh` → toàn xanh, số case tăng đúng 10.
- [ ] **Step 12: phá-thử-một-lần** — tạm sửa 1 anchor trong bản sao SKILL.md thật (không commit) chạy lại case tương ứng thấy ĐỎ đúng thông điệp, hoàn nguyên.
- [ ] **Step 13: Commit**:
```bash
git add tests/plugins/run-tests.sh
git commit -m "test(design-pass): P58-P67 — cấu trúc SKILL.md, đột biến có đối chứng dương + thông điệp ghim, smoke mirror"
```

`independent: false` · verify: `bash tests/plugins/run-tests.sh` · phục vụ E1–E9, E11.

### Task 3: Bump 1.26.0 + sync + suite đầy đủ

**Files:**
- Modify: `.claude-plugin/plugin.json` + `.codex-plugin/plugin.json` + `codex/acceptance-gate/.codex-plugin/plugin.json` (version `1.26.0`, description append 1 câu: "v1.26 adds the design-pass in-harness design ritual: a dedicated aesthetics+UX session on the running clickable build in the Browser pane (S1-D), with a 3-rung material ladder, a named DS-rule ladder (repo skill → repo tokens → shadcn default), hard token-only constraints, and a state×breakpoint×theme capture note written back to the feature workspace.")
- Modify (máy sinh): `plugins/acceptance-gate/.codex-plugin/plugin.json` (qua sync)

- [ ] **Step 1:** sửa version + description ở 3 manifest nguồn (P03 đòi 3 bản khớp nhau).
- [ ] **Step 2:** `bash scripts/sync-plugin-packages.sh` rồi `--check` → exit 0.
- [ ] **Step 3:** chạy đủ 4 suite: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh` → toàn xanh.
- [ ] **Step 4: Commit**:
```bash
git add .claude-plugin/plugin.json .codex-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json plugins/acceptance-gate/.codex-plugin/plugin.json
git commit -m "chore(release): bump acceptance-gate 1.26.0 — design-pass skill"
```

`independent: false` · verify: 4 suite xanh + sync --check · phục vụ E10, E12, E13, E14.
