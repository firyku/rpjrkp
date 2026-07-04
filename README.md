# Rumah Aplikasi

Landing page dan katalog produk desa berbasis `Next.js 15` dengan penyimpanan konten di `Firebase Firestore`.

## Jalankan Lokal

1. Install dependency:
   `npm install`
2. Jalankan mode development:
   `npm run dev`
3. Buka:
   `http://localhost:3000`

## Build Produksi

Jalankan:

```bash
npm run build
```

Hasil static export akan dibuat di folder `out/`.

## Deploy

Panduan upload ke cPanel dan Hypercloud ada di [DEPLOY-CPANEL-HYPERCLOUD.md](./DEPLOY-CPANEL-HYPERCLOUD.md).

## Catatan

- Aplikasi ini sudah disiapkan sebagai static export, jadi tidak perlu fitur `Node.js App` di cPanel.
- File `firebase-applet-config.json` dipakai di sisi client untuk koneksi ke Firebase.
- Jika memakai Node.js lokal, versi `20`, `22`, atau `24` lebih disarankan dibanding `25`.
