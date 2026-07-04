# Deploy ke cPanel / Hypercloud

Panduan ini cocok untuk hosting cPanel biasa dan layanan Hypercloud yang memberi akses `File Manager` atau upload zip.

## 1. Build aplikasi

Jalankan di folder project:

```bash
npm install
npm run build
```

Setelah selesai, file website statis akan ada di folder `out/`.

## 2. File yang harus diupload

Upload isi folder `out/`, bukan source project lengkap.

Setelah diextract di hosting, isi folder target harus langsung berisi file seperti:

- `index.html`
- `404.html`
- `_next/`
- `Foto.jpeg`

## 3. Upload ke cPanel / Hypercloud

1. Login ke panel hosting.
2. Buka `File Manager`.
3. Masuk ke folder domain:
   - `public_html` untuk domain utama
   - folder subdomain / addon domain untuk domain tambahan
4. Backup file website lama jika masih dipakai.
5. Upload hasil build dari folder `out/` atau upload zip hasil build lalu extract.
6. Pastikan `index.html` berada langsung di root folder domain, bukan di dalam folder `out`.

## 4. Setelah upload

1. Buka domain Anda.
2. Refresh dengan hard reload.
3. Cek menu, gambar, dan tombol WhatsApp.
4. Coba login admin dan simpan konten untuk memastikan Firestore bisa diakses.

## 5. Catatan penting

- Deploy ini bersifat statis, jadi tidak perlu menjalankan `npm start` di hosting.
- Jika website dipasang di subfolder, konfigurasi `basePath` dan `assetPrefix` di `next.config.ts` perlu disesuaikan dulu.
- Jika data Firestore tidak terbaca, periksa:
  - `firebase-applet-config.json`
  - daftar domain yang diizinkan di Firebase Authentication
  - aturan `firestore.rules`
- Bila hosting memakai cache/CDN, lakukan purge cache setelah upload.
