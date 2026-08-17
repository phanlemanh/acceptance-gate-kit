# hinh-tai-cong-1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mục GATE 1 của vòng lặp có khối `### Hình tại điểm quyết định` (năm bước kê·đếm·vẽ·nhìn·đính + câu luật một nguồn), và suite `tests/plugins` có case P197 neo vào đúng khối đó với ma trận đột biến ghim thông điệp.

**Architecture:** Hai vật, hai task phụ thuộc (test đọc SKILL.md): (1) chèn khối vào CUỐI mục `## GATE 1` (trước `## S2 — PLAN`) + một câu trỏ trong đoạn «BƯỚC MẶC ĐỊNH»; (2) case P197 = python heredoc theo nếp P90 — rút khối bằng heading, đơn vị «câu» = đoạn/bullet, đối chứng dương trước, mỗi needle một lượt gỡ CHỈ trong khối, thông điệp mang tên needle.

**Tech Stack:** markdown SKILL.md · bash + python3 (suite hiện có).

## Global Constraints

- KHÔNG đụng `scripts/gate-card.js`, `card-plain.json` schema, `commands/*.md`, bản luật `human-facing-language.md`.
- Chép THÂN câu-về-hình, KHÔNG chép cặp marker `LOOP-PICTURE-CLAUSE` (P93 đếm cặp marker toàn cây phải giữ đúng 1).
- Mọi needle của P197 phải nằm TRONG khối `### Hình tại điểm quyết định`; câu trỏ ngoài khối được phép trùng chữ nhưng không được cứu đột biến.
- MEASURE-BIRTH-CLAUSE: P197 chỉ tính xong khi đối chứng dương XANH + mỗi đột biến ĐỎ ghim thông điệp; verify per-task = chạy `ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh` rồi toàn suite.

---

### Task 1: Khối «Hình tại điểm quyết định» trong GATE 1

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — mục `## GATE 1 (human — điểm dừng 1)` (dòng ~101–121): (a) thêm câu trỏ vào cuối đoạn «**BƯỚC MẶC ĐỊNH**»; (b) chèn khối dưới đây NGAY TRƯỚC `## S2 — PLAN`.

**Interfaces:**
- Produces: heading cố định `### Hình tại điểm quyết định`; nhãn `[1] Kê`…`[5] Đính`; các cụm needle liệt kê trong contract AC-2..AC-7 (Task 2 đọc đúng các cụm này).

- [ ] **Step 1: Thêm câu trỏ** vào cuối đoạn «BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC» (sau câu «(Lệnh/script `/acceptance-card` không có → … tạm trình gói text.)»):

```
 Cổng dừng chờ người: chạy khối «Hình tại điểm quyết định» ở cuối mục này TRƯỚC khi render thẻ — thẻ và hình đi cùng nhau.
```

- [ ] **Step 2: Chèn khối** ngay trước dòng `## S2 — PLAN` (giữ một dòng trống hai bên):

```markdown
### Hình tại điểm quyết định

Điểm quyết định vượt ngưỡng N5 thì kèm hình; chọn cách vẽ bằng bảng tra `DECISION-DIAGRAM-SURFACES` theo mặt phẳng đang trình, và kiểm lại bằng phép thử nhìn-thấy-hình.

Năm bước dưới đây chạy TRƯỚC `/acceptance-card`, và CHỈ khi cổng thật sự dừng chờ người — T3, hoặc T2 không đủ điều kiện đi tiếp ở trạng thái V.

T2 xanh-sạch đi tiếp thì bỏ qua cả năm bước — hình không ai đọc là giờ-kit vứt đi.

Resume vào `draft` mà workspace đã có `figures/` → dùng lại, không vẽ lại.

- **[1] Kê** điểm quyết định — máy kê từ artifact cuối S1, không hỏi người: mỗi entry sổ quyết định chờ seal · mỗi chỗ design lệch spec/plan gốc đã có · mỗi dòng `[GIẢ ĐỊNH]` trong Coverage · mỗi finding gap-probe xử lý `human-gate1`. Không kê AC/GWT từng dòng — AC là bằng chứng của quyết định, không phải quyết định.
- **[2] Đếm** ngưỡng N5 từng điểm: từ ba bước nối tiếp hoặc từ hai nhánh rẽ → «cần hình» + đề bài ≤5 dòng (loại hình · nút · nhãn bằng chữ · AC liên quan); ngược lại → «dưới ngưỡng: <đếm>». Ghi kết quả xuống `_acceptance/<slug>/figures/index.md` (bảng `| Điểm | Đếm | Hình |` + đề bài từng hình) — chỗ máy hết đường quên, và là đầu vào của bước vẽ; file là vật docs của hồ sơ (tầng 2 của DIAGRAM-RULE), thẻ không đọc nó.
- **[3] Vẽ** — vòng chính KHÔNG tự vẽ: dispatch subagent tươi (Agent tool; một agent một hình, hoặc một agent cả bộ khi ít hình) đọc `figures/index.md` + design doc + contract TỪ ĐĨA, dùng skill `diagram-design` (plugin thứ ba của marketplace, kit ≥ 2.1.0), đầu ra `_acceptance/<slug>/figures/<tên>.html` + `.png` cạnh nguồn (skill `export-diagram`). Nếu skill vắng → không chặn: vẽ khối mermaid vào design doc (mặt phẳng «tài liệu trong kho») + một dòng trong tin mời cổng «bộ khuôn vẽ chưa cài — hình ở dạng mermaid trong design doc».
- **[4] Nhìn** — vòng chính Read bản `.png` của từng hình: đây là phép thử nhìn-thấy-hình đúng nghĩa, không phải đọc mã nguồn hình. Hình hỏng (chữ đè, nút thiếu, lệch nguồn) → trả về bước vẽ kèm ghi chú, tối đa MỘT lần; vẫn hỏng → đính kèm cờ «hình <tên> chưa đạt», không chặn cổng.
- **[5] Đính** — gửi `card.html` và các hình trong CÙNG một lượt (mặt phẳng panel → «trang HTML gửi kèm» theo bảng tra); tin mời cổng vẫn theo điều khoản mời-cổng (một câu hỏi đóng), mỗi hình 1–3 dòng chú thích gắn tên quyết định; điểm dưới ngưỡng hiện đúng số đếm; 0 điểm vượt → nói đúng một dòng. Không có đường im lặng.
```

- [ ] **Step 3: Kiểm nhanh** — `grep -c "LOOP-PICTURE-CLAUSE" feature-loop/skills/feature-loop/SKILL.md` phải bằng số TRƯỚC khi sửa (0 — chỉ có thân câu, không có marker); `grep -c "### Hình tại điểm quyết định"` = 1.

- [ ] **Step 4: Chạy suite hiện có** `bash tests/plugins/run-tests.sh` → «all plugin tests passed» (P90/P93 vẫn xanh).

- [ ] **Step 5: Commit** `git add feature-loop/skills/feature-loop/SKILL.md && git commit -m "feat(hinh-tai-cong-1): khối Hình tại điểm quyết định trong GATE 1 — kê·đếm·vẽ·nhìn·đính, câu luật một nguồn"`.

### Task 2: Case P197 (phép đo neo vào khối, ma trận đột biến)

**Files:**
- Modify: `tests/plugins/run-tests.sh` — chèn case NGAY SAU `rm -rf "$P196TMP"` (trước khối ONLY_BLOCK cuối file).

**Interfaces:**
- Consumes: heading + nhãn + needle của Task 1; hàm rút clause của P90 (`<!-- <<<LOOP-PICTURE-CLAUSE -->` … `<!-- LOOP-PICTURE-CLAUSE>>> -->`).

- [ ] **Step 1: Viết case** (python heredoc, theo nếp P90 — đối chứng dương trước, đột biến ghim thông điệp):

```bash
# ── P197: khoi «Hinh tai diem quyet dinh» trong GATE 1 (hinh-tai-cong-1 E1–E8) ──
# Neo vao KHOI (heading con co dinh), khong vao file: P90 kiem clause co mat o
# BAT KY DAU trong SKILL.md nen xoa clause khoi GATE 1 ma giu o S2 van XANH — case
# nay phai DO dung cho do. Don vi «cau» = doan/bullet (tach truoc "- " hoac dong
# trong). Moi needle mot luot go CHI trong khoi; chep needle ra ngoai khoi (con
# trong muc GATE 1) KHONG cuu duoc.
run "P197 GATE 1 khoi hinh: clause mot-nguon · 5 nhan thu tu · 4 nguon ke · dieu kien dung-nguoi · subagent+skill-vang · Read .png · dinh cung luot · dung lai figures (hinh-tai-cong-1 E1-E8)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
LOOP = "feature-loop/skills/feature-loop/SKILL.md"
LAW  = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
_m = re.search(r"<!-- <<<LOOP-PICTURE-CLAUSE -->\n([\s\S]*?)<!-- LOOP-PICTURE-CLAUSE>>> -->", LAW)
assert _m, "khong rut duoc LOOP-PICTURE-CLAUSE tu ban luat"
norm = lambda s: re.sub(r"\s+", " ", s).strip()
CLAUSE = norm(_m.group(1))
HEAD = "### Hình tại điểm quyết định"

def gate1(text):
    m = re.search(r"^## GATE 1[^\n]*\n([\s\S]*?)(?=^## |\Z)", text, re.M)
    return m.group(1) if m else None

def block(text):
    g = gate1(text)
    if g is None: return None
    m = re.search(rf"^{re.escape(HEAD)}\s*$\n([\s\S]*?)(?=^##|\Z)", g, re.M)
    return m.group(1) if m else None

def units(b):  # «cau» = doan/bullet
    return [norm(u) for u in re.split(r"\n(?=- )|\n\s*\n", b) if norm(u)]

def has_unit(b, *needles):
    return any(all(n in u for n in needles) for u in units(b))

SOURCES = ["entry sổ quyết định chờ seal", "lệch spec/plan gốc", "[GIẢ ĐỊNH]", "human-gate1"]
LABELS  = ["[1] Kê", "[2] Đếm", "[3] Vẽ", "[4] Nhìn", "[5] Đính"]

# Bang thong diep DUY NHAT: check() chi phat thong diep tu day, va phep dem
# ma-tran ben duoi doi moi khoa phai tung DO it nhat mot lan (khong ghi so tay).
M = {
    "khoi":     "GATE 1: thieu khoi Hinh tai diem quyet dinh",
    "clause":   "GATE 1: cau ve hinh lech khuon mot-nguon",
    "nhan":     "GATE 1: thieu nhan buoc {}",
    "thu_tu":   "GATE 1: nam buoc sai thu tu",
    "dau_vet":  "GATE 1: thieu dau vet dem",
    "nguon":    "GATE 1: thieu nguon {}",
    "hoi":      "GATE 1: thieu menh de khong hoi nguoi",
    "dieu_kien":"GATE 1: thieu dieu kien dung-nguoi",
    "bo_qua":   "GATE 1: xanh-sach khong di kem bo qua",
    "subagent": "GATE 1: thieu subagent ve",
    "ten_skill":"GATE 1: thieu ten skill ve",
    "skill_vang":"GATE 1: thieu duong skill vang",
    "nhin":     "GATE 1: thieu buoc nhin",
    "mot_lan":  "GATE 1: thieu gioi han ve lai mot lan",
    "cung_luot":"GATE 1: the va hinh khong cung luot",
    "duoi":     "GATE 1: thieu dong duoi-nguong",
    "khong_diem":"GATE 1: thieu dong 0-diem-vuot",
    "dung_lai": "GATE 1: thieu duong dung lai figures",
}

def check(text):
    errs = []
    b = block(text)
    if b is None:
        return [M["khoi"]]
    if CLAUSE not in norm(b):
        errs.append(M["clause"])
    nb = "\n".join(u for u in b.split("\n") if norm(u) != CLAUSE)   # cat dong clause
    idx = [nb.find(l) for l in LABELS]
    if any(i < 0 for i in idx):
        errs.append(M["nhan"].format(",".join(l for l, i in zip(LABELS, idx) if i < 0)))
    elif idx != sorted(idx):
        errs.append(M["thu_tu"])
    if "_acceptance/<slug>/figures/index.md" not in b:
        errs.append(M["dau_vet"])
    for s in SOURCES:
        if s not in b:
            errs.append(M["nguon"].format(s))
    if "không hỏi người" not in b:
        errs.append(M["hoi"])
    if not has_unit(b, "T3", "T2 không đủ", "dừng chờ người"):
        errs.append(M["dieu_kien"])
    if not has_unit(b, "xanh-sạch", "bỏ qua"):
        errs.append(M["bo_qua"])
    if "subagent tươi" not in b:
        errs.append(M["subagent"])
    if "diagram-design" not in b:
        errs.append(M["ten_skill"])
    if not has_unit(b, "skill vắng", "mermaid", "không chặn"):
        errs.append(M["skill_vang"])
    if not has_unit(nb, "vòng chính", "Read", ".png"):
        errs.append(M["nhin"])
    if "MỘT lần" not in b:
        errs.append(M["mot_lan"])
    if "CÙNG một lượt" not in b:
        errs.append(M["cung_luot"])
    if "dưới ngưỡng" not in b:
        errs.append(M["duoi"])
    if "0 điểm vượt" not in b:
        errs.append(M["khong_diem"])
    if not has_unit(b, "draft", "figures/", "không vẽ lại"):
        errs.append(M["dung_lai"])
    return errs

live = (root / LOOP).read_text(encoding="utf-8")
assert check(live) == [], check(live)                     # DOI CHUNG DUONG

# --- bo dot bien: chi sua TRONG khoi; phan con lai cua file giu nguyen ---
def mutate(text, fn):
    g = gate1(text); b = block(text)
    nb = fn(b)
    assert nb != b, "dot bien khong doi gi — needle khong co trong khoi?"
    return text.replace(b, nb, 1)

def move_out(text, needle):
    """xoa needle trong khoi, chep no ra NGOAI khoi nhung con trong muc GATE 1"""
    b = block(text)
    assert needle in b
    nb = b.replace(needle, "", )
    t = text.replace(b, nb, 1)
    return t.replace(HEAD, needle + "\n\n" + HEAD, 1)

MUTS = 0
FIRED = set()
def expect(mut, msg, label):
    global MUTS
    errs = check(mut)
    assert msg in errs, f"{label}: mong '{msg}', duoc {errs}"
    MUTS += 1
    FIRED.add(msg)
    print(f"P197-MUT-{MUTS}: {label} DO dung ({msg})")

# P90-kieu: clause co mat BAT KY DAU trong file -> van XANH khi xoa khoi khoi
clause_line = next(u for u in block(live).split("\n") if norm(u) == CLAUSE)
m_clause = mutate(live, lambda b: b.replace(clause_line, ""))
expect(m_clause, "GATE 1: cau ve hinh lech khuon mot-nguon", "xoa clause khoi khoi")
assert CLAUSE in norm(m_clause), "S2 phai van giu clause (dot bien chi dung vao khoi)"
m_word = mutate(live, lambda b: b.replace(clause_line, clause_line.replace("kèm hình", "kèm sơ đồ")))
expect(m_word, "GATE 1: cau ve hinh lech khuon mot-nguon", "doi mot tu trong clause")
m_swap = mutate(live, lambda b: b.replace("[3] Vẽ", "@@").replace("[4] Nhìn", "[3] Vẽ").replace("@@", "[4] Nhìn"))
expect(m_swap, "GATE 1: nam buoc sai thu tu", "hoan vi nhan 3/4")
expect(move_out(live, "_acceptance/<slug>/figures/index.md"), "GATE 1: thieu dau vet dem", "chep figures/index.md ra ngoai khoi")
for s in SOURCES:
    expect(mutate(live, lambda b, s=s: b.replace(s, "")), f"GATE 1: thieu nguon {s}", f"go nguon {s}")
expect(mutate(live, lambda b: b.replace("không hỏi người", "tự kê")), "GATE 1: thieu menh de khong hoi nguoi", "go khong-hoi-nguoi")
cond = next(u for u in units(block(live)) if "dừng chờ người" in u and "T3" in u)
m_cond = mutate(live, lambda b: "\n".join(x for x in re.split(r"\n(?=- )|\n\s*\n", b) if norm(x) != cond))
expect(m_cond, "GATE 1: thieu dieu kien dung-nguoi", "xoa cau dieu kien (T3/T2 con o noi khac trong GATE 1)")
m_split = mutate(live, lambda b: b.replace("thì bỏ qua", "thì dừng.\n\nBỏ qua"))
expect(m_split, "GATE 1: xanh-sach khong di kem bo qua", "tach xanh-sach va bo qua")
m_skill = mutate(live, lambda b: re.sub(r"Nếu skill vắng[^\n]*?\.\s*(?=- |\n|$)", "", b))
expect(m_skill, "GATE 1: thieu duong skill vang", "xoa cau skill vang")
expect(mutate(live, lambda b: b.replace("subagent tươi", "agent")), "GATE 1: thieu subagent ve", "go subagent tuoi")
expect(mutate(live, lambda b: b.replace("diagram-design", "bộ vẽ")), "GATE 1: thieu ten skill ve", "go diagram-design")
expect(mutate(live, lambda b: b.replace("Read bản `.png`", "kiểm bằng phép thử nhìn-thấy-hình")), "GATE 1: thieu buoc nhin", "bo Read .png")
expect(mutate(live, lambda b: b.replace("dưới ngưỡng", "chưa tới")), "GATE 1: thieu dong duoi-nguong", "go duoi nguong")
expect(mutate(live, lambda b: b.replace("CÙNG một lượt", "khi tiện")), "GATE 1: the va hinh khong cung luot", "go cung mot luot")
expect(mutate(live, lambda b: b.replace("không vẽ lại", "vẽ lại")), "GATE 1: thieu duong dung lai figures", "go khong ve lai")

# 4 nhanh do con lai cua check() — moi nhanh mot dot bien (khong de nhanh nao
# chua tung do: bat bien CLAUDE.md «pha thu mot lan cho moi phep do moi»)
expect(mutate(live, lambda b: b.replace("MỘT lần", "vài lần")), "GATE 1: thieu gioi han ve lai mot lan", "go MOT lan")
expect(mutate(live, lambda b: b.replace("0 điểm vượt", "không có gì")), "GATE 1: thieu dong 0-diem-vuot", "go 0 diem vuot")
expect(mutate(live, lambda b: b.replace("[2] Đếm", "[2] Đo")), M["nhan"].format("[2] Đếm"), "go nhan [2] Dem")
m_head = live.replace(HEAD, "### Hình minh hoạ", 1)
expect(m_head, "GATE 1: thieu khoi Hinh tai diem quyet dinh", "doi ten heading khoi")

# Ma tran phai TOAN PHAN: MOI thong diep check() co the phat (bang M, khoa
# template no ra theo SOURCES / nhan da go) phai tung DO it nhat mot lan.
EXPECTED = {v for k, v in M.items() if k not in ("nguon", "nhan")}
EXPECTED |= {M["nguon"].format(s) for s in SOURCES}
EXPECTED |= {M["nhan"].format("[2] Đếm")}
missing = EXPECTED - FIRED
assert not missing, f"ma tran chua toan phan — thong diep chua tung do: {sorted(missing)}"

# Doi chung: check THAT cua P90 (clause.strip() co mat bat ky dau trong file, khong
# norm) van XANH tren dot bien xoa-clause-khoi-khoi — chung minh P197 neo vao khoi.
CLAUSE_P90 = _m.group(1).strip()
def p90_check(t):
    return [] if CLAUSE_P90 in t else [f"{LOOP}: cau ve hinh lech khuon mot-nguon"]
assert p90_check(live) == [], "P90 check phai xanh tren ban nguyen ven"
assert p90_check(m_clause) == [], "P90-kieu phai van xanh tren dot bien xoa-clause-khoi-khoi — neu do thi P197 khong them gi moi"
assert p90_check(live.replace(CLAUSE_P90, "x")) != [], "p90_check khong bao gio do — doi chung am chet"
print(f"P197 OK: doi chung duong + {MUTS} dot bien chay that, moi cai ghim dung thong diep")
PY
```

- [ ] **Step 2: Chạy riêng** `ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh` → PASS + dòng «P197 OK».

- [ ] **Step 3: Phá thử một lần thật ngoài case** (nghi thức kiểm nhanh CLAUDE.md): tạm xoá dòng clause trong khối GATE 1 của bản làm việc (`sed`), chạy lại → FAIL với «GATE 1: cau ve hinh lech khuon mot-nguon», rồi `git checkout -- feature-loop/skills/feature-loop/SKILL.md`.

- [ ] **Step 4: Toàn suite** `bash tests/plugins/run-tests.sh` → all passed.

- [ ] **Step 5: Commit** `git add tests/plugins/run-tests.sh && git commit -m "test(hinh-tai-cong-1): P197 — khối Hình tại điểm quyết định neo vào GATE 1, ma trận đột biến ghim thông điệp"`.

### Task 3: Sổ + evals khớp đơn vị đo

- [ ] **Step 1:** Sửa `expected` của E4/E6 trong `_acceptance/hinh-tai-cong-1/evals.yaml`: «tách khối thành câu (theo dấu chấm/xuống dòng đôi)» → «tách khối thành đơn vị đoạn/bullet (xuống dòng trước `- ` hoặc dòng trống)» — đúng đơn vị P197 dùng.
- [ ] **Step 2:** Set contract `status: implemented`; commit `chore(hinh-tai-cong-1): implemented — S3 xong`.
