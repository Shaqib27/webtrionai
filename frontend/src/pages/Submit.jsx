import React, { useState } from "react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, Loader2, ArrowRight } from "lucide-react";

const FEATURES = ["Payment Gateway", "User Login / Auth", "Admin Dashboard", "API Integration", "CMS / Blog", "SEO Optimization", "Multi-language", "Dark Mode", "Analytics", "Chat / Support", "Email Marketing", "Custom Animations"];
const STEPS = ["Business Info", "Project Details", "Budget & Timeline", "Contact"];

export default function Submit() {
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const initialForm = {
        business_name: "", industry: "", target_audience: "",
        website_type: "", design_preference: "", reference_urls: "",
        required_pages: "", features_needed: [], budget_range: "",
        deadline: "", contact_name: "", contact_email: "", contact_phone: "",
        additional_notes: "", file_url: ""
    };

    const [form, setForm] = useState(initialForm);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const toggleFeature = f =>
        set("features_needed",
            form.features_needed.includes(f)
                ? form.features_needed.filter(x => x !== f)
                : [...form.features_needed, f]
        );

    // ✅ File Upload
    const handleFile = async e => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            set("file_url", res.data.file_url);
        } catch (error) {
            console.error("Upload failed:", error);
        }

        setUploading(false);
    };

    // ✅ Submit Request
    const handleSubmit = async () => {
        setLoading(true);

        try {
            await api.post("/requests", form);
            setSubmitted(true);
            setForm(initialForm);
            setStep(0);
        } catch (error) {
            console.error("Submit failed:", error);
        }

        setLoading(false);
    };

    if (submitted) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
                <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
                <p className="text-white/50 mb-8">
                    We've received your project details and will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors">
                    Submit Another Request
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-28 pb-20 px-6">
            <div className="max-w-2xl mx-auto">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4 block">Get Started</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                        Tell Us About Your Project
                    </h1>
                    <p className="text-white/40">
                        Fill in the details below and we'll craft a custom solution for you.
                    </p>
                </motion.div>

                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

                    {step === 0 && (
                        <>
                            <Field label="Business Name *" value={form.business_name}
                                onChange={v => set("business_name", v)} />
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <SelectField label="Website Type *"
                                value={form.website_type}
                                onChange={v => set("website_type", v)}
                                options={["Portfolio", "E-commerce", "Blog", "SaaS", "Corporate", "Custom"]} />

                            <div>
                                <label className="block text-sm text-white/60 mb-3">Features Needed</label>
                                <div className="flex flex-wrap gap-2">
                                    {FEATURES.map(f => (
                                        <button key={f}
                                            type="button"
                                            onClick={() => toggleFeature(f)}
                                            className={`px-3 py-1.5 rounded-lg text-sm border ${form.features_needed.includes(f)
                                                    ? "bg-violet-600/30 border-violet-500 text-violet-300"
                                                    : "bg-white/5 border-white/10 text-white/40"
                                                }`}>
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Upload Files</label>
                                <label className="flex items-center gap-3 p-4 border border-dashed border-white/20 rounded-xl cursor-pointer">
                                    <Upload className="w-5 h-5 text-white/30" />
                                    <span className="text-white/40 text-sm">
                                        {form.file_url ? "File uploaded ✓" : uploading ? "Uploading..." : "Upload file"}
                                    </span>
                                    <input type="file" className="hidden" onChange={handleFile} />
                                </label>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Field label="Email Address *"
                                value={form.contact_email}
                                onChange={v => set("contact_email", v)}
                                type="email" />
                        </>
                    )}
                </motion.div>

                <div className="flex justify-between mt-8">
                    {step > 0 ? (
                        <button onClick={() => setStep(s => s - 1)}
                            className="px-6 py-3 bg-white/5 text-white/60 rounded-xl">
                            Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button onClick={() => setStep(s => s + 1)}
                            className="px-8 py-3 bg-violet-600 text-white rounded-xl">
                            Continue
                        </button>
                    ) : (
                        <button onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl">
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Request <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}