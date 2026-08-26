# Lấy phần Cổng Đáng đã cắt về — dùng CÂY, đừng dùng bản vá

`phan-cong-dang.patch` cạnh file này **đã mục**: 2/4 khối không áp được nữa, vì
các commit sau lúc cắt đụng đúng vùng đó (`commands/start.md`, `scripts/gate-card.js`).
Bản vá chỉ mang chỉ số blob, không mang mốc gốc — đúng thứ bài học **P150** trong
CLAUDE.md cấm: vật nền phải lấy từ **cây đã ghim**, không phải mảnh mang tay.

**Mốc gốc (cây còn NGUYÊN phần Cổng Đáng):** `de27babc1f8136b83ea08f8694fe744a4ecee557`
— là commit cha của `8d2ad9f0` («CẮT ĐÔI — tách Cổng Đáng sang hồ sơ cong-dang-co-cua»).

Lấy về:

```bash
git archive de27babc1f8136b83ea08f8694fe744a4ecee557 commands scripts skills lib | tar -x -C /nơi/muốn/bung
```

Đối chiếu phần đã mất so với nhánh hiện tại:

```bash
git diff de27babc1f8136b83ea08f8694fe744a4ecee557 8d2ad9f0 -- commands/approve.md commands/start.md scripts/gate-card.js
```

Giữ `phan-cong-dang.patch` làm **vết đọc**, không dùng làm đường lấy về.
