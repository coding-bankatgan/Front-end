import { create } from 'zustand';
import { fetchDeclarationsApi, fetchDeclarationsDetailApi } from '@/api/postApi';
import useNotificationStore from '@/store/useNotificationStore';

export interface Declaration {
  id: number;
  memberId: number;
  memberName: string;
  link: string;
  type: string;
  content: string;
  approved: true | false | null;
  createdAt: string;
}

export interface DeclarationState {
  declarations: Declaration[];
  declarationsDetail: Declaration[];

  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  setPagination: (pagination: DeclarationState['pagination']) => void;

  updateApprovalStatus: (id: number, approved: boolean, rejectReason?: string | null) => void;

  setDeclarations: (declaration: Declaration[]) => void;
  fetchDeclarations: (page: number, size: number) => Promise<void>;
  fetchDeclarationsDetail: (id: number) => Promise<void>;
}

const useDeclarationStore = create<DeclarationState>(set => ({
  declarations: [],
  declarationsDetail: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  setPagination: pagination => set({ pagination }),
  setDeclarations: declarations => set({ declarations }),
  fetchDeclarations: async (page: number, size: number) => {
    try {
      const data = await fetchDeclarationsApi(page, size);
      if (data) {
        set({ declarations: data.content });
        set({
          pagination: {
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            size: size,
            number: page,
          },
        });
      }
    } catch (err) {
      set({
        declarations: [],
        pagination: { totalElements: 0, totalPages: 0, size: 10, number: 0 },
      });
    }
  },
  fetchDeclarationsDetail: async id => {
    try {
      const data = await fetchDeclarationsDetailApi(id);
      set({ declarationsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ declarationsDetail: [] });
    }
  },
  updateApprovalStatus: async (id: number, approved: boolean, rejectReason?: string | null) =>
    set(state => {
      const updatedDeclarations = state.declarations.map(declaration =>
        declaration.id === id ? { ...declaration, approved } : declaration,
      );

      const declaration = updatedDeclarations.find(decl => decl.id === id);
      const { type, content } = declaration || {};

      if (declaration) {
        const { addNewNotification } = useNotificationStore.getState();
        console.log(declaration.memberId);

        if (approved) {
          // 신고 승인 시
          addNewNotification({
            id: Date.now(), // 변경 필요
            memberId: declaration.memberId,
            postId: null,
            type: 'DECLARATION',
            content: '신고 요청이 승인되어 게시글 삭제되었습니다.',
            createdAt: new Date().toISOString(),
            isNew: true,
          });

          addNewNotification({
            id: Date.now() + 1,
            memberId: 0, // 신고 당한 사람의 ID (수정 필요)
            postId: null,
            type: 'REMOVED',
            content: `${type} 사유로 인한 ${content}의 문제로 게시글이 삭제 처리되었습니다.`,
            createdAt: new Date().toISOString(),
            isNew: true,
          });
        } else {
          // 신고 반려 시
          const rejectionMessage = rejectReason
            ? `신고 요청이 반려되었습니다. \n 반려 사유: ${rejectReason}`
            : '신고 요청이 반려되었습니다.';
          addNewNotification({
            id: Date.now(),
            memberId: declaration.memberId,
            postId: null,
            type: 'DECLARATION',
            content: rejectionMessage,
            createdAt: new Date().toISOString(),
            isNew: true,
          });
        }
      }

      return { declarations: updatedDeclarations };
    }),
}));

export default useDeclarationStore;
