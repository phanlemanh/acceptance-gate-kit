# Hạt giống — «Việc kế theo plan» và hạt giống, đọc chứ không giữ

**Ngày:** 2026-09-06 · **Trạng thái:** hạt giống, chờ mốc 09/10 của OneFlow rồi mới xét mở ô ·
**Hạng dự kiến:** T2 (phần B), gói riêng cùng kho (phần C)

**Sinh từ:** owner hỏi 05/09 *«roadmap dài hơi nhiều phiên, làm sao mỗi phiên giữ bối cảnh và
kiểm tiến độ theo thời gian; product-map có giải quyết không?»* — trả lời: không, bản đồ là ảnh
chiếu sự thật, không biết ý định. Review 05/09 có phản biện context sạch (6 finding, 2 HIGH),
so sánh kit trước/sau, so sánh gói riêng/trong kit. Owner gật 06/09 hai điều: B trước C, B trong
kit còn C là gói riêng; OneFlow chờ mốc 09/10 mới sửa `plan:check`, làm phần T1 ngay.

## 0. Tóm tắt một đoạn

Kit đọc được **ý định** của repo (khối plan và mục hạt giống) để đầu mỗi phiên trả lời «việc
kế là gì, việc gì đang trễ, ý nào sắp mất», mà **không bao giờ giữ hay sửa** ý định đó. Sự
thật vẫn chỉ ở hồ sơ `_acceptance/`. Hai phần: **B** là một ổ cắm chỉ-đọc trong kit (một khoá
config, ba dòng trên thẻ start); **C** là gói riêng cùng kho, cắm vào B, chỉ mở khi B đã chạy ở
hai repo mà vẫn thiếu phép so thật-với-dự-kiến hoặc luật băng dùng chung.

## 1. Lỗ — bằng chứng đo được (OneFlow, 04–05/09)

| # | Điều đo được | Việc của ai |
|---|---|---|
| 1 | Thẻ `/acceptance-gate:start` không biết plan: phiên 05/09 mất bốn lượt đọc file mới tìm ra hàng kế (B2) và hạn làn owner (A6) | kit |
| 2 | `pnpm plan:check` của repo in một con số (★ 2/16), không in hàng đang dở, hàng kế, hạn gần nhất | repo |
| 3 | Trạng thái hàng là chữ gõ tay; hàng B2 vẫn ⬜ khi hồ sơ đã `verified`; chỉ ✅ nói dối mới bị bắt | repo |
| 4 | Lịch tuần và luật tái hoạch chỉ sống trong văn xuôi thiết kế | repo |
| 5 | Hạt giống nấc 1 (ý chưa có file) lẫn trong bảng «Xếp lại sau» 17 dòng; **chính kho này có 22 file `docs/plans/*-hat-giong-*.md` không thẻ nào đếm** | repo + kit |
| 6 | Bộ sinh bản đồ trong cache kit xếp nhóm khác bộ kiểm vendored của OneFlow; sinh lại làm CI đỏ 5 chỗ | kit (phân phối), không phải plan |

Ba trong sáu là việc của repo. Cái kit thiếu thật: **một dòng trên thẻ start** và **một cách
đếm hạt giống nấc 1**.

## 2. Mô hình ba lớp và bốn luật ranh giới

| Lớp | Trả lời | Ai ghi | Bản chất |
|---|---|---|---|
| Plan trong roadmap | sẽ đi đâu, thứ tự, ★, làn, hạn | người, tại mốc | ý định, là cược |
| Hồ sơ `_acceptance/<slug>/` | việc đã qua cổng nào, ai ký | các cổng của kit | sự thật |
| Bản đồ sản phẩm | toàn cảnh nấc của các việc | máy sinh | ảnh chiếu của sự thật |
| Tiến độ | thật trừ dự kiến | máy in | hiệu số, không phải tài liệu |

1. Plan không tự khai sự thật: ô ✅ suy từ hồ sơ; ô ◐ **chỉ in, không ghi vào file** (ghi vào
   file là đỏ oan giữa hai cổng người và làm bằng chứng ôi — bản đồ cố ý nhóm thô vì lẽ này).
2. Ánh xạ hàng ↔ hồ sơ hai chiều, khai **ba loại hàng**: có slug · kiểm cơ hội · tin theo lời.
   OneFlow có 8/20 hàng không slug; máy in số hàng «tin theo lời» thay vì giả vờ suy được.
3. Băng đóng thì hồ sơ mở ngoài plan là đỏ — luật của repo (hoặc tuỳ chọn của gói C), không
   phải mặc định của kit.
4. Bản đồ chỉ sinh lại; lệch hồ sơ là đỏ. Plan không thay bản đồ, đứng cạnh. Từ điển đã ghi
   «Product map, _Avoid_: roadmap» — giữ nguyên.

## 3. Đề xuất — hai phần, hai gói

**B — ổ cắm trong kit, chỉ đọc.**
- Khoá config `plan.block: <file>#<marker>`; vắng thì im, không cờ, không lỗi (khuôn ổ cắm
  trung tính như `discovery.brainstorm_skill`).
- `start-scan.mjs` đọc khối, đối chiếu slug với hồ sơ qua thư viện có sẵn (biết
  `machine-cleared`), thêm vào JSON và thẻ ba dòng: «việc kế theo plan: <hàng>», «tin theo lời:
  n», «hạt giống: n, cũ nhất x ngày».
- Kit KHÔNG sở hữu guard plan, KHÔNG ghi gì vào plan, KHÔNG đưa script nào vào CI của repo.

**C — gói riêng cùng kho, cắm vào B (sau, có điều kiện).**
- Khuôn khối plan, phép so thật với dự kiến, đóng băng tuỳ chọn với ba lý do ngoại lệ có tên,
  răng cho tất cả.
- Phụ thuộc một chiều vào kit như `feature-loop`: giải đường dẫn qua `resolve-plugin.mjs`, ghi
  khoá dưới tên riêng trong config qua `config-patch.mjs`, tự lo danh sách file chép sang CI kèm
  phép kiểm «bản chép khớp plugin».
- Kit không biết C tồn tại ngoài ổ cắm B.

Vì sao chia: B là một dòng của nghi thức đầu phiên nên không tránh được việc chạm kit; C có vòng
đời, từ điển và guard riêng nên đứng ngoài để repo không dùng plan không phải mang khái niệm
hàng, ★, băng. Tiền lệ: `feature-loop`, `diagram-design` là gói riêng cùng kho, cùng dogfood,
cùng lượt phát hành.

**Không làm:** không đưa ★, làn, ngưỡng 85%, ba lý do ngoại lệ, mốc 09/10 vào kit dưới dạng
hằng · không để kit ghi bất kỳ ô nào của plan · không kit-hoá nấc 2 hạt giống (thẻ start đã
có «Đang cân nhắc» kèm tuổi và cờ quá hạn) · không viết bộ đọc frontmatter thứ hai · không
sinh lại bản đồ bằng bộ sinh cache khi bộ kiểm vendored chưa nâng theo.

## 4. Hạt giống — hai nấc

- Nấc 1 (tên, một câu, ngày gieo, chưa có file): mục riêng trong roadmap của repo. Kit chỉ đếm
  và in tuổi qua ổ cắm B.
- Nấc 2 (ô cơ hội đang cân nhắc): kit đã có. Không dựng lại.
- Tại mốc tái hoạch mỗi hạt một trong ba phán quyết: giữ · gieo · bỏ có lý do. Luật của repo.
- `docs/plans/*-hat-giong-*.md` là vùng nháp không guard; muốn máy nhớ thì có một dòng nấc 1
  trỏ tới.

## 5. Chiều đỏ — khai trước

- Ổ cắm B: khoá trỏ file/marker không tồn tại → thẻ in cờ vàng có tên, KHÔNG im lặng và KHÔNG
  chặn; khoá vắng → không in gì (ca round-trip P: vắng ≠ hỏng).
- Hàng khai slug mà hồ sơ không có → «tin theo lời» tăng 1 và thẻ nêu tên hàng.
- Bộ đếm hạt giống: mục vắng → 0 và không cờ; hạt không có ngày gieo → cờ «chưa rõ tuổi»
  (cùng luật `ageTied` của «Đang cân nhắc»).

## 6. Ngưỡng và điều kiện dừng (đề xuất — owner chốt cùng lượt Cổng Đáng)

| Thước | Số | Cách đo |
|---|---|---|
| Repo thứ hai | ≥ 1 repo ngoài OneFlow khai `plan.block` trong 30 ngày sau khi B phát hành | tìm khoá trên các repo đã init; không đạt thì bỏ C, giữ B |
| «Việc kế» đúng | ≥ 8/10 phiên start liên tiếp trên OneFlow sau 09/10, slug thẻ in trùng slug hồ sơ đổi trạng thái kế tiếp | so thẻ với lịch sử commit của hồ sơ |
| Không đỏ vì lệch tầng | 0 lần CI đỏ trên nhánh chính trong 20 lần chạy đầu do bản chép khác bản plugin; hàng «tin theo lời» ≤ 20% | log CI + đếm hàng |
| Hạt giống không mất | mọi hạt quá 30 ngày có một phán quyết tại mốc; số hạt «không ai đụng» về 0 sau mỗi mốc | thẻ start sau mốc |

Dừng: tại mốc 09/10 OneFlow phải đổi cột hay luật của khối plan; hoặc không có repo thứ hai;
hoặc kit chưa có phép kiểm «bản chép khớp plugin» (C không mở hợp đồng, chỉ dừng ở ô).

## 7. Trình tự và quan hệ

1. Ngay (OneFlow): mục «Resume here» trong CLAUDE.md (T1); tách bảng park/hạt và `plan:check`
   in việc kế chờ mốc 09/10 vì băng đóng.
2. Sau mốc 09/10: nếu số của OneFlow không đòi đổi khuôn, mở ô cơ hội trong kho này cho **B**
   với bốn ngưỡng ở §6.
3. Chỉ khi B chạy ở hai repo mà vẫn thiếu: mở ô cho **C** như gói riêng cùng kho.

Quan hệ: ADR 0007 (bản đồ miễn T1 vì máy sinh toàn phần — plan là ý định người nên KHÔNG
miễn) · `start-scan.mjs` nhóm `considering` (nấc 2 đã có) · ổ cắm `discovery.brainstorm_skill`
(khuôn ổ cắm trung tính) · OneFlow `docs/roadmap.md` khối plan-freeze và
`scripts/roadmap/check-plan-freeze.mjs` (bản mẫu repo-local, guard chỉ builtins).
