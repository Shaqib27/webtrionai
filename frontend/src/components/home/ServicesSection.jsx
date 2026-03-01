import React from "react";
import { motion } from "framer-motion";
import { Globe, ShoppingCart, LayoutDashboard, Smartphone, Zap, Shield, Cpu, Brain, BarChart3, Database } from "lucide-react";

const SERVICES = [
    {
        icon: Globe,
        title: "Full-Stack Web Development",
        desc: "Modern web applications built with React, Next.js, FastAPI, and scalable cloud backends. Secure, fast, and production-ready.",
        color: "violet"
    },
    {
        icon: ShoppingCart,
        title: "E-commerce Solutions",
        desc: "High-performance online stores with payment integration, analytics dashboards, and optimized checkout flows.",
        color: "indigo"
    },
    {
        icon: Database,
        title: "Big Data Engineering",
        desc: "Design and build scalable data pipelines using Hadoop, Spark, PySpark, Kafka, and cloud data lakes for real-time and batch processing.",
        color: "fuchsia"
    },
    {
        icon: BarChart3,
        title: "Data Analytics & BI",
        desc: "Transform raw data into actionable insights using Python, SQL, Power BI/Tableau, and interactive dashboards.",
        color: "cyan"
    },
    {
        icon: Brain,
        title: "AI & Machine Learning Models",
        desc: "Build predictive models, recommendation systems, and intelligent automation using ML, Deep Learning, and NLP.",
        color: "emerald"
    },
    {
        icon: Cpu,
        title: "AI-Powered Automation",
        desc: "Integrate AI into web platforms for chatbots, forecasting systems, anomaly detection, and smart decision engines.",
        color: "amber"
    }
];

const colorMap = {
    violet: "from-violet-500/20 to-violet-500/0 border-violet-500/20 group-hover:border-violet-500/40",
    indigo: "from-indigo-500/20 to-indigo-500/0 border-indigo-500/20 group-hover:border-indigo-500/40",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/0 border-fuchsia-500/20 group-hover:border-fuchsia-500/40",
    pink: "from-pink-500/20 to-pink-500/0 border-pink-500/20 group-hover:border-pink-500/40",
    amber: "from-amber-500/20 to-amber-500/0 border-amber-500/20 group-hover:border-amber-500/40",
    emerald: "from-emerald-500/20 to-emerald-500/0 border-emerald-500/20 group-hover:border-emerald-500/40",
};
const iconColor = { violet: "text-violet-400", indigo: "text-indigo-400", fuchsia: "text-fuchsia-400", pink: "text-pink-400", amber: "text-amber-400", emerald: "text-emerald-400" };

export default function ServicesSection() {
    return (
        <section className="py-28 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">What We Do</span>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-4">
                        Services Built for Results
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto">We don't just write code — we build digital assets that drive growth.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((s, i) => (
                        <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className={`group relative bg-gradient-to-b ${colorMap[s.color]} border rounded-2xl p-8 transition-all duration-300`}>
                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${iconColor[s.color]}`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-3">{s.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}