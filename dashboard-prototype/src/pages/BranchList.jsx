import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { MOCK_DATA } from '../data/mockData';
import './BranchList.css';

const BranchList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredData = useMemo(() => {
        return MOCK_DATA.filter(branch => {
            const matchesSearch = branch.name.includes(searchTerm) || branch.region.includes(searchTerm);
            const matchesStatus = filterStatus === 'all' || branch.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    const columns = [
        { header: '지점명', accessor: 'name' },
        { header: '지역', accessor: 'region' },
        { header: '매출', accessor: 'sales', render: r => r.sales.toLocaleString() },
        { header: '점유율', accessor: 'seats', render: r => r.seats.rate + '%' },
        { header: '환불건', accessor: 'refunds', render: r => r.refunds.count },
        {
            header: '상태', accessor: 'status', render: (row) => (
                <span className={`status-badge ${row.status}`}>
                    {row.status === 'normal' ? '정상' : row.status === 'warning' ? '주의' : '위험'}
                </span>
            )
        }
    ];

    return (
        <div className="branch-list-page">
            <header className="page-header">
                <h2>지점 목록</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="지점명 또는 지역 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-select"
                    >
                        <option value="all">전체 상태</option>
                        <option value="normal">정상</option>
                        <option value="warning">주의</option>
                        <option value="danger">위험</option>
                    </select>
                </div>
            </header>

            <div className="table-wrapper">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    onRowClick={(row) => navigate(`/branch/${row.id}`)}
                />
            </div>
        </div>
    );
};

export default BranchList;
