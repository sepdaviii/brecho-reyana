<?php
var_dump($_SERVER['REQUEST_METHOD']);
var_dump($_POST);
?>

<form action="teste.php" method="POST">
    <input type="email" name="email">
    <input type="password" name="senha">
    <button type="submit">Testar</button>
</form>