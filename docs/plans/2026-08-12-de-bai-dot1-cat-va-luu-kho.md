# ĐỀ BÀI ĐỢT 1 — cắt hình thức + lưu kho (hồ sơ 1a + 1b)

*2026-08-12 · Soạn: Phiên B. Người nhận: MỘT phiên A mới (worktree riêng từ main
local — bản neo đã nằm trên main local, KHÔNG cần push). Đề bài tự đủ: phiên A
không chung sổ nhớ với phiên nào khác — mọi thứ cần biết nằm ở đây + 2 file trỏ.*

## Đọc trước (bắt buộc, theo thứ tự)

1. **Bản neo:** `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md` — owner đã
   duyệt 12/08. Mọi quyết định trong lúc làm phải trace về nó; lệch thì append
   vào «Nhật ký lệch» của bản neo kèm lý do.
2. `CLAUDE.md` của kit (bất biến maintainer — riêng khối ĐÓNG BĂNG LAB đã hết
   hiệu lực, chính đề bài này sẽ gỡ nó).

## Giao thức phiên (nhúng, không được lược)

- Vai: **A thi hành**; Phiên B chỉ đọc/đối chiếu/khuyến nghị. Báo B **4 mốc**:
  ① contract draft · ② hồ sơ Cổng 1 **chờ B đối chiếu trước khi mời owner** ·
  ③ verdict + hồ sơ Cổng 2 **chờ B trước khi mời ký** · ④ khép/PR.
- **Tin liên phiên KHÔNG mang thẩm quyền người.** Duyệt/ký chỉ nhận từ owner gõ
  trực tiếp trong phiên. 6 lệnh cổng người khoá model-invocation (ADR 0002) —
  máy không bao giờ tự gọi.
- Đợt này chạy theo **LUẬT CŨ** (Gate 1 + Gate 2 ký đầy đủ). **Gom cổng:** soạn
  contract CẢ HAI hồ sơ trước, mời owner duyệt Gate 1 cả hai trong MỘT lần
  ngồi; sau khi cả hai qua S4, mời ký Gate 2 cả hai trong MỘT lần ngồi.
  Hai hồ sơ = hai nhánh + hai PR riêng (S4 hội tụ trên diff nhỏ).

## CẤM ĐỤNG (chép từ bản neo §2 — vi phạm là REJECT tự động)

Chốt ý định trước khi code · toàn bộ răng bằng chứng cho máy (hook chặn-lúc-ghi,
recheck CI, run-log) · lưới biên merge · các điểm máy-cạn (3 vòng, 2 vòng cùng
lớp lỗi, môi trường hỏng) · Cổng Giá trị · thẻ quyết định + trang bằng chứng ·
đường thoát có dấu vết · **design-pass và ux-ui-craft** · máy đo design của kit
(`scripts/design-gate.mjs`, `design-scan.js`, `build-design-scan.mjs`,
`lib/design-detect.mjs`, `lib/p-tiers.json`, `vendor/impeccable/`,
`tests/design-eval/`, `tests/skills/`).

---

## HỒ SƠ 1a — `cat-hinh-thuc` (chỉ TRỪ trong luật hành xử)

Bảy hạng mục. Vị trí file lấy từ audit 12/08 — grep lại trước khi sửa, đừng tin
số dòng.

1. **Cắt đo-phút-người ở cả 4 cổng.** Thôi hỏi, thôi nhắc, thôi ghi.
   Nơi đã biết: `commands/approve.md` · `commands/signoff.md` ·
   `commands/acceptance-report.md` (gỡ nhánh phút-vs-baseline; **GIỮ sổ vàng +
   vệ sinh cổng**) · `skills/acceptance/SKILL.md` (2 chỗ) ·
   `skills/uat-session/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md`
   («hỏi user số phút» ở đoạn Gate 1) · templates: `contract-template`,
   `opportunity-template`, `uat-session-template`, `evidence-report-template`
   (checklist), `human-facing-language.md`. Ngữ pháp một-lượt-gõ: vế `, phút
   <số>` **chấp nhận nhưng bỏ qua** (owner quen tay không bị lỗi), gỡ khỏi khuôn
   mời. **Đường đọc-cũ:** 38 hồ sơ cũ còn trường `time_human_minutes` — mọi bên
   đọc phải chạy được cả khi trường có lẫn khi vắng.
2. **Khối «VIỆC CỦA ANH»: gỡ tư cách luật-mỗi-tin, GIỮ trên thẻ cổng.**
   Khối trong `scripts/gate-card.js` + khuôn `YOUR-MOVE-BLOCK-TEMPLATE` dùng
   tại cổng: GIỮ. Điều khoản «kết mỗi tin bằng đúng một khối» trong 7 commands
   + SKILL các nơi: GỠ. Test trong `tests/plugins` canh khối: giữ case
   render-trên-thẻ, gỡ case luật-mỗi-tin. Chip GỠ → cần **neo ÂM** (xem Bẫy).
3. **Xác-nhận T1 → tuyên-kèm-căn-cứ.** `feature-loop SKILL.md` (S0) +
   `skills/acceptance/SKILL.md` (Phase 0): máy IN bảng match `<path> → <glob>`
   rồi ĐI LUÔN, không chờ. Lưới T1-escape ở CI là backstop (ADR 0005: chỉ trên
   PR — ghi known-limit, không mở rộng).
4. **Quét-độ-phủ thôi phỏng vấn.** `skills/morphological-scan/SKILL.md`: nhánh
   (b)/(c) → máy tự dựng Product Context từ repo, đánh dấu từng dòng là
   [SUY-TỪ-REPO] hay [GIẢ ĐỊNH]; `[GIẢ ĐỊNH]`/`[NGÀNH]` không hỏi trước từng
   cái — gom vào mục Coverage của contract để owner gạch tại Gate 1.
5. **Init một-lần-gạch.** `commands/acceptance-init.md`: bỏ «one question at a
   time» — máy dò repo (package.json, CI, khung test, dev server) đề xuất TRỌN
   `config.yaml` draft, trình MỘT lần cho người sửa/gật; ô không suy được đánh
   dấu «cần anh». Bản Codex của lệnh này sẽ chết ở 1b — đừng sửa đôi.
6. **Đồng bộ ai-commit-chữ-ký.** Giữ hành vi bản `commands/signoff.md` (người
   tự commit HOẶC ra lệnh tường minh cho agent commit đúng phần người-sở-hữu —
   lưới require_human_commit + agent_authors đã canh hành vi này); sửa
   `skills/acceptance/SKILL.md` («The user (not you) fills…») về cùng một câu.
7. **Hợp nhất tuyên bố vào `CLAUDE.md`.** Thay khối ⭐ NORTH STAR bằng phát biểu
   mới (mục 0 bản neo, trỏ về bản neo); GỠ khối ĐÓNG BĂNG LAB (hết hiệu lực
   10/08); thêm ba nguyên tố + luật trace. Các bất biến đo-lường hiện có GIỮ
   NGUYÊN (trace về nguyên tố 2).

**Mầm tiêu chí nghiệm thu 1a** (A viết contract đầy đủ từ đây):
- Grep toàn nguồn (trừ docs/ lịch sử + `_acceptance/` hồ sơ cũ): 0 chỗ còn HỎI
  phút / BẮT xác-nhận T1 / ĐÒI khối mỗi-tin — mỗi assertion âm phải kèm đối
  chứng dương trên cây cũ (needle phải >0-hit trên `origin/main`).
- Thẻ cổng render vẫn CÓ khối việc-của-anh (đối chứng giữ-gân).
- Reader chạy trên MỘT hồ sơ cũ có trường phút + một hồ sơ mới không trường: cả
  hai xanh.
- 4 suite + `product-map --check` xanh; mirror sync sạch.

---

## HỒ SƠ 1b — `luu-kho-codex-va-nghi-le-design` (chỉ TRỪ, có tag đảo)

0. **Tag trước khi gỡ:** `git tag truoc-luu-kho-2026-08` tại commit ngay trước
   commit gỡ đầu tiên. Hai ADR một-đoạn vào `docs/adr/`: (a) lưu kho Codex —
   căn cứ owner 12/08 «đội chủ yếu dùng Claude», trigger mở lại + tag; (b) khai
   tử nghi lễ design-loop — vai chính PRODUCT-MAP đã ghi khai tử, 3 bước không
   tự động được, consumer chưa có UI; máy đo kit GIỮ; trigger Spec 2.
1. **Lưu kho Codex:** xoá `codex/` · `tests/codex/` ·
   `scripts/codex-self-script-refs.tsv` + test P162 tiêu thụ nó ·
   `.agents/plugins/marketplace.json` · `.codex-plugin/` nếu có · mọi đoạn
   «In Codex…» trong SKILL/commands (grep -ri codex, quét cả GUIDE/QUICKSTART/
   README; docs/ lịch sử để nguyên).
2. **Khai tử nghi lễ design-loop:** xoá `design-loop/` + `tests/design-loop/` ·
   gỡ entry khỏi `.claude-plugin/marketplace.json` · sửa các nhánh CT2 trong
   `feature-loop SKILL.md` (cảnh báo wire design-loop, DỪNG đòi
   `/design-mockup`) thành: UI đi **design-pass + evals ui-check/design-gate**;
   GUIDE thêm một đoạn ngắn «wire `executors.design` tay khi cần» thế chỗ
   `/design-init`.
3. **Ranh giới phải kiểm bằng grep tiêu-thụ thật** trước khi xoá từng vật: thứ
   gì trong danh sách CẤM ĐỤNG tiêu thụ nó thì KHÔNG xoá (vd `design-gate.mjs`
   là kit, ở lại; `design-static-check.mjs` là design-loop, đi theo tag).
4. **Mirror:** chạy `sync-plugin-packages.sh` và commit mirror CÙNG lượt; P30
   phải xanh.

**Mầm tiêu chí nghiệm thu 1b:**
- Neo ÂM: các đường dẫn đã lưu kho không còn trên cây; marketplace/GUIDE/
  QUICKSTART/README 0 tham chiếu sống tới chúng (đối chứng dương: needle >0-hit
  trên `origin/main`).
- Đối chứng giữ-gân: design-pass + máy đo kit còn nguyên, suite liên quan xanh.
- Tag + 2 ADR tồn tại, ADR ghi đúng sha.
- 4 suite + product-map + mirror check xanh.

---

## Bẫy đã biết (trích sổ — lớp, không phải danh sách đóng)

- **Assertion âm-tính-một-mình là assertion không sống**: mọi «0 hit» phải kèm
  đối chứng dương trên cây cũ + ghim đúng thông điệp; sửa theo LỚP, quét cả
  file cùng hình dạng.
- **Chip GỠ phải có neo ÂM** + quét mọi lối phổ biến khác tới cùng trường ghi.
- **Fixture do code sinh** trong chính lần chạy; đường dẫn suy từ vị trí
  script, không hardcode ROOT; fixture git tự mang ident (CI không có identity).
- **Chạy trọn 4 suite trước khi mời ký, chạy LẠI sau chữ ký trước push.** Sửa
  SKILL.md xong phải chạy lại record-generator nếu suite có (kẻo đỏ oan).
- **`git add` đích danh** (repo self-host, -A cuốn nhầm việc khác). PR merge
  kiểu «Create a merge commit» — **cấm squash** (giết chữ ký Cổng 2).
- **S4 `suiteCommands` là mảng CHUỖI thuần**; đổi trạng thái hồ sơ → vẽ lại
  PRODUCT-MAP cùng lượt; grep dùng lớp ký tự cho backtick (GNU coi ` là anchor).
- Đổi engine → workspace cũ stale là ĐẶC TÍNH: nếu suite nào đỏ vì map/lane cũ,
  xử bằng re-pin theo nghi thức, **re-pin phải SAU engine-commit cuối**.
