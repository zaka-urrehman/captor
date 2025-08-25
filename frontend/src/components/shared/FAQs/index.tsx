"use client"
import React, { useState } from 'react'

const FAQs = () => {

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section id="faq" className="py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400 text-lg">
                        Find answers to the most common questions about AI Conversational Intake.
                    </p>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            question: "What is AI Conversational Intake?",
                            answer: "AI Conversational Intake is an intelligent system that automates the process of collecting information from customers through natural conversations, making data collection more efficient and user-friendly."
                        },
                        {
                            question: "How does the AI agent learn?",
                            answer: "Our AI agents are trained on your specific requirements and continuously improve through machine learning algorithms that analyze conversation patterns and outcomes."
                        },
                        {
                            question: "Can I integrate with my existing systems?",
                            answer: "Yes, our platform offers extensive integration capabilities with popular CRM systems, marketing platforms, and custom APIs to seamlessly fit into your existing workflow."
                        },
                        {
                            question: "Is my data secure with AI Conversational Intake?",
                            answer: "Absolutely. We implement enterprise-grade security measures including end-to-end encryption, secure data storage, and compliance with major privacy regulations like GDPR and CCPA."
                        },
                        {
                            question: "What kind of analytics does the platform provide?",
                            answer: "Our platform provides comprehensive analytics including conversation success rates, data quality metrics, user engagement patterns, and conversion insights to help optimize your intake processes."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg">
                            <button
                                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-800 transition-colors"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="font-semibold text-lg">{faq.question}</span>
                                <span className="text-2xl text-primary">
                                    {openFaq === index ? '−' : '+'}
                                </span>
                            </button>
                            {openFaq === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQs