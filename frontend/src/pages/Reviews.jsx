import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Star, CheckCircle2, Loader2 } from "lucide-react";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        client_name: "",
        company: "",
        rating: 5,
        feedback: ""
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get("/reviews?approved=true&limit=50");
                setReviews(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]);
            }
        };

        fetchReviews();
    }, []);

    const avg =
        reviews.length
            ? (
                reviews.reduce((s, r) => s + (r.rating || 0), 0) /
                reviews.length
            ).toFixed(1)
            : "—";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/reviews", { ...form, approved: false });
            setSubmitted(true);
            setForm({
                client_name: "",
                company: "",
                rating: 5,
                feedback: ""
            });
        } catch (error) {
            console.error("Submit failed:", error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-28 pb-20 px-6">
            <div className="max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">
                        Testimonials
                    </span>

                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                        Client Reviews
                    </h1>

                    <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-6 h-6 ${i < Math.round(Number(avg))
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-2xl font-bold text-white">{avg}</span>
                        <span className="text-white/40">
                            ({reviews.length} reviews)
                        </span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={r.id || i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors"
                        >
                            <div className="flex mb-3">
                                {[...Array(5)].map((_, j) => (
                                    <Star
                                        key={j}
                                        className={`w-4 h-4 ${j < r.rating
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-white/20"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed mb-5">
                                "{r.feedback}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                                    {r.client_name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">
                                        {r.client_name}
                                    </p>
                                    {r.company && (
                                        <p className="text-white/30 text-xs">
                                            {r.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Review */}
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Share Your Experience
                        </h2>
                        <p className="text-white/40 text-sm">
                            Your feedback helps us grow and improve.
                        </p>
                    </div>

                    {submitted ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center p-10 bg-white/5 rounded-2xl border border-white/10"
                        >
                            <CheckCircle2 className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                            <h3 className="text-white font-semibold text-lg mb-2">
                                Thank you!
                            </h3>
                            <p className="text-white/40 text-sm">
                                Your review is pending approval.
                            </p>
                        </motion.div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
                        >
                            {/* Form content unchanged */}
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}