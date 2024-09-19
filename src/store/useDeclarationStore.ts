import { create } from 'zustand';
import { fetchDeclarationsApi, fetchDeclarationsDetailApi } from '@/api/postApi';

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

  updateApprovalStatus: (id: number, approved: boolean) => void;

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
  updateApprovalStatus: (id: number, approved: boolean) =>
    set(state => {
      const updatedDeclarations = state.declarations.map(declaration =>
        declaration.id === id ? { ...declaration, approved } : declaration,
      );
      return { declarations: updatedDeclarations };
    }),
}));

export default useDeclarationStore;
