import React from 'react';
import { User, Post } from '../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

interface DashboardProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  onStartSession: () => void;
  onViewProfile: (userId: number) => void;
  onCreatePost: (postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments'>) => void;
  onLikeToggle: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, users, posts, onStartSession, onViewProfile, onCreatePost, onLikeToggle, onAddComment }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                <img src={currentUser.profilePicture} alt={currentUser.name} className="h-24 w-24 rounded-full mx-auto" />
                <h2 className="text-2xl font-bold mt-4">{currentUser.name}</h2>
                <p className="text-gray-400">{currentUser.country}</p>
                <p className="text-sm mt-2">{currentUser.bio}</p>
            </div>
             <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <h3 className="text-lg font-bold mb-3">Your Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map(skill => (
                        <span key={skill} className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
             <button onClick={onStartSession} className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-opacity text-lg">
                Start a Sync Session
            </button>
        </div>

        {/* Center Column (Feed) */}
        <div className="lg:col-span-2 space-y-6">
             <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
             {posts.map(post => (
                 <PostCard 
                    key={post.id} 
                    post={post} 
                    users={users}
                    currentUser={currentUser}
                    onViewProfile={onViewProfile} 
                    onLikeToggle={onLikeToggle}
                    onAddComment={onAddComment}
                />
             ))}
        </div>
    </div>
  );
};

export default Dashboard;