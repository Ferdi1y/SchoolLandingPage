import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Success() {
    const { props } = usePage();
    const message = props.flash?.success ?? "";

    // Extract nomor pendaftaran from flash message
    const match = message.match(/MTS\d+/);
    const nomor = match ? match[0] : null;

    return (
        <GuestLayout>
            <div
                className="min-h-screen flex items-center justify-center px-4"
                style={{
                    background:
                        "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #dcfce7 100%)",
                }}
            >
                <div className="max-w-md w-full text-center">
                    {/* Animated check */}
                    <div className="relative inline-flex mb-8">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl animate-bounce">
                            <span className="text-5xl">✅</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-base shadow animate-spin-slow">
                            🌟
                        </div>
                    </div>

                    <h1 className="text-2xl font-extrabold text-green-900 mb-2">
                        Pendaftaran Berhasil!
                    </h1>
                    <p className="text-gray-600 text-sm mb-6">
                        Terima kasih telah mendaftar di{" "}
                        <strong>MTs Darul Ihsan</strong>. Data Anda telah kami
                        terima dan sedang dalam proses verifikasi.
                    </p>

                    {nomor && (
                        <div className="bg-white border-2 border-yellow-300 rounded-2xl px-6 py-5 mb-6 shadow">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Nomor Pendaftaran Anda
                            </p>
                            <p className="text-2xl font-black text-green-700 tracking-widest">
                                {nomor}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Simpan nomor ini untuk pengecekan status
                            </p>
                        </div>
                    )}

                    <div className="bg-green-50 rounded-xl p-4 mb-6 text-left text-sm text-green-800 space-y-2 border border-green-200">
                        <p className="font-semibold">📋 Langkah Selanjutnya:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-gray-700">
                            <li>Tunggu konfirmasi dari pihak sekolah via WhatsApp/telepon</li>
                            <li>Siapkan berkas asli: Ijazah, KK, Akta Kelahiran, Pas Foto 3×4</li>
                            <li>Datang ke sekolah sesuai jadwal yang ditentukan</li>
                        </ol>
                    </div>

                    <Link
                        href={route("pendaftaran.create")}
                        className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition shadow"
                    >
                        ← Daftar Siswa Lain
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}