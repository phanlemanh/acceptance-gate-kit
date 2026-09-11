# Design — mốc phát hành 2.11.0: bộ giải cấu hình thôi tự bóc nháy

- Ngày: 2026-09-10
- Slug: `release-2-11-0` · hạng **T3** (chạm `lib/**` → `risk_tiers.t3_paths`)
- Cửa sổ: `04069351` (mốc 2.10.0) → `d1d36479` — 31 commit, **một vòng** (`eval-khai-ma-thoat-mong-doi`, PR #165)

## 1. Vì sao vòng này tồn tại — chuỗi xanh-giả đã dựng thật

Đo trên `main` `d1d36479`, 10/09, TRƯỚC khi chạm dòng nào:

```
resolveConfigKey("suites.bal") ← pytest -q -k 'a or b'
                              → "pytest -q -k 'a or b"        ← mất dấu đóng
bash -c "pytest -q -k 'a or b"  → exit 2                       ← vỡ cú pháp
EXPECTED_EXIT_BANNED = [97,127] → 2 KHÔNG bị cấm               ← luật ship 10/09
hồ sơ khai expected_exit: 2     → PASS                          ← «giới hạn đã khai»
```

Bốn bước, không bước nào đoán. Răng vừa ship ở PR #165 đọc **lỗi hạ tầng của chính
kit** thành **lời khai hợp lệ của tác giả hồ sơ**. Đây là hình dạng thứ ba của cùng
một lớp: hồ sơ mốc 2.10.0 đã tự khai lớp này **tái phát hai mốc liên tiếp** rồi chọn
Known limits thay vì vá — và tự gọi tên nó làm **ứng viên nhát cắt thứ hai** cho cửa
sổ này («biến `resolve-config-go-escape` thành RĂNG chứ không phải lời dặn»). Owner
gọi tên tối 10/09: vá NGAY TRONG hồ sơ mốc, đúng tiền lệ 2.10.0 đã mở cho lỗ
fail-open làn V.

Hình dạng thứ hai của cùng mệnh đề, cũng đo được:

```
resolveConfigKey("suites.esc") ← "cd /tmp && echo --with \"x==1\" done"
                               → cd /tmp && echo --with \"x==1\" done   ← escape KHÔNG gỡ
```

bash nhận literal `\"x==1\"` thay vì `"x==1"` — sai argv, không sai cú pháp, nên
**không có mã thoát nào tố cáo**. Đây là nửa còn lại mà oneflow đã tự vá tại chỗ.

## 2. Chẩn đoán — vì sao mệnh đề cũ sai

```js
const val = m[2].replace(/\s+#.*$/,'').trim().replace(/^["']|["']$/g,'');
```

`/^["']|["']$/g` là một **phép thay thế có neo, dạng lựa-chọn** — không phải phép
khớp CẶP. Nó gỡ một nháy đầu và một nháy cuối **độc lập với nhau**, nên một chuỗi
chỉ TÌNH CỜ kết thúc bằng nháy vẫn mất ký tự đó dù nháy ấy chưa bao giờ là vỏ bọc.
Và vì nó chỉ *cắt vỏ*, nó không biết gì về **escape bên trong vỏ**.

Đúng khuôn nghiệm của CLAUDE.md — *biến bất biến từ đầu-người sang vật-máy-giữ*:
bất biến «giá trị THI HÀNH được ra khỏi bộ giải đúng như người viết nó» phải nằm
trong MỘT hàm, không nằm trong lời dặn «nhớ đừng để nháy cuối dòng».

## 3. Bản vá

Một hàm xuất khẩu duy nhất trong `lib/evidence-core.cjs`:

```js
function unquoteScalar(raw) {
  const s = String(raw == null ? '' : raw);
  if (/^"(?:[^"\\]|\\.)*"$/.test(s)) return s.slice(1, -1).replace(/\\(["\\])/g, '$1');
  if (/^'(?:[^']|'')*'$/.test(s)) return s.slice(1, -1);
  return s;
}
```

Khác bản đã chạy ở oneflow (`/^".*"$/` · `/^'.*'$/`) đúng MỘT điều: hai biểu thức
này đòi nháy trong thân phải **hợp lệ theo YAML** (nháy kép trong vỏ kép phải
escape; nháy đơn trong vỏ đơn phải nhân đôi). Hệ quả: hình dạng `"a" && echo "b"` —
nháy ở cả hai đầu nhưng KHÔNG phải một cặp vỏ — nay **giữ nguyên văn** thay vì bị
xẻ thành `a" && echo "b`. Trên mọi đầu vào oneflow thật sự chạy, hai bản cho **cùng
một kết quả**; bản này là tập cha đúng chiều luận đề của vòng: *bộ giải không bao
giờ được lặng lẽ làm hỏng một chuỗi sắp được thi hành*. Ghi sổ quyết định, cửa veto
mở ở Cổng Phạm vi.

**Sửa theo LỚP, không vá chỗ được nêu tên.** Quét cả kho tìm cùng hình dạng
(`grep '\^\["'\''\]'`, 30 hit) rồi phân loại theo **giá trị đọc ra có bị THI HÀNH
hay không**:

| Vị trí | Giá trị đọc ra là gì | Xử |
|---|---|---|
| `resolveConfigKey` leaf | **chuỗi lệnh** (`suite_keys`, `cmd: config:`) | dùng `unquoteScalar` |
| `resolveConfigList` inline `[a,b]` + block `- item` | tên khoá chấm | dùng chung — cùng hình dạng, một nguồn |
| `s4-args.mjs` ×4 (list field, id, models) | `paths`/`inputs`/**`steps`**/tên model | dùng chung — `steps` của `ui-check` là **chỉ thị cho agent**, một bước kết thúc bằng `"Save"` đang bị xén |
| `extractRunIds` · `walkEvalExits` · `extractVerifierValues` · `frontmatterField` · `expected_exit` | id, số nguyên, tên người | **KHÔNG chạm** — không phải chuỗi bị thi hành; nháy lệch ở đó không phải đường xanh-giả |

Ranh giới hàng cuối là một quyết định có chủ ý, không phải bỏ sót: mở rộng sang đó
là đổi hành vi của năm bộ đọc đang có răng riêng, không trace về nguyên tố nào.

## 4. Bán kính ở repo tiêu thụ

Đo lại trên cây thật của ≥2 repo, ghi số vào hồ sơ mốc. Số đã có từ đợt 2.10.0:
oneflow 1 khoá suite + 6 eval của `chong-doc-sai-em-ru`; crm quét 0 ca.

Hệ quả cho rollout: sau khi 2.11.0 ship, bản vá này **trùm lên** vá local của
oneflow ở `lib/evidence-core.cjs` — oneflow hết fork ở tệp đó.

## 5. Cắt số + hồ sơ mốc

- `.claude-plugin/plugin.json` · `feature-loop/.claude-plugin/plugin.json`: 2.10.0 → **2.11.0**, mỗi mô tả thêm mục `v2.11.0`; mục của feature-loop phải TỰ khai `Pairs with acceptance-gate >= 2.11.0.` **bên trong mục đó** (P200 đột biến «dời sang mục lịch sử» canh đúng điều này).
- `GUIDE.md:5` — câu dẫn xuất, P200 dựng câu từ manifest rồi so.
- `.claude-plugin/marketplace.json` **không mang trường version** nào → không có gì để cắt; đo bằng `grep -c version` = 0.
- `diagram-design` giữ **2.7.0** — `git diff 04069351..HEAD -- diagram-design/` RỖNG.
- Hồ sơ mốc theo khuôn 2.10.0: ba dòng số luật (c) **đếm tay** · bảng lớp vendored 9 mục · lớp lỗi tái phát · nhát cắt kế.

## 6. Ngoài phạm vi

Rollout 7 repo tiêu thụ · phiên nghiệm thu gộp 10 hồ sơ Cổng Giá trị (nhát cắt số
một của 2.10.0, vẫn treo) · sửa eval đỏ sẵn ở oneflow/crm · hai PR nháp
`phanlemanh/OneFlow#116` và `phanlemanh/crm#35`.

## 7. Đặc tả UX

Bỏ — hồ sơ không chạm bề mặt người nhìn (surface `cli`). Vào sổ quyết định.
