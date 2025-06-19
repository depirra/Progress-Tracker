<?php
require_once 'config/database.php';
require_once 'templates/header.php';

// Logika untuk mengambil data dari database
$totalProjects = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
$ongoingProjects = $pdo->query("SELECT COUNT(*) FROM projects WHERE progress < 100")->fetchColumn();
$completedProjects = $pdo->query("SELECT COUNT(*) FROM projects WHERE progress = 100")->fetchColumn();

// Menghitung progress rata-rata
$avgProgressQuery = $pdo->query("SELECT AVG(progress) as avg_progress FROM projects");
$avgProgressResult = $avgProgressQuery->fetch();
$avgProgress = $avgProgressResult ? round($avgProgressResult['avg_progress']) : 0;
?>

<div class="view active" id="dashboard">
    <div class="view-content">
        <div class="dashboard-cards">
            <div class="dashboard-card" onclick="window.location.href='projects.php'">
                <h3>Total Projects</h3>
                <div class="value"><?= htmlspecialchars($totalProjects) ?></div>
                <div class="info-text">All projects in the system</div>
            </div>
            <div class="dashboard-card" onclick="window.location.href='projects.php?filter=ongoing'">
                <h3>Ongoing Projects</h3>
                <div class="value"><?= htmlspecialchars($ongoingProjects) ?></div>
                <div class="info-text">Projects currently in progress</div>
            </div>
            <div class="dashboard-card" onclick="window.location.href='projects.php?filter=completed'">
                <h3>Completed Projects</h3>
                <div class="value"><?= htmlspecialchars($completedProjects) ?></div>
                <div class="info-text">Successfully finished projects</div>
            </div>
            <div class="dashboard-card">
                <h3>Project Progress</h3>
                <div class="value"><?= htmlspecialchars($avgProgress) ?>%</div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: <?= htmlspecialchars($avgProgress) ?>%"></div>
                </div>
                <div class="info-text">Average completion rate</div>
            </div>
        </div>
    </div>
</div>
<?php
// PASTIKAN BARIS INI TERTULIS DENGAN BENAR
require_once 'templates/footer.php';
?>