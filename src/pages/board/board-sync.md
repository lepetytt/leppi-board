# Rule: the task board shows what we're doing

> A rule for a coding agent (Claude Code or similar): it keeps the board while it works. Copy it into your project's
> agent rules (for Claude Code: `.claude/rules/` plus an import line in `CLAUDE.md`).
> Tried on a real project: the board ran from the first day and carried ~100 cards across sprints.
> **The owner** below is the person who sets the tasks and accepts the work.

## Where the board is

<!-- When connecting the board, the agent writes the real folder, port and address here. -->
- The shell's folder, port **6010**: locally http://localhost:6010. Start — `npm run dev`.
- Data — `src/pages/board/board.json`. **The agent keeps the cards:** the owner says it in words, the agent edits the file.
  A new card is an entry in `cards`, a move is a change of `column`, the order in a column is the order in the list.
- Published: not yet.
- Columns: **Ideas · Backlog · In progress · Review · Done · Declined**. Declined — turned down on the owner's word,
  with the reason in "What's done".
- **Sprints** — the `sprints` list, a card has a `sprint` field; **a new card goes to the last sprint**.
- Areas (`areas`) and tags (`tags`) — at the top of `board.json`. Card fields — the shell's README, "The board".

## What I do

1. **I take a task from the board** → its card goes to In progress right away, before the first edit.
2. **The owner asks for something new that isn't on the board** → a card in In progress, in their words. Small fixes along
   the way of the current task ("thinner", "less padding") don't get their own cards — they go into that card's "What's done".
3. **Finished** → Review, with the card filled in:
   - `done` — "What's done": short, with numbers, plus what isn't done or isn't checked;
   - `check` — "How to check": steps with links (the local address, and for a phone version — the Mac's address on Wi-Fi)
     and what exactly to look at. Where I can't check (another OS, someone else's device, an outside service), I say so
     and name who will.
4. **Done — only on the owner's word**, after they check. I don't move cards to Done myself.
5. **Found a problem outside the task** → a card in Backlog with context (where, how to see it); I don't fix it silently.
   **Unclear things** → Ideas, with full context. When an idea becomes a task, its card moves to Backlog.
6. **Remarks the owner sends** (screenshots, feedback from the client and testers) → cards: the place, the source
   (who, when, a timecode), a quote. Screenshots — files in `public/board/`, listed in the card's `images` field
   (shown only in the card's details). If such a card already exists, I add to it instead of making a duplicate.
   Something that looks like a bug — I check it against the code first and write in the card whether it's confirmed.
7. **Priority P1–P3** — I suggest, the owner decides. Cards waiting on the client and ideas have no priority.
   Anything needed from the client (texts, photos, access, a decision, an answer) — **the "Client" tag**: the filter above
   the board goes by it.
8. **A new sprint — on the owner's word:** an entry in `sprints` (dates and, if wanted, the sprint's `word`: what it's about),
   and everything unfinished — not Done and not Declined, Review included — moves to the new sprint. Past sprints keep
   their Done and Declined cards.
9. **Dates — from the clock** (`date`), in a card — `YYYY-MM-DD`.
10. **Publishing — on the owner's word**, like any commit and push: the board changes locally and reaches the site after
    "push it". At the end of a turn I say if the board isn't published.

## Boundary

The board is **a list of tasks and their state**. History and decisions live where they live in the project (a log,
decision records, research): a card links to them instead of retelling them.

## Anti-pattern

❌ Do a task, tell about it in chat, and the card stays in Backlog. Or move it to Done yourself "since everything is checked".
✅ The card moves with the work: In progress → Review with "What's done" and "How to check" → Done after the owner's word.
