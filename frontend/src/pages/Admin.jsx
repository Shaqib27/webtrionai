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

function Field({ label, value, full }) {
    return (
        <div style={full ? { gridColumn: "1 / -1" } : {}}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>{label}</p>
            <p style={{ fontSize: 13, color: value ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.2)", margin: 0 }}>{value || "—"}</p>
        </div>
    );
}

function DetailPanel({ req, isMobile }) {
    return (
        <div style={{ background: "#111120", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.07)", marginTop: isMobile ? 12 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{req.business_name} — Full Details</p>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: STATUS_COLORS[req.status]?.bg, color: STATUS_COLORS[req.status]?.color, border: `1px solid ${STATUS_COLORS[req.status]?.border}` }}>{req.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "16px 28px" }}>
                <Field label="Contact Name" value={req.contact_name} full={undefined} />
                <Field label="Email" value={req.contact_email} full={undefined} />
                <Field label="Phone" value={req.contact_phone} full={undefined} />
                <Field label="Website Type" value={req.website_type} full={undefined} />
                <Field label="Budget Range" value={req.budget_range} full={undefined} />
                <Field label="Deadline" value={req.deadline} full={undefined} />
                <Field label="Industry" value={req.industry} full={undefined} />
                <Field label="Target Audience" value={req.target_audience} full={undefined} />
                <Field label="Design Preference" value={req.design_preference} full={undefined} />
                <Field label="Required Pages" value={req.required_pages} full />
                <Field label="Reference URLs" value={req.reference_urls} full />

                <div style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>Features Needed</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {(req.features_needed || "").split(",").map(f => f.trim()).filter(Boolean).map(f => (
                            <span key={f} style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd", fontSize: 12 }}>{f}</span>
                        ))}
                    </div>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>Additional Notes</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>"{req.additional_notes || "No notes provided."}"</p>
                </div>

                {req.file_url && (
                    <div style={{ gridColumn: "1 / -1" }}>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>Attached File</p>
                        <a href={req.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#93c5fd", textDecoration: "underline" }}>View File ↗</a>
                    </div>
                )}

                <div style={{ gridColumn: "1 / -1", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>Revenue</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: req.revenue > 0 ? "#34d399" : "rgba(255,255,255,0.25)", margin: "0 0 0 8px" }}>${(req.revenue || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default function Admin() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ total_requests: 0, revenue: 0, completion_rate: 0 });
    const [openId, setOpenId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [editingRevenue, setEditingRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    // Detect screen size
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    // Auth check
    useEffect(() => {
        api.get("/auth/me")
            .then(res => {
                if (res.data.role !== "admin") navigate("/");
                else loadData();
            })
            .catch(() => navigate("/"));
    }, []);

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
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/admin/requests/${id}/status?status=${newStatus}`);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const saveRevenue = async (id, value) => {
        const parsed = parseInt(value);
        if (isNaN(parsed)) return;
        try {
            await api.put(`/admin/requests/${id}/revenue?revenue=${parsed}`);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, revenue: parsed } : r));
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);
        } catch (err) {
            console.error("Failed to update revenue", err);
        } finally {
            setEditingRevenue(null);
        }
    };

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

    const StatusSelect = ({ req }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[req.status]?.dot, flexShrink: 0 }} />
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <select
                    value={req.status}
                    disabled={updatingId === req.id}
                    onChange={e => updateStatus(req.id, e.target.value)}
                    style={{ padding: "5px 24px 5px 9px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${STATUS_COLORS[req.status]?.border}`, background: STATUS_COLORS[req.status]?.bg, color: STATUS_COLORS[req.status]?.color, outline: "none", cursor: "pointer", appearance: "none", WebkitAppearance: "none", opacity: updatingId === req.id ? 0.4 : 1 }}
                >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ position: "absolute", right: 7, pointerEvents: "none", color: STATUS_COLORS[req.status]?.color, fontSize: 8 }}>▼</span>
            </div>
            {updatingId === req.id && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", animation: "pulse 1s infinite" }}>saving…</span>}
        </div>
    );

    const RevenueCell = ({ req }) => (
        editingRevenue?.id === req.id ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <input
                    type="number"
                    value={editingRevenue.value}
                    onChange={e => setEditingRevenue({ id: req.id, value: e.target.value })}
                    onKeyDown={e => {
                        if (e.key === "Enter") saveRevenue(req.id, editingRevenue.value);
                        if (e.key === "Escape") setEditingRevenue(null);
                    }}
                    autoFocus
                    style={{ width: 80, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, outline: "none" }}
                />
                <button onClick={() => saveRevenue(req.id, editingRevenue.value)} style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7", fontSize: 11, cursor: "pointer" }}>✓</button>
                <button onClick={() => setEditingRevenue(null)} style={{ padding: "4px 7px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
        ) : (
            <span
                onClick={() => setEditingRevenue({ id: req.id, value: req.revenue })}
                title="Click to edit revenue"
                style={{ fontSize: 13, fontWeight: 500, color: req.revenue > 0 ? "#34d399" : "rgba(255,255,255,0.25)", cursor: "pointer", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: 1 }}
            >
                ${(req.revenue || 0).toLocaleString()}
            </span>
        )
    );

    if (loading) return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Loading dashboard...
        </div>
    );

    if (error) return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
                <p style={{ color: "#f87171", marginBottom: 12 }}>{error}</p>
                <button onClick={loadData} style={{ padding: "8px 20px", borderRadius: 8, background: "#7c3aed", border: "none", color: "#fff", cursor: "pointer", fontSize: 13 }}>Retry</button>
            </div>
        </div>
    );

    return (
        <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#fff", fontFamily: "'Inter',sans-serif", padding: isMobile ? "0 14px 60px" : "0 40px 60px" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.22); }
        select option { background: #111128; color: #fff; }
        .trow:hover td { background: rgba(255,255,255,0.015) !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .slide { animation: si .2s ease; }
        @keyframes si { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        button { transition: opacity .15s; }
        button:hover { opacity: .82; }
      `}</style>

            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: isMobile ? "70px 0 20px" : "88px 0 32px" }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? 22 : 32, fontWeight: 700, letterSpacing: "-0.5px" }}>Admin Dashboard</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 5, fontSize: 13 }}>Manage projects, requests and reviews</p>
                </div>
                {!isMobile && (
                    <div style={{ textAlign: "right" }}>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Welcome back,</p>
                        <p style={{ fontWeight: 600, fontSize: 15 }}>Shaqib Hussain</p>
                    </div>
                )}
            </div>

            {/* STAT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 18, marginBottom: 22 }}>
                {statCards.map((c, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: isMobile ? 14 : 18, padding: isMobile ? "14px" : "22px 22px 18px" }}>
                        <div style={{ width: isMobile ? 30 : 38, height: isMobile ? 30 : 38, borderRadius: 9, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 14 : 17, marginBottom: isMobile ? 10 : 14 }}>{c.icon}</div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: isMobile ? 11 : 12, marginBottom: 4 }}>{c.label}</p>
                        <p style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{c.value}</p>
                        {c.progress && (
                            <div style={{ marginTop: 8, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${stats.completion_rate}%`, background: "#3b82f6", borderRadius: 99, transition: "width 0.6s ease" }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* TABLE CARD */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden" }}>

                {/* Toolbar */}
                <div style={{ padding: isMobile ? "16px 14px 0" : "22px 22px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 600, marginBottom: 14 }}>Client Requests</h2>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", paddingBottom: 16, gap: 10 }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            style={{ flex: 1, maxWidth: isMobile ? "100%" : 340, padding: "9px 14px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none" }}
                        />
                        <div style={{ display: "flex", gap: 7, overflowX: isMobile ? "auto" : "visible", flexWrap: isMobile ? "nowrap" : "wrap", paddingBottom: isMobile ? 2 : 0 }}>
                            {["All", "New", "In Progress", "Completed", "On Hold"].map(f => {
                                const active = activeFilter === f;
                                const sc = STATUS_COLORS[f];
                                let s = { padding: "5px 11px", borderRadius: 9, fontSize: 11, fontWeight: 500, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" };
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

                {/* DESKTOP TABLE */}
                {!isMobile && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                            <thead>
                                <tr>
                                    {["Business", "Status", "Revenue", "Type", "Actions"].map(h => (
                                        <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.28)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(req => (
                                    <>
                                        <tr key={req.id} className="trow">
                                            <td style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,rgba(139,92,246,0.35),rgba(236,72,153,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c4b5fd", flexShrink: 0 }}>
                                                        {req.business_name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{req.business_name}</div>
                                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{req.contact_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><StatusSelect req={req} /></td>
                                            <td style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><RevenueCell req={req} /></td>
                                            <td style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", padding: "3px 9px", borderRadius: 6 }}>{req.website_type}</span>
                                            </td>
                                            <td style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <button onClick={() => setOpenId(openId === req.id ? null : req.id)}
                                                    style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: openId === req.id ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.12)", background: openId === req.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", color: openId === req.id ? "#c4b5fd" : "rgba(255,255,255,0.5)" }}>
                                                    {openId === req.id ? "↑ Close" : "Details →"}
                                                </button>
                                            </td>
                                        </tr>
                                        {openId === req.id && (
                                            <tr key={`${req.id}-d`}>
                                                <td colSpan={5} style={{ padding: "8px 16px 16px", background: "rgba(0,0,0,0.25)" }}>
                                                    <div className="slide"><DetailPanel req={req} isMobile={false} /></div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* MOBILE CARDS */}
                {isMobile && (
                    <div>
                        {filtered.map(req => (
                            <div key={req.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(139,92,246,0.35),rgba(236,72,153,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#c4b5fd", flexShrink: 0 }}>
                                            {req.business_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{req.business_name}</div>
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{req.contact_email}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{req.website_type}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <StatusSelect req={req} />
                                    <RevenueCell req={req} />
                                </div>

                                <button onClick={() => setOpenId(openId === req.id ? null : req.id)}
                                    style={{ width: "100%", padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: openId === req.id ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.12)", background: openId === req.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", color: openId === req.id ? "#c4b5fd" : "rgba(255,255,255,0.5)" }}>
                                    {openId === req.id ? "↑ Hide Details" : "View Details →"}
                                </button>

                                {openId === req.id && (
                                    <div className="slide"><DetailPanel req={req} isMobile={true} /></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No requests found.</div>
                )}

                <div style={{ padding: "11px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{filtered.length} of {requests.length} requests shown</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)", fontFamily: "monospace" }}>WebtrionAI Admin v1.0</span>
                </div>
            </div>
        </div>
    );
}