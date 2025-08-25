
import CTA from "@/components/shared/CTA";
import FAQs from "@/components/shared/FAQs";
import Features from "@/components/shared/Features";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import HowItWorks from "@/components/shared/HowItWorks";
import Navbar from "@/components/shared/Navbar";
import Pricing from "@/components/shared/Pricing";

export default function Home() {

    return (
        <div className="min-h-screen bg-gray-900 text-white">

            <Navbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Pricing />
            <FAQs />
            <CTA />
            <Footer />
        </div>
    );
}
