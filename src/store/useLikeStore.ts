import { create } from 'zustand';

interface LikeState {
  likedPosts: number[];
  toggleLike: (postId: number) => void;
}

export const useLikeStore = create<LikeState>(set => ({
  likedPosts: [],
  toggleLike: (postId: number) => {
    set(state => {
      const isLiked = state.likedPosts.includes(postId);
      const updatedLikedPosts = isLiked
        ? state.likedPosts.filter(id => id !== postId) // 좋아요 취소
        : [...state.likedPosts, postId]; // 좋아요 유지

      return { likedPosts: updatedLikedPosts };
    });
  },
}));
