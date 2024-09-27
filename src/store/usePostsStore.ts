import { create } from 'zustand';
import { fetchPostsApi } from '../api/postApi';

interface Tag {
  tagId: number;
  tagName: string;
}

interface Drink {
  id: number;
  placeName: string;
  name: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  averageRating: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface Post {
  id: number;
  memberId: number;
  memberName: string;
  drink: Drink;
  type: 'REVIEW' | 'AD';
  content: string;
  rating: number;
  tags: Tag[];
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  fetchPosts: (sortBy: string, page?: number, size?: number) => Promise<void>;
}

export const usePostsStore = create<PostsState>(set => ({
  posts: [],
  setPosts: posts => set({ posts }),
  fetchPosts: async (sortBy = 'createdAt', page = 0, size = 10) => {
    try {
      const data = await fetchPostsApi(sortBy, page, size);
      set({ posts: data.content });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ posts: [] });
    }
  },
}));
