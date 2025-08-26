import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is AI Conversational Intake?",
    answer:
      "AI Conversational Intake is an intelligent system that uses conversational AI agents to automate customer data collection, lead qualification, and intake processes through natural language interactions.",
  },
  {
    question: "How does the AI agent learn?",
    answer:
      "Our AI agents are trained on your specific business requirements and continuously learn from interactions to improve accuracy and effectiveness over time.",
  },
  {
    question: "Can I integrate with my existing systems?",
    answer:
      "Yes, our platform offers extensive integration capabilities with popular CRM systems, marketing platforms, and custom APIs to seamlessly fit into your existing workflow.",
  },
  {
    question: "Is my data secure with AI Conversational Intake?",
    answer:
      "Absolutely. We implement enterprise-grade security measures including data encryption, secure data centers, and compliance with major privacy regulations like GDPR and CCPA.",
  },
  {
    question: "What kind of analytics does the platform provide?",
    answer:
      "Our platform provides comprehensive analytics including conversation insights, conversion rates, data quality metrics, and performance dashboards to help you optimize your intake processes.",
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about AI Conversational Intake.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-gray-900 rounded-lg px-6">
                <AccordionTrigger className="text-left text-white hover:text-purple-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
