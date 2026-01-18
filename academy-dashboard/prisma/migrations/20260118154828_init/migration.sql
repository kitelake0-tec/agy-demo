-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyKpi" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "yearMonth" TIMESTAMP(3) NOT NULL,
    "totalRevenue" BIGINT NOT NULL,
    "tuitionRevenue" BIGINT NOT NULL,
    "consultingRevenue" BIGINT NOT NULL,
    "otherRevenue" BIGINT NOT NULL,
    "operatingCost" BIGINT NOT NULL,
    "netProfit" BIGINT NOT NULL,
    "activeStudents" INTEGER NOT NULL,
    "newStudents" INTEGER NOT NULL,
    "dropoutStudents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyKpi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyKpi_branchId_yearMonth_key" ON "MonthlyKpi"("branchId", "yearMonth");

-- AddForeignKey
ALTER TABLE "MonthlyKpi" ADD CONSTRAINT "MonthlyKpi_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
