import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建PDF文档
const doc = new PDFDocument({ 
  margin: 50,
  size: 'A4',
  info: {
    Title: '出口退税单证备案资料',
    Author: '国家税务总局',
    Subject: '出口退税单证备案',
    Keywords: '出口退税, 单证备案, 税务',
    CreationDate: new Date()
  }
});

// 设置输出路径
const outputPath = path.join(__dirname, '出口退税单证备案资料-测试文件.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// 添加页眉函数
function addHeader() {
  doc.fontSize(10).fillColor('#666')
     .text('出口退税单证备案资料', 50, 30, { align: 'left' })
     .text('备案编号: BA20250228001', 400, 30, { align: 'right' })
     .moveDown();
}

// 添加页脚函数
function addFooter() {
  const pageHeight = doc.page.height;
  doc.fontSize(8).fillColor('#999')
     .text('第 ' + doc.page.number + ' 页', 0, pageHeight - 50, { align: 'center' });
}

// 第一页 - 封面
addHeader();
doc.fontSize(24).fillColor('#2c3e50')
   .text('出口退税单证备案资料', { align: 'center', bold: true })
   .moveDown(2);

doc.fontSize(16).fillColor('#34495e')
   .text('企业名称：上海国际贸易有限公司', { align: 'center' })
   .moveDown(0.5);

doc.fontSize(16).fillColor('#34495e')
   .text('统一社会信用代码：91310000123456789X', { align: 'center' })
   .moveDown(0.5);

doc.fontSize(16).fillColor('#34495e')
   .text('备案日期：2025年02月28日', { align: 'center' })
   .moveDown(3);

doc.fontSize(14).fillColor('#7f8c8d')
   .text('本资料包含以下单证：', { align: 'center' })
   .moveDown(1);

doc.fontSize(12).fillColor('#34495e')
   .text('✓ 出口合同', { align: 'center' })
   .text('✓ 商业发票', { align: 'center' })
   .text('✓ 装箱单', { align: 'center' })
   .text('✓ 运输单据', { align: 'center' })
   .text('✓ 报关单', { align: 'center' })
   .text('✓ 收汇凭证', { align: 'center' })
   .moveDown(2);

doc.fontSize(10).fillColor('#95a5a6')
   .text('注：本资料严格按照国家税务总局出口退税单证备案要求整理', { align: 'center' });

addFooter();
doc.addPage();

// 第二页 - 出口合同
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('一、出口合同', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('合同编号：EX20250228001')
   .moveDown(0.5);

doc.text('签订日期：2025年02月28日')
   .moveDown(0.5);

doc.text('出口商：上海国际贸易有限公司')
   .text('地址：上海市浦东新区陆家嘴金融中心100号')
   .text('电话：021-68888888')
   .text('传真：021-68888889')
   .text('邮箱：export@shanghai-trade.com')
   .moveDown(1);

doc.text('进口商：ABC Trading Co., Ltd.')
   .text('地址：美国加利福尼亚州洛杉矶市商业区200号')
   .text('电话：+1-213-555-0123')
   .text('传真：+1-213-555-0124')
   .text('邮箱：purchase@abctrading.com')
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('货物描述：', { bold: true })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('产品名称：电子产品（智能手机配件）')
   .text('规格型号：SP-2025-A1')
   .text('数量：1,000件')
   .text('单价：USD 100.00')
   .text('总金额：USD 100,000.00')
   .text('包装：50箱，每箱20件')
   .text('交货方式：FOB上海')
   .text('付款方式：信用证（L/C）')
   .text('交货期限：2025年03月15日前')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本合同为正式出口合同，包含完整的贸易条款和双方权利义务。');

addFooter();
doc.addPage();

// 第三页 - 商业发票
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('二、商业发票', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('发票编号：INV20250228001')
   .text('发票日期：2025年02月28日')
   .text('合同编号：EX20250228001')
   .moveDown(1);

doc.text('出口商：上海国际贸易有限公司')
   .text('地址：上海市浦东新区陆家嘴金融中心100号')
   .text('电话：021-68888888')
   .moveDown(1);

doc.text('进口商：ABC Trading Co., Ltd.')
   .text('地址：美国加利福尼亚州洛杉矶市商业区200号')
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('货物明细：', { bold: true })
   .moveDown(0.5);

// 创建表格
doc.fontSize(10);
const tableTop = doc.y;
const headers = ['序号', '产品名称', '规格型号', '数量', '单价(USD)', '金额(USD)'];
const columnWidths = [40, 200, 100, 50, 70, 80];
const startX = 50;

// 绘制表头
headers.forEach((header, i) => {
  doc.rect(startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, columnWidths[i], 25)
     .fill('#f8f9fa').stroke();
  doc.fillColor('#2c3e50').text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, tableTop + 7);
});

// 绘制数据行
const data = [
  ['1', '智能手机配件', 'SP-2025-A1', '1,000', '100.00', '100,000.00']
];

data.forEach((row, rowIndex) => {
  const rowTop = tableTop + 25 + (rowIndex * 25);
  row.forEach((cell, cellIndex) => {
    doc.rect(startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0), rowTop, columnWidths[cellIndex], 25)
       .fill('#ffffff').stroke();
    doc.fillColor('#34495e').text(cell, startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0) + 5, rowTop + 7);
  });
});

doc.y = tableTop + 75;

doc.fontSize(12).fillColor('#34495e')
   .moveDown(1)
   .text('合计：USD 100,000.00（美元壹拾万元整）')
   .moveDown(0.5)
   .text('贸易条款：FOB上海')
   .text('付款方式：即期信用证')
   .text('装运港：上海港')
   .text('目的港：洛杉矶港')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本发票为正式商业发票，用于出口退税申报。');

addFooter();
doc.addPage();

// 第四页 - 装箱单
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('三、装箱单', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('装箱单编号：PL20250228001')
   .text('日期：2025年02月28日')
   .text('发票编号：INV20250228001')
   .text('合同编号：EX20250228001')
   .moveDown(1);

doc.text('发货人：上海国际贸易有限公司')
   .text('地址：上海市浦东新区陆家嘴金融中心100号')
   .text('电话：021-68888888')
   .moveDown(1);

doc.text('收货人：ABC Trading Co., Ltd.')
   .text('地址：美国加利福尼亚州洛杉矶市商业区200号')
   .text('电话：+1-213-555-0123')
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('包装明细：', { bold: true })
   .moveDown(0.5);

// 装箱单表格
doc.fontSize(10);
const packingTableTop = doc.y;
const packingHeaders = ['箱号', '产品名称', '数量', '毛重(kg)', '净重(kg)', '尺寸(cm)'];
const packingColumnWidths = [40, 200, 60, 70, 70, 80];

// 绘制装箱单表头
packingHeaders.forEach((header, i) => {
  doc.rect(startX + packingColumnWidths.slice(0, i).reduce((a, b) => a + b, 0), packingTableTop, packingColumnWidths[i], 25)
     .fill('#f8f9fa').stroke();
  doc.fillColor('#2c3e50').text(header, startX + packingColumnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, packingTableTop + 7);
});

// 装箱单数据
const packingData = [
  ['1-10', '智能手机配件', '200件', '100', '90', '60×40×30'],
  ['11-20', '智能手机配件', '200件', '100', '90', '60×40×30'],
  ['21-30', '智能手机配件', '200件', '100', '90', '60×40×30'],
  ['31-40', '智能手机配件', '200件', '100', '90', '60×40×30'],
  ['41-50', '智能手机配件', '200件', '100', '90', '60×40×30']
];

packingData.forEach((row, rowIndex) => {
  const rowTop = packingTableTop + 25 + (rowIndex * 25);
  row.forEach((cell, cellIndex) => {
    doc.rect(startX + packingColumnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0), rowTop, packingColumnWidths[cellIndex], 25)
       .fill('#ffffff').stroke();
    doc.fillColor('#34495e').text(cell, startX + packingColumnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0) + 5, rowTop + 7);
  });
});

doc.y = packingTableTop + 150;

doc.fontSize(12).fillColor('#34495e')
   .moveDown(1)
   .text('总件数：1,000件')
   .text('总箱数：50箱')
   .text('总毛重：5,000kg')
   .text('总净重：4,500kg')
   .text('总体积：21.6立方米')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本装箱单详细记录了货物的包装情况，符合国际贸易要求。');

addFooter();
doc.addPage();

// 第五页 - 运输单据（提单）
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('四、运输单据（提单）', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('提单编号：BOL20250228001')
   .text('承运人：中国远洋运输集团（COSCO）')
   .text('船舶名称：COSCO SHIPPING UNIVERSE')
   .text('航次：V.2025E')
   .moveDown(1);

doc.text('托运人：上海国际贸易有限公司')
   .text('地址：上海市浦东新区陆家嘴金融中心100号')
   .text('电话：021-68888888')
   .moveDown(1);

doc.text('收货人：ABC Trading Co., Ltd.')
   .text('地址：美国加利福尼亚州洛杉矶市商业区200号')
   .text('通知方：同上')
   .moveDown(1);

doc.fontSize(14).fillColor('#2c3e50')
   .text('运输信息：', { bold: true })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('装货港：上海港，中国')
   .text('卸货港：洛杉矶港，美国')
   .text('装船日期：2025年03月05日')
   .text('预计到达日期：2025年03月20日')
   .text('运输方式：海运集装箱')
   .text('集装箱数量：2×40尺高柜')
   .text('集装箱号：CCLU1234567, CCLU1234568')
   .text('封志号：SEAL123456, SEAL123457')
   .moveDown(1);

doc.fontSize(14).fillColor('#2c3e50')
   .text('货物描述：', { bold: true })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('货物名称：智能手机配件')
   .text('总件数：1,000件')
   .text('总毛重：5,000kg')
   .text('总净重：4,500kg')
   .text('总体积：21.6立方米')
   .text('包装：50纸箱')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本提单为海运提单，是货物所有权凭证和运输合同证明。');

addFooter();
doc.addPage();

// 第六页 - 报关单
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('五、出口货物报关单', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('报关单编号：CUS20250228001')
   .text('申报日期：2025年02月28日')
   .text('出口日期：2025年03月05日')
   .text('申报单位：上海国际贸易有限公司')
   .text('海关编号：2201')
   .moveDown(1);

doc.text('出口口岸：上海海关')
   .text('经营单位：上海国际贸易有限公司')
   .text('运输方式：海运')
   .text('运输工具名称：COSCO SHIPPING UNIVERSE/V.2025E')
   .text('提运单号：BOL20250228001')
   .text('贸易方式：一般贸易')
   .text('征免性质：一般征税')
   .text('结汇方式：信用证')
   .text('运抵国（地区）：美国')
   .text('指运港：洛杉矶')
   .moveDown(1);

doc.fontSize(14).fillColor('#2c3e50')
   .text('商品明细：', { bold: true })
   .moveDown(0.5);

// 报关单商品表格
doc.fontSize(10);
const customsTableTop = doc.y;
const customsHeaders = ['项号', '商品编号', '商品名称', '数量', '单价', '总价', '币制'];
const customsColumnWidths = [35, 80, 180, 60, 60, 80, 50];

// 绘制报关单表头
customsHeaders.forEach((header, i) => {
  doc.rect(startX + customsColumnWidths.slice(0, i).reduce((a, b) => a + b, 0), customsTableTop, customsColumnWidths[i], 25)
     .fill('#f8f9fa').stroke();
  doc.fillColor('#2c3e50').text(header, startX + customsColumnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 3, customsTableTop + 7);
});

// 报关单数据
const customsData = [
  ['1', '8517.12.00', '智能手机配件', '1,000件', '100.00', '100,000.00', 'USD']
];

customsData.forEach((row, rowIndex) => {
  const rowTop = customsTableTop + 25 + (rowIndex * 25);
  row.forEach((cell, cellIndex) => {
    doc.rect(startX + customsColumnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0), rowTop, customsColumnWidths[cellIndex], 25)
       .fill('#ffffff').stroke();
    doc.fillColor('#34495e').text(cell, startX + customsColumnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0) + 3, rowTop + 7);
  });
});

doc.y = customsTableTop + 50;

doc.fontSize(12).fillColor('#34495e')
   .moveDown(1)
   .text('成交方式：FOB')
   .text('运费：USD 0.00')
   .text('保费：USD 0.00')
   .text('杂费：USD 0.00')
   .text('合同协议号：EX20250228001')
   .text('集装箱号：CCLU1234567*2（2）')
   .text('随附单证：发票、装箱单、合同')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本报关单为正式出口报关单，已在上海海关完成申报手续。');

addFooter();
doc.addPage();

// 第七页 - 收汇凭证
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('六、收汇凭证', { underline: true })
   .moveDown(1.5);

doc.fontSize(12).fillColor('#34495e')
   .text('水单编号：REMIT20250315001')
   .text('收汇日期：2025年03月15日')
   .text('发票编号：INV20250228001')
   .text('合同编号：EX20250228001')
   .moveDown(1);

doc.text('收款人：上海国际贸易有限公司')
   .text('收款银行：中国银行上海分行')
   .text('收款账号：4567-8901-2345-6789')
   .text('SWIFT代码：BKCHCNBJ300')
   .moveDown(1);

doc.text('付款人：ABC Trading Co., Ltd.')
   .text('付款银行：Bank of America, Los Angeles Branch')
   .text('付款账号：9876-5432-1098-7654')
   .text('SWIFT代码：BOFAUS6S')
   .moveDown(1);

doc.fontSize(14).fillColor('#2c3e50')
   .text('收汇明细：', { bold: true })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('收汇金额：USD 100,000.00')
   .text('汇率：1 USD = 7.2000 CNY')
   .text('折合人民币：CNY 720,000.00')
   .text('手续费：USD 50.00')
   .text('实际到账金额：USD 99,950.00')
   .text('到账时间：2025年03月15日 14:30:25')
   .text('交易参考号：REF20250315001')
   .text('业务编号：BUS20250315001')
   .moveDown(1);

doc.fontSize(14).fillColor('#2c3e50')
   .text('交易附言：', { bold: true })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('PAYMENT FOR SMARTPHONE ACCESSORIES SP-2025-A1')
   .text('CONTRACT NO: EX20250228001')
   .text('INVOICE NO: INV20250228001')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本收汇凭证为银行正式水单，证明出口货款已全额收妥。');

addFooter();
doc.addPage();

// 第八页 - 总结页
addHeader();
doc.fontSize(20).fillColor('#2c3e50')
   .text('七、备案资料总结', { underline: true })
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('✅ 已备案单证清单：', { bold: true })
   .moveDown(0.8);

doc.fontSize(12).fillColor('#27ae60')
   .text('☑ 出口合同（合同号：EX20250228001）')
   .text('☑ 商业发票（发票号：INV20250228001）')
   .text('☑ 装箱单（装箱单号：PL20250228001）')
   .text('☑ 运输单据（提单号：BOL20250228001）')
   .text('☑ 报关单（报关单号：CUS20250228001）')
   .text('☑ 收汇凭证（水单号：REMIT20250315001）')
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('📊 备案统计：', { bold: true })
   .moveDown(0.8);

doc.fontSize(12).fillColor('#34495e')
   .text('出口合同：1份')
   .text('商业发票：1份')
   .text('装箱单：1份')
   .text('运输单据：1份')
   .text('报关单：1份')
   .text('收汇凭证：1份')
   .text('总计：6份单证')
   .moveDown(1.5);

doc.fontSize(14).fillColor('#2c3e50')
   .text('📋 合规性声明：', { bold: true })
   .moveDown(0.8);

doc.fontSize(12).fillColor('#34495e')
   .text('本备案资料严格按照《国家税务总局关于进一步便利出口退税办理有关事项的公告》')
   .text('（国家税务总局公告2022年第9号）要求整理，所有单证真实、合法、有效。')
   .text('备案资料保存期限：自出口退（免）税申报期截止之日起不少于5年。')
   .moveDown(1);

doc.fontSize(12).fillColor('#7f8c8d')
   .text('本资料可作为出口退税备案单证使用，符合税务机关审核要求。');

// 添加备案章效果
doc.moveDown(2);
doc.fontSize(14).fillColor('#e74c3c')
   .text('（企业备案专用章）', { align: 'right' })
   .moveDown(0.5);

doc.fontSize(12).fillColor('#34495e')
   .text('备案日期：2025年02月28日', { align: 'right' })
   .text('备案人：张三（财务主管）', { align: 'right' })
   .text('联系电话：021-68888888', { align: 'right' });

addFooter();

// 结束文档
doc.end();

// 监听完成事件
writeStream.on('finish', () => {
  console.log(`✅ 测试PDF文件已生成: ${outputPath}`);
  console.log('📄 文件包含完整的出口退税单证备案资料');
  console.log('🔍 包含出口合同、商业发票、装箱单、运输单据、报关单、收汇凭证');
  console.log('✨ 可用于测试出口退税单证备案审核系统');
});

writeStream.on('error', (error) => {
  console.error('❌ 生成PDF文件时出错:', error);
});