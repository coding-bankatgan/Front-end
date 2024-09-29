import { create } from 'zustand';
import { fetchPostLikeApi, fetchPostsDetailApi } from '../api/postApi';
import { Drink } from './usePostsStore';
import { Tag } from '@/types/tag';

export interface PostDetail {
  id: number;
  memberId: number;
  memberName: string;
  drink: Drink;
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
  togglePostLike: (postId: number, currentIsLiked: boolean) => Promise<void>;
}

export const usePostsDetailStore = create<PostsState>(set => ({
  postsDetail: null,
  setPostsDetail: (postsDetail: PostDetail) => set({ postsDetail }),
  fetchPostsDetail: async postId => {
    try {
      const data = await fetchPostsDetailApi(postId);
      console.log('데잍티티티티티티팉', data);
      set({ postsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ postsDetail: null });
    }
  },

  togglePostLike: async (postId: number, currentIsLiked: boolean) => {
    try {
      const newIsLiked = !currentIsLiked;

      // 서버로 좋아요 상태 전송
      await fetchPostLikeApi(postId);

      // 상태 업데이트
      set(state => {
        if (state.postsDetail && state.postsDetail.id === postId) {
          return {
            postsDetail: {
              ...state.postsDetail,
              isLiked: newIsLiked,
              likeCount: newIsLiked
                ? state.postsDetail.likeCount + 1
                : state.postsDetail.likeCount - 1,
            },
          };
        }
        return state;
      });
    } catch (error) {
      console.error('Error toggling like in post detail:', error);
    }
  },
}));
