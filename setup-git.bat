# 手动Git操作步骤（在PowerShell中执行）

# 1. 设置Git用户信息（如果需要）
git config user.name "YourGitHubUsername"
git config user.email "your.email@example.com"

# 2. 添加所有文件到暂存区
git add .

# 3. 提交更改
git commit -m "Initial commit: Export Tax Refund Document Review System"

# 4. 添加远程仓库（替换为你的GitHub仓库地址）
# 注意：先在你的GitHub上创建名为 export-tax-refund-system 的仓库
git remote add origin https://github.com/YOUR_USERNAME/export-tax-refund-system.git

# 5. 推送到GitHub
git push -u origin main

# 如果main分支不存在，使用master分支
git push -u origin master

# 6. 启用GitHub Pages（需要在GitHub网站上操作）
# 访问：https://github.com/YOUR_USERNAME/export-tax-refund-system/settings/pages
# 选择 "Deploy from a branch"
# 选择 "main" 分支和 "/ (root)" 目录

# 7. 访问部署后的网站
# https://YOUR_USERNAME.github.io/export-tax-refund-system

echo "Git操作完成！请按照步骤6在GitHub网站上启用GitHub Pages。"