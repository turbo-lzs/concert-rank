# 部署指南

## 修复后的配置变更

### 1. Vite 配置更新
- 修改了 `vite.config.js`，现在会构建所有三个HTML页面：
  - `index.html` (人气排名)
  - `vote.html` (我要投票)  
  - `stats.html` (统计分析)

### 2. Netlify 配置优化
- 更新了 `netlify.toml`，移除了导致所有页面重定向到首页的规则
- 添加了正确的静态文件处理规则

## 如何重新部署

### 方法一：通过 Git 提交（推荐）
```bash
git add .
git commit -m "修复多页面路由问题"
git push origin main
```

### 方法二：通过 Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 方法三：手动上传
1. 构建项目：`npm run build`
2. 在 Netlify 控制台手动上传 `dist` 文件夹内容

## 验证修复
部署后，以下链接应该都能正常访问：
- https://concert-rank.netlify.app/ (首页)
- https://concert-rank.netlify.app/vote.html (投票页面)
- https://concert-rank.netlify.app/stats.html (统计页面)

## 问题原因
之前的配置问题是：
1. Vite 只构建了 `index.html`
2. Netlify 将所有请求重定向到 `index.html`
3. 这导致其他页面无法正常访问

现在这些问题都已修复！