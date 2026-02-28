import React, { useState, useEffect } from "react";
import { api } from "@/api/client";   // ✅ replaced base44
import { motion } from "framer-motion";
import AdminStats from "@/components/admin/AdminStats";
import RequestsTable from "@/components/admin/RequestsTable";
import ProjectManager from "@/components/admin/ProjectManager";
import ReviewManager from "@/components/admin/ReviewManager";

const TABS = ["Submissions", "Projects", "Reviews"];

export default function Admin() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("Submissions");
    const [requests, setRequests] = useState([]);
    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/login";
                return;
            }

            const res = await api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const u = res.data;
            setUser(u);

            if (u?.role === "admin") {
                loadData();
            } else {
                setLoading(false);
            }

        } catch (error) {
            console.error("Auth failed:", error);
            window.location.href = "/login";
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const [r, p, rv] = await Promise.all([
                api.get("/requests", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/projects", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/reviews", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setRequests(r.data);
            setProjects(p.data);
            setReviews(rv.data);

        } catch (error) {
            console.error("Load data failed:", error);
        }

        setLoading(false);
    };

    if (!user) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (user.role !== "admin") return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">
            <div className="text-center">
                <p className="text-2xl font-bold mb-2">Access Denied</p>
                <p className="text-white/40">Admin access required.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-white/40 mt-1">Manage projects, requests and reviews</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 text-sm">Welcome back,</p>
                        <p className="text-white font-medium">{user.full_name}</p>
                    </div>
                </div>

                <AdminStats requests={requests} projects={projects} reviews={reviews} />

                <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8 mt-10">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === t
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                                    : "text-white/40 hover:text-white"
                                }`}>
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === "Submissions" && <RequestsTable requests={requests} onUpdate={loadData} />}
                        {activeTab === "Projects" && <ProjectManager projects={projects} onUpdate={loadData} />}
                        {activeTab === "Reviews" && <ReviewManager reviews={reviews} onUpdate={loadData} />}
                    </>
                )}
            </div>
        </div>
    );
}