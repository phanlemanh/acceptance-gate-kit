# Design — repo khai plugin (chip A)

**Slug:** `repo-khai-plugin` · **Hạng:** T2 (chạm `scripts/` mới, `commands/acceptance-init.md`,
`GUIDE.md` §5.1, `tests/plugins/` — không chạm `hooks/` · `lib/` · pre-merge · recheck) ·
**Hạt giống:** `docs/plans/2026-08-21-hat-giong-repo-khai-plugin.md` (Cổng Đáng: owner gật
21/08, dây A → B → C).

## 1. Vấn đề

Tầng *máy* của kit (marketplace + n plugin của kit + `superpowers`; hiện n = 3, tổng 4) là tầng duy nhất chưa được repo khai. GUIDE
§5.1 là 5 lệnh gõ tay mỗi máy và tự cảnh báo «2 version = 2 chuẩn gate». Claude Code có
sẵn ổ cho việc này — `.claude/settings.json` cấp repo với `extraKnownMarketplaces` +
`enabledPlugins` (tên khoá kiểm trên settings thật của owner và một repo khác trên cùng
máy). Không repo nào của kit đang dùng.

## 2. Quyết định thiết kế

1. **Một script, không phải một đoạn chỉ dẫn.** `scripts/plugin-declare.mjs` (ESM, cùng họ
   `config-patch.mjs`) làm việc ghi; `acceptance-init` chỉ *gọi* nó. Lý do: đầu ra đo được
   bằng suite (file JSON thật), còn «chỉ dẫn bảo agent ghi JSON» thì chỉ grep được chỉ dẫn —
   đúng lớp «đo chỉ dẫn thay vì đầu ra» kit cấm.
2. **Nguồn tên plugin = `.claude-plugin/marketplace.json` ship cùng plugin.** Plugin
   `acceptance-gate` có `source: "./"` nên cache cài đặt chứa cả `.claude-plugin/` (đã kiểm
   12 phiên bản trong cache) — script đọc `../.claude-plugin/marketplace.json` suy từ vị trí
   của chính nó, **không hardcode tên**. `superpowers@claude-plugins-official` là phụ thuộc
   khai trong mô tả của `feature-loop`, thêm bằng một hằng có chú thích. Kết quả: *một chữ,
   bốn nơi* (marketplace · script · init · GUIDE) và ca kiểm giữ bốn nơi khớp.
3. **Hợp nhất JSON, không ghi đè.** Parse → set đúng các khoá của kit → giữ nguyên mọi khoá
   khác và **thứ tự khoá có sẵn** (khoá mới nối cuối) → in 2 khoảng trắng + newline cuối.
   File không parse được → **exit 3, không chạm file**. Không có `.claude/` → tạo.
4. **Mặc định dry-run, `--write` mới ghi** — cùng quy ước `config-patch.mjs`. Idempotent:
   chạy lần hai không đổi byte, in «đã khai, không đổi».
5. **Không pin phiên bản.** `enabledPlugins` bật theo tên; phiên bản theo marketplace hiện
   tại. Đồng bộ phiên bản vẫn là việc của release + `claude plugin update`. Nói thẳng trong
   GUIDE, không hứa quá.
6. **Bootstrap thành thật.** Máy *đầu tiên* của một repo vẫn phải cài `acceptance-gate` tay
   để chạy được `acceptance-init`; chỉ **máy sau** mới là «marketplace add + mở repo». GUIDE
   §5.1 viết đúng hai trường hợp đó, không gộp thành một câu đẹp mà sai.
7. **`diagram-design` bắt buộc** (owner 21/08). Dòng «tuỳ chọn, cài riêng được» bị xoá.

## 3. Giao diện

```
node scripts/plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]
  --root         gốc repo (mặc định: cwd); ghi <root>/.claude/settings.json
  --write        áp dụng; vắng → dry-run in kế hoạch, không ghi
  --list         chỉ in danh sách name@marketplace (một dòng một tên) rồi thoát 0 — cho ca parity
  --marketplace  đường tới marketplace.json (mặc định: ../.claude-plugin/marketplace.json suy từ vị trí script)
exit 0 ok/dry-run/không-đổi · 3 settings.json không parse được (không ghi) · 4 sai tham số
     HOẶC marketplace.json vắng/không đọc được (stderr nêu đường dẫn đã thử; không ghi gì)
```

Nội dung ghi (khối máy-đọc có marker trong `acceptance-init.md`):

```json
{
  "extraKnownMarketplaces": {
    "acceptance-gate-kit": { "source": { "source": "github", "repo": "phanlemanh/acceptance-gate-kit" } }
  },
  "enabledPlugins": {
    "acceptance-gate@acceptance-gate-kit": true,
    "feature-loop@acceptance-gate-kit": true,
    "diagram-design@acceptance-gate-kit": true,
    "superpowers@claude-plugins-official": true
  }
}
```

`claude-plugins-official` **không** khai trong `extraKnownMarketplaces` — marketplace mặc định.

## 4. File chạm

| File | Việc |
|---|---|
| `scripts/plugin-declare.mjs` | mới — đọc marketplace, hợp nhất, dry-run/--write/--list |
| `commands/acceptance-init.md` | bước **5b** giữa 5 và 6: gọi script với `--root <path> --write`; khối `INIT-PLUGIN-DECLARE` liệt kê 4 tên; câu in cho người «commit file này» |
| `GUIDE.md` §5.1 | **một khuôn duy nhất** — khối `GUIDE-PLUGIN-DECLARE` gồm: danh sách `- name@marketplace` (đủ n+1 dòng, một dòng một tên) + khối con `GUIDE-MAY-DAU` (đúng 1 `marketplace add` + đúng 1 `install acceptance-gate`) + khối con `GUIDE-MAY-SAU` (đúng 1 `marketplace add`, 0 `install`, «mở repo»); xoá «tuỳ chọn»; một câu «không pin phiên bản» |
| `tests/plugins/plugin-declare.test.mjs` | mới — ca PD1–PD8, fixture code-sinh trong `mkdtemp`, đường dẫn suy từ vị trí file |
| `tests/plugins/run-tests.sh` | **một** vòng `for` nối file ca (nếp lan-v: ca đặt tên theo slug, không lấy số P) |

Không chạm: `hooks/` · `lib/` · `scripts/pre-merge-check.sh` · `recheck-evidence.cjs` ·
`commands/start.md` (phiên khác đang giữ) · `_acceptance/config.yaml` (không thêm răng).

## 5. Kế hoạch đo — ma trận viết trước (mỗi ca có đối chứng dương + chiều đỏ ghim thông điệp)

| Ca | Fixture (code-sinh) | Xanh | Đỏ (phá vật trong bản sao) |
|---|---|---|---|
| PD1 | repo trống | `--write` tạo file, tập khoá == marketplace ∪ {superpowers} (n+1, không ghim số), marketplace đúng, 2 khoảng trắng, newline cuối | `--marketplace` trỏ bản sao thiếu `diagram-design` → đầu ra thiếu đúng tên đó + số đếm lệch |
| PD2 | settings có `permissions` + `worktree` + `enabledPlugins.paper-desktop@paper: true` | sau ghi: 4 tên thêm; `permissions`/`worktree`/`paper-desktop` còn nguyên; thứ tự khoá cũ giữ | bản vá «ghi đè cả file» (mô phỏng) → mất `paper-desktop` → ghim «mất khoá» |
| PD3 | file đã đúng | chạy lần hai: byte không đổi, exit 0, in «đã khai, không đổi» | — (PD3 là đối chứng của PD1) |
| PD4 | settings là JSON hỏng | exit 3, bytes giống hệt trước/sau, stderr «không đọc được — không ghi đè» | — (chiều đỏ của PD1/PD2) |
| PD5 | repo trống, **không** `--write` | không tạo file; stdout có đủ 4 tên | — |
| PD6 | bốn nơi thật: marketplace.json · `--list` · khối init · khối GUIDE | bốn tập bằng nhau | bản sao init/GUIDE gỡ một tên → đỏ nêu đúng **tên** và **nơi** thiếu |
| PD7 | GUIDE §5.1 thật | không còn «tuỳ chọn, cài riêng được»; khối máy-sau chỉ có 1 `marketplace add`; khối máy-đầu có đúng 1 `install acceptance-gate` | bản sao chèn lại dòng «tuỳ chọn» → đỏ |
| PD8 | dòng lệnh rút nguyên văn từ khối `INIT-PLUGIN-DECLARE`, thế biến, **thực thi** trong repo nháp | exit 0 + file có tập khoá == `--list` (round-trip md-viết → lệnh-chạy) | bản sao init `--write`→`--writ` → exit 4 → «lệnh trong init không chạy được» |
| PD9 | `--marketplace` trỏ chỗ không có file; và bản chép script không có `../.claude-plugin/` | exit 4, stderr nêu đường dẫn đã thử, không tạo settings.json | — (đối chứng dương: thêm marketplace hợp lệ → exit 0) |
| E10 (judgment) | `kiem-tay-harness.md` do người viết trên máy khác | đủ ngày · máy · hai câu trả lời dứt khoát | file vắng/mơ hồ → không PASS (tiền điều kiện Cổng Bằng chứng) |

Tên dòng `run` trong `run-tests.sh` cố tình không chứa «PASS: PD» (tránh đếm đôi — nếp lan-v).

## 6. Known limits (khai trước)

- **Hành vi harness** («mở repo có `enabledPlugins` → Claude Code nhắc cài/bật») nằm ngoài
  tầm đo của suite. Thay bằng **AC-10 (judgment)**: lời khai kiểm tay `kiem-tay-harness.md`
  có ngày, máy, và hai câu trả lời dứt khoát (`true` cấp repo có thắng `false` cấp user không
  · khoá kích hoạt nhắc *cài* hay chỉ *bật*) — **tiền điều kiện** của Cổng Bằng chứng.
- **Không pin phiên bản** — thiết kế, không phải lỗ.

## 7. Ngoài phạm vi

Settings cấp user · plugin ngoài bốn tên · `product-management` (plugin desktop, ổ cắm riêng)
· pin phiên bản · thay đổi quy trình release · `commands/start.md`.
