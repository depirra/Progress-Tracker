<?php
// config/database.php
$host = 'localhost';
$dbname = 'sinar_baja_bumi';
$user = 'root'; // Ganti jika username database Anda berbeda
$pass = '';     // Ganti jika Anda menggunakan password untuk database

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Pada production, jangan tampilkan error detail ke user
    // Cukup catat di log server
    die("Koneksi ke database gagal: " . $e->getMessage());
}
?>