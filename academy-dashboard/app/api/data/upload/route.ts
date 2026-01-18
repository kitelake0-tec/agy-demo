import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const content = buffer.toString('utf-8');

        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (const row of records) {
            try {
                // row keys: 지점명, 년월, ... maps to DB
                const branchName = row['지점명'];
                const yearMonthStr = row['년월'];

                if (!branchName || !yearMonthStr) continue;

                // Upsert Branch
                const branch = await prisma.branch.upsert({
                    where: { name: branchName },
                    update: {},
                    create: { name: branchName },
                });

                const [year, month] = yearMonthStr.split('-').map(Number);
                const date = new Date(Date.UTC(year, month - 1, 1));

                const totalRevenue = BigInt(row['총매출'] || 0);

                // Upsert KPI
                const kpi = await prisma.monthlyKpi.upsert({
                    where: {
                        branchId_yearMonth: {
                            branchId: branch.id,
                            yearMonth: date,
                        }
                    },
                    update: {
                        totalRevenue: BigInt(row['총매출'] || 0),
                        tuitionRevenue: BigInt(row['수강료매출'] || 0),
                        consultingRevenue: BigInt(row['컨설팅매출'] || 0),
                        otherRevenue: BigInt(row['기타매출'] || 0),
                        operatingCost: BigInt(row['운영비'] || 0),
                        netProfit: BigInt(row['순이익'] || 0),
                        activeStudents: Number(row['재원생수'] || 0),
                        newStudents: Number(row['신규생수'] || 0),
                        dropoutStudents: Number(row['퇴원생수'] || 0),
                    },
                    create: {
                        branchId: branch.id,
                        yearMonth: date,
                        totalRevenue: BigInt(row['총매출'] || 0),
                        tuitionRevenue: BigInt(row['수강료매출'] || 0),
                        consultingRevenue: BigInt(row['컨설팅매출'] || 0),
                        otherRevenue: BigInt(row['기타매출'] || 0),
                        operatingCost: BigInt(row['운영비'] || 0),
                        netProfit: BigInt(row['순이익'] || 0),
                        activeStudents: Number(row['재원생수'] || 0),
                        newStudents: Number(row['신규생수'] || 0),
                        dropoutStudents: Number(row['퇴원생수'] || 0),
                    }
                });
                successCount++;
            } catch (e) {
                console.error("Row Error:", e);
                failCount++;
            }
        }

        return NextResponse.json({ message: 'Upload processed', success: successCount, failed: failCount });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
    }
}
