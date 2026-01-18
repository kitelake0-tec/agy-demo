import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');
        const yearMonth = searchParams.get('yearMonth'); // Format: YYYY-MM-DD or YYYY-MM

        const where: any = {};
        if (branchId) where.branchId = Number(branchId);
        if (yearMonth) {
            // Simple string match if passed strictly, or range if just YYYY-MM
            // Assuming strict YYYY-MM-01 passed or handling ranges
            const startOfMonth = new Date(yearMonth);
            where.yearMonth = startOfMonth;
        }

        const kpis = await prisma.monthlyKpi.findMany({
            where,
            include: { branch: true },
            orderBy: { yearMonth: 'desc' }
        });

        // Convert BigInt to String for JSON serialization
        const serializedKpis = JSON.parse(JSON.stringify(kpis, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serializedKpis);
    } catch (error) {
        console.error("KPI Fetch Error:", error);
        return NextResponse.json({ error: 'Failed to fetch KPIs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            branchId, yearMonth,
            tuitionRevenue, consultingRevenue, otherRevenue,
            operatingCost,
            activeStudents, newStudents, dropoutStudents
        } = body;

        // Auto-calculate derived fields
        const totalRevenue = BigInt(tuitionRevenue || 0) + BigInt(consultingRevenue || 0) + BigInt(otherRevenue || 0);
        const netProfit = totalRevenue - BigInt(operatingCost || 0);
        const parsedYearMonth = new Date(yearMonth); // Ensure YYYY-MM-01 format in client

        const kpi = await prisma.monthlyKpi.create({
            data: {
                branchId: Number(branchId),
                yearMonth: parsedYearMonth,
                tuitionRevenue: BigInt(tuitionRevenue || 0),
                consultingRevenue: BigInt(consultingRevenue || 0),
                otherRevenue: BigInt(otherRevenue || 0),
                totalRevenue,
                operatingCost: BigInt(operatingCost || 0),
                netProfit,
                activeStudents: Number(activeStudents || 0),
                newStudents: Number(newStudents || 0),
                dropoutStudents: Number(dropoutStudents || 0),
            }
        });

        // Convert BigInt to String for JSON serialization
        const serializedKpi = JSON.parse(JSON.stringify(kpi, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serializedKpi);
    } catch (error) {
        console.error("KPI Create Error:", error);
        return NextResponse.json({ error: 'Failed to create KPI' }, { status: 500 });
    }
}
