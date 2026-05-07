import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

const statusConfig = {
    pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-400" },
    verifikasi: { label: "Verifikasi", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
    diterima: { label: "Diterima", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    ditolak: { label: "Ditolak", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-400" },
    cadangan: { label: "Cadangan", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
};

const Row = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-50 last:border-0">
        <span className="w-40 text-xs font-semibold text-gray-500 shrink-0">{label}</span>
        <span className="text-sm text-gray-800 font-medium">{value || <span className="text-gray-300">-</span>}</span>
    </div>
);

const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <span className="text-xl">{icon}</span>
            <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        </div>
        <div className="px-6 py-2">{children}</div>
    </div>
);

export default function Show({ pendaftaran }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const [showModal, setShowModal] = useState(false);

    const st = statusConfig[pendaftaran.status] ?? statusConfig.pending;

    const { data, setData, post, processing, errors } = useForm({
        status: "",
        catatan: "",
    });

    const handleVerify = (e) => {
        e.preventDefault();
        post(route("admin.pendaftaran.verify", pendaftaran.id), {
            onSuccess: () => setShowModal(false),
        });
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
              })
            : "-";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.pendaftaran.index")}
                        className="text-gray-400 hover:text-blue-600 transition"
                    >
                        ← Kembali
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-gray-800 text-sm">
                        Detail Pendaftaran
                    </span>
                </div>
            }
        >
            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    {flash.success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-700 text-sm font-medium">
                            ✅ {flash.success}
                        </div>
                    )}

                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
                            👤
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-black mb-1">
                                {pendaftaran.nama_lengkap}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100">
                                <span className="font-mono bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold text-white">
                                    {pendaftaran.nomor_pendaftaran}
                                </span>
                                <span>TA {pendaftaran.tahun_ajaran}</span>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${st.bg} ${st.text}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition shadow"
                        >
                            ✍️ Verifikasi
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Data Diri */}
                        <Section icon="🎒" title="Data Diri Siswa">
                            <Row label="Nama Lengkap" value={pendaftaran.nama_lengkap} />
                            <Row label="NISN" value={pendaftaran.nisn} />
                            <Row label="NIK" value={pendaftaran.nik} />
                            <Row label="Tempat, Tgl Lahir" value={`${pendaftaran.tempat_lahir}, ${formatDate(pendaftaran.tanggal_lahir)}`} />
                            <Row label="Jenis Kelamin" value={pendaftaran.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} />
                            <Row label="Anak ke / Dari" value={`${pendaftaran.anak_ke ?? "-"} dari ${pendaftaran.jumlah_saudara ?? "-"} saudara`} />
                            <Row label="No. HP Siswa" value={pendaftaran.no_hp_siswa} />
                            <Row label="Email" value={pendaftaran.email} />
                        </Section>

                        {/* Alamat */}
                        <Section icon="🏠" title="Alamat Tempat Tinggal">
                            <Row label="Alamat" value={pendaftaran.alamat_lengkap} />
                            <Row label="RT/RW" value={`${pendaftaran.rt ?? "-"}/${pendaftaran.rw ?? "-"}`} />
                            <Row label="Kelurahan" value={pendaftaran.kelurahan} />
                            <Row label="Kecamatan" value={pendaftaran.kecamatan} />
                            <Row label="Kota/Kabupaten" value={pendaftaran.kota_kabupaten} />
                            <Row label="Provinsi" value={pendaftaran.provinsi} />
                            <Row label="Kode Pos" value={pendaftaran.kode_pos} />
                        </Section>

                        {/* Orang Tua */}
                        <Section icon="👨‍👩‍👧" title="Data Orang Tua / Wali">
                            <div className="mb-1">
                                <p className="text-xs font-bold text-blue-600 py-2">— Ayah —</p>
                                <Row label="Nama Ayah" value={pendaftaran.nama_ayah} />
                                <Row label="No. HP Ayah" value={pendaftaran.no_hp_ayah} />
                                <Row label="Pekerjaan" value={pendaftaran.pekerjaan_ayah} />
                                <Row label="Pendidikan" value={pendaftaran.pendidikan_ayah} />
                            </div>
                            <div className="mb-1">
                                <p className="text-xs font-bold text-blue-600 py-2">— Ibu —</p>
                                <Row label="Nama Ibu" value={pendaftaran.nama_ibu} />
                                <Row label="No. HP Ibu" value={pendaftaran.no_hp_ibu} />
                                <Row label="Pekerjaan" value={pendaftaran.pekerjaan_ibu} />
                                <Row label="Pendidikan" value={pendaftaran.pendidikan_ibu} />
                            </div>
                            {pendaftaran.nama_wali && (
                                <div>
                                    <p className="text-xs font-bold text-blue-600 py-2">— Wali —</p>
                                    <Row label="Nama Wali" value={pendaftaran.nama_wali} />
                                    <Row label="Hubungan" value={pendaftaran.hubungan_wali} />
                                    <Row label="No. HP Wali" value={pendaftaran.no_hp_wali} />
                                </div>
                            )}
                        </Section>

                        {/* Sekolah & Info */}
                        <Section icon="🏫" title="Asal Sekolah & Info Lain">
                            <Row label="Asal Sekolah" value={pendaftaran.asal_sekolah} />
                            <Row label="Alamat Sekolah" value={pendaftaran.alamat_sekolah} />
                            <Row label="Tahun Lulus" value={pendaftaran.tahun_lulus} />
                            <Row label="Alasan Memilih" value={pendaftaran.alasan_memilih_sekolah} />
                            <Row label="Prestasi" value={pendaftaran.prestasi} />
                        </Section>
                    </div>

                    {/* Verification Info */}
                    {pendaftaran.verified_by && (
                        <Section icon="✅" title="Informasi Verifikasi">
                            <Row label="Diverifikasi oleh" value={pendaftaran.verifier?.name} />
                            <Row label="Tanggal Verifikasi" value={formatDate(pendaftaran.tanggal_verifikasi)} />
                            <Row label="Catatan" value={pendaftaran.catatan} />
                        </Section>
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-gray-800 text-lg">
                                ✍️ Verifikasi Pendaftaran
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-5 bg-blue-50 rounded-xl p-3">
                            Anda akan memverifikasi pendaftaran atas nama{" "}
                            <strong>{pendaftaran.nama_lengkap}</strong>
                        </p>

                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["diterima", "ditolak", "cadangan"].map((s) => {
                                        const cfg = statusConfig[s];
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setData("status", s)}
                                                className={`py-2.5 rounded-xl text-xs font-bold border-2 transition ${
                                                    data.status === s
                                                        ? `${cfg.bg} ${cfg.text} border-current`
                                                        : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                                                }`}
                                            >
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.status && (
                                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none h-24"
                                    placeholder="Tulis catatan verifikasi..."
                                    value={data.catatan}
                                    onChange={(e) => setData("catatan", e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.status}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan Verifikasi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}