// Supabase 配置
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// 从环境变量获取 Supabase 项目配置
const supabaseUrl = 'https://cxadfohdcpwiqdhtjlmr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWRmb2hkY3B3aXFkaHRqbG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDQxODQsImV4cCI6MjA3ODY4MDE4NH0.lJ_LQsjQrBadgG6wnqa-CqC22DCx75AKOlMdJ5HR7o4'

// 验证配置
if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 配置错误: URL 或 API Key 为空')
    throw new Error('Supabase 配置错误')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 测试连接
async function testConnection() {
    try {
        console.log('测试连接到 Supabase...')
        console.log('URL:', supabaseUrl)
        console.log('Key前缀:', supabaseKey.substring(0, 20) + '...')
        
        const { data, error } = await supabase.from('singers').select('*').limit(1)
        if (error) {
            console.error('Supabase 连接测试失败:', error)
            console.error('错误详情:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            return false
        }
        console.log('Supabase 连接测试成功')
        console.log('测试数据:', data)
        return true
    } catch (error) {
        console.error('Supabase 连接测试异常:', error)
        console.error('异常类型:', error.constructor.name)
        console.error('异常消息:', error.message)
        return false
    }
}

// 导出连接测试函数
export { testConnection }

// 数据库表名常量
export const TABLES = {
  CONCERTS: 'concerts',
  VOTES: 'votes',
  SINGERS: 'singers'
}

// 初始化数据（如果表为空，插入示例数据）
export async function initSampleData() {
  try {
    console.log('开始初始化示例数据...')
    
    // 检查歌手表是否为空
    const { data: singers, error: singersError } = await supabase
      .from(TABLES.SINGERS)
      .select('*')
      .limit(1)

    if (singersError) {
      console.error('检查歌手表错误:', singersError)
      throw singersError
    }

    // 如果歌手表为空，插入示例数据
    if (!singers || singers.length === 0) {
      console.log('插入示例歌手数据...')
      
      const sampleSingers = [
        { name: '周杰伦', genre: '流行', avatar: 'https://picsum.photos/100/100?random=1' },
        { name: '林俊杰', genre: '流行', avatar: 'https://picsum.photos/100/100?random=2' },
        { name: '五月天', genre: '摇滚', avatar: 'https://picsum.photos/100/100?random=3' },
        { name: '邓紫棋', genre: '流行', avatar: 'https://picsum.photos/100/100?random=4' },
        { name: '薛之谦', genre: '民谣', avatar: 'https://picsum.photos/100/100?random=5' },
        { name: '华晨宇', genre: '流行', avatar: 'https://picsum.photos/100/100?random=6' },
        { name: '张杰', genre: '流行', avatar: 'https://picsum.photos/100/100?random=7' },
        { name: '陈奕迅', genre: '流行', avatar: 'https://picsum.photos/100/100?random=8' },
        { name: '蔡依林', genre: '流行', avatar: 'https://picsum.photos/100/100?random=9' },
        { name: 'Taylor Swift', genre: '流行', avatar: 'https://picsum.photos/100/100?random=10' }
      ]

      const { data: insertedSingers, error: insertSingersError } = await supabase
        .from(TABLES.SINGERS)
        .insert(sampleSingers)
        .select()

      if (insertSingersError) {
        console.error('插入歌手数据错误:', insertSingersError)
        throw insertSingersError
      }

      console.log(`成功插入 ${insertedSingers.length} 位歌手`)

      // 等待一小段时间确保数据已插入
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 检查演唱会表是否为空
      const { data: concerts, error: concertsError } = await supabase
        .from(TABLES.CONCERTS)
        .select('*')
        .limit(1)

      if (concertsError) {
        console.error('检查演唱会表错误:', concertsError)
        throw concertsError
      }

      // 如果演唱会表为空，插入示例数据
      if (!concerts || concerts.length === 0) {
        console.log('插入示例演唱会数据...')
        
        const sampleConcerts = [
          {
            singer_id: insertedSingers.find(s => s.name === '周杰伦')?.id,
            title: '2024 嘉年华世界巡回演唱会 - 上海站',
            date: '2024-08-15',
            venue: '上海体育场',
            poster: 'https://picsum.photos/300/200?random=101'
          },
          {
            singer_id: insertedSingers.find(s => s.name === '周杰伦')?.id,
            title: '2024 嘉年华世界巡回演唱会 - 北京站',
            date: '2024-09-20',
            venue: '北京鸟巢',
            poster: 'https://picsum.photos/300/200?random=102'
          },
          {
            singer_id: insertedSingers.find(s => s.name === '林俊杰')?.id,
            title: 'JJ20 世界巡回演唱会 - 深圳站',
            date: '2024-10-05',
            venue: '深圳湾体育中心',
            poster: 'https://picsum.photos/300/200?random=105'
          },
          {
            singer_id: insertedSingers.find(s => s.name === '五月天')?.id,
            title: '好好好想见到你 - 上海站',
            date: '2024-11-10',
            venue: '虹口足球场',
            poster: 'https://picsum.photos/300/200?random=108'
          },
          {
            singer_id: insertedSingers.find(s => s.name === '邓紫棋')?.id,
            title: 'Queen of Hearts 世界巡回 - 广州站',
            date: '2024-12-15',
            venue: '广州体育馆',
            poster: 'https://picsum.photos/300/200?random=111'
          }
        ]

        // 过滤掉无效的歌手ID
        const validConcerts = sampleConcerts.filter(concert => concert.singer_id)

        if (validConcerts.length > 0) {
          const { error: insertConcertsError } = await supabase
            .from(TABLES.CONCERTS)
            .insert(validConcerts)

          if (insertConcertsError) {
            console.error('插入演唱会数据错误:', insertConcertsError)
            throw insertConcertsError
          } else {
            console.log(`成功插入 ${validConcerts.length} 场演唱会`)
          }
        }
      }
    } else {
      console.log('歌手表已有数据，跳过初始化')
    }
  } catch (error) {
    console.error('初始化示例数据失败:', error)
    throw error
  }
}

// 导出默认配置
export default {
  supabase,
  TABLES,
  initSampleData
}