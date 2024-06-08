-- CreateTable
CREATE TABLE "tb_fornecedores" (
    "for_codigo" BIGSERIAL NOT NULL,
    "for_descricao" VARCHAR(45) NOT NULL,

    CONSTRAINT "tb_fornecedores_pkey" PRIMARY KEY ("for_codigo")
);

-- CreateTable
CREATE TABLE "tb_produtos" (
    "pro_codigo" BIGSERIAL NOT NULL,
    "pro_descricao" VARCHAR(45) NOT NULL,
    "pro_valor" DECIMAL(10,2) NOT NULL,
    "pro_quantidade" INTEGER NOT NULL,
    "fornecedorId" BIGINT NOT NULL,

    CONSTRAINT "tb_produtos_pkey" PRIMARY KEY ("pro_codigo")
);

-- CreateTable
CREATE TABLE "tb_funcionarios" (
    "fun_codigo" BIGSERIAL NOT NULL,
    "fun_nome" VARCHAR(45) NOT NULL,
    "fun_cpf" VARCHAR(45) NOT NULL,
    "fun_senha" VARCHAR(50) NOT NULL,
    "fun_funcao" VARCHAR(50) NOT NULL,

    CONSTRAINT "tb_funcionarios_pkey" PRIMARY KEY ("fun_codigo")
);

-- CreateTable
CREATE TABLE "tb_vendas" (
    "ven_codigo" BIGSERIAL NOT NULL,
    "ven_horario" TIMESTAMP(3) NOT NULL,
    "ven_valor_total" DECIMAL(7,2) NOT NULL,
    "funcionarioId" BIGINT NOT NULL,

    CONSTRAINT "tb_vendas_pkey" PRIMARY KEY ("ven_codigo")
);

-- CreateTable
CREATE TABLE "tb_itens" (
    "ite_codigo" BIGSERIAL NOT NULL,
    "ite_quantidade" INTEGER NOT NULL,
    "ite_valor_parcial" DECIMAL(7,2) NOT NULL,
    "produtoId" BIGINT NOT NULL,
    "vendaId" BIGINT NOT NULL,

    CONSTRAINT "tb_itens_pkey" PRIMARY KEY ("ite_codigo")
);

-- AddForeignKey
ALTER TABLE "tb_produtos" ADD CONSTRAINT "tb_produtos_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "tb_fornecedores"("for_codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_vendas" ADD CONSTRAINT "tb_vendas_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "tb_funcionarios"("fun_codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_itens" ADD CONSTRAINT "tb_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "tb_produtos"("pro_codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_itens" ADD CONSTRAINT "tb_itens_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "tb_vendas"("ven_codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
