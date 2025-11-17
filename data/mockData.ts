import { User, Post, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    country: 'USA',
    profilePicture: 'https://i.pravatar.cc/150?u=jane',
    skills: ['React', 'UI/UX Design', 'Project Management'],
    bio: 'Frontend developer passionate about creating beautiful and intuitive user experiences.',
    aboutMe: 'Hi, I\'m Jane! I\'ve been a frontend developer for over 5 years, specializing in React and modern web design. I love breaking down complex topics into simple, understandable concepts. When I\'m not coding, I enjoy hiking and exploring new coffee shops. I\'m excited to help someone with their React journey and maybe learn a new skill in return!',
    following: [2, 3],
    followers: [2],
  },
  {
    id: 2,
    name: 'Kenji Tanaka',
    email: 'kenji@example.com',
    country: 'Japan',
    profilePicture: 'https://i.pravatar.cc/150?u=kenji',
    skills: ['Python', 'Data Science', 'Japanese Calligraphy'],
    bio: 'Data scientist by day, artist by night. Exploring the intersection of technology and creativity.',
    aboutMe: 'Hello! My name is Kenji. I work as a data scientist, using Python to find stories within numbers. In my free time, I practice traditional Japanese calligraphy (Shodo), which teaches me patience and precision. I can offer guidance in data analysis or Python, and I am very interested in learning about photography from a fellow enthusiast.',
    following: [1],
    followers: [1, 3],
  },
  {
    id: 3,
    name: 'Maria Garcia',
    email: 'maria@example.com',
    country: 'Spain',
    profilePicture: 'https://i.pravatar.cc/150?u=maria',
    skills: ['Conversational Spanish', 'Photography', 'Graphic Design'],
    bio: 'Photographer and language enthusiast. I believe the best way to learn is by connecting with others.',
    aboutMe: '¡Hola! I\'m Maria, a freelance photographer and designer from sunny Spain. I love meeting new people and learning about different cultures. I can help you practice your Spanish in a relaxed, conversational setting, or share my knowledge of photography fundamentals. I\'m currently hoping to improve my project management skills for my freelance work.',
    following: [2],
    followers: [1],
  },
];

export const mockPosts: Post[] = [
    {
        id: 1,
        authorId: 2,
        type: 'PHOTO',
        content: 'Just finished a fascinating data visualization project on global weather patterns. Python and Matplotlib are such a powerful combo! #DataScience #Python',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=870',
        likes: [1, 3],
        comments: [
            { id: 1, authorId: 1, content: 'This looks amazing, Kenji!', timestamp: '2 hours ago'},
            { id: 2, authorId: 3, content: 'Wow, great work!', timestamp: '1 hour ago'},
        ],
        timestamp: '3 hours ago',
    },
    {
        id: 2,
        authorId: 3,
        type: 'PHOTO',
        content: 'Captured this beautiful sunset in Valencia today. Photography is all about patience and light. What skill are you practicing this week?',
        mediaUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1032',
        likes: [1, 2],
        comments: [],
        timestamp: '1 day ago',
    },
    {
        id: 3,
        authorId: 1,
        type: 'TEXT',
        content: 'Working on a new component library in React. It\'s amazing how you can build complex UIs from simple, reusable pieces. Anyone have tips on state management for highly dynamic components? #ReactJS #WebDev',
        likes: [2, 3],
        comments: [],
        timestamp: '2 days ago',
    },
    {
        id: 4,
        authorId: 2,
        type: 'VIDEO',
        content: 'A short video from my calligraphy practice today. The character is "Michi" (道), meaning path or way. #Shodo #Calligraphy',
        mediaUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        likes: [3],
        comments: [],
        timestamp: '3 days ago',
    }
];

export const mockMessages: Message[] = [
    {
        id: 1,
        senderId: 1,
        receiverId: 2,
        content: 'Hey Kenji, I saw your post on data visualization. Super cool! I\'d love to learn some Python basics.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: 2,
        senderId: 2,
        receiverId: 1,
        content: 'Hi Jane! Thanks, I\'d be happy to help. I was just admiring your React work. Maybe we can do a skill exchange?',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
];