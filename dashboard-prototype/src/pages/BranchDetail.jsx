import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import KPICard from '../components/KPICard';
import './BranchDetail.css';

const BranchDetail = () => {
    const { branchId } = useParams();
    const navigate = useNavigate();

    const branch = useMemo(() => {
        return MOCK_DATA.find(b => b.id === branchId);
    }, [branchId]);

    if (!branch) {
        return <div className="detail-error">지점을 찾을 수 없습니다. <button onClick={() => navigate('/branches')}>목록으로 돌아가기</button></div>;
    }

    return (
        <div className="branch-detail">
            <header className="detail-header">
                <button onClick={() => navigate('/branches')} className="back-btn">← 목록으로</button>
                <div className="header-content">
                    <h1>{branch.name}</h1>
                    <span className={`detail-badge ${branch.status}`}>
                        {branch.status === 'normal' ? '정상 운영' : branch.status === 'warning' ? '주의 필요' : '위험 발생'}
                    </span>
                </div>
                <div className="detail-meta">
                    <span>지역: {branch.region}</span>
                    <span>ID: {branch.id}</span>
                </div>
            </header>

            <div className="detail-grid">
                <section className="detail-section">
                    <h3>매출 분석</h3>
                    <KPICard title="일간 매출" value={branch.sales.toLocaleString() + '원'} trend={true} trendValue="+2.5%" status="positive" />
                    {/* Placeholder for chart */}
                    <div className="chart-placeholder">매출 추이 그래프 (Coming Soon)</div>
                </section>

                <section className="detail-section">
                    <h3>좌석 현황</h3>
                    <KPICard title="실시간 점유율" value={branch.seats.rate + '%'} status={branch.seats.rate > 80 ? 'positive' : 'neutral'} />
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="label">총 좌석</span>
                            <span className="value">{branch.seats.total}석</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">사용 중</span>
                            <span className="value">{branch.seats.occupied}석</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">공석</span>
                            <span className="value">{branch.seats.total - branch.seats.occupied}석</span>
                        </div>
                    </div>
                </section>

                <section className="detail-section">
                    <h3>환불 / 리스크</h3>
                    <KPICard title="환불율" value={branch.refunds.rate + '%'} status={branch.refunds.rate > 5 ? 'negative' : 'positive'} />
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="label">환불 건수</span>
                            <span className="value">{branch.refunds.count}건</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BranchDetail;
