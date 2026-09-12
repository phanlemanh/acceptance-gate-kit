# Thiết kế — Làn ghim lại gặp lớp acceptance-gate cũ phải dừng có tên

Ngày 2026-09-11 · slug `ghim-lai-tren-lop-cu` · T2 · owner `phanlemanh@gmail.com`
· owner gọi tên vòng 11/09 («Chạy hai việc kit còn mở»)

## 1. Vấn đề — bộ máy cũ bị đọc thành hồ sơ đỏ

`feature-loop/scripts/repin-lane.mjs` nạp bộ máy từ `--ag-root` (hoặc bản
`resolve-plugin.mjs` tìm được trong plugin cache). Nó kiểm ba tệp có mặt
(`AG_REQUIRES`) và ba export của `lib/evidence-core.cjs` (dòng 72), nhưng dòng
71 rút `{ parseEvals, expectedExits }` từ `lib/eval-yaml.cjs` mà KHÔNG kiểm, rồi
dòng 102 gọi `expectedExits(evalsText)`.

Đo trong rollout 2.11.0 ở hai repo tiêu thụ (oneflow: lớp vendored ở origin/main
cũ hơn 2.10.0; media-library: lớp vendored = kit `0b5c5b37`, plugin.json 2.8.0).
Tái hiện cục bộ 11/09 trên cây này:

```
node feature-loop/scripts/repin-lane.mjs --root . --ag-root <git archive 0b5c5b37 lib scripts> --slug ma-so-quyet-dinh-duy-nhat
TypeError: expectedExits is not a function   (repin-lane.mjs:102)
exit=1
```

Mã thoát **1** là mã «LÀN ĐỎ» trong hợp đồng của script (0 xanh · 1 làn đỏ ·
2 nguồn thiếu/hỏng · 3 usage). Nghĩa là bộ máy cũ bị đọc thành *hồ sơ mất tiền
đề*, đúng lớp «máy tin nhầm chính nó». Hệ quả đo được:

1. Repo tiêu thụ chỉ trả được nợ ghim lại SAU KHI PR nâng cấp của nó gộp.
2. Đo cùng một làn trên origin/main (base) phải lách bằng cách trỏ `--ag-root`
   vào lớp mới hơn. Không ai nói với người chạy rằng đó là cách đúng.

`s4-args.mjs` và `carry-plan.mjs` đã làm đúng cho phần của chúng
(`typeof … !== 'function'` → `die` có tên, «cần ≥ 2.11.0»). `repin-lane.mjs`
thì không.

## 2. Lớp lỗi — mọi điểm chạm bộ máy của làn

Quét toàn bộ `repin-lane.mjs` và bước tự kiểm nó gọi ra. Làn chạm bộ máy ở
**bốn** chỗ, chỉ một chỗ được kiểm đủ:

| Điểm chạm | Hôm nay | Lỗ |
|---|---|---|
| Nạp `lib/evidence-core.cjs`, `lib/eval-yaml.cjs` (`require_`) | không bọc | tệp có mặt mà nạp lỗi (cú pháp, thiếu tệp anh em) → stack thô |
| Export của `eval-yaml.cjs`: `parseEvals`, `expectedExits` | **không kiểm** | lớp < 2.11.0 → `TypeError`, exit 1 |
| Export của `evidence-core.cjs`: `resolveConfigKey`, `resolveConfigList`, `REPIN_MACHINE_EXECUTORS` | kiểm `=== undefined`, thông điệp «cần ≥ 2.9.0» | chỉ báo cái thiếu ĐẦU TIÊN; sàn 2.9.0 đã sai so với cái làn thật sự cần |
| Bước tự kiểm `scripts/recheck-evidence.cjs` (chỉ chạy với `--write`, SAU khi ghi) | chỉ kiểm tệp có mặt | (a) recheck gọi `core.determineEnforce/evaluateEvidence/checkRepinEvals/findAcceptanceConfig` — thiếu một cái là recheck sập SAU khi làn đã ghi, và thông điệp đổ lỗi cho hồ sơ («sửa trước khi commit»); (b) lớp LAI (evidence-core < 2.11.0 cạnh eval-yaml ≥ 2.11.0): làn ghi `evals_exit` có mã khác 0 đã khai, recheck đời cũ không biết luật hai vế nên từ chối — cũng SAU khi ghi |

Recheck chạy từ CÙNG gốc (`<agRoot>/scripts/recheck-evidence.cjs` nạp
`__dirname/../lib/evidence-core.cjs`), nên một cổng kiểm đặt ở đầu làn phủ được
nó, miễn là cổng biết recheck cần gì.

Ngoài `repin-lane.mjs`: `s4-args.mjs:83` có đúng hình dạng này (rút
`parseEvals, expectedExits` không kiểm), nhưng dòng 82 đã kiểm `parseFlowValue`
(cùng sàn 2.11.0), nên với lớp ĐỒNG ĐỜI thì nó được che gián tiếp. Vòng này
không đụng nó (mục 6).

## 3. Lựa chọn — dừng có tên, không rơi về mặc định

**(a) Fail-CLOSED có tên — CHỌN.** Làn kiểm MỘT bảng điểm chạm ngay sau khi có
`agRoot`, TRƯỚC khi kiểm cây sạch, trước mọi suite và trước mọi lần ghi. Thiếu
bất kỳ mục nào → exit **2** (nguồn thiếu/hỏng, không phải 1), in trọn danh sách
thiếu trong một lần chạy, mỗi dòng gọi tên: tệp · export · bản cần. Rồi in lối
đi tiếp cụ thể:

- trỏ `--ag-root` vào một acceptance-gate ≥ 2.11.0, ví dụ bản plugin đã cài
  (kèm lệnh `resolve-plugin.mjs` in sẵn đường dẫn — suy từ vị trí script);
- nói rõ `--ag-root` chỉ cấp BỘ MÁY, `--root` vẫn là cây đang đo — nên đo được
  một cây mang lớp vendored cũ;
- nguồn là plugin cache (không có `--ag-root`) → nói thêm «cập nhật plugin».

**(b) Rơi về `expected_exit = 0` cho mọi eval kèm một NOTE — LOẠI.** Ba lý do:

1. Hồ sơ có eval khai `expected_exit: 2` sẽ thành làn ĐỎ gọi tên eval đó (exit
   1), tức lại đổ lỗi cho hồ sơ. Đúng lớp lỗi vòng này đóng, chỉ đổi chỗ.
2. Nó lặng lẽ đổi ngữ nghĩa của làn theo tuổi bộ máy. Một dòng NOTE trên stderr
   không phải vật máy giữ.
3. Bất biến «đường đọc-cũ» của kit nói về ARTIFACT cũ (hồ sơ, `evals.yaml`, dòng
   sổ). Ở đây artifact không cũ, BỘ MÁY cũ. Bộ máy do người chạy chọn, và có
   đường đảo rẻ (một cờ). Engine không tự hạ ngữ nghĩa để chiều một bộ máy cũ.

**Kiểm bằng export (phát hiện tính năng), không bằng chuỗi version.** Lớp
vendored ở repo tiêu thụ chỉ chép `lib/` + `scripts/`, không có `plugin.json`
(`commands/acceptance-init.md` khối `INIT-CI-COPY-LIST`). Còn `0b5c5b37` ghi
plugin.json 2.8.0 mà đã mang export của 2.9.0. Chuỗi version nói dối theo cả hai
chiều.

Chân ngành: `[NGÀNH: Terraform required_version — «Unsupported Terraform Core
version»]` và `[NGÀNH: npm engines + engine-strict — EBADENGINE]` cho nếp dừng
sớm có tên khi bộ máy không đủ đời; `[NGÀNH: MDN — feature detection thay vì
browser/version sniffing]` cho việc kiểm export thay vì kiểm version.

## 4. Hình dạng bảng

MỘT hằng trong `repin-lane.mjs`, mỗi hàng: tệp · export · kiểu (`function` /
mảng) · bản cần · vì sao (làn gọi / recheck gọi / sàn ngữ nghĩa). Hàng gồm:

- `lib/eval-yaml.cjs`: `parseEvals`, `expectedExits` (2.11.0);
- `lib/evidence-core.cjs` mà làn gọi: `resolveConfigKey`, `resolveConfigList`,
  `REPIN_MACHINE_EXECUTORS`;
- `lib/evidence-core.cjs` mà recheck gọi: `determineEnforce`, `evaluateEvidence`,
  `checkRepinEvals`, `findAcceptanceConfig`;
- sàn ngữ nghĩa của bên đọc: `readSignedReportFor` (≥ 2.11.0). Làn không gọi nó.
  Nó có mặt vì nó sinh ra cùng luật hai vế của `checkRepinEvals` (hồ sơ
  eval-khai-ma-thoat-mong-doi). Evidence-core thiếu nó là evidence-core không
  biết mã khác 0 đã khai, và sẽ từ chối SAU khi làn đã ghi.

Nạp tệp bọc `try/catch` → exit 2 «không nạp được <tệp> (<dòng lỗi đầu>)».
Thông điệp tệp-thiếu ở dòng 68 và export-thiếu ở dòng 72 gộp về cùng một khuôn,
sàn đọc từ bảng (không còn «≥ 2.9.0» ghi cứng).

Bảng đặt trong MỘT khối marker `AG-ENGINE-TABLE`. Phép đo rút hàng từ khối đó lúc
chạy, không chép tay (single-source cho cả làn lẫn thước).

Thông điệp dừng in trọn tập thiếu, mỗi mục một dòng `<tệp>: <export> (cần ≥ <bản>)`,
không dừng ở mục đầu của mỗi tệp. Cuối thông điệp là một dòng `lệnh dò: node
<đường TUYỆT ĐỐI tới resolve-plugin.mjs> --plugin acceptance-gate --require …`. Tuyệt
đối, vì người chạy đứng ở `--root` chứ không ở gốc kit. Dòng này cũng là vật mà
AC-7 trích ra chạy thật.

Cổng bộ máy chạy TRƯỚC kiểm cây sạch. Bộ máy cũ là lỗi nguồn, cây bẩn là lỗi người
chạy, và báo lỗi người chạy khi bộ máy đã không dùng được là dẫn sai hướng.

Cái giá cố tình nhận: bảng phải biết recheck cần gì. Hai răng giữ coupling đó:

- **Phép QUAN HỆ (AC-3).** Trích lúc chạy mọi tên `core.<X>` và mọi tên rút từ hai
  tệp lib trong `recheck-evidence.cjs` + `repin-lane.mjs`, đòi tập đó ⊆ hàng bảng.
  Recheck gọi thêm `core.X` mà bảng không thêm → đỏ gọi tên X ngay, không phải chờ
  một ô matrix tình cờ chạm tới nó.
- **Ma trận xoá-export trên HAI hồ sơ (AC-3).** Một hồ sơ mọi eval exit 0, một hồ
  sơ eval khai `expected_exit: 2`. Có hồ sơ thứ hai thì nhánh chỉ chạy khi
  `evals_exit` khác 0 mới được với tới. Ô (G) phải ghi BẰNG BYTE bản đối chứng sau
  khi chuẩn hoá `run_id`/`ts`/ngày. «Exit 0 + recheck xanh» thôi không đủ, vì một
  lối đọc mới kiểu `?.`/`?? mặc định` sẽ lặng lẽ rơi về mặc định mà vẫn xanh —
  tức đúng lựa chọn (b) đã loại, lọt vào qua cửa sau.

## 5. Phép đo

Một tệp ca VĨNH VIỄN `tests/scripts/repin-lane-lop-cu.test.mjs`. Suite scripts tự
chạy mọi `*.test.mjs`, nên lớp này có lưới thường trực sau khi hồ sơ khép. Mỗi
eval gọi đúng một ca qua biến `GLLC_CASES`. Bộ lọc khớp 0 ca → exit khác 0 có tên
(bài học P86: bộ chọn khớp 0 ca mà vẫn xanh).

Fixture do code sinh trong chính lượt chạy:

- **kho git tạm** theo khuôn `tests/scripts/repin-lane.test.mjs` (config, suite
  `sh` ghi một tệp dấu khi được chạy, một hồ sơ đã ghim với `evals.yaml` +
  `evidence-report.md` có `verified_commit` + `run-log.jsonl`);
- **lớp cũ THẬT**: `git archive 0b5c5b37 lib scripts` từ gốc kit (suy từ vị trí
  tệp ca), trọn thư mục, không chép tệp tay. Mốc vắng (clone nông) → ca ĐỎ có tên
  «thiếu mốc 0b5c5b37 — cần lịch sử git đầy đủ», không xanh lặng. CI kit đã
  `fetch-depth: 0`;
- **lớp LAI thật**: bản chép trọn `lib/` + `scripts/` của cây đang đo, thay riêng
  `lib/evidence-core.cjs` bằng bản ở `04069351` (mốc 2.10.0);
- **bản sao xoá một export**: bản chép trọn cây đang đo, nối
  `delete module.exports.<X>` vào cuối tệp. Danh sách export đếm lúc chạy bằng
  `require()` hai tệp, không gõ tay.

Mọi ca mang cặp hai chiều trên cùng fixture: bản lành xanh trước, bản bị phá đỏ
với thông điệp ghim.

## 6. Ngoài vòng

- `s4-args.mjs:83` — cùng hình dạng, được che gián tiếp bởi kiểm `parseFlowValue`
  với lớp đồng đời. Mở lại khi đo được một lớp lai làm s4-args sập.
- Không sửa `lib/**`, kể cả `checkRepinEvals` lặng lẽ coi `expectedExits` vắng là
  Map rỗng (hướng đó chặt hơn, không phải fail-open) → hạng giữ T2.
- Không thêm câu vào SKILL/GUIDE: thông điệp của script là nguồn duy nhất của lối
  đi tiếp.
- Không để thông điệp tự dò bản plugin đã cài: kết quả phụ thuộc máy nên phép đo
  không tất định. In LỆNH dò thay vì in KẾT QUẢ dò.
- Không nâng version plugin: gom theo mốc phát hành.

## 7. Vòng meta

Việc sửa thước của kit (làn ghim lại). Owner gọi tên 11/09 nên vòng được mở theo
luật chiều rộng (b) của CLAUDE.md: tối đa MỘT vòng meta giữa hai release, chỉ khi
owner gọi tên. Neo ngoài có thật: hai repo tiêu thụ đang có nợ ghim lại không trả
được trước khi PR nâng cấp gộp.
