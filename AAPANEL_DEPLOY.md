# Deploy ke aaPanel

1. Ekstrak ZIP ke document root situs.
2. Gunakan PHP 8.1 atau lebih baru dan aktifkan ekstensi PDO MySQL.
3. Salin `includes/database.local.example.php` menjadi `includes/database.local.php`, lalu isi koneksi MySQL.
4. Impor Microsoft Access langsung memerlukan `mdbtools` pada server Linux:

   ```bash
   sudo apt update
   sudo apt install -y mdbtools
   ```

5. Pastikan PHP dapat menjalankan `proc_open` dan `shell_exec`, serta membaca perintah `mdb-tables` dan `mdb-export`.
6. Batas upload 300 MB sudah disiapkan melalui `.user.ini`. Restart PHP-FPM bila perubahan belum terbaca.
