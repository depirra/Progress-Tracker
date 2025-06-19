<?php
// File: action.php (Versi Final Lengkap)

require_once 'config/database.php';
session_start();

// Keamanan dasar: Pastikan user sudah login untuk melakukan aksi, kecuali untuk aksi login itu sendiri.
if (!isset($_SESSION['user_id']) && (!isset($_POST['form_action']) || $_POST['form_action'] !== 'login_user')) {
    die('Akses ditolak. Silakan login terlebih dahulu.');
}

// Pastikan ada aksi yang dikirim dari form
if (isset($_POST['form_action'])) {
    $action = $_POST['form_action'];

    switch ($action) {
        
        // --- AKSI LOGIN ---
        case 'login_user':
            $username = $_POST['username'];
            $password = $_POST['password'];

            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            // Menggunakan perbandingan teks biasa karena ini adalah permintaan untuk tugas kuliah
            if ($user && $password === $user['password']) {
                // Simpan data user ke session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
                $_SESSION['role'] = $user['role'];
                
                // Jika yang login adalah client, simpan juga client_id-nya
                if ($user['role'] === 'client') {
                    $_SESSION['client_id'] = $user['client_id'];
                }
                
                header('Location: dashboard.php');
            } else {
                header('Location: login.php?error=1');
            }
            break;

        // --- AKSI PROYEK ---
        case 'save_project':
            // Hanya admin dan engineer yang bisa menyimpan proyek
            if (isset($_SESSION['role']) && ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'engineer')) {
                $title = $_POST['projectTitle'];
                $detail = $_POST['projectDetail'];
                $status = $_POST['statusInput'];
                $projectId = $_POST['projectId'] ?? null;
                $progressMap = ["Perencanaan" => 10, "Persiapan" => 30, "Produksi" => 60, "Pengawasan" => 75, "Penyelesaian" => 100];
                $progress = $progressMap[$status] ?? 0;
                
                if ($projectId) { // Jika ada projectId, berarti ini UPDATE
                    $sql = "UPDATE projects SET title = ?, detail = ?, status = ?, progress = ? WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $detail, $status, $progress, $projectId]);
                } else { // Jika tidak ada, berarti ini INSERT baru
                    $created_by = $_SESSION['user_id'];
                    $sql = "INSERT INTO projects (title, detail, status, progress, created_by) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $detail, $status, $progress, $created_by]);
                }
            }
            header('Location: projects.php');
            break;

        case 'delete_project':
            // Hanya admin dan engineer yang bisa menghapus proyek
            if (isset($_SESSION['role']) && ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'engineer')) {
                if (isset($_POST['project_id'])) {
                    $projectId = $_POST['project_id'];
                    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
                    $stmt->execute([$projectId]);
                }
            }
            header('Location: projects.php');
            break;

        // --- AKSI PENGGUNA ---
        case 'save_user':
            // Hanya admin yang bisa menyimpan pengguna
            if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
                $userId = $_POST['user_id'] ?? null;
                $nama_lengkap = $_POST['fullName'];
                $username = $_POST['newUsername'];
                $password = $_POST['newPassword'];
                $role = $_POST['userRoleSelect'];
                $client_id = ($role === 'client') ? $_POST['clientSelect'] : null;

                if ($userId) { // Operasi UPDATE
                    $sql = "UPDATE users SET nama_lengkap = ?, username = ?, role = ?, client_id = ?";
                    $params = [$nama_lengkap, $username, $role, $client_id];
                    // Hanya update password jika kolomnya diisi
                    if (!empty($password)) {
                        $sql .= ", password = ?";
                        $params[] = $password; // Simpan sebagai teks biasa
                    }
                    $sql .= " WHERE id = ?";
                    $params[] = $userId;
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);

                } else { // Operasi INSERT
                    if (empty($password)) die("Password wajib diisi untuk pengguna baru.");
                    $sql = "INSERT INTO users (nama_lengkap, username, password, role, client_id) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$nama_lengkap, $username, $password, $role, $client_id]);
                }
            }
            header('Location: users.php');
            break;

        case 'delete_user':
            // Hanya admin yang bisa menghapus pengguna
            if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
                $userId = $_POST['user_id'];
                // Mencegah admin menghapus dirinya sendiri
                if ($userId != $_SESSION['user_id']) {
                    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                    $stmt->execute([$userId]);
                }
            }
            header('Location: users.php');
            break;

        // Aksi default jika tidak ada yang cocok
        default:
            header('Location: dashboard.php');
            break;
    }
    // Hentikan eksekusi setelah redirect
    exit();
}
?>