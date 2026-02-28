import React from "react";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, CheckCircle2, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminStats({ requests, projects, reviews }) {
    const total = requests.length;
    const completed = requests.filter(r => r.status === "Completed").length;
    const revenue = requests.reduce((s, r) => s + (r.revenue || 0), 0);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "—";
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    const statusData = ["New", "In Progress", "Completed", "On Hold"].map(s => ({
        name: s, count: requests.filter(r => r.status === s).length
    }));

    const CARDS = [
        { label: "Total Requests", value: total, icon: Briefcase, color: "violet" },
        { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "emerald" },
        { label: "Completion Rate", value: `${completionRate}%`, icon: CheckCircle2, color: "indigo" },
        { label: "Avg Satisfaction", value: avgRating, icon: Star, color: "amber" },
    ];

    const colors = { violet: "text-violet-400 bg-violet-500/10", emerald: "text-emerald-400 bg-emerald-500/10", indigo: "text-indigo-400 bg-indigo-500/10", amber: "text-amber-400 bg-amber-500/10" };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CARDS.map((c, i) => (
                    <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[c.color]}`}>
                            <c.icon className="w-5 h-5" />
                        </div>
                        <p className="text-white/40 text-xs font-medium mb-1">{c.label}</p>
                        <p className="text-2xl font-bold text-white">{c.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white/60 text-sm font-medium mb-6">Requests by Status</h3>
                <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={statusData} barSize={32}>
                        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {statusData.map((_, i) => (
                                <Cell key={i} fill={["#8b5cf6", "#6366f1", "#10b981", "#f59e0b"][i]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}