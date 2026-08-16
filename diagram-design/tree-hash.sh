#!/usr/bin/env bash
# sha256 của toàn bộ file vendored (skills/ + commands/), thứ tự tên file ổn định.
# Dùng bởi vendor-sync.sh (ghi NOTICE) và bởi tests (so với NOTICE).
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
find skills commands -type f | LC_ALL=C sort | while IFS= read -r f; do
  printf '%s  ' "$f"; shasum -a 256 "$f" | cut -d' ' -f1
done | shasum -a 256 | cut -d' ' -f1
