import React from 'react'

const Pricing = () => {
    return (
        <section id="pricing" className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400 text-lg">
                        Choose the plan that best fits your business needs. From start-ups to enterprise.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-gray-800 p-8 rounded-2xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <p className="text-gray-400 mb-6">Great to test the platform</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> 1 AI Agent
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Basic Conversation Analytics
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Community Support
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Up to 100 Conversations/month
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Custom Data Schema
                            </li>
                        </ul>
                        <button className="w-full py-3 px-6 border border-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-b from-my-primary to-my-primary/20 p-8 rounded-2xl relative flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-white/80 mb-6">Advanced tools and advanced plans</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold">$49</span>
                            <span className="text-white/80">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> 5 AI Agents
                            </li>
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> Advanced Analytics Dashboard
                            </li>
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> Email & Chat Support
                            </li>
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> Up to 5K Conversations/month
                            </li>
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> Custom Data Schema
                            </li>
                            <li className="flex items-center text-white">
                                <span className="mr-3">✓</span> Basic Integrations
                            </li>
                        </ul>
                        <button className="w-full py-3 px-6 bg-white text-my-primary rounded-full font-semibold hover:bg-gray-100 transition-colors">
                            Choose Plan
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-gray-800 p-8 rounded-2xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <p className="text-gray-400 mb-6">Tailored solutions for large enterprises</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold">Contact</span><br />
                            <span className="text-4xl font-bold">Us</span>
                            <span className="text-gray-400 block mt-2">/annually</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Unlimited AI Agents
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Dedicated Account Manager
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> 24/7 Priority Support
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Unlimited Conversations
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Advanced Integration Suite
                            </li>
                            <li className="flex items-center ">
                                <span className="mr-3">✓</span> Custom Deployment Options
                            </li>
                        </ul>
                        <button className="w-full py-3 px-6 border border-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </section>)
}

export default Pricing