# Hợp đồng nhập — mã Design OS mà design-floor sẽ vendor

**Bước 1 của design-floor.** Tệp này là nguồn DUY NHẤT cho điều kit đòi ở mã upstream trước khi
chép một dòng nào vào kit: năm lệnh, đầu vào, phán quyết và mã thoát, «không bút, không mạng», rào
đóng kín. Khối máy ở cuối tệp là bên viết; bộ đo `tests/design-floor/` là bên đọc duy nhất. Văn xuôi
giải thích, khối máy quyết — hai chỗ lệch nhau thì khối máy đúng và văn xuôi phải sửa.

Bước 1 **chưa vendor gì**: bộ đo lấy bản upstream đã ghim về cache (sparse, depth 1, ~2 s), dựng
`ui` từ nguồn và chấm nó. Bước 2 (vendor + móc vào vòng) đổi đúng một hàm — `chuanBiNguon` trong
`tests/design-floor/lib/upstream.mjs` — sang bản vendored; mọi phép đo ở đây giữ nguyên.

Hồ sơ: `_acceptance/design-floor-hop-dong-nhap/`.

## 1. Vì sao kit cần hợp đồng này

Kit hôm nay không chấm sự tuân thủ design system: `lib/p-tiers.json` cố ý xếp `design-system-color`,
`design-system-font`, `design-system-radius` vào `drop`, và engine static của `scripts/design-gate.mjs`
không tính màu. design-floor lấp chỗ đó bằng mã của Design OS. Mã bên thứ ba **chấm** thay người thì
kit phải giữ hai thứ: lời hứa nó được phép làm gì, và một bộ đo đỏ lên khi nó làm khác. Không có hai
thứ đó, một lần nâng upstream có thể đổi phán quyết dưới chân mọi kho mà không ai thấy.

## 2. Nguồn ghim

| | |
|---|---|
| Kho | `https://github.com/jangtrinh/design-os` (công khai) |
| Commit | `a7ad5f1e650321ac325734e9199f266c9b990212` — đỉnh `main` ngày 2026-10-22 |
| Phiên bản gói trong `package.json` | `0.6.1` (chuỗi chưa nâng; xem dưới) |
| Giấy phép | PolyForm Shield 1.0.0 (từ commit `cb6ae7b`, 2026-10-20) |

**Vì sao không ghim gói npm `ease-design@0.6.1`.** Gói 0.6.1 dựng từ `cb6ae7b` (trường `gitHead` của
registry), mà `ui reuse-plan check` chỉ vào upstream ở `13b4454` (#349, 2026-10-22) — sau bản phát
hành. Ghim npm thì một trong năm lệnh v1 không tồn tại. Gói npm còn chỉ có `dist/` gói một tệp, nên
không đo được đóng kín. Commit `a7ad5f1` = `13b4454` + một commit chỉ chạm test; `src/` hai commit
giống hệt nhau.

**Bản sao `~/dev/designos` trên máy không phải bản ghim.** Đo 2026-10-26: `src/` của nó khớp
`13b4454` trừ hai tệp đã sửa tay (`src/commands/onboard.ts`, `src/core/ds-diff-format.ts`), và
`knowledge/` lệch. Bộ đo không bao giờ đọc nó; nguồn duy nhất là commit trên.

**Giấy phép là điều kiện của bước 2, không phải của bước 1.** Bước 1 không phân phối mã upstream (chỉ
lấy về cache lúc chạy). Bước 2 chép mã vào kit — tức là phân phối dưới PolyForm Shield, giấy phép
cấm dùng để cung cấp sản phẩm cạnh tranh với phần mềm gốc. Đó là quyết định khó đảo của chủ kit; bộ
đo này không trả lời được nó.

## 3. Năm lệnh v1

| Lệnh | Vai | Đích | Đầu vào bắt buộc | Bước |
|---|---|---|---|---|
| `ui gate` | chấm | `.html` | `--tokens` | S4 (và kiểm sàn ở S3) |
| `ui token-coverage` | chấm | `.html` | `--tokens` | S4 |
| `ui reuse-plan check` | chấm | bản kế hoạch `.md` | `--file` (registry) · `--tokens` | Cổng 1 |
| `ui flow lint` | chấm | `flow.json` | — | Cổng 1 |
| `ui autofix` | **dựng** | `.html` | — | **chỉ S3** |

`ui autofix` là công cụ của người dựng, chạy ở S3, và là lệnh DUY NHẤT được ghi — chỉ khi có
`--write`, và chỉ vào đúng tệp đích. Không lệnh nào khác trong upstream vào design-floor ở v1.

## 4. Đầu vào: tường minh, không tự dò

- Mỗi lần gọi nhận **một tệp đích tường minh** và, với lệnh có cột «đầu vào bắt buộc», đúng các cờ đó
  trỏ tới tệp tường minh.
- **Không bao giờ tự dò design system** bằng cách đi ngược thư mục cha — kể cả khi `--tokens` vắng.
  Vắng một đầu vào bắt buộc là **sai cú pháp** (mã 4), không phải «dò hộ». Vì sao: kho tiêu thụ thường
  có một `design/` ở gốc kho hoặc ở thư mục cha của worktree; dò ngược thì phán quyết phụ thuộc vào
  chỗ checkout nằm, không phụ thuộc vào vật.

## 5. Phán quyết ba trạng thái và mã thoát

| Mã | Nghĩa | Ghi chú |
|---|---|---|
| 0 | PASS | mọi phép kiểm đã CHẠY và không có lỗi mức `error` |
| 2 | FAIL | ít nhất một lỗi mức `error` — cùng nghĩa REJECT của `design-gate.mjs` |
| 3 | thiếu tệp | một tệp đầu vào được nêu tên không tồn tại hoặc không đọc được |
| 4 | sai cú pháp | đối số lạ, thiếu đầu vào bắt buộc, giá trị ngoài miền |
| 5 | KHÔNG-ĐO-ĐƯỢC | không có lỗi thấy được, nhưng ít nhất một phép kiểm không tính được |

Bộ mã mượn đúng từ `scripts/design-gate.mjs` (0 PASS · 2 REJECT · 3 BLOCKED · 4 sai cú pháp · 5
KHÔNG-ĐO-ĐƯỢC), để một kho có MỘT bảng mã cho cả hai cổng thiết kế. Mã khác 0/2/3/4/5 là lỗi nội bộ,
không bao giờ được đọc như một phán quyết.

**Thứ tự ưu tiên:** FAIL > KHÔNG-ĐO-ĐƯỢC > PASS — lỗi thấy được không bị nuốt thành «không đo được».

**KHÔNG-ĐO-ĐƯỢC** khi có một trong ba:
1. một phép kiểm không tính được (vd. tương phản khi màu nền không suy ra được);
2. đích không phải loại lệnh đọc được (vd. `.tsx` đưa cho lệnh đọc HTML) — chữ trong JSX không phải
   HTML đã dựng, nên «không thấy lỗi» không có nghĩa «sạch»;
3. không có gì để đo (vd. trang không có một khai báo CSS nào cho `token-coverage`).

Vì sao một trạng thái riêng: một eval gọi `ui gate … || exit 1` thì «đo không được» thoát 0 là màu
xanh rỗng — chiều đỏ không bao giờ đỏ. Kho crm đã trả giá đúng lớp này với `design-gate.mjs` (hồ sơ
`design-gate-che-do-chat`).

## 6. Không bút, không mạng

- **Lệnh chấm không ghi tệp nào** — không trong dự án, không ở thư mục cha, không ở HOME. Danh sách
  thư mục (kèm băm từng tệp) trước và sau một lượt chấm phải giống hệt.
- **Không lệnh v1 nào gọi mạng.**
- `ui autofix --write` ghi đúng tệp đích, không gì khác.

Vì sao: mọi thứ ghi sau S4 làm hồ sơ cũ và chặn gộp (ADR 0007, luật cũ hoá của
`scripts/pre-merge-check.sh`). Một bộ chấm tự ghi sổ thì mỗi lượt chấm sinh ra chính thứ làm nó phải
chấm lại. Upstream hiện có «đường dẫn nhiên liệu» (`src/core/memory-autorecord.ts`, spec 006): mỗi
lệnh mang kết quả nối một sự kiện vào `design/memory.events.jsonl` của thư mục `design/` gần nhất đi
ngược từ đích, không có cờ tắt.

## 7. Rào đóng kín

Đóng kín của một lệnh = mọi tệp `src/` mà esbuild kéo theo từ module lệnh đó (metafile; import chỉ-kiểu
bị bỏ như lúc chạy). Rào giữ bốn luật trên **hợp** đóng kín của năm lệnh:

- **FN-01** — `design-floor/upstream.lock.json` (sinh bằng `rao-dong.mjs --write`) khớp phép đo lại: ghim,
  danh sách tệp, băm sha256 từng tệp, số dòng, lệnh nào kéo tệp nào. Tệp khoá là **danh sách chép** của
  bước 2: đúng các tệp đó vào kit, mỗi tệp kèm băm.
- **FN-02** — không tệp nào khớp danh sách cấm (`memory-*`, `figma-*`, `src/adapters/`, `init*`).
- **FN-03** — không import mạng của node, không token gọi mạng trong mã đã bỏ chú thích.
- **FN-04** — hợp đóng kín không vượt trần. Đổi ghim mà đóng kín phình là một quyết định phải nhìn
  thấy: nâng trần ở khối máy, trong cùng PR đổi ghim.

Hình dạng này cố ý trùng ô `lop-vendored-tu-xung` (tệp khai phiên bản kèm băm từng tệp · một danh sách
chép · một lệnh kiểm trong CI): khi ô đó dựng định dạng tệp khai cho kit→kho, `upstream.lock.json` là
ca thứ hai của cùng định dạng chứ không phải một định dạng song song.

## 8. Phép đo

Mọi phép đo có đối chứng; đối chứng hỏng là FAIL bất kể giới hạn đã khai. Fixture do mã sinh trong
lượt chạy; mỗi phép đo một hộp cát gồm dự án, một `design/` ở thư mục cha, và HOME riêng.

| ID | Đòi gì | Đối chứng (chứng phép đo đỏ được) |
|---|---|---|
| DF-01 | `.eyebrow{color:#888}` trên nền không khai → gate thoát 5 | cùng trang, nền trắng khai rõ → gate ra `low-contrast` 3,54:1 |
| DF-02 | DS mồi ở thư mục cha không đổi stdout/mã thoát của lời gọi theo hợp đồng (bốn lệnh chấm) | không `--tokens`, gate dò ra đúng mồi (`origin: auto`); đột biến TT-10 bỏ `--tokens` khỏi argv thì DF-02 đỏ |
| DF-03 | thiếu `--tokens` hoặc `--file` → thoát 4 | (ca đỏ của chính nó: hôm nay tự dò) |
| DF-04 | thiếu tệp · đối số lạ · có lỗi → 3 / 4 / 2 ở bốn lệnh chấm | ca «có lỗi» phải thật sự có lỗi trong JSON |
| DF-05 | `.tsx` → gate và token-coverage thoát 5, không bao giờ 0 | cùng nội dung đuôi `.html` → gate PASS |
| DF-06 | trang không CSS → token-coverage thoát 5 | trang có hex thô → token-coverage thấy giá trị thô |
| DF-07 | danh sách thư mục + băm của cả hộp cát giống hệt sau mỗi lệnh v1 (autofix không `--write`) | phép chụp thấy một tệp cài vào |
| DF-08 | `autofix --write` chỉ đổi tệp đích | đích phải thật sự được sửa |
| DF-09 | không lệnh nào (kể cả `autofix --write`) chạm đường mạng | bộ chặn bắt `fetch`, `net`, `dns` của một tiến trình thử |
| FN-01…04 | §7 | `tests/design-floor/tu-thu.mjs`: hai đối chứng dương + mười hai đột biến trên bản sao hợp đồng/tệp khoá, mỗi đột biến phải thoát 1 kèm đúng thông điệp |

**Giới hạn đã khai là xfail CHẶT.** Một phép đo có trong `gioi_han` mà đỏ đúng chữ ký thì XFAIL (CI
xanh); đỏ sai chữ ký thì FAIL (đỏ vì lý do khác — phân loại lại); XANH thì cũng FAIL (XPASS: upstream
đã sửa, gỡ giới hạn để phép đo canh lại). Mỗi giới hạn phải mang sửa đổi upstream nó chờ và PR của
sửa đổi đó; thiếu một trong hai là FAIL.

## 9. Chạy

```bash
npm ci --prefix tests/design-floor && bash tests/design-floor/run-tests.sh
```

Cache upstream mặc định ở `$TMPDIR/design-floor-upstream/<commit>` (đổi bằng `DESIGN_FLOOR_CACHE`).
CI chạy job `design-floor` trong `.github/workflows/gate.yml`. Chi phí: 0 token; đo trên máy dev
2026-10-26: rào ~1 s, bộ đo ~3 s, chiều đỏ ~10 s sau khi cache có; CI thêm lấy nguồn + `npm ci`.

## 10. Phép thử North Star

- **Không ghi gì sau S4** — chính là §6 + DF-07/DF-08; hôm nay đỏ ở gate và autofix, nên design-floor
  không được móc `ui gate` vào S4 trước khi DF-07 XANH (hoặc kit gọi nó trong một bản sao bỏ đi).
- **Không thêm lượt gọi người** — bước 1 không thêm cổng, không thêm dòng thẻ.
- **Chi phí máy mỗi kết quả gộp** — 0 token; ~1 phút CI mỗi PR chạm kit.
- **Mọi phép kiểm có chiều đỏ** — đối chứng trong từng phép đo + mười hai đột biến của `tu-thu.mjs`;
  bảy phép đo hành vi và FN-02 hôm nay ĐỎ thật (XFAIL), nên chiều đỏ của chúng đã chạy trên upstream.

## 11. Khối máy

<!-- <<<DESIGN-FLOOR-HOP-DONG -->
```json
{
  "schema": 1,
  "nguon": {
    "repo": "https://github.com/jangtrinh/design-os",
    "commit": "a7ad5f1e650321ac325734e9199f266c9b990212",
    "ngay_commit": "2026-10-22",
    "phien_ban_goi": "0.6.1",
    "giay_phep": "PolyForm-Shield-1.0.0",
    "lay_ve": ["/src/", "/knowledge/", "/schemas/", "/package.json", "/package-lock.json", "/LICENSE", "/a11y/package.json", "/recall/package.json"]
  },
  "ma_thoat": { "PASS": 0, "FAIL": 2, "THIEU_TEP": 3, "SAI_CU_PHAP": 4, "NOT_MEASURABLE": 5 },
  "moi_truong": {},
  "lenh": {
    "gate": { "entry": "src/commands/gate.ts", "vai": "cham", "argv": ["gate", "{dich}", "--tokens", "{tokens}", "--json"] },
    "token-coverage": { "entry": "src/commands/token-coverage.ts", "vai": "cham", "argv": ["token-coverage", "{dich}", "--tokens", "{tokens}", "--json"] },
    "reuse-plan check": { "entry": "src/commands/reuse-plan.ts", "vai": "cham", "argv": ["reuse-plan", "check", "{dich}", "--file", "{registry}", "--tokens", "{tokens}", "--json"] },
    "flow lint": { "entry": "src/commands/flow.ts", "vai": "cham", "argv": ["flow", "lint", "{dich}", "--json"] },
    "autofix": { "entry": "src/commands/autofix.ts", "vai": "dung", "buoc": "S3", "argv": ["autofix", "{dich}", "--json"], "argv_ghi": ["autofix", "{dich}", "--write", "--json"] }
  },
  "rao": {
    "cam": [
      { "ten": "memory-*", "re": "(^|/)memory-[^/]*\\.ts$" },
      { "ten": "figma-*", "re": "(^|/)figma-[^/]*\\.ts$" },
      { "ten": "adapters/", "re": "^src/adapters/" },
      { "ten": "init", "re": "(^|/)init[^/]*\\.ts$" }
    ],
    "cam_mang": ["node:http", "node:https", "node:http2", "node:net", "node:tls", "node:dns", "node:dgram", "http", "https", "http2", "net", "tls", "dns", "dgram", "undici", "ws", "node-fetch", "axios"],
    "cam_token_mang": ["(^|[^\\w.$])fetch\\s*\\(", "\\bnew\\s+WebSocket\\b", "\\bXMLHttpRequest\\b", "\\bEventSource\\b"],
    "tran": { "tep": 124, "dong": 18500 }
  },
  "gioi_han": [
    {
      "id": "DF-01",
      "chu_ky_do": "^gate thoát 0 \\(muốn 5\\) · pass=true · partial=1$",
      "can_upstream": "src/core/gate.ts:165 `pass = errorCount === 0` bỏ qua `partial`: một phép kiểm NOT COMPUTABLE mà không có lỗi phải là KHÔNG-ĐO-ĐƯỢC (thoát 5), không phải pass",
      "pr_upstream": "chưa mở — nhóm B «mã thoát ba trạng thái»"
    },
    {
      "id": "DF-03",
      "chu_ky_do": "^gate -tokens=1 · token-coverage -tokens=1 · reuse-plan check -tokens=1 · reuse-plan check -file=2 \\(muốn 4\\)$",
      "can_upstream": "một cách tắt tự dò (cờ hoặc biến môi trường): vắng --tokens hôm nay đi ngược tới 5 cấp tìm design/ds.manifest.json (src/core/design-system.ts discoverDesignSystem), vắng --file đọc <cwd>/design/component-registry.json; kit ghi cờ đó vào argv/moi_truong của khối máy",
      "pr_upstream": "chưa mở — nhóm C «đầu vào tường minh»"
    },
    {
      "id": "DF-04",
      "chu_ky_do": "^gate 1/1/1 · token-coverage 1/1/1 · reuse-plan check 2/1/1 · flow lint 1/1/1 \\(muốn 3/4/2\\)$",
      "can_upstream": "mã thoát theo lớp (FAIL 2 · thiếu tệp 3 · sai cú pháp 4 · KHÔNG-ĐO-ĐƯỢC 5), có thể bật bằng cờ; lỗi nội bộ rời khỏi mã 2 (src/core/output.ts:116 — hôm nay reuse-plan check thiếu tệp ra 2 = lỗi nội bộ, trùng mã FAIL)",
      "pr_upstream": "chưa mở — nhóm B «mã thoát ba trạng thái»"
    },
    {
      "id": "DF-05",
      "chu_ky_do": "^gate \\.tsx thoát 0 · token-coverage \\.tsx thoát 0 \\(muốn 5\\)$",
      "can_upstream": "lệnh đọc HTML trả KHÔNG-ĐO-ĐƯỢC cho đích không phải .html/.htm thay vì đọc JSX như HTML (một layout .tsx có <html lang><title> hôm nay PASS)",
      "pr_upstream": "chưa mở — nhóm B «mã thoát ba trạng thái»"
    },
    {
      "id": "DF-06",
      "chu_ky_do": "^token-coverage trang không CSS thoát 0 \\(muốn 5\\) · coverage=1$",
      "can_upstream": "token-coverage: 0 khai báo được chấm ở mọi nhóm → KHÔNG-ĐO-ĐƯỢC, không phải coverage 1 («a category with nothing to fail on reports coverage 1»)",
      "pr_upstream": "chưa mở — nhóm B «mã thoát ba trạng thái»"
    },
    {
      "id": "DF-07",
      "chu_ky_do": "^gate: \\+outer/design/memory\\.events\\.count\\.json \\+outer/design/memory\\.events\\.jsonl$",
      "can_upstream": "tắt được đường nhiên liệu cho lượt chấm (src/core/memory-autorecord.ts withOutcome, gọi ở src/commands/gate.ts:18/387): hôm nay mỗi lượt gate nối sự kiện vào design/ gần nhất đi ngược từ đích — kể cả design/ của thư mục cha",
      "pr_upstream": "chưa mở — nhóm A «bộ chấm không bút»"
    },
    {
      "id": "DF-08",
      "chu_ky_do": "^ngoài đích: \\+outer/design/memory\\.events\\.count\\.json \\+outer/design/memory\\.events\\.jsonl$",
      "can_upstream": "cùng sửa đổi với DF-07 cho src/commands/autofix.ts:15/137",
      "pr_upstream": "chưa mở — nhóm A «bộ chấm không bút»"
    },
    {
      "id": "FN-02",
      "vi_pham": [
        "autofix src/core/figma-ds-tokens.ts",
        "autofix src/core/memory-autorecord.ts",
        "autofix src/core/memory-error.ts",
        "autofix src/core/memory-events.ts",
        "autofix src/core/memory-graph-cache.ts",
        "autofix src/core/memory-graph.ts",
        "autofix src/core/memory-lesson-evidence.ts",
        "autofix src/core/memory-lessons.ts",
        "autofix src/core/memory-store.ts",
        "gate src/core/figma-ds-tokens.ts",
        "gate src/core/memory-autorecord.ts",
        "gate src/core/memory-error.ts",
        "gate src/core/memory-events.ts",
        "gate src/core/memory-graph-cache.ts",
        "gate src/core/memory-graph.ts",
        "gate src/core/memory-lesson-evidence.ts",
        "gate src/core/memory-lessons.ts",
        "gate src/core/memory-store.ts",
        "reuse-plan check src/core/figma-ds-tokens.ts",
        "token-coverage src/core/figma-ds-tokens.ts"
      ],
      "can_upstream": "(A) dời withOutcome khỏi module lệnh gate/autofix lên vỏ CLI → tám module memory-* rời đóng kín; (D) dời sanitizeSeg/buildTokensTree ra module trung tính → figma-ds-tokens.ts rời token-coverage, reuse-plan, gate, autofix (nó là phép biến đổi thuần, không mạng, nhưng kéo tên miền Figma vào lõi chấm)",
      "pr_upstream": "chưa mở — nhóm A + nhóm D"
    }
  ]
}
```
<!-- DESIGN-FLOOR-HOP-DONG>>> -->
