import React, { useState, useEffect } from "react";
import { api } from "@/api/client";   // ✅ replaced base44
import { motion } from "framer-motion";
import AdminStats from "@/components/admin/AdminStats";
import RequestsTable from "@/components/admin/RequestsTable";
import ProjectManager from "@/components/admin/ProjectManager";
import ReviewManager from "@/components/admin/ReviewManager";

const TABS = ["Submissions", "Projects", "Reviews"];


import { DollarSign, CheckCircle, Star, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const [openId, setOpenId] = useState(null)
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_requests: 0,
        revenue: 0,
        completion_rate: 0
    });

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.role !== "admin") {
                    navigate("/");
                } else {
                    loadData(token);
                }
            })
            .catch(() => {
                navigate("/");
            });

    }, []);

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem("token")

        await fetch(`http://localhost:8001/projects/${id}/status?status=${newStatus}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        // Update UI locally
        setRequests(prev =>
            prev.map(r =>
                r.id === id ? { ...r, status: newStatus } : r
            )
        )
    }
    const loadData = async (token) => {
        try {
            const statsRes = await api.get("/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const reqRes = await api.get("/admin/requests", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStats(statsRes.data);
            setRequests(reqRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white px-10 py-28">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <p className="text-white/50 mt-2">
                        Manage projects, requests and reviews
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-white/40">Welcome back,</p>
                    <p className="font-semibold">Shaqib Hussain</p>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-10">

                <StatCard
                    icon={<Package />}
                    title="Total Requests"
                    value={stats.total_requests}
                    color="bg-violet-500/20 text-violet-400"
                />

                <StatCard
                    icon={<DollarSign />}
                    title="Revenue"
                    value={`$${stats.revenue}`}
                    color="bg-green-500/20 text-green-400"
                />

                <StatCard
                    icon={<CheckCircle />}
                    title="Completion Rate"
                    value={`${stats.completion_rate}%`}
                    color="bg-blue-500/20 text-blue-400"
                />

                <StatCard
                    icon={<Star />}
                    title="Avg Satisfaction"
                    value="5.0"
                    color="bg-yellow-500/20 text-yellow-400"
                />
            </div>

            {/* REQUEST TABLE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <h2 className="text-2xl font-semibold mb-6">
                    Client Requests
                </h2>

                {/* SEARCH + FILTERS */}
                <div className="flex justify-between mb-6">
                    <input
                        placeholder="Search by name or email..."
                        className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                    />

                    <div className="flex gap-3">
                        <FilterButton label="All" active />
                        <FilterButton label="New" active={undefined} />
                        <FilterButton label="In Progress" active={undefined} />
                        <FilterButton label="Completed" active={undefined} />
                        <FilterButton label="On Hold" active={undefined} />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="border-b border-white/10 text-white/60">
                        <tr>
                            <th className="pb-3">Business</th>
                            <th>Status</th>
                            <th>Revenue</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id} className="border-b border-white/10">
                                <td className="py-4">
                                    <div className="font-medium">
                                        {req.business_name}
                                    </div>
                                    <div className="text-white/40 text-sm">
                                        {req.contact_email}
                                    </div>
                                </td>

                                <td>
                                    <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm">
                                        {req.status}
                                    </span>
                                </td>

                                <td>${req.revenue}</td>

                                <td>
                                    {/* <button 
                                    </button> */}
                                    <button
                                        onClick={() =>
                                            setOpenId(openId === req.id ? null : req.id)
                                        }
                                        className="px-3 py-1 bg-violet-600 rounded-lg text-sm">
                                        Details
                                    </button>
                                </td>
                                {openId === req.id && (
                                    <div className="w-full bg-gray-900 p-8 rounded-xl mb-6 mt-4">

                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-semibold text-white">
                                                {req.business_name}
                                            </h2>
                                            <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                                                {req.status}
                                            </span>
                                        </div>

                                        {/* Grid Layout */}
                                        <div className="grid grid-cols-2 gap-8 text-gray-300">

                                            <div>
                                                <p className="text-gray-400">Email</p>
                                                <p>{req.email}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Project Type</p>
                                                <p>{req.project_type}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Budget</p>
                                                <p>{req.budget}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Industry</p>
                                                <p>{req.industry}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Target Audience</p>
                                                <p>{req.target_audience}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Design Preference</p>
                                                <p>{req.design_preference}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Contact Name</p>
                                                <p>{req.contact_name}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Phone</p>
                                                <p>{req.phone}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Deadline</p>
                                                <p>{req.deadline}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Reference URLs</p>
                                                <p>{req.reference_urls}</p>
                                            </div>

                                            {/* Full width section */}
                                            <div className="col-span-2">
                                                <p className="text-gray-400">Required Pages</p>
                                                <p>{req.required_pages}</p>
                                            </div>

                                            <div className="col-span-2">
                                                <p className="text-gray-400">Notes</p>
                                                <p>{req.notes}</p>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* COMPONENTS */

function StatCard({ icon, title, value, color }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-4 ${color}`}>
                {icon}
            </div>
            <p className="text-white/50">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}

function FilterButton({ label, active }) {
    return (
        <button
            className={`px-4 py-2 rounded-xl text-sm 
                ${active
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-white/60"
                }`}
        >
            {label}
        </button>
    );
}