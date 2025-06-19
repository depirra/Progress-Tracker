<?php
// File: templates/footer.php (VERSI FINAL & BERSIH)

// Tutup div .main-content dan .app-container hanya jika user sudah login
if (isset($_SESSION['user_id'])): ?>
    </div> <?php endif; ?>
</div> <div class="overlay" id="formOverlay"></div>
<div class="form-container" id="projectForm"></div>
<div class="form-container" id="userForm"></div>
<div class="form-container" id="reportView"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>

<script src="js/main.js"></script>
</body>
</html>