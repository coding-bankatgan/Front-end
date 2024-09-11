import { create } from 'zustand';
import { fetchPostsApi } from './../api/postApi';

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
    imageUrl: string;
  };
  type: 'REVIEW' | 'ADVERTISEMENT';
  content: string;
  tags: Tag[];
  viewCount: number;
  createdAt: string;
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
      console.log('!!!!!!!!', data);
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ posts: [] });
    }
  },
}));
