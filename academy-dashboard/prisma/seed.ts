import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Seed from Sample CSV if exists
    // Assuming process.cwd() is the project root (academy-dashboard)
    const csvPath = path.resolve(process.cwd(), '../academy_sales_sample.csv')
    let sampleData: any[] = []

    try {
        console.log('Looking for CSV at:', csvPath)
        if (fs.existsSync(csvPath)) {
            const fileContent = fs.readFileSync(csvPath, 'utf-8')
            sampleData = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            })

            console.log(`Found ${sampleData.length} records in CSV.`)

            for (const row of sampleData) {
                // row keys: 지점명, 년월, 총매출, ...
                // Map Korean headers to English fields
                const branchName = row['지점명']
                const yearMonthStr = row['년월'] // 2024-01

                const branch = await prisma.branch.upsert({
                    where: { name: branchName },
                    update: {},
                    create: { name: branchName },
                })

                // Parse date: "2024-01" -> Date object (2024-01-01)
                const [year, month] = yearMonthStr.split('-').map(Number)
                const date = new Date(Date.UTC(year, month - 1, 1))

                await prisma.monthlyKpi.upsert({
                    where: {
                        branchId_yearMonth: {
                            branchId: branch.id,
                            yearMonth: date,
                        }
                    },
                    update: {},
                    create: {
                        branchId: branch.id,
                        yearMonth: date,
                        totalRevenue: BigInt(row['총매출']),
                        tuitionRevenue: BigInt(row['수강료매출']),
                        consultingRevenue: BigInt(row['컨설팅매출']),
                        otherRevenue: BigInt(row['기타매출']),
                        operatingCost: BigInt(row['운영비']),
                        netProfit: BigInt(row['순이익']),
                        activeStudents: Number(row['재원생수']),
                        newStudents: Number(row['신규생수']),
                        dropoutStudents: Number(row['퇴원생수']),
                    }
                })
            }
            console.log('Stored sample CSV data.')
        } else {
            console.log('Sample CSV not found, skipping.')
        }
    } catch (e) {
        console.error('Error reading/parsing CSV:', e)
    }

    // 2. Seed Real Branches from Scraped Data
    const realBranches = [
        "강남센터", "강동센터 1관", "강동센터 2관", "강서센터", "광명센터", "광주 봉선센터", "광주 수완센터", "광주 충장로센터", "구리 수택센터", "구리남양주센터",
        "기숙학원 여주캠프", "기숙학원 이천캠프", "김포센터", "김해센터", "노량진센터 1관", "노량진센터 2관", "노원 중계센터 1관", "노원 중계센터 2관",
        "대구 동성로센터", "대구 상인센터", "대구 수성구센터 1관", "대구 수성구센터 2관", "대구 시지센터", "대구 월성센터", "대전 둔산센터", "대전 유성센터",
        "대치센터", "동탄센터", "마산센터", "마포신촌센터", "목동센터 1관", "목동센터 2관", "목동센터 3관", "몰입관 강남캠프", "몰입관 김포 장기캠프",
        "몰입관 대구 지산범물캠프", "몰입관 동탄1캠프", "몰입관 동탄2캠프", "몰입관 부산 동래사직캠프", "몰입관 수원 광교캠프", "부산 경성대센터",
        "부산 사직센터", "부산 서면센터", "부산 센텀센터 1관", "부산 센텀센터 2관", "부산 화명센터", "부산대센터", "부천센터 1관", "부천센터 2관",
        "분당 수내센터", "분당 이매센터", "분당 정자센터", "산본센터", "서울대센터", "성동센터", "성북센터", "세종센터", "송파센터", "수원 영통센터 1관",
        "수원 영통센터 2관", "수원 정자센터", "안산센터", "안양 평촌센터", "양산센터", "용인 수지센터 1관", "용인 수지센터 2관", "울산 옥동센터 1관",
        "울산 옥동센터 2관", "원주센터", "은평서대문센터", "의정부센터", "인천 논현센터", "인천 부평센터", "인천 연수송도센터 1관 (연수동)",
        "인천 연수송도센터 2관 (송도동)", "인천 청라센터", "일산 백마센터", "일산 주엽센터", "일산 화정센터", "잠실센터", "전주 송천센터",
        "전주 전북대센터", "전주 중화산센터", "제주센터", "진주센터", "창원 상남센터 1관", "창원 상남센터 2관", "천안센터 1관", "천안센터 2관",
        "청주 동남센터", "청주센터", "춘천센터", "파주센터", "평택센터", "포항센터", "하남미사센터"
    ];

    console.log(`Seeding ${realBranches.length} real branches...`)

    for (const name of realBranches) {
        const branch = await prisma.branch.upsert({
            where: { name },
            update: {},
            create: { name }
        });

        // Generate 12 months of data for 2024 if not exists
        const existingCount = await prisma.monthlyKpi.count({
            where: { branchId: branch.id }
        });

        if (existingCount === 0) {
            for (let m = 0; m < 12; m++) {
                const date = new Date(Date.UTC(2024, m, 1))

                // Random Base Values
                const activeStudents = 50 + Math.floor(Math.random() * 200) // 50-250
                const tuitionPerStudent = 500000
                const tuitionRevenue = activeStudents * tuitionPerStudent
                const consultingRevenue = Math.floor(Math.random() * 10000000)
                const otherRevenue = Math.floor(Math.random() * 2000000)
                const totalRevenue = tuitionRevenue + consultingRevenue + otherRevenue
                const operatingCost = Math.floor(totalRevenue * (0.3 + Math.random() * 0.4)) // 30-70% cost
                const netProfit = totalRevenue - operatingCost
                const newStudents = Math.floor(Math.random() * 20)
                const dropoutStudents = Math.floor(Math.random() * 10)

                await prisma.monthlyKpi.create({
                    data: {
                        branchId: branch.id,
                        yearMonth: date,
                        totalRevenue: BigInt(totalRevenue),
                        tuitionRevenue: BigInt(tuitionRevenue),
                        consultingRevenue: BigInt(consultingRevenue),
                        otherRevenue: BigInt(otherRevenue),
                        operatingCost: BigInt(operatingCost),
                        netProfit: BigInt(netProfit),
                        activeStudents,
                        newStudents,
                        dropoutStudents
                    }
                })
            }
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
