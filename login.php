<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login - PT Sinar Baja Bumi</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <div class="login-container" id="loginPage">
        <div class="login-box">
            <div class="login-logo">PT Sinar Baja Bumi</div>
            <?php if (isset($_GET['error'])): ?>
                <p style="color: red; margin-bottom: 15px;">Username atau password salah!</p>
            <?php endif; ?>
            <form class="login-form" action="action.php" method="POST">
                <input type="hidden" name="form_action" value="login_user">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Masukkan username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Masukkan password" required>
                </div>
                <button type="submit" class="login-btn">Masuk</button>
            </form>
        </div>
    </div>
</body>
</html>