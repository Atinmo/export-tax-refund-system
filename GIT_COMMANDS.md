# 手动Git操作指南（适用于Windows PowerShell）

## 初始化Git仓库

# 设置用户信息
git config user.name "YourName"
git config user.email "your.email@example.com"

# 初始化仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Export Tax Refund Document Review System"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/export-tax-refund-system.git

# 推送到GitHub
git push -u origin main

## GitHub Pages部署步骤

1. 访问你的GitHub仓库
2. 点击 Settings → Pages
3. 选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 目录
5. 点击 Save

## 访问地址

https://YOUR_USERNAME.github.io/export-tax-refund-system

## 项目特点

- ✅ 现代化React应用
- ✅ 智能PDF解析
- ✅ 税局合规审核
- ✅ 自动生成报告
- ✅ 响应式设计