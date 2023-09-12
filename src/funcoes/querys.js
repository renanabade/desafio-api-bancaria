const pool = require("../config/conexao");

async function procurarEmail(email) {
  const usuarioExistente = await pool.query(
    "select * from usuarios where email = $1",
    [email],
  );
  return usuarioExistente;
}

async function procurarID(id) {
  const usuarioExistente = await pool.query(
    "select * from usuarios where id = $1",
    [id],
  );
  return usuarioExistente;
}

async function procurarTransacaoPorID(id) {
  const transacaoExistente = await pool.query(
    "select * from transacoes where id = $1",
    [id],
  );
  return transacaoExistente;
}

async function procurarCategoriaPorID(id){
  const categoriaExistente = await pool.query(
    "select * from categorias where id = $1",
    [id],
  );
  return categoriaExistente
}

async function cadastrarNovaTransacao(usuario_id, descricao, valor ,data, categoria_id, tipo){
  const novaTransacao = await pool.query(
    "insert into transacoes (usuario_id, descricao, valor ,data, categoria_id, tipo) values ($1, $2, $3, $4, $5, $6)",
    [usuario_id, descricao, valor, data, categoria_id, tipo ],
    )
}

async function procurarTransacaoPorIdEUsuario(transacaoId, usuarioId) {
  const transacaoPorUsuario = await pool.query(
    "select * from transacoes where id = $1 and usuario_id = $2",
    [transacaoId, usuarioId]
  )
  return transacaoPorUsuario
}

async function atualizarTransacaoExistente(id, dados){
  const transacaoAtualizada = await pool.query(
    "UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6",
    [dados.descricao, dados.valor, dados.data, dados.categoria_id, dados.tipo, id],
  );
}

async function excluirTransacaoExistente(transacaoId){
  const transacaoExcluida = await pool.query(
    "DELETE FROM transacoes where id = $1",
    [transacaoId],
  );
}

async function obterExtrato(usuarioId){
  const extrato = await pool.query('SELECT COALESCE(SUM(CASE WHEN tipo = "entrada" then valor ELSE 0 END), 0) as entrada, COALESCE(SUM(CASE WHEN tipo = "saida" THEN valor ELSE 0 END), 0) as saida FROM transacoes WHERE usuario_id = $1', 
  [usuarioId],
  );
}

module.exports = { procurarEmail, procurarID, procurarTransacaoPorID, procurarCategoriaPorID, cadastrarNovaTransacao, procurarTransacaoPorIdEUsuario, atualizarTransacaoExistente, excluirTransacaoExistente, obterExtrato };
