import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0f] border-t border-white/5 mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-white font-bold text-xl mb-4">
                            Webtrion<span className="text-violet-400">AI</span>
                        </h2>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Building scalable web platforms, data analytics dashboards,
                            and AI/ML systems that drive real business impact.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-white/50 text-sm">
                            <li>
                                <Link to={createPageUrl("Home")} className="hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl("Portfolio")} className="hover:text-white">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl("Reviews")} className="hover:text-white">
                                    Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Services</h3>
                        <ul className="space-y-2 text-white/50 text-sm">
                            <li>Full-Stack Web Development</li>
                            <li>Data Analytics & BI</li>
                            <li>Machine Learning Solutions</li>
                            <li>Cloud Deployment</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-white/50 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                webtrionai@gmail.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Github className="w-4 h-4" />
                                github.com/webtrionai
                            </li>
                            <li className="flex items-center gap-2">
                                <Linkedin className="w-4 h-4" />
                                linkedin.com/company/webtrionai
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-white/5 mt-12 pt-6 text-center text-white/30 text-sm">
                    © {new Date().getFullYear()} WebtrionAI. All rights reserved.
                </div>

            </div>
        </footer>
    );
}