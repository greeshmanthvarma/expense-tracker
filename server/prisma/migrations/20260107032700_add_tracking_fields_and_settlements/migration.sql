-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "currency" TEXT;

-- AlterTable
ALTER TABLE "ExpenseSplit" ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "GroupExpense" ADD COLUMN     "currency" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BalanceSettlement" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "payerId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "settledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledById" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BalanceSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BalanceSettlement_groupId_idx" ON "BalanceSettlement"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "BalanceSettlement_groupId_payerId_receiverId_key" ON "BalanceSettlement"("groupId", "payerId", "receiverId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceSettlement" ADD CONSTRAINT "BalanceSettlement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceSettlement" ADD CONSTRAINT "BalanceSettlement_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceSettlement" ADD CONSTRAINT "BalanceSettlement_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceSettlement" ADD CONSTRAINT "BalanceSettlement_settledById_fkey" FOREIGN KEY ("settledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
