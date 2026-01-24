import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ==========================================
//  FIREBASE CONFIGURATION (사용자 설정 필요)
// ==========================================
// 주의: 아래 firebaseConfig 객체를 본인의 Firebase 프로젝트 설정값으로 교체해야 합니다.
const firebaseConfig = {
    apiKey: "AIzaSyB6xE89CZHT-UYZqJ4sOIMzKtGiy0acvFo",
    authDomain: "mywriterdash.firebaseapp.com",
    projectId: "mywriterdash",
    storageBucket: "mywriterdash.firebasestorage.app",
    messagingSenderId: "333261005574",
    appId: "1:333261005574:web:3026e25a681327054bb487",
    measurementId: "G-BVZLBD9PYR"
};

// Initialize Firebase
let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase Initialization Error:", e);
    alert("Firebase 설정이 올바르지 않습니다. app.js 파일을 열어 설정을 확인해주세요.");
}

// ==========================================
//  STATE MANAGEMENT
// ==========================================
let currentUser = null;
let projects = [];
let currentProject = null;
let chart = null;

// ==========================================
//  DOM ELEMENTS
// ==========================================
const views = {
    login: document.getElementById('login-view'),
    hub: document.getElementById('hub-view'),
    detail: document.getElementById('detail-view'),
};

const els = {
    // Auth
    googleLoginBtn: document.getElementById('googleLoginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userEmail: document.getElementById('userEmail'),

    // Hub
    projectList: document.getElementById('projectList'),
    addProjectBtn: document.getElementById('addProjectBtn'),
    totalProjectsCount: document.getElementById('totalProjectsCount'),
    avgProgress: document.getElementById('avgProgress'),
    riskCount: document.getElementById('riskCount'),

    // Detail - Header
    backToHubBtn: document.getElementById('backToHubBtn'),
    projectTitleDisplay: document.getElementById('projectTitleDisplay'),
    projectDateRangeDisplay: document.getElementById('projectDateRangeDisplay'),
    settingsBtn: document.getElementById('settingsBtn'),
    deleteProjectBtn: document.getElementById('deleteProjectBtn'),

    // Detail - Metrics
    progressPercent: document.getElementById('progressPercent'),
    progressCount: document.getElementById('progressCount'),
    daysLeft: document.getElementById('daysLeft'),
    deadlineDate: document.getElementById('deadlineDate'),
    successRate: document.getElementById('successRate'),
    riskLevel: document.getElementById('riskLevel'),
    estimatedDate: document.getElementById('estimatedDate'),
    earlyDays: document.getElementById('earlyDays'),

    // Detail - Inputs
    logForm: document.getElementById('logForm'),
    logDate: document.getElementById('logDate'),
    logCount: document.getElementById('logCount'),

    // Modal
    settingsModal: document.getElementById('settingsModal'),
    modalTitle: document.getElementById('modalTitle'),
    settingsForm: document.getElementById('settingsForm'),
    closeBtn: document.querySelector('.close-btn'),
    // Modal Inputs
    projectTitle: document.getElementById('projectTitle'),
    totalGoal: document.getElementById('totalGoal'),
    startDate: document.getElementById('startDate'),
    deadline: document.getElementById('deadline'),
    maxPerDay: document.getElementById('maxPerDay'),
};

// ==========================================
//  INIT & AUTH Logic
// ==========================================
function init() {
    setupEventListeners();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            els.userEmail.textContent = user.email;
            loadProjects();
        } else {
            currentUser = null;
            showView('login');
        }
    });

    // Default Date
    els.logDate.valueAsDate = new Date();
    els.startDate.valueAsDate = new Date();
}

function setupEventListeners() {
    // Auth
    els.googleLoginBtn.addEventListener('click', handleGoogleLogin);
    els.logoutBtn.addEventListener('click', handleLogout);

    // Hub
    els.addProjectBtn.addEventListener('click', () => openModal('add'));

    // Detail
    els.backToHubBtn.addEventListener('click', () => showView('hub'));
    els.settingsBtn.addEventListener('click', () => openModal('edit'));
    els.deleteProjectBtn.addEventListener('click', handleDeleteProject);

    els.logForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addLog();
    });

    // Modal
    els.closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === els.settingsModal) closeModal();
    });
    els.settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSaveProject();
    });
}

async function handleGoogleLogin() {
    constprovider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Error:", error);
        alert("로그인 중 오류가 발생했습니다: " + error.message);
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// ==========================================
//  VIEW MANAGEMENT
// ==========================================
function showView(viewName) {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    views[viewName].classList.remove('hidden');

    if (viewName === 'hub') {
        renderHub();
    }
}

// ==========================================
//  DATA LOGIC (Firestore)
// ==========================================
async function loadProjects() {
    if (!currentUser) return;

    try {
        const q = query(collection(db, "users", currentUser.uid, "projects"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        showView('hub');
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("데이터를 불러오는데 실패했습니다 (콘솔 확인 필요)");
    }
}

async function handleSaveProject() {
    const isEdit = currentProject && els.modalTitle.textContent === '목표 수정';

    const projectData = {
        title: els.projectTitle.value,
        total: parseFloat(els.totalGoal.value),
        startDate: els.startDate.value,
        deadline: els.deadline.value,
        maxPerDay: parseFloat(els.maxPerDay.value),
        logs: isEdit ? currentProject.logs : [] // Maintain logs if editing
    };

    try {
        if (isEdit) {
            const projectRef = doc(db, "users", currentUser.uid, "projects", currentProject.id);
            await updateDoc(projectRef, projectData);

            // Local Update
            currentProject = { ...currentProject, ...projectData };
            updateDashboard(); // Refresh detail view
        } else {
            projectData.created_at = new Date();
            await addDoc(collection(db, "users", currentUser.uid, "projects"), projectData);
            await loadProjects(); // Reload list
        }
        closeModal();
    } catch (error) {
        console.error("Save Error:", error);
        alert("저장 실패: " + error.message);
    }
}

async function handleDeleteProject() {
    if (!currentProject) return;
    if (!confirm(`'${currentProject.title}' 프로젝트를 정말 삭제하시겠습니까?`)) return;

    try {
        await deleteDoc(doc(db, "users", currentUser.uid, "projects", currentProject.id));
        currentProject = null;
        await loadProjects();
    } catch (error) {
        console.error("Delete Error:", error);
        alert("삭제 실패");
    }
}

async function addLog() {
    if (!currentProject) return;

    const date = els.logDate.value;
    const count = parseFloat(els.logCount.value);

    if (!date || isNaN(count)) return;

    let newLogs = [...(currentProject.logs || [])];

    // Check existing
    const idx = newLogs.findIndex(l => l.date === date);
    if (idx >= 0) {
        if (!confirm('이미 해당 날짜에 기록이 있습니다. 추가하시겠습니까? (취소 시 덮어쓰기 없음)')) return;
        newLogs[idx].count += count;
    } else {
        newLogs.push({ date, count });
    }

    // Sort
    newLogs.sort((a, b) => a.date.localeCompare(b.date));

    try {
        const projectRef = doc(db, "users", currentUser.uid, "projects", currentProject.id);
        await updateDoc(projectRef, { logs: newLogs });

        currentProject.logs = newLogs;
        updateDashboard();
        els.logForm.reset();
        els.logDate.valueAsDate = new Date();
    } catch (error) {
        console.error("Log Error:", error);
        alert("기록 실패");
    }
}

// ==========================================
//  UI RENDERING (Hub)
// ==========================================
function renderHub() {
    els.projectList.innerHTML = '';

    if (projects.length === 0) {
        els.projectList.innerHTML = '<p style="color:var(--text-secondary); grid-column:1/-1; text-align:center;">진행 중인 프로젝트가 없습니다. + 버튼을 눌러 추가해보세요.</p>';
        updateHubSummary();
        return;
    }

    projects.forEach(p => {
        const stats = calculateMetrics(p, false); // Light calc
        const percent = Math.min(100, (stats.currentTotal / p.total) * 100);

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div>
                <div class="project-title">${p.title}</div>
                <div class="project-meta">${p.deadline} 마감</div>
            </div>
            <div>
                <div class="project-bar-container">
                    <div class="project-bar" style="width: ${percent}%"></div>
                </div>
                <div class="project-status">
                    <span>${percent.toFixed(1)}%</span>
                    <span class="status-badge ${stats.probability < 40 ? 'status-shout' : ''}">
                        ${stats.probability.toFixed(0)}% 확률
                    </span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openProject(p));
        els.projectList.appendChild(card);
    });

    updateHubSummary();
}

function updateHubSummary() {
    els.totalProjectsCount.textContent = projects.length;

    if (projects.length === 0) {
        els.avgProgress.textContent = '-';
        els.riskCount.textContent = '-';
        return;
    }

    let totalPercent = 0;
    let risk = 0;

    projects.forEach(p => {
        const stats = calculateMetrics(p);
        totalPercent += Math.min(100, (stats.currentTotal / p.total) * 100);
        if (stats.probability < 40 && stats.remainingDays > 0) risk++;
    });

    els.avgProgress.textContent = (totalPercent / projects.length).toFixed(1) + '%';
    els.riskCount.textContent = risk;
    els.riskCount.style.color = risk > 0 ? 'var(--danger-color)' : 'var(--text-secondary)';
}

// ==========================================
//  UI RENDERING (Detail)
// ==========================================
function openProject(project) {
    currentProject = project;
    showView('detail');
    updateDashboard();
}

function updateDashboard() {
    if (!currentProject) return;

    els.projectTitleDisplay.textContent = currentProject.title;
    els.projectDateRangeDisplay.textContent = `${currentProject.startDate} ~ ${currentProject.deadline}`;

    const metrics = calculateMetrics(currentProject);

    // Update Text Metrics
    const percent = Math.min(100, (metrics.currentTotal / currentProject.total) * 100).toFixed(1);
    els.progressPercent.textContent = `${percent}%`;
    els.progressCount.textContent = `${metrics.currentTotal} / ${currentProject.total} 편`;

    els.daysLeft.textContent = `${Math.ceil(metrics.remainingDays)}일`;
    els.deadlineDate.textContent = `마감: ${currentProject.deadline}`;

    els.successRate.textContent = `${metrics.probability.toFixed(1)}%`;

    // Risk Level Analysis
    let risk = '';
    let color = '';
    if (metrics.currentTotal >= currentProject.total) {
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
    if (metrics.currentTotal >= currentProject.total) {
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

    renderChart(metrics, currentProject);
}

// Logic reused from previous version
function calculateMetrics(project) {
    const logs = project.logs || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(project.startDate);
    const end = new Date(project.deadline);

    const totalDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(1, (today - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, (end - today) / (1000 * 60 * 60 * 24));

    const currentTotal = logs.reduce((sum, log) => sum + log.count, 0);
    const remainingCount = Math.max(0, project.total - currentTotal);

    const effectiveElapsed = elapsedDays < 1 ? 1 : elapsedDays;
    const currentVelocity = currentTotal / effectiveElapsed;

    const requiredVelocity = remainingDays > 0 ? remainingCount / remainingDays : (remainingCount > 0 ? Infinity : 0);

    let probability = 0;
    if (remainingCount <= 0) {
        probability = 100;
    } else if (remainingDays <= 0) {
        probability = 0;
    } else {
        let velRatio = currentVelocity / requiredVelocity;
        if (requiredVelocity > project.maxPerDay) {
            velRatio = velRatio * (project.maxPerDay / requiredVelocity);
        }
        probability = Math.min(100, Math.max(0, velRatio * 100));
    }

    let estimateDays = 0;
    if (currentVelocity > 0) {
        estimateDays = remainingCount / currentVelocity;
    } else {
        estimateDays = 9999;
    }

    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + Math.ceil(estimateDays));
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

function renderChart(metrics, project) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const logs = project.logs || [];

    const start = new Date(project.startDate);
    const end = new Date(project.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels = [];
    const idealData = [];
    const actualData = [];

    let currentDate = new Date(start);
    let dayCount = 0;
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const dailyTarget = project.total / totalDays;

    const logMap = {};
    logs.forEach(l => {
        logMap[l.date] = (logMap[l.date] || 0) + l.count;
    });

    let accumActual = 0;

    while (currentDate <= end || currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        labels.push(dateStr.substring(5));

        let idealY = Math.min(project.total, dailyTarget * dayCount);
        idealData.push(idealY);

        if (currentDate <= today) {
            if (logMap[dateStr]) {
                accumActual += logMap[dateStr];
            }
            actualData.push(accumActual);
        }

        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;

        if (dayCount > 1000) break;
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
                legend: { labels: { color: '#a0a4ab' } }
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

// Helpers
function openModal(mode) {
    els.settingsModal.style.display = 'flex';
    if (mode === 'add') {
        els.modalTitle.textContent = '새 프로젝트 추가';
        els.settingsForm.reset();
        els.startDate.valueAsDate = new Date();
    } else if (currentProject) {
        els.modalTitle.textContent = '목표 수정';
        els.projectTitle.value = currentProject.title;
        els.totalGoal.value = currentProject.total;
        els.startDate.value = currentProject.startDate;
        els.deadline.value = currentProject.deadline;
        els.maxPerDay.value = currentProject.maxPerDay;
    }
}

function closeModal() {
    els.settingsModal.style.display = 'none';
}

// Start
init();
