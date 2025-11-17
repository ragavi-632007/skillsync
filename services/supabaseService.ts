import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // data may contain { user, session } or only user depending on project settings
    return { success: true, user: (data as any)?.user ?? (data as any) };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, user: (data as any)?.user ?? (data as any) };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Database functions
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user by id error:', error);
    throw error;
  }
};

export const updateUser = async (id: string, updates: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
};

export const createPost = async (authorId: string, title: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ author_id: authorId, title, content }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

export const getMessages = async (userId1: string, userId2: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

// Insert helpers
export const addMedia = async (postId: string, url: string, mediaType?: string, kind: 'PHOTO' | 'VIDEO' | 'OTHER' = 'OTHER') => {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert([{ post_id: postId, url, media_type: mediaType, kind }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Add media error:', error);
    throw error;
  }
};

export const createComment = async (postId: string, authorId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, author_id: authorId, content }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create comment error:', error);
    throw error;
  }
};

export const togglePostLike = async (postId: string, userId: string) => {
  try {
    const { data: existing } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      const { data: countData, error: cntErr } = await supabase
        .from('post_likes')
        .select('count', { count: 'exact' })
        .eq('post_id', postId);
      return { action: 'unliked', like_count: Array.isArray(countData) ? countData.length : null };
    } else {
      const { data, error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      const { data: countData } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId);
      return { action: 'liked', like_count: Array.isArray(countData) ? countData.length : null, data };
    }
  } catch (error) {
    console.error('Toggle post like error:', error);
    throw error;
  }
};

export const toggleFollow = async (followerId: string, targetId: string) => {
  try {
    const { data: existing } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', targetId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', targetId);
      if (error) throw error;
      return { action: 'unfollowed' };
    } else {
      const { data, error } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: targetId }])
        .select()
        .single();
      if (error) throw error;
      return { action: 'followed', data };
    }
  } catch (error) {
    console.error('Toggle follow error:', error);
    throw error;
  }
};

export const createUserProfile = async (email: string, name: string) => {
  const user = await getCurrentUser();
  if (user) {
    await supabase.from('users').insert([
      { id: user.id, email, name }
    ]);
  }
};
