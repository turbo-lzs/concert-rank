# 演唱会人气投票平台 - 部署指南

## 快速开始

### 1. Supabase 数据库设置

在 Supabase 控制台中创建以下数据表：

**singers 表**
```sql
CREATE TABLE singers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    avatar_url TEXT
);
```

**concerts 表**
```sql
CREATE TABLE concerts (
    id SERIAL PRIMARY KEY,
    singer_id INTEGER REFERENCES singers(id),
    title VARCHAR(200) NOT NULL,
    concert_date DATE NOT NULL,
    venue VARCHAR(100),
    poster_url TEXT
);
```

**votes 表**
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    concert_id INTEGER REFERENCES concerts(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ConcertRank
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
创建 `.env` 文件：
```env
VITE_SUPABASE_URL=https://cxadfohdcpwiqdhtjlmr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_secret_5x6SKHwftPSvM-0OpAIwjg_muflJsMf
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 3. Netlify 部署

1. **推送代码到 GitHub**

2. **Netlify 设置**
   - 登录 Netlify
   - 选择 "New site from Git"
   - 连接你的 GitHub 仓库

3. **构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **环境变量**
在 Netlify 的 Site settings > Environment variables 中设置：
- `VITE_SUPABASE_URL`: https://cxadfohdcpwiqdhtjlmr.supabase.co
- `VITE_SUPABASE_ANON_KEY`: sb_secret_5x6SKHwftPSvM-0OpAIwjg_muflJsMf

5. **部署**
点击 "Deploy site"

## 项目结构说明

### 主要文件
- `index.html` - 首页（人气总览）
- `vote.html` - 投票页面
- `stats.html` - 统计分析页面
- `css/style.css` - 样式文件
- `js/` - JavaScript 模块

### 数据库表关系
```
歌手 (1) ←→ (N) 演唱会 (1) ←→ (N) 投票记录
```

## 功能验证清单

✅ **首页功能**
- [ ] 统计卡片显示正确
- [ ] 热门歌手TOP3展示
- [ ] 完整歌手排名列表
- [ ] 实时数据更新

✅ **投票页面功能**
- [ ] 筛选器正常工作
- [ ] 演唱会列表加载
- [ ] 评分功能正常
- [ ] 防重复投票机制
- [ ] 投票成功提示

✅ **统计分析功能**
- [ ] 饼图显示评分分布
- [ ] 柱状图对比曲风
- [ ] 热门演唱会TOP10
- [ ] 数据表格排序搜索
- [ ] 分页功能正常

## 常见问题

### Q: 页面加载空白？
A: 检查 Supabase 配置是否正确，确保表结构已创建

### Q: 投票不成功？
A: 检查网络连接和 Supabase 权限设置

### Q: 图表不显示？
A: 确保 Chart.js 正确加载，检查浏览器控制台错误

## 技术栈版本

- Bootstrap: 5.1.3
- Chart.js: 最新版本
- Supabase: 最新版本
- Vite: 最新版本

## 开发说明

项目使用了现代前端技术栈，代码模块化设计，便于维护和扩展。所有页面都支持响应式设计，适配移动端和桌面端。

---
**开发完成时间**: 2025年11月14日  
**技术栈**: Supabase + Netlify + Bootstrap + Chart.js