<?php
session_start();

if (!isset($_SESSION['user_id']) && basename($_SERVER['PHP_SELF']) != 'index.php') {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PT Sinar Baja Bumi</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
<div class="app-container active">
    <?php if (isset($_SESSION['user_id'])): ?>
    <div class="sidebar">
        <div class="sidebar-logo">PT Sinar Baja Bumi</div>
        <div class="sidebar-menu">
            <button onclick="window.location.href='dashboard.php'"><i class="fas fa-tachometer-alt"></i> Dashboard</button>
            <button onclick="window.location.href='projects.php'"><i class="fas fa-project-diagram"></i> Project</button>
            <?php if ($_SESSION['role'] === 'admin'): ?>
            <button onclick="window.location.href='users.php'"><i class="fas fa-users-cog"></i> Manajemen User</button>
            <?php endif; ?>
            <button onclick="window.location.href='about.php'"><i class="fas fa-info-circle"></i> Tentang Kami</button>
            <button onclick="window.location.href='logout.php'"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
    </div>
    <div class="main-content">
    <?php endif; ?>