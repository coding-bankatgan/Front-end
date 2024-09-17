import { create } from 'zustand';
import { fetchRegistrationsApi, fetchRegistrationsDetailApi } from '@/api/postApi';

interface Registration {
  registId: number;
  memberId: number;
  memberName: string;
  placeName: string;
  drinkName: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  approved: 'true' | 'false' | null;
}

interface RegistrationState {
  registrations: Registration[];
  registrationsDetail: Registration[];

  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  setPagination: (pagination: RegistrationState['pagination']) => void;

  setRegistrations: (registrations: Registration[]) => void;
  addRegistration: (
    registration: Omit<
      Registration,
      'registId' | 'memberId' | 'memberName' | 'createdAt' | 'approved'
    >,
  ) => void;

  updateApprovalStatus: (registId: number, approved: 'true' | 'false') => void;

  fetchRegistrations: (page: number, size: number) => Promise<void>;
  fetchRegistrationsDetail: (registId: number) => Promise<void>;
}

const useRegistrationStore = create<RegistrationState>(set => ({
  registrations: [],
  registrationsDetail: [],
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  setRegistrations: registrations => set({ registrations }),
  setPagination: pagination => set({ pagination }),
  fetchRegistrations: async (page: number, size: number) => {
    try {
      const data = await fetchRegistrationsApi(page, size);
      if (data) {
        set({ registrations: data.content });
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
        registrations: [],
        pagination: { totalElements: 0, totalPages: 0, size: 10, number: 0 },
      });
    }
  },
  fetchRegistrationsDetail: async registId => {
    try {
      const data = await fetchRegistrationsDetailApi(registId);
      set({ registrationsDetail: data });
    } catch (err) {
      console.error('Error fetching posts: ', err);
      set({ registrationsDetail: [] });
    }
  },

  addRegistration: registration => {
    let newRegistId;
    set(state => {
      const newRegistration: Registration = {
        memberId: 1,
        memberName: 'test',
        registId: state.registrations.length + 1, // 임시 ID 생성, 실제 구현에서는 서버에서 반환된 ID 사용
        createdAt: new Date().toISOString(), // 현재 시간 설정
        approved: null, // 초기 승인 상태는 null
        ...registration,
      };

      newRegistId = newRegistration.registId;
      console.log('uuuuuuuu', newRegistration);

      return {
        registrations: [...state.registrations, newRegistration],
      };
    });

    return newRegistId;
  },

  updateApprovalStatus: (registId: number, approved: 'true' | 'false') =>
    set(state => {
      const updatedRegistrations = state.registrations.map(registration =>
        registration.registId === registId ? { ...registration, approved } : registration,
      );
      return { registrations: updatedRegistrations };
    }),
}));

export default useRegistrationStore;
