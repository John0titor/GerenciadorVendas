const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Função para converter BigInt para string
const convertBigIntToString = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (typeof obj === 'object') {
    for (let key in obj) {
      obj[key] = convertBigIntToString(obj[key]);
    }
    return obj;
  }
  return obj;
};

// Rota para login
app.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const user = await prisma.tb_funcionarios.findFirst({
      where: {
        fun_cpf: cpf,
        fun_senha: senha,
      },
    });
    if (user) {
      res.json({ success: true, user: convertBigIntToString(user) });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para cadastro de usuários
app.post('/users', async (req, res) => {
  const { fun_nome, fun_cpf, fun_senha, fun_funcao } = req.body;
  try {
    const newUser = await prisma.tb_funcionarios.create({
      data: {
        fun_nome,
        fun_cpf,
        fun_senha,
        fun_funcao,
      },
    });
    res.json(convertBigIntToString(newUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para cadastro de produtos
app.post('/produtos', async (req, res) => {
  const { pro_descricao, pro_valor, pro_quantidade } = req.body;
  try {
    const newProduct = await prisma.tb_produtos.create({
      data: {
        pro_descricao,
        pro_valor,
        pro_quantidade,
        fornecedorId: 1, // Ajustar conforme necessário
      },
    });
    res.json(convertBigIntToString(newProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
