import React, { useState } from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Search, Eye, ExternalLink } from "lucide-react";

const STATUS_COLORS = {
    New: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "In Progress": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "On Hold": "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export default function RequestsTable({ requests, onUpdate }) {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [updating, setUpdating] = useState(null);

    const filtered = requests.filter((r) => {
        const matchFilter = filter === "All" || r.status === filter;
        const matchSearch =
            !search ||
            r.business_name?.toLowerCase().includes(search.toLowerCase()) ||
            r.contact_email?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await api.put(`/requests/${id}`, { status });
            onUpdate();
        } catch (error) {
            console.error("Status update failed:", error);
        }
        setUpdating(null);
    };

    const updateRevenue = async (id, revenue) => {
        try {
            await api.put(`/requests/${id}`, {
                revenue: parseFloat(revenue) || 0,
            });
            onUpdate();
        } catch (error) {
            console.error("Revenue update failed:", error);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {["All", "New", "In Progress", "Completed", "On Hold"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s
                                    ? "bg-violet-600 text-white"
                                    : "bg-white/5 text-white/40 hover:bg-white/10"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.length === 0 && (
                    <p className="text-center text-white/20 py-10">
                        No submissions found.
                    </p>
                )}

                {filtered.map((r, i) => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-white truncate">
                                        {r.business_name}
                                    </h3>

                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[r.status] || STATUS_COLORS["New"]
                                            }`}
                                    >
                                        {r.status || "New"}
                                    </span>
                                </div>

                                <p className="text-white/40 text-sm">
                                    {r.contact_email} · {r.website_type} · {r.budget_range}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <input
                                    type="number"
                                    placeholder="Revenue $"
                                    defaultValue={r.revenue || ""}
                                    onBlur={(e) => updateRevenue(r.id, e.target.value)}
                                    className="w-28 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
                                />

                                <select
                                    value={r.status || "New"}
                                    onChange={(e) => updateStatus(r.id, e.target.value)}
                                    disabled={updating === r.id}
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                                >
                                    {["New", "In Progress", "Completed", "On Hold"].map(
                                        (s) => (
                                            <option key={s} value={s} className="bg-[#0a0a0f]">
                                                {s}
                                            </option>
                                        )
                                    )}
                                </select>

                                <button
                                    onClick={() =>
                                        setSelected(selected?.id === r.id ? null : r)
                                    }
                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 text-sm transition-colors flex items-center gap-1"
                                >
                                    <Eye className="w-4 h-4" /> Details
                                </button>
                            </div>
                        </div>

                        {selected?.id === r.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="border-t border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                            >
                                {r.additional_notes && (
                                    <div className="md:col-span-2">
                                        <span className="text-white/30 block">Notes</span>
                                        <span className="text-white/60">
                                            {r.additional_notes}
                                        </span>
                                    </div>
                                )}

                                {r.file_url && (
                                    <div className="md:col-span-2">
                                        <a
                                            href={r.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" /> View uploaded file
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}