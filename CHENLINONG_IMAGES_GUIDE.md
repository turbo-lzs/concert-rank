# 陈立农演唱会图片替换指南

## 📁 图片存放位置

请将你的陈立农演唱会图片文件放在以下文件夹中：
```
d:/A-cumpus/ConcertRank/assets/images/
```

## 🎵 需要的图片文件

为陈立农的5场演唱会准备对应的图片：

| 演唱会 | 建议文件名 | 建议尺寸 | 说明 |
|--------|------------|----------|------|
| 青春之后 2.0 巡回演唱会 - 台北站 | `chenlinong-taipei.jpg` | 300x200px | 台北小巨蛋演唱会海报 |
| 青春之后 2.0 巡回演唱会 - 上海站 | `chenlinong-shanghai.jpg` | 300x200px | 上海站演唱会海报 |
| 青春之后 2.0 巡回演唱会 - 广州站 | `chenlinong-guangzhou.jpg` | 300x200px | 广州站演唱会海报 |
| 青春之后 2.0 巡回演唱会 - 北京站 | `chenlinong-beijing.jpg` | 300x200px | 北京站演唱会海报 |
| 青春之后 2.0 巡回演唱会 - 成都站 | `chenlinong-chengdu.jpg` | 300x200px | 成都站演唱会海报 |

**也可以使用 PNG 格式**：`chenlinong-taipei.png` 等

## 🖼️ 歌手头像

还需要一张陈立农的头像：
- 文件名：`chenlinong-avatar.jpg`（或 `.png`）
- 建议尺寸：100x100px（正方形）
- 说明：用于歌手列表和详情页

## ✏️ 修改方法

### 方法一：替换现有文件（推荐）

1. **将你的图片重命名为建议的文件名**
2. **将文件复制到** `d:/A-cumpus/ConcertRank/assets/images/` **文件夹**
3. **刷新网页即可看到新图片**

### 方法二：修改代码中的图片路径

如果你想要使用自定义文件名，需要修改以下文件：

#### 1. 修改 `js/add_chenlinong.js`

```javascript
// 找到 chenlinongData 对象
const chenlinongData = {
    singer: {
        name: '陈立农',
        genre: '流行',
        avatar: './assets/images/chenlinong-avatar.jpg'  // 修改这里
    },
    concerts: [
        {
            title: '青春之后 2.0 巡回演唱会 - 台北站',
            date: '2024-09-28',
            venue: '台北小巨蛋',
            poster: './assets/images/chenlinong-taipei.jpg'  // 修改这里
        },
        // ... 其他演唱会
    ]
}
```

#### 2. 修改 `add_chenlinong.sql`

```sql
-- 修改INSERT singers语句
INSERT INTO singers (name, genre, avatar) 
VALUES 
('陈立农', '流行', './assets/images/chenlinong-avatar.jpg');

-- 修改INSERT concerts语句中的图片路径
INSERT INTO concerts (singer_id, title, date, venue, poster)
VALUES 
(你的singer_id, '青春之后 2.0 巡回演唱会 - 台北站', '2024-09-28', '台北小巨蛋', './assets/images/chenlinong-taipei.jpg'),
-- 其他演唱会...
```

## 🔄 更新现有数据

如果你已经添加了陈立农的数据，需要更新图片路径：

### 使用 SQL 更新

```sql
-- 更新歌手头像
UPDATE singers 
SET avatar = './assets/images/chenlinong-avatar.jpg' 
WHERE name = '陈立农';

-- 更新演唱会图片
UPDATE concerts 
SET poster = './assets/images/chenlinong-taipei.jpg' 
WHERE title = '青春之后 2.0 巡回演唱会 - 台北站';

UPDATE concerts 
SET poster = './assets/images/chenlinong-shanghai.jpg' 
WHERE title = '青春之后 2.0 巡回演唱会 - 上海站';

UPDATE concerts 
SET poster = './assets/images/chenlinong-guangzhou.jpg' 
WHERE title = '青春之后 2.0 巡回演唱会 - 广州站';

UPDATE concerts 
SET poster = './assets/images/chenlinong-beijing.jpg' 
WHERE title = '青春之后 2.0 巡回演唱会 - 北京站';

UPDATE concerts 
SET poster = './assets/images/chenlinong-chengdu.jpg' 
WHERE title = '青春之后 2.0 巡回演唱会 - 成都站';
```

### 使用控制台更新

在浏览器控制台中运行：
```javascript
import { supabase, TABLES } from './js/supabase.js'

// 更新歌手头像
await supabase
  .from(TABLES.SINGERS)
  .update({ avatar: './assets/images/chenlinong-avatar.jpg' })
  .eq('name', '陈立农')

// 更新演唱会海报
const updates = [
  { title: '青春之后 2.0 巡回演唱会 - 台北站', poster: './assets/images/chenlinong-taipei.jpg' },
  { title: '青春之后 2.0 巡回演唱会 - 上海站', poster: './assets/images/chenlinong-shanghai.jpg' },
  { title: '青春之后 2.0 巡回演唱会 - 广州站', poster: './assets/images/chenlinong-guangzhou.jpg' },
  { title: '青春之后 2.0 巡回演唱会 - 北京站', poster: './assets/images/chenlinong-beijing.jpg' },
  { title: '青春之后 2.0 巡回演唱会 - 成都站', poster: './assets/images/chenlinong-chengdu.jpg' }
]

for (const update of updates) {
  await supabase
    .from(TABLES.CONCERTS)
    .update({ poster: update.poster })
    .eq('title', update.title)
}

console.log('图片路径更新完成')
```

## 📝 注意事项

1. **文件名不要包含中文或特殊字符**
2. **推荐使用 JPG 或 PNG 格式**
3. **图片文件大小控制在 500KB 以内**
4. **如果图片无法显示，请检查文件路径是否正确**
5. **修改后需要清除浏览器缓存或强制刷新（Ctrl+F5）**

## 🎯 完整操作步骤

1. 准备6张图片（1张头像 + 5张演唱会海报）
2. 按建议命名并放入 `assets/images/` 文件夹
3. 运行更新 SQL 或使用控制台更新数据库中的图片路径
4. 刷新网页查看效果

## 🚀 快速操作脚本

如果你已经将图片按建议文件名放入 `assets/images/` 文件夹，可以直接运行以下脚本：

```sql
-- 一键更新陈立农所有图片路径
UPDATE singers 
SET avatar = './assets/images/chenlinong-avatar.jpg' 
WHERE name = '陈立农';

UPDATE concerts 
SET poster = CASE 
  WHEN title LIKE '%台北站%' THEN './assets/images/chenlinong-taipei.jpg'
  WHEN title LIKE '%上海站%' THEN './assets/images/chenlinong-shanghai.jpg'
  WHEN title LIKE '%广州站%' THEN './assets/images/chenlinong-guangzhou.jpg'
  WHEN title LIKE '%北京站%' THEN './assets/images/chenlinong-beijing.jpg'
  WHEN title LIKE '%成都站%' THEN './assets/images/chenlinong-chengdu.jpg'
END
WHERE singer_id = (SELECT id FROM singers WHERE name = '陈立农');
```

这样就可以一次性更新所有图片了！