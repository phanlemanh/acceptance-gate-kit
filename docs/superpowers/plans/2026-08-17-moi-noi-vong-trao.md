# moi-noi-vong-trao Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nối lái-thử người-lạ và hai mối nối S0/S5 vào Workflow v2 bằng sáu mảnh nhỏ (thẻ · §0 uat-session · khuôn · S5 · spec · hình), mỗi mảnh có chiều đỏ.

**Architecture:** Không sửa `lib/`. Thẻ Cổng Phạm vi (`scripts/gate-card.js`) đọc thêm `opportunity.md` bằng `section()` sẵn có và in một khối/cờ/dòng; hai SKILL text (uat-session, feature-loop) thêm nhánh hành vi; khuôn nhật-ký-vấp thêm vào references với marker; spec + hình đổi chữ. Phép đo: P197 (suite plugins, vĩnh viễn) + `rang-mnvt.sh` (răng hồ sơ, không vào suite vĩnh viễn) + 2 hội đồng phiên sạch (E4/E5, do S4 chấm).

**Tech Stack:** Node ≥18 (CommonJS), bash, python3 (đã dùng trong tests/plugins), không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-08-17-moi-noi-vong-trao-design.md` · contract/evals: `_acceptance/moi-noi-vong-trao/`.

## Global Constraints

- Chỉ TRỪ / không cổng-stage-skill mới; không lưu `route:`; không chèn câu vào hợp đồng; giữ nguyên §5 đề bài lái-thử; không chạm `lib/**`, `hooks/**`.
- Mọi phép đo mới đi kèm cặp hai-chiều cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE); fixture code-sinh; đường dẫn suy từ vị trí script.
- Ngôn ngữ mặt người trên thẻ theo `skills/acceptance/references/human-facing-language.md` (chủ ngữ là người/sản phẩm; tên file xuống ngoặc).
- Chuỗi PIN dùng ở nhiều chỗ (thẻ + test + SKILL): «Ngưỡng nghiệm thu» · «chưa khai ngưỡng» · «ship thẳng, không phiên nghiệm thu» · «STRANGER-FRONTMATTER-TEMPLATE» · «lái-thử» · «uat-session <slug>» · «ĐỀ XUẤT» · «cho tới khi».
- Sau mỗi task: commit đích danh (`git add <files>`, không `-A`).

---

### Task 1: Thẻ Cổng Phạm vi in ngưỡng nghiệm thu + case P197 (E1, E2, E8)

**Files:**
- Modify: `scripts/gate-card.js` (vùng Cổng 1: sau khối design-pass ~L296, EXTRACT ~L299, HTML ~L323, flags ~L334)
- Modify: `tests/plugins/run-tests.sh` (thêm khối P197 trước dòng `# ONLY_BLOCK dat ma khong khoi nao khop`)
- Test: chính P197 (ONLY_BLOCK=P197)

**Interfaces:**
- Produces: `--extract` thêm khoá `uat_threshold: { opportunity_present: bool, section_present: bool, lines: string[] }` (Task 6 và bên đọc sau này dùng); hằng số `UAT_THRESHOLD_HEADING = 'Ngưỡng chết / ngưỡng UAT'` (round-trip với khuôn opportunity-template).
- Consumes: `section(text, heading)` từ `lib/md-section.cjs`; `read()`, `esc()`, `stripMd()` sẵn trong gate-card.

`independent: true` · phục vụ E1, E2, E8.

- [ ] **Step 1: Viết khối P197 (đỏ trước) vào `tests/plugins/run-tests.sh`**, chèn ngay trước comment `# ONLY_BLOCK dat ma khong khoi nao khop`:

```bash
# ── P197: the Cong Pham vi in NGUONG NGHIEM THU tu opportunity.md — ma tran 4 trang thai x 2 mat + 3 mutant (moi-noi-vong-trao E1/E2)
P197TMP="$(mktemp -d)"
cat > "$P197TMP/p197.py" <<'P197PY'
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1]); errs = []
def bad(m): errs.append(m); print("  P197 LOI: " + m)
tpl = (root / "skills/acceptance/references/opportunity-template.md").read_text(encoding="utf-8")
# round-trip writer->reader: heading lay tu KHUON, khong go tay
m = re.search(r"^## (Ngưỡng chết / ngưỡng UAT)\s*$", tpl, re.M)
if not m: bad("khuon opportunity-template thieu heading nguong"); print("\n".join(errs)); sys.exit(1)
HEAD = m.group(1)
gc_src = (root / "scripts/gate-card.js").read_text(encoding="utf-8")
if "'" + HEAD + "'" not in gc_src: bad("gate-card.js khong dung hang so heading '%s' (round-trip khuon)" % HEAD)
CONTRACT = """---
schema_version: 1
feature: P197 fixture
slug: p197
owner: p197@test
risk_tier: T2
surfaces: [cli]
status: draft
approved_by:
approved_at:
---
# Acceptance Contract: p197
## Context
fixture P197.
## Criteria
- AC-1: Given a, When b, Then c.
## Coverage
- Trục: x | y [thước CE: fixture]
## Out of scope
- không gì
"""
LINES = ["- Câu hỏi phép đo trả lời: người dùng tự làm được việc X không?", "- Kết quả nào là SỐNG: ≥3/4 người tự hoàn thành", "- Timebox: 2 tuần"]
def opp(kind):
    head = "---\nschema_version: 1\nslug: p197\nfeature: P197\nowner: o\nstage: decided\ndecision: build\n---\n# Cơ hội p197\n## Vấn đề & ai gặp\nx\n"
    if kind == "co":    return head + "## " + HEAD + "\n" + "\n".join(LINES) + "\n## Kết quả prototype\ny\n"
    if kind == "rong":  return head + "## " + HEAD + "\n\n## Kết quả prototype\ny\n"
    if kind == "thieu": return head + "## Kết quả prototype\ny\n"
    raise SystemExit("kind?")
def run(gc, ws, extract):
    a = ["node", str(gc), "--root", str(ws.parent.parent), "--slug", "p197"] + (["--extract"] if extract else [])
    r = subprocess.run(a, capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr
def make_ws(base, kind):
    ws = base / "_acceptance" / "p197"; ws.mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(CONTRACT, encoding="utf-8")
    (ws / "evals.yaml").write_text("evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.x\n    expected: ok\n", encoding="utf-8")
    (base / "_acceptance" / "config.yaml").write_text("schema_version: 1\nexecutors:\n  script:\n    x: 'true'\n", encoding="utf-8")
    if kind != "khong": (ws / "opportunity.md").write_text(opp(kind), encoding="utf-8")
    return ws
# ma tran viet truoc: (trang thai, mat) -> assert co ten. 8 o + doi-cu.
def matrix(gc, label):
    out = []
    for kind in ["co", "rong", "thieu", "khong"]:
        base = Path(tempfile.mkdtemp()); ws = make_ws(base, kind)
        rc, html, err = run(gc, ws, False)
        rc2, js, err2 = run(gc, ws, True)
        if rc != 0 or rc2 != 0: out.append(kind + "/exit: gate-card exit " + str((rc, rc2)) + " " + (err or err2)[:200]); continue
        try: ut = json.loads(js).get("uat_threshold")
        except Exception as e: out.append(kind + "/extract: json hong " + str(e)); continue
        if ut is None: out.append(kind + "/extract: thieu khoa uat_threshold"); continue
        has_block = "Ngưỡng nghiệm thu" in html and "sẽ có phiên nghiệm thu" in html
        has_flag = "chưa khai ngưỡng" in html
        has_fact = "ship thẳng, không phiên nghiệm thu" in html
        if kind == "co":
            if not has_block: out.append("co/html: thieu khoi nguong")
            if not all(l.lstrip("- ") in html for l in LINES): out.append("co/html: thieu dong nguyen van")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is True and ut.get("lines") == [l for l in LINES]): out.append("co/extract: lines/section_present sai: %r" % ut)
        if kind == "rong":
            if has_block: out.append("rong/html: rong van in khoi")
            if not has_flag: out.append("rong/html: thieu co vang chua-khai-nguong")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is True and ut.get("lines") == []): out.append("rong/extract: sai: %r" % ut)
        if kind == "thieu":
            if has_block: out.append("thieu/html: thieu-section van in khoi")
            if not has_flag: out.append("thieu/html: thieu co vang chua-khai-nguong")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is False and ut.get("lines") == []): out.append("thieu/extract: sai: %r" % ut)
        if kind == "khong":
            if has_block or has_flag: out.append("khong-co-hoi/html: nhanh khong-co-hoi in co vang/khoi")
            if not has_fact: out.append("khong-co-hoi/html: thieu dong su kien ship-thang")
            if not (ut.get("opportunity_present") is False): out.append("khong-co-hoi/extract: opportunity_present phai false: %r" % ut)
        shutil.rmtree(base, ignore_errors=True)
    # doi-cu: contract khong co veto_state, khong opportunity — nhu khong-co-hoi, khong loi
    base = Path(tempfile.mkdtemp()); ws = make_ws(base, "khong")
    rc, html, err = run(gc, ws, False)
    if rc != 0 or "ship thẳng, không phiên nghiệm thu" not in html: out.append("doi-cu/html: hoi so doi cu loi hoac thieu dong su kien")
    shutil.rmtree(base, ignore_errors=True)
    return out
# doi chung duong: gate-card that phai xanh ca 8 o
e = matrix(root / "scripts" / "gate-card.js", "that")
for x in e: bad(x)
# 3 mutant tren BAN SAO gate-card (mutant phai CHAY DUOC: khong duoc crash)
def mutant(name, fn, expect_substr):
    tmp = Path(tempfile.mkdtemp()); shutil.copytree(root / "scripts", tmp / "scripts"); shutil.copytree(root / "lib", tmp / "lib")
    p = tmp / "scripts" / "gate-card.js"; s = p.read_text(encoding="utf-8"); s2 = fn(s)
    if s2 == s: bad("mutant %s khong ap duoc (neo doi?)" % name); return
    p.write_text(s2, encoding="utf-8")
    r = matrix(p, name)
    if not any(expect_substr in x for x in r): bad("MUTANT %s KHONG bi bat (doi '%s', thay %r)" % (name, expect_substr, r[:3]))
    else: print("     MUTANT %s bi bat: %s" % (name, [x for x in r if expect_substr in x][0]))
    shutil.rmtree(tmp, ignore_errors=True)
mutant("m1-go-khoi", lambda s: s.replace("Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)", "Ngưỡng nghiệm-thu"), "thieu khoi nguong")
mutant("m2-khong-co-hoi-in-co-vang", lambda s: s.replace("if (!ut.opportunity_present)", "if (ut.opportunity_present)"), "nhanh khong-co-hoi in co vang")
mutant("m3-rong-van-in-khoi", lambda s: s.replace("ut.section_present && ut.lines.length", "ut.section_present"), "rong van in khoi")
if errs: print("\n".join(errs)); sys.exit(1)
print("P197 OK (8 o ma tran + doi-cu xanh tren gate-card that; 3 mutant bi bat; heading round-trip tu khuon)")
P197PY
run "P197 the Cong Pham vi in nguong nghiem thu: ma tran 4x2 + doi-cu + 3 mutant (moi-noi-vong-trao E1/E2)" \
  python3 "$P197TMP/p197.py" "$ROOT"
rm -rf "$P197TMP"
```

- [ ] **Step 2: Chạy đỏ** — `ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh` → kỳ vọng FAIL, thông điệp có «thieu khoa uat_threshold» (gate-card chưa biết).

- [ ] **Step 3: Sửa `scripts/gate-card.js`** — ngay sau khối `dpFlags` (trước dòng `if (EXTRACT)`), thêm:

```js
  // ---- ngưỡng nghiệm thu (opportunity.md — mối nối Vòng HIỂU → Cổng Phạm vi) ----
  // Heading là chuỗi PIN round-trip với khuôn opportunity-template (P197 rút heading từ khuôn).
  // Không lưu «đường A» ở đâu cả: có/không hồ sơ cơ hội suy khi đọc (ledger d-… descope route).
  const UAT_THRESHOLD_HEADING = 'Ngưỡng chết / ngưỡng UAT';
  const oppText = read(path.join(dir, 'opportunity.md'));
  const ut = { opportunity_present: !!oppText.trim(), section_present: false, lines: [] };
  if (ut.opportunity_present) {
    ut.section_present = new RegExp('^#{2,6}\\s+' + UAT_THRESHOLD_HEADING.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '\\s*$', 'im').test(oppText);
    if (ut.section_present) ut.lines = section(oppText, UAT_THRESHOLD_HEADING).map(l => l.trim()).filter(l => l && !/^>/.test(l));
  }
```

Trong JSON của `--extract` thêm `uat_threshold: ut` (đặt sau `design_pass`). Trong HTML, ngay sau dòng `if (dp.present) P.push(...)`, thêm:

```js
  if (ut.opportunity_present && ut.section_present && ut.lines.length) {
    P.push(`<div class="lab">Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)</div><div class="grp gnot">${ut.lines.map(l => `<p class="li">${esc(stripMd(l))}</p>`).join('')}<p class="li">Vòng này sẽ có phiên nghiệm thu sau khi giao — số đo thật sẽ đặt cạnh các ngưỡng trên.</p></div>`);
  }
```

Trong mảng `flags` (sau vòng `for (const f of dpFlags)`), thêm:

```js
  if (!ut.opportunity_present) flags.push(['finfo', 'Vòng này không có hồ sơ cơ hội → sau Cổng Bằng chứng sẽ ship thẳng, không phiên nghiệm thu.']);
  else if (!(ut.section_present && ut.lines.length)) flags.push(['fwarn', 'Hồ sơ cơ hội chưa khai ngưỡng nghiệm thu — chưa biết vòng này sẽ được đo bằng gì; khai ở Cổng Đáng trước khi duyệt.']);
```

Lưu ý neo mutant: chuỗi `ut.section_present && ut.lines.length` phải xuất hiện đúng như vậy trong điều kiện render khối (m3), và `if (!ut.opportunity_present)` đúng như vậy ở cờ (m2); tiêu đề khối đúng chuỗi «Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)» (m1). Cờ dòng sự kiện dùng `finfo` (không phải cờ vàng): P197 kiểm «không cờ vàng» bằng vắng chuỗi «chưa khai ngưỡng».

- [ ] **Step 4: Chạy xanh** — `ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh` → PASS, dòng «P197 OK … 3 mutant bi bat».
- [ ] **Step 5: Chạy toàn suite plugins** — `bash tests/plugins/run-tests.sh | tail -3` → all passed (các case gate-card cũ không đổi).
- [ ] **Step 6: Commit** — `git add scripts/gate-card.js tests/plugins/run-tests.sh && git commit -m "feat(gate-card): thẻ Cổng Phạm vi in ngưỡng nghiệm thu từ hồ sơ cơ hội (4 trạng thái) + P197 ma trận 4x2 + 3 mutant"`.

---

### Task 2: Khuôn nhật-ký-vấp + uat-session §0/§1 + chân `khuon`, `uat_needle` (E3, E4b, đầu vào E4)

**Files:**
- Create: `skills/acceptance/references/stranger-drive-template.md`
- Modify: `skills/uat-session/SKILL.md` (§0 L19–28, §1 L30–38, §3 L46–56)
- Modify: `docs/lai-thu-nguoi-la.md` (§5 Tham chiếu, thêm dòng trỏ khuôn)
- Create: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh` (chân `khuon`, `uat-needle`; các task sau thêm chân)

**Interfaces:**
- Produces: khối marker `<!-- <<<STRANGER-FRONTMATTER-TEMPLATE -->…<!-- STRANGER-FRONTMATTER-TEMPLATE>>> -->` bọc ```` ```yaml ```` chứa frontmatter với khoá `schema_version slug ran_at variant chan lac kho_chiu vat chuyen_phien_nguoi`; §0 uat-session gọi khoá bằng backtick (`chan`, `slug`, `ran_at`).
- Consumes: `docs/lai-thu-nguoi-la.md` §1 (khuôn nhật ký CHẶN/LẠC/KHÓ-CHỊU/VẶT).

`independent: false` (rang-mnvt.sh dùng chung) · phục vụ E3, E4b, E4.

- [ ] **Step 1: Viết `rang-mnvt.sh` với hai chân, chạy đỏ trước.** Nội dung:

```bash
#!/usr/bin/env bash
# rang-mnvt.sh — răng hồ sơ moi-noi-vong-trao. Mỗi chân: vật thật + chiều đỏ cùng lượt
# trên bản sao code-sinh; đường dẫn suy từ vị trí script. Không vào suite vĩnh viễn.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
CHAN="${2:-}"; [ "${1:-}" = "--chan" ] && [ -n "$CHAN" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
fail() { echo "  MNVT ĐỎ [$CHAN]: $1"; exit 1; }
ok()   { echo "  MNVT XANH [$CHAN]: $1"; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
case "$CHAN" in
khuon)
  node - "$ROOT" <<'JS' || exit 1
const fs=require('fs'),path=require('path');const root=process.argv[2];
const die=m=>{console.log('  MNVT ĐỎ [khuon]: '+m);process.exit(1)};
const tplP=path.join(root,'skills/acceptance/references/stranger-drive-template.md');
const skP=path.join(root,'skills/uat-session/SKILL.md');
function keysOfTemplate(tpl){const m=tpl.match(/<!-- <<<STRANGER-FRONTMATTER-TEMPLATE -->\n```yaml\n---\n([\s\S]*?)\n---\n```/);if(!m)return null;return new Set(m[1].split('\n').map(l=>l.match(/^([a-z_]+):/)).filter(Boolean).map(m=>m[1]));}
function keysRead(sk){const s0=sk.split(/^## 0\./m)[1]||'';const s01=s0.split(/^## 2\./m)[0]||'';const set=new Set();for(const m of s01.matchAll(/`([a-z_]+)`/g)){if(/^(chan|lac|kho_chiu|vat|slug|ran_at|variant|chuyen_phien_nguoi|schema_version|blocked|[a-z_]+)$/.test(m[1])&&/stranger|nhật-ký|nhật ký/i.test(s01))set.add(m[1]);}return set;}
function check(tpl,sk,label){const K=keysOfTemplate(tpl);if(!K)return label+': khuon thieu khoi STRANGER-FRONTMATTER-TEMPLATE';const R=[...keysRead(sk)].filter(k=>K.has(k)||['chan','blocked','slug','ran_at','lac','kho_chiu','vat','variant','chuyen_phien_nguoi'].includes(k));for(const k of R)if(!K.has(k))return label+': §0 doc khoa ngoai khuon: '+k;for(const k of['chan','slug','ran_at'])if(!R.includes(k))return label+': §0 khong doc khoa bat buoc: '+k;if(!/stranger-drive\.md/.test(sk))return label+': §0 khong nhac stranger-drive.md';return null;}
const tpl=fs.readFileSync(tplP,'utf8'),sk=fs.readFileSync(skP,'utf8');
const e=check(tpl,sk,'that');if(e)die(e);
if(!fs.readFileSync(path.join(root,'docs/lai-thu-nguoi-la.md'),'utf8').includes('stranger-drive-template.md'))die('docs/lai-thu-nguoi-la.md khong tro toi khuon');
// chieu do hai phia
const eA=check(tpl.replace(/^chan:/m,'blocked:'),sk,'mutA');if(!eA||!/ngoai khuon: chan/.test(eA))die('MUTANT khuon (chan->blocked) KHONG bi bat: '+eA);
const eB=check(tpl,sk.replace(/`chan`/,'`blocked`'),'mutB');if(!eB||!/ngoai khuon: blocked/.test(eB))die('MUTANT SKILL (chan->blocked) KHONG bi bat: '+eB);
console.log('  MNVT XANH [khuon]: DOC ⊆ KHUON, DOC ⊇ {chan,slug,ran_at}; 2 mutant bi bat ('+eA+' | '+eB+')');
JS
  ;;
uat-needle)
  SK="$ROOT/skills/uat-session/SKILL.md"
  S0="$(awk '/^## 0\./{f=1} /^## 2\./{f=0} f' "$SK")"
  need() { printf '%s' "$S0" | grep -q -- "$1" || fail "thieu nhanh: $2"; }
  need 'chan' 'khoa chan'; need 'THOẢ BẰNG BẰNG CHỨNG' 'nhanh thoa bang bang chung'
  need 'cờ vàng' 'thieu nhanh co vang'; need 'lái-thử' 'thieu chi duong lai-thu lai'
  need 'verified_at' 'nhanh ran_at cu hon lan cham'; need 'Chuyển phiên người' 'chep Chuyen phien nguoi vao cham kin'
  # chieu do: xoa nhanh co vang / xoa chi duong tren ban sao
  M1="$(printf '%s' "$S0" | grep -v 'cờ vàng')"; printf '%s' "$M1" | grep -q 'cờ vàng' && fail "mutant xoa co vang khong ap duoc"
  M2="$(printf '%s' "$S0" | grep -v 'lái-thử')"; printf '%s' "$M2" | grep -q 'lái-thử' && fail "mutant xoa chi duong khong ap duoc"
  ok "6 nhanh co ten; 2 mutant (thieu nhanh co vang · thieu chi duong lai-thu lai) doi mau"
  ;;
*) fail "chan khong biet: $CHAN" ;;
esac
```

Chạy `bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan khuon` → ĐỎ «khuon thieu khoi…» (file chưa có); `--chan uat-needle` → ĐỎ «thieu nhanh».

- [ ] **Step 2: Tạo khuôn `skills/acceptance/references/stranger-drive-template.md`:**

````markdown
# Nhật-ký-vấp của Lái-thử Người-lạ — khuôn hồ sơ

> Vị trí khi dùng: `_acceptance/<slug>/stranger-drive.md` của repo sản phẩm.
> Frontmatter là phần MÁY ĐỌC (`uat-session` §0 đọc) — giữ nguyên tên khoá,
> chỉ thay giá trị. Nghi thức, hai biến thể và luật dùng/không-dùng ở
> `docs/lai-thu-nguoi-la.md`; đề bài thi hành ở `docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md`.
> Máy tường thuật, không phán đáng-giá: mọi câu «đáng không?» ghi vào «Chuyển
> phiên người», không điền verdict.

**Thủ tục chép:** chép NỘI DUNG giữa cặp mốc dưới, ĐỪNG chép hai dòng `<!-- … -->`
và hàng rào ```` ```yaml ```` — file thật phải bắt đầu ngay ở `---`.

<!-- <<<STRANGER-FRONTMATTER-TEMPLATE -->
```yaml
---
schema_version: 1
slug: {slug}                # đúng slug hồ sơ — nhật-ký của vòng khác không được tính
ran_at: {ran_at}            # ISO UTC lúc bắt đầu ván; cũ hơn lần chấm máy cuối thì không tính
variant: {variant}          # ui | agent
chan: {chan}                # số vấp CHẶN — 0 mới là bằng chứng «bấm được»
lac: {lac}                  # số vấp LẠC
kho_chiu: {kho_chiu}        # số vấp KHÓ-CHỊU
vat: {vat}                  # số vấp VẶT
chuyen_phien_nguoi: {n}     # số câu «Chuyển phiên người» ở cuối file
---
```
<!-- STRANGER-FRONTMATTER-TEMPLATE>>> -->

## Mục tiêu (tiếng sản phẩm, giấu đường đi)

- {mục tiêu 1} · ngân sách 12 bước / 5 phút

## Nhật ký vấp

| # | Loại | Mục tiêu | Vấp gì (nguyên văn) | Bằng chứng |
|---|---|---|---|---|
| 1 | CHẶN / LẠC / KHÓ-CHỊU / VẶT | … | … | frame/… |

## Chuyển phiên người

- {câu hỏi đáng-giá chỉ người trả lời được}

## Bằng chứng

- thư mục frames / transcript
````

- [ ] **Step 3: Sửa `skills/uat-session/SKILL.md` §0** — thay bullet «Sản phẩm thật đã chạy sau flag để người dự bấm được.» bằng:

```markdown
- Sản phẩm thật đã chạy sau flag để người dự bấm được — điều kiện này đọc từ
  **nhật-ký-vấp** của Lái-thử Người-lạ, `_acceptance/<slug>/stranger-drive.md`
  (khuôn: `skills/acceptance/references/stranger-drive-template.md`), không
  từ lời khai:
  - `chan: 0` **và** `slug` khớp slug phiên **và** `ran_at` không cũ hơn
    `verified_at` của `evidence-report.md` → điều kiện THOẢ BẰNG BẰNG CHỨNG;
    nói một dòng (ván nào, biến thể nào) rồi đi tiếp.
  - `chan` > 0 → DỪNG, nêu từng vấp CHẶN, và chỉ đường quay lại: chạy lại
    lái-thử (`docs/lai-thu-nguoi-la.md`) cho CHẶN về 0 — sửa là việc của vòng,
    không phải của phiên này.
  - File vắng · frontmatter không đọc được · `slug` lệch · `ran_at` cũ hơn lần
    chấm máy cuối → đi tiếp với **cờ vàng nêu lý do có tên** («chưa lái-thử» /
    «không đọc được nhật-ký-vấp» / «nhật-ký của vòng khác» / «nhật-ký cũ hơn
    bản chấm»); điều kiện lúc đó là lời khai, phiên vẫn mở được — không chặn,
    không hỏi.
```

Và §1, sau đoạn «Chép NGUYÊN VĂN ngưỡng…», thêm đoạn:

```markdown
Có nhật-ký-vấp → chép các câu «Chuyển phiên người» của nó vào khối «Chấm kín»
làm câu gợi cho từng người dự — máy dọn bàn, người chấm; không câu nào trong
đó là verdict.
```

- [ ] **Step 4: `docs/lai-thu-nguoi-la.md` §5** thêm dòng đầu: `- **Khuôn nhật-ký-vấp** (mặt máy \`uat-session\` §0 đọc): \`skills/acceptance/references/stranger-drive-template.md\``.
- [ ] **Step 5: Chạy xanh** hai chân: `bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan khuon` và `--chan uat-needle` → XANH kèm dòng mutant.
- [ ] **Step 6: Commit** — `git add skills/acceptance/references/stranger-drive-template.md skills/uat-session/SKILL.md docs/lai-thu-nguoi-la.md _acceptance/moi-noi-vong-trao/rang-mnvt.sh && git commit -m "feat(uat-session): §0 đọc nhật-ký-vấp làm bằng chứng bấm-được (chan·slug·ran_at) + khuôn stranger-drive có marker + răng khuon/uat-needle"`.

---

### Task 3: feature-loop S0/S5 bàn giao + chân `s5-needle` (E5b, đầu vào E5)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S0 mục 3, S5 L213–215)
- Modify: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh` (thêm chân `s5-needle`)

`independent: false` · phục vụ E5b, E5.

- [ ] **Step 1: Thêm chân vào rang-mnvt.sh** (trước `*)`):

```bash
s5-needle)
  SK="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
  S5="$(awk '/^## S5/{f=1} /^## Quy tắc/{f=0} f' "$SK")"; S0="$(awk '/^## S0/{f=1} /^## S1/{f=0} f' "$SK")"
  printf '%s' "$S5" | grep -q 'opportunity.md' || fail "thieu dong ban giao S5 (khong nhac opportunity.md)"
  printf '%s' "$S5" | grep -q 'lái-thử' || fail "thieu dong ban giao S5 (khong nhac lai-thu)"
  printf '%s' "$S5" | grep -q 'uat-session <slug>' || fail "thieu dong ban giao S5 (khong co lenh uat-session <slug>)"
  printf '%s' "$S5" | grep -q 'ship thẳng' || fail "thieu nhanh khong-co-hoi ship thang"
  printf '%s' "$S0" | grep -q 'opportunity.md' || fail "S0 khong nhac opportunity.md lam input brainstorm"
  M="$(printf '%s' "$S5" | grep -v 'lái-thử')"; printf '%s' "$M" | grep -q 'lái-thử' && fail "mutant khong ap duoc"
  ok "S5 co dong ban giao (opportunity · lái-thử · uat-session <slug>) + nhanh ship thang; S0 doc opportunity; mutant xoa dong ban giao doi mau"
  ;;
```
Chạy `--chan s5-needle` → ĐỎ «thieu dong ban giao S5».

- [ ] **Step 2: Sửa S5** — thay đoạn S5 hiện tại bằng:

```markdown
## S5 — SHIP

Invoke `superpowers:finishing-a-development-branch` → PR theo quy trình repo (không push thẳng nhánh chính nếu repo cấm). Update doc trạng thái của repo nếu có. CI pre-merge check của acceptance-gate kit (`scripts/pre-merge-check.sh`) là chốt chặn độc lập — không bypass; repo CHƯA wire nó vào CI → cảnh báo user rõ ràng (gate không enforce trước merge, xem README của kit cách wire).

**Kết S5 — bàn giao sang Vòng TRAO, không kết bằng «xong».** Có `_acceptance/<slug>/opportunity.md` (vòng có ngưỡng nghiệm thu khai ở Cổng Đáng) → in ĐÚNG MỘT DÒNG: «đã giao sau cờ · bước kế: lái-thử người-lạ (docs/lai-thu-nguoi-la.md của kit) rồi phiên nghiệm thu — `uat-session <slug>`» — không hỏi, không tự chạy phiên nghiệm thu; lái-thử chạy trong lúc chờ mời người dự. Không có `opportunity.md` → một dòng «không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng». Đường đi không lưu ở đâu — suy khi đọc từ có/không hồ sơ cơ hội.
```

- [ ] **Step 3: Sửa S0 mục 3** — thêm câu cuối: `Workspace đã có \`opportunity.md\` (vòng đi từ Cổng Đáng) → đó là INPUT THỨ NHẤT của brainstorm S1: đọc trước khi hỏi câu nào; ngưỡng nghiệm thu và khung người/việc/dữ liệu của nó chảy vào contract, không hỏi lại owner điều đã grill.`
- [ ] **Step 4: Chạy xanh** `--chan s5-needle`. Chạy `bash tests/plugins/run-tests.sh | tail -3` (feature-loop SKILL có case pin, vd P159/P175 khối GOAL-TEMPLATE) → all passed.
- [ ] **Step 5: Commit** — `git add feature-loop/skills/feature-loop/SKILL.md _acceptance/moi-noi-vong-trao/rang-mnvt.sh && git commit -m "feat(feature-loop): S5 bàn giao sang Vòng TRAO khi có hồ sơ cơ hội; S0 đọc opportunity làm input thứ nhất; răng s5-needle"`.

---

### Task 4: Chữ spec + chân `spec` (E6)

**Files:**
- Modify: `docs/specs/workflow-v2-spec.md` (L256 bullet lái-thử · L282–283 hàng A/B · L332 Chương 3 · L390 bảng dịch Chương 4 · L315 «Trạng thái máy-suy»)
- Modify: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh` (chân `spec`)

`independent: false` · phục vụ E6.

- [ ] **Step 1: Chân spec** (thêm trước `*)`):

```bash
spec)
  SP="$ROOT/docs/specs/workflow-v2-spec.md"; DB="$ROOT/docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md"
  chk() { grep -q -- "$1" "$2" || fail "$3"; }
  awk '/^### 2.3/{f=1} /^### 2.4/{f=0} f' "$SP" | grep -q 'thì ĐO' || fail "§2.3 khong goi lai-thu la thi DO"
  grep '^| \*\*A\*\*' "$SP" | grep -q 'lái-thử' || fail "hang A thieu lai-thu"
  awk '/^## CHƯƠNG 3/{f=1} /^## CHƯƠNG 4/{f=0} f' "$SP" | grep -q 'lái-thử không có hàng' || fail "Chuong 3 thieu dong lai-thu khong co hang"
  awk '/^## CHƯƠNG 4/{f=1} /^## CHƯƠNG 5/{f=0} f' "$SP" | grep -q 'nhật-ký-vấp' || fail "Chuong 4 khong nhac nhat-ky-vap"
  chk 'Cấm leo thang trước số liệu' "$DB" "de bai §5 bi sua/gach"
  # chieu do: ban sao bo lai-thu khoi hang A
  M="$(grep '^| \*\*A\*\*' "$SP" | sed 's/lái-thử//g')"; printf '%s' "$M" | grep -q 'lái-thử' && fail "mutant khong ap duoc"
  ok "§2.3 thi DO · hang A co lai-thu · Chuong 3 dong · Chuong 4 nhat-ky-vap · §5 de bai nguyen; mutant hang A doi mau"
  ;;
```
Chạy → ĐỎ «§2.3 khong goi…».

- [ ] **Step 2: Sửa spec.** (a) L256 bullet: đổi mở đầu thành `- **Lái-thử Người-lạ** — **thì ĐO-máy của nhịp TRAO**, đứng trước thì ĐO-người (phiên UAT); tiền trạm, MÁY, chạy trong lúc chờ mời người (thêm 13/08, định vị 17/08): …` giữ phần còn lại. (b) Hàng A cột cuối: `**lái-thử → UAT → Cổng Giá-trị**`; hàng B cột cuối thêm ` · lái-thử tuỳ chọn khi mở bề mặt mới (đọc kèm Cổng Bằng chứng)`. (c) Ngay dưới bảng Chương 3 thêm dòng: `*Lái-thử Người-lạ không có hàng trong bảng này — nó không hỏi câu nào người phải trả lời; nó là thì ĐO-máy (§2.3), kết quả là nhật-ký-vấp cho người dự nghiệm thu.*` (d) Bảng dịch Chương 4 thêm hàng: `| Nhật ký test thủ công trước UAT | **nhật-ký-vấp** \`stranger-drive.md\` — song diện: frontmatter (chan/lac/kho_chiu/vat) máy đọc ở \`uat-session\` §0 + bảng vấp cho người | trước phiên nghiệm thu | uat-session §0 |`. (e) Mục «Trạng thái máy-suy» §2.4 thêm câu: `Từ hồ sơ moi-noi-vong-trao (08/2026): thẻ Cổng Phạm vi in ngưỡng nghiệm thu / dòng «ship thẳng» suy từ có/không \`opportunity.md\`; S5 in dòng bàn giao; đường đi vẫn KHÔNG lưu — suy khi đọc.`
- [ ] **Step 3: Chạy xanh** `--chan spec`.
- [ ] **Step 4: Commit** — `git add docs/specs/workflow-v2-spec.md _acceptance/moi-noi-vong-trao/rang-mnvt.sh && git commit -m "docs(spec): lái-thử là thì ĐO-máy của nhịp TRAO; hàng A/B; dòng Chương 3; nhật-ký-vấp song diện; răng spec"`.

---

### Task 5: Dấu ĐỀ XUẤT trên hình 2/3 + chân `hinh` (E7)

**Files:**
- Modify: `docs/diagrams/workflow-v2-chuoi-vat-chung.html` (L50 eyebrow, L137 colophon), `docs/diagrams/workflow-v2-vong-doi-mot-viec.html` (L42, L139)
- Modify: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh` (chân `hinh`)

`independent: false` · phục vụ E7.

- [ ] **Step 1: Chân hinh:**

```bash
hinh)
  D="$ROOT/docs/diagrams"; IDX="$D/workflow-v2-bo-hinh.md"
  FILES="toan-tuyen chuoi-vat-chung vong-doi-mot-viec kien-truc-bo-may ban-mau-bon-truc lan-ui"
  for f in $FILES; do [ -f "$D/workflow-v2-$f.html" ] || fail "thieu file: workflow-v2-$f.html"; grep -q 'class="colophon"' "$D/workflow-v2-$f.html" || fail "thieu colophon: $f"; grep -q "workflow-v2-$f.html" "$IDX" || fail "muc luc thieu: $f"; done
  for f in chuoi-vat-chung vong-doi-mot-viec; do
    grep 'class="eyebrow"' "$D/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || fail "thieu dau DE XUAT: $f (eyebrow)"
    grep 'class="colophon"' "$D/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || fail "thieu dau DE XUAT: $f (colophon)"
    grep 'class="colophon"' "$D/workflow-v2-$f.html" | grep -q 'cho tới khi' || fail "colophon thieu dieu kien go dau: $f"
  done
  # chieu do
  cp "$D/workflow-v2-chuoi-vat-chung.html" "$TMP/x.html"; sed -i.bak 's/ĐỀ XUẤT//g' "$TMP/x.html"; grep 'class="eyebrow"' "$TMP/x.html" | grep -q 'ĐỀ XUẤT' && fail "mutant khong ap duoc"
  ok "6 file · muc luc du · dau DE XUAT + dieu kien go tren 2 hinh; mutant go dau doi mau"
  ;;
```

- [ ] **Step 2: Sửa hai hình.** Eyebrow: `Evidence chain · Workflow v2 · ĐỀ XUẤT — guard chưa có trong mã` / `State machine · Workflow v2 · ĐỀ XUẤT — guard chưa có trong mã`. Colophon: nối thêm ` · dấu ĐỀ XUẤT giữ cho tới khi guard có trong mã — hồ sơ thi hành guard gỡ dấu, không phải hồ sơ này`. Cập nhật `workflow-v2-bo-hinh.md` cột «Vai khi duyệt» của hình 2/3: thêm «(ĐỀ XUẤT — chờ guard)».
- [ ] **Step 3: Chạy xanh** `--chan hinh`. Kiểm tràn chữ: `python3 <diagram-design skill>/scripts/check_overflow.py docs/diagrams/workflow-v2-chuoi-vat-chung.html docs/diagrams/workflow-v2-vong-doi-mot-viec.html`.
- [ ] **Step 4: Commit** — `git add docs/diagrams/workflow-v2-chuoi-vat-chung.html docs/diagrams/workflow-v2-vong-doi-mot-viec.html docs/diagrams/workflow-v2-bo-hinh.md _acceptance/moi-noi-vong-trao/rang-mnvt.sh && git commit -m "docs(diagrams): dấu ĐỀ XUẤT + điều kiện gỡ trên hình 2/3; răng hinh"`.

---

### Task 6: Chân `the-nguong` / `the-nguong-do` + khai executor + chạy toàn bộ

**Files:**
- Modify: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh` (2 chân bọc P197)
- Modify: `_acceptance/config.yaml` (khối `executors.script`, thêm 8 khoá `rang_mnvt_*`)

`independent: false` · phục vụ E1, E2 (cmd), và mọi eval script.

- [ ] **Step 1: Hai chân bọc P197 — ghim đúng dòng, không tin mã thoát suite:**

```bash
the-nguong|the-nguong-do)
  OUT="$(ONLY_BLOCK=P197 bash "$ROOT/tests/plugins/run-tests.sh" 2>&1)"
  printf '%s\n' "$OUT" | grep -q '^P197 OK\|  PASS: P197\|P197 OK (' || { printf '%s\n' "$OUT" | grep 'P197' | head -20; fail "khong thay dong P197 OK"; }
  printf '%s\n' "$OUT" | grep -q 'MUTANT m1-go-khoi bi bat' || fail "P197 khong bao mutant m1 bi bat"
  printf '%s\n' "$OUT" | grep -q 'MUTANT m2-khong-co-hoi-in-co-vang bi bat' || fail "P197 khong bao mutant m2 bi bat"
  printf '%s\n' "$OUT" | grep -q 'MUTANT m3-rong-van-in-khoi bi bat' || fail "P197 khong bao mutant m3 bi bat"
  ok "P197 OK + 3 mutant bi bat (ghim dong, khong tin ma thoat suite)"
  ;;
```

- [ ] **Step 2: `_acceptance/config.yaml`** — trong `executors.script`, sau các dòng `rang_release21_*`, thêm:

```yaml
    # Vật của hồ sơ moi-noi-vong-trao — răng hồ sơ, không vào suite vĩnh viễn
    # (P197 thẻ ngưỡng đã vào suite plugins). Mỗi chân kèm chiều đỏ cùng lượt.
    rang_mnvt_the_nguong: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan the-nguong
    rang_mnvt_the_nguong_do: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan the-nguong-do
    rang_mnvt_khuon: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan khuon
    rang_mnvt_uat_needle: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan uat-needle
    rang_mnvt_s5_needle: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan s5-needle
    rang_mnvt_spec: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan spec
    rang_mnvt_hinh: bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan hinh
```

- [ ] **Step 3: Chạy tất cả chân + 4 suite** — `for c in the-nguong khuon uat-needle s5-needle spec hinh; do bash _acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan $c || echo "ĐỎ $c"; done`; rồi `bash tests/scripts/run-tests.sh | tail -2; bash tests/hooks/run-tests.sh | tail -2; bash tests/plugins/run-tests.sh | tail -2; bash tests/workflows/run-tests.sh | tail -2; node scripts/product-map.mjs --root . --check`. Tất cả xanh (P195 canh suite_key resolve — khoá mới không nằm trong suite_keys nên không đụng).
- [ ] **Step 4: Commit** — `git add _acceptance/config.yaml _acceptance/moi-noi-vong-trao/rang-mnvt.sh && git commit -m "chore(acceptance): executor rang_mnvt_* + chân bọc P197 ghim dòng"`. Set contract `status: implemented` → S4.

---

## Self-review

- Spec coverage: 3.1→T1 · 3.2+3.3→T2 · 3.4→T3 · 3.5→T4 · 3.6→T5 · §4 đo→T1/T6 + hội đồng E4/E5 (S4 chấm, đề/đáp án đã có).
- Placeholder: không «TBD»; mọi bước có mã.
- Tên nhất quán: `uat_threshold.{opportunity_present,section_present,lines}` (T1 ↔ P197); chân `the-nguong|the-nguong-do|khuon|uat-needle|s5-needle|spec|hinh` (rang-mnvt ↔ config.yaml); marker `STRANGER-FRONTMATTER-TEMPLATE` (khuôn ↔ chân khuon); chuỗi neo mutant m1/m2/m3 (T1 code ↔ P197).
