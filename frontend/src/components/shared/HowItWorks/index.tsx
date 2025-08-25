import React from 'react'
import { howItWorks } from '@/data/howItWorks'
import HowItWorksCard from './HowItWorksCard'

const HowItWorks = () => {
    return (
        <section className="bg-black py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">How AI Conversational Intake Works</h2>
                    <p className="text-gray-400 text-lg">
                        Our platform simplifies complex intake processes into three easy steps.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {
                        howItWorks.map((howItWork, index) => (
                            <HowItWorksCard key={index} {...howItWork} />
                        ))
                    }

                </div>
            </div>
        </section>)
}

export default HowItWorks