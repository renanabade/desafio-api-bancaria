const pool = require("../config/conexao");
const { resgatarIdPorToken } = require("../funcoes/dadosToken");
const {
  procurarTransacaoPorID,
  procurarCategoriaPorID,
  cadastrarNovaTransacao,
  procurarTransacaoPorIdEUsuario,
  atualizarTransacaoExistente,
  excluirTransacaoExistente,
  obterExtrato,
} = require("../funcoes/querys");

const listarTransacoes = async (req, res) => {
  try {
    const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);
    const transacoes = await pool.query(
      "select * from transacoes where usuario_id = $1",
      [usuario_id],
    );
    return res.status(200).json(transacoes.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

const detalharTransacao = async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);
  try {
    const transacao = await procurarTransacaoPorID(id);

    if (!transacao) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    if (transacao.usuario_id !== usuario_id) {
      return res.status(403).json({ mensagem: "Acesso não autorizado." });
    }

    res.status(200).json(transacao);
  } catch (error) {
    res.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);

  try {
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res
        .status(400)
        .json({
          mensagem: "Todos os campos obrigatórios devem ser informados.",
        });
    }

    const categoria = await procurarCategoriaPorID(categoria_id);

    if (!categoria) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(400)
        .json({ mensagem: 'O tipo deve ser "entrada" ou "saida".' });
    }

    const transacao = cadastrarNovaTransacao(
      usuario_id,
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
    );

    res.status(201).json(transacao);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao processar a solicitação." });
  }
};

const atualizarTranscao = async (req, res) => {
  const transacaoId = req.params.id;
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);

  try {
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res
        .status(400)
        .json({
          mensagem: "Todos os campos obrigatórios devem ser informados.",
        });
    }

    const categoria = await procurarCategoriaPorID(categoria_id);
    if (!categoria) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(400)
        .json({ mensagem: 'O tipo deve ser "entrada" ou "saida".' });
    }

    const transacaoExistente = await procurarTransacaoPorIdEUsuario(
      transacaoId,
      usuario_id,
    );
    if (!transacaoExistente) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    await atualizarTransacaoExistente(transacaoId, {
      descricao: descricao,
      valor: valor,
      data: data,
      categoria_id: categoria_id,
      tipo: tipo,
    });

    return res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao processar a solicitação." });
  }
};

const excluirTransacao = async (req, res) => {
  const transacaoId = req.params.id;
  const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);

  try {
    const transacaoExistente = await procurarTransacaoPorIdEUsuario(
      transacaoId,
      usuario_id,
    );
    if (!transacaoExistente) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    await excluirTransacaoExistente(transacaoId);

    return res.status(200).send();
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Ocorreu um erro ao processar a solicitação." });
  }
};

const extratoTransacoes = async (req, res) => {
  const { usuario_id } = await resgatarIdPorToken(req.headers.authorization);

  try {
    const extrato = await obterExtrato(usuario_id);

    res.status(200).json(extrato);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao obter o extrato de transações." });
  }
};

module.exports = {
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTranscao,
  excluirTransacao,
  extratoTransacoes,
};
