
export const MOCK_DASHBOARD_STATS = {
    totals: {
        totalRevenue: "452500000",
        netProfit: "135750000",
        activeStudents: 1250,
        newStudents: 45,
        reportingBranches: 8
    },
    rankings: {
        revenue: [
            { branch: { name: "강남 본점" }, totalRevenue: 154000000 },
            { branch: { name: "서초점" }, totalRevenue: 98000000 },
            { branch: { name: "송파점" }, totalRevenue: 85000000 },
            { branch: { name: "분당점" }, totalRevenue: 72000000 },
            { branch: { name: "목동점" }, totalRevenue: 43500000 },
        ],
        profit: []
    },
    trend: [
        { yearMonth: "2023-08", totalRevenue: 380000000, netProfit: 114000000 },
        { yearMonth: "2023-09", totalRevenue: 395000000, netProfit: 118500000 },
        { yearMonth: "2023-10", totalRevenue: 410000000, netProfit: 123000000 },
        { yearMonth: "2023-11", totalRevenue: 405000000, netProfit: 121500000 },
        { yearMonth: "2023-12", totalRevenue: 435000000, netProfit: 130500000 },
        { yearMonth: "2024-01", totalRevenue: 452500000, netProfit: 135750000 },
    ]
};
