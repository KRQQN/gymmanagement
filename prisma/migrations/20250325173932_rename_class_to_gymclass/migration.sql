/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_instructorId_fkey";

-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "GymClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "bookedSpots" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT,
    "difficulty" TEXT,
    "equipment" TEXT[],
    "requirements" TEXT[],
    "instructorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GymClass_instructorId_idx" ON "GymClass"("instructorId");

-- AddForeignKey
ALTER TABLE "GymClass" ADD CONSTRAINT "GymClass_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
