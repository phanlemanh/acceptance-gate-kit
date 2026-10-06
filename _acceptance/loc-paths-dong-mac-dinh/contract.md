---
schema_version: 1
feature: Bộ lọc hoá cũ theo paths đóng mặc định — chỉ bớt tệp khi MỌI mục paths thuộc dạng đã chứng trên cây git đang kiểm; thư mục trần có thật thành thư-mục/**; mục không trỏ tới tệp nào giữ luật cũ; làn ghim lại đọc paths bằng một nguồn
slug: loc-paths-dong-mac-dinh
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/** + scripts/pre-merge-check.sh (t3_paths)
surfaces: [cli]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-10-06-loc-paths-dong-mac-dinh-design.md
---

# Acceptance Contract: loc-paths-dong-mac-dinh

## Context

crm bật `risk_tiers.stale_scope: paths` ngày 06/10 (crm-onehub#279) và được che bằng lưới tạm
`scripts/kiem-paths-dong.mjs` của chính kho. Trên `main` `bf79fdb1`, bốn cách khai (thư mục trần, `/`
cuối, `./` đầu, glob chỉ khớp thư mục) cho `apply: true, kept: 0`: cổng xanh mà sai. Ô `opportunity.md`
ký build T3 kèm ngưỡng; thiết kế ở `design_doc` (bảng phân loại bảy bước). Đây là vòng SỬA một vật đã
ký: không thêm khoá, không thêm lệnh, mặc định khoá không đổi.

Phép thử mọi kho (luật 26/09): kho không bật khoá — lưới trước-merge không gọi bộ lọc nên giữ từng
byte (AC-7); làn ghim lại đổi đúng một chỗ, danh sách «ô ngoài làn máy có vật đo đổi», và chỉ theo
chiều THÊM id (AC-6). Kho bật khoá (crm) — mất bộ lọc ở hồ sơ có mục không chứng được (11/126 ở crm
06/10), đổi lại không còn ca xanh-mà-sai.

## Ma trận dạng D (19 ô, viết trước — E1/E2/E5 assert ĐÚNG 19)

Cây fixture: `src/a.js`, `src/tài.js`, `src/a b.js`, `src/sub/c.js`, `app/[slug]/(app)/page.tsx`,
`other/z.js`. Mỗi ô có tệp đổi RIÊNG = tệp đích của ô + tệp mồi `other/z.js` (ngoài mọi `paths`);
`kept` so BẰNG ĐÚNG tập viết dưới đây.

| Ô | Mục `paths` | Tệp đổi | Kết luận | `kept` |
|---|---|---|---|---|
| D1 | `src/a.js` | `src/a.js`, mồi | nhận | `src/a.js` |
| D2 | `src/**` | `src/sub/c.js`, mồi | nhận | `src/sub/c.js` |
| D3 | `src/*.js` | `src/a.js`, `src/tài.js`, `src/a b.js`, `src/sub/c.js`, mồi | nhận | `src/a.js`, `src/tài.js`, `src/a b.js` |
| D4 | `src/sub` (thư mục trần có thật) | `src/sub/c.js`, mồi | nhận như `src/sub/**` | `src/sub/c.js` |
| D5 | `app/[slug]/(app)/page.tsx` | tệp ấy, mồi | nhận | tệp ấy |
| D6 | `src/tài.js` | `src/tài.js` (git in trong ngoặc), mồi | nhận | `src/tài.js` đúng chữ git in |
| D7 | `""` | `src/a.js`, mồi | `evals-hong` | — (luật cũ) |
| D8 | `"   "` | `src/a.js`, mồi | `evals-hong` | — |
| D9 | `./src/**` | `src/a.js`, mồi | `dang-khai-la` | — |
| D10 | `../src/a.js` | `src/a.js`, mồi | `dang-khai-la` | — |
| D11 | `/src/**` | `src/a.js`, mồi | `dang-khai-la` | — |
| D12 | `src/sub/` | `src/sub/c.js`, mồi | `dang-khai-la` | — |
| D13 | `src\a.js` | `src/a.js`, mồi | `dang-khai-la` | — |
| D14 | `src/a b.js` (tệp có thật) | `src/a b.js`, mồi | `dang-khai-la` | — |
| D15 | `src/s*` (khớp thư mục `src/sub`) | `src/sub/c.js`, mồi | `dang-khai-la` | — |
| D16 | `src/old.js` (không có trong cây) | `src/a.js`, mồi | `paths-khong-tro-toi-tep` | — |
| D17 | `gone/**` (không khớp tệp nào) | `src/a.js`, mồi | `paths-khong-tro-toi-tep` | — |
| D18 | hai eval: E1 `src/**`, E2 `src/sub/` | `src/sub/c.js`, mồi | `dang-khai-la:E2:src/sub/` | — |
| D19 | `src/*.ts` (glob dạng khác, không khớp tệp hay thư mục nào) | `src/a.js`, mồi | `paths-khong-tro-toi-tep` | — |

**Ba ô lệch với lưới crm, có tên (AC-2):** D4 — lưới chặn, bộ lọc NHẬN vì thư mục có thật trong cây
(Cổng 0 đã ký «thư mục trần thành `thư-mục/**` khi đọc được là thư mục»); D15, D17, D19 — lưới để yên, bộ lọc
TỪ CHỐI. Lưới chặn thư mục trần vì bộ lọc CŨ bỏ qua tệp bên trong; bộ lọc mới không còn lỗ đó (AC-3a).

## Criteria

- AC-1: Given cây fixture và đúng 19 ô ma trận D, When gọi `staleByPaths(tệp đổi của ô, evals, { cay })` của `lib/evidence-core.cjs`, Then mỗi ô cho đúng cột Kết luận (`apply: true` với `kept` BẰNG ĐÚNG cột cuối, hoặc `apply: false` với lý do mở bằng đúng mã và gọi tên eval + mục) — số ô hằng 19 viết trước, bộ sinh trả khác 19 → ĐỎ ghim «số ô lệch»; đối chứng dương: cây lành → 19/19. Hai chiều đỏ trên CÙNG fixture, tập ô lệch do code tính (ô có kết quả khác cột viết trước) và in ra kèm số: bản sao lib bỏ bước phân loại → tập lệch phải chứa D4 và D12 (hai dạng của lỗ gốc, viết trước), ghim «bỏ qua thầm»; bản sao khớp glob luôn trả rỗng → tập lệch phải chứa D1, D3, D5, D6, ghim «kept rỗng».
- AC-2: Given bản chụp lưới crm `kiem-paths-dong.mjs` (crm `e753383a`, chép nguyên văn, ghi sha đầu tệp) và một kho fixture SINH trong lượt có mỗi ô D1–D17 và D19 là một hồ sơ, When chạy lưới crm rồi chạy bộ lọc mới trên cùng kho, Then (tập hồ sơ lưới báo LỖI hoặc CẢNH BÁO) trừ (tập bộ lọc `apply: false`) BẰNG ĐÚNG {D4}, và (tập bộ lọc `apply: false`) trừ (tập lưới báo) BẰNG ĐÚNG {D15, D17, D19} — hai hằng viết trước; chiều đỏ: bản sao lib nhận `/` cuối → hiệu thứ nhất thành {D4, D12}, ghim «lưới crm chặn mà bộ lọc nhận: D12»; đối chứng dương: lưới crm chạy được và báo ≥ 7 LỖI trên kho (chứng lưới thật sự chạy, không phải 0 vì sập).
- AC-3: Given kho git fixture bật khoá `paths`, hồ sơ đã ký ghim ở commit trước, When `pre-merge-check.sh` chạy sau một commit đổi `src/sub/c.js`, Then (a) hồ sơ khai `src/sub` → VIOLATION hoá cũ liệt `src/sub/c.js`, còn bản base trên CÙNG kho cho 0 VIOLATION (chiều đỏ lịch sử: lỗ có thật trước vòng); (b) mỗi hồ sơ khai một dạng D7–D17 hoặc D19 → VIOLATION theo luật cũ KÈM một dòng NOTE gọi đúng mục; (c) hồ sơ khai `src/sub` mà diff chỉ đổi `other/z.js` → không VIOLATION, có NOTE bỏ qua; chiều đỏ: bản sao bỏ dòng NOTE → ghim «từ chối im lặng».
- AC-4: Given cây là danh sách tệp git theo dõi ở commit đang kiểm, When (a) đĩa có thư mục CHƯA theo dõi trùng tên một mục trần, (b) diff xoá đúng tệp một mục khai, (c) bên gọi không truyền cây, (d) `git ls-files` thất bại trong lưới trước-merge, Then (a) và (b) → `paths-khong-tro-toi-tep`, hồ sơ hoá cũ theo luật cũ; (c) → `apply: false` lý do `thieu-cay`; (d) → NOTE «bộ lọc paths không áp (thieu-cay)», danh sách luật cũ giữ nguyên; chiều đỏ: bản sao dựng cây bằng đọc đĩa → (a) ĐỎ ghim «cây đọc từ đĩa».
- AC-5: Given khoá `paths` và 19 ô ma trận D, mỗi ô chạy HAI diff (tệp đổi của ô · chỉ tệp mồi), When hỏi `pre-merge-check.sh` (hoá cũ?) và `repin-lane.mjs --skip-unchanged` (bỏ qua?), Then hai bên cùng kết luận ở 38/38 lượt (round-trip, hằng viết trước); chiều đỏ: bản sao làn không truyền cây → tập lượt lệch do code tính, phải chứa (D4, chỉ mồi), ghim «làn mù cây».
- AC-6: Given hồ sơ có ô `ui-check` khai `paths` (i) dạng khối có dòng chú thích và dòng trống giữa các mục, (ii) thư mục trần có thật, (iii) một dạng D9–D17 hoặc D19, và diff sau pin chạm tệp tương ứng, When làn ghim lại ghi pin, Then `evals_not_machine_touched` chứa ô đó ở cả ba ca; trên 19 ô ma trận D, tập id bản mới ⊇ tập id bản base (chỉ thêm, không bớt), mã thoát và việc ghi pin bằng hệt base; `repin-lane.mjs` không còn hàm đọc `paths` hay hàm khớp glob riêng (đo bằng hành vi ca (i), không bằng tìm chuỗi); chiều đỏ: bản sao làn dùng lại bộ đọc cũ → ca (i) ĐỎ ghim «bộ đọc riêng».
- AC-7: Given kho fixture KHÔNG bật khoá (`stale_scope` vắng) mà mọi `paths` dạng thường (D1–D3), When chạy `pre-merge-check.sh` và `repin-lane.mjs` (`--skip-unchanged` và `--write`), Then stdout, stderr (bỏ dấu thời gian) và dòng run-log BẰNG HỆT bản base (`git archive <merge-base> scripts lib feature-loop/scripts`), VÀ mỗi kịch bản đạt kết cục ghim trước ở CẢ HAI bản (lưới trước-merge: VIOLATION hoá cũ đúng một hồ sơ, mã thoát 1 · `--skip-unchanged` sau diff ngoài phần đo: làn chạy trọn · `--write`: thoát 0, đúng một dòng `kind: repin` mới) — bằng nhau mà kết cục sai là ĐỎ ghim «vi phân rỗng» (bài học Ngoài-7 của mốc 2.23.0); chiều đỏ: bản sao đổi mặc định khoá vắng thành `paths` → vi phân khác, ghim «đổi mặc định».
- AC-8: Given `--ag-root` trỏ một bộ máy thiếu `phanLoaiMucPaths` (bản sao gỡ export), When làn chạy với khoá `paths`, Then làn dừng mã khác 0, thông điệp gọi tên `phanLoaiMucPaths` và mốc cần, KHÔNG ghi tệp nào trong hồ sơ; và When làn chạy với khoá VẮNG trên cùng bộ máy, Then làn chạy và ghi pin như thường, `evals_not_machine_touched` vắng, stderr có đúng một dòng «bộ máy thiếu phanLoaiMucPaths — không tính được ô ngoài làn máy có vật đổi»; đối chứng dương: bộ máy đủ → làn chạy, ô chạm hiện đủ; chiều đỏ: bản sao biến hàng thành vô điều kiện → ca khoá vắng thoát khác 0, ghim «khoá vắng mà đòi bộ máy mới».
- AC-9: Given khối marker mã lý do trong `lib/evidence-core.cjs` (nguồn của mọi mã bộ lọc phát), When đọc GUIDE §7.1, Then đoạn `stale_scope` nêu MỌI mã trong khối (rút từ lib, không danh sách tay) kèm việc kho làm với mã ấy, và không còn câu «Chưa bật `stale_scope: paths` ở kho nào»; CHANGELOG có mục chưa phát hành nêu điều kiện bật; chiều đỏ: bản sao lib thêm một mã vào khối → ĐỎ ghim tên mã thiếu trong GUIDE.

## Coverage

- Quét bằng `morphological-scan` (preset test-matrix). Chân sản phẩm: engine `lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`, `feature-loop/scripts/repin-lane.mjs` [SUY-TỪ-REPO]; dạng khai thật của crm [SUY-TỪ-REPO: _acceptance/loc-paths-dong-mac-dinh/opportunity.md].
- Chân ngành: `on.push.paths` của GitHub Actions — `docs` không khớp tệp bên trong [NGÀNH: GitHub Actions workflow syntax]; CODEOWNERS coi `/` cuối là cả thư mục [NGÀNH: GitHub CODEOWNERS].

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Dạng mục | 18 dạng của ma trận D (D1–D17, D19) | lưới crm (7 LỖI + 1 CẢNH BÁO) + phân loại 5 333 mục crm 06/10 |
| B. Cây | có · không · thư mục chỉ trên đĩa · tệp xoá trong diff · ls-files lỗi | hai đường gọi |
| C. Bên hỏi | lưới trước-merge · `--skip-unchanged` · `chamTuPin` | AC-7 vòng paths (một nguồn) |
| D. Khoá | vắng · `paths` | vi phân bản base |

- Core → AC-1…AC-9.
- Later: brace `{a,b}` (hôm nay chữ thường → rơi «không trỏ», đóng) — mở khi một kho khai thật.
- Never: dựng cây từ đĩa (sai nghĩa vật đo).

## Đường đo

- «Mọi dạng lưới crm chặn đều bị từ chối»: AC-2 trên kho fixture · lúc cắt mốc chạy lưới crm và bộ lọc trên cây crm `onehub` (lệnh ghi trong ghi chú mốc).
- «Áp được ≥ 115/167 hồ sơ crm»: lệnh một dòng gọi `staleByPaths(['x'], evals, { cay })` trên mỗi hồ sơ crm với cây `git ls-files` (cùng khuôn lệnh ghi chú mốc 2.21.0) · AC-1 bảo đảm hàm.
- «Phát lại tránh ≥ 33 % lượt hồ sơ»: mẫu số = mọi cặp (dòng `kind: repin` của crm có `ts` ≥ 27/09, hồ sơ) mà hồ sơ có một pin TRƯỚC đó; tử số = cặp mà `staleByPaths(git diff --name-only <pin trước> <sha> trừ luật cũ, evals.yaml tại <sha>, { cay: git ls-tree -r --name-only <sha> })` trả `apply: true, kept: []`. Lệnh một dòng theo đúng định nghĩa này ghi vào ghi chú mốc cùng lệnh 115/167 · AC-5 bảo đảm làn và lưới cùng một hàm.
- «Kho không bật khoá giữ từng byte»: AC-7.

## Out of scope

- Đổi mặc định khoá, thêm khoá, thêm lệnh, chế độ cảnh-báo-thay-chặn.
- Bộ đọc `paths` của `carry-plan.mjs` (đường verdict S4).
- Tự sửa `paths` của kho tiêu thụ; gỡ lưới tạm ở crm (việc của crm khi nhận mốc).
- Quét thước hằng tuần của crm.

## Notes

- Ghi chú cho mốc mang vòng này: crm gỡ `scripts/kiem-paths-dong.mjs` và bước CI «Paths đóng mặc định» trong `.github/workflows/acceptance.yml`; trước khi gỡ, chạy cả hai trên cùng cây — mọi mục lưới báo LỖI phải là mục bộ lọc từ chối.
- Đóng hàng sổ `lan-ghim-lai-theo-paths#ngoai-1` (hai bộ đọc trong làn) khi ký.
