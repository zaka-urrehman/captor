"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";

export default function LoginPage() {
    const { login, isLoading, error } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await login(formData);
        console.log("here isthe login result", result);

        if (result) {
            // Redirect to dashboard or home page on successful login
            router.push("/dashboard");
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

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-my-primary/30 rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="flex items-center space-x-2">
                                <Image src="/logos/simple_logo.png" alt="logo" width={60} height={60} />
                            </div>                       </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

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
                                placeholder="••••••••"
                                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Remember me and Forgot password */}
                        <div className="flex items-center justify-between">
                            {/* <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                    defaultChecked
                                />
                                <label htmlFor="remember" className="text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div> */}
                            <Link href="/forgot-password" className="text-sm text-my-primary">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-my-primary/80 hover:bg-my-primary/60 cursor-pointer text-white h-12 rounded-lg font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Log in"}
                        </Button>
                    </form>

                    {/* Sign up link */}
                    <div className="text-center mt-6">
                        <span className="text-gray-400">{"Don't have an account? "}</span>
                        <Link href="/signup" className="text-my-primary font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
