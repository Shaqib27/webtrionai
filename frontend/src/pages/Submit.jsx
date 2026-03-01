import React, { useState } from "react";
import { api } from "@/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, Loader2, ArrowRight, AlertCircle } from "lucide-react";

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
        additional_notes: "", file_url: "", budget: "", special_features: ""
    };

    const initialErrors = {
        business_name: "", industry: "", target_audience: "",
        website_type: "", design_preference: "", reference_urls: "",
        required_pages: "", features_needed: "", budget_range: "",
        deadline: "", contact_name: "", contact_email: "", contact_phone: "",
        additional_notes: "", file_url: "", budget: "", special_features: ""
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);

    const set = (k, v) => {
        setForm(p => ({ ...p, [k]: v }));
        // Clear error on change
        if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
    };

    const toggleFeature = f =>
        set("features_needed",
            form.features_needed.includes(f)
                ? form.features_needed.filter(x => x !== f)
                : [...form.features_needed, f]
        );

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

    const handleSubmit = async () => {
        if (!validateStep()) return;
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

    const validateStep = () => {
        const newErrors = {};

        if (step === 0) {
            if (!form.business_name.trim())
                newErrors.business_name = "Business name is required";
            else if (form.business_name.trim().length < 2)
                newErrors.business_name = "Business name must be at least 2 characters";

            if (form.target_audience && form.target_audience.trim().length < 3)
                newErrors.target_audience = "Please describe your target audience a bit more";
        }

        if (step === 1) {
            if (!form.website_type)
                newErrors.website_type = "Please select a website type";

            if (form.reference_urls) {
                const urls = form.reference_urls.split(",").map(u => u.trim()).filter(Boolean);
                const invalid = urls.some(u => !/^https?:\/\/.+\..+/.test(u));
                if (invalid) newErrors.reference_urls = "Enter valid URLs starting with http:// or https://";
            }
        }

        if (step === 2) {
            if (!form.budget) {
                newErrors.budget = "Budget is required";
            } else if (isNaN(Number(form.budget))) {
                newErrors.budget = "Budget must be a number";
            } else if (Number(form.budget) < 7000) {
                newErrors.budget = "Minimum budget must be ₹7000";
            }

            if (form.deadline) {
                const selected = new Date(form.deadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected < today) newErrors.deadline = "Deadline cannot be in the past";
            }
        }

        if (step === 3) {
            if (!form.contact_name.trim())
                newErrors.contact_name = "Name is required";
            else if (form.contact_name.trim().length < 2)
                newErrors.contact_name = "Name must be at least 2 characters";

            if (!form.contact_email.trim())
                newErrors.contact_email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email))
                newErrors.contact_email = "Enter a valid email address";

            if (!form.contact_phone.trim())
                newErrors.contact_phone = "Phone number is required";
            else if (!/^\+?[\d\s\-()]{10,15}$/.test(form.contact_phone.replace(/\s/g, "")))
                newErrors.contact_phone = "Enter a valid 10-digit phone number";
            else if (form.contact_phone.replace(/\D/g, "").length < 10)
                newErrors.contact_phone = "Phone number must be at least 10 digits";
        }

        setErrors(p => ({ ...p, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const isFormComplete =
        form.business_name &&
        form.website_type &&
        form.budget &&
        form.contact_email &&
        form.contact_name &&
        form.contact_phone;

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

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12">
                    {STEPS.map((label, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center relative">
                            {index !== 0 && (
                                <div className="absolute left-0 top-5 w-full h-[2px] bg-white/10 -z-10" />
                            )}
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                                ${step >= index ? "bg-violet-600 text-white" : "bg-white/10 text-white/40"}`}>
                                {index + 1}
                            </div>
                            <span className={`mt-3 text-sm transition-colors ${step >= index ? "text-violet-400" : "text-white/40"}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

                    {step === 0 && (
                        <>
                            <Field
                                label="Business Name *"
                                value={form.business_name}
                                onChange={v => set("business_name", v)}
                                placeholder="e.g. Acme Corp"
                                error={errors.business_name}
                            />
                            <Field
                                label="Industry"
                                value={form.industry}
                                onChange={v => set("industry", v)}
                                placeholder="e.g. Healthcare, Retail, Tech..."
                                error={errors.industry}
                            />
                            <Field
                                label="Target Audience"
                                value={form.target_audience}
                                onChange={v => set("target_audience", v)}
                                placeholder="Who are your customers?"
                                error={errors.target_audience}
                            />
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Project Details</h2>

                            <SelectField
                                label="Website Type *"
                                value={form.website_type}
                                onChange={v => set("website_type", v)}
                                options={["Web Apps", "E-Commerce", "SaaS", "Data Analytics", "AI / ML", "Corporate"]}
                                error={errors.website_type}
                            />
                            <SelectField
                                label="Design Preference"
                                value={form.design_preference}
                                onChange={v => set("design_preference", v)}
                                options={["Modern", "Minimal", "Corporate", "Creative", "Dark", "Light"]}
                                error={errors.design_preference}
                            />
                            <Field
                                label="Reference Websites"
                                value={form.reference_urls}
                                onChange={v => set("reference_urls", v)}
                                placeholder="https://example.com, https://..."
                                error={errors.reference_urls}
                            />
                            <div>
                                <label className="block text-sm text-white/60 mb-3">
                                    Any Special Features or Requirements?
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Let us know if there is anything specific you want for your project..."
                                    value={form.special_features}
                                    onChange={(e) => set("special_features", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-3">Brand Assets / Logo</label>
                                <label className="flex items-center gap-3 p-6 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors">
                                    <Upload className="w-5 h-5 text-white/30" />
                                    <span className="text-white/40 text-sm">
                                        {form.file_url ? "File uploaded ✓" : uploading ? "Uploading..." : "Upload files (logo, brand assets)"}
                                    </span>
                                    <input type="file" className="hidden" onChange={handleFile} />
                                </label>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Budget & Timeline</h2>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Budget (Minimum ₹7000) *</label>
                                <input
                                    type="number"
                                    min="7000"
                                    placeholder="Enter your budget"
                                    value={form.budget}
                                    onChange={(e) => set("budget", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none focus:border-violet-500
                                        ${errors.budget ? "border-red-500/70" : "border-white/10"}`}
                                />
                                <ErrorMessage message={errors.budget} />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Deadline</label>
                                <input
                                    type="date"
                                    value={form.deadline}
                                    onChange={e => set("deadline", e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
                                />
                                <ErrorMessage message={errors.deadline} />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Additional Notes</label>
                                <textarea
                                    rows={4}
                                    value={form.additional_notes}
                                    onChange={e => set("additional_notes", e.target.value)}
                                    placeholder="Anything else we should know?"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 resize-none"
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
                            <Field
                                label="Your Name *"
                                value={form.contact_name}
                                onChange={v => set("contact_name", v)}
                                placeholder="John Smith"
                                error={errors.contact_name}
                            />
                            <Field
                                label="Email Address *"
                                type="email"
                                value={form.contact_email}
                                onChange={v => set("contact_email", v)}
                                placeholder="john@example.com"
                                error={errors.contact_email}
                            />
                            <Field
                                label="Phone Number *"
                                type="tel"
                                value={form.contact_phone}
                                onChange={v => {
                                    // Only allow digits, +, spaces, dashes, brackets
                                    const cleaned = v.replace(/[^\d\s\+\-()]/g, "");
                                    set("contact_phone", cleaned);
                                }}
                                placeholder="+91 98765 43210"
                                error={errors.contact_phone}
                                hint={form.contact_phone ? `${form.contact_phone.replace(/\D/g, "").length} / 10 digits` : null}
                            />
                        </>
                    )}
                </motion.div>

                <div className="flex justify-between mt-8">
                    {step > 0 ? (
                        <button onClick={() => setStep(s => s - 1)}
                            className="px-6 py-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-colors">
                            Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button onClick={() => { if (validateStep()) setStep(s => s + 1); }}
                            className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors">
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !isFormComplete}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all
                                ${loading || !isFormComplete
                                    ? "bg-violet-600/40 text-white/60 cursor-not-allowed"
                                    : "bg-violet-600 hover:bg-violet-500 text-white"
                                }`}
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                : <>Submit Request <ArrowRight className="w-4 h-4" /></>
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Inline error message component
function ErrorMessage({ message }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
                >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}

function Field({ label, value, onChange, placeholder = "", type = "text", error, hint = null }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-white/60">{label}</label>
                {hint && <span className="text-xs text-white/30">{hint}</span>}
            </div>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors
                    ${error ? "border-red-500/70" : "border-white/10"}`}
            />
            <ErrorMessage message={error} />
        </div>
    );
}

function SelectField({ label, value, onChange, options, error }) {
    return (
        <div>
            <label className="block text-sm text-white/60 mb-2">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors
                    ${error ? "border-red-500/70" : "border-white/10"}`}
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <ErrorMessage message={error} />
        </div>
    );
}