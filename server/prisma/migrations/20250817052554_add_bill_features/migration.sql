/*
  Warnings:

  - You are about to drop the column `payerId` on the `ExpenseItem` table. All the data in the column will be lost.
  - Added the required column `payerId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExpenseItem" DROP CONSTRAINT "ExpenseItem_payerId_fkey";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "payerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ExpenseItem" DROP COLUMN "payerId";

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
