# Component contracts — what familiar nouns imply

Read at Step 4 when the brief names a familiar UI object. The name is a
compressed pointer to an object the user already knows; a build that
satisfies the words but not the object reads as broken, not as minimal.

**Method (MECE, then trim):** enumerate the full expected set below,
mark each item *present* or *descoped + reason*, and carry the descope
list into the process log's taste calls. A dropped control with a reason
is a decision; a dropped control without one is a defect nobody chose.

**Access is part of the contract.** The daily user of each object
includes keyboard and screen-reader users, and the object's ARIA
pattern is as standardized as its controls (WAI-ARIA Authoring
Practices). Each section's *Access* line is walked with the same
present/descoped method — an icon button with no accessible name is a
missing control for someone, not a style choice.

## Video / audio player
- Controls: play-pause · seek bar (with buffered indicator) · elapsed/total
  time · volume + mute · fullscreen · playback speed · captions toggle
  (if speech) · PiP (web, where it fits)
- Behaviors: click/tap video = toggle play · space = play-pause · ←/→ =
  scrub · double-tap edges = ±10s (mobile) · controls auto-hide on idle,
  return on hover/tap
- States: loading/buffering · error ("can't play" + retry) · ended
  (replay affordance)
- Access: every icon control carries an accessible name that tracks state
  (Play↔Pause aria-label swap) · seek and volume are `role=slider` with
  `aria-valuetext` in human units ("2:41 / 5:03") · captions toggle exposes
  `aria-pressed` · keyboard set above is part of the contract, not garnish
- Legit descopes: volume on a muted-first product · speed on short clips
  · captions on music

## Canvas / image / document viewer
- Controls: expand (enlarge stage / collapse side panels) · fit-to-width
  or fit-to-screen · zoom in/out with level indicator · pan when zoomed ·
  fullscreen · download/open-original (when user owns the asset)
- Behaviors: scroll/pinch = zoom · drag = pan · double-click = toggle
  fit/100% · Esc exits fullscreen
- States: loading progressive · oversized asset · failed load
- Access: zoom in/out/fit are named buttons; current zoom level announced
  via a polite live region · the stage itself has a real name (`figure` +
  caption or `aria-label`) · fullscreen and Esc reachable by keyboard alone
- Legit descopes: zoom on fixed-size thumbnails · download on protected
  content

## Data table (operator-grade)
- Controls: column sort with visible state · filter(s) · search · row
  hover · sticky header · pagination or virtualized scroll · bulk-select
  + bulk action bar (when actions exist per-row) · a column overflow
  strategy (truncate + title, or responsive collapse)
- Behaviors: click header = sort cycle · shift-click = multi-select
- States: empty (no data vs no match — different copy) · loading skeleton
  in the real grid · error + retry
- Access: real `<table>`/`<th scope>` (or `role=grid`) · sort state lives in
  `aria-sort` on the header, not only in an arrow glyph · per-row select
  checkboxes named per row ("Chọn {tên}") · pagination is a labeled `nav` ·
  virtualized rows declare `aria-rowcount`
- Legit descopes: bulk actions on read-only views · pagination under ~50
  rows

## Modal / dialog
- Controls: close (×) · confirm/cancel pair (primary right or per
  platform) · Esc = close · backdrop click = close (non-destructive
  contexts only)
- Behaviors: focus trapped inside, restored on close · initial focus on
  the least-destructive control
- States: busy (confirm shows progress, controls disabled with reason)
- Access: `role=dialog` + `aria-modal=true`, named by its title
  (`aria-labelledby`) · the focus trap and restore listed above are the
  accessibility behavior — losing focus placement breaks the contract
- Legit descopes: backdrop-close on flows holding unsaved input

## Search box
- Controls: clear (×) once text exists · submit affordance or live
  results · scope indicator when scoped
- Behaviors: Esc clears/closes · ↑/↓ traverse results · Enter commits
- States: no-results (with escape hatch: clear/broaden) · loading
- Access: the input is labeled (not placeholder-labeled) · live results use
  the combobox pattern (`aria-expanded`, `aria-activedescendant`) · result
  count announced politely so a non-visual user knows the list changed
- Legit descopes: live results on expensive backends (state it)

## File upload
- Controls: browse button + drop zone (both — drop alone is invisible) ·
  per-file progress · cancel · remove/replace after upload
- States: dragging-over · per-file error (type/size, named limits) ·
  success with the file shown, not just a toast
- Access: the real control is `input type=file` — the drop zone is an
  enhancement over it, never a replacement · per-file progress is
  `role=progressbar` with `aria-valuenow` · per-file errors tie to their
  file via `aria-describedby`
- Legit descopes: multi-file when the domain is single-document

## Stepper / wizard
- Controls: numbered steps with current highlighted · back (never lose
  entered data) · continue with disabled-reason · save-and-exit on long
  flows
- States: per-step validation · resume state
- Access: the step list marks the current step with `aria-current="step"` ·
  a disabled Continue exposes its reason as text tied by `aria-describedby`
  (hover-only tooltips teach nobody) · on validation failure, focus moves
  to the first errored field
- Legit descopes: save-and-exit on 2-step flows

## Chat / composer input
- Controls: send (enabled only when sendable) · multiline affordance
  (Shift+Enter) · attachment (if the product implies it) · character/
  length feedback near limits
- States: sending · failed-with-retry (message preserved) · disabled
  with reason
- Access: the composer is a labeled textarea · send button named, its
  disabled reason exposed · length feedback near the limit is a polite live
  region · a failed message announces failure and keeps retry reachable by
  keyboard
- Legit descopes: attachments where the channel is text-only

*This list covers the common offenders, not the universe. For any other
familiar noun, run the same method: name the three products your actor
uses daily that contain this object, list what those ship, mark present
or descoped-with-reason.*
