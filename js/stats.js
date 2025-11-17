// 统计分析页面逻辑
import { supabase, TABLES } from './supabase.js'

// 全局变量
let concertsData = []
let singersData = []
let votesData = []
let statsData = []
let currentSort = { field: 'avg_rating', direction: 'desc' }
let currentPage = 1
const pageSize = 10

// Chart.js 实例
let ratingDistributionChart = null
let genreRatingChart = null
let topConcertsChart = null

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('统计分析页面初始化...')
    
    try {
        // 加载所有数据
        await loadAllData()
        
        // 计算统计数据
        calculateStats()
        
        // 初始化图表
        initCharts()
        
        // 渲染表格
        renderTable()
        
        console.log('统计分析页面初始化完成')
    } catch (error) {
        console.error('统计分析页面初始化错误:', error)
        showError('数据加载失败，请刷新页面重试')
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
        
        // 加载投票数据
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

// 计算统计数据
function calculateStats() {
    statsData = concertsData.map(concert => {
        const singer = concert.singers
        const concertVotes = votesData.filter(vote => vote.concert_id === concert.id)
        
        // 计算演唱会统计
        const voteCount = concertVotes.length
        const avgRating = voteCount > 0 
            ? (concertVotes.reduce((sum, vote) => sum + vote.rating, 0) / voteCount).toFixed(1)
            : 0
        const maxRating = voteCount > 0 
            ? Math.max(...concertVotes.map(vote => vote.rating))
            : 0
        const minRating = voteCount > 0 
            ? Math.min(...concertVotes.map(vote => vote.rating))
            : 0
        
        return {
            concert_id: concert.id,
            concert_title: concert.title,
            singer_name: singer ? singer.name : '未知',
            genre: singer ? singer.genre : '未知',
            vote_count: voteCount,
            avg_rating: parseFloat(avgRating),
            max_rating: maxRating,
            min_rating: minRating,
            date: concert.date,
            venue: concert.venue
        }
    }).filter(stat => stat.vote_count > 0) // 只显示有投票的数据
}

// 初始化图表
function initCharts() {
    createRatingDistributionChart()
    createGenreRatingChart()
    createTopConcertsChart()
}

// 创建评分分布饼图
function createRatingDistributionChart() {
    const ctx = document.getElementById('ratingDistributionChart').getContext('2d')
    
    // 计算各评分段的投票数
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    votesData.forEach(vote => {
        ratingCounts[vote.rating]++
    })
    
    const data = {
        labels: ['1分 - 不满意', '2分 - 一般', '3分 - 良好', '4分 - 优秀', '5分 - 超棒'],
        datasets: [{
            data: Object.values(ratingCounts),
            backgroundColor: [
                '#dc3545', // 红色 - 1分
                '#ffc107', // 黄色 - 2分
                '#17a2b8', // 蓝色 - 3分
                '#28a745', // 绿色 - 4分
                '#007bff'  // 蓝色 - 5分
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    }
    
    ratingDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || ''
                            const value = context.raw
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = ((value / total) * 100).toFixed(1)
                            return `${label}: ${value}票 (${percentage}%)`
                        }
                    }
                }
            }
        }
    })
}

// 创建曲风评分对比柱状图
function createGenreRatingChart() {
    const ctx = document.getElementById('genreRatingChart').getContext('2d')
    
    // 按曲风分组计算平均评分
    const genreStats = {}
    statsData.forEach(stat => {
        if (!genreStats[stat.genre]) {
            genreStats[stat.genre] = {
                totalRating: 0,
                concertCount: 0
            }
        }
        genreStats[stat.genre].totalRating += stat.avg_rating
        genreStats[stat.genre].concertCount++
    })
    
    const genres = Object.keys(genreStats)
    const avgRatings = genres.map(genre => 
        (genreStats[genre].totalRating / genreStats[genre].concertCount).toFixed(1)
    )
    
    const data = {
        labels: genres,
        datasets: [{
            label: '平均评分',
            data: avgRatings,
            backgroundColor: '#667eea',
            borderColor: '#764ba2',
            borderWidth: 2,
            borderRadius: 8
        }]
    }
    
    genreRatingChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: '平均评分'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '曲风'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `平均评分: ${context.raw}分`
                        }
                    }
                }
            }
        }
    })
}

// 创建热门演唱会评分TOP10图表
function createTopConcertsChart() {
    const ctx = document.getElementById('topConcertsChart').getContext('2d')
    
    // 按平均评分排序，取前10名
    const topConcerts = [...statsData]
        .sort((a, b) => b.avg_rating - a.avg_rating || b.vote_count - a.vote_count)
        .slice(0, 10)
    
    const concertLabels = topConcerts.map(concert => 
        `${concert.singer_name} - ${concert.concert_title.substring(0, 15)}...`
    )
    const concertRatings = topConcerts.map(concert => concert.avg_rating)
    
    const data = {
        labels: concertLabels,
        datasets: [{
            label: '平均评分',
            data: concertRatings,
            backgroundColor: '#28a745',
            borderColor: '#20c997',
            borderWidth: 2,
            borderRadius: 4
        }]
    }
    
    topConcertsChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: '平均评分'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const concert = topConcerts[context[0].dataIndex]
                            return `${concert.singer_name} - ${concert.concert_title}`
                        },
                        label: function(context) {
                            const concert = topConcerts[context.dataIndex]
                            return [
                                `平均评分: ${context.raw}分`,
                                `投票数: ${concert.vote_count}票`,
                                `场馆: ${concert.venue}`
                            ]
                        }
                    }
                }
            }
        }
    })
}

// 渲染表格
function renderTable(searchTerm = '') {
    const tableBody = document.getElementById('statsTableBody')
    const tableInfo = document.getElementById('tableInfo')
    
    // 筛选数据
    let filteredData = statsData
    if (searchTerm) {
        filteredData = statsData.filter(stat => 
            stat.singer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stat.concert_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stat.genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }
    
    // 排序数据
    filteredData.sort((a, b) => {
        const aValue = a[currentSort.field]
        const bValue = b[currentSort.field]
        
        if (currentSort.direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
    })
    
    // 分页
    const totalPages = Math.ceil(filteredData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const pageData = filteredData.slice(startIndex, startIndex + pageSize)
    
    // 渲染表格内容
    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>没有找到匹配的数据</p>
                </td>
            </tr>
        `
    } else {
        tableBody.innerHTML = pageData.map((stat, index) => {
            const globalIndex = startIndex + index + 1
            
            return `
                <tr>
                    <td><span class="badge bg-primary">${globalIndex}</span></td>
                    <td><strong>${stat.singer_name}</strong></td>
                    <td>${stat.concert_title}</td>
                    <td><span class="badge bg-secondary">${stat.genre}</span></td>
                    <td><span class="text-primary">${stat.vote_count}</span></td>
                    <td>
                        <span class="badge bg-success">${stat.avg_rating.toFixed(1)}</span>
                        <div class="progress mt-1" style="height: 4px;">
                            <div class="progress-bar bg-success" 
                                 style="width: ${(stat.avg_rating / 5) * 100}%">
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-warning">${stat.max_rating}</span></td>
                    <td><span class="badge bg-danger">${stat.min_rating}</span></td>
                </tr>
            `
        }).join('')
    }
    
    // 更新表格信息
    tableInfo.textContent = `显示 ${startIndex + 1}-${startIndex + pageData.length} 条，共 ${filteredData.length} 条数据`
    
    // 渲染分页
    renderPagination(totalPages)
}

// 渲染分页控件
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination')
    
    if (totalPages <= 1) {
        pagination.innerHTML = ''
        return
    }
    
    let paginationHtml = ''
    
    // 上一页按钮
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">上一页</a>
        </li>
    `
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `
    }
    
    // 下一页按钮
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">下一页</a>
        </li>
    `
    
    pagination.innerHTML = paginationHtml
}

// 表格排序函数
window.sortTable = function(field, direction = null) {
    if (direction) {
        currentSort.field = field
        currentSort.direction = direction
    } else {
        // 切换排序方向
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc'
        } else {
            currentSort.field = field
            currentSort.direction = 'desc'
        }
    }
    
    // 重置到第一页
    currentPage = 1
    
    // 重新渲染表格
    renderTable(document.getElementById('searchInput').value)
}

// 改变页码
window.changePage = function(page) {
    if (page >= 1 && page <= Math.ceil(statsData.length / pageSize)) {
        currentPage = page
        renderTable(document.getElementById('searchInput').value)
    }
    return false
}

// 搜索表格
window.searchTable = function() {
    const searchTerm = document.getElementById('searchInput').value
    currentPage = 1
    renderTable(searchTerm)
}

// 显示错误信息
function showError(message) {
    const container = document.querySelector('.container')
    const alertDiv = document.createElement('div')
    alertDiv.className = 'alert alert-danger alert-dismissible fade show'
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    container.insertBefore(alertDiv, container.firstChild)
}

// 实时更新数据（可选功能）
function startRealTimeUpdates() {
    // 监听投票表的变化
    supabase
        .channel('stats')
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: TABLES.VOTES }, 
            async () => {
                console.log('检测到新投票，重新加载统计数据...')
                await loadAllData()
                calculateStats()
                
                // 销毁旧图表并重新创建
                if (ratingDistributionChart) ratingDistributionChart.destroy()
                if (genreRatingChart) genreRatingChart.destroy()
                if (topConcertsChart) topConcertsChart.destroy()
                
                initCharts()
                renderTable()
            }
        )
        .subscribe()
}

// 开始实时更新（可选，可以根据需要启用）
// startRealTimeUpdates()