import React, { useState, useRef } from 'react';
import { User, Post, PostType } from '../types';

interface CreatePostProps {
  currentUser: User;
  onCreatePost: (postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments'>) => void;
}

const PostTypeButton: React.FC<{
    label: string;
    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-sm font-semibold ${
            isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCreatePost }) => {
    const [postType, setPostType] = useState<PostType>('TEXT');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setMediaFile(event.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content && postType !== 'PHOTO' && postType !== 'VIDEO') return;

        let mediaUrl: string | undefined = undefined;
        if (mediaFile) {
            mediaUrl = URL.createObjectURL(mediaFile);
        }

        const postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments'> = {
            type: postType,
            content,
            title: postType === 'ARTICLE' ? title : undefined,
            mediaUrl: mediaUrl,
        };

        onCreatePost(postData);
        // Reset form
        setContent('');
        setTitle('');
        setMediaFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-3 mb-4">
                    <img src={currentUser.profilePicture} alt={currentUser.name} className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                        <div className="flex space-x-2 mb-2">
                           <PostTypeButton label="Text" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>} isActive={postType === 'TEXT'} onClick={() => setPostType('TEXT')} />
                           <PostTypeButton label="Photo" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>} isActive={postType === 'PHOTO'} onClick={() => setPostType('PHOTO')} />
                           <PostTypeButton label="Video" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>} isActive={postType === 'VIDEO'} onClick={() => setPostType('VIDEO')} />
                           <PostTypeButton label="Article" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>} isActive={postType === 'ARTICLE'} onClick={() => setPostType('ARTICLE')} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {postType === 'ARTICLE' && (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article Title..."
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            required
                        />
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                            postType === 'TEXT' ? `What's on your mind, ${currentUser.name.split(' ')[0]}?` :
                            postType === 'ARTICLE' ? 'Write your article here...' :
                            'Add a caption...'
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition h-24 resize-y"
                        required={postType !== 'PHOTO' && postType !== 'VIDEO'}
                    />

                    {(postType === 'PHOTO' || postType === 'VIDEO') && (
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept={postType === 'PHOTO' ? 'image/*' : 'video/*'}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                                required
                            />
                            {mediaFile && <p className="text-xs text-gray-400 mt-2">Selected: {mediaFile.name}</p>}
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-3">
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;