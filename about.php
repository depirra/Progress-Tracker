<?php

require_once 'templates/header.php';
?>

<div class="page-header">
    <div id="page-title">Tentang Kami</div>
    <div class="user-info">
        <div class="user-avatar"><?= htmlspecialchars(strtoupper(substr($_SESSION['nama_lengkap'], 0, 2))) ?></div>
        <div class="user-details">
            <div class="user-name"><?= htmlspecialchars($_SESSION['nama_lengkap']) ?></div>
            <div class="user-role"><?= htmlspecialchars(ucfirst($_SESSION['role'])) ?></div>
        </div>
    </div>
</div>
<div class="view active" id="about">
    <div class="view-content">
        <h2 style="text-align: center; margin-bottom: 20px;">
            PT SINAR BAJA BUMI
        </h2>
        <p class="info">
            Perusahaan kami bergerak di bidang konstruksi baja dengan pengalaman lebih dari 20 tahun.
            Kami menyediakan solusi konstruksi baja berkualitas tinggi untuk berbagai proyek baik skala kecil maupun besar.
        </p>
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h3>Visi</h3>
                <p>Menjadi perusahaan konstruksi baja terdepan di Indonesia dengan kualitas dan inovasi terbaik.</p>
            </div>
            <div class="dashboard-card">
                <h3>Misi</h3>
                <p>Memberikan solusi konstruksi baja yang efisien, aman, dan berkualitas tinggi dengan layanan terpadu.</p>
            </div>

            <div class="dashboard-card">
                <h3>Hubungi Kami</h3>
                <p style="font-size: 14px; margin-top: 15px;">
                    <i class="fas fa-phone" style="margin-right: 10px; color: var(--primary-color);"></i>
                    (021) 123-4567
                </p>
                <p style="font-size: 14px; margin-top: 15px;">
                    <i class="fas fa-envelope" style="margin-right: 10px; color: var(--primary-color);"></i>
                    kontak@sinarbajabumi.com
                </p>
                 <p style="font-size: 14px; margin-top: 15px;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 10px; color: var(--primary-color);"></i>
                    Jl. Industri Baja No. 42, Jakarta
                </p>
            </div>
            </div>
    </div>
</div>

<?php
require_once 'templates/footer.php';
?>