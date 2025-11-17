import React from 'react';
import { MatchedUser } from '../types';

interface MatchingProps {
    isSummary?: boolean;
    matchedUser?: MatchedUser | null;
    onStartSession?: () => void;
}

const LoadingSpinner: React.FC<{isSummary: boolean}> = ({ isSummary }) => {
    const messages = isSummary 
    ? ["Analyzing your session...", "Calculating your SkillSync Score...", "Great things are coming!"]
    : ["Analyzing your profile...", "Searching our global network...", "Finding the perfect partner..."];
  
  const [currentMessage, setCurrentMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSummary]);

    return (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-48 h-48">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-teal-500/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white mt-12 mb-4">
                {isSummary ? "Generating Summary" : "Finding a Match"}
            </h2>
            <p className="text-lg text-gray-400 transition-opacity duration-500">{currentMessage}</p>
        </div>
    );
};


const MatchFoundCard: React.FC<{ matchedUser: MatchedUser; onStartSession: () => void; }> = ({ matchedUser, onStartSession }) => {
    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-lg mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Match Found!</h2>
            <p className="text-indigo-300 mb-6">Get ready to connect with your new partner.</p>
            
            <div className="my-6 p-4 bg-gray-900/50 rounded-lg text-left flex items-center space-x-4">
                <img src={matchedUser.profilePicture} alt={matchedUser.name} className="w-20 h-20 rounded-full border-2 border-indigo-500" />
                <div>
                    <h3 className="text-2xl font-bold">{matchedUser.name}</h3>
                    <p className="text-gray-400">from {matchedUser.country}</p>
                </div>
            </div>

            <div className="text-left space-y-3 bg-gray-900/50 p-4 rounded-lg">
                <p><span className="font-semibold text-teal-400">Offers to teach:</span> <span className="text-gray-300">{matchedUser.skillToOffer}</span></p>
                <p><span className="font-semibold text-indigo-400">Wants to learn:</span> <span className="text-gray-300">{matchedUser.skillToLearn}</span></p>
                <p><span className="font-semibold text-purple-400">Learning Style:</span> <span className="text-gray-300">{matchedUser.learningStyle}</span></p>
            </div>

            <button
                onClick={onStartSession}
                className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
            >
                Start 10-Min Sync Session
            </button>
        </div>
    );
};

const Matching: React.FC<MatchingProps> = ({ isSummary = false, matchedUser, onStartSession }) => {
  if (isSummary) {
      return <LoadingSpinner isSummary={true} />;
  }

  return (
    <div>
      {!matchedUser ? (
        <LoadingSpinner isSummary={false} />
      ) : (
        onStartSession && <MatchFoundCard matchedUser={matchedUser} onStartSession={onStartSession} />
      )}
    </div>
  );
};

export default Matching;