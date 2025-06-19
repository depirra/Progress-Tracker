'use strict';

/**
 * Fungsi untuk toggle sidebar di tampilan mobile
 */
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (window.innerWidth < 769) {
        sidebar.classList.toggle("open");
    }
}

/**
 * Menyembunyikan form modal dan overlay-nya
 * @param {string} formId - ID dari form container yang akan disembunyikan
 */
function hideForm(formId) {
    document.getElementById(formId).classList.remove('active');
    document.getElementById('formOverlay').classList.remove('active');
}

/**
 * Menampilkan dan mengisi form proyek (untuk 'add' atau 'edit')
 * VERSI BARU DENGAN CLIENT, LAMPIRAN, DAN UPLOAD
 * @param {number|null} projectId - ID proyek untuk diedit, atau null untuk menambah.
 * @param {Array} clientList - Daftar klien dari PHP.
 */
function showProjectForm(projectId = null, clientList = []) {
    const formContainer = document.getElementById('projectForm');
    const overlay = document.getElementById('formOverlay');
    const isEdit = projectId !== null;

    // Tampilkan modal loading selagi mengambil data (khusus untuk mode edit)
    formContainer.innerHTML = '<h3><i class="fas fa-spinner fa-spin"></i> Memuat data...</h3>';
    overlay.classList.add('active');
    formContainer.classList.add('active');

    // Fungsi untuk membangun dan menampilkan form setelah data siap
    const buildAndShowForm = (projectData = {}) => {
        // Buat pilihan dropdown untuk client
        let clientOptions = clientList.map(client => 
            `<option value="${client.id}" ${isEdit && projectData.client_id == client.id ? 'selected' : ''}>${client.nama}</option>`
        ).join('');

        // Buat daftar lampiran yang sudah ada (hanya jika mode edit)
        let attachmentsHTML = '';
        if (isEdit && projectData.attachments && projectData.attachments.length > 0) {
            let items = projectData.attachments.map(att => `<li><a href="${att.filepath}" target="_blank">${att.filename}</a> - <em>${att.note || 'Tanpa catatan'}</em></li>`).join('');
            attachmentsHTML = `
                <div class="form-section">
                    <h4>Lampiran yang Sudah Ada</h4>
                    <ul class="attachment-list" style="list-style-type: disc; padding-left: 20px; margin-top: 10px;">${items}</ul>
                </div>
            `;
        }

        const formHTML = `
            <button class="close-btn" onclick="hideForm('projectForm')">&times;</button>
            <h3>${isEdit ? 'Edit Detail Project' : 'Tambah Proyek Baru'}</h3>
            
            <form action="action.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="form_action" value="save_project">
                ${isEdit ? `<input type="hidden" name="projectId" value="${projectData.id}">` : ''}

                <div class="form-group">
                    <label for="projectTitle">Judul Project</label>
                    <input type="text" id="projectTitle" name="projectTitle" value="${isEdit ? projectData.title : ''}" required />
                </div>

                <div class="form-group">
                    <label for="client_id">Pilih Client</label>
                    <select id="client_id" name="client_id">
                        <option value="">-- Tidak ada Klien --</option>
                        ${clientOptions}
                    </select>
                </div>

                <div class="form-group">
                    <label for="projectDetail">Detail Project</label>
                    <textarea id="projectDetail" name="projectDetail" required>${isEdit ? projectData.detail : ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="statusInput">Status</label>
                    <select id="statusInput" name="statusInput" required>
                        <option value="Perencanaan" ${isEdit && projectData.status === 'Perencanaan' ? 'selected' : ''}>Perencanaan</option>
                        <option value="Persiapan" ${isEdit && projectData.status === 'Persiapan' ? 'selected' : ''}>Persiapan</option>
                        <option value="Produksi" ${isEdit && projectData.status === 'Produksi' ? 'selected' : ''}>Produksi</option>
                        <option value="Pengawasan" ${isEdit && projectData.status === 'Pengawasan' ? 'selected' : ''}>Pengawasan</option>
                        <option value="Penyelesaian" ${isEdit && projectData.status === 'Penyelesaian' ? 'selected' : ''}>Penyelesaian</option>
                    </select>
                </div>
                
                ${attachmentsHTML}

                <div class="form-section">
                    <h4>Tambah Lampiran Baru (Format: Gambar)</h4>
                    <div class="form-group">
                        <label for="attachment_note">Catatan Lampiran</label>
                        <input type="text" name="attachment_note" id="attachment_note" placeholder="Contoh: Foto progres minggu pertama">
                    </div>
                    <div class="form-group">
                        <label for="attachment_file">Pilih File Gambar</label>
                        <input type="file" name="attachment_file" id="attachment_file" accept="image/png, image/jpeg, image/gif">
                    </div>
                </div>

                <button type="submit" class="save-btn">${isEdit ? 'Simpan Perubahan' : 'Tambah Proyek'}</button>
            </form>
        `;
        formContainer.innerHTML = formHTML;
    };

    if (isEdit) {
        // Jika mode edit, ambil data lengkap proyek (termasuk lampiran) dari server
        fetch(`get_report_data.php?id=${projectId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Gagal memuat data proyek: ' + data.error);
                    hideForm('projectForm');
                } else {
                    buildAndShowForm(data); // Bangun form dengan data yang diterima
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan jaringan.');
                hideForm('projectForm');
            });
    } else {
        // Jika mode tambah, langsung tampilkan form kosong
        buildAndShowForm();
    }
}


/**
 * Menampilkan dan mengisi form user (dengan logika membuat klien baru)
 * @param {object|null} user - Objek data user.
 */
function showUserForm(user = null) {
    const formContainer = document.getElementById('userForm');
    const isEdit = user !== null;

    const clientFieldsHTML = `
        <div id="clientDetails" style="display: none;">
            <p style="font-size: 13px; color: #666; margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                Isi detail di bawah ini untuk membuat entri klien baru secara otomatis.
            </p>
            <div class="form-group">
                <label for="alamatClient">Alamat Client</label>
                <input type="text" id="alamatClient" name="alamatClient" placeholder="Alamat lengkap klien">
            </div>
            <div class="form-group">
                <label for="kontakClient">Kontak (No. Tlp)</label>
                <input type="text" id="kontakClient" name="kontakClient" placeholder="Nomor telepon klien">
            </div>
            <div class="form-group">
                <label for="emailClient">Email Client</label>
                <input type="email" id="emailClient" name="emailClient" placeholder="Alamat email klien">
            </div>
        </div>
    `;

    const formHTML = `
        <button class="close-btn" onclick="hideForm('userForm')">&times;</button>
        <h3>${isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
        <form action="action.php" method="POST">
            <input type="hidden" name="form_action" value="save_user">
            ${isEdit ? `<input type="hidden" name="user_id" value="${user.id}">` : ''}

            <div class="form-group">
                <label for="fullName">Nama Lengkap (atau Nama Perusahaan untuk Klien)</label>
                <input type="text" id="fullName" name="fullName" value="${isEdit ? user.nama_lengkap : ''}" required>
            </div>
            <div class="form-group">
                <label for="newUsername">Username</label>
                <input type="text" id="newUsername" name="newUsername" value="${isEdit ? user.username : ''}" required>
            </div>
            <div class="form-group">
                <label for="newPassword">Password</label>
                <input type="password" id="newPassword" name="newPassword" placeholder="${isEdit ? 'Kosongkan jika tidak diubah' : 'Wajib diisi'}">
            </div>
            <div class="form-group">
                <label for="userRoleSelect">Role</label>
                <select id="userRoleSelect" name="userRoleSelect" onchange="toggleClientSelect(this.value, ${isEdit})" required>
                    <option value="">-- Pilih Role --</option>
                    <option value="admin" ${isEdit && user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="engineer" ${isEdit && user.role === 'engineer' ? 'selected' : ''}>Engineer</option>
                    <option value="client" ${isEdit && user.role === 'client' ? 'selected' : ''}>Client</option>
                </select>
            </div>
            
            ${!isEdit ? clientFieldsHTML : ''}

            <button type="submit" class="save-btn">Simpan Pengguna</button>
        </form>
    `;

    formContainer.innerHTML = formHTML;
    document.getElementById('formOverlay').classList.add('active');
    formContainer.classList.add('active');
}

/**
 * Menampilkan/menyembunyikan field detail client saat role diubah
 * @param {string} selectedRole 
 * @param {boolean} isEditMode
 */
function toggleClientSelect(selectedRole, isEditMode) {
    const container = document.getElementById('clientDetails');
    if (!isEditMode && selectedRole === 'client' && container) {
        container.style.display = 'block';
    } else if (container) {
        container.style.display = 'none';
    }
}


/**
 * Menampilkan modal laporan detail.
 * @param {number} projectId
 */
function showReportConfirmation(projectId) {
    const reportContainer = document.getElementById('reportView');
    const overlay = document.getElementById('formOverlay');
    reportContainer.innerHTML = '<h3><i class="fas fa-spinner fa-spin"></i> Memuat data laporan...</h3>';
    reportContainer.classList.add('active');
    overlay.classList.add('active');

    fetch(`get_report_data.php?id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Gagal mengambil data: ' + data.error);
                hideForm('reportView');
                return;
            }
            let attachmentsHTML = `<div class="report-modal-section"><h4>Lampiran</h4><p>Tidak ada lampiran untuk proyek ini.</p></div>`;
            if (data.attachments && data.attachments.length > 0) {
                let rows = data.attachments.map(att => `<tr><td>${att.filename}</td><td>${att.note || ''}</td><td>${att.tanggal}</td></tr>`).join('');
                attachmentsHTML = `<div class="report-modal-section"><h4>Lampiran</h4><table class="report-attachment-table"><thead><tr><th>Nama File</th><th>Catatan</th><th>Tanggal</th></tr></thead><tbody>${rows}</tbody></table></div>`;
            }
            const confirmationHTML = `
                <div class="report-modal-header"><h3>Laporan: ${data.title}</h3><button class="btn btn-success" id="confirmDownloadBtn"><i class="fas fa-download"></i> Unduh PDF</button></div>
                <div class="report-modal-body">
                    <div class="report-modal-section"><h4>Detail Proyek</h4><ul class="report-details-list"><li><strong>Judul:</strong> ${data.title}</li><li><strong>Status:</strong> ${data.status}</li><li><strong>Progress:</strong> ${data.progress}%</li><li><strong>Deskripsi:</strong> ${data.detail}</li></ul></div>
                    ${data.client_name ? `<div class="report-modal-section"><h4>Informasi Client</h4><ul class="report-details-list"><li><strong>Nama:</strong> ${data.client_name}</li><li><strong>Alamat:</strong> ${data.alamat || 'Tidak ada data'}</li><li><strong>Kontak:</strong> ${data.kontak || 'Tidak ada data'}</li><li><strong>Email:</strong> ${data.email || 'Tidak ada data'}</li></ul></div>` : ''}
                    ${attachmentsHTML}
                </div>
            `;
            reportContainer.innerHTML = confirmationHTML;
            const downloadBtn = document.getElementById('confirmDownloadBtn');
            downloadBtn.dataset.projectData = JSON.stringify(data);
            downloadBtn.addEventListener('click', performPDFDownload);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan jaringan.');
            hideForm('reportView');
        });
}

/**
 * Membuat dan mengunduh PDF setelah dikonfirmasi.
 * @param {Event} event
 */
function performPDFDownload(event) {
    const data = JSON.parse(event.currentTarget.dataset.projectData);
    const fileName = `Laporan-${data.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    hideForm('reportView');
    alert('PDF sedang dibuat...');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    let currentY = 40;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Laporan Proyek: ${data.title}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 25;

    function drawSection(title, contentCallback) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, currentY);
        doc.setLineWidth(0.5);
        doc.line(14, currentY + 2, doc.internal.pageSize.getWidth() - 14, currentY + 2);
        currentY += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        contentCallback();
    }

    function drawDetailRow(label, value) {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, currentY);
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(value, doc.internal.pageSize.getWidth() - 90);
        doc.text(valueLines, 70, currentY);
        currentY += (valueLines.length * 5) + 3;
    }

    drawSection('Detail Proyek', () => {
        drawDetailRow('Judul:', data.title);
        drawDetailRow('Status:', `${data.status} (${data.progress}%)`);
        drawDetailRow('Deskripsi:', data.detail);
    });
    
    currentY += 10;

    if (data.client_name) {
        drawSection('Informasi Client', () => {
            drawDetailRow('Nama:', data.client_name);
            drawDetailRow('Alamat:', data.alamat || 'Tidak ada data');
            drawDetailRow('Kontak:', data.kontak || 'Tidak ada data');
            drawDetailRow('Email:', data.email || 'Tidak ada data');
        });
        currentY = doc.autoTable.previous ? doc.autoTable.previous.finalY : currentY;
        currentY += 10;
    }

    if (data.attachments && data.attachments.length > 0) {
        doc.autoTable({
            head: [['Nama File', 'Catatan', 'Tanggal']],
            body: data.attachments.map(att => [att.filename, att.note || '', att.tanggal]),
            startY: currentY,
            theme: 'grid',
            headStyles: { fillColor: [62, 39, 35] },
            margin: { left: 14, right: 14 }
        });
    }

    doc.save(fileName);
}