"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define interface for KPI data
interface KPI {
    id: number;
    yearMonth: string;
    totalRevenue: string;
    tuitionRevenue: string;
    consultingRevenue: string;
    otherRevenue: string;
    operatingCost: string;
    netProfit: string;
    activeStudents: number;
    newStudents: number;
    dropoutStudents: number;
}

interface BranchDetail {
    id: number;
    name: string;
    monthlyKpis: KPI[];
}

export default function BranchDetailPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params);
    const router = useRouter();

    const [branch, setBranch] = useState<BranchDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        yearMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
        tuitionRevenue: 0,
        consultingRevenue: 0,
        otherRevenue: 0,
        operatingCost: 0,
        activeStudents: 0,
        newStudents: 0,
        dropoutStudents: 0
    });

    useEffect(() => {
        fetchBranchDetail();
    }, [branchId]);

    const fetchBranchDetail = async () => {
        try {
            const res = await fetch(`/api/kpi?branchId=${branchId}`);
            if (res.ok) {
                const data = await res.json();
                // The API returns a list of KPIs with branch included. 
                // We need to struct it slightly differently or just take the branch info from the first record
                // actually /api/kpi returns list of KPIs. Let's assume we fetch KPIs and we might need a separate call for branch name if no KPIs exist.
                // For simplicity, let's fetch /api/branches?id=X if needed, but looking at /api/kpi implementation:
                // include: { branch: true } is there.

                if (data.length > 0) {
                    setBranch({
                        id: data[0].branchId,
                        name: data[0].branch.name,
                        monthlyKpis: data
                    });
                } else {
                    // Fallback if no KPIs, try to fetch branch info. 
                    // For this demo, we might just show "No Data" or fetch branch name separately.
                    // Let's quickly double check /api/branches implementation. It returns list.
                    // We'll skip complex fallback for now and assume data or just show ID.
                    setBranch({
                        id: Number(branchId),
                        name: `지점 #${branchId}`,
                        monthlyKpis: []
                    });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/kpi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    branchId,
                    ...formData
                })
            });

            if (res.ok) {
                setIsEditing(false);
                fetchBranchDetail(); // Refresh
            } else {
                alert("저장 실패");
            }
        } catch (e) {
            console.error(e);
            alert("오류 발생");
        }
    };

    if (loading) return <div className="p-8 text-center">로딩 중...</div>;
    if (!branch) return <div className="p-8 text-center">지점을 찾을 수 없습니다.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/branches" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{branch.name}</h1>
                        <p className="text-sm text-gray-500">지점 상세 정보 및 월별 데이터 관리</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isEditing ? <ArrowLeft className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isEditing ? "돌아가기" : "데이터 추가"}
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">월별 데이터 입력</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">년월</label>
                                <input
                                    type="month"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    value={formData.yearMonth}
                                    onChange={e => setFormData({ ...formData, yearMonth: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">재원생 수</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    value={formData.activeStudents}
                                    onChange={e => setFormData({ ...formData, activeStudents: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">매출 정보</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">수강료 매출</label>
                                    <input type="number" className="mt-1 block w-full border p-2 rounded-md" value={formData.tuitionRevenue} onChange={e => setFormData({ ...formData, tuitionRevenue: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">컨설팅 매출</label>
                                    <input type="number" className="mt-1 block w-full border p-2 rounded-md" value={formData.consultingRevenue} onChange={e => setFormData({ ...formData, consultingRevenue: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">기타 매출</label>
                                    <input type="number" className="mt-1 block w-full border p-2 rounded-md" value={formData.otherRevenue} onChange={e => setFormData({ ...formData, otherRevenue: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">운영비</label>
                                    <input type="number" className="mt-1 block w-full border p-2 rounded-md" value={formData.operatingCost} onChange={e => setFormData({ ...formData, operatingCost: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                저장하기
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">년월</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">총매출</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">운영비</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">순이익</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">재원생</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {branch.monthlyKpis.map((kpi) => (
                                <tr key={kpi.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(kpi.yearMonth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        {Number(kpi.totalRevenue).toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                        -{Number(kpi.operatingCost).toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                                        {Number(kpi.netProfit).toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        {kpi.activeStudents}명
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
