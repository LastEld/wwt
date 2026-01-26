"use client";

import React from 'react';

interface ProposalTemplateProps {
    proposal: any;
}

export const ProposalTemplate: React.FC<ProposalTemplateProps> = ({ proposal }) => {
    if (!proposal) return null;

    return (
        <div className="proposal-container bg-gray-50 min-h-screen font-sans text-gray-900" style={{ '--primary': proposal.brandedAssets.primaryColor } as any}>
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img src={proposal.brandedAssets.heroImage} alt="Travel Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-12">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl font-serif text-white mb-4">{proposal.title}</h1>
                        <p className="text-xl text-white/90">{proposal.destination} | {proposal.agentName} for {proposal.clientName}</p>
                    </div>
                </div>
            </div>

            {/* Proposal Body */}
            <main className="max-w-5xl mx-auto p-12 -mt-12 relative z-10 bg-white shadow-2xl rounded-lg">
                <div className="flex justify-between items-start mb-12 border-b pb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Exclusive Travel Proposal</h2>
                        <p className="text-gray-500">Proposal ID: {proposal.id}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-serif text-primary mb-2" style={{ color: proposal.brandedAssets.primaryColor }}>
                            {proposal.totalPrice} {proposal.currency}
                        </div>
                        <p className="text-sm text-gray-400">Total Curated Value</p>
                    </div>
                </div>

                <section className="mb-12">
                    <h3 className="text-xl font-bold mb-4">Your Bespoke Journey</h3>
                    <p className="text-gray-600 leading-relaxed italic">{proposal.summary}</p>
                </section>

                <div className="space-y-12">
                    {proposal.days.map((day: any) => (
                        <div key={day.day} className="day-card border-l-4 p-8 bg-gray-50 rounded-r-lg" style={{ borderColor: proposal.brandedAssets.primaryColor }}>
                            <h4 className="text-lg font-bold mb-4">Day {day.day}: {day.title}</h4>
                            <p className="text-gray-700 mb-6">{day.description}</p>

                            <div className="grid gap-4">
                                {day.activities.map((act: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
                                        <span className="text-sm font-mono text-gray-400">{act.time}</span>
                                        <div>
                                            <p className="font-bold">{act.activity}</p>
                                            <p className="text-sm text-gray-500">{act.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-20 pt-12 border-t text-center text-gray-400">
                    <p className="mb-4">Generated with ❤️ by {proposal.agencyName} Neural Engine</p>
                    <p className="text-xs italic">All prices and availability are subject to change until booking confirmation.</p>
                </footer>
            </main>
        </div>
    );
};
