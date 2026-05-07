import { useState, useCallback, memo } from "react";
import { useForm, Link } from "@inertiajs/react";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const pendidikanOptions = ["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"];

const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder-gray-400";

const inputErrorClass =
    "w-full px-4 py-2.5 rounded-xl border border-red-400 bg-red-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition placeholder-gray-400";

const labelClass =
    "block text-xs font-semibold text-green-800 mb-1 uppercase tracking-wide";

const STEPS = [
    { label: "Data Siswa", icon: "🎒" },
    { label: "Alamat", icon: "🏠" },
    { label: "Data Orang Tua", icon: "👨‍👩‍👧" },
    { label: "Sekolah Asal", icon: "🏫" },
    { label: "Dokumen", icon: "📄" },
];

// ─── Aturan Validasi ──────────────────────────────────────────────────────────

const validationRules = {
    nama_lengkap: {
        required: true,
        minLength: 3,
        maxLength: 100,
        label: "Nama Lengkap",
    },
    nisn: {
        pattern: /^\d{10}$/,
        label: "NISN",
        patternMsg: "NISN harus 10 digit angka",
    },
    nik: {
        pattern: /^\d{16}$/,
        label: "NIK",
        patternMsg: "NIK harus 16 digit angka",
    },
    tempat_lahir: { required: true, minLength: 2, label: "Tempat Lahir" },
    tanggal_lahir: { required: true, label: "Tanggal Lahir" },
    jenis_kelamin: { required: true, label: "Jenis Kelamin" },
    anak_ke: {
        type: "number",
        min: 1,
        max: 20,
        label: "Anak ke-",
    },
    jumlah_saudara: {
        type: "number",
        min: 0,
        max: 20,
        label: "Jumlah Saudara",
    },
    no_hp_siswa: {
        pattern: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
        label: "No. HP Siswa",
        patternMsg: "Format nomor HP tidak valid",
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        label: "Email",
        patternMsg: "Format email tidak valid",
    },
    alamat_lengkap: { required: true, minLength: 10, label: "Alamat Lengkap" },
    rt: { pattern: /^\d{1,4}$/, label: "RT", patternMsg: "RT tidak valid" },
    rw: { pattern: /^\d{1,4}$/, label: "RW", patternMsg: "RW tidak valid" },
    kelurahan: { required: true, minLength: 2, label: "Kelurahan" },
    kecamatan: { required: true, minLength: 2, label: "Kecamatan" },
    kota_kabupaten: { required: true, minLength: 2, label: "Kota/Kabupaten" },
    provinsi: { required: true, minLength: 2, label: "Provinsi" },
    kode_pos: {
        pattern: /^\d{5}$/,
        label: "Kode Pos",
        patternMsg: "Kode pos harus 5 digit angka",
    },
    nama_ayah: { required: true, minLength: 2, label: "Nama Ayah" },
    no_hp_ayah: {
        required: true,
        pattern: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
        label: "No. HP Ayah",
        patternMsg: "Format nomor HP tidak valid",
    },
    nama_ibu: { required: true, minLength: 2, label: "Nama Ibu" },
    no_hp_ibu: {
        required: true,
        pattern: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
        label: "No. HP Ibu",
        patternMsg: "Format nomor HP tidak valid",
    },
    no_hp_wali: {
        pattern: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
        label: "No. HP Wali",
        patternMsg: "Format nomor HP tidak valid",
    },
    asal_sekolah: { required: true, minLength: 3, label: "Asal Sekolah" },
    tahun_lulus: {
        type: "number",
        min: 2000,
        max: new Date().getFullYear() + 1,
        label: "Tahun Lulus",
    },
};

// Field wajib per step (untuk cek sebelum next)
const requiredByStep = {
    1: ["nama_lengkap", "tempat_lahir", "tanggal_lahir", "jenis_kelamin"],
    2: ["alamat_lengkap", "kelurahan", "kecamatan", "kota_kabupaten", "provinsi"],
    3: ["nama_ayah", "no_hp_ayah", "nama_ibu", "no_hp_ibu"],
    4: ["asal_sekolah"],
    5: [],
};

// ─── Fungsi validasi satu field ───────────────────────────────────────────────

function validateField(name, value) {
    const rule = validationRules[name];
    if (!rule) return "";

    const strVal = String(value ?? "").trim();

    if (rule.required && !strVal) return `${rule.label} wajib diisi`;
    if (!strVal) return ""; // kosong & tidak required → ok

    if (rule.minLength && strVal.length < rule.minLength)
        return `${rule.label} minimal ${rule.minLength} karakter`;

    if (rule.maxLength && strVal.length > rule.maxLength)
        return `${rule.label} maksimal ${rule.maxLength} karakter`;

    if (rule.pattern && !rule.pattern.test(strVal))
        return rule.patternMsg || `${rule.label} tidak valid`;

    if (rule.type === "number") {
        const num = Number(strVal);
        if (isNaN(num)) return `${rule.label} harus berupa angka`;
        if (rule.min !== undefined && num < rule.min)
            return `${rule.label} minimal ${rule.min}`;
        if (rule.max !== undefined && num > rule.max)
            return `${rule.label} maksimal ${rule.max}`;
    }

    return "";
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function SectionTitle({ icon, title }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-lg font-bold text-green-900 tracking-tight">{title}</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-transparent" />
        </div>
    );
}

function FormCard({ children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 md:p-8">
            {children}
        </div>
    );
}

const Field = memo(function Field({
    label,
    name,
    type = "text",
    placeholder,
    options,
    required,
    value,
    onChange,
    onBlur,
    error,
    hint,
}) {
    const hasError = !!error;
    const cls = hasError ? inputErrorClass : inputClass;

    return (
        <div>
            <label className={labelClass}>
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {options ? (
                <select
                    name={name}
                    className={cls}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
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
                    name={name}
                    className={cls + " resize-none h-24"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    className={cls}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            )}

            {hint && !hasError && (
                <p className="text-gray-400 text-xs mt-1">{hint}</p>
            )}
            {hasError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
});

// Field khusus upload file
function FileField({ label, name, required, onChange, error, accept, hint }) {
    return (
        <div>
            <label className={labelClass}>
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={onChange}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-800 file:font-semibold hover:file:bg-green-200 transition cursor-pointer"
            />
            {hint && !error && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
            {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}

// ─── Komponen utama ───────────────────────────────────────────────────────────

export default function Create({ tahun_ajaran }) {
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 5;

    // clientErrors: validasi sisi klien realtime
    const [clientErrors, setClientErrors] = useState({});
    // touched: field mana saja yang sudah pernah di-blur/diisi
    const [touched, setTouched] = useState({});

    const { data, setData, post, processing, errors: serverErrors } = useForm({
        nama_lengkap: "",
        nisn: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        anak_ke: "",
        jumlah_saudara: "",
        alamat_lengkap: "",
        rt: "",
        rw: "",
        kelurahan: "",
        kecamatan: "",
        kota_kabupaten: "",
        provinsi: "",
        kode_pos: "",
        no_hp_siswa: "",
        email: "",
        nama_ayah: "",
        pekerjaan_ayah: "",
        pendidikan_ayah: "",
        no_hp_ayah: "",
        nama_ibu: "",
        pekerjaan_ibu: "",
        pendidikan_ibu: "",
        no_hp_ibu: "",
        nama_wali: "",
        hubungan_wali: "",
        no_hp_wali: "",
        asal_sekolah: "",
        alamat_sekolah: "",
        tahun_lulus: "",
        alasan_memilih_sekolah: "",
        prestasi: "",
        foto_3x4: null,
        ijazah: null,
        kk: null,
        akta_kelahiran: null,
    });

    // Gabungkan error server + client. Client error lebih prioritas jika sudah di-touch.
    const errors = (name) => {
        if (touched[name] && clientErrors[name]) return clientErrors[name];
        return serverErrors[name] || "";
    };

    // onChange: validasi realtime, hanya tampil jika sudah di-touch
    const handleChange = useCallback(
        (e) => {
            const { name, value, type } = e.target;
            if (type === "date" && value !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

            setData(name, value);

            // Validasi realtime hanya jika field sudah pernah di-sentuh
            setTouched((prev) => {
                if (!prev[name]) return prev;
                return prev;
            });
            setClientErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        },
        [setData]
    );

    // onBlur: tandai sebagai touched, lalu validasi
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setClientErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    }, []);

    // Upload file
    const handleFileChange = useCallback(
        (e) => {
            const { name, files } = e.target;
            if (files && files[0]) {
                setData(name, files[0]);
            }
        },
        [setData]
    );

    // Validasi semua field di step saat ini sebelum lanjut
    const validateStep = (currentStep) => {
        const fields = requiredByStep[currentStep] || [];
        let newErrors = {};
        let newTouched = {};
        let valid = true;

        fields.forEach((name) => {
            const err = validateField(name, data[name]);
            newTouched[name] = true;
            if (err) {
                newErrors[name] = err;
                valid = false;
            }
        });

        // Tambah validasi format untuk field opsional yang sudah diisi di step ini
        const allFieldsInStep = getFieldsInStep(currentStep);
        allFieldsInStep.forEach((name) => {
            if (data[name] && !newErrors[name]) {
                const err = validateField(name, data[name]);
                if (err) {
                    newErrors[name] = err;
                    newTouched[name] = true;
                    valid = false;
                }
            }
        });

        setClientErrors((prev) => ({ ...prev, ...newErrors }));
        setTouched((prev) => ({ ...prev, ...newTouched }));
        return valid;
    };

    const getFieldsInStep = (s) => {
        switch (s) {
            case 1: return ["nama_lengkap","nisn","nik","tempat_lahir","tanggal_lahir","jenis_kelamin","anak_ke","jumlah_saudara","no_hp_siswa","email"];
            case 2: return ["alamat_lengkap","rt","rw","kelurahan","kecamatan","kota_kabupaten","provinsi","kode_pos"];
            case 3: return ["nama_ayah","pekerjaan_ayah","no_hp_ayah","nama_ibu","pekerjaan_ibu","no_hp_ibu","nama_wali","no_hp_wali"];
            case 4: return ["asal_sekolah","tahun_lulus","alamat_sekolah","alasan_memilih_sekolah","prestasi"];
            default: return [];
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((s) => Math.min(TOTAL_STEPS, s + 1));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pendaftaran.store"), {
            forceFormData: true, // penting untuk upload file
        });
    };

    // Helper props untuk Field
    const f = (name) => ({
        name,
        value: data[name] ?? "",
        onChange: handleChange,
        onBlur: handleBlur,
        error: errors(name),
    });

    // Hitung progress validasi per step untuk indikator
    const stepHasError = (s) => {
        return getFieldsInStep(s).some(
            (name) => touched[name] && clientErrors[name]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

            {/* ── Navbar ── */}
            <nav className="bg-white border-b border-green-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-900 text-sm font-semibold transition"
                    >
                        <span className="text-base">←</span>
                        <span>Beranda</span>
                    </Link>
                    <span className="text-green-200 select-none">|</span>
                    <span className="text-green-800 text-sm font-bold">
                        🎓 PPDB MTs Darul Ihsan
                    </span>
                    {tahun_ajaran && (
                        <>
                            <span className="text-green-200 select-none">|</span>
                            <span className="text-xs text-green-600 font-medium">TA {tahun_ajaran}</span>
                        </>
                    )}
                </div>
            </nav>

            {/* ── Stepper ── */}
            <div className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-3">
                    <div className="flex items-center">
                        {STEPS.map((s, i) => {
                            const idx = i + 1;
                            const active = idx === step;
                            const done = idx < step;
                            const hasErr = stepHasError(idx);
                            return (
                                <div key={i} className="flex items-center gap-1.5 flex-1">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                                hasErr && done
                                                    ? "bg-red-400 text-white"
                                                    : done
                                                    ? "bg-green-500 text-white"
                                                    : active
                                                    ? "bg-yellow-400 text-green-900 ring-2 ring-yellow-300"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                        >
                                            {done ? (hasErr ? "!" : "✓") : idx}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold hidden sm:block ${
                                                active ? "text-green-800" : done ? "text-green-600" : "text-gray-400"
                                            }`}
                                        >
                                            {s.icon} {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${
                                                done ? "bg-green-400" : "bg-gray-200"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Form Body ── */}
            <div className="max-w-4xl mx-auto px-4 py-10">
                <form onSubmit={handleSubmit} noValidate>

                    {/* STEP 1 — Data Diri Siswa */}
                    {step === 1 && (
                        <FormCard>
                            <SectionTitle icon="🎒" title="Data Diri Siswa" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <Field {...f("nama_lengkap")} label="Nama Lengkap" placeholder="Nama lengkap sesuai akta" required />
                                </div>
                                <Field {...f("nisn")} label="NISN" placeholder="10 digit angka" hint="Contoh: 1234567890" />
                                <Field {...f("nik")} label="NIK" placeholder="16 digit angka" hint="Sesuai KTP/KK" />
                                <Field {...f("tempat_lahir")} label="Tempat Lahir" placeholder="Kota/Kabupaten" required />
                                <Field {...f("tanggal_lahir")} label="Tanggal Lahir" type="date" required />
                                <Field
                                    {...f("jenis_kelamin")}
                                    label="Jenis Kelamin"
                                    options={[
                                        { value: "L", label: "Laki-laki" },
                                        { value: "P", label: "Perempuan" },
                                    ]}
                                    required
                                />
                                <Field {...f("anak_ke")} label="Anak ke-" type="number" placeholder="Contoh: 1" hint="Urutan kelahiran dalam keluarga" />
                                <Field {...f("jumlah_saudara")} label="Jumlah Saudara" type="number" placeholder="Contoh: 2" />
                                <Field {...f("no_hp_siswa")} label="No. HP Siswa" placeholder="08xx-xxxx-xxxx" hint="Format: 08xxxxxxxxxx" />
                                <Field {...f("email")} label="Email Siswa" type="email" placeholder="email@contoh.com" />
                            </div>
                        </FormCard>
                    )}

                    {/* STEP 2 — Alamat */}
                    {step === 2 && (
                        <FormCard>
                            <SectionTitle icon="🏠" title="Alamat Tempat Tinggal" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <Field {...f("alamat_lengkap")} label="Alamat Lengkap" type="textarea" placeholder="Jl. Contoh No. 1..." required />
                                </div>
                                <Field {...f("rt")} label="RT" placeholder="001" hint="Contoh: 001" />
                                <Field {...f("rw")} label="RW" placeholder="001" hint="Contoh: 001" />
                                <Field {...f("kelurahan")} label="Kelurahan / Desa" placeholder="Kelurahan" required />
                                <Field {...f("kecamatan")} label="Kecamatan" placeholder="Kecamatan" required />
                                <Field {...f("kota_kabupaten")} label="Kota / Kabupaten" placeholder="Kota/Kabupaten" required />
                                <Field {...f("provinsi")} label="Provinsi" placeholder="Provinsi" required />
                                <Field {...f("kode_pos")} label="Kode Pos" placeholder="60xxx" hint="5 digit angka" />
                            </div>
                        </FormCard>
                    )}

                    {/* STEP 3 — Orang Tua / Wali */}
                    {step === 3 && (
                        <FormCard>
                            <SectionTitle icon="👨‍👩‍👧" title="Data Orang Tua / Wali" />

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-5 bg-green-500 rounded-full" />
                                    <span className="font-bold text-green-900 text-sm">Data Ayah</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field {...f("nama_ayah")} label="Nama Ayah" placeholder="Nama lengkap ayah" required />
                                    <Field {...f("no_hp_ayah")} label="No. HP Ayah" placeholder="08xx-xxxx-xxxx" required />
                                    <Field {...f("pekerjaan_ayah")} label="Pekerjaan Ayah" placeholder="Pekerjaan" />
                                    <Field {...f("pendidikan_ayah")} label="Pendidikan Ayah" options={pendidikanOptions} />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-5 bg-yellow-400 rounded-full" />
                                    <span className="font-bold text-green-900 text-sm">Data Ibu</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field {...f("nama_ibu")} label="Nama Ibu" placeholder="Nama lengkap ibu" required />
                                    <Field {...f("no_hp_ibu")} label="No. HP Ibu" placeholder="08xx-xxxx-xxxx" required />
                                    <Field {...f("pekerjaan_ibu")} label="Pekerjaan Ibu" placeholder="Pekerjaan" />
                                    <Field {...f("pendidikan_ibu")} label="Pendidikan Ibu" options={pendidikanOptions} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-5 bg-green-300 rounded-full" />
                                    <span className="font-bold text-green-900 text-sm">Data Wali (jika ada)</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field {...f("nama_wali")} label="Nama Wali" placeholder="Nama lengkap wali" />
                                    <Field {...f("hubungan_wali")} label="Hubungan Wali" placeholder="Contoh: Paman" />
                                    <Field {...f("no_hp_wali")} label="No. HP Wali" placeholder="08xx-xxxx-xxxx" />
                                </div>
                            </div>
                        </FormCard>
                    )}

                    {/* STEP 4 — Sekolah Asal */}
                    {step === 4 && (
                        <FormCard>
                            <SectionTitle icon="🏫" title="Asal Sekolah & Informasi Tambahan" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field {...f("asal_sekolah")} label="Asal Sekolah" placeholder="Nama sekolah asal" required />
                                <Field {...f("tahun_lulus")} label="Tahun Lulus" type="number" placeholder={`Contoh: ${new Date().getFullYear()}`} />
                                <div className="md:col-span-2">
                                    <Field {...f("alamat_sekolah")} label="Alamat Sekolah" type="textarea" placeholder="Alamat lengkap sekolah asal" />
                                </div>
                                <div className="md:col-span-2">
                                    <Field {...f("alasan_memilih_sekolah")} label="Alasan Memilih MTs Darul Ihsan" type="textarea" placeholder="Tuliskan alasan Anda..." />
                                </div>
                                <div className="md:col-span-2">
                                    <Field {...f("prestasi")} label="Prestasi yang Pernah Diraih" type="textarea" placeholder="Sebutkan prestasi akademik/non-akademik (jika ada)" />
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <p className="text-xs font-semibold text-yellow-800 mb-2">📋 Ringkasan Data</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                    <span className="font-medium">Nama:</span>
                                    <span>{data.nama_lengkap || "-"}</span>
                                    <span className="font-medium">Tahun Ajaran:</span>
                                    <span>{tahun_ajaran || "-"}</span>
                                    <span className="font-medium">Asal Sekolah:</span>
                                    <span>{data.asal_sekolah || "-"}</span>
                                </div>
                            </div>
                        </FormCard>
                    )}

                    {/* STEP 5 — Upload Dokumen */}
                    {step === 5 && (
                        <FormCard>
                            <SectionTitle icon="📄" title="Upload Dokumen Persyaratan" />

                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                                <p className="font-semibold mb-1">📌 Ketentuan Upload:</p>
                                <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                                    <li>Format file: JPG, PNG, atau PDF</li>
                                    <li>Ukuran maksimal per file: 2 MB</li>
                                    <li>Pastikan dokumen jelas dan terbaca</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileField
                                    name="foto_3x4"
                                    label="Foto 3×4"
                                    required
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    hint="Format JPG/PNG, maks 2 MB"
                                />
                                <FileField
                                    name="ijazah"
                                    label="Ijazah / SKL"
                                    required
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    hint="Format JPG/PNG/PDF, maks 2 MB"
                                />
                                <FileField
                                    name="kk"
                                    label="Kartu Keluarga (KK)"
                                    required
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    hint="Format JPG/PNG/PDF, maks 2 MB"
                                />
                                <FileField
                                    name="akta_kelahiran"
                                    label="Akta Kelahiran"
                                    required
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    hint="Format JPG/PNG/PDF, maks 2 MB"
                                />
                            </div>

                            {/* Ringkasan akhir */}
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-xs font-semibold text-green-800 mb-3">✅ Ringkasan Pendaftaran</p>
                                <div className="grid grid-cols-2 gap-y-1.5 text-xs text-gray-700">
                                    <span className="font-medium">Nama:</span>
                                    <span>{data.nama_lengkap || "-"}</span>
                                    <span className="font-medium">Jenis Kelamin:</span>
                                    <span>{data.jenis_kelamin === "L" ? "Laki-laki" : data.jenis_kelamin === "P" ? "Perempuan" : "-"}</span>
                                    <span className="font-medium">Asal Sekolah:</span>
                                    <span>{data.asal_sekolah || "-"}</span>
                                    <span className="font-medium">Tahun Ajaran:</span>
                                    <span>{tahun_ajaran || "-"}</span>
                                    <span className="font-medium">Orang Tua:</span>
                                    <span>{data.nama_ayah || "-"} / {data.nama_ibu || "-"}</span>
                                </div>
                            </div>
                        </FormCard>
                    )}

                    {/* ── Navigasi ── */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className="px-6 py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-semibold hover:bg-green-50 disabled:opacity-30 transition"
                        >
                            ← Sebelumnya
                        </button>

                        {step < TOTAL_STEPS ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-md"
                            >
                                Selanjutnya →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 rounded-xl bg-yellow-400 text-green-900 text-sm font-bold hover:bg-yellow-300 transition shadow-md disabled:opacity-60"
                            >
                                {processing ? "Mengirim..." : "✅ Kirim Pendaftaran"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}