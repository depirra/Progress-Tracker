<?php

require_once 'config/database.php';
require_once 'templates/header.php';

$role = $_SESSION['role'] ?? 'guest';

$bisa_melihat_semua_proyek = ($role === 'admin' || $role === 'engineer');
$bisa_menambah_proyek = ($role === 'admin' || $role === 'engineer');
$bisa_mengedit_dan_hapus = ($role === 'admin' || $role === 'engineer');

$clientsStmt = $pdo->query("SELECT id, nama FROM clients ORDER BY nama ASC");
$clients = $clientsStmt->fetchAll();

$sql = "SELECT p.*, c.nama as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id";
$conditions = [];
$params = [];

if (!$bisa_melihat_semua_proyek && isset($_SESSION['client_id'])) {
    $conditions[] = "p.client_id = ?";
    $params[] = $_SESSION['client_id'];
}

$filter = $_GET['filter'] ?? 'all';
if ($filter === 'ongoing') { $conditions[] = "p.progress < 100"; } 
elseif ($filter === 'completed') { $conditions[] = "p.progress = 100"; }

$searchTerm = $_GET['search'] ?? '';
if (!empty($searchTerm)) {
    $conditions[] = "p.title LIKE ?";
    $params[] = '%' . $searchTerm . '%';
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}
$sql .= " ORDER BY p.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$projects = $stmt->fetchAll();
?>

<div class="page-header">
    <div id="page-title">Proyek</div>
    <div class="user-info">
        <div class="user-avatar"><?= htmlspecialchars(strtoupper(substr($_SESSION['nama_lengkap'], 0, 2))) ?></div>
        <div class="user-details">
            <div class="user-name"><?= htmlspecialchars($_SESSION['nama_lengkap']) ?></div>
            <div class="user-role"><?= htmlspecialchars(ucfirst($_SESSION['role'])) ?></div>
        </div>
    </div>
</div>
<div class="view active" id="progress">
    <div class="view-content">
        <div class="search-bar">
            <form action="projects.php" method="GET" style="display: flex; flex: 1; gap: 15px;">
                <input type="text" name="search" placeholder="Cari proyek..." value="<?= htmlspecialchars($searchTerm) ?>" />
                <button type="submit" class="btn"><i class="fas fa-search"></i> Search</button>
            </form>
            
            <?php if ($bisa_menambah_proyek): ?>
                <button class="btn" id="addProjectBtn" onclick='showProjectForm(null, <?= json_encode($clients) ?>)'><i class="fas fa-plus"></i> Tambah Projek</button>
            <?php endif; ?>
        </div>

        <div id="projectList">
            <?php if (empty($projects)): ?>
                <div class="info">Tidak ada proyek ditemukan atau ditugaskan kepada Anda.</div>
            <?php else: ?>
                <?php foreach ($projects as $project): ?>
                    <div class="project <?= ($project['progress'] == 100) ? "completed" : "ongoing" ?>">
                        
                        <div class="project-info">
                            <h3><?= htmlspecialchars($project['title']) ?></h3>
                            <?php if ($project['client_name']): ?>
                                <p>Client: <?= htmlspecialchars($project['client_name']) ?></p>
                            <?php endif; ?>
                            <p><?= htmlspecialchars($project['detail']) ?></p>
                            <p>Status: <?= htmlspecialchars($project['status']) ?></p>
                            <span class="status <?= ($project['progress'] == 100) ? 'completed' : 'ongoing' ?>">
                                <?= ($project['progress'] == 100) ? 'Selesai' : 'Sedang Berjalan' ?>
                            </span>
                        </div>

                        <div class="project-progress">
                            <div class="percentage"><?= htmlspecialchars($project['progress']) ?>%</div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: <?= htmlspecialchars($project['progress']) ?>%"></div>
                            </div>
                            <div class="project-actions">
                                <?php if ($bisa_mengedit_dan_hapus): ?>
                                    <button class="btn" onclick='showProjectForm(<?= $project['id'] ?>, <?= json_encode($clients) ?>)'><i class="fas fa-edit"></i> Edit</button>
                                    
                                    <form action="action.php" method="POST" style="display: inline;" onsubmit="return confirm('Anda yakin ingin menghapus proyek ini? Tindakan ini tidak bisa dibatalkan.');">
                                        <input type="hidden" name="form_action" value="delete_project">
                                        <input type="hidden" name="project_id" value="<?= $project['id'] ?>">
                                        <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i> Hapus</button>
                                    </form>
                                <?php endif; ?>
                                
                                <button class="btn btn-success" onclick="showReportConfirmation(<?= $project['id'] ?>)">
                                    <i class="fas fa-file-alt"></i> Laporan
                                </button>
                            </div>
                        </div>
                                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php
require_once 'templates/footer.php';
?>