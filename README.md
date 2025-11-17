# 演唱会人气投票平台

一个基于 Supabase 和 Netlify 的演唱会投票平台，允许用户匿名给演唱会评分，并实时查看统计数据和可视化图表。

## 项目特色

- 🎵 **3个独立页面**：人气排名、我要投票、统计分析
- 📊 **实时数据统计**：总投票数、平均评分、热门歌手排名
- 📈 **数据可视化**：Chart.js 图表展示评分分布、曲风对比
- 🎨 **响应式设计**：Bootstrap 5 + 自定义CSS，适配各种设备
- 🚀 **实时更新**：Supabase 实时监听，数据自动刷新
- 🔒 **匿名投票**：无需登录，简单易用

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **UI框架**：Bootstrap 5
- **图表库**：Chart.js
- **后端服务**：Supabase (PostgreSQL)
- **部署平台**：Netlify
- **构建工具**：Vite

## 项目结构

```
concert-vote/
├── index.html          # 首页 - 人气总览
├── vote.html           # 投票页面
├── stats.html          # 统计分析页面
├── css/
│   └── style.css       # 自定义样式
├── js/
│   ├── supabase.js     # Supabase 配置
│   ├── index.js        # 首页逻辑
│   ├── vote.js         # 投票页逻辑
│   └── stats.js        # 统计页逻辑
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
├── netlify.toml        # Netlify 部署配置
└── README.md          # 项目说明
```

## 数据库设计

### 数据表结构

1. **singers 表** - 歌手信息
   - `id` (主键)
   - `name` (歌手姓名)
   - `genre` (曲风)
   - `avatar` (头像URL)

2. **concerts 表** - 演唱会信息
   - `id` (主键)
   - `singer_id` (外键，关联歌手)
   - `title` (演唱会标题)
   - `date` (举办日期)
   - `venue` (场馆)
   - `poster` (海报URL)

3. **votes 表** - 投票记录
   - `id` (主键)
   - `concert_id` (外键，关联演唱会)
   - `rating` (评分 1-5)
   - `vote_time` (投票时间)

### 表关系
```
singers (1) ←→ (N) concerts (1) ←→ (N) votes
```

## 部署说明

### 本地开发

1. 克隆项目到本地
```bash
git clone <repository-url>
cd concert-vote
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 访问 http://localhost:3000

### Netlify 部署

1. 确保项目已推送到 GitHub
2. 登录 Netlify 并连接 GitHub 仓库
3. 配置构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`dist`
4. 点击部署按钮

### 环境变量配置

在 Netlify 中设置以下环境变量：
- `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥

## 功能特性

### 首页 - 人气总览
- 实时统计卡片：总投票数、演唱会数、平均评分
- 热门歌手 TOP3 展示
- 完整歌手排名列表
- 点击歌手可跳转到详细统计

### 投票页面 - 我要投票
- 双筛选器：按歌手、曲风筛选演唱会
- 直观的评分界面（1-5分带描述）
- 实时投票反馈
- 防重复投票机制（本地存储）
- 投票统计实时显示

### 统计分析页面
- 评分分布饼图
- 曲风对比柱状图
- 热门演唱会TOP10横向柱状图
- 详细数据表格（支持搜索、排序、分页）
- 实时数据更新

## 开发特色

1. **模块化设计**：每个页面独立逻辑，代码结构清晰
2. **错误处理**：完善的错误提示和异常处理
3. **性能优化**：懒加载、分页处理大数据量
4. **用户体验**：加载动画、平滑过渡、响应式反馈
5. **代码规范**：ES6+ 语法，良好的代码注释

## 注意事项

- 项目使用浏览器本地存储来防止重复投票
- 所有投票数据实时同步到 Supabase 数据库
- 图表数据基于实际投票数据动态生成
- 支持移动端和桌面端访问

## 未来优化方向

- [ ] 添加用户评论功能
- [ ] 实现社交媒体分享
- [ ] 增加更多统计维度
- [ ] 优化移动端体验
- [ ] 添加更多可视化图表类型

## 许可证

本项目为作业项目，仅供学习和参考使用。

---

**开发时间**：2025年11月
**技术栈**：Supabase + Netlify + Bootstrap + Chart.js
**开发者**：学生作业项目