import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onStartMatching: (profile: UserProfile) => void;
  onBack: () => void;
  error: string | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStartMatching, onBack, error }) => {
  const [skillToOffer, setSkillToOffer] = useState('');
  const [skillToLearn, setSkillToLearn] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillToOffer && skillToLearn) {
      setIsLoading(true);
      onStartMatching({ skillToOffer, skillToLearn });
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-lg mx-auto text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Start a Sync Session</h2>
      <p className="text-indigo-300 mb-8">Define your skills to find the perfect partner.</p>
      
      {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="skill-offer" className="block text-sm font-medium text-gray-300 mb-2 text-left">I can offer help with...</label>
          <input
            id="skill-offer"
            type="text"
            value={skillToOffer}
            onChange={(e) => setSkillToOffer(e.target.value)}
            placeholder="e.g., Photo editing with Photoshop"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="skill-learn" className="block text-sm font-medium text-gray-300 mb-2 text-left">I need help with...</label>
          <input
            id="skill-learn"
            type="text"
            value={skillToLearn}
            onChange={(e) => setSkillToLearn(e.target.value)}
            placeholder="e.g., Learning conversational English"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!skillToOffer || !skillToLearn || isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Finding Your Partner...</span>
            </>
          ) : (
            <span>Find My Sync Partner</span>
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
