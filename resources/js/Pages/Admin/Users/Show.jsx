import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { User, ArrowLeft, Pencil } from 'lucide-react';

export default function Show({ user }) {
    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={18} color="#2563EB" />
                    <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                        Detail User
                    </h1>
                </div>
            }
        >
            <Head title="Detail User" />

            <div style={styles.page}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <Link href={route('users.index')} style={styles.back}>
                            <ArrowLeft size={14} /> Kembali
                        </Link>
                    </div>

                    <div style={styles.body}>
                        {/* Avatar */}
                        <div style={styles.avatarWrap}>
                            <div style={styles.avatar}>
                                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                            <div>
                                <div style={styles.name}>{user.name}</div>
                                <div style={styles.email}>{user.email}</div>
                            </div>
                        </div>

                        <div style={styles.divider} />

                        {/* Detail rows */}
                        <div style={styles.rows}>
                            <Row label="ID" value={`#${user.id}`} />
                            <Row label="Nama" value={user.name} />
                            <Row label="Email" value={user.email} />
                            <Row
                                label="Email Terverifikasi"
                                value={user.email_verified_at
                                    ? new Date(user.email_verified_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : 'Belum terverifikasi'}
                            />
                            <Row
                                label="Bergabung"
                                value={new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            />
                        </div>

                        <div style={styles.footer}>
                            <Link href={route('users.edit', user.id)} style={styles.btnEdit}>
                                <Pencil size={13} /> Edit User
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Row({ label, value }) {
    return (
        <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ width: 160, fontSize: '0.82rem', color: '#94A3B8', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 500 }}>{value}</span>
        </div>
    );
}

const styles = {
    page: { padding: '24px 20px', display: 'flex', justifyContent: 'center' },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', width: '100%', maxWidth: 520 },
    cardHeader: { padding: '14px 20px', borderBottom: '1px solid #F1F5F9' },
    back: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#64748B', textDecoration: 'none' },
    body: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
    avatarWrap: { display: 'flex', alignItems: 'center', gap: 14 },
    avatar: { width: 52, height: 52, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', flexShrink: 0 },
    name: { fontSize: '1rem', fontWeight: 700, color: '#0F172A' },
    email: { fontSize: '0.82rem', color: '#94A3B8', marginTop: 2 },
    divider: { height: 1, background: '#F1F5F9' },
    rows: { display: 'flex', flexDirection: 'column' },
    footer: { display: 'flex', justifyContent: 'flex-end', paddingTop: 4 },
    btnEdit: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#2563EB', color: '#fff', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' },
};