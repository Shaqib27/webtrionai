import { useState, useEffect } from "react";
import { api } from "@/api/client";
import { useNavigate } from "react-router-dom";

const STATUSES = ["New", "In Progress", "Completed", "On Hold"];

const STATUS_COLORS = {
    "New": { bg: "rgba(139,92,246,0.18)", color: "#c4b5fd", border: "rgba(139,92,246,0.35)", dot: "#a78bfa" },
    "In Progress": { bg: "rgba(59,130,246,0.18)", color: "#93c5fd", border: "rgba(59,130,246,0.35)", dot: "#60a5fa" },
    "Completed": { bg: "rgba(16,185,129,0.18)", color: "#6ee7b7", border: "rgba(16,185,129,0.35)", dot: "#34d399" },
    "On Hold": { bg: "rgba(245,158,11,0.18)", color: "#fcd34d", border: "rgba(245,158,11,0.35)", dot: "#fbbf24" },
};

export default function Admin() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ total_requests: 0, revenue: 0, completion_rate: 0 });
    const [openId, setOpenId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [editingRevenue, setEditingRevenue] = useState(null); // { id, value }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ==============================
    // 🔐 Auth check on mount
    // ==============================
    useEffect(() => {
        api.get("/auth/me")
            .then(res => {
                if (res.data.role !== "admin") {
                    navigate("/");
                } else {
                    loadData();
                }
            })
            .catch(() => navigate("/"));
    }, []);

    // ==============================
    // 📦 Load stats + requests
    // ==============================
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, reqRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/requests"),
            ]);
            setStats(statsRes.data);
            setRequests(reqRes.data);
        } catch (err) {
            setError("Failed to load data. Please refresh.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // 🔄 Update status
    // ==============================
    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/admin/requests/${id}/status?status=${newStatus}`);

            // Update locally
            setRequests(prev =>
                prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
            );

            // Refresh stats so completion rate updates
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);

        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdatingId(null);
        }
    };

    // ==============================
    // 💰 Update revenue
    // ==============================
    const saveRevenue = async (id, value) => {
        const parsed = parseInt(value);
        if (isNaN(parsed)) return;
        try {
            await api.put(`/admin/requests/${id}/revenue?revenue=${parsed}`);

            setRequests(prev =>
                prev.map(r => r.id === id ? { ...r, revenue: parsed } : r)
            );

            // Refresh stats so total revenue updates
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);

        } catch (err) {
            console.error("Failed to update revenue", err);
        } finally {
            setEditingRevenue(null);
        }
    };

    // ==============================
    // 🔍 Filter + Search
    // ==============================
    const filtered = requests.filter(r => {
        const matchFilter = activeFilter === "All" || r.status === activeFilter;
        const matchSearch =
            r.business_name?.toLowerCase().includes(search.toLowerCase()) ||
            r.contact_email?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const statCards = [
        { label: "Total Requests", value: `${stats.total_requests}`, iconBg: "rgba(139,92,246,0.2)", icon: "📋" },
        { label: "Revenue", value: `$${(stats.revenue || 0).toLocaleString()}`, iconBg: "rgba(16,185,129,0.2)", icon: "💵" },
        { label: "Completion Rate", value: `${stats.completion_rate}%`, iconBg: "rgba(59,130,246,0.2)", icon: "✅", progress: true },
        { label: "Avg Satisfaction", value: "5.0", iconBg: "rgba(245,158,11,0.2)", icon: "⭐" },
    ];

    if (loading) return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Loading dashboard...
        </div>
    );

    if (error) return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontSize: 14 }}>
            {error}
        </div>
    );

    return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#fff", fontFamily: "'Inter',sans-serif", padding: "0 40px 60px" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.22); }
        select option { background: #111128; color: #fff; }
        .trow:hover td { background: rgba(255,255,255,0.018) !important; }
        .saving { animation: pulse 1s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .slide { animation: si .2s ease; }
        @keyframes si { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        button { transition: opacity .15s; }
        button:hover { opacity: .8; }
      `}</style>

            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "80px 0 32px" }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Admin Dashboard</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 6, fontSize: 14 }}>Manage projects, requests and reviews</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Welcome back,</p>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>Shaqib Hussain</p>
                </div>
            </div>

            {/* STAT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
                {statCards.map((c, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px 24px 20px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 16 }}>{c.icon}</div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 6 }}>{c.label}</p>
                        <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px" }}>{c.value}</p>
                        {c.progress && (
                            <div style={{ marginTop: 10, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${stats.completion_rate}%`, background: "#3b82f6", borderRadius: 99, transition: "width 0.6s ease" }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* TABLE CARD */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>

                {/* Toolbar */}
                <div style={{ padding: "24px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Client Requests</h2>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, gap: 16 }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            style={{ flex: 1, maxWidth: 380, padding: "10px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none" }}
                        />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["All", "New", "In Progress", "Completed", "On Hold"].map(f => {
                                const active = activeFilter === f;
                                const sc = STATUS_COLORS[f];
                                let s = { padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" };
                                if (active && f === "All") s = { ...s, background: "#7c3aed", border: "1px solid #7c3aed", color: "#fff" };
                                else if (active && sc) s = { ...s, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color };
                                return (
                                    <button key={f} style={s} onClick={() => setActiveFilter(f)}>
                                        {f}{f !== "All" ? ` (${requests.filter(r => r.status === f).length})` : ""}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Business", "Status", "Revenue", "Type", "Actions"].map(h => (
                                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, color: "rgba(255,255,255,0.28)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(req => (
                            <>
                                <tr key={req.id} className="trow">

                                    {/* Business */}
                                    <td style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(139,92,246,0.35),rgba(236,72,153,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#c4b5fd", flexShrink: 0 }}>
                                                {req.business_name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 500 }}>{req.business_name}</div>
                                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{req.contact_email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status dropdown */}
                                    <td style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[req.status]?.dot, flexShrink: 0 }} />
                                            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                                                <select
                                                    value={req.status}
                                                    disabled={updatingId === req.id}
                                                    onChange={e => updateStatus(req.id, e.target.value)}
                                                    style={{ padding: "5px 26px 5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${STATUS_COLORS[req.status]?.border}`, background: STATUS_COLORS[req.status]?.bg, color: STATUS_COLORS[req.status]?.color, outline: "none", cursor: "pointer", appearance: "none", WebkitAppearance: "none", opacity: updatingId === req.id ? 0.4 : 1 }}
                                                >
                                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <span style={{ position: "absolute", right: 8, pointerEvents: "none", color: STATUS_COLORS[req.status]?.color, fontSize: 8 }}>▼</span>
                                            </div>
                                            {updatingId === req.id && <span className="saving" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>saving…</span>}
                                        </div>
                                    </td>

                                    {/* Revenue — click to edit */}
                                    <td style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        {editingRevenue?.id === req.id ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <input
                                                    type="number"
                                                    value={editingRevenue.value}
                                                    onChange={e => setEditingRevenue({ id: req.id, value: e.target.value })}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") saveRevenue(req.id, editingRevenue.value);
                                                        if (e.key === "Escape") setEditingRevenue(null);
                                                    }}
                                                    autoFocus
                                                    style={{ width: 90, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, outline: "none" }}
                                                />
                                                <button onClick={() => saveRevenue(req.id, editingRevenue.value)} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7", fontSize: 11, cursor: "pointer" }}>✓</button>
                                                <button onClick={() => setEditingRevenue(null)} style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>✕</button>
                                            </div>
                                        ) : (
                                            <span
                                                onClick={() => setEditingRevenue({ id: req.id, value: req.revenue })}
                                                title="Click to edit revenue"
                                                style={{ fontSize: 14, fontWeight: 500, color: req.revenue > 0 ? "#34d399" : "rgba(255,255,255,0.25)", cursor: "pointer", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: 1 }}
                                            >
                                                ${(req.revenue || 0).toLocaleString()}
                                            </span>
                                        )}
                                    </td>

                                    {/* Type */}
                                    <td style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 6 }}>{req.website_type}</span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                        <button
                                            onClick={() => setOpenId(openId === req.id ? null : req.id)}
                                            style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: openId === req.id ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.12)", background: openId === req.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", color: openId === req.id ? "#c4b5fd" : "rgba(255,255,255,0.5)" }}
                                        >
                                            {openId === req.id ? "↑ Close" : "Details →"}
                                        </button>
                                    </td>
                                </tr>

                                {/* ✅ DETAILS PANEL — all fields from ClientRequest model */}
                                {openId === req.id && (
                                    <tr key={`${req.id}-detail`}>
                                        <td colSpan={5} style={{ padding: "8px 16px 16px", background: "rgba(0,0,0,0.25)" }}>
                                            <div className="slide" style={{ background: "#111120", borderRadius: 14, padding: "22px 26px", border: "1px solid rgba(255,255,255,0.07)" }}>

                                                {/* Panel header */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                    <p style={{ fontWeight: 600, fontSize: 15 }}>{req.business_name} — Full Details</p>
                                                    <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, background: STATUS_COLORS[req.status]?.bg, color: STATUS_COLORS[req.status]?.color, border: `1px solid ${STATUS_COLORS[req.status]?.border}` }}>{req.status}</span>
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px 32px" }}>

                                                    {/* ── Contact Info ── */}
                                                    <Field label="Contact Name" value={req.contact_name} full={undefined} />
                                                    <Field label="Email" value={req.contact_email} full={undefined} />
                                                    <Field label="Phone" value={req.contact_phone} full={undefined} />

                                                    {/* ── Project Info ── */}
                                                    <Field label="Website Type" value={req.website_type} full={undefined} />
                                                    <Field label="Budget Range" value={req.budget_range} full={undefined} />
                                                    <Field label="Deadline" value={req.deadline} full={undefined} />
                                                    <Field label="Industry" value={req.industry} full={undefined} />
                                                    <Field label="Target Audience" value={req.target_audience} full={undefined} />
                                                    <Field label="Design Preference" value={req.design_preference} full={undefined} />

                                                    {/* ── Full-width fields ── */}
                                                    <Field label="Required Pages" value={req.required_pages} full />
                                                    <Field label="Reference URLs" value={req.reference_urls} full />

                                                    {/* Features as tags */}
                                                    <div style={{ gridColumn: "1 / -1" }}>
                                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Features Needed</p>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                            {(req.features_needed || "")
                                                                .split(",")
                                                                .map(f => f.trim())
                                                                .filter(Boolean)
                                                                .map(f => (
                                                                    <span key={f} style={{ padding: "3px 12px", borderRadius: 6, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd", fontSize: 12 }}>{f}</span>
                                                                ))}
                                                        </div>
                                                    </div>

                                                    {/* Additional notes */}
                                                    <div style={{ gridColumn: "1 / -1" }}>
                                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Additional Notes</p>
                                                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.6 }}>
                                                            "{req.additional_notes || "No notes provided."}"
                                                        </p>
                                                    </div>

                                                    {/* File attachment */}
                                                    {req.file_url && (
                                                        <div style={{ gridColumn: "1 / -1" }}>
                                                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Attached File</p>
                                                            <a href={req.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#93c5fd", textDecoration: "underline" }}>View File ↗</a>
                                                        </div>
                                                    )}

                                                    {/* Revenue row */}
                                                    <div style={{ gridColumn: "1 / -1", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Revenue</p>
                                                        <p style={{ fontSize: 18, fontWeight: 700, color: req.revenue > 0 ? "#34d399" : "rgba(255,255,255,0.25)", marginLeft: 8 }}>
                                                            ${(req.revenue || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && !loading && (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                        No requests found.
                    </div>
                )}

                <div style={{ padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{filtered.length} of {requests.length} requests shown</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)", fontFamily: "monospace" }}>WebtrionAI Admin v1.0</span>
                </div>
            </div>
        </div>
    );
}

// ── Reusable field component ──
function Field({ label, value, full }) {
    return (
        <div style={full ? { gridColumn: "1 / -1" } : {}}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</p>
            <p style={{ fontSize: 13, color: value ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.2)" }}>{value || "—"}</p>
        </div>
    );
}