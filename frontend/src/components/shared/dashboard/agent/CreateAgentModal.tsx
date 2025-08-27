
import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AgentDataField {
    key: string
    question: string
    data_type: string
}

interface AgentFormData {
    name: string
    systemPrompt: string
    instructions: string
    description: string
    agentDataFields: AgentDataField[]
}

interface CreateAgentModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<AgentFormData>({
        name: "",
        systemPrompt: "",
        instructions: "",
        description: "",
        agentDataFields: [],
    })

    const totalSteps = 2

    const handleInputChange = (field: keyof AgentFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleFieldChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            agentDataFields: prev.agentDataFields.map((item, i) =>
                i === index ? { ...item, question: value } : item
            ),
        }))
    }

    const addField = () => {
        if (formData.agentDataFields.length >= 20) return
        const newField: AgentDataField = {
            key: `q${formData.agentDataFields.length + 1}`,
            question: "",
            data_type: "string",
        }
        setFormData((prev) => ({
            ...prev,
            agentDataFields: [...prev.agentDataFields, newField],
        }))
    }

    const removeField = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            agentDataFields: prev.agentDataFields.filter((_, i) => i !== index).map((field, i) => ({
                ...field,
                key: `q${i + 1}`,
            })),
        }))
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        // Construct the body for backend
        const body = {
            name: formData.name,
            description: formData.description,
            system_prompt: formData.systemPrompt,
            user_instructions: formData.instructions,
            webhook_url: "",
            user_id: 0,
            type: "question-answers",
            agent_data_fields: formData.agentDataFields.map((field) => ({
                key: field.key,
                question: field.question,
                data_type: field.data_type,
                required: false,
                validation_rules: {},
                schem_id: 0,
            })),
        }
        // Handle form submission here
        console.log("Agent data:", body)
        // Reset form and close modal
        setFormData({
            name: "",
            systemPrompt: "",
            instructions: "",
            description: "",
            agentDataFields: [],
        })
        setCurrentStep(1)
        onClose()
    }

    const isStep1Valid = !!formData.name && !!formData.systemPrompt && !!formData.instructions && !!formData.description
    const isStep2Valid =
        formData.agentDataFields.length > 0 &&
        formData.agentDataFields.every((field) => field.question.trim() !== "")

    const isCurrentStepValid = 
        currentStep === 1 ? isStep1Valid : 
        isStep2Valid

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Create New Agent</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Step {currentStep} of {totalSteps}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="px-6 pb-6">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-gray-300">
                                            Agent Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter agent name"
                                            className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="systemPrompt" className="text-gray-300">
                                            System Prompt
                                        </Label>
                                        <Textarea
                                            id="systemPrompt"
                                            value={formData.systemPrompt}
                                            onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
                                            placeholder="Define the agent's role and behavior"
                                            rows={3}
                                            className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="instructions" className="text-gray-300">
                                            Instructions
                                        </Label>
                                        <Textarea
                                            id="instructions"
                                            value={formData.instructions}
                                            onChange={(e) => handleInputChange("instructions", e.target.value)}
                                            placeholder="Specific instructions for the agent"
                                            rows={3}
                                            className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-gray-300">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Brief description of what this agent does"
                                            rows={2}
                                            className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Define Questions</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Add up to 20 questions for data collection.
                                </p>
                                <div className="space-y-4">
                                    {formData.agentDataFields.map((field, index) => (
                                        <div key={index} className="flex items-end space-x-4">
                                            <div className="flex-1">
                                                <Label htmlFor={`question-${index}`} className="text-gray-300">
                                                    Question {index + 1}
                                                </Label>
                                                <Textarea
                                                    id={`question-${index}`}
                                                    value={field.question}
                                                    onChange={(e) => handleFieldChange(index, e.target.value)}
                                                    placeholder="Enter your question"
                                                    rows={2}
                                                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeField(index)}
                                                className="text-red-400 hover:text-red-300 hover:bg-gray-700 mt-6"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        onClick={addField}
                                        disabled={formData.agentDataFields.length >= 20}
                                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        Add Question
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-700">
                    <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex space-x-3">
                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                disabled={!isCurrentStepValid}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!isCurrentStepValid}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                            >
                                Create Agent
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}