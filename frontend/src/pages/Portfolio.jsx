import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";

const DUMMY_PROJECTS = [
    {
        id: "dummy-1",
        title: "AI Sales Forecasting Platform",
        category: "AI / ML",
        description:
            "Predictive analytics system for retail demand forecasting using machine learning models.",
    },
    {
        id: "dummy-2",
        title: "E-Commerce Analytics Dashboard",
        category: "Data Analytics",
        description:
            "Interactive business intelligence dashboard for tracking sales, users, and revenue insights.",
    },
    {
        id: "dummy-3",
        title: "SaaS Project Management Tool",
        category: "Web Application",
        description:
            "Full-stack SaaS platform with authentication, billing, and real-time collaboration.",
    },
];

export default function Portfolio() {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/projects");
                setProjects(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // ✅ Keep only valid projects
    const validProjects = projects.filter(
        (p) => p?.title && p?.description
    );

    // ✅ Use dummy if no real projects
    const baseProjects =
        validProjects.length > 0 ? validProjects : DUMMY_PROJECTS;

    // ✅ Dynamic categories
    const categories = [
        "All",
        ...new Set(baseProjects.map((p) => p.category)),
    ];

    // ✅ Apply filter
    const filtered =
        filter === "All"
            ? baseProjects
            : baseProjects.filter((p) => p.category === filter);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">
                        Our Work
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                        Projects We're Proud Of
                    </h1>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto">
                        Each project is built with precision, purpose, and a relentless focus on results.
                    </p>
                </motion.div>

                {/* Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-14">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20 text-white/30">
                        Loading projects...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((project, i) => (
                            <motion.div
                                key={project?.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-500"
                            >
                                <div className="p-6">
                                    <span className="text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">
                                        {project?.category}
                                    </span>

                                    <h3 className="text-lg font-bold mt-2 text-white">
                                        {project?.title}
                                    </h3>

                                    <p className="text-white/40 text-sm mt-2">
                                        {project?.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}