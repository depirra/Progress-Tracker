<?php
require_once 'config/database.php';
require_once 'templates/header.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die('<div class="page-header"></div><div class="view active"><div class="view-content"><div class="info">Akses Ditolak. Halaman ini hanya untuk Admin.</div></div></div>');
}

$searchTerm = $_GET['search'] ?? '';

$sql = "SELECT u.*, c.nama as client_name FROM users u LEFT JOIN clients c ON u.client_id = c.id";
$params = [];

if (!empty($searchTerm)) {
    $sql .= " WHERE (u.nama_lengkap LIKE ? OR u.username LIKE ?)";
    $params[] = '%' . $searchTerm . '%';
    $params[] = '%' . $searchTerm . '%';
}

$sql .= " ORDER BY u.id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$users = $stmt->fetchAll();
?>

<div class="page-header">
    <div id="page-title">Manajemen User</div>
    <div class="user-info">
        <div class="user-avatar"><?= htmlspecialchars(strtoupper(substr($_SESSION['nama_lengkap'], 0, 2))) ?></div>
        <div class="user-details">
            <div class="user-name"><?= htmlspecialchars($_SESSION['nama_lengkap']) ?></div>
            <div class="user-role"><?= htmlspecialchars(ucfirst($_SESSION['role'])) ?></div>
        </div>
    </div>
</div>

<div class="view active" id="users">
    <div class="view-content">

        <div class="search-bar" style="margin-top: 0; margin-bottom: 20px;">
            <form action="users.php" method="GET" style="display: flex; flex: 1; gap: 15px;">
                <input type="text" name="search" id="search" placeholder="Cari berdasarkan nama atau username..." value="<?= htmlspecialchars($searchTerm) ?>" autocomplete="off" />
                <button type="submit" class="btn"><i class="fas fa-search"></i> Cari</button>
            </form>
            <button class="btn" onclick="showUserForm(null)"><i class="fas fa-user-plus"></i> Tambah Pengguna</button>
        </div>

        <div class="user-management">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Nama Lengkap</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="userTableBody">
                    <?php if (empty($users)): ?>
                        <tr>
                            <td colspan="4">
                                <div class="info" style="margin: 0; box-shadow: none;">
                                    <?php if (!empty($searchTerm)): ?>
                                        Tidak ada pengguna yang ditemukan dengan kata kunci "<?= htmlspecialchars($searchTerm) ?>".
                                    <?php else: ?>
                                        Tidak ada pengguna di dalam sistem.
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td><?= htmlspecialchars($user['nama_lengkap']) ?></td>
                                <td><?= htmlspecialchars($user['username']) ?></td>
                                <td>
                                    <span class="role-badge role-<?= htmlspecialchars($user['role']) ?>"><?= ucfirst(htmlspecialchars($user['role'])) ?></span>
                                    <?php if ($user['role'] === 'client' && !empty($user['client_name'])): ?>
                                        <br><small>Klien: <?= htmlspecialchars($user['client_name']) ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <button class="btn" onclick='showUserForm(<?= json_encode($user) ?>)'><i class="fas fa-edit"></i> Edit</button>
                                    <form action="action.php" method="POST" style="display: inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus pengguna ini?');">
                                        <input type="hidden" name="form_action" value="delete_user">
                                        <input type="hidden" name="user_id" value="<?= $user['id'] ?>">
                                        <button type="submit" class="btn btn-danger" <?= ($user['id'] == $_SESSION['user_id']) ? 'disabled title="Tidak bisa menghapus akun Anda sendiri"' : '' ?>>
                                            <i class="fas fa-trash"></i> Hapus
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal dan Overlay -->
<div id="overlay" class="overlay"></div>
<div id="userForm" class="form-container"></div>

<?php require_once 'templates/footer.php'; ?>