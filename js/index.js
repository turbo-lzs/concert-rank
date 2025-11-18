// 首页逻辑 - 人气总览
import { supabase, TABLES, initSampleData, testConnection } from './supabase.js'

// 全局变量
let singersData = []
let concertsData = []
let votesData = []

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('首页初始化...')
    
    try {
        // 测试数据库连接
        console.log('测试数据库连接...')
        const connectionSuccess = await testConnection()
        console.log('连接测试结果:', connectionSuccess)
        
        if (!connectionSuccess) {
            showError('数据库连接失败，请检查网络连接和Supabase配置')
            return
        }
        
        console.log('数据库连接成功，开始初始化数据...')
        
        // 初始化示例数据（如果数据库为空）
        await initSampleData()
        
        // 加载所有数据
        await loadAllData()
        
        // 更新统计数据
        updateStats()
        
        // 渲染热门歌手TOP3
        renderTopSingers()
        
        // 渲染所有歌手排名
        renderAllSingers()
        
        console.log('首页初始化完成')
    } catch (error) {
        console.error('首页初始化错误:', error)
        showError('数据加载失败，请检查控制台查看详细错误信息', error)
    }
})

// 加载所有数据
async function loadAllData() {
    try {
        console.log('开始加载歌手数据...')
        // 加载歌手数据
        const { data: singers, error: singersError } = await supabase
            .from(TABLES.SINGERS)
            .select('*')
            .order('name')
        
        if (singersError) {
            console.error('歌手数据加载错误:', singersError)
            throw singersError
        }
        singersData = singers || []
        console.log(`歌手数据加载成功，共 ${singersData.length} 条记录`)
        
        console.log('开始加载演唱会数据...')
        // 加载演唱会数据
        const { data: concerts, error: concertsError } = await supabase
            .from(TABLES.CONCERTS)
            .select(`*, ${TABLES.SINGERS}(name, genre, avatar)`)
            .order('date', { ascending: false })
        
        if (concertsError) {
            console.error('演唱会数据加载错误:', concertsError)
            throw concertsError
        }
        concertsData = concerts || []
        console.log(`演唱会数据加载成功，共 ${concertsData.length} 条记录`)
        
        console.log('开始加载投票数据...')
        // 加载投票数据
        const { data: votes, error: votesError } = await supabase
            .from(TABLES.VOTES)
            .select('*')
        
        if (votesError) {
            console.error('投票数据加载错误:', votesError)
            throw votesError
        }
        votesData = votes || []
        console.log(`投票数据加载成功，共 ${votesData.length} 条记录`)
        
    } catch (error) {
        console.error('加载数据错误:', error)
        throw error
    }
}

// 更新统计数据
function updateStats() {
    // 总投票数
    const totalVotes = votesData.length
    document.getElementById('totalVotes').textContent = totalVotes.toLocaleString()
    
    // 参与评分的演唱会数
    const votedConcerts = [...new Set(votesData.map(vote => vote.concert_id))].length
    document.getElementById('totalConcerts').textContent = votedConcerts.toLocaleString()
    
    // 平均评分
    const avgRating = votesData.length > 0 
        ? (votesData.reduce((sum, vote) => sum + vote.rating, 0) / votesData.length).toFixed(1)
        : '0.0'
    document.getElementById('avgRating').textContent = avgRating
}

// 计算歌手统计数据
function calculateSingerStats() {
    return singersData.map(singer => {
        // 找到该歌手的演唱会
        const singerConcerts = concertsData.filter(concert => concert.singer_id === singer.id)
        
        // 找到这些演唱会的投票
        const singerVotes = votesData.filter(vote => 
            singerConcerts.some(concert => concert.id === vote.concert_id)
        )
        
        // 计算统计数据
        const voteCount = singerVotes.length
        const avgRating = voteCount > 0 
            ? (singerVotes.reduce((sum, vote) => sum + vote.rating, 0) / voteCount).toFixed(1)
            : '0.0'
        
        return {
            ...singer,
            voteCount,
            avgRating: parseFloat(avgRating),
            concertCount: singerConcerts.length
        }
    }).sort((a, b) => b.voteCount - a.voteCount || b.avgRating - a.avgRating)
}

// 渲染热门歌手TOP3
function renderTopSingers() {
    const topSingersContainer = document.getElementById('topSingers')
    const singerStats = calculateSingerStats()
    const top3Singers = singerStats.slice(0, 3)
    
    if (top3Singers.length === 0) {
        topSingersContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">暂无歌手数据</p>
            </div>
        `
        return
    }
    
    topSingersContainer.innerHTML = top3Singers.map((singer, index) => `
        <div class="col-md-4 mb-3">
            <div class="card singer-card h-100" onclick="goToSingerRanking(${singer.id})">
                <div class="card-body text-center">
                    <div class="singer-rank mb-3 mx-auto">${index + 1}</div>
                    <img src="${singer.avatar}" alt="${singer.name}" class="singer-avatar mb-3">
                    <h5 class="card-title">${singer.name}</h5>
                    <p class="text-muted mb-1">${singer.genre}</p>
                    <div class="d-flex justify-content-center gap-3 mt-2">
                        <small class="text-muted">
                            <i class="fas fa-vote-yea"></i> ${singer.voteCount}票
                        </small>
                        <small class="text-muted">
                            <i class="fas fa-star"></i> ${singer.avgRating}分
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}

// 渲染所有歌手排名
function renderAllSingers() {
    const allSingersContainer = document.getElementById('allSingers')
    const singerStats = calculateSingerStats()
    
    if (singerStats.length === 0) {
        allSingersContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">暂无歌手数据</p>
            </div>
        `
        return
    }
    
    allSingersContainer.innerHTML = singerStats.map((singer, index) => `
        <div class="col-lg-6 mb-3">
            <div class="card singer-card h-100" onclick="goToSingerRanking(${singer.id})">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <div class="singer-rank">${index + 1}</div>
                        </div>
                        <div class="col-auto">
                            <img src="${singer.avatar}" alt="${singer.name}" class="singer-avatar">
                        </div>
                        <div class="col">
                            <h6 class="mb-1">${singer.name}</h6>
                            <p class="text-muted mb-1 small">${singer.genre}</p>
                            <div class="d-flex gap-3">
                                <small class="text-muted">
                                    <i class="fas fa-music"></i> ${singer.concertCount}场
                                </small>
                                <small class="text-muted">
                                    <i class="fas fa-vote-yea"></i> ${singer.voteCount}票
                                </small>
                                <small class="text-warning">
                                    <i class="fas fa-star"></i> ${singer.avgRating}分
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}

// 跳转到歌手排名页面（暂时跳转到统计分析页面）
window.goToSingerRanking = function(singerId) {
    // 存储当前选中的歌手ID到localStorage
    localStorage.setItem('selectedSingerId', singerId)
    // 跳转到统计分析页面
    window.location.href = 'stats.html'
}

// 显示错误信息
function showError(message, error = null) {
    const container = document.querySelector('.container')
    const alertDiv = document.createElement('div')
    alertDiv.className = 'alert alert-danger alert-dismissible fade show'
    
    let errorDetails = ''
    if (error) {
        errorDetails = `
            <br><small><strong>错误详情:</strong></small>
            <br><small>${error.message || JSON.stringify(error)}</small>
        `
    }
    
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        ${errorDetails}
        <br><small>如果问题持续存在，请检查 Supabase 项目配置是否正确</small>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    container.insertBefore(alertDiv, container.firstChild)
    
    // 隐藏加载动画
    const loadingElements = document.querySelectorAll('.loading')
    loadingElements.forEach(el => el.style.display = 'none')
    
    // 隐藏加载提示
    const loadingTexts = document.querySelectorAll('p')
    loadingTexts.forEach(p => {
        if (p.textContent.includes('正在加载')) {
            p.style.display = 'none'
        }
    })
}

// 实时更新数据（可选功能）
function startRealTimeUpdates() {
    // 监听投票表的变化
    supabase
        .channel('votes')
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: TABLES.VOTES }, 
            () => {
                console.log('检测到新投票，重新加载数据...')
                refreshData()
            }
        )
        .subscribe()
}

// 刷新数据
async function refreshData() {
    try {
        await loadAllData()
        updateStats()
        renderTopSingers()
        renderAllSingers()
    } catch (error) {
        console.error('刷新数据错误:', error)
    }
}

// 开始实时更新（可选，可以根据需要启用）
// startRealTimeUpdates()