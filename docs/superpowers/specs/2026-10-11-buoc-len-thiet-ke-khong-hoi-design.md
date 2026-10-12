# Bước lên thiết kế không hỏi người những câu mà người luôn trả lời theo khuyến nghị — thiết kế

**Hồ sơ:** `_acceptance/buoc-len-thiet-ke-khong-hoi/` · **Hàng lộ trình:** A2 · **Hạng:** T3 (theo hàng
và lời giao; đường tệp dự kiến không chạm `t3_paths` nên máy suy T2 — máy không tự đổi) · **Ngày:** 11/10/2026

## 1. Vì sao

Ô cơ hội đã ký (`build`, 11/10). Số đo nằm ở `_acceptance/buoc-len-thiet-ke-khong-hoi/do-11-10/`:

- Sổ bước thiết kế của crm, 22/09–11/10: 51 lựa chọn chủ kho trả lời giữa bước thiết kế — **28** có căn
  cứ máy đã có (22 mục tiêu + quy tắc đã khai, 6 chỉ một lối ra sống), **23** chỉ người có.
- Transcript máy này: 10/10 câu có căn cứ được trả lời theo khuyến nghị; 0/8 câu chỉ-người-biết được trả
  lời theo khuyến nghị.
- Tuần 41 vẫn 14/65 vòng crm có lựa chọn của chủ kho giữa bước thiết kế — chưa tự tan.

Nguồn của trạm thu phí là chính lời dặn của kit: S1 mục 1 bảo máy «hỏi đáp làm rõ như thường lệ» và in
`/goal` kèm «mỗi câu XIN DUYỆT thiết kế». Khối «Trong đợt» (DP7) đã bỏ chỗ dừng này cho phiên thợ; ngoài
đợt thì chưa.

## 2. Ý định (cố định trong vòng)

Bước thiết kế không dừng hỏi người. Lựa chọn nào máy đã có căn cứ thì máy quyết, ghi sổ, mở cửa veto;
lựa chọn chỉ người biết, hoặc chạm khó-đảo, vẫn là câu hỏi — nhưng gom lên thẻ Cổng Phạm vi, đi cùng chữ
duyệt, không thêm lượt. Một câu thật sự chỉ-người-biết mà máy tự quyết thì phải ĐỎ ở chỗ máy kiểm được.

## 3. Thiết kế

### 3.1 Luật bước thiết kế (ngoài đợt)

S1 mục 1 viết lại. Máy vẫn gọi brainstorming để nghĩ, nhưng không mở hỏi-đáp với người: tự trả lời từ ô
cơ hội đã ký, câu giao của hàng, luật kho (CLAUDE.md · AGENTS.md · CONTEXT.md · ADR) và vật đã có. Mỗi
lựa chọn mà brainstorm lẽ ra hỏi được xếp theo **nguồn căn cứ**:

| Nguồn | Khi nào | Máy làm gì |
|---|---|---|
| mục tiêu + quy tắc đã khai | trỏ được MỘT tệp có từ trước vòng + câu trích nguyên văn quyết được lựa chọn | quyết, ghi dòng sổ mang con trỏ |
| chỉ một lối ra sống | các lối khác chết vì một ràng buộc nêu được | quyết, ghi dòng sổ mang câu «lối khác chết vì» |
| chỉ người có | gu nhìn, nghĩa sản phẩm người dùng thấy, đánh đổi giá trị, khẩu vị rủi ro, sự kiện chỉ chủ kho biết, việc luật đòi người ký (CỘNG) | KHÔNG hỏi giữa chừng: soạn nháp theo khuyến nghị, ghi dòng sổ dạng câu hỏi (khuyến nghị + lối khác + giá đổi) |
| (mọi nguồn) chạm khó-đảo | ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho | luôn là câu hỏi, bất kể nguồn |

Không trỏ được căn cứ thì là «chỉ người có», không phải «mục tiêu». Không dừng xin duyệt thiết kế, không
hỏi «làm ngay chứ?» — HARD-GATE của brainstorming gộp vào Cổng Phạm vi (đúng như S1 mục 5 đã nói).
Đề bài mơ hồ vẫn soạn nháp theo khuyến nghị; Cổng Phạm vi dừng chờ người theo bất biến dừng có sẵn.

Điểm vũ trang `/goal` đầu tiên dời về lời mời Cổng Đáng của ô (lượt người cuối trước Cổng Phạm vi khi
vòng mở từ ô). Vòng mở từ một câu mô tả chạy S0 → Cổng Phạm vi trong cùng lượt, không cần vũ trang.

Khối TRONG-DOT không đổi một byte; nó đã bỏ hỏi-đáp trong đợt và luật mới không mâu thuẫn với nó (dòng
`approach` của nó mang thêm khoá căn cứ theo khuôn chung).

### 3.2 Khoá `can_cu` trên dòng sổ bước thiết kế

Một khoá tuỳ chọn, máy đọc, nằm sau `cost_if_wrong` — cùng cách khuôn `target` của dòng `fix` đang
làm. Ba câu người đọc (`decision` · `why` · `cost_if_wrong`, ADR 0021) giữ nguyên; `can_cu` không phải
câu thứ tư để đọc mà là con trỏ cho máy kiểm. Khuôn (marker `DEC-CAN-CU-SLOT` trong SKILL, mục «Sổ
quyết định»):

```
,"can_cu":{"nguon":"muc-tieu","kho_dao":false,"tep":"<đường dẫn tương đối gốc kho>","trich":"<câu trích nguyên văn, một dòng>"}
,"can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"<lối khác chết vì sao, 1 câu>"}
,"can_cu":{"nguon":"chi-nguoi","kho_dao":false,"khuyen":"<lối máy khuyên, 1 câu>","loi_khac":"<lối khác — giá nếu chọn nó, 1 câu>"}
```

Chỉ dòng `stage: "S1"` mang khoá. Dòng không có khoá là dòng đời trước — đọc như cũ.

### 3.3 Bộ phân loại (`scripts/can-cu-s1.cjs`)

Một mô-đun, ba người dùng: thẻ Cổng Phạm vi, lệnh đếm của đường đo, bộ kiểm. Đặt ở `scripts/` cạnh
`ho-so-tom-tat.cjs` (không `lib/`, không cổng chặn gộp). Mỗi dòng S1 ra đúng một lớp:

| Lớp | Điều kiện |
|---|---|
| `da-quyet` | nguồn mục-tiêu hợp lệ, hoặc một-lối có `loi_chet`, và `kho_dao` không bật |
| `cau-hoi` | nguồn chỉ-người có `khuyen` + `loi_khac` (khó-đảo hay không) |
| `do` | một trong các lý do đỏ dưới, mỗi lý do một thông điệp ghim |
| `doi-truoc` | không có `can_cu` |
| `bi-thay` | một dòng sau trong cùng sổ mang `supersedes` == mã dòng này (không lên khối nào của thẻ) |

Lý do đỏ (thông điệp ghim, hằng trong mô-đun):

| Mã | Thông điệp |
|---|---|
| `nguon-la` | nguồn căn cứ lạ |
| `kho-dao` | khó-đảo luôn là câu hỏi cho người |
| `thieu-con-tro` | thiếu con trỏ căn cứ (tệp + câu trích) |
| `tep-vang` | tệp căn cứ không có |
| `trich-ngan` | câu trích quá ngắn để làm căn cứ |
| `trich-vang` | câu trích không có trong tệp căn cứ |
| `tu-bien-minh` | căn cứ trỏ vào vật của chính vòng |
| `o-chua-ky` | căn cứ là ô cơ hội chưa ký |
| `sinh-trong-vong` | câu trích không có ở gốc nhánh — căn cứ sinh trong vòng |
| `thieu-loi-chet` | một lối ra nhưng không nói lối khác chết vì sao |
| `thieu-khuyen` | câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác |

Chi tiết luật con trỏ:
- `tep` tương đối gốc kho, không thoát ra ngoài gốc.
- «Vật của chính vòng» = mọi tệp dưới `_acceptance/<slug>/` trừ `opportunity.md`, tệp `design_doc` của
  hợp đồng, tệp `docs/superpowers/{specs,plans}/*<slug>*`.
- `opportunity.md` của chính vòng hợp lệ khi đã ký (`decision` và `decided_by` không rỗng).
- Câu trích so sau khi gom khoảng trắng; dưới 20 ký tự là quá ngắn.
- Có gốc nhánh → câu trích phải có ở tệp đó tại gốc (trừ ô đã ký của chính vòng). Không có gốc → không
  đỏ, ghi chú «chưa kiểm câu trích có từ trước vòng»; gốc không đọc được → cờ vàng, không đỏ.

### 3.4 Thẻ Cổng Phạm vi

- Khối mới **«Câu chỉ anh trả lời được»**: mỗi câu một dòng `Hỏi-<n>` — lựa chọn, máy khuyên gì, lối
  khác và giá; nhãn «khó-đảo» khi bật.
- Khối mới **«Máy đã quyết ở bước thiết kế — anh lật được»**: lựa chọn + «căn cứ: «trích» (tệp)» hoặc
  «lối khác chết vì: …».
- Khối «Quyết định & trade-off» giữ nguyên cho phần còn lại (dòng đời trước, dòng đỏ, dòng ngoài S1).
- Mỗi dòng đỏ một cờ đỏ «Sổ bước thiết kế — <mã dòng>: <thông điệp>»; có dòng đỏ thì dòng lệnh duyệt
  KHÔNG điền sẵn (cùng luật với các cờ đỏ hiện có).
- «VIỆC CỦA ANH» thêm một mục mỗi câu hỏi; câu trả lời mẫu giữ nguyên «duyệt hay sửa: ___» — «duyệt» là
  nhận mọi khuyến nghị, chọn lối khác thì «sửa: Hỏi-<n> = <lối>». `routing.hoi` của bản rút thêm
  `Hỏi-<n>`.
- Bản rút (`--extract`) thêm khoá `can_cu` = `{cau_hoi, da_quyet, do, doi_truoc, goc}`.
- Gốc nhánh lấy từ cờ `--glossary-base` sẵn có (lối duy nhất thẻ được chạm git). Lệnh dựng thẻ
  (`commands/acceptance-card.md` bước 3) truyền cờ đó cả khi sổ bước thiết kế có dòng mang `can_cu`, không
  chỉ khi kho có CONTEXT.md. Hồ sơ `draft` có dòng nguồn mục-tiêu mà thẻ không nhận gốc → một cờ vàng «chưa
  kiểm câu trích có từ trước vòng», không chỉ một ghi chú.
- Hồ sơ `draft` có dòng S1 đời trước → một cờ vàng; hồ sơ đã qua Cổng Phạm vi không có cờ này.

### 3.5 Điều kiện dừng ở Cổng Phạm vi

Danh sách «Gate 1 khi T2 KHÔNG đủ điều kiện đi tiếp» ở đầu skill thêm một vế: sổ bước thiết kế còn câu
chỉ-người-biết hoặc dòng đỏ. S1 mục 5 nói lại điều đó ngay chỗ render thẻ.

### 3.6 Phản biện context sạch soi căn cứ

S1 mục 7, ý (4) cross-check thêm, với MỌI dòng sổ S1 máy đã quyết:
- lựa chọn có chạm ship ra người dùng thật, xoá dữ liệu hay cam kết ra ngoài kho không — chạm mà
  `kho_dao` ghi false → P0;
- nguồn mục-tiêu: câu trích có QUYẾT lựa chọn đó không hay chỉ liên quan — không quyết → P0;
- nguồn một-lối: lối khác có thật chết vì ràng buộc nêu được không — không → P0;
- có lựa chọn nào trong design/contract là «chỉ người có» mà sổ ghi máy đã quyết, hoặc không ghi gì → P0.

P0 ở đây xử lý bằng một dòng S1 mới mang `supersedes` (thường thành câu hỏi). Đây là đối kháng máy thay
mắt người cho đúng ba nhãn máy tự gán (`nguon`, `kho_dao`, `loi_chet`) mà bộ kiểm tất định không đọc nghĩa
được (mục 4). Ca thật: phản biện của chính vòng này bắt hai dòng mục-tiêu có câu trích không quyết
(bỏ bản mẫu nhìn, chỗ đặt mô-đun) — cả hai đã được thay.

### 3.8 Lật ở Cổng Phạm vi ghi một dòng sổ

Người trả «sửa:» ở Cổng Phạm vi mà đổi một lựa chọn đã ghi ở bước thiết kế → trước khi soạn lại, máy
ghi MỘT dòng sổ theo khuôn marker `DEC-LAT-GATE1` (mục «Sổ quyết định»): `stage: gate1`, `supersedes` =
mã dòng S1 bị đổi, `decided_by` = tên người, `decision` = lựa chọn mới theo lời người. Đây là bên viết
của cột «máy quyết bị lật» (3.7); không có nó, bộ đếm đọc 0 mãi.

### 3.7 Đường đo

| Thước của ngưỡng | Số từ đâu | AC |
|---|---|---|
| 0 lần máy dừng hỏi giữa mở vòng và Cổng Phạm vi | `do-11-10/s1_hoi.py` chạy trên transcript của máy chạy vòng crm (đã có, đọc ở phiên nghiệm thu) | — (công cụ đo có sẵn trong hồ sơ) |
| 0 vòng ký lại vì lựa chọn máy tự quyết bị lật | `node scripts/can-cu-s1.cjs --root <kho crm> --dem` — cột «máy quyết bị lật» = dòng `stage: gate1` có `supersedes` trỏ một dòng S1 lớp `da-quyet` (bên viết: khuôn `DEC-LAT-GATE1`, 3.8) | AC-7 |

## 4. Giới hạn đã khai (kèm ngưỡng đang đếm)

- **Máy dán nhãn «mục tiêu» cho câu chỉ-người-biết bằng một câu trích CÓ THẬT, có từ trước vòng nhưng
  không quyết được lựa chọn** — bộ kiểm tất định không bắt được (nó kiểm vật, không kiểm nghĩa). Lưới:
  phản biện context sạch (3.6) + thẻ in câu trích cạnh lựa chọn. Ngưỡng mở ô: ≥ 1 lần chủ kho lật một
  dòng `da-quyet` ở Cổng Phạm vi (đếm bằng `--dem`).
- **`kho_dao` và `loi_chet` cũng là nhãn máy tự gán** — bộ kiểm chỉ đọc chúng, không đọc nghĩa: một lựa
  chọn xoá dữ liệu ghi `mot-loi`, `kho_dao:false` vẫn ra `da-quyet`. Lưới: phản biện context sạch soi mọi
  dòng máy đã quyết (3.6) + thẻ in lựa chọn trong khối «anh lật được». Ngưỡng mở ô: ≥ 1 dòng `da-quyet`
  chạm khó-đảo bị lật ở Cổng Phạm vi (đếm bằng `--dem` + đọc dòng lật).
- Câu trả lời khác khuyến nghị cho một câu hỏi vẫn đi lối «sửa:» như hôm nay (soạn lại, trình lại). Câu
  gộp áp lối khác trong cùng lượt ký là câu hỏi cho chủ kho ở Cổng Phạm vi của vòng này (chạm lệnh duyệt,
  ngoài ranh giới tệp lời giao); khuyến nghị: hàng riêng ngay sau vòng này.
- Lượt dừng giữa bước thiết kế chỉ đếm được trên transcript của máy chạy vòng.

## 5. Phương án đã cân

- **Bỏ hỏi toàn bộ:** loại — 23/51 lựa chọn là câu thật.
- **Ghi căn cứ thành tiền tố trong câu `why`:** không đổi khuôn sổ, nhưng máy phải bóc chữ người — đúng
  lớp lỗi «tiếng người vào ô máy đọc». Loại; giữ là lối khác của câu hỏi CỘNG trên thẻ.
- **Thêm loại dòng mới (`type: hoi`):** bộ đọc đếm theo `type` (sức khoẻ vòng, tóm tắt hồ sơ) sẽ đếm
  sai; khoá tuỳ chọn không chạm bộ đọc nào.
- **Đặt bộ phân loại vào cổng chặn gộp:** mọi kho trả giá ở CI, lõi cưỡng chế chỉ được cộng thêm; thẻ +
  điều kiện dừng đủ cho vòng này (Later, mở khi một dòng đỏ lọt tới lúc gộp).

## 6. Tệp dự kiến

`feature-loop/skills/feature-loop/SKILL.md` (S1 mục 1, 4-cuối, 5, 7; mục «Sổ quyết định» thêm hai khối
khuôn `DEC-CAN-CU-SLOT` và `DEC-LAT-GATE1`; một vế ở danh sách dừng đầu skill) · `scripts/can-cu-s1.cjs`
(mới) · `scripts/gate-card.js` (Cổng 1) · `commands/acceptance-card.md` (bước 3: khi nào truyền gốc) ·
`tests/scripts/can-cu-s1.ca.mjs` (mới, gọi từ phần bash của `tests/scripts/run-tests.sh`) ·
`tests/plugins/run-tests.sh` (P85b đổi kim theo chữ mới) · `GUIDE.md` (mục sổ) · `CONTEXT.md` (thuật ngữ
«Nguồn căn cứ») · `docs/adr/0022-can-cu-lua-chon-buoc-thiet-ke-la-khoa-may-doc.md`. KHÔNG chạm:
`_acceptance/config.yaml` (sửa nó làm cũ hồ sơ khác), khối TRONG-DOT, `feature-loop/scripts/`,
`feature-loop/workflows/`, `dieu-phoi/`, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `lib/`, `hooks/`, cổng
chặn gộp, lệnh duyệt.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: máy dựng thẻ Cổng Phạm vi → người đọc «Câu chỉ anh trả lời được» rồi «Máy đã quyết» → gõ một dòng duyệt (điểm ra: lệnh duyệt)
- Biên: sổ không có dòng S1 nào (thẻ như hôm nay) · chỉ có dòng đời trước (khối cũ + một cờ vàng khi hợp đồng còn nháp)
- Lỗi & quay lại: có dòng đỏ → cờ đỏ đầu thẻ, dòng lệnh để trống → máy sửa sổ hoặc người trả lại bằng «sửa:»

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Thẻ Cổng Phạm vi | cho người biết máy đã quyết gì, còn hỏi gì, trước khi duyệt | lời mời cổng / lệnh duyệt |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-the-co-cau-hoi | Thẻ Cổng Phạm vi | khối «Câu chỉ anh trả lời được» với Hỏi-1…n; VIỆC CỦA ANH có từng câu | duyệt (nhận khuyến nghị) hoặc «sửa: Hỏi-n = lối» |
| ST-the-chi-may-quyet | Thẻ Cổng Phạm vi | khối «Máy đã quyết ở bước thiết kế» với câu trích + tệp | duyệt, hoặc lật một dòng bằng «sửa:» |
| ST-the-co-dong-do | Thẻ Cổng Phạm vi | cờ đỏ từng dòng + dòng lệnh CHƯA điền sẵn | chờ máy sửa sổ, hoặc trả lại |
| ST-the-doi-truoc | Thẻ Cổng Phạm vi | khối «Quyết định & trade-off» như cũ + một cờ vàng (hợp đồng nháp) | duyệt như hôm nay |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Thứ tự khối: câu hỏi trước, máy đã quyết sau, trade-off chung cuối — người đọc việc của mình trước.
- Câu trích in nguyên văn trong «», tên tệp trong ngoặc; dài quá 200 ký tự thì cắt có dấu «…».

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| khối `lab` + `grp` + `li` của thẻ | dùng | cùng khuôn mọi khối của thẻ |
| cờ `flag fred` / `fwarn` | dùng | cùng luật cờ đỏ/vàng hiện có |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: một-cột-cuộn
Căn cứ: thẻ Cổng Phạm vi hiện có là một cột cuộn; luồng hiển nhiên, không tra mẫu ngoài.
<!-- UX-SPEC-TEMPLATE>>> -->
