# How to Add Your Live Figma Make URL to README

Follow these simple steps to add your live app link to the README.md file:

---

## Step 1: Find Your Figma Make URL

### Option A: Look in Your Browser Address Bar
1. Open your Figma Make project (where you're currently working)
2. Look at the URL in your browser's address bar
3. It will look something like one of these:
   ```
   https://figma.com/make/preview/[your-project-id]
   https://[your-project-id].figma-make.dev
   https://make.figma.com/[your-project-id]/preview
   ```
4. **Copy the entire URL**

### Option B: Look for Share/Preview Button
1. In Figma Make, look for a "Share" or "Preview" button
2. Click it to get your shareable URL
3. Copy the URL provided

---

## Step 2: Edit README.md in GitHub

### Method 1: Edit Directly on GitHub (Easiest)

1. Go to your GitHub repository
2. Click on `README.md` file
3. Click the **pencil icon** (✏️) that says "Edit this file"
4. Find this section near the top:
   ```markdown
   ## 🚀 Live Demo

   **[🔗 View Live Application](YOUR-FIGMA-MAKE-URL-HERE)**
   ```
5. **Replace** `YOUR-FIGMA-MAKE-URL-HERE` with your actual URL
6. For example, change:
   ```markdown
   **[🔗 View Live Application](YOUR-FIGMA-MAKE-URL-HERE)**
   ```
   To:
   ```markdown
   **[🔗 View Live Application](https://abc123.figma-make.dev)**
   ```
7. Scroll down and click **"Commit changes"**
8. Add a commit message like "Add live demo URL"
9. Click **"Commit changes"** again

### Method 2: Edit Locally (If You Cloned the Repo)

1. Open `README.md` in any text editor
2. Find line 7 that says:
   ```markdown
   **[🔗 View Live Application](YOUR-FIGMA-MAKE-URL-HERE)**
   ```
3. Replace `YOUR-FIGMA-MAKE-URL-HERE` with your URL
4. Save the file
5. Git commands:
   ```bash
   git add README.md
   git commit -m "Add live demo URL"
   git push origin main
   ```

---

## Step 3: Verify It Works

1. Go to your GitHub repository
2. Look at the README.md (it shows automatically on the main page)
3. You should see a blue clickable link that says "🔗 View Live Application"
4. Click it to verify it opens your working app

---

## Example: Before and After

### ❌ Before (Placeholder)
```markdown
**[🔗 View Live Application](YOUR-FIGMA-MAKE-URL-HERE)**
```

### ✅ After (With Your URL)
```markdown
**[🔗 View Live Application](https://abc123def456.figma-make.dev)**
```

---

## Troubleshooting

### Can't Find Your Figma Make URL?
- Check the browser address bar when viewing your app
- Look for buttons like "Share", "Preview", or "Deploy"
- Check your Figma Make project settings

### Link Doesn't Work?
- Make sure you copied the full URL including `https://`
- Test the URL in a new browser tab first
- Ensure your Figma Make project is published/deployed

### Still Need Help?
The URL format is usually one of these:
- `https://[project-id].figma-make.dev`
- `https://figma.com/make/preview/[project-id]`
- `https://make.figma.com/[project-id]`

Look for something similar in your Figma Make interface!

---

## Additional Tips

### Want to Add a Screenshot?
Add this below the Live Demo section:

```markdown
## 📸 Screenshots

![Landing Page](screenshots/landing.png)
![Admin Dashboard](screenshots/admin.png)
![Booking Form](screenshots/booking.png)
```

Then create a `screenshots` folder in your repo with images.

### Want to Add a Badge?
Add this at the very top of README.md:

```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](YOUR-URL-HERE)
[![Built with Figma Make](https://img.shields.io/badge/built%20with-Figma%20Make-blueviolet)](https://figma.com/make)
```

---

## Quick Reference

**Current placeholder text to replace:**
```
YOUR-FIGMA-MAKE-URL-HERE
```

**Location in README.md:**
- Line 7 (approximately)
- Under "## 🚀 Live Demo" heading

**What to paste:**
Your complete Figma Make URL starting with `https://`

---

That's it! Your live app link will now be visible to everyone who visits your GitHub repository. 🎉
