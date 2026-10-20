# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat `lib/supabase/server.js` dan `lib/supabase/index.js` untuk membuat klien Supabase server menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- `app/page.jsx` diubah menjadi Server Component (`async`) untuk mengambil data dari tabel `produk` di Supabase.
- Ditambahkan penanganan error (pesan error ramah pengguna) dan pesan "Belum ada produk" jika tabel kosong.
- Komponen `CatatanBelumAktif` dan impor data contoh dihapus dari `app/page.jsx`.

**Perbaikan:**
- Awalnya muncul error PostgREST `Invalid path specified in request URL` karena `SUPABASE_URL` di `.env.local` memiliki akhiran `/rest/v1/`. Nilai di `.env.local` diperbaiki dan ditambahkan sanitasi URL otomatis di `lib/supabase/server.js` agar menghapus trailing slash dan path `/rest/v1`.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- `app/produk/[id]/page.jsx` mengambil satu produk dari tabel `produk` di Supabase berdasarkan parameter `id`.
- Jika data tidak ditemukan atau terjadi error query, memanggil `notFound()` sehingga menampilkan halaman 404 (`not-found.jsx`).
- Komponen `CatatanBelumAktif` dan impor `cariProdukContoh` dihapus.
- Komponen `TombolWhatsApp` dan tampilan detail tetap dipertahankan.

**Perbaikan:**
Tidak ada kendala, implementasi langsung berjalan sesuai kriteria.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- `components/TombolWhatsApp.jsx` diubah dari elemen `<button>` menjadi elemen `<a>` dengan styling yang sama persis.
- Tautan mengarah ke `https://wa.me/<nomor>?text=<pesan>` menggunakan nomor dari `lib/toko.js`.
- Pesan otomatis memuat nama produk dan harga dalam format rupiah melalui `formatRupiah()`, di-encode dengan `encodeURIComponent`, serta dibuka di tab baru (`target="_blank"` dan `rel="noopener noreferrer"`).
- `CatatanBelumAktif` sudah dibersihkan dari halaman detail produk.

**Perbaikan:**
Tidak ada kendala.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Ditambahkan fungsi `buatKoneksiSesiAdmin()` di `lib/supabase/server.js` menggunakan `createServerClient` dari `@supabase/ssr` dan cookie dari `next/headers` memakai `SUPABASE_PUBLISHABLE_KEY`.
- Dibuat `app/admin/actions.js` yang memuat Server Action `login` dan `keluar`.
- `app/admin/login/page.jsx` dihubungkan ke form login menggunakan `useActionState`, menampilkan pesan error saat kredensial salah, dan mengarahkan ke `/admin` saat berhasil.
- Tombol "Keluar" di `components/NavAdmin.jsx` dihubungkan ke Server Action `keluar` untuk mengakhiri sesi dan kembali ke `/admin/login`.
- `CatatanBelumAktif` dihapus dari halaman login.

**Perbaikan:**
Tidak ada kendala.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js`.
- Memeriksa sesi admin di server via `supabase.auth.getUser()`.
- Validasi server memastikan panjang password baru minimal 8 karakter dan bernilai sama dengan konfirmasi.
- Password diperbarui menggunakan `supabase.auth.updateUser({ password })`.
- `app/admin/password/page.jsx` menampilkan notifikasi sukses (`text-utama`) atau pesan error (`text-bahaya`), serta menghapus `CatatanBelumAktif`.

**Perbaikan:**
Tidak ada kendala.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek dengan matcher `/admin/:path*`.
- Rute `/admin/login` dikecualikan agar admin bisa membuka form login.
- Rute `/admin` lainnya memvalidasi sesi cookie melalui `supabase.auth.getUser()`, dan me-redirect pengunjung yang belum login ke `/admin/login`.
- Server Action yang memodifikasi data (`gantiPassword`) telah memverifikasi login admin di server.
- `CatatanBelumAktif` dihapus dari `app/admin/page.jsx`.

**Perbaikan:**
Tidak ada kendala.

## Debugging dan fitur bonus

### [SENDIRI] Error: Invalid path specified in request URL

**Prompt:**
Kenapa ini ya

Terjadi kesalahan

Gagal memuat produk: Invalid path specified in request URL

**Hasil:**
Terjadi error saat mencoba memuat daftar produk dari database Supabase pada US-01.

**Perbaikan:**
- Nilai `SUPABASE_URL` di `.env.local` awalnya terisi `https://...supabase.co/rest/v1/`. Karena `@supabase/supabase-js` secara otomatis menambahkan `/rest/v1/`, request yang terkirim menjadi ganda (`/rest/v1/rest/v1/produk`).
- Nilai `SUPABASE_URL` di `.env.local` diperbaiki menjadi URL dasar proyek (`https://...supabase.co`).
- Di `lib/supabase/server.js`, ditambahkan sanitasi pembersihan URL (`replace(/\/rest\/v1\/?$/, "")` dan strip trailing slash) agar ke depannya aplikasi tetap aman terhadap kesalahan serupa.
