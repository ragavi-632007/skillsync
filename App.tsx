import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';
import Matching from './components/Matching';
import Session from './components/Session';
import Summary from './components/Summary';
import ProfilePage from './components/ProfilePage';
import ChatInterface from './components/ChatInterface';
import { AppState, MatchedUser, SessionSummary, UserProfile, User, Message, Post, Comment } from './types';
import { generateMatch, generateSessionSummary } from './services/geminiService';
import {
  getCurrentUser,
  signOut,
  getUsers,
  getPosts,
  createPost,
  togglePostLike,
  createComment,
  toggleFollow,
  updateUser,
  getMessages,
  sendMessage,
  createUserProfile
} from './services/supabaseService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // Messaging state
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [fetchedUsers, fetchedPosts] = await Promise.all([
        getUsers(),
        getPosts()
      ]);

      if (fetchedUsers) setUsers(fetchedUsers as User[]);
      if (fetchedPosts) setPosts(fetchedPosts as unknown as Post[]);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  // Check auth and load user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(user.id);

          // Fetch all data first
          await fetchData();

          // Then get current user details from the fetched users list or fetch individually
          // We'll rely on the users list for now, but in a real app we might want a specific call
          // However, since we just called fetchData, let's try to find the user there
          // If not found (e.g. race condition or pagination), we might need to fetch individually
          // For simplicity, we'll assume fetchData gets all users for this demo size

          // Re-fetch users to be sure we have the latest (including the current user if they just signed up)
          const latestUsers = await getUsers();
          if (latestUsers) {
            setUsers(latestUsers as User[]);
            const foundUser = latestUsers.find((u: any) => u.id === user.id);
            if (foundUser) {
              setCurrentUser(foundUser as User);
              setAppState(AppState.DASHBOARD);
            } else {
              // User authenticated but not in users table? Should not happen if signup flow is correct
              // But if it does, maybe redirect to a "Complete Profile" page?
              // For now, let's just stay on Home or Login
              console.warn('User authenticated but profile not found in database');
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [fetchData]);

  // Refresh data periodically or on demand
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Fetch messages when chat is active
  useEffect(() => {
    if (currentUser && activeChatUserId) {
      const fetchMessages = async () => {
        const msgs = await getMessages(currentUser.id, activeChatUserId);
        if (msgs) setMessages(msgs as unknown as Message[]);
      };
      fetchMessages();
      // Set up a poller for messages for now (realtime would be better but this is simpler)
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser, activeChatUserId]);

  // State for the session flow
  const [userSessionProfile, setUserSessionProfile] = useState<UserProfile | null>(null);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  const handleLogin = async (email: string, userId: string) => {
    setCurrentUserId(userId);
    await fetchData();
    const latestUsers = await getUsers();
    if (latestUsers) {
      setUsers(latestUsers as User[]);
      const user = latestUsers.find((u: any) => u.id === userId);
      if (user) {
        setCurrentUser(user as User);
        setAppState(AppState.DASHBOARD);
        setError(null);
      } else {
        // Fallback: Create profile if not found
        console.warn('User profile not found, creating one...');
        try {
          await createUserProfile(email, email.split('@')[0], userId);
          // Fetch again
          const retryUsers = await getUsers();
          if (retryUsers) {
            setUsers(retryUsers as User[]);
            const retryUser = retryUsers.find((u: any) => u.id === userId);
            if (retryUser) {
              setCurrentUser(retryUser as User);
              setAppState(AppState.DASHBOARD);
              setError(null);
            } else {
              setError('Failed to create user profile. Please try again.');
            }
          }
        } catch (e) {
          console.error('Error creating fallback profile:', e);
          setError('Failed to initialize user profile.');
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setCurrentUserId(null);
      setAppState(AppState.HOME);
      setActiveChatUserId(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleNavigate = (newState: AppState) => {
    setError(null);
    setAppState(newState);
  };

  const handleViewProfile = (userId: string) => {
    setViewingProfileId(userId);
    setAppState(AppState.PROFILE_VIEWING);
  };

  const handleFollowToggle = async (targetUserId: string) => {
    if (!currentUser) return;

    try {
      const result = await toggleFollow(currentUser.id, targetUserId);

      // Optimistic update or re-fetch
      // For simplicity, let's re-fetch users to get updated follower/following counts/arrays
      // But since our backend toggleFollow returns the action, we can manually update local state

      setUsers(currentUsers => {
        const newUsers = [...currentUsers];
        const currentUserIndex = newUsers.findIndex(u => u.id === currentUser.id);
        const targetUserIndex = newUsers.findIndex(u => u.id === targetUserId);

        if (currentUserIndex === -1 || targetUserIndex === -1) return currentUsers;

        const updatedCurrentUser = { ...newUsers[currentUserIndex] };
        const updatedTargetUser = { ...newUsers[targetUserIndex] };

        if (result.action === 'unfollowed') {
          updatedCurrentUser.following = updatedCurrentUser.following.filter(id => id !== targetUserId);
          updatedTargetUser.followers = updatedTargetUser.followers.filter(id => id !== currentUser.id);
        } else {
          updatedCurrentUser.following = [...updatedCurrentUser.following, targetUserId];
          updatedTargetUser.followers = [...updatedTargetUser.followers, currentUser.id];
        }

        newUsers[currentUserIndex] = updatedCurrentUser;
        newUsers[targetUserIndex] = updatedTargetUser;

        setCurrentUser(updatedCurrentUser);
        return newUsers;
      });
    } catch (e) {
      console.error('Error toggling follow:', e);
    }
  };

  const handleUpdateProfile = async (userId: string, newAboutMe: string) => {
    try {
      await updateUser(userId, { about_me: newAboutMe });

      setUsers(currentUsers => {
        const newUsers = currentUsers.map(user =>
          user.id === userId ? { ...user, aboutMe: newAboutMe } : user
        );

        if (currentUser && currentUser.id === userId) {
          setCurrentUser(newUsers.find(u => u.id === userId) || null);
        }

        return newUsers;
      });
    } catch (e) {
      console.error('Error updating profile:', e);
    }
  };

  const handleOpenChat = (userId: string) => {
    setActiveChatUserId(userId);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !activeChatUserId) return;

    try {
      const sentMsg = await sendMessage(currentUser.id, activeChatUserId, content);
      if (sentMsg) {
        setMessages(prevMessages => [...prevMessages, sentMsg as unknown as Message]);
      }
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments'>) => {
    if (!currentUser) return;

    try {
      const newPost = await createPost(currentUser.id, postData.title || '', postData.content);
      if (newPost) {
        // Re-fetch posts to get the full object with correct timestamp etc
        // Or just prepend locally
        const completePost: Post = {
          ...newPost,
          authorId: currentUser.id,
          likes: [],
          comments: [],
          type: 'TEXT' // Default for now as createPost is simple
        } as unknown as Post;

        setPosts(prevPosts => [completePost, ...prevPosts]);
        fetchData(); // Refresh to be sure
      }
    } catch (e) {
      console.error('Error creating post:', e);
    }
  };

  const handleLikeToggle = async (postId: number) => {
    if (!currentUser) return;

    try {
      const result = await togglePostLike(postId.toString(), currentUser.id);

      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.includes(currentUser.id);
            // If action was 'unliked', remove user. If 'liked', add user.
            // However, the result returns the new count, not the array.
            // We need to manually update the array for UI state.

            let newLikes = [...post.likes];
            if (result.action === 'unliked') {
              newLikes = newLikes.filter(id => id !== currentUser.id);
            } else {
              if (!newLikes.includes(currentUser.id)) {
                newLikes.push(currentUser.id);
              }
            }
            return { ...post, likes: newLikes };
          }
          return post;
        });
      });
    } catch (e) {
      console.error('Error toggling like:', e);
    }
  };

  const handleAddComment = async (postId: number, content: string) => {
    if (!currentUser) return;

    try {
      const newComment = await createComment(postId.toString(), currentUser.id, content);
      if (newComment) {
        setPosts(prevPosts => {
          return prevPosts.map(post => {
            if (post.id === postId) {
              return { ...post, comments: [...post.comments, newComment as unknown as Comment] };
            }
            return post;
          });
        });
      }
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  const handleStartMatching = useCallback(async (profile: UserProfile) => {
    setUserSessionProfile(profile);
    setAppState(AppState.SESSION_MATCHING);
    setMatchedUser(null);
    setError(null);
    try {
      const match = await generateMatch(profile);
      setMatchedUser(match);
      // The user will now click a button in Matching.tsx to proceed
    } catch (e) {
      setError('Failed to find a match. Please try again.');
      setAppState(AppState.SESSION_ONBOARDING);
      console.error(e);
    }
  }, []);

  const handleMatchAccepted = () => {
    if (matchedUser) {
      setAppState(AppState.SESSION_ACTIVE);
    }
  };

  const handleEndSession = useCallback(async () => {
    if (!userSessionProfile || !matchedUser) return;
    setAppState(AppState.SESSION_SUMMARY_LOADING);
    setError(null);
    try {
      const summary = await generateSessionSummary(userSessionProfile, matchedUser);
      setSessionSummary(summary);
      setAppState(AppState.SESSION_SUMMARY);
    } catch (e) {
      setError('Failed to generate session summary.');
      setAppState(AppState.SESSION_ACTIVE);
      console.error(e);
    }
  }, [userSessionProfile, matchedUser]);

  const handleRestartSessionFlow = () => {
    setAppState(AppState.DASHBOARD);
    setUserSessionProfile(null);
    setMatchedUser(null);
    setSessionSummary(null);
    setError(null);
  };

  const renderSessionFlow = () => {
    switch (appState) {
      case AppState.SESSION_ONBOARDING:
        return <Onboarding onStartMatching={handleStartMatching} onBack={() => setAppState(AppState.DASHBOARD)} error={error} />;
      case AppState.SESSION_MATCHING:
        return <Matching matchedUser={matchedUser} onStartSession={handleMatchAccepted} />;
      case AppState.SESSION_ACTIVE:
        if (userSessionProfile && matchedUser) {
          return <Session user={userSessionProfile} partner={matchedUser} onEndSession={handleEndSession} />;
        }
        handleRestartSessionFlow();
        return null;
      case AppState.SESSION_SUMMARY_LOADING:
        return <Matching isSummary={true} />;
      case AppState.SESSION_SUMMARY:
        if (sessionSummary) {
          return <Summary summary={sessionSummary} onRestart={handleRestartSessionFlow} />;
        }
        handleRestartSessionFlow();
        return null;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (isCheckingAuth) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!currentUser) {
      switch (appState) {
        case AppState.LOGIN:
          return <LoginPage onLogin={handleLogin} onNavigate={() => handleNavigate(AppState.HOME)} error={error} />;
        case AppState.HOME:
        default:
          return <HomePage onNavigate={() => handleNavigate(AppState.LOGIN)} />;
      }
    }

    const isSessionFlowActive = Object.values(AppState).some(s => s.startsWith('SESSION_') && s === appState);
    const viewingProfile = viewingProfileId ? users.find(u => u.id === viewingProfileId) : null;
    const activeChatPartner = activeChatUserId ? users.find(u => u.id === activeChatUserId) : null;
    const messagesForActiveChat = messages.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === activeChatUserId) ||
        (msg.senderId === activeChatUserId && msg.receiverId === currentUser.id)
    );

    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar currentUser={currentUser} onLogout={handleLogout} onViewProfile={handleViewProfile} />
        <main className="w-full max-w-7xl mx-auto pt-20 px-4">
          {appState === AppState.DASHBOARD && (
            <Dashboard
              currentUser={currentUser}
              users={users}
              posts={posts}
              onStartSession={() => handleNavigate(AppState.SESSION_ONBOARDING)}
              onViewProfile={handleViewProfile}
              onCreatePost={handleCreatePost}
              onLikeToggle={handleLikeToggle}
              onAddComment={handleAddComment}
            />
          )}
          {appState === AppState.PROFILE_VIEWING && viewingProfile && (
            <ProfilePage
              currentUser={currentUser}
              profileUser={viewingProfile}
              users={users}
              posts={posts}
              onFollowToggle={handleFollowToggle}
              onUpdateProfile={handleUpdateProfile}
              onOpenChat={handleOpenChat}
              onBack={() => setAppState(AppState.DASHBOARD)}
              onViewProfile={handleViewProfile}
              onLikeToggle={handleLikeToggle}
              onAddComment={handleAddComment}
            />
          )}
          {isSessionFlowActive && <div className="py-8">{renderSessionFlow()}</div>}
        </main>
        {activeChatPartner && (
          <ChatInterface
            currentUser={currentUser}
            chatPartner={activeChatPartner}
            messages={messagesForActiveChat}
            onSendMessage={handleSendMessage}
            onClose={() => setActiveChatUserId(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
