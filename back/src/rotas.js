const express = require('express');
const usuarios = require('./controladores/usuarios');
const transacoes = require('./controladores/transacoes');
const categorias = require('./controladores/categorias');
const verificaLogin = require('./filtros/verificaLogin');



const rotas = express();

//cadastro de usuario
rotas.post('/usuario', usuarios.cadastrarUsuario);


//login
rotas.post('/login', usuarios.login);

//validacão de token
rotas.use(verificaLogin);

//Detalhar usuário
rotas.get('/usuario', usuarios.detalharUsuario);

//Atualizar usuario
rotas.put('/usuario', usuarios.editarUsuario);

//Listar categorias
rotas.get('/categoria', categorias.listarCategorias)

//Listar transações do usuário logado
rotas.get('/transacao', transacoes.listarTransacoes);

//Obter extrato de transações
rotas.get('/transacao/extrato', transacoes.extratoTransacoes)

//Detalhar transação do usuário logado
rotas.get('/transacao/:id', transacoes.detalharTransacao);

//Cadastrar transação para o usuário logado
rotas.post('/transacao', transacoes.cadastrarTransacao);

//Atualizar transação do usuário logado
rotas.put('/transacao/:id', transacoes.editarTransacao);

//Excluir transação do usuário logado
rotas.delete('/transacao/:id', transacoes.removerTransacao);




module.exports = rotas;