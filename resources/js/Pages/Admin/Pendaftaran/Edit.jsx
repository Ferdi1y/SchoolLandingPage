import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition placeholder-gray-400";

const labelClass =
    "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

export default function Edit({ pendaftaran }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: pendaftaran.nama_lengkap ?? "",
        nisn: pendaftaran.nisn ?? "",
        nik: pendaftaran.nik ?? "",
        tempat_lahir: pendaftaran.tempat_lahir ?? "",
        tanggal_lahir: pendaftaran.tanggal_lahir ?? "",
        jenis_kelamin: pendaftaran.jenis_kelamin ?? "",
        anak_ke: pendaftaran.anak_ke ?? "",
        jumlah_saudara: pendaftaran.jumlah_saudara ?? "",
        alamat_lengkap: pendaftaran.alamat_lengkap ?? "",
        rt: pendaftaran.rt ?? "",
        rw: pendaftaran.rw ?? "",
        kelurahan: pendaftaran.kelurahan ?? "",
        kecamatan: pendaftaran.kecamatan ?? "",
        kota_kabupaten: pendaftaran.kota_kabupaten ?? "",
        provinsi: pendaftaran.provinsi ?? "",
        kode_pos: pendaftaran.kode_pos ?? "",
        no_hp_siswa: pendaftaran.no_hp_siswa ?? "",
        email: pendaftaran.email ?? "",
        nama_ayah: pendaftaran.nama_ayah ?? "",
        pekerjaan_ayah: pendaftaran.pekerjaan_ayah ?? "",
        pendidikan_ayah: pendaftaran.pendidikan_ayah ?? "",
        no_hp_ayah: pendaftaran.no_hp_ayah ?? "",
        nama_ibu: pendaftaran.nama_ibu ?? "",
        pekerjaan_ibu: pendaftaran.pekerjaan_ibu ?? "",
        pendidikan_ibu: pendaftaran.pendidikan_ibu ?? "",
        no_hp_ibu: pendaftaran.no_hp_ibu ?? "",
        asal_sekolah: pendaftaran.asal_sekolah ?? "",
        tahun_lulus: pendaftaran.tahun_lulus ?? "",
        status: pendaftaran.status ?? "pending",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.pendaftaran.update", pendaftaran.id));
    };

    const Field = ({ label, name, type = "text", placeholder, options }) => (
        <div>
            <label className={labelClass}>{label}</label>
            {options ? (
                <select
                    className={inputClass}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                >
                    <option value="">-- Pilih --</option>
                    {options.map((o) => (
                        <option key={o.value ?? o} value={o.value ?? o}>
                            {o.label ?? o}
                        </option>
                    ))}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    className={inputClass + " resize-none h-20"}
                    placeholder={placeholder}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className={inputClass}
                    placeholder={placeholder}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                />
            )}
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );

    const SectionCard = ({ icon, title, children }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <span className="text-xl">{icon}</span>
                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.pendaftaran.index")}
                        className="text-gray-400 hover:text-blue-600 transition text-sm"
                    >
                        ← Kembali
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="font-bold text-gray-800 text-sm">
                        Edit Pendaftaran
                    </span>
                </div>
            }
        >
            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-700 text-sm font-medium mb-5">
                            ✅ {flash.success}
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                            ✏️
                        </div>
                        <div>
                            <h1 className="font-black text-lg">Edit Data Pendaftaran</h1>
                            <p className="text-blue-200 text-xs">
                                {pendaftaran.nomor_pendaftaran} —{" "}
                                {pendaftaran.nama_lengkap}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <SectionCard icon="🎒" title="Data Diri Siswa">
                            <div className="md:col-span-2">
                                <Field label="Nama Lengkap *" name="nama_lengkap" placeholder="Nama lengkap" />
                            </div>
                            <Field label="NISN" name="nisn" placeholder="NISN" />
                            <Field label="NIK" name="nik" placeholder="NIK" />
                            <Field label="Tempat Lahir" name="tempat_lahir" placeholder="Tempat lahir" />
                            <Field label="Tanggal Lahir" name="tanggal_lahir" type="date" />
                            <Field
                                label="Jenis Kelamin"
                                name="jenis_kelamin"
                                options={[
                                    { value: "L", label: "Laki-laki" },
                                    { value: "P", label: "Perempuan" },
                                ]}
                            />
                         
                            <Field label="Anak ke-" name="anak_ke" type="number" />
                            <Field label="Jumlah Saudara" name="jumlah_saudara" type="number" />
                            <Field label="No. HP Siswa" name="no_hp_siswa" placeholder="08xx..." />
                            <Field label="Email" name="email" type="email" placeholder="email@..." />
                        </SectionCard>

                        <SectionCard icon="🏠" title="Alamat">
                            <div className="md:col-span-2">
                                <Field label="Alamat Lengkap" name="alamat_lengkap" type="textarea" />
                            </div>
                            <Field label="RT" name="rt" placeholder="001" />
                            <Field label="RW" name="rw" placeholder="001" />
                            <Field label="Kelurahan" name="kelurahan" placeholder="Kelurahan" />
                            <Field label="Kecamatan" name="kecamatan" placeholder="Kecamatan" />
                            <Field label="Kota/Kabupaten" name="kota_kabupaten" placeholder="Kota/Kabupaten" />
                            <Field label="Provinsi" name="provinsi" placeholder="Provinsi" />
                            <Field label="Kode Pos" name="kode_pos" placeholder="60xxx" />
                        </SectionCard>

                        <SectionCard icon="👨‍👩‍👧" title="Orang Tua">
                            <Field label="Nama Ayah" name="nama_ayah" />
                            <Field label="No. HP Ayah" name="no_hp_ayah" />
                            <Field label="Pekerjaan Ayah" name="pekerjaan_ayah" />
                            <Field label="Pendidikan Ayah" name="pendidikan_ayah" options={["SD","SMP","SMA/SMK","D3","S1","S2","S3"]} />
                            <Field label="Nama Ibu" name="nama_ibu" />
                            <Field label="No. HP Ibu" name="no_hp_ibu" />
                            <Field label="Pekerjaan Ibu" name="pekerjaan_ibu" />
                            <Field label="Pendidikan Ibu" name="pendidikan_ibu" options={["SD","SMP","SMA/SMK","D3","S1","S2","S3"]} />
                        </SectionCard>

                        <SectionCard icon="🏫" title="Asal Sekolah & Status">
                            <Field label="Asal Sekolah" name="asal_sekolah" />
                            <Field label="Tahun Lulus" name="tahun_lulus" type="number" />
                            <Field
                                label="Status Pendaftaran *"
                                name="status"
                                options={[
                                    { value: "pending", label: "Pending" },
                                    { value: "verifikasi", label: "Verifikasi" },
                                    { value: "diterima", label: "Diterima" },
                                    { value: "ditolak", label: "Ditolak" },
                                    { value: "cadangan", label: "Cadangan" },
                                ]}
                            />
                        </SectionCard>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route("admin.pendaftaran.index")}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow disabled:opacity-60"
                            >
                                {processing ? "Menyimpan..." : "💾 Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}