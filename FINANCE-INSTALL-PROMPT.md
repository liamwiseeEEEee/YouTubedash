# 🤖 Finance Dashboard — Install Prompt

The easiest way to add the new finance page to your dashboard: let **Claude Code** do it.

### Steps
1. **Download** the finance HTML file from Patreon.
2. **Drag it into your dashboard folder** (the same folder that has `index.html`, `topbar.js`, etc.).
   It's fine if it's named `finance-2.html` or `finance (1).html` — the prompt handles that.
3. Open **Claude Code** in that folder and **paste the prompt below**.

---

### 📋 Copy this prompt

```
I want to swap my dashboard's finance page for a new standalone version.

I've added the new finance HTML file to this project folder (I dragged it in — it
might be named finance.html, finance-2.html, or finance (1).html).

Please do this:
1. Find the new finance HTML file I added — it's the one whose contents include the
   text "vty_finance_standalone_v1" (that marks the new standalone build).
2. Replace the existing finance.html in this project with it, keeping the filename
   exactly finance.html. If that left a duplicate (e.g. finance-2.html), delete it.
3. Do NOT change any other file. Then confirm the homepage tile in index.html and the
   top-bar button in topbar.js still link to finance.html.
4. Verify the file is clean UTF-8 — characters like — · ← ⚙ ↻ must render correctly,
   not as â / Ã / Â· garble.
5. Commit the change and push to GitHub on the main branch so Vercel auto-deploys.
6. When you're done, confirm the push succeeded and remind me to hard-refresh the live
   site (Cmd/Ctrl + Shift + R).

Context: the new finance page is fully self-contained. It needs no backend and no
Supabase. Its AI features (the Echo coach and screenshot/receipt import) run straight
from the browser using each person's own Anthropic API key, pasted into the page's
"⚙ keys" panel. It starts empty and saves to the browser.
```

---

### After it runs
- Wait ~1 minute for Vercel to redeploy, then **hard-refresh** your live finance page.
- It starts **empty** — that's correct. Add accounts, or import a statement screenshot.
- Turn on AI: open the page → **⚙ keys** → paste your **Anthropic** key (and optionally a
  **Finnhub** key for live stock prices). Crypto + currency need no key.

### No Claude Code / prefer to do it by hand?
See **[FINANCE-STANDALONE-README.md](FINANCE-STANDALONE-README.md)** for the manual
GitHub-upload and local-file methods.
