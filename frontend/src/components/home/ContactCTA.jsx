import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export default function ContactCTA() {
    return (
        <section className="py-28 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-transparent border border-violet-500/20 rounded-3xl p-12 md:p-20 text-center overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[80px]" />
                    <div className="relative">
                        <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-6 block">Let's Work Together</span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                            Ready to Build Something Amazing?
                        </h2>
                        <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                            Tell us about your project and we'll turn your vision into a world-class digital product.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={createPageUrl("Submit")}
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:-translate-y-0.5">
                                Start Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to={createPageUrl("Reviews")}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold transition-all duration-300">
                                <Calendar className="w-5 h-5" /> Read Reviews
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}