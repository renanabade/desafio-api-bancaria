const pool = require("../config/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { procurarEmail, procurarID } = require("../funcoes/querys");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    //validar email
    const usuarioExistente = await procurarEmail(email);
    if (usuarioExistente.rowCount > 0) {
      return res.json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    //criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    //inserir dados do usuario
    const novoUsuario = await pool.query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3)",
      [nome, email, senhaCriptografada],
    );

    //retornar dados do usuario
    const { id } = (await procurarEmail(email)).rows[0];
    return res.json({
      id,
      nome,
      email,
    });
  } catch (error) {
    return res.status(500).json("erro interno do servidor");
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    //verificar se e-mail existe
    const dados = await procurarEmail(email);
    if (dados.rowCount < 1) {
      return res.status(400).json({
        mensagem: "Usuário e/ou senha inválido(s).",
      });
    }
    //verificar se senha está correta
    const senhaEncriptada = dados.rows[0].senha;
    const senhaEstaCorreta = await bcrypt.compare(senha, senhaEncriptada);

    if (!senhaEstaCorreta) {
      return res.status(400).json({
        mensagem: "Usuário e/ou senha inválido(s).",
      });
    }
    //gerar token
    const { id, nome } = dados.rows[0];
    const token = await jwt.sign(
      {
        id,
        nome,
      },
      "secret",
      { expiresIn: "1h" },
    );

    //retornar dados do usuario
    return res.status(200).json({
      usuario: {
        id,
        nome,
        email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json("erro interno do servidor");
  }
};

const detalharUsuario = async (req, res) => {
  try {
    const dadosUsuario = (await procurarID(tokenUsuarioLogado.id)).rows[0];
    const { id, nome, email } = dadosUsuario;
    return res.status(200).json({
      id,
      nome,
      email,
    });
  } catch (error) {
    res.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = tokenUsuarioLogado;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "nome, email e senha são necessários",
    });
  }

  try {
    //validar email
    const usuarioExistente = await procurarEmail(email);
    if (usuarioExistente.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    //criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    //atualizar dados do usuario
    const novoUsuario = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senhaCriptografada, id],
    );
    res.status(200).send("");
  } catch (error) {
    res.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  editarUsuario,
};
