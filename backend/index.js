const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; 

// Função para criar uma conexão dinâmica
const createDynamicConnection = async (cpf, senha) => {
  const client = new Client({
    connectionString: `postgresql://${cpf}:${senha}@localhost:5432/GerenciadorVendas?schema=public`,
  });
  await client.connect();
  return client;
};

// Função para converter BigInt para String
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

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
};

app.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    // Testa a conexão
    const client = await createDynamicConnection(cpf, senha);
    await client.end();

    // Gera um token JWT
    const token = jwt.sign({ cpf, senha }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/users', authenticateToken, async (req, res) => {
  const { fun_nome, fun_cpf, fun_senha, fun_funcao } = req.body;
  const { cpf, senha } = req.user;

  let client;

  try {
    client = await createDynamicConnection(cpf, senha);
    await client.query('BEGIN');

    // Inserir o novo funcionário
    const userQuery = `
      INSERT INTO tb_funcionarios (fun_nome, fun_cpf, fun_funcao)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const userValues = [fun_nome, fun_cpf, fun_funcao];
    const userResult = await client.query(userQuery, userValues);
    const newUser = userResult.rows[0];

    // Crie o usuário PostgreSQL
    const createUserQuery = `CREATE USER "${fun_cpf}" WITH ENCRYPTED PASSWORD '${fun_senha}'`;
    await client.query(createUserQuery);

    // Atribua o role apropriado
    const role = fun_funcao === 'gerente' ? 'gerente' : 'vendedor';
    const grantRoleQuery = `GRANT ${role} TO "${fun_cpf}"`;
    await client.query(grantRoleQuery);

    await client.query('COMMIT');
    res.json(newUser);
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
      client.end();
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  } finally {
    if (client) {
      client.end();
    }
  }
});

app.post('/products', authenticateToken, async (req, res) => {
  const { pro_descricao, pro_valor, pro_quantidade } = req.body;
  const { cpf, senha } = req.user;

  let client;

  try {
    client = await createDynamicConnection(cpf, senha);
    await client.query('BEGIN');

    // Inserir o novo produto
    const queryText = `
      INSERT INTO tb_produtos (pro_descricao, pro_valor, pro_quantidade)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [pro_descricao, pro_valor, pro_quantidade];
    const result = await client.query(queryText, values);
    const newProduct = result.rows[0];

    await client.query('COMMIT');

    res.json(newProduct);
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
      client.end();
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  } finally {
    if (client) {
      client.end();
    }
  }
});

app.get('/products', authenticateToken, async (req, res) => {
  const { cpf, senha } = req.user; 

  try {
    const client = await createDynamicConnection(cpf, senha);
    const result = await client.query('SELECT * FROM tb_produtos'); 
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } 
});

app.post('/venda/register', authenticateToken, async (req, res) => {
  const { cartItems } = req.body;
  const { cpf, senha } = req.user;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  let client;

  try {
    client = await createDynamicConnection(cpf, senha);

    // Obter o funcionarioId pelo CPF
    const funcionarioResult = await client.query('SELECT fun_codigo FROM tb_funcionarios WHERE fun_cpf = $1', [cpf]);
    const funcionarioId = funcionarioResult.rows[0]?.fun_codigo;

    if (!funcionarioId) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    await client.query('BEGIN');

    // Calcular o valor total da venda
    const ven_valor_total = cartItems.reduce((sum, item) => sum + (item.pro_valor * item.quantity), 0);

    // Inserir a venda
    const vendaQuery = `
      INSERT INTO tb_vendas (ven_horario, ven_valor_total, "funcionarioId")
      VALUES ($1, $2, $3)
      RETURNING ven_codigo
    `;
    const vendaValues = [new Date(), ven_valor_total, funcionarioId];
    const vendaResult = await client.query(vendaQuery, vendaValues);
    const ven_codigo = vendaResult.rows[0].ven_codigo;

    for (const item of cartItems) {
      // Inserir item da venda
      const itemQuery = `
        INSERT INTO tb_itens ("vendaId", "produtoId", ite_quantidade, ite_valor_parcial)
        VALUES ($1, $2, $3, $4)
      `;
      const itemValues = [ven_codigo, item.pro_codigo, item.quantity, item.pro_valor];
      await client.query(itemQuery, itemValues);

      // Atualizar a quantidade do produto
      const updateProductQuery = `
        UPDATE tb_produtos
        SET pro_quantidade = pro_quantidade - $1
        WHERE pro_codigo = $2
      `;
      const updateProductValues = [item.quantity, item.pro_codigo];
      await client.query(updateProductQuery, updateProductValues);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, ven_codigo });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
      client.end();
    }
    console.error('Erro ao registrar a venda:', error);
    res.status(500).json({ error: 'Erro ao registrar a venda' });
  } finally {
    if (client) {
      client.end();
    }
  }
});

app.get('/vendas', authenticateToken, async (req, res) => {
  const { cpf, senha } = req.user;

  try {
    const client = await createDynamicConnection(cpf, senha);

    // Obter o funcionarioId pelo CPF
    const funcionarioResult = await client.query('SELECT fun_codigo FROM tb_funcionarios WHERE fun_cpf = $1', [cpf]);
    const funcionarioId = funcionarioResult.rows[0]?.fun_codigo;

    if (!funcionarioId) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    // Obter todas as vendas do funcionário com detalhes dos itens e produtos
    const vendasQuery = `
      SELECT
        v.ven_codigo,
        v.ven_horario,
        v.ven_valor_total,
        f.fun_nome AS funcionario_nome,
        i.ite_quantidade,
        i.ite_valor_parcial,
        p.pro_descricao
      FROM
        tb_vendas v
      JOIN
        tb_funcionarios f ON v."funcionarioId" = f.fun_codigo
      JOIN
        tb_itens i ON v.ven_codigo = i."vendaId"
      JOIN
        tb_produtos p ON i."produtoId" = p.pro_codigo
      WHERE
        v."funcionarioId" = $1
    `;
    const result = await client.query(vendasQuery, [funcionarioId]);

    const vendas = {};
    result.rows.forEach(row => {
      if (!vendas[row.ven_codigo]) {
        vendas[row.ven_codigo] = {
          ven_codigo: row.ven_codigo,
          ven_horario: row.ven_horario,
          ven_valor_total: row.ven_valor_total || 0,
          funcionario_nome: row.funcionario_nome,
          itens: []
        };
      }
      vendas[row.ven_codigo].itens.push({
        pro_descricao: row.pro_descricao,
        item_quantidade: row.ite_quantidade,
        item_valor: row.ite_valor_parcial
      });
    });

    res.json(Object.values(vendas));
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
