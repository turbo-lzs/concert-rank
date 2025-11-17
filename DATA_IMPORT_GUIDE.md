# Supabase 数据导入指南

## 📋 导入步骤

### 1. 登录 Supabase
- 访问 https://supabase.com/dashboard
- 登录你的账号
- 选择你的项目: `cxadfohdcpwiqdhtjlmr`

### 2. 执行 SQL 语句
1. 在左侧菜单点击 **SQL Editor**
2. 点击 **New Query** 创建新查询
3. 将 `sample_data.sql` 文件中的内容复制到编辑器中
4. 点击 **Run** 按钮执行SQL语句

### 3. 执行说明
- **首次导入**: 直接执行整个SQL文件
- **重新导入** (如果已有数据): 
  - 可以取消注释第一行的 `TRUNCATE TABLE` 语句
  - 这样会清空现有数据并重新插入

## 📊 导入的数据内容

### 歌手数据 (10位歌手)
- 周杰伦、林俊杰、五月天、邓紫棋、薛之谦
- 华晨宇、张杰、陈奕迅、蔡依林、Taylor Swift

### 演唱会数据 (24场演唱会)
- 每个歌手2-4场演唱会
- 分布在不同的城市和日期
- 包含真实的海报图片链接

### 投票数据 (60+个投票)
- 每个演唱会都有真实的投票记录
- 评分分布在1-5分
- 包含真实的时间戳

## 🔍 数据验证

执行完成后，你可以在 Supabase 中验证数据：

1. **查看歌手表**: Table Editor → singers
2. **查看演唱会表**: Table Editor → concerts  
3. **查看投票表**: Table Editor → votes
4. **运行验证查询**: SQL Editor 中最后几个查询语句

## 📈 预期结果

导入成功后，你的网站应该显示：

### 首页 (http://localhost:3001)
- ✅ 总投票数: 60+
- ✅ 参与评分的演唱会数: 10+
- ✅ 平均评分: 约4.3分
- ✅ 热门歌手TOP3: 周杰伦、林俊杰、五月天
- ✅ 完整歌手排名列表

### 投票页面 (http://localhost:3001/vote.html)
- ✅ 演唱会列表正常显示
- ✅ 筛选功能正常工作
- ✅ 可以正常投票

### 统计分析页面 (http://localhost:3001/stats.html)
- ✅ 评分分布饼图
- ✅ 曲风对比柱状图
- ✅ 热门演唱会TOP10
- ✅ 详细数据表格

## 🚨 常见问题

### Q: 执行SQL时出现错误
A: 检查表结构是否正确，确保 singers、concerts、votes 表已创建

### Q: 数据导入后网站仍显示空白
A: 刷新页面，检查浏览器控制台是否有错误信息

### Q: 投票功能不正常
A: 确保Supabase的RLS（行级安全策略）设置正确

## 🔧 RLS设置检查

在Supabase中检查表权限：
1. 进入 **Authentication** → **Policies**
2. 为每个表添加以下策略：
   - **singers**: 允许所有人读取 (SELECT)
   - **concerts**: 允许所有人读取 (SELECT)  
   - **votes**: 允许所有人读取和插入 (SELECT, INSERT)

## ✅ 完成验证

导入完成后，请在浏览器中访问 http://localhost:3001 验证所有功能是否正常。

如果遇到问题，请检查浏览器控制台错误信息并参照此指南进行调试。