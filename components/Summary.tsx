
import React from 'react';
import { SessionSummary } from '../types';

interface SummaryProps {
  summary: SessionSummary;
  onRestart: () => void;
}

const Summary: React.FC<SummaryProps> = ({ summary, onRestart }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-lg mx-auto text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
      <p className="text-indigo-300 mb-6">Amazing work on building a new connection.</p>

      <div className="my-8">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Your SkillSync Score</p>
        <p className="text-7xl font-bold text-teal-400 my-2">{summary.score}</p>
        <p className="text-gray-300">This measures kindness, teamwork, and unity.</p>
      </div>

      <div className="text-left space-y-6">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-1">Session Summary</h3>
          <p className="text-gray-300">{summary.summary}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-1">Key Takeaway</h3>
          <p className="text-gray-300">{summary.takeaway}</p>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
      >
        Find Another Match
      </button>
    </div>
  );
};

export default Summary;
