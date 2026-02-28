import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const PLACEHOLDER = [
    { client_name: "Sarah Johnson", company: "TechFlow Inc", rating: 5, feedback: "Exceptional work. The team delivered our SaaS platform 2 weeks early and the quality exceeded every expectation. Highly recommend." },
    { client_name: "Marcus Lee", company: "RetailPro", rating: 5, feedback: "Our e-commerce conversion rate increased by 40% after the redesign. These guys understand both design and business." },
    { client_name: "Aisha Patel", company: "HealthBridge", rating: 5, feedback: "Professional, communicative, and technically brilliant. The best development agency we've worked with." },
];

export default function TestimonialsSlider({ reviews }) {
    const items = reviews.length > 0 ? reviews : PLACEHOLDER;
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
        return () => clearInterval(t);
    }, [items.length]);

    const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "5.0";

    return (
        <section className="py-28 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">Reviews</span>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-4">
                        What Clients Say
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                        <span className="text-white/50 text-sm ml-2">{avg} average rating</span>
                    </div>
                </motion.div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 text-center relative">
                            <Quote className="w-10 h-10 text-violet-500/30 mx-auto mb-6" />
                            <p className="text-white/70 text-xl md:text-2xl leading-relaxed font-light mb-8 italic">
                                "{items[idx].feedback}"
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                                    {items[idx].client_name?.[0]}
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-semibold">{items[idx].client_name}</p>
                                    {items[idx].company && <p className="text-white/30 text-sm">{items[idx].company}</p>}
                                </div>
                                <div className="flex ml-4">
                                    {[...Array(items[idx].rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-3 mt-8">
                        <button onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                            <ChevronLeft className="w-5 h-5 text-white/40" />
                        </button>
                        <div className="flex gap-2 items-center">
                            {items.map((_, i) => (
                                <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all duration-300 ${i === idx ? "w-6 h-2 bg-violet-500" : "w-2 h-2 bg-white/20"}`} />
                            ))}
                        </div>
                        <button onClick={() => setIdx(i => (i + 1) % items.length)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-5 h-5 text-white/40" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}