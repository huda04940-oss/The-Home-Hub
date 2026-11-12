# 1. Initialize git (if not already done)
git init

# 2. Stage and commit all files
git add .
git commit -m "Initial commit - THE HOME HUB landing page"

# 3. Set branch to main and link your GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 4. Push to GitHub
git push -u origin main