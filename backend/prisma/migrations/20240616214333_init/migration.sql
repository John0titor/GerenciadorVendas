/*
  Warnings:

  - You are about to drop the column `fornecedorId` on the `tb_produtos` table. All the data in the column will be lost.
  - You are about to drop the `tb_fornecedores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_produtos" DROP CONSTRAINT "tb_produtos_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "tb_produtos" DROP COLUMN "fornecedorId";

-- DropTable
DROP TABLE "tb_fornecedores";
