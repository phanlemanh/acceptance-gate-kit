#!/usr/bin/env bash
# Kéo skill `diagram-design` (+ hai lệnh đi kèm) từ kho skill cá nhân vào gói
# plugin này. MỘT chiều: kho skill là NGUỒN, thư mục này là BẢN PIN — không sửa
# tay ở đây; sửa ở kho skill rồi chạy lại script này và bump version plugin.
#
# Dùng: vendor-sync.sh <đường dẫn checkout kho skill>   (vd ~/dev/skill)
# Ghi: skills/diagram-design/ · commands/ · NOTICE (upstream, commit kho skill,
#      tree-hash sha256 của toàn bộ file vendored, ngày). CI tính lại tree-hash
#      và so với NOTICE (tests/plugins P-case) — sửa tay là ĐỎ.
set -eu
SRC="${1:?usage: vendor-sync.sh <skill-repo-checkout>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
[ -f "$SRC/skills/diagram-design/SKILL.md" ] || { echo "not a skill repo checkout: $SRC"; exit 1; }
rm -rf "$HERE/skills/diagram-design" "$HERE/commands"
mkdir -p "$HERE/skills/diagram-design" "$HERE/commands"
# rsync -aL: theo symlink, KHÔNG chép .DS_Store / fixtures thử nghiệm của script
rsync -aL --exclude '.DS_Store' --exclude 'scripts/fixtures/' "$SRC/skills/diagram-design/" "$HERE/skills/diagram-design/"
rsync -aL --exclude '.DS_Store' "$SRC/commands/" "$HERE/commands/"
COMMIT="$(git -C "$SRC" rev-parse HEAD 2>/dev/null || echo unknown)"
UP_LINE="$(grep -m1 '^Upstream:' "$SRC/skills/diagram-design/LOCAL-PATCHES.md" 2>/dev/null || echo 'Upstream: (see LOCAL-PATCHES.md)')"
SKILL_VER="$(sed -n 's/^  version: *"\{0,1\}\([0-9.]*\)"\{0,1\}.*/\1/p' "$HERE/skills/diagram-design/SKILL.md" | head -1)"
HASH="$(bash "$HERE/tree-hash.sh")"
cat > "$HERE/NOTICE" <<NOTE
Vendored component: diagram-design skill + 2 slash commands (export-diagram, import-drawio)
$UP_LINE
License:   MIT (see skills/diagram-design/LICENSE · THIRD_PARTY_LICENSES.md for Tabler icons)
Source of truth for THIS copy: private repo phanlemanh/skill (git), path skills/diagram-design + commands/
Skill metadata.version: $SKILL_VER
Skill-repo commit:      $COMMIT
Synced:                 $(date -u +%F)
Tree-hash (sha256 over sorted vendored files, see tree-hash.sh): $HASH

Rule: this copy is NOT edited by hand. Fix in the skill repo, re-run vendor-sync.sh,
bump .claude-plugin/plugin.json version. CI recomputes the tree-hash and compares it
with this NOTICE; a mismatch is a red case, and so is a hash change without a
version bump.
NOTE
echo "synced diagram-design at skill-repo $COMMIT · tree-hash $HASH"
