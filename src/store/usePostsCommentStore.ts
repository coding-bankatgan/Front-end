import { fetchCommentsApi } from '@/api/postApi';
import { create } from 'zustand';

interface Content {
  id: number;
  memberId: number;
  memberName: string;
  postId: number;
  content: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface PagenationInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CommentState {
  comments: Content[];
  pagination: PagenationInfo;
  setComments: (comments: Content[], pagination: PagenationInfo) => void;
  fetchComments: (postId: number, page: number, size: number) => Promise<void>;
}

export const usePostsCommentStore = create<CommentState>(set => ({
  comments: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
  },
  setComments: (comments, pagination) => set({ comments, pagination }),
  fetchComments: async (postId, page, size) => {
    try {
      const data = await fetchCommentsApi(postId, page, size);

      if (data && data.content) {
        set({
          comments: data.content,
          pagination: {
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            size: size,
            number: page,
          },
        });
      } else {
        set({ comments: [] });
      }
    } catch (err) {
      console.error('Error fetching comments: ', err);
      set({ comments: [] });
    }
  },
}));
