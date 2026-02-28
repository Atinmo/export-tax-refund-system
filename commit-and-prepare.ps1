# Git提交脚本 - 用于PowerShell
# 执行这个脚本来完成Git提交和推送

Write-Host "🚀 开始Git提交和推送流程..." -ForegroundColor Green

# 设置用户信息
Write-Host "设置Git用户信息..." -ForegroundColor Yellow
git config user.name "TaxRefundSystem"
git config user.email "tax-refund-system@example.com"

# 添加所有文件
Write-Host "添加所有文件到暂存区..." -ForegroundColor Yellow
git add .

# 提交更改
Write-Host "提交更改..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Export Tax Refund Document Review System"
git commit -m $commitMessage

# 检查提交是否成功
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 提交成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 提交失败，请检查错误信息" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Git提交完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Cyan
Write-Host "1. 在GitHub上创建仓库：export-tax-refund-system" -ForegroundColor White
Write-Host "2. 使用以下命令添加远程仓库并推送：" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/你的用户名/export-tax-refund-system.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 详细说明请参考 DEPLOYMENT_GUIDE.md 文件" -ForegroundColor Cyan