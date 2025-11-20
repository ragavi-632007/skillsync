import React, { useState } from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';

interface ProfilePageProps {
    currentUser: User;
    profileUser: User;
    users: User[];
    posts: Post[];
    onFollowToggle: (targetUserId: string) => void;
    onUpdateProfile: (userId: string, newAboutMe: string) => void;
    onOpenChat: (userId: string) => void;
    onBack: () => void;
    onViewProfile: (userId: string) => void;
    onLikeToggle: (postId: number) => void;
    onAddComment: (postId: number, content: string) => void;
}

const AboutMeCard: React.FC<{
    aboutMe: string;
    isOwnProfile: boolean;
    onSave: (newAboutMe: string) => void;
}> = ({ aboutMe, isOwnProfile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAboutMe, setEditedAboutMe] = useState(aboutMe);

    const handleSave = () => {
        onSave(editedAboutMe);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedAboutMe(aboutMe);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">About Me</h3>
                {isOwnProfile && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm text-indigo-400 hover:text-indigo-300">Edit</button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-3">
                    <textarea
                        value={editedAboutMe}
                        onChange={(e) => setEditedAboutMe(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition h-32 resize-y"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleCancel} className="bg-gray-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                        <button onClick={handleSave} className="bg-indigo-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-indigo-500 transition-colors">Save</button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{aboutMe}</p>
            )}
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, profileUser, users, posts, onFollowToggle, onUpdateProfile, onOpenChat, onBack, onViewProfile, onLikeToggle, onAddComment }) => {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    const userPosts = posts.filter(post => post.authorId === profileUser.id);
    const isFollowing = (currentUser.following || []).includes(profileUser.id);
    const isOwnProfile = currentUser.id === profileUser.id;

    const handleSaveAboutMe = (newAboutMe: string) => {
        onUpdateProfile(profileUser.id, newAboutMe);
    };

    const filteredPosts = selectedSkill
        ? userPosts.filter(post => {
            const skillLower = selectedSkill.toLowerCase();
            const contentLower = post.content.toLowerCase();
            const titleLower = post.title?.toLowerCase() || '';
            // A simple keyword check
            return contentLower.includes(skillLower) || titleLower.includes(skillLower);
        })
        : userPosts;


    return (
        <div className="animate-fade-in py-8">
            <button onClick={onBack} className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Back to Dashboard</span>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                        <div className="flex flex-col items-center text-center">
                            <img src={profileUser.profilePicture} alt={profileUser.name} className="h-32 w-32 rounded-full mx-auto" />
                            <h2 className="text-3xl font-bold mt-4">{profileUser.name}</h2>
                            <p className="text-gray-400">{profileUser.country}</p>
                            <div className="flex space-x-4 mt-4 text-center">
                                <div>
                                    <p className="text-xl font-bold">{(profileUser.followers || []).length}</p>
                                    <p className="text-sm text-gray-400">Followers</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{(profileUser.following || []).length}</p>
                                    <p className="text-sm text-gray-400">Following</p>
                                </div>
                            </div>
                            {!isOwnProfile && (
                                <div className="mt-4 w-full flex space-x-2">
                                    <button
                                        onClick={() => onFollowToggle(profileUser.id)}
                                        className={`w-1/2 font-bold py-2 px-4 rounded-lg transition-colors ${isFollowing
                                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                            }`}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                    <button
                                        onClick={() => onOpenChat(profileUser.id)}
                                        className="w-1/2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Message
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-sm mt-6 text-center">{profileUser.bio}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                        <h3 className="text-lg font-bold mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {(profileUser.skills || []).map(skill => (
                                <span key={skill} className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                    <AboutMeCard
                        aboutMe={profileUser.aboutMe}
                        isOwnProfile={isOwnProfile}
                        onSave={handleSaveAboutMe}
                    />
                </div>

                {/* Right Column - User's Posts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Posts by {profileUser.name.split(' ')[0]}</h3>
                    </div>

                    {/* Skill Filter */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-semibold text-gray-300 mr-2">Filter by skill:</span>
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${!selectedSkill ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                All Posts
                            </button>
                            {(profileUser.skills || []).map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${selectedSkill === skill ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {userPosts.length === 0 ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                            <p className="text-gray-400">No posts yet.</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                            <p className="text-gray-400">No posts found for the skill "{selectedSkill}".</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                users={users}
                                currentUser={currentUser}
                                onViewProfile={onViewProfile}
                                onLikeToggle={onLikeToggle}
                                onAddComment={onAddComment}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;