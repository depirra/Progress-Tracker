<?php

require('config/database.php');
header('Content-Type: application/json');

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['error' => 'ID Proyek tidak valid.']);
    exit();
}
$projectId = $_GET['id'];

// Ambil data proyek utama
$stmt = $pdo->prepare("
    SELECT p.*, c.nama as client_name, c.alamat, c.kontak, c.email, u.nama_lengkap as creator_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
");
$stmt->execute([$projectId]);
$project = $stmt->fetch();

if (!$project) {
    echo json_encode(['error' => 'Proyek tidak ditemukan.']);
    exit();
}

// Ambil data lampiran (attachments) yang terkait
// Ambil data lampiran (attachments) yang terkait
$attachmentsStmt = $pdo->prepare("SELECT * FROM attachments WHERE project_id = ?");
$attachmentsStmt->execute([$projectId]); // ← perbaiki variable ID
$attachments = $attachmentsStmt->fetchAll(PDO::FETCH_ASSOC);

$project['attachments'] = $attachments;

echo json_encode($project);
?>