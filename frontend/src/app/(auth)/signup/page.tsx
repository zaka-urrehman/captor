"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";

export default function SignupPage() {
    const { signup, isLoading, error } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (!agreeToTerms) {
            alert("Please agree to the Terms of Service and Privacy Policy");
            return;
        }

        const result = await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (result) {
            // Redirect to login page or dashboard on successful signup
            router.push("/login"); // Change this to your desired redirect path
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M200 100 L400 300 L600 200 L800 400" stroke="white" strokeWidth="0.5" fill="none" />
                    <path d="M100 500 L300 300 L500 600 L700 400" stroke="white" strokeWidth="0.5" fill="none" />
                    <path d="M900 200 L1100 400 L900 600" stroke="white" strokeWidth="0.5" fill="none" />
                </svg>
            </div>

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-my-primary/30 rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="flex items-center space-x-2">
                                <Image src="/logos/simple_logo.png" alt="logo" width={60} height={60} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join us and get started today</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Full Name Input */}
                        <div>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name@example.com"
                                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create Password"
                                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm Password"
                                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Terms and conditions */}
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={agreeToTerms}
                                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 mt-1"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                                I agree to the{" "}
                                <Link href="/terms" className="text-my-primary">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-my-primary">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || !agreeToTerms}
                            className="w-full bg-my-primary/80 hover:bg-my-primary/60 cursor-pointer text-white h-12 rounded-lg font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    {/* Login link */}
                    <div className="text-center mt-6">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link href="/login" className="text-my-primary font-medium">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>Made with</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        <span className="font-medium">Visily</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
