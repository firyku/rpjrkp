    <main class="login-page">
      <section class="login-card">
        <a class="brand login-brand" href="#" aria-label="Aplikasi Perencanaan Desa">
          <span class="brand-mark"><i data-lucide="leaf"></i></span>
          <span>Aplikasi Perencanaan Desa</span>
        </a>
        <span class="pill-label">Sistem Desa</span>
        <h1>Login Sistem</h1>
        <p>Masuk untuk menampilkan sidebar dan mengelola Dashboard, RPJMDesa, RKPDesa, serta APBDesa.</p>
        <?php if ($loginError !== ''): ?>
        <div class="login-alert" role="alert"><?= htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endif; ?>
        <form method="post" class="login-form">
          <input type="hidden" name="action" value="login">
          <label class="form-field">
            <span>Username</span>
            <input type="text" name="username" placeholder="Masukkan username" autocomplete="username" required>
          </label>
          <label class="form-field">
            <span>Password</span>
            <input type="password" name="password" placeholder="Masukkan password" autocomplete="current-password" required>
          </label>
          <div class="turnstile-wrap">
            <span>Verifikasi Cloudflare</span>
            <div class="cf-turnstile" data-sitekey="<?= htmlspecialchars($turnstileSiteKey, ENT_QUOTES, 'UTF-8') ?>" data-theme="light"></div>
          </div>
          <button class="btn btn-primary" type="submit">
            <i data-lucide="log-in"></i>
            Login Sistem
          </button>
          <small class="login-hint">Demo lokal: username <b>admin</b>, password <b>admin123</b>.</small>
        </form>
      </section>
    </main>
