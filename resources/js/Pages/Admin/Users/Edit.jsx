import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, ArrowLeft } from 'lucide-react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Pencil size={18} color="#2563EB" />
                    <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                        Edit User
                    </h1>
                </div>
            }
        >
            <Head title="Edit User" />

            <div style={styles.page}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <Link href={route('users.index')} style={styles.back}>
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <Field label="Nama Lengkap" error={errors.name}>
                            <input
                                style={inputStyle(errors.name)}
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <input
                                style={inputStyle(errors.email)}
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="contoh@email.com"
                            />
                        </Field>

                        <div style={styles.divider} />
                        <p style={styles.hint}>Kosongkan password jika tidak ingin mengubahnya.</p>

                        <Field label="Password Baru" error={errors.password}>
                            <input
                                style={inputStyle(errors.password)}
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                            />
                        </Field>

                        <Field label="Konfirmasi Password Baru" error={errors.password_confirmation}>
                            <input
                                style={inputStyle(errors.password_confirmation)}
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password baru"
                            />
                        </Field>

                        <div style={styles.footer}>
                            <Link href={route('users.index')} style={styles.btnCancel}>Batal</Link>
                            <button type="submit" disabled={processing} style={styles.btnSubmit}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={styles.label}>{label}</label>
            {children}
            {error && <span style={styles.error}>{error}</span>}
        </div>
    );
}

const inputStyle = (err) => ({
    padding: '9px 12px', borderRadius: 8, border: `1px solid ${err ? '#FCA5A5' : '#E2E8F0'}`,
    fontSize: '0.875rem', color: '#0F172A', outline: 'none', background: err ? '#FEF2F2' : '#fff',
    width: '100%', boxSizing: 'border-box',
});

const styles = {
    page: { padding: '24px 20px', display: 'flex', justifyContent: 'center' },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', width: '100%', maxWidth: 520 },
    cardHeader: { padding: '14px 20px', borderBottom: '1px solid #F1F5F9' },
    back: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#64748B', textDecoration: 'none' },
    form: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
    label: { fontSize: '0.82rem', fontWeight: 600, color: '#374151' },
    error: { fontSize: '0.75rem', color: '#EF4444' },
    hint: { margin: 0, fontSize: '0.78rem', color: '#94A3B8' },
    divider: { height: 1, background: '#F1F5F9' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 },
    btnCancel: { display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 8, background: '#F1F5F9', color: '#475569', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' },
    btnSubmit: { padding: '8px 20px', borderRadius: 8, background: '#2563EB', color: '#fff', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' },
};