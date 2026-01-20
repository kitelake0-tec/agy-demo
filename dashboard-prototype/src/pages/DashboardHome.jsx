import React, { useMemo } from 'react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import { MOCK_DATA } from '../data/mockData';
import './DashboardHome.css';

const DashboardHome = () => {
    // Logic to aggregate data
    const summary = useMemo(() => {
        const totalBranches = MOCK_DATA.length;
        const totalSales = MOCK_DATA.reduce((acc, curr) => acc + curr.sales, 0);
        const totalSeats = MOCK_DATA.reduce((acc, curr) => acc + curr.seats.total, 0);
        const occupiedSeats = MOCK_DATA.reduce((acc, curr) => acc + curr.seats.occupied, 0);
        const avgOccupancy = (occupiedSeats / totalSeats) * 100;
        const totalRefunds = MOCK_DATA.reduce((acc, curr) => acc + curr.refunds.count, 0);
        const refundRate = (totalRefunds / occupiedSeats) * 100; // Simplified

        return {
            totalBranches,
            totalSales,
            avgOccupancy,
            refundRate
        };
    }, []);

    // Outliers: Refund Rate > 5% or Occupancy < 20%
    const outliers = useMemo(() => {
        return MOCK_DATA.filter(b => b.status === 'warning' || b.status === 'danger')
            .sort((a, b) => b.refunds.rate - a.refunds.rate)
            .slice(0, 5);
    }, []);

    // Top/Bottom Branches by Sales
    const topBranches = useMemo(() => {
        return [...MOCK_DATA].sort((a, b) => b.sales - a.sales).slice(0, 5);
    }, []);

    const bottomBranches = useMemo(() => {
        return [...MOCK_DATA].sort((a, b) => a.sales - b.sales).slice(0, 5);
    }, []);

    const branchColumns = [
        { header: '지점명', accessor: 'name' },
        { header: '지역', accessor: 'region' },
        { header: '매출', accessor: 'sales', render: (row) => row.sales.toLocaleString() + '원' },
        { header: '점유율', accessor: 'seats', render: (row) => row.seats.rate + '%' },
        { header: '환불건', accessor: 'refunds', render: (row) => row.refunds.count + '건' },
        {
            header: '상태', accessor: 'status', render: (row) => (
                <span className={`status-badge ${row.status}`}>
                    {row.status === 'normal' ? '정상' : '주의'}
                </span>
            )
        }
    ];

    return (
        <div className="dashboard-home">
            <section className="kpi-grid">
                <KPICard
                    title="총 매출 (일간)"
                    value={summary.totalSales.toLocaleString() + '원'}
                    trend={true} trendValue="+12% (지난주 대비)" status="positive"
                />
                <KPICard
                    title="평균 점유율"
                    value={summary.avgOccupancy.toFixed(1) + '%'}
                    trend={true} trendValue="-1.2% (어제 대비)" status="negative"
                />
                <KPICard
                    title="환불율"
                    value={summary.refundRate.toFixed(2) + '%'}
                    trend={true} trendValue="+0.5%" status="warning"
                />
                <KPICard
                    title="전체 지점 수"
                    value={summary.totalBranches + '개'}
                />
            </section>

            <section className="dashboard-section warning-section">
                <h3 className="section-title">⚠️ 관리 필요 지점 (Top 5)</h3>
                <DataTable columns={branchColumns} data={outliers} />
            </section>

            <div className="split-section">
                <section className="dashboard-section">
                    <h3 className="section-title">🏆 매출 상위 5개 지점</h3>
                    <DataTable columns={branchColumns} data={topBranches} />
                </section>

                <section className="dashboard-section">
                    <h3 className="section-title">📉 매출 하위 5개 지점</h3>
                    <DataTable columns={branchColumns} data={bottomBranches} />
                </section>
            </div>
        </div>
    );
};

export default DashboardHome;
