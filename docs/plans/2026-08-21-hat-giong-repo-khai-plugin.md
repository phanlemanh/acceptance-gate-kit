# Hạt giống — repo khai plugin

**Ngày:** 2026-08-21 · **Trạng thái:** hạt giống, chờ Cổng 0 · **Hạng dự kiến:**
T2 (một bước mới trong `acceptance-init` ghi một file JSON + sửa GUIDE §5.1 + hai
ca kiểm; không chạm lưới, không chạm hồ sơ, không chạm workflow).
**Sinh từ:** owner hỏi 21/08 *«đóng gói dạng gì để dùng đồng bộ trên nhiều máy và
đội ngũ?»* → phân tích ba tầng (repo · máy · ổ cắm ngoài); tầng **máy** là tầng
duy nhất chưa được repo khai. Owner gật mở hạt giống cùng ngày, kèm một chốt:
`diagram-design` là plugin **bắt buộc**, không còn «tuỳ chọn».

> Chữ trong file này là NGUỒN. Hình liên quan đã có ở tầng 2: «Kit cắm vào đâu»
> (`docs/reference/figures/kit-cam-vao-dau.html`) — thẻ marketplace ba plugin +
> thẻ superpowers; không vẽ thêm.

## 0. Tóm tắt một đoạn

Kit đồng bộ **tầng repo** rất tốt — config, 7 file CI, hồ sơ, bản đồ đều trong
git, lưới chạy không cần phiên. Nhưng **tầng máy** (marketplace + 4 plugin) vẫn
là *mỗi người tự gõ 4 lệnh* theo GUIDE §5.1, và không gì buộc hai máy cùng bộ
plugin hay cùng phiên bản — chính GUIDE đã tự cảnh báo *«hai dev chạy 2 version
kit trên cùng repo = 2 chuẩn gate khác nhau»* rồi để việc đó cho kỷ luật cá
nhân. Claude Code có sẵn ổ cho việc này: `.claude/settings.json` **cấp repo** với
`extraKnownMarketplaces` + `enabledPlugins` — file checked-in, đội viên mở repo
là harness biết phải có plugin nào. Đề xuất: `acceptance-init` ghi file đó (hợp
nhất vào file có sẵn, không ghi đè khoá khác), GUIDE §5.1 rút từ 4 lệnh còn 1,
và danh sách plugin lấy **từ `marketplace.json` của kit** — một chữ, ba nơi
(marketplace · init · GUIDE) được ca kiểm giữ. +0 skill, +0 plugin, +1 file JSON
trong repo tiêu thụ.

## 1. Lỗ — bằng chứng trên nguồn (21/08, main `a4a4065b`)

| Quan sát | Nguồn |
|---|---|
| Cài kit = 5 lệnh tay mỗi máy; `diagram-design` ghi «tuỳ chọn, cài riêng được» | `GUIDE.md` §5.1 |
| GUIDE tự nêu rủi ro «2 version = 2 chuẩn gate» và giao cho «kỷ luật cập nhật» | `GUIDE.md` §5.1 đoạn *Kỷ luật cập nhật* |
| Cả kit lẫn artifact-platform **không** khai plugin cấp repo | `.claude/settings.json`: kit không có file; artifact-platform không có khoá plugin |
| Khoá tồn tại thật và đang dùng ở cấp **user** trên máy owner: `enabledPlugins` (map `name@marketplace → bool`), `extraKnownMarketplaces` (map `name → {source:{source:"github", repo}}`) | `~/.claude/settings.json` của máy owner |
| Tiền lệ cấp **repo** trên cùng máy: một repo khác đã khai `enabledPlugins` trong `.claude/settings.json` của nó | `~/dev/crm/.claude/settings.json` |
| «Đã mới nhất» từng là lời nói dối: plugin update bỏ qua khi số trùng mà nội dung đổi | sổ nhớ phiên, mục *da-moi-nhat-la-noi-doi* |

Ba plugin của kit được khai ở **một nguồn**: `.claude-plugin/marketplace.json`
(`acceptance-gate` · `feature-loop` · `diagram-design`); `superpowers` là phụ
thuộc của `feature-loop`, lấy từ `claude-plugins-official` (marketplace mặc định,
không cần khai thêm).

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Với tầng máy nghĩa là | Hiện trạng | Kết |
|---|---|---|---|
| ② Bằng chứng không tự dối | Hai máy cùng repo phải chạy **cùng chuẩn gate** — khác bộ plugin là verifier chặn oan hoặc feature lọt eval | Phụ thuộc người nhớ gõ lệnh | **Thiếu** — đây là lỗ chính |
| ③ Khoảnh khắc quyết thật · đảo rẻ | Cài plugin không phải quyết định — là việc máy suy được từ repo | Người phải nhớ 5 lệnh, nhớ «mở phiên mới», nhớ update | **Trạm thu phí vô hình**: 5 lần gõ không mang quyết định nào |
| ① Ý định chốt trước | Repo là nơi khai «bộ công cụ của đội» | Khai ở đầu người, không ở repo | **Thiếu ô** |

Người hưởng cụ thể: **đội viên mới / máy mới** (mở repo là đủ) và **owner** (hết
nhắc từng người). Phép thử trạm-thu-phí: Claude Code nhắc bật plugin **một lần**
khi mở repo — đó là một cú gật cho thứ máy đã suy đúng, không phải cổng lặp lại.

Ba giả định dễ tự lừa đã kiểm:
- *Có pin được phiên bản không?* — **Không, theo những gì đã kiểm:** `enabledPlugins`
  bật theo **tên**, phiên bản theo marketplace hiện tại. Hạt giống này đồng bộ
  **bộ plugin**, không đồng bộ phiên bản; phiên bản vẫn đi theo nếp *re-pin theo
  release* + `claude plugin update`. Nói rõ, không hứa quá.
- *Có nên ghi luôn cả user-level không?* — **Không.** Kit là engine cho repo;
  settings cấp user là của người. Ghi cấp repo, và chỉ khoá plugin.
- *Có làm `product-management` đồng bộ được không?* — **Không**, và không cố:
  plugin desktop, không có trong marketplace CLI (đã kiểm 490 mục) — ổ cắm +
  nhánh ba của `/start` đã xử lý (hạt giống «Vào có ô, ra có tên» §9).

## 3. Đề xuất — ba chỗ sửa, một nguồn tên

1. **`acceptance-init` bước 5b — ghi `.claude/settings.json` cấp repo.** Khối máy-đọc
   có marker `INIT-PLUGIN-DECLARE`:
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
   Luật ghi: **parse JSON rồi hợp nhất** — file đã có thì chỉ thêm/ghi đè đúng các
   khoá này, giữ nguyên mọi khoá khác (`permissions`, `hooks`, `worktree`…); file
   chưa có thì tạo. KHÔNG sed, KHÔNG ghi đè cả file. In một dòng cho người: «đã
   khai 4 plugin trong `.claude/settings.json` — commit file này, đội viên mở repo
   là được nhắc cài».
2. **GUIDE §5.1 — từ 5 lệnh còn 1.** Giữ `claude plugin marketplace add …` như
   bước một-lần-mỗi-máy (marketplace riêng cần thêm trước khi harness cài được);
   ba dòng `install` của kit + `superpowers` thay bằng một câu: *mở repo đã chạy
   `acceptance-init` → Claude Code nhắc bật đúng bộ*. Dòng «`diagram-design`
   (tuỳ chọn, cài riêng được)» **xoá** — owner chốt 21/08: bắt buộc. Đoạn *Kỷ luật
   cập nhật* giữ nguyên (phiên bản vẫn là việc của release).
3. **Một chữ, ba nơi, một nguồn.** Tên ba plugin của kit rút từ
   `.claude-plugin/marketplace.json`; khối `INIT-PLUGIN-DECLARE` trong init và
   đoạn §5.1 trong GUIDE phải khớp danh sách đó (+ `superpowers`). Thêm tên vào
   marketplace mà quên hai nơi kia → ca kiểm đỏ (mục 4).

**Không làm:** không thêm plugin ngoài bốn tên · không vendor `superpowers` ·
không ghi settings cấp user · không đụng `product-management` · không hứa pin
phiên bản · không đổi lưới / hồ sơ / workflow.

## 4. Chiều đỏ — ma trận viết trước, fixture code-sinh

| Ca | Fixture | Mong đợi | Vai |
|---|---|---|---|
| R+ | repo nháp **không** có `.claude/settings.json`; chạy bước 5b (hoặc hàm ghi tách ra được) | file sinh đúng 4 tên `true` + marketplace `acceptance-gate-kit` | đối chứng dương |
| R0 | repo nháp **đã có** `.claude/settings.json` với `permissions` + `enabledPlugins` khác (`paper-desktop@paper: true`) | sau ghi: 4 tên được thêm, **`paper-desktop` và `permissions` còn nguyên** | cô lập lớp — luật không phá settings của đội |
| R− | `marketplace.json` thêm plugin thứ tư (fixture bản sao) mà init/GUIDE không đổi | ca một-chữ-ba-nơi **đỏ**, ghim thông điệp nêu tên thiếu | chiều đỏ của phép khớp (mẫu P44 init↔GUIDE, nâng thành ba nơi) |
| RK | đổi tên marker `INIT-PLUGIN-DECLARE` một phía | case round-trip đỏ | giữ hợp đồng máy-đọc |

**Ngoài tầm đo của kit, khai trước làm known-limit:** hành vi «Claude Code nhắc
cài khi mở repo có `enabledPlugins`» thuộc harness, kit không đo được bằng suite.
Kiểm **tay một lần** trên máy mới khi hồ sơ mở (ghi kết quả vào evidence dưới
dạng lời khai có ngày), và nêu rõ trong Known limits — không giả vờ có răng.

## 5. Quan hệ

- **Luật đóng gói ba tầng** (phiên 21/08): repo = git · máy = khai trong repo ·
  ổ cắm ngoài = khai trong config, không cài qua kit. Hạt giống này lấp tầng giữa.
- **Re-pin theo release** (CLAUDE.md, GUIDE §7.1): phiên bản đồng bộ theo mốc
  release, không theo từng merge — hạt giống này không thay, chỉ làm *bộ* plugin
  hết phụ thuộc trí nhớ.
- **ADR 0008** (lưu kho harness Codex): không nuôi gương đa-harness — nên không
  cố đưa settings này sang harness khác.
- **Hạt giống «Vào có ô, ra có tên» §9**: ổ cắm `product-management` vẫn là ổ
  cắm; file settings này không liên quan và không nên chạm.

## 6. Vấp dự đoán, ghi trước

- **JSON, không phải text.** `.claude/settings.json` có thể chứa `permissions`
  dài của đội; hợp nhất bằng parse, giữ thứ tự khoá hợp lý, in đẹp 2 khoảng
  trắng; file hỏng JSON → DỪNG và báo, không ghi đè.
- **Ưu tiên settings.** Máy owner đang tắt nhiều plugin official ở cấp user
  (`false`). Cần kiểm khi mở hồ sơ: `true` cấp repo có thắng `false` cấp user
  không, và `enabledPlugins` cấp repo có kích hoạt lời nhắc cài hay chỉ bật
  plugin đã cài. Hai câu này quyết **lời in cho người** ở bước 5b — viết sau khi
  kiểm, không đoán.
- **Không khai `claude-plugins-official`** trong `extraKnownMarketplaces` — nó là
  mặc định; khai thừa là nhiễu, và tên nguồn có thể đổi.
- **Hai phiên song song thêm ca kiểm** → đụng số ca trong `run-tests.sh`; ca
  mới để **file riêng** theo nếp hạt giống ba-chỗ-tích-luỹ.
- **Repo tiêu thụ đã có file từ trước** là ca thường, không phải ca hiếm — R0
  là ca phải xanh trước R+.

## 7. Điều cố tình không làm

Không tạo lệnh riêng «/acceptance-plugins» · không ghi settings cấp user · không
pin phiên bản bằng cách ghi số vào settings (khoá không có nghĩa đó) · không
vendor `superpowers` hay `product-management` · không đổi quy trình release.

## Nguồn

- `GUIDE.md` §5.1 (5 lệnh · «tuỳ chọn» · kỷ luật cập nhật), §5.2–5.3.
- `commands/acceptance-init.md` bước 1–6; marker `INIT-CI-COPY-LIST` (mẫu khối
  máy-đọc có marker).
- `.claude-plugin/marketplace.json` (nguồn tên ba plugin).
- `tests/plugins/run-tests.sh` P44 (mẫu parity init ↔ GUIDE), P39 (init phát khoá).
- Settings thật: `~/.claude/settings.json` của owner (tên khoá); tiền lệ cấp repo
  `~/dev/crm/.claude/settings.json`.
- Sổ nhớ phiên: *da-moi-nhat-la-noi-doi* · *mot-mat-phang-lam-viec* · luật đóng
  gói ba tầng (21/08).
- `docs/reference/figures/kit-cam-vao-dau.html` (hình tầng 2 liên quan).
