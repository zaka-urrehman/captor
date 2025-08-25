'use client';

import Image from 'next/image';
import React, { useState } from 'react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="relative">
            <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Image src="/logos/simple_logo.png" alt="logo" width={60} height={60} />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                    <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                    <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Login</a>
                </div>

                {/* Desktop Sign Up Button */}
                <button className="hidden md:block bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                    Sign Up
                </button>

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="px-6 py-4 space-y-4">
                    <a
                        href="#features"
                        className="block text-gray-300 hover:text-white transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        className="block text-gray-300 hover:text-white transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Pricing
                    </a>
                    <a
                        href="#faq"
                        className="block text-gray-300 hover:text-white transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        FAQ
                    </a>
                    <a
                        href="#"
                        className="block text-gray-300 hover:text-white transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </a>
                    <button
                        className="w-full mt-4 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </nav>)
}

export default Navbar