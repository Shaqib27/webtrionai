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

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [p, r] = await Promise.all([
                    api.get("/projects?featured=true&limit=6"),
                    api.get("/reviews?approved=true&limit=10")
                ]);

                setProjects(p.data);
                setReviews(r.data);
            } catch (error) {
                console.error("Home data load failed:", error);
            }
        };

        loadHomeData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <HeroSection />
            <StatsSection />
            <ServicesSection />
            <PortfolioPreview projects={projects} />
            <TestimonialsSlider reviews={reviews} />
            <ContactCTA />
        </div>
    );
}