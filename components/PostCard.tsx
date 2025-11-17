import React, { useState } from 'react';
import { Post, User, Comment } from '../types';

interface PostCardProps {
    post: Post;
    currentUser: User;
    users: User[];
    onViewProfile: (userId: number) => void;
    onLikeToggle: (postId: number) => void;
    onAddComment: (postId: number, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, users, onViewProfile, onLikeToggle, onAddComment }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false); // New state for the "Copy Link" button
    const author = users.find(u => u.id === post.authorId);

    if (!author) return null;

    const isLiked = post.likes.includes(currentUser.id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText.trim());
            setCommentText('');
        }
    };
    
    const handleShare = async () => {
        const shareData = {
            title: `Check out this post from ${author.name} on SkillSync!`,
            text: post.content,
            url: `https://skillsync.app/post/${post.id}`, 
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!'); // Simple feedback for fallback
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // If sharing fails, suggest copying the link
            await navigator.clipboard.writeText(shareData.url);
            alert('Sharing failed. Link copied to clipboard instead!');
        }
    };
    
    const handleCopyLink = async () => {
        const postUrl = `https://skillsync.app/post/${post.id}`;
        try {
            await navigator.clipboard.writeText(postUrl);
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const CommentItem: React.FC<{comment: Comment}> = ({ comment }) => {
        const commentAuthor = users.find(u => u.id === comment.authorId);
        if (!commentAuthor) return null;
        return (
            <div className="flex items-start space-x-3">
                <button onClick={() => onViewProfile(commentAuthor.id)}>
                    <img src={commentAuthor.profilePicture} alt={commentAuthor.name} className="h-8 w-8 rounded-full" />
                </button>
                <div className="bg-gray-700 p-2 rounded-lg flex-1">
                    <button onClick={() => onViewProfile(commentAuthor.id)} className="font-bold text-white text-sm hover:underline">{commentAuthor.name}</button>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <button onClick={() => onViewProfile(author.id)} className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full">
                    <img src={author.profilePicture} alt={author.name} className="h-12 w-12 rounded-full" />
                </button>
                <div>
                     <button onClick={() => onViewProfile(author.id)} className="font-bold text-white text-left hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                        {author.name}
                    </button>
                    <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
            </div>
            
            {/* Content */}
            <div>
                {post.type === 'ARTICLE' && <h3 className="text-xl font-bold mb-2">{post.title}</h3>}
                <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {/* Media */}
            {post.type === 'PHOTO' && post.mediaUrl && <img src={post.mediaUrl} alt="Post content" className="rounded-lg max-h-96 w-full object-cover" />}
            {post.type === 'VIDEO' && post.mediaUrl && <video src={post.mediaUrl} controls className="rounded-lg w-full" />}
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{post.likes.length} Likes</span>
                <span>{post.comments.length} Comments</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center border-t border-b border-gray-700 py-1">
                <button onClick={() => onLikeToggle(post.id)} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-700 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                 <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>Comment</span>
                </button>
                 <button onClick={handleShare} className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                    <span>Share</span>
                </button>
                <button onClick={handleCopyLink} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-700 transition-colors ${isLinkCopied ? 'text-green-500' : 'text-gray-400'}`}>
                    {isLinkCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                            <span>Copy Link</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Comments Section */}
            {showComments && (
                 <div className="space-y-4 pt-2">
                    {post.comments.map(comment => <CommentItem key={comment.id} comment={comment}/> )}
                    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                         <img src={currentUser.profilePicture} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                         <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                         <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors">Post</button>
                    </form>
                 </div>
            )}
        </div>
    );
};

export default PostCard;