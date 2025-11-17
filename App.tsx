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
import { mockUsers, mockMessages, mockPosts } from './data/mockData';
import { getCurrentUser, signOut } from './services/supabaseService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Lifted data into state to allow for mutations
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [viewingProfileId, setViewingProfileId] = useState<number | null>(null);

  // Messaging state
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(user.id);
          // TODO: Load user from database table instead of mockUsers
          // For now, using first user as placeholder
          setCurrentUser(mockUsers[0]);
          setAppState(AppState.DASHBOARD);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('skillSyncMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages(mockMessages);
      }
    } catch (e) {
      console.error("Failed to load messages from localStorage", e);
      setMessages(mockMessages);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('skillSyncMessages', JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save messages to localStorage", e);
    }
  }, [messages]);

  // State for the session flow
  const [userSessionProfile, setUserSessionProfile] = useState<UserProfile | null>(null);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  const handleLogin = (email: string, userId: string) => {
    setCurrentUserId(userId);
    // Find user by email in mock data (TODO: replace with DB query)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setAppState(AppState.DASHBOARD);
      setError(null);
    } else {
      // Create a placeholder user if not found in mock data
      setCurrentUser({
        id: Math.random(),
        name: email.split('@')[0],
        email: email,
        country: 'Not specified',
        profilePicture: `https://i.pravatar.cc/150?u=${email}`,
        skills: [],
        bio: 'Welcome to SkillSync!',
        aboutMe: 'Welcome to SkillSync!',
        following: [],
        followers: [],
      });
      setAppState(AppState.DASHBOARD);
      setError(null);
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
  
  const handleViewProfile = (userId: number) => {
    setViewingProfileId(userId);
    setAppState(AppState.PROFILE_VIEWING);
  };
  
  const handleFollowToggle = (targetUserId: number) => {
    if (!currentUser) return;

    setUsers(currentUsers => {
        const newUsers = [...currentUsers];
        const currentUserIndex = newUsers.findIndex(u => u.id === currentUser.id);
        const targetUserIndex = newUsers.findIndex(u => u.id === targetUserId);

        if (currentUserIndex === -1 || targetUserIndex === -1) return currentUsers;

        const updatedCurrentUser = { ...newUsers[currentUserIndex] };
        const updatedTargetUser = { ...newUsers[targetUserIndex] };

        const isFollowing = updatedCurrentUser.following.includes(targetUserId);

        if (isFollowing) {
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
  };

  const handleUpdateProfile = (userId: number, newAboutMe: string) => {
    setUsers(currentUsers => {
      const newUsers = currentUsers.map(user => 
        user.id === userId ? { ...user, aboutMe: newAboutMe } : user
      );
      
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(newUsers.find(u => u.id === userId) || null);
      }
      
      return newUsers;
    });
  };

  const handleOpenChat = (userId: number) => {
    setActiveChatUserId(userId);
  };

  const handleSendMessage = (content: string) => {
    if (!currentUser || !activeChatUserId) return;
    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: activeChatUserId,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const handleCreatePost = (postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments'>) => {
    if (!currentUser) return;

    const newPost: Post = {
      ...postData,
      id: Date.now(),
      authorId: currentUser.id,
      timestamp: 'Just now',
      likes: [],
      comments: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleLikeToggle = (postId: number) => {
    if (!currentUser) return;
    
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id);
          if (isLiked) {
            return { ...post, likes: post.likes.filter(id => id !== currentUser.id) };
          } else {
            return { ...post, likes: [...post.likes, currentUser.id] };
          }
        }
        return post;
      });
    });
  };
  
  const handleAddComment = (postId: number, content: string) => {
      if (!currentUser) return;

      const newComment: Comment = {
          id: Date.now(),
          authorId: currentUser.id,
          content,
          timestamp: 'Just now',
      };
      
      setPosts(prevPosts => {
          return prevPosts.map(post => {
              if (post.id === postId) {
                  return { ...post, comments: [...post.comments, newComment] };
              }
              return post;
          });
      });
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