-- 添加陈立农相关数据的SQL脚本
-- 请在Supabase SQL编辑器中执行此SQL语句

-- 1. 添加陈立农到歌手表
INSERT INTO singers (name, genre, avatar) 
VALUES 
('陈立农', '流行', './assets/images/chenlinong-avatar.jpg')
ON CONFLICT (name) DO NOTHING;

-- 2. 获取陈立农的ID并添加演唱会数据
WITH chenlinong_id AS (
  SELECT id FROM singers WHERE name = '陈立农'
)
INSERT INTO concerts (singer_id, title, date, venue, poster)
SELECT 
  ci.id,
  concert_data.title,
  concert_data.date::DATE,
  concert_data.venue,
  concert_data.poster
FROM chenlinong_id ci
JOIN (
  VALUES 
    -- 陈立农的演唱会数据
    ('陈立农', '青春之后 2.0 巡回演唱会 - 台北站', '2024-09-28', '台北小巨蛋', './assets/images/chenlinong-taipei.jpg'),
    ('陈立农', '青春之后 2.0 巡回演唱会 - 上海站', '2024-10-19', '上海梅赛德斯奔驰文化中心', './assets/images/chenlinong-shanghai.jpg'),
    ('陈立农', '青春之后 2.0 巡回演唱会 - 广州站', '2024-11-16', '广州体育馆', './assets/images/chenlinong-guangzhou.jpg'),
    ('陈立农', '青春之后 2.0 巡回演唱会 - 北京站', '2024-12-07', '北京工人体育场', './assets/images/chenlinong-beijing.jpg'),
    ('陈立农', '青春之后 2.0 巡回演唱会 - 成都站', '2024-12-28', '成都五粮液演艺中心', './assets/images/chenlinong-chengdu.jpg')
) AS concert_data(singer_name, title, date, venue, poster)
ON ci.id = ci.id;

-- 3. 添加陈立农演唱会的投票数据
WITH chenlinong_concerts AS (
  SELECT id, title FROM concerts c
  JOIN singers s ON c.singer_id = s.id
  WHERE s.name = '陈立农'
)
INSERT INTO votes (concert_id, rating, vote_time)
SELECT 
  cc.id,
  vote_data.rating,
  vote_data.vote_time::TIMESTAMPTZ
FROM chenlinong_concerts cc
JOIN (
  VALUES 
    -- 陈立农台北站投票数据
    ('青春之后 2.0 巡回演唱会 - 台北站', 4, '2024-09-29 20:30:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 5, '2024-09-29 21:15:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 4, '2024-09-30 10:45:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 5, '2024-09-30 16:20:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 4, '2024-10-01 14:10:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 5, '2024-10-01 19:35:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 4, '2024-10-02 11:25:00+08'),
    ('青春之后 2.0 巡回演唱会 - 台北站', 5, '2024-10-02 17:40:00+08'),

    -- 陈立农上海站投票数据
    ('青春之后 2.0 巡回演唱会 - 上海站', 5, '2024-10-20 19:45:00+08'),
    ('青春之后 2.0 巡回演唱会 - 上海站', 4, '2024-10-20 21:20:00+08'),
    ('青春之后 2.0 巡回演唱会 - 上海站', 5, '2024-10-21 12:15:00+08'),
    ('青春之后 2.0 巡回演唱会 - 上海站', 4, '2024-10-21 17:30:00+08'),
    ('青春之后 2.0 巡回演唱会 - 上海站', 5, '2024-10-22 14:25:00+08'),
    ('青春之后 2.0 巡回演唱会 - 上海站', 4, '2024-10-22 19:50:00+08'),

    -- 陈立农广州站投票数据
    ('青春之后 2.0 巡回演唱会 - 广州站', 4, '2024-11-17 20:15:00+08'),
    ('青春之后 2.0 巡回演唱会 - 广州站', 5, '2024-11-17 21:40:00+08'),
    ('青春之后 2.0 巡回演唱会 - 广州站', 4, '2024-11-18 11:35:00+08'),
    ('青春之后 2.0 巡回演唱会 - 广州站', 5, '2024-11-18 16:50:00+08'),
    ('青春之后 2.0 巡回演唱会 - 广州站', 4, '2024-11-19 13:20:00+08'),
    ('青春之后 2.0 巡回演唱会 - 广州站', 5, '2024-11-19 18:45:00+08'),

    -- 陈立农北京站投票数据
    ('青春之后 2.0 巡回演唱会 - 北京站', 5, '2024-12-08 19:55:00+08'),
    ('青春之后 2.0 巡回演唱会 - 北京站', 5, '2024-12-08 21:25:00+08'),
    ('青春之后 2.0 巡回演唱会 - 北京站', 4, '2024-12-09 10:40:00+08'),
    ('青春之后 2.0 巡回演唱会 - 北京站', 5, '2024-12-09 15:55:00+08'),
    ('青春之后 2.0 巡回演唱会 - 北京站', 4, '2024-12-10 12:30:00+08'),

    -- 陈立农成都站投票数据
    ('青春之后 2.0 巡回演唱会 - 成都站', 5, '2024-12-29 20:25:00+08'),
    ('青春之后 2.0 巡回演唱会 - 成都站', 4, '2024-12-29 21:50:00+08'),
    ('青春之后 2.0 巡回演唱会 - 成都站', 5, '2024-12-30 11:15:00+08'),
    ('青春之后 2.0 巡回演唱会 - 成都站', 4, '2024-12-30 16:40:00+08')
) AS vote_data(concert_title, rating, vote_time)
ON cc.title = vote_data.concert_title;

-- 4. 验证陈立农数据是否添加成功
SELECT '=== 陈立农数据验证 ===' as info;

-- 查看陈立农的歌手信息
SELECT 
  '歌手信息' as 类型,
  s.name AS 歌手名,
  s.genre AS 曲风,
  s.avatar AS 头像
FROM singers s 
WHERE s.name = '陈立农';

-- 查看陈立农的演唱会
SELECT 
  '演唱会信息' as 类型,
  c.title AS 演唱会名称,
  c.date AS 日期,
  c.venue AS 场馆
FROM concerts c
JOIN singers s ON c.singer_id = s.id
WHERE s.name = '陈立农'
ORDER BY c.date;

-- 查看陈立农演唱会的投票统计
SELECT 
  '投票统计' as 类型,
  c.title AS 演唱会名称,
  COUNT(v.id) AS 投票数量,
  ROUND(AVG(v.rating), 2) AS 平均评分,
  MIN(v.rating) AS 最低分,
  MAX(v.rating) AS 最高分
FROM concerts c
JOIN singers s ON c.singer_id = s.id
LEFT JOIN votes v ON c.id = v.concert_id
WHERE s.name = '陈立农'
GROUP BY c.id, c.title
ORDER BY c.date;

-- 查看陈立农的整体排名情况
SELECT 
  '整体排名' as 类型,
  s.name AS 歌手名,
  COUNT(DISTINCT c.id) AS 演唱会数量,
  COUNT(v.id) AS 总投票数,
  ROUND(AVG(v.rating), 2) AS 平均评分
FROM singers s
LEFT JOIN concerts c ON s.id = c.singer_id
LEFT JOIN votes v ON c.id = v.concert_id
GROUP BY s.id, s.name
HAVING COUNT(v.id) > 0
ORDER BY COUNT(v.id) DESC, AVG(v.rating) DESC
LIMIT 10;