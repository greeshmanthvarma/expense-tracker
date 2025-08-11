/*
  Warnings:

  - You are about to drop the column `paidBy` on the `GroupExpense` table. All the data in the column will be lost.
  - Added the required column `paidById` to the `GroupExpense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupExpense" DROP CONSTRAINT "GroupExpense_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupExpense" DROP CONSTRAINT "GroupExpense_paidBy_fkey";

-- AlterTable
ALTER TABLE "GroupExpense" DROP COLUMN "paidBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paidById" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "billId" INTEGER NOT NULL,
    "payerId" INTEGER NOT NULL,

    CONSTRAINT "ExpenseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OwedItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OwedItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OwedItems_B_index" ON "_OwedItems"("B");

-- AddForeignKey
ALTER TABLE "GroupExpense" ADD CONSTRAINT "GroupExpense_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupExpense" ADD CONSTRAINT "GroupExpense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseItem" ADD CONSTRAINT "ExpenseItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseItem" ADD CONSTRAINT "ExpenseItem_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OwedItems" ADD CONSTRAINT "_OwedItems_A_fkey" FOREIGN KEY ("A") REFERENCES "ExpenseItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OwedItems" ADD CONSTRAINT "_OwedItems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
