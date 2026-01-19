"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from "recharts";
import { TrendingUp, Users, DollarSign, Wallet } from "lucide-react";

interface DashboardStats {
    totals: {
        totalRevenue: string;
        netProfit: string;
        activeStudents: number;
        newStudents: number;
        reportingBranches: number;
    };
    rankings: {
        revenue: any[];
        profit: any[];
    };
    trend: any[];
}

import BranchSearch from "@/components/dashboard/BranchSearch";
import { MOCK_DASHBOARD_STATS } from "@/lib/mockData";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const url = selectedBranchId
                    ? `/api/dashboard/stats?branchId=${selectedBranchId}`
                    : "/api/dashboard/stats";

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    // Fallback for static demo
                    console.log("Using Mock Data");
                    setStats(MOCK_DASHBOARD_STATS as any);
                }
            } catch (e) {
                console.error("Dashboard fetch error - Using Mock Data", e);
                setStats(MOCK_DASHBOARD_STATS as any);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [selectedBranchId]);

    if (!stats && !loading) return <div className="p-8 text-center text-gray-500">데이터가 없습니다.</div>;
    if (loading && !stats) return <div className="p-8 text-center text-gray-500">로딩 중...</div>;

    const { totals, trend, rankings } = stats!;

    const cardData = [
        {
            title: "총 매출 (월)",
            value: `${Number(totals.totalRevenue).toLocaleString()}원`,
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-100",
            desc: selectedBranchId ? "지점 매출 합계" : `${totals.reportingBranches}개 지점 합계`
        },
        {
            title: "순이익 (월)",
            value: `${Number(totals.netProfit).toLocaleString()}원`,
            icon: Wallet,
            color: "text-green-600",
            bg: "bg-green-100",
            desc: "수익률 30% 목표"
        },
        {
            title: "전체 재원생",
            value: `${totals.activeStudents.toLocaleString()}명`,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100",
            desc: `신규 ${totals.newStudents}명`
        },
        {
            title: "전월 대비 성장",
            value: "+5.2%",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-100",
            desc: "지속 성장 중"
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">전체 대시보드</h1>
                    <p className="text-sm text-gray-500 mt-1">2024년 1월 기준 학원 운영 현황 요약입니다.</p>
                </div>
                <BranchSearch onSelectBranch={setSelectedBranchId} />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                Updated Now
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">월별 매출 추이</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="yearMonth"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString("ko-KR", { month: 'short' })}
                                />
                                <YAxis
                                    tickFormatter={(val) => `${(val / 100000000).toFixed(0)}억`}
                                />
                                <RechartsTooltip
                                    formatter={(value: any) => `${Number(value).toLocaleString()}원`}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long' })}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="totalRevenue" name="총매출" stroke="#2563eb" strokeWidth={2} />
                                <Line type="monotone" dataKey="netProfit" name="순이익" stroke="#16a34a" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Branches */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">매출 상위 지점 (Top 5)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rankings.revenue} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="branch.name"
                                    type="category"
                                    width={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <RechartsTooltip
                                    formatter={(value: any) => `${Number(value).toLocaleString()}원`}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="totalRevenue" name="매출액" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
