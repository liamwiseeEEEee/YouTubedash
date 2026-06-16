# 💸 Finance Dashboard — Standalone Upgrade

A drop-in replacement for the finance page in your dashboard. It's **one single HTML file** —
no server, no Supabase, no env vars. All the AI features (receipt scanner, screenshot import,
the **Echo** money coach) run straight from your browser using **your own** API key.

> **What you get:** net worth tracker · live crypto + stock prices · subscriptions · orders ·
> wishlist · an AI coach. Everything starts empty and saves to *your* browser.

---

## ⚡ TL;DR

1. Download the new `finance.html`.
2. **Replace** the old `finance.html` in your dashboard with it (same name → all your links keep working).
3. Open the page → click **🔑 keys** (top right) → paste your **Anthropic** key.
4. Done. Add an account, or import a statement screenshot.

---

## 1. Install — replace `finance.html`

Pick whichever matches how you run your dashboard.

### Option A — On GitHub (if you deployed to Vercel)
1. Open your dashboard repo on **github.com**.
2. Click the old **`finance.html`** → the **pencil ✏️ (Edit)** → select all → delete.
3. Open the new `finance.html`, copy **all** of it, paste it in, **Commit changes**.
   *(Or: delete the old file and use **Add file → Upload files** to drop the new one in — just keep the name `finance.html`.)*
4. Vercel redeploys in ~30 seconds. Refresh your site.

### Option B — On your computer
1. Put the new file in your dashboard folder, named exactly **`finance.html`**, replacing the old one.
2. If you use git: `git add finance.html && git commit -m "Standalone finance dashboard" && git push`.
3. No git? Just double-click `finance.html` — it works fully offline as a local file too.

> ✅ Keep the filename **`finance.html`**. Your homepage tile and the top-bar 📊 button already
> point at it, so you don't need to touch any other file.

---

## 2. First run — turn on the AI features

Everything works without a key **except** the AI parts. To switch those on:

| Key | Powers | Required? | Get it free at |
|---|---|---|---|
| **Anthropic** | Echo coach + screenshot/receipt import | Needed for AI | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| **Finnhub** | Live stock prices | Optional | [finnhub.io/register](https://finnhub.io/register) |

1. Open the finance page.
2. Top right → **🔑 keys**.
3. Paste your key(s) → **Save keys**.

Crypto prices (CoinGecko) and currency conversion need **no key**.

> 🔒 **Privacy:** your keys are stored only in your own browser (localStorage) and sent
> directly to the provider — never to anyone else. Anyone with access to your device/browser
> can read them, so use a key with spending limits you're comfortable with.

---

## 3. Good to know

- **Starts at zero.** No demo data — net worth, subs, orders and wishlist all begin empty.
- **Saves locally.** Your data lives in *this browser* only. It does **not** sync across devices,
  and it is **not** stored on any server (unlike the rest of the dashboard's Supabase sync).
- **Switch currency** (CHF / USD / EUR / GBP) anytime in the top right — everything reconverts at live rates.
- **Import from a screenshot:** on the Net Worth tab hit *Import from screenshot* and drop a
  photo of a bank statement, portfolio, or subscriptions page — it reads the balances for you.

---

## 4. Optional: make the "← Vitality" button go home

By default the back arrow at the top doesn't link anywhere. To make it return to your dashboard
home, find this line in `finance.html`:

```html
<a class="back" href="#" data-act="noop"><span class="backArrow">←</span> Vitality</a>
```

and change it to:

```html
<a class="back" href="index.html"><span class="backArrow">←</span> Vitality</a>
```

---

## 5. Lazy way — let an AI do the swap

If you use Claude Code / Cursor in your dashboard folder, paste this:

> Replace `finance.html` in this project with the standalone finance dashboard file I'm giving you.
> Keep the filename exactly `finance.html` so the homepage tile and top-bar button keep linking to it.
> Don't change any other files. After replacing, confirm the homepage and top bar still point to `finance.html`.

---

*That's it — replace the file, paste your key, and you're running the new finance dashboard.* 🎉
