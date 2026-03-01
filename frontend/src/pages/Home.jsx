import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import StatsSection from "../components/home/StatsSection";
import PortfolioPreview from "../components/home/PortfolioPreview";
import TestimonialsSlider from "../components/home/TestimonialsSlider";
import ContactCTA from "../components/home/ContactCTA";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [p, r, statsRes] = await Promise.all([
                    api.get("/projects/?limit=6"),
                    api.get("/reviews/?limit=10"),
                    api.get("/projects/stats")   // 🔥 NEW
                ]);

                setProjects(p.data);
                setReviews(r.data);

                setStats([
                    { value: statsRes.data.projects, suffix: "+", label: "Projects Delivered" },
                    { value: statsRes.data.satisfaction, suffix: "%", label: "Client Satisfaction" },
                    { value: statsRes.data.years, suffix: "+", label: "Years of Expertise" },
                    { value: statsRes.data.clients, suffix: "+", label: "Happy Clients" },
                ]);

            } catch (error) {
                console.error("Home data load failed:", error);
            }
        };

        loadHomeData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <HeroSection />
            <StatsSection stats={stats} />
            <ServicesSection />
            <PortfolioPreview projects={projects} />
            <TestimonialsSlider reviews={reviews} />
            <ContactCTA />
        </div>
    );
}