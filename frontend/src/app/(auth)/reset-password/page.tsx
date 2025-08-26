import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
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

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-my-primary/30 rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-purple-400 text-xl font-semibold italic">logo</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400 text-sm">{"Don't worry, we'll send you reset instructions"}</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-black border-gray-600 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Reset Button */}
            <Button className="w-full bg-my-primary/80 hover:bg-my-primary/60 cursor-pointer text-white h-12 rounded-lg font-medium">
              Send Reset Instructions
            </Button>
          </form>

          {/* Back to login */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-my-primary font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>

          {/* Help text */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <p className="text-sm text-gray-400 text-center">
              Remember your password?{" "}
              <Link href="/login" className="text-my-primary">
                Sign in here
              </Link>
            </p>
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
