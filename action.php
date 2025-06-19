<?php
require_once 'config/database.php';
session_start();

if (!isset($_SESSION['user_id']) && (!isset($_POST['form_action']) || $_POST['form_action'] !== 'login_user')) {
    die('Akses ditolak. Silakan login terlebih dahulu.');
}

if (isset($_POST['form_action'])) {
    $action = $_POST['form_action'];

    switch ($action) {
        
        case 'login_user':
            $username = $_POST['username'];
            $password = $_POST['password'];

            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && $password === $user['password']) {

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
                $_SESSION['role'] = $user['role'];
                
                
                if ($user['role'] === 'client') {
                    $_SESSION['client_id'] = $user['client_id'];
                }
                
                header('Location: dashboard.php');
            } else {
                header('Location: index.php?error=1');
            }
            break;
            
            case 'save_project':
                if (isset($_SESSION['role']) && ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'engineer')) {
                    
                    $pdo->beginTransaction();
                    try {
                        $title = $_POST['projectTitle'];
                        $detail = $_POST['projectDetail'];
                        $status = $_POST['statusInput'];
                        $client_id = !empty($_POST['client_id']) ? $_POST['client_id'] : null;
                        $projectId = $_POST['projectId'] ?? null;
                        $progressMap = ["Perencanaan" => 10, "Persiapan" => 30, "Produksi" => 60, "Pengawasan" => 75, "Penyelesaian" => 100];
                        $progress = $progressMap[$status] ?? 0;
                        $currentProjectId = null;
            
                        if ($projectId) { // UPDATE PROYEK LAMA
                            $sql = "UPDATE projects SET title = ?, detail = ?, status = ?, progress = ?, client_id = ? WHERE id = ?";
                            $stmt = $pdo->prepare($sql);
                            $stmt->execute([$title, $detail, $status, $progress, $client_id, $projectId]);
                            $currentProjectId = $projectId;
                        } else { // INSERT PROYEK BARU
                            $created_by = $_SESSION['user_id'];
                            $sql = "INSERT INTO projects (title, detail, status, progress, created_by, client_id) VALUES (?, ?, ?, ?, ?, ?)";
                            $stmt = $pdo->prepare($sql);
                            $stmt->execute([$title, $detail, $status, $progress, $created_by, $client_id]);
                            $currentProjectId = $pdo->lastInsertId();
                        }
            
                        // PERBAIKAN: Upload file lampiran - bagian ini yang perlu diperbaiki
                        $note = $_POST['attachment_note'] ?? '';
                        $uploaded_by = $_SESSION['user_id']; // Tambahkan ini
                        $target_dir = "uploads/";
                        if (!is_dir($target_dir)) { 
                            mkdir($target_dir, 0755, true); 
                        }
            
                        $hasFile = isset($_FILES['attachment_file']) && $_FILES['attachment_file']['error'] == 0;
                        $original_name = null;
                        $target_file = null;
            
                        if ($hasFile) {
                            $original_name = basename($_FILES["attachment_file"]["name"]);
                            $file_extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
                            $allowed_formats = ['jpg', 'jpeg', 'png', 'gif']; // PERBAIKAN: Gunakan array yang konsisten
                            
                            if (!in_array($file_extension, $allowed_formats)) {
                                throw new Exception("Format file tidak diizinkan.");
                            }
            
                            $safe_filename = preg_replace('/[^A-Za-z0-9\-\._]/', '', pathinfo($original_name, PATHINFO_FILENAME));
                            $unique_filename = $safe_filename . '-' . uniqid() . '.' . $file_extension;
                            $target_file = $target_dir . $unique_filename;
            
                            if (!move_uploaded_file($_FILES["attachment_file"]["tmp_name"], $target_file)) {
                                throw new Exception("Gagal mengupload file.");
                            }
                        }
            
                        // PERBAIKAN: Simpan attachment dengan kolom yang benar
                        if (!empty($note) || $hasFile) {
                            $stmtAttachment = $pdo->prepare("
                                INSERT INTO attachments (project_id, filename, filepath, note, uploaded_by, tanggal)
                                VALUES (?, ?, ?, ?, ?, NOW())
                            ");
                            $stmtAttachment->execute([
                                $currentProjectId,
                                $hasFile ? $original_name : null,
                                $hasFile ? $target_file : null,
                                $note,
                                $uploaded_by
                            ]);
                        }
            
                        $pdo->commit();
                        
                    } catch (Exception $e) {
                        $pdo->rollBack();
                        die("Terjadi kesalahan saat menyimpan proyek: " . $e->getMessage());
                    }
                }
                header('Location: projects.php');
                break;

        case 'delete_project':
            if (isset($_SESSION['role']) && ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'engineer')) {
                if (isset($_POST['project_id'])) {
                    $projectId = $_POST['project_id'];
                    $pdo->beginTransaction();
                    try {
                        $stmt_get_attachments = $pdo->prepare("SELECT filepath FROM attachments WHERE project_id = ?");
                        $stmt_get_attachments->execute([$projectId]);
                        $files_to_delete = $stmt_get_attachments->fetchAll(PDO::FETCH_COLUMN);
                        foreach ($files_to_delete as $filepath) {
                            if (file_exists($filepath)) {
                                unlink($filepath);
                            }
                        }
                        $stmt_delete_attachments = $pdo->prepare("DELETE FROM attachments WHERE project_id = ?");
                        $stmt_delete_attachments->execute([$projectId]);
                        $stmt_delete_project = $pdo->prepare("DELETE FROM projects WHERE id = ?");
                        $stmt_delete_project->execute([$projectId]);
                        $pdo->commit();
                    } catch (Exception $e) {
                        $pdo->rollBack();
                        die("Gagal menghapus proyek: " . $e->getMessage());
                    }
                }
            }
            header('Location: projects.php');
            break;

        case 'save_user':
            if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
                $userId = $_POST['user_id'] ?? null;
                $nama_lengkap = $_POST['fullName'];
                $username = $_POST['newUsername'];
                $password = $_POST['newPassword'];
                $role = $_POST['userRoleSelect'];

                if ($userId) { // Operasi UPDATE
                    $sql = "UPDATE users SET nama_lengkap = ?, username = ?, role = ?";
                    $params = [$nama_lengkap, $username, $role];
                    if (!empty($password)) {
                        $sql .= ", password = ?";
                        $params[] = $password;
                    }
                    $sql .= " WHERE id = ?";
                    $params[] = $userId;
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                } else { // Operasi INSERT PENGGUNA BARU
                    try {
                        $pdo->beginTransaction();
                        $client_id = null;
                        if ($role === 'client') {
                            $alamat = $_POST['alamatClient'];
                            $kontak = $_POST['kontakClient'];
                            $email = $_POST['emailClient'];
                            $stmtClient = $pdo->prepare("INSERT INTO clients (nama, alamat, kontak, email) VALUES (?, ?, ?, ?)");
                            $stmtClient->execute([$nama_lengkap, $alamat, $kontak, $email]);
                            $client_id = $pdo->lastInsertId();
                        }
                        if (empty($password)) die("Password wajib diisi untuk pengguna baru.");
                        $sql = "INSERT INTO users (nama_lengkap, username, password, role, client_id) VALUES (?, ?, ?, ?, ?)";
                        $stmtUser = $pdo->prepare($sql);
                        $stmtUser->execute([$nama_lengkap, $username, $password, $role, $client_id]);
                        $pdo->commit();
                    } catch (Exception $e) {
                        $pdo->rollBack();
                        die("Gagal menyimpan pengguna baru: " . $e->getMessage());
                    }
                }
            }
            header('Location: users.php');
            break;

        case 'delete_user':
            if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
                $userId = $_POST['user_id'];
                if ($userId != $_SESSION['user_id']) {
                    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                    $stmt->execute([$userId]);
                }
            }
            header('Location: users.php');
            break;

        default:
            header('Location: dashboard.php');
            break;
    }
    exit();
}
?>