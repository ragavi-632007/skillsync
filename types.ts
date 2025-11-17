import { Type } from "@google/genai";

// New App States for routing
export enum AppState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PROFILE_VIEWING = 'PROFILE_VIEWING',
  SESSION_ONBOARDING = 'SESSION_ONBOARDING',
  SESSION_MATCHING = 'SESSION_MATCHING',
  SESSION_ACTIVE = 'SESSION_ACTIVE',
  SESSION_SUMMARY_LOADING = 'SESSION_SUMMARY_LOADING',
  SESSION_SUMMARY = 'SESSION_SUMMARY',
}

// --- NEW DATA MODELS ---
export interface User {
  id: number;
  name: string;
  email: string; // for login
  country: string;
  profilePicture: string; // URL
  skills: string[];
  bio: string;
  aboutMe: string; // New detailed biography field
  following: number[]; // array of user IDs
  followers: number[]; // array of user IDs
}

export type PostType = 'TEXT' | 'PHOTO' | 'VIDEO' | 'ARTICLE';

export interface Comment {
    id: number;
    authorId: number;
    content: string;
    timestamp: string;
}

export interface Post {
    id: number;
    authorId: number;
    type: PostType;
    content: string; // Caption or main text
    mediaUrl?: string; // For Photo or Video
    title?: string; // For Article
    likes: number[]; // Array of user IDs who liked
    comments: Comment[];
    timestamp: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

// --- ORIGINAL SESSION MODELS ---
export interface UserProfile {
  skillToOffer: string;
  skillToLearn:string;
}

export interface MatchedUser {
  name: string;
  country: string;
  skillToOffer: string;
  skillToLearn: string;
  personality: string;
  learningStyle: string;
  profilePicture: string;
}

export interface SessionSummary {
  score: number;
  summary: string;
  takeaway: string;
}

export interface AiCoachResponse {
  microLesson: {
    title: string;
    content: string;
    for: 'user' | 'partner';
  };
  activity: {
    title: string;
    description: string;
  };
  cultureBridge: {
    title: string;
    content: string;
  };
}

// Gemini Type Schemas
export const MatchedUserSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        country: { type: Type.STRING },
        skillToOffer: { type: Type.STRING },
        skillToLearn: { type: Type.STRING },
        personality: { type: Type.STRING },
        learningStyle: { type: Type.STRING },
        profilePicture: { type: Type.STRING, description: "A placeholder image URL from i.pravatar.cc" },
    },
    required: ['name', 'country', 'skillToOffer', 'skillToLearn', 'personality', 'learningStyle', 'profilePicture']
};

export const SessionSummarySchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        takeaway: { type: Type.STRING },
    },
    required: ['score', 'summary', 'takeaway']
};

export const AiCoachResponseSchema = {
    type: Type.OBJECT,
    properties: {
        microLesson: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                for: { type: Type.STRING, enum: ['user', 'partner'] }
            },
            required: ['title', 'content', 'for']
        },
        activity: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
            },
            required: ['title', 'description']
        },
        cultureBridge: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
            },
            required: ['title', 'content']
        }
    },
    required: ['microLesson', 'activity', 'cultureBridge']
};