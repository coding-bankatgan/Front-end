import { create } from 'zustand';
import { fetchPostLikeApi, fetchPostsApi, fetchPostsDetailApi } from '../api/postApi';

export interface Tag {
  tagId: number;
  tagName: string;
}

export interface Drink {
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

/** 전체 게시글 */
export interface Post {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl: string;
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

/** 특정 게시글 (상세페이지) */
export interface PostDetail {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl: string;
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
  // 전체 게시글
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  fetchPosts: (sortBy: string, page?: number, size?: number) => Promise<void>;
  // 특정 게시글
  postsDetail: PostDetail | null;
  setPostsDetail: (postsDetail: PostDetail) => void;
  fetchPostsDetail: (postId: number) => Promise<void>;
  // 좋아요 토글
  togglePostLike: (postId: number, currentIsLiked: boolean) => Promise<void>;
  clearPosts: () => void;
  clearPostsDetail: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  // 전체 게시글
  posts: [],
  setPosts: posts => set({ posts }),
  fetchPosts: async (sortBy = 'createdAt', page = 0, size = 10) => {
    try {
      const data = await fetchPostsApi(sortBy, page, size);
      console.log(data);

      if (data.totalPages < page) {
        throw new Error('Max Page');
      }

      set(state => {
        const updatedPosts = page > 0 ? [...state.posts, ...data.content] : data.content;

        // 중복 포스트 제거
        const uniquePosts = Array.from(new Set(updatedPosts.map((post: Post) => post.id))).map(id =>
          updatedPosts.find((post: Post) => post.id === id),
        );

        return {
          posts: uniquePosts.map((newPost: Post) => {
            const existingPost = state.posts.find(p => p.id === newPost.id);
            return existingPost
              ? { ...newPost, isLiked: existingPost.isLiked } // 기존 좋아요 상태 유지
              : newPost;
          }),
        };
      });
    } catch (err) {
      throw new Error('Max Page');
    }
  },
  // 특정 게시글
  postsDetail: null,
  setPostsDetail: (postsDetail: PostDetail) => set({ postsDetail }),
  fetchPostsDetail: async postId => {
    try {
      const data = await fetchPostsDetailApi(postId);
      set(state => ({
        postsDetail: {
          ...data,
          isLiked: state.postsDetail?.isLiked ?? data.isLiked, // 기존 좋아요 상태 유지 또는 API 데이터 사용
        },
        posts: state.posts.map(p =>
          p.id === postId
            ? { ...p, isLiked: state.postsDetail?.isLiked ?? data.isLiked } // 전체 게시글에서도 좋아요 상태 업데이트
            : p,
        ),
      }));
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ postsDetail: null });
    }
  },
  // 좋아요 토글
  togglePostLike: async (postId: number) => {
    const post = get().posts.find(p => p.id === postId); // get()으로 상태 가져오기
    if (!post) return;

    const newIsLiked = !post.isLiked;

    try {
      await fetchPostLikeApi(postId);

      set(state => ({
        posts: state.posts.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: newIsLiked,
                likeCount: newIsLiked ? post.likeCount + 1 : post.likeCount - 1,
              }
            : p,
        ),
        postsDetail:
          state.postsDetail && state.postsDetail.id === postId
            ? {
                ...state.postsDetail,
                isLiked: newIsLiked,
                likeCount: newIsLiked
                  ? state.postsDetail.likeCount + 1
                  : state.postsDetail.likeCount - 1,
              }
            : state.postsDetail,
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  },
  clearPosts: () => set({ posts: [] }),
  clearPostsDetail: () => set({ postsDetail: null }),
}));
