import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Code2 } from "lucide-react";

export default function PortfolioPreview({ projects }) {
    return (
        <section className="py-28 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                    <div>
                        <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">Portfolio</span>
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                            Selected Works
                        </h2>
                    </div>
                    <Link to={createPageUrl("Portfolio")} className="flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors group">
                        View All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {projects.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-white/5 flex items-center justify-center">
                                <Code2 className="w-10 h-10 text-white/10" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-500">
                                {p.screenshot_url ? (
                                    <div className="h-48 overflow-hidden">
                                        <img src={p.screenshot_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-violet-900/30 to-indigo-900/30 flex items-center justify-center">
                                        <Code2 className="w-10 h-10 text-violet-400/30" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white">{p.title}</h3>
                                        {p.live_url && (
                                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-violet-400 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-white/40 text-sm line-clamp-2">{p.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}