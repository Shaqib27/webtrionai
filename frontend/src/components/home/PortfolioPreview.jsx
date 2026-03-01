import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Code2 } from "lucide-react";

const DUMMY_PROJECTS = [
    {
        id: "dummy-1",
        title: "AI Sales Forecasting Platform",
        category: "AI / ML",
        description:
            "Predictive analytics system for retail demand forecasting using machine learning models.",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
    {
        id: "dummy-2",
        title: "E-Commerce Analytics Dashboard",
        category: "Data Analytics",
        description:
            "Interactive business intelligence dashboard for tracking sales, users, and revenue insights.",
        image:
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
    },
    {
        id: "dummy-3",
        title: "SaaS Project Management Tool",
        category: "Web Application",
        description:
            "Full-stack SaaS platform with authentication, billing, and real-time collaboration.",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
];

export default function PortfolioPreview({ projects = [] }) {
    const [activeCategory, setActiveCategory] = useState("All");

    // ✅ Filter only valid projects
    const validProjects = projects.filter(
        (p) => p.title && p.description
    );

    // ✅ Use dummy if no valid real projects
    const baseProjects =
        validProjects.length > 0 ? validProjects : DUMMY_PROJECTS;

    // ✅ Dynamic categories from projects
    const categories = [
        "All",
        ...new Set(baseProjects.map((p) => p.category)),
    ];

    // ✅ Apply filter
    const filteredProjects =
        activeCategory === "All"
            ? baseProjects
            : baseProjects.filter(
                (p) => p.category === activeCategory
            );

    return (
        <section className="py-28 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
                >
                    <div>
                        <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">
                            Portfolio
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                            Selected Works
                        </h2>
                    </div>

                    <Link
                        to={createPageUrl("Portfolio")}
                        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors group"
                    >
                        View All Projects
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm transition ${activeCategory === cat
                                    ? "bg-violet-600 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-500"
                        >
                            {(p.screenshot_url || p.image) ? (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={p.screenshot_url || p.image}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-violet-900/30 to-indigo-900/30 flex items-center justify-center">
                                    <Code2 className="w-10 h-10 text-violet-400/30" />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-white">
                                        {p.title}
                                    </h3>

                                    {p.live_url && (
                                        <a
                                            href={p.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/30 hover:text-violet-400 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                <p className="text-white/40 text-sm line-clamp-2">
                                    {p.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}