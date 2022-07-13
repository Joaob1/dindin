const conexao = require("../conexao");
const jwt = require("jsonwebtoken");
const segredo = require('../segredo');
const verificarToken = require("../filtros/verificarToken");

const filtrar = async (filtro, idUsuario) => {
    let transacoes = [];
    const categorias = [];
    for (const categoria of filtro) {
        const { rows: [response] } = await conexao.query('SELECT * FROM categorias WHERE descricao = $1', [categoria]);
        categorias.push(response.id);
    }
    for (const idCategoria of categorias) {
        const queryFiltrarTransacoes = 'SELECT * FROM transacoes WHERE categoria_id = $1 AND usuario_id = $2'
        const { rows: transacoesFiltradas } = await conexao.query(queryFiltrarTransacoes, [idCategoria, idUsuario])
        for (const transacao of transacoesFiltradas) {
            transacoes.push(transacao);
        }
    }
    return transacoes;
}

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query;
    const token = await verificarToken(req.headers.authorization);
    try {
        if (filtro) {
            const transacoesFiltradas = await filtrar(filtro, token.id);
            return res.status(200).json(transacoesFiltradas);
        }
        const queryTransacoes = `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome 
        FROM transacoes t JOIN categorias c ON t.categoria_id = c.id
        WHERE t.usuario_id = $1
        `
        const { rows: transacoes } = await conexao.query(queryTransacoes, [token.id]);
        return res.status(200).json(transacoes);
    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const detalharTransacao = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    const { id: idTransacao } = req.params;
    try {
        const queryTransacao = 'SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2';
        const { rows: [transacao], rowCount } = await conexao.query(queryTransacao, [token.id, idTransacao]);
        if (rowCount === 0) {
            return res.status(404).json({ "mensagem": "Transação não encontrada." })
        }
        return res.status(200).json(transacao);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const token = await verificarToken(req.headers.authorization);

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." });
    }

    try {
        const queryCadastrar =
            "INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6)";
        const cadastrar = await conexao.query(queryCadastrar, [descricao, valor, data, categoria_id, token.id, tipo]);

        if (cadastrar.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível cadastrar a transação." });
        }
        const { rows: transacoes } = await conexao.query('SELECT * FROM transacoes WHERE usuario_id = $1', [token.id]);
        const transacaoCadastrada = transacoes[transacoes.length - 1];
        const { rows: [nomeCategoria] } = await conexao.query('SELECT * FROM categorias WHERE id = $1', [transacaoCadastrada.categoria_id])
        const resposta = {
            "id": transacaoCadastrada.id,
            "tipo": transacaoCadastrada.tipo,
            "descricao": transacaoCadastrada.descricao,
            "valor": transacaoCadastrada.valor,
            "data": transacaoCadastrada.data,
            "usuario_id": token.id,
            "categoria_id": transacaoCadastrada.categoria_id,
            "categoria_nome": nomeCategoria.descricao
        }
        return res.status(201).json(resposta);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const editarTransacao = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    const { id: idTransacao } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados" });
    }
    try {
        const queryTransacao = 'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2'
        const { rowCount: transacaoExistente } = await conexao.query(queryTransacao, [idTransacao, token.id]);
        if (!transacaoExistente) {
            return res.status(404).json({ "mensagem": "Transação não encontrada" });
        }
        const queryAlterar = `UPDATE transacoes 
        SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 
        WHERE id = $6 AND usuario_id = $7`
        const transacaoAlterada = await conexao.query(queryAlterar, [descricao, valor, data, categoria_id, tipo, idTransacao, token.id]);
        if (transacaoAlterada.rowCount === 0) {
            return res.status(400).json("Não foi possível atualizar a transação");
        }
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json(error.message)
    }
};


const removerTransacao = async (req, res) => {
    const { id: idTransacao } = req.params;
    const token = await verificarToken(req.headers.authorization);
    try {
        const queryTransacao = 'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2'
        const { rowCount: transacaoExistente } = await conexao.query(queryTransacao, [idTransacao, token.id]);
        if (!transacaoExistente) {
            return res.status(404).json({ "mensagem": "Transação não encontrada" });
        }
        const queryExcluirTransacao = 'DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2'
        const transacaoExcluida = await conexao.query(queryExcluirTransacao, [idTransacao, token.id]);
        if (transacaoExcluida.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível excluir a transação" })
        }
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const extratoTransacoes = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    try {
        let somaEntradas = 0;
        let somaSaidas = 0;
        const queryExtrato = 'SELECT * FROM transacoes WHERE usuario_id = $1'
        const { rows: transacoes, rowCount } = await conexao.query(queryExtrato, [token.id]);
        if (!rowCount) {
            return res.status(404).json({ "mensagem": "Não há transações cadastradas para o usuário informado" })
        }
        for (const transacao of transacoes) {
            if (transacao.tipo === 'entrada') {
                somaEntradas += transacao.valor;
            }
            else {
                somaSaidas += transacao.valor;
            }
        }
        return res.status(200).json({
            "entrada": somaEntradas,
            "saida": somaSaidas
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    editarTransacao,
    removerTransacao,
    extratoTransacoes,
};