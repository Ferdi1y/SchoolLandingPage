import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';

export default function Index({ users }) {
    const handleDelete = (id) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        router.delete(route('users.destroy', id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={18} color="#2563EB" />
                        <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                            Manajemen User
                        </h1>
                    </div>
                    <Link href={route('users.create')} style={styles.btnPrimary}>
                        <Plus size={14} /> Tambah User
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen User" />

            <div style={styles.page}>
                <div style={styles.card}>
                    {users.length === 0 ? (
                        <div style={styles.empty}>
                            <Users size={40} color="#CBD5E1" />
                            <p style={{ color: '#94A3B8', marginTop: 8 }}>Belum ada user.</p>
                        </div>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.thead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Nama</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Bergabung</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={user.id} style={styles.tr}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>
                                            <div style={styles.userCell}>
                                                <div style={styles.avatar}>
                                                    {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 500, color: '#0F172A' }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, color: '#64748B' }}>{user.email}</td>
                                        <td style={{ ...styles.td, color: '#64748B' }}>
                                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </td>
                                        <td style={{ ...styles.td, textAlign: 'right' }}>
                                            <div style={styles.actions}>
                                                <Link href={route('users.edit', user.id)} style={styles.btnEdit}>
                                                    <Pencil size={13} /> Edit
                                                </Link>
                                                <button onClick={() => handleDelete(user.id)} style={styles.btnDelete}>
                                                    <Trash2 size={13} /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const styles = {
    page: { padding: '24px 20px' },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' },
    empty: { padding: 60, textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#F8FAFC' },
    th: { padding: '11px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', textAlign: 'left', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' },
    tr: { borderBottom: '1px solid #F1F5F9', transition: 'background 0.1s' },
    td: { padding: '12px 16px', fontSize: '0.85rem' },
    userCell: { display: 'flex', alignItems: 'center', gap: 10 },
    avatar: { width: 30, height: 30, borderRadius: 6, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', flexShrink: 0 },
    actions: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#2563EB', color: '#fff', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' },
    btnEdit: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: '#F1F5F9', color: '#475569', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none' },
    btnDelete: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: '#FEF2F2', color: '#EF4444', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, border: 'none', cursor: 'pointer' },
};