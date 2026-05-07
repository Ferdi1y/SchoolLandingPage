import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

const statusConfig = {
    pending: {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-400",
    },
    verifikasi: {
        label: "Verifikasi",
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-400",
    },
    diterima: {
        label: "Diterima",
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
    },
    ditolak: {
        label: "Ditolak",
        bg: "bg-red-100",
        text: "text-red-600",
        dot: "bg-red-400",
    },
    cadangan: {
        label: "Cadangan",
        bg: "bg-orange-100",
        text: "text-orange-700",
        dot: "bg-orange-400",
    },
};

export default function Index({ pendaftaran, filters }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const [search, setSearch] = useState(filters?.search ?? "");
    const [status, setStatus] = useState(filters?.status ?? "all");

    const handleFilter = (newFilters) => {
        router.get(route("admin.pendaftaran.index"), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const statCounts = {
        total: pendaftaran.total,
        pending: pendaftaran.data.filter((p) => p.status === "pending").length,
        diterima: pendaftaran.data.filter((p) => p.status === "diterima").length,
        ditolak: pendaftaran.data.filter((p) => p.status === "ditolak").length,
    };

    const stats = [
        {
            label: "Total Pendaftar",
            value: pendaftaran.total,
            icon: "👥",
            color: "from-blue-500 to-blue-600",
        },
        {
            label: "Menunggu Verifikasi",
            value: pendaftaran.data.filter((p) => p.status === "pending").length,
            icon: "⏳",
            color: "from-yellow-400 to-yellow-500",
        },
        {
            label: "Diterima",
            value: pendaftaran.data.filter((p) => p.status === "diterima").length,
            icon: "✅",
            color: "from-green-500 to-green-600",
        },
        {
            label: "Ditolak",
            value: pendaftaran.data.filter((p) => p.status === "ditolak").length,
            icon: "❌",
            color: "from-red-400 to-red-500",
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Manajemen PPDB
                        </h2>
                        <p className="text-xs text-gray-500">
                            MTs Darul Ihsan — Penerimaan Peserta Didik Baru
                        </p>
                    </div>
                </div>
            }
        >
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Flash message */}
                    {flash.success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-700 text-sm font-medium flex items-center gap-2">
                            ✅ {flash.success}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-md`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    <span className="text-3xl font-black">
                                        {s.value}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold opacity-90">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filter & Search */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                    placeholder="Cari nama, nomor pendaftaran, NISN..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            handleFilter({ search, status });
                                    }}
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilter({
                                        search,
                                        status: e.target.value,
                                    });
                                }}
                            >
                                <option value="all">Semua Status</option>
                                {Object.entries(statusConfig).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleFilter({ search, status })}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow"
                            >
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-sm">
                                Daftar Pendaftar
                            </h3>
                            <span className="text-xs text-gray-400">
                                {pendaftaran.total} data
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="text-left px-5 py-3 font-semibold">
                                            No. Daftar
                                        </th>
                                        <th className="text-left px-5 py-3 font-semibold">
                                            Nama Siswa
                                        </th>
                                        <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">
                                            Asal Sekolah
                                        </th>
                                        <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">
                                            Tahun Ajaran
                                        </th>
                                        <th className="text-left px-5 py-3 font-semibold">
                                            Status
                                        </th>
                                        <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">
                                            Tanggal Daftar
                                        </th>
                                        <th className="text-center px-5 py-3 font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {pendaftaran.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-12 text-gray-400"
                                            >
                                                <div className="text-4xl mb-2">📭</div>
                                                <p className="text-sm">
                                                    Tidak ada data pendaftaran
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        pendaftaran.data.map((item) => {
                                            const st =
                                                statusConfig[item.status] ??
                                                statusConfig.pending;
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-blue-50/30 transition"
                                                >
                                                    <td className="px-5 py-3.5">
                                                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                                                            {item.nomor_pendaftaran}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <p className="font-semibold text-gray-800">
                                                            {item.nama_lengkap}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {item.nisn
                                                                ? `NISN: ${item.nisn}`
                                                                : "NISN belum diisi"}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 text-xs">
                                                        {item.asal_sekolah ?? "-"}
                                                    </td>
                                                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-600 text-xs">
                                                        {item.tahun_ajaran}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                                                            />
                                                            {st.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">
                                                        {item.created_at
                                                            ? new Date(
                                                                  item.created_at
                                                              ).toLocaleDateString(
                                                                  "id-ID",
                                                                  {
                                                                      day: "2-digit",
                                                                      month: "short",
                                                                      year: "numeric",
                                                                  }
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.pendaftaran.show",
                                                                    item.id
                                                                )}
                                                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                                                            >
                                                                Detail
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "admin.pendaftaran.edit",
                                                                    item.id
                                                                )}
                                                                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pendaftaran.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    Halaman {pendaftaran.current_page} dari{" "}
                                    {pendaftaran.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {pendaftaran.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? "#"}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}