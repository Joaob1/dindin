const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const verificarToken = require('../filtros/verificarToken')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;


    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório.');
    }

    if (!email) {
        return res.status(404).json('O campo email é obrigatório.');
    }

    if (!senha) {
        return res.status(404).json('O campo senha é obrigatório.');
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json('Já existe usuário com o e-mail informado.');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const query = 'insert into usuarios(nome,email,senha) values ($1,$2,$3)';
        const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }
        return res.status(200).json('Usuário cadastrado com sucesso');
    }
    catch (error) {
        return res.status(error);
    }
}


const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('Email e senha são obrigatórios.')
    }
    try {
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await conexao.query(queryVerificaEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json('Usuário não encontrado');
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);
        if (!senhaVerificada) {
            return res.status(400).json('Email e senha não conferem.');
        }

        const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '1d' });

        const { senha: senhaUsuario, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const detalharUsuario = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    try {
        const { rows: [usuario], rowCount } = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [token.id]);
        if (!rowCount) {
            return res.status(500).json('Erro de servidor');
        }

        return res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email })
    } catch (error) {
        return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
};

const editarUsuario = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    const { nome, email, senha } = req.body;
    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório.');
    }
    if (!email) {
        return res.status(404).json('O campo email é obrigatório.');
    }
    if (!senha) {
        return res.status(404).json('O campo senha é obrigatório.');
    }
    try {
        const { rows: [usuario], rowCount: contadorUsuarios } = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [token.id]);
        if (contadorUsuarios === 0) {
            return res.status(400).json('Usuário não encontrado');
        }
        const queryVerificaEmail = 'SELECT * FROM usuarios WHERE email = $1'
        const { rows: [usuarioDoEmail], rowCount: emailExistente } = await conexao.query(queryVerificaEmail, [email]);
        if (emailExistente > 0) {
            if (usuarioDoEmail.id !== usuario.id) {
                return res.status(400).json({ "mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });
            }
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const queryAtualizarUsuario = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
        const usuarioAtualizado = await conexao.query(queryAtualizarUsuario, [nome, email, senhaCriptografada, usuario.id]);
        return res.status(204).send('')
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    editarUsuario

};