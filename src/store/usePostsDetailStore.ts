import { create } from 'zustand';
import { fetchPostsDetailApi } from '../api/postApi';

interface Tag {
  tagId: number;
  tagName: string;
}

export interface PostDetail {
  id: number;
  memberId: number;
  memberName: string;
  drink: {
    id: number;
    placeName: string;
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
  postsDetail: PostDetail[];
  setPostsDetail: (postsDetail: PostDetail[]) => void;
  fetchPostsDetail: (postId: number) => Promise<void>;
}

export const usePostsDetailStore = create<PostsState>(set => ({
  postsDetail: [],
  setPostsDetail: postsDetail => set({ postsDetail }),
  fetchPostsDetail: async postId => {
    try {
      const data = await fetchPostsDetailApi(postId);
      set({ postsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ postsDetail: [] });
    }
  },
}));
