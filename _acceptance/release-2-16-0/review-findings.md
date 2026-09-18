## Trong hợp đồng

### rang-ghim-lai.mjs dùng sai API expectedExits — kỳ vọng đã khai LUÔN bị đọc thành 0
file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:137`
severity: high
source: conventions
AC: AC-5

`lib/eval-yaml.cjs` xuất `expectedExits(text)` trả về `{ byId: Map, errs: [] }` (lib/eval-yaml.cjs:82-112), nhưng răng viết `const exp = evalYaml.expectedExits(txt) || {};` rồi `const e = exp[id] || 0;` (dòng 137, 140). `exp[id]` trên object `{byId, errs}` LUÔN undefined → `e` luôn = 0. Hệ quả: (a) quan hệ (4) mà hợp đồng khai — «Đỏ đọc theo kỳ vọng đã khai (expectedExits), không theo số 0, cùng luật với làn» (contract.md AC-5 mục 4; header răng dòng 28-29) — không được cài đặt: mọi mã thoát khác 0 trong vật đều bị đếm là đỏ; (b) nhánh AC-10 2.11.0 «cải thiện không phạt» `!(e !== 0 && x === 0)` là code chết; (c) `errs` của expectedExits bị bỏ, trong khi làn (repin-lane.mjs:181) `die` khi có errs. Đã đo trên chính cây này: tính bằng `exp[id]` cho 14 hồ sơ đỏ / 60 eval đỏ, tính đúng bằng `byId.get(id)` cũng cho 14/60 — bằng nhau CHỈ vì hiện có 0 eval nào trong vật khai expected_exit khác 0. Đây đúng lớp «xanh vì phép đo chưa chạm vật»: ngày một hồ sơ đã ký khai expected_exit khác 0 và làn báo đúng mã ấy, răng đếm nó thành đỏ và FAIL(7) tuy vật và làn đều đúng. Sửa: `const { byId, errs } = evalYaml.expectedExits(txt); … const e = byId.get(id) || 0;` cộng một lối FAIL khi errs không rỗng, để hai bên (làn và răng) không cho hai kết luận trái nhau.

### Vị từ «eval máy» gõ tay lại thay vì gọi core.isRepinMachineEval — writer/reader hai bản luật
file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:129`
severity: high
source: conventions
AC: AC-5

Dòng 129 tự dựng vị từ: `evs.filter((e) => (e.executor === 'test' || e.executor === 'script') && String(e.status).trim() !== 'not-run')`. Bên GHI (feature-loop/scripts/repin-lane.mjs:192) gọi `core.isRepinMachineEval(e)`, mà lib/evidence-core.cjs:366-372 khai đích danh: «MỘT nơi quyết định eval máy đáng ghim: bên ĐỌC và bên GHI cùng gọi — hai bản luật là điều kiện đủ để writer/reader trôi khỏi nhau». Header của chính răng (dòng 33-35) lại khai là đã hỏi một nguồn, «không gõ tay. Bài học 2.15.0 AC-8». Hai bản đã lệch thật, vì `parseEvals` KHÔNG bóc nháy, KHÔNG hạ chữ thường (lib/eval-yaml.cjs:28-56) còn `isRepinMachineEval` có làm cả hai: với `executor: Script` làn tính là eval máy còn răng thì không (vật thừa id → FAIL(5)); với `status: "not-run"` (có nháy) làn loại còn răng giữ (răng đòi id mà vật không có → FAIL(5)). Cả hai chiều là ĐỎ GIẢ trên một vật đúng. Hiện latent chỉ vì chưa evals.yaml nào trong kho khai `status:`. Sửa: nạp `core.isRepinMachineEval` (đã có sẵn trong evidence-core đang được require ở dòng 72) và lọc bằng nó.

### rang-cua-so viec-va đọc t1_skip_globs bằng parser KHÁC parser của làn, trong khi khai là cùng một hàm
file: `_acceptance/release-2-16-0/rang-cua-so.mjs:140`
severity: medium
source: conventions
AC: AC-8

Dòng 126-142 (và evals.yaml E8 dòng 106-109) khai: «Engine rút từ MỘT nguồn của kho bằng CHÍNH hai hàm mà làn ghim lại dùng cho vị từ bỏ-qua: `configList` của lib/workspace-record.cjs … `globToRe` của carry-plan». Vế `globToRe` đúng; vế đọc danh sách SAI: khối SKIP-UNCHANGED-PREDICATE của feature-loop/scripts/repin-lane.mjs:265 dùng `core.resolveConfigList(configText, 'risk_tiers.t1_skip_globs')` (lib/evidence-core.cjs:236), KHÔNG dùng `workspace-record.configList`. Đây là bộ đọc thứ hai cho cùng một khoá, với ngữ nghĩa khác: `configList` neo `^\s{2}t1_skip_globs:` — chỉ đúng khi khoá thụt đúng hai dấu cách và KHÔNG kiểm khoá cha `risk_tiers`, nên nó khớp bất kỳ `t1_skip_globs:` nào ở tầng hai; `resolveConfigList` đi theo đường chấm có kiểm cha. Hôm nay hai bên cùng trả 14 mục (đã đo), nên là trôi tiềm ẩn chứ chưa gãy — nhưng lời khai «CHÍNH hai hàm mà làn dùng» trong evals.yaml là một lời khai sai kiểm được. Cùng chỗ: `laEngine` dòng 143 dùng `!f.startsWith('_acceptance/')` trong khi làn dùng `laVatHoSo = f.split('/').includes('_acceptance')` (repin-lane.mjs:263, kèm chú thích giải thích vì sao phải so theo phân đoạn) — vẫn là một khuôn riêng của răng, trái với câu «bản này không còn khuôn nào của riêng nó».

### rang-ghim-lai: quan hệ (3) đọc kỳ vọng SAI API — `expectedExits()` trả `{byId, errs}`, nên `exp[id]` LUÔN undefined và «đỏ» thực chất vẫn đo theo số 0
file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:137`
severity: high
source: bugs
AC: AC-5

Dòng 137 `const exp = evalYaml.expectedExits(txt) || {};` rồi dòng 140 `const e = exp[id] || 0;`. Nhưng `lib/eval-yaml.cjs:112` trả về `{ byId: Map, errs: [] }` — KHÔNG phải map id→exit. Đã thử thật: `expectedExits(y)['EZ']` → `undefined` trong khi `byId.get('EZ')` → `3`. Hệ quả: `e` luôn = 0, nên chú thích ngay cạnh («AC-10 2.11.0: cải thiện không phạt») và lời khai của header dòng 26 + AC-5 quan hệ 4 («Đỏ đọc theo kỳ vọng đã khai (`expectedExits`), không theo số 0, cùng luật với làn») đều KHÔNG đúng với vật: nhánh `!(e !== 0 && x === 0)` là code chết. Làn thì làm đúng — `repin-lane.mjs:185` destructure `{ byId: expById, errs: expErrs }`, `die()` khi `expErrs.length`, và dùng `expById.get(e.id) || 0`. Răng vừa nuốt `errs` (không ai đọc) vừa đo bằng một luật khác làn. Hôm nay chưa đổi màu vì 0 hồ sơ đã ký khai `expected_exit` khác 0 (đã kiểm cả bốn hồ sơ có chữ `expected_exit`), nhưng ngày một hồ sơ khai `expected_exit: 3` — đúng thứ mà hồ sơ `eval-khai-ma-thoat-mong-doi` sinh ra để hỗ trợ — làn đếm nó XANH còn răng đếm nó ĐỎ, và quan hệ (4) nổ mã 7 về một chiến dịch lành. `|| {}` cộng `|| 0` là đúng hai lớp nuốt lỗi làm sai lệch này im lặng.

### rang-ghim-lai: vị từ «eval máy» chép tay thay vì gọi `core.isRepinMachineEval` — hai bên cho tập RỜI NHAU khi status có nháy hoặc executor viết hoa
file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:129`
severity: medium
source: bugs
AC: AC-5

Dòng 129 tự viết `(e.executor === 'test' || e.executor === 'script') && String(e.status).trim() !== 'not-run'`. Làn ghi vật thì gọi `core.isRepinMachineEval` (`repin-lane.mjs:193`), hàm này `trim().toLowerCase()` executor và chạy status qua `normaliseEvalStatus` (`evidence-core.cjs:364`) — có `unquoteScalar` + `toLowerCase`. Đã thử thật trên một evals.yaml tổng hợp: với `EX` khai `status: "not-run"` (có nháy) và `EY` khai `executor: Script`, làn trả `['EY']` còn bản chép trả `['EX']` — hai tập RỜI NHAU. Ở ca đó quan hệ (3) nổ mã 5 («tập id eval trong vật KHÁC tập id eval máy của evals.yaml») về một vật hoàn toàn đúng, và thông điệp không nói ra nguyên nhân thật là hai bộ đọc lệch nhau. Chính header tệp này (dòng 31–33) tuyên «hỏi ĐÚNG MỘT NGUỒN … không gõ tay. Bài học 2.15.0 AC-8», và hai finding của lượt chấm trước đã phạt đúng hình dạng này ở `rang-cua-so.mjs`. Nhát chữa cùng khuôn: `require_(lib/evidence-core.cjs).isRepinMachineEval` (đã export, dòng 1197) — bộ máy đó răng vốn đã nạp ở dòng 66.

### Hình dạng 4 — assertion âm-tính-một-mình không có đối chứng dương ĐÚNG CHIỀU: chân `viec-va` mù tệp chưa git-theo-dõi, «0 tệp engine đổi» fail-open
file: `_acceptance/release-2-16-0/rang-cua-so.mjs:150`
severity: high
source: measurement
AC: AC-8

Dòng 150 `const sau = git('diff', '--name-only', ky)` so commit chữ ký với CÂY LÀM VIỆC, mà `git diff <commit>` chỉ liệt kê tệp ĐANG ĐƯỢC THEO DÕI. Một tệp engine MỚI, chưa `git add`, không bao giờ vào `tepSau`, nên bộ lọc ở dòng 154 không có gì để bắt và răng in PASS.

Đã thử thật trên chính cây này: `echo "// probe" > lib/zzz-probe-review.cjs` rồi chạy `node _acceptance/release-2-16-0/rang-cua-so.mjs --chan viec-va` → `PASS: viec-va 0 tep engine doi sau chu ky b9f8766e …`, exit 0 (đã xoá tệp probe sau khi đo; `git status` sạch).

Vì sao đây là hình dạng 4 chứ không phải chi tiết nhỏ: răng CÓ đối chứng dương (mã 7, `engineTruoc` trên cửa sổ `neo..ky` — dòng 145–149) nhưng cửa sổ ấy toàn commit, nên nó chỉ chứng minh `laEngine` nhận ra tệp engine ĐÃ COMMIT. Nó không chứng minh được phép đo thấy tệp engine MỚI THÊM ở cây làm việc — đúng cách mã engine mới ra đời, và đúng ca AC-8 sinh ra để bắt. Kết luận «không tệp nào» ở chiều đó là hằng đúng.

Kèm theo: khối `expected` của E8 trong `_acceptance/release-2-16-0/evals.yaml` khai «Đã thử thật: thêm một tệp dưới cây thư viện → mã 6 gọi đúng tệp». Chiều đỏ ấy chỉ nổ khi tệp được stage/commit; bản untracked KHÔNG nổ, nên lời khai trong evals rộng hơn cái răng làm được.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dòng khai `exit` của khối CHIEN-DICH-GHIM-LAI không bị buộc vào vật — exitVat là biến chết**
  Người dùng thấy gì: Dòng khai 'exit' của chiến dịch trong hồ sơ phát hành không thực sự được máy đối chiếu với dữ liệu thật — nếu con số đó bị gõ sai, hệ thống vẫn báo hợp lệ mà không phát hiện ra.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: medium
  Đề xuất: known-limits

- **paths của E7/E8 không phủ các nguồn mới mà phán quyết của chúng phụ thuộc**
  Người dùng thấy gì: Nếu một bản sửa sau này chạm đúng vào file cấu hình liên quan mà không đổi ba file đang được theo dõi, hệ thống có thể tái dùng kết quả kiểm tra cũ đã lỗi thời thay vì chạy lại, mà không ai biết.
  file: `_acceptance/release-2-16-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Vật JSON không được kiểm hình dạng trước khi bóc — lỗi hạ tầng rơi ra TypeError thay vì FAIL(2)**
  Người dùng thấy gì: Nếu dữ liệu ghi lại của chiến dịch bị thiếu hoặc sai định dạng, công cụ kiểm tra sẽ dừng đột ngột với lỗi kỹ thuật khó hiểu thay vì báo rõ ràng, gây khó khi cần tra lỗi sau này.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: low
  Đề xuất: known-limits

- **rang-ghim-lai: quan hệ (2) so ảnh chụp của vật với trạng thái SỐNG của kho — đỏ mã 4 ngay khi chính hồ sơ mốc này được ký (đã thử thật)**
  Người dùng thấy gì: Ngay sau khi hồ sơ phát hành này được ký duyệt, lần kiểm tra kế tiếp của chiến dịch ghim lại nhiều khả năng sẽ báo lỗi đỏ dù không có gì thật sự sai — người đọc báo cáo sau này có thể hoang mang không hiểu vì sao.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: high
  Đề xuất: known-limits

- **rang-ghim-lai: dòng `exit:` của khối khai KHÔNG bao giờ được so với vật — `exitVat` tính xong rồi vứt, và vật không hề có trường `exit`**
  Người dùng thấy gì: Dòng khai 'exit' của chiến dịch trong hồ sơ phát hành không thực sự được máy đối chiếu với dữ liệu thật — nếu con số đó bị gõ sai, hệ thống vẫn báo hợp lệ mà không phát hiện ra.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa là QUAN HỆ ba trường nhưng chỉ assert hai: `exitVat` tính xong rồi bỏ**
  Người dùng thấy gì: Dòng khai 'exit' của chiến dịch trong hồ sơ phát hành không thực sự được máy đối chiếu với dữ liệu thật — nếu con số đó bị gõ sai, hệ thống vẫn báo hợp lệ mà không phát hiện ra.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert tập KHOÁ trong khi lời hứa là giá trị: hai số đầu của chiến dịch là f(vật) so với bản sao của f(vật)**
  Người dùng thấy gì: Các con số 'bao nhiêu hồ sơ lỗi, bao nhiêu mục lỗi' trong báo cáo chỉ được đối chiếu với chính nó chứ chưa có nguồn độc lập xác nhận giá trị — nếu số liệu bị chép sai, hệ thống không phát hiện ra được.
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs`
  severity: low
  Đề xuất: known-limits

- **Nhánh «commit gốc, không có cha» của rang-so-tang.sh KHÔNG BAO GIỜ chạy — `git rev-parse <sha>^` in lại chính chuỗi ra stdout (r2)**
  Người dùng thấy gì: Với một kho mã nguồn chỉ có đúng một commit duy nhất (chưa có lịch sử trước đó), công cụ cắt số phiên bản có thể báo sai lý do lỗi thay vì chỉ đúng bước còn thiếu — nhưng tình huống này không xảy ra với các kho đang dùng kit hiện nay.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

- **Neo của rang-so-tang.sh vẫn buộc vào THỨ TỰ COMMIT: lời khai «mang số CŨ ở cả hai thứ tự» sai, và răng đỏ mã 3 khai sai về vật (r2)**
  Người dùng thấy gì: Nếu một lần phát hành sau này tách bước tăng số phiên bản và bước ghi hồ sơ mốc thành hai commit riêng biệt (khác cách làm của mốc này), công cụ kiểm tra số phiên bản có thể báo sai kết quả dù số đã tăng đúng — nhóm đã ghi nhận và xếp lịch xử lý ở một vòng riêng.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
