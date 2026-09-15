## Trong hợp đồng

### E5 ghim sai thông điệp: expected trích một dòng PASS mà răng không bao giờ in
- AC: AC-5
- file: `_acceptance/release-2-14-0/evals.yaml:122`
- severity: high
- source: conventions

E5 khai expected là «PASS: so ho so hoa cu ghi trong ho so (<n> tai moc <sha>) BANG so luoi dang noi hom nay — khong phai so chep tay tu moc truoc». Dòng răng thật sự in (rang-ton-dong.sh:76) là «PASS: so ho so hoa cu ghi trong ho so (<n> ho so duy nhat tai moc <sha8>, do tren HEAD <head>) BANG so luoi dang noi hom nay, va moi lan con so ay xuat hien trong hop dong deu tro ve o marker». Đuôi câu khác hẳn, và cả hai vế mới (đếm theo hồ sơ duy nhất · in HEAD) — đúng hai thứ gap-probe P2 ghi «fixed» — đều không có trong expected.

Kịch bản fail: verifier làm đúng luật CLAUDE.md «ghim đúng thông điệp mong đợi, không chỉ mã thoát» sẽ so literal và phán FAIL trên một vật lành; lối ra kia tệ hơn — verifier nới thành «exit 0 là được», và E5 tụt về assertion chỉ-đọc-mã-thoát, đúng lớp mà bốn eval còn lại (E1, E1b, E2 đều khớp literal từng chữ) cố ý tránh. Đây cũng là chỗ dễ trôi nhất khi ghim lại: `output` trong evidence-report sẽ không khớp expected của chính hồ sơ.

### Chốt «một nguồn» (mã 7) của rang-ton-dong.sh bị dấu in đậm markdown vô hiệu hoá
- AC: AC-5
- file: `_acceptance/release-2-14-0/rang-ton-dong.sh:73`
- severity: medium
- source: conventions

Chốt là `grep -E 'ghim lại|hoá cũ' "$C" | grep -oE '[0-9]+ hồ sơ' | grep -vE "^$SO "`. contract.md:250 chứa «5. **Chiến dịch ghim lại.** Hai nền, khai cạnh nhau: **71** hồ sơ có pin tụt sau vật…» — dòng này KHỚP từ khoá «ghim lại», mang một con số hồ sơ KHÁC ô marker (71 ≠ so_stale 45), nhưng thoát chốt chỉ vì `**` chen giữa `71` và khoảng trắng. Chạy tay xác nhận: pipeline hiện chỉ bắt được đúng `45 hồ sơ`; `71** hồ sơ` (và `69 hồ sơ`, `4 hồ sơ` ở các dòng không mang từ khoá) rơi ngoài tầm.

Hai chiều đều hỏng: (a) dòng PASS quảng cáo «va moi lan con so ay xuat hien trong hop dong deu tro ve o marker» — lời khai rộng hơn thứ chốt thật sự đo, tức bằng chứng tự dối; (b) 71 là con số ĐÚNG của một nền khác mà hợp đồng cố ý khai cạnh nhau, nên ngày ai đó bỏ in đậm (hoặc đổi sang «71 hồ sơ» ở văn xuôi), chốt sẽ ĐỎ OAN mã 7 trên một hợp đồng lành — đúng bệnh «phép đo rộng hơn vật là phép đo đỏ oan» mà chú thích ngay trên nó tự cảnh báo. Chốt cần phân biệt được hai nền (45 trong cửa sổ · 71 toàn kho) thay vì dựa vào markup.

### E3c đòi dòng PASS của P200 mà lệnh nó gọi đã lọc bỏ — eval không thể thoả, mãi mãi
- AC: AC-3
- file: `_acceptance/release-2-14-0/evals.yaml:66`
- severity: high
- source: bugs

E3c dùng `cmd: config:executors.test.plugins`, mà khoá đó ở `_acceptance/config.yaml` là `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`. Bộ lọc chỉ giữ dòng chứa `FAIL` hoặc bắt đầu bằng `Results:`.

Dòng PASS của P200 do `pass()` in ra là `  PASS: P200 mot lan cat so nhat quan: …` — không chứa `FAIL`, không bắt đầu bằng `Results:`. Đã thử: `echo "  PASS: P200 mot lan cat so nhat quan: hai plugin cung so" | grep -E "FAIL|^Results:"` → rc=1, không khớp. Dòng tiêu đề mà `run()` echo trước khi chạy khối cũng không chứa `FAIL`; mọi dòng P200 in ra khi XANH (`P200 VE:`, `[chieu do] … -> DO «…»`, `P200 OK (…)`) đều bị lọc. Nghĩa là khi suite xanh, ĐÚNG 0 dòng nào nhắc P200 lọt ra đầu ra.

Hệ quả: vế dưới ngưỡng mà chính expected khai («suite xanh mà P200 không hề chạy thì con số của mốc không có ai canh») không bao giờ đo được. Hai lối ra đều hỏng: verifier chấm chặt → E3c ĐỎ vĩnh viễn vì hạ tầng chứ không vì vật; verifier chấm lỏng → nuốt một lời hứa chưa bao giờ chạy — đúng cặp «bắt đúng lỗi» vs «chưa bao giờ chạy» mà hiến pháp bắt phân biệt.

Đối chiếu sử liệu: mốc 2.13.0 KHÔNG dùng khoá suite trần cho E3c, nó dựng khoá riêng `plugins_so_ca_2_13` với dòng PASS của chính răng (`_acceptance/release-2-13-0/evals.yaml:52`). Mốc này lùi về khoá trần mà vẫn giữ lời hứa cũ trong expected.

### expected của E5 ghim một câu PASS mà rang-ton-dong.sh không hề in
- AC: AC-5
- file: `_acceptance/release-2-14-0/evals.yaml:121`
- severity: high
- source: bugs

E5 ghim: «PASS: so ho so hoa cu ghi trong ho so (<n> tai moc <sha>) BANG so luoi dang noi hom nay — khong phai so chep tay tu moc truoc».

Đã chạy thật `bash _acceptance/release-2-14-0/rang-ton-dong.sh --chan ghim-lai` trên cây hiện tại (rc=0), dòng in ra là:

  PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD 8b7be956) BANG so luoi dang noi hom nay, va moi lan con so ay xuat hien trong hop dong deu tro ve o marker

Lệch hai chỗ: (a) phần trong ngoặc nay có thêm «ho so duy nhat» + «do tren HEAD <sha>»; (b) mệnh đề đuôi đổi hẳn từ «— khong phai so chep tay tu moc truoc» thành «, va moi lan con so ay xuat hien trong hop dong deu tro ve o marker». `expected` là bản cũ, chưa cập nhật theo bốn nhát vá mà gap-probe ghi là `fixed` (đếm theo hồ sơ duy nhất · in HEAD · chốt một-nguồn mã 7).

Bằng chứng ghim sai câu là bằng chứng không phân biệt được bản răng nào đã chạy — đúng lớp mà `rang-moc.sh`/`rang-p200.sh` thêm DẤU BẢN RĂNG để chặn. Ba eval máy còn lại (E1, E1b, E2) đã đối chiếu và khớp từng chữ với đầu ra thật; chỉ E5 lệch.

### Chốt «một nguồn» của rang-ton-dong.sh mù với số bọc đậm — đúng khuôn văn mà chính hợp đồng đang dùng
- AC: AC-5
- file: `_acceptance/release-2-14-0/rang-ton-dong.sh:73`
- severity: medium
- source: bugs

Chốt mã 7: `LAC="$(grep -E 'ghim lại|hoá cũ' "$C" | grep -oE '[0-9]+ hồ sơ' | grep -vE "^$SO " | sort -u || true)"`.

Mẫu `[0-9]+ hồ sơ` đòi chữ số DÍNH ngay khoảng trắng rồi tới «hồ sơ». Văn hợp đồng của chính mốc này viết số ở dạng đậm: `contract.md:250` — «**71** hồ sơ có pin tụt sau vật … **45** tụt trong cửa sổ». Dấu `**` chen vào giữa nên mẫu không khớp.

Đã thử hai chiều trên bản sao contract.md, cùng `SO=45`:
- thêm dòng `Chiến dịch ghim lại còn **43** hồ sơ đang chờ.` → `LAC=[]` → chốt XANH, số chép tay hoá cũ lọt.
- thêm dòng `Chiến dịch ghim lại còn 43 hồ sơ đang chờ.` → `LAC=[43 hồ sơ]` → chốt ĐỎ đúng.

Tức chốt chỉ canh được đúng một lần xuất hiện trần (`contract.md:132`), còn mọi lần viết theo khuôn đậm — khuôn mà chính tệp đang dùng cho hai con số 71 và 45 — thì trượt. Cùng hình dạng với lỗi ký-tự-biên vừa vá ở chính chốt này (gap-probe ghi «dưới bash không khớp gì nên chốt xanh vĩnh viễn»): phép đo hẹp hơn vật, xanh vì chưa bao giờ nhìn tới. Chốt cũng không có đối chứng dương nào buộc grep đầu tiên phải khớp ≥1 dòng, nên nếu hai cụm neo («ghim lại», «hoá cũ») trôi khỏi văn thì cả chốt tắt im.

### Hình dạng 5 — tuyên quét LỚP «mọi lần con số xuất hiện» nhưng chỉ có điểm-case: mẫu mù với chữ đậm markdown
- AC: AC-5
- file: `_acceptance/release-2-14-0/rang-ton-dong.sh:73`
- severity: high
- source: measurement

Dòng 73: LAC="$(grep -E 'ghim lại|hoá cũ' "$C" | grep -oE '[0-9]+ hồ sơ' | grep -vE "^$SO " | sort -u || true)", và dòng PASS (dòng 76) quảng cáo «...va moi lan con so ay xuat hien trong hop dong deu tro ve o marker». Đó là lời hứa LỚP, nhưng hiện thân là một điểm-case: (a) chỉ soi những DÒNG chứa literal 'ghim lại' hoặc 'hoá cũ', (b) chỉ khớp đúng hình dạng «<chữ số><khoảng trắng>hồ sơ». Chạy thử trên chính hợp đồng của vòng này: bộ lọc chỉ khớp ĐÚNG MỘT chỗ («45 hồ sơ», contract.md dòng 132). Ba chỗ khác của cùng con số/cùng chiến dịch rơi ra ngoài: contract.md dòng 250–251 viết «**71** hồ sơ có pin tụt sau vật ... · **45** tụt trong cửa sổ 7d12ffad..HEAD» — dấu ** chen giữa chữ số và từ «hồ sơ» nên regex không khớp; contract.md dòng 267 «danh sách 69 hồ sơ» nằm trên dòng không chứa hai literal lọc nên không được soi. Hệ quả: đúng lớp trôi mà răng sinh ra để bắt (một con số chép tay hoá cũ) vẫn xanh nếu người viết bôi đậm nó — mà bôi đậm chính là cách hợp đồng này đang viết con số. Đây là ma trận toàn phần bị thay bằng một assert điểm, trong khi dòng bằng chứng lại phát biểu ở dạng phủ định toàn xưng.

### Hình dạng 4 — E5 ghim một thông điệp mà răng KHÔNG BAO GIỜ in, phán quyết rơi về mã thoát
- AC: AC-5
- file: `_acceptance/release-2-14-0/evals.yaml:122`
- severity: medium
- source: measurement

E5 (dòng 121–123) ghim: «PASS: so ho so hoa cu ghi trong ho so (<n> tai moc <sha>) BANG so luoi dang noi hom nay — khong phai so chep tay tu moc truoc». Dòng thật mà rang-ton-dong.sh dòng 76 in ra (đã chạy, exit 0) là: «PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD 8b7be956) BANG so luoi dang noi hom nay, va moi lan con so ay xuat hien trong hop dong deu tro ve o marker». Vế đuôi được ghim («— khong phai so chep tay tu moc truoc») không tồn tại trong script, và hai vế thật («ho so duy nhat», «do tren HEAD <sha>», mệnh đề marker) không có trong expected. Ba eval còn lại của cùng hồ sơ (E1, E1b, E2) ghim đúng từng chữ dòng PASS của răng mình, nên đây là lệch riêng của E5: người/hội đồng đối chiếu theo literal sẽ không khớp, còn đối chiếu nới tay thì thứ duy nhất còn phân biệt được là mã thoát — đúng cái mà khuôn đầu evals.yaml (dòng 3–4) tuyên bố không lấy làm phán quyết.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **rang-ton-dong.sh nuốt im cờ `--chan ghim-lai` mà config truyền — fail-open đúng lớp vừa vá ở răng bên cạnh**
  Người dùng thấy gì: Cờ chọn loại kiểm tra ghim lại có thể bị đổi hoặc rơi mất khỏi cấu hình mà không ai nhận ra ngay, vì bước kiểm tra hiện chạy giống hệt nhau bất kể cờ đó ghi gì.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **Hai răng MỚI thiếu «dấu bản răng» mà hai răng chép đã có — output ghim lại không phân biệt được bản**
  Người dùng thấy gì: Nếu bằng chứng của bước kiểm tra này được dùng lại sau khi mã nguồn kiểm tra đổi, người đọc sau này sẽ không biết chính xác phiên bản kiểm tra nào đã tạo ra kết quả PASS đang lưu.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

- **rang-ton-dong.sh nuốt im cờ `--chan ghim-lai` mà config, hợp đồng và evals đều khai**
  Người dùng thấy gì: Cờ chọn loại kiểm tra ghim lại có thể bị đổi hoặc rơi mất khỏi cấu hình mà không ai nhận ra ngay, vì bước kiểm tra hiện chạy giống hệt nhau bất kể cờ đó ghi gì.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **opportunity.md mới thêm mang con số tồn đọng đã hoá cũ (42) mà không răng nào soi**
  Người dùng thấy gì: Một tài liệu phụ ở hồ sơ khác còn ghi con số cũ về chiến dịch dọn dẹp đang hoãn; con số này không xuất hiện trong nội dung mà người dùng bản phát hành 2.14.0 nhận được.
  file: `_acceptance/mot-nguon-tai-gui-triage/opportunity.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — cờ trong config rơi vào hư không: răng không đọc tham số, không đối chứng, fail-open**
  Người dùng thấy gì: Cờ chọn loại kiểm tra ghim lại có thể bị đổi hoặc rơi mất khỏi cấu hình mà không ai nhận ra ngay, vì bước kiểm tra hiện chạy giống hệt nhau bất kể cờ đó ghi gì.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).