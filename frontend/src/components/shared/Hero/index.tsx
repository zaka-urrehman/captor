import Image from 'next/image'
import Link from 'next/link'
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
                        <Link href={"/signup"} className="bg-my-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-opacity-90 transition-colors">
                            Get Started Free
                            {/* </Link> */}
                        </Link>
                        <button disabled className="text-my-primary border border-my-primary px-8 py-4 rounded-full font-medium text-lg hover:bg-my-primary hover:text-white transition-colors">
                            Learn More →
                        </button>
                    </div>
                </div>
               <div className='relative'>
                <Image src="/images/hero-image.png" alt="hero" width={600} height={600} className='rounded-xl' />

               </div>
            </div>
        </section>
    )
}

export default Hero