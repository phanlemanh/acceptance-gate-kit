# Guidance craft — teaching the user without cluttering the screen

Read at Steps 4–5 when the surface asks the user to supply something
(forms, wizards, settings, connectors) or to recover from a failure.
Visual discipline wins the calm axis; this file wins the axis calm
usually loses to — a plainer design that *teaches better* beats a
cleaner one that leaves the user stranded mid-field.

## Helper text — answer the filler's three questions

Every field a user might hesitate on answers, adjacent to the field:
**What is this? Where do I find it? What will you do with it?**

- **External referents get a trail, not a name.** For values that live
  in another product (API key, OA secret, callback URL, tax code), name
  the exact path there ("Zalo OA dashboard → Cài đặt → Khóa bí mật"),
  show the expected shape as a formatted example (`sk-live-…`, 10 digits),
  and link when a stable deep-link exists. "Enter your API key" teaches
  nothing; the trail is the help.
- **Placeholder is not help.** It vanishes on focus — exactly when the
  user needs it. Persistent helper text below the field for must-know;
  a disclosure ("Tìm ở đâu?") for the long version. Show format as
  helper or example value, not as placeholder-only.
- **Helper text spends the voice budget.** It is quiet body voice
  (text-muted, body-small), never a new small-label voice, never a
  colored box per field — one field teaching loudly is guidance,
  eight are noise. Teach-once vs repeat follows the ia-craft rule:
  a fixed form frame teaches once above the cluster; a scannable
  list repeats compactly per item.

*Test: could a first-time user fill every field without leaving the
screen to search "where do I find X"? Each field that fails needs a
trail, not a longer label.*

## Error anatomy — what happened · why · the next move

An error is a U-turn sign, not a verdict. Every error, field-level or
system-level, ships three parts:

1. **What happened** — specific and factual: "Secret không khớp định
   dạng (cần 32 ký tự hex)", never "Something went wrong" / "Đã có lỗi".
2. **Why, when known** — one clause: "token hết hạn sau 90 ngày".
3. **The next move as an operable control** — a retry button, a re-send
   link, a "mở dashboard" link, a save-and-exit — not advice in prose.
   If the fix is editing a field, the error sits at that field, the
   field keeps the user's input, and focus moves there.

- Preserve work on every failure: input stays, uploads resume, a failed
  message stays in the composer with a retry affordance.
- Tone: direction, not mood. No blame ("invalid input you entered"),
  no vague apology. The user reads an error mid-task — respect the hurry.

*Test: for each error state, point at the control the user presses
next. No control → the error is a dead end you designed.*

## Recovery paths and disabled-with-reason

- Every failure names its exit: retry (safe to repeat?), an alternate
  route ("dán tay nếu OAuth chưa được duyệt"), save-and-exit, or
  escalation that carries context (error code, timestamp) so the user
  doesn't retype the story.
- **A disabled control ships its reason adjacent** — as visible text or
  an inline hint, exposed to assistive tech too (`aria-describedby`,
  not a hover-only tooltip). A dead button with no reason reads as a
  bug; the same button with "Điền Secret để tiếp tục" reads as a guide.
- Empty states are guidance, not absence: first-run empties say what
  this place is and offer the first action; filtered-to-zero empties
  offer to broaden — different copy (see table contract).

## Confirmation — close the loop with the next step

Success states answer "what happened, and what now": "Đã kết nối Zalo OA
— tin nhắn mới sẽ xuất hiện trong Inbox" beats a bare toast "Thành
công". If the next step is elsewhere, link it; if there is nothing to
do, say what will happen without the user ("tự đồng bộ mỗi 15 phút").

*Exit test for the file: walk the surface once pretending you know
nothing — every hesitation point has an answer on-screen, every failure
has a pressable next move, and the screen got no louder for it.*
