#!/usr/bin/env bash
# Dispatcher: runs every skill-level suite under tests/skills/*/run-tests.sh
# (currently ux-ui-craft's layout-meter suite). Keeps the maintainer idiom
# `for t in ... skills; do bash tests/$t/run-tests.sh; done` working.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rc=0
for t in "$HERE"/*/run-tests.sh; do
  bash "$t" || rc=1
done
exit $rc
