import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { api } from "@/api/client";
import { Menu, X, Code2, LogOut, LayoutDashboard } from "lucide-react";
import Footer from "@/components/ui/Footer";
const NAV_LINKS = [
    { label: "Home", page: "Home" },
    { label: "Portfolio", page: "Portfolio" },
    { label: "Reviews", page: "Reviews" },
];

export default function Layout({ children, currentPageName }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(() => { });
        }

        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const isActive = page => currentPageName === page;

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50"
                : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">
                            Webtrion<span className="text-violet-400">AI</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ label, page }) => (
                            <Link
                                key={page}
                                to={createPageUrl(page)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium ${isActive(page)
                                    ? "text-white bg-white/10"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                    }`}>
                                {label}
                            </Link>
                        ))}

                        {user?.role === "admin" && (
                            <Link
                                to={createPageUrl("Admin")}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-violet-400 bg-violet-500/10 flex items-center gap-1.5">
                                <LayoutDashboard className="w-4 h-4" /> Admin
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-white/40 text-sm">
                                    {user.full_name}
                                </span>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        setUser(null);
                                        window.location.href = "/";
                                    }}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => window.location.href = "/login"}
                                className="text-white/50 hover:text-white text-sm font-medium px-4 py-2 rounded-xl">
                                Login In
                            </button>
                        )}

                        <Link
                            to={createPageUrl("Submit")}
                            className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl">
                            Start Project
                        </Link>
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-xl bg-white/5 text-white/60">
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
                {menuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 z-[999]">
                        <div className="flex flex-col items-center gap-6 py-8">

                            {NAV_LINKS.map(({ label, page }) => (
                                <Link
                                    key={page}
                                    to={createPageUrl(page)}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-white/70 hover:text-white text-lg"
                                >
                                    {label}
                                </Link>
                            ))}

                            {user?.role === "admin" && (
                                <Link
                                    to={createPageUrl("Admin")}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-violet-400 text-lg"
                                >
                                    Admin
                                </Link>
                            )}

                            {user ? (
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        setUser(null);
                                        setMenuOpen(false);
                                        window.location.href = "/";
                                    }}
                                    className="text-red-400 text-lg"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        window.location.href = "/login";
                                    }}
                                    className="text-white/70 text-lg"
                                >
                                    Login
                                </button>
                            )}

                            <Link
                                to={createPageUrl("Submit")}
                                onClick={() => setMenuOpen(false)}
                                className="px-6 py-3 bg-violet-600 rounded-xl text-white font-semibold"
                            >
                                Start Project
                            </Link>

                        </div>
                    </div>
                )}
            </nav>

            <main>{children}</main>
            <Footer />
        </div>
    );
}