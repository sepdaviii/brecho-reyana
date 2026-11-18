<?php
session_start();

require_once "conexao.php";

$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';


$sql = "SELECT * FROM usuarios WHERE email = :email";

$stmt = $pdo->prepare("
    SELECT email, senha FROM Socio WHERE email = ?
    UNION
    SELECT email, senha FROM Cliente WHERE email = ?
");
$stmt->execute([$email, $email]);

$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if ($usuario && password_verify($senha, $usuario['senha'])) {

    $_SESSION['usuario'] = $usuario['nome'];
    $_SESSION['id'] = $usuario['id'];

    switch (true) {
        case (
            $usuario['email'] === 'admin@reyana.com' ||
            $usuario['email'] === 'socio1@reyana.com' ||
            $usuario['email'] === 'socio2@reyana.com' ||
            $usuario['email'] === 'socio3@reyana.com'
        ):
            header("Location: dashboard.php");
            exit;

        default:
            header("Location: cliente.php");
            exit;
    }

} else {
    echo "E-mail ou senha incorretos!";
    // echo password_hash("1234", PASSWORD_DEFAULT);
}
?>