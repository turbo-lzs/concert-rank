-- 更新陈立农数据为本地图片路径的SQL脚本
-- 请在Supabase SQL编辑器中执行此SQL语句

-- 1. 更新陈立农的头像为本地路径
UPDATE singers 
SET avatar = './assets/images/chenlinong-avatar.jpg' 
WHERE name = '陈立农';

-- 2. 更新陈立农演唱会的海报为本地路径
UPDATE concerts 
SET poster = CASE 
  WHEN title LIKE '%台北站%' THEN './assets/images/chenlinong-taipei.jpg'
  WHEN title LIKE '%上海站%' THEN './assets/images/chenlinong-shanghai.jpg'
  WHEN title LIKE '%广州站%' THEN './assets/images/chenlinong-guangzhou.jpg'
  WHEN title LIKE '%北京站%' THEN './assets/images/chenlinong-beijing.jpg'
  WHEN title LIKE '%成都站%' THEN './assets/images/chenlinong-chengdu.jpg'
END
WHERE singer_id = (SELECT id FROM singers WHERE name = '陈立农');

-- 3. 验证更新结果
SELECT '=== 陈立农图片路径更新验证 ===' as info;

-- 查看陈立农的歌手信息（包含头像路径）
SELECT 
  '歌手头像路径' as 类型,
  s.name AS 歌手名,
  s.avatar AS 头像路径
FROM singers s 
WHERE s.name = '陈立农';

-- 查看陈立农的演唱会（包含海报路径）
SELECT 
  '演唱会海报路径' as 类型,
  c.title AS 演唱会名称,
  c.poster AS 海报路径
FROM concerts c
JOIN singers s ON c.singer_id = s.id
WHERE s.name = '陈立农'
ORDER BY c.date;

-- 4. 图片文件检查提醒
SELECT '=== 使用说明 ===' as info;
SELECT '请确保以下图片文件存在于 assets/images/ 文件夹中：' as 说明;
SELECT '1. chenlinong-avatar.jpg (陈立农头像)' as 文件1;
SELECT '2. chenlinong-taipei.jpg (台北站海报)' as 文件2;
SELECT '3. chenlinong-shanghai.jpg (上海站海报)' as 文件3;
SELECT '4. chenlinong-guangzhou.jpg (广州站海报)' as 文件4;
SELECT '5. chenlinong-beijing.jpg (北京站海报)' as 文件5;
SELECT '6. chenlinong-chengdu.jpg (成都站海报)' as 文件6;