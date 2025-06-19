'use strict';

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (window.innerWidth < 769) {
        sidebar.classList.toggle("open");
    }
}

function hideForm(formId) {
    document.getElementById(formId).classList.remove('active');
    document.getElementById('formOverlay').classList.remove('active');
}

function showProjectForm(project = null) {
    const formContainer = document.getElementById('projectForm');
    const isEdit = project !== null;
    const formHTML = `
        <button class="close-btn" onclick="hideForm('projectForm')">&times;</button>
        <h3>${isEdit ? 'Edit Detail Project' : 'Tambah Detail Project'}</h3>
        <form action="action.php" method="POST">
            <input type="hidden" name="form_action" value="save_project">
            ${isEdit ? `<input type="hidden" name="projectId" value="${project.id}">` : ''}
            <div class="form-group">
                <label for="projectTitle">Judul Project</label>
                <input type="text" id="projectTitle" name="projectTitle" placeholder="Judul Project" value="${isEdit ? project.title : ''}" required />
            </div>
            <div class="form-group">
                <label for="projectDetail">Detail Project</label>
                <textarea id="projectDetail" name="projectDetail" placeholder="Detail Project" required>${isEdit ? project.detail : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="statusInput">Status</label>
                <select id="statusInput" name="statusInput" required>
                    <option value="">-- Pilih Status --</option>
                    <option value="Perencanaan" ${isEdit && project.status === 'Perencanaan' ? 'selected' : ''}>Perencanaan</option>
                    <option value="Persiapan" ${isEdit && project.status === 'Persiapan' ? 'selected' : ''}>Persiapan</option>
                    <option value="Produksi" ${isEdit && project.status === 'Produksi' ? 'selected' : ''}>Produksi</option>
                    <option value="Pengawasan" ${isEdit && project.status === 'Pengawasan' ? 'selected' : ''}>Pengawasan</option>
                    <option value="Penyelesaian" ${isEdit && project.status === 'Penyelesaian' ? 'selected' : ''}>Penyelesaian</option>
                </select>
            </div>
            <button type="submit" class="save-btn">Simpan Project</button>
        </form>
    `;
    formContainer.innerHTML = formHTML;
    document.getElementById('formOverlay').classList.add('active');
    formContainer.classList.add('active');
}

function showUserForm(user = null, clientList = []) {
    const formContainer = document.getElementById('userForm');
    const isEdit = user !== null;
    let clientOptions = clientList.map(client =>
        `<option value="${client.id}" ${isEdit && user.client_id == client.id ? 'selected' : ''}>${client.nama}</option>`
    ).join('');
    const formHTML = `
        <button class="close-btn" onclick="hideForm('userForm')">&times;</button>
        <h3>${isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
        <form action="action.php" method="POST">
            <input type="hidden" name="form_action" value="save_user">
            ${isEdit ? `<input type="hidden" name="user_id" value="${user.id}">` : ''}
            <div class="form-group">
                <label for="fullName">Nama Lengkap</label>
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
                <select id="userRoleSelect" name="userRoleSelect" onchange="toggleClientSelect(this.value)" required>
                    <option value="">-- Pilih Role --</option>
                    <option value="admin" ${isEdit && user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="engineer" ${isEdit && user.role === 'engineer' ? 'selected' : ''}>Engineer</option>
                    <option value="client" ${isEdit && user.role === 'client' ? 'selected' : ''}>Client</option>
                </select>
            </div>
            <div class="form-group" id="clientSelectContainer" style="display: ${isEdit && user.role === 'client' ? 'block' : 'none'};">
                <label for="clientSelect">Client</label>
                <select id="clientSelect" name="clientSelect">
                    <option value="">-- Pilih Client --</option>
                    ${clientOptions}
                </select>
            </div>
            <button type="submit" class="save-btn">Simpan Pengguna</button>
        </form>
    `;
    formContainer.innerHTML = formHTML;
    document.getElementById('formOverlay').classList.add('active');
    formContainer.classList.add('active');
}

function toggleClientSelect(selectedRole) {
    const container = document.getElementById('clientSelectContainer');
    if (selectedRole === 'client') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

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

function performPDFDownload(event) {
    const data = JSON.parse(event.currentTarget.dataset.projectData);
    const fileName = `Laporan-${data.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    hideForm('reportView');
    alert('PDF sedang dibuat...');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Laporan Proyek: ${data.title}`, 14, 22);
    let currentY = 35;
    doc.setFontSize(12);
    doc.text('Detail Proyek', 14, currentY);
    currentY += 7;
    doc.setFontSize(10);
    doc.text(`Judul: ${data.title}`, 14, currentY);
    currentY += 6;
    doc.text(`Status: ${data.status} (${data.progress}%)`, 14, currentY);
    currentY += 10;
    if (data.client_name) {
        doc.setFontSize(12);
        doc.text('Informasi Client', 14, currentY);
        currentY += 7;
        doc.setFontSize(10);
        doc.text(`Nama: ${data.client_name}`, 14, currentY);
        currentY += 6;
        doc.text(`Kontak: ${data.kontak} (${data.email})`, 14, currentY);
        currentY += 10;
    }
    if (data.attachments && data.attachments.length > 0) {
        doc.setFontSize(12);
        doc.text('Lampiran', 14, currentY);
        const tableHead = [['Nama File', 'Catatan', 'Tanggal']];
        const tableBody = data.attachments.map(att => [att.filename, att.note || '', att.tanggal]);
        doc.autoTable({
            head: tableHead,
            body: tableBody,
            startY: currentY + 2,
        });
    }
    doc.save(fileName);
}