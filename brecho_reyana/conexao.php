<?php

$dsn = 'mysql:host=192.168.8.7;dbname=mtecpi9';
$username = 'mtecpi9';
$password = 'mtecpi9';
$pdo = new PDO($dsn, $username, $password);

$nome = 'João';
$email = 'joao@email.com';
$stmt = $pdo->prepare("INSERT INTO Cliente (nome, email) VALUES (:nome, :email)");
$stmt->bindParam(':nome', $nome);
$stmt->bindParam(':email', $email);
$stmt->execute();

$stmt = $pdo->query('SELECT * FROM Cliente');
while ($cliente = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $cliente['nome'] . ' - ' . $cliente['email'] . '<br>';
}

$id = 1;
$stmt = $pdo->prepare("SELECT * FROM Cliente WHERE id_cliente = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$aluno = $stmt->fetch(PDO::FETCH_ASSOC);

?>