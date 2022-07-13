CREATE DATABASE dindin;

CREATE TABLE IF NOT EXISTS usuarios(
	id SERIAL NOT NULL PRIMARY KEY,
   	nome TEXT NOT NULL,
  	email VARCHAR(100) NOT NULL UNIQUE,
  	senha TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS categorias(
	id SERIAL NOT NULL PRIMARY KEY,
   	descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transacoes(
	id SERIAL NOT NULL PRIMARY KEY,
  	descricao TEXT NOT NULL,
    valor INTEGER NOT NULL,
    data DATE NOT NULL,
    categoria_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
  	tipo TEXT NOT NULL,
  	
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(categoria_id) REFERENCES categorias(id)
);

INSERT INTO categorias (descricao) VALUES
('Alimentação'), ('Assinaturas e Serviços'),
('Casa'), ('Mercado'), ('Cuidados Pessoais'),
('Educação'), ('Família'), ('Lazer'), ('Pets'),
('Presentes'), ('Roupas'), ('Saúde'),
('Transporte'), ('Salário'), ('Vendas'),
('Outras receitas'), ('Outras despesas')
