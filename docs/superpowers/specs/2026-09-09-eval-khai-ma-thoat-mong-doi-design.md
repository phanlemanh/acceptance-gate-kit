# Thiết kế — Eval máy khai mã thoát mong đợi (`expected_exit`)

Ngày 2026-09-09 · slug `eval-khai-ma-thoat-mong-doi` · T3 · owner `manh@mstar.vn`

## 1. Vấn đề — giới hạn có khai, nhưng khai bằng hình dạng lách máy

Kit không có khái niệm **eval máy TỪ CHỐI ĐO vì tiền đề thiếu**. Mọi bộ đọc coi
mã thoát khác 0 là thất bại, nên một hồ sơ ĐÃ KÝ đứng trên một giới hạn đã khai
thì không ghim lại lẫn chấm lại được.

Ca thật (`~/dev/crm`, hồ sơ `man-cai-dat-noi-tieng-viet`, eval E5, ký 04/09):
`expected` ghi nguyên văn rằng mã 2 là kết quả đã khai trước; AC-5 và Known
limits khai giới hạn; bảng báo cáo ghi `| E5 | AC-5 | **2** |`.

Điều tra vòng này tìm thêm một vết mà đề bài chưa nêu, và nó là bằng chứng
mạnh nhất cho việc phải làm: **khối bằng chứng của E5 bỏ hẳn trường
`exit_code`** và giấu con số vào một trường tự đặt `khong_do_duoc:`. Lý do có
tên: luật nhất-quán L1 trong `lib/evidence-core.cjs` quét TRỌN báo cáo bằng
`NONZERO_EXIT_RE`, nên viết `exit_code: 2` một cách trung thực sẽ bị hook chặn
chính báo cáo PASS đó. Người viết buộc phải bịa một tên trường để đi lọt.

Đó là hình dạng xấu nhất của lớp lỗi này: giới hạn được khai bằng chữ cho
người, nhưng vô hình với máy, và hình dạng ấy được chọn *vì* máy.

## 2. Ranh giới với ô đã park — `baseline-127-tin-hieu-phan-biet`

`.out-of-scope/thuoc-cua-thuoc-mot-tang.md` park ô `baseline-127` ngày 30/08,
kèm ngưỡng mở lại đang đếm 0. Việc này KHÔNG mở lại ô đó, và ranh giới phải
nói ra để hồ sơ sau đọc không tưởng là kit đã ủi qua quyết định của owner:

| | ô đã park (`baseline-127`) | việc này (`expected_exit`) |
|---|---|---|
| Ai phát ngôn kỳ vọng | MÁY tự suy từ mã thoát của làn đối chứng | NGƯỜI khai ở Cổng 1, ký ở Cổng Bằng chứng |
| Tầng | thước-của-thước (máy chấm chính khí cụ của nó) | tầng một (ý người → vật máy giữ) |
| Dạng nghiệm | thêm một tầng cơ khí hoá suy luận | biến bất biến từ đầu-người sang vật-máy-giữ |

Ranh giới được **vật hoá**, không chỉ nói: `expected_exit` CẤM khai mã hạ tầng
97 và 127. Đúng hai mã đó là lãnh địa của ô park. Lệnh cấm ấy vừa là lưới an
toàn, vừa là cột mốc phân giới.

## 3. Chân ngành — lớp này có tên ở ngoài

- **pytest `xfail(strict=True)`** — khai trước một phép đo được phép trượt; và
  một lượt trượt-mà-lại-đạt là lỗi. Neo gần nhất.
- **TAP — `TODO` khác `SKIP`** — `SKIP` là không chạy được (kit đã có, tên
  `cannotRun`); `TODO` là chạy và trượt có chủ đích (kit đang thiếu). Việc này
  bổ đúng nửa còn trống.
- **JUnit `error` khác `failure`** — kit đã dẫn nếp này trong chú thích của
  `normInfra`.

Chân ngành đẻ ra một câu hỏi thiết kế mà đề bài chưa chốt: eval khai mã 2 mà
trả 0 thì sao? Xem mục 6.

## 4. Không gian AC — quét hình thái

Chân sản phẩm: `[SUY-TỪ-REPO: _acceptance/config.yaml, lib/evidence-core.cjs,
feature-loop/workflows/acceptance-verify.js]`. Chân ngành: `[NGÀNH: pytest
xfail · TAP TODO/SKIP · JUnit error/failure]`.

**Trục A — chỗ đọc** (thước CE: grep toàn cây mọi nơi so mã thoát; 5 nơi):
parser · S4 · làn ghim lại · luật `checkRepinEvals` · luật nhất-quán L1.

**Trục B — hình dạng khai** (thước CE: lược đồ trường mới, MECE theo giá trị):
không khai · khai 0 · khai n hợp lệ · khai mã hạ tầng · sai kiểu · khai trên
executor không phải `test`/`script`.

**Trục C — quan hệ khai ↔ mã thật** (thước CE: ca thật crm + luật ghim lại):
khớp · lệch · mã khác 0 MỚI xuất hiện (báo cáo đã ký ghi 0) · mã đã khai MẤT
đi (nay trả 0).

**Trục D — chia sẻ lệnh** (thước CE: `byCmd` gom eval theo lệnh ở
`acceptance-verify.js:399`): lệnh riêng · nhiều eval chung lệnh cùng mã ·
nhiều eval chung lệnh KHÁC mã.

Cross-cutting áp mọi ô Core — **vật mang dấu**: `evals.yaml` · dòng `kind:repin`
trong run-log · khối eval trong `evidence-report.md` · mục Known limits.

Không gian 5×6×4×3 = 360 ô; quét theo lát cắt của trục A vì lớp lỗi cần chặn
là **bộ đọc trôi khỏi nhau**.

**Core** (11 ô, ~3%): mỗi chỗ đọc × hình dạng khai hợp lệ, cộng bốn ô fail-closed
(mã hạ tầng · sai kiểu · executor sai · chung lệnh khác mã) và hai ô quan hệ
(mã mới xuất hiện · mã mất đi). Xem `_acceptance/eval-khai-ma-thoat-mong-doi/contract.md`.

**Later**: khai mã mong đợi cho `ui-check` (làn ghim lại không chạy được nó,
nên hai bộ đọc sẽ bất đồng — chờ ngày làn ghim lại chạy được `ui-check`);
khai một TẬP mã chấp nhận được thay vì một mã (chưa có ca thật).

**Never**: suy mã mong đợi từ văn xuôi của trường `expected` — đó là đoán ý
người bằng máy, đúng lớp lỗi kit đang chặn; khai mã mong đợi cho `judgment`
(không có lệnh nào chạy, mã thoát vô nghĩa).

## 5. Thiết kế — một nguồn, năm bộ đọc rút từ đó

### 5.1 Nguồn — `lib/eval-yaml.cjs`

Thêm export `expectedExits(text)` trả về `{ byId: Map<id, number>, errs: [] }`.
Mặc định 0. Mọi bộ đọc rút từ đây; không nơi nào tự đọc trường.

Luật fail-closed, mỗi luật một thông điệp gọi tên eval:
- không phải số nguyên trong 0–255 → lỗi;
- mã 97 hoặc 127 → lỗi (ranh giới ô park, mục 2);
- khai trên executor khác `test`/`script` → lỗi.

Danh sách mã cấm neo vào khối marker `INFRA-EXIT-CODES` của
`acceptance-verify.js` bằng một ca kiểm round-trip, để bên viết và bên đọc
không trôi khỏi nhau.

### 5.2 S4 — `feature-loop/workflows/acceptance-verify.js`

Lệnh được gom theo `byCmd`, nên kỳ vọng phải tính theo LỆNH, không theo eval:
- các eval trỏ cùng một lệnh khai HAI mã khác nhau → **BLOCKED có tên** (không
  đoán, không lấy mã nào làm chuẩn);
- lệnh suite không gắn eval → kỳ vọng 0.

Rồi thay mọi phép so `exitCode === 0` bằng so với kỳ vọng của lệnh đó: khâu
gộp nhiều lượt chạy, chọn đại diện chẩn đoán, làn đối chứng, và
`failed = machine.filter(...)`.

Eval đạt đúng mã khác 0 = **đạt-có-giới-hạn**. Nó KHÔNG phải PASS trơn:
- bảng và khối eval ghi mã thật kèm dấu phân biệt;
- một dòng do JS tính sẵn được đưa vào mục **Known limits** (bên soạn báo cáo
  chỉ chép nguyên văn, không tự diễn đạt).

Vì «Known limits hiện diện và RỖNG» là một trong sáu điều kiện xanh-sạch, hồ sơ
có eval đạt-có-giới-hạn tự động hết xanh-sạch và đi qua Cổng Bằng chứng có
người. Đây là ĐƯỜNG ĐỊNH TUYẾN CHÍNH của thiết kế, không phải hệ quả phụ:
giới hạn đã khai là một đánh-đổi, mà đánh-đổi thuộc về người.

Lời dặn trong prompt soạn báo cáo («report PASS không được chứa mã thoát khác
0») phải nới đúng bằng luật mới, nếu không bên soạn sẽ lại đi bịa tên trường.

### 5.3 Làn ghim lại — `feature-loop/scripts/repin-lane.mjs`

Làn đỏ khi `exit !== kỳ vọng`, thay vì `exit !== 0`. `evals_exit` giữ MÃ THẬT,
không quy về 0. Dòng chữ của mục Re-pin đếm từ mã thật và gọi tên eval
đạt-có-giới-hạn, thay câu ghi cứng «N eval máy exit 0» đang lấy số từ độ dài
mảng chứ không từ kết quả.

### 5.4 Luật ghim lại — `checkRepinEvals` trong `lib/evidence-core.cjs`

Mã khác 0 chỉ được chống lưng một pin khi thoả **CẢ HAI**:
1. `evals.yaml` khai đúng mã đó cho eval đó, VÀ
2. **báo cáo ĐÃ KÝ đã ghi eval đó cùng mã**.

Vế 2 là chốt chặn fail-open. Không có nó, chỉ cần sửa một dòng vào `evals.yaml`
của một hồ sơ đã ký là làn xanh trở lại — trong khi mã 2 MỚI xuất hiện chính là
tiền đề vừa mất. Vế 1 nói «có chủ đích», vế 2 nói «đã có người ký nhận».

Hàm nhận thêm nội dung báo cáo; mã thoát trong khối eval rút bằng cùng lối đi
khối mà `extractEvalBlockRunIds` đang dùng.

### 5.5 Luật nhất-quán L1 — `evaluateEvidence` trong `lib/evidence-core.cjs`

Đây là chỗ đọc thứ năm, đề bài chưa nêu, và không sửa thì tính năng tự mâu
thuẫn: S4 sẽ sinh ra một báo cáo mà hook của chính nó chặn.

`NONZERO_EXIT_RE` đang quét trọn báo cáo. Đổi sang quét theo KHỐI: một mã khác
0 chỉ được tha khi nó nằm trong khối của đúng eval đã khai mã ấy. Mọi mã khác 0
còn lại — ngoài khối, lệch mã, hoặc của eval không khai — vẫn là vi phạm nhất
quán như cũ.

Điều kiện hình dạng L1 đòi ít nhất một dòng `exit_code: 0` cũng nới tương ứng:
thoả bằng một dòng mã thoát ĐÚNG KỲ VỌNG đã khai. Không nới thì một hồ sơ mà
mọi eval máy đều khai mã khác 0 sẽ bị chặn bằng một thông điệp sai chỗ.

## 6. Quyết định load-bearing

**Eval khai mã 2 mà trả 0 → XANH, kèm tiếng.** pytest `xfail(strict=True)` gọi
ca này là lỗi. Kit đi khác, có lý do: mã 0 nghĩa là tiền đề đã có và phép đo
chạy thật rồi đạt — tính năng được chứng nhiều hơn, không ít hơn. Làm đỏ ở đây
là phạt một cải thiện. Nhưng im lặng cũng sai: mục Known limits của báo cáo
vẫn đang khai một giới hạn không còn nữa, tức hồ sơ tự nói dối về mình. Nên:
xanh, và làn cùng báo cáo phải nói ra «giới hạn đã khai không còn». Phương án
bị loại: theo pytest làm đỏ — phạt cải thiện, và đẩy người vào một vòng chấm
chỉ để gỡ một dòng khai.

**Kỳ vọng tính theo LỆNH, không theo eval.** Vì `byCmd` gom nhiều eval vào một
lượt chạy, một lượt chạy chỉ có một mã thoát. Hai eval chung lệnh mà khai khác
mã là một mâu thuẫn không có lời giải đúng — BLOCKED có tên, để người sửa
`evals.yaml`. Phương án bị loại: lấy mã của eval đầu tiên (chọn thầm lặng, đúng
lớp fail-open kit đang chặn).

**Một trường số, không phải suy từ văn xuôi.** `expected` là văn cho người và
sẽ mãi là thế. Phương án bị loại: dò chuỗi trong `expected` — máy đoán ý người.

## 7. Chiều đỏ — mỗi phép đo mới phải từng đỏ

Theo khuôn khai sinh phép đo: mỗi ca dựng bản lành (xanh) rồi tiêm vào bản sao
(đỏ, thông điệp ghim), fixture do mã sinh trong chính lượt chạy.

1. khai 2, trả 2 → ghim được · S4 đạt-có-giới-hạn · Known limits có dòng;
2. cùng eval trả 1 → đỏ;
3. KHÔNG khai mà trả 2 → đỏ (không mở rộng ngầm);
4. hai eval chung lệnh khai khác mã → BLOCKED, thông điệp gọi tên cả hai;
5. khai 127 hoặc 97 → lỗi gọi tên (ranh giới ô park);
6. báo cáo đã ký ghi 0, làn nay trả 2 đã khai → đỏ (tiền đề vừa mất);
7. khai trên executor `judgment` → lỗi gọi tên;
8. mã thoát khác 0 nằm NGOÀI khối eval đã khai → luật nhất quán vẫn chặn;
9. danh sách mã cấm lệch khỏi khối marker `INFRA-EXIT-CODES` → đỏ.

## 8. Giới hạn khai của chính việc này

- `ui-check` và `judgment` không khai được mã mong đợi. Lý do: làn ghim lại
  không chạy được hai loại đó, nên cho khai sẽ làm hai bộ đọc bất đồng. Ngưỡng
  mở lại: ngày làn ghim lại chạy được `ui-check`.
- Chỉ khai được MỘT mã, không phải một tập. Chưa có ca thật đòi tập.
- Việc này không sửa hồ sơ của `crm`. Kit là engine; `crm` nhận qua bản phát
  hành 2.11.0.

## 9. Ngoài phạm vi

Không chạm `scripts/recheck-evidence.cjs`, `hooks/`, `carry-plan.mjs` — luật
sống ở `checkRepinEvals` và `evaluateEvidence` trong `lib/evidence-core.cjs`,
hai tệp kia gọi vào đó. Không dựa vào `staleScope`/`pathsOf` (K4 đã bị rút khỏi
2.10.0, không còn trên nhánh chính).

Hồ sơ mốc phát hành `release-2-11-0` là một hồ sơ RIÊNG, mở sau hồ sơ này.

**Trình tự ship (owner đổi 09/09).** Vòng này chạy ngay từ `main` hiện tại, song song
với hồ sơ mốc `release-2-10-0`, không chờ nhánh mốc gộp. Không gộp trước khi
`claude/moc-2-10-0` lên `main`; khi nó lên thì merge vào, giải xung đột, chạy lại làn
ghim lại cho chính hồ sơ này rồi mới ship. Vùng của hồ sơ mốc là `evaluateContractWrite`
và `tests/hooks/`; vùng của hồ sơ này là `checkRepinEvals` và `evaluateEvidence`. Đo
09/09: hai vùng rời nhau, không tệp ca kiểm nào chung.
