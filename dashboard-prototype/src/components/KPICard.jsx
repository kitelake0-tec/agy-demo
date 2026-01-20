import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, trend, trendValue, status = 'neutral' }) => {
    // status: neutral, positive, negative
    const trendClass = `kpi-trend ${status}`;

    return (
        <div className="kpi-card">
            <h3 className="kpi-title">{title}</h3>
            <div className="kpi-value">{value}</div>
            {trend && (
                <div className={trendClass}>
                    <span className="trend-icon">{status === 'positive' ? '▲' : status === 'negative' ? '▼' : '-'}</span>
                    <span className="trend-value">{trendValue}</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
