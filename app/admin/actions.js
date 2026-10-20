"use server";

import { redirect } from "next/navigation";
import { buatKoneksiSesiAdmin } from "@/lib/supabase/server";

/**
 * Server Action untuk memproses login admin dengan email dan password.
 * Berhasil: dialihkan ke /admin
 * Gagal: mengembalikan objek { error: string }
 */
export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get("email");
  const password = data?.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let errorMessage = null;

  try {
    const supabase = await buatKoneksiSesiAdmin();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah.";
      } else {
        errorMessage = `Gagal masuk: ${error.message}`;
      }
    }
  } catch (err) {
    errorMessage = err.message || "Terjadi kesalahan saat memproses login.";
  }

  if (errorMessage) {
    return { error: errorMessage };
  }

  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi admin (logout) lalu kembali ke /admin/login.
 */
export async function keluar() {
  const supabase = await buatKoneksiSesiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
