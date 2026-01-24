
// Constants
const STORAGE_KEY_GOAL = 'writer_dashboard_goal';
const STORAGE_KEY_LOGS = 'writer_dashboard_logs';

// State
let goal = null;
let logs = [];
let chart = null;

// DOM Elements
const els = {
    settingsModal: document.getElementById('settingsModal'),
    settingsForm: document.getElementById('settingsForm'),
    logForm: document.getElementById('logForm'),
    settingsBtn: document.getElementById('settingsBtn'),
    closeBtn: document.querySelector('.close-btn'),
    // Metrics
    progressPercent: document.getElementById('progressPercent'),
    progressCount: document.getElementById('progressCount'),
    daysLeft: document.getElementById('daysLeft'),
    deadlineDate: document.getElementById('deadlineDate'),
    successRate: document.getElementById('successRate'),
    riskLevel: document.getElementById('riskLevel'),
    estimatedDate: document.getElementById('estimatedDate'),
    earlyDays: document.getElementById('earlyDays'),
    // Inputs
    totalGoal: document.getElementById('totalGoal'),
    startDate: document.getElementById('startDate'),
    deadline: document.getElementById('deadline'),
    maxPerDay: document.getElementById('maxPerDay'),
    logDate: document.getElementById('logDate'),
    logCount: document.getElementById('logCount'),
};

// Initialize
function init() {
    loadData();
    setupEventListeners();
    
    if (!goal) {
        openSettings();
    } else {
        updateDashboard();
    }

    // Set default log date to today
    els.logDate.valueAsDate = new Date();
}

// Data Management
function loadData() {
    const goalData = localStorage.getItem(STORAGE_KEY_GOAL);
    const logsData = localStorage.getItem(STORAGE_KEY_LOGS);

    if (goalData) goal = JSON.parse(goalData);
    if (logsData) logs = JSON.parse(logsData);
    
    // Convert date strings to objects in logs for sorting if needed, 
    // but string comparison works for ISO dates (YYYY-MM-DD)
    logs.sort((a, b) => a.date.localeCompare(b.date));
}

function saveData() {
    if (goal) localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(goal));
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
}

// Core Logic
function calculateMetrics() {
    if (!goal) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(goal.startDate);
    const end = new Date(goal.deadline);
    
    const totalDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(1, (today - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, (end - today) / (1000 * 60 * 60 * 24));
    
    const currentTotal = logs.reduce((sum, log) => sum + log.count, 0);
    const remainingCount = Math.max(0, goal.total - currentTotal);
    
    // Velocity (average per day)
    // Avoid division by zero, min 1 day
    const effectiveElapsed = elapsedDays < 1 ? 1 : elapsedDays; 
    const currentVelocity = currentTotal / effectiveElapsed;
    
    // Required Velocity
    const requiredVelocity = remainingDays > 0 ? remainingCount / remainingDays : (remainingCount > 0 ? Infinity : 0);
    
    // Success Probability
    // If completed, 100%
    // If deadline passed and not completed, 0%
    let probability = 0;
    if (remainingCount <= 0) {
        probability = 100;
    } else if (remainingDays <= 0) {
        probability = 0;
    } else {
        // Base probability on velocity ratio
        let velRatio = currentVelocity / requiredVelocity;
        
        // Capped at 1.0 logic, but let's make it a percentage
        // If we are faster than required, prob is high.
        // If we are slower, prob drops.
        
        // Adjust for max per day constraint
        // If required velocity > maxPerDay, probability drops significantly
        if (requiredVelocity > goal.maxPerDay) {
            velRatio = velRatio * (goal.maxPerDay / requiredVelocity);
        }
        
        probability = Math.min(100, Math.max(0, velRatio * 100));
        
        // Nonlinear adjustment: it gets harder to catch up
        // Simple linear for now is fine, maybe sigmoid later if requested
    }
    
    // Estimated Completion
    let estimateDays = 0;
    if (currentVelocity > 0) {
        estimateDays = remainingCount / currentVelocity;
    } else {
        estimateDays = 9999; // Infinity placeholder
    }
    
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + Math.ceil(estimateDays));
    
    // Early / Delayed
    const diffDays = (end - estimatedDate) / (1000 * 60 * 60 * 24);
    
    return {
        currentTotal,
        totalDays,
        elapsedDays,
        remainingDays,
        currentVelocity,
        requiredVelocity,
        probability,
        estimatedDate,
        diffDays
    };
}

function updateDashboard() {
    if (!goal) return;
    
    const metrics = calculateMetrics();
    
    // Update Text Metrics
    const percent = Math.min(100, (metrics.currentTotal / goal.total) * 100).toFixed(1);
    els.progressPercent.textContent = `${percent}%`;
    els.progressCount.textContent = `${metrics.currentTotal} / ${goal.total} 편`;
    
    els.daysLeft.textContent = `${Math.ceil(metrics.remainingDays)}일`;
    els.deadlineDate.textContent = `마감: ${goal.deadline}`; // Simple string
    
    els.successRate.textContent = `${metrics.probability.toFixed(1)}%`;
    
    // Risk Level Analysis
    let risk = '';
    let color = '';
    if (metrics.currentTotal >= goal.total) {
        risk = '달성 완료!';
        color = 'var(--success-color)';
    } else if (metrics.probability >= 90) {
        risk = '아주 좋음';
        color = 'var(--success-color)';
    } else if (metrics.probability >= 70) {
        risk = '안정적';
        color = 'var(--accent-color)';
    } else if (metrics.probability >= 40) {
        risk = '주의 필요';
        color = 'var(--warning-color)';
    } else {
        risk = '위험';
        color = 'var(--danger-color)';
    }
    els.riskLevel.textContent = risk;
    els.successRate.style.color = color;
    
    // Estimation
    if (metrics.currentTotal >= goal.total) {
        els.estimatedDate.textContent = '-';
        els.earlyDays.textContent = '완료됨';
    } else if (metrics.currentVelocity === 0) {
        els.estimatedDate.textContent = '예측 불가';
        els.earlyDays.textContent = '데이터 부족';
    } else {
        els.estimatedDate.textContent = metrics.estimatedDate.toLocaleDateString();
        const diff = Math.ceil(metrics.diffDays);
        if (diff > 0) {
            els.earlyDays.textContent = `${diff}일 조기 달성 예상`;
            els.earlyDays.style.color = 'var(--success-color)';
        } else if (diff < 0) {
            els.earlyDays.textContent = `${Math.abs(diff)}일 지연 예상`;
            els.earlyDays.style.color = 'var(--danger-color)';
        } else {
            els.earlyDays.textContent = '마감일 딱 맞춤';
            els.earlyDays.style.color = 'var(--text-secondary)';
        }
    }
    
    renderChart(metrics);
}

function renderChart(metrics) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Prepare Data
    // We want a line chart showing:
    // 1. Ideal Path (Start 0 to Goal Total)
    // 2. Actual Progress (Accumulated logs)
    // 3. Projected Path (From current to estimated end)
    
    const start = new Date(goal.startDate);
    const end = new Date(goal.deadline);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const labels = [];
    const idealData = [];
    const actualData = [];
    
    // Generate dates from start to max(end, estimatedEnd)
    // For simplicity, let's visualize start to deadline initially
    // Or maybe slightly past deadline if delayed.
    
    let currentDate = new Date(start);
    let dayCount = 0;
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const dailyTarget = goal.total / totalDays;
    
    // Create map for logs for easy lookup
    const logMap = {};
    logs.forEach(l => {
        logMap[l.date] = (logMap[l.date] || 0) + l.count;
    });
    
    let accumActual = 0;
    
    while(currentDate <= end || currentDate <= today) { // Show up to today or deadline
        const dateStr = currentDate.toISOString().split('T')[0];
        labels.push(dateStr.substring(5)); // MM-DD
        
        // Ideal
        let idealY = Math.min(goal.total, dailyTarget * dayCount);
        idealData.push(idealY);
        
        // Actual
        if (currentDate <= today) {
            if (logMap[dateStr]) {
                accumActual += logMap[dateStr];
            }
            actualData.push(accumActual);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
        
        if (dayCount > 365) break; // Safety break
    }
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '목표 (Ideal)',
                    data: idealData,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.1
                },
                {
                    label: '실제 달성 (Actual)',
                    data: actualData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#a0a4ab' }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#a0a4ab' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a4ab', maxTicksLimit: 10 }
                }
            }
        }
    });
}


// Event Listeners
function setupEventListeners() {
    els.settingsBtn.addEventListener('click', openSettings);
    els.closeBtn.addEventListener('click', closeSettings);
    
    window.addEventListener('click', (e) => {
        if (e.target === els.settingsModal) closeSettings();
    });
    
    els.settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
    });
    
    els.logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addLog();
    });
}

function openSettings() {
    if (goal) {
        els.totalGoal.value = goal.total;
        els.startDate.value = goal.startDate;
        els.deadline.value = goal.deadline;
        els.maxPerDay.value = goal.maxPerDay;
    } else {
        // Default suggestions
        els.startDate.valueAsDate = new Date();
    }
    els.settingsModal.style.display = 'flex';
}

function closeSettings() {
    if (!goal) {
        alert('목표를 먼저 설정해주세요!');
        return;
    }
    els.settingsModal.style.display = 'none';
}

function saveSettings() {
    goal = {
        total: parseFloat(els.totalGoal.value),
        startDate: els.startDate.value,
        deadline: els.deadline.value,
        maxPerDay: parseFloat(els.maxPerDay.value)
    };
    saveData();
    closeSettings();
    updateDashboard();
}

function addLog() {
    const date = els.logDate.value;
    const count = parseFloat(els.logCount.value);
    
    if (!date || isNaN(count)) return;
    
    // Check if log for this date already exists
    const existingIndex = logs.findIndex(l => l.date === date);
    if (existingIndex >= 0) {
        if(confirm('이미 해당 날짜에 기록이 있습니다. 덮어쓰시겠습니까? (취소 시 추가됨)')) {
            logs[existingIndex].count = count;
        } else {
            logs[existingIndex].count += count;
        }
    } else {
        logs.push({ date, count });
    }
    
    saveData();
    els.logForm.reset();
    els.logDate.valueAsDate = new Date(); // Reset date to today
    updateDashboard();
}

// Start
init();
