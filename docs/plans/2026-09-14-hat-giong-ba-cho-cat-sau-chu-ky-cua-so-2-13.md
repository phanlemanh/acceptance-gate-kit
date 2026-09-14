# Hạt giống — bốn mục cho cửa sổ 2.13 (ba chỗ cắt sau chữ ký + chiến dịch ghim lại)

**Ngày:** 2026-09-14 · **Trạng thái:** `_acceptance/ba-cho-cat-sau-chu-ky-cua-so-2-13/opportunity.md`
(ổ «đang cân nhắc», răng VC8 «vào có ổ») · **Hạng dự kiến:** T2 (chạm `feature-loop/scripts/
repin-lane.mjs`, `tests/scripts/`, SKILL S5; không chạm `lib/**`, hook) · **Owner gọi tên:**
14/09, sau khi tự thấy phiên ship `release-2-12-0` mất > 60 phút từ chữ ký tới lên main.

> **Việc phải làm ở mốc 2.13:** kéo bốn mục dưới vào **§4 «Nhát cắt cho cửa sổ kế — gọi
> tên»** của `_acceptance/release-2-13-0/contract.md` (khuôn hồ sơ 2.12.0 §4). Ghi ở đây
> vì hồ sơ mốc chưa mở — đừng để nó nằm trong log chat. Vòng meta duy nhất của cửa sổ
> 2.12 → 2.13 đã là `khoi-tim-loi-tra-phi-theo-vat`; ba mục này **không mở vòng**, chờ
> mốc quyết: vá-trong-mốc (tiền lệ 2.11.0) hay để cửa sổ 2.14. Mục 4 thêm 14/09 sau
> khi đẩy vòng `khoi-tim-loi-tra-phi-theo-vat` — owner gọi tên.

> Chữ trong file này là NGUỒN. Không cần hình: bốn mục, mỗi mục một số đo và một nhát.

## Số đo (phiên ship 2.12.0, 14/09, giờ VN — đọc từ transcript phiên + task output)

| Giờ | Việc | Đồng hồ |
|---|---|---|
| 09:22 | Re-pin #1 (gộp `origin/main` 4 commit dời docs) | **12 phút** — Bash giết ở 600 s, đẩy nền, phiên chờ |
| 09:45 | **Owner ký** Cổng Bằng chứng | — |
| 09:45 | `product-map.mjs` + re-pin #2 «làn máy trước chữ ký» | > 10 phút, giết ở 600 s; re-pin #2 **ĐỎ** (suite `scripts` LM20 · E3a=1) |
| 09:58–10:16 | `tests/scripts/run-tests.sh` × 3 để chẩn LM20 | 18 phút |
| 10:16 | Re-pin #3 sau khi sửa fixture — XANH nhưng thiếu `--write`, không ghi | 12 phút, lại giết ở 600 s |
| 10:29 | Re-pin #4 `--write` («hoá cũ do chính commit chữ ký») | 12 phút |

Chữ ký → lên main **> 60 phút** cho vật xanh từ lượt chấm 1 (ba con số phiên bản) —
ngang **4 lượt chấm S4**. Token nhỏ (chỉ Bash), nên nó **không hiện ở dòng 4**; nó là
giờ máy + giờ người chờ, và nằm **sau «quyết-được»**, tức **không dòng nào trong năm
dòng số (luật (c), 14/09) đếm** — đó là lỗ trong luật, không phải trong phiên.

## Ba chỗ cắt — gọi tên

### 1. Re-pin theo diff, không theo trọn corpus

**Lỗ:** `feature-loop/scripts/repin-lane.mjs` chạy **5 suite tuần tự** (`tests/plugins/
run-tests.sh` 11 173 dòng, 50 ca, là phần nặng nhất) + mọi eval máy của hồ sơ, một
mạch ≈ 12 phút — bất kể diff từ lần ghim trước là gì. GUIDE §7.1 đã gọi tên đường rẻ
«re-pin theo diff» nhưng làn máy chưa đi đường đó. S4 có P1 carry theo `eval.paths`;
re-pin không có.

**Nhát:** làn nhận `--since <sha ghim trước>`; suite/eval có `paths` (hoặc `suite_keys`
khai `paths`) không chạm `git diff --name-only <sha>..HEAD` → carry, ghi rõ trong dòng
`repin` (`carried: [...]`, cùng minh bạch với P1). Không khai `paths` → chạy lại (fail-
closed như carry-plan). Trace: nguyên tố 2 — máy thôi trả tiền chứng minh thứ không đổi.
Người hưởng: máy (12 phút → phút) và người ký (không chờ).

### 2. Fixture `routing-baseline.txt` không được đỏ vì hồ sơ mới

**Lỗ:** `tests/scripts/fixtures/routing-baseline.txt` ghim routing thẻ (hỏi|báo) của
**mọi** hồ sơ; hồ sơ mới ký → thiếu dòng → LM20 đỏ → sửa fixture = **commit sau
verify** → evidence stale → re-pin 12 phút → `--write` lại là commit → … Đây là
«thước ghim thước» — cùng lớp spec `khoi-tim-loi-tra-phi-theo-vat` (tầng 3: nghiệm
một chiều), đổi da ở tầng fixture.

**Nhát:** một trong hai, mốc chọn: (a) LM20 chỉ so hồ sơ **đã ký trước `--base`** (hồ sơ
đang mở không nằm trong baseline — nó chưa là sử liệu); hoặc (b) baseline máy sinh
từ `gate-card --extract` tại `--base`, không còn file tay. Cả hai đều xoá bước «sửa
fixture sau chữ ký». Trace: nguyên tố 2. Người hưởng: máy.

### 3. Dòng 1 đo tới «lên main» + nghi thức ship chạy nền

**Lỗ (luật):** dòng 1 «làm-xong → quyết-được» dừng ở chữ ký; 60 phút hôm nay nằm ngoài
mọi dòng. **Lỗ (nghi thức):** `repin-lane` và `product-map` chạy foreground → Bash trần
600 s giết → chạy lại hoặc chờ nền; và một lần quên `--write` = một làn 12 phút vô ích.

**Nhát:** (a) luật (c): dòng 1 đo tới **«trên main»** (quyết-được → trên-main là đoạn
thứ hai của cùng một dòng, tách hai số); (b) SKILL feature-loop bước S5: hai lệnh đó
**chạy nền từ đầu** (`run_in_background`, đọc tệp output khi notify), và `run-tests.sh`
chạy **một lần trước khi ký** để LM20 đỏ trước chữ ký, sửa fixture cùng commit với hồ
sơ. Trace: (a) nguyên tố 1 — thước đo phải phủ tới nơi giá trị chạm người dùng;
(b) nguyên tố 2. Người hưởng: owner (không chờ), máy.

### 4. Chiến dịch ghim lại — 41/68 hồ sơ đang stale, mốc cũ nhất tụt 411 commit

**Đo 14/09, ngay sau khi đẩy vòng `khoi-tim-loi-tra-phi-theo-vat` lên nhánh chính**
(`pre-merge-check.sh . --base 7d12ffad --recheck-all`): **41 hồ sơ** có `verified_commit`
đã hoá cũ, trên **68** hồ sơ có ghim (106 thư mục hồ sơ, phần còn lại chưa tới bước
ghim). Mốc ghim cũ nhất là `7d12ffad` (08/09) — **tụt 411 commit** — và riêng nó gánh
**21 hồ sơ**. Mốc gần nhất trong nhóm stale là `7e260d4b` (14/09), tụt 41 commit.

Đây **không phải hồi quy của vòng vừa ship**: 30 commit của vòng không chạm tệp nào
trong danh sách gây stale của `khoi-viec-cua-anh` và `s4-scope-triage` (hai hồ sơ tình
cờ lộ ra khi lưới soi trọn `origin/main`). Chứng: dựng worktree ngay tại `origin/main`
rồi chạy lưới ở đó — hàng loạt hồ sơ đã đỏ sẵn, không có việc của vòng này trong cây.
Luật re-pin-theo-release gọi trạng thái này là **chấp nhận được giữa hai mốc** và dặn
đừng đuổi theo; chỗ nó phải được xử là **chiến dịch ghim lại của mốc 2.13**.

**Việc ở mốc:** chạy một lượt làn `repin-lane.mjs` gom nhiều slug cho trọn 41 hồ sơ
(nghi thức «1 lượt lane, N chữ ký» — một `run_id` cho cả sự kiện). Ước phí theo số đo
mục 1 ở trên: làn hiện chạy ≈ 12 phút cho **một** hồ sơ vì nó chạy trọn 5 suite; 41 hồ
sơ dùng chung một lượt suite nhưng mỗi hồ sơ còn bộ eval riêng. **Mục 1 (re-pin theo
diff) là điều kiện tiên quyết của mục này** — không cắt làn trước thì chiến dịch này tự
nó là một khoản giờ máy lớn, và nó lặp lại mỗi release.

**Rủi ro phải nhìn trước khi chạy:** làn ghim lại chỉ ghi khi MỌI suite và eval của hồ
sơ đó xanh. Hồ sơ ghim ở mốc 411 commit trước có thể đỏ vì vật đã đổi thật — khi đó
luật là DỪNG, không ký mù, và hồ sơ ấy thành một vấp thật phải xử riêng chứ không nằm
trong chiến dịch. Nên bước đầu của chiến dịch là **chạy đo (không `--write`) để biết
bao nhiêu hồ sơ đỏ**, rồi mới quyết.

Danh sách theo mốc ghim (đọc từ lưới, không gõ tay):

| mốc ghim | số hồ sơ | hồ sơ |
|---|--:|---|
| `7d12ffad` | 21 | card-text-fidelity · codex-script-packaging · duong-do-trong-dinh-nghia-xong · gap-probe-presence-hook · hinh-tai-cong-1 · judge-required-evidence · khoi-viec-cua-anh · measure-birth-certificate · measure-teeth-cleanup · premerge-rules-ledger · premerge-unjudged-pass · release-2-8-0 · repo-khai-plugin · s4-scope-triage · siet-rang-cau-ve-hinh · status-chua-arm-cong · stop-patching-law · suite-run-log-provenance · t1-escape-event-scope · vu-trang-goal-luc-goi-ten · workspace-reader-unification |
| `80966954` | 3 | loi-moi-cong-may-sinh · lop-bang-chung-nhin-thay · matrix-measure-law |
| `ffe138ac` | 3 | cong-dang-co-cua · lan-may-song-qua-bo-phan-loai · nhanh-chinh-khong-ten-main |
| `3a77f000` | 1 | cong-nguoi-doc-du-nguon |
| `72a571f7` | 1 | cua-veto-sau-chu-ky |
| `53fe0b5c` | 1 | duong-lui-phai-song |
| `45e5f1d8` | 1 | eval-khai-ma-thoat-mong-doi |
| `a6fc84ad` | 1 | ghim-lai-tren-lop-cu |
| `e00898a6` | 1 | glob-hai-sao-khop-goc-kho |
| `096005c8` | 1 | gold-output-measure |
| `85a2ecb9` | 1 | gom-duc-ket-2-10-0 |
| `95da100c` | 1 | lan-doc-status-not-run |
| `1d6f7e4a` | 1 | ma-so-quyet-dinh-duy-nhat |
| `944dce5f` | 1 | ra-co-ten-lam-va-trao |
| `0c28c597` | 1 | release-2-10-0 |
| `4d61b2a3` | 1 | release-2-11-0 |
| `7e260d4b` | 1 | release-2-12-0 |

## Không làm ở đây

- Không mở vòng: luật (b) cửa sổ này đã dùng vòng meta cho `khoi-tim-loi-tra-phi-theo-vat`.
- Không thêm phép đo mới: mục 3(a) là sửa ranh giới của dòng 1, không thêm dòng.
- Bản chấm 2.12.0 (`.claude/worktrees/release-2-12-0/_acceptance/release-2-12-0/`) là
  sử liệu — không sửa; số ở trên đọc từ transcript phiên `ae39de67` và
  `tasks/{b5umv4y7m,bskpneaq5,bn1zujxdq,bbzg4rwla}.output`.

Liên quan: spec [`2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md`](../superpowers/specs/2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md)
(cùng gốc: thứ không có tên máy đọc thì luật không chạm được) · GUIDE §7.1 (re-pin theo
diff) · hồ sơ 2.12.0 §4 (khuôn «nhát cắt cho cửa sổ kế»).
