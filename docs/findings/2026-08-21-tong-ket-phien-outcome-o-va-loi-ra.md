# Tổng kết phiên 21/08 — từ «Outcome roadmap là gì» đến «Vào có ô, ra có tên»

*Phiên một ngày, owner Manh + một phiên máy. Bắt đầu bằng một câu hỏi khái
niệm, kết bằng bốn PR docs về `main` và bốn hạt giống xếp hàng ở Cổng 0. Văn
bản này là bản ghi để phiên sau khỏi làm lại — không phải hồ sơ nghiệm thu.*

## 1. Hành trình một đoạn

Câu mở đầu là *«Outcome-based roadmap là gì?»*. Trả lời xong, câu kế là *«đưa tư
duy này vào kit thì ở giai đoạn nào?»* — và soi nguồn cho thấy kit **đã có
xương outcome** (Cổng Đáng khai ngưỡng trước · Cổng Giá trị đo cạnh ngưỡng ·
kill là thành công của quy trình), chỉ hở ở **hai đầu dây**: ngưỡng khai mà
không ai xây thứ sinh ra con số (L1), và ý tưởng brainstorm xong không có ô nào
đọc nên rữa thành rác. Phần còn lại của ngày là gọi tên hai lỗ đó, vẽ cho nhìn
thấy, đóng gói để đội dùng chung — và cắt mọi thứ không trace được.

## 2. Đã giao về `main` (docs-only, merge commit)

| PR | Vật | Commit main |
|---|---|---|
| [#71](https://github.com/phanlemanh/acceptance-gate-kit/pull/71) | Hạt giống **đường đo nằm trong định-nghĩa-xong** — ô `## Đường đo` trong hợp đồng, chép khuôn CT-S, ma trận R+/R−/R0 | `32819eae` |
| [#75](https://github.com/phanlemanh/acceptance-gate-kit/pull/75) | Hạt giống **«Vào có ô, ra có tên»** + 2 hình tầng 2 + phụ lục ổ cắm `product-management` | `a86309b3` |
| [#76](https://github.com/phanlemanh/acceptance-gate-kit/pull/76) | **Bộ 10 hình** giải thích kit (8 mới ở `docs/reference/figures/` + `index.md` thứ tự đọc; 3 dòng trỏ GUIDE §2/§3/§4) | `a4a4065b` |
| [#77](https://github.com/phanlemanh/acceptance-gate-kit/pull/77) | Hạt giống **repo khai plugin** — `acceptance-init` ghi `.claude/settings.json`, GUIDE §5.1 từ 5 lệnh còn 1, `diagram-design` bắt buộc | `5f2519bd` |

Cùng ngày, phiên khác merge #72 (ba chỗ tích luỹ) · #73 (xoá hồ sơ draft) ·
#74 (hạt giống làn V) — không thuộc phiên này, ghi để đọc `git log` khỏi nhầm.

## 3. Ba khái niệm được đặt tên trong phiên

1. **Output và outcome là hai hợp đồng, hai bên ký, hai nhịp.** Output = lời hứa
   chắc, máy chứng minh, theo PR. Outcome = khoản cược, người quyết, theo
   release. Đồng bộ bằng **ba khớp nối**: trace xuống (mỗi output khai outcome
   nó phục vụ) · **instrument đi kèm** (đường đo nằm trong định-nghĩa-xong) ·
   thất bại chảy một chiều (outcome đỏ không làm đỏ output đã ship). Đoạn giữa
   Gate 1 → S4 → Gate 2 **cố tình mù outcome** — đó là tính năng.
2. **«Vào có ô, ra có tên»** (owner đặt tên). Vật vào vòng phải có ô trong hồ sơ
   (ba người đọc định kỳ: `/start` · bản đồ · lưới); vật ra khỏi vòng phải mang
   tên số phận (`build · iterate · park · kill` / `release · iterate · kill`).
   «Để đó» không phải trạng thái. Hai hạt giống #71 và #75 là hai vế của cùng
   luật này.
3. **Luật đóng gói ba tầng.** *Repo* (git: config · 7 file CI · hồ sơ · bản đồ)
   · *máy* (marketplace + plugin — phải được repo **khai**) · *ổ cắm ngoài*
   (khai trong config, không cài qua kit). Nguyên tắc: **thứ phải giống nhau
   giữa mọi máy là hồ sơ và lưới; công cụ tạo ra hồ sơ được phép khác.**

## 4. Phát hiện khi soi nguồn — thứ mô tả ngoài không cho thấy

- Chữ «tracking» theo nghĩa nguồn số đo thật xuất hiện đúng **hai chỗ** trong
  toàn kit, cả hai ở phía **đọc** (sau ship). Không gì ở phía tạo. → #71.
- `/start` lối (a) trỏ tới «nghi thức grill của kit» — **không tồn tại ở đâu**
  (grep chỉ thấy trong chính `start.md`). Con trỏ chết, cùng loại `red-team D2`.
  → #75 gọn hơn dự kiến: ô và nhịp tim **đã có** (`product-map.mjs:179`,
  `start-scan.mjs:241` với `since`), chỉ thiếu cửa vào và luật lối ra.
- Điểm thiết kế lộ ra từ đó: mọi `opportunity.md` chưa quyết đều thành cổng
  `dang` trong nhóm «Chờ chữ ký» — có 30 ý tưởng là nhóm quan trọng nhất của
  thẻ bị đè. Phải tách *stub chưa ngưỡng ≠ cổng*.
- Số đo: artifact-platform **171** spec, **~75** mồ côi, **3** hồ sơ cơ hội; kit
  **12** hạt giống, bản đồ nói «chưa có», ≥2 dòng `Trạng thái:` rữa dù đã ship.
  Kit mắc đúng bệnh nó chữa cho consumer.
- `product-management` là plugin **desktop** (chế độ agent cục bộ), **không có**
  trong `claude-plugins-official` (490 mục). Cắm qua ổ `discovery.brainstorm_skill`;
  phiên CLI rơi về nhánh ba. Thân skill khớp Vòng HIỂU đến từng ô (Close the
  Session → `opportunity.md`); chế độ **Assumption Testing** là ứng viên ruột cho
  D2 — để hạt giống 15/08 quyết.
- RACI «Vật × vai» cho thấy hàng *Bằng chứng* là hàng **duy nhất máy giữ chữ K**
  — lý do tồn tại của hook + lưới, nhìn thấy được trong một ô.
- Mermaid GUIDE §3 còn vẽ «Cổng 2 luôn ký» — lỗi thời một nhịp so với làn V
  (2.0.0). Đã gọi tên, chưa sửa.

## 5. Quyết định của owner trong phiên (nguyên văn ý, không phải lời máy)

Đồng ý L1 thành hạt giống · đẩy và mở PR · CI xanh thì merge (#71, #77) · **không**
làm skill «ghi ý tưởng» (đồng nhất đến từ một cửa vào, không từ công cụ nữa) ·
tên luật **«Vào có ô, ra có tên»** · vẽ đủ 6 hình, gom một PR · Vòng HIỂU gọi
`brainstorm` của `product-management` · `diagram-design` là plugin **bắt buộc** ·
mở hạt giống «repo khai plugin».

## 6. Cố tình không làm (TRỪ)

Không dựng nghi thức retro cho vòng học của ngưỡng (L3) · không dựng bộ đo tự
động cho thước North Star của kit (L4) · không mang roadmap/portfolio vào kit ·
không skill «ghi ý tưởng» · không vendor `product-management` hay `superpowers`
· không migrate 75 spec mồ côi · không để máy tự `kill` theo tuổi · không chép
một hình vào hai chỗ (H3/H4 ở cạnh hạt giống, `index.md` trỏ sang) · không lấy
hình vá chữ (GUIDE §3 chờ PR chữ riêng) · không hứa pin phiên bản plugin.

## 7. Vấp vận hành và nếp rút ra

| Vấp | Nếp |
|---|---|
| Push đứt giữa chừng (gói PNG) mà chuỗi lệnh vẫn chạy tiếp vì `\| tail` nuốt mã thoát → PR tạo thất bại, worktree bị gỡ | Lớp «runner nuốt mã thoát» lần nữa: chuỗi phát hành **không pipe**, `&&` từng bước; commit vẫn an toàn trên nhánh local |
| Heredoc không quote → shell nuốt backtick trong sổ nhớ, ba cụm chữ biến mất | Ghi file có backtick: **luôn** `<<'EOF'`; sau khi ghi, grep lại chuỗi vừa ghi |
| Bộ kiểm tràn chữ sạch 8/8 nhưng H7 có 4 nhãn đè nét / đè ô | `check_overflow.py` là **sàn**, không phải trần — soi ảnh từng hình (headless Chrome, không có playwright) |
| Bộ theo dõi CI nền chết khi phiên khởi động lại, không để dấu | Khi cần merge theo CI: chờ **tại chỗ** bằng `until` + điều kiện «mọi check pass», không dựa vào thông báo nền |
| Phiên khác đang giữ checkout trên nhánh khác | Mọi việc git của phiên này đi qua **worktree riêng** trong scratchpad; kiểm `git status` của checkout trước khi đụng |
| Danh sách plugin in ra bị cắt 20 dòng + bảng ghi «3 plugin» không gọi tên → owner tưởng thiếu `diagram-design` | Liệt kê thì **gọi đủ tên**; đừng `head` một danh sách mà kết luận «không có» |
| Câu hỏi một chạm «soạn hạt giống ý tưởng?» bị lặp **ba lượt** trước khi owner gật | Hỏi **một lần**; chưa có câu trả lời thì làm việc khác, không lặp — lặp là tăng tần suất gọi người, đúng thứ kit tồn tại để giảm |

Số đo thật của phiên, theo thước của kit: **4 kết quả về `main`**, **≈11 câu
hỏi một chạm**, trong đó 1 câu lặp 3 lượt. Tỉ lệ chưa đẹp; nguyên nhân đã gọi
tên ở dòng cuối bảng.

## 8. Việc treo — ai cầm, khi nào

- **Cổng 0, bốn hạt giống**: chiều-đỏ Cổng Đáng (15/08) → đi trước nếu cùng
  chuyến; đường-đo (#71) và vào-có-ô-ra-có-tên (#75) đi sau hoặc song song;
  repo-khai-plugin (#77) độc lập.
- **PR chữ** sửa mermaid GUIDE §3 (Cổng 2 luôn ký → làn V). Nhỏ, chưa ai nhận.
- **Repo tiêu thụ, một dòng**: `discovery.brainstorm_skill: product-management:brainstorm`
  trong `_acceptance/config.yaml` của artifact-platform.
- **Hai connector đáng uỷ quyền** (trên claude.ai): analytics (Amplitude/Pendo)
  cho phía đọc của đường đo · tracker cho lối (b) của `/start`.
- **Hai câu kiểm tay** trước khi viết lời in của #77: `true` cấp repo có thắng
  `false` cấp user không · `enabledPlugins` có kích hoạt lời nhắc cài không.

## Nguồn

Các PR #71 · #75 · #76 · #77 và hạt giống trong `docs/plans/2026-08-21-*.md`;
`docs/reference/figures/index.md`; sổ nhớ phiên (ra-soat-21-08-duong-do ·
vao-co-o-ra-co-ten · bo-hinh-kien-truc-van-hanh · repo-khai-plugin).
