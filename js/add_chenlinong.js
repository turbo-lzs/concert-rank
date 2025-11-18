// 添加陈立农数据的JavaScript函数
import { supabase, TABLES } from './supabase.js'

// 陈立农数据
const chenlinongData = {
    singer: {
        name: '陈立农',
        genre: '流行',
        avatar: './assets/images/chenlinong-avatar.jpg'
    },
    concerts: [
        {
            title: '青春之后 2.0 巡回演唱会 - 台北站',
            date: '2024-09-28',
            venue: '台北小巨蛋',
            poster: './assets/images/chenlinong-taipei.jpg'
        },
        {
            title: '青春之后 2.0 巡回演唱会 - 上海站',
            date: '2024-10-19',
            venue: '上海梅赛德斯奔驰文化中心',
            poster: './assets/images/chenlinong-shanghai.jpg'
        },
        {
            title: '青春之后 2.0 巡回演唱会 - 广州站',
            date: '2024-11-16',
            venue: '广州体育馆',
            poster: './assets/images/chenlinong-guangzhou.jpg'
        },
        {
            title: '青春之后 2.0 巡回演唱会 - 北京站',
            date: '2024-12-07',
            venue: '北京工人体育场',
            poster: './assets/images/chenlinong-beijing.jpg'
        },
        {
            title: '青春之后 2.0 巡回演唱会 - 成都站',
            date: '2024-12-28',
            venue: '成都五粮液演艺中心',
            poster: './assets/images/chenlinong-chengdu.jpg'
        }
    ]
}

// 添加陈立农数据的主函数
export async function addChenlinongData() {
    console.log('开始添加陈立农数据...')
    
    try {
        // 1. 检查陈立农是否已存在
        console.log('检查陈立农是否已存在...')
        const { data: existingSinger } = await supabase
            .from(TABLES.SINGERS)
            .select('*')
            .eq('name', chenlinongData.singer.name)
            .single()
        
        let singerId
        
        if (existingSinger) {
            console.log('陈立农已存在，使用现有数据')
            singerId = existingSinger.id
        } else {
            // 2. 添加陈立农到歌手表
            console.log('添加陈立农到歌手表...')
            const { data: newSinger, error: singerError } = await supabase
                .from(TABLES.SINGERS)
                .insert([chenlinongData.singer])
                .select()
                .single()
            
            if (singerError) throw singerError
            singerId = newSinger.id
            console.log('陈立农添加成功，ID:', singerId)
        }
        
        // 3. 检查并添加演唱会
        console.log('添加演唱会数据...')
        
        for (const concert of chenlinongData.concerts) {
            // 检查演唱会是否已存在
            const { data: existingConcert } = await supabase
                .from(TABLES.CONCERTS)
                .select('*')
                .eq('title', concert.title)
                .single()
            
            if (existingConcert) {
                console.log(`演唱会"${concert.title}"已存在，跳过`)
                continue
            }
            
            const { data: newConcert, error: concertError } = await supabase
                .from(TABLES.CONCERTS)
                .insert([{
                    ...concert,
                    singer_id: singerId
                }])
                .select()
                .single()
            
            if (concertError) throw concertError
            console.log(`演唱会"${concert.title}"添加成功，ID:`, newConcert.id)
            
            // 4. 为每个演唱会添加一些示例投票数据
            await addSampleVotes(newConcert.id, concert.title)
        }
        
        console.log('✅ 陈立农数据添加完成！')
        return { success: true, message: '陈立农数据添加成功' }
        
    } catch (error) {
        console.error('❌ 添加陈立农数据失败:', error)
        return { success: false, error: error.message }
    }
}

// 为演唱会添加示例投票数据
async function addSampleVotes(concertId, concertTitle) {
    const sampleVotes = [
        { rating: 5, date: getRandomRecentDate() },
        { rating: 4, date: getRandomRecentDate() },
        { rating: 5, date: getRandomRecentDate() },
        { rating: 4, date: getRandomRecentDate() },
        { rating: 5, date: getRandomRecentDate() },
        { rating: 3, date: getRandomRecentDate() },
        { rating: 4, date: getRandomRecentDate() },
        { rating: 5, date: getRandomRecentDate() }
    ]
    
    const votesToInsert = sampleVotes.map(vote => ({
        concert_id: concertId,
        rating: vote.rating,
        vote_time: vote.date
    }))
    
    const { error: voteError } = await supabase
        .from(TABLES.VOTES)
        .insert(votesToInsert)
    
    if (voteError) {
        console.error(`添加"${concertTitle}"的投票数据失败:`, voteError)
        throw voteError
    }
    
    console.log(`为"${concertTitle}"添加了 ${votesToInsert.length} 条投票数据`)
}

// 生成最近的随机日期
function getRandomRecentDate() {
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * 30) // 0-30天前
    const randomDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    // 随机时间
    const hours = Math.floor(Math.random() * 14) + 10 // 10-23点
    const minutes = Math.floor(Math.random() * 60)
    
    randomDate.setHours(hours, minutes, 0, 0)
    
    return randomDate.toISOString()
}

// 验证陈立农数据
export async function verifyChenlinongData() {
    console.log('验证陈立农数据...')
    
    try {
        // 检查歌手
        const { data: singer } = await supabase
            .from(TABLES.SINGERS)
            .select('*')
            .eq('name', '陈立农')
            .single()
        
        if (!singer) {
            return { success: false, message: '未找到陈立农数据' }
        }
        
        // 检查演唱会
        const { data: concerts } = await supabase
            .from(TABLES.CONCERTS)
            .select('*')
            .eq('singer_id', singer.id)
        
        // 检查投票
        const { data: votes } = await supabase
            .from(TABLES.VOTES)
            .select('*, concerts!inner(*)')
            .eq('concerts.singer_id', singer.id)
        
        const result = {
            success: true,
            singer: singer,
            concerts: concerts || [],
            totalConcerts: concerts?.length || 0,
            totalVotes: votes?.length || 0,
            avgRating: votes && votes.length > 0 
                ? (votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length).toFixed(2)
                : '0.0'
        }
        
        console.log('✅ 陈立农数据验证结果:', result)
        return result
        
    } catch (error) {
        console.error('❌ 验证陈立农数据失败:', error)
        return { success: false, error: error.message }
    }
}

// 在浏览器控制台中可以使用这些函数
window.addChenlinongData = addChenlinongData
window.verifyChenlinongData = verifyChenlinongData

export default {
    addChenlinongData,
    verifyChenlinongData
}