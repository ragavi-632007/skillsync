import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, MatchedUser, AiCoachResponse } from '../types';
import { generateSessionCoachPrompt, empathyTranslate } from '../services/geminiService';

interface SessionProps {
  user: UserProfile;
  partner: MatchedUser;
  onEndSession: () => void;
}

const SESSION_DURATION = 10 * 60; // 10 minutes in seconds

const UserCard: React.FC<{ title: string; skillOffer: string; skillLearn: string; country?: string }> = ({ title, skillOffer, skillLearn, country }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-full">
    <h3 className="font-bold text-lg text-white">{title} {country && <span className="text-sm font-normal text-gray-400">from {country}</span>}</h3>
    <div className="mt-2 space-y-2 text-sm">
      <p><span className="font-semibold text-teal-400">Offers:</span> <span className="text-gray-300">{skillOffer}</span></p>
      <p><span className="font-semibold text-indigo-400">Learns:</span> <span className="text-gray-300">{skillLearn}</span></p>
    </div>
  </div>
);

const Session: React.FC<SessionProps> = ({ user, partner, onEndSession }) => {
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [coachData, setCoachData] = useState<AiCoachResponse | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(true);
  const [empathyInput, setEmpathyInput] = useState("");
  const [empathyOutput, setEmpathyOutput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchCoachPrompt = useCallback(async () => {
    setIsLoadingCoach(true);
    try {
      const data = await generateSessionCoachPrompt(user, partner);
      setCoachData(data);
    } catch (error) {
      console.error("Failed to fetch coach prompt:", error);
    } finally {
      setIsLoadingCoach(false);
    }
  }, [user, partner]);

  useEffect(() => {
    fetchCoachPrompt();
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onEndSession();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranslate = async () => {
      if (!empathyInput.trim()) return;
      setIsTranslating(true);
      setEmpathyOutput("");
      try {
          const translatedText = await empathyTranslate(empathyInput);
          setEmpathyOutput(translatedText);
      } catch (error) {
          setEmpathyOutput("Sorry, translation failed. Please try again.");
          console.error(error);
      } finally {
          setIsTranslating(false);
      }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sync Session</h2>
        <div className="bg-gray-800 border border-gray-700 text-white font-mono text-2xl px-4 py-2 rounded-lg">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UserCard title="You" skillOffer={user.skillToOffer} skillLearn={user.skillToLearn} />
        <UserCard title={partner.name} skillOffer={partner.skillToOffer} skillLearn={partner.skillToLearn} country={partner.country} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
            {/* AI Coach */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-lg border border-gray-700 relative">
                 <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    AI Coach
                </h3>
                {isLoadingCoach ? <p className="text-gray-400">Generating guidance...</p> : coachData ? (
                    <div className="space-y-4 text-sm">
                        <div className="p-3 bg-gray-900/50 rounded-md border-l-4 border-teal-500">
                            <h4 className="font-semibold text-teal-400">{coachData.microLesson.title} (For {coachData.microLesson.for === 'user' ? 'You' : partner.name})</h4>
                            <p className="text-gray-300">{coachData.microLesson.content}</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-md border-l-4 border-indigo-500">
                            <h4 className="font-semibold text-indigo-400">{coachData.activity.title}</h4>
                            <p className="text-gray-300">{coachData.activity.description}</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-md border-l-4 border-purple-500">
                            <h4 className="font-semibold text-purple-400">{coachData.cultureBridge.title}</h4>
                            <p className="text-gray-300">{coachData.cultureBridge.content}</p>
                        </div>
                    </div>
                ) : <p className="text-red-400">Could not load AI guidance.</p>}
                 <button onClick={fetchCoachPrompt} disabled={isLoadingCoach} className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoadingCoach ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4l-5 5M4 20l5-5" /></svg>
                </button>
            </div>
        </div>

        <div className="space-y-4">
            {/* Empathy Translator */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M19 17v.01" /></svg>
                    AI Empathy Translator
                </h3>
                <textarea 
                    value={empathyInput}
                    onChange={(e) => setEmpathyInput(e.target.value)}
                    placeholder="Type a message here..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition h-24 resize-none"
                />
                <button onClick={handleTranslate} disabled={isTranslating} className="mt-2 w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 disabled:bg-yellow-800 transition-colors">
                    {isTranslating ? 'Translating...' : 'Make it better'}
                </button>
                {empathyOutput && (
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-md border-l-2 border-yellow-400">
                        <p className="text-gray-300">{empathyOutput}</p>
                    </div>
                )}
            </div>

            <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10H21C21 5.03 16.97 1 12 1C7.03 1 3 5.03 3 10V14C3 18.97 7.03 23 12 23C16.97 23 21 18.97 21 14H13V10Z M11 14H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10H13V12H11V14Z"/></svg>
                <span>Start Google Meet</span>
            </a>
            
            <button onClick={onEndSession} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-500 transition-colors">
                End Session
            </button>
        </div>
      </div>
    </div>
  );
};

export default Session;
