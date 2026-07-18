# Mobile app reference — native and native-feeling UI

Read this after the Context Lock, before generating tokens. It refines the
core process for apps; it does not replace it.

## Respect the platform before the brand

Users spend all day inside their platform's conventions; violating them
costs more trust than any brand consistency gains.

- **iOS**: tab bar for top-level navigation, back via left-edge swipe and
  top-left chevron, sheets for scoped tasks, SF-adjacent type behavior,
  pull-to-refresh where content is a feed.
- **Android (Material 3)**: bottom navigation or navigation drawer,
  system back button/gesture must always do the expected thing, FAB only
  for *the* single primary action of a screen (or not at all).
- Cross-platform frameworks still owe each platform its own navigation
  feel, haptics, and back behavior. One codebase is an implementation
  detail; it is not an excuse users accept.

*Test: would a daily user of this OS find any control in an unexpected
place?*

## The thumb is the cursor

- Primary actions live in the bottom third of the screen; destructive
  actions live away from the natural thumb arc.
- Touch targets ≥ 44pt (iOS) / 48dp (Android) with ≥ 8pt spacing between
  adjacent targets. Dense hit areas cause mis-taps that users blame on
  themselves — then on the app.
- Reachability beats symmetry: top corners are the most expensive real
  estate on a large phone; put lookup there, not frequent actions.

## Safe areas and real devices

- Lay out against safe-area insets (notch, home indicator, punch-holes);
  never hard-code status-bar heights.
- Design for the smallest supported device *and* the largest: one-handed
  on a mini, split-view on a tablet if supported.
- Keyboard avoidance is a state (Step 5): every input must remain visible
  and submittable with the keyboard open.

## Gestures need visible invitations

- Every gesture-only action needs a discoverable affordance or an on-first
  -use hint: swipe-to-delete shows a peek of the action, cards that pan
  have visible edges.
- Never make a gesture the *only* path to a critical action; provide a
  visible equivalent.
- Reserve edge swipes for the platform (back, system UI); don't fight the
  OS for them.

## Interruption is the normal case

A phone session is interrupted by design — calls, notifications, app
switches, elevators. Treat these as first-class states:

- Persist in-progress input aggressively; returning after an hour restores
  exactly where the user was.
- Offline: reads come from cache with a visible freshness cue; writes
  queue with clear pending state and sync on reconnect. An airplane-mode
  session should degrade, not dead-end.
- Long operations survive backgrounding and report completion via
  notification only when genuinely useful.

## Motion and continuity

- Shared-element transitions (list item grows into detail) are the mobile
  version of "motion as a spatial model": they answer where the user went.
- 60fps is a gate, not a wish: virtualize long lists, precompute layout,
  never animate properties that trigger layout passes.
- Haptics sparingly and semantically: success, warning, selection — never
  ambient.

## Permissions and asking well

- Ask in context, after demonstrating value — "allow location to see homes
  near you" at the moment of the map, never a wall of prompts at first
  launch.
- Pre-prompt (your own UI) before the OS prompt when the permission is
  deniable-forever; a denied OS prompt is nearly unrecoverable.
- Notifications are a contract: let users choose channels, and honor
  quiet expectations — one regretted push costs the whole channel.

## App top-tier notes

- Perceived speed: optimistic UI on every local mutation; skeletons on
  first paint; cold start to interactive content < 2 s on a mid-range
  device.
- Undo over confirm matters *more* on touch: fat-finger taps are common,
  so deletion shows an undo snackbar instead of interrogating intent.
- Offline-first is the mobile expression of "judged by the worst screen":
  review the app in airplane mode before calling it done.
