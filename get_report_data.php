<?php
// File: get_report_data.php (Versi Diperbarui)

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

// PERUBAHAN: Ambil juga data lampiran (attachments) yang terkait
$attachmentStmt = $pdo->prepare("SELECT filename, note, DATE_FORMAT(uploaded_at, '%Y-%m-%d') as tanggal FROM attachments WHERE project_id = ? ORDER BY uploaded_at DESC");
$attachmentStmt->execute([$projectId]);
$attachments = $attachmentStmt->fetchAll();

// Tambahkan data lampiran ke dalam data proyek
$project['attachments'] = $attachments;

// Kirim semua data sebagai satu paket JSON
echo json_encode($project);
?>