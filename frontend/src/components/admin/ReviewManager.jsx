import React from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Star, Check, Trash2 } from "lucide-react";

export default function ReviewManager({ reviews, onUpdate }) {
    const approve = async (id) => {
        try {
            await api.put(`/reviews/${id}`, { approved: true });
            onUpdate();
        } catch (error) {
            console.error("Approve failed:", error);
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`/reviews/${id}`);
            onUpdate();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const pending = reviews.filter((r) => !r.approved);
    const approved = reviews.filter((r) => r.approved);

    return (
        <div className="space-y-8">
            {pending.length > 0 && (
                <div>
                    <h3 className="text-white/40 text-sm font-medium uppercase tracking-wider mb-4">
                        Pending Approval ({pending.length})
                    </h3>
                    <div className="space-y-3">
                        {pending.map((r, i) => (
                            <ReviewCard
                                key={r.id}
                                review={r}
                                i={i}
                                onApprove={approve}
                                onDelete={remove}
                                pending
                            />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-white/40 text-sm font-medium uppercase tracking-wider mb-4">
                    Approved ({approved.length})
                </h3>
                <div className="space-y-3">
                    {approved.map((r, i) => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            i={i}
                            onDelete={remove}
                        />
                    ))}

                    {approved.length === 0 && (
                        <p className="text-white/20 text-sm py-4">
                            No approved reviews yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review: r, i, onApprove, onDelete, pending }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`bg-white/5 border rounded-2xl p-5 flex gap-4 ${pending ? "border-amber-500/20" : "border-white/10"
                }`}
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, j) => (
                        <Star
                            key={j}
                            className={`w-4 h-4 ${j < r.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-white/20"
                                }`}
                        />
                    ))}

                    {pending && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2">
                            Pending
                        </span>
                    )}
                </div>

                <p className="text-white/60 text-sm italic mb-3">
                    "{r.feedback}"
                </p>

                <p className="text-white/40 text-xs">
                    {r.client_name}
                    {r.company ? ` · ${r.company}` : ""}
                </p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
                {pending && onApprove && (
                    <button
                        onClick={() => onApprove(r.id)}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors"
                    >
                        <Check className="w-4 h-4 text-emerald-400" />
                    </button>
                )}

                <button
                    onClick={() => onDelete(r.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>
        </motion.div>
    );
}