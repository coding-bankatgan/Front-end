import { create } from 'zustand';
import { fetchPostsApi } from '../api/postApi';

interface Tag {
  tagId: number;
  tagName: string;
}

export interface Post {
  id: number;
  memberId: number;
  memberName: string;
  drink: {
    id: number;
    name: string;
    drinkType: string;
    degree: number;
    sweetness: number;
    cost: number;
    averageRating: number;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
  type: 'REVIEW' | 'ADVERTISEMENT';
  content: string;
  rating: number;
  tags: Tag[];
  imageUrl: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  fetchPosts: () => Promise<void>;
}

export const usePostsStore = create<PostsState>(set => ({
  posts: [],
  setPosts: posts => set({ posts }),
  fetchPosts: async () => {
    try {
      const data = await fetchPostsApi();
      set({ posts: data });
      // console.log('!!!!!!!!', data);
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ posts: [] });
    }
  },
}));
