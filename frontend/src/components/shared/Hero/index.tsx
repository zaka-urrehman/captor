import React from 'react'

const Hero = () => {
    return (
        <section className=" bg-my-primary/20 py-10 ">
            <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Transform Your<br />
                        Intake <span className="text-my-primary">With AI</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed font-lato">
                        Streamline customer acquisition and data collection using<br />
                        intelligent conversational AI agents. Automate, analyze, and<br />
                        optimize with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-my-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-opacity-90 transition-colors">
                            Get Started Free
                        </button>
                        <button className="text-my-primary border border-my-primary px-8 py-4 rounded-full font-medium text-lg hover:bg-my-primary hover:text-white transition-colors">
                            Learn More →
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded opacity-30"></div>
                            </div>
                            <div>
                                <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                                <div className="w-16 h-2 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="w-full h-2 bg-gray-100 rounded"></div>
                            <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                            <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="w-20 h-8 bg-my-primary rounded-lg opacity-20"></div>
                        </div>
                        {/* Person illustration placeholder */}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero