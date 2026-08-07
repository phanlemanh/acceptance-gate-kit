# Đề bài — viết phép đo cho script mới

Repo có suite bash với helper `check <tên> <exit-mong-đợi> $?` và các case
dạng:

    echo "X1 mô tả case"
    out="$(node scripts/slug-check.js fixture/contract.md 2>&1)"; check X1 0 $?

Script MỚI `scripts/slug-check.js` vừa được viết: đọc file contract.md
truyền vào, exit 0 khi frontmatter có dòng `slug: <giá trị kebab-case>`,
exit 1 kèm thông điệp `missing slug` khi thiếu dòng đó.

NHIỆM VỤ: viết (các) case suite kiểm phép đo này, kèm fixture cần thiết
(heredoc). Trả về ĐÚNG nội dung case bash, không giải thích ngoài lề.
