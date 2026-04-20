# Beta page — one-time setup (≈ 5 minutes)

The page at `betatest.html` can already do two things out of the box:

1. Click **"Opt in on Play Store"** → sends users straight to your closed test.
2. Submit the email form → **currently broken** until you wire the backend.

Below are the one-time steps to make option 2 work. You only do this
once. After that, submissions land in a Google Sheet you own + email
you for each new signup.

## 1. Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) (creates a blank sheet in
   your Google Drive).
2. Rename it to something like **"SoloCook — Beta Testers"**. Title
   doesn't matter functionally; pick whatever.
3. Leave it blank. The script creates the header row on first
   submission.

## 2. Paste in the Apps Script

1. From that Sheet: **Extensions → Apps Script**.
2. Delete the default `function myFunction() { ... }` stub.
3. Open `beta-tester-script.gs` (sitting next to this file), copy its
   entire contents, paste into the Apps Script editor.
4. Top of the file, line 13 — the `NOTIFY_EMAIL` constant is already
   set to `google.pronounce276@passmail.com`. Change if you want
   signups to go to a different inbox, or set to `""` to disable the
   email notification (the sheet still gets the row).
5. Click **💾 Save** (or ⌘S). Give the project a name when prompted
   (e.g. "SoloCook Beta Handler").

## 3. Deploy as a Web App

1. In Apps Script, top-right: **Deploy → New deployment**.
2. Click the ⚙ cog next to "Select type" → **Web app**.
3. Fill in:
   - **Description:** `SoloCook beta signups`
   - **Execute as:** **Me** (your Gmail)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. First time: it'll ask to authorise the script. Click **Authorize
   access** → pick your Google account → you'll see a "Google hasn't
   verified this app" warning (this is normal for personal scripts)
   → **Advanced → Go to [project name] (unsafe)** → **Allow**.
   You're authorising *your own script* to edit *your own sheet* —
   Google just displays this warning because it's not a published
   Marketplace app.
6. You'll get a **Web app URL** that looks like:

   ```
   https://script.google.com/macros/s/AKfycbx…very-long-id…/exec
   ```

   **Copy this URL**.

## 4. Plug the URL into betatest.html

1. Open `betatest.html` in your editor.
2. Find the line:

   ```html
   action="https://script.google.com/macros/s/__REPLACE_ME__/exec"
   ```

   (around line 184 — search for `__REPLACE_ME__`).

3. Replace that whole URL with the one you copied in step 3.6.
4. Save.

## 5. Commit + push

```bash
cd ~/Desktop/solocook-pages
git add betatest.html
git commit -m "Wire beta form to Apps Script endpoint"
git push
```

GitHub Pages rebuilds in ~30 seconds.

## 6. Test it

1. Visit **https://nishjaiswal.github.io/solocook-pages/betatest.html**
2. Fill in your own email as a test
3. Click **Add me to the list**
4. You should see a success message inline
5. Open the Google Sheet → a new row should appear
6. Check your email inbox → a notification should arrive (subject
   line: `SoloCook beta signup: your@email`)

If all three happen, you're done forever.

## Updating the script later

If you want to change the notification email, add fields, or stop
notifications, edit `beta-tester-script.gs`, re-copy into Apps
Script, save, then **Deploy → Manage deployments → ✏ Edit → Version:
New version → Deploy**. The public URL stays the same — you don't
need to touch `betatest.html` again.

## If something doesn't work

**"Google hasn't verified this app" blocks me from deploying.**
Click **Advanced → Go to (unsafe)**. Your script is safe; the warning
is standard for any Apps Script deployed for personal use.

**Submissions don't appear in the sheet.**
Open Apps Script → **Executions** panel (left sidebar, clock icon).
You'll see the failed runs with error messages. Common causes:
- You edited the script after deploying, but didn't re-deploy. Go to
  **Deploy → Manage deployments → New version**.
- The sheet was deleted / unlinked. Open Apps Script from the sheet,
  not from script.google.com directly, so the binding is intact.

**I'm seeing CORS errors in the browser console.**
The form uses `mode: 'no-cors'` which avoids CORS preflight entirely.
If you see errors anyway, it's likely a typo in the URL. Double-check
the action attribute in `betatest.html`.

## Privacy note

The data collected (email, name, platform, optional note) is stored
in **your** Google Sheet. Google's own privacy policy governs the
sheet. The script runs under your Google account, so Google sees the
invocations as your activity.

If you want to reference the SoloCook privacy policy, note that it
applies to the **app**, not this recruitment page. You might add a
line to the beta page like *"By submitting, you agree to be contacted
about beta testing. See privacy policy for details on what the app
itself does."* — but for a small closed beta, that's optional.
