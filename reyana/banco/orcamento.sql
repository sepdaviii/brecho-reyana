CREATE TABLE ProjecaoRenda ( 
id INT AUTO_INCREMENT PRIMARY KEY, renda_por_peca DECIMAL(10, 2), 
numero_pecas_vendidas INT, 
renda_mensal_total DECIMAL(10, 2) 
); 

CREATE TABLE Salarios ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
socio VARCHAR(50), 
salario DECIMAL(10, 2) 
); 

CREATE TABLE CustosFixos ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
custo VARCHAR(50), 
estimativa_custo DECIMAL(10, 2) 
); 

CREATE TABLE Produto ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
gastos_por_unidade DECIMAL(10, 2), 
preco_de_venda DECIMAL(10, 2), 
renda_por_peca DECIMAL(10, 2) 
); 

INSERT INTO ProjecaoRenda (renda_por_peca, numero_pecas_vendidas, renda_mensal_total)  
VALUES (30.83, 10, 308.25);  

INSERT INTO Salarios (socio, salario)  
VALUES  
('Sócio 1', 10.61),  
('Sócio 2', 10.61),  
('Sócio 3', 10.61);  

INSERT INTO CustosFixos (custo, estimativa_custo)  
VALUES  
('Aluguel', NULL), 
('Wi-Fi', 100.00),  
('Luz', 100.00),  
('Domínio', 3.33),  
('TV a cabo', 11.59);  

INSERT INTO Produto (gastos_por_unidade, preco_de_venda, renda_por_peca) VALUES (20.55, 51.38, 30.83);