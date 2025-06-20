"use strict";

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (window.innerWidth < 769) {
    sidebar.classList.toggle("open");
  }
}

function hideForm(formId) {
  document.getElementById(formId).classList.remove("active");
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.classList.remove("active");
}

function showProjectForm(projectId = null, clientList = []) {
  const formContainer = document.getElementById("projectForm");
  const overlay = document.getElementById("overlay");
  const isEdit = projectId !== null;

  formContainer.innerHTML =
    '<h3><i class="fas fa-spinner fa-spin"></i> Memuat data...</h3>';
  if (overlay) overlay.classList.add("active");
  formContainer.classList.add("active");

  const buildAndShowForm = (projectData = {}) => {
    let clientOptions = clientList
      .map(
        (client) =>
          `<option value="${client.id}" ${
            isEdit && projectData.client_id == client.id ? "selected" : ""
          }>${client.nama}</option>`
      )
      .join("");

    let attachmentsHTML = "";
    if (
      isEdit &&
      projectData.attachments &&
      projectData.attachments.length > 0
    ) {
      let items = projectData.attachments
        .map((att) => {
          let displayText = att.note || "Tanpa catatan";
          if (att.filename) {
            displayText = `${att.filename} - ${displayText}`;
          } else {
            displayText = `Catatan: ${displayText}`;
          }

          return `<li>
              ${
                att.filepath && att.filename
                  ? `<a href="${att.filepath}" target="_blank">${displayText}</a>`
                  : displayText
              }
            </li>`;
        })
        .join("");
      attachmentsHTML = `
                  <div class="form-section">
                      <h4>Lampiran yang Sudah Ada</h4>
                      <ul class="attachment-list" style="list-style-type: disc; padding-left: 20px; margin-top: 10px;">${items}</ul>
                  </div>
              `;
    }

    const formHTML = `
              <button class="close-btn" onclick="hideForm('projectForm')">&times;</button>
              <h3>${isEdit ? "Edit Detail Project" : "Tambah Proyek Baru"}</h3>
              
              <form action="action.php" method="POST" enctype="multipart/form-data">
                  <input type="hidden" name="form_action" value="save_project">
                  ${
                    isEdit
                      ? `<input type="hidden" name="projectId" value="${projectData.id}">`
                      : ""
                  }
  
                  <div class="form-group">
                      <label for="projectTitle">Judul Project</label>
                      <input type="text" id="projectTitle" name="projectTitle" value="${
                        isEdit ? projectData.title : ""
                      }" required />
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
                      <textarea id="projectDetail" name="projectDetail" required>${
                        isEdit ? projectData.detail : ""
                      }</textarea>
                  </div>
  
                  <div class="form-group">
                      <label for="statusInput">Status</label>
                      <select id="statusInput" name="statusInput" required>
                          <option value="Perencanaan" ${
                            isEdit && projectData.status === "Perencanaan"
                              ? "selected"
                              : ""
                          }>Perencanaan</option>
                          <option value="Persiapan" ${
                            isEdit && projectData.status === "Persiapan"
                              ? "selected"
                              : ""
                          }>Persiapan</option>
                          <option value="Produksi" ${
                            isEdit && projectData.status === "Produksi"
                              ? "selected"
                              : ""
                          }>Produksi</option>
                          <option value="Pengawasan" ${
                            isEdit && projectData.status === "Pengawasan"
                              ? "selected"
                              : ""
                          }>Pengawasan</option>
                          <option value="Penyelesaian" ${
                            isEdit && projectData.status === "Penyelesaian"
                              ? "selected"
                              : ""
                          }>Penyelesaian</option>
                      </select>
                  </div>
                  
                  ${attachmentsHTML}
  
                  <div class="form-section">
                      <h4>Tambah Catatan/Lampiran Baru</h4>
                      <div class="form-group">
                          <label for="attachment_note">Catatan <span style="color: red;">*</span></label>
                          <textarea name="attachment_note" id="attachment_note" placeholder="Masukkan catatan atau keterangan..." required style="min-height: 80px;"></textarea>
                          <small style="color: #666;">Catatan wajib diisi. File gambar bersifat opsional.</small>
                      </div>
                      <div class="form-group">
                          <label for="attachment_file">Lampirkan File</label>
                          <input type="file" name="attachment_file" id="attachment_file" accept=".png, .jpg, .jpeg, .pdf">
                          <small style="color: #666;">Kosongkan jika hanya ingin menambahkan catatan.</small>
                      </div>
                  </div>
  
                  <button type="submit" class="save-btn">${
                    isEdit ? "Simpan Perubahan" : "Tambah Proyek"
                  }</button>
              </form>
          `;
    formContainer.innerHTML = formHTML;
  };

  if (isEdit) {
    fetch(`get_report_data.php?id=${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Gagal memuat data proyek: " + data.error);
          hideForm("projectForm");
        } else {
          buildAndShowForm(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan.");
        hideForm("projectForm");
      });
  } else {
    buildAndShowForm();
  }
}

function showUserForm(userData = null) {
  const formContainer = document.getElementById("userForm");
  const overlay = document.getElementById("overlay");
  const isEdit = userData !== null;

  formContainer.innerHTML =
    '<h3><i class="fas fa-spinner fa-spin"></i> Memuat data...</h3>';
  if (overlay) overlay.classList.add("active");
  formContainer.classList.add("active");

  const buildAndShowForm = () => {
    const formHTML = `
      <button class="close-btn" onclick="hideForm('userForm')">&times;</button>
      <h3>${isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h3>
      <form action="action.php" method="POST">
        <input type="hidden" name="form_action" value="save_user">
        ${
          isEdit
            ? `<input type="hidden" name="user_id" value="${userData.id}">`
            : ""
        }

        <div class="form-group">
          <label for="nama_lengkap">Nama Lengkap</label>
          <input type="text" name="nama_lengkap" value="${
            isEdit ? userData.nama_lengkap : ""
          }" required>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" name="username" value="${
            isEdit ? userData.username : ""
          }" required>
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select name="role" required>
            <option value="">-- Pilih Role --</option>
            <option value="admin" ${
              isEdit && userData.role === "admin" ? "selected" : ""
            }>Admin</option>
            <option value="engineer" ${
              isEdit && userData.role === "engineer" ? "selected" : ""
            }>Engineer</option>
            <option value="client" ${
              isEdit && userData.role === "client" ? "selected" : ""
            }>Client</option>
          </select>
        </div>

        ${
          !isEdit
            ? `
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" required>
        </div>
        `
            : ""
        }

        <button type="submit" class="save-btn">${
          isEdit ? "Simpan Perubahan" : "Tambah Pengguna"
        }</button>
      </form>
    `;
    formContainer.innerHTML = formHTML;
  };

  buildAndShowForm();
}

function showReportConfirmation(projectId) {
  const reportContainer = document.getElementById("reportView");
  reportContainer.innerHTML =
    '<h3><i class="fas fa-spinner fa-spin"></i> Memuat data laporan...</h3>';
  reportContainer.classList.add("active");

  fetch(`get_report_data.php?id=${projectId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Gagal mengambil data: " + data.error);
        hideForm("reportView");
        return;
      }

      let attachmentsHTML = `<div class="report-modal-section"><h4>Catatan & Lampiran</h4><p>Tidak ada catatan atau lampiran untuk proyek ini.</p></div>`;

      function hideForm(id) {
        document.getElementById(id).classList.remove("active");
      }

      if (data.attachments && data.attachments.length > 0) {
        let rows = data.attachments
          .map((att) => {
            const namaFile = att.filename || "Catatan saja";
            const catatan = att.note || "Tidak ada catatan";
            const tanggal = att.tanggal || "Tidak ada tanggal";
            return `<tr><td>${namaFile}</td><td>${catatan}</td><td>${tanggal}</td></tr>`;
          })
          .join("");

        attachmentsHTML = `
            <div class="report-modal-section">
              <h4>Catatan & Lampiran</h4>
              <table class="report-attachment-table">
                <thead><tr><th>File/Tipe</th><th>Catatan</th><th>Tanggal</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>`;
      }

      const confirmationHTML = `
                  <div class="report-modal-header"><h3>Laporan: ${
                    data.title
                  }</h3>
                  <button onclick="hideForm('reportView')" class="close-report-btn" style="position:absolute;top:10px;right:15px;font-size:24px;background:none;border:none;">&times;</button>
                  <button class="btn btn-success" id="confirmDownloadBtn"><i class="fas fa-download"></i> Unduh PDF</button></div>
                  <div class="report-modal-body">
                      <div class="report-modal-section"><h4>Detail Proyek</h4><ul class="report-details-list"><li><strong>Judul:</strong> ${
                        data.title
                      }</li><li><strong>Status:</strong> ${
        data.status
      }</li><li><strong>Progress:</strong> ${
        data.progress
      }%</li><li><strong>Deskripsi:</strong> ${data.detail}</li></ul></div>
                      ${
                        data.client_name
                          ? `<div class="report-modal-section"><h4>Informasi Client</h4><ul class="report-details-list"><li><strong>Nama:</strong> ${
                              data.client_name
                            }</li><li><strong>Alamat:</strong> ${
                              data.alamat || "Tidak ada data"
                            }</li><li><strong>Kontak:</strong> ${
                              data.kontak || "Tidak ada data"
                            }</li><li><strong>Email:</strong> ${
                              data.email || "Tidak ada data"
                            }</li></ul></div>`
                          : ""
                      }
                      ${attachmentsHTML}
                      <div id="lampiranList" class="lampiran-container"></div>
                  </div>
              `;
      reportContainer.innerHTML = confirmationHTML;
      const downloadBtn = document.getElementById("confirmDownloadBtn");
      downloadBtn.dataset.projectData = JSON.stringify(data);
      downloadBtn.addEventListener("click", performPDFDownload);

      const lampiranContainer = document.getElementById("lampiranList");
      lampiranContainer.innerHTML = "<h4>Detail Catatan & Lampiran</h4>";

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((att, index) => {
          const catatan = att.note || "Tidak ada catatan";
          const tanggal = att.tanggal || "Tanggal tidak tersedia";
          const file = att.filename
            ? `<a href="uploads/${att.filename}" target="_blank">${att.filename}</a>`
            : "<em>Catatan tanpa file</em>";

          const lampiranHTML = `
        <div class="lampiran-item" style="border:1px solid #ccc; padding:10px; margin-bottom:10px; border-radius: 5px;">
          <p><strong>Item ${index + 1}:</strong></p>
          <p><strong>File:</strong> ${file}</p>
          <p><strong>Catatan:</strong> ${catatan}</p>
          <p><strong>Tanggal:</strong> ${tanggal}</p>
        </div>
      `;
          lampiranContainer.innerHTML += lampiranHTML;
        });
      } else {
        lampiranContainer.innerHTML +=
          "<p><i>Tidak ada catatan atau lampiran yang ditambahkan.</i></p>";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan jaringan.");
      hideForm("reportView");
    });
}

function performPDFDownload(event) {
  const data = JSON.parse(event.currentTarget.dataset.projectData);
  const fileName = `Laporan-${data.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;

  showPDFLoading(true);

  hidePDFMessages();

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "a4");

    let currentY = 40;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Laporan Proyek: ${data.title}`,
      doc.internal.pageSize.getWidth() / 2,
      currentY,
      { align: "center" }
    );
    currentY += 25;

    function drawSection(title, contentCallback) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, currentY);
      doc.setLineWidth(0.5);
      doc.line(
        14,
        currentY + 2,
        doc.internal.pageSize.getWidth() - 14,
        currentY + 2
      );
      currentY += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      contentCallback();
    }

    function drawDetailRow(label, value) {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, currentY);
      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(
        value,
        doc.internal.pageSize.getWidth() - 90
      );
      doc.text(valueLines, 70, currentY);
      currentY += valueLines.length * 5 + 3;
    }

    drawSection("Detail Proyek", () => {
      drawDetailRow("Judul:", data.title);
      drawDetailRow("Status:", `${data.status} (${data.progress}%)`);
      drawDetailRow("Deskripsi:", data.detail);
    });

    currentY += 10;

    if (data.client_name) {
      drawSection("Informasi Client", () => {
        drawDetailRow("Nama:", data.client_name);
        drawDetailRow("Alamat:", data.alamat || "Tidak ada data");
        drawDetailRow("Kontak:", data.kontak || "Tidak ada data");
        drawDetailRow("Email:", data.email || "Tidak ada data");
      });
      currentY = doc.autoTable.previous
        ? doc.autoTable.previous.finalY
        : currentY;
      currentY += 10;
    }

    if (data.attachments && data.attachments.length > 0) {
      doc.autoTable({
        head: [["Tipe/File", "Catatan", "Tanggal"]],
        body: data.attachments.map((att) => [
          att.filename || "Catatan saja",
          att.note || "Tidak ada catatan",
          att.tanggal || "Tidak ada tanggal",
        ]),
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: [62, 39, 35] },
        margin: { left: 14, right: 14 },
        columnStyles: {
          1: { columnWidth: 250 },
        },
      });
    }

    doc.save(fileName);

    showPDFSuccess();
  } catch (error) {
    console.error("Error generating PDF:", error);
    showPDFError("Terjadi kesalahan saat membuat PDF: " + error.message);
  } finally {
    showPDFLoading(false);
  }
}

function showPDFLoading(show) {
  let loading = document.getElementById("pdfLoading");
  if (!loading) {
    loading = document.createElement("div");
    loading.id = "pdfLoading";
    loading.className = "pdf-loading";
    loading.innerHTML =
      '<div class="spinner"></div><span>Sedang membuat PDF...</span>';
    document.body.appendChild(loading);
  }

  if (show) {
    loading.classList.add("show");
  } else {
    loading.classList.remove("show");
  }
}

function showPDFError(message) {
  let error = document.getElementById("pdfError");
  if (!error) {
    error = document.createElement("div");
    error.id = "pdfError";
    error.className = "pdf-error";
    document.body.appendChild(error);
  }

  error.textContent = message;
  error.classList.add("show");
  setTimeout(() => error.classList.remove("show"), 5000);
}

function showPDFSuccess() {
  let success = document.getElementById("pdfSuccess");
  if (!success) {
    success = document.createElement("div");
    success.id = "pdfSuccess";
    success.className = "pdf-success";
    success.textContent = "PDF berhasil dibuat dan diunduh!";
    document.body.appendChild(success);
  }

  success.classList.add("show");
  setTimeout(() => success.classList.remove("show"), 3000);
}

function hidePDFMessages() {
  const error = document.getElementById("pdfError");
  const success = document.getElementById("pdfSuccess");

  if (error) error.classList.remove("show");
  if (success) success.classList.remove("show");
}
