import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ value, suffix }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;

        let start = null;
        const duration = 1800;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [inView, value]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection({ stats = [] }) {

    if (!stats.length) return null;

    return (
        <section className="py-20 px-6 border-y border-white/5">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center"
                    >
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                            <Counter value={s.value} suffix={s.suffix} />
                        </div>

                        <p className="text-white/40 text-sm font-medium">
                            {s.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}