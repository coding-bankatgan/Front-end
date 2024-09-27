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
    type: string;
    degree: number;
    sweetness: number;
    cost: number;
    averageRating: number;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
  type: 'AD' | 'REVIEW';
  content: string;
  rating: number;
  tags: Tag[];
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

export interface PostsState {
  postsDetail: PostDetail | null;
  setPostsDetail: (postsDetail: PostDetail) => void;
  fetchPostsDetail: (postId: number) => Promise<void>;
}

export const usePostsDetailStore = create<PostsState>(set => ({
  postsDetail: null,
  setPostsDetail: (postsDetail: PostDetail) => set({ postsDetail }),
  fetchPostsDetail: async postId => {
    try {
      const data = await fetchPostsDetailApi(postId);
      set({ postsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ postsDetail: null });
    }
  },
}));
