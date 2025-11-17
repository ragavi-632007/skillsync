
import React from 'react';
import { AppState } from '../types';

interface HomePageProps {
  onNavigate: (state: AppState) => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center space-x-4 mb-3">
      {icon}
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-400">{children}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center font-sans p-4">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-wider text-white">SkillSync</h1>
        </div>
        <button onClick={() => onNavigate(AppState.LOGIN)} className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-500 transition-colors">
            Login
        </button>
      </header>

      <main className="text-center animate-fade-in mt-20 md:mt-0">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          Exchange Skills. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">Create Unity.</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
          A platform where people anonymously exchange their skills to help each other — not with money, but with human connection.
        </p>
        <button onClick={() => onNavigate(AppState.LOGIN)} className="mt-10 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:opacity-90 transition-opacity text-lg">
          Join the Network
        </button>
      </main>

      <section className="w-full max-w-5xl mx-auto mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} title="Find a Partner">
                Our AI matches you with the perfect learning partner based on your skills, goals, and personality.
            </FeatureCard>
            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m8-4H5a2 2 0 00-2 2v10a2 2 0 002 2h11l4 4V7a2 2 0 00-2-2z" /></svg>} title="AI-Guided Sessions">
                Engage in 10-minute "Sync Sessions" where our AI coach provides lessons, activities, and guidance.
            </FeatureCard>
            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9a9 9 0 0110.6 0" /></svg>} title="Build Connections">
                Share your knowledge, learn something new, and connect with people from around the globe.
            </FeatureCard>
        </div>
      </section>
    </div>
  );
};

export default HomePage;