# Port playbook — design-of-record HTML → app JSX (reference)

The port is the second sync of the 2-repo pipeline (design-repo → app-repo). It is
an **authored translation**, not a scriptable transform: the two repos share no
token keyspace (design `--oh-*` hex ↔ app `--_*`/`--color-*` RGB-channel; app
`globals.css` is a hand-maintained projection). Fidelity is proven by rendered
numbers (computed-inspect + advisory pixel-diff), never by a cross-repo file diff.

## Target

`apps/web/plugins/<name>/view/*.tsx`
- `register-client` → **Preview** · `register-server` → **Body**
- NEVER the host shell or `components/ui/` (Platform↔Artifact boundary).

## Structural mapping

| Design-of-record (HTML/CSS) | App runtime (React/Tailwind) |
|---|---|
| `composer.html` / `living.html` / `preview.html` surface | the matching plugin view `.tsx` |
| class using `--oh-*` token | class token in app space (`bg-primary`, `text-body`, `rounded-card`) |
| raw hex / raw px | **forbidden** — must map to a `--_* / --color-*` token (enforced by `design-static-check.mjs`) |
| static sample content | data bound to the contract fields named in the S1 seam |

## Token translation

Design authors on `--oh-*` (hex). The app consumes `--_*` (RGB-channel) + `--color-*`
(semantic roles), transcribed by hand in `apps/web/app/globals.css` ("giá trị lấy
NGUYÊN … để khử drift"). Port = pick the app-space class token whose value the app's
projection already maps from the design token. If the design introduces a token the
app projection lacks → that is a **token change** (T3), handle it before porting.

## Anti reference-rot

`provenance.json` (written by `provenance.mjs`) pins `{design_repo, commit,
captured_at, breakpoints}`. The blocking + advisory layers refuse (BLOCKED) when it
is missing, so a stale reference can never masquerade as a passing fidelity check.
