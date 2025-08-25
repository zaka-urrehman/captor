import Image from 'next/image'
import React from 'react'

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-xl">
            <div className="w-12 h-12  rounded-lg flex items-center justify-center mb-3">
                <Image src={icon} alt={title} height={40} width={40} />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 mb-3">{description}</p>
        </div>
    )
}

export default FeatureCard