# Quick Video Setup Script

## What to Do Now

### FASTEST WAY (YouTube - Recommended)

```powershell
# STEP 1: Upload to YouTube
# 1. Go to: https://www.youtube.com/upload
# 2. Select: c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4
# 3. Title: "Payment Gateway Demo - Multi-Method Processing"
# 4. Description: "Complete end-to-end demonstration of payment gateway implementation"
# 5. Visibility: UNLISTED (important!)
# 6. Upload
# 7. Wait 5-10 minutes for processing
# 8. Copy URL (it will look like: https://www.youtube.com/watch?v=XXXXX)

# STEP 2: Add link to README
# See instructions below

# STEP 3: Commit and push
cd C:\Users\jerri\payment-gateway
git add README.md
git commit -m "Add: Video demo link to YouTube"
git push
```

---

## UPDATE README.md

Open `README.md` and add this section after "## Getting Started":

```markdown
## Video Demo

Watch a complete 3-minute demonstration of the payment gateway:

🎬 **[Payment Gateway Demo Video](https://www.youtube.com/watch?v=REPLACE_WITH_YOUR_VIDEO_ID)**

**In this video:**
- System startup with Docker
- Merchant dashboard overview
- API order creation
- UPI payment flow with validation
- Card payment flow with Luhn algorithm
- Success and failure handling
- Database persistence verification
```

Replace `REPLACE_WITH_YOUR_VIDEO_ID` with your actual YouTube video ID.

---

## GIT COMMANDS

Once you have the YouTube link:

```powershell
cd C:\Users\jerri\payment-gateway

# Update README with video link
# (Edit the file and add the section above)

# Commit the change
git add README.md
git commit -m "Add: Video demo link"

# Push to GitHub
git push
```

---

## STATUS

After completing these steps:

✅ Video uploaded to YouTube
✅ README updated with link
✅ Changes pushed to GitHub
✅ Submission ready for evaluation

---

## Alternative: Store Video Locally (If Small)

If your video is less than 50MB, you can store it in the repo:

```powershell
cd C:\Users\jerri\payment-gateway

# Create videos folder
mkdir videos

# Copy video
copy "c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4" "videos\demo.mp4"

# Commit
git add videos/
git commit -m "Add: Payment gateway demo video"
git push
```

Then update README with:
```markdown
## Video Demo

📹 [Watch Demo Video](videos/demo.mp4) (3 minutes)
```

---

## Check Video Size First

```powershell
$file = "c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4"
$sizeInMB = (Get-Item $file).Length / 1MB
Write-Host "Video size: $([Math]::Round($sizeInMB, 2)) MB"

# If > 100MB: Use YouTube
# If < 100MB: Can store in repo or YouTube (your choice)
```

---

**RECOMMENDED ACTION:** Upload to YouTube (simplest and fastest)

Need help? See VIDEO_INTEGRATION.md for more options.
