const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.funcionario.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { fun_nome, fun_cpf, fun_senha, fun_funcao } = req.body;
  const newUser = await prisma.funcionario.create({
    data: {
      fun_nome,
      fun_cpf,
      fun_senha,
      fun_funcao,
    },
  });
  res.json(newUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
