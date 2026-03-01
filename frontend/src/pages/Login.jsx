import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/api/client";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const isFormValid = form.email && form.password;

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email: form.email,
                password: form.password
            });

            // Save token
            localStorage.setItem("token", res.data.access_token);

            setLoading(false);

            // Redirect to home so Layout loads user
            window.location.href = "/";

        } catch (err) {
            setLoading(false);
            alert("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-white/40">
                        Login to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => handleChange("email", e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={e => handleChange("password", e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-white/40"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-white/50">
                            <input
                                type="checkbox"
                                checked={form.remember}
                                onChange={e => handleChange("remember", e.target.checked)}
                                className="accent-violet-600"
                            />
                            Remember me
                        </label>

                        <button
                            type="button"
                            className="text-violet-400 hover:text-violet-300"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                            ${!isFormValid || loading
                                ? "bg-violet-600/40 text-white/50 cursor-not-allowed"
                                : "bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white"
                            }`}
                    >
                        {loading
                            ? <><Loader2 className="animate-spin" size={18} /> Logging in...</>
                            : "Login"}
                    </button>

                </form>

                {/* Divider */}
                <div className="mt-6 text-center text-sm text-white/40">
                    Don't have an account?{" "}
                    <span className="text-violet-400 cursor-pointer hover:text-violet-300">
                        Sign up
                    </span>
                </div>
            </motion.div>

        </div>
    );
}