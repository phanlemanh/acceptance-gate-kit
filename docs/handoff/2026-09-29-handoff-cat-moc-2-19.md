# Bàn giao — đổi máy để cắt mốc 2.19.0

**Ngày:** 2026-09-29 · **Từ:** phiên kit trên máy Mac mini (memory của phiên này KHÔNG theo sang máy mới — tệp này thay nó) · **Việc kế:** cắt mốc `2.19.0`, rồi đưa crm cài.

## 1. Trạng thái lúc bàn giao

- `main` = `9b6abd77` (gộp PR #227). Tag gần nhất `v2.18.5` → `2e7b1347`.
- Cửa sổ `v2.18.5 → main` có **đúng một hồ sơ đã ký**: `mot-so-ba-ve` (T3, ký 29/09 bởi Phan Le Manh). Kiểm bằng máy, không kể tay:
  ```bash
  bash scripts/rel-cua-so.sh 2e7b1347 mot-so-ba-ve   # phải exit 0
  ```
- Hai PR của cửa sổ: #226 (ADR 0021 «ba vế một câu» + ô `mot-so-ba-ve`) và #227 (vòng).
- Phiên bản hiện tại: `acceptance-gate 2.18.5 · feature-loop 2.18.5 · diagram-design 2.7.0`.
- **Vì sao là 2.19.0, không 2.18.6:** cửa sổ thêm một hook mới (`hooks/ruling-truoc-khi-xoa.js`, PreToolUse matcher `Bash`), một script mới (`scripts/cau-noi-ruling.mjs`) và ba trường sổ mới (`why`, `cost_if_wrong`, `source`/`source_ref`) — thay đổi cộng thêm, có đường đọc-cũ.

## 2. Vòng mot-so-ba-ve đã giao gì

| Người dùng thấy gì khác | Đụng đâu | Tiêu chí |
|---|---|---|
| Mỗi dòng sổ quyết định ghi ba vế: quyết gì · vì sao · sai thì tốn gì | `feature-loop/skills/feature-loop/SKILL.md` (khối `DEC-ID-RECIPE`) | AC-1, AC-7 |
| Thẻ Cổng 1/2 in dòng ba vế thành một câu ở cả ba khối, không cần lớp dịch; dòng thiếu giá mang nhãn | `scripts/gate-card.js` (`decBaVe`) | AC-2, AC-3, AC-4, AC-9 |
| Ruling mà superpowers ghi vào `.superpowers/sdd/<ws>/progress.md` được gặt vào sổ | `scripts/cau-noi-ruling.mjs` | AC-5 |
| Lệnh xoá thư mục tạm của superpowers bị chặn cho tới khi ruling vào sổ; kho chưa dùng kit thì hook im | `hooks/ruling-truoc-khi-xoa.js`, `hooks/hooks.json` | AC-6 |

Kèm: `feature-loop/scripts/claim-scan.mjs` đọc vế giá khi dòng thiếu `impact` (sổ d-13).

**Không tệp nào trong lớp CI mà kho tiêu thụ chép về đổi** (so khối `GUIDE-CI-COPY-LIST`): triển khai sang crm chỉ là cài lại plugin, KHÔNG chép lại CI.

## 3. Cắt mốc 2.19.0 — các bước (theo tiền lệ `release-2-18-5`, làn V)

0. **Máy mới:** clone kho, `git config user.name "Phan Le Manh"`, `gh auth status`, cài plugin kit 2.18.5 phạm vi user (`claude plugin install acceptance-gate@acceptance-gate-kit`, `feature-loop@…`, `diagram-design@…`) và `superpowers@claude-plugins-official` **6.4.1**. Kiểm `node --version` ≥ 20.
1. **Mở hồ sơ** `_acceptance/release-2-19-0/` bằng `/feature-loop:feature-loop` (T2, làn V). Chép khuôn sáu tiêu chí của `_acceptance/release-2-18-5/contract.md` và đổi số:
   - AC-1: hai manifest `.claude-plugin/plugin.json` (acceptance-gate) và `feature-loop/.claude-plugin/plugin.json` cùng `2.19.0`; `diagram-design` giữ `2.7.0`.
   - AC-2: dòng «Khớp phiên bản» ở `GUIDE.md` dòng 5 khớp ba manifest.
   - AC-3: mười lệnh suite của lượt chấm xanh + `product-map --check` khớp.
   - AC-4: `bash scripts/rel-cua-so.sh 2e7b1347 mot-so-ba-ve` exit 0.
   - AC-5: `git diff --stat v2.18.5 -- diagram-design/` rỗng.
   - AC-6: mô tả hai plugin có mục `v2.19.0`; mục của `feature-loop` tự khai cặp «pairs with acceptance-gate >= 2.19.0».
   - `CHANGELOG.md` thêm mục 2.19.0.
2. **Năm dòng số của vòng mot-so-ba-ve** (luật (c) CLAUDE.md) — ghi vào hồ sơ mốc:

   | Dòng | Số |
   |---|---|
   | làm-xong → quyết-được | `implemented` 09:41 → ký 11:10 (29/09, giờ VN) ≈ 1 g 29 ph; riêng `verified` → ký ≈ 66 ph |
   | lượt gọi người trong thiết kế | 3 (Cổng 1 · Cổng 1.5 · Cổng Bằng chứng) — trần T3 là 4 |
   | lượt gọi người ngoài thiết kế | 1 — câu khó-đảo «đẩy hay ẩn danh» sau chữ ký (dữ liệu thử chép nội dung kho riêng tư); thêm 1 chạm vì «ký» gõ trong chat không ghi được, phải gõ lại bằng lệnh |
   | lượt chấm bị hạ tầng đốt | 0 (S4 một lượt, PENDING-JUDGMENT) |
   | token máy S4 | 21 tác tử · ~2,59 M token tác tử con · khối tìm-lỗi (review) chiếm phần lớn cache_read (9,16 M / ~12 M) — bảng đủ ở `_acceptance/mot-so-ba-ve/usage-report.md` |
   | phút máy lượt chấm | S4 lượt 1: 1 278 s (~21 ph); S3 song song 379 s |

3. **Sau khi mốc gộp:** đặt tag `v2.19.0` trên commit chữ ký của hồ sơ mốc; chạy lưới trước-merge để thấy hồ sơ nào hoá cũ → một chiến dịch ghim lại (`repin-lane.mjs … --write`), một PR `repin/2-19-0`.

## 4. Đưa crm cài 2.19.0

- Cài lại plugin ở **mọi** phạm vi: user, gốc `crm`, và từng cây `crm/.claude/worktrees/*` còn sống.
- **Bẫy lặp lại ba mốc liền:** `claude plugin update --scope project` báo «already at latest» mà sổ `~/.claude/plugins/installed_plugins.json` vẫn ghi số cũ → `uninstall` + `install` cho scope đó. Việc này GHI LẠI `.claude/settings.json` của cây → **sao lưu trước, chép lại sau**.
- Khởi động lại phiên Claude ở crm để hook mới có hiệu lực.
- Không chép CI (mục 2).

## 5. Đo ngưỡng của ô sau khi crm cài (Cổng Giá trị)

Ô `mot-so-ba-ve` khai (opportunity.md): ở vòng crm kế chạy S3 dưới superpowers —
- SỐNG: 100 % ruling trong khối «Rulings I made» có mã sổ (đếm khối chat cuối S3 so với dòng `"source":"superpowers"` trong `decisions.jsonl`), thẻ Cổng 2 in một dòng ba vế cho mỗi mã, `decisions_plain` rỗng cho các dòng ấy.
- CHẾT: cầu nối im mà không cờ vàng khi ledger vắng; hoặc dòng cũ chỉ có `impact` in hỏng.
Mốc đo trước vòng: crm `tro-ly-okr-de-xuat` 28/09 — 11 ruling, 4 có mã sổ.

## 6. Bẫy đã gặp trong phiên này (máy mới không có memory của chúng)

1. **Hook `block-no-verify` chặn mọi lệnh có «-n»** (`sed -n`, `grep -n`, `tail -n` trong heredoc) nằm CÙNG lệnh với `git commit` → tách lệnh.
2. **Khoá executor trong `_acceptance/config.yaml` có «: » bên trong phải bọc nháy kép** (xem `ckdl`, `msbv`); `config-patch.mjs` không tự bọc — viết trần là YAML hỏng và ca `config-yaml-that` đỏ.
3. **Ký hồ sơ trong kho kit:** mỗi mục «Đề xuất: known-limits» của `review-findings.md` cần một dòng trong `docs/research/known-limits-ledger.tsv` (ca P179, plugins vùng 3), thêm CÙNG commit chữ ký. Lệnh ký không nhắc, và làn trước chữ ký `--skip-unchanged` tự bỏ qua khi cây bằng pin — lần này chỉ lộ ở làn ghim lại.
4. **«Ký» gõ trong chat không ghi được chữ ký** (ADR 0002) — owner phải gõ `/acceptance-gate:signoff …`.
5. **S4 trong kho kit:** công cụ Workflow chỉ nhận `scriptPath` trong thư mục làm việc/scratchpad; tệp args ~45 KB → chép `feature-loop/workflows/acceptance-verify.js` vào scratchpad, tiêm `args = <JSON nguyên văn từ s4-args.json>` ngay sau khối `meta`, chạy bản `dryRun: true` trước. Lệnh sinh args trong kho kit thêm `--ag-root .`.
6. **`execute-parallel` tạo cây làm việc từ `main`**, không từ nhánh vòng — tác tử phải fast-forward lên nhánh vòng trước khi làm; sau khi gộp các nhánh, chạy lại toàn bộ tệp ca (lần này DK15 đỏ vì va chạm hai nhánh).
7. **Kho kit CÔNG KHAI:** không chép nội dung kho tiêu thụ riêng tư vào fixture. Lần này phải ẩn danh và viết lại lịch sử nhánh trước khi đẩy (sổ d-20). Quét trước khi đẩy bằng phần THÊM so với main (`git diff origin/main <c> | grep '^+'`), vì `grep -i NIST` khớp «administration» có sẵn trên main.
8. **Tên trạng thái `signed-off` gõ tay trong tệp ca bị ca RT13 bắt** (khối miễn trừ nằm trong một hồ sơ đã ký, đừng sửa ở đó) — lặp `WR.DA_THONG_CONG_2` từ `lib/workspace-record.cjs`.
9. Bộ kiểm duyệt lệnh của phiên (classifier) có lúc lỗi tạm thời: thử lại vài lần rồi dừng, để owner tự chạy lệnh.

## 7. Việc treo và hạt giống (không mở việc trong mốc)

- **Mười Known limits của `mot-so-ba-ve`** (hợp đồng mục Notes + sổ known-limits): bảy mục là phép đo tự dối của chính hồ sơ — MS-AC8-xuat tự ghi rồi tự so và ghi vào tệp đã theo dõi (sau khi ký, đổi cách in thẻ sẽ làm bộ kiểm ghi lại bằng chứng hồ sơ đã ký); MS-AC1-lib-im so rỗng với rỗng; bốn ca phá thử không chứng bản sao đã chạy. Ứng viên số một cho cửa sổ kế nếu owner gọi tên.
- **Hạt giống Ngoài-6:** `docs/plans/2026-09-29-hat-giong-hook-chan-ke-hoach-ngoai-ho-so.md` — hook chặn mãi khi kế hoạch superpowers không thuộc hồ sơ nào.
- **Ba hạt giống cùng lớp trong ô `mot-so-ba-ve`:** «Trả lại: lý do» ở Cổng 2 không ghi trường; `veto` thiếu giá; cột Xử lý của gap-probe thiếu giá.
- **Đề xuất chưa được owner gật:** luật «kit không chứa product context của kho tiêu thụ» chưa có răng (nguồn gốc của lần chép nội dung crm) — nếu owner muốn, ghi hạt giống neo vào Ngoài-3 của `mot-so-ba-ve`.
- Từ mốc 2.18.5 còn treo: phiên nghiệm thu `cham-khong-tu-dot-luot` sau ≥ 10 lượt chấm ở crm.
