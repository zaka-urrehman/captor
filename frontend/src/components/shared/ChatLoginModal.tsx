"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ChatLoginModalProps {
    isOpen: boolean
    onSubmit: (name: string, email: string) => Promise<void>
    isLoading?: boolean
    error?: string | null
}

export default function ChatLoginModal({
    isOpen,
    onSubmit,
    isLoading = false,
    error = null
}: ChatLoginModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [validationError, setValidationError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!name.trim()) {
            setValidationError("Name is required")
            return
        }

        if (!email.trim()) {
            setValidationError("Email is required")
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setValidationError("Please enter a valid email address")
            return
        }

        setValidationError("")
        await onSubmit(name.trim(), email.trim())
    }

    const handleClose = () => {
        // Prevent closing if loading
        if (isLoading) return
        setName("")
        setEmail("")
        setValidationError("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Welcome to Chat</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Please enter your details to start chatting with our AI assistant.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                            required
                        />
                    </div>

                    {(validationError || error) && (
                        <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                            <p className="text-red-200 text-sm">
                                {validationError || error}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim() || !email.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Starting Chat...
                                </>
                            ) : (
                                "Start Chat"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
