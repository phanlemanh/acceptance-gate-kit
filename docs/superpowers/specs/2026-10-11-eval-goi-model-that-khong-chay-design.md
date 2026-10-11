# Eval gọi model thật không chạy lại khi đầu vào không đổi (thiết kế)

**Ngày:** 2026-10-11 · **Hồ sơ:** `_acceptance/eval-goi-model-that-khong-chay/` · **Hạng:** T2 ·
**Hàng lộ trình:** G3 (mốc 01/11) · **Cổng Đáng:** owner «Làm» 11/10 (`opportunity.md`).

Gốc: crm/_acceptance/eval-model-that-dung-luc — crm tự dựng dùng lại cho MỘT eval (E15) và ghi
«bộ kit làm cho mọi eval model thật» ở Later/Out of scope. Lát này là Đ2 của hạt giống
`docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md` thu về eval model thật.

---

## 0. Hiểu đề

**Owner nói (hàng G3 + Cổng Đáng):** eval gọi model thật không chạy lại khi đầu vào không đổi;
bật khi «lượt ghim lại không đổi đầu vào của eval model thì chi phí model của eval đó bằng 0».
Chính sách chốt ở Cổng Đáng (máy áp, không hỏi lại): chỉ eval trong `feature_loop.model_evals`,
chỉ làn ghim lại, khoá bật theo lựa chọn, hạn 7 ngày, bên đọc pin không đổi.

**Số đo lại sau phản biện (11/10):** với cả năm lớp — tệp lệnh gọi tên giải theo `cd`, `bun.lock`
thay cho dấu vân tay — 14/44 lần chạy lại eval model ở crm có đầu vào không đổi (32 %; 9 lần trong 7
ngày 04–10/10), so với 17/44 ở ô cơ hội (ba lớp). Sau khi dựng, đo lại bằng chính hàm băm trên 44 cặp.

**Đề bài phiên điều phối thêm:** băm đầu vào gồm mọi thứ làm kết quả đổi (lệnh, tệp vào, phiên bản
model/gói); chiều đỏ bắt buộc — đổi một byte đầu vào → chạy lại; chiều im — không đổi → không gọi model.

**Thành công nghĩa là:** ở crm, một lượt ghim lại mà đầu vào của một eval model không đổi thì eval
đó không chạy (không tốn Gateway), pin vẫn mang mã thoát của lần thật sự chạy và NÓI RA nó dùng lại
từ lượt nào; đổi một byte bất kỳ đầu vào nào thì eval chạy lại; kho không bật khoá thấy làn y như 2.26.

## 1. Hiện trạng (đọc mã 11/10)

- `feature-loop/scripts/repin-lane.mjs` chạy `suite_keys` rồi MỌI eval `test`/`script` của từng hồ
  sơ, nối đuôi, mỗi lệnh khác nhau một lần (`results`, khoá = env + lệnh). Ghi dòng `repin`
  (`evals_exit` đủ mọi eval máy) + section `### Re-pin` + tự kiểm bằng `recheck-evidence.cjs`.
- `feature_loop.model_evals` (Vòng A, `lib/lan-khoa.mjs`) chỉ làm hai việc: không chạy lại khi đỏ
  (`coChayLai`), và đếm (`tong_ket.model_goi`). `tong_ket.model_carry` là ô giữ chỗ, cố định 0.
- Khoá `long_running` (N8, `lenh-dai-chay-rieng`) chỉ có nghĩa ở lượt chấm S4 (lệnh chạy nền dưới
  trần công cụ của tác tử chấm). Làn ghim lại chạy lệnh bằng `chayLenh` trực tiếp, không có trần
  công cụ — nên vòng này không chạm `long_running`; `evalsChayRieng` của S4 cũng không đổi.
- Bên đọc pin (`lib/evidence-core.cjs` `checkRepinEvals`) đòi `evals_exit` đủ mọi eval máy, mã đạt
  kỳ vọng; khoá lạ bị bỏ qua.

## 2. Cơ chế

### 2.1 Một khoá, một hằng

| Khoá | Giá trị | Vắng |
|---|---|---|
| `feature_loop.model_carry_cmd` | lệnh in **dấu vân tay môi trường model** — id model mà nhà cung cấp trả, băm khoá gói (`bun.lock`…), phiên bản runtime nếu đáng kể. Đầu ra chỉ vào băm, KHÔNG bao giờ ghi ra | hành vi 2.26 nguyên văn: không băm, không dùng lại, lệnh không chạy |

Hằng (không thành khoá — YAGNI, tiền lệ Đ2): **hạn dùng lại 7 ngày** tính từ `ts` của dòng nguồn tới
lúc lượt này bắt đầu. Cờ dòng lệnh `--chay-lai-model`: ép mọi eval model chạy thật ở lượt này
(đường đảo rẻ, giống `--do-lai` của crm E15 và `--force` của bộ chạy tác vụ có băm đầu vào).

### 2.2 Băm đầu vào — năm lớp, một chỗ khai

Hàm thuần ở `feature-loop/scripts/lib/dung-lai-model.mjs`; danh sách lớp nằm trong khối marker
`CARRY-INPUT-LAYERS` (bên viết rút từ đó, ma trận ca chiều đỏ rút từ đó — số ca = số lớp, mỗi lớp
một ca đổi ĐÚNG lớp ấy và một phép phá bỏ ĐÚNG lớp ấy khỏi băm):

| # | Lớp | Nguồn |
|---|---|---|
| 1 | lệnh đã giải | `cmd` sau khi giải `config:` — đổi một khoá khác của `config.yaml` không đổi băm |
| 2 | tệp khớp `paths` | `đường<TAB>blob` của tệp git-theo-dõi tại `HEAD` khớp `paths` — CÙNG `evalPathsOf` + `phanLoaiMucPaths` + `pathGlobToRe` mà lưới hoá cũ dùng |
| 3 | cây hồ sơ | mọi tệp git-theo-dõi dưới `_acceptance/<slug>/` TRỪ hai tệp làn tự ghi (`run-log.jsonl`, `evidence-report.md`) — gồm `evals.yaml`, nên khối eval và mã thoát mong đợi đi qua lớp này |
| 4 | tệp lệnh gọi tên | tệp git-theo-dõi mà một từ của lệnh đã giải trỏ ĐÚNG tới — giải theo gốc kho VÀ theo mỗi thư mục `cd <dir>` trong lệnh (lệnh crm thật: `cd apps/agent && bun test test/x.spec.ts`); nháy được bóc, `--co=<tệp>` lấy phần sau `=`. Đối số của `cd` KHÔNG phải từ trỏ tệp, và tên thư mục không kéo cả thư mục vào băm (phản biện 11/10: `cd apps/agent` kéo trọn `apps/agent/` thì gần mọi commit đổi băm, dùng lại ≈ 0) — lệnh chạy cả thư mục thì tệp phải nằm trong `paths` |
| 5 | dấu vân tay môi trường | đầu ra của `model_carry_cmd` (chạy một lần mỗi lượt) |

Băm = sha256 của phiên bản khuôn + id eval + năm lớp theo thứ tự cố định. Dòng `repin` mang
`evals_hash: {Eid: <64 hex>}` cho mọi eval model đã băm được. (Bản nháp đầu có bảy lớp — «khối
eval» và «mã thoát mong đợi» riêng — đã gộp vào lớp 3: chúng nằm trong `evals.yaml` của hồ sơ nên
không đo tách được, giữ riêng là hai lớp không phép đo nào phân biệt được với lớp 3.)

### 2.3 Khi nào eval model LUÔN chạy (không dùng lại)

Hai khối marker ở bên viết giữ chữ lý do: `CARRY-LY-DO-CHAY` — mười lý do của điều kiện đủ (lệnh dấu vân tay thoát khác 0 · lệnh dấu vân tay hết giờ · lệnh dấu vân tay in rỗng · ép bằng `--chay-lai-model` · eval không khai paths · paths có mục không chứng được · cây hồ sơ có tệp chưa commit · làn chạy `--allow-dirty` · lệnh có biến hoặc thay thế lệnh của shell · lệnh đã chạy ở lượt này) — và `CARRY-LY-DO-NGUON` — bốn lý do của bước chọn nguồn (băm đổi · chưa có nguồn cùng băm · nguồn quá 7 ngày · cùng băm từng cho kết quả khác). Khoá vắng và eval không thuộc `model_evals` thì làn im như 2.26. Với mỗi eval model, làn in một dòng stderr
`feat E1: không dùng lại — <lý do>` hoặc `feat E1: dùng lại theo băm <8 ký tự> từ <run_id> (<ts>) — không gọi model`.

| Lý do | Vì sao |
|---|---|
| khoá vắng | hành vi 2.26 |
| lệnh dấu vân tay hỏng (thoát ≠ 0 · hết giờ 60 s · in rỗng — ba lý do riêng) | không biết model nào đang chạy; trần giờ giữ làn không treo khi lệnh dò mạng treo (làn ghim lại không có trần công cụ) |
| ép bằng `--chay-lai-model` | người muốn đo mới — lượt ép vẫn ghi băm nên thành nguồn mới cho lượt sau |
| eval không thuộc `model_evals` | phạm vi lát này — eval thường vẫn chạy mọi lượt |
| eval không khai `paths`, hoặc có mục `paths` không chứng được trỏ tới tệp | không biết đầu vào |
| tệp trong băm đang sửa chưa commit, có tệp chưa theo dõi trong cây hồ sơ, hoặc làn chạy `--allow-dirty` | băm tính trên `HEAD` sẽ không khớp thứ lệnh thật đọc |
| lệnh có biến hoặc thay thế lệnh của shell (`$`, backtick) | không biết lệnh đọc tệp nào — lớp 4 không giải được (phản biện Đ2 06/10, ô C15) |
| lệnh đã chạy ở lượt này (trùng nguyên văn một suite cùng môi trường) | đã trả tiền rồi — dùng kết quả vừa chạy |
| băm đổi (có lượt trước ghi băm khác) · chưa có nguồn cùng băm | xem 2.4 |
| nguồn quá 7 ngày | trần tuổi cho model trôi cùng id |
| cùng băm từng cho kết quả khác (`carry_lech`) | xem 2.5 |

### 2.4 Chọn nguồn

Đọc `_acceptance/<slug>/run-log.jsonl` của chính hồ sơ: nguồn là dòng `kind: repin` MỚI NHẤT mà
(a) `evals_hash[E]` bằng băm lượt này, (b) E **thật sự chạy** ở đó (không có trong `evals_carry`
của dòng ấy — chuỗi dùng lại dàn phẳng, luôn trỏ về lượt chạy thật), (c) `evals_exit[E]` đạt kỳ
vọng hiện tại, (d) `ts` không muộn hơn lúc lượt này bắt đầu và không quá 7 ngày trước đó. Dòng
`repin` chỉ được ghi khi làn xanh, nên nguồn luôn là một lượt đạt. Dòng đời trước không có
`evals_hash` → không là nguồn: lượt ghim lại đầu tiên sau khi bật khoá chạy trọn.

Hai lượt cùng giây (`ts` của làn đến giây) thì dòng đứng sau trong sổ thắng. Dùng lại → không chạy lệnh, `evals_exit[E]` = mã của nguồn, `evals_carry[E]` = `run_id` nguồn,
không cộng `model_goi`, cộng `tong_ket.model_carry`. Section `### Re-pin` thêm hậu tố
` · dùng lại theo băm đầu vào (không gọi model): E1←<run_id>`; dòng `[lane] TỔNG KẾT` in
`eval model thật: gọi N, carry M`.

### 2.5 Tự kiểm khi chạy lại cùng băm — `carry_lech`

Eval model chạy thật mà run-log có dòng `repin` trước đó nơi nó chạy thật với CÙNG băm nhưng mã
thoát KHÁC → dòng của lượt này (`repin` khi xanh, `repin-do` khi đỏ) mang `carry_lech: [E]` và
`evals_hash`; tổng kết in cảnh báo. Nghĩa: cùng đầu vào mà kết quả khác — hoặc `paths` thiếu đầu vào,
hoặc eval không tất định. Từ đó eval ấy KHÔNG dùng lại khi băm còn bằng băm đã lệch; đổi băm thì
được dùng lại trở lại. `carry_lech` ≥ 1 ở bất kỳ kho nào là ngưỡng mở vòng siết luật (§5).

### 2.6 Bên đọc pin không đổi

Dòng mới vẫn mang `evals_exit` đủ (mã của eval dùng lại chép từ nguồn), khoá mới bị bộ đọc hiện có
và bộ đọc của bản trước vòng bỏ qua → pin đọc được ở cả hai (đường đọc-cũ, không bắt kho tiêu thụ
chép lại lớp CI). Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`,
`scripts/recheck-evidence.cjs` → hạng T2.

## 3. Khoá vắng = như trước vòng

Hai vế, để phép đo không tự hết hạn khi vòng sau đổi làn (phản biện 11/10):

- **Vế sống** (cây đang kiểm, chạy ở mọi lượt ghim lại về sau): khoá vắng → không `evals_hash`,
  `evals_carry`, `carry_lech`; eval model chạy mọi lượt; lệnh dấu vân tay không chạy;
  `model_carry` = 0; tập khoá dòng `repin` bằng tập khoá khi khoá khai trừ đúng ba khoá ấy — so
  trong CÙNG cây, nên vòng sau thêm khoá chung không làm nó đỏ.
- **Vế đông cứng** (hai bản `git archive` cố định): làn của mốc `08ba287d` (merge-base) và làn của
  SAU-G3 — commit không-gộp mới nhất mang dấu `(eval-goi-model-that-khong-chay)` VÀ chạm
  `feature-loop/scripts/` (commit ký và commit ghim lại không chạm thư mục đó, nên SAU-G3 cố định sau
  khi gộp). Cùng kho thử khoá vắng: cùng số lần chạy mỗi lệnh, cùng tập khoá dòng `repin` và JSON
  stdout. Bên đọc cũ (AC-8) đi cùng khuôn: làn SAU-G3 ghi, bộ đọc của mốc đọc.

## 4. Đường đo (ngưỡng UAT ở `opportunity.md`)

Script mới `feature-loop/scripts/dem-dung-lai-model.mjs --root <kho> [--tu <YYYY-MM-DD>]` đọc mọi
`_acceptance/*/run-log.jsonl`, in một dòng tổng (`model_goi`, `model_carry`, số lượt mang
`carry_lech`), một dòng mỗi eval có dùng lại, một dòng «nguồn không có» cho mỗi `evals_carry` trỏ
run_id không có trong run-log của hồ sơ, và gắn nhãn từng lượt `carry_lech`: liệt tệp git đổi giữa
sha nguồn và sha lượt lệch (trừ hai tệp làn ghi) — rỗng → «lệch không tất định» (eval chập chờn cùng
đầu vào), khác rỗng → «nghi thiếu đầu vào: <tệp>» (tệp đổi mà băm không thấy). Ngưỡng CHẾT của ô cơ
hội đọc nhãn thứ hai. Ở crm, 14 ngày sau khi cài: `model_carry` ≥ 1 ở lượt
đủ điều kiện và `carry_lech` = 0 là SỐNG.

## 5. Giới hạn khai (mỗi cái một ngưỡng đang đếm)

- **`paths` thiếu đầu vào** → dùng lại kết quả mà đầu vào thật đã đổi. Ngưỡng: `carry_lech` ≥ 1 ở
  bất kỳ kho nào → mở vòng siết luật (ví dụ băm theo tệp lệnh nạp thật).
- **Tệp chưa theo dõi ngoài cây hồ sơ vô hình** với băm (như `--skip-unchanged`, ADR 0019). Cùng ngưỡng.
- **Model trôi mà giữ nguyên id** không bắt được trong 7 ngày — hạn là trần tuổi; owner đã chấp nhận
  ở crm E15 (10/10).
- **Bên đọc không chứng lại chuỗi dùng lại** (một dòng `evals_carry` viết tay trỏ một lượt không có
  vẫn qua). Ngưỡng mở vòng răng bên đọc (T3): ≥ 1 dòng `repin` mà `evals_carry` trỏ một `run_id` không
  có trong `run-log` của chính hồ sơ — đếm bằng `dem-dung-lai-model.mjs` (in dòng «nguồn không có»).

## 6. Tệp chạm

`feature-loop/scripts/repin-lane.mjs` · `feature-loop/scripts/lib/dung-lai-model.mjs` (mới) ·
`feature-loop/scripts/lib/lan-khoa.mjs` (khoá thứ sáu + tổng kết) · `feature-loop/scripts/dem-dung-lai-model.mjs` (mới) ·
`feature-loop/skills/feature-loop/SKILL.md` (khuôn REPIN-TEMPLATE + đoạn nghi thức) · `GUIDE.md` §7.1 ·
`CHANGELOG.md` · `tests/scripts/repin-lane-dung-lai-model.test.mjs` (mới) · `tests/scripts/gia-lan-fixture.mjs`
(eval khai `paths`) · `tests/scripts/repin-lane-khuon-gia.test.mjs` (5 → 6 khoá) · `_acceptance/config.yaml`
(khoá executor của eval) · hồ sơ.

## 7. Cách đo trong vòng

Ca bền ở `tests/scripts/repin-lane-dung-lai-model.test.mjs` trên kho fixture code-sinh
(`gia-lan-fixture.mjs`; pin do CHÍNH làn ghi — writer thật; bộ đếm lần chạy ghi NGOÀI kho). Mỗi AC
một chân `_acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs --ac <n>`: chiều xanh = đúng danh
sách ca viết trước trong `rang/ma-tran.mjs` đều PASS; chiều đỏ = mỗi phép phá áp vào bản sao
`git archive` của commit lõi mang dấu `(eval-goi-model-that-khong-chay)`, chỉ tính «đã bắt» khi bản sao
chạy tới ca VÀ ca FAIL với thông điệp ghim. Khuôn mượn từ hồ sơ `gia-lan-ghim-lai` (chép, không nạp
chéo hồ sơ đã ký).

## 8. Phát hành và crm

Theo mốc 01/11 (engine không đổi dưới chân crm trước 14/10). Rollout ở crm (phiên crm làm): cập nhật
plugin, thêm `model_carry_cmd` in id model của Gateway (lời dò như E15 AC-11) + băm `bun.lock`.
