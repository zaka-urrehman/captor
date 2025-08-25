import React from 'react'
import FeatureCard from './FeatureCard'
import { features } from '@/data/features'


const Features = () => {
    return (
        <section id="features" className="py-20">

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Powerful Features at Your Fingertips</h2>
                    <p className="text-gray-400 text-lg">
                        Experience a new level of efficiency with our advanced AI capabilities.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {
                        features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))
                    }
                </div>
            </div>
        </section>)
}

export default Features