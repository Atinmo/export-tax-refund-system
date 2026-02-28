# GitHub Pages 部署指南

## 🚀 快速部署步骤

### 1. 创建GitHub仓库
1. 访问 https://github.com/new
2. 创建新仓库：`export-tax-refund-system`
3. 设置为公开仓库
4. 不要初始化README（我们已经有）

### 2. 推送代码到GitHub
```bash
# 添加远程仓库地址（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/export-tax-refund-system.git

# 推送代码到main分支
git push -u origin main
```

### 3. 启用GitHub Pages
1. 进入你的GitHub仓库页面
2. 点击 Settings → Pages
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main" 和 "/ (root)"
5. 点击 Save

### 4. 自动部署
推送代码后，GitHub Actions会自动构建和部署你的网站。

访问地址：`https://你的用户名.github.io/export-tax-refund-system`

## 📋 项目信息

- **项目名称**: 出口退税单证备案审核系统
- **描述**: 智能化审核出口退税单证，一键生成备查文件
- **技术栈**: React + Vite
- **许可证**: MIT

## 🔧 功能特点

✅ PDF文件上传和解析  
✅ 智能内容审核  
✅ 自动生成备查报告  
✅ 响应式设计  
✅ 符合税局要求  

## 📞 支持

如有问题，请在GitHub Issues中提交反馈。

---

**部署状态**: 🟢 准备就绪