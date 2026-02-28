import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_#0a0a0f_100%)]" />
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </div>

            <div className="relative max-w-5xl mx-auto text-center z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm text-white/60">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        Full-Stack Web Development Agency
                    </div>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
                    <span className="bg-gradient-to-br from-white via-white to-white/30 bg-clip-text text-transparent">
                        We Build
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                        Digital Experiences
                    </span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    From sleek portfolios to enterprise SaaS platforms — we engineer web solutions that convert visitors into customers and ideas into revenue.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={createPageUrl("Submit")}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
                        Start Your Project
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to={createPageUrl("Portfolio")}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-2xl font-semibold text-lg transition-all duration-300">
                        <Code2 className="w-5 h-5" /> View Our Work
                    </Link>
                </motion.div>

                {/* Floating tech badges */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="flex flex-wrap gap-3 justify-center mt-16">
                    {["React", "Next.js", "Node.js", "Python", "PostgreSQL", "AWS", "Tailwind CSS", "TypeScript"].map((tech, i) => (
                        <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/30 text-xs font-medium">
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
                <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
        </section>
    );
}