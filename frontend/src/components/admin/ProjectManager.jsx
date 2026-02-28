import React, { useState } from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, X, Save, Loader2, Upload } from "lucide-react";

const EMPTY = {
    title: "",
    description: "",
    tech_stack: [],
    category: "Custom",
    live_url: "",
    screenshot_url: "",
    client_name: "",
    client_testimonial: "",
    featured: false,
    year: new Date().getFullYear(),
};

const inputCls =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/60 transition-colors";

export default function ProjectManager({ projects, onUpdate }) {
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [techInput, setTechInput] = useState("");

    const openNew = () => {
        setForm(EMPTY);
        setEditing("new");
    };

    const openEdit = (p) => {
        setForm(p);
        setEditing(p.id);
    };

    const close = () => {
        setEditing(null);
        setForm(EMPTY);
    };

    const handleScreenshot = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setForm((f) => ({ ...f, screenshot_url: res.data.file_url }));
        } catch (error) {
            console.error("Upload failed:", error);
        }

        setUploading(false);
    };

    const addTech = () => {
        if (techInput.trim()) {
            setForm((f) => ({
                ...f,
                tech_stack: [...(f.tech_stack || []), techInput.trim()],
            }));
            setTechInput("");
        }
    };

    const save = async () => {
        setSaving(true);

        try {
            if (editing === "new") {
                await api.post("/projects", form);
            } else {
                await api.put(`/projects/${editing}`, form);
            }

            close();
            onUpdate();
        } catch (error) {
            console.error("Save failed:", error);
        }

        setSaving(false);
    };

    const remove = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            onUpdate();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <p className="text-white/40 text-sm">{projects.length} projects</p>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            {editing && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-violet-500/30 rounded-2xl p-6 mb-6 space-y-4"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-semibold">
                            {editing === "new" ? "New Project" : "Edit Project"}
                        </h3>
                        <button onClick={close}>
                            <X className="w-5 h-5 text-white/30 hover:text-white" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Title *"
                            value={form.title}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, title: e.target.value }))
                            }
                            className={inputCls}
                        />

                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, category: e.target.value }))
                            }
                            className={inputCls}
                        >
                            {[
                                "Portfolio",
                                "E-commerce",
                                "Blog",
                                "SaaS",
                                "Corporate",
                                "Custom",
                            ].map((c) => (
                                <option key={c} value={c} className="bg-[#0a0a0f]">
                                    {c}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Live URL"
                            value={form.live_url}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, live_url: e.target.value }))
                            }
                            className={inputCls}
                        />

                        <input
                            placeholder="Client Name"
                            value={form.client_name}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, client_name: e.target.value }))
                            }
                            className={inputCls}
                        />
                    </div>

                    <textarea
                        placeholder="Description *"
                        rows={3}
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className={inputCls + " resize-none w-full"}
                    />

                    <button
                        onClick={save}
                        disabled={saving || !form.title}
                        className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl text-white font-medium transition-colors"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Project
                            </>
                        )}
                    </button>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-white font-semibold truncate">
                                        {p.title}
                                    </p>
                                    <p className="text-white/30 text-xs">
                                        {p.category} · {p.year}
                                        {p.featured && " · ⭐ Featured"}
                                    </p>
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4 text-white/40" />
                                    </button>

                                    <button
                                        onClick={() => remove(p.id)}
                                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-white/40 text-sm mt-1 line-clamp-2">
                                {p.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}