import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialsSlider({ reviews = [] }) {

    // 🔹 Filter valid reviews only
    // const items = useMemo(() => {
    //     return reviews.filter(r => r.feedback && r.client_name);
    // }, [reviews]);
    const items = reviews;

    const [idx, setIdx] = useState(0);

    // 🔹 Reset index if items change
    useEffect(() => {
        if (idx >= items.length) {
            setIdx(0);
        }
    }, [items.length, idx]);

    // 🔹 Auto slide
    useEffect(() => {
        if (!items.length) return;

        const interval = setInterval(() => {
            setIdx(prev => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items.length]);

    // 🔹 No reviews → don't render section
    if (!items.length) return null;

    // 🔹 Calculate average rating
    const avg = Number(
        (
            items.reduce((sum, r) => sum + (r.rating || 0), 0) /
            items.length
        ).toFixed(1)
    );

    const current = items[idx];

    return (
        <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase block mb-3">
                        Reviews
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-4">
                        What Clients Say
                    </h2>

                    <div className="flex items-center justify-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(avg)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-white/20"
                                    }`}
                            />
                        ))}
                        <span className="text-white/50 text-sm ml-2">
                            {avg} average rating
                        </span>
                    </div>
                </motion.div>

                {/* Slider */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-14 text-center relative"
                        >
                            <Quote className="w-10 h-10 text-violet-500/30 mx-auto mb-6" />

                            <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-light mb-8 italic">
                                "{current.feedback}"
                            </p>

                            {/* Client Info */}
                            <div className="flex items-center justify-center gap-4 flex-wrap">

                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                                    {current.client_name?.[0]}
                                </div>

                                <div className="text-left">
                                    <p className="text-white font-semibold">
                                        {current.client_name}
                                    </p>
                                    {current.company && (
                                        <p className="text-white/30 text-sm">
                                            {current.company}
                                        </p>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex ml-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= (current.rating || 0)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-white/20"
                                                }`}
                                        />
                                    ))}
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex justify-center gap-3 mt-8">

                        <button
                            onClick={() =>
                                setIdx(i => (i - 1 + items.length) % items.length)
                            }
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition"
                        >
                            <ChevronLeft className="w-5 h-5 text-white/40" />
                        </button>

                        <div className="flex gap-2 items-center">
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIdx(i)}
                                    className={`rounded-full transition-all duration-300 ${i === idx
                                        ? "w-6 h-2 bg-violet-500"
                                        : "w-2 h-2 bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() =>
                                setIdx(i => (i + 1) % items.length)
                            }
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition"
                        >
                            <ChevronRight className="w-5 h-5 text-white/40" />
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}