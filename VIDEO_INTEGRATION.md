# Video Integration Instructions

## Your Video File
- **Location**: `c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4`
- **Status**: Ready to add to submission

## Option 1: Use Git LFS (Recommended for Large Videos)

Git LFS (Large File Storage) allows you to store large video files in GitHub:

```powershell
# Install Git LFS (first time only)
# Download from: https://git-lfs.github.com/
# Or via package manager:
choco install git-lfs

# After installation, initialize LFS in your repo
cd C:\Users\jerri\payment-gateway
git lfs install

# Track .mp4 files with LFS
git lfs track "*.mp4"

# This creates .gitattributes file
git add .gitattributes
git commit -m "Configure Git LFS for video files"

# Copy video to project
mkdir videos
copy "c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4" "videos\payment-gateway-demo.mp4"

# Add and commit video
git add videos/
git commit -m "Add: Payment gateway demo video"
git push
```

## Option 2: Upload to YouTube (Easier)

```powershell
# 1. Go to https://www.youtube.com/upload
# 2. Upload the video as "Unlisted"
# 3. Copy the YouTube URL
# 4. Update README with the link (see below)
# 5. Don't need to store in git
```

## Option 3: Store in Google Drive

```powershell
# 1. Upload to Google Drive
# 2. Get shareable link
# 3. Update README with the link
# 4. Don't need to store in git
```

---

## Recommended: Option 2 (YouTube Unlisted)

YouTube is easiest and most reliable:

1. Visit https://www.youtube.com/upload
2. Click "Select files to upload"
3. Choose `Recording 2026-01-04 164218.mp4`
4. Add title: "Payment Gateway Demo"
5. Add description: "Complete demonstration of payment gateway with multi-method processing"
6. Set visibility to **Unlisted** (not Public, not Private)
7. Upload and wait for processing (5-10 minutes)
8. Copy the URL from the address bar
9. Update README.md with the link

---

## Quick Video File Options

If your video is **under 100MB**: You can store directly in git
If your video is **over 100MB**: Use YouTube or Google Drive instead

Check file size:
```powershell
(Get-Item "c:\Users\jerri\Videos\Recording 2026-01-04 164218.mp4").Length / 1MB
```

---

