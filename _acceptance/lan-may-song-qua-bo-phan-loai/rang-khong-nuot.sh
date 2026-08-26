#!/usr/bin/env bash
# Răng hồ sơ lan-may-song-qua-bo-phan-loai — AC-3 «không nuốt cấu hình khác».
#
# CỐ Ý KHÔNG vào suite vĩnh viễn. Nó so bản `.claude/settings.json` ở mốc git CỐ
# ĐỊNH `BASE-LMSQBPL` với bản trong cây; để trong bộ kiểm thường trực thì MỌI sửa
# hợp lệ về sau của `enabledPlugins` / `extraKnownMarketplaces` — do hồ sơ KHÁC làm
# — sẽ làm suite đỏ dù không ai đụng `permissions`. Đó là «thước ghim vào thứ SẼ
# ĐỔI»: mốc sha bất biến, còn vật bị ghim là file cấu hình SỐNG của kho.
# Răng chết theo hồ sơ khi gộp, cùng nếp với các răng hồ sơ khác trong config.yaml.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # suy từ vị trí script
ROOT="$(cd "$HERE/../.." && pwd)"
exec node "$HERE/rang-khong-nuot.mjs" "$ROOT" "$HERE"
