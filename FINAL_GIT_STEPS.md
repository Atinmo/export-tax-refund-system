# 手动Git操作步骤 - 最终版

## 步骤1：检查当前状态
git status

## 步骤2：添加所有文件
git add .

## 步骤3：提交更改（使用简单消息）
git commit -m "Initial commit"

## 步骤4：创建远程仓库
# 访问 https://github.com/new
# 创建仓库：export-tax-refund-system
# 不要初始化README

## 步骤5：添加远程仓库并推送
git remote add origin https://github.com/Atinmo/export-tax-refund-system.git
git branch -M main
git push -u origin main

## 如果遇到问题，尝试使用HTTPS
git remote remove origin
git remote add origin https://github.com/Atinmo/export-tax-refund-system.git
git push -u origin main

## 步骤6：启用GitHub Pages
# 1. 访问仓库设置
# 2. 点击Pages
# 3. 选择main分支
# 4. 保存设置

## 步骤7：访问部署后的网站
# https://atinmo.github.io/export-tax-refund-system