import { AboutSection } from "@/components/home/about-section";
import { CTASection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { Footer } from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </main>
    );
}

export default Home;
