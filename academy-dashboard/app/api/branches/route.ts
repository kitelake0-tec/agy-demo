import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        // Pagination (optional addition)

        const branches = await prisma.branch.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                name: 'asc',
            },
            include: {
                // Include latest KPI for quick view if needed, but keeping it simple for now
                _count: {
                    select: { monthlyKpis: true }
                }
            }
        });

        return NextResponse.json(branches);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        const branch = await prisma.branch.create({
            data: { name }
        });

        return NextResponse.json(branch);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
    }
}
