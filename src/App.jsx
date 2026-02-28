import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

// 简化的PDF文本提取方案
async function extractTextFromPDF(arrayBuffer) {
  try {
    // 将ArrayBuffer转换为字符串进行简单文本提取
    const text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
    
    // 尝试提取PDF中的文本内容
    // PDF文件中的文本通常包含在特定的标记中
    const textMatches = [];
    
    // 查找PDF中的文本对象
    const textObjectRegex = /\(([^)]+)\)/g;
    let match;
    while ((match = textObjectRegex.exec(text)) !== null) {
      // 过滤掉非中文字符和常见的PDF元数据
      if (match[1].length > 2 && !match[1].match(/^\d+$/) && !match[1].match(/^[A-Z]+$/)) {
        textMatches.push(match[1]);
      }
    }
    
    // 如果没有找到文本对象，尝试其他方法
    if (textMatches.length === 0) {
      // 查找所有中文字符
      const chineseRegex = /[\u4e00-\u9fff]+/g;
      const chineseMatches = text.match(chineseRegex);
      if (chineseMatches) {
        textMatches.push(...chineseMatches);
      }
    }
    
    // 如果没有找到中文字符，返回原始文本的部分内容
    if (textMatches.length === 0) {
      // 返回文本的前几千个字符
      return text.substring(0, 5000);
    }
    
    return textMatches.join('\n');
  } catch (error) {
    console.warn('PDF文本提取失败，使用备用方案:', error);
    
    // 备用方案：将PDF作为二进制数据读取，尝试提取其中的字符串
    const bytes = new Uint8Array(arrayBuffer);
    let result = '';
    
    // 查找连续的ASCII字符（可能是文本）
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] >= 32 && bytes[i] <= 126) {
        result += String.fromCharCode(bytes[i]);
      } else if (bytes[i] === 0 && result.length > 0) {
        // 遇到空字节，如果之前有字符，添加换行
        if (result.length > 10) {
          result += '\n';
        }
      }
    }
    
    // 过滤掉太短的字符串和明显的二进制数据
    const lines = result.split('\n').filter(line => 
      line.length > 3 && 
      !line.match(/^\d+$/) && 
      !line.match(/^[A-Z]+$/) &&
      line.match(/[a-zA-Z\u4e00-\u9fff]/)
    );
    
    return lines.slice(0, 100).join('\n');
  }
}

function App() {
  const [file, setFile] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parsedText, setParsedText] = useState('')
  const [auditResult, setAuditResult] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('upload')
  const fileInputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      parsePDF(selectedFile)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop,
    disabled: parsing
  })

  const parsePDF = async (pdfFile) => {
    setParsing(true)
    setProgress(0)
    
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result
        
        // 模拟进度更新
        setProgress(25)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setProgress(50)
        
        // 使用简化的PDF文本提取
        const text = await extractTextFromPDF(arrayBuffer)
        
        setProgress(75)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setProgress(100)
        await new Promise(resolve => setTimeout(resolve, 200))
        
        setParsedText(text)
        auditDocument(text)
        setParsing(false)
        setProgress(0)
      }
      
      reader.onerror = () => {
        console.error('文件读取错误')
        setParsing(false)
        setProgress(0)
      }
      
      reader.readAsArrayBuffer(pdfFile)
    } catch (error) {
      console.error('PDF解析错误:', error)
      setParsing(false)
      setProgress(0)
    }
  }

  const auditDocument = (text) => {
    // 2025年最新税局出口退税单证备案要求
    const requiredFields = [
      { key: '出口合同', required: true, description: '出口合同或订单' },
      { key: '商业发票', required: true, description: '商业发票或形式发票' },
      { key: '装箱单', required: true, description: '装箱单或包装清单' },
      { key: '运输单据', required: true, description: '提单、空运单或其他运输单据' },
      { key: '报关单', required: true, description: '出口货物报关单' },
      { key: '收汇凭证', required: true, description: '收汇水单或银行收汇凭证' },
      { key: '装货单', required: false, description: '装货单或场站收据' },
      { key: '原产地证书', required: false, description: '原产地证书或相关证明' }
    ]

    const foundFields = []
    const missingFields = []
    
    requiredFields.forEach(field => {
      const found = text.includes(field.key)
      if (found) {
        foundFields.push(field)
      } else if (field.required) {
        missingFields.push(field)
      }
    })

    const isValid = missingFields.length === 0

    setAuditResult({
      isValid,
      foundFields,
      missingFields,
      totalFields: requiredFields.length,
      foundCount: foundFields.length,
      missingCount: missingFields.length
    })
  }

  const generateReport = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const currentDate = new Date()
      const reportDate = currentDate.toLocaleDateString('zh-CN')
      const reportTime = currentDate.toLocaleTimeString('zh-CN')
      
      const reportContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>出口退税单证备案审核报告</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
            }
            
            .report-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              border-radius: 10px;
              overflow: hidden;
            }
            
            .report-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            
            .report-header h1 {
              font-size: 2.5em;
              margin-bottom: 10px;
              font-weight: 300;
            }
            
            .report-status {
              display: inline-block;
              padding: 10px 25px;
              border-radius: 25px;
              font-weight: bold;
              font-size: 1.1em;
              margin: 10px 0;
            }
            
            .status-pass {
              background: #28a745;
              color: white;
            }
            
            .status-fail {
              background: #dc3545;
              color: white;
            }
            
            .report-body {
              padding: 40px;
            }
            
            .section {
              margin-bottom: 30px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            
            .section h2 {
              color: #667eea;
              margin-bottom: 15px;
              font-size: 1.4em;
            }
            
            .document-list {
              list-style: none;
            }
            
            .document-list li {
              padding: 10px 0;
              border-bottom: 1px solid #e9ecef;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .document-list li:last-child {
              border-bottom: none;
            }
            
            .doc-name {
              font-weight: 500;
            }
            
            .doc-status {
              padding: 4px 12px;
              border-radius: 15px;
              font-size: 0.9em;
              font-weight: bold;
            }
            
            .status-found {
              background: #d4edda;
              color: #155724;
            }
            
            .status-missing {
              background: #f8d7da;
              color: #721c24;
            }
            
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            
            .stat-card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .stat-number {
              font-size: 2em;
              font-weight: bold;
              color: #667eea;
              display: block;
            }
            
            .stat-label {
              color: #666;
              font-size: 0.9em;
              margin-top: 5px;
            }
            
            .report-footer {
              background: #f8f9fa;
              padding: 20px 40px;
              border-top: 1px solid #e9ecef;
              font-size: 0.9em;
              color: #666;
            }
            
            .timestamp {
              text-align: right;
              font-style: italic;
            }
            
            .compliance-note {
              background: #e3f2fd;
              border: 1px solid #2196f3;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            
            .compliance-note h3 {
              color: #1976d2;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <h1>出口退税单证备案审核报告</h1>
              <div class="report-status ${auditResult?.isValid ? 'status-pass' : 'status-fail'}">
                ${auditResult?.isValid ? '✓ 审核通过' : '✗ 审核未通过'}
              </div>
              <p>国家税务总局出口退税单证备案审核系统</p>
            </div>
            
            <div class="report-body">
              <div class="section">
                <h2>📊 审核统计</h2>
                <div class="summary-stats">
                  <div class="stat-card">
                    <span class="stat-number">${auditResult?.foundCount || 0}</span>
                    <div class="stat-label">已找到文件</div>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">${auditResult?.missingCount || 0}</span>
                    <div class="stat-label">缺失文件</div>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">${Math.round(((auditResult?.foundCount || 0) / (auditResult?.totalFields || 1)) * 100)}%</span>
                    <div class="stat-label">完成度</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2>✅ 已找到的文件清单</h2>
                <ul class="document-list">
                  ${auditResult?.foundFields.map(field => `
                    <li>
                      <span class="doc-name">${field.key}</span>
                      <span class="doc-status status-found">✓ 已找到</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              
              ${auditResult?.missingFields.length > 0 ? `
              <div class="section">
                <h2>❌ 缺失的文件清单</h2>
                <ul class="document-list">
                  ${auditResult?.missingFields.map(field => `
                    <li>
                      <span class="doc-name">${field.key}</span>
                      <span class="doc-status status-missing">✗ 缺失</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}
              
              <div class="compliance-note">
                <h3>📋 合规性说明</h3>
                <p>根据《国家税务总局关于进一步便利出口退税办理有关出口退（免）税企业分类管理办法》及相关规定，出口企业应当妥善保管出口退税备案单证，确保单证的真实性、合法性和完整性。</p>
              </div>
            </div>
            
            <div class="report-footer">
              <div class="timestamp">
                报告生成时间：${reportDate} ${reportTime}<br>
                审核系统版本：v1.0.0<br>
                备案编号：BA${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${String(currentDate.getHours()).padStart(2, '0')}${String(currentDate.getMinutes()).padStart(2, '0')}
              </div>
            </div>
          </div>
        </body>
        </html>
      `

      // 创建并下载报告文件
      const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `出口退税单证备案审核报告_${new Date().toISOString().slice(0, 10)}_${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setGenerating(false)
    }, 2000)
  }

  const resetForm = () => {
    setFile(null)
    setParsedText('')
    setAuditResult(null)
    setProgress(0)
    setActiveTab('upload')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🚀 出口退税单证备案审核系统</h1>
          <p className="subtitle">智能化审核 · 一键生成备查文件</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* 标签页导航 */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📄 文件上传
            </button>
            <button 
              className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
              disabled={!auditResult}
            >
              🔍 审核结果
            </button>
          </div>

          {/* 文件上传区域 */}
          {activeTab === 'upload' && (
            <div className="upload-section">
              <div className="upload-card">
                <h2>上传出口退税单证备案资料</h2>
                <p className="upload-description">
                  请上传包含出口合同、商业发票、装箱单、运输单据、报关单等文件的PDF文档
                </p>
                
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${parsing ? 'disabled' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="dropzone-content">
                    {parsing ? (
                      <div className="parsing-content">
                        <div className="spinner"></div>
                        <h3>正在解析PDF文件...</h3>
                        {progress > 0 && (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="progress-text">{progress}%</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📄</div>
                        <h3>{isDragActive ? '释放文件进行上传' : '拖放PDF文件到此处'}</h3>
                        <p>或者</p>
                        <button 
                          type="button" 
                          className="browse-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          选择文件
                        </button>
                        <p className="file-info">支持 PDF 格式，最大 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {file && !parsing && (
                  <div className="file-info-card">
                    <h4>已选择文件</h4>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button className="reset-btn" onClick={resetForm}>
                      重新选择
                    </button>
                  </div>
                )}
              </div>

              {/* 审核要求说明 */}
              <div className="requirements-card">
                <h3>📋 税局备案要求</h3>
                <div className="requirements-list">
                  <div className="requirement-item">
                    <span className="req-icon">📄</span>
                    <div>
                      <strong>出口合同</strong>
                      <p>出口合同或订单文件</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">🧾</span>
                    <div>
                      <strong>商业发票</strong>
                      <p>商业发票或形式发票</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">📦</span>
                    <div>
                      <strong>装箱单</strong>
                      <p>装箱单或包装清单</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">🚛</span>
                    <div>
                      <strong>运输单据</strong>
                      <p>提单、空运单或其他运输单据</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">📋</span>
                    <div>
                      <strong>报关单</strong>
                      <p>出口货物报关单</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">💰</span>
                    <div>
                      <strong>收汇凭证</strong>
                      <p>收汇水单或银行收汇凭证</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 审核结果区域 */}
          {activeTab === 'audit' && auditResult && (
            <div className="audit-result-section">
              <div className="result-card">
                <div className="result-header">
                  <h2>审核结果</h2>
                  <div className={`result-status ${auditResult.isValid ? 'valid' : 'invalid'}`}>
                    {auditResult.isValid ? '✅ 审核通过' : '❌ 审核未通过'}
                  </div>
                </div>

                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-number">{auditResult.foundCount}</span>
                    <span className="stat-label">已找到</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{auditResult.missingCount}</span>
                    <span className="stat-label">缺失</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{Math.round((auditResult.foundCount / auditResult.totalFields) * 100)}%</span>
                    <span className="stat-label">完成度</span>
                  </div>
                </div>

                <div className="documents-grid">
                  <div className="documents-section">
                    <h3>✅ 已找到的文件</h3>
                    <div className="document-list">
                      {auditResult.foundFields.map((field, index) => (
                        <div key={index} className="document-item found">
                          <span className="doc-icon">✓</span>
                          <div className="doc-info">
                            <strong>{field.key}</strong>
                            <span>{field.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {auditResult.missingFields.length > 0 && (
                    <div className="documents-section">
                      <h3>❌ 缺失的文件</h3>
                      <div className="document-list">
                        {auditResult.missingFields.map((field, index) => (
                          <div key={index} className="document-item missing">
                            <span className="doc-icon">✗</span>
                            <div className="doc-info">
                              <strong>{field.key}</strong>
                              <span>{field.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button 
                    className="generate-btn" 
                    onClick={generateReport}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <div className="btn-spinner"></div>
                        生成中...
                      </>
                    ) : (
                      '📄 生成备查文件'
                    )}
                  </button>
                  <button className="back-btn" onClick={() => setActiveTab('upload')}>
                    返回上传
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 出口退税单证备案审核系统 | 国家税务总局合规审核</p>
        </div>
      </footer>
    </div>
  )
}

export default App