# Component contracts — what familiar nouns imply

Read at Step 4 when the brief names a familiar UI object. The name is a
compressed pointer to an object the user already knows; a build that
satisfies the words but not the object reads as broken, not as minimal.

**Method (MECE, then trim):** enumerate the full expected set below,
mark each item *present* or *descoped + reason*, and carry the descope
list into the process log's taste calls. A dropped control with a reason
is a decision; a dropped control without one is a defect nobody chose.

## Video / audio player
- Controls: play-pause · seek bar (with buffered indicator) · elapsed/total
  time · volume + mute · fullscreen · playback speed · captions toggle
  (if speech) · PiP (web, where it fits)
- Behaviors: click/tap video = toggle play · space = play-pause · ←/→ =
  scrub · double-tap edges = ±10s (mobile) · controls auto-hide on idle,
  return on hover/tap
- States: loading/buffering · error ("can't play" + retry) · ended
  (replay affordance)
- Legit descopes: volume on a muted-first product · speed on short clips
  · captions on music

## Canvas / image / document viewer
- Controls: expand (enlarge stage / collapse side panels) · fit-to-width
  or fit-to-screen · zoom in/out with level indicator · pan when zoomed ·
  fullscreen · download/open-original (when user owns the asset)
- Behaviors: scroll/pinch = zoom · drag = pan · double-click = toggle
  fit/100% · Esc exits fullscreen
- States: loading progressive · oversized asset · failed load
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
- Legit descopes: bulk actions on read-only views · pagination under ~50
  rows

## Modal / dialog
- Controls: close (×) · confirm/cancel pair (primary right or per
  platform) · Esc = close · backdrop click = close (non-destructive
  contexts only)
- Behaviors: focus trapped inside, restored on close · initial focus on
  the least-destructive control
- States: busy (confirm shows progress, controls disabled with reason)
- Legit descopes: backdrop-close on flows holding unsaved input

## Search box
- Controls: clear (×) once text exists · submit affordance or live
  results · scope indicator when scoped
- Behaviors: Esc clears/closes · ↑/↓ traverse results · Enter commits
- States: no-results (with escape hatch: clear/broaden) · loading
- Legit descopes: live results on expensive backends (state it)

## File upload
- Controls: browse button + drop zone (both — drop alone is invisible) ·
  per-file progress · cancel · remove/replace after upload
- States: dragging-over · per-file error (type/size, named limits) ·
  success with the file shown, not just a toast
- Legit descopes: multi-file when the domain is single-document

## Stepper / wizard
- Controls: numbered steps with current highlighted · back (never lose
  entered data) · continue with disabled-reason · save-and-exit on long
  flows
- States: per-step validation · resume state
- Legit descopes: save-and-exit on 2-step flows

## Chat / composer input
- Controls: send (enabled only when sendable) · multiline affordance
  (Shift+Enter) · attachment (if the product implies it) · character/
  length feedback near limits
- States: sending · failed-with-retry (message preserved) · disabled
  with reason
- Legit descopes: attachments where the channel is text-only

*This list covers the common offenders, not the universe. For any other
familiar noun, run the same method: name the three products your actor
uses daily that contain this object, list what those ship, mark present
or descoped-with-reason.*
