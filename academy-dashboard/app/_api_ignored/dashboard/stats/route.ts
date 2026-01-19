import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const yearMonthStr = searchParams.get('yearMonth');
        const branchIdArg = searchParams.get('branchId');

        // Default to a specific date if not provided, or handle 'latest' logic
        const date = yearMonthStr ? new Date(yearMonthStr) : new Date('2024-01-01');

        const whereCondition: any = {
            yearMonth: date
        };

        if (branchIdArg && branchIdArg !== 'all') {
            whereCondition.branchId = Number(branchIdArg);
        }

        // 1. Global Totals for the Month
        const totals = await prisma.monthlyKpi.aggregate({
            where: whereCondition,
            _sum: {
                totalRevenue: true,
                netProfit: true,
                activeStudents: true,
                newStudents: true
            },
            _count: {
                id: true // Number of branches reporting
            }
        });

        // 2. Top 5 Branches by Revenue (Only useful if ALL branches are selected, but let's keep it consistent)
        // If a specific branch is selected, this will just return that one branch in the list
        const topByRevenue = await prisma.monthlyKpi.findMany({
            where: whereCondition,
            orderBy: { totalRevenue: 'desc' },
            take: 5,
            include: { branch: true }
        });

        // 3. Top 5 Branches by Net Profit
        const topByProfit = await prisma.monthlyKpi.findMany({
            where: whereCondition,
            orderBy: { netProfit: 'desc' },
            take: 5,
            include: { branch: true }
        });

        // 4. Trend (Last 6 months from the selected date)
        // Calculate start date (5 months ago)
        const sixMonthsAgo = new Date(date);
        sixMonthsAgo.setMonth(date.getMonth() - 5);

        const trendWhere: any = {
            yearMonth: {
                gte: sixMonthsAgo,
                lte: date
            }
        };
        if (branchIdArg && branchIdArg !== 'all') {
            trendWhere.branchId = Number(branchIdArg);
        }

        const trendData = await prisma.monthlyKpi.groupBy({
            by: ['yearMonth'],
            where: trendWhere,
            _sum: {
                totalRevenue: true,
                netProfit: true,
                activeStudents: true
            },
            orderBy: {
                yearMonth: 'asc'
            }
        });

        const responseData = {
            totals: {
                totalRevenue: totals._sum.totalRevenue || 0,
                netProfit: totals._sum.netProfit || 0,
                activeStudents: totals._sum.activeStudents || 0,
                newStudents: totals._sum.newStudents || 0,
                reportingBranches: totals._count.id
            },
            rankings: {
                revenue: topByRevenue,
                profit: topByProfit
            },
            trend: trendData
        };

        const serialized = JSON.parse(JSON.stringify(responseData, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serialized);

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
