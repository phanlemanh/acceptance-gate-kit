---
description: Thao tác cổng người thứ bảy — reality đã chấm (ADR 0020, Đ8). Người ghi bản dựng đang phục vụ prod + ngày quan sát + tên; máy ghi một dòng sổ và đặt status da-cham-boi-thuc-te trong CÙNG một commit. Hồ sơ rời nhóm đang dở, mọi việc thước trên nó bị khoá. Never observes by itself.
disable-model-invocation: true
---

Đóng một hồ sơ theo QUAN SÁT PROD. Đây là thao tác cổng người — lời khai với người đọc sau
rằng reality đã chấm vật này; rút lại là rút một chữ ký. Máy KHÔNG tự gọi lệnh này (khoá
model-invocation, ADR 0002) và KHÔNG tự điền giá trị nào của người.

Cú pháp một lượt gõ:

```
/acceptance-gate:observed <slug> <build_sha> <ngày quan sát> <tên> — <một câu người nói>
```

Cờ `--repo <path>`: mọi đọc/ghi/git chạy trên gốc `<path>` (`git -C <path>`).

**`build_sha` là sha BẢN DỰNG đang phục vụ prod lúc quan sát** — đỉnh nhánh phát hành mà
bản dựng production được dựng từ đó (ví dụ «production dựng từ ff3fb8bf, đúng commit đỉnh
onehub»). KHÔNG phải commit đầu tiên đưa vật vào: commit ấy có thể không chạm thư mục vật
nào mà vẫn là đúng bản đang chạy.

## Bước

1. **Tiền đề** — dừng và nói lý do nếu trượt một điều:
   - `_acceptance/<slug>/contract.md` tồn tại và `status` KHÁC `draft` (chưa có bộ tiêu chí
     thì không có gì để reality chấm).
   - `build_sha` đúng 40 ký tự hex, và `git cat-file -e <build_sha>^{commit}` thành công
     trong kho này (sha không có trong kho → lưới trước-merge sẽ chặn «bản dựng không có
     trong kho»).
   - Ngày đọc được thành ISO (`YYYY-MM-DD` hoặc ISO đầy đủ); tên khác rỗng.
2. **Ghi một dòng sổ** vào `_acceptance/<slug>/decisions.jsonl` theo khuôn dưới — id bằng
   khối DEC-ID-RECIPE của SKILL feature-loop (một lần chạy một dòng). Giá trị lấy NGUYÊN VĂN
   lời người; máy không sửa câu.

   <!-- <<<THUC-TE-LINE -->
   "type":"thuc-te","stage":"thuc-te","at":"<ISO ngày quan sát>","by":"<tên>","build_sha":"<40-hex bản dựng đang phục vụ prod>","decision":"<một câu người nói>"
   <!-- THUC-TE-LINE>>> -->

3. **Đặt `status: da-cham-boi-thuc-te`** trong frontmatter `contract.md` bằng công cụ sửa tệp
   (hook ghi-lúc-viết kiểm chuyển trạng thái). KHÔNG đụng `human_signoff`, verdict hay bảng
   eval của báo cáo — chúng giữ nguyên làm sử liệu.
4. **Vẽ lại bản đồ sản phẩm** nếu kho đã bật (`PRODUCT-MAP.md` có trong
   `risk_tiers.t1_skip_globs`): `node <acceptance-gate>/scripts/product-map.mjs --root .`.
5. **Một commit** gồm dòng sổ + hợp đồng (+ bản đồ nếu vẽ lại): `observed: <slug> — <tên>`.
   Dòng sổ và trạng thái đi CÙNG commit: lưới đếm «thước đổi sau dòng quan sát» từ chính
   commit ghi dòng.
6. **Nói việc kế** — một dòng: «Hồ sơ `<slug>` đã chấm bởi thực tế (bản dựng `<sha7>`,
   quan sát `<ngày>`). Mọi việc thước trên hồ sơ bị khoá; mở lại chỉ bằng một dòng sổ
   `supersedes` trỏ id dòng này, khi có một ca prod đỏ.»

## Giới hạn đã khai

Thân lệnh này là văn cho máy thi hành: việc từ chối `draft` / sha ngắn và việc commit một
lượt KHÔNG có răng hành vi ở đây. Răng nằm ở bên đọc — `checkThucTe` của
`lib/workspace-record.cjs`, gọi từ lưới trước-merge và `recheck-evidence.cjs`: dòng thiếu vế,
bản dựng lạ, hay thước đổi sau dòng quan sát đều là VIOLATION có tên.
