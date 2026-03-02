import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8001"
        : import.meta.env.VITE_API_URL;
export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        client_name: "",
        company: "",
        rating: 0,
        feedback: ""
    });

    // 🔥 Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const res = await fetch(`${API_URL}/reviews/`);
                if (!res.ok) throw new Error("Failed to fetch reviews");
                const data = await res.json();
                setReviews(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load reviews.");
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    // ⭐ Average rating
    const average =
        reviews.length > 0
            ? (
                reviews.reduce((acc, r) => acc + r.rating, 0) /
                reviews.length
            ).toFixed(1)
            : 0;

    // 🚀 Submit review (REAL TIME UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.rating === 0) {
            setError("Please select a rating.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/reviews/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Submission failed");

            const newReview = await res.json();

            // 🔥 Real-time update without refresh
            setReviews(prev => [newReview, ...prev]);

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });

            setForm({
                client_name: "",
                company: "",
                rating: 0,
                feedback: ""
            });

            setTimeout(() => setSuccess(false), 4000);

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 px-6 pb-20">

            {/* HEADER */}
            <div className="text-center mb-16">
                <p className="text-purple-500 tracking-widest">TESTIMONIALS</p>
                <h1 className="text-5xl font-bold mt-3">Client Reviews</h1>

                {!loading && (
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <span className="text-yellow-400 text-3xl">
                            {"★".repeat(Math.round(Number(average)))}
                        </span>
                        <span className="text-2xl font-semibold">{average}</span>
                        <span className="text-gray-400">
                            ({reviews.length} reviews)
                        </span>
                    </div>
                )}
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto mb-8 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-400 text-center font-medium"
                >
                    ✅ Review submitted successfully! Thank you.
                </motion.div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-center">
                    {error}
                </div>
            )}

            {/* LOADING */}
            {loading ? (
                <div className="text-center text-gray-400">Loading reviews...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-gray-900 p-6 rounded-2xl border border-purple-700 hover:border-purple-500 transition"
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`${star <= review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-600"
                                            } text-xl`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-300 mb-6">
                                "{review.feedback}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                    {review.client_name?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        {review.client_name}
                                    </p>
                                    {review.company && (
                                        <p className="text-gray-400 text-sm">
                                            {review.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FORM */}
            <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-6">
                    Share Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={form.client_name}
                            onChange={e =>
                                setForm({ ...form, client_name: e.target.value })
                            }
                            className="bg-gray-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Company"
                            value={form.company}
                            onChange={e =>
                                setForm({ ...form, company: e.target.value })
                            }
                            className="bg-gray-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <p className="text-gray-400 mb-2">Rating</p>
                        <div className="flex gap-2 text-3xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() =>
                                        setForm({ ...form, rating: star })
                                    }
                                    className={`cursor-pointer transition ${star <= form.rating
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your experience..."
                        value={form.feedback}
                        onChange={e =>
                            setForm({ ...form, feedback: e.target.value })
                        }
                        className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 rounded-xl font-semibold transition
                            ${submitting
                                ? "bg-purple-600/50 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
                            }`}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}