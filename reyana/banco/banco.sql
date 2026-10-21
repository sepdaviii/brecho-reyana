
CREATE TABLE Socio (
    id_socio INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE Retirada (
    id_retirada INT AUTO_INCREMENT PRIMARY KEY,
    id_socio INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_retirada DATE NOT NULL,
    FOREIGN KEY (id_socio) REFERENCES Socio(id_socio)
);

CREATE TABLE Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE Produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    preco_compra DECIMAL(10,2) NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL
);

CREATE TABLE Venda (
    id_venda INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    data_venda DATE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto)
);

CREATE TABLE CustosFixo (
    id_custo INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    competencia DATE NOT NULL
);
