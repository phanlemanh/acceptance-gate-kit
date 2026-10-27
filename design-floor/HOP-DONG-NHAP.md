# Hợp đồng nhập — mã Design OS mà design-floor sẽ vendor

**Bước 1 của design-floor.** Tệp này là nguồn DUY NHẤT cho điều kit đòi ở mã upstream trước khi
chép một dòng nào vào kit: năm lệnh, đầu vào, phán quyết và mã thoát, «không bút, không mạng», rào
đóng kín. Khối máy ở cuối tệp là bên viết; bộ đo `tests/design-floor/` là bên đọc duy nhất. Văn xuôi
giải thích, khối máy quyết — hai chỗ lệch nhau thì khối máy đúng và văn xuôi phải sửa.

Từ bước 2 mã đã **vendor** vào kit: `design-floor/vendor/design-os/` là bản ghim cộng đúng các bản vá cục bộ
ghi ở sổ `design-floor/LOCAL-PATCHES.md`; vỏ `design-floor/vo/ui.ts` của kit đăng ký năm lệnh; bản gói
`design-floor/dist/ui.mjs` là vật giao đi. Bộ đo chạy ngoại tuyến trên bản vendored và chấm chính bản gói;
`tests/design-floor/dong-bo.mjs` là đường duy nhất lấy bản ghim qua mạng (đổi ghim, đổi bản vá).

Hồ sơ: `_acceptance/design-floor-hop-dong-nhap/` (bước 1) · `_acceptance/design-floor-vendor-va-ban-va-a/` (bước 2a: vendor + bản vá A).

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

**Vì sao không ghim gói npm `ease-design@0.6.1`.** Gói 0.6.1 dựng từ `cb6ae7b` (trường `gitHead` của
registry), mà `ui reuse-plan check` chỉ vào upstream ở `13b4454` (#349, 2026-10-22) — sau bản phát
hành. Ghim npm thì một trong năm lệnh v1 không tồn tại. Gói npm còn chỉ có `dist/` gói một tệp, nên
không đo được đóng kín. Commit `a7ad5f1` = `13b4454` + một commit chỉ chạm test; `src/` hai commit
giống hệt nhau.

**Bản sao `~/dev/designos` trên máy không phải bản ghim.** Đo 2026-10-26: `src/` của nó khớp
`13b4454` trừ hai tệp đã sửa tay (`src/commands/onboard.ts`, `src/core/ds-diff-format.ts`), và
`knowledge/` lệch. Bộ đo không bao giờ đọc nó; nguồn duy nhất là commit trên.

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
KHÔNG-ĐO-ĐƯỢC), để một kho có MỘT bảng mã cho cả hai cổng thiết kế (bản vendored dùng mã 1 cho lỗi nội bộ). Mã khác 0/2/3/4/5 là lỗi nội bộ,
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
bị bỏ như lúc chạy). FN-02…04 đo trên **hợp** đóng kín GIAO ĐI — vỏ + năm lệnh trên bản vendored đã vá:

- **FN-01** — `design-floor/upstream.lock.json` (sinh bằng `rao-dong.mjs --write` trên bản ghim) khớp phép đo
  lại trên bản vendored ĐÃ ĐẢO mọi bản vá: ghim, danh sách tệp, băm sha256 upstream từng tệp, số dòng, lệnh
  nào kéo tệp nào. Tệp khoá là **danh sách chép**: năm lệnh + phần vỏ kéo thêm (`lenh.vo` — `cli-args.ts`,
  `command-signatures.ts`), 126 tệp, mỗi tệp kèm băm.
- **VA-01** — bản vendored bằng tệp khoá + sổ vá: tệp ngoài sổ mang đúng băm tệp khoá; tệp vá mang băm `sau`
  của dòng sổ đã áp. Một byte lệch ở đâu thì đỏ đúng tệp đó.
- **BG-01** — bản gói dựng lại từ vỏ + bản vendored (esbuild và gói npm ghim ở `tests/design-floor`) bằng
  từng byte tệp đã commit, ở chỗ checkout hiện tại lẫn ở một đường khác.
- **FN-02** — không tệp nào khớp danh sách cấm (`memory-*`, `figma-*`, `src/adapters/`, `init*`).
- **FN-03** — không import mạng của node, không token gọi mạng trong mã đã bỏ chú thích.
- **FN-04** — hợp đóng kín không vượt trần. Đổi ghim mà đóng kín phình là một quyết định phải nhìn
  thấy: nâng trần ở khối máy, trong cùng PR đổi ghim.
  Bước 2a nâng trần dòng 18 500 → 18 900 (hồ sơ design-floor-vendor-va-ban-va-a, giám sát đồng ý 27/10): đóng
  kín giao đi 117 tệp · 18 825 dòng — phần vượt là vỏ của kit kéo `cli-args.ts` + `command-signatures.ts`
  (1 542 dòng); ghim không đổi.

Hình dạng này cố ý trùng ô `lop-vendored-tu-xung` (tệp khai phiên bản kèm băm từng tệp · một danh sách
chép · một lệnh kiểm trong CI): khi ô đó dựng định dạng tệp khai cho kit→kho, `upstream.lock.json` là
ca thứ hai của cùng định dạng chứ không phải một định dạng song song.

## 8. Phép đo

Mọi phép đo có đối chứng; đối chứng hỏng là FAIL bất kể giới hạn đã khai. Fixture do mã sinh trong
lượt chạy; mỗi phép đo một hộp cát gồm dự án, một `design/` ở thư mục cha, và HOME riêng.

| ID | Đòi gì | Đối chứng (chứng phép đo đỏ được) |
|---|---|---|
| DF-01 | `.eyebrow{color:#888}` trên nền không khai → gate thoát 5 | cùng trang, nền trắng khai rõ → gate ra `low-contrast` 3,54:1 và thoát 2 (FAIL thắng 5) |
| DF-02 | DS mồi ở thư mục cha không đổi stdout/mã thoát của lời gọi theo hợp đồng (bốn lệnh chấm) | trỏ `--tokens` tường minh vào token của mồi thì kết quả gate KHÁC (mồi có nội dung đổi được kết quả); đột biến argv trỏ vào mồi thì DF-02 đỏ |
| DF-03 | thiếu `--tokens` hoặc `--file` → thoát 4 | (ca đỏ của chính nó: hôm nay tự dò) |
| DF-04 | thiếu tệp · đối số lạ · có lỗi → 3 / 4 / 2 ở bốn lệnh chấm | ca «có lỗi» phải thật sự có lỗi trong JSON |
| DF-05 | `.tsx` → gate và token-coverage thoát 5, không bao giờ 0 | cùng nội dung đuôi `.html` → gate PASS |
| DF-06 | trang không CSS → token-coverage thoát 5 | trang có hex thô → token-coverage thấy giá trị thô |
| DF-07 | danh sách thư mục + băm của cả hộp cát giống hệt sau mỗi lệnh v1 (autofix không `--write`) | phép chụp thấy một tệp cài vào |
| DF-08 | `autofix --write` chỉ đổi tệp đích | đích phải thật sự được sửa |
| DF-09 | không lệnh nào (kể cả `autofix --write`) chạm đường mạng | bộ chặn bắt `fetch`, `net`, `dns` của một tiến trình thử |
| FN-01…04 · VA-01 · BG-01 | §7 | `tests/design-floor/tu-thu.mjs`: đối chứng dương trên một bản sao bố cục kit, rồi đột biến trên bản sao hợp đồng, tệp khoá, sổ vá, bản vendored, tệp diff và bản gói — mỗi đột biến phải thoát đúng mã kèm đúng thông điệp |

Trên bản gói giao đi mọi phép đo XANH nhờ bốn bản vá của sổ LOCAL-PATCHES: A (DF-07, DF-08, 17 cặp của FN-02), B
(DF-01, DF-04, DF-05, DF-06), C (DF-03), D (3 cặp figma của FN-02); khối máy không còn giới hạn nào. Bỏ một bản vá khỏi
một bản sao rồi dựng lại thì đúng tập phép đo của nó đỏ lại (đột biến nhãn BO-VA của `tu-thu.mjs`; bỏ B làm DF-03 đỏ theo
vì C trả mã 4 qua bảng mã của B). Chế độ chữ (không `--json`) chưa theo bảng: thiếu tệp và thiếu đầu vào bắt buộc trả 1.

**Giới hạn đã khai là xfail CHẶT.** Một phép đo có trong `gioi_han` mà đỏ đúng chữ ký thì XFAIL (CI
xanh); đỏ sai chữ ký thì FAIL (đỏ vì lý do khác — phân loại lại); XANH thì cũng FAIL (XPASS: bản vá đã
sửa, gỡ giới hạn để phép đo canh lại). **Mỗi giới hạn phải có đường ra:** `can_upstream` (sửa đổi nó chờ)
và `ban_va` — mã một dòng `cho-va` của sổ `design-floor/LOCAL-PATCHES.md`. Kit không gửi PR upstream (chủ
kho 26/10), nên đường ra là một bản vá cục bộ có tên. Thiếu một trong hai, `ban_va` trỏ mã không có trong
sổ, hay trỏ một bản vá đã áp (bản vá đã áp mà giới hạn còn sống = bản vá không giữ lời) đều là FAIL.

## 9. Chạy

```bash
npm ci --prefix tests/design-floor && bash tests/design-floor/run-tests.sh
```

Chạy ngoại tuyến trên bản vendored; CI đặt `DESIGN_FLOOR_KHONG_MANG=1` để chứng điều đó (job `design-floor`
trong `.github/workflows/gate.yml`). Đổi ghim hay đổi bản vá: sửa tệp khoá (`rao-dong.mjs --write`, lấy bản
ghim về `$TMPDIR/design-floor-upstream/<commit>`, đổi bằng `DESIGN_FLOOR_CACHE`) hoặc tệp diff + dòng sổ, rồi
`node tests/design-floor/dong-bo.mjs --write`; `--kiem` dựng lại trong thư mục tạm và so từng byte. Chi phí: 0
token; đo trên máy dev 2026-10-27: rào ~2 s, bộ đo ~3 s, chiều đỏ ~20 s; CI thêm `npm ci`.

## 10. Phép thử North Star

- **Không ghi gì sau S4** — chính là §6 + DF-07/DF-08, XANH trên bản gói nhờ bản vá A. `ui gate` vẫn chưa
  móc vào S4: đó là mục chờ FL-C1 của lộ trình, mở khi một vòng thật ở kho tiêu thụ chứng không tệp nào đổi
  sau commit S4.
- **Không thêm lượt gọi người** — hợp đồng nhập không thêm cổng, không thêm dòng thẻ.
- **Chi phí máy mỗi kết quả gộp** — 0 token; ~1 phút CI mỗi PR chạm kit.
- **Mọi phép kiểm có chiều đỏ** — đối chứng trong từng phép đo + đột biến của `tu-thu.mjs`; chín phép đo hành vi
  và FN-02 từng ĐỎ thật trên bản ghim, và đột biến bỏ-từng-bản-vá dựng lại đúng màu đỏ ấy trên bản sao.

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
    "lay_ve": [
      "/src/",
      "/knowledge/",
      "/schemas/",
      "/package.json",
      "/package-lock.json",
      "/LICENSE",
      "/a11y/package.json",
      "/recall/package.json"
    ]
  },
  "vendor": {
    "goc": "design-floor/vendor/design-os",
    "vo": "design-floor/vo/ui.ts",
    "ban_goi": "design-floor/dist/ui.mjs",
    "so_va": "design-floor/LOCAL-PATCHES.md"
  },
  "ma_thoat": {
    "PASS": 0,
    "FAIL": 2,
    "THIEU_TEP": 3,
    "SAI_CU_PHAP": 4,
    "NOT_MEASURABLE": 5
  },
  "moi_truong": {},
  "lenh": {
    "gate": {
      "entry": "src/commands/gate.ts",
      "vai": "cham",
      "argv": [
        "gate",
        "{dich}",
        "--tokens",
        "{tokens}",
        "--json"
      ]
    },
    "token-coverage": {
      "entry": "src/commands/token-coverage.ts",
      "vai": "cham",
      "argv": [
        "token-coverage",
        "{dich}",
        "--tokens",
        "{tokens}",
        "--json"
      ]
    },
    "reuse-plan check": {
      "entry": "src/commands/reuse-plan.ts",
      "vai": "cham",
      "argv": [
        "reuse-plan",
        "check",
        "{dich}",
        "--file",
        "{registry}",
        "--tokens",
        "{tokens}",
        "--json"
      ]
    },
    "flow lint": {
      "entry": "src/commands/flow.ts",
      "vai": "cham",
      "argv": [
        "flow",
        "lint",
        "{dich}",
        "--json"
      ]
    },
    "autofix": {
      "entry": "src/commands/autofix.ts",
      "vai": "dung",
      "buoc": "S3",
      "argv": [
        "autofix",
        "{dich}",
        "--json"
      ],
      "argv_ghi": [
        "autofix",
        "{dich}",
        "--write",
        "--json"
      ]
    }
  },
  "rao": {
    "cam": [
      {
        "ten": "memory-*",
        "re": "(^|/)memory-[^/]*\\.ts$"
      },
      {
        "ten": "figma-*",
        "re": "(^|/)figma-[^/]*\\.ts$"
      },
      {
        "ten": "adapters/",
        "re": "^src/adapters/"
      },
      {
        "ten": "init",
        "re": "(^|/)init[^/]*\\.ts$"
      }
    ],
    "cam_mang": [
      "node:http",
      "node:https",
      "node:http2",
      "node:net",
      "node:tls",
      "node:dns",
      "node:dgram",
      "http",
      "https",
      "http2",
      "net",
      "tls",
      "dns",
      "dgram",
      "undici",
      "ws",
      "node-fetch",
      "axios"
    ],
    "cam_token_mang": [
      "(^|[^\\w.$])fetch\\s*\\(",
      "\\bnew\\s+WebSocket\\b",
      "\\bXMLHttpRequest\\b",
      "\\bEventSource\\b"
    ],
    "tran": {
      "tep": 124,
      "dong": 18900
    }
  },
  "gioi_han": []
}
```
<!-- DESIGN-FLOOR-HOP-DONG>>> -->
