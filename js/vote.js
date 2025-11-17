// 投票页面逻辑
import { supabase, TABLES, testConnection } from './supabase.js'

// 全局变量
let concertsData = []
let singersData = []
let votesData = []
let selectedRatings = {} // 存储用户选择的评分

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('投票页面初始化...')
    
    try {
        // 测试数据库连接
        console.log('测试数据库连接...')
        const connectionSuccess = await testConnection()
        
        if (!connectionSuccess) {
            showError('数据库连接失败，请检查网络连接和Supabase配置')
            return
        }
        
        console.log('数据库连接成功，开始加载数据...')
        
        // 加载所有数据
        await loadAllData()
        
        // 加载歌手筛选器选项
        loadSingerFilterOptions()
        
        // 渲染所有演唱会
        renderConcerts()
        
        console.log('投票页面初始化完成')
    } catch (error) {
        console.error('投票页面初始化错误:', error)
        showError('数据加载失败，请检查控制台查看详细错误信息')
    }
})

// 加载所有数据
async function loadAllData() {
    try {
        // 加载歌手数据
        const { data: singers, error: singersError } = await supabase
            .from(TABLES.SINGERS)
            .select('*')
            .order('name')
        
        if (singersError) throw singersError
        singersData = singers || []
        
        // 加载演唱会数据（包含歌手信息）
        const { data: concerts, error: concertsError } = await supabase
            .from(TABLES.CONCERTS)
            .select(`*, ${TABLES.SINGERS}(name, genre, avatar)`)
            .order('date', { ascending: false })
        
        if (concertsError) throw concertsError
        concertsData = concerts || []
        
        // 加载投票数据（用于检查是否已投票）
        const { data: votes, error: votesError } = await supabase
            .from(TABLES.VOTES)
            .select('*')
        
        if (votesError) throw votesError
        votesData = votes || []
        
    } catch (error) {
        console.error('加载数据错误:', error)
        throw error
    }
}

// 加载歌手筛选器选项
function loadSingerFilterOptions() {
    const singerFilter = document.getElementById('singerFilter')
    
    // 清空现有选项（保留"全部歌手"）
    singerFilter.innerHTML = '<option value="">全部歌手</option>'
    
    // 添加歌手选项
    singersData.forEach(singer => {
        const option = document.createElement('option')
        option.value = singer.id
        option.textContent = singer.name
        singerFilter.appendChild(option)
    })
}

// 应用筛选器
window.applyFilters = function() {
    const singerId = document.getElementById('singerFilter').value
    const genre = document.getElementById('genreFilter').value
    
    renderConcerts(singerId, genre)
}

// 渲染演唱会列表
function renderConcerts(singerId = '', genre = '') {
    const concertsListContainer = document.getElementById('concertsList')
    
    // 筛选演唱会
    let filteredConcerts = concertsData
    
    if (singerId) {
        filteredConcerts = filteredConcerts.filter(concert => concert.singer_id == singerId)
    }
    
    if (genre) {
        filteredConcerts = filteredConcerts.filter(concert => concert.singers && concert.singers.genre === genre)
    }
    
    if (filteredConcerts.length === 0) {
        concertsListContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-music fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">暂无符合条件的演唱会</h5>
                <p class="text-muted">请尝试调整筛选条件</p>
            </div>
        `
        return
    }
    
    concertsListContainer.innerHTML = filteredConcerts.map(concert => {
        const singer = concert.singers
        const hasVoted = checkHasVoted(concert.id)
        const userRating = getVotedRating(concert.id)
        
        return `
            <div class="card vote-card mb-4">
                <div class="card-body">
                    <div class="row">
                        <!-- 演唱会海报 -->
                        <div class="col-md-3 mb-3">
                            <img src="${concert.poster}" alt="${concert.title}" class="concert-poster w-100">
                        </div>
                        
                        <!-- 演唱会信息 -->
                        <div class="col-md-6">
                            <h5 class="card-title">${concert.title}</h5>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-user me-1"></i>歌手：${singer ? singer.name : '未知'}
                                    </small>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-music me-1"></i>曲风：${singer ? singer.genre : '未知'}
                                    </small>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>日期：${formatDate(concert.date)}
                                    </small>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-map-marker-alt me-1"></i>场馆：${concert.venue}
                                    </small>
                                </div>
                            </div>
                            
                            <!-- 评分选择 -->
                            <div class="mt-3">
                                <label class="form-label">请评分：</label>
                                <div class="rating-stars">
                                    ${[1, 2, 3, 4, 5].map(rating => {
                                        const isActive = selectedRatings[concert.id] === rating || userRating === rating
                                        const isDisabled = hasVoted
                                        return `
                                            <button type="button" 
                                                    class="rating-btn ${isActive ? 'active' : ''}" 
                                                    ${isDisabled ? 'disabled' : ''}
                                                    onclick="selectRating(${concert.id}, ${rating})"
                                                    data-rating="${rating}">
                                                ${rating}分<br>
                                                <small>${getRatingLabel(rating)}</small>
                                            </button>
                                        `
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- 投票按钮和统计 -->
                        <div class="col-md-3 d-flex flex-column justify-content-between">
                            <div>
                                <button class="btn btn-primary w-100 mb-2" 
                                        id="voteBtn${concert.id}"
                                        onclick="submitVote(${concert.id})"
                                        ${hasVoted ? 'disabled' : ''}>
                                    ${hasVoted ? '已投票' : '确认投票'}
                                </button>
                                
                                ${hasVoted ? `
                                    <div class="text-center text-success">
                                        <i class="fas fa-check-circle me-1"></i>
                                        <small>您已投 ${userRating} 分</small>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <!-- 演唱会统计 -->
                            <div class="text-center">
                                <small class="text-muted">
                                    <i class="fas fa-vote-yea me-1"></i>
                                    已收到 ${getConcertVoteCount(concert.id)} 票
                                </small>
                                <br>
                                <small class="text-muted">
                                    <i class="fas fa-star me-1"></i>
                                    平均 ${getConcertAvgRating(concert.id)} 分
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// 获取评分标签
function getRatingLabel(rating) {
    const labels = {
        1: '不满意',
        2: '一般',
        3: '良好',
        4: '优秀',
        5: '超棒'
    }
    return labels[rating] || '未知'
}

// 选择评分
window.selectRating = function(concertId, rating) {
    if (checkHasVoted(concertId)) {
        showAlert('warning', '您已给这场演唱会投过票啦！')
        return
    }
    
    selectedRatings[concertId] = rating
    
    // 更新按钮状态
    const voteBtn = document.getElementById(`voteBtn${concertId}`)
    if (voteBtn) {
        voteBtn.disabled = false
    }
    
    // 更新评分按钮样式
    document.querySelectorAll(`button[onclick*="selectRating(${concertId}"]`).forEach(btn => {
        btn.classList.remove('active')
        if (btn.dataset.rating == rating) {
            btn.classList.add('active')
        }
    })
}

// 提交投票
window.submitVote = async function(concertId) {
    const rating = selectedRatings[concertId]
    
    if (!rating) {
        showAlert('warning', '请先选择评分')
        return
    }
    
    if (checkHasVoted(concertId)) {
        showAlert('warning', '您已给这场演唱会投过票啦！')
        return
    }
    
    try {
        // 使用匿名投票（不记录用户信息）
        const { error } = await supabase
            .from(TABLES.VOTES)
            .insert([{
                concert_id: concertId,
                rating: rating,
                vote_time: new Date().toISOString()
            }])
        
        if (error) throw error
        
        // 记录投票状态到本地存储
        localStorage.setItem(`voted_concert_${concertId}`, 'true')
        
        // 添加到投票数据中
        votesData.push({
            concert_id: concertId,
            rating: rating
        })
        
        // 显示成功消息
        showAlert('success', '投票成功！感谢您的参与～')
        
        // 更新页面状态
        renderConcerts()
        
    } catch (error) {
        console.error('投票失败:', error)
        showAlert('danger', '投票失败，请稍后重试')
    }
}

// 检查是否已投票
function checkHasVoted(concertId) {
    // 检查本地存储
    if (localStorage.getItem(`voted_concert_${concertId}`)) {
        return true
    }
    
    // 检查投票数据（双重保险）
    return votesData.some(vote => vote.concert_id === concertId)
}

// 获取已投票的评分
function getVotedRating(concertId) {
    const vote = votesData.find(vote => vote.concert_id === concertId)
    return vote ? vote.rating : null
}

// 获取演唱会投票数
function getConcertVoteCount(concertId) {
    return votesData.filter(vote => vote.concert_id === concertId).length
}

// 获取演唱会平均评分
function getConcertAvgRating(concertId) {
    const concertVotes = votesData.filter(vote => vote.concert_id === concertId)
    if (concertVotes.length === 0) return '0.0'
    
    const avg = concertVotes.reduce((sum, vote) => sum + vote.rating, 0) / concertVotes.length
    return avg.toFixed(1)
}

// 显示提示消息
function showAlert(type, message) {
    const alertDiv = document.getElementById('voteAlert')
    const alertMessage = document.getElementById('alertMessage')
    
    alertDiv.className = `alert alert-${type}`
    alertMessage.textContent = message
    alertDiv.style.display = 'block'
    
    // 3秒后自动隐藏
    setTimeout(() => {
        alertDiv.style.display = 'none'
    }, 3000)
}

// 显示错误信息
function showError(message) {
    const container = document.querySelector('.container')
    const alertDiv = document.createElement('div')
    alertDiv.className = 'alert alert-danger alert-dismissible fade show'
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <br><small>如果问题持续存在，请检查 Supabase 项目配置是否正确</small>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    container.insertBefore(alertDiv, container.firstChild)
    
    // 隐藏加载动画
    const loadingElements = document.querySelectorAll('.loading')
    loadingElements.forEach(el => el.style.display = 'none')
}